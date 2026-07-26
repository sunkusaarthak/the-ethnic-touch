import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/context/AlertContext.jsx");const React = __vite__cjsImport0_react; const createContext = __vite__cjsImport0_react["createContext"]; const useContext = __vite__cjsImport0_react["useContext"]; const useState = __vite__cjsImport0_react["useState"]; const useEffect = __vite__cjsImport0_react["useEffect"]; const useCallback = __vite__cjsImport0_react["useCallback"];const _jsxDEV = __vite__cjsImport2_react_jsxDevRuntime["jsxDEV"];import __vite__cjsImport0_react from "/node_modules/.vite/deps/react.js?v=42a9b196";
import PremiumAlertModal from "/src/components/PremiumAlertModal.jsx";
var _jsxFileName = "D:/The Ethnic Touch/frontend/src/context/AlertContext.jsx";
import __vite__cjsImport2_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=42a9b196";
var _s = $RefreshSig$(), _s2 = $RefreshSig$();
const AlertContext = createContext({
	showAlert: () => {},
	closeAlert: () => {}
});
_c = AlertContext;
export const AlertProvider = ({ children }) => {
	_s();
	const [alertState, setAlertState] = useState({
		isOpen: false,
		title: "",
		message: "",
		type: "warning"
	});
	const showAlert = useCallback((message, title = "Notice", type = "warning") => {
		setAlertState({
			isOpen: true,
			title,
			message,
			type
		});
	}, []);
	const closeAlert = useCallback(() => {
		setAlertState((prev) => ({
			...prev,
			isOpen: false
		}));
	}, []);
	useEffect(() => {
		window.customAlert = showAlert;
		return () => {
			if (window.customAlert === showAlert) {
				delete window.customAlert;
			}
		};
	}, [showAlert]);
	return /* @__PURE__ */ _jsxDEV(AlertContext.Provider, {
		value: {
			showAlert,
			closeAlert
		},
		children: [children, /* @__PURE__ */ _jsxDEV(PremiumAlertModal, {
			isOpen: alertState.isOpen,
			onClose: closeAlert,
			title: alertState.title,
			message: alertState.message,
			type: alertState.type
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 42,
			columnNumber: 13
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 40,
		columnNumber: 9
	}, this);
};
_s(AlertProvider, "YxCxm8OpPSP6UaWlOiZ3qXnxJJ4=");
_c2 = AlertProvider;
export const useAlert = () => {
	_s2();
	return useContext(AlertContext);
};
_s2(useAlert, "gDsCjeeItUuvgOWf1v4qoK9RF6k=");
export default AlertContext;
var _c, _c2;
$RefreshReg$(_c, "AlertContext");
$RefreshReg$(_c2, "AlertProvider");
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;
import * as __vite_react_currentExports from "/src/context/AlertContext.jsx";
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }

  const currentExports = __vite_react_currentExports;
  queueMicrotask(() => {
    RefreshRuntime.registerExportsForReactRefresh("D:/The Ethnic Touch/frontend/src/context/AlertContext.jsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("D:/The Ethnic Touch/frontend/src/context/AlertContext.jsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
function $RefreshReg$(type, id) { return RefreshRuntime.register(type, "D:/The Ethnic Touch/frontend/src/context/AlertContext.jsx" + ' ' + id); }
function $RefreshSig$() { return RefreshRuntime.createSignatureFunctionForTransform(); }

//# sourceMappingURL=data:application/json;base64,eyJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLGVBQWUsWUFBWSxVQUFVLFdBQVcsbUJBQW1CO0FBQ25GLE9BQU8sdUJBQXVCOzs7O0FBRTlCLE1BQU0sZUFBZSxjQUFjO0NBQy9CLGlCQUFpQixDQUFDO0NBQ2xCLGtCQUFrQixDQUFDO0FBQ3ZCLENBQUM7O0FBRUQsT0FBTyxNQUFNLGlCQUFpQixFQUFFLGVBQWU7O0NBQzNDLE1BQU0sQ0FBQyxZQUFZLGlCQUFpQixTQUFTO0VBQ3pDLFFBQVE7RUFDUixPQUFPO0VBQ1AsU0FBUztFQUNULE1BQU07Q0FDVixDQUFDO0NBRUQsTUFBTSxZQUFZLGFBQWEsU0FBUyxRQUFRLFVBQVUsT0FBTyxjQUFjO0VBQzNFLGNBQWM7R0FDVixRQUFRO0dBQ1I7R0FDQTtHQUNBO0VBQ0osQ0FBQztDQUNMLEdBQUcsQ0FBQyxDQUFDO0NBRUwsTUFBTSxhQUFhLGtCQUFrQjtFQUNqQyxlQUFjLFVBQVM7R0FBRSxHQUFHO0dBQU0sUUFBUTtFQUFNLEVBQUU7Q0FDdEQsR0FBRyxDQUFDLENBQUM7Q0FFTCxnQkFBZ0I7RUFDWixPQUFPLGNBQWM7RUFDckIsYUFBYTtHQUNULElBQUksT0FBTyxnQkFBZ0IsV0FBVztJQUNsQyxPQUFPLE9BQU87R0FDbEI7RUFDSjtDQUNKLEdBQUcsQ0FBQyxTQUFTLENBQUM7Q0FFZCxPQUNJLHdCQUFDLGFBQWEsVUFBZDtFQUF1QixPQUFPO0dBQUU7R0FBVztFQUFXO1lBQXRELENBQ0ssVUFDRCx3QkFBQyxtQkFBRDtHQUNJLFFBQVEsV0FBVztHQUNuQixTQUFTO0dBQ1QsT0FBTyxXQUFXO0dBQ2xCLFNBQVMsV0FBVztHQUNwQixNQUFNLFdBQVc7RUFDcEI7Ozs7VUFDa0I7Ozs7OztBQUUvQjs7O0FBRUEsT0FBTyxNQUFNLGlCQUFpQjs7bUJBQVcsWUFBWTs7O0FBRXJELGVBQWUiLCJuYW1lcyI6W10sInNvdXJjZXMiOlsiQWxlcnRDb250ZXh0LmpzeCJdLCJ2ZXJzaW9uIjozLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgY3JlYXRlQ29udGV4dCwgdXNlQ29udGV4dCwgdXNlU3RhdGUsIHVzZUVmZmVjdCwgdXNlQ2FsbGJhY2sgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJlbWl1bUFsZXJ0TW9kYWwgZnJvbSAnLi4vY29tcG9uZW50cy9QcmVtaXVtQWxlcnRNb2RhbCc7XG5cbmNvbnN0IEFsZXJ0Q29udGV4dCA9IGNyZWF0ZUNvbnRleHQoe1xuICAgIHNob3dBbGVydDogKCkgPT4ge30sXG4gICAgY2xvc2VBbGVydDogKCkgPT4ge31cbn0pO1xuXG5leHBvcnQgY29uc3QgQWxlcnRQcm92aWRlciA9ICh7IGNoaWxkcmVuIH0pID0+IHtcbiAgICBjb25zdCBbYWxlcnRTdGF0ZSwgc2V0QWxlcnRTdGF0ZV0gPSB1c2VTdGF0ZSh7XG4gICAgICAgIGlzT3BlbjogZmFsc2UsXG4gICAgICAgIHRpdGxlOiAnJyxcbiAgICAgICAgbWVzc2FnZTogJycsXG4gICAgICAgIHR5cGU6ICd3YXJuaW5nJ1xuICAgIH0pO1xuXG4gICAgY29uc3Qgc2hvd0FsZXJ0ID0gdXNlQ2FsbGJhY2soKG1lc3NhZ2UsIHRpdGxlID0gXCJOb3RpY2VcIiwgdHlwZSA9IFwid2FybmluZ1wiKSA9PiB7XG4gICAgICAgIHNldEFsZXJ0U3RhdGUoe1xuICAgICAgICAgICAgaXNPcGVuOiB0cnVlLFxuICAgICAgICAgICAgdGl0bGUsXG4gICAgICAgICAgICBtZXNzYWdlLFxuICAgICAgICAgICAgdHlwZVxuICAgICAgICB9KTtcbiAgICB9LCBbXSk7XG5cbiAgICBjb25zdCBjbG9zZUFsZXJ0ID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgICAgICBzZXRBbGVydFN0YXRlKHByZXYgPT4gKHsgLi4ucHJldiwgaXNPcGVuOiBmYWxzZSB9KSk7XG4gICAgfSwgW10pO1xuXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgd2luZG93LmN1c3RvbUFsZXJ0ID0gc2hvd0FsZXJ0O1xuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHdpbmRvdy5jdXN0b21BbGVydCA9PT0gc2hvd0FsZXJ0KSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHdpbmRvdy5jdXN0b21BbGVydDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9LCBbc2hvd0FsZXJ0XSk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8QWxlcnRDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt7IHNob3dBbGVydCwgY2xvc2VBbGVydCB9fT5cbiAgICAgICAgICAgIHtjaGlsZHJlbn1cbiAgICAgICAgICAgIDxQcmVtaXVtQWxlcnRNb2RhbFxuICAgICAgICAgICAgICAgIGlzT3Blbj17YWxlcnRTdGF0ZS5pc09wZW59XG4gICAgICAgICAgICAgICAgb25DbG9zZT17Y2xvc2VBbGVydH1cbiAgICAgICAgICAgICAgICB0aXRsZT17YWxlcnRTdGF0ZS50aXRsZX1cbiAgICAgICAgICAgICAgICBtZXNzYWdlPXthbGVydFN0YXRlLm1lc3NhZ2V9XG4gICAgICAgICAgICAgICAgdHlwZT17YWxlcnRTdGF0ZS50eXBlfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgPC9BbGVydENvbnRleHQuUHJvdmlkZXI+XG4gICAgKTtcbn07XG5cbmV4cG9ydCBjb25zdCB1c2VBbGVydCA9ICgpID0+IHVzZUNvbnRleHQoQWxlcnRDb250ZXh0KTtcblxuZXhwb3J0IGRlZmF1bHQgQWxlcnRDb250ZXh0O1xuIl19