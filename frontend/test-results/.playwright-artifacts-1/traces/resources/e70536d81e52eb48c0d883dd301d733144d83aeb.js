import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/components/CustomSelect.jsx");const React = __vite__cjsImport0_react; const useState = __vite__cjsImport0_react["useState"]; const useEffect = __vite__cjsImport0_react["useEffect"]; const useRef = __vite__cjsImport0_react["useRef"]; const useMemo = __vite__cjsImport0_react["useMemo"]; const useCallback = __vite__cjsImport0_react["useCallback"];const _jsxDEV = __vite__cjsImport2_react_jsxDevRuntime["jsxDEV"];import __vite__cjsImport0_react from "/node_modules/.vite/deps/react.js?v=42a9b196";
import { useNavigate, Link, useLocation, useParams, Routes, Route, Navigate, BrowserRouter } from "/node_modules/.vite/deps/react-router-dom.js?v=42a9b196";
var _jsxFileName = "D:/The Ethnic Touch/frontend/src/components/CustomSelect.jsx";
import __vite__cjsImport2_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=42a9b196";
var _s = $RefreshSig$();
const CustomSelect = ({ value, options, onChange }) => {
	_s();
	const [isOpen, setIsOpen] = useState(false);
	const wrapperRef = useRef(null);
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);
	const selectedOption = options.find((opt) => opt.value === value) || options[0];
	return /* @__PURE__ */ _jsxDEV("div", {
		className: "custom-select-wrapper",
		ref: wrapperRef,
		children: [/* @__PURE__ */ _jsxDEV("div", {
			className: `custom-select-trigger ${isOpen ? "open" : ""}`,
			onClick: () => setIsOpen(!isOpen),
			children: [/* @__PURE__ */ _jsxDEV("span", { children: selectedOption.label }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 23,
				columnNumber: 17
			}, this), /* @__PURE__ */ _jsxDEV("svg", {
				className: `sort-select-icon ${isOpen ? "rotated" : ""}`,
				viewBox: "0 0 16 16",
				width: "12",
				height: "12",
				stroke: "currentColor",
				strokeWidth: "2",
				fill: "none",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				children: /* @__PURE__ */ _jsxDEV("polyline", { points: "3 6 8 11 13 6" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 24,
					columnNumber: 218
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 24,
				columnNumber: 17
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 22,
			columnNumber: 13
		}, this), isOpen && /* @__PURE__ */ _jsxDEV("div", {
			className: "custom-select-options",
			children: options.map((opt) => /* @__PURE__ */ _jsxDEV("div", {
				className: `custom-select-option ${value === opt.value ? "selected" : ""}`,
				onClick: () => {
					onChange(opt.value);
					setIsOpen(false);
				},
				children: opt.label
			}, opt.value, false, {
				fileName: _jsxFileName,
				lineNumber: 29,
				columnNumber: 25
			}, this))
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 27,
			columnNumber: 17
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 21,
		columnNumber: 9
	}, this);
};
_s(CustomSelect, "XRlLYt5jnw2ExsAqtUpbAgr6EvY=");
_c = CustomSelect;
export default CustomSelect;
var _c;
$RefreshReg$(_c, "CustomSelect");
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;
import * as __vite_react_currentExports from "/src/components/CustomSelect.jsx";
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }

  const currentExports = __vite_react_currentExports;
  queueMicrotask(() => {
    RefreshRuntime.registerExportsForReactRefresh("D:/The Ethnic Touch/frontend/src/components/CustomSelect.jsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("D:/The Ethnic Touch/frontend/src/components/CustomSelect.jsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
function $RefreshReg$(type, id) { return RefreshRuntime.register(type, "D:/The Ethnic Touch/frontend/src/components/CustomSelect.jsx" + ' ' + id); }
function $RefreshSig$() { return RefreshRuntime.createSignatureFunctionForTransform(); }

//# sourceMappingURL=data:application/json;base64,eyJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLFVBQVUsV0FBVyxRQUFRLFNBQVMsbUJBQW1CO0FBQ3pFLFNBQVMsYUFBYSxNQUFNLGFBQWEsV0FBVyxRQUFRLE9BQU8sVUFBVSxxQkFBcUI7Ozs7QUFFbEcsTUFBTSxnQkFBZ0IsRUFBRSxPQUFPLFNBQVMsZUFBZTs7Q0FDbkQsTUFBTSxDQUFDLFFBQVEsYUFBYSxTQUFTLEtBQUs7Q0FDMUMsTUFBTSxhQUFhLE9BQU8sSUFBSTtDQUU5QixnQkFBZ0I7RUFDWixNQUFNLHNCQUFzQixVQUFVO0dBQ2xDLElBQUksV0FBVyxXQUFXLENBQUMsV0FBVyxRQUFRLFNBQVMsTUFBTSxNQUFNLEdBQUc7SUFDbEUsVUFBVSxLQUFLO0dBQ25CO0VBQ0o7RUFDQSxTQUFTLGlCQUFpQixhQUFhLGtCQUFrQjtFQUN6RCxhQUFhLFNBQVMsb0JBQW9CLGFBQWEsa0JBQWtCO0NBQzdFLEdBQUcsQ0FBQyxDQUFDO0NBRUwsTUFBTSxpQkFBaUIsUUFBUSxNQUFLLFFBQU8sSUFBSSxVQUFVLEtBQUssS0FBSyxRQUFRO0NBRTNFLE9BQ0ksd0JBQUMsT0FBRDtFQUFLLFdBQVU7RUFBd0IsS0FBSztZQUE1QyxDQUNJLHdCQUFDLE9BQUQ7R0FBSyxXQUFXLHlCQUF5QixTQUFTLFNBQVM7R0FBTSxlQUFlLFVBQVUsQ0FBQyxNQUFNO2FBQWpHLENBQ0ksd0JBQUMsUUFBRCxZQUFPLGVBQWUsTUFBWTs7OzthQUNsQyx3QkFBQyxPQUFEO0lBQUssV0FBVyxvQkFBb0IsU0FBUyxZQUFZO0lBQU0sU0FBUTtJQUFZLE9BQU07SUFBSyxRQUFPO0lBQUssUUFBTztJQUFlLGFBQVk7SUFBSSxNQUFLO0lBQU8sZUFBYztJQUFRLGdCQUFlO2NBQVEsd0JBQUMsWUFBRCxFQUFVLFFBQU8sZ0JBQTBCOzs7OztHQUFNOzs7O1dBQ3pQOzs7OztZQUNKLFVBQ0csd0JBQUMsT0FBRDtHQUFLLFdBQVU7YUFDVixRQUFRLEtBQUksUUFDVCx3QkFBQyxPQUFEO0lBRUksV0FBVyx3QkFBd0IsVUFBVSxJQUFJLFFBQVEsYUFBYTtJQUN0RSxlQUFlO0tBQ1gsU0FBUyxJQUFJLEtBQUs7S0FDbEIsVUFBVSxLQUFLO0lBQ25CO2NBRUMsSUFBSTtHQUNKLEdBUkksSUFBSTs7OztVQVFSLENBQ1I7RUFDQTs7OztVQUVSOzs7Ozs7QUFFYjs7O0FBRUEsZUFBZSIsIm5hbWVzIjpbXSwic291cmNlcyI6WyJDdXN0b21TZWxlY3QuanN4Il0sInZlcnNpb24iOjMsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0LCB1c2VSZWYsIHVzZU1lbW8sIHVzZUNhbGxiYWNrIH0gZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VOYXZpZ2F0ZSwgTGluaywgdXNlTG9jYXRpb24sIHVzZVBhcmFtcywgUm91dGVzLCBSb3V0ZSwgTmF2aWdhdGUsIEJyb3dzZXJSb3V0ZXIgfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJztcclxuXHJcbmNvbnN0IEN1c3RvbVNlbGVjdCA9ICh7IHZhbHVlLCBvcHRpb25zLCBvbkNoYW5nZSB9KSA9PiB7XHJcbiAgICBjb25zdCBbaXNPcGVuLCBzZXRJc09wZW5dID0gdXNlU3RhdGUoZmFsc2UpO1xyXG4gICAgY29uc3Qgd3JhcHBlclJlZiA9IHVzZVJlZihudWxsKTtcclxuXHJcbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZUNsaWNrT3V0c2lkZSA9IChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAod3JhcHBlclJlZi5jdXJyZW50ICYmICF3cmFwcGVyUmVmLmN1cnJlbnQuY29udGFpbnMoZXZlbnQudGFyZ2V0KSkge1xyXG4gICAgICAgICAgICAgICAgc2V0SXNPcGVuKGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgaGFuZGxlQ2xpY2tPdXRzaWRlKTtcclxuICAgICAgICByZXR1cm4gKCkgPT4gZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgaGFuZGxlQ2xpY2tPdXRzaWRlKTtcclxuICAgIH0sIFtdKTtcclxuXHJcbiAgICBjb25zdCBzZWxlY3RlZE9wdGlvbiA9IG9wdGlvbnMuZmluZChvcHQgPT4gb3B0LnZhbHVlID09PSB2YWx1ZSkgfHwgb3B0aW9uc1swXTtcclxuXHJcbiAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY3VzdG9tLXNlbGVjdC13cmFwcGVyXCIgcmVmPXt3cmFwcGVyUmVmfT5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2BjdXN0b20tc2VsZWN0LXRyaWdnZXIgJHtpc09wZW4gPyAnb3BlbicgOiAnJ31gfSBvbkNsaWNrPXsoKSA9PiBzZXRJc09wZW4oIWlzT3Blbil9PlxyXG4gICAgICAgICAgICAgICAgPHNwYW4+e3NlbGVjdGVkT3B0aW9uLmxhYmVsfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDxzdmcgY2xhc3NOYW1lPXtgc29ydC1zZWxlY3QtaWNvbiAke2lzT3BlbiA/ICdyb3RhdGVkJyA6ICcnfWB9IHZpZXdCb3g9XCIwIDAgMTYgMTZcIiB3aWR0aD1cIjEyXCIgaGVpZ2h0PVwiMTJcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjJcIiBmaWxsPVwibm9uZVwiIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIj48cG9seWxpbmUgcG9pbnRzPVwiMyA2IDggMTEgMTMgNlwiPjwvcG9seWxpbmU+PC9zdmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICB7aXNPcGVuICYmIChcclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY3VzdG9tLXNlbGVjdC1vcHRpb25zXCI+XHJcbiAgICAgICAgICAgICAgICAgICAge29wdGlvbnMubWFwKG9wdCA9PiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk9e29wdC52YWx1ZX0gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BjdXN0b20tc2VsZWN0LW9wdGlvbiAke3ZhbHVlID09PSBvcHQudmFsdWUgPyAnc2VsZWN0ZWQnIDogJyd9YH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZShvcHQudmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldElzT3BlbihmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7b3B0LmxhYmVsfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICApfVxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IEN1c3RvbVNlbGVjdDtcclxuIl19