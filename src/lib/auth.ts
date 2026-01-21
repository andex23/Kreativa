import { createServerClient } from './supabase/client';
import { cookies } from 'next/headers';

/**
 * Server-side authentication utilities
 */

export async function getServerUser() {
    const supabase = createServerClient();

    try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) {
            console.error('Auth error:', error);
            return null;
        }

        return user;
    } catch (error) {
        console.error('Failed to get user:', error);
        return null;
    }
}

export async function isAdmin(): Promise<boolean> {
    const user = await getServerUser();

    if (!user) {
        return false;
    }

    const supabase = createServerClient();

    try {
        const { data, error } = await supabase
            .from('admin_users')
            .select('id')
            .eq('email', user.email)
            .single();

        if (error || !data) {
            return false;
        }

        return true;
    } catch (error) {
        console.error('Failed to check admin status:', error);
        return false;
    }
}

export async function requireAdmin() {
    const adminStatus = await isAdmin();

    if (!adminStatus) {
        throw new Error('Unauthorized: Admin access required');
    }

    return true;
}

export async function getAdminUser() {
    const user = await getServerUser();

    if (!user) {
        throw new Error('Unauthorized: Not authenticated');
    }

    const adminStatus = await isAdmin();

    if (!adminStatus) {
        throw new Error('Unauthorized: Admin access required');
    }

    return user;
}
