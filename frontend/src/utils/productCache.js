/**
 * productCache.js
 * Lightweight in-memory cache for /api/products responses.
 * Prevents re-fetching the product list on every SPA back-navigation.
 *
 * TTL: 5 minutes (enough for a typical browsing session)
 * Keyed by the full query string so filtered results are also cached.
 */

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

const store = new Map(); // key → { data, expiresAt }

const productCache = {
    /**
     * Get a cached value. Returns null if missing or expired.
     * @param {string} key
     */
    get(key) {
        const entry = store.get(key);
        if (!entry) return null;
        if (Date.now() > entry.expiresAt) {
            store.delete(key);
            return null;
        }
        return entry.data;
    },

    /**
     * Store a value with the default TTL.
     * @param {string} key
     * @param {*} data
     */
    set(key, data) {
        store.set(key, {
            data,
            expiresAt: Date.now() + CACHE_TTL_MS,
        });
    },

    /** Invalidate a specific key (e.g. after an admin update). */
    invalidate(key) {
        store.delete(key);
    },

    /** Flush the entire cache (e.g. after adding a new product). */
    clear() {
        store.clear();
    },
};

export default productCache;
