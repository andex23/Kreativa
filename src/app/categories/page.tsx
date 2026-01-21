'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useProfiles } from '@/hooks/useProfiles';

const categories = [
    {
        name: 'All Categories',
        value: 'all',
        description: 'Browse all creative talent',
        icon: '✦'
    },
    {
        name: 'Photography',
        value: 'photography',
        description: 'Professional photographers and visual artists',
        icon: '📸'
    },
    {
        name: 'Graphic Design',
        value: 'graphic-design',
        description: 'Designers creating stunning visual content',
        icon: '🎨'
    },
    {
        name: 'Fashion',
        value: 'fashion',
        description: 'Fashion designers and stylists',
        icon: '👗'
    },
    {
        name: 'Content Creation',
        value: 'content-creation',
        description: 'Video creators and content producers',
        icon: '🎬'
    },
    {
        name: 'Art',
        value: 'art',
        description: 'Artists and illustrators',
        icon: '🖼️'
    },
    {
        name: 'Music',
        value: 'music',
        description: 'Musicians and music producers',
        icon: '🎵'
    },
    {
        name: 'Writing',
        value: 'writing',
        description: 'Writers and copywriters',
        icon: '✍️'
    },
    {
        name: 'Other',
        value: 'other',
        description: 'Other creative professionals',
        icon: '⭐'
    }
];

export default function CategoriesPage() {
    const { profiles } = useProfiles();
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Count profiles per category
    const getCategoryCount = (categoryValue: string) => {
        if (categoryValue === 'all') {
            return profiles.filter(p => p.status === 'approved').length;
        }
        return profiles.filter(
            p => p.status === 'approved' && p.category.toLowerCase() === categoryValue
        ).length;
    };

    return (
        <>
            {/* Hero Section */}
            <section style={{ paddingTop: '2.5rem', paddingBottom: '2rem', background: 'var(--color-bg-secondary)' }}>
                <div className="container">
                    <div style={{ maxWidth: '650px', margin: '0 auto', textAlign: 'center' }}>
                        <p
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '0.6875rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.2em',
                                color: 'var(--color-text-secondary)',
                                marginBottom: '1rem',
                            }}
                        >
                            Browse by Category
                        </p>
                        <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', marginBottom: '1.25rem' }}>
                            Explore Creative Categories
                        </h1>
                        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, fontSize: '1.0625rem' }}>
                            Find the perfect creative professional for your next project. Browse by category or explore all talent.
                        </p>
                    </div>
                </div>
            </section>

            {/* Categories Grid */}
            <section style={{ padding: '3rem 0' }}>
                <div className="container">
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: '1.5rem',
                            marginBottom: '3rem'
                        }}
                    >
                        {categories.map((category) => {
                            const count = getCategoryCount(category.value);
                            return (
                                <Link
                                    key={category.value}
                                    href={category.value === 'all' ? '/browse' : `/browse?category=${category.value}`}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        padding: '2rem',
                                        border: '1px solid var(--color-border)',
                                        background: 'var(--color-bg-card)',
                                        transition: 'all 300ms ease',
                                        textDecoration: 'none',
                                        color: 'inherit'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--color-text-primary)';
                                        e.currentTarget.style.transform = 'translateY(-4px)';
                                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.08)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--color-border)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <span style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                                        {category.icon}
                                    </span>
                                    <h3
                                        style={{
                                            fontFamily: 'var(--font-display)',
                                            fontSize: '1.125rem',
                                            marginBottom: '0.5rem',
                                            fontWeight: 600
                                        }}
                                    >
                                        {category.name}
                                    </h3>
                                    <p
                                        style={{
                                            fontSize: '0.875rem',
                                            color: 'var(--color-text-secondary)',
                                            lineHeight: 1.6,
                                            marginBottom: '1rem',
                                            flex: 1
                                        }}
                                    >
                                        {category.description}
                                    </p>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            paddingTop: '1rem',
                                            borderTop: '1px solid var(--color-border)',
                                            fontSize: '0.75rem',
                                            fontFamily: 'var(--font-display)',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.1em'
                                        }}
                                    >
                                        <span style={{ color: 'var(--color-text-secondary)' }}>
                                            {count} {count === 1 ? 'Creative' : 'Creatives'}
                                        </span>
                                        <span style={{ color: 'var(--color-accent)' }}>
                                            Browse →
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{ padding: '3rem 0', background: 'var(--color-bg-secondary)', borderTop: '1px solid var(--color-border)' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                        Can&apos;t find what you&apos;re looking for?
                    </h2>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem', fontSize: '1rem' }}>
                        Browse all creatives or submit your profile to join our directory.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link href="/browse" className="btn">
                            Browse All
                        </Link>
                        <Link href="/submit" className="btn btn-secondary">
                            Submit Profile
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
