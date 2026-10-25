import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Plus, ArrowRight } from 'lucide-react';
import ImageWithSkeleton from '../ImageWithSkeleton';
import ProductSkeletonGrid from '../ProductSkeletonGrid';
import SizeSelectionModal from '../SizeSelectionModal';

const STANDARD_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const CuratedShowcase = ({ products, wishlist, toggleWishlist, addToCart }) => {
    const [activeTab, setActiveTab] = useState('trending');
    const [selectedProductForSize, setSelectedProductForSize] = useState(null);
    const [selectedSize, setSelectedSize] = useState('');

    const filteredProducts = useMemo(() => {
        if (!products || products.length === 0) return [];

        switch (activeTab) {
            case 'bestSeller':
                return products.filter(p => p.isBestSeller).slice(0, 8);
            case 'newArrival':
                return products.filter(p => p.isNewArrival).slice(0, 8);
            case 'under500':
                return products.filter(p => Number(p.price) <= 500).slice(0, 8);
            case 'trending':
            default:
                // Show mix of best sellers and featured pieces
                return products.slice(0, 8);
        }
    }, [products, activeTab]);

    const handleOpenSizeModal = (product, e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Ensure product has a valid sizes array
        const productWithSizes = {
            ...product,
            sizes: (product.sizes && product.sizes.length > 0) ? product.sizes : STANDARD_SIZES
        };
        setSelectedProductForSize(productWithSizes);
        setSelectedSize('M'); // default recommended size
    };

    const handleConfirmAddToCart = () => {
        if (!selectedProductForSize || !selectedSize) return;
        addToCart({
            ...selectedProductForSize,
            size: selectedSize,
            quantity: 1
        });
        setSelectedProductForSize(null);
    };

    return (
        <section className="showcase-section" id="curated-showcase-section">
            <div className="showcase-header">
                <span className="showcase-subtitle">Our Collection</span>
                <h2 className="showcase-title">Everyday Jaipur Cotton Kurtis</h2>
                <p className="showcase-desc">
                    Lightweight, soft, and breathable styles for your daily wardrobe.
                </p>

                {/* Filter Tabs */}
                <div className="showcase-tabs">
                    <button
                        className={`showcase-tab-btn ${activeTab === 'trending' ? 'active' : ''}`}
                        onClick={() => setActiveTab('trending')}
                    >
                        <Sparkles size={14} /> All Kurtis
                    </button>
                    <button
                        className={`showcase-tab-btn ${activeTab === 'bestSeller' ? 'active' : ''}`}
                        onClick={() => setActiveTab('bestSeller')}
                    >
                        Best Sellers
                    </button>
                    <button
                        className={`showcase-tab-btn ${activeTab === 'newArrival' ? 'active' : ''}`}
                        onClick={() => setActiveTab('newArrival')}
                    >
                        New Arrivals
                    </button>
                    <button
                        className={`showcase-tab-btn ${activeTab === 'under500' ? 'active' : ''}`}
                        onClick={() => setActiveTab('under500')}
                    >
                        Under ₹500
                    </button>
                </div>
            </div>

            {/* Product Grid */}
            {!products || products.length === 0 ? (
                <ProductSkeletonGrid count={4} />
            ) : filteredProducts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 0', color: '#8C8781' }}>
                    <p>No products found in this collection. Weaving new pieces soon!</p>
                </div>
            ) : (
                <div className="product-grid">
                    {filteredProducts.map((product) => {
                        const isWished = wishlist && wishlist.some(item => item.id === product.id);
                        const slug = product.name ? product.name.toLowerCase().replace(/[\s\/]+/g, '-') : '';

                        return (
                            <div key={product.id} className="advanced-product-card">
                                <Link 
                                    to={`/product/${product.id}/${slug}`} 
                                    style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', flex: 1 }}
                                >
                                    <div className="advanced-product-media">
                                        <ImageWithSkeleton
                                            src={product.imageUrl}
                                            alt={product.name}
                                            loading="lazy"
                                            fetchPriority="auto"
                                        />

                                        {/* Micro Badges */}
                                        <div className="product-card-badges">
                                            {product.isNewArrival && (
                                                <span className="micro-badge badge-new">New Loom</span>
                                            )}
                                            {product.isBestSeller && (
                                                <span className="micro-badge badge-bestseller">Best Seller</span>
                                            )}
                                        </div>

                                        {/* Quick Add Overlay on Hover */}
                                        <div className="quick-add-overlay">
                                            <button 
                                                className="btn-quick-add"
                                                onClick={(e) => handleOpenSizeModal(product, e)}
                                                aria-label={`Quick add ${product.name} to wardrobe`}
                                            >
                                                <Plus size={15} /> Quick Add to Bag
                                            </button>
                                        </div>
                                    </div>

                                    <div className="advanced-product-info">
                                        <span className="advanced-product-category">{product.category || 'Silhouettes'}</span>
                                        <h3 className="advanced-product-title">{product.name}</h3>
                                        
                                        <div className="advanced-product-price-row">
                                            <span className="current-price">₹{Number(product.price).toLocaleString('en-IN')}</span>
                                            {Boolean(product.originalPrice && Number(product.originalPrice) > Number(product.price)) && (
                                                <>
                                                    <span className="original-price">₹{Number(product.originalPrice).toLocaleString('en-IN')}</span>
                                                    <span className="discount-tag">
                                                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </Link>

                                {/* Wishlist Heart */}
                                <button
                                    className={`advanced-wishlist-btn ${isWished ? 'active' : ''}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        toggleWishlist(product);
                                    }}
                                    aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
                                >
                                    <Heart 
                                        size={17} 
                                        fill={isWished ? "#C46D5E" : "none"} 
                                        stroke={isWished ? "#C46D5E" : "currentColor"} 
                                    />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Bottom View All Link */}
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                <Link to="/shop" className="btn-hero-secondary" style={{ display: 'inline-flex' }}>
                    View Complete Wardrobe ({products ? products.length : 0} Styles)
                    <ArrowRight size={16} />
                </Link>
            </div>

            {/* Instant Size Selection Modal */}
            {selectedProductForSize && (
                <SizeSelectionModal
                    isOpen={Boolean(selectedProductForSize)}
                    onClose={() => setSelectedProductForSize(null)}
                    product={selectedProductForSize}
                    selectedSize={selectedSize}
                    onSelectSize={setSelectedSize}
                    onAddToCart={handleConfirmAddToCart}
                />
            )}
        </section>
    );
};

export default CuratedShowcase;
