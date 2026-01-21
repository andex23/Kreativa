/**
 * CSRF Protection Utilities
 *
 * Note: Next.js Server Actions have built-in CSRF protection via origin checking.
 * This utility provides additional token-based protection for forms.
 */

import { randomBytes } from 'crypto';

const CSRF_TOKEN_LENGTH = 32;
const CSRF_TOKEN_HEADER = 'x-csrf-token';
const CSRF_COOKIE_NAME = 'csrf_token';

/**
 * Generate a CSRF token
 */
export function generateCSRFToken(): string {
    return randomBytes(CSRF_TOKEN_LENGTH).toString('hex');
}

/**
 * Verify CSRF token from request
 *
 * In Next.js App Router, Server Actions automatically verify:
 * - Origin header matches host
 * - Request comes from same origin
 *
 * This function provides additional explicit token verification if needed.
 */
export function verifyCSRFToken(token: string, expectedToken: string): boolean {
    if (!token || !expectedToken) {
        return false;
    }

    // Constant-time comparison to prevent timing attacks
    if (token.length !== expectedToken.length) {
        return false;
    }

    let result = 0;
    for (let i = 0; i < token.length; i++) {
        result |= token.charCodeAt(i) ^ expectedToken.charCodeAt(i);
    }

    return result === 0;
}

/**
 * Get CSRF token from cookies
 * Note: In production, use secure, httpOnly cookies
 */
export function getCSRFTokenFromCookies(cookies: string): string | null {
    const match = cookies.match(new RegExp(`${CSRF_COOKIE_NAME}=([^;]+)`));
    return match ? match[1] : null;
}

/**
 * Next.js Server Actions have built-in CSRF protection.
 * This is a note for reference - no additional CSRF tokens needed for Server Actions.
 *
 * Next.js validates:
 * 1. Origin header matches the request URL
 * 2. POST requests must include proper headers
 * 3. Actions can only be called from same-origin
 */
export const NEXT_JS_SERVER_ACTION_CSRF_INFO = `
Next.js Server Actions include built-in CSRF protection:
- Origin checking is performed automatically
- Actions must be called from the same origin
- POST requests require proper Content-Type headers

For additional security:
- Use the requireAdmin() check in all admin actions
- Validate all inputs with validation.ts utilities
- Implement rate limiting with rate-limit.ts
` as const;
