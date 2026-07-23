import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate, Link, useLocation, useParams, Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import Cart from '../pages/Cart';
import Home from '../pages/Home';
import Shop from '../pages/Shop';

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
                        <li><Link to="/auth" className="nav-links-signin">Sign In</Link></li>
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
                                    <Link to="/auth" onClick={() => setMobileMenuOpen(false)} className="mobile-drawer-item">
                                        <div className="drawer-item-icon">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
                                        </div>
                                        <span className="drawer-item-label">Sign In / Register</span>
                                    </Link>
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

export default Navbar;
