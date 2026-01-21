'use client';

import { Profile, PrimaryPlatform } from '@/lib/types';

interface HeroSliderProps {
    profiles: Profile[];
}

// Platform icons
const PlatformIcon = ({ platform }: { platform: PrimaryPlatform }) => {
    if (platform === 'Instagram') {
        return (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
        );
    }
    if (platform === 'TikTok') {
        return (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
            </svg>
        );
    }
    return (
        <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
};

function getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function getColor(name: string): string {
    const colors = ['#8B7355', '#7A8B6E', '#6E7A8B', '#8B6E7A', '#7A6E8B', '#6E8B7A'];
    return colors[name.length % colors.length];
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

export default function HeroSlider({ profiles }: HeroSliderProps) {
    return (
        <div
            style={{
                display: 'flex',
                gap: '1.25rem',
                overflowX: 'auto',
                paddingBottom: '1rem',
                paddingLeft: 'max(1.5rem, calc((100vw - 1400px) / 2 + 4rem))',
                paddingRight: '2rem',
                scrollSnapType: 'x mandatory',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
            }}
        >
            {profiles.slice(0, 12).map((profile, index) => (
                <div
                    key={profile.id}
                    className="fade-in"
                    style={{
                        animationDelay: `${index * 80}ms`,
                        flexShrink: 0,
                        width: '180px',
                        backgroundColor: '#fff',
                        border: '1px solid var(--color-border)',
                        overflow: 'hidden',
                        scrollSnapAlign: 'start',
                        transition: 'transform 300ms ease, box-shadow 300ms ease',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                >
                    {/* Mini Header */}
                    <div
                        style={{
                            height: '48px',
                            background: `linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)`,
                            position: 'relative',
                        }}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                top: '8px',
                                right: '8px',
                                width: '18px',
                                height: '18px',
                                backgroundColor: 'rgba(255,255,255,0.9)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <PlatformIcon platform={profile.primary_platform} />
                        </div>
                    </div>

                    {/* Avatar */}
                    <div style={{ marginTop: '-20px', paddingLeft: '12px' }}>
                        <div
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                backgroundColor: getColor(profile.full_name),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px solid #fff',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                            }}
                        >
                            <span style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 500 }}>
                                {getInitials(profile.full_name)}
                            </span>
                        </div>
                    </div>

                    {/* Info */}
                    <div style={{ padding: '8px 12px 14px' }}>
                        <p style={{ fontWeight: 500, fontSize: '0.8125rem', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {profile.full_name}
                        </p>
                        <p style={{ fontSize: '0.625rem', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {toSingular(profile.category)}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
