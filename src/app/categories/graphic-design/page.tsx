'use client';

import Link from 'next/link';
import { useProfiles } from '@/hooks/useProfiles';
import ProfileCard from '@/components/ProfileCard';

export default function GraphicDesignPage() {
    const { profiles } = useProfiles();
    const categoryProfiles = profiles.filter(
        p => p.status === 'approved' && p.category.toLowerCase() === 'graphic-design'
    );

    return (
        <>
            <section style={{
                paddingTop: '2.5rem',
                paddingBottom: '2rem',
                position: 'relative',
                background: 'linear-gradient(135deg, rgba(139, 90, 43, 0.9) 0%, rgba(45, 85, 75, 0.9) 100%), url("https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1600&h=400&fit=crop")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundBlendMode: 'multiply',
            }}>
                <div className="container">
                    <div style={{ maxWidth: '650px', margin: '0 auto', textAlign: 'center', color: '#fff' }}>
                        <p style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '0.6875rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.2em',
                            color: 'rgba(255, 255, 255, 0.9)',
                            marginBottom: '1rem',
                            textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
                        }}>Graphic Design</p>
                        <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', marginBottom: '1.25rem', textShadow: '0 2px 10px rgba(0, 0, 0, 0.4)' }}>Graphic Designers</h1>
                        <p style={{ color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.8, fontSize: '1.0625rem', textShadow: '0 1px 5px rgba(0, 0, 0, 0.3)' }}>Discover talented designers creating stunning visual content.</p>
                    </div>
                </div>
            </section>

            <section style={{ padding: '3rem 0' }}>
                <div className="container">
                    {categoryProfiles.length > 0 ? (
                        <>
                            <p style={{ marginBottom: '2rem', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-display)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                {categoryProfiles.length} {categoryProfiles.length === 1 ? 'Designer' : 'Designers'}
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                {categoryProfiles.map((profile, index) => (
                                    <div
                                        key={profile.id}
                                        className="fade-in"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <ProfileCard profile={profile} onClick={() => { }} />
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>No designers found yet. Check back soon!</p>
                            <Link href="/submit" className="btn">Submit Your Profile</Link>
                        </div>
                    )}
                </div>
            </section>

            <section style={{ padding: '3rem 0', background: 'var(--color-bg-secondary)', borderTop: '1px solid var(--color-border)' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Explore Other Categories</h2>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem', fontSize: '1rem' }}>Browse all creative categories or submit your profile.</p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link href="/categories" className="btn">All Categories</Link>
                        <Link href="/submit" className="btn btn-secondary">Submit Profile</Link>
                    </div>
                </div>
            </section>
        </>
    );
}
