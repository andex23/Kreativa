-- PRODUCTION RLS POLICIES
-- Secure policies that only allow approved profiles to be viewed publicly
-- Admin operations require service role key

-- ============================================
-- PROFILES TABLE
-- ============================================

-- Drop all existing policies on profiles
DROP POLICY IF EXISTS "allow_anon_insert_profiles" ON profiles;
DROP POLICY IF EXISTS "allow_anon_select_profiles" ON profiles;
DROP POLICY IF EXISTS "allow_anon_delete_profiles" ON profiles;
DROP POLICY IF EXISTS "allow_anon_update_profiles" ON profiles;
DROP POLICY IF EXISTS "permissive_insert" ON profiles;
DROP POLICY IF EXISTS "permissive_read" ON profiles;
DROP POLICY IF EXISTS "service_role_update" ON profiles;
DROP POLICY IF EXISTS "service_role_delete" ON profiles;
DROP POLICY IF EXISTS "enable_insert_for_all" ON profiles;
DROP POLICY IF EXISTS "enable_read_approved" ON profiles;
DROP POLICY IF EXISTS "enable_all_for_service_role" ON profiles;
DROP POLICY IF EXISTS "allow_public_read_approved" ON profiles;
DROP POLICY IF EXISTS "allow_public_insert" ON profiles;
DROP POLICY IF EXISTS "allow_service_role_all" ON profiles;

-- Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow public to INSERT profiles (for form submissions)
-- Public can submit, but profiles start as 'pending'
CREATE POLICY "public_can_insert_profiles"
ON profiles
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Policy 2: Only allow reading APPROVED profiles
-- This is what the public directory will show
CREATE POLICY "public_can_read_approved_profiles"
ON profiles
FOR SELECT
TO anon, authenticated
USING (status = 'approved');

-- Policy 3: Service role can do everything (for admin dashboard)
-- This allows server-side admin operations
CREATE POLICY "service_role_all_access_profiles"
ON profiles
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================
-- SOCIAL_LINKS TABLE
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "allow_anon_select_social_links" ON social_links;
DROP POLICY IF EXISTS "allow_anon_insert_social_links" ON social_links;

-- Enable RLS
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

-- Allow public to insert social links (tied to profile submissions)
CREATE POLICY "public_can_insert_social_links"
ON social_links
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only show social links for approved profiles
CREATE POLICY "public_can_read_approved_social_links"
ON social_links
FOR SELECT
TO anon, authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = social_links.profile_id
        AND profiles.status = 'approved'
    )
);

-- Service role can do everything
CREATE POLICY "service_role_all_access_social_links"
ON social_links
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================
-- ADMIN_USERS TABLE
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "allow_anon_select_admin_users" ON admin_users;

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Only service role can access admin_users table
-- Public should never see this data
CREATE POLICY "service_role_only_admin_users"
ON admin_users
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================
-- SUBMISSION_LOGS TABLE
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "allow_anon_select_submission_logs" ON submission_logs;
DROP POLICY IF EXISTS "allow_anon_insert_submission_logs" ON submission_logs;

-- Enable RLS
ALTER TABLE submission_logs ENABLE ROW LEVEL SECURITY;

-- Allow public to insert submission logs (for tracking submissions)
CREATE POLICY "public_can_insert_submission_logs"
ON submission_logs
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only service role can read logs (for admin dashboard)
CREATE POLICY "service_role_can_read_submission_logs"
ON submission_logs
FOR SELECT
TO service_role
USING (true);

-- Service role can do everything
CREATE POLICY "service_role_all_access_submission_logs"
ON submission_logs
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================
-- VERIFICATION
-- ============================================

-- Check that all tables have RLS enabled
SELECT
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'social_links', 'admin_users', 'submission_logs');

-- List all policies
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
