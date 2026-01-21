/**
 * Input validation utilities
 */

import { CATEGORIES, LOCATIONS } from './constants';

export interface ValidationResult {
    valid: boolean;
    errors: string[];
}

export function validateEmail(email: string): ValidationResult {
    const errors: string[] = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || email.trim().length === 0) {
        errors.push('Email is required');
    } else if (!emailRegex.test(email)) {
        errors.push('Invalid email format');
    } else if (email.length > 255) {
        errors.push('Email must be less than 255 characters');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

export function validateHandle(handle: string, platform: string): ValidationResult {
    const errors: string[] = [];

    if (!handle || handle.trim().length === 0) {
        errors.push(`${platform} handle is required`);
    } else if (handle.length > 50) {
        errors.push(`${platform} handle must be less than 50 characters`);
    } else if (!/^[a-zA-Z0-9._-]+$/.test(handle.replace('@', ''))) {
        errors.push(`${platform} handle contains invalid characters`);
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

export function validateCategory(category: string): ValidationResult {
    const errors: string[] = [];

    if (!category || category.trim().length === 0) {
        errors.push('Category is required');
    } else if (!CATEGORIES.includes(category as any)) {
        errors.push('Invalid category');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

export function validateLocation(location: string): ValidationResult {
    const errors: string[] = [];

    if (!location || location.trim().length === 0) {
        errors.push('Location is required');
    } else if (!LOCATIONS.includes(location as any)) {
        errors.push('Invalid location');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

export function validateBio(bio: string): ValidationResult {
    const errors: string[] = [];

    if (!bio || bio.trim().length === 0) {
        errors.push('Bio is required');
    } else if (bio.length < 10) {
        errors.push('Bio must be at least 10 characters');
    } else if (bio.length > 500) {
        errors.push('Bio must be less than 500 characters');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

export function validateName(name: string): ValidationResult {
    const errors: string[] = [];

    if (!name || name.trim().length === 0) {
        errors.push('Name is required');
    } else if (name.length < 2) {
        errors.push('Name must be at least 2 characters');
    } else if (name.length > 100) {
        errors.push('Name must be less than 100 characters');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

export function validateProfileId(id: string): ValidationResult {
    const errors: string[] = [];
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!id || id.trim().length === 0) {
        errors.push('Profile ID is required');
    } else if (!uuidRegex.test(id)) {
        errors.push('Invalid profile ID format');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

export function validateProfileIds(ids: string[]): ValidationResult {
    const errors: string[] = [];

    if (!Array.isArray(ids)) {
        errors.push('Profile IDs must be an array');
        return { valid: false, errors };
    }

    if (ids.length === 0) {
        errors.push('At least one profile ID is required');
    } else if (ids.length > 100) {
        errors.push('Cannot process more than 100 profiles at once');
    }

    for (const id of ids) {
        const result = validateProfileId(id);
        if (!result.valid) {
            errors.push(`Invalid ID: ${id}`);
            break; // Only report first invalid ID
        }
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

export function validateStatus(status: string): ValidationResult {
    const errors: string[] = [];
    const validStatuses = ['pending', 'approved', 'rejected'];

    if (!status || status.trim().length === 0) {
        errors.push('Status is required');
    } else if (!validStatuses.includes(status)) {
        errors.push('Invalid status. Must be: pending, approved, or rejected');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

export function sanitizeString(input: string): string {
    return input.trim().replace(/[<>]/g, '');
}

export function sanitizeHandle(handle: string): string {
    return handle.trim().replace(/^@/, '').replace(/[^a-zA-Z0-9._-]/g, '');
}

export function validateUrl(url: string): ValidationResult {
    const errors: string[] = [];

    if (!url || url.trim().length === 0) {
        errors.push('URL is required');
        return { valid: false, errors };
    }

    try {
        const parsed = new URL(url);
        if (!['http:', 'https:'].includes(parsed.protocol)) {
            errors.push('URL must use http or https protocol');
        }
    } catch {
        errors.push('Invalid URL format');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Validates all profile fields at once
 */
export function validateProfile(profile: {
    name?: string;
    bio?: string;
    category?: string;
    location?: string;
    instagram_handle?: string;
    twitter_handle?: string;
    tiktok_handle?: string;
}): ValidationResult {
    const errors: string[] = [];

    if (profile.name) {
        const nameResult = validateName(profile.name);
        if (!nameResult.valid) {
            errors.push(...nameResult.errors);
        }
    }

    if (profile.bio) {
        const bioResult = validateBio(profile.bio);
        if (!bioResult.valid) {
            errors.push(...bioResult.errors);
        }
    }

    if (profile.category) {
        const categoryResult = validateCategory(profile.category);
        if (!categoryResult.valid) {
            errors.push(...categoryResult.errors);
        }
    }

    if (profile.location) {
        const locationResult = validateLocation(profile.location);
        if (!locationResult.valid) {
            errors.push(...locationResult.errors);
        }
    }

    if (profile.instagram_handle) {
        const igResult = validateHandle(profile.instagram_handle, 'Instagram');
        if (!igResult.valid) {
            errors.push(...igResult.errors);
        }
    }

    if (profile.twitter_handle) {
        const twitterResult = validateHandle(profile.twitter_handle, 'Twitter');
        if (!twitterResult.valid) {
            errors.push(...twitterResult.errors);
        }
    }

    if (profile.tiktok_handle) {
        const tiktokResult = validateHandle(profile.tiktok_handle, 'TikTok');
        if (!tiktokResult.valid) {
            errors.push(...tiktokResult.errors);
        }
    }

    return {
        valid: errors.length === 0,
        errors
    };
}
