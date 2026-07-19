const { useState, useEffect } = React;
const { HashRouter, Routes, Route, Link, useParams, useNavigate } = ReactRouterDOM;

// --- DUMMY FALLBACK DATA ---
const fallbackProducts = [
    { id: "1", name: "Pastel Peach Anarkali", description: "A delicate premium silk Kurthi in soft peach, featuring intricate silver zari work.", price: 10999, imageUrl: "./images/kurthi_peach.png" },
    { id: "2", name: "Mint Breeze Straight Cut", description: "Minimalist mint green kurthi perfect for a fresh, elegant everyday look.", price: 5499, imageUrl: "./images/kurthi_mint.png" },
    { id: "3", name: "Lavender Dream Tunic", description: "Indo-western fusion tunic in soft lavender. Premium georgette fabric.", price: 8999, imageUrl: "./images/kurthi_lavender.png" },
    { id: "4", name: "Powder Blue Elegance", description: "A sophisticated powder blue kurthi with minimal floral embroidery.", price: 12499, imageUrl: "./images/kurthi_blue.png" }
];

// --- COMPONENTS ---

const Navbar = ({ cartCount }) => (
    <nav className="navbar">
        <div className="nav-container">
            <Link to="/" className="logo">The Ethnic Touch</Link>
            <ul className="nav-links">
                <li><Link to="/">Home</Link></li>
                <li><a href="/#collection">Collection</a></li>
                <li><Link to="/cart" className="cart-btn">Cart ({cartCount})</Link></li>
            </ul>
        </div>
    </nav>
);

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

