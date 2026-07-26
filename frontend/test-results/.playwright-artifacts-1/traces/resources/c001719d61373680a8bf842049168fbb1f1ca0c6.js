import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/context/CartContext.jsx");const React = __vite__cjsImport0_react; const createContext = __vite__cjsImport0_react["createContext"]; const useContext = __vite__cjsImport0_react["useContext"]; const useState = __vite__cjsImport0_react["useState"]; const useEffect = __vite__cjsImport0_react["useEffect"]; const useRef = __vite__cjsImport0_react["useRef"]; const useCallback = __vite__cjsImport0_react["useCallback"];const _jsxDEV = __vite__cjsImport3_react_jsxDevRuntime["jsxDEV"];import __vite__cjsImport0_react from "/node_modules/.vite/deps/react.js?v=42a9b196";
import { useAuth } from "/src/context/AuthContext.jsx";
import apiClient from "/src/utils/apiClient.js";
var _jsxFileName = "D:/The Ethnic Touch/frontend/src/context/CartContext.jsx";
import __vite__cjsImport3_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=42a9b196";
var _s = $RefreshSig$(), _s2 = $RefreshSig$();
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
_c = CartContext;
export const CartProvider = ({ children }) => {
	_s();
	const { authUser, authLoading } = useAuth();
	const [cart, setCart] = useState(() => {
		try {
			const local = localStorage.getItem("tet_guest_cart");
			return local ? JSON.parse(local) : [];
		} catch (e) {
			return [];
		}
	});
	const [wishlist, setWishlist] = useState(() => {
		try {
			const local = localStorage.getItem("tet_guest_wishlist");
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
				const localW = localStorage.getItem("tet_guest_wishlist");
				if (localW) {
					try {
						const parsed = JSON.parse(localW);
						if (Array.isArray(parsed) && parsed.length > 0) {
							const ids = parsed.map((p) => p.id);
							await apiClient.post("/api/wishlist/merge", { productIds: ids });
						}
					} catch (e) {
						console.error("[CartContext] Wishlist merge error:", e);
					} finally {
						localStorage.removeItem("tet_guest_wishlist");
					}
				}
				// Fetch account wishlist
				try {
					const items = await apiClient.get("/api/wishlist");
					if (isMounted && Array.isArray(items)) {
						setWishlist(items);
					}
				} catch (e) {
					console.error("[CartContext] Fetch wishlist error:", e);
				}
				// Merge guest cart
				const localC = localStorage.getItem("tet_guest_cart");
				if (localC) {
					try {
						const parsed = JSON.parse(localC);
						if (Array.isArray(parsed) && parsed.length > 0) {
							await apiClient.post("/api/cart/merge", { items: parsed.map((item) => ({
								productId: item.id,
								quantity: item.quantity || 1,
								size: item.size || ""
							})) });
							localStorage.removeItem("tet_guest_cart");
						}
					} catch (e) {
						console.error("[CartContext] Cart merge error:", e);
					}
				}
				// Fetch account cart
				try {
					const items = await apiClient.get("/api/cart");
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
			localStorage.setItem("tet_guest_cart", JSON.stringify(cart));
		}
	}, [cart]);
	useEffect(() => {
		if (wishlist && wishlist.length > 0) {
			localStorage.setItem("tet_guest_wishlist", JSON.stringify(wishlist));
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
		const targetSize = product.size || "";
		setCart((prev) => {
			const existingIndex = prev.findIndex((item) => item.id === product.id && (item.size || "") === targetSize);
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
				updated = [...prev, {
					...product,
					quantity: prodQty
				}];
			}
			// Sync with backend async (outside state updater block)
			if (authUser) {
				apiClient.post("/api/cart", {
					productId: product.id,
					quantity: calcQty,
					size: targetSize
				}).catch((e) => console.error("[CartContext] DB cart add error:", e));
			} else {
				localStorage.setItem("tet_guest_cart", JSON.stringify(updated));
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
		setCart((prev) => {
			const updated = prev.map((item) => {
				if (item.id === id && (item.size || "") === (size || "")) {
					const newQty = (item.quantity || 1) + delta;
					return newQty > 0 ? {
						...item,
						quantity: newQty
					} : null;
				}
				return item;
			}).filter(Boolean);
			const targetItem = updated.find((item) => item.id === id && (item.size || "") === (size || ""));
			if (authUser && targetItem) {
				apiClient.post("/api/cart", {
					productId: id,
					quantity: targetItem.quantity,
					size: size || ""
				}).catch((e) => console.error("[CartContext] DB cart update error:", e));
			} else if (!authUser) {
				localStorage.setItem("tet_guest_cart", JSON.stringify(updated));
			}
			return updated;
		});
	}, [authUser]);
	const removeFromCart = useCallback((id, size) => {
		setCart((prev) => {
			const updated = prev.filter((item) => !(item.id === id && (item.size || "") === (size || "")));
			if (authUser) {
				apiClient.delete(`/api/cart?productId=${id}&size=${size || ""}`).catch((e) => console.error("[CartContext] DB cart delete error:", e));
			} else {
				localStorage.setItem("tet_guest_cart", JSON.stringify(updated));
			}
			return updated;
		});
	}, [authUser]);
	const clearCart = useCallback(() => {
		setCart([]);
		setDiscount(null);
		localStorage.removeItem("tet_guest_cart");
		if (authUser) {
			apiClient.delete("/api/cart").catch((e) => console.error("[CartContext] Clear cart error:", e));
		}
	}, [authUser]);
	const toggleWishlist = useCallback(async (product) => {
		setWishlist((prev) => {
			const isWished = prev.some((item) => item.id === product.id);
			const updated = isWished ? prev.filter((item) => item.id !== product.id) : [...prev, product];
			if (authUser) {
				if (isWished) {
					apiClient.delete(`/api/wishlist?productId=${product.id}`).catch((e) => console.error("[CartContext] DB wishlist delete error:", e));
				} else {
					apiClient.post("/api/wishlist", { productId: product.id }).catch((e) => console.error("[CartContext] DB wishlist add error:", e));
				}
			} else {
				localStorage.setItem("tet_guest_wishlist", JSON.stringify(updated));
			}
			return updated;
		});
	}, [authUser]);
	return /* @__PURE__ */ _jsxDEV(CartContext.Provider, {
		value: {
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
		},
		children
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 254,
		columnNumber: 9
	}, this);
};
_s(CartProvider, "jQwa4urFyWzNOclIv2OD32117Bc=", false, function() {
	return [useAuth];
});
_c2 = CartProvider;
export const useCart = () => {
	_s2();
	return useContext(CartContext);
};
_s2(useCart, "gDsCjeeItUuvgOWf1v4qoK9RF6k=");
export default CartContext;
var _c, _c2;
$RefreshReg$(_c, "CartContext");
$RefreshReg$(_c2, "CartProvider");
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;
import * as __vite_react_currentExports from "/src/context/CartContext.jsx";
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }

  const currentExports = __vite_react_currentExports;
  queueMicrotask(() => {
    RefreshRuntime.registerExportsForReactRefresh("D:/The Ethnic Touch/frontend/src/context/CartContext.jsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("D:/The Ethnic Touch/frontend/src/context/CartContext.jsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
function $RefreshReg$(type, id) { return RefreshRuntime.register(type, "D:/The Ethnic Touch/frontend/src/context/CartContext.jsx" + ' ' + id); }
function $RefreshSig$() { return RefreshRuntime.createSignatureFunctionForTransform(); }

//# sourceMappingURL=data:application/json;base64,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RCxPQUFNLE1BQUssUUFBUSxNQUFNLHdDQUF3QyxDQUFDLENBQUM7SUFDNUU7R0FDSixPQUFPO0lBQ0gsYUFBYSxRQUFRLHNCQUFzQixLQUFLLFVBQVUsT0FBTyxDQUFDO0dBQ3RFO0dBRUEsT0FBTztFQUNYLENBQUM7Q0FDTCxHQUFHLENBQUMsUUFBUSxDQUFDO0NBRWIsT0FDSSx3QkFBQyxZQUFZLFVBQWI7RUFBc0IsT0FBTztHQUN6QjtHQUNBO0dBQ0E7R0FDQTtHQUNBO0dBQ0E7R0FDQTtHQUNBO0dBQ0E7R0FDQTtFQUNKO0VBQ0s7Q0FDaUI7Ozs7O0FBRTlCOzs7OztBQUVBLE9BQU8sTUFBTSxnQkFBZ0I7O21CQUFXLFdBQVc7OztBQUVuRCxlQUFlIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIkNhcnRDb250ZXh0LmpzeCJdLCJ2ZXJzaW9uIjozLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgY3JlYXRlQ29udGV4dCwgdXNlQ29udGV4dCwgdXNlU3RhdGUsIHVzZUVmZmVjdCwgdXNlUmVmLCB1c2VDYWxsYmFjayB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZUF1dGggfSBmcm9tICcuL0F1dGhDb250ZXh0JztcbmltcG9ydCBhcGlDbGllbnQgZnJvbSAnLi4vdXRpbHMvYXBpQ2xpZW50JztcblxuY29uc3QgQ2FydENvbnRleHQgPSBjcmVhdGVDb250ZXh0KHtcbiAgICBjYXJ0OiBbXSxcbiAgICB3aXNobGlzdDogW10sXG4gICAgZGlzY291bnQ6IG51bGwsXG4gICAgYWRkVG9DYXJ0OiAoKSA9PiB7fSxcbiAgICB1cGRhdGVRdWFudGl0eTogKCkgPT4ge30sXG4gICAgcmVtb3ZlRnJvbUNhcnQ6ICgpID0+IHt9LFxuICAgIGNsZWFyQ2FydDogKCkgPT4ge30sXG4gICAgc2V0RGlzY291bnQ6ICgpID0+IHt9LFxuICAgIHRvZ2dsZVdpc2hsaXN0OiAoKSA9PiB7fSxcbiAgICB0b2FzdFByb2R1Y3Q6IG51bGxcbn0pO1xuXG5leHBvcnQgY29uc3QgQ2FydFByb3ZpZGVyID0gKHsgY2hpbGRyZW4gfSkgPT4ge1xuICAgIGNvbnN0IHsgYXV0aFVzZXIsIGF1dGhMb2FkaW5nIH0gPSB1c2VBdXRoKCk7XG5cbiAgICBjb25zdCBbY2FydCwgc2V0Q2FydF0gPSB1c2VTdGF0ZSgoKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBsb2NhbCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0ZXRfZ3Vlc3RfY2FydCcpO1xuICAgICAgICAgICAgcmV0dXJuIGxvY2FsID8gSlNPTi5wYXJzZShsb2NhbCkgOiBbXTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBbd2lzaGxpc3QsIHNldFdpc2hsaXN0XSA9IHVzZVN0YXRlKCgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGxvY2FsID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3RldF9ndWVzdF93aXNobGlzdCcpO1xuICAgICAgICAgICAgcmV0dXJuIGxvY2FsID8gSlNPTi5wYXJzZShsb2NhbCkgOiBbXTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBbZGlzY291bnQsIHNldERpc2NvdW50XSA9IHVzZVN0YXRlKG51bGwpO1xuICAgIGNvbnN0IFt0b2FzdFByb2R1Y3QsIHNldFRvYXN0UHJvZHVjdF0gPSB1c2VTdGF0ZShudWxsKTtcbiAgICBjb25zdCB0b2FzdFRpbWVyUmVmID0gdXNlUmVmKG51bGwpO1xuXG4gICAgLy8gU3luY2hyb25pemUgZ3Vlc3QgaXRlbXMgYW5kIGxvYWQgYWNjb3VudCBkYXRhIHVwb24gbG9naW5cbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBsZXQgaXNNb3VudGVkID0gdHJ1ZTtcblxuICAgICAgICBjb25zdCBzeW5jVXNlckRhdGEgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoYXV0aFVzZXIpIHtcbiAgICAgICAgICAgICAgICAvLyBNZXJnZSBndWVzdCB3aXNobGlzdFxuICAgICAgICAgICAgICAgIGNvbnN0IGxvY2FsVyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0ZXRfZ3Vlc3Rfd2lzaGxpc3QnKTtcbiAgICAgICAgICAgICAgICBpZiAobG9jYWxXKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJzZWQgPSBKU09OLnBhcnNlKGxvY2FsVyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShwYXJzZWQpICYmIHBhcnNlZC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaWRzID0gcGFyc2VkLm1hcChwID0+IHAuaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IGFwaUNsaWVudC5wb3N0KCcvYXBpL3dpc2hsaXN0L21lcmdlJywgeyBwcm9kdWN0SWRzOiBpZHMgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJbQ2FydENvbnRleHRdIFdpc2hsaXN0IG1lcmdlIGVycm9yOlwiLCBlKTtcbiAgICAgICAgICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCd0ZXRfZ3Vlc3Rfd2lzaGxpc3QnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIEZldGNoIGFjY291bnQgd2lzaGxpc3RcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpdGVtcyA9IGF3YWl0IGFwaUNsaWVudC5nZXQoJy9hcGkvd2lzaGxpc3QnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzTW91bnRlZCAmJiBBcnJheS5pc0FycmF5KGl0ZW1zKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0V2lzaGxpc3QoaXRlbXMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiW0NhcnRDb250ZXh0XSBGZXRjaCB3aXNobGlzdCBlcnJvcjpcIiwgZSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gTWVyZ2UgZ3Vlc3QgY2FydFxuICAgICAgICAgICAgICAgIGNvbnN0IGxvY2FsQyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0ZXRfZ3Vlc3RfY2FydCcpO1xuICAgICAgICAgICAgICAgIGlmIChsb2NhbEMpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhcnNlZCA9IEpTT04ucGFyc2UobG9jYWxDKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHBhcnNlZCkgJiYgcGFyc2VkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBhcGlDbGllbnQucG9zdCgnL2FwaS9jYXJ0L21lcmdlJywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtczogcGFyc2VkLm1hcChpdGVtID0+ICh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9kdWN0SWQ6IGl0ZW0uaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBxdWFudGl0eTogaXRlbS5xdWFudGl0eSB8fCAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2l6ZTogaXRlbS5zaXplIHx8ICcnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCd0ZXRfZ3Vlc3RfY2FydCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiW0NhcnRDb250ZXh0XSBDYXJ0IG1lcmdlIGVycm9yOlwiLCBlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIEZldGNoIGFjY291bnQgY2FydFxuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW1zID0gYXdhaXQgYXBpQ2xpZW50LmdldCgnL2FwaS9jYXJ0Jyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpc01vdW50ZWQgJiYgQXJyYXkuaXNBcnJheShpdGVtcykgJiYgaXRlbXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0Q2FydChpdGVtcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJbQ2FydENvbnRleHRdIEZldGNoIGNhcnQgZXJyb3I6XCIsIGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoIWF1dGhMb2FkaW5nKSB7XG4gICAgICAgICAgICBzeW5jVXNlckRhdGEoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBpc01vdW50ZWQgPSBmYWxzZTtcbiAgICAgICAgfTtcbiAgICB9LCBbYXV0aFVzZXIsIGF1dGhMb2FkaW5nXSk7XG5cbiAgICAvLyBMb2NhbCBzdG9yYWdlIHN5bmMgZm9yIGd1ZXN0IHN0YXRlXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKGNhcnQgJiYgY2FydC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndGV0X2d1ZXN0X2NhcnQnLCBKU09OLnN0cmluZ2lmeShjYXJ0KSk7XG4gICAgICAgIH1cbiAgICB9LCBbY2FydF0pO1xuXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKHdpc2hsaXN0ICYmIHdpc2hsaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0ZXRfZ3Vlc3Rfd2lzaGxpc3QnLCBKU09OLnN0cmluZ2lmeSh3aXNobGlzdCkpO1xuICAgICAgICB9XG4gICAgfSwgW3dpc2hsaXN0XSk7XG5cbiAgICAvLyBDbGVhbnVwIHRvYXN0IHRpbWVyIG9uIHVubW91bnRcbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRvYXN0VGltZXJSZWYuY3VycmVudCkge1xuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0b2FzdFRpbWVyUmVmLmN1cnJlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0sIFtdKTtcblxuICAgIGNvbnN0IGFkZFRvQ2FydCA9IHVzZUNhbGxiYWNrKChwcm9kdWN0KSA9PiB7XG4gICAgICAgIGNvbnN0IHByb2RRdHkgPSBwcm9kdWN0LnF1YW50aXR5IHx8IDE7XG4gICAgICAgIGNvbnN0IHRhcmdldFNpemUgPSBwcm9kdWN0LnNpemUgfHwgJyc7XG5cbiAgICAgICAgc2V0Q2FydChwcmV2ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nSW5kZXggPSBwcmV2LmZpbmRJbmRleChpdGVtID0+IGl0ZW0uaWQgPT09IHByb2R1Y3QuaWQgJiYgKGl0ZW0uc2l6ZSB8fCAnJykgPT09IHRhcmdldFNpemUpO1xuICAgICAgICAgICAgbGV0IHVwZGF0ZWQ7XG4gICAgICAgICAgICBsZXQgY2FsY1F0eSA9IHByb2RRdHk7XG5cbiAgICAgICAgICAgIGlmIChleGlzdGluZ0luZGV4ID4gLTEpIHtcbiAgICAgICAgICAgICAgICB1cGRhdGVkID0gWy4uLnByZXZdO1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRJdGVtID0gdXBkYXRlZFtleGlzdGluZ0luZGV4XTtcbiAgICAgICAgICAgICAgICBjYWxjUXR5ID0gKGN1cnJlbnRJdGVtLnF1YW50aXR5IHx8IDEpICsgcHJvZFF0eTtcbiAgICAgICAgICAgICAgICB1cGRhdGVkW2V4aXN0aW5nSW5kZXhdID0ge1xuICAgICAgICAgICAgICAgICAgICAuLi5jdXJyZW50SXRlbSxcbiAgICAgICAgICAgICAgICAgICAgcXVhbnRpdHk6IGNhbGNRdHlcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB1cGRhdGVkID0gWy4uLnByZXYsIHsgLi4ucHJvZHVjdCwgcXVhbnRpdHk6IHByb2RRdHkgfV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFN5bmMgd2l0aCBiYWNrZW5kIGFzeW5jIChvdXRzaWRlIHN0YXRlIHVwZGF0ZXIgYmxvY2spXG4gICAgICAgICAgICBpZiAoYXV0aFVzZXIpIHtcbiAgICAgICAgICAgICAgICBhcGlDbGllbnQucG9zdCgnL2FwaS9jYXJ0Jywge1xuICAgICAgICAgICAgICAgICAgICBwcm9kdWN0SWQ6IHByb2R1Y3QuaWQsXG4gICAgICAgICAgICAgICAgICAgIHF1YW50aXR5OiBjYWxjUXR5LFxuICAgICAgICAgICAgICAgICAgICBzaXplOiB0YXJnZXRTaXplXG4gICAgICAgICAgICAgICAgfSkuY2F0Y2goZSA9PiBjb25zb2xlLmVycm9yKFwiW0NhcnRDb250ZXh0XSBEQiBjYXJ0IGFkZCBlcnJvcjpcIiwgZSkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndGV0X2d1ZXN0X2NhcnQnLCBKU09OLnN0cmluZ2lmeSh1cGRhdGVkKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB1cGRhdGVkO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBUcmlnZ2VyIG5vdGlmaWNhdGlvbiB0b2FzdFxuICAgICAgICBpZiAodG9hc3RUaW1lclJlZi5jdXJyZW50KSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodG9hc3RUaW1lclJlZi5jdXJyZW50KTtcbiAgICAgICAgfVxuICAgICAgICBzZXRUb2FzdFByb2R1Y3QocHJvZHVjdCk7XG4gICAgICAgIHRvYXN0VGltZXJSZWYuY3VycmVudCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgc2V0VG9hc3RQcm9kdWN0KG51bGwpO1xuICAgICAgICB9LCA1NTAwKTtcbiAgICB9LCBbYXV0aFVzZXJdKTtcblxuICAgIGNvbnN0IHVwZGF0ZVF1YW50aXR5ID0gdXNlQ2FsbGJhY2soKGlkLCBzaXplLCBkZWx0YSkgPT4ge1xuICAgICAgICBzZXRDYXJ0KHByZXYgPT4ge1xuICAgICAgICAgICAgY29uc3QgdXBkYXRlZCA9IHByZXYubWFwKGl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgIGlmIChpdGVtLmlkID09PSBpZCAmJiAoaXRlbS5zaXplIHx8ICcnKSA9PT0gKHNpemUgfHwgJycpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld1F0eSA9IChpdGVtLnF1YW50aXR5IHx8IDEpICsgZGVsdGE7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXdRdHkgPiAwID8geyAuLi5pdGVtLCBxdWFudGl0eTogbmV3UXR5IH0gOiBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbTtcbiAgICAgICAgICAgIH0pLmZpbHRlcihCb29sZWFuKTtcblxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0SXRlbSA9IHVwZGF0ZWQuZmluZChpdGVtID0+IGl0ZW0uaWQgPT09IGlkICYmIChpdGVtLnNpemUgfHwgJycpID09PSAoc2l6ZSB8fCAnJykpO1xuICAgICAgICAgICAgaWYgKGF1dGhVc2VyICYmIHRhcmdldEl0ZW0pIHtcbiAgICAgICAgICAgICAgICBhcGlDbGllbnQucG9zdCgnL2FwaS9jYXJ0Jywge1xuICAgICAgICAgICAgICAgICAgICBwcm9kdWN0SWQ6IGlkLFxuICAgICAgICAgICAgICAgICAgICBxdWFudGl0eTogdGFyZ2V0SXRlbS5xdWFudGl0eSxcbiAgICAgICAgICAgICAgICAgICAgc2l6ZTogc2l6ZSB8fCAnJ1xuICAgICAgICAgICAgICAgIH0pLmNhdGNoKGUgPT4gY29uc29sZS5lcnJvcihcIltDYXJ0Q29udGV4dF0gREIgY2FydCB1cGRhdGUgZXJyb3I6XCIsIGUpKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIWF1dGhVc2VyKSB7XG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3RldF9ndWVzdF9jYXJ0JywgSlNPTi5zdHJpbmdpZnkodXBkYXRlZCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdXBkYXRlZDtcbiAgICAgICAgfSk7XG4gICAgfSwgW2F1dGhVc2VyXSk7XG5cbiAgICBjb25zdCByZW1vdmVGcm9tQ2FydCA9IHVzZUNhbGxiYWNrKChpZCwgc2l6ZSkgPT4ge1xuICAgICAgICBzZXRDYXJ0KHByZXYgPT4ge1xuICAgICAgICAgICAgY29uc3QgdXBkYXRlZCA9IHByZXYuZmlsdGVyKGl0ZW0gPT4gIShpdGVtLmlkID09PSBpZCAmJiAoaXRlbS5zaXplIHx8ICcnKSA9PT0gKHNpemUgfHwgJycpKSk7XG4gICAgICAgICAgICBpZiAoYXV0aFVzZXIpIHtcbiAgICAgICAgICAgICAgICBhcGlDbGllbnQuZGVsZXRlKGAvYXBpL2NhcnQ/cHJvZHVjdElkPSR7aWR9JnNpemU9JHtzaXplIHx8ICcnfWApXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaChlID0+IGNvbnNvbGUuZXJyb3IoXCJbQ2FydENvbnRleHRdIERCIGNhcnQgZGVsZXRlIGVycm9yOlwiLCBlKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0ZXRfZ3Vlc3RfY2FydCcsIEpTT04uc3RyaW5naWZ5KHVwZGF0ZWQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB1cGRhdGVkO1xuICAgICAgICB9KTtcbiAgICB9LCBbYXV0aFVzZXJdKTtcblxuICAgIGNvbnN0IGNsZWFyQ2FydCA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICAgICAgc2V0Q2FydChbXSk7XG4gICAgICAgIHNldERpc2NvdW50KG51bGwpO1xuICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgndGV0X2d1ZXN0X2NhcnQnKTtcbiAgICAgICAgaWYgKGF1dGhVc2VyKSB7XG4gICAgICAgICAgICBhcGlDbGllbnQuZGVsZXRlKCcvYXBpL2NhcnQnKS5jYXRjaChlID0+IGNvbnNvbGUuZXJyb3IoXCJbQ2FydENvbnRleHRdIENsZWFyIGNhcnQgZXJyb3I6XCIsIGUpKTtcbiAgICAgICAgfVxuICAgIH0sIFthdXRoVXNlcl0pO1xuXG4gICAgY29uc3QgdG9nZ2xlV2lzaGxpc3QgPSB1c2VDYWxsYmFjayhhc3luYyAocHJvZHVjdCkgPT4ge1xuICAgICAgICBzZXRXaXNobGlzdChwcmV2ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGlzV2lzaGVkID0gcHJldi5zb21lKGl0ZW0gPT4gaXRlbS5pZCA9PT0gcHJvZHVjdC5pZCk7XG4gICAgICAgICAgICBjb25zdCB1cGRhdGVkID0gaXNXaXNoZWRcbiAgICAgICAgICAgICAgICA/IHByZXYuZmlsdGVyKGl0ZW0gPT4gaXRlbS5pZCAhPT0gcHJvZHVjdC5pZClcbiAgICAgICAgICAgICAgICA6IFsuLi5wcmV2LCBwcm9kdWN0XTtcblxuICAgICAgICAgICAgaWYgKGF1dGhVc2VyKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzV2lzaGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGFwaUNsaWVudC5kZWxldGUoYC9hcGkvd2lzaGxpc3Q/cHJvZHVjdElkPSR7cHJvZHVjdC5pZH1gKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGUgPT4gY29uc29sZS5lcnJvcihcIltDYXJ0Q29udGV4dF0gREIgd2lzaGxpc3QgZGVsZXRlIGVycm9yOlwiLCBlKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYXBpQ2xpZW50LnBvc3QoJy9hcGkvd2lzaGxpc3QnLCB7IHByb2R1Y3RJZDogcHJvZHVjdC5pZCB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGUgPT4gY29uc29sZS5lcnJvcihcIltDYXJ0Q29udGV4dF0gREIgd2lzaGxpc3QgYWRkIGVycm9yOlwiLCBlKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndGV0X2d1ZXN0X3dpc2hsaXN0JywgSlNPTi5zdHJpbmdpZnkodXBkYXRlZCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdXBkYXRlZDtcbiAgICAgICAgfSk7XG4gICAgfSwgW2F1dGhVc2VyXSk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8Q2FydENvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3tcbiAgICAgICAgICAgIGNhcnQsXG4gICAgICAgICAgICB3aXNobGlzdCxcbiAgICAgICAgICAgIGRpc2NvdW50LFxuICAgICAgICAgICAgYWRkVG9DYXJ0LFxuICAgICAgICAgICAgdXBkYXRlUXVhbnRpdHksXG4gICAgICAgICAgICByZW1vdmVGcm9tQ2FydCxcbiAgICAgICAgICAgIGNsZWFyQ2FydCxcbiAgICAgICAgICAgIHNldERpc2NvdW50LFxuICAgICAgICAgICAgdG9nZ2xlV2lzaGxpc3QsXG4gICAgICAgICAgICB0b2FzdFByb2R1Y3RcbiAgICAgICAgfX0+XG4gICAgICAgICAgICB7Y2hpbGRyZW59XG4gICAgICAgIDwvQ2FydENvbnRleHQuUHJvdmlkZXI+XG4gICAgKTtcbn07XG5cbmV4cG9ydCBjb25zdCB1c2VDYXJ0ID0gKCkgPT4gdXNlQ29udGV4dChDYXJ0Q29udGV4dCk7XG5cbmV4cG9ydCBkZWZhdWx0IENhcnRDb250ZXh0O1xuIl19