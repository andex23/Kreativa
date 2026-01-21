'use client';

const features = [
    {
        icon: '✦',
        title: 'Curated Quality',
        description: 'Every profile is reviewed to ensure only genuine, talented creatives are featured.',
        color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
        icon: '◎',
        title: 'Multi-Platform',
        description: 'Connect with creatives across Instagram, TikTok, and Twitter in one place.',
        color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
        icon: '→',
        title: 'Direct Connection',
        description: 'Reach out to creatives directly through their preferred platform.',
        color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
    {
        icon: '◆',
        title: 'Nigerian Focused',
        description: 'Celebrating and showcasing the best creative talent from Nigeria.',
        color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    },
];

export default function Features() {
    return (
        <section style={{
            background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)',
            color: '#ffffff',
            padding: '5rem 0',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Decorative background elements */}
            <div style={{
                position: 'absolute',
                top: '-50%',
                right: '-10%',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-30%',
                left: '-5%',
                width: '500px',
                height: '500px',
                background: 'radial-gradient(circle, rgba(245, 87, 108, 0.08) 0%, transparent 70%)',
                borderRadius: '50%',
                pointerEvents: 'none'
            }} />

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem', maxWidth: '700px', margin: '0 auto 4rem' }}>
                    <p
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '0.6875rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.3em',
                            color: '#a0a0a0',
                            marginBottom: '1rem',
                        }}
                    >
                        Why Kreativa
                    </p>
                    <h2 style={{
                        color: '#ffffff',
                        fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                        marginBottom: '1rem',
                        fontWeight: 600,
                        lineHeight: 1.2
                    }}>
                        The home for Nigerian creative talent
                    </h2>
                    <p style={{
                        color: '#a0a0a0',
                        fontSize: '1.125rem',
                        lineHeight: 1.7,
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        Connecting brands with Nigeria&apos;s most talented creatives through a seamless, curated platform.
                    </p>
                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '2rem',
                        maxWidth: '1000px',
                        margin: '0 auto'
                    }}
                    className="features-grid"
                >
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="fade-in"
                            style={{
                                animationDelay: `${index * 100}ms`,
                                padding: '2.5rem 2rem',
                                background: 'rgba(255, 255, 255, 0.03)',
                                borderRadius: '16px',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                backdropFilter: 'blur(10px)',
                                transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
                                cursor: 'default',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                                const iconEl = e.currentTarget.querySelector('.feature-icon') as HTMLElement;
                                if (iconEl) iconEl.style.transform = 'scale(1.1) rotate(5deg)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                                const iconEl = e.currentTarget.querySelector('.feature-icon') as HTMLElement;
                                if (iconEl) iconEl.style.transform = 'scale(1) rotate(0deg)';
                            }}
                        >
                            {/* Icon with gradient background */}
                            <div
                                className="feature-icon"
                                style={{
                                    width: '56px',
                                    height: '56px',
                                    borderRadius: '12px',
                                    background: feature.color,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '1.5rem',
                                    fontSize: '1.5rem',
                                    transition: 'transform 400ms cubic-bezier(0.4, 0, 0.2, 1)',
                                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
                                }}
                            >
                                {feature.icon}
                            </div>

                            <h3
                                style={{
                                    fontSize: '1.25rem',
                                    marginBottom: '0.75rem',
                                    fontFamily: 'var(--font-display)',
                                    fontWeight: 600,
                                    color: '#ffffff',
                                }}
                            >
                                {feature.title}
                            </h3>
                            <p
                                style={{
                                    fontSize: '0.9375rem',
                                    color: '#a0a0a0',
                                    lineHeight: 1.7,
                                }}
                            >
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile responsive adjustments */}
            <style jsx>{`
                @media (max-width: 640px) {
                    .features-grid {
                        grid-template-columns: 1fr !important;
                        gap: 1.5rem !important;
                    }
                }
            `}</style>
        </section>
    );
}
