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
            setMsg(`Applied: ₹${amt} off!`);
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
                            <div style={{fontWeight:'500'}}>₹{item.price.toLocaleString('en-IN')}</div>
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
                <h3 style={{marginTop: '1rem'}}>Amount to Pay: ₹{finalTotal.toLocaleString('en-IN')}</h3>
            </div>
            <button className="btn btn-primary" onClick={placeOrder} style={{marginTop: '2rem', width: '100%'}}>Pay & Secure Order</button>
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
            </Routes>
            <Footer />
        </HashRouter>
    );
};


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
