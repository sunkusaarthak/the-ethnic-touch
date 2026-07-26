import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/App.jsx");const React = __vite__cjsImport0_react; const useState = __vite__cjsImport0_react["useState"]; const useEffect = __vite__cjsImport0_react["useEffect"]; const useRef = __vite__cjsImport0_react["useRef"]; const useMemo = __vite__cjsImport0_react["useMemo"]; const useCallback = __vite__cjsImport0_react["useCallback"];const _jsxDEV = __vite__cjsImport20_react_jsxDevRuntime["jsxDEV"];import __vite__cjsImport0_react from "/node_modules/.vite/deps/react.js?v=42a9b196";
import { useNavigate, Link, useLocation, useParams, Routes, Route, Navigate, HashRouter } from "/node_modules/.vite/deps/react-router-dom.js?v=42a9b196";
import Footer from "/src/components/Footer.jsx";
import Navbar from "/src/components/Navbar.jsx";
import ScrollToTop from "/src/components/ScrollToTop.jsx";
import ErrorBoundary from "/src/components/ErrorBoundary.jsx";
import Auth from "/src/pages/Auth.jsx";
import Cart from "/src/pages/Cart.jsx";
import Checkout from "/src/pages/Checkout.jsx";
import CheckoutSuccess from "/src/pages/CheckoutSuccess.jsx";
import Home from "/src/pages/Home.jsx";
import ProductDetails from "/src/pages/ProductDetails.jsx";
import ProfilePage from "/src/pages/ProfilePage.jsx";
import Shop from "/src/pages/Shop.jsx";
import WishlistPage from "/src/pages/WishlistPage.jsx";
import { fallbackProducts, API_BASE_URL } from "/src/data/config.jsx";
import apiClient from "/src/utils/apiClient.js";
import { AuthProvider, useAuth } from "/src/context/AuthContext.jsx";
import { AlertProvider, useAlert } from "/src/context/AlertContext.jsx";
import { CartProvider, useCart } from "/src/context/CartContext.jsx";
var _jsxFileName = "D:/The Ethnic Touch/frontend/src/App.jsx";
import __vite__cjsImport20_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=42a9b196";
var _s = $RefreshSig$(), _s2 = $RefreshSig$();
const AppFooterWrapper = () => {
	_s();
	const location = useLocation();
	if (location.pathname === "/auth") return null;
	return /* @__PURE__ */ _jsxDEV(Footer, {}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 26,
		columnNumber: 12
	}, this);
};
_s(AppFooterWrapper, "pkHmaVRPskBaU4tMJuJJpV42k1I=", false, function() {
	return [useLocation];
});
_c = AppFooterWrapper;
const AppRoutesContent = () => {
	_s2();
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [globalSearch, setGlobalSearch] = useState("");
	const { authUser, authLoading } = useAuth();
	const { cart, wishlist, addToCart, updateQuantity, removeFromCart, clearCart, discount, setDiscount, toggleWishlist, toastProduct } = useCart();
	const { showAlert, closeAlert } = useAlert();
	useEffect(() => {
		apiClient.get("/api/products").then((data) => {
			if (Array.isArray(data)) {
				setProducts(data);
			} else {
				setProducts(fallbackProducts);
			}
			setLoading(false);
		}).catch((err) => {
			setProducts(fallbackProducts);
			setLoading(false);
		});
	}, []);
	const handleSearchSubmit = (q) => {
		setGlobalSearch(q);
		if (window.location.hash !== "#/shop") {
			window.location.hash = "#/shop";
		}
	};
	const cartCount = (cart || []).reduce((sum, item) => sum + (item.quantity || 1), 0);
	return /* @__PURE__ */ _jsxDEV(HashRouter, { children: [
		/* @__PURE__ */ _jsxDEV(ScrollToTop, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 76,
			columnNumber: 13
		}, this),
		/* @__PURE__ */ _jsxDEV(Navbar, {
			products,
			cartCount,
			wishlistCount: (wishlist || []).length,
			authUser,
			authLoading,
			onSearchSubmit: handleSearchSubmit,
			globalSearch,
			setGlobalSearch
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 77,
			columnNumber: 13
		}, this),
		/* @__PURE__ */ _jsxDEV(Routes, { children: [
			/* @__PURE__ */ _jsxDEV(Route, {
				path: "/",
				element: /* @__PURE__ */ _jsxDEV(Home, {
					productsGlobal: products,
					wishlist,
					toggleWishlist
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 91,
					columnNumber: 25
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 88,
				columnNumber: 17
			}, this),
			/* @__PURE__ */ _jsxDEV(Route, {
				path: "/shop",
				element: /* @__PURE__ */ _jsxDEV(Shop, {
					productsGlobal: products,
					wishlist,
					toggleWishlist,
					globalSearch,
					setGlobalSearch
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 101,
					columnNumber: 25
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 98,
				columnNumber: 17
			}, this),
			/* @__PURE__ */ _jsxDEV(Route, {
				path: "/product/:id",
				element: /* @__PURE__ */ _jsxDEV(ProductDetails, {
					products,
					addToCart,
					wishlist,
					toggleWishlist,
					authUser
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 111,
					columnNumber: 53
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 111,
				columnNumber: 17
			}, this),
			/* @__PURE__ */ _jsxDEV(Route, {
				path: "/cart",
				element: /* @__PURE__ */ _jsxDEV(Cart, {
					cart,
					updateQuantity,
					removeFromCart,
					onApplyCoupon: setDiscount,
					discount,
					authUser
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 112,
					columnNumber: 46
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 112,
				columnNumber: 17
			}, this),
			/* @__PURE__ */ _jsxDEV(Route, {
				path: "/checkout",
				element: /* @__PURE__ */ _jsxDEV(Checkout, {
					cart,
					discount,
					clearCart,
					authUser,
					authLoading
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 115,
					columnNumber: 30
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 113,
				columnNumber: 17
			}, this),
			/* @__PURE__ */ _jsxDEV(Route, {
				path: "/checkout-success",
				element: /* @__PURE__ */ _jsxDEV(CheckoutSuccess, {}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 117,
					columnNumber: 58
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 117,
				columnNumber: 17
			}, this),
			/* @__PURE__ */ _jsxDEV(Route, {
				path: "/profile",
				element: /* @__PURE__ */ _jsxDEV(ProfilePage, { authUser }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 118,
					columnNumber: 49
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 118,
				columnNumber: 17
			}, this),
			/* @__PURE__ */ _jsxDEV(Route, {
				path: "/auth",
				element: /* @__PURE__ */ _jsxDEV(Auth, {}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 119,
					columnNumber: 46
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 119,
				columnNumber: 17
			}, this),
			/* @__PURE__ */ _jsxDEV(Route, {
				path: "/wishlist",
				element: /* @__PURE__ */ _jsxDEV(WishlistPage, {
					wishlist,
					toggleWishlist,
					addToCart
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 123,
					columnNumber: 25
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 120,
				columnNumber: 17
			}, this)
		] }, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 87,
			columnNumber: 13
		}, this),
		/* @__PURE__ */ _jsxDEV(AppFooterWrapper, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 131,
			columnNumber: 13
		}, this),
		toastProduct && /* @__PURE__ */ _jsxDEV("div", {
			className: "cart-success-notification show",
			children: [/* @__PURE__ */ _jsxDEV("div", {
				style: {
					display: "flex",
					gap: "1.2rem",
					alignItems: "flex-start",
					marginBottom: "1.2rem"
				},
				children: [
					/* @__PURE__ */ _jsxDEV("div", {
						style: {
							width: "60px",
							height: "80px",
							borderRadius: "6px",
							overflow: "hidden",
							flexShrink: 0,
							boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
						},
						children: /* @__PURE__ */ _jsxDEV("img", {
							src: toastProduct.imageUrl,
							alt: toastProduct.name,
							style: {
								width: "100%",
								height: "100%",
								objectFit: "cover"
							}
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 138,
							columnNumber: 29
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 137,
						columnNumber: 25
					}, this),
					/* @__PURE__ */ _jsxDEV("div", {
						style: { flex: 1 },
						children: [
							/* @__PURE__ */ _jsxDEV("div", {
								style: {
									fontSize: "0.75rem",
									color: "var(--color-primary)",
									fontWeight: "700",
									textTransform: "uppercase",
									letterSpacing: "1.2px",
									marginBottom: "4px"
								},
								children: "✓ Added to Wardrobe"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 141,
								columnNumber: 29
							}, this),
							/* @__PURE__ */ _jsxDEV("h4", {
								style: {
									margin: 0,
									fontSize: "0.95rem",
									fontWeight: "600",
									color: "var(--color-text)",
									lineHeight: "1.4"
								},
								children: toastProduct.name
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 144,
								columnNumber: 29
							}, this),
							/* @__PURE__ */ _jsxDEV("div", {
								style: {
									fontSize: "0.85rem",
									color: "#686461",
									marginTop: "3px"
								},
								children: [
									"Size: ",
									/* @__PURE__ */ _jsxDEV("strong", {
										style: { color: "var(--color-text)" },
										children: toastProduct.size || "Standard"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 146,
										columnNumber: 39
									}, this),
									" • ₹",
									toastProduct.price.toLocaleString("en-IN")
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 145,
								columnNumber: 29
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 140,
						columnNumber: 25
					}, this),
					/* @__PURE__ */ _jsxDEV("button", {
						style: {
							background: "none",
							border: "none",
							fontSize: "1.4rem",
							cursor: "pointer",
							color: "#ccc",
							padding: 0,
							lineHeight: 0
						},
						"aria-label": "Close notification",
						children: "×"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 149,
						columnNumber: 25
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 136,
				columnNumber: 21
			}, this), /* @__PURE__ */ _jsxDEV("div", {
				style: {
					display: "flex",
					gap: "0.65rem",
					alignItems: "center"
				},
				children: [/* @__PURE__ */ _jsxDEV("button", {
					style: {
						flex: 1,
						height: "40px",
						padding: "0 0.85rem",
						fontSize: "0.8rem",
						background: "#FAF7F4",
						color: "#5C5853",
						border: "1px solid rgba(212, 163, 115, 0.35)",
						borderRadius: "50px",
						cursor: "pointer",
						fontWeight: "500",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						whiteSpace: "nowrap",
						boxSizing: "border-box"
					},
					children: "Continue Shopping"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 158,
					columnNumber: 25
				}, this), /* @__PURE__ */ _jsxDEV("a", {
					href: "#/cart",
					style: {
						flex: 1,
						height: "40px",
						padding: "0 0.85rem",
						fontSize: "0.82rem",
						background: "linear-gradient(135deg, #D4A373 0%, #C49363 100%)",
						color: "#FFF",
						border: "none",
						borderRadius: "50px",
						fontWeight: "600",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						textDecoration: "none",
						boxShadow: "0 4px 12px rgba(212, 163, 115, 0.25)",
						whiteSpace: "nowrap",
						boxSizing: "border-box"
					},
					children: "Checkout →"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 179,
					columnNumber: 25
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 157,
				columnNumber: 21
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 135,
			columnNumber: 17
		}, this)
	] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 75,
		columnNumber: 9
	}, this);
};
_s2(AppRoutesContent, "NAvsHVcXGDTcLaK9WQDlqCTY0XA=", false, function() {
	return [
		useAuth,
		useCart,
		useAlert
	];
});
_c2 = AppRoutesContent;
const App = () => {
	return /* @__PURE__ */ _jsxDEV(ErrorBoundary, { children: /* @__PURE__ */ _jsxDEV(AuthProvider, { children: /* @__PURE__ */ _jsxDEV(AlertProvider, { children: /* @__PURE__ */ _jsxDEV(CartProvider, { children: /* @__PURE__ */ _jsxDEV(AppRoutesContent, {}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 215,
		columnNumber: 25
	}, this) }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 214,
		columnNumber: 21
	}, this) }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 213,
		columnNumber: 17
	}, this) }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 212,
		columnNumber: 13
	}, this) }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 211,
		columnNumber: 9
	}, this);
};
_c3 = App;
export default App;
var _c, _c2, _c3;
$RefreshReg$(_c, "AppFooterWrapper");
$RefreshReg$(_c2, "AppRoutesContent");
$RefreshReg$(_c3, "App");
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;
import * as __vite_react_currentExports from "/src/App.jsx";
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }

  const currentExports = __vite_react_currentExports;
  queueMicrotask(() => {
    RefreshRuntime.registerExportsForReactRefresh("D:/The Ethnic Touch/frontend/src/App.jsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("D:/The Ethnic Touch/frontend/src/App.jsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
function $RefreshReg$(type, id) { return RefreshRuntime.register(type, "D:/The Ethnic Touch/frontend/src/App.jsx" + ' ' + id); }
function $RefreshSig$() { return RefreshRuntime.createSignatureFunctionForTransform(); }

//# sourceMappingURL=data:application/json;base64,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QUVFOzs7O1lBQ0Y7Ozs7O1dBQ0o7Ozs7OztDQUVEOzs7OztBQUVwQjs7Ozs7Ozs7O0FBRUEsTUFBTSxZQUFZO0NBQ2QsT0FDSSx3QkFBQyxlQUFELFlBQ0ksd0JBQUMsY0FBRCxZQUNJLHdCQUFDLGVBQUQsWUFDSSx3QkFBQyxjQUFELFlBQ0ksd0JBQUMsa0JBQUQsQ0FBbUI7Ozs7VUFDVDs7OztVQUNIOzs7O1VBQ0w7Ozs7VUFDSDs7Ozs7QUFFdkI7O0FBRUEsZUFBZSIsIm5hbWVzIjpbXSwic291cmNlcyI6WyJBcHAuanN4Il0sInZlcnNpb24iOjMsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0LCB1c2VSZWYsIHVzZU1lbW8sIHVzZUNhbGxiYWNrIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlTmF2aWdhdGUsIExpbmssIHVzZUxvY2F0aW9uLCB1c2VQYXJhbXMsIFJvdXRlcywgUm91dGUsIE5hdmlnYXRlLCBIYXNoUm91dGVyIH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSc7XG5pbXBvcnQgRm9vdGVyIGZyb20gJy4vY29tcG9uZW50cy9Gb290ZXInO1xuaW1wb3J0IE5hdmJhciBmcm9tICcuL2NvbXBvbmVudHMvTmF2YmFyJztcbmltcG9ydCBTY3JvbGxUb1RvcCBmcm9tICcuL2NvbXBvbmVudHMvU2Nyb2xsVG9Ub3AnO1xuaW1wb3J0IEVycm9yQm91bmRhcnkgZnJvbSAnLi9jb21wb25lbnRzL0Vycm9yQm91bmRhcnknO1xuaW1wb3J0IEF1dGggZnJvbSAnLi9wYWdlcy9BdXRoJztcbmltcG9ydCBDYXJ0IGZyb20gJy4vcGFnZXMvQ2FydCc7XG5pbXBvcnQgQ2hlY2tvdXQgZnJvbSAnLi9wYWdlcy9DaGVja291dCc7XG5pbXBvcnQgQ2hlY2tvdXRTdWNjZXNzIGZyb20gJy4vcGFnZXMvQ2hlY2tvdXRTdWNjZXNzJztcbmltcG9ydCBIb21lIGZyb20gJy4vcGFnZXMvSG9tZSc7XG5pbXBvcnQgUHJvZHVjdERldGFpbHMgZnJvbSAnLi9wYWdlcy9Qcm9kdWN0RGV0YWlscyc7XG5pbXBvcnQgUHJvZmlsZVBhZ2UgZnJvbSAnLi9wYWdlcy9Qcm9maWxlUGFnZSc7XG5pbXBvcnQgU2hvcCBmcm9tICcuL3BhZ2VzL1Nob3AnO1xuaW1wb3J0IFdpc2hsaXN0UGFnZSBmcm9tICcuL3BhZ2VzL1dpc2hsaXN0UGFnZSc7XG5pbXBvcnQgeyBmYWxsYmFja1Byb2R1Y3RzLCBBUElfQkFTRV9VUkwgfSBmcm9tICcuL2RhdGEvY29uZmlnJztcbmltcG9ydCBhcGlDbGllbnQgZnJvbSAnLi91dGlscy9hcGlDbGllbnQnO1xuXG5pbXBvcnQgeyBBdXRoUHJvdmlkZXIsIHVzZUF1dGggfSBmcm9tICcuL2NvbnRleHQvQXV0aENvbnRleHQnO1xuaW1wb3J0IHsgQWxlcnRQcm92aWRlciwgdXNlQWxlcnQgfSBmcm9tICcuL2NvbnRleHQvQWxlcnRDb250ZXh0JztcbmltcG9ydCB7IENhcnRQcm92aWRlciwgdXNlQ2FydCB9IGZyb20gJy4vY29udGV4dC9DYXJ0Q29udGV4dCc7XG5cbmNvbnN0IEFwcEZvb3RlcldyYXBwZXIgPSAoKSA9PiB7XG4gICAgY29uc3QgbG9jYXRpb24gPSB1c2VMb2NhdGlvbigpO1xuICAgIGlmIChsb2NhdGlvbi5wYXRobmFtZSA9PT0gJy9hdXRoJykgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIDxGb290ZXIgLz47XG59O1xuXG5jb25zdCBBcHBSb3V0ZXNDb250ZW50ID0gKCkgPT4ge1xuICAgIGNvbnN0IFtwcm9kdWN0cywgc2V0UHJvZHVjdHNdID0gdXNlU3RhdGUoW10pO1xuICAgIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVzZVN0YXRlKHRydWUpO1xuICAgIGNvbnN0IFtnbG9iYWxTZWFyY2gsIHNldEdsb2JhbFNlYXJjaF0gPSB1c2VTdGF0ZSgnJyk7XG5cbiAgICBjb25zdCB7IGF1dGhVc2VyLCBhdXRoTG9hZGluZyB9ID0gdXNlQXV0aCgpO1xuICAgIGNvbnN0IHsgXG4gICAgICAgIGNhcnQsIFxuICAgICAgICB3aXNobGlzdCwgXG4gICAgICAgIGFkZFRvQ2FydCwgXG4gICAgICAgIHVwZGF0ZVF1YW50aXR5LCBcbiAgICAgICAgcmVtb3ZlRnJvbUNhcnQsIFxuICAgICAgICBjbGVhckNhcnQsIFxuICAgICAgICBkaXNjb3VudCwgXG4gICAgICAgIHNldERpc2NvdW50LCBcbiAgICAgICAgdG9nZ2xlV2lzaGxpc3QsIFxuICAgICAgICB0b2FzdFByb2R1Y3QgXG4gICAgfSA9IHVzZUNhcnQoKTtcbiAgICBjb25zdCB7IHNob3dBbGVydCwgY2xvc2VBbGVydCB9ID0gdXNlQWxlcnQoKTtcblxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGFwaUNsaWVudC5nZXQoJy9hcGkvcHJvZHVjdHMnKVxuICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0UHJvZHVjdHMoZGF0YSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0UHJvZHVjdHMoZmFsbGJhY2tQcm9kdWN0cyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgICAgIHNldFByb2R1Y3RzKGZhbGxiYWNrUHJvZHVjdHMpO1xuICAgICAgICAgICAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgfSwgW10pO1xuXG4gICAgY29uc3QgaGFuZGxlU2VhcmNoU3VibWl0ID0gKHEpID0+IHtcbiAgICAgICAgc2V0R2xvYmFsU2VhcmNoKHEpO1xuICAgICAgICBpZiAod2luZG93LmxvY2F0aW9uLmhhc2ggIT09IFwiIy9zaG9wXCIpIHtcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gXCIjL3Nob3BcIjtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCBjYXJ0Q291bnQgPSAoY2FydCB8fCBbXSkucmVkdWNlKChzdW0sIGl0ZW0pID0+IHN1bSArIChpdGVtLnF1YW50aXR5IHx8IDEpLCAwKTtcblxuICAgIHJldHVybiAoXG4gICAgICAgIDxIYXNoUm91dGVyPlxuICAgICAgICAgICAgPFNjcm9sbFRvVG9wIC8+XG4gICAgICAgICAgICA8TmF2YmFyIFxuICAgICAgICAgICAgICAgIHByb2R1Y3RzPXtwcm9kdWN0c31cbiAgICAgICAgICAgICAgICBjYXJ0Q291bnQ9e2NhcnRDb3VudH0gXG4gICAgICAgICAgICAgICAgd2lzaGxpc3RDb3VudD17KHdpc2hsaXN0IHx8IFtdKS5sZW5ndGh9IFxuICAgICAgICAgICAgICAgIGF1dGhVc2VyPXthdXRoVXNlcn0gXG4gICAgICAgICAgICAgICAgYXV0aExvYWRpbmc9e2F1dGhMb2FkaW5nfSBcbiAgICAgICAgICAgICAgICBvblNlYXJjaFN1Ym1pdD17aGFuZGxlU2VhcmNoU3VibWl0fVxuICAgICAgICAgICAgICAgIGdsb2JhbFNlYXJjaD17Z2xvYmFsU2VhcmNofVxuICAgICAgICAgICAgICAgIHNldEdsb2JhbFNlYXJjaD17c2V0R2xvYmFsU2VhcmNofVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxSb3V0ZXM+XG4gICAgICAgICAgICAgICAgPFJvdXRlIFxuICAgICAgICAgICAgICAgICAgICBwYXRoPVwiL1wiIFxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50PXtcbiAgICAgICAgICAgICAgICAgICAgICAgIDxIb21lIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2R1Y3RzR2xvYmFsPXtwcm9kdWN0c31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXNobGlzdD17d2lzaGxpc3R9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9nZ2xlV2lzaGxpc3Q9e3RvZ2dsZVdpc2hsaXN0fVxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgfSBcbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDxSb3V0ZSBcbiAgICAgICAgICAgICAgICAgICAgcGF0aD1cIi9zaG9wXCIgXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQ9e1xuICAgICAgICAgICAgICAgICAgICAgICAgPFNob3AgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvZHVjdHNHbG9iYWw9e3Byb2R1Y3RzfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpc2hsaXN0PXt3aXNobGlzdH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2dnbGVXaXNobGlzdD17dG9nZ2xlV2lzaGxpc3R9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2xvYmFsU2VhcmNoPXtnbG9iYWxTZWFyY2h9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0R2xvYmFsU2VhcmNoPXtzZXRHbG9iYWxTZWFyY2h9XG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICB9IFxuICAgICAgICAgICAgICAgIC8+XG5cbiAgICAgICAgICAgICAgICA8Um91dGUgcGF0aD1cIi9wcm9kdWN0LzppZFwiIGVsZW1lbnQ9ezxQcm9kdWN0RGV0YWlscyBwcm9kdWN0cz17cHJvZHVjdHN9IGFkZFRvQ2FydD17YWRkVG9DYXJ0fSB3aXNobGlzdD17d2lzaGxpc3R9IHRvZ2dsZVdpc2hsaXN0PXt0b2dnbGVXaXNobGlzdH0gYXV0aFVzZXI9e2F1dGhVc2VyfSAvPn0gLz5cbiAgICAgICAgICAgICAgICA8Um91dGUgcGF0aD1cIi9jYXJ0XCIgZWxlbWVudD17PENhcnQgY2FydD17Y2FydH0gdXBkYXRlUXVhbnRpdHk9e3VwZGF0ZVF1YW50aXR5fSByZW1vdmVGcm9tQ2FydD17cmVtb3ZlRnJvbUNhcnR9IG9uQXBwbHlDb3Vwb249e3NldERpc2NvdW50fSBkaXNjb3VudD17ZGlzY291bnR9IGF1dGhVc2VyPXthdXRoVXNlcn0gLz59IC8+XG4gICAgICAgICAgICAgICAgPFJvdXRlIFxuICAgICAgICAgICAgICAgICAgICBwYXRoPVwiL2NoZWNrb3V0XCIgXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQ9ezxDaGVja291dCBjYXJ0PXtjYXJ0fSBkaXNjb3VudD17ZGlzY291bnR9IGNsZWFyQ2FydD17Y2xlYXJDYXJ0fSBhdXRoVXNlcj17YXV0aFVzZXJ9IGF1dGhMb2FkaW5nPXthdXRoTG9hZGluZ30gLz59IFxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPFJvdXRlIHBhdGg9XCIvY2hlY2tvdXQtc3VjY2Vzc1wiIGVsZW1lbnQ9ezxDaGVja291dFN1Y2Nlc3MgLz59IC8+XG4gICAgICAgICAgICAgICAgPFJvdXRlIHBhdGg9XCIvcHJvZmlsZVwiIGVsZW1lbnQ9ezxQcm9maWxlUGFnZSBhdXRoVXNlcj17YXV0aFVzZXJ9IC8+fSAvPlxuICAgICAgICAgICAgICAgIDxSb3V0ZSBwYXRoPVwiL2F1dGhcIiBlbGVtZW50PXs8QXV0aCAvPn0gLz5cbiAgICAgICAgICAgICAgICA8Um91dGUgXG4gICAgICAgICAgICAgICAgICAgIHBhdGg9XCIvd2lzaGxpc3RcIiBcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudD17XG4gICAgICAgICAgICAgICAgICAgICAgICA8V2lzaGxpc3RQYWdlIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpc2hsaXN0PXt3aXNobGlzdH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2dnbGVXaXNobGlzdD17dG9nZ2xlV2lzaGxpc3R9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkVG9DYXJ0PXthZGRUb0NhcnR9XG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICB9IFxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L1JvdXRlcz5cbiAgICAgICAgICAgIDxBcHBGb290ZXJXcmFwcGVyIC8+XG5cbiAgICAgICAgICAgIHsvKiBQcmVtaXVtIFRvYXN0IERyYXdlciBOb3RpZmljYXRpb24gKi99XG4gICAgICAgICAgICB7dG9hc3RQcm9kdWN0ICYmIChcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcnQtc3VjY2Vzcy1ub3RpZmljYXRpb24gc2hvd1wiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgZ2FwOiAnMS4ycmVtJywgYWxpZ25JdGVtczogJ2ZsZXgtc3RhcnQnLCBtYXJnaW5Cb3R0b206ICcxLjJyZW0nIH19PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyB3aWR0aDogJzYwcHgnLCBoZWlnaHQ6ICc4MHB4JywgYm9yZGVyUmFkaXVzOiAnNnB4Jywgb3ZlcmZsb3c6ICdoaWRkZW4nLCBmbGV4U2hyaW5rOiAwLCBib3hTaGFkb3c6ICcwIDRweCAxMHB4IHJnYmEoMCwwLDAsMC4wNSknIH19PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPXt0b2FzdFByb2R1Y3QuaW1hZ2VVcmx9IGFsdD17dG9hc3RQcm9kdWN0Lm5hbWV9IHN0eWxlPXt7IHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnLCBvYmplY3RGaXQ6ICdjb3ZlcicgfX0gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBmbGV4OiAxIH19PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZm9udFNpemU6ICcwLjc1cmVtJywgY29sb3I6ICd2YXIoLS1jb2xvci1wcmltYXJ5KScsIGZvbnRXZWlnaHQ6ICc3MDAnLCB0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJywgbGV0dGVyU3BhY2luZzogJzEuMnB4JywgbWFyZ2luQm90dG9tOiAnNHB4JyB9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg4pyTIEFkZGVkIHRvIFdhcmRyb2JlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGg0IHN0eWxlPXt7IG1hcmdpbjogMCwgZm9udFNpemU6ICcwLjk1cmVtJywgZm9udFdlaWdodDogJzYwMCcsIGNvbG9yOiAndmFyKC0tY29sb3ItdGV4dCknLCBsaW5lSGVpZ2h0OiAnMS40JyB9fT57dG9hc3RQcm9kdWN0Lm5hbWV9PC9oND5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGZvbnRTaXplOiAnMC44NXJlbScsIGNvbG9yOiAnIzY4NjQ2MScsIG1hcmdpblRvcDogJzNweCcgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNpemU6IDxzdHJvbmcgc3R5bGU9e3tjb2xvcjondmFyKC0tY29sb3ItdGV4dCknfX0+e3RvYXN0UHJvZHVjdC5zaXplIHx8ICdTdGFuZGFyZCd9PC9zdHJvbmc+ICZidWxsOyDigrl7dG9hc3RQcm9kdWN0LnByaWNlLnRvTG9jYWxlU3RyaW5nKCdlbi1JTicpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IGJhY2tncm91bmQ6ICdub25lJywgYm9yZGVyOiAnbm9uZScsIGZvbnRTaXplOiAnMS40cmVtJywgY3Vyc29yOiAncG9pbnRlcicsIGNvbG9yOiAnI2NjYycsIHBhZGRpbmc6IDAsIGxpbmVIZWlnaHQ6IDAgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPVwiQ2xvc2Ugbm90aWZpY2F0aW9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmdGltZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgZ2FwOiAnMC42NXJlbScsIGFsaWduSXRlbXM6ICdjZW50ZXInIH19PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmxleDogMSwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogJzQwcHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAnMCAwLjg1cmVtJywgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAnMC44cmVtJywgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6ICcjRkFGN0Y0JywgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzVDNTg1MycsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgcmdiYSgyMTIsIDE2MywgMTE1LCAwLjM1KScsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICc1MHB4JywgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogJzUwMCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2hpdGVTcGFjZTogJ25vd3JhcCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJveFNpemluZzogJ2JvcmRlci1ib3gnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb250aW51ZSBTaG9wcGluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBocmVmPVwiIy9jYXJ0XCIgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsZXg6IDEsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6ICc0MHB4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogJzAgMC44NXJlbScsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogJzAuODJyZW0nLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogJ2xpbmVhci1ncmFkaWVudCgxMzVkZWcsICNENEEzNzMgMCUsICNDNDkzNjMgMTAwJSknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyNGRkYnLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiAnbm9uZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzUwcHgnLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogJzYwMCcsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHREZWNvcmF0aW9uOiAnbm9uZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJveFNoYWRvdzogJzAgNHB4IDEycHggcmdiYSgyMTIsIDE2MywgMTE1LCAwLjI1KScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoaXRlU3BhY2U6ICdub3dyYXAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3hTaXppbmc6ICdib3JkZXItYm94J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ2hlY2tvdXQgJnJhcnI7XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKX1cbiAgICAgICAgPC9IYXNoUm91dGVyPlxuICAgICk7XG59O1xuXG5jb25zdCBBcHAgPSAoKSA9PiB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPEVycm9yQm91bmRhcnk+XG4gICAgICAgICAgICA8QXV0aFByb3ZpZGVyPlxuICAgICAgICAgICAgICAgIDxBbGVydFByb3ZpZGVyPlxuICAgICAgICAgICAgICAgICAgICA8Q2FydFByb3ZpZGVyPlxuICAgICAgICAgICAgICAgICAgICAgICAgPEFwcFJvdXRlc0NvbnRlbnQgLz5cbiAgICAgICAgICAgICAgICAgICAgPC9DYXJ0UHJvdmlkZXI+XG4gICAgICAgICAgICAgICAgPC9BbGVydFByb3ZpZGVyPlxuICAgICAgICAgICAgPC9BdXRoUHJvdmlkZXI+XG4gICAgICAgIDwvRXJyb3JCb3VuZGFyeT5cbiAgICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgQXBwO1xuIl19