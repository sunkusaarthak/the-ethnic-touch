import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/pages/WishlistPage.jsx");const React = __vite__cjsImport0_react; const useState = __vite__cjsImport0_react["useState"]; const useEffect = __vite__cjsImport0_react["useEffect"]; const useRef = __vite__cjsImport0_react["useRef"]; const useMemo = __vite__cjsImport0_react["useMemo"]; const useCallback = __vite__cjsImport0_react["useCallback"];const _jsxDEV = __vite__cjsImport4_react_jsxDevRuntime["jsxDEV"];import __vite__cjsImport0_react from "/node_modules/.vite/deps/react.js?v=42a9b196";
import { useNavigate, Link, useLocation, useParams, Routes, Route, Navigate, BrowserRouter } from "/node_modules/.vite/deps/react-router-dom.js?v=42a9b196";
import Cart from "/src/pages/Cart.jsx";
import Shop from "/src/pages/Shop.jsx";
var _jsxFileName = "D:/The Ethnic Touch/frontend/src/pages/WishlistPage.jsx";
import __vite__cjsImport4_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=42a9b196";
const WishlistPage = ({ wishlist, toggleWishlist, addToCart }) => {
	return /* @__PURE__ */ _jsxDEV("div", {
		className: "wishlist-page-container",
		style: {
			padding: "1.25rem 5% 3rem",
			maxWidth: "1200px",
			margin: "0 auto",
			minHeight: "75vh"
		},
		children: [/* @__PURE__ */ _jsxDEV("div", {
			className: "wishlist-header-row",
			style: { marginBottom: "1.25rem" },
			children: [/* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("span", {
				className: "profile-eyebrow",
				style: { fontSize: "0.75rem" },
				children: "Wardrobe Selection"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 12,
				columnNumber: 21
			}, this), /* @__PURE__ */ _jsxDEV("h1", {
				style: {
					fontFamily: "var(--font-heading)",
					color: "var(--color-text)",
					fontWeight: "400",
					margin: "0.15rem 0 0",
					fontSize: "1.35rem"
				},
				children: "Your Wishlist"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 13,
				columnNumber: 21
			}, this)] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 11,
				columnNumber: 17
			}, this), /* @__PURE__ */ _jsxDEV("div", {
				style: {
					fontSize: "0.85rem",
					color: "#686461"
				},
				children: [
					wishlist.length,
					" ",
					wishlist.length === 1 ? "item" : "items",
					" saved"
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 15,
				columnNumber: 17
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 10,
			columnNumber: 13
		}, this), wishlist.length === 0 ? /* @__PURE__ */ _jsxDEV("div", {
			style: {
				textAlign: "center",
				padding: "4rem 1rem",
				background: "#FFFdfc",
				borderRadius: "12px",
				border: "1px dashed var(--color-peach)",
				maxWidth: "600px",
				margin: "1rem auto"
			},
			children: [
				/* @__PURE__ */ _jsxDEV("svg", {
					viewBox: "0 0 24 24",
					width: "40",
					height: "40",
					stroke: "var(--color-primary)",
					strokeWidth: "1.5",
					fill: "none",
					style: { marginBottom: "1rem" },
					children: /* @__PURE__ */ _jsxDEV("path", { d: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 23,
						columnNumber: 25
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 22,
					columnNumber: 21
				}, this),
				/* @__PURE__ */ _jsxDEV("h2", {
					style: {
						fontFamily: "var(--font-heading)",
						fontWeight: "400",
						marginBottom: "0.4rem",
						fontSize: "1.35rem"
					},
					children: "Your wishlist is empty"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 25,
					columnNumber: 21
				}, this),
				/* @__PURE__ */ _jsxDEV("p", {
					style: {
						margin: "0 auto 1.25rem",
						fontSize: "0.88rem",
						color: "#686461"
					},
					children: "Explore our premium collections and tap the heart icon to save products here."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 26,
					columnNumber: 21
				}, this),
				/* @__PURE__ */ _jsxDEV(Link, {
					to: "/shop",
					className: "btn btn-primary",
					style: {
						textDecoration: "none",
						padding: "0.6rem 1.8rem",
						fontSize: "0.85rem",
						borderRadius: "50px"
					},
					children: "Shop the Collection"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 27,
					columnNumber: 21
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 21,
			columnNumber: 17
		}, this) : /* @__PURE__ */ _jsxDEV("div", {
			className: "product-grid",
			style: {
				gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
				gap: "1.25rem"
			},
			children: wishlist.map((p) => {
				const handleQuickAddToCart = (e) => {
					e.preventDefault();
					const defaultSz = p.sizes && p.sizes.length > 0 ? p.sizes[0] : "S";
					addToCart({
						...p,
						size: defaultSz
					});
				};
				return /* @__PURE__ */ _jsxDEV("div", {
					style: { position: "relative" },
					children: /* @__PURE__ */ _jsxDEV("div", {
						className: "product-card",
						style: { padding: "0.65rem" },
						children: [/* @__PURE__ */ _jsxDEV(Link, {
							to: `/product/${p.id}`,
							style: {
								textDecoration: "none",
								color: "inherit",
								display: "block"
							},
							children: [/* @__PURE__ */ _jsxDEV("div", {
								className: "product-image-container",
								style: {
									position: "relative",
									borderRadius: "8px",
									overflow: "hidden"
								},
								children: [/* @__PURE__ */ _jsxDEV("div", {
									className: "wishlist-heart-btn active",
									onClick: (e) => {
										e.preventDefault();
										e.stopPropagation();
										toggleWishlist(p);
									},
									style: {
										top: "10px",
										right: "10px",
										width: "32px",
										height: "32px"
									},
									children: /* @__PURE__ */ _jsxDEV("svg", {
										viewBox: "0 0 24 24",
										width: "16",
										height: "16",
										children: /* @__PURE__ */ _jsxDEV("path", { d: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 48,
											columnNumber: 97
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 48,
										columnNumber: 49
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 43,
									columnNumber: 45
								}, this), /* @__PURE__ */ _jsxDEV("img", {
									src: p.imageUrl,
									alt: p.name,
									className: "product-image",
									style: {
										aspectRatio: "3/4",
										objectFit: "cover"
									}
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 50,
									columnNumber: 45
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 42,
								columnNumber: 41
							}, this), /* @__PURE__ */ _jsxDEV("div", {
								className: "product-info",
								style: {
									marginTop: "0.6rem",
									marginBottom: "0.75rem"
								},
								children: /* @__PURE__ */ _jsxDEV("div", {
									style: {
										flex: 1,
										minWidth: 0
									},
									children: [/* @__PURE__ */ _jsxDEV("h3", {
										className: "product-name",
										style: {
											whiteSpace: "nowrap",
											overflow: "hidden",
											textOverflow: "ellipsis",
											fontSize: "0.88rem",
											margin: "0 0 0.2rem"
										},
										children: p.name
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 54,
										columnNumber: 49
									}, this), /* @__PURE__ */ _jsxDEV("div", {
										className: "product-price",
										style: {
											fontSize: "0.9rem",
											fontWeight: "600"
										},
										children: ["₹", p.price.toLocaleString("en-IN")]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 55,
										columnNumber: 49
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 53,
									columnNumber: 45
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 52,
								columnNumber: 41
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 41,
							columnNumber: 37
						}, this), /* @__PURE__ */ _jsxDEV("button", {
							onClick: handleQuickAddToCart,
							className: "btn btn-primary",
							style: {
								width: "100%",
								borderRadius: "50px",
								padding: "0.5rem",
								fontSize: "0.8rem",
								fontWeight: "600"
							},
							children: "Add to Cart"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 59,
							columnNumber: 37
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 40,
						columnNumber: 33
					}, this)
				}, p.id, false, {
					fileName: _jsxFileName,
					lineNumber: 39,
					columnNumber: 29
				}, this);
			})
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 30,
			columnNumber: 17
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 9,
		columnNumber: 9
	}, this);
};
_c = WishlistPage;
export default WishlistPage;
var _c;
$RefreshReg$(_c, "WishlistPage");
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;
import * as __vite_react_currentExports from "/src/pages/WishlistPage.jsx";
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }

  const currentExports = __vite_react_currentExports;
  queueMicrotask(() => {
    RefreshRuntime.registerExportsForReactRefresh("D:/The Ethnic Touch/frontend/src/pages/WishlistPage.jsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("D:/The Ethnic Touch/frontend/src/pages/WishlistPage.jsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
function $RefreshReg$(type, id) { return RefreshRuntime.register(type, "D:/The Ethnic Touch/frontend/src/pages/WishlistPage.jsx" + ' ' + id); }
function $RefreshSig$() { return RefreshRuntime.createSignatureFunctionForTransform(); }

//# sourceMappingURL=data:application/json;base64,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biI6Mywic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QsIHVzZVJlZiwgdXNlTWVtbywgdXNlQ2FsbGJhY2sgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IHVzZU5hdmlnYXRlLCBMaW5rLCB1c2VMb2NhdGlvbiwgdXNlUGFyYW1zLCBSb3V0ZXMsIFJvdXRlLCBOYXZpZ2F0ZSwgQnJvd3NlclJvdXRlciB9IGZyb20gJ3JlYWN0LXJvdXRlci1kb20nO1xyXG5pbXBvcnQgQ2FydCBmcm9tICcuL0NhcnQnO1xyXG5pbXBvcnQgU2hvcCBmcm9tICcuL1Nob3AnO1xyXG5cclxuY29uc3QgV2lzaGxpc3RQYWdlID0gKHsgd2lzaGxpc3QsIHRvZ2dsZVdpc2hsaXN0LCBhZGRUb0NhcnQgfSkgPT4ge1xyXG5cclxuICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3aXNobGlzdC1wYWdlLWNvbnRhaW5lclwiIHN0eWxlPXt7IHBhZGRpbmc6ICcxLjI1cmVtIDUlIDNyZW0nLCBtYXhXaWR0aDogJzEyMDBweCcsIG1hcmdpbjogJzAgYXV0bycsIG1pbkhlaWdodDogJzc1dmgnIH19PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIndpc2hsaXN0LWhlYWRlci1yb3dcIiBzdHlsZT17eyBtYXJnaW5Cb3R0b206ICcxLjI1cmVtJyB9fT5cclxuICAgICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwicHJvZmlsZS1leWVicm93XCIgc3R5bGU9e3sgZm9udFNpemU6ICcwLjc1cmVtJyB9fT5XYXJkcm9iZSBTZWxlY3Rpb248L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgPGgxIHN0eWxlPXt7IGZvbnRGYW1pbHk6ICd2YXIoLS1mb250LWhlYWRpbmcpJywgY29sb3I6ICd2YXIoLS1jb2xvci10ZXh0KScsIGZvbnRXZWlnaHQ6ICc0MDAnLCBtYXJnaW46ICcwLjE1cmVtIDAgMCcsIGZvbnRTaXplOiAnMS4zNXJlbScgfX0+WW91ciBXaXNobGlzdDwvaDE+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZm9udFNpemU6ICcwLjg1cmVtJywgY29sb3I6ICcjNjg2NDYxJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICB7d2lzaGxpc3QubGVuZ3RofSB7d2lzaGxpc3QubGVuZ3RoID09PSAxID8gJ2l0ZW0nIDogJ2l0ZW1zJ30gc2F2ZWRcclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIHt3aXNobGlzdC5sZW5ndGggPT09IDAgPyAoXHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHRleHRBbGlnbjogJ2NlbnRlcicsIHBhZGRpbmc6ICc0cmVtIDFyZW0nLCBiYWNrZ3JvdW5kOiAnI0ZGRmRmYycsIGJvcmRlclJhZGl1czogJzEycHgnLCBib3JkZXI6ICcxcHggZGFzaGVkIHZhcigtLWNvbG9yLXBlYWNoKScsIG1heFdpZHRoOiAnNjAwcHgnLCBtYXJnaW46ICcxcmVtIGF1dG8nIH19PlxyXG4gICAgICAgICAgICAgICAgICAgIDxzdmcgdmlld0JveD1cIjAgMCAyNCAyNFwiIHdpZHRoPVwiNDBcIiBoZWlnaHQ9XCI0MFwiIHN0cm9rZT1cInZhcigtLWNvbG9yLXByaW1hcnkpXCIgc3Ryb2tlV2lkdGg9XCIxLjVcIiBmaWxsPVwibm9uZVwiIHN0eWxlPXt7IG1hcmdpbkJvdHRvbTogJzFyZW0nIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTEyIDIxLjM1bC0xLjQ1LTEuMzJDNS40IDE1LjM2IDIgMTIuMjggMiA4LjUgMiA1LjQyIDQuNDIgMyA3LjUgM2MxLjc0IDAgMy40MS44MSA0LjUgMi4wOUMxMy4wOSAzLjgxIDE0Ljc2IDMgMTYuNSAzIDE5LjU4IDMgMjIgNS40MiAyMiA4LjVjMCAzLjc4LTMuNCA2Ljg2LTguNTUgMTEuNTRMMTIgMjEuMzV6XCIvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgICAgICAgICAgIDxoMiBzdHlsZT17eyBmb250RmFtaWx5OiAndmFyKC0tZm9udC1oZWFkaW5nKScsIGZvbnRXZWlnaHQ6ICc0MDAnLCBtYXJnaW5Cb3R0b206ICcwLjRyZW0nLCBmb250U2l6ZTogJzEuMzVyZW0nIH19PllvdXIgd2lzaGxpc3QgaXMgZW1wdHk8L2gyPlxyXG4gICAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPXt7IG1hcmdpbjogJzAgYXV0byAxLjI1cmVtJywgZm9udFNpemU6ICcwLjg4cmVtJywgY29sb3I6ICcjNjg2NDYxJyB9fT5FeHBsb3JlIG91ciBwcmVtaXVtIGNvbGxlY3Rpb25zIGFuZCB0YXAgdGhlIGhlYXJ0IGljb24gdG8gc2F2ZSBwcm9kdWN0cyBoZXJlLjwvcD5cclxuICAgICAgICAgICAgICAgICAgICA8TGluayB0bz1cIi9zaG9wXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5XCIgc3R5bGU9e3sgdGV4dERlY29yYXRpb246ICdub25lJywgcGFkZGluZzogJzAuNnJlbSAxLjhyZW0nLCBmb250U2l6ZTogJzAuODVyZW0nLCBib3JkZXJSYWRpdXM6ICc1MHB4JyB9fT5TaG9wIHRoZSBDb2xsZWN0aW9uPC9MaW5rPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICkgOiAoXHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInByb2R1Y3QtZ3JpZFwiIHN0eWxlPXt7IGdyaWRUZW1wbGF0ZUNvbHVtbnM6ICdyZXBlYXQoYXV0by1maWxsLCBtaW5tYXgoMjEwcHgsIDFmcikpJywgZ2FwOiAnMS4yNXJlbScgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAge3dpc2hsaXN0Lm1hcChwID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaGFuZGxlUXVpY2tBZGRUb0NhcnQgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVmYXVsdFN6ID0gKHAuc2l6ZXMgJiYgcC5zaXplcy5sZW5ndGggPiAwKSA/IHAuc2l6ZXNbMF0gOiAnUyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRUb0NhcnQoeyAuLi5wLCBzaXplOiBkZWZhdWx0U3ogfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBrZXk9e3AuaWR9IHN0eWxlPXt7IHBvc2l0aW9uOiAncmVsYXRpdmUnIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHJvZHVjdC1jYXJkXCIgc3R5bGU9e3sgcGFkZGluZzogJzAuNjVyZW0nIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TGluayB0bz17YC9wcm9kdWN0LyR7cC5pZH1gfSBzdHlsZT17eyB0ZXh0RGVjb3JhdGlvbjogJ25vbmUnLCBjb2xvcjogJ2luaGVyaXQnLCBkaXNwbGF5OiAnYmxvY2snIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwcm9kdWN0LWltYWdlLWNvbnRhaW5lclwiIHN0eWxlPXt7IHBvc2l0aW9uOiAncmVsYXRpdmUnLCBib3JkZXJSYWRpdXM6ICc4cHgnLCBvdmVyZmxvdzogJ2hpZGRlbicgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3aXNobGlzdC1oZWFydC1idG4gYWN0aXZlXCIgb25DbGljaz17KGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2dnbGVXaXNobGlzdChwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fSBzdHlsZT17eyB0b3A6ICcxMHB4JywgcmlnaHQ6ICcxMHB4Jywgd2lkdGg6ICczMnB4JywgaGVpZ2h0OiAnMzJweCcgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdmcgdmlld0JveD1cIjAgMCAyNCAyNFwiIHdpZHRoPVwiMTZcIiBoZWlnaHQ9XCIxNlwiPjxwYXRoIGQ9XCJNMTIgMjEuMzVsLTEuNDUtMS4zMkM1LjQgMTUuMzYgMiAxMi4yOCAyIDguNSAyIDUuNDIgNC40MiAzIDcuNSAzYzEuNzQgMCAzLjQxLjgxIDQuNSAyLjA5QzEzLjA5IDMuODEgMTQuNzYgMyAxNi41IDMgMTkuNTggMyAyMiA1LjQyIDIyIDguNWMwIDMuNzgtMy40IDYuODYtOC41NSAxMS41NEwxMiAyMS4zNXpcIi8+PC9zdmc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9e3AuaW1hZ2VVcmx9IGFsdD17cC5uYW1lfSBjbGFzc05hbWU9XCJwcm9kdWN0LWltYWdlXCIgc3R5bGU9e3sgYXNwZWN0UmF0aW86ICczLzQnLCBvYmplY3RGaXQ6ICdjb3ZlcicgfX0gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwcm9kdWN0LWluZm9cIiBzdHlsZT17eyBtYXJnaW5Ub3A6ICcwLjZyZW0nLCBtYXJnaW5Cb3R0b206ICcwLjc1cmVtJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGZsZXg6IDEsIG1pbldpZHRoOiAwIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwicHJvZHVjdC1uYW1lXCIgc3R5bGU9e3sgd2hpdGVTcGFjZTogJ25vd3JhcCcsIG92ZXJmbG93OiAnaGlkZGVuJywgdGV4dE92ZXJmbG93OiAnZWxsaXBzaXMnLCBmb250U2l6ZTogJzAuODhyZW0nLCBtYXJnaW46ICcwIDAgMC4ycmVtJyB9fT57cC5uYW1lfTwvaDM+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHJvZHVjdC1wcmljZVwiIHN0eWxlPXt7IGZvbnRTaXplOiAnMC45cmVtJywgZm9udFdlaWdodDogJzYwMCcgfX0+4oK5e3AucHJpY2UudG9Mb2NhbGVTdHJpbmcoJ2VuLUlOJyl9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9MaW5rPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17aGFuZGxlUXVpY2tBZGRUb0NhcnR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnlcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgd2lkdGg6ICcxMDAlJywgYm9yZGVyUmFkaXVzOiAnNTBweCcsIHBhZGRpbmc6ICcwLjVyZW0nLCBmb250U2l6ZTogJzAuOHJlbScsIGZvbnRXZWlnaHQ6ICc2MDAnIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFkZCB0byBDYXJ0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSl9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKX1cclxuICAgICAgICA8L2Rpdj5cclxuICAgICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBXaXNobGlzdFBhZ2U7XHJcbiJdfQ==