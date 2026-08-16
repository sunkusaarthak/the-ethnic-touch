import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation, useParams, Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import Cart from './Cart';
import { API_BASE_URL } from '../data/config';
import { fetchWithAuth } from '../utils/apiClient';

const showAlert = (message, title = "Notice", type = "warning") => {
    if (window.customAlert) {
        window.customAlert(message, title, type);
    } else {
        alert(`${title}: ${message}`);
    }
};

const Checkout = ({ cart, discount, clearCart, authUser, authLoading, setProfileIncomplete }) => {
    const [email, setEmail] = useState('');
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressID, setSelectedAddressID] = useState(null);
    const [checkoutType, setCheckoutType] = useState('delivery'); // 'delivery' | 'pickup' | 'hyderabad_instant'
    const [paymentMethod, setPaymentMethod] = useState('online'); // 'online' | 'offline_qr'
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
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [pendingPaymentOrder, setPendingPaymentOrder] = useState(null);
    const [verifyingPayment, setVerifyingPayment] = useState(false);
    const navigate = useNavigate();
    const paymentCompleteRef = useRef(false);

    const [checkoutConfig, setCheckoutConfig] = useState({
        standard_delivery_enabled: true,
        hyderabad_instant_enabled: true,
        store_pickup_prepay_enabled: true,
        store_pickup_pay_in_store_enabled: true
    });

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/config/checkout`)
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data) {
                    setCheckoutConfig(data);
                    
                    // Fallback logic if current selection is disabled
                    let cType = checkoutType;
                    let pMethod = paymentMethod;

                    if (cType === 'delivery' && !data.standard_delivery_enabled) cType = null;
                    if (cType === 'hyderabad_instant' && !data.hyderabad_instant_enabled) cType = null;
                    if (cType === 'pickup') {
                        if (!data.store_pickup_prepay_enabled && !data.store_pickup_pay_in_store_enabled) {
                            cType = null;
                        } else if (pMethod === 'online' && !data.store_pickup_prepay_enabled) {
                            pMethod = 'offline_qr';
                        } else if (pMethod === 'offline_qr' && !data.store_pickup_pay_in_store_enabled) {
                            pMethod = 'online';
                        }
                    }

                    if (!cType) {
                        if (data.standard_delivery_enabled) cType = 'delivery';
                        else if (data.store_pickup_prepay_enabled || data.store_pickup_pay_in_store_enabled) cType = 'pickup';
                        else if (data.hyderabad_instant_enabled) cType = 'hyderabad_instant';
                    }
                    
                    if (cType && cType !== checkoutType) setCheckoutType(cType);
                    if (pMethod && pMethod !== paymentMethod) setPaymentMethod(pMethod);
                }
            })
            .catch(err => console.error("Failed to fetch checkout config", err));
    }, []);

    const handleBackClick = (e) => {
        if (e) e.preventDefault();
        setShowLeaveModal(true);
    };

    const confirmLeaveCheckout = () => {
        setShowLeaveModal(false);
        if (window.history.state && window.history.state.idx > 0) {
            navigate(-1);
        } else {
            navigate('/cart');
        }
    };

    useEffect(() => {
        if (paymentCompleteRef.current) return;
        if (authLoading) return; // Wait for Firebase session restoration on page refresh
        if (!authUser) {
            navigate('/auth?redirect=/checkout');
            return;
        }
        if (!cart || cart.length === 0) {
            navigate('/cart');
        }
    }, [cart, authUser, authLoading, navigate]);

    const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
    const finalTotal = subtotal - (discount?.amt || 0);

    const activeAddr = authUser && addresses.length > 0 ? addresses.find(a => a.id === selectedAddressID) : null;
    const isCityHyderabad = activeAddr && (
        activeAddr.city.toLowerCase().trim() === 'hyderabad' ||
        activeAddr.city.toLowerCase().trim() === 'secunderabad'
    );
    const isInstantDeliveryBlocked = checkoutType === 'hyderabad_instant' && activeAddr && !isCityHyderabad;

    useEffect(() => {
        if (authUser) {
            setEmail(authUser.email || '');

            fetch(`${API_BASE_URL}/api/profile/me`, {
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
            const response = await fetch(`${API_BASE_URL}/api/profile/addresses`, {
                headers: { 'X-User-Id': authUser.uid }
            });
            if (response.ok) {
                const data = await response.json();
                setAddresses(data);
                
                if (setProfileIncomplete) {
                    setProfileIncomplete(data.length === 0);
                }

                const def = data.find(a => a.isDefault);
                if (def) {
                    setSelectedAddressID(def.id);
                } else if (data.length > 0) {
                    setSelectedAddressID(data[0].id);
                } else {
                    setShowNewAddressForm(true);
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
            const response = await fetch(`${API_BASE_URL}/api/profile/addresses`, {
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
            
            const loadRes = await fetch(`${API_BASE_URL}/api/profile/addresses`, {
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
        if (!authUser) {
            navigate('/auth?redirect=/checkout');
            return;
        }
        if (!email) return showAlert('Please enter your email address before placing an order.', 'Email Required', 'warning');
        
        let order = {};
        if (checkoutType === 'pickup') {
            order = {
                customerEmail: email,
                couponCode: discount?.code || '',
                items: cart.map(item => ({
                    productId: item.id,
                    quantity: item.quantity || 1,
                    size: item.size || ''
                })),
                checkoutType: 'pickup',
                paymentMethod: paymentMethod,
                shippingName: "Store Pickup Customer",
                shippingPhone: authUser?.phone || "0000000000",
                shippingAddress: "The Ethnic Touch pickup",
                shippingCity: "Hyderabad",
                shippingState: "Telangana",
                shippingZipCode: "500033"
            };
        } else {
            if (!activeAddr) {
                setShowNewAddressForm(true);
                return showAlert('Please enter your delivery address below to proceed with your order.', 'Address Required', 'warning');
            }
            if (checkoutType === 'hyderabad_instant') {
                const city = (activeAddr.city || '').trim().toLowerCase();
                if (city !== 'hyderabad' && city !== 'secunderabad') {
                    return showAlert('Instant delivery is only available inside Hyderabad/Secunderabad.', 'Location Restriction', 'warning');
                }
                const zip = (activeAddr.zipCode || '').trim();
                if (!zip.startsWith('500') || zip.length !== 6) {
                    return showAlert('Instant delivery requires a local Hyderabad pincode starting with 500 (e.g., 500081).', 'Pincode Required', 'warning');
                }
            }
            order = {
                customerEmail: email,
                couponCode: discount?.code || '',
                items: cart.map(item => ({
                    productId: item.id,
                    quantity: item.quantity || 1,
                    size: item.size || ''
                })),
                checkoutType: checkoutType,
                paymentMethod: 'online',
                shippingName: activeAddr.fullName,
                shippingPhone: activeAddr.phone,
                shippingAddress: activeAddr.addressLine,
                shippingCity: activeAddr.city,
                shippingState: activeAddr.state,
                shippingZipCode: activeAddr.zipCode
            };
        }

        setOrdering(true);

        try {
            const res = await fetchWithAuth('/api/orders', {
                method: 'POST',
                body: JSON.stringify(order)
            });
            
            if (!res.ok) {
                const errData = await res.json();
                showAlert(errData.error || 'Failed to create order', 'Order Error', 'error');
                setOrdering(false);
                return;
            }

            const data = await res.json();

            // Handle Offline Store Pickup QR Code
            if (data.paymentMethod === 'offline_qr') {
                paymentCompleteRef.current = true;
                clearCart();
                navigate('/checkout-success', {
                    state: {
                        orderId: data.orderId,
                        checkoutType: 'pickup',
                        paymentMethod: 'offline_qr',
                        amount: data.amount
                    }
                });
                return;
            }

            // Handle Official Razorpay Gateway Modal
            const isRazorpay = data.checkoutUrl === "razorpay" || Boolean(data.razorpayKey) || data.paymentMethod === "online";

            if (isRazorpay) {
                if (window.Razorpay) {
                    const options = {
                        key: data.razorpayKey || "rzp_test_mock",
                        amount: Math.round(data.amount * 100),
                        currency: "INR",
                        name: "The Ethnic Touch",
                        description: `Store Order #${data.orderId}`,
                        prefill: { email: email },
                        theme: { color: "#B97A66" },
                        handler: async function (response) {
                            try {
                                const verifyRes = await fetchWithAuth(`/api/orders/verify`, {
                                    method: 'POST',
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
                                    paymentCompleteRef.current = true;
                                    clearCart();
                                    navigate('/checkout-success', { 
                                        state: { 
                                            orderId: data.orderId, 
                                            gift: verifyData.giftCode, 
                                            unlockedGift: verifyData.unlockedGift,
                                            giftType: verifyData.giftType,
                                            giftExpiryDate: verifyData.giftExpiryDate,
                                            tracking: verifyData.trackingNumber,
                                            checkoutType: checkoutType,
                                            paymentMethod: 'online'
                                        } 
                                    });
                                } else {
                                    showAlert("Payment verification failed. Please contact store support.", "Payment Error", "error");
                                    setOrdering(false);
                                }
                            } catch (e) {
                                showAlert("Network error verifying payment.", "Connection Error", "error");
                                setOrdering(false);
                            }
                        },
                        modal: {
                            ondismiss: function() {
                                setOrdering(false);
                            }
                        }
                    };

                    if (data.razorpayOrderId && !data.razorpayOrderId.startsWith("MOCK_")) {
                        options.order_id = data.razorpayOrderId;
                    }

                    const rzp = new window.Razorpay(options);
                    rzp.open();
                    setOrdering(false);
                } else {
                    showAlert("Razorpay SDK is loading. Please try again in a moment.", "SDK Error", "notice");
                    setOrdering(false);
                }
            } else {
                let targetUrl = data.checkoutUrl || `/mock-payment?orderId=${data.orderId}`;
                if (targetUrl.startsWith('/#')) {
                    targetUrl = targetUrl.substring(2);
                }
                navigate(targetUrl);
            }
        } catch (err) {
            showAlert("Error placing order. Please try again.", "Order Error", "error");
            setOrdering(false);
        }
    };

    if (authLoading) {
        return (
            <div style={{ padding: '1.25rem 5% 3rem', maxWidth: '1150px', margin: '0 auto', minHeight: '75vh' }}>
                <div className="skeleton-box" style={{ height: '36px', width: '180px', borderRadius: '8px', marginBottom: '1.5rem' }} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    <div className="skeleton-box" style={{ height: '380px', borderRadius: '16px' }} />
                    <div className="skeleton-box" style={{ height: '380px', borderRadius: '16px' }} />
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page-container" style={{padding: '1.25rem 5% 3rem', maxWidth: '1150px', margin: '0 auto', minHeight: '75vh'}}>
            <a 
                href="#" 
                onClick={handleBackClick} 
                className="checkout-back-link" 
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '1rem', color: 'var(--color-text-light)', textDecoration: 'none', fontSize: 'var(--font-size-sm)', fontWeight: '500' }}
            >
                &larr; Back
            </a>
            <h1 className="page-title">Checkout</h1>
            
            <div className="desktop-split-layout checkout-layout" style={{ gap: '1.25rem' }}>
                {/* Left Column: Delivery & Shipping Forms */}
                <div style={{flex: 1, minWidth: '280px'}}>
            
            {/* Delivery Methods Selector */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '8px',
                marginBottom: '1.25rem',
            }}>
                <button
                    onClick={() => {
                        if (checkoutConfig.standard_delivery_enabled) {
                            setCheckoutType('delivery');
                            setPaymentMethod('online');
                        }
                    }}
                    style={{
                        padding: '8px 6px',
                        borderRadius: '8px',
                        border: '1.5px solid',
                        borderColor: checkoutType === 'delivery' ? '#D4A373' : '#E6E4E0',
                        background: checkoutType === 'delivery' ? '#FAF3ED' : '#fff',
                        color: checkoutType === 'delivery' ? '#8F5E36' : '#5C5854',
                        fontWeight: '600',
                        fontSize: '0.78rem',
                        cursor: checkoutConfig.standard_delivery_enabled ? 'pointer' : 'not-allowed',
                        opacity: checkoutConfig.standard_delivery_enabled ? 1 : 0.4,
                        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        boxShadow: checkoutType === 'delivery' ? '0 4px 10px rgba(212,163,115,0.12)' : 'none',
                        outline: 'none',
                        position: 'relative'
                    }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="1" y="3" width="15" height="13" rx="2" ry="2" />
                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                        <circle cx="5.5" cy="18.5" r="2.5" />
                        <circle cx="18.5" cy="18.5" r="2.5" />
                    </svg>
                    <span style={{fontFamily: 'Inter, sans-serif', letterSpacing: '-0.01em'}}>Standard Delivery</span>
                    {!checkoutConfig.standard_delivery_enabled && <span style={{fontSize: '0.6rem', color: 'red', position: 'absolute', bottom: '-15px'}}>Unavailable</span>}
                </button>

                {(checkoutConfig.store_pickup_prepay_enabled || checkoutConfig.store_pickup_pay_in_store_enabled) && (
                <button
                    onClick={() => {
                        setCheckoutType('pickup');
                        if (checkoutConfig.store_pickup_prepay_enabled) setPaymentMethod('online');
                        else if (checkoutConfig.store_pickup_pay_in_store_enabled) setPaymentMethod('offline_qr');
                    }}
                    style={{
                        padding: '8px 6px',
                        borderRadius: '8px',
                        border: '1.5px solid',
                        borderColor: checkoutType === 'pickup' ? '#D4A373' : '#E6E4E0',
                        background: checkoutType === 'pickup' ? '#FAF3ED' : '#fff',
                        color: checkoutType === 'pickup' ? '#8F5E36' : '#5C5854',
                        fontWeight: '600',
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        boxShadow: checkoutType === 'pickup' ? '0 4px 10px rgba(212,163,115,0.12)' : 'none',
                        outline: 'none'
                    }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    <span style={{fontFamily: 'Inter, sans-serif', letterSpacing: '-0.01em'}}>Store Pickup</span>
                </button>
                )}

                <button
                    onClick={() => {
                        if (checkoutConfig.hyderabad_instant_enabled) {
                            setCheckoutType('hyderabad_instant');
                            setPaymentMethod('online');
                        }
                    }}
                    style={{
                        padding: '8px 6px',
                        borderRadius: '8px',
                        border: '1.5px solid',
                        borderColor: checkoutType === 'hyderabad_instant' ? '#D4A373' : '#E6E4E0',
                        background: checkoutType === 'hyderabad_instant' ? '#FAF3ED' : '#fff',
                        color: checkoutType === 'hyderabad_instant' ? '#8F5E36' : '#5C5854',
                        fontWeight: '600',
                        fontSize: '0.78rem',
                        cursor: checkoutConfig.hyderabad_instant_enabled ? 'pointer' : 'not-allowed',
                        opacity: checkoutConfig.hyderabad_instant_enabled ? 1 : 0.4,
                        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        boxShadow: checkoutType === 'hyderabad_instant' ? '0 6px 15px rgba(212,163,115,0.15)' : 'none',
                        outline: 'none',
                        position: 'relative'
                    }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                    <span style={{fontFamily: 'Inter, sans-serif', letterSpacing: '-0.01em'}}>Hyderabad Instant</span>
                    {!checkoutConfig.hyderabad_instant_enabled && <span style={{fontSize: '0.6rem', color: 'red', position: 'absolute', bottom: '-15px'}}>Unavailable</span>}
                </button>
            </div>

            <div style={{marginBottom: '1.25rem'}}>
                <label style={{display: 'block', marginBottom: '0.35rem', fontWeight: 600, fontSize: '0.78rem', color: '#555'}}>Confirm Email *</label>
                <input 
                    type="email" 
                    className="checkout-email-input"
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    placeholder="you@example.com"
                    style={{border: '1px solid #ddd', borderRadius: '8px', width: '100%', fontSize: '0.75rem', height: '34px', padding: '0.35rem 0.65rem'}}
                    disabled={ordering}
                    required
                />
            </div>

            {/* Store Pickup Details UI */}
            {checkoutType === 'pickup' && (
                <div style={{marginBottom: '2.5rem'}}>
                    <div style={{
                        background: '#FAF3ED',
                        border: '1px solid #FFE5D9',
                        borderRadius: '12px',
                        padding: '1.8rem',
                        marginBottom: '2rem',
                        boxShadow: '0 4px 12px rgba(212,163,115,0.06)'
                    }}>
                        <h4 style={{fontFamily: 'var(--font-title)', color: '#8F5E36', marginBottom: '0.8rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#8F5E36'}}>
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                <polyline points="9 22 9 12 15 12 15 22" />
                            </svg>
                            The Ethnic Touch Collection
                        </h4>
                        <p style={{fontSize: '0.95rem', color: '#2D2A26', fontWeight: 600, margin: '0 0 0.4rem'}}>The Ethnic Touch</p>
                        <p style={{fontSize: '0.88rem', color: '#6C6863', margin: '0 0 0.8rem', lineHeight: '1.5'}}>
                            ESCI Road, Khajaguda, Manikonda, Gacibowli, Hyderabad, Telangana - 500032<br/>
                            Assistant Desk: <strong>+91 76748 55289</strong>
                        </p>
                        <p style={{fontSize: '0.85rem', color: '#8F5E36', fontStyle: 'italic', margin: 0, borderTop: '1px solid rgba(212,163,115,0.2)', paddingTop: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px'}}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#8F5E36', flexShrink: 0}}>
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="16" x2="12" y2="12" />
                                <line x1="12" y1="8" x2="12.01" y2="8" />
                            </svg>
                            <span>Collected packages are custom steamed and gift-wrapped on arrival. Pickups available 10:30 AM - 8:30 PM.</span>
                        </p>
                    </div>

                    {/* Payment Mode (Online / Offline QR) */}
                    <div style={{marginBottom: '2rem'}}>
                        <h3 style={{fontSize: '1.1rem', fontWeight: 600, color: '#333', marginBottom: '1.1rem'}}>Select Payment Mode</h3>
                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                            <div 
                                onClick={() => {
                                    if (checkoutConfig.store_pickup_prepay_enabled) {
                                        setPaymentMethod('online');
                                    }
                                }}
                                style={{
                                    border: paymentMethod === 'online' ? '2px solid #D4A373' : '1px solid #E6E4E0',
                                    borderRadius: '12px',
                                    padding: '1.5rem 1rem',
                                    background: paymentMethod === 'online' ? '#FAF3ED' : '#fff',
                                    cursor: checkoutConfig.store_pickup_prepay_enabled ? 'pointer' : 'not-allowed',
                                    opacity: checkoutConfig.store_pickup_prepay_enabled ? 1 : 0.4,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '12px',
                                    transition: 'all 0.3s ease',
                                    boxShadow: paymentMethod === 'online' ? '0 6px 15px rgba(212,163,115,0.15)' : 'none',
                                    position: 'relative'
                                }}
                            >
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#8F5E36'}}>
                                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                                    <line x1="1" y1="10" x2="23" y2="10" />
                                </svg>
                                <span style={{fontSize: '0.98rem', fontWeight: 600, color: '#2D2A26'}}>Prepay Online</span>
                                <span style={{fontSize: '0.75rem', color: '#6C6863', textAlign: 'center'}}>Instant checkout verification</span>
                                {!checkoutConfig.store_pickup_prepay_enabled && <span style={{fontSize: '0.7rem', color: 'red', position: 'absolute', bottom: '10px'}}>Unavailable</span>}
                            </div>
                            
                            <div 
                                onClick={() => {
                                    if (checkoutConfig.store_pickup_pay_in_store_enabled) {
                                        setPaymentMethod('offline_qr');
                                    }
                                }}
                                style={{
                                    border: paymentMethod === 'offline_qr' ? '2px solid #D4A373' : '1px solid #E6E4E0',
                                    borderRadius: '12px',
                                    padding: '1.5rem 1rem',
                                    background: paymentMethod === 'offline_qr' ? '#FAF3ED' : '#fff',
                                    cursor: checkoutConfig.store_pickup_pay_in_store_enabled ? 'pointer' : 'not-allowed',
                                    opacity: checkoutConfig.store_pickup_pay_in_store_enabled ? 1 : 0.4,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '12px',
                                    transition: 'all 0.3s ease',
                                    boxShadow: paymentMethod === 'offline_qr' ? '0 6px 15px rgba(212,163,115,0.15)' : 'none',
                                    position: 'relative'
                                }}
                            >
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#8F5E36'}}>
                                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                                    <line x1="12" y1="18" x2="12.01" y2="18" />
                                </svg>
                                <span style={{fontSize: '0.98rem', fontWeight: 600, color: '#2D2A26'}}>Pay In-Store</span>
                                <span style={{fontSize: '0.75rem', color: '#6C6863', textAlign: 'center'}}>Book now, scan pass at store</span>
                                {!checkoutConfig.store_pickup_pay_in_store_enabled && <span style={{fontSize: '0.7rem', color: 'red', position: 'absolute', bottom: '10px'}}>Unavailable</span>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Standard Delivery Mode Info Banner */}
            {checkoutType === 'delivery' && (
                <div style={{
                    background: '#F9FAF9',
                    border: '1px solid #E6E6E6',
                    borderRadius: '12px',
                    padding: '1.2rem',
                    marginBottom: '2rem',
                    fontSize: '0.88rem',
                    color: '#555',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px'
                }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#555', flexShrink: 0}}>
                        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
                        <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                    </svg>
                    <div>
                        <strong>Standard Shipping Details:</strong> Dispatched via premium express post (Delhivery/BlueDart). Expected delivery within <strong>3-5 business days</strong> nationwide.
                    </div>
                </div>
            )}

            {/* Hyderabad Instant Courier Mode Info Banner */}
            {checkoutType === 'hyderabad_instant' && (
                <div style={{
                    background: '#FFF9F2',
                    border: '1px solid #FFE9D1',
                    borderRadius: '12px',
                    padding: '1.2rem',
                    marginBottom: '2rem',
                    fontSize: '0.88rem',
                    color: '#8F5E36',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px'
                }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#8F5E36', flexShrink: 0}}>
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                    <div>
                        <strong>Local courier dispatch:</strong> Delivered within <strong>2-4 hours</strong> via instant courier (Uber/Rapido) direct from Khajaguda store.
                    </div>
                </div>
            )}

            {/* Address Selector list (Hidden for Store Pickup) */}
            {checkoutType !== 'pickup' && (
                <div style={{marginBottom: '2rem'}}>
                    <div style={{display: 'flex', justifycontent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
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
                        <form onSubmit={handleAddAddress} style={{background: '#FAF9F6', border: '1.5px solid #E6E4E0', padding: '1.8rem', borderRadius: '12px', marginBottom: '2rem'}}>
                            <h4 style={{fontSize: '1rem', fontWeight: 600, marginBottom: '1.2rem', color: '#2D2A26'}}>New Shipping Address</h4>
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
                                    <input className="profile-input" value={shippingForm.zipCode} onChange={e => setShippingForm({...shippingForm, zipCode: e.target.value})} required style={{letterSpacing: '0.1em'}} placeholder="6 digits" />
                                </label>
                            </div>
                            <button className="btn btn-primary" type="submit" style={{marginTop: '1.2rem', padding: '0.75rem 1.8rem', borderRadius: '50px'}}>Save and Use Address</button>
                        </form>
                    )}

                    {addresses.length === 0 ? (
                        <div style={{background: '#fafafa', border: '1px dashed #ccc', padding: '2.5rem 1.5rem', borderRadius: '12px', textAlign: 'center'}}>
                            <p style={{fontSize: '0.92rem', color: '#6C6863', marginBottom: '1.2rem'}}>You don't have any saved shipping addresses.</p>
                            {!showNewAddressForm && authUser && (
                                <button className="btn btn-primary" onClick={() => setShowNewAddressForm(true)}>+ Add Shipping Address</button>
                            )}
                            {!authUser && (
                                <p style={{fontSize: '0.85rem', color: '#999'}}>Please sign in to save and manage shipping addresses.</p>
                            )}
                        </div>
                    ) : (
                        <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '1.2rem'}}>
                            {addresses.map(addr => {
                                const isSelected = selectedAddressID === addr.id;
                                return (
                                    <div 
                                        key={addr.id} 
                                        onClick={() => setSelectedAddressID(addr.id)}
                                        style={{
                                            border: isSelected ? '2px solid #D4A373' : '1px solid #E6E4E0', 
                                            borderRadius: '12px', 
                                            padding: '1.5rem', 
                                            background: isSelected ? '#FAF3ED' : '#fff', 
                                            cursor: 'pointer',
                                            position: 'relative',
                                            transition: 'all 0.3s ease',
                                            boxShadow: isSelected ? '0 6px 15px rgba(212,163,115,0.12)' : 'none'
                                        }}
                                    >
                                        <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem'}}>
                                            <input 
                                                type="radio" 
                                                checked={isSelected} 
                                                onChange={() => setSelectedAddressID(addr.id)} 
                                                style={{cursor: 'pointer', accentColor: '#D4A373'}} 
                                            />
                                            <h4 style={{fontSize: '0.98rem', fontWeight: 600, margin: 0, color: '#2D2A26'}}>{addr.fullName}</h4>
                                            {addr.isDefault && <span style={{background: '#FFE5D9', color: '#8F5E36', fontSize: '0.65rem', padding: '3px 8px', borderRadius: '20px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Default</span>}
                                        </div>
                                        <p style={{fontSize: '0.88rem', color: '#6C6863', margin: '0.2rem 0 0.2rem 24px', lineHeight: '1.5'}}>{addr.addressLine}</p>
                                        <p style={{fontSize: '0.88rem', color: '#6C6863', margin: '0 0 0.2rem 24px', lineHeight: '1.5'}}>{addr.city}, {addr.state} - {addr.zipCode}</p>
                                        <p style={{fontSize: '0.88rem', color: '#6C6863', margin: '0 0 0 24px'}}>Phone: <strong>{addr.phone}</strong></p>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Instant Shipping Warning if City is not Hyderabad */}
                    {isInstantDeliveryBlocked && (
                        <div style={{
                            background: '#FDF2F2',
                            border: '1.5px solid #F8D7DA',
                            color: '#721C24',
                            borderRadius: '12px',
                            padding: '1.2rem',
                            marginTop: '1.5rem',
                            fontSize: '0.9rem',
                            lineHeight: '1.5',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '12px'
                        }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#721C24', flexShrink: 0}}>
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                <line x1="12" y1="9" x2="12" y2="13" />
                                <line x1="12" y1="17" x2="12.01" y2="17" />
                            </svg>
                            <div>
                                <strong>Local Instant Courier Blocked:</strong> Your shipping address city ({activeAddr?.city || 'Selected location'}) is outside the Hyderabad/Secunderabad delivery radius.<br/>
                                <span style={{fontSize: '0.85rem', color: '#90242E', marginTop: '0.4rem', display: 'block'}}>
                                    To proceed, select standard nationwide delivery, pick up in store, or update your shipping address.
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            )}

                </div>

                {/* Right Column: Sticky Order Summary Box */}
                <div className="sticky-summary-box" style={{
                    width: '310px', 
                    flexShrink: 0, 
                    padding: '1.25rem', 
                    backgroundColor: '#FFFdfc', 
                    borderRadius: '16px', 
                    border: '1.5px solid rgba(212, 163, 115, 0.35)', 
                    boxShadow: '0 8px 30px rgba(212, 163, 115, 0.08)'
                }}>
                    <h3 style={{
                        fontFamily: 'var(--font-heading)', 
                        fontSize: '1.05rem', 
                        fontWeight: '500', 
                        marginBottom: '0.85rem', 
                        color: '#2D2A26', 
                        letterSpacing: '0.03em', 
                        borderBottom: '1px solid rgba(212, 163, 115, 0.25)', 
                        paddingBottom: '0.45rem'
                    }}>
                        Order Summary
                    </h3>
                    
                    {/* Item list mini preview */}
                    <div style={{
                        maxHeight: '180px', 
                        overflowY: 'auto', 
                        marginBottom: '1rem', 
                        padding: '0.5rem 0.6rem', 
                        backgroundColor: '#FAF7F4', 
                        borderRadius: '10px', 
                        border: '1px solid rgba(212, 163, 115, 0.18)', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '0.5rem'
                    }}>
                        {cart.map((item, idx) => (
                            <div key={idx} style={{display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.78rem'}}>
                                <img src={item.imageUrl} alt={item.name} style={{width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover', border: '1px solid rgba(212, 163, 115, 0.25)'}} />
                                <div style={{flex: 1, minWidth: 0}}>
                                    <div style={{fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#2D2A26'}}>{item.name}</div>
                                    <div style={{color: '#8C8883', fontSize: '0.72rem'}}>Qty: {item.quantity || 1} {item.size ? `| Size: ${item.size}` : ''}</div>
                                </div>
                                <div style={{fontWeight: '600', color: '#8F5E36'}}>₹{(item.price * (item.quantity || 1)).toLocaleString('en-IN')}</div>
                            </div>
                        ))}
                    </div>

                    <div style={{borderTop: '1px solid rgba(212, 163, 115, 0.2)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', color: '#6C6863'}}>
                            <span>Subtotal ({cart.reduce((sum, item) => sum + (item.quantity || 1), 0)} items):</span>
                            <span style={{fontWeight: '600', color: '#2D2A26'}}>₹{subtotal.toLocaleString('en-IN')}</span>
                        </div>
                        {discount && (
                            <div style={{display: 'flex', justifyContent: 'space-between', color: '#2E7D32', fontWeight: '500'}}>
                                <span>Discount ({discount.code}):</span>
                                <span>-₹{discount.amt.toLocaleString('en-IN')}</span>
                            </div>
                        )}
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#6C6863'}}>
                            <span>Delivery Mode:</span>
                            <span style={{backgroundColor: '#FAF3ED', color: '#8F5E36', padding: '2px 8px', borderRadius: '20px', fontWeight: '600', fontSize: '0.75rem', border: '1px solid rgba(212,163,115,0.25)', textTransform: 'capitalize'}}>
                                {checkoutType.replace('_', ' ')}
                            </span>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed rgba(212, 163, 115, 0.35)', paddingTop: '0.65rem', marginTop: '0.3rem'}}>
                            <span style={{fontWeight: 600, color: '#2D2A26', fontSize: '0.92rem'}}>Total Amount:</span>
                            <strong style={{fontSize: '1.1rem', color: '#8F5E36', fontFamily: 'var(--font-body)'}}>₹{finalTotal.toLocaleString('en-IN')}</strong>
                        </div>
                    </div>

                    {checkoutType !== 'pickup' && addresses.length === 0 && (
                        <div style={{
                            marginTop: '1rem',
                            padding: '0.65rem 0.85rem',
                            background: '#FDF2F2',
                            border: '1px solid #F8D7DA',
                            borderRadius: '8px',
                            color: '#721C24',
                            fontSize: '0.8rem',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px'
                        }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink: 0, marginTop: '2px'}}>
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            <span>Please add a delivery address to proceed to payment.</span>
                        </div>
                    )}

                    <button 
                        onClick={() => {
                            if (checkoutType !== 'pickup' && addresses.length === 0) {
                                navigate('/profile?action=add_address&redirect=/checkout');
                            } else {
                                placeOrder();
                            }
                        }} 
                        style={{
                            marginTop: '0.9rem', 
                            width: '100%', 
                            height: '38px',
                            padding: '0', 
                            fontSize: '0.85rem', 
                            fontWeight: '600', 
                            borderRadius: '50px',
                            letterSpacing: '0.02em',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'linear-gradient(135deg, #D4A373 0%, #C49363 100%)',
                            color: '#FFF',
                            border: 'none',
                            cursor: ordering ? 'not-allowed' : 'pointer',
                            boxShadow: '0 4px 15px rgba(212, 163, 115, 0.25)',
                            transition: 'all 0.3s ease'
                        }}
                        disabled={ordering || isInstantDeliveryBlocked}
                    >
                        {ordering ? "Verifying Stock..." : 
                         (checkoutType !== 'pickup' && addresses.length === 0) ? "Add Delivery Address" :
                         checkoutType === 'pickup' && paymentMethod === 'offline_qr' ? "Book Store Pickup Pass" : 
                         "Secure Checkout & Prepay"}
                    </button>
                </div>
            </div>

            {/* Leave Checkout Confirmation Modal */}
            {showLeaveModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(45, 42, 38, 0.45)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    zIndex: 99999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1.25rem'
                }}>
                    <div style={{
                        background: '#FFF',
                        borderRadius: '20px',
                        padding: '1.75rem 1.5rem',
                        maxWidth: '380px',
                        width: '100%',
                        boxShadow: '0 25px 50px rgba(0,0,0,0.18)',
                        border: '1px solid rgba(212, 163, 115, 0.3)'
                    }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            backgroundColor: '#FAF7F4',
                            border: '1.5px solid rgba(212, 163, 115, 0.35)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 0.85rem auto',
                            color: '#B97A66'
                        }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h3 style={{ margin: '0 0 0.5rem 0', fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: '#2D2A26' }}>
                            Leave Checkout?
                        </h3>
                        <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.88rem', color: '#686461', lineHeight: '1.55' }}>
                            Are you sure you want to leave checkout? Your items and cart selections are safely saved.
                        </p>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button 
                                onClick={() => setShowLeaveModal(false)} 
                                style={{
                                    flex: 1,
                                    height: '42px',
                                    borderRadius: '50px',
                                    border: '1px solid rgba(212, 163, 115, 0.35)',
                                    background: '#FAF7F4',
                                    color: '#5C5853',
                                    fontSize: '0.85rem',
                                    fontWeight: '500',
                                    cursor: 'pointer'
                                }}
                            >
                                Stay Here
                            </button>
                            <button 
                                onClick={confirmLeaveCheckout} 
                                style={{
                                    flex: 1,
                                    height: '42px',
                                    borderRadius: '50px',
                                    border: 'none',
                                    background: 'linear-gradient(135deg, #B97A66 0%, #A46855 100%)',
                                    color: '#FFF',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 12px rgba(185, 122, 102, 0.25)'
                                }}
                            >
                                Leave Checkout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;
