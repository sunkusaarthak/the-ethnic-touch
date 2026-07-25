import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate, Link, useLocation, useParams, Routes, Route, Navigate, HashRouter } from 'react-router-dom';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import PremiumAlertModal from './components/PremiumAlertModal';
import ScrollToTop from './components/ScrollToTop';
import Auth from './pages/Auth';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CheckoutSuccess from './pages/CheckoutSuccess';
import Home from './pages/Home';
import MockPayment from './pages/MockPayment';
import ProductDetails from './pages/ProductDetails';
import ProfilePage from './pages/ProfilePage';
import Shop from './pages/Shop';
import WishlistPage from './pages/WishlistPage';
import { fallbackProducts } from './data/config';
import { auth } from './data/config';

const AppFooterWrapper = () => {
    const location = useLocation();
    if (location.pathname === '/auth') return null;
    return <Footer />;
};

const App = () => {
    console.log('🎯 [DEBUG] App component is rendering!');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState([]);
    const [discount, setDiscount] = useState(null);
    const [authUser, setAuthUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [toastProduct, setToastProduct] = useState(null);
    const toastTimerRef = useRef(null);

    const [wishlist, setWishlist] = useState([]);
    const [globalSearch, setGlobalSearch] = useState('');

    const [alertState, setAlertState] = useState({ isOpen: false, title: '', message: '', type: 'warning' });

    const triggerAlert = (message, title = "Notice", type = "warning") => {
        setAlertState({ isOpen: true, title, message, type });
    };

    const closeAlert = () => {
        setAlertState(prev => ({ ...prev, isOpen: false }));
    };

    useEffect(() => {
        window.customAlert = triggerAlert;
    }, []);

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

    // Sync wishlist & cart from Database or Guest Local Storage
    useEffect(() => {
        const syncUserData = async () => {
            if (authUser) {
                // Merge guest wishlist
                const local = localStorage.getItem('tet_guest_wishlist');
                if (local) {
                    try {
                        const parsed = JSON.parse(local);
                        if (Array.isArray(parsed) && parsed.length > 0) {
                            const ids = parsed.map(p => p.id);
                            await fetch('/api/wishlist/merge', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'X-User-Id': authUser.uid
                                },
                                body: JSON.stringify({ productIds: ids })
                            });
                        }
                    } catch (e) {
                        console.error("Merge error:", e);
                    } finally {
                        localStorage.removeItem('tet_guest_wishlist');
                    }
                }

                // Load wishlist from database persist layer
                try {
                    const res = await fetch('/api/wishlist', {
                        headers: { 'X-User-Id': authUser.uid }
                    });
                    if (res.ok) {
                        const items = await res.json();
                        setWishlist(items || []);
                    }
                } catch (e) {
                    console.error("Fetch wishlist error:", e);
                }

                // Load & merge cart from database persist layer
                const localGuestCart = localStorage.getItem('tet_guest_cart');
                if (localGuestCart) {
                    try {
                        const parsed = JSON.parse(localGuestCart);
                        if (Array.isArray(parsed) && parsed.length > 0) {
                            await fetch('/api/cart/merge', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'X-User-Id': authUser.uid
                                },
                                body: JSON.stringify({
                                    items: parsed.map(item => ({
                                        productId: item.id,
                                        quantity: item.quantity || 1,
                                        size: item.size || ''
                                    }))
                                })
                            });
                            localStorage.removeItem('tet_guest_cart');
                        }
                    } catch (e) {
                        console.error("Cart merge error:", e);
                    }
                }

                try {
                    const res = await fetch('/api/cart', {
                        headers: { 'X-User-Id': authUser.uid }
                    });
                    if (res.ok) {
                        const items = await res.json();
                        setCart(items || []);
                    }
                } catch (e) {
                    console.error("Fetch cart error:", e);
                }
            } else {
                const localW = localStorage.getItem('tet_guest_wishlist');
                if (localW) {
                    try {
                        setWishlist(JSON.parse(localW) || []);
                    } catch (e) {
                        setWishlist([]);
                    }
                } else {
                    setWishlist([]);
                }

                const localC = localStorage.getItem('tet_guest_cart');
                if (localC) {
                    try {
                        setCart(JSON.parse(localC) || []);
                    } catch (e) {
                        setCart([]);
                    }
                } else {
                    setCart([]);
                }
            }
        };

        if (!authLoading) {
            syncUserData();
        }
    }, [authUser, authLoading]);

    const toggleWishlist = async (product) => {
        const isWished = wishlist.some(item => item.id === product.id);
        let updated;
        if (isWished) {
            updated = wishlist.filter(item => item.id !== product.id);
        } else {
            updated = [...wishlist, product];
        }
        setWishlist(updated);

        if (authUser) {
            try {
                if (isWished) {
                    await fetch(`/api/wishlist?productId=${product.id}`, {
                        method: 'DELETE',
                        headers: { 'X-User-Id': authUser.uid }
                    });
                } else {
                    await fetch('/api/wishlist', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-User-Id': authUser.uid
                        },
                        body: JSON.stringify({ productId: product.id })
                    });
                }
            } catch (e) {
                console.error("DB wishlist toggle error:", e);
            }
        } else {
            localStorage.setItem('tet_guest_wishlist', JSON.stringify(updated));
        }
    };

    const addToCart = (product) => {
        const prodQty = product.quantity || 1;
        const targetSize = product.size || '';
        let calcQty = prodQty;

        setCart(prev => {
            const existingIndex = prev.findIndex(item => item.id === product.id && (item.size || '') === targetSize);
            let updated;
            if (existingIndex > -1) {
                updated = [...prev];
                const currentItem = updated[existingIndex];
                calcQty = (currentItem.quantity || 1) + prodQty;
                updated[existingIndex] = {
                    ...currentItem,
                    quantity: calcQty
                };
            } else {
                updated = [...prev, { ...product, quantity: prodQty }];
            }

            if (authUser) {
                fetch('/api/cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-User-Id': authUser.uid
                    },
                    body: JSON.stringify({
                        productId: product.id,
                        quantity: calcQty,
                        size: targetSize
                    })
                }).catch(e => console.error("DB cart add error:", e));
            } else {
                localStorage.setItem('tet_guest_cart', JSON.stringify(updated));
            }

            return updated;
        });

        triggerLocalConfetti();

        if (toastTimerRef.current) {
            window.clearTimeout(toastTimerRef.current);
        }
        setToastProduct(product);
        toastTimerRef.current = window.setTimeout(() => {
            setToastProduct(null);
        }, 5500);
    };

    const updateQuantity = (index, newQty) => {
        if (newQty <= 0) {
            removeFromCart(index);
            return;
        }
        setCart(prev => {
            const updated = [...prev];
            if (updated[index]) {
                const targetItem = updated[index];
                updated[index] = { ...targetItem, quantity: newQty };

                if (authUser) {
                    fetch('/api/cart', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-User-Id': authUser.uid
                        },
                        body: JSON.stringify({
                            productId: targetItem.id,
                            quantity: newQty,
                            size: targetItem.size || ''
                        })
                    }).catch(e => console.error("DB cart update error:", e));
                } else {
                    localStorage.setItem('tet_guest_cart', JSON.stringify(updated));
                }
            }
            return updated;
        });
    };

    const removeFromCart = (index) => {
        setCart(prev => {
            const targetItem = prev[index];
            const updated = prev.filter((_, idx) => idx !== index);

            if (targetItem) {
                if (authUser) {
                    fetch(`/api/cart?productId=${targetItem.id}&size=${encodeURIComponent(targetItem.size || '')}`, {
                        method: 'DELETE',
                        headers: { 'X-User-Id': authUser.uid }
                    }).catch(e => console.error("DB cart remove error:", e));
                } else {
                    localStorage.setItem('tet_guest_cart', JSON.stringify(updated));
                }
            }
            return updated;
        });
    };

    const clearCart = () => {
        setCart([]);
        setDiscount(null);
        if (authUser) {
            fetch('/api/cart?clearAll=true', {
                method: 'DELETE',
                headers: { 'X-User-Id': authUser.uid }
            }).catch(e => console.error("DB cart clear error:", e));
        } else {
            localStorage.removeItem('tet_guest_cart');
        }
    };

    const handleSearchSubmit = (q) => {
        setGlobalSearch(q);
        if (window.location.hash !== "#/shop") {
            window.location.hash = "#/shop";
        }
    };

    const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

    return (
        <HashRouter>
            <ScrollToTop />
            <Navbar 
                products={products}
                cartCount={cartCount} 
                wishlistCount={wishlist.length} 
                authUser={authUser} 
                authLoading={authLoading} 
                onSearchSubmit={handleSearchSubmit}
                globalSearch={globalSearch}
                setGlobalSearch={setGlobalSearch}
            />
            <Routes>
                <Route 
                    path="/" 
                    element={
                        <Home 
                            productsGlobal={products}
                            wishlist={wishlist}
                            toggleWishlist={toggleWishlist}
                        />
                    } 
                />
                <Route 
                    path="/shop" 
                    element={
                        <Shop 
                            productsGlobal={products}
                            wishlist={wishlist}
                            toggleWishlist={toggleWishlist}
                            globalSearch={globalSearch}
                            setGlobalSearch={setGlobalSearch}
                        />
                    } 
                />

                <Route path="/product/:id" element={<ProductDetails products={products} addToCart={addToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} authUser={authUser} />} />
                <Route path="/cart" element={<Cart cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} onApplyCoupon={setDiscount} discount={discount} authUser={authUser} />} />
                <Route 
                    path="/checkout" 
                    element={<Checkout cart={cart} discount={discount} clearCart={clearCart} authUser={authUser} authLoading={authLoading} />} 
                />
                <Route path="/mock-payment" element={<MockPayment onPaymentSuccess={clearCart} />} />
                <Route path="/checkout-success" element={<CheckoutSuccess />} />
                <Route path="/profile" element={<ProfilePage authUser={authUser} />} />
                <Route path="/auth" element={<Auth />} />
                <Route 
                    path="/wishlist" 
                    element={
                        <WishlistPage 
                            wishlist={wishlist}
                            toggleWishlist={toggleWishlist}
                            addToCart={addToCart}
                        />
                    } 
                />
            </Routes>
            <AppFooterWrapper />

            {/* Premium Toast Drawer Notification */}
            {toastProduct && (
                <div className="cart-success-notification show">
                    <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-start', marginBottom: '1.2rem' }}>
                        <div style={{ width: '60px', height: '80px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0, boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                            <img src={toastProduct.imageUrl} alt={toastProduct.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '4px' }}>
                                ✓ Added to Wardrobe
                            </div>
                            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '600', color: 'var(--color-text)', lineHeight: '1.4' }}>{toastProduct.name}</h4>
                            <div style={{ fontSize: '0.85rem', color: '#686461', marginTop: '3px' }}>
                                Size: <strong style={{color:'var(--color-text)'}}>{toastProduct.size || 'Standard'}</strong> &bull; ₹{toastProduct.price.toLocaleString('en-IN')}
                            </div>
                        </div>
                        <button 
                            onClick={() => setToastProduct(null)} 
                            style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#ccc', padding: 0, lineHeight: 0 }}
                            aria-label="Close notification"
                        >
                            &times;
                        </button>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
                        <button 
                            onClick={() => setToastProduct(null)} 
                            style={{ 
                                flex: 1, 
                                height: '40px',
                                padding: '0 0.85rem', 
                                fontSize: '0.8rem', 
                                background: '#FAF7F4', 
                                color: '#5C5853', 
                                border: '1px solid rgba(212, 163, 115, 0.35)', 
                                borderRadius: '50px', 
                                cursor: 'pointer', 
                                fontWeight: '500',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                whiteSpace: 'nowrap',
                                boxSizing: 'border-box'
                            }}
                        >
                            Continue Shopping
                        </button>
                        <a 
                            href="#/cart" 
                            onClick={() => setToastProduct(null)} 
                            style={{ 
                                flex: 1, 
                                height: '40px',
                                padding: '0 0.85rem', 
                                fontSize: '0.82rem', 
                                background: 'linear-gradient(135deg, #D4A373 0%, #C49363 100%)',
                                color: '#FFF', 
                                border: 'none',
                                borderRadius: '50px', 
                                fontWeight: '600', 
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textDecoration: 'none',
                                boxShadow: '0 4px 12px rgba(212, 163, 115, 0.25)',
                                whiteSpace: 'nowrap',
                                boxSizing: 'border-box'
                            }}
                        >
                            Checkout &rarr;
                        </a>
                    </div>
                </div>
            )}

            <PremiumAlertModal 
                isOpen={alertState.isOpen} 
                onClose={closeAlert} 
                title={alertState.title} 
                message={alertState.message} 
                type={alertState.type} 
            />
        </HashRouter>
    );
};

