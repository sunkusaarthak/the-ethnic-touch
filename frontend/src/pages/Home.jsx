import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Gift } from 'lucide-react';
import { API_BASE_URL } from '../data/config';
import { useCart } from '../context/CartContext';
import { saleProduct, useSale } from '../context/SaleContext';
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

    const publishedFlash = homepageConfig?.flash_drop;
    const flashConfig = publishedFlash?.next_change_at ? publishedFlash
        : window.resolveLegacySpotlight?.(publishedFlash, productsGlobal);
    const { sale } = useSale();
    const [spotlightProduct, setSpotlightProduct] = useState(null);
    const featuredID = flashConfig?.featured_product_id;
    useEffect(() => {
        if (!featuredID || flashConfig?.featured_product) return;
        const controller = new AbortController();
        fetch(`${API_BASE_URL}/api/products/${encodeURIComponent(featuredID)}`, {
            signal: controller.signal, cache: 'no-store'
        }).then(response => response.ok ? response.json() : null)
            .then(product => { if (product) setSpotlightProduct(product); })
            .catch(() => {});
        return () => controller.abort();
    }, [featuredID, flashConfig?.next_change_at, flashConfig?.featured_product]);
    const matchingProduct = flashConfig?.featured_product ??
        (spotlightProduct && String(spotlightProduct.id) === String(featuredID) ? spotlightProduct :
            productsGlobal?.find(product => String(product.id) === String(featuredID)));
    const inStock = matchingProduct && !matchingProduct.isPreorder && (Number(matchingProduct.stock) > 0 ||
        Object.values(matchingProduct.sizesStock || {}).some(qty => Number(qty) > 0));
    const flashFeaturedProduct = inStock ? saleProduct(matchingProduct, sale) : null;
    const handleFlashExpire = useCallback(async () => {
        const response = await fetch(`${API_BASE_URL}/api/config/homepage`, { cache: 'no-store' });
        if (!response.ok) throw new Error('Could not refresh Spotlight');
        setHomepageConfig(await response.json());
    }, []);

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
                flashConfig={flashConfig || {}}
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
