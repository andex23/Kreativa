'use client';

import { Profile, PrimaryPlatform } from '@/lib/types';

interface ProfileCardProps {
    profile: Profile;
    onClick?: () => void;
}

// Platform SVG icons (clean, no text)
const PlatformIcon = ({ platform }: { platform: PrimaryPlatform }) => {
    if (platform === 'Instagram') {
        return (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
        );
    }
    if (platform === 'TikTok') {
        return (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
            </svg>
        );
    }
    // Twitter/X
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
};

// Generate initials
function getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

// Generate colors
function getColors(name: string): { avatar: string; banner: string } {
    const colorPairs = [
        { avatar: '#8B7355', banner: 'linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%)' },
        { avatar: '#7A8B6E', banner: 'linear-gradient(145deg, #1e2a1e 0%, #2d3d2d 100%)' },
        { avatar: '#6E7A8B', banner: 'linear-gradient(145deg, #1a1e2a 0%, #2a3040 100%)' },
        { avatar: '#8B6E7A', banner: 'linear-gradient(145deg, #2a1a1e 0%, #3d2a30 100%)' },
        { avatar: '#7A6E8B', banner: 'linear-gradient(145deg, #1e1a2a 0%, #2d2840 100%)' },
        { avatar: '#6E8B7A', banner: 'linear-gradient(145deg, #1a2a1e 0%, #284030 100%)' },
    ];
    return colorPairs[name.length % colorPairs.length];
}

// Format count
function formatCount(count?: number): string {
    if (!count) return '0';
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
}

// Generate stats
function generateStats(name: string, followerCount?: number) {
    const seed = name.length + (name.charCodeAt(0) || 0);
    return {
        following: Math.floor(seed * 7.3) + 50,
        followers: followerCount || Math.floor(seed * 123) + 100,
        posts: Math.floor(seed * 4.7) + 20,
    };
}

// Convert plural category to singular for display
function toSingular(category: string): string {
    const mapping: Record<string, string> = {
        'Photographers': 'Photographer',
        'Graphic Designers': 'Graphic Designer',
        'Visual Artists': 'Visual Artist',
        'Fashion Designers': 'Fashion Designer',
        'Makeup Artists': 'Makeup Artist',
        'Content Creators': 'Content Creator',
        'Videographers': 'Videographer',
        'Illustrators': 'Illustrator',
        'Creative Directors': 'Creative Director',
        'UI/UX Designers': 'UI/UX Designer',
        'Music Producers': 'Music Producer',
        'Writers': 'Writer',
        'Fashion Stylists': 'Fashion Stylist',
        'Art Directors': 'Art Director',
        'Digital Artists': 'Digital Artist',
    };
    return mapping[category] || category;
}

export default function ProfileCard({ profile, onClick }: ProfileCardProps) {
    const initials = getInitials(profile.full_name);
    const colors = getColors(profile.full_name);
    const stats = generateStats(profile.full_name, profile.follower_count);

    return (
        <div onClick={onClick} style={{ cursor: 'pointer' }}>
            <article
                style={{
                    backgroundColor: '#ffffff',
                    overflow: 'hidden',
                    transition: 'transform 400ms ease, box-shadow 400ms ease',
                }}
                className="card"
            >
                {/* Header Banner */}
                <div
                    style={{
                        height: '90px',
                        background: profile.header_image_url
                            ? `url(${profile.header_image_url}) center/cover`
                            : colors.banner,
                        position: 'relative',
                    }}
                >
                    {/* Platform Icon - Top Right, Clean */}
                    <div
                        style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            width: '28px',
                            height: '28px',
                            backgroundColor: 'rgba(255,255,255,0.95)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#2B2B2B',
                        }}
                    >
                        <PlatformIcon platform={profile.primary_platform} />
                    </div>
                </div>

                {/* Avatar - Overlapping */}
                <div
                    style={{
                        marginTop: '-36px',
                        paddingLeft: '20px',
                        position: 'relative',
                        zIndex: 10,
                    }}
                >
                    <div
                        style={{
                            width: '72px',
                            height: '72px',
                            borderRadius: '50%',
                            backgroundColor: profile.profile_photo_url ? 'transparent' : colors.avatar,
                            backgroundImage: profile.profile_photo_url ? `url(${profile.profile_photo_url})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '3px solid #ffffff',
                            boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
                        }}
                    >
                        {!profile.profile_photo_url && (
                            <span
                                style={{
                                    fontFamily: 'var(--font-body)',
                                    fontSize: '1.5rem',
                                    fontWeight: 500,
                                    color: '#ffffff',
                                    letterSpacing: '-0.02em',
                                }}
                            >
                                {initials}
                            </span>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div style={{ padding: '12px 20px 16px' }}>
                    {/* Name */}
                    <h3
                        style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '1rem',
                            fontWeight: 600,
                            marginBottom: '2px',
                            letterSpacing: '-0.01em',
                        }}
                    >
                        {profile.full_name}
                    </h3>

                    {/* Handle */}
                    <p
                        style={{
                            fontSize: '0.8125rem',
                            color: 'var(--color-text-secondary)',
                            marginBottom: '8px',
                        }}
                    >
                        @{profile.primary_handle}
                    </p>

                    {/* Category & Location */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '10px',
                        }}
                    >
                        <span
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '0.625rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.12em',
                                color: 'var(--color-text-secondary)',
                            }}
                        >
                            {toSingular(profile.category)}
                        </span>
                        <span style={{ color: 'var(--color-border)' }}>·</span>
                        <span
                            style={{
                                fontSize: '0.75rem',
                                color: 'var(--color-text-secondary)',
                            }}
                        >
                            {profile.location}
                        </span>
                    </div>

                    {/* Bio */}
                    <p
                        style={{
                            fontSize: '0.8125rem',
                            lineHeight: 1.55,
                            color: 'var(--color-text-primary)',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            minHeight: '2.5rem',
                            opacity: 0.85,
                        }}
                    >
                        {profile.bio}
                    </p>
                </div>

                {/* Stats Row */}
                <div
                    style={{
                        display: 'flex',
                        borderTop: '1px solid var(--color-border)',
                    }}
                >
                    {[
                        { label: 'Following', value: stats.following },
                        { label: 'Followers', value: stats.followers },
                        { label: 'Posts', value: stats.posts },
                    ].map((stat, i) => (
                        <div
                            key={stat.label}
                            style={{
                                flex: 1,
                                textAlign: 'center',
                                padding: '14px 0',
                                borderRight: i < 2 ? '1px solid var(--color-border)' : 'none',
                            }}
                        >
                            <p
                                style={{
                                    fontFamily: 'var(--font-display)',
                                    fontSize: '0.5625rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.15em',
                                    color: 'var(--color-text-secondary)',
                                    marginBottom: '4px',
                                }}
                            >
                                {stat.label}
                            </p>
                            <p
                                style={{
                                    fontSize: '0.9375rem',
                                    fontWeight: 600,
                                    color: 'var(--color-text-primary)',
                                }}
                            >
                                {formatCount(stat.value)}
                            </p>
                        </div>
                    ))}
                </div>
            </article>
        </div>
    );
}
