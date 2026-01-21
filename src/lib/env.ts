/**
 * Environment variable validation and type-safe access
 */

interface EnvConfig {
    // Supabase
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    SUPABASE_SERVICE_ROLE_KEY: string;

    // RapidAPI
    RAPID_API_KEY: string;

    // Google Gemini
    GEMINI_API_KEY: string;

    // App
    NODE_ENV: 'development' | 'production' | 'test';
}

class EnvironmentError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'EnvironmentError';
    }
}

/**
 * Validate and get environment variable
 */
function getEnvVar(key: string, isOptional = false): string {
    const value = process.env[key];

    if (!value && !isOptional) {
        throw new EnvironmentError(
            `Missing required environment variable: ${key}`
        );
    }

    return value || '';
}

/**
 * Validate all required environment variables
 */
export function validateEnvironment(): void {
    const required: (keyof EnvConfig)[] = [
        'NEXT_PUBLIC_SUPABASE_URL',
        'NEXT_PUBLIC_SUPABASE_ANON_KEY',
        'SUPABASE_SERVICE_ROLE_KEY',
    ];

    const optional: string[] = [
        'RAPID_API_KEY',
        'GEMINI_API_KEY',
    ];

    const missing: string[] = [];
    const warnings: string[] = [];

    // Check required
    for (const key of required) {
        try {
            getEnvVar(key);
        } catch {
            missing.push(key);
        }
    }

    // Check optional
    for (const key of optional) {
        if (!process.env[key]) {
            warnings.push(key);
        }
    }

    if (missing.length > 0) {
        throw new EnvironmentError(
            `Missing required environment variables:\n${missing.join('\n')}\n\n` +
            'Please create a .env.local file with all required variables.'
        );
    }

    if (warnings.length > 0 && process.env.NODE_ENV !== 'test') {
        console.warn(
            '⚠️  Missing optional environment variables:\n',
            warnings.join('\n'),
            '\nSome features may not work correctly.'
        );
    }
}

/**
 * Type-safe environment variable access
 */
export const env = {
    // Supabase
    get supabaseUrl(): string {
        return getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
    },

    get supabaseAnonKey(): string {
        return getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');
    },

    get supabaseServiceRoleKey(): string {
        return getEnvVar('SUPABASE_SERVICE_ROLE_KEY');
    },

    // RapidAPI
    get rapidApiKey(): string | null {
        return getEnvVar('RAPID_API_KEY', true) || null;
    },

    // Gemini
    get geminiApiKey(): string | null {
        return getEnvVar('GEMINI_API_KEY', true) || null;
    },

    // App
    get nodeEnv(): 'development' | 'production' | 'test' {
        const env = process.env.NODE_ENV || 'development';
        return env as 'development' | 'production' | 'test';
    },

    get isProduction(): boolean {
        return this.nodeEnv === 'production';
    },

    get isDevelopment(): boolean {
        return this.nodeEnv === 'development';
    },

    get isTest(): boolean {
        return this.nodeEnv === 'test';
    },
} as const;

/**
 * Validate API key before use
 */
export function requireApiKey(key: string | null, name: string): string {
    if (!key) {
        throw new Error(
            `${name} is not configured. Please add the ${name} environment variable.`
        );
    }
    return key;
}

// Validate environment on module load (only in production)
if (env.isProduction) {
    try {
        validateEnvironment();
    } catch (error) {
        console.error('Environment validation failed:', error);
        // In production, we want to fail fast
        throw error;
    }
}
