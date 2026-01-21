'use server';

// Server action for fetching social media stats
// This runs on the server to keep API keys secure

import { fetchSocialStats, SocialStats } from '@/lib/social-api';
import { PrimaryPlatform } from '@/lib/types';

export interface FetchStatsResult {
    success: boolean;
    data?: SocialStats;
    error?: string;
}

export async function fetchProfileStats(
    platform: PrimaryPlatform,
    handle: string
): Promise<FetchStatsResult> {
    try {
        // Validate inputs
        if (!platform || !handle) {
            return { success: false, error: 'Platform and handle are required' };
        }

        // Fetch stats from the appropriate platform
        const stats = await fetchSocialStats(platform, handle);

        if (stats.error) {
            return { success: false, error: stats.error };
        }

        return { success: true, data: stats };
    } catch (error) {
        console.error('Server action error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
    }
}

// Fetch stats for multiple platforms
export async function fetchAllPlatformStats(handles: {
    instagram?: string;
    tiktok?: string;
    twitter?: string;
}): Promise<{
    instagram?: FetchStatsResult;
    tiktok?: FetchStatsResult;
    twitter?: FetchStatsResult;
}> {
    const results: {
        instagram?: FetchStatsResult;
        tiktok?: FetchStatsResult;
        twitter?: FetchStatsResult;
    } = {};

    const promises: Promise<void>[] = [];

    if (handles.instagram) {
        promises.push(
            fetchProfileStats('Instagram', handles.instagram).then(r => {
                results.instagram = r;
            })
        );
    }

    if (handles.tiktok) {
        promises.push(
            fetchProfileStats('TikTok', handles.tiktok).then(r => {
                results.tiktok = r;
            })
        );
    }

    if (handles.twitter) {
        promises.push(
            fetchProfileStats('Twitter', handles.twitter).then(r => {
                results.twitter = r;
            })
        );
    }

    await Promise.all(promises);
    return results;
}
