import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/components/AuthRequiredModal.jsx");const React = __vite__cjsImport0_react;const _jsxDEV = __vite__cjsImport2_react_jsxDevRuntime["jsxDEV"];import __vite__cjsImport0_react from "/node_modules/.vite/deps/react.js?v=42a9b196";
import { useNavigate } from "/node_modules/.vite/deps/react-router-dom.js?v=42a9b196";
var _jsxFileName = "D:/The Ethnic Touch/frontend/src/components/AuthRequiredModal.jsx";
import __vite__cjsImport2_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=42a9b196";
var _s = $RefreshSig$();
const AuthRequiredModal = ({ isOpen, onClose, redirectPath = "/checkout" }) => {
	_s();
	const navigate = useNavigate();
	if (!isOpen) return null;
	const handleProceedToAuth = () => {
		onClose();
		navigate(`/auth?redirect=${encodeURIComponent(redirectPath)}`);
	};
	return /* @__PURE__ */ _jsxDEV("div", {
		style: {
			position: "fixed",
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			backgroundColor: "rgba(45, 42, 38, 0.65)",
			backdropFilter: "blur(8px)",
			WebkitBackdropFilter: "blur(8px)",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			zIndex: 999999,
			padding: "1.5rem"
		},
		onClick: onClose,
		children: /* @__PURE__ */ _jsxDEV("div", {
			style: {
				background: "#FFFFFF",
				borderRadius: "24px",
				maxWidth: "460px",
				width: "100%",
				padding: "2.5rem 2rem 2rem",
				boxShadow: "0 25px 60px rgba(0, 0, 0, 0.22)",
				textAlign: "center",
				position: "relative",
				border: "1.5px solid rgba(212, 163, 115, 0.3)"
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
						background: "#FAF7F4",
						border: "none",
						fontSize: "1rem",
						color: "#888",
						cursor: "pointer",
						width: "32px",
						height: "32px",
						borderRadius: "50%",
						display: "flex",
						alignItems: "center",
						justifyContent: "center"
					},
					children: "✕"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 47,
					columnNumber: 17
				}, this),
				/* @__PURE__ */ _jsxDEV("div", {
					style: {
						width: "64px",
						height: "64px",
						borderRadius: "50%",
						backgroundColor: "#FAF7F2",
						border: "1.5px solid rgba(212, 163, 115, 0.4)",
						color: "#8F5E36",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						margin: "0 auto 1.25rem"
					},
					children: /* @__PURE__ */ _jsxDEV("svg", {
						width: "28",
						height: "28",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "2",
						strokeLinecap: "round",
						strokeLinejoin: "round",
						children: [/* @__PURE__ */ _jsxDEV("rect", {
							x: "3",
							y: "11",
							width: "18",
							height: "11",
							rx: "2",
							ry: "2"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 84,
							columnNumber: 25
						}, this), /* @__PURE__ */ _jsxDEV("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 85,
							columnNumber: 25
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 83,
						columnNumber: 21
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 71,
					columnNumber: 17
				}, this),
				/* @__PURE__ */ _jsxDEV("h3", {
					style: {
						fontFamily: "var(--font-heading)",
						fontSize: "1.5rem",
						fontWeight: "400",
						color: "#2D2A26",
						margin: "0 0 0.6rem"
					},
					children: "Sign In or Sign Up Required"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 89,
					columnNumber: 17
				}, this),
				/* @__PURE__ */ _jsxDEV("p", {
					style: {
						fontSize: "0.88rem",
						color: "#6C6863",
						lineHeight: "1.6",
						margin: "0 0 1.75rem"
					},
					children: [
						"Please sign in to your account or create a new one to complete your purchase. You'll be returned directly to ",
						/* @__PURE__ */ _jsxDEV("strong", { children: "Checkout" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 105,
							columnNumber: 130
						}, this),
						" right after!"
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 99,
					columnNumber: 17
				}, this),
				/* @__PURE__ */ _jsxDEV("div", {
					style: {
						display: "flex",
						flexDirection: "column",
						gap: "0.65rem"
					},
					children: [/* @__PURE__ */ _jsxDEV("button", {
						onClick: handleProceedToAuth,
						style: {
							width: "100%",
							padding: "0.85rem",
							fontSize: "0.9rem",
							fontWeight: "600",
							background: "linear-gradient(135deg, #D4A373 0%, #C49363 100%)",
							color: "#FFFFFF",
							border: "none",
							borderRadius: "50px",
							cursor: "pointer",
							boxShadow: "0 6px 20px rgba(212, 163, 115, 0.3)",
							transition: "all 0.25s ease"
						},
						children: "Sign In / Create Account →"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 109,
						columnNumber: 21
					}, this), /* @__PURE__ */ _jsxDEV("button", {
						onClick: onClose,
						style: {
							width: "100%",
							padding: "0.75rem",
							fontSize: "0.85rem",
							fontWeight: "500",
							background: "transparent",
							color: "#6C6863",
							border: "none",
							cursor: "pointer"
						},
						children: "Cancel & Stay on Cart"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 128,
						columnNumber: 21
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 108,
					columnNumber: 17
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 33,
			columnNumber: 13
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 15,
		columnNumber: 9
	}, this);
};
_s(AuthRequiredModal, "CzcTeTziyjMsSrAVmHuCCb6+Bfg=", false, function() {
	return [useNavigate];
});
_c = AuthRequiredModal;
export default AuthRequiredModal;
var _c;
$RefreshReg$(_c, "AuthRequiredModal");
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;
import * as __vite_react_currentExports from "/src/components/AuthRequiredModal.jsx";
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }

  const currentExports = __vite_react_currentExports;
  queueMicrotask(() => {
    RefreshRuntime.registerExportsForReactRefresh("D:/The Ethnic Touch/frontend/src/components/AuthRequiredModal.jsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("D:/The Ethnic Touch/frontend/src/components/AuthRequiredModal.jsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
function $RefreshReg$(type, id) { return RefreshRuntime.register(type, "D:/The Ethnic Touch/frontend/src/components/AuthRequiredModal.jsx" + ' ' + id); }
function $RefreshSig$() { return RefreshRuntime.createSignatureFunctionForTransform(); }

//# sourceMappingURL=data:application/json;base64,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cmNlcyI6WyJBdXRoUmVxdWlyZWRNb2RhbC5qc3giXSwidmVyc2lvbiI6Mywic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZU5hdmlnYXRlIH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSc7XG5cbmNvbnN0IEF1dGhSZXF1aXJlZE1vZGFsID0gKHsgaXNPcGVuLCBvbkNsb3NlLCByZWRpcmVjdFBhdGggPSAnL2NoZWNrb3V0JyB9KSA9PiB7XG4gICAgY29uc3QgbmF2aWdhdGUgPSB1c2VOYXZpZ2F0ZSgpO1xuXG4gICAgaWYgKCFpc09wZW4pIHJldHVybiBudWxsO1xuXG4gICAgY29uc3QgaGFuZGxlUHJvY2VlZFRvQXV0aCA9ICgpID0+IHtcbiAgICAgICAgb25DbG9zZSgpO1xuICAgICAgICBuYXZpZ2F0ZShgL2F1dGg/cmVkaXJlY3Q9JHtlbmNvZGVVUklDb21wb25lbnQocmVkaXJlY3RQYXRoKX1gKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdmaXhlZCcsXG4gICAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICAgICAgcmlnaHQ6IDAsXG4gICAgICAgICAgICAgICAgYm90dG9tOiAwLFxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJ3JnYmEoNDUsIDQyLCAzOCwgMC42NSknLFxuICAgICAgICAgICAgICAgIGJhY2tkcm9wRmlsdGVyOiAnYmx1cig4cHgpJyxcbiAgICAgICAgICAgICAgICBXZWJraXRCYWNrZHJvcEZpbHRlcjogJ2JsdXIoOHB4KScsXG4gICAgICAgICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgICB6SW5kZXg6IDk5OTk5OSxcbiAgICAgICAgICAgICAgICBwYWRkaW5nOiAnMS41cmVtJ1xuICAgICAgICAgICAgfX0gXG4gICAgICAgICAgICBvbkNsaWNrPXtvbkNsb3NlfVxuICAgICAgICA+XG4gICAgICAgICAgICA8ZGl2IFxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6ICcjRkZGRkZGJyxcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnMjRweCcsXG4gICAgICAgICAgICAgICAgICAgIG1heFdpZHRoOiAnNDYwcHgnLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAnMi41cmVtIDJyZW0gMnJlbScsXG4gICAgICAgICAgICAgICAgICAgIGJveFNoYWRvdzogJzAgMjVweCA2MHB4IHJnYmEoMCwgMCwgMCwgMC4yMiknLFxuICAgICAgICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiAnMS41cHggc29saWQgcmdiYSgyMTIsIDE2MywgMTE1LCAwLjMpJ1xuICAgICAgICAgICAgICAgIH19IFxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9e2UgPT4gZS5zdG9wUHJvcGFnYXRpb24oKX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIFxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtvbkNsb3NlfVxuICAgICAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPVwiQ2xvc2UgZGlhbG9nXCJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiAnMS4ycmVtJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0OiAnMS4ycmVtJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6ICcjRkFGN0Y0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlcjogJ25vbmUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6ICcxcmVtJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzg4OCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAnMzJweCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6ICczMnB4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzUwJScsXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJ1xuICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAg4pyVXG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG5cbiAgICAgICAgICAgICAgICB7LyogUm95YWwgTG9jayBJY29uICovfVxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICc2NHB4JyxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAnNjRweCcsXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzUwJScsXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJyNGQUY3RjInLFxuICAgICAgICAgICAgICAgICAgICBib3JkZXI6ICcxLjVweCBzb2xpZCByZ2JhKDIxMiwgMTYzLCAxMTUsIDAuNCknLFxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM4RjVFMzYnLFxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgICAgIG1hcmdpbjogJzAgYXV0byAxLjI1cmVtJ1xuICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgICAgICA8c3ZnIHdpZHRoPVwiMjhcIiBoZWlnaHQ9XCIyOFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxyZWN0IHg9XCIzXCIgeT1cIjExXCIgd2lkdGg9XCIxOFwiIGhlaWdodD1cIjExXCIgcng9XCIyXCIgcnk9XCIyXCI+PC9yZWN0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk03IDExVjdhNSA1IDAgMCAxIDEwIDB2NFwiPjwvcGF0aD5cbiAgICAgICAgICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICA8aDMgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogJ3ZhcigtLWZvbnQtaGVhZGluZyknLFxuICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogJzEuNXJlbScsXG4gICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6ICc0MDAnLFxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMyRDJBMjYnLFxuICAgICAgICAgICAgICAgICAgICBtYXJnaW46ICcwIDAgMC42cmVtJ1xuICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgICAgICBTaWduIEluIG9yIFNpZ24gVXAgUmVxdWlyZWRcbiAgICAgICAgICAgICAgICA8L2gzPlxuXG4gICAgICAgICAgICAgICAgPHAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6ICcwLjg4cmVtJyxcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjNkM2ODYzJyxcbiAgICAgICAgICAgICAgICAgICAgbGluZUhlaWdodDogJzEuNicsXG4gICAgICAgICAgICAgICAgICAgIG1hcmdpbjogJzAgMCAxLjc1cmVtJ1xuICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgICAgICBQbGVhc2Ugc2lnbiBpbiB0byB5b3VyIGFjY291bnQgb3IgY3JlYXRlIGEgbmV3IG9uZSB0byBjb21wbGV0ZSB5b3VyIHB1cmNoYXNlLiBZb3UnbGwgYmUgcmV0dXJuZWQgZGlyZWN0bHkgdG8gPHN0cm9uZz5DaGVja291dDwvc3Ryb25nPiByaWdodCBhZnRlciFcbiAgICAgICAgICAgICAgICA8L3A+XG5cbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsIGdhcDogJzAuNjVyZW0nIH19PlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIFxuICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17aGFuZGxlUHJvY2VlZFRvQXV0aH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAnMC44NXJlbScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6ICcwLjlyZW0nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6ICc2MDAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6ICdsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAjRDRBMzczIDAlLCAjQzQ5MzYzIDEwMCUpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyNGRkZGRkYnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlcjogJ25vbmUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzUwcHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJveFNoYWRvdzogJzAgNnB4IDIwcHggcmdiYSgyMTIsIDE2MywgMTE1LCAwLjMpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiAnYWxsIDAuMjVzIGVhc2UnXG4gICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICBTaWduIEluIC8gQ3JlYXRlIEFjY291bnQgJnJhcnI7XG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtvbkNsb3NlfVxuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6ICcwLjc1cmVtJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogJzAuODVyZW0nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6ICc1MDAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjNkM2ODYzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXI6ICdub25lJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJzb3I6ICdwb2ludGVyJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgQ2FuY2VsICYgU3RheSBvbiBDYXJ0XG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBBdXRoUmVxdWlyZWRNb2RhbDtcbiJdfQ==