import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/pages/ProductDetails.jsx");const React = __vite__cjsImport0_react; const useState = __vite__cjsImport0_react["useState"]; const useEffect = __vite__cjsImport0_react["useEffect"]; const useRef = __vite__cjsImport0_react["useRef"]; const useMemo = __vite__cjsImport0_react["useMemo"]; const useCallback = __vite__cjsImport0_react["useCallback"];const _jsxDEV = __vite__cjsImport5_react_jsxDevRuntime["jsxDEV"];import __vite__cjsImport0_react from "/node_modules/.vite/deps/react.js?v=42a9b196";
import { useNavigate, Link, useLocation, useParams, Routes, Route, Navigate, BrowserRouter } from "/node_modules/.vite/deps/react-router-dom.js?v=42a9b196";
import Cart from "/src/pages/Cart.jsx";
import ImageWithSkeleton from "/src/components/ImageWithSkeleton.jsx";
import { API_BASE_URL } from "/src/data/config.jsx";
var _jsxFileName = "D:/The Ethnic Touch/frontend/src/pages/ProductDetails.jsx";
import __vite__cjsImport5_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=42a9b196";
var _s = $RefreshSig$();
const ProductDetails = ({ products, addToCart, wishlist = [], toggleWishlist, authUser }) => {
	_s();
	const { id } = useParams();
	const navigate = useNavigate();
	const product = products.find((p) => p.id === id);
	const [activeImage, setActiveImage] = useState(0);
	const [selectedSize, setSelectedSize] = useState("");
	const [quantity, setQuantity] = useState(1);
	const [reviews, setReviews] = useState([]);
	const [rating, setRating] = useState(5);
	const [comment, setComment] = useState("");
	const [reviewFormError, setReviewFormError] = useState("");
	const [reviewLoading, setReviewLoading] = useState(false);
	// Collapsible Accordion Tabs state
	const [openTabs, setOpenTabs] = useState({
		specs: true,
		shipping: false,
		sizeGuide: false
	});
	const carouselRef = useRef(null);
	const toggleTab = (tabKey) => {
		setOpenTabs((prev) => ({
			...prev,
			[tabKey]: !prev[tabKey]
		}));
	};
	useEffect(() => {
		if (product && product.sizes && product.sizes.length > 0) {
			// Select first size that has stock > 0
			const firstAvailable = product.sizes.find((sz) => {
				const stk = product.sizesStock && product.sizesStock[sz] !== undefined ? product.sizesStock[sz] : -1;
				return stk !== 0;
			});
			setSelectedSize(firstAvailable || "");
			setActiveImage(0);
			setQuantity(1);
		}
	}, [product]);
	useEffect(() => {
		const controller = new AbortController();
		if (product) {
			fetch(`${API_BASE_URL}/api/products/${product.id}/reviews`, { signal: controller.signal }).then((res) => res.json()).then((data) => {
				if (Array.isArray(data)) setReviews(data);
			}).catch((err) => {
				if (err.name !== "AbortError") {
					console.error("Error fetching reviews:", err);
				}
			});
		}
		return () => controller.abort();
	}, [product]);
	if (!product) return /* @__PURE__ */ _jsxDEV("div", {
		style: {
			padding: "10rem 5%",
			textAlign: "center"
		},
		children: /* @__PURE__ */ _jsxDEV("h2", { children: "Product Not Found" }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 60,
			columnNumber: 81
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 60,
		columnNumber: 26
	}, this);
	const isWished = wishlist ? wishlist.some((item) => item.id === product.id) : false;
	const galleryImages = product.galleryImages && product.galleryImages.length > 0 ? product.galleryImages : [product.imageUrl];
	const handleCarouselScroll = () => {
		if (!carouselRef.current) return;
		const container = carouselRef.current;
		const slideWidth = container.clientWidth;
		if (slideWidth > 0) {
			const newIndex = Math.round(container.scrollLeft / slideWidth);
			if (newIndex !== activeImage && newIndex >= 0 && newIndex < galleryImages.length) {
				setActiveImage(newIndex);
			}
		}
	};
	const handleThumbnailClick = (index) => {
		setActiveImage(index);
		if (carouselRef.current) {
			const container = carouselRef.current;
			container.scrollTo({
				left: index * container.clientWidth,
				behavior: "smooth"
			});
		}
	};
	const nextImage = () => {
		const nextIdx = (activeImage + 1) % galleryImages.length;
		handleThumbnailClick(nextIdx);
	};
	const prevImage = () => {
		const prevIdx = (activeImage - 1 + galleryImages.length) % galleryImages.length;
		handleThumbnailClick(prevIdx);
	};
	const handleBack = (e) => {
		e.preventDefault();
		if (window.history.state && window.history.state.idx > 0) {
			navigate(-1);
		} else {
			navigate("/shop");
		}
	};
	const scrollToReviews = () => {
		const el = document.getElementById("customer-reviews-section");
		if (el) {
			el.scrollIntoView({ behavior: "smooth" });
		}
	};
	const handleAddToCart = () => {
		addToCart({
			...product,
			size: selectedSize,
			quantity
		});
	};
	const submitReview = async (e) => {
		e.preventDefault();
		setReviewFormError("");
		const trimmedComment = comment.trim();
		if (!trimmedComment) {
			setReviewFormError("Please write a comment.");
			return;
		}
		setReviewLoading(true);
		const name = authUser?.displayName || authUser?.email?.split("@")[0] || "Guest Reviewer";
		const email = authUser?.email || "guest@ethnictouch.com";
		const cleanComment = trimmedComment.replace(/<[^>]*>?/gm, "").slice(0, 1e3);
		try {
			const res = await fetch(`${API_BASE_URL}/api/products/${product.id}/reviews`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					userName: name,
					userEmail: email,
					rating: parseInt(rating),
					comment: cleanComment
				})
			});
			if (!res.ok) throw new Error("Failed to post review");
			const newReview = await res.json();
			setReviews((prev) => [newReview, ...prev]);
			setComment("");
			setRating(5);
		} catch (err) {
			setReviewFormError("Could not post your review. Please try again.");
		} finally {
			setReviewLoading(false);
		}
	};
	const avgRating = reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : 0;
	// Find up to 4 recommended products (excluding current one)
	const recommendedList = products.filter((p) => p.id !== product.id).slice(0, 4);
	return /* @__PURE__ */ _jsxDEV("div", {
		className: "product-details-page-container",
		style: {
			maxWidth: "1200px",
			margin: "0 auto",
			minHeight: "80vh"
		},
		children: [
			/* @__PURE__ */ _jsxDEV("a", {
				href: "#",
				onClick: handleBack,
				className: "product-details-back-link",
				style: {
					display: "inline-block",
					marginBottom: "1.5rem",
					color: "var(--color-text-light)",
					textDecoration: "none",
					transition: "color 0.2s"
				},
				children: "← Back to Collection"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 166,
				columnNumber: 13
			}, this),
			/* @__PURE__ */ _jsxDEV("div", {
				className: "desktop-split-layout product-details-layout",
				style: {
					gap: "3rem",
					alignItems: "flex-start"
				},
				children: [/* @__PURE__ */ _jsxDEV("div", {
					className: "product-gallery-layout sticky-on-desktop",
					children: [galleryImages.length > 1 && /* @__PURE__ */ _jsxDEV("div", {
						className: "product-thumbnails-list",
						children: galleryImages.map((imgUrl, idx) => /* @__PURE__ */ _jsxDEV("div", {
							onClick: () => scrollToSlide(idx),
							className: `gallery-thumbnail ${activeImage === idx ? "active" : ""}`,
							style: {
								width: "70px",
								height: "90px",
								borderRadius: "6px",
								overflow: "hidden",
								cursor: "pointer",
								border: "2px solid transparent",
								flexShrink: 0
							},
							children: /* @__PURE__ */ _jsxDEV(ImageWithSkeleton, {
								src: imgUrl,
								alt: `Thumbnail ${idx + 1}`,
								style: {
									width: "100%",
									height: "100%",
									objectFit: "cover"
								}
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 190,
								columnNumber: 37
							}, this)
						}, idx, false, {
							fileName: _jsxFileName,
							lineNumber: 176,
							columnNumber: 33
						}, this))
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 174,
						columnNumber: 25
					}, this), /* @__PURE__ */ _jsxDEV("div", {
						className: "gallery-main-container",
						style: {
							flex: 1,
							borderRadius: "var(--border-radius-lg)",
							overflow: "hidden",
							boxShadow: "0 20px 40px rgba(0,0,0,0.05)",
							marginBottom: "1rem",
							aspectRatio: "3/4",
							maxHeight: "65vh",
							backgroundColor: "#fafafa",
							position: "relative",
							minWidth: 0
						},
						children: [/* @__PURE__ */ _jsxDEV("div", {
							ref: carouselRef,
							className: "gallery-carousel-track",
							onScroll: handleCarouselScroll,
							children: galleryImages.map((imgUrl, idx) => /* @__PURE__ */ _jsxDEV("div", {
								className: "gallery-carousel-slide",
								children: /* @__PURE__ */ _jsxDEV(ImageWithSkeleton, {
									src: imgUrl,
									alt: `${product.name} - View ${idx + 1}`,
									className: "gallery-slide-img"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 218,
									columnNumber: 37
								}, this)
							}, idx, false, {
								fileName: _jsxFileName,
								lineNumber: 217,
								columnNumber: 33
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 211,
							columnNumber: 25
						}, this), galleryImages.length > 1 && /* @__PURE__ */ _jsxDEV(React.Fragment, { children: [
							/* @__PURE__ */ _jsxDEV("button", {
								className: "slider-nav-btn prev",
								onClick: prevImage,
								"aria-label": "Previous image",
								children: "‹"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 229,
								columnNumber: 33
							}, this),
							/* @__PURE__ */ _jsxDEV("button", {
								className: "slider-nav-btn next",
								onClick: nextImage,
								"aria-label": "Next image",
								children: "›"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 230,
								columnNumber: 33
							}, this),
							/* @__PURE__ */ _jsxDEV("div", {
								className: "slider-dots",
								children: galleryImages.map((_, idx) => /* @__PURE__ */ _jsxDEV("div", {
									className: `slider-dot ${activeImage === idx ? "active" : ""}`,
									onClick: () => scrollToSlide(idx)
								}, idx, false, {
									fileName: _jsxFileName,
									lineNumber: 234,
									columnNumber: 41
								}, this))
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 232,
								columnNumber: 33
							}, this)
						] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 228,
							columnNumber: 29
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 196,
						columnNumber: 21
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 171,
					columnNumber: 17
				}, this), /* @__PURE__ */ _jsxDEV("div", {
					className: "product-summary-pane",
					style: {
						flex: 1,
						minWidth: "300px"
					},
					children: [
						/* @__PURE__ */ _jsxDEV("h1", {
							style: {
								fontSize: "2.2rem",
								margin: "0 0 0.5rem",
								fontFamily: "var(--font-title)"
							},
							children: product.name
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 248,
							columnNumber: 21
						}, this),
						/* @__PURE__ */ _jsxDEV("div", {
							onClick: scrollToReviews,
							style: {
								display: "inline-flex",
								alignItems: "center",
								gap: "8px",
								marginBottom: "1rem",
								cursor: "pointer"
							},
							title: "Click to view customer reviews",
							children: reviews.length > 0 ? /* @__PURE__ */ _jsxDEV(React.Fragment, { children: [/* @__PURE__ */ _jsxDEV("div", {
								style: {
									color: "#d4af37",
									fontSize: "1.1rem",
									letterSpacing: "1px"
								},
								children: ["★".repeat(Math.round(avgRating)), "☆".repeat(5 - Math.round(avgRating))]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 257,
								columnNumber: 33
							}, this), /* @__PURE__ */ _jsxDEV("span", {
								style: {
									color: "var(--color-primary)",
									fontSize: "0.85rem",
									textDecoration: "underline",
									fontWeight: "500"
								},
								children: [
									avgRating,
									" (",
									reviews.length,
									" reviews) ↓"
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 260,
								columnNumber: 33
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 256,
								columnNumber: 29
							}, this) : /* @__PURE__ */ _jsxDEV("span", {
								style: {
									color: "var(--color-primary)",
									fontSize: "0.85rem",
									textDecoration: "underline",
									fontWeight: "500"
								},
								children: "No reviews yet — Be the first to review! ↓"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 265,
								columnNumber: 29
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 250,
							columnNumber: 21
						}, this),
						/* @__PURE__ */ _jsxDEV("div", {
							style: {
								fontSize: "1.8rem",
								fontWeight: "600",
								marginBottom: "1.5rem",
								color: "var(--color-primary)"
							},
							children: [
								"₹",
								product.price.toLocaleString("en-IN"),
								" ",
								/* @__PURE__ */ _jsxDEV("span", {
									style: {
										fontSize: "0.8rem",
										color: "#888",
										fontWeight: "400"
									},
									children: "(Inclusive of all taxes)"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 272,
									columnNumber: 66
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 271,
							columnNumber: 21
						}, this),
						product.sizes && product.sizes.length > 0 && /* @__PURE__ */ _jsxDEV("div", {
							style: { marginBottom: "2.5rem" },
							children: [/* @__PURE__ */ _jsxDEV("div", {
								style: {
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									marginBottom: "1rem"
								},
								children: [/* @__PURE__ */ _jsxDEV("h4", {
									style: {
										margin: 0,
										fontSize: "0.95rem",
										fontWeight: "600",
										color: "#333"
									},
									children: "Select Size"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 279,
									columnNumber: 33
								}, this), selectedSize && /* @__PURE__ */ _jsxDEV("span", {
									style: {
										fontSize: "0.85rem",
										color: "var(--color-primary)",
										fontWeight: "500"
									},
									children: (() => {
										const qty = product.sizesStock && product.sizesStock[selectedSize] !== undefined ? product.sizesStock[selectedSize] : -1;
										if (qty === 0) return "Out of Stock";
										if (qty > 0 && qty <= 5) return `Only ${qty} left!`;
										if (qty > 5) return "In Stock";
										return "";
									})()
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 281,
									columnNumber: 37
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 278,
								columnNumber: 29
							}, this), /* @__PURE__ */ _jsxDEV("div", {
								style: {
									display: "flex",
									gap: "0.6rem",
									flexWrap: "wrap"
								},
								children: product.sizes.map((size) => {
									const stockQty = product.sizesStock && product.sizesStock[size] !== undefined ? product.sizesStock[size] : -1;
									const isDisabled = stockQty === 0;
									return /* @__PURE__ */ _jsxDEV("button", {
										disabled: isDisabled,
										onClick: () => setSelectedSize(size),
										className: `size-pill ${selectedSize === size ? "active" : ""}`,
										title: isDisabled ? "Out of stock" : "",
										style: {
											padding: "0.45rem 1rem",
											minWidth: "42px",
											height: "38px",
											borderRadius: "8px",
											border: "1.5px solid #ddd",
											backgroundColor: "#fff",
											color: "#555",
											fontWeight: "600",
											cursor: isDisabled ? "not-allowed" : "pointer",
											fontSize: "0.88rem"
										},
										children: size
									}, size, false, {
										fileName: _jsxFileName,
										lineNumber: 297,
										columnNumber: 41
									}, this);
								})
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 292,
								columnNumber: 29
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 277,
							columnNumber: 25
						}, this),
						/* @__PURE__ */ _jsxDEV("div", {
							style: { marginBottom: "1.5rem" },
							children: [/* @__PURE__ */ _jsxDEV("h4", {
								style: {
									margin: "0 0 0.6rem",
									fontSize: "0.9rem",
									fontWeight: "600",
									color: "#333"
								},
								children: "Quantity"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 326,
								columnNumber: 25
							}, this), /* @__PURE__ */ _jsxDEV("div", {
								style: {
									display: "flex",
									alignItems: "center",
									gap: "1rem",
									flexWrap: "wrap"
								},
								children: [/* @__PURE__ */ _jsxDEV("div", {
									style: {
										display: "flex",
										alignItems: "center",
										border: "1.5px solid #ddd",
										borderRadius: "8px",
										overflow: "hidden",
										backgroundColor: "#fafafa",
										height: "36px"
									},
									children: [
										/* @__PURE__ */ _jsxDEV("button", {
											type: "button",
											onClick: () => setQuantity((prev) => Math.max(1, prev - 1)),
											disabled: quantity <= 1,
											"aria-label": "Decrease quantity",
											style: {
												width: "34px",
												height: "100%",
												border: "none",
												background: "none",
												cursor: quantity <= 1 ? "not-allowed" : "pointer",
												fontSize: "1rem",
												fontWeight: "bold",
												color: quantity <= 1 ? "#ccc" : "#333",
												transition: "all 0.2s"
											},
											children: "-"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 329,
											columnNumber: 33
										}, this),
										/* @__PURE__ */ _jsxDEV("span", {
											style: {
												width: "36px",
												textAlign: "center",
												fontWeight: "600",
												fontSize: "0.9rem",
												userSelect: "none"
											},
											children: quantity
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 338,
											columnNumber: 33
										}, this),
										/* @__PURE__ */ _jsxDEV("button", {
											type: "button",
											onClick: () => setQuantity((prev) => prev + 1),
											"aria-label": "Increase quantity",
											style: {
												width: "34px",
												height: "100%",
												border: "none",
												background: "none",
												cursor: "pointer",
												fontSize: "1rem",
												fontWeight: "bold",
												color: "#333",
												transition: "all 0.2s"
											},
											children: "+"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 341,
											columnNumber: 33
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 328,
									columnNumber: 29
								}, this), quantity > 1 && /* @__PURE__ */ _jsxDEV("div", {
									style: {
										fontSize: "0.88rem",
										color: "#666",
										fontWeight: "500"
									},
									children: ["Subtotal: ", /* @__PURE__ */ _jsxDEV("strong", {
										style: { color: "var(--color-primary)" },
										children: ["₹", (product.price * quantity).toLocaleString("en-IN")]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 353,
										columnNumber: 47
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 352,
									columnNumber: 33
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 327,
								columnNumber: 25
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 325,
							columnNumber: 21
						}, this),
						/* @__PURE__ */ _jsxDEV("div", {
							className: "desktop-only-cta",
							style: {
								display: "flex",
								gap: "0.8rem",
								marginBottom: "1.5rem",
								flexWrap: "wrap"
							},
							children: [/* @__PURE__ */ _jsxDEV("button", {
								className: "btn btn-primary",
								onClick: handleAddToCart,
								disabled: !selectedSize,
								style: {
									fontSize: "0.92rem",
									padding: "0 1.25rem",
									flex: 1,
									minWidth: "180px",
									height: "44px",
									display: "flex",
									alignItems: "center",
									justifyContent: "center"
								},
								children: selectedSize ? `Add to Cart ${quantity > 1 ? `(${quantity})` : ""} - Size ${selectedSize}` : "Out of Stock"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 360,
								columnNumber: 25
							}, this), /* @__PURE__ */ _jsxDEV("button", {
								type: "button",
								onClick: () => toggleWishlist && toggleWishlist(product),
								title: isWished ? "Remove from wishlist" : "Add to wishlist",
								"aria-label": isWished ? "Remove from wishlist" : "Add to wishlist",
								style: {
									height: "44px",
									padding: "0 1.25rem",
									borderRadius: "var(--border-radius-pill, 50px)",
									border: isWished ? "2px solid #e53935" : "1.5px solid #ddd",
									backgroundColor: isWished ? "#fff5f5" : "#fff",
									color: isWished ? "#e53935" : "#444",
									fontWeight: "600",
									fontSize: "0.9rem",
									cursor: "pointer",
									display: "flex",
									alignItems: "center",
									gap: "6px",
									transition: "all 0.2s ease",
									flexShrink: 0
								},
								children: [/* @__PURE__ */ _jsxDEV("svg", {
									width: "17",
									height: "17",
									viewBox: "0 0 24 24",
									fill: isWished ? "#e53935" : "none",
									stroke: isWished ? "#e53935" : "currentColor",
									strokeWidth: "2",
									strokeLinecap: "round",
									strokeLinejoin: "round",
									children: /* @__PURE__ */ _jsxDEV("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 392,
										columnNumber: 33
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 391,
									columnNumber: 29
								}, this), /* @__PURE__ */ _jsxDEV("span", { children: isWished ? "Wishlisted" : "Wishlist" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 394,
									columnNumber: 29
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 369,
								columnNumber: 25
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 359,
							columnNumber: 21
						}, this),
						/* @__PURE__ */ _jsxDEV("div", {
							style: {
								paddingTop: "1.5rem",
								borderTop: "1px solid #f0f0f0",
								marginBottom: "1.5rem"
							},
							children: [/* @__PURE__ */ _jsxDEV("h4", {
								style: {
									margin: "0 0 1rem",
									fontSize: "1.05rem",
									fontWeight: "600",
									color: "#333"
								},
								children: "Product Details"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 400,
								columnNumber: 25
							}, this), /* @__PURE__ */ _jsxDEV("p", {
								style: {
									fontSize: "0.95rem",
									margin: 0,
									lineHeight: "1.7",
									color: "#555"
								},
								children: product.description
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 401,
								columnNumber: 25
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 399,
							columnNumber: 21
						}, this),
						/* @__PURE__ */ _jsxDEV("div", {
							className: "spec-accordion",
							children: [
								/* @__PURE__ */ _jsxDEV("div", {
									className: "acc-item",
									children: [/* @__PURE__ */ _jsxDEV("button", {
										className: "acc-header",
										onClick: () => toggleTab("specs"),
										children: [/* @__PURE__ */ _jsxDEV("span", { children: "Fabric & Composition" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 408,
											columnNumber: 33
										}, this), /* @__PURE__ */ _jsxDEV("span", {
											className: `acc-icon ${openTabs.specs ? "open" : ""}`,
											children: "▼"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 409,
											columnNumber: 33
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 407,
										columnNumber: 29
									}, this), /* @__PURE__ */ _jsxDEV("div", {
										className: "acc-content",
										style: { maxHeight: openTabs.specs ? "200px" : "0" },
										children: /* @__PURE__ */ _jsxDEV("div", {
											className: "acc-content-inner",
											children: "Crafted with high-grade premium georgette and fine silk weaves. Features dual hand-embroidered silver Resham work on cuffs and collar templates. Dry clean is recommended to preserve premium sheen and fiber lock."
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 412,
											columnNumber: 33
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 411,
										columnNumber: 29
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 406,
									columnNumber: 25
								}, this),
								/* @__PURE__ */ _jsxDEV("div", {
									className: "acc-item",
									children: [/* @__PURE__ */ _jsxDEV("button", {
										className: "acc-header",
										onClick: () => toggleTab("shipping"),
										children: [/* @__PURE__ */ _jsxDEV("span", { children: "Shipping & Return policy" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 420,
											columnNumber: 33
										}, this), /* @__PURE__ */ _jsxDEV("span", {
											className: `acc-icon ${openTabs.shipping ? "open" : ""}`,
											children: "▼"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 421,
											columnNumber: 33
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 419,
										columnNumber: 29
									}, this), /* @__PURE__ */ _jsxDEV("div", {
										className: "acc-content",
										style: { maxHeight: openTabs.shipping ? "200px" : "0" },
										children: /* @__PURE__ */ _jsxDEV("div", {
											className: "acc-content-inner",
											children: "Dispatched within 24 to 48 hours for swift local delivery. Delivery timelines scale from 3 to 7 working days. Free standard domestic returns are honored within 7 days from placement if tags are kept intact."
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 424,
											columnNumber: 33
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 423,
										columnNumber: 29
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 418,
									columnNumber: 25
								}, this),
								/* @__PURE__ */ _jsxDEV("div", {
									className: "acc-item",
									children: [/* @__PURE__ */ _jsxDEV("button", {
										className: "acc-header",
										onClick: () => toggleTab("sizeGuide"),
										children: [/* @__PURE__ */ _jsxDEV("span", { children: "Sizing & Fit guide" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 432,
											columnNumber: 33
										}, this), /* @__PURE__ */ _jsxDEV("span", {
											className: `acc-icon ${openTabs.sizeGuide ? "open" : ""}`,
											children: "▼"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 433,
											columnNumber: 33
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 431,
										columnNumber: 29
									}, this), /* @__PURE__ */ _jsxDEV("div", {
										className: "acc-content",
										style: { maxHeight: openTabs.sizeGuide ? "200px" : "0" },
										children: /* @__PURE__ */ _jsxDEV("div", {
											className: "acc-content-inner",
											children: "Runs standard size. We suggest choosing chest sizes mapping to your current fitted garments. Regular relaxed straight cut silhouette. Size configurations available: XS, S, M, L, XL, XXL, XXXL."
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 436,
											columnNumber: 33
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 435,
										columnNumber: 29
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 430,
									columnNumber: 25
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 405,
							columnNumber: 21
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 247,
					columnNumber: 17
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 168,
				columnNumber: 13
			}, this),
			recommendedList.length > 0 && /* @__PURE__ */ _jsxDEV("div", {
				className: "recommended-section",
				children: [
					/* @__PURE__ */ _jsxDEV("h2", {
						style: {
							fontFamily: "var(--font-title)",
							fontSize: "2.2rem",
							marginBottom: "0.5rem",
							textAlign: "center"
						},
						children: "You May Also Like"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 449,
						columnNumber: 21
					}, this),
					/* @__PURE__ */ _jsxDEV("p", {
						style: {
							color: "var(--color-text-light)",
							textAlign: "center",
							marginBottom: "2.5rem",
							fontSize: "1rem"
						},
						children: "Complete your look with our top pastel pairings."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 450,
						columnNumber: 21
					}, this),
					/* @__PURE__ */ _jsxDEV("div", {
						className: "recommendations-grid",
						children: recommendedList.map((item) => /* @__PURE__ */ _jsxDEV(Link, {
							to: `/product/${item.id}`,
							className: "recommended-card",
							onClick: () => window.scrollTo(0, 0),
							children: [/* @__PURE__ */ _jsxDEV("div", {
								className: "recommended-image-wrapper",
								children: [/* @__PURE__ */ _jsxDEV("img", {
									className: "recommended-img",
									src: item.imageUrl,
									alt: item.name,
									onError: (e) => {
										e.target.src = "./images/kurthi_peach.png";
									}
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 455,
									columnNumber: 37
								}, this), /* @__PURE__ */ _jsxDEV("span", {
									className: "recommended-badge",
									children: item.category
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 461,
									columnNumber: 37
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 454,
								columnNumber: 33
							}, this), /* @__PURE__ */ _jsxDEV("div", {
								style: { padding: "0.8rem 0.9rem" },
								children: [/* @__PURE__ */ _jsxDEV("h3", {
									style: {
										fontSize: "0.95rem",
										fontWeight: "500",
										marginBottom: "0.3rem",
										fontFamily: "var(--font-heading)",
										whiteSpace: "nowrap",
										overflow: "hidden",
										textOverflow: "ellipsis"
									},
									children: item.name
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 464,
									columnNumber: 37
								}, this), /* @__PURE__ */ _jsxDEV("span", {
									style: {
										fontSize: "0.95rem",
										color: "var(--color-primary)",
										fontWeight: "600"
									},
									children: ["₹", item.price.toLocaleString("en-IN")]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 465,
									columnNumber: 37
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 463,
								columnNumber: 33
							}, this)]
						}, item.id, true, {
							fileName: _jsxFileName,
							lineNumber: 453,
							columnNumber: 29
						}, this))
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 451,
						columnNumber: 21
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 448,
				columnNumber: 17
			}, this),
			/* @__PURE__ */ _jsxDEV("div", {
				id: "customer-reviews-section",
				style: {
					marginTop: "3.5rem",
					borderTop: "1px solid #eee",
					paddingTop: "2.5rem"
				},
				children: /* @__PURE__ */ _jsxDEV("div", {
					style: {
						display: "flex",
						flexWrap: "wrap",
						gap: "2rem",
						alignItems: "flex-start"
					},
					children: [/* @__PURE__ */ _jsxDEV("div", {
						style: {
							flex: "1 1 280px",
							minWidth: 0,
							width: "100%"
						},
						children: [/* @__PURE__ */ _jsxDEV("h2", {
							style: {
								fontFamily: "var(--font-title)",
								fontSize: "1.75rem",
								marginBottom: "1.2rem"
							},
							children: "Customer Reviews"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 478,
							columnNumber: 25
						}, this), reviews.length === 0 ? /* @__PURE__ */ _jsxDEV("p", {
							style: { color: "#888" },
							children: "Be the first to review this product!"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 480,
							columnNumber: 29
						}, this) : /* @__PURE__ */ _jsxDEV("div", {
							style: {
								display: "flex",
								flexDirection: "column",
								gap: "1.2rem"
							},
							children: reviews.map((rev) => /* @__PURE__ */ _jsxDEV("div", {
								className: "review-card",
								style: {
									padding: "1.2rem",
									backgroundColor: "#fafafa",
									borderRadius: "12px",
									border: "1px solid #f0f0f0"
								},
								children: [
									/* @__PURE__ */ _jsxDEV("div", {
										style: {
											display: "flex",
											justifyContent: "space-between",
											marginBottom: "0.6rem"
										},
										children: [/* @__PURE__ */ _jsxDEV("strong", {
											style: { fontSize: "1rem" },
											children: rev.userName
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 486,
											columnNumber: 45
										}, this), /* @__PURE__ */ _jsxDEV("span", {
											style: {
												color: "#999",
												fontSize: "0.8rem"
											},
											children: new Date(rev.createdAt).toLocaleDateString()
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 487,
											columnNumber: 45
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 485,
										columnNumber: 41
									}, this),
									/* @__PURE__ */ _jsxDEV("div", {
										style: {
											color: "#d4af37",
											marginBottom: "0.6rem",
											letterSpacing: "1px"
										},
										children: ["★".repeat(rev.rating), "☆".repeat(5 - rev.rating)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 489,
										columnNumber: 41
									}, this),
									/* @__PURE__ */ _jsxDEV("p", {
										style: {
											margin: 0,
											color: "#555",
											lineHeight: "1.5",
											fontSize: "0.9rem"
										},
										children: rev.comment
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 492,
										columnNumber: 41
									}, this)
								]
							}, rev.id, true, {
								fileName: _jsxFileName,
								lineNumber: 484,
								columnNumber: 37
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 482,
							columnNumber: 29
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 477,
						columnNumber: 21
					}, this), /* @__PURE__ */ _jsxDEV("div", {
						className: "write-review-card",
						style: {
							flex: "0 0 380px",
							maxWidth: "100%",
							minWidth: 0,
							backgroundColor: "#fffcf9",
							padding: "1.5rem",
							borderRadius: "16px",
							border: "1px solid #faeedd",
							boxSizing: "border-box"
						},
						children: [/* @__PURE__ */ _jsxDEV("h3", {
							style: {
								fontFamily: "var(--font-title)",
								marginBottom: "1.2rem",
								color: "#b97a66",
								fontSize: "1.4rem"
							},
							children: "Write a Review"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 500,
							columnNumber: 25
						}, this), /* @__PURE__ */ _jsxDEV("form", {
							onSubmit: submitReview,
							children: [
								reviewFormError && /* @__PURE__ */ _jsxDEV("div", {
									style: {
										backgroundColor: "#ffebee",
										color: "#c62828",
										padding: "1rem",
										borderRadius: "6px",
										marginBottom: "1.5rem",
										fontSize: "0.9rem"
									},
									children: reviewFormError
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 503,
									columnNumber: 33
								}, this),
								/* @__PURE__ */ _jsxDEV("div", {
									style: { marginBottom: "1.25rem" },
									children: [/* @__PURE__ */ _jsxDEV("label", {
										style: {
											display: "block",
											marginBottom: "0.4rem",
											fontSize: "0.88rem",
											color: "#555",
											fontWeight: "500"
										},
										children: "Rating"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 509,
										columnNumber: 33
									}, this), /* @__PURE__ */ _jsxDEV("div", {
										className: "review-star-rating",
										children: [
											1,
											2,
											3,
											4,
											5
										].map((star) => /* @__PURE__ */ _jsxDEV("span", {
											onClick: () => setRating(star),
											className: `review-star-btn ${star <= rating ? "active" : ""}`,
											children: "★"
										}, star, false, {
											fileName: _jsxFileName,
											lineNumber: 512,
											columnNumber: 41
										}, this))
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 510,
										columnNumber: 33
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 508,
									columnNumber: 29
								}, this),
								/* @__PURE__ */ _jsxDEV("div", {
									style: { marginBottom: "1.25rem" },
									children: [/* @__PURE__ */ _jsxDEV("label", {
										style: {
											display: "block",
											marginBottom: "0.4rem",
											fontSize: "0.88rem",
											color: "#555",
											fontWeight: "500"
										},
										children: "Your Review"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 524,
										columnNumber: 33
									}, this), /* @__PURE__ */ _jsxDEV("textarea", {
										rows: "4",
										className: "review-textarea",
										placeholder: "What did you like about this product? Share your experience with fit, fabric & style...",
										value: comment,
										onChange: (e) => setComment(e.target.value),
										required: true
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 525,
										columnNumber: 33
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 523,
									columnNumber: 29
								}, this),
								/* @__PURE__ */ _jsxDEV("button", {
									type: "submit",
									className: "review-submit-btn",
									disabled: reviewLoading,
									children: reviewLoading ? "Submitting Review..." : "Submit Review"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 535,
									columnNumber: 29
								}, this),
								!authUser && /* @__PURE__ */ _jsxDEV("p", {
									style: {
										fontSize: "0.8rem",
										color: "#888",
										marginTop: "1rem",
										textAlign: "center"
									},
									children: [
										"You will review as a guest. ",
										/* @__PURE__ */ _jsxDEV(Link, {
											to: "/auth",
											style: { color: "var(--color-peach)" },
											children: "Sign in"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 544,
											columnNumber: 65
										}, this),
										" to link this to your profile."
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 543,
									columnNumber: 33
								}, this)
							]
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
					lineNumber: 475,
					columnNumber: 17
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 474,
				columnNumber: 13
			}, this),
			/* @__PURE__ */ _jsxDEV("div", {
				className: "mobile-sticky-action-bar",
				children: [/* @__PURE__ */ _jsxDEV("button", {
					type: "button",
					onClick: () => toggleWishlist && toggleWishlist(product),
					className: "mobile-sticky-wish-btn",
					style: {
						border: isWished ? "2px solid #e53935" : "1.5px solid #ddd",
						backgroundColor: isWished ? "#fff5f5" : "#fff",
						color: isWished ? "#e53935" : "#444"
					},
					children: /* @__PURE__ */ _jsxDEV("svg", {
						width: "20",
						height: "20",
						viewBox: "0 0 24 24",
						fill: isWished ? "#e53935" : "none",
						stroke: isWished ? "#e53935" : "currentColor",
						strokeWidth: "2",
						children: /* @__PURE__ */ _jsxDEV("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 566,
							columnNumber: 25
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 565,
						columnNumber: 21
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 555,
					columnNumber: 17
				}, this), /* @__PURE__ */ _jsxDEV("button", {
					className: "btn btn-primary mobile-sticky-add-btn",
					onClick: handleAddToCart,
					disabled: !selectedSize,
					children: selectedSize ? `Add to Cart ${quantity > 1 ? `(${quantity})` : ""} - ₹${(product.price * quantity).toLocaleString("en-IN")}` : "Out of Stock"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 569,
					columnNumber: 17
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 554,
				columnNumber: 13
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 165,
		columnNumber: 9
	}, this);
};
_s(ProductDetails, "zFVE69jBF7sz2/see8rjifCgv18=", false, function() {
	return [useParams, useNavigate];
});
_c = ProductDetails;
export default ProductDetails;
var _c;
$RefreshReg$(_c, "ProductDetails");
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;
import * as __vite_react_currentExports from "/src/pages/ProductDetails.jsx";
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }

  const currentExports = __vite_react_currentExports;
  queueMicrotask(() => {
    RefreshRuntime.registerExportsForReactRefresh("D:/The Ethnic Touch/frontend/src/pages/ProductDetails.jsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("D:/The Ethnic Touch/frontend/src/pages/ProductDetails.jsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
function $RefreshReg$(type, id) { return RefreshRuntime.register(type, "D:/The Ethnic Touch/frontend/src/pages/ProductDetails.jsx" + ' ' + id); }
function $RefreshSig$() { return RefreshRuntime.createSignatureFunctionForTransform(); }

//# sourceMappingURL=data:application/json;base64,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VTtLQUNWLFNBQVM7S0FDVCxVQUFVLENBQUM7ZUFFVixlQUFlLGVBQWUsV0FBVyxJQUFJLElBQUksU0FBUyxLQUFLLEdBQUcsT0FBTyxRQUFRLFFBQVEsU0FBUSxDQUFFLGVBQWUsT0FBTyxNQUFNO0lBQzVIOzs7O1lBQ1A7Ozs7OztFQUNKOzs7Ozs7QUFFYjs7Ozs7QUFFQSxlQUFlIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIlByb2R1Y3REZXRhaWxzLmpzeCJdLCJ2ZXJzaW9uIjozLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlU3RhdGUsIHVzZUVmZmVjdCwgdXNlUmVmLCB1c2VNZW1vLCB1c2VDYWxsYmFjayB9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgdXNlTmF2aWdhdGUsIExpbmssIHVzZUxvY2F0aW9uLCB1c2VQYXJhbXMsIFJvdXRlcywgUm91dGUsIE5hdmlnYXRlLCBCcm93c2VyUm91dGVyIH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSc7XHJcbmltcG9ydCBDYXJ0IGZyb20gJy4vQ2FydCc7XHJcbmltcG9ydCBJbWFnZVdpdGhTa2VsZXRvbiBmcm9tICcuLi9jb21wb25lbnRzL0ltYWdlV2l0aFNrZWxldG9uJztcclxuaW1wb3J0IHsgQVBJX0JBU0VfVVJMIH0gZnJvbSAnLi4vZGF0YS9jb25maWcnO1xyXG5cclxuY29uc3QgUHJvZHVjdERldGFpbHMgPSAoeyBwcm9kdWN0cywgYWRkVG9DYXJ0LCB3aXNobGlzdCA9IFtdLCB0b2dnbGVXaXNobGlzdCwgYXV0aFVzZXIgfSkgPT4ge1xyXG4gICAgY29uc3QgeyBpZCB9ID0gdXNlUGFyYW1zKCk7XHJcbiAgICBjb25zdCBuYXZpZ2F0ZSA9IHVzZU5hdmlnYXRlKCk7XHJcbiAgICBjb25zdCBwcm9kdWN0ID0gcHJvZHVjdHMuZmluZChwID0+IHAuaWQgPT09IGlkKTtcclxuXHJcbiAgICBjb25zdCBbYWN0aXZlSW1hZ2UsIHNldEFjdGl2ZUltYWdlXSA9IHVzZVN0YXRlKDApO1xyXG4gICAgY29uc3QgW3NlbGVjdGVkU2l6ZSwgc2V0U2VsZWN0ZWRTaXplXSA9IHVzZVN0YXRlKCcnKTtcclxuICAgIGNvbnN0IFtxdWFudGl0eSwgc2V0UXVhbnRpdHldID0gdXNlU3RhdGUoMSk7XHJcbiAgICBjb25zdCBbcmV2aWV3cywgc2V0UmV2aWV3c10gPSB1c2VTdGF0ZShbXSk7XHJcbiAgICBcclxuICAgIGNvbnN0IFtyYXRpbmcsIHNldFJhdGluZ10gPSB1c2VTdGF0ZSg1KTtcclxuICAgIGNvbnN0IFtjb21tZW50LCBzZXRDb21tZW50XSA9IHVzZVN0YXRlKCcnKTtcclxuICAgIGNvbnN0IFtyZXZpZXdGb3JtRXJyb3IsIHNldFJldmlld0Zvcm1FcnJvcl0gPSB1c2VTdGF0ZSgnJyk7XHJcbiAgICBjb25zdCBbcmV2aWV3TG9hZGluZywgc2V0UmV2aWV3TG9hZGluZ10gPSB1c2VTdGF0ZShmYWxzZSk7XHJcblxyXG4gICAgLy8gQ29sbGFwc2libGUgQWNjb3JkaW9uIFRhYnMgc3RhdGVcclxuICAgIGNvbnN0IFtvcGVuVGFicywgc2V0T3BlblRhYnNdID0gdXNlU3RhdGUoeyBzcGVjczogdHJ1ZSwgc2hpcHBpbmc6IGZhbHNlLCBzaXplR3VpZGU6IGZhbHNlIH0pO1xyXG4gICAgY29uc3QgY2Fyb3VzZWxSZWYgPSB1c2VSZWYobnVsbCk7XHJcbiAgICBcclxuICAgIGNvbnN0IHRvZ2dsZVRhYiA9ICh0YWJLZXkpID0+IHtcclxuICAgICAgICBzZXRPcGVuVGFicyhwcmV2ID0+ICh7IC4uLnByZXYsIFt0YWJLZXldOiAhcHJldlt0YWJLZXldIH0pKTtcclxuICAgIH07XHJcblxyXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgICAgICBpZiAocHJvZHVjdCAmJiBwcm9kdWN0LnNpemVzICYmIHByb2R1Y3Quc2l6ZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAvLyBTZWxlY3QgZmlyc3Qgc2l6ZSB0aGF0IGhhcyBzdG9jayA+IDBcclxuICAgICAgICAgICAgY29uc3QgZmlyc3RBdmFpbGFibGUgPSBwcm9kdWN0LnNpemVzLmZpbmQoc3ogPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc3RrID0gKHByb2R1Y3Quc2l6ZXNTdG9jayAmJiBwcm9kdWN0LnNpemVzU3RvY2tbc3pdICE9PSB1bmRlZmluZWQpID8gcHJvZHVjdC5zaXplc1N0b2NrW3N6XSA6IC0xO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0ayAhPT0gMDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHNldFNlbGVjdGVkU2l6ZShmaXJzdEF2YWlsYWJsZSB8fCAnJyk7XHJcbiAgICAgICAgICAgIHNldEFjdGl2ZUltYWdlKDApOyAvLyByZXNldCBpbWFnZSBpbmRleCBvbiBwcm9kdWN0IGNoYW5nZVxyXG4gICAgICAgICAgICBzZXRRdWFudGl0eSgxKTsgLy8gcmVzZXQgcXVhbnRpdHkgb24gcHJvZHVjdCBjaGFuZ2VcclxuICAgICAgICB9XHJcbiAgICB9LCBbcHJvZHVjdF0pO1xyXG5cclxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgY29udHJvbGxlciA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcclxuICAgICAgICBpZiAocHJvZHVjdCkge1xyXG4gICAgICAgICAgICBmZXRjaChgJHtBUElfQkFTRV9VUkx9L2FwaS9wcm9kdWN0cy8ke3Byb2R1Y3QuaWR9L3Jldmlld3NgLCB7IHNpZ25hbDogY29udHJvbGxlci5zaWduYWwgfSlcclxuICAgICAgICAgICAgICAgIC50aGVuKHJlcyA9PiByZXMuanNvbigpKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkpIHNldFJldmlld3MoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVyci5uYW1lICE9PSAnQWJvcnRFcnJvcicpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIGZldGNoaW5nIHJldmlld3M6XCIsIGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAoKSA9PiBjb250cm9sbGVyLmFib3J0KCk7XHJcbiAgICB9LCBbcHJvZHVjdF0pO1xyXG5cclxuICAgIGlmICghcHJvZHVjdCkgcmV0dXJuIDxkaXYgc3R5bGU9e3twYWRkaW5nOiAnMTByZW0gNSUnLCB0ZXh0QWxpZ246J2NlbnRlcid9fT48aDI+UHJvZHVjdCBOb3QgRm91bmQ8L2gyPjwvZGl2PjtcclxuXHJcbiAgICBjb25zdCBpc1dpc2hlZCA9IHdpc2hsaXN0ID8gd2lzaGxpc3Quc29tZShpdGVtID0+IGl0ZW0uaWQgPT09IHByb2R1Y3QuaWQpIDogZmFsc2U7XHJcblxyXG4gICAgY29uc3QgZ2FsbGVyeUltYWdlcyA9IChwcm9kdWN0LmdhbGxlcnlJbWFnZXMgJiYgcHJvZHVjdC5nYWxsZXJ5SW1hZ2VzLmxlbmd0aCA+IDApIFxyXG4gICAgICAgID8gcHJvZHVjdC5nYWxsZXJ5SW1hZ2VzIFxyXG4gICAgICAgIDogW3Byb2R1Y3QuaW1hZ2VVcmxdO1xyXG5cclxuICAgIGNvbnN0IGhhbmRsZUNhcm91c2VsU2Nyb2xsID0gKCkgPT4ge1xyXG4gICAgICAgIGlmICghY2Fyb3VzZWxSZWYuY3VycmVudCkgcmV0dXJuO1xyXG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGNhcm91c2VsUmVmLmN1cnJlbnQ7XHJcbiAgICAgICAgY29uc3Qgc2xpZGVXaWR0aCA9IGNvbnRhaW5lci5jbGllbnRXaWR0aDtcclxuICAgICAgICBpZiAoc2xpZGVXaWR0aCA+IDApIHtcclxuICAgICAgICAgICAgY29uc3QgbmV3SW5kZXggPSBNYXRoLnJvdW5kKGNvbnRhaW5lci5zY3JvbGxMZWZ0IC8gc2xpZGVXaWR0aCk7XHJcbiAgICAgICAgICAgIGlmIChuZXdJbmRleCAhPT0gYWN0aXZlSW1hZ2UgJiYgbmV3SW5kZXggPj0gMCAmJiBuZXdJbmRleCA8IGdhbGxlcnlJbWFnZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBzZXRBY3RpdmVJbWFnZShuZXdJbmRleCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IGhhbmRsZVRodW1ibmFpbENsaWNrID0gKGluZGV4KSA9PiB7XHJcbiAgICAgICAgc2V0QWN0aXZlSW1hZ2UoaW5kZXgpO1xyXG4gICAgICAgIGlmIChjYXJvdXNlbFJlZi5jdXJyZW50KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGNhcm91c2VsUmVmLmN1cnJlbnQ7XHJcbiAgICAgICAgICAgIGNvbnRhaW5lci5zY3JvbGxUbyh7XHJcbiAgICAgICAgICAgICAgICBsZWZ0OiBpbmRleCAqIGNvbnRhaW5lci5jbGllbnRXaWR0aCxcclxuICAgICAgICAgICAgICAgIGJlaGF2aW9yOiAnc21vb3RoJ1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IG5leHRJbWFnZSA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCBuZXh0SWR4ID0gKGFjdGl2ZUltYWdlICsgMSkgJSBnYWxsZXJ5SW1hZ2VzLmxlbmd0aDtcclxuICAgICAgICBoYW5kbGVUaHVtYm5haWxDbGljayhuZXh0SWR4KTtcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgcHJldkltYWdlID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHByZXZJZHggPSAoYWN0aXZlSW1hZ2UgLSAxICsgZ2FsbGVyeUltYWdlcy5sZW5ndGgpICUgZ2FsbGVyeUltYWdlcy5sZW5ndGg7XHJcbiAgICAgICAgaGFuZGxlVGh1bWJuYWlsQ2xpY2socHJldklkeCk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IGhhbmRsZUJhY2sgPSAoZSkgPT4ge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBpZiAod2luZG93Lmhpc3Rvcnkuc3RhdGUgJiYgd2luZG93Lmhpc3Rvcnkuc3RhdGUuaWR4ID4gMCkge1xyXG4gICAgICAgICAgICBuYXZpZ2F0ZSgtMSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbmF2aWdhdGUoJy9zaG9wJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBzY3JvbGxUb1Jldmlld3MgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3VzdG9tZXItcmV2aWV3cy1zZWN0aW9uJyk7XHJcbiAgICAgICAgaWYgKGVsKSB7XHJcbiAgICAgICAgICAgIGVsLnNjcm9sbEludG9WaWV3KHsgYmVoYXZpb3I6ICdzbW9vdGgnIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgaGFuZGxlQWRkVG9DYXJ0ID0gKCkgPT4ge1xyXG4gICAgICAgIGFkZFRvQ2FydCh7IC4uLnByb2R1Y3QsIHNpemU6IHNlbGVjdGVkU2l6ZSwgcXVhbnRpdHk6IHF1YW50aXR5IH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBzdWJtaXRSZXZpZXcgPSBhc3luYyAoZSkgPT4ge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBzZXRSZXZpZXdGb3JtRXJyb3IoJycpO1xyXG4gICAgICAgIGNvbnN0IHRyaW1tZWRDb21tZW50ID0gY29tbWVudC50cmltKCk7XHJcbiAgICAgICAgaWYgKCF0cmltbWVkQ29tbWVudCkge1xyXG4gICAgICAgICAgICBzZXRSZXZpZXdGb3JtRXJyb3IoJ1BsZWFzZSB3cml0ZSBhIGNvbW1lbnQuJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldFJldmlld0xvYWRpbmcodHJ1ZSk7XHJcbiAgICAgICAgY29uc3QgbmFtZSA9IGF1dGhVc2VyPy5kaXNwbGF5TmFtZSB8fCBhdXRoVXNlcj8uZW1haWw/LnNwbGl0KCdAJylbMF0gfHwgXCJHdWVzdCBSZXZpZXdlclwiO1xyXG4gICAgICAgIGNvbnN0IGVtYWlsID0gYXV0aFVzZXI/LmVtYWlsIHx8IFwiZ3Vlc3RAZXRobmljdG91Y2guY29tXCI7XHJcbiAgICAgICAgY29uc3QgY2xlYW5Db21tZW50ID0gdHJpbW1lZENvbW1lbnQucmVwbGFjZSgvPFtePl0qPj8vZ20sICcnKS5zbGljZSgwLCAxMDAwKTtcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goYCR7QVBJX0JBU0VfVVJMfS9hcGkvcHJvZHVjdHMvJHtwcm9kdWN0LmlkfS9yZXZpZXdzYCwge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSxcclxuICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgdXNlck5hbWU6IG5hbWUsIHVzZXJFbWFpbDogZW1haWwsIHJhdGluZzogcGFyc2VJbnQocmF0aW5nKSwgY29tbWVudDogY2xlYW5Db21tZW50IH0pXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFyZXMub2spIHRocm93IG5ldyBFcnJvcihcIkZhaWxlZCB0byBwb3N0IHJldmlld1wiKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG5ld1JldmlldyA9IGF3YWl0IHJlcy5qc29uKCk7XHJcbiAgICAgICAgICAgIHNldFJldmlld3MocHJldiA9PiBbbmV3UmV2aWV3LCAuLi5wcmV2XSk7XHJcbiAgICAgICAgICAgIHNldENvbW1lbnQoJycpO1xyXG4gICAgICAgICAgICBzZXRSYXRpbmcoNSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgIHNldFJldmlld0Zvcm1FcnJvcignQ291bGQgbm90IHBvc3QgeW91ciByZXZpZXcuIFBsZWFzZSB0cnkgYWdhaW4uJyk7XHJcbiAgICAgICAgfSBmaW5hbGx5IHtcclxuICAgICAgICAgICAgc2V0UmV2aWV3TG9hZGluZyhmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBhdmdSYXRpbmcgPSByZXZpZXdzLmxlbmd0aCA+IDAgXHJcbiAgICAgICAgPyAocmV2aWV3cy5yZWR1Y2UoKGFjYywgcikgPT4gYWNjICsgci5yYXRpbmcsIDApIC8gcmV2aWV3cy5sZW5ndGgpLnRvRml4ZWQoMSkgXHJcbiAgICAgICAgOiAwO1xyXG5cclxuICAgIC8vIEZpbmQgdXAgdG8gNCByZWNvbW1lbmRlZCBwcm9kdWN0cyAoZXhjbHVkaW5nIGN1cnJlbnQgb25lKVxyXG4gICAgY29uc3QgcmVjb21tZW5kZWRMaXN0ID0gcHJvZHVjdHNcclxuICAgICAgICAuZmlsdGVyKHAgPT4gcC5pZCAhPT0gcHJvZHVjdC5pZClcclxuICAgICAgICAuc2xpY2UoMCwgNCk7XHJcblxyXG4gICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInByb2R1Y3QtZGV0YWlscy1wYWdlLWNvbnRhaW5lclwiIHN0eWxlPXt7bWF4V2lkdGg6ICcxMjAwcHgnLCBtYXJnaW46ICcwIGF1dG8nLCBtaW5IZWlnaHQ6ICc4MHZoJ319PlxyXG4gICAgICAgICAgICA8YSBocmVmPVwiI1wiIG9uQ2xpY2s9e2hhbmRsZUJhY2t9IGNsYXNzTmFtZT1cInByb2R1Y3QtZGV0YWlscy1iYWNrLWxpbmtcIiBzdHlsZT17e2Rpc3BsYXk6J2lubGluZS1ibG9jaycsIG1hcmdpbkJvdHRvbTonMS41cmVtJywgY29sb3I6J3ZhcigtLWNvbG9yLXRleHQtbGlnaHQpJywgdGV4dERlY29yYXRpb246J25vbmUnLCB0cmFuc2l0aW9uOidjb2xvciAwLjJzJ319PiZsYXJyOyBCYWNrIHRvIENvbGxlY3Rpb248L2E+XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRlc2t0b3Atc3BsaXQtbGF5b3V0IHByb2R1Y3QtZGV0YWlscy1sYXlvdXRcIiBzdHlsZT17e2dhcDogJzNyZW0nLCBhbGlnbkl0ZW1zOiAnZmxleC1zdGFydCd9fT5cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgey8qIEltYWdlIFNsaWRlciBHYWxsZXJ5ICovfVxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwcm9kdWN0LWdhbGxlcnktbGF5b3V0IHN0aWNreS1vbi1kZXNrdG9wXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgey8qIEdhbGxlcnkgVGh1bWJuYWlscyBMaXN0ICovfVxyXG4gICAgICAgICAgICAgICAgICAgIHtnYWxsZXJ5SW1hZ2VzLmxlbmd0aCA+IDEgJiYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInByb2R1Y3QtdGh1bWJuYWlscy1saXN0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Z2FsbGVyeUltYWdlcy5tYXAoKGltZ1VybCwgaWR4KSA9PiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtpZHh9IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzY3JvbGxUb1NsaWRlKGlkeCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YGdhbGxlcnktdGh1bWJuYWlsICR7YWN0aXZlSW1hZ2UgPT09IGlkeCA/ICdhY3RpdmUnIDogJyd9YH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAnNzBweCcsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAnOTBweCcsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnNnB4JywgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbicsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXI6ICcycHggc29saWQgdHJhbnNwYXJlbnQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmxleFNocmluazogMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEltYWdlV2l0aFNrZWxldG9uIHNyYz17aW1nVXJsfSBhbHQ9e2BUaHVtYm5haWwgJHtpZHgrMX1gfSBzdHlsZT17e3dpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnLCBvYmplY3RGaXQ6ICdjb3Zlcid9fSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICl9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImdhbGxlcnktbWFpbi1jb250YWluZXJcIiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsZXg6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICd2YXIoLS1ib3JkZXItcmFkaXVzLWxnKScsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJveFNoYWRvdzogJzAgMjBweCA0MHB4IHJnYmEoMCwwLDAsMC4wNSknLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOiAnMXJlbScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3BlY3RSYXRpbzogJzMvNCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXhIZWlnaHQ6ICc2NXZoJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJyNmYWZhZmEnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW5XaWR0aDogMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlZj17Y2Fyb3VzZWxSZWZ9IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZ2FsbGVyeS1jYXJvdXNlbC10cmFja1wiIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25TY3JvbGw9e2hhbmRsZUNhcm91c2VsU2Nyb2xsfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Z2FsbGVyeUltYWdlcy5tYXAoKGltZ1VybCwgaWR4KSA9PiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBrZXk9e2lkeH0gY2xhc3NOYW1lPVwiZ2FsbGVyeS1jYXJvdXNlbC1zbGlkZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8SW1hZ2VXaXRoU2tlbGV0b24gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcmM9e2ltZ1VybH0gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbHQ9e2Ake3Byb2R1Y3QubmFtZX0gLSBWaWV3ICR7aWR4ICsgMX1gfSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImdhbGxlcnktc2xpZGUtaW1nXCIgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7Z2FsbGVyeUltYWdlcy5sZW5ndGggPiAxICYmIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxSZWFjdC5GcmFnbWVudD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cInNsaWRlci1uYXYtYnRuIHByZXZcIiBvbkNsaWNrPXtwcmV2SW1hZ2V9IGFyaWEtbGFiZWw9XCJQcmV2aW91cyBpbWFnZVwiPiZsc2FxdW87PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJzbGlkZXItbmF2LWJ0biBuZXh0XCIgb25DbGljaz17bmV4dEltYWdlfSBhcmlhLWxhYmVsPVwiTmV4dCBpbWFnZVwiPiZyc2FxdW87PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzbGlkZXItZG90c1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Z2FsbGVyeUltYWdlcy5tYXAoKF8sIGlkeCkgPT4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk9e2lkeH0gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgc2xpZGVyLWRvdCAke2FjdGl2ZUltYWdlID09PSBpZHggPyAnYWN0aXZlJyA6ICcnfWB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2Nyb2xsVG9TbGlkZShpZHgpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L1JlYWN0LkZyYWdtZW50PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgey8qIFByb2R1Y3QgU3VtbWFyeSAmIEFjdGlvbnMgU2lkZWJhciAqL31cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHJvZHVjdC1zdW1tYXJ5LXBhbmVcIiBzdHlsZT17e2ZsZXg6IDEsIG1pbldpZHRoOiAnMzAwcHgnfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgPGgxIHN0eWxlPXt7Zm9udFNpemU6ICcyLjJyZW0nLCBtYXJnaW46ICcwIDAgMC41cmVtJywgZm9udEZhbWlseTogJ3ZhcigtLWZvbnQtdGl0bGUpJ319Pntwcm9kdWN0Lm5hbWV9PC9oMT5cclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtzY3JvbGxUb1Jldmlld3N9IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBkaXNwbGF5OiAnaW5saW5lLWZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgZ2FwOiAnOHB4JywgbWFyZ2luQm90dG9tOiAnMXJlbScsIGN1cnNvcjogJ3BvaW50ZXInIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPVwiQ2xpY2sgdG8gdmlldyBjdXN0b21lciByZXZpZXdzXCJcclxuICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtyZXZpZXdzLmxlbmd0aCA+IDAgPyAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8UmVhY3QuRnJhZ21lbnQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBjb2xvcjogJyNkNGFmMzcnLCBmb250U2l6ZTogJzEuMXJlbScsIGxldHRlclNwYWNpbmc6ICcxcHgnIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7J+KYhScucmVwZWF0KE1hdGgucm91bmQoYXZnUmF0aW5nKSl9eyfimIYnLnJlcGVhdCg1IC0gTWF0aC5yb3VuZChhdmdSYXRpbmcpKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogJ3ZhcigtLWNvbG9yLXByaW1hcnkpJywgZm9udFNpemU6ICcwLjg1cmVtJywgdGV4dERlY29yYXRpb246ICd1bmRlcmxpbmUnLCBmb250V2VpZ2h0OiAnNTAwJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2F2Z1JhdGluZ30gKHtyZXZpZXdzLmxlbmd0aH0gcmV2aWV3cykgJmRhcnI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9SZWFjdC5GcmFnbWVudD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiAndmFyKC0tY29sb3ItcHJpbWFyeSknLCBmb250U2l6ZTogJzAuODVyZW0nLCB0ZXh0RGVjb3JhdGlvbjogJ3VuZGVybGluZScsIGZvbnRXZWlnaHQ6ICc1MDAnIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5vIHJldmlld3MgeWV0ICZtZGFzaDsgQmUgdGhlIGZpcnN0IHRvIHJldmlldyEgJmRhcnI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tmb250U2l6ZTogJzEuOHJlbScsIGZvbnRXZWlnaHQ6ICc2MDAnLCBtYXJnaW5Cb3R0b206ICcxLjVyZW0nLCBjb2xvcjogJ3ZhcigtLWNvbG9yLXByaW1hcnkpJ319PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICDigrl7cHJvZHVjdC5wcmljZS50b0xvY2FsZVN0cmluZygnZW4tSU4nKX0gPHNwYW4gc3R5bGU9e3tmb250U2l6ZTogJzAuOHJlbScsIGNvbG9yOiAnIzg4OCcsIGZvbnRXZWlnaHQ6ICc0MDAnfX0+KEluY2x1c2l2ZSBvZiBhbGwgdGF4ZXMpPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHsvKiBTaXplIFNlbGVjdG9yICovfVxyXG4gICAgICAgICAgICAgICAgICAgIHtwcm9kdWN0LnNpemVzICYmIHByb2R1Y3Quc2l6ZXMubGVuZ3RoID4gMCAmJiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3ttYXJnaW5Cb3R0b206ICcyLjVyZW0nfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTogJ2ZsZXgnLCBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgbWFyZ2luQm90dG9tOiAnMXJlbSd9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDQgc3R5bGU9e3ttYXJnaW46IDAsIGZvbnRTaXplOiAnMC45NXJlbScsIGZvbnRXZWlnaHQ6ICc2MDAnLCBjb2xvcjogJyMzMzMnfX0+U2VsZWN0IFNpemU8L2g0PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzZWxlY3RlZFNpemUgJiYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17e2ZvbnRTaXplOiAnMC44NXJlbScsIGNvbG9yOiAndmFyKC0tY29sb3ItcHJpbWFyeSknLCBmb250V2VpZ2h0OiAnNTAwJ319PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeygoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcXR5ID0gKHByb2R1Y3Quc2l6ZXNTdG9jayAmJiBwcm9kdWN0LnNpemVzU3RvY2tbc2VsZWN0ZWRTaXplXSAhPT0gdW5kZWZpbmVkKSA/IHByb2R1Y3Quc2l6ZXNTdG9ja1tzZWxlY3RlZFNpemVdIDogLTE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHF0eSA9PT0gMCkgcmV0dXJuICdPdXQgb2YgU3RvY2snO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChxdHkgPiAwICYmIHF0eSA8PSA1KSByZXR1cm4gYE9ubHkgJHtxdHl9IGxlZnQhYDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocXR5ID4gNSkgcmV0dXJuICdJbiBTdG9jayc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OiAnZmxleCcsIGdhcDogJzAuNnJlbScsIGZsZXhXcmFwOiAnd3JhcCd9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7cHJvZHVjdC5zaXplcy5tYXAoKHNpemUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3RvY2tRdHkgPSAocHJvZHVjdC5zaXplc1N0b2NrICYmIHByb2R1Y3Quc2l6ZXNTdG9ja1tzaXplXSAhPT0gdW5kZWZpbmVkKSA/IHByb2R1Y3Quc2l6ZXNTdG9ja1tzaXplXSA6IC0xO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpc0Rpc2FibGVkID0gc3RvY2tRdHkgPT09IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleT17c2l6ZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZD17aXNEaXNhYmxlZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRTZWxlY3RlZFNpemUoc2l6ZSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgc2l6ZS1waWxsICR7c2VsZWN0ZWRTaXplID09PSBzaXplID8gJ2FjdGl2ZScgOiAnJ31gfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPXtpc0Rpc2FibGVkID8gJ091dCBvZiBzdG9jaycgOiAnJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAnMC40NXJlbSAxcmVtJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluV2lkdGg6ICc0MnB4JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAnMzhweCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzhweCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlcjogJzEuNXB4IHNvbGlkICNkZGQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjZmZmJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjNTU1JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogJzYwMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnNvcjogaXNEaXNhYmxlZCA/ICdub3QtYWxsb3dlZCcgOiAncG9pbnRlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAnMC44OHJlbSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzaXplfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgKX1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgey8qIFF1YW50aXR5IFNlbGVjdG9yICovfVxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgbWFyZ2luQm90dG9tOiAnMS41cmVtJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGg0IHN0eWxlPXt7IG1hcmdpbjogJzAgMCAwLjZyZW0nLCBmb250U2l6ZTogJzAuOXJlbScsIGZvbnRXZWlnaHQ6ICc2MDAnLCBjb2xvcjogJyMzMzMnIH19PlF1YW50aXR5PC9oND5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICcxcmVtJywgZmxleFdyYXA6ICd3cmFwJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgYm9yZGVyOiAnMS41cHggc29saWQgI2RkZCcsIGJvcmRlclJhZGl1czogJzhweCcsIG92ZXJmbG93OiAnaGlkZGVuJywgYmFja2dyb3VuZENvbG9yOiAnI2ZhZmFmYScsIGhlaWdodDogJzM2cHgnIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRRdWFudGl0eShwcmV2ID0+IE1hdGgubWF4KDEsIHByZXYgLSAxKSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc2FibGVkPXtxdWFudGl0eSA8PSAxfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPVwiRGVjcmVhc2UgcXVhbnRpdHlcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyB3aWR0aDogJzM0cHgnLCBoZWlnaHQ6ICcxMDAlJywgYm9yZGVyOiAnbm9uZScsIGJhY2tncm91bmQ6ICdub25lJywgY3Vyc29yOiBxdWFudGl0eSA8PSAxID8gJ25vdC1hbGxvd2VkJyA6ICdwb2ludGVyJywgZm9udFNpemU6ICcxcmVtJywgZm9udFdlaWdodDogJ2JvbGQnLCBjb2xvcjogcXVhbnRpdHkgPD0gMSA/ICcjY2NjJyA6ICcjMzMzJywgdHJhbnNpdGlvbjogJ2FsbCAwLjJzJyB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IHdpZHRoOiAnMzZweCcsIHRleHRBbGlnbjogJ2NlbnRlcicsIGZvbnRXZWlnaHQ6ICc2MDAnLCBmb250U2l6ZTogJzAuOXJlbScsIHVzZXJTZWxlY3Q6ICdub25lJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3F1YW50aXR5fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0UXVhbnRpdHkocHJldiA9PiBwcmV2ICsgMSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJJbmNyZWFzZSBxdWFudGl0eVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IHdpZHRoOiAnMzRweCcsIGhlaWdodDogJzEwMCUnLCBib3JkZXI6ICdub25lJywgYmFja2dyb3VuZDogJ25vbmUnLCBjdXJzb3I6ICdwb2ludGVyJywgZm9udFNpemU6ICcxcmVtJywgZm9udFdlaWdodDogJ2JvbGQnLCBjb2xvcjogJyMzMzMnLCB0cmFuc2l0aW9uOiAnYWxsIDAuMnMnIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7cXVhbnRpdHkgPiAxICYmIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGZvbnRTaXplOiAnMC44OHJlbScsIGNvbG9yOiAnIzY2NicsIGZvbnRXZWlnaHQ6ICc1MDAnIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTdWJ0b3RhbDogPHN0cm9uZyBzdHlsZT17eyBjb2xvcjogJ3ZhcigtLWNvbG9yLXByaW1hcnkpJyB9fT7igrl7KHByb2R1Y3QucHJpY2UgKiBxdWFudGl0eSkudG9Mb2NhbGVTdHJpbmcoJ2VuLUlOJyl9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkZXNrdG9wLW9ubHktY3RhXCIgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBnYXA6ICcwLjhyZW0nLCBtYXJnaW5Cb3R0b206ICcxLjVyZW0nLCBmbGV4V3JhcDogJ3dyYXAnIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5XCIgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVBZGRUb0NhcnR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZD17IXNlbGVjdGVkU2l6ZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IGZvbnRTaXplOiAnMC45MnJlbScsIHBhZGRpbmc6ICcwIDEuMjVyZW0nLCBmbGV4OiAxLCBtaW5XaWR0aDogJzE4MHB4JywgaGVpZ2h0OiAnNDRweCcsIGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2VsZWN0ZWRTaXplID8gYEFkZCB0byBDYXJ0ICR7cXVhbnRpdHkgPiAxID8gYCgke3F1YW50aXR5fSlgIDogJyd9IC0gU2l6ZSAke3NlbGVjdGVkU2l6ZX1gIDogJ091dCBvZiBTdG9jayd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gdG9nZ2xlV2lzaGxpc3QgJiYgdG9nZ2xlV2lzaGxpc3QocHJvZHVjdCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZT17aXNXaXNoZWQgPyBcIlJlbW92ZSBmcm9tIHdpc2hsaXN0XCIgOiBcIkFkZCB0byB3aXNobGlzdFwifVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJpYS1sYWJlbD17aXNXaXNoZWQgPyBcIlJlbW92ZSBmcm9tIHdpc2hsaXN0XCIgOiBcIkFkZCB0byB3aXNobGlzdFwifVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6ICc0NHB4JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAnMCAxLjI1cmVtJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICd2YXIoLS1ib3JkZXItcmFkaXVzLXBpbGwsIDUwcHgpJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXI6IGlzV2lzaGVkID8gJzJweCBzb2xpZCAjZTUzOTM1JyA6ICcxLjVweCBzb2xpZCAjZGRkJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGlzV2lzaGVkID8gJyNmZmY1ZjUnIDogJyNmZmYnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBpc1dpc2hlZCA/ICcjZTUzOTM1JyA6ICcjNDQ0JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiAnNjAwJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogJzAuOXJlbScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdhcDogJzZweCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogJ2FsbCAwLjJzIGVhc2UnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsZXhTaHJpbms6IDBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCIxN1wiIGhlaWdodD1cIjE3XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9e2lzV2lzaGVkID8gXCIjZTUzOTM1XCIgOiBcIm5vbmVcIn0gc3Ryb2tlPXtpc1dpc2hlZCA/IFwiI2U1MzkzNVwiIDogXCJjdXJyZW50Q29sb3JcIn0gc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMjAuODQgNC42MWE1LjUgNS41IDAgMCAwLTcuNzggMEwxMiA1LjY3bC0xLjA2LTEuMDZhNS41IDUuNSAwIDAgMC03Ljc4IDcuNzhsMS4wNiAxLjA2TDEyIDIxLjIzbDcuNzgtNy43OCAxLjA2LTEuMDZhNS41IDUuNSAwIDAgMCAwLTcuNzh6XCI+PC9wYXRoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj57aXNXaXNoZWQgPyAnV2lzaGxpc3RlZCcgOiAnV2lzaGxpc3QnfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHsvKiBNb3ZlZCBEZXNjcmlwdGlvbiBCZWxvdyBCdXR0b25zICovfVxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgcGFkZGluZ1RvcDogJzEuNXJlbScsIGJvcmRlclRvcDogJzFweCBzb2xpZCAjZjBmMGYwJywgbWFyZ2luQm90dG9tOiAnMS41cmVtJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGg0IHN0eWxlPXt7IG1hcmdpbjogJzAgMCAxcmVtJywgZm9udFNpemU6ICcxLjA1cmVtJywgZm9udFdlaWdodDogJzYwMCcsIGNvbG9yOiAnIzMzMycgfX0+UHJvZHVjdCBEZXRhaWxzPC9oND5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHAgc3R5bGU9e3tmb250U2l6ZTogJzAuOTVyZW0nLCBtYXJnaW46IDAsIGxpbmVIZWlnaHQ6ICcxLjcnLCBjb2xvcjogJyM1NTUnfX0+e3Byb2R1Y3QuZGVzY3JpcHRpb259PC9wPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICB7LyogUHJlbWl1bSBTcGVjaWZpY2F0aW9ucyBBY2NvcmRpb24gU2VjdGlvbiAqL31cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwZWMtYWNjb3JkaW9uXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWNjLWl0ZW1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYWNjLWhlYWRlclwiIG9uQ2xpY2s9eygpID0+IHRvZ2dsZVRhYignc3BlY3MnKX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+RmFicmljICYgQ29tcG9zaXRpb248L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtgYWNjLWljb24gJHtvcGVuVGFicy5zcGVjcyA/ICdvcGVuJyA6ICcnfWB9PuKWvDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhY2MtY29udGVudFwiIHN0eWxlPXt7IG1heEhlaWdodDogb3BlblRhYnMuc3BlY3MgPyAnMjAwcHgnIDogJzAnIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWNjLWNvbnRlbnQtaW5uZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ3JhZnRlZCB3aXRoIGhpZ2gtZ3JhZGUgcHJlbWl1bSBnZW9yZ2V0dGUgYW5kIGZpbmUgc2lsayB3ZWF2ZXMuIEZlYXR1cmVzIGR1YWwgaGFuZC1lbWJyb2lkZXJlZCBzaWx2ZXIgUmVzaGFtIHdvcmsgb24gY3VmZnMgYW5kIGNvbGxhciB0ZW1wbGF0ZXMuIERyeSBjbGVhbiBpcyByZWNvbW1lbmRlZCB0byBwcmVzZXJ2ZSBwcmVtaXVtIHNoZWVuIGFuZCBmaWJlciBsb2NrLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhY2MtaXRlbVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJhY2MtaGVhZGVyXCIgb25DbGljaz17KCkgPT4gdG9nZ2xlVGFiKCdzaGlwcGluZycpfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj5TaGlwcGluZyAmIFJldHVybiBwb2xpY3k8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtgYWNjLWljb24gJHtvcGVuVGFicy5zaGlwcGluZyA/ICdvcGVuJyA6ICcnfWB9PuKWvDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhY2MtY29udGVudFwiIHN0eWxlPXt7IG1heEhlaWdodDogb3BlblRhYnMuc2hpcHBpbmcgPyAnMjAwcHgnIDogJzAnIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWNjLWNvbnRlbnQtaW5uZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRGlzcGF0Y2hlZCB3aXRoaW4gMjQgdG8gNDggaG91cnMgZm9yIHN3aWZ0IGxvY2FsIGRlbGl2ZXJ5LiBEZWxpdmVyeSB0aW1lbGluZXMgc2NhbGUgZnJvbSAzIHRvIDcgd29ya2luZyBkYXlzLiBGcmVlIHN0YW5kYXJkIGRvbWVzdGljIHJldHVybnMgYXJlIGhvbm9yZWQgd2l0aGluIDcgZGF5cyBmcm9tIHBsYWNlbWVudCBpZiB0YWdzIGFyZSBrZXB0IGludGFjdC5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWNjLWl0ZW1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYWNjLWhlYWRlclwiIG9uQ2xpY2s9eygpID0+IHRvZ2dsZVRhYignc2l6ZUd1aWRlJyl9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPlNpemluZyAmIEZpdCBndWlkZTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2BhY2MtaWNvbiAke29wZW5UYWJzLnNpemVHdWlkZSA/ICdvcGVuJyA6ICcnfWB9PuKWvDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhY2MtY29udGVudFwiIHN0eWxlPXt7IG1heEhlaWdodDogb3BlblRhYnMuc2l6ZUd1aWRlID8gJzIwMHB4JyA6ICcwJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFjYy1jb250ZW50LWlubmVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJ1bnMgc3RhbmRhcmQgc2l6ZS4gV2Ugc3VnZ2VzdCBjaG9vc2luZyBjaGVzdCBzaXplcyBtYXBwaW5nIHRvIHlvdXIgY3VycmVudCBmaXR0ZWQgZ2FybWVudHMuIFJlZ3VsYXIgcmVsYXhlZCBzdHJhaWdodCBjdXQgc2lsaG91ZXR0ZS4gU2l6ZSBjb25maWd1cmF0aW9ucyBhdmFpbGFibGU6IFhTLCBTLCBNLCBMLCBYTCwgWFhMLCBYWFhMLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIHsvKiBSZWNvbW1lbmRlZCBQcm9kdWN0cyBDYXJvdXNlbCBTZWN0aW9uICovfVxyXG4gICAgICAgICAgICB7cmVjb21tZW5kZWRMaXN0Lmxlbmd0aCA+IDAgJiYgKFxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWNvbW1lbmRlZC1zZWN0aW9uXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGgyIHN0eWxlPXt7Zm9udEZhbWlseTogJ3ZhcigtLWZvbnQtdGl0bGUpJywgZm9udFNpemU6ICcyLjJyZW0nLCBtYXJnaW5Cb3R0b206ICcwLjVyZW0nLCB0ZXh0QWxpZ246ICdjZW50ZXInfX0+WW91IE1heSBBbHNvIExpa2U8L2gyPlxyXG4gICAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPXt7Y29sb3I6ICd2YXIoLS1jb2xvci10ZXh0LWxpZ2h0KScsIHRleHRBbGlnbjogJ2NlbnRlcicsIG1hcmdpbkJvdHRvbTogJzIuNXJlbScsIGZvbnRTaXplOiAnMXJlbSd9fT5Db21wbGV0ZSB5b3VyIGxvb2sgd2l0aCBvdXIgdG9wIHBhc3RlbCBwYWlyaW5ncy48L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWNvbW1lbmRhdGlvbnMtZ3JpZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7cmVjb21tZW5kZWRMaXN0Lm1hcChpdGVtID0+IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxMaW5rIHRvPXtgL3Byb2R1Y3QvJHtpdGVtLmlkfWB9IGtleT17aXRlbS5pZH0gY2xhc3NOYW1lPVwicmVjb21tZW5kZWQtY2FyZFwiIG9uQ2xpY2s9eygpID0+IHdpbmRvdy5zY3JvbGxUbygwLCAwKX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWNvbW1lbmRlZC1pbWFnZS13cmFwcGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbWcgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJyZWNvbW1lbmRlZC1pbWdcIiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyYz17aXRlbS5pbWFnZVVybH0gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbHQ9e2l0ZW0ubmFtZX0gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkVycm9yPXsoZSkgPT4geyBlLnRhcmdldC5zcmMgPSAnLi9pbWFnZXMva3VydGhpX3BlYWNoLnBuZyc7IH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInJlY29tbWVuZGVkLWJhZGdlXCI+e2l0ZW0uY2F0ZWdvcnl9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3twYWRkaW5nOiAnMC44cmVtIDAuOXJlbSd9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGgzIHN0eWxlPXt7Zm9udFNpemU6ICcwLjk1cmVtJywgZm9udFdlaWdodDogJzUwMCcsIG1hcmdpbkJvdHRvbTogJzAuM3JlbScsIGZvbnRGYW1pbHk6ICd2YXIoLS1mb250LWhlYWRpbmcpJywgd2hpdGVTcGFjZTogJ25vd3JhcCcsIG92ZXJmbG93OiAnaGlkZGVuJywgdGV4dE92ZXJmbG93OiAnZWxsaXBzaXMnfX0+e2l0ZW0ubmFtZX08L2gzPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17e2ZvbnRTaXplOiAnMC45NXJlbScsIGNvbG9yOiAndmFyKC0tY29sb3ItcHJpbWFyeSknLCBmb250V2VpZ2h0OiAnNjAwJ319PuKCuXtpdGVtLnByaWNlLnRvTG9jYWxlU3RyaW5nKCdlbi1JTicpfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvTGluaz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgKSl9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKX1cclxuXHJcbiAgICAgICAgICAgIHsvKiBDdXN0b21lciBSZXZpZXdzIFNlY3Rpb24gKi99XHJcbiAgICAgICAgICAgIDxkaXYgaWQ9XCJjdXN0b21lci1yZXZpZXdzLXNlY3Rpb25cIiBzdHlsZT17e21hcmdpblRvcDogJzMuNXJlbScsIGJvcmRlclRvcDogJzFweCBzb2xpZCAjZWVlJywgcGFkZGluZ1RvcDogJzIuNXJlbSd9fT5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OiAnZmxleCcsIGZsZXhXcmFwOiAnd3JhcCcsIGdhcDogJzJyZW0nLCBhbGlnbkl0ZW1zOiAnZmxleC1zdGFydCd9fT5cclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZmxleDogJzEgMSAyODBweCcsIG1pbldpZHRoOiAwLCB3aWR0aDogJzEwMCUnfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxoMiBzdHlsZT17e2ZvbnRGYW1pbHk6ICd2YXIoLS1mb250LXRpdGxlKScsIGZvbnRTaXplOiAnMS43NXJlbScsIG1hcmdpbkJvdHRvbTogJzEuMnJlbSd9fT5DdXN0b21lciBSZXZpZXdzPC9oMj5cclxuICAgICAgICAgICAgICAgICAgICAgICAge3Jldmlld3MubGVuZ3RoID09PSAwID8gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHAgc3R5bGU9e3tjb2xvcjogJyM4ODgnfX0+QmUgdGhlIGZpcnN0IHRvIHJldmlldyB0aGlzIHByb2R1Y3QhPC9wPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6ICdmbGV4JywgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsIGdhcDogJzEuMnJlbSd9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7cmV2aWV3cy5tYXAoKHJldikgPT4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGtleT17cmV2LmlkfSBjbGFzc05hbWU9XCJyZXZpZXctY2FyZFwiIHN0eWxlPXt7cGFkZGluZzogJzEuMnJlbScsIGJhY2tncm91bmRDb2xvcjogJyNmYWZhZmEnLCBib3JkZXJSYWRpdXM6ICcxMnB4JywgYm9yZGVyOiAnMXB4IHNvbGlkICNmMGYwZjAnfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTogJ2ZsZXgnLCBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLCBtYXJnaW5Cb3R0b206ICcwLjZyZW0nfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHN0cm9uZyBzdHlsZT17e2ZvbnRTaXplOiAnMXJlbSd9fT57cmV2LnVzZXJOYW1lfTwvc3Ryb25nPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7Y29sb3I6ICcjOTk5JywgZm9udFNpemU6ICcwLjhyZW0nfX0+e25ldyBEYXRlKHJldi5jcmVhdGVkQXQpLnRvTG9jYWxlRGF0ZVN0cmluZygpfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e2NvbG9yOiAnI2Q0YWYzNycsIG1hcmdpbkJvdHRvbTogJzAuNnJlbScsIGxldHRlclNwYWNpbmc6ICcxcHgnfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyfimIUnLnJlcGVhdChyZXYucmF0aW5nKX17J+KYhicucmVwZWF0KDUgLSByZXYucmF0aW5nKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHAgc3R5bGU9e3ttYXJnaW46IDAsIGNvbG9yOiAnIzU1NScsIGxpbmVIZWlnaHQ6ICcxLjUnLCBmb250U2l6ZTogJzAuOXJlbSd9fT57cmV2LmNvbW1lbnR9PC9wPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIndyaXRlLXJldmlldy1jYXJkXCIgc3R5bGU9e3tmbGV4OiAnMCAwIDM4MHB4JywgbWF4V2lkdGg6ICcxMDAlJywgbWluV2lkdGg6IDAsIGJhY2tncm91bmRDb2xvcjogJyNmZmZjZjknLCBwYWRkaW5nOiAnMS41cmVtJywgYm9yZGVyUmFkaXVzOiAnMTZweCcsIGJvcmRlcjogJzFweCBzb2xpZCAjZmFlZWRkJywgYm94U2l6aW5nOiAnYm9yZGVyLWJveCd9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGgzIHN0eWxlPXt7Zm9udEZhbWlseTogJ3ZhcigtLWZvbnQtdGl0bGUpJywgbWFyZ2luQm90dG9tOiAnMS4ycmVtJywgY29sb3I6ICcjYjk3YTY2JywgZm9udFNpemU6ICcxLjRyZW0nfX0+V3JpdGUgYSBSZXZpZXc8L2gzPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybSBvblN1Ym1pdD17c3VibWl0UmV2aWV3fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtyZXZpZXdGb3JtRXJyb3IgJiYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tiYWNrZ3JvdW5kQ29sb3I6ICcjZmZlYmVlJywgY29sb3I6ICcjYzYyODI4JywgcGFkZGluZzogJzFyZW0nLCBib3JkZXJSYWRpdXM6ICc2cHgnLCBtYXJnaW5Cb3R0b206ICcxLjVyZW0nLCBmb250U2l6ZTonMC45cmVtJ319PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7cmV2aWV3Rm9ybUVycm9yfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e21hcmdpbkJvdHRvbTogJzEuMjVyZW0nfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXt7ZGlzcGxheTogJ2Jsb2NrJywgbWFyZ2luQm90dG9tOiAnMC40cmVtJywgZm9udFNpemU6ICcwLjg4cmVtJywgY29sb3I6ICcjNTU1JywgZm9udFdlaWdodDogJzUwMCd9fT5SYXRpbmc8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmV2aWV3LXN0YXItcmF0aW5nXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtbMSwgMiwgMywgNCwgNV0ubWFwKHN0YXIgPT4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtzdGFyfSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRSYXRpbmcoc3Rhcil9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgcmV2aWV3LXN0YXItYnRuICR7c3RhciA8PSByYXRpbmcgPyAnYWN0aXZlJyA6ICcnfWB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg4piFXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e21hcmdpbkJvdHRvbTogJzEuMjVyZW0nfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXt7ZGlzcGxheTogJ2Jsb2NrJywgbWFyZ2luQm90dG9tOiAnMC40cmVtJywgZm9udFNpemU6ICcwLjg4cmVtJywgY29sb3I6ICcjNTU1JywgZm9udFdlaWdodDogJzUwMCd9fT5Zb3VyIFJldmlldzwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRleHRhcmVhIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dzPVwiNFwiIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJyZXZpZXctdGV4dGFyZWFcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIldoYXQgZGlkIHlvdSBsaWtlIGFib3V0IHRoaXMgcHJvZHVjdD8gU2hhcmUgeW91ciBleHBlcmllbmNlIHdpdGggZml0LCBmYWJyaWMgJiBzdHlsZS4uLlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtjb21tZW50fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldENvbW1lbnQoZS50YXJnZXQudmFsdWUpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID48L3RleHRhcmVhPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwic3VibWl0XCIgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicmV2aWV3LXN1Ym1pdC1idG5cIiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZD17cmV2aWV3TG9hZGluZ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7cmV2aWV3TG9hZGluZyA/ICdTdWJtaXR0aW5nIFJldmlldy4uLicgOiAnU3VibWl0IFJldmlldyd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHshYXV0aFVzZXIgJiYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPXt7Zm9udFNpemU6ICcwLjhyZW0nLCBjb2xvcjogJyM4ODgnLCBtYXJnaW5Ub3A6ICcxcmVtJywgdGV4dEFsaWduOiAnY2VudGVyJ319PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBZb3Ugd2lsbCByZXZpZXcgYXMgYSBndWVzdC4gPExpbmsgdG89XCIvYXV0aFwiIHN0eWxlPXt7Y29sb3I6ICd2YXIoLS1jb2xvci1wZWFjaCknfX0+U2lnbiBpbjwvTGluaz4gdG8gbGluayB0aGlzIHRvIHlvdXIgcHJvZmlsZS5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Zvcm0+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgey8qIFN0aWNreSBBY3Rpb24gQmFyIGZvciBNb2JpbGUgVmlldyAqL31cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2JpbGUtc3RpY2t5LWFjdGlvbi1iYXJcIj5cclxuICAgICAgICAgICAgICAgIDxidXR0b24gXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gdG9nZ2xlV2lzaGxpc3QgJiYgdG9nZ2xlV2lzaGxpc3QocHJvZHVjdCl9XHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwibW9iaWxlLXN0aWNreS13aXNoLWJ0blwiXHJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiBpc1dpc2hlZCA/ICcycHggc29saWQgI2U1MzkzNScgOiAnMS41cHggc29saWQgI2RkZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogaXNXaXNoZWQgPyAnI2ZmZjVmNScgOiAnI2ZmZicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBpc1dpc2hlZCA/ICcjZTUzOTM1JyA6ICcjNDQ0J1xyXG4gICAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjIwXCIgaGVpZ2h0PVwiMjBcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD17aXNXaXNoZWQgPyBcIiNlNTM5MzVcIiA6IFwibm9uZVwifSBzdHJva2U9e2lzV2lzaGVkID8gXCIjZTUzOTM1XCIgOiBcImN1cnJlbnRDb2xvclwifSBzdHJva2VXaWR0aD1cIjJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk0yMC44NCA0LjYxYTUuNSA1LjUgMCAwIDAtNy43OCAwTDEyIDUuNjdsLTEuMDYtMS4wNmE1LjUgNS41IDAgMCAwLTcuNzggNy43OGwxLjA2IDEuMDZMMTIgMjEuMjNsNy43OC03Ljc4IDEuMDYtMS4wNmE1LjUgNS41IDAgMCAwIDAtNy43OHpcIj48L3BhdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgIDxidXR0b24gXHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5IG1vYmlsZS1zdGlja3ktYWRkLWJ0blwiIFxyXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e2hhbmRsZUFkZFRvQ2FydH1cclxuICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZD17IXNlbGVjdGVkU2l6ZX1cclxuICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICB7c2VsZWN0ZWRTaXplID8gYEFkZCB0byBDYXJ0ICR7cXVhbnRpdHkgPiAxID8gYCgke3F1YW50aXR5fSlgIDogJyd9IC0g4oK5JHsocHJvZHVjdC5wcmljZSAqIHF1YW50aXR5KS50b0xvY2FsZVN0cmluZygnZW4tSU4nKX1gIDogJ091dCBvZiBTdG9jayd9XHJcbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgUHJvZHVjdERldGFpbHM7XHJcbiJdfQ==