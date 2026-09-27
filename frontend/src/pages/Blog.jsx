import React from 'react';
import { Link } from 'react-router-dom';

const Blog = () => {
    // Basic static blog posts for SEO topic clustering
    const posts = [
        {
            id: 'how-to-style-indo-western-kurtis-office-wear',
            title: 'How to Style Indo-Western Kurtis for Office Wear',
            date: 'October 15, 2026',
            excerpt: 'Finding the perfect balance between professional attire and cultural elegance is easier than ever with Indo-Western kurtis. Learn how to style your premium Jaipuri kurtis for a sharp, sophisticated office look.',
            content: `
                <p>When it comes to dressing for the modern workplace, comfort and professionalism are key. At The Ethnic Touch, we believe our collection of premium Indo-Western kurtis strikes the perfect balance.</p>
                <h3>1. Choose the Right Fabric</h3>
                <p>For long hours at the desk, breathability is non-negotiable. Opt for our fine cotton or premium georgette kurtis. These fabrics keep you cool and drape elegantly without excessive wrinkling.</p>
                <h3>2. The Power of the Straight Cut</h3>
                <p>A <a href="/shop/straight-cut" style="color: var(--color-primary); text-decoration: underline;">Straight Cut Kurti</a> offers a sleek, tailored silhouette that mimics a formal tunic. Pair a pastel-toned straight kurti with crisp ankle-length trousers or cigarette pants for an instantly sharp look.</p>
                <h3>3. Minimalist Accessories</h3>
                <p>Let the authentic Jaipuri prints and subtle hand-embroidery stand out. Stick to minimalist jewelry—a delicate silver chain, stud earrings, or a classic watch. Avoid heavy traditional jhumkas in formal settings.</p>
                <h3>4. Footwear Matters</h3>
                <p>Complete the Indo-Western fusion with the right shoes. Loafers, mules, or block heels work wonderfully with straight kurtis and trousers, giving you a polished, contemporary finish.</p>
                <p>Explore our latest <a href="/shop?newArrival=true" style="color: var(--color-primary); text-decoration: underline;">new arrivals</a> to find your next favorite office outfit, directly from the artisans in Jaipur.</p>
            `
        },
        {
            id: 'understanding-jaipuri-hand-block-printing',
            title: 'The Art of Jaipuri Hand Block Printing',
            date: 'September 28, 2026',
            excerpt: 'Dive into the rich history of Jaipuri block printing, the traditional technique behind the vibrant motifs on our premium authentic kurtis.',
            content: `
                <p>Jaipur is renowned globally for its rich textile heritage, and hand block printing is at the very heart of this legacy. At The Ethnic Touch, we are proud to bring this authentic craftsmanship directly to your wardrobe.</p>
                <h3>What is Hand Block Printing?</h3>
                <p>It is a centuries-old technique where artisans carve intricate designs into wooden blocks, dip them in natural or rich synthetic dyes, and stamp them onto fabric with precision. The result is a beautiful, slightly imperfect, and entirely unique pattern.</p>
                <h3>Why We Love It</h3>
                <p>No two block-printed garments are exactly alike. The subtle variations in color density and stamp placement are the hallmarks of genuine human craftsmanship. Whether it's an <a href="/shop/anarkali" style="color: var(--color-primary); text-decoration: underline;">Anarkali</a> with majestic floral borders or a casual tunic with geometric motifs, the block print adds a layer of soulful artistry.</p>
                <p>Experience the magic of true Jaipur textiles. Shop our <a href="/shop" style="color: var(--color-primary); text-decoration: underline;">complete collection</a> and wear a piece of history.</p>
            `
        }
    ];

    return (
        <div className="blog-page-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 5%', minHeight: '80vh' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--color-title)', textAlign: 'center' }}>Style Guide & Journal</h1>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '3rem', fontSize: '1.1rem' }}>
                Expert styling tips, fabric guides, and stories behind our authentic Jaipuri collections.
            </p>

            <div className="blog-posts-list" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                {posts.map(post => (
                    <article key={post.id} className="blog-post-card" style={{ padding: '2rem', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #eaeaea', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>{post.title}</h2>
                        <div style={{ fontSize: '0.85rem', color: '#999', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{post.date}</div>
                        
                        {/* SEO schema for blog post */}
                        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "BlogPosting",
                            "headline": post.title,
                            "datePublished": new Date(post.date).toISOString(),
                            "author": {
                                "@type": "Organization",
                                "name": "The Ethnic Touch"
                            }
                        })}} />

                        <div className="blog-post-content" dangerouslySetInnerHTML={{ __html: post.content }} style={{ lineHeight: '1.8', color: '#444', fontSize: '1rem' }} />
                    </article>
                ))}
            </div>
        </div>
    );
};

export default Blog;
