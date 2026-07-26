import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/pages/Cart.jsx");const React = __vite__cjsImport0_react; const useState = __vite__cjsImport0_react["useState"]; const useEffect = __vite__cjsImport0_react["useEffect"];const _jsxDEV = __vite__cjsImport5_react_jsxDevRuntime["jsxDEV"]; const _Fragment = __vite__cjsImport5_react_jsxDevRuntime["Fragment"];import __vite__cjsImport0_react from "/node_modules/.vite/deps/react.js?v=42a9b196";
import { Link, useNavigate } from "/node_modules/.vite/deps/react-router-dom.js?v=42a9b196";
import Checkout from "/src/pages/Checkout.jsx";
import AuthRequiredModal from "/src/components/AuthRequiredModal.jsx";
import { API_BASE_URL } from "/src/data/config.jsx";
var _jsxFileName = "D:/The Ethnic Touch/frontend/src/pages/Cart.jsx";
import __vite__cjsImport5_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=42a9b196";
var _s = $RefreshSig$();
const Cart = ({ cart, updateQuantity, removeFromCart, onApplyCoupon, discount, authUser }) => {
	_s();
	const navigate = useNavigate();
	const [couponCode, setCouponCode] = useState("");
	const [msg, setMsg] = useState("");
	const defaultGiftTiers = [
		{
			id: 1,
			name: "Bronze Gift",
			threshold: 3e3,
			rewardType: "physical",
			physicalName: "Premium Leather Keychain"
		},
		{
			id: 2,
			name: "Silver Gift",
			threshold: 5e3,
			rewardType: "coupon",
			discountType: "percentage",
			discountValue: 15,
			couponFormat: "GFT-SLVR-[RAND]"
		},
		{
			id: 3,
			name: "Gold Gift",
			threshold: 1e4,
			rewardType: "coupon",
			discountType: "fixed",
			discountValue: 2e3,
			couponFormat: "GFT-GOLD-[RAND]"
		},
		{
			id: 4,
			name: "Platinum Gift",
			threshold: 15e3,
			rewardType: "coupon",
			discountType: "percentage",
			discountValue: 25,
			couponFormat: "GFT-PLAT-[RAND]"
		}
	];
	const [tiers, setTiers] = useState(defaultGiftTiers);
	const [showAuthModal, setShowAuthModal] = useState(false);
	// Added a safety check (cart || []) just in case cart is ever undefined
	const subtotal = (cart || []).reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
	const finalTotal = subtotal - (discount?.amt || discount?.value || 0);
	useEffect(() => {
		fetch(`${API_BASE_URL}/api/gift-tiers`).then((res) => {
			if (!res.ok) throw new Error("Failed to fetch gift tiers");
			return res.json();
		}).then((data) => {
			if (Array.isArray(data) && data.length > 0) {
				setTiers(data.sort((a, b) => a.threshold - b.threshold));
			}
		}).catch((err) => {
			console.warn("Using default gift tiers:", err);
		});
	}, []);
	const handleCoupon = async () => {
		const cleanCode = (couponCode || "").trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
		if (!cleanCode) {
			setMsg("Please enter a coupon code");
			return;
		}
		try {
			const res = await fetch(`${API_BASE_URL}/api/coupons/validate`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					code: cleanCode,
					total: subtotal
				})
			});
			if (!res.ok) {
				const err = await res.json();
				setMsg(err.error || "Invalid code");
				return;
			}
			const data = await res.json();
			const coupon = data.coupon || data;
			const discountAmount = data.discountAmount !== undefined ? data.discountAmount : coupon.type === "fixed" ? coupon.value : subtotal * coupon.value / 100;
			onApplyCoupon({
				code: coupon.code,
				amt: discountAmount
			});
			setMsg(`Applied: ₹${discountAmount} off!`);
		} catch (err) {
			setMsg("Validation failed");
		}
	};
	// Calculate progression details
	const unlockedTiers = tiers.filter((t) => subtotal >= t.threshold);
	const nextTier = tiers.find((t) => subtotal < t.threshold);
	const activeUnlocked = unlockedTiers.length > 0 ? unlockedTiers[unlockedTiers.length - 1] : null;
	const remaining = nextTier ? nextTier.threshold - subtotal : 0;
	const handleBack = (e) => {
		e.preventDefault();
		if (window.history.state && window.history.state.idx > 0) {
			navigate(-1);
		} else {
			navigate("/shop");
		}
	};
	return /* @__PURE__ */ _jsxDEV("div", {
		className: "cart-page-container",
		style: {
			maxWidth: "1200px",
			margin: "0 auto",
			minHeight: "75vh",
			padding: "1.25rem 5% 3rem"
		},
		children: [
			/* @__PURE__ */ _jsxDEV("a", {
				href: "#",
				onClick: handleBack,
				className: "cart-back-link",
				style: {
					display: "inline-flex",
					alignItems: "center",
					gap: "6px",
					marginBottom: "1rem",
					color: "var(--color-text-light)",
					textDecoration: "none",
					fontSize: "0.85rem",
					fontWeight: "500"
				},
				children: "← Back"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 87,
				columnNumber: 13
			}, this),
			/* @__PURE__ */ _jsxDEV("h1", {
				style: {
					marginBottom: "1rem",
					fontSize: "1.35rem",
					fontFamily: "var(--font-heading)",
					color: "var(--color-text)",
					fontWeight: "400"
				},
				children: [
					"Your Cart (",
					(cart || []).reduce((s, i) => s + (i.quantity || 1), 0),
					")"
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 95,
				columnNumber: 13
			}, this),
			!cart || cart.length === 0 ? /* @__PURE__ */ _jsxDEV("div", {
				style: {
					textAlign: "center",
					padding: "2.5rem 1.5rem",
					backgroundColor: "#FAF6F0",
					borderRadius: "var(--border-radius-lg)",
					border: "1px dashed rgba(212, 163, 115, 0.4)",
					marginTop: "0.5rem",
					maxWidth: "600px",
					margin: "0.5rem auto 0"
				},
				children: [
					/* @__PURE__ */ _jsxDEV("div", {
						style: {
							marginBottom: "0.75rem",
							color: "var(--color-primary)"
						},
						children: /* @__PURE__ */ _jsxDEV("svg", {
							width: "42",
							height: "42",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "1",
							strokeLinecap: "round",
							strokeLinejoin: "round",
							children: [
								/* @__PURE__ */ _jsxDEV("path", { d: "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 103,
									columnNumber: 29
								}, this),
								/* @__PURE__ */ _jsxDEV("line", {
									x1: "3",
									y1: "6",
									x2: "21",
									y2: "6"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 104,
									columnNumber: 29
								}, this),
								/* @__PURE__ */ _jsxDEV("path", { d: "M16 10a4 4 0 0 1-8 0" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 105,
									columnNumber: 29
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 102,
							columnNumber: 25
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 101,
						columnNumber: 21
					}, this),
					/* @__PURE__ */ _jsxDEV("h2", {
						style: {
							fontFamily: "var(--font-heading)",
							fontSize: "1.35rem",
							marginBottom: "0.4rem",
							color: "var(--color-text)"
						},
						children: "Your cart is empty"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 108,
						columnNumber: 21
					}, this),
					/* @__PURE__ */ _jsxDEV("p", {
						style: {
							color: "var(--color-text-light)",
							marginBottom: "1.5rem",
							fontSize: "0.85rem"
						},
						children: "Looks like you haven't added any handcrafted luxury to your cart yet."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 109,
						columnNumber: 21
					}, this),
					/* @__PURE__ */ _jsxDEV(Link, {
						to: "/shop",
						className: "btn btn-primary",
						style: {
							padding: "0.6rem 1.8rem",
							fontSize: "0.85rem",
							borderRadius: "50px"
						},
						children: "Browse Collection"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 110,
						columnNumber: 21
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 100,
				columnNumber: 17
			}, this) : /* @__PURE__ */ _jsxDEV("div", {
				className: "desktop-split-layout cart-layout",
				style: { gap: "1.25rem" },
				children: [/* @__PURE__ */ _jsxDEV("div", {
					style: {
						flex: 1,
						minWidth: "280px"
					},
					children: [/* @__PURE__ */ _jsxDEV("div", {
						style: {
							backgroundColor: "#fff",
							borderRadius: "12px",
							padding: "0.9rem 1.1rem",
							border: "1px solid #f0efee",
							marginBottom: "1rem",
							boxShadow: "0 4px 15px rgba(0,0,0,0.02)"
						},
						children: cart.map((item, idx) => {
							const itemQty = item.quantity || 1;
							const itemTotal = item.price * itemQty;
							return /* @__PURE__ */ _jsxDEV("div", {
								className: "cart-item-row",
								style: {
									display: "flex",
									alignItems: "center",
									gap: "0.85rem",
									marginBottom: idx === cart.length - 1 ? 0 : "0.85rem",
									borderBottom: idx === cart.length - 1 ? "none" : "1px solid #eee",
									paddingBottom: idx === cart.length - 1 ? 0 : "0.85rem",
									flexWrap: "wrap"
								},
								children: [
									/* @__PURE__ */ _jsxDEV("img", {
										src: item.imageUrl,
										alt: item.name,
										style: {
											width: "56px",
											height: "56px",
											borderRadius: "8px",
											objectFit: "cover"
										}
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 122,
										columnNumber: 41
									}, this),
									/* @__PURE__ */ _jsxDEV("div", {
										style: {
											flex: 1,
											minWidth: "140px"
										},
										children: [
											/* @__PURE__ */ _jsxDEV("h3", {
												style: {
													fontFamily: "var(--font-body)",
													fontWeight: "500",
													fontSize: "0.88rem",
													margin: 0
												},
												children: item.name
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 124,
												columnNumber: 45
											}, this),
											item.size && /* @__PURE__ */ _jsxDEV("span", {
												style: {
													display: "inline-block",
													backgroundColor: "#fff0e9",
													color: "#b97a66",
													padding: "0.1rem 0.45rem",
													borderRadius: "4px",
													fontSize: "0.72rem",
													marginTop: "0.15rem",
													fontWeight: "500"
												},
												children: ["Size: ", item.size]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 126,
												columnNumber: 49
											}, this),
											/* @__PURE__ */ _jsxDEV("p", {
												style: {
													color: "var(--color-text-light)",
													fontSize: "0.75rem",
													margin: "0.15rem 0 0"
												},
												children: [item.description?.substring(0, 42), "..."]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 130,
												columnNumber: 45
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 123,
										columnNumber: 41
									}, this),
									/* @__PURE__ */ _jsxDEV("div", {
										className: "cart-quantity-selector",
										style: {
											display: "flex",
											alignItems: "center",
											gap: "0.25rem",
											border: "1px solid #e0e0e0",
											borderRadius: "6px",
											padding: "0.1rem 0.35rem",
											background: "#fbfbfb"
										},
										children: [
											/* @__PURE__ */ _jsxDEV("button", {
												onClick: () => updateQuantity && updateQuantity(idx, itemQty - 1),
												"aria-label": "Decrease quantity",
												title: "Decrease quantity",
												style: {
													width: "22px",
													height: "22px",
													border: "none",
													background: "#eee",
													borderRadius: "4px",
													cursor: "pointer",
													fontWeight: "bold",
													fontSize: "0.8rem",
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
													color: "#333",
													transition: "all 0.2s ease"
												},
												onMouseOver: (e) => e.currentTarget.style.background = "#e0e0e0",
												onMouseOut: (e) => e.currentTarget.style.background = "#eee",
												children: "-"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 135,
												columnNumber: 45
											}, this),
											/* @__PURE__ */ _jsxDEV("span", {
												style: {
													minWidth: "22px",
													textAlign: "center",
													fontWeight: "600",
													fontSize: "0.82rem",
													userSelect: "none"
												},
												children: itemQty
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 145,
												columnNumber: 45
											}, this),
											/* @__PURE__ */ _jsxDEV("button", {
												onClick: () => updateQuantity && updateQuantity(idx, itemQty + 1),
												"aria-label": "Increase quantity",
												title: "Increase quantity",
												style: {
													width: "22px",
													height: "22px",
													border: "none",
													background: "#eee",
													borderRadius: "4px",
													cursor: "pointer",
													fontWeight: "bold",
													fontSize: "0.8rem",
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
													color: "#333",
													transition: "all 0.2s ease"
												},
												onMouseOver: (e) => e.currentTarget.style.background = "#e0e0e0",
												onMouseOut: (e) => e.currentTarget.style.background = "#eee",
												children: "+"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 148,
												columnNumber: 45
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 134,
										columnNumber: 41
									}, this),
									/* @__PURE__ */ _jsxDEV("div", {
										style: {
											textAlign: "right",
											minWidth: "85px"
										},
										children: [/* @__PURE__ */ _jsxDEV("div", {
											style: {
												fontWeight: "600",
												fontSize: "0.88rem",
												color: "var(--color-text)"
											},
											children: ["₹", itemTotal.toLocaleString("en-IN")]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 162,
											columnNumber: 45
										}, this), itemQty > 1 && /* @__PURE__ */ _jsxDEV("div", {
											style: {
												fontSize: "0.7rem",
												color: "#888",
												marginTop: "1px"
											},
											children: [
												"(₹",
												item.price.toLocaleString("en-IN"),
												" each)"
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 166,
											columnNumber: 49
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 161,
										columnNumber: 41
									}, this),
									/* @__PURE__ */ _jsxDEV("button", {
										onClick: () => removeFromCart && removeFromCart(idx),
										"aria-label": "Delete item from cart",
										title: "Remove item",
										style: {
											background: "none",
											border: "none",
											color: "#d9534f",
											cursor: "pointer",
											padding: "0.25rem",
											borderRadius: "4px",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											transition: "all 0.2s ease"
										},
										onMouseOver: (e) => {
											e.currentTarget.style.backgroundColor = "#fff0f0";
											e.currentTarget.style.color = "#c9302c";
										},
										onMouseOut: (e) => {
											e.currentTarget.style.backgroundColor = "transparent";
											e.currentTarget.style.color = "#d9534f";
										},
										children: /* @__PURE__ */ _jsxDEV("svg", {
											width: "17",
											height: "17",
											viewBox: "0 0 24 24",
											fill: "none",
											stroke: "currentColor",
											strokeWidth: "2",
											strokeLinecap: "round",
											strokeLinejoin: "round",
											children: [
												/* @__PURE__ */ _jsxDEV("polyline", { points: "3 6 5 6 21 6" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 193,
													columnNumber: 49
												}, this),
												/* @__PURE__ */ _jsxDEV("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 194,
													columnNumber: 49
												}, this),
												/* @__PURE__ */ _jsxDEV("line", {
													x1: "10",
													y1: "11",
													x2: "10",
													y2: "17"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 195,
													columnNumber: 49
												}, this),
												/* @__PURE__ */ _jsxDEV("line", {
													x1: "14",
													y1: "11",
													x2: "14",
													y2: "17"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 196,
													columnNumber: 49
												}, this)
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 192,
											columnNumber: 45
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 173,
										columnNumber: 41
									}, this)
								]
							}, idx, true, {
								fileName: _jsxFileName,
								lineNumber: 121,
								columnNumber: 37
							}, this);
						})
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 116,
						columnNumber: 25
					}, this), tiers.length > 0 && /* @__PURE__ */ _jsxDEV("div", {
						className: "gift-system-card",
						style: {
							padding: "1.25rem",
							borderRadius: "12px",
							marginBottom: "1rem",
							marginTop: "0"
						},
						children: [
							/* @__PURE__ */ _jsxDEV("h3", {
								className: "gift-system-title",
								style: {
									fontSize: "1.05rem",
									marginBottom: "1rem",
									display: "flex",
									alignItems: "center",
									gap: "8px"
								},
								children: [/* @__PURE__ */ _jsxDEV("svg", {
									width: "20",
									height: "20",
									viewBox: "0 0 24 24",
									fill: "none",
									stroke: "var(--color-primary)",
									strokeWidth: "2",
									strokeLinecap: "round",
									strokeLinejoin: "round",
									children: [
										/* @__PURE__ */ _jsxDEV("polyline", { points: "20 12 20 22 4 22 4 12" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 209,
											columnNumber: 41
										}, this),
										/* @__PURE__ */ _jsxDEV("rect", {
											x: "2",
											y: "7",
											width: "20",
											height: "5"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 210,
											columnNumber: 41
										}, this),
										/* @__PURE__ */ _jsxDEV("line", {
											x1: "12",
											y1: "22",
											x2: "12",
											y2: "7"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 211,
											columnNumber: 41
										}, this),
										/* @__PURE__ */ _jsxDEV("path", { d: "M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 212,
											columnNumber: 41
										}, this),
										/* @__PURE__ */ _jsxDEV("path", { d: "M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 213,
											columnNumber: 41
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 208,
									columnNumber: 37
								}, this), /* @__PURE__ */ _jsxDEV("span", { children: "Exclusive Tiered Rewards" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 215,
									columnNumber: 37
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 207,
								columnNumber: 33
							}, this),
							nextTier ? /* @__PURE__ */ _jsxDEV("div", {
								className: "gift-milestone-banner progress",
								style: {
									padding: "0.6rem 0.8rem",
									borderRadius: "8px",
									marginBottom: "1.25rem"
								},
								children: [/* @__PURE__ */ _jsxDEV("div", {
									style: {
										flex: 1,
										fontSize: "0.8rem"
									},
									children: [
										"Add ",
										/* @__PURE__ */ _jsxDEV("strong", {
											style: { color: "var(--color-primary)" },
											children: ["₹", remaining.toLocaleString("en-IN")]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 221,
											columnNumber: 49
										}, this),
										" more to unlock ",
										/* @__PURE__ */ _jsxDEV("strong", { children: nextTier.name }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 221,
											columnNumber: 158
										}, this),
										"!"
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 220,
									columnNumber: 41
								}, this), /* @__PURE__ */ _jsxDEV("div", {
									style: {
										fontSize: "0.82rem",
										fontWeight: "600",
										color: "var(--color-primary)"
									},
									children: [
										"₹",
										remaining.toLocaleString("en-IN"),
										" away"
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 223,
									columnNumber: 41
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 219,
								columnNumber: 37
							}, this) : /* @__PURE__ */ _jsxDEV("div", {
								className: "gift-milestone-banner unlocked",
								style: {
									padding: "0.6rem 0.8rem",
									borderRadius: "8px",
									marginBottom: "1.25rem",
									display: "flex",
									alignItems: "center",
									gap: "6px"
								},
								children: [/* @__PURE__ */ _jsxDEV("svg", {
									width: "15",
									height: "15",
									viewBox: "0 0 24 24",
									fill: "none",
									stroke: "currentColor",
									strokeWidth: "2.5",
									strokeLinecap: "round",
									strokeLinejoin: "round",
									style: { flexShrink: 0 },
									children: /* @__PURE__ */ _jsxDEV("path", { d: "M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 230,
										columnNumber: 45
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 229,
									columnNumber: 41
								}, this), /* @__PURE__ */ _jsxDEV("div", {
									style: {
										flex: 1,
										fontSize: "0.8rem"
									},
									children: [
										/* @__PURE__ */ _jsxDEV("strong", { children: "Unlocked Top Tier:" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 233,
											columnNumber: 45
										}, this),
										" ",
										/* @__PURE__ */ _jsxDEV("strong", { children: activeUnlocked ? activeUnlocked.name : "" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 233,
											columnNumber: 81
										}, this),
										"!"
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 232,
									columnNumber: 41
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 228,
								columnNumber: 37
							}, this),
							/* @__PURE__ */ _jsxDEV("div", {
								className: "gift-progress-wrapper",
								style: {
									margin: "1.5rem 0 3.5rem",
									height: "40px"
								},
								children: [
									/* @__PURE__ */ _jsxDEV("div", {
										className: "gift-progress-track-bg",
										style: {
											top: "18px",
											height: "5px"
										}
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 240,
										columnNumber: 37
									}, this),
									(() => {
										if (tiers.length === 0) return null;
										const maxThreshold = tiers[tiers.length - 1].threshold;
										const fillPercent = Math.min(100, subtotal / maxThreshold * 100);
										return /* @__PURE__ */ _jsxDEV("div", {
											className: "gift-progress-track-fill",
											style: {
												width: `${fillPercent}%`,
												top: "18px",
												height: "5px"
											}
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 246,
											columnNumber: 45
										}, this);
									})(),
									/* @__PURE__ */ _jsxDEV("div", {
										className: "gift-nodes-container",
										children: tiers.map((t, index) => {
											const isUnlocked = subtotal >= t.threshold;
											return /* @__PURE__ */ _jsxDEV("div", {
												className: `gift-node ${isUnlocked ? "unlocked" : ""}`,
												children: [
													/* @__PURE__ */ _jsxDEV("div", {
														className: "gift-node-dot",
														style: {
															width: "38px",
															height: "38px",
															fontSize: "0.85rem"
														},
														children: isUnlocked ? /* @__PURE__ */ _jsxDEV("svg", {
															width: "16",
															height: "16",
															viewBox: "0 0 24 24",
															fill: "none",
															stroke: "currentColor",
															strokeWidth: "3",
															strokeLinecap: "round",
															strokeLinejoin: "round",
															children: /* @__PURE__ */ _jsxDEV("polyline", { points: "20 6 9 17 4 12" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 261,
																columnNumber: 65
															}, this)
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 260,
															columnNumber: 61
														}, this) : index + 1
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 258,
														columnNumber: 53
													}, this),
													/* @__PURE__ */ _jsxDEV("div", {
														className: "gift-node-label",
														style: {
															marginTop: "0.5rem",
															fontSize: "0.78rem"
														},
														children: t.name
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 267,
														columnNumber: 53
													}, this),
													/* @__PURE__ */ _jsxDEV("div", {
														className: "gift-node-threshold",
														style: {
															fontSize: "0.72rem",
															marginTop: "0.1rem"
														},
														children: ["₹", t.threshold.toLocaleString("en-IN")]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 270,
														columnNumber: 53
													}, this)
												]
											}, t.id || index, true, {
												fileName: _jsxFileName,
												lineNumber: 257,
												columnNumber: 49
											}, this);
										})
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 253,
										columnNumber: 37
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 239,
								columnNumber: 33
							}, this),
							/* @__PURE__ */ _jsxDEV("div", {
								className: "gift-cards-grid",
								style: {
									marginTop: "1rem",
									gap: "1rem",
									gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))"
								},
								children: tiers.map((t) => {
									const isUnlocked = subtotal >= t.threshold;
									const isActive = activeUnlocked && activeUnlocked.id === t.id;
									let cardStatusClass = "locked";
									if (isActive) cardStatusClass = "active-unlocked";
									else if (isUnlocked) cardStatusClass = "unlocked";
									return /* @__PURE__ */ _jsxDEV("div", {
										className: `gift-reward-card ${cardStatusClass}`,
										style: { padding: "1rem" },
										children: [/* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("h4", {
											style: {
												fontSize: "0.88rem",
												fontWeight: "600",
												marginBottom: "0.4rem",
												color: "#2D2A26"
											},
											children: t.name
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 291,
											columnNumber: 53
										}, this), /* @__PURE__ */ _jsxDEV("p", {
											style: {
												fontSize: "0.78rem",
												color: "#686461",
												margin: "0 0 0.6rem",
												lineHeight: "1.4",
												display: "flex",
												alignItems: "center",
												gap: "5px"
											},
											children: t.rewardType === "physical" ? /* @__PURE__ */ _jsxDEV(_Fragment, { children: [/* @__PURE__ */ _jsxDEV("svg", {
												width: "14",
												height: "14",
												viewBox: "0 0 24 24",
												fill: "none",
												stroke: "currentColor",
												strokeWidth: "2",
												strokeLinecap: "round",
												strokeLinejoin: "round",
												style: { flexShrink: 0 },
												children: [
													/* @__PURE__ */ _jsxDEV("polyline", { points: "20 12 20 22 4 22 4 12" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 298,
														columnNumber: 69
													}, this),
													/* @__PURE__ */ _jsxDEV("rect", {
														x: "2",
														y: "7",
														width: "20",
														height: "5"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 298,
														columnNumber: 111
													}, this),
													/* @__PURE__ */ _jsxDEV("line", {
														x1: "12",
														y1: "22",
														x2: "12",
														y2: "7"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 298,
														columnNumber: 152
													}, this),
													/* @__PURE__ */ _jsxDEV("path", { d: "M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 298,
														columnNumber: 190
													}, this),
													/* @__PURE__ */ _jsxDEV("path", { d: "M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 298,
														columnNumber: 245
													}, this)
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 297,
												columnNumber: 65
											}, this), /* @__PURE__ */ _jsxDEV("span", { children: [
												"Complimentary ",
												/* @__PURE__ */ _jsxDEV("strong", { children: t.physicalName || "Gift Item" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 300,
													columnNumber: 85
												}, this),
												" included with order."
											] }, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 300,
												columnNumber: 65
											}, this)] }, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 296,
												columnNumber: 61
											}, this) : /* @__PURE__ */ _jsxDEV(_Fragment, { children: [/* @__PURE__ */ _jsxDEV("svg", {
												width: "14",
												height: "14",
												viewBox: "0 0 24 24",
												fill: "none",
												stroke: "currentColor",
												strokeWidth: "2",
												strokeLinecap: "round",
												strokeLinejoin: "round",
												style: { flexShrink: 0 },
												children: [/* @__PURE__ */ _jsxDEV("path", { d: "M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 305,
													columnNumber: 69
												}, this), /* @__PURE__ */ _jsxDEV("line", {
													x1: "12",
													y1: "6",
													x2: "12",
													y2: "18",
													strokeDasharray: "2 2"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 305,
													columnNumber: 184
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 304,
												columnNumber: 65
											}, this), /* @__PURE__ */ _jsxDEV("span", { children: [/* @__PURE__ */ _jsxDEV("strong", { children: [t.discountValue, "% OFF"] }, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 307,
												columnNumber: 71
											}, this), " promo coupon generated on checkout."] }, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 307,
												columnNumber: 65
											}, this)] }, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 303,
												columnNumber: 61
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 294,
											columnNumber: 53
										}, this)] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 290,
											columnNumber: 49
										}, this), /* @__PURE__ */ _jsxDEV("div", {
											style: {
												fontSize: "0.72rem",
												color: isUnlocked ? "var(--color-primary)" : "#999",
												fontWeight: "600",
												borderTop: "1px dashed rgba(0,0,0,0.08)",
												paddingTop: "0.4rem"
											},
											children: isUnlocked ? "Unlocked at ₹" + t.threshold.toLocaleString("en-IN") : "Spend ₹" + t.threshold.toLocaleString("en-IN") + " to unlock"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 312,
											columnNumber: 49
										}, this)]
									}, t.id, true, {
										fileName: _jsxFileName,
										lineNumber: 289,
										columnNumber: 45
									}, this);
								})
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 280,
								columnNumber: 33
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 206,
						columnNumber: 29
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 115,
					columnNumber: 21
				}, this), /* @__PURE__ */ _jsxDEV("div", {
					className: "sticky-summary-box",
					style: {
						width: "310px",
						flexShrink: 0,
						padding: "1.25rem",
						backgroundColor: "#FFFdfc",
						borderRadius: "16px",
						border: "1.5px solid rgba(212, 163, 115, 0.35)",
						boxShadow: "0 8px 30px rgba(212, 163, 115, 0.08)"
					},
					children: [
						/* @__PURE__ */ _jsxDEV("h3", {
							style: {
								fontFamily: "var(--font-heading)",
								fontSize: "1.05rem",
								fontWeight: "500",
								marginBottom: "0.85rem",
								color: "#2D2A26",
								letterSpacing: "0.03em",
								borderBottom: "1px solid rgba(212, 163, 115, 0.25)",
								paddingBottom: "0.45rem"
							},
							children: "Order Summary"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 333,
							columnNumber: 25
						}, this),
						/* @__PURE__ */ _jsxDEV("div", {
							style: { marginBottom: "0.85rem" },
							children: [
								/* @__PURE__ */ _jsxDEV("label", {
									style: {
										display: "block",
										fontSize: "0.78rem",
										fontWeight: "600",
										color: "#555",
										marginBottom: "0.35rem"
									},
									children: "Promo / Coupon Code"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 348,
									columnNumber: 29
								}, this),
								/* @__PURE__ */ _jsxDEV("div", {
									style: {
										display: "flex",
										gap: "0.4rem"
									},
									children: [/* @__PURE__ */ _jsxDEV("input", {
										type: "text",
										className: "coupon-input",
										value: couponCode,
										onChange: (e) => setCouponCode(e.target.value),
										placeholder: "e.g. WELCOME10",
										style: {
											padding: "0.4rem 0.65rem",
											border: "1px solid rgba(212, 163, 115, 0.25)",
											borderRadius: "8px",
											flex: 1,
											fontSize: "0.75rem",
											outline: "none",
											height: "34px",
											background: "#FAF7F4"
										}
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 350,
										columnNumber: 33
									}, this), /* @__PURE__ */ _jsxDEV("button", {
										onClick: handleCoupon,
										style: {
											padding: "0 0.85rem",
											borderRadius: "50px",
											fontSize: "0.78rem",
											height: "34px",
											background: "linear-gradient(135deg, #D4A373 0%, #C49363 100%)",
											color: "#FFF",
											border: "none",
											fontWeight: "600",
											cursor: "pointer",
											boxShadow: "0 3px 10px rgba(212, 163, 115, 0.2)"
										},
										children: "Apply"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 358,
										columnNumber: 33
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 349,
									columnNumber: 29
								}, this),
								msg && /* @__PURE__ */ _jsxDEV("p", {
									style: {
										marginTop: "0.3rem",
										fontSize: "0.75rem",
										color: msg.includes("Applied") ? "#2E7D32" : "#D32F2F",
										fontWeight: "500"
									},
									children: msg
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 376,
									columnNumber: 37
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 347,
							columnNumber: 25
						}, this),
						/* @__PURE__ */ _jsxDEV("div", {
							style: {
								borderTop: "1px solid rgba(212, 163, 115, 0.2)",
								paddingTop: "0.75rem",
								display: "flex",
								flexDirection: "column",
								gap: "0.5rem",
								fontSize: "0.82rem"
							},
							children: [
								/* @__PURE__ */ _jsxDEV("div", {
									style: {
										display: "flex",
										justifyContent: "space-between",
										color: "#6C6863"
									},
									children: [/* @__PURE__ */ _jsxDEV("span", { children: "Bag Subtotal" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 381,
										columnNumber: 33
									}, this), /* @__PURE__ */ _jsxDEV("span", {
										style: {
											fontWeight: "600",
											color: "#2D2A26"
										},
										children: ["₹", subtotal.toLocaleString("en-IN")]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 382,
										columnNumber: 33
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 380,
									columnNumber: 29
								}, this),
								discount && /* @__PURE__ */ _jsxDEV("div", {
									style: {
										display: "flex",
										justifyContent: "space-between",
										color: "#2E7D32",
										fontWeight: "500"
									},
									children: [/* @__PURE__ */ _jsxDEV("span", { children: [
										"Discount (",
										discount.code,
										")"
									] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 386,
										columnNumber: 37
									}, this), /* @__PURE__ */ _jsxDEV("span", { children: ["-₹", discount.amt.toLocaleString("en-IN")] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 387,
										columnNumber: 37
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 385,
									columnNumber: 33
								}, this),
								/* @__PURE__ */ _jsxDEV("div", {
									style: {
										display: "flex",
										justifyContent: "space-between",
										color: "#6C6863"
									},
									children: [/* @__PURE__ */ _jsxDEV("span", { children: "Estimated Shipping" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 391,
										columnNumber: 33
									}, this), /* @__PURE__ */ _jsxDEV("span", {
										style: {
											color: "#2E7D32",
											fontWeight: "600"
										},
										children: "FREE"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 392,
										columnNumber: 33
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 390,
									columnNumber: 29
								}, this),
								/* @__PURE__ */ _jsxDEV("div", {
									style: {
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
										borderTop: "1px dashed rgba(212, 163, 115, 0.35)",
										paddingTop: "0.65rem",
										marginTop: "0.3rem"
									},
									children: [/* @__PURE__ */ _jsxDEV("span", {
										style: {
											fontWeight: 600,
											color: "#2D2A26",
											fontSize: "0.92rem"
										},
										children: "Total Amount"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 396,
										columnNumber: 33
									}, this), /* @__PURE__ */ _jsxDEV("span", {
										style: {
											fontSize: "1.1rem",
											fontWeight: 700,
											color: "#8F5E36",
											fontFamily: "var(--font-body)"
										},
										children: ["₹", finalTotal.toLocaleString("en-IN")]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 397,
										columnNumber: 33
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 395,
									columnNumber: 29
								}, this),
								/* @__PURE__ */ _jsxDEV("button", {
									type: "button",
									onClick: () => {
										if (!authUser) {
											setShowAuthModal(true);
										} else {
											navigate("/checkout");
										}
									},
									style: {
										width: "100%",
										height: "38px",
										padding: "0",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										marginTop: "0.85rem",
										borderRadius: "50px",
										fontSize: "0.85rem",
										fontWeight: "600",
										cursor: "pointer",
										border: "none",
										background: "linear-gradient(135deg, #D4A373 0%, #C49363 100%)",
										color: "#FFF",
										boxShadow: "0 4px 15px rgba(212, 163, 115, 0.25)",
										transition: "all 0.3s ease"
									},
									children: "Proceed to Checkout →"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 400,
									columnNumber: 29
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 379,
							columnNumber: 25
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 324,
					columnNumber: 21
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 113,
				columnNumber: 17
			}, this),
			/* @__PURE__ */ _jsxDEV(AuthRequiredModal, {
				isOpen: showAuthModal,
				onClose: () => setShowAuthModal(false),
				redirectPath: "/checkout"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 436,
				columnNumber: 13
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 86,
		columnNumber: 9
	}, this);
};
_s(Cart, "ryqvwM9tw+RvoexiC7CeQtzClkU=", false, function() {
	return [useNavigate];
});
_c = Cart;
export default Cart;
var _c;
$RefreshReg$(_c, "Cart");
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;
import * as __vite_react_currentExports from "/src/pages/Cart.jsx";
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }

  const currentExports = __vite_react_currentExports;
  queueMicrotask(() => {
    RefreshRuntime.registerExportsForReactRefresh("D:/The Ethnic Touch/frontend/src/pages/Cart.jsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("D:/The Ethnic Touch/frontend/src/pages/Cart.jsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
function $RefreshReg$(type, id) { return RefreshRuntime.register(type, "D:/The Ethnic Touch/frontend/src/pages/Cart.jsx" + ' ' + id); }
function $RefreshSig$() { return RefreshRuntime.createSignatureFunctionForTransform(); }

//# sourceMappingURL=data:application/json;base64,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QyxjQUFhO0dBQ2hCOzs7OztFQUNBOzs7Ozs7QUFFYjs7Ozs7QUFFQSxlQUFlIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIkNhcnQuanN4Il0sInZlcnNpb24iOjMsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgTGluaywgdXNlTmF2aWdhdGUgfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJztcbmltcG9ydCBDaGVja291dCBmcm9tICcuL0NoZWNrb3V0JztcbmltcG9ydCBBdXRoUmVxdWlyZWRNb2RhbCBmcm9tICcuLi9jb21wb25lbnRzL0F1dGhSZXF1aXJlZE1vZGFsJztcbmltcG9ydCB7IEFQSV9CQVNFX1VSTCB9IGZyb20gJy4uL2RhdGEvY29uZmlnJztcblxuY29uc3QgQ2FydCA9ICh7IGNhcnQsIHVwZGF0ZVF1YW50aXR5LCByZW1vdmVGcm9tQ2FydCwgb25BcHBseUNvdXBvbiwgZGlzY291bnQsIGF1dGhVc2VyIH0pID0+IHtcbiAgICBjb25zdCBuYXZpZ2F0ZSA9IHVzZU5hdmlnYXRlKCk7XG4gICAgY29uc3QgW2NvdXBvbkNvZGUsIHNldENvdXBvbkNvZGVdID0gdXNlU3RhdGUoJycpO1xuICAgIGNvbnN0IFttc2csIHNldE1zZ10gPSB1c2VTdGF0ZSgnJyk7XG4gICAgY29uc3QgZGVmYXVsdEdpZnRUaWVycyA9IFtcbiAgICAgICAgeyBpZDogMSwgbmFtZTogJ0Jyb256ZSBHaWZ0JywgdGhyZXNob2xkOiAzMDAwLCByZXdhcmRUeXBlOiAncGh5c2ljYWwnLCBwaHlzaWNhbE5hbWU6ICdQcmVtaXVtIExlYXRoZXIgS2V5Y2hhaW4nIH0sXG4gICAgICAgIHsgaWQ6IDIsIG5hbWU6ICdTaWx2ZXIgR2lmdCcsIHRocmVzaG9sZDogNTAwMCwgcmV3YXJkVHlwZTogJ2NvdXBvbicsIGRpc2NvdW50VHlwZTogJ3BlcmNlbnRhZ2UnLCBkaXNjb3VudFZhbHVlOiAxNSwgY291cG9uRm9ybWF0OiAnR0ZULVNMVlItW1JBTkRdJyB9LFxuICAgICAgICB7IGlkOiAzLCBuYW1lOiAnR29sZCBHaWZ0JywgdGhyZXNob2xkOiAxMDAwMCwgcmV3YXJkVHlwZTogJ2NvdXBvbicsIGRpc2NvdW50VHlwZTogJ2ZpeGVkJywgZGlzY291bnRWYWx1ZTogMjAwMCwgY291cG9uRm9ybWF0OiAnR0ZULUdPTEQtW1JBTkRdJyB9LFxuICAgICAgICB7IGlkOiA0LCBuYW1lOiAnUGxhdGludW0gR2lmdCcsIHRocmVzaG9sZDogMTUwMDAsIHJld2FyZFR5cGU6ICdjb3Vwb24nLCBkaXNjb3VudFR5cGU6ICdwZXJjZW50YWdlJywgZGlzY291bnRWYWx1ZTogMjUsIGNvdXBvbkZvcm1hdDogJ0dGVC1QTEFULVtSQU5EXScgfVxuICAgIF07XG5cbiAgICBjb25zdCBbdGllcnMsIHNldFRpZXJzXSA9IHVzZVN0YXRlKGRlZmF1bHRHaWZ0VGllcnMpO1xuICAgIGNvbnN0IFtzaG93QXV0aE1vZGFsLCBzZXRTaG93QXV0aE1vZGFsXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgICBcbiAgICAvLyBBZGRlZCBhIHNhZmV0eSBjaGVjayAoY2FydCB8fCBbXSkganVzdCBpbiBjYXNlIGNhcnQgaXMgZXZlciB1bmRlZmluZWRcbiAgICBjb25zdCBzdWJ0b3RhbCA9IChjYXJ0IHx8IFtdKS5yZWR1Y2UoKHN1bSwgaXRlbSkgPT4gc3VtICsgKGl0ZW0ucHJpY2UgKiAoaXRlbS5xdWFudGl0eSB8fCAxKSksIDApO1xuICAgIGNvbnN0IGZpbmFsVG90YWwgPSBzdWJ0b3RhbCAtIChkaXNjb3VudD8uYW10IHx8IGRpc2NvdW50Py52YWx1ZSB8fCAwKTtcblxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGZldGNoKGAke0FQSV9CQVNFX1VSTH0vYXBpL2dpZnQtdGllcnNgKVxuICAgICAgICAgICAgLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIXJlcy5vaykgdGhyb3cgbmV3IEVycm9yKCdGYWlsZWQgdG8gZmV0Y2ggZ2lmdCB0aWVycycpO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXMuanNvbigpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGRhdGEpICYmIGRhdGEubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBzZXRUaWVycyhkYXRhLnNvcnQoKGEsIGIpID0+IGEudGhyZXNob2xkIC0gYi50aHJlc2hvbGQpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiVXNpbmcgZGVmYXVsdCBnaWZ0IHRpZXJzOlwiLCBlcnIpO1xuICAgICAgICAgICAgfSk7XG4gICAgfSwgW10pO1xuXG4gICAgY29uc3QgaGFuZGxlQ291cG9uID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCBjbGVhbkNvZGUgPSAoY291cG9uQ29kZSB8fCAnJykudHJpbSgpLnRvVXBwZXJDYXNlKCkucmVwbGFjZSgvW15BLVowLTlfLV0vZywgJycpO1xuICAgICAgICBpZiAoIWNsZWFuQ29kZSkge1xuICAgICAgICAgICAgc2V0TXNnKCdQbGVhc2UgZW50ZXIgYSBjb3Vwb24gY29kZScpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKGAke0FQSV9CQVNFX1VSTH0vYXBpL2NvdXBvbnMvdmFsaWRhdGVgLCB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0sXG4gICAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBjb2RlOiBjbGVhbkNvZGUsIHRvdGFsOiBzdWJ0b3RhbCB9KVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoIXJlcy5vaykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVyciA9IGF3YWl0IHJlcy5qc29uKCk7XG4gICAgICAgICAgICAgICAgc2V0TXNnKGVyci5lcnJvciB8fCAnSW52YWxpZCBjb2RlJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlcy5qc29uKCk7XG4gICAgICAgICAgICBjb25zdCBjb3Vwb24gPSBkYXRhLmNvdXBvbiB8fCBkYXRhO1xuICAgICAgICAgICAgY29uc3QgZGlzY291bnRBbW91bnQgPSBkYXRhLmRpc2NvdW50QW1vdW50ICE9PSB1bmRlZmluZWQgPyBkYXRhLmRpc2NvdW50QW1vdW50IDogKGNvdXBvbi50eXBlID09PSAnZml4ZWQnID8gY291cG9uLnZhbHVlIDogKHN1YnRvdGFsICogY291cG9uLnZhbHVlKSAvIDEwMCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIG9uQXBwbHlDb3Vwb24oeyBjb2RlOiBjb3Vwb24uY29kZSwgYW10OiBkaXNjb3VudEFtb3VudCB9KTtcbiAgICAgICAgICAgIHNldE1zZyhgQXBwbGllZDog4oK5JHtkaXNjb3VudEFtb3VudH0gb2ZmIWApO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHNldE1zZygnVmFsaWRhdGlvbiBmYWlsZWQnKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBDYWxjdWxhdGUgcHJvZ3Jlc3Npb24gZGV0YWlsc1xuICAgIGNvbnN0IHVubG9ja2VkVGllcnMgPSB0aWVycy5maWx0ZXIodCA9PiBzdWJ0b3RhbCA+PSB0LnRocmVzaG9sZCk7XG4gICAgY29uc3QgbmV4dFRpZXIgPSB0aWVycy5maW5kKHQgPT4gc3VidG90YWwgPCB0LnRocmVzaG9sZCk7XG4gICAgY29uc3QgYWN0aXZlVW5sb2NrZWQgPSB1bmxvY2tlZFRpZXJzLmxlbmd0aCA+IDAgPyB1bmxvY2tlZFRpZXJzW3VubG9ja2VkVGllcnMubGVuZ3RoIC0gMV0gOiBudWxsO1xuICAgIGNvbnN0IHJlbWFpbmluZyA9IG5leHRUaWVyID8gbmV4dFRpZXIudGhyZXNob2xkIC0gc3VidG90YWwgOiAwO1xuXG4gICAgY29uc3QgaGFuZGxlQmFjayA9IChlKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgaWYgKHdpbmRvdy5oaXN0b3J5LnN0YXRlICYmIHdpbmRvdy5oaXN0b3J5LnN0YXRlLmlkeCA+IDApIHtcbiAgICAgICAgICAgIG5hdmlnYXRlKC0xKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5hdmlnYXRlKCcvc2hvcCcpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FydC1wYWdlLWNvbnRhaW5lclwiIHN0eWxlPXt7bWF4V2lkdGg6ICcxMjAwcHgnLCBtYXJnaW46ICcwIGF1dG8nLCBtaW5IZWlnaHQ6ICc3NXZoJywgcGFkZGluZzogJzEuMjVyZW0gNSUgM3JlbSd9fT5cbiAgICAgICAgICAgIDxhIFxuICAgICAgICAgICAgICAgIGhyZWY9XCIjXCIgXG4gICAgICAgICAgICAgICAgb25DbGljaz17aGFuZGxlQmFja30gXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2FydC1iYWNrLWxpbmtcIiBcbiAgICAgICAgICAgICAgICBzdHlsZT17eyBkaXNwbGF5OiAnaW5saW5lLWZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgZ2FwOiAnNnB4JywgbWFyZ2luQm90dG9tOiAnMXJlbScsIGNvbG9yOiAndmFyKC0tY29sb3ItdGV4dC1saWdodCknLCB0ZXh0RGVjb3JhdGlvbjogJ25vbmUnLCBmb250U2l6ZTogJzAuODVyZW0nLCBmb250V2VpZ2h0OiAnNTAwJyB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICZsYXJyOyBCYWNrXG4gICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICA8aDEgc3R5bGU9e3ttYXJnaW5Cb3R0b206ICcxcmVtJywgZm9udFNpemU6ICcxLjM1cmVtJywgZm9udEZhbWlseTogJ3ZhcigtLWZvbnQtaGVhZGluZyknLCBjb2xvcjogJ3ZhcigtLWNvbG9yLXRleHQpJywgZm9udFdlaWdodDogJzQwMCd9fT5cbiAgICAgICAgICAgICAgICBZb3VyIENhcnQgKHsoY2FydCB8fCBbXSkucmVkdWNlKChzLCBpKSA9PiBzICsgKGkucXVhbnRpdHkgfHwgMSksIDApfSlcbiAgICAgICAgICAgIDwvaDE+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHshY2FydCB8fCBjYXJ0Lmxlbmd0aCA9PT0gMCA/IChcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHRleHRBbGlnbjogJ2NlbnRlcicsIHBhZGRpbmc6ICcyLjVyZW0gMS41cmVtJywgYmFja2dyb3VuZENvbG9yOiAnI0ZBRjZGMCcsIGJvcmRlclJhZGl1czogJ3ZhcigtLWJvcmRlci1yYWRpdXMtbGcpJywgYm9yZGVyOiAnMXB4IGRhc2hlZCByZ2JhKDIxMiwgMTYzLCAxMTUsIDAuNCknLCBtYXJnaW5Ub3A6ICcwLjVyZW0nLCBtYXhXaWR0aDogJzYwMHB4JywgbWFyZ2luOiAnMC41cmVtIGF1dG8gMCcgfX0+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgbWFyZ2luQm90dG9tOiAnMC43NXJlbScsIGNvbG9yOiAndmFyKC0tY29sb3ItcHJpbWFyeSknIH19PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjQyXCIgaGVpZ2h0PVwiNDJcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjFcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk02IDJMMyA2djE0YTIgMiAwIDAgMCAyIDJoMTRhMiAyIDAgMCAwIDItMlY2bC0zLTR6XCI+PC9wYXRoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaW5lIHgxPVwiM1wiIHkxPVwiNlwiIHgyPVwiMjFcIiB5Mj1cIjZcIj48L2xpbmU+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk0xNiAxMGE0IDQgMCAwIDEtOCAwXCI+PC9wYXRoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8aDIgc3R5bGU9e3sgZm9udEZhbWlseTogJ3ZhcigtLWZvbnQtaGVhZGluZyknLCBmb250U2l6ZTogJzEuMzVyZW0nLCBtYXJnaW5Cb3R0b206ICcwLjRyZW0nLCBjb2xvcjogJ3ZhcigtLWNvbG9yLXRleHQpJyB9fT5Zb3VyIGNhcnQgaXMgZW1wdHk8L2gyPlxuICAgICAgICAgICAgICAgICAgICA8cCBzdHlsZT17eyBjb2xvcjogJ3ZhcigtLWNvbG9yLXRleHQtbGlnaHQpJywgbWFyZ2luQm90dG9tOiAnMS41cmVtJywgZm9udFNpemU6ICcwLjg1cmVtJyB9fT5Mb29rcyBsaWtlIHlvdSBoYXZlbid0IGFkZGVkIGFueSBoYW5kY3JhZnRlZCBsdXh1cnkgdG8geW91ciBjYXJ0IHlldC48L3A+XG4gICAgICAgICAgICAgICAgICAgIDxMaW5rIHRvPVwiL3Nob3BcIiBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnlcIiBzdHlsZT17eyBwYWRkaW5nOiAnMC42cmVtIDEuOHJlbScsIGZvbnRTaXplOiAnMC44NXJlbScsIGJvcmRlclJhZGl1czogJzUwcHgnIH19PkJyb3dzZSBDb2xsZWN0aW9uPC9MaW5rPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRlc2t0b3Atc3BsaXQtbGF5b3V0IGNhcnQtbGF5b3V0XCIgc3R5bGU9e3sgZ2FwOiAnMS4yNXJlbScgfX0+XG4gICAgICAgICAgICAgICAgICAgIHsvKiBMZWZ0IENvbHVtbjogQ2FydCBJdGVtcyBMaXN0ICYgVGllcmVkIFJld2FyZHMgKi99XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tmbGV4OiAxLCBtaW5XaWR0aDogJzI4MHB4J319PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e2JhY2tncm91bmRDb2xvcjogJyNmZmYnLCBib3JkZXJSYWRpdXM6ICcxMnB4JywgcGFkZGluZzogJzAuOXJlbSAxLjFyZW0nLCBib3JkZXI6ICcxcHggc29saWQgI2YwZWZlZScsIG1hcmdpbkJvdHRvbTogJzFyZW0nLCBib3hTaGFkb3c6ICcwIDRweCAxNXB4IHJnYmEoMCwwLDAsMC4wMiknfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2NhcnQubWFwKChpdGVtLCBpZHgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaXRlbVF0eSA9IGl0ZW0ucXVhbnRpdHkgfHwgMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaXRlbVRvdGFsID0gaXRlbS5wcmljZSAqIGl0ZW1RdHk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGtleT17aWR4fSBjbGFzc05hbWU9XCJjYXJ0LWl0ZW0tcm93XCIgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywgYWxpZ25JdGVtczonY2VudGVyJywgZ2FwOicwLjg1cmVtJywgbWFyZ2luQm90dG9tOiBpZHggPT09IGNhcnQubGVuZ3RoIC0gMSA/IDAgOiAnMC44NXJlbScsIGJvcmRlckJvdHRvbTogaWR4ID09PSBjYXJ0Lmxlbmd0aCAtIDEgPyAnbm9uZScgOiAnMXB4IHNvbGlkICNlZWUnLCBwYWRkaW5nQm90dG9tOiBpZHggPT09IGNhcnQubGVuZ3RoIC0gMSA/IDAgOiAnMC44NXJlbScsIGZsZXhXcmFwOid3cmFwJ319PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPXtpdGVtLmltYWdlVXJsfSBhbHQ9e2l0ZW0ubmFtZX0gc3R5bGU9e3t3aWR0aDonNTZweCcsIGhlaWdodDonNTZweCcsIGJvcmRlclJhZGl1czonOHB4Jywgb2JqZWN0Rml0Oidjb3Zlcid9fSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tmbGV4OiAxLCBtaW5XaWR0aDogJzE0MHB4J319PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDMgc3R5bGU9e3tmb250RmFtaWx5Oid2YXIoLS1mb250LWJvZHkpJywgZm9udFdlaWdodDonNTAwJywgZm9udFNpemU6JzAuODhyZW0nLCBtYXJnaW46IDB9fT57aXRlbS5uYW1lfTwvaDM+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtpdGVtLnNpemUgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3tkaXNwbGF5OiAnaW5saW5lLWJsb2NrJywgYmFja2dyb3VuZENvbG9yOiAnI2ZmZjBlOScsIGNvbG9yOiAnI2I5N2E2NicsIHBhZGRpbmc6ICcwLjFyZW0gMC40NXJlbScsIGJvcmRlclJhZGl1czogJzRweCcsIGZvbnRTaXplOiAnMC43MnJlbScsIG1hcmdpblRvcDogJzAuMTVyZW0nLCBmb250V2VpZ2h0OiAnNTAwJ319PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNpemU6IHtpdGVtLnNpemV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPXt7Y29sb3I6J3ZhcigtLWNvbG9yLXRleHQtbGlnaHQpJywgZm9udFNpemU6JzAuNzVyZW0nLCBtYXJnaW46ICcwLjE1cmVtIDAgMCd9fT57aXRlbS5kZXNjcmlwdGlvbj8uc3Vic3RyaW5nKDAsIDQyKX0uLi48L3A+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgey8qIFF1YW50aXR5IFNlbGVjdG9yICovfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FydC1xdWFudGl0eS1zZWxlY3RvclwiIHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGFsaWduSXRlbXM6J2NlbnRlcicsIGdhcDonMC4yNXJlbScsIGJvcmRlcjonMXB4IHNvbGlkICNlMGUwZTAnLCBib3JkZXJSYWRpdXM6JzZweCcsIHBhZGRpbmc6JzAuMXJlbSAwLjM1cmVtJywgYmFja2dyb3VuZDonI2ZiZmJmYid9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHVwZGF0ZVF1YW50aXR5ICYmIHVwZGF0ZVF1YW50aXR5KGlkeCwgaXRlbVF0eSAtIDEpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJpYS1sYWJlbD1cIkRlY3JlYXNlIHF1YW50aXR5XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPVwiRGVjcmVhc2UgcXVhbnRpdHlcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3t3aWR0aDonMjJweCcsIGhlaWdodDonMjJweCcsIGJvcmRlcjonbm9uZScsIGJhY2tncm91bmQ6JyNlZWUnLCBib3JkZXJSYWRpdXM6JzRweCcsIGN1cnNvcjoncG9pbnRlcicsIGZvbnRXZWlnaHQ6J2JvbGQnLCBmb250U2l6ZTonMC44cmVtJywgZGlzcGxheTonZmxleCcsIGFsaWduSXRlbXM6J2NlbnRlcicsIGp1c3RpZnlDb250ZW50OidjZW50ZXInLCBjb2xvcjonIzMzMycsIHRyYW5zaXRpb246J2FsbCAwLjJzIGVhc2UnfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uTW91c2VPdmVyPXtlID0+IGUuY3VycmVudFRhcmdldC5zdHlsZS5iYWNrZ3JvdW5kPScjZTBlMGUwJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uTW91c2VPdXQ9e2UgPT4gZS5jdXJyZW50VGFyZ2V0LnN0eWxlLmJhY2tncm91bmQ9JyNlZWUnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17e21pbldpZHRoOicyMnB4JywgdGV4dEFsaWduOidjZW50ZXInLCBmb250V2VpZ2h0Oic2MDAnLCBmb250U2l6ZTonMC44MnJlbScsIHVzZXJTZWxlY3Q6J25vbmUnfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7aXRlbVF0eX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gdXBkYXRlUXVhbnRpdHkgJiYgdXBkYXRlUXVhbnRpdHkoaWR4LCBpdGVtUXR5ICsgMSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPVwiSW5jcmVhc2UgcXVhbnRpdHlcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU9XCJJbmNyZWFzZSBxdWFudGl0eVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e3dpZHRoOicyMnB4JywgaGVpZ2h0OicyMnB4JywgYm9yZGVyOidub25lJywgYmFja2dyb3VuZDonI2VlZScsIGJvcmRlclJhZGl1czonNHB4JywgY3Vyc29yOidwb2ludGVyJywgZm9udFdlaWdodDonYm9sZCcsIGZvbnRTaXplOicwLjhyZW0nLCBkaXNwbGF5OidmbGV4JywgYWxpZ25JdGVtczonY2VudGVyJywganVzdGlmeUNvbnRlbnQ6J2NlbnRlcicsIGNvbG9yOicjMzMzJywgdHJhbnNpdGlvbjonYWxsIDAuMnMgZWFzZSd9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25Nb3VzZU92ZXI9e2UgPT4gZS5jdXJyZW50VGFyZ2V0LnN0eWxlLmJhY2tncm91bmQ9JyNlMGUwZTAnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25Nb3VzZU91dD17ZSA9PiBlLmN1cnJlbnRUYXJnZXQuc3R5bGUuYmFja2dyb3VuZD0nI2VlZSd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7LyogUHJpY2Ugc2VjdGlvbiAqL31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7dGV4dEFsaWduOidyaWdodCcsIG1pbldpZHRoOic4NXB4J319PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7Zm9udFdlaWdodDonNjAwJywgZm9udFNpemU6JzAuODhyZW0nLCBjb2xvcjondmFyKC0tY29sb3ItdGV4dCknfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICDigrl7aXRlbVRvdGFsLnRvTG9jYWxlU3RyaW5nKCdlbi1JTicpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2l0ZW1RdHkgPiAxICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tmb250U2l6ZTonMC43cmVtJywgY29sb3I6JyM4ODgnLCBtYXJnaW5Ub3A6JzFweCd9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAo4oK5e2l0ZW0ucHJpY2UudG9Mb2NhbGVTdHJpbmcoJ2VuLUlOJyl9IGVhY2gpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvKiBEZWxldGUgYnV0dG9uICovfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHJlbW92ZUZyb21DYXJ0ICYmIHJlbW92ZUZyb21DYXJ0KGlkeCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJEZWxldGUgaXRlbSBmcm9tIGNhcnRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZT1cIlJlbW92ZSBpdGVtXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6ICdub25lJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlcjogJ25vbmUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjZDk1MzRmJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogJzAuMjVyZW0nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnNHB4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogJ2FsbCAwLjJzIGVhc2UnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uTW91c2VPdmVyPXtlID0+IHsgZS5jdXJyZW50VGFyZ2V0LnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcjZmZmMGYwJzsgZS5jdXJyZW50VGFyZ2V0LnN0eWxlLmNvbG9yID0gJyNjOTMwMmMnOyB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbk1vdXNlT3V0PXtlID0+IHsgZS5jdXJyZW50VGFyZ2V0LnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICd0cmFuc3BhcmVudCc7IGUuY3VycmVudFRhcmdldC5zdHlsZS5jb2xvciA9ICcjZDk1MzRmJzsgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCIxN1wiIGhlaWdodD1cIjE3XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlsaW5lIHBvaW50cz1cIjMgNiA1IDYgMjEgNlwiPjwvcG9seWxpbmU+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTE5IDZ2MTRhMiAyIDAgMCAxLTIgMkg3YTIgMiAwIDAgMS0yLTJWNm0zIDBWNGEyIDIgMCAwIDEgMi0yaDRhMiAyIDAgMCAxIDIgMnYyXCI+PC9wYXRoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9XCIxMFwiIHkxPVwiMTFcIiB4Mj1cIjEwXCIgeTI9XCIxN1wiPjwvbGluZT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaW5lIHgxPVwiMTRcIiB5MT1cIjExXCIgeDI9XCIxNFwiIHkyPVwiMTdcIj48L2xpbmU+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICAgICAgey8qIFRpZXJlZCBSZXdhcmRzIFBhbmVsIHdpdGggTm9kZXMsIERlc2NyaXB0aW9ucyAmIENhcmRzICovfVxuICAgICAgICAgICAgICAgICAgICAgICAge3RpZXJzLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2lmdC1zeXN0ZW0tY2FyZFwiIHN0eWxlPXt7cGFkZGluZzogJzEuMjVyZW0nLCBib3JkZXJSYWRpdXM6ICcxMnB4JywgbWFyZ2luQm90dG9tOiAnMXJlbScsIG1hcmdpblRvcDogJzAnfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJnaWZ0LXN5c3RlbS10aXRsZVwiIHN0eWxlPXt7Zm9udFNpemU6ICcxLjA1cmVtJywgbWFyZ2luQm90dG9tOiAnMXJlbScsIGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGdhcDogJzhweCd9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCIyMFwiIGhlaWdodD1cIjIwXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwidmFyKC0tY29sb3ItcHJpbWFyeSlcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlsaW5lIHBvaW50cz1cIjIwIDEyIDIwIDIyIDQgMjIgNCAxMlwiIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJlY3QgeD1cIjJcIiB5PVwiN1wiIHdpZHRoPVwiMjBcIiBoZWlnaHQ9XCI1XCIgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGluZSB4MT1cIjEyXCIgeTE9XCIyMlwiIHgyPVwiMTJcIiB5Mj1cIjdcIiAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMTIgN0g3LjVhMi41IDIuNSAwIDAgMSAwLTVDMTEgMiAxMiA3IDEyIDd6XCIgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTEyIDdoNC41YTIuNSAyLjUgMCAwIDAgMC01QzEzIDIgMTIgNyAxMiA3elwiIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPkV4Y2x1c2l2ZSBUaWVyZWQgUmV3YXJkczwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9oMz5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7bmV4dFRpZXIgPyAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpZnQtbWlsZXN0b25lLWJhbm5lciBwcm9ncmVzc1wiIHN0eWxlPXt7cGFkZGluZzogJzAuNnJlbSAwLjhyZW0nLCBib3JkZXJSYWRpdXM6ICc4cHgnLCBtYXJnaW5Cb3R0b206ICcxLjI1cmVtJ319PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tmbGV4OiAxLCBmb250U2l6ZTogJzAuOHJlbSd9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQWRkIDxzdHJvbmcgc3R5bGU9e3tjb2xvcjogJ3ZhcigtLWNvbG9yLXByaW1hcnkpJ319PuKCuXtyZW1haW5pbmcudG9Mb2NhbGVTdHJpbmcoJ2VuLUlOJyl9PC9zdHJvbmc+IG1vcmUgdG8gdW5sb2NrIDxzdHJvbmc+e25leHRUaWVyLm5hbWV9PC9zdHJvbmc+IVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tmb250U2l6ZTogJzAuODJyZW0nLCBmb250V2VpZ2h0OiAnNjAwJywgY29sb3I6ICd2YXIoLS1jb2xvci1wcmltYXJ5KSd9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg4oK5e3JlbWFpbmluZy50b0xvY2FsZVN0cmluZygnZW4tSU4nKX0gYXdheVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpZnQtbWlsZXN0b25lLWJhbm5lciB1bmxvY2tlZFwiIHN0eWxlPXt7cGFkZGluZzogJzAuNnJlbSAwLjhyZW0nLCBib3JkZXJSYWRpdXM6ICc4cHgnLCBtYXJnaW5Cb3R0b206ICcxLjI1cmVtJywgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgZ2FwOiAnNnB4J319PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCIxNVwiIGhlaWdodD1cIjE1XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIyLjVcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCIgc3R5bGU9e3tmbGV4U2hyaW5rOiAwfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMTIgMmwyLjQgNi42TDIxIDExbC02LjYgMi40TDEyIDIwbC0yLjQtNi42TDMgMTFsNi42LTIuNHpcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e2ZsZXg6IDEsIGZvbnRTaXplOiAnMC44cmVtJ319PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Ryb25nPlVubG9ja2VkIFRvcCBUaWVyOjwvc3Ryb25nPiA8c3Ryb25nPnthY3RpdmVVbmxvY2tlZCA/IGFjdGl2ZVVubG9ja2VkLm5hbWUgOiBcIlwifTwvc3Ryb25nPiFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgey8qIFByb2dyZXNzIEJhciAmIE5vZGVzICovfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpZnQtcHJvZ3Jlc3Mtd3JhcHBlclwiIHN0eWxlPXt7bWFyZ2luOiAnMS41cmVtIDAgMy41cmVtJywgaGVpZ2h0OiAnNDBweCd9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2lmdC1wcm9ncmVzcy10cmFjay1iZ1wiIHN0eWxlPXt7dG9wOiAnMThweCcsIGhlaWdodDogJzVweCd9fT48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aWVycy5sZW5ndGggPT09IDApIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1heFRocmVzaG9sZCA9IHRpZXJzW3RpZXJzLmxlbmd0aCAtIDFdLnRocmVzaG9sZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmaWxsUGVyY2VudCA9IE1hdGgubWluKDEwMCwgKHN1YnRvdGFsIC8gbWF4VGhyZXNob2xkKSAqIDEwMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImdpZnQtcHJvZ3Jlc3MtdHJhY2stZmlsbFwiIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgd2lkdGg6IGAke2ZpbGxQZXJjZW50fSVgLCB0b3A6ICcxOHB4JywgaGVpZ2h0OiAnNXB4JyB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCl9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2lmdC1ub2Rlcy1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7dGllcnMubWFwKCh0LCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpc1VubG9ja2VkID0gc3VidG90YWwgPj0gdC50aHJlc2hvbGQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGtleT17dC5pZCB8fCBpbmRleH0gY2xhc3NOYW1lPXtgZ2lmdC1ub2RlICR7aXNVbmxvY2tlZCA/ICd1bmxvY2tlZCcgOiAnJ31gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpZnQtbm9kZS1kb3RcIiBzdHlsZT17e3dpZHRoOiAnMzhweCcsIGhlaWdodDogJzM4cHgnLCBmb250U2l6ZTogJzAuODVyZW0nfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtpc1VubG9ja2VkID8gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjE2XCIgaGVpZ2h0PVwiMTZcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjNcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlsaW5lIHBvaW50cz1cIjIwIDYgOSAxNyA0IDEyXCI+PC9wb2x5bGluZT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggKyAxXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaWZ0LW5vZGUtbGFiZWxcIiBzdHlsZT17e21hcmdpblRvcDogJzAuNXJlbScsIGZvbnRTaXplOiAnMC43OHJlbSd9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3QubmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpZnQtbm9kZS10aHJlc2hvbGRcIiBzdHlsZT17e2ZvbnRTaXplOiAnMC43MnJlbScsIG1hcmdpblRvcDogJzAuMXJlbSd9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg4oK5e3QudGhyZXNob2xkLnRvTG9jYWxlU3RyaW5nKCdlbi1JTicpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgey8qIFJld2FyZCBDYXJkcyBHcmlkIHdpdGggRGVzY3JpcHRpb25zICovfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpZnQtY2FyZHMtZ3JpZFwiIHN0eWxlPXt7bWFyZ2luVG9wOiAnMXJlbScsIGdhcDogJzFyZW0nLCBncmlkVGVtcGxhdGVDb2x1bW5zOiAncmVwZWF0KGF1dG8tZml0LCBtaW5tYXgoMjAwcHgsIDFmcikpJ319PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3RpZXJzLm1hcCgodCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzVW5sb2NrZWQgPSBzdWJ0b3RhbCA+PSB0LnRocmVzaG9sZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpc0FjdGl2ZSA9IGFjdGl2ZVVubG9ja2VkICYmIGFjdGl2ZVVubG9ja2VkLmlkID09PSB0LmlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjYXJkU3RhdHVzQ2xhc3MgPSAnbG9ja2VkJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNBY3RpdmUpIGNhcmRTdGF0dXNDbGFzcyA9ICdhY3RpdmUtdW5sb2NrZWQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGlzVW5sb2NrZWQpIGNhcmRTdGF0dXNDbGFzcyA9ICd1bmxvY2tlZCc7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGtleT17dC5pZH0gY2xhc3NOYW1lPXtgZ2lmdC1yZXdhcmQtY2FyZCAke2NhcmRTdGF0dXNDbGFzc31gfSBzdHlsZT17e3BhZGRpbmc6ICcxcmVtJ319PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDQgc3R5bGU9e3tmb250U2l6ZTogJzAuODhyZW0nLCBmb250V2VpZ2h0OiAnNjAwJywgbWFyZ2luQm90dG9tOiAnMC40cmVtJywgY29sb3I6ICcjMkQyQTI2J319PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7dC5uYW1lfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaDQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHAgc3R5bGU9e3tmb250U2l6ZTogJzAuNzhyZW0nLCBjb2xvcjogJyM2ODY0NjEnLCBtYXJnaW46ICcwIDAgMC42cmVtJywgbGluZUhlaWdodDogJzEuNCcsIGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGdhcDogJzVweCd9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3QucmV3YXJkVHlwZSA9PT0gJ3BoeXNpY2FsJyA/IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjE0XCIgaGVpZ2h0PVwiMTRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCIgc3R5bGU9e3tmbGV4U2hyaW5rOiAwfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5bGluZSBwb2ludHM9XCIyMCAxMiAyMCAyMiA0IDIyIDQgMTJcIi8+PHJlY3QgeD1cIjJcIiB5PVwiN1wiIHdpZHRoPVwiMjBcIiBoZWlnaHQ9XCI1XCIvPjxsaW5lIHgxPVwiMTJcIiB5MT1cIjIyXCIgeDI9XCIxMlwiIHkyPVwiN1wiLz48cGF0aCBkPVwiTTEyIDdINy41YTIuNSAyLjUgMCAwIDEgMC01QzExIDIgMTIgNyAxMiA3elwiLz48cGF0aCBkPVwiTTEyIDdoNC41YTIuNSAyLjUgMCAwIDAgMC01QzEzIDIgMTIgNyAxMiA3elwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj5Db21wbGltZW50YXJ5IDxzdHJvbmc+e3QucGh5c2ljYWxOYW1lIHx8ICdHaWZ0IEl0ZW0nfTwvc3Ryb25nPiBpbmNsdWRlZCB3aXRoIG9yZGVyLjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3ZnIHdpZHRoPVwiMTRcIiBoZWlnaHQ9XCIxNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIiBzdHlsZT17e2ZsZXhTaHJpbms6IDB9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk0yIDlhMyAzIDAgMCAxIDAgNnYyYTIgMiAwIDAgMCAyIDJoMTZhMiAyIDAgMCAwIDItMnYtMmEzIDMgMCAwIDEgMC02VjdhMiAyIDAgMCAwLTItMkg0YTIgMiAwIDAgMC0yIDJ2MnpcIi8+PGxpbmUgeDE9XCIxMlwiIHkxPVwiNlwiIHgyPVwiMTJcIiB5Mj1cIjE4XCIgc3Ryb2tlRGFzaGFycmF5PVwiMiAyXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPjxzdHJvbmc+e3QuZGlzY291bnRWYWx1ZX0lIE9GRjwvc3Ryb25nPiBwcm9tbyBjb3Vwb24gZ2VuZXJhdGVkIG9uIGNoZWNrb3V0Ljwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e2ZvbnRTaXplOiAnMC43MnJlbScsIGNvbG9yOiBpc1VubG9ja2VkID8gJ3ZhcigtLWNvbG9yLXByaW1hcnkpJyA6ICcjOTk5JywgZm9udFdlaWdodDogJzYwMCcsIGJvcmRlclRvcDogJzFweCBkYXNoZWQgcmdiYSgwLDAsMCwwLjA4KScsIHBhZGRpbmdUb3A6ICcwLjRyZW0nfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2lzVW5sb2NrZWQgPyAnVW5sb2NrZWQgYXQg4oK5JyArIHQudGhyZXNob2xkLnRvTG9jYWxlU3RyaW5nKCdlbi1JTicpIDogJ1NwZW5kIOKCuScgKyB0LnRocmVzaG9sZC50b0xvY2FsZVN0cmluZygnZW4tSU4nKSArICcgdG8gdW5sb2NrJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgey8qIFJpZ2h0IENvbHVtbjogU3RpY2t5IE9yZGVyIFN1bW1hcnkgQm94ICovfVxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN0aWNreS1zdW1tYXJ5LWJveFwiIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzMxMHB4JywgXG4gICAgICAgICAgICAgICAgICAgICAgICBmbGV4U2hyaW5rOiAwLCBcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6ICcxLjI1cmVtJywgXG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjRkZGZGZjJywgXG4gICAgICAgICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICcxNnB4JywgXG4gICAgICAgICAgICAgICAgICAgICAgICBib3JkZXI6ICcxLjVweCBzb2xpZCByZ2JhKDIxMiwgMTYzLCAxMTUsIDAuMzUpJywgXG4gICAgICAgICAgICAgICAgICAgICAgICBib3hTaGFkb3c6ICcwIDhweCAzMHB4IHJnYmEoMjEyLCAxNjMsIDExNSwgMC4wOCknXG4gICAgICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGgzIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogJ3ZhcigtLWZvbnQtaGVhZGluZyknLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogJzEuMDVyZW0nLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiAnNTAwJywgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOiAnMC44NXJlbScsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzJEMkEyNicsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldHRlclNwYWNpbmc6ICcwLjAzZW0nLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXJCb3R0b206ICcxcHggc29saWQgcmdiYSgyMTIsIDE2MywgMTE1LCAwLjI1KScsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmdCb3R0b206ICcwLjQ1cmVtJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgT3JkZXIgU3VtbWFyeVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9oMz5cblxuICAgICAgICAgICAgICAgICAgICAgICAgey8qIEFwcGx5IENvdXBvbiBCbG9jayAqL31cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3ttYXJnaW5Cb3R0b206ICcwLjg1cmVtJ319PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17e2Rpc3BsYXk6ICdibG9jaycsIGZvbnRTaXplOiAnMC43OHJlbScsIGZvbnRXZWlnaHQ6ICc2MDAnLCBjb2xvcjogJyM1NTUnLCBtYXJnaW5Cb3R0b206ICcwLjM1cmVtJ319PlByb21vIC8gQ291cG9uIENvZGU8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OiAnZmxleCcsIGdhcDogJzAuNHJlbSd9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIiBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Y291cG9uQ29kZX0gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17ZSA9PiBzZXRDb3Vwb25Db2RlKGUudGFyZ2V0LnZhbHVlKX0gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cImUuZy4gV0VMQ09NRTEwXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7cGFkZGluZzogJzAuNHJlbSAwLjY1cmVtJywgYm9yZGVyOiAnMXB4IHNvbGlkIHJnYmEoMjEyLCAxNjMsIDExNSwgMC4yNSknLCBib3JkZXJSYWRpdXM6ICc4cHgnLCBmbGV4OiAxLCBmb250U2l6ZTogJzAuNzVyZW0nLCBvdXRsaW5lOiAnbm9uZScsIGhlaWdodDogJzM0cHgnLCBiYWNrZ3JvdW5kOiAnI0ZBRjdGNCd9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17aGFuZGxlQ291cG9ufSBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogJzAgMC44NXJlbScsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzUwcHgnLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogJzAuNzhyZW0nLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6ICczNHB4JywgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogJ2xpbmVhci1ncmFkaWVudCgxMzVkZWcsICNENEEzNzMgMCUsICNDNDkzNjMgMTAwJSknLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyNGRkYnLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXI6ICdub25lJywgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogJzYwMCcsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJveFNoYWRvdzogJzAgM3B4IDEwcHggcmdiYSgyMTIsIDE2MywgMTE1LCAwLjIpJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQXBwbHlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge21zZyAmJiA8cCBzdHlsZT17e21hcmdpblRvcDogJzAuM3JlbScsIGZvbnRTaXplOiAnMC43NXJlbScsIGNvbG9yOiBtc2cuaW5jbHVkZXMoJ0FwcGxpZWQnKSA/ICcjMkU3RDMyJyA6ICcjRDMyRjJGJywgZm9udFdlaWdodDogJzUwMCd9fT57bXNnfTwvcD59XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e2JvcmRlclRvcDogJzFweCBzb2xpZCByZ2JhKDIxMiwgMTYzLCAxMTUsIDAuMiknLCBwYWRkaW5nVG9wOiAnMC43NXJlbScsIGRpc3BsYXk6ICdmbGV4JywgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsIGdhcDogJzAuNXJlbScsIGZvbnRTaXplOiAnMC44MnJlbSd9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTogJ2ZsZXgnLCBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLCBjb2xvcjogJyM2QzY4NjMnfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPkJhZyBTdWJ0b3RhbDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3tmb250V2VpZ2h0OiAnNjAwJywgY29sb3I6ICcjMkQyQTI2J319PuKCuXtzdWJ0b3RhbC50b0xvY2FsZVN0cmluZygnZW4tSU4nKX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2Rpc2NvdW50ICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6ICdmbGV4JywganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJywgY29sb3I6ICcjMkU3RDMyJywgZm9udFdlaWdodDogJzUwMCd9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPkRpc2NvdW50ICh7ZGlzY291bnQuY29kZX0pPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+LeKCuXtkaXNjb3VudC5hbXQudG9Mb2NhbGVTdHJpbmcoJ2VuLUlOJyl9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OiAnZmxleCcsIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsIGNvbG9yOiAnIzZDNjg2Myd9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+RXN0aW1hdGVkIFNoaXBwaW5nPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17e2NvbG9yOiAnIzJFN0QzMicsIGZvbnRXZWlnaHQ6ICc2MDAnfX0+RlJFRTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OiAnZmxleCcsIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBib3JkZXJUb3A6ICcxcHggZGFzaGVkIHJnYmEoMjEyLCAxNjMsIDExNSwgMC4zNSknLCBwYWRkaW5nVG9wOiAnMC42NXJlbScsIG1hcmdpblRvcDogJzAuM3JlbSd9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3tmb250V2VpZ2h0OiA2MDAsIGNvbG9yOiAnIzJEMkEyNicsIGZvbnRTaXplOiAnMC45MnJlbSd9fT5Ub3RhbCBBbW91bnQ8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7Zm9udFNpemU6ICcxLjFyZW0nLCBmb250V2VpZ2h0OiA3MDAsIGNvbG9yOiAnIzhGNUUzNicsIGZvbnRGYW1pbHk6ICd2YXIoLS1mb250LWJvZHkpJ319PuKCuXtmaW5hbFRvdGFsLnRvTG9jYWxlU3RyaW5nKCdlbi1JTicpfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWF1dGhVc2VyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0U2hvd0F1dGhNb2RhbCh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2aWdhdGUoJy9jaGVja291dCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJywgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6ICczOHB4JywgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAnMCcsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJywgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW5Ub3A6ICcwLjg1cmVtJywgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICc1MHB4JywgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogJzAuODVyZW0nLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6ICc2MDAnLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiAnbm9uZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiAnbGluZWFyLWdyYWRpZW50KDEzNWRlZywgI0Q0QTM3MyAwJSwgI0M0OTM2MyAxMDAlKScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyNGRkYnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm94U2hhZG93OiAnMCA0cHggMTVweCByZ2JhKDIxMiwgMTYzLCAxMTUsIDAuMjUpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb246ICdhbGwgMC4zcyBlYXNlJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUHJvY2VlZCB0byBDaGVja291dCAmcmFycjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICl9XG5cbiAgICAgICAgICAgIHsvKiBIYW5kY3JhZnRlZCBTaWduIEluIC8gU2lnbiBVcCBNb2RhbCBQcm9tcHQgKi99XG4gICAgICAgICAgICA8QXV0aFJlcXVpcmVkTW9kYWwgXG4gICAgICAgICAgICAgICAgaXNPcGVuPXtzaG93QXV0aE1vZGFsfVxuICAgICAgICAgICAgICAgIG9uQ2xvc2U9eygpID0+IHNldFNob3dBdXRoTW9kYWwoZmFsc2UpfVxuICAgICAgICAgICAgICAgIHJlZGlyZWN0UGF0aD1cIi9jaGVja291dFwiXG4gICAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgQ2FydDsgICAgIl19