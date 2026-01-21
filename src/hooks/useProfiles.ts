'use client';

import { useState, useEffect } from 'react';
import { Profile } from '@/lib/types';
import { supabase } from '@/lib/supabase/client';

export function useProfiles() {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                // Fetch approved profiles (public)
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('status', 'approved')
                    .order('follower_count', { ascending: false });

                if (error) {
                    console.error('Error fetching profiles:', error);
                    setProfiles([]);
                } else {
                    setProfiles(data as Profile[] || []);
                }
            } catch (err) {
                console.error(err);
                setProfiles([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfiles();

        // Realtime subscription for updates
        const channel = supabase
            .channel('public_profiles')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles', filter: 'status=eq.approved' }, () => {
                fetchProfiles();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    // Return setProfiles just in case, but it mostly updates local state
    return { profiles, setProfiles, isLoading };
}
