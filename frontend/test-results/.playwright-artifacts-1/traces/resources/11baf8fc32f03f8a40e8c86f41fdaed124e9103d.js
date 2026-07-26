import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/components/ProductSkeletonGrid.jsx");const React = __vite__cjsImport0_react;const _jsxDEV = __vite__cjsImport1_react_jsxDevRuntime["jsxDEV"];import __vite__cjsImport0_react from "/node_modules/.vite/deps/react.js?v=42a9b196";
var _jsxFileName = "D:/The Ethnic Touch/frontend/src/components/ProductSkeletonGrid.jsx";
import __vite__cjsImport1_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=42a9b196";
const ProductSkeletonGrid = ({ count = 8 }) => {
	const items = Array.from({ length: count });
	return /* @__PURE__ */ _jsxDEV("div", {
		className: "product-grid",
		children: items.map((_, idx) => /* @__PURE__ */ _jsxDEV("div", {
			className: "skeleton-card",
			children: [/* @__PURE__ */ _jsxDEV("div", { className: "skeleton-box skeleton-image" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 10,
				columnNumber: 21
			}, this), /* @__PURE__ */ _jsxDEV("div", {
				style: {
					padding: "0.4rem 0.2rem",
					display: "flex",
					flexDirection: "column",
					gap: "0.5rem"
				},
				children: [
					/* @__PURE__ */ _jsxDEV("div", {
						className: "skeleton-box skeleton-line",
						style: { width: "80%" }
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 12,
						columnNumber: 25
					}, this),
					/* @__PURE__ */ _jsxDEV("div", {
						className: "skeleton-box skeleton-line short",
						style: { width: "45%" }
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 13,
						columnNumber: 25
					}, this),
					/* @__PURE__ */ _jsxDEV("div", {
						className: "skeleton-box skeleton-line price",
						style: {
							width: "35%",
							marginTop: "0.2rem"
						}
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 14,
						columnNumber: 25
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 11,
				columnNumber: 21
			}, this)]
		}, idx, true, {
			fileName: _jsxFileName,
			lineNumber: 9,
			columnNumber: 17
		}, this))
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 7,
		columnNumber: 9
	}, this);
};
_c = ProductSkeletonGrid;
export default ProductSkeletonGrid;
var _c;
$RefreshReg$(_c, "ProductSkeletonGrid");
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;
import * as __vite_react_currentExports from "/src/components/ProductSkeletonGrid.jsx";
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }

  const currentExports = __vite_react_currentExports;
  queueMicrotask(() => {
    RefreshRuntime.registerExportsForReactRefresh("D:/The Ethnic Touch/frontend/src/components/ProductSkeletonGrid.jsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("D:/The Ethnic Touch/frontend/src/components/ProductSkeletonGrid.jsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
function $RefreshReg$(type, id) { return RefreshRuntime.register(type, "D:/The Ethnic Touch/frontend/src/components/ProductSkeletonGrid.jsx" + ' ' + id); }
function $RefreshSig$() { return RefreshRuntime.createSignatureFunctionForTransform(); }

//# sourceMappingURL=data:application/json;base64,eyJtYXBwaW5ncyI6IkFBQUEsT0FBTyxXQUFXOzs7QUFFbEIsTUFBTSx1QkFBdUIsRUFBRSxRQUFRLFFBQVE7Q0FDM0MsTUFBTSxRQUFRLE1BQU0sS0FBSyxFQUFFLFFBQVEsTUFBTSxDQUFDO0NBRTFDLE9BQ0ksd0JBQUMsT0FBRDtFQUFLLFdBQVU7WUFDVixNQUFNLEtBQUssR0FBRyxRQUNYLHdCQUFDLE9BQUQ7R0FBZSxXQUFVO2FBQXpCLENBQ0ksd0JBQUMsT0FBRCxFQUFLLFdBQVUsOEJBQStCOzs7O2FBQzlDLHdCQUFDLE9BQUQ7SUFBSyxPQUFPO0tBQUUsU0FBUztLQUFpQixTQUFTO0tBQVEsZUFBZTtLQUFVLEtBQUs7SUFBUztjQUFoRztLQUNJLHdCQUFDLE9BQUQ7TUFBSyxXQUFVO01BQTZCLE9BQU8sRUFBRSxPQUFPLE1BQU07S0FBSTs7Ozs7S0FDdEUsd0JBQUMsT0FBRDtNQUFLLFdBQVU7TUFBbUMsT0FBTyxFQUFFLE9BQU8sTUFBTTtLQUFJOzs7OztLQUM1RSx3QkFBQyxPQUFEO01BQUssV0FBVTtNQUFtQyxPQUFPO09BQUUsT0FBTztPQUFPLFdBQVc7TUFBUztLQUFJOzs7OztJQUNoRzs7Ozs7V0FDSjtLQVBLOzs7O1NBT0wsQ0FDUjtDQUNBOzs7OztBQUViOztBQUVBLGVBQWUiLCJuYW1lcyI6W10sInNvdXJjZXMiOlsiUHJvZHVjdFNrZWxldG9uR3JpZC5qc3giXSwidmVyc2lvbiI6Mywic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuY29uc3QgUHJvZHVjdFNrZWxldG9uR3JpZCA9ICh7IGNvdW50ID0gOCB9KSA9PiB7XG4gICAgY29uc3QgaXRlbXMgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiBjb3VudCB9KTtcblxuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHJvZHVjdC1ncmlkXCI+XG4gICAgICAgICAgICB7aXRlbXMubWFwKChfLCBpZHgpID0+IChcbiAgICAgICAgICAgICAgICA8ZGl2IGtleT17aWR4fSBjbGFzc05hbWU9XCJza2VsZXRvbi1jYXJkXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2tlbGV0b24tYm94IHNrZWxldG9uLWltYWdlXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBwYWRkaW5nOiAnMC40cmVtIDAuMnJlbScsIGRpc3BsYXk6ICdmbGV4JywgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsIGdhcDogJzAuNXJlbScgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNrZWxldG9uLWJveCBza2VsZXRvbi1saW5lXCIgc3R5bGU9e3sgd2lkdGg6ICc4MCUnIH19IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNrZWxldG9uLWJveCBza2VsZXRvbi1saW5lIHNob3J0XCIgc3R5bGU9e3sgd2lkdGg6ICc0NSUnIH19IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNrZWxldG9uLWJveCBza2VsZXRvbi1saW5lIHByaWNlXCIgc3R5bGU9e3sgd2lkdGg6ICczNSUnLCBtYXJnaW5Ub3A6ICcwLjJyZW0nIH19IC8+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKSl9XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBQcm9kdWN0U2tlbGV0b25HcmlkO1xuIl19