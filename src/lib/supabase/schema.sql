-- Kreativa Database Schema for Supabase
-- Run this in the Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- PROFILES TABLE
-- ========================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Primary platform info
    primary_platform TEXT NOT NULL CHECK (primary_platform IN ('Instagram', 'TikTok', 'Twitter')),
    primary_handle TEXT NOT NULL,
    
    -- Multi-platform handles
    instagram_handle TEXT,
    tiktok_handle TEXT,
    twitter_handle TEXT,
    
    -- Basic info
    full_name TEXT NOT NULL,
    category TEXT NOT NULL,
    location TEXT NOT NULL,
    bio TEXT NOT NULL CHECK (char_length(bio) <= 300),
    portfolio_url TEXT,
    
    -- Images
    profile_photo_url TEXT,
    header_image_url TEXT,
    
    -- Stats
    follower_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    posts_count INTEGER DEFAULT 0,
    
    -- Status
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    rejection_reason TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    approved_at TIMESTAMPTZ,
    
    -- Featured flag
    is_featured BOOLEAN DEFAULT FALSE,
    
    -- Rankings
    rank_score INTEGER DEFAULT 0
);

-- ========================================
-- SOCIAL LINKS TABLE
-- ========================================
CREATE TABLE social_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- ADMIN USERS TABLE
-- ========================================
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ
);

-- ========================================
-- SUBMISSIONS LOG TABLE (for analytics)
-- ========================================
CREATE TABLE submission_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL CHECK (action IN ('submitted', 'approved', 'rejected', 'edited')),
    performed_by UUID REFERENCES admin_users(id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- INDEXES
-- ========================================
CREATE INDEX idx_profiles_status ON profiles(status);
CREATE INDEX idx_profiles_category ON profiles(category);
CREATE INDEX idx_profiles_location ON profiles(location);
CREATE INDEX idx_profiles_platform ON profiles(primary_platform);
CREATE INDEX idx_profiles_featured ON profiles(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_profiles_created_at ON profiles(created_at DESC);
CREATE INDEX idx_profiles_rank ON profiles(rank_score DESC);
CREATE INDEX idx_social_links_profile ON social_links(profile_id);

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_logs ENABLE ROW LEVEL SECURITY;

-- ========================================
-- PROFILES TABLE POLICIES
-- ========================================

-- Public can read approved profiles
CREATE POLICY "Profiles are viewable by everyone" ON profiles
    FOR SELECT USING (status = 'approved');

-- Anyone can insert (submit) a profile with pending status
CREATE POLICY "Anyone can submit a profile" ON profiles
    FOR INSERT WITH CHECK (status = 'pending');

-- Service role can update any profile (admin operations)
CREATE POLICY "Service role can update profiles" ON profiles
    FOR UPDATE USING (auth.role() = 'service_role');

-- Service role can delete profiles (admin operations)
CREATE POLICY "Service role can delete profiles" ON profiles
    FOR DELETE USING (auth.role() = 'service_role');

-- ========================================
-- SOCIAL LINKS POLICIES
-- ========================================

-- Public can read social links of approved profiles only
CREATE POLICY "Social links visible for approved profiles" ON social_links
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = social_links.profile_id
            AND profiles.status = 'approved'
        )
    );

-- Service role can insert social links
CREATE POLICY "Service role can insert social links" ON social_links
    FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Service role can update social links
CREATE POLICY "Service role can update social links" ON social_links
    FOR UPDATE USING (auth.role() = 'service_role');

-- Service role can delete social links
CREATE POLICY "Service role can delete social links" ON social_links
    FOR DELETE USING (auth.role() = 'service_role');

-- ========================================
-- ADMIN USERS POLICIES
-- ========================================

-- Only authenticated admins can read admin_users table
CREATE POLICY "Admins can read admin users" ON admin_users
    FOR SELECT USING (
        auth.role() = 'service_role' OR
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE admin_users.id = auth.uid()
        )
    );

-- Only service role can insert admin users
CREATE POLICY "Service role can insert admin users" ON admin_users
    FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Only service role can update admin users
CREATE POLICY "Service role can update admin users" ON admin_users
    FOR UPDATE USING (auth.role() = 'service_role');

-- Only service role can delete admin users
CREATE POLICY "Service role can delete admin users" ON admin_users
    FOR DELETE USING (auth.role() = 'service_role');

-- ========================================
-- SUBMISSION LOGS POLICIES
-- ========================================

-- Only service role can read submission logs
CREATE POLICY "Service role can read submission logs" ON submission_logs
    FOR SELECT USING (auth.role() = 'service_role');

-- Only service role can insert submission logs
CREATE POLICY "Service role can insert submission logs" ON submission_logs
    FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- No updates or deletes allowed on logs (immutable audit trail)
-- Service role can update if needed for corrections
CREATE POLICY "Service role can update submission logs" ON submission_logs
    FOR UPDATE USING (auth.role() = 'service_role');

-- ========================================
-- UPDATED_AT TRIGGER
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- SAMPLE DATA (Optional - for testing)
-- ========================================
-- Uncomment below to add sample data

-- INSERT INTO profiles (primary_platform, primary_handle, full_name, category, location, bio, follower_count, status) VALUES
-- ('Instagram', '@lagos_photographer', 'Adebayo Ogunlesi', 'Photographers', 'Lagos', 'Capturing Lagos through my lens. Fashion, portraits, and urban photography.', 125000, 'approved'),
-- ('TikTok', '@chisomcreates', 'Chisom Okonkwo', 'Content Creators', 'Lagos', 'Creating viral content that celebrates Nigerian culture.', 450000, 'approved'),
-- ('Instagram', '@tundedesigns', 'Tunde Bakare', 'Graphic Designers', 'Abuja', 'Brand designer helping Nigerian startups stand out.', 85000, 'approved');
