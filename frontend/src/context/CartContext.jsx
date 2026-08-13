import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from './AuthContext';
import apiClient from '../utils/apiClient';
import { fallbackProducts } from '../data/config';

const CartContext = createContext({
    cart: [],
    wishlist: [],
    discount: null,
    addToCart: () => {},
    updateQuantity: () => {},
    removeFromCart: () => {},
    clearCart: () => {},
    setDiscount: () => {},
    toggleWishlist: () => {},
    toastProduct: null
});

// Helper to ensure cart items always have an image and price
const enrichCartItem = (item) => {
    if (!item) return item;
    const found = fallbackProducts.find(p => p.id === String(item.id));
    return {
        ...item,
        id: String(item.id),
        imageUrl: item.imageUrl || item.image_url || (found ? found.imageUrl : './images/kurthi_peach.png'),
        description: item.description || (found ? found.description : ''),
        price: item.price || (found ? found.price : 9999)
    };
};

export const CartProvider = ({ children }) => {
    const { authUser, authLoading } = useAuth();

    // Recover initial cart state safely from localStorage
    const [cart, setCart] = useState(() => {
        try {
            const active = localStorage.getItem('tet_cart_active');
            if (active) {
                const parsed = JSON.parse(active);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed.map(enrichCartItem);
            }
            const guest = localStorage.getItem('tet_guest_cart');
            if (guest) {
                const parsed = JSON.parse(guest);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed.map(enrichCartItem);
            }
        } catch (e) {
            console.error("[CartContext] Local storage parse error:", e);
        }
        return [];
    });

    const [wishlist, setWishlist] = useState(() => {
        try {
            const active = localStorage.getItem('tet_wishlist_active');
            if (active) {
                const parsed = JSON.parse(active);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
            const guest = localStorage.getItem('tet_guest_wishlist');
            if (guest) {
                const parsed = JSON.parse(guest);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch (e) {
            console.error("[CartContext] Wishlist local storage parse error:", e);
        }
        return [];
    });

    const [discount, setDiscount] = useState(null);
    const [toastProduct, setToastProduct] = useState(null);
    const toastTimerRef = useRef(null);

    // Save cart & wishlist state to localStorage on EVERY change so refreshes NEVER lose data
    useEffect(() => {
        try {
            if (cart && cart.length > 0) {
                localStorage.setItem('tet_cart_active', JSON.stringify(cart));
                localStorage.setItem('tet_guest_cart', JSON.stringify(cart));
            }
        } catch (e) {
            console.error("[CartContext] Local storage write error:", e);
        }
    }, [cart]);

    useEffect(() => {
        try {
            if (wishlist && wishlist.length > 0) {
                localStorage.setItem('tet_wishlist_active', JSON.stringify(wishlist));
                localStorage.setItem('tet_guest_wishlist', JSON.stringify(wishlist));
            }
        } catch (e) {
            console.error("[CartContext] Wishlist storage write error:", e);
        }
    }, [wishlist]);

    // Synchronize guest items and load account data upon login
    useEffect(() => {
        let isMounted = true;

        const syncUserData = async () => {
            if (authUser) {
                // Fetch account wishlist
                try {
                    const items = await apiClient.get('/api/wishlist');
                    if (isMounted && Array.isArray(items) && items.length > 0) {
                        setWishlist(prev => {
                            const merged = new Map();
                            prev.forEach(p => merged.set(String(p.id), p));
                            items.forEach(p => merged.set(String(p.id), p));
                            return Array.from(merged.values());
                        });
                    }
                } catch (e) {
                    console.error("[CartContext] Fetch wishlist error:", e);
                }

                // Fetch account cart
                try {
                    const items = await apiClient.get('/api/cart');
                    if (isMounted && Array.isArray(items) && items.length > 0) {
                        const enrichedItems = items.map(enrichCartItem);
                        setCart(prev => {
                            const merged = new Map();
                            // Keep all existing local items
                            (prev || []).forEach(it => {
                                const key = `${it.id}_${it.size || ''}`;
                                merged.set(key, enrichCartItem(it));
                            });
                            // Merge backend items
                            enrichedItems.forEach(it => {
                                const key = `${it.id}_${it.size || ''}`;
                                merged.set(key, it);
                            });
                            const result = Array.from(merged.values());
                            try {
                                localStorage.setItem('tet_cart_active', JSON.stringify(result));
                                localStorage.setItem('tet_guest_cart', JSON.stringify(result));
                            } catch (err) {}
                            return result;
                        });
                    }
                } catch (e) {
                    console.error("[CartContext] Fetch cart error:", e);
                }
            }
        };

        if (!authLoading) {
            syncUserData();
        }

        return () => {
            isMounted = false;
        };
    }, [authUser, authLoading]);

    // Cleanup toast timer on unmount
    useEffect(() => {
        return () => {
            if (toastTimerRef.current) {
                clearTimeout(toastTimerRef.current);
            }
        };
    }, []);

    const addToCart = useCallback((product) => {
        if (!product || !product.id) return;
        const enriched = enrichCartItem(product);
        const prodQty = enriched.quantity || 1;
        const targetSize = enriched.size || '';

        setCart(prev => {
            const existingIndex = prev.findIndex(item => String(item.id) === String(enriched.id) && (item.size || '') === targetSize);
            let updated;
            let calcQty = prodQty;

            if (existingIndex > -1) {
                updated = [...prev];
                const currentItem = updated[existingIndex];
                calcQty = (currentItem.quantity || 1) + prodQty;
                updated[existingIndex] = {
                    ...currentItem,
                    quantity: calcQty
                };
            } else {
                updated = [...prev, { ...enriched, quantity: prodQty, size: targetSize }];
            }

            try {
                localStorage.setItem('tet_cart_active', JSON.stringify(updated));
                localStorage.setItem('tet_guest_cart', JSON.stringify(updated));
            } catch (e) {}

            // Sync with backend async
            if (authUser) {
                apiClient.post('/api/cart', {
                    productId: enriched.id,
                    quantity: calcQty,
                    size: targetSize
                }).catch(e => console.error("[CartContext] DB cart add error:", e));
            }

            return updated;
        });

        // Trigger notification toast
        if (toastTimerRef.current) {
            clearTimeout(toastTimerRef.current);
        }
        setToastProduct(enriched);
        toastTimerRef.current = setTimeout(() => {
            setToastProduct(null);
        }, 5500);
    }, [authUser]);

    // Flexible updateQuantity: handles (index, newQty) OR (id, size, delta)
    const updateQuantity = useCallback((idOrIndex, sizeOrQty, newQtyOrDelta) => {
        setCart(prev => {
            let updated = [...prev];

            if (typeof idOrIndex === 'number' && idOrIndex >= 0 && idOrIndex < prev.length && typeof sizeOrQty === 'number') {
                // Index-based update from Cart.jsx (index, newQty)
                const targetIdx = idOrIndex;
                const newQty = sizeOrQty;
                const itemToUpdate = updated[targetIdx];

                if (newQty <= 0) {
                    updated = prev.filter((_, idx) => idx !== targetIdx);
                    if (authUser && itemToUpdate) {
                        apiClient.delete(`/api/cart?productId=${itemToUpdate.id}&size=${itemToUpdate.size || ''}`)
                            .catch(e => console.error("[CartContext] DB cart delete error:", e));
                    }
                } else {
                    updated[targetIdx] = { ...itemToUpdate, quantity: newQty };
                    if (authUser && itemToUpdate) {
                        apiClient.post('/api/cart', {
                            productId: itemToUpdate.id,
                            quantity: newQty,
                            size: itemToUpdate.size || ''
                        }).catch(e => console.error("[CartContext] DB cart update error:", e));
                    }
                }
            } else {
                // ID and Size based update (id, size, delta)
                const id = String(idOrIndex);
                const size = typeof sizeOrQty === 'string' ? sizeOrQty : '';
                const val = newQtyOrDelta;

                updated = prev.map(item => {
                    if (String(item.id) === id && (item.size || '') === (size || '')) {
                        const currentQty = item.quantity || 1;
                        const nextQty = typeof val === 'number' ? (val <= 5 && val >= -5 ? currentQty + val : val) : currentQty;
                        return nextQty > 0 ? { ...item, quantity: nextQty } : null;
                    }
                    return item;
                }).filter(Boolean);

                const targetItem = updated.find(item => String(item.id) === id && (item.size || '') === (size || ''));
                if (authUser && targetItem) {
                    apiClient.post('/api/cart', {
                        productId: id,
                        quantity: targetItem.quantity,
                        size: size || ''
                    }).catch(e => console.error("[CartContext] DB cart update error:", e));
                }
            }

            try {
                localStorage.setItem('tet_cart_active', JSON.stringify(updated));
                localStorage.setItem('tet_guest_cart', JSON.stringify(updated));
            } catch (e) {}

            return updated;
        });
    }, [authUser]);

    // Flexible removeFromCart: handles index, item object, OR (id, size)
    const removeFromCart = useCallback((idOrIndexOrItem, size) => {
        setCart(prev => {
            let updated = [];
            let itemToRemove = null;

            if (typeof idOrIndexOrItem === 'number') {
                // Index-based removal from Cart.jsx
                itemToRemove = prev[idOrIndexOrItem];
                updated = prev.filter((_, idx) => idx !== idOrIndexOrItem);
            } else if (typeof idOrIndexOrItem === 'object' && idOrIndexOrItem !== null) {
                // Item Object based removal
                itemToRemove = idOrIndexOrItem;
                updated = prev.filter(item => !(String(item.id) === String(itemToRemove.id) && (item.size || '') === (itemToRemove.size || '')));
            } else {
                // ID & Size based removal
                const targetId = String(idOrIndexOrItem);
                const targetSize = size || '';
                itemToRemove = prev.find(item => String(item.id) === targetId && (item.size || '') === targetSize);
                updated = prev.filter(item => !(String(item.id) === targetId && (item.size || '') === targetSize));
            }

            if (authUser && itemToRemove) {
                apiClient.delete(`/api/cart?productId=${itemToRemove.id}&size=${itemToRemove.size || ''}`)
                    .catch(e => console.error("[CartContext] DB cart delete error:", e));
            }

            try {
                localStorage.setItem('tet_cart_active', JSON.stringify(updated));
                localStorage.setItem('tet_guest_cart', JSON.stringify(updated));
            } catch (e) {}

            return updated;
        });
    }, [authUser]);

    const clearCart = useCallback(() => {
        setCart([]);
        setDiscount(null);
        localStorage.removeItem('tet_cart_active');
        localStorage.removeItem('tet_guest_cart');
        if (authUser) {
            apiClient.delete('/api/cart').catch(e => console.error("[CartContext] Clear cart error:", e));
        }
    }, [authUser]);

    const toggleWishlist = useCallback((product) => {
        if (!product || !product.id) return;
        setWishlist(prev => {
            const isWished = prev.some(item => String(item.id) === String(product.id));
            const updated = isWished
                ? prev.filter(item => String(item.id) !== String(product.id))
                : [...prev, product];

            try {
                localStorage.setItem('tet_wishlist_active', JSON.stringify(updated));
                localStorage.setItem('tet_guest_wishlist', JSON.stringify(updated));
            } catch (e) {}

            if (authUser) {
                if (isWished) {
                    apiClient.delete(`/api/wishlist?productId=${product.id}`)
                        .catch(e => console.error("[CartContext] DB wishlist delete error:", e));
                } else {
                    apiClient.post('/api/wishlist', { productId: product.id })
                        .catch(e => console.error("[CartContext] DB wishlist add error:", e));
                }
            }

            return updated;
        });
    }, [authUser]);

    return (
        <CartContext.Provider value={{
            cart,
            wishlist,
            discount,
            addToCart,
            updateQuantity,
            removeFromCart,
            clearCart,
            setDiscount,
            toggleWishlist,
            toastProduct
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);

export default CartContext;
