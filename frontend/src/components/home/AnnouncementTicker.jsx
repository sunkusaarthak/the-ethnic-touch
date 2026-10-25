import React, { useState, useEffect } from 'react';
import { Truck, Sparkles, MapPin, Tag, ShieldCheck } from 'lucide-react';

import { API_BASE_URL } from '../../data/config';

const ICON_MAP = {
    truck: Truck,
    sparkles: Sparkles,
    'map-pin': MapPin,
    tag: Tag,
    shield: ShieldCheck
};

const defaultAnnouncements = [
    { icon: 'map-pin', text: 'Visit our store near Khajaguda Lake, Hyderabad' },
    { icon: 'truck', text: 'Free Delivery on orders above ₹1499 across India' },
    { icon: 'sparkles', text: '100% Pure Jaipur Cotton & Breathable Fabrics' },
    { icon: 'tag', text: 'Everyday Comfort for Office & Daily Wear under ₹599' },
    { icon: 'shield', text: 'Direct from Jaipur Artisans to your Doorstep' }
];

const AnnouncementTicker = ({ announcements }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fetchedItems, setFetchedItems] = useState(null);

    useEffect(() => {
        if (!announcements) {
            fetch(`${API_BASE_URL}/api/config/homepage`)
                .then(r => r.ok ? r.json() : null)
                .then(data => {
                    if (data?.announcements && data.announcements.length > 0) {
                        setFetchedItems(data.announcements);
                    }
                })
                .catch(() => {});
        }
    }, [announcements]);

    const items = (announcements && announcements.length > 0) 
        ? announcements 
        : (fetchedItems && fetchedItems.length > 0) 
            ? fetchedItems 
            : defaultAnnouncements;

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % items.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [items.length]);

    const activeItem = items[currentIndex] || items[0];
    const IconComponent = (activeItem && ICON_MAP[activeItem.icon]) || Sparkles;

    return (
        <div className="announcement-ticker" role="region" aria-label="Announcement">
            <div className="ticker-track">
                <div className="ticker-item" key={currentIndex}>
                    <IconComponent size={14} />
                    <span>{activeItem.text}</span>
                </div>
            </div>
        </div>
    );
};

export default AnnouncementTicker;
