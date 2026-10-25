import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flame, ArrowRight, Sparkles } from 'lucide-react';
import { getOptimizedImageUrl } from '../../utils/imageHelper';

const pad = (n) => String(n ?? 0).padStart(2, '0');

const FlashLoomDrop = ({ flashConfig, featuredProduct, onExpire }) => {
    const isManual = flashConfig?.mode === 'manual';
    const badgeText = flashConfig?.badge_text || 'SELLING FAST';

    const product = featuredProduct || {
        id: flashConfig?.product_id || 'p_Pi_88000',
        name: 'Pink Paisley Printed Straight Kurti',
        price: 549,
        originalPrice: 699,
        imageUrl: getOptimizedImageUrl('/images/kurthi_peach.png'),
        stock: 5,
        fabric: 'Cotton'
    };

    // If custom values were saved by admin, honor them; otherwise fallback to active rotating product
    const title = flashConfig?.title !== undefined && flashConfig.title !== '' ? flashConfig.title : 'Customer Favorite: ';
    const highlight = flashConfig?.highlight && flashConfig.highlight.trim() !== ''
        ? flashConfig.highlight 
        : product.name;

    const desc = flashConfig?.desc && flashConfig.desc.trim() !== ''
        ? flashConfig.desc 
        : (product.description || `Crafted in 100% soft breathable ${product.fabric || 'Jaipur cotton'} with handpicked artisan detailing. Perfect for daily wear and office comfort. Only a few pieces left in stock!`);

    const remainingStock = (flashConfig?.remaining_stock !== undefined && flashConfig.remaining_stock > 0)
        ? flashConfig.remaining_stock 
        : (product.stock !== undefined ? product.stock : 5);

    const totalStock = flashConfig?.total_stock !== undefined 
        ? flashConfig.total_stock 
        : Math.max(remainingStock + 10, 20);

    const stockPercent = Math.min(100, Math.max(10, Math.round(((totalStock - remainingStock) / totalStock) * 100)));

    const featureText = flashConfig?.feature_text && flashConfig.feature_text.trim() !== ''
        ? flashConfig.feature_text 
        : (product.fabric ? `100% Pure Breathable ${product.fabric}` : '100% Pure Breathable Cotton');

    const displayImage = getOptimizedImageUrl(product.imageUrl || flashConfig?.image_url || '/images/kurthi_peach.png');
    const displayPrice = flashConfig?.price || product.price || 449;
    const displayProductId = product.id || flashConfig?.product_id || '';

    const [timeLeft, setTimeLeft] = useState({
        hours: flashConfig?.hours_left !== undefined ? flashConfig.hours_left : 0,
        minutes: flashConfig?.minutes_left !== undefined ? flashConfig.minutes_left : 0,
        seconds: flashConfig?.seconds_left !== undefined ? flashConfig.seconds_left : 0
    });

    useEffect(() => {
        if (flashConfig) {
            setTimeLeft({
                hours: flashConfig.hours_left !== undefined ? flashConfig.hours_left : 0,
                minutes: flashConfig.minutes_left !== undefined ? flashConfig.minutes_left : 0,
                seconds: flashConfig.seconds_left !== undefined ? flashConfig.seconds_left : 0
            });
        }
    }, [flashConfig]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) {
                    return { ...prev, seconds: prev.seconds - 1 };
                } else if (prev.minutes > 0) {
                    return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                } else if (prev.hours > 0) {
                    return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
                } else {
                    // Timer reached 0! Trigger auto-revert or cycle refresh
                    if (onExpire) {
                        onExpire();
                    }
                    return { hours: 0, minutes: 0, seconds: 0 };
                }
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [onExpire]);

    return (
        <section className="flash-drop-section" id="flash-drop-section">
            <div className="flash-drop-card">
                <div className="flash-drop-content">
                    <div className="flash-live-pill">
                        <span className="flash-live-dot"></span>
                        {badgeText}
                    </div>

                    <h2 className="flash-title">
                        {title}<span>{highlight}</span>
                    </h2>

                    <p className="flash-desc">{desc}</p>

                    {/* Countdown Timer */}
                    <div className="flash-timer-row">
                        <div className="timer-box">
                            <span className="timer-number">{pad(timeLeft.hours)}</span>
                            <span className="timer-label">Hours</span>
                        </div>
                        <span className="timer-separator">:</span>
                        <div className="timer-box">
                            <span className="timer-number">{pad(timeLeft.minutes)}</span>
                            <span className="timer-label">Mins</span>
                        </div>
                        <span className="timer-separator">:</span>
                        <div className="timer-box">
                            <span className="timer-number">{pad(timeLeft.seconds)}</span>
                            <span className="timer-label">Secs</span>
                        </div>
                    </div>

                    {/* Remaining Stock Meter */}
                    <div className="flash-stock-meter">
                        <div className="flash-stock-info">
                            <span>Stock Availability</span>
                            <strong>Only {remainingStock} Pieces Remaining</strong>
                        </div>
                        <div className="flash-stock-bar">
                            <div className="flash-stock-fill" style={{ width: `${stockPercent}%` }}></div>
                        </div>
                    </div>

                    <div className="flash-cta-group">
                        <Link 
                            to={`/product/${displayProductId}/kurti`} 
                            className="flash-cta-btn"
                        >
                            Order Now &bull; ₹{Number(displayPrice).toLocaleString('en-IN')}
                            <ArrowRight size={16} />
                        </Link>
                        <span className="flash-feature-pill">
                            <Sparkles size={15} color="var(--color-primary)" /> {featureText}
                        </span>
                    </div>
                </div>

                <div className="flash-drop-visual">
                    <div className="flash-image-wrap">
                        <img 
                            src={displayImage} 
                            alt={highlight || product.name} 
                            loading="lazy" 
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FlashLoomDrop;
