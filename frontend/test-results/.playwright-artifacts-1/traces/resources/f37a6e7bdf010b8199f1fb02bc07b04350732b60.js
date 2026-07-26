import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/pages/Shop.jsx");const React = __vite__cjsImport0_react; const useState = __vite__cjsImport0_react["useState"]; const useEffect = __vite__cjsImport0_react["useEffect"]; const useRef = __vite__cjsImport0_react["useRef"]; const useMemo = __vite__cjsImport0_react["useMemo"]; const useCallback = __vite__cjsImport0_react["useCallback"];const ReactDOM = __vite__cjsImport1_reactDom;const _jsxDEV = __vite__cjsImport8_react_jsxDevRuntime["jsxDEV"];import __vite__cjsImport0_react from "/node_modules/.vite/deps/react.js?v=42a9b196";
import __vite__cjsImport1_reactDom from "/node_modules/.vite/deps/react-dom.js?v=42a9b196";
import { useNavigate, Link, useLocation, useParams, Routes, Route, Navigate, BrowserRouter } from "/node_modules/.vite/deps/react-router-dom.js?v=42a9b196";
import CustomSelect from "/src/components/CustomSelect.jsx";
import FilterSidebarContent from "/src/components/FilterSidebarContent.jsx";
import RenderProductCard from "/src/components/ProductCard.jsx";
import ProductSkeletonGrid from "/src/components/ProductSkeletonGrid.jsx";
import { API_BASE_URL } from "/src/data/config.jsx";
var _jsxFileName = "D:/The Ethnic Touch/frontend/src/pages/Shop.jsx";
import __vite__cjsImport8_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=42a9b196";
var _s = $RefreshSig$();
const Shop = ({ productsGlobal, wishlist, toggleWishlist, globalSearch, setGlobalSearch }) => {
	_s();
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [totalProducts, setTotalProducts] = useState(0);
	const [totalPages, setTotalPages] = useState(1);
	const [currentPage, setCurrentPage] = useState(1);
	const [sort, setSort] = useState("newest");
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [selectedSizes, setSelectedSizes] = useState([]);
	const [selectedFabrics, setSelectedFabrics] = useState([]);
	const [selectedPatterns, setSelectedPatterns] = useState([]);
	const [selectedSleeves, setSelectedSleeves] = useState([]);
	const [selectedOccasions, setSelectedOccasions] = useState([]);
	const [selectedCollections, setSelectedCollections] = useState([]);
	const [selectedColors, setSelectedColors] = useState([]);
	const [onlyNewArrivals, setOnlyNewArrivals] = useState(false);
	const [onlyBestSellers, setOnlyBestSellers] = useState(false);
	const [priceRange, setPriceRange] = useState("all");
	const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();
	const isFirstRender = useRef(true);
	// Map HashRouter query parameters directly to active filter states on load/route updates
	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const category = params.get("category");
		setSelectedCategories(category ? category.split(",") : []);
		const size = params.get("sizes");
		setSelectedSizes(size ? size.split(",") : []);
		const fabric = params.get("fabrics") || params.get("fabric");
		setSelectedFabrics(fabric ? fabric.split(",") : []);
		const pattern = params.get("patterns") || params.get("pattern");
		setSelectedPatterns(pattern ? pattern.split(",") : []);
		const sleeve = params.get("sleeveTypes") || params.get("sleeve_type");
		setSelectedSleeves(sleeve ? sleeve.split(",") : []);
		const occasion = params.get("occasions") || params.get("occasion");
		setSelectedOccasions(occasion ? occasion.split(",") : []);
		const collection = params.get("collection");
		setSelectedCollections(collection ? collection.split(",") : []);
		const colors = params.get("colors");
		setSelectedColors(colors ? colors.split(",") : []);
		setOnlyNewArrivals(params.get("newArrival") === "true");
		setOnlyBestSellers(params.get("bestSeller") === "true");
		const pRange = params.get("priceRange") || params.get("price_range");
		if (pRange) {
			setPriceRange(pRange);
		} else {
			const minP = params.get("minPrice") || params.get("min_price");
			const maxP = params.get("maxPrice") || params.get("max_price");
			if (maxP === "1999") setPriceRange("under_2k");
			else if (minP === "2000" && maxP === "4999") setPriceRange("2k_5k");
			else if (minP === "5000" && maxP === "9999") setPriceRange("5k_10k");
			else if (minP === "10000") setPriceRange("over_10k");
			else setPriceRange("all");
		}
		setCurrentPage(1);
	}, [location.search]);
	// Push local filter state changes to URL to support copy-paste deep links
	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}
		const params = new URLSearchParams();
		if (selectedCategories.length > 0) params.set("category", selectedCategories.join(","));
		if (selectedSizes.length > 0) params.set("sizes", selectedSizes.join(","));
		if (selectedFabrics.length > 0) params.set("fabrics", selectedFabrics.join(","));
		if (selectedPatterns.length > 0) params.set("patterns", selectedPatterns.join(","));
		if (selectedSleeves.length > 0) params.set("sleeveTypes", selectedSleeves.join(","));
		if (selectedOccasions.length > 0) params.set("occasions", selectedOccasions.join(","));
		if (selectedCollections.length > 0) params.set("collection", selectedCollections.join(","));
		if (selectedColors.length > 0) params.set("colors", selectedColors.join(","));
		if (onlyNewArrivals) params.set("newArrival", "true");
		if (onlyBestSellers) params.set("bestSeller", "true");
		if (priceRange && priceRange !== "all") params.set("priceRange", priceRange);
		if (globalSearch.trim()) {
			params.set("q", globalSearch.trim());
		}
		const newSearch = params.toString();
		const currentSearch = location.search.replace(/^\?/, "");
		if (newSearch !== currentSearch) {
			navigate("/shop?" + newSearch, { replace: true });
		}
	}, [
		selectedCategories,
		selectedSizes,
		selectedFabrics,
		selectedPatterns,
		selectedSleeves,
		selectedOccasions,
		selectedCollections,
		selectedColors,
		onlyNewArrivals,
		onlyBestSellers,
		priceRange,
		globalSearch
	]);
	useEffect(() => {
		let active = true;
		const fetchFilteredProducts = async () => {
			setLoading(true);
			const params = new URLSearchParams();
			params.append("paginated", "true");
			params.append("page", currentPage.toString());
			params.append("limit", "8");
			// Map React sort state to Go backend sortBy keys
			let sortByVal = sort;
			if (sort === "rating_desc") sortByVal = "rating";
			params.append("sortBy", sortByVal);
			if (globalSearch.trim()) {
				params.append("q", globalSearch.trim());
			}
			if (selectedCategories.length > 0) {
				params.append("category", selectedCategories.join(","));
			}
			if (selectedSizes.length > 0) {
				params.append("sizes", selectedSizes.join(","));
			}
			if (selectedFabrics.length > 0) {
				params.append("fabrics", selectedFabrics.join(","));
			}
			if (selectedPatterns.length > 0) {
				params.append("patterns", selectedPatterns.join(","));
			}
			if (selectedSleeves.length > 0) {
				params.append("sleeveTypes", selectedSleeves.join(","));
			}
			if (selectedOccasions.length > 0) {
				params.append("occasions", selectedOccasions.join(","));
			}
			if (selectedCollections.length > 0) {
				params.append("collection", selectedCollections.join(","));
			}
			if (selectedColors.length > 0) {
				params.append("colors", selectedColors.join(","));
			}
			if (onlyNewArrivals) params.append("newArrival", "true");
			if (onlyBestSellers) params.append("bestSeller", "true");
			if (priceRange === "under_2k") {
				params.append("maxPrice", "1999");
			} else if (priceRange === "2k_5k") {
				params.append("minPrice", "2000");
				params.append("maxPrice", "4999");
			} else if (priceRange === "5k_10k") {
				params.append("minPrice", "5000");
				params.append("maxPrice", "9999");
			} else if (priceRange === "over_10k") {
				params.append("minPrice", "10000");
			}
			try {
				const res = await fetch(`${API_BASE_URL}/api/products?${params.toString()}`);
				if (!res.ok) throw new Error("HTTP " + res.status);
				const data = await res.json();
				if (active) {
					if (data && Array.isArray(data.products)) {
						setProducts(data.products);
						setTotalProducts(data.total);
						setTotalPages(data.pages);
					} else if (Array.isArray(data)) {
						setProducts(data);
						setTotalProducts(data.length);
						setTotalPages(1);
					}
				}
			} catch (err) {
				console.error("Failed to fetch filtered products, falling back to local filtration:", err);
				if (active && Array.isArray(productsGlobal)) {
					let list = [...productsGlobal];
					if (globalSearch.trim()) {
						const s = globalSearch.toLowerCase();
						list = list.filter((p) => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s) || p.category && p.category.toLowerCase().includes(s) || p.tags && p.tags.toLowerCase().includes(s));
					}
					if (selectedCategories.length > 0) {
						list = list.filter((p) => selectedCategories.includes(p.category));
					}
					if (selectedSizes.length > 0) {
						list = list.filter((p) => p.sizes && p.sizes.some((sz) => selectedSizes.includes(sz)));
					}
					if (selectedFabrics.length > 0) {
						list = list.filter((p) => p.fabric && selectedFabrics.includes(p.fabric));
					}
					if (selectedPatterns.length > 0) {
						list = list.filter((p) => p.pattern && selectedPatterns.includes(p.pattern));
					}
					if (selectedSleeves.length > 0) {
						list = list.filter((p) => p.sleeveType && selectedSleeves.includes(p.sleeveType));
					}
					if (selectedOccasions.length > 0) {
						list = list.filter((p) => p.occasion && selectedOccasions.includes(p.occasion));
					}
					if (selectedCollections.length > 0) {
						list = list.filter((p) => p.collection && selectedCollections.includes(p.collection));
					}
					if (selectedColors.length > 0) {
						list = list.filter((p) => p.color && selectedColors.includes(p.color));
					}
					if (onlyNewArrivals) {
						list = list.filter((p) => p.isNewArrival);
					}
					if (onlyBestSellers) {
						list = list.filter((p) => p.isBestSeller);
					}
					if (priceRange === "under_2k") {
						list = list.filter((p) => p.price <= 1999);
					} else if (priceRange === "2k_5k") {
						list = list.filter((p) => p.price >= 2e3 && p.price <= 4999);
					} else if (priceRange === "5k_10k") {
						list = list.filter((p) => p.price >= 5e3 && p.price <= 9999);
					} else if (priceRange === "over_10k") {
						list = list.filter((p) => p.price >= 1e4);
					}
					if (sort === "price_asc") {
						list.sort((a, b) => a.price - b.price);
					} else if (sort === "price_desc") {
						list.sort((a, b) => b.price - a.price);
					} else if (sort === "rating_desc") {
						list.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
					} else {
						list.sort((a, b) => b.id.localeCompare(a.id));
					}
					const limit = 8;
					const total = list.length;
					const pages = Math.ceil(total / limit) || 1;
					const offset = (currentPage - 1) * limit;
					setProducts(list.slice(offset, offset + limit));
					setTotalProducts(total);
					setTotalPages(pages);
				}
			} finally {
				if (active) setLoading(false);
			}
		};
		fetchFilteredProducts();
		return () => {
			active = false;
		};
	}, [
		currentPage,
		sort,
		selectedCategories,
		selectedSizes,
		selectedFabrics,
		selectedPatterns,
		selectedSleeves,
		selectedOccasions,
		selectedCollections,
		selectedColors,
		onlyNewArrivals,
		onlyBestSellers,
		priceRange,
		globalSearch,
		productsGlobal
	]);
	useEffect(() => {
		setCurrentPage(1);
	}, [
		sort,
		selectedCategories,
		selectedSizes,
		selectedFabrics,
		selectedPatterns,
		selectedSleeves,
		selectedOccasions,
		selectedCollections,
		selectedColors,
		onlyNewArrivals,
		onlyBestSellers,
		priceRange,
		globalSearch
	]);
	const activeChips = [];
	selectedCategories.forEach((c) => activeChips.push({
		label: `Category: ${c}`,
		type: "category",
		value: c
	}));
	selectedSizes.forEach((s) => activeChips.push({
		label: `Size: ${s}`,
		type: "size",
		value: s
	}));
	selectedFabrics.forEach((f) => activeChips.push({
		label: `Fabric: ${f}`,
		type: "fabric",
		value: f
	}));
	selectedPatterns.forEach((p) => activeChips.push({
		label: `Pattern: ${p}`,
		type: "pattern",
		value: p
	}));
	selectedSleeves.forEach((sl) => activeChips.push({
		label: `Sleeve: ${sl}`,
		type: "sleeve",
		value: sl
	}));
	selectedOccasions.forEach((o) => activeChips.push({
		label: `Occasion: ${o}`,
		type: "occasion",
		value: o
	}));
	selectedCollections.forEach((col) => activeChips.push({
		label: `Collection: ${col}`,
		type: "collection",
		value: col
	}));
	selectedColors.forEach((color) => activeChips.push({
		label: `Color: ${color}`,
		type: "colors",
		value: color
	}));
	if (onlyNewArrivals) activeChips.push({
		label: "New Arrivals Only",
		type: "newArrival",
		value: true
	});
	if (onlyBestSellers) activeChips.push({
		label: "Best Sellers Only",
		type: "bestSeller",
		value: true
	});
	if (priceRange !== "all") {
		let label = "Price: All";
		if (priceRange === "under_2k") label = "Price: Under ₹2,000";
		else if (priceRange === "2k_5k") label = "Price: ₹2,000 - ₹4,999";
		else if (priceRange === "5k_10k") label = "Price: ₹5,000 - ₹9,999";
		else if (priceRange === "over_10k") label = "Price: ₹10,000+";
		activeChips.push({
			label,
			type: "priceRange",
			value: priceRange
		});
	}
	if (globalSearch.trim()) {
		activeChips.push({
			label: `Search: "${globalSearch}"`,
			type: "search",
			value: globalSearch
		});
	}
	const removeChip = (chip) => {
		if (chip.type === "category") setSelectedCategories((prev) => prev.filter((v) => v !== chip.value));
		else if (chip.type === "size") setSelectedSizes((prev) => prev.filter((v) => v !== chip.value));
		else if (chip.type === "fabric") setSelectedFabrics((prev) => prev.filter((v) => v !== chip.value));
		else if (chip.type === "pattern") setSelectedPatterns((prev) => prev.filter((v) => v !== chip.value));
		else if (chip.type === "sleeve") setSelectedSleeves((prev) => prev.filter((v) => v !== chip.value));
		else if (chip.type === "occasion") setSelectedOccasions((prev) => prev.filter((v) => v !== chip.value));
		else if (chip.type === "collection") setSelectedCollections((prev) => prev.filter((v) => v !== chip.value));
		else if (chip.type === "colors") setSelectedColors((prev) => prev.filter((v) => v !== chip.value));
		else if (chip.type === "newArrival") setOnlyNewArrivals(false);
		else if (chip.type === "bestSeller") setOnlyBestSellers(false);
		else if (chip.type === "priceRange") setPriceRange("all");
		else if (chip.type === "search") setGlobalSearch("");
	};
	const clearAllFilters = () => {
		setSelectedCategories([]);
		setSelectedSizes([]);
		setSelectedFabrics([]);
		setSelectedPatterns([]);
		setSelectedSleeves([]);
		setSelectedOccasions([]);
		setSelectedCollections([]);
		setSelectedColors([]);
		setOnlyNewArrivals(false);
		setOnlyBestSellers(false);
		setPriceRange("all");
		setGlobalSearch("");
	};
	const handlePageChange = (p) => {
		setCurrentPage(p);
		const el = document.getElementById("shop-top-anchor");
		if (el) el.scrollIntoView({ behavior: "smooth" });
	};
	return /* @__PURE__ */ _jsxDEV("div", { children: [
		/* @__PURE__ */ _jsxDEV("span", {
			id: "shop-top-anchor",
			style: {
				display: "block",
				height: "1px"
			}
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 352,
			columnNumber: 13
		}, this),
		/* @__PURE__ */ _jsxDEV("div", {
			className: "catalog-page-container",
			children: [/* @__PURE__ */ _jsxDEV("aside", {
				className: "catalog-sidebar",
				children: /* @__PURE__ */ _jsxDEV("div", {
					style: {
						position: "sticky",
						top: "100px"
					},
					children: [/* @__PURE__ */ _jsxDEV("div", {
						style: {
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							marginBottom: "1.5rem",
							borderBottom: "1px solid #f0efee",
							paddingBottom: "0.5rem"
						},
						children: [/* @__PURE__ */ _jsxDEV("h3", {
							style: {
								textTransform: "uppercase",
								fontSize: "0.85rem",
								fontWeight: "700",
								letterSpacing: "1px"
							},
							children: "Filters"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 359,
							columnNumber: 29
						}, this), activeChips.length > 0 && /* @__PURE__ */ _jsxDEV("button", {
							onClick: clearAllFilters,
							style: {
								background: "none",
								border: "none",
								color: "var(--color-primary)",
								fontSize: "0.8rem",
								fontWeight: "600",
								cursor: "pointer"
							},
							children: "Clear All"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 361,
							columnNumber: 33
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 358,
						columnNumber: 25
					}, this), /* @__PURE__ */ _jsxDEV(FilterSidebarContent, {
						selectedCategories,
						setSelectedCategories,
						selectedSizes,
						setSelectedSizes,
						selectedFabrics,
						setSelectedFabrics,
						selectedPatterns,
						setSelectedPatterns,
						selectedSleeves,
						setSelectedSleeves,
						selectedOccasions,
						setSelectedOccasions,
						selectedCollections,
						setSelectedCollections,
						selectedColors,
						setSelectedColors,
						onlyNewArrivals,
						setOnlyNewArrivals,
						onlyBestSellers,
						setOnlyBestSellers,
						priceRange,
						setPriceRange
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 364,
						columnNumber: 25
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 357,
					columnNumber: 21
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 356,
				columnNumber: 17
			}, this), /* @__PURE__ */ _jsxDEV("main", {
				className: "catalog-main-content",
				children: [
					/* @__PURE__ */ _jsxDEV("div", {
						className: "catalog-toolbar",
						children: [/* @__PURE__ */ _jsxDEV("div", {
							className: "toolbar-info",
							children: [
								"Showing ",
								/* @__PURE__ */ _jsxDEV("strong", { children: products.length }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 384,
									columnNumber: 37
								}, this),
								" of ",
								/* @__PURE__ */ _jsxDEV("strong", { children: totalProducts }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 384,
									columnNumber: 75
								}, this),
								" products"
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 383,
							columnNumber: 25
						}, this), /* @__PURE__ */ _jsxDEV("div", {
							className: "toolbar-actions",
							children: [/* @__PURE__ */ _jsxDEV("button", {
								className: "mobile-filter-trigger",
								onClick: () => setMobileFilterOpen(true),
								children: [/* @__PURE__ */ _jsxDEV("svg", {
									viewBox: "0 0 24 24",
									width: "16",
									height: "16",
									stroke: "currentColor",
									strokeWidth: "2",
									fill: "none",
									children: [
										/* @__PURE__ */ _jsxDEV("line", {
											x1: "4",
											y1: "21",
											x2: "4",
											y2: "14"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 391,
											columnNumber: 131
										}, this),
										/* @__PURE__ */ _jsxDEV("line", {
											x1: "4",
											y1: "10",
											x2: "4",
											y2: "3"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 391,
											columnNumber: 174
										}, this),
										/* @__PURE__ */ _jsxDEV("line", {
											x1: "12",
											y1: "21",
											x2: "12",
											y2: "12"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 391,
											columnNumber: 216
										}, this),
										/* @__PURE__ */ _jsxDEV("line", {
											x1: "12",
											y1: "8",
											x2: "12",
											y2: "3"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 391,
											columnNumber: 261
										}, this),
										/* @__PURE__ */ _jsxDEV("line", {
											x1: "20",
											y1: "21",
											x2: "20",
											y2: "16"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 391,
											columnNumber: 304
										}, this),
										/* @__PURE__ */ _jsxDEV("line", {
											x1: "20",
											y1: "12",
											x2: "20",
											y2: "3"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 391,
											columnNumber: 349
										}, this),
										/* @__PURE__ */ _jsxDEV("line", {
											x1: "1",
											y1: "14",
											x2: "7",
											y2: "14"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 391,
											columnNumber: 393
										}, this),
										/* @__PURE__ */ _jsxDEV("line", {
											x1: "9",
											y1: "8",
											x2: "15",
											y2: "8"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 391,
											columnNumber: 436
										}, this),
										/* @__PURE__ */ _jsxDEV("line", {
											x1: "17",
											y1: "16",
											x2: "23",
											y2: "16"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 391,
											columnNumber: 478
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 391,
									columnNumber: 33
								}, this), /* @__PURE__ */ _jsxDEV("span", { children: "Filters" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 392,
									columnNumber: 33
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 387,
								columnNumber: 29
							}, this), /* @__PURE__ */ _jsxDEV(CustomSelect, {
								value: sort,
								options: [
									{
										value: "newest",
										label: "New Arrivals"
									},
									{
										value: "price_asc",
										label: "Price: Low to High"
									},
									{
										value: "price_desc",
										label: "Price: High to Low"
									},
									{
										value: "rating_desc",
										label: "Top Rated"
									}
								],
								onChange: setSort
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 395,
								columnNumber: 29
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 386,
							columnNumber: 25
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 382,
						columnNumber: 21
					}, this),
					activeChips.length > 0 && /* @__PURE__ */ _jsxDEV("div", {
						className: "active-chips-container",
						children: activeChips.map((chip, idx) => /* @__PURE__ */ _jsxDEV("span", {
							className: "active-chip",
							children: [chip.label, /* @__PURE__ */ _jsxDEV("button", {
								className: "active-chip-remove",
								onClick: () => removeChip(chip),
								children: "×"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 414,
								columnNumber: 37
							}, this)]
						}, idx, true, {
							fileName: _jsxFileName,
							lineNumber: 412,
							columnNumber: 33
						}, this))
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 410,
						columnNumber: 25
					}, this),
					loading ? /* @__PURE__ */ _jsxDEV(ProductSkeletonGrid, { count: 8 }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 422,
						columnNumber: 25
					}, this) : products.length === 0 ? /* @__PURE__ */ _jsxDEV("div", {
						style: {
							textAlign: "center",
							padding: "5rem 0",
							background: "#fff",
							borderRadius: "12px",
							border: "1px solid rgba(0,0,0,0.02)"
						},
						children: [/* @__PURE__ */ _jsxDEV("h3", {
							style: {
								fontFamily: "var(--font-heading)",
								fontWeight: "400",
								marginBottom: "0.5rem"
							},
							children: "No products found"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 425,
							columnNumber: 29
						}, this), /* @__PURE__ */ _jsxDEV("p", {
							style: {
								color: "#8c8883",
								fontSize: "0.95rem"
							},
							children: "Try clearing some filters or searching for something else."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 426,
							columnNumber: 29
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 424,
						columnNumber: 25
					}, this) : /* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("div", {
						className: "product-grid",
						children: products.map((product) => /* @__PURE__ */ _jsxDEV(RenderProductCard, {
							product,
							wishlist,
							toggleWishlist
						}, product.id, false, {
							fileName: _jsxFileName,
							lineNumber: 432,
							columnNumber: 37
						}, this))
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 430,
						columnNumber: 29
					}, this), totalPages > 1 && /* @__PURE__ */ _jsxDEV("div", {
						className: "catalog-pagination",
						children: [
							/* @__PURE__ */ _jsxDEV("button", {
								className: "pagination-btn",
								disabled: currentPage === 1,
								onClick: () => handlePageChange(currentPage - 1),
								children: "←"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 444,
								columnNumber: 37
							}, this),
							Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => /* @__PURE__ */ _jsxDEV("button", {
								className: `pagination-btn ${p === currentPage ? "active" : ""}`,
								onClick: () => handlePageChange(p),
								children: p
							}, p, false, {
								fileName: _jsxFileName,
								lineNumber: 453,
								columnNumber: 41
							}, this)),
							/* @__PURE__ */ _jsxDEV("button", {
								className: "pagination-btn",
								disabled: currentPage === totalPages,
								onClick: () => handlePageChange(currentPage + 1),
								children: "→"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 462,
								columnNumber: 37
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 443,
						columnNumber: 33
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 429,
						columnNumber: 25
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 381,
				columnNumber: 17
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 354,
			columnNumber: 13
		}, this),
		mobileFilterOpen && ReactDOM.createPortal(/* @__PURE__ */ _jsxDEV("div", {
			className: `mobile-filter-drawer ${mobileFilterOpen ? "show" : ""}`,
			children: [/* @__PURE__ */ _jsxDEV("div", {
				className: "mobile-filter-drawer-overlay",
				onClick: () => setMobileFilterOpen(false)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 479,
				columnNumber: 21
			}, this), /* @__PURE__ */ _jsxDEV("div", {
				className: "mobile-filter-drawer-content",
				children: [
					/* @__PURE__ */ _jsxDEV("div", {
						className: "mobile-filter-drawer-header",
						children: [/* @__PURE__ */ _jsxDEV("div", {
							style: {
								display: "flex",
								alignItems: "center",
								gap: "0.6rem"
							},
							children: [
								/* @__PURE__ */ _jsxDEV("svg", {
									width: "18",
									height: "18",
									viewBox: "0 0 24 24",
									fill: "none",
									stroke: "var(--color-primary)",
									strokeWidth: "2",
									children: [
										/* @__PURE__ */ _jsxDEV("line", {
											x1: "4",
											y1: "21",
											x2: "4",
											y2: "14"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 483,
											columnNumber: 139
										}, this),
										/* @__PURE__ */ _jsxDEV("line", {
											x1: "4",
											y1: "10",
											x2: "4",
											y2: "3"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 483,
											columnNumber: 182
										}, this),
										/* @__PURE__ */ _jsxDEV("line", {
											x1: "12",
											y1: "21",
											x2: "12",
											y2: "12"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 483,
											columnNumber: 224
										}, this),
										/* @__PURE__ */ _jsxDEV("line", {
											x1: "12",
											y1: "8",
											x2: "12",
											y2: "3"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 483,
											columnNumber: 269
										}, this),
										/* @__PURE__ */ _jsxDEV("line", {
											x1: "20",
											y1: "21",
											x2: "20",
											y2: "16"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 483,
											columnNumber: 312
										}, this),
										/* @__PURE__ */ _jsxDEV("line", {
											x1: "20",
											y1: "12",
											x2: "20",
											y2: "3"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 483,
											columnNumber: 357
										}, this),
										/* @__PURE__ */ _jsxDEV("line", {
											x1: "1",
											y1: "14",
											x2: "7",
											y2: "14"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 483,
											columnNumber: 401
										}, this),
										/* @__PURE__ */ _jsxDEV("line", {
											x1: "9",
											y1: "8",
											x2: "15",
											y2: "8"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 483,
											columnNumber: 444
										}, this),
										/* @__PURE__ */ _jsxDEV("line", {
											x1: "17",
											y1: "16",
											x2: "23",
											y2: "16"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 483,
											columnNumber: 486
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 483,
									columnNumber: 33
								}, this),
								/* @__PURE__ */ _jsxDEV("span", {
									style: {
										fontFamily: "var(--font-heading)",
										fontSize: "1.25rem",
										fontWeight: "500",
										color: "var(--color-text, #2D2A26)",
										letterSpacing: "0.5px"
									},
									children: "Filters"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 484,
									columnNumber: 33
								}, this),
								activeChips.length > 0 && /* @__PURE__ */ _jsxDEV("span", {
									style: {
										backgroundColor: "var(--color-peach)",
										color: "var(--color-primary)",
										fontSize: "0.72rem",
										fontWeight: "700",
										borderRadius: "12px",
										padding: "2px 8px",
										marginLeft: "4px"
									},
									children: [activeChips.length, " active"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 486,
									columnNumber: 37
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 482,
							columnNumber: 29
						}, this), /* @__PURE__ */ _jsxDEV("div", {
							style: {
								display: "flex",
								alignItems: "center",
								gap: "0.75rem"
							},
							children: [activeChips.length > 0 && /* @__PURE__ */ _jsxDEV("button", {
								onClick: clearAllFilters,
								style: {
									background: "none",
									border: "none",
									color: "#888",
									fontSize: "0.8rem",
									fontWeight: "600",
									cursor: "pointer",
									padding: 0,
									textDecoration: "underline"
								},
								children: "Reset"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 493,
								columnNumber: 37
							}, this), /* @__PURE__ */ _jsxDEV("button", {
								className: "mobile-drawer-close",
								onClick: () => setMobileFilterOpen(false),
								"aria-label": "Close filters",
								children: "×"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 500,
								columnNumber: 33
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 491,
							columnNumber: 29
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 481,
						columnNumber: 25
					}, this),
					/* @__PURE__ */ _jsxDEV("div", {
						className: "mobile-filter-drawer-body",
						children: /* @__PURE__ */ _jsxDEV(FilterSidebarContent, {
							selectedCategories,
							setSelectedCategories,
							selectedSizes,
							setSelectedSizes,
							selectedFabrics,
							setSelectedFabrics,
							selectedPatterns,
							setSelectedPatterns,
							selectedSleeves,
							setSelectedSleeves,
							selectedOccasions,
							setSelectedOccasions,
							selectedCollections,
							setSelectedCollections,
							selectedColors,
							setSelectedColors,
							onlyNewArrivals,
							setOnlyNewArrivals,
							onlyBestSellers,
							setOnlyBestSellers,
							priceRange,
							setPriceRange
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 511,
							columnNumber: 29
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 510,
						columnNumber: 25
					}, this),
					/* @__PURE__ */ _jsxDEV("div", {
						className: "mobile-filter-drawer-footer",
						children: [activeChips.length > 0 && /* @__PURE__ */ _jsxDEV("button", {
							className: "btn btn-outline",
							onClick: clearAllFilters,
							style: {
								padding: "0.85rem 1rem",
								borderRadius: "10px",
								fontSize: "0.88rem",
								fontWeight: "600"
							},
							children: "Reset"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 528,
							columnNumber: 33
						}, this), /* @__PURE__ */ _jsxDEV("button", {
							className: "btn btn-primary",
							onClick: () => setMobileFilterOpen(false),
							style: {
								flex: 1,
								padding: "0.85rem 1rem",
								borderRadius: "10px",
								fontSize: "0.92rem",
								fontWeight: "600",
								letterSpacing: "0.5px"
							},
							children: [
								"Apply Filters (",
								totalProducts,
								")"
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 536,
							columnNumber: 29
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 526,
						columnNumber: 25
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 480,
				columnNumber: 21
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 478,
			columnNumber: 17
		}, this), document.body)
	] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 351,
		columnNumber: 9
	}, this);
};
_s(Shop, "oeQUvRCZNriY7++oNwyz2NiDBQE=", false, function() {
	return [useLocation, useNavigate];
});
_c = Shop;
export default Shop;
var _c;
$RefreshReg$(_c, "Shop");
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;
import * as __vite_react_currentExports from "/src/pages/Shop.jsx";
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }

  const currentExports = __vite_react_currentExports;
  queueMicrotask(() => {
    RefreshRuntime.registerExportsForReactRefresh("D:/The Ethnic Touch/frontend/src/pages/Shop.jsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("D:/The Ethnic Touch/frontend/src/pages/Shop.jsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
function $RefreshReg$(type, id) { return RefreshRuntime.register(type, "D:/The Ethnic Touch/frontend/src/pages/Shop.jsx" + ' ' + id); }
function $RefreshSig$() { return RefreshRuntime.createSignatureFunctionForTransform(); }

//# sourceMappingURL=data:application/json;base64,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UUFBVyxZQUFZO09BQU07aUJBQ2xHO01BRU87Ozs7Z0JBRVosd0JBQUMsVUFBRDtPQUNJLFdBQVU7T0FDVixlQUFlLG9CQUFvQixLQUFLO09BQ3hDLE9BQU87UUFBRSxNQUFNO1FBQUcsU0FBUztRQUFnQixjQUFjO1FBQVEsVUFBVTtRQUFXLFlBQVk7UUFBTyxlQUFlO09BQVE7aUJBSHBJO1FBSUM7UUFDbUI7UUFBYztPQUMxQjs7Ozs7Y0FDUDs7Ozs7O0lBQ0o7Ozs7O1dBQ0o7Ozs7O1lBQ0wsU0FBUyxJQUNiO0NBQ0M7Ozs7O0FBRWI7Ozs7O0FBR0EsZUFBZSIsIm5hbWVzIjpbXSwic291cmNlcyI6WyJTaG9wLmpzeCJdLCJ2ZXJzaW9uIjozLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlU3RhdGUsIHVzZUVmZmVjdCwgdXNlUmVmLCB1c2VNZW1vLCB1c2VDYWxsYmFjayB9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSc7XHJcbmltcG9ydCB7IHVzZU5hdmlnYXRlLCBMaW5rLCB1c2VMb2NhdGlvbiwgdXNlUGFyYW1zLCBSb3V0ZXMsIFJvdXRlLCBOYXZpZ2F0ZSwgQnJvd3NlclJvdXRlciB9IGZyb20gJ3JlYWN0LXJvdXRlci1kb20nO1xyXG5pbXBvcnQgQ3VzdG9tU2VsZWN0IGZyb20gJy4uL2NvbXBvbmVudHMvQ3VzdG9tU2VsZWN0JztcclxuaW1wb3J0IEZpbHRlclNpZGViYXJDb250ZW50IGZyb20gJy4uL2NvbXBvbmVudHMvRmlsdGVyU2lkZWJhckNvbnRlbnQnO1xyXG5pbXBvcnQgUmVuZGVyUHJvZHVjdENhcmQgZnJvbSAnLi4vY29tcG9uZW50cy9Qcm9kdWN0Q2FyZCc7XHJcbmltcG9ydCBQcm9kdWN0U2tlbGV0b25HcmlkIGZyb20gJy4uL2NvbXBvbmVudHMvUHJvZHVjdFNrZWxldG9uR3JpZCc7XHJcbmltcG9ydCB7IEFQSV9CQVNFX1VSTCB9IGZyb20gJy4uL2RhdGEvY29uZmlnJztcclxuXHJcbmNvbnN0IFNob3AgPSAoeyBwcm9kdWN0c0dsb2JhbCwgd2lzaGxpc3QsIHRvZ2dsZVdpc2hsaXN0LCBnbG9iYWxTZWFyY2gsIHNldEdsb2JhbFNlYXJjaCB9KSA9PiB7XHJcbiAgICBjb25zdCBbcHJvZHVjdHMsIHNldFByb2R1Y3RzXSA9IHVzZVN0YXRlKFtdKTtcclxuICAgIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVzZVN0YXRlKHRydWUpO1xyXG4gICAgY29uc3QgW3RvdGFsUHJvZHVjdHMsIHNldFRvdGFsUHJvZHVjdHNdID0gdXNlU3RhdGUoMCk7XHJcbiAgICBjb25zdCBbdG90YWxQYWdlcywgc2V0VG90YWxQYWdlc10gPSB1c2VTdGF0ZSgxKTtcclxuICAgIGNvbnN0IFtjdXJyZW50UGFnZSwgc2V0Q3VycmVudFBhZ2VdID0gdXNlU3RhdGUoMSk7XHJcbiAgICBjb25zdCBbc29ydCwgc2V0U29ydF0gPSB1c2VTdGF0ZSgnbmV3ZXN0Jyk7XHJcblxyXG4gICAgY29uc3QgW3NlbGVjdGVkQ2F0ZWdvcmllcywgc2V0U2VsZWN0ZWRDYXRlZ29yaWVzXSA9IHVzZVN0YXRlKFtdKTtcclxuICAgIGNvbnN0IFtzZWxlY3RlZFNpemVzLCBzZXRTZWxlY3RlZFNpemVzXSA9IHVzZVN0YXRlKFtdKTtcclxuICAgIGNvbnN0IFtzZWxlY3RlZEZhYnJpY3MsIHNldFNlbGVjdGVkRmFicmljc10gPSB1c2VTdGF0ZShbXSk7XHJcbiAgICBjb25zdCBbc2VsZWN0ZWRQYXR0ZXJucywgc2V0U2VsZWN0ZWRQYXR0ZXJuc10gPSB1c2VTdGF0ZShbXSk7XHJcbiAgICBjb25zdCBbc2VsZWN0ZWRTbGVldmVzLCBzZXRTZWxlY3RlZFNsZWV2ZXNdID0gdXNlU3RhdGUoW10pO1xyXG4gICAgY29uc3QgW3NlbGVjdGVkT2NjYXNpb25zLCBzZXRTZWxlY3RlZE9jY2FzaW9uc10gPSB1c2VTdGF0ZShbXSk7XHJcbiAgICBjb25zdCBbc2VsZWN0ZWRDb2xsZWN0aW9ucywgc2V0U2VsZWN0ZWRDb2xsZWN0aW9uc10gPSB1c2VTdGF0ZShbXSk7XHJcbiAgICBjb25zdCBbc2VsZWN0ZWRDb2xvcnMsIHNldFNlbGVjdGVkQ29sb3JzXSA9IHVzZVN0YXRlKFtdKTtcclxuICAgIGNvbnN0IFtvbmx5TmV3QXJyaXZhbHMsIHNldE9ubHlOZXdBcnJpdmFsc10gPSB1c2VTdGF0ZShmYWxzZSk7XHJcbiAgICBjb25zdCBbb25seUJlc3RTZWxsZXJzLCBzZXRPbmx5QmVzdFNlbGxlcnNdID0gdXNlU3RhdGUoZmFsc2UpO1xyXG4gICAgY29uc3QgW3ByaWNlUmFuZ2UsIHNldFByaWNlUmFuZ2VdID0gdXNlU3RhdGUoJ2FsbCcpO1xyXG5cclxuICAgIGNvbnN0IFttb2JpbGVGaWx0ZXJPcGVuLCBzZXRNb2JpbGVGaWx0ZXJPcGVuXSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuICAgIGNvbnN0IGxvY2F0aW9uID0gdXNlTG9jYXRpb24oKTtcclxuICAgIGNvbnN0IG5hdmlnYXRlID0gdXNlTmF2aWdhdGUoKTtcclxuICAgIGNvbnN0IGlzRmlyc3RSZW5kZXIgPSB1c2VSZWYodHJ1ZSk7XHJcblxyXG4gICAgLy8gTWFwIEhhc2hSb3V0ZXIgcXVlcnkgcGFyYW1ldGVycyBkaXJlY3RseSB0byBhY3RpdmUgZmlsdGVyIHN0YXRlcyBvbiBsb2FkL3JvdXRlIHVwZGF0ZXNcclxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyhsb2NhdGlvbi5zZWFyY2gpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IGNhdGVnb3J5ID0gcGFyYW1zLmdldCgnY2F0ZWdvcnknKTtcclxuICAgICAgICBzZXRTZWxlY3RlZENhdGVnb3JpZXMoY2F0ZWdvcnkgPyBjYXRlZ29yeS5zcGxpdCgnLCcpIDogW10pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IHNpemUgPSBwYXJhbXMuZ2V0KCdzaXplcycpO1xyXG4gICAgICAgIHNldFNlbGVjdGVkU2l6ZXMoc2l6ZSA/IHNpemUuc3BsaXQoJywnKSA6IFtdKTtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBmYWJyaWMgPSBwYXJhbXMuZ2V0KCdmYWJyaWNzJykgfHwgcGFyYW1zLmdldCgnZmFicmljJyk7XHJcbiAgICAgICAgc2V0U2VsZWN0ZWRGYWJyaWNzKGZhYnJpYyA/IGZhYnJpYy5zcGxpdCgnLCcpIDogW10pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IHBhdHRlcm4gPSBwYXJhbXMuZ2V0KCdwYXR0ZXJucycpIHx8IHBhcmFtcy5nZXQoJ3BhdHRlcm4nKTtcclxuICAgICAgICBzZXRTZWxlY3RlZFBhdHRlcm5zKHBhdHRlcm4gPyBwYXR0ZXJuLnNwbGl0KCcsJykgOiBbXSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3Qgc2xlZXZlID0gcGFyYW1zLmdldCgnc2xlZXZlVHlwZXMnKSB8fCBwYXJhbXMuZ2V0KCdzbGVldmVfdHlwZScpO1xyXG4gICAgICAgIHNldFNlbGVjdGVkU2xlZXZlcyhzbGVldmUgPyBzbGVldmUuc3BsaXQoJywnKSA6IFtdKTtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBvY2Nhc2lvbiA9IHBhcmFtcy5nZXQoJ29jY2FzaW9ucycpIHx8IHBhcmFtcy5nZXQoJ29jY2FzaW9uJyk7XHJcbiAgICAgICAgc2V0U2VsZWN0ZWRPY2Nhc2lvbnMob2NjYXNpb24gPyBvY2Nhc2lvbi5zcGxpdCgnLCcpIDogW10pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IGNvbGxlY3Rpb24gPSBwYXJhbXMuZ2V0KCdjb2xsZWN0aW9uJyk7XHJcbiAgICAgICAgc2V0U2VsZWN0ZWRDb2xsZWN0aW9ucyhjb2xsZWN0aW9uID8gY29sbGVjdGlvbi5zcGxpdCgnLCcpIDogW10pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IGNvbG9ycyA9IHBhcmFtcy5nZXQoJ2NvbG9ycycpO1xyXG4gICAgICAgIHNldFNlbGVjdGVkQ29sb3JzKGNvbG9ycyA/IGNvbG9ycy5zcGxpdCgnLCcpIDogW10pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHNldE9ubHlOZXdBcnJpdmFscyhwYXJhbXMuZ2V0KCduZXdBcnJpdmFsJykgPT09ICd0cnVlJyk7XHJcbiAgICAgICAgc2V0T25seUJlc3RTZWxsZXJzKHBhcmFtcy5nZXQoJ2Jlc3RTZWxsZXInKSA9PT0gJ3RydWUnKTtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBwUmFuZ2UgPSBwYXJhbXMuZ2V0KCdwcmljZVJhbmdlJykgfHwgcGFyYW1zLmdldCgncHJpY2VfcmFuZ2UnKTtcclxuICAgICAgICBpZiAocFJhbmdlKSB7XHJcbiAgICAgICAgICAgIHNldFByaWNlUmFuZ2UocFJhbmdlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBtaW5QID0gcGFyYW1zLmdldCgnbWluUHJpY2UnKSB8fCBwYXJhbXMuZ2V0KCdtaW5fcHJpY2UnKTtcclxuICAgICAgICAgICAgY29uc3QgbWF4UCA9IHBhcmFtcy5nZXQoJ21heFByaWNlJykgfHwgcGFyYW1zLmdldCgnbWF4X3ByaWNlJyk7XHJcbiAgICAgICAgICAgIGlmIChtYXhQID09PSAnMTk5OScpIHNldFByaWNlUmFuZ2UoJ3VuZGVyXzJrJyk7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKG1pblAgPT09ICcyMDAwJyAmJiBtYXhQID09PSAnNDk5OScpIHNldFByaWNlUmFuZ2UoJzJrXzVrJyk7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKG1pblAgPT09ICc1MDAwJyAmJiBtYXhQID09PSAnOTk5OScpIHNldFByaWNlUmFuZ2UoJzVrXzEwaycpO1xyXG4gICAgICAgICAgICBlbHNlIGlmIChtaW5QID09PSAnMTAwMDAnKSBzZXRQcmljZVJhbmdlKCdvdmVyXzEwaycpO1xyXG4gICAgICAgICAgICBlbHNlIHNldFByaWNlUmFuZ2UoJ2FsbCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBzZXRDdXJyZW50UGFnZSgxKTtcclxuICAgIH0sIFtsb2NhdGlvbi5zZWFyY2hdKTtcclxuXHJcbiAgICAvLyBQdXNoIGxvY2FsIGZpbHRlciBzdGF0ZSBjaGFuZ2VzIHRvIFVSTCB0byBzdXBwb3J0IGNvcHktcGFzdGUgZGVlcCBsaW5rc1xyXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgICAgICBpZiAoaXNGaXJzdFJlbmRlci5jdXJyZW50KSB7XHJcbiAgICAgICAgICAgIGlzRmlyc3RSZW5kZXIuY3VycmVudCA9IGZhbHNlO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBwYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKCk7XHJcbiAgICAgICAgaWYgKHNlbGVjdGVkQ2F0ZWdvcmllcy5sZW5ndGggPiAwKSBwYXJhbXMuc2V0KCdjYXRlZ29yeScsIHNlbGVjdGVkQ2F0ZWdvcmllcy5qb2luKCcsJykpO1xyXG4gICAgICAgIGlmIChzZWxlY3RlZFNpemVzLmxlbmd0aCA+IDApIHBhcmFtcy5zZXQoJ3NpemVzJywgc2VsZWN0ZWRTaXplcy5qb2luKCcsJykpO1xyXG4gICAgICAgIGlmIChzZWxlY3RlZEZhYnJpY3MubGVuZ3RoID4gMCkgcGFyYW1zLnNldCgnZmFicmljcycsIHNlbGVjdGVkRmFicmljcy5qb2luKCcsJykpO1xyXG4gICAgICAgIGlmIChzZWxlY3RlZFBhdHRlcm5zLmxlbmd0aCA+IDApIHBhcmFtcy5zZXQoJ3BhdHRlcm5zJywgc2VsZWN0ZWRQYXR0ZXJucy5qb2luKCcsJykpO1xyXG4gICAgICAgIGlmIChzZWxlY3RlZFNsZWV2ZXMubGVuZ3RoID4gMCkgcGFyYW1zLnNldCgnc2xlZXZlVHlwZXMnLCBzZWxlY3RlZFNsZWV2ZXMuam9pbignLCcpKTtcclxuICAgICAgICBpZiAoc2VsZWN0ZWRPY2Nhc2lvbnMubGVuZ3RoID4gMCkgcGFyYW1zLnNldCgnb2NjYXNpb25zJywgc2VsZWN0ZWRPY2Nhc2lvbnMuam9pbignLCcpKTtcclxuICAgICAgICBpZiAoc2VsZWN0ZWRDb2xsZWN0aW9ucy5sZW5ndGggPiAwKSBwYXJhbXMuc2V0KCdjb2xsZWN0aW9uJywgc2VsZWN0ZWRDb2xsZWN0aW9ucy5qb2luKCcsJykpO1xyXG4gICAgICAgIGlmIChzZWxlY3RlZENvbG9ycy5sZW5ndGggPiAwKSBwYXJhbXMuc2V0KCdjb2xvcnMnLCBzZWxlY3RlZENvbG9ycy5qb2luKCcsJykpO1xyXG4gICAgICAgIGlmIChvbmx5TmV3QXJyaXZhbHMpIHBhcmFtcy5zZXQoJ25ld0Fycml2YWwnLCAndHJ1ZScpO1xyXG4gICAgICAgIGlmIChvbmx5QmVzdFNlbGxlcnMpIHBhcmFtcy5zZXQoJ2Jlc3RTZWxsZXInLCAndHJ1ZScpO1xyXG4gICAgICAgIGlmIChwcmljZVJhbmdlICYmIHByaWNlUmFuZ2UgIT09ICdhbGwnKSBwYXJhbXMuc2V0KCdwcmljZVJhbmdlJywgcHJpY2VSYW5nZSk7XHJcblxyXG4gICAgICAgIGlmIChnbG9iYWxTZWFyY2gudHJpbSgpKSB7XHJcbiAgICAgICAgICAgIHBhcmFtcy5zZXQoJ3EnLCBnbG9iYWxTZWFyY2gudHJpbSgpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG5ld1NlYXJjaCA9IHBhcmFtcy50b1N0cmluZygpO1xyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRTZWFyY2ggPSBsb2NhdGlvbi5zZWFyY2gucmVwbGFjZSgvXlxcPy8sICcnKTtcclxuICAgICAgICBcclxuICAgICAgICBpZiAobmV3U2VhcmNoICE9PSBjdXJyZW50U2VhcmNoKSB7XHJcbiAgICAgICAgICAgIG5hdmlnYXRlKCcvc2hvcD8nICsgbmV3U2VhcmNoLCB7IHJlcGxhY2U6IHRydWUgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSwgW1xyXG4gICAgICAgIHNlbGVjdGVkQ2F0ZWdvcmllcyxcclxuICAgICAgICBzZWxlY3RlZFNpemVzLFxyXG4gICAgICAgIHNlbGVjdGVkRmFicmljcyxcclxuICAgICAgICBzZWxlY3RlZFBhdHRlcm5zLFxyXG4gICAgICAgIHNlbGVjdGVkU2xlZXZlcyxcclxuICAgICAgICBzZWxlY3RlZE9jY2FzaW9ucyxcclxuICAgICAgICBzZWxlY3RlZENvbGxlY3Rpb25zLFxyXG4gICAgICAgIHNlbGVjdGVkQ29sb3JzLFxyXG4gICAgICAgIG9ubHlOZXdBcnJpdmFscyxcclxuICAgICAgICBvbmx5QmVzdFNlbGxlcnMsXHJcbiAgICAgICAgcHJpY2VSYW5nZSxcclxuICAgICAgICBnbG9iYWxTZWFyY2hcclxuICAgIF0pO1xyXG5cclxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICAgICAgbGV0IGFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgZmV0Y2hGaWx0ZXJlZFByb2R1Y3RzID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICBzZXRMb2FkaW5nKHRydWUpO1xyXG4gICAgICAgICAgICBjb25zdCBwYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKCk7XHJcbiAgICAgICAgICAgIHBhcmFtcy5hcHBlbmQoJ3BhZ2luYXRlZCcsICd0cnVlJyk7XHJcbiAgICAgICAgICAgIHBhcmFtcy5hcHBlbmQoJ3BhZ2UnLCBjdXJyZW50UGFnZS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgcGFyYW1zLmFwcGVuZCgnbGltaXQnLCAnOCcpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gTWFwIFJlYWN0IHNvcnQgc3RhdGUgdG8gR28gYmFja2VuZCBzb3J0Qnkga2V5c1xyXG4gICAgICAgICAgICBsZXQgc29ydEJ5VmFsID0gc29ydDtcclxuICAgICAgICAgICAgaWYgKHNvcnQgPT09ICdyYXRpbmdfZGVzYycpIHNvcnRCeVZhbCA9ICdyYXRpbmcnO1xyXG4gICAgICAgICAgICBwYXJhbXMuYXBwZW5kKCdzb3J0QnknLCBzb3J0QnlWYWwpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGdsb2JhbFNlYXJjaC50cmltKCkpIHtcclxuICAgICAgICAgICAgICAgIHBhcmFtcy5hcHBlbmQoJ3EnLCBnbG9iYWxTZWFyY2gudHJpbSgpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHNlbGVjdGVkQ2F0ZWdvcmllcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBwYXJhbXMuYXBwZW5kKCdjYXRlZ29yeScsIHNlbGVjdGVkQ2F0ZWdvcmllcy5qb2luKCcsJykpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChzZWxlY3RlZFNpemVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHBhcmFtcy5hcHBlbmQoJ3NpemVzJywgc2VsZWN0ZWRTaXplcy5qb2luKCcsJykpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChzZWxlY3RlZEZhYnJpY3MubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zLmFwcGVuZCgnZmFicmljcycsIHNlbGVjdGVkRmFicmljcy5qb2luKCcsJykpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChzZWxlY3RlZFBhdHRlcm5zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHBhcmFtcy5hcHBlbmQoJ3BhdHRlcm5zJywgc2VsZWN0ZWRQYXR0ZXJucy5qb2luKCcsJykpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChzZWxlY3RlZFNsZWV2ZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zLmFwcGVuZCgnc2xlZXZlVHlwZXMnLCBzZWxlY3RlZFNsZWV2ZXMuam9pbignLCcpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWRPY2Nhc2lvbnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zLmFwcGVuZCgnb2NjYXNpb25zJywgc2VsZWN0ZWRPY2Nhc2lvbnMuam9pbignLCcpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWRDb2xsZWN0aW9ucy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBwYXJhbXMuYXBwZW5kKCdjb2xsZWN0aW9uJywgc2VsZWN0ZWRDb2xsZWN0aW9ucy5qb2luKCcsJykpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChzZWxlY3RlZENvbG9ycy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBwYXJhbXMuYXBwZW5kKCdjb2xvcnMnLCBzZWxlY3RlZENvbG9ycy5qb2luKCcsJykpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAob25seU5ld0Fycml2YWxzKSBwYXJhbXMuYXBwZW5kKCduZXdBcnJpdmFsJywgJ3RydWUnKTtcclxuICAgICAgICAgICAgaWYgKG9ubHlCZXN0U2VsbGVycykgcGFyYW1zLmFwcGVuZCgnYmVzdFNlbGxlcicsICd0cnVlJyk7XHJcblxyXG4gICAgICAgICAgICBpZiAocHJpY2VSYW5nZSA9PT0gJ3VuZGVyXzJrJykge1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zLmFwcGVuZCgnbWF4UHJpY2UnLCAnMTk5OScpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHByaWNlUmFuZ2UgPT09ICcya181aycpIHtcclxuICAgICAgICAgICAgICAgIHBhcmFtcy5hcHBlbmQoJ21pblByaWNlJywgJzIwMDAnKTtcclxuICAgICAgICAgICAgICAgIHBhcmFtcy5hcHBlbmQoJ21heFByaWNlJywgJzQ5OTknKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChwcmljZVJhbmdlID09PSAnNWtfMTBrJykge1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zLmFwcGVuZCgnbWluUHJpY2UnLCAnNTAwMCcpO1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zLmFwcGVuZCgnbWF4UHJpY2UnLCAnOTk5OScpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHByaWNlUmFuZ2UgPT09ICdvdmVyXzEwaycpIHtcclxuICAgICAgICAgICAgICAgIHBhcmFtcy5hcHBlbmQoJ21pblByaWNlJywgJzEwMDAwJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaChgJHtBUElfQkFTRV9VUkx9L2FwaS9wcm9kdWN0cz8ke3BhcmFtcy50b1N0cmluZygpfWApO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFyZXMub2spIHRocm93IG5ldyBFcnJvcihcIkhUVFAgXCIgKyByZXMuc3RhdHVzKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXMuanNvbigpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZiAoYWN0aXZlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEgJiYgQXJyYXkuaXNBcnJheShkYXRhLnByb2R1Y3RzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRQcm9kdWN0cyhkYXRhLnByb2R1Y3RzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VG90YWxQcm9kdWN0cyhkYXRhLnRvdGFsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VG90YWxQYWdlcyhkYXRhLnBhZ2VzKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0UHJvZHVjdHMoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRvdGFsUHJvZHVjdHMoZGF0YS5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUb3RhbFBhZ2VzKDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRmFpbGVkIHRvIGZldGNoIGZpbHRlcmVkIHByb2R1Y3RzLCBmYWxsaW5nIGJhY2sgdG8gbG9jYWwgZmlsdHJhdGlvbjpcIiwgZXJyKTtcclxuICAgICAgICAgICAgICAgIGlmIChhY3RpdmUgJiYgQXJyYXkuaXNBcnJheShwcm9kdWN0c0dsb2JhbCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbGlzdCA9IFsuLi5wcm9kdWN0c0dsb2JhbF07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChnbG9iYWxTZWFyY2gudHJpbSgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHMgPSBnbG9iYWxTZWFyY2gudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdCA9IGxpc3QuZmlsdGVyKHAgPT4gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwLm5hbWUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhzKSB8fCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHAuZGVzY3JpcHRpb24udG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhzKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKHAuY2F0ZWdvcnkgJiYgcC5jYXRlZ29yeS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHMpKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKHAudGFncyAmJiBwLnRhZ3MudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhzKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZENhdGVnb3JpZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0ID0gbGlzdC5maWx0ZXIocCA9PiBzZWxlY3RlZENhdGVnb3JpZXMuaW5jbHVkZXMocC5jYXRlZ29yeSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWRTaXplcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpc3QgPSBsaXN0LmZpbHRlcihwID0+IHAuc2l6ZXMgJiYgcC5zaXplcy5zb21lKHN6ID0+IHNlbGVjdGVkU2l6ZXMuaW5jbHVkZXMoc3opKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZEZhYnJpY3MubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0ID0gbGlzdC5maWx0ZXIocCA9PiBwLmZhYnJpYyAmJiBzZWxlY3RlZEZhYnJpY3MuaW5jbHVkZXMocC5mYWJyaWMpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkUGF0dGVybnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0ID0gbGlzdC5maWx0ZXIocCA9PiBwLnBhdHRlcm4gJiYgc2VsZWN0ZWRQYXR0ZXJucy5pbmNsdWRlcyhwLnBhdHRlcm4pKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkU2xlZXZlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpc3QgPSBsaXN0LmZpbHRlcihwID0+IHAuc2xlZXZlVHlwZSAmJiBzZWxlY3RlZFNsZWV2ZXMuaW5jbHVkZXMocC5zbGVldmVUeXBlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZE9jY2FzaW9ucy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpc3QgPSBsaXN0LmZpbHRlcihwID0+IHAub2NjYXNpb24gJiYgc2VsZWN0ZWRPY2Nhc2lvbnMuaW5jbHVkZXMocC5vY2Nhc2lvbikpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWRDb2xsZWN0aW9ucy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpc3QgPSBsaXN0LmZpbHRlcihwID0+IHAuY29sbGVjdGlvbiAmJiBzZWxlY3RlZENvbGxlY3Rpb25zLmluY2x1ZGVzKHAuY29sbGVjdGlvbikpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWRDb2xvcnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0ID0gbGlzdC5maWx0ZXIocCA9PiBwLmNvbG9yICYmIHNlbGVjdGVkQ29sb3JzLmluY2x1ZGVzKHAuY29sb3IpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9ubHlOZXdBcnJpdmFscykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0ID0gbGlzdC5maWx0ZXIocCA9PiBwLmlzTmV3QXJyaXZhbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvbmx5QmVzdFNlbGxlcnMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdCA9IGxpc3QuZmlsdGVyKHAgPT4gcC5pc0Jlc3RTZWxsZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByaWNlUmFuZ2UgPT09ICd1bmRlcl8yaycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdCA9IGxpc3QuZmlsdGVyKHAgPT4gcC5wcmljZSA8PSAxOTk5KTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHByaWNlUmFuZ2UgPT09ICcya181aycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdCA9IGxpc3QuZmlsdGVyKHAgPT4gcC5wcmljZSA+PSAyMDAwICYmIHAucHJpY2UgPD0gNDk5OSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChwcmljZVJhbmdlID09PSAnNWtfMTBrJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0ID0gbGlzdC5maWx0ZXIocCA9PiBwLnByaWNlID49IDUwMDAgJiYgcC5wcmljZSA8PSA5OTk5KTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHByaWNlUmFuZ2UgPT09ICdvdmVyXzEwaycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdCA9IGxpc3QuZmlsdGVyKHAgPT4gcC5wcmljZSA+PSAxMDAwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoc29ydCA9PT0gJ3ByaWNlX2FzYycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdC5zb3J0KChhLGIpID0+IGEucHJpY2UgLSBiLnByaWNlKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHNvcnQgPT09ICdwcmljZV9kZXNjJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0LnNvcnQoKGEsYikgPT4gYi5wcmljZSAtIGEucHJpY2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc29ydCA9PT0gJ3JhdGluZ19kZXNjJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0LnNvcnQoKGEsYikgPT4gKGIuYXZnUmF0aW5nIHx8IDApIC0gKGEuYXZnUmF0aW5nIHx8IDApKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0LnNvcnQoKGEsYikgPT4gYi5pZC5sb2NhbGVDb21wYXJlKGEuaWQpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGxpbWl0ID0gODtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0b3RhbCA9IGxpc3QubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhZ2VzID0gTWF0aC5jZWlsKHRvdGFsIC8gbGltaXQpIHx8IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb2Zmc2V0ID0gKGN1cnJlbnRQYWdlIC0gMSkgKiBsaW1pdDtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBzZXRQcm9kdWN0cyhsaXN0LnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgbGltaXQpKTtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUb3RhbFByb2R1Y3RzKHRvdGFsKTtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUb3RhbFBhZ2VzKHBhZ2VzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBmaW5hbGx5IHtcclxuICAgICAgICAgICAgICAgIGlmIChhY3RpdmUpIHNldExvYWRpbmcoZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZmV0Y2hGaWx0ZXJlZFByb2R1Y3RzKCk7XHJcbiAgICAgICAgcmV0dXJuICgpID0+IHsgYWN0aXZlID0gZmFsc2U7IH07XHJcbiAgICB9LCBbY3VycmVudFBhZ2UsIHNvcnQsIHNlbGVjdGVkQ2F0ZWdvcmllcywgc2VsZWN0ZWRTaXplcywgc2VsZWN0ZWRGYWJyaWNzLCBzZWxlY3RlZFBhdHRlcm5zLCBzZWxlY3RlZFNsZWV2ZXMsIHNlbGVjdGVkT2NjYXNpb25zLCBzZWxlY3RlZENvbGxlY3Rpb25zLCBzZWxlY3RlZENvbG9ycywgb25seU5ld0Fycml2YWxzLCBvbmx5QmVzdFNlbGxlcnMsIHByaWNlUmFuZ2UsIGdsb2JhbFNlYXJjaCwgcHJvZHVjdHNHbG9iYWxdKTtcclxuXHJcbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgICAgIHNldEN1cnJlbnRQYWdlKDEpO1xyXG4gICAgfSwgW3NvcnQsIHNlbGVjdGVkQ2F0ZWdvcmllcywgc2VsZWN0ZWRTaXplcywgc2VsZWN0ZWRGYWJyaWNzLCBzZWxlY3RlZFBhdHRlcm5zLCBzZWxlY3RlZFNsZWV2ZXMsIHNlbGVjdGVkT2NjYXNpb25zLCBzZWxlY3RlZENvbGxlY3Rpb25zLCBzZWxlY3RlZENvbG9ycywgb25seU5ld0Fycml2YWxzLCBvbmx5QmVzdFNlbGxlcnMsIHByaWNlUmFuZ2UsIGdsb2JhbFNlYXJjaF0pO1xyXG5cclxuICAgIGNvbnN0IGFjdGl2ZUNoaXBzID0gW107XHJcbiAgICBzZWxlY3RlZENhdGVnb3JpZXMuZm9yRWFjaChjID0+IGFjdGl2ZUNoaXBzLnB1c2goeyBsYWJlbDogYENhdGVnb3J5OiAke2N9YCwgdHlwZTogJ2NhdGVnb3J5JywgdmFsdWU6IGMgfSkpO1xyXG4gICAgc2VsZWN0ZWRTaXplcy5mb3JFYWNoKHMgPT4gYWN0aXZlQ2hpcHMucHVzaCh7IGxhYmVsOiBgU2l6ZTogJHtzfWAsIHR5cGU6ICdzaXplJywgdmFsdWU6IHMgfSkpO1xyXG4gICAgc2VsZWN0ZWRGYWJyaWNzLmZvckVhY2goZiA9PiBhY3RpdmVDaGlwcy5wdXNoKHsgbGFiZWw6IGBGYWJyaWM6ICR7Zn1gLCB0eXBlOiAnZmFicmljJywgdmFsdWU6IGYgfSkpO1xyXG4gICAgc2VsZWN0ZWRQYXR0ZXJucy5mb3JFYWNoKHAgPT4gYWN0aXZlQ2hpcHMucHVzaCh7IGxhYmVsOiBgUGF0dGVybjogJHtwfWAsIHR5cGU6ICdwYXR0ZXJuJywgdmFsdWU6IHAgfSkpO1xyXG4gICAgc2VsZWN0ZWRTbGVldmVzLmZvckVhY2goc2wgPT4gYWN0aXZlQ2hpcHMucHVzaCh7IGxhYmVsOiBgU2xlZXZlOiAke3NsfWAsIHR5cGU6ICdzbGVldmUnLCB2YWx1ZTogc2wgfSkpO1xyXG4gICAgc2VsZWN0ZWRPY2Nhc2lvbnMuZm9yRWFjaChvID0+IGFjdGl2ZUNoaXBzLnB1c2goeyBsYWJlbDogYE9jY2FzaW9uOiAke299YCwgdHlwZTogJ29jY2FzaW9uJywgdmFsdWU6IG8gfSkpO1xyXG4gICAgc2VsZWN0ZWRDb2xsZWN0aW9ucy5mb3JFYWNoKGNvbCA9PiBhY3RpdmVDaGlwcy5wdXNoKHsgbGFiZWw6IGBDb2xsZWN0aW9uOiAke2NvbH1gLCB0eXBlOiAnY29sbGVjdGlvbicsIHZhbHVlOiBjb2wgfSkpO1xyXG4gICAgc2VsZWN0ZWRDb2xvcnMuZm9yRWFjaChjb2xvciA9PiBhY3RpdmVDaGlwcy5wdXNoKHsgbGFiZWw6IGBDb2xvcjogJHtjb2xvcn1gLCB0eXBlOiAnY29sb3JzJywgdmFsdWU6IGNvbG9yIH0pKTtcclxuICAgIGlmIChvbmx5TmV3QXJyaXZhbHMpIGFjdGl2ZUNoaXBzLnB1c2goeyBsYWJlbDogJ05ldyBBcnJpdmFscyBPbmx5JywgdHlwZTogJ25ld0Fycml2YWwnLCB2YWx1ZTogdHJ1ZSB9KTtcclxuICAgIGlmIChvbmx5QmVzdFNlbGxlcnMpIGFjdGl2ZUNoaXBzLnB1c2goeyBsYWJlbDogJ0Jlc3QgU2VsbGVycyBPbmx5JywgdHlwZTogJ2Jlc3RTZWxsZXInLCB2YWx1ZTogdHJ1ZSB9KTtcclxuXHJcbiAgICBpZiAocHJpY2VSYW5nZSAhPT0gJ2FsbCcpIHtcclxuICAgICAgICBsZXQgbGFiZWwgPSAnUHJpY2U6IEFsbCc7XHJcbiAgICAgICAgaWYgKHByaWNlUmFuZ2UgPT09ICd1bmRlcl8yaycpIGxhYmVsID0gJ1ByaWNlOiBVbmRlciDigrkyLDAwMCc7XHJcbiAgICAgICAgZWxzZSBpZiAocHJpY2VSYW5nZSA9PT0gJzJrXzVrJykgbGFiZWwgPSAnUHJpY2U6IOKCuTIsMDAwIC0g4oK5NCw5OTknO1xyXG4gICAgICAgIGVsc2UgaWYgKHByaWNlUmFuZ2UgPT09ICc1a18xMGsnKSBsYWJlbCA9ICdQcmljZTog4oK5NSwwMDAgLSDigrk5LDk5OSc7XHJcbiAgICAgICAgZWxzZSBpZiAocHJpY2VSYW5nZSA9PT0gJ292ZXJfMTBrJykgbGFiZWwgPSAnUHJpY2U6IOKCuTEwLDAwMCsnO1xyXG4gICAgICAgIGFjdGl2ZUNoaXBzLnB1c2goeyBsYWJlbCwgdHlwZTogJ3ByaWNlUmFuZ2UnLCB2YWx1ZTogcHJpY2VSYW5nZSB9KTtcclxuICAgIH1cclxuICAgIGlmIChnbG9iYWxTZWFyY2gudHJpbSgpKSB7XHJcbiAgICAgICAgYWN0aXZlQ2hpcHMucHVzaCh7IGxhYmVsOiBgU2VhcmNoOiBcIiR7Z2xvYmFsU2VhcmNofVwiYCwgdHlwZTogJ3NlYXJjaCcsIHZhbHVlOiBnbG9iYWxTZWFyY2ggfSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcmVtb3ZlQ2hpcCA9IChjaGlwKSA9PiB7XHJcbiAgICAgICAgaWYgKGNoaXAudHlwZSA9PT0gJ2NhdGVnb3J5Jykgc2V0U2VsZWN0ZWRDYXRlZ29yaWVzKHByZXYgPT4gcHJldi5maWx0ZXIodiA9PiB2ICE9PSBjaGlwLnZhbHVlKSk7XHJcbiAgICAgICAgZWxzZSBpZiAoY2hpcC50eXBlID09PSAnc2l6ZScpIHNldFNlbGVjdGVkU2l6ZXMocHJldiA9PiBwcmV2LmZpbHRlcih2ID0+IHYgIT09IGNoaXAudmFsdWUpKTtcclxuICAgICAgICBlbHNlIGlmIChjaGlwLnR5cGUgPT09ICdmYWJyaWMnKSBzZXRTZWxlY3RlZEZhYnJpY3MocHJldiA9PiBwcmV2LmZpbHRlcih2ID0+IHYgIT09IGNoaXAudmFsdWUpKTtcclxuICAgICAgICBlbHNlIGlmIChjaGlwLnR5cGUgPT09ICdwYXR0ZXJuJykgc2V0U2VsZWN0ZWRQYXR0ZXJucyhwcmV2ID0+IHByZXYuZmlsdGVyKHYgPT4gdiAhPT0gY2hpcC52YWx1ZSkpO1xyXG4gICAgICAgIGVsc2UgaWYgKGNoaXAudHlwZSA9PT0gJ3NsZWV2ZScpIHNldFNlbGVjdGVkU2xlZXZlcyhwcmV2ID0+IHByZXYuZmlsdGVyKHYgPT4gdiAhPT0gY2hpcC52YWx1ZSkpO1xyXG4gICAgICAgIGVsc2UgaWYgKGNoaXAudHlwZSA9PT0gJ29jY2FzaW9uJykgc2V0U2VsZWN0ZWRPY2Nhc2lvbnMocHJldiA9PiBwcmV2LmZpbHRlcih2ID0+IHYgIT09IGNoaXAudmFsdWUpKTtcclxuICAgICAgICBlbHNlIGlmIChjaGlwLnR5cGUgPT09ICdjb2xsZWN0aW9uJykgc2V0U2VsZWN0ZWRDb2xsZWN0aW9ucyhwcmV2ID0+IHByZXYuZmlsdGVyKHYgPT4gdiAhPT0gY2hpcC52YWx1ZSkpO1xyXG4gICAgICAgIGVsc2UgaWYgKGNoaXAudHlwZSA9PT0gJ2NvbG9ycycpIHNldFNlbGVjdGVkQ29sb3JzKHByZXYgPT4gcHJldi5maWx0ZXIodiA9PiB2ICE9PSBjaGlwLnZhbHVlKSk7XHJcbiAgICAgICAgZWxzZSBpZiAoY2hpcC50eXBlID09PSAnbmV3QXJyaXZhbCcpIHNldE9ubHlOZXdBcnJpdmFscyhmYWxzZSk7XHJcbiAgICAgICAgZWxzZSBpZiAoY2hpcC50eXBlID09PSAnYmVzdFNlbGxlcicpIHNldE9ubHlCZXN0U2VsbGVycyhmYWxzZSk7XHJcbiAgICAgICAgZWxzZSBpZiAoY2hpcC50eXBlID09PSAncHJpY2VSYW5nZScpIHNldFByaWNlUmFuZ2UoJ2FsbCcpO1xyXG4gICAgICAgIGVsc2UgaWYgKGNoaXAudHlwZSA9PT0gJ3NlYXJjaCcpIHNldEdsb2JhbFNlYXJjaCgnJyk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IGNsZWFyQWxsRmlsdGVycyA9ICgpID0+IHtcclxuICAgICAgICBzZXRTZWxlY3RlZENhdGVnb3JpZXMoW10pO1xyXG4gICAgICAgIHNldFNlbGVjdGVkU2l6ZXMoW10pO1xyXG4gICAgICAgIHNldFNlbGVjdGVkRmFicmljcyhbXSk7XHJcbiAgICAgICAgc2V0U2VsZWN0ZWRQYXR0ZXJucyhbXSk7XHJcbiAgICAgICAgc2V0U2VsZWN0ZWRTbGVldmVzKFtdKTtcclxuICAgICAgICBzZXRTZWxlY3RlZE9jY2FzaW9ucyhbXSk7XHJcbiAgICAgICAgc2V0U2VsZWN0ZWRDb2xsZWN0aW9ucyhbXSk7XHJcbiAgICAgICAgc2V0U2VsZWN0ZWRDb2xvcnMoW10pO1xyXG4gICAgICAgIHNldE9ubHlOZXdBcnJpdmFscyhmYWxzZSk7XHJcbiAgICAgICAgc2V0T25seUJlc3RTZWxsZXJzKGZhbHNlKTtcclxuICAgICAgICBzZXRQcmljZVJhbmdlKCdhbGwnKTtcclxuICAgICAgICBzZXRHbG9iYWxTZWFyY2goJycpO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBoYW5kbGVQYWdlQ2hhbmdlID0gKHApID0+IHtcclxuICAgICAgICBzZXRDdXJyZW50UGFnZShwKTtcclxuICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaG9wLXRvcC1hbmNob3InKTtcclxuICAgICAgICBpZiAoZWwpIGVsLnNjcm9sbEludG9WaWV3KHsgYmVoYXZpb3I6ICdzbW9vdGgnIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIDxzcGFuIGlkPVwic2hvcC10b3AtYW5jaG9yXCIgc3R5bGU9e3sgZGlzcGxheTogJ2Jsb2NrJywgaGVpZ2h0OiAnMXB4JyB9fT48L3NwYW4+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhdGFsb2ctcGFnZS1jb250YWluZXJcIj5cclxuICAgICAgICAgICAgICAgIHsvKiBEZXNrdG9wIFNpZGViYXIgKi99XHJcbiAgICAgICAgICAgICAgICA8YXNpZGUgY2xhc3NOYW1lPVwiY2F0YWxvZy1zaWRlYmFyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBwb3NpdGlvbjogJ3N0aWNreScsIHRvcDogJzEwMHB4JyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBtYXJnaW5Cb3R0b206ICcxLjVyZW0nLCBib3JkZXJCb3R0b206ICcxcHggc29saWQgI2YwZWZlZScsIHBhZGRpbmdCb3R0b206ICcwLjVyZW0nIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGgzIHN0eWxlPXt7IHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnLCBmb250U2l6ZTogJzAuODVyZW0nLCBmb250V2VpZ2h0OiAnNzAwJywgbGV0dGVyU3BhY2luZzogJzFweCcgfX0+RmlsdGVyczwvaDM+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7YWN0aXZlQ2hpcHMubGVuZ3RoID4gMCAmJiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtjbGVhckFsbEZpbHRlcnN9IHN0eWxlPXt7IGJhY2tncm91bmQ6ICdub25lJywgYm9yZGVyOiAnbm9uZScsIGNvbG9yOiAndmFyKC0tY29sb3ItcHJpbWFyeSknLCBmb250U2l6ZTogJzAuOHJlbScsIGZvbnRXZWlnaHQ6ICc2MDAnLCBjdXJzb3I6ICdwb2ludGVyJyB9fT5DbGVhciBBbGw8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8RmlsdGVyU2lkZWJhckNvbnRlbnQgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZENhdGVnb3JpZXM9e3NlbGVjdGVkQ2F0ZWdvcmllc30gc2V0U2VsZWN0ZWRDYXRlZ29yaWVzPXtzZXRTZWxlY3RlZENhdGVnb3JpZXN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZFNpemVzPXtzZWxlY3RlZFNpemVzfSBzZXRTZWxlY3RlZFNpemVzPXtzZXRTZWxlY3RlZFNpemVzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRGYWJyaWNzPXtzZWxlY3RlZEZhYnJpY3N9IHNldFNlbGVjdGVkRmFicmljcz17c2V0U2VsZWN0ZWRGYWJyaWNzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRQYXR0ZXJucz17c2VsZWN0ZWRQYXR0ZXJuc30gc2V0U2VsZWN0ZWRQYXR0ZXJucz17c2V0U2VsZWN0ZWRQYXR0ZXJuc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkU2xlZXZlcz17c2VsZWN0ZWRTbGVldmVzfSBzZXRTZWxlY3RlZFNsZWV2ZXM9e3NldFNlbGVjdGVkU2xlZXZlc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkT2NjYXNpb25zPXtzZWxlY3RlZE9jY2FzaW9uc30gc2V0U2VsZWN0ZWRPY2Nhc2lvbnM9e3NldFNlbGVjdGVkT2NjYXNpb25zfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRDb2xsZWN0aW9ucz17c2VsZWN0ZWRDb2xsZWN0aW9uc30gc2V0U2VsZWN0ZWRDb2xsZWN0aW9ucz17c2V0U2VsZWN0ZWRDb2xsZWN0aW9uc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkQ29sb3JzPXtzZWxlY3RlZENvbG9yc30gc2V0U2VsZWN0ZWRDb2xvcnM9e3NldFNlbGVjdGVkQ29sb3JzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25seU5ld0Fycml2YWxzPXtvbmx5TmV3QXJyaXZhbHN9IHNldE9ubHlOZXdBcnJpdmFscz17c2V0T25seU5ld0Fycml2YWxzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25seUJlc3RTZWxsZXJzPXtvbmx5QmVzdFNlbGxlcnN9IHNldE9ubHlCZXN0U2VsbGVycz17c2V0T25seUJlc3RTZWxsZXJzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2VSYW5nZT17cHJpY2VSYW5nZX0gc2V0UHJpY2VSYW5nZT17c2V0UHJpY2VSYW5nZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvYXNpZGU+XHJcblxyXG4gICAgICAgICAgICAgICAgey8qIE1haW4gQ29udGVudCBBcmVhICovfVxyXG4gICAgICAgICAgICAgICAgPG1haW4gY2xhc3NOYW1lPVwiY2F0YWxvZy1tYWluLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhdGFsb2ctdG9vbGJhclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRvb2xiYXItaW5mb1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgU2hvd2luZyA8c3Ryb25nPntwcm9kdWN0cy5sZW5ndGh9PC9zdHJvbmc+IG9mIDxzdHJvbmc+e3RvdGFsUHJvZHVjdHN9PC9zdHJvbmc+IHByb2R1Y3RzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRvb2xiYXItYWN0aW9uc1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJtb2JpbGUtZmlsdGVyLXRyaWdnZXJcIiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRNb2JpbGVGaWx0ZXJPcGVuKHRydWUpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdmcgdmlld0JveD1cIjAgMCAyNCAyNFwiIHdpZHRoPVwiMTZcIiBoZWlnaHQ9XCIxNlwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZVdpZHRoPVwiMlwiIGZpbGw9XCJub25lXCI+PGxpbmUgeDE9XCI0XCIgeTE9XCIyMVwiIHgyPVwiNFwiIHkyPVwiMTRcIj48L2xpbmU+PGxpbmUgeDE9XCI0XCIgeTE9XCIxMFwiIHgyPVwiNFwiIHkyPVwiM1wiPjwvbGluZT48bGluZSB4MT1cIjEyXCIgeTE9XCIyMVwiIHgyPVwiMTJcIiB5Mj1cIjEyXCI+PC9saW5lPjxsaW5lIHgxPVwiMTJcIiB5MT1cIjhcIiB4Mj1cIjEyXCIgeTI9XCIzXCI+PC9saW5lPjxsaW5lIHgxPVwiMjBcIiB5MT1cIjIxXCIgeDI9XCIyMFwiIHkyPVwiMTZcIj48L2xpbmU+PGxpbmUgeDE9XCIyMFwiIHkxPVwiMTJcIiB4Mj1cIjIwXCIgeTI9XCIzXCI+PC9saW5lPjxsaW5lIHgxPVwiMVwiIHkxPVwiMTRcIiB4Mj1cIjdcIiB5Mj1cIjE0XCI+PC9saW5lPjxsaW5lIHgxPVwiOVwiIHkxPVwiOFwiIHgyPVwiMTVcIiB5Mj1cIjhcIj48L2xpbmU+PGxpbmUgeDE9XCIxN1wiIHkxPVwiMTZcIiB4Mj1cIjIzXCIgeTI9XCIxNlwiPjwvbGluZT48L3N2Zz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj5GaWx0ZXJzPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPEN1c3RvbVNlbGVjdCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17c29ydH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zPXtbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdmFsdWU6ICduZXdlc3QnLCBsYWJlbDogJ05ldyBBcnJpdmFscycgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB2YWx1ZTogJ3ByaWNlX2FzYycsIGxhYmVsOiAnUHJpY2U6IExvdyB0byBIaWdoJyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHZhbHVlOiAncHJpY2VfZGVzYycsIGxhYmVsOiAnUHJpY2U6IEhpZ2ggdG8gTG93JyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHZhbHVlOiAncmF0aW5nX2Rlc2MnLCBsYWJlbDogJ1RvcCBSYXRlZCcgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e3NldFNvcnR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgey8qIEFjdGl2ZSBDaGlwcyBCYXIgKi99XHJcbiAgICAgICAgICAgICAgICAgICAge2FjdGl2ZUNoaXBzLmxlbmd0aCA+IDAgJiYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFjdGl2ZS1jaGlwcy1jb250YWluZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHthY3RpdmVDaGlwcy5tYXAoKGNoaXAsIGlkeCkgPT4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImFjdGl2ZS1jaGlwXCIga2V5PXtpZHh9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Y2hpcC5sYWJlbH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJhY3RpdmUtY2hpcC1yZW1vdmVcIiBvbkNsaWNrPXsoKSA9PiByZW1vdmVDaGlwKGNoaXApfT4mdGltZXM7PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICl9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHsvKiBQcm9kdWN0IEdyaWQgKi99XHJcbiAgICAgICAgICAgICAgICAgICAge2xvYWRpbmcgPyAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxQcm9kdWN0U2tlbGV0b25HcmlkIGNvdW50PXs4fSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICkgOiBwcm9kdWN0cy5sZW5ndGggPT09IDAgPyAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgdGV4dEFsaWduOiAnY2VudGVyJywgcGFkZGluZzogJzVyZW0gMCcsIGJhY2tncm91bmQ6ICcjZmZmJywgYm9yZGVyUmFkaXVzOiAnMTJweCcsIGJvcmRlcjogJzFweCBzb2xpZCByZ2JhKDAsMCwwLDAuMDIpJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoMyBzdHlsZT17eyBmb250RmFtaWx5OiAndmFyKC0tZm9udC1oZWFkaW5nKScsIGZvbnRXZWlnaHQ6ICc0MDAnLCBtYXJnaW5Cb3R0b206ICcwLjVyZW0nIH19Pk5vIHByb2R1Y3RzIGZvdW5kPC9oMz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPXt7IGNvbG9yOiAnIzhjODg4MycsIGZvbnRTaXplOiAnMC45NXJlbScgfX0+VHJ5IGNsZWFyaW5nIHNvbWUgZmlsdGVycyBvciBzZWFyY2hpbmcgZm9yIHNvbWV0aGluZyBlbHNlLjwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHJvZHVjdC1ncmlkXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3Byb2R1Y3RzLm1hcChwcm9kdWN0ID0+IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPFJlbmRlclByb2R1Y3RDYXJkIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtwcm9kdWN0LmlkfSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2R1Y3Q9e3Byb2R1Y3R9IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lzaGxpc3Q9e3dpc2hsaXN0fSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvZ2dsZVdpc2hsaXN0PXt0b2dnbGVXaXNobGlzdH0gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7LyogUGFnaW5hdGlvbiBDb250cm9scyAqL31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt0b3RhbFBhZ2VzID4gMSAmJiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXRhbG9nLXBhZ2luYXRpb25cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInBhZ2luYXRpb24tYnRuXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc2FibGVkPXtjdXJyZW50UGFnZSA9PT0gMX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGhhbmRsZVBhZ2VDaGFuZ2UoY3VycmVudFBhZ2UgLSAxKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJmxhcnI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge0FycmF5LmZyb20oeyBsZW5ndGg6IHRvdGFsUGFnZXMgfSwgKF8sIGkpID0+IGkgKyAxKS5tYXAocCA9PiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtwfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHBhZ2luYXRpb24tYnRuICR7cCA9PT0gY3VycmVudFBhZ2UgPyAnYWN0aXZlJyA6ICcnfWB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gaGFuZGxlUGFnZUNoYW5nZShwKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7cH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApKX1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJwYWdpbmF0aW9uLWJ0blwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZD17Y3VycmVudFBhZ2UgPT09IHRvdGFsUGFnZXN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBoYW5kbGVQYWdlQ2hhbmdlKGN1cnJlbnRQYWdlICsgMSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICZyYXJyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICA8L21haW4+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgey8qIE1vYmlsZSBGaWx0ZXIgRHJhd2VyIChQb3J0YWxlZCB0byBkb2N1bWVudC5ib2R5KSAqL31cclxuICAgICAgICAgICAge21vYmlsZUZpbHRlck9wZW4gJiYgUmVhY3RET00uY3JlYXRlUG9ydGFsKFxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2Btb2JpbGUtZmlsdGVyLWRyYXdlciAke21vYmlsZUZpbHRlck9wZW4gPyAnc2hvdycgOiAnJ31gfT5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vYmlsZS1maWx0ZXItZHJhd2VyLW92ZXJsYXlcIiBvbkNsaWNrPXsoKSA9PiBzZXRNb2JpbGVGaWx0ZXJPcGVuKGZhbHNlKX0gLz5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vYmlsZS1maWx0ZXItZHJhd2VyLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2JpbGUtZmlsdGVyLWRyYXdlci1oZWFkZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgZ2FwOiAnMC42cmVtJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3ZnIHdpZHRoPVwiMThcIiBoZWlnaHQ9XCIxOFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cInZhcigtLWNvbG9yLXByaW1hcnkpXCIgc3Ryb2tlV2lkdGg9XCIyXCI+PGxpbmUgeDE9XCI0XCIgeTE9XCIyMVwiIHgyPVwiNFwiIHkyPVwiMTRcIj48L2xpbmU+PGxpbmUgeDE9XCI0XCIgeTE9XCIxMFwiIHgyPVwiNFwiIHkyPVwiM1wiPjwvbGluZT48bGluZSB4MT1cIjEyXCIgeTE9XCIyMVwiIHgyPVwiMTJcIiB5Mj1cIjEyXCI+PC9saW5lPjxsaW5lIHgxPVwiMTJcIiB5MT1cIjhcIiB4Mj1cIjEyXCIgeTI9XCIzXCI+PC9saW5lPjxsaW5lIHgxPVwiMjBcIiB5MT1cIjIxXCIgeDI9XCIyMFwiIHkyPVwiMTZcIj48L2xpbmU+PGxpbmUgeDE9XCIyMFwiIHkxPVwiMTJcIiB4Mj1cIjIwXCIgeTI9XCIzXCI+PC9saW5lPjxsaW5lIHgxPVwiMVwiIHkxPVwiMTRcIiB4Mj1cIjdcIiB5Mj1cIjE0XCI+PC9saW5lPjxsaW5lIHgxPVwiOVwiIHkxPVwiOFwiIHgyPVwiMTVcIiB5Mj1cIjhcIj48L2xpbmU+PGxpbmUgeDE9XCIxN1wiIHkxPVwiMTZcIiB4Mj1cIjIzXCIgeTI9XCIxNlwiPjwvbGluZT48L3N2Zz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250RmFtaWx5OiAndmFyKC0tZm9udC1oZWFkaW5nKScsIGZvbnRTaXplOiAnMS4yNXJlbScsIGZvbnRXZWlnaHQ6ICc1MDAnLCBjb2xvcjogJ3ZhcigtLWNvbG9yLXRleHQsICMyRDJBMjYpJywgbGV0dGVyU3BhY2luZzogJzAuNXB4JyB9fT5GaWx0ZXJzPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHthY3RpdmVDaGlwcy5sZW5ndGggPiAwICYmIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgYmFja2dyb3VuZENvbG9yOiAndmFyKC0tY29sb3ItcGVhY2gpJywgY29sb3I6ICd2YXIoLS1jb2xvci1wcmltYXJ5KScsIGZvbnRTaXplOiAnMC43MnJlbScsIGZvbnRXZWlnaHQ6ICc3MDAnLCBib3JkZXJSYWRpdXM6ICcxMnB4JywgcGFkZGluZzogJzJweCA4cHgnLCBtYXJnaW5MZWZ0OiAnNHB4JyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHthY3RpdmVDaGlwcy5sZW5ndGh9IGFjdGl2ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICcwLjc1cmVtJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7YWN0aXZlQ2hpcHMubGVuZ3RoID4gMCAmJiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtjbGVhckFsbEZpbHRlcnN9IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgYmFja2dyb3VuZDogJ25vbmUnLCBib3JkZXI6ICdub25lJywgY29sb3I6ICcjODg4JywgZm9udFNpemU6ICcwLjhyZW0nLCBmb250V2VpZ2h0OiAnNjAwJywgY3Vyc29yOiAncG9pbnRlcicsIHBhZGRpbmc6IDAsIHRleHREZWNvcmF0aW9uOiAndW5kZXJsaW5lJyB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZXNldFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIm1vYmlsZS1kcmF3ZXItY2xvc2VcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRNb2JpbGVGaWx0ZXJPcGVuKGZhbHNlKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJpYS1sYWJlbD1cIkNsb3NlIGZpbHRlcnNcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJnRpbWVzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2JpbGUtZmlsdGVyLWRyYXdlci1ib2R5XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8RmlsdGVyU2lkZWJhckNvbnRlbnQgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRDYXRlZ29yaWVzPXtzZWxlY3RlZENhdGVnb3JpZXN9IHNldFNlbGVjdGVkQ2F0ZWdvcmllcz17c2V0U2VsZWN0ZWRDYXRlZ29yaWVzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkU2l6ZXM9e3NlbGVjdGVkU2l6ZXN9IHNldFNlbGVjdGVkU2l6ZXM9e3NldFNlbGVjdGVkU2l6ZXN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRGYWJyaWNzPXtzZWxlY3RlZEZhYnJpY3N9IHNldFNlbGVjdGVkRmFicmljcz17c2V0U2VsZWN0ZWRGYWJyaWNzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkUGF0dGVybnM9e3NlbGVjdGVkUGF0dGVybnN9IHNldFNlbGVjdGVkUGF0dGVybnM9e3NldFNlbGVjdGVkUGF0dGVybnN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRTbGVldmVzPXtzZWxlY3RlZFNsZWV2ZXN9IHNldFNlbGVjdGVkU2xlZXZlcz17c2V0U2VsZWN0ZWRTbGVldmVzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkT2NjYXNpb25zPXtzZWxlY3RlZE9jY2FzaW9uc30gc2V0U2VsZWN0ZWRPY2Nhc2lvbnM9e3NldFNlbGVjdGVkT2NjYXNpb25zfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkQ29sbGVjdGlvbnM9e3NlbGVjdGVkQ29sbGVjdGlvbnN9IHNldFNlbGVjdGVkQ29sbGVjdGlvbnM9e3NldFNlbGVjdGVkQ29sbGVjdGlvbnN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRDb2xvcnM9e3NlbGVjdGVkQ29sb3JzfSBzZXRTZWxlY3RlZENvbG9ycz17c2V0U2VsZWN0ZWRDb2xvcnN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25seU5ld0Fycml2YWxzPXtvbmx5TmV3QXJyaXZhbHN9IHNldE9ubHlOZXdBcnJpdmFscz17c2V0T25seU5ld0Fycml2YWxzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ubHlCZXN0U2VsbGVycz17b25seUJlc3RTZWxsZXJzfSBzZXRPbmx5QmVzdFNlbGxlcnM9e3NldE9ubHlCZXN0U2VsbGVyc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmljZVJhbmdlPXtwcmljZVJhbmdlfSBzZXRQcmljZVJhbmdlPXtzZXRQcmljZVJhbmdlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vYmlsZS1maWx0ZXItZHJhd2VyLWZvb3RlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2FjdGl2ZUNoaXBzLmxlbmd0aCA+IDAgJiYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tb3V0bGluZVwiIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtjbGVhckFsbEZpbHRlcnN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IHBhZGRpbmc6ICcwLjg1cmVtIDFyZW0nLCBib3JkZXJSYWRpdXM6ICcxMHB4JywgZm9udFNpemU6ICcwLjg4cmVtJywgZm9udFdlaWdodDogJzYwMCcgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlc2V0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnlcIiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRNb2JpbGVGaWx0ZXJPcGVuKGZhbHNlKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBmbGV4OiAxLCBwYWRkaW5nOiAnMC44NXJlbSAxcmVtJywgYm9yZGVyUmFkaXVzOiAnMTBweCcsIGZvbnRTaXplOiAnMC45MnJlbScsIGZvbnRXZWlnaHQ6ICc2MDAnLCBsZXR0ZXJTcGFjaW5nOiAnMC41cHgnIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQXBwbHkgRmlsdGVycyAoe3RvdGFsUHJvZHVjdHN9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+LFxyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keVxyXG4gICAgICAgICAgICApfVxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgKTtcclxufTtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBTaG9wO1xyXG4iXX0=