'use client';

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    isDestructive?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export default function ConfirmationModal({
    isOpen,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    isDestructive = false,
    onConfirm,
    onCancel,
    isLoading = false
}: ConfirmationModalProps) {
    if (!isOpen) return null;

    // Handle backdrop click
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && !isLoading) {
            onCancel();
        }
    };

    return (
        <div
            role="dialog"
            aria-modal="true"
            onClick={handleBackdropClick}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 1100, // Higher than other modals
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(4px)',
                animation: 'fadeIn 200ms ease',
            }}
        >
            <div
                style={{
                    backgroundColor: 'var(--color-bg-card, #ffffff)',
                    color: 'var(--color-text-primary, #000000)',
                    borderRadius: '12px',
                    width: '100%',
                    maxWidth: '400px',
                    padding: '1.5rem',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                    animation: 'slideUp 200ms ease',
                    border: '1px solid var(--color-border, transparent)',
                }}
            >
                <div style={{ marginBottom: '1rem' }}>
                    <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: 600,
                        marginBottom: '0.5rem',
                        color: 'var(--color-text-primary)'
                    }}>
                        {title}
                    </h3>
                    <p style={{
                        fontSize: '0.9rem',
                        color: 'var(--color-text-secondary, #666)',
                        lineHeight: 1.5
                    }}>
                        {message}
                    </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            border: '1px solid var(--color-border, #ddd)',
                            backgroundColor: 'transparent',
                            color: 'var(--color-text-secondary, #666)',
                            fontSize: '0.875rem',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            opacity: isLoading ? 0.7 : 1,
                        }}
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: isDestructive ? '#e74c3c' : 'var(--color-primary, #000)',
                            color: '#ffffff',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            opacity: isLoading ? 0.7 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                        }}
                    >
                        {isLoading && <span className="spinner">⌛</span>}
                        {confirmLabel}
                    </button>
                </div>
            </div>
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
