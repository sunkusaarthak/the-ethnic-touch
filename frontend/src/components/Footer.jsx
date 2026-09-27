import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate, Link, useLocation, useParams, Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';

const Footer = () => (
    <footer className="footer">
        <div className="footer-content">
            <h3 className="footer-logo">The Ethnic Touch</h3>
            <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '0.95rem', lineHeight: '1.6', color: '#555' }}>
                The Ethnic Touch is a contemporary ethnic fashion brand dedicated to bringing you authentic, high-quality Jaipur kurtis. Every piece in our collection is uniquely designed in-house, made with carefully selected premium fabrics, and crafted directly in Jaipur. We bridge timeless tradition with modern comfort—offering exclusive collections in our physical store and shipping nationwide through our online store.
            </p>
            <div className="footer-links" style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                <Link to="/about" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontSize: '0.95rem' }}>About Us</Link>
                <Link to="/blog" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontSize: '0.95rem' }}>Style Guide & Journal</Link>
                <Link to="/privacy-policy" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontSize: '0.95rem' }}>Privacy Policy</Link>
                <Link to="/refund-policy" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontSize: '0.95rem' }}>Refund & Cancellation Policy</Link>
                <Link to="/contact" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontSize: '0.95rem' }}>Contact Us</Link>
            </div>
            <p className="copyright" style={{ marginTop: '2rem' }}>&copy; 2026 The Ethnic Touch. All rights reserved.</p>
        </div>
    </footer>
);

// --- PAGES ---

export default Footer;
