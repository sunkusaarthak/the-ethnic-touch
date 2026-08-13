import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate, Link, useLocation, useParams, Routes, Route, Navigate, HashRouter } from 'react-router-dom';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import Auth from './pages/Auth';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CheckoutSuccess from './pages/CheckoutSuccess';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import ProfilePage from './pages/ProfilePage';
import Shop from './pages/Shop';
import WishlistPage from './pages/WishlistPage';
import { fallbackProducts, API_BASE_URL } from './data/config';
import apiClient from './utils/apiClient';

import { AuthProvider, useAuth } from './context/AuthContext';
import { AlertProvider, useAlert } from './context/AlertContext';
import { CartProvider, useCart } from './context/CartContext';

const AdminRedirect = () => {
    useEffect(() => {
        window.location.href = '/admin/index.html';
    }, []);
    return null;
};

const AppFooterWrapper = () => {
    const location = useLocation();
    if (location.pathname === '/auth') return null;
    return <Footer />;
};

const AppRoutesContent = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [globalSearch, setGlobalSearch] = useState('');

    const { authUser, authLoading } = useAuth();
    const { 
        cart, 
        wishlist, 
        addToCart, 
        updateQuantity, 
        removeFromCart, 
        clearCart, 
        discount, 
        setDiscount, 
        toggleWishlist, 
        toastProduct 
    } = useCart();
    const { showAlert, closeAlert } = useAlert();

    useEffect(() => {
        apiClient.get('/api/products')
            .then(data => {
                if (Array.isArray(data)) {
                    setProducts(data);
                } else {
                    setProducts(fallbackProducts);
                }
                setLoading(false);
            })
            .catch(err => {
                setProducts(fallbackProducts);
                setLoading(false);
            });
    }, []);

    const handleSearchSubmit = (q) => {
        setGlobalSearch(q);
        if (window.location.hash !== "#/shop") {
            window.location.hash = "#/shop";
        }
    };

    const cartCount = (cart || []).reduce((sum, item) => sum + (item.quantity || 1), 0);

    return (
        <HashRouter>
            <ScrollToTop />
            <Navbar 
                products={products}
                cartCount={cartCount} 
                wishlistCount={(wishlist || []).length} 
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
                    } />
                <Route path="/admin" element={<AdminRedirect />} />
                <Route path="/admin/*" element={<AdminRedirect />} />
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
                            style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#ccc', padding: 0, lineHeight: 0 }}
                            aria-label="Close notification"
                        >
                            &times;
                        </button>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
                        <button 
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
        </HashRouter>
    );
};

const App = () => {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <AlertProvider>
                    <CartProvider>
                        <AppRoutesContent />
                    </CartProvider>
                </AlertProvider>
            </AuthProvider>
        </ErrorBoundary>
    );
};

export default App;
