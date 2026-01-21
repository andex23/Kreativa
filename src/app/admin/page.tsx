'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Profile, ProfileStatus, Category, Location, PrimaryPlatform } from '@/lib/types';
import { mockProfiles } from '@/lib/mock-data';
import { CATEGORIES, LOCATIONS } from '@/lib/constants';
import { fetchProfileStats } from '@/app/actions/social-stats';
import { processFileUpload, CategorizedProfile, parseRawTextWithAI, categorizeWithAI } from '@/app/actions/gemini-categorize';
import ConfirmationModal from '@/components/ConfirmationModal';
import Toast, { ToastType } from '@/components/Toast';
import { fetchAdminProfiles, approveProfile as approveProfileAction, deleteProfile as deleteProfileAction, bulkApproveProfiles, bulkDeleteProfiles, updateProfileStatus as updateProfileStatusAction, updateProfile as updateProfileAction } from '@/app/actions/admin-profiles';
// Removed useProfiles import

type Tab = 'pending' | 'approved' | 'rejected' | 'import';

// Platform Icons
const PlatformIcon = ({ platform, size = 16 }: { platform: PrimaryPlatform; size?: number }) => {
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

const getPlatformUrl = (platform: PrimaryPlatform, handle: string) => {
    const cleanHandle = handle.replace('@', '');
    switch (platform) {
        case 'Instagram': return `https://instagram.com/${cleanHandle}`;
        case 'TikTok': return `https://tiktok.com/@${cleanHandle}`;
        case 'Twitter': return `https://twitter.com/${cleanHandle}`;
    }
};

export default function AdminDashboardPage() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>('pending');

    // UI State for Modals/Toasts
    const [confirmation, setConfirmation] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        action: () => void;
        isDestructive: boolean;
    }>({
        isOpen: false,
        title: '',
        message: '',
        action: () => { },
        isDestructive: false
    });

    const [toast, setToast] = useState<{
        isVisible: boolean;
        message: string;
        type: ToastType;
    }>({
        isVisible: false,
        message: '',
        type: 'info'
    });

    const showToast = (message: string, type: ToastType = 'info') => {
        setToast({ isVisible: true, message, type });
    };

    const closeConfirmation = () => {
        setConfirmation(prev => ({ ...prev, isOpen: false }));
    };

    const handleConfirm = () => {
        confirmation.action();
        closeConfirmation();
    };


    // Persistent profiles
    // Persistent profiles (Server State)
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Initial Load
    useEffect(() => {
        async function load() {
            if (!isAuthenticated) return;
            try {
                const res = await fetchAdminProfiles();
                if (res.success && res.data) {
                    setProfiles(res.data);
                }
            } catch (e) {
                console.error(e);
                showToast('Failed to load profiles', 'error');
            } finally {
                setIsLoading(false);
            }
        }
        load();
    }, [isAuthenticated]);

    const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
    const [fetchingStats, setFetchingStats] = useState<string | null>(null);
    // Bulk import state
    const [bulkUsernames, setBulkUsernames] = useState('');
    const [bulkPlatform, setBulkPlatform] = useState<PrimaryPlatform>('Instagram');
    const [bulkCategory, setBulkCategory] = useState<Category>('Content Creators');
    const [bulkLocation, setBulkLocation] = useState<Location>('Lagos');
    const [isImporting, setIsImporting] = useState(false);
    const [importProgress, setImportProgress] = useState({ current: 0, total: 0 });
    // File upload state
    const [fileUploadProfiles, setFileUploadProfiles] = useState<CategorizedProfile[]>([]);
    const [isProcessingFile, setIsProcessingFile] = useState(false);
    const [fileError, setFileError] = useState<string | null>(null);
    // Raw text paste state
    const [rawText, setRawText] = useState('');
    const [isProcessingText, setIsProcessingText] = useState(false);
    // Cancel import ref (using ref to avoid stale closure)
    const cancelImportRef = useRef(false);

    // Selection state for bulk actions
    const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);

    // Handle checkboxes
    const toggleSelection = (id: string) => {
        setSelectedProfiles(prev =>
            prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
        );
    };

    const toggleAllSelection = (filteredProfiles: Profile[]) => {
        if (selectedProfiles.length === filteredProfiles.length) {
            setSelectedProfiles([]);
        } else {
            setSelectedProfiles(filteredProfiles.map(p => p.id));
        }
    };

    // Delete single profile
    const deleteProfile = (id: string) => {
        setConfirmation({
            isOpen: true,
            title: 'Delete Profile',
            message: 'Are you sure you want to delete this profile? This action cannot be undone.',
            isDestructive: true,
            action: async () => {
                const res = await deleteProfileAction(id);
                if (res.success) {
                    setProfiles(prev => prev.filter(p => p.id !== id));
                    setSelectedProfiles(prev => prev.filter(pId => pId !== id));
                    showToast('Profile deleted successfully', 'success');
                } else {
                    showToast('Failed to delete: ' + res.error, 'error');
                }
            }
        });
    };

    // Bulk approve
    const bulkApprove = () => {
        if (selectedProfiles.length === 0) return;

        setConfirmation({
            isOpen: true,
            title: 'Bulk Approve',
            message: `Are you sure you want to approve ${selectedProfiles.length} profiles?`,
            isDestructive: false,
            action: () => {
                setProfiles(prev => prev.map(p =>
                    selectedProfiles.includes(p.id) ? { ...p, status: 'approved', updated_at: new Date().toISOString() } : p
                ));
                setSelectedProfiles([]);
                showToast(`${selectedProfiles.length} profiles approved successfully`, 'success');
            }
        });
    };

    // Bulk delete (updated placement)
    const bulkDelete = () => {
        if (selectedProfiles.length === 0) return;

        setConfirmation({
            isOpen: true,
            title: 'Bulk Delete',
            message: `Are you sure you want to delete ${selectedProfiles.length} profiles? This action cannot be undone.`,
            isDestructive: true,
            action: async () => {
                const res = await bulkDeleteProfiles(selectedProfiles);
                if (res.success) {
                    setProfiles(prev => prev.filter(p => !selectedProfiles.includes(p.id)));
                    setSelectedProfiles([]);
                    showToast(`${selectedProfiles.length} profiles deleted successfully`, 'success');
                } else {
                    showToast('Failed to delete: ' + res.error, 'error');
                }
            }
        });
    };

    useEffect(() => {
        const isAdmin = sessionStorage.getItem('kreativa_admin');
        if (!isAdmin) {
            router.push('/admin/login');
        } else {
            setIsAuthenticated(true);
            // Profiles are loaded by useProfiles hook
        }
    }, [router]);

    const handleLogout = () => {
        sessionStorage.removeItem('kreativa_admin');
        router.push('/admin/login');
    };

    const updateProfileStatus = async (profileId: string, newStatus: ProfileStatus) => {
        // Optimistic update
        setProfiles(prev =>
            prev.map(p =>
                p.id === profileId ? { ...p, status: newStatus, updated_at: new Date().toISOString() } : p
            )
        );

        const res = await updateProfileStatusAction(profileId, newStatus);
        if (!res.success) {
            showToast('Failed to update status: ' + res.error, 'error');
            // Revert on error by strictly fetching fresh data
            const refresh = await fetchAdminProfiles();
            if (refresh.success && refresh.data) setProfiles(refresh.data);
        }
    };

    // deleteProfile removed (duplicate)

    const saveEditedProfile = async () => {
        if (!editingProfile) return;

        // Optimistic
        setProfiles(prev =>
            prev.map(p =>
                p.id === editingProfile.id ? { ...editingProfile, updated_at: new Date().toISOString() } : p
            )
        );

        const profileToSave = editingProfile;
        setEditingProfile(null);

        const res = await updateProfileAction(profileToSave);
        if (!res.success) {
            showToast('Failed to save profile: ' + res.error, 'error');
            // Revert
            const refresh = await fetchAdminProfiles();
            if (refresh.success && refresh.data) setProfiles(refresh.data);
        } else {
            showToast('Profile updated successfully', 'success');
        }
    };

    // Fetch social stats for a profile
    const handleFetchStats = async (profile: Profile) => {
        setFetchingStats(profile.id);
        try {
            const result = await fetchProfileStats(profile.primary_platform, profile.primary_handle);
            if (result.success && result.data) {
                setProfiles(prev =>
                    prev.map(p =>
                        p.id === profile.id
                            ? {
                                ...p,
                                follower_count: result.data?.followers || p.follower_count,
                                following_count: result.data?.following || p.following_count,
                                posts_count: result.data?.posts || p.posts_count,
                                bio: result.data?.bio || p.bio,
                                profile_photo_url: result.data?.profilePicUrl || p.profile_photo_url,
                                updated_at: new Date().toISOString(),
                            }
                            : p
                    )
                );
                showToast(`Stats fetched! Followers: ${result.data.followers?.toLocaleString() || 'N/A'}`, 'success');
            } else {
                showToast(`Failed to fetch stats: ${result.error || 'Unknown error'}`, 'error');
            }
        } catch (error) {
            console.error('Fetch stats error:', error);
            showToast('Failed to fetch stats. Check console for details.', 'error');
        } finally {
            setFetchingStats(null);
        }
    };

    // Bulk import handler
    const handleBulkImport = async () => {
        const usernames = bulkUsernames
            .split('\n')
            .map(u => u.trim())
            .filter(u => u.length > 0);

        if (usernames.length === 0) {
            showToast('Please enter at least one username', 'error');
            return;
        }

        setIsImporting(true);
        setImportProgress({ current: 0, total: usernames.length });

        const newProfiles: Profile[] = [];

        for (let i = 0; i < usernames.length; i++) {
            const username = usernames[i];
            setImportProgress({ current: i + 1, total: usernames.length });

            try {
                // Fetch stats from API
                const result = await fetchProfileStats(bulkPlatform, username);

                const profile: Profile = {
                    id: `import_${Date.now()}_${i}`,
                    primary_platform: bulkPlatform,
                    primary_handle: username.startsWith('@') ? username : `@${username}`,
                    [`${bulkPlatform.toLowerCase()}_handle`]: username.startsWith('@') ? username : `@${username}`,
                    full_name: result.data?.displayName || username.replace('@', ''),
                    category: bulkCategory,
                    location: bulkLocation,
                    bio: result.data?.bio || `${bulkCategory} from ${bulkLocation}`,
                    follower_count: result.data?.followers || undefined,
                    following_count: result.data?.following || undefined,
                    posts_count: result.data?.posts || undefined,
                    profile_photo_url: result.data?.profilePicUrl || undefined,
                    status: 'pending',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                };

                newProfiles.push(profile);
            } catch (error) {
                console.error(`Failed to import ${username}:`, error);
                // Still create profile with basic info
                newProfiles.push({
                    id: `import_${Date.now()}_${i}`,
                    primary_platform: bulkPlatform,
                    primary_handle: username.startsWith('@') ? username : `@${username}`,
                    full_name: username.replace('@', ''),
                    category: bulkCategory,
                    location: bulkLocation,
                    bio: `${bulkCategory} from ${bulkLocation}`,
                    status: 'pending',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                });
            }

            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        setProfiles(prev => [...prev, ...newProfiles]);
        setBulkUsernames('');
        setIsImporting(false);
        setActiveTab('pending');
        setActiveTab('pending');
        showToast(`Imported ${newProfiles.length} profiles successfully!`, 'success');
    };

    // File upload handler
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsProcessingFile(true);
        setFileError(null);
        setFileUploadProfiles([]);

        try {
            const fileType = file.name.endsWith('.csv') ? 'csv' : 'pdf';

            if (fileType === 'csv') {
                const text = await file.text();
                const result = await processFileUpload(text, 'csv');

                if (result.errors.length > 0) {
                    setFileError(result.errors.join(', '));
                }
                if (result.profiles.length > 0) {
                    setFileUploadProfiles(result.profiles);
                }
            } else {
                // PDF: convert to base64
                const buffer = await file.arrayBuffer();
                const base64 = Buffer.from(buffer).toString('base64');
                const result = await processFileUpload(base64, 'pdf');

                if (result.errors.length > 0) {
                    setFileError(result.errors.join(', '));
                }
                if (result.profiles.length > 0) {
                    setFileUploadProfiles(result.profiles);
                }
            }
        } catch (error) {
            setFileError(error instanceof Error ? error.message : 'Failed to process file');
        } finally {
            setIsProcessingFile(false);
            event.target.value = ''; // Reset file input
        }
    };

    // Update category for file upload preview
    const updateFileProfileCategory = (index: number, category: Category) => {
        setFileUploadProfiles(prev => prev.map((p, i) =>
            i === index ? { ...p, suggestedCategory: category } : p
        ));
    };

    // Update location for file upload preview
    const updateFileProfileLocation = (index: number, location: Location) => {
        setFileUploadProfiles(prev => prev.map((p, i) =>
            i === index ? { ...p, suggestedLocation: location } : p
        ));
    };

    // Import profiles from file upload
    const handleFileImport = async () => {
        if (fileUploadProfiles.length === 0) return;

        cancelImportRef.current = false; // Reset cancel flag
        setIsImporting(true);
        setImportProgress({ current: 0, total: fileUploadProfiles.length });

        const newProfiles: Profile[] = [];

        for (let i = 0; i < fileUploadProfiles.length; i++) {
            // Check for cancellation
            if (cancelImportRef.current) {
                break;
            }

            const fp = fileUploadProfiles[i];
            setImportProgress({ current: i + 1, total: fileUploadProfiles.length });

            try {
                // Fetch stats from RapidAPI
                const result = await fetchProfileStats(fp.platform, fp.handle);

                const profile: Profile = {
                    id: `import_${Date.now()}_${i}`,
                    primary_platform: fp.platform,
                    primary_handle: fp.handle.startsWith('@') ? fp.handle : `@${fp.handle}`,
                    full_name: result.data?.displayName || fp.name,
                    category: fp.suggestedCategory,
                    location: fp.suggestedLocation,
                    bio: result.data?.bio || fp.bio || '',
                    follower_count: result.data?.followers ?? undefined,
                    profile_photo_url: result.data?.profilePicUrl ?? undefined,
                    status: 'pending',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                };

                newProfiles.push(profile);
            } catch {
                // Fallback without API data
                newProfiles.push({
                    id: `import_${Date.now()}_${i}`,
                    primary_platform: fp.platform,
                    primary_handle: fp.handle.startsWith('@') ? fp.handle : `@${fp.handle}`,
                    full_name: fp.name,
                    category: fp.suggestedCategory,
                    location: fp.suggestedLocation,
                    bio: fp.bio || '',
                    status: 'pending',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                });
            }

            await new Promise(resolve => setTimeout(resolve, 300));
        }

        // Add whatever profiles were imported (even if cancelled mid-way)
        if (newProfiles.length > 0) {
            setProfiles(prev => [...prev, ...newProfiles]);
        }

        setFileUploadProfiles([]);
        setIsImporting(false);
        cancelImportRef.current = false;

        if (newProfiles.length > 0) {
            setActiveTab('pending');
            showToast(`Imported ${newProfiles.length} profiles successfully!`, 'success');
        }
    };

    // Cancel import handler
    const handleCancelImport = () => {
        cancelImportRef.current = true;
    };

    // Handle raw text paste with AI parsing
    const handleRawText = async () => {
        if (!rawText.trim()) {
            setFileError('Please paste some text first');
            return;
        }

        setIsProcessingText(true);
        setFileError(null);

        try {
            const profiles = await parseRawTextWithAI(rawText.trim());
            if (profiles.length === 0) {
                setFileError('No profiles found in the text. Try adding more detail.');
                return;
            }

            // Now categorize the extracted profiles
            const categorized = await categorizeWithAI(profiles);
            setFileUploadProfiles(categorized);
            setRawText(''); // Clear input after processing
        } catch (error) {
            setFileError(error instanceof Error ? error.message : 'Failed to parse text');
        } finally {
            setIsProcessingText(false);
        }
    };

    const filteredProfiles = profiles.filter(p => p.status === activeTab);
    const totalProfiles = profiles.length;

    if (!isAuthenticated) {
        return (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
                <p>Loading...</p>
            </div>
        );
    }

    const tabStyle = (tab: Tab) => ({
        fontFamily: 'var(--font-display)',
        fontSize: '0.75rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase' as const,
        padding: '0.75rem 1.5rem',
        border: 'none',
        background: activeTab === tab ? 'var(--color-bg-card)' : 'transparent',
        color: activeTab === tab ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
        cursor: 'pointer',
        transition: 'all 200ms ease',
    });

    const formatFollowers = (count?: number) => {
        if (!count) return '–';
        if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
        if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
        return count.toString();
    };

    return (
        <section>
            <div className="container">
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ marginBottom: '0.25rem' }}>Admin Dashboard</h1>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                            {totalProfiles} total profiles
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '0.75rem',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            color: 'var(--color-text-secondary)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        Logout
                    </button>
                </div>

                {/* Stats Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                    {(['pending', 'approved', 'rejected'] as const).map(status => {
                        const count = profiles.filter(p => p.status === status).length;
                        const colors: Record<string, string> = {
                            pending: '#d4a574',
                            approved: '#6a9c6a',
                            rejected: '#c9746a',
                        };
                        return (
                            <div
                                key={status}
                                onClick={() => setActiveTab(status)}
                                style={{
                                    padding: '1.5rem',
                                    backgroundColor: activeTab === status ? 'var(--color-bg-card)' : 'var(--color-bg-secondary)',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    borderLeft: `3px solid ${colors[status]}`,
                                    transition: 'all 200ms ease',
                                }}
                            >
                                <p style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', marginBottom: '0.5rem', color: colors[status] }}>
                                    {count}
                                </p>
                                <p style={{ fontSize: '0.7rem', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-secondary)' }}>
                                    {status}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--color-border)' }}>
                    {(['pending', 'approved', 'rejected'] as const).map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} style={tabStyle(tab)}>
                            {tab} ({profiles.filter(p => p.status === tab).length})
                        </button>
                    ))}
                    <button
                        onClick={() => setActiveTab('import')}
                        style={{
                            ...tabStyle('import'),
                            marginLeft: 'auto',
                            color: activeTab === 'import' ? '#4a90d9' : 'var(--color-text-secondary)',
                        }}
                    >
                        ➕ Bulk Import
                    </button>
                </div>

                {/* Import Tab Content */}
                {activeTab === 'import' && (
                    <div style={{ backgroundColor: 'var(--color-bg-card)', padding: '2rem' }}>
                        <h2 style={{ marginBottom: '1rem' }}>Bulk Import Profiles</h2>

                        {/* File Upload Section */}
                        <div style={{ marginBottom: '2rem', padding: '1.5rem', border: '2px dashed var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>📁 Upload File (AI Categorization)</h3>
                            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                                Upload a CSV or PDF file. Gemini AI will analyze and suggest categories automatically.
                            </p>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <label className="btn" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                                    📄 Upload CSV
                                    <input
                                        type="file"
                                        accept=".csv"
                                        onChange={handleFileUpload}
                                        style={{ display: 'none' }}
                                        disabled={isProcessingFile}
                                    />
                                </label>
                                <label className="btn" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                                    📑 Upload PDF
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileUpload}
                                        style={{ display: 'none' }}
                                        disabled={isProcessingFile}
                                    />
                                </label>
                            </div>
                            {isProcessingFile && (
                                <p style={{ marginTop: '1rem', color: '#4a90d9' }}>🔄 Processing file with AI...</p>
                            )}
                            {fileError && (
                                <p style={{ marginTop: '1rem', color: '#e74c3c' }}>❌ {fileError}</p>
                            )}
                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.75rem' }}>
                                CSV format: name, handle, platform, bio (one row per person)
                            </p>
                        </div>

                        {/* Raw Text Paste Section */}
                        <div style={{ marginBottom: '2rem', padding: '1.5rem', border: '2px dashed var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>📝 Paste Raw Text (AI Parsing)</h3>
                            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                                Paste any text containing creative profiles. AI will extract names, handles, and categorize automatically.
                            </p>
                            <textarea
                                value={rawText}
                                onChange={(e) => setRawText(e.target.value)}
                                placeholder="Paste your text here...

Examples:
- Samuel Johnson @samjohnson - Lagos based photographer
- Adaeze Obi, TikTok: @adaeze_style, Fashion Designer from Abuja
- John Doe is a content creator in Port Harcourt"
                                style={{
                                    width: '100%',
                                    minHeight: '150px',
                                    padding: '1rem',
                                    backgroundColor: 'var(--color-bg-tertiary)',
                                    border: '1px solid var(--color-border)',
                                    color: 'var(--color-text-primary)',
                                    fontSize: '0.875rem',
                                    fontFamily: 'inherit',
                                    resize: 'vertical'
                                }}
                            />
                            <button
                                className="btn"
                                onClick={handleRawText}
                                disabled={isProcessingText || !rawText.trim()}
                                style={{ marginTop: '1rem' }}
                            >
                                {isProcessingText ? '🔄 Processing with AI...' : '🤖 Extract & Categorize'}
                            </button>
                        </div>

                        {/* File Upload Preview Table */}
                        {fileUploadProfiles.length > 0 && (
                            <div style={{ marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>
                                    📋 Preview ({fileUploadProfiles.length} profiles) - Edit categories before importing
                                </h3>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                                                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Name</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Handle</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Platform</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Category (AI)</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Location</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Confidence</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {fileUploadProfiles.map((fp, idx) => (
                                                <tr key={idx} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                                    <td style={{ padding: '0.75rem' }}>{fp.name}</td>
                                                    <td style={{ padding: '0.75rem' }}>@{fp.handle}</td>
                                                    <td style={{ padding: '0.75rem' }}>{fp.platform}</td>
                                                    <td style={{ padding: '0.75rem' }}>
                                                        <select
                                                            value={fp.suggestedCategory}
                                                            onChange={(e) => updateFileProfileCategory(idx, e.target.value as Category)}
                                                            title="Select category"
                                                            style={{ width: '100%', padding: '0.25rem' }}
                                                        >
                                                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                                        </select>
                                                    </td>
                                                    <td style={{ padding: '0.75rem' }}>
                                                        <select
                                                            value={fp.suggestedLocation}
                                                            onChange={(e) => updateFileProfileLocation(idx, e.target.value as Location)}
                                                            title="Select location"
                                                            style={{ width: '100%', padding: '0.25rem' }}
                                                        >
                                                            {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                                                        </select>
                                                    </td>
                                                    <td style={{ padding: '0.75rem' }}>
                                                        <span style={{
                                                            padding: '0.25rem 0.5rem',
                                                            backgroundColor: fp.confidence === 'high' ? '#27ae60' : fp.confidence === 'medium' ? '#f39c12' : '#e74c3c',
                                                            color: '#fff',
                                                            fontSize: '0.75rem',
                                                            borderRadius: '3px',
                                                        }}>
                                                            {fp.confidence}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                                    <button
                                        onClick={handleFileImport}
                                        disabled={isImporting}
                                        className="btn btn-primary"
                                    >
                                        {isImporting ? `Importing ${importProgress.current}/${importProgress.total}...` : `✅ Import ${fileUploadProfiles.length} Profiles`}
                                    </button>
                                    {isImporting && (
                                        <button
                                            onClick={handleCancelImport}
                                            className="btn"
                                            style={{ backgroundColor: '#e74c3c', color: 'white' }}
                                        >
                                            🛑 Cancel Import
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setFileUploadProfiles([])}
                                        className="btn"
                                        disabled={isImporting}
                                    >
                                        ❌ Clear
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Divider */}
                        <div style={{ borderTop: '1px solid var(--color-border)', margin: '2rem 0', position: 'relative' }}>
                            <span style={{ position: 'absolute', top: '-0.75rem', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'var(--color-bg-card)', padding: '0 1rem', color: 'var(--color-text-secondary)', fontSize: '0.75rem' }}>
                                OR
                            </span>
                        </div>

                        {/* Manual Username Import */}
                        <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>📝 Manual Username Import</h3>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                            Enter usernames (one per line). The system will fetch their profile data.
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.75rem', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                    Platform
                                </label>
                                <select
                                    value={bulkPlatform}
                                    onChange={(e) => setBulkPlatform(e.target.value as PrimaryPlatform)}
                                    title="Select platform"
                                    style={{ width: '100%' }}
                                >
                                    <option value="Instagram">Instagram</option>
                                    <option value="TikTok">TikTok</option>
                                    <option value="Twitter">Twitter / X</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.75rem', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                    Category
                                </label>
                                <select
                                    value={bulkCategory}
                                    onChange={(e) => setBulkCategory(e.target.value as Category)}
                                    title="Select category"
                                    style={{ width: '100%' }}
                                >
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.75rem', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                    Location
                                </label>
                                <select
                                    value={bulkLocation}
                                    onChange={(e) => setBulkLocation(e.target.value as Location)}
                                    title="Select location"
                                    style={{ width: '100%' }}
                                >
                                    {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                                </select>
                            </div>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.75rem', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                Usernames (one per line)
                            </label>
                            <textarea
                                value={bulkUsernames}
                                onChange={(e) => setBulkUsernames(e.target.value)}
                                placeholder="@username1&#10;@username2&#10;@username3"
                                rows={6}
                                style={{ width: '100%', resize: 'vertical', fontFamily: 'monospace' }}
                                disabled={isImporting}
                            />
                        </div>

                        {isImporting && (
                            <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: 'var(--color-bg-secondary)' }}>
                                <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                    Importing... {importProgress.current} / {importProgress.total}
                                </p>
                                <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--color-border)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div
                                        style={{
                                            width: `${(importProgress.current / importProgress.total) * 100}%`,
                                            height: '100%',
                                            backgroundColor: '#4a90d9',
                                            transition: 'width 300ms ease',
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            onClick={handleBulkImport}
                            disabled={isImporting || !bulkUsernames.trim()}
                            className="btn"
                            style={{
                                opacity: isImporting || !bulkUsernames.trim() ? 0.5 : 1,
                                cursor: isImporting || !bulkUsernames.trim() ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {isImporting ? `Importing ${importProgress.current}/${importProgress.total}...` : '🚀 Start Import'}
                        </button>
                    </div>
                )}

                {/* Profile List */}
                {activeTab !== 'import' && (
                    filteredProfiles.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem' }}>
                            <p style={{ color: 'var(--color-text-secondary)' }}>No {activeTab} profiles.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {/* Bulk Actions Toolbar */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '1rem',
                                backgroundColor: 'var(--color-bg-secondary)',
                                border: '1px solid var(--color-border)',
                                marginBottom: '1rem'
                            }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={filteredProfiles.length > 0 && selectedProfiles.length === filteredProfiles.length}
                                        onChange={() => toggleAllSelection(filteredProfiles)}
                                        style={{ accentColor: 'var(--color-primary)' }}
                                    />
                                    <span style={{ fontSize: '0.875rem' }}>Select All ({filteredProfiles.length})</span>
                                </label>

                                {selectedProfiles.length > 0 && (
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        {activeTab === 'pending' && (
                                            <button
                                                onClick={bulkApprove}
                                                className="btn"
                                                style={{
                                                    backgroundColor: '#2ecc71',
                                                    color: 'white',
                                                    padding: '0.5rem 1rem',
                                                    fontSize: '0.875rem',
                                                    border: 'none'
                                                }}
                                            >
                                                ✅ Approve ({selectedProfiles.length})
                                            </button>
                                        )}
                                        <button
                                            onClick={bulkDelete}
                                            className="btn"
                                            style={{
                                                backgroundColor: '#e74c3c',
                                                color: 'white',
                                                padding: '0.5rem 1rem',
                                                fontSize: '0.875rem',
                                                border: 'none'
                                            }}
                                        >
                                            🗑️ Delete ({selectedProfiles.length})
                                        </button>
                                    </div>
                                )}
                            </div>

                            {filteredProfiles.map(profile => (
                                <div key={profile.id} style={{ padding: '1.5rem', backgroundColor: 'var(--color-bg-card)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {/* Profile Header */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            {/* Checkbox for selection */}
                                            {activeTab === 'pending' && (
                                                <input
                                                    type="checkbox"
                                                    checked={selectedProfiles.includes(profile.id)}
                                                    onChange={() => toggleSelection(profile.id)}
                                                    style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
                                                />
                                            )}

                                            {/* Platform Badge */}
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: 'var(--color-bg-secondary)',
                                                border: '1px solid var(--color-border)',
                                            }}>
                                                <PlatformIcon platform={profile.primary_platform} />
                                            </div>
                                            <div>
                                                <h3 style={{ marginBottom: '0.25rem' }}>{profile.full_name}</h3>
                                                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                                                    {profile.primary_handle}
                                                    {profile.follower_count && (
                                                        <span style={{ marginLeft: '0.5rem', color: 'var(--color-accent)' }}>
                                                            • {formatFollowers(profile.follower_count)} followers
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                            <span style={{
                                                fontSize: '0.6875rem',
                                                fontFamily: 'var(--font-display)',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em',
                                                padding: '0.375rem 0.75rem',
                                                border: '1px solid var(--color-border)',
                                            }}>
                                                {profile.category}
                                            </span>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                                                {profile.location}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Multi-Platform Handles */}
                                    {(profile.instagram_handle || profile.tiktok_handle || profile.twitter_handle) && (
                                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                                            {profile.instagram_handle && profile.primary_platform !== 'Instagram' && (
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                    <PlatformIcon platform="Instagram" size={12} /> {profile.instagram_handle}
                                                </span>
                                            )}
                                            {profile.tiktok_handle && profile.primary_platform !== 'TikTok' && (
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                    <PlatformIcon platform="TikTok" size={12} /> {profile.tiktok_handle}
                                                </span>
                                            )}
                                            {profile.twitter_handle && profile.primary_platform !== 'Twitter' && (
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                    <PlatformIcon platform="Twitter" size={12} /> {profile.twitter_handle}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    <p style={{ fontSize: '0.9375rem' }}>{profile.bio}</p>

                                    {/* Actions */}
                                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
                                        <a
                                            href={getPlatformUrl(profile.primary_platform, profile.primary_handle)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                fontSize: '0.75rem',
                                                fontFamily: 'var(--font-display)',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em',
                                                color: 'var(--color-accent)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.25rem',
                                            }}
                                        >
                                            <PlatformIcon platform={profile.primary_platform} size={12} />
                                            View Profile ↗
                                        </a>

                                        <button
                                            onClick={() => handleFetchStats(profile)}
                                            disabled={fetchingStats === profile.id}
                                            style={{
                                                fontSize: '0.75rem',
                                                fontFamily: 'var(--font-display)',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em',
                                                color: '#4a90d9',
                                                background: 'none',
                                                border: 'none',
                                                cursor: fetchingStats === profile.id ? 'wait' : 'pointer',
                                                opacity: fetchingStats === profile.id ? 0.5 : 1,
                                            }}
                                        >
                                            {fetchingStats === profile.id ? '⏳ Fetching...' : '📊 Fetch Stats'}
                                        </button>

                                        <button
                                            onClick={() => setEditingProfile(profile)}
                                            style={{
                                                fontSize: '0.75rem',
                                                fontFamily: 'var(--font-display)',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em',
                                                color: 'var(--color-text-secondary)',
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            Edit
                                        </button>

                                        {activeTab === 'pending' && (
                                            <button
                                                onClick={() => deleteProfile(profile.id)}
                                                style={{
                                                    fontSize: '0.75rem',
                                                    fontFamily: 'var(--font-display)',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.05em',
                                                    color: '#e74c3c',
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                🗑️ Delete
                                            </button>
                                        )}

                                        {activeTab === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => updateProfileStatus(profile.id, 'approved')}
                                                    style={{
                                                        fontSize: '0.75rem',
                                                        fontFamily: 'var(--font-display)',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.05em',
                                                        color: '#6a9c6a',
                                                        background: 'none',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    ✓ Approve
                                                </button>
                                                <button
                                                    onClick={() => updateProfileStatus(profile.id, 'rejected')}
                                                    style={{
                                                        fontSize: '0.75rem',
                                                        fontFamily: 'var(--font-display)',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.05em',
                                                        color: '#c9746a',
                                                        background: 'none',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    ✕ Reject
                                                </button>
                                            </>
                                        )}

                                        {activeTab === 'rejected' && (
                                            <button
                                                onClick={() => updateProfileStatus(profile.id, 'approved')}
                                                style={{
                                                    fontSize: '0.75rem',
                                                    fontFamily: 'var(--font-display)',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.05em',
                                                    color: '#6a9c6a',
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                ✓ Approve
                                            </button>
                                        )}

                                        <button
                                            onClick={() => deleteProfile(profile.id)}
                                            style={{
                                                fontSize: '0.75rem',
                                                fontFamily: 'var(--font-display)',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em',
                                                color: '#c9746a',
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                marginLeft: 'auto',
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>

            {/* Edit Modal */}
            {editingProfile && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1rem',
                        zIndex: 200,
                    }}
                    onClick={() => setEditingProfile(null)}
                >
                    <div
                        style={{
                            backgroundColor: 'var(--color-bg-primary)',
                            padding: '2rem',
                            maxWidth: '500px',
                            width: '100%',
                            maxHeight: '90vh',
                            overflowY: 'auto',
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <h2 style={{ marginBottom: '1.5rem' }}>Edit Profile</h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {/* Platform Selection */}
                            <div>
                                <label>Primary Platform</label>
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                    {(['Instagram', 'TikTok', 'Twitter'] as PrimaryPlatform[]).map(p => (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => setEditingProfile({ ...editingProfile, primary_platform: p })}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '44px',
                                                height: '44px',
                                                border: editingProfile.primary_platform === p ? '1px solid var(--color-text-primary)' : '1px solid var(--color-border)',
                                                cursor: 'pointer',
                                                background: editingProfile.primary_platform === p ? 'var(--color-bg-secondary)' : 'transparent',
                                            }}
                                        >
                                            <PlatformIcon platform={p} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="edit_handle">Primary Handle</label>
                                <input
                                    id="edit_handle"
                                    type="text"
                                    value={editingProfile.primary_handle}
                                    onChange={e => setEditingProfile({ ...editingProfile, primary_handle: e.target.value })}
                                />
                            </div>

                            <div>
                                <label htmlFor="edit_name">Full Name</label>
                                <input
                                    id="edit_name"
                                    type="text"
                                    value={editingProfile.full_name}
                                    onChange={e => setEditingProfile({ ...editingProfile, full_name: e.target.value })}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label htmlFor="edit_category">Category</label>
                                    <select
                                        id="edit_category"
                                        value={editingProfile.category}
                                        onChange={e => setEditingProfile({ ...editingProfile, category: e.target.value as Category })}
                                    >
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="edit_location">Location</label>
                                    <select
                                        id="edit_location"
                                        value={editingProfile.location}
                                        onChange={e => setEditingProfile({ ...editingProfile, location: e.target.value as Location })}
                                    >
                                        {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="edit_bio">Bio</label>
                                <textarea
                                    id="edit_bio"
                                    value={editingProfile.bio}
                                    onChange={e => setEditingProfile({ ...editingProfile, bio: e.target.value })}
                                    rows={3}
                                    style={{ resize: 'vertical' }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label htmlFor="edit_followers">Followers</label>
                                    <input
                                        id="edit_followers"
                                        type="number"
                                        value={editingProfile.follower_count || ''}
                                        onChange={e => setEditingProfile({ ...editingProfile, follower_count: e.target.value ? Number(e.target.value) : undefined })}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="edit_following">Following</label>
                                    <input
                                        id="edit_following"
                                        type="number"
                                        value={editingProfile.following_count || ''}
                                        onChange={e => setEditingProfile({ ...editingProfile, following_count: e.target.value ? Number(e.target.value) : undefined })}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="edit_posts">Posts</label>
                                    <input
                                        id="edit_posts"
                                        type="number"
                                        value={editingProfile.posts_count || ''}
                                        onChange={e => setEditingProfile({ ...editingProfile, posts_count: e.target.value ? Number(e.target.value) : undefined })}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button onClick={saveEditedProfile} className="btn" style={{ flex: 1 }}>
                                    Save Changes
                                </button>
                                <button onClick={() => setEditingProfile(null)} className="btn btn-secondary" style={{ flex: 1 }}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={confirmation.isOpen}
                title={confirmation.title}
                message={confirmation.message}
                onConfirm={handleConfirm}
                onCancel={closeConfirmation}
                isDestructive={confirmation.isDestructive}
            />

            {/* Toast Notifications */}
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
            />
        </section>
    );
}
