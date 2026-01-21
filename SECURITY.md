# Security Implementation Guide

## Overview

This document outlines the security measures implemented in the Kreativa application and provides guidance for maintaining security best practices.

## Security Features Implemented

### 1. Authentication & Authorization

#### Server-Side Authentication (`/src/lib/auth.ts`)
- **Supabase Auth Integration**: Proper server-side user authentication
- **Admin Authorization Checks**: `requireAdmin()` validates admin access before operations
- **Session Validation**: Server-side session verification
- **User Context**: `getAdminUser()` provides authenticated user context for audit logs

**Usage:**
```typescript
import { requireAdmin } from '@/lib/auth';

export async function adminAction() {
    await requireAdmin(); // Throws error if not admin
    // Proceed with admin operation
}
```

### 2. Input Validation (`/src/lib/validation.ts`)

All user inputs are validated before processing:

- **Profile IDs**: UUID format validation
- **Email Addresses**: Format and length validation
- **Social Media Handles**: Character restrictions and length limits
- **Categories & Locations**: Enum validation against allowed values
- **Bio & Names**: Length constraints and sanitization
- **Bulk Operations**: Array validation with size limits (max 100 items)

**Usage:**
```typescript
import { validateProfileId, validateEmail } from '@/lib/validation';

const result = validateEmail(email);
if (!result.valid) {
    return { error: result.errors.join(', ') };
}
```

### 3. Rate Limiting (`/src/lib/rate-limit.ts`)

Prevents API abuse with configurable rate limits:

| Operation | Limit | Window |
|-----------|-------|--------|
| Admin Actions | 100 requests | 1 minute |
| Social Stats | 30 requests | 1 minute |
| Profile Submission | 5 requests | 1 hour |
| AI Categorization | 10 requests | 1 minute |
| Login Attempts | 5 requests | 15 minutes |

**Usage:**
```typescript
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';

const identifier = await getRateLimitIdentifier('operation');
checkRateLimit(identifier, RATE_LIMITS.ADMIN);
```

### 4. Row-Level Security (RLS)

Database-level security policies (`/src/lib/supabase/schema.sql`):

#### Profiles Table
- ✅ Public can READ approved profiles only
- ✅ Anyone can INSERT with `pending` status
- ✅ Only service role can UPDATE profiles
- ✅ Only service role can DELETE profiles

#### Admin Users Table
- ✅ Only authenticated admins can READ
- ✅ Only service role can INSERT/UPDATE/DELETE
- ✅ Prevents unauthorized admin creation

#### Submission Logs Table
- ✅ Only service role can READ/INSERT
- ✅ Immutable audit trail (limited updates)

### 5. Audit Logging

All admin actions are logged to `submission_logs` table:

```typescript
await logAuditAction('approve_profile', { profileId: id }, user.id);
```

Logged actions include:
- Profile approvals/rejections
- Profile updates/deletions
- Bulk operations
- Status changes

### 6. CSRF Protection (`/src/lib/csrf.ts`)

**Built-in Protection:**
- Next.js Server Actions include automatic CSRF protection
- Origin header validation
- Same-origin policy enforcement

**Additional Measures:**
- Token generation utilities available if needed
- Constant-time comparison prevents timing attacks

### 7. Environment Variable Management (`/src/lib/env.ts`)

- Type-safe environment variable access
- Validation on application startup (production only)
- Clear error messages for missing variables
- Separation of required vs optional variables

**Required Variables:**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

**Optional Variables:**
```env
RAPID_API_KEY=your_rapidapi_key
GEMINI_API_KEY=your_gemini_key
```

### 8. Pagination

Admin profile fetching includes pagination to prevent:
- Memory exhaustion
- Slow queries
- DoS vulnerabilities

```typescript
await fetchAdminProfiles(page, limit); // max 100 items per page
```

## Security Checklist for Deployment

### Before Going to Production:

