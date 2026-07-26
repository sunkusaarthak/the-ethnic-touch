import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/pages/Auth.jsx");const React = __vite__cjsImport0_react; const useState = __vite__cjsImport0_react["useState"]; const useEffect = __vite__cjsImport0_react["useEffect"]; const useRef = __vite__cjsImport0_react["useRef"];const _jsxDEV = __vite__cjsImport4_react_jsxDevRuntime["jsxDEV"];import __vite__cjsImport0_react from "/node_modules/.vite/deps/react.js?v=42a9b196";
import { useNavigate, useLocation } from "/node_modules/.vite/deps/react-router-dom.js?v=42a9b196";
import { auth } from "/src/data/config.jsx";
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "/node_modules/.vite/deps/firebase_auth.js?v=42a9b196";
var _jsxFileName = "D:/The Ethnic Touch/frontend/src/pages/Auth.jsx";
import __vite__cjsImport4_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=42a9b196";
var _s = $RefreshSig$();
const Auth = () => {
	_s();
	const [isSignUp, setIsSignUp] = useState(false);
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const canvasRef = useRef(null);
	const containerRef = useRef(null);
	const navigate = useNavigate();
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const redirectPath = searchParams.get("redirect") || location.state?.from || "/";
	// Interactive Handcrafted Silk Textile & Gemini-style Shimmer Waves Canvas Animation
	useEffect(() => {
		const canvas = canvasRef.current;
		const container = containerRef.current;
		if (!canvas || !container) return;
		const ctx = canvas.getContext("2d");
		let animationFrameId;
		let width = canvas.width = container.offsetWidth;
		let height = canvas.height = container.offsetHeight;
		const handleResize = () => {
			if (!canvas || !container) return;
			width = canvas.width = container.offsetWidth;
			height = canvas.height = container.offsetHeight;
		};
		window.addEventListener("resize", handleResize);
		// Interactive Mouse Position for Liquid Fabric Ripples
		let mouse = {
			x: width * .4,
			y: height * .5,
			targetX: width * .4,
			targetY: height * .5
		};
		const handleMouseMove = (e) => {
			const rect = container.getBoundingClientRect();
			mouse.targetX = e.clientX - rect.left;
			mouse.targetY = e.clientY - rect.top;
		};
		window.addEventListener("mousemove", handleMouseMove);
		// Handcrafted Floating Gold & Terracotta Yarn Thread Fibers
		const threads = Array.from({ length: 32 }, () => ({
			x: Math.random() * width,
			y: Math.random() * height,
			length: 25 + Math.random() * 45,
			speed: .25 + Math.random() * .45,
			amplitude: 2 + Math.random() * 3.5,
			size: .8 + Math.random() * 1.4,
			color: [
				"rgba(212, 163, 115, 0.65)",
				"rgba(143, 94, 54, 0.5)",
				"rgba(244, 211, 146, 0.75)",
				"rgba(255, 229, 217, 0.85)"
			][Math.floor(Math.random() * 4)]
		}));
		let step = 0;
		const render = () => {
			step += .012;
			// Smooth mouse interpolation
			mouse.x += (mouse.targetX - mouse.x) * .05;
			mouse.y += (mouse.targetY - mouse.y) * .05;
			ctx.clearRect(0, 0, width, height);
			// 1. Draw Liquid Fabric Silk Gradient Waves (Gemini Shimmer Effect)
			const waveCount = 5;
			for (let i = 0; i < waveCount; i++) {
				ctx.beginPath();
				const grad = ctx.createLinearGradient(0, 0, width, height);
				if (i % 3 === 0) {
					grad.addColorStop(0, "rgba(212, 163, 115, 0.22)");
					grad.addColorStop(.5, "rgba(255, 229, 217, 0.38)");
					grad.addColorStop(1, "rgba(143, 94, 54, 0.18)");
				} else if (i % 3 === 1) {
					grad.addColorStop(0, "rgba(244, 211, 146, 0.25)");
					grad.addColorStop(.5, "rgba(212, 163, 115, 0.32)");
					grad.addColorStop(1, "rgba(255, 248, 240, 0.22)");
				} else {
					grad.addColorStop(0, "rgba(143, 94, 54, 0.15)");
					grad.addColorStop(.5, "rgba(212, 163, 115, 0.28)");
					grad.addColorStop(1, "rgba(255, 229, 217, 0.25)");
				}
				ctx.fillStyle = grad;
				ctx.moveTo(0, height);
				for (let x = 0; x <= width + 20; x += 15) {
					// Calculate interactive cursor deflection
					const dx = x - mouse.x;
					const dist = Math.abs(dx);
					const mouseDeflect = Math.max(0, 1 - dist / 320) * 40;
					const y = Math.sin(x * .0028 + step + i * .75) * (35 + i * 12) + Math.cos(x * .0055 - step * .4) * 18 + height * .48 + (i * 38 - 80) - Math.sin((x + mouse.x) * .0018) * mouseDeflect;
					ctx.lineTo(x, y);
				}
				ctx.lineTo(width, height);
				ctx.lineTo(0, height);
				ctx.closePath();
				ctx.fill();
			}
			// 2. Draw Floating Handcrafted Textile Fibers & Yarn Threads
			threads.forEach((t) => {
				t.y -= t.speed;
				t.x += Math.sin(step + t.y * .01) * .4;
				if (t.y < -60) {
					t.y = height + 60;
					t.x = Math.random() * width;
				}
				ctx.save();
				ctx.beginPath();
				ctx.strokeStyle = t.color;
				ctx.lineWidth = t.size;
				ctx.lineCap = "round";
				// Curved thread wave line
				ctx.moveTo(t.x, t.y);
				const cpX = t.x + Math.sin(step * 2 + t.y * .02) * t.amplitude;
				const cpY = t.y - t.length * .5;
				const endX = t.x + Math.cos(step + t.y * .01) * (t.amplitude * .8);
				const endY = t.y - t.length;
				ctx.quadraticCurveTo(cpX, cpY, endX, endY);
				ctx.stroke();
				// Small thread knot dot
				ctx.beginPath();
				ctx.arc(t.x, t.y, t.size * .8, 0, Math.PI * 2);
				ctx.fillStyle = t.color;
				ctx.fill();
				ctx.restore();
			});
			animationFrameId = requestAnimationFrame(render);
		};
		render();
		return () => {
			window.removeEventListener("resize", handleResize);
			window.removeEventListener("mousemove", handleMouseMove);
			cancelAnimationFrame(animationFrameId);
		};
	}, []);
	const handleGoogleSignIn = async () => {
		setError("");
		setLoading(true);
		try {
			const provider = new GoogleAuthProvider();
			await signInWithPopup(auth, provider);
			navigate(redirectPath);
		} catch (err) {
			console.error("[AUTH ERROR] Google Sign-In failed:", err);
			setError(err.message || "Failed to sign in with Google");
		} finally {
			setLoading(false);
		}
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);
		try {
			if (isSignUp) {
				const userCredential = await createUserWithEmailAndPassword(auth, email, password);
				if (userCredential.user) {
					await updateProfile(userCredential.user, { displayName: fullName });
				}
			} else {
				await signInWithEmailAndPassword(auth, email, password);
			}
			navigate(redirectPath);
		} catch (err) {
			console.error("[AUTH ERROR] Email Authentication failed:", err);
			setError(err.message || "Failed to authenticate");
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ _jsxDEV("div", {
		ref: containerRef,
		style: {
			position: "relative",
			minHeight: "calc(100vh - 75px)",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			padding: "2rem 1.5rem",
			background: "linear-gradient(135deg, #FCFBFA 0%, #F5EFE8 100%)",
			overflow: "hidden"
		},
		children: [/* @__PURE__ */ _jsxDEV("canvas", {
			ref: canvasRef,
			style: {
				position: "absolute",
				top: 0,
				left: 0,
				width: "100%",
				height: "100%",
				zIndex: 1,
				pointerEvents: "none"
			}
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 222,
			columnNumber: 13
		}, this), /* @__PURE__ */ _jsxDEV("div", {
			style: {
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				width: "100%",
				maxWidth: "1100px",
				margin: "0 auto",
				gap: "2.5rem",
				zIndex: 2,
				position: "relative"
			},
			children: [/* @__PURE__ */ _jsxDEV("div", {
				className: "auth-background-artwork",
				style: {
					flex: "1 1 420px",
					maxWidth: "460px"
				},
				children: [
					/* @__PURE__ */ _jsxDEV("span", {
						style: {
							fontSize: "0.72rem",
							letterSpacing: "0.2em",
							textTransform: "uppercase",
							color: "#8F5E36",
							fontWeight: "700",
							display: "flex",
							alignItems: "center",
							gap: "0.4rem",
							marginBottom: "0.4rem"
						},
						children: [/* @__PURE__ */ _jsxDEV("svg", {
							width: "12",
							height: "12",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "#8F5E36",
							strokeWidth: "2.2",
							strokeLinecap: "round",
							strokeLinejoin: "round",
							children: /* @__PURE__ */ _jsxDEV("polygon", { points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 259,
								columnNumber: 29
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 258,
							columnNumber: 25
						}, this), "ROYAL JAIPUR CRAFTSMANSHIP"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 257,
						columnNumber: 21
					}, this),
					/* @__PURE__ */ _jsxDEV("h2", {
						style: {
							fontFamily: "var(--font-heading)",
							fontSize: "2.1rem",
							fontWeight: "400",
							color: "#2D2A26",
							marginBottom: "0.7rem",
							lineHeight: "1.25"
						},
						children: "Handcrafted Ethnic Elegance"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 264,
						columnNumber: 21
					}, this),
					/* @__PURE__ */ _jsxDEV("p", {
						style: {
							color: "#5C5853",
							fontSize: "0.88rem",
							lineHeight: "1.65",
							marginBottom: "1.4rem",
							fontWeight: "400"
						},
						children: "Every Kurthi in our wardrobe is slow-crafted from pure Jaipur cotton, natural mineral dyes, and hand-embroidered motifs by master weavers."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 268,
						columnNumber: 21
					}, this),
					/* @__PURE__ */ _jsxDEV("div", {
						style: {
							position: "relative",
							borderRadius: "20px",
							overflow: "hidden",
							height: "160px",
							marginBottom: "1.3rem",
							boxShadow: "0 12px 30px rgba(212, 163, 115, 0.18)",
							border: "1.5px solid rgba(212, 163, 115, 0.3)"
						},
						children: [/* @__PURE__ */ _jsxDEV("img", {
							src: "./images/login_art.png",
							alt: "Jaipur Handcrafted Block-Print Artwork",
							style: {
								width: "100%",
								height: "100%",
								objectFit: "cover"
							}
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 282,
							columnNumber: 25
						}, this), /* @__PURE__ */ _jsxDEV("div", { style: {
							position: "absolute",
							inset: 0,
							background: "linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(45,42,38,0.35) 100%)"
						} }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 287,
							columnNumber: 25
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 273,
						columnNumber: 21
					}, this),
					/* @__PURE__ */ _jsxDEV("div", {
						style: {
							display: "flex",
							gap: "0.55rem",
							flexWrap: "wrap"
						},
						children: [
							/* @__PURE__ */ _jsxDEV("span", {
								className: "auth-showcase-badge-1",
								style: {
									fontSize: "0.72rem",
									background: "rgba(255, 255, 255, 0.85)",
									backdropFilter: "blur(8px)",
									WebkitBackdropFilter: "blur(8px)",
									color: "#8F5E36",
									padding: "5px 12px",
									borderRadius: "50px",
									fontWeight: "600",
									border: "1px solid rgba(212, 163, 115, 0.35)",
									display: "inline-flex",
									alignItems: "center",
									gap: "0.4rem"
								},
								children: [/* @__PURE__ */ _jsxDEV("svg", {
									width: "13",
									height: "13",
									viewBox: "0 0 24 24",
									fill: "none",
									stroke: "currentColor",
									strokeWidth: "2",
									strokeLinecap: "round",
									strokeLinejoin: "round",
									children: /* @__PURE__ */ _jsxDEV("path", { d: "M12 2v20M17 5H7M19 19H5M9 9h6M8 14h8" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 294,
										columnNumber: 33
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 293,
									columnNumber: 29
								}, this), "100% Handcrafted"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 292,
								columnNumber: 25
							}, this),
							/* @__PURE__ */ _jsxDEV("span", {
								className: "auth-showcase-badge-2",
								style: {
									fontSize: "0.72rem",
									background: "rgba(255, 255, 255, 0.85)",
									backdropFilter: "blur(8px)",
									WebkitBackdropFilter: "blur(8px)",
									color: "#8F5E36",
									padding: "5px 12px",
									borderRadius: "50px",
									fontWeight: "600",
									border: "1px solid rgba(212, 163, 115, 0.35)",
									display: "inline-flex",
									alignItems: "center",
									gap: "0.4rem"
								},
								children: [/* @__PURE__ */ _jsxDEV("svg", {
									width: "13",
									height: "13",
									viewBox: "0 0 24 24",
									fill: "none",
									stroke: "currentColor",
									strokeWidth: "2",
									strokeLinecap: "round",
									strokeLinejoin: "round",
									children: [/* @__PURE__ */ _jsxDEV("circle", {
										cx: "12",
										cy: "12",
										r: "3"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 300,
										columnNumber: 33
									}, this), /* @__PURE__ */ _jsxDEV("path", { d: "M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 301,
										columnNumber: 33
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 299,
									columnNumber: 29
								}, this), "Pure Mineral Dyes"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 298,
								columnNumber: 25
							}, this),
							/* @__PURE__ */ _jsxDEV("span", {
								className: "auth-showcase-badge-3",
								style: {
									fontSize: "0.72rem",
									background: "rgba(255, 255, 255, 0.85)",
									backdropFilter: "blur(8px)",
									WebkitBackdropFilter: "blur(8px)",
									color: "#8F5E36",
									padding: "5px 12px",
									borderRadius: "50px",
									fontWeight: "600",
									border: "1px solid rgba(212, 163, 115, 0.35)",
									display: "inline-flex",
									alignItems: "center",
									gap: "0.4rem"
								},
								children: [/* @__PURE__ */ _jsxDEV("svg", {
									width: "13",
									height: "13",
									viewBox: "0 0 24 24",
									fill: "none",
									stroke: "currentColor",
									strokeWidth: "2",
									strokeLinecap: "round",
									strokeLinejoin: "round",
									children: /* @__PURE__ */ _jsxDEV("path", { d: "M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 307,
										columnNumber: 33
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 306,
									columnNumber: 29
								}, this), "Bespoke Cuts"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 305,
								columnNumber: 25
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 291,
						columnNumber: 21
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 250,
				columnNumber: 17
			}, this), /* @__PURE__ */ _jsxDEV("div", {
				className: "auth-card-wrapper",
				style: {
					position: "relative",
					zIndex: 3,
					maxWidth: "380px",
					width: "100%",
					flexShrink: 0
				},
				children: /* @__PURE__ */ _jsxDEV("div", {
					style: {
						background: "rgba(255, 255, 255, 0.72)",
						backdropFilter: "blur(22px)",
						WebkitBackdropFilter: "blur(22px)",
						padding: "2.2rem 2rem",
						borderRadius: "24px",
						boxShadow: "0 16px 45px rgba(212, 163, 115, 0.14)",
						border: "1.5px solid rgba(212, 163, 115, 0.35)"
					},
					children: [
						/* @__PURE__ */ _jsxDEV("div", {
							style: {
								textAlign: "center",
								marginBottom: "1.25rem"
							},
							children: [/* @__PURE__ */ _jsxDEV("h1", {
								style: {
									fontFamily: "var(--font-heading)",
									fontSize: "1.65rem",
									color: "#2D2A26",
									marginBottom: "0.3rem",
									fontWeight: "400"
								},
								children: isSignUp ? "Create Account" : "Welcome Back"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 336,
								columnNumber: 29
							}, this), /* @__PURE__ */ _jsxDEV("p", {
								style: {
									color: "#6C6863",
									fontSize: "0.8rem",
									lineHeight: "1.4",
									margin: "0 auto",
									maxWidth: "300px"
								},
								children: isSignUp ? "Join The Ethnic Touch to enjoy personalized royal rewards." : "Sign in to access your handcrafted Jaipur collection, wishlist, & orders."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 340,
								columnNumber: 29
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 335,
							columnNumber: 25
						}, this),
						redirectPath.includes("checkout") && /* @__PURE__ */ _jsxDEV("div", {
							style: {
								background: "#FAF7F2",
								border: "1px solid rgba(212, 163, 115, 0.4)",
								color: "#8F5E36",
								padding: "0.65rem 0.85rem",
								borderRadius: "12px",
								marginBottom: "1rem",
								fontSize: "0.78rem",
								display: "flex",
								alignItems: "center",
								gap: "0.55rem",
								fontWeight: "500",
								lineHeight: "1.35"
							},
							children: [/* @__PURE__ */ _jsxDEV("svg", {
								width: "18",
								height: "18",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "#8F5E36",
								strokeWidth: "2",
								strokeLinecap: "round",
								strokeLinejoin: "round",
								style: { flexShrink: 0 },
								children: [/* @__PURE__ */ _jsxDEV("rect", {
									x: "3",
									y: "11",
									width: "18",
									height: "11",
									rx: "2",
									ry: "2"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 361,
									columnNumber: 37
								}, this), /* @__PURE__ */ _jsxDEV("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 362,
									columnNumber: 37
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 360,
								columnNumber: 33
							}, this), /* @__PURE__ */ _jsxDEV("span", { children: [
								"Please ",
								/* @__PURE__ */ _jsxDEV("strong", { children: "Sign In" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 364,
									columnNumber: 46
								}, this),
								" or ",
								/* @__PURE__ */ _jsxDEV("strong", { children: "Register" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 364,
									columnNumber: 74
								}, this),
								" to place your order. You will return to checkout automatically!"
							] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 364,
								columnNumber: 33
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 346,
							columnNumber: 29
						}, this),
						error && /* @__PURE__ */ _jsxDEV("div", {
							style: {
								background: "#FDF1F0",
								color: "var(--color-error)",
								padding: "0.55rem",
								borderRadius: "10px",
								marginBottom: "1rem",
								fontSize: "0.78rem",
								textAlign: "center",
								border: "1px solid rgba(217, 83, 79, 0.2)"
							},
							children: error
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 369,
							columnNumber: 29
						}, this),
						/* @__PURE__ */ _jsxDEV("div", {
							style: {
								display: "flex",
								gap: "0.4rem",
								marginBottom: "1.1rem",
								background: "#FAF9F8",
								padding: "4px",
								borderRadius: "50px",
								border: "1px solid rgba(212, 163, 115, 0.25)"
							},
							children: [/* @__PURE__ */ _jsxDEV("button", {
								onClick: () => {
									setIsSignUp(false);
									setError("");
								},
								style: {
									flex: 1,
									padding: "0.42rem",
									background: !isSignUp ? "linear-gradient(135deg, #D4A373 0%, #C49363 100%)" : "transparent",
									color: !isSignUp ? "#fff" : "#6C6863",
									border: "none",
									borderRadius: "50px",
									cursor: "pointer",
									transition: "all 0.3s ease",
									fontWeight: "600",
									fontSize: "0.82rem",
									boxShadow: !isSignUp ? "0 4px 12px rgba(212, 163, 115, 0.25)" : "none"
								},
								children: "Sign In"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 376,
								columnNumber: 29
							}, this), /* @__PURE__ */ _jsxDEV("button", {
								onClick: () => {
									setIsSignUp(true);
									setError("");
								},
								style: {
									flex: 1,
									padding: "0.42rem",
									background: isSignUp ? "linear-gradient(135deg, #D4A373 0%, #C49363 100%)" : "transparent",
									color: isSignUp ? "#fff" : "#6C6863",
									border: "none",
									borderRadius: "50px",
									cursor: "pointer",
									transition: "all 0.3s ease",
									fontWeight: "600",
									fontSize: "0.82rem",
									boxShadow: isSignUp ? "0 4px 12px rgba(212, 163, 115, 0.25)" : "none"
								},
								children: "Register"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 394,
								columnNumber: 29
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 375,
							columnNumber: 25
						}, this),
						/* @__PURE__ */ _jsxDEV("form", {
							onSubmit: handleSubmit,
							style: {
								display: "flex",
								flexDirection: "column",
								gap: "0.85rem"
							},
							children: [
								isSignUp && /* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("label", {
									style: {
										display: "block",
										marginBottom: "0.25rem",
										fontWeight: "500",
										fontSize: "0.78rem",
										color: "#444"
									},
									children: "Full Name"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 417,
									columnNumber: 37
								}, this), /* @__PURE__ */ _jsxDEV("input", {
									type: "text",
									required: true,
									className: "auth-input",
									value: fullName,
									onChange: (e) => setFullName(e.target.value),
									placeholder: "Enter your full name",
									style: {
										height: "38px",
										fontSize: "0.82rem"
									}
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 418,
									columnNumber: 37
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 416,
									columnNumber: 33
								}, this),
								/* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("label", {
									style: {
										display: "block",
										marginBottom: "0.25rem",
										fontWeight: "500",
										fontSize: "0.78rem",
										color: "#444"
									},
									children: "Email Address"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 430,
									columnNumber: 33
								}, this), /* @__PURE__ */ _jsxDEV("input", {
									type: "email",
									required: true,
									className: "auth-input",
									value: email,
									onChange: (e) => setEmail(e.target.value),
									placeholder: "you@example.com",
									style: {
										height: "38px",
										fontSize: "0.82rem"
									}
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 431,
									columnNumber: 33
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 429,
									columnNumber: 29
								}, this),
								/* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("div", {
									style: {
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
										marginBottom: "0.25rem"
									},
									children: [/* @__PURE__ */ _jsxDEV("label", {
										style: {
											fontWeight: "500",
											fontSize: "0.78rem",
											color: "#444"
										},
										children: "Password"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 443,
										columnNumber: 37
									}, this), !isSignUp && /* @__PURE__ */ _jsxDEV("a", {
										href: "#",
										style: {
											fontSize: "0.75rem",
											color: "#8F5E36",
											textDecoration: "none",
											fontWeight: "500"
										},
										children: "Forgot password?"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 444,
										columnNumber: 51
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 442,
									columnNumber: 33
								}, this), /* @__PURE__ */ _jsxDEV("input", {
									type: "password",
									required: true,
									className: "auth-input",
									value: password,
									onChange: (e) => setPassword(e.target.value),
									placeholder: isSignUp ? "Create password (min. 6 chars)" : "Enter your password",
									style: {
										height: "38px",
										fontSize: "0.82rem"
									}
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 446,
									columnNumber: 33
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 441,
									columnNumber: 29
								}, this),
								/* @__PURE__ */ _jsxDEV("button", {
									type: "submit",
									disabled: loading,
									className: "btn btn-primary",
									style: {
										width: "100%",
										padding: "0",
										marginTop: "0.35rem",
										fontSize: "0.85rem",
										height: "38px",
										borderRadius: "50px",
										opacity: loading ? .7 : 1,
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										background: "linear-gradient(135deg, #D4A373 0%, #C49363 100%)",
										border: "none",
										color: "#FFF",
										fontWeight: "600",
										boxShadow: "0 4px 15px rgba(212, 163, 115, 0.25)"
									},
									children: loading ? "Processing..." : isSignUp ? "Create Account" : "Sign In"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 457,
									columnNumber: 29
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 414,
							columnNumber: 25
						}, this),
						/* @__PURE__ */ _jsxDEV("div", {
							style: {
								display: "flex",
								alignItems: "center",
								margin: "1rem 0",
								gap: "0.6rem"
							},
							children: [
								/* @__PURE__ */ _jsxDEV("div", { style: {
									flex: 1,
									height: "1px",
									background: "#EAE6E1"
								} }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 484,
									columnNumber: 29
								}, this),
								/* @__PURE__ */ _jsxDEV("span", {
									style: {
										fontSize: "0.7rem",
										color: "#888",
										textTransform: "uppercase",
										letterSpacing: "0.5px"
									},
									children: "Or continue with"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 485,
									columnNumber: 29
								}, this),
								/* @__PURE__ */ _jsxDEV("div", { style: {
									flex: 1,
									height: "1px",
									background: "#EAE6E1"
								} }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 486,
									columnNumber: 29
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 483,
							columnNumber: 25
						}, this),
						/* @__PURE__ */ _jsxDEV("button", {
							onClick: handleGoogleSignIn,
							disabled: loading,
							type: "button",
							style: {
								width: "100%",
								height: "38px",
								padding: "0",
								background: "#fff",
								border: "1px solid rgba(212, 163, 115, 0.35)",
								borderRadius: "50px",
								cursor: "pointer",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								gap: "0.5rem",
								transition: "all 0.3s ease",
								fontWeight: "500",
								fontSize: "0.82rem",
								color: "#333"
							},
							children: [/* @__PURE__ */ _jsxDEV("svg", {
								viewBox: "0 0 24 24",
								width: "18",
								height: "18",
								children: [
									/* @__PURE__ */ _jsxDEV("path", {
										d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z",
										fill: "#4285F4"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 512,
										columnNumber: 33
									}, this),
									/* @__PURE__ */ _jsxDEV("path", {
										d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z",
										fill: "#34A853"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 513,
										columnNumber: 33
									}, this),
									/* @__PURE__ */ _jsxDEV("path", {
										d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z",
										fill: "#FBBC05"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 514,
										columnNumber: 33
									}, this),
									/* @__PURE__ */ _jsxDEV("path", {
										d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z",
										fill: "#EA4335"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 515,
										columnNumber: 33
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 511,
								columnNumber: 29
							}, this), "Google"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 489,
							columnNumber: 25
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 325,
					columnNumber: 21
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 315,
				columnNumber: 17
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 236,
			columnNumber: 13
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 208,
		columnNumber: 9
	}, this);
};
_s(Auth, REDACTED_KEY, false, function() {
	return [useNavigate, useLocation];
});
_c = Auth;
export default Auth;
var _c;
$RefreshReg$(_c, "Auth");
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;
import * as __vite_react_currentExports from "/src/pages/Auth.jsx";
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }

  const currentExports = __vite_react_currentExports;
  queueMicrotask(() => {
    RefreshRuntime.registerExportsForReactRefresh("D:/The Ethnic Touch/frontend/src/pages/Auth.jsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("D:/The Ethnic Touch/frontend/src/pages/Auth.jsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
function $RefreshReg$(type, id) { return RefreshRuntime.register(type, "D:/The Ethnic Touch/frontend/src/pages/Auth.jsx" + ' ' + id); }
function $RefreshSig$() { return RefreshRuntime.createSignatureFunctionForTransform(); }

//# sourceMappingURL=data:application/json;base64,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O1FBQ1IsU0FBUztRQUNULFlBQVk7UUFDWixRQUFRO1FBQ1IsY0FBYztRQUNkLFFBQVE7UUFDUixTQUFTO1FBQ1QsWUFBWTtRQUNaLGdCQUFnQjtRQUNoQixLQUFLO1FBQ0wsWUFBWTtRQUNaLFlBQVk7UUFDWixVQUFVO1FBQ1YsT0FBTztPQUNYO2lCQXBCSixDQXNCSSx3QkFBQyxPQUFEO1FBQUssU0FBUTtRQUFZLE9BQU07UUFBSyxRQUFPO2tCQUEzQztTQUNJLHdCQUFDLFFBQUQ7VUFBTSxHQUFFO1VBQTBILE1BQUs7U0FBVTs7Ozs7U0FDakosd0JBQUMsUUFBRDtVQUFNLEdBQUU7VUFBd0ksTUFBSztTQUFVOzs7OztTQUMvSix3QkFBQyxRQUFEO1VBQU0sR0FBRTtVQUFnSSxNQUFLO1NBQVU7Ozs7O1NBQ3ZKLHdCQUFDLFFBQUQ7VUFBTSxHQUFFO1VBQXNJLE1BQUs7U0FBVTs7Ozs7UUFDNUo7Ozs7O2lCQUFDLFFBRUY7Ozs7OztLQUNQOzs7Ozs7R0FDSjs7OztXQUNKOzs7OztVQUVKOzs7Ozs7QUFFYjs7Ozs7QUFFQSxlQUFlIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIkF1dGguanN4Il0sInZlcnNpb24iOjMsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0LCB1c2VSZWYgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VOYXZpZ2F0ZSwgdXNlTG9jYXRpb24gfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJztcbmltcG9ydCB7IGF1dGggfSBmcm9tICcuLi9kYXRhL2NvbmZpZyc7XG5pbXBvcnQgeyBHb29nbGVBdXRoUHJvdmlkZXIsIHNpZ25JbldpdGhQb3B1cCwgY3JlYXRlVXNlcldpdGhFbWFpbEFuZFBhc3N3b3JkLCBzaWduSW5XaXRoRW1haWxBbmRQYXNzd29yZCwgdXBkYXRlUHJvZmlsZSB9IGZyb20gJ2ZpcmViYXNlL2F1dGgnO1xuXG5jb25zdCBBdXRoID0gKCkgPT4ge1xuICAgIGNvbnN0IFtpc1NpZ25VcCwgc2V0SXNTaWduVXBdID0gdXNlU3RhdGUoZmFsc2UpO1xuICAgIGNvbnN0IFtmdWxsTmFtZSwgc2V0RnVsbE5hbWVdID0gdXNlU3RhdGUoJycpO1xuICAgIGNvbnN0IFtlbWFpbCwgc2V0RW1haWxdID0gdXNlU3RhdGUoJycpO1xuICAgIGNvbnN0IFtwYXNzd29yZCwgc2V0UGFzc3dvcmRdID0gdXNlU3RhdGUoJycpO1xuICAgIGNvbnN0IFtlcnJvciwgc2V0RXJyb3JdID0gdXNlU3RhdGUoJycpO1xuICAgIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgICBcbiAgICBjb25zdCBjYW52YXNSZWYgPSB1c2VSZWYobnVsbCk7XG4gICAgY29uc3QgY29udGFpbmVyUmVmID0gdXNlUmVmKG51bGwpO1xuICAgIGNvbnN0IG5hdmlnYXRlID0gdXNlTmF2aWdhdGUoKTtcbiAgICBjb25zdCBsb2NhdGlvbiA9IHVzZUxvY2F0aW9uKCk7XG5cbiAgICBjb25zdCBzZWFyY2hQYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKGxvY2F0aW9uLnNlYXJjaCk7XG4gICAgY29uc3QgcmVkaXJlY3RQYXRoID0gc2VhcmNoUGFyYW1zLmdldCgncmVkaXJlY3QnKSB8fCBsb2NhdGlvbi5zdGF0ZT8uZnJvbSB8fCAnLyc7XG5cbiAgICAvLyBJbnRlcmFjdGl2ZSBIYW5kY3JhZnRlZCBTaWxrIFRleHRpbGUgJiBHZW1pbmktc3R5bGUgU2hpbW1lciBXYXZlcyBDYW52YXMgQW5pbWF0aW9uXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgY29uc3QgY2FudmFzID0gY2FudmFzUmVmLmN1cnJlbnQ7XG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGNvbnRhaW5lclJlZi5jdXJyZW50O1xuICAgICAgICBpZiAoIWNhbnZhcyB8fCAhY29udGFpbmVyKSByZXR1cm47XG4gICAgICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICBsZXQgYW5pbWF0aW9uRnJhbWVJZDtcblxuICAgICAgICBsZXQgd2lkdGggPSAoY2FudmFzLndpZHRoID0gY29udGFpbmVyLm9mZnNldFdpZHRoKTtcbiAgICAgICAgbGV0IGhlaWdodCA9IChjYW52YXMuaGVpZ2h0ID0gY29udGFpbmVyLm9mZnNldEhlaWdodCk7XG5cbiAgICAgICAgY29uc3QgaGFuZGxlUmVzaXplID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKCFjYW52YXMgfHwgIWNvbnRhaW5lcikgcmV0dXJuO1xuICAgICAgICAgICAgd2lkdGggPSBjYW52YXMud2lkdGggPSBjb250YWluZXIub2Zmc2V0V2lkdGg7XG4gICAgICAgICAgICBoZWlnaHQgPSBjYW52YXMuaGVpZ2h0ID0gY29udGFpbmVyLm9mZnNldEhlaWdodDtcbiAgICAgICAgfTtcblxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgaGFuZGxlUmVzaXplKTtcblxuICAgICAgICAvLyBJbnRlcmFjdGl2ZSBNb3VzZSBQb3NpdGlvbiBmb3IgTGlxdWlkIEZhYnJpYyBSaXBwbGVzXG4gICAgICAgIGxldCBtb3VzZSA9IHsgeDogd2lkdGggKiAwLjQsIHk6IGhlaWdodCAqIDAuNSwgdGFyZ2V0WDogd2lkdGggKiAwLjQsIHRhcmdldFk6IGhlaWdodCAqIDAuNSB9O1xuXG4gICAgICAgIGNvbnN0IGhhbmRsZU1vdXNlTW92ZSA9IChlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCByZWN0ID0gY29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgbW91c2UudGFyZ2V0WCA9IGUuY2xpZW50WCAtIHJlY3QubGVmdDtcbiAgICAgICAgICAgIG1vdXNlLnRhcmdldFkgPSBlLmNsaWVudFkgLSByZWN0LnRvcDtcbiAgICAgICAgfTtcblxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgaGFuZGxlTW91c2VNb3ZlKTtcblxuICAgICAgICAvLyBIYW5kY3JhZnRlZCBGbG9hdGluZyBHb2xkICYgVGVycmFjb3R0YSBZYXJuIFRocmVhZCBGaWJlcnNcbiAgICAgICAgY29uc3QgdGhyZWFkcyA9IEFycmF5LmZyb20oeyBsZW5ndGg6IDMyIH0sICgpID0+ICh7XG4gICAgICAgICAgICB4OiBNYXRoLnJhbmRvbSgpICogd2lkdGgsXG4gICAgICAgICAgICB5OiBNYXRoLnJhbmRvbSgpICogaGVpZ2h0LFxuICAgICAgICAgICAgbGVuZ3RoOiAyNSArIE1hdGgucmFuZG9tKCkgKiA0NSxcbiAgICAgICAgICAgIHNwZWVkOiAwLjI1ICsgTWF0aC5yYW5kb20oKSAqIDAuNDUsXG4gICAgICAgICAgICBhbXBsaXR1ZGU6IDIgKyBNYXRoLnJhbmRvbSgpICogMy41LFxuICAgICAgICAgICAgc2l6ZTogMC44ICsgTWF0aC5yYW5kb20oKSAqIDEuNCxcbiAgICAgICAgICAgIGNvbG9yOiBbXG4gICAgICAgICAgICAgICAgJ3JnYmEoMjEyLCAxNjMsIDExNSwgMC42NSknLCBcbiAgICAgICAgICAgICAgICAncmdiYSgxNDMsIDk0LCA1NCwgMC41KScsIFxuICAgICAgICAgICAgICAgICdyZ2JhKDI0NCwgMjExLCAxNDYsIDAuNzUpJywgXG4gICAgICAgICAgICAgICAgJ3JnYmEoMjU1LCAyMjksIDIxNywgMC44NSknXG4gICAgICAgICAgICBdW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDQpXVxuICAgICAgICB9KSk7XG5cbiAgICAgICAgbGV0IHN0ZXAgPSAwO1xuXG4gICAgICAgIGNvbnN0IHJlbmRlciA9ICgpID0+IHtcbiAgICAgICAgICAgIHN0ZXAgKz0gMC4wMTI7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIFNtb290aCBtb3VzZSBpbnRlcnBvbGF0aW9uXG4gICAgICAgICAgICBtb3VzZS54ICs9IChtb3VzZS50YXJnZXRYIC0gbW91c2UueCkgKiAwLjA1O1xuICAgICAgICAgICAgbW91c2UueSArPSAobW91c2UudGFyZ2V0WSAtIG1vdXNlLnkpICogMC4wNTtcblxuICAgICAgICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcblxuICAgICAgICAgICAgLy8gMS4gRHJhdyBMaXF1aWQgRmFicmljIFNpbGsgR3JhZGllbnQgV2F2ZXMgKEdlbWluaSBTaGltbWVyIEVmZmVjdClcbiAgICAgICAgICAgIGNvbnN0IHdhdmVDb3VudCA9IDU7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHdhdmVDb3VudDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGdyYWQgPSBjdHguY3JlYXRlTGluZWFyR3JhZGllbnQoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG4gICAgICAgICAgICAgICAgaWYgKGkgJSAzID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGdyYWQuYWRkQ29sb3JTdG9wKDAsICdyZ2JhKDIxMiwgMTYzLCAxMTUsIDAuMjIpJyk7XG4gICAgICAgICAgICAgICAgICAgIGdyYWQuYWRkQ29sb3JTdG9wKDAuNSwgJ3JnYmEoMjU1LCAyMjksIDIxNywgMC4zOCknKTtcbiAgICAgICAgICAgICAgICAgICAgZ3JhZC5hZGRDb2xvclN0b3AoMSwgJ3JnYmEoMTQzLCA5NCwgNTQsIDAuMTgpJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpICUgMyA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBncmFkLmFkZENvbG9yU3RvcCgwLCAncmdiYSgyNDQsIDIxMSwgMTQ2LCAwLjI1KScpO1xuICAgICAgICAgICAgICAgICAgICBncmFkLmFkZENvbG9yU3RvcCgwLjUsICdyZ2JhKDIxMiwgMTYzLCAxMTUsIDAuMzIpJyk7XG4gICAgICAgICAgICAgICAgICAgIGdyYWQuYWRkQ29sb3JTdG9wKDEsICdyZ2JhKDI1NSwgMjQ4LCAyNDAsIDAuMjIpJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZ3JhZC5hZGRDb2xvclN0b3AoMCwgJ3JnYmEoMTQzLCA5NCwgNTQsIDAuMTUpJyk7XG4gICAgICAgICAgICAgICAgICAgIGdyYWQuYWRkQ29sb3JTdG9wKDAuNSwgJ3JnYmEoMjEyLCAxNjMsIDExNSwgMC4yOCknKTtcbiAgICAgICAgICAgICAgICAgICAgZ3JhZC5hZGRDb2xvclN0b3AoMSwgJ3JnYmEoMjU1LCAyMjksIDIxNywgMC4yNSknKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gZ3JhZDtcblxuICAgICAgICAgICAgICAgIGN0eC5tb3ZlVG8oMCwgaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8PSB3aWR0aCArIDIwOyB4ICs9IDE1KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIENhbGN1bGF0ZSBpbnRlcmFjdGl2ZSBjdXJzb3IgZGVmbGVjdGlvblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkeCA9IHggLSBtb3VzZS54O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBkaXN0ID0gTWF0aC5hYnMoZHgpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBtb3VzZURlZmxlY3QgPSBNYXRoLm1heCgwLCAxIC0gZGlzdCAvIDMyMCkgKiA0MDtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCB5ID0gTWF0aC5zaW4oeCAqIDAuMDAyOCArIHN0ZXAgKyBpICogMC43NSkgKiAoMzUgKyBpICogMTIpICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1hdGguY29zKHggKiAwLjAwNTUgLSBzdGVwICogMC40KSAqIDE4ICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChoZWlnaHQgKiAwLjQ4KSArIChpICogMzggLSA4MCkgLVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKE1hdGguc2luKCh4ICsgbW91c2UueCkgKiAwLjAwMTgpICogbW91c2VEZWZsZWN0KTtcblxuICAgICAgICAgICAgICAgICAgICBjdHgubGluZVRvKHgsIHkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjdHgubGluZVRvKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICAgICAgICAgIGN0eC5saW5lVG8oMCwgaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgICAgICAgICAgICAgY3R4LmZpbGwoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gMi4gRHJhdyBGbG9hdGluZyBIYW5kY3JhZnRlZCBUZXh0aWxlIEZpYmVycyAmIFlhcm4gVGhyZWFkc1xuICAgICAgICAgICAgdGhyZWFkcy5mb3JFYWNoKHQgPT4ge1xuICAgICAgICAgICAgICAgIHQueSAtPSB0LnNwZWVkO1xuICAgICAgICAgICAgICAgIHQueCArPSBNYXRoLnNpbihzdGVwICsgdC55ICogMC4wMSkgKiAwLjQ7XG5cbiAgICAgICAgICAgICAgICBpZiAodC55IDwgLTYwKSB7XG4gICAgICAgICAgICAgICAgICAgIHQueSA9IGhlaWdodCArIDYwO1xuICAgICAgICAgICAgICAgICAgICB0LnggPSBNYXRoLnJhbmRvbSgpICogd2lkdGg7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY3R4LnNhdmUoKTtcbiAgICAgICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gdC5jb2xvcjtcbiAgICAgICAgICAgICAgICBjdHgubGluZVdpZHRoID0gdC5zaXplO1xuICAgICAgICAgICAgICAgIGN0eC5saW5lQ2FwID0gJ3JvdW5kJztcblxuICAgICAgICAgICAgICAgIC8vIEN1cnZlZCB0aHJlYWQgd2F2ZSBsaW5lXG4gICAgICAgICAgICAgICAgY3R4Lm1vdmVUbyh0LngsIHQueSk7XG4gICAgICAgICAgICAgICAgY29uc3QgY3BYID0gdC54ICsgTWF0aC5zaW4oc3RlcCAqIDIgKyB0LnkgKiAwLjAyKSAqIHQuYW1wbGl0dWRlO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNwWSA9IHQueSAtIHQubGVuZ3RoICogMC41O1xuICAgICAgICAgICAgICAgIGNvbnN0IGVuZFggPSB0LnggKyBNYXRoLmNvcyhzdGVwICsgdC55ICogMC4wMSkgKiAodC5hbXBsaXR1ZGUgKiAwLjgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGVuZFkgPSB0LnkgLSB0Lmxlbmd0aDtcblxuICAgICAgICAgICAgICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKGNwWCwgY3BZLCBlbmRYLCBlbmRZKTtcbiAgICAgICAgICAgICAgICBjdHguc3Ryb2tlKCk7XG5cbiAgICAgICAgICAgICAgICAvLyBTbWFsbCB0aHJlYWQga25vdCBkb3RcbiAgICAgICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICAgICAgY3R4LmFyYyh0LngsIHQueSwgdC5zaXplICogMC44LCAwLCBNYXRoLlBJICogMik7XG4gICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IHQuY29sb3I7XG4gICAgICAgICAgICAgICAgY3R4LmZpbGwoKTtcblxuICAgICAgICAgICAgICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgYW5pbWF0aW9uRnJhbWVJZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShyZW5kZXIpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJlbmRlcigpO1xuXG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgaGFuZGxlUmVzaXplKTtcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBoYW5kbGVNb3VzZU1vdmUpO1xuICAgICAgICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUoYW5pbWF0aW9uRnJhbWVJZCk7XG4gICAgICAgIH07XG4gICAgfSwgW10pO1xuXG4gICAgY29uc3QgaGFuZGxlR29vZ2xlU2lnbkluID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICBzZXRFcnJvcignJyk7XG4gICAgICAgIHNldExvYWRpbmcodHJ1ZSk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBwcm92aWRlciA9IG5ldyBHb29nbGVBdXRoUHJvdmlkZXIoKTtcbiAgICAgICAgICAgIGF3YWl0IHNpZ25JbldpdGhQb3B1cChhdXRoLCBwcm92aWRlcik7XG4gICAgICAgICAgICBuYXZpZ2F0ZShyZWRpcmVjdFBhdGgpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1tBVVRIIEVSUk9SXSBHb29nbGUgU2lnbi1JbiBmYWlsZWQ6JywgZXJyKTtcbiAgICAgICAgICAgIHNldEVycm9yKGVyci5tZXNzYWdlIHx8ICdGYWlsZWQgdG8gc2lnbiBpbiB3aXRoIEdvb2dsZScpO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3QgaGFuZGxlU3VibWl0ID0gYXN5bmMgKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBzZXRFcnJvcignJyk7XG4gICAgICAgIHNldExvYWRpbmcodHJ1ZSk7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmIChpc1NpZ25VcCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHVzZXJDcmVkZW50aWFsID0gYXdhaXQgY3JlYXRlVXNlcldpdGhFbWFpbEFuZFBhc3N3b3JkKGF1dGgsIGVtYWlsLCBwYXNzd29yZCk7XG4gICAgICAgICAgICAgICAgaWYgKHVzZXJDcmVkZW50aWFsLnVzZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdXBkYXRlUHJvZmlsZSh1c2VyQ3JlZGVudGlhbC51c2VyLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5TmFtZTogZnVsbE5hbWVcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhd2FpdCBzaWduSW5XaXRoRW1haWxBbmRQYXNzd29yZChhdXRoLCBlbWFpbCwgcGFzc3dvcmQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbmF2aWdhdGUocmVkaXJlY3RQYXRoKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdbQVVUSCBFUlJPUl0gRW1haWwgQXV0aGVudGljYXRpb24gZmFpbGVkOicsIGVycik7XG4gICAgICAgICAgICBzZXRFcnJvcihlcnIubWVzc2FnZSB8fCAnRmFpbGVkIHRvIGF1dGhlbnRpY2F0ZScpO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBcbiAgICAgICAgICAgIHJlZj17Y29udGFpbmVyUmVmfVxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICAgICAgICBtaW5IZWlnaHQ6ICdjYWxjKDEwMHZoIC0gNzVweCknLFxuICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgcGFkZGluZzogJzJyZW0gMS41cmVtJyxcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiAnbGluZWFyLWdyYWRpZW50KDEzNWRlZywgI0ZDRkJGQSAwJSwgI0Y1RUZFOCAxMDAlKScsXG4gICAgICAgICAgICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nXG4gICAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgICB7LyogSW50ZXJhY3RpdmUgSGFuZGNyYWZ0ZWQgU2lsayBUZXh0aWxlICYgR2VtaW5pIFNoaW1tZXIgQ2FudmFzIEFuaW1hdGlvbiAqL31cbiAgICAgICAgICAgIDxjYW52YXMgXG4gICAgICAgICAgICAgICAgcmVmPXtjYW52YXNSZWZ9XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgIHpJbmRleDogMSxcbiAgICAgICAgICAgICAgICAgICAgcG9pbnRlckV2ZW50czogJ25vbmUnXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIC8+XG5cbiAgICAgICAgICAgIHsvKiBSZXNwb25zaXZlIEZsZXhib3ggQ29udGFpbmVyOiBCcmFuZCBIZXJvIFRleHQgKyBSaWdodC1BbGlnbmVkIExvZ2luIENhcmQgKi99XG4gICAgICAgICAgICA8ZGl2IFxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICAgICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgICAgICAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgIG1heFdpZHRoOiAnMTEwMHB4JyxcbiAgICAgICAgICAgICAgICAgICAgbWFyZ2luOiAnMCBhdXRvJyxcbiAgICAgICAgICAgICAgICAgICAgZ2FwOiAnMi41cmVtJyxcbiAgICAgICAgICAgICAgICAgICAgekluZGV4OiAyLFxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJ1xuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgey8qIEFtYmllbnQgSmFpcHVyIENyYWZ0c21hbnNoaXAgU3RvcnkgU2hvd2Nhc2UgKFNlYW1sZXNzIFR5cG9ncmFwaHkgRmxvdykgKi99XG4gICAgICAgICAgICAgICAgPGRpdiBcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYXV0aC1iYWNrZ3JvdW5kLWFydHdvcmtcIiBcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsZXg6ICcxIDEgNDIwcHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWF4V2lkdGg6ICc0NjBweCdcbiAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRTaXplOiAnMC43MnJlbScsIGxldHRlclNwYWNpbmc6ICcwLjJlbScsIHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnLCBjb2xvcjogJyM4RjVFMzYnLCBmb250V2VpZ2h0OiAnNzAwJywgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgZ2FwOiAnMC40cmVtJywgbWFyZ2luQm90dG9tOiAnMC40cmVtJyB9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCIxMlwiIGhlaWdodD1cIjEyXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiIzhGNUUzNlwiIHN0cm9rZVdpZHRoPVwiMi4yXCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIHBvaW50cz1cIjEyIDIgMTUuMDkgOC4yNiAyMiA5LjI3IDE3IDE0LjE0IDE4LjE4IDIxLjAyIDEyIDE3Ljc3IDUuODIgMjEuMDIgNyAxNC4xNCAyIDkuMjcgOC45MSA4LjI2IDEyIDJcIj48L3BvbHlnb24+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgICAgICAgICAgICAgIFJPWUFMIEpBSVBVUiBDUkFGVFNNQU5TSElQXG4gICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIDxoMiBzdHlsZT17eyBmb250RmFtaWx5OiAndmFyKC0tZm9udC1oZWFkaW5nKScsIGZvbnRTaXplOiAnMi4xcmVtJywgZm9udFdlaWdodDogJzQwMCcsIGNvbG9yOiAnIzJEMkEyNicsIG1hcmdpbkJvdHRvbTogJzAuN3JlbScsIGxpbmVIZWlnaHQ6ICcxLjI1JyB9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgIEhhbmRjcmFmdGVkIEV0aG5pYyBFbGVnYW5jZVxuICAgICAgICAgICAgICAgICAgICA8L2gyPlxuXG4gICAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPXt7IGNvbG9yOiAnIzVDNTg1MycsIGZvbnRTaXplOiAnMC44OHJlbScsIGxpbmVIZWlnaHQ6ICcxLjY1JywgbWFyZ2luQm90dG9tOiAnMS40cmVtJywgZm9udFdlaWdodDogJzQwMCcgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICBFdmVyeSBLdXJ0aGkgaW4gb3VyIHdhcmRyb2JlIGlzIHNsb3ctY3JhZnRlZCBmcm9tIHB1cmUgSmFpcHVyIGNvdHRvbiwgbmF0dXJhbCBtaW5lcmFsIGR5ZXMsIGFuZCBoYW5kLWVtYnJvaWRlcmVkIG1vdGlmcyBieSBtYXN0ZXIgd2VhdmVycy5cbiAgICAgICAgICAgICAgICAgICAgPC9wPlxuXG4gICAgICAgICAgICAgICAgICAgIHsvKiBGbG9hdGluZyBKYWlwdXIgQXJ0aXNhbmFsIEJhbm5lciAqL31cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICcyMHB4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG92ZXJmbG93OiAnaGlkZGVuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogJzE2MHB4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbkJvdHRvbTogJzEuM3JlbScsXG4gICAgICAgICAgICAgICAgICAgICAgICBib3hTaGFkb3c6ICcwIDEycHggMzBweCByZ2JhKDIxMiwgMTYzLCAxMTUsIDAuMTgpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlcjogJzEuNXB4IHNvbGlkIHJnYmEoMjEyLCAxNjMsIDExNSwgMC4zKSdcbiAgICAgICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aW1nIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyYz1cIi4vaW1hZ2VzL2xvZ2luX2FydC5wbmdcIiBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbHQ9XCJKYWlwdXIgSGFuZGNyYWZ0ZWQgQmxvY2stUHJpbnQgQXJ0d29ya1wiIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnLCBvYmplY3RGaXQ6ICdjb3ZlcicgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHBvc2l0aW9uOiAnYWJzb2x1dGUnLCBpbnNldDogMCwgYmFja2dyb3VuZDogJ2xpbmVhci1ncmFkaWVudCgxODBkZWcsIHJnYmEoMCwwLDAsMCkgMzAlLCByZ2JhKDQ1LDQyLDM4LDAuMzUpIDEwMCUpJyB9fSAvPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICB7LyogRmxvYXRpbmcgQmFkZ2VzIFJvdyB3aXRoIFByZW1pdW0gVmVjdG9yIEljb25zICovfVxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgZ2FwOiAnMC41NXJlbScsIGZsZXhXcmFwOiAnd3JhcCcgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJhdXRoLXNob3djYXNlLWJhZGdlLTFcIiBzdHlsZT17eyBmb250U2l6ZTogJzAuNzJyZW0nLCBiYWNrZ3JvdW5kOiAncmdiYSgyNTUsIDI1NSwgMjU1LCAwLjg1KScsIGJhY2tkcm9wRmlsdGVyOiAnYmx1cig4cHgpJywgV2Via2l0QmFja2Ryb3BGaWx0ZXI6ICdibHVyKDhweCknLCBjb2xvcjogJyM4RjVFMzYnLCBwYWRkaW5nOiAnNXB4IDEycHgnLCBib3JkZXJSYWRpdXM6ICc1MHB4JywgZm9udFdlaWdodDogJzYwMCcsIGJvcmRlcjogJzFweCBzb2xpZCByZ2JhKDIxMiwgMTYzLCAxMTUsIDAuMzUpJywgZGlzcGxheTogJ2lubGluZS1mbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGdhcDogJzAuNHJlbScgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjEzXCIgaGVpZ2h0PVwiMTNcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMTIgMnYyME0xNyA1SDdNMTkgMTlINU05IDloNk04IDE0aDhcIj48L3BhdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMTAwJSBIYW5kY3JhZnRlZFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiYXV0aC1zaG93Y2FzZS1iYWRnZS0yXCIgc3R5bGU9e3sgZm9udFNpemU6ICcwLjcycmVtJywgYmFja2dyb3VuZDogJ3JnYmEoMjU1LCAyNTUsIDI1NSwgMC44NSknLCBiYWNrZHJvcEZpbHRlcjogJ2JsdXIoOHB4KScsIFdlYmtpdEJhY2tkcm9wRmlsdGVyOiAnYmx1cig4cHgpJywgY29sb3I6ICcjOEY1RTM2JywgcGFkZGluZzogJzVweCAxMnB4JywgYm9yZGVyUmFkaXVzOiAnNTBweCcsIGZvbnRXZWlnaHQ6ICc2MDAnLCBib3JkZXI6ICcxcHggc29saWQgcmdiYSgyMTIsIDE2MywgMTE1LCAwLjM1KScsIGRpc3BsYXk6ICdpbmxpbmUtZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICcwLjRyZW0nIH19PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCIxM1wiIGhlaWdodD1cIjEzXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjNcIj48L2NpcmNsZT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk0xMiAydjNNMTIgMTl2M00yIDEyaDNNMTkgMTJoM000LjkzIDQuOTNsMi4xMiAyLjEyTTE2Ljk1IDE2Ljk1bDIuMTIgMi4xMk00LjkzIDE5LjA3bDIuMTItMi4xMk0xNi45NSA3LjA1bDIuMTItMi4xMlwiPjwvcGF0aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBQdXJlIE1pbmVyYWwgRHllc1xuICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiYXV0aC1zaG93Y2FzZS1iYWRnZS0zXCIgc3R5bGU9e3sgZm9udFNpemU6ICcwLjcycmVtJywgYmFja2dyb3VuZDogJ3JnYmEoMjU1LCAyNTUsIDI1NSwgMC44NSknLCBiYWNrZHJvcEZpbHRlcjogJ2JsdXIoOHB4KScsIFdlYmtpdEJhY2tkcm9wRmlsdGVyOiAnYmx1cig4cHgpJywgY29sb3I6ICcjOEY1RTM2JywgcGFkZGluZzogJzVweCAxMnB4JywgYm9yZGVyUmFkaXVzOiAnNTBweCcsIGZvbnRXZWlnaHQ6ICc2MDAnLCBib3JkZXI6ICcxcHggc29saWQgcmdiYSgyMTIsIDE2MywgMTE1LCAwLjM1KScsIGRpc3BsYXk6ICdpbmxpbmUtZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICcwLjRyZW0nIH19PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCIxM1wiIGhlaWdodD1cIjEzXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTIgNGwzIDEyaDE0bDMtMTItNiA3LTQtNy00IDctNi03em0zIDE2aDE0XCI+PC9wYXRoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEJlc3Bva2UgQ3V0c1xuICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgIHsvKiBFbGV2YXRlZCBMb2dpbiBDYXJkIChSaWdodC1BbGlnbmVkIGluIEZsZXggQ29udGFpbmVyKSAqL31cbiAgICAgICAgICAgICAgICA8ZGl2IFxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJhdXRoLWNhcmQtd3JhcHBlclwiXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHpJbmRleDogMyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1heFdpZHRoOiAnMzgwcHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsZXhTaHJpbms6IDBcbiAgICAgICAgICAgICAgICAgICAgfX0gXG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiAncmdiYSgyNTUsIDI1NSwgMjU1LCAwLjcyKScsXG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZHJvcEZpbHRlcjogJ2JsdXIoMjJweCknLFxuICAgICAgICAgICAgICAgICAgICAgICAgV2Via2l0QmFja2Ryb3BGaWx0ZXI6ICdibHVyKDIycHgpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6ICcyLjJyZW0gMnJlbScsXG4gICAgICAgICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICcyNHB4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJveFNoYWRvdzogJzAgMTZweCA0NXB4IHJnYmEoMjEyLCAxNjMsIDExNSwgMC4xNCknLFxuICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiAnMS41cHggc29saWQgcmdiYSgyMTIsIDE2MywgMTE1LCAwLjM1KSdcbiAgICAgICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICB7LyogQ2xlYW4gU3RhdGljIEhlYWRlciAqL31cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgdGV4dEFsaWduOiAnY2VudGVyJywgbWFyZ2luQm90dG9tOiAnMS4yNXJlbScgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGgxIHN0eWxlPXt7IGZvbnRGYW1pbHk6ICd2YXIoLS1mb250LWhlYWRpbmcpJywgZm9udFNpemU6ICcxLjY1cmVtJywgY29sb3I6ICcjMkQyQTI2JywgbWFyZ2luQm90dG9tOiAnMC4zcmVtJywgZm9udFdlaWdodDogJzQwMCcgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtpc1NpZ25VcCA/ICdDcmVhdGUgQWNjb3VudCcgOiAnV2VsY29tZSBCYWNrJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2gxPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPXt7IGNvbG9yOiAnIzZDNjg2MycsIGZvbnRTaXplOiAnMC44cmVtJywgbGluZUhlaWdodDogJzEuNCcsIG1hcmdpbjogJzAgYXV0bycsIG1heFdpZHRoOiAnMzAwcHgnIH19PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7aXNTaWduVXAgPyAnSm9pbiBUaGUgRXRobmljIFRvdWNoIHRvIGVuam95IHBlcnNvbmFsaXplZCByb3lhbCByZXdhcmRzLicgOiAnU2lnbiBpbiB0byBhY2Nlc3MgeW91ciBoYW5kY3JhZnRlZCBKYWlwdXIgY29sbGVjdGlvbiwgd2lzaGxpc3QsICYgb3JkZXJzLid9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtyZWRpcmVjdFBhdGguaW5jbHVkZXMoJ2NoZWNrb3V0JykgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogJyNGQUY3RjInLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgcmdiYSgyMTIsIDE2MywgMTE1LCAwLjQpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjOEY1RTM2JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogJzAuNjVyZW0gMC44NXJlbScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzEycHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW5Cb3R0b206ICcxcmVtJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6ICcwLjc4cmVtJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2FwOiAnMC41NXJlbScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6ICc1MDAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lSGVpZ2h0OiAnMS4zNSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjE4XCIgaGVpZ2h0PVwiMThcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCIjOEY1RTM2XCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiIHN0eWxlPXt7IGZsZXhTaHJpbms6IDAgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmVjdCB4PVwiM1wiIHk9XCIxMVwiIHdpZHRoPVwiMThcIiBoZWlnaHQ9XCIxMVwiIHJ4PVwiMlwiIHJ5PVwiMlwiPjwvcmVjdD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNNyAxMVY3YTUgNSAwIDAgMSAxMCAwdjRcIj48L3BhdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj5QbGVhc2UgPHN0cm9uZz5TaWduIEluPC9zdHJvbmc+IG9yIDxzdHJvbmc+UmVnaXN0ZXI8L3N0cm9uZz4gdG8gcGxhY2UgeW91ciBvcmRlci4gWW91IHdpbGwgcmV0dXJuIHRvIGNoZWNrb3V0IGF1dG9tYXRpY2FsbHkhPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgKX1cblxuICAgICAgICAgICAgICAgICAgICAgICAge2Vycm9yICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGJhY2tncm91bmQ6ICcjRkRGMUYwJywgY29sb3I6ICd2YXIoLS1jb2xvci1lcnJvciknLCBwYWRkaW5nOiAnMC41NXJlbScsIGJvcmRlclJhZGl1czogJzEwcHgnLCBtYXJnaW5Cb3R0b206ICcxcmVtJywgZm9udFNpemU6ICcwLjc4cmVtJywgdGV4dEFsaWduOiAnY2VudGVyJywgYm9yZGVyOiAnMXB4IHNvbGlkIHJnYmEoMjE3LCA4MywgNzksIDAuMiknIH19PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7ZXJyb3J9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICApfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB7LyogU2lnbiBJbiAvIFJlZ2lzdGVyIFBpbGwgU3dpdGNoZXIgKi99XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgZ2FwOiAnMC40cmVtJywgbWFyZ2luQm90dG9tOiAnMS4xcmVtJywgYmFja2dyb3VuZDogJyNGQUY5RjgnLCBwYWRkaW5nOiAnNHB4JywgYm9yZGVyUmFkaXVzOiAnNTBweCcsIGJvcmRlcjogJzFweCBzb2xpZCByZ2JhKDIxMiwgMTYzLCAxMTUsIDAuMjUpJyB9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7IHNldElzU2lnblVwKGZhbHNlKTsgc2V0RXJyb3IoJycpOyB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmxleDogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6ICcwLjQycmVtJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6ICFpc1NpZ25VcCA/ICdsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAjRDRBMzczIDAlLCAjQzQ5MzYzIDEwMCUpJyA6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogIWlzU2lnblVwID8gJyNmZmYnIDogJyM2QzY4NjMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiAnbm9uZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICc1MHB4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogJ2FsbCAwLjNzIGVhc2UnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogJzYwMCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogJzAuODJyZW0nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm94U2hhZG93OiAhaXNTaWduVXAgPyAnMCA0cHggMTJweCByZ2JhKDIxMiwgMTYzLCAxMTUsIDAuMjUpJyA6ICdub25lJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2lnbiBJblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHsgc2V0SXNTaWduVXAodHJ1ZSk7IHNldEVycm9yKCcnKTsgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsZXg6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAnMC40MnJlbScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBpc1NpZ25VcCA/ICdsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAjRDRBMzczIDAlLCAjQzQ5MzYzIDEwMCUpJyA6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogaXNTaWduVXAgPyAnI2ZmZicgOiAnIzZDNjg2MycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXI6ICdub25lJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzUwcHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiAnYWxsIDAuM3MgZWFzZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiAnNjAwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAnMC44MnJlbScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3hTaGFkb3c6IGlzU2lnblVwID8gJzAgNHB4IDEycHggcmdiYSgyMTIsIDE2MywgMTE1LCAwLjI1KScgOiAnbm9uZSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlZ2lzdGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICAgICAgPGZvcm0gb25TdWJtaXQ9e2hhbmRsZVN1Ym1pdH0gc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJywgZ2FwOiAnMC44NXJlbScgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2lzU2lnblVwICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17eyBkaXNwbGF5OiAnYmxvY2snLCBtYXJnaW5Cb3R0b206ICcwLjI1cmVtJywgZm9udFdlaWdodDogJzUwMCcsIGZvbnRTaXplOiAnMC43OHJlbScsIGNvbG9yOiAnIzQ0NCcgfX0+RnVsbCBOYW1lPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwidGV4dFwiIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImF1dGgtaW5wdXRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtmdWxsTmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldEZ1bGxOYW1lKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkVudGVyIHlvdXIgZnVsbCBuYW1lXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBoZWlnaHQ6ICczOHB4JywgZm9udFNpemU6ICcwLjgycmVtJyB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e3sgZGlzcGxheTogJ2Jsb2NrJywgbWFyZ2luQm90dG9tOiAnMC4yNXJlbScsIGZvbnRXZWlnaHQ6ICc1MDAnLCBmb250U2l6ZTogJzAuNzhyZW0nLCBjb2xvcjogJyM0NDQnIH19PkVtYWlsIEFkZHJlc3M8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiZW1haWxcIiBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYXV0aC1pbnB1dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17ZW1haWx9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldEVtYWlsKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwieW91QGV4YW1wbGUuY29tXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IGhlaWdodDogJzM4cHgnLCBmb250U2l6ZTogJzAuODJyZW0nIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBtYXJnaW5Cb3R0b206ICcwLjI1cmVtJyB9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17eyBmb250V2VpZ2h0OiAnNTAwJywgZm9udFNpemU6ICcwLjc4cmVtJywgY29sb3I6ICcjNDQ0JyB9fT5QYXNzd29yZDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IWlzU2lnblVwICYmIDxhIGhyZWY9XCIjXCIgc3R5bGU9e3sgZm9udFNpemU6ICcwLjc1cmVtJywgY29sb3I6ICcjOEY1RTM2JywgdGV4dERlY29yYXRpb246ICdub25lJywgZm9udFdlaWdodDogJzUwMCcgfX0+Rm9yZ290IHBhc3N3b3JkPzwvYT59XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwicGFzc3dvcmRcIiBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYXV0aC1pbnB1dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17cGFzc3dvcmR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldFBhc3N3b3JkKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPXtpc1NpZ25VcCA/IFwiQ3JlYXRlIHBhc3N3b3JkIChtaW4uIDYgY2hhcnMpXCIgOiBcIkVudGVyIHlvdXIgcGFzc3dvcmRcIn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IGhlaWdodDogJzM4cHgnLCBmb250U2l6ZTogJzAuODJyZW0nIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInN1Ym1pdFwiIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZD17bG9hZGluZ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5XCIgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogJzAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luVG9wOiAnMC4zNXJlbScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogJzAuODVyZW0nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAnMzhweCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICc1MHB4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IGxvYWRpbmcgPyAwLjcgOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiAnbGluZWFyLWdyYWRpZW50KDEzNWRlZywgI0Q0QTM3MyAwJSwgI0M0OTM2MyAxMDAlKScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXI6ICdub25lJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnI0ZGRicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiAnNjAwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJveFNoYWRvdzogJzAgNHB4IDE1cHggcmdiYSgyMTIsIDE2MywgMTE1LCAwLjI1KSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtsb2FkaW5nID8gJ1Byb2Nlc3NpbmcuLi4nIDogKGlzU2lnblVwID8gJ0NyZWF0ZSBBY2NvdW50JyA6ICdTaWduIEluJyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Zvcm0+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgbWFyZ2luOiAnMXJlbSAwJywgZ2FwOiAnMC42cmVtJyB9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGZsZXg6IDEsIGhlaWdodDogJzFweCcsIGJhY2tncm91bmQ6ICcjRUFFNkUxJyB9fT48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250U2l6ZTogJzAuN3JlbScsIGNvbG9yOiAnIzg4OCcsIHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnLCBsZXR0ZXJTcGFjaW5nOiAnMC41cHgnIH19Pk9yIGNvbnRpbnVlIHdpdGg8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBmbGV4OiAxLCBoZWlnaHQ6ICcxcHgnLCBiYWNrZ3JvdW5kOiAnI0VBRTZFMScgfX0+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVHb29nbGVTaWduSW59XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ9e2xvYWRpbmd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAnMzhweCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6ICcwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogJyNmZmYnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgcmdiYSgyMTIsIDE2MywgMTE1LCAwLjM1KScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzUwcHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnYXA6ICcwLjVyZW0nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiAnYWxsIDAuM3MgZWFzZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6ICc1MDAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogJzAuODJyZW0nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMzMzMnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3ZnIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiB3aWR0aD1cIjE4XCIgaGVpZ2h0PVwiMThcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk0yMi41NiAxMi4yNWMwLS43OC0uMDctMS41My0uMi0yLjI1SDEydjQuMjZoNS45MmMtLjI2IDEuMzctMS4wNCAyLjUzLTIuMjEgMy4zMXYyLjc3aDMuNTdjMi4wOC0xLjkyIDMuMjgtNC43NCAzLjI4LTguMDl6XCIgZmlsbD1cIiM0Mjg1RjRcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMTIgMjNjMi45NyAwIDUuNDYtLjk4IDcuMjgtMi42NmwtMy41Ny0yLjc3Yy0uOTguNjYtMi4yMyAxLjA2LTMuNzEgMS4wNi0yLjg2IDAtNS4yOS0xLjkzLTYuMTYtNC41M0gyLjE4djIuODRDMy45OSAyMC41MyA3LjcgMjMgMTIgMjN6XCIgZmlsbD1cIiMzNEE4NTNcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNNS44NCAxNC4wOWMtLjIyLS42Ni0uMzUtMS4zNi0uMzUtMi4wOXMuMTMtMS40My4zNS0yLjA5VjcuMDdIMi4xOEMxLjQzIDguNTUgMSAxMC4yMiAxIDEycy40MyAzLjQ1IDEuMTggNC45M2wyLjg1LTIuMjIuODEtLjYyelwiIGZpbGw9XCIjRkJCQzA1XCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTEyIDUuMzhjMS42MiAwIDMuMDYuNTYgNC4yMSAxLjY0bDMuMTUtMy4xNUMxNy40NSAyLjA5IDE0Ljk3IDEgMTIgMSA3LjcgMSAzLjk5IDMuNDcgMi4xOCA3LjA3bDMuNjYgMi44NGMuODctMi42IDMuMy00LjUzIDYuMTYtNC41M3pcIiBmaWxsPVwiI0VBNDMzNVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBHb29nbGVcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBBdXRoO1xuIl19