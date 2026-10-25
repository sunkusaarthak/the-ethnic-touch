import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Heart, Eye, ShoppingBag, X, ExternalLink, Loader2, Check } from 'lucide-react';
import { featuredReels as defaultReels, INSTAGRAM_HANDLE, INSTAGRAM_PROFILE_URL } from '../../data/instagramReels';
import ImageWithSkeleton from '../ImageWithSkeleton';
import { getOptimizedImageUrl } from '../../utils/imageHelper';

const InstagramIcon = ({ size = 18, color = 'currentColor', ...props }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        {...props}
    >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
);

const DEFAULT_FALLBACK_SIZES = ['XS', 'S', 'M', 'L', 'XL'];

const extractReelCode = (url) => {
    if (!url) return '';
    const match = url.match(/\/reel\/([A-Za-z0-9_-]+)/);
    return match ? match[1] : '';
};

const normalizeReel = (r, productsGlobal = []) => {
    const isHit = r.isHitReel !== undefined ? r.isHitReel : (r.is_hit_reel !== undefined ? r.is_hit_reel : false);
    const prodId = r.productId || r.product_id || (r.product ? r.product.id : '');
    const matchedProduct = (productsGlobal || []).find(p => String(p.id) === String(prodId));
    const instaUrl = r.instagramUrl || r.instagram_url || 'https://www.instagram.com/theethnictouch.co';
    const reelCode = r.reelCode || r.reel_code || extractReelCode(instaUrl);
    const rawThumb = r.thumbnail || matchedProduct?.imageUrl || '/images/kurthi_peach.png';
    const thumb = getOptimizedImageUrl(rawThumb);
    const videoUrl = r.videoUrl || r.video_url || '';

    const resolvedSizes = (matchedProduct?.sizes && matchedProduct.sizes.length > 0)
        ? matchedProduct.sizes
        : (r.product?.sizes && r.product.sizes.length > 0 ? r.product.sizes : DEFAULT_FALLBACK_SIZES);
    const resolvedSizesStock = matchedProduct?.sizesStock || r.product?.sizesStock || {};

    return {
        id: r.id || 'reel-item',
        productId: prodId,
        isHitReel: isHit,
        instagramUrl: instaUrl,
        reelCode: reelCode,
        videoUrl: videoUrl,
        title: r.title || (matchedProduct ? matchedProduct.name : 'Curated Silhouette'),
        caption: r.caption || (matchedProduct ? `${matchedProduct.fabric || 'Pure Cotton'} kurti crafted for everyday elegance.` : ''),
        author: r.author || '@theethnictouch.co',
        likes: r.likes || 'Trending',
        views: r.views || (isHit ? 'Hit Reel' : 'Latest Drop'),
        thumbnail: thumb,
        product: matchedProduct ? {
            id: matchedProduct.id,
            name: matchedProduct.name,
            price: Number(matchedProduct.price) || 499,
            imageUrl: matchedProduct.imageUrl || thumb,
            category: matchedProduct.category || 'Silhouettes',
            fabric: matchedProduct.fabric || 'Pure Cotton',
            sizes: resolvedSizes,
            sizesStock: resolvedSizesStock
        } : (r.product ? {
            ...r.product,
            sizes: resolvedSizes,
            sizesStock: resolvedSizesStock
        } : {
            id: prodId || 'p_Pi_88000',
            name: r.title || 'Jaipur Handcrafted Kurti',
            price: 549,
            imageUrl: thumb,
            category: 'Straight Cut',
            fabric: 'Pure Cotton',
            sizes: DEFAULT_FALLBACK_SIZES,
            sizesStock: {}
        })
    };
};

