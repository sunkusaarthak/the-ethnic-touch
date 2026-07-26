import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/components/ProductCard.jsx");const React = __vite__cjsImport0_react;const _jsxDEV = __vite__cjsImport3_react_jsxDevRuntime["jsxDEV"];import __vite__cjsImport0_react from "/node_modules/.vite/deps/react.js?v=42a9b196";
import { Link } from "/node_modules/.vite/deps/react-router-dom.js?v=42a9b196";
import ImageWithSkeleton from "/src/components/ImageWithSkeleton.jsx";
var _jsxFileName = "D:/The Ethnic Touch/frontend/src/components/ProductCard.jsx";
import __vite__cjsImport3_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=42a9b196";
const RenderProductCard = ({ product, wishlist, toggleWishlist }) => {
	const isWished = wishlist.some((item) => item.id === product.id);
	return /* @__PURE__ */ _jsxDEV("div", {
		style: { position: "relative" },
		children: [/* @__PURE__ */ _jsxDEV(Link, {
			to: `/product/${product.id}`,
			className: "product-card",
			style: { display: "block" },
			children: [/* @__PURE__ */ _jsxDEV("div", {
				className: "product-image-container",
				children: /* @__PURE__ */ _jsxDEV(ImageWithSkeleton, {
					src: product.imageUrl,
					alt: product.name,
					className: "product-image"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 12,
					columnNumber: 21
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 11,
				columnNumber: 17
			}, this), /* @__PURE__ */ _jsxDEV("div", {
				className: "product-info",
				children: [/* @__PURE__ */ _jsxDEV("div", {
					style: {
						flex: 1,
						minWidth: 0,
						paddingRight: "8px"
					},
					children: [
						/* @__PURE__ */ _jsxDEV("h3", {
							className: "product-name",
							style: {
								whiteSpace: "nowrap",
								overflow: "hidden",
								textOverflow: "ellipsis"
							},
							children: product.name
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 16,
							columnNumber: 25
						}, this),
						/* @__PURE__ */ _jsxDEV("p", {
							className: "product-desc",
							style: { marginTop: "0.2rem" },
							children: product.description
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 17,
							columnNumber: 25
						}, this),
						/* @__PURE__ */ _jsxDEV("div", {
							style: {
								display: "flex",
								gap: "6px",
								marginTop: "6px",
								flexWrap: "wrap"
							},
							children: [product.isNewArrival && /* @__PURE__ */ _jsxDEV("span", {
								style: {
									fontSize: "0.65rem",
									background: "#faeedd",
									color: "#9c6c40",
									padding: "2px 8px",
									borderRadius: "4px",
									fontWeight: "600"
								},
								children: "New"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 21,
								columnNumber: 33
							}, this), product.isBestSeller && /* @__PURE__ */ _jsxDEV("span", {
								style: {
									fontSize: "0.65rem",
									background: "#e8f5e9",
									color: "#2e7d32",
									padding: "2px 8px",
									borderRadius: "4px",
									fontWeight: "600"
								},
								children: "Best Seller"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 24,
								columnNumber: 33
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 19,
							columnNumber: 25
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 15,
					columnNumber: 21
				}, this), /* @__PURE__ */ _jsxDEV("div", {
					style: {
						display: "flex",
						flexDirection: "column",
						alignItems: "flex-end",
						flexShrink: 0
					},
					children: [/* @__PURE__ */ _jsxDEV("div", {
						className: "product-price",
						children: ["₹", product.price.toLocaleString("en-IN")]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 29,
						columnNumber: 25
					}, this), product.originalPrice > product.price && /* @__PURE__ */ _jsxDEV("div", {
						style: {
							textDecoration: "line-through",
							color: "#999",
							fontSize: "0.8rem",
							marginTop: "2px"
						},
						children: ["₹", product.originalPrice.toLocaleString("en-IN")]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 31,
						columnNumber: 29
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 28,
					columnNumber: 21
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 14,
				columnNumber: 17
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 10,
			columnNumber: 13
		}, this), /* @__PURE__ */ _jsxDEV("button", {
			className: `wishlist-heart-btn ${isWished ? "active" : ""}`,
			onClick: (e) => {
				e.preventDefault();
				e.stopPropagation();
				toggleWishlist(product);
			},
			"aria-label": isWished ? "Remove from wishlist" : "Add to wishlist",
			children: /* @__PURE__ */ _jsxDEV("svg", {
				viewBox: "0 0 24 24",
				children: /* @__PURE__ */ _jsxDEV("path", { d: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 49,
					columnNumber: 21
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 48,
				columnNumber: 17
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 39,
			columnNumber: 13
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 9,
		columnNumber: 9
	}, this);
};
_c = RenderProductCard;
export default RenderProductCard;
var _c;
$RefreshReg$(_c, "RenderProductCard");
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;
import * as __vite_react_currentExports from "/src/components/ProductCard.jsx";
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }

  const currentExports = __vite_react_currentExports;
  queueMicrotask(() => {
    RefreshRuntime.registerExportsForReactRefresh("D:/The Ethnic Touch/frontend/src/components/ProductCard.jsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("D:/The Ethnic Touch/frontend/src/components/ProductCard.jsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
function $RefreshReg$(type, id) { return RefreshRuntime.register(type, "D:/The Ethnic Touch/frontend/src/components/ProductCard.jsx" + ' ' + id); }
function $RefreshSig$() { return RefreshRuntime.createSignatureFunctionForTransform(); }

//# sourceMappingURL=data:application/json;base64,eyJtYXBwaW5ncyI6IkFBQUEsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsWUFBWTtBQUNyQixPQUFPLHVCQUF1Qjs7O0FBRTlCLE1BQU0scUJBQXFCLEVBQUUsU0FBUyxVQUFVLHFCQUFxQjtDQUNqRSxNQUFNLFdBQVcsU0FBUyxNQUFLLFNBQVEsS0FBSyxPQUFPLFFBQVEsRUFBRTtDQUU3RCxPQUNJLHdCQUFDLE9BQUQ7RUFBSyxPQUFPLEVBQUUsVUFBVSxXQUFXO1lBQW5DLENBQ0ksd0JBQUMsTUFBRDtHQUFNLElBQUksWUFBWSxRQUFRO0dBQU0sV0FBVTtHQUFlLE9BQU8sRUFBRSxTQUFTLFFBQVE7YUFBdkYsQ0FDSSx3QkFBQyxPQUFEO0lBQUssV0FBVTtjQUNYLHdCQUFDLG1CQUFEO0tBQW1CLEtBQUssUUFBUTtLQUFVLEtBQUssUUFBUTtLQUFNLFdBQVU7SUFBaUI7Ozs7O0dBQ3ZGOzs7O2FBQ0wsd0JBQUMsT0FBRDtJQUFLLFdBQVU7Y0FBZixDQUNJLHdCQUFDLE9BQUQ7S0FBSyxPQUFPO01BQUUsTUFBTTtNQUFHLFVBQVU7TUFBRyxjQUFjO0tBQU07ZUFBeEQ7TUFDSSx3QkFBQyxNQUFEO09BQUksV0FBVTtPQUFlLE9BQU87UUFBRSxZQUFZO1FBQVUsVUFBVTtRQUFVLGNBQWM7T0FBVztpQkFBSSxRQUFRO01BQVM7Ozs7O01BQzlILHdCQUFDLEtBQUQ7T0FBRyxXQUFVO09BQWUsT0FBTyxFQUFFLFdBQVcsU0FBUztpQkFBSSxRQUFRO01BQWU7Ozs7O01BRXBGLHdCQUFDLE9BQUQ7T0FBSyxPQUFPO1FBQUUsU0FBUztRQUFRLEtBQUs7UUFBTyxXQUFXO1FBQU8sVUFBVTtPQUFPO2lCQUE5RSxDQUNLLFFBQVEsZ0JBQ0wsd0JBQUMsUUFBRDtRQUFNLE9BQU87U0FBRSxVQUFVO1NBQVcsWUFBWTtTQUFXLE9BQU87U0FBVyxTQUFTO1NBQVcsY0FBYztTQUFPLFlBQVk7UUFBTTtrQkFBRztPQUFTOzs7O2lCQUV2SixRQUFRLGdCQUNMLHdCQUFDLFFBQUQ7UUFBTSxPQUFPO1NBQUUsVUFBVTtTQUFXLFlBQVk7U0FBVyxPQUFPO1NBQVcsU0FBUztTQUFXLGNBQWM7U0FBTyxZQUFZO1FBQU07a0JBQUc7T0FBaUI7Ozs7ZUFFL0o7Ozs7OztLQUNKOzs7OztjQUNMLHdCQUFDLE9BQUQ7S0FBSyxPQUFPO01BQUUsU0FBUztNQUFRLGVBQWU7TUFBVSxZQUFZO01BQVksWUFBWTtLQUFFO2VBQTlGLENBQ0ksd0JBQUMsT0FBRDtNQUFLLFdBQVU7Z0JBQWYsQ0FBK0IsS0FBRSxRQUFRLE1BQU0sZUFBZSxPQUFPLENBQU87Ozs7O2VBQzNFLFFBQVEsZ0JBQWdCLFFBQVEsU0FDN0Isd0JBQUMsT0FBRDtNQUFLLE9BQU87T0FBRSxnQkFBZ0I7T0FBZ0IsT0FBTztPQUFRLFVBQVU7T0FBVSxXQUFXO01BQU07Z0JBQWxHLENBQXFHLEtBQy9GLFFBQVEsY0FBYyxlQUFlLE9BQU8sQ0FDN0M7Ozs7O2FBRVI7Ozs7O1lBQ0o7Ozs7O1dBQ0g7Ozs7O1lBRU4sd0JBQUMsVUFBRDtHQUNJLFdBQVcsc0JBQXNCLFdBQVcsV0FBVztHQUN2RCxVQUFVLE1BQU07SUFDWixFQUFFLGVBQWU7SUFDakIsRUFBRSxnQkFBZ0I7SUFDbEIsZUFBZSxPQUFPO0dBQzFCO0dBQ0EsY0FBWSxXQUFXLHlCQUF5QjthQUVoRCx3QkFBQyxPQUFEO0lBQUssU0FBUTtjQUNULHdCQUFDLFFBQUQsRUFBTSxHQUFFLGlMQUFpTDs7Ozs7R0FDeEw7Ozs7O0VBQ0Q7Ozs7VUFDUDs7Ozs7O0FBRWI7O0FBRUEsZUFBZSIsIm5hbWVzIjpbXSwic291cmNlcyI6WyJQcm9kdWN0Q2FyZC5qc3giXSwidmVyc2lvbiI6Mywic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgTGluayB9IGZyb20gJ3JlYWN0LXJvdXRlci1kb20nO1xyXG5pbXBvcnQgSW1hZ2VXaXRoU2tlbGV0b24gZnJvbSAnLi9JbWFnZVdpdGhTa2VsZXRvbic7XHJcblxyXG5jb25zdCBSZW5kZXJQcm9kdWN0Q2FyZCA9ICh7IHByb2R1Y3QsIHdpc2hsaXN0LCB0b2dnbGVXaXNobGlzdCB9KSA9PiB7XHJcbiAgICBjb25zdCBpc1dpc2hlZCA9IHdpc2hsaXN0LnNvbWUoaXRlbSA9PiBpdGVtLmlkID09PSBwcm9kdWN0LmlkKTtcclxuXHJcbiAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXYgc3R5bGU9e3sgcG9zaXRpb246ICdyZWxhdGl2ZScgfX0+XHJcbiAgICAgICAgICAgIDxMaW5rIHRvPXtgL3Byb2R1Y3QvJHtwcm9kdWN0LmlkfWB9IGNsYXNzTmFtZT1cInByb2R1Y3QtY2FyZFwiIHN0eWxlPXt7IGRpc3BsYXk6ICdibG9jaycgfX0+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInByb2R1Y3QtaW1hZ2UtY29udGFpbmVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPEltYWdlV2l0aFNrZWxldG9uIHNyYz17cHJvZHVjdC5pbWFnZVVybH0gYWx0PXtwcm9kdWN0Lm5hbWV9IGNsYXNzTmFtZT1cInByb2R1Y3QtaW1hZ2VcIiAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInByb2R1Y3QtaW5mb1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZmxleDogMSwgbWluV2lkdGg6IDAsIHBhZGRpbmdSaWdodDogJzhweCcgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJwcm9kdWN0LW5hbWVcIiBzdHlsZT17eyB3aGl0ZVNwYWNlOiAnbm93cmFwJywgb3ZlcmZsb3c6ICdoaWRkZW4nLCB0ZXh0T3ZlcmZsb3c6ICdlbGxpcHNpcycgfX0+e3Byb2R1Y3QubmFtZX08L2gzPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJwcm9kdWN0LWRlc2NcIiBzdHlsZT17eyBtYXJnaW5Ub3A6ICcwLjJyZW0nIH19Pntwcm9kdWN0LmRlc2NyaXB0aW9ufTwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBnYXA6ICc2cHgnLCBtYXJnaW5Ub3A6ICc2cHgnLCBmbGV4V3JhcDogJ3dyYXAnIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3Byb2R1Y3QuaXNOZXdBcnJpdmFsICYmIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250U2l6ZTogJzAuNjVyZW0nLCBiYWNrZ3JvdW5kOiAnI2ZhZWVkZCcsIGNvbG9yOiAnIzljNmM0MCcsIHBhZGRpbmc6ICcycHggOHB4JywgYm9yZGVyUmFkaXVzOiAnNHB4JywgZm9udFdlaWdodDogJzYwMCcgfX0+TmV3PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtwcm9kdWN0LmlzQmVzdFNlbGxlciAmJiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFNpemU6ICcwLjY1cmVtJywgYmFja2dyb3VuZDogJyNlOGY1ZTknLCBjb2xvcjogJyMyZTdkMzInLCBwYWRkaW5nOiAnMnB4IDhweCcsIGJvcmRlclJhZGl1czogJzRweCcsIGZvbnRXZWlnaHQ6ICc2MDAnIH19PkJlc3QgU2VsbGVyPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLCBhbGlnbkl0ZW1zOiAnZmxleC1lbmQnLCBmbGV4U2hyaW5rOiAwIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInByb2R1Y3QtcHJpY2VcIj7igrl7cHJvZHVjdC5wcmljZS50b0xvY2FsZVN0cmluZygnZW4tSU4nKX08L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAge3Byb2R1Y3Qub3JpZ2luYWxQcmljZSA+IHByb2R1Y3QucHJpY2UgJiYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyB0ZXh0RGVjb3JhdGlvbjogJ2xpbmUtdGhyb3VnaCcsIGNvbG9yOiAnIzk5OScsIGZvbnRTaXplOiAnMC44cmVtJywgbWFyZ2luVG9wOiAnMnB4JyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICDigrl7cHJvZHVjdC5vcmlnaW5hbFByaWNlLnRvTG9jYWxlU3RyaW5nKCdlbi1JTicpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9MaW5rPlxyXG5cclxuICAgICAgICAgICAgPGJ1dHRvbiBcclxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHdpc2hsaXN0LWhlYXJ0LWJ0biAke2lzV2lzaGVkID8gJ2FjdGl2ZScgOiAnJ31gfVxyXG4gICAgICAgICAgICAgICAgb25DbGljaz17KGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgICAgICAgICB0b2dnbGVXaXNobGlzdChwcm9kdWN0KTtcclxuICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPXtpc1dpc2hlZCA/IFwiUmVtb3ZlIGZyb20gd2lzaGxpc3RcIiA6IFwiQWRkIHRvIHdpc2hsaXN0XCJ9XHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgIDxzdmcgdmlld0JveD1cIjAgMCAyNCAyNFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMTIgMjEuMzVsLTEuNDUtMS4zMkM1LjQgMTUuMzYgMiAxMi4yOCAyIDguNSAyIDUuNDIgNC40MiAzIDcuNSAzYzEuNzQgMCAzLjQxLjgxIDQuNSAyLjA5QzEzLjA5IDMuODEgMTQuNzYgMyAxNi41IDMgMTkuNTggMyAyMiA1LjQyIDIyIDguNWMwIDMuNzgtMy40IDYuODYtOC41NSAxMS41NEwxMiAyMS4zNXpcIi8+XHJcbiAgICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgUmVuZGVyUHJvZHVjdENhcmQ7XHJcbiJdfQ==