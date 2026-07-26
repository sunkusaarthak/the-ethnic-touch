import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Checkout from './Checkout';
import AuthRequiredModal from '../components/AuthRequiredModal';
import { API_BASE_URL } from '../data/config';

const Cart = ({ cart, updateQuantity, removeFromCart, onApplyCoupon, discount, authUser }) => {
    const navigate = useNavigate();
    const [couponCode, setCouponCode] = useState('');
    const [msg, setMsg] = useState('');
    const defaultGiftTiers = [
        { id: 1, name: 'Bronze Gift', threshold: 3000, rewardType: 'physical', physicalName: 'Premium Leather Keychain' },
        { id: 2, name: 'Silver Gift', threshold: 5000, rewardType: 'coupon', discountType: 'percentage', discountValue: 15, couponFormat: 'GFT-SLVR-[RAND]' },
        { id: 3, name: 'Gold Gift', threshold: 10000, rewardType: 'coupon', discountType: 'fixed', discountValue: 2000, couponFormat: 'GFT-GOLD-[RAND]' },
        { id: 4, name: 'Platinum Gift', threshold: 15000, rewardType: 'coupon', discountType: 'percentage', discountValue: 25, couponFormat: 'GFT-PLAT-[RAND]' }
    ];

    const [tiers, setTiers] = useState(defaultGiftTiers);
    const [showAuthModal, setShowAuthModal] = useState(false);
    
    // Added a safety check (cart || []) just in case cart is ever undefined
    const subtotal = (cart || []).reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    const finalTotal = subtotal - (discount?.amt || discount?.value || 0);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/gift-tiers`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch gift tiers');
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    setTiers(data.sort((a, b) => a.threshold - b.threshold));
                }
            })
            .catch(err => {
                console.warn("Using default gift tiers:", err);
            });
    }, []);

    const handleCoupon = async () => {
        const cleanCode = (couponCode || '').trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
        if (!cleanCode) {
            setMsg('Please enter a coupon code');
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/coupons/validate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: cleanCode, total: subtotal })
            });
            if (!res.ok) {
                const err = await res.json();
                setMsg(err.error || 'Invalid code');
                return;
            }
            const data = await res.json();
            const coupon = data.coupon || data;
            const discountAmount = data.discountAmount !== undefined ? data.discountAmount : (coupon.type === 'fixed' ? coupon.value : (subtotal * coupon.value) / 100);
            
            onApplyCoupon({ code: coupon.code, amt: discountAmount });
            setMsg(`Applied: ₹${discountAmount} off!`);
        } catch (err) {
            setMsg('Validation failed');
        }
    };

    // Calculate progression details
    const unlockedTiers = tiers.filter(t => subtotal >= t.threshold);
    const nextTier = tiers.find(t => subtotal < t.threshold);
    const activeUnlocked = unlockedTiers.length > 0 ? unlockedTiers[unlockedTiers.length - 1] : null;
    const remaining = nextTier ? nextTier.threshold - subtotal : 0;

    const handleBack = (e) => {
        e.preventDefault();
        if (window.history.state && window.history.state.idx > 0) {
            navigate(-1);
        } else {
            navigate('/shop');
        }
    };

    return (
        <div className="cart-page-container" style={{maxWidth: '1200px', margin: '0 auto', minHeight: '75vh', padding: '1.25rem 5% 3rem'}}>
            <a 
                href="#" 
                onClick={handleBack} 
                className="cart-back-link" 
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '1rem', color: 'var(--color-text-light)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '500' }}
            >
                &larr; Back
            </a>
            <h1 style={{marginBottom: '1rem', fontSize: '1.35rem', fontFamily: 'var(--font-heading)', color: 'var(--color-text)', fontWeight: '400'}}>
                Your Cart ({(cart || []).reduce((s, i) => s + (i.quantity || 1), 0)})
            </h1>
            
            {!cart || cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem 1.5rem', backgroundColor: '#FAF6F0', borderRadius: 'var(--border-radius-lg)', border: '1px dashed rgba(212, 163, 115, 0.4)', marginTop: '0.5rem', maxWidth: '600px', margin: '0.5rem auto 0' }}>
                    <div style={{ marginBottom: '0.75rem', color: 'var(--color-primary)' }}>
                        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', marginBottom: '0.4rem', color: 'var(--color-text)' }}>Your cart is empty</h2>
                    <p style={{ color: 'var(--color-text-light)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>Looks like you haven't added any handcrafted luxury to your cart yet.</p>
                    <Link to="/shop" className="btn btn-primary" style={{ padding: '0.6rem 1.8rem', fontSize: '0.85rem', borderRadius: '50px' }}>Browse Collection</Link>
                </div>
            ) : (
                <div className="desktop-split-layout cart-layout" style={{ gap: '1.25rem' }}>
                    {/* Left Column: Cart Items List & Tiered Rewards */}
                    <div style={{flex: 1, minWidth: '280px'}}>
                        <div style={{backgroundColor: '#fff', borderRadius: '12px', padding: '0.9rem 1.1rem', border: '1px solid #f0efee', marginBottom: '1rem', boxShadow: '0 4px 15px rgba(0,0,0,0.02)'}}>
                            {cart.map((item, idx) => {
                                const itemQty = item.quantity || 1;
                                const itemTotal = item.price * itemQty;
                                return (
                                    <div key={idx} className="cart-item-row" style={{display:'flex', alignItems:'center', gap:'0.85rem', marginBottom: idx === cart.length - 1 ? 0 : '0.85rem', borderBottom: idx === cart.length - 1 ? 'none' : '1px solid #eee', paddingBottom: idx === cart.length - 1 ? 0 : '0.85rem', flexWrap:'wrap'}}>
                                        <img src={item.imageUrl} alt={item.name} style={{width:'56px', height:'56px', borderRadius:'8px', objectFit:'cover'}} />
                                        <div style={{flex: 1, minWidth: '140px'}}>
                                            <h3 style={{fontFamily:'var(--font-body)', fontWeight:'500', fontSize:'0.88rem', margin: 0}}>{item.name}</h3>
                                            {item.size && (
                                                <span style={{display: 'inline-block', backgroundColor: '#fff0e9', color: '#b97a66', padding: '0.1rem 0.45rem', borderRadius: '4px', fontSize: '0.72rem', marginTop: '0.15rem', fontWeight: '500'}}>
                                                    Size: {item.size}
                                                </span>
                                            )}
                                            <p style={{color:'var(--color-text-light)', fontSize:'0.75rem', margin: '0.15rem 0 0'}}>{item.description?.substring(0, 42)}...</p>
                                        </div>
                                        
                                        {/* Quantity Selector */}
                                        <div className="cart-quantity-selector" style={{display:'flex', alignItems:'center', gap:'0.25rem', border:'1px solid #e0e0e0', borderRadius:'6px', padding:'0.1rem 0.35rem', background:'#fbfbfb'}}>
                                            <button 
                                                onClick={() => updateQuantity && updateQuantity(idx, itemQty - 1)}
                                                aria-label="Decrease quantity"
                                                title="Decrease quantity"
                                                style={{width:'22px', height:'22px', border:'none', background:'#eee', borderRadius:'4px', cursor:'pointer', fontWeight:'bold', fontSize:'0.8rem', display:'flex', alignItems:'center', justifyContent:'center', color:'#333', transition:'all 0.2s ease'}}
                                                onMouseOver={e => e.currentTarget.style.background='#e0e0e0'}
                                                onMouseOut={e => e.currentTarget.style.background='#eee'}
                                            >
                                                -
                                            </button>
                                            <span style={{minWidth:'22px', textAlign:'center', fontWeight:'600', fontSize:'0.82rem', userSelect:'none'}}>
                                                {itemQty}
                                            </span>
                                            <button 
                                                onClick={() => updateQuantity && updateQuantity(idx, itemQty + 1)}
                                                aria-label="Increase quantity"
                                                title="Increase quantity"
                                                style={{width:'22px', height:'22px', border:'none', background:'#eee', borderRadius:'4px', cursor:'pointer', fontWeight:'bold', fontSize:'0.8rem', display:'flex', alignItems:'center', justifyContent:'center', color:'#333', transition:'all 0.2s ease'}}
                                                onMouseOver={e => e.currentTarget.style.background='#e0e0e0'}
                                                onMouseOut={e => e.currentTarget.style.background='#eee'}
                                            >
                                                +
                                            </button>
                                        </div>

                                        {/* Price section */}
                                        <div style={{textAlign:'right', minWidth:'85px'}}>
                                            <div style={{fontWeight:'600', fontSize:'0.88rem', color:'var(--color-text)'}}>
                                                ₹{itemTotal.toLocaleString('en-IN')}
                                            </div>
                                            {itemQty > 1 && (
                                                <div style={{fontSize:'0.7rem', color:'#888', marginTop:'1px'}}>
                                                    (₹{item.price.toLocaleString('en-IN')} each)
                                                </div>
                                            )}
                                        </div>

                                        {/* Delete button */}
                                        <button 
                                            onClick={() => removeFromCart && removeFromCart(idx)}
                                            aria-label="Delete item from cart"
                                            title="Remove item"
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#d9534f',
                                                cursor: 'pointer',
                                                padding: '0.25rem',
                                                borderRadius: '4px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onMouseOver={e => { e.currentTarget.style.backgroundColor = '#fff0f0'; e.currentTarget.style.color = '#c9302c'; }}
                                            onMouseOut={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#d9534f'; }}
                                        >
                                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="3 6 5 6 21 6"></polyline>
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                                <line x1="14" y1="11" x2="14" y2="17"></line>
                                            </svg>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Tiered Rewards Panel with Nodes, Descriptions & Cards */}
                        {tiers.length > 0 && (
                            <div className="gift-system-card" style={{padding: '1.25rem', borderRadius: '12px', marginBottom: '1rem', marginTop: '0'}}>
                                <h3 className="gift-system-title" style={{fontSize: '1.05rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px'}}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 12 20 22 4 22 4 12" />
                                        <rect x="2" y="7" width="20" height="5" />
                                        <line x1="12" y1="22" x2="12" y2="7" />
                                        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                                        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                                    </svg>
                                    <span>Exclusive Tiered Rewards</span>
                                </h3>

                                {nextTier ? (
                                    <div className="gift-milestone-banner progress" style={{padding: '0.6rem 0.8rem', borderRadius: '8px', marginBottom: '1.25rem'}}>
                                        <div style={{flex: 1, fontSize: '0.8rem'}}>
                                            Add <strong style={{color: 'var(--color-primary)'}}>₹{remaining.toLocaleString('en-IN')}</strong> more to unlock <strong>{nextTier.name}</strong>!
                                        </div>
                                        <div style={{fontSize: '0.82rem', fontWeight: '600', color: 'var(--color-primary)'}}>
                                            ₹{remaining.toLocaleString('en-IN')} away
                                        </div>
                                    </div>
                                ) : (
                                    <div className="gift-milestone-banner unlocked" style={{padding: '0.6rem 0.8rem', borderRadius: '8px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '6px'}}>
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink: 0}}>
                                            <path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z"/>
                                        </svg>
                                        <div style={{flex: 1, fontSize: '0.8rem'}}>
                                            <strong>Unlocked Top Tier:</strong> <strong>{activeUnlocked ? activeUnlocked.name : ""}</strong>!
                                        </div>
                                    </div>
                                )}
                                
                                {/* Progress Bar & Nodes */}
                                <div className="gift-progress-wrapper" style={{margin: '1.5rem 0 3.5rem', height: '40px'}}>
                                    <div className="gift-progress-track-bg" style={{top: '18px', height: '5px'}}></div>
                                    {(() => {
                                        if (tiers.length === 0) return null;
                                        const maxThreshold = tiers[tiers.length - 1].threshold;
                                        const fillPercent = Math.min(100, (subtotal / maxThreshold) * 100);
                                        return (
                                            <div 
                                                className="gift-progress-track-fill" 
                                                style={{ width: `${fillPercent}%`, top: '18px', height: '5px' }}
                                            ></div>
                                        );
                                    })()}

                                    <div className="gift-nodes-container">
                                        {tiers.map((t, index) => {
                                            const isUnlocked = subtotal >= t.threshold;
                                            return (
                                                <div key={t.id || index} className={`gift-node ${isUnlocked ? 'unlocked' : ''}`}>
                                                    <div className="gift-node-dot" style={{width: '38px', height: '38px', fontSize: '0.85rem'}}>
                                                        {isUnlocked ? (
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                                <polyline points="20 6 9 17 4 12"></polyline>
                                                            </svg>
                                                        ) : (
                                                            index + 1
                                                        )}
                                                    </div>
                                                    <div className="gift-node-label" style={{marginTop: '0.5rem', fontSize: '0.78rem'}}>
                                                        {t.name}
                                                    </div>
                                                    <div className="gift-node-threshold" style={{fontSize: '0.72rem', marginTop: '0.1rem'}}>
                                                        ₹{t.threshold.toLocaleString('en-IN')}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Reward Cards Grid with Descriptions */}
                                <div className="gift-cards-grid" style={{marginTop: '1rem', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'}}>
                                    {tiers.map((t) => {
                                        const isUnlocked = subtotal >= t.threshold;
                                        const isActive = activeUnlocked && activeUnlocked.id === t.id;
                                        let cardStatusClass = 'locked';
                                        if (isActive) cardStatusClass = 'active-unlocked';
                                        else if (isUnlocked) cardStatusClass = 'unlocked';

                                        return (
                                            <div key={t.id} className={`gift-reward-card ${cardStatusClass}`} style={{padding: '1rem'}}>
                                                <div>
                                                    <h4 style={{fontSize: '0.88rem', fontWeight: '600', marginBottom: '0.4rem', color: '#2D2A26'}}>
                                                        {t.name}
                                                    </h4>
                                                    <p style={{fontSize: '0.78rem', color: '#686461', margin: '0 0 0.6rem', lineHeight: '1.4', display: 'flex', alignItems: 'center', gap: '5px'}}>
                                                        {t.rewardType === 'physical' ? (
                                                            <>
                                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink: 0}}>
                                                                    <polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
                                                                </svg>
                                                                <span>Complimentary <strong>{t.physicalName || 'Gift Item'}</strong> included with order.</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink: 0}}>
                                                                    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"/><line x1="12" y1="6" x2="12" y2="18" strokeDasharray="2 2"/>
                                                                </svg>
                                                                <span><strong>{t.discountValue}% OFF</strong> promo coupon generated on checkout.</span>
                                                            </>
                                                        )}
                                                    </p>
                                                </div>
                                                <div style={{fontSize: '0.72rem', color: isUnlocked ? 'var(--color-primary)' : '#999', fontWeight: '600', borderTop: '1px dashed rgba(0,0,0,0.08)', paddingTop: '0.4rem'}}>
                                                    {isUnlocked ? 'Unlocked at ₹' + t.threshold.toLocaleString('en-IN') : 'Spend ₹' + t.threshold.toLocaleString('en-IN') + ' to unlock'}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
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

                        {/* Apply Coupon Block */}
                        <div style={{marginBottom: '0.85rem'}}>
                            <label style={{display: 'block', fontSize: '0.78rem', fontWeight: '600', color: '#555', marginBottom: '0.35rem'}}>Promo / Coupon Code</label>
                            <div style={{display: 'flex', gap: '0.4rem'}}>
                                <input 
                                    type="text" 
                                    className="coupon-input"
                                    value={couponCode} 
                                    onChange={e => setCouponCode(e.target.value)} 
                                    placeholder="e.g. WELCOME10"
                                    style={{padding: '0.4rem 0.65rem', border: '1px solid rgba(212, 163, 115, 0.25)', borderRadius: '8px', flex: 1, fontSize: '0.75rem', outline: 'none', height: '34px', background: '#FAF7F4'}}
                                />
                                <button 
                                    onClick={handleCoupon} 
                                    style={{
                                        padding: '0 0.85rem', 
                                        borderRadius: '50px', 
                                        fontSize: '0.78rem', 
                                        height: '34px', 
                                        background: 'linear-gradient(135deg, #D4A373 0%, #C49363 100%)', 
                                        color: '#FFF', 
                                        border: 'none', 
                                        fontWeight: '600', 
                                        cursor: 'pointer',
                                        boxShadow: '0 3px 10px rgba(212, 163, 115, 0.2)'
                                    }}
                                >
                                    Apply
                                </button>
                            </div>
                            {msg && <p style={{marginTop: '0.3rem', fontSize: '0.75rem', color: msg.includes('Applied') ? '#2E7D32' : '#D32F2F', fontWeight: '500'}}>{msg}</p>}
                        </div>

                        <div style={{borderTop: '1px solid rgba(212, 163, 115, 0.2)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem'}}>
                            <div style={{display: 'flex', justifyContent: 'space-between', color: '#6C6863'}}>
                                <span>Bag Subtotal</span>
                                <span style={{fontWeight: '600', color: '#2D2A26'}}>₹{subtotal.toLocaleString('en-IN')}</span>
                            </div>
                            {discount && (
                                <div style={{display: 'flex', justifyContent: 'space-between', color: '#2E7D32', fontWeight: '500'}}>
                                    <span>Discount ({discount.code})</span>
                                    <span>-₹{discount.amt.toLocaleString('en-IN')}</span>
                                </div>
                            )}
                            <div style={{display: 'flex', justifyContent: 'space-between', color: '#6C6863'}}>
                                <span>Estimated Shipping</span>
                                <span style={{color: '#2E7D32', fontWeight: '600'}}>FREE</span>
                            </div>

                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed rgba(212, 163, 115, 0.35)', paddingTop: '0.65rem', marginTop: '0.3rem'}}>
                                <span style={{fontWeight: 600, color: '#2D2A26', fontSize: '0.92rem'}}>Total Amount</span>
                                <span style={{fontSize: '1.1rem', fontWeight: 700, color: '#8F5E36', fontFamily: 'var(--font-body)'}}>₹{finalTotal.toLocaleString('en-IN')}</span>
                            </div>

                            <button 
                                type="button"
                                onClick={() => {
                                    if (!authUser) {
                                        setShowAuthModal(true);
                                    } else {
                                        navigate('/checkout');
                                    }
                                }}
                                style={{
                                    width: '100%', 
                                    height: '38px', 
                                    padding: '0', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    marginTop: '0.85rem', 
                                    borderRadius: '50px', 
                                    fontSize: '0.85rem', 
                                    fontWeight: '600', 
                                    cursor: 'pointer',
                                    border: 'none',
                                    background: 'linear-gradient(135deg, #D4A373 0%, #C49363 100%)',
                                    color: '#FFF',
                                    boxShadow: '0 4px 15px rgba(212, 163, 115, 0.25)',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                Proceed to Checkout &rarr;
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Handcrafted Sign In / Sign Up Modal Prompt */}
            <AuthRequiredModal 
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                redirectPath="/checkout"
            />
        </div>
    );
};

export default Cart;    