import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate, Link, useLocation, useParams, Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';

const PremiumAlertModal = ({ isOpen, onClose, title = "Notice", message = "", type = "warning" }) => {
    if (!isOpen) return null;

    const iconColor = type === 'error' ? '#d32f2f' : type === 'success' ? '#2e7d32' : '#b97a66';
    const iconBg = type === 'error' ? '#ffebee' : type === 'success' ? '#e8f5e9' : '#fff0e9';

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999999,
            padding: '1.5rem',
            animation: 'modalFadeIn 0.25s ease-out'
        }} onClick={onClose}>
            <div style={{
                background: '#ffffff',
                borderRadius: '16px',
                maxWidth: '440px',
                width: '100%',
                padding: '2rem 1.8rem',
                boxShadow: '0 25px 60px rgba(0,0,0,0.18)',
                textAlign: 'center',
                position: 'relative',
                animation: 'modalSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                border: '1px solid rgba(0,0,0,0.06)'
            }} onClick={e => e.stopPropagation()}>
                
                <button 
                    onClick={onClose}
                    aria-label="Close dialog"
                    style={{
                        position: 'absolute',
                        top: '1.2rem',
                        right: '1.2rem',
                        background: 'none',
                        border: 'none',
                        fontSize: '1.2rem',
                        color: '#aaa',
                        cursor: 'pointer',
                        padding: '0.3rem',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    ✕
                </button>

                <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: iconBg,
                    color: iconColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.2rem',
                    boxShadow: `0 8px 20px ${iconBg}`
                }}>
                    {type === 'error' ? (
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                    ) : type === 'success' ? (
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    ) : (
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                            <line x1="12" y1="9" x2="12" y2="13" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                    )}
                </div>

                <h3 style={{
                    fontFamily: 'var(--font-title, serif)',
                    fontSize: '1.4rem',
                    fontWeight: '600',
                    color: '#2D2A26',
                    margin: '0 0 0.6rem'
                }}>
                    {title}
                </h3>

                <p style={{
                    fontSize: '0.96rem',
                    color: '#6C6863',
                    lineHeight: '1.6',
                    margin: '0 0 1.8rem'
                }}>
                    {message}
                </p>

                <button 
                    onClick={onClose}
                    className="btn btn-primary"
                    style={{
                        width: '100%',
                        padding: '0.9rem',
                        fontSize: '1rem',
                        borderRadius: '8px'
                    }}
                >
                    Understood
                </button>
            </div>
        </div>
    );
};

const showAlert = (message, title = "Notice", type = "warning") => {
    if (window.customAlert) {
        window.customAlert(message, title, type);
    } else {
        alert(message);
    }
};

export default PremiumAlertModal;