// --- CUSTOM confetti particle fx emitter ---
function triggerLocalConfetti() {
    let canvas = document.getElementById('confetti-canvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'confetti-canvas';
        document.body.appendChild(canvas);
    }
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');

    const colors = [
        '#e4b39b', // Peach
        '#d4af37', // Gold
        '#ebd7cb', // Light Cream
        '#8c8883', // Secondary styling
        '#c68b59'  // Muted bronze
    ];

    const particles = [];
    // Spawn particles rising up in arcs
    for (let i = 0; i < 90; i++) {
        particles.push({
            x: window.innerWidth / 2,
            y: window.innerHeight * 0.75,
            size: Math.random() * 8 + 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            vx: (Math.random() - 0.5) * 16,
            vy: (Math.random() - 0.7) * 16 - 6,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 8,
            opacity: 1,
            shape: Math.random() > 0.55 ? 'circle' : 'square'
        });
    }

    function animateConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let active = false;

        particles.forEach(p => {
            if (p.opacity > 0) {
                active = true;
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.4; // gravity
                p.vx *= 0.98; // friction
                p.rotation += p.rotationSpeed;
                p.opacity -= 0.014; // decay rate

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation * Math.PI / 180);
                ctx.globalAlpha = Math.max(p.opacity, 0);
                ctx.fillStyle = p.color;

                if (p.shape === 'circle') {
                    ctx.beginPath();
                    ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                }
                ctx.restore();
            }
        });

        if (active) {
            requestAnimationFrame(animateConfetti);
        } else {
            if (canvas.parentNode) {
                canvas.parentNode.removeChild(canvas);
            }
        }
    }
    animateConfetti();
}



export default App;
