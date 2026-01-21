'use server';

import { createServerClient } from '@/lib/supabase/client';
import { Profile } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { requireAdmin, getAdminUser } from '@/lib/auth';
import {
    validateProfileId,
    validateProfileIds,
    validateStatus,
    validateProfile,
    sanitizeString
} from '@/lib/validation';
import { checkRateLimit, RATE_LIMITS, getRateLimitIdentifier } from '@/lib/rate-limit';

function getAdminClient(): any {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing. Please add it to your .env.local file to enable admin operations.');
    }
    return createServerClient();
}

async function logAuditAction(action: string, details: any, userId?: string) {
    try {
        const supabase = getAdminClient();
        // @ts-ignore
        await supabase.from('submission_logs').insert({
            action,
            notes: JSON.stringify(details),
            performed_by: userId,
        });
    } catch (error) {
        console.error('Failed to log audit action:', error);
    }
}

export async function fetchAdminProfiles(page: number = 1, limit: number = 50) {
    try {
        // Check authorization
        await requireAdmin();

        // Rate limiting
        const identifier = await getRateLimitIdentifier('admin-fetch');
        checkRateLimit(identifier, RATE_LIMITS.ADMIN);

        // Validate pagination params
        if (page < 1 || limit < 1 || limit > 100) {
            return { success: false, error: 'Invalid pagination parameters' };
        }

        const supabase = getAdminClient();
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        const { data, error, count } = await supabase
            .from('profiles')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) throw error;

        return {
            success: true,
            data: data as Profile[],
            pagination: {
                page,
                limit,
                total: count || 0,
                totalPages: Math.ceil((count || 0) / limit)
            }
        };
    } catch (error: unknown) {
        console.error('Fetch admin profiles error:', error);
        const message = error instanceof Error ? error.message : 'Failed to fetch profiles';
        return { success: false, error: message };
    }
}

export async function approveProfile(id: string) {
    try {
        // Check authorization
        const user = await getAdminUser();

        // Rate limiting
        const identifier = await getRateLimitIdentifier('admin-approve');
        checkRateLimit(identifier, RATE_LIMITS.ADMIN);

        // Validate input
        const validation = validateProfileId(id);
        if (!validation.valid) {
            return { success: false, error: validation.errors.join(', ') };
        }

        const supabase = getAdminClient();
        const { error } = await supabase
            .from('profiles')
            .update({ status: 'approved', approved_at: new Date().toISOString() })
            .eq('id', id);

        if (error) throw error;

        // Audit log
        await logAuditAction('approve_profile', { profileId: id }, user.id);

        revalidatePath('/');
        revalidatePath('/browse');
        return { success: true };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to approve profile';
        return { success: false, error: message };
    }
}

export async function deleteProfile(id: string) {
    try {
        // Check authorization
        const user = await getAdminUser();

        // Rate limiting
        const identifier = await getRateLimitIdentifier('admin-delete');
        checkRateLimit(identifier, RATE_LIMITS.ADMIN);

        // Validate input
        const validation = validateProfileId(id);
        if (!validation.valid) {
            return { success: false, error: validation.errors.join(', ') };
        }

        const supabase = getAdminClient();
        const { error } = await supabase
            .from('profiles')
            .delete()
            .eq('id', id);

        if (error) throw error;

        // Audit log
        await logAuditAction('delete_profile', { profileId: id }, user.id);

        revalidatePath('/');
        revalidatePath('/browse');
        return { success: true };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to delete profile';
        return { success: false, error: message };
    }
}

