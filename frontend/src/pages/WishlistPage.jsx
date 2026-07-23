import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate, Link, useLocation, useParams, Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import Cart from './Cart';
import Shop from './Shop';

const WishlistPage = ({ wishlist, toggleWishlist, addToCart }) => {

    return (
        <div className="wishlist-page-container" style={{ padding: '1.25rem 5% 3rem', maxWidth: '1200px', margin: '0 auto', minHeight: '75vh' }}>
            <div className="wishlist-header-row" style={{ marginBottom: '1.25rem' }}>
                <div>
                    <span className="profile-eyebrow" style={{ fontSize: '0.75rem' }}>Wardrobe Selection</span>
                    <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)', fontWeight: '400', margin: '0.15rem 0 0', fontSize: '1.35rem' }}>Your Wishlist</h1>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#686461' }}>
                    {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
                </div>
            </div>

            {wishlist.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#FFFdfc', borderRadius: '12px', border: '1px dashed var(--color-peach)', maxWidth: '600px', margin: '1rem auto' }}>
                    <svg viewBox="0 0 24 24" width="40" height="40" stroke="var(--color-primary)" strokeWidth="1.5" fill="none" style={{ marginBottom: '1rem' }}>
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: '400', marginBottom: '0.4rem', fontSize: '1.35rem' }}>Your wishlist is empty</h2>
                    <p style={{ margin: '0 auto 1.25rem', fontSize: '0.88rem', color: '#686461' }}>Explore our premium collections and tap the heart icon to save products here.</p>
                    <Link to="/shop" className="btn btn-primary" style={{ textDecoration: 'none', padding: '0.6rem 1.8rem', fontSize: '0.85rem', borderRadius: '50px' }}>Shop the Collection</Link>
                </div>
            ) : (
                <div className="product-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '1.25rem' }}>
                    {wishlist.map(p => {
                        const handleQuickAddToCart = (e) => {
                            e.preventDefault();
                            const defaultSz = (p.sizes && p.sizes.length > 0) ? p.sizes[0] : 'S';
                            addToCart({ ...p, size: defaultSz });
                        };

                        return (
                            <div key={p.id} style={{ position: 'relative' }}>
                                <div className="product-card" style={{ padding: '0.65rem' }}>
                                    <Link to={`/product/${p.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                                        <div className="product-image-container" style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden' }}>
                                            <div className="wishlist-heart-btn active" onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                toggleWishlist(p);
                                            }} style={{ top: '10px', right: '10px', width: '32px', height: '32px' }}>
                                                <svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                                            </div>
                                            <img src={p.imageUrl} alt={p.name} className="product-image" style={{ aspectRatio: '3/4', objectFit: 'cover' }} />
                                        </div>
                                        <div className="product-info" style={{ marginTop: '0.6rem', marginBottom: '0.75rem' }}>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <h3 className="product-name" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.88rem', margin: '0 0 0.2rem' }}>{p.name}</h3>
                                                <div className="product-price" style={{ fontSize: '0.9rem', fontWeight: '600' }}>₹{p.price.toLocaleString('en-IN')}</div>
                                            </div>
                                        </div>
                                    </Link>
                                    <button 
                                        onClick={handleQuickAddToCart}
                                        className="btn btn-primary"
                                        style={{ width: '100%', borderRadius: '50px', padding: '0.5rem', fontSize: '0.8rem', fontWeight: '600' }}
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
