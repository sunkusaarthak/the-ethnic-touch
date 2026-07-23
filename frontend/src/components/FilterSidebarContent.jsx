import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate, Link, useLocation, useParams, Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';

const FilterSidebarContent = ({
    selectedCategories, setSelectedCategories,
    selectedSizes, setSelectedSizes,
    selectedFabrics, setSelectedFabrics,
    selectedPatterns, setSelectedPatterns,
    selectedSleeves, setSelectedSleeves,
    selectedOccasions, setSelectedOccasions,
    selectedCollections, setSelectedCollections,
    selectedColors, setSelectedColors,
    onlyNewArrivals, setOnlyNewArrivals,
    onlyBestSellers, setOnlyBestSellers,
    priceRange, setPriceRange
}) => {
    const handleCheckboxToggle = (list, setList, val) => {
        if (list.includes(val)) {
            setList(list.filter(item => item !== val));
        } else {
            setList([...list, val]);
        }
    };

    const categories = ["Straight Cut", "Anarkali", "Tunic", "Fusion", "Palazzo Set", "A-Line"];
    const sizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
    const fabrics = ["Cotton", "Rayon", "Linen", "Silk", "Georgette", "Viscose", "Chiffon", "Khadi"];
    const sleeves = ["Half Sleeve", "Full Sleeve", "Sleeveless", "Three Quarter"];
    const patterns = ["Printed", "Solid", "Embroidered", "Floral", "Striped", "Block Print"];
    const occasions = ["Daily Wear", "Office", "Festival", "Wedding", "Party", "Casual", "Traditional"];
    const collections = ["Festive Glow", "Summer Breeze", "Lavender Dream", "Monsoon Magic"];
    const colors = ["Peach", "Mint Green", "Lavender", "Blue", "Pink", "Red", "Yellow", "White", "Black"];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="filter-section">
                <div className="filter-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    <span>Specials</span>
                </div>
                <div className="filter-options">
                    <label className="filter-checkbox-label">
                        <input 
                            type="checkbox" 
                            checked={onlyNewArrivals}
                            onChange={(e) => setOnlyNewArrivals(e.target.checked)}
                        />
                        <span>New Arrivals Only</span>
                    </label>
                    <label className="filter-checkbox-label">
                        <input 
                            type="checkbox" 
                            checked={onlyBestSellers}
                            onChange={(e) => setOnlyBestSellers(e.target.checked)}
                        />
                        <span>Best Sellers Only</span>
                    </label>
                </div>
            </div>

            <div className="filter-section">
                <div className="filter-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
                    <span>Collection</span>
                </div>
                <div className="filter-options">
                    {collections.map(col => (
                        <label key={col} className="filter-checkbox-label">
                            <input 
                                type="checkbox" 
                                checked={selectedCollections.includes(col)}
                                onChange={() => handleCheckboxToggle(selectedCollections, setSelectedCollections, col)}
                            />
                            <span>{col}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="filter-section">
                <div className="filter-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                    <span>Category</span>
                </div>
                <div className="filter-options">
                    {categories.map(c => (
                        <label key={c} className="filter-checkbox-label">
                            <input 
                                type="checkbox" 
                                checked={selectedCategories.includes(c)}
                                onChange={() => handleCheckboxToggle(selectedCategories, setSelectedCategories, c)}
                            />
                            <span>{c}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="filter-section">
                <div className="filter-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><line x1="21" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="3" y2="18"></line></svg>
                    <span>Sizes</span>
                </div>
                <div className="filter-options" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', maxHeight: 'none' }}>
                    {sizes.map(s => {
                        const active = selectedSizes.includes(s);
                        return (
                            <button
                                key={s}
                                onClick={() => handleCheckboxToggle(selectedSizes, setSelectedSizes, s)}
                                style={{
                                    padding: '6px 0',
                                    border: `1.5px solid ${active ? 'var(--color-primary)' : 'rgba(0,0,0,0.08)'}`,
                                    background: active ? '#fffcf9' : '#FFF',
                                    color: active ? 'var(--color-primary)' : 'var(--color-text)',
                                    borderRadius: '6px',
                                    fontSize: '0.8rem',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {s}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="filter-section">
                <div className="filter-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                    <span>Price Range</span>
                </div>
                <div className="filter-options">
                    {[
                        { label: 'All Prices', value: 'all' },
                        { label: 'Under ₹2,000', value: 'under_2k' },
                        { label: '₹2,000 - ₹4,999', value: '2k_5k' },
                        { label: '₹5,000 - ₹9,999', value: '5k_10k' },
                        { label: '₹10,000+', value: 'over_10k' }
                    ].map(opt => (
                        <label key={opt.value} className="filter-checkbox-label">
                            <input 
                                type="radio" 
                                checked={priceRange === opt.value}
                                onChange={() => setPriceRange(opt.value)}
                            />
                            <span>{opt.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="filter-section">
                <div className="filter-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><line x1="2" y1="12" x2="22" y2="12"></line></svg>
                    <span>Fabric</span>
                </div>
                <div className="filter-options">
                    {fabrics.map(f => (
                        <label key={f} className="filter-checkbox-label">
                            <input 
                                type="checkbox" 
                                checked={selectedFabrics.includes(f)}
                                onChange={() => handleCheckboxToggle(selectedFabrics, setSelectedFabrics, f)}
                            />
                            <span>{f}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="filter-section">
                <div className="filter-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"></path></svg>
                    <span>Color Palette</span>
                </div>
                <div className="filter-options">
                    {colors.map(col => (
                        <label key={col} className="filter-checkbox-label">
                            <input 
                                type="checkbox" 
                                checked={selectedColors.includes(col)}
                                onChange={() => handleCheckboxToggle(selectedColors, setSelectedColors, col)}
                            />
                            <span>{col}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="filter-section">
                <div className="filter-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    <span>Occasion</span>
                </div>
                <div className="filter-options">
                    {occasions.map(o => (
                        <label key={o} className="filter-checkbox-label">
                            <input 
                                type="checkbox" 
                                checked={selectedOccasions.includes(o)}
                                onChange={() => handleCheckboxToggle(selectedOccasions, setSelectedOccasions, o)}
                            />
                            <span>{o}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="filter-section">
                <div className="filter-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"></path></svg>
                    <span>Sleeve Type</span>
                </div>
                <div className="filter-options">
                    {sleeves.map(sl => (
                        <label key={sl} className="filter-checkbox-label">
                            <input 
                                type="checkbox" 
                                checked={selectedSleeves.includes(sl)}
                                onChange={() => handleCheckboxToggle(selectedSleeves, setSelectedSleeves, sl)}
                            />
                            <span>{sl}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="filter-section" style={{ borderBottom: 'none', marginBottom: 0 }}>
                <div className="filter-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                    <span>Pattern & Craft</span>
                </div>
                <div className="filter-options">
                    {patterns.map(p => (
                        <label key={p} className="filter-checkbox-label">
                            <input 
                                type="checkbox" 
                                checked={selectedPatterns.includes(p)}
                                onChange={() => handleCheckboxToggle(selectedPatterns, setSelectedPatterns, p)}
                            />
                            <span>{p}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FilterSidebarContent;
