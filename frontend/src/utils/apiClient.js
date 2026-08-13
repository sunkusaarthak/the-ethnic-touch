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

        const contentType = response.headers.get('content-type') || '';

        if (!response.ok) {
            let errorMsg = `Server error (${response.status})`;
            if (contentType.includes('application/json')) {
                try {
                    const errData = await response.json();
                    if (errData && (errData.error || errData.message)) {
                        errorMsg = errData.error || errData.message;
                    }
                } catch (_) {}
            } else {
                errorMsg = `Unable to connect to API server (${response.status}).`;
            }
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

async function safeJsonParse(response) {
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
        return response.json();
    }
    const text = await response.text();
    if (text.trim().startsWith('<')) {
        throw new Error('Backend API server returned HTML instead of JSON. Is the backend server running?');
    }
    try {
        return JSON.parse(text);
    } catch (_) {
        throw new Error('Invalid response format received from server.');
    }
}

export const apiClient = {
    get: async (url, options = {}) => {
        const res = await fetchWithAuth(url, { ...options, method: 'GET' });
        return safeJsonParse(res);
    },
    post: async (url, body, options = {}) => {
        const res = await fetchWithAuth(url, {
            ...options,
            method: 'POST',
            body: JSON.stringify(body)
        });
        return safeJsonParse(res);
    },
    put: async (url, body, options = {}) => {
        const res = await fetchWithAuth(url, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(body)
        });
        return safeJsonParse(res);
    },
    patch: async (url, body, options = {}) => {
        const res = await fetchWithAuth(url, {
            ...options,
            method: 'PATCH',
            body: JSON.stringify(body)
        });
        return safeJsonParse(res);
    },
    delete: async (url, options = {}) => {
        const res = await fetchWithAuth(url, { ...options, method: 'DELETE' });
        return safeJsonParse(res);
    }
};

export default apiClient;
