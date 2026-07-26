import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/components/Navbar.jsx");const React = __vite__cjsImport0_react; const useState = __vite__cjsImport0_react["useState"]; const useEffect = __vite__cjsImport0_react["useEffect"]; const useRef = __vite__cjsImport0_react["useRef"]; const useMemo = __vite__cjsImport0_react["useMemo"]; const useCallback = __vite__cjsImport0_react["useCallback"];const ReactDOM = __vite__cjsImport1_reactDom;const _jsxDEV = __vite__cjsImport6_react_jsxDevRuntime["jsxDEV"];import __vite__cjsImport0_react from "/node_modules/.vite/deps/react.js?v=42a9b196";
import __vite__cjsImport1_reactDom from "/node_modules/.vite/deps/react-dom.js?v=42a9b196";
import { useNavigate, Link, useLocation, useParams, Routes, Route, Navigate, BrowserRouter } from "/node_modules/.vite/deps/react-router-dom.js?v=42a9b196";
import Cart from "/src/pages/Cart.jsx";
import Home from "/src/pages/Home.jsx";
import Shop from "/src/pages/Shop.jsx";
var _jsxFileName = "D:/The Ethnic Touch/frontend/src/components/Navbar.jsx";
import __vite__cjsImport6_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=42a9b196";
var _s = $RefreshSig$();
const Navbar = ({ products, cartCount, wishlistCount, authUser, authLoading, onSearchSubmit, globalSearch, setGlobalSearch }) => {
	_s();
	const [animateCart, setAnimateCart] = useState(false);
	const [animateWishlist, setAnimateWishlist] = useState(false);
	const [isFocused, setIsFocused] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
	const [recentSearches, setRecentSearches] = useState([]);
	const overlayRef = useRef(null);
	const navigate = useNavigate();
	useEffect(() => {
		if (cartCount > 0) {
			setAnimateCart(true);
			const timer = setTimeout(() => setAnimateCart(false), 450);
			return () => clearTimeout(timer);
		}
	}, [cartCount]);
	useEffect(() => {
		if (wishlistCount > 0) {
			setAnimateWishlist(true);
			const timer = setTimeout(() => setAnimateWishlist(false), 450);
			return () => clearTimeout(timer);
		}
	}, [wishlistCount]);
	useEffect(() => {
		const stored = localStorage.getItem("tet_recent_searches");
		if (stored) {
			try {
				setRecentSearches(JSON.parse(stored));
			} catch (e) {}
		}
	}, []);
	const addRecentSearch = (q) => {
		if (!q.trim()) return;
		const filtered = [q.trim(), ...recentSearches.filter((s) => s.toLowerCase() !== q.trim().toLowerCase())].slice(0, 5);
		setRecentSearches(filtered);
		localStorage.setItem("tet_recent_searches", JSON.stringify(filtered));
	};
	const handleSearchSubmit = (q) => {
		addRecentSearch(q);
		setGlobalSearch(q);
		setIsFocused(false);
		setMobileMenuOpen(false);
		setMobileSearchOpen(false);
		onSearchSubmit(q);
	};
	const popularTags = [
		"Silk",
		"Cotton",
		"Daily Wear",
		"Anarkali",
		"Embroidered"
	];
	const matchingProducts = globalSearch.trim().length > 1 && Array.isArray(products) ? products.filter((p) => p.name.toLowerCase().includes(globalSearch.toLowerCase()) || p.category && p.category.toLowerCase().includes(globalSearch.toLowerCase()) || p.tags && p.tags.toLowerCase().includes(globalSearch.toLowerCase())).slice(0, 4) : [];
	return /* @__PURE__ */ _jsxDEV("nav", {
		className: "navbar",
		style: { padding: "0.7rem 4%" },
		children: [
			/* @__PURE__ */ _jsxDEV("div", {
				className: "nav-container",
				style: {
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					width: "100%",
					gap: "1rem"
				},
				children: [
					/* @__PURE__ */ _jsxDEV("button", {
						type: "button",
						className: "mobile-hamburger-btn",
						onClick: () => setMobileMenuOpen(true),
						"aria-label": "Open mobile menu",
						children: /* @__PURE__ */ _jsxDEV("svg", {
							width: "22",
							height: "22",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "2",
							strokeLinecap: "round",
							strokeLinejoin: "round",
							children: [
								/* @__PURE__ */ _jsxDEV("line", {
									x1: "3",
									y1: "12",
									x2: "21",
									y2: "12"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 78,
									columnNumber: 25
								}, this),
								/* @__PURE__ */ _jsxDEV("line", {
									x1: "3",
									y1: "6",
									x2: "21",
									y2: "6"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 79,
									columnNumber: 25
								}, this),
								/* @__PURE__ */ _jsxDEV("line", {
									x1: "3",
									y1: "18",
									x2: "21",
									y2: "18"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 80,
									columnNumber: 25
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 77,
							columnNumber: 21
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 71,
						columnNumber: 17
					}, this),
					/* @__PURE__ */ _jsxDEV(Link, {
						to: "/",
						onClick: () => {
							setGlobalSearch("");
							setMobileMenuOpen(false);
							setMobileSearchOpen(false);
						},
						className: "logo",
						style: { flexShrink: 0 },
						children: "The Ethnic Touch"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 85,
						columnNumber: 17
					}, this),
					/* @__PURE__ */ _jsxDEV("ul", {
						className: "desktop-category-nav",
						children: [
							/* @__PURE__ */ _jsxDEV("li", { children: /* @__PURE__ */ _jsxDEV(Link, {
								to: "/",
								children: "Home"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 91,
								columnNumber: 25
							}, this) }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 91,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ _jsxDEV("li", { children: /* @__PURE__ */ _jsxDEV(Link, {
								to: "/shop",
								children: "Shop"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 92,
								columnNumber: 25
							}, this) }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 92,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ _jsxDEV("li", { children: /* @__PURE__ */ _jsxDEV(Link, {
								to: "/shop?category=Straight Cut",
								children: "Straight Cut"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 93,
								columnNumber: 25
							}, this) }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 93,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ _jsxDEV("li", { children: /* @__PURE__ */ _jsxDEV(Link, {
								to: "/shop?category=Anarkali",
								children: "Anarkali"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 94,
								columnNumber: 25
							}, this) }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 94,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ _jsxDEV("li", { children: /* @__PURE__ */ _jsxDEV(Link, {
								to: "/shop?category=Tunic",
								children: "Tunic"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 95,
								columnNumber: 25
							}, this) }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 95,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ _jsxDEV("li", { children: /* @__PURE__ */ _jsxDEV(Link, {
								to: "/shop?category=Fusion",
								children: "Fusion"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 96,
								columnNumber: 25
							}, this) }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 96,
								columnNumber: 21
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 90,
						columnNumber: 17
					}, this),
					/* @__PURE__ */ _jsxDEV("div", {
						className: "desktop-header-right",
						children: [
							/* @__PURE__ */ _jsxDEV("div", {
								className: "search-container compact-search-wrapper",
								ref: overlayRef,
								children: [/* @__PURE__ */ _jsxDEV("div", {
									className: "search-input-wrapper",
									style: {
										border: "1px solid #e0e0e0",
										borderRadius: "50px",
										background: "#f9f9f9",
										padding: "0 10px 0 12px",
										height: "32px",
										display: "flex",
										alignItems: "center"
									},
									children: [
										/* @__PURE__ */ _jsxDEV("span", {
											className: "search-icon",
											style: {
												display: "flex",
												alignItems: "center"
											},
											children: /* @__PURE__ */ _jsxDEV("svg", {
												viewBox: "0 0 24 24",
												width: "14",
												height: "14",
												stroke: "currentColor",
												strokeWidth: "2",
												fill: "none",
												children: [/* @__PURE__ */ _jsxDEV("circle", {
													cx: "11",
													cy: "11",
													r: "8"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 105,
													columnNumber: 131
												}, this), /* @__PURE__ */ _jsxDEV("line", {
													x1: "21",
													y1: "21",
													x2: "16.65",
													y2: "16.65"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 105,
													columnNumber: 170
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 105,
												columnNumber: 33
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 104,
											columnNumber: 29
										}, this),
										/* @__PURE__ */ _jsxDEV("input", {
											type: "text",
											className: "search-input",
											placeholder: "Search wardrobe...",
											value: globalSearch,
											onChange: (e) => setGlobalSearch(e.target.value),
											onFocus: () => setIsFocused(true),
											onKeyDown: (e) => {
												if (e.key === "Enter") handleSearchSubmit(globalSearch);
											},
											style: {
												fontSize: "0.78rem",
												padding: "0 6px",
												height: "100%",
												border: "none",
												background: "transparent"
											}
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 107,
											columnNumber: 29
										}, this),
										globalSearch && /* @__PURE__ */ _jsxDEV("button", {
											onClick: () => setGlobalSearch(""),
											style: {
												background: "none",
												border: "none",
												cursor: "pointer",
												color: "#999",
												fontSize: "1rem",
												padding: "0 4px"
											},
											children: "×"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 120,
											columnNumber: 33
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 103,
									columnNumber: 25
								}, this), isFocused && !mobileSearchOpen && /* @__PURE__ */ _jsxDEV("div", {
									className: "search-suggestions-overlay",
									style: {
										left: "auto",
										right: 0,
										width: "320px"
									},
									children: globalSearch.trim().length <= 1 ? /* @__PURE__ */ _jsxDEV("div", { children: [recentSearches.length > 0 && /* @__PURE__ */ _jsxDEV("div", {
										style: { marginBottom: "1rem" },
										children: [/* @__PURE__ */ _jsxDEV("div", {
											className: "suggestion-section-title",
											children: "Recent Searches"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 136,
											columnNumber: 49
										}, this), /* @__PURE__ */ _jsxDEV("div", {
											className: "suggestion-tags",
											children: recentSearches.map((s, idx) => /* @__PURE__ */ _jsxDEV("span", {
												className: "suggestion-tag-chip",
												onClick: () => handleSearchSubmit(s),
												children: s
											}, idx, false, {
												fileName: _jsxFileName,
												lineNumber: 139,
												columnNumber: 57
											}, this))
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 137,
											columnNumber: 49
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 135,
										columnNumber: 45
									}, this), /* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("div", {
										className: "suggestion-section-title",
										children: "Trending Now"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 151,
										columnNumber: 45
									}, this), /* @__PURE__ */ _jsxDEV("div", {
										className: "suggestion-tags",
										children: popularTags.map((tag, idx) => /* @__PURE__ */ _jsxDEV("span", {
											className: "suggestion-tag-chip",
											onClick: () => handleSearchSubmit(tag),
											children: tag
										}, idx, false, {
											fileName: _jsxFileName,
											lineNumber: 154,
											columnNumber: 53
										}, this))
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 152,
										columnNumber: 45
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 150,
										columnNumber: 41
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 133,
										columnNumber: 37
									}, this) : /* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("div", {
										className: "suggestion-section-title",
										children: "Suggested Products"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 167,
										columnNumber: 41
									}, this), matchingProducts.length === 0 ? /* @__PURE__ */ _jsxDEV("div", {
										style: {
											fontSize: "0.85rem",
											color: "#999",
											padding: "8px 0"
										},
										children: [
											"No products matching \"",
											globalSearch,
											"\""
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 169,
										columnNumber: 45
									}, this) : /* @__PURE__ */ _jsxDEV("div", {
										className: "matching-products-list",
										children: [matchingProducts.map((p) => /* @__PURE__ */ _jsxDEV(Link, {
											to: `/product/${p.id}`,
											className: "matching-product-item",
											onClick: () => setIsFocused(false),
											children: [/* @__PURE__ */ _jsxDEV("img", {
												src: p.imageUrl,
												className: "matching-product-img",
												alt: p.name
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 179,
												columnNumber: 57
											}, this), /* @__PURE__ */ _jsxDEV("div", {
												style: {
													flex: 1,
													minWidth: 0
												},
												children: [/* @__PURE__ */ _jsxDEV("div", {
													className: "matching-product-name",
													style: {
														whiteSpace: "nowrap",
														overflow: "hidden",
														textOverflow: "ellipsis"
													},
													children: p.name
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 181,
													columnNumber: 61
												}, this), /* @__PURE__ */ _jsxDEV("div", {
													className: "matching-product-price",
													children: ["₹", p.price.toLocaleString("en-IN")]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 182,
													columnNumber: 61
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 180,
												columnNumber: 57
											}, this)]
										}, p.id, true, {
											fileName: _jsxFileName,
											lineNumber: 173,
											columnNumber: 53
										}, this)), /* @__PURE__ */ _jsxDEV("div", {
											onClick: () => handleSearchSubmit(globalSearch),
											style: {
												textAlign: "center",
												fontSize: "0.8rem",
												color: "var(--color-primary)",
												fontWeight: "600",
												padding: "6px 0",
												borderTop: "1px solid #f5f5f5",
												marginTop: "4px",
												cursor: "pointer"
											},
											children: "View all matches →"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 186,
											columnNumber: 49
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 171,
										columnNumber: 45
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 166,
										columnNumber: 37
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 131,
									columnNumber: 29
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 102,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ _jsxDEV(Link, {
								to: "/wishlist",
								className: "desktop-icon-badge",
								title: "Wishlist",
								children: [/* @__PURE__ */ _jsxDEV("svg", {
									viewBox: "0 0 24 24",
									width: "19",
									height: "19",
									fill: wishlistCount > 0 ? "#8F5E36" : "none",
									stroke: wishlistCount > 0 ? "#8F5E36" : "currentColor",
									strokeWidth: "1.8",
									strokeLinecap: "round",
									strokeLinejoin: "round",
									children: /* @__PURE__ */ _jsxDEV("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 203,
										columnNumber: 29
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 202,
									columnNumber: 25
								}, this), wishlistCount > 0 && /* @__PURE__ */ _jsxDEV("span", {
									className: "desktop-badge-dot",
									children: wishlistCount
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 205,
									columnNumber: 47
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 201,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ _jsxDEV(Link, {
								to: "/cart",
								className: "desktop-icon-badge",
								title: "Cart",
								children: [/* @__PURE__ */ _jsxDEV("svg", {
									viewBox: "0 0 24 24",
									width: "19",
									height: "19",
									fill: "none",
									stroke: "currentColor",
									strokeWidth: "1.8",
									strokeLinecap: "round",
									strokeLinejoin: "round",
									children: /* @__PURE__ */ _jsxDEV("path", { d: "M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 211,
										columnNumber: 29
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 210,
									columnNumber: 25
								}, this), cartCount > 0 && /* @__PURE__ */ _jsxDEV("span", {
									className: "desktop-badge-dot",
									children: cartCount
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 213,
									columnNumber: 43
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 209,
								columnNumber: 21
							}, this),
							authUser ? /* @__PURE__ */ _jsxDEV(Link, {
								to: "/profile",
								className: "desktop-icon-badge",
								title: "Profile",
								children: /* @__PURE__ */ _jsxDEV("svg", {
									viewBox: "0 0 24 24",
									width: "19",
									height: "19",
									fill: "none",
									stroke: "currentColor",
									strokeWidth: "1.8",
									strokeLinecap: "round",
									strokeLinejoin: "round",
									children: [/* @__PURE__ */ _jsxDEV("path", { d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 220,
										columnNumber: 33
									}, this), /* @__PURE__ */ _jsxDEV("circle", {
										cx: "12",
										cy: "7",
										r: "4"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 221,
										columnNumber: 33
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 219,
									columnNumber: 29
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 218,
								columnNumber: 25
							}, this) : /* @__PURE__ */ _jsxDEV(Link, {
								to: "/auth",
								style: {
									fontSize: "0.82rem",
									fontWeight: "600",
									textDecoration: "none",
									color: "var(--color-primary)",
									border: "1.5px solid var(--color-primary)",
									padding: "0.35rem 0.9rem",
									borderRadius: "50px",
									whiteSpace: "nowrap"
								},
								children: "Sign In"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 225,
								columnNumber: 25
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 100,
						columnNumber: 17
					}, this),
					/* @__PURE__ */ _jsxDEV("div", {
						className: "mobile-header-actions",
						children: [
							/* @__PURE__ */ _jsxDEV("button", {
								type: "button",
								className: "mobile-search-toggle-btn",
								onClick: () => {
									setMobileSearchOpen(!mobileSearchOpen);
									setIsFocused(!mobileSearchOpen);
								},
								title: "Search wardrobe",
								children: /* @__PURE__ */ _jsxDEV("svg", {
									viewBox: "0 0 24 24",
									width: "20",
									height: "20",
									stroke: "currentColor",
									strokeWidth: "2",
									fill: "none",
									children: [/* @__PURE__ */ _jsxDEV("circle", {
										cx: "11",
										cy: "11",
										r: "8"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 240,
										columnNumber: 29
									}, this), /* @__PURE__ */ _jsxDEV("line", {
										x1: "21",
										y1: "21",
										x2: "16.65",
										y2: "16.65"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 241,
										columnNumber: 29
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 239,
									columnNumber: 25
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 233,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ _jsxDEV(Link, {
								to: "/wishlist",
								className: "mobile-icon-badge",
								title: "Wishlist",
								children: [/* @__PURE__ */ _jsxDEV("svg", {
									viewBox: "0 0 24 24",
									width: "19",
									height: "19",
									fill: wishlistCount > 0 ? "#8F5E36" : "none",
									stroke: wishlistCount > 0 ? "#8F5E36" : "currentColor",
									strokeWidth: "1.8",
									strokeLinecap: "round",
									strokeLinejoin: "round",
									children: /* @__PURE__ */ _jsxDEV("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 247,
										columnNumber: 29
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 246,
									columnNumber: 25
								}, this), wishlistCount > 0 && /* @__PURE__ */ _jsxDEV("span", {
									className: "mobile-badge-count",
									children: wishlistCount
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 249,
									columnNumber: 47
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 245,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ _jsxDEV(Link, {
								to: "/cart",
								className: "mobile-icon-badge",
								title: "Cart",
								children: [/* @__PURE__ */ _jsxDEV("svg", {
									viewBox: "0 0 24 24",
									width: "19",
									height: "19",
									fill: "none",
									stroke: "currentColor",
									strokeWidth: "1.8",
									strokeLinecap: "round",
									strokeLinejoin: "round",
									children: /* @__PURE__ */ _jsxDEV("path", { d: "M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 254,
										columnNumber: 29
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 253,
									columnNumber: 25
								}, this), cartCount > 0 && /* @__PURE__ */ _jsxDEV("span", {
									className: "mobile-badge-count",
									children: cartCount
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 256,
									columnNumber: 43
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 252,
								columnNumber: 21
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 232,
						columnNumber: 17
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 69,
				columnNumber: 13
			}, this),
			mobileSearchOpen && /* @__PURE__ */ _jsxDEV("div", {
				className: "mobile-search-row",
				children: [/* @__PURE__ */ _jsxDEV("div", {
					className: "search-input-wrapper",
					children: [
						/* @__PURE__ */ _jsxDEV("span", {
							className: "search-icon",
							children: /* @__PURE__ */ _jsxDEV("svg", {
								viewBox: "0 0 24 24",
								width: "16",
								height: "16",
								stroke: "currentColor",
								strokeWidth: "2",
								fill: "none",
								children: [/* @__PURE__ */ _jsxDEV("circle", {
									cx: "11",
									cy: "11",
									r: "8"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 266,
									columnNumber: 127
								}, this), /* @__PURE__ */ _jsxDEV("line", {
									x1: "21",
									y1: "21",
									x2: "16.65",
									y2: "16.65"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 266,
									columnNumber: 166
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 266,
								columnNumber: 29
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 265,
							columnNumber: 25
						}, this),
						/* @__PURE__ */ _jsxDEV("input", {
							type: "text",
							className: "search-input",
							placeholder: "Search wardrobe, fabrics...",
							value: globalSearch,
							onChange: (e) => setGlobalSearch(e.target.value),
							onFocus: () => setIsFocused(true),
							autoFocus: true,
							onKeyDown: (e) => {
								if (e.key === "Enter") handleSearchSubmit(globalSearch);
							}
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 268,
							columnNumber: 25
						}, this),
						/* @__PURE__ */ _jsxDEV("button", {
							onClick: () => setMobileSearchOpen(false),
							style: {
								background: "none",
								border: "none",
								cursor: "pointer",
								color: "#999",
								fontSize: "1.2rem",
								padding: "0 8px"
							},
							children: "×"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 280,
							columnNumber: 25
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 264,
					columnNumber: 21
				}, this), isFocused && /* @__PURE__ */ _jsxDEV("div", {
					className: "search-suggestions-overlay",
					style: {
						left: 0,
						right: 0,
						width: "100%",
						top: "100%",
						position: "absolute",
						zIndex: 9999
					},
					children: globalSearch.trim().length <= 1 ? /* @__PURE__ */ _jsxDEV("div", { children: [recentSearches.length > 0 && /* @__PURE__ */ _jsxDEV("div", {
						style: { marginBottom: "1rem" },
						children: [/* @__PURE__ */ _jsxDEV("div", {
							className: "suggestion-section-title",
							children: "Recent Searches"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 295,
							columnNumber: 45
						}, this), /* @__PURE__ */ _jsxDEV("div", {
							className: "suggestion-tags",
							children: recentSearches.map((s, idx) => /* @__PURE__ */ _jsxDEV("span", {
								className: "suggestion-tag-chip",
								onClick: () => handleSearchSubmit(s),
								children: s
							}, idx, false, {
								fileName: _jsxFileName,
								lineNumber: 298,
								columnNumber: 53
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 296,
							columnNumber: 45
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 294,
						columnNumber: 41
					}, this), /* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("div", {
						className: "suggestion-section-title",
						children: "Trending Now"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 310,
						columnNumber: 41
					}, this), /* @__PURE__ */ _jsxDEV("div", {
						className: "suggestion-tags",
						children: popularTags.map((tag, idx) => /* @__PURE__ */ _jsxDEV("span", {
							className: "suggestion-tag-chip",
							onClick: () => handleSearchSubmit(tag),
							children: tag
						}, idx, false, {
							fileName: _jsxFileName,
							lineNumber: 313,
							columnNumber: 49
						}, this))
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 311,
						columnNumber: 41
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 309,
						columnNumber: 37
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 292,
						columnNumber: 33
					}, this) : /* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("div", {
						className: "suggestion-section-title",
						children: "Suggested Products"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 326,
						columnNumber: 37
					}, this), matchingProducts.length === 0 ? /* @__PURE__ */ _jsxDEV("div", {
						style: {
							fontSize: "0.85rem",
							color: "#999",
							padding: "8px 0"
						},
						children: [
							"No products matching \"",
							globalSearch,
							"\""
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 328,
						columnNumber: 41
					}, this) : /* @__PURE__ */ _jsxDEV("div", {
						className: "matching-products-list",
						children: [matchingProducts.map((p) => /* @__PURE__ */ _jsxDEV(Link, {
							to: `/product/${p.id}`,
							className: "matching-product-item",
							onClick: () => {
								setIsFocused(false);
								setMobileSearchOpen(false);
							},
							children: [/* @__PURE__ */ _jsxDEV("img", {
								src: p.imageUrl,
								className: "matching-product-img",
								alt: p.name
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 338,
								columnNumber: 53
							}, this), /* @__PURE__ */ _jsxDEV("div", {
								style: {
									flex: 1,
									minWidth: 0
								},
								children: [/* @__PURE__ */ _jsxDEV("div", {
									className: "matching-product-name",
									style: {
										whiteSpace: "nowrap",
										overflow: "hidden",
										textOverflow: "ellipsis"
									},
									children: p.name
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 340,
									columnNumber: 57
								}, this), /* @__PURE__ */ _jsxDEV("div", {
									className: "matching-product-price",
									children: ["₹", p.price.toLocaleString("en-IN")]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 341,
									columnNumber: 57
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 339,
								columnNumber: 53
							}, this)]
						}, p.id, true, {
							fileName: _jsxFileName,
							lineNumber: 332,
							columnNumber: 49
						}, this)), /* @__PURE__ */ _jsxDEV("div", {
							onClick: () => handleSearchSubmit(globalSearch),
							style: {
								textAlign: "center",
								fontSize: "0.8rem",
								color: "var(--color-primary)",
								fontWeight: "600",
								padding: "6px 0",
								borderTop: "1px solid #f5f5f5",
								marginTop: "4px",
								cursor: "pointer"
							},
							children: "View all matches →"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 345,
							columnNumber: 45
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 330,
						columnNumber: 41
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 325,
						columnNumber: 33
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 290,
					columnNumber: 25
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 263,
				columnNumber: 17
			}, this),
			mobileMenuOpen && ReactDOM.createPortal(/* @__PURE__ */ _jsxDEV(React.Fragment, { children: [/* @__PURE__ */ _jsxDEV("div", {
				className: "mobile-drawer-overlay",
				onClick: () => setMobileMenuOpen(false)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 363,
				columnNumber: 21
			}, this), /* @__PURE__ */ _jsxDEV("div", {
				className: "mobile-drawer-content",
				children: [
					/* @__PURE__ */ _jsxDEV("div", {
						className: "mobile-drawer-header",
						children: [/* @__PURE__ */ _jsxDEV(Link, {
							to: "/",
							onClick: () => setMobileMenuOpen(false),
							className: "mobile-drawer-logo",
							children: "The Ethnic Touch"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 366,
							columnNumber: 29
						}, this), /* @__PURE__ */ _jsxDEV("button", {
							className: "mobile-drawer-close",
							onClick: () => setMobileMenuOpen(false),
							"aria-label": "Close menu",
							children: "×"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 369,
							columnNumber: 29
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 365,
						columnNumber: 25
					}, this),
					/* @__PURE__ */ _jsxDEV("div", {
						className: "mobile-drawer-body",
						children: [/* @__PURE__ */ _jsxDEV("div", {
							className: "mobile-drawer-nav-group",
							children: [
								/* @__PURE__ */ _jsxDEV(Link, {
									to: "/",
									onClick: () => setMobileMenuOpen(false),
									className: "mobile-drawer-item",
									children: [/* @__PURE__ */ _jsxDEV("div", {
										className: "drawer-item-icon",
										children: /* @__PURE__ */ _jsxDEV("svg", {
											width: "16",
											height: "16",
											viewBox: "0 0 24 24",
											fill: "none",
											stroke: "currentColor",
											strokeWidth: "1.8",
											children: [/* @__PURE__ */ _jsxDEV("path", { d: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 376,
												columnNumber: 141
											}, this), /* @__PURE__ */ _jsxDEV("polyline", { points: "9 22 9 12 15 12 15 22" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 376,
												columnNumber: 205
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 376,
											columnNumber: 41
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 375,
										columnNumber: 37
									}, this), /* @__PURE__ */ _jsxDEV("span", {
										className: "drawer-item-label",
										children: "Home Collection"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 378,
										columnNumber: 37
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 374,
									columnNumber: 33
								}, this),
								/* @__PURE__ */ _jsxDEV(Link, {
									to: "/shop",
									onClick: () => setMobileMenuOpen(false),
									className: "mobile-drawer-item",
									children: [/* @__PURE__ */ _jsxDEV("div", {
										className: "drawer-item-icon",
										children: /* @__PURE__ */ _jsxDEV("svg", {
											width: "16",
											height: "16",
											viewBox: "0 0 24 24",
											fill: "none",
											stroke: "currentColor",
											strokeWidth: "1.8",
											children: [
												/* @__PURE__ */ _jsxDEV("rect", {
													x: "3",
													y: "3",
													width: "7",
													height: "7"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 383,
													columnNumber: 141
												}, this),
												/* @__PURE__ */ _jsxDEV("rect", {
													x: "14",
													y: "3",
													width: "7",
													height: "7"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 383,
													columnNumber: 187
												}, this),
												/* @__PURE__ */ _jsxDEV("rect", {
													x: "14",
													y: "14",
													width: "7",
													height: "7"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 383,
													columnNumber: 234
												}, this),
												/* @__PURE__ */ _jsxDEV("rect", {
													x: "3",
													y: "14",
													width: "7",
													height: "7"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 383,
													columnNumber: 282
												}, this)
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 383,
											columnNumber: 41
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 382,
										columnNumber: 37
									}, this), /* @__PURE__ */ _jsxDEV("span", {
										className: "drawer-item-label",
										children: "Explore Shop & Fabrics"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 385,
										columnNumber: 37
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 381,
									columnNumber: 33
								}, this),
								/* @__PURE__ */ _jsxDEV(Link, {
									to: "/wishlist",
									onClick: () => setMobileMenuOpen(false),
									className: "mobile-drawer-item",
									children: [
										/* @__PURE__ */ _jsxDEV("div", {
											className: "drawer-item-icon",
											children: /* @__PURE__ */ _jsxDEV("svg", {
												width: "16",
												height: "16",
												viewBox: "0 0 24 24",
												fill: wishlistCount > 0 ? "var(--color-primary)" : "none",
												stroke: wishlistCount > 0 ? "var(--color-primary)" : "currentColor",
												strokeWidth: "1.8",
												children: /* @__PURE__ */ _jsxDEV("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 390,
													columnNumber: 235
												}, this)
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 390,
												columnNumber: 41
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 389,
											columnNumber: 37
										}, this),
										/* @__PURE__ */ _jsxDEV("span", {
											className: "drawer-item-label",
											children: "My Wishlist"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 392,
											columnNumber: 37
										}, this),
										wishlistCount > 0 && /* @__PURE__ */ _jsxDEV("span", {
											className: "drawer-badge-pill",
											children: wishlistCount
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 393,
											columnNumber: 59
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 388,
									columnNumber: 33
								}, this),
								/* @__PURE__ */ _jsxDEV(Link, {
									to: "/cart",
									onClick: () => setMobileMenuOpen(false),
									className: "mobile-drawer-item",
									children: [
										/* @__PURE__ */ _jsxDEV("div", {
											className: "drawer-item-icon",
											children: /* @__PURE__ */ _jsxDEV("svg", {
												width: "16",
												height: "16",
												viewBox: "0 0 24 24",
												fill: "none",
												stroke: "currentColor",
												strokeWidth: "1.8",
												strokeLinecap: "round",
												strokeLinejoin: "round",
												children: /* @__PURE__ */ _jsxDEV("path", { d: "M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 398,
													columnNumber: 186
												}, this)
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 398,
												columnNumber: 41
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 397,
											columnNumber: 37
										}, this),
										/* @__PURE__ */ _jsxDEV("span", {
											className: "drawer-item-label",
											children: "Shopping Cart"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 400,
											columnNumber: 37
										}, this),
										cartCount > 0 && /* @__PURE__ */ _jsxDEV("span", {
											className: "drawer-badge-pill",
											children: cartCount
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 401,
											columnNumber: 55
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 396,
									columnNumber: 33
								}, this),
								authUser ? /* @__PURE__ */ _jsxDEV(Link, {
									to: "/profile",
									onClick: () => setMobileMenuOpen(false),
									className: "mobile-drawer-item",
									children: [/* @__PURE__ */ _jsxDEV("div", {
										className: "drawer-item-icon",
										children: /* @__PURE__ */ _jsxDEV("svg", {
											width: "16",
											height: "16",
											viewBox: "0 0 24 24",
											fill: "none",
											stroke: "currentColor",
											strokeWidth: "1.8",
											strokeLinecap: "round",
											strokeLinejoin: "round",
											children: [/* @__PURE__ */ _jsxDEV("path", { d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 407,
												columnNumber: 190
											}, this), /* @__PURE__ */ _jsxDEV("circle", {
												cx: "12",
												cy: "7",
												r: "4"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 407,
												columnNumber: 244
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 407,
											columnNumber: 45
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 406,
										columnNumber: 41
									}, this), /* @__PURE__ */ _jsxDEV("span", {
										className: "drawer-item-label",
										children: "My Profile & Orders"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 409,
										columnNumber: 41
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 405,
									columnNumber: 37
								}, this) : /* @__PURE__ */ _jsxDEV(Link, {
									to: "/auth",
									onClick: () => setMobileMenuOpen(false),
									className: "mobile-drawer-item",
									children: [/* @__PURE__ */ _jsxDEV("div", {
										className: "drawer-item-icon",
										children: /* @__PURE__ */ _jsxDEV("svg", {
											width: "16",
											height: "16",
											viewBox: "0 0 24 24",
											fill: "none",
											stroke: "currentColor",
											strokeWidth: "1.8",
											children: [
												/* @__PURE__ */ _jsxDEV("path", { d: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 414,
													columnNumber: 145
												}, this),
												/* @__PURE__ */ _jsxDEV("polyline", { points: "10 17 15 12 10 7" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 414,
													columnNumber: 204
												}, this),
												/* @__PURE__ */ _jsxDEV("line", {
													x1: "15",
													y1: "12",
													x2: "3",
													y2: "12"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 414,
													columnNumber: 251
												}, this)
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 414,
											columnNumber: 45
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 413,
										columnNumber: 41
									}, this), /* @__PURE__ */ _jsxDEV("span", {
										className: "drawer-item-label",
										children: "Sign In / Register"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 416,
										columnNumber: 41
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 412,
									columnNumber: 37
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 373,
							columnNumber: 29
						}, this), /* @__PURE__ */ _jsxDEV("div", {
							className: "mobile-drawer-sub-group",
							children: [/* @__PURE__ */ _jsxDEV("div", {
								className: "drawer-sub-heading",
								children: "Featured Silhouettes"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 422,
								columnNumber: 33
							}, this), /* @__PURE__ */ _jsxDEV("div", {
								className: "drawer-sub-grid",
								children: [
									/* @__PURE__ */ _jsxDEV(Link, {
										to: "/shop?category=Straight Cut",
										onClick: () => setMobileMenuOpen(false),
										className: "drawer-sub-chip",
										children: "Straight Cut"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 424,
										columnNumber: 37
									}, this),
									/* @__PURE__ */ _jsxDEV(Link, {
										to: "/shop?category=Anarkali",
										onClick: () => setMobileMenuOpen(false),
										className: "drawer-sub-chip",
										children: "Anarkali Sets"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 425,
										columnNumber: 37
									}, this),
									/* @__PURE__ */ _jsxDEV(Link, {
										to: "/shop?category=Tunic",
										onClick: () => setMobileMenuOpen(false),
										className: "drawer-sub-chip",
										children: "Tunic Dresses"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 426,
										columnNumber: 37
									}, this),
									/* @__PURE__ */ _jsxDEV(Link, {
										to: "/shop?category=Fusion",
										onClick: () => setMobileMenuOpen(false),
										className: "drawer-sub-chip",
										children: "Fusion Wear"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 427,
										columnNumber: 37
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 423,
								columnNumber: 33
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 421,
							columnNumber: 29
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 372,
						columnNumber: 25
					}, this),
					/* @__PURE__ */ _jsxDEV("div", {
						className: "mobile-drawer-footer",
						children: /* @__PURE__ */ _jsxDEV("div", {
							className: "drawer-footer-badge",
							children: [/* @__PURE__ */ _jsxDEV("svg", {
								width: "15",
								height: "15",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "var(--color-primary)",
								strokeWidth: "2",
								children: /* @__PURE__ */ _jsxDEV("polygon", { points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 434,
									columnNumber: 139
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 434,
								columnNumber: 33
							}, this), /* @__PURE__ */ _jsxDEV("span", { children: "100% Handcrafted Luxury Guarantee" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 435,
								columnNumber: 33
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 433,
							columnNumber: 29
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 432,
						columnNumber: 25
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 364,
				columnNumber: 21
			}, this)] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 362,
				columnNumber: 17
			}, this), document.body),
			isFocused && /* @__PURE__ */ _jsxDEV("div", {
				onClick: () => setIsFocused(false),
				style: {
					position: "fixed",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					zIndex: 999
				}
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 445,
				columnNumber: 17
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 68,
		columnNumber: 9
	}, this);
};
_s(Navbar, "3mObw5WM+aNkN1/jCgltpiosK0c=", false, function() {
	return [useNavigate];
});
_c = Navbar;
export default Navbar;
var _c;
$RefreshReg$(_c, "Navbar");
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;
import * as __vite_react_currentExports from "/src/components/Navbar.jsx";
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }

  const currentExports = __vite_react_currentExports;
  queueMicrotask(() => {
    RefreshRuntime.registerExportsForReactRefresh("D:/The Ethnic Touch/frontend/src/components/Navbar.jsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("D:/The Ethnic Touch/frontend/src/components/Navbar.jsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
function $RefreshReg$(type, id) { return RefreshRuntime.register(type, "D:/The Ethnic Touch/frontend/src/components/Navbar.jsx" + ' ' + id); }
function $RefreshSig$() { return RefreshRuntime.createSignatureFunctionForTransform(); }

//# sourceMappingURL=data:application/json;base64,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R0FHQyxhQUNHLHdCQUFDLE9BQUQ7SUFBSyxlQUFlLGFBQWEsS0FBSztJQUFHLE9BQU87S0FBRSxVQUFVO0tBQVMsS0FBSztLQUFHLE1BQU07S0FBRyxPQUFPO0tBQUcsUUFBUTtLQUFHLFFBQVE7SUFBSTtHQUFJOzs7OztFQUU5SDs7Ozs7O0FBRWI7Ozs7O0FBRUEsZUFBZSIsIm5hbWVzIjpbXSwic291cmNlcyI6WyJOYXZiYXIuanN4Il0sInZlcnNpb24iOjMsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0LCB1c2VSZWYsIHVzZU1lbW8sIHVzZUNhbGxiYWNrIH0gZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcclxuaW1wb3J0IHsgdXNlTmF2aWdhdGUsIExpbmssIHVzZUxvY2F0aW9uLCB1c2VQYXJhbXMsIFJvdXRlcywgUm91dGUsIE5hdmlnYXRlLCBCcm93c2VyUm91dGVyIH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSc7XHJcbmltcG9ydCBDYXJ0IGZyb20gJy4uL3BhZ2VzL0NhcnQnO1xyXG5pbXBvcnQgSG9tZSBmcm9tICcuLi9wYWdlcy9Ib21lJztcclxuaW1wb3J0IFNob3AgZnJvbSAnLi4vcGFnZXMvU2hvcCc7XHJcblxyXG5jb25zdCBOYXZiYXIgPSAoeyBwcm9kdWN0cywgY2FydENvdW50LCB3aXNobGlzdENvdW50LCBhdXRoVXNlciwgYXV0aExvYWRpbmcsIG9uU2VhcmNoU3VibWl0LCBnbG9iYWxTZWFyY2gsIHNldEdsb2JhbFNlYXJjaCB9KSA9PiB7XHJcbiAgICBjb25zdCBbYW5pbWF0ZUNhcnQsIHNldEFuaW1hdGVDYXJ0XSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuICAgIGNvbnN0IFthbmltYXRlV2lzaGxpc3QsIHNldEFuaW1hdGVXaXNobGlzdF0gPSB1c2VTdGF0ZShmYWxzZSk7XHJcbiAgICBjb25zdCBbaXNGb2N1c2VkLCBzZXRJc0ZvY3VzZWRdID0gdXNlU3RhdGUoZmFsc2UpO1xyXG4gICAgY29uc3QgW21vYmlsZU1lbnVPcGVuLCBzZXRNb2JpbGVNZW51T3Blbl0gPSB1c2VTdGF0ZShmYWxzZSk7XHJcbiAgICBjb25zdCBbbW9iaWxlU2VhcmNoT3Blbiwgc2V0TW9iaWxlU2VhcmNoT3Blbl0gPSB1c2VTdGF0ZShmYWxzZSk7XHJcbiAgICBjb25zdCBbcmVjZW50U2VhcmNoZXMsIHNldFJlY2VudFNlYXJjaGVzXSA9IHVzZVN0YXRlKFtdKTtcclxuICAgIGNvbnN0IG92ZXJsYXlSZWYgPSB1c2VSZWYobnVsbCk7XHJcbiAgICBjb25zdCBuYXZpZ2F0ZSA9IHVzZU5hdmlnYXRlKCk7XHJcblxyXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgICAgICBpZiAoY2FydENvdW50ID4gMCkge1xyXG4gICAgICAgICAgICBzZXRBbmltYXRlQ2FydCh0cnVlKTtcclxuICAgICAgICAgICAgY29uc3QgdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHNldEFuaW1hdGVDYXJ0KGZhbHNlKSwgNDUwKTtcclxuICAgICAgICAgICAgcmV0dXJuICgpID0+IGNsZWFyVGltZW91dCh0aW1lcik7XHJcbiAgICAgICAgfVxyXG4gICAgfSwgW2NhcnRDb3VudF0pO1xyXG5cclxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICAgICAgaWYgKHdpc2hsaXN0Q291bnQgPiAwKSB7XHJcbiAgICAgICAgICAgIHNldEFuaW1hdGVXaXNobGlzdCh0cnVlKTtcclxuICAgICAgICAgICAgY29uc3QgdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHNldEFuaW1hdGVXaXNobGlzdChmYWxzZSksIDQ1MCk7XHJcbiAgICAgICAgICAgIHJldHVybiAoKSA9PiBjbGVhclRpbWVvdXQodGltZXIpO1xyXG4gICAgICAgIH1cclxuICAgIH0sIFt3aXNobGlzdENvdW50XSk7XHJcblxyXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgICAgICBjb25zdCBzdG9yZWQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndGV0X3JlY2VudF9zZWFyY2hlcycpO1xyXG4gICAgICAgIGlmIChzdG9yZWQpIHtcclxuICAgICAgICAgICAgdHJ5IHsgc2V0UmVjZW50U2VhcmNoZXMoSlNPTi5wYXJzZShzdG9yZWQpKTsgfSBjYXRjaChlKXt9XHJcbiAgICAgICAgfVxyXG4gICAgfSwgW10pO1xyXG5cclxuICAgIGNvbnN0IGFkZFJlY2VudFNlYXJjaCA9IChxKSA9PiB7XHJcbiAgICAgICAgaWYgKCFxLnRyaW0oKSkgcmV0dXJuO1xyXG4gICAgICAgIGNvbnN0IGZpbHRlcmVkID0gW3EudHJpbSgpLCAuLi5yZWNlbnRTZWFyY2hlcy5maWx0ZXIocyA9PiBzLnRvTG93ZXJDYXNlKCkgIT09IHEudHJpbSgpLnRvTG93ZXJDYXNlKCkpXS5zbGljZSgwLCA1KTtcclxuICAgICAgICBzZXRSZWNlbnRTZWFyY2hlcyhmaWx0ZXJlZCk7XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3RldF9yZWNlbnRfc2VhcmNoZXMnLCBKU09OLnN0cmluZ2lmeShmaWx0ZXJlZCkpO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBoYW5kbGVTZWFyY2hTdWJtaXQgPSAocSkgPT4ge1xyXG4gICAgICAgIGFkZFJlY2VudFNlYXJjaChxKTtcclxuICAgICAgICBzZXRHbG9iYWxTZWFyY2gocSk7XHJcbiAgICAgICAgc2V0SXNGb2N1c2VkKGZhbHNlKTtcclxuICAgICAgICBzZXRNb2JpbGVNZW51T3BlbihmYWxzZSk7XHJcbiAgICAgICAgc2V0TW9iaWxlU2VhcmNoT3BlbihmYWxzZSk7XHJcbiAgICAgICAgb25TZWFyY2hTdWJtaXQocSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IHBvcHVsYXJUYWdzID0gW1wiU2lsa1wiLCBcIkNvdHRvblwiLCBcIkRhaWx5IFdlYXJcIiwgXCJBbmFya2FsaVwiLCBcIkVtYnJvaWRlcmVkXCJdO1xyXG5cclxuICAgIGNvbnN0IG1hdGNoaW5nUHJvZHVjdHMgPSAoZ2xvYmFsU2VhcmNoLnRyaW0oKS5sZW5ndGggPiAxICYmIEFycmF5LmlzQXJyYXkocHJvZHVjdHMpKVxyXG4gICAgICAgID8gcHJvZHVjdHMuZmlsdGVyKHAgPT4gXHJcbiAgICAgICAgICAgIHAubmFtZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGdsb2JhbFNlYXJjaC50b0xvd2VyQ2FzZSgpKSB8fCBcclxuICAgICAgICAgICAgKHAuY2F0ZWdvcnkgJiYgcC5jYXRlZ29yeS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGdsb2JhbFNlYXJjaC50b0xvd2VyQ2FzZSgpKSkgfHwgXHJcbiAgICAgICAgICAgIChwLnRhZ3MgJiYgcC50YWdzLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoZ2xvYmFsU2VhcmNoLnRvTG93ZXJDYXNlKCkpKVxyXG4gICAgICAgICAgKS5zbGljZSgwLCA0KVxyXG4gICAgICAgIDogW107XHJcblxyXG4gICAgcmV0dXJuIChcclxuICAgICAgICA8bmF2IGNsYXNzTmFtZT1cIm5hdmJhclwiIHN0eWxlPXt7IHBhZGRpbmc6ICcwLjdyZW0gNCUnIH19PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5hdi1jb250YWluZXJcIiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsIGFsaWduSXRlbXM6ICdjZW50ZXInLCB3aWR0aDogJzEwMCUnLCBnYXA6ICcxcmVtJyB9fT5cclxuICAgICAgICAgICAgICAgIHsvKiBNb2JpbGUgSGFtYnVyZ2VyIEJ1dHRvbiAqL31cclxuICAgICAgICAgICAgICAgIDxidXR0b24gXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiIFxyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIm1vYmlsZS1oYW1idXJnZXItYnRuXCIgXHJcbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0TW9iaWxlTWVudU9wZW4odHJ1ZSl9XHJcbiAgICAgICAgICAgICAgICAgICAgYXJpYS1sYWJlbD1cIk9wZW4gbW9iaWxlIG1lbnVcIlxyXG4gICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCIyMlwiIGhlaWdodD1cIjIyXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGluZSB4MT1cIjNcIiB5MT1cIjEyXCIgeDI9XCIyMVwiIHkyPVwiMTJcIj48L2xpbmU+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaW5lIHgxPVwiM1wiIHkxPVwiNlwiIHgyPVwiMjFcIiB5Mj1cIjZcIj48L2xpbmU+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaW5lIHgxPVwiM1wiIHkxPVwiMThcIiB4Mj1cIjIxXCIgeTI9XCIxOFwiPjwvbGluZT5cclxuICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG5cclxuICAgICAgICAgICAgICAgIHsvKiBMZWZ0OiBCcmFuZCBMb2dvICovfVxyXG4gICAgICAgICAgICAgICAgPExpbmsgdG89XCIvXCIgb25DbGljaz17KCkgPT4geyBzZXRHbG9iYWxTZWFyY2goJycpOyBzZXRNb2JpbGVNZW51T3BlbihmYWxzZSk7IHNldE1vYmlsZVNlYXJjaE9wZW4oZmFsc2UpOyB9fSBjbGFzc05hbWU9XCJsb2dvXCIgc3R5bGU9e3sgZmxleFNocmluazogMCB9fT5cclxuICAgICAgICAgICAgICAgICAgICBUaGUgRXRobmljIFRvdWNoXHJcbiAgICAgICAgICAgICAgICA8L0xpbms+XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHsvKiBDZW50ZXI6IERlc2t0b3AgQ2F0ZWdvcnkgTmF2aWdhdGlvbiAqL31cclxuICAgICAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJkZXNrdG9wLWNhdGVnb3J5LW5hdlwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaT48TGluayB0bz1cIi9cIj5Ib21lPC9MaW5rPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpPjxMaW5rIHRvPVwiL3Nob3BcIj5TaG9wPC9MaW5rPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpPjxMaW5rIHRvPVwiL3Nob3A/Y2F0ZWdvcnk9U3RyYWlnaHQgQ3V0XCI+U3RyYWlnaHQgQ3V0PC9MaW5rPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpPjxMaW5rIHRvPVwiL3Nob3A/Y2F0ZWdvcnk9QW5hcmthbGlcIj5BbmFya2FsaTwvTGluaz48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaT48TGluayB0bz1cIi9zaG9wP2NhdGVnb3J5PVR1bmljXCI+VHVuaWM8L0xpbms+PC9saT5cclxuICAgICAgICAgICAgICAgICAgICA8bGk+PExpbmsgdG89XCIvc2hvcD9jYXRlZ29yeT1GdXNpb25cIj5GdXNpb248L0xpbms+PC9saT5cclxuICAgICAgICAgICAgICAgIDwvdWw+XHJcblxyXG4gICAgICAgICAgICAgICAgey8qIFJpZ2h0OiBDb21wYWN0IFNlYXJjaCBCYXIgJiBJY29uIEJhZGdlcyAqL31cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGVza3RvcC1oZWFkZXItcmlnaHRcIj5cclxuICAgICAgICAgICAgICAgICAgICB7LyogQ29tcGFjdCBTZWFyY2ggQ29udGFpbmVyICovfVxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2VhcmNoLWNvbnRhaW5lciBjb21wYWN0LXNlYXJjaC13cmFwcGVyXCIgcmVmPXtvdmVybGF5UmVmfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZWFyY2gtaW5wdXQtd3JhcHBlclwiIHN0eWxlPXt7IGJvcmRlcjogJzFweCBzb2xpZCAjZTBlMGUwJywgYm9yZGVyUmFkaXVzOiAnNTBweCcsIGJhY2tncm91bmQ6ICcjZjlmOWY5JywgcGFkZGluZzogJzAgMTBweCAwIDEycHgnLCBoZWlnaHQ6ICczMnB4JywgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInNlYXJjaC1pY29uXCIgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3ZnIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiB3aWR0aD1cIjE0XCIgaGVpZ2h0PVwiMTRcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjJcIiBmaWxsPVwibm9uZVwiPjxjaXJjbGUgY3g9XCIxMVwiIGN5PVwiMTFcIiByPVwiOFwiPjwvY2lyY2xlPjxsaW5lIHgxPVwiMjFcIiB5MT1cIjIxXCIgeDI9XCIxNi42NVwiIHkyPVwiMTYuNjVcIj48L2xpbmU+PC9zdmc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJzZWFyY2gtaW5wdXRcIiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlNlYXJjaCB3YXJkcm9iZS4uLlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2dsb2JhbFNlYXJjaH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldEdsb2JhbFNlYXJjaChlLnRhcmdldC52YWx1ZSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25Gb2N1cz17KCkgPT4gc2V0SXNGb2N1c2VkKHRydWUpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uS2V5RG93bj17KGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGUua2V5ID09PSAnRW50ZXInKSBoYW5kbGVTZWFyY2hTdWJtaXQoZ2xvYmFsU2VhcmNoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IGZvbnRTaXplOiAnMC43OHJlbScsIHBhZGRpbmc6ICcwIDZweCcsIGhlaWdodDogJzEwMCUnLCBib3JkZXI6ICdub25lJywgYmFja2dyb3VuZDogJ3RyYW5zcGFyZW50JyB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtnbG9iYWxTZWFyY2ggJiYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEdsb2JhbFNlYXJjaCgnJyl9IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBiYWNrZ3JvdW5kOiAnbm9uZScsIGJvcmRlcjogJ25vbmUnLCBjdXJzb3I6ICdwb2ludGVyJywgY29sb3I6ICcjOTk5JywgZm9udFNpemU6ICcxcmVtJywgcGFkZGluZzogJzAgNHB4JyB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJnRpbWVzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7LyogRGVza3RvcCBTdWdnZXN0aW9ucyBPdmVybGF5ICovfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7aXNGb2N1c2VkICYmICFtb2JpbGVTZWFyY2hPcGVuICYmIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2VhcmNoLXN1Z2dlc3Rpb25zLW92ZXJsYXlcIiBzdHlsZT17eyBsZWZ0OiAnYXV0bycsIHJpZ2h0OiAwLCB3aWR0aDogJzMyMHB4JyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Z2xvYmFsU2VhcmNoLnRyaW0oKS5sZW5ndGggPD0gMSA/IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtyZWNlbnRTZWFyY2hlcy5sZW5ndGggPiAwICYmIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IG1hcmdpbkJvdHRvbTogJzFyZW0nIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN1Z2dlc3Rpb24tc2VjdGlvbi10aXRsZVwiPlJlY2VudCBTZWFyY2hlczwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN1Z2dlc3Rpb24tdGFnc1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3JlY2VudFNlYXJjaGVzLm1hcCgocywgaWR4KSA9PiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleT17aWR4fSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwic3VnZ2VzdGlvbi10YWctY2hpcFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGhhbmRsZVNlYXJjaFN1Ym1pdChzKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3VnZ2VzdGlvbi1zZWN0aW9uLXRpdGxlXCI+VHJlbmRpbmcgTm93PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzdWdnZXN0aW9uLXRhZ3NcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3BvcHVsYXJUYWdzLm1hcCgodGFnLCBpZHgpID0+IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleT17aWR4fSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJzdWdnZXN0aW9uLXRhZy1jaGlwXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBoYW5kbGVTZWFyY2hTdWJtaXQodGFnKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7dGFnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzdWdnZXN0aW9uLXNlY3Rpb24tdGl0bGVcIj5TdWdnZXN0ZWQgUHJvZHVjdHM8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHttYXRjaGluZ1Byb2R1Y3RzLmxlbmd0aCA9PT0gMCA/IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGZvbnRTaXplOiAnMC44NXJlbScsIGNvbG9yOiAnIzk5OScsIHBhZGRpbmc6ICc4cHggMCcgfX0+Tm8gcHJvZHVjdHMgbWF0Y2hpbmcgXCJ7Z2xvYmFsU2VhcmNofVwiPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWF0Y2hpbmctcHJvZHVjdHMtbGlzdFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7bWF0Y2hpbmdQcm9kdWN0cy5tYXAocCA9PiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TGluayBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk9e3AuaWR9IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvPXtgL3Byb2R1Y3QvJHtwLmlkfWB9IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIm1hdGNoaW5nLXByb2R1Y3QtaXRlbVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0SXNGb2N1c2VkKGZhbHNlKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz17cC5pbWFnZVVybH0gY2xhc3NOYW1lPVwibWF0Y2hpbmctcHJvZHVjdC1pbWdcIiBhbHQ9e3AubmFtZX0gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGZsZXg6IDEsIG1pbldpZHRoOiAwIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1hdGNoaW5nLXByb2R1Y3QtbmFtZVwiIHN0eWxlPXt7IHdoaXRlU3BhY2U6ICdub3dyYXAnLCBvdmVyZmxvdzogJ2hpZGRlbicsIHRleHRPdmVyZmxvdzogJ2VsbGlwc2lzJyB9fT57cC5uYW1lfTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1hdGNoaW5nLXByb2R1Y3QtcHJpY2VcIj7igrl7cC5wcmljZS50b0xvY2FsZVN0cmluZygnZW4tSU4nKX08L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvTGluaz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBoYW5kbGVTZWFyY2hTdWJtaXQoZ2xvYmFsU2VhcmNoKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IHRleHRBbGlnbjogJ2NlbnRlcicsIGZvbnRTaXplOiAnMC44cmVtJywgY29sb3I6ICd2YXIoLS1jb2xvci1wcmltYXJ5KScsIGZvbnRXZWlnaHQ6ICc2MDAnLCBwYWRkaW5nOiAnNnB4IDAnLCBib3JkZXJUb3A6ICcxcHggc29saWQgI2Y1ZjVmNScsIG1hcmdpblRvcDogJzRweCcsIGN1cnNvcjogJ3BvaW50ZXInIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFZpZXcgYWxsIG1hdGNoZXMgJnJhcnI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICB7LyogV2lzaGxpc3QgSWNvbiBCYWRnZSAqL31cclxuICAgICAgICAgICAgICAgICAgICA8TGluayB0bz1cIi93aXNobGlzdFwiIGNsYXNzTmFtZT1cImRlc2t0b3AtaWNvbi1iYWRnZVwiIHRpdGxlPVwiV2lzaGxpc3RcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHN2ZyB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgd2lkdGg9XCIxOVwiIGhlaWdodD1cIjE5XCIgZmlsbD17d2lzaGxpc3RDb3VudCA+IDAgPyBcIiM4RjVFMzZcIiA6IFwibm9uZVwifSBzdHJva2U9e3dpc2hsaXN0Q291bnQgPiAwID8gXCIjOEY1RTM2XCIgOiBcImN1cnJlbnRDb2xvclwifSBzdHJva2VXaWR0aD1cIjEuOFwiIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMjAuODQgNC42MWE1LjUgNS41IDAgMCAwLTcuNzggMEwxMiA1LjY3bC0xLjA2LTEuMDZhNS41IDUuNSAwIDAgMC03Ljc4IDcuNzhsMS4wNiAxLjA2TDEyIDIxLjIzbDcuNzgtNy43OCAxLjA2LTEuMDZhNS41IDUuNSAwIDAgMCAwLTcuNzh6XCI+PC9wYXRoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICAgICAgICAgICAge3dpc2hsaXN0Q291bnQgPiAwICYmIDxzcGFuIGNsYXNzTmFtZT1cImRlc2t0b3AtYmFkZ2UtZG90XCI+e3dpc2hsaXN0Q291bnR9PC9zcGFuPn1cclxuICAgICAgICAgICAgICAgICAgICA8L0xpbms+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHsvKiBDYXJ0IEljb24gQmFkZ2UgKi99XHJcbiAgICAgICAgICAgICAgICAgICAgPExpbmsgdG89XCIvY2FydFwiIGNsYXNzTmFtZT1cImRlc2t0b3AtaWNvbi1iYWRnZVwiIHRpdGxlPVwiQ2FydFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3ZnIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiB3aWR0aD1cIjE5XCIgaGVpZ2h0PVwiMTlcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZVdpZHRoPVwiMS44XCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk0xNiAxMVY3YTQgNCAwIDAgMC04IDB2NE01IDloMTRsMSAxMkg0TDUgOXpcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICAgICAgICAgICAge2NhcnRDb3VudCA+IDAgJiYgPHNwYW4gY2xhc3NOYW1lPVwiZGVza3RvcC1iYWRnZS1kb3RcIj57Y2FydENvdW50fTwvc3Bhbj59XHJcbiAgICAgICAgICAgICAgICAgICAgPC9MaW5rPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICB7LyogUHJvZmlsZSAvIEFjY291bnQgQmFkZ2UgKi99XHJcbiAgICAgICAgICAgICAgICAgICAge2F1dGhVc2VyID8gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8TGluayB0bz1cIi9wcm9maWxlXCIgY2xhc3NOYW1lPVwiZGVza3RvcC1pY29uLWJhZGdlXCIgdGl0bGU9XCJQcm9maWxlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3ZnIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiB3aWR0aD1cIjE5XCIgaGVpZ2h0PVwiMTlcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZVdpZHRoPVwiMS44XCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMjAgMjF2LTJhNCA0IDAgMCAwLTQtNEg4YTQgNCAwIDAgMC00IDR2MlwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCI3XCIgcj1cIjRcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvTGluaz5cclxuICAgICAgICAgICAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8TGluayB0bz1cIi9hdXRoXCIgc3R5bGU9e3sgZm9udFNpemU6ICcwLjgycmVtJywgZm9udFdlaWdodDogJzYwMCcsIHRleHREZWNvcmF0aW9uOiAnbm9uZScsIGNvbG9yOiAndmFyKC0tY29sb3ItcHJpbWFyeSknLCBib3JkZXI6ICcxLjVweCBzb2xpZCB2YXIoLS1jb2xvci1wcmltYXJ5KScsIHBhZGRpbmc6ICcwLjM1cmVtIDAuOXJlbScsIGJvcmRlclJhZGl1czogJzUwcHgnLCB3aGl0ZVNwYWNlOiAnbm93cmFwJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNpZ24gSW5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9MaW5rPlxyXG4gICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICB7LyogTW9iaWxlIFF1aWNrIEFjdGlvbiBCYWRnZXMgKFNlYXJjaCwgV2lzaGxpc3QgJiBDYXJ0KSAqL31cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9iaWxlLWhlYWRlci1hY3Rpb25zXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJtb2JpbGUtc2VhcmNoLXRvZ2dsZS1idG5cIiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4geyBzZXRNb2JpbGVTZWFyY2hPcGVuKCFtb2JpbGVTZWFyY2hPcGVuKTsgc2V0SXNGb2N1c2VkKCFtb2JpbGVTZWFyY2hPcGVuKTsgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU9XCJTZWFyY2ggd2FyZHJvYmVcIlxyXG4gICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHN2ZyB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgd2lkdGg9XCIyMFwiIGhlaWdodD1cIjIwXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIyXCIgZmlsbD1cIm5vbmVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgY3g9XCIxMVwiIGN5PVwiMTFcIiByPVwiOFwiPjwvY2lyY2xlPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9XCIyMVwiIHkxPVwiMjFcIiB4Mj1cIjE2LjY1XCIgeTI9XCIxNi42NVwiPjwvbGluZT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIDxMaW5rIHRvPVwiL3dpc2hsaXN0XCIgY2xhc3NOYW1lPVwibW9iaWxlLWljb24tYmFkZ2VcIiB0aXRsZT1cIldpc2hsaXN0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzdmcgdmlld0JveD1cIjAgMCAyNCAyNFwiIHdpZHRoPVwiMTlcIiBoZWlnaHQ9XCIxOVwiIGZpbGw9e3dpc2hsaXN0Q291bnQgPiAwID8gXCIjOEY1RTM2XCIgOiBcIm5vbmVcIn0gc3Ryb2tlPXt3aXNobGlzdENvdW50ID4gMCA/IFwiIzhGNUUzNlwiIDogXCJjdXJyZW50Q29sb3JcIn0gc3Ryb2tlV2lkdGg9XCIxLjhcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTIwLjg0IDQuNjFhNS41IDUuNSAwIDAgMC03Ljc4IDBMMTIgNS42N2wtMS4wNi0xLjA2YTUuNSA1LjUgMCAwIDAtNy43OCA3Ljc4bDEuMDYgMS4wNkwxMiAyMS4yM2w3Ljc4LTcuNzggMS4wNi0xLjA2YTUuNSA1LjUgMCAwIDAgMC03Ljc4elwiPjwvcGF0aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHt3aXNobGlzdENvdW50ID4gMCAmJiA8c3BhbiBjbGFzc05hbWU9XCJtb2JpbGUtYmFkZ2UtY291bnRcIj57d2lzaGxpc3RDb3VudH08L3NwYW4+fVxyXG4gICAgICAgICAgICAgICAgICAgIDwvTGluaz5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgPExpbmsgdG89XCIvY2FydFwiIGNsYXNzTmFtZT1cIm1vYmlsZS1pY29uLWJhZGdlXCIgdGl0bGU9XCJDYXJ0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzdmcgdmlld0JveD1cIjAgMCAyNCAyNFwiIHdpZHRoPVwiMTlcIiBoZWlnaHQ9XCIxOVwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIxLjhcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTE2IDExVjdhNCA0IDAgMCAwLTggMHY0TTUgOWgxNGwxIDEySDRMNSA5elwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7Y2FydENvdW50ID4gMCAmJiA8c3BhbiBjbGFzc05hbWU9XCJtb2JpbGUtYmFkZ2UtY291bnRcIj57Y2FydENvdW50fTwvc3Bhbj59XHJcbiAgICAgICAgICAgICAgICAgICAgPC9MaW5rPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgey8qIE1vYmlsZSBFeHBhbmRhYmxlIFNlYXJjaCBSb3cgKi99XHJcbiAgICAgICAgICAgIHttb2JpbGVTZWFyY2hPcGVuICYmIChcclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9iaWxlLXNlYXJjaC1yb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNlYXJjaC1pbnB1dC13cmFwcGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInNlYXJjaC1pY29uXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3ZnIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiB3aWR0aD1cIjE2XCIgaGVpZ2h0PVwiMTZcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjJcIiBmaWxsPVwibm9uZVwiPjxjaXJjbGUgY3g9XCIxMVwiIGN5PVwiMTFcIiByPVwiOFwiPjwvY2lyY2xlPjxsaW5lIHgxPVwiMjFcIiB5MT1cIjIxXCIgeDI9XCIxNi42NVwiIHkyPVwiMTYuNjVcIj48L2xpbmU+PC9zdmc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInNlYXJjaC1pbnB1dFwiIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJTZWFyY2ggd2FyZHJvYmUsIGZhYnJpY3MuLi5cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2dsb2JhbFNlYXJjaH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0R2xvYmFsU2VhcmNoKGUudGFyZ2V0LnZhbHVlKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uRm9jdXM9eygpID0+IHNldElzRm9jdXNlZCh0cnVlKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF1dG9Gb2N1c1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25LZXlEb3duPXsoZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlLmtleSA9PT0gJ0VudGVyJykgaGFuZGxlU2VhcmNoU3VibWl0KGdsb2JhbFNlYXJjaCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0TW9iaWxlU2VhcmNoT3BlbihmYWxzZSl9IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgYmFja2dyb3VuZDogJ25vbmUnLCBib3JkZXI6ICdub25lJywgY3Vyc29yOiAncG9pbnRlcicsIGNvbG9yOiAnIzk5OScsIGZvbnRTaXplOiAnMS4ycmVtJywgcGFkZGluZzogJzAgOHB4JyB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmdGltZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICB7LyogTW9iaWxlIFN1Z2dlc3Rpb25zIE92ZXJsYXkgKi99XHJcbiAgICAgICAgICAgICAgICAgICAge2lzRm9jdXNlZCAmJiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2VhcmNoLXN1Z2dlc3Rpb25zLW92ZXJsYXlcIiBzdHlsZT17eyBsZWZ0OiAwLCByaWdodDogMCwgd2lkdGg6ICcxMDAlJywgdG9wOiAnMTAwJScsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCB6SW5kZXg6IDk5OTkgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Z2xvYmFsU2VhcmNoLnRyaW0oKS5sZW5ndGggPD0gMSA/IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7cmVjZW50U2VhcmNoZXMubGVuZ3RoID4gMCAmJiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IG1hcmdpbkJvdHRvbTogJzFyZW0nIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3VnZ2VzdGlvbi1zZWN0aW9uLXRpdGxlXCI+UmVjZW50IFNlYXJjaGVzPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzdWdnZXN0aW9uLXRhZ3NcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3JlY2VudFNlYXJjaGVzLm1hcCgocywgaWR4KSA9PiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk9e2lkeH0gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwic3VnZ2VzdGlvbi10YWctY2hpcFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gaGFuZGxlU2VhcmNoU3VibWl0KHMpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzdWdnZXN0aW9uLXNlY3Rpb24tdGl0bGVcIj5UcmVuZGluZyBOb3c8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3VnZ2VzdGlvbi10YWdzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3BvcHVsYXJUYWdzLm1hcCgodGFnLCBpZHgpID0+IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk9e2lkeH0gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJzdWdnZXN0aW9uLXRhZy1jaGlwXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGhhbmRsZVNlYXJjaFN1Ym1pdCh0YWcpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7dGFnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3VnZ2VzdGlvbi1zZWN0aW9uLXRpdGxlXCI+U3VnZ2VzdGVkIFByb2R1Y3RzPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHttYXRjaGluZ1Byb2R1Y3RzLmxlbmd0aCA9PT0gMCA/IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZm9udFNpemU6ICcwLjg1cmVtJywgY29sb3I6ICcjOTk5JywgcGFkZGluZzogJzhweCAwJyB9fT5ObyBwcm9kdWN0cyBtYXRjaGluZyBcIntnbG9iYWxTZWFyY2h9XCI8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWF0Y2hpbmctcHJvZHVjdHMtbGlzdFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHttYXRjaGluZ1Byb2R1Y3RzLm1hcChwID0+IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPExpbmsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk9e3AuaWR9IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG89e2AvcHJvZHVjdC8ke3AuaWR9YH0gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJtYXRjaGluZy1wcm9kdWN0LWl0ZW1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4geyBzZXRJc0ZvY3VzZWQoZmFsc2UpOyBzZXRNb2JpbGVTZWFyY2hPcGVuKGZhbHNlKTsgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9e3AuaW1hZ2VVcmx9IGNsYXNzTmFtZT1cIm1hdGNoaW5nLXByb2R1Y3QtaW1nXCIgYWx0PXtwLm5hbWV9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGZsZXg6IDEsIG1pbldpZHRoOiAwIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWF0Y2hpbmctcHJvZHVjdC1uYW1lXCIgc3R5bGU9e3sgd2hpdGVTcGFjZTogJ25vd3JhcCcsIG92ZXJmbG93OiAnaGlkZGVuJywgdGV4dE92ZXJmbG93OiAnZWxsaXBzaXMnIH19PntwLm5hbWV9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYXRjaGluZy1wcm9kdWN0LXByaWNlXCI+4oK5e3AucHJpY2UudG9Mb2NhbGVTdHJpbmcoJ2VuLUlOJyl9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9MaW5rPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGhhbmRsZVNlYXJjaFN1Ym1pdChnbG9iYWxTZWFyY2gpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyB0ZXh0QWxpZ246ICdjZW50ZXInLCBmb250U2l6ZTogJzAuOHJlbScsIGNvbG9yOiAndmFyKC0tY29sb3ItcHJpbWFyeSknLCBmb250V2VpZ2h0OiAnNjAwJywgcGFkZGluZzogJzZweCAwJywgYm9yZGVyVG9wOiAnMXB4IHNvbGlkICNmNWY1ZjUnLCBtYXJnaW5Ub3A6ICc0cHgnLCBjdXJzb3I6ICdwb2ludGVyJyB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVmlldyBhbGwgbWF0Y2hlcyAmcmFycjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICApfVxyXG5cclxuICAgICAgICAgICAgey8qIE1vYmlsZSBOYXZpZ2F0aW9uIERyYXdlciAoUG9ydGFsZWQgZGlyZWN0bHkgdG8gZG9jdW1lbnQuYm9keSkgKi99XHJcbiAgICAgICAgICAgIHttb2JpbGVNZW51T3BlbiAmJiBSZWFjdERPTS5jcmVhdGVQb3J0YWwoXHJcbiAgICAgICAgICAgICAgICA8UmVhY3QuRnJhZ21lbnQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2JpbGUtZHJhd2VyLW92ZXJsYXlcIiBvbkNsaWNrPXsoKSA9PiBzZXRNb2JpbGVNZW51T3BlbihmYWxzZSl9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2JpbGUtZHJhd2VyLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2JpbGUtZHJhd2VyLWhlYWRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPExpbmsgdG89XCIvXCIgb25DbGljaz17KCkgPT4gc2V0TW9iaWxlTWVudU9wZW4oZmFsc2UpfSBjbGFzc05hbWU9XCJtb2JpbGUtZHJhd2VyLWxvZ29cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUaGUgRXRobmljIFRvdWNoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0xpbms+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cIm1vYmlsZS1kcmF3ZXItY2xvc2VcIiBvbkNsaWNrPXsoKSA9PiBzZXRNb2JpbGVNZW51T3BlbihmYWxzZSl9IGFyaWEtbGFiZWw9XCJDbG9zZSBtZW51XCI+JnRpbWVzOzwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9iaWxlLWRyYXdlci1ib2R5XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vYmlsZS1kcmF3ZXItbmF2LWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPExpbmsgdG89XCIvXCIgb25DbGljaz17KCkgPT4gc2V0TW9iaWxlTWVudU9wZW4oZmFsc2UpfSBjbGFzc05hbWU9XCJtb2JpbGUtZHJhd2VyLWl0ZW1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkcmF3ZXItaXRlbS1pY29uXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3ZnIHdpZHRoPVwiMTZcIiBoZWlnaHQ9XCIxNlwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZVdpZHRoPVwiMS44XCI+PHBhdGggZD1cIk0zIDlsOS03IDkgN3YxMWEyIDIgMCAwIDEtMiAySDVhMiAyIDAgMCAxLTItMnpcIj48L3BhdGg+PHBvbHlsaW5lIHBvaW50cz1cIjkgMjIgOSAxMiAxNSAxMiAxNSAyMlwiPjwvcG9seWxpbmU+PC9zdmc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJkcmF3ZXItaXRlbS1sYWJlbFwiPkhvbWUgQ29sbGVjdGlvbjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0xpbms+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxMaW5rIHRvPVwiL3Nob3BcIiBvbkNsaWNrPXsoKSA9PiBzZXRNb2JpbGVNZW51T3BlbihmYWxzZSl9IGNsYXNzTmFtZT1cIm1vYmlsZS1kcmF3ZXItaXRlbVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRyYXdlci1pdGVtLWljb25cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCIxNlwiIGhlaWdodD1cIjE2XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIxLjhcIj48cmVjdCB4PVwiM1wiIHk9XCIzXCIgd2lkdGg9XCI3XCIgaGVpZ2h0PVwiN1wiPjwvcmVjdD48cmVjdCB4PVwiMTRcIiB5PVwiM1wiIHdpZHRoPVwiN1wiIGhlaWdodD1cIjdcIj48L3JlY3Q+PHJlY3QgeD1cIjE0XCIgeT1cIjE0XCIgd2lkdGg9XCI3XCIgaGVpZ2h0PVwiN1wiPjwvcmVjdD48cmVjdCB4PVwiM1wiIHk9XCIxNFwiIHdpZHRoPVwiN1wiIGhlaWdodD1cIjdcIj48L3JlY3Q+PC9zdmc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJkcmF3ZXItaXRlbS1sYWJlbFwiPkV4cGxvcmUgU2hvcCAmIEZhYnJpY3M8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9MaW5rPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TGluayB0bz1cIi93aXNobGlzdFwiIG9uQ2xpY2s9eygpID0+IHNldE1vYmlsZU1lbnVPcGVuKGZhbHNlKX0gY2xhc3NOYW1lPVwibW9iaWxlLWRyYXdlci1pdGVtXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZHJhd2VyLWl0ZW0taWNvblwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjE2XCIgaGVpZ2h0PVwiMTZcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD17d2lzaGxpc3RDb3VudCA+IDAgPyBcInZhcigtLWNvbG9yLXByaW1hcnkpXCIgOiBcIm5vbmVcIn0gc3Ryb2tlPXt3aXNobGlzdENvdW50ID4gMCA/IFwidmFyKC0tY29sb3ItcHJpbWFyeSlcIiA6IFwiY3VycmVudENvbG9yXCJ9IHN0cm9rZVdpZHRoPVwiMS44XCI+PHBhdGggZD1cIk0yMC44NCA0LjYxYTUuNSA1LjUgMCAwIDAtNy43OCAwTDEyIDUuNjdsLTEuMDYtMS4wNmE1LjUgNS41IDAgMCAwLTcuNzggNy43OGwxLjA2IDEuMDZMMTIgMjEuMjNsNy43OC03Ljc4IDEuMDYtMS4wNmE1LjUgNS41IDAgMCAwIDAtNy43OHpcIj48L3BhdGg+PC9zdmc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJkcmF3ZXItaXRlbS1sYWJlbFwiPk15IFdpc2hsaXN0PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7d2lzaGxpc3RDb3VudCA+IDAgJiYgPHNwYW4gY2xhc3NOYW1lPVwiZHJhd2VyLWJhZGdlLXBpbGxcIj57d2lzaGxpc3RDb3VudH08L3NwYW4+fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvTGluaz5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPExpbmsgdG89XCIvY2FydFwiIG9uQ2xpY2s9eygpID0+IHNldE1vYmlsZU1lbnVPcGVuKGZhbHNlKX0gY2xhc3NOYW1lPVwibW9iaWxlLWRyYXdlci1pdGVtXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZHJhd2VyLWl0ZW0taWNvblwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjE2XCIgaGVpZ2h0PVwiMTZcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjEuOFwiIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIj48cGF0aCBkPVwiTTE2IDExVjdhNCA0IDAgMCAwLTggMHY0TTUgOWgxNGwxIDEySDRMNSA5elwiIC8+PC9zdmc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJkcmF3ZXItaXRlbS1sYWJlbFwiPlNob3BwaW5nIENhcnQ8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtjYXJ0Q291bnQgPiAwICYmIDxzcGFuIGNsYXNzTmFtZT1cImRyYXdlci1iYWRnZS1waWxsXCI+e2NhcnRDb3VudH08L3NwYW4+fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvTGluaz5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2F1dGhVc2VyID8gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TGluayB0bz1cIi9wcm9maWxlXCIgb25DbGljaz17KCkgPT4gc2V0TW9iaWxlTWVudU9wZW4oZmFsc2UpfSBjbGFzc05hbWU9XCJtb2JpbGUtZHJhd2VyLWl0ZW1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZHJhd2VyLWl0ZW0taWNvblwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCIxNlwiIGhlaWdodD1cIjE2XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIxLjhcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCI+PHBhdGggZD1cIk0yMCAyMXYtMmE0IDQgMCAwIDAtNC00SDhhNCA0IDAgMCAwLTQgNHYyXCIgLz48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjdcIiByPVwiNFwiIC8+PC9zdmc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImRyYXdlci1pdGVtLWxhYmVsXCI+TXkgUHJvZmlsZSAmIE9yZGVyczwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9MaW5rPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkgOiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxMaW5rIHRvPVwiL2F1dGhcIiBvbkNsaWNrPXsoKSA9PiBzZXRNb2JpbGVNZW51T3BlbihmYWxzZSl9IGNsYXNzTmFtZT1cIm1vYmlsZS1kcmF3ZXItaXRlbVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkcmF3ZXItaXRlbS1pY29uXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjE2XCIgaGVpZ2h0PVwiMTZcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjEuOFwiPjxwYXRoIGQ9XCJNMTUgM2g0YTIgMiAwIDAgMSAyIDJ2MTRhMiAyIDAgMCAxLTIgMmgtNFwiPjwvcGF0aD48cG9seWxpbmUgcG9pbnRzPVwiMTAgMTcgMTUgMTIgMTAgN1wiPjwvcG9seWxpbmU+PGxpbmUgeDE9XCIxNVwiIHkxPVwiMTJcIiB4Mj1cIjNcIiB5Mj1cIjEyXCI+PC9saW5lPjwvc3ZnPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJkcmF3ZXItaXRlbS1sYWJlbFwiPlNpZ24gSW4gLyBSZWdpc3Rlcjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9MaW5rPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vYmlsZS1kcmF3ZXItc3ViLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkcmF3ZXItc3ViLWhlYWRpbmdcIj5GZWF0dXJlZCBTaWxob3VldHRlczwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZHJhd2VyLXN1Yi1ncmlkXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxMaW5rIHRvPVwiL3Nob3A/Y2F0ZWdvcnk9U3RyYWlnaHQgQ3V0XCIgb25DbGljaz17KCkgPT4gc2V0TW9iaWxlTWVudU9wZW4oZmFsc2UpfSBjbGFzc05hbWU9XCJkcmF3ZXItc3ViLWNoaXBcIj5TdHJhaWdodCBDdXQ8L0xpbms+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxMaW5rIHRvPVwiL3Nob3A/Y2F0ZWdvcnk9QW5hcmthbGlcIiBvbkNsaWNrPXsoKSA9PiBzZXRNb2JpbGVNZW51T3BlbihmYWxzZSl9IGNsYXNzTmFtZT1cImRyYXdlci1zdWItY2hpcFwiPkFuYXJrYWxpIFNldHM8L0xpbms+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxMaW5rIHRvPVwiL3Nob3A/Y2F0ZWdvcnk9VHVuaWNcIiBvbkNsaWNrPXsoKSA9PiBzZXRNb2JpbGVNZW51T3BlbihmYWxzZSl9IGNsYXNzTmFtZT1cImRyYXdlci1zdWItY2hpcFwiPlR1bmljIERyZXNzZXM8L0xpbms+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxMaW5rIHRvPVwiL3Nob3A/Y2F0ZWdvcnk9RnVzaW9uXCIgb25DbGljaz17KCkgPT4gc2V0TW9iaWxlTWVudU9wZW4oZmFsc2UpfSBjbGFzc05hbWU9XCJkcmF3ZXItc3ViLWNoaXBcIj5GdXNpb24gV2VhcjwvTGluaz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9iaWxlLWRyYXdlci1mb290ZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZHJhd2VyLWZvb3Rlci1iYWRnZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCIxNVwiIGhlaWdodD1cIjE1XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwidmFyKC0tY29sb3ItcHJpbWFyeSlcIiBzdHJva2VXaWR0aD1cIjJcIj48cG9seWdvbiBwb2ludHM9XCIxMiAyIDE1LjA5IDguMjYgMjIgOS4yNyAxNyAxNC4xNCAxOC4xOCAyMS4wMiAxMiAxNy43NyA1LjgyIDIxLjAyIDcgMTQuMTQgMiA5LjI3IDguOTEgOC4yNiAxMiAyXCI+PC9wb2x5Z29uPjwvc3ZnPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPjEwMCUgSGFuZGNyYWZ0ZWQgTHV4dXJ5IEd1YXJhbnRlZTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvUmVhY3QuRnJhZ21lbnQ+LFxyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keVxyXG4gICAgICAgICAgICApfVxyXG5cclxuICAgICAgICAgICAgey8qIENsaWNrIG91dHNpZGUgbGlzdGVuZXIgZm9yIHNlYXJjaCAqL31cclxuICAgICAgICAgICAge2lzRm9jdXNlZCAmJiAoXHJcbiAgICAgICAgICAgICAgICA8ZGl2IG9uQ2xpY2s9eygpID0+IHNldElzRm9jdXNlZChmYWxzZSl9IHN0eWxlPXt7IHBvc2l0aW9uOiAnZml4ZWQnLCB0b3A6IDAsIGxlZnQ6IDAsIHJpZ2h0OiAwLCBib3R0b206IDAsIHpJbmRleDogOTk5IH19IC8+XHJcbiAgICAgICAgICAgICl9XHJcbiAgICAgICAgPC9uYXY+XHJcbiAgICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgTmF2YmFyO1xyXG4iXX0=