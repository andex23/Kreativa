# Supabase Database Setup

## Files

- `schema.sql` - Initial database schema with tables and RLS setup
- `production-rls.sql` - Production-ready RLS policies (CURRENT/ACTIVE)
- `client.ts` - Supabase client configuration
- `types.ts` - TypeScript types for database tables

## Production RLS Policies

The production RLS policies enforce the following security rules:

### Profiles Table
- **Public INSERT**: Anyone can submit profiles (they start as 'pending')
- **Public SELECT**: Only approved profiles are visible to the public
- **Admin Access**: Service role can perform all operations (view/update/delete all profiles)

### Social Links Table
- **Public INSERT**: Anyone can add social links when submitting a profile
- **Public SELECT**: Only social links for approved profiles are visible
- **Admin Access**: Service role has full access

### Admin Users Table
- **Service Role Only**: Only admin operations can access this table
- **Public Access**: Completely blocked for security

### Submission Logs Table
- **Public INSERT**: Submissions can be logged
- **Public SELECT**: Blocked (logs are admin-only)
- **Admin Access**: Service role can view all logs

## Applying Policies

To apply the production RLS policies:

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy the contents of `production-rls.sql`
4. Paste and run the SQL

## Testing

Visit `/test-db` to verify:
- Public users can insert profiles (pending status)
- Public users can only see approved profiles
- Admin tables are protected
- Service role has full access

## Client Usage

```typescript
// Client-side (public access)
import { supabase } from '@/lib/supabase/client';

// Server-side (admin access)
import { createServerClient } from '@/lib/supabase/client';
const adminClient = createServerClient();
```

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Security Notes

- The anon key is safe to expose in client-side code (RLS protects data)
- Never expose the service role key in client-side code
- Use service role only in server-side API routes
- Pending profiles are hidden from public view until approved by admin
