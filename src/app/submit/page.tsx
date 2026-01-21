'use client';

import { useState, useRef } from 'react';
import { ProfileFormData, Category, Location, SocialLink, PrimaryPlatform } from '@/lib/types';
import { CATEGORIES, LOCATIONS } from '@/lib/constants';
import CustomSelect from '@/components/CustomSelect';
import { submitProfile } from '@/app/actions/submit-profile';

interface FormErrors {
    primary_handle?: string;
    full_name?: string;
    category?: string;
    location?: string;
    bio?: string;
    terms?: string;
}

const LINK_TYPES = ['Portfolio', 'Website', 'Behance', 'Dribbble', 'LinkedIn', 'YouTube', 'Other'];
const CATEGORY_OPTIONS = [{ value: '', label: 'Select' }, ...CATEGORIES.map(c => ({ value: c, label: c }))];
const LOCATION_OPTIONS = [{ value: '', label: 'Select' }, ...LOCATIONS.map(l => ({ value: l, label: l }))];

const PlatformIcon = ({ platform, size = 18 }: { platform: PrimaryPlatform; size?: number }) => {
    if (platform === 'Instagram') {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
        );
    }
    if (platform === 'TikTok') {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
            </svg>
        );
    }
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
};

export default function SubmitPage() {
    const [formData, setFormData] = useState<ProfileFormData>({
        primary_platform: 'Instagram',
        primary_handle: '',
        instagram_handle: '',
        tiktok_handle: '',
        twitter_handle: '',
        full_name: '',
        category: '' as Category,
        location: '' as Location,
        bio: '',
        portfolio_url: '',
        profile_photo: null,
        header_image: null,
        social_links: [],
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [profilePreview, setProfilePreview] = useState<string | null>(null);
    const [headerPreview, setHeaderPreview] = useState<string | null>(null);

    const profileInputRef = useRef<HTMLInputElement>(null);
    const headerInputRef = useRef<HTMLInputElement>(null);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        if (!formData.primary_handle) newErrors.primary_handle = 'Handle is required';
        if (!formData.full_name) newErrors.full_name = 'Name is required';
        if (!formData.category) newErrors.category = 'Select a category';
        if (!formData.location) newErrors.location = 'Select a location';
        if (!formData.bio) newErrors.bio = 'Bio is required';
        else if (formData.bio.length > 300) newErrors.bio = 'Max 300 characters';
        if (!acceptedTerms) newErrors.terms = 'Required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        const result = await submitProfile(formData);

        if (result.success) {
            setIsSuccess(true);
        } else {
            setErrors({ bio: result.error || 'Failed to submit. Please try again.' });
        }
        setIsSubmitting(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof FormErrors]) setErrors(prev => ({ ...prev, [name]: undefined }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'header') => {
        const file = e.target.files?.[0];
        if (!file || !file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const base64 = event.target?.result as string;
            if (type === 'profile') {
                setProfilePreview(base64);
                setFormData(prev => ({
                    ...prev,
                    profile_photo: file,
                    profile_photo_base64: base64
                }));
            } else {
                setHeaderPreview(base64);
                setFormData(prev => ({
                    ...prev,
                    header_image: file,
                    header_image_base64: base64
                }));
            }
        };
        reader.readAsDataURL(file);
    };

    const addLink = () => setFormData(prev => ({ ...prev, social_links: [...prev.social_links, { platform: 'Portfolio', url: '' }] }));
    const removeLink = (i: number) => setFormData(prev => ({ ...prev, social_links: prev.social_links.filter((_, idx) => idx !== i) }));
    const updateLink = (i: number, field: keyof SocialLink, value: string) => {
        setFormData(prev => ({ ...prev, social_links: prev.social_links.map((link, idx) => idx === i ? { ...link, [field]: value } : link) }));
    };

    if (isSuccess) {
        return (
            <section>
                <div className="container">
                    <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center', padding: '3rem 1rem' }}>
                        <div style={{ width: '48px', height: '48px', margin: '0 auto 1.25rem', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</div>
                        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Submitted</h1>
                        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', fontSize: '0.9375rem' }}>
                            We will review your profile within 48 hours.
                        </p>
                        <a href="/" className="btn">Back to Home</a>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section style={{ paddingTop: '1.5rem', paddingBottom: '2rem' }}>
            <div className="container">
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    {/* Header */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Join the Directory</h1>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                            Submit your profile to be featured among Nigeria&apos;s most talented creatives.
                        </p>
                    </div>


                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        {/* Image Uploads - Side by Side */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '1rem', marginBottom: '1.25rem' }}>
                            {/* Header Image */}
                            <div>
                                <label style={{ fontFamily: 'var(--font-display)', fontSize: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
                                    Header Image
                                </label>
                                <input ref={headerInputRef} type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'header')} style={{ display: 'none' }} />
                                <div
                                    onClick={() => headerInputRef.current?.click()}
                                    style={{
                                        height: '80px',
                                        backgroundColor: 'var(--color-bg-secondary)',
                                        border: '1px dashed var(--color-border)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundImage: headerPreview ? `url(${headerPreview})` : 'none',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                >
                                    {!headerPreview && (
                                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-secondary)' }}>
                                            + Upload
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Profile Photo */}
                            <div>
                                <label style={{ fontFamily: 'var(--font-display)', fontSize: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
                                    Photo
                                </label>
                                <input ref={profileInputRef} type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'profile')} style={{ display: 'none' }} />
                                <div
                                    onClick={() => profileInputRef.current?.click()}
                                    style={{
                                        height: '80px',
                                        backgroundColor: 'var(--color-bg-secondary)',
                                        border: '1px dashed var(--color-border)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundImage: profilePreview ? `url(${profilePreview})` : 'none',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                >
                                    {!profilePreview && (
                                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-secondary)' }}>
                                            +
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Platform Selection */}
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ fontFamily: 'var(--font-display)', fontSize: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
                                Primary Platform
                            </label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {(['Instagram', 'TikTok', 'Twitter'] as PrimaryPlatform[]).map((p) => (
                                    <label
                                        key={p}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '44px',
                                            height: '44px',
                                            border: formData.primary_platform === p ? '1px solid var(--color-text-primary)' : '1px solid var(--color-border)',
                                            cursor: 'pointer',
                                            transition: 'all 150ms ease',
                                            color: formData.primary_platform === p ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                                            backgroundColor: formData.primary_platform === p ? 'var(--color-bg-secondary)' : 'transparent',
                                        }}
                                    >
                                        <input type="radio" name="primary_platform" value={p} checked={formData.primary_platform === p} onChange={handleChange} style={{ display: 'none' }} />
                                        <PlatformIcon platform={p} size={16} />
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Handle */}
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ fontFamily: 'var(--font-display)', fontSize: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Handle</label>
                            <input name="primary_handle" type="text" placeholder="@yourhandle" value={formData.primary_handle} onChange={handleChange} />
                            {errors.primary_handle && <p style={{ color: '#9A6B5B', fontSize: '0.6875rem', marginTop: '0.25rem' }}>{errors.primary_handle}</p>}
                        </div>

                        {/* Other Handles Row */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                            {formData.primary_platform !== 'Instagram' && (
                                <div>
                                    <label style={{ fontFamily: 'var(--font-display)', fontSize: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                        <PlatformIcon platform="Instagram" size={12} /> Instagram
                                    </label>
                                    <input name="instagram_handle" type="text" placeholder="@" value={formData.instagram_handle || ''} onChange={handleChange} />
                                </div>
                            )}
                            {formData.primary_platform !== 'TikTok' && (
                                <div>
                                    <label style={{ fontFamily: 'var(--font-display)', fontSize: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                        <PlatformIcon platform="TikTok" size={12} /> TikTok
                                    </label>
                                    <input name="tiktok_handle" type="text" placeholder="@" value={formData.tiktok_handle || ''} onChange={handleChange} />
                                </div>
                            )}
                            {formData.primary_platform !== 'Twitter' && (
                                <div>
                                    <label style={{ fontFamily: 'var(--font-display)', fontSize: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                        <PlatformIcon platform="Twitter" size={12} /> Twitter
                                    </label>
                                    <input name="twitter_handle" type="text" placeholder="@" value={formData.twitter_handle || ''} onChange={handleChange} />
                                </div>
                            )}
                        </div>

                        {/* Name */}
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ fontFamily: 'var(--font-display)', fontSize: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Full Name</label>
                            <input name="full_name" type="text" placeholder="Your name" value={formData.full_name} onChange={handleChange} />
                            {errors.full_name && <p style={{ color: '#9A6B5B', fontSize: '0.6875rem', marginTop: '0.25rem' }}>{errors.full_name}</p>}
                        </div>

                        {/* Category & Location */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                            <CustomSelect
                                label="Category"
                                value={formData.category}
                                onChange={(val) => {
                                    setFormData(prev => ({ ...prev, category: val as Category }));
                                    if (errors.category) setErrors(prev => ({ ...prev, category: undefined }));
                                }}
                                options={CATEGORY_OPTIONS}
                                placeholder="Select"
                            />
                            <CustomSelect
                                label="Location"
                                value={formData.location}
                                onChange={(val) => {
                                    setFormData(prev => ({ ...prev, location: val as Location }));
                                    if (errors.location) setErrors(prev => ({ ...prev, location: undefined }));
                                }}
                                options={LOCATION_OPTIONS}
                                placeholder="Select"
                            />
                        </div>

                        {/* Bio */}
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ fontFamily: 'var(--font-display)', fontSize: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Bio ({300 - formData.bio.length})</label>
                            <textarea name="bio" placeholder="Tell us about your work..." value={formData.bio} onChange={handleChange} maxLength={300} rows={3} style={{ resize: 'none' }} />
                            {errors.bio && <p style={{ color: '#9A6B5B', fontSize: '0.6875rem', marginTop: '0.25rem' }}>{errors.bio}</p>}
                        </div>

                        {/* Links */}
                        <div style={{ marginBottom: '1.25rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <label style={{ fontFamily: 'var(--font-display)', fontSize: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-text-secondary)' }}>Links</label>
                                <button type="button" onClick={addLink} style={{ fontFamily: 'var(--font-display)', fontSize: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em', background: 'none', border: 'none', color: 'var(--color-accent)', cursor: 'pointer' }}>
                                    + Add
                                </button>
                            </div>
                            {formData.social_links.length === 0 ? (
                                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>Add portfolio or website</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {formData.social_links.map((link, i) => (
                                        <div key={i} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 24px', gap: '0.5rem', alignItems: 'end' }}>
                                            <select value={link.platform} onChange={(e) => updateLink(i, 'platform', e.target.value)} style={{ fontSize: '0.75rem' }}>
                                                {LINK_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                            <input type="url" placeholder="https://..." value={link.url} onChange={(e) => updateLink(i, 'url', e.target.value)} style={{ fontSize: '0.8125rem' }} />
                                            <button type="button" onClick={() => removeLink(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: '1rem', paddingBottom: '0.75rem' }}>×</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Terms & Submit */}
                        <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '1rem', fontSize: '0.8125rem' }}>
                                <input type="checkbox" checked={acceptedTerms} onChange={(e) => { setAcceptedTerms(e.target.checked); if (errors.terms) setErrors(prev => ({ ...prev, terms: undefined })); }} />
                                <span>I agree to the <a href="/terms" target="_blank" style={{ textDecoration: 'underline' }}>Terms</a> and <a href="/privacy" target="_blank" style={{ textDecoration: 'underline' }}>Privacy</a></span>
                            </label>
                            {errors.terms && <p style={{ color: '#9A6B5B', fontSize: '0.6875rem', marginBottom: '0.75rem' }}>{errors.terms}</p>}
                            <button type="submit" className="btn" disabled={isSubmitting} style={{ width: '100%', opacity: isSubmitting ? 0.6 : 1 }}>
                                {isSubmitting ? 'Submitting...' : 'Submit for Review'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
