'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const categories = [
    { name: 'All Categories', value: 'all', href: '/categories' },
    { name: 'Photography', value: 'photography', href: '/categories/photography' },
    { name: 'Graphic Design', value: 'graphic-design', href: '/categories/graphic-design' },
    { name: 'Fashion', value: 'fashion', href: '/categories/fashion' },
    { name: 'Content Creation', value: 'content-creation', href: '/categories/content-creation' },
    { name: 'Art', value: 'art', href: '/categories/art' },
    { name: 'Music', value: 'music', href: '/categories/music' },
    { name: 'Writing', value: 'writing', href: '/categories/writing' },
    { name: 'Other', value: 'other', href: '/categories/other' },
];

export default function Navigation() {
    const pathname = usePathname();
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

    const isActive = (path: string) => pathname === path;

    return (
        <header
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                backgroundColor: 'rgba(250, 248, 245, 0.95)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid var(--color-border)',
            }}
        >
            <nav className="container">
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        height: '60px',
                    }}
                >
                    {/* Logo */}
                    <Link
                        href="/"
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1rem',
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                        }}
                    >
                        Kreativa
                    </Link>

                    {/* Nav Links */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.75rem',
                        }}
                    >
                        {/* Categories Dropdown */}
                        <div
                            style={{ position: 'relative' }}
                            onMouseEnter={() => setIsCategoriesOpen(true)}
                            onMouseLeave={() => setIsCategoriesOpen(false)}
                        >
                            <Link
                                href="/categories"
                                style={{
                                    fontFamily: 'var(--font-display)',
                                    fontSize: '0.625rem',
                                    letterSpacing: '0.15em',
                                    textTransform: 'uppercase',
                                    color: isActive('/categories') || pathname?.startsWith('/browse') ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                                    transition: 'color 150ms ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    textDecoration: 'none'
                                }}
                            >
                                Categories
                                <span style={{ fontSize: '0.5rem', transform: isCategoriesOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms ease' }}>
                                    ▼
                                </span>
                            </Link>

                            {/* Dropdown Menu */}
                            {isCategoriesOpen && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: '-1rem',
                                        paddingTop: '0.5rem',
                                    }}
                                >
                                    <div
                                        style={{
                                            background: 'var(--color-bg-card)',
                                            border: '1px solid var(--color-border)',
                                            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                                            minWidth: '220px',
                                            zIndex: 1000
                                        }}
                                        className="dropdown-menu"
                                    >
                                        {categories.map((category, index) => (
                                            <Link
                                                key={category.value}
                                                href={category.href}
                                                className="dropdown-item"
                                                style={{
                                                    display: 'block',
                                                    padding: '0.875rem 1.25rem',
                                                    fontFamily: 'var(--font-body)',
                                                    fontSize: '0.875rem',
                                                    color: 'var(--color-text-primary)',
                                                    borderBottom: index < categories.length - 1 ? '1px solid var(--color-border)' : 'none',
                                                    textDecoration: 'none'
                                                }}
                                            >
                                                {category.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <Link
                            href="/about"
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '0.625rem',
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase',
                                color: isActive('/about') ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                                transition: 'color 150ms ease',
                            }}
                        >
                            About
                        </Link>
                        <Link
                            href="/submit"
                            className="btn"
                            style={{
                                padding: '0.5rem 1rem',
                                fontSize: '0.5625rem',
                            }}
                        >
                            Submit Profile
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
    );
}
