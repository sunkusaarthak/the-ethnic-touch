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

const Navbar = ({ cartCount, authUser, authLoading }) => (
    <nav className="navbar">
        <div className="nav-container">
            <Link to="/" className="logo">The Ethnic Touch</Link>
            <ul className="nav-links">
                <li><Link to="/">Home</Link></li>
                <li><a href="/#collection">Collection</a></li>
                <li><Link to="/cart" className="cart-btn">Cart ({cartCount})</Link></li>
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
                                <div className="product-price">Γé╣{product.price.toLocaleString('en-IN')}</div>
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
                    <div style={{fontSize: '2rem', fontWeight: '500', marginBottom: '3rem'}}>Γé╣{product.price.toLocaleString('en-IN')}</div>
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
    
    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const finalTotal = subtotal - (discount?.amt || 0);

    const handleCoupon = async () => {
        try {
            const res = await fetch('/api/coupons/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: couponCode, total: subtotal })
            });
            if (!res.ok) {
                const err = await res.text();
                setMsg(err);
                return;
            }
            const coupon = await res.json();
            let amt = 0;
            if (coupon.type === 'fixed') amt = coupon.value;
            else amt = (subtotal * coupon.value) / 100;
            
            onApplyCoupon({ code: coupon.code, amt });
            setMsg(`Applied: Γé╣${amt} off!`);
        } catch (err) {
            setMsg('Validation failed');
        }
    };

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
                            <div style={{fontWeight:'500'}}>Γé╣{item.price.toLocaleString('en-IN')}</div>
                        </div>
                    ))}
                    
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
                        <p>Subtotal: Γé╣{subtotal.toLocaleString('en-IN')}</p>
                        {discount && <p style={{color: 'green'}}>Discount: -Γé╣{discount.amt.toLocaleString('en-IN')}</p>}
                        <h3 style={{margin:'1rem 0 2rem'}}>Total: Γé╣{finalTotal.toLocaleString('en-IN')}</h3>
                        <Link to="/checkout" className="btn btn-primary">Proceed to Checkout</Link>
                    </div>
                </div>
            )}
        </div>
    );
};

