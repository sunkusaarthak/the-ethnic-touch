import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate, Link, useLocation, useParams, Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import CustomSelect from '../components/CustomSelect';
import FilterSidebarContent from '../components/FilterSidebarContent';
import RenderProductCard from '../components/ProductCard';
import ProductSkeletonGrid from '../components/ProductSkeletonGrid';
import { API_BASE_URL } from '../data/config';

const Shop = ({ productsGlobal, wishlist, toggleWishlist, globalSearch, setGlobalSearch }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);
    const loader = useRef(null);
    const [sort, setSort] = useState('newest');

    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [selectedFabrics, setSelectedFabrics] = useState([]);
    const [selectedPatterns, setSelectedPatterns] = useState([]);
    const [selectedSleeves, setSelectedSleeves] = useState([]);
    const [selectedOccasions, setSelectedOccasions] = useState([]);
    const [selectedCollections, setSelectedCollections] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [onlyNewArrivals, setOnlyNewArrivals] = useState(false);
    const [onlyBestSellers, setOnlyBestSellers] = useState(false);
    const [priceRange, setPriceRange] = useState('all');

    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const isFirstRender = useRef(true);

    // Map HashRouter query parameters directly to active filter states on load/route updates
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        
        const category = params.get('category');
        setSelectedCategories(category ? category.split(',') : []);
        
        const size = params.get('sizes');
        setSelectedSizes(size ? size.split(',') : []);
        
        const fabric = params.get('fabrics') || params.get('fabric');
        setSelectedFabrics(fabric ? fabric.split(',') : []);
        
        const pattern = params.get('patterns') || params.get('pattern');
        setSelectedPatterns(pattern ? pattern.split(',') : []);
        
        const sleeve = params.get('sleeveTypes') || params.get('sleeve_type');
        setSelectedSleeves(sleeve ? sleeve.split(',') : []);
        
        const occasion = params.get('occasions') || params.get('occasion');
        setSelectedOccasions(occasion ? occasion.split(',') : []);
        
        const collection = params.get('collection');
        setSelectedCollections(collection ? collection.split(',') : []);
        
        const colors = params.get('colors');
        setSelectedColors(colors ? colors.split(',') : []);
        
        setOnlyNewArrivals(params.get('newArrival') === 'true');
        setOnlyBestSellers(params.get('bestSeller') === 'true');
        
        const pRange = params.get('priceRange') || params.get('price_range');
        if (pRange) {
            setPriceRange(pRange);
        } else {
            const minP = params.get('minPrice') || params.get('min_price');
            const maxP = params.get('maxPrice') || params.get('max_price');
            if (maxP === '1999') setPriceRange('under_2k');
            else if (minP === '2000' && maxP === '4999') setPriceRange('2k_5k');
            else if (minP === '5000' && maxP === '9999') setPriceRange('5k_10k');
            else if (minP === '10000') setPriceRange('over_10k');
            else setPriceRange('all');
        }
        
        setCurrentPage(1);
    }, [location.search]);

    // Push local filter state changes to URL to support copy-paste deep links
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const params = new URLSearchParams();
        if (selectedCategories.length > 0) params.set('category', selectedCategories.join(','));
        if (selectedSizes.length > 0) params.set('sizes', selectedSizes.join(','));
        if (selectedFabrics.length > 0) params.set('fabrics', selectedFabrics.join(','));
        if (selectedPatterns.length > 0) params.set('patterns', selectedPatterns.join(','));
        if (selectedSleeves.length > 0) params.set('sleeveTypes', selectedSleeves.join(','));
        if (selectedOccasions.length > 0) params.set('occasions', selectedOccasions.join(','));
        if (selectedCollections.length > 0) params.set('collection', selectedCollections.join(','));
        if (selectedColors.length > 0) params.set('colors', selectedColors.join(','));
        if (onlyNewArrivals) params.set('newArrival', 'true');
        if (onlyBestSellers) params.set('bestSeller', 'true');
        if (priceRange && priceRange !== 'all') params.set('priceRange', priceRange);

        if (globalSearch.trim()) {
            params.set('q', globalSearch.trim());
        }

        const newSearch = params.toString();
        const currentSearch = location.search.replace(/^\?/, '');
        
        if (newSearch !== currentSearch) {
            navigate('/shop?' + newSearch, { replace: true });
        }
    }, [
        selectedCategories,
        selectedSizes,
        selectedFabrics,
        selectedPatterns,
        selectedSleeves,
        selectedOccasions,
        selectedCollections,
        selectedColors,
        onlyNewArrivals,
        onlyBestSellers,
        priceRange,
        globalSearch
    ]);

    useEffect(() => {
        let active = true;
        
        const fetchFilteredProducts = async () => {
            if (currentPage === 1) setLoading(true);
            else setLoadingMore(true);
            const params = new URLSearchParams();
            params.append('paginated', 'true');
            params.append('page', currentPage.toString());
            params.append('limit', '8');
            
            // Map React sort state to Go backend sortBy keys
            let sortByVal = sort;
            if (sort === 'rating_desc') sortByVal = 'rating';
            params.append('sortBy', sortByVal);

            if (globalSearch.trim()) {
                params.append('q', globalSearch.trim());
            }

            if (selectedCategories.length > 0) {
                params.append('category', selectedCategories.join(','));
            }
            if (selectedSizes.length > 0) {
                params.append('sizes', selectedSizes.join(','));
            }
            if (selectedFabrics.length > 0) {
                params.append('fabrics', selectedFabrics.join(','));
            }
            if (selectedPatterns.length > 0) {
                params.append('patterns', selectedPatterns.join(','));
            }
            if (selectedSleeves.length > 0) {
                params.append('sleeveTypes', selectedSleeves.join(','));
            }
            if (selectedOccasions.length > 0) {
                params.append('occasions', selectedOccasions.join(','));
            }
            if (selectedCollections.length > 0) {
                params.append('collection', selectedCollections.join(','));
            }
            if (selectedColors.length > 0) {
                params.append('colors', selectedColors.join(','));
            }
            
            if (onlyNewArrivals) params.append('newArrival', 'true');
            if (onlyBestSellers) params.append('bestSeller', 'true');

            if (priceRange === 'under_2k') {
                params.append('maxPrice', '1999');
            } else if (priceRange === '2k_5k') {
                params.append('minPrice', '2000');
                params.append('maxPrice', '4999');
            } else if (priceRange === '5k_10k') {
                params.append('minPrice', '5000');
                params.append('maxPrice', '9999');
            } else if (priceRange === 'over_10k') {
                params.append('minPrice', '10000');
            }

            try {
                const res = await fetch(`${API_BASE_URL}/api/products?${params.toString()}`);
                if (!res.ok) throw new Error("HTTP " + res.status);
                const data = await res.json();
                
                if (active) {
                    if (data && Array.isArray(data.products)) {
                        setProducts(prev => currentPage === 1 ? data.products : [...prev, ...data.products]);
                        setTotalProducts(data.total);
                        setTotalPages(data.totalPages);
                    } else if (Array.isArray(data)) {
                        setProducts(prev => currentPage === 1 ? data : [...prev, ...data]);
                        setTotalProducts(data.length);
                        setTotalPages(1);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch filtered products, falling back to local filtration:", err);
                if (active && Array.isArray(productsGlobal)) {
                    let list = [...productsGlobal];

                    if (globalSearch.trim()) {
                        const s = globalSearch.toLowerCase();
                        list = list.filter(p => 
                            p.name.toLowerCase().includes(s) || 
                            p.description.toLowerCase().includes(s) ||
                            (p.category && p.category.toLowerCase().includes(s)) ||
                            (p.tags && p.tags.toLowerCase().includes(s))
                        );
                    }

                    if (selectedCategories.length > 0) {
                        list = list.filter(p => selectedCategories.includes(p.category));
                    }
                    if (selectedSizes.length > 0) {
                        list = list.filter(p => p.sizes && p.sizes.some(sz => selectedSizes.includes(sz)));
                    }
                    if (selectedFabrics.length > 0) {
                        list = list.filter(p => p.fabric && selectedFabrics.includes(p.fabric));
                    }
                    if (selectedPatterns.length > 0) {
                        list = list.filter(p => p.pattern && selectedPatterns.includes(p.pattern));
                    }
                    if (selectedSleeves.length > 0) {
                        list = list.filter(p => p.sleeveType && selectedSleeves.includes(p.sleeveType));
                    }
                    if (selectedOccasions.length > 0) {
                        list = list.filter(p => p.occasion && selectedOccasions.includes(p.occasion));
                    }
                    if (selectedCollections.length > 0) {
                        list = list.filter(p => p.collection && selectedCollections.includes(p.collection));
                    }
                    if (selectedColors.length > 0) {
                        list = list.filter(p => p.color && selectedColors.includes(p.color));
                    }
                    if (onlyNewArrivals) {
                        list = list.filter(p => p.isNewArrival);
                    }
                    if (onlyBestSellers) {
                        list = list.filter(p => p.isBestSeller);
                    }

                    if (priceRange === 'under_2k') {
                        list = list.filter(p => p.price <= 1999);
                    } else if (priceRange === '2k_5k') {
                        list = list.filter(p => p.price >= 2000 && p.price <= 4999);
                    } else if (priceRange === '5k_10k') {
                        list = list.filter(p => p.price >= 5000 && p.price <= 9999);
                    } else if (priceRange === 'over_10k') {
                        list = list.filter(p => p.price >= 10000);
                    }

                    if (sort === 'price_asc') {
                        list.sort((a,b) => a.price - b.price);
                    } else if (sort === 'price_desc') {
                        list.sort((a,b) => b.price - a.price);
                    } else if (sort === 'rating_desc') {
                        list.sort((a,b) => (b.avgRating || 0) - (a.avgRating || 0));
                    } else {
                        list.sort((a,b) => b.id.localeCompare(a.id));
                    }

                    const limit = 8;
                    const total = list.length;
                    const pages = Math.ceil(total / limit) || 1;
                    const offset = (currentPage - 1) * limit;
                    
                    const newProds = list.slice(offset, offset + limit);
                    setProducts(prev => currentPage === 1 ? newProds : [...prev, ...newProds]);
                    setTotalProducts(total);
                    setTotalPages(pages);
                }
            } finally {
                if (active) {
                    setLoading(false);
                    setLoadingMore(false);
                }
            }
        };

        fetchFilteredProducts();
        return () => { active = false; };
    }, [currentPage, sort, selectedCategories, selectedSizes, selectedFabrics, selectedPatterns, selectedSleeves, selectedOccasions, selectedCollections, selectedColors, onlyNewArrivals, onlyBestSellers, priceRange, globalSearch, productsGlobal]);

    useEffect(() => {
        setCurrentPage(1);
    }, [sort, selectedCategories, selectedSizes, selectedFabrics, selectedPatterns, selectedSleeves, selectedOccasions, selectedCollections, selectedColors, onlyNewArrivals, onlyBestSellers, priceRange, globalSearch]);

    const activeChips = [];
    selectedCategories.forEach(c => activeChips.push({ label: `Category: ${c}`, type: 'category', value: c }));
    selectedSizes.forEach(s => activeChips.push({ label: `Size: ${s}`, type: 'size', value: s }));
    selectedFabrics.forEach(f => activeChips.push({ label: `Fabric: ${f}`, type: 'fabric', value: f }));
    selectedPatterns.forEach(p => activeChips.push({ label: `Pattern: ${p}`, type: 'pattern', value: p }));
    selectedSleeves.forEach(sl => activeChips.push({ label: `Sleeve: ${sl}`, type: 'sleeve', value: sl }));
    selectedOccasions.forEach(o => activeChips.push({ label: `Occasion: ${o}`, type: 'occasion', value: o }));
    selectedCollections.forEach(col => activeChips.push({ label: `Collection: ${col}`, type: 'collection', value: col }));
    selectedColors.forEach(color => activeChips.push({ label: `Color: ${color}`, type: 'colors', value: color }));
    if (onlyNewArrivals) activeChips.push({ label: 'New Arrivals Only', type: 'newArrival', value: true });
    if (onlyBestSellers) activeChips.push({ label: 'Best Sellers Only', type: 'bestSeller', value: true });

    if (priceRange !== 'all') {
        let label = 'Price: All';
        if (priceRange === 'under_2k') label = 'Price: Under ₹2,000';
        else if (priceRange === '2k_5k') label = 'Price: ₹2,000 - ₹4,999';
        else if (priceRange === '5k_10k') label = 'Price: ₹5,000 - ₹9,999';
        else if (priceRange === 'over_10k') label = 'Price: ₹10,000+';
        activeChips.push({ label, type: 'priceRange', value: priceRange });
    }
    if (globalSearch.trim()) {
        activeChips.push({ label: `Search: "${globalSearch}"`, type: 'search', value: globalSearch });
    }

    const removeChip = (chip) => {
        if (chip.type === 'category') setSelectedCategories(prev => prev.filter(v => v !== chip.value));
        else if (chip.type === 'size') setSelectedSizes(prev => prev.filter(v => v !== chip.value));
        else if (chip.type === 'fabric') setSelectedFabrics(prev => prev.filter(v => v !== chip.value));
        else if (chip.type === 'pattern') setSelectedPatterns(prev => prev.filter(v => v !== chip.value));
        else if (chip.type === 'sleeve') setSelectedSleeves(prev => prev.filter(v => v !== chip.value));
        else if (chip.type === 'occasion') setSelectedOccasions(prev => prev.filter(v => v !== chip.value));
        else if (chip.type === 'collection') setSelectedCollections(prev => prev.filter(v => v !== chip.value));
        else if (chip.type === 'colors') setSelectedColors(prev => prev.filter(v => v !== chip.value));
        else if (chip.type === 'newArrival') setOnlyNewArrivals(false);
        else if (chip.type === 'bestSeller') setOnlyBestSellers(false);
        else if (chip.type === 'priceRange') setPriceRange('all');
        else if (chip.type === 'search') setGlobalSearch('');
    };

    const clearAllFilters = () => {
        setSelectedCategories([]);
        setSelectedSizes([]);
        setSelectedFabrics([]);
        setSelectedPatterns([]);
        setSelectedSleeves([]);
        setSelectedOccasions([]);
        setSelectedCollections([]);
        setSelectedColors([]);
        setOnlyNewArrivals(false);
        setOnlyBestSellers(false);
        setPriceRange('all');
        setGlobalSearch('');
    };

    const handleObserver = useCallback((entries) => {
        const target = entries[0];
        if (target.isIntersecting && !loading && !loadingMore && currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    }, [loading, loadingMore, currentPage, totalPages]);

    useEffect(() => {
        const option = {
            root: null,
            rootMargin: "200px",
            threshold: 0
        };
        const observer = new IntersectionObserver(handleObserver, option);
        if (loader.current) observer.observe(loader.current);
        return () => observer.disconnect();
    }, [handleObserver]);

    return (
        <div>
            <span id="shop-top-anchor" style={{ display: 'block', height: '1px' }}></span>

            <div className="catalog-page-container">
                {/* Desktop Sidebar */}
                <aside className="catalog-sidebar">
                    <div style={{ position: 'sticky', top: '100px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #f0efee', paddingBottom: '0.5rem' }}>
                            <h3 style={{ textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: '700', letterSpacing: '1px' }}>Filters</h3>
                            {activeChips.length > 0 && (
                                <button onClick={clearAllFilters} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}>Clear All</button>
                            )}
                        </div>
                        <FilterSidebarContent 
                            selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories}
                            selectedSizes={selectedSizes} setSelectedSizes={setSelectedSizes}
                            selectedFabrics={selectedFabrics} setSelectedFabrics={setSelectedFabrics}
                            selectedPatterns={selectedPatterns} setSelectedPatterns={setSelectedPatterns}
                            selectedSleeves={selectedSleeves} setSelectedSleeves={setSelectedSleeves}
                            selectedOccasions={selectedOccasions} setSelectedOccasions={setSelectedOccasions}
                            selectedCollections={selectedCollections} setSelectedCollections={setSelectedCollections}
                            selectedColors={selectedColors} setSelectedColors={setSelectedColors}
                            onlyNewArrivals={onlyNewArrivals} setOnlyNewArrivals={setOnlyNewArrivals}
                            onlyBestSellers={onlyBestSellers} setOnlyBestSellers={setOnlyBestSellers}
                            priceRange={priceRange} setPriceRange={setPriceRange}
                        />
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="catalog-main-content">
                    <div className="catalog-toolbar">
                        <div className="toolbar-info">
                            Showing <strong>{products.length}</strong> of <strong>{totalProducts}</strong> products
                        </div>
                        <div className="toolbar-actions">
                            <button 
                                className="mobile-filter-trigger" 
                                onClick={() => setMobileFilterOpen(true)}
                            >
                                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
                                <span>Filters</span>
                            </button>

                            <CustomSelect 
                                value={sort}
                                options={[
                                    { value: 'newest', label: 'New Arrivals' },
                                    { value: 'price_asc', label: 'Price: Low to High' },
                                    { value: 'price_desc', label: 'Price: High to Low' },
                                    { value: 'rating_desc', label: 'Top Rated' }
                                ]}
                                onChange={setSort}
                            />
                        </div>
                    </div>

                    {/* Active Chips Bar */}
                    {activeChips.length > 0 && (
                        <div className="active-chips-container">
                            {activeChips.map((chip, idx) => (
                                <span className="active-chip" key={idx}>
                                    {chip.label}
                                    <button className="active-chip-remove" onClick={() => removeChip(chip)}>&times;</button>
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Product Grid */}
                    {loading ? (
                        <ProductSkeletonGrid count={8} />
                    ) : products.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '5rem 0', background: '#fff', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.02)' }}>
                            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: '400', marginBottom: '0.5rem' }}>No products found</h3>
                            <p style={{ color: '#8c8883', fontSize: '0.95rem' }}>Try clearing some filters or searching for something else.</p>
                        </div>
                    ) : (
                        <div>
                            <div className="product-grid">
                                {products.map(product => (
                                    <RenderProductCard 
                                        key={product.id} 
                                        product={product} 
                                        wishlist={wishlist} 
                                        toggleWishlist={toggleWishlist} 
                                    />
                                ))}
                            </div>

                            {/* Infinite Scroll Sentinel */}
                            {loadingMore && (
                                <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                                    <ProductSkeletonGrid count={4} />
                                </div>
                            )}
                            <div ref={loader} style={{ height: '20px' }}></div>
                        </div>
                    )}
                </main>
            </div>

            {/* Mobile Filter Drawer (Portaled to document.body) */}
            {mobileFilterOpen && ReactDOM.createPortal(
                <div className={`mobile-filter-drawer ${mobileFilterOpen ? 'show' : ''}`}>
                    <div className="mobile-filter-drawer-overlay" onClick={() => setMobileFilterOpen(false)} />
                    <div className="mobile-filter-drawer-content">
                        <div className="mobile-filter-drawer-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
                                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: '500', color: 'var(--color-text, #2D2A26)', letterSpacing: '0.5px' }}>Filters</span>
                                {activeChips.length > 0 && (
                                    <span style={{ backgroundColor: 'var(--color-peach)', color: 'var(--color-primary)', fontSize: '0.72rem', fontWeight: '700', borderRadius: '12px', padding: '2px 8px', marginLeft: '4px' }}>
                                        {activeChips.length} active
                                    </span>
                                )}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                {activeChips.length > 0 && (
                                    <button 
                                        onClick={clearAllFilters} 
                                        style={{ background: 'none', border: 'none', color: '#888', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                                    >
                                        Reset
                                    </button>
                                )}
                                <button 
                                    className="mobile-drawer-close"
                                    onClick={() => setMobileFilterOpen(false)}
                                    aria-label="Close filters"
                                >
                                    &times;
                                </button>
                            </div>
                        </div>
                        
                        <div className="mobile-filter-drawer-body">
                            <FilterSidebarContent 
                                selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories}
                                selectedSizes={selectedSizes} setSelectedSizes={setSelectedSizes}
                                selectedFabrics={selectedFabrics} setSelectedFabrics={setSelectedFabrics}
                                selectedPatterns={selectedPatterns} setSelectedPatterns={setSelectedPatterns}
                                selectedSleeves={selectedSleeves} setSelectedSleeves={setSelectedSleeves}
                                selectedOccasions={selectedOccasions} setSelectedOccasions={setSelectedOccasions}
                                selectedCollections={selectedCollections} setSelectedCollections={setSelectedCollections}
                                selectedColors={selectedColors} setSelectedColors={setSelectedColors}
                                onlyNewArrivals={onlyNewArrivals} setOnlyNewArrivals={setOnlyNewArrivals}
                                onlyBestSellers={onlyBestSellers} setOnlyBestSellers={setOnlyBestSellers}
                                priceRange={priceRange} setPriceRange={setPriceRange}
                            />
                        </div>

                        <div className="mobile-filter-drawer-footer">
                            {activeChips.length > 0 && (
                                <button 
                                    className="btn btn-outline" 
                                    onClick={clearAllFilters}
                                    style={{ padding: '0.85rem 1rem', borderRadius: '10px', fontSize: '0.88rem', fontWeight: '600' }}
                                >
                                    Reset
                                </button>
                            )}
                            <button 
                                className="btn btn-primary" 
                                onClick={() => setMobileFilterOpen(false)}
                                style={{ flex: 1, padding: '0.85rem 1rem', borderRadius: '10px', fontSize: '0.92rem', fontWeight: '600', letterSpacing: '0.5px' }}
                            >
                                Apply Filters ({totalProducts})
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};


export default Shop;
