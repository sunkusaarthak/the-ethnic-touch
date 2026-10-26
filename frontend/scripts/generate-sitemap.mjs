import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://www.theethnictouch.com';
const TODAY = new Date().toISOString().split('T')[0];

function createProductSlug(name) {
    if (!name) return '';
    return name
        .toLowerCase()
        .replace(/&/g, 'and')
        .replace(/[/\\+]/g, '-')
        .replace(/[^a-z0-9\-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
}

const staticRoutes = [
    { loc: `${BASE_URL}/`, changefreq: 'daily', priority: '1.0' },
    { loc: `${BASE_URL}/shop`, changefreq: 'daily', priority: '0.95' },
    { loc: `${BASE_URL}/shop/straight-cut`, changefreq: 'weekly', priority: '0.85' },
    { loc: `${BASE_URL}/shop/anarkali`, changefreq: 'weekly', priority: '0.85' },
    { loc: `${BASE_URL}/shop/tunic`, changefreq: 'weekly', priority: '0.85' },
    { loc: `${BASE_URL}/shop/fusion`, changefreq: 'weekly', priority: '0.85' },
    { loc: `${BASE_URL}/about`, changefreq: 'monthly', priority: '0.7' },
    { loc: `${BASE_URL}/contact`, changefreq: 'monthly', priority: '0.7' },
    { loc: `${BASE_URL}/privacy-policy`, changefreq: 'yearly', priority: '0.3' },
    { loc: `${BASE_URL}/refund-policy`, changefreq: 'yearly', priority: '0.3' }
];

async function fetchProducts() {
    const endpoints = [
        'http://localhost:8080/api/products',
        process.env.VITE_API_BASE_URL ? `${process.env.VITE_API_BASE_URL.replace(/\/+$/, '')}/api/products` : null,
        'https://tet-backend-1.onrender.com/api/products',
        'https://the-ethnic-touch-backend.onrender.com/api/products'
    ].filter(Boolean);

    for (const url of endpoints) {
        try {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 4000);
            const res = await fetch(url, { signal: controller.signal });
            clearTimeout(timer);
            if (res.ok) {
                const data = await res.json();
                const list = Array.isArray(data) ? data : (data.products || []);
                if (list.length > 0) {
                    console.log(`[Sitemap] Successfully fetched ${list.length} products from ${url}`);
                    return list;
                }
            }
        } catch (e) {
            // try next
        }
    }
    return [];
}

async function main() {
    const products = await fetchProducts();
    const productRoutes = products.map(p => {
        const slug = createProductSlug(p.name);
        return {
            loc: `${BASE_URL}/product/${p.id}/${slug}`,
            changefreq: 'weekly',
            priority: '0.8'
        };
    });

    const allRoutes = [...staticRoutes, ...productRoutes];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    for (const r of allRoutes) {
        xml += `  <url>\n`;
        xml += `    <loc>${r.loc}</loc>\n`;
        xml += `    <lastmod>${TODAY}</lastmod>\n`;
        xml += `    <changefreq>${r.changefreq}</changefreq>\n`;
        xml += `    <priority>${r.priority}</priority>\n`;
        xml += `  </url>\n`;
    }
    xml += `</urlset>\n`;

    const outPath = path.resolve(__dirname, '../public/sitemap.xml');
    fs.writeFileSync(outPath, xml, 'utf8');
    console.log(`[Sitemap] Generated ${outPath} with ${allRoutes.length} URLs (lastmod: ${TODAY})`);
}

main();
