import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate, Link, useLocation, useParams, Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import Cart from './Cart';
import ImageWithSkeleton from '../components/ImageWithSkeleton';
import { API_BASE_URL } from '../data/config';
import SizeSelectionModal from '../components/SizeSelectionModal';
import SizeGuide from '../components/SizeGuide';
import ZoomableImage from '../components/ZoomableImage';

const ProductDetails = ({ products, addToCart, wishlist = [], toggleWishlist, authUser }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const globalProduct = products.find(p => p.id === id);
    
    const [localProduct, setLocalProduct] = useState(null);
    const [isFetchingDelta, setIsFetchingDelta] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        // Reset state when ID changes
        setLocalProduct(null);
        setIsFetchingDelta(true);
        setNotFound(false);

        if (globalProduct) {
            setLocalProduct(globalProduct);
            setIsFetchingDelta(false);
            return;
        }

        const controller = new AbortController();
        fetch(`${API_BASE_URL}/api/products/${id}`, { signal: controller.signal })
            .then(res => {
                if (!res.ok) throw new Error("Product not found");
                return res.json();
            })
            .then(data => {
                setLocalProduct(data);
                setIsFetchingDelta(false);
            })
            .catch(err => {
                if (err.name !== 'AbortError') {
                    console.error("Delta fetch failed:", err);
                    setNotFound(true);
                    setIsFetchingDelta(false);
                }
            });

        return () => controller.abort();
    }, [id, globalProduct]);

    const product = localProduct;
    const hasSizes = product?.sizes && product.sizes.length > 0;
    const isOutOfStock = hasSizes ? !product.sizes.some(sz => (product.sizesStock && product.sizesStock[sz] !== undefined ? product.sizesStock[sz] : -1) !== 0) : false;

    const [activeImage, setActiveImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [reviews, setReviews] = useState([]);
    
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [showSizeModal, setShowSizeModal] = useState(false);
    const [modalSelectedSize, setModalSelectedSize] = useState('');
    const [reviewFormError, setReviewFormError] = useState('');
    const [reviewLoading, setReviewLoading] = useState(false);

    // Collapsible Accordion Tabs state
    const [openTabs, setOpenTabs] = useState({ specs: true, shipping: false, sizeGuide: false });
    const carouselRef = useRef(null);
    
    const toggleTab = (tabKey) => {
        setOpenTabs(prev => ({ ...prev, [tabKey]: !prev[tabKey] }));
    };

    useEffect(() => {
        if (product && product.sizes && product.sizes.length > 0) {
            // Don't select a default size automatically
            setSelectedSize('');
            setActiveImage(0); // reset image index on product change
            setQuantity(1); // reset quantity on product change
        }
    }, [product]);

    useEffect(() => {
        const controller = new AbortController();
        if (product) {
            fetch(`${API_BASE_URL}/api/products/${product.id}/reviews`, { signal: controller.signal })
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) setReviews(data);
                })
                .catch(err => {
                    if (err.name !== 'AbortError') {
                        console.error("Error fetching reviews:", err);
                    }
                });
        }
        return () => controller.abort();
        return () => controller.abort();
    }, [product]);

    const avgRating = reviews.length > 0 
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
        : 0;

    const galleryImages = (product && product.galleryImages && product.galleryImages.length > 0) 
        ? product.galleryImages 
        : (product ? [product.imageUrl] : []);

    const schemaJSON = useMemo(() => {
        if (!product) return null;
        
        const availability = (product.sizesStock && Object.values(product.sizesStock).some(qty => qty > 0)) 
            ? "https://schema.org/InStock" 
            : "https://schema.org/OutOfStock";

        const schema = {
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": product.name,
            "image": galleryImages,
            "description": product.description,
            "brand": {
                "@type": "Brand",
                "name": "The Ethnic Touch"
            },
            "offers": {
                "@type": "Offer",
                "url": window.location.href,
                "priceCurrency": "INR",
                "price": product.price,
                "availability": availability
            }
        };

        if (reviews && reviews.length > 0) {
            schema.aggregateRating = {
                "@type": "AggregateRating",
                "ratingValue": avgRating,
                "reviewCount": reviews.length
            };
            schema.review = reviews.slice(0, 5).map(rev => ({
                "@type": "Review",
                "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": rev.rating,
                    "bestRating": "5"
                },
                "author": {
                    "@type": "Person",
                    "name": rev.userName
                }
            }));
        }
        return JSON.stringify(schema);
    }, [product, reviews, avgRating, galleryImages]);

    const [shareBlob, setShareBlob] = useState(null);

    useEffect(() => {
        if (product) {
            const fetchShareImage = async () => {
                try {
                    // Adding a timestamp cache-buster to ensure the browser always gets the latest generated banner
                    const ogImageUrl = `${API_BASE_URL}/api/og-image/${product.id}.jpg?v=${new Date().getTime()}`;
                    const response = await fetch(ogImageUrl, { cache: 'no-store' });
                    const blob = await response.blob();
                    setShareBlob(blob);
                } catch (err) {
                    console.error("Failed to prefetch share image", err);
                }
            };
            fetchShareImage();
        }
    }, [product]);

    const breadcrumbJSON = useMemo(() => {
        if (!product) return null;
        return JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [{
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://theethnictouch.com/"
            },{
                "@type": "ListItem",
                "position": 2,
                "name": "Shop",
                "item": "https://theethnictouch.com/shop"
            },{
                "@type": "ListItem",
                "position": 3,
                "name": product.category || "Collection",
                "item": `https://theethnictouch.com/shop/${(product.category || "").toLowerCase().replace(" ", "-")}`
            },{
                "@type": "ListItem",
                "position": 4,
                "name": product.name
            }]
        });
    }, [product]);

    if (isFetchingDelta) {
        return (
            <div style={{padding: '10rem 5%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                <div className="loader" style={{marginBottom: '1rem'}}></div>
                <h3 style={{color: '#8c8883', fontWeight: 500, fontFamily: 'var(--font-heading)'}}>Loading product details...</h3>
            </div>
        );
    }

    if (notFound || !product) {
        return <div style={{padding: '10rem 5%', textAlign:'center'}}><h2>Product Not Found</h2><p>The item you are looking for may have been removed or does not exist.</p></div>;
    }

    const isWished = wishlist ? wishlist.some(item => item.id === product.id) : false;

    const handleCarouselScroll = () => {
        if (!carouselRef.current) return;
        const container = carouselRef.current;
        const slideWidth = container.clientWidth;
        if (slideWidth > 0) {
            const newIndex = Math.round(container.scrollLeft / slideWidth);
            if (newIndex !== activeImage && newIndex >= 0 && newIndex < galleryImages.length) {
                setActiveImage(newIndex);
            }
        }
    };

    const handleThumbnailClick = (index) => {
        setActiveImage(index);
        const slideElement = document.getElementById(`gallery-slide-${index}`);
        if (slideElement) {
            slideElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    };

    const nextImage = () => {
        const nextIdx = (activeImage + 1) % galleryImages.length;
        handleThumbnailClick(nextIdx);
    };

    const prevImage = () => {
        const prevIdx = (activeImage - 1 + galleryImages.length) % galleryImages.length;
        handleThumbnailClick(prevIdx);
    };

    const handleBack = (e) => {
        e.preventDefault();
        if (window.history.state && window.history.state.idx > 0) {
            navigate(-1);
        } else {
            navigate('/shop');
        }
    };

    const scrollToReviews = () => {
        const el = document.getElementById('customer-reviews-section');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleShare = async () => {
        try {
            let filesArray = [];
            try {
                let blob = shareBlob;
                if (!blob) {
                    // If the user clicked share before the background prefetch finished, fetch it now!
                    const ogImageUrl = `${API_BASE_URL}/api/og-image/${product.id}.jpg?v=${new Date().getTime()}`;
                    const response = await fetch(ogImageUrl);
                    blob = await response.blob();
                }
                
                const file = new File([blob], 'product-preview.jpg', { type: blob.type || 'image/jpeg' });
                filesArray.push(file);
            } catch (imgErr) {
                console.error("Could not fetch image for share:", imgErr);
            }

            const shareUrl = new URL(window.location.href);
            shareUrl.searchParams.set('utm_source', 'user_share');
            shareUrl.searchParams.set('utm_medium', 'social');
            shareUrl.searchParams.set('utm_campaign', 'product_share');

            const shareData = {
                title: `${product.name} | The Ethnic Touch`,
                text: product.description,
                url: shareUrl.toString(),
            };
            
            const shareDataWithFiles = { ...shareData, files: filesArray };

            if (navigator.share) {
                if (navigator.canShare && navigator.canShare(shareDataWithFiles)) {
                    await navigator.share(shareDataWithFiles);
                } else {
                    await navigator.share(shareData);
                }
            } else {
                throw new Error("Web Share API not supported");
            }
        } catch (err) {
            console.error("Error sharing:", err);
            // Fallback to clipboard if user didn't explicitly abort the share
            if (err.name !== 'AbortError') {
                try {
                    await navigator.clipboard.writeText(window.location.href);
                    alert("Link copied to clipboard!");
                } catch (clipboardErr) {
                    console.error("Clipboard copy failed:", clipboardErr);
                }
            }
        }
    };

    const handleAddToCart = () => {
        if (product && product.sizes && product.sizes.length > 0 && !selectedSize) {
            setModalSelectedSize('');
            setShowSizeModal(true);
            return;
        }
        addToCart({ ...product, size: selectedSize, quantity: quantity });
    };

    const handleModalAddToCart = () => {
        if (modalSelectedSize) {
            addToCart({ ...product, size: modalSelectedSize, quantity: quantity });
            setSelectedSize(modalSelectedSize);
            setShowSizeModal(false);
        }
    };

    const submitReview = async (e) => {
        e.preventDefault();
        setReviewFormError('');
        const trimmedComment = comment.trim();
        if (!trimmedComment) {
            setReviewFormError('Please write a comment.');
            return;
        }

        setReviewLoading(true);
        const name = authUser?.displayName || authUser?.email?.split('@')[0] || "Guest Reviewer";
        const email = authUser?.email || "guest@ethnictouch.com";
        const cleanComment = trimmedComment.replace(/<[^>]*>?/gm, '').slice(0, 1000);

        try {
            const res = await fetch(`${API_BASE_URL}/api/products/${product.id}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userName: name, userEmail: email, rating: parseInt(rating), comment: cleanComment })
            });

            if (!res.ok) throw new Error("Failed to post review");

            const newReview = await res.json();
            setReviews(prev => [newReview, ...prev]);
            setComment('');
            setRating(5);
        } catch (err) {
            setReviewFormError('Could not post your review. Please try again.');
        } finally {
            setReviewLoading(false);
        }
    };

    const recommendedList = products
        .filter(p => p.id !== product.id)
        .slice(0, 4);

    return (
        <div className="product-details-page-container" style={{maxWidth: '1200px', margin: '0 auto', minHeight: '80vh'}}>
            {schemaJSON && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJSON }} />}
            {breadcrumbJSON && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbJSON }} />}
            <a href="#" onClick={handleBack} className="product-details-back-link" style={{display:'inline-block', marginBottom:'1.5rem', color:'var(--color-text-light)', textDecoration:'none', transition:'color 0.2s'}}>&larr; Back to Collection</a>
            
            <div className="desktop-split-layout product-details-layout" style={{gap: '3rem', alignItems: 'flex-start'}}>
                
                {/* Image Slider Gallery */}
                <div className="product-gallery-layout sticky-on-desktop">
                    {/* Gallery Thumbnails List */}
                    {galleryImages.length > 1 && (
                        <div className="product-thumbnails-list">
                            {galleryImages.map((imgUrl, idx) => (
                                <div 
                                    key={idx} 
                                    onClick={() => handleThumbnailClick(idx)}
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
                                    <ImageWithSkeleton src={imgUrl} alt={`${product.name} - Premium Jaipuri View ${idx+1}`} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                                </div>
                            ))}
                        </div>
                    )}

                    <div 
                        className="gallery-main-container" 
                        style={{
                            flex: 1,
                            borderRadius: 'var(--border-radius-lg)', 
                            overflow: 'hidden', 
                            boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                            marginBottom: '1rem',
                            aspectRatio: '3/4',
                            backgroundColor: '#fafafa',
                            position: 'relative',
                            minWidth: 0
                        }}
                    >
                        <div 
                            ref={carouselRef} 
                            className="gallery-carousel-track" 
                            onScroll={handleCarouselScroll}
                        >
                            {galleryImages.map((imgUrl, idx) => (
                                <div key={idx} id={`gallery-slide-${idx}`} className="gallery-carousel-slide">
                                    <ZoomableImage 
                                        src={imgUrl} 
                                        alt={`${product.name} - Premium Jaipuri Quality View ${idx + 1}`} 
                                        className="gallery-slide-img" 
                                        style={{ height: '100%' }}
                                    />
                                </div>
                            ))}
                        </div>

                        {galleryImages.length > 1 && (
                            <React.Fragment>
                                <button className="slider-nav-btn prev" onClick={prevImage} aria-label="Previous image">&lsaquo;</button>
                                <button className="slider-nav-btn next" onClick={nextImage} aria-label="Next image">&rsaquo;</button>
                                
                                <div className="slider-dots">
                                    {galleryImages.map((_, idx) => (
                                        <div 
                                            key={idx} 
                                            className={`slider-dot ${activeImage === idx ? 'active' : ''}`}
                                            onClick={() => handleThumbnailClick(idx)}
                                        />
                                    ))}
                                </div>
                            </React.Fragment>
                        )}
                    </div>
                </div>

                {/* Product Summary & Actions Sidebar */}
                <div className="product-summary-pane" style={{flex: 1, minWidth: '300px'}}>
                    <h1 style={{fontSize: '2.2rem', margin: '0 0 0.5rem', fontFamily: 'var(--font-title)'}}>{product.name}</h1>
                    
                    <div 
                        onClick={scrollToReviews} 
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', cursor: 'pointer' }}
                        title="Click to view customer reviews"
                    >
                        {reviews.length > 0 ? (
                            <React.Fragment>
                                <div style={{ color: '#d4af37', fontSize: '1.1rem', letterSpacing: '1px' }}>
                                    {'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))}
                                </div>
                                <span style={{ color: 'var(--color-primary)', fontSize: '0.85rem', textDecoration: 'underline', fontWeight: '500' }}>
                                    {avgRating} ({reviews.length} reviews) &darr;
                                </span>
                            </React.Fragment>
                        ) : (
                            <span style={{ color: 'var(--color-primary)', fontSize: '0.85rem', textDecoration: 'underline', fontWeight: '500' }}>
                                No reviews yet &mdash; Be the first to review! &darr;
                            </span>
                        )}
                    </div>

                    <div style={{fontSize: '1.8rem', fontWeight: '600', marginBottom: '1.5rem', color: 'var(--color-primary)'}}>
                        ₹{product.price.toLocaleString('en-IN')} <span style={{fontSize: '0.8rem', color: '#888', fontWeight: '400'}}>(Inclusive of all taxes)</span>
                    </div>
                    
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
                            <div style={{display: 'flex', gap: '0.6rem', flexWrap: 'wrap'}}>
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
                                                padding: '0.45rem 1rem',
                                                minWidth: '42px',
                                                height: '38px',
                                                borderRadius: '8px',
                                                border: '1.5px solid #ddd',
                                                backgroundColor: '#fff',
                                                color: '#555',
                                                fontWeight: '600',
                                                cursor: isDisabled ? 'not-allowed' : 'pointer',
                                                fontSize: '0.88rem'
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
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h4 style={{ margin: '0 0 0.6rem', fontSize: '0.9rem', fontWeight: '600', color: '#333' }}>Quantity</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #ddd', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#fafafa', height: '36px' }}>
                                <button 
                                    type="button"
                                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                    disabled={quantity <= 1}
                                    aria-label="Decrease quantity"
                                    style={{ width: '34px', height: '100%', border: 'none', background: 'none', cursor: quantity <= 1 ? 'not-allowed' : 'pointer', fontSize: '1rem', fontWeight: 'bold', color: quantity <= 1 ? '#ccc' : '#333', transition: 'all 0.2s' }}
                                >
                                    -
                                </button>
                                <span style={{ width: '36px', textAlign: 'center', fontWeight: '600', fontSize: '0.9rem', userSelect: 'none' }}>
                                    {quantity}
                                </span>
                                <button 
                                    type="button"
                                    onClick={() => setQuantity(prev => prev + 1)}
                                    aria-label="Increase quantity"
                                    style={{ width: '34px', height: '100%', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold', color: '#333', transition: 'all 0.2s' }}
                                >
                                    +
                                </button>
                            </div>

                            {quantity > 1 && (
                                <div style={{ fontSize: '0.88rem', color: '#666', fontWeight: '500' }}>
                                    Subtotal: <strong style={{ color: 'var(--color-primary)' }}>₹{(product.price * quantity).toLocaleString('en-IN')}</strong>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="desktop-only-cta" style={{ display: 'flex', gap: '0.8rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                        <button 
                            className="btn btn-primary" 
                            onClick={handleAddToCart}
                            disabled={isOutOfStock}
                            style={{ fontSize: '0.92rem', padding: '0 1.25rem', flex: 1, minWidth: '180px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            {isOutOfStock ? 'Out of Stock' : (selectedSize ? `Add to Cart ${quantity > 1 ? `(${quantity})` : ''} - Size ${selectedSize}` : `Add to Cart ${quantity > 1 ? `(${quantity})` : ''}`)}
                        </button>

                        <button 
                            type="button"
                            onClick={() => toggleWishlist && toggleWishlist(product)}
                            title={isWished ? "Remove from wishlist" : "Add to wishlist"}
                            aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
                            style={{
                                height: '44px',
                                padding: '0 1.25rem',
                                borderRadius: 'var(--border-radius-pill, 50px)',
                                border: isWished ? '2px solid #e53935' : '1.5px solid #ddd',
                                backgroundColor: isWished ? '#fff5f5' : '#fff',
                                color: isWished ? '#e53935' : '#444',
                                fontWeight: '600',
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'all 0.2s ease',
                                flexShrink: 0
                            }}
                        >
                            <svg width="17" height="17" viewBox="0 0 24 24" fill={isWished ? "#e53935" : "none"} stroke={isWished ? "#e53935" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                            <span>{isWished ? 'Wishlisted' : 'Wishlist'}</span>
                        </button>
                        
                        <button 
                            type="button"
                            onClick={handleShare}
                            title="Share Product"
                            aria-label="Share Product"
                            style={{
                                height: '44px',
                                padding: '0 1.25rem',
                                borderRadius: 'var(--border-radius-pill, 50px)',
                                border: '1.5px solid #ddd',
                                backgroundColor: '#fff',
                                color: '#444',
                                fontWeight: '600',
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'all 0.2s ease',
                                flexShrink: 0
                            }}
                        >
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="18" cy="5" r="3"></circle>
                                <circle cx="6" cy="12" r="3"></circle>
                                <circle cx="18" cy="19" r="3"></circle>
                                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                            </svg>
                            <span>Share</span>
                        </button>
                    </div>

                    {/* Moved Description Below Buttons */}
                    <div style={{ paddingTop: '1.5rem', borderTop: '1px solid #f0f0f0', marginBottom: '1.5rem' }}>
                        <h4 style={{ margin: '0 0 1rem', fontSize: '1.05rem', fontWeight: '600', color: '#333' }}>Product Details</h4>
                        <p style={{fontSize: '0.95rem', margin: 0, lineHeight: '1.7', color: '#555'}}>{product.description}</p>
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
                            <div className="acc-content" style={{ maxHeight: openTabs.sizeGuide ? '1500px' : '0' }}>
                                <div className="acc-content-inner">
                                    <SizeGuide />
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
                            <Link to={`/product/${item.id}/${item.name ? item.name.toLowerCase().replace(/[\s\/]+/g, '-') : ''}`} key={item.id} className="recommended-card" onClick={() => window.scrollTo(0, 0)}>
                                <div className="recommended-image-wrapper">
                                    <img 
                                        className="recommended-img" 
                                        src={item.imageUrl} 
                                        alt={item.name} 
                                        onError={(e) => { e.target.src = './images/kurthi_peach.png'; }}
                                    />
                                    <span className="recommended-badge">{item.category}</span>
                                </div>
                                <div style={{padding: '0.8rem 0.9rem'}}>
                                    <h3 style={{fontSize: '0.95rem', fontWeight: '500', marginBottom: '0.3rem', fontFamily: 'var(--font-heading)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{item.name}</h3>
                                    <span style={{fontSize: '0.95rem', color: 'var(--color-primary)', fontWeight: '600'}}>₹{item.price.toLocaleString('en-IN')}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Customer Reviews Section */}
            <div id="customer-reviews-section" style={{marginTop: '3.5rem', borderTop: '1px solid #eee', paddingTop: '2.5rem'}}>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-start'}}>
                    
                    <div style={{flex: '1 1 280px', minWidth: 0, width: '100%'}}>
                        <h2 style={{fontFamily: 'var(--font-title)', fontSize: '1.75rem', marginBottom: '1.2rem'}}>Customer Reviews</h2>
                        {reviews.length === 0 ? (
                            <p style={{color: '#888'}}>Be the first to review this product!</p>
                        ) : (
                            <div style={{display: 'flex', flexDirection: 'column', gap: '1.2rem'}}>
                                {reviews.map((rev) => (
                                    <div key={rev.id} className="review-card" style={{padding: '1.2rem', backgroundColor: '#fafafa', borderRadius: '12px', border: '1px solid #f0f0f0'}}>
                                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem'}}>
                                            <strong style={{fontSize: '1rem'}}>{rev.userName}</strong>
                                            <span style={{color: '#999', fontSize: '0.8rem'}}>{new Date(rev.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div style={{color: '#d4af37', marginBottom: '0.6rem', letterSpacing: '1px'}}>
                                            {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                                        </div>
                                        <p style={{margin: 0, color: '#555', lineHeight: '1.5', fontSize: '0.9rem'}}>{rev.comment}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="write-review-card" style={{flex: '0 0 380px', maxWidth: '100%', minWidth: 0, backgroundColor: '#fffcf9', padding: '1.5rem', borderRadius: '16px', border: '1px solid #faeedd', boxSizing: 'border-box'}}>
                        <h3 style={{fontFamily: 'var(--font-title)', marginBottom: '1.2rem', color: '#b97a66', fontSize: '1.4rem'}}>Write a Review</h3>
                        <form onSubmit={submitReview}>
                            {reviewFormError && (
                                <div style={{backgroundColor: '#ffebee', color: '#c62828', padding: '1rem', borderRadius: '6px', marginBottom: '1.5rem', fontSize:'0.9rem'}}>
                                    {reviewFormError}
                                </div>
                            )}
                            
                            <div style={{marginBottom: '1.25rem'}}>
                                <label style={{display: 'block', marginBottom: '0.4rem', fontSize: '0.88rem', color: '#555', fontWeight: '500'}}>Rating</label>
                                <div className="review-star-rating">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <span 
                                            key={star} 
                                            onClick={() => setRating(star)}
                                            className={`review-star-btn ${star <= rating ? 'active' : ''}`}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div style={{marginBottom: '1.25rem'}}>
                                <label style={{display: 'block', marginBottom: '0.4rem', fontSize: '0.88rem', color: '#555', fontWeight: '500'}}>Your Review</label>
                                <textarea 
                                    rows="4" 
                                    className="review-textarea"
                                    placeholder="What did you like about this product? Share your experience with fit, fabric & style..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    required
                                ></textarea>
                            </div>

                            <button 
                                type="submit" 
                                className="review-submit-btn" 
                                disabled={reviewLoading}
                            >
                                {reviewLoading ? 'Submitting Review...' : 'Submit Review'}
                            </button>
                            {!authUser && (
                                <p style={{fontSize: '0.8rem', color: '#888', marginTop: '1rem', textAlign: 'center'}}>
                                    You will review as a guest. <Link to="/auth" style={{color: 'var(--color-peach)'}}>Sign in</Link> to link this to your profile.
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
                    title="Wishlist"
                    style={{
                        border: isWished ? '2px solid #e53935' : '1.5px solid #ddd',
                        backgroundColor: isWished ? '#fff5f5' : '#fff',
                        color: isWished ? '#e53935' : '#444',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill={isWished ? "#e53935" : "none"} stroke={isWished ? "#e53935" : "currentColor"} strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>
                <button 
                    type="button"
                    onClick={handleShare}
                    className="mobile-sticky-wish-btn"
                    title="Share Product"
                    style={{
                        border: '1.5px solid #ddd',
                        backgroundColor: '#fff',
                        color: '#444',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginLeft: '8px'
                    }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="18" cy="5" r="3"></circle>
                        <circle cx="6" cy="12" r="3"></circle>
                        <circle cx="18" cy="19" r="3"></circle>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                    </svg>
                </button>
                <button 
                    className="btn btn-primary mobile-sticky-add-btn" 
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                >
                    {isOutOfStock ? 'Out of Stock' : `Add to Cart ${quantity > 1 ? `(${quantity})` : ''} - ₹${(product.price * quantity).toLocaleString('en-IN')}`}
                </button>
            </div>

            <SizeSelectionModal
                isOpen={showSizeModal}
                onClose={() => setShowSizeModal(false)}
                product={product}
                selectedSize={modalSelectedSize}
                onSelectSize={setModalSelectedSize}
                onAddToCart={handleModalAddToCart}
            />
        </div>
    );
};

export default ProductDetails;
