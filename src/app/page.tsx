'use client';

import { useRef, useEffect, useState } from 'react';
import { useProfiles } from '@/hooks/useProfiles';
import ProfileCard from '@/components/ProfileCard';
import Features from '@/components/Features';
import FAQ from '@/components/FAQ';
import Link from 'next/link';

export default function Home() {
  const { profiles } = useProfiles();
  const featuredProfiles = profiles.filter(p => p.status === 'approved').slice(0, 8);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set(['hero-section']));

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = 320;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    // Add hero-section immediately on mount
    setVisibleSections(new Set(['hero-section', 'video-section']));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Hero Section with Background */}
      <section
        id="hero-section"
        data-animate
        style={{
          paddingTop: '2.5rem',
          paddingBottom: '4rem',
          position: 'relative',
          minHeight: '600px',
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(135deg, rgba(210, 140, 69, 0.95) 0%, rgba(139, 90, 43, 0.9) 100%), url("https://images.unsplash.com/photo-1533158326339-7f3cf2404354?w=1600&h=900&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'multiply',
          opacity: visibleSections.has('hero-section') ? 1 : 0,
          transform: visibleSections.has('hero-section') ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
        }}
      >
        {/* Gradient Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.1) 50%, rgba(139, 90, 43, 0.2) 100%)',
          zIndex: 1
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto', color: '#fff' }}>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.6875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: 'rgba(255, 255, 255, 0.9)',
                marginBottom: '1rem',
                textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
              }}
            >
              Nigerian Creative Directory
            </p>
            <h1 style={{
              marginBottom: '1.5rem',
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              fontWeight: 700,
              lineHeight: 1.1,
              textShadow: '0 2px 20px rgba(0, 0, 0, 0.4)'
            }}>
              Discover the best creative talent from Nigeria
            </h1>
            <p
              style={{
                fontSize: '1.25rem',
                lineHeight: 1.7,
                marginBottom: '2.5rem',
                maxWidth: '600px',
                margin: '0 auto 2.5rem',
                opacity: 0.95,
                textShadow: '0 1px 10px rgba(0, 0, 0, 0.3)'
              }}
            >
              A curated directory of photographers, designers, artists, and creators
              shaping Nigeria&apos;s creative landscape.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/browse" className="btn" style={{
                background: '#fff',
                color: '#000',
                padding: '0.875rem 2rem',
                fontSize: '1rem',
                fontWeight: 600,
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
              }}>
                Browse Creatives
              </Link>
              <Link href="/submit" className="btn btn-secondary" style={{
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#fff',
                border: '2px solid rgba(255, 255, 255, 0.4)',
                padding: '0.875rem 2rem',
                fontSize: '1rem',
                fontWeight: 600,
                backdropFilter: 'blur(10px)'
              }}>
                Submit Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile responsive adjustments */}
        <style jsx>{`
          @media (max-width: 768px) {
            #hero-section {
              min-height: 500px !important;
              padding-top: 2rem !important;
              padding-bottom: 3rem !important;
            }
          }
        `}</style>
      </section>

      {/* Featured Creatives Section - Only show if profiles exist */}
      {featuredProfiles.length > 0 && (
        <section
          id="featured-section"
          data-animate
          style={{
            paddingTop: '3rem',
            paddingBottom: '2.5rem',
            opacity: visibleSections.has('featured-section') ? 1 : 0,
            transform: visibleSections.has('featured-section') ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s ease-out, transform 0.8s ease-out'
          }}
        >
          <div className="container">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.6875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  color: 'var(--color-text-secondary)',
                }}
              >
                Featured Creatives
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => scroll('left')}
                  style={{
                    width: '36px',
                    height: '36px',
                    border: '1px solid var(--color-border)',
                    background: 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 150ms ease',
                  }}
                  aria-label="Scroll left"
                >
                  ←
                </button>
                <button
                  onClick={() => scroll('right')}
                  style={{
                    width: '36px',
                    height: '36px',
                    border: '1px solid var(--color-border)',
                    background: 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 150ms ease',
                  }}
                  aria-label="Scroll right"
                >
                  →
                </button>
              </div>
            </div>
          </div>

          {/* Slider - Full Width */}
          <div
            ref={sliderRef}
            style={{
              display: 'flex',
              gap: '1.25rem',
              overflowX: 'auto',
              paddingLeft: 'max(1.5rem, calc((100vw - 1200px) / 2))',
              paddingRight: '1.5rem',
              paddingBottom: '0.5rem',
              scrollSnapType: 'x mandatory',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {featuredProfiles.map((profile) => (
              <div
                key={profile.id}
                style={{
                  flexShrink: 0,
                  width: '300px',
                  scrollSnapAlign: 'start',
                }}
              >
                <ProfileCard
                  profile={profile}
                  onClick={() => { }}
                />
              </div>
            ))}
          </div>

          <div className="container">
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Link
                href="/browse"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'var(--color-text-secondary)',
                  borderBottom: '1px solid var(--color-border)',
                  paddingBottom: '0.25rem',
                  transition: 'color 150ms ease, border-color 150ms ease',
                }}
              >
                View All Creatives →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <div
        id="features-section"
        data-animate
        style={{
          opacity: visibleSections.has('features-section') ? 1 : 0,
          transform: visibleSections.has('features-section') ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.8s ease-out, transform 0.8s ease-out'
        }}
      >
        <Features />
      </div>

      {/* FAQ Section */}
      <div
        id="faq-section"
        data-animate
        style={{
          opacity: visibleSections.has('faq-section') ? 1 : 0,
          transform: visibleSections.has('faq-section') ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.8s ease-out, transform 0.8s ease-out'
        }}
      >
        <FAQ />
      </div>
    </>
  );
}
