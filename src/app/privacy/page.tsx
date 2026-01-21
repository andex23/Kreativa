export default function PrivacyPage() {
    return (
        <section>
            <div className="container">
                <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                    <h1 style={{ marginBottom: '0.5rem' }}>Privacy Policy</h1>
                    <p
                        style={{
                            fontSize: '0.875rem',
                            color: 'var(--color-text-secondary)',
                            marginBottom: '3rem',
                        }}
                    >
                        Last updated: January 2026
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div>
                            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>1. Information We Collect</h2>
                            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '0.75rem' }}>
                                <strong>Information you provide:</strong>
                            </p>
                            <ul style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                                <li>Full name</li>
                                <li>Instagram handle</li>
                                <li>Category (profession)</li>
                                <li>Location</li>
                                <li>Bio</li>
                                <li>Portfolio URL (optional)</li>
                            </ul>
                            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '0.75rem' }}>
                                <strong>Technical information:</strong>
                            </p>
                            <ul style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, paddingLeft: '1.5rem' }}>
                                <li>Browser type and device information</li>
                                <li>Anonymized IP address</li>
                                <li>Pages visited and session duration</li>
                            </ul>
                        </div>

                        <div>
                            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>2. How We Use Your Information</h2>
                            <ul style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, paddingLeft: '1.5rem' }}>
                                <li>Display your profile publicly on Kreativa</li>
                                <li>Send email notifications about your submission status</li>
                                <li>Improve our website and user experience</li>
                                <li>Analyze usage patterns (anonymized)</li>
                                <li>Comply with legal obligations</li>
                            </ul>
                        </div>

                        <div>
                            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>3. Data Sharing</h2>
                            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '0.75rem' }}>
                                Your profile information is publicly visible on Kreativa. We do not sell or share
                                your personal data with third parties for marketing purposes.
                            </p>
                            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                                We use trusted service providers for hosting (Vercel), database (Supabase), and
                                analytics (privacy-focused tools). These providers process data in accordance
                                with their privacy policies.
                            </p>
                        </div>

                        <div>
                            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>4. Your Rights</h2>
                            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '0.75rem' }}>
                                You have the right to:
                            </p>
                            <ul style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, paddingLeft: '1.5rem' }}>
                                <li>Access the data we hold about you</li>
                                <li>Correct inaccurate information</li>
                                <li>Request deletion of your profile</li>
                                <li>Withdraw consent at any time</li>
                                <li>Opt out of analytics cookies</li>
                            </ul>
                        </div>

                        <div>
                            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>5. Data Security</h2>
                            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                                We use HTTPS encryption for all traffic. Your data is stored securely in our
                                database with access controls. Admin access is password-protected. We regularly
                                review and update our security practices.
                            </p>
                        </div>

                        <div>
                            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>6. Data Retention</h2>
                            <ul style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, paddingLeft: '1.5rem' }}>
                                <li><strong>Approved profiles:</strong> Kept until you request removal</li>
                                <li><strong>Rejected submissions:</strong> Deleted after 30 days</li>
                                <li><strong>Analytics data:</strong> Retained for up to 24 months</li>
                            </ul>
                        </div>

                        <div>
                            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>7. Cookies</h2>
                            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                                We use essential cookies for site functionality and admin authentication.
                                Analytics cookies are optional and respect your preferences. We do not use
                                marketing or advertising cookies.
                            </p>
                        </div>

                        <div>
                            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>8. Contact</h2>
                            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                                For privacy concerns or data requests, contact us at hello@kreativa.ng.
                                We aim to respond within 7 business days.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
