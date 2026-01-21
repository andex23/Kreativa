import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/client';
import { supabase } from '@/lib/supabase/client';

interface TestResult {
  test: string;
  status: 'success' | 'error';
  message: string;
  data?: any;
}

export async function GET() {
  const testResults: TestResult[] = [];
  const serverClient = createServerClient();

  // Test 1: Check connection
  try {
    const { data, error } = await supabase.from('profiles').select('count');
    if (error) throw error;
    testResults.push({
      test: 'Database Connection',
      status: 'success',
      message: 'Successfully connected to Supabase',
    });
  } catch (error: any) {
    testResults.push({
      test: 'Database Connection',
      status: 'error',
      message: error.message,
    });
  }

  // Test 2: Check profiles table (only approved visible to public)
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    if (error) throw error;
    testResults.push({
      test: 'Profiles Table (Public Read)',
      status: 'success',
      message: `Can read approved profiles. Found ${data?.length || 0} approved records.`,
      data: data,
    });
  } catch (error: any) {
    testResults.push({
      test: 'Profiles Table (Public Read)',
      status: 'error',
      message: error.message,
    });
  }

  // Test 3: Check social_links table (only for approved profiles)
  try {
    const { data, error } = await supabase
      .from('social_links')
      .select('*')
      .limit(1);
    if (error) throw error;
    testResults.push({
      test: 'Social Links Table (Public Read)',
      status: 'success',
      message: `Can read social links for approved profiles. Found ${data?.length || 0} records.`,
    });
  } catch (error: any) {
    testResults.push({
      test: 'Social Links Table (Public Read)',
      status: 'error',
      message: error.message,
    });
  }

  // Test 4: Check admin_users table (should fail for public)
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('count');
    if (error) throw error;
    testResults.push({
      test: 'Admin Users Table (Public Access)',
      status: 'error',
      message: 'WARNING: Public can access admin table! This should be blocked.',
    });
  } catch (error: any) {
    testResults.push({
      test: 'Admin Users Table (Public Access)',
      status: 'success',
      message: 'Correctly blocked public access to admin table.',
    });
  }

  // Test 5: Check submission_logs table (should fail for public read)
  try {
    const { data, error } = await supabase
      .from('submission_logs')
      .select('count');
    if (error) throw error;
    testResults.push({
      test: 'Submission Logs Table (Public Read)',
      status: 'error',
      message: 'WARNING: Public can read submission logs! This should be blocked.',
    });
  } catch (error: any) {
    testResults.push({
      test: 'Submission Logs Table (Public Read)',
      status: 'success',
      message: 'Correctly blocked public read access to submission logs.',
    });
  }

  // Test 6: Test public insert (should succeed)
  try {
    const testProfile = {
      primary_platform: 'Instagram' as const,
      primary_handle: '@test_user',
      full_name: 'Test User',
      category: 'Test Category',
      location: 'Lagos',
      bio: 'This is a test profile to verify database functionality.',
      status: 'pending' as const,
    };

    const { data, error } = await (supabase as any)
      .from('profiles')
      .insert(testProfile)
      .select()
      .single();

    if (error) throw error;

    testResults.push({
      test: 'Insert Test Profile (Public)',
      status: 'success',
      message: 'Successfully inserted test profile as pending',
      data: data,
    });

    // Test 7: Verify test profile is NOT visible to public (since it's pending)
    if (data) {
      const { data: publicData, error: publicError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.id)
        .single();

      if (publicError || !publicData) {
        testResults.push({
          test: 'Pending Profile Visibility',
          status: 'success',
          message: 'Correctly blocked: Pending profiles are not visible to public',
        });
      } else {
        testResults.push({
          test: 'Pending Profile Visibility',
          status: 'error',
          message: 'WARNING: Pending profile is visible to public! Should be blocked.',
        });
      }

      // Test 8: Admin can see all profiles (using service role)
      try {
        const { data: adminData, error: adminError } = await serverClient
          .from('profiles')
          .select('*')
          .eq('id', data.id)
          .single();

        if (adminError) throw adminError;

        testResults.push({
          test: 'Admin Access (Service Role)',
          status: 'success',
          message: 'Admin can see all profiles including pending',
          data: adminData,
        });
      } catch (error: any) {
        testResults.push({
          test: 'Admin Access (Service Role)',
          status: 'error',
          message: error.message,
        });
      }

      // Clean up: delete the test profile (using service role)
      await serverClient.from('profiles').delete().eq('id', data.id);
    }
  } catch (error: any) {
    testResults.push({
      test: 'Insert Test Profile (Public)',
      status: 'error',
      message: error.message,
    });
  }

  return NextResponse.json({ results: testResults });
}
