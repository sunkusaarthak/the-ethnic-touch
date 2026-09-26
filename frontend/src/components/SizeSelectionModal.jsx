import React from 'react';
import ImageWithSkeleton from './ImageWithSkeleton';

const SizeSelectionModal = ({ isOpen, onClose, product, selectedSize, onSelectSize, onAddToCart }) => {
    if (!isOpen || !product) return null;

    return (
        <div 
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(45, 42, 38, 0.65)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 999999,
                padding: '1.5rem'
            }} 
            onClick={onClose}
        >
            <div 
                style={{
                    background: '#FFFFFF',
                    borderRadius: '24px',
                    maxWidth: '460px',
                    width: '100%',
                    padding: '2rem',
                    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.22)',
                    position: 'relative',
                    animation: 'modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxSizing: 'border-box'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: '#f5f5f5',
                        border: 'none',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#666',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#ebebeb'; e.currentTarget.style.color = '#333'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#f5f5f5'; e.currentTarget.style.color = '#666'; }}
                >
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
                
                <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--color-primary)', fontSize: '1.3rem', fontFamily: 'var(--font-heading)' }}>Select Size</h3>
                
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
                    <div style={{ width: '80px', height: '100px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                        <ImageWithSkeleton src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                        <div style={{ fontWeight: '600', fontSize: '1rem', marginBottom: '0.25rem', color: '#333' }}>{product.name}</div>
                        <div style={{ color: 'var(--color-primary)', fontWeight: '600', fontSize: '1.1rem' }}>₹{product.price.toLocaleString('en-IN')}</div>
                    </div>
                </div>
                
                <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {product.sizes && product.sizes.map(size => {
                            const qty = (product.sizesStock && product.sizesStock[size] !== undefined) ? product.sizesStock[size] : -1;
                            const outOfStock = qty === 0;
                            const isSelected = selectedSize === size;
                            return (
                                <button
                                    key={size}
                                    disabled={outOfStock}
                                    onClick={() => onSelectSize(size)}
                                    style={{
                                        padding: '0.6rem 1.2rem',
                                        borderRadius: '8px',
                                        border: `1px solid ${isSelected ? 'var(--color-primary)' : '#ddd'}`,
                                        background: isSelected ? 'var(--color-primary)' : (outOfStock ? '#f9f9f9' : '#fff'),
                                        color: isSelected ? '#fff' : (outOfStock ? '#aaa' : '#333'),
                                        fontWeight: '500',
                                        cursor: outOfStock ? 'not-allowed' : 'pointer',
                                        textDecoration: outOfStock ? 'line-through' : 'none',
                                        transition: 'all 0.2s',
                                        flex: '1 1 auto',
                                        minWidth: '60px'
                                    }}
                                >
                                    {size}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button 
                        onClick={onClose}
                        style={{
                            flex: 1,
                            padding: '0.8rem',
                            borderRadius: '8px',
                            background: '#f5f5f5',
                            border: 'none',
                            fontWeight: '600',
                            color: '#555',
                            cursor: 'pointer'
                        }}
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onAddToCart}
                        disabled={!selectedSize}
                        style={{
                            flex: 1,
                            padding: '0.8rem',
                            borderRadius: '8px',
                            background: selectedSize ? 'var(--color-primary)' : '#ccc',
                            border: 'none',
                            fontWeight: '600',
                            color: '#fff',
                            cursor: selectedSize ? 'pointer' : 'not-allowed'
                        }}
                    >
                        Add to Cart
                    </button>
                </div>
                
            </div>
            <style>
                {`
                @keyframes modalSlideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                `}
            </style>
        </div>
    );
};

export default SizeSelectionModal;
