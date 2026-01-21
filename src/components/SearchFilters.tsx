'use client';

import { FilterState, Category, Location, PrimaryPlatform } from '@/lib/types';
import { CATEGORIES, LOCATIONS } from '@/lib/constants';

interface SearchFiltersProps {
    filters: FilterState;
    onFilterChange: (filters: FilterState) => void;
    resultCount: number;
}

const PLATFORMS: { value: PrimaryPlatform; label: string }[] = [
    { value: 'Instagram', label: 'Instagram' },
    { value: 'TikTok', label: 'TikTok' },
    { value: 'Twitter', label: 'Twitter' },
];

export default function SearchFilters({ filters, onFilterChange, resultCount }: SearchFiltersProps) {
    const hasActiveFilters = filters.search || filters.category || filters.location || filters.platform;

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
                padding: '2.5rem 0',
                borderBottom: '1px solid var(--color-border)',
            }}
        >
            {/* Filters Grid */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '2rem',
                }}
            >
                {/* Search */}
                <div>
                    <label htmlFor="search">Search</label>
                    <input
                        id="search"
                        type="text"
                        placeholder="Name or keywords..."
                        value={filters.search}
                        onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
                    />
                </div>

                {/* Category */}
                <div>
                    <label htmlFor="category">Category</label>
                    <select
                        id="category"
                        value={filters.category}
                        onChange={(e) => onFilterChange({ ...filters, category: e.target.value as Category | '' })}
                    >
                        <option value="">All Categories</option>
                        {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                {/* Location */}
                <div>
                    <label htmlFor="location">Location</label>
                    <select
                        id="location"
                        value={filters.location}
                        onChange={(e) => onFilterChange({ ...filters, location: e.target.value as Location | '' })}
                    >
                        <option value="">All Locations</option>
                        {LOCATIONS.map((loc) => (
                            <option key={loc} value={loc}>{loc}</option>
                        ))}
                    </select>
                </div>

                {/* Platform */}
                <div>
                    <label htmlFor="platform">Platform</label>
                    <select
                        id="platform"
                        value={filters.platform}
                        onChange={(e) => onFilterChange({ ...filters, platform: e.target.value as PrimaryPlatform | '' })}
                    >
                        <option value="">All Platforms</option>
                        {PLATFORMS.map((p) => (
                            <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Results Row */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <p
                    style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.6875rem',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: 'var(--color-text-secondary)',
                    }}
                >
                    {resultCount} creative{resultCount !== 1 ? 's' : ''} found
                </p>

                {hasActiveFilters && (
                    <button
                        onClick={() => onFilterChange({ search: '', category: '', location: '', platform: '' })}
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '0.625rem',
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            color: 'var(--color-accent)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0,
                            borderBottom: '1px solid currentColor',
                        }}
                    >
                        Clear All
                    </button>
                )}
            </div>
        </div>
    );
}
