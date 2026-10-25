import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Gift } from 'lucide-react';
import { API_BASE_URL } from '../data/config';
import { useCart } from '../context/CartContext';
import './Home.css';

// Subcomponents for the modern e-commerce experience
import AnnouncementTicker from '../components/home/AnnouncementTicker';
import CategoryStories from '../components/home/CategoryStories';
import HeroSlider from '../components/home/HeroSlider';
import CuratedShowcase from '../components/home/CuratedShowcase';
import FlashLoomDrop from '../components/home/FlashLoomDrop';
import ShopTheLook from '../components/home/ShopTheLook';
import InstaReelsShowcase from '../components/home/InstaReelsShowcase';
import CraftsmanshipJourney from '../components/home/CraftsmanshipJourney';
import VipVoucherCard from '../components/home/VipVoucherCard';
import PatronReviews from '../components/home/PatronReviews';
import useSEO from '../utils/useSEO';

const Home = ({ productsGlobal, wishlist, toggleWishlist, addToCart }) => {
    useSEO({
        title: "The Ethnic Touch | Pure Cotton Jaipur Kurtis & Ethnic Wear",
        description: "Shop handcrafted 100% pure cotton Jaipur kurtis, straight cut kurtis, short tunics, and festive Anarkalis. Premium quality, direct from Jaipur delivered across India & Hyderabad.",
        canonicalUrl: "https://www.theethnictouch.com/"
    });

    const [spinConfig, setSpinConfig] = useState(null);
    const [homepageConfig, setHomepageConfig] = useState(null);
    const cartContext = useCart();

    // Safely resolve cart operations from props or context
    const effectiveAddToCart = addToCart || cartContext.addToCart;
    const effectiveWishlist = wishlist || cartContext.wishlist || [];
    const effectiveToggleWishlist = toggleWishlist || cartContext.toggleWishlist;

    useEffect(() => {
        // 1. Fetch spin wheel config
        fetch(`${API_BASE_URL}/api/config/spin-wheel`)
            .then(res => res.ok ? res.json() : null)
            .then(data => { if (data) setSpinConfig(data); })
            .catch(console.error);

        // 2. Fetch comprehensive homepage data from backend (Reels, stats, slides, ticker, flash drop, etc.)
        fetch(`${API_BASE_URL}/api/config/homepage`)
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data) setHomepageConfig(data);
            })
            .catch(err => {
                console.warn("Using local defaults for homepage config:", err);
            });
    }, []);

    // Dynamic Flash Loom Drop product resolution
    const flashConfig = homepageConfig?.flash_drop;
    let flashFeaturedProduct = null;

    if (productsGlobal && productsGlobal.length > 0) {
        // 1. If product_id is specified in flash_drop, find that exact product
        if (flashConfig?.product_id) {
            flashFeaturedProduct = productsGlobal.find(p => String(p.id) === String(flashConfig.product_id));
        }
        // 2. If highlight matches a product name in the catalog (case-insensitive)
        if (!flashFeaturedProduct && flashConfig?.highlight) {
            const cleanHl = flashConfig.highlight.trim().toLowerCase();
            flashFeaturedProduct = productsGlobal.find(p => p.name && p.name.trim().toLowerCase() === cleanHl);
        }
        // 3. Otherwise, if not matched or rotating, use deterministic rotation
        if (!flashFeaturedProduct) {
            const inStockKurtis = productsGlobal.filter(p => {
                const cat = (p.category || '').toLowerCase();
                const name = (p.name || '').toLowerCase();
                const isKurti = cat.includes('kurti') || cat.includes('tunic') || cat.includes('straight') || cat.includes('line') || name.includes('kurti');
                return (p.stock || 0) > 0 && isKurti;
            });
            const pool = inStockKurtis.length > 0 ? inStockKurtis : (productsGlobal.filter(p => (p.stock || 0) > 0).length > 0 ? productsGlobal.filter(p => (p.stock || 0) > 0) : productsGlobal);
            const durHours = flashConfig?.duration_hours !== undefined ? flashConfig.duration_hours : 6;
            const durMins = flashConfig?.duration_mins !== undefined ? flashConfig.duration_mins : 0;
            const totalCycleMins = (durHours * 60) + durMins;
            const cycleMs = (totalCycleMins > 0 ? totalCycleMins : 360) * 60 * 1000;
            const cycleStart = flashConfig?.cycle_started_at 
                ? new Date(flashConfig.cycle_started_at).getTime() 
                : 0;
            const elapsedMs = Math.max(0, Date.now() - cycleStart);
            const cycleBlock = Math.floor(elapsedMs / cycleMs);
            const index = Math.abs(cycleBlock) % pool.length;
            flashFeaturedProduct = pool[index];
        }
    }

    const handleFlashExpire = () => {
        // When configured countdown timer expires:
        // Automatically switch back to random rotation mode
        setHomepageConfig(prev => {
            if (!prev) return prev;
            const durHours = prev.flash_drop?.duration_hours !== undefined ? prev.flash_drop.duration_hours : 6;
            const durMins = prev.flash_drop?.duration_mins !== undefined ? prev.flash_drop.duration_mins : 0;
            return {
                ...prev,
                flash_drop: {
                    ...prev.flash_drop,
                    mode: 'random',
                    hours_left: durHours,
                    minutes_left: durMins,
                    seconds_left: 0
                }
            };
        });
        // Sync with backend
        fetch(`${API_BASE_URL}/api/config/homepage`)
            .then(res => res.ok ? res.json() : null)
            .then(data => { if (data) setHomepageConfig(data); })
            .catch(() => {});
    };

    return (
        <main className="modern-ecommerce-homepage" role="main">
            {/* 1. App-Style Category Story Bubbles */}
            <CategoryStories />

            {/* 3. Luxury Multi-Slide Hero Showcase (Data from Backend) */}
            <HeroSlider 
                slides={homepageConfig?.hero_slides} 
            />

            {/* 4. Curated Tabbed Product Showcase with Quick-Add Size Drawer */}
            <CuratedShowcase 
                products={productsGlobal}
                wishlist={effectiveWishlist}
                toggleWishlist={effectiveToggleWishlist}
                addToCart={effectiveAddToCart}
            />

            {/* 5. Flash Loom Drop - Limited Edition Urgency Banner (Data from Backend) */}
            <FlashLoomDrop 
                flashConfig={homepageConfig?.flash_drop}
                featuredProduct={flashFeaturedProduct}
                onExpire={handleFlashExpire}
            />

            {/* 6. "Shop The Look" - Interactive Editorial Hotspots (Data from Backend) */}
            <ShopTheLook 
                lookbookConfig={homepageConfig?.lookbook} 
                productsGlobal={productsGlobal}
            />

            {/* 7. Instagram Shoppable Reels Integration with Backend Stats & Thumbnails */}
            <InstaReelsShowcase 
                instagramConfig={homepageConfig?.instagram}
                productsGlobal={productsGlobal}
                addToCart={effectiveAddToCart}
            />

            {/* 8. The Weaver's Journey & Slow Fashion Heritage */}
            <CraftsmanshipJourney />

            {/* 9. VIP Silk Circle 10% Off Voucher with Confetti Celebration (Data from Backend) */}
            <VipVoucherCard 
                voucherConfig={homepageConfig?.vip_voucher} 
            />

            {/* 10. Real Patron Reviews & Testimonials Carousel (Data from Backend) */}
            <PatronReviews 
                reviews={homepageConfig?.reviews} 
            />

            {/* Floating Spin and Win Button */}
            {spinConfig && spinConfig.enabled && (
                <Link 
                    to="/spin-and-win" 
                    className="floating-spin-btn"
                    aria-label="Spin and Win discounts"
                >
                    <Gift size={16} color="#fff" style={{ marginRight: '0.2rem' }} /> Spin & Win
                </Link>
            )}
        </main>
    );
};

export default Home;