const Checkout = ({ cart, discount, clearCart }) => {
    const [email, setEmail] = useState('');
    const [done, setDone] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [gift, setGift] = useState('');

    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const finalTotal = subtotal - (discount?.amt || 0);

    const placeOrder = async () => {
        if (!email) return alert('Email required');
        const order = {
            customerEmail: email,
            totalAmount: finalTotal,
            discountAmt: discount?.amt || 0,
            couponCode: discount?.code || ''
        };
        
        const res = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order)
        });
        
        if (res.ok) {
            const data = await res.json();
            setOrderId(data.id);
            if (finalTotal > 5000) setGift(`GFT-${data.id.slice(-4)}`);
            setDone(true);
            clearCart();
        }
    };

    if (done) return (
        <div style={{padding: '8rem 5% 4rem', maxWidth: '600px', margin: '0 auto', minHeight: '80vh', textAlign:'center'}}>
            <h1>Success!</h1>
            <div style={{padding: '3rem', backgroundColor: 'var(--color-mint)', borderRadius: 'var(--border-radius-lg)', margin: '2rem 0'}}>
                <h2>Order #{orderId} Placed</h2>
                <p style={{marginTop:'1rem'}}>We've sent a confirmation to {email}.</p>
                {gift && (
                    <div style={{marginTop: '2rem', padding: '1rem', border: '2px dashed var(--color-peach)', borderRadius: '8px'}}>
                        <h4 style={{color: 'var(--color-peach)'}}>Surprise Gift Coupon!</h4>
                        <p>Use code <strong>{gift}</strong> for 15% off your next order.</p>
                    </div>
                )}
            </div>
            <Link to="/" className="btn btn-primary">Return to Store</Link>
        </div>
    );

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
                />
            </div>
            <div style={{padding: '2rem', border: '1px solid #eee', borderRadius: '8px'}}>
                <p>Items in order: {cart.length}</p>
                <h3 style={{marginTop: '1rem'}}>Amount to Pay: Γé╣{finalTotal.toLocaleString('en-IN')}</h3>
            </div>
            <button className="btn btn-primary" onClick={placeOrder} style={{marginTop: '2rem', width: '100%'}}>Pay & Secure Order</button>
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
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        preferredSize: '',
        styleNotes: ''
    });

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

    useEffect(() => {
        if (!authUser) return;

        const loadProfile = async () => {
            try {
                const response = await fetch('/api/profile/me', {
                    headers: { 'X-User-Id': authUser.uid }
                });
                if (response.status === 404) {
                    setMode('create');
                    setLoading(false);
                    return;
                }
                if (!response.ok) {
                    throw new Error('Unable to load profile');
                }
                const profile = await response.json();
                setForm({
                    fullName: profile.fullName || '',
                    phone: profile.phone || '',
                    address: profile.address || '',
                    city: profile.city || '',
                    state: profile.state || '',
                    zipCode: profile.zipCode || '',
                    preferredSize: profile.preferredSize || '',
                    styleNotes: profile.styleNotes || ''
                });
                setMode('edit');
            } catch (error) {
                setMessage({ type: 'error', text: 'We could not load your profile right now.' });
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
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
                phone: profile.phone || '',
                address: profile.address || '',
                city: profile.city || '',
                state: profile.state || '',
                zipCode: profile.zipCode || '',
                preferredSize: profile.preferredSize || '',
                styleNotes: profile.styleNotes || ''
            });
            setMode('edit');
            setSuccessVisible(true);
            redirectTimer.current = window.setTimeout(() => {
                navigate('/');
            }, 2600);
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
                    <a href="./login.html" className="btn btn-primary">Go to Sign In</a>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-shell">
            <div className="profile-card">
                <div className="profile-header">
                    <div>
                        <p className="profile-eyebrow">Your account</p>
                        <h1>{mode === 'create' ? 'Complete your profile' : 'Your profile'}</h1>
                        <p className="profile-help">These details help us personalize orders, styling suggestions, and delivery preferences.</p>
                    </div>
                </div>

                {message.text ? <div className={`profile-message ${message.type}`}>{message.text}</div> : null}

                {loading ? (
                    <p className="profile-help">Loading your profile…</p>
                ) : successVisible ? (
                    <div className="profile-success-state" role="status" aria-live="polite">
                        <div className="profile-success-card">
                            <div className="profile-success-badge" aria-hidden="true">
                                <span className="profile-success-check">✓</span>
                            </div>
                            <h2>Profile completed successfully!</h2>
                            <p>You're all set. Let's start shopping.</p>
                        </div>
                    </div>
                ) : (
                    <form className="profile-form" onSubmit={handleSubmit} aria-busy={saving}>
                        <div className="profile-grid">
                            <label className="profile-field">
                                <span>Full name *</span>
                                <input className="profile-input" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required minLength="2" maxLength="80" autoComplete="name" />
                            </label>
                            <label className="profile-field">
                                <span>Phone *</span>
                                <input type="tel" className="profile-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required minLength="8" maxLength="15" autoComplete="tel" />
                            </label>
                            <label className="profile-field profile-span-2">
                                <span>Address *</span>
                                <input className="profile-input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required minLength="5" autoComplete="street-address" />
                            </label>
                            <label className="profile-field">
                                <span>City *</span>
                                <input className="profile-input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required minLength="2" autoComplete="address-level2" />
                            </label>
                            <label className="profile-field">
                                <span>State *</span>
                                <input className="profile-input" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} required minLength="2" autoComplete="address-level1" />
                            </label>
                            <label className="profile-field">
                                <span>ZIP / Postal code *</span>
                                <input className="profile-input" value={form.zipCode} onChange={(e) => setForm({ ...form, zipCode: e.target.value })} required minLength="3" maxLength="12" autoComplete="postal-code" />
                            </label>
                            <label className="profile-field">
                                <span>Preferred size</span>
                                <select className="profile-input" value={form.preferredSize} onChange={(e) => setForm({ ...form, preferredSize: e.target.value })}>
                                    <option value="">Select</option>
                                    <option value="XS">XS</option>
                                    <option value="S">S</option>
                                    <option value="M">M</option>
                                    <option value="L">L</option>
                                    <option value="XL">XL</option>
                                </select>
                            </label>
                            <label className="profile-field profile-span-2">
                                <span>Style notes</span>
                                <textarea className="profile-input" rows="4" maxLength="500" value={form.styleNotes} onChange={(e) => setForm({ ...form, styleNotes: e.target.value })} />
                            </label>
                        </div>
                        <div className="profile-actions">
                            <button className="btn btn-primary" disabled={saving} type="submit">
                                {saving ? 'Saving...' : mode === 'create' ? 'Save profile' : 'Update profile'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

// --- MAIN APP ---

const App = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState([]);
    const [discount, setDiscount] = useState(null);
    const [authUser, setAuthUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

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
    };

    const clearCart = () => {
        setCart([]);
        setDiscount(null);
    };

    return (
        <HashRouter>
            <Navbar cartCount={cart.length} authUser={authUser} authLoading={authLoading} />
            <Routes>
                <Route path="/" element={<Home products={products} loading={loading} />} />
                <Route path="/product/:id" element={<ProductDetails products={products} addToCart={addToCart} />} />
                <Route path="/cart" element={<Cart cart={cart} onApplyCoupon={setDiscount} discount={discount} />} />
                <Route path="/checkout" element={<Checkout cart={cart} discount={discount} clearCart={clearCart} />} />
                <Route path="/profile" element={<ProfilePage authUser={authUser} />} />
            </Routes>
            <Footer />
        </HashRouter>
    );
};


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
