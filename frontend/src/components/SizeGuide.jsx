import React, { useState } from 'react';

const sizeData = [
    { size: 'XS', bust: 30, waist: 28, hips: 32 },
    { size: 'S', bust: 32, waist: 30, hips: 34 },
    { size: 'M', bust: 34, waist: 32, hips: 36 },
    { size: 'L', bust: 36, waist: 34, hips: 38 },
    { size: 'XL', bust: 38, waist: 36, hips: 40 },
    { size: 'XXL', bust: 40, waist: 38, hips: 42 }
];

const convertToCm = (inches) => (inches * 2.54).toFixed(1);

const SizeGuide = () => {
    const [unit, setUnit] = useState('in');

    return (
        <div style={{ padding: '1rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '600', color: 'var(--color-text)' }}>Short Kurtis Size Chart</h4>
                <div style={{ display: 'flex', backgroundColor: '#FAF7F4', borderRadius: '50px', padding: '0.25rem', border: '1px solid #eaeaea' }}>
                    <button 
                        onClick={() => setUnit('in')}
                        style={{
                            background: unit === 'in' ? 'var(--color-primary)' : 'transparent',
                            color: unit === 'in' ? '#fff' : '#686461',
                            border: 'none',
                            padding: '0.4rem 1rem',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            borderRadius: '50px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: unit === 'in' ? '0 2px 8px rgba(212, 163, 115, 0.3)' : 'none'
                        }}
                    >
                        Inches
                    </button>
                    <button 
                        onClick={() => setUnit('cm')}
                        style={{
                            background: unit === 'cm' ? 'var(--color-primary)' : 'transparent',
                            color: unit === 'cm' ? '#fff' : '#686461',
                            border: 'none',
                            padding: '0.4rem 1rem',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            borderRadius: '50px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: unit === 'cm' ? '0 2px 8px rgba(212, 163, 115, 0.3)' : 'none'
                        }}
                    >
                        cms
                    </button>
                </div>
            </div>

            <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch', borderRadius: '8px', border: '1px solid #eaeaea', marginBottom: '1.5rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', minWidth: '500px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#FAF7F4' }}>
                            <th style={{ padding: '0.75rem', borderBottom: '1px solid #eaeaea', color: '#686461', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase' }}>Size</th>
                            <th style={{ padding: '0.75rem', borderBottom: '1px solid #eaeaea', color: '#686461', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase' }}>Bust</th>
                            <th style={{ padding: '0.75rem', borderBottom: '1px solid #eaeaea', color: '#686461', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase' }}>Waist</th>
                            <th style={{ padding: '0.75rem', borderBottom: '1px solid #eaeaea', color: '#686461', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase' }}>Hips</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sizeData.map((row, idx) => {
                            const bustVal = unit === 'in' ? row.bust : convertToCm(row.bust);
                            const waistVal = unit === 'in' ? row.waist : convertToCm(row.waist);
                            const hipsVal = unit === 'in' ? row.hips : convertToCm(row.hips);

                            return (
                                <tr key={row.size} style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#fafafa', transition: 'background-color 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fdf6ee'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#fff' : '#fafafa'}>
                                    <td style={{ padding: '0.75rem', borderBottom: '1px solid #eaeaea', fontWeight: '700', color: 'var(--color-primary)', fontSize: '0.9rem' }}>{row.size}</td>
                                    <td style={{ padding: '0.75rem', borderBottom: '1px solid #eaeaea', fontWeight: '500', fontSize: '0.9rem' }}>{bustVal}</td>
                                    <td style={{ padding: '0.75rem', borderBottom: '1px solid #eaeaea', fontWeight: '500', fontSize: '0.9rem' }}>{waistVal}</td>
                                    <td style={{ padding: '0.75rem', borderBottom: '1px solid #eaeaea', fontWeight: '500', fontSize: '0.9rem' }}>{hipsVal}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333', marginBottom: '1rem' }}>HOW TO MEASURE</h4>
                <img 
                    src="/images/how-to-measure.jpg" 
                    alt="How to Measure Guide" 
                    style={{ width: '100%', maxWidth: '450px', display: 'block', margin: '0 auto 2rem', borderRadius: '8px' }} 
                />
            </div>

            <div style={{ backgroundColor: '#FAF7F4', borderLeft: '4px solid var(--color-primary)', padding: '1.25rem', borderRadius: '0 8px 8px 0', fontSize: '0.85rem', color: '#686461', lineHeight: '1.6', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }}>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                </svg>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <strong style={{ color: '#333', fontSize: '0.95rem' }}>Fit Tips</strong>
                    <span>All garments have a 1" margin. If you're on the borderline between two sizes, it's advisable to size up for a relaxed fit.</span>
                    <span>If you're still unsure about your measurements or want a custom size, please email us at hello@theethnictouch.com.</span>
                </div>
            </div>
        </div>
    );
};

export default SizeGuide;
