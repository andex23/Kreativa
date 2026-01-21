'use client';

import { Profile } from '@/lib/types';
import ProfileCard from './ProfileCard';

interface ProfileGridProps {
    profiles: Profile[];
    loading?: boolean;
    onProfileClick?: (profile: Profile) => void;
}

// Skeleton card for loading state
function SkeletonCard() {
    return (
        <div className="card skeleton" style={{ minHeight: '280px' }}>
            {/* Header skeleton */}
            <div
                style={{
                    height: '100px',
                    backgroundColor: 'var(--color-bg-secondary)',
                    marginBottom: '-30px',
                }}
            />
            {/* Avatar skeleton */}
            <div
                style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-border)',
                    marginLeft: '1rem',
                    marginBottom: '1rem',
                    border: '4px solid #fff',
                }}
            />
            {/* Content skeleton */}
            <div style={{ padding: '0 1rem 1rem' }}>
                <div
                    style={{
                        width: '70%',
                        height: '1rem',
                        backgroundColor: 'var(--color-bg-secondary)',
                        marginBottom: '0.5rem',
                        borderRadius: '2px',
                    }}
                />
                <div
                    style={{
                        width: '50%',
                        height: '0.75rem',
                        backgroundColor: 'var(--color-bg-secondary)',
                        borderRadius: '2px',
                    }}
                />
            </div>
            {/* Stats skeleton */}
            <div
                style={{
                    display: 'flex',
                    borderTop: '1px solid var(--color-border)',
                    padding: '1rem 0',
                }}
            >
                {[1, 2, 3].map((i) => (
                    <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                        <div
                            style={{
                                width: '40%',
                                height: '0.75rem',
                                backgroundColor: 'var(--color-bg-secondary)',
                                margin: '0 auto 0.25rem',
                                borderRadius: '2px',
                            }}
                        />
                        <div
                            style={{
                                width: '30%',
                                height: '1rem',
                                backgroundColor: 'var(--color-bg-secondary)',
                                margin: '0 auto',
                                borderRadius: '2px',
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function ProfileGrid({ profiles, loading, onProfileClick }: ProfileGridProps) {
    if (loading) {
        return (
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '1.5rem',
                    padding: '2rem 0',
                }}
            >
                {[...Array(6)].map((_, i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>
        );
    }

    if (profiles.length === 0) {
        return (
            <div
                style={{
                    textAlign: 'center',
                    padding: '5rem 2rem',
                }}
            >
                <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎨</p>
                <h3
                    style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.25rem',
                        marginBottom: '1rem',
                    }}
                >
                    No creatives yet
                </h3>
                <p
                    style={{
                        color: 'var(--color-text-secondary)',
                        fontSize: '0.9375rem',
                        marginBottom: '1.5rem',
                    }}
                >
                    Be the first to join! Submit your profile to get featured.
                </p>
                <a
                    href="/submit"
                    className="btn btn-primary"
                    style={{ display: 'inline-block' }}
                >
                    Submit Your Profile
                </a>
            </div>
        );
    }

    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '1.5rem',
                padding: '2rem 0',
            }}
        >
            {profiles.map((profile, index) => (
                <div
                    key={profile.id}
                    className="fade-in"
                    style={{
                        animationDelay: `${index * 50}ms`,
                    }}
                >
                    <ProfileCard profile={profile} onClick={() => onProfileClick?.(profile)} />
                </div>
            ))}
        </div>
    );
}
