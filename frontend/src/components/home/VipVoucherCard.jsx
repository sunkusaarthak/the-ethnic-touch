import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Gift, Copy, Check, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

const VipVoucherCard = ({ voucherConfig }) => {
    const [copied, setCopied] = useState(false);
    const couponCode = voucherConfig?.code || 'WELCOME10';
    const title = voucherConfig?.title || 'Get 10% Off Your First Order';
    const desc = voucherConfig?.desc || 'Use code WELCOME10 at checkout to get an extra 10% off on your first kurti order today!';

    const handleCopy = () => {
        try {
            navigator.clipboard.writeText(couponCode);
            localStorage.setItem('pendingCoupon', couponCode);
        } catch (e) {
            console.error('Failed to copy', e);
        }

        // Trigger celebratory luxury confetti burst
        confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.8 },
            colors: ['#D4A373', '#FFE5D9', '#D8E2DC', '#E8E8F2', '#2D2A26']
        });

        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    const handleApplyAndBrowse = () => {
        try {
            localStorage.setItem('pendingCoupon', couponCode);
        } catch (e) {
            console.error('Failed to save pending coupon', e);
        }
    };

    return (
        <section className="vip-voucher-section" aria-label="VIP First Order Reward">
            <div className="vip-voucher-card">
                <div className="vip-voucher-content">
                    <span className="vip-badge">
                        <Gift size={14} /> Special Welcome Offer
                    </span>
                    <h3 className="vip-title">{title}</h3>
                    <p className="vip-desc">{desc}</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'stretch' }}>
                    <div className="vip-code-box">
                        <span className="vip-code-text">{couponCode}</span>
                        <button 
                            className={`btn-copy-code ${copied ? 'copied' : ''}`}
                            onClick={handleCopy}
                            aria-label={`Copy coupon code ${couponCode}`}
                        >
                            {copied ? (
                                <>
                                    <Check size={15} /> Copied!
                                </>
                            ) : (
                                <>
                                    <Copy size={15} /> Copy Code
                                </>
                            )}
                        </button>
                    </div>

                    <Link 
                        to="/shop" 
                        onClick={handleApplyAndBrowse}
                        style={{ 
                            fontSize: '0.82rem', 
                            color: 'var(--color-primary)', 
                            fontWeight: '600', 
                            textAlign: 'center', 
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px'
                        }}
                    >
                        Apply Code & Browse Shop <ArrowRight size={13} />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default VipVoucherCard;
