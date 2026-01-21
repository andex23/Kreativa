-- Storage RLS Policies for Image Uploads
-- Run this in Supabase SQL Editor after creating the buckets

-- ============================================
-- PROFILE-PHOTOS BUCKET POLICIES
-- ============================================

-- Policy 1: Allow public to upload profile photos
CREATE POLICY "Allow public upload profile photos"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'profile-photos');

-- Policy 2: Allow public to read profile photos
CREATE POLICY "Allow public read profile photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-photos');

-- Policy 3: Allow service role full access to profile photos
CREATE POLICY "Service role full access profile photos"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'profile-photos');

-- ============================================
-- HEADER-IMAGES BUCKET POLICIES
-- ============================================

-- Policy 1: Allow public to upload header images
CREATE POLICY "Allow public upload header images"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'header-images');

-- Policy 2: Allow public to read header images
CREATE POLICY "Allow public read header images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'header-images');

-- Policy 3: Allow service role full access to header images
CREATE POLICY "Service role full access header images"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'header-images');

-- ============================================
-- VERIFICATION
-- ============================================

-- Check policies are applied
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE tablename = 'objects'
AND schemaname = 'storage'
ORDER BY policyname;
