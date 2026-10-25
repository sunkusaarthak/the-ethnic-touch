import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, Star, MapPin } from 'lucide-react';
import { getOptimizedImageUrl } from '../../utils/imageHelper';

const defaultSlides = [
    {
        id: 1,
        tag: "✦ KHAJAGUDA STORE & ONLINE",
        titlePrefix: "Effortless Grace for ",
        titleHighlight: "Every Day",
        desc: "Exploring our curated collection of artisanal kurtis, crafted for comfort and celebration.",
        primaryCtaText: "Explore Collection",
        primaryCtaLink: "/shop",
        secondaryCtaText: "Discover Our Story",
        secondaryCtaLink: "/about",
        image: getOptimizedImageUrl("/images/hero_banner.png"),
        rating: "4.9/5",
        patrons: "Hyderabad & Pan-India",
        badge: "100% Pure Cotton"
    },
    {
        id: 2,
        tag: "Everyday Comfort • Pure Cotton",
        titlePrefix: "Comfortable Everyday Kurtis in ",
        titleHighlight: "Pure Cotton",
        desc: "Breathable, soft, and easy to wear all day. Handpicked Jaipur prints for office, college, and daily outings starting at just ₹449.",
        primaryCtaText: "Shop All Kurtis",
        primaryCtaLink: "/shop",
        secondaryCtaText: "Under ₹500",
        secondaryCtaLink: "/shop?priceRange=under-500",
        image: getOptimizedImageUrl("/images/kurthi_peach.png"),
        rating: "4.95/5",
        patrons: "Customer Favorite",
        badge: "Handpicked Prints"
    },
    {
        id: 3,
        tag: "Khajaguda Store & Online",
        titlePrefix: "Mustard & Olive ",
        titleHighlight: "Short Tunics",
        desc: "Lightweight, breezy cuts made for warm days and easy pairing with pants, palazzos, or jeans. Priced honestly under ₹599.",
        primaryCtaText: "Discover Tunics",
        primaryCtaLink: "/shop?category=Tunic",
        secondaryCtaText: "Get Directions",
        secondaryCtaLink: "https://share.google/eSxLvWitpLTqdQkn3",
        image: getOptimizedImageUrl("/images/kurthi_mint.png"),
        rating: "4.88/5",
        patrons: "Daily Essentials",
        badge: "Breathable Cotton"
    }
];

const normalizeSlide = (s) => ({
    id: s.id,
    tag: s.tag,
    titlePrefix: s.titlePrefix || s.title_prefix || '',
    titleHighlight: s.titleHighlight || s.title_highlight || '',
    desc: s.desc,
    primaryCtaText: s.primaryCtaText || s.primary_cta_text || 'Explore Collection',
    primaryCtaLink: s.primaryCtaLink || s.primary_cta_link || '/shop',
    secondaryCtaText: s.secondaryCtaText || s.secondary_cta_text || 'Visit Store',
    secondaryCtaLink: s.secondaryCtaLink || s.secondary_cta_link || 'https://share.google/eSxLvWitpLTqdQkn3',
    image: getOptimizedImageUrl(s.image),
    rating: s.rating,
    patrons: s.patrons,
    badge: s.badge
});

const HeroSlider = ({ slides: backendSlides }) => {
    const navigate = useNavigate();
    const rawSlides = (backendSlides && backendSlides.length > 0) ? backendSlides : defaultSlides;
    const slides = rawSlides.map(normalizeSlide);

    const [currentSlide, setCurrentSlide] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const touchStartX = useRef(null);
    const touchEndX = useRef(null);

    const nextSlide = useCallback(() => {
        setCurrentSlide(prev => (prev + 1) % slides.length);
    }, [slides.length]);

    const prevSlide = useCallback(() => {
        setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
    }, [slides.length]);

    // Autoplay logic
    useEffect(() => {
        if (isHovered) return;
        const timer = setInterval(() => {
            nextSlide();
        }, 5500);
        return () => clearInterval(timer);
    }, [isHovered, nextSlide]);

    // Touch Swipe handling for mobile devices
    const handleTouchStart = (e) => {
        touchStartX.current = e.targetTouches[0].clientX;
    };

    const handleTouchMove = (e) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (!touchStartX.current || !touchEndX.current) return;
        const diff = touchStartX.current - touchEndX.current;
        if (diff > 45) {
            nextSlide();
        } else if (diff < -45) {
            prevSlide();
        }
        touchStartX.current = null;
        touchEndX.current = null;
    };

    // Clicking anywhere on the banner navigates to full collection
    const handleBannerClick = () => {
        navigate('/shop');
    };

    return (
        <section 
            className="hero-slider-section"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            aria-label="Editorial Hero Slider"
        >
            <div className="hero-slider-container">
                {slides.map((slide, index) => {
                    const isActive = index === currentSlide;
                    const isExternalSecondary = slide.secondaryCtaLink.startsWith('http');

                    return (
                        <div 
                            key={slide.id} 
                            className={`hero-slide ${isActive ? 'active' : ''}`}
                            aria-hidden={!isActive}
                            onClick={handleBannerClick}
                            style={{ cursor: 'pointer' }}
                            title="Click to view all collection"
                        >
                            <div className="hero-slide-text">
                                <span className="hero-tag-pill">
                                    <Sparkles size={13} />
                                    {slide.tag}
                                </span>
                                <h1 className="hero-slide-title">
                                    {slide.titlePrefix}
                                    <span>{slide.titleHighlight}</span>
                                </h1>
                                <p className="hero-slide-desc">{slide.desc}</p>
                                
                                <div className="hero-actions-row">
                                    <Link 
                                        to={slide.primaryCtaLink} 
                                        className="btn-hero-primary"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {slide.primaryCtaText}
                                        <ArrowRight size={16} />
                                    </Link>
                                    {isExternalSecondary ? (
                                        <a 
                                            href={slide.secondaryCtaLink} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="btn-hero-secondary"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <MapPin size={15} style={{ display: 'inline', marginRight: '5px' }} />
                                            {slide.secondaryCtaText}
                                        </a>
                                    ) : (
                                        <Link 
                                            to={slide.secondaryCtaLink} 
                                            className="btn-hero-secondary"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {slide.secondaryCtaText}
                                        </Link>
                                    )}
                                </div>
                            </div>

                            <div className="hero-slide-visual">
                                <div className="hero-arch-contour" aria-hidden="true" />
                                <div className="hero-visual-frame">
                                    <img 
                                        src={slide.image} 
                                        alt={slide.titlePrefix + slide.titleHighlight} 
                                        fetchPriority={index === 0 ? "high" : "auto"}
                                        loading={index === 0 ? "eager" : "lazy"}
                                    />
                                </div>

                                <div className="hero-floating-badge">
                                    <Star size={16} fill="#E29578" color="#E29578" />
                                    <div className="hero-floating-badge-text">
                                        <strong>{slide.rating} Rating</strong>
                                        <span>{slide.patrons} • 24-48h Dispatch</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Arrow Controls */}
                <button 
                    className="hero-arrow-btn prev" 
                    onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                    aria-label="Previous Slide"
                >
                    <ChevronLeft size={20} />
                </button>
                <button 
                    className="hero-arrow-btn next" 
                    onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                    aria-label="Next Slide"
                >
                    <ChevronRight size={20} />
                </button>

                {/* Dots Navigation */}
                <div className="hero-dots-container" onClick={(e) => e.stopPropagation()}>
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            className={`hero-dot ${index === currentSlide ? 'active' : ''}`}
                            onClick={(e) => { e.stopPropagation(); setCurrentSlide(index); }}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HeroSlider;
