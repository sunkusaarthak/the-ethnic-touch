import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/components/FilterSidebarContent.jsx");const React = __vite__cjsImport0_react; const useState = __vite__cjsImport0_react["useState"]; const useEffect = __vite__cjsImport0_react["useEffect"]; const useRef = __vite__cjsImport0_react["useRef"]; const useMemo = __vite__cjsImport0_react["useMemo"]; const useCallback = __vite__cjsImport0_react["useCallback"];const _jsxDEV = __vite__cjsImport2_react_jsxDevRuntime["jsxDEV"];import __vite__cjsImport0_react from "/node_modules/.vite/deps/react.js?v=42a9b196";
import { useNavigate, Link, useLocation, useParams, Routes, Route, Navigate, BrowserRouter } from "/node_modules/.vite/deps/react-router-dom.js?v=42a9b196";
var _jsxFileName = "D:/The Ethnic Touch/frontend/src/components/FilterSidebarContent.jsx";
import __vite__cjsImport2_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=42a9b196";
const FilterSidebarContent = ({ selectedCategories, setSelectedCategories, selectedSizes, setSelectedSizes, selectedFabrics, setSelectedFabrics, selectedPatterns, setSelectedPatterns, selectedSleeves, setSelectedSleeves, selectedOccasions, setSelectedOccasions, selectedCollections, setSelectedCollections, selectedColors, setSelectedColors, onlyNewArrivals, setOnlyNewArrivals, onlyBestSellers, setOnlyBestSellers, priceRange, setPriceRange }) => {
	const handleCheckboxToggle = (list, setList, val) => {
		if (list.includes(val)) {
			setList(list.filter((item) => item !== val));
		} else {
			setList([...list, val]);
		}
	};
	const categories = [
		"Straight Cut",
		"Anarkali",
		"Tunic",
		"Fusion",
		"Palazzo Set",
		"A-Line"
	];
	const sizes = [
		"XS",
		"S",
		"M",
		"L",
		"XL",
		"XXL",
		"XXXL"
	];
	const fabrics = [
		"Cotton",
		"Rayon",
		"Linen",
		"Silk",
		"Georgette",
		"Viscose",
		"Chiffon",
		"Khadi"
	];
	const sleeves = [
		"Half Sleeve",
		"Full Sleeve",
		"Sleeveless",
		"Three Quarter"
	];
	const patterns = [
		"Printed",
		"Solid",
		"Embroidered",
		"Floral",
		"Striped",
		"Block Print"
	];
	const occasions = [
		"Daily Wear",
		"Office",
		"Festival",
		"Wedding",
		"Party",
		"Casual",
		"Traditional"
	];
	const collections = [
		"Festive Glow",
		"Summer Breeze",
		"Lavender Dream",
		"Monsoon Magic"
	];
	const colors = [
		"Peach",
		"Mint Green",
		"Lavender",
		"Blue",
		"Pink",
		"Red",
		"Yellow",
		"White",
		"Black"
	];
	return /* @__PURE__ */ _jsxDEV("div", {
		style: {
			display: "flex",
			flexDirection: "column",
			gap: "1.25rem"
		},
		children: [
			/* @__PURE__ */ _jsxDEV("div", {
				className: "filter-section",
				children: [/* @__PURE__ */ _jsxDEV("div", {
					className: "filter-title",
					style: {
						display: "flex",
						alignItems: "center",
						gap: "0.5rem"
					},
					children: [/* @__PURE__ */ _jsxDEV("svg", {
						width: "14",
						height: "14",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "var(--color-primary)",
						strokeWidth: "2",
						children: /* @__PURE__ */ _jsxDEV("polygon", { points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 38,
							columnNumber: 127
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 38,
						columnNumber: 21
					}, this), /* @__PURE__ */ _jsxDEV("span", { children: "Specials" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 39,
						columnNumber: 21
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 37,
					columnNumber: 17
				}, this), /* @__PURE__ */ _jsxDEV("div", {
					className: "filter-options",
					children: [/* @__PURE__ */ _jsxDEV("label", {
						className: "filter-checkbox-label",
						children: [/* @__PURE__ */ _jsxDEV("input", {
							type: "checkbox",
							checked: onlyNewArrivals,
							onChange: (e) => setOnlyNewArrivals(e.target.checked)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 43,
							columnNumber: 25
						}, this), /* @__PURE__ */ _jsxDEV("span", { children: "New Arrivals Only" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 48,
							columnNumber: 25
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 42,
						columnNumber: 21
					}, this), /* @__PURE__ */ _jsxDEV("label", {
						className: "filter-checkbox-label",
						children: [/* @__PURE__ */ _jsxDEV("input", {
							type: "checkbox",
							checked: onlyBestSellers,
							onChange: (e) => setOnlyBestSellers(e.target.checked)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 51,
							columnNumber: 25
						}, this), /* @__PURE__ */ _jsxDEV("span", { children: "Best Sellers Only" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 56,
							columnNumber: 25
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 50,
						columnNumber: 21
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 41,
					columnNumber: 17
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 36,
				columnNumber: 13
			}, this),
			/* @__PURE__ */ _jsxDEV("div", {
				className: "filter-section",
				children: [/* @__PURE__ */ _jsxDEV("div", {
					className: "filter-title",
					style: {
						display: "flex",
						alignItems: "center",
						gap: "0.5rem"
					},
					children: [/* @__PURE__ */ _jsxDEV("svg", {
						width: "14",
						height: "14",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "var(--color-primary)",
						strokeWidth: "2",
						children: /* @__PURE__ */ _jsxDEV("path", { d: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 63,
							columnNumber: 127
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 63,
						columnNumber: 21
					}, this), /* @__PURE__ */ _jsxDEV("span", { children: "Collection" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 64,
						columnNumber: 21
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 62,
					columnNumber: 17
				}, this), /* @__PURE__ */ _jsxDEV("div", {
					className: "filter-options",
					children: collections.map((col) => /* @__PURE__ */ _jsxDEV("label", {
						className: "filter-checkbox-label",
						children: [/* @__PURE__ */ _jsxDEV("input", {
							type: "checkbox",
							checked: selectedCollections.includes(col),
							onChange: () => handleCheckboxToggle(selectedCollections, setSelectedCollections, col)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 69,
							columnNumber: 29
						}, this), /* @__PURE__ */ _jsxDEV("span", { children: col }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 74,
							columnNumber: 29
						}, this)]
					}, col, true, {
						fileName: _jsxFileName,
						lineNumber: 68,
						columnNumber: 25
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 66,
					columnNumber: 17
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 61,
				columnNumber: 13
			}, this),
			/* @__PURE__ */ _jsxDEV("div", {
				className: "filter-section",
				children: [/* @__PURE__ */ _jsxDEV("div", {
					className: "filter-title",
					style: {
						display: "flex",
						alignItems: "center",
						gap: "0.5rem"
					},
					children: [/* @__PURE__ */ _jsxDEV("svg", {
						width: "14",
						height: "14",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "var(--color-primary)",
						strokeWidth: "2",
						children: [
							/* @__PURE__ */ _jsxDEV("rect", {
								x: "3",
								y: "3",
								width: "7",
								height: "7"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 82,
								columnNumber: 127
							}, this),
							/* @__PURE__ */ _jsxDEV("rect", {
								x: "14",
								y: "3",
								width: "7",
								height: "7"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 82,
								columnNumber: 173
							}, this),
							/* @__PURE__ */ _jsxDEV("rect", {
								x: "14",
								y: "14",
								width: "7",
								height: "7"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 82,
								columnNumber: 220
							}, this),
							/* @__PURE__ */ _jsxDEV("rect", {
								x: "3",
								y: "14",
								width: "7",
								height: "7"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 82,
								columnNumber: 268
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 82,
						columnNumber: 21
					}, this), /* @__PURE__ */ _jsxDEV("span", { children: "Category" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 83,
						columnNumber: 21
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 81,
					columnNumber: 17
				}, this), /* @__PURE__ */ _jsxDEV("div", {
					className: "filter-options",
					children: categories.map((c) => /* @__PURE__ */ _jsxDEV("label", {
						className: "filter-checkbox-label",
						children: [/* @__PURE__ */ _jsxDEV("input", {
							type: "checkbox",
							checked: selectedCategories.includes(c),
							onChange: () => handleCheckboxToggle(selectedCategories, setSelectedCategories, c)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 88,
							columnNumber: 29
						}, this), /* @__PURE__ */ _jsxDEV("span", { children: c }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 93,
							columnNumber: 29
						}, this)]
					}, c, true, {
						fileName: _jsxFileName,
						lineNumber: 87,
						columnNumber: 25
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 85,
					columnNumber: 17
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 80,
				columnNumber: 13
			}, this),
			/* @__PURE__ */ _jsxDEV("div", {
				className: "filter-section",
				children: [/* @__PURE__ */ _jsxDEV("div", {
					className: "filter-title",
					style: {
						display: "flex",
						alignItems: "center",
						gap: "0.5rem"
					},
					children: [/* @__PURE__ */ _jsxDEV("svg", {
						width: "14",
						height: "14",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "var(--color-primary)",
						strokeWidth: "2",
						children: [
							/* @__PURE__ */ _jsxDEV("line", {
								x1: "21",
								y1: "10",
								x2: "3",
								y2: "10"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 101,
								columnNumber: 127
							}, this),
							/* @__PURE__ */ _jsxDEV("line", {
								x1: "21",
								y1: "6",
								x2: "3",
								y2: "6"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 101,
								columnNumber: 171
							}, this),
							/* @__PURE__ */ _jsxDEV("line", {
								x1: "21",
								y1: "14",
								x2: "3",
								y2: "14"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 101,
								columnNumber: 213
							}, this),
							/* @__PURE__ */ _jsxDEV("line", {
								x1: "21",
								y1: "18",
								x2: "3",
								y2: "18"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 101,
								columnNumber: 257
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 101,
						columnNumber: 21
					}, this), /* @__PURE__ */ _jsxDEV("span", { children: "Sizes" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 102,
						columnNumber: 21
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 100,
					columnNumber: 17
				}, this), /* @__PURE__ */ _jsxDEV("div", {
					className: "filter-options",
					style: {
						display: "grid",
						gridTemplateColumns: "repeat(3, 1fr)",
						gap: "6px",
						maxHeight: "none"
					},
					children: sizes.map((s) => {
						const active = selectedSizes.includes(s);
						return /* @__PURE__ */ _jsxDEV("button", {
							onClick: () => handleCheckboxToggle(selectedSizes, setSelectedSizes, s),
							style: {
								padding: "6px 0",
								border: `1.5px solid ${active ? "var(--color-primary)" : "rgba(0,0,0,0.08)"}`,
								background: active ? "#fffcf9" : "#FFF",
								color: active ? "var(--color-primary)" : "var(--color-text)",
								borderRadius: "6px",
								fontSize: "0.8rem",
								fontWeight: "500",
								cursor: "pointer",
								transition: "all 0.2s ease"
							},
							children: s
						}, s, false, {
							fileName: _jsxFileName,
							lineNumber: 108,
							columnNumber: 29
						}, this);
					})
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 104,
					columnNumber: 17
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 99,
				columnNumber: 13
			}, this),
			/* @__PURE__ */ _jsxDEV("div", {
				className: "filter-section",
				children: [/* @__PURE__ */ _jsxDEV("div", {
					className: "filter-title",
					style: {
						display: "flex",
						alignItems: "center",
						gap: "0.5rem"
					},
					children: [/* @__PURE__ */ _jsxDEV("svg", {
						width: "14",
						height: "14",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "var(--color-primary)",
						strokeWidth: "2",
						children: [/* @__PURE__ */ _jsxDEV("path", { d: "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 132,
							columnNumber: 127
						}, this), /* @__PURE__ */ _jsxDEV("line", {
							x1: "7",
							y1: "7",
							x2: "7.01",
							y2: "7"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 132,
							columnNumber: 223
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 132,
						columnNumber: 21
					}, this), /* @__PURE__ */ _jsxDEV("span", { children: "Price Range" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 133,
						columnNumber: 21
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 131,
					columnNumber: 17
				}, this), /* @__PURE__ */ _jsxDEV("div", {
					className: "filter-options",
					children: [
						{
							label: "All Prices",
							value: "all"
						},
						{
							label: "Under ₹2,000",
							value: "under_2k"
						},
						{
							label: "₹2,000 - ₹4,999",
							value: "2k_5k"
						},
						{
							label: "₹5,000 - ₹9,999",
							value: "5k_10k"
						},
						{
							label: "₹10,000+",
							value: "over_10k"
						}
					].map((opt) => /* @__PURE__ */ _jsxDEV("label", {
						className: "filter-checkbox-label",
						children: [/* @__PURE__ */ _jsxDEV("input", {
							type: "radio",
							checked: priceRange === opt.value,
							onChange: () => setPriceRange(opt.value)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 144,
							columnNumber: 29
						}, this), /* @__PURE__ */ _jsxDEV("span", { children: opt.label }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 149,
							columnNumber: 29
						}, this)]
					}, opt.value, true, {
						fileName: _jsxFileName,
						lineNumber: 143,
						columnNumber: 25
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 135,
					columnNumber: 17
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 130,
				columnNumber: 13
			}, this),
			/* @__PURE__ */ _jsxDEV("div", {
				className: "filter-section",
				children: [/* @__PURE__ */ _jsxDEV("div", {
					className: "filter-title",
					style: {
						display: "flex",
						alignItems: "center",
						gap: "0.5rem"
					},
					children: [/* @__PURE__ */ _jsxDEV("svg", {
						width: "14",
						height: "14",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "var(--color-primary)",
						strokeWidth: "2",
						children: [
							/* @__PURE__ */ _jsxDEV("circle", {
								cx: "12",
								cy: "12",
								r: "10"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 157,
								columnNumber: 127
							}, this),
							/* @__PURE__ */ _jsxDEV("path", { d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 157,
								columnNumber: 167
							}, this),
							/* @__PURE__ */ _jsxDEV("line", {
								x1: "2",
								y1: "12",
								x2: "22",
								y2: "12"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 157,
								columnNumber: 232
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 157,
						columnNumber: 21
					}, this), /* @__PURE__ */ _jsxDEV("span", { children: "Fabric" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 158,
						columnNumber: 21
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 156,
					columnNumber: 17
				}, this), /* @__PURE__ */ _jsxDEV("div", {
					className: "filter-options",
					children: fabrics.map((f) => /* @__PURE__ */ _jsxDEV("label", {
						className: "filter-checkbox-label",
						children: [/* @__PURE__ */ _jsxDEV("input", {
							type: "checkbox",
							checked: selectedFabrics.includes(f),
							onChange: () => handleCheckboxToggle(selectedFabrics, setSelectedFabrics, f)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 163,
							columnNumber: 29
						}, this), /* @__PURE__ */ _jsxDEV("span", { children: f }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 168,
							columnNumber: 29
						}, this)]
					}, f, true, {
						fileName: _jsxFileName,
						lineNumber: 162,
						columnNumber: 25
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 160,
					columnNumber: 17
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 155,
				columnNumber: 13
			}, this),
			/* @__PURE__ */ _jsxDEV("div", {
				className: "filter-section",
				children: [/* @__PURE__ */ _jsxDEV("div", {
					className: "filter-title",
					style: {
						display: "flex",
						alignItems: "center",
						gap: "0.5rem"
					},
					children: [/* @__PURE__ */ _jsxDEV("svg", {
						width: "14",
						height: "14",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "var(--color-primary)",
						strokeWidth: "2",
						children: [/* @__PURE__ */ _jsxDEV("circle", {
							cx: "12",
							cy: "12",
							r: "10"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 176,
							columnNumber: 127
						}, this), /* @__PURE__ */ _jsxDEV("path", { d: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 176,
							columnNumber: 167
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 176,
						columnNumber: 21
					}, this), /* @__PURE__ */ _jsxDEV("span", { children: "Color Palette" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 177,
						columnNumber: 21
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 175,
					columnNumber: 17
				}, this), /* @__PURE__ */ _jsxDEV("div", {
					className: "filter-options",
					children: colors.map((col) => /* @__PURE__ */ _jsxDEV("label", {
						className: "filter-checkbox-label",
						children: [/* @__PURE__ */ _jsxDEV("input", {
							type: "checkbox",
							checked: selectedColors.includes(col),
							onChange: () => handleCheckboxToggle(selectedColors, setSelectedColors, col)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 182,
							columnNumber: 29
						}, this), /* @__PURE__ */ _jsxDEV("span", { children: col }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 187,
							columnNumber: 29
						}, this)]
					}, col, true, {
						fileName: _jsxFileName,
						lineNumber: 181,
						columnNumber: 25
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 179,
					columnNumber: 17
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 174,
				columnNumber: 13
			}, this),
			/* @__PURE__ */ _jsxDEV("div", {
				className: "filter-section",
				children: [/* @__PURE__ */ _jsxDEV("div", {
					className: "filter-title",
					style: {
						display: "flex",
						alignItems: "center",
						gap: "0.5rem"
					},
					children: [/* @__PURE__ */ _jsxDEV("svg", {
						width: "14",
						height: "14",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "var(--color-primary)",
						strokeWidth: "2",
						children: [/* @__PURE__ */ _jsxDEV("path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 195,
							columnNumber: 127
						}, this), /* @__PURE__ */ _jsxDEV("polyline", { points: "22 4 12 14.01 9 11.01" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 195,
							columnNumber: 179
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 195,
						columnNumber: 21
					}, this), /* @__PURE__ */ _jsxDEV("span", { children: "Occasion" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 196,
						columnNumber: 21
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 194,
					columnNumber: 17
				}, this), /* @__PURE__ */ _jsxDEV("div", {
					className: "filter-options",
					children: occasions.map((o) => /* @__PURE__ */ _jsxDEV("label", {
						className: "filter-checkbox-label",
						children: [/* @__PURE__ */ _jsxDEV("input", {
							type: "checkbox",
							checked: selectedOccasions.includes(o),
							onChange: () => handleCheckboxToggle(selectedOccasions, setSelectedOccasions, o)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 201,
							columnNumber: 29
						}, this), /* @__PURE__ */ _jsxDEV("span", { children: o }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 206,
							columnNumber: 29
						}, this)]
					}, o, true, {
						fileName: _jsxFileName,
						lineNumber: 200,
						columnNumber: 25
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 198,
					columnNumber: 17
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 193,
				columnNumber: 13
			}, this),
			/* @__PURE__ */ _jsxDEV("div", {
				className: "filter-section",
				children: [/* @__PURE__ */ _jsxDEV("div", {
					className: "filter-title",
					style: {
						display: "flex",
						alignItems: "center",
						gap: "0.5rem"
					},
					children: [/* @__PURE__ */ _jsxDEV("svg", {
						width: "14",
						height: "14",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "var(--color-primary)",
						strokeWidth: "2",
						children: /* @__PURE__ */ _jsxDEV("path", { d: "M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 214,
							columnNumber: 127
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 214,
						columnNumber: 21
					}, this), /* @__PURE__ */ _jsxDEV("span", { children: "Sleeve Type" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 215,
						columnNumber: 21
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 213,
					columnNumber: 17
				}, this), /* @__PURE__ */ _jsxDEV("div", {
					className: "filter-options",
					children: sleeves.map((sl) => /* @__PURE__ */ _jsxDEV("label", {
						className: "filter-checkbox-label",
						children: [/* @__PURE__ */ _jsxDEV("input", {
							type: "checkbox",
							checked: selectedSleeves.includes(sl),
							onChange: () => handleCheckboxToggle(selectedSleeves, setSelectedSleeves, sl)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 220,
							columnNumber: 29
						}, this), /* @__PURE__ */ _jsxDEV("span", { children: sl }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 225,
							columnNumber: 29
						}, this)]
					}, sl, true, {
						fileName: _jsxFileName,
						lineNumber: 219,
						columnNumber: 25
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 217,
					columnNumber: 17
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 212,
				columnNumber: 13
			}, this),
			/* @__PURE__ */ _jsxDEV("div", {
				className: "filter-section",
				style: {
					borderBottom: "none",
					marginBottom: 0
				},
				children: [/* @__PURE__ */ _jsxDEV("div", {
					className: "filter-title",
					style: {
						display: "flex",
						alignItems: "center",
						gap: "0.5rem"
					},
					children: [/* @__PURE__ */ _jsxDEV("svg", {
						width: "14",
						height: "14",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "var(--color-primary)",
						strokeWidth: "2",
						children: /* @__PURE__ */ _jsxDEV("path", { d: "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 233,
							columnNumber: 127
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 233,
						columnNumber: 21
					}, this), /* @__PURE__ */ _jsxDEV("span", { children: "Pattern & Craft" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 234,
						columnNumber: 21
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 232,
					columnNumber: 17
				}, this), /* @__PURE__ */ _jsxDEV("div", {
					className: "filter-options",
					children: patterns.map((p) => /* @__PURE__ */ _jsxDEV("label", {
						className: "filter-checkbox-label",
						children: [/* @__PURE__ */ _jsxDEV("input", {
							type: "checkbox",
							checked: selectedPatterns.includes(p),
							onChange: () => handleCheckboxToggle(selectedPatterns, setSelectedPatterns, p)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 239,
							columnNumber: 29
						}, this), /* @__PURE__ */ _jsxDEV("span", { children: p }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 244,
							columnNumber: 29
						}, this)]
					}, p, true, {
						fileName: _jsxFileName,
						lineNumber: 238,
						columnNumber: 25
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 236,
					columnNumber: 17
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 231,
				columnNumber: 13
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 35,
		columnNumber: 9
	}, this);
};
_c = FilterSidebarContent;
export default FilterSidebarContent;
var _c;
$RefreshReg$(_c, "FilterSidebarContent");
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;
import * as __vite_react_currentExports from "/src/components/FilterSidebarContent.jsx";
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }

  const currentExports = __vite_react_currentExports;
  queueMicrotask(() => {
    RefreshRuntime.registerExportsForReactRefresh("D:/The Ethnic Touch/frontend/src/components/FilterSidebarContent.jsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("D:/The Ethnic Touch/frontend/src/components/FilterSidebarContent.jsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
function $RefreshReg$(type, id) { return RefreshRuntime.register(type, "D:/The Ethnic Touch/frontend/src/components/FilterSidebarContent.jsx" + ' ' + id); }
function $RefreshSig$() { return RefreshRuntime.createSignatureFunctionForTransform(); }

//# sourceMappingURL=data:application/json;base64,eyJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLFVBQVUsV0FBVyxRQUFRLFNBQVMsbUJBQW1CO0FBQ3pFLFNBQVMsYUFBYSxNQUFNLGFBQWEsV0FBVyxRQUFRLE9BQU8sVUFBVSxxQkFBcUI7OztBQUVsRyxNQUFNLHdCQUF3QixFQUMxQixvQkFBb0IsdUJBQ3BCLGVBQWUsa0JBQ2YsaUJBQWlCLG9CQUNqQixrQkFBa0IscUJBQ2xCLGlCQUFpQixvQkFDakIsbUJBQW1CLHNCQUNuQixxQkFBcUIsd0JBQ3JCLGdCQUFnQixtQkFDaEIsaUJBQWlCLG9CQUNqQixpQkFBaUIsb0JBQ2pCLFlBQVksb0JBQ1Y7Q0FDRixNQUFNLHdCQUF3QixNQUFNLFNBQVMsUUFBUTtFQUNqRCxJQUFJLEtBQUssU0FBUyxHQUFHLEdBQUc7R0FDcEIsUUFBUSxLQUFLLFFBQU8sU0FBUSxTQUFTLEdBQUcsQ0FBQztFQUM3QyxPQUFPO0dBQ0gsUUFBUSxDQUFDLEdBQUcsTUFBTSxHQUFHLENBQUM7RUFDMUI7Q0FDSjtDQUVBLE1BQU0sYUFBYTtFQUFDO0VBQWdCO0VBQVk7RUFBUztFQUFVO0VBQWU7Q0FBUTtDQUMxRixNQUFNLFFBQVE7RUFBQztFQUFNO0VBQUs7RUFBSztFQUFLO0VBQU07RUFBTztDQUFNO0NBQ3ZELE1BQU0sVUFBVTtFQUFDO0VBQVU7RUFBUztFQUFTO0VBQVE7RUFBYTtFQUFXO0VBQVc7Q0FBTztDQUMvRixNQUFNLFVBQVU7RUFBQztFQUFlO0VBQWU7RUFBYztDQUFlO0NBQzVFLE1BQU0sV0FBVztFQUFDO0VBQVc7RUFBUztFQUFlO0VBQVU7RUFBVztDQUFhO0NBQ3ZGLE1BQU0sWUFBWTtFQUFDO0VBQWM7RUFBVTtFQUFZO0VBQVc7RUFBUztFQUFVO0NBQWE7Q0FDbEcsTUFBTSxjQUFjO0VBQUM7RUFBZ0I7RUFBaUI7RUFBa0I7Q0FBZTtDQUN2RixNQUFNLFNBQVM7RUFBQztFQUFTO0VBQWM7RUFBWTtFQUFRO0VBQVE7RUFBTztFQUFVO0VBQVM7Q0FBTztDQUVwRyxPQUNJLHdCQUFDLE9BQUQ7RUFBSyxPQUFPO0dBQUUsU0FBUztHQUFRLGVBQWU7R0FBVSxLQUFLO0VBQVU7WUFBdkU7R0FDSSx3QkFBQyxPQUFEO0lBQUssV0FBVTtjQUFmLENBQ0ksd0JBQUMsT0FBRDtLQUFLLFdBQVU7S0FBZSxPQUFPO01BQUUsU0FBUztNQUFRLFlBQVk7TUFBVSxLQUFLO0tBQVM7ZUFBNUYsQ0FDSSx3QkFBQyxPQUFEO01BQUssT0FBTTtNQUFLLFFBQU87TUFBSyxTQUFRO01BQVksTUFBSztNQUFPLFFBQU87TUFBdUIsYUFBWTtnQkFBSSx3QkFBQyxXQUFELEVBQVMsUUFBTyxpR0FBMEc7Ozs7O0tBQU07Ozs7ZUFDMU8sd0JBQUMsUUFBRCxZQUFNLFdBQWM7Ozs7YUFDbkI7Ozs7O2NBQ0wsd0JBQUMsT0FBRDtLQUFLLFdBQVU7ZUFBZixDQUNJLHdCQUFDLFNBQUQ7TUFBTyxXQUFVO2dCQUFqQixDQUNJLHdCQUFDLFNBQUQ7T0FDSSxNQUFLO09BQ0wsU0FBUztPQUNULFdBQVcsTUFBTSxtQkFBbUIsRUFBRSxPQUFPLE9BQU87TUFDdkQ7Ozs7Z0JBQ0Qsd0JBQUMsUUFBRCxZQUFNLG9CQUF1Qjs7OztjQUMxQjs7Ozs7ZUFDUCx3QkFBQyxTQUFEO01BQU8sV0FBVTtnQkFBakIsQ0FDSSx3QkFBQyxTQUFEO09BQ0ksTUFBSztPQUNMLFNBQVM7T0FDVCxXQUFXLE1BQU0sbUJBQW1CLEVBQUUsT0FBTyxPQUFPO01BQ3ZEOzs7O2dCQUNELHdCQUFDLFFBQUQsWUFBTSxvQkFBdUI7Ozs7Y0FDMUI7Ozs7O2FBQ047Ozs7O1lBQ0o7Ozs7OztHQUVMLHdCQUFDLE9BQUQ7SUFBSyxXQUFVO2NBQWYsQ0FDSSx3QkFBQyxPQUFEO0tBQUssV0FBVTtLQUFlLE9BQU87TUFBRSxTQUFTO01BQVEsWUFBWTtNQUFVLEtBQUs7S0FBUztlQUE1RixDQUNJLHdCQUFDLE9BQUQ7TUFBSyxPQUFNO01BQUssUUFBTztNQUFLLFNBQVE7TUFBWSxNQUFLO01BQU8sUUFBTztNQUF1QixhQUFZO2dCQUFJLHdCQUFDLFFBQUQsRUFBTSxHQUFFLDBEQUFnRTs7Ozs7S0FBTTs7OztlQUN4TCx3QkFBQyxRQUFELFlBQU0sYUFBZ0I7Ozs7YUFDckI7Ozs7O2NBQ0wsd0JBQUMsT0FBRDtLQUFLLFdBQVU7ZUFDVixZQUFZLEtBQUksUUFDYix3QkFBQyxTQUFEO01BQWlCLFdBQVU7Z0JBQTNCLENBQ0ksd0JBQUMsU0FBRDtPQUNJLE1BQUs7T0FDTCxTQUFTLG9CQUFvQixTQUFTLEdBQUc7T0FDekMsZ0JBQWdCLHFCQUFxQixxQkFBcUIsd0JBQXdCLEdBQUc7TUFDeEY7Ozs7Z0JBQ0Qsd0JBQUMsUUFBRCxZQUFPLElBQVU7Ozs7Y0FDZDtRQVBLOzs7O1lBT0wsQ0FDVjtJQUNBOzs7O1lBQ0o7Ozs7OztHQUVMLHdCQUFDLE9BQUQ7SUFBSyxXQUFVO2NBQWYsQ0FDSSx3QkFBQyxPQUFEO0tBQUssV0FBVTtLQUFlLE9BQU87TUFBRSxTQUFTO01BQVEsWUFBWTtNQUFVLEtBQUs7S0FBUztlQUE1RixDQUNJLHdCQUFDLE9BQUQ7TUFBSyxPQUFNO01BQUssUUFBTztNQUFLLFNBQVE7TUFBWSxNQUFLO01BQU8sUUFBTztNQUF1QixhQUFZO2dCQUF0RztPQUEwRyx3QkFBQyxRQUFEO1FBQU0sR0FBRTtRQUFJLEdBQUU7UUFBSSxPQUFNO1FBQUksUUFBTztPQUFVOzs7OztPQUFDLHdCQUFDLFFBQUQ7UUFBTSxHQUFFO1FBQUssR0FBRTtRQUFJLE9BQU07UUFBSSxRQUFPO09BQVU7Ozs7O09BQUMsd0JBQUMsUUFBRDtRQUFNLEdBQUU7UUFBSyxHQUFFO1FBQUssT0FBTTtRQUFJLFFBQU87T0FBVTs7Ozs7T0FBQyx3QkFBQyxRQUFEO1FBQU0sR0FBRTtRQUFJLEdBQUU7UUFBSyxPQUFNO1FBQUksUUFBTztPQUFVOzs7OztNQUFNOzs7OztlQUMzUyx3QkFBQyxRQUFELFlBQU0sV0FBYzs7OzthQUNuQjs7Ozs7Y0FDTCx3QkFBQyxPQUFEO0tBQUssV0FBVTtlQUNWLFdBQVcsS0FBSSxNQUNaLHdCQUFDLFNBQUQ7TUFBZSxXQUFVO2dCQUF6QixDQUNJLHdCQUFDLFNBQUQ7T0FDSSxNQUFLO09BQ0wsU0FBUyxtQkFBbUIsU0FBUyxDQUFDO09BQ3RDLGdCQUFnQixxQkFBcUIsb0JBQW9CLHVCQUF1QixDQUFDO01BQ3BGOzs7O2dCQUNELHdCQUFDLFFBQUQsWUFBTyxFQUFROzs7O2NBQ1o7UUFQSzs7OztZQU9MLENBQ1Y7SUFDQTs7OztZQUNKOzs7Ozs7R0FFTCx3QkFBQyxPQUFEO0lBQUssV0FBVTtjQUFmLENBQ0ksd0JBQUMsT0FBRDtLQUFLLFdBQVU7S0FBZSxPQUFPO01BQUUsU0FBUztNQUFRLFlBQVk7TUFBVSxLQUFLO0tBQVM7ZUFBNUYsQ0FDSSx3QkFBQyxPQUFEO01BQUssT0FBTTtNQUFLLFFBQU87TUFBSyxTQUFRO01BQVksTUFBSztNQUFPLFFBQU87TUFBdUIsYUFBWTtnQkFBdEc7T0FBMEcsd0JBQUMsUUFBRDtRQUFNLElBQUc7UUFBSyxJQUFHO1FBQUssSUFBRztRQUFJLElBQUc7T0FBVzs7Ozs7T0FBQyx3QkFBQyxRQUFEO1FBQU0sSUFBRztRQUFLLElBQUc7UUFBSSxJQUFHO1FBQUksSUFBRztPQUFVOzs7OztPQUFDLHdCQUFDLFFBQUQ7UUFBTSxJQUFHO1FBQUssSUFBRztRQUFLLElBQUc7UUFBSSxJQUFHO09BQVc7Ozs7O09BQUMsd0JBQUMsUUFBRDtRQUFNLElBQUc7UUFBSyxJQUFHO1FBQUssSUFBRztRQUFJLElBQUc7T0FBVzs7Ozs7TUFBTTs7Ozs7ZUFDN1Isd0JBQUMsUUFBRCxZQUFNLFFBQVc7Ozs7YUFDaEI7Ozs7O2NBQ0wsd0JBQUMsT0FBRDtLQUFLLFdBQVU7S0FBaUIsT0FBTztNQUFFLFNBQVM7TUFBUSxxQkFBcUI7TUFBa0IsS0FBSztNQUFPLFdBQVc7S0FBTztlQUMxSCxNQUFNLEtBQUksTUFBSztNQUNaLE1BQU0sU0FBUyxjQUFjLFNBQVMsQ0FBQztNQUN2QyxPQUNJLHdCQUFDLFVBQUQ7T0FFSSxlQUFlLHFCQUFxQixlQUFlLGtCQUFrQixDQUFDO09BQ3RFLE9BQU87UUFDSCxTQUFTO1FBQ1QsUUFBUSxlQUFlLFNBQVMseUJBQXlCO1FBQ3pELFlBQVksU0FBUyxZQUFZO1FBQ2pDLE9BQU8sU0FBUyx5QkFBeUI7UUFDekMsY0FBYztRQUNkLFVBQVU7UUFDVixZQUFZO1FBQ1osUUFBUTtRQUNSLFlBQVk7T0FDaEI7aUJBRUM7TUFDRyxHQWZDOzs7O2FBZUQ7S0FFaEIsQ0FBQztJQUNBOzs7O1lBQ0o7Ozs7OztHQUVMLHdCQUFDLE9BQUQ7SUFBSyxXQUFVO2NBQWYsQ0FDSSx3QkFBQyxPQUFEO0tBQUssV0FBVTtLQUFlLE9BQU87TUFBRSxTQUFTO01BQVEsWUFBWTtNQUFVLEtBQUs7S0FBUztlQUE1RixDQUNJLHdCQUFDLE9BQUQ7TUFBSyxPQUFNO01BQUssUUFBTztNQUFLLFNBQVE7TUFBWSxNQUFLO01BQU8sUUFBTztNQUF1QixhQUFZO2dCQUF0RyxDQUEwRyx3QkFBQyxRQUFELEVBQU0sR0FBRSxpRkFBdUY7Ozs7Z0JBQUMsd0JBQUMsUUFBRDtPQUFNLElBQUc7T0FBSSxJQUFHO09BQUksSUFBRztPQUFPLElBQUc7TUFBVTs7OztjQUFNOzs7OztlQUMzUCx3QkFBQyxRQUFELFlBQU0sY0FBaUI7Ozs7YUFDdEI7Ozs7O2NBQ0wsd0JBQUMsT0FBRDtLQUFLLFdBQVU7ZUFDVjtNQUNHO09BQUUsT0FBTztPQUFjLE9BQU87TUFBTTtNQUNwQztPQUFFLE9BQU87T0FBZ0IsT0FBTztNQUFXO01BQzNDO09BQUUsT0FBTztPQUFtQixPQUFPO01BQVE7TUFDM0M7T0FBRSxPQUFPO09BQW1CLE9BQU87TUFBUztNQUM1QztPQUFFLE9BQU87T0FBWSxPQUFPO01BQVc7S0FDM0MsQ0FBQyxDQUFDLEtBQUksUUFDRix3QkFBQyxTQUFEO01BQXVCLFdBQVU7Z0JBQWpDLENBQ0ksd0JBQUMsU0FBRDtPQUNJLE1BQUs7T0FDTCxTQUFTLGVBQWUsSUFBSTtPQUM1QixnQkFBZ0IsY0FBYyxJQUFJLEtBQUs7TUFDMUM7Ozs7Z0JBQ0Qsd0JBQUMsUUFBRCxZQUFPLElBQUksTUFBWTs7OztjQUNwQjtRQVBLLElBQUk7Ozs7WUFPVCxDQUNWO0lBQ0E7Ozs7WUFDSjs7Ozs7O0dBRUwsd0JBQUMsT0FBRDtJQUFLLFdBQVU7Y0FBZixDQUNJLHdCQUFDLE9BQUQ7S0FBSyxXQUFVO0tBQWUsT0FBTztNQUFFLFNBQVM7TUFBUSxZQUFZO01BQVUsS0FBSztLQUFTO2VBQTVGLENBQ0ksd0JBQUMsT0FBRDtNQUFLLE9BQU07TUFBSyxRQUFPO01BQUssU0FBUTtNQUFZLE1BQUs7TUFBTyxRQUFPO01BQXVCLGFBQVk7Z0JBQXRHO09BQTBHLHdCQUFDLFVBQUQ7UUFBUSxJQUFHO1FBQUssSUFBRztRQUFLLEdBQUU7T0FBYTs7Ozs7T0FBQyx3QkFBQyxRQUFELEVBQU0sR0FBRSxrREFBd0Q7Ozs7O09BQUMsd0JBQUMsUUFBRDtRQUFNLElBQUc7UUFBSSxJQUFHO1FBQUssSUFBRztRQUFLLElBQUc7T0FBVzs7Ozs7TUFBTTs7Ozs7ZUFDcFEsd0JBQUMsUUFBRCxZQUFNLFNBQVk7Ozs7YUFDakI7Ozs7O2NBQ0wsd0JBQUMsT0FBRDtLQUFLLFdBQVU7ZUFDVixRQUFRLEtBQUksTUFDVCx3QkFBQyxTQUFEO01BQWUsV0FBVTtnQkFBekIsQ0FDSSx3QkFBQyxTQUFEO09BQ0ksTUFBSztPQUNMLFNBQVMsZ0JBQWdCLFNBQVMsQ0FBQztPQUNuQyxnQkFBZ0IscUJBQXFCLGlCQUFpQixvQkFBb0IsQ0FBQztNQUM5RTs7OztnQkFDRCx3QkFBQyxRQUFELFlBQU8sRUFBUTs7OztjQUNaO1FBUEs7Ozs7WUFPTCxDQUNWO0lBQ0E7Ozs7WUFDSjs7Ozs7O0dBRUwsd0JBQUMsT0FBRDtJQUFLLFdBQVU7Y0FBZixDQUNJLHdCQUFDLE9BQUQ7S0FBSyxXQUFVO0tBQWUsT0FBTztNQUFFLFNBQVM7TUFBUSxZQUFZO01BQVUsS0FBSztLQUFTO2VBQTVGLENBQ0ksd0JBQUMsT0FBRDtNQUFLLE9BQU07TUFBSyxRQUFPO01BQUssU0FBUTtNQUFZLE1BQUs7TUFBTyxRQUFPO01BQXVCLGFBQVk7Z0JBQXRHLENBQTBHLHdCQUFDLFVBQUQ7T0FBUSxJQUFHO09BQUssSUFBRztPQUFLLEdBQUU7TUFBYTs7OztnQkFBQyx3QkFBQyxRQUFELEVBQU0sR0FBRSxxQ0FBMkM7Ozs7Y0FBTTs7Ozs7ZUFDM00sd0JBQUMsUUFBRCxZQUFNLGdCQUFtQjs7OzthQUN4Qjs7Ozs7Y0FDTCx3QkFBQyxPQUFEO0tBQUssV0FBVTtlQUNWLE9BQU8sS0FBSSxRQUNSLHdCQUFDLFNBQUQ7TUFBaUIsV0FBVTtnQkFBM0IsQ0FDSSx3QkFBQyxTQUFEO09BQ0ksTUFBSztPQUNMLFNBQVMsZUFBZSxTQUFTLEdBQUc7T0FDcEMsZ0JBQWdCLHFCQUFxQixnQkFBZ0IsbUJBQW1CLEdBQUc7TUFDOUU7Ozs7Z0JBQ0Qsd0JBQUMsUUFBRCxZQUFPLElBQVU7Ozs7Y0FDZDtRQVBLOzs7O1lBT0wsQ0FDVjtJQUNBOzs7O1lBQ0o7Ozs7OztHQUVMLHdCQUFDLE9BQUQ7SUFBSyxXQUFVO2NBQWYsQ0FDSSx3QkFBQyxPQUFEO0tBQUssV0FBVTtLQUFlLE9BQU87TUFBRSxTQUFTO01BQVEsWUFBWTtNQUFVLEtBQUs7S0FBUztlQUE1RixDQUNJLHdCQUFDLE9BQUQ7TUFBSyxPQUFNO01BQUssUUFBTztNQUFLLFNBQVE7TUFBWSxNQUFLO01BQU8sUUFBTztNQUF1QixhQUFZO2dCQUF0RyxDQUEwRyx3QkFBQyxRQUFELEVBQU0sR0FBRSxxQ0FBMkM7Ozs7Z0JBQUMsd0JBQUMsWUFBRCxFQUFVLFFBQU8sd0JBQWtDOzs7O2NBQU07Ozs7O2VBQ3ZOLHdCQUFDLFFBQUQsWUFBTSxXQUFjOzs7O2FBQ25COzs7OztjQUNMLHdCQUFDLE9BQUQ7S0FBSyxXQUFVO2VBQ1YsVUFBVSxLQUFJLE1BQ1gsd0JBQUMsU0FBRDtNQUFlLFdBQVU7Z0JBQXpCLENBQ0ksd0JBQUMsU0FBRDtPQUNJLE1BQUs7T0FDTCxTQUFTLGtCQUFrQixTQUFTLENBQUM7T0FDckMsZ0JBQWdCLHFCQUFxQixtQkFBbUIsc0JBQXNCLENBQUM7TUFDbEY7Ozs7Z0JBQ0Qsd0JBQUMsUUFBRCxZQUFPLEVBQVE7Ozs7Y0FDWjtRQVBLOzs7O1lBT0wsQ0FDVjtJQUNBOzs7O1lBQ0o7Ozs7OztHQUVMLHdCQUFDLE9BQUQ7SUFBSyxXQUFVO2NBQWYsQ0FDSSx3QkFBQyxPQUFEO0tBQUssV0FBVTtLQUFlLE9BQU87TUFBRSxTQUFTO01BQVEsWUFBWTtNQUFVLEtBQUs7S0FBUztlQUE1RixDQUNJLHdCQUFDLE9BQUQ7TUFBSyxPQUFNO01BQUssUUFBTztNQUFLLFNBQVE7TUFBWSxNQUFLO01BQU8sUUFBTztNQUF1QixhQUFZO2dCQUFJLHdCQUFDLFFBQUQsRUFBTSxHQUFFLG9MQUEwTDs7Ozs7S0FBTTs7OztlQUNsVCx3QkFBQyxRQUFELFlBQU0sY0FBaUI7Ozs7YUFDdEI7Ozs7O2NBQ0wsd0JBQUMsT0FBRDtLQUFLLFdBQVU7ZUFDVixRQUFRLEtBQUksT0FDVCx3QkFBQyxTQUFEO01BQWdCLFdBQVU7Z0JBQTFCLENBQ0ksd0JBQUMsU0FBRDtPQUNJLE1BQUs7T0FDTCxTQUFTLGdCQUFnQixTQUFTLEVBQUU7T0FDcEMsZ0JBQWdCLHFCQUFxQixpQkFBaUIsb0JBQW9CLEVBQUU7TUFDL0U7Ozs7Z0JBQ0Qsd0JBQUMsUUFBRCxZQUFPLEdBQVM7Ozs7Y0FDYjtRQVBLOzs7O1lBT0wsQ0FDVjtJQUNBOzs7O1lBQ0o7Ozs7OztHQUVMLHdCQUFDLE9BQUQ7SUFBSyxXQUFVO0lBQWlCLE9BQU87S0FBRSxjQUFjO0tBQVEsY0FBYztJQUFFO2NBQS9FLENBQ0ksd0JBQUMsT0FBRDtLQUFLLFdBQVU7S0FBZSxPQUFPO01BQUUsU0FBUztNQUFRLFlBQVk7TUFBVSxLQUFLO0tBQVM7ZUFBNUYsQ0FDSSx3QkFBQyxPQUFEO01BQUssT0FBTTtNQUFLLFFBQU87TUFBSyxTQUFRO01BQVksTUFBSztNQUFPLFFBQU87TUFBdUIsYUFBWTtnQkFBSSx3QkFBQyxRQUFELEVBQU0sR0FBRSw0REFBa0U7Ozs7O0tBQU07Ozs7ZUFDMUwsd0JBQUMsUUFBRCxZQUFNLGtCQUFxQjs7OzthQUMxQjs7Ozs7Y0FDTCx3QkFBQyxPQUFEO0tBQUssV0FBVTtlQUNWLFNBQVMsS0FBSSxNQUNWLHdCQUFDLFNBQUQ7TUFBZSxXQUFVO2dCQUF6QixDQUNJLHdCQUFDLFNBQUQ7T0FDSSxNQUFLO09BQ0wsU0FBUyxpQkFBaUIsU0FBUyxDQUFDO09BQ3BDLGdCQUFnQixxQkFBcUIsa0JBQWtCLHFCQUFxQixDQUFDO01BQ2hGOzs7O2dCQUNELHdCQUFDLFFBQUQsWUFBTyxFQUFROzs7O2NBQ1o7UUFQSzs7OztZQU9MLENBQ1Y7SUFDQTs7OztZQUNKOzs7Ozs7RUFDSjs7Ozs7O0FBRWI7O0FBRUEsZUFBZSIsIm5hbWVzIjpbXSwic291cmNlcyI6WyJGaWx0ZXJTaWRlYmFyQ29udGVudC5qc3giXSwidmVyc2lvbiI6Mywic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QsIHVzZVJlZiwgdXNlTWVtbywgdXNlQ2FsbGJhY2sgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IHVzZU5hdmlnYXRlLCBMaW5rLCB1c2VMb2NhdGlvbiwgdXNlUGFyYW1zLCBSb3V0ZXMsIFJvdXRlLCBOYXZpZ2F0ZSwgQnJvd3NlclJvdXRlciB9IGZyb20gJ3JlYWN0LXJvdXRlci1kb20nO1xyXG5cclxuY29uc3QgRmlsdGVyU2lkZWJhckNvbnRlbnQgPSAoe1xyXG4gICAgc2VsZWN0ZWRDYXRlZ29yaWVzLCBzZXRTZWxlY3RlZENhdGVnb3JpZXMsXHJcbiAgICBzZWxlY3RlZFNpemVzLCBzZXRTZWxlY3RlZFNpemVzLFxyXG4gICAgc2VsZWN0ZWRGYWJyaWNzLCBzZXRTZWxlY3RlZEZhYnJpY3MsXHJcbiAgICBzZWxlY3RlZFBhdHRlcm5zLCBzZXRTZWxlY3RlZFBhdHRlcm5zLFxyXG4gICAgc2VsZWN0ZWRTbGVldmVzLCBzZXRTZWxlY3RlZFNsZWV2ZXMsXHJcbiAgICBzZWxlY3RlZE9jY2FzaW9ucywgc2V0U2VsZWN0ZWRPY2Nhc2lvbnMsXHJcbiAgICBzZWxlY3RlZENvbGxlY3Rpb25zLCBzZXRTZWxlY3RlZENvbGxlY3Rpb25zLFxyXG4gICAgc2VsZWN0ZWRDb2xvcnMsIHNldFNlbGVjdGVkQ29sb3JzLFxyXG4gICAgb25seU5ld0Fycml2YWxzLCBzZXRPbmx5TmV3QXJyaXZhbHMsXHJcbiAgICBvbmx5QmVzdFNlbGxlcnMsIHNldE9ubHlCZXN0U2VsbGVycyxcclxuICAgIHByaWNlUmFuZ2UsIHNldFByaWNlUmFuZ2VcclxufSkgPT4ge1xyXG4gICAgY29uc3QgaGFuZGxlQ2hlY2tib3hUb2dnbGUgPSAobGlzdCwgc2V0TGlzdCwgdmFsKSA9PiB7XHJcbiAgICAgICAgaWYgKGxpc3QuaW5jbHVkZXModmFsKSkge1xyXG4gICAgICAgICAgICBzZXRMaXN0KGxpc3QuZmlsdGVyKGl0ZW0gPT4gaXRlbSAhPT0gdmFsKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc2V0TGlzdChbLi4ubGlzdCwgdmFsXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBjYXRlZ29yaWVzID0gW1wiU3RyYWlnaHQgQ3V0XCIsIFwiQW5hcmthbGlcIiwgXCJUdW5pY1wiLCBcIkZ1c2lvblwiLCBcIlBhbGF6em8gU2V0XCIsIFwiQS1MaW5lXCJdO1xyXG4gICAgY29uc3Qgc2l6ZXMgPSBbXCJYU1wiLCBcIlNcIiwgXCJNXCIsIFwiTFwiLCBcIlhMXCIsIFwiWFhMXCIsIFwiWFhYTFwiXTtcclxuICAgIGNvbnN0IGZhYnJpY3MgPSBbXCJDb3R0b25cIiwgXCJSYXlvblwiLCBcIkxpbmVuXCIsIFwiU2lsa1wiLCBcIkdlb3JnZXR0ZVwiLCBcIlZpc2Nvc2VcIiwgXCJDaGlmZm9uXCIsIFwiS2hhZGlcIl07XHJcbiAgICBjb25zdCBzbGVldmVzID0gW1wiSGFsZiBTbGVldmVcIiwgXCJGdWxsIFNsZWV2ZVwiLCBcIlNsZWV2ZWxlc3NcIiwgXCJUaHJlZSBRdWFydGVyXCJdO1xyXG4gICAgY29uc3QgcGF0dGVybnMgPSBbXCJQcmludGVkXCIsIFwiU29saWRcIiwgXCJFbWJyb2lkZXJlZFwiLCBcIkZsb3JhbFwiLCBcIlN0cmlwZWRcIiwgXCJCbG9jayBQcmludFwiXTtcclxuICAgIGNvbnN0IG9jY2FzaW9ucyA9IFtcIkRhaWx5IFdlYXJcIiwgXCJPZmZpY2VcIiwgXCJGZXN0aXZhbFwiLCBcIldlZGRpbmdcIiwgXCJQYXJ0eVwiLCBcIkNhc3VhbFwiLCBcIlRyYWRpdGlvbmFsXCJdO1xyXG4gICAgY29uc3QgY29sbGVjdGlvbnMgPSBbXCJGZXN0aXZlIEdsb3dcIiwgXCJTdW1tZXIgQnJlZXplXCIsIFwiTGF2ZW5kZXIgRHJlYW1cIiwgXCJNb25zb29uIE1hZ2ljXCJdO1xyXG4gICAgY29uc3QgY29sb3JzID0gW1wiUGVhY2hcIiwgXCJNaW50IEdyZWVuXCIsIFwiTGF2ZW5kZXJcIiwgXCJCbHVlXCIsIFwiUGlua1wiLCBcIlJlZFwiLCBcIlllbGxvd1wiLCBcIldoaXRlXCIsIFwiQmxhY2tcIl07XHJcblxyXG4gICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsIGdhcDogJzEuMjVyZW0nIH19PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpbHRlci1zZWN0aW9uXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpbHRlci10aXRsZVwiIHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGdhcDogJzAuNXJlbScgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjE0XCIgaGVpZ2h0PVwiMTRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJ2YXIoLS1jb2xvci1wcmltYXJ5KVwiIHN0cm9rZVdpZHRoPVwiMlwiPjxwb2x5Z29uIHBvaW50cz1cIjEyIDIgMTUuMDkgOC4yNiAyMiA5LjI3IDE3IDE0LjE0IDE4LjE4IDIxLjAyIDEyIDE3Ljc3IDUuODIgMjEuMDIgNyAxNC4xNCAyIDkuMjcgOC45MSA4LjI2IDEyIDJcIj48L3BvbHlnb24+PC9zdmc+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4+U3BlY2lhbHM8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmlsdGVyLW9wdGlvbnNcIj5cclxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiZmlsdGVyLWNoZWNrYm94LWxhYmVsXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJjaGVja2JveFwiIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tlZD17b25seU5ld0Fycml2YWxzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRPbmx5TmV3QXJyaXZhbHMoZS50YXJnZXQuY2hlY2tlZCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPk5ldyBBcnJpdmFscyBPbmx5PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImZpbHRlci1jaGVja2JveC1sYWJlbFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiY2hlY2tib3hcIiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrZWQ9e29ubHlCZXN0U2VsbGVyc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0T25seUJlc3RTZWxsZXJzKGUudGFyZ2V0LmNoZWNrZWQpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj5CZXN0IFNlbGxlcnMgT25seTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWx0ZXItc2VjdGlvblwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWx0ZXItdGl0bGVcIiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICcwLjVyZW0nIH19PlxyXG4gICAgICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCIxNFwiIGhlaWdodD1cIjE0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwidmFyKC0tY29sb3ItcHJpbWFyeSlcIiBzdHJva2VXaWR0aD1cIjJcIj48cGF0aCBkPVwiTTEyIDJMMiA3bDEwIDUgMTAtNS0xMC01ek0yIDE3bDEwIDUgMTAtNU0yIDEybDEwIDUgMTAtNVwiPjwvcGF0aD48L3N2Zz5cclxuICAgICAgICAgICAgICAgICAgICA8c3Bhbj5Db2xsZWN0aW9uPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpbHRlci1vcHRpb25zXCI+XHJcbiAgICAgICAgICAgICAgICAgICAge2NvbGxlY3Rpb25zLm1hcChjb2wgPT4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwga2V5PXtjb2x9IGNsYXNzTmFtZT1cImZpbHRlci1jaGVja2JveC1sYWJlbFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJjaGVja2JveFwiIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrZWQ9e3NlbGVjdGVkQ29sbGVjdGlvbnMuaW5jbHVkZXMoY29sKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KCkgPT4gaGFuZGxlQ2hlY2tib3hUb2dnbGUoc2VsZWN0ZWRDb2xsZWN0aW9ucywgc2V0U2VsZWN0ZWRDb2xsZWN0aW9ucywgY29sKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj57Y29sfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmlsdGVyLXNlY3Rpb25cIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmlsdGVyLXRpdGxlXCIgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgZ2FwOiAnMC41cmVtJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICA8c3ZnIHdpZHRoPVwiMTRcIiBoZWlnaHQ9XCIxNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cInZhcigtLWNvbG9yLXByaW1hcnkpXCIgc3Ryb2tlV2lkdGg9XCIyXCI+PHJlY3QgeD1cIjNcIiB5PVwiM1wiIHdpZHRoPVwiN1wiIGhlaWdodD1cIjdcIj48L3JlY3Q+PHJlY3QgeD1cIjE0XCIgeT1cIjNcIiB3aWR0aD1cIjdcIiBoZWlnaHQ9XCI3XCI+PC9yZWN0PjxyZWN0IHg9XCIxNFwiIHk9XCIxNFwiIHdpZHRoPVwiN1wiIGhlaWdodD1cIjdcIj48L3JlY3Q+PHJlY3QgeD1cIjNcIiB5PVwiMTRcIiB3aWR0aD1cIjdcIiBoZWlnaHQ9XCI3XCI+PC9yZWN0Pjwvc3ZnPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuPkNhdGVnb3J5PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpbHRlci1vcHRpb25zXCI+XHJcbiAgICAgICAgICAgICAgICAgICAge2NhdGVnb3JpZXMubWFwKGMgPT4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwga2V5PXtjfSBjbGFzc05hbWU9XCJmaWx0ZXItY2hlY2tib3gtbGFiZWxcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiY2hlY2tib3hcIiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGVja2VkPXtzZWxlY3RlZENhdGVnb3JpZXMuaW5jbHVkZXMoYyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eygpID0+IGhhbmRsZUNoZWNrYm94VG9nZ2xlKHNlbGVjdGVkQ2F0ZWdvcmllcywgc2V0U2VsZWN0ZWRDYXRlZ29yaWVzLCBjKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj57Y308L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgKSl9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpbHRlci1zZWN0aW9uXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpbHRlci10aXRsZVwiIHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGdhcDogJzAuNXJlbScgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjE0XCIgaGVpZ2h0PVwiMTRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJ2YXIoLS1jb2xvci1wcmltYXJ5KVwiIHN0cm9rZVdpZHRoPVwiMlwiPjxsaW5lIHgxPVwiMjFcIiB5MT1cIjEwXCIgeDI9XCIzXCIgeTI9XCIxMFwiPjwvbGluZT48bGluZSB4MT1cIjIxXCIgeTE9XCI2XCIgeDI9XCIzXCIgeTI9XCI2XCI+PC9saW5lPjxsaW5lIHgxPVwiMjFcIiB5MT1cIjE0XCIgeDI9XCIzXCIgeTI9XCIxNFwiPjwvbGluZT48bGluZSB4MT1cIjIxXCIgeTE9XCIxOFwiIHgyPVwiM1wiIHkyPVwiMThcIj48L2xpbmU+PC9zdmc+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4+U2l6ZXM8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmlsdGVyLW9wdGlvbnNcIiBzdHlsZT17eyBkaXNwbGF5OiAnZ3JpZCcsIGdyaWRUZW1wbGF0ZUNvbHVtbnM6ICdyZXBlYXQoMywgMWZyKScsIGdhcDogJzZweCcsIG1heEhlaWdodDogJ25vbmUnIH19PlxyXG4gICAgICAgICAgICAgICAgICAgIHtzaXplcy5tYXAocyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFjdGl2ZSA9IHNlbGVjdGVkU2l6ZXMuaW5jbHVkZXMocyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGhhbmRsZUNoZWNrYm94VG9nZ2xlKHNlbGVjdGVkU2l6ZXMsIHNldFNlbGVjdGVkU2l6ZXMsIHMpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6ICc2cHggMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlcjogYDEuNXB4IHNvbGlkICR7YWN0aXZlID8gJ3ZhcigtLWNvbG9yLXByaW1hcnkpJyA6ICdyZ2JhKDAsMCwwLDAuMDgpJ31gLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBhY3RpdmUgPyAnI2ZmZmNmOScgOiAnI0ZGRicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBhY3RpdmUgPyAndmFyKC0tY29sb3ItcHJpbWFyeSknIDogJ3ZhcigtLWNvbG9yLXRleHQpJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnNnB4JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6ICcwLjhyZW0nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiAnNTAwJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb246ICdhbGwgMC4ycyBlYXNlJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3N9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICB9KX1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmlsdGVyLXNlY3Rpb25cIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmlsdGVyLXRpdGxlXCIgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgZ2FwOiAnMC41cmVtJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICA8c3ZnIHdpZHRoPVwiMTRcIiBoZWlnaHQ9XCIxNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cInZhcigtLWNvbG9yLXByaW1hcnkpXCIgc3Ryb2tlV2lkdGg9XCIyXCI+PHBhdGggZD1cIk0yMC41OSAxMy40MWwtNy4xNyA3LjE3YTIgMiAwIDAgMS0yLjgzIDBMMiAxMlYyaDEwbDguNTkgOC41OWEyIDIgMCAwIDEgMCAyLjgyelwiPjwvcGF0aD48bGluZSB4MT1cIjdcIiB5MT1cIjdcIiB4Mj1cIjcuMDFcIiB5Mj1cIjdcIj48L2xpbmU+PC9zdmc+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4+UHJpY2UgUmFuZ2U8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmlsdGVyLW9wdGlvbnNcIj5cclxuICAgICAgICAgICAgICAgICAgICB7W1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB7IGxhYmVsOiAnQWxsIFByaWNlcycsIHZhbHVlOiAnYWxsJyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7IGxhYmVsOiAnVW5kZXIg4oK5MiwwMDAnLCB2YWx1ZTogJ3VuZGVyXzJrJyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7IGxhYmVsOiAn4oK5MiwwMDAgLSDigrk0LDk5OScsIHZhbHVlOiAnMmtfNWsnIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgbGFiZWw6ICfigrk1LDAwMCAtIOKCuTksOTk5JywgdmFsdWU6ICc1a18xMGsnIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgbGFiZWw6ICfigrkxMCwwMDArJywgdmFsdWU6ICdvdmVyXzEwaycgfVxyXG4gICAgICAgICAgICAgICAgICAgIF0ubWFwKG9wdCA9PiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBrZXk9e29wdC52YWx1ZX0gY2xhc3NOYW1lPVwiZmlsdGVyLWNoZWNrYm94LWxhYmVsXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInJhZGlvXCIgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tlZD17cHJpY2VSYW5nZSA9PT0gb3B0LnZhbHVlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoKSA9PiBzZXRQcmljZVJhbmdlKG9wdC52YWx1ZSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+e29wdC5sYWJlbH08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgKSl9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpbHRlci1zZWN0aW9uXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpbHRlci10aXRsZVwiIHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGdhcDogJzAuNXJlbScgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjE0XCIgaGVpZ2h0PVwiMTRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJ2YXIoLS1jb2xvci1wcmltYXJ5KVwiIHN0cm9rZVdpZHRoPVwiMlwiPjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMTBcIj48L2NpcmNsZT48cGF0aCBkPVwiTTEyIDJhMTQuNSAxNC41IDAgMCAwIDAgMjAgMTQuNSAxNC41IDAgMCAwIDAtMjBcIj48L3BhdGg+PGxpbmUgeDE9XCIyXCIgeTE9XCIxMlwiIHgyPVwiMjJcIiB5Mj1cIjEyXCI+PC9saW5lPjwvc3ZnPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuPkZhYnJpYzwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWx0ZXItb3B0aW9uc1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIHtmYWJyaWNzLm1hcChmID0+IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGtleT17Zn0gY2xhc3NOYW1lPVwiZmlsdGVyLWNoZWNrYm94LWxhYmVsXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImNoZWNrYm94XCIgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tlZD17c2VsZWN0ZWRGYWJyaWNzLmluY2x1ZGVzKGYpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoKSA9PiBoYW5kbGVDaGVja2JveFRvZ2dsZShzZWxlY3RlZEZhYnJpY3MsIHNldFNlbGVjdGVkRmFicmljcywgZil9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+e2Z9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICkpfVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWx0ZXItc2VjdGlvblwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWx0ZXItdGl0bGVcIiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICcwLjVyZW0nIH19PlxyXG4gICAgICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCIxNFwiIGhlaWdodD1cIjE0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwidmFyKC0tY29sb3ItcHJpbWFyeSlcIiBzdHJva2VXaWR0aD1cIjJcIj48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjEwXCI+PC9jaXJjbGU+PHBhdGggZD1cIk0xMiA4YTQgNCAwIDEgMCAwIDggNCA0IDAgMCAwIDAtOHpcIj48L3BhdGg+PC9zdmc+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4+Q29sb3IgUGFsZXR0ZTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWx0ZXItb3B0aW9uc1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIHtjb2xvcnMubWFwKGNvbCA9PiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBrZXk9e2NvbH0gY2xhc3NOYW1lPVwiZmlsdGVyLWNoZWNrYm94LWxhYmVsXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImNoZWNrYm94XCIgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tlZD17c2VsZWN0ZWRDb2xvcnMuaW5jbHVkZXMoY29sKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KCkgPT4gaGFuZGxlQ2hlY2tib3hUb2dnbGUoc2VsZWN0ZWRDb2xvcnMsIHNldFNlbGVjdGVkQ29sb3JzLCBjb2wpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPntjb2x9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICkpfVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWx0ZXItc2VjdGlvblwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWx0ZXItdGl0bGVcIiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICcwLjVyZW0nIH19PlxyXG4gICAgICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCIxNFwiIGhlaWdodD1cIjE0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwidmFyKC0tY29sb3ItcHJpbWFyeSlcIiBzdHJva2VXaWR0aD1cIjJcIj48cGF0aCBkPVwiTTIyIDExLjA4VjEyYTEwIDEwIDAgMSAxLTUuOTMtOS4xNFwiPjwvcGF0aD48cG9seWxpbmUgcG9pbnRzPVwiMjIgNCAxMiAxNC4wMSA5IDExLjAxXCI+PC9wb2x5bGluZT48L3N2Zz5cclxuICAgICAgICAgICAgICAgICAgICA8c3Bhbj5PY2Nhc2lvbjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWx0ZXItb3B0aW9uc1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIHtvY2Nhc2lvbnMubWFwKG8gPT4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwga2V5PXtvfSBjbGFzc05hbWU9XCJmaWx0ZXItY2hlY2tib3gtbGFiZWxcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiY2hlY2tib3hcIiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGVja2VkPXtzZWxlY3RlZE9jY2FzaW9ucy5pbmNsdWRlcyhvKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KCkgPT4gaGFuZGxlQ2hlY2tib3hUb2dnbGUoc2VsZWN0ZWRPY2Nhc2lvbnMsIHNldFNlbGVjdGVkT2NjYXNpb25zLCBvKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj57b308L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgKSl9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpbHRlci1zZWN0aW9uXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpbHRlci10aXRsZVwiIHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGdhcDogJzAuNXJlbScgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjE0XCIgaGVpZ2h0PVwiMTRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJ2YXIoLS1jb2xvci1wcmltYXJ5KVwiIHN0cm9rZVdpZHRoPVwiMlwiPjxwYXRoIGQ9XCJNMjAuMzggMy40NkwxNiAyYTQgNCAwIDAgMS04IDBMMy42MiAzLjQ2YTIgMiAwIDAgMC0xLjM0IDIuMjNsLjU4IDMuNDdhMSAxIDAgMCAwIC45OS44NEg2djEwYTIgMiAwIDAgMCAyIDJoOGEyIDIgMCAwIDAgMi0yVjEwaDIuMTVhMSAxIDAgMCAwIC45OS0uODRsLjU4LTMuNDdhMiAyIDAgMCAwLTEuMzQtMi4yM3pcIj48L3BhdGg+PC9zdmc+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4+U2xlZXZlIFR5cGU8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmlsdGVyLW9wdGlvbnNcIj5cclxuICAgICAgICAgICAgICAgICAgICB7c2xlZXZlcy5tYXAoc2wgPT4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwga2V5PXtzbH0gY2xhc3NOYW1lPVwiZmlsdGVyLWNoZWNrYm94LWxhYmVsXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImNoZWNrYm94XCIgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tlZD17c2VsZWN0ZWRTbGVldmVzLmluY2x1ZGVzKHNsKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KCkgPT4gaGFuZGxlQ2hlY2tib3hUb2dnbGUoc2VsZWN0ZWRTbGVldmVzLCBzZXRTZWxlY3RlZFNsZWV2ZXMsIHNsKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj57c2x9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICkpfVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWx0ZXItc2VjdGlvblwiIHN0eWxlPXt7IGJvcmRlckJvdHRvbTogJ25vbmUnLCBtYXJnaW5Cb3R0b206IDAgfX0+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpbHRlci10aXRsZVwiIHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGdhcDogJzAuNXJlbScgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjE0XCIgaGVpZ2h0PVwiMTRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJ2YXIoLS1jb2xvci1wcmltYXJ5KVwiIHN0cm9rZVdpZHRoPVwiMlwiPjxwYXRoIGQ9XCJNMTIgMnYyME0xNyA1SDkuNWEzLjUgMy41IDAgMCAwIDAgN2g1YTMuNSAzLjUgMCAwIDEgMCA3SDZcIj48L3BhdGg+PC9zdmc+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4+UGF0dGVybiAmIENyYWZ0PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpbHRlci1vcHRpb25zXCI+XHJcbiAgICAgICAgICAgICAgICAgICAge3BhdHRlcm5zLm1hcChwID0+IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGtleT17cH0gY2xhc3NOYW1lPVwiZmlsdGVyLWNoZWNrYm94LWxhYmVsXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImNoZWNrYm94XCIgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tlZD17c2VsZWN0ZWRQYXR0ZXJucy5pbmNsdWRlcyhwKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KCkgPT4gaGFuZGxlQ2hlY2tib3hUb2dnbGUoc2VsZWN0ZWRQYXR0ZXJucywgc2V0U2VsZWN0ZWRQYXR0ZXJucywgcCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+e3B9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICkpfVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IEZpbHRlclNpZGViYXJDb250ZW50O1xyXG4iXX0=