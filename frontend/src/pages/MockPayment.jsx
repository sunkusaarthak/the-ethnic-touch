import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate, Link, useLocation, useParams, Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';

import { API_BASE_URL } from '../data/config';
import { fetchWithAuth } from '../utils/apiClient';

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
            const res = await fetchWithAuth(`/api/orders/verify`, {
                method: 'POST',
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
                        giftExpiryDate: data.giftExpiryDate,
                        tracking: data.trackingNumber 
                    } 
                });
            } else {
                const errData = await res.json();
                showAlert("Simulated transaction failed: " + (errData.error || 'Server error'), "Transaction Error", "error");
                setPaying(false);
            }
        } catch (err) {
            showAlert("Server connection failed. Please check your network.", "Connection Error", "error");
            setPaying(false);
        }
    };

    const handleCancel = () => {
        navigate('/checkout');
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(30, 27, 24, 0.6)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem'
        }}>
            {/* Centered Floating Razorpay Popup Card */}
            <div style={{
                maxWidth: '380px',
                width: '100%',
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                position: 'relative',
                animation: 'modalFadeIn 0.25s ease'
            }}>
                {/* Razorpay Brand Card Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #0A2540 0%, #153A66 100%)',
                    color: '#FFFFFF',
                    padding: '1.25rem 1.5rem',
                    position: 'relative',
                    textAlign: 'left'
                }}>
                    <button 
                        onClick={handleCancel}
                        style={{
                            position: 'absolute',
                            top: '14px',
                            right: '14px',
                            background: 'rgba(255, 255, 255, 0.12)',
                            border: 'none',
                            color: '#FFF',
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        title="Cancel Payment"
                    >
                        ✕
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.4rem' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#528FF0" strokeWidth="2.2">
                            <polygon points="12 2 2 7 12 12 22 7 12 2" />
                            <polyline points="2 17 12 22 22 17" />
                            <polyline points="2 12 12 17 22 12" />
                        </svg>
                        <span style={{ fontSize: '0.82rem', fontWeight: '600', letterSpacing: '0.5px', color: '#93C5FD' }}>RAZORPAY CHECKOUT</span>
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '500', fontFamily: 'var(--font-heading)' }}>
                        The Ethnic Touch
                    </h3>
                    <p style={{ margin: '0.3rem 0 0', fontSize: '0.78rem', color: '#CBD5E1' }}>
                        Ref: <strong style={{ fontFamily: 'monospace', color: '#FFF' }}>#{orderId}</strong>
                    </p>
                </div>

                {/* Card Content Body */}
                <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <div style={{
                        backgroundColor: '#FAF5EF',
                        padding: '0.85rem 1rem',
                        borderRadius: '10px',
                        marginBottom: '1.25rem',
                        border: '1px dashed rgba(185, 122, 102, 0.35)',
                        textAlign: 'left'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#B97A66', fontSize: '0.82rem', fontWeight: '600', marginBottom: '0.2rem' }}>
                            <span>⚡ Razorpay Test Sandbox</span>
                        </div>
                        <p style={{ fontSize: '0.78rem', color: '#686461', margin: 0, lineHeight: '1.45' }}>
                            Simulating secure instant payment verification & HMAC signature check.
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.5rem', textAlign: 'left' }}>
                        <div style={{ padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #EAE6E1', background: '#FAFAFA', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                            <span style={{ color: '#555' }}>Payment Method:</span>
                            <strong style={{ color: '#2D2A26' }}>UPI / NetBanking / Cards</strong>
                        </div>
                        <div style={{ padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #EAE6E1', background: '#FAFAFA', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                            <span style={{ color: '#555' }}>Status:</span>
                            <span style={{ color: '#16A34A', fontWeight: '600' }}>● Ready to Verify</span>
                        </div>
                    </div>

                    <button 
                        onClick={handlePay} 
                        disabled={paying}
                        style={{
                            width: '100%', 
                            height: '44px',
                            fontSize: '0.88rem', 
                            fontWeight: '600', 
                            borderRadius: '50px',
                            letterSpacing: '0.02em',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'linear-gradient(135deg, #B97A66 0%, #A46855 100%)',
                            color: '#FFF',
                            border: 'none',
                            cursor: paying ? 'not-allowed' : 'pointer',
                            boxShadow: '0 6px 18px rgba(185, 122, 102, 0.25)',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {paying ? "Verifying Signature..." : "Complete Payment →"}
                    </button>
                    
                    <a 
                        href="#"
                        onClick={(e) => { e.preventDefault(); handleCancel(); }}
                        style={{ display: 'inline-block', marginTop: '0.85rem', fontSize: '0.78rem', color: '#888', textDecoration: 'none' }}
                    >
                        Cancel & Return to Checkout
                    </a>
                </div>
            </div>
        </div>
    );
};


export default MockPayment;
