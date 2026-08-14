import React, { useState } from 'react';

/**
 * ImageWithSkeleton - Progressive Image Component
 * Shows a subtle luxury shimmer placeholder while the image loads from CDN/Cloud.
 * Prevents layout shifts and blank spaces.
 */
const ImageWithSkeleton = ({ src, alt, className = '', style = {}, onClick, ...props }) => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    return (
        <div 
            style={{ 
                position: 'relative', 
                overflow: 'hidden', 
                display: 'inline-block',
                width: '100%',
                height: '100%',
                ...style 
            }}
            className={className}
            onClick={onClick}
        >
            {/* Shimmer Placeholder (visible while loading) */}
            {!loaded && !error && (
                <div 
                    className="skeleton-box" 
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        width: '100%',
                        height: '100%',
                        borderRadius: style.borderRadius || 'inherit',
                        zIndex: 1
                    }}
                />
            )}

            {/* Actual Image */}
            <img
                src={src}
                alt={alt || ''}
                onLoad={() => setLoaded(true)}
                onError={() => {
                    setError(true);
                    setLoaded(true);
                }}
                style={{
                    width: style.width || '100%',
                    height: style.height || '100%',
                    objectFit: style.objectFit || 'cover',
                    borderRadius: style.borderRadius || 'inherit',
                    opacity: loaded ? 1 : 0,
                    transition: 'opacity 0.4s ease-in-out',
                    display: 'block'
                }}
                {...props}
            />
        </div>
    );
};

export default ImageWithSkeleton;
