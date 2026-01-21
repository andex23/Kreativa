'use client';

import { useState } from 'react';
import Link from 'next/link';

const faqItems = [
    {
        question: 'How do I submit my profile?',
        answer: 'Click "Submit Your Profile", fill out the form with your platform handle, name, category, and bio.',
    },
    {
        question: 'Is there a fee to be listed?',
        answer: 'No, Kreativa is completely free for all creatives and clients.',
    },
    {
        question: 'How long does review take?',
        answer: 'Most submissions are reviewed within 24-48 hours.',
    },
    {
        question: 'Who can submit their profile?',
        answer: 'Any Nigerian creative professional including photographers, designers, artists, musicians, writers, and content creators.',
    },
];

const features = [
    {
        icon: '✦',
        title: 'Curated Directory',
        description: 'Every profile is carefully reviewed to ensure quality and authenticity.',
    },
    {
        icon: '◎',
        title: 'Multi-Platform',
        description: 'Connect with creatives across Instagram, TikTok, Twitter, and more.',
    },
    {
        icon: '→',
        title: 'Direct Connection',
        description: 'Reach out to creatives directly through their preferred platform.',
    },
    {
        icon: '◆',
        title: 'Free Forever',
        description: 'No fees for creatives or clients. Connecting talent should be accessible.',
    },
];

