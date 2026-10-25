import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowRight, Sparkles, X, ShoppingBag } from 'lucide-react';
import { getOptimizedImageUrl } from '../../utils/imageHelper';

const ShopTheLook = ({ lookbookConfig, productsGlobal = [] }) => {
    // 1. Resolve curated products from real backend database
    const p1 = (productsGlobal || []).find(p => p.id === 'p_Mu_31700') || (productsGlobal || [])[0];
    const p2 = (productsGlobal || []).find(p => p.id === 'p_Pi_88000') || (productsGlobal || [])[1];

    const tag = lookbookConfig?.tag || 'How To Wear It';
    const title = lookbookConfig?.title || 'Office & Casual Cotton Looks';
    const desc = lookbookConfig?.desc || 'Bright, comfortable kurtis made from breathable cotton that keep you feeling fresh throughout busy days.';

    // 2. Build curated looks where each kurti has its OWN authentic model photo & pinpoint
    const curatedLooks = useMemo(() => {
        return [
            {
                id: 1,
                top: '55%',
                left: '51%',
                name: p1 ? p1.name : 'Mustard Yellow Mandala Print Short Kurti',
                price: p1 ? p1.price : 449,
                image: getOptimizedImageUrl(p1?.imageUrl || '/images/login_art.png'),
                category: p1?.category || 'Short Kurti',
                fabric: p1?.fabric || 'Pure Cotton',
                productId: p1 ? p1.id : 'p_Mu_31700',
                link: p1 ? `/product/${p1.id}/kurti` : '/product/p_Mu_31700/kurti'
            },
            {
                id: 2,
                top: '60%',
                left: '51%',
                name: p2 ? p2.name : 'Pink Paisley Printed Straight Kurti',
                price: p2 ? p2.price : 549,
                image: getOptimizedImageUrl(p2?.imageUrl || '/images/kurthi_peach.png'),
                category: p2?.category || 'Straight Cut',
                fabric: p2?.fabric || 'Pure Cotton',
                productId: p2 ? p2.id : 'p_Pi_88000',
                link: p2 ? `/product/${p2.id}/kurti` : '/product/p_Pi_88000/kurti'
            }
        ];
    }, [productsGlobal, p1, p2]);

    const [activeLook, setActiveLook] = useState(curatedLooks[0]);
    const [showPopover, setShowPopover] = useState(true);

    // Keep activeLook in sync when curatedLooks recalculates
    useEffect(() => {
        if (curatedLooks && curatedLooks.length > 0) {
            setActiveLook(prev => {
                if (!prev) return curatedLooks[0];
                const found = curatedLooks.find(l => l.id === prev.id);
                return found || curatedLooks[0];
            });
        }
    }, [curatedLooks]);

    const currentCoverImage = getOptimizedImageUrl(activeLook?.image || '/images/login_art.png');

    return (
        <section className="lookbook-section" id="shop-the-look-section" aria-label="Curated Lookbook">
            <div className="lookbook-container">
                {/* Left: Editorial Photo for Current Look with its exact Hotspot Pin */}
                <div className="lookbook-photo-wrap">
                    <img 
                        src={currentCoverImage} 
                        alt={`Editorial Lookbook - ${activeLook?.name || title}`} 
                        className="lookbook-cover-img"
                        loading="lazy" 
                        decoding="async"
                    />

                    {/* Single Accurate Hotspot Pin on the active kurti */}
                    {activeLook && (
                        <button
                            className="hotspot-pin active"
                            style={{ top: activeLook.top, left: activeLook.left }}
                            onClick={() => setShowPopover(prev => !prev)}
                            aria-label={`View ${activeLook.name}`}
                        >
                            <Plus size={16} />
                        </button>
                    )}

                    {/* Floating Bottom Card Preview for Active Kurti */}
                    {activeLook && showPopover && (
                        <div className="hotspot-popover" role="dialog" aria-label={`Preview ${activeLook.name}`}>
                            <div className="popover-content-left">
                                <img 
                                    src={activeLook.image} 
                                    alt={activeLook.name} 
                                    className="popover-img" 
                                />
                                <div className="popover-info">
                                    <h4 title={activeLook.name}>{activeLook.name}</h4>
                                    <div className="popover-price">₹{Number(activeLook.price).toLocaleString('en-IN')}</div>
                                    <span className="popover-meta">
                                        {activeLook.fabric} &bull; {activeLook.category}
                                    </span>
                                </div>
                            </div>

                            <div className="popover-actions">
                                <Link to={activeLook.link} className="btn-popover-shop">
                                    <ShoppingBag size={14} /> Shop
                                </Link>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowPopover(false);
                                    }}
                                    className="popover-close-btn"
                                    aria-label="Dismiss preview"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: Lookbook Story & Curated Switcher */}
                <div className="lookbook-details">
                    <span className="lookbook-tag">
                        <Sparkles size={13} style={{ display: 'inline', marginRight: '5px' }} />
                        {tag}
                    </span>
                    <h2 className="lookbook-title">{title}</h2>
                    <p className="lookbook-desc">{desc}</p>

                    <div className="lookbook-items-list">
                        {curatedLooks.map(item => {
                            const isCurrent = activeLook && activeLook.id === item.id;
                            return (
                                <div 
                                    key={item.id} 
                                    className={`lookbook-item-row ${isCurrent ? 'active' : ''}`}
                                    onClick={() => {
                                        setActiveLook(item);
                                        setShowPopover(true);
                                    }}
                                    tabIndex={0}
                                    role="button"
                                    aria-label={`Select ${item.name}`}
                                >
                                    <img src={item.image} alt={item.name} />
                                    <div className="lookbook-item-meta">
                                        <h5>{item.name}</h5>
                                        <span>{item.fabric} &bull; {item.category}</span>
                                    </div>
                                    <div className="lookbook-item-price-col">
                                        <div className="lookbook-item-price">₹{Number(item.price).toLocaleString('en-IN')}</div>
                                        <span className="lookbook-item-view-link">
                                            {isCurrent ? 'Showing Look ✓' : 'Switch Look →'}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <Link to="/shop" className="btn-hero-primary">
                        Shop The Collection
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default ShopTheLook;
