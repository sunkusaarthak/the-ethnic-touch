import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/components/PremiumAlertModal.jsx");const React = __vite__cjsImport0_react; const useState = __vite__cjsImport0_react["useState"]; const useEffect = __vite__cjsImport0_react["useEffect"]; const useRef = __vite__cjsImport0_react["useRef"]; const useMemo = __vite__cjsImport0_react["useMemo"]; const useCallback = __vite__cjsImport0_react["useCallback"];const _jsxDEV = __vite__cjsImport2_react_jsxDevRuntime["jsxDEV"];import __vite__cjsImport0_react from "/node_modules/.vite/deps/react.js?v=42a9b196";
import { useNavigate, Link, useLocation, useParams, Routes, Route, Navigate, BrowserRouter } from "/node_modules/.vite/deps/react-router-dom.js?v=42a9b196";
var _jsxFileName = "D:/The Ethnic Touch/frontend/src/components/PremiumAlertModal.jsx";
import __vite__cjsImport2_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=42a9b196";
const PremiumAlertModal = ({ isOpen, onClose, title = "Notice", message = "", type = "warning" }) => {
	if (!isOpen) return null;
	const iconColor = type === "error" ? "#d32f2f" : type === "success" ? "#2e7d32" : "#b97a66";
	const iconBg = type === "error" ? "#ffebee" : type === "success" ? "#e8f5e9" : "#fff0e9";
	return /* @__PURE__ */ _jsxDEV("div", {
		style: {
			position: "fixed",
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			backgroundColor: "rgba(0, 0, 0, 0.55)",
			backdropFilter: "blur(8px)",
			WebkitBackdropFilter: "blur(8px)",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			zIndex: 999999,
			padding: "1.5rem",
			animation: "modalFadeIn 0.25s ease-out"
		},
		onClick: onClose,
		children: /* @__PURE__ */ _jsxDEV("div", {
			style: {
				background: "#ffffff",
				borderRadius: "16px",
				maxWidth: "440px",
				width: "100%",
				padding: "2rem 1.8rem",
				boxShadow: "0 25px 60px rgba(0,0,0,0.18)",
				textAlign: "center",
				position: "relative",
				animation: "modalSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
				border: "1px solid rgba(0,0,0,0.06)"
			},
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ _jsxDEV("button", {
					onClick: onClose,
					"aria-label": "Close dialog",
					style: {
						position: "absolute",
						top: "1.2rem",
						right: "1.2rem",
						background: "none",
						border: "none",
						fontSize: "1.2rem",
						color: "#aaa",
						cursor: "pointer",
						padding: "0.3rem",
						borderRadius: "50%",
						display: "flex",
						alignItems: "center",
						justifyContent: "center"
					},
					children: "✕"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 40,
					columnNumber: 17
				}, this),
				/* @__PURE__ */ _jsxDEV("div", {
					style: {
						width: "64px",
						height: "64px",
						borderRadius: "50%",
						backgroundColor: iconBg,
						color: iconColor,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						margin: "0 auto 1.2rem",
						boxShadow: `0 8px 20px ${iconBg}`
					},
					children: type === "error" ? /* @__PURE__ */ _jsxDEV("svg", {
						width: "32",
						height: "32",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "2.5",
						strokeLinecap: "round",
						strokeLinejoin: "round",
						children: [
							/* @__PURE__ */ _jsxDEV("circle", {
								cx: "12",
								cy: "12",
								r: "10"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 76,
								columnNumber: 29
							}, this),
							/* @__PURE__ */ _jsxDEV("line", {
								x1: "12",
								y1: "8",
								x2: "12",
								y2: "12"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 77,
								columnNumber: 29
							}, this),
							/* @__PURE__ */ _jsxDEV("line", {
								x1: "12",
								y1: "16",
								x2: "12.01",
								y2: "16"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 78,
								columnNumber: 29
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 75,
						columnNumber: 25
					}, this) : type === "success" ? /* @__PURE__ */ _jsxDEV("svg", {
						width: "32",
						height: "32",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "2.5",
						strokeLinecap: "round",
						strokeLinejoin: "round",
						children: /* @__PURE__ */ _jsxDEV("polyline", { points: "20 6 9 17 4 12" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 82,
							columnNumber: 29
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 81,
						columnNumber: 25
					}, this) : /* @__PURE__ */ _jsxDEV("svg", {
						width: "32",
						height: "32",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "2.5",
						strokeLinecap: "round",
						strokeLinejoin: "round",
						children: [
							/* @__PURE__ */ _jsxDEV("path", { d: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 86,
								columnNumber: 29
							}, this),
							/* @__PURE__ */ _jsxDEV("line", {
								x1: "12",
								y1: "9",
								x2: "12",
								y2: "13"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 87,
								columnNumber: 29
							}, this),
							/* @__PURE__ */ _jsxDEV("line", {
								x1: "12",
								y1: "17",
								x2: "12.01",
								y2: "17"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 88,
								columnNumber: 29
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 85,
						columnNumber: 25
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 62,
					columnNumber: 17
				}, this),
				/* @__PURE__ */ _jsxDEV("h3", {
					style: {
						fontFamily: "var(--font-title, serif)",
						fontSize: "1.4rem",
						fontWeight: "600",
						color: "#2D2A26",
						margin: "0 0 0.6rem"
					},
					children: title
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 93,
					columnNumber: 17
				}, this),
				/* @__PURE__ */ _jsxDEV("p", {
					style: {
						fontSize: "0.96rem",
						color: "#6C6863",
						lineHeight: "1.6",
						margin: "0 0 1.8rem"
					},
					children: message
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 103,
					columnNumber: 17
				}, this),
				/* @__PURE__ */ _jsxDEV("button", {
					onClick: onClose,
					className: "btn btn-primary",
					style: {
						width: "100%",
						padding: "0.9rem",
						fontSize: "1rem",
						borderRadius: "8px"
					},
					children: "Understood"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 112,
					columnNumber: 17
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 27,
			columnNumber: 13
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 11,
		columnNumber: 9
	}, this);
};
_c = PremiumAlertModal;
const showAlert = (message, title = "Notice", type = "warning") => {
	if (window.customAlert) {
		window.customAlert(message, title, type);
	} else {
		alert(message);
	}
};
export default PremiumAlertModal;
var _c;
$RefreshReg$(_c, "PremiumAlertModal");
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;
import * as __vite_react_currentExports from "/src/components/PremiumAlertModal.jsx";
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }

  const currentExports = __vite_react_currentExports;
  queueMicrotask(() => {
    RefreshRuntime.registerExportsForReactRefresh("D:/The Ethnic Touch/frontend/src/components/PremiumAlertModal.jsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("D:/The Ethnic Touch/frontend/src/components/PremiumAlertModal.jsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
function $RefreshReg$(type, id) { return RefreshRuntime.register(type, "D:/The Ethnic Touch/frontend/src/components/PremiumAlertModal.jsx" + ' ' + id); }
function $RefreshSig$() { return RefreshRuntime.createSignatureFunctionForTransform(); }

//# sourceMappingURL=data:application/json;base64,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QUFVO01BQ1YsWUFBWTtNQUNaLE9BQU87TUFDUCxRQUFRO0tBQ1o7ZUFDSztJQUNEOzs7OztJQUVKLHdCQUFDLEtBQUQ7S0FBRyxPQUFPO01BQ04sVUFBVTtNQUNWLE9BQU87TUFDUCxZQUFZO01BQ1osUUFBUTtLQUNaO2VBQ0s7SUFDRjs7Ozs7SUFFSCx3QkFBQyxVQUFEO0tBQ0ksU0FBUztLQUNULFdBQVU7S0FDVixPQUFPO01BQ0gsT0FBTztNQUNQLFNBQVM7TUFDVCxVQUFVO01BQ1YsY0FBYztLQUNsQjtlQUNIO0lBRU87Ozs7O0dBQ1A7Ozs7OztDQUNKOzs7OztBQUViOztBQUVBLE1BQU0sYUFBYSxTQUFTLFFBQVEsVUFBVSxPQUFPLGNBQWM7Q0FDL0QsSUFBSSxPQUFPLGFBQWE7RUFDcEIsT0FBTyxZQUFZLFNBQVMsT0FBTyxJQUFJO0NBQzNDLE9BQU87RUFDSCxNQUFNLE9BQU87Q0FDakI7QUFDSjtBQUVBLGVBQWUiLCJuYW1lcyI6W10sInNvdXJjZXMiOlsiUHJlbWl1bUFsZXJ0TW9kYWwuanN4Il0sInZlcnNpb24iOjMsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0LCB1c2VSZWYsIHVzZU1lbW8sIHVzZUNhbGxiYWNrIH0gZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VOYXZpZ2F0ZSwgTGluaywgdXNlTG9jYXRpb24sIHVzZVBhcmFtcywgUm91dGVzLCBSb3V0ZSwgTmF2aWdhdGUsIEJyb3dzZXJSb3V0ZXIgfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJztcclxuXHJcbmNvbnN0IFByZW1pdW1BbGVydE1vZGFsID0gKHsgaXNPcGVuLCBvbkNsb3NlLCB0aXRsZSA9IFwiTm90aWNlXCIsIG1lc3NhZ2UgPSBcIlwiLCB0eXBlID0gXCJ3YXJuaW5nXCIgfSkgPT4ge1xyXG4gICAgaWYgKCFpc09wZW4pIHJldHVybiBudWxsO1xyXG5cclxuICAgIGNvbnN0IGljb25Db2xvciA9IHR5cGUgPT09ICdlcnJvcicgPyAnI2QzMmYyZicgOiB0eXBlID09PSAnc3VjY2VzcycgPyAnIzJlN2QzMicgOiAnI2I5N2E2Nic7XHJcbiAgICBjb25zdCBpY29uQmcgPSB0eXBlID09PSAnZXJyb3InID8gJyNmZmViZWUnIDogdHlwZSA9PT0gJ3N1Y2Nlc3MnID8gJyNlOGY1ZTknIDogJyNmZmYwZTknO1xyXG5cclxuICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdiBzdHlsZT17e1xyXG4gICAgICAgICAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcclxuICAgICAgICAgICAgdG9wOiAwLFxyXG4gICAgICAgICAgICBsZWZ0OiAwLFxyXG4gICAgICAgICAgICByaWdodDogMCxcclxuICAgICAgICAgICAgYm90dG9tOiAwLFxyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdyZ2JhKDAsIDAsIDAsIDAuNTUpJyxcclxuICAgICAgICAgICAgYmFja2Ryb3BGaWx0ZXI6ICdibHVyKDhweCknLFxyXG4gICAgICAgICAgICBXZWJraXRCYWNrZHJvcEZpbHRlcjogJ2JsdXIoOHB4KScsXHJcbiAgICAgICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcclxuICAgICAgICAgICAgekluZGV4OiA5OTk5OTksXHJcbiAgICAgICAgICAgIHBhZGRpbmc6ICcxLjVyZW0nLFxyXG4gICAgICAgICAgICBhbmltYXRpb246ICdtb2RhbEZhZGVJbiAwLjI1cyBlYXNlLW91dCdcclxuICAgICAgICB9fSBvbkNsaWNrPXtvbkNsb3NlfT5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZDogJyNmZmZmZmYnLFxyXG4gICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnMTZweCcsXHJcbiAgICAgICAgICAgICAgICBtYXhXaWR0aDogJzQ0MHB4JyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXHJcbiAgICAgICAgICAgICAgICBwYWRkaW5nOiAnMnJlbSAxLjhyZW0nLFxyXG4gICAgICAgICAgICAgICAgYm94U2hhZG93OiAnMCAyNXB4IDYwcHggcmdiYSgwLDAsMCwwLjE4KScsXHJcbiAgICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxyXG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXHJcbiAgICAgICAgICAgICAgICBhbmltYXRpb246ICdtb2RhbFNsaWRlVXAgMC4yNXMgY3ViaWMtYmV6aWVyKDAuMTYsIDEsIDAuMywgMSknLFxyXG4gICAgICAgICAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkIHJnYmEoMCwwLDAsMC4wNiknXHJcbiAgICAgICAgICAgIH19IG9uQ2xpY2s9e2UgPT4gZS5zdG9wUHJvcGFnYXRpb24oKX0+XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIDxidXR0b24gXHJcbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17b25DbG9zZX1cclxuICAgICAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPVwiQ2xvc2UgZGlhbG9nXCJcclxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiAnMS4ycmVtJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmlnaHQ6ICcxLjJyZW0nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiAnbm9uZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlcjogJ25vbmUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogJzEuMnJlbScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnI2FhYScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAnMC4zcmVtJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnNTAlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInXHJcbiAgICAgICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICDinJVcclxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzY0cHgnLFxyXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogJzY0cHgnLFxyXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzUwJScsXHJcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBpY29uQmcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IGljb25Db2xvcixcclxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICAgICAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxyXG4gICAgICAgICAgICAgICAgICAgIG1hcmdpbjogJzAgYXV0byAxLjJyZW0nLFxyXG4gICAgICAgICAgICAgICAgICAgIGJveFNoYWRvdzogYDAgOHB4IDIwcHggJHtpY29uQmd9YFxyXG4gICAgICAgICAgICAgICAgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAge3R5cGUgPT09ICdlcnJvcicgPyAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIyLjVcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjEwXCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaW5lIHgxPVwiMTJcIiB5MT1cIjhcIiB4Mj1cIjEyXCIgeTI9XCIxMlwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGluZSB4MT1cIjEyXCIgeTE9XCIxNlwiIHgyPVwiMTIuMDFcIiB5Mj1cIjE2XCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICAgICAgKSA6IHR5cGUgPT09ICdzdWNjZXNzJyA/IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjIuNVwiIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5bGluZSBwb2ludHM9XCIyMCA2IDkgMTcgNCAxMlwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgICAgICAgICAgICkgOiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIyLjVcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTEwLjI5IDMuODZMMS44MiAxOGEyIDIgMCAwIDAgMS43MSAzaDE2Ljk0YTIgMiAwIDAgMCAxLjcxLTNMMTMuNzEgMy44NmEyIDIgMCAwIDAtMy40MiAwelwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGluZSB4MT1cIjEyXCIgeTE9XCI5XCIgeDI9XCIxMlwiIHkyPVwiMTNcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9XCIxMlwiIHkxPVwiMTdcIiB4Mj1cIjEyLjAxXCIgeTI9XCIxN1wiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICA8aDMgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiAndmFyKC0tZm9udC10aXRsZSwgc2VyaWYpJyxcclxuICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogJzEuNHJlbScsXHJcbiAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogJzYwMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjMkQyQTI2JyxcclxuICAgICAgICAgICAgICAgICAgICBtYXJnaW46ICcwIDAgMC42cmVtJ1xyXG4gICAgICAgICAgICAgICAgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAge3RpdGxlfVxyXG4gICAgICAgICAgICAgICAgPC9oMz5cclxuXHJcbiAgICAgICAgICAgICAgICA8cCBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAnMC45NnJlbScsXHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjNkM2ODYzJyxcclxuICAgICAgICAgICAgICAgICAgICBsaW5lSGVpZ2h0OiAnMS42JyxcclxuICAgICAgICAgICAgICAgICAgICBtYXJnaW46ICcwIDAgMS44cmVtJ1xyXG4gICAgICAgICAgICAgICAgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAge21lc3NhZ2V9XHJcbiAgICAgICAgICAgICAgICA8L3A+XHJcblxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBcclxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtvbkNsb3NlfVxyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeVwiXHJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogJzAuOXJlbScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAnMXJlbScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzhweCdcclxuICAgICAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgIFVuZGVyc3Rvb2RcclxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICk7XHJcbn07XHJcblxyXG5jb25zdCBzaG93QWxlcnQgPSAobWVzc2FnZSwgdGl0bGUgPSBcIk5vdGljZVwiLCB0eXBlID0gXCJ3YXJuaW5nXCIpID0+IHtcclxuICAgIGlmICh3aW5kb3cuY3VzdG9tQWxlcnQpIHtcclxuICAgICAgICB3aW5kb3cuY3VzdG9tQWxlcnQobWVzc2FnZSwgdGl0bGUsIHR5cGUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBhbGVydChtZXNzYWdlKTtcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFByZW1pdW1BbGVydE1vZGFsO1xyXG4iXX0=