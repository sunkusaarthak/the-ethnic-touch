import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate, Link, useLocation, useParams, Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import Checkout from './Checkout';

const Cart = ({ cart, updateQuantity, removeFromCart, onApplyCoupon, discount }) => {
    const [couponCode, setCouponCode] = useState('');
    const [msg, setMsg] = useState('');
    const [tiers, setTiers] = useState([]);
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    const finalTotal = subtotal - (discount?.amt || discount?.value || 0);

    useEffect(() => {
        fetch('/api/gift-tiers')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setTiers(data.sort((a, b) => a.threshold - b.threshold));
                }
            })
            .catch(err => console.error("Error fetching tiers:", err));
    }, []);

    const handleCoupon = async () => {
        try {
            const res = await fetch('/api/coupons/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: couponCode, total: subtotal })
            });
            if (!res.ok) {
                const err = await res.json();
                setMsg(err.error || 'Invalid code');
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

    // Calculate progression details
    const unlockedTiers = tiers.filter(t => subtotal >= t.threshold);
    const nextTier = tiers.find(t => subtotal < t.threshold);
    const activeUnlocked = unlockedTiers.length > 0 ? unlockedTiers[unlockedTiers.length - 1] : null;
    const remaining = nextTier ? nextTier.threshold - subtotal : 0;

    return (
        <div className="cart-page-container" style={{maxWidth: '800px', margin: '0 auto', minHeight: '80vh'}}>
            <h1 style={{marginBottom: '2rem'}}>Your Cart</h1>
            {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '5rem 2rem', backgroundColor: '#FAF6F0', borderRadius: 'var(--border-radius-lg)', border: '1px dashed rgba(212, 163, 115, 0.4)', marginTop: '2rem' }}>
                    <div style={{ marginBottom: '1.5rem', color: 'var(--color-primary)' }}>
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '1rem', color: 'var(--color-text)' }}>Your cart is empty</h2>
                    <p style={{ color: 'var(--color-text-light)', marginBottom: '2.5rem', fontSize: '1.1rem' }}>Looks like you haven't added any handcrafted luxury to your cart yet.</p>
                    <Link to="/shop" className="btn btn-primary" style={{ padding: '1rem 3rem', letterSpacing: '1px' }}>Browse Collection</Link>
                </div>
            ) : (
                <div>
                    {cart.map((item, idx) => {
                        const itemQty = item.quantity || 1;
                        const itemTotal = item.price * itemQty;
                        return (
                            <div key={idx} className="cart-item-row" style={{display:'flex', alignItems:'center', gap:'1.5rem', marginBottom:'1.5rem', borderBottom:'1px solid #eee', paddingBottom:'1.5rem', flexWrap:'wrap'}}>
                                <img src={item.imageUrl} alt={item.name} style={{width:'80px', height:'80px', borderRadius:'8px', objectFit:'cover'}} />
                                <div style={{flex: 1, minWidth: '180px'}}>
                                    <h3 style={{fontFamily:'var(--font-body)', fontWeight:'500', fontSize:'1.05rem', margin: 0}}>{item.name}</h3>
                                    {item.size && (
                                        <span style={{display: 'inline-block', backgroundColor: '#fff0e9', color: '#b97a66', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', marginTop: '0.3rem', fontWeight: '500'}}>
                                            Size: {item.size}
                                        </span>
                                    )}
                                    <p style={{color:'var(--color-text-light)', fontSize:'0.85rem', margin: '0.4rem 0 0'}}>{item.description?.substring(0, 50)}...</p>
                                </div>
                                
                                {/* Quantity Selector */}
                                <div className="cart-quantity-selector" style={{display:'flex', alignItems:'center', gap:'0.4rem', border:'1px solid #e0e0e0', borderRadius:'6px', padding:'0.2rem 0.5rem', background:'#fbfbfb'}}>
                                    <button 
                                        onClick={() => updateQuantity && updateQuantity(idx, itemQty - 1)}
                                        aria-label="Decrease quantity"
                                        title="Decrease quantity"
                                        style={{width:'28px', height:'28px', border:'none', background:'#eee', borderRadius:'4px', cursor:'pointer', fontWeight:'bold', fontSize:'1rem', display:'flex', alignItems:'center', justifyContent:'center', color:'#333', transition:'all 0.2s ease'}}
                                        onMouseOver={e => e.currentTarget.style.background='#e0e0e0'}
                                        onMouseOut={e => e.currentTarget.style.background='#eee'}
                                    >
                                        -
                                    </button>
                                    <span style={{minWidth:'28px', textAlign:'center', fontWeight:'600', fontSize:'0.95rem', userSelect:'none'}}>
                                        {itemQty}
                                    </span>
                                    <button 
                                        onClick={() => updateQuantity && updateQuantity(idx, itemQty + 1)}
                                        aria-label="Increase quantity"
                                        title="Increase quantity"
                                        style={{width:'28px', height:'28px', border:'none', background:'#eee', borderRadius:'4px', cursor:'pointer', fontWeight:'bold', fontSize:'1rem', display:'flex', alignItems:'center', justifyContent:'center', color:'#333', transition:'all 0.2s ease'}}
                                        onMouseOver={e => e.currentTarget.style.background='#e0e0e0'}
                                        onMouseOut={e => e.currentTarget.style.background='#eee'}
                                    >
                                        +
                                    </button>
                                </div>

                                {/* Price section */}
                                <div style={{textAlign:'right', minWidth:'100px'}}>
                                    <div style={{fontWeight:'600', fontSize:'1.05rem', color:'var(--color-text)'}}>
                                        ₹{itemTotal.toLocaleString('en-IN')}
                                    </div>
                                    {itemQty > 1 && (
                                        <div style={{fontSize:'0.75rem', color:'#888', marginTop:'2px'}}>
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
                                        padding: '0.4rem',
                                        borderRadius: '4px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseOver={e => { e.currentTarget.style.backgroundColor = '#fff0f0'; e.currentTarget.style.color = '#c9302c'; }}
                                    onMouseOut={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#d9534f'; }}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                        <line x1="10" y1="11" x2="10" y2="17"></line>
                                        <line x1="14" y1="11" x2="14" y2="17"></line>
                                    </svg>
                                </button>
                            </div>
                        );
                    })}
                                 {/* Beautiful, Animated Premium Tiered Reward Panel */}
                    {tiers.length > 0 && (
                        <div className="gift-system-card">
                            <h3 className="gift-system-title">
                                Premium Tiered Rewards
                            </h3>

                            {/* Milestone Information Banner */}
                            {nextTier ? (
                                <div className="gift-milestone-banner progress">
                                    <div style={{flex: 1, fontSize: '0.95rem'}}>
                                        Add <strong style={{color: 'var(--color-primary)'}}>₹{remaining.toLocaleString('en-IN')}</strong> more to unlock the next milestone: <strong>{nextTier.name}</strong>!
                                    </div>
                                    <div style={{fontSize: '1.05rem', fontWeight: '600', color: 'var(--color-primary)'}}>
                                        ₹{remaining.toLocaleString('en-IN')} to go
                                    </div>
                                </div>
                            ) : (
                                <div className="gift-milestone-banner unlocked">
                                    <div style={{flex: 1, fontSize: '0.95rem'}}>
                                        <strong>Congratulations!</strong> You have unlocked the highest reward tier: <strong>{activeUnlocked ? activeUnlocked.name : ""}</strong>!
                                    </div>
                                </div>
                            )}

                            {/* Horizontal Progress Timeline */}
                            <div className="gift-progress-wrapper">
                                <div className="gift-progress-track-bg"></div>
                                {(() => {
                                    if (tiers.length === 0) return null;
                                    const maxThreshold = tiers[tiers.length - 1].threshold;
                                    const fillPercent = Math.min(100, (subtotal / maxThreshold) * 100);
                                    return (
                                        <div 
                                            className="gift-progress-track-fill" 
                                            style={{ width: `${fillPercent}%` }}
                                        ></div>
                                    );
                                })()}

                                <div className="gift-nodes-container" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100%' }}>
                                    {/* Start Node Indicator at 0% */}
                                    <div style={{
                                        position: 'absolute',
                                        left: '0%',
                                        transform: 'translateX(-50%)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        zIndex: 3
                                    }}>
                                        <div style={{
                                            width: '12px',
                                            height: '12px',
                                            borderRadius: '50%',
                                            backgroundColor: 'var(--color-primary)',
                                            marginTop: '18px',
                                            boxShadow: '0 0 8px rgba(212,163,115,0.4)',
                                            border: '2px solid white'
                                        }}></div>
                                        <div className="gift-node-label" style={{ marginTop: '0.8rem' }}>
                                            <div>Start</div>
                                            <div className="gift-node-threshold">₹0</div>
                                        </div>
                                    </div>

                                    {tiers.map((t, idx) => {
                                        const maxThreshold = tiers[tiers.length - 1].threshold;
                                        const percent = (t.threshold / maxThreshold) * 100;
                                        const isUnlocked = subtotal >= t.threshold;
                                        return (
                                            <div 
                                                key={t.id} 
                                                className={`gift-node ${isUnlocked ? 'unlocked' : ''}`}
                                                style={{
                                                    position: 'absolute',
                                                    left: `${percent}%`,
                                                    transform: 'translateX(-50%)',
                                                    zIndex: 3
                                                }}
                                            >
                                                <div className="gift-node-dot">
                                                    {isUnlocked ? '✓' : idx + 1}
                                                </div>
                                                <div className="gift-node-label">
                                                    <div>{t.name}</div>
                                                    <div className="gift-node-threshold">₹{parseInt(t.threshold).toLocaleString('en-IN')}</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Rewards Detail Cards Grid */}
                            <div className="gift-cards-grid">
                                {tiers.map((t) => {
                                    const isUnlocked = subtotal >= t.threshold;
                                    const isActive = activeUnlocked && activeUnlocked.id === t.id;
                                    
                                    return (
                                        <div 
                                            key={t.id} 
                                            className={`gift-reward-card ${isUnlocked ? 'unlocked' : 'locked'} ${isActive ? 'active-unlocked' : ''}`}
                                        >
                                            <div>
                                                <div className="gift-reward-card-label">Tier {t.threshold >= 10000 ? 'Gold' : t.threshold >= 5000 ? 'Silver' : 'Bronze'}</div>
                                                <h4 className="gift-reward-card-title">{t.name}</h4>
                                                <p className="gift-reward-card-desc">
                                                    {t.rewardType === 'coupon' 
                                                        ? `Qualified for a custom digital coupon giving ${t.discountType === 'percentage' ? t.discountValue + '%' : '₹' + t.discountValue} discount off your next purchase.` 
                                                        : `Includes a handcraft premium physical gift: ${t.physicalName} packed dynamically in your parcel.`
                                                    }
                                                </p>
                                            </div>
                                            
                                            <div className="gift-reward-card-requirement" style={{ color: isUnlocked ? '#2E7D32' : 'var(--color-primary)' }}>
                                                <span>{isUnlocked ? 'Unlocked' : `Spend ₹${parseInt(t.threshold).toLocaleString('en-IN')}`}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

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

export default Cart;
