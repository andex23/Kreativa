'use client';

import { useState, useMemo } from 'react';
import { FilterState, Profile, Category, Location, PrimaryPlatform } from '@/lib/types';
import { useProfiles } from '@/hooks/useProfiles';
import { CATEGORIES, LOCATIONS } from '@/lib/constants';
import ProfileGrid from '@/components/ProfileGrid';
import ProfileModal from '@/components/ProfileModal';
import CustomSelect from '@/components/CustomSelect';

const PLATFORMS: { value: PrimaryPlatform | ''; label: string }[] = [
    { value: '', label: 'All Platforms' },
    { value: 'Instagram', label: 'Instagram' },
    { value: 'TikTok', label: 'TikTok' },
    { value: 'Twitter', label: 'Twitter' },
];

const LOCATION_OPTIONS = [
    { value: '', label: 'All Locations' },
    ...LOCATIONS.map(l => ({ value: l, label: l })),
];

const CATEGORY_OPTIONS = [
    { value: '', label: 'All Categories' },
    ...CATEGORIES.map(c => ({ value: c, label: c })),
];

export default function BrowsePage() {
    const { profiles } = useProfiles();
    const [filters, setFilters] = useState<FilterState>({
        search: '',
        category: '',
        location: '',
        platform: '',
    });
    const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

    const hasActiveFilters = filters.search || filters.category || filters.location || filters.platform;

    const filteredProfiles = useMemo(() => {
        const approved = profiles.filter((profile: Profile) => profile.status === 'approved');

        // Sort by follower count (highest ranking) when no filters
        const sorted = [...approved].sort((a, b) => (b.follower_count || 0) - (a.follower_count || 0));

        if (!hasActiveFilters) return sorted;

        return sorted.filter((profile: Profile) => {
            if (filters.search) {
                const s = filters.search.toLowerCase();
                if (!profile.full_name.toLowerCase().includes(s) &&
                    !profile.bio.toLowerCase().includes(s) &&
                    !profile.primary_handle.toLowerCase().includes(s)) return false;
            }
            if (filters.category && profile.category !== filters.category) return false;
            if (filters.location && profile.location !== filters.location) return false;
            if (filters.platform && profile.primary_platform !== filters.platform) return false;
            return true;
        });
    }, [filters, hasActiveFilters, profiles]);

    return (
        <>
            <section style={{ paddingBottom: 0 }}>
                <div className="container">
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <h1 style={{ marginBottom: '0.75rem', fontSize: 'clamp(1.75rem, 4vw, 2.25rem)' }}>Browse Creatives</h1>
                        <p style={{ color: 'var(--color-text-secondary)', maxWidth: '500px', margin: '0 auto', fontSize: '1rem' }}>
                            Discover talented photographers, designers, artists, and creators across Nigeria.
                        </p>
                    </div>

                    {/* Filters Row - Properly Aligned */}
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: '1.5rem',
                            paddingBottom: '2rem',
                            borderBottom: '1px solid var(--color-border)',
                        }}
                        className="filters-grid"
                    >
                        {/* Search */}
                        <div>
                            <label style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '0.625rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.15em',
                                color: 'var(--color-text-secondary)',
                                display: 'block',
                                marginBottom: '0.5rem',
                            }}>Search</label>
                            <input
                                type="text"
                                placeholder="Name or keywords..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                style={{
                                    width: '100%',
                                    fontFamily: 'var(--font-display)',
                                    fontSize: '0.8125rem',
                                    letterSpacing: '0.02em',
                                }}
                            />
                        </div>

                        {/* Category */}
                        <CustomSelect
                            label="Category"
                            value={filters.category}
                            onChange={(val) => setFilters({ ...filters, category: val as Category | '' })}
                            options={CATEGORY_OPTIONS}
                            placeholder="All Categories"
                        />

                        {/* Location */}
                        <CustomSelect
                            label="Location"
                            value={filters.location}
                            onChange={(val) => setFilters({ ...filters, location: val as Location | '' })}
                            options={LOCATION_OPTIONS}
                            placeholder="All Locations"
                        />

                        {/* Platform */}
                        <CustomSelect
                            label="Platform"
                            value={filters.platform}
                            onChange={(val) => setFilters({ ...filters, platform: val as PrimaryPlatform | '' })}
                            options={PLATFORMS}
                            placeholder="All Platforms"
                        />
                    </div>

                    {/* Results Info */}
                    <div style={{ padding: '1.5rem 0', textAlign: 'center' }}>
                        <p
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '0.75rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.15em',
                                color: 'var(--color-text-secondary)',
                            }}
                        >
                            {hasActiveFilters
                                ? `${filteredProfiles.length} creative${filteredProfiles.length !== 1 ? 's' : ''} found`
                                : 'Top Creatives'
                            }
                        </p>
                    </div>
                </div>
            </section>

            {/* Profile Grid */}
            <section style={{ paddingTop: 0 }}>
                <div className="container">
                    <ProfileGrid
                        profiles={filteredProfiles}
                        onProfileClick={(profile) => setSelectedProfile(profile)}
                    />
                </div>
            </section>

            {/* Modal */}
            {selectedProfile && (
                <ProfileModal
                    profile={selectedProfile}
                    onClose={() => setSelectedProfile(null)}
                />
            )}

            <style jsx>{`
        @media (max-width: 900px) {
          .filters-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 500px) {
          .filters-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
        </>
    );
}
