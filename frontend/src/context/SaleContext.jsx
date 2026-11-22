import { createContext, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../utils/apiClient';

export const SaleContext = createContext({ sale: null, catalog: [] });
export const useSale = () => useContext(SaleContext);

export function useStoreSale() {
    const [sale, setSale] = useState(null);
    useEffect(() => {
        let stopped = false;
        let timer;
        const refresh = async () => {
            let delay = 30000;
            try {
                const config = await apiClient.get('/api/config/sale', { cache: 'no-store' });
                if (stopped) return;
                setSale(config.enabled ? config : null);
                const boundary = Date.parse(config.enabled ? config.endsAt : config.startsAt) - Date.now();
                if (boundary > 0) delay = Math.min(delay, boundary + 50);
            } catch {
                if (!stopped) setSale(null);
            }
            if (!stopped) timer = setTimeout(refresh, delay);
        };
        refresh();
        return () => { stopped = true; clearTimeout(timer); };
    }, []);
    return sale;
}

export function saleSavings(product, sale) {
    if (!sale || Date.now() >= Date.parse(sale.endsAt) || !product || product.isPreorder ||
        Number(product.originalPrice) > Number(product.regularPrice ?? product.price)) return 0;
    if (sale.collections?.length && !sale.collections.some(value =>
        value.toLowerCase() === String(product.collection || '').trim().toLowerCase())) return 0;
    const paise = Math.round(Number(product.regularPrice ?? product.price) * 100);
    return Math.max(0, Math.min(paise - 100, Math.round(paise * sale.percent / 100)));
}

export function saleProduct(product, sale) {
    const savings = saleSavings(product, sale);
    if (!savings || product.regularPrice != null) return product;
    return { ...product, regularPrice: product.price, originalPrice: product.price,
        price: (Math.round(product.price * 100) - savings) / 100 };
}

export function cartSaleSavings(cart, catalog, sale) {
    const products = new Map(catalog.map(product => [String(product.id), product]));
    return (cart || []).reduce((amount, item) =>
        amount + saleSavings(products.get(String(item.id)), sale) * (item.quantity || 1), 0) / 100;
}

export function SaleBanner({ sale }) {
    if (!sale) return null;
    const end = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short'
    }).format(new Date(sale.endsAt));
    return (
        <aside style={{ background: '#654334', color: '#fff', textAlign: 'center', padding: '0.5rem 1rem' }}>
            <Link to="/shop" style={{ color: 'inherit' }}>
                {sale.name} · {sale.percent}% off eligible styles · Ends {end} IST · Shop now
            </Link>
        </aside>
    );
}
