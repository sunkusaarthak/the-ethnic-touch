import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate, Link, useLocation, useParams, Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import CopyButton from '../components/CopyButton';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../utils/apiClient';

const CheckoutSuccess = () => {
    const location = useLocation();
    const state = location.state || {};
    const {
        orderId: stateOrderId,
        gift,
        tracking: stateTracking,
        unlockedGift,
        giftType,
        giftExpiryDate,
        checkoutType: stateCheckoutType,
        paymentMethod: statePaymentMethod,
        amount: stateAmount,
        isPreorder: stateIsPreorder,
        fulfilmentType: stateFulfilmentType,
        pickupConfig: statePickupConfig,
        pickupLocationSnapshot: stateSnapshot
    } = state;
    const orderId = new URLSearchParams(location.search).get('orderId') || stateOrderId;
    const navigate = useNavigate();
    const { authUser, authLoading } = useAuth();

    const [loadedOrder, setLoadedOrder] = useState(null);
    const [statusError, setStatusError] = useState('');
    const [statusRefresh, setStatusRefresh] = useState(0);
    const [cancelling, setCancelling] = useState(false);
    const fetchedOrder = loadedOrder?.uid === authUser?.uid && loadedOrder?.order?.id === orderId
        ? loadedOrder.order
        : null;
    const [pickupConfig, setPickupConfig] = useState(() => {
        if (statePickupConfig) return statePickupConfig;
        if (stateSnapshot) {
            try { return JSON.parse(stateSnapshot); } catch (_) { }
        }
        return null;
    });

    useEffect(() => {
        if (!orderId) {
            navigate('/');
            return;
        }

        if (authLoading || !authUser) return;
        let active = true;
        let timer;
        let checks = 0;
        const loadOrder = async () => {
            try {
                const orderData = await apiClient.get('/api/orders?orderId=' + encodeURIComponent(orderId));
                if (!active) return;
                setLoadedOrder({ uid: authUser.uid, order: orderData });
                setStatusError('');
                if (orderData.pickupLocationSnapshot) {
                    try {
                        setPickupConfig(JSON.parse(orderData.pickupLocationSnapshot));
                    } catch (_) { }
                }
                if (orderData.status === 'pending' && ++checks < 8) {
                    timer = setTimeout(loadOrder, 5000);
                }
            } catch (err) {
                if (active) setStatusError(err.status === 404 ? 'Order not found for this account.' : 'We couldn’t load your order status. Try again shortly.');
            }
        };
        setStatusError('');
        loadOrder();
        return () => {
            active = false;
            clearTimeout(timer);
        };
    }, [orderId, authLoading, authUser, navigate, statusRefresh]);

    useEffect(() => {
        if (!pickupConfig) {
            apiClient.get('/api/config/preorder-pickup')
                .then(cfg => {
                    if (cfg) setPickupConfig(prev => prev || cfg);
                })
                .catch(err => console.error("[CheckoutSuccess] Failed to refresh order details:", err));
        }
    }, [pickupConfig]);

    const paymentMethod = fetchedOrder?.paymentMethod || statePaymentMethod;
    const orderStatus = fetchedOrder?.status;
    const confirmed = ['paid', 'shipped', 'delivered', 'picked_up', 'ready_for_pickup',
        'dispatched_instant', 'preorder_production', 'preorder_quality_check',
        'AWAITING_PICKUP', 'READY_FOR_PICKUP', 'COLLECTED'].includes(orderStatus) ||
        (orderStatus === 'pending_payment' && paymentMethod === 'offline_qr');
    useEffect(() => {
        if (!confirmed) return;
        try {
            confetti({
                particleCount: 140,
                spread: 90,
                origin: { y: 0.55 },
                colors: ['#D4A373', '#8F5E36', '#2E7D32', '#F4D392', '#E8F5E9']
            });
            setTimeout(() => {
                confetti({
                    particleCount: 70,
                    angle: 60,
                    spread: 60,
                    origin: { x: 0 },
                    colors: ['#D4A373', '#8F5E36', '#F4D392']
                });
            }, 250);
            setTimeout(() => {
                confetti({
                    particleCount: 70,
                    angle: 120,
                    spread: 60,
                    origin: { x: 1 },
                    colors: ['#D4A373', '#8F5E36', '#F4D392']
                });
            }, 400);
        } catch (err) {
            console.log("Confetti animation error:", err);
        }
    }, [confirmed]);

    if (!orderId) {
        return null;
    }

    if (!confirmed) {
        const pending = orderStatus === 'pending';
        const review = orderStatus === 'payment_review';
        const failed = ['cancelled', 'payment_failed'].includes(orderStatus);
        const title = review ? 'Payment received. Order under review' : failed ? 'Order closed' :
            pending ? 'Waiting for payment confirmation' : 'Order status';
        const redirect = '/checkout-success?orderId=' + encodeURIComponent(orderId);
        const message = authLoading ? 'Loading your account…' : !authUser ? 'Sign in to check this order.' :
            statusError || (review ? 'Your payment was received. Contact the store with your order number before trying again.' :
                failed ? 'This order is closed. Contact the store if money was deducted.' :
                    pending ? 'If you already paid, check this page again before making another payment.' :
                        'Checking your order details…');
        const cancelUnpaidOrder = async () => {
            setCancelling(true);
            try {
                await apiClient.post('/api/orders/' + encodeURIComponent(orderId) + '/cancel', {});
                setStatusRefresh(x => x + 1);
            } catch (err) {
                setStatusError(err.message);
            } finally {
                setCancelling(false);
            }
        };
        return (
            <main style={{ maxWidth: '36rem', margin: '3rem auto', padding: '0 1rem', textAlign: 'center' }}>
                <h1>{title}</h1>
                <p>{message}</p>
                <p>Order {orderId}</p>
                {!authLoading && !authUser && <Link to={'/auth?redirect=' + encodeURIComponent(redirect)}>Sign in</Link>}
                {authUser && !failed && <button type="button" onClick={() => setStatusRefresh(x => x + 1)}>Check status again</button>}
                {authUser && pending && <p><button type="button" disabled={cancelling} onClick={cancelUnpaidOrder}>Cancel unpaid order</button></p>}
                {authUser && (review || failed) && <p><Link to="/contact">Contact support</Link></p>}
                {authUser && failed && <p><Link to="/cart">Return to cart</Link></p>}
            </main>
        );
    }

    const displayGift = fetchedOrder?.unlockedGift || unlockedGift || gift;
    const isPhysical = giftType === 'physical';

    // Authoritative resolution of fulfillment & checkout type
    const fulfilmentType = fetchedOrder?.fulfilmentType || stateFulfilmentType || '';
    const checkoutType = fetchedOrder?.checkoutType || stateCheckoutType || '';
    const isPreorder = Boolean(fetchedOrder?.isPreorder || stateIsPreorder || fulfilmentType.startsWith('PREORDER') || fulfilmentType === 'STORE_PICKUP' || fulfilmentType === 'HOME_DELIVERY');
    const tracking = fetchedOrder?.trackingNumber || stateTracking || '';
    const amount = fetchedOrder?.totalAmount || stateAmount || 0;

    // Check if this is a Store Pickup order (covers both Preorder Store Pickup and Regular Store Pickup)
    const isStorePickup =
        fulfilmentType === 'PREORDER_STORE_PICKUP' ||
        fulfilmentType === 'STORE_PICKUP' ||
        checkoutType === 'pickup' ||
        tracking === 'STORE-PICKUP' ||
        paymentMethod === 'offline_qr';

    const isPreorderStorePickup = isPreorder && isStorePickup;
    const isOffline = paymentMethod === 'offline_qr';

    // QR Code data: point to admin confirm pickup view
    const qrUrl = window.location.origin + "/admin/index.html#pickup-scanner?orderId=" + orderId;
    const qrImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&color=2c2c2c&data=${encodeURIComponent(qrUrl)}`;

    return (
        <div style={{ padding: '1.5rem 1rem 3rem', maxWidth: '620px', margin: '0 auto', minHeight: '75vh', textAlign: 'center', width: '100%', boxSizing: 'border-box' }}>
            {/* Celebration Icon */}
            {isOffline ? (
                <div style={{
                    width: '76px',
                    height: '76px',
                    borderRadius: '50%',
                    background: '#FAF3ED',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem',
                    boxShadow: '0 8px 20px rgba(208,136,59,0.12)'
                }}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#8F5E36" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                    </svg>
                </div>
            ) : (
                <div style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '50%',
                    background: '#E8F5E9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem',
                    boxShadow: '0 8px 20px rgba(46,125,50,0.12)'
                }}>
                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', margin: 'auto' }}>
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </div>
            )}

            <h1 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.35rem, 5vw, 1.65rem)',
                marginBottom: '0.4rem',
                color: '#2D2A26',
                letterSpacing: '-0.01em',
                lineHeight: '1.25'
            }}>
                {isOffline ? "In-Store Order Reserved!" : "Order Placed Successfully!"}
            </h1>
            <p style={{ fontSize: '0.88rem', color: '#6C6863', marginBottom: '1.5rem', padding: '0 0.5rem' }}>Thank you for choosing authentic, handcrafted Jaipur kurtis.</p>

            <div style={{
                padding: '1.75rem 1rem 1.5rem',
                backgroundColor: '#fff',
                border: '1.5px solid #E6E4E0',
                borderRadius: '20px',
                margin: '1.75rem 0 1.25rem',
                boxShadow: '0 8px 30px rgba(0,0,0,0.025)',
                position: 'relative',
                boxSizing: 'border-box',
                maxWidth: '100%'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#D4A373',
                    color: '#fff',
                    padding: '4px 16px',
                    borderRadius: '20px',
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    whiteSpace: 'nowrap',
                    zIndex: 2
                }}>
                    In-Store Receipt
                </div>

                {/* Responsive Order Reference Pill */}
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem 0.5rem',
                    backgroundColor: '#FAF4EE',
                    border: '1.5px dashed #D4A373',
                    borderRadius: '24px',
                    padding: '0.55rem 0.9rem',
                    marginTop: '0.6rem',
                    marginBottom: '1.5rem',
                    boxShadow: '0 4px 15px rgba(212,163,115,0.06)',
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                    flexWrap: 'wrap'
                }}>
                    <span style={{ fontSize: '0.75rem', color: '#8F5E36', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>Order Reference</span>
                    <span style={{ color: '#D4A373', opacity: 0.6, display: 'inline-block' }}>|</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <strong style={{ fontSize: 'clamp(0.85rem, 3.8vw, 1.05rem)', fontFamily: 'monospace', color: '#2D2A26', letterSpacing: '0.03em', wordBreak: 'break-all' }}>#{orderId}</strong>
                        <CopyButton text={orderId} iconOnly={true} style={{ width: '28px', height: '28px', padding: 0, borderRadius: '50%', border: '1px solid #E6D8C8', backgroundColor: '#FFF', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} />
                    </span>
                </div>

                <p style={{ fontSize: '0.92rem', color: '#5C5854', lineHeight: '1.6', margin: '0 0 1.5rem', padding: '0 0.25rem' }}>
                    {isOffline
                        ? `Please present the verification pass QR code below at the reception counter to finalize payments of ₹${(amount || 0).toLocaleString('en-IN')} and collect your authentic Jaipuri kurtis.`
                        : isStorePickup
                            ? "Your store collection order is placed and confirmed. Keep the verification pass QR code below handy for scanning when collecting your order at our store."
                            : tracking && (tracking.startsWith('RAPIDO-INSTANT-') || tracking.startsWith('UBER-INSTANT-'))
                                ? "Registered for direct instant courier shipping. Your designer styles are prepared, steamed, and dispatched from Khajaguda via direct courier."
                                : "Your designer packaging is ready and handed over to express delivery trackers for prompt dispatch to your wardrobe."
                    }
                </p>


                {/* Preorder Fulfillment Timeline & Details */}
                {isPreorder && (
                    <div style={{
                        marginTop: '1.5rem',
                        padding: '1.2rem',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '14px',
                        textAlign: 'left'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.8rem' }}>
                            <span style={{
                                background: isPreorderStorePickup ? '#f3e8ff' : '#dbeafe',
                                color: isPreorderStorePickup ? '#7e22ce' : '#1d4ed8',
                                padding: '3px 10px',
                                borderRadius: '12px',
                                fontSize: '0.75rem',
                                fontWeight: 700
                            }}>
                                {isPreorderStorePickup ? '🏪 STORE PICKUP PREORDER' : '🚚 HOME DELIVERY PREORDER'}
                            </span>
                        </div>

                        <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '1rem' }}>
                            {isPreorderStorePickup
                                ? 'Your bespoke piece will be handcrafted in Jaipur and delivered to our Hyderabad store for pickup.'
                                : 'Your bespoke piece will be handcrafted in Jaipur, pass quality inspection, and dispatch to your address.'}
                        </div>

                        {/* Order Timeline */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '8px', fontSize: '0.78rem', textAlign: 'center' }}>
                            <div style={{ padding: '8px 4px', background: '#dcfce7', color: '#166534', borderRadius: '8px', fontWeight: 600 }}>1. Confirmed ✓</div>
                            <div style={{ padding: '8px 4px', background: '#f1f5f9', color: '#475569', borderRadius: '8px' }}>2. Production</div>
                            <div style={{ padding: '8px 4px', background: '#f1f5f9', color: '#475569', borderRadius: '8px' }}>3. Quality Check</div>
                            <div style={{ padding: '8px 4px', background: '#f1f5f9', color: '#475569', borderRadius: '8px' }}>
                                {isPreorderStorePickup ? '4. Ready for Pickup' : '4. Dispatched'}
                            </div>
                        </div>

                        {isPreorderStorePickup && (
                            <div style={{ marginTop: '1rem', paddingTop: '0.8rem', borderTop: '1px solid #e2e8f0', fontSize: '0.82rem', color: '#334155' }}>
                                <strong>📍 Collection Store:</strong> {pickupConfig?.locationName || 'The Ethnic Touch Store'}, {pickupConfig?.address || 'ESCI road, Kajaguda lake.'}, {pickupConfig?.city || 'Hyderabad'}
                                {pickupConfig?.availability && <div><strong>🕐 Timings:</strong> {pickupConfig.availability}</div>}
                                {pickupConfig?.contactInfo && <div><strong>📞 Store Contact:</strong> {pickupConfig.contactInfo}</div>}
                                {pickupConfig?.estimatedPickupDate && <div><strong>⏳ Ready Window:</strong> {pickupConfig.estimatedPickupDate}</div>}
                            </div>
                        )}
                    </div>
                )}

                {/* Show QR Code for In-Store Pickup */}
                {isStorePickup && (
                    <div style={{
                        marginTop: '1.25rem',
                        padding: '1.4rem 1rem',
                        background: '#FAF9F6',
                        border: '2px solid #D4A373',
                        borderRadius: '16px',
                        display: 'inline-block',
                        maxWidth: '100%',
                        boxSizing: 'border-box',
                        boxShadow: '0 8px 20px rgba(212,163,115,0.08)'
                    }}>
                        <p style={{ margin: '0 0 1rem', fontSize: '0.78rem', color: '#8F5E36', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            Store Verification Scanner Pass
                        </p>
                        <div style={{
                            padding: '8px',
                            background: '#fff',
                            borderRadius: '12px',
                            display: 'inline-block',
                            border: '1px solid #E6E4E0',
                            maxWidth: '100%',
                            boxSizing: 'border-box'
                        }}>
                            <img
                                src={qrImgUrl}
                                alt="Order Pickup Pass"
                                style={{ width: '180px', height: '180px', maxWidth: '100%', height: 'auto', display: 'block', margin: '0 auto' }}
                            />
                        </div>
                        <div>
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                marginTop: '1rem',
                                backgroundColor: '#FFF',
                                border: '1px dashed #D4A373',
                                borderRadius: '24px',
                                padding: '0.45rem 1rem',
                                maxWidth: '100%',
                                boxSizing: 'border-box',
                                flexWrap: 'wrap'
                            }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                    <strong style={{
                                        fontSize: 'clamp(0.85rem, 3.8vw, 1.05rem)',
                                        fontFamily: 'monospace',
                                        color: '#2D2A26',
                                        letterSpacing: '0.04em',
                                        wordBreak: 'break-all'
                                    }}>
                                        #{orderId}
                                    </strong>
                                    <CopyButton text={orderId} iconOnly={true} style={{ width: '28px', height: '28px', padding: 0, borderRadius: '50%', border: '1px solid #E6D8C8', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} />
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Standard Shipping Tracking code */}
                    {!isStorePickup && tracking && (
                <div style={{
                    marginTop: '1.25rem',
                    padding: '0.65rem 1rem',
                    background: '#FAF9F6',
                    border: '1.5px dashed #D4A373',
                    borderRadius: '24px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem 0.6rem',
                    flexWrap: 'wrap',
                    maxWidth: '100%',
                    boxSizing: 'border-box'
                }}>
                    <span style={{ fontSize: '0.8rem', color: '#6C6863', fontWeight: '500', whiteSpace: 'nowrap' }}>Carrier Waybill ID:</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <strong style={{ fontSize: 'clamp(0.85rem, 3.8vw, 1.05rem)', color: '#8F5E36', fontFamily: 'monospace', letterSpacing: '0.04em', wordBreak: 'break-all' }}>{tracking}</strong>
                        <CopyButton text={tracking} iconOnly={true} style={{ width: '28px', height: '28px', padding: 0, borderRadius: '50%', border: '1px solid #E6D8C8', backgroundColor: '#FFF', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} />
                    </span>
                </div>
                )}

                {displayGift && !giftType && <p style={{ textAlign: 'center' }}>Order reward: <strong>{displayGift}</strong></p>}
                {displayGift && giftType && (
                    <div style={{
                        marginTop: '1.75rem',
                        padding: '1.4rem 1rem',
                        border: '1.5px solid #FFE5D9',
                        backgroundColor: '#FAF3ED',
                        borderRadius: '16px',
                        boxShadow: '0 6px 20px rgba(212,163,115,0.06)',
                        maxWidth: '100%',
                        boxSizing: 'border-box'
                    }}>
                        {isPhysical ? (
                            <div>
                                <h4 style={{ color: '#8F5E36', margin: '0 0 0.4rem', fontFamily: 'var(--font-heading)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#8F5E36' }}>
                                        <polyline points="20 12 20 22 4 22 4 12" />
                                        <rect x="2" y="7" width="20" height="5" />
                                        <line x1="12" y1="22" x2="12" y2="7" />
                                        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                                        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                                    </svg>
                                    Free Gift Gained!
                                </h4>
                                <p style={{ margin: 0, fontSize: '0.88rem', color: '#6C6863', lineHeight: '1.5' }}>
                                    A complimentary bespoke <strong>{displayGift}</strong> has been contributed to your package and will dispatch in the same carton!
                                </p>
                            </div>
                        ) : (
                            <div>
                                <h4 style={{ color: '#8F5E36', margin: '0 0 0.4rem', fontFamily: 'var(--font-heading)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#8F5E36' }}>
                                        <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707-.707M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
                                    </svg>
                                    Reward Coupon Unlocked!
                                </h4>
                                <div style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    backgroundColor: '#FFF',
                                    border: '1px dashed #D4A373',
                                    borderRadius: '24px',
                                    padding: '0.45rem 1rem',
                                    marginTop: '0.6rem',
                                    maxWidth: '100%',
                                    boxSizing: 'border-box',
                                    flexWrap: 'wrap'
                                }}>
                                    <strong style={{ fontSize: '0.95rem', fontFamily: 'monospace', color: '#8F5E36', letterSpacing: '0.06em', wordBreak: 'break-all' }}>{displayGift}</strong>
                                    <CopyButton text={displayGift} iconOnly={true} style={{ width: '28px', height: '28px', padding: 0, borderRadius: '50%', border: '1px solid #E6D8C8', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} />
                                </div>
                                {giftExpiryDate && (
                                    <div style={{ marginTop: '0.75rem' }}>
                                        <span style={{
                                            fontSize: '0.72rem',
                                            color: '#B83232',
                                            fontWeight: '700',
                                            backgroundColor: '#FFF2F2',
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            display: 'inline-block',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em'
                                        }}>
                                            Valid Until: {new Date(giftExpiryDate).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <Link to="/" className="btn btn-primary" style={{
                padding: '0.85rem 2.2rem',
                fontSize: '0.95rem',
                fontWeight: '600',
                borderRadius: '50px',
                letterSpacing: '0.02em',
                boxShadow: '0 6px 20px rgba(45,42,38,0.1)',
                display: 'inline-block',
                maxWidth: '100%',
                boxSizing: 'border-box'
            }}>Return to Storefront</Link>
        </div>
    );
};

export default CheckoutSuccess;
