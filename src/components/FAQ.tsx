'use client';

import { useState } from 'react';

const faqs = [
    {
        question: 'How do I get my profile on Kreativa?',
        answer: 'Submit your profile through our form. Select your platform, add bio and links, then wait for approval within 48 hours.',
    },
    {
        question: 'Is Kreativa free to use?',
        answer: 'Yes, Kreativa is completely free for both creatives and clients.',
    },
    {
        question: 'What types of creatives can join?',
        answer: 'Photographers, designers, artists, content creators, videographers, writers, musicians, stylists, and all creative professionals.',
    },
    {
        question: 'Can I update my profile after approval?',
        answer: 'Yes, contact us anytime to request updates. We are building a self-service dashboard.',
    },
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section style={{ padding: '3rem 0 1.5rem' }}>
            <div className="container">
                {/* Horizontal Layout: Heading Left, Content Right */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 2fr',
                        gap: '4rem',
                        alignItems: 'start',
                    }}
                    className="faq-layout"
                >
                    {/* Left - Heading */}
                    <div style={{ position: 'sticky', top: '100px' }}>
                        <p
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '0.6875rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.2em',
                                color: 'var(--color-text-secondary)',
                                marginBottom: '0.5rem',
                            }}
                        >
                            FAQ
                        </p>
                        <h2 style={{ fontSize: '1.5rem', lineHeight: 1.3 }}>Common Questions</h2>
                    </div>

                    {/* Right - Accordion */}
                    <div>
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                style={{ borderBottom: '1px solid var(--color-border)' }}
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '1.25rem 0',
                                        border: 'none',
                                        background: 'transparent',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                    }}
                                >
                                    <span style={{ fontWeight: 500, fontSize: '1rem', paddingRight: '1rem', color: 'var(--color-text-primary)' }}>
                                        {faq.question}
                                    </span>
                                    <span
                                        style={{
                                            fontFamily: 'var(--font-display)',
                                            fontSize: '1.25rem',
                                            flexShrink: 0,
                                            transform: openIndex === index ? 'rotate(45deg)' : 'none',
                                            transition: 'transform 200ms ease',
                                            color: 'var(--color-text-secondary)',
                                        }}
                                    >
                                        +
                                    </span>
                                </button>
                                {openIndex === index && (
                                    <div
                                        style={{
                                            paddingBottom: '1.25rem',
                                            color: 'var(--color-text-secondary)',
                                            lineHeight: 1.7,
                                            fontSize: '1rem',
                                        }}
                                    >
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
        @media (max-width: 768px) {
          .faq-layout {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
        }
      `}</style>
        </section>
    );
}
