import React from 'react';

const ProductSkeletonGrid = ({ count = 8 }) => {
    const items = Array.from({ length: count });

    return (
        <div className="product-grid">
            {items.map((_, idx) => (
                <div key={idx} className="skeleton-card">
                    <div className="skeleton-box skeleton-image" />
                    <div style={{ padding: '0.4rem 0.2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div className="skeleton-box skeleton-line" style={{ width: '80%' }} />
                        <div className="skeleton-box skeleton-line short" style={{ width: '45%' }} />
                        <div className="skeleton-box skeleton-line price" style={{ width: '35%', marginTop: '0.2rem' }} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductSkeletonGrid;
