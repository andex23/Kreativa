export default function TermsPage() {
    return (
        <section>
            <div className="container">
                <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                    <h1 style={{ marginBottom: '0.5rem' }}>Terms of Service</h1>
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
                            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>1. Acceptance of Terms</h2>
                            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                                By submitting a profile to Kreativa or using our website, you agree to these Terms
                                of Service. If you do not agree to these terms, please do not use our service.
                            </p>
                        </div>

                        <div>
                            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>2. Service Description</h2>
                            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                                Kreativa is a directory service that connects Nigerian creatives with potential
                                clients and collaborators. We display profile information and link to public
                                Instagram accounts. We are not affiliated with Instagram or Meta.
                            </p>
                        </div>

                        <div>
                            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>3. User Responsibilities</h2>
                            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '0.75rem' }}>
                                When submitting a profile, you represent that:
                            </p>
                            <ul style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, paddingLeft: '1.5rem' }}>
                                <li>You own the Instagram account you are submitting</li>
                                <li>The information you provide is accurate</li>
                                <li>You consent to being listed publicly on Kreativa</li>
                                <li>Your profile does not contain offensive or illegal content</li>
                            </ul>
                        </div>

                        <div>
                            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>4. Our Rights</h2>
                            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '0.75rem' }}>
                                Kreativa reserves the right to:
                            </p>
                            <ul style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, paddingLeft: '1.5rem' }}>
                                <li>Approve, reject, or remove profiles at any time</li>
                                <li>Modify or edit submitted information for clarity</li>
                                <li>Change these terms with reasonable notice</li>
                                <li>Terminate the service at any time</li>
                            </ul>
                        </div>

                        <div>
                            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>5. Intellectual Property</h2>
                            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                                You retain all rights to your creative work. Kreativa does not claim ownership
                                of your content. By submitting, you grant us a license to display your profile
                                information on our platform. Instagram profile images and content remain your property.
                            </p>
                        </div>

                        <div>
                            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>6. Disclaimers</h2>
                            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '0.75rem' }}>
                                The service is provided &quot;as is&quot; without warranties of any kind. We make no guarantees regarding:
                            </p>
                            <ul style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, paddingLeft: '1.5rem' }}>
                                <li>Profile approval or visibility</li>
                                <li>Traffic, opportunities, or business outcomes</li>
                                <li>The accuracy of information in listings</li>
                                <li>Third-party content including Instagram</li>
                            </ul>
                        </div>

                        <div>
                            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>7. Profile Removal</h2>
                            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                                You can request removal of your profile at any time by contacting us at
                                hello@kreativa.ng. We will process removal requests within 24 hours.
                            </p>
                        </div>

                        <div>
                            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>8. Contact</h2>
                            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                                For questions about these terms, contact us at hello@kreativa.ng.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