const InstaReelsShowcase = ({ instagramConfig, productsGlobal = [], addToCart }) => {
    const navigate = useNavigate();
    const handle = instagramConfig?.handle || INSTAGRAM_HANDLE;
    const profileUrl = instagramConfig?.profile_url || INSTAGRAM_PROFILE_URL;
    const rawReels = (instagramConfig?.reels && instagramConfig.reels.length > 0) 
        ? instagramConfig.reels 
        : defaultReels;
    const reels = rawReels.map(r => normalizeReel(r, productsGlobal));

    const [activeReel, setActiveReel] = useState(null);
    const [selectedSize, setSelectedSize] = useState('M');
    const [addedSuccess, setAddedSuccess] = useState(false);
    const [videoCache, setVideoCache] = useState({});
    const [videoLoading, setVideoLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 768);

    const isClosingViaPopstateRef = useRef(false);

    const closeReelModal = useCallback(() => {
        setActiveReel(null);
        if (typeof window !== 'undefined' && window.history.state?.instaReelModal) {
            isClosingViaPopstateRef.current = true;
            window.history.back();
        }
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Popstate listener for mobile Back button / gesture
    useEffect(() => {
        const handlePopState = () => {
            if (isClosingViaPopstateRef.current) {
                isClosingViaPopstateRef.current = false;
                return;
            }
            if (activeReel) {
                setActiveReel(null);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [activeReel]);

    // Keyboard Escape listener
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && activeReel) {
                closeReelModal();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeReel, closeReelModal]);

    // Clean up any remaining modal history state on unmount
    useEffect(() => {
        return () => {
            if (typeof window !== 'undefined' && window.history.state?.instaReelModal) {
                window.history.back();
            }
        };
    }, []);

    // Resolve direct progressive MP4 video URL for inline mobile and desktop playback
    useEffect(() => {
        if (!activeReel) return;

        const code = activeReel.reelCode || extractReelCode(activeReel.instagramUrl);
        if (!code) return;

        if (activeReel.videoUrl || videoCache[code]) {
            setVideoLoading(false);
            return;
        }

        let isMounted = true;
        setVideoLoading(true);

        fetch(`/api/reels/video-url?code=${encodeURIComponent(code)}`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to resolve reel video');
                return res.json();
            })
            .then(data => {
                if (isMounted && data.videoUrl) {
                    setVideoCache(prev => ({ ...prev, [code]: data.videoUrl }));
                }
            })
            .catch(err => {
                console.warn('Could not resolve direct reel video:', err);
            })
            .finally(() => {
                if (isMounted) setVideoLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [activeReel, videoCache]);

    const activeVideoUrl = activeReel 
        ? (activeReel.videoUrl || videoCache[activeReel.reelCode || extractReelCode(activeReel.instagramUrl)] || '') 
        : '';

    // Resolve active product directly from latest database state if available
    const activeProduct = useMemo(() => {
        if (!activeReel) return null;
        const prodId = activeReel.productId || activeReel.product?.id;
        const matched = (productsGlobal || []).find(p => String(p.id) === String(prodId));
        if (matched) {
            return {
                ...matched,
                price: Number(matched.price) || activeReel.product?.price || 499,
                imageUrl: matched.imageUrl || activeReel.thumbnail,
                category: matched.category || 'Silhouettes',
                fabric: matched.fabric || 'Pure Cotton',
                sizes: (matched.sizes && matched.sizes.length > 0) ? matched.sizes : DEFAULT_FALLBACK_SIZES,
                sizesStock: matched.sizesStock || {}
            };
        }
        return activeReel.product;
    }, [activeReel, productsGlobal]);

    const activeSizes = activeProduct?.sizes && activeProduct.sizes.length > 0 
        ? activeProduct.sizes 
        : DEFAULT_FALLBACK_SIZES;
    const activeSizesStock = activeProduct?.sizesStock || {};

    const handleOpenReel = (reel, e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        const prodId = reel.productId || reel.product?.id;
        const matched = (productsGlobal || []).find(p => String(p.id) === String(prodId)) || reel.product;
        const sizes = (matched?.sizes && matched.sizes.length > 0) ? matched.sizes : DEFAULT_FALLBACK_SIZES;
        const sizesStock = matched?.sizesStock || {};

        // Auto-select first in-stock size (stock !== 0)
        const firstInStock = sizes.find(sz => (sizesStock[sz] !== undefined ? sizesStock[sz] > 0 : true)) || sizes[0] || 'M';

        setActiveReel(reel);
        setSelectedSize(firstInStock);
        setAddedSuccess(false);

        // Push history entry so mobile hardware/browser Back button closes modal
        try {
            window.history.pushState({ instaReelModal: true }, '');
        } catch (err) {
            console.warn('Could not push history state for modal', err);
        }
    };

    const handleViewProduct = (e, prodId) => {
        if (e) e.preventDefault();
        if (typeof window !== 'undefined' && window.history.state?.instaReelModal) {
            window.history.replaceState(null, '');
        }
        setActiveReel(null);
        navigate(`/product/${prodId}/kurti`);
    };

    // Action handlers: Click card plays reel inline on website; Click Shop Piece redirects directly to shop
    const handleCardClick = (reel, e) => {
        if (e) e.preventDefault();
        // Play reel inline on website modal (both mobile and desktop)
        handleOpenReel(reel, e);
    };

    const handleShopClick = (reel, e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        const prodId = reel.productId || reel.product?.id;
        // Direct redirect to that product's shop page
        if (prodId) {
            navigate(`/product/${prodId}/kurti`);
        } else {
            navigate('/shop');
        }
    };

    const isCurrentSizeOutOfStock = selectedSize 
        ? (activeSizesStock[selectedSize] !== undefined && activeSizesStock[selectedSize] === 0)
        : false;

    const hasAnyInStock = activeSizes.some(sz => (activeSizesStock[sz] === undefined || activeSizesStock[sz] > 0));

    const selectedStockQty = selectedSize && activeSizesStock[selectedSize] !== undefined 
        ? activeSizesStock[selectedSize] 
        : -1;

    const handleAddToCart = () => {
        if (!activeProduct || !selectedSize || isCurrentSizeOutOfStock) return;
        addToCart({
            ...activeProduct,
            id: activeProduct.id || activeProduct.productId || 'p_Pi_88000',
            name: activeProduct.name || activeProduct.title || 'Pink Paisley Printed Straight Kurti',
            price: Number(activeProduct.price) || 549,
            imageUrl: getOptimizedImageUrl(activeProduct.imageUrl || activeReel?.thumbnail || '/images/kurthi_peach.png'),
            size: selectedSize,
            quantity: 1
        });
        setAddedSuccess(true);
        setTimeout(() => setAddedSuccess(false), 2500);
    };

    return (
        <section className="reels-section" id="reels-showcase-section" aria-label="Instagram Shoppable Reels">
            <div className="reels-header">
                <div className="reels-header-left">
                    <span>
                        <InstagramIcon size={15} color="#D09F6F" /> Follow Us @{handle}
                    </span>
                    <h2>Watch, Style & Shop Our Reels</h2>
                    <p style={{ fontSize: '0.88rem', color: '#6C6863', margin: '4px 0 0' }}>
                        See how our kurtis look in real life. Tap any video to watch and shop directly!
                    </p>
                </div>

                <a 
                    href={profileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-follow-insta"
                >
                    <InstagramIcon size={16} />
                    Follow on Instagram
                    <ExternalLink size={13} style={{ marginLeft: '2px' }} />
                </a>
            </div>

            <div className="reels-grid">
                {reels.map((reel) => (
                    <div 
                        key={reel.id} 
                        className="reel-card"
                        onClick={(e) => handleCardClick(reel, e)}
                        role="button"
                        tabIndex={0}
                        aria-label={`Watch reel: ${reel.title}`}
                    >
                        <img 
                            src={reel.thumbnail} 
                            alt={reel.title} 
                            className="reel-card-img" 
                            loading="lazy" 
                        />

                        <div className="reel-card-overlay">
                            <div className="reel-top-bar">
                                <div className={`reel-views-badge ${reel.isHitReel ? 'reel-badge-hit' : ''}`}>
                                    {reel.isHitReel ? '⭐ Hit Reel' : <><Eye size={12} color="#D09F6F" /> {reel.views}</>}
                                </div>
                                <InstagramIcon size={18} color="#FAF8F5" style={{ opacity: 0.95 }} />
                            </div>

                            <div className="reel-footer">
                                <div className="reel-meta-row">
                                    <span className="reel-author">{reel.author}</span>
                                    <span className="reel-likes-pill">
                                        <Heart size={11} fill="#D09F6F" color="#D09F6F" /> {reel.likes}
                                    </span>
                                </div>
                                <p className="reel-caption">{reel.title}</p>
                                <button 
                                    className="btn-shop-reel"
                                    onClick={(e) => handleShopClick(reel, e)}
                                    aria-label={`Shop piece from ${reel.title}`}
                                >
                                    <ShoppingBag size={13} className="reel-btn-icon" /> Shop Piece
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Interactive Shoppable Reel Modal */}
            {activeReel && (
                <div 
                    className="reel-modal-backdrop"
                    onClick={closeReelModal}
                >
                    <div 
                        className="reel-modal-container"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button 
                            className="reel-modal-close-btn"
                            onClick={closeReelModal}
                            aria-label="Close modal"
                        >
                            <X size={18} />
                        </button>

                        {/* Left Side: Video Preview or Embed */}
                        <div className="reel-modal-video-side">
                            {!isMobile ? (
                                // Desktop Web: Official Instagram iframe player (plays inline flawlessly on desktop web)
                                activeReel.reelCode ? (
                                    <iframe
                                        src={`https://www.instagram.com/reel/${activeReel.reelCode}/embed`}
                                        title={activeReel.title}
                                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                                        allowFullScreen
                                        style={{ width: '100%', height: '100%', minHeight: '480px', border: 'none', background: '#000' }}
                                    />
                                ) : (
                                    <img 
                                        src={activeReel.thumbnail} 
                                        alt={activeReel.title} 
                                        className="reel-video-poster"
                                    />
                                )
                            ) : (
                                // Mobile Web: Native video if available, or direct high-res card with watch link
                                activeVideoUrl ? (
                                    <div className="reel-video-wrapper">
                                        <video
                                            key={activeVideoUrl}
                                            src={activeVideoUrl}
                                            poster={activeReel.thumbnail}
                                            controls
                                            autoPlay
                                            playsInline
                                            loop
                                            className="reel-native-video"
                                        />
                                        <div className="reel-video-top-bar">
                                            <a 
                                                href={activeReel.instagramUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="reel-insta-chip"
                                                title="View on Instagram"
                                            >
                                                <InstagramIcon size={12} color="#FFF" />
                                                <span>Instagram</span>
                                                <ExternalLink size={10} color="#FFF" />
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="reel-video-wrapper">
                                        <img 
                                            src={activeReel.thumbnail} 
                                            alt={activeReel.title} 
                                            className="reel-video-poster"
                                        />
                                        <div className="reel-video-loader-overlay" style={{ background: 'rgba(0,0,0,0.55)' }}>
                                            <a 
                                                href={activeReel.instagramUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="btn-hero-primary"
                                                style={{ 
                                                    background: 'linear-gradient(135deg, #D4A373 0%, #C49363 100%)', 
                                                    color: '#FFF',
                                                    padding: isMobile ? '0.55rem 1.15rem' : '0.75rem 1.4rem',
                                                    borderRadius: '999px',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    fontSize: isMobile ? '0.78rem' : '0.84rem',
                                                    fontWeight: '600',
                                                    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                                                    textDecoration: 'none'
                                                }}
                                            >
                                                <Play size={isMobile ? 13 : 15} fill="#FFF" /> Watch Video on Instagram App
                                            </a>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>

                        {/* Right Side: Shoppable Piece Details */}
                        <div className="reel-modal-shop-side">
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-primary)', fontSize: isMobile ? '0.72rem' : '0.78rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: isMobile ? '0.2rem' : '0.5rem' }}>
                                    <ShoppingBag size={isMobile ? 12 : 14} /> As Seen in This Reel
                                </div>
                                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: isMobile ? '1.12rem' : '1.4rem', color: 'var(--color-text)', marginBottom: isMobile ? '0.15rem' : '0.4rem', lineHeight: 1.25 }}>
                                    {activeProduct.name}
                                </h3>
                                <p style={{ fontSize: isMobile ? '0.76rem' : '0.88rem', color: '#6C6863', lineHeight: '1.4', marginBottom: isMobile ? '0.45rem' : '1.25rem', whiteSpace: isMobile ? 'nowrap' : 'normal', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {activeReel.caption || `${activeProduct.fabric || 'Pure Cotton'} kurti crafted for everyday elegance.`}
                                </p>

                                <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '0.65rem' : '1rem', padding: isMobile ? '0.4rem 0.65rem' : '1rem', background: '#FAF8F5', borderRadius: '12px', marginBottom: isMobile ? '0.45rem' : '1.5rem', border: '1px solid rgba(0,0,0,0.04)' }}>
                                    <img 
                                        src={activeProduct.imageUrl} 
                                        alt={activeProduct.name} 
                                        style={{ width: isMobile ? '40px' : '60px', height: isMobile ? '52px' : '80px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }} 
                                    />
                                    <div style={{ minWidth: 0 }}>
                                        <div style={{ fontSize: isMobile ? '0.68rem' : '0.76rem', color: '#8C8781', textTransform: 'uppercase' }}>
                                            {activeProduct.category}
                                        </div>
                                        <div style={{ fontSize: isMobile ? '1.05rem' : '1.2rem', fontWeight: '700', color: 'var(--color-text)' }}>
                                            ₹{(Number(activeProduct?.price) || 549).toLocaleString('en-IN')}
                                        </div>
                                        <div style={{ fontSize: isMobile ? '0.68rem' : '0.74rem', color: '#5B8E7D', fontWeight: '600', marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            ✓ 100% Pure Breathable Jaipur {activeProduct.fabric || 'Cotton'}
                                        </div>
                                    </div>
                                </div>

                                {/* Dynamic Size Picker from Database */}
                                <div style={{ marginBottom: isMobile ? '0.45rem' : '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: isMobile ? '0.76rem' : '0.82rem', marginBottom: isMobile ? '0.25rem' : '0.5rem' }}>
                                        <strong style={{ color: 'var(--color-text)' }}>Choose Size:</strong>
                                        {selectedStockQty > 0 && selectedStockQty <= 3 ? (
                                            <span style={{ color: '#D97706', fontWeight: '600', fontSize: isMobile ? '0.72rem' : '0.78rem' }}>
                                                Only {selectedStockQty} left in size {selectedSize}!
                                            </span>
                                        ) : (
                                            <span style={{ color: 'var(--color-primary)', fontWeight: '600', fontSize: isMobile ? '0.72rem' : '0.78rem' }}>Standard Indian Fit</span>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', gap: isMobile ? '6px' : '8px', flexWrap: 'nowrap', width: '100%' }}>
                                        {activeSizes.map(sz => {
                                            const stockQty = activeSizesStock && activeSizesStock[sz] !== undefined ? activeSizesStock[sz] : -1;
                                            const isOutOfStock = stockQty === 0;
                                            const isSelected = selectedSize === sz;

                                            return (
                                                <button
                                                    key={sz}
                                                    type="button"
                                                    disabled={isOutOfStock}
                                                    onClick={() => !isOutOfStock && setSelectedSize(sz)}
                                                    title={isOutOfStock ? `${sz} is Out of Stock` : (stockQty > 0 && stockQty <= 3 ? `Only ${stockQty} left!` : `Size ${sz}`)}
                                                    style={{
                                                        padding: isMobile ? '0.35rem 0.5rem' : '0.55rem 1rem',
                                                        borderRadius: '8px',
                                                        border: `1.5px solid ${
                                                            isSelected 
                                                                ? 'var(--color-primary)' 
                                                                : (isOutOfStock ? '#E8E5E1' : 'rgba(0,0,0,0.12)')
                                                        }`,
                                                        background: isSelected 
                                                            ? 'var(--color-primary)' 
                                                            : (isOutOfStock ? '#F9F9F9' : '#FFF'),
                                                        color: isSelected 
                                                            ? '#FFF' 
                                                            : (isOutOfStock ? '#AAA' : 'var(--color-text)'),
                                                        fontWeight: '600',
                                                        fontSize: isMobile ? '0.76rem' : '0.84rem',
                                                        cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                                                        textDecoration: isOutOfStock ? 'line-through' : 'none',
                                                        opacity: isOutOfStock ? 0.6 : 1,
                                                        transition: 'all 0.2s ease',
                                                        flex: '1 1 auto',
                                                        minWidth: isMobile ? '34px' : '45px',
                                                        boxShadow: isSelected ? '0 4px 12px rgba(212, 163, 115, 0.25)' : 'none'
                                                    }}
                                                >
                                                    {sz}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {isCurrentSizeOutOfStock && selectedSize && (
                                        <div style={{ fontSize: '0.74rem', color: '#DC2626', marginTop: '4px', fontWeight: '500' }}>
                                            Size {selectedSize} is sold out. Please select another size.
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <button
                                    type="button"
                                    disabled={!selectedSize || isCurrentSizeOutOfStock || !hasAnyInStock}
                                    onClick={handleAddToCart}
                                    style={{
                                        width: '100%',
                                        background: addedSuccess 
                                            ? '#5B8E7D' 
                                            : ((!selectedSize || isCurrentSizeOutOfStock || !hasAnyInStock) 
                                                ? '#D1D5DB' 
                                                : 'linear-gradient(135deg, #D4A373 0%, #C49363 100%)'),
                                        color: '#FFF',
                                        padding: isMobile ? '0.68rem 1rem' : '0.95rem',
                                        borderRadius: '10px',
                                        border: 'none',
                                        fontWeight: '700',
                                        fontSize: isMobile ? '0.88rem' : '0.95rem',
                                        cursor: (!selectedSize || isCurrentSizeOutOfStock || !hasAnyInStock) ? 'not-allowed' : 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        boxShadow: (!selectedSize || isCurrentSizeOutOfStock || !hasAnyInStock) 
                                            ? 'none' 
                                            : '0 8px 24px rgba(212, 163, 115, 0.38)',
                                        transition: 'all 0.25s ease'
                                    }}
                                >
                                    {addedSuccess ? (
                                        <>
                                            <Check size={18} /> Added to Wardrobe!
                                        </>
                                    ) : !hasAnyInStock ? (
                                        <>Sold Out</>
                                    ) : isCurrentSizeOutOfStock ? (
                                        <>Size {selectedSize} Out of Stock</>
                                    ) : (
                                        <>
                                            <ShoppingBag size={18} /> Add Size {selectedSize} to Bag &bull; ₹{(Number(activeProduct?.price) || 549).toLocaleString('en-IN')}
                                        </>
                                    )}
                                </button>
                                
                                <div style={{ textAlign: 'center', marginTop: isMobile ? '0.35rem' : '0.85rem' }}>
                                    <a 
                                        href={`/product/${activeProduct.id}/kurti`} 
                                        style={{ fontSize: isMobile ? '0.74rem' : '0.82rem', color: '#8C8781', textDecoration: 'underline' }}
                                        onClick={(e) => handleViewProduct(e, activeProduct.id)}
                                    >
                                        View Full Product Specifications & Zoom
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default InstaReelsShowcase;