export default function AboutPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <>
            {/* Hero with Image Background */}
            <section style={{
                paddingTop: '3.5rem',
                paddingBottom: '4rem',
                position: 'relative',
                minHeight: '500px',
                display: 'flex',
                alignItems: 'center',
                background: 'linear-gradient(135deg, rgba(139, 90, 43, 0.85) 0%, rgba(45, 85, 75, 0.85) 100%), url("https://export-download.canva.com/5LFAKKts/3/0/0001-38558568095.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJHKNGJLC2J7OGJ6Q%2F20260119%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260119T014855Z&X-Amz-Expires=66166&X-Amz-Signature=75e3a4c5e8e3db1bf3c0e82a30dc7a7f41e867d3a44e4e1d5e2af8b6c6f6e6e6&X-Amz-SignedHeaders=host&response-content-disposition=attachment%3B%20filename%2A%3DUTF-8%27%27Kreativa%2520hero.png&response-expires=Mon%2C%2019%20Jan%202026%2020%3A11%3A21%20GMT")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundBlendMode: 'multiply',
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.1) 50%, rgba(139, 90, 43, 0.1) 100%)',
                    zIndex: 1
                }} />

                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{ maxWidth: '900px', margin: '0 auto', color: '#fff', textAlign: 'center' }}>
                        <p style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '0.6875rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.2em',
                            color: 'rgba(255, 255, 255, 0.9)',
                            marginBottom: '1rem',
                            textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
                        }}>
                            About Kreativa
                        </p>
                        <h1 style={{
                            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                            marginBottom: '2rem',
                            fontWeight: 700,
                            lineHeight: 1.1,
                            textShadow: '0 2px 20px rgba(0, 0, 0, 0.4)'
                        }}>
                            Connecting Nigeria&apos;s Creative Talent with Opportunity
                        </h1>
                        <p style={{
                            fontSize: '1.125rem',
                            lineHeight: 1.8,
                            opacity: 0.95,
                            textShadow: '0 1px 10px rgba(0, 0, 0, 0.3)',
                            marginBottom: '1.5rem'
                        }}>
                            Kreativa is more than a directory—it&apos;s a movement celebrating Nigerian creative excellence.
                            We exist to bridge the gap between extraordinary creative talent and the brands, businesses, and
                            individuals seeking their unique vision. From photographers capturing authentic Nigerian stories
                            to designers shaping visual culture, from artists expressing our heritage through their craft to
                            content creators building the future of digital media—we bring them all together in one curated space.
                        </p>
                        <p style={{
                            fontSize: '1.125rem',
                            lineHeight: 1.8,
                            opacity: 0.95,
                            textShadow: '0 1px 10px rgba(0, 0, 0, 0.3)'
                        }}>
                            Every profile on Kreativa is carefully reviewed to ensure quality and authenticity. We believe
                            in making creative collaboration accessible, which is why our platform is completely free for both
                            creatives and clients. Whether you&apos;re a brand looking for your next creative partner or a
                            creative professional ready to showcase your work, Kreativa is your gateway to meaningful connections
                            that celebrate and amplify Nigerian creativity.
                        </p>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section style={{
                padding: '4rem 0',
                background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)'
            }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <p style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '0.6875rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.2em',
                            color: 'rgba(255, 255, 255, 0.6)',
                            marginBottom: '1rem',
                        }}>
                            Why Kreativa
                        </p>
                        <h2 style={{
                            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                            marginBottom: '1rem',
                            color: '#fff'
                        }}>
                            Built for Nigerian Creatives
                        </h2>
                    </div>

                    <div className="about-features-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '2rem',
                        maxWidth: '1100px',
                        margin: '0 auto'
                    }}>
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="fade-in"
                                style={{
                                    animationDelay: `${index * 150}ms`,
                                    padding: '2.5rem',
                                    background: 'linear-gradient(135deg, rgba(139, 90, 43, 0.15) 0%, rgba(45, 85, 75, 0.15) 100%)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    textAlign: 'center',
                                    transition: 'all 300ms ease',
                                    cursor: 'default',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(139, 90, 43, 0.2) 0%, rgba(45, 85, 75, 0.2) 100%)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(139, 90, 43, 0.15) 0%, rgba(45, 85, 75, 0.15) 100%)';
                                }}
                            >
                                <div style={{
                                    fontSize: '2.5rem',
                                    marginBottom: '1.25rem',
                                    display: 'inline-block',
                                    filter: 'brightness(1.2)'
                                }}>
                                    {feature.icon}
                                </div>
                                <h3 style={{
                                    fontFamily: 'var(--font-display)',
                                    fontSize: '1.125rem',
                                    marginBottom: '0.75rem',
                                    fontWeight: 600,
                                    color: '#fff'
                                }}>
                                    {feature.title}
                                </h3>
                                <p style={{
                                    fontSize: '0.9375rem',
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    lineHeight: 1.7
                                }}>
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section style={{ padding: '4rem 0' }}>
                <div className="container">
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <p style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '0.6875rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.2em',
                            color: 'var(--color-text-secondary)',
                            marginBottom: '0.75rem',
                            textAlign: 'center'
                        }}>
                            FAQ
                        </p>
                        <h2 style={{ fontSize: '2rem', marginBottom: '2.5rem', textAlign: 'center' }}>
                            Frequently Asked Questions
                        </h2>

                        {faqItems.map((faq, index) => (
                            <div key={index} className="faq-item">
                                <button
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                    className="faq-question"
                                >
                                    <span style={{ fontWeight: 500, fontSize: '1rem', color: 'var(--color-text-primary)' }}>
                                        {faq.question}
                                    </span>
                                    <span style={{
                                        fontFamily: 'var(--font-display)',
                                        fontSize: '1.25rem',
                                        transform: openFaq === index ? 'rotate(45deg)' : 'none',
                                        transition: 'transform 200ms ease',
                                        color: 'var(--color-text-secondary)',
                                    }}>
                                        +
                                    </span>
                                </button>
                                {openFaq === index && (
                                    <div className="faq-answer">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{
                padding: '4rem 0',
                background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)',
                color: '#ffffff',
                textAlign: 'center'
            }}>
                <div className="container">
                    <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', marginBottom: '1rem', color: '#ffffff' }}>
                        Ready to Join Kreativa?
                    </h2>
                    <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.125rem', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
                        Submit your profile and get discovered by brands and clients across Nigeria.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link href="/submit" className="btn" style={{
                            background: '#fff',
                            color: '#000',
                            padding: '1rem 2.5rem'
                        }}>
                            Submit Your Profile
                        </Link>
                        <Link href="/categories" className="btn btn-secondary" style={{
                            background: 'transparent',
                            color: '#fff',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            padding: '1rem 2.5rem'
                        }}>
                            Browse Creatives
                        </Link>
                    </div>
                </div>
            </section>

            {/* Contact */}
            <section style={{
                padding: '5rem 0',
                background: 'var(--color-bg-primary)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, rgba(139, 90, 43, 0.04) 0%, transparent 70%)',
                    pointerEvents: 'none',
                    zIndex: 0
                }} />

                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{
                        maxWidth: '700px',
                        margin: '0 auto',
                        textAlign: 'center',
                        padding: '3rem',
                        background: 'var(--color-bg-secondary)',
                        border: '1px solid var(--color-border)',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)'
                    }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            margin: '0 auto 2rem',
                            background: 'linear-gradient(135deg, rgba(139, 90, 43, 0.1) 0%, rgba(45, 85, 75, 0.1) 100%)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem'
                        }}>
                            ✉
                        </div>

                        <p style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '0.6875rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.2em',
                            color: 'var(--color-text-secondary)',
                            marginBottom: '1rem'
                        }}>
                            Get in Touch
                        </p>

                        <h2 style={{
                            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                            marginBottom: '1rem',
                            fontWeight: 600,
                            color: 'var(--color-text-primary)'
                        }}>
                            Have Questions or Suggestions?
                        </h2>

                        <p style={{
                            fontSize: '1rem',
                            lineHeight: 1.7,
                            color: 'var(--color-text-secondary)',
                            marginBottom: '2rem',
                            maxWidth: '500px',
                            margin: '0 auto 2rem'
                        }}>
                            We&apos;d love to hear from you. Whether you&apos;re a creative looking to join or a brand seeking talent, reach out to us.
                        </p>

                        <a href="mailto:hello@kreativa.ng"
                            className="btn"
                            style={{
                                display: 'inline-block',
                                background: 'var(--color-text-primary)',
                                color: 'var(--color-bg-primary)',
                                padding: '1rem 2.5rem',
                                fontSize: '0.875rem',
                                fontFamily: 'var(--font-display)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                textDecoration: 'none',
                                transition: 'all 300ms ease',
                                border: 'none'
                            }}
                        >
                            Send us an Email
                        </a>

                        <p style={{
                            marginTop: '1.5rem',
                            fontSize: '0.875rem',
                            color: 'var(--color-text-secondary)'
                        }}>
                            or email us directly at{' '}
                            <a href="mailto:hello@kreativa.ng" style={{
                                color: 'var(--color-accent)',
                                fontWeight: 500,
                                textDecoration: 'none',
                                borderBottom: '1px solid var(--color-accent)',
                                transition: 'opacity 200ms ease'
                            }}>
                                hello@kreativa.ng
                            </a>
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}
