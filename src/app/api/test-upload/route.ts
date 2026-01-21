import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/client';

export async function POST(request: Request) {
    try {
        const { base64Image } = await request.json();

        // Check if service role key exists
        if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
            return NextResponse.json({
                success: false,
                error: 'SUPABASE_SERVICE_ROLE_KEY not found in environment'
            }, { status: 500 });
        }

        const supabase = createServerClient();

        // Convert base64 to buffer
        const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        // Try uploading to profile-photos bucket
        const fileName = `test_${Date.now()}.jpg`;

        const { data, error } = await supabase
            .storage
            .from('profile-photos')
            .upload(fileName, buffer, {
                contentType: 'image/jpeg',
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            return NextResponse.json({
                success: false,
                error: error.message,
                errorDetails: error,
                hint: 'Check if bucket exists and is public, or if RLS policies are blocking'
            }, { status: 400 });
        }

        // Get public URL
        const { data: { publicUrl } } = supabase
            .storage
            .from('profile-photos')
            .getPublicUrl(data.path);

        return NextResponse.json({
            success: true,
            message: 'Upload successful! ✅',
            url: publicUrl,
            path: data.path,
            bucket: 'profile-photos'
        });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
