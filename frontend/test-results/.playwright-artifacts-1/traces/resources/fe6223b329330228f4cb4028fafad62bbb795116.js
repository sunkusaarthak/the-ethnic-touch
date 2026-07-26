import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/pages/ProfilePage.jsx");const React = __vite__cjsImport0_react; const useState = __vite__cjsImport0_react["useState"]; const useEffect = __vite__cjsImport0_react["useEffect"]; const useRef = __vite__cjsImport0_react["useRef"]; const useMemo = __vite__cjsImport0_react["useMemo"]; const useCallback = __vite__cjsImport0_react["useCallback"];const _jsxDEV = __vite__cjsImport6_react_jsxDevRuntime["jsxDEV"];import __vite__cjsImport0_react from "/node_modules/.vite/deps/react.js?v=42a9b196";
import { useNavigate, Link, useLocation, useParams, Routes, Route, Navigate, BrowserRouter } from "/node_modules/.vite/deps/react-router-dom.js?v=42a9b196";
import CopyButton from "/src/components/CopyButton.jsx";
import { signOut } from "/node_modules/.vite/deps/firebase_auth.js?v=42a9b196";
import { auth, API_BASE_URL } from "/src/data/config.jsx";
import apiClient from "/src/utils/apiClient.js";
var _jsxFileName = "D:/The Ethnic Touch/frontend/src/pages/ProfilePage.jsx";
import __vite__cjsImport6_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=42a9b196";
var _s = $RefreshSig$();
const ProfilePage = ({ authUser }) => {
	_s();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [mode, setMode] = useState("create");
	const [message, setMessage] = useState({
		type: "",
		text: ""
	});
	const [successVisible, setSuccessVisible] = useState(false);
	const redirectTimer = useRef(null);
	const [form, setForm] = useState({
		fullName: "",
		email: "",
		phone: "",
		address: "",
		city: "",
		state: "",
		zipCode: "",
		preferredSize: "",
		styleNotes: ""
	});
	const [addresses, setAddresses] = useState([]);
	const [addressForm, setAddressForm] = useState({
		id: 0,
		fullName: "",
		phone: "",
		addressLine: "",
		city: "",
		state: "",
		zipCode: ""
	});
	const [showAddressForm, setShowAddressForm] = useState(false);
	const [addressMessage, setAddressMessage] = useState("");
	// New states for client tabbed dashboard
	const [orders, setOrders] = useState([]);
	const [coupons, setCoupons] = useState([]);
	const [activeTab, setActiveTab] = useState("profile");
	const [isEditing, setIsEditing] = useState(false);
	const validateProfileForm = (cleaned) => {
		if (!cleaned.fullName || !cleaned.phone || !cleaned.address || !cleaned.city || !cleaned.state || !cleaned.zipCode) {
			return "Please complete the required fields.";
		}
		if (!/^[A-Za-z][A-Za-z\s.'-]{1,79}$/.test(cleaned.fullName)) {
			return "Please enter a valid full name.";
		}
		if (!/^\+?[0-9()\-\s]{8,15}$/.test(cleaned.phone)) {
			return "Please enter a valid phone number.";
		}
		if (cleaned.address.length < 5) {
			return "Please enter a complete address.";
		}
		if (cleaned.city.length < 2 || cleaned.state.length < 2) {
			return "Please enter a valid city and state.";
		}
		if (!/^[A-Za-z0-9\-\s]{3,12}$/.test(cleaned.zipCode)) {
			return "Please enter a valid ZIP or postal code.";
		}
		if (cleaned.styleNotes.length > 500) {
			return "Style notes must be 500 characters or fewer.";
		}
		return "";
	};
	const loadAddresses = async () => {
		if (!authUser) return;
		try {
			const data = await apiClient.get("/api/profile/addresses");
			if (Array.isArray(data)) {
				setAddresses(data);
			}
		} catch (err) {
			console.error("[ProfilePage] loadAddresses error:", err);
		}
	};
	const loadOrdersAndCoupons = async () => {
		if (!authUser) return;
		try {
			const data = await apiClient.get("/api/profile/orders");
			if (Array.isArray(data)) {
				setOrders(data);
			}
			const cData = await apiClient.get("/api/profile/coupons");
			if (Array.isArray(cData)) {
				setCoupons(cData);
			}
		} catch (err) {
			console.error("[ProfilePage] loadOrdersAndCoupons error:", err);
		}
	};
	const handleAddressSubmit = async (e) => {
		e.preventDefault();
		setAddressMessage("");
		try {
			const response = await fetch(`${API_BASE_URL}/api/profile/addresses`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-User-Id": authUser.uid
				},
				body: JSON.stringify(addressForm)
			});
			if (!response.ok) {
				const text = await response.text();
				throw new Error(text || "Failed to save address");
			}
			setAddressForm({
				id: 0,
				fullName: "",
				phone: "",
				addressLine: "",
				city: "",
				state: "",
				zipCode: ""
			});
			setShowAddressForm(false);
			loadAddresses();
		} catch (err) {
			setAddressMessage(err.message);
		}
	};
	const handleDeleteAddress = async (id) => {
		if (!confirm("Are you sure you want to delete this address?")) return;
		try {
			const response = await fetch(`${API_BASE_URL}/api/profile/addresses?id=${id}`, {
				method: "DELETE",
				headers: { "X-User-Id": authUser.uid }
			});
			if (response.ok) {
				loadAddresses();
			}
		} catch (err) {
			console.error(err);
		}
	};
	const handleSetDefaultAddress = async (id) => {
		try {
			const response = await fetch(`${API_BASE_URL}/api/profile/addresses?id=${id}`, {
				method: "PATCH",
				headers: { "X-User-Id": authUser.uid }
			});
			if (response.ok) {
				loadAddresses();
				// Also reload profile details since primary profile address is bidirectionally synced
				const profileRes = await fetch(`${API_BASE_URL}/api/profile/me`, { headers: { "X-User-Id": authUser.uid } });
				if (profileRes.ok) {
					const profile = await profileRes.json();
					setForm({
						fullName: profile.fullName || "",
						email: profile.email || authUser.email || "",
						phone: profile.phone || "",
						address: profile.address || "",
						city: profile.city || "",
						state: profile.state || "",
						zipCode: profile.zipCode || "",
						preferredSize: profile.preferredSize || "",
						styleNotes: profile.styleNotes || ""
					});
				}
			}
		} catch (err) {
			console.error(err);
		}
	};
	useEffect(() => {
		if (!authUser) return;
		const loadProfile = async () => {
			try {
				const response = await fetch(`${API_BASE_URL}/api/profile/me`, { headers: { "X-User-Id": authUser.uid } });
				if (response.status === 404) {
					setMode("create");
					setForm((f) => ({
						...f,
						email: authUser.email || ""
					}));
					setIsEditing(true);
					setLoading(false);
					return;
				}
				if (!response.ok) {
					throw new Error("Unable to load profile");
				}
				const profile = await response.json();
				setForm({
					fullName: profile.fullName || "",
					email: profile.email || authUser.email || "",
					phone: profile.phone || "",
					address: profile.address || "",
					city: profile.city || "",
					state: profile.state || "",
					zipCode: profile.zipCode || "",
					preferredSize: profile.preferredSize || "",
					styleNotes: profile.styleNotes || ""
				});
				setMode("edit");
				setIsEditing(false);
			} catch (error) {
				setMessage({
					type: "error",
					text: "We could not load your profile right now."
				});
			} finally {
				setLoading(false);
			}
		};
		loadProfile();
		loadAddresses();
		loadOrdersAndCoupons();
	}, [authUser]);
	useEffect(() => () => {
		if (redirectTimer.current) {
			window.clearTimeout(redirectTimer.current);
		}
	}, []);
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!authUser || saving) {
			return;
		}
		const cleaned = {
			fullName: form.fullName.trim(),
			email: form.email || authUser.email || "",
			phone: form.phone.trim(),
			address: form.address.trim(),
			city: form.city.trim(),
			state: form.state.trim(),
			zipCode: form.zipCode.trim(),
			preferredSize: form.preferredSize.trim(),
			styleNotes: form.styleNotes.trim()
		};
		const validationError = validateProfileForm(cleaned);
		if (validationError) {
			setMessage({
				type: "error",
				text: validationError
			});
			setSuccessVisible(false);
			return;
		}
		setSaving(true);
		setSuccessVisible(false);
		setMessage({
			type: "",
			text: ""
		});
		try {
			const response = await fetch(`${API_BASE_URL}/api/profile/me`, {
				method: mode === "create" ? "POST" : "PATCH",
				headers: {
					"Content-Type": "application/json",
					"X-User-Id": authUser.uid
				},
				body: JSON.stringify(cleaned)
			});
			if (!response.ok) {
				const text = await response.text();
				throw new Error(text || "Unable to save profile");
			}
			const profile = await response.json();
			setForm({
				fullName: profile.fullName || "",
				email: profile.email || authUser.email || "",
				phone: profile.phone || "",
				address: profile.address || "",
				city: profile.city || "",
				state: profile.state || "",
				zipCode: profile.zipCode || "",
				preferredSize: profile.preferredSize || "",
				styleNotes: profile.styleNotes || ""
			});
			setMode("edit");
			setIsEditing(false);
			setSuccessVisible(true);
			loadAddresses();
			redirectTimer.current = window.setTimeout(() => {
				setSuccessVisible(false);
			}, 3e3);
		} catch (error) {
			setSuccessVisible(false);
			setMessage({
				type: "error",
				text: error.message || "Profile could not be saved."
			});
		} finally {
			setSaving(false);
		}
	};
	if (!authUser) {
		return /* @__PURE__ */ _jsxDEV("div", {
			className: "profile-shell",
			children: /* @__PURE__ */ _jsxDEV("div", {
				className: "profile-card",
				children: [
					/* @__PURE__ */ _jsxDEV("p", {
						className: "profile-eyebrow",
						children: "Account"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 289,
						columnNumber: 21
					}, this),
					/* @__PURE__ */ _jsxDEV("h1", { children: "Please sign in to view your profile" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 290,
						columnNumber: 21
					}, this),
					/* @__PURE__ */ _jsxDEV("p", {
						className: "profile-help",
						children: "Use the Sign In button in the header to continue."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 291,
						columnNumber: 21
					}, this),
					/* @__PURE__ */ _jsxDEV(Link, {
						to: "/auth",
						className: "btn btn-primary",
						style: {
							display: "inline-block",
							marginTop: "1.5rem"
						},
						children: "Go to Sign In"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 292,
						columnNumber: 21
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 288,
				columnNumber: 17
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 287,
			columnNumber: 13
		}, this);
	}
	if (loading) {
		return /* @__PURE__ */ _jsxDEV("div", {
			style: {
				maxWidth: "1100px",
				margin: "2.5rem auto 3rem",
				padding: "0 1.25rem",
				minHeight: "75vh"
			},
			children: /* @__PURE__ */ _jsxDEV("div", {
				style: {
					display: "flex",
					flexDirection: "column",
					gap: "1.5rem"
				},
				children: [/* @__PURE__ */ _jsxDEV("div", {
					className: "skeleton-box",
					style: {
						height: "42px",
						width: "220px",
						borderRadius: "8px"
					}
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 302,
					columnNumber: 21
				}, this), /* @__PURE__ */ _jsxDEV("div", {
					style: {
						display: "grid",
						gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
						gap: "1.5rem"
					},
					children: [
						/* @__PURE__ */ _jsxDEV("div", {
							className: "skeleton-box",
							style: {
								height: "240px",
								borderRadius: "16px"
							}
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 304,
							columnNumber: 25
						}, this),
						/* @__PURE__ */ _jsxDEV("div", {
							className: "skeleton-box",
							style: {
								height: "240px",
								borderRadius: "16px"
							}
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 305,
							columnNumber: 25
						}, this),
						/* @__PURE__ */ _jsxDEV("div", {
							className: "skeleton-box",
							style: {
								height: "240px",
								borderRadius: "16px"
							}
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 306,
							columnNumber: 25
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 303,
					columnNumber: 21
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 301,
				columnNumber: 17
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 300,
			columnNumber: 13
		}, this);
	}
	return /* @__PURE__ */ _jsxDEV("div", {
		style: {
			maxWidth: "1100px",
			margin: "2.5rem auto 3rem",
			padding: "0 1.25rem",
			minHeight: "75vh",
			fontFamily: "var(--font-body)"
		},
		children: [/* @__PURE__ */ _jsxDEV("div", {
			style: {
				display: "flex",
				alignItems: "center",
				gap: "1.25rem",
				marginBottom: "1.25rem",
				background: "#fff",
				padding: "1.25rem 1.5rem",
				borderRadius: "12px",
				boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
				border: "1px solid rgba(0,0,0,0.04)"
			},
			children: [/* @__PURE__ */ _jsxDEV("div", {
				style: {
					width: "52px",
					height: "52px",
					borderRadius: "50px",
					background: "linear-gradient(135deg, #e4b39b, #b97a66)",
					color: "#fff",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					fontSize: "1.4rem",
					fontWeight: "bold",
					boxShadow: "0 4px 10px rgba(185, 122, 102, 0.25)"
				},
				children: form.fullName ? form.fullName.trim().charAt(0).toUpperCase() : "U"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 333,
				columnNumber: 17
			}, this), /* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("h1", {
				style: {
					fontSize: "1.4rem",
					fontFamily: "var(--font-title)",
					margin: 0,
					color: "#333"
				},
				children: form.fullName || "Welcome to The Ethnic Touch"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 349,
				columnNumber: 21
			}, this), /* @__PURE__ */ _jsxDEV("p", {
				style: {
					margin: "0.15rem 0 0",
					color: "#666",
					fontSize: "0.85rem"
				},
				children: authUser.email
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 357,
				columnNumber: 21
			}, this)] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 348,
				columnNumber: 17
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 322,
			columnNumber: 13
		}, this), /* @__PURE__ */ _jsxDEV("div", {
			style: {
				display: "grid",
				gridTemplateColumns: "220px 1fr",
				gap: "1.25rem"
			},
			className: "profile-dashboard-grid",
			children: [/* @__PURE__ */ _jsxDEV("div", {
				style: {
					background: "#fff",
					padding: "1rem",
					borderRadius: "12px",
					boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
					border: "1px solid rgba(0,0,0,0.04)",
					height: "fit-content"
				},
				children: /* @__PURE__ */ _jsxDEV("ul", {
					style: {
						listStyle: "none",
						padding: 0,
						margin: 0
					},
					children: [
						/* @__PURE__ */ _jsxDEV("li", {
							onClick: () => {
								setActiveTab("profile");
								setSuccessVisible(false);
								setMessage({
									type: "",
									text: ""
								});
							},
							style: {
								padding: "0.65rem 0.9rem",
								borderRadius: "8px",
								cursor: "pointer",
								fontSize: "0.88rem",
								fontWeight: activeTab === "profile" ? "600" : "normal",
								backgroundColor: activeTab === "profile" ? "#fff0e9" : "transparent",
								color: activeTab === "profile" ? "#b97a66" : "#555",
								transition: "all 0.2s",
								marginBottom: "0.35rem",
								display: "flex",
								alignItems: "center",
								gap: "0.6rem"
							},
							children: "My Profile"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 378,
							columnNumber: 25
						}, this),
						/* @__PURE__ */ _jsxDEV("li", {
							onClick: () => {
								setActiveTab("addresses");
								setSuccessVisible(false);
								setMessage({
									type: "",
									text: ""
								});
							},
							style: {
								padding: "0.65rem 0.9rem",
								borderRadius: "8px",
								cursor: "pointer",
								fontSize: "0.88rem",
								fontWeight: activeTab === "addresses" ? "600" : "normal",
								backgroundColor: activeTab === "addresses" ? "#fff0e9" : "transparent",
								color: activeTab === "addresses" ? "#b97a66" : "#555",
								transition: "all 0.2s",
								marginBottom: "0.35rem",
								display: "flex",
								alignItems: "center",
								gap: "0.6rem"
							},
							children: "Shipping Addresses"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 397,
							columnNumber: 25
						}, this),
						/* @__PURE__ */ _jsxDEV("li", {
							onClick: () => {
								setActiveTab("orders");
								setSuccessVisible(false);
								setMessage({
									type: "",
									text: ""
								});
							},
							style: {
								padding: "0.65rem 0.9rem",
								borderRadius: "8px",
								cursor: "pointer",
								fontSize: "0.88rem",
								fontWeight: activeTab === "orders" ? "600" : "normal",
								backgroundColor: activeTab === "orders" ? "#fff0e9" : "transparent",
								color: activeTab === "orders" ? "#b97a66" : "#555",
								transition: "all 0.2s",
								marginBottom: "0.35rem",
								display: "flex",
								alignItems: "center",
								gap: "0.6rem"
							},
							children: "Order History"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 416,
							columnNumber: 25
						}, this),
						/* @__PURE__ */ _jsxDEV("li", {
							onClick: () => {
								setActiveTab("coupons");
								setSuccessVisible(false);
								setMessage({
									type: "",
									text: ""
								});
							},
							style: {
								padding: "0.65rem 0.9rem",
								borderRadius: "8px",
								cursor: "pointer",
								fontSize: "0.88rem",
								fontWeight: activeTab === "coupons" ? "600" : "normal",
								backgroundColor: activeTab === "coupons" ? "#fff0e9" : "transparent",
								color: activeTab === "coupons" ? "#b97a66" : "#555",
								transition: "all 0.2s",
								display: "flex",
								alignItems: "center",
								gap: "0.6rem"
							},
							children: "My Coupons"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 435,
							columnNumber: 25
						}, this),
						/* @__PURE__ */ _jsxDEV("li", {
							onClick: () => {
								if (auth) {
									signOut(auth).then(() => {
										window.location.hash = "#/";
									});
								}
							},
							style: {
								padding: "0.65rem 0.9rem",
								borderRadius: "8px",
								cursor: "pointer",
								fontSize: "0.88rem",
								fontWeight: "500",
								backgroundColor: "transparent",
								color: "#d32f2f",
								transition: "all 0.2s",
								marginTop: "0.75rem",
								borderTop: "1px solid #f5f5f5",
								display: "flex",
								alignItems: "center",
								gap: "0.6rem"
							},
							onMouseEnter: (e) => {
								e.target.style.backgroundColor = "#fdf2f2";
							},
							onMouseLeave: (e) => {
								e.target.style.backgroundColor = "transparent";
							},
							children: "Sign Out"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 453,
							columnNumber: 25
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 377,
					columnNumber: 21
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 369,
				columnNumber: 17
			}, this), /* @__PURE__ */ _jsxDEV("div", {
				style: {
					background: "#fff",
					padding: "1.5rem",
					borderRadius: "12px",
					boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
					border: "1px solid rgba(0,0,0,0.04)",
					minHeight: "380px"
				},
				children: [
					activeTab === "profile" && /* @__PURE__ */ _jsxDEV("div", { children: [
						/* @__PURE__ */ _jsxDEV("div", {
							style: {
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								marginBottom: "2rem",
								borderBottom: "1px solid #f0f0f0",
								paddingBottom: "1rem"
							},
							children: [/* @__PURE__ */ _jsxDEV("h2", {
								style: {
									fontFamily: "var(--font-title)",
									margin: 0,
									fontSize: "1.4rem",
									color: "#333"
								},
								children: "Account Profile"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 498,
								columnNumber: 33
							}, this), mode === "edit" && /* @__PURE__ */ _jsxDEV("button", {
								type: "button",
								onClick: () => setIsEditing(!isEditing),
								className: "btn",
								style: {
									border: "1px solid #b97a66",
									color: "#b97a66",
									backgroundColor: isEditing ? "#fff0e9" : "transparent",
									padding: "0.5rem 1.2rem",
									borderRadius: "6px",
									fontSize: "0.9rem",
									fontWeight: "500",
									cursor: "pointer"
								},
								children: isEditing ? "Cancel Edit" : "Edit Profile"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 500,
								columnNumber: 37
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 497,
							columnNumber: 29
						}, this),
						message.text && /* @__PURE__ */ _jsxDEV("div", {
							style: {
								padding: "1rem",
								borderRadius: "6px",
								backgroundColor: message.type === "error" ? "#fde8e8" : "#eafaf1",
								color: message.type === "error" ? "#9b1c1c" : "#0e6245",
								marginBottom: "1.5rem",
								fontSize: "0.9rem"
							},
							children: message.text
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 521,
							columnNumber: 33
						}, this),
						successVisible && /* @__PURE__ */ _jsxDEV("div", {
							style: {
								textAlign: "center",
								padding: "2rem 1rem",
								background: "#f4fbf7",
								border: "1px solid #c8e6c9",
								borderRadius: "8px",
								marginBottom: "1.5rem"
							},
							children: [
								/* @__PURE__ */ _jsxDEV("span", {
									style: {
										fontSize: "3rem",
										color: "#2e7d32"
									},
									children: "✓"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 542,
									columnNumber: 37
								}, this),
								/* @__PURE__ */ _jsxDEV("h4", {
									style: {
										margin: "0.5rem 0 0.2rem",
										color: "#2e7d32"
									},
									children: "Profile Updated Successfully!"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 543,
									columnNumber: 37
								}, this),
								/* @__PURE__ */ _jsxDEV("p", {
									style: {
										margin: 0,
										fontSize: "0.85rem",
										color: "#666"
									},
									children: "Your profile has been saved."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 544,
									columnNumber: 37
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 534,
							columnNumber: 33
						}, this),
						!isEditing && mode === "edit" ? /* @__PURE__ */ _jsxDEV("div", {
							style: {
								display: "grid",
								gridTemplateColumns: "1fr 1fr",
								gap: "2rem"
							},
							children: [
								/* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("label", {
									style: {
										fontSize: "0.85rem",
										color: "#888",
										display: "block",
										marginBottom: "0.2rem"
									},
									children: "Full Name"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 551,
									columnNumber: 41
								}, this), /* @__PURE__ */ _jsxDEV("p", {
									style: {
										fontSize: "1.05rem",
										color: "#333",
										fontWeight: "500",
										margin: 0
									},
									children: form.fullName || "-"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 552,
									columnNumber: 41
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 550,
									columnNumber: 37
								}, this),
								/* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("label", {
									style: {
										fontSize: "0.85rem",
										color: "#888",
										display: "block",
										marginBottom: "0.2rem"
									},
									children: "Email Address"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 555,
									columnNumber: 41
								}, this), /* @__PURE__ */ _jsxDEV("p", {
									style: {
										fontSize: "1.05rem",
										color: "#333",
										fontWeight: "500",
										margin: 0
									},
									children: form.email || "-"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 556,
									columnNumber: 41
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 554,
									columnNumber: 37
								}, this),
								/* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("label", {
									style: {
										fontSize: "0.85rem",
										color: "#888",
										display: "block",
										marginBottom: "0.2rem"
									},
									children: "Phone Number"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 559,
									columnNumber: 41
								}, this), /* @__PURE__ */ _jsxDEV("p", {
									style: {
										fontSize: "1.05rem",
										color: "#333",
										fontWeight: "500",
										margin: 0
									},
									children: form.phone || "-"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 560,
									columnNumber: 41
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 558,
									columnNumber: 37
								}, this),
								/* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("label", {
									style: {
										fontSize: "0.85rem",
										color: "#888",
										display: "block",
										marginBottom: "0.2rem"
									},
									children: "ZIP / Postal Code"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 563,
									columnNumber: 41
								}, this), /* @__PURE__ */ _jsxDEV("p", {
									style: {
										fontSize: "1.05rem",
										color: "#333",
										fontWeight: "500",
										margin: 0
									},
									children: form.zipCode || "-"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 564,
									columnNumber: 41
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 562,
									columnNumber: 37
								}, this),
								/* @__PURE__ */ _jsxDEV("div", {
									style: { gridColumn: "span 2" },
									children: [/* @__PURE__ */ _jsxDEV("label", {
										style: {
											fontSize: "0.85rem",
											color: "#888",
											display: "block",
											marginBottom: "0.2rem"
										},
										children: "Primary Shipping Address"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 567,
										columnNumber: 41
									}, this), /* @__PURE__ */ _jsxDEV("p", {
										style: {
											fontSize: "1.05rem",
											color: "#333",
											fontWeight: "500",
											margin: 0
										},
										children: form.address ? `${form.address}, ${form.city}, ${form.state} - ${form.zipCode}` : "-"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 568,
										columnNumber: 41
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 566,
									columnNumber: 37
								}, this),
								/* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("label", {
									style: {
										fontSize: "0.85rem",
										color: "#888",
										display: "block",
										marginBottom: "0.2rem"
									},
									children: "Preferred Size"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 573,
									columnNumber: 41
								}, this), /* @__PURE__ */ _jsxDEV("p", {
									style: {
										fontSize: "1.05rem",
										color: "#333",
										fontWeight: "500",
										margin: 0
									},
									children: form.preferredSize || "Not set"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 574,
									columnNumber: 41
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 572,
									columnNumber: 37
								}, this),
								/* @__PURE__ */ _jsxDEV("div", {
									style: { gridColumn: "span 2" },
									children: [/* @__PURE__ */ _jsxDEV("label", {
										style: {
											fontSize: "0.85rem",
											color: "#888",
											display: "block",
											marginBottom: "0.2rem"
										},
										children: "Style Preferences & Notes"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 577,
										columnNumber: 41
									}, this), /* @__PURE__ */ _jsxDEV("p", {
										style: {
											fontSize: "1.05rem",
											color: "#333",
											margin: 0,
											whiteSpace: "pre-wrap",
											lineHeight: "1.4"
										},
										children: form.styleNotes || "None added"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 578,
										columnNumber: 41
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 576,
									columnNumber: 37
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 549,
							columnNumber: 33
						}, this) : /* @__PURE__ */ _jsxDEV("form", {
							onSubmit: handleSubmit,
							style: {
								display: "grid",
								gridTemplateColumns: "1fr 1fr",
								gap: "1.5rem"
							},
							children: [
								/* @__PURE__ */ _jsxDEV("div", {
									style: { gridColumn: "span 2" },
									children: [/* @__PURE__ */ _jsxDEV("label", {
										style: {
											display: "block",
											fontSize: "0.9rem",
											marginBottom: "0.4rem",
											color: "#555"
										},
										children: "Email Address (Required)"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 584,
										columnNumber: 41
									}, this), /* @__PURE__ */ _jsxDEV("input", {
										type: "email",
										value: form.email,
										readOnly: true,
										style: {
											width: "100%",
											padding: "0.75rem",
											border: "1px solid #ddd",
											borderRadius: "6px",
											backgroundColor: "#f9f9f9",
											color: "#777",
											outline: "none"
										}
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 585,
										columnNumber: 41
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 583,
									columnNumber: 37
								}, this),
								/* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("label", {
									style: {
										display: "block",
										fontSize: "0.9rem",
										marginBottom: "0.4rem",
										color: "#555"
									},
									children: "Full Name *"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 593,
									columnNumber: 41
								}, this), /* @__PURE__ */ _jsxDEV("input", {
									type: "text",
									required: true,
									placeholder: "Enter your full name",
									value: form.fullName,
									onChange: (e) => setForm({
										...form,
										fullName: e.target.value
									}),
									style: {
										width: "100%",
										padding: "0.75rem",
										border: "1px solid #ddd",
										borderRadius: "6px",
										outline: "none"
									}
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 594,
									columnNumber: 41
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 592,
									columnNumber: 37
								}, this),
								/* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("label", {
									style: {
										display: "block",
										fontSize: "0.9rem",
										marginBottom: "0.4rem",
										color: "#555"
									},
									children: "Phone Number *"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 604,
									columnNumber: 41
								}, this), /* @__PURE__ */ _jsxDEV("input", {
									type: "tel",
									required: true,
									placeholder: "10-digit number",
									value: form.phone,
									onChange: (e) => setForm({
										...form,
										phone: e.target.value
									}),
									style: {
										width: "100%",
										padding: "0.75rem",
										border: "1px solid #ddd",
										borderRadius: "6px",
										outline: "none"
									}
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 605,
									columnNumber: 41
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 603,
									columnNumber: 37
								}, this),
								/* @__PURE__ */ _jsxDEV("div", {
									style: { gridColumn: "span 2" },
									children: [/* @__PURE__ */ _jsxDEV("label", {
										style: {
											display: "block",
											fontSize: "0.9rem",
											marginBottom: "0.4rem",
											color: "#555"
										},
										children: "Shipping Address Line *"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 615,
										columnNumber: 41
									}, this), /* @__PURE__ */ _jsxDEV("input", {
										type: "text",
										required: true,
										placeholder: "Apartment, Street Address",
										value: form.address,
										onChange: (e) => setForm({
											...form,
											address: e.target.value
										}),
										style: {
											width: "100%",
											padding: "0.75rem",
											border: "1px solid #ddd",
											borderRadius: "6px",
											outline: "none"
										}
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 616,
										columnNumber: 41
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 614,
									columnNumber: 37
								}, this),
								/* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("label", {
									style: {
										display: "block",
										fontSize: "0.9rem",
										marginBottom: "0.4rem",
										color: "#555"
									},
									children: "City *"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 626,
									columnNumber: 41
								}, this), /* @__PURE__ */ _jsxDEV("input", {
									type: "text",
									required: true,
									placeholder: "City Name",
									value: form.city,
									onChange: (e) => setForm({
										...form,
										city: e.target.value
									}),
									style: {
										width: "100%",
										padding: "0.75rem",
										border: "1px solid #ddd",
										borderRadius: "6px",
										outline: "none"
									}
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 627,
									columnNumber: 41
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 625,
									columnNumber: 37
								}, this),
								/* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("label", {
									style: {
										display: "block",
										fontSize: "0.9rem",
										marginBottom: "0.4rem",
										color: "#555"
									},
									children: "State *"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 637,
									columnNumber: 41
								}, this), /* @__PURE__ */ _jsxDEV("input", {
									type: "text",
									required: true,
									placeholder: "State Name",
									value: form.state,
									onChange: (e) => setForm({
										...form,
										state: e.target.value
									}),
									style: {
										width: "100%",
										padding: "0.75rem",
										border: "1px solid #ddd",
										borderRadius: "6px",
										outline: "none"
									}
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 638,
									columnNumber: 41
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 636,
									columnNumber: 37
								}, this),
								/* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("label", {
									style: {
										display: "block",
										fontSize: "0.9rem",
										marginBottom: "0.4rem",
										color: "#555"
									},
									children: "ZIP / Postal Code *"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 648,
									columnNumber: 41
								}, this), /* @__PURE__ */ _jsxDEV("input", {
									type: "text",
									required: true,
									placeholder: "6-digit PIN code",
									value: form.zipCode,
									onChange: (e) => setForm({
										...form,
										zipCode: e.target.value
									}),
									style: {
										width: "100%",
										padding: "0.75rem",
										border: "1px solid #ddd",
										borderRadius: "6px",
										outline: "none"
									}
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 649,
									columnNumber: 41
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 647,
									columnNumber: 37
								}, this),
								/* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("label", {
									style: {
										display: "block",
										fontSize: "0.9rem",
										marginBottom: "0.4rem",
										color: "#555"
									},
									children: "Preferred Sizing (Optional)"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 659,
									columnNumber: 41
								}, this), /* @__PURE__ */ _jsxDEV("select", {
									value: form.preferredSize,
									onChange: (e) => setForm({
										...form,
										preferredSize: e.target.value
									}),
									style: {
										width: "100%",
										padding: "0.75rem",
										border: "1px solid #ddd",
										borderRadius: "6px",
										outline: "none",
										backgroundColor: "#fff"
									},
									children: [
										/* @__PURE__ */ _jsxDEV("option", {
											value: "",
											children: "Choose Sizing"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 665,
											columnNumber: 45
										}, this),
										/* @__PURE__ */ _jsxDEV("option", {
											value: "XS",
											children: "XS"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 666,
											columnNumber: 45
										}, this),
										/* @__PURE__ */ _jsxDEV("option", {
											value: "S",
											children: "S"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 667,
											columnNumber: 45
										}, this),
										/* @__PURE__ */ _jsxDEV("option", {
											value: "M",
											children: "M"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 668,
											columnNumber: 45
										}, this),
										/* @__PURE__ */ _jsxDEV("option", {
											value: "L",
											children: "L"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 669,
											columnNumber: 45
										}, this),
										/* @__PURE__ */ _jsxDEV("option", {
											value: "XL",
											children: "XL"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 670,
											columnNumber: 45
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 660,
									columnNumber: 41
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 658,
									columnNumber: 37
								}, this),
								/* @__PURE__ */ _jsxDEV("div", {
									style: { gridColumn: "span 2" },
									children: [/* @__PURE__ */ _jsxDEV("label", {
										style: {
											display: "block",
											fontSize: "0.9rem",
											marginBottom: "0.4rem",
											color: "#555"
										},
										children: "Style Preferences & Special Instructions"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 674,
										columnNumber: 41
									}, this), /* @__PURE__ */ _jsxDEV("textarea", {
										rows: "3",
										placeholder: "Tell us what fit, patterns or fabrics you love",
										value: form.styleNotes,
										onChange: (e) => setForm({
											...form,
											styleNotes: e.target.value
										}),
										style: {
											width: "100%",
											padding: "0.75rem",
											border: "1px solid #ddd",
											borderRadius: "6px",
											outline: "none",
											resize: "none"
										}
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 675,
										columnNumber: 41
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 673,
									columnNumber: 37
								}, this),
								/* @__PURE__ */ _jsxDEV("div", {
									style: {
										gridColumn: "span 2",
										marginTop: "1rem"
									},
									children: /* @__PURE__ */ _jsxDEV("button", {
										type: "submit",
										className: "btn btn-primary",
										disabled: saving,
										style: {
											padding: "0.8rem 2.5rem",
											width: "100%"
										},
										children: saving ? "Saving..." : mode === "create" ? "Create Profile" : "Save Details"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 684,
										columnNumber: 41
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 683,
									columnNumber: 37
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 582,
							columnNumber: 33
						}, this)
					] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 496,
						columnNumber: 25
					}, this),
					activeTab === "addresses" && /* @__PURE__ */ _jsxDEV("div", { children: [
						/* @__PURE__ */ _jsxDEV("div", {
							style: {
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								marginBottom: "2rem",
								borderBottom: "1px solid #f0f0f0",
								paddingBottom: "1rem"
							},
							children: [/* @__PURE__ */ _jsxDEV("h2", {
								style: {
									fontFamily: "var(--font-title)",
									margin: 0,
									fontSize: "1.4rem",
									color: "#333"
								},
								children: "Saved Addresses Book"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 702,
								columnNumber: 33
							}, this), /* @__PURE__ */ _jsxDEV("button", {
								type: "button",
								onClick: () => {
									setAddressForm({
										id: 0,
										fullName: "",
										phone: "",
										addressLine: "",
										city: "",
										state: "",
										zipCode: ""
									});
									setAddressMessage("");
									setShowAddressForm(!showAddressForm);
								},
								className: "btn btn-primary",
								style: {
									padding: "0.5rem 1.2rem",
									borderRadius: "6px",
									fontSize: "0.9rem"
								},
								children: showAddressForm ? "Close Form" : "+ Add Address"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 703,
								columnNumber: 33
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 701,
							columnNumber: 29
						}, this),
						showAddressForm && /* @__PURE__ */ _jsxDEV("form", {
							onSubmit: handleAddressSubmit,
							style: {
								background: "#fafafa",
								padding: "1.5rem",
								borderRadius: "8px",
								border: "1px solid #eee",
								marginBottom: "2rem",
								display: "grid",
								gridTemplateColumns: "1fr 1fr",
								gap: "1rem"
							},
							children: [
								/* @__PURE__ */ _jsxDEV("h4", {
									style: {
										gridColumn: "span 2",
										margin: "0 0 0.5rem",
										fontFamily: "var(--font-title)",
										fontSize: "1.1rem"
									},
									children: addressForm.id > 0 ? "Edit Shipping Address" : "New Shipping Address"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 728,
									columnNumber: 37
								}, this),
								addressMessage && /* @__PURE__ */ _jsxDEV("p", {
									style: {
										gridColumn: "span 2",
										color: "red",
										margin: 0,
										fontSize: "0.85rem"
									},
									children: addressMessage
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 732,
									columnNumber: 56
								}, this),
								/* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("label", {
									style: {
										display: "block",
										fontSize: "0.8rem",
										color: "#666",
										marginBottom: "0.2rem"
									},
									children: "Full Name *"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 735,
									columnNumber: 41
								}, this), /* @__PURE__ */ _jsxDEV("input", {
									type: "text",
									required: true,
									value: addressForm.fullName,
									onChange: (e) => setAddressForm({
										...addressForm,
										fullName: e.target.value
									}),
									style: {
										width: "100%",
										padding: "0.5rem",
										border: "1px solid #ddd",
										borderRadius: "4px"
									}
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 736,
									columnNumber: 41
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 734,
									columnNumber: 37
								}, this),
								/* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("label", {
									style: {
										display: "block",
										fontSize: "0.8rem",
										color: "#666",
										marginBottom: "0.2rem"
									},
									children: "Contact Phone *"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 739,
									columnNumber: 41
								}, this), /* @__PURE__ */ _jsxDEV("input", {
									type: "text",
									required: true,
									value: addressForm.phone,
									onChange: (e) => setAddressForm({
										...addressForm,
										phone: e.target.value
									}),
									style: {
										width: "100%",
										padding: "0.5rem",
										border: "1px solid #ddd",
										borderRadius: "4px"
									}
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 740,
									columnNumber: 41
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 738,
									columnNumber: 37
								}, this),
								/* @__PURE__ */ _jsxDEV("div", {
									style: { gridColumn: "span 2" },
									children: [/* @__PURE__ */ _jsxDEV("label", {
										style: {
											display: "block",
											fontSize: "0.8rem",
											color: "#666",
											marginBottom: "0.2rem"
										},
										children: "Address Line *"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 743,
										columnNumber: 41
									}, this), /* @__PURE__ */ _jsxDEV("input", {
										type: "text",
										required: true,
										value: addressForm.addressLine,
										onChange: (e) => setAddressForm({
											...addressForm,
											addressLine: e.target.value
										}),
										style: {
											width: "100%",
											padding: "0.5rem",
											border: "1px solid #ddd",
											borderRadius: "4px"
										}
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 744,
										columnNumber: 41
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 742,
									columnNumber: 37
								}, this),
								/* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("label", {
									style: {
										display: "block",
										fontSize: "0.8rem",
										color: "#666",
										marginBottom: "0.2rem"
									},
									children: "City *"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 747,
									columnNumber: 41
								}, this), /* @__PURE__ */ _jsxDEV("input", {
									type: "text",
									required: true,
									value: addressForm.city,
									onChange: (e) => setAddressForm({
										...addressForm,
										city: e.target.value
									}),
									style: {
										width: "100%",
										padding: "0.5rem",
										border: "1px solid #ddd",
										borderRadius: "4px"
									}
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 748,
									columnNumber: 41
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 746,
									columnNumber: 37
								}, this),
								/* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("label", {
									style: {
										display: "block",
										fontSize: "0.8rem",
										color: "#666",
										marginBottom: "0.2rem"
									},
									children: "State *"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 751,
									columnNumber: 41
								}, this), /* @__PURE__ */ _jsxDEV("input", {
									type: "text",
									required: true,
									value: addressForm.state,
									onChange: (e) => setAddressForm({
										...addressForm,
										state: e.target.value
									}),
									style: {
										width: "100%",
										padding: "0.5rem",
										border: "1px solid #ddd",
										borderRadius: "4px"
									}
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 752,
									columnNumber: 41
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 750,
									columnNumber: 37
								}, this),
								/* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("label", {
									style: {
										display: "block",
										fontSize: "0.8rem",
										color: "#666",
										marginBottom: "0.2rem"
									},
									children: "ZIP Code *"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 755,
									columnNumber: 41
								}, this), /* @__PURE__ */ _jsxDEV("input", {
									type: "text",
									required: true,
									value: addressForm.zipCode,
									onChange: (e) => setAddressForm({
										...addressForm,
										zipCode: e.target.value
									}),
									style: {
										width: "100%",
										padding: "0.5rem",
										border: "1px solid #ddd",
										borderRadius: "4px"
									}
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 756,
									columnNumber: 41
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 754,
									columnNumber: 37
								}, this),
								/* @__PURE__ */ _jsxDEV("div", {
									style: {
										gridColumn: "span 2",
										display: "flex",
										justifyContent: "flex-end",
										gap: "0.5rem",
										marginTop: "0.5rem"
									},
									children: [/* @__PURE__ */ _jsxDEV("button", {
										type: "button",
										onClick: () => setShowAddressForm(false),
										className: "btn-secondary",
										style: {
											padding: "0.5rem 1rem",
											borderRadius: "4px",
											fontSize: "0.85rem"
										},
										children: "Cancel"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 759,
										columnNumber: 41
									}, this), /* @__PURE__ */ _jsxDEV("button", {
										type: "submit",
										className: "btn-primary",
										style: {
											padding: "0.5rem 1rem",
											borderRadius: "4px",
											fontSize: "0.85rem"
										},
										children: "Save Address"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 760,
										columnNumber: 41
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 758,
									columnNumber: 37
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 718,
							columnNumber: 33
						}, this),
						addresses.length === 0 ? /* @__PURE__ */ _jsxDEV("p", {
							style: {
								color: "#888",
								textAlign: "center",
								marginTop: "2rem"
							},
							children: "No shipping addresses added yet."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 766,
							columnNumber: 33
						}, this) : /* @__PURE__ */ _jsxDEV("div", {
							style: {
								display: "grid",
								gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
								gap: "1.5rem"
							},
							children: addresses.map((addr) => /* @__PURE__ */ _jsxDEV("div", {
								style: {
									border: "1px solid #eee",
									padding: "1.5rem",
									borderRadius: "8px",
									position: "relative",
									backgroundColor: addr.isDefault ? "#fffcf9" : "#fff",
									borderColor: addr.isDefault ? "#e4b39b" : "#eee"
								},
								children: [
									addr.isDefault && /* @__PURE__ */ _jsxDEV("span", {
										style: {
											position: "absolute",
											top: "12px",
											right: "12px",
											fontSize: "0.7rem",
											textTransform: "uppercase",
											letterSpacing: "0.5px",
											background: "#e4b39b",
											color: "#fff",
											padding: "2px 8px",
											borderRadius: "10px",
											fontWeight: "600"
										},
										children: "Default"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 779,
										columnNumber: 49
									}, this),
									/* @__PURE__ */ _jsxDEV("h4", {
										style: {
											margin: "0 0 0.5rem",
											fontSize: "1rem",
											fontFamily: "var(--font-title)"
										},
										children: addr.fullName
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 786,
										columnNumber: 45
									}, this),
									/* @__PURE__ */ _jsxDEV("p", {
										style: {
											margin: "0 0 0.2rem",
											fontSize: "0.85rem",
											color: "#666",
											lineHeight: "1.4"
										},
										children: addr.addressLine
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 787,
										columnNumber: 45
									}, this),
									/* @__PURE__ */ _jsxDEV("p", {
										style: {
											margin: "0 0 0.5rem",
											fontSize: "0.85rem",
											color: "#666"
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
										lineNumber: 788,
										columnNumber: 45
									}, this),
									/* @__PURE__ */ _jsxDEV("p", {
										style: {
											margin: "0 0 1rem",
											fontSize: "0.85rem",
											color: "#555",
											fontWeight: "500"
										},
										children: ["Phone: ", addr.phone]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 789,
										columnNumber: 45
									}, this),
									/* @__PURE__ */ _jsxDEV("div", {
										style: {
											display: "flex",
											gap: "1rem",
											fontSize: "0.8rem",
											borderTop: "1px solid #f5f5f5",
											paddingTop: "0.8rem"
										},
										children: [
											!addr.isDefault && /* @__PURE__ */ _jsxDEV("button", {
												type: "button",
												onClick: () => handleSetDefaultAddress(addr.id),
												style: {
													background: "none",
													border: "none",
													color: "#b97a66",
													fontWeight: "500",
													cursor: "pointer",
													padding: 0
												},
												children: "Set Default"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 793,
												columnNumber: 53
											}, this),
											/* @__PURE__ */ _jsxDEV("button", {
												type: "button",
												onClick: () => {
													setAddressForm({
														id: addr.id,
														fullName: addr.fullName,
														phone: addr.phone,
														addressLine: addr.addressLine,
														city: addr.city,
														state: addr.state,
														zipCode: addr.zipCode
													});
													setAddressMessage("");
													setShowAddressForm(true);
												},
												style: {
													background: "none",
													border: "none",
													color: "#666",
													cursor: "pointer",
													padding: 0
												},
												children: "Edit"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 795,
												columnNumber: 49
											}, this),
											/* @__PURE__ */ _jsxDEV("button", {
												type: "button",
												onClick: () => handleDeleteAddress(addr.id),
												style: {
													background: "none",
													border: "none",
													color: "#d32f2f",
													cursor: "pointer",
													padding: 0
												},
												children: "Delete"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 808,
												columnNumber: 49
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 791,
										columnNumber: 45
									}, this)
								]
							}, addr.id, true, {
								fileName: _jsxFileName,
								lineNumber: 770,
								columnNumber: 41
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 768,
							columnNumber: 33
						}, this)
					] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 700,
						columnNumber: 25
					}, this),
					activeTab === "orders" && /* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("h2", {
						style: {
							fontFamily: "var(--font-title)",
							marginBottom: "1.5rem",
							fontSize: "1.4rem",
							borderBottom: "1px solid #f0f0f0",
							paddingBottom: "1rem"
						},
						children: "Order History"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 820,
						columnNumber: 29
					}, this), orders.length === 0 ? /* @__PURE__ */ _jsxDEV("p", {
						style: {
							color: "#888",
							textAlign: "center",
							marginTop: "2rem"
						},
						children: "You have not placed any orders yet."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 822,
						columnNumber: 33
					}, this) : /* @__PURE__ */ _jsxDEV("div", {
						style: {
							display: "flex",
							flexDirection: "column",
							gap: "1.5rem"
						},
						children: orders.map((order) => /* @__PURE__ */ _jsxDEV("div", {
							style: {
								border: "1px solid #eee",
								borderRadius: "8px",
								padding: "1.5rem",
								backgroundColor: "#fafafa"
							},
							children: [
								/* @__PURE__ */ _jsxDEV("div", {
									style: {
										display: "flex",
										justifyContent: "space-between",
										flexWrap: "wrap",
										gap: "1rem",
										borderBottom: "1px solid #eee",
										paddingBottom: "0.8rem",
										marginBottom: "1rem"
									},
									children: [/* @__PURE__ */ _jsxDEV("div", {
										style: {
											display: "flex",
											alignItems: "center",
											gap: "8px",
											flexWrap: "wrap"
										},
										children: [
											/* @__PURE__ */ _jsxDEV("span", {
												style: {
													fontSize: "0.8rem",
													color: "#888"
												},
												children: "Order ID:"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 829,
												columnNumber: 53
											}, this),
											/* @__PURE__ */ _jsxDEV("span", {
												style: {
													fontWeight: "600",
													fontFamily: "monospace",
													fontSize: "0.95rem"
												},
												children: order.id
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 830,
												columnNumber: 53
											}, this),
											/* @__PURE__ */ _jsxDEV(CopyButton, {
												text: order.id,
												label: "Copy ID"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 831,
												columnNumber: 53
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 828,
										columnNumber: 49
									}, this), /* @__PURE__ */ _jsxDEV("div", { children: /* @__PURE__ */ _jsxDEV("span", {
										style: {
											fontSize: "0.85rem",
											color: "#b97a66",
											fontWeight: "500",
											textTransform: "uppercase"
										},
										children: order.status
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 834,
										columnNumber: 53
									}, this) }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 833,
										columnNumber: 49
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 827,
									columnNumber: 45
								}, this),
								/* @__PURE__ */ _jsxDEV("div", {
									style: {
										display: "grid",
										gridTemplateColumns: "2fr 1fr",
										gap: "1.5rem"
									},
									children: [/* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("h5", {
										style: {
											margin: "0 0 0.5rem",
											fontSize: "0.85rem",
											color: "#888",
											textTransform: "uppercase"
										},
										children: "Items"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 840,
										columnNumber: 53
									}, this), /* @__PURE__ */ _jsxDEV("ul", {
										style: {
											listStyle: "none",
											padding: 0,
											margin: 0
										},
										children: order.items && order.items.map((it, idx) => {
											const qty = it.quantity || 1;
											const unitPrice = it.priceAtQty || 0;
											const lineTotal = unitPrice * qty;
											return /* @__PURE__ */ _jsxDEV("li", {
												style: {
													fontSize: "0.9rem",
													color: "#333",
													padding: "0.4rem 0",
													display: "flex",
													justifyContent: "space-between",
													alignItems: "center"
												},
												children: [/* @__PURE__ */ _jsxDEV("div", { children: [
													/* @__PURE__ */ _jsxDEV("span", { children: it.productName || it.productId }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 849,
														columnNumber: 74
													}, this),
													it.size && /* @__PURE__ */ _jsxDEV("span", {
														style: {
															fontSize: "0.75rem",
															background: "#fff0e9",
															color: "#b97a66",
															padding: "1px 6px",
															borderRadius: "4px",
															marginLeft: "6px",
															fontWeight: "500"
														},
														children: ["Size: ", it.size]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 851,
														columnNumber: 78
													}, this),
													/* @__PURE__ */ _jsxDEV("strong", {
														style: {
															marginLeft: "6px",
															color: "#555"
														},
														children: ["x ", qty]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 855,
														columnNumber: 74
													}, this)
												] }, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 848,
													columnNumber: 70
												}, this), /* @__PURE__ */ _jsxDEV("div", {
													style: { textAlign: "right" },
													children: [/* @__PURE__ */ _jsxDEV("span", {
														style: { fontWeight: "500" },
														children: ["₹", lineTotal.toLocaleString("en-IN")]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 858,
														columnNumber: 74
													}, this), qty > 1 && /* @__PURE__ */ _jsxDEV("span", {
														style: {
															display: "block",
															fontSize: "0.75rem",
															color: "#888"
														},
														children: [
															"(₹",
															unitPrice.toLocaleString("en-IN"),
															" each)"
														]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 860,
														columnNumber: 78
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 857,
													columnNumber: 70
												}, this)]
											}, it.productId || idx, true, {
												fileName: _jsxFileName,
												lineNumber: 847,
												columnNumber: 66
											}, this);
										})
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 841,
										columnNumber: 53
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 839,
										columnNumber: 49
									}, this), /* @__PURE__ */ _jsxDEV("div", {
										style: {
											borderLeft: "1px solid #eee",
											paddingLeft: "1.5rem",
											display: "flex",
											flexDirection: "column",
											justifyContent: "center"
										},
										children: [/* @__PURE__ */ _jsxDEV("div", {
											style: { marginBottom: "0.5rem" },
											children: [/* @__PURE__ */ _jsxDEV("span", {
												style: {
													fontSize: "0.8rem",
													color: "#888"
												},
												children: "Date:"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 872,
												columnNumber: 57
											}, this), /* @__PURE__ */ _jsxDEV("span", {
												style: {
													display: "block",
													fontSize: "0.9rem",
													fontWeight: "500"
												},
												children: new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 873,
												columnNumber: 57
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 871,
											columnNumber: 53
										}, this), /* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("span", {
											style: {
												fontSize: "0.8rem",
												color: "#888"
											},
											children: "Total Amount Paid:"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 876,
											columnNumber: 57
										}, this), /* @__PURE__ */ _jsxDEV("span", {
											style: {
												display: "block",
												fontSize: "1.15rem",
												color: "#b97a66",
												fontWeight: "600"
											},
											children: ["₹", order.totalAmount.toLocaleString("en-IN")]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 877,
											columnNumber: 57
										}, this)] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 875,
											columnNumber: 53
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 870,
										columnNumber: 49
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 838,
									columnNumber: 45
								}, this),
								order.trackingNumber && /* @__PURE__ */ _jsxDEV("div", {
									style: {
										marginTop: "1rem",
										background: "#eaf3fc",
										padding: "0.75rem 1rem",
										borderRadius: "6px",
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between",
										flexWrap: "wrap",
										gap: "0.5rem"
									},
									children: [/* @__PURE__ */ _jsxDEV("span", {
										style: {
											fontSize: "0.85rem",
											color: "#1a5695"
										},
										children: ["Shipping Carrier Tracking Number: ", /* @__PURE__ */ _jsxDEV("strong", {
											style: { fontFamily: "monospace" },
											children: order.trackingNumber
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 885,
											columnNumber: 91
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 884,
										columnNumber: 53
									}, this), /* @__PURE__ */ _jsxDEV(CopyButton, {
										text: order.trackingNumber,
										label: "Copy Tracking ID"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 887,
										columnNumber: 53
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 883,
									columnNumber: 49
								}, this),
								order.unlockedGift && /* @__PURE__ */ _jsxDEV("div", {
									style: {
										marginTop: "0.8rem",
										background: "#fff9e6",
										padding: "0.75rem 1rem",
										border: "1px dashed #fcd34d",
										borderRadius: "6px",
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between",
										flexWrap: "wrap",
										gap: "0.5rem"
									},
									children: [/* @__PURE__ */ _jsxDEV("span", {
										style: {
											fontSize: "0.85rem",
											color: "#854d0e"
										},
										children: ["Reward Unlocked: ", /* @__PURE__ */ _jsxDEV("strong", { children: order.unlockedGift }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 894,
											columnNumber: 74
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 893,
										columnNumber: 53
									}, this), /* @__PURE__ */ _jsxDEV(CopyButton, {
										text: order.unlockedGift,
										label: "Copy Code"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 896,
										columnNumber: 53
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 892,
									columnNumber: 49
								}, this)
							]
						}, order.id, true, {
							fileName: _jsxFileName,
							lineNumber: 826,
							columnNumber: 41
						}, this))
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 824,
						columnNumber: 33
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 819,
						columnNumber: 25
					}, this),
					activeTab === "coupons" && /* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("h2", {
						style: {
							fontFamily: "var(--font-title)",
							marginBottom: "1.5rem",
							fontSize: "1.4rem",
							borderBottom: "1px solid #f0f0f0",
							paddingBottom: "1rem"
						},
						children: "My Loyalty Coupons"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 909,
						columnNumber: 29
					}, this), coupons.length === 0 ? /* @__PURE__ */ _jsxDEV("p", {
						style: {
							color: "#888",
							textAlign: "center",
							marginTop: "2rem"
						},
						children: "No dynamic coupons issued to your email yet."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 911,
						columnNumber: 33
					}, this) : /* @__PURE__ */ _jsxDEV("div", {
						style: {
							display: "grid",
							gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
							gap: "1.4rem"
						},
						children: coupons.map((c) => /* @__PURE__ */ _jsxDEV("div", {
							style: {
								border: "2px dashed #e4b39b",
								padding: "1.3rem 1rem",
								borderRadius: "12px",
								backgroundColor: "#fffcf9",
								textAlign: "center",
								position: "relative",
								overflow: "hidden",
								boxShadow: "0 4px 15px rgba(0,0,0,0.03)"
							},
							children: [
								/* @__PURE__ */ _jsxDEV("div", { style: {
									position: "absolute",
									top: 0,
									left: 0,
									right: 0,
									height: "4px",
									background: "linear-gradient(90deg, #e4b39b, #b97a66)"
								} }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 925,
									columnNumber: 45
								}, this),
								/* @__PURE__ */ _jsxDEV("div", {
									style: {
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										gap: "0.4rem",
										margin: "0.4rem 0 0.8rem",
										backgroundColor: "#ffffff",
										border: "1px dashed #e4b39b",
										borderRadius: "8px",
										padding: "0.4rem 0.6rem"
									},
									children: [/* @__PURE__ */ _jsxDEV("strong", {
										style: {
											fontSize: "1.05rem",
											fontFamily: "monospace",
											color: "#b97a66",
											letterSpacing: "1px",
											whiteSpace: "nowrap"
										},
										children: c.code
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 942,
										columnNumber: 49
									}, this), /* @__PURE__ */ _jsxDEV(CopyButton, {
										text: c.code,
										iconOnly: true,
										style: {
											padding: "4px 6px",
											borderRadius: "4px"
										}
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 951,
										columnNumber: 49
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 931,
									columnNumber: 45
								}, this),
								/* @__PURE__ */ _jsxDEV("h4", {
									style: {
										margin: "0.5rem 0 0.2rem",
										fontSize: "1.35rem",
										fontFamily: "var(--font-title)",
										color: "#2D2A26",
										fontWeight: "700"
									},
									children: c.type === "percentage" ? `${c.value}% OFF` : `₹${c.value} OFF`
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 955,
									columnNumber: 45
								}, this),
								/* @__PURE__ */ _jsxDEV("p", {
									style: {
										margin: "0 0 0.5rem",
										fontSize: "0.78rem",
										color: "#777"
									},
									children: ["Min order of ₹", c.minOrder.toLocaleString("en-IN")]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 959,
									columnNumber: 45
								}, this),
								(() => {
									if (!c.expiryDate) return null;
									const expiryDate = new Date(c.expiryDate);
									const today = new Date();
									today.setHours(0, 0, 0, 0);
									expiryDate.setHours(0, 0, 0, 0);
									const diffTime = expiryDate.getTime() - today.getTime();
									const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
									let badgeColor = "#666";
									let text = "";
									if (diffDays < 0) {
										badgeColor = "#ef4444";
										text = `Expired on ${new Date(c.expiryDate).toLocaleDateString()}`;
									} else if (diffDays === 0) {
										badgeColor = "#d97706";
										text = "Expires today!";
									} else if (diffDays === 1) {
										badgeColor = "#d97706";
										text = "Expires tomorrow!";
									} else if (diffDays <= 7) {
										badgeColor = "#d97706";
										text = `Expires in ${diffDays} days`;
									} else {
										badgeColor = "#15803d";
										text = `Expires in ${diffDays} days`;
									}
									return /* @__PURE__ */ _jsxDEV("div", {
										style: {
											margin: "0.3rem auto 0",
											fontSize: "0.72rem",
											padding: "3px 8px",
											borderRadius: "4px",
											backgroundColor: badgeColor + "10",
											color: badgeColor,
											fontWeight: "600",
											display: "inline-block"
										},
										children: text
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 995,
										columnNumber: 53
									}, this);
								})(),
								/* @__PURE__ */ _jsxDEV("div", {
									style: {
										marginTop: "0.8rem",
										paddingTop: "0.6rem",
										borderTop: "1px dashed #eee",
										fontSize: "0.78rem",
										color: "#555"
									},
									children: [/* @__PURE__ */ _jsxDEV("div", { children: ["Status: ", /* @__PURE__ */ _jsxDEV("strong", {
										style: { color: c.isActive ? "#15803d" : "#b91c1c" },
										children: c.isActive ? "Active" : "Redeemed"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1018,
										columnNumber: 62
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1018,
										columnNumber: 49
									}, this), /* @__PURE__ */ _jsxDEV("div", {
										style: {
											fontSize: "0.74rem",
											color: "#777",
											marginTop: "0.15rem"
										},
										children: [
											"Used: ",
											c.usedCount,
											" / ",
											c.usageLimit,
											" times"
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1019,
										columnNumber: 49
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1011,
									columnNumber: 45
								}, this)
							]
						}, c.id, true, {
							fileName: _jsxFileName,
							lineNumber: 915,
							columnNumber: 41
						}, this))
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 913,
						columnNumber: 33
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 908,
						columnNumber: 25
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 485,
				columnNumber: 17
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 362,
			columnNumber: 13
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 314,
		columnNumber: 9
	}, this);
};
_s(ProfilePage, "HSUT6ITLQ6ZV5MH01oHrJh1pJKE=", false, function() {
	return [useNavigate];
});
_c = ProfilePage;
// --- MAIN APP ---
export default ProfilePage;
var _c;
$RefreshReg$(_c, "ProfilePage");
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;
import * as __vite_react_currentExports from "/src/pages/ProfilePage.jsx";
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }

  const currentExports = __vite_react_currentExports;
  queueMicrotask(() => {
    RefreshRuntime.registerExportsForReactRefresh("D:/The Ethnic Touch/frontend/src/pages/ProfilePage.jsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("D:/The Ethnic Touch/frontend/src/pages/ProfilePage.jsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
function $RefreshReg$(type, id) { return RefreshRuntime.register(type, "D:/The Ethnic Touch/frontend/src/pages/ProfilePage.jsx" + ' ' + id); }
function $RefreshSig$() { return RefreshRuntime.createSignatureFunctionForTransform(); }

//# sourceMappingURL=data:application/json;base64,eyJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLFVBQVUsV0FBVyxRQUFRLFNBQVMsbUJBQW1CO0FBQ3pFLFNBQVMsYUFBYSxNQUFNLGFBQWEsV0FBVyxRQUFRLE9BQU8sVUFBVSxxQkFBcUI7QUFDbEcsT0FBTyxnQkFBZ0I7QUFDdkIsU0FBUyxlQUFlO0FBQ3hCLFNBQVMsTUFBTSxvQkFBb0I7QUFDbkMsT0FBTyxlQUFlOzs7O0FBRXRCLE1BQU0sZUFBZSxFQUFFLGVBQWU7O0NBQ2xDLE1BQU0sV0FBVyxZQUFZO0NBQzdCLE1BQU0sQ0FBQyxTQUFTLGNBQWMsU0FBUyxJQUFJO0NBQzNDLE1BQU0sQ0FBQyxRQUFRLGFBQWEsU0FBUyxLQUFLO0NBQzFDLE1BQU0sQ0FBQyxNQUFNLFdBQVcsU0FBUyxRQUFRO0NBQ3pDLE1BQU0sQ0FBQyxTQUFTLGNBQWMsU0FBUztFQUFFLE1BQU07RUFBSSxNQUFNO0NBQUcsQ0FBQztDQUM3RCxNQUFNLENBQUMsZ0JBQWdCLHFCQUFxQixTQUFTLEtBQUs7Q0FDMUQsTUFBTSxnQkFBZ0IsT0FBTyxJQUFJO0NBQ2pDLE1BQU0sQ0FBQyxNQUFNLFdBQVcsU0FBUztFQUM3QixVQUFVO0VBQ1YsT0FBTztFQUNQLE9BQU87RUFDUCxTQUFTO0VBQ1QsTUFBTTtFQUNOLE9BQU87RUFDUCxTQUFTO0VBQ1QsZUFBZTtFQUNmLFlBQVk7Q0FDaEIsQ0FBQztDQUVELE1BQU0sQ0FBQyxXQUFXLGdCQUFnQixTQUFTLENBQUMsQ0FBQztDQUM3QyxNQUFNLENBQUMsYUFBYSxrQkFBa0IsU0FBUztFQUFFLElBQUk7RUFBRyxVQUFVO0VBQUksT0FBTztFQUFJLGFBQWE7RUFBSSxNQUFNO0VBQUksT0FBTztFQUFJLFNBQVM7Q0FBRyxDQUFDO0NBQ3BJLE1BQU0sQ0FBQyxpQkFBaUIsc0JBQXNCLFNBQVMsS0FBSztDQUM1RCxNQUFNLENBQUMsZ0JBQWdCLHFCQUFxQixTQUFTLEVBQUU7O0NBR3ZELE1BQU0sQ0FBQyxRQUFRLGFBQWEsU0FBUyxDQUFDLENBQUM7Q0FDdkMsTUFBTSxDQUFDLFNBQVMsY0FBYyxTQUFTLENBQUMsQ0FBQztDQUN6QyxNQUFNLENBQUMsV0FBVyxnQkFBZ0IsU0FBUyxTQUFTO0NBQ3BELE1BQU0sQ0FBQyxXQUFXLGdCQUFnQixTQUFTLEtBQUs7Q0FFaEQsTUFBTSx1QkFBdUIsWUFBWTtFQUNyQyxJQUFJLENBQUMsUUFBUSxZQUFZLENBQUMsUUFBUSxTQUFTLENBQUMsUUFBUSxXQUFXLENBQUMsUUFBUSxRQUFRLENBQUMsUUFBUSxTQUFTLENBQUMsUUFBUSxTQUFTO0dBQ2hILE9BQU87RUFDWDtFQUNBLElBQUksQ0FBQyxnQ0FBZ0MsS0FBSyxRQUFRLFFBQVEsR0FBRztHQUN6RCxPQUFPO0VBQ1g7RUFDQSxJQUFJLENBQUMseUJBQXlCLEtBQUssUUFBUSxLQUFLLEdBQUc7R0FDL0MsT0FBTztFQUNYO0VBQ0EsSUFBSSxRQUFRLFFBQVEsU0FBUyxHQUFHO0dBQzVCLE9BQU87RUFDWDtFQUNBLElBQUksUUFBUSxLQUFLLFNBQVMsS0FBSyxRQUFRLE1BQU0sU0FBUyxHQUFHO0dBQ3JELE9BQU87RUFDWDtFQUNBLElBQUksQ0FBQywwQkFBMEIsS0FBSyxRQUFRLE9BQU8sR0FBRztHQUNsRCxPQUFPO0VBQ1g7RUFDQSxJQUFJLFFBQVEsV0FBVyxTQUFTLEtBQUs7R0FDakMsT0FBTztFQUNYO0VBQ0EsT0FBTztDQUNYO0NBRUEsTUFBTSxnQkFBZ0IsWUFBWTtFQUM5QixJQUFJLENBQUMsVUFBVTtFQUNmLElBQUk7R0FDQSxNQUFNLE9BQU8sTUFBTSxVQUFVLElBQUksd0JBQXdCO0dBQ3pELElBQUksTUFBTSxRQUFRLElBQUksR0FBRztJQUNyQixhQUFhLElBQUk7R0FDckI7RUFDSixTQUFTLEtBQUs7R0FDVixRQUFRLE1BQU0sc0NBQXNDLEdBQUc7RUFDM0Q7Q0FDSjtDQUVBLE1BQU0sdUJBQXVCLFlBQVk7RUFDckMsSUFBSSxDQUFDLFVBQVU7RUFDZixJQUFJO0dBQ0EsTUFBTSxPQUFPLE1BQU0sVUFBVSxJQUFJLHFCQUFxQjtHQUN0RCxJQUFJLE1BQU0sUUFBUSxJQUFJLEdBQUc7SUFDckIsVUFBVSxJQUFJO0dBQ2xCO0dBRUEsTUFBTSxRQUFRLE1BQU0sVUFBVSxJQUFJLHNCQUFzQjtHQUN4RCxJQUFJLE1BQU0sUUFBUSxLQUFLLEdBQUc7SUFDdEIsV0FBVyxLQUFLO0dBQ3BCO0VBQ0osU0FBUyxLQUFLO0dBQ1YsUUFBUSxNQUFNLDZDQUE2QyxHQUFHO0VBQ2xFO0NBQ0o7Q0FFQSxNQUFNLHNCQUFzQixPQUFPLE1BQU07RUFDckMsRUFBRSxlQUFlO0VBQ2pCLGtCQUFrQixFQUFFO0VBQ3BCLElBQUk7R0FDQSxNQUFNLFdBQVcsTUFBTSxNQUFNLEdBQUcsYUFBYSx5QkFBeUI7SUFDbEUsUUFBUTtJQUNSLFNBQVM7S0FDTCxnQkFBZ0I7S0FDaEIsYUFBYSxTQUFTO0lBQzFCO0lBQ0EsTUFBTSxLQUFLLFVBQVUsV0FBVztHQUNwQyxDQUFDO0dBQ0QsSUFBSSxDQUFDLFNBQVMsSUFBSTtJQUNkLE1BQU0sT0FBTyxNQUFNLFNBQVMsS0FBSztJQUNqQyxNQUFNLElBQUksTUFBTSxRQUFRLHdCQUF3QjtHQUNwRDtHQUNBLGVBQWU7SUFBRSxJQUFJO0lBQUcsVUFBVTtJQUFJLE9BQU87SUFBSSxhQUFhO0lBQUksTUFBTTtJQUFJLE9BQU87SUFBSSxTQUFTO0dBQUcsQ0FBQztHQUNwRyxtQkFBbUIsS0FBSztHQUN4QixjQUFjO0VBQ2xCLFNBQVMsS0FBSztHQUNWLGtCQUFrQixJQUFJLE9BQU87RUFDakM7Q0FDSjtDQUVBLE1BQU0sc0JBQXNCLE9BQU8sT0FBTztFQUN0QyxJQUFJLENBQUMsUUFBUSwrQ0FBK0MsR0FBRztFQUMvRCxJQUFJO0dBQ0EsTUFBTSxXQUFXLE1BQU0sTUFBTSxHQUFHLGFBQWEsNEJBQTRCLE1BQU07SUFDM0UsUUFBUTtJQUNSLFNBQVMsRUFBRSxhQUFhLFNBQVMsSUFBSTtHQUN6QyxDQUFDO0dBQ0QsSUFBSSxTQUFTLElBQUk7SUFDYixjQUFjO0dBQ2xCO0VBQ0osU0FBUyxLQUFLO0dBQ1YsUUFBUSxNQUFNLEdBQUc7RUFDckI7Q0FDSjtDQUVBLE1BQU0sMEJBQTBCLE9BQU8sT0FBTztFQUMxQyxJQUFJO0dBQ0EsTUFBTSxXQUFXLE1BQU0sTUFBTSxHQUFHLGFBQWEsNEJBQTRCLE1BQU07SUFDM0UsUUFBUTtJQUNSLFNBQVMsRUFBRSxhQUFhLFNBQVMsSUFBSTtHQUN6QyxDQUFDO0dBQ0QsSUFBSSxTQUFTLElBQUk7SUFDYixjQUFjOztJQUVkLE1BQU0sYUFBYSxNQUFNLE1BQU0sR0FBRyxhQUFhLGtCQUFrQixFQUM3RCxTQUFTLEVBQUUsYUFBYSxTQUFTLElBQUksRUFDekMsQ0FBQztJQUNELElBQUksV0FBVyxJQUFJO0tBQ2YsTUFBTSxVQUFVLE1BQU0sV0FBVyxLQUFLO0tBQ3RDLFFBQVE7TUFDSixVQUFVLFFBQVEsWUFBWTtNQUM5QixPQUFPLFFBQVEsU0FBUyxTQUFTLFNBQVM7TUFDMUMsT0FBTyxRQUFRLFNBQVM7TUFDeEIsU0FBUyxRQUFRLFdBQVc7TUFDNUIsTUFBTSxRQUFRLFFBQVE7TUFDdEIsT0FBTyxRQUFRLFNBQVM7TUFDeEIsU0FBUyxRQUFRLFdBQVc7TUFDNUIsZUFBZSxRQUFRLGlCQUFpQjtNQUN4QyxZQUFZLFFBQVEsY0FBYztLQUN0QyxDQUFDO0lBQ0w7R0FDSjtFQUNKLFNBQVMsS0FBSztHQUNWLFFBQVEsTUFBTSxHQUFHO0VBQ3JCO0NBQ0o7Q0FFQSxnQkFBZ0I7RUFDWixJQUFJLENBQUMsVUFBVTtFQUVmLE1BQU0sY0FBYyxZQUFZO0dBQzVCLElBQUk7SUFDQSxNQUFNLFdBQVcsTUFBTSxNQUFNLEdBQUcsYUFBYSxrQkFBa0IsRUFDM0QsU0FBUyxFQUFFLGFBQWEsU0FBUyxJQUFJLEVBQ3pDLENBQUM7SUFDRCxJQUFJLFNBQVMsV0FBVyxLQUFLO0tBQ3pCLFFBQVEsUUFBUTtLQUNoQixTQUFRLE9BQU07TUFBRSxHQUFHO01BQUcsT0FBTyxTQUFTLFNBQVM7S0FBRyxFQUFFO0tBQ3BELGFBQWEsSUFBSTtLQUNqQixXQUFXLEtBQUs7S0FDaEI7SUFDSjtJQUNBLElBQUksQ0FBQyxTQUFTLElBQUk7S0FDZCxNQUFNLElBQUksTUFBTSx3QkFBd0I7SUFDNUM7SUFDQSxNQUFNLFVBQVUsTUFBTSxTQUFTLEtBQUs7SUFDcEMsUUFBUTtLQUNKLFVBQVUsUUFBUSxZQUFZO0tBQzlCLE9BQU8sUUFBUSxTQUFTLFNBQVMsU0FBUztLQUMxQyxPQUFPLFFBQVEsU0FBUztLQUN4QixTQUFTLFFBQVEsV0FBVztLQUM1QixNQUFNLFFBQVEsUUFBUTtLQUN0QixPQUFPLFFBQVEsU0FBUztLQUN4QixTQUFTLFFBQVEsV0FBVztLQUM1QixlQUFlLFFBQVEsaUJBQWlCO0tBQ3hDLFlBQVksUUFBUSxjQUFjO0lBQ3RDLENBQUM7SUFDRCxRQUFRLE1BQU07SUFDZCxhQUFhLEtBQUs7R0FDdEIsU0FBUyxPQUFPO0lBQ1osV0FBVztLQUFFLE1BQU07S0FBUyxNQUFNO0lBQTRDLENBQUM7R0FDbkYsVUFBVTtJQUNOLFdBQVcsS0FBSztHQUNwQjtFQUNKO0VBRUEsWUFBWTtFQUNaLGNBQWM7RUFDZCxxQkFBcUI7Q0FDekIsR0FBRyxDQUFDLFFBQVEsQ0FBQztDQUViLHNCQUFzQjtFQUNsQixJQUFJLGNBQWMsU0FBUztHQUN2QixPQUFPLGFBQWEsY0FBYyxPQUFPO0VBQzdDO0NBQ0osR0FBRyxDQUFDLENBQUM7Q0FFTCxNQUFNLGVBQWUsT0FBTyxNQUFNO0VBQzlCLEVBQUUsZUFBZTtFQUNqQixJQUFJLENBQUMsWUFBWSxRQUFRO0dBQ3JCO0VBQ0o7RUFFQSxNQUFNLFVBQVU7R0FDWixVQUFVLEtBQUssU0FBUyxLQUFLO0dBQzdCLE9BQU8sS0FBSyxTQUFTLFNBQVMsU0FBUztHQUN2QyxPQUFPLEtBQUssTUFBTSxLQUFLO0dBQ3ZCLFNBQVMsS0FBSyxRQUFRLEtBQUs7R0FDM0IsTUFBTSxLQUFLLEtBQUssS0FBSztHQUNyQixPQUFPLEtBQUssTUFBTSxLQUFLO0dBQ3ZCLFNBQVMsS0FBSyxRQUFRLEtBQUs7R0FDM0IsZUFBZSxLQUFLLGNBQWMsS0FBSztHQUN2QyxZQUFZLEtBQUssV0FBVyxLQUFLO0VBQ3JDO0VBRUEsTUFBTSxrQkFBa0Isb0JBQW9CLE9BQU87RUFDbkQsSUFBSSxpQkFBaUI7R0FDakIsV0FBVztJQUFFLE1BQU07SUFBUyxNQUFNO0dBQWdCLENBQUM7R0FDbkQsa0JBQWtCLEtBQUs7R0FDdkI7RUFDSjtFQUVBLFVBQVUsSUFBSTtFQUNkLGtCQUFrQixLQUFLO0VBQ3ZCLFdBQVc7R0FBRSxNQUFNO0dBQUksTUFBTTtFQUFHLENBQUM7RUFFakMsSUFBSTtHQUNBLE1BQU0sV0FBVyxNQUFNLE1BQU0sR0FBRyxhQUFhLGtCQUFrQjtJQUMzRCxRQUFRLFNBQVMsV0FBVyxTQUFTO0lBQ3JDLFNBQVM7S0FDTCxnQkFBZ0I7S0FDaEIsYUFBYSxTQUFTO0lBQzFCO0lBQ0EsTUFBTSxLQUFLLFVBQVUsT0FBTztHQUNoQyxDQUFDO0dBRUQsSUFBSSxDQUFDLFNBQVMsSUFBSTtJQUNkLE1BQU0sT0FBTyxNQUFNLFNBQVMsS0FBSztJQUNqQyxNQUFNLElBQUksTUFBTSxRQUFRLHdCQUF3QjtHQUNwRDtHQUVBLE1BQU0sVUFBVSxNQUFNLFNBQVMsS0FBSztHQUNwQyxRQUFRO0lBQ0osVUFBVSxRQUFRLFlBQVk7SUFDOUIsT0FBTyxRQUFRLFNBQVMsU0FBUyxTQUFTO0lBQzFDLE9BQU8sUUFBUSxTQUFTO0lBQ3hCLFNBQVMsUUFBUSxXQUFXO0lBQzVCLE1BQU0sUUFBUSxRQUFRO0lBQ3RCLE9BQU8sUUFBUSxTQUFTO0lBQ3hCLFNBQVMsUUFBUSxXQUFXO0lBQzVCLGVBQWUsUUFBUSxpQkFBaUI7SUFDeEMsWUFBWSxRQUFRLGNBQWM7R0FDdEMsQ0FBQztHQUNELFFBQVEsTUFBTTtHQUNkLGFBQWEsS0FBSztHQUNsQixrQkFBa0IsSUFBSTtHQUN0QixjQUFjO0dBQ2QsY0FBYyxVQUFVLE9BQU8saUJBQWlCO0lBQzVDLGtCQUFrQixLQUFLO0dBQzNCLEdBQUcsR0FBSTtFQUNYLFNBQVMsT0FBTztHQUNaLGtCQUFrQixLQUFLO0dBQ3ZCLFdBQVc7SUFBRSxNQUFNO0lBQVMsTUFBTSxNQUFNLFdBQVc7R0FBOEIsQ0FBQztFQUN0RixVQUFVO0dBQ04sVUFBVSxLQUFLO0VBQ25CO0NBQ0o7Q0FFQSxJQUFJLENBQUMsVUFBVTtFQUNYLE9BQ0ksd0JBQUMsT0FBRDtHQUFLLFdBQVU7YUFDWCx3QkFBQyxPQUFEO0lBQUssV0FBVTtjQUFmO0tBQ0ksd0JBQUMsS0FBRDtNQUFHLFdBQVU7Z0JBQWtCO0tBQVU7Ozs7O0tBQ3pDLHdCQUFDLE1BQUQsWUFBSSxzQ0FBdUM7Ozs7O0tBQzNDLHdCQUFDLEtBQUQ7TUFBRyxXQUFVO2dCQUFlO0tBQW9EOzs7OztLQUNoRix3QkFBQyxNQUFEO01BQU0sSUFBRztNQUFRLFdBQVU7TUFBa0IsT0FBTztPQUFDLFNBQVE7T0FBZ0IsV0FBVTtNQUFRO2dCQUFHO0tBQW1COzs7OztJQUNwSDs7Ozs7O0VBQ0o7Ozs7O0NBRWI7Q0FFQSxJQUFJLFNBQVM7RUFDVCxPQUNJLHdCQUFDLE9BQUQ7R0FBSyxPQUFPO0lBQUUsVUFBVTtJQUFVLFFBQVE7SUFBb0IsU0FBUztJQUFhLFdBQVc7R0FBTzthQUNsRyx3QkFBQyxPQUFEO0lBQUssT0FBTztLQUFFLFNBQVM7S0FBUSxlQUFlO0tBQVUsS0FBSztJQUFTO2NBQXRFLENBQ0ksd0JBQUMsT0FBRDtLQUFLLFdBQVU7S0FBZSxPQUFPO01BQUUsUUFBUTtNQUFRLE9BQU87TUFBUyxjQUFjO0tBQU07SUFBSTs7OztjQUMvRix3QkFBQyxPQUFEO0tBQUssT0FBTztNQUFFLFNBQVM7TUFBUSxxQkFBcUI7TUFBd0MsS0FBSztLQUFTO2VBQTFHO01BQ0ksd0JBQUMsT0FBRDtPQUFLLFdBQVU7T0FBZSxPQUFPO1FBQUUsUUFBUTtRQUFTLGNBQWM7T0FBTztNQUFJOzs7OztNQUNqRix3QkFBQyxPQUFEO09BQUssV0FBVTtPQUFlLE9BQU87UUFBRSxRQUFRO1FBQVMsY0FBYztPQUFPO01BQUk7Ozs7O01BQ2pGLHdCQUFDLE9BQUQ7T0FBSyxXQUFVO09BQWUsT0FBTztRQUFFLFFBQVE7UUFBUyxjQUFjO09BQU87TUFBSTs7Ozs7S0FDaEY7Ozs7O1lBQ0o7Ozs7OztFQUNKOzs7OztDQUViO0NBRUEsT0FDSSx3QkFBQyxPQUFEO0VBQUssT0FBTztHQUNSLFVBQVU7R0FDVixRQUFRO0dBQ1IsU0FBUztHQUNULFdBQVc7R0FDWCxZQUFZO0VBQ2hCO1lBTkEsQ0FRSSx3QkFBQyxPQUFEO0dBQUssT0FBTztJQUNSLFNBQVM7SUFDVCxZQUFZO0lBQ1osS0FBSztJQUNMLGNBQWM7SUFDZCxZQUFZO0lBQ1osU0FBUztJQUNULGNBQWM7SUFDZCxXQUFXO0lBQ1gsUUFBUTtHQUNaO2FBVkEsQ0FXSSx3QkFBQyxPQUFEO0lBQUssT0FBTztLQUNSLE9BQU87S0FDUCxRQUFRO0tBQ1IsY0FBYztLQUNkLFlBQVk7S0FDWixPQUFPO0tBQ1AsU0FBUztLQUNULFlBQVk7S0FDWixnQkFBZ0I7S0FDaEIsVUFBVTtLQUNWLFlBQVk7S0FDWixXQUFXO0lBQ2Y7Y0FDSyxLQUFLLFdBQVcsS0FBSyxTQUFTLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsWUFBWSxJQUFJO0dBQy9EOzs7O2FBQ0wsd0JBQUMsT0FBRCxhQUNJLHdCQUFDLE1BQUQ7SUFBSSxPQUFPO0tBQ1AsVUFBVTtLQUNWLFlBQVk7S0FDWixRQUFRO0tBQ1IsT0FBTztJQUNYO2NBQ0ssS0FBSyxZQUFZO0dBQ2xCOzs7O2FBQ0osd0JBQUMsS0FBRDtJQUFHLE9BQU87S0FBRSxRQUFRO0tBQWUsT0FBTztLQUFRLFVBQVU7SUFBVTtjQUFJLFNBQVM7R0FBUzs7OztXQUMzRjs7OztXQUNKOzs7OztZQUdMLHdCQUFDLE9BQUQ7R0FBSyxPQUFPO0lBQ1IsU0FBUztJQUNULHFCQUFxQjtJQUNyQixLQUFLO0dBQ1Q7R0FBRyxXQUFVO2FBSmIsQ0FPSSx3QkFBQyxPQUFEO0lBQUssT0FBTztLQUNSLFlBQVk7S0FDWixTQUFTO0tBQ1QsY0FBYztLQUNkLFdBQVc7S0FDWCxRQUFRO0tBQ1IsUUFBUTtJQUNaO2NBQ0ksd0JBQUMsTUFBRDtLQUFJLE9BQU87TUFBRSxXQUFXO01BQVEsU0FBUztNQUFHLFFBQVE7S0FBRTtlQUF0RDtNQUNJLHdCQUFDLE1BQUQ7T0FDSSxlQUFlO1FBQUUsYUFBYSxTQUFTO1FBQUcsa0JBQWtCLEtBQUs7UUFBRyxXQUFXO1NBQUUsTUFBTTtTQUFJLE1BQU07UUFBRyxDQUFDO09BQUc7T0FDeEcsT0FBTztRQUNILFNBQVM7UUFDVCxjQUFjO1FBQ2QsUUFBUTtRQUNSLFVBQVU7UUFDVixZQUFZLGNBQWMsWUFBWSxRQUFRO1FBQzlDLGlCQUFpQixjQUFjLFlBQVksWUFBWTtRQUN2RCxPQUFPLGNBQWMsWUFBWSxZQUFZO1FBQzdDLFlBQVk7UUFDWixjQUFjO1FBQ2QsU0FBUztRQUNULFlBQVk7UUFDWixLQUFLO09BQ1Q7aUJBQ0g7TUFFRzs7Ozs7TUFDSix3QkFBQyxNQUFEO09BQ0ksZUFBZTtRQUFFLGFBQWEsV0FBVztRQUFHLGtCQUFrQixLQUFLO1FBQUcsV0FBVztTQUFFLE1BQU07U0FBSSxNQUFNO1FBQUcsQ0FBQztPQUFHO09BQzFHLE9BQU87UUFDSCxTQUFTO1FBQ1QsY0FBYztRQUNkLFFBQVE7UUFDUixVQUFVO1FBQ1YsWUFBWSxjQUFjLGNBQWMsUUFBUTtRQUNoRCxpQkFBaUIsY0FBYyxjQUFjLFlBQVk7UUFDekQsT0FBTyxjQUFjLGNBQWMsWUFBWTtRQUMvQyxZQUFZO1FBQ1osY0FBYztRQUNkLFNBQVM7UUFDVCxZQUFZO1FBQ1osS0FBSztPQUNUO2lCQUNIO01BRUc7Ozs7O01BQ0osd0JBQUMsTUFBRDtPQUNJLGVBQWU7UUFBRSxhQUFhLFFBQVE7UUFBRyxrQkFBa0IsS0FBSztRQUFHLFdBQVc7U0FBRSxNQUFNO1NBQUksTUFBTTtRQUFHLENBQUM7T0FBRztPQUN2RyxPQUFPO1FBQ0gsU0FBUztRQUNULGNBQWM7UUFDZCxRQUFRO1FBQ1IsVUFBVTtRQUNWLFlBQVksY0FBYyxXQUFXLFFBQVE7UUFDN0MsaUJBQWlCLGNBQWMsV0FBVyxZQUFZO1FBQ3RELE9BQU8sY0FBYyxXQUFXLFlBQVk7UUFDNUMsWUFBWTtRQUNaLGNBQWM7UUFDZCxTQUFTO1FBQ1QsWUFBWTtRQUNaLEtBQUs7T0FDVDtpQkFDSDtNQUVHOzs7OztNQUNKLHdCQUFDLE1BQUQ7T0FDSSxlQUFlO1FBQUUsYUFBYSxTQUFTO1FBQUcsa0JBQWtCLEtBQUs7UUFBRyxXQUFXO1NBQUUsTUFBTTtTQUFJLE1BQU07UUFBRyxDQUFDO09BQUc7T0FDeEcsT0FBTztRQUNILFNBQVM7UUFDVCxjQUFjO1FBQ2QsUUFBUTtRQUNSLFVBQVU7UUFDVixZQUFZLGNBQWMsWUFBWSxRQUFRO1FBQzlDLGlCQUFpQixjQUFjLFlBQVksWUFBWTtRQUN2RCxPQUFPLGNBQWMsWUFBWSxZQUFZO1FBQzdDLFlBQVk7UUFDWixTQUFTO1FBQ1QsWUFBWTtRQUNaLEtBQUs7T0FDVDtpQkFDSDtNQUVHOzs7OztNQUNKLHdCQUFDLE1BQUQ7T0FDSSxlQUFlO1FBQ1gsSUFBSSxNQUFNO1NBQ04sUUFBUSxJQUFJLENBQUMsQ0FBQyxXQUFXO1VBQ3JCLE9BQU8sU0FBUyxPQUFPO1NBQzNCLENBQUM7UUFDTDtPQUNKO09BQ0EsT0FBTztRQUNILFNBQVM7UUFDVCxjQUFjO1FBQ2QsUUFBUTtRQUNSLFVBQVU7UUFDVixZQUFZO1FBQ1osaUJBQWlCO1FBQ2pCLE9BQU87UUFDUCxZQUFZO1FBQ1osV0FBVztRQUNYLFdBQVc7UUFDWCxTQUFTO1FBQ1QsWUFBWTtRQUNaLEtBQUs7T0FDVDtPQUNBLGVBQWMsTUFBSztRQUFFLEVBQUUsT0FBTyxNQUFNLGtCQUFrQjtPQUFXO09BQ2pFLGVBQWMsTUFBSztRQUFFLEVBQUUsT0FBTyxNQUFNLGtCQUFrQjtPQUFlO2lCQUN4RTtNQUVHOzs7OztLQUNKOzs7Ozs7R0FDSDs7OzthQUdMLHdCQUFDLE9BQUQ7SUFBSyxPQUFPO0tBQ1IsWUFBWTtLQUNaLFNBQVM7S0FDVCxjQUFjO0tBQ2QsV0FBVztLQUNYLFFBQVE7S0FDUixXQUFXO0lBQ2Y7Y0FQQTtLQVVLLGNBQWMsYUFDWCx3QkFBQyxPQUFEO01BQ0ksd0JBQUMsT0FBRDtPQUFLLE9BQU87UUFBRSxTQUFTO1FBQVEsZ0JBQWdCO1FBQWlCLFlBQVk7UUFBVSxjQUFjO1FBQVEsY0FBYztRQUFxQixlQUFlO09BQU87aUJBQXJLLENBQ0ksd0JBQUMsTUFBRDtRQUFJLE9BQU87U0FBRSxZQUFZO1NBQXFCLFFBQVE7U0FBRyxVQUFVO1NBQVUsT0FBTztRQUFPO2tCQUFHO09BQW1COzs7O2lCQUNoSCxTQUFTLFVBQ04sd0JBQUMsVUFBRDtRQUNJLE1BQUs7UUFDTCxlQUFlLGFBQWEsQ0FBQyxTQUFTO1FBQ3RDLFdBQVU7UUFDVixPQUFPO1NBQ0gsUUFBUTtTQUNSLE9BQU87U0FDUCxpQkFBaUIsWUFBWSxZQUFZO1NBQ3pDLFNBQVM7U0FDVCxjQUFjO1NBQ2QsVUFBVTtTQUNWLFlBQVk7U0FDWixRQUFRO1FBQ1o7a0JBRUMsWUFBWSxnQkFBZ0I7T0FDekI7Ozs7ZUFFWDs7Ozs7O01BRUosUUFBUSxRQUNMLHdCQUFDLE9BQUQ7T0FBSyxPQUFPO1FBQ1IsU0FBUztRQUNULGNBQWM7UUFDZCxpQkFBaUIsUUFBUSxTQUFTLFVBQVUsWUFBWTtRQUN4RCxPQUFPLFFBQVEsU0FBUyxVQUFVLFlBQVk7UUFDOUMsY0FBYztRQUNkLFVBQVU7T0FDZDtpQkFDSyxRQUFRO01BQ1I7Ozs7O01BR1Isa0JBQ0csd0JBQUMsT0FBRDtPQUFLLE9BQU87UUFDUixXQUFXO1FBQ1gsU0FBUztRQUNULFlBQVk7UUFDWixRQUFRO1FBQ1IsY0FBYztRQUNkLGNBQWM7T0FDbEI7aUJBUEE7UUFRSSx3QkFBQyxRQUFEO1NBQU0sT0FBTztVQUFFLFVBQVU7VUFBUSxPQUFPO1NBQVU7bUJBQUc7UUFBTzs7Ozs7UUFDNUQsd0JBQUMsTUFBRDtTQUFJLE9BQU87VUFBRSxRQUFRO1VBQW1CLE9BQU87U0FBVTttQkFBRztRQUFpQzs7Ozs7UUFDN0Ysd0JBQUMsS0FBRDtTQUFHLE9BQU87VUFBRSxRQUFRO1VBQUcsVUFBVTtVQUFXLE9BQU87U0FBTzttQkFBRztRQUErQjs7Ozs7T0FDM0Y7Ozs7OztNQUdQLENBQUMsYUFBYSxTQUFTLFNBQ3JCLHdCQUFDLE9BQUQ7T0FBSyxPQUFPO1FBQUUsU0FBUztRQUFRLHFCQUFxQjtRQUFXLEtBQUs7T0FBTztpQkFBM0U7UUFDSSx3QkFBQyxPQUFELGFBQ0ksd0JBQUMsU0FBRDtTQUFPLE9BQU87VUFBRSxVQUFVO1VBQVcsT0FBTztVQUFRLFNBQVM7VUFBUyxjQUFjO1NBQVM7bUJBQUc7UUFBZ0I7Ozs7a0JBQ2hILHdCQUFDLEtBQUQ7U0FBRyxPQUFPO1VBQUUsVUFBVTtVQUFXLE9BQU87VUFBUSxZQUFZO1VBQU8sUUFBUTtTQUFFO21CQUFJLEtBQUssWUFBWTtRQUFPOzs7O2dCQUN4Rzs7Ozs7UUFDTCx3QkFBQyxPQUFELGFBQ0ksd0JBQUMsU0FBRDtTQUFPLE9BQU87VUFBRSxVQUFVO1VBQVcsT0FBTztVQUFRLFNBQVM7VUFBUyxjQUFjO1NBQVM7bUJBQUc7UUFBb0I7Ozs7a0JBQ3BILHdCQUFDLEtBQUQ7U0FBRyxPQUFPO1VBQUUsVUFBVTtVQUFXLE9BQU87VUFBUSxZQUFZO1VBQU8sUUFBUTtTQUFFO21CQUFJLEtBQUssU0FBUztRQUFPOzs7O2dCQUNyRzs7Ozs7UUFDTCx3QkFBQyxPQUFELGFBQ0ksd0JBQUMsU0FBRDtTQUFPLE9BQU87VUFBRSxVQUFVO1VBQVcsT0FBTztVQUFRLFNBQVM7VUFBUyxjQUFjO1NBQVM7bUJBQUc7UUFBbUI7Ozs7a0JBQ25ILHdCQUFDLEtBQUQ7U0FBRyxPQUFPO1VBQUUsVUFBVTtVQUFXLE9BQU87VUFBUSxZQUFZO1VBQU8sUUFBUTtTQUFFO21CQUFJLEtBQUssU0FBUztRQUFPOzs7O2dCQUNyRzs7Ozs7UUFDTCx3QkFBQyxPQUFELGFBQ0ksd0JBQUMsU0FBRDtTQUFPLE9BQU87VUFBRSxVQUFVO1VBQVcsT0FBTztVQUFRLFNBQVM7VUFBUyxjQUFjO1NBQVM7bUJBQUc7UUFBd0I7Ozs7a0JBQ3hILHdCQUFDLEtBQUQ7U0FBRyxPQUFPO1VBQUUsVUFBVTtVQUFXLE9BQU87VUFBUSxZQUFZO1VBQU8sUUFBUTtTQUFFO21CQUFJLEtBQUssV0FBVztRQUFPOzs7O2dCQUN2Rzs7Ozs7UUFDTCx3QkFBQyxPQUFEO1NBQUssT0FBTyxFQUFFLFlBQVksU0FBUzttQkFBbkMsQ0FDSSx3QkFBQyxTQUFEO1VBQU8sT0FBTztXQUFFLFVBQVU7V0FBVyxPQUFPO1dBQVEsU0FBUztXQUFTLGNBQWM7VUFBUztvQkFBRztTQUErQjs7OzttQkFDL0gsd0JBQUMsS0FBRDtVQUFHLE9BQU87V0FBRSxVQUFVO1dBQVcsT0FBTztXQUFRLFlBQVk7V0FBTyxRQUFRO1VBQUU7b0JBQ3hFLEtBQUssVUFBVSxHQUFHLEtBQUssUUFBUSxJQUFJLEtBQUssS0FBSyxJQUFJLEtBQUssTUFBTSxLQUFLLEtBQUssWUFBWTtTQUNwRjs7OztpQkFDRjs7Ozs7O1FBQ0wsd0JBQUMsT0FBRCxhQUNJLHdCQUFDLFNBQUQ7U0FBTyxPQUFPO1VBQUUsVUFBVTtVQUFXLE9BQU87VUFBUSxTQUFTO1VBQVMsY0FBYztTQUFTO21CQUFHO1FBQXFCOzs7O2tCQUNySCx3QkFBQyxLQUFEO1NBQUcsT0FBTztVQUFFLFVBQVU7VUFBVyxPQUFPO1VBQVEsWUFBWTtVQUFPLFFBQVE7U0FBRTttQkFBSSxLQUFLLGlCQUFpQjtRQUFhOzs7O2dCQUNuSDs7Ozs7UUFDTCx3QkFBQyxPQUFEO1NBQUssT0FBTyxFQUFFLFlBQVksU0FBUzttQkFBbkMsQ0FDSSx3QkFBQyxTQUFEO1VBQU8sT0FBTztXQUFFLFVBQVU7V0FBVyxPQUFPO1dBQVEsU0FBUztXQUFTLGNBQWM7VUFBUztvQkFBRztTQUFnQzs7OzttQkFDaEksd0JBQUMsS0FBRDtVQUFHLE9BQU87V0FBRSxVQUFVO1dBQVcsT0FBTztXQUFRLFFBQVE7V0FBRyxZQUFZO1dBQVksWUFBWTtVQUFNO29CQUFJLEtBQUssY0FBYztTQUFnQjs7OztpQkFDM0k7Ozs7OztPQUNKOzs7OztpQkFFTCx3QkFBQyxRQUFEO09BQU0sVUFBVTtPQUFjLE9BQU87UUFBRSxTQUFTO1FBQVEscUJBQXFCO1FBQVcsS0FBSztPQUFTO2lCQUF0RztRQUNJLHdCQUFDLE9BQUQ7U0FBSyxPQUFPLEVBQUUsWUFBWSxTQUFTO21CQUFuQyxDQUNJLHdCQUFDLFNBQUQ7VUFBTyxPQUFPO1dBQUUsU0FBUztXQUFTLFVBQVU7V0FBVSxjQUFjO1dBQVUsT0FBTztVQUFPO29CQUFHO1NBQStCOzs7O21CQUM5SCx3QkFBQyxTQUFEO1VBQ0ksTUFBSztVQUNMLE9BQU8sS0FBSztVQUNaO1VBQ0EsT0FBTztXQUFFLE9BQU87V0FBUSxTQUFTO1dBQVcsUUFBUTtXQUFrQixjQUFjO1dBQU8saUJBQWlCO1dBQVcsT0FBTztXQUFRLFNBQVM7VUFBTztTQUN6Sjs7OztpQkFDQTs7Ozs7O1FBQ0wsd0JBQUMsT0FBRCxhQUNJLHdCQUFDLFNBQUQ7U0FBTyxPQUFPO1VBQUUsU0FBUztVQUFTLFVBQVU7VUFBVSxjQUFjO1VBQVUsT0FBTztTQUFPO21CQUFHO1FBQWtCOzs7O2tCQUNqSCx3QkFBQyxTQUFEO1NBQ0ksTUFBSztTQUNMO1NBQ0EsYUFBWTtTQUNaLE9BQU8sS0FBSztTQUNaLFdBQVUsTUFBSyxRQUFRO1VBQUUsR0FBRztVQUFNLFVBQVUsRUFBRSxPQUFPO1NBQU0sQ0FBQztTQUM1RCxPQUFPO1VBQUUsT0FBTztVQUFRLFNBQVM7VUFBVyxRQUFRO1VBQWtCLGNBQWM7VUFBTyxTQUFTO1NBQU87UUFDOUc7Ozs7Z0JBQ0E7Ozs7O1FBQ0wsd0JBQUMsT0FBRCxhQUNJLHdCQUFDLFNBQUQ7U0FBTyxPQUFPO1VBQUUsU0FBUztVQUFTLFVBQVU7VUFBVSxjQUFjO1VBQVUsT0FBTztTQUFPO21CQUFHO1FBQXFCOzs7O2tCQUNwSCx3QkFBQyxTQUFEO1NBQ0ksTUFBSztTQUNMO1NBQ0EsYUFBWTtTQUNaLE9BQU8sS0FBSztTQUNaLFdBQVUsTUFBSyxRQUFRO1VBQUUsR0FBRztVQUFNLE9BQU8sRUFBRSxPQUFPO1NBQU0sQ0FBQztTQUN6RCxPQUFPO1VBQUUsT0FBTztVQUFRLFNBQVM7VUFBVyxRQUFRO1VBQWtCLGNBQWM7VUFBTyxTQUFTO1NBQU87UUFDOUc7Ozs7Z0JBQ0E7Ozs7O1FBQ0wsd0JBQUMsT0FBRDtTQUFLLE9BQU8sRUFBRSxZQUFZLFNBQVM7bUJBQW5DLENBQ0ksd0JBQUMsU0FBRDtVQUFPLE9BQU87V0FBRSxTQUFTO1dBQVMsVUFBVTtXQUFVLGNBQWM7V0FBVSxPQUFPO1VBQU87b0JBQUc7U0FBOEI7Ozs7bUJBQzdILHdCQUFDLFNBQUQ7VUFDSSxNQUFLO1VBQ0w7VUFDQSxhQUFZO1VBQ1osT0FBTyxLQUFLO1VBQ1osV0FBVSxNQUFLLFFBQVE7V0FBRSxHQUFHO1dBQU0sU0FBUyxFQUFFLE9BQU87VUFBTSxDQUFDO1VBQzNELE9BQU87V0FBRSxPQUFPO1dBQVEsU0FBUztXQUFXLFFBQVE7V0FBa0IsY0FBYztXQUFPLFNBQVM7VUFBTztTQUM5Rzs7OztpQkFDQTs7Ozs7O1FBQ0wsd0JBQUMsT0FBRCxhQUNJLHdCQUFDLFNBQUQ7U0FBTyxPQUFPO1VBQUUsU0FBUztVQUFTLFVBQVU7VUFBVSxjQUFjO1VBQVUsT0FBTztTQUFPO21CQUFHO1FBQWE7Ozs7a0JBQzVHLHdCQUFDLFNBQUQ7U0FDSSxNQUFLO1NBQ0w7U0FDQSxhQUFZO1NBQ1osT0FBTyxLQUFLO1NBQ1osV0FBVSxNQUFLLFFBQVE7VUFBRSxHQUFHO1VBQU0sTUFBTSxFQUFFLE9BQU87U0FBTSxDQUFDO1NBQ3hELE9BQU87VUFBRSxPQUFPO1VBQVEsU0FBUztVQUFXLFFBQVE7VUFBa0IsY0FBYztVQUFPLFNBQVM7U0FBTztRQUM5Rzs7OztnQkFDQTs7Ozs7UUFDTCx3QkFBQyxPQUFELGFBQ0ksd0JBQUMsU0FBRDtTQUFPLE9BQU87VUFBRSxTQUFTO1VBQVMsVUFBVTtVQUFVLGNBQWM7VUFBVSxPQUFPO1NBQU87bUJBQUc7UUFBYzs7OztrQkFDN0csd0JBQUMsU0FBRDtTQUNJLE1BQUs7U0FDTDtTQUNBLGFBQVk7U0FDWixPQUFPLEtBQUs7U0FDWixXQUFVLE1BQUssUUFBUTtVQUFFLEdBQUc7VUFBTSxPQUFPLEVBQUUsT0FBTztTQUFNLENBQUM7U0FDekQsT0FBTztVQUFFLE9BQU87VUFBUSxTQUFTO1VBQVcsUUFBUTtVQUFrQixjQUFjO1VBQU8sU0FBUztTQUFPO1FBQzlHOzs7O2dCQUNBOzs7OztRQUNMLHdCQUFDLE9BQUQsYUFDSSx3QkFBQyxTQUFEO1NBQU8sT0FBTztVQUFFLFNBQVM7VUFBUyxVQUFVO1VBQVUsY0FBYztVQUFVLE9BQU87U0FBTzttQkFBRztRQUEwQjs7OztrQkFDekgsd0JBQUMsU0FBRDtTQUNJLE1BQUs7U0FDTDtTQUNBLGFBQVk7U0FDWixPQUFPLEtBQUs7U0FDWixXQUFVLE1BQUssUUFBUTtVQUFFLEdBQUc7VUFBTSxTQUFTLEVBQUUsT0FBTztTQUFNLENBQUM7U0FDM0QsT0FBTztVQUFFLE9BQU87VUFBUSxTQUFTO1VBQVcsUUFBUTtVQUFrQixjQUFjO1VBQU8sU0FBUztTQUFPO1FBQzlHOzs7O2dCQUNBOzs7OztRQUNMLHdCQUFDLE9BQUQsYUFDSSx3QkFBQyxTQUFEO1NBQU8sT0FBTztVQUFFLFNBQVM7VUFBUyxVQUFVO1VBQVUsY0FBYztVQUFVLE9BQU87U0FBTzttQkFBRztRQUFrQzs7OztrQkFDakksd0JBQUMsVUFBRDtTQUNJLE9BQU8sS0FBSztTQUNaLFdBQVUsTUFBSyxRQUFRO1VBQUUsR0FBRztVQUFNLGVBQWUsRUFBRSxPQUFPO1NBQU0sQ0FBQztTQUNqRSxPQUFPO1VBQUUsT0FBTztVQUFRLFNBQVM7VUFBVyxRQUFRO1VBQWtCLGNBQWM7VUFBTyxTQUFTO1VBQVEsaUJBQWlCO1NBQU87bUJBSHhJO1VBS0ksd0JBQUMsVUFBRDtXQUFRLE9BQU07cUJBQUc7VUFBcUI7Ozs7O1VBQ3RDLHdCQUFDLFVBQUQ7V0FBUSxPQUFNO3FCQUFLO1VBQVU7Ozs7O1VBQzdCLHdCQUFDLFVBQUQ7V0FBUSxPQUFNO3FCQUFJO1VBQVM7Ozs7O1VBQzNCLHdCQUFDLFVBQUQ7V0FBUSxPQUFNO3FCQUFJO1VBQVM7Ozs7O1VBQzNCLHdCQUFDLFVBQUQ7V0FBUSxPQUFNO3FCQUFJO1VBQVM7Ozs7O1VBQzNCLHdCQUFDLFVBQUQ7V0FBUSxPQUFNO3FCQUFLO1VBQVU7Ozs7O1NBQ3pCOzs7OztnQkFDUDs7Ozs7UUFDTCx3QkFBQyxPQUFEO1NBQUssT0FBTyxFQUFFLFlBQVksU0FBUzttQkFBbkMsQ0FDSSx3QkFBQyxTQUFEO1VBQU8sT0FBTztXQUFFLFNBQVM7V0FBUyxVQUFVO1dBQVUsY0FBYztXQUFVLE9BQU87VUFBTztvQkFBRztTQUErQzs7OzttQkFDOUksd0JBQUMsWUFBRDtVQUNJLE1BQUs7VUFDTCxhQUFZO1VBQ1osT0FBTyxLQUFLO1VBQ1osV0FBVSxNQUFLLFFBQVE7V0FBRSxHQUFHO1dBQU0sWUFBWSxFQUFFLE9BQU87VUFBTSxDQUFDO1VBQzlELE9BQU87V0FBRSxPQUFPO1dBQVEsU0FBUztXQUFXLFFBQVE7V0FBa0IsY0FBYztXQUFPLFNBQVM7V0FBUSxRQUFRO1VBQU87U0FDOUg7Ozs7aUJBQ0E7Ozs7OztRQUNMLHdCQUFDLE9BQUQ7U0FBSyxPQUFPO1VBQUUsWUFBWTtVQUFVLFdBQVc7U0FBTzttQkFDbEQsd0JBQUMsVUFBRDtVQUNJLE1BQUs7VUFDTCxXQUFVO1VBQ1YsVUFBVTtVQUNWLE9BQU87V0FBRSxTQUFTO1dBQWlCLE9BQU87VUFBTztvQkFFaEQsU0FBUyxjQUFlLFNBQVMsV0FBVyxtQkFBbUI7U0FDNUQ7Ozs7O1FBQ1A7Ozs7O09BQ0g7Ozs7OztLQUVUOzs7OztLQUlSLGNBQWMsZUFDWCx3QkFBQyxPQUFEO01BQ0ksd0JBQUMsT0FBRDtPQUFLLE9BQU87UUFBRSxTQUFTO1FBQVEsZ0JBQWdCO1FBQWlCLFlBQVk7UUFBVSxjQUFjO1FBQVEsY0FBYztRQUFxQixlQUFlO09BQU87aUJBQXJLLENBQ0ksd0JBQUMsTUFBRDtRQUFJLE9BQU87U0FBRSxZQUFZO1NBQXFCLFFBQVE7U0FBRyxVQUFVO1NBQVUsT0FBTztRQUFPO2tCQUFHO09BQXdCOzs7O2lCQUN0SCx3QkFBQyxVQUFEO1FBQ0ksTUFBSztRQUNMLGVBQWU7U0FDWCxlQUFlO1VBQUUsSUFBSTtVQUFHLFVBQVU7VUFBSSxPQUFPO1VBQUksYUFBYTtVQUFJLE1BQU07VUFBSSxPQUFPO1VBQUksU0FBUztTQUFHLENBQUM7U0FDcEcsa0JBQWtCLEVBQUU7U0FDcEIsbUJBQW1CLENBQUMsZUFBZTtRQUN2QztRQUNBLFdBQVU7UUFDVixPQUFPO1NBQUUsU0FBUztTQUFpQixjQUFjO1NBQU8sVUFBVTtRQUFTO2tCQUUxRSxrQkFBa0IsZUFBZTtPQUM5Qjs7OztlQUNQOzs7Ozs7TUFFSixtQkFDRyx3QkFBQyxRQUFEO09BQU0sVUFBVTtPQUFxQixPQUFPO1FBQ3hDLFlBQVk7UUFDWixTQUFTO1FBQ1QsY0FBYztRQUNkLFFBQVE7UUFDUixjQUFjO1FBQ2QsU0FBUztRQUNULHFCQUFxQjtRQUNyQixLQUFLO09BQ1Q7aUJBVEE7UUFVSSx3QkFBQyxNQUFEO1NBQUksT0FBTztVQUFFLFlBQVk7VUFBVSxRQUFRO1VBQWMsWUFBWTtVQUFxQixVQUFVO1NBQVM7bUJBQ3hHLFlBQVksS0FBSyxJQUFJLDBCQUEwQjtRQUNoRDs7Ozs7UUFFSCxrQkFBa0Isd0JBQUMsS0FBRDtTQUFHLE9BQU87VUFBRSxZQUFZO1VBQVUsT0FBTztVQUFPLFFBQVE7VUFBRyxVQUFVO1NBQVU7bUJBQUk7UUFBa0I7Ozs7O1FBRXhILHdCQUFDLE9BQUQsYUFDSSx3QkFBQyxTQUFEO1NBQU8sT0FBTztVQUFFLFNBQVM7VUFBUyxVQUFVO1VBQVUsT0FBTztVQUFRLGNBQWM7U0FBUzttQkFBRztRQUFrQjs7OztrQkFDakgsd0JBQUMsU0FBRDtTQUFPLE1BQUs7U0FBTztTQUFTLE9BQU8sWUFBWTtTQUFVLFdBQVUsTUFBSyxlQUFlO1VBQUMsR0FBRztVQUFhLFVBQVUsRUFBRSxPQUFPO1NBQUssQ0FBQztTQUFHLE9BQU87VUFBRSxPQUFPO1VBQVEsU0FBUztVQUFVLFFBQVE7VUFBa0IsY0FBYztTQUFNO1FBQUk7Ozs7Z0JBQ2hPOzs7OztRQUNMLHdCQUFDLE9BQUQsYUFDSSx3QkFBQyxTQUFEO1NBQU8sT0FBTztVQUFFLFNBQVM7VUFBUyxVQUFVO1VBQVUsT0FBTztVQUFRLGNBQWM7U0FBUzttQkFBRztRQUFzQjs7OztrQkFDckgsd0JBQUMsU0FBRDtTQUFPLE1BQUs7U0FBTztTQUFTLE9BQU8sWUFBWTtTQUFPLFdBQVUsTUFBSyxlQUFlO1VBQUMsR0FBRztVQUFhLE9BQU8sRUFBRSxPQUFPO1NBQUssQ0FBQztTQUFHLE9BQU87VUFBRSxPQUFPO1VBQVEsU0FBUztVQUFVLFFBQVE7VUFBa0IsY0FBYztTQUFNO1FBQUk7Ozs7Z0JBQzFOOzs7OztRQUNMLHdCQUFDLE9BQUQ7U0FBSyxPQUFPLEVBQUUsWUFBWSxTQUFTO21CQUFuQyxDQUNJLHdCQUFDLFNBQUQ7VUFBTyxPQUFPO1dBQUUsU0FBUztXQUFTLFVBQVU7V0FBVSxPQUFPO1dBQVEsY0FBYztVQUFTO29CQUFHO1NBQXFCOzs7O21CQUNwSCx3QkFBQyxTQUFEO1VBQU8sTUFBSztVQUFPO1VBQVMsT0FBTyxZQUFZO1VBQWEsV0FBVSxNQUFLLGVBQWU7V0FBQyxHQUFHO1dBQWEsYUFBYSxFQUFFLE9BQU87VUFBSyxDQUFDO1VBQUcsT0FBTztXQUFFLE9BQU87V0FBUSxTQUFTO1dBQVUsUUFBUTtXQUFrQixjQUFjO1VBQU07U0FBSTs7OztpQkFDdE87Ozs7OztRQUNMLHdCQUFDLE9BQUQsYUFDSSx3QkFBQyxTQUFEO1NBQU8sT0FBTztVQUFFLFNBQVM7VUFBUyxVQUFVO1VBQVUsT0FBTztVQUFRLGNBQWM7U0FBUzttQkFBRztRQUFhOzs7O2tCQUM1Ryx3QkFBQyxTQUFEO1NBQU8sTUFBSztTQUFPO1NBQVMsT0FBTyxZQUFZO1NBQU0sV0FBVSxNQUFLLGVBQWU7VUFBQyxHQUFHO1VBQWEsTUFBTSxFQUFFLE9BQU87U0FBSyxDQUFDO1NBQUcsT0FBTztVQUFFLE9BQU87VUFBUSxTQUFTO1VBQVUsUUFBUTtVQUFrQixjQUFjO1NBQU07UUFBSTs7OztnQkFDeE47Ozs7O1FBQ0wsd0JBQUMsT0FBRCxhQUNJLHdCQUFDLFNBQUQ7U0FBTyxPQUFPO1VBQUUsU0FBUztVQUFTLFVBQVU7VUFBVSxPQUFPO1VBQVEsY0FBYztTQUFTO21CQUFHO1FBQWM7Ozs7a0JBQzdHLHdCQUFDLFNBQUQ7U0FBTyxNQUFLO1NBQU87U0FBUyxPQUFPLFlBQVk7U0FBTyxXQUFVLE1BQUssZUFBZTtVQUFDLEdBQUc7VUFBYSxPQUFPLEVBQUUsT0FBTztTQUFLLENBQUM7U0FBRyxPQUFPO1VBQUUsT0FBTztVQUFRLFNBQVM7VUFBVSxRQUFRO1VBQWtCLGNBQWM7U0FBTTtRQUFJOzs7O2dCQUMxTjs7Ozs7UUFDTCx3QkFBQyxPQUFELGFBQ0ksd0JBQUMsU0FBRDtTQUFPLE9BQU87VUFBRSxTQUFTO1VBQVMsVUFBVTtVQUFVLE9BQU87VUFBUSxjQUFjO1NBQVM7bUJBQUc7UUFBaUI7Ozs7a0JBQ2hILHdCQUFDLFNBQUQ7U0FBTyxNQUFLO1NBQU87U0FBUyxPQUFPLFlBQVk7U0FBUyxXQUFVLE1BQUssZUFBZTtVQUFDLEdBQUc7VUFBYSxTQUFTLEVBQUUsT0FBTztTQUFLLENBQUM7U0FBRyxPQUFPO1VBQUUsT0FBTztVQUFRLFNBQVM7VUFBVSxRQUFRO1VBQWtCLGNBQWM7U0FBTTtRQUFJOzs7O2dCQUM5Tjs7Ozs7UUFDTCx3QkFBQyxPQUFEO1NBQUssT0FBTztVQUFFLFlBQVk7VUFBVSxTQUFTO1VBQVEsZ0JBQWdCO1VBQVksS0FBSztVQUFVLFdBQVc7U0FBUzttQkFBcEgsQ0FDSSx3QkFBQyxVQUFEO1VBQVEsTUFBSztVQUFTLGVBQWUsbUJBQW1CLEtBQUs7VUFBRyxXQUFVO1VBQWdCLE9BQU87V0FBRSxTQUFTO1dBQWUsY0FBYztXQUFPLFVBQVU7VUFBVTtvQkFBRztTQUFjOzs7O21CQUNyTCx3QkFBQyxVQUFEO1VBQVEsTUFBSztVQUFTLFdBQVU7VUFBYyxPQUFPO1dBQUUsU0FBUztXQUFlLGNBQWM7V0FBTyxVQUFVO1VBQVU7b0JBQUc7U0FBb0I7Ozs7aUJBQzlJOzs7Ozs7T0FDSDs7Ozs7O01BR1QsVUFBVSxXQUFXLElBQ2xCLHdCQUFDLEtBQUQ7T0FBRyxPQUFPO1FBQUUsT0FBTztRQUFRLFdBQVc7UUFBVSxXQUFXO09BQU87aUJBQUc7TUFBbUM7Ozs7aUJBRXhHLHdCQUFDLE9BQUQ7T0FBSyxPQUFPO1FBQUUsU0FBUztRQUFRLHFCQUFxQjtRQUF5QyxLQUFLO09BQVM7aUJBQ3RHLFVBQVUsS0FBSSxTQUNYLHdCQUFDLE9BQUQ7UUFBbUIsT0FBTztTQUN0QixRQUFRO1NBQ1IsU0FBUztTQUNULGNBQWM7U0FDZCxVQUFVO1NBQ1YsaUJBQWlCLEtBQUssWUFBWSxZQUFZO1NBQzlDLGFBQWEsS0FBSyxZQUFZLFlBQVk7UUFDOUM7a0JBUEE7U0FRSyxLQUFLLGFBQ0Ysd0JBQUMsUUFBRDtVQUFNLE9BQU87V0FDVCxVQUFVO1dBQVksS0FBSztXQUFRLE9BQU87V0FDMUMsVUFBVTtXQUFVLGVBQWU7V0FBYSxlQUFlO1dBQy9ELFlBQVk7V0FBVyxPQUFPO1dBQVEsU0FBUztXQUFXLGNBQWM7V0FDeEUsWUFBWTtVQUNoQjtvQkFBRztTQUFhOzs7OztTQUVwQix3QkFBQyxNQUFEO1VBQUksT0FBTztXQUFFLFFBQVE7V0FBYyxVQUFVO1dBQVEsWUFBWTtVQUFvQjtvQkFBSSxLQUFLO1NBQWE7Ozs7O1NBQzNHLHdCQUFDLEtBQUQ7VUFBRyxPQUFPO1dBQUUsUUFBUTtXQUFjLFVBQVU7V0FBVyxPQUFPO1dBQVEsWUFBWTtVQUFNO29CQUFJLEtBQUs7U0FBZTs7Ozs7U0FDaEgsd0JBQUMsS0FBRDtVQUFHLE9BQU87V0FBRSxRQUFRO1dBQWMsVUFBVTtXQUFXLE9BQU87VUFBTztvQkFBckU7V0FBeUUsS0FBSztXQUFLO1dBQUcsS0FBSztXQUFNO1dBQUksS0FBSztVQUFXOzs7Ozs7U0FDckgsd0JBQUMsS0FBRDtVQUFHLE9BQU87V0FBRSxRQUFRO1dBQVksVUFBVTtXQUFXLE9BQU87V0FBUSxZQUFZO1VBQU07b0JBQXRGLENBQXlGLFdBQVEsS0FBSyxLQUFTOzs7Ozs7U0FFL0csd0JBQUMsT0FBRDtVQUFLLE9BQU87V0FBRSxTQUFTO1dBQVEsS0FBSztXQUFRLFVBQVU7V0FBVSxXQUFXO1dBQXFCLFlBQVk7VUFBUztvQkFBckg7V0FDSyxDQUFDLEtBQUssYUFDSCx3QkFBQyxVQUFEO1lBQVEsTUFBSztZQUFTLGVBQWUsd0JBQXdCLEtBQUssRUFBRTtZQUFHLE9BQU87YUFBRSxZQUFZO2FBQVEsUUFBUTthQUFRLE9BQU87YUFBVyxZQUFZO2FBQU8sUUFBUTthQUFXLFNBQVM7WUFBRTtzQkFBRztXQUFtQjs7Ozs7V0FFak4sd0JBQUMsVUFBRDtZQUFRLE1BQUs7WUFBUyxlQUFlO2FBQ2pDLGVBQWU7Y0FDWCxJQUFJLEtBQUs7Y0FDVCxVQUFVLEtBQUs7Y0FDZixPQUFPLEtBQUs7Y0FDWixhQUFhLEtBQUs7Y0FDbEIsTUFBTSxLQUFLO2NBQ1gsT0FBTyxLQUFLO2NBQ1osU0FBUyxLQUFLO2FBQ2xCLENBQUM7YUFDRCxrQkFBa0IsRUFBRTthQUNwQixtQkFBbUIsSUFBSTtZQUMzQjtZQUFHLE9BQU87YUFBRSxZQUFZO2FBQVEsUUFBUTthQUFRLE9BQU87YUFBUSxRQUFRO2FBQVcsU0FBUztZQUFFO3NCQUFHO1dBQVk7Ozs7O1dBQzVHLHdCQUFDLFVBQUQ7WUFBUSxNQUFLO1lBQVMsZUFBZSxvQkFBb0IsS0FBSyxFQUFFO1lBQUcsT0FBTzthQUFFLFlBQVk7YUFBUSxRQUFRO2FBQVEsT0FBTzthQUFXLFFBQVE7YUFBVyxTQUFTO1lBQUU7c0JBQUc7V0FBYzs7Ozs7VUFDaEw7Ozs7OztRQUNKO1VBeENLLEtBQUs7Ozs7Y0F3Q1YsQ0FDUjtNQUNBOzs7OztLQUVSOzs7OztLQUlSLGNBQWMsWUFDWCx3QkFBQyxPQUFELGFBQ0ksd0JBQUMsTUFBRDtNQUFJLE9BQU87T0FBRSxZQUFZO09BQXFCLGNBQWM7T0FBVSxVQUFVO09BQVUsY0FBYztPQUFxQixlQUFlO01BQU87Z0JBQUc7S0FBaUI7Ozs7ZUFDdEssT0FBTyxXQUFXLElBQ2Ysd0JBQUMsS0FBRDtNQUFHLE9BQU87T0FBRSxPQUFPO09BQVEsV0FBVztPQUFVLFdBQVc7TUFBTztnQkFBRztLQUFzQzs7OztnQkFFM0csd0JBQUMsT0FBRDtNQUFLLE9BQU87T0FBRSxTQUFTO09BQVEsZUFBZTtPQUFVLEtBQUs7TUFBUztnQkFDakUsT0FBTyxLQUFJLFVBQ1Isd0JBQUMsT0FBRDtPQUFvQixPQUFPO1FBQUUsUUFBUTtRQUFrQixjQUFjO1FBQU8sU0FBUztRQUFVLGlCQUFpQjtPQUFVO2lCQUExSDtRQUNJLHdCQUFDLE9BQUQ7U0FBSyxPQUFPO1VBQUUsU0FBUztVQUFRLGdCQUFnQjtVQUFpQixVQUFVO1VBQVEsS0FBSztVQUFRLGNBQWM7VUFBa0IsZUFBZTtVQUFVLGNBQWM7U0FBTzttQkFBN0ssQ0FDSSx3QkFBQyxPQUFEO1VBQUssT0FBTztXQUFFLFNBQVM7V0FBUSxZQUFZO1dBQVUsS0FBSztXQUFPLFVBQVU7VUFBTztvQkFBbEY7V0FDSSx3QkFBQyxRQUFEO1lBQU0sT0FBTzthQUFFLFVBQVU7YUFBVSxPQUFPO1lBQU87c0JBQUc7V0FBZTs7Ozs7V0FDbkUsd0JBQUMsUUFBRDtZQUFNLE9BQU87YUFBRSxZQUFZO2FBQU8sWUFBWTthQUFhLFVBQVU7WUFBVTtzQkFBSSxNQUFNO1dBQVM7Ozs7O1dBQ2xHLHdCQUFDLFlBQUQ7WUFBWSxNQUFNLE1BQU07WUFBSSxPQUFNO1dBQVc7Ozs7O1VBQzVDOzs7OzttQkFDTCx3QkFBQyxPQUFELFlBQ0ksd0JBQUMsUUFBRDtVQUFNLE9BQU87V0FBRSxVQUFVO1dBQVcsT0FBTztXQUFXLFlBQVk7V0FBTyxlQUFlO1VBQVk7b0JBQUksTUFBTTtTQUFhOzs7O2tCQUMxSDs7OztpQkFDSjs7Ozs7O1FBRUwsd0JBQUMsT0FBRDtTQUFLLE9BQU87VUFBRSxTQUFTO1VBQVEscUJBQXFCO1VBQVcsS0FBSztTQUFTO21CQUE3RSxDQUNJLHdCQUFDLE9BQUQsYUFDSSx3QkFBQyxNQUFEO1VBQUksT0FBTztXQUFFLFFBQVE7V0FBYyxVQUFVO1dBQVcsT0FBTztXQUFRLGVBQWU7VUFBWTtvQkFBRztTQUFTOzs7O21CQUM5Ryx3QkFBQyxNQUFEO1VBQUksT0FBTztXQUFFLFdBQVc7V0FBUSxTQUFTO1dBQUcsUUFBUTtVQUFFO29CQUNqRCxNQUFNLFNBQVMsTUFBTSxNQUFNLEtBQUssSUFBSSxRQUFRO1dBQ3hDLE1BQU0sTUFBTSxHQUFHLFlBQVk7V0FDM0IsTUFBTSxZQUFZLEdBQUcsY0FBYztXQUNuQyxNQUFNLFlBQVksWUFBWTtXQUM5QixPQUNJLHdCQUFDLE1BQUQ7WUFBOEIsT0FBTzthQUFFLFVBQVU7YUFBVSxPQUFPO2FBQVEsU0FBUzthQUFZLFNBQVM7YUFBUSxnQkFBZ0I7YUFBaUIsWUFBWTtZQUFTO3NCQUF0SyxDQUNJLHdCQUFDLE9BQUQ7YUFDSSx3QkFBQyxRQUFELFlBQU8sR0FBRyxlQUFlLEdBQUcsVUFBZ0I7Ozs7O2FBQzNDLEdBQUcsUUFDQSx3QkFBQyxRQUFEO2NBQU0sT0FBTztlQUFFLFVBQVU7ZUFBVyxZQUFZO2VBQVcsT0FBTztlQUFXLFNBQVM7ZUFBVyxjQUFjO2VBQU8sWUFBWTtlQUFPLFlBQVk7Y0FBTTt3QkFBM0osQ0FBOEosVUFDbkosR0FBRyxJQUNSOzs7Ozs7YUFFVix3QkFBQyxVQUFEO2NBQVEsT0FBTztlQUFFLFlBQVk7ZUFBTyxPQUFPO2NBQU87d0JBQWxELENBQXFELE1BQUcsR0FBWTs7Ozs7O1lBQ25FOzs7O3NCQUNMLHdCQUFDLE9BQUQ7YUFBSyxPQUFPLEVBQUUsV0FBVyxRQUFRO3VCQUFqQyxDQUNJLHdCQUFDLFFBQUQ7Y0FBTSxPQUFPLEVBQUUsWUFBWSxNQUFNO3dCQUFqQyxDQUFvQyxLQUFFLFVBQVUsZUFBZSxPQUFPLENBQVE7Ozs7O3VCQUM3RSxNQUFNLEtBQ0gsd0JBQUMsUUFBRDtjQUFNLE9BQU87ZUFBRSxTQUFTO2VBQVMsVUFBVTtlQUFXLE9BQU87Y0FBTzt3QkFBcEU7ZUFBdUU7ZUFDaEUsVUFBVSxlQUFlLE9BQU87ZUFBRTtjQUNuQzs7Ozs7cUJBRVQ7Ozs7O29CQUNMO2NBbEJLLEdBQUcsYUFBYTs7OztrQkFrQnJCO1VBRVosQ0FBQztTQUNGOzs7O2lCQUNIOzs7O21CQUNMLHdCQUFDLE9BQUQ7VUFBSyxPQUFPO1dBQUUsWUFBWTtXQUFrQixhQUFhO1dBQVUsU0FBUztXQUFRLGVBQWU7V0FBVSxnQkFBZ0I7VUFBUztvQkFBdEksQ0FDSSx3QkFBQyxPQUFEO1dBQUssT0FBTyxFQUFFLGNBQWMsU0FBUztxQkFBckMsQ0FDSSx3QkFBQyxRQUFEO1lBQU0sT0FBTzthQUFFLFVBQVU7YUFBVSxPQUFPO1lBQU87c0JBQUc7V0FBVzs7OztxQkFDL0Qsd0JBQUMsUUFBRDtZQUFNLE9BQU87YUFBRSxTQUFTO2FBQVMsVUFBVTthQUFVLFlBQVk7WUFBTTtzQkFBSSxJQUFJLEtBQUssTUFBTSxTQUFTLENBQUMsQ0FBQyxtQkFBbUIsU0FBUyxFQUFFLFdBQVcsU0FBUyxDQUFDO1dBQVE7Ozs7bUJBQy9KOzs7OztvQkFDTCx3QkFBQyxPQUFELGFBQ0ksd0JBQUMsUUFBRDtXQUFNLE9BQU87WUFBRSxVQUFVO1lBQVUsT0FBTztXQUFPO3FCQUFHO1VBQXdCOzs7O29CQUM1RSx3QkFBQyxRQUFEO1dBQU0sT0FBTztZQUFFLFNBQVM7WUFBUyxVQUFVO1lBQVcsT0FBTztZQUFXLFlBQVk7V0FBTTtxQkFBMUYsQ0FBNkYsS0FBRSxNQUFNLFlBQVksZUFBZSxPQUFPLENBQVE7Ozs7O2tCQUM5STs7OztrQkFDSjs7Ozs7aUJBQ0o7Ozs7OztRQUVKLE1BQU0sa0JBQ0gsd0JBQUMsT0FBRDtTQUFLLE9BQU87VUFBRSxXQUFXO1VBQVEsWUFBWTtVQUFXLFNBQVM7VUFBZ0IsY0FBYztVQUFPLFNBQVM7VUFBUSxZQUFZO1VBQVUsZ0JBQWdCO1VBQWlCLFVBQVU7VUFBUSxLQUFLO1NBQVM7bUJBQTlNLENBQ0ksd0JBQUMsUUFBRDtVQUFNLE9BQU87V0FBRSxVQUFVO1dBQVcsT0FBTztVQUFVO29CQUFyRCxDQUF3RCxzQ0FDbEIsd0JBQUMsVUFBRDtXQUFRLE9BQU8sRUFBRSxZQUFZLFlBQVk7cUJBQUksTUFBTTtVQUF1Qjs7OztrQkFDMUc7Ozs7O21CQUNOLHdCQUFDLFlBQUQ7VUFBWSxNQUFNLE1BQU07VUFBZ0IsT0FBTTtTQUFvQjs7OztpQkFDakU7Ozs7OztRQUdSLE1BQU0sZ0JBQ0gsd0JBQUMsT0FBRDtTQUFLLE9BQU87VUFBRSxXQUFXO1VBQVUsWUFBWTtVQUFXLFNBQVM7VUFBZ0IsUUFBUTtVQUFzQixjQUFjO1VBQU8sU0FBUztVQUFRLFlBQVk7VUFBVSxnQkFBZ0I7VUFBaUIsVUFBVTtVQUFRLEtBQUs7U0FBUzttQkFBOU8sQ0FDSSx3QkFBQyxRQUFEO1VBQU0sT0FBTztXQUFFLFVBQVU7V0FBVyxPQUFPO1VBQVU7b0JBQXJELENBQXdELHFCQUNuQyx3QkFBQyxVQUFELFlBQVMsTUFBTSxhQUFxQjs7OztrQkFDbkQ7Ozs7O21CQUNOLHdCQUFDLFlBQUQ7VUFBWSxNQUFNLE1BQU07VUFBYyxPQUFNO1NBQWE7Ozs7aUJBQ3hEOzs7Ozs7T0FFUjtTQXpFSyxNQUFNOzs7O2FBeUVYLENBQ1I7S0FDQTs7OzthQUVSOzs7OztLQUlSLGNBQWMsYUFDWCx3QkFBQyxPQUFELGFBQ0ksd0JBQUMsTUFBRDtNQUFJLE9BQU87T0FBRSxZQUFZO09BQXFCLGNBQWM7T0FBVSxVQUFVO09BQVUsY0FBYztPQUFxQixlQUFlO01BQU87Z0JBQUc7S0FBc0I7Ozs7ZUFDM0ssUUFBUSxXQUFXLElBQ2hCLHdCQUFDLEtBQUQ7TUFBRyxPQUFPO09BQUUsT0FBTztPQUFRLFdBQVc7T0FBVSxXQUFXO01BQU87Z0JBQUc7S0FBK0M7Ozs7Z0JBRXBILHdCQUFDLE9BQUQ7TUFBSyxPQUFPO09BQUUsU0FBUztPQUFRLHFCQUFxQjtPQUF5QyxLQUFLO01BQVM7Z0JBQ3RHLFFBQVEsS0FBSSxNQUNULHdCQUFDLE9BQUQ7T0FBZ0IsT0FBTztRQUNuQixRQUFRO1FBQ1IsU0FBUztRQUNULGNBQWM7UUFDZCxpQkFBaUI7UUFDakIsV0FBVztRQUNYLFVBQVU7UUFDVixVQUFVO1FBQ1YsV0FBVztPQUNmO2lCQVRBO1FBVUksd0JBQUMsT0FBRCxFQUFLLE9BQU87U0FDUixVQUFVO1NBQVksS0FBSztTQUFHLE1BQU07U0FBRyxPQUFPO1NBQUcsUUFBUTtTQUN6RCxZQUFZO1FBQ2hCLEVBQUk7Ozs7O1FBR0osd0JBQUMsT0FBRDtTQUFLLE9BQU87VUFDUixTQUFTO1VBQ1QsWUFBWTtVQUNaLGdCQUFnQjtVQUNoQixLQUFLO1VBQ0wsUUFBUTtVQUNSLGlCQUFpQjtVQUNqQixRQUFRO1VBQ1IsY0FBYztVQUNkLFNBQVM7U0FDYjttQkFWQSxDQVdJLHdCQUFDLFVBQUQ7VUFBUSxPQUFPO1dBQ1gsVUFBVTtXQUNWLFlBQVk7V0FDWixPQUFPO1dBQ1AsZUFBZTtXQUNmLFlBQVk7VUFDaEI7b0JBQ0ssRUFBRTtTQUNDOzs7O21CQUNSLHdCQUFDLFlBQUQ7VUFBWSxNQUFNLEVBQUU7VUFBTSxVQUFVO1VBQU0sT0FBTztXQUFFLFNBQVM7V0FBVyxjQUFjO1VBQU07U0FBSTs7OztpQkFDOUY7Ozs7OztRQUdMLHdCQUFDLE1BQUQ7U0FBSSxPQUFPO1VBQUUsUUFBUTtVQUFtQixVQUFVO1VBQVcsWUFBWTtVQUFxQixPQUFPO1VBQVcsWUFBWTtTQUFNO21CQUM3SCxFQUFFLFNBQVMsZUFBZSxHQUFHLEVBQUUsTUFBTSxTQUFTLElBQUksRUFBRSxNQUFNO1FBQzNEOzs7OztRQUVKLHdCQUFDLEtBQUQ7U0FBRyxPQUFPO1VBQUUsUUFBUTtVQUFjLFVBQVU7VUFBVyxPQUFPO1NBQU87bUJBQXJFLENBQXdFLGtCQUNyRCxFQUFFLFNBQVMsZUFBZSxPQUFPLENBQ2pEOzs7Ozs7ZUFHSztTQUNKLElBQUksQ0FBQyxFQUFFLFlBQVksT0FBTztTQUMxQixNQUFNLGFBQWEsSUFBSSxLQUFLLEVBQUUsVUFBVTtTQUN4QyxNQUFNLFFBQVEsSUFBSSxLQUFLO1NBQ3ZCLE1BQU0sU0FBUyxHQUFFLEdBQUUsR0FBRSxDQUFDO1NBQ3RCLFdBQVcsU0FBUyxHQUFFLEdBQUUsR0FBRSxDQUFDO1NBRTNCLE1BQU0sV0FBVyxXQUFXLFFBQVEsSUFBSSxNQUFNLFFBQVE7U0FDdEQsTUFBTSxXQUFXLEtBQUssS0FBSyxZQUFZLE1BQU8sS0FBSyxLQUFLLEdBQUc7U0FFM0QsSUFBSSxhQUFhO1NBQ2pCLElBQUksT0FBTztTQUVYLElBQUksV0FBVyxHQUFHO1VBQ2QsYUFBYTtVQUNiLE9BQU8sY0FBYyxJQUFJLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQyxtQkFBbUI7U0FDbkUsT0FBTyxJQUFJLGFBQWEsR0FBRztVQUN2QixhQUFhO1VBQ2IsT0FBTztTQUNYLE9BQU8sSUFBSSxhQUFhLEdBQUc7VUFDdkIsYUFBYTtVQUNiLE9BQU87U0FDWCxPQUFPLElBQUksWUFBWSxHQUFHO1VBQ3RCLGFBQWE7VUFDYixPQUFPLGNBQWMsU0FBUztTQUNsQyxPQUFPO1VBQ0gsYUFBYTtVQUNiLE9BQU8sY0FBYyxTQUFTO1NBQ2xDO1NBRUEsT0FDSSx3QkFBQyxPQUFEO1VBQUssT0FBTztXQUNSLFFBQVE7V0FDUixVQUFVO1dBQ1YsU0FBUztXQUNULGNBQWM7V0FDZCxpQkFBaUIsYUFBYTtXQUM5QixPQUFPO1dBQ1AsWUFBWTtXQUNaLFNBQVM7VUFDYjtvQkFDSztTQUNBOzs7OztRQUViLEVBQUMsQ0FBRTtRQUdILHdCQUFDLE9BQUQ7U0FBSyxPQUFPO1VBQ1IsV0FBVztVQUNYLFlBQVk7VUFDWixXQUFXO1VBQ1gsVUFBVTtVQUNWLE9BQU87U0FDWDttQkFOQSxDQU9JLHdCQUFDLE9BQUQsYUFBSyxZQUFRLHdCQUFDLFVBQUQ7VUFBUSxPQUFPLEVBQUUsT0FBTyxFQUFFLFdBQVcsWUFBWSxVQUFVO29CQUFJLEVBQUUsV0FBVyxXQUFXO1NBQW1COzs7O2lCQUFNOzs7O21CQUM3SCx3QkFBQyxPQUFEO1VBQUssT0FBTztXQUFFLFVBQVU7V0FBVyxPQUFPO1dBQVEsV0FBVztVQUFVO29CQUF2RTtXQUEwRTtXQUMvRCxFQUFFO1dBQVU7V0FBSSxFQUFFO1dBQVc7VUFDbkM7Ozs7O2lCQUNKOzs7Ozs7T0FDSjtTQTVHSyxFQUFFOzs7O2FBNEdQLENBQ1I7S0FDQTs7OzthQUVSOzs7OztJQUdSOzs7OztXQUNKOzs7OztVQUNKOzs7Ozs7QUFFYjs7Ozs7O0FBSUEsZUFBZSIsIm5hbWVzIjpbXSwic291cmNlcyI6WyJQcm9maWxlUGFnZS5qc3giXSwidmVyc2lvbiI6Mywic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QsIHVzZVJlZiwgdXNlTWVtbywgdXNlQ2FsbGJhY2sgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IHVzZU5hdmlnYXRlLCBMaW5rLCB1c2VMb2NhdGlvbiwgdXNlUGFyYW1zLCBSb3V0ZXMsIFJvdXRlLCBOYXZpZ2F0ZSwgQnJvd3NlclJvdXRlciB9IGZyb20gJ3JlYWN0LXJvdXRlci1kb20nO1xyXG5pbXBvcnQgQ29weUJ1dHRvbiBmcm9tICcuLi9jb21wb25lbnRzL0NvcHlCdXR0b24nO1xyXG5pbXBvcnQgeyBzaWduT3V0IH0gZnJvbSAnZmlyZWJhc2UvYXV0aCc7XHJcbmltcG9ydCB7IGF1dGgsIEFQSV9CQVNFX1VSTCB9IGZyb20gJy4uL2RhdGEvY29uZmlnJztcclxuaW1wb3J0IGFwaUNsaWVudCBmcm9tICcuLi91dGlscy9hcGlDbGllbnQnO1xyXG5cclxuY29uc3QgUHJvZmlsZVBhZ2UgPSAoeyBhdXRoVXNlciB9KSA9PiB7XHJcbiAgICBjb25zdCBuYXZpZ2F0ZSA9IHVzZU5hdmlnYXRlKCk7XHJcbiAgICBjb25zdCBbbG9hZGluZywgc2V0TG9hZGluZ10gPSB1c2VTdGF0ZSh0cnVlKTtcclxuICAgIGNvbnN0IFtzYXZpbmcsIHNldFNhdmluZ10gPSB1c2VTdGF0ZShmYWxzZSk7XHJcbiAgICBjb25zdCBbbW9kZSwgc2V0TW9kZV0gPSB1c2VTdGF0ZSgnY3JlYXRlJyk7XHJcbiAgICBjb25zdCBbbWVzc2FnZSwgc2V0TWVzc2FnZV0gPSB1c2VTdGF0ZSh7IHR5cGU6ICcnLCB0ZXh0OiAnJyB9KTtcclxuICAgIGNvbnN0IFtzdWNjZXNzVmlzaWJsZSwgc2V0U3VjY2Vzc1Zpc2libGVdID0gdXNlU3RhdGUoZmFsc2UpO1xyXG4gICAgY29uc3QgcmVkaXJlY3RUaW1lciA9IHVzZVJlZihudWxsKTtcclxuICAgIGNvbnN0IFtmb3JtLCBzZXRGb3JtXSA9IHVzZVN0YXRlKHtcclxuICAgICAgICBmdWxsTmFtZTogJycsXHJcbiAgICAgICAgZW1haWw6ICcnLFxyXG4gICAgICAgIHBob25lOiAnJyxcclxuICAgICAgICBhZGRyZXNzOiAnJyxcclxuICAgICAgICBjaXR5OiAnJyxcclxuICAgICAgICBzdGF0ZTogJycsXHJcbiAgICAgICAgemlwQ29kZTogJycsXHJcbiAgICAgICAgcHJlZmVycmVkU2l6ZTogJycsXHJcbiAgICAgICAgc3R5bGVOb3RlczogJydcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IFthZGRyZXNzZXMsIHNldEFkZHJlc3Nlc10gPSB1c2VTdGF0ZShbXSk7XHJcbiAgICBjb25zdCBbYWRkcmVzc0Zvcm0sIHNldEFkZHJlc3NGb3JtXSA9IHVzZVN0YXRlKHsgaWQ6IDAsIGZ1bGxOYW1lOiAnJywgcGhvbmU6ICcnLCBhZGRyZXNzTGluZTogJycsIGNpdHk6ICcnLCBzdGF0ZTogJycsIHppcENvZGU6ICcnIH0pO1xyXG4gICAgY29uc3QgW3Nob3dBZGRyZXNzRm9ybSwgc2V0U2hvd0FkZHJlc3NGb3JtXSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuICAgIGNvbnN0IFthZGRyZXNzTWVzc2FnZSwgc2V0QWRkcmVzc01lc3NhZ2VdID0gdXNlU3RhdGUoJycpO1xyXG4gICAgXHJcbiAgICAvLyBOZXcgc3RhdGVzIGZvciBjbGllbnQgdGFiYmVkIGRhc2hib2FyZFxyXG4gICAgY29uc3QgW29yZGVycywgc2V0T3JkZXJzXSA9IHVzZVN0YXRlKFtdKTtcclxuICAgIGNvbnN0IFtjb3Vwb25zLCBzZXRDb3Vwb25zXSA9IHVzZVN0YXRlKFtdKTtcclxuICAgIGNvbnN0IFthY3RpdmVUYWIsIHNldEFjdGl2ZVRhYl0gPSB1c2VTdGF0ZSgncHJvZmlsZScpO1xyXG4gICAgY29uc3QgW2lzRWRpdGluZywgc2V0SXNFZGl0aW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuXHJcbiAgICBjb25zdCB2YWxpZGF0ZVByb2ZpbGVGb3JtID0gKGNsZWFuZWQpID0+IHtcclxuICAgICAgICBpZiAoIWNsZWFuZWQuZnVsbE5hbWUgfHwgIWNsZWFuZWQucGhvbmUgfHwgIWNsZWFuZWQuYWRkcmVzcyB8fCAhY2xlYW5lZC5jaXR5IHx8ICFjbGVhbmVkLnN0YXRlIHx8ICFjbGVhbmVkLnppcENvZGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuICdQbGVhc2UgY29tcGxldGUgdGhlIHJlcXVpcmVkIGZpZWxkcy4nO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIS9eW0EtWmEtel1bQS1aYS16XFxzLictXXsxLDc5fSQvLnRlc3QoY2xlYW5lZC5mdWxsTmFtZSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBmdWxsIG5hbWUuJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCEvXlxcKz9bMC05KClcXC1cXHNdezgsMTV9JC8udGVzdChjbGVhbmVkLnBob25lKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gJ1BsZWFzZSBlbnRlciBhIHZhbGlkIHBob25lIG51bWJlci4nO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY2xlYW5lZC5hZGRyZXNzLmxlbmd0aCA8IDUpIHtcclxuICAgICAgICAgICAgcmV0dXJuICdQbGVhc2UgZW50ZXIgYSBjb21wbGV0ZSBhZGRyZXNzLic7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjbGVhbmVkLmNpdHkubGVuZ3RoIDwgMiB8fCBjbGVhbmVkLnN0YXRlLmxlbmd0aCA8IDIpIHtcclxuICAgICAgICAgICAgcmV0dXJuICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBjaXR5IGFuZCBzdGF0ZS4nO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIS9eW0EtWmEtejAtOVxcLVxcc117MywxMn0kLy50ZXN0KGNsZWFuZWQuemlwQ29kZSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBaSVAgb3IgcG9zdGFsIGNvZGUuJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGNsZWFuZWQuc3R5bGVOb3Rlcy5sZW5ndGggPiA1MDApIHtcclxuICAgICAgICAgICAgcmV0dXJuICdTdHlsZSBub3RlcyBtdXN0IGJlIDUwMCBjaGFyYWN0ZXJzIG9yIGZld2VyLic7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAnJztcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgbG9hZEFkZHJlc3NlcyA9IGFzeW5jICgpID0+IHtcclxuICAgICAgICBpZiAoIWF1dGhVc2VyKSByZXR1cm47XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IGFwaUNsaWVudC5nZXQoJy9hcGkvcHJvZmlsZS9hZGRyZXNzZXMnKTtcclxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkpIHtcclxuICAgICAgICAgICAgICAgIHNldEFkZHJlc3NlcyhkYXRhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiW1Byb2ZpbGVQYWdlXSBsb2FkQWRkcmVzc2VzIGVycm9yOlwiLCBlcnIpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgbG9hZE9yZGVyc0FuZENvdXBvbnMgPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgaWYgKCFhdXRoVXNlcikgcmV0dXJuO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBhcGlDbGllbnQuZ2V0KCcvYXBpL3Byb2ZpbGUvb3JkZXJzJyk7XHJcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGRhdGEpKSB7XHJcbiAgICAgICAgICAgICAgICBzZXRPcmRlcnMoZGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IGNEYXRhID0gYXdhaXQgYXBpQ2xpZW50LmdldCgnL2FwaS9wcm9maWxlL2NvdXBvbnMnKTtcclxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoY0RhdGEpKSB7XHJcbiAgICAgICAgICAgICAgICBzZXRDb3Vwb25zKGNEYXRhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiW1Byb2ZpbGVQYWdlXSBsb2FkT3JkZXJzQW5kQ291cG9ucyBlcnJvcjpcIiwgZXJyKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IGhhbmRsZUFkZHJlc3NTdWJtaXQgPSBhc3luYyAoZSkgPT4ge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBzZXRBZGRyZXNzTWVzc2FnZSgnJyk7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHtBUElfQkFTRV9VUkx9L2FwaS9wcm9maWxlL2FkZHJlc3Nlc2AsIHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXHJcbiAgICAgICAgICAgICAgICAgICAgJ1gtVXNlci1JZCc6IGF1dGhVc2VyLnVpZFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGFkZHJlc3NGb3JtKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGV4dCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcih0ZXh0IHx8ICdGYWlsZWQgdG8gc2F2ZSBhZGRyZXNzJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2V0QWRkcmVzc0Zvcm0oeyBpZDogMCwgZnVsbE5hbWU6ICcnLCBwaG9uZTogJycsIGFkZHJlc3NMaW5lOiAnJywgY2l0eTogJycsIHN0YXRlOiAnJywgemlwQ29kZTogJycgfSk7XHJcbiAgICAgICAgICAgIHNldFNob3dBZGRyZXNzRm9ybShmYWxzZSk7XHJcbiAgICAgICAgICAgIGxvYWRBZGRyZXNzZXMoKTtcclxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgc2V0QWRkcmVzc01lc3NhZ2UoZXJyLm1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgaGFuZGxlRGVsZXRlQWRkcmVzcyA9IGFzeW5jIChpZCkgPT4ge1xyXG4gICAgICAgIGlmICghY29uZmlybSgnQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSB0aGlzIGFkZHJlc3M/JykpIHJldHVybjtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke0FQSV9CQVNFX1VSTH0vYXBpL3Byb2ZpbGUvYWRkcmVzc2VzP2lkPSR7aWR9YCwge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnREVMRVRFJyxcclxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsgJ1gtVXNlci1JZCc6IGF1dGhVc2VyLnVpZCB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uub2spIHtcclxuICAgICAgICAgICAgICAgIGxvYWRBZGRyZXNzZXMoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBoYW5kbGVTZXREZWZhdWx0QWRkcmVzcyA9IGFzeW5jIChpZCkgPT4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7QVBJX0JBU0VfVVJMfS9hcGkvcHJvZmlsZS9hZGRyZXNzZXM/aWQ9JHtpZH1gLCB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQQVRDSCcsXHJcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7ICdYLVVzZXItSWQnOiBhdXRoVXNlci51aWQgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLm9rKSB7XHJcbiAgICAgICAgICAgICAgICBsb2FkQWRkcmVzc2VzKCk7XHJcbiAgICAgICAgICAgICAgICAvLyBBbHNvIHJlbG9hZCBwcm9maWxlIGRldGFpbHMgc2luY2UgcHJpbWFyeSBwcm9maWxlIGFkZHJlc3MgaXMgYmlkaXJlY3Rpb25hbGx5IHN5bmNlZFxyXG4gICAgICAgICAgICAgICAgY29uc3QgcHJvZmlsZVJlcyA9IGF3YWl0IGZldGNoKGAke0FQSV9CQVNFX1VSTH0vYXBpL3Byb2ZpbGUvbWVgLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczogeyAnWC1Vc2VyLUlkJzogYXV0aFVzZXIudWlkIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKHByb2ZpbGVSZXMub2spIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwcm9maWxlID0gYXdhaXQgcHJvZmlsZVJlcy5qc29uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0Rm9ybSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGxOYW1lOiBwcm9maWxlLmZ1bGxOYW1lIHx8ICcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbWFpbDogcHJvZmlsZS5lbWFpbCB8fCBhdXRoVXNlci5lbWFpbCB8fCAnJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGhvbmU6IHByb2ZpbGUucGhvbmUgfHwgJycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZHJlc3M6IHByb2ZpbGUuYWRkcmVzcyB8fCAnJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2l0eTogcHJvZmlsZS5jaXR5IHx8ICcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZTogcHJvZmlsZS5zdGF0ZSB8fCAnJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgemlwQ29kZTogcHJvZmlsZS56aXBDb2RlIHx8ICcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVmZXJyZWRTaXplOiBwcm9maWxlLnByZWZlcnJlZFNpemUgfHwgJycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlTm90ZXM6IHByb2ZpbGUuc3R5bGVOb3RlcyB8fCAnJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICAgICAgaWYgKCFhdXRoVXNlcikgcmV0dXJuO1xyXG5cclxuICAgICAgICBjb25zdCBsb2FkUHJvZmlsZSA9IGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7QVBJX0JBU0VfVVJMfS9hcGkvcHJvZmlsZS9tZWAsIHtcclxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7ICdYLVVzZXItSWQnOiBhdXRoVXNlci51aWQgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MDQpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRNb2RlKCdjcmVhdGUnKTtcclxuICAgICAgICAgICAgICAgICAgICBzZXRGb3JtKGYgPT4gKHsgLi4uZiwgZW1haWw6IGF1dGhVc2VyLmVtYWlsIHx8ICcnIH0pKTtcclxuICAgICAgICAgICAgICAgICAgICBzZXRJc0VkaXRpbmcodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIGxvYWQgcHJvZmlsZScpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29uc3QgcHJvZmlsZSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgICAgICAgICAgIHNldEZvcm0oe1xyXG4gICAgICAgICAgICAgICAgICAgIGZ1bGxOYW1lOiBwcm9maWxlLmZ1bGxOYW1lIHx8ICcnLFxyXG4gICAgICAgICAgICAgICAgICAgIGVtYWlsOiBwcm9maWxlLmVtYWlsIHx8IGF1dGhVc2VyLmVtYWlsIHx8ICcnLFxyXG4gICAgICAgICAgICAgICAgICAgIHBob25lOiBwcm9maWxlLnBob25lIHx8ICcnLFxyXG4gICAgICAgICAgICAgICAgICAgIGFkZHJlc3M6IHByb2ZpbGUuYWRkcmVzcyB8fCAnJyxcclxuICAgICAgICAgICAgICAgICAgICBjaXR5OiBwcm9maWxlLmNpdHkgfHwgJycsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGU6IHByb2ZpbGUuc3RhdGUgfHwgJycsXHJcbiAgICAgICAgICAgICAgICAgICAgemlwQ29kZTogcHJvZmlsZS56aXBDb2RlIHx8ICcnLFxyXG4gICAgICAgICAgICAgICAgICAgIHByZWZlcnJlZFNpemU6IHByb2ZpbGUucHJlZmVycmVkU2l6ZSB8fCAnJyxcclxuICAgICAgICAgICAgICAgICAgICBzdHlsZU5vdGVzOiBwcm9maWxlLnN0eWxlTm90ZXMgfHwgJydcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgc2V0TW9kZSgnZWRpdCcpO1xyXG4gICAgICAgICAgICAgICAgc2V0SXNFZGl0aW5nKGZhbHNlKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIHNldE1lc3NhZ2UoeyB0eXBlOiAnZXJyb3InLCB0ZXh0OiAnV2UgY291bGQgbm90IGxvYWQgeW91ciBwcm9maWxlIHJpZ2h0IG5vdy4nIH0pO1xyXG4gICAgICAgICAgICB9IGZpbmFsbHkge1xyXG4gICAgICAgICAgICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBsb2FkUHJvZmlsZSgpO1xyXG4gICAgICAgIGxvYWRBZGRyZXNzZXMoKTtcclxuICAgICAgICBsb2FkT3JkZXJzQW5kQ291cG9ucygpO1xyXG4gICAgfSwgW2F1dGhVc2VyXSk7XHJcblxyXG4gICAgdXNlRWZmZWN0KCgpID0+ICgpID0+IHtcclxuICAgICAgICBpZiAocmVkaXJlY3RUaW1lci5jdXJyZW50KSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQocmVkaXJlY3RUaW1lci5jdXJyZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9LCBbXSk7XHJcblxyXG4gICAgY29uc3QgaGFuZGxlU3VibWl0ID0gYXN5bmMgKGUpID0+IHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgaWYgKCFhdXRoVXNlciB8fCBzYXZpbmcpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgY2xlYW5lZCA9IHtcclxuICAgICAgICAgICAgZnVsbE5hbWU6IGZvcm0uZnVsbE5hbWUudHJpbSgpLFxyXG4gICAgICAgICAgICBlbWFpbDogZm9ybS5lbWFpbCB8fCBhdXRoVXNlci5lbWFpbCB8fCAnJyxcclxuICAgICAgICAgICAgcGhvbmU6IGZvcm0ucGhvbmUudHJpbSgpLFxyXG4gICAgICAgICAgICBhZGRyZXNzOiBmb3JtLmFkZHJlc3MudHJpbSgpLFxyXG4gICAgICAgICAgICBjaXR5OiBmb3JtLmNpdHkudHJpbSgpLFxyXG4gICAgICAgICAgICBzdGF0ZTogZm9ybS5zdGF0ZS50cmltKCksXHJcbiAgICAgICAgICAgIHppcENvZGU6IGZvcm0uemlwQ29kZS50cmltKCksXHJcbiAgICAgICAgICAgIHByZWZlcnJlZFNpemU6IGZvcm0ucHJlZmVycmVkU2l6ZS50cmltKCksXHJcbiAgICAgICAgICAgIHN0eWxlTm90ZXM6IGZvcm0uc3R5bGVOb3Rlcy50cmltKClcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCB2YWxpZGF0aW9uRXJyb3IgPSB2YWxpZGF0ZVByb2ZpbGVGb3JtKGNsZWFuZWQpO1xyXG4gICAgICAgIGlmICh2YWxpZGF0aW9uRXJyb3IpIHtcclxuICAgICAgICAgICAgc2V0TWVzc2FnZSh7IHR5cGU6ICdlcnJvcicsIHRleHQ6IHZhbGlkYXRpb25FcnJvciB9KTtcclxuICAgICAgICAgICAgc2V0U3VjY2Vzc1Zpc2libGUoZmFsc2UpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXRTYXZpbmcodHJ1ZSk7XHJcbiAgICAgICAgc2V0U3VjY2Vzc1Zpc2libGUoZmFsc2UpO1xyXG4gICAgICAgIHNldE1lc3NhZ2UoeyB0eXBlOiAnJywgdGV4dDogJycgfSk7XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7QVBJX0JBU0VfVVJMfS9hcGkvcHJvZmlsZS9tZWAsIHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogbW9kZSA9PT0gJ2NyZWF0ZScgPyAnUE9TVCcgOiAnUEFUQ0gnLFxyXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXHJcbiAgICAgICAgICAgICAgICAgICAgJ1gtVXNlci1JZCc6IGF1dGhVc2VyLnVpZFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGNsZWFuZWQpXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGV4dCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcih0ZXh0IHx8ICdVbmFibGUgdG8gc2F2ZSBwcm9maWxlJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHByb2ZpbGUgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgICAgICAgIHNldEZvcm0oe1xyXG4gICAgICAgICAgICAgICAgZnVsbE5hbWU6IHByb2ZpbGUuZnVsbE5hbWUgfHwgJycsXHJcbiAgICAgICAgICAgICAgICBlbWFpbDogcHJvZmlsZS5lbWFpbCB8fCBhdXRoVXNlci5lbWFpbCB8fCAnJyxcclxuICAgICAgICAgICAgICAgIHBob25lOiBwcm9maWxlLnBob25lIHx8ICcnLFxyXG4gICAgICAgICAgICAgICAgYWRkcmVzczogcHJvZmlsZS5hZGRyZXNzIHx8ICcnLFxyXG4gICAgICAgICAgICAgICAgY2l0eTogcHJvZmlsZS5jaXR5IHx8ICcnLFxyXG4gICAgICAgICAgICAgICAgc3RhdGU6IHByb2ZpbGUuc3RhdGUgfHwgJycsXHJcbiAgICAgICAgICAgICAgICB6aXBDb2RlOiBwcm9maWxlLnppcENvZGUgfHwgJycsXHJcbiAgICAgICAgICAgICAgICBwcmVmZXJyZWRTaXplOiBwcm9maWxlLnByZWZlcnJlZFNpemUgfHwgJycsXHJcbiAgICAgICAgICAgICAgICBzdHlsZU5vdGVzOiBwcm9maWxlLnN0eWxlTm90ZXMgfHwgJydcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHNldE1vZGUoJ2VkaXQnKTtcclxuICAgICAgICAgICAgc2V0SXNFZGl0aW5nKGZhbHNlKTtcclxuICAgICAgICAgICAgc2V0U3VjY2Vzc1Zpc2libGUodHJ1ZSk7XHJcbiAgICAgICAgICAgIGxvYWRBZGRyZXNzZXMoKTtcclxuICAgICAgICAgICAgcmVkaXJlY3RUaW1lci5jdXJyZW50ID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgc2V0U3VjY2Vzc1Zpc2libGUoZmFsc2UpO1xyXG4gICAgICAgICAgICB9LCAzMDAwKTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBzZXRTdWNjZXNzVmlzaWJsZShmYWxzZSk7XHJcbiAgICAgICAgICAgIHNldE1lc3NhZ2UoeyB0eXBlOiAnZXJyb3InLCB0ZXh0OiBlcnJvci5tZXNzYWdlIHx8ICdQcm9maWxlIGNvdWxkIG5vdCBiZSBzYXZlZC4nIH0pO1xyXG4gICAgICAgIH0gZmluYWxseSB7XHJcbiAgICAgICAgICAgIHNldFNhdmluZyhmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBpZiAoIWF1dGhVc2VyKSB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwcm9maWxlLXNoZWxsXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInByb2ZpbGUtY2FyZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInByb2ZpbGUtZXllYnJvd1wiPkFjY291bnQ8L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgPGgxPlBsZWFzZSBzaWduIGluIHRvIHZpZXcgeW91ciBwcm9maWxlPC9oMT5cclxuICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJwcm9maWxlLWhlbHBcIj5Vc2UgdGhlIFNpZ24gSW4gYnV0dG9uIGluIHRoZSBoZWFkZXIgdG8gY29udGludWUuPC9wPlxyXG4gICAgICAgICAgICAgICAgICAgIDxMaW5rIHRvPVwiL2F1dGhcIiBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnlcIiBzdHlsZT17e2Rpc3BsYXk6J2lubGluZS1ibG9jaycsIG1hcmdpblRvcDonMS41cmVtJ319PkdvIHRvIFNpZ24gSW48L0xpbms+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAobG9hZGluZykge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgbWF4V2lkdGg6ICcxMTAwcHgnLCBtYXJnaW46ICcyLjVyZW0gYXV0byAzcmVtJywgcGFkZGluZzogJzAgMS4yNXJlbScsIG1pbkhlaWdodDogJzc1dmgnIH19PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLCBnYXA6ICcxLjVyZW0nIH19PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2tlbGV0b24tYm94XCIgc3R5bGU9e3sgaGVpZ2h0OiAnNDJweCcsIHdpZHRoOiAnMjIwcHgnLCBib3JkZXJSYWRpdXM6ICc4cHgnIH19IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZ3JpZCcsIGdyaWRUZW1wbGF0ZUNvbHVtbnM6ICdyZXBlYXQoYXV0by1maXQsIG1pbm1heCgyODBweCwgMWZyKSknLCBnYXA6ICcxLjVyZW0nIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNrZWxldG9uLWJveFwiIHN0eWxlPXt7IGhlaWdodDogJzI0MHB4JywgYm9yZGVyUmFkaXVzOiAnMTZweCcgfX0gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJza2VsZXRvbi1ib3hcIiBzdHlsZT17eyBoZWlnaHQ6ICcyNDBweCcsIGJvcmRlclJhZGl1czogJzE2cHgnIH19IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2tlbGV0b24tYm94XCIgc3R5bGU9e3sgaGVpZ2h0OiAnMjQwcHgnLCBib3JkZXJSYWRpdXM6ICcxNnB4JyB9fSAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2IHN0eWxlPXt7XHJcbiAgICAgICAgICAgIG1heFdpZHRoOiAnMTEwMHB4JyxcclxuICAgICAgICAgICAgbWFyZ2luOiAnMi41cmVtIGF1dG8gM3JlbScsXHJcbiAgICAgICAgICAgIHBhZGRpbmc6ICcwIDEuMjVyZW0nLFxyXG4gICAgICAgICAgICBtaW5IZWlnaHQ6ICc3NXZoJyxcclxuICAgICAgICAgICAgZm9udEZhbWlseTogJ3ZhcigtLWZvbnQtYm9keSknXHJcbiAgICAgICAgfX0+XHJcbiAgICAgICAgICAgIHsvKiBIZWFkZXIgU2VjdGlvbiAqL31cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgICAgICBnYXA6ICcxLjI1cmVtJyxcclxuICAgICAgICAgICAgICAgIG1hcmdpbkJvdHRvbTogJzEuMjVyZW0nLFxyXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZDogJyNmZmYnLFxyXG4gICAgICAgICAgICAgICAgcGFkZGluZzogJzEuMjVyZW0gMS41cmVtJyxcclxuICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzEycHgnLFxyXG4gICAgICAgICAgICAgICAgYm94U2hhZG93OiAnMCA0cHggMTVweCByZ2JhKDAsMCwwLDAuMDMpJyxcclxuICAgICAgICAgICAgICAgIGJvcmRlcjogJzFweCBzb2xpZCByZ2JhKDAsMCwwLDAuMDQpJ1xyXG4gICAgICAgICAgICB9fT5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzUycHgnLFxyXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogJzUycHgnLFxyXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzUwcHgnLFxyXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6ICdsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAjZTRiMzliLCAjYjk3YTY2KScsXHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjZmZmJyxcclxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICAgICAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxyXG4gICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAnMS40cmVtJyxcclxuICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiAnYm9sZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgYm94U2hhZG93OiAnMCA0cHggMTBweCByZ2JhKDE4NSwgMTIyLCAxMDIsIDAuMjUpJ1xyXG4gICAgICAgICAgICAgICAgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAge2Zvcm0uZnVsbE5hbWUgPyBmb3JtLmZ1bGxOYW1lLnRyaW0oKS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSA6ICdVJ31cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgICA8aDEgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6ICcxLjRyZW0nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiAndmFyKC0tZm9udC10aXRsZSknLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW46IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzMzMydcclxuICAgICAgICAgICAgICAgICAgICB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAge2Zvcm0uZnVsbE5hbWUgfHwgJ1dlbGNvbWUgdG8gVGhlIEV0aG5pYyBUb3VjaCd9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9oMT5cclxuICAgICAgICAgICAgICAgICAgICA8cCBzdHlsZT17eyBtYXJnaW46ICcwLjE1cmVtIDAgMCcsIGNvbG9yOiAnIzY2NicsIGZvbnRTaXplOiAnMC44NXJlbScgfX0+e2F1dGhVc2VyLmVtYWlsfTwvcD5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIHsvKiBNYWluIENvbnRlbnQgTGF5b3V0ICovfVxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiAnZ3JpZCcsXHJcbiAgICAgICAgICAgICAgICBncmlkVGVtcGxhdGVDb2x1bW5zOiAnMjIwcHggMWZyJyxcclxuICAgICAgICAgICAgICAgIGdhcDogJzEuMjVyZW0nXHJcbiAgICAgICAgICAgIH19IGNsYXNzTmFtZT1cInByb2ZpbGUtZGFzaGJvYXJkLWdyaWRcIj5cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgey8qIFNpZGVtZW51IFBhbmVsICovfVxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6ICcjZmZmJyxcclxuICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAnMXJlbScsXHJcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnMTJweCcsXHJcbiAgICAgICAgICAgICAgICAgICAgYm94U2hhZG93OiAnMCA0cHggMTVweCByZ2JhKDAsMCwwLDAuMDMpJyxcclxuICAgICAgICAgICAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgcmdiYSgwLDAsMCwwLjA0KScsXHJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAnZml0LWNvbnRlbnQnXHJcbiAgICAgICAgICAgICAgICB9fT5cclxuICAgICAgICAgICAgICAgICAgICA8dWwgc3R5bGU9e3sgbGlzdFN0eWxlOiAnbm9uZScsIHBhZGRpbmc6IDAsIG1hcmdpbjogMCB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4geyBzZXRBY3RpdmVUYWIoJ3Byb2ZpbGUnKTsgc2V0U3VjY2Vzc1Zpc2libGUoZmFsc2UpOyBzZXRNZXNzYWdlKHsgdHlwZTogJycsIHRleHQ6ICcnIH0pOyB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAnMC42NXJlbSAwLjlyZW0nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzhweCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6ICcwLjg4cmVtJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiBhY3RpdmVUYWIgPT09ICdwcm9maWxlJyA/ICc2MDAnIDogJ25vcm1hbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBhY3RpdmVUYWIgPT09ICdwcm9maWxlJyA/ICcjZmZmMGU5JyA6ICd0cmFuc3BhcmVudCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IGFjdGl2ZVRhYiA9PT0gJ3Byb2ZpbGUnID8gJyNiOTdhNjYnIDogJyM1NTUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb246ICdhbGwgMC4ycycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOiAnMC4zNXJlbScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdhcDogJzAuNnJlbSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE15IFByb2ZpbGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4geyBzZXRBY3RpdmVUYWIoJ2FkZHJlc3NlcycpOyBzZXRTdWNjZXNzVmlzaWJsZShmYWxzZSk7IHNldE1lc3NhZ2UoeyB0eXBlOiAnJywgdGV4dDogJycgfSk7IH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6ICcwLjY1cmVtIDAuOXJlbScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnOHB4JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJzb3I6ICdwb2ludGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogJzAuODhyZW0nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IGFjdGl2ZVRhYiA9PT0gJ2FkZHJlc3NlcycgPyAnNjAwJyA6ICdub3JtYWwnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogYWN0aXZlVGFiID09PSAnYWRkcmVzc2VzJyA/ICcjZmZmMGU5JyA6ICd0cmFuc3BhcmVudCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IGFjdGl2ZVRhYiA9PT0gJ2FkZHJlc3NlcycgPyAnI2I5N2E2NicgOiAnIzU1NScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogJ2FsbCAwLjJzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW5Cb3R0b206ICcwLjM1cmVtJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2FwOiAnMC42cmVtJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgU2hpcHBpbmcgQWRkcmVzc2VzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHsgc2V0QWN0aXZlVGFiKCdvcmRlcnMnKTsgc2V0U3VjY2Vzc1Zpc2libGUoZmFsc2UpOyBzZXRNZXNzYWdlKHsgdHlwZTogJycsIHRleHQ6ICcnIH0pOyB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAnMC42NXJlbSAwLjlyZW0nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzhweCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6ICcwLjg4cmVtJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiBhY3RpdmVUYWIgPT09ICdvcmRlcnMnID8gJzYwMCcgOiAnbm9ybWFsJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGFjdGl2ZVRhYiA9PT0gJ29yZGVycycgPyAnI2ZmZjBlOScgOiAndHJhbnNwYXJlbnQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBhY3RpdmVUYWIgPT09ICdvcmRlcnMnID8gJyNiOTdhNjYnIDogJyM1NTUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb246ICdhbGwgMC4ycycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOiAnMC4zNXJlbScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdhcDogJzAuNnJlbSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9yZGVyIEhpc3RvcnlcclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4geyBzZXRBY3RpdmVUYWIoJ2NvdXBvbnMnKTsgc2V0U3VjY2Vzc1Zpc2libGUoZmFsc2UpOyBzZXRNZXNzYWdlKHsgdHlwZTogJycsIHRleHQ6ICcnIH0pOyB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAnMC42NXJlbSAwLjlyZW0nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzhweCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6ICcwLjg4cmVtJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiBhY3RpdmVUYWIgPT09ICdjb3Vwb25zJyA/ICc2MDAnIDogJ25vcm1hbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBhY3RpdmVUYWIgPT09ICdjb3Vwb25zJyA/ICcjZmZmMGU5JyA6ICd0cmFuc3BhcmVudCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IGFjdGl2ZVRhYiA9PT0gJ2NvdXBvbnMnID8gJyNiOTdhNjYnIDogJyM1NTUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb246ICdhbGwgMC4ycycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdhcDogJzAuNnJlbSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE15IENvdXBvbnNcclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhdXRoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpZ25PdXQoYXV0aCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9IFwiIy9cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogJzAuNjVyZW0gMC45cmVtJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICc4cHgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAnMC44OHJlbScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogJzUwMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAndHJhbnNwYXJlbnQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnI2QzMmYyZicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogJ2FsbCAwLjJzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW5Ub3A6ICcwLjc1cmVtJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXJUb3A6ICcxcHggc29saWQgI2Y1ZjVmNScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdhcDogJzAuNnJlbSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbk1vdXNlRW50ZXI9e2UgPT4geyBlLnRhcmdldC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnI2ZkZjJmMic7IH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbk1vdXNlTGVhdmU9e2UgPT4geyBlLnRhcmdldC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAndHJhbnNwYXJlbnQnOyB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBTaWduIE91dFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICB7LyogQ29udGVudCBQYW5lbCAqL31cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiAnI2ZmZicsXHJcbiAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogJzEuNXJlbScsXHJcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnMTJweCcsXHJcbiAgICAgICAgICAgICAgICAgICAgYm94U2hhZG93OiAnMCA0cHggMTVweCByZ2JhKDAsMCwwLDAuMDMpJyxcclxuICAgICAgICAgICAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgcmdiYSgwLDAsMCwwLjA0KScsXHJcbiAgICAgICAgICAgICAgICAgICAgbWluSGVpZ2h0OiAnMzgwcHgnXHJcbiAgICAgICAgICAgICAgICB9fT5cclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICB7LyogVEFCOiBQUk9GSUxFICovfVxyXG4gICAgICAgICAgICAgICAgICAgIHthY3RpdmVUYWIgPT09ICdwcm9maWxlJyAmJiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJywgYWxpZ25JdGVtczogJ2NlbnRlcicsIG1hcmdpbkJvdHRvbTogJzJyZW0nLCBib3JkZXJCb3R0b206ICcxcHggc29saWQgI2YwZjBmMCcsIHBhZGRpbmdCb3R0b206ICcxcmVtJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDIgc3R5bGU9e3sgZm9udEZhbWlseTogJ3ZhcigtLWZvbnQtdGl0bGUpJywgbWFyZ2luOiAwLCBmb250U2l6ZTogJzEuNHJlbScsIGNvbG9yOiAnIzMzMycgfX0+QWNjb3VudCBQcm9maWxlPC9oMj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7bW9kZSA9PT0gJ2VkaXQnICYmIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0SXNFZGl0aW5nKCFpc0VkaXRpbmcpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkICNiOTdhNjYnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnI2I5N2E2NicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBpc0VkaXRpbmcgPyAnI2ZmZjBlOScgOiAndHJhbnNwYXJlbnQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6ICcwLjVyZW0gMS4ycmVtJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICc2cHgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAnMC45cmVtJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiAnNTAwJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJzb3I6ICdwb2ludGVyJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2lzRWRpdGluZyA/ICdDYW5jZWwgRWRpdCcgOiAnRWRpdCBQcm9maWxlJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHttZXNzYWdlLnRleHQgJiYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogJzFyZW0nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICc2cHgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IG1lc3NhZ2UudHlwZSA9PT0gJ2Vycm9yJyA/ICcjZmRlOGU4JyA6ICcjZWFmYWYxJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IG1lc3NhZ2UudHlwZSA9PT0gJ2Vycm9yJyA/ICcjOWIxYzFjJyA6ICcjMGU2MjQ1JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOiAnMS41cmVtJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6ICcwLjlyZW0nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHttZXNzYWdlLnRleHR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzdWNjZXNzVmlzaWJsZSAmJiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAnMnJlbSAxcmVtJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogJyNmNGZiZjcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgI2M4ZTZjOScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzhweCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbkJvdHRvbTogJzEuNXJlbSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFNpemU6ICczcmVtJywgY29sb3I6ICcjMmU3ZDMyJyB9fT7inJM8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoNCBzdHlsZT17eyBtYXJnaW46ICcwLjVyZW0gMCAwLjJyZW0nLCBjb2xvcjogJyMyZTdkMzInIH19PlByb2ZpbGUgVXBkYXRlZCBTdWNjZXNzZnVsbHkhPC9oND5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHAgc3R5bGU9e3sgbWFyZ2luOiAwLCBmb250U2l6ZTogJzAuODVyZW0nLCBjb2xvcjogJyM2NjYnIH19PllvdXIgcHJvZmlsZSBoYXMgYmVlbiBzYXZlZC48L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsoIWlzRWRpdGluZyAmJiBtb2RlID09PSAnZWRpdCcpID8gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2dyaWQnLCBncmlkVGVtcGxhdGVDb2x1bW5zOiAnMWZyIDFmcicsIGdhcDogJzJyZW0nIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXt7IGZvbnRTaXplOiAnMC44NXJlbScsIGNvbG9yOiAnIzg4OCcsIGRpc3BsYXk6ICdibG9jaycsIG1hcmdpbkJvdHRvbTogJzAuMnJlbScgfX0+RnVsbCBOYW1lPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPXt7IGZvbnRTaXplOiAnMS4wNXJlbScsIGNvbG9yOiAnIzMzMycsIGZvbnRXZWlnaHQ6ICc1MDAnLCBtYXJnaW46IDAgfX0+e2Zvcm0uZnVsbE5hbWUgfHwgJy0nfTwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e3sgZm9udFNpemU6ICcwLjg1cmVtJywgY29sb3I6ICcjODg4JywgZGlzcGxheTogJ2Jsb2NrJywgbWFyZ2luQm90dG9tOiAnMC4ycmVtJyB9fT5FbWFpbCBBZGRyZXNzPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPXt7IGZvbnRTaXplOiAnMS4wNXJlbScsIGNvbG9yOiAnIzMzMycsIGZvbnRXZWlnaHQ6ICc1MDAnLCBtYXJnaW46IDAgfX0+e2Zvcm0uZW1haWwgfHwgJy0nfTwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e3sgZm9udFNpemU6ICcwLjg1cmVtJywgY29sb3I6ICcjODg4JywgZGlzcGxheTogJ2Jsb2NrJywgbWFyZ2luQm90dG9tOiAnMC4ycmVtJyB9fT5QaG9uZSBOdW1iZXI8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHAgc3R5bGU9e3sgZm9udFNpemU6ICcxLjA1cmVtJywgY29sb3I6ICcjMzMzJywgZm9udFdlaWdodDogJzUwMCcsIG1hcmdpbjogMCB9fT57Zm9ybS5waG9uZSB8fCAnLSd9PC9wPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17eyBmb250U2l6ZTogJzAuODVyZW0nLCBjb2xvcjogJyM4ODgnLCBkaXNwbGF5OiAnYmxvY2snLCBtYXJnaW5Cb3R0b206ICcwLjJyZW0nIH19PlpJUCAvIFBvc3RhbCBDb2RlPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPXt7IGZvbnRTaXplOiAnMS4wNXJlbScsIGNvbG9yOiAnIzMzMycsIGZvbnRXZWlnaHQ6ICc1MDAnLCBtYXJnaW46IDAgfX0+e2Zvcm0uemlwQ29kZSB8fCAnLSd9PC9wPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBncmlkQ29sdW1uOiAnc3BhbiAyJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17eyBmb250U2l6ZTogJzAuODVyZW0nLCBjb2xvcjogJyM4ODgnLCBkaXNwbGF5OiAnYmxvY2snLCBtYXJnaW5Cb3R0b206ICcwLjJyZW0nIH19PlByaW1hcnkgU2hpcHBpbmcgQWRkcmVzczwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBzdHlsZT17eyBmb250U2l6ZTogJzEuMDVyZW0nLCBjb2xvcjogJyMzMzMnLCBmb250V2VpZ2h0OiAnNTAwJywgbWFyZ2luOiAwIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtmb3JtLmFkZHJlc3MgPyBgJHtmb3JtLmFkZHJlc3N9LCAke2Zvcm0uY2l0eX0sICR7Zm9ybS5zdGF0ZX0gLSAke2Zvcm0uemlwQ29kZX1gIDogJy0nfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17eyBmb250U2l6ZTogJzAuODVyZW0nLCBjb2xvcjogJyM4ODgnLCBkaXNwbGF5OiAnYmxvY2snLCBtYXJnaW5Cb3R0b206ICcwLjJyZW0nIH19PlByZWZlcnJlZCBTaXplPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPXt7IGZvbnRTaXplOiAnMS4wNXJlbScsIGNvbG9yOiAnIzMzMycsIGZvbnRXZWlnaHQ6ICc1MDAnLCBtYXJnaW46IDAgfX0+e2Zvcm0ucHJlZmVycmVkU2l6ZSB8fCAnTm90IHNldCd9PC9wPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBncmlkQ29sdW1uOiAnc3BhbiAyJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17eyBmb250U2l6ZTogJzAuODVyZW0nLCBjb2xvcjogJyM4ODgnLCBkaXNwbGF5OiAnYmxvY2snLCBtYXJnaW5Cb3R0b206ICcwLjJyZW0nIH19PlN0eWxlIFByZWZlcmVuY2VzICYgTm90ZXM8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHAgc3R5bGU9e3sgZm9udFNpemU6ICcxLjA1cmVtJywgY29sb3I6ICcjMzMzJywgbWFyZ2luOiAwLCB3aGl0ZVNwYWNlOiAncHJlLXdyYXAnLCBsaW5lSGVpZ2h0OiAnMS40JyB9fT57Zm9ybS5zdHlsZU5vdGVzIHx8ICdOb25lIGFkZGVkJ308L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybSBvblN1Ym1pdD17aGFuZGxlU3VibWl0fSBzdHlsZT17eyBkaXNwbGF5OiAnZ3JpZCcsIGdyaWRUZW1wbGF0ZUNvbHVtbnM6ICcxZnIgMWZyJywgZ2FwOiAnMS41cmVtJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBncmlkQ29sdW1uOiAnc3BhbiAyJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17eyBkaXNwbGF5OiAnYmxvY2snLCBmb250U2l6ZTogJzAuOXJlbScsIG1hcmdpbkJvdHRvbTogJzAuNHJlbScsIGNvbG9yOiAnIzU1NScgfX0+RW1haWwgQWRkcmVzcyAoUmVxdWlyZWQpPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiZW1haWxcIiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Zm9ybS5lbWFpbH0gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVhZE9ubHkgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgd2lkdGg6ICcxMDAlJywgcGFkZGluZzogJzAuNzVyZW0nLCBib3JkZXI6ICcxcHggc29saWQgI2RkZCcsIGJvcmRlclJhZGl1czogJzZweCcsIGJhY2tncm91bmRDb2xvcjogJyNmOWY5ZjknLCBjb2xvcjogJyM3NzcnLCBvdXRsaW5lOiAnbm9uZScgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXt7IGRpc3BsYXk6ICdibG9jaycsIGZvbnRTaXplOiAnMC45cmVtJywgbWFyZ2luQm90dG9tOiAnMC40cmVtJywgY29sb3I6ICcjNTU1JyB9fT5GdWxsIE5hbWUgKjwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlZCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkVudGVyIHlvdXIgZnVsbCBuYW1lXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Zm9ybS5mdWxsTmFtZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17ZSA9PiBzZXRGb3JtKHsgLi4uZm9ybSwgZnVsbE5hbWU6IGUudGFyZ2V0LnZhbHVlIH0pfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IHdpZHRoOiAnMTAwJScsIHBhZGRpbmc6ICcwLjc1cmVtJywgYm9yZGVyOiAnMXB4IHNvbGlkICNkZGQnLCBib3JkZXJSYWRpdXM6ICc2cHgnLCBvdXRsaW5lOiAnbm9uZScgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXt7IGRpc3BsYXk6ICdibG9jaycsIGZvbnRTaXplOiAnMC45cmVtJywgbWFyZ2luQm90dG9tOiAnMC40cmVtJywgY29sb3I6ICcjNTU1JyB9fT5QaG9uZSBOdW1iZXIgKjwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRlbFwiIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiMTAtZGlnaXQgbnVtYmVyXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Zm9ybS5waG9uZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17ZSA9PiBzZXRGb3JtKHsgLi4uZm9ybSwgcGhvbmU6IGUudGFyZ2V0LnZhbHVlIH0pfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IHdpZHRoOiAnMTAwJScsIHBhZGRpbmc6ICcwLjc1cmVtJywgYm9yZGVyOiAnMXB4IHNvbGlkICNkZGQnLCBib3JkZXJSYWRpdXM6ICc2cHgnLCBvdXRsaW5lOiAnbm9uZScgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGdyaWRDb2x1bW46ICdzcGFuIDInIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXt7IGRpc3BsYXk6ICdibG9jaycsIGZvbnRTaXplOiAnMC45cmVtJywgbWFyZ2luQm90dG9tOiAnMC40cmVtJywgY29sb3I6ICcjNTU1JyB9fT5TaGlwcGluZyBBZGRyZXNzIExpbmUgKjwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlZCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkFwYXJ0bWVudCwgU3RyZWV0IEFkZHJlc3NcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtmb3JtLmFkZHJlc3N9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2UgPT4gc2V0Rm9ybSh7IC4uLmZvcm0sIGFkZHJlc3M6IGUudGFyZ2V0LnZhbHVlIH0pfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IHdpZHRoOiAnMTAwJScsIHBhZGRpbmc6ICcwLjc1cmVtJywgYm9yZGVyOiAnMXB4IHNvbGlkICNkZGQnLCBib3JkZXJSYWRpdXM6ICc2cHgnLCBvdXRsaW5lOiAnbm9uZScgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXt7IGRpc3BsYXk6ICdibG9jaycsIGZvbnRTaXplOiAnMC45cmVtJywgbWFyZ2luQm90dG9tOiAnMC40cmVtJywgY29sb3I6ICcjNTU1JyB9fT5DaXR5ICo8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCIgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWQgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJDaXR5IE5hbWVcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtmb3JtLmNpdHl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2UgPT4gc2V0Rm9ybSh7IC4uLmZvcm0sIGNpdHk6IGUudGFyZ2V0LnZhbHVlIH0pfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IHdpZHRoOiAnMTAwJScsIHBhZGRpbmc6ICcwLjc1cmVtJywgYm9yZGVyOiAnMXB4IHNvbGlkICNkZGQnLCBib3JkZXJSYWRpdXM6ICc2cHgnLCBvdXRsaW5lOiAnbm9uZScgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXt7IGRpc3BsYXk6ICdibG9jaycsIGZvbnRTaXplOiAnMC45cmVtJywgbWFyZ2luQm90dG9tOiAnMC40cmVtJywgY29sb3I6ICcjNTU1JyB9fT5TdGF0ZSAqPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwidGV4dFwiIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiU3RhdGUgTmFtZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2Zvcm0uc3RhdGV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2UgPT4gc2V0Rm9ybSh7IC4uLmZvcm0sIHN0YXRlOiBlLnRhcmdldC52YWx1ZSB9KX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyB3aWR0aDogJzEwMCUnLCBwYWRkaW5nOiAnMC43NXJlbScsIGJvcmRlcjogJzFweCBzb2xpZCAjZGRkJywgYm9yZGVyUmFkaXVzOiAnNnB4Jywgb3V0bGluZTogJ25vbmUnIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17eyBkaXNwbGF5OiAnYmxvY2snLCBmb250U2l6ZTogJzAuOXJlbScsIG1hcmdpbkJvdHRvbTogJzAuNHJlbScsIGNvbG9yOiAnIzU1NScgfX0+WklQIC8gUG9zdGFsIENvZGUgKjwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlZCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIjYtZGlnaXQgUElOIGNvZGVcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtmb3JtLnppcENvZGV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2UgPT4gc2V0Rm9ybSh7IC4uLmZvcm0sIHppcENvZGU6IGUudGFyZ2V0LnZhbHVlIH0pfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IHdpZHRoOiAnMTAwJScsIHBhZGRpbmc6ICcwLjc1cmVtJywgYm9yZGVyOiAnMXB4IHNvbGlkICNkZGQnLCBib3JkZXJSYWRpdXM6ICc2cHgnLCBvdXRsaW5lOiAnbm9uZScgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXt7IGRpc3BsYXk6ICdibG9jaycsIGZvbnRTaXplOiAnMC45cmVtJywgbWFyZ2luQm90dG9tOiAnMC40cmVtJywgY29sb3I6ICcjNTU1JyB9fT5QcmVmZXJyZWQgU2l6aW5nIChPcHRpb25hbCk8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNlbGVjdCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Zm9ybS5wcmVmZXJyZWRTaXplfSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17ZSA9PiBzZXRGb3JtKHsgLi4uZm9ybSwgcHJlZmVycmVkU2l6ZTogZS50YXJnZXQudmFsdWUgfSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgd2lkdGg6ICcxMDAlJywgcGFkZGluZzogJzAuNzVyZW0nLCBib3JkZXI6ICcxcHggc29saWQgI2RkZCcsIGJvcmRlclJhZGl1czogJzZweCcsIG91dGxpbmU6ICdub25lJywgYmFja2dyb3VuZENvbG9yOiAnI2ZmZicgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCI+Q2hvb3NlIFNpemluZzwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJYU1wiPlhTPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlNcIj5TPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIk1cIj5NPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIkxcIj5MPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlhMXCI+WEw8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBncmlkQ29sdW1uOiAnc3BhbiAyJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17eyBkaXNwbGF5OiAnYmxvY2snLCBmb250U2l6ZTogJzAuOXJlbScsIG1hcmdpbkJvdHRvbTogJzAuNHJlbScsIGNvbG9yOiAnIzU1NScgfX0+U3R5bGUgUHJlZmVyZW5jZXMgJiBTcGVjaWFsIEluc3RydWN0aW9uczwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGV4dGFyZWEgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93cz1cIjNcIiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlRlbGwgdXMgd2hhdCBmaXQsIHBhdHRlcm5zIG9yIGZhYnJpY3MgeW91IGxvdmVcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtmb3JtLnN0eWxlTm90ZXN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2UgPT4gc2V0Rm9ybSh7IC4uLmZvcm0sIHN0eWxlTm90ZXM6IGUudGFyZ2V0LnZhbHVlIH0pfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IHdpZHRoOiAnMTAwJScsIHBhZGRpbmc6ICcwLjc1cmVtJywgYm9yZGVyOiAnMXB4IHNvbGlkICNkZGQnLCBib3JkZXJSYWRpdXM6ICc2cHgnLCBvdXRsaW5lOiAnbm9uZScsIHJlc2l6ZTogJ25vbmUnIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBncmlkQ29sdW1uOiAnc3BhbiAyJywgbWFyZ2luVG9wOiAnMXJlbScgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJzdWJtaXRcIiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnlcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc2FibGVkPXtzYXZpbmd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgcGFkZGluZzogJzAuOHJlbSAyLjVyZW0nLCB3aWR0aDogJzEwMCUnIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3NhdmluZyA/ICdTYXZpbmcuLi4nIDogKG1vZGUgPT09ICdjcmVhdGUnID8gJ0NyZWF0ZSBQcm9maWxlJyA6ICdTYXZlIERldGFpbHMnKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Zvcm0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICApfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB7LyogVEFCOiBBRERSRVNTRVMgKi99XHJcbiAgICAgICAgICAgICAgICAgICAge2FjdGl2ZVRhYiA9PT0gJ2FkZHJlc3NlcycgJiYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBtYXJnaW5Cb3R0b206ICcycmVtJywgYm9yZGVyQm90dG9tOiAnMXB4IHNvbGlkICNmMGYwZjAnLCBwYWRkaW5nQm90dG9tOiAnMXJlbScgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGgyIHN0eWxlPXt7IGZvbnRGYW1pbHk6ICd2YXIoLS1mb250LXRpdGxlKScsIG1hcmdpbjogMCwgZm9udFNpemU6ICcxLjRyZW0nLCBjb2xvcjogJyMzMzMnIH19PlNhdmVkIEFkZHJlc3NlcyBCb29rPC9oMj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCIgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldEFkZHJlc3NGb3JtKHsgaWQ6IDAsIGZ1bGxOYW1lOiAnJywgcGhvbmU6ICcnLCBhZGRyZXNzTGluZTogJycsIGNpdHk6ICcnLCBzdGF0ZTogJycsIHppcENvZGU6ICcnIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0QWRkcmVzc01lc3NhZ2UoJycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0U2hvd0FkZHJlc3NGb3JtKCFzaG93QWRkcmVzc0Zvcm0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnlcIiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgcGFkZGluZzogJzAuNXJlbSAxLjJyZW0nLCBib3JkZXJSYWRpdXM6ICc2cHgnLCBmb250U2l6ZTogJzAuOXJlbScgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzaG93QWRkcmVzc0Zvcm0gPyAnQ2xvc2UgRm9ybScgOiAnKyBBZGQgQWRkcmVzcyd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2hvd0FkZHJlc3NGb3JtICYmIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybSBvblN1Ym1pdD17aGFuZGxlQWRkcmVzc1N1Ym1pdH0gc3R5bGU9e3sgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6ICcjZmFmYWZhJywgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6ICcxLjVyZW0nLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnOHB4JywgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlcjogJzFweCBzb2xpZCAjZWVlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOiAnMnJlbScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdncmlkJywgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyaWRUZW1wbGF0ZUNvbHVtbnM6ICcxZnIgMWZyJywgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdhcDogJzFyZW0nIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDQgc3R5bGU9e3sgZ3JpZENvbHVtbjogJ3NwYW4gMicsIG1hcmdpbjogJzAgMCAwLjVyZW0nLCBmb250RmFtaWx5OiAndmFyKC0tZm9udC10aXRsZSknLCBmb250U2l6ZTogJzEuMXJlbScgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7YWRkcmVzc0Zvcm0uaWQgPiAwID8gJ0VkaXQgU2hpcHBpbmcgQWRkcmVzcycgOiAnTmV3IFNoaXBwaW5nIEFkZHJlc3MnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2g0PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2FkZHJlc3NNZXNzYWdlICYmIDxwIHN0eWxlPXt7IGdyaWRDb2x1bW46ICdzcGFuIDInLCBjb2xvcjogJ3JlZCcsIG1hcmdpbjogMCwgZm9udFNpemU6ICcwLjg1cmVtJyB9fT57YWRkcmVzc01lc3NhZ2V9PC9wPn1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e3sgZGlzcGxheTogJ2Jsb2NrJywgZm9udFNpemU6ICcwLjhyZW0nLCBjb2xvcjogJyM2NjYnLCBtYXJnaW5Cb3R0b206ICcwLjJyZW0nIH19PkZ1bGwgTmFtZSAqPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIHJlcXVpcmVkIHZhbHVlPXthZGRyZXNzRm9ybS5mdWxsTmFtZX0gb25DaGFuZ2U9e2UgPT4gc2V0QWRkcmVzc0Zvcm0oey4uLmFkZHJlc3NGb3JtLCBmdWxsTmFtZTogZS50YXJnZXQudmFsdWV9KX0gc3R5bGU9e3sgd2lkdGg6ICcxMDAlJywgcGFkZGluZzogJzAuNXJlbScsIGJvcmRlcjogJzFweCBzb2xpZCAjZGRkJywgYm9yZGVyUmFkaXVzOiAnNHB4JyB9fSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17eyBkaXNwbGF5OiAnYmxvY2snLCBmb250U2l6ZTogJzAuOHJlbScsIGNvbG9yOiAnIzY2NicsIG1hcmdpbkJvdHRvbTogJzAuMnJlbScgfX0+Q29udGFjdCBQaG9uZSAqPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIHJlcXVpcmVkIHZhbHVlPXthZGRyZXNzRm9ybS5waG9uZX0gb25DaGFuZ2U9e2UgPT4gc2V0QWRkcmVzc0Zvcm0oey4uLmFkZHJlc3NGb3JtLCBwaG9uZTogZS50YXJnZXQudmFsdWV9KX0gc3R5bGU9e3sgd2lkdGg6ICcxMDAlJywgcGFkZGluZzogJzAuNXJlbScsIGJvcmRlcjogJzFweCBzb2xpZCAjZGRkJywgYm9yZGVyUmFkaXVzOiAnNHB4JyB9fSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBncmlkQ29sdW1uOiAnc3BhbiAyJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17eyBkaXNwbGF5OiAnYmxvY2snLCBmb250U2l6ZTogJzAuOHJlbScsIGNvbG9yOiAnIzY2NicsIG1hcmdpbkJvdHRvbTogJzAuMnJlbScgfX0+QWRkcmVzcyBMaW5lICo8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgcmVxdWlyZWQgdmFsdWU9e2FkZHJlc3NGb3JtLmFkZHJlc3NMaW5lfSBvbkNoYW5nZT17ZSA9PiBzZXRBZGRyZXNzRm9ybSh7Li4uYWRkcmVzc0Zvcm0sIGFkZHJlc3NMaW5lOiBlLnRhcmdldC52YWx1ZX0pfSBzdHlsZT17eyB3aWR0aDogJzEwMCUnLCBwYWRkaW5nOiAnMC41cmVtJywgYm9yZGVyOiAnMXB4IHNvbGlkICNkZGQnLCBib3JkZXJSYWRpdXM6ICc0cHgnIH19IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXt7IGRpc3BsYXk6ICdibG9jaycsIGZvbnRTaXplOiAnMC44cmVtJywgY29sb3I6ICcjNjY2JywgbWFyZ2luQm90dG9tOiAnMC4ycmVtJyB9fT5DaXR5ICo8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgcmVxdWlyZWQgdmFsdWU9e2FkZHJlc3NGb3JtLmNpdHl9IG9uQ2hhbmdlPXtlID0+IHNldEFkZHJlc3NGb3JtKHsuLi5hZGRyZXNzRm9ybSwgY2l0eTogZS50YXJnZXQudmFsdWV9KX0gc3R5bGU9e3sgd2lkdGg6ICcxMDAlJywgcGFkZGluZzogJzAuNXJlbScsIGJvcmRlcjogJzFweCBzb2xpZCAjZGRkJywgYm9yZGVyUmFkaXVzOiAnNHB4JyB9fSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17eyBkaXNwbGF5OiAnYmxvY2snLCBmb250U2l6ZTogJzAuOHJlbScsIGNvbG9yOiAnIzY2NicsIG1hcmdpbkJvdHRvbTogJzAuMnJlbScgfX0+U3RhdGUgKjwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiByZXF1aXJlZCB2YWx1ZT17YWRkcmVzc0Zvcm0uc3RhdGV9IG9uQ2hhbmdlPXtlID0+IHNldEFkZHJlc3NGb3JtKHsuLi5hZGRyZXNzRm9ybSwgc3RhdGU6IGUudGFyZ2V0LnZhbHVlfSl9IHN0eWxlPXt7IHdpZHRoOiAnMTAwJScsIHBhZGRpbmc6ICcwLjVyZW0nLCBib3JkZXI6ICcxcHggc29saWQgI2RkZCcsIGJvcmRlclJhZGl1czogJzRweCcgfX0gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e3sgZGlzcGxheTogJ2Jsb2NrJywgZm9udFNpemU6ICcwLjhyZW0nLCBjb2xvcjogJyM2NjYnLCBtYXJnaW5Cb3R0b206ICcwLjJyZW0nIH19PlpJUCBDb2RlICo8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgcmVxdWlyZWQgdmFsdWU9e2FkZHJlc3NGb3JtLnppcENvZGV9IG9uQ2hhbmdlPXtlID0+IHNldEFkZHJlc3NGb3JtKHsuLi5hZGRyZXNzRm9ybSwgemlwQ29kZTogZS50YXJnZXQudmFsdWV9KX0gc3R5bGU9e3sgd2lkdGg6ICcxMDAlJywgcGFkZGluZzogJzAuNXJlbScsIGJvcmRlcjogJzFweCBzb2xpZCAjZGRkJywgYm9yZGVyUmFkaXVzOiAnNHB4JyB9fSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBncmlkQ29sdW1uOiAnc3BhbiAyJywgZGlzcGxheTogJ2ZsZXgnLCBqdXN0aWZ5Q29udGVudDogJ2ZsZXgtZW5kJywgZ2FwOiAnMC41cmVtJywgbWFyZ2luVG9wOiAnMC41cmVtJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9eygpID0+IHNldFNob3dBZGRyZXNzRm9ybShmYWxzZSl9IGNsYXNzTmFtZT1cImJ0bi1zZWNvbmRhcnlcIiBzdHlsZT17eyBwYWRkaW5nOiAnMC41cmVtIDFyZW0nLCBib3JkZXJSYWRpdXM6ICc0cHgnLCBmb250U2l6ZTogJzAuODVyZW0nIH19PkNhbmNlbDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3NOYW1lPVwiYnRuLXByaW1hcnlcIiBzdHlsZT17eyBwYWRkaW5nOiAnMC41cmVtIDFyZW0nLCBib3JkZXJSYWRpdXM6ICc0cHgnLCBmb250U2l6ZTogJzAuODVyZW0nIH19PlNhdmUgQWRkcmVzczwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Zvcm0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHthZGRyZXNzZXMubGVuZ3RoID09PSAwID8gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPXt7IGNvbG9yOiAnIzg4OCcsIHRleHRBbGlnbjogJ2NlbnRlcicsIG1hcmdpblRvcDogJzJyZW0nIH19Pk5vIHNoaXBwaW5nIGFkZHJlc3NlcyBhZGRlZCB5ZXQuPC9wPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdncmlkJywgZ3JpZFRlbXBsYXRlQ29sdW1uczogJ3JlcGVhdChhdXRvLWZpbGwsIG1pbm1heCgyODBweCwgMWZyKSknLCBnYXA6ICcxLjVyZW0nIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7YWRkcmVzc2VzLm1hcChhZGRyID0+IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYga2V5PXthZGRyLmlkfSBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlcjogJzFweCBzb2xpZCAjZWVlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAnMS41cmVtJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICc4cHgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogYWRkci5pc0RlZmF1bHQgPyAnI2ZmZmNmOScgOiAnI2ZmZicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyQ29sb3I6IGFkZHIuaXNEZWZhdWx0ID8gJyNlNGIzOWInIDogJyNlZWUnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7YWRkci5pc0RlZmF1bHQgJiYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsIHRvcDogJzEycHgnLCByaWdodDogJzEycHgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6ICcwLjdyZW0nLCB0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJywgbGV0dGVyU3BhY2luZzogJzAuNXB4JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6ICcjZTRiMzliJywgY29sb3I6ICcjZmZmJywgcGFkZGluZzogJzJweCA4cHgnLCBib3JkZXJSYWRpdXM6ICcxMHB4JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6ICc2MDAnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19PkRlZmF1bHQ8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDQgc3R5bGU9e3sgbWFyZ2luOiAnMCAwIDAuNXJlbScsIGZvbnRTaXplOiAnMXJlbScsIGZvbnRGYW1pbHk6ICd2YXIoLS1mb250LXRpdGxlKScgfX0+e2FkZHIuZnVsbE5hbWV9PC9oND5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBzdHlsZT17eyBtYXJnaW46ICcwIDAgMC4ycmVtJywgZm9udFNpemU6ICcwLjg1cmVtJywgY29sb3I6ICcjNjY2JywgbGluZUhlaWdodDogJzEuNCcgfX0+e2FkZHIuYWRkcmVzc0xpbmV9PC9wPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPXt7IG1hcmdpbjogJzAgMCAwLjVyZW0nLCBmb250U2l6ZTogJzAuODVyZW0nLCBjb2xvcjogJyM2NjYnIH19PnthZGRyLmNpdHl9LCB7YWRkci5zdGF0ZX0gLSB7YWRkci56aXBDb2RlfTwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBzdHlsZT17eyBtYXJnaW46ICcwIDAgMXJlbScsIGZvbnRTaXplOiAnMC44NXJlbScsIGNvbG9yOiAnIzU1NScsIGZvbnRXZWlnaHQ6ICc1MDAnIH19PlBob25lOiB7YWRkci5waG9uZX08L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGdhcDogJzFyZW0nLCBmb250U2l6ZTogJzAuOHJlbScsIGJvcmRlclRvcDogJzFweCBzb2xpZCAjZjVmNWY1JywgcGFkZGluZ1RvcDogJzAuOHJlbScgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHshYWRkci5pc0RlZmF1bHQgJiYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17KCkgPT4gaGFuZGxlU2V0RGVmYXVsdEFkZHJlc3MoYWRkci5pZCl9IHN0eWxlPXt7IGJhY2tncm91bmQ6ICdub25lJywgYm9yZGVyOiAnbm9uZScsIGNvbG9yOiAnI2I5N2E2NicsIGZvbnRXZWlnaHQ6ICc1MDAnLCBjdXJzb3I6ICdwb2ludGVyJywgcGFkZGluZzogMCB9fT5TZXQgRGVmYXVsdDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXsoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRBZGRyZXNzRm9ybSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGFkZHIuaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVsbE5hbWU6IGFkZHIuZnVsbE5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGhvbmU6IGFkZHIucGhvbmUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkcmVzc0xpbmU6IGFkZHIuYWRkcmVzc0xpbmUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2l0eTogYWRkci5jaXR5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlOiBhZGRyLnN0YXRlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHppcENvZGU6IGFkZHIuemlwQ29kZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRBZGRyZXNzTWVzc2FnZSgnJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRTaG93QWRkcmVzc0Zvcm0odHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19IHN0eWxlPXt7IGJhY2tncm91bmQ6ICdub25lJywgYm9yZGVyOiAnbm9uZScsIGNvbG9yOiAnIzY2NicsIGN1cnNvcjogJ3BvaW50ZXInLCBwYWRkaW5nOiAwIH19PkVkaXQ8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17KCkgPT4gaGFuZGxlRGVsZXRlQWRkcmVzcyhhZGRyLmlkKX0gc3R5bGU9e3sgYmFja2dyb3VuZDogJ25vbmUnLCBib3JkZXI6ICdub25lJywgY29sb3I6ICcjZDMyZjJmJywgY3Vyc29yOiAncG9pbnRlcicsIHBhZGRpbmc6IDAgfX0+RGVsZXRlPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICApfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB7LyogVEFCOiBPUkRFUlMgKi99XHJcbiAgICAgICAgICAgICAgICAgICAge2FjdGl2ZVRhYiA9PT0gJ29yZGVycycgJiYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGgyIHN0eWxlPXt7IGZvbnRGYW1pbHk6ICd2YXIoLS1mb250LXRpdGxlKScsIG1hcmdpbkJvdHRvbTogJzEuNXJlbScsIGZvbnRTaXplOiAnMS40cmVtJywgYm9yZGVyQm90dG9tOiAnMXB4IHNvbGlkICNmMGYwZjAnLCBwYWRkaW5nQm90dG9tOiAnMXJlbScgfX0+T3JkZXIgSGlzdG9yeTwvaDI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7b3JkZXJzLmxlbmd0aCA9PT0gMCA/IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBzdHlsZT17eyBjb2xvcjogJyM4ODgnLCB0ZXh0QWxpZ246ICdjZW50ZXInLCBtYXJnaW5Ub3A6ICcycmVtJyB9fT5Zb3UgaGF2ZSBub3QgcGxhY2VkIGFueSBvcmRlcnMgeWV0LjwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICkgOiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLCBnYXA6ICcxLjVyZW0nIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7b3JkZXJzLm1hcChvcmRlciA9PiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGtleT17b3JkZXIuaWR9IHN0eWxlPXt7IGJvcmRlcjogJzFweCBzb2xpZCAjZWVlJywgYm9yZGVyUmFkaXVzOiAnOHB4JywgcGFkZGluZzogJzEuNXJlbScsIGJhY2tncm91bmRDb2xvcjogJyNmYWZhZmEnIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLCBmbGV4V3JhcDogJ3dyYXAnLCBnYXA6ICcxcmVtJywgYm9yZGVyQm90dG9tOiAnMXB4IHNvbGlkICNlZWUnLCBwYWRkaW5nQm90dG9tOiAnMC44cmVtJywgbWFyZ2luQm90dG9tOiAnMXJlbScgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgZ2FwOiAnOHB4JywgZmxleFdyYXA6ICd3cmFwJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRTaXplOiAnMC44cmVtJywgY29sb3I6ICcjODg4JyB9fT5PcmRlciBJRDo8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250V2VpZ2h0OiAnNjAwJywgZm9udEZhbWlseTogJ21vbm9zcGFjZScsIGZvbnRTaXplOiAnMC45NXJlbScgfX0+e29yZGVyLmlkfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxDb3B5QnV0dG9uIHRleHQ9e29yZGVyLmlkfSBsYWJlbD1cIkNvcHkgSURcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRTaXplOiAnMC44NXJlbScsIGNvbG9yOiAnI2I5N2E2NicsIGZvbnRXZWlnaHQ6ICc1MDAnLCB0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJyB9fT57b3JkZXIuc3RhdHVzfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2dyaWQnLCBncmlkVGVtcGxhdGVDb2x1bW5zOiAnMmZyIDFmcicsIGdhcDogJzEuNXJlbScgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDUgc3R5bGU9e3sgbWFyZ2luOiAnMCAwIDAuNXJlbScsIGZvbnRTaXplOiAnMC44NXJlbScsIGNvbG9yOiAnIzg4OCcsIHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnIH19Pkl0ZW1zPC9oNT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1bCBzdHlsZT17eyBsaXN0U3R5bGU6ICdub25lJywgcGFkZGluZzogMCwgbWFyZ2luOiAwIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtvcmRlci5pdGVtcyAmJiBvcmRlci5pdGVtcy5tYXAoKGl0LCBpZHgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHF0eSA9IGl0LnF1YW50aXR5IHx8IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB1bml0UHJpY2UgPSBpdC5wcmljZUF0UXR5IHx8IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBsaW5lVG90YWwgPSB1bml0UHJpY2UgKiBxdHk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBrZXk9e2l0LnByb2R1Y3RJZCB8fCBpZHh9IHN0eWxlPXt7IGZvbnRTaXplOiAnMC45cmVtJywgY29sb3I6ICcjMzMzJywgcGFkZGluZzogJzAuNHJlbSAwJywgZGlzcGxheTogJ2ZsZXgnLCBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLCBhbGlnbkl0ZW1zOiAnY2VudGVyJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPntpdC5wcm9kdWN0TmFtZSB8fCBpdC5wcm9kdWN0SWR9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2l0LnNpemUgJiYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRTaXplOiAnMC43NXJlbScsIGJhY2tncm91bmQ6ICcjZmZmMGU5JywgY29sb3I6ICcjYjk3YTY2JywgcGFkZGluZzogJzFweCA2cHgnLCBib3JkZXJSYWRpdXM6ICc0cHgnLCBtYXJnaW5MZWZ0OiAnNnB4JywgZm9udFdlaWdodDogJzUwMCcgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNpemU6IHtpdC5zaXplfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Ryb25nIHN0eWxlPXt7IG1hcmdpbkxlZnQ6ICc2cHgnLCBjb2xvcjogJyM1NTUnIH19Pngge3F0eX08L3N0cm9uZz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgdGV4dEFsaWduOiAncmlnaHQnIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFdlaWdodDogJzUwMCcgfX0+4oK5e2xpbmVUb3RhbC50b0xvY2FsZVN0cmluZygnZW4tSU4nKX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7cXR5ID4gMSAmJiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZGlzcGxheTogJ2Jsb2NrJywgZm9udFNpemU6ICcwLjc1cmVtJywgY29sb3I6ICcjODg4JyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKOKCuXt1bml0UHJpY2UudG9Mb2NhbGVTdHJpbmcoJ2VuLUlOJyl9IGVhY2gpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgYm9yZGVyTGVmdDogJzFweCBzb2xpZCAjZWVlJywgcGFkZGluZ0xlZnQ6ICcxLjVyZW0nLCBkaXNwbGF5OiAnZmxleCcsIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLCBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IG1hcmdpbkJvdHRvbTogJzAuNXJlbScgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFNpemU6ICcwLjhyZW0nLCBjb2xvcjogJyM4ODgnIH19PkRhdGU6PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGRpc3BsYXk6ICdibG9jaycsIGZvbnRTaXplOiAnMC45cmVtJywgZm9udFdlaWdodDogJzUwMCcgfX0+e25ldyBEYXRlKG9yZGVyLmNyZWF0ZWRBdCkudG9Mb2NhbGVEYXRlU3RyaW5nKCdlbi1JTicsIHsgZGF0ZVN0eWxlOiAnbWVkaXVtJyB9KX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFNpemU6ICcwLjhyZW0nLCBjb2xvcjogJyM4ODgnIH19PlRvdGFsIEFtb3VudCBQYWlkOjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBkaXNwbGF5OiAnYmxvY2snLCBmb250U2l6ZTogJzEuMTVyZW0nLCBjb2xvcjogJyNiOTdhNjYnLCBmb250V2VpZ2h0OiAnNjAwJyB9fT7igrl7b3JkZXIudG90YWxBbW91bnQudG9Mb2NhbGVTdHJpbmcoJ2VuLUlOJyl9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7b3JkZXIudHJhY2tpbmdOdW1iZXIgJiYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IG1hcmdpblRvcDogJzFyZW0nLCBiYWNrZ3JvdW5kOiAnI2VhZjNmYycsIHBhZGRpbmc6ICcwLjc1cmVtIDFyZW0nLCBib3JkZXJSYWRpdXM6ICc2cHgnLCBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLCBmbGV4V3JhcDogJ3dyYXAnLCBnYXA6ICcwLjVyZW0nIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFNpemU6ICcwLjg1cmVtJywgY29sb3I6ICcjMWE1Njk1JyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTaGlwcGluZyBDYXJyaWVyIFRyYWNraW5nIE51bWJlcjogPHN0cm9uZyBzdHlsZT17eyBmb250RmFtaWx5OiAnbW9ub3NwYWNlJyB9fT57b3JkZXIudHJhY2tpbmdOdW1iZXJ9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Q29weUJ1dHRvbiB0ZXh0PXtvcmRlci50cmFja2luZ051bWJlcn0gbGFiZWw9XCJDb3B5IFRyYWNraW5nIElEXCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge29yZGVyLnVubG9ja2VkR2lmdCAmJiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgbWFyZ2luVG9wOiAnMC44cmVtJywgYmFja2dyb3VuZDogJyNmZmY5ZTYnLCBwYWRkaW5nOiAnMC43NXJlbSAxcmVtJywgYm9yZGVyOiAnMXB4IGRhc2hlZCAjZmNkMzRkJywgYm9yZGVyUmFkaXVzOiAnNnB4JywgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJywgZmxleFdyYXA6ICd3cmFwJywgZ2FwOiAnMC41cmVtJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRTaXplOiAnMC44NXJlbScsIGNvbG9yOiAnIzg1NGQwZScgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmV3YXJkIFVubG9ja2VkOiA8c3Ryb25nPntvcmRlci51bmxvY2tlZEdpZnR9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Q29weUJ1dHRvbiB0ZXh0PXtvcmRlci51bmxvY2tlZEdpZnR9IGxhYmVsPVwiQ29weSBDb2RlXCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICl9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHsvKiBUQUI6IENPVVBPTlMgKi99XHJcbiAgICAgICAgICAgICAgICAgICAge2FjdGl2ZVRhYiA9PT0gJ2NvdXBvbnMnICYmIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoMiBzdHlsZT17eyBmb250RmFtaWx5OiAndmFyKC0tZm9udC10aXRsZSknLCBtYXJnaW5Cb3R0b206ICcxLjVyZW0nLCBmb250U2l6ZTogJzEuNHJlbScsIGJvcmRlckJvdHRvbTogJzFweCBzb2xpZCAjZjBmMGYwJywgcGFkZGluZ0JvdHRvbTogJzFyZW0nIH19Pk15IExveWFsdHkgQ291cG9uczwvaDI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Y291cG9ucy5sZW5ndGggPT09IDAgPyAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHAgc3R5bGU9e3sgY29sb3I6ICcjODg4JywgdGV4dEFsaWduOiAnY2VudGVyJywgbWFyZ2luVG9wOiAnMnJlbScgfX0+Tm8gZHluYW1pYyBjb3Vwb25zIGlzc3VlZCB0byB5b3VyIGVtYWlsIHlldC48L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2dyaWQnLCBncmlkVGVtcGxhdGVDb2x1bW5zOiAncmVwZWF0KGF1dG8tZmlsbCwgbWlubWF4KDIzMHB4LCAxZnIpKScsIGdhcDogJzEuNHJlbScgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtjb3Vwb25zLm1hcChjID0+IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYga2V5PXtjLmlkfSBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlcjogJzJweCBkYXNoZWQgI2U0YjM5YicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogJzEuM3JlbSAxcmVtJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICcxMnB4JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjZmZmY2Y5JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG92ZXJmbG93OiAnaGlkZGVuJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3hTaGFkb3c6ICcwIDRweCAxNXB4IHJnYmEoMCwwLDAsMC4wMyknXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCB0b3A6IDAsIGxlZnQ6IDAsIHJpZ2h0OiAwLCBoZWlnaHQ6ICc0cHgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiAnbGluZWFyLWdyYWRpZW50KDkwZGVnLCAjZTRiMzliLCAjYjk3YTY2KSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvKiBDb2RlICYgSWNvbi1Pbmx5IENvcHkgQnV0dG9uIENvbnRhaW5lciAqL31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiAnZmxleCcsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJywgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJywgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdhcDogJzAuNHJlbScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbjogJzAuNHJlbSAwIDAuOHJlbScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJyNmZmZmZmYnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXI6ICcxcHggZGFzaGVkICNlNGIzOWInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICc4cHgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAnMC40cmVtIDAuNnJlbSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHN0cm9uZyBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6ICcxLjA1cmVtJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6ICdtb25vc3BhY2UnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjYjk3YTY2JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldHRlclNwYWNpbmc6ICcxcHgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2hpdGVTcGFjZTogJ25vd3JhcCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Yy5jb2RlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3N0cm9uZz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPENvcHlCdXR0b24gdGV4dD17Yy5jb2RlfSBpY29uT25seT17dHJ1ZX0gc3R5bGU9e3sgcGFkZGluZzogJzRweCA2cHgnLCBib3JkZXJSYWRpdXM6ICc0cHgnIH19IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgey8qIE9mZmVyIEFtb3VudCAqL31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDQgc3R5bGU9e3sgbWFyZ2luOiAnMC41cmVtIDAgMC4ycmVtJywgZm9udFNpemU6ICcxLjM1cmVtJywgZm9udEZhbWlseTogJ3ZhcigtLWZvbnQtdGl0bGUpJywgY29sb3I6ICcjMkQyQTI2JywgZm9udFdlaWdodDogJzcwMCcgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtjLnR5cGUgPT09ICdwZXJjZW50YWdlJyA/IGAke2MudmFsdWV9JSBPRkZgIDogYOKCuSR7Yy52YWx1ZX0gT0ZGYH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2g0PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPXt7IG1hcmdpbjogJzAgMCAwLjVyZW0nLCBmb250U2l6ZTogJzAuNzhyZW0nLCBjb2xvcjogJyM3NzcnIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNaW4gb3JkZXIgb2Yg4oK5e2MubWluT3JkZXIudG9Mb2NhbGVTdHJpbmcoJ2VuLUlOJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9wPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7LyogRXhwaXJ5IEJhZGdlICovfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWMuZXhwaXJ5RGF0ZSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGV4cGlyeURhdGUgPSBuZXcgRGF0ZShjLmV4cGlyeURhdGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0b2RheSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvZGF5LnNldEhvdXJzKDAsMCwwLDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBpcnlEYXRlLnNldEhvdXJzKDAsMCwwLDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGlmZlRpbWUgPSBleHBpcnlEYXRlLmdldFRpbWUoKSAtIHRvZGF5LmdldFRpbWUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGlmZkRheXMgPSBNYXRoLmNlaWwoZGlmZlRpbWUgLyAoMTAwMCAqIDYwICogNjAgKiAyNCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGJhZGdlQ29sb3IgPSAnIzY2Nic7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0ZXh0ID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGlmZkRheXMgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWRnZUNvbG9yID0gJyNlZjQ0NDQnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dCA9IGBFeHBpcmVkIG9uICR7bmV3IERhdGUoYy5leHBpcnlEYXRlKS50b0xvY2FsZURhdGVTdHJpbmcoKX1gO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGRpZmZEYXlzID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWRnZUNvbG9yID0gJyNkOTc3MDYnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dCA9ICdFeHBpcmVzIHRvZGF5ISc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZGlmZkRheXMgPT09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhZGdlQ29sb3IgPSAnI2Q5NzcwNic7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0ID0gJ0V4cGlyZXMgdG9tb3Jyb3chJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChkaWZmRGF5cyA8PSA3KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWRnZUNvbG9yID0gJyNkOTc3MDYnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dCA9IGBFeHBpcmVzIGluICR7ZGlmZkRheXN9IGRheXNgO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFkZ2VDb2xvciA9ICcjMTU4MDNkJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQgPSBgRXhwaXJlcyBpbiAke2RpZmZEYXlzfSBkYXlzYDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luOiAnMC4zcmVtIGF1dG8gMCcsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAnMC43MnJlbScsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6ICczcHggOHB4JywgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnNHB4JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGJhZGdlQ29sb3IgKyAnMTAnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBiYWRnZUNvbG9yLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6ICc2MDAnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3RleHR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7LyogU3RhdHVzICYgVXNhZ2UgQmFyICovfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luVG9wOiAnMC44cmVtJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZ1RvcDogJzAuNnJlbScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlclRvcDogJzFweCBkYXNoZWQgI2VlZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAnMC43OHJlbScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzU1NSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5TdGF0dXM6IDxzdHJvbmcgc3R5bGU9e3sgY29sb3I6IGMuaXNBY3RpdmUgPyAnIzE1ODAzZCcgOiAnI2I5MWMxYycgfX0+e2MuaXNBY3RpdmUgPyAnQWN0aXZlJyA6ICdSZWRlZW1lZCd9PC9zdHJvbmc+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZm9udFNpemU6ICcwLjc0cmVtJywgY29sb3I6ICcjNzc3JywgbWFyZ2luVG9wOiAnMC4xNXJlbScgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBVc2VkOiB7Yy51c2VkQ291bnR9IC8ge2MudXNhZ2VMaW1pdH0gdGltZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICApfVxyXG5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICk7XHJcbn07XHJcblxyXG4vLyAtLS0gTUFJTiBBUFAgLS0tXHJcblxyXG5leHBvcnQgZGVmYXVsdCBQcm9maWxlUGFnZTtcclxuIl19