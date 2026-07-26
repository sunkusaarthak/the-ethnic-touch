import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from './AuthContext';
import apiClient from '../utils/apiClient';

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

export const CartProvider = ({ children }) => {
    const { authUser, authLoading } = useAuth();

    const [cart, setCart] = useState(() => {
        try {
            const local = localStorage.getItem('tet_guest_cart');
            return local ? JSON.parse(local) : [];
        } catch (e) {
            return [];
        }
    });

    const [wishlist, setWishlist] = useState(() => {
        try {
            const local = localStorage.getItem('tet_guest_wishlist');
            return local ? JSON.parse(local) : [];
        } catch (e) {
            return [];
        }
    });

    const [discount, setDiscount] = useState(null);
    const [toastProduct, setToastProduct] = useState(null);
    const toastTimerRef = useRef(null);

    // Synchronize guest items and load account data upon login
    useEffect(() => {
        let isMounted = true;

        const syncUserData = async () => {
            if (authUser) {
                // Merge guest wishlist
                const localW = localStorage.getItem('tet_guest_wishlist');
                if (localW) {
                    try {
                        const parsed = JSON.parse(localW);
                        if (Array.isArray(parsed) && parsed.length > 0) {
                            const ids = parsed.map(p => p.id);
                            await apiClient.post('/api/wishlist/merge', { productIds: ids });
                        }
                    } catch (e) {
                        console.error("[CartContext] Wishlist merge error:", e);
                    } finally {
                        localStorage.removeItem('tet_guest_wishlist');
                    }
                }

                // Fetch account wishlist
                try {
                    const items = await apiClient.get('/api/wishlist');
                    if (isMounted && Array.isArray(items)) {
                        setWishlist(items);
                    }
                } catch (e) {
                    console.error("[CartContext] Fetch wishlist error:", e);
                }

                // Merge guest cart
                const localC = localStorage.getItem('tet_guest_cart');
                if (localC) {
                    try {
                        const parsed = JSON.parse(localC);
                        if (Array.isArray(parsed) && parsed.length > 0) {
                            await apiClient.post('/api/cart/merge', {
                                items: parsed.map(item => ({
                                    productId: item.id,
                                    quantity: item.quantity || 1,
                                    size: item.size || ''
                                }))
                            });
                            localStorage.removeItem('tet_guest_cart');
                        }
                    } catch (e) {
                        console.error("[CartContext] Cart merge error:", e);
                    }
                }

                // Fetch account cart
                try {
                    const items = await apiClient.get('/api/cart');
                    if (isMounted && Array.isArray(items) && items.length > 0) {
                        setCart(items);
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

    // Local storage sync for guest state
    useEffect(() => {
        if (cart && cart.length > 0) {
            localStorage.setItem('tet_guest_cart', JSON.stringify(cart));
        }
    }, [cart]);

    useEffect(() => {
        if (wishlist && wishlist.length > 0) {
            localStorage.setItem('tet_guest_wishlist', JSON.stringify(wishlist));
        }
    }, [wishlist]);

    // Cleanup toast timer on unmount
    useEffect(() => {
        return () => {
            if (toastTimerRef.current) {
                clearTimeout(toastTimerRef.current);
            }
        };
    }, []);

    const addToCart = useCallback((product) => {
        const prodQty = product.quantity || 1;
        const targetSize = product.size || '';

        setCart(prev => {
            const existingIndex = prev.findIndex(item => item.id === product.id && (item.size || '') === targetSize);
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
                updated = [...prev, { ...product, quantity: prodQty }];
            }

            // Sync with backend async (outside state updater block)
            if (authUser) {
                apiClient.post('/api/cart', {
                    productId: product.id,
                    quantity: calcQty,
                    size: targetSize
                }).catch(e => console.error("[CartContext] DB cart add error:", e));
            } else {
                localStorage.setItem('tet_guest_cart', JSON.stringify(updated));
            }

            return updated;
        });

        // Trigger notification toast
        if (toastTimerRef.current) {
            clearTimeout(toastTimerRef.current);
        }
        setToastProduct(product);
        toastTimerRef.current = setTimeout(() => {
            setToastProduct(null);
        }, 5500);
    }, [authUser]);

    const updateQuantity = useCallback((id, size, delta) => {
        setCart(prev => {
            const updated = prev.map(item => {
                if (item.id === id && (item.size || '') === (size || '')) {
                    const newQty = (item.quantity || 1) + delta;
                    return newQty > 0 ? { ...item, quantity: newQty } : null;
                }
                return item;
            }).filter(Boolean);

            const targetItem = updated.find(item => item.id === id && (item.size || '') === (size || ''));
            if (authUser && targetItem) {
                apiClient.post('/api/cart', {
                    productId: id,
                    quantity: targetItem.quantity,
                    size: size || ''
                }).catch(e => console.error("[CartContext] DB cart update error:", e));
            } else if (!authUser) {
                localStorage.setItem('tet_guest_cart', JSON.stringify(updated));
            }

            return updated;
        });
    }, [authUser]);

    const removeFromCart = useCallback((id, size) => {
        setCart(prev => {
            const updated = prev.filter(item => !(item.id === id && (item.size || '') === (size || '')));
            if (authUser) {
                apiClient.delete(`/api/cart?productId=${id}&size=${size || ''}`)
                    .catch(e => console.error("[CartContext] DB cart delete error:", e));
            } else {
                localStorage.setItem('tet_guest_cart', JSON.stringify(updated));
            }
            return updated;
        });
    }, [authUser]);

    const clearCart = useCallback(() => {
        setCart([]);
        setDiscount(null);
        localStorage.removeItem('tet_guest_cart');
        if (authUser) {
            apiClient.delete('/api/cart').catch(e => console.error("[CartContext] Clear cart error:", e));
        }
    }, [authUser]);

    const toggleWishlist = useCallback(async (product) => {
        setWishlist(prev => {
            const isWished = prev.some(item => item.id === product.id);
            const updated = isWished
                ? prev.filter(item => item.id !== product.id)
                : [...prev, product];

            if (authUser) {
                if (isWished) {
                    apiClient.delete(`/api/wishlist?productId=${product.id}`)
                        .catch(e => console.error("[CartContext] DB wishlist delete error:", e));
                } else {
                    apiClient.post('/api/wishlist', { productId: product.id })
                        .catch(e => console.error("[CartContext] DB wishlist add error:", e));
                }
            } else {
                localStorage.setItem('tet_guest_wishlist', JSON.stringify(updated));
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