const ProductDetails = ({ products, addToCart }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const product = products.find(p => p.id === id);

    if (!product) return <div style={{padding: '10rem 5%', textAlign:'center'}}><h2>Product Not Found</h2></div>;

    const handleBack = (e) => {
        e.preventDefault();
        navigate('/');
    };

    return (
        <div style={{padding: '8rem 5% 4rem', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh'}}>
            <a href="#" onClick={handleBack} style={{display:'inline-block', marginBottom:'2rem', color:'var(--color-text-light)', textDecoration:'none'}}>&larr; Back to Collection</a>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center'}}>
                <div style={{flex: 1, minWidth: '300px', borderRadius: 'var(--border-radius-lg)', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.05)'}}>
                    <img src={product.imageUrl} alt={product.name} style={{width: '100%', display: 'block'}} />
                </div>
                <div style={{flex: 1, minWidth: '300px'}}>
                    <h1 style={{fontSize: '3rem', marginBottom: '1rem'}}>{product.name}</h1>
                    <p style={{fontSize: '1.2rem', marginBottom: '2rem', lineHeight: '1.8'}}>{product.description}</p>
                    <div style={{fontSize: '2rem', fontWeight: '500', marginBottom: '3rem'}}>₹{product.price.toLocaleString('en-IN')}</div>
                    <button className="btn btn-primary" onClick={() => addToCart(product)} style={{fontSize: '1.1rem', padding: '1rem 3rem'}}>
                        Add to Cart
                    </button>
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
                                <p style={{color:'var(--color-text-light)', fontSize:'0.9rem'}}>{item.description.substring(0, 50)}...</p>
                            </div>
                            <div style={{fontWeight:'500'}}>₹{item.price.toLocaleString('en-IN')}</div>
                        </div>
                    ))}
                                 {/* Beautiful, Animated Premium Tiered Reward Panel */}
                    {tiers.length > 0 && (
                        <div className="gift-system-card">
                            <h3 className="gift-system-title">
                                <span>🎁</span> Premium Tiered Rewards
                            </h3>

                            {/* Milestone Information Banner */}
                            {nextTier ? (
                                <div className="gift-milestone-banner progress">
                                    <span style={{fontSize: '1.4rem'}}>✨</span>
                                    <div style={{flex: 1, fontSize: '0.95rem'}}>
                                        Add <strong style={{color: 'var(--color-primary)'}}>₹{remaining.toLocaleString('en-IN')}</strong> more to unlock the next milestone: <strong>{nextTier.name}</strong>!
                                    </div>
                                    <div style={{fontSize: '1.05rem', fontWeight: '600', color: 'var(--color-primary)'}}>
                                        ₹{remaining.toLocaleString('en-IN')} to go
                                    </div>
                                </div>
                            ) : (
                                <div className="gift-milestone-banner unlocked">
                                    <span style={{fontSize: '1.4rem'}}>🎉</span>
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
                                                <span>{isUnlocked ? '🔓' : '🔒'}</span> 
                                                <span>{isUnlocked ? 'Unlocked!' : `Spend ₹${parseInt(t.threshold).toLocaleString('en-IN')}`}</span>
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

const Checkout = ({ cart, discount, clearCart }) => {
    const [email, setEmail] = useState('');
    const [ordering, setOrdering] = useState(false);
    const navigate = useNavigate();

    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const finalTotal = subtotal - (discount?.amt || 0);

    const placeOrder = async () => {
        if (!email) return alert('Email required');
        setOrdering(true);

        const order = {
            customerEmail: email,
            couponCode: discount?.code || '',
            items: cart.map(item => ({
                productId: item.id,
                quantity: 1
            }))
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
                // Redirect user to Mock checkout SPA route (strip '/#' prefix if present)
                let targetUrl = data.checkoutUrl;
                if (targetUrl.startsWith('/#')) {
                    targetUrl = targetUrl.substring(2);
                }
                navigate(targetUrl);
            } else {
                // Open live Razorpay standard Checkout dialog modal
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
        <div style={{padding: '8rem 5% 4rem', maxWidth: '600px', margin: '0 auto', minHeight: '80vh'}}>
            <h1>Checkout</h1>
            <div style={{margin: '2rem 0'}}>
                <label style={{display: 'block', marginBottom: '0.5rem'}}>Email Address</label>
                <input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    placeholder="you@example.com"
                    style={{padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', width: '100%'}}
                    disabled={ordering}
                />
            </div>
            <div style={{padding: '2rem', border: '1px solid #eee', borderRadius: '8px'}}>
                <p>Items in order: {cart.length}</p>
                <h3 style={{marginTop: '1rem'}}>Amount to Pay: ₹{finalTotal.toLocaleString('en-IN')}</h3>
            </div>
            <button 
                className="btn btn-primary" 
                onClick={placeOrder} 
                style={{marginTop: '2rem', width: '100%'}}
                disabled={ordering}
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
                    💳 Razorpay Simulator
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
                    🚀 Order has been approved and automatically shipped!
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
                                <h4 style={{color: '#e65100', margin: '0 0 0.5rem'}}>🎁 Free Gift Earned!</h4>
                                <p style={{margin:0, fontSize:'0.9rem', color: '#5d4037'}}>
                                    Congratulations! You've unlocked a free <strong>{displayGift}</strong>. It will be packaged and shipped together with your items!
                                </p>
                            </div>
                        ) : (
                            <div>
                                <h4 style={{color: 'var(--color-peach)', margin: '0 0 0.5rem'}}>🎟️ Surprise Gift Coupon Distributed!</h4>
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

// --- MAIN APP ---

const App = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState([]);
    const [discount, setDiscount] = useState(null);

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

    const addToCart = (product) => {
        setCart(prev => [...prev, product]);
    };

    const clearCart = () => {
        setCart([]);
        setDiscount(null);
    };

    return (
        <HashRouter>
            <Navbar cartCount={cart.length} />
            <Routes>
                <Route path="/" element={<Home products={products} loading={loading} />} />
                <Route path="/product/:id" element={<ProductDetails products={products} addToCart={addToCart} />} />
                <Route path="/cart" element={<Cart cart={cart} onApplyCoupon={setDiscount} discount={discount} />} />
                <Route path="/checkout" element={<Checkout cart={cart} discount={discount} clearCart={clearCart} />} />
                <Route path="/mock-payment" element={<MockPayment onPaymentSuccess={() => {}} />} />
                <Route path="/checkout-success" element={<CheckoutSuccess />} />
            </Routes>
            <Footer />
        </HashRouter>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
