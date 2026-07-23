import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate, Link, useLocation, useParams, Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import Cart from './Cart';
import Shop from './Shop';

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

export default WishlistPage;
