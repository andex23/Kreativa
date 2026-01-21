'use client';

import { Profile, PrimaryPlatform } from '@/lib/types';

interface ProfileModalProps {
    profile: Profile;
    onClose: () => void;
}

// Platform config
const PLATFORM_CONFIG: Record<PrimaryPlatform, { icon: string; color: string; label: string }> = {
    Instagram: { icon: '📷', color: '#E1306C', label: 'View on Instagram' },
    TikTok: { icon: '🎵', color: '#000000', label: 'View on TikTok' },
    Twitter: { icon: '𝕏', color: '#1DA1F2', label: 'View on Twitter' },
};

// Generate initials from full name
function getInitials(name: string): string {
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

// Generate colors based on name
function getColors(name: string): { avatar: string; banner: string } {
    const colorPairs = [
        { avatar: '#C17F59', banner: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)' },
        { avatar: '#A8C9B8', banner: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' },
        { avatar: '#B8A8C9', banner: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)' },
        { avatar: '#C9B8A8', banner: 'linear-gradient(135deg, #373B44 0%, #4286f4 100%)' },
        { avatar: '#D4A574', banner: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)' },
        { avatar: '#8B9A6B', banner: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)' },
    ];
    const index = name.length % colorPairs.length;
    return colorPairs[index];
}

// Format count
function formatCount(count?: number): string {
    if (!count) return '0';
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
}

// Generate stats based on name
function generateStats(name: string, followerCount?: number) {
    const seed = name.length + (name.charCodeAt(0) || 0);
    return {
        following: Math.floor(seed * 7.3) + 50,
        followers: followerCount || Math.floor(seed * 123) + 100,
        posts: Math.floor(seed * 4.7) + 20,
    };
}

// Get platform URL
function getPlatformUrl(platform: PrimaryPlatform, handle: string): string {
    switch (platform) {
        case 'Instagram':
            return `https://instagram.com/${handle}`;
        case 'TikTok':
            return `https://tiktok.com/@${handle}`;
        case 'Twitter':
            return `https://twitter.com/${handle}`;
    }
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

// Get platform icon
function getLinkIcon(platform: string): string {
    const icons: Record<string, string> = {
        'Portfolio': '🌐',
        'Website': '🌐',
        'Behance': '🅱️',
        'Dribbble': '🏀',
        'LinkedIn': '💼',
        'Twitter/X': '𝕏',
        'YouTube': '▶️',
        'TikTok': '🎵',
        'Spotify': '🎧',
        'SoundCloud': '☁️',
        'Other': '🔗',
    };
    return icons[platform] || '🔗';
}

export default function ProfileModal({ profile, onClose }: ProfileModalProps) {
    const initials = getInitials(profile.full_name);
    const colors = getColors(profile.full_name);
    const stats = generateStats(profile.full_name, profile.follower_count);
    const platformConfig = PLATFORM_CONFIG[profile.primary_platform];
    const primaryUrl = getPlatformUrl(profile.primary_platform, profile.primary_handle);

    // Handle backdrop click
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Handle escape key
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    return (
        <div
            role="dialog"
            aria-modal="true"
            onKeyDown={handleKeyDown}
            onClick={handleBackdropClick}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(4px)',
                animation: 'fadeIn 300ms ease',
            }}
        >
            <div
                style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    width: '100%',
                    maxWidth: '600px',
                    maxHeight: '90vh',
                    overflow: 'hidden',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                    animation: 'slideUp 300ms ease',
                }}
            >
                {/* Header Banner */}
                <div
                    style={{
                        height: '160px',
                        background: profile.header_image_url
                            ? `url(${profile.header_image_url}) center/cover`
                            : colors.banner,
                        position: 'relative',
                    }}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            border: 'none',
                            color: '#fff',
                            fontSize: '1.25rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        ×
                    </button>

                    {/* Platform Badge */}
                    <div
                        style={{
                            position: 'absolute',
                            top: '1rem',
                            left: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            backgroundColor: 'rgba(255,255,255,0.95)',
                            padding: '0.5rem 0.75rem',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: 500,
                        }}
                    >
                        <span>{platformConfig.icon}</span>
                        <span style={{ color: platformConfig.color }}>{profile.primary_platform}</span>
                    </div>
                </div>

                {/* Avatar */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '-60px',
                        position: 'relative',
                        zIndex: 10,
                    }}
                >
                    <div
                        style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            backgroundColor: profile.profile_photo_url ? 'transparent' : colors.avatar,
                            backgroundImage: profile.profile_photo_url ? `url(${profile.profile_photo_url})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '5px solid #ffffff',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        }}
                    >
                        {!profile.profile_photo_url && (
                            <span
                                style={{
                                    fontFamily: 'var(--font-body)',
                                    fontSize: '2.5rem',
                                    fontWeight: 600,
                                    color: '#ffffff',
                                }}
                            >
                                {initials}
                            </span>
                        )}
                    </div>
                </div>

                {/* Content - Scrollable */}
                <div
                    style={{
                        padding: '1rem 2rem 2rem',
                        overflowY: 'auto',
                        maxHeight: 'calc(90vh - 220px)',
                    }}
                >
                    {/* Name & Handle */}
                    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
                            {profile.full_name}
                        </h2>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem' }}>
                            @{profile.primary_handle}
                        </p>
                    </div>

                    {/* Category & Location */}
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '1rem',
                            marginBottom: '1.5rem',
                            flexWrap: 'wrap',
                        }}
                    >
                        <span
                            style={{
                                backgroundColor: 'var(--color-bg-card)',
                                padding: '0.5rem 1rem',
                                borderRadius: '4px',
                                fontSize: '0.85rem',
                                fontFamily: 'var(--font-display)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                            }}
                        >
                            {toSingular(profile.category)}
                        </span>
                        <span
                            style={{
                                backgroundColor: 'var(--color-bg-card)',
                                padding: '0.5rem 1rem',
                                borderRadius: '4px',
                                fontSize: '0.85rem',
                            }}
                        >
                            📍 {profile.location}
                        </span>
                    </div>

                    {/* Stats Row */}
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '2.5rem',
                            marginBottom: '1.5rem',
                            padding: '1rem 0',
                            borderTop: '1px solid var(--color-border)',
                            borderBottom: '1px solid var(--color-border)',
                        }}
                    >
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: '1.25rem', fontWeight: 600 }}>{formatCount(stats.following)}</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Following</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: '1.25rem', fontWeight: 600 }}>{formatCount(stats.followers)}</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Followers</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: '1.25rem', fontWeight: 600 }}>{formatCount(stats.posts)}</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Posts</p>
                        </div>
                    </div>

                    {/* Full Bio */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h4 style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            About
                        </h4>
                        <p style={{ lineHeight: 1.7, color: 'var(--color-text-primary)' }}>
                            {profile.bio}
                        </p>
                    </div>

                    {/* Other Social Handles */}
                    {(profile.instagram_handle || profile.tiktok_handle || profile.twitter_handle) && (
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h4 style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Also on
                            </h4>
                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                {profile.instagram_handle && profile.primary_platform !== 'Instagram' && (
                                    <a
                                        href={`https://instagram.com/${profile.instagram_handle}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            padding: '0.5rem 0.75rem',
                                            backgroundColor: 'var(--color-bg-card)',
                                            borderRadius: '6px',
                                            textDecoration: 'none',
                                            color: 'var(--color-text-primary)',
                                            fontSize: '0.85rem',
                                        }}
                                    >
                                        📷 @{profile.instagram_handle}
                                    </a>
                                )}
                                {profile.tiktok_handle && profile.primary_platform !== 'TikTok' && (
                                    <a
                                        href={`https://tiktok.com/@${profile.tiktok_handle}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            padding: '0.5rem 0.75rem',
                                            backgroundColor: 'var(--color-bg-card)',
                                            borderRadius: '6px',
                                            textDecoration: 'none',
                                            color: 'var(--color-text-primary)',
                                            fontSize: '0.85rem',
                                        }}
                                    >
                                        🎵 @{profile.tiktok_handle}
                                    </a>
                                )}
                                {profile.twitter_handle && profile.primary_platform !== 'Twitter' && (
                                    <a
                                        href={`https://twitter.com/${profile.twitter_handle}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            padding: '0.5rem 0.75rem',
                                            backgroundColor: 'var(--color-bg-card)',
                                            borderRadius: '6px',
                                            textDecoration: 'none',
                                            color: 'var(--color-text-primary)',
                                            fontSize: '0.85rem',
                                        }}
                                    >
                                        𝕏 @{profile.twitter_handle}
                                    </a>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Social Links */}
                    {profile.social_links && profile.social_links.length > 0 && (
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h4 style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Links
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {profile.social_links.map((link, index) => (
                                    <a
                                        key={index}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            padding: '0.75rem 1rem',
                                            backgroundColor: 'var(--color-bg-card)',
                                            borderRadius: '6px',
                                            textDecoration: 'none',
                                            color: 'var(--color-text-primary)',
                                            transition: 'background-color 200ms ease',
                                        }}
                                    >
                                        <span style={{ fontSize: '1.1rem' }}>{getLinkIcon(link.platform)}</span>
                                        <span style={{ fontWeight: 500 }}>{link.platform}</span>
                                        <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                                            →
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Primary CTA */}
                    <a
                        href={primaryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            width: '100%',
                            padding: '1rem',
                        }}
                    >
                        <span>{platformConfig.icon}</span>
                        <span>{platformConfig.label}</span>
                        <span>→</span>
                    </a>
                </div>
            </div>

            <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
        </div>
    );
}
