import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/components/ImageWithSkeleton.jsx");const React = __vite__cjsImport0_react; const useState = __vite__cjsImport0_react["useState"];const _jsxDEV = __vite__cjsImport1_react_jsxDevRuntime["jsxDEV"];import __vite__cjsImport0_react from "/node_modules/.vite/deps/react.js?v=42a9b196";
var _jsxFileName = "D:/The Ethnic Touch/frontend/src/components/ImageWithSkeleton.jsx";
import __vite__cjsImport1_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=42a9b196";
var _s = $RefreshSig$();
/**
* ImageWithSkeleton - Progressive Image Component
* Shows a subtle luxury shimmer placeholder while the image loads from CDN/Cloud.
* Prevents layout shifts and blank spaces.
*/
const ImageWithSkeleton = ({ src, alt, className = "", style = {}, onClick, ...props }) => {
	_s();
	const [loaded, setLoaded] = useState(false);
	const [error, setError] = useState(false);
	return /* @__PURE__ */ _jsxDEV("div", {
		style: {
			position: "relative",
			overflow: "hidden",
			display: "inline-block",
			width: "100%",
			height: "100%",
			...style
		},
		className,
		onClick,
		children: [!loaded && !error && /* @__PURE__ */ _jsxDEV("div", {
			className: "skeleton-box",
			style: {
				position: "absolute",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				width: "100%",
				height: "100%",
				borderRadius: style.borderRadius || "inherit",
				zIndex: 1
			}
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 27,
			columnNumber: 17
		}, this), /* @__PURE__ */ _jsxDEV("img", {
			src,
			alt: alt || "",
			onLoad: () => setLoaded(true),
			onError: () => {
				setError(true);
				setLoaded(true);
			},
			style: {
				width: "100%",
				height: "100%",
				objectFit: style.objectFit || "cover",
				borderRadius: style.borderRadius || "inherit",
				opacity: loaded ? 1 : 0,
				transition: "opacity 0.4s ease-in-out",
				display: "block"
			},
			...props
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 44,
			columnNumber: 13
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 13,
		columnNumber: 9
	}, this);
};
_s(ImageWithSkeleton, "B9hQxtsnxFRObpfL1Nsw2NbnmXo=");
_c = ImageWithSkeleton;
export default ImageWithSkeleton;
var _c;
$RefreshReg$(_c, "ImageWithSkeleton");
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;
import * as __vite_react_currentExports from "/src/components/ImageWithSkeleton.jsx";
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }

  const currentExports = __vite_react_currentExports;
  queueMicrotask(() => {
    RefreshRuntime.registerExportsForReactRefresh("D:/The Ethnic Touch/frontend/src/components/ImageWithSkeleton.jsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("D:/The Ethnic Touch/frontend/src/components/ImageWithSkeleton.jsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
function $RefreshReg$(type, id) { return RefreshRuntime.register(type, "D:/The Ethnic Touch/frontend/src/components/ImageWithSkeleton.jsx" + ' ' + id); }
function $RefreshSig$() { return RefreshRuntime.createSignatureFunctionForTransform(); }

//# sourceMappingURL=data:application/json;base64,eyJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLGdCQUFnQjs7Ozs7Ozs7O0FBT2hDLE1BQU0scUJBQXFCLEVBQUUsS0FBSyxLQUFLLFlBQVksSUFBSSxRQUFRLENBQUMsR0FBRyxTQUFTLEdBQUcsWUFBWTs7Q0FDdkYsTUFBTSxDQUFDLFFBQVEsYUFBYSxTQUFTLEtBQUs7Q0FDMUMsTUFBTSxDQUFDLE9BQU8sWUFBWSxTQUFTLEtBQUs7Q0FFeEMsT0FDSSx3QkFBQyxPQUFEO0VBQ0ksT0FBTztHQUNILFVBQVU7R0FDVixVQUFVO0dBQ1YsU0FBUztHQUNULE9BQU87R0FDUCxRQUFRO0dBQ1IsR0FBRztFQUNQO0VBQ1c7RUFDRjtZQVZiLENBYUssQ0FBQyxVQUFVLENBQUMsU0FDVCx3QkFBQyxPQUFEO0dBQ0ksV0FBVTtHQUNWLE9BQU87SUFDSCxVQUFVO0lBQ1YsS0FBSztJQUNMLE1BQU07SUFDTixPQUFPO0lBQ1AsUUFBUTtJQUNSLE9BQU87SUFDUCxRQUFRO0lBQ1IsY0FBYyxNQUFNLGdCQUFnQjtJQUNwQyxRQUFRO0dBQ1o7RUFDSDs7OztZQUlMLHdCQUFDLE9BQUQ7R0FDUztHQUNMLEtBQUssT0FBTztHQUNaLGNBQWMsVUFBVSxJQUFJO0dBQzVCLGVBQWU7SUFDWCxTQUFTLElBQUk7SUFDYixVQUFVLElBQUk7R0FDbEI7R0FDQSxPQUFPO0lBQ0gsT0FBTztJQUNQLFFBQVE7SUFDUixXQUFXLE1BQU0sYUFBYTtJQUM5QixjQUFjLE1BQU0sZ0JBQWdCO0lBQ3BDLFNBQVMsU0FBUyxJQUFJO0lBQ3RCLFlBQVk7SUFDWixTQUFTO0dBQ2I7R0FDQSxHQUFJO0VBQ1A7Ozs7VUFDQTs7Ozs7O0FBRWI7OztBQUVBLGVBQWUiLCJuYW1lcyI6W10sInNvdXJjZXMiOlsiSW1hZ2VXaXRoU2tlbGV0b24uanN4Il0sInZlcnNpb24iOjMsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcblxuLyoqXG4gKiBJbWFnZVdpdGhTa2VsZXRvbiAtIFByb2dyZXNzaXZlIEltYWdlIENvbXBvbmVudFxuICogU2hvd3MgYSBzdWJ0bGUgbHV4dXJ5IHNoaW1tZXIgcGxhY2Vob2xkZXIgd2hpbGUgdGhlIGltYWdlIGxvYWRzIGZyb20gQ0ROL0Nsb3VkLlxuICogUHJldmVudHMgbGF5b3V0IHNoaWZ0cyBhbmQgYmxhbmsgc3BhY2VzLlxuICovXG5jb25zdCBJbWFnZVdpdGhTa2VsZXRvbiA9ICh7IHNyYywgYWx0LCBjbGFzc05hbWUgPSAnJywgc3R5bGUgPSB7fSwgb25DbGljaywgLi4ucHJvcHMgfSkgPT4ge1xuICAgIGNvbnN0IFtsb2FkZWQsIHNldExvYWRlZF0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gICAgY29uc3QgW2Vycm9yLCBzZXRFcnJvcl0gPSB1c2VTdGF0ZShmYWxzZSk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IFxuICAgICAgICAgICAgc3R5bGU9e3sgXG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsIFxuICAgICAgICAgICAgICAgIG92ZXJmbG93OiAnaGlkZGVuJywgXG4gICAgICAgICAgICAgICAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAuLi5zdHlsZSBcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZX1cbiAgICAgICAgICAgIG9uQ2xpY2s9e29uQ2xpY2t9XG4gICAgICAgID5cbiAgICAgICAgICAgIHsvKiBTaGltbWVyIFBsYWNlaG9sZGVyICh2aXNpYmxlIHdoaWxlIGxvYWRpbmcpICovfVxuICAgICAgICAgICAgeyFsb2FkZWQgJiYgIWVycm9yICYmIChcbiAgICAgICAgICAgICAgICA8ZGl2IFxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJza2VsZXRvbi1ib3hcIiBcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgYm90dG9tOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiBzdHlsZS5ib3JkZXJSYWRpdXMgfHwgJ2luaGVyaXQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgekluZGV4OiAxXG4gICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICl9XG5cbiAgICAgICAgICAgIHsvKiBBY3R1YWwgSW1hZ2UgKi99XG4gICAgICAgICAgICA8aW1nXG4gICAgICAgICAgICAgICAgc3JjPXtzcmN9XG4gICAgICAgICAgICAgICAgYWx0PXthbHQgfHwgJyd9XG4gICAgICAgICAgICAgICAgb25Mb2FkPXsoKSA9PiBzZXRMb2FkZWQodHJ1ZSl9XG4gICAgICAgICAgICAgICAgb25FcnJvcj17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZXRFcnJvcih0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgc2V0TG9hZGVkKHRydWUpO1xuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgIG9iamVjdEZpdDogc3R5bGUub2JqZWN0Rml0IHx8ICdjb3ZlcicsXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogc3R5bGUuYm9yZGVyUmFkaXVzIHx8ICdpbmhlcml0JyxcbiAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogbG9hZGVkID8gMSA6IDAsXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb246ICdvcGFjaXR5IDAuNHMgZWFzZS1pbi1vdXQnLFxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiAnYmxvY2snXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICB7Li4ucHJvcHN9XG4gICAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgSW1hZ2VXaXRoU2tlbGV0b247XG4iXX0=