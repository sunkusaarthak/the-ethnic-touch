import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Play } from 'lucide-react';
import { getOptimizedImageUrl } from '../../utils/imageHelper';

const stories = [
    {
        id: 'all',
        label: 'All Kurtis',
        to: '/shop',
        type: 'img',
        image: getOptimizedImageUrl('/images/kurthi_7321.png')
    },
    {
        id: 'straight',
        label: 'Straight Cut',
        to: '/shop?category=Straight Cut',
        type: 'img',
        image: getOptimizedImageUrl('/images/kurthi_peach.png')
    },
    {
        id: 'tunic',
        label: 'Short Kurtis',
        to: '/shop?category=Tunic',
        type: 'img',
        image: getOptimizedImageUrl('/images/login_art.png')
    },
    {
        id: 'aline',
        label: 'A-Line Kurtis',
        to: '/shop?category=A-Line',
        type: 'img',
        image: getOptimizedImageUrl('/images/kurthi_lavender.png')
    },
    {
        id: 'daily',
        label: 'Daily Wear',
        to: '/shop',
        type: 'img',
        image: getOptimizedImageUrl('/images/kurthi_mint.png')
    },
    {
        id: 'under500',
        label: 'Under ₹500',
        to: '/shop?priceRange=under-500',
        type: 'img',
        image: getOptimizedImageUrl('/images/kurthi_blue.png')
    },
    {
        id: 'reels',
        label: 'Insta Reels',
        scrollTarget: '#reels-showcase-section',
        type: 'reel',
        image: getOptimizedImageUrl('/images/kurthi_7549.png')
    },
    {
        id: 'store',
        label: 'Visit Store',
        href: 'https://share.google/eSxLvWitpLTqdQkn3',
        type: 'store'
    }
];

const CategoryStories = ({ onStoryClick }) => {
    const handleScroll = (selector, e) => {
        if (selector) {
            e.preventDefault();
            const elem = document.querySelector(selector);
            if (elem) {
                elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    return (
        <section className="story-reels-section" aria-label="Visual Category Navigation">
            <div className="story-reels-scroll">
                {stories.map(item => {
                    const isScrollLink = Boolean(item.scrollTarget);
                    const isExternal = Boolean(item.href);
                    
                    const content = (
                        <>
                            <div className="story-bubble-ring">
                                <div className="story-bubble-inner">
                                    {item.type === 'store' ? (
                                        <div className="story-store-avatar">
                                            <MapPin size={24} strokeWidth={1.8} color="#C49363" />
                                        </div>
                                    ) : item.type === 'reel' ? (
                                        <>
                                            <img src={item.image} alt={item.label} loading="lazy" />
                                            <div className="story-play-overlay" aria-hidden="true">
                                                <Play size={11} fill="#FFFFFF" color="#FFFFFF" style={{ marginLeft: '1px' }} />
                                            </div>
                                        </>
                                    ) : (
                                        <img src={item.image} alt={item.label} loading="lazy" />
                                    )}
                                </div>
                            </div>
                            <span className="story-bubble-label">{item.label}</span>
                        </>
                    );

                    if (isExternal) {
                        return (
                            <a 
                                key={item.id} 
                                href={item.href} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="story-bubble-card"
                            >
                                {content}
                            </a>
                        );
                    }

                    if (isScrollLink) {
                        return (
                            <a 
                                key={item.id} 
                                href={item.scrollTarget} 
                                onClick={(e) => handleScroll(item.scrollTarget, e)} 
                                className="story-bubble-card"
                            >
                                {content}
                            </a>
                        );
                    }

                    return (
                        <Link 
                            key={item.id} 
                            to={item.to} 
                            className="story-bubble-card"
                            onClick={onStoryClick}
                        >
                            {content}
                        </Link>
                    );
                })}
            </div>
        </section>
    );
};

export default CategoryStories;



