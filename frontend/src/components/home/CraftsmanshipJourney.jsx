import React from 'react';
import { Sparkles, Truck, MapPin, Feather, ExternalLink } from 'lucide-react';

const pillars = [
    {
        icon: Feather,
        title: "Breathable Daily Comfort",
        desc: "Lightweight, soft 100% cotton kurtis designed to keep you feeling cool through long office and college days."
    },
    {
        icon: Sparkles,
        title: "Direct from Jaipur",
        desc: "Authentic Rajasthani prints, mandalas, and florals crafted with traditional care and attention to detail."
    },
    {
        icon: Truck,
        title: "Free Delivery Above ₹1499",
        desc: "Fast, reliable doorstep shipping directly to your address anywhere across India."
    },
    {
        icon: MapPin,
        title: "Visit Our Offline Store",
        desc: "Feel the fabrics in person! Visit our store near Khajaguda Lake, Hyderabad (open for in-person shopping).",
        link: "https://share.google/eSxLvWitpLTqdQkn3",
        linkText: "Get Store Directions"
    }
];

const CraftsmanshipJourney = () => {
    return (
        <section className="craft-section" aria-label="Brand Pillars">
            <div className="craft-container">
                <div className="craft-header">
                    <span>The Ethnic Touch Promise</span>
                    <h2>Why You'll Love Shopping With Us</h2>
                </div>

                <div className="craft-grid">
                    {pillars.map((pillar, idx) => {
                        const Icon = pillar.icon;
                        return (
                            <div key={idx} className="craft-card">
                                <div className="craft-icon-wrap">
                                    <Icon size={26} strokeWidth={1.8} />
                                </div>
                                <h3>{pillar.title}</h3>
                                <p>{pillar.desc}</p>
                                {pillar.link && (
                                    <a 
                                        href={pillar.link} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        style={{ 
                                            display: 'inline-flex', 
                                            alignItems: 'center', 
                                            gap: '4px', 
                                            marginTop: '0.6rem', 
                                            fontSize: '0.82rem', 
                                            color: 'var(--color-primary)', 
                                            fontWeight: 600, 
                                            textDecoration: 'none' 
                                        }}
                                    >
                                        {pillar.linkText} <ExternalLink size={12} />
                                    </a>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default CraftsmanshipJourney;
