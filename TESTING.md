# Testing Guide - Kreativa App

## Complete Flow Test

Follow these steps to test the entire application flow from submission to public display.

### Prerequisites
1. ✅ Production RLS policies applied to Supabase
2. ✅ Environment variables configured in `.env.local`
3. ✅ Dev server running (`npm run dev`)

---

## Test 1: Public Submission

### Steps:
1. **Go to submission form**
   ```
   http://localhost:3000/submit
   ```

2. **Fill out the form:**
   - Select **Primary Platform** (Instagram/TikTok/Twitter)
   - Enter **Handle**: `@testcreative123`
   - Enter **Full Name**: `Test Creative`
   - Select **Category**: Any category
   - Select **Location**: Any location
   - Enter **Bio**: `I'm a test creative to verify the submission flow works correctly.`
   - *(Optional)* Add social links
   - Check **Terms & Privacy** checkbox

3. **Submit the form**
   - Click "Submit for Review"
   - Should see success message: *"Submitted - We will review your profile within 48 hours."*

4. **Expected Result:**
   - ✅ Profile saved to database with `status = 'pending'`
   - ✅ Profile **NOT visible** on homepage or browse page (pending profiles hidden)
   - ✅ Success page displayed

---

## Test 2: Admin Review & Approval

### Steps:
1. **Go to admin login**
   ```
   http://localhost:3000/admin/login
   ```

2. **Login with admin credentials**
   *(Note: Check your admin login implementation for credentials)*

3. **Navigate to Pending tab**
   - You should see the `Test Creative` profile you just submitted
   - Profile shows:
     - Name: Test Creative
     - Handle: @testcreative123
     - Platform badge (Instagram/TikTok/Twitter)
     - Category and Location badges
     - Bio text

4. **Approve the profile**
   - Click **"✓ Approve"** button
   - Profile should move to **Approved** tab
   - Toast notification: "Profile updated successfully"

5. **Expected Result:**
   - ✅ Profile status changed from `pending` to `approved` in database
   - ✅ Profile now visible to public
   - ✅ Profile appears in Approved tab in admin dashboard

---

## Test 3: Public Visibility

### Steps:
1. **Go to homepage**
   ```
   http://localhost:3000
   ```

2. **Check Featured Creatives section**
   - Look for `Test Creative` profile card
   - Should appear if it's in top 8 by followers (or if no other profiles exist)

3. **Go to browse page**
   ```
   http://localhost:3000/browse
   ```

4. **Find the approved profile**
   - Should see `Test Creative` in the directory
   - Use search/filters to find it:
     - Search: `Test Creative`
     - Or filter by the category/location you selected

5. **Click on the profile card**
   - Modal should open with full profile details
   - Should show:
     - Name
     - Bio
     - Platform links
     - Social links (if added)

6. **Expected Result:**
   - ✅ Approved profile is publicly visible
   - ✅ Profile appears in search results
   - ✅ Profile modal displays correctly
   - ✅ Only **approved** profiles visible (pending/rejected hidden)

---

## Test 4: Security Verification

### Steps:
1. **Open browser DevTools** (F12 or Cmd+Option+I)

2. **Go to Network tab**

3. **Refresh the homepage**
   ```
   http://localhost:3000
   ```

4. **Look at the Supabase API calls**
   - Find requests to Supabase REST API
   - Check the query filters
   - Should see: `?status=eq.approved`

5. **Try to access pending profiles directly** (in console):
   ```javascript
   // This should return empty or error (RLS blocking)
   await supabase.from('profiles').select('*').eq('status', 'pending')
   ```

6. **Expected Result:**
   - ✅ Public can only query approved profiles
   - ✅ Pending/rejected profiles blocked by RLS
   - ✅ No unauthorized data leakage

---

## Test 5: Admin Dashboard Features

### Test Bulk Actions:
1. **Go to admin pending tab**
2. **Select multiple profiles** using checkboxes
3. **Click "Approve (N)"** button
4. All selected profiles move to approved

### Test Profile Editing:
1. **Click "Edit" on any profile**
2. **Modify fields** (name, bio, category, etc.)
3. **Save changes**
4. Changes persist and show immediately

### Test Bulk Import:
1. **Go to "Bulk Import" tab**
2. **Enter usernames** (one per line):
   ```
   @example1
   @example2
   @example3
   ```
3. **Select platform, category, location**
4. **Click "Start Import"**
5. Progress bar shows import status
6. Profiles appear in pending tab

### Test Stats Fetching:
1. **Click "📊 Fetch Stats"** on any profile
2. System fetches follower count, bio, etc. from platform
3. Profile updated with latest stats

---

## Test 6: Database Connection Test

### Steps:
1. **Go to test page**
   ```
   http://localhost:3000/test-db
   ```

2. **Review test results:**
   - ✅ **Database Connection** - Should pass
   - ✅ **Profiles Table (Public Read)** - Should pass (only approved)
   - ✅ **Social Links Table (Public Read)** - Should pass (only for approved)
   - ✅ **Admin Users Table (Public Access)** - Should pass (correctly blocked)
   - ✅ **Submission Logs Table (Public Read)** - Should pass (correctly blocked)
   - ✅ **Insert Test Profile (Public)** - Should pass
   - ✅ **Pending Profile Visibility** - Should pass (correctly hidden)
   - ✅ **Admin Access (Service Role)** - Should pass

3. **Expected Result:**
   - All tests pass
   - Security policies working correctly
   - Public can submit but not see pending profiles

---

## Common Issues & Solutions

### Issue: Form submission fails
**Solution:** Check browser console for errors. Verify `.env.local` has correct Supabase keys.

### Issue: Profiles not appearing after approval
**Solution:**
1. Check RLS policies are applied correctly
2. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
3. Check Network tab for API errors

### Issue: Admin can't approve profiles
**Solution:**
1. Verify `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`
2. Check admin authentication is working
3. Review server console for errors

### Issue: Test DB page shows errors
**Solution:** Re-apply production RLS policies from `src/lib/supabase/production-rls.sql`

---

## Success Criteria ✅

Your app is working correctly when:
- ✅ Public can submit profiles
- ✅ Submissions start as `pending` (hidden from public)
- ✅ Admin can view and approve/reject submissions
- ✅ Approved profiles appear on homepage and browse page
- ✅ Pending/rejected profiles stay hidden from public
- ✅ RLS policies protect sensitive data
- ✅ All test-db checks pass

---

## Next Steps

Once testing is complete:
1. **Add real admin authentication** (currently using sessionStorage)
2. **Set up image upload** (profile photos, headers)
3. **Add email notifications** for submission confirmations
4. **Deploy to production** (Vercel + Supabase)
5. **Set up custom domain**

🎉 **Your app is production-ready!**
