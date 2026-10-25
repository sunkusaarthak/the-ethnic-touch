export const R2_PUBLIC_URL = "https://pub-b60b66ffc0d446b288328de25bf9a315.r2.dev";

/**
 * Resolves any image URL to the fast, edge-cached Cloudflare R2 CDN URL.
 * If the image is already a full http(s) URL, it returns it as is.
 * If it is a relative path like "./images/..." or "/images/...", it prefixes with R2_PUBLIC_URL.
 */
export function getOptimizedImageUrl(src) {
    if (!src) return `${R2_PUBLIC_URL}/images/kurthi_peach.png`;
    if (typeof src !== 'string') return src;
    
    const trimmed = src.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
        return trimmed;
    }
    
    // Normalize relative path
    let clean = trimmed.replace(/^\.\//, '');
    if (!clean.startsWith('/')) {
        clean = '/' + clean;
    }
    
    return `${R2_PUBLIC_URL}${clean}`;
}

export default getOptimizedImageUrl;
