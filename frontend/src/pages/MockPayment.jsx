import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate, Link, useLocation, useParams, Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';

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

    return (
        <div style={{
            minHeight: '75vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1.5rem',
            background: 'linear-gradient(135deg, #FCFBFA 0%, #F5EFE8 100%)'
        }}>
            <div style={{
                maxWidth: '440px',
                width: '100%',
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                padding: '2.5rem 2rem',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.12)',
                border: '1.5px solid rgba(212, 163, 115, 0.3)',
                textAlign: 'center'
            }}>
                <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#FAF7F2',
                    border: '1.5px solid rgba(212, 163, 115, 0.4)',
                    color: '#8F5E36',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem'
                }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                        <line x1="1" y1="10" x2="23" y2="10"/>
                    </svg>
                </div>

                <h2 style={{fontFamily: 'var(--font-heading)', color: '#2D2A26', fontSize: '1.5rem', marginBottom: '0.4rem', fontWeight: '400'}}>
                    Razorpay Gateway Simulator
                </h2>
                <p style={{color: '#6C6863', fontSize: '0.85rem', marginBottom: '1.5rem'}}>
                    Order Reference: <strong style={{color: '#8F5E36', fontFamily: 'monospace'}}>#{orderId}</strong>
                </p>
                
                <div style={{
                    backgroundColor: '#FAF4EE',
                    padding: '1rem 1.2rem',
                    borderRadius: '12px',
                    marginBottom: '1.5rem',
                    border: '1px dashed rgba(212, 163, 115, 0.5)'
                }}>
                    <p style={{fontSize: '0.85rem', color: '#8F5E36', margin: 0, fontWeight: '600'}}>
                        Development Sandbox Mode
                    </p>
                    <p style={{fontSize: '0.8rem', color: '#6C6863', margin: '0.4rem 0 0', lineHeight: '1.45'}}>
                        Simulates Razorpay payment verification & signature creation. Click below to complete payment.
                    </p>
                </div>

                <button 
                    onClick={handlePay} 
                    disabled={paying}
                    style={{
                        width: '100%', 
                        height: '42px',
                        padding: '0', 
                        fontSize: '0.88rem', 
                        fontWeight: '600', 
                        borderRadius: '50px',
                        letterSpacing: '0.02em',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #D4A373 0%, #C49363 100%)',
                        color: '#FFF',
                        border: 'none',
                        cursor: paying ? 'not-allowed' : 'pointer',
                        boxShadow: '0 6px 20px rgba(212, 163, 115, 0.3)',
                        transition: 'all 0.3s ease'
                    }}
                >
                    {paying ? "Verifying signature..." : "Simulate Payment Success →"}
                </button>
            </div>
        </div>
    );
};


export default MockPayment;