export async function bulkApproveProfiles(ids: string[]) {
    try {
        // Check authorization
        const user = await getAdminUser();

        // Rate limiting
        const identifier = await getRateLimitIdentifier('admin-bulk-approve');
        checkRateLimit(identifier, RATE_LIMITS.ADMIN);

        // Validate input
        const validation = validateProfileIds(ids);
        if (!validation.valid) {
            return { success: false, error: validation.errors.join(', ') };
        }

        const supabase = getAdminClient();
        const { error } = await supabase
            .from('profiles')
            .update({ status: 'approved', approved_at: new Date().toISOString() })
            .in('id', ids);

        if (error) throw error;

        // Audit log
        await logAuditAction('bulk_approve_profiles', { profileIds: ids, count: ids.length }, user.id);

        revalidatePath('/');
        revalidatePath('/browse');
        return { success: true };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to bulk approve profiles';
        return { success: false, error: message };
    }
}

export async function bulkDeleteProfiles(ids: string[]) {
    try {
        // Check authorization
        const user = await getAdminUser();

        // Rate limiting
        const identifier = await getRateLimitIdentifier('admin-bulk-delete');
        checkRateLimit(identifier, RATE_LIMITS.ADMIN);

        // Validate input
        const validation = validateProfileIds(ids);
        if (!validation.valid) {
            return { success: false, error: validation.errors.join(', ') };
        }

        const supabase = getAdminClient();
        const { error } = await supabase
            .from('profiles')
            .delete()
            .in('id', ids);

        if (error) throw error;

        // Audit log
        await logAuditAction('bulk_delete_profiles', { profileIds: ids, count: ids.length }, user.id);

        revalidatePath('/');
        revalidatePath('/browse');
        return { success: true };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to bulk delete profiles';
        return { success: false, error: message };
    }
}

export async function updateProfileStatus(id: string, status: string) {
    try {
        // Check authorization
        const user = await getAdminUser();

        // Rate limiting
        const identifier = await getRateLimitIdentifier('admin-update-status');
        checkRateLimit(identifier, RATE_LIMITS.ADMIN);

        // Validate input
        const idValidation = validateProfileId(id);
        if (!idValidation.valid) {
            return { success: false, error: idValidation.errors.join(', ') };
        }

        const statusValidation = validateStatus(status);
        if (!statusValidation.valid) {
            return { success: false, error: statusValidation.errors.join(', ') };
        }

        const supabase = getAdminClient();
        const updates: any = { status, updated_at: new Date().toISOString() };
        if (status === 'approved') {
            updates.approved_at = new Date().toISOString();
        }

        const { error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', id);

        if (error) throw error;

        // Audit log
        await logAuditAction('update_profile_status', { profileId: id, status }, user.id);

        revalidatePath('/');
        revalidatePath('/browse');
        return { success: true };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to update profile status';
        return { success: false, error: message };
    }
}

export async function updateProfile(profile: Profile) {
    try {
        // Check authorization
        const user = await getAdminUser();

        // Rate limiting
        const identifier = await getRateLimitIdentifier('admin-update-profile');
        checkRateLimit(identifier, RATE_LIMITS.ADMIN);

        // Validate profile ID
        const idValidation = validateProfileId(profile.id);
        if (!idValidation.valid) {
            return { success: false, error: idValidation.errors.join(', ') };
        }

        // Validate profile fields
        const profileValidation = validateProfile(profile);
        if (!profileValidation.valid) {
            return { success: false, error: profileValidation.errors.join(', ') };
        }

        const supabase = getAdminClient();
        const { id, ...data } = profile;

        // Sanitize string fields
        const sanitizedData = {
            ...data,
            full_name: data.full_name ? sanitizeString(data.full_name) : data.full_name,
            bio: data.bio ? sanitizeString(data.bio) : data.bio,
            updated_at: new Date().toISOString()
        };

        const { error } = await supabase
            .from('profiles')
            .update(sanitizedData)
            .eq('id', id);

        if (error) throw error;

        // Audit log
        await logAuditAction('update_profile', { profileId: id, changes: Object.keys(data) }, user.id);

        revalidatePath('/');
        revalidatePath('/browse');
        return { success: true };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to update profile';
        return { success: false, error: message };
    }
}
