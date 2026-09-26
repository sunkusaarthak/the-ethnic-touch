import React, { useState, useEffect } from 'react';
import ImageWithSkeleton from './ImageWithSkeleton';

const ZoomableImage = ({ src, alt, className, style }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [position, setPosition] = useState({ x: '50%', y: '50%' });
    const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
    
    // Check if mobile device
    const [isMobile, setIsMobile] = useState(false);
    
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile(); // Check immediately
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleMouseMove = (e) => {
        if (isMobile) return;
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.pageX - left - window.scrollX) / width) * 100;
        const y = ((e.pageY - top - window.scrollY) / height) * 100;
        setPosition({ x: `${x}%`, y: `${y}%` });
    };

    const handleMouseEnter = () => {
        if (!isMobile) setIsHovered(true);
    };

    const handleMouseLeave = () => {
        if (!isMobile) setIsHovered(false);
    };

    const handleClick = () => {
        if (isMobile) {
            setIsMobileModalOpen(true);
        }
    };

    return (
        <>
            <div 
                className={className}
                style={{ ...style, position: 'relative', overflow: 'hidden', cursor: isMobile ? 'zoom-in' : 'crosshair' }}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
            >
                {/* Base Image */}
                <ImageWithSkeleton 
                    src={src} 
                    alt={alt} 
                    style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'contain',
                        opacity: isHovered ? 0 : 1,
                        transition: 'opacity 0.2s'
                    }} 
                />
                
                {/* Zoomed Image Overlay (Desktop) */}
                {isHovered && !isMobile && (
                    <div 
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundImage: `url(${src})`,
                            backgroundPosition: `${position.x} ${position.y}`,
                            backgroundSize: '250%', // 2.5x zoom
                            backgroundRepeat: 'no-repeat',
                            pointerEvents: 'none'
                        }}
                    />
                )}
                {/* Zoom indicator icon (Mobile UX) */}
                {isMobile && !isMobileModalOpen && (
                    <div style={{
                        position: 'absolute',
                        bottom: '15px',
                        right: '15px',
                        width: '36px',
                        height: '36px',
                        backgroundColor: '#fff',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        pointerEvents: 'none',
                        zIndex: 2
                    }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            <line x1="11" y1="8" x2="11" y2="14"></line>
                            <line x1="8" y1="11" x2="14" y2="11"></line>
                        </svg>
                    </div>
                )}
            </div>

            {/* Mobile Full Screen Modal */}
            {isMobileModalOpen && isMobile && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#fff', // White background to match reference image cleanly
                    zIndex: 9999999,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    touchAction: 'none' // Prevent pull-to-refresh while viewing
                }}>
                    <button 
                        onClick={() => setIsMobileModalOpen(false)}
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            background: '#000', // Solid black background for visibility
                            color: '#fff',
                            border: 'none',
                            borderRadius: '50%',
                            width: '44px',
                            height: '44px',
                            fontSize: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 10,
                            cursor: 'pointer',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
                        }}
                    >
                        &times;
                    </button>
                    
                    {/* Scrollable image container for zooming */}
                    <div style={{ 
                        width: '100%', 
                        height: '100%', 
                        overflow: 'auto', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center' 
                    }}>
                        <img 
                            src={src} 
                            alt={alt} 
                            style={{ 
                                maxWidth: 'none',
                                maxHeight: 'none',
                                width: '200%', // Make it wider than screen to force scroll/zoom feel
                                objectFit: 'contain'
                            }} 
                        />
                    </div>
                    <div style={{ position: 'absolute', bottom: '30px', color: '#fff', fontSize: '0.8rem', opacity: 0.7, background: 'rgba(0,0,0,0.5)', padding: '5px 15px', borderRadius: '20px' }}>
                        Drag to explore
                    </div>
                </div>
            )}
        </>
    );
};

export default ZoomableImage;
