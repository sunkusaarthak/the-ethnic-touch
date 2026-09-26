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
            </div>

            {/* Mobile Full Screen Modal */}
            {isMobileModalOpen && isMobile && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#000',
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
                            background: 'rgba(255,255,255,0.2)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            fontSize: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 10,
                            cursor: 'pointer'
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
