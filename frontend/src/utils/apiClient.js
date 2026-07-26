import { auth, API_BASE_URL } from '../data/config';

/**
 * Hardened API Client wrapper for fetch operations.
 * Enforces timeouts, Bearer ID token auth injection, and error handling.
 */
export async function fetchWithAuth(url, options = {}) {
    const { timeout = 10000, headers = {}, ...restOptions } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const mergedHeaders = {
        'Content-Type': 'application/json',
        ...headers
    };

    if (auth && auth.currentUser) {
        try {
            const token = await auth.currentUser.getIdToken();
            if (token) {
                mergedHeaders['Authorization'] = `Bearer ${token}`;
            }
            mergedHeaders['X-User-Id'] = auth.currentUser.uid;
        } catch (e) {
            console.warn("[apiClient] Token retrieval skipped:", e);
        }
    }

    try {
        const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
        const response = await fetch(fullUrl, {
            ...restOptions,
            headers: mergedHeaders,
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            let errorMsg = `HTTP Error ${response.status}`;
            try {
                const errData = await response.json();
                if (errData && errData.error) {
                    errorMsg = errData.error;
                }
            } catch (_) {}
            const error = new Error(errorMsg);
            error.status = response.status;
            throw error;
        }

        return response;
    } catch (err) {
        clearTimeout(timeoutId);
        if (err.name === 'AbortError') {
            throw new Error('Request timed out. Please check your network connection.');
        }
        throw err;
    }
}

export const apiClient = {
    get: async (url, options = {}) => {
        const res = await fetchWithAuth(url, { ...options, method: 'GET' });
        return res.json();
    },
    post: async (url, body, options = {}) => {
        const res = await fetchWithAuth(url, {
            ...options,
            method: 'POST',
            body: JSON.stringify(body)
        });
        return res.json();
    },
    put: async (url, body, options = {}) => {
        const res = await fetchWithAuth(url, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(body)
        });
        return res.json();
    },
    patch: async (url, body, options = {}) => {
        const res = await fetchWithAuth(url, {
            ...options,
            method: 'PATCH',
            body: JSON.stringify(body)
        });
        return res.json();
    },
    delete: async (url, options = {}) => {
        const res = await fetchWithAuth(url, { ...options, method: 'DELETE' });
        return res.json();
    }
};

export default apiClient;
