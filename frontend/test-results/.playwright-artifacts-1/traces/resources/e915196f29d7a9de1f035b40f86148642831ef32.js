import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/components/ErrorBoundary.jsx");const _jsxDEV = __vite__cjsImport1_react_jsxDevRuntime["jsxDEV"];const React = __vite__cjsImport0_react;import __vite__cjsImport0_react from "/node_modules/.vite/deps/react.js?v=42a9b196";
var _jsxFileName = "D:/The Ethnic Touch/frontend/src/components/ErrorBoundary.jsx";
import __vite__cjsImport1_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=42a9b196";
class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			hasError: false,
			error: null
		};
	}
	static getDerivedStateFromError(error) {
		return {
			hasError: true,
			error
		};
	}
	componentDidCatch(error, errorInfo) {
		console.error("[ErrorBoundary] Caught UI runtime exception:", error, errorInfo);
	}
	handleReset = () => {
		this.setState({
			hasError: false,
			error: null
		});
		window.location.reload();
	};
	render() {
		if (this.state.hasError) {
			return /* @__PURE__ */ _jsxDEV("div", {
				style: {
					minHeight: "70vh",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					padding: "2rem",
					textAlign: "center",
					fontFamily: "var(--font-sans, system-ui, sans-serif)",
					color: "#333"
				},
				children: [
					/* @__PURE__ */ _jsxDEV("h2", {
						style: {
							fontSize: "1.75rem",
							marginBottom: "1rem",
							color: "#B97A66"
						},
						children: "Something went wrong"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 36,
						columnNumber: 21
					}, this),
					/* @__PURE__ */ _jsxDEV("p", {
						style: {
							maxWidth: "500px",
							marginBottom: "1.5rem",
							color: "#666",
							lineHeight: "1.6"
						},
						children: "An unexpected error occurred while loading this page. Please try refreshing or return to the storefront."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 39,
						columnNumber: 21
					}, this),
					/* @__PURE__ */ _jsxDEV("button", {
						onClick: this.handleReset,
						style: {
							padding: "0.75rem 1.75rem",
							backgroundColor: "#B97A66",
							color: "#fff",
							border: "none",
							borderRadius: "4px",
							cursor: "pointer",
							fontSize: "0.95rem",
							fontWeight: "500"
						},
						children: "Reload Page"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 42,
						columnNumber: 21
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 25,
				columnNumber: 17
			}, this);
		}
		return this.props.children;
	}
}
export default ErrorBoundary;
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;
import * as __vite_react_currentExports from "/src/components/ErrorBoundary.jsx";
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }

  const currentExports = __vite_react_currentExports;
  queueMicrotask(() => {
    RefreshRuntime.registerExportsForReactRefresh("D:/The Ethnic Touch/frontend/src/components/ErrorBoundary.jsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("D:/The Ethnic Touch/frontend/src/components/ErrorBoundary.jsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}

//# sourceMappingURL=data:application/json;base64,eyJtYXBwaW5ncyI6IkFBQUEsT0FBTyxXQUFXOzs7QUFFbEIsTUFBTSxzQkFBc0IsTUFBTSxVQUFVO0NBQ3hDLFlBQVksT0FBTztFQUNmLE1BQU0sS0FBSztFQUNYLEtBQUssUUFBUTtHQUFFLFVBQVU7R0FBTyxPQUFPO0VBQUs7Q0FDaEQ7Q0FFQSxPQUFPLHlCQUF5QixPQUFPO0VBQ25DLE9BQU87R0FBRSxVQUFVO0dBQU07RUFBTTtDQUNuQztDQUVBLGtCQUFrQixPQUFPLFdBQVc7RUFDaEMsUUFBUSxNQUFNLGdEQUFnRCxPQUFPLFNBQVM7Q0FDbEY7Q0FFQSxvQkFBb0I7RUFDaEIsS0FBSyxTQUFTO0dBQUUsVUFBVTtHQUFPLE9BQU87RUFBSyxDQUFDO0VBQzlDLE9BQU8sU0FBUyxPQUFPO0NBQzNCO0NBRUEsU0FBUztFQUNMLElBQUksS0FBSyxNQUFNLFVBQVU7R0FDckIsT0FDSSx3QkFBQyxPQUFEO0lBQUssT0FBTztLQUNSLFdBQVc7S0FDWCxTQUFTO0tBQ1QsZUFBZTtLQUNmLFlBQVk7S0FDWixnQkFBZ0I7S0FDaEIsU0FBUztLQUNULFdBQVc7S0FDWCxZQUFZO0tBQ1osT0FBTztJQUNYO2NBVkE7S0FXSSx3QkFBQyxNQUFEO01BQUksT0FBTztPQUFFLFVBQVU7T0FBVyxjQUFjO09BQVEsT0FBTztNQUFVO2dCQUFHO0tBRXhFOzs7OztLQUNKLHdCQUFDLEtBQUQ7TUFBRyxPQUFPO09BQUUsVUFBVTtPQUFTLGNBQWM7T0FBVSxPQUFPO09BQVEsWUFBWTtNQUFNO2dCQUFHO0tBRXhGOzs7OztLQUNILHdCQUFDLFVBQUQ7TUFDSSxTQUFTLEtBQUs7TUFDZCxPQUFPO09BQ0gsU0FBUztPQUNULGlCQUFpQjtPQUNqQixPQUFPO09BQ1AsUUFBUTtPQUNSLGNBQWM7T0FDZCxRQUFRO09BQ1IsVUFBVTtPQUNWLFlBQVk7TUFDaEI7Z0JBQ0g7S0FFTzs7Ozs7SUFDUDs7Ozs7O0VBRWI7RUFFQSxPQUFPLEtBQUssTUFBTTtDQUN0QjtBQUNKO0FBRUEsZUFBZSIsIm5hbWVzIjpbXSwic291cmNlcyI6WyJFcnJvckJvdW5kYXJ5LmpzeCJdLCJ2ZXJzaW9uIjozLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5jbGFzcyBFcnJvckJvdW5kYXJ5IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7IGhhc0Vycm9yOiBmYWxzZSwgZXJyb3I6IG51bGwgfTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0RGVyaXZlZFN0YXRlRnJvbUVycm9yKGVycm9yKSB7XG4gICAgICAgIHJldHVybiB7IGhhc0Vycm9yOiB0cnVlLCBlcnJvciB9O1xuICAgIH1cblxuICAgIGNvbXBvbmVudERpZENhdGNoKGVycm9yLCBlcnJvckluZm8pIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIltFcnJvckJvdW5kYXJ5XSBDYXVnaHQgVUkgcnVudGltZSBleGNlcHRpb246XCIsIGVycm9yLCBlcnJvckluZm8pO1xuICAgIH1cblxuICAgIGhhbmRsZVJlc2V0ID0gKCkgPT4ge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHsgaGFzRXJyb3I6IGZhbHNlLCBlcnJvcjogbnVsbCB9KTtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgIH07XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmhhc0Vycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgbWluSGVpZ2h0OiAnNzB2aCcsXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICAgICAgICAgICAgICAgICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXG4gICAgICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6ICcycmVtJyxcbiAgICAgICAgICAgICAgICAgICAgdGV4dEFsaWduOiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogJ3ZhcigtLWZvbnQtc2Fucywgc3lzdGVtLXVpLCBzYW5zLXNlcmlmKScsXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzMzMydcbiAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICAgICAgPGgyIHN0eWxlPXt7IGZvbnRTaXplOiAnMS43NXJlbScsIG1hcmdpbkJvdHRvbTogJzFyZW0nLCBjb2xvcjogJyNCOTdBNjYnIH19PlxuICAgICAgICAgICAgICAgICAgICAgICAgU29tZXRoaW5nIHdlbnQgd3JvbmdcbiAgICAgICAgICAgICAgICAgICAgPC9oMj5cbiAgICAgICAgICAgICAgICAgICAgPHAgc3R5bGU9e3sgbWF4V2lkdGg6ICc1MDBweCcsIG1hcmdpbkJvdHRvbTogJzEuNXJlbScsIGNvbG9yOiAnIzY2NicsIGxpbmVIZWlnaHQ6ICcxLjYnIH19PlxuICAgICAgICAgICAgICAgICAgICAgICAgQW4gdW5leHBlY3RlZCBlcnJvciBvY2N1cnJlZCB3aGlsZSBsb2FkaW5nIHRoaXMgcGFnZS4gUGxlYXNlIHRyeSByZWZyZXNoaW5nIG9yIHJldHVybiB0byB0aGUgc3RvcmVmcm9udC5cbiAgICAgICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZVJlc2V0fVxuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAnMC43NXJlbSAxLjc1cmVtJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjQjk3QTY2JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyNmZmYnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlcjogJ25vbmUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzRweCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6ICcwLjk1cmVtJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiAnNTAwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgUmVsb2FkIFBhZ2VcbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMuY2hpbGRyZW47XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBFcnJvckJvdW5kYXJ5O1xuIl19