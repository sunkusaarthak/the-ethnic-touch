import React from 'react';
import ImageWithSkeleton from './ImageWithSkeleton';

const SizeSelectionModal = ({ isOpen, onClose, product, selectedSize, onSelectSize, onAddToCart }) => {
    if (!isOpen || !product) return null;

    return (
        <div 
            className="size-modal-backdrop"
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
                className="size-modal-sheet"
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
                {/* Mobile Bottom Sheet Grab Indicator */}
                <div className="size-modal-drag-handle" style={{ display: 'none' }}></div>

                <button 
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: '#f5f5f5',
                        border: 'none',
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#666',
                        transition: 'all 0.2s',
                        zIndex: 2
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#ebebeb'; e.currentTarget.style.color = '#333'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#f5f5f5'; e.currentTarget.style.color = '#666'; }}
                    aria-label="Close modal"
                >
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
                
                <h3 style={{ margin: '0 0 1.25rem 0', color: 'var(--color-primary)', fontSize: '1.25rem', fontFamily: 'var(--font-heading)' }}>Select Silhouette Size</h3>
                
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', alignItems: 'center' }}>
                    <div style={{ width: '75px', height: '95px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, background: '#FAF8F5' }}>
                        <ImageWithSkeleton src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                        <div style={{ fontWeight: '600', fontSize: '0.96rem', marginBottom: '0.25rem', color: '#333' }}>{product.name}</div>
                        <div style={{ color: 'var(--color-primary)', fontWeight: '700', fontSize: '1.15rem' }}>₹{Number(product.price).toLocaleString('en-IN')}</div>
                        <div style={{ fontSize: '0.74rem', color: '#5B8E7D', fontWeight: '600', marginTop: '2px' }}>
                            ✓ Includes 2" Seam Alteration Margins
                        </div>
                    </div>
                </div>
                
                <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem' }}>
                        <span>Available Sizes (Standard Fit):</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
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
                                        padding: '0.65rem 1rem',
                                        borderRadius: '10px',
                                        border: `1.5px solid ${isSelected ? 'var(--color-primary)' : '#E8E5E1'}`,
                                        background: isSelected ? 'var(--color-primary)' : (outOfStock ? '#f9f9f9' : '#fff'),
                                        color: isSelected ? '#fff' : (outOfStock ? '#aaa' : '#333'),
                                        fontWeight: '600',
                                        fontSize: '0.86rem',
                                        cursor: outOfStock ? 'not-allowed' : 'pointer',
                                        textDecoration: outOfStock ? 'line-through' : 'none',
                                        transition: 'all 0.2s',
                                        flex: '1 1 auto',
                                        minWidth: '50px',
                                        boxShadow: isSelected ? '0 4px 12px rgba(212, 163, 115, 0.3)' : 'none'
                                    }}
                                >
                                    {size}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button 
                        onClick={onClose}
                        style={{
                            flex: 0.8,
                            padding: '0.85rem',
                            borderRadius: '10px',
                            background: '#FAF8F5',
                            border: '1px solid rgba(212, 163, 115, 0.3)',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            color: '#6C6863',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onAddToCart}
                        disabled={!selectedSize}
                        style={{
                            flex: 1.4,
                            padding: '0.85rem',
                            borderRadius: '10px',
                            background: selectedSize 
                                ? 'linear-gradient(135deg, #D4A373 0%, #C49363 100%)' 
                                : '#E5E7EB',
                            border: 'none',
                            fontWeight: '700',
                            fontSize: '0.92rem',
                            color: '#fff',
                            cursor: selectedSize ? 'pointer' : 'not-allowed',
                            boxShadow: selectedSize ? '0 8px 22px rgba(212, 163, 115, 0.38)' : 'none',
                            transition: 'all 0.25s'
                        }}
                    >
                        Add to Wardrobe
                    </button>
                </div>
                
            </div>
            <style>
                {`
                @keyframes modalSlideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @media (max-width: 600px) {
                    .size-modal-backdrop {
                        align-items: flex-end !important;
                        padding: 0 !important;
                    }
                    .size-modal-sheet {
                        border-radius: 26px 26px 0 0 !important;
                        max-width: 100% !important;
                        padding: 1.25rem 1.25rem 2.2rem 1.25rem !important;
                        animation: sheetSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
                    }
                    .size-modal-drag-handle {
                        display: block !important;
                        width: 38px;
                        height: 4px;
                        border-radius: 4px;
                        background: #DDD8D3;
                        margin: -4px auto 1rem auto;
                    }
                    @keyframes sheetSlideUp {
                        from { transform: translateY(100%); }
                        to { transform: translateY(0); }
                    }
                }
                `}
            </style>
        </div>
    );
};

export default SizeSelectionModal;
