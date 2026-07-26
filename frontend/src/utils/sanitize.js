/**
 * Input sanitization and validation utilities for client-side security.
 */

export function sanitizeInput(str) {
    if (typeof str !== 'string') return '';
    return str
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/[<>"'&]/g, (char) => {
            switch (char) {
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '"': return '&quot;';
                case "'": return '&#39;';
                case '&': return '&amp;';
                default: return char;
            }
        })
        .trim();
}

export function validateEmail(email) {
    if (!email) return false;
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase().trim());
}

export function validatePhone(phone) {
    if (!phone) return false;
    const re = /^\+?[0-9()\-\s]{8,15}$/;
    return re.test(String(phone).trim());
}

export function validateZIP(zip) {
    if (!zip) return false;
    const re = /^[A-Za-z0-9\-\s]{3,12}$/;
    return re.test(String(zip).trim());
}

export function sanitizeUrl(url) {
    if (!url || typeof url !== 'string') return '/';
    const trimmed = url.trim();
    if (trimmed.startsWith('javascript:') || trimmed.startsWith('data:')) {
        return '/';
    }
    return trimmed;
}
