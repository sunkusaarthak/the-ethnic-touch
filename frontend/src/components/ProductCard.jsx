import React from 'react';
import { Link } from 'react-router-dom';
import ImageWithSkeleton from './ImageWithSkeleton';

const RenderProductCard = ({ product, wishlist, toggleWishlist }) => {
    const isWished = wishlist.some(item => item.id === product.id);

    return (
        <div style={{ position: 'relative' }}>
            <Link to={`/product/${product.id}`} className="product-card" style={{ display: 'block' }}>
                <div className="product-image-container">
                    <ImageWithSkeleton src={product.imageUrl} alt={product.name} className="product-image" />
                </div>
                <div className="product-info">
                    <div style={{ flex: 1, minWidth: 0, paddingRight: '8px' }}>
                        <h3 className="product-name" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</h3>
                        <p className="product-desc" style={{ marginTop: '0.2rem' }}>{product.description}</p>
                        
                        <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                            {product.isNewArrival && (
                                <span style={{ fontSize: '0.65rem', background: '#faeedd', color: '#9c6c40', padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>New</span>
                            )}
                            {product.isBestSeller && (
                                <span style={{ fontSize: '0.65rem', background: '#e8f5e9', color: '#2e7d32', padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>Best Seller</span>
                            )}
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0 }}>
                        <div className="product-price">₹{product.price.toLocaleString('en-IN')}</div>
                        {product.originalPrice > product.price && (
                            <div style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.8rem', marginTop: '2px' }}>
                                ₹{product.originalPrice.toLocaleString('en-IN')}
                            </div>
                        )}
                    </div>
                </div>
            </Link>

            <button 
                className={`wishlist-heart-btn ${isWished ? 'active' : ''}`}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWishlist(product);
                }}
                aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
            >
                <svg viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
            </button>
        </div>
    );
};

export default RenderProductCard;
