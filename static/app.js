const { useState, useEffect, useRef } = React;
const { HashRouter, Routes, Route, Link, useParams, useNavigate } = ReactRouterDOM;

const firebaseConfig = {
    apiKey: "AIzaSyDSrS3zywg8ao1lvK9NWmy1RDR33Nim2h8",
    authDomain: "the-ethnic-touch.firebaseapp.com",
    projectId: "the-ethnic-touch",
    storageBucket: "the-ethnic-touch.firebasestorage.app",
    messagingSenderId: "***REMOVED***",
    appId: "***REMOVED***",
    measurementId: "***REMOVED***"
};

if (window.firebase && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = window.firebase ? firebase.auth() : null;

// --- DUMMY FALLBACK DATA ---
const fallbackProducts = [
    { id: "1", name: "Pastel Peach Anarkali", description: "A delicate premium silk Kurthi in soft peach, featuring intricate silver zari work.", price: 10999, imageUrl: "./images/kurthi_peach.png" },
    { id: "2", name: "Mint Breeze Straight Cut", description: "Minimalist mint green kurthi perfect for a fresh, elegant everyday look.", price: 5499, imageUrl: "./images/kurthi_mint.png" },
    { id: "3", name: "Lavender Dream Tunic", description: "Indo-western fusion tunic in soft lavender. Premium georgette fabric.", price: 8999, imageUrl: "./images/kurthi_lavender.png" },
    { id: "4", name: "Powder Blue Elegance", description: "A sophisticated powder blue kurthi with minimal floral embroidery.", price: 12499, imageUrl: "./images/kurthi_blue.png" }
];

// --- COMPONENTS ---

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

// --- PREMIUM MODAL ALERT COMPONENT ---
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

const Navbar = ({ products, cartCount, wishlistCount, authUser, authLoading, onSearchSubmit, globalSearch, setGlobalSearch }) => {
    const [animateCart, setAnimateCart] = useState(false);
    const [animateWishlist, setAnimateWishlist] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);
    const overlayRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (cartCount > 0) {
            setAnimateCart(true);
            const timer = setTimeout(() => setAnimateCart(false), 450);
            return () => clearTimeout(timer);
        }
    }, [cartCount]);

    useEffect(() => {
        if (wishlistCount > 0) {
            setAnimateWishlist(true);
            const timer = setTimeout(() => setAnimateWishlist(false), 450);
            return () => clearTimeout(timer);
        }
    }, [wishlistCount]);

    useEffect(() => {
        const stored = localStorage.getItem('tet_recent_searches');
        if (stored) {
            try { setRecentSearches(JSON.parse(stored)); } catch(e){}
        }
    }, []);

    const addRecentSearch = (q) => {
        if (!q.trim()) return;
        const filtered = [q.trim(), ...recentSearches.filter(s => s.toLowerCase() !== q.trim().toLowerCase())].slice(0, 5);
        setRecentSearches(filtered);
        localStorage.setItem('tet_recent_searches', JSON.stringify(filtered));
    };

    const handleSearchSubmit = (q) => {
        addRecentSearch(q);
        setGlobalSearch(q);
        setIsFocused(false);
        setMobileMenuOpen(false);
        setMobileSearchOpen(false);
        onSearchSubmit(q);
    };

    const popularTags = ["Silk", "Cotton", "Daily Wear", "Anarkali", "Embroidered"];

    const matchingProducts = (globalSearch.trim().length > 1 && Array.isArray(products))
        ? products.filter(p => 
            p.name.toLowerCase().includes(globalSearch.toLowerCase()) || 
            (p.category && p.category.toLowerCase().includes(globalSearch.toLowerCase())) || 
            (p.tags && p.tags.toLowerCase().includes(globalSearch.toLowerCase()))
          ).slice(0, 4)
        : [];

    return (
        <nav className="navbar" style={{ padding: '0.8rem 5%' }}>
            <div className="nav-container" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', width: '100%' }}>
                {/* Mobile Hamburger Button */}
                <button 
                    type="button" 
                    className="mobile-hamburger-btn" 
                    onClick={() => setMobileMenuOpen(true)}
                    aria-label="Open mobile menu"
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </button>

                <Link to="/" onClick={() => { setGlobalSearch(''); setMobileMenuOpen(false); setMobileSearchOpen(false); }} className="logo" style={{ flexShrink: 0 }}>
                    The Ethnic Touch
                </Link>
                
                {/* Desktop Search Container */}
                <div className="search-container" ref={overlayRef} style={{ flex: 1, maxWidth: '350px', margin: '0 auto' }}>
                    <div className="search-input-wrapper">
                        <span className="search-icon">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        </span>
                        <input 
                            type="text" 
                            className="search-input" 
                            placeholder="Search wardrobe..."
                            value={globalSearch}
                            onChange={(e) => setGlobalSearch(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSearchSubmit(globalSearch);
                            }}
                        />
                        {globalSearch && (
                            <button 
                                onClick={() => setGlobalSearch('')} 
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontSize: '1.1rem', padding: '0 4px' }}
                            >
                                &times;
                            </button>
                        )}
                    </div>

                    {/* Desktop Suggestions Overlay */}
                    {isFocused && !mobileSearchOpen && (
                        <div className="search-suggestions-overlay" style={{ left: 0, right: 0, width: '100%' }}>
                            {globalSearch.trim().length <= 1 ? (
                                <div>
                                    {recentSearches.length > 0 && (
                                        <div style={{ marginBottom: '1rem' }}>
                                            <div className="suggestion-section-title">Recent Searches</div>
                                            <div className="suggestion-tags">
                                                {recentSearches.map((s, idx) => (
                                                    <span 
                                                        key={idx} 
                                                        className="suggestion-tag-chip"
                                                        onClick={() => handleSearchSubmit(s)}
                                                    >
                                                        {s}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <div>
                                        <div className="suggestion-section-title">Trending Now</div>
                                        <div className="suggestion-tags">
                                            {popularTags.map((tag, idx) => (
                                                <span 
                                                    key={idx} 
                                                    className="suggestion-tag-chip"
                                                    onClick={() => handleSearchSubmit(tag)}
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className="suggestion-section-title">Suggested Products</div>
                                    {matchingProducts.length === 0 ? (
                                        <div style={{ fontSize: '0.85rem', color: '#999', padding: '8px 0' }}>No products matching "{globalSearch}"</div>
                                    ) : (
                                        <div className="matching-products-list">
                                            {matchingProducts.map(p => (
                                                <Link 
                                                    key={p.id} 
                                                    to={`/product/${p.id}`} 
                                                    className="matching-product-item"
                                                    onClick={() => setIsFocused(false)}
                                                >
                                                    <img src={p.imageUrl} className="matching-product-img" alt={p.name} />
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div className="matching-product-name" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                                                        <div className="matching-product-price">₹{p.price.toLocaleString('en-IN')}</div>
                                                    </div>
                                                </Link>
                                            ))}
                                            <div 
                                                onClick={() => handleSearchSubmit(globalSearch)}
                                                style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: '600', padding: '6px 0', borderTop: '1px solid #f5f5f5', marginTop: '4px', cursor: 'pointer' }}
                                            >
                                                View all matches &rarr;
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Mobile Quick Action Badges (Search, Wishlist & Cart) */}
                <div className="mobile-header-actions">
                    <button 
                        type="button" 
                        className="mobile-search-toggle-btn" 
                        onClick={() => { setMobileSearchOpen(!mobileSearchOpen); setIsFocused(!mobileSearchOpen); }}
                        title="Search wardrobe"
                    >
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </button>

                    <Link to="/wishlist" className="mobile-icon-badge" title="Wishlist">
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill={wishlistCount > 0 ? "var(--color-primary)" : "none"}>
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        {wishlistCount > 0 && <span className="mobile-badge-count">{wishlistCount}</span>}
                    </Link>

                    <Link to="/cart" className="mobile-icon-badge" title="Cart">
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                        {cartCount > 0 && <span className="mobile-badge-count">{cartCount}</span>}
                    </Link>
                </div>

                {/* Desktop Nav Links */}
                <ul className="nav-links" style={{ flexShrink: 0, margin: 0, display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/shop">Shop</Link></li>

                    <li>
                        <Link to="/wishlist" className={`wishlist-btn ${animateWishlist ? 'wishlist-badge' : ''}`}>
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill={wishlistCount > 0 ? "var(--color-primary)" : "none"} style={{ color: wishlistCount > 0 ? "var(--color-primary)" : "currentColor", transition: 'all 0.3s ease' }}><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                            <span>Wishlist ({wishlistCount})</span>
                        </Link>
                    </li>

                    <li>
                        <Link to="/cart" className="cart-btn">
                            <span className={animateCart ? 'cart-animated' : ''}>Cart ({cartCount})</span>
                        </Link>
                    </li>
                    {authLoading ? (
                        <li><span className="nav-links-signin nav-links-disabled">Loading...</span></li>
                    ) : authUser ? (
                        <li><Link to="/profile" className="nav-links-signin">Profile</Link></li>
                    ) : (
                        <li><a href="./login.html" className="nav-links-signin">Sign In</a></li>
                    )}
                </ul>
            </div>

            {/* Mobile Expandable Search Row */}
            {mobileSearchOpen && (
                <div className="mobile-search-row">
                    <div className="search-input-wrapper">
                        <span className="search-icon">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        </span>
                        <input 
                            type="text" 
                            className="search-input" 
                            placeholder="Search wardrobe, fabrics..."
                            value={globalSearch}
                            onChange={(e) => setGlobalSearch(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSearchSubmit(globalSearch);
                            }}
                        />
                        <button 
                            onClick={() => setMobileSearchOpen(false)} 
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontSize: '1.2rem', padding: '0 8px' }}
                        >
                            &times;
                        </button>
                    </div>

                    {/* Mobile Suggestions Overlay */}
                    {isFocused && (
                        <div className="search-suggestions-overlay" style={{ left: 0, right: 0, width: '100%', top: '100%', position: 'absolute', zIndex: 9999 }}>
                            {globalSearch.trim().length <= 1 ? (
                                <div>
                                    {recentSearches.length > 0 && (
                                        <div style={{ marginBottom: '1rem' }}>
                                            <div className="suggestion-section-title">Recent Searches</div>
                                            <div className="suggestion-tags">
                                                {recentSearches.map((s, idx) => (
                                                    <span 
                                                        key={idx} 
                                                        className="suggestion-tag-chip"
                                                        onClick={() => handleSearchSubmit(s)}
                                                    >
                                                        {s}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <div>
                                        <div className="suggestion-section-title">Trending Now</div>
                                        <div className="suggestion-tags">
                                            {popularTags.map((tag, idx) => (
                                                <span 
                                                    key={idx} 
                                                    className="suggestion-tag-chip"
                                                    onClick={() => handleSearchSubmit(tag)}
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className="suggestion-section-title">Suggested Products</div>
                                    {matchingProducts.length === 0 ? (
                                        <div style={{ fontSize: '0.85rem', color: '#999', padding: '8px 0' }}>No products matching "{globalSearch}"</div>
                                    ) : (
                                        <div className="matching-products-list">
                                            {matchingProducts.map(p => (
                                                <Link 
                                                    key={p.id} 
                                                    to={`/product/${p.id}`} 
                                                    className="matching-product-item"
                                                    onClick={() => { setIsFocused(false); setMobileSearchOpen(false); }}
                                                >
                                                    <img src={p.imageUrl} className="matching-product-img" alt={p.name} />
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div className="matching-product-name" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                                                        <div className="matching-product-price">₹{p.price.toLocaleString('en-IN')}</div>
                                                    </div>
                                                </Link>
                                            ))}
                                            <div 
                                                onClick={() => handleSearchSubmit(globalSearch)}
                                                style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: '600', padding: '6px 0', borderTop: '1px solid #f5f5f5', marginTop: '4px', cursor: 'pointer' }}
                                            >
                                                View all matches &rarr;
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Mobile Navigation Drawer (Portaled directly to document.body) */}
            {mobileMenuOpen && ReactDOM.createPortal(
                <React.Fragment>
                    <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)} />
                    <div className="mobile-drawer-content">
                        <div className="mobile-drawer-header">
                            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="logo" style={{ fontSize: '1.35rem' }}>
                                The Ethnic Touch
                            </Link>
                            <button className="mobile-drawer-close" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">&times;</button>
                        </div>
                        
                        <div className="mobile-drawer-body">
                            <div className="mobile-drawer-nav-group">
                                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="mobile-drawer-item">
                                    <div className="drawer-item-icon">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                                    </div>
                                    <span className="drawer-item-label">Home Collection</span>
                                </Link>

                                <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="mobile-drawer-item">
                                    <div className="drawer-item-icon">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                                    </div>
                                    <span className="drawer-item-label">Explore Shop & Fabrics</span>
                                </Link>

                                <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="mobile-drawer-item">
                                    <div className="drawer-item-icon">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill={wishlistCount > 0 ? "var(--color-primary)" : "none"} stroke={wishlistCount > 0 ? "var(--color-primary)" : "currentColor"} strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                    </div>
                                    <span className="drawer-item-label">My Wishlist</span>
                                    {wishlistCount > 0 && <span className="drawer-badge-pill">{wishlistCount}</span>}
                                </Link>

                                <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className="mobile-drawer-item">
                                    <div className="drawer-item-icon">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                                    </div>
                                    <span className="drawer-item-label">Shopping Cart</span>
                                    {cartCount > 0 && <span className="drawer-badge-pill">{cartCount}</span>}
                                </Link>

                                {authUser ? (
                                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="mobile-drawer-item">
                                        <div className="drawer-item-icon">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 1-4-4H8a4 4 0 0 1-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                        </div>
                                        <span className="drawer-item-label">My Profile & Orders</span>
                                    </Link>
                                ) : (
                                    <a href="./login.html" onClick={() => setMobileMenuOpen(false)} className="mobile-drawer-item">
                                        <div className="drawer-item-icon">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
                                        </div>
                                        <span className="drawer-item-label">Sign In / Register</span>
                                    </a>
                                )}
                            </div>

                            <div className="mobile-drawer-sub-group">
                                <div className="drawer-sub-heading">Featured Silhouettes</div>
                                <div className="drawer-sub-grid">
                                    <Link to="/shop?category=Straight Cut" onClick={() => setMobileMenuOpen(false)} className="drawer-sub-chip">Straight Cut</Link>
                                    <Link to="/shop?category=Anarkali" onClick={() => setMobileMenuOpen(false)} className="drawer-sub-chip">Anarkali Sets</Link>
                                    <Link to="/shop?category=Tunic" onClick={() => setMobileMenuOpen(false)} className="drawer-sub-chip">Tunic Dresses</Link>
                                    <Link to="/shop?category=Fusion" onClick={() => setMobileMenuOpen(false)} className="drawer-sub-chip">Fusion Wear</Link>
                                </div>
                            </div>
                        </div>

                        <div className="mobile-drawer-footer">
                            <div className="drawer-footer-badge">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                <span>100% Handcrafted Luxury Guarantee</span>
                            </div>
                        </div>
                    </div>
                </React.Fragment>,
                document.body
            )}

            {/* Click outside listener for search */}
            {isFocused && (
                <div onClick={() => setIsFocused(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }} />
            )}
        </nav>
    );
};

const Footer = () => (
    <footer className="footer">
        <div className="footer-content">
            <h3 className="footer-logo">The Ethnic Touch</h3>
            <p>Elevating the Indo-Western narrative through minimal, attractive designs.</p>
            <p className="copyright">&copy; 2026 The Ethnic Touch. All rights reserved.</p>
        </div>
    </footer>
);

// --- PAGES ---

const RenderProductCard = ({ product, wishlist, toggleWishlist }) => {
    const isWished = wishlist.some(item => item.id === product.id);

    return (
        <div style={{ position: 'relative' }}>
            <Link to={`/product/${product.id}`} className="product-card" style={{ display: 'block' }}>
                <div className="product-image-container">
                    <img src={product.imageUrl} alt={product.name} className="product-image" />
                </div>
                <div className="product-info">
                    <div style={{ flex: 1, minWidth: 0, paddingRight: '8px' }}>
                        <h3 className="product-name" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</h3>
                        <p className="product-desc" style={{ marginTop: '0.2rem' }}>{product.description}</p>
                        
                        <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                            {product.isNewArrival && (
                                <span style={{ fontSize: '0.65rem', background: '#faeedd', color: '#9c6c40', padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>New</span>
                            )}
                            {product.isBestSeller && (
                                <span style={{ fontSize: '0.65rem', background: '#e8f5e9', color: '#2e7d32', padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>Best Seller</span>
                            )}
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0 }}>
                        <div className="product-price">₹{product.price.toLocaleString('en-IN')}</div>
                        {product.originalPrice > product.price && (
                            <div style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.8rem', marginTop: '2px' }}>
                                ₹{product.originalPrice.toLocaleString('en-IN')}
                            </div>
                        )}
                    </div>
                </div>
            </Link>

            <button 
                className={`wishlist-heart-btn ${isWished ? 'active' : ''}`}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWishlist(product);
                }}
                aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
            >
                <svg viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
            </button>
        </div>
    );
};

const FilterSidebarContent = ({
    selectedCategories, setSelectedCategories,
    selectedSizes, setSelectedSizes,
    selectedFabrics, setSelectedFabrics,
    selectedPatterns, setSelectedPatterns,
    selectedSleeves, setSelectedSleeves,
    selectedOccasions, setSelectedOccasions,
    selectedCollections, setSelectedCollections,
    selectedColors, setSelectedColors,
    onlyNewArrivals, setOnlyNewArrivals,
    onlyBestSellers, setOnlyBestSellers,
    priceRange, setPriceRange
}) => {
    const handleCheckboxToggle = (list, setList, val) => {
        if (list.includes(val)) {
            setList(list.filter(item => item !== val));
        } else {
            setList([...list, val]);
        }
    };

    const categories = ["Straight Cut", "Anarkali", "Tunic", "Fusion", "Palazzo Set", "A-Line"];
    const sizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
    const fabrics = ["Cotton", "Rayon", "Linen", "Silk", "Georgette", "Viscose", "Chiffon", "Khadi"];
    const sleeves = ["Half Sleeve", "Full Sleeve", "Sleeveless", "Three Quarter"];
    const patterns = ["Printed", "Solid", "Embroidered", "Floral", "Striped", "Block Print"];
    const occasions = ["Daily Wear", "Office", "Festival", "Wedding", "Party", "Casual", "Traditional"];
    const collections = ["Festive Glow", "Summer Breeze", "Lavender Dream", "Monsoon Magic"];
    const colors = ["Peach", "Mint Green", "Lavender", "Blue", "Pink", "Red", "Yellow", "White", "Black"];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="filter-section">
                <div className="filter-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    <span>Specials</span>
                </div>
                <div className="filter-options">
                    <label className="filter-checkbox-label">
                        <input 
                            type="checkbox" 
                            checked={onlyNewArrivals}
                            onChange={(e) => setOnlyNewArrivals(e.target.checked)}
                        />
                        <span>New Arrivals Only</span>
                    </label>
                    <label className="filter-checkbox-label">
                        <input 
                            type="checkbox" 
                            checked={onlyBestSellers}
                            onChange={(e) => setOnlyBestSellers(e.target.checked)}
                        />
                        <span>Best Sellers Only</span>
                    </label>
                </div>
            </div>

            <div className="filter-section">
                <div className="filter-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
                    <span>Collection</span>
                </div>
                <div className="filter-options">
                    {collections.map(col => (
                        <label key={col} className="filter-checkbox-label">
                            <input 
                                type="checkbox" 
                                checked={selectedCollections.includes(col)}
                                onChange={() => handleCheckboxToggle(selectedCollections, setSelectedCollections, col)}
                            />
                            <span>{col}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="filter-section">
                <div className="filter-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                    <span>Category</span>
                </div>
                <div className="filter-options">
                    {categories.map(c => (
                        <label key={c} className="filter-checkbox-label">
                            <input 
                                type="checkbox" 
                                checked={selectedCategories.includes(c)}
                                onChange={() => handleCheckboxToggle(selectedCategories, setSelectedCategories, c)}
                            />
                            <span>{c}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="filter-section">
                <div className="filter-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><line x1="21" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="3" y2="18"></line></svg>
                    <span>Sizes</span>
                </div>
                <div className="filter-options" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', maxHeight: 'none' }}>
                    {sizes.map(s => {
                        const active = selectedSizes.includes(s);
                        return (
                            <button
                                key={s}
                                onClick={() => handleCheckboxToggle(selectedSizes, setSelectedSizes, s)}
                                style={{
                                    padding: '6px 0',
                                    border: `1.5px solid ${active ? 'var(--color-primary)' : 'rgba(0,0,0,0.08)'}`,
                                    background: active ? '#fffcf9' : '#FFF',
                                    color: active ? 'var(--color-primary)' : 'var(--color-text)',
                                    borderRadius: '6px',
                                    fontSize: '0.8rem',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {s}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="filter-section">
                <div className="filter-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                    <span>Price Range</span>
                </div>
                <div className="filter-options">
                    {[
                        { label: 'All Prices', value: 'all' },
                        { label: 'Under ₹2,000', value: 'under_2k' },
                        { label: '₹2,000 - ₹4,999', value: '2k_5k' },
                        { label: '₹5,000 - ₹9,999', value: '5k_10k' },
                        { label: '₹10,000+', value: 'over_10k' }
                    ].map(opt => (
                        <label key={opt.value} className="filter-checkbox-label">
                            <input 
                                type="radio" 
                                checked={priceRange === opt.value}
                                onChange={() => setPriceRange(opt.value)}
                            />
                            <span>{opt.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="filter-section">
                <div className="filter-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><line x1="2" y1="12" x2="22" y2="12"></line></svg>
                    <span>Fabric</span>
                </div>
                <div className="filter-options">
                    {fabrics.map(f => (
                        <label key={f} className="filter-checkbox-label">
                            <input 
                                type="checkbox" 
                                checked={selectedFabrics.includes(f)}
                                onChange={() => handleCheckboxToggle(selectedFabrics, setSelectedFabrics, f)}
                            />
                            <span>{f}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="filter-section">
                <div className="filter-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"></path></svg>
                    <span>Color Palette</span>
                </div>
                <div className="filter-options">
                    {colors.map(col => (
                        <label key={col} className="filter-checkbox-label">
                            <input 
                                type="checkbox" 
                                checked={selectedColors.includes(col)}
                                onChange={() => handleCheckboxToggle(selectedColors, setSelectedColors, col)}
                            />
                            <span>{col}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="filter-section">
                <div className="filter-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    <span>Occasion</span>
                </div>
                <div className="filter-options">
                    {occasions.map(o => (
                        <label key={o} className="filter-checkbox-label">
                            <input 
                                type="checkbox" 
                                checked={selectedOccasions.includes(o)}
                                onChange={() => handleCheckboxToggle(selectedOccasions, setSelectedOccasions, o)}
                            />
                            <span>{o}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="filter-section">
                <div className="filter-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"></path></svg>
                    <span>Sleeve Type</span>
                </div>
                <div className="filter-options">
                    {sleeves.map(sl => (
                        <label key={sl} className="filter-checkbox-label">
                            <input 
                                type="checkbox" 
                                checked={selectedSleeves.includes(sl)}
                                onChange={() => handleCheckboxToggle(selectedSleeves, setSelectedSleeves, sl)}
                            />
                            <span>{sl}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="filter-section" style={{ borderBottom: 'none', marginBottom: 0 }}>
                <div className="filter-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                    <span>Pattern & Craft</span>
                </div>
                <div className="filter-options">
                    {patterns.map(p => (
                        <label key={p} className="filter-checkbox-label">
                            <input 
                                type="checkbox" 
                                checked={selectedPatterns.includes(p)}
                                onChange={() => handleCheckboxToggle(selectedPatterns, setSelectedPatterns, p)}
                            />
                            <span>{p}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

const CustomSelect = ({ value, options, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value) || options[0];

    return (
        <div className="custom-select-wrapper" ref={wrapperRef}>
            <div className={`custom-select-trigger ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
                <span>{selectedOption.label}</span>
                <svg className={`sort-select-icon ${isOpen ? 'rotated' : ''}`} viewBox="0 0 16 16" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 8 11 13 6"></polyline></svg>
            </div>
            {isOpen && (
                <div className="custom-select-options">
                    {options.map(opt => (
                        <div 
                            key={opt.value} 
                            className={`custom-select-option ${value === opt.value ? 'selected' : ''}`}
                            onClick={() => {
                                onChange(opt.value);
                                setIsOpen(false);
                            }}
                        >
                            {opt.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const Shop = ({ productsGlobal, wishlist, toggleWishlist, globalSearch, setGlobalSearch }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [sort, setSort] = useState('newest');

    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [selectedFabrics, setSelectedFabrics] = useState([]);
    const [selectedPatterns, setSelectedPatterns] = useState([]);
    const [selectedSleeves, setSelectedSleeves] = useState([]);
    const [selectedOccasions, setSelectedOccasions] = useState([]);
    const [selectedCollections, setSelectedCollections] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [onlyNewArrivals, setOnlyNewArrivals] = useState(false);
    const [onlyBestSellers, setOnlyBestSellers] = useState(false);
    const [priceRange, setPriceRange] = useState('all');

    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
    const location = ReactRouterDOM.useLocation();
    const navigate = ReactRouterDOM.useNavigate();
    const isFirstRender = useRef(true);

    // Map HashRouter query parameters directly to active filter states on load/route updates
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        
        const category = params.get('category');
        setSelectedCategories(category ? category.split(',') : []);
        
        const size = params.get('sizes');
        setSelectedSizes(size ? size.split(',') : []);
        
        const fabric = params.get('fabrics') || params.get('fabric');
        setSelectedFabrics(fabric ? fabric.split(',') : []);
        
        const pattern = params.get('patterns') || params.get('pattern');
        setSelectedPatterns(pattern ? pattern.split(',') : []);
        
        const sleeve = params.get('sleeveTypes') || params.get('sleeve_type');
        setSelectedSleeves(sleeve ? sleeve.split(',') : []);
        
        const occasion = params.get('occasions') || params.get('occasion');
        setSelectedOccasions(occasion ? occasion.split(',') : []);
        
        const collection = params.get('collection');
        setSelectedCollections(collection ? collection.split(',') : []);
        
        const colors = params.get('colors');
        setSelectedColors(colors ? colors.split(',') : []);
        
        setOnlyNewArrivals(params.get('newArrival') === 'true');
        setOnlyBestSellers(params.get('bestSeller') === 'true');
        
        const pRange = params.get('priceRange') || params.get('price_range');
        if (pRange) {
            setPriceRange(pRange);
        } else {
            const minP = params.get('minPrice') || params.get('min_price');
            const maxP = params.get('maxPrice') || params.get('max_price');
            if (maxP === '1999') setPriceRange('under_2k');
            else if (minP === '2000' && maxP === '4999') setPriceRange('2k_5k');
            else if (minP === '5000' && maxP === '9999') setPriceRange('5k_10k');
            else if (minP === '10000') setPriceRange('over_10k');
            else setPriceRange('all');
        }
        
        setCurrentPage(1);
    }, [location.search]);

    // Push local filter state changes to URL to support copy-paste deep links
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const params = new URLSearchParams();
        if (selectedCategories.length > 0) params.set('category', selectedCategories.join(','));
        if (selectedSizes.length > 0) params.set('sizes', selectedSizes.join(','));
        if (selectedFabrics.length > 0) params.set('fabrics', selectedFabrics.join(','));
        if (selectedPatterns.length > 0) params.set('patterns', selectedPatterns.join(','));
        if (selectedSleeves.length > 0) params.set('sleeveTypes', selectedSleeves.join(','));
        if (selectedOccasions.length > 0) params.set('occasions', selectedOccasions.join(','));
        if (selectedCollections.length > 0) params.set('collection', selectedCollections.join(','));
        if (selectedColors.length > 0) params.set('colors', selectedColors.join(','));
        if (onlyNewArrivals) params.set('newArrival', 'true');
        if (onlyBestSellers) params.set('bestSeller', 'true');
        if (priceRange && priceRange !== 'all') params.set('priceRange', priceRange);

        if (globalSearch.trim()) {
            params.set('q', globalSearch.trim());
        }

        const newSearch = params.toString();
        const currentSearch = location.search.replace(/^\?/, '');
        
        if (newSearch !== currentSearch) {
            navigate('/shop?' + newSearch, { replace: true });
        }
    }, [
        selectedCategories,
        selectedSizes,
        selectedFabrics,
        selectedPatterns,
        selectedSleeves,
        selectedOccasions,
        selectedCollections,
        selectedColors,
        onlyNewArrivals,
        onlyBestSellers,
        priceRange,
        globalSearch
    ]);

    useEffect(() => {
        let active = true;
        
        const fetchFilteredProducts = async () => {
            setLoading(true);
            const params = new URLSearchParams();
            params.append('paginated', 'true');
            params.append('page', currentPage.toString());
            params.append('limit', '8');
            
            // Map React sort state to Go backend sortBy keys
            let sortByVal = sort;
            if (sort === 'rating_desc') sortByVal = 'rating';
            params.append('sortBy', sortByVal);

            if (globalSearch.trim()) {
                params.append('q', globalSearch.trim());
            }

            if (selectedCategories.length > 0) {
                params.append('category', selectedCategories.join(','));
            }
            if (selectedSizes.length > 0) {
                params.append('sizes', selectedSizes.join(','));
            }
            if (selectedFabrics.length > 0) {
                params.append('fabrics', selectedFabrics.join(','));
            }
            if (selectedPatterns.length > 0) {
                params.append('patterns', selectedPatterns.join(','));
            }
            if (selectedSleeves.length > 0) {
                params.append('sleeveTypes', selectedSleeves.join(','));
            }
            if (selectedOccasions.length > 0) {
                params.append('occasions', selectedOccasions.join(','));
            }
            if (selectedCollections.length > 0) {
                params.append('collection', selectedCollections.join(','));
            }
            if (selectedColors.length > 0) {
                params.append('colors', selectedColors.join(','));
            }
            
            if (onlyNewArrivals) params.append('newArrival', 'true');
            if (onlyBestSellers) params.append('bestSeller', 'true');

            if (priceRange === 'under_2k') {
                params.append('maxPrice', '1999');
            } else if (priceRange === '2k_5k') {
                params.append('minPrice', '2000');
                params.append('maxPrice', '4999');
            } else if (priceRange === '5k_10k') {
                params.append('minPrice', '5000');
                params.append('maxPrice', '9999');
            } else if (priceRange === 'over_10k') {
                params.append('minPrice', '10000');
            }

            try {
                const res = await fetch(`/api/products?${params.toString()}`);
                if (!res.ok) throw new Error("HTTP " + res.status);
                const data = await res.json();
                
                if (active) {
                    if (data && Array.isArray(data.products)) {
                        setProducts(data.products);
                        setTotalProducts(data.total);
                        setTotalPages(data.pages);
                    } else if (Array.isArray(data)) {
                        setProducts(data);
                        setTotalProducts(data.length);
                        setTotalPages(1);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch filtered products, falling back to local filtration:", err);
                if (active && Array.isArray(productsGlobal)) {
                    let list = [...productsGlobal];

                    if (globalSearch.trim()) {
                        const s = globalSearch.toLowerCase();
                        list = list.filter(p => 
                            p.name.toLowerCase().includes(s) || 
                            p.description.toLowerCase().includes(s) ||
                            (p.category && p.category.toLowerCase().includes(s)) ||
                            (p.tags && p.tags.toLowerCase().includes(s))
                        );
                    }

                    if (selectedCategories.length > 0) {
                        list = list.filter(p => selectedCategories.includes(p.category));
                    }
                    if (selectedSizes.length > 0) {
                        list = list.filter(p => p.sizes && p.sizes.some(sz => selectedSizes.includes(sz)));
                    }
                    if (selectedFabrics.length > 0) {
                        list = list.filter(p => p.fabric && selectedFabrics.includes(p.fabric));
                    }
                    if (selectedPatterns.length > 0) {
                        list = list.filter(p => p.pattern && selectedPatterns.includes(p.pattern));
                    }
                    if (selectedSleeves.length > 0) {
                        list = list.filter(p => p.sleeveType && selectedSleeves.includes(p.sleeveType));
                    }
                    if (selectedOccasions.length > 0) {
                        list = list.filter(p => p.occasion && selectedOccasions.includes(p.occasion));
                    }
                    if (selectedCollections.length > 0) {
                        list = list.filter(p => p.collection && selectedCollections.includes(p.collection));
                    }
                    if (selectedColors.length > 0) {
                        list = list.filter(p => p.color && selectedColors.includes(p.color));
                    }
                    if (onlyNewArrivals) {
                        list = list.filter(p => p.isNewArrival);
                    }
                    if (onlyBestSellers) {
                        list = list.filter(p => p.isBestSeller);
                    }

                    if (priceRange === 'under_2k') {
                        list = list.filter(p => p.price <= 1999);
                    } else if (priceRange === '2k_5k') {
                        list = list.filter(p => p.price >= 2000 && p.price <= 4999);
                    } else if (priceRange === '5k_10k') {
                        list = list.filter(p => p.price >= 5000 && p.price <= 9999);
                    } else if (priceRange === 'over_10k') {
                        list = list.filter(p => p.price >= 10000);
                    }

                    if (sort === 'price_asc') {
                        list.sort((a,b) => a.price - b.price);
                    } else if (sort === 'price_desc') {
                        list.sort((a,b) => b.price - a.price);
                    } else if (sort === 'rating_desc') {
                        list.sort((a,b) => (b.avgRating || 0) - (a.avgRating || 0));
                    } else {
                        list.sort((a,b) => b.id.localeCompare(a.id));
                    }

                    const limit = 8;
                    const total = list.length;
                    const pages = Math.ceil(total / limit) || 1;
                    const offset = (currentPage - 1) * limit;
                    
                    setProducts(list.slice(offset, offset + limit));
                    setTotalProducts(total);
                    setTotalPages(pages);
                }
            } finally {
                if (active) setLoading(false);
            }
        };

        fetchFilteredProducts();
        return () => { active = false; };
    }, [currentPage, sort, selectedCategories, selectedSizes, selectedFabrics, selectedPatterns, selectedSleeves, selectedOccasions, selectedCollections, selectedColors, onlyNewArrivals, onlyBestSellers, priceRange, globalSearch, productsGlobal]);

    useEffect(() => {
        setCurrentPage(1);
    }, [sort, selectedCategories, selectedSizes, selectedFabrics, selectedPatterns, selectedSleeves, selectedOccasions, selectedCollections, selectedColors, onlyNewArrivals, onlyBestSellers, priceRange, globalSearch]);

    const activeChips = [];
    selectedCategories.forEach(c => activeChips.push({ label: `Category: ${c}`, type: 'category', value: c }));
    selectedSizes.forEach(s => activeChips.push({ label: `Size: ${s}`, type: 'size', value: s }));
    selectedFabrics.forEach(f => activeChips.push({ label: `Fabric: ${f}`, type: 'fabric', value: f }));
    selectedPatterns.forEach(p => activeChips.push({ label: `Pattern: ${p}`, type: 'pattern', value: p }));
    selectedSleeves.forEach(sl => activeChips.push({ label: `Sleeve: ${sl}`, type: 'sleeve', value: sl }));
    selectedOccasions.forEach(o => activeChips.push({ label: `Occasion: ${o}`, type: 'occasion', value: o }));
    selectedCollections.forEach(col => activeChips.push({ label: `Collection: ${col}`, type: 'collection', value: col }));
    selectedColors.forEach(color => activeChips.push({ label: `Color: ${color}`, type: 'colors', value: color }));
    if (onlyNewArrivals) activeChips.push({ label: 'New Arrivals Only', type: 'newArrival', value: true });
    if (onlyBestSellers) activeChips.push({ label: 'Best Sellers Only', type: 'bestSeller', value: true });

    if (priceRange !== 'all') {
        let label = 'Price: All';
        if (priceRange === 'under_2k') label = 'Price: Under ₹2,000';
        else if (priceRange === '2k_5k') label = 'Price: ₹2,000 - ₹4,999';
        else if (priceRange === '5k_10k') label = 'Price: ₹5,000 - ₹9,999';
        else if (priceRange === 'over_10k') label = 'Price: ₹10,000+';
        activeChips.push({ label, type: 'priceRange', value: priceRange });
    }
    if (globalSearch.trim()) {
        activeChips.push({ label: `Search: "${globalSearch}"`, type: 'search', value: globalSearch });
    }

    const removeChip = (chip) => {
        if (chip.type === 'category') setSelectedCategories(prev => prev.filter(v => v !== chip.value));
        else if (chip.type === 'size') setSelectedSizes(prev => prev.filter(v => v !== chip.value));
        else if (chip.type === 'fabric') setSelectedFabrics(prev => prev.filter(v => v !== chip.value));
        else if (chip.type === 'pattern') setSelectedPatterns(prev => prev.filter(v => v !== chip.value));
        else if (chip.type === 'sleeve') setSelectedSleeves(prev => prev.filter(v => v !== chip.value));
        else if (chip.type === 'occasion') setSelectedOccasions(prev => prev.filter(v => v !== chip.value));
        else if (chip.type === 'collection') setSelectedCollections(prev => prev.filter(v => v !== chip.value));
        else if (chip.type === 'colors') setSelectedColors(prev => prev.filter(v => v !== chip.value));
        else if (chip.type === 'newArrival') setOnlyNewArrivals(false);
        else if (chip.type === 'bestSeller') setOnlyBestSellers(false);
        else if (chip.type === 'priceRange') setPriceRange('all');
        else if (chip.type === 'search') setGlobalSearch('');
    };

    const clearAllFilters = () => {
        setSelectedCategories([]);
        setSelectedSizes([]);
        setSelectedFabrics([]);
        setSelectedPatterns([]);
        setSelectedSleeves([]);
        setSelectedOccasions([]);
        setSelectedCollections([]);
        setSelectedColors([]);
        setOnlyNewArrivals(false);
        setOnlyBestSellers(false);
        setPriceRange('all');
        setGlobalSearch('');
    };

    const handlePageChange = (p) => {
        setCurrentPage(p);
        const el = document.getElementById('shop-top-anchor');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div>
            <span id="shop-top-anchor" style={{ display: 'block', height: '1px' }}></span>

            <div className="catalog-page-container">
                {/* Desktop Sidebar */}
                <aside className="catalog-sidebar">
                    <div style={{ position: 'sticky', top: '100px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #f0efee', paddingBottom: '0.5rem' }}>
                            <h3 style={{ textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: '700', letterSpacing: '1px' }}>Filters</h3>
                            {activeChips.length > 0 && (
                                <button onClick={clearAllFilters} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}>Clear All</button>
                            )}
                        </div>
                        <FilterSidebarContent 
                            selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories}
                            selectedSizes={selectedSizes} setSelectedSizes={setSelectedSizes}
                            selectedFabrics={selectedFabrics} setSelectedFabrics={setSelectedFabrics}
                            selectedPatterns={selectedPatterns} setSelectedPatterns={setSelectedPatterns}
                            selectedSleeves={selectedSleeves} setSelectedSleeves={setSelectedSleeves}
                            selectedOccasions={selectedOccasions} setSelectedOccasions={setSelectedOccasions}
                            selectedCollections={selectedCollections} setSelectedCollections={setSelectedCollections}
                            selectedColors={selectedColors} setSelectedColors={setSelectedColors}
                            onlyNewArrivals={onlyNewArrivals} setOnlyNewArrivals={setOnlyNewArrivals}
                            onlyBestSellers={onlyBestSellers} setOnlyBestSellers={setOnlyBestSellers}
                            priceRange={priceRange} setPriceRange={setPriceRange}
                        />
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="catalog-main-content">
                    <div className="catalog-toolbar">
                        <div className="toolbar-info">
                            Showing <strong>{products.length}</strong> of <strong>{totalProducts}</strong> products
                        </div>
                        <div className="toolbar-actions">
                            <button 
                                className="mobile-filter-trigger" 
                                onClick={() => setMobileFilterOpen(true)}
                            >
                                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
                                <span>Filters</span>
                            </button>

                            <CustomSelect 
                                value={sort}
                                options={[
                                    { value: 'newest', label: 'New Arrivals' },
                                    { value: 'price_asc', label: 'Price: Low to High' },
                                    { value: 'price_desc', label: 'Price: High to Low' },
                                    { value: 'rating_desc', label: 'Top Rated' }
                                ]}
                                onChange={setSort}
                            />
                        </div>
                    </div>

                    {/* Active Chips Bar */}
                    {activeChips.length > 0 && (
                        <div className="active-chips-container">
                            {activeChips.map((chip, idx) => (
                                <span className="active-chip" key={idx}>
                                    {chip.label}
                                    <button className="active-chip-remove" onClick={() => removeChip(chip)}>&times;</button>
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Product Grid */}
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '30vh' }}>
                            <p style={{ color: '#8c8883', fontSize: '1rem', fontStyle: 'italic' }}>Curating products...</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '5rem 0', background: '#fff', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.02)' }}>
                            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: '400', marginBottom: '0.5rem' }}>No products found</h3>
                            <p style={{ color: '#8c8883', fontSize: '0.95rem' }}>Try clearing some filters or searching for something else.</p>
                        </div>
                    ) : (
                        <div>
                            <div className="product-grid">
                                {products.map(product => (
                                    <RenderProductCard 
                                        key={product.id} 
                                        product={product} 
                                        wishlist={wishlist} 
                                        toggleWishlist={toggleWishlist} 
                                    />
                                ))}
                            </div>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="catalog-pagination">
                                    <button 
                                        className="pagination-btn"
                                        disabled={currentPage === 1}
                                        onClick={() => handlePageChange(currentPage - 1)}
                                    >
                                        &larr;
                                    </button>
                                    
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                        <button
                                            key={p}
                                            className={`pagination-btn ${p === currentPage ? 'active' : ''}`}
                                            onClick={() => handlePageChange(p)}
                                        >
                                            {p}
                                        </button>
                                    ))}

                                    <button 
                                        className="pagination-btn"
                                        disabled={currentPage === totalPages}
                                        onClick={() => handlePageChange(currentPage + 1)}
                                    >
                                        &rarr;
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>

            {/* Mobile Filter Drawer (Portaled to document.body) */}
            {mobileFilterOpen && ReactDOM.createPortal(
                <div className={`mobile-filter-drawer ${mobileFilterOpen ? 'show' : ''}`}>
                    <div className="mobile-filter-drawer-overlay" onClick={() => setMobileFilterOpen(false)} />
                    <div className="mobile-filter-drawer-content">
                        <div className="mobile-filter-drawer-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
                                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: '500', color: 'var(--color-text, #2D2A26)', letterSpacing: '0.5px' }}>Filters</span>
                                {activeChips.length > 0 && (
                                    <span style={{ backgroundColor: 'var(--color-peach)', color: 'var(--color-primary)', fontSize: '0.72rem', fontWeight: '700', borderRadius: '12px', padding: '2px 8px', marginLeft: '4px' }}>
                                        {activeChips.length} active
                                    </span>
                                )}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                {activeChips.length > 0 && (
                                    <button 
                                        onClick={clearAllFilters} 
                                        style={{ background: 'none', border: 'none', color: '#888', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                                    >
                                        Reset
                                    </button>
                                )}
                                <button 
                                    className="mobile-drawer-close"
                                    onClick={() => setMobileFilterOpen(false)}
                                    aria-label="Close filters"
                                >
                                    &times;
                                </button>
                            </div>
                        </div>
                        
                        <div className="mobile-filter-drawer-body">
                            <FilterSidebarContent 
                                selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories}
                                selectedSizes={selectedSizes} setSelectedSizes={setSelectedSizes}
                                selectedFabrics={selectedFabrics} setSelectedFabrics={setSelectedFabrics}
                                selectedPatterns={selectedPatterns} setSelectedPatterns={setSelectedPatterns}
                                selectedSleeves={selectedSleeves} setSelectedSleeves={setSelectedSleeves}
                                selectedOccasions={selectedOccasions} setSelectedOccasions={setSelectedOccasions}
                                selectedCollections={selectedCollections} setSelectedCollections={setSelectedCollections}
                                selectedColors={selectedColors} setSelectedColors={setSelectedColors}
                                onlyNewArrivals={onlyNewArrivals} setOnlyNewArrivals={setOnlyNewArrivals}
                                onlyBestSellers={onlyBestSellers} setOnlyBestSellers={setOnlyBestSellers}
                                priceRange={priceRange} setPriceRange={setPriceRange}
                            />
                        </div>

                        <div className="mobile-filter-drawer-footer">
                            {activeChips.length > 0 && (
                                <button 
                                    className="btn btn-outline" 
                                    onClick={clearAllFilters}
                                    style={{ padding: '0.85rem 1rem', borderRadius: '10px', fontSize: '0.88rem', fontWeight: '600' }}
                                >
                                    Reset
                                </button>
                            )}
                            <button 
                                className="btn btn-primary" 
                                onClick={() => setMobileFilterOpen(false)}
                                style={{ flex: 1, padding: '0.85rem 1rem', borderRadius: '10px', fontSize: '0.92rem', fontWeight: '600', letterSpacing: '0.5px' }}
                            >
                                Apply Filters ({totalProducts})
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};


const Home = ({ productsGlobal, wishlist, toggleWishlist }) => {
    const bestSellers = React.useMemo(() => {
        return (productsGlobal || []).filter(p => p.isBestSeller).slice(0, 4);
    }, [productsGlobal]);

    const newArrivals = React.useMemo(() => {
        return (productsGlobal || []).filter(p => p.isNewArrival).slice(0, 4);
    }, [productsGlobal]);

    return (
        <div>
            {/* Editorial Hero Banner */}
            <header className="hero">
                <div className="hero-content">
                    <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '3px', color: 'var(--color-primary)', fontWeight: '600', display: 'block', marginBottom: '1rem' }}>Handcrafted Luxury</span>
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '400', lineHeight: '1.1', marginBottom: '1.5rem' }}>Minimalist Indo-Western Silhouette</h1>
                    <p style={{ fontSize: '1.1rem', color: 'var(--color-text-light)', marginBottom: '2.5rem', lineHeight: '1.6' }}>A curated destination for timeless pastel aesthetics, tailored meticulously with pure breathable fabrics for the contemporary woman.</p>
                    <Link to="/shop" className="btn btn-primary" style={{ padding: '0.9rem 2.5rem', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.8rem' }}>Browse Shop</Link>
                </div>
                <div className="hero-image">
                    <img src="./images/hero_banner.png" alt="Premium Indo-Western Pastel Kurthi Fashion Model" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
            </header>

            {/* Shop by Category */}
            <section className="home-section" style={{ backgroundColor: '#FAF8F5', paddingTop: '4rem', paddingBottom: '4rem' }}>
                <div className="home-section-header">
                    <h2>Shop by Category</h2>
                    <p>Discover boutique silhouettes, tailored for every occasion and style preference</p>
                </div>
                <div className="home-category-grid">
                    {[
                        { name: 'Straight Cut', label: 'Straight Cut', desc: 'Crisp & Modern', image: './images/kurthi_peach.png', color: 'var(--color-peach)' },
                        { name: 'Anarkali', label: 'Anarkali Set', desc: 'Flowing Grace', image: './images/kurthi_mint.png', color: 'var(--color-mint)' },
                        { name: 'Tunic', label: 'Tunic Dress', desc: 'Casual Comfort', image: './images/kurthi_lavender.png', color: 'var(--color-lavender)' },
                        { name: 'Fusion', label: 'Fusion Wear', desc: 'Indo-Western Styles', image: './images/kurthi_blue.png', color: 'var(--color-blue)' }
                    ].map(cat => (
                        <Link to={`/shop?category=${cat.name}`} key={cat.name} className="home-category-card">
                            <div className="home-category-img-container" style={{ backgroundColor: cat.color }}>
                                <img src={cat.image} alt={cat.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div className="home-category-overlay">
                                <span>{cat.desc}</span>
                                <h3>{cat.label}</h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Best Sellers Section */}
            <section className="home-section">
                <div className="home-section-header">
                    <h2>Most Coveted Styles</h2>
                    <p>Highly sought-after silhouettes curated by our boutique designers for timeless appeal</p>
                </div>
                {bestSellers.length === 0 ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '20vh' }}>
                        <p style={{ color: '#8c8883', fontStyle: 'italic' }}>Curating our best sellers...</p>
                    </div>
                ) : (
                    <div>
                        <div className="product-grid">
                            {bestSellers.map(product => (
                                <RenderProductCard 
                                    key={product.id} 
                                    product={product} 
                                    wishlist={wishlist} 
                                    toggleWishlist={toggleWishlist} 
                                />
                            ))}
                        </div>
                        <div className="home-action-btn-container">
                            <Link to="/shop?bestSeller=true" className="btn-premium-outline">
                                View All Best Sellers
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                            </Link>
                        </div>
                    </div>
                )}
            </section>

            {/* Brand Story Showcase */}
            <section className="brand-story-section">
                <div className="brand-story-container">
                    <div className="brand-story-image">
                        <img src="./images/login_art.png" alt="Detail of fine tailoring and pastel embroidery" />
                    </div>
                    <div className="brand-story-text">
                        <span className="brand-story-tag">The Boutique Philosophy</span>
                        <h2>Honoring Slow Fashion & Indian Aesthetics</h2>
                        <p>At The Ethnic Touch, we discard mass production rules. Every garment is treated as a piece of art, starting from premium handpicked cotton and linens to natural mineral dyes and elegant embroidery details.</p>
                        
                        <div className="brand-values-grid">
                            <div className="value-card">
                                <div className="value-icon">
                                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="1.75" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M7 6h10M5 12h14M7 18h10"/></svg>
                                </div>
                                <h3>Loomed with Love</h3>
                                <p>Sourced from traditional Indian weaver clusters, celebrating pure, raw weaves that get softer with every wear.</p>
                            </div>

                            <div className="value-card">
                                <div className="value-icon">
                                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="1.75" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22v-6M12 16a4 4 0 0 0-4-4c-1.5 0-3 1-3 3s1.5 3 3 3h8c1.5 0 3-1 3-3s-1.5-3-3-3a4 4 0 0 0-4 4z"/></svg>
                                </div>
                                <h3>Bespoke Colorways</h3>
                                <p>Our signatures pale peach, mint green, and lavender palettes are carefully dyed in small, curated lots.</p>
                            </div>

                            <div className="value-card">
                                <div className="value-icon">
                                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="1.75" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>
                                </div>
                                <h3>Tailored For You</h3>
                                <p>Designed with meticulous cuts, including standard custom margins, ensuring a premium contour drape.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* New Arrivals Section */}
            <section className="home-section" style={{ borderTop: '1px solid rgba(0,0,0,0.03)', paddingBottom: '8rem' }}>
                <div className="home-section-header">
                    <h2>Fresh Off the Loom</h2>
                    <p>Be the first to step out in our latest custom creations and season-defining tones</p>
                </div>
                {newArrivals.length === 0 ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '20vh' }}>
                        <p style={{ color: '#8c8883', fontStyle: 'italic' }}>Weaving new collections...</p>
                    </div>
                ) : (
                    <div>
                        <div className="product-grid">
                            {newArrivals.map(product => (
                                <RenderProductCard 
                                    key={product.id} 
                                    product={product} 
                                    wishlist={wishlist} 
                                    toggleWishlist={toggleWishlist} 
                                />
                            ))}
                        </div>
                        <div className="home-action-btn-container">
                            <Link to="/shop?newArrival=true" className="btn-premium-outline">
                                Explore New Arrivals
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                            </Link>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};

const WishlistPage = ({ wishlist, toggleWishlist, addToCart }) => {

    return (
        <div className="wishlist-page-container">
            <div className="wishlist-header-row">
                <div>
                    <span className="profile-eyebrow">Wardrobe Selection</span>
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: '400', margin: '0.2rem 0 0' }}>Your Wishlist</h1>
                </div>
                <div style={{ fontSize: '0.95rem', color: '#686461' }}>
                    {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
                </div>
            </div>

            {wishlist.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '6rem 1rem', background: '#FFFdfc', borderRadius: '12px', border: '1px dashed var(--color-peach)' }}>
                    <svg viewBox="0 0 24 24" width="48" height="48" stroke="var(--color-primary)" strokeWidth="1.5" fill="none" style={{ marginBottom: '1.2rem' }}>
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: '400', marginBottom: '0.5rem' }}>Your wishlist is empty</h2>
                    <p style={{ margin: '0 auto 1.5rem', fontSize: '0.95rem', color: '#686461' }}>Explore our premium collections and tap the heart icon to save products here.</p>
                    <Link to="/" className="btn btn-primary" style={{ textDecoration: 'none' }}>Shop the Collection</Link>
                </div>
            ) : (
                <div className="product-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
                    {wishlist.map(p => {
                        const handleQuickAddToCart = (e) => {
                            e.preventDefault();
                            const defaultSz = (p.sizes && p.sizes.length > 0) ? p.sizes[0] : 'S';
                            addToCart({ ...p, size: defaultSz });
                        };

                        return (
                            <div key={p.id} style={{ position: 'relative' }}>
                                <div className="product-card">
                                    <Link to={`/product/${p.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                                        <div className="product-image-container" style={{ position: 'relative' }}>
                                            <div className="wishlist-heart-btn active" onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                toggleWishlist(p);
                                            }} style={{ top: '15px', right: '15px' }}>
                                                <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                                            </div>
                                            <img src={p.imageUrl} alt={p.name} className="product-image" />
                                        </div>
                                        <div className="product-info" style={{ marginBottom: '1rem' }}>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <h3 className="product-name" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</h3>
                                                <div className="product-price">₹{p.price.toLocaleString('en-IN')}</div>
                                            </div>
                                        </div>
                                    </Link>
                                    <button 
                                        onClick={handleQuickAddToCart}
                                        className="btn btn-primary"
                                        style={{ width: '100%', borderRadius: '8px', padding: '0.6rem', fontSize: '0.85rem' }}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const ProductDetails = ({ products, addToCart, wishlist = [], toggleWishlist, authUser }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const product = products.find(p => p.id === id);

    const [activeImage, setActiveImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [reviews, setReviews] = useState([]);
    
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [reviewFormError, setReviewFormError] = useState('');
    const [reviewLoading, setReviewLoading] = useState(false);

    // Collapsible Accordion Tabs state
    const [openTabs, setOpenTabs] = useState({ specs: true, shipping: false, sizeGuide: false });
    
    const toggleTab = (tabKey) => {
        setOpenTabs(prev => ({ ...prev, [tabKey]: !prev[tabKey] }));
    };

    useEffect(() => {
        if (product && product.sizes && product.sizes.length > 0) {
            // Select first size that has stock > 0
            const firstAvailable = product.sizes.find(sz => {
                const stk = (product.sizesStock && product.sizesStock[sz] !== undefined) ? product.sizesStock[sz] : -1;
                return stk !== 0;
            });
            setSelectedSize(firstAvailable || '');
            setActiveImage(0); // reset image index on product change
            setQuantity(1); // reset quantity on product change
        }
    }, [product]);

    useEffect(() => {
        if (product) {
            fetch(`/api/products/${product.id}/reviews`)
                .then(res => res.json())
                .then(data => {
                    if(Array.isArray(data)) setReviews(data);
                })
                .catch(err => console.error("Error fetching reviews:", err));
        }
    }, [product]);

    if (!product) return <div style={{padding: '10rem 5%', textAlign:'center'}}><h2>Product Not Found</h2></div>;

    const isWished = wishlist ? wishlist.some(item => item.id === product.id) : false;

    const galleryImages = (product.galleryImages && product.galleryImages.length > 0) 
        ? product.galleryImages 
        : [product.imageUrl];

    const nextImage = () => {
        setActiveImage(prev => (prev + 1) % galleryImages.length);
    };

    const prevImage = () => {
        setActiveImage(prev => (prev - 1 + galleryImages.length) % galleryImages.length);
    };

    const handleBack = (e) => {
        e.preventDefault();
        navigate('/');
    };

    const handleAddToCart = () => {
        addToCart({ ...product, size: selectedSize, quantity: quantity });
    };

    const submitReview = async (e) => {
        e.preventDefault();
        setReviewFormError('');
        if (!comment.trim()) {
            setReviewFormError('Please write a comment.');
            return;
        }

        setReviewLoading(true);
        const name = authUser?.displayName || authUser?.email?.split('@')[0] || "Guest Reviewer";
        const email = authUser?.email || "guest@ethnictouch.com";

        try {
            const res = await fetch(`/api/products/${product.id}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userName: name, userEmail: email, rating: parseInt(rating), comment })
            });

            if (!res.ok) throw new Error("Failed to post review");

            const newReview = await res.json();
            setReviews([newReview, ...reviews]);
            setComment('');
            setRating(5);
        } catch (err) {
            setReviewFormError('Could not post your review. Please try again.');
        } finally {
            setReviewLoading(false);
        }
    };

    const avgRating = reviews.length > 0 
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
        : 0;

    // Find up to 3 recommended products (excluding current one)
    const recommendedList = products
        .filter(p => p.id !== product.id)
        .slice(0, 3);

    return (
        <div className="product-details-page-container" style={{maxWidth: '1200px', margin: '0 auto', minHeight: '80vh'}}>
            <a href="#" onClick={handleBack} style={{display:'inline-block', marginBottom:'1.5rem', color:'var(--color-text-light)', textDecoration:'none', transition:'color 0.2s'}}>&larr; Back to Collection</a>
            
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'flex-start'}}>
                
                {/* Image Slider Gallery */}
                <div style={{flex: 1, minWidth: '300px'}}>
                    <div className="gallery-main-container" style={{
                        borderRadius: 'var(--border-radius-lg)', 
                        overflow: 'hidden', 
                        boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                        marginBottom: '1rem',
                        aspectRatio: '3/4',
                        backgroundColor: '#fafafa',
                        position: 'relative'
                    }}>
                        <img className="gallery-main-img" src={galleryImages[activeImage]} alt={product.name} style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} />
                        
                        {galleryImages.length > 1 && (
                            <React.Fragment>
                                <button className="slider-nav-btn prev" onClick={prevImage} aria-label="Previous image">&lsaquo;</button>
                                <button className="slider-nav-btn next" onClick={nextImage} aria-label="Next image">&rsaquo;</button>
                                
                                <div className="slider-dots">
                                    {galleryImages.map((_, idx) => (
                                        <div 
                                            key={idx} 
                                            className={`slider-dot ${activeImage === idx ? 'active' : ''}`}
                                            onClick={() => setActiveImage(idx)}
                                        />
                                    ))}
                                </div>
                            </React.Fragment>
                        )}
                    </div>

                    {/* Gallery Thumbnails List */}
                    {galleryImages.length > 1 && (
                        <div style={{display: 'flex', gap: '0.8rem', overflowX: 'auto', padding: '0.5rem 0'}}>
                            {galleryImages.map((imgUrl, idx) => (
                                <div 
                                    key={idx} 
                                    onClick={() => setActiveImage(idx)}
                                    className={`gallery-thumbnail ${activeImage === idx ? 'active' : ''}`}
                                    style={{
                                        width: '70px', 
                                        height: '90px', 
                                        borderRadius: '6px', 
                                        overflow: 'hidden', 
                                        cursor: 'pointer',
                                        border: '2px solid transparent',
                                        flexShrink: 0
                                    }}
                                >
                                    <img src={imgUrl} alt={`Thumbnail ${idx+1}`} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Summary & Actions Sidebar */}
                <div style={{flex: 1, minWidth: '300px', position: 'sticky', top: '120px'}}>
                    <h1 style={{fontSize: '2.8rem', marginBottom: '0.5rem', fontFamily: 'var(--font-title)'}}>{product.name}</h1>
                    
                    {reviews.length > 0 ? (
                        <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem'}}>
                            <div style={{color: '#d4af37', fontSize: '1.2rem', letterSpacing: '2px'}}>
                                {'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))}
                            </div>
                            <span style={{color: 'var(--color-text-light)', fontSize: '0.9rem'}}>{avgRating} ({reviews.length} reviews)</span>
                        </div>
                    ) : (
                        <div style={{color: '#bbb', fontSize: '0.9rem', marginBottom: '1.5rem'}}>No reviews yet</div>
                    )}

                    <div style={{fontSize: '2.2rem', fontWeight: '500', marginBottom: '1.5rem', color: 'var(--color-primary)'}}>
                        ₹{product.price.toLocaleString('en-IN')}
                    </div>
                    
                    <p style={{fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.8', color: '#555'}}>{product.description}</p>
                    
                    {/* Size Selector */}
                    {product.sizes && product.sizes.length > 0 && (
                        <div style={{marginBottom: '2.5rem'}}>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                                <h4 style={{margin: 0, fontSize: '0.95rem', fontWeight: '600', color: '#333'}}>Select Size</h4>
                                {selectedSize && (
                                    <span style={{fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: '500'}}>
                                        {(() => {
                                            const qty = (product.sizesStock && product.sizesStock[selectedSize] !== undefined) ? product.sizesStock[selectedSize] : -1;
                                            if (qty === 0) return 'Out of Stock';
                                            if (qty > 0 && qty <= 5) return `Only ${qty} left!`;
                                            if (qty > 5) return 'In Stock';
                                            return '';
                                        })()}
                                    </span>
                                )}
                            </div>
                            <div style={{display: 'flex', gap: '0.8rem', flexWrap: 'wrap'}}>
                                {product.sizes.map((size) => {
                                    const stockQty = (product.sizesStock && product.sizesStock[size] !== undefined) ? product.sizesStock[size] : -1;
                                    const isDisabled = stockQty === 0;
                                    return (
                                        <button 
                                            key={size}
                                            disabled={isDisabled}
                                            onClick={() => setSelectedSize(size)}
                                            className={`size-pill ${selectedSize === size ? 'active' : ''}`}
                                            title={isDisabled ? 'Out of stock' : ''}
                                            style={{
                                                padding: '0.8rem 1.5rem',
                                                borderRadius: '6px',
                                                border: '1px solid #ddd',
                                                backgroundColor: '#fff',
                                                color: '#555',
                                                fontWeight: '600',
                                                cursor: isDisabled ? 'not-allowed' : 'pointer',
                                                fontSize: '1rem'
                                            }}
                                        >
                                            {size}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Quantity Selector */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h4 style={{ margin: '0 0 0.8rem', fontSize: '0.95rem', fontWeight: '600', color: '#333' }}>Quantity</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #ddd', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#fafafa' }}>
                                <button 
                                    type="button"
                                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                    disabled={quantity <= 1}
                                    aria-label="Decrease quantity"
                                    style={{ width: '42px', height: '48px', border: 'none', background: 'none', cursor: quantity <= 1 ? 'not-allowed' : 'pointer', fontSize: '1.2rem', fontWeight: 'bold', color: quantity <= 1 ? '#ccc' : '#333', transition: 'all 0.2s' }}
                                >
                                    -
                                </button>
                                <span style={{ width: '45px', textAlign: 'center', fontWeight: '600', fontSize: '1.1rem', userSelect: 'none' }}>
                                    {quantity}
                                </span>
                                <button 
                                    type="button"
                                    onClick={() => setQuantity(prev => prev + 1)}
                                    aria-label="Increase quantity"
                                    style={{ width: '42px', height: '48px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold', color: '#333', transition: 'all 0.2s' }}
                                >
                                    +
                                </button>
                            </div>

                            {quantity > 1 && (
                                <div style={{ fontSize: '0.95rem', color: '#666', fontWeight: '500' }}>
                                    Subtotal: <strong style={{ color: 'var(--color-primary)' }}>₹{(product.price * quantity).toLocaleString('en-IN')}</strong>
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                        <button 
                            className="btn btn-primary" 
                            onClick={handleAddToCart}
                            disabled={!selectedSize}
                            style={{ fontSize: '1.05rem', padding: '0 1.5rem', flex: 1, minWidth: '200px', height: '55px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            {selectedSize ? `Add to Cart ${quantity > 1 ? `(${quantity})` : ''} - Size ${selectedSize}` : 'Out of Stock'}
                        </button>

                        <button 
                            type="button"
                            onClick={() => toggleWishlist && toggleWishlist(product)}
                            title={isWished ? "Remove from wishlist" : "Add to wishlist"}
                            aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
                            style={{
                                height: '55px',
                                padding: '0 1.5rem',
                                borderRadius: 'var(--border-radius-pill, 50px)',
                                border: isWished ? '2px solid #e53935' : '1.5px solid #ddd',
                                backgroundColor: isWished ? '#fff5f5' : '#fff',
                                color: isWished ? '#e53935' : '#444',
                                fontWeight: '600',
                                fontSize: '0.95rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                transition: 'all 0.2s ease',
                                flexShrink: 0
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill={isWished ? "#e53935" : "none"} stroke={isWished ? "#e53935" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                            <span>{isWished ? 'Wishlisted' : 'Wishlist'}</span>
                        </button>
                    </div>

                    {/* Premium Specifications Accordion Section */}
                    <div className="spec-accordion">
                        <div className="acc-item">
                            <button className="acc-header" onClick={() => toggleTab('specs')}>
                                <span>Fabric & Composition</span>
                                <span className={`acc-icon ${openTabs.specs ? 'open' : ''}`}>▼</span>
                            </button>
                            <div className="acc-content" style={{ maxHeight: openTabs.specs ? '200px' : '0' }}>
                                <div className="acc-content-inner">
                                    Crafted with high-grade premium georgette and fine silk weaves. Features dual hand-embroidered silver Resham work on cuffs and collar templates. Dry clean is recommended to preserve premium sheen and fiber lock.
                                </div>
                            </div>
                        </div>

                        <div className="acc-item">
                            <button className="acc-header" onClick={() => toggleTab('shipping')}>
                                <span>Shipping & Return policy</span>
                                <span className={`acc-icon ${openTabs.shipping ? 'open' : ''}`}>▼</span>
                            </button>
                            <div className="acc-content" style={{ maxHeight: openTabs.shipping ? '200px' : '0' }}>
                                <div className="acc-content-inner">
                                    Dispatched within 24 to 48 hours for swift local delivery. Delivery timelines scale from 3 to 7 working days. Free standard domestic returns are honored within 7 days from placement if tags are kept intact.
                                </div>
                            </div>
                        </div>

                        <div className="acc-item">
                            <button className="acc-header" onClick={() => toggleTab('sizeGuide')}>
                                <span>Sizing & Fit guide</span>
                                <span className={`acc-icon ${openTabs.sizeGuide ? 'open' : ''}`}>▼</span>
                            </button>
                            <div className="acc-content" style={{ maxHeight: openTabs.sizeGuide ? '200px' : '0' }}>
                                <div className="acc-content-inner">
                                    Runs standard size. We suggest choosing chest sizes mapping to your current fitted garments. Regular relaxed straight cut silhouette. Size configurations available: XS, S, M, L, XL, XXL, XXXL.
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Recommended Products Carousel Section */}
            {recommendedList.length > 0 && (
                <div className="recommended-section">
                    <h2 style={{fontFamily: 'var(--font-title)', fontSize: '2.2rem', marginBottom: '0.5rem', textAlign: 'center'}}>You May Also Like</h2>
                    <p style={{color: 'var(--color-text-light)', textAlign: 'center', marginBottom: '2.5rem', fontSize: '1rem'}}>Complete your look with our top pastel pairings.</p>
                    <div className="recommendations-grid">
                        {recommendedList.map(item => (
                            <Link to={`/product/${item.id}`} key={item.id} className="recommended-card" onClick={() => window.scrollTo(0, 0)}>
                                <div className="recommended-image-wrapper">
                                    <img className="recommended-img" src={item.imageUrl} alt={item.name} />
                                    <span className="recommended-badge">{item.category}</span>
                                </div>
                                <div style={{padding: '1.2rem'}}>
                                    <h3 style={{fontSize: '1.15rem', fontWeight: '500', marginBottom: '0.4rem', fontFamily: 'var(--font-body)'}}>{item.name}</h3>
                                    <span style={{fontSize: '1.15rem', color: 'var(--color-primary)', fontWeight: '600'}}>₹{item.price.toLocaleString('en-IN')}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Customer Reviews Section */}
            <div style={{marginTop: '5rem', borderTop: '1px solid #eee', paddingTop: '4rem'}}>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'flex-start'}}>
                    
                    <div style={{flex: 1, minWidth: '300px'}}>
                        <h2 style={{fontFamily: 'var(--font-title)', fontSize: '2rem', marginBottom: '1.5rem'}}>Customer Reviews</h2>
                        {reviews.length === 0 ? (
                            <p style={{color: '#888'}}>Be the first to review this product!</p>
                        ) : (
                            <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                                {reviews.map((rev) => (
                                    <div key={rev.id} className="review-card" style={{padding: '1.5rem', backgroundColor: '#fafafa', borderRadius: '8px', border: '1px solid #f0f0f0'}}>
                                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem'}}>
                                            <strong style={{fontSize: '1.05rem'}}>{rev.userName}</strong>
                                            <span style={{color: '#999', fontSize: '0.85rem'}}>{new Date(rev.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div style={{color: '#d4af37', marginBottom: '0.8rem', letterSpacing: '1px'}}>
                                            {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                                        </div>
                                        <p style={{margin: 0, color: '#555', lineHeight: '1.6'}}>{rev.comment}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div style={{flex: 1, minWidth: '300px', backgroundColor: '#fffcf9', padding: '2.5rem', borderRadius: '12px', border: '1px solid #faeedd'}}>
                        <h3 style={{fontFamily: 'var(--font-title)', marginBottom: '1.5rem', color: '#b97a66'}}>Write a Review</h3>
                        <form onSubmit={submitReview}>
                            {reviewFormError && (
                                <div style={{backgroundColor: '#ffebee', color: '#c62828', padding: '1rem', borderRadius: '6px', marginBottom: '1.5rem', fontSize:'0.9rem'}}>
                                    {reviewFormError}
                                </div>
                            )}
                            
                            <div style={{marginBottom: '1.5rem'}}>
                                <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.95rem', color: '#555'}}>Rating</label>
                                <div style={{display: 'flex', gap: '5px'}}>
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <span 
                                            key={star} 
                                            onClick={() => setRating(star)}
                                            className="interactive-star"
                                            style={{
                                                cursor: 'pointer', 
                                                fontSize: '1.5rem',
                                                color: star <= rating ? '#d4af37' : '#ddd',
                                                transition: 'color 0.2s'
                                            }}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div style={{marginBottom: '1.5rem'}}>
                                <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.95rem', color: '#555'}}>Your Review</label>
                                <textarea 
                                    rows="4" 
                                    style={{width: '100%', padding: '1rem', borderRadius: '6px', border: '1px solid #e0e0e0', resize: 'vertical', fontFamily: 'inherit'}}
                                    placeholder="What did you like about this product?"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    required
                                ></textarea>
                            </div>

                            <button 
                                type="submit" 
                                className="btn btn-primary" 
                                style={{width: '100%', padding: '1rem'}}
                                disabled={reviewLoading}
                            >
                                {reviewLoading ? 'Submitting...' : 'Submit Review'}
                            </button>
                            {!authUser && (
                                <p style={{fontSize: '0.8rem', color: '#888', marginTop: '1rem', textAlign: 'center'}}>
                                    You will review as a guest. <Link to="/login.html" style={{color: 'var(--color-peach)'}}>Sign in</Link> to link this to your profile.
                                </p>
                            )}
                        </form>
                    </div>

                </div>
            </div>

            {/* Sticky Action Bar for Mobile View */}
            <div className="mobile-sticky-action-bar">
                <button 
                    type="button"
                    onClick={() => toggleWishlist && toggleWishlist(product)}
                    className="mobile-sticky-wish-btn"
                    style={{
                        border: isWished ? '2px solid #e53935' : '1.5px solid #ddd',
                        backgroundColor: isWished ? '#fff5f5' : '#fff',
                        color: isWished ? '#e53935' : '#444'
                    }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill={isWished ? "#e53935" : "none"} stroke={isWished ? "#e53935" : "currentColor"} strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>
                <button 
                    className="btn btn-primary mobile-sticky-add-btn" 
                    onClick={handleAddToCart}
                    disabled={!selectedSize}
                >
                    {selectedSize ? `Add to Cart ${quantity > 1 ? `(${quantity})` : ''} - ₹${(product.price * quantity).toLocaleString('en-IN')}` : 'Out of Stock'}
                </button>
            </div>
        </div>
    );
};

const Cart = ({ cart, updateQuantity, removeFromCart, onApplyCoupon, discount }) => {
    const [couponCode, setCouponCode] = useState('');
    const [msg, setMsg] = useState('');
    const [tiers, setTiers] = useState([]);
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    const finalTotal = subtotal - (discount?.amt || discount?.value || 0);

    useEffect(() => {
        fetch('/api/gift-tiers')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setTiers(data.sort((a, b) => a.threshold - b.threshold));
                }
            })
            .catch(err => console.error("Error fetching tiers:", err));
    }, []);

    const handleCoupon = async () => {
        try {
            const res = await fetch('/api/coupons/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: couponCode, total: subtotal })
            });
            if (!res.ok) {
                const err = await res.json();
                setMsg(err.error || 'Invalid code');
                return;
            }
            const coupon = await res.json();
            let amt = 0;
            if (coupon.type === 'fixed') amt = coupon.value;
            else amt = (subtotal * coupon.value) / 100;
            
            onApplyCoupon({ code: coupon.code, amt });
            setMsg(`Applied: ₹${amt} off!`);
        } catch (err) {
            setMsg('Validation failed');
        }
    };

    // Calculate progression details
    const unlockedTiers = tiers.filter(t => subtotal >= t.threshold);
    const nextTier = tiers.find(t => subtotal < t.threshold);
    const activeUnlocked = unlockedTiers.length > 0 ? unlockedTiers[unlockedTiers.length - 1] : null;
    const remaining = nextTier ? nextTier.threshold - subtotal : 0;

    return (
        <div className="cart-page-container" style={{maxWidth: '800px', margin: '0 auto', minHeight: '80vh'}}>
            <h1 style={{marginBottom: '2rem'}}>Your Cart</h1>
            {cart.length === 0 ? (
                <p>Your cart is empty. <Link to="/">Continue shopping.</Link></p>
            ) : (
                <div>
                    {cart.map((item, idx) => {
                        const itemQty = item.quantity || 1;
                        const itemTotal = item.price * itemQty;
                        return (
                            <div key={idx} className="cart-item-row" style={{display:'flex', alignItems:'center', gap:'1.5rem', marginBottom:'1.5rem', borderBottom:'1px solid #eee', paddingBottom:'1.5rem', flexWrap:'wrap'}}>
                                <img src={item.imageUrl} alt={item.name} style={{width:'80px', height:'80px', borderRadius:'8px', objectFit:'cover'}} />
                                <div style={{flex: 1, minWidth: '180px'}}>
                                    <h3 style={{fontFamily:'var(--font-body)', fontWeight:'500', fontSize:'1.05rem', margin: 0}}>{item.name}</h3>
                                    {item.size && (
                                        <span style={{display: 'inline-block', backgroundColor: '#fff0e9', color: '#b97a66', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', marginTop: '0.3rem', fontWeight: '500'}}>
                                            Size: {item.size}
                                        </span>
                                    )}
                                    <p style={{color:'var(--color-text-light)', fontSize:'0.85rem', margin: '0.4rem 0 0'}}>{item.description?.substring(0, 50)}...</p>
                                </div>
                                
                                {/* Quantity Selector */}
                                <div className="cart-quantity-selector" style={{display:'flex', alignItems:'center', gap:'0.4rem', border:'1px solid #e0e0e0', borderRadius:'6px', padding:'0.2rem 0.5rem', background:'#fbfbfb'}}>
                                    <button 
                                        onClick={() => updateQuantity && updateQuantity(idx, itemQty - 1)}
                                        aria-label="Decrease quantity"
                                        title="Decrease quantity"
                                        style={{width:'28px', height:'28px', border:'none', background:'#eee', borderRadius:'4px', cursor:'pointer', fontWeight:'bold', fontSize:'1rem', display:'flex', alignItems:'center', justifyContent:'center', color:'#333', transition:'all 0.2s ease'}}
                                        onMouseOver={e => e.currentTarget.style.background='#e0e0e0'}
                                        onMouseOut={e => e.currentTarget.style.background='#eee'}
                                    >
                                        -
                                    </button>
                                    <span style={{minWidth:'28px', textAlign:'center', fontWeight:'600', fontSize:'0.95rem', userSelect:'none'}}>
                                        {itemQty}
                                    </span>
                                    <button 
                                        onClick={() => updateQuantity && updateQuantity(idx, itemQty + 1)}
                                        aria-label="Increase quantity"
                                        title="Increase quantity"
                                        style={{width:'28px', height:'28px', border:'none', background:'#eee', borderRadius:'4px', cursor:'pointer', fontWeight:'bold', fontSize:'1rem', display:'flex', alignItems:'center', justifyContent:'center', color:'#333', transition:'all 0.2s ease'}}
                                        onMouseOver={e => e.currentTarget.style.background='#e0e0e0'}
                                        onMouseOut={e => e.currentTarget.style.background='#eee'}
                                    >
                                        +
                                    </button>
                                </div>

                                {/* Price section */}
                                <div style={{textAlign:'right', minWidth:'100px'}}>
                                    <div style={{fontWeight:'600', fontSize:'1.05rem', color:'var(--color-text)'}}>
                                        ₹{itemTotal.toLocaleString('en-IN')}
                                    </div>
                                    {itemQty > 1 && (
                                        <div style={{fontSize:'0.75rem', color:'#888', marginTop:'2px'}}>
                                            (₹{item.price.toLocaleString('en-IN')} each)
                                        </div>
                                    )}
                                </div>

                                {/* Delete button */}
                                <button 
                                    onClick={() => removeFromCart && removeFromCart(idx)}
                                    aria-label="Delete item from cart"
                                    title="Remove item"
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#d9534f',
                                        cursor: 'pointer',
                                        padding: '0.4rem',
                                        borderRadius: '4px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseOver={e => { e.currentTarget.style.backgroundColor = '#fff0f0'; e.currentTarget.style.color = '#c9302c'; }}
                                    onMouseOut={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#d9534f'; }}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                        <line x1="10" y1="11" x2="10" y2="17"></line>
                                        <line x1="14" y1="11" x2="14" y2="17"></line>
                                    </svg>
                                </button>
                            </div>
                        );
                    })}
                                 {/* Beautiful, Animated Premium Tiered Reward Panel */}
                    {tiers.length > 0 && (
                        <div className="gift-system-card">
                            <h3 className="gift-system-title">
                                Premium Tiered Rewards
                            </h3>

                            {/* Milestone Information Banner */}
                            {nextTier ? (
                                <div className="gift-milestone-banner progress">
                                    <div style={{flex: 1, fontSize: '0.95rem'}}>
                                        Add <strong style={{color: 'var(--color-primary)'}}>₹{remaining.toLocaleString('en-IN')}</strong> more to unlock the next milestone: <strong>{nextTier.name}</strong>!
                                    </div>
                                    <div style={{fontSize: '1.05rem', fontWeight: '600', color: 'var(--color-primary)'}}>
                                        ₹{remaining.toLocaleString('en-IN')} to go
                                    </div>
                                </div>
                            ) : (
                                <div className="gift-milestone-banner unlocked">
                                    <div style={{flex: 1, fontSize: '0.95rem'}}>
                                        <strong>Congratulations!</strong> You have unlocked the highest reward tier: <strong>{activeUnlocked ? activeUnlocked.name : ""}</strong>!
                                    </div>
                                </div>
                            )}

                            {/* Horizontal Progress Timeline */}
                            <div className="gift-progress-wrapper">
                                <div className="gift-progress-track-bg"></div>
                                {(() => {
                                    if (tiers.length === 0) return null;
                                    const maxThreshold = tiers[tiers.length - 1].threshold;
                                    const fillPercent = Math.min(100, (subtotal / maxThreshold) * 100);
                                    return (
                                        <div 
                                            className="gift-progress-track-fill" 
                                            style={{ width: `${fillPercent}%` }}
                                        ></div>
                                    );
                                })()}

                                <div className="gift-nodes-container" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100%' }}>
                                    {/* Start Node Indicator at 0% */}
                                    <div style={{
                                        position: 'absolute',
                                        left: '0%',
                                        transform: 'translateX(-50%)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        zIndex: 3
                                    }}>
                                        <div style={{
                                            width: '12px',
                                            height: '12px',
                                            borderRadius: '50%',
                                            backgroundColor: 'var(--color-primary)',
                                            marginTop: '18px',
                                            boxShadow: '0 0 8px rgba(212,163,115,0.4)',
                                            border: '2px solid white'
                                        }}></div>
                                        <div className="gift-node-label" style={{ marginTop: '0.8rem' }}>
                                            <div>Start</div>
                                            <div className="gift-node-threshold">₹0</div>
                                        </div>
                                    </div>

                                    {tiers.map((t, idx) => {
                                        const maxThreshold = tiers[tiers.length - 1].threshold;
                                        const percent = (t.threshold / maxThreshold) * 100;
                                        const isUnlocked = subtotal >= t.threshold;
                                        return (
                                            <div 
                                                key={t.id} 
                                                className={`gift-node ${isUnlocked ? 'unlocked' : ''}`}
                                                style={{
                                                    position: 'absolute',
                                                    left: `${percent}%`,
                                                    transform: 'translateX(-50%)',
                                                    zIndex: 3
                                                }}
                                            >
                                                <div className="gift-node-dot">
                                                    {isUnlocked ? '✓' : idx + 1}
                                                </div>
                                                <div className="gift-node-label">
                                                    <div>{t.name}</div>
                                                    <div className="gift-node-threshold">₹{parseInt(t.threshold).toLocaleString('en-IN')}</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Rewards Detail Cards Grid */}
                            <div className="gift-cards-grid">
                                {tiers.map((t) => {
                                    const isUnlocked = subtotal >= t.threshold;
                                    const isActive = activeUnlocked && activeUnlocked.id === t.id;
                                    
                                    return (
                                        <div 
                                            key={t.id} 
                                            className={`gift-reward-card ${isUnlocked ? 'unlocked' : 'locked'} ${isActive ? 'active-unlocked' : ''}`}
                                        >
                                            <div>
                                                <div className="gift-reward-card-label">Tier {t.threshold >= 10000 ? 'Gold' : t.threshold >= 5000 ? 'Silver' : 'Bronze'}</div>
                                                <h4 className="gift-reward-card-title">{t.name}</h4>
                                                <p className="gift-reward-card-desc">
                                                    {t.rewardType === 'coupon' 
                                                        ? `Qualified for a custom digital coupon giving ${t.discountType === 'percentage' ? t.discountValue + '%' : '₹' + t.discountValue} discount off your next purchase.` 
                                                        : `Includes a handcraft premium physical gift: ${t.physicalName} packed dynamically in your parcel.`
                                                    }
                                                </p>
                                            </div>
                                            
                                            <div className="gift-reward-card-requirement" style={{ color: isUnlocked ? '#2E7D32' : 'var(--color-primary)' }}>
                                                <span>{isUnlocked ? 'Unlocked' : `Spend ₹${parseInt(t.threshold).toLocaleString('en-IN')}`}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div style={{marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f9f9f9', borderRadius: '8px'}}>
                        <h4 style={{marginBottom: '1rem'}}>Apply Coupon</h4>
                        <div style={{display: 'flex', gap: '1rem'}}>
                            <input 
                                type="text" 
                                value={couponCode} 
                                onChange={e => setCouponCode(e.target.value)} 
                                placeholder="Enter code (e.g. WELCOME10)"
                                style={{padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px', flex: 1}}
                            />
                            <button onClick={handleCoupon} className="btn btn-primary" style={{padding: '0.8rem 1.5rem'}}>Apply</button>
                        </div>
                        {msg && <p style={{marginTop: '0.5rem', fontSize: '0.9rem', color: msg.includes('Applied') ? 'green' : 'red'}}>{msg}</p>}
                    </div>

                    <div style={{textAlign:'right', marginTop:'2rem'}}>
                        <p>Subtotal: ₹{subtotal.toLocaleString('en-IN')}</p>
                        {discount && <p style={{color: 'green'}}>Discount: -₹{discount.amt.toLocaleString('en-IN')}</p>}
                        <h3 style={{margin:'1rem 0 2rem'}}>Total: ₹{finalTotal.toLocaleString('en-IN')}</h3>
                        <Link to="/checkout" className="btn btn-primary">Proceed to Checkout</Link>
                    </div>
                </div>
            )}
        </div>
    );
};

const Checkout = ({ cart, discount, clearCart, authUser }) => {
    const [email, setEmail] = useState('');
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressID, setSelectedAddressID] = useState(null);
    const [checkoutType, setCheckoutType] = useState('delivery'); // 'delivery' | 'pickup' | 'hyderabad_instant'
    const [paymentMethod, setPaymentMethod] = useState('online'); // 'online' | 'offline_qr'
    const [shippingForm, setShippingForm] = useState({
        fullName: '',
        phone: '',
        addressLine: '',
        city: '',
        state: '',
        zipCode: ''
    });
    const [showNewAddressForm, setShowNewAddressForm] = useState(false);
    const [addressMessage, setAddressMessage] = useState('');
    const [ordering, setOrdering] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!cart || cart.length === 0) {
            navigate('/cart');
        }
    }, [cart, navigate]);

    const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
    const finalTotal = subtotal - (discount?.amt || 0);

    const activeAddr = authUser && addresses.length > 0 ? addresses.find(a => a.id === selectedAddressID) : null;
    const isCityHyderabad = activeAddr && (
        activeAddr.city.toLowerCase().trim() === 'hyderabad' ||
        activeAddr.city.toLowerCase().trim() === 'secunderabad'
    );
    const isInstantDeliveryBlocked = checkoutType === 'hyderabad_instant' && activeAddr && !isCityHyderabad;

    useEffect(() => {
        if (authUser) {
            setEmail(authUser.email || '');

            fetch('/api/profile/me', {
                headers: { 'X-User-Id': authUser.uid }
            }).then(r => r.json()).then(data => {
                if (data.email) setEmail(data.email);
            }).catch(err => console.error(err));

            loadAddresses();
        }
    }, [authUser]);

    const loadAddresses = async () => {
        if (!authUser) return;
        try {
            const response = await fetch('/api/profile/addresses', {
                headers: { 'X-User-Id': authUser.uid }
            });
            if (response.ok) {
                const data = await response.json();
                setAddresses(data);
                
                const def = data.find(a => a.isDefault);
                if (def) {
                    setSelectedAddressID(def.id);
                } else if (data.length > 0) {
                    setSelectedAddressID(data[0].id);
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        setAddressMessage('');
        if (!authUser) return;
        try {
            const response = await fetch('/api/profile/addresses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-Id': authUser.uid
                },
                body: JSON.stringify(shippingForm)
            });
            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || 'Failed to save address');
            }
            const saved = await response.json();
            setShippingForm({ fullName: '', phone: '', addressLine: '', city: '', state: '', zipCode: '' });
            setShowNewAddressForm(false);
            
            const loadRes = await fetch('/api/profile/addresses', {
                headers: { 'X-User-Id': authUser.uid }
            });
            if (loadRes.ok) {
                const data = await loadRes.json();
                setAddresses(data);
                if (data.length > 0) {
                    setSelectedAddressID(data[0].id); 
                }
            }
        } catch (err) {
            setAddressMessage(err.message);
        }
    };

    const placeOrder = async () => {
        if (!email) return showAlert('Please enter your email address before placing an order.', 'Email Required', 'warning');
        
        let order = {};
        if (checkoutType === 'pickup') {
            order = {
                customerEmail: email,
                couponCode: discount?.code || '',
                items: cart.map(item => ({
                    productId: item.id,
                    quantity: item.quantity || 1,
                    size: item.size || ''
                })),
                checkoutType: 'pickup',
                paymentMethod: paymentMethod,
                shippingName: "Store Pickup Customer",
                shippingPhone: authUser?.phone || "0000000000",
                shippingAddress: "Jubilee Hills boutique pickup",
                shippingCity: "Hyderabad",
                shippingState: "Telangana",
                shippingZipCode: "500033"
            };
        } else {
            if (!activeAddr) {
                return showAlert('Please select or add a shipping address before paying.', 'Address Required', 'warning');
            }
            if (checkoutType === 'hyderabad_instant') {
                const city = (activeAddr.city || '').trim().toLowerCase();
                if (city !== 'hyderabad' && city !== 'secunderabad') {
                    return showAlert('Instant delivery is only available inside Hyderabad/Secunderabad.', 'Location Restriction', 'warning');
                }
                const zip = (activeAddr.zipCode || '').trim();
                if (!zip.startsWith('500') || zip.length !== 6) {
                    return showAlert('Instant delivery requires a local Hyderabad pincode starting with 500 (e.g., 500081).', 'Pincode Required', 'warning');
                }
            }
            order = {
                customerEmail: email,
                couponCode: discount?.code || '',
                items: cart.map(item => ({
                    productId: item.id,
                    quantity: item.quantity || 1,
                    size: item.size || ''
                })),
                checkoutType: checkoutType,
                paymentMethod: 'online',
                shippingName: activeAddr.fullName,
                shippingPhone: activeAddr.phone,
                shippingAddress: activeAddr.addressLine,
                shippingCity: activeAddr.city,
                shippingState: activeAddr.state,
                shippingZipCode: activeAddr.zipCode
            };
        }

        setOrdering(true);

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(order)
            });
            
            if (!res.ok) {
                const errData = await res.json();
                showAlert(errData.error || 'Failed to create order', 'Order Error', 'error');
                setOrdering(false);
                return;
            }

            const data = await res.json();

            if (data.paymentMethod === 'offline_qr') {
                clearCart();
                navigate('/checkout-success', {
                    state: {
                        orderId: data.orderId,
                        checkoutType: 'pickup',
                        paymentMethod: 'offline_qr',
                        amount: data.amount
                    }
                });
            } else if (data.checkoutUrl !== "razorpay") {
                clearCart();
                let targetUrl = data.checkoutUrl;
                if (targetUrl.startsWith('/#')) {
                    targetUrl = targetUrl.substring(2);
                }
                navigate(targetUrl);
            } else {
                const options = {
                    "key": data.razorpayKey,
                    "amount": data.amount * 100,
                    "currency": "INR",
                    "name": "The Ethnic Touch",
                    "description": "Premium Kurthi E-Commerce Checkout",
                    "order_id": data.razorpayOrderId,
                    "handler": async function (response) {
                        const verifyRes = await fetch('/api/orders/verify', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                orderId: data.orderId,
                                razorpayOrderId: response.razorpay_order_id,
                                razorpayPaymentId: response.razorpay_payment_id,
                                razorpaySignature: response.razorpay_signature,
                                mock: false
                            })
                        });

                        if (verifyRes.ok) {
                            const verifyData = await verifyRes.json();
                            clearCart();
                            navigate('/checkout-success', { 
                                state: { 
                                    orderId: data.orderId, 
                                    gift: verifyData.giftCode, 
                                    unlockedGift: verifyData.unlockedGift,
                                    giftType: verifyData.giftType,
                                    giftExpiryDate: verifyData.giftExpiryDate,
                                    tracking: verifyData.trackingNumber,
                                    checkoutType: checkoutType,
                                    paymentMethod: 'online'
                                } 
                            });
                        } else {
                            showAlert("Payment verification check failed. Please verify with Support.", "Payment Error", "error");
                        }
                    },
                    "prefill": {
                        "email": email
                    },
                    "theme": {
                        "color": "#FFE5D9"
                    }
                };
                const rzp = new window.Razorpay(options);
                rzp.open();
                setOrdering(false);
            }
        } catch (err) {
            showAlert("Error placing order. Please try again.", "Order Error", "error");
            setOrdering(false);
        }
    };

    return (
        <div style={{padding: '8rem 5% 4rem', maxWidth: '680px', margin: '0 auto', minHeight: '80vh'}}>
            <h1 style={{fontFamily: 'var(--font-title)', color: 'var(--color-peach)', marginBottom: '1.5rem'}}>Checkout</h1>
            
            {/* Delivery Methods Selector */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '12px',
                marginBottom: '2.5rem',
            }}>
                <button
                    onClick={() => {
                        setCheckoutType('delivery');
                        setPaymentMethod('online');
                    }}
                    style={{
                        padding: '16px 10px',
                        borderRadius: '12px',
                        border: '1.5px solid',
                        borderColor: checkoutType === 'delivery' ? '#D4A373' : '#E6E4E0',
                        background: checkoutType === 'delivery' ? '#FAF3ED' : '#fff',
                        color: checkoutType === 'delivery' ? '#8F5E36' : '#5C5854',
                        fontWeight: '600',
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: checkoutType === 'delivery' ? '0 6px 15px rgba(212,163,115,0.15)' : 'none',
                        outline: 'none'
                    }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{transition: 'transform 0.3s ease'}}>
                        <rect x="1" y="3" width="15" height="13" rx="2" ry="2" />
                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                        <circle cx="5.5" cy="18.5" r="2.5" />
                        <circle cx="18.5" cy="18.5" r="2.5" />
                    </svg>
                    <span style={{fontFamily: 'Inter, sans-serif', letterSpacing: '-0.01em'}}>Standard Delivery</span>
                </button>

                <button
                    onClick={() => {
                        setCheckoutType('pickup');
                        setPaymentMethod('online');
                    }}
                    style={{
                        padding: '16px 10px',
                        borderRadius: '12px',
                        border: '1.5px solid',
                        borderColor: checkoutType === 'pickup' ? '#D4A373' : '#E6E4E0',
                        background: checkoutType === 'pickup' ? '#FAF3ED' : '#fff',
                        color: checkoutType === 'pickup' ? '#8F5E36' : '#5C5854',
                        fontWeight: '600',
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: checkoutType === 'pickup' ? '0 6px 15px rgba(212,163,115,0.15)' : 'none',
                        outline: 'none'
                    }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    <span style={{fontFamily: 'Inter, sans-serif', letterSpacing: '-0.01em'}}>Store Pickup</span>
                </button>

                <button
                    onClick={() => {
                        setCheckoutType('hyderabad_instant');
                        setPaymentMethod('online');
                    }}
                    style={{
                        padding: '16px 10px',
                        borderRadius: '12px',
                        border: '1.5px solid',
                        borderColor: checkoutType === 'hyderabad_instant' ? '#D4A373' : '#E6E4E0',
                        background: checkoutType === 'hyderabad_instant' ? '#FAF3ED' : '#fff',
                        color: checkoutType === 'hyderabad_instant' ? '#8F5E36' : '#5C5854',
                        fontWeight: '600',
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: checkoutType === 'hyderabad_instant' ? '0 6px 15px rgba(212,163,115,0.15)' : 'none',
                        outline: 'none'
                    }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                    <span style={{fontFamily: 'Inter, sans-serif', letterSpacing: '-0.01em'}}>Hyderabad Instant</span>
                </button>
            </div>

            <div style={{marginBottom: '2rem'}}>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333'}}>Confirm Email *</label>
                <input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    placeholder="you@example.com"
                    style={{padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', width: '100%', fontSize: '0.95rem'}}
                    disabled={ordering}
                    required
                />
            </div>

            <div style={{
                padding: '2rem', 
                border: '1.5px solid #E6E4E0', 
                borderRadius: '12px', 
                background: '#FAF9F6', 
                marginBottom: '2.5rem', 
                boxShadow: '0 4px 15px rgba(0,0,0,0.015)'
            }}>
                <h3 style={{fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.8rem', color: '#2D2A26', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Order Summary</h3>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.92rem', color: '#6C6863'}}>
                    <span>Garments in Cart:</span>
                    <span>{cart.reduce((sum, item) => sum + (item.quantity || 1), 0)} pc{cart.reduce((sum, item) => sum + (item.quantity || 1), 0) !== 1 ? 's' : ''}</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #E6E4E0', paddingTop: '0.8rem', marginTop: '0.8rem'}}>
                    <span style={{fontWeight: 600, color: '#2D2A26'}}>Total Amount to Pay:</span>
                    <strong style={{fontSize: '1.25rem', color: '#8F5E36'}}>₹{finalTotal.toLocaleString('en-IN')}</strong>
                </div>
            </div>

            {/* Store Pickup Details UI */}
            {checkoutType === 'pickup' && (
                <div style={{marginBottom: '2.5rem'}}>
                    <div style={{
                        background: '#FAF3ED',
                        border: '1px solid #FFE5D9',
                        borderRadius: '12px',
                        padding: '1.8rem',
                        marginBottom: '2rem',
                        boxShadow: '0 4px 12px rgba(212,163,115,0.06)'
                    }}>
                        <h4 style={{fontFamily: 'var(--font-title)', color: '#8F5E36', marginBottom: '0.8rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#8F5E36'}}>
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                <polyline points="9 22 9 12 15 12 15 22" />
                            </svg>
                            Jubilee Hills Boutique Collection
                        </h4>
                        <p style={{fontSize: '0.95rem', color: '#2D2A26', fontWeight: 600, margin: '0 0 0.4rem'}}>The Ethnic Touch Boutique</p>
                        <p style={{fontSize: '0.88rem', color: '#6C6863', margin: '0 0 0.8rem', lineHeight: '1.5'}}>
                            Road No. 36, Near Jubilee Hills Check Post,<br/>
                            Hyderabad, Telangana - 500033<br/>
                            Assistant Desk: <strong>+91 98765 43210</strong>
                        </p>
                        <p style={{fontSize: '0.85rem', color: '#8F5E36', fontStyle: 'italic', margin: 0, borderTop: '1px solid rgba(212,163,115,0.2)', paddingTop: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px'}}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#8F5E36', flexShrink: 0}}>
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="16" x2="12" y2="12" />
                                <line x1="12" y1="8" x2="12.01" y2="8" />
                            </svg>
                            <span>Collected packages are custom steamed and gift-wrapped on arrival. Pickups available 10:30 AM - 8:30 PM.</span>
                        </p>
                    </div>

                    {/* Payment Mode (Online / Offline QR) */}
                    <div style={{marginBottom: '2rem'}}>
                        <h3 style={{fontSize: '1.1rem', fontWeight: 600, color: '#333', marginBottom: '1.1rem'}}>Select Payment Mode</h3>
                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                            <div 
                                onClick={() => setPaymentMethod('online')}
                                style={{
                                    border: paymentMethod === 'online' ? '2px solid #D4A373' : '1px solid #E6E4E0',
                                    borderRadius: '12px',
                                    padding: '1.5rem 1rem',
                                    background: paymentMethod === 'online' ? '#FAF3ED' : '#fff',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '12px',
                                    transition: 'all 0.3s ease',
                                    boxShadow: paymentMethod === 'online' ? '0 6px 15px rgba(212,163,115,0.15)' : 'none'
                                }}
                            >
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#8F5E36'}}>
                                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                                    <line x1="1" y1="10" x2="23" y2="10" />
                                </svg>
                                <span style={{fontSize: '0.98rem', fontWeight: 600, color: '#2D2A26'}}>Prepay Online</span>
                                <span style={{fontSize: '0.75rem', color: '#6C6863', textAlign: 'center'}}>Instant checkout verification</span>
                            </div>
                            
                            <div 
                                onClick={() => setPaymentMethod('offline_qr')}
                                style={{
                                    border: paymentMethod === 'offline_qr' ? '2px solid #D4A373' : '1px solid #E6E4E0',
                                    borderRadius: '12px',
                                    padding: '1.5rem 1rem',
                                    background: paymentMethod === 'offline_qr' ? '#FAF3ED' : '#fff',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '12px',
                                    transition: 'all 0.3s ease',
                                    boxShadow: paymentMethod === 'offline_qr' ? '0 6px 15px rgba(212,163,115,0.15)' : 'none'
                                }}
                            >
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#8F5E36'}}>
                                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                                    <line x1="12" y1="18" x2="12.01" y2="18" />
                                </svg>
                                <span style={{fontSize: '0.98rem', fontWeight: 600, color: '#2D2A26'}}>Pay In-Store</span>
                                <span style={{fontSize: '0.75rem', color: '#6C6863', textAlign: 'center'}}>Book now, scan pass at boutique</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Standard Delivery Mode Info Banner */}
            {checkoutType === 'delivery' && (
                <div style={{
                    background: '#F9FAF9',
                    border: '1px solid #E6E6E6',
                    borderRadius: '12px',
                    padding: '1.2rem',
                    marginBottom: '2rem',
                    fontSize: '0.88rem',
                    color: '#555',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px'
                }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#555', flexShrink: 0}}>
                        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
                        <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                    </svg>
                    <div>
                        <strong>Standard Shipping Details:</strong> Dispatched via premium express post (Delhivery/BlueDart). Expected delivery within <strong>3-5 business days</strong> nationwide.
                    </div>
                </div>
            )}

            {/* Hyderabad Instant Courier Mode Info Banner */}
            {checkoutType === 'hyderabad_instant' && (
                <div style={{
                    background: '#FFF9F2',
                    border: '1px solid #FFE9D1',
                    borderRadius: '12px',
                    padding: '1.2rem',
                    marginBottom: '2rem',
                    fontSize: '0.88rem',
                    color: '#8F5E36',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px'
                }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#8F5E36', flexShrink: 0}}>
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                    <div>
                        <strong>Local courier dispatch:</strong> Delivered within <strong>2-4 hours</strong> via instant courier (Uber/Rapido) direct from Road No. 36 boutique.
                    </div>
                </div>
            )}

            {/* Address Selector list (Hidden for Store Pickup) */}
            {checkoutType !== 'pickup' && (
                <div style={{marginBottom: '2rem'}}>
                    <div style={{display: 'flex', justifycontent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
                        <h3 style={{fontSize: '1.1rem', fontWeight: 600, color: '#333'}}>Select Shipping Address *</h3>
                        {authUser && (
                            <button className="btn btn-secondary" style={{padding: '0.4rem 0.8rem', fontSize: '0.8rem'}} onClick={() => {
                                setShippingForm({ fullName: '', phone: '', addressLine: '', city: '', state: '', zipCode: '' });
                                setShowNewAddressForm(prev => !prev);
                                setAddressMessage('');
                            }}>
                                {showNewAddressForm ? 'Cancel' : '+ Add New Address'}
                            </button>
                        )}
                    </div>

                    {addressMessage && <div className="profile-message error" style={{marginBottom: '1rem'}}>{addressMessage}</div>}

                    {showNewAddressForm && (
                        <form onSubmit={handleAddAddress} style={{background: '#FAF9F6', border: '1.5px solid #E6E4E0', padding: '1.8rem', borderRadius: '12px', marginBottom: '2rem'}}>
                            <h4 style={{fontSize: '1rem', fontWeight: 600, marginBottom: '1.2rem', color: '#2D2A26'}}>New Shipping Address</h4>
                            <div className="profile-grid">
                                <label className="profile-field">
                                    <span>Contact Name *</span>
                                    <input className="profile-input" value={shippingForm.fullName} onChange={e => setShippingForm({...shippingForm, fullName: e.target.value})} required />
                                </label>
                                <label className="profile-field">
                                    <span>Phone Number *</span>
                                    <input className="profile-input" value={shippingForm.phone} onChange={e => setShippingForm({...shippingForm, phone: e.target.value})} required />
                                </label>
                                <label className="profile-field profile-span-2">
                                    <span>Address Line *</span>
                                    <input className="profile-input" value={shippingForm.addressLine} onChange={e => setShippingForm({...shippingForm, addressLine: e.target.value})} required />
                                </label>
                                <label className="profile-field">
                                    <span>City *</span>
                                    <input className="profile-input" value={shippingForm.city} onChange={e => setShippingForm({...shippingForm, city: e.target.value})} required />
                                </label>
                                <label className="profile-field">
                                    <span>State *</span>
                                    <input className="profile-input" value={shippingForm.state} onChange={e => setShippingForm({...shippingForm, state: e.target.value})} required />
                                </label>
                                <label className="profile-field">
                                    <span>ZIP / Postal Code *</span>
                                    <input className="profile-input" value={shippingForm.zipCode} onChange={e => setShippingForm({...shippingForm, zipCode: e.target.value})} required style={{letterSpacing: '0.1em'}} placeholder="6 digits" />
                                </label>
                            </div>
                            <button className="btn btn-primary" type="submit" style={{marginTop: '1.2rem', padding: '0.75rem 1.8rem', borderRadius: '50px'}}>Save and Use Address</button>
                        </form>
                    )}

                    {addresses.length === 0 ? (
                        <div style={{background: '#fafafa', border: '1px dashed #ccc', padding: '2.5rem 1.5rem', borderRadius: '12px', textAlign: 'center'}}>
                            <p style={{fontSize: '0.92rem', color: '#6C6863', marginBottom: '1.2rem'}}>You don't have any saved shipping addresses.</p>
                            {!showNewAddressForm && authUser && (
                                <button className="btn btn-primary" onClick={() => setShowNewAddressForm(true)}>+ Add Shipping Address</button>
                            )}
                            {!authUser && (
                                <p style={{fontSize: '0.85rem', color: '#999'}}>Please sign in to save and manage shipping addresses.</p>
                            )}
                        </div>
                    ) : (
                        <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '1.2rem'}}>
                            {addresses.map(addr => {
                                const isSelected = selectedAddressID === addr.id;
                                return (
                                    <div 
                                        key={addr.id} 
                                        onClick={() => setSelectedAddressID(addr.id)}
                                        style={{
                                            border: isSelected ? '2px solid #D4A373' : '1px solid #E6E4E0', 
                                            borderRadius: '12px', 
                                            padding: '1.5rem', 
                                            background: isSelected ? '#FAF3ED' : '#fff', 
                                            cursor: 'pointer',
                                            position: 'relative',
                                            transition: 'all 0.3s ease',
                                            boxShadow: isSelected ? '0 6px 15px rgba(212,163,115,0.12)' : 'none'
                                        }}
                                    >
                                        <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem'}}>
                                            <input 
                                                type="radio" 
                                                checked={isSelected} 
                                                onChange={() => setSelectedAddressID(addr.id)} 
                                                style={{cursor: 'pointer', accentColor: '#D4A373'}} 
                                            />
                                            <h4 style={{fontSize: '0.98rem', fontWeight: 600, margin: 0, color: '#2D2A26'}}>{addr.fullName}</h4>
                                            {addr.isDefault && <span style={{background: '#FFE5D9', color: '#8F5E36', fontSize: '0.65rem', padding: '3px 8px', borderRadius: '20px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Default</span>}
                                        </div>
                                        <p style={{fontSize: '0.88rem', color: '#6C6863', margin: '0.2rem 0 0.2rem 24px', lineHeight: '1.5'}}>{addr.addressLine}</p>
                                        <p style={{fontSize: '0.88rem', color: '#6C6863', margin: '0 0 0.2rem 24px', lineHeight: '1.5'}}>{addr.city}, {addr.state} - {addr.zipCode}</p>
                                        <p style={{fontSize: '0.88rem', color: '#6C6863', margin: '0 0 0 24px'}}>Phone: <strong>{addr.phone}</strong></p>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Instant Shipping Warning if City is not Hyderabad */}
                    {isInstantDeliveryBlocked && (
                        <div style={{
                            background: '#FDF2F2',
                            border: '1.5px solid #F8D7DA',
                            color: '#721C24',
                            borderRadius: '12px',
                            padding: '1.2rem',
                            marginTop: '1.5rem',
                            fontSize: '0.9rem',
                            lineHeight: '1.5',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '12px'
                        }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#721C24', flexShrink: 0}}>
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                <line x1="12" y1="9" x2="12" y2="13" />
                                <line x1="12" y1="17" x2="12.01" y2="17" />
                            </svg>
                            <div>
                                <strong>Local Instant Courier Blocked:</strong> Your shipping address city ({activeAddr?.city || 'Selected location'}) is outside the Hyderabad/Secunderabad delivery radius.<br/>
                                <span style={{fontSize: '0.85rem', color: '#90242E', marginTop: '0.4rem', display: 'block'}}>
                                    To proceed, select standard nationwide delivery, pick up in boutique, or update your shipping address.
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <button 
                className="btn btn-primary" 
                onClick={placeOrder} 
                style={{
                    marginTop: '2rem', 
                    width: '100%', 
                    padding: '1.2rem', 
                    fontSize: '1.05rem', 
                    fontWeight: '600', 
                    borderRadius: '50px',
                    letterSpacing: '0.02em',
                    boxShadow: '0 8px 25px rgba(45,42,38,0.15)'
                }}
                disabled={ordering || (checkoutType !== 'pickup' && addresses.length === 0) || isInstantDeliveryBlocked}
            >
                {ordering ? "Verifying Stock & Routing..." : 
                 checkoutType === 'pickup' && paymentMethod === 'offline_qr' ? "Book Store Pickup Pass" : 
                 "Secure Checkout & Prepay"}
            </button>
        </div>
    );
};;

// --- MOCK PAYMENT GATEWAY SIMULATOR ---
const MockPayment = ({ onPaymentSuccess }) => {
    const [searchParams] = useState(() => {
        const hash = window.location.hash;
        const qIndex = hash.indexOf('?');
        const qStr = qIndex !== -1 ? hash.slice(qIndex) : '';
        return new URLSearchParams(qStr);
    });
    const orderId = searchParams.get('orderId');
    const [paying, setPaying] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!orderId) {
            navigate('/');
        }
    }, [orderId]);

    const handlePay = async () => {
        setPaying(true);
        try {
            const res = await fetch('/api/orders/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId: orderId,
                    mock: true
                })
            });
            if (res.ok) {
                const data = await res.json();
                onPaymentSuccess(data);
                navigate('/checkout-success', { 
                    state: { 
                        orderId: orderId, 
                        gift: data.giftCode, 
                        unlockedGift: data.unlockedGift,
                        giftType: data.giftType,
                        giftExpiryDate: data.giftExpiryDate,
                        tracking: data.trackingNumber 
                    } 
                });
            } else {
                const errData = await res.json();
                showAlert("Simulated transaction failed: " + (errData.error || 'Server error'), "Transaction Error", "error");
                setPaying(false);
            }
        } catch (err) {
            showAlert("Server connection failed. Please check your network.", "Connection Error", "error");
            setPaying(false);
        }
    };

    return (
        <div style={{padding: '8rem 5% 4rem', maxWidth: '500px', margin: '0 auto', minHeight: '80vh'}}>
            <div style={{
                padding: '3rem 2rem',
                backgroundColor: 'white',
                borderRadius: 'var(--border-radius-lg)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                border: '1px solid #f0f0f0',
                textAlign: 'center'
            }}>
                <h2 style={{fontFamily: 'var(--font-title)', color: 'var(--color-peach)', marginBottom: '1rem'}}>
                    Razorpay Simulator
                </h2>
                <p style={{color: 'gray', marginBottom: '2rem'}}>Confirming details for order ref: <strong>{orderId}</strong></p>
                
                <div style={{
                    backgroundColor: '#fffcf9',
                    padding: '1.5rem',
                    borderRadius: '8px',
                    marginBottom: '2rem',
                    border: '1px dashed var(--color-peach)'
                }}>
                    <p style={{fontSize: '0.9rem', color: '#886050', margin: 0}}>
                        <strong>Dev Sandbox Environment</strong>
                    </p>
                    <p style={{fontSize: '0.85rem', color: '#906858', margin: '0.5rem 0 0', lineHeight: '1.5'}}>
                        This screen simulates RazorPay's secure transaction screen. Clicking below fires the signature webhook checking.
                    </p>
                </div>

                <button 
                    className="btn btn-primary" 
                    onClick={handlePay} 
                    disabled={paying}
                    style={{width: '100%', padding: '1.2rem', fontSize: '1.1rem'}}
                >
                    {paying ? "Verifying signature credentials..." : "Simulate Payment Success"}
                </button>
            </div>
        </div>
    );
};

// --- CHECKOUT SUCCESS PAGE ---
const CheckoutSuccess = () => {
    const state = ReactRouterDOM.useLocation().state || {};
    const { orderId, gift, tracking, unlockedGift, giftType, giftExpiryDate, checkoutType, paymentMethod, amount } = state;
    const navigate = useNavigate();

    useEffect(() => {
        if (!orderId) {
            navigate('/');
            return;
        }

        if (typeof confetti === 'function') {
            confetti({
                particleCount: 150,
                spread: 80,
                origin: { y: 0.6 }
            });
            setTimeout(() => {
                confetti({
                    particleCount: 60,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 }
                });
            }, 250);
            setTimeout(() => {
                confetti({
                    particleCount: 60,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 }
                });
            }, 400);
        }
    }, [orderId, navigate]);

    if (!orderId) {
        return null;
    }

    const displayGift = unlockedGift || gift;
    const isPhysical = giftType === 'physical';

    // Store pickup OR offline QR payment
    const isPickup = checkoutType === 'pickup' || tracking === 'STORE-PICKUP' || paymentMethod === 'offline_qr';
    const isOffline = paymentMethod === 'offline_qr';
    
    // QR Code data: point to admin confirm pickup view
    const qrUrl = window.location.origin + "/static/admin/index.html#pickup-scanner?orderId=" + orderId;
    const qrImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&color=2c2c2c&data=${encodeURIComponent(qrUrl)}`;

    return (
        <div style={{padding: '9rem 5% 4rem', maxWidth: '680px', margin: '0 auto', minHeight: '80vh', textAlign:'center'}}>
            {/* Celebration Icon */}
            {isOffline ? (
                <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: '#FAF3ED',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    boxShadow: '0 10px 25px rgba(208,136,59,0.12)'
                }}>
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#8F5E36" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                    </svg>
                </div>
            ) : (
                <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: '#E8F5E9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    boxShadow: '0 10px 25px rgba(46,125,50,0.12)'
                }}>
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </div>
            )}
            
            <h1 style={{
                fontFamily:'var(--font-heading)', 
                fontSize: '2.5rem',
                marginBottom: '0.8rem', 
                color: '#2D2A26',
                letterSpacing: '-0.01em'
            }}>
                {isOffline ? "Boutique Order Reserved!" : "Order Placed Successfully!"}
            </h1>
            <p style={{fontSize: '1rem', color: '#6C6863', marginBottom: '2rem'}}>Thank you for choosing luxury, custom Indo-Western aesthetics.</p>
            
            <div style={{
                padding: '2.5rem 2rem', 
                backgroundColor: '#fff', 
                border: '1.5px solid #E6E4E0', 
                borderRadius: '16px', 
                margin: '2rem 0',
                boxShadow: '0 8px 30px rgba(0,0,0,0.025)',
                position: 'relative'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#D4A373',
                    color: '#fff',
                    padding: '4px 16px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em'
                }}>
                    Boutique Receipt
                </div>

                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: '#FAF4EE', border: '1.5px dashed #D4A373', borderRadius: '50px', padding: '0.5rem 1.1rem', marginTop: '0.6rem', marginBottom: '1.6rem', boxShadow: '0 4px 15px rgba(212,163,115,0.06)', maxWidth: '100%', whiteSpace: 'nowrap' }}>
                    <span style={{ fontSize: '0.8rem', color: '#8F5E36', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Order Reference</span>
                    <span style={{ color: '#D4A373', opacity: 0.6 }}>|</span>
                    <strong style={{ fontSize: '1.05rem', fontFamily: 'monospace', color: '#2D2A26', letterSpacing: '0.04em' }}>#{orderId}</strong>
                    <CopyButton text={orderId} iconOnly={true} style={{ padding: '4px 6px', borderRadius: '50%', border: '1px solid #E6D8C8', backgroundColor: '#FFF', flexShrink: 0 }} />
                </div>
                
                <p style={{fontSize:'0.96rem', color: '#5C5854', lineHeight: '1.6', margin: '0 0 2rem'}}>
                    {isOffline 
                        ? `Please present the verification pass QR code below at the reception counter to finalize payments of ₹${(amount || 0).toLocaleString('en-IN')} and collect your bespoke kurthi garments.` 
                        : isPickup 
                        ? "Your boutique collection checkout is complete and fully paid. Keep this code handy for scanning at the retail checkout."
                        : tracking && (tracking.startsWith('RAPIDO-INSTANT-') || tracking.startsWith('UBER-INSTANT-'))
                        ? "Registered for direct instant courier shipping. Your designer styles are prepared, steamed, and dispatched from Jubilee Hills via direct courier."
                        : "Your designer packaging is ready and handed over to express delivery trackers for prompt dispatch to your wardrobe."
                    }
                </p>

                {/* Show QR Code for In-Store Pickup */}
                {isPickup && (
                    <div style={{
                        marginTop: '1.5rem',
                        padding: '1.8rem',
                        background: '#FAF9F6',
                        border: '2px solid #D4A373',
                        borderRadius: '16px',
                        display: 'inline-block',
                        boxShadow: '0 8px 20px rgba(212,163,115,0.08)'
                    }}>
                        <p style={{margin: '0 0 1.2rem', fontSize: '0.82rem', color: '#8F5E36', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em'}}>
                            Boutique Verification Scanner Pass
                        </p>
                        <div style={{
                            padding: '10px',
                            background: '#fff',
                            borderRadius: '12px',
                            display: 'inline-block',
                            border: '1px solid #E6E4E0'
                        }}>
                            <img 
                                src={qrImgUrl} 
                                alt="Order Pickup Pass" 
                                style={{width: '200px', height: '200px', display: 'block', margin: '0 auto'}}
                            />
                        </div>
                        <div>
                            <div style={{
                                display: 'inline-flex', 
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.6rem',
                                marginTop: '1rem',
                                backgroundColor: '#FFF',
                                border: '1px dashed #D4A373',
                                borderRadius: '50px',
                                padding: '0.45rem 1.2rem'
                            }}>
                                <strong style={{
                                    fontSize: '1.1rem', 
                                    fontFamily: 'monospace',
                                    color: '#2D2A26',
                                    letterSpacing: '0.05em'
                                }}>
                                    #{orderId}
                                </strong>
                                <CopyButton text={orderId} iconOnly={true} style={{ padding: '4px 7px', borderRadius: '50%', border: '1px solid #E6D8C8' }} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Standard Shipping Tracking code */}
                {!isPickup && tracking && (
                    <div style={{
                        marginTop: '1.5rem',
                        padding: '0.8rem 1.4rem',
                        background: '#FAF9F6',
                        border: '1.5px dashed #D4A373',
                        borderRadius: '50px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justify: 'center',
                        gap: '0.6rem',
                        flexWrap: 'wrap'
                    }}>
                        <span style={{ fontSize: '0.85rem', color: '#6C6863', fontWeight: '500' }}>Carrier Waybill ID:</span>
                        <strong style={{ fontSize: '1.1rem', color: '#8F5E36', fontFamily: 'monospace', letterSpacing: '0.05em' }}>{tracking}</strong>
                        <CopyButton text={tracking} iconOnly={true} style={{ padding: '4px 7px', borderRadius: '50%', border: '1px solid #E6D8C8', backgroundColor: '#FFF' }} />
                    </div>
                )}

                {displayGift && (
                    <div style={{
                        marginTop: '2.2rem', 
                        padding: '1.6rem', 
                        border: '1.5px solid #FFE5D9', 
                        backgroundColor: '#FAF3ED', 
                        borderRadius: '16px',
                        boxShadow: '0 6px 20px rgba(212,163,115,0.06)'
                    }}>
                        {isPhysical ? (
                            <div>
                                <h4 style={{color: '#8F5E36', margin: '0 0 0.5rem', fontFamily: 'var(--font-heading)', fontSize: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#8F5E36'}}>
                                        <polyline points="20 12 20 22 4 22 4 12" />
                                        <rect x="2" y="7" width="20" height="5" />
                                        <line x1="12" y1="22" x2="12" y2="7" />
                                        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                                        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                                    </svg>
                                    Free Gift Gained!
                                </h4>
                                <p style={{margin:0, fontSize:'0.92rem', color: '#6C6863', lineHeight: '1.5'}}>
                                    A complimentary bespoke <strong>{displayGift}</strong> has been contributed to your package and will dispatch in the same carton!
                                </p>
                            </div>
                        ) : (
                            <div>
                                <h4 style={{color: '#8F5E36', margin: '0 0 0.5rem', fontFamily: 'var(--font-heading)', fontSize: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#8F5E36'}}>
                                        <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707-.707M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
                                    </svg>
                                    Reward Coupon Unlocked!
                                </h4>
                                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', backgroundColor: '#FFF', border: '1px dashed #D4A373', borderRadius: '50px', padding: '0.45rem 1.2rem', marginTop: '0.6rem' }}>
                                    <strong style={{ fontSize: '1.1rem', fontFamily: 'monospace', color: '#8F5E36', letterSpacing: '0.08em' }}>{displayGift}</strong>
                                    <CopyButton text={displayGift} iconOnly={true} style={{ padding: '4px 7px', borderRadius: '50%', border: '1px solid #E6D8C8' }} />
                                </div>
                                {giftExpiryDate && (
                                    <div style={{ marginTop: '0.8rem' }}>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            color: '#B83232',
                                            fontWeight: '700',
                                            backgroundColor: '#FFF2F2',
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            display: 'inline-block',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em'
                                        }}>
                                            Valid Until: {new Date(giftExpiryDate).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
            
            <Link to="/" className="btn btn-primary" style={{
                padding: '1rem 3.5rem', 
                fontSize: '1rem', 
                fontWeight: '600',
                borderRadius: '50px',
                letterSpacing: '0.02em',
                boxShadow: '0 6px 20px rgba(45,42,38,0.1)'
            }}>Return to Storefront</Link>
        </div>
    );
};

const ProfilePage = ({ authUser }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [mode, setMode] = useState('create');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [successVisible, setSuccessVisible] = useState(false);
    const redirectTimer = useRef(null);
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        preferredSize: '',
        styleNotes: ''
    });

    const [addresses, setAddresses] = useState([]);
    const [addressForm, setAddressForm] = useState({ id: 0, fullName: '', phone: '', addressLine: '', city: '', state: '', zipCode: '' });
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [addressMessage, setAddressMessage] = useState('');
    
    // New states for client tabbed dashboard
    const [orders, setOrders] = useState([]);
    const [coupons, setCoupons] = useState([]);
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);

    const validateProfileForm = (cleaned) => {
        if (!cleaned.fullName || !cleaned.phone || !cleaned.address || !cleaned.city || !cleaned.state || !cleaned.zipCode) {
            return 'Please complete the required fields.';
        }
        if (!/^[A-Za-z][A-Za-z\s.'-]{1,79}$/.test(cleaned.fullName)) {
            return 'Please enter a valid full name.';
        }
        if (!/^\+?[0-9()\-\s]{8,15}$/.test(cleaned.phone)) {
            return 'Please enter a valid phone number.';
        }
        if (cleaned.address.length < 5) {
            return 'Please enter a complete address.';
        }
        if (cleaned.city.length < 2 || cleaned.state.length < 2) {
            return 'Please enter a valid city and state.';
        }
        if (!/^[A-Za-z0-9\-\s]{3,12}$/.test(cleaned.zipCode)) {
            return 'Please enter a valid ZIP or postal code.';
        }
        if (cleaned.styleNotes.length > 500) {
            return 'Style notes must be 500 characters or fewer.';
        }
        return '';
    };

    const loadAddresses = async () => {
        if (!authUser) return;
        try {
            const response = await fetch('/api/profile/addresses', {
                headers: { 'X-User-Id': authUser.uid }
            });
            if (response.ok) {
                const data = await response.json();
                setAddresses(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const loadOrdersAndCoupons = async () => {
        if (!authUser) return;
        try {
            const ordResponse = await fetch('/api/profile/orders', {
                headers: { 'X-User-Id': authUser.uid }
            });
            if (ordResponse.ok) {
                const data = await ordResponse.json();
                setOrders(data);
            }
            
            const copResponse = await fetch('/api/profile/coupons', {
                headers: { 'X-User-Id': authUser.uid }
            });
            if (copResponse.ok) {
                const data = await copResponse.json();
                setCoupons(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        setAddressMessage('');
        try {
            const response = await fetch('/api/profile/addresses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-Id': authUser.uid
                },
                body: JSON.stringify(addressForm)
            });
            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || 'Failed to save address');
            }
            setAddressForm({ id: 0, fullName: '', phone: '', addressLine: '', city: '', state: '', zipCode: '' });
            setShowAddressForm(false);
            loadAddresses();
        } catch (err) {
            setAddressMessage(err.message);
        }
    };

    const handleDeleteAddress = async (id) => {
        if (!confirm('Are you sure you want to delete this address?')) return;
        try {
            const response = await fetch(`/api/profile/addresses?id=${id}`, {
                method: 'DELETE',
                headers: { 'X-User-Id': authUser.uid }
            });
            if (response.ok) {
                loadAddresses();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSetDefaultAddress = async (id) => {
        try {
            const response = await fetch(`/api/profile/addresses?id=${id}`, {
                method: 'PATCH',
                headers: { 'X-User-Id': authUser.uid }
            });
            if (response.ok) {
                loadAddresses();
                // Also reload profile details since primary profile address is bidirectionally synced
                const profileRes = await fetch('/api/profile/me', {
                    headers: { 'X-User-Id': authUser.uid }
                });
                if (profileRes.ok) {
                    const profile = await profileRes.json();
                    setForm({
                        fullName: profile.fullName || '',
                        email: profile.email || authUser.email || '',
                        phone: profile.phone || '',
                        address: profile.address || '',
                        city: profile.city || '',
                        state: profile.state || '',
                        zipCode: profile.zipCode || '',
                        preferredSize: profile.preferredSize || '',
                        styleNotes: profile.styleNotes || ''
                    });
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (!authUser) return;

        const loadProfile = async () => {
            try {
                const response = await fetch('/api/profile/me', {
                    headers: { 'X-User-Id': authUser.uid }
                });
                if (response.status === 404) {
                    setMode('create');
                    setForm(f => ({ ...f, email: authUser.email || '' }));
                    setIsEditing(true);
                    setLoading(false);
                    return;
                }
                if (!response.ok) {
                    throw new Error('Unable to load profile');
                }
                const profile = await response.json();
                setForm({
                    fullName: profile.fullName || '',
                    email: profile.email || authUser.email || '',
                    phone: profile.phone || '',
                    address: profile.address || '',
                    city: profile.city || '',
                    state: profile.state || '',
                    zipCode: profile.zipCode || '',
                    preferredSize: profile.preferredSize || '',
                    styleNotes: profile.styleNotes || ''
                });
                setMode('edit');
                setIsEditing(false);
            } catch (error) {
                setMessage({ type: 'error', text: 'We could not load your profile right now.' });
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
        loadAddresses();
        loadOrdersAndCoupons();
    }, [authUser]);

    useEffect(() => () => {
        if (redirectTimer.current) {
            window.clearTimeout(redirectTimer.current);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!authUser || saving) {
            return;
        }

        const cleaned = {
            fullName: form.fullName.trim(),
            email: form.email || authUser.email || '',
            phone: form.phone.trim(),
            address: form.address.trim(),
            city: form.city.trim(),
            state: form.state.trim(),
            zipCode: form.zipCode.trim(),
            preferredSize: form.preferredSize.trim(),
            styleNotes: form.styleNotes.trim()
        };

        const validationError = validateProfileForm(cleaned);
        if (validationError) {
            setMessage({ type: 'error', text: validationError });
            setSuccessVisible(false);
            return;
        }

        setSaving(true);
        setSuccessVisible(false);
        setMessage({ type: '', text: '' });

        try {
            const response = await fetch('/api/profile/me', {
                method: mode === 'create' ? 'POST' : 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-Id': authUser.uid
                },
                body: JSON.stringify(cleaned)
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || 'Unable to save profile');
            }

            const profile = await response.json();
            setForm({
                fullName: profile.fullName || '',
                email: profile.email || authUser.email || '',
                phone: profile.phone || '',
                address: profile.address || '',
                city: profile.city || '',
                state: profile.state || '',
                zipCode: profile.zipCode || '',
                preferredSize: profile.preferredSize || '',
                styleNotes: profile.styleNotes || ''
            });
            setMode('edit');
            setIsEditing(false);
            setSuccessVisible(true);
            loadAddresses();
            redirectTimer.current = window.setTimeout(() => {
                setSuccessVisible(false);
            }, 3000);
        } catch (error) {
            setSuccessVisible(false);
            setMessage({ type: 'error', text: error.message || 'Profile could not be saved.' });
        } finally {
            setSaving(false);
        }
    };

    if (!authUser) {
        return (
            <div className="profile-shell">
                <div className="profile-card">
                    <p className="profile-eyebrow">Account</p>
                    <h1>Please sign in to view your profile</h1>
                    <p className="profile-help">Use the Sign In button in the header to continue.</p>
                    <a href="./login.html" className="btn btn-primary" style={{display:'inline-block', marginTop:'1.5rem'}}>Go to Sign In</a>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div style={{ padding: '10rem 5%', textAlign:'center', minHeight:'50vh', color: '#666' }}>
                <p>Loading your profile dashboard...</p>
            </div>
        );
    }

    return (
        <div style={{
            maxWidth: '1200px',
            margin: '8rem auto 4rem',
            padding: '0 1.5rem',
            minHeight: '80vh',
            fontFamily: 'var(--font-body)'
        }}>
            {/* Header Section */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                marginBottom: '2rem',
                background: '#fff',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
            }}>
                <div style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '50px',
                    background: 'linear-gradient(135deg, #e4b39b, #b97a66)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.8rem',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 10px rgba(185, 122, 102, 0.3)'
                }}>
                    {form.fullName ? form.fullName.trim().charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                    <h1 style={{
                        fontSize: '1.8rem',
                        fontFamily: 'var(--font-title)',
                        margin: 0,
                        color: '#333'
                    }}>
                        {form.fullName || 'Welcome to The Ethnic Touch'}
                    </h1>
                    <p style={{ margin: '0.2rem 0 0', color: '#666', fontSize: '0.95rem' }}>{authUser.email}</p>
                </div>
            </div>

            {/* Main Content Layout */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '260px 1fr',
                gap: '2rem'
            }} className="profile-dashboard-grid">
                
                {/* Sidemenu Panel */}
                <div style={{
                    background: '#fff',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                    height: 'fit-content'
                }}>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        <li 
                            onClick={() => { setActiveTab('profile'); setSuccessVisible(false); setMessage({ type: '', text: '' }); }}
                            style={{
                                padding: '1rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: activeTab === 'profile' ? '600' : 'normal',
                                backgroundColor: activeTab === 'profile' ? '#fff0e9' : 'transparent',
                                color: activeTab === 'profile' ? '#b97a66' : '#555',
                                transition: 'all 0.2s',
                                marginBottom: '0.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.8rem'
                            }}
                        >
                            My Profile
                        </li>
                        <li 
                            onClick={() => { setActiveTab('addresses'); setSuccessVisible(false); setMessage({ type: '', text: '' }); }}
                            style={{
                                padding: '1rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: activeTab === 'addresses' ? '600' : 'normal',
                                backgroundColor: activeTab === 'addresses' ? '#fff0e9' : 'transparent',
                                color: activeTab === 'addresses' ? '#b97a66' : '#555',
                                transition: 'all 0.2s',
                                marginBottom: '0.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.8rem'
                            }}
                        >
                            Shipping Addresses
                        </li>
                        <li 
                            onClick={() => { setActiveTab('orders'); setSuccessVisible(false); setMessage({ type: '', text: '' }); }}
                            style={{
                                padding: '1rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: activeTab === 'orders' ? '600' : 'normal',
                                backgroundColor: activeTab === 'orders' ? '#fff0e9' : 'transparent',
                                color: activeTab === 'orders' ? '#b97a66' : '#555',
                                transition: 'all 0.2s',
                                marginBottom: '0.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.8rem'
                            }}
                        >
                            Order History
                        </li>
                        <li 
                            onClick={() => { setActiveTab('coupons'); setSuccessVisible(false); setMessage({ type: '', text: '' }); }}
                            style={{
                                padding: '1rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: activeTab === 'coupons' ? '600' : 'normal',
                                backgroundColor: activeTab === 'coupons' ? '#fff0e9' : 'transparent',
                                color: activeTab === 'coupons' ? '#b97a66' : '#555',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.8rem'
                            }}
                        >
                            My Coupons
                        </li>
                        <li 
                            onClick={() => {
                                if (auth) {
                                    auth.signOut().then(() => {
                                        window.location.hash = "#/";
                                    });
                                }
                            }}
                            style={{
                                padding: '1rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '500',
                                backgroundColor: 'transparent',
                                color: '#d32f2f',
                                transition: 'all 0.2s',
                                marginTop: '1rem',
                                borderTop: '1px solid #f5f5f5',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.8rem'
                            }}
                            onMouseEnter={e => { e.target.style.backgroundColor = '#fdf2f2'; }}
                            onMouseLeave={e => { e.target.style.backgroundColor = 'transparent'; }}
                        >
                            Sign Out
                        </li>
                    </ul>
                </div>

                {/* Content Panel */}
                <div style={{
                    background: '#fff',
                    padding: '2.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                    minHeight: '400px'
                }}>
                    
                    {/* TAB: PROFILE */}
                    {activeTab === 'profile' && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #f0f0f0', paddingBottom: '1rem' }}>
                                <h2 style={{ fontFamily: 'var(--font-title)', margin: 0, fontSize: '1.4rem', color: '#333' }}>Account Profile</h2>
                                {mode === 'edit' && (
                                    <button 
                                        type="button"
                                        onClick={() => setIsEditing(!isEditing)}
                                        className="btn"
                                        style={{
                                            border: '1px solid #b97a66',
                                            color: '#b97a66',
                                            backgroundColor: isEditing ? '#fff0e9' : 'transparent',
                                            padding: '0.5rem 1.2rem',
                                            borderRadius: '6px',
                                            fontSize: '0.9rem',
                                            fontWeight: '500',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                                    </button>
                                )}
                            </div>

                            {message.text && (
                                <div style={{
                                    padding: '1rem',
                                    borderRadius: '6px',
                                    backgroundColor: message.type === 'error' ? '#fde8e8' : '#eafaf1',
                                    color: message.type === 'error' ? '#9b1c1c' : '#0e6245',
                                    marginBottom: '1.5rem',
                                    fontSize: '0.9rem'
                                }}>
                                    {message.text}
                                </div>
                            )}

                            {successVisible && (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '2rem 1rem',
                                    background: '#f4fbf7',
                                    border: '1px solid #c8e6c9',
                                    borderRadius: '8px',
                                    marginBottom: '1.5rem'
                                }}>
                                    <span style={{ fontSize: '3rem', color: '#2e7d32' }}>✓</span>
                                    <h4 style={{ margin: '0.5rem 0 0.2rem', color: '#2e7d32' }}>Profile Updated Successfully!</h4>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>Your profile has been saved.</p>
                                </div>
                            )}

                            {(!isEditing && mode === 'edit') ? (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                    <div>
                                        <label style={{ fontSize: '0.85rem', color: '#888', display: 'block', marginBottom: '0.2rem' }}>Full Name</label>
                                        <p style={{ fontSize: '1.05rem', color: '#333', fontWeight: '500', margin: 0 }}>{form.fullName || '-'}</p>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.85rem', color: '#888', display: 'block', marginBottom: '0.2rem' }}>Email Address</label>
                                        <p style={{ fontSize: '1.05rem', color: '#333', fontWeight: '500', margin: 0 }}>{form.email || '-'}</p>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.85rem', color: '#888', display: 'block', marginBottom: '0.2rem' }}>Phone Number</label>
                                        <p style={{ fontSize: '1.05rem', color: '#333', fontWeight: '500', margin: 0 }}>{form.phone || '-'}</p>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.85rem', color: '#888', display: 'block', marginBottom: '0.2rem' }}>ZIP / Postal Code</label>
                                        <p style={{ fontSize: '1.05rem', color: '#333', fontWeight: '500', margin: 0 }}>{form.zipCode || '-'}</p>
                                    </div>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={{ fontSize: '0.85rem', color: '#888', display: 'block', marginBottom: '0.2rem' }}>Primary Shipping Address</label>
                                        <p style={{ fontSize: '1.05rem', color: '#333', fontWeight: '500', margin: 0 }}>
                                            {form.address ? `${form.address}, ${form.city}, ${form.state} - ${form.zipCode}` : '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.85rem', color: '#888', display: 'block', marginBottom: '0.2rem' }}>Preferred Size</label>
                                        <p style={{ fontSize: '1.05rem', color: '#333', fontWeight: '500', margin: 0 }}>{form.preferredSize || 'Not set'}</p>
                                    </div>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={{ fontSize: '0.85rem', color: '#888', display: 'block', marginBottom: '0.2rem' }}>Style Preferences & Notes</label>
                                        <p style={{ fontSize: '1.05rem', color: '#333', margin: 0, whiteSpace: 'pre-wrap', lineHeight: '1.4' }}>{form.styleNotes || 'None added'}</p>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', color: '#555' }}>Email Address (Required)</label>
                                        <input 
                                            type="email" 
                                            value={form.email} 
                                            readOnly 
                                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', backgroundColor: '#f9f9f9', color: '#777', outline: 'none' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', color: '#555' }}>Full Name *</label>
                                        <input 
                                            type="text" 
                                            required 
                                            placeholder="Enter your full name"
                                            value={form.fullName}
                                            onChange={e => setForm({ ...form, fullName: e.target.value })}
                                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', outline: 'none' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', color: '#555' }}>Phone Number *</label>
                                        <input 
                                            type="tel" 
                                            required 
                                            placeholder="10-digit number"
                                            value={form.phone}
                                            onChange={e => setForm({ ...form, phone: e.target.value })}
                                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', outline: 'none' }}
                                        />
                                    </div>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', color: '#555' }}>Shipping Address Line *</label>
                                        <input 
                                            type="text" 
                                            required 
                                            placeholder="Apartment, Street Address"
                                            value={form.address}
                                            onChange={e => setForm({ ...form, address: e.target.value })}
                                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', outline: 'none' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', color: '#555' }}>City *</label>
                                        <input 
                                            type="text" 
                                            required 
                                            placeholder="City Name"
                                            value={form.city}
                                            onChange={e => setForm({ ...form, city: e.target.value })}
                                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', outline: 'none' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', color: '#555' }}>State *</label>
                                        <input 
                                            type="text" 
                                            required 
                                            placeholder="State Name"
                                            value={form.state}
                                            onChange={e => setForm({ ...form, state: e.target.value })}
                                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', outline: 'none' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', color: '#555' }}>ZIP / Postal Code *</label>
                                        <input 
                                            type="text" 
                                            required 
                                            placeholder="6-digit PIN code"
                                            value={form.zipCode}
                                            onChange={e => setForm({ ...form, zipCode: e.target.value })}
                                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', outline: 'none' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', color: '#555' }}>Preferred Sizing (Optional)</label>
                                        <select 
                                            value={form.preferredSize} 
                                            onChange={e => setForm({ ...form, preferredSize: e.target.value })}
                                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', outline: 'none', backgroundColor: '#fff' }}
                                        >
                                            <option value="">Choose Sizing</option>
                                            <option value="XS">XS</option>
                                            <option value="S">S</option>
                                            <option value="M">M</option>
                                            <option value="L">L</option>
                                            <option value="XL">XL</option>
                                        </select>
                                    </div>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', color: '#555' }}>Style Preferences & Special Instructions</label>
                                        <textarea 
                                            rows="3" 
                                            placeholder="Tell us what fit, patterns or fabrics you love"
                                            value={form.styleNotes}
                                            onChange={e => setForm({ ...form, styleNotes: e.target.value })}
                                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', outline: 'none', resize: 'none' }}
                                        />
                                    </div>
                                    <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
                                        <button 
                                            type="submit" 
                                            className="btn btn-primary"
                                            disabled={saving}
                                            style={{ padding: '0.8rem 2.5rem', width: '100%' }}
                                        >
                                            {saving ? 'Saving...' : (mode === 'create' ? 'Create Profile' : 'Save Details')}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}

                    {/* TAB: ADDRESSES */}
                    {activeTab === 'addresses' && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #f0f0f0', paddingBottom: '1rem' }}>
                                <h2 style={{ fontFamily: 'var(--font-title)', margin: 0, fontSize: '1.4rem', color: '#333' }}>Saved Addresses Book</h2>
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setAddressForm({ id: 0, fullName: '', phone: '', addressLine: '', city: '', state: '', zipCode: '' });
                                        setAddressMessage('');
                                        setShowAddressForm(!showAddressForm);
                                    }}
                                    className="btn btn-primary" 
                                    style={{ padding: '0.5rem 1.2rem', borderRadius: '6px', fontSize: '0.9rem' }}
                                >
                                    {showAddressForm ? 'Close Form' : '+ Add Address'}
                                </button>
                            </div>

                            {showAddressForm && (
                                <form onSubmit={handleAddressSubmit} style={{ 
                                    background: '#fafafa', 
                                    padding: '1.5rem', 
                                    borderRadius: '8px', 
                                    border: '1px solid #eee',
                                    marginBottom: '2rem',
                                    display: 'grid', 
                                    gridTemplateColumns: '1fr 1fr', 
                                    gap: '1rem' 
                                }}>
                                    <h4 style={{ gridColumn: 'span 2', margin: '0 0 0.5rem', fontFamily: 'var(--font-title)', fontSize: '1.1rem' }}>
                                        {addressForm.id > 0 ? 'Edit Shipping Address' : 'New Shipping Address'}
                                    </h4>
                                    
                                    {addressMessage && <p style={{ gridColumn: 'span 2', color: 'red', margin: 0, fontSize: '0.85rem' }}>{addressMessage}</p>}

                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#666', marginBottom: '0.2rem' }}>Full Name *</label>
                                        <input type="text" required value={addressForm.fullName} onChange={e => setAddressForm({...addressForm, fullName: e.target.value})} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#666', marginBottom: '0.2rem' }}>Contact Phone *</label>
                                        <input type="text" required value={addressForm.phone} onChange={e => setAddressForm({...addressForm, phone: e.target.value})} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                                    </div>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#666', marginBottom: '0.2rem' }}>Address Line *</label>
                                        <input type="text" required value={addressForm.addressLine} onChange={e => setAddressForm({...addressForm, addressLine: e.target.value})} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#666', marginBottom: '0.2rem' }}>City *</label>
                                        <input type="text" required value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#666', marginBottom: '0.2rem' }}>State *</label>
                                        <input type="text" required value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#666', marginBottom: '0.2rem' }}>ZIP Code *</label>
                                        <input type="text" required value={addressForm.zipCode} onChange={e => setAddressForm({...addressForm, zipCode: e.target.value})} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                                    </div>
                                    <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                                        <button type="button" onClick={() => setShowAddressForm(false)} className="btn-secondary" style={{ padding: '0.5rem 1rem', borderRadius: '4px', fontSize: '0.85rem' }}>Cancel</button>
                                        <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1rem', borderRadius: '4px', fontSize: '0.85rem' }}>Save Address</button>
                                    </div>
                                </form>
                            )}

                            {addresses.length === 0 ? (
                                <p style={{ color: '#888', textAlign: 'center', marginTop: '2rem' }}>No shipping addresses added yet.</p>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                                    {addresses.map(addr => (
                                        <div key={addr.id} style={{
                                            border: '1px solid #eee',
                                            padding: '1.5rem',
                                            borderRadius: '8px',
                                            position: 'relative',
                                            backgroundColor: addr.isDefault ? '#fffcf9' : '#fff',
                                            borderColor: addr.isDefault ? '#e4b39b' : '#eee'
                                        }}>
                                            {addr.isDefault && (
                                                <span style={{
                                                    position: 'absolute', top: '12px', right: '12px',
                                                    fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px',
                                                    background: '#e4b39b', color: '#fff', padding: '2px 8px', borderRadius: '10px',
                                                    fontWeight: '600'
                                                }}>Default</span>
                                            )}
                                            <h4 style={{ margin: '0 0 0.5rem', fontSize: '1rem', fontFamily: 'var(--font-title)' }}>{addr.fullName}</h4>
                                            <p style={{ margin: '0 0 0.2rem', fontSize: '0.85rem', color: '#666', lineHeight: '1.4' }}>{addr.addressLine}</p>
                                            <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', color: '#666' }}>{addr.city}, {addr.state} - {addr.zipCode}</p>
                                            <p style={{ margin: '0 0 1rem', fontSize: '0.85rem', color: '#555', fontWeight: '500' }}>Phone: {addr.phone}</p>
                                            
                                            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', borderTop: '1px solid #f5f5f5', paddingTop: '0.8rem' }}>
                                                {!addr.isDefault && (
                                                    <button type="button" onClick={() => handleSetDefaultAddress(addr.id)} style={{ background: 'none', border: 'none', color: '#b97a66', fontWeight: '500', cursor: 'pointer', padding: 0 }}>Set Default</button>
                                                )}
                                                <button type="button" onClick={() => {
                                                    setAddressForm({
                                                        id: addr.id,
                                                        fullName: addr.fullName,
                                                        phone: addr.phone,
                                                        addressLine: addr.addressLine,
                                                        city: addr.city,
                                                        state: addr.state,
                                                        zipCode: addr.zipCode
                                                    });
                                                    setAddressMessage('');
                                                    setShowAddressForm(true);
                                                }} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', padding: 0 }}>Edit</button>
                                                <button type="button" onClick={() => handleDeleteAddress(addr.id)} style={{ background: 'none', border: 'none', color: '#d32f2f', cursor: 'pointer', padding: 0 }}>Delete</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAB: ORDERS */}
                    {activeTab === 'orders' && (
                        <div>
                            <h2 style={{ fontFamily: 'var(--font-title)', marginBottom: '1.5rem', fontSize: '1.4rem', borderBottom: '1px solid #f0f0f0', paddingBottom: '1rem' }}>Order History</h2>
                            {orders.length === 0 ? (
                                <p style={{ color: '#888', textAlign: 'center', marginTop: '2rem' }}>You have not placed any orders yet.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {orders.map(order => (
                                        <div key={order.id} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '1.5rem', backgroundColor: '#fafafa' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.8rem', marginBottom: '1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                                    <span style={{ fontSize: '0.8rem', color: '#888' }}>Order ID:</span>
                                                    <span style={{ fontWeight: '600', fontFamily: 'monospace', fontSize: '0.95rem' }}>{order.id}</span>
                                                    <CopyButton text={order.id} label="Copy ID" />
                                                </div>
                                                <div>
                                                    <span style={{ fontSize: '0.85rem', color: '#b97a66', fontWeight: '500', textTransform: 'uppercase' }}>{order.status}</span>
                                                </div>
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                                                <div>
                                                    <h5 style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', color: '#888', textTransform: 'uppercase' }}>Items</h5>
                                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                                        {order.items && order.items.map((it, idx) => {
                                                             const qty = it.quantity || 1;
                                                             const unitPrice = it.priceAtQty || 0;
                                                             const lineTotal = unitPrice * qty;
                                                             return (
                                                                 <li key={it.productId || idx} style={{ fontSize: '0.9rem', color: '#333', padding: '0.4rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                     <div>
                                                                         <span>{it.productName || it.productId}</span>
                                                                         {it.size && (
                                                                             <span style={{ fontSize: '0.75rem', background: '#fff0e9', color: '#b97a66', padding: '1px 6px', borderRadius: '4px', marginLeft: '6px', fontWeight: '500' }}>
                                                                                 Size: {it.size}
                                                                             </span>
                                                                         )}
                                                                         <strong style={{ marginLeft: '6px', color: '#555' }}>x {qty}</strong>
                                                                     </div>
                                                                     <div style={{ textAlign: 'right' }}>
                                                                         <span style={{ fontWeight: '500' }}>₹{lineTotal.toLocaleString('en-IN')}</span>
                                                                         {qty > 1 && (
                                                                             <span style={{ display: 'block', fontSize: '0.75rem', color: '#888' }}>
                                                                                 (₹{unitPrice.toLocaleString('en-IN')} each)
                                                                             </span>
                                                                         )}
                                                                     </div>
                                                                 </li>
                                                             );
                                                         })}
                                                    </ul>
                                                </div>
                                                <div style={{ borderLeft: '1px solid #eee', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                    <div style={{ marginBottom: '0.5rem' }}>
                                                        <span style={{ fontSize: '0.8rem', color: '#888' }}>Date:</span>
                                                        <span style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500' }}>{new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                                                    </div>
                                                    <div>
                                                        <span style={{ fontSize: '0.8rem', color: '#888' }}>Total Amount Paid:</span>
                                                        <span style={{ display: 'block', fontSize: '1.15rem', color: '#b97a66', fontWeight: '600' }}>₹{order.totalAmount.toLocaleString('en-IN')}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {order.trackingNumber && (
                                                <div style={{ marginTop: '1rem', background: '#eaf3fc', padding: '0.75rem 1rem', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                    <span style={{ fontSize: '0.85rem', color: '#1a5695' }}>
                                                        Shipping Carrier Tracking Number: <strong style={{ fontFamily: 'monospace' }}>{order.trackingNumber}</strong>
                                                    </span>
                                                    <CopyButton text={order.trackingNumber} label="Copy Tracking ID" />
                                                </div>
                                            )}

                                            {order.unlockedGift && (
                                                <div style={{ marginTop: '0.8rem', background: '#fff9e6', padding: '0.75rem 1rem', border: '1px dashed #fcd34d', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                    <span style={{ fontSize: '0.85rem', color: '#854d0e' }}>
                                                        Reward Unlocked: <strong>{order.unlockedGift}</strong>
                                                    </span>
                                                    <CopyButton text={order.unlockedGift} label="Copy Code" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAB: COUPONS */}
                    {activeTab === 'coupons' && (
                        <div>
                            <h2 style={{ fontFamily: 'var(--font-title)', marginBottom: '1.5rem', fontSize: '1.4rem', borderBottom: '1px solid #f0f0f0', paddingBottom: '1rem' }}>My Loyalty Coupons</h2>
                            {coupons.length === 0 ? (
                                <p style={{ color: '#888', textAlign: 'center', marginTop: '2rem' }}>No dynamic coupons issued to your email yet.</p>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '1.4rem' }}>
                                    {coupons.map(c => (
                                        <div key={c.id} style={{
                                            border: '2px dashed #e4b39b',
                                            padding: '1.3rem 1rem',
                                            borderRadius: '12px',
                                            backgroundColor: '#fffcf9',
                                            textAlign: 'center',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
                                        }}>
                                            <div style={{
                                                position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
                                                background: 'linear-gradient(90deg, #e4b39b, #b97a66)'
                                            }} />
                                            
                                            {/* Code & Icon-Only Copy Button Container */}
                                            <div style={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center', 
                                                gap: '0.4rem',
                                                margin: '0.4rem 0 0.8rem',
                                                backgroundColor: '#ffffff',
                                                border: '1px dashed #e4b39b',
                                                borderRadius: '8px',
                                                padding: '0.4rem 0.6rem'
                                            }}>
                                                <strong style={{
                                                    fontSize: '1.05rem',
                                                    fontFamily: 'monospace',
                                                    color: '#b97a66',
                                                    letterSpacing: '1px',
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    {c.code}
                                                </strong>
                                                <CopyButton text={c.code} iconOnly={true} style={{ padding: '4px 6px', borderRadius: '4px' }} />
                                            </div>
                                            
                                            {/* Offer Amount */}
                                            <h4 style={{ margin: '0.5rem 0 0.2rem', fontSize: '1.35rem', fontFamily: 'var(--font-title)', color: '#2D2A26', fontWeight: '700' }}>
                                                {c.type === 'percentage' ? `${c.value}% OFF` : `₹${c.value} OFF`}
                                            </h4>
                                            
                                            <p style={{ margin: '0 0 0.5rem', fontSize: '0.78rem', color: '#777' }}>
                                                Min order of ₹{c.minOrder.toLocaleString('en-IN')}
                                            </p>

                                            {/* Expiry Badge */}
                                            {(() => {
                                                if (!c.expiryDate) return null;
                                                const expiryDate = new Date(c.expiryDate);
                                                const today = new Date();
                                                today.setHours(0,0,0,0);
                                                expiryDate.setHours(0,0,0,0);
                                                
                                                const diffTime = expiryDate.getTime() - today.getTime();
                                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                                
                                                let badgeColor = '#666';
                                                let text = '';
                                                
                                                if (diffDays < 0) {
                                                    badgeColor = '#ef4444';
                                                    text = `Expired on ${new Date(c.expiryDate).toLocaleDateString()}`;
                                                } else if (diffDays === 0) {
                                                    badgeColor = '#d97706';
                                                    text = 'Expires today!';
                                                } else if (diffDays === 1) {
                                                    badgeColor = '#d97706';
                                                    text = 'Expires tomorrow!';
                                                } else if (diffDays <= 7) {
                                                    badgeColor = '#d97706';
                                                    text = `Expires in ${diffDays} days`;
                                                } else {
                                                    badgeColor = '#15803d';
                                                    text = `Expires in ${diffDays} days`;
                                                }
                                                
                                                return (
                                                    <div style={{ 
                                                        margin: '0.3rem auto 0', 
                                                        fontSize: '0.72rem', 
                                                        padding: '3px 8px', 
                                                        borderRadius: '4px',
                                                        backgroundColor: badgeColor + '10',
                                                        color: badgeColor,
                                                        fontWeight: '600',
                                                        display: 'inline-block' 
                                                    }}>
                                                        {text}
                                                    </div>
                                                );
                                            })()}

                                            {/* Status & Usage Bar */}
                                            <div style={{
                                                marginTop: '0.8rem',
                                                paddingTop: '0.6rem',
                                                borderTop: '1px dashed #eee',
                                                fontSize: '0.78rem',
                                                color: '#555'
                                            }}>
                                                <div>Status: <strong style={{ color: c.isActive ? '#15803d' : '#b91c1c' }}>{c.isActive ? 'Active' : 'Redeemed'}</strong></div>
                                                <div style={{ fontSize: '0.74rem', color: '#777', marginTop: '0.15rem' }}>
                                                    Used: {c.usedCount} / {c.usageLimit} times
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

// --- MAIN APP ---

const ScrollToTop = () => {
    const { pathname } = ReactRouterDOM.useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

const App = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState([]);
    const [discount, setDiscount] = useState(null);
    const [authUser, setAuthUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [toastProduct, setToastProduct] = useState(null);
    const toastTimerRef = useRef(null);

    const [wishlist, setWishlist] = useState([]);
    const [globalSearch, setGlobalSearch] = useState('');

    const [alertState, setAlertState] = useState({ isOpen: false, title: '', message: '', type: 'warning' });

    const triggerAlert = (message, title = "Notice", type = "warning") => {
        setAlertState({ isOpen: true, title, message, type });
    };

    const closeAlert = () => {
        setAlertState(prev => ({ ...prev, isOpen: false }));
    };

    useEffect(() => {
        window.customAlert = triggerAlert;
    }, []);

    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                console.log("Using local fallback data.");
                setProducts(fallbackProducts);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (!auth) {
            setAuthLoading(false);
            return;
        }

        const unsubscribe = auth.onAuthStateChanged((user) => {
            setAuthUser(user);
            setAuthLoading(false);
        });

        return unsubscribe;
    }, []);

    // Sync wishlist from Database or Guest Local Storage
    useEffect(() => {
        const syncWishlist = async () => {
            if (authUser) {
                // Merge guest wishlist
                const local = localStorage.getItem('tet_guest_wishlist');
                if (local) {
                    try {
                        const parsed = JSON.parse(local);
                        if (Array.isArray(parsed) && parsed.length > 0) {
                            const ids = parsed.map(p => p.id);
                            await fetch('/api/wishlist/merge', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'X-User-Id': authUser.uid
                                },
                                body: JSON.stringify({ productIds: ids })
                            });
                        }
                    } catch (e) {
                        console.error("Merge error:", e);
                    } finally {
                        localStorage.removeItem('tet_guest_wishlist');
                    }
                }

                // Load from database persist layer
                try {
                    const res = await fetch('/api/wishlist', {
                        headers: { 'X-User-Id': authUser.uid }
                    });
                    if (res.ok) {
                        const items = await res.json();
                        setWishlist(items || []);
                    }
                } catch (e) {
                    console.error("Fetch wishlist error:", e);
                }
            } else {
                const local = localStorage.getItem('tet_guest_wishlist');
                if (local) {
                    try {
                        setWishlist(JSON.parse(local) || []);
                    } catch (e) {
                        setWishlist([]);
                    }
                } else {
                    setWishlist([]);
                }
            }
        };

        if (!authLoading) {
            syncWishlist();
        }
    }, [authUser, authLoading]);

    const toggleWishlist = async (product) => {
        const isWished = wishlist.some(item => item.id === product.id);
        let updated;
        if (isWished) {
            updated = wishlist.filter(item => item.id !== product.id);
        } else {
            updated = [...wishlist, product];
        }
        setWishlist(updated);

        if (authUser) {
            try {
                if (isWished) {
                    await fetch(`/api/wishlist?productId=${product.id}`, {
                        method: 'DELETE',
                        headers: { 'X-User-Id': authUser.uid }
                    });
                } else {
                    await fetch('/api/wishlist', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-User-Id': authUser.uid
                        },
                        body: JSON.stringify({ productId: product.id })
                    });
                }
            } catch (e) {
                console.error("DB wishlist toggle error:", e);
            }
        } else {
            localStorage.setItem('tet_guest_wishlist', JSON.stringify(updated));
        }
    };

    const addToCart = (product) => {
        const prodQty = product.quantity || 1;
        const targetSize = product.size || '';

        setCart(prev => {
            const existingIndex = prev.findIndex(item => item.id === product.id && (item.size || '') === targetSize);
            if (existingIndex > -1) {
                const updated = [...prev];
                const currentItem = updated[existingIndex];
                updated[existingIndex] = {
                    ...currentItem,
                    quantity: (currentItem.quantity || 1) + prodQty
                };
                return updated;
            } else {
                return [...prev, { ...product, quantity: prodQty }];
            }
        });

        triggerLocalConfetti();

        if (toastTimerRef.current) {
            window.clearTimeout(toastTimerRef.current);
        }
        setToastProduct(product);
        toastTimerRef.current = window.setTimeout(() => {
            setToastProduct(null);
        }, 5500);
    };

    const updateQuantity = (index, newQty) => {
        if (newQty <= 0) {
            removeFromCart(index);
            return;
        }
        setCart(prev => {
            const updated = [...prev];
            if (updated[index]) {
                updated[index] = { ...updated[index], quantity: newQty };
            }
            return updated;
        });
    };

    const removeFromCart = (index) => {
        setCart(prev => prev.filter((_, idx) => idx !== index));
    };

    const clearCart = () => {
        setCart([]);
        setDiscount(null);
    };

    const handleSearchSubmit = (q) => {
        setGlobalSearch(q);
        if (window.location.hash !== "#/shop") {
            window.location.hash = "#/shop";
        }
    };

    const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

    return (
        <HashRouter>
            <ScrollToTop />
            <Navbar 
                products={products}
                cartCount={cartCount} 
                wishlistCount={wishlist.length} 
                authUser={authUser} 
                authLoading={authLoading} 
                onSearchSubmit={handleSearchSubmit}
                globalSearch={globalSearch}
                setGlobalSearch={setGlobalSearch}
            />
            <Routes>
                <Route 
                    path="/" 
                    element={
                        <Home 
                            productsGlobal={products}
                            wishlist={wishlist}
                            toggleWishlist={toggleWishlist}
                        />
                    } 
                />
                <Route 
                    path="/shop" 
                    element={
                        <Shop 
                            productsGlobal={products}
                            wishlist={wishlist}
                            toggleWishlist={toggleWishlist}
                            globalSearch={globalSearch}
                            setGlobalSearch={setGlobalSearch}
                        />
                    } 
                />

                <Route path="/product/:id" element={<ProductDetails products={products} addToCart={addToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} authUser={authUser} />} />
                <Route path="/cart" element={<Cart cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} onApplyCoupon={setDiscount} discount={discount} />} />
                <Route path="/checkout" element={<Checkout cart={cart} discount={discount} clearCart={clearCart} authUser={authUser} />} />
                <Route path="/mock-payment" element={<MockPayment onPaymentSuccess={clearCart} />} />
                <Route path="/checkout-success" element={<CheckoutSuccess />} />
                <Route path="/profile" element={<ProfilePage authUser={authUser} />} />
                <Route 
                    path="/wishlist" 
                    element={
                        <WishlistPage 
                            wishlist={wishlist}
                            toggleWishlist={toggleWishlist}
                            addToCart={addToCart}
                        />
                    } 
                />
            </Routes>
            <Footer />

            {/* Premium Toast Drawer Notification */}
            {toastProduct && (
                <div className="cart-success-notification show">
                    <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-start', marginBottom: '1.2rem' }}>
                        <div style={{ width: '60px', height: '80px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0, boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                            <img src={toastProduct.imageUrl} alt={toastProduct.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '4px' }}>
                                ✓ Added to Wardrobe
                            </div>
                            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '600', color: 'var(--color-text)', lineHeight: '1.4' }}>{toastProduct.name}</h4>
                            <div style={{ fontSize: '0.85rem', color: '#686461', marginTop: '3px' }}>
                                Size: <strong style={{color:'var(--color-text)'}}>{toastProduct.size || 'Standard'}</strong> &bull; ₹{toastProduct.price.toLocaleString('en-IN')}
                            </div>
                        </div>
                        <button 
                            onClick={() => setToastProduct(null)} 
                            style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#ccc', padding: 0, lineHeight: 0 }}
                            aria-label="Close notification"
                        >
                            &times;
                        </button>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.8rem' }}>
                        <button 
                            onClick={() => setToastProduct(null)} 
                            className="btn" 
                            style={{ flex: 1, padding: '0.75rem', fontSize: '0.85rem', background: '#fafafa', color: '#555', border: '1px solid #e0e0e0', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
                        >
                            Continue Shopping
                        </button>
                        <a 
                            href="#/cart" 
                            onClick={() => setToastProduct(null)} 
                            className="btn btn-primary" 
                            style={{ flex: 1, padding: '0.75rem', fontSize: '0.85rem', textAlign: 'center', textDecoration: 'none', borderRadius: '6px', fontWeight: '600', display: 'block', boxSizing: 'border-box' }}
                        >
                            Checkout
                        </a>
                    </div>
                </div>
            )}

            <PremiumAlertModal 
                isOpen={alertState.isOpen} 
                onClose={closeAlert} 
                title={alertState.title} 
                message={alertState.message} 
                type={alertState.type} 
            />
        </HashRouter>
    );
};

// --- CUSTOM confetti particle fx emitter ---
function triggerLocalConfetti() {
    let canvas = document.getElementById('confetti-canvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'confetti-canvas';
        document.body.appendChild(canvas);
    }
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');

    const colors = [
        '#e4b39b', // Peach
        '#d4af37', // Gold
        '#ebd7cb', // Light Cream
        '#8c8883', // Secondary styling
        '#c68b59'  // Muted bronze
    ];

    const particles = [];
    // Spawn particles rising up in arcs
    for (let i = 0; i < 90; i++) {
        particles.push({
            x: window.innerWidth / 2,
            y: window.innerHeight * 0.75,
            size: Math.random() * 8 + 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            vx: (Math.random() - 0.5) * 16,
            vy: (Math.random() - 0.7) * 16 - 6,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 8,
            opacity: 1,
            shape: Math.random() > 0.55 ? 'circle' : 'square'
        });
    }

    function animateConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let active = false;

        particles.forEach(p => {
            if (p.opacity > 0) {
                active = true;
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.4; // gravity
                p.vx *= 0.98; // friction
                p.rotation += p.rotationSpeed;
                p.opacity -= 0.014; // decay rate

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation * Math.PI / 180);
                ctx.globalAlpha = Math.max(p.opacity, 0);
                ctx.fillStyle = p.color;

                if (p.shape === 'circle') {
                    ctx.beginPath();
                    ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                }
                ctx.restore();
            }
        });

        if (active) {
            requestAnimationFrame(animateConfetti);
        } else {
            if (canvas.parentNode) {
                canvas.parentNode.removeChild(canvas);
            }
        }
    }
    animateConfetti();
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
