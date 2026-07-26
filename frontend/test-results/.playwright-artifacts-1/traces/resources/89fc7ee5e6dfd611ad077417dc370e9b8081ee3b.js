import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/pages/CheckoutSuccess.jsx");const React = __vite__cjsImport0_react; const useState = __vite__cjsImport0_react["useState"]; const useEffect = __vite__cjsImport0_react["useEffect"]; const useRef = __vite__cjsImport0_react["useRef"]; const useMemo = __vite__cjsImport0_react["useMemo"]; const useCallback = __vite__cjsImport0_react["useCallback"];const _jsxDEV = __vite__cjsImport4_react_jsxDevRuntime["jsxDEV"];import __vite__cjsImport0_react from "/node_modules/.vite/deps/react.js?v=42a9b196";
import { useNavigate, Link, useLocation, useParams, Routes, Route, Navigate, BrowserRouter } from "/node_modules/.vite/deps/react-router-dom.js?v=42a9b196";
import CopyButton from "/src/components/CopyButton.jsx";
import confetti from "/node_modules/.vite/deps/canvas-confetti.js?v=42a9b196";
var _jsxFileName = "D:/The Ethnic Touch/frontend/src/pages/CheckoutSuccess.jsx";
import __vite__cjsImport4_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=42a9b196";
var _s = $RefreshSig$();
const CheckoutSuccess = () => {
	_s();
	const state = useLocation().state || {};
	const { orderId, gift, tracking, unlockedGift, giftType, giftExpiryDate, checkoutType, paymentMethod, amount } = state;
	const navigate = useNavigate();
	useEffect(() => {
		if (!orderId) {
			navigate("/");
			return;
		}
		try {
			confetti({
				particleCount: 140,
				spread: 90,
				origin: { y: .55 },
				colors: [
					"#D4A373",
					"#8F5E36",
					"#2E7D32",
					"#F4D392",
					"#E8F5E9"
				]
			});
			setTimeout(() => {
				confetti({
					particleCount: 70,
					angle: 60,
					spread: 60,
					origin: { x: 0 },
					colors: [
						"#D4A373",
						"#8F5E36",
						"#F4D392"
					]
				});
			}, 250);
			setTimeout(() => {
				confetti({
					particleCount: 70,
					angle: 120,
					spread: 60,
					origin: { x: 1 },
					colors: [
						"#D4A373",
						"#8F5E36",
						"#F4D392"
					]
				});
			}, 400);
		} catch (err) {
			console.log("Confetti animation error:", err);
		}
	}, [orderId, navigate]);
	if (!orderId) {
		return null;
	}
	const displayGift = unlockedGift || gift;
	const isPhysical = giftType === "physical";
	// Store pickup OR offline QR payment
	const isPickup = checkoutType === "pickup" || tracking === "STORE-PICKUP" || paymentMethod === "offline_qr";
	const isOffline = paymentMethod === "offline_qr";
	// QR Code data: point to admin confirm pickup view
	const qrUrl = window.location.origin + "/static/admin/index.html#pickup-scanner?orderId=" + orderId;
	const qrImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&color=2c2c2c&data=${encodeURIComponent(qrUrl)}`;
	return /* @__PURE__ */ _jsxDEV("div", {
		style: {
			padding: "1.5rem 1rem 3rem",
			maxWidth: "620px",
			margin: "0 auto",
			minHeight: "75vh",
			textAlign: "center",
			width: "100%",
			boxSizing: "border-box"
		},
		children: [
			isOffline ? /* @__PURE__ */ _jsxDEV("div", {
				style: {
					width: "76px",
					height: "76px",
					borderRadius: "50%",
					background: "#FAF3ED",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					margin: "0 auto 1rem",
					boxShadow: "0 8px 20px rgba(208,136,59,0.12)"
				},
				children: /* @__PURE__ */ _jsxDEV("svg", {
					width: "36",
					height: "36",
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "#8F5E36",
					strokeWidth: "2",
					strokeLinecap: "round",
					strokeLinejoin: "round",
					children: [/* @__PURE__ */ _jsxDEV("circle", {
						cx: "12",
						cy: "12",
						r: "10"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 78,
						columnNumber: 25
					}, this), /* @__PURE__ */ _jsxDEV("polyline", { points: "12 6 12 12 16 14" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 79,
						columnNumber: 25
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 77,
					columnNumber: 21
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 66,
				columnNumber: 17
			}, this) : /* @__PURE__ */ _jsxDEV("div", {
				style: {
					width: "76px",
					height: "76px",
					borderRadius: "50%",
					background: "#E8F5E9",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					margin: "0 auto 1rem",
					boxShadow: "0 8px 20px rgba(46,125,50,0.12)"
				},
				children: /* @__PURE__ */ _jsxDEV("svg", {
					width: "36",
					height: "36",
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "#2E7D32",
					strokeWidth: "2.5",
					strokeLinecap: "round",
					strokeLinejoin: "round",
					children: /* @__PURE__ */ _jsxDEV("polyline", { points: "20 6 9 17 4 12" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 95,
						columnNumber: 25
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 94,
					columnNumber: 21
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 83,
				columnNumber: 17
			}, this),
			/* @__PURE__ */ _jsxDEV("h1", {
				style: {
					fontFamily: "var(--font-heading)",
					fontSize: "clamp(1.35rem, 5vw, 1.65rem)",
					marginBottom: "0.4rem",
					color: "#2D2A26",
					letterSpacing: "-0.01em",
					lineHeight: "1.25"
				},
				children: isOffline ? "Boutique Order Reserved!" : "Order Placed Successfully!"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 100,
				columnNumber: 13
			}, this),
			/* @__PURE__ */ _jsxDEV("p", {
				style: {
					fontSize: "0.88rem",
					color: "#6C6863",
					marginBottom: "1.5rem",
					padding: "0 0.5rem"
				},
				children: "Thank you for choosing luxury, custom Indo-Western aesthetics."
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 110,
				columnNumber: 13
			}, this),
			/* @__PURE__ */ _jsxDEV("div", {
				style: {
					padding: "1.75rem 1rem 1.5rem",
					backgroundColor: "#fff",
					border: "1.5px solid #E6E4E0",
					borderRadius: "20px",
					margin: "1.75rem 0 1.25rem",
					boxShadow: "0 8px 30px rgba(0,0,0,0.025)",
					position: "relative",
					boxSizing: "border-box",
					maxWidth: "100%"
				},
				children: [
					/* @__PURE__ */ _jsxDEV("div", {
						style: {
							position: "absolute",
							top: "-12px",
							left: "50%",
							transform: "translateX(-50%)",
							background: "#D4A373",
							color: "#fff",
							padding: "4px 16px",
							borderRadius: "20px",
							fontSize: "0.72rem",
							fontWeight: "700",
							textTransform: "uppercase",
							letterSpacing: "0.08em",
							whiteSpace: "nowrap",
							zIndex: 2
						},
						children: "Boutique Receipt"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 123,
						columnNumber: 17
					}, this),
					/* @__PURE__ */ _jsxDEV("div", {
						style: {
							display: "inline-flex",
							alignItems: "center",
							justifyContent: "center",
							gap: "0.4rem 0.5rem",
							backgroundColor: "#FAF4EE",
							border: "1.5px dashed #D4A373",
							borderRadius: "24px",
							padding: "0.55rem 0.9rem",
							marginTop: "0.6rem",
							marginBottom: "1.5rem",
							boxShadow: "0 4px 15px rgba(212,163,115,0.06)",
							maxWidth: "100%",
							boxSizing: "border-box",
							flexWrap: "wrap"
						},
						children: [
							/* @__PURE__ */ _jsxDEV("span", {
								style: {
									fontSize: "0.75rem",
									color: "#8F5E36",
									fontWeight: "700",
									textTransform: "uppercase",
									letterSpacing: "0.06em",
									whiteSpace: "nowrap"
								},
								children: "Order Reference"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 159,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ _jsxDEV("span", {
								style: {
									color: "#D4A373",
									opacity: .6,
									display: "inline-block"
								},
								children: "|"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 160,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ _jsxDEV("span", {
								style: {
									display: "inline-flex",
									alignItems: "center",
									gap: "0.35rem"
								},
								children: [/* @__PURE__ */ _jsxDEV("strong", {
									style: {
										fontSize: "clamp(0.85rem, 3.8vw, 1.05rem)",
										fontFamily: "monospace",
										color: "#2D2A26",
										letterSpacing: "0.03em",
										wordBreak: "break-all"
									},
									children: ["#", orderId]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 162,
									columnNumber: 25
								}, this), /* @__PURE__ */ _jsxDEV(CopyButton, {
									text: orderId,
									iconOnly: true,
									style: {
										padding: "4px 6px",
										borderRadius: "50%",
										border: "1px solid #E6D8C8",
										backgroundColor: "#FFF",
										flexShrink: 0
									}
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 163,
									columnNumber: 25
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 161,
								columnNumber: 21
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 143,
						columnNumber: 17
					}, this),
					/* @__PURE__ */ _jsxDEV("p", {
						style: {
							fontSize: "0.92rem",
							color: "#5C5854",
							lineHeight: "1.6",
							margin: "0 0 1.5rem",
							padding: "0 0.25rem"
						},
						children: isOffline ? `Please present the verification pass QR code below at the reception counter to finalize payments of ₹${(amount || 0).toLocaleString("en-IN")} and collect your bespoke kurthi garments.` : isPickup ? "Your boutique collection checkout is complete and fully paid. Keep this code handy for scanning at the retail checkout." : tracking && (tracking.startsWith("RAPIDO-INSTANT-") || tracking.startsWith("UBER-INSTANT-")) ? "Registered for direct instant courier shipping. Your designer styles are prepared, steamed, and dispatched from Jubilee Hills via direct courier." : "Your designer packaging is ready and handed over to express delivery trackers for prompt dispatch to your wardrobe."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 167,
						columnNumber: 17
					}, this),
					isPickup && /* @__PURE__ */ _jsxDEV("div", {
						style: {
							marginTop: "1.25rem",
							padding: "1.4rem 1rem",
							background: "#FAF9F6",
							border: "2px solid #D4A373",
							borderRadius: "16px",
							display: "inline-block",
							maxWidth: "100%",
							boxSizing: "border-box",
							boxShadow: "0 8px 20px rgba(212,163,115,0.08)"
						},
						children: [
							/* @__PURE__ */ _jsxDEV("p", {
								style: {
									margin: "0 0 1rem",
									fontSize: "0.78rem",
									color: "#8F5E36",
									fontWeight: "700",
									textTransform: "uppercase",
									letterSpacing: "0.08em"
								},
								children: "Boutique Verification Scanner Pass"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 191,
								columnNumber: 25
							}, this),
							/* @__PURE__ */ _jsxDEV("div", {
								style: {
									padding: "8px",
									background: "#fff",
									borderRadius: "12px",
									display: "inline-block",
									border: "1px solid #E6E4E0",
									maxWidth: "100%",
									boxSizing: "border-box"
								},
								children: /* @__PURE__ */ _jsxDEV("img", {
									src: qrImgUrl,
									alt: "Order Pickup Pass",
									style: {
										width: "180px",
										height: "180px",
										maxWidth: "100%",
										height: "auto",
										display: "block",
										margin: "0 auto"
									}
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 203,
									columnNumber: 29
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 194,
								columnNumber: 25
							}, this),
							/* @__PURE__ */ _jsxDEV("div", { children: /* @__PURE__ */ _jsxDEV("div", {
								style: {
									display: "inline-flex",
									alignItems: "center",
									justifyContent: "center",
									gap: "0.5rem",
									marginTop: "1rem",
									backgroundColor: "#FFF",
									border: "1px dashed #D4A373",
									borderRadius: "24px",
									padding: "0.45rem 1rem",
									maxWidth: "100%",
									boxSizing: "border-box",
									flexWrap: "wrap"
								},
								children: /* @__PURE__ */ _jsxDEV("span", {
									style: {
										display: "inline-flex",
										alignItems: "center",
										gap: "0.35rem"
									},
									children: [/* @__PURE__ */ _jsxDEV("strong", {
										style: {
											fontSize: "clamp(0.85rem, 3.8vw, 1.05rem)",
											fontFamily: "monospace",
											color: "#2D2A26",
											letterSpacing: "0.04em",
											wordBreak: "break-all"
										},
										children: ["#", orderId]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 225,
										columnNumber: 37
									}, this), /* @__PURE__ */ _jsxDEV(CopyButton, {
										text: orderId,
										iconOnly: true,
										style: {
											padding: "4px 7px",
											borderRadius: "50%",
											border: "1px solid #E6D8C8",
											flexShrink: 0
										}
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 234,
										columnNumber: 37
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 224,
									columnNumber: 33
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 210,
								columnNumber: 29
							}, this) }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 209,
								columnNumber: 25
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 180,
						columnNumber: 21
					}, this),
					!isPickup && tracking && /* @__PURE__ */ _jsxDEV("div", {
						style: {
							marginTop: "1.25rem",
							padding: "0.65rem 1rem",
							background: "#FAF9F6",
							border: "1.5px dashed #D4A373",
							borderRadius: "24px",
							display: "inline-flex",
							alignItems: "center",
							justifyContent: "center",
							gap: "0.4rem 0.6rem",
							flexWrap: "wrap",
							maxWidth: "100%",
							boxSizing: "border-box"
						},
						children: [/* @__PURE__ */ _jsxDEV("span", {
							style: {
								fontSize: "0.8rem",
								color: "#6C6863",
								fontWeight: "500",
								whiteSpace: "nowrap"
							},
							children: "Carrier Waybill ID:"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 257,
							columnNumber: 25
						}, this), /* @__PURE__ */ _jsxDEV("span", {
							style: {
								display: "inline-flex",
								alignItems: "center",
								gap: "0.35rem"
							},
							children: [/* @__PURE__ */ _jsxDEV("strong", {
								style: {
									fontSize: "clamp(0.85rem, 3.8vw, 1.05rem)",
									color: "#8F5E36",
									fontFamily: "monospace",
									letterSpacing: "0.04em",
									wordBreak: "break-all"
								},
								children: tracking
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 259,
								columnNumber: 29
							}, this), /* @__PURE__ */ _jsxDEV(CopyButton, {
								text: tracking,
								iconOnly: true,
								style: {
									padding: "4px 7px",
									borderRadius: "50%",
									border: "1px solid #E6D8C8",
									backgroundColor: "#FFF",
									flexShrink: 0
								}
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 260,
								columnNumber: 29
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 258,
							columnNumber: 25
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 243,
						columnNumber: 21
					}, this),
					displayGift && /* @__PURE__ */ _jsxDEV("div", {
						style: {
							marginTop: "1.75rem",
							padding: "1.4rem 1rem",
							border: "1.5px solid #FFE5D9",
							backgroundColor: "#FAF3ED",
							borderRadius: "16px",
							boxShadow: "0 6px 20px rgba(212,163,115,0.06)",
							maxWidth: "100%",
							boxSizing: "border-box"
						},
						children: isPhysical ? /* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("h4", {
							style: {
								color: "#8F5E36",
								margin: "0 0 0.4rem",
								fontFamily: "var(--font-heading)",
								fontSize: "1.2rem",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								gap: "8px"
							},
							children: [/* @__PURE__ */ _jsxDEV("svg", {
								width: "20",
								height: "20",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: "2",
								strokeLinecap: "round",
								strokeLinejoin: "round",
								style: { color: "#8F5E36" },
								children: [
									/* @__PURE__ */ _jsxDEV("polyline", { points: "20 12 20 22 4 22 4 12" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 280,
										columnNumber: 41
									}, this),
									/* @__PURE__ */ _jsxDEV("rect", {
										x: "2",
										y: "7",
										width: "20",
										height: "5"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 281,
										columnNumber: 41
									}, this),
									/* @__PURE__ */ _jsxDEV("line", {
										x1: "12",
										y1: "22",
										x2: "12",
										y2: "7"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 282,
										columnNumber: 41
									}, this),
									/* @__PURE__ */ _jsxDEV("path", { d: "M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 283,
										columnNumber: 41
									}, this),
									/* @__PURE__ */ _jsxDEV("path", { d: "M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 284,
										columnNumber: 41
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 279,
								columnNumber: 37
							}, this), "Free Gift Gained!"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 278,
							columnNumber: 33
						}, this), /* @__PURE__ */ _jsxDEV("p", {
							style: {
								margin: 0,
								fontSize: "0.88rem",
								color: "#6C6863",
								lineHeight: "1.5"
							},
							children: [
								"A complimentary bespoke ",
								/* @__PURE__ */ _jsxDEV("strong", { children: displayGift }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 289,
									columnNumber: 61
								}, this),
								" has been contributed to your package and will dispatch in the same carton!"
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 288,
							columnNumber: 33
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 277,
							columnNumber: 29
						}, this) : /* @__PURE__ */ _jsxDEV("div", { children: [
							/* @__PURE__ */ _jsxDEV("h4", {
								style: {
									color: "#8F5E36",
									margin: "0 0 0.4rem",
									fontFamily: "var(--font-heading)",
									fontSize: "1.2rem",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									gap: "8px"
								},
								children: [/* @__PURE__ */ _jsxDEV("svg", {
									width: "20",
									height: "20",
									viewBox: "0 0 24 24",
									fill: "none",
									stroke: "currentColor",
									strokeWidth: "2",
									strokeLinecap: "round",
									strokeLinejoin: "round",
									style: { color: "#8F5E36" },
									children: /* @__PURE__ */ _jsxDEV("path", { d: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707-.707M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 296,
										columnNumber: 41
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 295,
									columnNumber: 37
								}, this), "Reward Coupon Unlocked!"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 294,
								columnNumber: 33
							}, this),
							/* @__PURE__ */ _jsxDEV("div", {
								style: {
									display: "inline-flex",
									alignItems: "center",
									justifyContent: "center",
									gap: "0.5rem",
									backgroundColor: "#FFF",
									border: "1px dashed #D4A373",
									borderRadius: "24px",
									padding: "0.45rem 1rem",
									marginTop: "0.6rem",
									maxWidth: "100%",
									boxSizing: "border-box",
									flexWrap: "wrap"
								},
								children: [/* @__PURE__ */ _jsxDEV("strong", {
									style: {
										fontSize: "clamp(0.85rem, 3.8vw, 1.05rem)",
										fontFamily: "monospace",
										color: "#8F5E36",
										letterSpacing: "0.06em",
										wordBreak: "break-all"
									},
									children: displayGift
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 314,
									columnNumber: 37
								}, this), /* @__PURE__ */ _jsxDEV(CopyButton, {
									text: displayGift,
									iconOnly: true,
									style: {
										padding: "4px 7px",
										borderRadius: "50%",
										border: "1px solid #E6D8C8",
										flexShrink: 0
									}
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 315,
									columnNumber: 37
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 300,
								columnNumber: 33
							}, this),
							giftExpiryDate && /* @__PURE__ */ _jsxDEV("div", {
								style: { marginTop: "0.75rem" },
								children: /* @__PURE__ */ _jsxDEV("span", {
									style: {
										fontSize: "0.72rem",
										color: "#B83232",
										fontWeight: "700",
										backgroundColor: "#FFF2F2",
										padding: "4px 12px",
										borderRadius: "20px",
										display: "inline-block",
										textTransform: "uppercase",
										letterSpacing: "0.05em"
									},
									children: ["Valid Until: ", new Date(giftExpiryDate).toLocaleDateString(undefined, { dateStyle: "long" })]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 319,
									columnNumber: 41
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 318,
								columnNumber: 37
							}, this)
						] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 293,
							columnNumber: 29
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 266,
						columnNumber: 21
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 112,
				columnNumber: 13
			}, this),
			/* @__PURE__ */ _jsxDEV(Link, {
				to: "/",
				className: "btn btn-primary",
				style: {
					padding: "0.85rem 2.2rem",
					fontSize: "0.95rem",
					fontWeight: "600",
					borderRadius: "50px",
					letterSpacing: "0.02em",
					boxShadow: "0 6px 20px rgba(45,42,38,0.1)",
					display: "inline-block",
					maxWidth: "100%",
					boxSizing: "border-box"
				},
				children: "Return to Storefront"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 340,
				columnNumber: 13
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 63,
		columnNumber: 9
	}, this);
};
_s(CheckoutSuccess, "TnLqwpXPbDdm2yNwQh2QrsTj4MQ=", false, function() {
	return [useLocation, useNavigate];
});
_c = CheckoutSuccess;
export default CheckoutSuccess;
var _c;
$RefreshReg$(_c, "CheckoutSuccess");
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;
import * as __vite_react_currentExports from "/src/pages/CheckoutSuccess.jsx";
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }

  const currentExports = __vite_react_currentExports;
  queueMicrotask(() => {
    RefreshRuntime.registerExportsForReactRefresh("D:/The Ethnic Touch/frontend/src/pages/CheckoutSuccess.jsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("D:/The Ethnic Touch/frontend/src/pages/CheckoutSuccess.jsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
function $RefreshReg$(type, id) { return RefreshRuntime.register(type, "D:/The Ethnic Touch/frontend/src/pages/CheckoutSuccess.jsx" + ' ' + id); }
function $RefreshSig$() { return RefreshRuntime.createSignatureFunctionForTransform(); }

//# sourceMappingURL=data:application/json;base64,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QUNQLFlBQVk7VUFDWixpQkFBaUI7VUFDakIsU0FBUztVQUNULGNBQWM7VUFDZCxTQUFTO1VBQ1QsZUFBZTtVQUNmLGVBQWU7U0FDbkI7bUJBVkEsQ0FVRyxpQkFDZSxJQUFJLEtBQUssY0FBYyxDQUFDLENBQUMsbUJBQW1CLFdBQVcsRUFBRSxXQUFXLE9BQU8sQ0FBQyxDQUN4Rjs7Ozs7O09BQ0w7Ozs7O01BRVI7Ozs7O0tBRVI7Ozs7O0lBRVI7Ozs7OztHQUVMLHdCQUFDLE1BQUQ7SUFBTSxJQUFHO0lBQUksV0FBVTtJQUFrQixPQUFPO0tBQzVDLFNBQVM7S0FDVCxVQUFVO0tBQ1YsWUFBWTtLQUNaLGNBQWM7S0FDZCxlQUFlO0tBQ2YsV0FBVztLQUNYLFNBQVM7S0FDVCxVQUFVO0tBQ1YsV0FBVztJQUNmO2NBQUc7R0FBMEI7Ozs7O0VBQzVCOzs7Ozs7QUFFYjs7Ozs7QUFFQSxlQUFlIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIkNoZWNrb3V0U3VjY2Vzcy5qc3giXSwidmVyc2lvbiI6Mywic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QsIHVzZVJlZiwgdXNlTWVtbywgdXNlQ2FsbGJhY2sgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IHVzZU5hdmlnYXRlLCBMaW5rLCB1c2VMb2NhdGlvbiwgdXNlUGFyYW1zLCBSb3V0ZXMsIFJvdXRlLCBOYXZpZ2F0ZSwgQnJvd3NlclJvdXRlciB9IGZyb20gJ3JlYWN0LXJvdXRlci1kb20nO1xyXG5pbXBvcnQgQ29weUJ1dHRvbiBmcm9tICcuLi9jb21wb25lbnRzL0NvcHlCdXR0b24nO1xyXG5pbXBvcnQgY29uZmV0dGkgZnJvbSAnY2FudmFzLWNvbmZldHRpJztcclxuXHJcbmNvbnN0IENoZWNrb3V0U3VjY2VzcyA9ICgpID0+IHtcclxuICAgIGNvbnN0IHN0YXRlID0gdXNlTG9jYXRpb24oKS5zdGF0ZSB8fCB7fTtcclxuICAgIGNvbnN0IHsgb3JkZXJJZCwgZ2lmdCwgdHJhY2tpbmcsIHVubG9ja2VkR2lmdCwgZ2lmdFR5cGUsIGdpZnRFeHBpcnlEYXRlLCBjaGVja291dFR5cGUsIHBheW1lbnRNZXRob2QsIGFtb3VudCB9ID0gc3RhdGU7XHJcbiAgICBjb25zdCBuYXZpZ2F0ZSA9IHVzZU5hdmlnYXRlKCk7XHJcblxyXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgICAgICBpZiAoIW9yZGVySWQpIHtcclxuICAgICAgICAgICAgbmF2aWdhdGUoJy8nKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uZmV0dGkoe1xyXG4gICAgICAgICAgICAgICAgcGFydGljbGVDb3VudDogMTQwLFxyXG4gICAgICAgICAgICAgICAgc3ByZWFkOiA5MCxcclxuICAgICAgICAgICAgICAgIG9yaWdpbjogeyB5OiAwLjU1IH0sXHJcbiAgICAgICAgICAgICAgICBjb2xvcnM6IFsnI0Q0QTM3MycsICcjOEY1RTM2JywgJyMyRTdEMzInLCAnI0Y0RDM5MicsICcjRThGNUU5J11cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uZmV0dGkoe1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlQ291bnQ6IDcwLFxyXG4gICAgICAgICAgICAgICAgICAgIGFuZ2xlOiA2MCxcclxuICAgICAgICAgICAgICAgICAgICBzcHJlYWQ6IDYwLFxyXG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbjogeyB4OiAwIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3JzOiBbJyNENEEzNzMnLCAnIzhGNUUzNicsICcjRjREMzkyJ11cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LCAyNTApO1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbmZldHRpKHtcclxuICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZUNvdW50OiA3MCxcclxuICAgICAgICAgICAgICAgICAgICBhbmdsZTogMTIwLFxyXG4gICAgICAgICAgICAgICAgICAgIHNwcmVhZDogNjAsXHJcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luOiB7IHg6IDEgfSxcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcnM6IFsnI0Q0QTM3MycsICcjOEY1RTM2JywgJyNGNEQzOTInXVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sIDQwMCk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ29uZmV0dGkgYW5pbWF0aW9uIGVycm9yOlwiLCBlcnIpO1xyXG4gICAgICAgIH1cclxuICAgIH0sIFtvcmRlcklkLCBuYXZpZ2F0ZV0pO1xyXG5cclxuICAgIGlmICghb3JkZXJJZCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGRpc3BsYXlHaWZ0ID0gdW5sb2NrZWRHaWZ0IHx8IGdpZnQ7XHJcbiAgICBjb25zdCBpc1BoeXNpY2FsID0gZ2lmdFR5cGUgPT09ICdwaHlzaWNhbCc7XHJcblxyXG4gICAgLy8gU3RvcmUgcGlja3VwIE9SIG9mZmxpbmUgUVIgcGF5bWVudFxyXG4gICAgY29uc3QgaXNQaWNrdXAgPSBjaGVja291dFR5cGUgPT09ICdwaWNrdXAnIHx8IHRyYWNraW5nID09PSAnU1RPUkUtUElDS1VQJyB8fCBwYXltZW50TWV0aG9kID09PSAnb2ZmbGluZV9xcic7XHJcbiAgICBjb25zdCBpc09mZmxpbmUgPSBwYXltZW50TWV0aG9kID09PSAnb2ZmbGluZV9xcic7XHJcbiAgICBcclxuICAgIC8vIFFSIENvZGUgZGF0YTogcG9pbnQgdG8gYWRtaW4gY29uZmlybSBwaWNrdXAgdmlld1xyXG4gICAgY29uc3QgcXJVcmwgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgXCIvc3RhdGljL2FkbWluL2luZGV4Lmh0bWwjcGlja3VwLXNjYW5uZXI/b3JkZXJJZD1cIiArIG9yZGVySWQ7XHJcbiAgICBjb25zdCBxckltZ1VybCA9IGBodHRwczovL2FwaS5xcnNlcnZlci5jb20vdjEvY3JlYXRlLXFyLWNvZGUvP3NpemU9MjIweDIyMCZjb2xvcj0yYzJjMmMmZGF0YT0ke2VuY29kZVVSSUNvbXBvbmVudChxclVybCl9YDtcclxuXHJcbiAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXYgc3R5bGU9e3twYWRkaW5nOiAnMS41cmVtIDFyZW0gM3JlbScsIG1heFdpZHRoOiAnNjIwcHgnLCBtYXJnaW46ICcwIGF1dG8nLCBtaW5IZWlnaHQ6ICc3NXZoJywgdGV4dEFsaWduOidjZW50ZXInLCB3aWR0aDogJzEwMCUnLCBib3hTaXppbmc6ICdib3JkZXItYm94J319PlxyXG4gICAgICAgICAgICB7LyogQ2VsZWJyYXRpb24gSWNvbiAqL31cclxuICAgICAgICAgICAge2lzT2ZmbGluZSA/IChcclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzc2cHgnLFxyXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogJzc2cHgnLFxyXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzUwJScsXHJcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogJyNGQUYzRUQnLFxyXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgICAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcclxuICAgICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgbWFyZ2luOiAnMCBhdXRvIDFyZW0nLFxyXG4gICAgICAgICAgICAgICAgICAgIGJveFNoYWRvdzogJzAgOHB4IDIwcHggcmdiYSgyMDgsMTM2LDU5LDAuMTIpJ1xyXG4gICAgICAgICAgICAgICAgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjM2XCIgaGVpZ2h0PVwiMzZcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCIjOEY1RTM2XCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjEwXCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlsaW5lIHBvaW50cz1cIjEyIDYgMTIgMTIgMTYgMTRcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICkgOiAoXHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICc3NnB4JyxcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6ICc3NnB4JyxcclxuICAgICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICc1MCUnLFxyXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6ICcjRThGNUU5JyxcclxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICAgICAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxyXG4gICAgICAgICAgICAgICAgICAgIG1hcmdpbjogJzAgYXV0byAxcmVtJyxcclxuICAgICAgICAgICAgICAgICAgICBib3hTaGFkb3c6ICcwIDhweCAyMHB4IHJnYmEoNDYsMTI1LDUwLDAuMTIpJ1xyXG4gICAgICAgICAgICAgICAgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjM2XCIgaGVpZ2h0PVwiMzZcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCIjMkU3RDMyXCIgc3Ryb2tlV2lkdGg9XCIyLjVcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5bGluZSBwb2ludHM9XCIyMCA2IDkgMTcgNCAxMlwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIDxoMSBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgZm9udEZhbWlseTondmFyKC0tZm9udC1oZWFkaW5nKScsIFxyXG4gICAgICAgICAgICAgICAgZm9udFNpemU6ICdjbGFtcCgxLjM1cmVtLCA1dncsIDEuNjVyZW0pJyxcclxuICAgICAgICAgICAgICAgIG1hcmdpbkJvdHRvbTogJzAuNHJlbScsIFxyXG4gICAgICAgICAgICAgICAgY29sb3I6ICcjMkQyQTI2JyxcclxuICAgICAgICAgICAgICAgIGxldHRlclNwYWNpbmc6ICctMC4wMWVtJyxcclxuICAgICAgICAgICAgICAgIGxpbmVIZWlnaHQ6ICcxLjI1J1xyXG4gICAgICAgICAgICB9fT5cclxuICAgICAgICAgICAgICAgIHtpc09mZmxpbmUgPyBcIkJvdXRpcXVlIE9yZGVyIFJlc2VydmVkIVwiIDogXCJPcmRlciBQbGFjZWQgU3VjY2Vzc2Z1bGx5IVwifVxyXG4gICAgICAgICAgICA8L2gxPlxyXG4gICAgICAgICAgICA8cCBzdHlsZT17e2ZvbnRTaXplOiAnMC44OHJlbScsIGNvbG9yOiAnIzZDNjg2MycsIG1hcmdpbkJvdHRvbTogJzEuNXJlbScsIHBhZGRpbmc6ICcwIDAuNXJlbSd9fT5UaGFuayB5b3UgZm9yIGNob29zaW5nIGx1eHVyeSwgY3VzdG9tIEluZG8tV2VzdGVybiBhZXN0aGV0aWNzLjwvcD5cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgIHBhZGRpbmc6ICcxLjc1cmVtIDFyZW0gMS41cmVtJywgXHJcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjZmZmJywgXHJcbiAgICAgICAgICAgICAgICBib3JkZXI6ICcxLjVweCBzb2xpZCAjRTZFNEUwJywgXHJcbiAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICcyMHB4JywgXHJcbiAgICAgICAgICAgICAgICBtYXJnaW46ICcxLjc1cmVtIDAgMS4yNXJlbScsXHJcbiAgICAgICAgICAgICAgICBib3hTaGFkb3c6ICcwIDhweCAzMHB4IHJnYmEoMCwwLDAsMC4wMjUpJyxcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxyXG4gICAgICAgICAgICAgICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXHJcbiAgICAgICAgICAgICAgICBtYXhXaWR0aDogJzEwMCUnXHJcbiAgICAgICAgICAgIH19PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxyXG4gICAgICAgICAgICAgICAgICAgIHRvcDogJy0xMnB4JyxcclxuICAgICAgICAgICAgICAgICAgICBsZWZ0OiAnNTAlJyxcclxuICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKC01MCUpJyxcclxuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiAnI0Q0QTM3MycsXHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjZmZmJyxcclxuICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAnNHB4IDE2cHgnLFxyXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzIwcHgnLFxyXG4gICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAnMC43MnJlbScsXHJcbiAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogJzcwMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZScsXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZzogJzAuMDhlbScsXHJcbiAgICAgICAgICAgICAgICAgICAgd2hpdGVTcGFjZTogJ25vd3JhcCcsXHJcbiAgICAgICAgICAgICAgICAgICAgekluZGV4OiAyXHJcbiAgICAgICAgICAgICAgICB9fT5cclxuICAgICAgICAgICAgICAgICAgICBCb3V0aXF1ZSBSZWNlaXB0XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICB7LyogUmVzcG9uc2l2ZSBPcmRlciBSZWZlcmVuY2UgUGlsbCAqL31cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgXHJcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogJ2lubGluZS1mbGV4JywgXHJcbiAgICAgICAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsIFxyXG4gICAgICAgICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJywgXHJcbiAgICAgICAgICAgICAgICAgICAgZ2FwOiAnMC40cmVtIDAuNXJlbScsIFxyXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJyNGQUY0RUUnLCBcclxuICAgICAgICAgICAgICAgICAgICBib3JkZXI6ICcxLjVweCBkYXNoZWQgI0Q0QTM3MycsIFxyXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzI0cHgnLCBcclxuICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAnMC41NXJlbSAwLjlyZW0nLCBcclxuICAgICAgICAgICAgICAgICAgICBtYXJnaW5Ub3A6ICcwLjZyZW0nLCBcclxuICAgICAgICAgICAgICAgICAgICBtYXJnaW5Cb3R0b206ICcxLjVyZW0nLCBcclxuICAgICAgICAgICAgICAgICAgICBib3hTaGFkb3c6ICcwIDRweCAxNXB4IHJnYmEoMjEyLDE2MywxMTUsMC4wNiknLCBcclxuICAgICAgICAgICAgICAgICAgICBtYXhXaWR0aDogJzEwMCUnLCBcclxuICAgICAgICAgICAgICAgICAgICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcclxuICAgICAgICAgICAgICAgICAgICBmbGV4V3JhcDogJ3dyYXAnXHJcbiAgICAgICAgICAgICAgICB9fT5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250U2l6ZTogJzAuNzVyZW0nLCBjb2xvcjogJyM4RjVFMzYnLCBmb250V2VpZ2h0OiAnNzAwJywgdGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZScsIGxldHRlclNwYWNpbmc6ICcwLjA2ZW0nLCB3aGl0ZVNwYWNlOiAnbm93cmFwJyB9fT5PcmRlciBSZWZlcmVuY2U8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6ICcjRDRBMzczJywgb3BhY2l0eTogMC42LCBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJyB9fT58PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGRpc3BsYXk6ICdpbmxpbmUtZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICcwLjM1cmVtJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHN0cm9uZyBzdHlsZT17eyBmb250U2l6ZTogJ2NsYW1wKDAuODVyZW0sIDMuOHZ3LCAxLjA1cmVtKScsIGZvbnRGYW1pbHk6ICdtb25vc3BhY2UnLCBjb2xvcjogJyMyRDJBMjYnLCBsZXR0ZXJTcGFjaW5nOiAnMC4wM2VtJywgd29yZEJyZWFrOiAnYnJlYWstYWxsJyB9fT4je29yZGVySWR9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxDb3B5QnV0dG9uIHRleHQ9e29yZGVySWR9IGljb25Pbmx5PXt0cnVlfSBzdHlsZT17eyBwYWRkaW5nOiAnNHB4IDZweCcsIGJvcmRlclJhZGl1czogJzUwJScsIGJvcmRlcjogJzFweCBzb2xpZCAjRTZEOEM4JywgYmFja2dyb3VuZENvbG9yOiAnI0ZGRicsIGZsZXhTaHJpbms6IDAgfX0gLz5cclxuICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgPHAgc3R5bGU9e3tmb250U2l6ZTonMC45MnJlbScsIGNvbG9yOiAnIzVDNTg1NCcsIGxpbmVIZWlnaHQ6ICcxLjYnLCBtYXJnaW46ICcwIDAgMS41cmVtJywgcGFkZGluZzogJzAgMC4yNXJlbSd9fT5cclxuICAgICAgICAgICAgICAgICAgICB7aXNPZmZsaW5lIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA/IGBQbGVhc2UgcHJlc2VudCB0aGUgdmVyaWZpY2F0aW9uIHBhc3MgUVIgY29kZSBiZWxvdyBhdCB0aGUgcmVjZXB0aW9uIGNvdW50ZXIgdG8gZmluYWxpemUgcGF5bWVudHMgb2Yg4oK5JHsoYW1vdW50IHx8IDApLnRvTG9jYWxlU3RyaW5nKCdlbi1JTicpfSBhbmQgY29sbGVjdCB5b3VyIGJlc3Bva2Uga3VydGhpIGdhcm1lbnRzLmAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDogaXNQaWNrdXAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgID8gXCJZb3VyIGJvdXRpcXVlIGNvbGxlY3Rpb24gY2hlY2tvdXQgaXMgY29tcGxldGUgYW5kIGZ1bGx5IHBhaWQuIEtlZXAgdGhpcyBjb2RlIGhhbmR5IGZvciBzY2FubmluZyBhdCB0aGUgcmV0YWlsIGNoZWNrb3V0LlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDogdHJhY2tpbmcgJiYgKHRyYWNraW5nLnN0YXJ0c1dpdGgoJ1JBUElETy1JTlNUQU5ULScpIHx8IHRyYWNraW5nLnN0YXJ0c1dpdGgoJ1VCRVItSU5TVEFOVC0nKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgPyBcIlJlZ2lzdGVyZWQgZm9yIGRpcmVjdCBpbnN0YW50IGNvdXJpZXIgc2hpcHBpbmcuIFlvdXIgZGVzaWduZXIgc3R5bGVzIGFyZSBwcmVwYXJlZCwgc3RlYW1lZCwgYW5kIGRpc3BhdGNoZWQgZnJvbSBKdWJpbGVlIEhpbGxzIHZpYSBkaXJlY3QgY291cmllci5cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA6IFwiWW91ciBkZXNpZ25lciBwYWNrYWdpbmcgaXMgcmVhZHkgYW5kIGhhbmRlZCBvdmVyIHRvIGV4cHJlc3MgZGVsaXZlcnkgdHJhY2tlcnMgZm9yIHByb21wdCBkaXNwYXRjaCB0byB5b3VyIHdhcmRyb2JlLlwiXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgPC9wPlxyXG5cclxuICAgICAgICAgICAgICAgIHsvKiBTaG93IFFSIENvZGUgZm9yIEluLVN0b3JlIFBpY2t1cCAqL31cclxuICAgICAgICAgICAgICAgIHtpc1BpY2t1cCAmJiAoXHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW5Ub3A6ICcxLjI1cmVtJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogJzEuNHJlbSAxcmVtJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogJyNGQUY5RjYnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3JkZXI6ICcycHggc29saWQgI0Q0QTM3MycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzE2cHgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWF4V2lkdGg6ICcxMDAlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJveFNoYWRvdzogJzAgOHB4IDIwcHggcmdiYSgyMTIsMTYzLDExNSwwLjA4KSdcclxuICAgICAgICAgICAgICAgICAgICB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHAgc3R5bGU9e3ttYXJnaW46ICcwIDAgMXJlbScsIGZvbnRTaXplOiAnMC43OHJlbScsIGNvbG9yOiAnIzhGNUUzNicsIGZvbnRXZWlnaHQ6ICc3MDAnLCB0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJywgbGV0dGVyU3BhY2luZzogJzAuMDhlbSd9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEJvdXRpcXVlIFZlcmlmaWNhdGlvbiBTY2FubmVyIFBhc3NcclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAnOHB4JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6ICcjZmZmJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzEycHgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgI0U2RTRFMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXhXaWR0aDogJzEwMCUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW1nIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyYz17cXJJbWdVcmx9IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsdD1cIk9yZGVyIFBpY2t1cCBQYXNzXCIgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3t3aWR0aDogJzE4MHB4JywgaGVpZ2h0OiAnMTgwcHgnLCBtYXhXaWR0aDogJzEwMCUnLCBoZWlnaHQ6ICdhdXRvJywgZGlzcGxheTogJ2Jsb2NrJywgbWFyZ2luOiAnMCBhdXRvJ319XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiAnaW5saW5lLWZsZXgnLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2FwOiAnMC41cmVtJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW5Ub3A6ICcxcmVtJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjRkZGJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXI6ICcxcHggZGFzaGVkICNENEEzNzMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzI0cHgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6ICcwLjQ1cmVtIDFyZW0nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1heFdpZHRoOiAnMTAwJScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmxleFdyYXA6ICd3cmFwJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZGlzcGxheTogJ2lubGluZS1mbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGdhcDogJzAuMzVyZW0nIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Ryb25nIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogJ2NsYW1wKDAuODVyZW0sIDMuOHZ3LCAxLjA1cmVtKScsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogJ21vbm9zcGFjZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMyRDJBMjYnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZzogJzAuMDRlbScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3b3JkQnJlYWs6ICdicmVhay1hbGwnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI3tvcmRlcklkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3N0cm9uZz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPENvcHlCdXR0b24gdGV4dD17b3JkZXJJZH0gaWNvbk9ubHk9e3RydWV9IHN0eWxlPXt7IHBhZGRpbmc6ICc0cHggN3B4JywgYm9yZGVyUmFkaXVzOiAnNTAlJywgYm9yZGVyOiAnMXB4IHNvbGlkICNFNkQ4QzgnLCBmbGV4U2hyaW5rOiAwIH19IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgKX1cclxuXHJcbiAgICAgICAgICAgICAgICB7LyogU3RhbmRhcmQgU2hpcHBpbmcgVHJhY2tpbmcgY29kZSAqL31cclxuICAgICAgICAgICAgICAgIHshaXNQaWNrdXAgJiYgdHJhY2tpbmcgJiYgKFxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luVG9wOiAnMS4yNXJlbScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6ICcwLjY1cmVtIDFyZW0nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiAnI0ZBRjlGNicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlcjogJzEuNXB4IGRhc2hlZCAjRDRBMzczJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnMjRweCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdpbmxpbmUtZmxleCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdhcDogJzAuNHJlbSAwLjZyZW0nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmbGV4V3JhcDogJ3dyYXAnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXhXaWR0aDogJzEwMCUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3hTaXppbmc6ICdib3JkZXItYm94J1xyXG4gICAgICAgICAgICAgICAgICAgIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250U2l6ZTogJzAuOHJlbScsIGNvbG9yOiAnIzZDNjg2MycsIGZvbnRXZWlnaHQ6ICc1MDAnLCB3aGl0ZVNwYWNlOiAnbm93cmFwJyB9fT5DYXJyaWVyIFdheWJpbGwgSUQ6PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBkaXNwbGF5OiAnaW5saW5lLWZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgZ2FwOiAnMC4zNXJlbScgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Ryb25nIHN0eWxlPXt7IGZvbnRTaXplOiAnY2xhbXAoMC44NXJlbSwgMy44dncsIDEuMDVyZW0pJywgY29sb3I6ICcjOEY1RTM2JywgZm9udEZhbWlseTogJ21vbm9zcGFjZScsIGxldHRlclNwYWNpbmc6ICcwLjA0ZW0nLCB3b3JkQnJlYWs6ICdicmVhay1hbGwnIH19Pnt0cmFja2luZ308L3N0cm9uZz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxDb3B5QnV0dG9uIHRleHQ9e3RyYWNraW5nfSBpY29uT25seT17dHJ1ZX0gc3R5bGU9e3sgcGFkZGluZzogJzRweCA3cHgnLCBib3JkZXJSYWRpdXM6ICc1MCUnLCBib3JkZXI6ICcxcHggc29saWQgI0U2RDhDOCcsIGJhY2tncm91bmRDb2xvcjogJyNGRkYnLCBmbGV4U2hyaW5rOiAwIH19IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICl9XHJcblxyXG4gICAgICAgICAgICAgICAge2Rpc3BsYXlHaWZ0ICYmIChcclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpblRvcDogJzEuNzVyZW0nLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogJzEuNHJlbSAxcmVtJywgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlcjogJzEuNXB4IHNvbGlkICNGRkU1RDknLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnI0ZBRjNFRCcsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICcxNnB4JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm94U2hhZG93OiAnMCA2cHggMjBweCByZ2JhKDIxMiwxNjMsMTE1LDAuMDYpJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWF4V2lkdGg6ICcxMDAlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCdcclxuICAgICAgICAgICAgICAgICAgICB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAge2lzUGh5c2ljYWwgPyAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoNCBzdHlsZT17e2NvbG9yOiAnIzhGNUUzNicsIG1hcmdpbjogJzAgMCAwLjRyZW0nLCBmb250RmFtaWx5OiAndmFyKC0tZm9udC1oZWFkaW5nKScsIGZvbnRTaXplOiAnMS4ycmVtJywgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLCBnYXA6ICc4cHgnfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCIyMFwiIGhlaWdodD1cIjIwXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiIHN0eWxlPXt7Y29sb3I6ICcjOEY1RTM2J319PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlsaW5lIHBvaW50cz1cIjIwIDEyIDIwIDIyIDQgMjIgNCAxMlwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmVjdCB4PVwiMlwiIHk9XCI3XCIgd2lkdGg9XCIyMFwiIGhlaWdodD1cIjVcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9XCIxMlwiIHkxPVwiMjJcIiB4Mj1cIjEyXCIgeTI9XCI3XCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMTIgN0g3LjVhMi41IDIuNSAwIDAgMSAwLTVDMTEgMiAxMiA3IDEyIDd6XCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMTIgN2g0LjVhMi41IDIuNSAwIDAgMCAwLTVDMTMgMiAxMiA3IDEyIDd6XCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEZyZWUgR2lmdCBHYWluZWQhXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9oND5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBzdHlsZT17e21hcmdpbjowLCBmb250U2l6ZTonMC44OHJlbScsIGNvbG9yOiAnIzZDNjg2MycsIGxpbmVIZWlnaHQ6ICcxLjUnfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEEgY29tcGxpbWVudGFyeSBiZXNwb2tlIDxzdHJvbmc+e2Rpc3BsYXlHaWZ0fTwvc3Ryb25nPiBoYXMgYmVlbiBjb250cmlidXRlZCB0byB5b3VyIHBhY2thZ2UgYW5kIHdpbGwgZGlzcGF0Y2ggaW4gdGhlIHNhbWUgY2FydG9uIVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDQgc3R5bGU9e3tjb2xvcjogJyM4RjVFMzYnLCBtYXJnaW46ICcwIDAgMC40cmVtJywgZm9udEZhbWlseTogJ3ZhcigtLWZvbnQtaGVhZGluZyknLCBmb250U2l6ZTogJzEuMnJlbScsIGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJywgZ2FwOiAnOHB4J319PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3ZnIHdpZHRoPVwiMjBcIiBoZWlnaHQ9XCIyMFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIiBzdHlsZT17e2NvbG9yOiAnIzhGNUUzNid9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMTIgM3YxbTAgMTZ2MW05LTloLTFNNCAxMkgzbTE1LjM2NC02LjM2NGwtLjcwNy43MDdNNi4zNDMgMTcuNjU3bC0uNzA3LjcwN20wLTEyLjcyOGwuNzA3LjcwN20xMS4zMTQgMTEuMzE0bC43MDctLjcwN00xMiA4YTQgNCAwIDEgMCAwIDggNCA0IDAgMCAwIDAtOHpcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmV3YXJkIENvdXBvbiBVbmxvY2tlZCFcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2g0PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdpbmxpbmUtZmxleCcsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJywgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJywgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdhcDogJzAuNXJlbScsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjRkZGJywgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlcjogJzFweCBkYXNoZWQgI0Q0QTM3MycsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICcyNHB4JywgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6ICcwLjQ1cmVtIDFyZW0nLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luVG9wOiAnMC42cmVtJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4V2lkdGg6ICcxMDAlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsZXhXcmFwOiAnd3JhcCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHN0cm9uZyBzdHlsZT17eyBmb250U2l6ZTogJ2NsYW1wKDAuODVyZW0sIDMuOHZ3LCAxLjA1cmVtKScsIGZvbnRGYW1pbHk6ICdtb25vc3BhY2UnLCBjb2xvcjogJyM4RjVFMzYnLCBsZXR0ZXJTcGFjaW5nOiAnMC4wNmVtJywgd29yZEJyZWFrOiAnYnJlYWstYWxsJyB9fT57ZGlzcGxheUdpZnR9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxDb3B5QnV0dG9uIHRleHQ9e2Rpc3BsYXlHaWZ0fSBpY29uT25seT17dHJ1ZX0gc3R5bGU9e3sgcGFkZGluZzogJzRweCA3cHgnLCBib3JkZXJSYWRpdXM6ICc1MCUnLCBib3JkZXI6ICcxcHggc29saWQgI0U2RDhDOCcsIGZsZXhTaHJpbms6IDAgfX0gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Z2lmdEV4cGlyeURhdGUgJiYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IG1hcmdpblRvcDogJzAuNzVyZW0nIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogJzAuNzJyZW0nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnI0I4MzIzMicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogJzcwMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnI0ZGRjJGMicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogJzRweCAxMnB4JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICcyMHB4JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOiAnMC4wNWVtJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVmFsaWQgVW50aWw6IHtuZXcgRGF0ZShnaWZ0RXhwaXJ5RGF0ZSkudG9Mb2NhbGVEYXRlU3RyaW5nKHVuZGVmaW5lZCwgeyBkYXRlU3R5bGU6ICdsb25nJyB9KX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICA8TGluayB0bz1cIi9cIiBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnlcIiBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgcGFkZGluZzogJzAuODVyZW0gMi4ycmVtJywgXHJcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogJzAuOTVyZW0nLCBcclxuICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6ICc2MDAnLFxyXG4gICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnNTBweCcsXHJcbiAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOiAnMC4wMmVtJyxcclxuICAgICAgICAgICAgICAgIGJveFNoYWRvdzogJzAgNnB4IDIwcHggcmdiYSg0NSw0MiwzOCwwLjEpJyxcclxuICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxyXG4gICAgICAgICAgICAgICAgbWF4V2lkdGg6ICcxMDAlJyxcclxuICAgICAgICAgICAgICAgIGJveFNpemluZzogJ2JvcmRlci1ib3gnXHJcbiAgICAgICAgICAgIH19PlJldHVybiB0byBTdG9yZWZyb250PC9MaW5rPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IENoZWNrb3V0U3VjY2VzcztcclxuIl19