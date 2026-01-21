// Social Media API Service
// Uses RapidAPI for fetching profile data from Instagram, TikTok, and Twitter

import { PrimaryPlatform } from './types';

export interface SocialStats {
    followers: number | null;
    following: number | null;
    posts: number | null;
    bio: string | null;
    profilePicUrl: string | null;
    displayName: string | null;
    verified: boolean;
    error?: string;
}

// API Keys from environment
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || '';

// Base headers for RapidAPI
const rapidApiHeaders = {
    'X-RapidAPI-Key': RAPIDAPI_KEY,
    'X-RapidAPI-Host': '',
};

// ============================================
// INSTAGRAM FETCHER
// ============================================
export async function fetchInstagramStats(username: string): Promise<SocialStats> {
    const cleanUsername = username.replace('@', '').trim();

    if (!RAPIDAPI_KEY) {
        return { followers: null, following: null, posts: null, bio: null, profilePicUrl: null, displayName: null, verified: false, error: 'API key not configured' };
    }

    try {
        const timestamp = Date.now();
        const response = await fetch(`https://instagram-scraper-2022.p.rapidapi.com/ig/info_username/?user=${cleanUsername}&ts=${timestamp}`, {
            method: 'GET',
            headers: {
                ...rapidApiHeaders,
                'X-RapidAPI-Host': 'instagram-scraper-2022.p.rapidapi.com',
            },
        });

        if (!response.ok) {
            throw new Error(`Instagram API error: ${response.status}`);
        }

        const data = await response.json();

        // Parse Instagram response
        const user = data?.user || data;
        return {
            followers: user.follower_count || user.edge_followed_by?.count || null,
            following: user.following_count || user.edge_follow?.count || null,
            posts: user.media_count || user.edge_owner_to_timeline_media?.count || null,
            bio: user.biography || null,
            profilePicUrl: user.profile_pic_url_hd || user.profile_pic_url || null,
            displayName: user.full_name || null,
            verified: user.is_verified || false,
        };
    } catch (error) {
        console.error('Instagram fetch error:', error);
        return {
            followers: null, following: null, posts: null,
            bio: null, profilePicUrl: null, displayName: null, verified: false,
            error: error instanceof Error ? error.message : 'Failed to fetch Instagram data',
        };
    }
}

// ============================================
// TIKTOK FETCHER
// ============================================
export async function fetchTikTokStats(username: string): Promise<SocialStats> {
    const cleanUsername = username.replace('@', '').trim();

    if (!RAPIDAPI_KEY) {
        return { followers: null, following: null, posts: null, bio: null, profilePicUrl: null, displayName: null, verified: false, error: 'API key not configured' };
    }

    try {
        const timestamp = Date.now();
        const response = await fetch(`https://tiktok-api23.p.rapidapi.com/api/user/info?uniqueId=${cleanUsername}&ts=${timestamp}`, {
            method: 'GET',
            headers: {
                ...rapidApiHeaders,
                'X-RapidAPI-Host': 'tiktok-api23.p.rapidapi.com',
            },
        });

        if (!response.ok) {
            throw new Error(`TikTok API error: ${response.status}`);
        }

        const data = await response.json();

        // Parse TikTok response
        const user = data?.userInfo?.user || data?.user || {};
        const stats = data?.userInfo?.stats || data?.stats || {};

        return {
            followers: stats.followerCount || null,
            following: stats.followingCount || null,
            posts: stats.videoCount || null,
            bio: user.signature || null,
            profilePicUrl: user.avatarLarger || user.avatarMedium || null,
            displayName: user.nickname || null,
            verified: user.verified || false,
        };
    } catch (error) {
        console.error('TikTok fetch error:', error);
        return {
            followers: null, following: null, posts: null,
            bio: null, profilePicUrl: null, displayName: null, verified: false,
            error: error instanceof Error ? error.message : 'Failed to fetch TikTok data',
        };
    }
}

// ============================================
// TWITTER/X FETCHER
// ============================================
export async function fetchTwitterStats(username: string): Promise<SocialStats> {
    const cleanUsername = username.replace('@', '').trim();

    if (!RAPIDAPI_KEY) {
        return { followers: null, following: null, posts: null, bio: null, profilePicUrl: null, displayName: null, verified: false, error: 'API key not configured' };
    }

    try {
        const timestamp = Date.now();
        const response = await fetch(`https://twitter154.p.rapidapi.com/user/details?username=${cleanUsername}&ts=${timestamp}`, {
            method: 'GET',
            headers: {
                ...rapidApiHeaders,
                'X-RapidAPI-Host': 'twitter154.p.rapidapi.com',
            },
        });

        if (!response.ok) {
            throw new Error(`Twitter API error: ${response.status}`);
        }

        const data = await response.json();

        return {
            followers: data.follower_count || data.public_metrics?.followers_count || null,
            following: data.following_count || data.public_metrics?.following_count || null,
            posts: data.statuses_count || data.public_metrics?.tweet_count || null,
            bio: data.description || null,
            profilePicUrl: data.profile_image_url_https?.replace('_normal', '_400x400') || null,
            displayName: data.name || null,
            verified: data.verified || data.is_blue_verified || false,
        };
    } catch (error) {
        console.error('Twitter fetch error:', error);
        return {
            followers: null, following: null, posts: null,
            bio: null, profilePicUrl: null, displayName: null, verified: false,
            error: error instanceof Error ? error.message : 'Failed to fetch Twitter data',
        };
    }
}

// ============================================
// UNIFIED FETCHER
// ============================================
export async function fetchSocialStats(platform: PrimaryPlatform, username: string): Promise<SocialStats> {
    switch (platform) {
        case 'Instagram':
            return fetchInstagramStats(username);
        case 'TikTok':
            return fetchTikTokStats(username);
        case 'Twitter':
            return fetchTwitterStats(username);
        default:
            return {
                followers: null, following: null, posts: null,
                bio: null, profilePicUrl: null, displayName: null, verified: false,
                error: `Unsupported platform: ${platform}`,
            };
    }
}

// ============================================
// FORMAT HELPERS
// ============================================
export function formatFollowerCount(count: number | null | undefined): string {
    if (!count) return '–';
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
    if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
    return count.toString();
}
