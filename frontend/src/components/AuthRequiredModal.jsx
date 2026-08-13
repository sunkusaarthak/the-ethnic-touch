import React from 'react';
import { useNavigate } from 'react-router-dom';

const AuthRequiredModal = ({ isOpen, onClose, redirectPath = '/checkout' }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleProceedToAuth = () => {
        onClose();
        navigate(`/auth?redirect=${encodeURIComponent(redirectPath)}`);
    };

    return (
        <div 
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(45, 42, 38, 0.65)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 999999,
                padding: '1.5rem'
            }} 
            onClick={onClose}
        >
            <div 
                style={{
                    background: '#FFFFFF',
                    borderRadius: '24px',
                    maxWidth: '460px',
                    width: '100%',
                    padding: '2.5rem 2rem 2rem',
                    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.22)',
                    textAlign: 'center',
                    position: 'relative',
                    border: '1.5px solid rgba(212, 163, 115, 0.3)'
                }} 
                onClick={e => e.stopPropagation()}
            >
                <button 
                    onClick={onClose}
                    aria-label="Close dialog"
                    style={{
                        position: 'absolute',
                        top: '1.2rem',
                        right: '1.2rem',
                        background: '#FAF7F4',
                        border: 'none',
                        fontSize: '1rem',
                        color: '#888',
                        cursor: 'pointer',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    ✕
                </button>

                {/* Royal Lock Icon */}
                <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#FAF7F2',
                    border: '1.5px solid rgba(212, 163, 115, 0.4)',
                    color: '#8F5E36',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem'
                }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                </div>

                <h3 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.5rem',
                    fontWeight: '400',
                    color: '#2D2A26',
                    margin: '0 0 0.6rem'
                }}>
                    Sign In Required
                </h3>

                <p style={{
                    fontSize: '0.88rem',
                    color: '#6C6863',
                    lineHeight: '1.6',
                    margin: '0 0 1.75rem'
                }}>
                    Please sign in using your Phone Number or Google to complete your purchase. You'll be returned directly to <strong>Checkout</strong> right after!
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <button 
                        onClick={handleProceedToAuth}
                        style={{
                            width: '100%',
                            padding: '0.85rem',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            background: 'linear-gradient(135deg, #D4A373 0%, #C49363 100%)',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '50px',
                            cursor: 'pointer',
                            boxShadow: '0 6px 20px rgba(212, 163, 115, 0.3)',
                            transition: 'all 0.25s ease'
                        }}
                    >
                        Proceed to Sign In &rarr;
                    </button>

                    <button 
                        onClick={onClose}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            fontSize: '0.85rem',
                            fontWeight: '500',
                            background: 'transparent',
                            color: '#6C6863',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        Cancel & Stay on Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthRequiredModal;