- [ ] Set up proper Supabase Auth with real authentication
- [ ] Remove any hardcoded credentials
- [ ] Enable HTTPS/SSL certificates
- [ ] Set up proper admin user accounts in database
- [ ] Configure secure session management
- [ ] Set up environment variables in production
- [ ] Run database RLS policy updates (from schema.sql)
- [ ] Enable database backups
- [ ] Set up monitoring and alerting
- [ ] Review and test all rate limits
- [ ] Configure CORS policies
- [ ] Set up API key rotation schedule
- [ ] Enable database query logging
- [ ] Configure firewall rules
- [ ] Set up WAF (Web Application Firewall) if available

### Environment Security:

1. **Never commit `.env.local` files to version control**
2. **Rotate API keys regularly** (every 90 days minimum)
3. **Use different keys for development/production**
4. **Store secrets in secure vault** (e.g., Vercel Secrets, AWS Secrets Manager)
5. **Enable 2FA for admin accounts**

### Database Security:

1. **Review RLS policies regularly**
2. **Monitor failed authentication attempts**
3. **Enable database audit logging**
4. **Implement regular backups**
5. **Use read replicas for analytics queries**

### Application Security:

1. **Keep dependencies updated** (`npm audit fix`)
2. **Monitor security advisories**
3. **Implement Content Security Policy (CSP)**
4. **Add security headers** (HSTS, X-Frame-Options, etc.)
5. **Regular penetration testing**

## API Security Best Practices

### RapidAPI Integration

```typescript
// ❌ DON'T: Expose API keys in client code
const apiKey = 'your-key-here';

// ✅ DO: Use server-side actions with environment variables
const apiKey = env.rapidApiKey;
```

### Timeout Configuration

Add timeouts to all external API calls:

```typescript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000);

try {
    const response = await fetch(url, {
        signal: controller.signal,
        // ... other options
    });
} finally {
    clearTimeout(timeoutId);
}
```

## Error Handling

### Safe Error Messages

```typescript
// ❌ DON'T: Expose internal details
catch (error) {
    return { error: error.message }; // May leak sensitive info
}

// ✅ DO: Use generic messages
catch (error) {
    console.error('Internal error:', error); // Log internally
    return { error: 'Operation failed. Please try again.' };
}
```

## Monitoring & Alerting

### Recommended Monitoring:

1. **Failed Authentication Attempts**: Alert after 10 failed attempts
2. **Rate Limit Hits**: Monitor for abuse patterns
3. **Database Query Performance**: Alert on slow queries
4. **API Error Rates**: Monitor external API failures
5. **Unusual Admin Activity**: Alert on bulk operations

### Logging Best Practices:

```typescript
// Log structure should include:
{
    timestamp: new Date().toISOString(),
    action: 'profile_approved',
    userId: user.id,
    profileId: profile.id,
    ipAddress: request.ip, // If available
    userAgent: request.headers['user-agent']
}
```

## Incident Response Plan

### If Security Breach Detected:

1. **Immediately revoke compromised credentials**
2. **Review audit logs for unauthorized access**
3. **Notify affected users if data exposed**
4. **Rotate all API keys and secrets**
5. **Review and update RLS policies**
6. **Conduct post-incident analysis**
7. **Update security measures**

## Regular Security Tasks

### Weekly:
- Review audit logs for suspicious activity
- Check for failed authentication attempts

### Monthly:
- Review and test rate limiting
- Update dependencies (`npm audit`)
- Review RLS policies

### Quarterly:
- Rotate API keys
- Security code review
- Penetration testing
- Update security documentation

### Annually:
- Comprehensive security audit
- Disaster recovery testing
- Update incident response plan

## Contact & Reporting

For security issues or questions:
- **Email**: security@kreativa.ng
- **Never post security issues in public GitHub issues**
- **Use responsible disclosure practices**

## References

- [Supabase Security Guide](https://supabase.com/docs/guides/auth)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [RLS Policies Documentation](https://supabase.com/docs/guides/auth/row-level-security)

---

**Last Updated**: 2026-01-21
**Version**: 1.0.0
