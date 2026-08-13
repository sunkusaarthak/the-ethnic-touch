import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate, Link, useLocation, useParams, Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';

const Footer = () => (
    <footer className="footer">
        <div className="footer-content">
            <h3 className="footer-logo">The Ethnic Touch</h3>
            <p>Elevating the Indo-Western narrative through minimal, attractive designs.</p>
            <div style={{ display: 'flex', gap: '1.2rem', justifyContent: 'center', margin: '0.4rem 0 0.2rem' }}>
                <a href="/admin/index.html" style={{ color: 'var(--color-primary)', fontSize: 'var(--font-size-xs)', fontWeight: '600', textDecoration: 'none' }}>
                    Admin Portal &rarr;
                </a>
            </div>
            <p className="copyright">&copy; 2026 The Ethnic Touch. All rights reserved.</p>
        </div>
    </footer>
);

// --- PAGES ---

export default Footer;
