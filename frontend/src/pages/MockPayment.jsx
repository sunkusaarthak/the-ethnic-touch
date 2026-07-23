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
        <div style={{padding: '2rem 1rem 3rem', maxWidth: '400px', margin: '0 auto', minHeight: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{
                width: '100%',
                padding: '1.5rem 1.25rem',
                backgroundColor: '#FFFdfc',
                borderRadius: '16px',
                boxShadow: '0 12px 35px rgba(212, 163, 115, 0.12)',
                border: '1.5px solid rgba(212, 163, 115, 0.35)',
                textAlign: 'center'
            }}>
                <h2 style={{fontFamily: 'var(--font-heading)', color: '#2D2A26', fontSize: '1.3rem', marginBottom: '0.3rem'}}>
                    Razorpay Simulator
                </h2>
                <p style={{color: '#6C6863', fontSize: '0.82rem', marginBottom: '1.25rem'}}>
                    Confirming details for order ref: <strong style={{color: '#8F5E36', fontFamily: 'monospace'}}>#{orderId}</strong>
                </p>
                
                <div style={{
                    backgroundColor: '#FAF4EE',
                    padding: '0.85rem 1rem',
                    borderRadius: '10px',
                    marginBottom: '1.25rem',
                    border: '1px dashed #D4A373'
                }}>
                    <p style={{fontSize: '0.82rem', color: '#8F5E36', margin: 0, fontWeight: '600'}}>
                        Dev Sandbox Environment
                    </p>
                    <p style={{fontSize: '0.78rem', color: '#6C6863', margin: '0.35rem 0 0', lineHeight: '1.4'}}>
                        Simulates Razorpay's payment verification. Click below to verify transaction signature.
                    </p>
                </div>

                <button 
                    onClick={handlePay} 
                    disabled={paying}
                    style={{
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
                        cursor: paying ? 'not-allowed' : 'pointer',
                        boxShadow: '0 4px 15px rgba(212, 163, 115, 0.25)',
                        transition: 'all 0.3s ease'
                    }}
                >
                    {paying ? "Verifying signature..." : "Simulate Payment Success"}
                </button>
            </div>
        </div>
    );
};


export default MockPayment;
