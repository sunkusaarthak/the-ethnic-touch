import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { createProductSlug } from '../../utils/slugHelper';
import { getOptimizedImageUrl } from '../../utils/imageHelper';

const pad = (n) => String(n ?? 0).padStart(2, '0');
const lowStockLimit = 5;

const FlashLoomDrop = ({ flashConfig, featuredProduct, onExpire }) => {
    const product = featuredProduct;
    const isManual = flashConfig?.mode === 'manual';
    const deadline = Date.parse(flashConfig?.next_change_at);
    const serverTime = Date.parse(flashConfig?.server_time);
    const [remaining, setRemaining] = useState(0);

    useEffect(() => {
        if (!Number.isFinite(deadline)) return;
        let running = true;
        let timer;
        const localDeadline = Number.isFinite(serverTime) ? Date.now() + deadline - serverTime : deadline;
        const tick = async () => {
            const seconds = Math.max(0, Math.ceil((localDeadline - Date.now()) / 1000));
            setRemaining(seconds);
            if (!seconds) {
                try {
                    await onExpire();
                } catch {
                    if (running) timer = setTimeout(tick, 5000);
                }
                return;
            }
            timer = setTimeout(tick, Math.min(1000, Math.max(5, localDeadline - Date.now())));
        };
        tick();
        return () => { running = false; clearTimeout(timer); };
    }, [deadline, serverTime, onExpire]);

    if (!flashConfig) return null;
    if (!product) return (
        <section className="flash-drop-section" id="flash-drop-section">
            <div className="flash-drop-card">
                <div className="flash-drop-content">
                    <h2 className="flash-title">Flash Spotlight Drop</h2>
                    <p className="flash-desc">Browse the collection while we prepare the next Spotlight.</p>
                    <Link className="flash-cta-btn" to="/shop">Shop the collection <ArrowRight size={16} /></Link>
                </div>
            </div>
        </section>
    );
    const badgeText = isManual && flashConfig?.badge_text ? flashConfig.badge_text : 'Flash Spotlight Drop';
    const title = isManual && flashConfig?.title ? flashConfig.title : 'Featured style: ';
    const highlight = isManual && flashConfig?.highlight?.trim() ? flashConfig.highlight : product.name;
    const desc = isManual && flashConfig?.desc?.trim() ? flashConfig.desc : product.description;
    const featureText = isManual && flashConfig?.feature_text?.trim() ? flashConfig.feature_text : product.fabric;
    const displayImage = product.imageUrl?.trim() ? getOptimizedImageUrl(product.imageUrl) : null;
    const displayPrice = product.price;
    const displayProductId = product.id;
    const sizeQuantities = Object.values(product.sizesStock || {}).map(Number);
    const remainingStock = sizeQuantities.length ? sizeQuantities.reduce((sum, qty) => sum + Math.max(0, qty), 0) : Number(product.stock);
    const timeLeft = { hours: Math.floor(remaining / 3600), minutes: Math.floor(remaining / 60) % 60, seconds: remaining % 60 };

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
                    {Number.isFinite(deadline) && <div className="flash-timer-row">
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
                    </div>}

                    {remainingStock > 0 && remainingStock <= lowStockLimit && <div className="flash-stock-meter">
                        <div className="flash-stock-info">
                            <span>Stock Availability</span>
                            <strong>Only {remainingStock} Pieces Remaining</strong>
                        </div>
                        <div className="flash-stock-bar" aria-hidden="true">
                            <div className="flash-stock-fill" style={{ width: (remainingStock / lowStockLimit * 100) + '%' }} />
                        </div>
                    </div>}

                    <div className="flash-cta-group">
                        <Link
                            to={`/product/${displayProductId}/${createProductSlug(product.name)}`}
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

                {displayImage && <div className="flash-drop-visual">
                    <div className="flash-image-wrap">
                        <img 
                            src={displayImage} 
                            alt={highlight || product.name} 
                            loading="lazy" 
                        />
                    </div>
                </div>}
            </div>
        </section>
    );
};

export default FlashLoomDrop;
