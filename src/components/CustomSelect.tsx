'use client';

import { useState, useRef, useEffect } from 'react';

interface CustomSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
    label?: string;
}

export default function CustomSelect({ value, onChange, options, placeholder = 'Select', label }: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(o => o.value === value);

    return (
        <div ref={ref} style={{ position: 'relative' }}>
            {label && (
                <label style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.625rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    color: 'var(--color-text-secondary)',
                    display: 'block',
                    marginBottom: '0.5rem',
                }}>
                    {label}
                </label>
            )}

            {/* Trigger */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '100%',
                    padding: '0.875rem 0',
                    paddingRight: '1.5rem',
                    border: 'none',
                    borderBottom: '1px solid var(--color-border)',
                    background: 'transparent',
                    color: value ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.8125rem',
                    letterSpacing: '0.02em',
                    textAlign: 'left',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'border-color 150ms ease',
                }}
            >
                {selectedOption?.label || placeholder}
                <span style={{
                    position: 'absolute',
                    right: '4px',
                    top: '50%',
                    transform: isOpen ? 'translateY(-50%) rotate(180deg)' : 'translateY(-50%)',
                    transition: 'transform 200ms ease',
                    fontSize: '0.625rem',
                    color: 'var(--color-text-secondary)',
                }}>
                    ▼
                </span>
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        backgroundColor: '#fff',
                        border: '1px solid var(--color-border)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                        zIndex: 100,
                        maxHeight: '240px',
                        overflowY: 'auto',
                    }}
                >
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                border: 'none',
                                background: value === option.value ? 'var(--color-bg-secondary)' : 'transparent',
                                color: 'var(--color-text-primary)',
                                fontFamily: 'var(--font-display)',
                                fontSize: '0.75rem',
                                letterSpacing: '0.02em',
                                textAlign: 'left',
                                cursor: 'pointer',
                                transition: 'background-color 150ms ease',
                            }}
                            onMouseEnter={(e) => {
                                if (value !== option.value) {
                                    e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (value !== option.value) {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }
                            }}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
