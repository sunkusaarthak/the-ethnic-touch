import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/context/AuthContext.jsx");const React = __vite__cjsImport0_react; const createContext = __vite__cjsImport0_react["createContext"]; const useContext = __vite__cjsImport0_react["useContext"]; const useState = __vite__cjsImport0_react["useState"]; const useEffect = __vite__cjsImport0_react["useEffect"];const _jsxDEV = __vite__cjsImport3_react_jsxDevRuntime["jsxDEV"];import __vite__cjsImport0_react from "/node_modules/.vite/deps/react.js?v=42a9b196";
import { onAuthStateChanged, signOut } from "/node_modules/.vite/deps/firebase_auth.js?v=42a9b196";
import { auth } from "/src/data/config.jsx";
var _jsxFileName = "D:/The Ethnic Touch/frontend/src/context/AuthContext.jsx";
import __vite__cjsImport3_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=42a9b196";
var _s = $RefreshSig$(), _s2 = $RefreshSig$();
const AuthContext = createContext({
	authUser: null,
	authLoading: true,
	logout: async () => {}
});
_c = AuthContext;
export const AuthProvider = ({ children }) => {
	_s();
	const [authUser, setAuthUser] = useState(null);
	const [authLoading, setAuthLoading] = useState(true);
	useEffect(() => {
		if (!auth) {
			setAuthLoading(false);
			return;
		}
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setAuthUser(user);
			setAuthLoading(false);
		});
		return () => unsubscribe();
	}, []);
	const logout = async () => {
		if (auth) {
			await signOut(auth);
		}
	};
	return /* @__PURE__ */ _jsxDEV(AuthContext.Provider, {
		value: {
			authUser,
			authLoading,
			logout
		},
		children
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 36,
		columnNumber: 9
	}, this);
};
_s(AuthProvider, "EOsZdXhUKJkgfbozBv6KlE/TFrA=");
_c2 = AuthProvider;
export const useAuth = () => {
	_s2();
	return useContext(AuthContext);
};
_s2(useAuth, "gDsCjeeItUuvgOWf1v4qoK9RF6k=");
export default AuthContext;
var _c, _c2;
$RefreshReg$(_c, "AuthContext");
$RefreshReg$(_c2, "AuthProvider");
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;
import * as __vite_react_currentExports from "/src/context/AuthContext.jsx";
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }

  const currentExports = __vite_react_currentExports;
  queueMicrotask(() => {
    RefreshRuntime.registerExportsForReactRefresh("D:/The Ethnic Touch/frontend/src/context/AuthContext.jsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("D:/The Ethnic Touch/frontend/src/context/AuthContext.jsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
function $RefreshReg$(type, id) { return RefreshRuntime.register(type, "D:/The Ethnic Touch/frontend/src/context/AuthContext.jsx" + ' ' + id); }
function $RefreshSig$() { return RefreshRuntime.createSignatureFunctionForTransform(); }

//# sourceMappingURL=data:application/json;base64,eyJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLGVBQWUsWUFBWSxVQUFVLGlCQUFpQjtBQUN0RSxTQUFTLG9CQUFvQixlQUFlO0FBQzVDLFNBQVMsWUFBWTs7OztBQUVyQixNQUFNLGNBQWMsY0FBYztDQUM5QixVQUFVO0NBQ1YsYUFBYTtDQUNiLFFBQVEsWUFBWSxDQUFDO0FBQ3pCLENBQUM7O0FBRUQsT0FBTyxNQUFNLGdCQUFnQixFQUFFLGVBQWU7O0NBQzFDLE1BQU0sQ0FBQyxVQUFVLGVBQWUsU0FBUyxJQUFJO0NBQzdDLE1BQU0sQ0FBQyxhQUFhLGtCQUFrQixTQUFTLElBQUk7Q0FFbkQsZ0JBQWdCO0VBQ1osSUFBSSxDQUFDLE1BQU07R0FDUCxlQUFlLEtBQUs7R0FDcEI7RUFDSjtFQUVBLE1BQU0sY0FBYyxtQkFBbUIsT0FBTyxTQUFTO0dBQ25ELFlBQVksSUFBSTtHQUNoQixlQUFlLEtBQUs7RUFDeEIsQ0FBQztFQUVELGFBQWEsWUFBWTtDQUM3QixHQUFHLENBQUMsQ0FBQztDQUVMLE1BQU0sU0FBUyxZQUFZO0VBQ3ZCLElBQUksTUFBTTtHQUNOLE1BQU0sUUFBUSxJQUFJO0VBQ3RCO0NBQ0o7Q0FFQSxPQUNJLHdCQUFDLFlBQVksVUFBYjtFQUFzQixPQUFPO0dBQUU7R0FBVTtHQUFhO0VBQU87RUFDeEQ7Q0FDaUI7Ozs7O0FBRTlCOzs7QUFFQSxPQUFPLE1BQU0sZ0JBQWdCOzttQkFBVyxXQUFXOzs7QUFFbkQsZUFBZSIsIm5hbWVzIjpbXSwic291cmNlcyI6WyJBdXRoQ29udGV4dC5qc3giXSwidmVyc2lvbiI6Mywic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IGNyZWF0ZUNvbnRleHQsIHVzZUNvbnRleHQsIHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBvbkF1dGhTdGF0ZUNoYW5nZWQsIHNpZ25PdXQgfSBmcm9tICdmaXJlYmFzZS9hdXRoJztcbmltcG9ydCB7IGF1dGggfSBmcm9tICcuLi9kYXRhL2NvbmZpZyc7XG5cbmNvbnN0IEF1dGhDb250ZXh0ID0gY3JlYXRlQ29udGV4dCh7XG4gICAgYXV0aFVzZXI6IG51bGwsXG4gICAgYXV0aExvYWRpbmc6IHRydWUsXG4gICAgbG9nb3V0OiBhc3luYyAoKSA9PiB7fVxufSk7XG5cbmV4cG9ydCBjb25zdCBBdXRoUHJvdmlkZXIgPSAoeyBjaGlsZHJlbiB9KSA9PiB7XG4gICAgY29uc3QgW2F1dGhVc2VyLCBzZXRBdXRoVXNlcl0gPSB1c2VTdGF0ZShudWxsKTtcbiAgICBjb25zdCBbYXV0aExvYWRpbmcsIHNldEF1dGhMb2FkaW5nXSA9IHVzZVN0YXRlKHRydWUpO1xuXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKCFhdXRoKSB7XG4gICAgICAgICAgICBzZXRBdXRoTG9hZGluZyhmYWxzZSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB1bnN1YnNjcmliZSA9IG9uQXV0aFN0YXRlQ2hhbmdlZChhdXRoLCAodXNlcikgPT4ge1xuICAgICAgICAgICAgc2V0QXV0aFVzZXIodXNlcik7XG4gICAgICAgICAgICBzZXRBdXRoTG9hZGluZyhmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiAoKSA9PiB1bnN1YnNjcmliZSgpO1xuICAgIH0sIFtdKTtcblxuICAgIGNvbnN0IGxvZ291dCA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgaWYgKGF1dGgpIHtcbiAgICAgICAgICAgIGF3YWl0IHNpZ25PdXQoYXV0aCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPEF1dGhDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt7IGF1dGhVc2VyLCBhdXRoTG9hZGluZywgbG9nb3V0IH19PlxuICAgICAgICAgICAge2NoaWxkcmVufVxuICAgICAgICA8L0F1dGhDb250ZXh0LlByb3ZpZGVyPlxuICAgICk7XG59O1xuXG5leHBvcnQgY29uc3QgdXNlQXV0aCA9ICgpID0+IHVzZUNvbnRleHQoQXV0aENvbnRleHQpO1xuXG5leHBvcnQgZGVmYXVsdCBBdXRoQ29udGV4dDtcbiJdfQ==