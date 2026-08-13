import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate, Link, useLocation, useParams, Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import RenderProductCard from '../components/ProductCard';
import ProductSkeletonGrid from '../components/ProductSkeletonGrid';
import Shop from './Shop';

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
                    <span className="hero-subtitle">Handcrafted Luxury</span>
                    <h1>Minimalist Indo-Western Silhouette</h1>
                    <p>A curated destination for timeless pastel aesthetics, tailored meticulously with pure breathable fabrics for the contemporary woman.</p>
                    <Link to="/shop" className="btn btn-primary">Browse Shop</Link>
                </div>
                <div className="hero-image">
                    <img src="./images/hero_banner.png" alt="Premium Indo-Western Pastel Kurthi Fashion Model" />
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
                    <ProductSkeletonGrid count={4} />
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

            {/* Spin and Win Floating Button */}
            <Link 
                to="/spin-and-win" 
                style={{
                    position: 'fixed',
                    bottom: '30px',
                    right: '30px',
                    backgroundColor: 'var(--color-primary)',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '50px',
                    boxShadow: '0 4px 15px rgba(212, 163, 115, 0.4)',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    zIndex: 100,
                    animation: 'pulse 2s infinite',
                }}
            >
                <span style={{fontSize: '1.2rem'}}>🎁</span> Spin & Win
            </Link>
        </div>
    );
};

export default Home;
