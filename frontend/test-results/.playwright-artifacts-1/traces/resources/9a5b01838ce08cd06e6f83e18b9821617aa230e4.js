import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/pages/Checkout.jsx");const React = __vite__cjsImport0_react; const useState = __vite__cjsImport0_react["useState"]; const useEffect = __vite__cjsImport0_react["useEffect"]; const useRef = __vite__cjsImport0_react["useRef"];const _jsxDEV = __vite__cjsImport5_react_jsxDevRuntime["jsxDEV"];import __vite__cjsImport0_react from "/node_modules/.vite/deps/react.js?v=42a9b196";
import { useNavigate, Link, useLocation, useParams, Routes, Route, Navigate, BrowserRouter } from "/node_modules/.vite/deps/react-router-dom.js?v=42a9b196";
import Cart from "/src/pages/Cart.jsx";
import { API_BASE_URL } from "/src/data/config.jsx";
import { fetchWithAuth } from "/src/utils/apiClient.js";
var _jsxFileName = "D:/The Ethnic Touch/frontend/src/pages/Checkout.jsx";
import __vite__cjsImport5_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=42a9b196";
var _s = $RefreshSig$();
const showAlert = (message, title = "Notice", type = "warning") => {
	if (window.customAlert) {
		window.customAlert(message, title, type);
	} else {
		alert(`${title}: ${message}`);
	}
};
const Checkout = ({ cart, discount, clearCart, authUser, authLoading }) => {
	_s();
	const [email, setEmail] = useState("");
	const [addresses, setAddresses] = useState([]);
	const [selectedAddressID, setSelectedAddressID] = useState(null);
	const [checkoutType, setCheckoutType] = useState("delivery");
	const [paymentMethod, setPaymentMethod] = useState("online");
	const [shippingForm, setShippingForm] = useState({
		fullName: "",
		phone: "",
		addressLine: "",
		city: "",
		state: "",
		zipCode: ""
	});
	const [showNewAddressForm, setShowNewAddressForm] = useState(false);
	const [addressMessage, setAddressMessage] = useState("");
	const [ordering, setOrdering] = useState(false);
	const [showLeaveModal, setShowLeaveModal] = useState(false);
	const [pendingPaymentOrder, setPendingPaymentOrder] = useState(null);
	const [verifyingPayment, setVerifyingPayment] = useState(false);
	const navigate = useNavigate();
	const paymentCompleteRef = useRef(false);
	const handleBackClick = (e) => {
		if (e) e.preventDefault();
		setShowLeaveModal(true);
	};
	const confirmLeaveCheckout = () => {
		setShowLeaveModal(false);
		if (window.history.state && window.history.state.idx > 0) {
			navigate(-1);
		} else {
			navigate("/cart");
		}
	};
	useEffect(() => {
		if (paymentCompleteRef.current) return;
		if (authLoading) return;
		if (!authUser) {
			navigate("/auth?redirect=/checkout");
			return;
		}
		if (!cart || cart.length === 0) {
			navigate("/cart");
		}
	}, [
		cart,
		authUser,
		authLoading,
		navigate
	]);
	const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
	const finalTotal = subtotal - (discount?.amt || 0);
	const activeAddr = authUser && addresses.length > 0 ? addresses.find((a) => a.id === selectedAddressID) : null;
	const isCityHyderabad = activeAddr && (activeAddr.city.toLowerCase().trim() === "hyderabad" || activeAddr.city.toLowerCase().trim() === "secunderabad");
	const isInstantDeliveryBlocked = checkoutType === "hyderabad_instant" && activeAddr && !isCityHyderabad;
	useEffect(() => {
		if (authUser) {
			setEmail(authUser.email || "");
			fetch(`${API_BASE_URL}/api/profile/me`, { headers: { "X-User-Id": authUser.uid } }).then((r) => r.json()).then((data) => {
				if (data.email) setEmail(data.email);
			}).catch((err) => console.error(err));
			loadAddresses();
		}
	}, [authUser]);
	const loadAddresses = async () => {
		if (!authUser) return;
		try {
			const response = await fetch(`${API_BASE_URL}/api/profile/addresses`, { headers: { "X-User-Id": authUser.uid } });
			if (response.ok) {
				const data = await response.json();
				setAddresses(data);
				const def = data.find((a) => a.isDefault);
				if (def) {
					setSelectedAddressID(def.id);
				} else if (data.length > 0) {
					setSelectedAddressID(data[0].id);
				}
			}
		} catch (err) {
			console.error(err);
		}
	};
	const handleAddAddress = async (e) => {
		e.preventDefault();
		setAddressMessage("");
		if (!authUser) return;
		try {
			const response = await fetch(`${API_BASE_URL}/api/profile/addresses`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-User-Id": authUser.uid
				},
				body: JSON.stringify(shippingForm)
			});
			if (!response.ok) {
				const text = await response.text();
				throw new Error(text || "Failed to save address");
			}
			const saved = await response.json();
			setShippingForm({
				fullName: "",
				phone: "",
				addressLine: "",
				city: "",
				state: "",
				zipCode: ""
			});
			setShowNewAddressForm(false);
			const loadRes = await fetch(`${API_BASE_URL}/api/profile/addresses`, { headers: { "X-User-Id": authUser.uid } });
			if (loadRes.ok) {
				const data = await loadRes.json();
				setAddresses(data);
				if (data.length > 0) {
					setSelectedAddressID(data[0].id);
				}
			}
		} catch (err) {
			setAddressMessage(err.message);
		}
	};
	const placeOrder = async () => {
		if (!authUser) {
			navigate("/auth?redirect=/checkout");
			return;
		}
		if (!email) return showAlert("Please enter your email address before placing an order.", "Email Required", "warning");
		let order = {};
		if (checkoutType === "pickup") {
			order = {
				customerEmail: email,
				couponCode: discount?.code || "",
				items: cart.map((item) => ({
					productId: item.id,
					quantity: item.quantity || 1,
					size: item.size || ""
				})),
				checkoutType: "pickup",
				paymentMethod,
				shippingName: "Store Pickup Customer",
				shippingPhone: authUser?.phone || "0000000000",
				shippingAddress: "Jubilee Hills boutique pickup",
				shippingCity: "Hyderabad",
				shippingState: "Telangana",
				shippingZipCode: "500033"
			};
		} else {
			if (!activeAddr) {
				return showAlert("Please select or add a shipping address before paying.", "Address Required", "warning");
			}
			if (checkoutType === "hyderabad_instant") {
				const city = (activeAddr.city || "").trim().toLowerCase();
				if (city !== "hyderabad" && city !== "secunderabad") {
					return showAlert("Instant delivery is only available inside Hyderabad/Secunderabad.", "Location Restriction", "warning");
				}
				const zip = (activeAddr.zipCode || "").trim();
				if (!zip.startsWith("500") || zip.length !== 6) {
					return showAlert("Instant delivery requires a local Hyderabad pincode starting with 500 (e.g., 500081).", "Pincode Required", "warning");
				}
			}
			order = {
				customerEmail: email,
				couponCode: discount?.code || "",
				items: cart.map((item) => ({
					productId: item.id,
					quantity: item.quantity || 1,
					size: item.size || ""
				})),
				checkoutType,
				paymentMethod: "online",
				shippingName: activeAddr.fullName,
				shippingPhone: activeAddr.phone,
				shippingAddress: activeAddr.addressLine,
				shippingCity: activeAddr.city,
				shippingState: activeAddr.state,
				shippingZipCode: activeAddr.zipCode
			};
		}
		setOrdering(true);
		try {
			const res = await fetchWithAuth("/api/orders", {
				method: "POST",
				body: JSON.stringify(order)
			});
			if (!res.ok) {
				const errData = await res.json();
				showAlert(errData.error || "Failed to create order", "Order Error", "error");
				setOrdering(false);
				return;
			}
			const data = await res.json();
			// Handle Offline Store Pickup QR Code
			if (data.paymentMethod === "offline_qr") {
				paymentCompleteRef.current = true;
				clearCart();
				navigate("/checkout-success", { state: {
					orderId: data.orderId,
					checkoutType: "pickup",
					paymentMethod: "offline_qr",
					amount: data.amount
				} });
				return;
			}
			// Handle Official Razorpay Gateway Modal
			const isRazorpay = data.checkoutUrl === "razorpay" || Boolean(data.razorpayKey) || data.paymentMethod === "online";
			if (isRazorpay) {
				if (window.Razorpay) {
					const options = {
						key: data.razorpayKey || "rzp_test_mock",
						amount: Math.round(data.amount * 100),
						currency: "INR",
						name: "The Ethnic Touch",
						description: `Boutique Order #${data.orderId}`,
						prefill: { email },
						theme: { color: "#B97A66" },
						handler: async function(response) {
							try {
								const verifyRes = await fetch(`${API_BASE_URL}/api/orders/verify`, {
									method: "POST",
									headers: { "Content-Type": "application/json" },
									body: JSON.stringify({
										orderId: data.orderId,
										razorpayOrderId: response.razorpay_order_id,
										razorpayPaymentId: response.razorpay_payment_id,
										razorpaySignature: response.razorpay_signature,
										mock: false
									})
								});
								if (verifyRes.ok) {
									const verifyData = await verifyRes.json();
									paymentCompleteRef.current = true;
									clearCart();
									navigate("/checkout-success", { state: {
										orderId: data.orderId,
										gift: verifyData.giftCode,
										unlockedGift: verifyData.unlockedGift,
										giftType: verifyData.giftType,
										giftExpiryDate: verifyData.giftExpiryDate,
										tracking: verifyData.trackingNumber,
										checkoutType,
										paymentMethod: "online"
									} });
								} else {
									showAlert("Payment verification failed. Please contact boutique support.", "Payment Error", "error");
									setOrdering(false);
								}
							} catch (e) {
								showAlert("Network error verifying payment.", "Connection Error", "error");
								setOrdering(false);
							}
						},
						modal: { ondismiss: function() {
							setOrdering(false);
						} }
					};
					if (data.razorpayOrderId && !data.razorpayOrderId.startsWith("MOCK_")) {
						options.order_id = data.razorpayOrderId;
					}
					const rzp = new window.Razorpay(options);
					rzp.open();
					setOrdering(false);
				} else {
					showAlert("Razorpay SDK is loading. Please try again in a moment.", "SDK Error", "notice");
					setOrdering(false);
				}
			} else {
				let targetUrl = data.checkoutUrl || `/mock-payment?orderId=${data.orderId}`;
				if (targetUrl.startsWith("/#")) {
					targetUrl = targetUrl.substring(2);
				}
				navigate(targetUrl);
			}
		} catch (err) {
			showAlert("Error placing order. Please try again.", "Order Error", "error");
			setOrdering(false);
		}
	};
	if (authLoading) {
		return /* @__PURE__ */ _jsxDEV("div", {
			style: {
				padding: "1.25rem 5% 3rem",
				maxWidth: "1150px",
				margin: "0 auto",
				minHeight: "75vh"
			},
			children: [/* @__PURE__ */ _jsxDEV("div", {
				className: "skeleton-box",
				style: {
					height: "36px",
					width: "180px",
					borderRadius: "8px",
					marginBottom: "1.5rem"
				}
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 323,
				columnNumber: 17
			}, this), /* @__PURE__ */ _jsxDEV("div", {
				style: {
					display: "grid",
					gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
					gap: "1.5rem"
				},
				children: [/* @__PURE__ */ _jsxDEV("div", {
					className: "skeleton-box",
					style: {
						height: "380px",
						borderRadius: "16px"
					}
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 325,
					columnNumber: 21
				}, this), /* @__PURE__ */ _jsxDEV("div", {
					className: "skeleton-box",
					style: {
						height: "380px",
						borderRadius: "16px"
					}
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 326,
					columnNumber: 21
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 324,
				columnNumber: 17
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 322,
			columnNumber: 13
		}, this);
	}
	return /* @__PURE__ */ _jsxDEV("div", {
		className: "checkout-page-container",
		style: {
			padding: "1.25rem 5% 3rem",
			maxWidth: "1150px",
			margin: "0 auto",
			minHeight: "75vh"
		},
		children: [
			/* @__PURE__ */ _jsxDEV("a", {
				href: "#",
				onClick: handleBackClick,
				className: "checkout-back-link",
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
				lineNumber: 334,
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
				children: "Checkout"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 342,
				columnNumber: 13
			}, this),
			/* @__PURE__ */ _jsxDEV("div", {
				className: "desktop-split-layout checkout-layout",
				style: { gap: "1.25rem" },
				children: [/* @__PURE__ */ _jsxDEV("div", {
					style: {
						flex: 1,
						minWidth: "280px"
					},
					children: [
						/* @__PURE__ */ _jsxDEV("div", {
							style: {
								display: "grid",
								gridTemplateColumns: "1fr 1fr 1fr",
								gap: "8px",
								marginBottom: "1.25rem"
							},
							children: [
								/* @__PURE__ */ _jsxDEV("button", {
									onClick: () => {
										setCheckoutType("delivery");
										setPaymentMethod("online");
									},
									style: {
										padding: "8px 6px",
										borderRadius: "8px",
										border: "1.5px solid",
										borderColor: checkoutType === "delivery" ? "#D4A373" : "#E6E4E0",
										background: checkoutType === "delivery" ? "#FAF3ED" : "#fff",
										color: checkoutType === "delivery" ? "#8F5E36" : "#5C5854",
										fontWeight: "600",
										fontSize: "0.78rem",
										cursor: "pointer",
										transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
										gap: "4px",
										boxShadow: checkoutType === "delivery" ? "0 4px 10px rgba(212,163,115,0.12)" : "none",
										outline: "none"
									},
									children: [/* @__PURE__ */ _jsxDEV("svg", {
										width: "18",
										height: "18",
										viewBox: "0 0 24 24",
										fill: "none",
										stroke: "currentColor",
										strokeWidth: "2",
										strokeLinecap: "round",
										strokeLinejoin: "round",
										children: [
											/* @__PURE__ */ _jsxDEV("rect", {
												x: "1",
												y: "3",
												width: "15",
												height: "13",
												rx: "2",
												ry: "2"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 380,
												columnNumber: 25
											}, this),
											/* @__PURE__ */ _jsxDEV("polygon", { points: "16 8 20 8 23 11 23 16 16 16 16 8" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 381,
												columnNumber: 25
											}, this),
											/* @__PURE__ */ _jsxDEV("circle", {
												cx: "5.5",
												cy: "18.5",
												r: "2.5"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 382,
												columnNumber: 25
											}, this),
											/* @__PURE__ */ _jsxDEV("circle", {
												cx: "18.5",
												cy: "18.5",
												r: "2.5"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 383,
												columnNumber: 25
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 379,
										columnNumber: 21
									}, this), /* @__PURE__ */ _jsxDEV("span", {
										style: {
											fontFamily: "Inter, sans-serif",
											letterSpacing: "-0.01em"
										},
										children: "Standard Delivery"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 385,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 355,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ _jsxDEV("button", {
									onClick: () => {
										setCheckoutType("pickup");
										setPaymentMethod("online");
									},
									style: {
										padding: "8px 6px",
										borderRadius: "8px",
										border: "1.5px solid",
										borderColor: checkoutType === "pickup" ? "#D4A373" : "#E6E4E0",
										background: checkoutType === "pickup" ? "#FAF3ED" : "#fff",
										color: checkoutType === "pickup" ? "#8F5E36" : "#5C5854",
										fontWeight: "600",
										fontSize: "0.78rem",
										cursor: "pointer",
										transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
										gap: "4px",
										boxShadow: checkoutType === "pickup" ? "0 4px 10px rgba(212,163,115,0.12)" : "none",
										outline: "none"
									},
									children: [/* @__PURE__ */ _jsxDEV("svg", {
										width: "18",
										height: "18",
										viewBox: "0 0 24 24",
										fill: "none",
										stroke: "currentColor",
										strokeWidth: "2",
										strokeLinecap: "round",
										strokeLinejoin: "round",
										children: [/* @__PURE__ */ _jsxDEV("path", { d: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 413,
											columnNumber: 25
										}, this), /* @__PURE__ */ _jsxDEV("polyline", { points: "9 22 9 12 15 12 15 22" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 414,
											columnNumber: 25
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 412,
										columnNumber: 21
									}, this), /* @__PURE__ */ _jsxDEV("span", {
										style: {
											fontFamily: "Inter, sans-serif",
											letterSpacing: "-0.01em"
										},
										children: "Store Pickup"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 416,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 388,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ _jsxDEV("button", {
									onClick: () => {
										setCheckoutType("hyderabad_instant");
										setPaymentMethod("online");
									},
									style: {
										padding: "8px 6px",
										borderRadius: "8px",
										border: "1.5px solid",
										borderColor: checkoutType === "hyderabad_instant" ? "#D4A373" : "#E6E4E0",
										background: checkoutType === "hyderabad_instant" ? "#FAF3ED" : "#fff",
										color: checkoutType === "hyderabad_instant" ? "#8F5E36" : "#5C5854",
										fontWeight: "600",
										fontSize: "0.78rem",
										cursor: "pointer",
										transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
										gap: "4px",
										boxShadow: checkoutType === "hyderabad_instant" ? "0 6px 15px rgba(212,163,115,0.15)" : "none",
										outline: "none"
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
										children: /* @__PURE__ */ _jsxDEV("polygon", { points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 444,
											columnNumber: 25
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 443,
										columnNumber: 21
									}, this), /* @__PURE__ */ _jsxDEV("span", {
										style: {
											fontFamily: "Inter, sans-serif",
											letterSpacing: "-0.01em"
										},
										children: "Hyderabad Instant"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 446,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 419,
									columnNumber: 17
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 349,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ _jsxDEV("div", {
							style: { marginBottom: "1.25rem" },
							children: [/* @__PURE__ */ _jsxDEV("label", {
								style: {
									display: "block",
									marginBottom: "0.35rem",
									fontWeight: 600,
									fontSize: "0.78rem",
									color: "#555"
								},
								children: "Confirm Email *"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 451,
								columnNumber: 17
							}, this), /* @__PURE__ */ _jsxDEV("input", {
								type: "email",
								className: "checkout-email-input",
								value: email,
								onChange: (e) => setEmail(e.target.value),
								placeholder: "you@example.com",
								style: {
									border: "1px solid #ddd",
									borderRadius: "8px",
									width: "100%",
									fontSize: "0.75rem",
									height: "34px",
									padding: "0.35rem 0.65rem"
								},
								disabled: ordering,
								required: true
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 452,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 450,
							columnNumber: 13
						}, this),
						checkoutType === "pickup" && /* @__PURE__ */ _jsxDEV("div", {
							style: { marginBottom: "2.5rem" },
							children: [/* @__PURE__ */ _jsxDEV("div", {
								style: {
									background: "#FAF3ED",
									border: "1px solid #FFE5D9",
									borderRadius: "12px",
									padding: "1.8rem",
									marginBottom: "2rem",
									boxShadow: "0 4px 12px rgba(212,163,115,0.06)"
								},
								children: [
									/* @__PURE__ */ _jsxDEV("h4", {
										style: {
											fontFamily: "var(--font-title)",
											color: "#8F5E36",
											marginBottom: "0.8rem",
											fontSize: "1.2rem",
											display: "flex",
											alignItems: "center",
											gap: "10px"
										},
										children: [/* @__PURE__ */ _jsxDEV("svg", {
											width: "22",
											height: "22",
											viewBox: "0 0 24 24",
											fill: "none",
											stroke: "currentColor",
											strokeWidth: "2",
											strokeLinecap: "round",
											strokeLinejoin: "round",
											style: { color: "#8F5E36" },
											children: [/* @__PURE__ */ _jsxDEV("path", { d: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 477,
												columnNumber: 33
											}, this), /* @__PURE__ */ _jsxDEV("polyline", { points: "9 22 9 12 15 12 15 22" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 478,
												columnNumber: 33
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 476,
											columnNumber: 29
										}, this), "Jubilee Hills Boutique Collection"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 475,
										columnNumber: 25
									}, this),
									/* @__PURE__ */ _jsxDEV("p", {
										style: {
											fontSize: "0.95rem",
											color: "#2D2A26",
											fontWeight: 600,
											margin: "0 0 0.4rem"
										},
										children: "The Ethnic Touch Boutique"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 482,
										columnNumber: 25
									}, this),
									/* @__PURE__ */ _jsxDEV("p", {
										style: {
											fontSize: "0.88rem",
											color: "#6C6863",
											margin: "0 0 0.8rem",
											lineHeight: "1.5"
										},
										children: [
											"Road No. 36, Near Jubilee Hills Check Post,",
											/* @__PURE__ */ _jsxDEV("br", {}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 484,
												columnNumber: 72
											}, this),
											"Hyderabad, Telangana - 500033",
											/* @__PURE__ */ _jsxDEV("br", {}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 485,
												columnNumber: 58
											}, this),
											"Assistant Desk: ",
											/* @__PURE__ */ _jsxDEV("strong", { children: "+91 98765 43210" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 486,
												columnNumber: 45
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 483,
										columnNumber: 25
									}, this),
									/* @__PURE__ */ _jsxDEV("p", {
										style: {
											fontSize: "0.85rem",
											color: "#8F5E36",
											fontStyle: "italic",
											margin: 0,
											borderTop: "1px solid rgba(212,163,115,0.2)",
											paddingTop: "0.8rem",
											display: "flex",
											alignItems: "center",
											gap: "8px"
										},
										children: [/* @__PURE__ */ _jsxDEV("svg", {
											width: "18",
											height: "18",
											viewBox: "0 0 24 24",
											fill: "none",
											stroke: "currentColor",
											strokeWidth: "2",
											strokeLinecap: "round",
											strokeLinejoin: "round",
											style: {
												color: "#8F5E36",
												flexShrink: 0
											},
											children: [
												/* @__PURE__ */ _jsxDEV("circle", {
													cx: "12",
													cy: "12",
													r: "10"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 490,
													columnNumber: 33
												}, this),
												/* @__PURE__ */ _jsxDEV("line", {
													x1: "12",
													y1: "16",
													x2: "12",
													y2: "12"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 491,
													columnNumber: 33
												}, this),
												/* @__PURE__ */ _jsxDEV("line", {
													x1: "12",
													y1: "8",
													x2: "12.01",
													y2: "8"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 492,
													columnNumber: 33
												}, this)
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 489,
											columnNumber: 29
										}, this), /* @__PURE__ */ _jsxDEV("span", { children: "Collected packages are custom steamed and gift-wrapped on arrival. Pickups available 10:30 AM - 8:30 PM." }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 494,
											columnNumber: 29
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 488,
										columnNumber: 25
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 467,
								columnNumber: 21
							}, this), /* @__PURE__ */ _jsxDEV("div", {
								style: { marginBottom: "2rem" },
								children: [/* @__PURE__ */ _jsxDEV("h3", {
									style: {
										fontSize: "1.1rem",
										fontWeight: 600,
										color: "#333",
										marginBottom: "1.1rem"
									},
									children: "Select Payment Mode"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 500,
									columnNumber: 25
								}, this), /* @__PURE__ */ _jsxDEV("div", {
									style: {
										display: "grid",
										gridTemplateColumns: "1fr 1fr",
										gap: "1rem"
									},
									children: [/* @__PURE__ */ _jsxDEV("div", {
										onClick: () => setPaymentMethod("online"),
										style: {
											border: paymentMethod === "online" ? "2px solid #D4A373" : "1px solid #E6E4E0",
											borderRadius: "12px",
											padding: "1.5rem 1rem",
											background: paymentMethod === "online" ? "#FAF3ED" : "#fff",
											cursor: "pointer",
											display: "flex",
											flexDirection: "column",
											alignItems: "center",
											justifyContent: "center",
											gap: "12px",
											transition: "all 0.3s ease",
											boxShadow: paymentMethod === "online" ? "0 6px 15px rgba(212,163,115,0.15)" : "none"
										},
										children: [
											/* @__PURE__ */ _jsxDEV("svg", {
												width: "32",
												height: "32",
												viewBox: "0 0 24 24",
												fill: "none",
												stroke: "currentColor",
												strokeWidth: "2",
												strokeLinecap: "round",
												strokeLinejoin: "round",
												style: { color: "#8F5E36" },
												children: [/* @__PURE__ */ _jsxDEV("rect", {
													x: "1",
													y: "4",
													width: "22",
													height: "16",
													rx: "2",
													ry: "2"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 520,
													columnNumber: 37
												}, this), /* @__PURE__ */ _jsxDEV("line", {
													x1: "1",
													y1: "10",
													x2: "23",
													y2: "10"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 521,
													columnNumber: 37
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 519,
												columnNumber: 33
											}, this),
											/* @__PURE__ */ _jsxDEV("span", {
												style: {
													fontSize: "0.98rem",
													fontWeight: 600,
													color: "#2D2A26"
												},
												children: "Prepay Online"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 523,
												columnNumber: 33
											}, this),
											/* @__PURE__ */ _jsxDEV("span", {
												style: {
													fontSize: "0.75rem",
													color: "#6C6863",
													textAlign: "center"
												},
												children: "Instant checkout verification"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 524,
												columnNumber: 33
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 502,
										columnNumber: 29
									}, this), /* @__PURE__ */ _jsxDEV("div", {
										onClick: () => setPaymentMethod("offline_qr"),
										style: {
											border: paymentMethod === "offline_qr" ? "2px solid #D4A373" : "1px solid #E6E4E0",
											borderRadius: "12px",
											padding: "1.5rem 1rem",
											background: paymentMethod === "offline_qr" ? "#FAF3ED" : "#fff",
											cursor: "pointer",
											display: "flex",
											flexDirection: "column",
											alignItems: "center",
											justifyContent: "center",
											gap: "12px",
											transition: "all 0.3s ease",
											boxShadow: paymentMethod === "offline_qr" ? "0 6px 15px rgba(212,163,115,0.15)" : "none"
										},
										children: [
											/* @__PURE__ */ _jsxDEV("svg", {
												width: "32",
												height: "32",
												viewBox: "0 0 24 24",
												fill: "none",
												stroke: "currentColor",
												strokeWidth: "2",
												strokeLinecap: "round",
												strokeLinejoin: "round",
												style: { color: "#8F5E36" },
												children: [/* @__PURE__ */ _jsxDEV("rect", {
													x: "5",
													y: "2",
													width: "14",
													height: "20",
													rx: "2",
													ry: "2"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 545,
													columnNumber: 37
												}, this), /* @__PURE__ */ _jsxDEV("line", {
													x1: "12",
													y1: "18",
													x2: "12.01",
													y2: "18"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 546,
													columnNumber: 37
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 544,
												columnNumber: 33
											}, this),
											/* @__PURE__ */ _jsxDEV("span", {
												style: {
													fontSize: "0.98rem",
													fontWeight: 600,
													color: "#2D2A26"
												},
												children: "Pay In-Store"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 548,
												columnNumber: 33
											}, this),
											/* @__PURE__ */ _jsxDEV("span", {
												style: {
													fontSize: "0.75rem",
													color: "#6C6863",
													textAlign: "center"
												},
												children: "Book now, scan pass at boutique"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 549,
												columnNumber: 33
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 527,
										columnNumber: 29
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 501,
									columnNumber: 25
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 499,
								columnNumber: 21
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 466,
							columnNumber: 17
						}, this),
						checkoutType === "delivery" && /* @__PURE__ */ _jsxDEV("div", {
							style: {
								background: "#F9FAF9",
								border: "1px solid #E6E6E6",
								borderRadius: "12px",
								padding: "1.2rem",
								marginBottom: "2rem",
								fontSize: "0.88rem",
								color: "#555",
								display: "flex",
								alignItems: "center",
								gap: "14px"
							},
							children: [/* @__PURE__ */ _jsxDEV("svg", {
								width: "24",
								height: "24",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: "2",
								strokeLinecap: "round",
								strokeLinejoin: "round",
								style: {
									color: "#555",
									flexShrink: 0
								},
								children: [/* @__PURE__ */ _jsxDEV("polyline", { points: "22 12 16 12 14 15 10 15 8 12 2 12" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 571,
									columnNumber: 25
								}, this), /* @__PURE__ */ _jsxDEV("path", { d: "M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 572,
									columnNumber: 25
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 570,
								columnNumber: 21
							}, this), /* @__PURE__ */ _jsxDEV("div", { children: [
								/* @__PURE__ */ _jsxDEV("strong", { children: "Standard Shipping Details:" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 575,
									columnNumber: 25
								}, this),
								" Dispatched via premium express post (Delhivery/BlueDart). Expected delivery within ",
								/* @__PURE__ */ _jsxDEV("strong", { children: "3-5 business days" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 575,
									columnNumber: 152
								}, this),
								" nationwide."
							] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 574,
								columnNumber: 21
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 558,
							columnNumber: 17
						}, this),
						checkoutType === "hyderabad_instant" && /* @__PURE__ */ _jsxDEV("div", {
							style: {
								background: "#FFF9F2",
								border: "1px solid #FFE9D1",
								borderRadius: "12px",
								padding: "1.2rem",
								marginBottom: "2rem",
								fontSize: "0.88rem",
								color: "#8F5E36",
								display: "flex",
								alignItems: "center",
								gap: "14px"
							},
							children: [/* @__PURE__ */ _jsxDEV("svg", {
								width: "24",
								height: "24",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: "2",
								strokeLinecap: "round",
								strokeLinejoin: "round",
								style: {
									color: "#8F5E36",
									flexShrink: 0
								},
								children: /* @__PURE__ */ _jsxDEV("polygon", { points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 595,
									columnNumber: 25
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 594,
								columnNumber: 21
							}, this), /* @__PURE__ */ _jsxDEV("div", { children: [
								/* @__PURE__ */ _jsxDEV("strong", { children: "Local courier dispatch:" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 598,
									columnNumber: 25
								}, this),
								" Delivered within ",
								/* @__PURE__ */ _jsxDEV("strong", { children: "2-4 hours" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 598,
									columnNumber: 83
								}, this),
								" via instant courier (Uber/Rapido) direct from Road No. 36 boutique."
							] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 597,
								columnNumber: 21
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 582,
							columnNumber: 17
						}, this),
						checkoutType !== "pickup" && /* @__PURE__ */ _jsxDEV("div", {
							style: { marginBottom: "2rem" },
							children: [
								/* @__PURE__ */ _jsxDEV("div", {
									style: {
										display: "flex",
										justifycontent: "space-between",
										alignItems: "center",
										marginBottom: "1.5rem"
									},
									children: [/* @__PURE__ */ _jsxDEV("h3", {
										style: {
											fontSize: "1.1rem",
											fontWeight: 600,
											color: "#333"
										},
										children: "Select Shipping Address *"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 607,
										columnNumber: 25
									}, this), authUser && /* @__PURE__ */ _jsxDEV("button", {
										className: "btn btn-secondary",
										style: {
											padding: "0.4rem 0.8rem",
											fontSize: "0.8rem"
										},
										onClick: () => {
											setShippingForm({
												fullName: "",
												phone: "",
												addressLine: "",
												city: "",
												state: "",
												zipCode: ""
											});
											setShowNewAddressForm((prev) => !prev);
											setAddressMessage("");
										},
										children: showNewAddressForm ? "Cancel" : "+ Add New Address"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 609,
										columnNumber: 29
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 606,
									columnNumber: 21
								}, this),
								addressMessage && /* @__PURE__ */ _jsxDEV("div", {
									className: "profile-message error",
									style: { marginBottom: "1rem" },
									children: addressMessage
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 619,
									columnNumber: 40
								}, this),
								showNewAddressForm && /* @__PURE__ */ _jsxDEV("form", {
									onSubmit: handleAddAddress,
									style: {
										background: "#FAF9F6",
										border: "1.5px solid #E6E4E0",
										padding: "1.8rem",
										borderRadius: "12px",
										marginBottom: "2rem"
									},
									children: [
										/* @__PURE__ */ _jsxDEV("h4", {
											style: {
												fontSize: "1rem",
												fontWeight: 600,
												marginBottom: "1.2rem",
												color: "#2D2A26"
											},
											children: "New Shipping Address"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 623,
											columnNumber: 29
										}, this),
										/* @__PURE__ */ _jsxDEV("div", {
											className: "profile-grid",
											children: [
												/* @__PURE__ */ _jsxDEV("label", {
													className: "profile-field",
													children: [/* @__PURE__ */ _jsxDEV("span", { children: "Contact Name *" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 626,
														columnNumber: 37
													}, this), /* @__PURE__ */ _jsxDEV("input", {
														className: "profile-input",
														value: shippingForm.fullName,
														onChange: (e) => setShippingForm({
															...shippingForm,
															fullName: e.target.value
														}),
														required: true
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 627,
														columnNumber: 37
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 625,
													columnNumber: 33
												}, this),
												/* @__PURE__ */ _jsxDEV("label", {
													className: "profile-field",
													children: [/* @__PURE__ */ _jsxDEV("span", { children: "Phone Number *" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 630,
														columnNumber: 37
													}, this), /* @__PURE__ */ _jsxDEV("input", {
														className: "profile-input",
														value: shippingForm.phone,
														onChange: (e) => setShippingForm({
															...shippingForm,
															phone: e.target.value
														}),
														required: true
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 631,
														columnNumber: 37
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 629,
													columnNumber: 33
												}, this),
												/* @__PURE__ */ _jsxDEV("label", {
													className: "profile-field profile-span-2",
													children: [/* @__PURE__ */ _jsxDEV("span", { children: "Address Line *" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 634,
														columnNumber: 37
													}, this), /* @__PURE__ */ _jsxDEV("input", {
														className: "profile-input",
														value: shippingForm.addressLine,
														onChange: (e) => setShippingForm({
															...shippingForm,
															addressLine: e.target.value
														}),
														required: true
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 635,
														columnNumber: 37
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 633,
													columnNumber: 33
												}, this),
												/* @__PURE__ */ _jsxDEV("label", {
													className: "profile-field",
													children: [/* @__PURE__ */ _jsxDEV("span", { children: "City *" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 638,
														columnNumber: 37
													}, this), /* @__PURE__ */ _jsxDEV("input", {
														className: "profile-input",
														value: shippingForm.city,
														onChange: (e) => setShippingForm({
															...shippingForm,
															city: e.target.value
														}),
														required: true
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 639,
														columnNumber: 37
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 637,
													columnNumber: 33
												}, this),
												/* @__PURE__ */ _jsxDEV("label", {
													className: "profile-field",
													children: [/* @__PURE__ */ _jsxDEV("span", { children: "State *" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 642,
														columnNumber: 37
													}, this), /* @__PURE__ */ _jsxDEV("input", {
														className: "profile-input",
														value: shippingForm.state,
														onChange: (e) => setShippingForm({
															...shippingForm,
															state: e.target.value
														}),
														required: true
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 643,
														columnNumber: 37
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 641,
													columnNumber: 33
												}, this),
												/* @__PURE__ */ _jsxDEV("label", {
													className: "profile-field",
													children: [/* @__PURE__ */ _jsxDEV("span", { children: "ZIP / Postal Code *" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 646,
														columnNumber: 37
													}, this), /* @__PURE__ */ _jsxDEV("input", {
														className: "profile-input",
														value: shippingForm.zipCode,
														onChange: (e) => setShippingForm({
															...shippingForm,
															zipCode: e.target.value
														}),
														required: true,
														style: { letterSpacing: "0.1em" },
														placeholder: "6 digits"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 647,
														columnNumber: 37
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 645,
													columnNumber: 33
												}, this)
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 624,
											columnNumber: 29
										}, this),
										/* @__PURE__ */ _jsxDEV("button", {
											className: "btn btn-primary",
											type: "submit",
											style: {
												marginTop: "1.2rem",
												padding: "0.75rem 1.8rem",
												borderRadius: "50px"
											},
											children: "Save and Use Address"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 650,
											columnNumber: 29
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 622,
									columnNumber: 25
								}, this),
								addresses.length === 0 ? /* @__PURE__ */ _jsxDEV("div", {
									style: {
										background: "#fafafa",
										border: "1px dashed #ccc",
										padding: "2.5rem 1.5rem",
										borderRadius: "12px",
										textAlign: "center"
									},
									children: [
										/* @__PURE__ */ _jsxDEV("p", {
											style: {
												fontSize: "0.92rem",
												color: "#6C6863",
												marginBottom: "1.2rem"
											},
											children: "You don't have any saved shipping addresses."
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 656,
											columnNumber: 29
										}, this),
										!showNewAddressForm && authUser && /* @__PURE__ */ _jsxDEV("button", {
											className: "btn btn-primary",
											onClick: () => setShowNewAddressForm(true),
											children: "+ Add Shipping Address"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 658,
											columnNumber: 33
										}, this),
										!authUser && /* @__PURE__ */ _jsxDEV("p", {
											style: {
												fontSize: "0.85rem",
												color: "#999"
											},
											children: "Please sign in to save and manage shipping addresses."
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 661,
											columnNumber: 33
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 655,
									columnNumber: 25
								}, this) : /* @__PURE__ */ _jsxDEV("div", {
									style: {
										display: "grid",
										gridTemplateColumns: "1fr",
										gap: "1.2rem"
									},
									children: addresses.map((addr) => {
										const isSelected = selectedAddressID === addr.id;
										return /* @__PURE__ */ _jsxDEV("div", {
											onClick: () => setSelectedAddressID(addr.id),
											style: {
												border: isSelected ? "2px solid #D4A373" : "1px solid #E6E4E0",
												borderRadius: "12px",
												padding: "1.5rem",
												background: isSelected ? "#FAF3ED" : "#fff",
												cursor: "pointer",
												position: "relative",
												transition: "all 0.3s ease",
												boxShadow: isSelected ? "0 6px 15px rgba(212,163,115,0.12)" : "none"
											},
											children: [
												/* @__PURE__ */ _jsxDEV("div", {
													style: {
														display: "flex",
														alignItems: "center",
														gap: "10px",
														marginBottom: "0.5rem"
													},
													children: [
														/* @__PURE__ */ _jsxDEV("input", {
															type: "radio",
															checked: isSelected,
															onChange: () => setSelectedAddressID(addr.id),
															style: {
																cursor: "pointer",
																accentColor: "#D4A373"
															}
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 684,
															columnNumber: 45
														}, this),
														/* @__PURE__ */ _jsxDEV("h4", {
															style: {
																fontSize: "0.98rem",
																fontWeight: 600,
																margin: 0,
																color: "#2D2A26"
															},
															children: addr.fullName
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 690,
															columnNumber: 45
														}, this),
														addr.isDefault && /* @__PURE__ */ _jsxDEV("span", {
															style: {
																background: "#FFE5D9",
																color: "#8F5E36",
																fontSize: "0.65rem",
																padding: "3px 8px",
																borderRadius: "20px",
																fontWeight: "700",
																textTransform: "uppercase",
																letterSpacing: "0.05em"
															},
															children: "Default"
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 691,
															columnNumber: 64
														}, this)
													]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 683,
													columnNumber: 41
												}, this),
												/* @__PURE__ */ _jsxDEV("p", {
													style: {
														fontSize: "0.88rem",
														color: "#6C6863",
														margin: "0.2rem 0 0.2rem 24px",
														lineHeight: "1.5"
													},
													children: addr.addressLine
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 693,
													columnNumber: 41
												}, this),
												/* @__PURE__ */ _jsxDEV("p", {
													style: {
														fontSize: "0.88rem",
														color: "#6C6863",
														margin: "0 0 0.2rem 24px",
														lineHeight: "1.5"
													},
													children: [
														addr.city,
														", ",
														addr.state,
														" - ",
														addr.zipCode
													]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 694,
													columnNumber: 41
												}, this),
												/* @__PURE__ */ _jsxDEV("p", {
													style: {
														fontSize: "0.88rem",
														color: "#6C6863",
														margin: "0 0 0 24px"
													},
													children: ["Phone: ", /* @__PURE__ */ _jsxDEV("strong", { children: addr.phone }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 695,
														columnNumber: 121
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 695,
													columnNumber: 41
												}, this)
											]
										}, addr.id, true, {
											fileName: _jsxFileName,
											lineNumber: 669,
											columnNumber: 37
										}, this);
									})
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 665,
									columnNumber: 25
								}, this),
								isInstantDeliveryBlocked && /* @__PURE__ */ _jsxDEV("div", {
									style: {
										background: "#FDF2F2",
										border: "1.5px solid #F8D7DA",
										color: "#721C24",
										borderRadius: "12px",
										padding: "1.2rem",
										marginTop: "1.5rem",
										fontSize: "0.9rem",
										lineHeight: "1.5",
										display: "flex",
										alignItems: "flex-start",
										gap: "12px"
									},
									children: [/* @__PURE__ */ _jsxDEV("svg", {
										width: "22",
										height: "22",
										viewBox: "0 0 24 24",
										fill: "none",
										stroke: "currentColor",
										strokeWidth: "2",
										strokeLinecap: "round",
										strokeLinejoin: "round",
										style: {
											color: "#721C24",
											flexShrink: 0
										},
										children: [
											/* @__PURE__ */ _jsxDEV("path", { d: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 718,
												columnNumber: 33
											}, this),
											/* @__PURE__ */ _jsxDEV("line", {
												x1: "12",
												y1: "9",
												x2: "12",
												y2: "13"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 719,
												columnNumber: 33
											}, this),
											/* @__PURE__ */ _jsxDEV("line", {
												x1: "12",
												y1: "17",
												x2: "12.01",
												y2: "17"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 720,
												columnNumber: 33
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 717,
										columnNumber: 29
									}, this), /* @__PURE__ */ _jsxDEV("div", { children: [
										/* @__PURE__ */ _jsxDEV("strong", { children: "Local Instant Courier Blocked:" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 723,
											columnNumber: 33
										}, this),
										" Your shipping address city (",
										activeAddr?.city || "Selected location",
										") is outside the Hyderabad/Secunderabad delivery radius.",
										/* @__PURE__ */ _jsxDEV("br", {}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 723,
											columnNumber: 206
										}, this),
										/* @__PURE__ */ _jsxDEV("span", {
											style: {
												fontSize: "0.85rem",
												color: "#90242E",
												marginTop: "0.4rem",
												display: "block"
											},
											children: "To proceed, select standard nationwide delivery, pick up in boutique, or update your shipping address."
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 724,
											columnNumber: 33
										}, this)
									] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 722,
										columnNumber: 29
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 704,
									columnNumber: 25
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 605,
							columnNumber: 17
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 346,
					columnNumber: 17
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
							lineNumber: 745,
							columnNumber: 21
						}, this),
						/* @__PURE__ */ _jsxDEV("div", {
							style: {
								maxHeight: "180px",
								overflowY: "auto",
								marginBottom: "1rem",
								padding: "0.5rem 0.6rem",
								backgroundColor: "#FAF7F4",
								borderRadius: "10px",
								border: "1px solid rgba(212, 163, 115, 0.18)",
								display: "flex",
								flexDirection: "column",
								gap: "0.5rem"
							},
							children: cart.map((item, idx) => /* @__PURE__ */ _jsxDEV("div", {
								style: {
									display: "flex",
									alignItems: "center",
									gap: "0.6rem",
									fontSize: "0.78rem"
								},
								children: [
									/* @__PURE__ */ _jsxDEV("img", {
										src: item.imageUrl,
										alt: item.name,
										style: {
											width: "36px",
											height: "36px",
											borderRadius: "8px",
											objectFit: "cover",
											border: "1px solid rgba(212, 163, 115, 0.25)"
										}
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 773,
										columnNumber: 33
									}, this),
									/* @__PURE__ */ _jsxDEV("div", {
										style: {
											flex: 1,
											minWidth: 0
										},
										children: [/* @__PURE__ */ _jsxDEV("div", {
											style: {
												fontWeight: "500",
												whiteSpace: "nowrap",
												overflow: "hidden",
												textOverflow: "ellipsis",
												color: "#2D2A26"
											},
											children: item.name
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 775,
											columnNumber: 37
										}, this), /* @__PURE__ */ _jsxDEV("div", {
											style: {
												color: "#8C8883",
												fontSize: "0.72rem"
											},
											children: [
												"Qty: ",
												item.quantity || 1,
												" ",
												item.size ? `| Size: ${item.size}` : ""
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 776,
											columnNumber: 37
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 774,
										columnNumber: 33
									}, this),
									/* @__PURE__ */ _jsxDEV("div", {
										style: {
											fontWeight: "600",
											color: "#8F5E36"
										},
										children: ["₹", (item.price * (item.quantity || 1)).toLocaleString("en-IN")]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 778,
										columnNumber: 33
									}, this)
								]
							}, idx, true, {
								fileName: _jsxFileName,
								lineNumber: 772,
								columnNumber: 29
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 759,
							columnNumber: 21
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
									children: [/* @__PURE__ */ _jsxDEV("span", { children: [
										"Subtotal (",
										cart.reduce((sum, item) => sum + (item.quantity || 1), 0),
										" items):"
									] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 785,
										columnNumber: 29
									}, this), /* @__PURE__ */ _jsxDEV("span", {
										style: {
											fontWeight: "600",
											color: "#2D2A26"
										},
										children: ["₹", subtotal.toLocaleString("en-IN")]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 786,
										columnNumber: 29
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 784,
									columnNumber: 25
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
										"):"
									] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 790,
										columnNumber: 33
									}, this), /* @__PURE__ */ _jsxDEV("span", { children: ["-₹", discount.amt.toLocaleString("en-IN")] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 791,
										columnNumber: 33
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 789,
									columnNumber: 29
								}, this),
								/* @__PURE__ */ _jsxDEV("div", {
									style: {
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
										color: "#6C6863"
									},
									children: [/* @__PURE__ */ _jsxDEV("span", { children: "Delivery Mode:" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 795,
										columnNumber: 29
									}, this), /* @__PURE__ */ _jsxDEV("span", {
										style: {
											backgroundColor: "#FAF3ED",
											color: "#8F5E36",
											padding: "2px 8px",
											borderRadius: "20px",
											fontWeight: "600",
											fontSize: "0.75rem",
											border: "1px solid rgba(212,163,115,0.25)",
											textTransform: "capitalize"
										},
										children: checkoutType.replace("_", " ")
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 796,
										columnNumber: 29
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 794,
									columnNumber: 25
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
										children: "Total Amount:"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 801,
										columnNumber: 29
									}, this), /* @__PURE__ */ _jsxDEV("strong", {
										style: {
											fontSize: "1.1rem",
											color: "#8F5E36",
											fontFamily: "var(--font-body)"
										},
										children: ["₹", finalTotal.toLocaleString("en-IN")]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 802,
										columnNumber: 29
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 800,
									columnNumber: 25
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 783,
							columnNumber: 21
						}, this),
						/* @__PURE__ */ _jsxDEV("button", {
							onClick: placeOrder,
							style: {
								marginTop: "0.9rem",
								width: "100%",
								height: "38px",
								padding: "0",
								fontSize: "0.85rem",
								fontWeight: "600",
								borderRadius: "50px",
								letterSpacing: "0.02em",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								background: "linear-gradient(135deg, #D4A373 0%, #C49363 100%)",
								color: "#FFF",
								border: "none",
								cursor: ordering ? "not-allowed" : "pointer",
								boxShadow: "0 4px 15px rgba(212, 163, 115, 0.25)",
								transition: "all 0.3s ease"
							},
							disabled: ordering || checkoutType !== "pickup" && addresses.length === 0 || isInstantDeliveryBlocked,
							children: ordering ? "Verifying Stock..." : checkoutType === "pickup" && paymentMethod === "offline_qr" ? "Book Store Pickup Pass" : "Secure Checkout & Prepay"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 806,
							columnNumber: 21
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 736,
					columnNumber: 17
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 344,
				columnNumber: 13
			}, this),
			showLeaveModal && /* @__PURE__ */ _jsxDEV("div", {
				style: {
					position: "fixed",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					backgroundColor: "rgba(45, 42, 38, 0.45)",
					backdropFilter: "blur(8px)",
					WebkitBackdropFilter: "blur(8px)",
					zIndex: 99999,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					padding: "1.25rem"
				},
				children: /* @__PURE__ */ _jsxDEV("div", {
					style: {
						background: "#FFF",
						borderRadius: "20px",
						padding: "1.75rem 1.5rem",
						maxWidth: "380px",
						width: "100%",
						boxShadow: "0 25px 50px rgba(0,0,0,0.18)",
						border: "1px solid rgba(212, 163, 115, 0.3)"
					},
					children: [
						/* @__PURE__ */ _jsxDEV("div", {
							style: {
								width: "48px",
								height: "48px",
								borderRadius: "50%",
								backgroundColor: "#FAF7F4",
								border: "1.5px solid rgba(212, 163, 115, 0.35)",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								margin: "0 auto 0.85rem auto",
								color: "#B97A66"
							},
							children: /* @__PURE__ */ _jsxDEV("svg", {
								width: "22",
								height: "22",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: "1.8",
								strokeLinecap: "round",
								strokeLinejoin: "round",
								children: /* @__PURE__ */ _jsxDEV("path", { d: "M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 875,
									columnNumber: 33
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 874,
								columnNumber: 29
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 862,
							columnNumber: 25
						}, this),
						/* @__PURE__ */ _jsxDEV("h3", {
							style: {
								margin: "0 0 0.5rem 0",
								fontFamily: "var(--font-heading)",
								fontSize: "1.25rem",
								color: "#2D2A26"
							},
							children: "Leave Checkout?"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 878,
							columnNumber: 25
						}, this),
						/* @__PURE__ */ _jsxDEV("p", {
							style: {
								margin: "0 0 1.5rem 0",
								fontSize: "0.88rem",
								color: "#686461",
								lineHeight: "1.55"
							},
							children: "Are you sure you want to leave checkout? Your items and cart selections are safely saved."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 881,
							columnNumber: 25
						}, this),
						/* @__PURE__ */ _jsxDEV("div", {
							style: {
								display: "flex",
								gap: "0.75rem"
							},
							children: [/* @__PURE__ */ _jsxDEV("button", {
								onClick: () => setShowLeaveModal(false),
								style: {
									flex: 1,
									height: "42px",
									borderRadius: "50px",
									border: "1px solid rgba(212, 163, 115, 0.35)",
									background: "#FAF7F4",
									color: "#5C5853",
									fontSize: "0.85rem",
									fontWeight: "500",
									cursor: "pointer"
								},
								children: "Stay Here"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 885,
								columnNumber: 29
							}, this), /* @__PURE__ */ _jsxDEV("button", {
								onClick: confirmLeaveCheckout,
								style: {
									flex: 1,
									height: "42px",
									borderRadius: "50px",
									border: "none",
									background: "linear-gradient(135deg, #B97A66 0%, #A46855 100%)",
									color: "#FFF",
									fontSize: "0.85rem",
									fontWeight: "600",
									cursor: "pointer",
									boxShadow: "0 4px 12px rgba(185, 122, 102, 0.25)"
								},
								children: "Leave Checkout"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 901,
								columnNumber: 29
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 884,
							columnNumber: 25
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 853,
					columnNumber: 21
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 838,
				columnNumber: 17
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 333,
		columnNumber: 9
	}, this);
};
_s(Checkout, "ZH+AqpxSiFl23C2xubDIxfeZHdk=", false, function() {
	return [useNavigate];
});
_c = Checkout;
export default Checkout;
var _c;
$RefreshReg$(_c, "Checkout");
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;
import * as __vite_react_currentExports from "/src/pages/Checkout.jsx";
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }

  const currentExports = __vite_react_currentExports;
  queueMicrotask(() => {
    RefreshRuntime.registerExportsForReactRefresh("D:/The Ethnic Touch/frontend/src/pages/Checkout.jsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("D:/The Ethnic Touch/frontend/src/pages/Checkout.jsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
function $RefreshReg$(type, id) { return RefreshRuntime.register(type, "D:/The Ethnic Touch/frontend/src/pages/Checkout.jsx" + ' ' + id); }
function $RefreshSig$() { return RefreshRuntime.createSignatureFunctionForTransform(); }

//# sourceMappingURL=data:application/json;base64,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WjtrQkFDSDtPQUVPOzs7O2lCQUNSLHdCQUFDLFVBQUQ7UUFDSSxTQUFTO1FBQ1QsT0FBTztTQUNILE1BQU07U0FDTixRQUFRO1NBQ1IsY0FBYztTQUNkLFFBQVE7U0FDUixZQUFZO1NBQ1osT0FBTztTQUNQLFVBQVU7U0FDVixZQUFZO1NBQ1osUUFBUTtTQUNSLFdBQVc7UUFDZjtrQkFDSDtPQUVPOzs7O2VBQ1A7Ozs7OztLQUNKOzs7Ozs7R0FDSjs7Ozs7RUFFUjs7Ozs7O0FBRWI7Ozs7O0FBRUEsZUFBZSIsIm5hbWVzIjpbXSwic291cmNlcyI6WyJDaGVja291dC5qc3giXSwidmVyc2lvbiI6Mywic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QsIHVzZVJlZiB9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgdXNlTmF2aWdhdGUsIExpbmssIHVzZUxvY2F0aW9uLCB1c2VQYXJhbXMsIFJvdXRlcywgUm91dGUsIE5hdmlnYXRlLCBCcm93c2VyUm91dGVyIH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSc7XHJcbmltcG9ydCBDYXJ0IGZyb20gJy4vQ2FydCc7XHJcbmltcG9ydCB7IEFQSV9CQVNFX1VSTCB9IGZyb20gJy4uL2RhdGEvY29uZmlnJztcclxuaW1wb3J0IHsgZmV0Y2hXaXRoQXV0aCB9IGZyb20gJy4uL3V0aWxzL2FwaUNsaWVudCc7XHJcblxyXG5jb25zdCBzaG93QWxlcnQgPSAobWVzc2FnZSwgdGl0bGUgPSBcIk5vdGljZVwiLCB0eXBlID0gXCJ3YXJuaW5nXCIpID0+IHtcclxuICAgIGlmICh3aW5kb3cuY3VzdG9tQWxlcnQpIHtcclxuICAgICAgICB3aW5kb3cuY3VzdG9tQWxlcnQobWVzc2FnZSwgdGl0bGUsIHR5cGUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBhbGVydChgJHt0aXRsZX06ICR7bWVzc2FnZX1gKTtcclxuICAgIH1cclxufTtcclxuXHJcbmNvbnN0IENoZWNrb3V0ID0gKHsgY2FydCwgZGlzY291bnQsIGNsZWFyQ2FydCwgYXV0aFVzZXIsIGF1dGhMb2FkaW5nIH0pID0+IHtcclxuICAgIGNvbnN0IFtlbWFpbCwgc2V0RW1haWxdID0gdXNlU3RhdGUoJycpO1xyXG4gICAgY29uc3QgW2FkZHJlc3Nlcywgc2V0QWRkcmVzc2VzXSA9IHVzZVN0YXRlKFtdKTtcclxuICAgIGNvbnN0IFtzZWxlY3RlZEFkZHJlc3NJRCwgc2V0U2VsZWN0ZWRBZGRyZXNzSURdID0gdXNlU3RhdGUobnVsbCk7XHJcbiAgICBjb25zdCBbY2hlY2tvdXRUeXBlLCBzZXRDaGVja291dFR5cGVdID0gdXNlU3RhdGUoJ2RlbGl2ZXJ5Jyk7IC8vICdkZWxpdmVyeScgfCAncGlja3VwJyB8ICdoeWRlcmFiYWRfaW5zdGFudCdcclxuICAgIGNvbnN0IFtwYXltZW50TWV0aG9kLCBzZXRQYXltZW50TWV0aG9kXSA9IHVzZVN0YXRlKCdvbmxpbmUnKTsgLy8gJ29ubGluZScgfCAnb2ZmbGluZV9xcidcclxuICAgIGNvbnN0IFtzaGlwcGluZ0Zvcm0sIHNldFNoaXBwaW5nRm9ybV0gPSB1c2VTdGF0ZSh7XHJcbiAgICAgICAgZnVsbE5hbWU6ICcnLFxyXG4gICAgICAgIHBob25lOiAnJyxcclxuICAgICAgICBhZGRyZXNzTGluZTogJycsXHJcbiAgICAgICAgY2l0eTogJycsXHJcbiAgICAgICAgc3RhdGU6ICcnLFxyXG4gICAgICAgIHppcENvZGU6ICcnXHJcbiAgICB9KTtcclxuICAgIGNvbnN0IFtzaG93TmV3QWRkcmVzc0Zvcm0sIHNldFNob3dOZXdBZGRyZXNzRm9ybV0gPSB1c2VTdGF0ZShmYWxzZSk7XHJcbiAgICBjb25zdCBbYWRkcmVzc01lc3NhZ2UsIHNldEFkZHJlc3NNZXNzYWdlXSA9IHVzZVN0YXRlKCcnKTtcclxuICAgIGNvbnN0IFtvcmRlcmluZywgc2V0T3JkZXJpbmddID0gdXNlU3RhdGUoZmFsc2UpO1xyXG4gICAgY29uc3QgW3Nob3dMZWF2ZU1vZGFsLCBzZXRTaG93TGVhdmVNb2RhbF0gPSB1c2VTdGF0ZShmYWxzZSk7XHJcbiAgICBjb25zdCBbcGVuZGluZ1BheW1lbnRPcmRlciwgc2V0UGVuZGluZ1BheW1lbnRPcmRlcl0gPSB1c2VTdGF0ZShudWxsKTtcclxuICAgIGNvbnN0IFt2ZXJpZnlpbmdQYXltZW50LCBzZXRWZXJpZnlpbmdQYXltZW50XSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuICAgIGNvbnN0IG5hdmlnYXRlID0gdXNlTmF2aWdhdGUoKTtcclxuICAgIGNvbnN0IHBheW1lbnRDb21wbGV0ZVJlZiA9IHVzZVJlZihmYWxzZSk7XHJcblxyXG4gICAgY29uc3QgaGFuZGxlQmFja0NsaWNrID0gKGUpID0+IHtcclxuICAgICAgICBpZiAoZSkgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHNldFNob3dMZWF2ZU1vZGFsKHRydWUpO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBjb25maXJtTGVhdmVDaGVja291dCA9ICgpID0+IHtcclxuICAgICAgICBzZXRTaG93TGVhdmVNb2RhbChmYWxzZSk7XHJcbiAgICAgICAgaWYgKHdpbmRvdy5oaXN0b3J5LnN0YXRlICYmIHdpbmRvdy5oaXN0b3J5LnN0YXRlLmlkeCA+IDApIHtcclxuICAgICAgICAgICAgbmF2aWdhdGUoLTEpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG5hdmlnYXRlKCcvY2FydCcpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgICAgICBpZiAocGF5bWVudENvbXBsZXRlUmVmLmN1cnJlbnQpIHJldHVybjtcclxuICAgICAgICBpZiAoYXV0aExvYWRpbmcpIHJldHVybjsgLy8gV2FpdCBmb3IgRmlyZWJhc2Ugc2Vzc2lvbiByZXN0b3JhdGlvbiBvbiBwYWdlIHJlZnJlc2hcclxuICAgICAgICBpZiAoIWF1dGhVc2VyKSB7XHJcbiAgICAgICAgICAgIG5hdmlnYXRlKCcvYXV0aD9yZWRpcmVjdD0vY2hlY2tvdXQnKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWNhcnQgfHwgY2FydC5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgbmF2aWdhdGUoJy9jYXJ0Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSwgW2NhcnQsIGF1dGhVc2VyLCBhdXRoTG9hZGluZywgbmF2aWdhdGVdKTtcclxuXHJcbiAgICBjb25zdCBzdWJ0b3RhbCA9IGNhcnQucmVkdWNlKChzdW0sIGl0ZW0pID0+IHN1bSArIGl0ZW0ucHJpY2UgKiAoaXRlbS5xdWFudGl0eSB8fCAxKSwgMCk7XHJcbiAgICBjb25zdCBmaW5hbFRvdGFsID0gc3VidG90YWwgLSAoZGlzY291bnQ/LmFtdCB8fCAwKTtcclxuXHJcbiAgICBjb25zdCBhY3RpdmVBZGRyID0gYXV0aFVzZXIgJiYgYWRkcmVzc2VzLmxlbmd0aCA+IDAgPyBhZGRyZXNzZXMuZmluZChhID0+IGEuaWQgPT09IHNlbGVjdGVkQWRkcmVzc0lEKSA6IG51bGw7XHJcbiAgICBjb25zdCBpc0NpdHlIeWRlcmFiYWQgPSBhY3RpdmVBZGRyICYmIChcclxuICAgICAgICBhY3RpdmVBZGRyLmNpdHkudG9Mb3dlckNhc2UoKS50cmltKCkgPT09ICdoeWRlcmFiYWQnIHx8XHJcbiAgICAgICAgYWN0aXZlQWRkci5jaXR5LnRvTG93ZXJDYXNlKCkudHJpbSgpID09PSAnc2VjdW5kZXJhYmFkJ1xyXG4gICAgKTtcclxuICAgIGNvbnN0IGlzSW5zdGFudERlbGl2ZXJ5QmxvY2tlZCA9IGNoZWNrb3V0VHlwZSA9PT0gJ2h5ZGVyYWJhZF9pbnN0YW50JyAmJiBhY3RpdmVBZGRyICYmICFpc0NpdHlIeWRlcmFiYWQ7XHJcblxyXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgICAgICBpZiAoYXV0aFVzZXIpIHtcclxuICAgICAgICAgICAgc2V0RW1haWwoYXV0aFVzZXIuZW1haWwgfHwgJycpO1xyXG5cclxuICAgICAgICAgICAgZmV0Y2goYCR7QVBJX0JBU0VfVVJMfS9hcGkvcHJvZmlsZS9tZWAsIHtcclxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsgJ1gtVXNlci1JZCc6IGF1dGhVc2VyLnVpZCB9XHJcbiAgICAgICAgICAgIH0pLnRoZW4ociA9PiByLmpzb24oKSkudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmVtYWlsKSBzZXRFbWFpbChkYXRhLmVtYWlsKTtcclxuICAgICAgICAgICAgfSkuY2F0Y2goZXJyID0+IGNvbnNvbGUuZXJyb3IoZXJyKSk7XHJcblxyXG4gICAgICAgICAgICBsb2FkQWRkcmVzc2VzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSwgW2F1dGhVc2VyXSk7XHJcblxyXG4gICAgY29uc3QgbG9hZEFkZHJlc3NlcyA9IGFzeW5jICgpID0+IHtcclxuICAgICAgICBpZiAoIWF1dGhVc2VyKSByZXR1cm47XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHtBUElfQkFTRV9VUkx9L2FwaS9wcm9maWxlL2FkZHJlc3Nlc2AsIHtcclxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsgJ1gtVXNlci1JZCc6IGF1dGhVc2VyLnVpZCB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uub2spIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgICAgICAgICAgICBzZXRBZGRyZXNzZXMoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRlZiA9IGRhdGEuZmluZChhID0+IGEuaXNEZWZhdWx0KTtcclxuICAgICAgICAgICAgICAgIGlmIChkZWYpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRTZWxlY3RlZEFkZHJlc3NJRChkZWYuaWQpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChkYXRhLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRTZWxlY3RlZEFkZHJlc3NJRChkYXRhWzBdLmlkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBoYW5kbGVBZGRBZGRyZXNzID0gYXN5bmMgKGUpID0+IHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgc2V0QWRkcmVzc01lc3NhZ2UoJycpO1xyXG4gICAgICAgIGlmICghYXV0aFVzZXIpIHJldHVybjtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke0FQSV9CQVNFX1VSTH0vYXBpL3Byb2ZpbGUvYWRkcmVzc2VzYCwge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcclxuICAgICAgICAgICAgICAgICAgICAnWC1Vc2VyLUlkJzogYXV0aFVzZXIudWlkXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoc2hpcHBpbmdGb3JtKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGV4dCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcih0ZXh0IHx8ICdGYWlsZWQgdG8gc2F2ZSBhZGRyZXNzJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3Qgc2F2ZWQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgICAgICAgIHNldFNoaXBwaW5nRm9ybSh7IGZ1bGxOYW1lOiAnJywgcGhvbmU6ICcnLCBhZGRyZXNzTGluZTogJycsIGNpdHk6ICcnLCBzdGF0ZTogJycsIHppcENvZGU6ICcnIH0pO1xyXG4gICAgICAgICAgICBzZXRTaG93TmV3QWRkcmVzc0Zvcm0oZmFsc2UpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY29uc3QgbG9hZFJlcyA9IGF3YWl0IGZldGNoKGAke0FQSV9CQVNFX1VSTH0vYXBpL3Byb2ZpbGUvYWRkcmVzc2VzYCwge1xyXG4gICAgICAgICAgICAgICAgaGVhZGVyczogeyAnWC1Vc2VyLUlkJzogYXV0aFVzZXIudWlkIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGlmIChsb2FkUmVzLm9rKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgbG9hZFJlcy5qc29uKCk7XHJcbiAgICAgICAgICAgICAgICBzZXRBZGRyZXNzZXMoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0U2VsZWN0ZWRBZGRyZXNzSUQoZGF0YVswXS5pZCk7IFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgIHNldEFkZHJlc3NNZXNzYWdlKGVyci5tZXNzYWdlKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IHBsYWNlT3JkZXIgPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgaWYgKCFhdXRoVXNlcikge1xyXG4gICAgICAgICAgICBuYXZpZ2F0ZSgnL2F1dGg/cmVkaXJlY3Q9L2NoZWNrb3V0Jyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFlbWFpbCkgcmV0dXJuIHNob3dBbGVydCgnUGxlYXNlIGVudGVyIHlvdXIgZW1haWwgYWRkcmVzcyBiZWZvcmUgcGxhY2luZyBhbiBvcmRlci4nLCAnRW1haWwgUmVxdWlyZWQnLCAnd2FybmluZycpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBvcmRlciA9IHt9O1xyXG4gICAgICAgIGlmIChjaGVja291dFR5cGUgPT09ICdwaWNrdXAnKSB7XHJcbiAgICAgICAgICAgIG9yZGVyID0ge1xyXG4gICAgICAgICAgICAgICAgY3VzdG9tZXJFbWFpbDogZW1haWwsXHJcbiAgICAgICAgICAgICAgICBjb3Vwb25Db2RlOiBkaXNjb3VudD8uY29kZSB8fCAnJyxcclxuICAgICAgICAgICAgICAgIGl0ZW1zOiBjYXJ0Lm1hcChpdGVtID0+ICh7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvZHVjdElkOiBpdGVtLmlkLFxyXG4gICAgICAgICAgICAgICAgICAgIHF1YW50aXR5OiBpdGVtLnF1YW50aXR5IHx8IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgc2l6ZTogaXRlbS5zaXplIHx8ICcnXHJcbiAgICAgICAgICAgICAgICB9KSksXHJcbiAgICAgICAgICAgICAgICBjaGVja291dFR5cGU6ICdwaWNrdXAnLFxyXG4gICAgICAgICAgICAgICAgcGF5bWVudE1ldGhvZDogcGF5bWVudE1ldGhvZCxcclxuICAgICAgICAgICAgICAgIHNoaXBwaW5nTmFtZTogXCJTdG9yZSBQaWNrdXAgQ3VzdG9tZXJcIixcclxuICAgICAgICAgICAgICAgIHNoaXBwaW5nUGhvbmU6IGF1dGhVc2VyPy5waG9uZSB8fCBcIjAwMDAwMDAwMDBcIixcclxuICAgICAgICAgICAgICAgIHNoaXBwaW5nQWRkcmVzczogXCJKdWJpbGVlIEhpbGxzIGJvdXRpcXVlIHBpY2t1cFwiLFxyXG4gICAgICAgICAgICAgICAgc2hpcHBpbmdDaXR5OiBcIkh5ZGVyYWJhZFwiLFxyXG4gICAgICAgICAgICAgICAgc2hpcHBpbmdTdGF0ZTogXCJUZWxhbmdhbmFcIixcclxuICAgICAgICAgICAgICAgIHNoaXBwaW5nWmlwQ29kZTogXCI1MDAwMzNcIlxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICghYWN0aXZlQWRkcikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNob3dBbGVydCgnUGxlYXNlIHNlbGVjdCBvciBhZGQgYSBzaGlwcGluZyBhZGRyZXNzIGJlZm9yZSBwYXlpbmcuJywgJ0FkZHJlc3MgUmVxdWlyZWQnLCAnd2FybmluZycpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChjaGVja291dFR5cGUgPT09ICdoeWRlcmFiYWRfaW5zdGFudCcpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNpdHkgPSAoYWN0aXZlQWRkci5jaXR5IHx8ICcnKS50cmltKCkudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgICAgIGlmIChjaXR5ICE9PSAnaHlkZXJhYmFkJyAmJiBjaXR5ICE9PSAnc2VjdW5kZXJhYmFkJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzaG93QWxlcnQoJ0luc3RhbnQgZGVsaXZlcnkgaXMgb25seSBhdmFpbGFibGUgaW5zaWRlIEh5ZGVyYWJhZC9TZWN1bmRlcmFiYWQuJywgJ0xvY2F0aW9uIFJlc3RyaWN0aW9uJywgJ3dhcm5pbmcnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnN0IHppcCA9IChhY3RpdmVBZGRyLnppcENvZGUgfHwgJycpLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgIGlmICghemlwLnN0YXJ0c1dpdGgoJzUwMCcpIHx8IHppcC5sZW5ndGggIT09IDYpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2hvd0FsZXJ0KCdJbnN0YW50IGRlbGl2ZXJ5IHJlcXVpcmVzIGEgbG9jYWwgSHlkZXJhYmFkIHBpbmNvZGUgc3RhcnRpbmcgd2l0aCA1MDAgKGUuZy4sIDUwMDA4MSkuJywgJ1BpbmNvZGUgUmVxdWlyZWQnLCAnd2FybmluZycpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9yZGVyID0ge1xyXG4gICAgICAgICAgICAgICAgY3VzdG9tZXJFbWFpbDogZW1haWwsXHJcbiAgICAgICAgICAgICAgICBjb3Vwb25Db2RlOiBkaXNjb3VudD8uY29kZSB8fCAnJyxcclxuICAgICAgICAgICAgICAgIGl0ZW1zOiBjYXJ0Lm1hcChpdGVtID0+ICh7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvZHVjdElkOiBpdGVtLmlkLFxyXG4gICAgICAgICAgICAgICAgICAgIHF1YW50aXR5OiBpdGVtLnF1YW50aXR5IHx8IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgc2l6ZTogaXRlbS5zaXplIHx8ICcnXHJcbiAgICAgICAgICAgICAgICB9KSksXHJcbiAgICAgICAgICAgICAgICBjaGVja291dFR5cGU6IGNoZWNrb3V0VHlwZSxcclxuICAgICAgICAgICAgICAgIHBheW1lbnRNZXRob2Q6ICdvbmxpbmUnLFxyXG4gICAgICAgICAgICAgICAgc2hpcHBpbmdOYW1lOiBhY3RpdmVBZGRyLmZ1bGxOYW1lLFxyXG4gICAgICAgICAgICAgICAgc2hpcHBpbmdQaG9uZTogYWN0aXZlQWRkci5waG9uZSxcclxuICAgICAgICAgICAgICAgIHNoaXBwaW5nQWRkcmVzczogYWN0aXZlQWRkci5hZGRyZXNzTGluZSxcclxuICAgICAgICAgICAgICAgIHNoaXBwaW5nQ2l0eTogYWN0aXZlQWRkci5jaXR5LFxyXG4gICAgICAgICAgICAgICAgc2hpcHBpbmdTdGF0ZTogYWN0aXZlQWRkci5zdGF0ZSxcclxuICAgICAgICAgICAgICAgIHNoaXBwaW5nWmlwQ29kZTogYWN0aXZlQWRkci56aXBDb2RlXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXRPcmRlcmluZyh0cnVlKTtcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2hXaXRoQXV0aCgnL2FwaS9vcmRlcnMnLCB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KG9yZGVyKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmICghcmVzLm9rKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBlcnJEYXRhID0gYXdhaXQgcmVzLmpzb24oKTtcclxuICAgICAgICAgICAgICAgIHNob3dBbGVydChlcnJEYXRhLmVycm9yIHx8ICdGYWlsZWQgdG8gY3JlYXRlIG9yZGVyJywgJ09yZGVyIEVycm9yJywgJ2Vycm9yJyk7XHJcbiAgICAgICAgICAgICAgICBzZXRPcmRlcmluZyhmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXMuanNvbigpO1xyXG5cclxuICAgICAgICAgICAgLy8gSGFuZGxlIE9mZmxpbmUgU3RvcmUgUGlja3VwIFFSIENvZGVcclxuICAgICAgICAgICAgaWYgKGRhdGEucGF5bWVudE1ldGhvZCA9PT0gJ29mZmxpbmVfcXInKSB7XHJcbiAgICAgICAgICAgICAgICBwYXltZW50Q29tcGxldGVSZWYuY3VycmVudCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBjbGVhckNhcnQoKTtcclxuICAgICAgICAgICAgICAgIG5hdmlnYXRlKCcvY2hlY2tvdXQtc3VjY2VzcycsIHtcclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcmRlcklkOiBkYXRhLm9yZGVySWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrb3V0VHlwZTogJ3BpY2t1cCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBheW1lbnRNZXRob2Q6ICdvZmZsaW5lX3FyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYW1vdW50OiBkYXRhLmFtb3VudFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBIYW5kbGUgT2ZmaWNpYWwgUmF6b3JwYXkgR2F0ZXdheSBNb2RhbFxyXG4gICAgICAgICAgICBjb25zdCBpc1Jhem9ycGF5ID0gZGF0YS5jaGVja291dFVybCA9PT0gXCJyYXpvcnBheVwiIHx8IEJvb2xlYW4oZGF0YS5yYXpvcnBheUtleSkgfHwgZGF0YS5wYXltZW50TWV0aG9kID09PSBcIm9ubGluZVwiO1xyXG5cclxuICAgICAgICAgICAgaWYgKGlzUmF6b3JwYXkpIHtcclxuICAgICAgICAgICAgICAgIGlmICh3aW5kb3cuUmF6b3JwYXkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk6IGRhdGEucmF6b3JwYXlLZXkgfHwgXCJyenBfdGVzdF9tb2NrXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFtb3VudDogTWF0aC5yb3VuZChkYXRhLmFtb3VudCAqIDEwMCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbmN5OiBcIklOUlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIlRoZSBFdGhuaWMgVG91Y2hcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IGBCb3V0aXF1ZSBPcmRlciAjJHtkYXRhLm9yZGVySWR9YCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJlZmlsbDogeyBlbWFpbDogZW1haWwgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhlbWU6IHsgY29sb3I6IFwiI0I5N0E2NlwiIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZXI6IGFzeW5jIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2ZXJpZnlSZXMgPSBhd2FpdCBmZXRjaChgJHtBUElfQkFTRV9VUkx9L2FwaS9vcmRlcnMvdmVyaWZ5YCwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVySWQ6IGRhdGEub3JkZXJJZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJhem9ycGF5T3JkZXJJZDogcmVzcG9uc2UucmF6b3JwYXlfb3JkZXJfaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByYXpvcnBheVBheW1lbnRJZDogcmVzcG9uc2UucmF6b3JwYXlfcGF5bWVudF9pZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJhem9ycGF5U2lnbmF0dXJlOiByZXNwb25zZS5yYXpvcnBheV9zaWduYXR1cmUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2NrOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmVyaWZ5UmVzLm9rKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHZlcmlmeURhdGEgPSBhd2FpdCB2ZXJpZnlSZXMuanNvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXltZW50Q29tcGxldGVSZWYuY3VycmVudCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyQ2FydCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0ZSgnL2NoZWNrb3V0LXN1Y2Nlc3MnLCB7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGU6IHsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXJJZDogZGF0YS5vcmRlcklkLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnaWZ0OiB2ZXJpZnlEYXRhLmdpZnRDb2RlLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bmxvY2tlZEdpZnQ6IHZlcmlmeURhdGEudW5sb2NrZWRHaWZ0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdpZnRUeXBlOiB2ZXJpZnlEYXRhLmdpZnRUeXBlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdpZnRFeHBpcnlEYXRlOiB2ZXJpZnlEYXRhLmdpZnRFeHBpcnlEYXRlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYWNraW5nOiB2ZXJpZnlEYXRhLnRyYWNraW5nTnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrb3V0VHlwZTogY2hlY2tvdXRUeXBlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheW1lbnRNZXRob2Q6ICdvbmxpbmUnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93QWxlcnQoXCJQYXltZW50IHZlcmlmaWNhdGlvbiBmYWlsZWQuIFBsZWFzZSBjb250YWN0IGJvdXRpcXVlIHN1cHBvcnQuXCIsIFwiUGF5bWVudCBFcnJvclwiLCBcImVycm9yXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRPcmRlcmluZyhmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dBbGVydChcIk5ldHdvcmsgZXJyb3IgdmVyaWZ5aW5nIHBheW1lbnQuXCIsIFwiQ29ubmVjdGlvbiBFcnJvclwiLCBcImVycm9yXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldE9yZGVyaW5nKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbW9kYWw6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uZGlzbWlzczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0T3JkZXJpbmcoZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEucmF6b3JwYXlPcmRlcklkICYmICFkYXRhLnJhem9ycGF5T3JkZXJJZC5zdGFydHNXaXRoKFwiTU9DS19cIikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5vcmRlcl9pZCA9IGRhdGEucmF6b3JwYXlPcmRlcklkO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcnpwID0gbmV3IHdpbmRvdy5SYXpvcnBheShvcHRpb25zKTtcclxuICAgICAgICAgICAgICAgICAgICByenAub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNldE9yZGVyaW5nKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2hvd0FsZXJ0KFwiUmF6b3JwYXkgU0RLIGlzIGxvYWRpbmcuIFBsZWFzZSB0cnkgYWdhaW4gaW4gYSBtb21lbnQuXCIsIFwiU0RLIEVycm9yXCIsIFwibm90aWNlXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNldE9yZGVyaW5nKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxldCB0YXJnZXRVcmwgPSBkYXRhLmNoZWNrb3V0VXJsIHx8IGAvbW9jay1wYXltZW50P29yZGVySWQ9JHtkYXRhLm9yZGVySWR9YDtcclxuICAgICAgICAgICAgICAgIGlmICh0YXJnZXRVcmwuc3RhcnRzV2l0aCgnLyMnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFVybCA9IHRhcmdldFVybC5zdWJzdHJpbmcoMik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBuYXZpZ2F0ZSh0YXJnZXRVcmwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgIHNob3dBbGVydChcIkVycm9yIHBsYWNpbmcgb3JkZXIuIFBsZWFzZSB0cnkgYWdhaW4uXCIsIFwiT3JkZXIgRXJyb3JcIiwgXCJlcnJvclwiKTtcclxuICAgICAgICAgICAgc2V0T3JkZXJpbmcoZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgaWYgKGF1dGhMb2FkaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBwYWRkaW5nOiAnMS4yNXJlbSA1JSAzcmVtJywgbWF4V2lkdGg6ICcxMTUwcHgnLCBtYXJnaW46ICcwIGF1dG8nLCBtaW5IZWlnaHQ6ICc3NXZoJyB9fT5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2tlbGV0b24tYm94XCIgc3R5bGU9e3sgaGVpZ2h0OiAnMzZweCcsIHdpZHRoOiAnMTgwcHgnLCBib3JkZXJSYWRpdXM6ICc4cHgnLCBtYXJnaW5Cb3R0b206ICcxLjVyZW0nIH19IC8+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdncmlkJywgZ3JpZFRlbXBsYXRlQ29sdW1uczogJ3JlcGVhdChhdXRvLWZpdCwgbWlubWF4KDMwMHB4LCAxZnIpKScsIGdhcDogJzEuNXJlbScgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJza2VsZXRvbi1ib3hcIiBzdHlsZT17eyBoZWlnaHQ6ICczODBweCcsIGJvcmRlclJhZGl1czogJzE2cHgnIH19IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJza2VsZXRvbi1ib3hcIiBzdHlsZT17eyBoZWlnaHQ6ICczODBweCcsIGJvcmRlclJhZGl1czogJzE2cHgnIH19IC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hlY2tvdXQtcGFnZS1jb250YWluZXJcIiBzdHlsZT17e3BhZGRpbmc6ICcxLjI1cmVtIDUlIDNyZW0nLCBtYXhXaWR0aDogJzExNTBweCcsIG1hcmdpbjogJzAgYXV0bycsIG1pbkhlaWdodDogJzc1dmgnfX0+XHJcbiAgICAgICAgICAgIDxhIFxyXG4gICAgICAgICAgICAgICAgaHJlZj1cIiNcIiBcclxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9e2hhbmRsZUJhY2tDbGlja30gXHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjaGVja291dC1iYWNrLWxpbmtcIiBcclxuICAgICAgICAgICAgICAgIHN0eWxlPXt7IGRpc3BsYXk6ICdpbmxpbmUtZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICc2cHgnLCBtYXJnaW5Cb3R0b206ICcxcmVtJywgY29sb3I6ICd2YXIoLS1jb2xvci10ZXh0LWxpZ2h0KScsIHRleHREZWNvcmF0aW9uOiAnbm9uZScsIGZvbnRTaXplOiAnMC44NXJlbScsIGZvbnRXZWlnaHQ6ICc1MDAnIH19XHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICZsYXJyOyBCYWNrXHJcbiAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgPGgxIHN0eWxlPXt7bWFyZ2luQm90dG9tOiAnMXJlbScsIGZvbnRTaXplOiAnMS4zNXJlbScsIGZvbnRGYW1pbHk6ICd2YXIoLS1mb250LWhlYWRpbmcpJywgY29sb3I6ICd2YXIoLS1jb2xvci10ZXh0KScsIGZvbnRXZWlnaHQ6ICc0MDAnfX0+Q2hlY2tvdXQ8L2gxPlxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkZXNrdG9wLXNwbGl0LWxheW91dCBjaGVja291dC1sYXlvdXRcIiBzdHlsZT17eyBnYXA6ICcxLjI1cmVtJyB9fT5cclxuICAgICAgICAgICAgICAgIHsvKiBMZWZ0IENvbHVtbjogRGVsaXZlcnkgJiBTaGlwcGluZyBGb3JtcyAqL31cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tmbGV4OiAxLCBtaW5XaWR0aDogJzI4MHB4J319PlxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgey8qIERlbGl2ZXJ5IE1ldGhvZHMgU2VsZWN0b3IgKi99XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdncmlkJyxcclxuICAgICAgICAgICAgICAgIGdyaWRUZW1wbGF0ZUNvbHVtbnM6ICcxZnIgMWZyIDFmcicsXHJcbiAgICAgICAgICAgICAgICBnYXA6ICc4cHgnLFxyXG4gICAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOiAnMS4yNXJlbScsXHJcbiAgICAgICAgICAgIH19PlxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0Q2hlY2tvdXRUeXBlKCdkZWxpdmVyeScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRQYXltZW50TWV0aG9kKCdvbmxpbmUnKTtcclxuICAgICAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6ICc4cHggNnB4JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnOHB4JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiAnMS41cHggc29saWQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3JkZXJDb2xvcjogY2hlY2tvdXRUeXBlID09PSAnZGVsaXZlcnknID8gJyNENEEzNzMnIDogJyNFNkU0RTAnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBjaGVja291dFR5cGUgPT09ICdkZWxpdmVyeScgPyAnI0ZBRjNFRCcgOiAnI2ZmZicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBjaGVja291dFR5cGUgPT09ICdkZWxpdmVyeScgPyAnIzhGNUUzNicgOiAnIzVDNTg1NCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6ICc2MDAnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogJzAuNzhyZW0nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJzb3I6ICdwb2ludGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogJ2FsbCAwLjNzIGN1YmljLWJlemllcigwLjI1LCAwLjgsIDAuMjUsIDEpJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdhcDogJzRweCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJveFNoYWRvdzogY2hlY2tvdXRUeXBlID09PSAnZGVsaXZlcnknID8gJzAgNHB4IDEwcHggcmdiYSgyMTIsMTYzLDExNSwwLjEyKScgOiAnbm9uZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dGxpbmU6ICdub25lJ1xyXG4gICAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjE4XCIgaGVpZ2h0PVwiMThcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxyZWN0IHg9XCIxXCIgeT1cIjNcIiB3aWR0aD1cIjE1XCIgaGVpZ2h0PVwiMTNcIiByeD1cIjJcIiByeT1cIjJcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBwb2ludHM9XCIxNiA4IDIwIDggMjMgMTEgMjMgMTYgMTYgMTYgMTYgOFwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgY3g9XCI1LjVcIiBjeT1cIjE4LjVcIiByPVwiMi41XCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBjeD1cIjE4LjVcIiBjeT1cIjE4LjVcIiByPVwiMi41XCIgLz5cclxuICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17e2ZvbnRGYW1pbHk6ICdJbnRlciwgc2Fucy1zZXJpZicsIGxldHRlclNwYWNpbmc6ICctMC4wMWVtJ319PlN0YW5kYXJkIERlbGl2ZXJ5PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC9idXR0b24+XHJcblxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0Q2hlY2tvdXRUeXBlKCdwaWNrdXAnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0UGF5bWVudE1ldGhvZCgnb25saW5lJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAnOHB4IDZweCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzhweCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlcjogJzEuNXB4IHNvbGlkJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyQ29sb3I6IGNoZWNrb3V0VHlwZSA9PT0gJ3BpY2t1cCcgPyAnI0Q0QTM3MycgOiAnI0U2RTRFMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IGNoZWNrb3V0VHlwZSA9PT0gJ3BpY2t1cCcgPyAnI0ZBRjNFRCcgOiAnI2ZmZicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBjaGVja291dFR5cGUgPT09ICdwaWNrdXAnID8gJyM4RjVFMzYnIDogJyM1QzU4NTQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiAnNjAwJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6ICcwLjc4cmVtJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb246ICdhbGwgMC4zcyBjdWJpYy1iZXppZXIoMC4yNSwgMC44LCAwLjI1LCAxKScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBnYXA6ICc0cHgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3hTaGFkb3c6IGNoZWNrb3V0VHlwZSA9PT0gJ3BpY2t1cCcgPyAnMCA0cHggMTBweCByZ2JhKDIxMiwxNjMsMTE1LDAuMTIpJyA6ICdub25lJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0bGluZTogJ25vbmUnXHJcbiAgICAgICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICA8c3ZnIHdpZHRoPVwiMThcIiBoZWlnaHQ9XCIxOFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk0zIDlsOS03IDkgN3YxMWEyIDIgMCAwIDEtMiAySDVhMiAyIDAgMCAxLTItMnpcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cG9seWxpbmUgcG9pbnRzPVwiOSAyMiA5IDEyIDE1IDEyIDE1IDIyXCIgLz5cclxuICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17e2ZvbnRGYW1pbHk6ICdJbnRlciwgc2Fucy1zZXJpZicsIGxldHRlclNwYWNpbmc6ICctMC4wMWVtJ319PlN0b3JlIFBpY2t1cDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG5cclxuICAgICAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldENoZWNrb3V0VHlwZSgnaHlkZXJhYmFkX2luc3RhbnQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0UGF5bWVudE1ldGhvZCgnb25saW5lJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAnOHB4IDZweCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzhweCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlcjogJzEuNXB4IHNvbGlkJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyQ29sb3I6IGNoZWNrb3V0VHlwZSA9PT0gJ2h5ZGVyYWJhZF9pbnN0YW50JyA/ICcjRDRBMzczJyA6ICcjRTZFNEUwJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogY2hlY2tvdXRUeXBlID09PSAnaHlkZXJhYmFkX2luc3RhbnQnID8gJyNGQUYzRUQnIDogJyNmZmYnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogY2hlY2tvdXRUeXBlID09PSAnaHlkZXJhYmFkX2luc3RhbnQnID8gJyM4RjVFMzYnIDogJyM1QzU4NTQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiAnNjAwJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6ICcwLjc4cmVtJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb246ICdhbGwgMC4zcyBjdWJpYy1iZXppZXIoMC4yNSwgMC44LCAwLjI1LCAxKScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBnYXA6ICc0cHgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3hTaGFkb3c6IGNoZWNrb3V0VHlwZSA9PT0gJ2h5ZGVyYWJhZF9pbnN0YW50JyA/ICcwIDZweCAxNXB4IHJnYmEoMjEyLDE2MywxMTUsMC4xNSknIDogJ25vbmUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRsaW5lOiAnbm9uZSdcclxuICAgICAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCIyMFwiIGhlaWdodD1cIjIwXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBwb2ludHM9XCIxMyAyIDMgMTQgMTIgMTQgMTEgMjIgMjEgMTAgMTIgMTAgMTMgMlwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3tmb250RmFtaWx5OiAnSW50ZXIsIHNhbnMtc2VyaWYnLCBsZXR0ZXJTcGFjaW5nOiAnLTAuMDFlbSd9fT5IeWRlcmFiYWQgSW5zdGFudDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3ttYXJnaW5Cb3R0b206ICcxLjI1cmVtJ319PlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXt7ZGlzcGxheTogJ2Jsb2NrJywgbWFyZ2luQm90dG9tOiAnMC4zNXJlbScsIGZvbnRXZWlnaHQ6IDYwMCwgZm9udFNpemU6ICcwLjc4cmVtJywgY29sb3I6ICcjNTU1J319PkNvbmZpcm0gRW1haWwgKjwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZT1cImVtYWlsXCIgXHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2hlY2tvdXQtZW1haWwtaW5wdXRcIlxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtlbWFpbH0gXHJcbiAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2UgPT4gc2V0RW1haWwoZS50YXJnZXQudmFsdWUpfSBcclxuICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cInlvdUBleGFtcGxlLmNvbVwiXHJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tib3JkZXI6ICcxcHggc29saWQgI2RkZCcsIGJvcmRlclJhZGl1czogJzhweCcsIHdpZHRoOiAnMTAwJScsIGZvbnRTaXplOiAnMC43NXJlbScsIGhlaWdodDogJzM0cHgnLCBwYWRkaW5nOiAnMC4zNXJlbSAwLjY1cmVtJ319XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ9e29yZGVyaW5nfVxyXG4gICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkXHJcbiAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIHsvKiBTdG9yZSBQaWNrdXAgRGV0YWlscyBVSSAqL31cclxuICAgICAgICAgICAge2NoZWNrb3V0VHlwZSA9PT0gJ3BpY2t1cCcgJiYgKFxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e21hcmdpbkJvdHRvbTogJzIuNXJlbSd9fT5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6ICcjRkFGM0VEJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkICNGRkU1RDknLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICcxMnB4JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogJzEuOHJlbScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbkJvdHRvbTogJzJyZW0nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3hTaGFkb3c6ICcwIDRweCAxMnB4IHJnYmEoMjEyLDE2MywxMTUsMC4wNiknXHJcbiAgICAgICAgICAgICAgICAgICAgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxoNCBzdHlsZT17e2ZvbnRGYW1pbHk6ICd2YXIoLS1mb250LXRpdGxlKScsIGNvbG9yOiAnIzhGNUUzNicsIG1hcmdpbkJvdHRvbTogJzAuOHJlbScsIGZvbnRTaXplOiAnMS4ycmVtJywgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgZ2FwOiAnMTBweCd9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCIyMlwiIGhlaWdodD1cIjIyXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiIHN0eWxlPXt7Y29sb3I6ICcjOEY1RTM2J319PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMyA5bDktNyA5IDd2MTFhMiAyIDAgMCAxLTIgMkg1YTIgMiAwIDAgMS0yLTJ6XCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cG9seWxpbmUgcG9pbnRzPVwiOSAyMiA5IDEyIDE1IDEyIDE1IDIyXCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSnViaWxlZSBIaWxscyBCb3V0aXF1ZSBDb2xsZWN0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvaDQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPXt7Zm9udFNpemU6ICcwLjk1cmVtJywgY29sb3I6ICcjMkQyQTI2JywgZm9udFdlaWdodDogNjAwLCBtYXJnaW46ICcwIDAgMC40cmVtJ319PlRoZSBFdGhuaWMgVG91Y2ggQm91dGlxdWU8L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPXt7Zm9udFNpemU6ICcwLjg4cmVtJywgY29sb3I6ICcjNkM2ODYzJywgbWFyZ2luOiAnMCAwIDAuOHJlbScsIGxpbmVIZWlnaHQ6ICcxLjUnfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSb2FkIE5vLiAzNiwgTmVhciBKdWJpbGVlIEhpbGxzIENoZWNrIFBvc3QsPGJyLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEh5ZGVyYWJhZCwgVGVsYW5nYW5hIC0gNTAwMDMzPGJyLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFzc2lzdGFudCBEZXNrOiA8c3Ryb25nPis5MSA5ODc2NSA0MzIxMDwvc3Ryb25nPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPXt7Zm9udFNpemU6ICcwLjg1cmVtJywgY29sb3I6ICcjOEY1RTM2JywgZm9udFN0eWxlOiAnaXRhbGljJywgbWFyZ2luOiAwLCBib3JkZXJUb3A6ICcxcHggc29saWQgcmdiYSgyMTIsMTYzLDExNSwwLjIpJywgcGFkZGluZ1RvcDogJzAuOHJlbScsIGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGdhcDogJzhweCd9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCIxOFwiIGhlaWdodD1cIjE4XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiIHN0eWxlPXt7Y29sb3I6ICcjOEY1RTM2JywgZmxleFNocmluazogMH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMTBcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaW5lIHgxPVwiMTJcIiB5MT1cIjE2XCIgeDI9XCIxMlwiIHkyPVwiMTJcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaW5lIHgxPVwiMTJcIiB5MT1cIjhcIiB4Mj1cIjEyLjAxXCIgeTI9XCI4XCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+Q29sbGVjdGVkIHBhY2thZ2VzIGFyZSBjdXN0b20gc3RlYW1lZCBhbmQgZ2lmdC13cmFwcGVkIG9uIGFycml2YWwuIFBpY2t1cHMgYXZhaWxhYmxlIDEwOjMwIEFNIC0gODozMCBQTS48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgey8qIFBheW1lbnQgTW9kZSAoT25saW5lIC8gT2ZmbGluZSBRUikgKi99XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e21hcmdpbkJvdHRvbTogJzJyZW0nfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxoMyBzdHlsZT17e2ZvbnRTaXplOiAnMS4xcmVtJywgZm9udFdlaWdodDogNjAwLCBjb2xvcjogJyMzMzMnLCBtYXJnaW5Cb3R0b206ICcxLjFyZW0nfX0+U2VsZWN0IFBheW1lbnQgTW9kZTwvaDM+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OiAnZ3JpZCcsIGdyaWRUZW1wbGF0ZUNvbHVtbnM6ICcxZnIgMWZyJywgZ2FwOiAnMXJlbSd9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0UGF5bWVudE1ldGhvZCgnb25saW5lJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiBwYXltZW50TWV0aG9kID09PSAnb25saW5lJyA/ICcycHggc29saWQgI0Q0QTM3MycgOiAnMXB4IHNvbGlkICNFNkU0RTAnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICcxMnB4JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogJzEuNXJlbSAxcmVtJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogcGF5bWVudE1ldGhvZCA9PT0gJ29ubGluZScgPyAnI0ZBRjNFRCcgOiAnI2ZmZicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnYXA6ICcxMnB4JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogJ2FsbCAwLjNzIGVhc2UnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3hTaGFkb3c6IHBheW1lbnRNZXRob2QgPT09ICdvbmxpbmUnID8gJzAgNnB4IDE1cHggcmdiYSgyMTIsMTYzLDExNSwwLjE1KScgOiAnbm9uZSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiIHN0eWxlPXt7Y29sb3I6ICcjOEY1RTM2J319PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmVjdCB4PVwiMVwiIHk9XCI0XCIgd2lkdGg9XCIyMlwiIGhlaWdodD1cIjE2XCIgcng9XCIyXCIgcnk9XCIyXCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9XCIxXCIgeTE9XCIxMFwiIHgyPVwiMjNcIiB5Mj1cIjEwXCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17e2ZvbnRTaXplOiAnMC45OHJlbScsIGZvbnRXZWlnaHQ6IDYwMCwgY29sb3I6ICcjMkQyQTI2J319PlByZXBheSBPbmxpbmU8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3tmb250U2l6ZTogJzAuNzVyZW0nLCBjb2xvcjogJyM2QzY4NjMnLCB0ZXh0QWxpZ246ICdjZW50ZXInfX0+SW5zdGFudCBjaGVja291dCB2ZXJpZmljYXRpb248L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRQYXltZW50TWV0aG9kKCdvZmZsaW5lX3FyJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiBwYXltZW50TWV0aG9kID09PSAnb2ZmbGluZV9xcicgPyAnMnB4IHNvbGlkICNENEEzNzMnIDogJzFweCBzb2xpZCAjRTZFNEUwJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnMTJweCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6ICcxLjVyZW0gMXJlbScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IHBheW1lbnRNZXRob2QgPT09ICdvZmZsaW5lX3FyJyA/ICcjRkFGM0VEJyA6ICcjZmZmJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdhcDogJzEycHgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiAnYWxsIDAuM3MgZWFzZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJveFNoYWRvdzogcGF5bWVudE1ldGhvZCA9PT0gJ29mZmxpbmVfcXInID8gJzAgNnB4IDE1cHggcmdiYSgyMTIsMTYzLDExNSwwLjE1KScgOiAnbm9uZSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiIHN0eWxlPXt7Y29sb3I6ICcjOEY1RTM2J319PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmVjdCB4PVwiNVwiIHk9XCIyXCIgd2lkdGg9XCIxNFwiIGhlaWdodD1cIjIwXCIgcng9XCIyXCIgcnk9XCIyXCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9XCIxMlwiIHkxPVwiMThcIiB4Mj1cIjEyLjAxXCIgeTI9XCIxOFwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3tmb250U2l6ZTogJzAuOThyZW0nLCBmb250V2VpZ2h0OiA2MDAsIGNvbG9yOiAnIzJEMkEyNid9fT5QYXkgSW4tU3RvcmU8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3tmb250U2l6ZTogJzAuNzVyZW0nLCBjb2xvcjogJyM2QzY4NjMnLCB0ZXh0QWxpZ246ICdjZW50ZXInfX0+Qm9vayBub3csIHNjYW4gcGFzcyBhdCBib3V0aXF1ZTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICApfVxyXG5cclxuICAgICAgICAgICAgey8qIFN0YW5kYXJkIERlbGl2ZXJ5IE1vZGUgSW5mbyBCYW5uZXIgKi99XHJcbiAgICAgICAgICAgIHtjaGVja291dFR5cGUgPT09ICdkZWxpdmVyeScgJiYgKFxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6ICcjRjlGQUY5JyxcclxuICAgICAgICAgICAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgI0U2RTZFNicsXHJcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnMTJweCcsXHJcbiAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogJzEuMnJlbScsXHJcbiAgICAgICAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOiAnMnJlbScsXHJcbiAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6ICcwLjg4cmVtJyxcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM1NTUnLFxyXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgICAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcclxuICAgICAgICAgICAgICAgICAgICBnYXA6ICcxNHB4J1xyXG4gICAgICAgICAgICAgICAgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCIgc3R5bGU9e3tjb2xvcjogJyM1NTUnLCBmbGV4U2hyaW5rOiAwfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5bGluZSBwb2ludHM9XCIyMiAxMiAxNiAxMiAxNCAxNSAxMCAxNSA4IDEyIDIgMTJcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTUuNDUgNS4xMUwyIDEydjZhMiAyIDAgMCAwIDIgMmgxNmEyIDIgMCAwIDAgMi0ydi02bC0zLjQ1LTYuODlBMiAyIDAgMCAwIDE2Ljc2IDRINy4yNGEyIDIgMCAwIDAtMS43OSAxLjExelwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHN0cm9uZz5TdGFuZGFyZCBTaGlwcGluZyBEZXRhaWxzOjwvc3Ryb25nPiBEaXNwYXRjaGVkIHZpYSBwcmVtaXVtIGV4cHJlc3MgcG9zdCAoRGVsaGl2ZXJ5L0JsdWVEYXJ0KS4gRXhwZWN0ZWQgZGVsaXZlcnkgd2l0aGluIDxzdHJvbmc+My01IGJ1c2luZXNzIGRheXM8L3N0cm9uZz4gbmF0aW9ud2lkZS5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICApfVxyXG5cclxuICAgICAgICAgICAgey8qIEh5ZGVyYWJhZCBJbnN0YW50IENvdXJpZXIgTW9kZSBJbmZvIEJhbm5lciAqL31cclxuICAgICAgICAgICAge2NoZWNrb3V0VHlwZSA9PT0gJ2h5ZGVyYWJhZF9pbnN0YW50JyAmJiAoXHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogJyNGRkY5RjInLFxyXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlcjogJzFweCBzb2xpZCAjRkZFOUQxJyxcclxuICAgICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICcxMnB4JyxcclxuICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAnMS4ycmVtJyxcclxuICAgICAgICAgICAgICAgICAgICBtYXJnaW5Cb3R0b206ICcycmVtJyxcclxuICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogJzAuODhyZW0nLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzhGNUUzNicsXHJcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxyXG4gICAgICAgICAgICAgICAgICAgIGdhcDogJzE0cHgnXHJcbiAgICAgICAgICAgICAgICB9fT5cclxuICAgICAgICAgICAgICAgICAgICA8c3ZnIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIiBzdHlsZT17e2NvbG9yOiAnIzhGNUUzNicsIGZsZXhTaHJpbms6IDB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gcG9pbnRzPVwiMTMgMiAzIDE0IDEyIDE0IDExIDIyIDIxIDEwIDEyIDEwIDEzIDJcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzdHJvbmc+TG9jYWwgY291cmllciBkaXNwYXRjaDo8L3N0cm9uZz4gRGVsaXZlcmVkIHdpdGhpbiA8c3Ryb25nPjItNCBob3Vyczwvc3Ryb25nPiB2aWEgaW5zdGFudCBjb3VyaWVyIChVYmVyL1JhcGlkbykgZGlyZWN0IGZyb20gUm9hZCBOby4gMzYgYm91dGlxdWUuXHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKX1cclxuXHJcbiAgICAgICAgICAgIHsvKiBBZGRyZXNzIFNlbGVjdG9yIGxpc3QgKEhpZGRlbiBmb3IgU3RvcmUgUGlja3VwKSAqL31cclxuICAgICAgICAgICAge2NoZWNrb3V0VHlwZSAhPT0gJ3BpY2t1cCcgJiYgKFxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e21hcmdpbkJvdHRvbTogJzJyZW0nfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6ICdmbGV4JywganVzdGlmeWNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJywgYWxpZ25JdGVtczogJ2NlbnRlcicsIG1hcmdpbkJvdHRvbTogJzEuNXJlbSd9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGgzIHN0eWxlPXt7Zm9udFNpemU6ICcxLjFyZW0nLCBmb250V2VpZ2h0OiA2MDAsIGNvbG9yOiAnIzMzMyd9fT5TZWxlY3QgU2hpcHBpbmcgQWRkcmVzcyAqPC9oMz5cclxuICAgICAgICAgICAgICAgICAgICAgICAge2F1dGhVc2VyICYmIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1zZWNvbmRhcnlcIiBzdHlsZT17e3BhZGRpbmc6ICcwLjRyZW0gMC44cmVtJywgZm9udFNpemU6ICcwLjhyZW0nfX0gb25DbGljaz17KCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFNoaXBwaW5nRm9ybSh7IGZ1bGxOYW1lOiAnJywgcGhvbmU6ICcnLCBhZGRyZXNzTGluZTogJycsIGNpdHk6ICcnLCBzdGF0ZTogJycsIHppcENvZGU6ICcnIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFNob3dOZXdBZGRyZXNzRm9ybShwcmV2ID0+ICFwcmV2KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRBZGRyZXNzTWVzc2FnZSgnJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2hvd05ld0FkZHJlc3NGb3JtID8gJ0NhbmNlbCcgOiAnKyBBZGQgTmV3IEFkZHJlc3MnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHthZGRyZXNzTWVzc2FnZSAmJiA8ZGl2IGNsYXNzTmFtZT1cInByb2ZpbGUtbWVzc2FnZSBlcnJvclwiIHN0eWxlPXt7bWFyZ2luQm90dG9tOiAnMXJlbSd9fT57YWRkcmVzc01lc3NhZ2V9PC9kaXY+fVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB7c2hvd05ld0FkZHJlc3NGb3JtICYmIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgPGZvcm0gb25TdWJtaXQ9e2hhbmRsZUFkZEFkZHJlc3N9IHN0eWxlPXt7YmFja2dyb3VuZDogJyNGQUY5RjYnLCBib3JkZXI6ICcxLjVweCBzb2xpZCAjRTZFNEUwJywgcGFkZGluZzogJzEuOHJlbScsIGJvcmRlclJhZGl1czogJzEycHgnLCBtYXJnaW5Cb3R0b206ICcycmVtJ319PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGg0IHN0eWxlPXt7Zm9udFNpemU6ICcxcmVtJywgZm9udFdlaWdodDogNjAwLCBtYXJnaW5Cb3R0b206ICcxLjJyZW0nLCBjb2xvcjogJyMyRDJBMjYnfX0+TmV3IFNoaXBwaW5nIEFkZHJlc3M8L2g0PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwcm9maWxlLWdyaWRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwicHJvZmlsZS1maWVsZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj5Db250YWN0IE5hbWUgKjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cInByb2ZpbGUtaW5wdXRcIiB2YWx1ZT17c2hpcHBpbmdGb3JtLmZ1bGxOYW1lfSBvbkNoYW5nZT17ZSA9PiBzZXRTaGlwcGluZ0Zvcm0oey4uLnNoaXBwaW5nRm9ybSwgZnVsbE5hbWU6IGUudGFyZ2V0LnZhbHVlfSl9IHJlcXVpcmVkIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwicHJvZmlsZS1maWVsZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj5QaG9uZSBOdW1iZXIgKjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cInByb2ZpbGUtaW5wdXRcIiB2YWx1ZT17c2hpcHBpbmdGb3JtLnBob25lfSBvbkNoYW5nZT17ZSA9PiBzZXRTaGlwcGluZ0Zvcm0oey4uLnNoaXBwaW5nRm9ybSwgcGhvbmU6IGUudGFyZ2V0LnZhbHVlfSl9IHJlcXVpcmVkIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwicHJvZmlsZS1maWVsZCBwcm9maWxlLXNwYW4tMlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj5BZGRyZXNzIExpbmUgKjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cInByb2ZpbGUtaW5wdXRcIiB2YWx1ZT17c2hpcHBpbmdGb3JtLmFkZHJlc3NMaW5lfSBvbkNoYW5nZT17ZSA9PiBzZXRTaGlwcGluZ0Zvcm0oey4uLnNoaXBwaW5nRm9ybSwgYWRkcmVzc0xpbmU6IGUudGFyZ2V0LnZhbHVlfSl9IHJlcXVpcmVkIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwicHJvZmlsZS1maWVsZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj5DaXR5ICo8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9XCJwcm9maWxlLWlucHV0XCIgdmFsdWU9e3NoaXBwaW5nRm9ybS5jaXR5fSBvbkNoYW5nZT17ZSA9PiBzZXRTaGlwcGluZ0Zvcm0oey4uLnNoaXBwaW5nRm9ybSwgY2l0eTogZS50YXJnZXQudmFsdWV9KX0gcmVxdWlyZWQgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJwcm9maWxlLWZpZWxkXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPlN0YXRlICo8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9XCJwcm9maWxlLWlucHV0XCIgdmFsdWU9e3NoaXBwaW5nRm9ybS5zdGF0ZX0gb25DaGFuZ2U9e2UgPT4gc2V0U2hpcHBpbmdGb3JtKHsuLi5zaGlwcGluZ0Zvcm0sIHN0YXRlOiBlLnRhcmdldC52YWx1ZX0pfSByZXF1aXJlZCAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInByb2ZpbGUtZmllbGRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+WklQIC8gUG9zdGFsIENvZGUgKjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cInByb2ZpbGUtaW5wdXRcIiB2YWx1ZT17c2hpcHBpbmdGb3JtLnppcENvZGV9IG9uQ2hhbmdlPXtlID0+IHNldFNoaXBwaW5nRm9ybSh7Li4uc2hpcHBpbmdGb3JtLCB6aXBDb2RlOiBlLnRhcmdldC52YWx1ZX0pfSByZXF1aXJlZCBzdHlsZT17e2xldHRlclNwYWNpbmc6ICcwLjFlbSd9fSBwbGFjZWhvbGRlcj1cIjYgZGlnaXRzXCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeVwiIHR5cGU9XCJzdWJtaXRcIiBzdHlsZT17e21hcmdpblRvcDogJzEuMnJlbScsIHBhZGRpbmc6ICcwLjc1cmVtIDEuOHJlbScsIGJvcmRlclJhZGl1czogJzUwcHgnfX0+U2F2ZSBhbmQgVXNlIEFkZHJlc3M8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtPlxyXG4gICAgICAgICAgICAgICAgICAgICl9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHthZGRyZXNzZXMubGVuZ3RoID09PSAwID8gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7YmFja2dyb3VuZDogJyNmYWZhZmEnLCBib3JkZXI6ICcxcHggZGFzaGVkICNjY2MnLCBwYWRkaW5nOiAnMi41cmVtIDEuNXJlbScsIGJvcmRlclJhZGl1czogJzEycHgnLCB0ZXh0QWxpZ246ICdjZW50ZXInfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBzdHlsZT17e2ZvbnRTaXplOiAnMC45MnJlbScsIGNvbG9yOiAnIzZDNjg2MycsIG1hcmdpbkJvdHRvbTogJzEuMnJlbSd9fT5Zb3UgZG9uJ3QgaGF2ZSBhbnkgc2F2ZWQgc2hpcHBpbmcgYWRkcmVzc2VzLjwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHshc2hvd05ld0FkZHJlc3NGb3JtICYmIGF1dGhVc2VyICYmIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeVwiIG9uQ2xpY2s9eygpID0+IHNldFNob3dOZXdBZGRyZXNzRm9ybSh0cnVlKX0+KyBBZGQgU2hpcHBpbmcgQWRkcmVzczwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHshYXV0aFVzZXIgJiYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPXt7Zm9udFNpemU6ICcwLjg1cmVtJywgY29sb3I6ICcjOTk5J319PlBsZWFzZSBzaWduIGluIHRvIHNhdmUgYW5kIG1hbmFnZSBzaGlwcGluZyBhZGRyZXNzZXMuPC9wPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6ICdncmlkJywgZ3JpZFRlbXBsYXRlQ29sdW1uczogJzFmcicsIGdhcDogJzEuMnJlbSd9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHthZGRyZXNzZXMubWFwKGFkZHIgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzU2VsZWN0ZWQgPSBzZWxlY3RlZEFkZHJlc3NJRCA9PT0gYWRkci5pZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5PXthZGRyLmlkfSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldFNlbGVjdGVkQWRkcmVzc0lEKGFkZHIuaWQpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXI6IGlzU2VsZWN0ZWQgPyAnMnB4IHNvbGlkICNENEEzNzMnIDogJzFweCBzb2xpZCAjRTZFNEUwJywgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnMTJweCcsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6ICcxLjVyZW0nLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBpc1NlbGVjdGVkID8gJyNGQUYzRUQnIDogJyNmZmYnLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJzb3I6ICdwb2ludGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiAnYWxsIDAuM3MgZWFzZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm94U2hhZG93OiBpc1NlbGVjdGVkID8gJzAgNnB4IDE1cHggcmdiYSgyMTIsMTYzLDExNSwwLjEyKScgOiAnbm9uZSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICcxMHB4JywgbWFyZ2luQm90dG9tOiAnMC41cmVtJ319PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInJhZGlvXCIgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrZWQ9e2lzU2VsZWN0ZWR9IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KCkgPT4gc2V0U2VsZWN0ZWRBZGRyZXNzSUQoYWRkci5pZCl9IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e2N1cnNvcjogJ3BvaW50ZXInLCBhY2NlbnRDb2xvcjogJyNENEEzNzMnfX0gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDQgc3R5bGU9e3tmb250U2l6ZTogJzAuOThyZW0nLCBmb250V2VpZ2h0OiA2MDAsIG1hcmdpbjogMCwgY29sb3I6ICcjMkQyQTI2J319PnthZGRyLmZ1bGxOYW1lfTwvaDQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2FkZHIuaXNEZWZhdWx0ICYmIDxzcGFuIHN0eWxlPXt7YmFja2dyb3VuZDogJyNGRkU1RDknLCBjb2xvcjogJyM4RjVFMzYnLCBmb250U2l6ZTogJzAuNjVyZW0nLCBwYWRkaW5nOiAnM3B4IDhweCcsIGJvcmRlclJhZGl1czogJzIwcHgnLCBmb250V2VpZ2h0OiAnNzAwJywgdGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZScsIGxldHRlclNwYWNpbmc6ICcwLjA1ZW0nfX0+RGVmYXVsdDwvc3Bhbj59XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPXt7Zm9udFNpemU6ICcwLjg4cmVtJywgY29sb3I6ICcjNkM2ODYzJywgbWFyZ2luOiAnMC4ycmVtIDAgMC4ycmVtIDI0cHgnLCBsaW5lSGVpZ2h0OiAnMS41J319PnthZGRyLmFkZHJlc3NMaW5lfTwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPXt7Zm9udFNpemU6ICcwLjg4cmVtJywgY29sb3I6ICcjNkM2ODYzJywgbWFyZ2luOiAnMCAwIDAuMnJlbSAyNHB4JywgbGluZUhlaWdodDogJzEuNSd9fT57YWRkci5jaXR5fSwge2FkZHIuc3RhdGV9IC0ge2FkZHIuemlwQ29kZX08L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBzdHlsZT17e2ZvbnRTaXplOiAnMC44OHJlbScsIGNvbG9yOiAnIzZDNjg2MycsIG1hcmdpbjogJzAgMCAwIDI0cHgnfX0+UGhvbmU6IDxzdHJvbmc+e2FkZHIucGhvbmV9PC9zdHJvbmc+PC9wPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICl9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHsvKiBJbnN0YW50IFNoaXBwaW5nIFdhcm5pbmcgaWYgQ2l0eSBpcyBub3QgSHlkZXJhYmFkICovfVxyXG4gICAgICAgICAgICAgICAgICAgIHtpc0luc3RhbnREZWxpdmVyeUJsb2NrZWQgJiYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiAnI0ZERjJGMicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXI6ICcxLjVweCBzb2xpZCAjRjhEN0RBJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzcyMUMyNCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICcxMnB4JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6ICcxLjJyZW0nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luVG9wOiAnMS41cmVtJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAnMC45cmVtJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVIZWlnaHQ6ICcxLjUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2ZsZXgtc3RhcnQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2FwOiAnMTJweCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3ZnIHdpZHRoPVwiMjJcIiBoZWlnaHQ9XCIyMlwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIiBzdHlsZT17e2NvbG9yOiAnIzcyMUMyNCcsIGZsZXhTaHJpbms6IDB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTEwLjI5IDMuODZMMS44MiAxOGEyIDIgMCAwIDAgMS43MSAzaDE2Ljk0YTIgMiAwIDAgMCAxLjcxLTNMMTMuNzEgMy44NmEyIDIgMCAwIDAtMy40MiAwelwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9XCIxMlwiIHkxPVwiOVwiIHgyPVwiMTJcIiB5Mj1cIjEzXCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGluZSB4MT1cIjEyXCIgeTE9XCIxN1wiIHgyPVwiMTIuMDFcIiB5Mj1cIjE3XCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Ryb25nPkxvY2FsIEluc3RhbnQgQ291cmllciBCbG9ja2VkOjwvc3Ryb25nPiBZb3VyIHNoaXBwaW5nIGFkZHJlc3MgY2l0eSAoe2FjdGl2ZUFkZHI/LmNpdHkgfHwgJ1NlbGVjdGVkIGxvY2F0aW9uJ30pIGlzIG91dHNpZGUgdGhlIEh5ZGVyYWJhZC9TZWN1bmRlcmFiYWQgZGVsaXZlcnkgcmFkaXVzLjxici8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3tmb250U2l6ZTogJzAuODVyZW0nLCBjb2xvcjogJyM5MDI0MkUnLCBtYXJnaW5Ub3A6ICcwLjRyZW0nLCBkaXNwbGF5OiAnYmxvY2snfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRvIHByb2NlZWQsIHNlbGVjdCBzdGFuZGFyZCBuYXRpb253aWRlIGRlbGl2ZXJ5LCBwaWNrIHVwIGluIGJvdXRpcXVlLCBvciB1cGRhdGUgeW91ciBzaGlwcGluZyBhZGRyZXNzLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICl9XHJcblxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgey8qIFJpZ2h0IENvbHVtbjogU3RpY2t5IE9yZGVyIFN1bW1hcnkgQm94ICovfVxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzdGlja3ktc3VtbWFyeS1ib3hcIiBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAnMzEwcHgnLCBcclxuICAgICAgICAgICAgICAgICAgICBmbGV4U2hyaW5rOiAwLCBcclxuICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAnMS4yNXJlbScsIFxyXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJyNGRkZkZmMnLCBcclxuICAgICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICcxNnB4JywgXHJcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiAnMS41cHggc29saWQgcmdiYSgyMTIsIDE2MywgMTE1LCAwLjM1KScsIFxyXG4gICAgICAgICAgICAgICAgICAgIGJveFNoYWRvdzogJzAgOHB4IDMwcHggcmdiYSgyMTIsIDE2MywgMTE1LCAwLjA4KSdcclxuICAgICAgICAgICAgICAgIH19PlxyXG4gICAgICAgICAgICAgICAgICAgIDxoMyBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiAndmFyKC0tZm9udC1oZWFkaW5nKScsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogJzEuMDVyZW0nLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogJzUwMCcsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW5Cb3R0b206ICcwLjg1cmVtJywgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzJEMkEyNicsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOiAnMC4wM2VtJywgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlckJvdHRvbTogJzFweCBzb2xpZCByZ2JhKDIxMiwgMTYzLCAxMTUsIDAuMjUpJywgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmdCb3R0b206ICcwLjQ1cmVtJ1xyXG4gICAgICAgICAgICAgICAgICAgIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBPcmRlciBTdW1tYXJ5XHJcbiAgICAgICAgICAgICAgICAgICAgPC9oMz5cclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICB7LyogSXRlbSBsaXN0IG1pbmkgcHJldmlldyAqL31cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1heEhlaWdodDogJzE4MHB4JywgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG92ZXJmbG93WTogJ2F1dG8nLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOiAnMXJlbScsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAnMC41cmVtIDAuNnJlbScsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjRkFGN0Y0JywgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzEwcHgnLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkIHJnYmEoMjEyLCAxNjMsIDExNSwgMC4xOCknLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBnYXA6ICcwLjVyZW0nXHJcbiAgICAgICAgICAgICAgICAgICAgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtjYXJ0Lm1hcCgoaXRlbSwgaWR4KSA9PiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGtleT17aWR4fSBzdHlsZT17e2Rpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGdhcDogJzAuNnJlbScsIGZvbnRTaXplOiAnMC43OHJlbSd9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz17aXRlbS5pbWFnZVVybH0gYWx0PXtpdGVtLm5hbWV9IHN0eWxlPXt7d2lkdGg6ICczNnB4JywgaGVpZ2h0OiAnMzZweCcsIGJvcmRlclJhZGl1czogJzhweCcsIG9iamVjdEZpdDogJ2NvdmVyJywgYm9yZGVyOiAnMXB4IHNvbGlkIHJnYmEoMjEyLCAxNjMsIDExNSwgMC4yNSknfX0gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZmxleDogMSwgbWluV2lkdGg6IDB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e2ZvbnRXZWlnaHQ6ICc1MDAnLCB3aGl0ZVNwYWNlOiAnbm93cmFwJywgb3ZlcmZsb3c6ICdoaWRkZW4nLCB0ZXh0T3ZlcmZsb3c6ICdlbGxpcHNpcycsIGNvbG9yOiAnIzJEMkEyNid9fT57aXRlbS5uYW1lfTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7Y29sb3I6ICcjOEM4ODgzJywgZm9udFNpemU6ICcwLjcycmVtJ319PlF0eToge2l0ZW0ucXVhbnRpdHkgfHwgMX0ge2l0ZW0uc2l6ZSA/IGB8IFNpemU6ICR7aXRlbS5zaXplfWAgOiAnJ308L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7Zm9udFdlaWdodDogJzYwMCcsIGNvbG9yOiAnIzhGNUUzNid9fT7igrl7KGl0ZW0ucHJpY2UgKiAoaXRlbS5xdWFudGl0eSB8fCAxKSkudG9Mb2NhbGVTdHJpbmcoJ2VuLUlOJyl9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgKSl9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tib3JkZXJUb3A6ICcxcHggc29saWQgcmdiYSgyMTIsIDE2MywgMTE1LCAwLjIpJywgcGFkZGluZ1RvcDogJzAuNzVyZW0nLCBkaXNwbGF5OiAnZmxleCcsIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLCBnYXA6ICcwLjVyZW0nLCBmb250U2l6ZTogJzAuODJyZW0nfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OiAnZmxleCcsIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsIGNvbG9yOiAnIzZDNjg2Myd9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPlN1YnRvdGFsICh7Y2FydC5yZWR1Y2UoKHN1bSwgaXRlbSkgPT4gc3VtICsgKGl0ZW0ucXVhbnRpdHkgfHwgMSksIDApfSBpdGVtcyk6PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3tmb250V2VpZ2h0OiAnNjAwJywgY29sb3I6ICcjMkQyQTI2J319PuKCuXtzdWJ0b3RhbC50b0xvY2FsZVN0cmluZygnZW4tSU4nKX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7ZGlzY291bnQgJiYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6ICdmbGV4JywganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJywgY29sb3I6ICcjMkU3RDMyJywgZm9udFdlaWdodDogJzUwMCd9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj5EaXNjb3VudCAoe2Rpc2NvdW50LmNvZGV9KTo8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+LeKCuXtkaXNjb3VudC5hbXQudG9Mb2NhbGVTdHJpbmcoJ2VuLUlOJyl9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OiAnZmxleCcsIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBjb2xvcjogJyM2QzY4NjMnfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj5EZWxpdmVyeSBNb2RlOjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7YmFja2dyb3VuZENvbG9yOiAnI0ZBRjNFRCcsIGNvbG9yOiAnIzhGNUUzNicsIHBhZGRpbmc6ICcycHggOHB4JywgYm9yZGVyUmFkaXVzOiAnMjBweCcsIGZvbnRXZWlnaHQ6ICc2MDAnLCBmb250U2l6ZTogJzAuNzVyZW0nLCBib3JkZXI6ICcxcHggc29saWQgcmdiYSgyMTIsMTYzLDExNSwwLjI1KScsIHRleHRUcmFuc2Zvcm06ICdjYXBpdGFsaXplJ319PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtjaGVja291dFR5cGUucmVwbGFjZSgnXycsICcgJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTogJ2ZsZXgnLCBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgYm9yZGVyVG9wOiAnMXB4IGRhc2hlZCByZ2JhKDIxMiwgMTYzLCAxMTUsIDAuMzUpJywgcGFkZGluZ1RvcDogJzAuNjVyZW0nLCBtYXJnaW5Ub3A6ICcwLjNyZW0nfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17e2ZvbnRXZWlnaHQ6IDYwMCwgY29sb3I6ICcjMkQyQTI2JywgZm9udFNpemU6ICcwLjkycmVtJ319PlRvdGFsIEFtb3VudDo8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Ryb25nIHN0eWxlPXt7Zm9udFNpemU6ICcxLjFyZW0nLCBjb2xvcjogJyM4RjVFMzYnLCBmb250RmFtaWx5OiAndmFyKC0tZm9udC1ib2R5KSd9fT7igrl7ZmluYWxUb3RhbC50b0xvY2FsZVN0cmluZygnZW4tSU4nKX08L3N0cm9uZz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3BsYWNlT3JkZXJ9IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luVG9wOiAnMC45cmVtJywgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogJzM4cHgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogJzAnLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAnMC44NXJlbScsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogJzYwMCcsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnNTBweCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOiAnMC4wMmVtJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogJ2xpbmVhci1ncmFkaWVudCgxMzVkZWcsICNENEEzNzMgMCUsICNDNDkzNjMgMTAwJSknLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjRkZGJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlcjogJ25vbmUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yOiBvcmRlcmluZyA/ICdub3QtYWxsb3dlZCcgOiAncG9pbnRlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3hTaGFkb3c6ICcwIDRweCAxNXB4IHJnYmEoMjEyLCAxNjMsIDExNSwgMC4yNSknLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogJ2FsbCAwLjNzIGVhc2UnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc2FibGVkPXtvcmRlcmluZyB8fCAoY2hlY2tvdXRUeXBlICE9PSAncGlja3VwJyAmJiBhZGRyZXNzZXMubGVuZ3RoID09PSAwKSB8fCBpc0luc3RhbnREZWxpdmVyeUJsb2NrZWR9XHJcbiAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7b3JkZXJpbmcgPyBcIlZlcmlmeWluZyBTdG9jay4uLlwiIDogXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICBjaGVja291dFR5cGUgPT09ICdwaWNrdXAnICYmIHBheW1lbnRNZXRob2QgPT09ICdvZmZsaW5lX3FyJyA/IFwiQm9vayBTdG9yZSBQaWNrdXAgUGFzc1wiIDogXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICBcIlNlY3VyZSBDaGVja291dCAmIFByZXBheVwifVxyXG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgey8qIExlYXZlIENoZWNrb3V0IENvbmZpcm1hdGlvbiBNb2RhbCAqL31cclxuICAgICAgICAgICAge3Nob3dMZWF2ZU1vZGFsICYmIChcclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcclxuICAgICAgICAgICAgICAgICAgICB0b3A6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogMCxcclxuICAgICAgICAgICAgICAgICAgICByaWdodDogMCxcclxuICAgICAgICAgICAgICAgICAgICBib3R0b206IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAncmdiYSg0NSwgNDIsIDM4LCAwLjQ1KScsXHJcbiAgICAgICAgICAgICAgICAgICAgYmFja2Ryb3BGaWx0ZXI6ICdibHVyKDhweCknLFxyXG4gICAgICAgICAgICAgICAgICAgIFdlYmtpdEJhY2tkcm9wRmlsdGVyOiAnYmx1cig4cHgpJyxcclxuICAgICAgICAgICAgICAgICAgICB6SW5kZXg6IDk5OTk5LFxyXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgICAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcclxuICAgICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogJzEuMjVyZW0nXHJcbiAgICAgICAgICAgICAgICB9fT5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6ICcjRkZGJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnMjBweCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6ICcxLjc1cmVtIDEuNXJlbScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1heFdpZHRoOiAnMzgwcHgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3hTaGFkb3c6ICcwIDI1cHggNTBweCByZ2JhKDAsMCwwLDAuMTgpJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkIHJnYmEoMjEyLCAxNjMsIDExNSwgMC4zKSdcclxuICAgICAgICAgICAgICAgICAgICB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICc0OHB4JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogJzQ4cHgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnNTAlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJyNGQUY3RjQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiAnMS41cHggc29saWQgcmdiYSgyMTIsIDE2MywgMTE1LCAwLjM1KScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbjogJzAgYXV0byAwLjg1cmVtIGF1dG8nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjQjk3QTY2J1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCIyMlwiIGhlaWdodD1cIjIyXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIxLjhcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk0xNiAxMVY3YTQgNCAwIDAgMC04IDB2NE01IDloMTRsMSAxMkg0TDUgOXpcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aDMgc3R5bGU9e3sgbWFyZ2luOiAnMCAwIDAuNXJlbSAwJywgZm9udEZhbWlseTogJ3ZhcigtLWZvbnQtaGVhZGluZyknLCBmb250U2l6ZTogJzEuMjVyZW0nLCBjb2xvcjogJyMyRDJBMjYnIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTGVhdmUgQ2hlY2tvdXQ/XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvaDM+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPXt7IG1hcmdpbjogJzAgMCAxLjVyZW0gMCcsIGZvbnRTaXplOiAnMC44OHJlbScsIGNvbG9yOiAnIzY4NjQ2MScsIGxpbmVIZWlnaHQ6ICcxLjU1JyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBsZWF2ZSBjaGVja291dD8gWW91ciBpdGVtcyBhbmQgY2FydCBzZWxlY3Rpb25zIGFyZSBzYWZlbHkgc2F2ZWQuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGdhcDogJzAuNzVyZW0nIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRTaG93TGVhdmVNb2RhbChmYWxzZSl9IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsZXg6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogJzQycHgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICc1MHB4JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkIHJnYmEoMjEyLCAxNjMsIDExNSwgMC4zNSknLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiAnI0ZBRjdGNCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzVDNTg1MycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAnMC44NXJlbScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6ICc1MDAnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJzb3I6ICdwb2ludGVyJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU3RheSBIZXJlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17Y29uZmlybUxlYXZlQ2hlY2tvdXR9IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsZXg6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogJzQycHgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICc1MHB4JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiAnbm9uZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6ICdsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAjQjk3QTY2IDAlLCAjQTQ2ODU1IDEwMCUpJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjRkZGJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6ICcwLjg1cmVtJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogJzYwMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3hTaGFkb3c6ICcwIDRweCAxMnB4IHJnYmEoMTg1LCAxMjIsIDEwMiwgMC4yNSknXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBMZWF2ZSBDaGVja291dFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICl9XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgQ2hlY2tvdXQ7XHJcbiJdfQ==