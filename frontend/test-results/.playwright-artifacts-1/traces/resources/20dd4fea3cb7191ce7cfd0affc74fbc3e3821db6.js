import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/pages/Home.jsx");const React = __vite__cjsImport0_react; const useState = __vite__cjsImport0_react["useState"]; const useEffect = __vite__cjsImport0_react["useEffect"]; const useRef = __vite__cjsImport0_react["useRef"]; const useMemo = __vite__cjsImport0_react["useMemo"]; const useCallback = __vite__cjsImport0_react["useCallback"];const _jsxDEV = __vite__cjsImport5_react_jsxDevRuntime["jsxDEV"];import __vite__cjsImport0_react from "/node_modules/.vite/deps/react.js?v=42a9b196";
import { useNavigate, Link, useLocation, useParams, Routes, Route, Navigate, BrowserRouter } from "/node_modules/.vite/deps/react-router-dom.js?v=42a9b196";
import RenderProductCard from "/src/components/ProductCard.jsx";
import ProductSkeletonGrid from "/src/components/ProductSkeletonGrid.jsx";
import Shop from "/src/pages/Shop.jsx";
var _jsxFileName = "D:/The Ethnic Touch/frontend/src/pages/Home.jsx";
import __vite__cjsImport5_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=42a9b196";
var _s = $RefreshSig$();
const Home = ({ productsGlobal, wishlist, toggleWishlist }) => {
	_s();
	const bestSellers = React.useMemo(() => {
		return (productsGlobal || []).filter((p) => p.isBestSeller).slice(0, 4);
	}, [productsGlobal]);
	const newArrivals = React.useMemo(() => {
		return (productsGlobal || []).filter((p) => p.isNewArrival).slice(0, 4);
	}, [productsGlobal]);
	return /* @__PURE__ */ _jsxDEV("div", { children: [
		/* @__PURE__ */ _jsxDEV("header", {
			className: "hero",
			children: [/* @__PURE__ */ _jsxDEV("div", {
				className: "hero-content",
				children: [
					/* @__PURE__ */ _jsxDEV("span", {
						className: "hero-subtitle",
						children: "Handcrafted Luxury"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 21,
						columnNumber: 21
					}, this),
					/* @__PURE__ */ _jsxDEV("h1", { children: "Minimalist Indo-Western Silhouette" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 22,
						columnNumber: 21
					}, this),
					/* @__PURE__ */ _jsxDEV("p", { children: "A curated destination for timeless pastel aesthetics, tailored meticulously with pure breathable fabrics for the contemporary woman." }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 23,
						columnNumber: 21
					}, this),
					/* @__PURE__ */ _jsxDEV(Link, {
						to: "/shop",
						className: "btn btn-primary",
						children: "Browse Shop"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 24,
						columnNumber: 21
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 20,
				columnNumber: 17
			}, this), /* @__PURE__ */ _jsxDEV("div", {
				className: "hero-image",
				children: /* @__PURE__ */ _jsxDEV("img", {
					src: "./images/hero_banner.png",
					alt: "Premium Indo-Western Pastel Kurthi Fashion Model"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 27,
					columnNumber: 21
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 26,
				columnNumber: 17
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 19,
			columnNumber: 13
		}, this),
		/* @__PURE__ */ _jsxDEV("section", {
			className: "home-section",
			style: {
				backgroundColor: "#FAF8F5",
				paddingTop: "4rem",
				paddingBottom: "4rem"
			},
			children: [/* @__PURE__ */ _jsxDEV("div", {
				className: "home-section-header",
				children: [/* @__PURE__ */ _jsxDEV("h2", { children: "Shop by Category" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 34,
					columnNumber: 21
				}, this), /* @__PURE__ */ _jsxDEV("p", { children: "Discover boutique silhouettes, tailored for every occasion and style preference" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 35,
					columnNumber: 21
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 33,
				columnNumber: 17
			}, this), /* @__PURE__ */ _jsxDEV("div", {
				className: "home-category-grid",
				children: [
					{
						name: "Straight Cut",
						label: "Straight Cut",
						desc: "Crisp & Modern",
						image: "./images/kurthi_peach.png",
						color: "var(--color-peach)"
					},
					{
						name: "Anarkali",
						label: "Anarkali Set",
						desc: "Flowing Grace",
						image: "./images/kurthi_mint.png",
						color: "var(--color-mint)"
					},
					{
						name: "Tunic",
						label: "Tunic Dress",
						desc: "Casual Comfort",
						image: "./images/kurthi_lavender.png",
						color: "var(--color-lavender)"
					},
					{
						name: "Fusion",
						label: "Fusion Wear",
						desc: "Indo-Western Styles",
						image: "./images/kurthi_blue.png",
						color: "var(--color-blue)"
					}
				].map((cat) => /* @__PURE__ */ _jsxDEV(Link, {
					to: `/shop?category=${cat.name}`,
					className: "home-category-card",
					children: [/* @__PURE__ */ _jsxDEV("div", {
						className: "home-category-img-container",
						style: { backgroundColor: cat.color },
						children: /* @__PURE__ */ _jsxDEV("img", {
							src: cat.image,
							alt: cat.label,
							style: {
								width: "100%",
								height: "100%",
								objectFit: "cover"
							}
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 46,
							columnNumber: 33
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 45,
						columnNumber: 29
					}, this), /* @__PURE__ */ _jsxDEV("div", {
						className: "home-category-overlay",
						children: [/* @__PURE__ */ _jsxDEV("span", { children: cat.desc }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 49,
							columnNumber: 33
						}, this), /* @__PURE__ */ _jsxDEV("h3", { children: cat.label }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 50,
							columnNumber: 33
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 48,
						columnNumber: 29
					}, this)]
				}, cat.name, true, {
					fileName: _jsxFileName,
					lineNumber: 44,
					columnNumber: 25
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 37,
				columnNumber: 17
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 32,
			columnNumber: 13
		}, this),
		/* @__PURE__ */ _jsxDEV("section", {
			className: "home-section",
			children: [/* @__PURE__ */ _jsxDEV("div", {
				className: "home-section-header",
				children: [/* @__PURE__ */ _jsxDEV("h2", { children: "Most Coveted Styles" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 60,
					columnNumber: 21
				}, this), /* @__PURE__ */ _jsxDEV("p", { children: "Highly sought-after silhouettes curated by our boutique designers for timeless appeal" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 61,
					columnNumber: 21
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 59,
				columnNumber: 17
			}, this), bestSellers.length === 0 ? /* @__PURE__ */ _jsxDEV(ProductSkeletonGrid, { count: 4 }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 64,
				columnNumber: 21
			}, this) : /* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("div", {
				className: "product-grid",
				children: bestSellers.map((product) => /* @__PURE__ */ _jsxDEV(RenderProductCard, {
					product,
					wishlist,
					toggleWishlist
				}, product.id, false, {
					fileName: _jsxFileName,
					lineNumber: 69,
					columnNumber: 33
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 67,
				columnNumber: 25
			}, this), /* @__PURE__ */ _jsxDEV("div", {
				className: "home-action-btn-container",
				children: /* @__PURE__ */ _jsxDEV(Link, {
					to: "/shop?bestSeller=true",
					className: "btn-premium-outline",
					children: ["View All Best Sellers", /* @__PURE__ */ _jsxDEV("svg", {
						width: "14",
						height: "14",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "2",
						children: [/* @__PURE__ */ _jsxDEV("line", {
							x1: "5",
							y1: "12",
							x2: "19",
							y2: "12"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 80,
							columnNumber: 131
						}, this), /* @__PURE__ */ _jsxDEV("polyline", { points: "12 5 19 12 12 19" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 80,
							columnNumber: 175
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 80,
						columnNumber: 33
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 78,
					columnNumber: 29
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 77,
				columnNumber: 25
			}, this)] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 66,
				columnNumber: 21
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 58,
			columnNumber: 13
		}, this),
		/* @__PURE__ */ _jsxDEV("section", {
			className: "brand-story-section",
			children: /* @__PURE__ */ _jsxDEV("div", {
				className: "brand-story-container",
				children: [/* @__PURE__ */ _jsxDEV("div", {
					className: "brand-story-image",
					children: /* @__PURE__ */ _jsxDEV("img", {
						src: "./images/login_art.png",
						alt: "Detail of fine tailoring and pastel embroidery"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 91,
						columnNumber: 25
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 90,
					columnNumber: 21
				}, this), /* @__PURE__ */ _jsxDEV("div", {
					className: "brand-story-text",
					children: [
						/* @__PURE__ */ _jsxDEV("span", {
							className: "brand-story-tag",
							children: "The Boutique Philosophy"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 94,
							columnNumber: 25
						}, this),
						/* @__PURE__ */ _jsxDEV("h2", { children: "Honoring Slow Fashion & Indian Aesthetics" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 95,
							columnNumber: 25
						}, this),
						/* @__PURE__ */ _jsxDEV("p", { children: "At The Ethnic Touch, we discard mass production rules. Every garment is treated as a piece of art, starting from premium handpicked cotton and linens to natural mineral dyes and elegant embroidery details." }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 96,
							columnNumber: 25
						}, this),
						/* @__PURE__ */ _jsxDEV("div", {
							className: "brand-values-grid",
							children: [
								/* @__PURE__ */ _jsxDEV("div", {
									className: "value-card",
									children: [
										/* @__PURE__ */ _jsxDEV("div", {
											className: "value-icon",
											children: /* @__PURE__ */ _jsxDEV("svg", {
												viewBox: "0 0 24 24",
												width: "24",
												height: "24",
												stroke: "currentColor",
												strokeWidth: "1.75",
												fill: "none",
												strokeLinecap: "round",
												strokeLinejoin: "round",
												children: /* @__PURE__ */ _jsxDEV("path", { d: "M12 2v20M7 6h10M5 12h14M7 18h10" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 101,
													columnNumber: 183
												}, this)
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 101,
												columnNumber: 37
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 100,
											columnNumber: 33
										}, this),
										/* @__PURE__ */ _jsxDEV("h3", { children: "Loomed with Love" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 103,
											columnNumber: 33
										}, this),
										/* @__PURE__ */ _jsxDEV("p", { children: "Sourced from traditional Indian weaver clusters, celebrating pure, raw weaves that get softer with every wear." }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 104,
											columnNumber: 33
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 99,
									columnNumber: 29
								}, this),
								/* @__PURE__ */ _jsxDEV("div", {
									className: "value-card",
									children: [
										/* @__PURE__ */ _jsxDEV("div", {
											className: "value-icon",
											children: /* @__PURE__ */ _jsxDEV("svg", {
												viewBox: "0 0 24 24",
												width: "24",
												height: "24",
												stroke: "currentColor",
												strokeWidth: "1.75",
												fill: "none",
												strokeLinecap: "round",
												strokeLinejoin: "round",
												children: /* @__PURE__ */ _jsxDEV("path", { d: "M12 22v-6M12 16a4 4 0 0 0-4-4c-1.5 0-3 1-3 3s1.5 3 3 3h8c1.5 0 3-1 3-3s-1.5-3-3-3a4 4 0 0 0-4 4z" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 109,
													columnNumber: 183
												}, this)
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 109,
												columnNumber: 37
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 108,
											columnNumber: 33
										}, this),
										/* @__PURE__ */ _jsxDEV("h3", { children: "Bespoke Colorways" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 111,
											columnNumber: 33
										}, this),
										/* @__PURE__ */ _jsxDEV("p", { children: "Our signatures pale peach, mint green, and lavender palettes are carefully dyed in small, curated lots." }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 112,
											columnNumber: 33
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 107,
									columnNumber: 29
								}, this),
								/* @__PURE__ */ _jsxDEV("div", {
									className: "value-card",
									children: [
										/* @__PURE__ */ _jsxDEV("div", {
											className: "value-icon",
											children: /* @__PURE__ */ _jsxDEV("svg", {
												viewBox: "0 0 24 24",
												width: "24",
												height: "24",
												stroke: "currentColor",
												strokeWidth: "1.75",
												fill: "none",
												strokeLinecap: "round",
												strokeLinejoin: "round",
												children: [
													/* @__PURE__ */ _jsxDEV("circle", {
														cx: "6",
														cy: "6",
														r: "3"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 117,
														columnNumber: 183
													}, this),
													/* @__PURE__ */ _jsxDEV("circle", {
														cx: "6",
														cy: "18",
														r: "3"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 117,
														columnNumber: 212
													}, this),
													/* @__PURE__ */ _jsxDEV("line", {
														x1: "20",
														y1: "4",
														x2: "8.12",
														y2: "15.88"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 117,
														columnNumber: 242
													}, this),
													/* @__PURE__ */ _jsxDEV("line", {
														x1: "14.47",
														y1: "14.48",
														x2: "20",
														y2: "20"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 117,
														columnNumber: 285
													}, this),
													/* @__PURE__ */ _jsxDEV("line", {
														x1: "8.12",
														y1: "8.12",
														x2: "12",
														y2: "12"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 117,
														columnNumber: 330
													}, this)
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 117,
												columnNumber: 37
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 116,
											columnNumber: 33
										}, this),
										/* @__PURE__ */ _jsxDEV("h3", { children: "Tailored For You" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 119,
											columnNumber: 33
										}, this),
										/* @__PURE__ */ _jsxDEV("p", { children: "Designed with meticulous cuts, including standard custom margins, ensuring a premium contour drape." }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 120,
											columnNumber: 33
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 115,
									columnNumber: 29
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 98,
							columnNumber: 25
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 93,
					columnNumber: 21
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 89,
				columnNumber: 17
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 88,
			columnNumber: 13
		}, this),
		/* @__PURE__ */ _jsxDEV("section", {
			className: "home-section",
			style: {
				borderTop: "1px solid rgba(0,0,0,0.03)",
				paddingBottom: "8rem"
			},
			children: [/* @__PURE__ */ _jsxDEV("div", {
				className: "home-section-header",
				children: [/* @__PURE__ */ _jsxDEV("h2", { children: "Fresh Off the Loom" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 130,
					columnNumber: 21
				}, this), /* @__PURE__ */ _jsxDEV("p", { children: "Be the first to step out in our latest custom creations and season-defining tones" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 131,
					columnNumber: 21
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 129,
				columnNumber: 17
			}, this), newArrivals.length === 0 ? /* @__PURE__ */ _jsxDEV("div", {
				style: {
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					minHeight: "20vh"
				},
				children: /* @__PURE__ */ _jsxDEV("p", {
					style: {
						color: "#8c8883",
						fontStyle: "italic"
					},
					children: "Weaving new collections..."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 135,
					columnNumber: 25
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 134,
				columnNumber: 21
			}, this) : /* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("div", {
				className: "product-grid",
				children: newArrivals.map((product) => /* @__PURE__ */ _jsxDEV(RenderProductCard, {
					product,
					wishlist,
					toggleWishlist
				}, product.id, false, {
					fileName: _jsxFileName,
					lineNumber: 141,
					columnNumber: 33
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 139,
				columnNumber: 25
			}, this), /* @__PURE__ */ _jsxDEV("div", {
				className: "home-action-btn-container",
				children: /* @__PURE__ */ _jsxDEV(Link, {
					to: "/shop?newArrival=true",
					className: "btn-premium-outline",
					children: ["Explore New Arrivals", /* @__PURE__ */ _jsxDEV("svg", {
						width: "14",
						height: "14",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "2",
						children: [/* @__PURE__ */ _jsxDEV("line", {
							x1: "5",
							y1: "12",
							x2: "19",
							y2: "12"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 152,
							columnNumber: 131
						}, this), /* @__PURE__ */ _jsxDEV("polyline", { points: "12 5 19 12 12 19" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 152,
							columnNumber: 175
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 152,
						columnNumber: 33
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 150,
					columnNumber: 29
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 149,
				columnNumber: 25
			}, this)] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 138,
				columnNumber: 21
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 128,
			columnNumber: 13
		}, this)
	] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 17,
		columnNumber: 9
	}, this);
};
_s(Home, "ZzjvhWfx7BqsnVXWa2ZPBUeiUxk=");
_c = Home;
export default Home;
var _c;
$RefreshReg$(_c, "Home");
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;
import * as __vite_react_currentExports from "/src/pages/Home.jsx";
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }

  const currentExports = __vite_react_currentExports;
  queueMicrotask(() => {
    RefreshRuntime.registerExportsForReactRefresh("D:/The Ethnic Touch/frontend/src/pages/Home.jsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("D:/The Ethnic Touch/frontend/src/pages/Home.jsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
function $RefreshReg$(type, id) { return RefreshRuntime.register(type, "D:/The Ethnic Touch/frontend/src/pages/Home.jsx" + ' ' + id); }
function $RefreshSig$() { return RefreshRuntime.createSignatureFunctionForTransform(); }

//# sourceMappingURL=data:application/json;base64,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QUFDLHdCQUFDLFlBQUQsRUFBVSxRQUFPLG1CQUE2Qjs7OztjQUFNOzs7OzthQUNoTTs7Ozs7O0dBQ0w7Ozs7V0FDSjs7OztXQUVKOzs7Ozs7Q0FDUjs7Ozs7QUFFYjs7O0FBRUEsZUFBZSIsIm5hbWVzIjpbXSwic291cmNlcyI6WyJIb21lLmpzeCJdLCJ2ZXJzaW9uIjozLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlU3RhdGUsIHVzZUVmZmVjdCwgdXNlUmVmLCB1c2VNZW1vLCB1c2VDYWxsYmFjayB9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgdXNlTmF2aWdhdGUsIExpbmssIHVzZUxvY2F0aW9uLCB1c2VQYXJhbXMsIFJvdXRlcywgUm91dGUsIE5hdmlnYXRlLCBCcm93c2VyUm91dGVyIH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSc7XHJcbmltcG9ydCBSZW5kZXJQcm9kdWN0Q2FyZCBmcm9tICcuLi9jb21wb25lbnRzL1Byb2R1Y3RDYXJkJztcclxuaW1wb3J0IFByb2R1Y3RTa2VsZXRvbkdyaWQgZnJvbSAnLi4vY29tcG9uZW50cy9Qcm9kdWN0U2tlbGV0b25HcmlkJztcclxuaW1wb3J0IFNob3AgZnJvbSAnLi9TaG9wJztcclxuXHJcbmNvbnN0IEhvbWUgPSAoeyBwcm9kdWN0c0dsb2JhbCwgd2lzaGxpc3QsIHRvZ2dsZVdpc2hsaXN0IH0pID0+IHtcclxuICAgIGNvbnN0IGJlc3RTZWxsZXJzID0gUmVhY3QudXNlTWVtbygoKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIChwcm9kdWN0c0dsb2JhbCB8fCBbXSkuZmlsdGVyKHAgPT4gcC5pc0Jlc3RTZWxsZXIpLnNsaWNlKDAsIDQpO1xyXG4gICAgfSwgW3Byb2R1Y3RzR2xvYmFsXSk7XHJcblxyXG4gICAgY29uc3QgbmV3QXJyaXZhbHMgPSBSZWFjdC51c2VNZW1vKCgpID0+IHtcclxuICAgICAgICByZXR1cm4gKHByb2R1Y3RzR2xvYmFsIHx8IFtdKS5maWx0ZXIocCA9PiBwLmlzTmV3QXJyaXZhbCkuc2xpY2UoMCwgNCk7XHJcbiAgICB9LCBbcHJvZHVjdHNHbG9iYWxdKTtcclxuXHJcbiAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIHsvKiBFZGl0b3JpYWwgSGVybyBCYW5uZXIgKi99XHJcbiAgICAgICAgICAgIDxoZWFkZXIgY2xhc3NOYW1lPVwiaGVyb1wiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoZXJvLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJoZXJvLXN1YnRpdGxlXCI+SGFuZGNyYWZ0ZWQgTHV4dXJ5PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDxoMT5NaW5pbWFsaXN0IEluZG8tV2VzdGVybiBTaWxob3VldHRlPC9oMT5cclxuICAgICAgICAgICAgICAgICAgICA8cD5BIGN1cmF0ZWQgZGVzdGluYXRpb24gZm9yIHRpbWVsZXNzIHBhc3RlbCBhZXN0aGV0aWNzLCB0YWlsb3JlZCBtZXRpY3Vsb3VzbHkgd2l0aCBwdXJlIGJyZWF0aGFibGUgZmFicmljcyBmb3IgdGhlIGNvbnRlbXBvcmFyeSB3b21hbi48L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgPExpbmsgdG89XCIvc2hvcFwiIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeVwiPkJyb3dzZSBTaG9wPC9MaW5rPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImhlcm8taW1hZ2VcIj5cclxuICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz1cIi4vaW1hZ2VzL2hlcm9fYmFubmVyLnBuZ1wiIGFsdD1cIlByZW1pdW0gSW5kby1XZXN0ZXJuIFBhc3RlbCBLdXJ0aGkgRmFzaGlvbiBNb2RlbFwiIC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9oZWFkZXI+XHJcblxyXG4gICAgICAgICAgICB7LyogU2hvcCBieSBDYXRlZ29yeSAqL31cclxuICAgICAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwiaG9tZS1zZWN0aW9uXCIgc3R5bGU9e3sgYmFja2dyb3VuZENvbG9yOiAnI0ZBRjhGNScsIHBhZGRpbmdUb3A6ICc0cmVtJywgcGFkZGluZ0JvdHRvbTogJzRyZW0nIH19PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJob21lLXNlY3Rpb24taGVhZGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGgyPlNob3AgYnkgQ2F0ZWdvcnk8L2gyPlxyXG4gICAgICAgICAgICAgICAgICAgIDxwPkRpc2NvdmVyIGJvdXRpcXVlIHNpbGhvdWV0dGVzLCB0YWlsb3JlZCBmb3IgZXZlcnkgb2NjYXNpb24gYW5kIHN0eWxlIHByZWZlcmVuY2U8L3A+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaG9tZS1jYXRlZ29yeS1ncmlkXCI+XHJcbiAgICAgICAgICAgICAgICAgICAge1tcclxuICAgICAgICAgICAgICAgICAgICAgICAgeyBuYW1lOiAnU3RyYWlnaHQgQ3V0JywgbGFiZWw6ICdTdHJhaWdodCBDdXQnLCBkZXNjOiAnQ3Jpc3AgJiBNb2Rlcm4nLCBpbWFnZTogJy4vaW1hZ2VzL2t1cnRoaV9wZWFjaC5wbmcnLCBjb2xvcjogJ3ZhcigtLWNvbG9yLXBlYWNoKScgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgeyBuYW1lOiAnQW5hcmthbGknLCBsYWJlbDogJ0FuYXJrYWxpIFNldCcsIGRlc2M6ICdGbG93aW5nIEdyYWNlJywgaW1hZ2U6ICcuL2ltYWdlcy9rdXJ0aGlfbWludC5wbmcnLCBjb2xvcjogJ3ZhcigtLWNvbG9yLW1pbnQpJyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7IG5hbWU6ICdUdW5pYycsIGxhYmVsOiAnVHVuaWMgRHJlc3MnLCBkZXNjOiAnQ2FzdWFsIENvbWZvcnQnLCBpbWFnZTogJy4vaW1hZ2VzL2t1cnRoaV9sYXZlbmRlci5wbmcnLCBjb2xvcjogJ3ZhcigtLWNvbG9yLWxhdmVuZGVyKScgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgeyBuYW1lOiAnRnVzaW9uJywgbGFiZWw6ICdGdXNpb24gV2VhcicsIGRlc2M6ICdJbmRvLVdlc3Rlcm4gU3R5bGVzJywgaW1hZ2U6ICcuL2ltYWdlcy9rdXJ0aGlfYmx1ZS5wbmcnLCBjb2xvcjogJ3ZhcigtLWNvbG9yLWJsdWUpJyB9XHJcbiAgICAgICAgICAgICAgICAgICAgXS5tYXAoY2F0ID0+IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgPExpbmsgdG89e2Avc2hvcD9jYXRlZ29yeT0ke2NhdC5uYW1lfWB9IGtleT17Y2F0Lm5hbWV9IGNsYXNzTmFtZT1cImhvbWUtY2F0ZWdvcnktY2FyZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJob21lLWNhdGVnb3J5LWltZy1jb250YWluZXJcIiBzdHlsZT17eyBiYWNrZ3JvdW5kQ29sb3I6IGNhdC5jb2xvciB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz17Y2F0LmltYWdlfSBhbHQ9e2NhdC5sYWJlbH0gc3R5bGU9e3sgd2lkdGg6ICcxMDAlJywgaGVpZ2h0OiAnMTAwJScsIG9iamVjdEZpdDogJ2NvdmVyJyB9fSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImhvbWUtY2F0ZWdvcnktb3ZlcmxheVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPntjYXQuZGVzY308L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGgzPntjYXQubGFiZWx9PC9oMz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L0xpbms+XHJcbiAgICAgICAgICAgICAgICAgICAgKSl9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9zZWN0aW9uPlxyXG5cclxuICAgICAgICAgICAgey8qIEJlc3QgU2VsbGVycyBTZWN0aW9uICovfVxyXG4gICAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJob21lLXNlY3Rpb25cIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaG9tZS1zZWN0aW9uLWhlYWRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxoMj5Nb3N0IENvdmV0ZWQgU3R5bGVzPC9oMj5cclxuICAgICAgICAgICAgICAgICAgICA8cD5IaWdobHkgc291Z2h0LWFmdGVyIHNpbGhvdWV0dGVzIGN1cmF0ZWQgYnkgb3VyIGJvdXRpcXVlIGRlc2lnbmVycyBmb3IgdGltZWxlc3MgYXBwZWFsPC9wPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICB7YmVzdFNlbGxlcnMubGVuZ3RoID09PSAwID8gKFxyXG4gICAgICAgICAgICAgICAgICAgIDxQcm9kdWN0U2tlbGV0b25HcmlkIGNvdW50PXs0fSAvPlxyXG4gICAgICAgICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInByb2R1Y3QtZ3JpZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2Jlc3RTZWxsZXJzLm1hcChwcm9kdWN0ID0+IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8UmVuZGVyUHJvZHVjdENhcmQgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleT17cHJvZHVjdC5pZH0gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2R1Y3Q9e3Byb2R1Y3R9IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXNobGlzdD17d2lzaGxpc3R9IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2dnbGVXaXNobGlzdD17dG9nZ2xlV2lzaGxpc3R9IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaG9tZS1hY3Rpb24tYnRuLWNvbnRhaW5lclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPExpbmsgdG89XCIvc2hvcD9iZXN0U2VsbGVyPXRydWVcIiBjbGFzc05hbWU9XCJidG4tcHJlbWl1bS1vdXRsaW5lXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVmlldyBBbGwgQmVzdCBTZWxsZXJzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjE0XCIgaGVpZ2h0PVwiMTRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjJcIj48bGluZSB4MT1cIjVcIiB5MT1cIjEyXCIgeDI9XCIxOVwiIHkyPVwiMTJcIj48L2xpbmU+PHBvbHlsaW5lIHBvaW50cz1cIjEyIDUgMTkgMTIgMTIgMTlcIj48L3BvbHlsaW5lPjwvc3ZnPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9MaW5rPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgIDwvc2VjdGlvbj5cclxuXHJcbiAgICAgICAgICAgIHsvKiBCcmFuZCBTdG9yeSBTaG93Y2FzZSAqL31cclxuICAgICAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwiYnJhbmQtc3Rvcnktc2VjdGlvblwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJicmFuZC1zdG9yeS1jb250YWluZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJyYW5kLXN0b3J5LWltYWdlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPVwiLi9pbWFnZXMvbG9naW5fYXJ0LnBuZ1wiIGFsdD1cIkRldGFpbCBvZiBmaW5lIHRhaWxvcmluZyBhbmQgcGFzdGVsIGVtYnJvaWRlcnlcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnJhbmQtc3RvcnktdGV4dFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJicmFuZC1zdG9yeS10YWdcIj5UaGUgQm91dGlxdWUgUGhpbG9zb3BoeTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGgyPkhvbm9yaW5nIFNsb3cgRmFzaGlvbiAmIEluZGlhbiBBZXN0aGV0aWNzPC9oMj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHA+QXQgVGhlIEV0aG5pYyBUb3VjaCwgd2UgZGlzY2FyZCBtYXNzIHByb2R1Y3Rpb24gcnVsZXMuIEV2ZXJ5IGdhcm1lbnQgaXMgdHJlYXRlZCBhcyBhIHBpZWNlIG9mIGFydCwgc3RhcnRpbmcgZnJvbSBwcmVtaXVtIGhhbmRwaWNrZWQgY290dG9uIGFuZCBsaW5lbnMgdG8gbmF0dXJhbCBtaW5lcmFsIGR5ZXMgYW5kIGVsZWdhbnQgZW1icm9pZGVyeSBkZXRhaWxzLjwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnJhbmQtdmFsdWVzLWdyaWRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidmFsdWUtY2FyZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidmFsdWUtaWNvblwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3ZnIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjEuNzVcIiBmaWxsPVwibm9uZVwiIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIj48cGF0aCBkPVwiTTEyIDJ2MjBNNyA2aDEwTTUgMTJoMTRNNyAxOGgxMFwiLz48L3N2Zz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDM+TG9vbWVkIHdpdGggTG92ZTwvaDM+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHA+U291cmNlZCBmcm9tIHRyYWRpdGlvbmFsIEluZGlhbiB3ZWF2ZXIgY2x1c3RlcnMsIGNlbGVicmF0aW5nIHB1cmUsIHJhdyB3ZWF2ZXMgdGhhdCBnZXQgc29mdGVyIHdpdGggZXZlcnkgd2Vhci48L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInZhbHVlLWNhcmRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInZhbHVlLWljb25cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHN2ZyB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIxLjc1XCIgZmlsbD1cIm5vbmVcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCI+PHBhdGggZD1cIk0xMiAyMnYtNk0xMiAxNmE0IDQgMCAwIDAtNC00Yy0xLjUgMC0zIDEtMyAzczEuNSAzIDMgM2g4YzEuNSAwIDMtMSAzLTNzLTEuNS0zLTMtM2E0IDQgMCAwIDAtNCA0elwiLz48L3N2Zz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDM+QmVzcG9rZSBDb2xvcndheXM8L2gzPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwPk91ciBzaWduYXR1cmVzIHBhbGUgcGVhY2gsIG1pbnQgZ3JlZW4sIGFuZCBsYXZlbmRlciBwYWxldHRlcyBhcmUgY2FyZWZ1bGx5IGR5ZWQgaW4gc21hbGwsIGN1cmF0ZWQgbG90cy48L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInZhbHVlLWNhcmRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInZhbHVlLWljb25cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHN2ZyB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIxLjc1XCIgZmlsbD1cIm5vbmVcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCI+PGNpcmNsZSBjeD1cIjZcIiBjeT1cIjZcIiByPVwiM1wiLz48Y2lyY2xlIGN4PVwiNlwiIGN5PVwiMThcIiByPVwiM1wiLz48bGluZSB4MT1cIjIwXCIgeTE9XCI0XCIgeDI9XCI4LjEyXCIgeTI9XCIxNS44OFwiLz48bGluZSB4MT1cIjE0LjQ3XCIgeTE9XCIxNC40OFwiIHgyPVwiMjBcIiB5Mj1cIjIwXCIvPjxsaW5lIHgxPVwiOC4xMlwiIHkxPVwiOC4xMlwiIHgyPVwiMTJcIiB5Mj1cIjEyXCIvPjwvc3ZnPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoMz5UYWlsb3JlZCBGb3IgWW91PC9oMz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD5EZXNpZ25lZCB3aXRoIG1ldGljdWxvdXMgY3V0cywgaW5jbHVkaW5nIHN0YW5kYXJkIGN1c3RvbSBtYXJnaW5zLCBlbnN1cmluZyBhIHByZW1pdW0gY29udG91ciBkcmFwZS48L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9zZWN0aW9uPlxyXG5cclxuICAgICAgICAgICAgey8qIE5ldyBBcnJpdmFscyBTZWN0aW9uICovfVxyXG4gICAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJob21lLXNlY3Rpb25cIiBzdHlsZT17eyBib3JkZXJUb3A6ICcxcHggc29saWQgcmdiYSgwLDAsMCwwLjAzKScsIHBhZGRpbmdCb3R0b206ICc4cmVtJyB9fT5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaG9tZS1zZWN0aW9uLWhlYWRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxoMj5GcmVzaCBPZmYgdGhlIExvb208L2gyPlxyXG4gICAgICAgICAgICAgICAgICAgIDxwPkJlIHRoZSBmaXJzdCB0byBzdGVwIG91dCBpbiBvdXIgbGF0ZXN0IGN1c3RvbSBjcmVhdGlvbnMgYW5kIHNlYXNvbi1kZWZpbmluZyB0b25lczwvcD5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAge25ld0Fycml2YWxzLmxlbmd0aCA9PT0gMCA/IChcclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgbWluSGVpZ2h0OiAnMjB2aCcgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPXt7IGNvbG9yOiAnIzhjODg4MycsIGZvbnRTdHlsZTogJ2l0YWxpYycgfX0+V2VhdmluZyBuZXcgY29sbGVjdGlvbnMuLi48L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHJvZHVjdC1ncmlkXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7bmV3QXJyaXZhbHMubWFwKHByb2R1Y3QgPT4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxSZW5kZXJQcm9kdWN0Q2FyZCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtwcm9kdWN0LmlkfSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvZHVjdD17cHJvZHVjdH0gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpc2hsaXN0PXt3aXNobGlzdH0gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvZ2dsZVdpc2hsaXN0PXt0b2dnbGVXaXNobGlzdH0gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICkpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJob21lLWFjdGlvbi1idG4tY29udGFpbmVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TGluayB0bz1cIi9zaG9wP25ld0Fycml2YWw9dHJ1ZVwiIGNsYXNzTmFtZT1cImJ0bi1wcmVtaXVtLW91dGxpbmVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBFeHBsb3JlIE5ldyBBcnJpdmFsc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCIxNFwiIGhlaWdodD1cIjE0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIyXCI+PGxpbmUgeDE9XCI1XCIgeTE9XCIxMlwiIHgyPVwiMTlcIiB5Mj1cIjEyXCI+PC9saW5lPjxwb2x5bGluZSBwb2ludHM9XCIxMiA1IDE5IDEyIDEyIDE5XCI+PC9wb2x5bGluZT48L3N2Zz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvTGluaz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICA8L3NlY3Rpb24+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgSG9tZTtcclxuIl19