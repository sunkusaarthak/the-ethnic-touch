const { useState, useEffect, useRef } = React;
const { HashRouter, Routes, Route, Link, useParams, useNavigate } = ReactRouterDOM;

const firebaseConfig = {
    apiKey: "AIzaSyDSrS3zywg8ao1lvK9NWmy1RDR33Nim2h8",
    authDomain: "the-ethnic-touch.firebaseapp.com",
    projectId: "the-ethnic-touch",
    storageBucket: "the-ethnic-touch.firebasestorage.app",
    messagingSenderId: "565024605742",
    appId: "1:565024605742:web:0452b9b88a65be9d67c1bf",
    measurementId: "G-KP2NETS58F"
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

const Navbar = ({ cartCount, authUser, authLoading }) => {
    const [animate, setAnimate] = useState(false);
    
    useEffect(() => {
        if (cartCount > 0) {
            setAnimate(true);
            const timer = setTimeout(() => setAnimate(false), 450);
            return () => clearTimeout(timer);
        }
    }, [cartCount]);

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="logo">The Ethnic Touch</Link>
                <ul className="nav-links">
                    <li><Link to="/">Home</Link></li>
                    <li><a href="/#collection">Collection</a></li>
                    <li>
                        <Link to="/cart" className="cart-btn" style={{ display: 'inline-flex', alignItems: 'center' }}>
                            Cart <span className={animate ? 'cart-animated' : ''} style={{ marginLeft: '4px' }}>({cartCount})</span>
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

const Home = ({ products, loading }) => (
    <div>
        <header id="home" className="hero">
            <div className="hero-content">
                <h1>Minimalist Indo-Western Elegance</h1>
                <p>A highly curated, premium collection of pastel kurthis crafted for the modern woman. Delicate, fresh, and beautiful.</p>
                <a href="#collection" className="btn btn-primary">Shop the Collection</a>
            </div>
            <div className="hero-image">
                <img src="./images/hero_banner.png" alt="Premium Indo-Western Pastel Kurthi Fashion Model" />
            </div>
        </header>

        <section id="collection" className="collection-section">
            <div className="section-header">
                <h2>Our Premium Selection</h2>
                <p>Meticulously designed for unmatched quality and comfort.</p>
            </div>
            <div className="product-grid">
                {loading ? (
                    <div className="loading-state" style={{gridColumn: '1/-1', textAlign:'center'}}>Loading premium selection...</div>
                ) : (
                    products.map(product => (
                        <Link to={`/product/${product.id}`} key={product.id} className="product-card">
                            <div className="product-image-container">
                                <img src={product.imageUrl} alt={product.name} className="product-image" />
                            </div>
                            <div className="product-info">
                                <div>
                                    <h3 className="product-name">{product.name}</h3>
                                    <p className="product-desc">{product.description}</p>
                                </div>
                                <div className="product-price">₹{product.price.toLocaleString('en-IN')}</div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </section>
    </div>
);

const ProductDetails = ({ products, addToCart, authUser }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const product = products.find(p => p.id === id);

    const [activeImage, setActiveImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState('');
    const [reviews, setReviews] = useState([]);
    
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [reviewFormError, setReviewFormError] = useState('');
    const [reviewLoading, setReviewLoading] = useState(false);

    useEffect(() => {
        if (product && product.sizes && product.sizes.length > 0) {
            setSelectedSize(product.sizes[0]);
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

    const galleryImages = (product.galleryImages && product.galleryImages.length > 0) 
        ? product.galleryImages 
        : [product.imageUrl];

    const handleBack = (e) => {
        e.preventDefault();
        navigate('/');
    };

    const handleAddToCart = () => {
        addToCart({ ...product, size: selectedSize });
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

    return (
        <div style={{padding: '8rem 5% 4rem', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh'}}>
            <a href="#" onClick={handleBack} style={{display:'inline-block', marginBottom:'2rem', color:'var(--color-text-light)', textDecoration:'none'}}>&larr; Back to Collection</a>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'flex-start'}}>
                
                {/* Image Slider Gallery */}
                <div style={{flex: 1, minWidth: '300px'}}>
                    <div className="gallery-main-container" style={{
                        borderRadius: 'var(--border-radius-lg)', 
                        overflow: 'hidden', 
                        boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                        marginBottom: '1rem',
                        aspectRatio: '3/4',
                        backgroundColor: '#fafafa'
                    }}>
                        <img className="gallery-main-img" src={galleryImages[activeImage]} alt={product.name} style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} />
                    </div>
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

                {/* Product Summary & Actions */}
                <div style={{flex: 1, minWidth: '300px'}}>
                    <h1 style={{fontSize: '2.8rem', marginBottom: '0.5rem', fontFamily: 'var(--font-title)'}}>{product.name}</h1>
                    
                    {reviews.length > 0 && (
                        <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem'}}>
                            <div style={{color: '#d4af37', fontSize: '1.2rem', letterSpacing: '2px'}}>
                                {'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))}
                            </div>
                            <span style={{color: 'var(--color-text-light)', fontSize: '0.9rem'}}>{avgRating} ({reviews.length} reviews)</span>
                        </div>
                    )}

                    <div style={{fontSize: '2rem', fontWeight: '500', marginBottom: '2rem', color: 'var(--color-text)'}}>
                        ₹{product.price.toLocaleString('en-IN')}
                    </div>
                    
                    <p style={{fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.8', color: '#555'}}>{product.description}</p>
                    
                    {/* Size Selector */}
                    {product.sizes && product.sizes.length > 0 && (
                        <div style={{marginBottom: '2.5rem'}}>
                            <h4 style={{marginBottom: '1rem', fontSize: '1rem', color: '#333'}}>Select Size</h4>
                            <div style={{display: 'flex', gap: '0.8rem', flexWrap: 'wrap'}}>
                                {product.sizes.map((size) => (
                                    <button 
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`size-pill ${selectedSize === size ? 'active' : ''}`}
                                        style={{
                                            padding: '0.8rem 1.5rem',
                                            borderRadius: '6px',
                                            border: '1px solid #ddd',
                                            backgroundColor: '#fff',
                                            color: '#555',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            fontSize: '1rem'
                                        }}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <button 
                        className="btn btn-primary" 
                        onClick={handleAddToCart} 
                        style={{fontSize: '1.1rem', padding: '1.2rem 3rem', width: '100%', marginBottom: '3rem'}}
                    >
                        Add to Cart {selectedSize && `- Size ${selectedSize}`}
                    </button>
                </div>
            </div>

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

        </div>
    );
};

const Cart = ({ cart, onApplyCoupon, discount }) => {
    const [couponCode, setCouponCode] = useState('');
    const [msg, setMsg] = useState('');
    const [tiers, setTiers] = useState([]);
    
    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const finalTotal = subtotal - (discount?.value || 0);

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
        <div style={{padding: '8rem 5% 4rem', maxWidth: '800px', margin: '0 auto', minHeight: '80vh'}}>
            <h1 style={{marginBottom: '2rem'}}>Your Cart</h1>
            {cart.length === 0 ? (
                <p>Your cart is empty. <Link to="/">Continue shopping.</Link></p>
            ) : (
                <div>
                    {cart.map((item, idx) => (
                        <div key={idx} style={{display:'flex', alignItems:'center', gap:'1.5rem', marginBottom:'1.5rem', borderBottom:'1px solid #eee', paddingBottom:'1.5rem'}}>
                            <img src={item.imageUrl} alt={item.name} style={{width:'80px', height:'80px', borderRadius:'8px', objectFit:'cover'}} />
                            <div style={{flex: 1}}>
                                <h3 style={{fontFamily:'var(--font-body)', fontWeight:'500'}}>{item.name}</h3>
                                {item.size && <span style={{display: 'inline-block', backgroundColor: '#fff0e9', color: '#b97a66', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', marginTop: '0.3rem', fontWeight: '500'}}>Size: {item.size}</span>}
                                <p style={{color:'var(--color-text-light)', fontSize:'0.9rem', marginTop: '0.4rem'}}>{item.description.substring(0, 50)}...</p>
                            </div>
                            <div style={{fontWeight:'500'}}>₹{item.price.toLocaleString('en-IN')}</div>
                        </div>
                    ))}
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

    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const finalTotal = subtotal - (discount?.amt || 0);

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
        if (!email) return alert('Email required');
        
        let activeAddr = null;
        if (authUser && addresses.length > 0) {
            activeAddr = addresses.find(a => a.id === selectedAddressID);
        }
        
        if (!activeAddr) {
            return alert('Please select or add a shipping address before paying.');
        }

        setOrdering(true);

        const order = {
            customerEmail: email,
            couponCode: discount?.code || '',
            items: cart.map(item => ({
                productId: item.id,
                quantity: 1,
                size: item.size || ''
            })),
            shippingName: activeAddr.fullName,
            shippingPhone: activeAddr.phone,
            shippingAddress: activeAddr.addressLine,
            shippingCity: activeAddr.city,
            shippingState: activeAddr.state,
            shippingZipCode: activeAddr.zipCode
        };
        
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(order)
            });
            
            if (!res.ok) {
                const errData = await res.json();
                alert(errData.error || 'Failed to create order');
                setOrdering(false);
                return;
            }

            const data = await res.json();

            if (data.checkoutUrl !== "razorpay") {
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
                                    tracking: verifyData.trackingNumber 
                                } 
                            });
                        } else {
                            alert("Payment verification check failed. Please verify with Support.");
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
            alert("Error placing order.");
            setOrdering(false);
        }
    };

    return (
        <div style={{padding: '8rem 5% 4rem', maxWidth: '680px', margin: '0 auto', minHeight: '80vh'}}>
            <h1 style={{fontFamily: 'var(--font-title)', color: 'var(--color-peach)', marginBottom: '1.5rem'}}>Checkout</h1>
            
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

            <div style={{padding: '2rem', border: '1px solid #eee', borderRadius: '8px', background: '#fff', marginBottom: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.02)'}}>
                <h3 style={{fontSize: '1rem', fontWeight: 600, marginBottom: '1rem'}}>Order Summary</h3>
                <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem'}}>Items in cart: {cart.length}</p>
                <h4 style={{fontSize: '1.1rem', fontWeight: 700, color: '#333'}}>Total to Pay: ₹{finalTotal.toLocaleString('en-IN')}</h4>
            </div>

            <div style={{marginBottom: '2rem'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
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
                    <form onSubmit={handleAddAddress} style={{background: '#fcfcfc', border: '1px solid #eee', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem'}}>
                        <h4 style={{fontSize: '0.95rem', fontWeight: 600, marginBottom: '1rem'}}>New Shipping Address</h4>
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
                                <input className="profile-input" value={shippingForm.zipCode} onChange={e => setShippingForm({...shippingForm, zipCode: e.target.value})} required />
                            </label>
                        </div>
                        <button className="btn btn-primary" type="submit" style={{marginTop: '1.2rem', padding: '0.6rem 1.2rem'}}>Save and Use Address</button>
                    </form>
                )}

                {addresses.length === 0 ? (
                    <div style={{background: '#fafafa', border: '1px dashed #ccc', padding: '2rem', borderRadius: '8px', textAlign: 'center'}}>
                        <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '1rem'}}>You don't have any saved shipping addresses.</p>
                        {!showNewAddressForm && authUser && (
                            <button className="btn btn-primary" onClick={() => setShowNewAddressForm(true)}>+ Add Shipping Address</button>
                        )}
                        {!authUser && (
                            <p style={{fontSize: '0.85rem', color: '#999'}}>Please sign in to save and manage shipping addresses.</p>
                        )}
                    </div>
                ) : (
                    <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '1rem'}}>
                        {addresses.map(addr => {
                            const isSelected = selectedAddressID === addr.id;
                            return (
                                <div 
                                    key={addr.id} 
                                    onClick={() => setSelectedAddressID(addr.id)}
                                    style={{
                                        border: isSelected ? '2px solid #e4b39b' : '1px solid #ddd', 
                                        borderRadius: '8px', 
                                        padding: '1.2rem', 
                                        background: isSelected ? '#fffcf9' : '#fff', 
                                        cursor: 'pointer',
                                        position: 'relative',
                                        transition: 'all 0.2s ease',
                                        boxShadow: isSelected ? '0 2px 8px rgba(228,179,155,0.1)' : 'none'
                                    }}
                                >
                                    <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.4rem'}}>
                                        <input 
                                            type="radio" 
                                            checked={isSelected} 
                                            onChange={() => setSelectedAddressID(addr.id)} 
                                            style={{cursor: 'pointer', accentColor: '#e4b39b'}} 
                                        />
                                        <h4 style={{fontSize: '0.95rem', fontWeight: 600, margin: 0}}>{addr.fullName}</h4>
                                        {addr.isDefault && <span style={{background: '#ffe5d9', color: '#b97a66', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '20px', fontWeight: 'bold'}}>Default</span>}
                                    </div>
                                    <p style={{fontSize: '0.85rem', color: '#666', margin: '0.2rem 0 0.2rem 24px', lineHeight: '1.4'}}>{addr.addressLine}</p>
                                    <p style={{fontSize: '0.85rem', color: '#666', margin: '0 0 0.2rem 24px', lineHeight: '1.4'}}>{addr.city}, {addr.state} - {addr.zipCode}</p>
                                    <p style={{fontSize: '0.85rem', color: '#666', margin: '0 0 0 24px'}}>Phone: {addr.phone}</p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <button 
                className="btn btn-primary" 
                onClick={placeOrder} 
                style={{marginTop: '1.5rem', width: '100%', padding: '1rem'}}
                disabled={ordering || (addresses.length === 0)}
            >
                {ordering ? "Verifying Stock & Routing..." : "Pay & Secure Order"}
            </button>
        </div>
    );
};

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
                        tracking: data.trackingNumber 
                    } 
                });
            } else {
                const errData = await res.json();
                alert("Simulated transaction failed: " + (errData.error || 'Server error'));
                setPaying(false);
            }
        } catch (err) {
            alert("Server connection failed.");
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
    const { orderId, gift, tracking, unlockedGift, giftType } = state;

    if (!orderId) {
        return (
            <div style={{padding: '10rem 5%', textAlign:'center', minHeight:'80vh'}}>
                <h2>No Order Context Found</h2>
                <Link to="/" className="btn btn-primary" style={{marginTop:'1.5rem', display:'inline-block'}}>Back to Catalog</Link>
            </div>
        );
    }

    const displayGift = unlockedGift || gift;
    const isPhysical = giftType === 'physical';

    return (
        <div style={{padding: '8rem 5% 4rem', maxWidth: '600px', margin: '0 auto', minHeight: '80vh', textAlign:'center'}}>
            <div style={{
                fontSize: '5rem',
                color: '#2e7d32',
                marginBottom: '1rem'
            }}>✓</div>
            <h1 style={{fontFamily:'var(--font-title)', marginBottom: '1rem'}}>Payment Success!</h1>
            <div style={{padding: '3rem', backgroundColor: '#f4fbf7', border: '1px solid #c8e6c9', borderRadius: 'var(--border-radius-lg)', margin: '2rem 0'}}>
                <h2 style={{color: '#2e7d32'}}>Order #{orderId} Confirmed</h2>
                <p style={{marginTop:'1.5rem', fontSize:'1.05rem', color:'#4caf50', fontWeight:'500'}}>
                    Order has been approved and automatically shipped.
                </p>
                {tracking && (
                    <div style={{
                        marginTop: '1.5rem',
                        padding: '1rem',
                        background: 'white',
                        border: '1px solid #a5d6a7',
                        borderRadius: '6px',
                        display: 'inline-block'
                    }}>
                        <p style={{margin: 0, fontSize: '0.9rem', color: '#555'}}>Carrier Tracking Number:</p>
                        <strong style={{fontSize: '1.2rem', color: '#2e7d32'}}>{tracking}</strong>
                    </div>
                )}
                {displayGift && (
                    <div style={{marginTop: '2rem', padding: '1.5rem', border: '2px dashed var(--color-peach)', backgroundColor: '#fffdfb', borderRadius: '8px'}}>
                        {isPhysical ? (
                            <div>
                                <h4 style={{color: '#e65100', margin: '0 0 0.5rem'}}>Free Gift Earned!</h4>
                                <p style={{margin:0, fontSize:'0.9rem', color: '#5d4037'}}>
                                    Congratulations! You've unlocked a free <strong>{displayGift}</strong>. It will be packaged and shipped together with your items!
                                </p>
                            </div>
                        ) : (
                            <div>
                                <h4 style={{color: 'var(--color-peach)', margin: '0 0 0.5rem'}}>Surprise Gift Coupon Distributed!</h4>
                                <p style={{margin:0, fontSize:'0.9rem'}}>Use code <strong>{displayGift}</strong> on your next purchase.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <Link to="/" className="btn btn-primary" style={{padding: '1rem 3rem'}}>Return to Store</Link>
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
                                                <div>
                                                    <span style={{ fontSize: '0.8rem', color: '#888' }}>Order ID:</span>
                                                    <span style={{ fontWeight: '600', fontFamily: 'monospace', fontSize: '0.95rem', marginLeft: '0.4rem' }}>{order.id}</span>
                                                </div>
                                                <div>
                                                    <span style={{ fontSize: '0.85rem', color: '#b97a66', fontWeight: '500', textTransform: 'uppercase' }}>{order.status}</span>
                                                </div>
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                                                <div>
                                                    <h5 style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', color: '#888', textTransform: 'uppercase' }}>Items</h5>
                                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                                        {order.items && order.items.map(it => (
                                                            <li key={it.productId} style={{ fontSize: '0.9rem', color: '#333', padding: '0.4rem 0', display: 'flex', justifyContent: 'space-between' }}>
                                                                <span>{it.productName} <strong>x {it.quantity}</strong></span>
                                                                <span>₹{it.priceAtQty.toLocaleString('en-IN')}</span>
                                                            </li>
                                                        ))}
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
                                                <div style={{ marginTop: '1rem', background: '#eaf3fc', padding: '0.75rem 1rem', borderRadius: '6px' }}>
                                                    <span style={{ fontSize: '0.85rem', color: '#1a5695' }}>
                                                        Shipping Carrier Tracking Number: <strong style={{ fontFamily: 'monospace' }}>{order.trackingNumber}</strong>
                                                    </span>
                                                </div>
                                            )}

                                            {order.unlockedGift && (
                                                <div style={{ marginTop: '0.8rem', background: '#fff9e6', padding: '0.75rem 1rem', border: '1px dashed #fcd34d', borderRadius: '6px' }}>
                                                    <span style={{ fontSize: '0.85rem', color: '#854d0e' }}>
                                                        Reward Unlocked: <strong>{order.unlockedGift}</strong>
                                                    </span>
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
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
                                    {coupons.map(c => (
                                        <div key={c.id} style={{
                                            border: '2px dashed #e4b39b',
                                            padding: '1.5rem',
                                            borderRadius: '10px',
                                            backgroundColor: '#fffcf9',
                                            textAlign: 'center',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}>
                                            <div style={{
                                                position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
                                                background: 'linear-gradient(90deg, #e4b39b, #b97a66)'
                                            }} />
                                            <strong style={{
                                                display: 'block', fontSize: '1.2rem', fontFamily: 'monospace',
                                                color: '#b97a66', letterSpacing: '1px', border: '1px dashed #e4b39b',
                                                padding: '0.5rem', borderRadius: '4px', backgroundColor: '#fff',
                                                margin: '0.5rem 0'
                                            }}>{c.code}</strong>
                                            
                                            <h4 style={{ margin: '0.8rem 0 0.2rem', fontSize: '1.2rem', fontFamily: 'var(--font-title)' }}>
                                                {c.type === 'percentage' ? `${c.value}% OFF` : `₹${c.value} OFF`}
                                            </h4>
                                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#888' }}>
                                                Min order of ₹{c.minOrder}
                                            </p>
                                            <div style={{
                                                marginTop: '1rem', fontSize: '0.8rem', color: '#555',
                                                borderTop: '1px dashed #eee', paddingTop: '0.8rem'
                                            }}>
                                                Status: <strong style={{ color: c.isActive ? '#15803d' : '#b91c1c' }}>{c.isActive ? 'Active' : 'Redeemed'}</strong>
                                                <div style={{ fontSize: '0.75rem', color: '#777', marginTop: '0.2rem' }}>
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
    const [toast, setToast] = useState({ visible: false, message: '' });
    const toastTimerRef = useRef(null);

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

    const addToCart = (product) => {
        setCart(prev => [...prev, product]);
        
        // Premium toast alert
        if (toastTimerRef.current) {
            window.clearTimeout(toastTimerRef.current);
        }
        setToast({ visible: true, message: `Added "${product.name}" to your cart.` });
        toastTimerRef.current = window.setTimeout(() => {
            setToast({ visible: false, message: '' });
        }, 3000);
    };

    const clearCart = () => {
        setCart([]);
        setDiscount(null);
    };

    return (
        <HashRouter>
            <ScrollToTop />
            <Navbar cartCount={cart.length} authUser={authUser} authLoading={authLoading} />
            <Routes>
                <Route path="/" element={<Home products={products} loading={loading} />} />
                <Route path="/product/:id" element={<ProductDetails products={products} addToCart={addToCart} authUser={authUser} />} />
                <Route path="/cart" element={<Cart cart={cart} onApplyCoupon={setDiscount} discount={discount} />} />
                <Route path="/checkout" element={<Checkout cart={cart} discount={discount} clearCart={clearCart} authUser={authUser} />} />
                <Route path="/mock-payment" element={<MockPayment onPaymentSuccess={clearCart} />} />
                <Route path="/checkout-success" element={<CheckoutSuccess />} />
                <Route path="/profile" element={<ProfilePage authUser={authUser} />} />
            </Routes>
            <Footer />

            {/* Premium Toast Notification */}
            {toast.visible && (
                <div style={{
                    position: 'fixed',
                    bottom: '30px',
                    right: '30px',
                    backgroundColor: '#fff',
                    border: '1px solid #e4b39b',
                    borderRadius: '6px',
                    padding: '0.9rem 1.4rem',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
                    zIndex: 100000,
                    animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <span style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: '#e4b39b'
                    }}></span>
                    <span style={{ 
                        color: 'var(--color-text)', 
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        fontFamily: 'var(--font-body)'
                    }}>
                        {toast.message}
                    </span>
                </div>
            )}
        </HashRouter>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
