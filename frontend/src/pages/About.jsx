import React from 'react';

const About = () => {
    return (
        <div className="about-page" style={{ padding: '60px 20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', color: 'var(--color-primary)' }}>Welcome to The Ethnic Touch</h1>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--color-text)', marginBottom: '20px' }}>
                At The Ethnic Touch, we believe that ethnic wear should be a seamless blend of authentic tradition, superior quality, and everyday comfort. Born out of a deep love for Jaipur's rich textile heritage, our journey begins right at the roots.
            </p>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--color-text)', marginBottom: '20px' }}>
                Unlike off-the-shelf brands, we take pride in managing every step of the creation process. From handpicking premium, breathable fabrics to sketching original, modern designs, every garment is thoughtfully crafted by us and manufactured directly in Jaipur. This hands-on approach ensures that every kurti delivers unmatched quality, vibrant elegance, and exceptional durability.
            </p>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--color-text)', marginBottom: '20px' }}>
                Whether you prefer the touch-and-feel experience of shopping in our offline store or the convenience of ordering online, we bring the best of Jaipur’s craftsmanship right to you.
            </p>
            <h3 style={{ fontSize: '1.5rem', marginTop: '40px', color: 'var(--color-primary)' }}>Our Promise</h3>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--color-text)' }}>
                Top-quality fabrics, unique in-house designs, and authentic Jaipur ethnic wear—delivered to your doorstep anywhere in India.
            </p>
        </div>
    );
};

export default About;
