import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/components/CopyButton.jsx");const React = __vite__cjsImport0_react; const useState = __vite__cjsImport0_react["useState"]; const useEffect = __vite__cjsImport0_react["useEffect"]; const useRef = __vite__cjsImport0_react["useRef"]; const useMemo = __vite__cjsImport0_react["useMemo"]; const useCallback = __vite__cjsImport0_react["useCallback"];const _jsxDEV = __vite__cjsImport2_react_jsxDevRuntime["jsxDEV"];import __vite__cjsImport0_react from "/node_modules/.vite/deps/react.js?v=42a9b196";
import { useNavigate, Link, useLocation, useParams, Routes, Route, Navigate, BrowserRouter } from "/node_modules/.vite/deps/react-router-dom.js?v=42a9b196";
var _jsxFileName = "D:/The Ethnic Touch/frontend/src/components/CopyButton.jsx";
import __vite__cjsImport2_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=42a9b196";
var _s = $RefreshSig$();
// --- REUSABLE COPY BUTTON COMPONENT ---
const CopyButton = ({ text, label = "", iconOnly = false, style = {}, className = "" }) => {
	_s();
	const [copied, setCopied] = useState(false);
	const handleCopy = (e) => {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		if (!text) return;
		const textToCopy = String(text).trim();
		if (navigator.clipboard && navigator.clipboard.writeText) {
			navigator.clipboard.writeText(textToCopy).then(() => {
				setCopied(true);
				setTimeout(() => setCopied(false), 2e3);
			}).catch(() => fallbackCopy(textToCopy));
		} else {
			fallbackCopy(textToCopy);
		}
	};
	const fallbackCopy = (str) => {
		try {
			const el = document.createElement("textarea");
			el.value = str;
			el.setAttribute("readonly", "");
			el.style.position = "absolute";
			el.style.left = "-9999px";
			document.body.appendChild(el);
			el.select();
			document.execCommand("copy");
			document.body.removeChild(el);
			setCopied(true);
			setTimeout(() => setCopied(false), 2e3);
		} catch (err) {
			console.error("Copy failed", err);
		}
	};
	return /* @__PURE__ */ _jsxDEV("button", {
		type: "button",
		onClick: handleCopy,
		title: copied ? "Copied to clipboard!" : `Copy ${text}`,
		className: `copy-btn-component ${copied ? "copied" : ""} ${className}`,
		style: { ...style },
		children: copied ? /* @__PURE__ */ _jsxDEV(React.Fragment, { children: [/* @__PURE__ */ _jsxDEV("svg", {
			width: "13",
			height: "13",
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2.5",
			strokeLinecap: "round",
			strokeLinejoin: "round",
			children: /* @__PURE__ */ _jsxDEV("polyline", { points: "20 6 9 17 4 12" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 55,
				columnNumber: 25
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 54,
			columnNumber: 21
		}, this), !iconOnly && /* @__PURE__ */ _jsxDEV("span", { children: "Copied!" }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 57,
			columnNumber: 35
		}, this)] }, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 53,
			columnNumber: 17
		}, this) : /* @__PURE__ */ _jsxDEV(React.Fragment, { children: [/* @__PURE__ */ _jsxDEV("svg", {
			width: "13",
			height: "13",
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2",
			strokeLinecap: "round",
			strokeLinejoin: "round",
			children: [/* @__PURE__ */ _jsxDEV("rect", {
				x: "9",
				y: "9",
				width: "13",
				height: "13",
				rx: "2",
				ry: "2"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 62,
				columnNumber: 25
			}, this), /* @__PURE__ */ _jsxDEV("path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 63,
				columnNumber: 25
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 61,
			columnNumber: 21
		}, this), !iconOnly && label && /* @__PURE__ */ _jsxDEV("span", { children: label }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 65,
			columnNumber: 44
		}, this)] }, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 60,
			columnNumber: 17
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 45,
		columnNumber: 9
	}, this);
};
_s(CopyButton, "NE86rL3vg4NVcTTWDavsT0hUBJs=");
_c = CopyButton;
export default CopyButton;
var _c;
$RefreshReg$(_c, "CopyButton");
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;
import * as __vite_react_currentExports from "/src/components/CopyButton.jsx";
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }

  const currentExports = __vite_react_currentExports;
  queueMicrotask(() => {
    RefreshRuntime.registerExportsForReactRefresh("D:/The Ethnic Touch/frontend/src/components/CopyButton.jsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("D:/The Ethnic Touch/frontend/src/components/CopyButton.jsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
function $RefreshReg$(type, id) { return RefreshRuntime.register(type, "D:/The Ethnic Touch/frontend/src/components/CopyButton.jsx" + ' ' + id); }
function $RefreshSig$() { return RefreshRuntime.createSignatureFunctionForTransform(); }

//# sourceMappingURL=data:application/json;base64,eyJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLFVBQVUsV0FBVyxRQUFRLFNBQVMsbUJBQW1CO0FBQ3pFLFNBQVMsYUFBYSxNQUFNLGFBQWEsV0FBVyxRQUFRLE9BQU8sVUFBVSxxQkFBcUI7Ozs7O0FBR2xHLE1BQU0sY0FBYyxFQUFFLE1BQU0sUUFBUSxJQUFJLFdBQVcsT0FBTyxRQUFRLENBQUMsR0FBRyxZQUFZLFNBQVM7O0NBQ3ZGLE1BQU0sQ0FBQyxRQUFRLGFBQWEsU0FBUyxLQUFLO0NBRTFDLE1BQU0sY0FBYyxNQUFNO0VBQ3RCLElBQUksR0FBRztHQUNILEVBQUUsZUFBZTtHQUNqQixFQUFFLGdCQUFnQjtFQUN0QjtFQUNBLElBQUksQ0FBQyxNQUFNO0VBRVgsTUFBTSxhQUFhLE9BQU8sSUFBSSxDQUFDLENBQUMsS0FBSztFQUNyQyxJQUFJLFVBQVUsYUFBYSxVQUFVLFVBQVUsV0FBVztHQUN0RCxVQUFVLFVBQVUsVUFBVSxVQUFVLENBQUMsQ0FBQyxXQUFXO0lBQ2pELFVBQVUsSUFBSTtJQUNkLGlCQUFpQixVQUFVLEtBQUssR0FBRyxHQUFJO0dBQzNDLENBQUMsQ0FBQyxDQUFDLFlBQVksYUFBYSxVQUFVLENBQUM7RUFDM0MsT0FBTztHQUNILGFBQWEsVUFBVTtFQUMzQjtDQUNKO0NBRUEsTUFBTSxnQkFBZ0IsUUFBUTtFQUMxQixJQUFJO0dBQ0EsTUFBTSxLQUFLLFNBQVMsY0FBYyxVQUFVO0dBQzVDLEdBQUcsUUFBUTtHQUNYLEdBQUcsYUFBYSxZQUFZLEVBQUU7R0FDOUIsR0FBRyxNQUFNLFdBQVc7R0FDcEIsR0FBRyxNQUFNLE9BQU87R0FDaEIsU0FBUyxLQUFLLFlBQVksRUFBRTtHQUM1QixHQUFHLE9BQU87R0FDVixTQUFTLFlBQVksTUFBTTtHQUMzQixTQUFTLEtBQUssWUFBWSxFQUFFO0dBQzVCLFVBQVUsSUFBSTtHQUNkLGlCQUFpQixVQUFVLEtBQUssR0FBRyxHQUFJO0VBQzNDLFNBQVMsS0FBSztHQUNWLFFBQVEsTUFBTSxlQUFlLEdBQUc7RUFDcEM7Q0FDSjtDQUVBLE9BQ0ksd0JBQUMsVUFBRDtFQUNJLE1BQUs7RUFDTCxTQUFTO0VBQ1QsT0FBTyxTQUFTLHlCQUF5QixRQUFRO0VBQ2pELFdBQVcsc0JBQXNCLFNBQVMsV0FBVyxHQUFHLEdBQUc7RUFDM0QsT0FBTyxFQUFFLEdBQUcsTUFBTTtZQUVqQixTQUNHLHdCQUFDLE1BQU0sVUFBUCxhQUNJLHdCQUFDLE9BQUQ7R0FBSyxPQUFNO0dBQUssUUFBTztHQUFLLFNBQVE7R0FBWSxNQUFLO0dBQU8sUUFBTztHQUFlLGFBQVk7R0FBTSxlQUFjO0dBQVEsZ0JBQWU7YUFDckksd0JBQUMsWUFBRCxFQUFVLFFBQU8saUJBQWtCOzs7OztFQUNsQzs7OztZQUNKLENBQUMsWUFBWSx3QkFBQyxRQUFELFlBQU0sVUFBYTs7OztVQUNyQjs7OzthQUVoQix3QkFBQyxNQUFNLFVBQVAsYUFDSSx3QkFBQyxPQUFEO0dBQUssT0FBTTtHQUFLLFFBQU87R0FBSyxTQUFRO0dBQVksTUFBSztHQUFPLFFBQU87R0FBZSxhQUFZO0dBQUksZUFBYztHQUFRLGdCQUFlO2FBQXZJLENBQ0ksd0JBQUMsUUFBRDtJQUFNLEdBQUU7SUFBSSxHQUFFO0lBQUksT0FBTTtJQUFLLFFBQU87SUFBSyxJQUFHO0lBQUksSUFBRztHQUFVOzs7O2FBQzdELHdCQUFDLFFBQUQsRUFBTSxHQUFFLDBEQUFnRTs7OztXQUN2RTs7Ozs7WUFDSixDQUFDLFlBQVksU0FBUyx3QkFBQyxRQUFELFlBQU8sTUFBWTs7OztVQUM5Qjs7Ozs7Q0FFaEI7Ozs7O0FBRWhCOzs7QUFHQSxlQUFlIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIkNvcHlCdXR0b24uanN4Il0sInZlcnNpb24iOjMsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0LCB1c2VSZWYsIHVzZU1lbW8sIHVzZUNhbGxiYWNrIH0gZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VOYXZpZ2F0ZSwgTGluaywgdXNlTG9jYXRpb24sIHVzZVBhcmFtcywgUm91dGVzLCBSb3V0ZSwgTmF2aWdhdGUsIEJyb3dzZXJSb3V0ZXIgfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJztcclxuXHJcbi8vIC0tLSBSRVVTQUJMRSBDT1BZIEJVVFRPTiBDT01QT05FTlQgLS0tXHJcbmNvbnN0IENvcHlCdXR0b24gPSAoeyB0ZXh0LCBsYWJlbCA9ICcnLCBpY29uT25seSA9IGZhbHNlLCBzdHlsZSA9IHt9LCBjbGFzc05hbWUgPSAnJyB9KSA9PiB7XHJcbiAgICBjb25zdCBbY29waWVkLCBzZXRDb3BpZWRdID0gdXNlU3RhdGUoZmFsc2UpO1xyXG5cclxuICAgIGNvbnN0IGhhbmRsZUNvcHkgPSAoZSkgPT4ge1xyXG4gICAgICAgIGlmIChlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCF0ZXh0KSByZXR1cm47XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgdGV4dFRvQ29weSA9IFN0cmluZyh0ZXh0KS50cmltKCk7XHJcbiAgICAgICAgaWYgKG5hdmlnYXRvci5jbGlwYm9hcmQgJiYgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQpIHtcclxuICAgICAgICAgICAgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQodGV4dFRvQ29weSkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzZXRDb3BpZWQodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHNldENvcGllZChmYWxzZSksIDIwMDApO1xyXG4gICAgICAgICAgICB9KS5jYXRjaCgoKSA9PiBmYWxsYmFja0NvcHkodGV4dFRvQ29weSkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGZhbGxiYWNrQ29weSh0ZXh0VG9Db3B5KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IGZhbGxiYWNrQ29weSA9IChzdHIpID0+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RleHRhcmVhJyk7XHJcbiAgICAgICAgICAgIGVsLnZhbHVlID0gc3RyO1xyXG4gICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ3JlYWRvbmx5JywgJycpO1xyXG4gICAgICAgICAgICBlbC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XHJcbiAgICAgICAgICAgIGVsLnN0eWxlLmxlZnQgPSAnLTk5OTlweCc7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZWwpO1xyXG4gICAgICAgICAgICBlbC5zZWxlY3QoKTtcclxuICAgICAgICAgICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2NvcHknKTtcclxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChlbCk7XHJcbiAgICAgICAgICAgIHNldENvcGllZCh0cnVlKTtcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBzZXRDb3BpZWQoZmFsc2UpLCAyMDAwKTtcclxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkNvcHkgZmFpbGVkXCIsIGVycik7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gKFxyXG4gICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgIG9uQ2xpY2s9e2hhbmRsZUNvcHl9XHJcbiAgICAgICAgICAgIHRpdGxlPXtjb3BpZWQgPyBcIkNvcGllZCB0byBjbGlwYm9hcmQhXCIgOiBgQ29weSAke3RleHR9YH1cclxuICAgICAgICAgICAgY2xhc3NOYW1lPXtgY29weS1idG4tY29tcG9uZW50ICR7Y29waWVkID8gJ2NvcGllZCcgOiAnJ30gJHtjbGFzc05hbWV9YH1cclxuICAgICAgICAgICAgc3R5bGU9e3sgLi4uc3R5bGUgfX1cclxuICAgICAgICA+XHJcbiAgICAgICAgICAgIHtjb3BpZWQgPyAoXHJcbiAgICAgICAgICAgICAgICA8UmVhY3QuRnJhZ21lbnQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjEzXCIgaGVpZ2h0PVwiMTNcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjIuNVwiIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlsaW5lIHBvaW50cz1cIjIwIDYgOSAxNyA0IDEyXCIgLz5cclxuICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICAgICAgICB7IWljb25Pbmx5ICYmIDxzcGFuPkNvcGllZCE8L3NwYW4+fVxyXG4gICAgICAgICAgICAgICAgPC9SZWFjdC5GcmFnbWVudD5cclxuICAgICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgICAgIDxSZWFjdC5GcmFnbWVudD5cclxuICAgICAgICAgICAgICAgICAgICA8c3ZnIHdpZHRoPVwiMTNcIiBoZWlnaHQ9XCIxM1wiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHJlY3QgeD1cIjlcIiB5PVwiOVwiIHdpZHRoPVwiMTNcIiBoZWlnaHQ9XCIxM1wiIHJ4PVwiMlwiIHJ5PVwiMlwiPjwvcmVjdD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk01IDE1SDRhMiAyIDAgMCAxLTItMlY0YTIgMiAwIDAgMSAyLTJoOWEyIDIgMCAwIDEgMiAydjFcIj48L3BhdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICAgICAgeyFpY29uT25seSAmJiBsYWJlbCAmJiA8c3Bhbj57bGFiZWx9PC9zcGFuPn1cclxuICAgICAgICAgICAgICAgIDwvUmVhY3QuRnJhZ21lbnQ+XHJcbiAgICAgICAgICAgICl9XHJcbiAgICAgICAgPC9idXR0b24+XHJcbiAgICApO1xyXG59O1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IENvcHlCdXR0b247XHJcbiJdfQ==