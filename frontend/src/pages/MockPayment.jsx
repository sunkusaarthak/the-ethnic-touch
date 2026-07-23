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


export default MockPayment;
