import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate, Link, useLocation, useParams, Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';

const Footer = () => (
    <footer className="footer">
        <div className="footer-content">
            <h3 className="footer-logo">The Ethnic Touch</h3>
            <p>Elevating the Indo-Western narrative through minimal, attractive designs.</p>
            <div className="footer-links" style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                <Link to="/policies#privacy" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontSize: '0.95rem' }}>Privacy Policy</Link>
                <Link to="/policies#refund" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontSize: '0.95rem' }}>Refund & Cancellation Policy</Link>
                <Link to="/policies#contact" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontSize: '0.95rem' }}>Contact Us</Link>
            </div>
            <p className="copyright" style={{ marginTop: '2rem' }}>&copy; 2026 The Ethnic Touch. All rights reserved.</p>
        </div>
    </footer>
);

// --- PAGES ---

export default Footer;
