import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate, Link, useLocation, useParams, Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';

// --- REUSABLE COPY BUTTON COMPONENT ---
const CopyButton = ({ text, label = '', iconOnly = false, style = {}, className = '' }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (!text) return;
        
        const textToCopy = String(text).trim();
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }).catch(() => fallbackCopy(textToCopy));
        } else {
            fallbackCopy(textToCopy);
        }
    };

    const fallbackCopy = (str) => {
        try {
            const el = document.createElement('textarea');
            el.value = str;
            el.setAttribute('readonly', '');
            el.style.position = 'absolute';
            el.style.left = '-9999px';
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Copy failed", err);
        }
    };

    return (
        <button
            type="button"
            onClick={handleCopy}
            title={copied ? "Copied to clipboard!" : `Copy ${text}`}
            className={`copy-btn-component ${copied ? 'copied' : ''} ${className}`}
            style={{ ...style }}
        >
            {copied ? (
                <React.Fragment>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {!iconOnly && <span>Copied!</span>}
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    {!iconOnly && label && <span>{label}</span>}
                </React.Fragment>
            )}
        </button>
    );
};


export default CopyButton;
