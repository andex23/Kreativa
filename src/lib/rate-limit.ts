/**
 * Rate limiting utility using in-memory store
 * For production, consider using Redis or a persistent store
 */

interface RateLimitEntry {
    count: number;
    resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
        if (entry.resetAt < now) {
            rateLimitStore.delete(key);
        }
    }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
    maxRequests: number;
    windowMs: number;
}

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetAt: number;
}

export function rateLimit(
    identifier: string,
    config: RateLimitConfig
): RateLimitResult {
    const now = Date.now();
    const entry = rateLimitStore.get(identifier);

    // No entry or expired entry
    if (!entry || entry.resetAt < now) {
        const newEntry: RateLimitEntry = {
            count: 1,
            resetAt: now + config.windowMs
        };
        rateLimitStore.set(identifier, newEntry);

        return {
            allowed: true,
            remaining: config.maxRequests - 1,
            resetAt: newEntry.resetAt
        };
    }

    // Entry exists and not expired
    if (entry.count < config.maxRequests) {
        entry.count++;
        rateLimitStore.set(identifier, entry);

        return {
            allowed: true,
            remaining: config.maxRequests - entry.count,
            resetAt: entry.resetAt
        };
    }

    // Rate limit exceeded
    return {
        allowed: false,
        remaining: 0,
        resetAt: entry.resetAt
    };
}

/**
 * Default rate limit configs
 */
export const RATE_LIMITS = {
    // Admin actions: 100 requests per minute
    ADMIN: {
        maxRequests: 100,
        windowMs: 60 * 1000
    },
    // Social stats: 30 requests per minute
    SOCIAL_STATS: {
        maxRequests: 30,
        windowMs: 60 * 1000
    },
    // Profile submission: 5 per hour
    SUBMISSION: {
        maxRequests: 5,
        windowMs: 60 * 60 * 1000
    },
    // AI categorization: 10 per minute
    AI_CATEGORIZE: {
        maxRequests: 10,
        windowMs: 60 * 1000
    },
    // Login attempts: 5 per 15 minutes
    LOGIN: {
        maxRequests: 5,
        windowMs: 15 * 60 * 1000
    }
};

/**
 * Helper to get identifier for rate limiting
 */
export async function getRateLimitIdentifier(type: string): Promise<string> {
    // In production, use user ID or IP address
    // For now, use a simple approach
    try {
        // You can integrate with headers() from next/headers here
        // const headersList = headers();
        // const ip = headersList.get('x-forwarded-for') || 'unknown';
        // return `${type}:${ip}`;

        return `${type}:global`;
    } catch {
        return `${type}:unknown`;
    }
}

/**
 * Throws an error if rate limit is exceeded
 */
export function checkRateLimit(
    identifier: string,
    config: RateLimitConfig
): void {
    const result = rateLimit(identifier, config);

    if (!result.allowed) {
        const resetIn = Math.ceil((result.resetAt - Date.now()) / 1000);
        throw new Error(
            `Rate limit exceeded. Try again in ${resetIn} seconds.`
        );
    }
}
