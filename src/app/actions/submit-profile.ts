'use server';

import { supabase } from '@/lib/supabase/client';
import { ProfileFormData } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import {
    validateProfile,
    sanitizeString,
    validateHandle,
    validateUrl
} from '@/lib/validation';
import { uploadImage } from './upload-image';

export async function submitProfile(formData: ProfileFormData) {
    try {
        // Validate required fields
        if (!formData.primary_handle?.trim()) {
            return { success: false, error: 'Handle is required' };
        }
        if (!formData.full_name?.trim()) {
            return { success: false, error: 'Full name is required' };
        }
        if (!formData.category) {
            return { success: false, error: 'Category is required' };
        }
        if (!formData.location) {
            return { success: false, error: 'Location is required' };
        }
        if (!formData.bio?.trim()) {
            return { success: false, error: 'Bio is required' };
        }
        if (formData.bio.length > 300) {
            return { success: false, error: 'Bio must be 300 characters or less' };
        }

        // Validate handle format
        const handleValidation = validateHandle(formData.primary_handle, formData.primary_platform);
        if (!handleValidation.valid) {
            return { success: false, error: handleValidation.errors.join(', ') };
        }

        // Upload images if provided
        let profilePhotoUrl: string | null = null;
        let headerImageUrl: string | null = null;

        if (formData.profile_photo_base64) {
            const uploadResult = await uploadImage(
                formData.profile_photo_base64,
                'profile.jpg',
                'profile-photos'
            );
            if (uploadResult.success) {
                profilePhotoUrl = uploadResult.url || null;
            }
        }

        if (formData.header_image_base64) {
            const uploadResult = await uploadImage(
                formData.header_image_base64,
                'header.jpg',
                'header-images'
            );
            if (uploadResult.success) {
                headerImageUrl = uploadResult.url || null;
            }
        }

        // Prepare profile data
        const profileData = {
            primary_platform: formData.primary_platform,
            primary_handle: sanitizeString(formData.primary_handle.trim()),
            instagram_handle: formData.instagram_handle ? sanitizeString(formData.instagram_handle.trim()) : null,
            tiktok_handle: formData.tiktok_handle ? sanitizeString(formData.tiktok_handle.trim()) : null,
            twitter_handle: formData.twitter_handle ? sanitizeString(formData.twitter_handle.trim()) : null,
            full_name: sanitizeString(formData.full_name.trim()),
            category: formData.category,
            location: formData.location,
            bio: sanitizeString(formData.bio.trim()),
            portfolio_url: formData.portfolio_url ? sanitizeString(formData.portfolio_url.trim()) : null,
            profile_photo_url: profilePhotoUrl,
            header_image_url: headerImageUrl,
            status: 'pending' as const,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        // Insert into profiles table
        const { data: profile, error: profileError } = await (supabase as any)
            .from('profiles')
            .insert(profileData)
            .select()
            .single();

        if (profileError) {
            console.error('Profile insert error:', profileError);
            throw new Error('Failed to submit profile. Please try again.');
        }

        // Insert social links if provided
        if (formData.social_links && formData.social_links.length > 0) {
            const socialLinksData = formData.social_links
                .filter(link => link.url?.trim())
                .map(link => {
                    // Validate URL
                    const urlValidation = validateUrl(link.url);
                    if (!urlValidation.valid) {
                        throw new Error(`Invalid URL: ${link.url}`);
                    }

                    return {
                        profile_id: profile.id,
                        platform: sanitizeString(link.platform),
                        url: sanitizeString(link.url.trim()),
                        created_at: new Date().toISOString(),
                    };
                });

            if (socialLinksData.length > 0) {
                const { error: linksError } = await (supabase as any)
                    .from('social_links')
                    .insert(socialLinksData);

                if (linksError) {
                    console.error('Social links insert error:', linksError);
                    // Don't fail the whole submission if social links fail
                }
            }
        }

        // Log submission
        await (supabase as any).from('submission_logs').insert({
            profile_id: profile.id,
            action: 'submit_profile',
            notes: JSON.stringify({ platform: formData.primary_platform, category: formData.category }),
        });

        // Revalidate admin page
        revalidatePath('/admin');

        return {
            success: true,
            message: 'Profile submitted successfully! We will review it within 48 hours.',
            profileId: profile.id
        };

    } catch (error: unknown) {
        console.error('Submit profile error:', error);
        const message = error instanceof Error ? error.message : 'Failed to submit profile. Please try again.';
        return { success: false, error: message };
    }
}
