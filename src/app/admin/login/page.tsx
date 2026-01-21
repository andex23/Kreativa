'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Simple password check (in production, use proper auth)
    const ADMIN_PASSWORD = 'kreativa2026';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        if (password === ADMIN_PASSWORD) {
            // Store auth in session
            sessionStorage.setItem('kreativa_admin', 'true');
            router.push('/admin');
        } else {
            setError('Invalid password');
        }
        setIsLoading(false);
    };

    return (
        <section>
            <div className="container">
                <div
                    style={{
                        maxWidth: '400px',
                        margin: '0 auto',
                        padding: '4rem 0',
                    }}
                >
                    <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>Admin Login</h1>

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Enter admin password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {error && (
                                <p style={{ color: '#c9746a', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                                    {error}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isLoading}
                            style={{
                                width: '100%',
                                opacity: isLoading ? 0.7 : 1,
                            }}
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <p
                        style={{
                            fontSize: '0.75rem',
                            color: 'var(--color-text-secondary)',
                            textAlign: 'center',
                            marginTop: '2rem',
                        }}
                    >
                        Demo password: kreativa2026
                    </p>
                </div>
            </div>
        </section>
    );
}
