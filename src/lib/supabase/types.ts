// Database types for Supabase
// These types match the schema.sql structure

export type PrimaryPlatform = 'Instagram' | 'TikTok' | 'Twitter';
export type ProfileStatus = 'pending' | 'approved' | 'rejected';
export type AdminRole = 'admin' | 'super_admin';

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    primary_platform: PrimaryPlatform;
                    primary_handle: string;
                    instagram_handle: string | null;
                    tiktok_handle: string | null;
                    twitter_handle: string | null;
                    full_name: string;
                    category: string;
                    location: string;
                    bio: string;
                    portfolio_url: string | null;
                    profile_photo_url: string | null;
                    header_image_url: string | null;
                    follower_count: number;
                    following_count: number;
                    posts_count: number;
                    status: ProfileStatus;
                    rejection_reason: string | null;
                    created_at: string;
                    updated_at: string;
                    approved_at: string | null;
                    is_featured: boolean;
                    rank_score: number;
                };
                Insert: {
                    id?: string;
                    primary_platform: PrimaryPlatform;
                    primary_handle: string;
                    instagram_handle?: string | null;
                    tiktok_handle?: string | null;
                    twitter_handle?: string | null;
                    full_name: string;
                    category: string;
                    location: string;
                    bio: string;
                    portfolio_url?: string | null;
                    profile_photo_url?: string | null;
                    header_image_url?: string | null;
                    follower_count?: number;
                    following_count?: number;
                    posts_count?: number;
                    status?: ProfileStatus;
                    rejection_reason?: string | null;
                    is_featured?: boolean;
                    rank_score?: number;
                };
                Update: {
                    primary_platform?: PrimaryPlatform;
                    primary_handle?: string;
                    instagram_handle?: string | null;
                    tiktok_handle?: string | null;
                    twitter_handle?: string | null;
                    full_name?: string;
                    category?: string;
                    location?: string;
                    bio?: string;
                    portfolio_url?: string | null;
                    profile_photo_url?: string | null;
                    header_image_url?: string | null;
                    follower_count?: number;
                    following_count?: number;
                    posts_count?: number;
                    status?: ProfileStatus;
                    rejection_reason?: string | null;
                    is_featured?: boolean;
                    rank_score?: number;
                    approved_at?: string | null;
                    updated_at?: string;
                };
            };
            social_links: {
                Row: {
                    id: string;
                    profile_id: string;
                    platform: string;
                    url: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    profile_id: string;
                    platform: string;
                    url: string;
                };
                Update: {
                    platform?: string;
                    url?: string;
                };
            };
            admin_users: {
                Row: {
                    id: string;
                    email: string;
                    password_hash: string;
                    name: string | null;
                    role: AdminRole;
                    created_at: string;
                    last_login: string | null;
                };
                Insert: {
                    id?: string;
                    email: string;
                    password_hash: string;
                    name?: string | null;
                    role?: AdminRole;
                };
                Update: {
                    email?: string;
                    name?: string | null;
                    role?: AdminRole;
                    last_login?: string | null;
                };
            };
            submission_logs: {
                Row: {
                    id: string;
                    profile_id: string | null;
                    action: string;
                    performed_by: string | null;
                    notes: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    profile_id?: string | null;
                    action: string;
                    performed_by?: string | null;
                    notes?: string | null;
                };
                Update: {
                    notes?: string | null;
                };
            };
        };
    };
}

// Helper types for API usage
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
export type SocialLink = Database['public']['Tables']['social_links']['Row'];
