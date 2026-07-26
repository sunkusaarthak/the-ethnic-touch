import { n as __exportAll } from "/node_modules/.vite/deps/rolldown-runtime-B-1-B7_t.js?v=42a9b196";
//#region node_modules/@firebase/util/dist/postinstall.mjs
var getDefaultsFromPostinstall = () => void 0;
//#endregion
//#region node_modules/@firebase/util/dist/index.esm.js
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var stringToByteArray$1 = function(str) {
	const out = [];
	let p = 0;
	for (let i = 0; i < str.length; i++) {
		let c = str.charCodeAt(i);
		if (c < 128) out[p++] = c;
		else if (c < 2048) {
			out[p++] = c >> 6 | 192;
			out[p++] = c & 63 | 128;
		} else if ((c & 64512) === 55296 && i + 1 < str.length && (str.charCodeAt(i + 1) & 64512) === 56320) {
			c = 65536 + ((c & 1023) << 10) + (str.charCodeAt(++i) & 1023);
			out[p++] = c >> 18 | 240;
			out[p++] = c >> 12 & 63 | 128;
			out[p++] = c >> 6 & 63 | 128;
			out[p++] = c & 63 | 128;
		} else {
			out[p++] = c >> 12 | 224;
			out[p++] = c >> 6 & 63 | 128;
			out[p++] = c & 63 | 128;
		}
	}
	return out;
};
/**
* Turns an array of numbers into the string given by the concatenation of the
* characters to which the numbers correspond.
* @param bytes Array of numbers representing characters.
* @return Stringification of the array.
*/
var byteArrayToString = function(bytes) {
	const out = [];
	let pos = 0, c = 0;
	while (pos < bytes.length) {
		const c1 = bytes[pos++];
		if (c1 < 128) out[c++] = String.fromCharCode(c1);
		else if (c1 > 191 && c1 < 224) {
			const c2 = bytes[pos++];
			out[c++] = String.fromCharCode((c1 & 31) << 6 | c2 & 63);
		} else if (c1 > 239 && c1 < 365) {
			const c2 = bytes[pos++];
			const c3 = bytes[pos++];
			const c4 = bytes[pos++];
			const u = ((c1 & 7) << 18 | (c2 & 63) << 12 | (c3 & 63) << 6 | c4 & 63) - 65536;
			out[c++] = String.fromCharCode(55296 + (u >> 10));
			out[c++] = String.fromCharCode(56320 + (u & 1023));
		} else {
			const c2 = bytes[pos++];
			const c3 = bytes[pos++];
			out[c++] = String.fromCharCode((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
		}
	}
	return out.join("");
};
var base64 = {
	/**
	* Maps bytes to characters.
	*/
	byteToCharMap_: null,
	/**
	* Maps characters to bytes.
	*/
	charToByteMap_: null,
	/**
	* Maps bytes to websafe characters.
	* @private
	*/
	byteToCharMapWebSafe_: null,
	/**
	* Maps websafe characters to bytes.
	* @private
	*/
	charToByteMapWebSafe_: null,
	/**
	* Our default alphabet, shared between
	* ENCODED_VALS and ENCODED_VALS_WEBSAFE
	*/
	ENCODED_VALS_BASE: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
	/**
	* Our default alphabet. Value 64 (=) is special; it means "nothing."
	*/
	get ENCODED_VALS() {
		return this.ENCODED_VALS_BASE + "+/=";
	},
	/**
	* Our websafe alphabet.
	*/
	get ENCODED_VALS_WEBSAFE() {
		return this.ENCODED_VALS_BASE + "-_.";
	},
	/**
	* Whether this browser supports the atob and btoa functions. This extension
	* started at Mozilla but is now implemented by many browsers. We use the
	* ASSUME_* variables to avoid pulling in the full useragent detection library
	* but still allowing the standard per-browser compilations.
	*
	*/
	HAS_NATIVE_SUPPORT: typeof atob === "function",
	/**
	* Base64-encode an array of bytes.
	*
	* @param input An array of bytes (numbers with
	*     value in [0, 255]) to encode.
	* @param webSafe Boolean indicating we should use the
	*     alternative alphabet.
	* @return The base64 encoded string.
	*/
	encodeByteArray(input, webSafe) {
		if (!Array.isArray(input)) throw Error("encodeByteArray takes an array as a parameter");
		this.init_();
		const byteToCharMap = webSafe ? this.byteToCharMapWebSafe_ : this.byteToCharMap_;
		const output = [];
		for (let i = 0; i < input.length; i += 3) {
			const byte1 = input[i];
			const haveByte2 = i + 1 < input.length;
			const byte2 = haveByte2 ? input[i + 1] : 0;
			const haveByte3 = i + 2 < input.length;
			const byte3 = haveByte3 ? input[i + 2] : 0;
			const outByte1 = byte1 >> 2;
			const outByte2 = (byte1 & 3) << 4 | byte2 >> 4;
			let outByte3 = (byte2 & 15) << 2 | byte3 >> 6;
			let outByte4 = byte3 & 63;
			if (!haveByte3) {
				outByte4 = 64;
				if (!haveByte2) outByte3 = 64;
			}
			output.push(byteToCharMap[outByte1], byteToCharMap[outByte2], byteToCharMap[outByte3], byteToCharMap[outByte4]);
		}
		return output.join("");
	},
	/**
	* Base64-encode a string.
	*
	* @param input A string to encode.
	* @param webSafe If true, we should use the
	*     alternative alphabet.
	* @return The base64 encoded string.
	*/
	encodeString(input, webSafe) {
		if (this.HAS_NATIVE_SUPPORT && !webSafe) return btoa(input);
		return this.encodeByteArray(stringToByteArray$1(input), webSafe);
	},
	/**
	* Base64-decode a string.
	*
	* @param input to decode.
	* @param webSafe True if we should use the
	*     alternative alphabet.
	* @return string representing the decoded value.
	*/
	decodeString(input, webSafe) {
		if (this.HAS_NATIVE_SUPPORT && !webSafe) return atob(input);
		return byteArrayToString(this.decodeStringToByteArray(input, webSafe));
	},
	/**
	* Base64-decode a string.
	*
	* In base-64 decoding, groups of four characters are converted into three
	* bytes.  If the encoder did not apply padding, the input length may not
	* be a multiple of 4.
	*
	* In this case, the last group will have fewer than 4 characters, and
	* padding will be inferred.  If the group has one or two characters, it decodes
	* to one byte.  If the group has three characters, it decodes to two bytes.
	*
	* @param input Input to decode.
	* @param webSafe True if we should use the web-safe alphabet.
	* @return bytes representing the decoded value.
	*/
	decodeStringToByteArray(input, webSafe) {
		this.init_();
		const charToByteMap = webSafe ? this.charToByteMapWebSafe_ : this.charToByteMap_;
		const output = [];
		for (let i = 0; i < input.length;) {
			const byte1 = charToByteMap[input.charAt(i++)];
			const byte2 = i < input.length ? charToByteMap[input.charAt(i)] : 0;
			++i;
			const byte3 = i < input.length ? charToByteMap[input.charAt(i)] : 64;
			++i;
			const byte4 = i < input.length ? charToByteMap[input.charAt(i)] : 64;
			++i;
			if (byte1 == null || byte2 == null || byte3 == null || byte4 == null) throw new DecodeBase64StringError();
			const outByte1 = byte1 << 2 | byte2 >> 4;
			output.push(outByte1);
			if (byte3 !== 64) {
				const outByte2 = byte2 << 4 & 240 | byte3 >> 2;
				output.push(outByte2);
				if (byte4 !== 64) {
					const outByte3 = byte3 << 6 & 192 | byte4;
					output.push(outByte3);
				}
			}
		}
		return output;
	},
	/**
	* Lazy static initialization function. Called before
	* accessing any of the static map variables.
	* @private
	*/
	init_() {
		if (!this.byteToCharMap_) {
			this.byteToCharMap_ = {};
			this.charToByteMap_ = {};
			this.byteToCharMapWebSafe_ = {};
			this.charToByteMapWebSafe_ = {};
			for (let i = 0; i < this.ENCODED_VALS.length; i++) {
				this.byteToCharMap_[i] = this.ENCODED_VALS.charAt(i);
				this.charToByteMap_[this.byteToCharMap_[i]] = i;
				this.byteToCharMapWebSafe_[i] = this.ENCODED_VALS_WEBSAFE.charAt(i);
				this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[i]] = i;
				if (i >= this.ENCODED_VALS_BASE.length) {
					this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(i)] = i;
					this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(i)] = i;
				}
			}
		}
	}
};
/**
* An error encountered while decoding base64 string.
*/
var DecodeBase64StringError = class extends Error {
	constructor() {
		super(...arguments);
		this.name = "DecodeBase64StringError";
	}
};
/**
* URL-safe base64 encoding
*/
var base64Encode = function(str) {
	const utf8Bytes = stringToByteArray$1(str);
	return base64.encodeByteArray(utf8Bytes, true);
};
/**
* URL-safe base64 encoding (without "." padding in the end).
* e.g. Used in JSON Web Token (JWT) parts.
*/
var base64urlEncodeWithoutPadding = function(str) {
	return base64Encode(str).replace(/\./g, "");
};
/**
* URL-safe base64 decoding
*
* NOTE: DO NOT use the global atob() function - it does NOT support the
* base64Url variant encoding.
*
* @param str To be decoded
* @return Decoded result, if possible
*/
var base64Decode = function(str) {
	try {
		return base64.decodeString(str, true);
	} catch (e) {
		console.error("base64Decode failed: ", e);
	}
	return null;
};
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* Copy properties from source to target (recursively allows extension
* of Objects and Arrays).  Scalar values in the target are over-written.
* If target is undefined, an object of the appropriate type will be created
* (and returned).
*
* We recursively copy all child properties of plain Objects in the source- so
* that namespace- like dictionaries are merged.
*
* Note that the target can be a function, in which case the properties in
* the source Object are copied onto it as static properties of the Function.
*
* Note: we don't merge __proto__ to prevent prototype pollution
*/
function deepExtend(target, source) {
	if (!(source instanceof Object)) return source;
	switch (source.constructor) {
		case Date: return new Date(source.getTime());
		case Object:
			if (target === void 0) target = {};
			break;
		case Array:
			target = [];
			break;
		default: return source;
	}
	for (const prop in source) {
		if (!source.hasOwnProperty(prop) || !isValidKey(prop)) continue;
		target[prop] = deepExtend(target[prop], source[prop]);
	}
	return target;
}
function isValidKey(key) {
	return key !== "__proto__";
}
/**
* @license
* Copyright 2022 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* Polyfill for `globalThis` object.
* @returns the `globalThis` object for the given environment.
* @public
*/
function getGlobal() {
	if (typeof self !== "undefined") return self;
	if (typeof window !== "undefined") return window;
	if (typeof global !== "undefined") return global;
	throw new Error("Unable to locate global object.");
}
/**
* @license
* Copyright 2022 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var getDefaultsFromGlobal = () => getGlobal().__FIREBASE_DEFAULTS__;
/**
* Attempt to read defaults from a JSON string provided to
* process(.)env(.)__FIREBASE_DEFAULTS__ or a JSON file whose path is in
* process(.)env(.)__FIREBASE_DEFAULTS_PATH__
* The dots are in parens because certain compilers (Vite?) cannot
* handle seeing that variable in comments.
* See https://github.com/firebase/firebase-js-sdk/issues/6838
*/
var getDefaultsFromEnvVariable = () => {
	if (typeof process === "undefined" || typeof process.env === "undefined") return;
	const defaultsJsonString = process.env.__FIREBASE_DEFAULTS__;
	if (defaultsJsonString) return JSON.parse(defaultsJsonString);
};
var getDefaultsFromCookie = () => {
	if (typeof document === "undefined") return;
	let match;
	try {
		match = document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/);
	} catch (e) {
		return;
	}
	const decoded = match && base64Decode(match[1]);
	return decoded && JSON.parse(decoded);
};
/**
* Get the __FIREBASE_DEFAULTS__ object. It checks in order:
* (1) if such an object exists as a property of `globalThis`
* (2) if such an object was provided on a shell environment variable
* (3) if such an object exists in a cookie
* @public
*/
var getDefaults = () => {
	try {
		return getDefaultsFromPostinstall() || getDefaultsFromGlobal() || getDefaultsFromEnvVariable() || getDefaultsFromCookie();
	} catch (e) {
		/**
		* Catch-all for being unable to get __FIREBASE_DEFAULTS__ due
		* to any environment case we have not accounted for. Log to
		* info instead of swallowing so we can find these unknown cases
		* and add paths for them if needed.
		*/
		console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`);
		return;
	}
};
/**
* Returns emulator host stored in the __FIREBASE_DEFAULTS__ object
* for the given product.
* @returns a URL host formatted like `127.0.0.1:9999` or `[::1]:4000` if available
* @public
*/
var getDefaultEmulatorHost = (productName) => getDefaults()?.emulatorHosts?.[productName];
/**
* Returns Firebase app config stored in the __FIREBASE_DEFAULTS__ object.
* @public
*/
var getDefaultAppConfig = () => getDefaults()?.config;
/**
* Returns an experimental setting on the __FIREBASE_DEFAULTS__ object (properties
* prefixed by "_")
* @public
*/
var getExperimentalSetting = (name) => getDefaults()?.[`_${name}`];
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var Deferred = class {
	constructor() {
		this.reject = () => {};
		this.resolve = () => {};
		this.promise = new Promise((resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
		});
	}
	/**
	* Our API internals are not promisified and cannot because our callback APIs have subtle expectations around
	* invoking promises inline, which Promises are forbidden to do. This method accepts an optional node-style callback
	* and returns a node-style callback which will resolve or reject the Deferred's promise.
	*/
	wrapCallback(callback) {
		return (error, value) => {
			if (error) this.reject(error);
			else this.resolve(value);
			if (typeof callback === "function") {
				this.promise.catch(() => {});
				if (callback.length === 1) callback(error);
				else callback(error, value);
			}
		};
	}
};
/**
* @license
* Copyright 2021 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* Returns navigator.userAgent string or '' if it's not defined.
* @return user agent string
*/
function getUA() {
	if (typeof navigator !== "undefined" && typeof navigator["userAgent"] === "string") return navigator["userAgent"];
	else return "";
}
/**
* Detect Cordova / PhoneGap / Ionic frameworks on a mobile device.
*
* Deliberately does not rely on checking `file://` URLs (as this fails PhoneGap
* in the Ripple emulator) nor Cordova `onDeviceReady`, which would normally
* wait for a callback.
*/
function isMobileCordova() {
	return typeof window !== "undefined" && !!(window["cordova"] || window["phonegap"] || window["PhoneGap"]) && /ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(getUA());
}
/**
* Detect Node.js.
*
* @return true if Node.js environment is detected or specified.
*/
function isNode() {
	const forceEnvironment = getDefaults()?.forceEnvironment;
	if (forceEnvironment === "node") return true;
	else if (forceEnvironment === "browser") return false;
	try {
		return Object.prototype.toString.call(global.process) === "[object process]";
	} catch (e) {
		return false;
	}
}
/**
* Detect Browser Environment.
* Note: This will return true for certain test frameworks that are incompletely
* mimicking a browser, and should not lead to assuming all browser APIs are
* available.
*/
function isBrowser() {
	return typeof window !== "undefined" || isWebWorker();
}
/**
* Detect Web Worker context.
*/
function isWebWorker() {
	return typeof WorkerGlobalScope !== "undefined" && typeof self !== "undefined" && self instanceof WorkerGlobalScope;
}
/**
* Detect Cloudflare Worker context.
*/
function isCloudflareWorker() {
	return typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers";
}
function isBrowserExtension() {
	const runtime = typeof chrome === "object" ? chrome.runtime : typeof browser === "object" ? browser.runtime : void 0;
	return typeof runtime === "object" && runtime.id !== void 0;
}
/**
* Detect React Native.
*
* @return true if ReactNative environment is detected.
*/
function isReactNative() {
	return typeof navigator === "object" && navigator["product"] === "ReactNative";
}
/** Detects Internet Explorer. */
function isIE() {
	const ua = getUA();
	return ua.indexOf("MSIE ") >= 0 || ua.indexOf("Trident/") >= 0;
}
/**
* This method checks if indexedDB is supported by current browser/service worker context
* @return true if indexedDB is supported by current browser/service worker context
*/
function isIndexedDBAvailable() {
	try {
		return typeof indexedDB === "object";
	} catch (e) {
		return false;
	}
}
/**
* This method validates browser/sw context for indexedDB by opening a dummy indexedDB database and reject
* if errors occur during the database open operation.
*
* @throws exception if current browser/sw context can't run idb.open (ex: Safari iframe, Firefox
* private browsing)
*/
function validateIndexedDBOpenable() {
	return new Promise((resolve, reject) => {
		try {
			let preExist = true;
			const DB_CHECK_NAME = "validate-browser-context-for-indexeddb-analytics-module";
			const request = self.indexedDB.open(DB_CHECK_NAME);
			request.onsuccess = () => {
				request.result.close();
				if (!preExist) self.indexedDB.deleteDatabase(DB_CHECK_NAME);
				resolve(true);
			};
			request.onupgradeneeded = () => {
				preExist = false;
			};
			request.onerror = () => {
				reject(request.error?.message || "");
			};
		} catch (error) {
			reject(error);
		}
	});
}
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* @fileoverview Standardized Firebase Error.
*
* Usage:
*
*   // TypeScript string literals for type-safe codes
*   type Err =
*     'unknown' |
*     'object-not-found'
*     ;
*
*   // Closure enum for type-safe error codes
*   // at-enum {string}
*   var Err = {
*     UNKNOWN: 'unknown',
*     OBJECT_NOT_FOUND: 'object-not-found',
*   }
*
*   let errors: Map<Err, string> = {
*     'generic-error': "Unknown error",
*     'file-not-found': "Could not find file: {$file}",
*   };
*
*   // Type-safe function - must pass a valid error code as param.
*   let error = new ErrorFactory<Err>('service', 'Service', errors);
*
*   ...
*   throw error.create(Err.GENERIC);
*   ...
*   throw error.create(Err.FILE_NOT_FOUND, {'file': fileName});
*   ...
*   // Service: Could not file file: foo.txt (service/file-not-found).
*
*   catch (e) {
*     assert(e.message === "Could not find file: foo.txt.");
*     if ((e as FirebaseError)?.code === 'service/file-not-found') {
*       console.log("Could not read file: " + e['file']);
*     }
*   }
*/
var ERROR_NAME = "FirebaseError";
var FirebaseError = class FirebaseError extends Error {
	constructor(code, message, customData) {
		super(message);
		this.code = code;
		this.customData = customData;
		/** The custom name for all FirebaseErrors. */
		this.name = ERROR_NAME;
		Object.setPrototypeOf(this, FirebaseError.prototype);
		if (Error.captureStackTrace) Error.captureStackTrace(this, ErrorFactory.prototype.create);
	}
};
var ErrorFactory = class {
	constructor(service, serviceName, errors) {
		this.service = service;
		this.serviceName = serviceName;
		this.errors = errors;
	}
	create(code, ...data) {
		const customData = data[0] || {};
		const fullCode = `${this.service}/${code}`;
		const template = this.errors[code];
		const message = template ? replaceTemplate(template, customData) : "Error";
		return new FirebaseError(fullCode, `${this.serviceName}: ${message} (${fullCode}).`, customData);
	}
};
function replaceTemplate(template, data) {
	return template.replace(PATTERN, (_, key) => {
		const value = data[key];
		return value != null ? String(value) : `<${key}?>`;
	});
}
var PATTERN = /\{\$([^}]+)}/g;
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function contains(obj, key) {
	return Object.prototype.hasOwnProperty.call(obj, key);
}
function isEmpty(obj) {
	for (const key in obj) if (Object.prototype.hasOwnProperty.call(obj, key)) return false;
	return true;
}
/**
* Deep equal two objects. Support Arrays and Objects.
*/
function deepEqual(a, b) {
	if (a === b) return true;
	const aKeys = Object.keys(a);
	const bKeys = Object.keys(b);
	for (const k of aKeys) {
		if (!bKeys.includes(k)) return false;
		const aProp = a[k];
		const bProp = b[k];
		if (isObject(aProp) && isObject(bProp)) {
			if (!deepEqual(aProp, bProp)) return false;
		} else if (aProp !== bProp) return false;
	}
	for (const k of bKeys) if (!aKeys.includes(k)) return false;
	return true;
}
function isObject(thing) {
	return thing !== null && typeof thing === "object";
}
/**
* @license
* Copyright 2022 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* Returns a querystring-formatted string (e.g. &arg=val&arg2=val2) from a
* params object (e.g. {arg: 'val', arg2: 'val2'})
* Note: You must prepend it with ? when adding it to a URL.
*/
function querystring(querystringParams) {
	const params = [];
	for (const [key, value] of Object.entries(querystringParams)) if (Array.isArray(value)) value.forEach((arrayVal) => {
		params.push(encodeURIComponent(key) + "=" + encodeURIComponent(arrayVal));
	});
	else params.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
	return params.length ? "&" + params.join("&") : "";
}
/**
* Decodes a querystring (e.g. ?arg=val&arg2=val2) into a params object
* (e.g. {arg: 'val', arg2: 'val2'})
*/
function querystringDecode(querystring) {
	const obj = {};
	querystring.replace(/^\?/, "").split("&").forEach((token) => {
		if (token) {
			const [key, value] = token.split("=");
			obj[decodeURIComponent(key)] = decodeURIComponent(value);
		}
	});
	return obj;
}
/**
* Extract the query string part of a URL, including the leading question mark (if present).
*/
function extractQuerystring(url) {
	const queryStart = url.indexOf("?");
	if (!queryStart) return "";
	const fragmentStart = url.indexOf("#", queryStart);
	return url.substring(queryStart, fragmentStart > 0 ? fragmentStart : void 0);
}
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* Helper to make a Subscribe function (just like Promise helps make a
* Thenable).
*
* @param executor Function which can make calls to a single Observer
*     as a proxy.
* @param onNoObservers Callback when count of Observers goes to zero.
*/
function createSubscribe(executor, onNoObservers) {
	const proxy = new ObserverProxy(executor, onNoObservers);
	return proxy.subscribe.bind(proxy);
}
/**
* Implement fan-out for any number of Observers attached via a subscribe
* function.
*/
var ObserverProxy = class {
	/**
	* @param executor Function which can make calls to a single Observer
	*     as a proxy.
	* @param onNoObservers Callback when count of Observers goes to zero.
	*/
	constructor(executor, onNoObservers) {
		this.observers = [];
		this.unsubscribes = [];
		this.observerCount = 0;
		this.task = Promise.resolve();
		this.finalized = false;
		this.onNoObservers = onNoObservers;
		this.task.then(() => {
			executor(this);
		}).catch((e) => {
			this.error(e);
		});
	}
	next(value) {
		this.forEachObserver((observer) => {
			observer.next(value);
		});
	}
	error(error) {
		this.forEachObserver((observer) => {
			observer.error(error);
		});
		this.close(error);
	}
	complete() {
		this.forEachObserver((observer) => {
			observer.complete();
		});
		this.close();
	}
	/**
	* Subscribe function that can be used to add an Observer to the fan-out list.
	*
	* - We require that no event is sent to a subscriber synchronously to their
	*   call to subscribe().
	*/
	subscribe(nextOrObserver, error, complete) {
		let observer;
		if (nextOrObserver === void 0 && error === void 0 && complete === void 0) throw new Error("Missing Observer.");
		if (implementsAnyMethods(nextOrObserver, [
			"next",
			"error",
			"complete"
		])) observer = nextOrObserver;
		else observer = {
			next: nextOrObserver,
			error,
			complete
		};
		if (observer.next === void 0) observer.next = noop;
		if (observer.error === void 0) observer.error = noop;
		if (observer.complete === void 0) observer.complete = noop;
		const unsub = this.unsubscribeOne.bind(this, this.observers.length);
		if (this.finalized) this.task.then(() => {
			try {
				if (this.finalError) observer.error(this.finalError);
				else observer.complete();
			} catch (e) {}
		});
		this.observers.push(observer);
		return unsub;
	}
	unsubscribeOne(i) {
		if (this.observers === void 0 || this.observers[i] === void 0) return;
		delete this.observers[i];
		this.observerCount -= 1;
		if (this.observerCount === 0 && this.onNoObservers !== void 0) this.onNoObservers(this);
	}
	forEachObserver(fn) {
		if (this.finalized) return;
		for (let i = 0; i < this.observers.length; i++) this.sendOne(i, fn);
	}
	sendOne(i, fn) {
		this.task.then(() => {
			if (this.observers !== void 0 && this.observers[i] !== void 0) try {
				fn(this.observers[i]);
			} catch (e) {
				if (typeof console !== "undefined" && console.error) console.error(e);
			}
		});
	}
	close(err) {
		if (this.finalized) return;
		this.finalized = true;
		if (err !== void 0) this.finalError = err;
		this.task.then(() => {
			this.observers = void 0;
			this.onNoObservers = void 0;
		});
	}
};
/**
* Return true if the object passed in implements any of the named methods.
*/
function implementsAnyMethods(obj, methods) {
	if (typeof obj !== "object" || obj === null) return false;
	for (const method of methods) if (method in obj && typeof obj[method] === "function") return true;
	return false;
}
function noop() {}
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* @license
* Copyright 2021 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function getModularInstance(service) {
	if (service && service._delegate) return service._delegate;
	else return service;
}
/**
* @license
* Copyright 2025 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* Checks whether host is a cloud workstation or not.
* @public
*/
function isCloudWorkstation(url) {
	try {
		return (url.startsWith("http://") || url.startsWith("https://") ? new URL(url).hostname : url).endsWith(".cloudworkstations.dev");
	} catch {
		return false;
	}
}
/**
* Makes a fetch request to the given server.
* Mostly used for forwarding cookies in Firebase Studio.
* @public
*/
async function pingServer(endpoint) {
	return (await fetch(endpoint, { credentials: "include" })).ok;
}
/**
* @license
* Copyright 2025 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
//#endregion
//#region node_modules/@firebase/component/dist/esm/index.esm.js
/**
* Component for service name T, e.g. `auth`, `auth-internal`
*/
var Component = class {
	/**
	*
	* @param name The public service name, e.g. app, auth, firestore, database
	* @param instanceFactory Service factory responsible for creating the public interface
	* @param type whether the service provided by the component is public or private
	*/
	constructor(name, instanceFactory, type) {
		this.name = name;
		this.instanceFactory = instanceFactory;
		this.type = type;
		this.multipleInstances = false;
		/**
		* Properties to be added to the service namespace
		*/
		this.serviceProps = {};
		this.instantiationMode = "LAZY";
		this.onInstanceCreated = null;
	}
	setInstantiationMode(mode) {
		this.instantiationMode = mode;
		return this;
	}
	setMultipleInstances(multipleInstances) {
		this.multipleInstances = multipleInstances;
		return this;
	}
	setServiceProps(props) {
		this.serviceProps = props;
		return this;
	}
	setInstanceCreatedCallback(callback) {
		this.onInstanceCreated = callback;
		return this;
	}
};
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var DEFAULT_ENTRY_NAME$1 = "[DEFAULT]";
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* Provider for instance for service name T, e.g. 'auth', 'auth-internal'
* NameServiceMapping[T] is an alias for the type of the instance
*/
var Provider = class {
	constructor(name, container) {
		this.name = name;
		this.container = container;
		this.component = null;
		this.instances = /* @__PURE__ */ new Map();
		this.instancesDeferred = /* @__PURE__ */ new Map();
		this.instancesOptions = /* @__PURE__ */ new Map();
		this.onInitCallbacks = /* @__PURE__ */ new Map();
	}
	/**
	* @param identifier A provider can provide multiple instances of a service
	* if this.component.multipleInstances is true.
	*/
	get(identifier) {
		const normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
		if (!this.instancesDeferred.has(normalizedIdentifier)) {
			const deferred = new Deferred();
			this.instancesDeferred.set(normalizedIdentifier, deferred);
			if (this.isInitialized(normalizedIdentifier) || this.shouldAutoInitialize()) try {
				const instance = this.getOrInitializeService({ instanceIdentifier: normalizedIdentifier });
				if (instance) deferred.resolve(instance);
			} catch (e) {}
		}
		return this.instancesDeferred.get(normalizedIdentifier).promise;
	}
	getImmediate(options) {
		const normalizedIdentifier = this.normalizeInstanceIdentifier(options?.identifier);
		const optional = options?.optional ?? false;
		if (this.isInitialized(normalizedIdentifier) || this.shouldAutoInitialize()) try {
			return this.getOrInitializeService({ instanceIdentifier: normalizedIdentifier });
		} catch (e) {
			if (optional) return null;
			else throw e;
		}
		else if (optional) return null;
		else throw Error(`Service ${this.name} is not available`);
	}
	getComponent() {
		return this.component;
	}
	setComponent(component) {
		if (component.name !== this.name) throw Error(`Mismatching Component ${component.name} for Provider ${this.name}.`);
		if (this.component) throw Error(`Component for ${this.name} has already been provided`);
		this.component = component;
		if (!this.shouldAutoInitialize()) return;
		if (isComponentEager(component)) try {
			this.getOrInitializeService({ instanceIdentifier: DEFAULT_ENTRY_NAME$1 });
		} catch (e) {}
		for (const [instanceIdentifier, instanceDeferred] of this.instancesDeferred.entries()) {
			const normalizedIdentifier = this.normalizeInstanceIdentifier(instanceIdentifier);
			try {
				const instance = this.getOrInitializeService({ instanceIdentifier: normalizedIdentifier });
				instanceDeferred.resolve(instance);
			} catch (e) {}
		}
	}
	clearInstance(identifier = DEFAULT_ENTRY_NAME$1) {
		this.instancesDeferred.delete(identifier);
		this.instancesOptions.delete(identifier);
		this.instances.delete(identifier);
	}
	async delete() {
		const services = Array.from(this.instances.values());
		await Promise.all([...services.filter((service) => "INTERNAL" in service).map((service) => service.INTERNAL.delete()), ...services.filter((service) => "_delete" in service).map((service) => service._delete())]);
	}
	isComponentSet() {
		return this.component != null;
	}
	isInitialized(identifier = DEFAULT_ENTRY_NAME$1) {
		return this.instances.has(identifier);
	}
	getOptions(identifier = DEFAULT_ENTRY_NAME$1) {
		return this.instancesOptions.get(identifier) || {};
	}
	initialize(opts = {}) {
		const { options = {} } = opts;
		const normalizedIdentifier = this.normalizeInstanceIdentifier(opts.instanceIdentifier);
		if (this.isInitialized(normalizedIdentifier)) throw Error(`${this.name}(${normalizedIdentifier}) has already been initialized`);
		if (!this.isComponentSet()) throw Error(`Component ${this.name} has not been registered yet`);
		const instance = this.getOrInitializeService({
			instanceIdentifier: normalizedIdentifier,
			options
		});
		for (const [instanceIdentifier, instanceDeferred] of this.instancesDeferred.entries()) if (normalizedIdentifier === this.normalizeInstanceIdentifier(instanceIdentifier)) instanceDeferred.resolve(instance);
		return instance;
	}
	/**
	*
	* @param callback - a function that will be invoked  after the provider has been initialized by calling provider.initialize().
	* The function is invoked SYNCHRONOUSLY, so it should not execute any longrunning tasks in order to not block the program.
	*
	* @param identifier An optional instance identifier
	* @returns a function to unregister the callback
	*/
	onInit(callback, identifier) {
		const normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
		const existingCallbacks = this.onInitCallbacks.get(normalizedIdentifier) ?? /* @__PURE__ */ new Set();
		existingCallbacks.add(callback);
		this.onInitCallbacks.set(normalizedIdentifier, existingCallbacks);
		const existingInstance = this.instances.get(normalizedIdentifier);
		if (existingInstance) callback(existingInstance, normalizedIdentifier);
		return () => {
			existingCallbacks.delete(callback);
		};
	}
	/**
	* Invoke onInit callbacks synchronously
	* @param instance the service instance`
	*/
	invokeOnInitCallbacks(instance, identifier) {
		const callbacks = this.onInitCallbacks.get(identifier);
		if (!callbacks) return;
		for (const callback of callbacks) try {
			callback(instance, identifier);
		} catch {}
	}
	getOrInitializeService({ instanceIdentifier, options = {} }) {
		let instance = this.instances.get(instanceIdentifier);
		if (!instance && this.component) {
			instance = this.component.instanceFactory(this.container, {
				instanceIdentifier: normalizeIdentifierForFactory(instanceIdentifier),
				options
			});
			this.instances.set(instanceIdentifier, instance);
			this.instancesOptions.set(instanceIdentifier, options);
			/**
			* Invoke onInit listeners.
			* Note this.component.onInstanceCreated is different, which is used by the component creator,
			* while onInit listeners are registered by consumers of the provider.
			*/
			this.invokeOnInitCallbacks(instance, instanceIdentifier);
			/**
			* Order is important
			* onInstanceCreated() should be called after this.instances.set(instanceIdentifier, instance); which
			* makes `isInitialized()` return true.
			*/
			if (this.component.onInstanceCreated) try {
				this.component.onInstanceCreated(this.container, instanceIdentifier, instance);
			} catch {}
		}
		return instance || null;
	}
	normalizeInstanceIdentifier(identifier = DEFAULT_ENTRY_NAME$1) {
		if (this.component) return this.component.multipleInstances ? identifier : DEFAULT_ENTRY_NAME$1;
		else return identifier;
	}
	shouldAutoInitialize() {
		return !!this.component && this.component.instantiationMode !== "EXPLICIT";
	}
};
function normalizeIdentifierForFactory(identifier) {
	return identifier === DEFAULT_ENTRY_NAME$1 ? void 0 : identifier;
}
function isComponentEager(component) {
	return component.instantiationMode === "EAGER";
}
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* ComponentContainer that provides Providers for service name T, e.g. `auth`, `auth-internal`
*/
var ComponentContainer = class {
	constructor(name) {
		this.name = name;
		this.providers = /* @__PURE__ */ new Map();
	}
	/**
	*
	* @param component Component being added
	* @param overwrite When a component with the same name has already been registered,
	* if overwrite is true: overwrite the existing component with the new component and create a new
	* provider with the new component. It can be useful in tests where you want to use different mocks
	* for different tests.
	* if overwrite is false: throw an exception
	*/
	addComponent(component) {
		const provider = this.getProvider(component.name);
		if (provider.isComponentSet()) throw new Error(`Component ${component.name} has already been registered with ${this.name}`);
		provider.setComponent(component);
	}
	addOrOverwriteComponent(component) {
		if (this.getProvider(component.name).isComponentSet()) this.providers.delete(component.name);
		this.addComponent(component);
	}
	/**
	* getProvider provides a type safe interface where it can only be called with a field name
	* present in NameServiceMapping interface.
	*
	* Firebase SDKs providing services should extend NameServiceMapping interface to register
	* themselves.
	*/
	getProvider(name) {
		if (this.providers.has(name)) return this.providers.get(name);
		const provider = new Provider(name, this);
		this.providers.set(name, provider);
		return provider;
	}
	getProviders() {
		return Array.from(this.providers.values());
	}
};
//#endregion
//#region node_modules/@firebase/logger/dist/esm/index.esm.js
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* A container for all of the Logger instances
*/
var instances = [];
/**
* The JS SDK supports 5 log levels and also allows a user the ability to
* silence the logs altogether.
*
* The order is a follows:
* DEBUG < VERBOSE < INFO < WARN < ERROR
*
* All of the log types above the current log level will be captured (i.e. if
* you set the log level to `INFO`, errors will still be logged, but `DEBUG` and
* `VERBOSE` logs will not)
*/
var LogLevel;
(function(LogLevel) {
	LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
	LogLevel[LogLevel["VERBOSE"] = 1] = "VERBOSE";
	LogLevel[LogLevel["INFO"] = 2] = "INFO";
	LogLevel[LogLevel["WARN"] = 3] = "WARN";
	LogLevel[LogLevel["ERROR"] = 4] = "ERROR";
	LogLevel[LogLevel["SILENT"] = 5] = "SILENT";
})(LogLevel || (LogLevel = {}));
var levelStringToEnum = {
	"debug": LogLevel.DEBUG,
	"verbose": LogLevel.VERBOSE,
	"info": LogLevel.INFO,
	"warn": LogLevel.WARN,
	"error": LogLevel.ERROR,
	"silent": LogLevel.SILENT
};
/**
* The default log level
*/
var defaultLogLevel = LogLevel.INFO;
/**
* By default, `console.debug` is not displayed in the developer console (in
* chrome). To avoid forcing users to have to opt-in to these logs twice
* (i.e. once for firebase, and once in the console), we are sending `DEBUG`
* logs to the `console.log` function.
*/
var ConsoleMethod = {
	[LogLevel.DEBUG]: "log",
	[LogLevel.VERBOSE]: "log",
	[LogLevel.INFO]: "info",
	[LogLevel.WARN]: "warn",
	[LogLevel.ERROR]: "error"
};
/**
* The default log handler will forward DEBUG, VERBOSE, INFO, WARN, and ERROR
* messages on to their corresponding console counterparts (if the log method
* is supported by the current log level)
*/
var defaultLogHandler = (instance, logType, ...args) => {
	if (logType < instance.logLevel) return;
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const method = ConsoleMethod[logType];
	if (method) console[method](`[${now}]  ${instance.name}:`, ...args);
	else throw new Error(`Attempted to log a message with an invalid logType (value: ${logType})`);
};
var Logger = class {
	/**
	* Gives you an instance of a Logger to capture messages according to
	* Firebase's logging scheme.
	*
	* @param name The name that the logs will be associated with
	*/
	constructor(name) {
		this.name = name;
		/**
		* The log level of the given Logger instance.
		*/
		this._logLevel = defaultLogLevel;
		/**
		* The main (internal) log handler for the Logger instance.
		* Can be set to a new function in internal package code but not by user.
		*/
		this._logHandler = defaultLogHandler;
		/**
		* The optional, additional, user-defined log handler for the Logger instance.
		*/
		this._userLogHandler = null;
		/**
		* Capture the current instance for later use
		*/
		instances.push(this);
	}
	get logLevel() {
		return this._logLevel;
	}
	set logLevel(val) {
		if (!(val in LogLevel)) throw new TypeError(`Invalid value "${val}" assigned to \`logLevel\``);
		this._logLevel = val;
	}
	setLogLevel(val) {
		this._logLevel = typeof val === "string" ? levelStringToEnum[val] : val;
	}
	get logHandler() {
		return this._logHandler;
	}
	set logHandler(val) {
		if (typeof val !== "function") throw new TypeError("Value assigned to `logHandler` must be a function");
		this._logHandler = val;
	}
	get userLogHandler() {
		return this._userLogHandler;
	}
	set userLogHandler(val) {
		this._userLogHandler = val;
	}
	/**
	* The functions below are all based on the `console` interface
	*/
	debug(...args) {
		this._userLogHandler && this._userLogHandler(this, LogLevel.DEBUG, ...args);
		this._logHandler(this, LogLevel.DEBUG, ...args);
	}
	log(...args) {
		this._userLogHandler && this._userLogHandler(this, LogLevel.VERBOSE, ...args);
		this._logHandler(this, LogLevel.VERBOSE, ...args);
	}
	info(...args) {
		this._userLogHandler && this._userLogHandler(this, LogLevel.INFO, ...args);
		this._logHandler(this, LogLevel.INFO, ...args);
	}
	warn(...args) {
		this._userLogHandler && this._userLogHandler(this, LogLevel.WARN, ...args);
		this._logHandler(this, LogLevel.WARN, ...args);
	}
	error(...args) {
		this._userLogHandler && this._userLogHandler(this, LogLevel.ERROR, ...args);
		this._logHandler(this, LogLevel.ERROR, ...args);
	}
};
function setLogLevel$1(level) {
	instances.forEach((inst) => {
		inst.setLogLevel(level);
	});
}
function setUserLogHandler(logCallback, options) {
	for (const instance of instances) {
		let customLogLevel = null;
		if (options && options.level) customLogLevel = levelStringToEnum[options.level];
		if (logCallback === null) instance.userLogHandler = null;
		else instance.userLogHandler = (instance, level, ...args) => {
			const message = args.map((arg) => {
				if (arg == null) return null;
				else if (typeof arg === "string") return arg;
				else if (typeof arg === "number" || typeof arg === "boolean") return arg.toString();
				else if (arg instanceof Error) return arg.message;
				else try {
					return JSON.stringify(arg);
				} catch (ignored) {
					return null;
				}
			}).filter((arg) => arg).join(" ");
			if (level >= (customLogLevel ?? instance.logLevel)) logCallback({
				level: LogLevel[level].toLowerCase(),
				message,
				args,
				type: instance.name
			});
		};
	}
}
//#endregion
//#region node_modules/idb/build/wrap-idb-value.js
var instanceOfAny = (object, constructors) => constructors.some((c) => object instanceof c);
var idbProxyableTypes;
var cursorAdvanceMethods;
function getIdbProxyableTypes() {
	return idbProxyableTypes || (idbProxyableTypes = [
		IDBDatabase,
		IDBObjectStore,
		IDBIndex,
		IDBCursor,
		IDBTransaction
	]);
}
function getCursorAdvanceMethods() {
	return cursorAdvanceMethods || (cursorAdvanceMethods = [
		IDBCursor.prototype.advance,
		IDBCursor.prototype.continue,
		IDBCursor.prototype.continuePrimaryKey
	]);
}
var cursorRequestMap = /* @__PURE__ */ new WeakMap();
var transactionDoneMap = /* @__PURE__ */ new WeakMap();
var transactionStoreNamesMap = /* @__PURE__ */ new WeakMap();
var transformCache = /* @__PURE__ */ new WeakMap();
var reverseTransformCache = /* @__PURE__ */ new WeakMap();
function promisifyRequest(request) {
	const promise = new Promise((resolve, reject) => {
		const unlisten = () => {
			request.removeEventListener("success", success);
			request.removeEventListener("error", error);
		};
		const success = () => {
			resolve(wrap(request.result));
			unlisten();
		};
		const error = () => {
			reject(request.error);
			unlisten();
		};
		request.addEventListener("success", success);
		request.addEventListener("error", error);
	});
	promise.then((value) => {
		if (value instanceof IDBCursor) cursorRequestMap.set(value, request);
	}).catch(() => {});
	reverseTransformCache.set(promise, request);
	return promise;
}
function cacheDonePromiseForTransaction(tx) {
	if (transactionDoneMap.has(tx)) return;
	const done = new Promise((resolve, reject) => {
		const unlisten = () => {
			tx.removeEventListener("complete", complete);
			tx.removeEventListener("error", error);
			tx.removeEventListener("abort", error);
		};
		const complete = () => {
			resolve();
			unlisten();
		};
		const error = () => {
			reject(tx.error || new DOMException("AbortError", "AbortError"));
			unlisten();
		};
		tx.addEventListener("complete", complete);
		tx.addEventListener("error", error);
		tx.addEventListener("abort", error);
	});
	transactionDoneMap.set(tx, done);
}
var idbProxyTraps = {
	get(target, prop, receiver) {
		if (target instanceof IDBTransaction) {
			if (prop === "done") return transactionDoneMap.get(target);
			if (prop === "objectStoreNames") return target.objectStoreNames || transactionStoreNamesMap.get(target);
			if (prop === "store") return receiver.objectStoreNames[1] ? void 0 : receiver.objectStore(receiver.objectStoreNames[0]);
		}
		return wrap(target[prop]);
	},
	set(target, prop, value) {
		target[prop] = value;
		return true;
	},
	has(target, prop) {
		if (target instanceof IDBTransaction && (prop === "done" || prop === "store")) return true;
		return prop in target;
	}
};
function replaceTraps(callback) {
	idbProxyTraps = callback(idbProxyTraps);
}
function wrapFunction(func) {
	if (func === IDBDatabase.prototype.transaction && !("objectStoreNames" in IDBTransaction.prototype)) return function(storeNames, ...args) {
		const tx = func.call(unwrap(this), storeNames, ...args);
		transactionStoreNamesMap.set(tx, storeNames.sort ? storeNames.sort() : [storeNames]);
		return wrap(tx);
	};
	if (getCursorAdvanceMethods().includes(func)) return function(...args) {
		func.apply(unwrap(this), args);
		return wrap(cursorRequestMap.get(this));
	};
	return function(...args) {
		return wrap(func.apply(unwrap(this), args));
	};
}
function transformCachableValue(value) {
	if (typeof value === "function") return wrapFunction(value);
	if (value instanceof IDBTransaction) cacheDonePromiseForTransaction(value);
	if (instanceOfAny(value, getIdbProxyableTypes())) return new Proxy(value, idbProxyTraps);
	return value;
}
function wrap(value) {
	if (value instanceof IDBRequest) return promisifyRequest(value);
	if (transformCache.has(value)) return transformCache.get(value);
	const newValue = transformCachableValue(value);
	if (newValue !== value) {
		transformCache.set(value, newValue);
		reverseTransformCache.set(newValue, value);
	}
	return newValue;
}
var unwrap = (value) => reverseTransformCache.get(value);
//#endregion
//#region node_modules/idb/build/index.js
/**
* Open a database.
*
* @param name Name of the database.
* @param version Schema version.
* @param callbacks Additional callbacks.
*/
function openDB(name, version, { blocked, upgrade, blocking, terminated } = {}) {
	const request = indexedDB.open(name, version);
	const openPromise = wrap(request);
	if (upgrade) request.addEventListener("upgradeneeded", (event) => {
		upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction), event);
	});
	if (blocked) request.addEventListener("blocked", (event) => blocked(event.oldVersion, event.newVersion, event));
	openPromise.then((db) => {
		if (terminated) db.addEventListener("close", () => terminated());
		if (blocking) db.addEventListener("versionchange", (event) => blocking(event.oldVersion, event.newVersion, event));
	}).catch(() => {});
	return openPromise;
}
var readMethods = [
	"get",
	"getKey",
	"getAll",
	"getAllKeys",
	"count"
];
var writeMethods = [
	"put",
	"add",
	"delete",
	"clear"
];
var cachedMethods = /* @__PURE__ */ new Map();
function getMethod(target, prop) {
	if (!(target instanceof IDBDatabase && !(prop in target) && typeof prop === "string")) return;
	if (cachedMethods.get(prop)) return cachedMethods.get(prop);
	const targetFuncName = prop.replace(/FromIndex$/, "");
	const useIndex = prop !== targetFuncName;
	const isWrite = writeMethods.includes(targetFuncName);
	if (!(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) || !(isWrite || readMethods.includes(targetFuncName))) return;
	const method = async function(storeName, ...args) {
		const tx = this.transaction(storeName, isWrite ? "readwrite" : "readonly");
		let target = tx.store;
		if (useIndex) target = target.index(args.shift());
		return (await Promise.all([target[targetFuncName](...args), isWrite && tx.done]))[0];
	};
	cachedMethods.set(prop, method);
	return method;
}
replaceTraps((oldTraps) => ({
	...oldTraps,
	get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
	has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop)
}));
//#endregion
//#region node_modules/@firebase/app/dist/esm/index.esm.js
var index_esm_exports = /* @__PURE__ */ __exportAll({
	FirebaseError: () => FirebaseError,
	SDK_VERSION: () => SDK_VERSION,
	_DEFAULT_ENTRY_NAME: () => DEFAULT_ENTRY_NAME,
	_addComponent: () => _addComponent,
	_addOrOverwriteComponent: () => _addOrOverwriteComponent,
	_apps: () => _apps,
	_clearComponents: () => _clearComponents,
	_components: () => _components,
	_getProvider: () => _getProvider,
	_isFirebaseApp: () => _isFirebaseApp,
	_isFirebaseServerApp: () => _isFirebaseServerApp,
	_isFirebaseServerAppSettings: () => _isFirebaseServerAppSettings,
	_registerComponent: () => _registerComponent,
	_removeServiceInstance: () => _removeServiceInstance,
	_serverApps: () => _serverApps,
	deleteApp: () => deleteApp,
	getApp: () => getApp,
	getApps: () => getApps,
	initializeApp: () => initializeApp,
	initializeServerApp: () => initializeServerApp,
	onLog: () => onLog,
	registerVersion: () => registerVersion,
	setLogLevel: () => setLogLevel
});
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var PlatformLoggerServiceImpl = class {
	constructor(container) {
		this.container = container;
	}
	getPlatformInfoString() {
		return this.container.getProviders().map((provider) => {
			if (isVersionServiceProvider(provider)) {
				const service = provider.getImmediate();
				return `${service.library}/${service.version}`;
			} else return null;
		}).filter((logString) => logString).join(" ");
	}
};
/**
*
* @param provider check if this provider provides a VersionService
*
* NOTE: Using Provider<'app-version'> is a hack to indicate that the provider
* provides VersionService. The provider is not necessarily a 'app-version'
* provider.
*/
function isVersionServiceProvider(provider) {
	return provider.getComponent()?.type === "VERSION";
}
var name$q = "@firebase/app";
var version$1 = "0.15.1";
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var logger = new Logger("@firebase/app");
var name$p = "@firebase/app-compat";
var name$o = "@firebase/analytics-compat";
var name$n = "@firebase/analytics";
var name$m = "@firebase/app-check-compat";
var name$l = "@firebase/app-check";
var name$k = "@firebase/auth";
var name$j = "@firebase/auth-compat";
var name$i = "@firebase/database";
var name$h = "@firebase/data-connect";
var name$g = "@firebase/database-compat";
var name$f = "@firebase/functions";
var name$e = "@firebase/functions-compat";
var name$d = "@firebase/installations";
var name$c = "@firebase/installations-compat";
var name$b = "@firebase/messaging";
var name$a = "@firebase/messaging-compat";
var name$9 = "@firebase/performance";
var name$8 = "@firebase/performance-compat";
var name$7 = "@firebase/remote-config";
var name$6 = "@firebase/remote-config-compat";
var name$5 = "@firebase/storage";
var name$4 = "@firebase/storage-compat";
var name$3 = "@firebase/firestore";
var name$2 = "@firebase/ai";
var name$1 = "@firebase/firestore-compat";
var name = "firebase";
var version = "12.16.0";
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* The default app name
*
* @internal
*/
var DEFAULT_ENTRY_NAME = "[DEFAULT]";
var PLATFORM_LOG_STRING = {
	[name$q]: "fire-core",
	[name$p]: "fire-core-compat",
	[name$n]: "fire-analytics",
	[name$o]: "fire-analytics-compat",
	[name$l]: "fire-app-check",
	[name$m]: "fire-app-check-compat",
	[name$k]: "fire-auth",
	[name$j]: "fire-auth-compat",
	[name$i]: "fire-rtdb",
	[name$h]: "fire-data-connect",
	[name$g]: "fire-rtdb-compat",
	[name$f]: "fire-fn",
	[name$e]: "fire-fn-compat",
	[name$d]: "fire-iid",
	[name$c]: "fire-iid-compat",
	[name$b]: "fire-fcm",
	[name$a]: "fire-fcm-compat",
	[name$9]: "fire-perf",
	[name$8]: "fire-perf-compat",
	[name$7]: "fire-rc",
	[name$6]: "fire-rc-compat",
	[name$5]: "fire-gcs",
	[name$4]: "fire-gcs-compat",
	[name$3]: "fire-fst",
	[name$1]: "fire-fst-compat",
	[name$2]: "fire-vertex",
	"fire-js": "fire-js",
	[name]: "fire-js-all"
};
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* @internal
*/
var _apps = /* @__PURE__ */ new Map();
/**
* @internal
*/
var _serverApps = /* @__PURE__ */ new Map();
/**
* Registered components.
*
* @internal
*/
var _components = /* @__PURE__ */ new Map();
/**
* @param component - the component being added to this app's container
*
* @internal
*/
function _addComponent(app, component) {
	try {
		app.container.addComponent(component);
	} catch (e) {
		logger.debug(`Component ${component.name} failed to register with FirebaseApp ${app.name}`, e);
	}
}
/**
*
* @internal
*/
function _addOrOverwriteComponent(app, component) {
	app.container.addOrOverwriteComponent(component);
}
/**
*
* @param component - the component to register
* @returns whether or not the component is registered successfully
*
* @internal
*/
function _registerComponent(component) {
	const componentName = component.name;
	if (_components.has(componentName)) {
		logger.debug(`There were multiple attempts to register component ${componentName}.`);
		return false;
	}
	_components.set(componentName, component);
	for (const app of _apps.values()) _addComponent(app, component);
	for (const serverApp of _serverApps.values()) _addComponent(serverApp, component);
	return true;
}
/**
*
* @param app - FirebaseApp instance
* @param name - service name
*
* @returns the provider for the service with the matching name
*
* @internal
*/
function _getProvider(app, name) {
	const heartbeatController = app.container.getProvider("heartbeat").getImmediate({ optional: true });
	if (heartbeatController) heartbeatController.triggerHeartbeat();
	return app.container.getProvider(name);
}
/**
*
* @param app - FirebaseApp instance
* @param name - service name
* @param instanceIdentifier - service instance identifier in case the service supports multiple instances
*
* @internal
*/
function _removeServiceInstance(app, name, instanceIdentifier = DEFAULT_ENTRY_NAME) {
	_getProvider(app, name).clearInstance(instanceIdentifier);
}
/**
*
* @param obj - an object of type FirebaseApp, FirebaseOptions or FirebaseAppSettings.
*
* @returns true if the provide object is of type FirebaseApp.
*
* @internal
*/
function _isFirebaseApp(obj) {
	return obj.options !== void 0;
}
/**
*
* @param obj - an object of type FirebaseApp, FirebaseOptions or FirebaseAppSettings.
*
* @returns true if the provided object is of type FirebaseServerAppImpl.
*
* @internal
*/
function _isFirebaseServerAppSettings(obj) {
	if (_isFirebaseApp(obj)) return false;
	return "authIdToken" in obj || "appCheckToken" in obj || "releaseOnDeref" in obj || "automaticDataCollectionEnabled" in obj;
}
/**
*
* @param obj - an object of type FirebaseApp.
*
* @returns true if the provided object is of type FirebaseServerAppImpl.
*
* @internal
*/
function _isFirebaseServerApp(obj) {
	if (obj === null || obj === void 0) return false;
	return obj.settings !== void 0;
}
/**
* Test only
*
* @internal
*/
function _clearComponents() {
	_components.clear();
}
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var ERROR_FACTORY = new ErrorFactory("app", "Firebase", {
	["no-app"]: "No Firebase App '{$appName}' has been created - call initializeApp() first",
	["bad-app-name"]: "Illegal App name: '{$appName}'",
	["duplicate-app"]: "Firebase App named '{$appName}' already exists with different options or config",
	["app-deleted"]: "Firebase App named '{$appName}' already deleted",
	["server-app-deleted"]: "Firebase Server App has been deleted",
	["no-options"]: "Need to provide options, when not being deployed to hosting via source.",
	["invalid-app-argument"]: "firebase.{$appName}() takes either no argument or a Firebase App instance.",
	["invalid-log-argument"]: "First argument to `onLog` must be null or a function.",
	["idb-open"]: "Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.",
	["idb-get"]: "Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.",
	["idb-set"]: "Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.",
	["idb-delete"]: "Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.",
	["finalization-registry-not-supported"]: "FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.",
	["invalid-server-app-environment"]: "FirebaseServerApp is not for use in browser environments."
});
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var FirebaseAppImpl = class {
	constructor(options, config, container) {
		this._isDeleted = false;
		this._options = { ...options };
		this._config = { ...config };
		this._name = config.name;
		this._automaticDataCollectionEnabled = config.automaticDataCollectionEnabled;
		this._container = container;
		this.container.addComponent(new Component("app", () => this, "PUBLIC"));
	}
	get automaticDataCollectionEnabled() {
		this.checkDestroyed();
		return this._automaticDataCollectionEnabled;
	}
	set automaticDataCollectionEnabled(val) {
		this.checkDestroyed();
		this._automaticDataCollectionEnabled = val;
	}
	get name() {
		this.checkDestroyed();
		return this._name;
	}
	get options() {
		this.checkDestroyed();
		return this._options;
	}
	get config() {
		this.checkDestroyed();
		return this._config;
	}
	get container() {
		return this._container;
	}
	get isDeleted() {
		return this._isDeleted;
	}
	set isDeleted(val) {
		this._isDeleted = val;
	}
	/**
	* This function will throw an Error if the App has already been deleted -
	* use before performing API actions on the App.
	*/
	checkDestroyed() {
		if (this.isDeleted) throw ERROR_FACTORY.create("app-deleted", { appName: this._name });
	}
};
/**
* @license
* Copyright 2023 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function validateTokenTTL(base64Token, tokenName) {
	const secondPart = base64Decode(base64Token.split(".")[1]);
	if (secondPart === null) {
		console.error(`FirebaseServerApp ${tokenName} is invalid: second part could not be parsed.`);
		return;
	}
	if (JSON.parse(secondPart).exp === void 0) {
		console.error(`FirebaseServerApp ${tokenName} is invalid: expiration claim could not be parsed`);
		return;
	}
	if (JSON.parse(secondPart).exp * 1e3 - (/* @__PURE__ */ new Date()).getTime() <= 0) console.error(`FirebaseServerApp ${tokenName} is invalid: the token has expired.`);
}
var FirebaseServerAppImpl = class extends FirebaseAppImpl {
	constructor(options, serverConfig, name, container) {
		const automaticDataCollectionEnabled = serverConfig.automaticDataCollectionEnabled !== void 0 ? serverConfig.automaticDataCollectionEnabled : true;
		const config = {
			name,
			automaticDataCollectionEnabled
		};
		if (options.apiKey !== void 0) super(options, config, container);
		else super(options.options, config, container);
		this._serverConfig = {
			automaticDataCollectionEnabled,
			...serverConfig
		};
		if (this._serverConfig.authIdToken) validateTokenTTL(this._serverConfig.authIdToken, "authIdToken");
		if (this._serverConfig.appCheckToken) validateTokenTTL(this._serverConfig.appCheckToken, "appCheckToken");
		this._finalizationRegistry = null;
		if (typeof FinalizationRegistry !== "undefined") this._finalizationRegistry = new FinalizationRegistry(() => {
			this.automaticCleanup();
		});
		this._refCount = 0;
		this.incRefCount(this._serverConfig.releaseOnDeref);
		this._serverConfig.releaseOnDeref = void 0;
		serverConfig.releaseOnDeref = void 0;
		registerVersion(name$q, version$1, "serverapp");
	}
	toJSON() {}
	get refCount() {
		return this._refCount;
	}
	incRefCount(obj) {
		if (this.isDeleted) return;
		this._refCount++;
		if (obj !== void 0 && this._finalizationRegistry !== null) this._finalizationRegistry.register(obj, this);
	}
	decRefCount() {
		if (this.isDeleted) return 0;
		return --this._refCount;
	}
	automaticCleanup() {
		deleteApp(this);
	}
	get settings() {
		this.checkDestroyed();
		return this._serverConfig;
	}
	/**
	* This function will throw an Error if the App has already been deleted -
	* use before performing API actions on the App.
	*/
	checkDestroyed() {
		if (this.isDeleted) throw ERROR_FACTORY.create("server-app-deleted");
	}
};
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* The current SDK version.
*
* @public
*/
var SDK_VERSION = version;
function initializeApp(_options, rawConfig = {}) {
	let options = _options;
	if (typeof rawConfig !== "object") rawConfig = { name: rawConfig };
	const config = {
		name: DEFAULT_ENTRY_NAME,
		automaticDataCollectionEnabled: true,
		...rawConfig
	};
	const name = config.name;
	if (typeof name !== "string" || !name) throw ERROR_FACTORY.create("bad-app-name", { appName: String(name) });
	options || (options = getDefaultAppConfig());
	if (!options) throw ERROR_FACTORY.create("no-options");
	const existingApp = _apps.get(name);
	if (existingApp) if (deepEqual(options, existingApp.options) && deepEqual(config, existingApp.config)) return existingApp;
	else throw ERROR_FACTORY.create("duplicate-app", { appName: name });
	const container = new ComponentContainer(name);
	for (const component of _components.values()) container.addComponent(component);
	const newApp = new FirebaseAppImpl(options, config, container);
	_apps.set(name, newApp);
	return newApp;
}
function initializeServerApp(_options, _serverAppConfig = {}) {
	if (isBrowser() && !isWebWorker()) throw ERROR_FACTORY.create("invalid-server-app-environment");
	let firebaseOptions;
	let serverAppSettings = _serverAppConfig || {};
	if (_options) if (_isFirebaseApp(_options)) firebaseOptions = _options.options;
	else if (_isFirebaseServerAppSettings(_options)) serverAppSettings = _options;
	else firebaseOptions = _options;
	if (serverAppSettings.automaticDataCollectionEnabled === void 0) serverAppSettings.automaticDataCollectionEnabled = true;
	firebaseOptions || (firebaseOptions = getDefaultAppConfig());
	if (!firebaseOptions) throw ERROR_FACTORY.create("no-options");
	const nameObj = {
		...serverAppSettings,
		...firebaseOptions
	};
	if (nameObj.releaseOnDeref !== void 0) delete nameObj.releaseOnDeref;
	const hashCode = (s) => {
		return [...s].reduce((hash, c) => Math.imul(31, hash) + c.charCodeAt(0) | 0, 0);
	};
	if (serverAppSettings.releaseOnDeref !== void 0) {
		if (typeof FinalizationRegistry === "undefined") throw ERROR_FACTORY.create("finalization-registry-not-supported", {});
	}
	const nameString = "" + hashCode(JSON.stringify(nameObj));
	const existingApp = _serverApps.get(nameString);
	if (existingApp) {
		existingApp.incRefCount(serverAppSettings.releaseOnDeref);
		return existingApp;
	}
	const container = new ComponentContainer(nameString);
	for (const component of _components.values()) container.addComponent(component);
	const newApp = new FirebaseServerAppImpl(firebaseOptions, serverAppSettings, nameString, container);
	_serverApps.set(nameString, newApp);
	return newApp;
}
/**
* Retrieves a {@link @firebase/app#FirebaseApp} instance.
*
* When called with no arguments, the default app is returned. When an app name
* is provided, the app corresponding to that name is returned.
*
* An exception is thrown if the app being retrieved has not yet been
* initialized.
*
* @example
* ```javascript
* // Return the default app
* const app = getApp();
* ```
*
* @example
* ```javascript
* // Return a named app
* const otherApp = getApp("otherApp");
* ```
*
* @param name - Optional name of the app to return. If no name is
*   provided, the default is `"[DEFAULT]"`.
*
* @returns The app corresponding to the provided app name.
*   If no app name is provided, the default app is returned.
*
* @public
*/
function getApp(name = DEFAULT_ENTRY_NAME) {
	const app = _apps.get(name);
	if (!app && name === "[DEFAULT]" && getDefaultAppConfig()) return initializeApp();
	if (!app) throw ERROR_FACTORY.create("no-app", { appName: name });
	return app;
}
/**
* A (read-only) array of all initialized apps.
* @public
*/
function getApps() {
	return Array.from(_apps.values());
}
/**
* Renders this app unusable and frees the resources of all associated
* services.
*
* @example
* ```javascript
* deleteApp(app)
*   .then(function() {
*     console.log("App deleted successfully");
*   })
*   .catch(function(error) {
*     console.log("Error deleting app:", error);
*   });
* ```
*
* @public
*/
async function deleteApp(app) {
	let cleanupProviders = false;
	const name = app.name;
	if (_apps.has(name)) {
		cleanupProviders = true;
		_apps.delete(name);
	} else if (_serverApps.has(name)) {
		if (app.decRefCount() <= 0) {
			_serverApps.delete(name);
			cleanupProviders = true;
		}
	}
	if (cleanupProviders) {
		await Promise.all(app.container.getProviders().map((provider) => provider.delete()));
		app.isDeleted = true;
	}
}
/**
* Registers a library's name and version for platform logging purposes.
* @param library - Name of 1p or 3p library (e.g. firestore, angularfire)
* @param version - Current version of that library.
* @param variant - Bundle variant, e.g., node, rn, etc.
*
* @public
*/
function registerVersion(libraryKeyOrName, version, variant) {
	let library = PLATFORM_LOG_STRING[libraryKeyOrName] ?? libraryKeyOrName;
	if (variant) library += `-${variant}`;
	const libraryMismatch = library.match(/\s|\//);
	const versionMismatch = version.match(/\s|\//);
	if (libraryMismatch || versionMismatch) {
		const warning = [`Unable to register library "${library}" with version "${version}":`];
		if (libraryMismatch) warning.push(`library name "${library}" contains illegal characters (whitespace or "/")`);
		if (libraryMismatch && versionMismatch) warning.push("and");
		if (versionMismatch) warning.push(`version name "${version}" contains illegal characters (whitespace or "/")`);
		logger.warn(warning.join(" "));
		return;
	}
	_registerComponent(new Component(`${library}-version`, () => ({
		library,
		version
	}), "VERSION"));
}
/**
* Sets log handler for all Firebase SDKs.
* @param logCallback - An optional custom log handler that executes user code whenever
* the Firebase SDK makes a logging call.
*
* @public
*/
function onLog(logCallback, options) {
	if (logCallback !== null && typeof logCallback !== "function") throw ERROR_FACTORY.create("invalid-log-argument");
	setUserLogHandler(logCallback, options);
}
/**
* Sets log level for all Firebase SDKs.
*
* All of the log types above the current log level are captured (i.e. if
* you set the log level to `info`, errors are logged, but `debug` and
* `verbose` logs are not).
*
* @public
*/
function setLogLevel(logLevel) {
	setLogLevel$1(logLevel);
}
/**
* @license
* Copyright 2021 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var DB_NAME = "firebase-heartbeat-database";
var DB_VERSION = 1;
var STORE_NAME = "firebase-heartbeat-store";
var dbPromise = null;
function getDbPromise() {
	if (!dbPromise) dbPromise = openDB(DB_NAME, DB_VERSION, { upgrade: (db, oldVersion) => {
		switch (oldVersion) {
			case 0: try {
				db.createObjectStore(STORE_NAME);
			} catch (e) {
				console.warn(e);
			}
		}
	} }).catch((e) => {
		throw ERROR_FACTORY.create("idb-open", { originalErrorMessage: e.message });
	});
	return dbPromise;
}
async function readHeartbeatsFromIndexedDB(app) {
	try {
		const tx = (await getDbPromise()).transaction(STORE_NAME);
		const result = await tx.objectStore(STORE_NAME).get(computeKey(app));
		await tx.done;
		return result;
	} catch (e) {
		if (e instanceof FirebaseError) logger.warn(e.message);
		else {
			const idbGetError = ERROR_FACTORY.create("idb-get", { originalErrorMessage: e?.message });
			logger.warn(idbGetError.message);
		}
	}
}
async function writeHeartbeatsToIndexedDB(app, heartbeatObject) {
	try {
		const tx = (await getDbPromise()).transaction(STORE_NAME, "readwrite");
		await tx.objectStore(STORE_NAME).put(heartbeatObject, computeKey(app));
		await tx.done;
	} catch (e) {
		if (e instanceof FirebaseError) logger.warn(e.message);
		else {
			const idbGetError = ERROR_FACTORY.create("idb-set", { originalErrorMessage: e?.message });
			logger.warn(idbGetError.message);
		}
	}
}
function computeKey(app) {
	return `${app.name}!${app.options.appId}`;
}
/**
* @license
* Copyright 2021 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var MAX_HEADER_BYTES = 1024;
var MAX_NUM_STORED_HEARTBEATS = 30;
var HeartbeatServiceImpl = class {
	constructor(container) {
		this.container = container;
		/**
		* In-memory cache for heartbeats, used by getHeartbeatsHeader() to generate
		* the header string.
		* Stores one record per date. This will be consolidated into the standard
		* format of one record per user agent string before being sent as a header.
		* Populated from indexedDB when the controller is instantiated and should
		* be kept in sync with indexedDB.
		* Leave public for easier testing.
		*/
		this._heartbeatsCache = null;
		const app = this.container.getProvider("app").getImmediate();
		this._storage = new HeartbeatStorageImpl(app);
		this._heartbeatsCachePromise = this._storage.read().then((result) => {
			this._heartbeatsCache = result;
			return result;
		});
	}
	/**
	* Called to report a heartbeat. The function will generate
	* a HeartbeatsByUserAgent object, update heartbeatsCache, and persist it
	* to IndexedDB.
	* Note that we only store one heartbeat per day. So if a heartbeat for today is
	* already logged, subsequent calls to this function in the same day will be ignored.
	*/
	async triggerHeartbeat() {
		try {
			const agent = this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString();
			const date = getUTCDateString();
			if (this._heartbeatsCache?.heartbeats == null) {
				this._heartbeatsCache = await this._heartbeatsCachePromise;
				if (this._heartbeatsCache?.heartbeats == null) return;
			}
			if (this._heartbeatsCache.lastSentHeartbeatDate === date || this._heartbeatsCache.heartbeats.some((singleDateHeartbeat) => singleDateHeartbeat.date === date)) return;
			else {
				this._heartbeatsCache.heartbeats.push({
					date,
					agent
				});
				if (this._heartbeatsCache.heartbeats.length > MAX_NUM_STORED_HEARTBEATS) {
					const earliestHeartbeatIdx = getEarliestHeartbeatIdx(this._heartbeatsCache.heartbeats);
					this._heartbeatsCache.heartbeats.splice(earliestHeartbeatIdx, 1);
				}
			}
			return this._storage.overwrite(this._heartbeatsCache);
		} catch (e) {
			logger.warn(e);
		}
	}
	/**
	* Returns a base64 encoded string which can be attached to the heartbeat-specific header directly.
	* It also clears all heartbeats from memory as well as in IndexedDB.
	*
	* NOTE: Consuming product SDKs should not send the header if this method
	* returns an empty string.
	*/
	async getHeartbeatsHeader() {
		try {
			if (this._heartbeatsCache === null) await this._heartbeatsCachePromise;
			if (this._heartbeatsCache?.heartbeats == null || this._heartbeatsCache.heartbeats.length === 0) return "";
			const date = getUTCDateString();
			const { heartbeatsToSend, unsentEntries } = extractHeartbeatsForHeader(this._heartbeatsCache.heartbeats);
			const headerString = base64urlEncodeWithoutPadding(JSON.stringify({
				version: 2,
				heartbeats: heartbeatsToSend
			}));
			this._heartbeatsCache.lastSentHeartbeatDate = date;
			if (unsentEntries.length > 0) {
				this._heartbeatsCache.heartbeats = unsentEntries;
				await this._storage.overwrite(this._heartbeatsCache);
			} else {
				this._heartbeatsCache.heartbeats = [];
				this._storage.overwrite(this._heartbeatsCache);
			}
			return headerString;
		} catch (e) {
			logger.warn(e);
			return "";
		}
	}
};
function getUTCDateString() {
	return (/* @__PURE__ */ new Date()).toISOString().substring(0, 10);
}
function extractHeartbeatsForHeader(heartbeatsCache, maxSize = MAX_HEADER_BYTES) {
	const heartbeatsToSend = [];
	let unsentEntries = heartbeatsCache.slice();
	for (const singleDateHeartbeat of heartbeatsCache) {
		const heartbeatEntry = heartbeatsToSend.find((hb) => hb.agent === singleDateHeartbeat.agent);
		if (!heartbeatEntry) {
			heartbeatsToSend.push({
				agent: singleDateHeartbeat.agent,
				dates: [singleDateHeartbeat.date]
			});
			if (countBytes(heartbeatsToSend) > maxSize) {
				heartbeatsToSend.pop();
				break;
			}
		} else {
			heartbeatEntry.dates.push(singleDateHeartbeat.date);
			if (countBytes(heartbeatsToSend) > maxSize) {
				heartbeatEntry.dates.pop();
				break;
			}
		}
		unsentEntries = unsentEntries.slice(1);
	}
	return {
		heartbeatsToSend,
		unsentEntries
	};
}
var HeartbeatStorageImpl = class {
	constructor(app) {
		this.app = app;
		this._canUseIndexedDBPromise = this.runIndexedDBEnvironmentCheck();
	}
	async runIndexedDBEnvironmentCheck() {
		if (!isIndexedDBAvailable()) return false;
		else return validateIndexedDBOpenable().then(() => true).catch(() => false);
	}
	/**
	* Read all heartbeats.
	*/
	async read() {
		if (!await this._canUseIndexedDBPromise) return { heartbeats: [] };
		else {
			const idbHeartbeatObject = await readHeartbeatsFromIndexedDB(this.app);
			if (idbHeartbeatObject?.heartbeats) return idbHeartbeatObject;
			else return { heartbeats: [] };
		}
	}
	async overwrite(heartbeatsObject) {
		if (!await this._canUseIndexedDBPromise) return;
		else {
			const existingHeartbeatsObject = await this.read();
			return writeHeartbeatsToIndexedDB(this.app, {
				lastSentHeartbeatDate: heartbeatsObject.lastSentHeartbeatDate ?? existingHeartbeatsObject.lastSentHeartbeatDate,
				heartbeats: heartbeatsObject.heartbeats
			});
		}
	}
	async add(heartbeatsObject) {
		if (!await this._canUseIndexedDBPromise) return;
		else {
			const existingHeartbeatsObject = await this.read();
			return writeHeartbeatsToIndexedDB(this.app, {
				lastSentHeartbeatDate: heartbeatsObject.lastSentHeartbeatDate ?? existingHeartbeatsObject.lastSentHeartbeatDate,
				heartbeats: [...existingHeartbeatsObject.heartbeats, ...heartbeatsObject.heartbeats]
			});
		}
	}
};
/**
* Calculate bytes of a HeartbeatsByUserAgent array after being wrapped
* in a platform logging header JSON object, stringified, and converted
* to base 64.
*/
function countBytes(heartbeatsCache) {
	return base64urlEncodeWithoutPadding(JSON.stringify({
		version: 2,
		heartbeats: heartbeatsCache
	})).length;
}
/**
* Returns the index of the heartbeat with the earliest date.
* If the heartbeats array is empty, -1 is returned.
*/
function getEarliestHeartbeatIdx(heartbeats) {
	if (heartbeats.length === 0) return -1;
	let earliestHeartbeatIdx = 0;
	let earliestHeartbeatDate = heartbeats[0].date;
	for (let i = 1; i < heartbeats.length; i++) if (heartbeats[i].date < earliestHeartbeatDate) {
		earliestHeartbeatDate = heartbeats[i].date;
		earliestHeartbeatIdx = i;
	}
	return earliestHeartbeatIdx;
}
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function registerCoreComponents(variant) {
	_registerComponent(new Component("platform-logger", (container) => new PlatformLoggerServiceImpl(container), "PRIVATE"));
	_registerComponent(new Component("heartbeat", (container) => new HeartbeatServiceImpl(container), "PRIVATE"));
	registerVersion(name$q, version$1, variant);
	registerVersion(name$q, version$1, "esm2020");
	registerVersion("fire-js", "");
}
/**
* Firebase App
*
* @remarks This package coordinates the communication between the different Firebase components
* @packageDocumentation
*/
registerCoreComponents("");
//#endregion
export { base64Decode as A, getUA as B, setLogLevel as C, Deferred as D, Component as E, extractQuerystring as F, isIE as G, isCloudWorkstation as H, getDefaultEmulatorHost as I, isNode as J, isIndexedDBAvailable as K, getExperimentalSetting as L, createSubscribe as M, deepEqual as N, ErrorFactory as O, deepExtend as P, querystringDecode as Q, getGlobal as R, registerVersion as S, Logger as T, isCloudflareWorker as U, isBrowserExtension as V, isEmpty as W, pingServer as X, isReactNative as Y, querystring as Z, getApps as _, _apps as a, initializeServerApp as b, _getProvider as c, _isFirebaseServerAppSettings as d, _registerComponent as f, getApp as g, deleteApp as h, _addOrOverwriteComponent as i, contains as j, FirebaseError as k, _isFirebaseApp as l, _serverApps as m, SDK_VERSION as n, _clearComponents as o, _removeServiceInstance as p, isMobileCordova as q, _addComponent as r, _components as s, DEFAULT_ENTRY_NAME as t, _isFirebaseServerApp as u, index_esm_exports as v, LogLevel as w, onLog as x, initializeApp as y, getModularInstance as z };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguZXNtLTJTS29IOUQ1LmpzIiwibmFtZXMiOlsiZGF0ZVZhbHVlIiwiREVGQVVMVF9FTlRSWV9OQU1FIiwic2V0TG9nTGV2ZWwiLCJhcHBJbXBsIiwiZmlyZWJhc2VTZXJ2ZXJBcHAiXSwic291cmNlcyI6WyIuLi8uLi9AZmlyZWJhc2UvdXRpbC9kaXN0L3Bvc3RpbnN0YWxsLm1qcyIsIi4uLy4uL0BmaXJlYmFzZS91dGlsL2Rpc3QvaW5kZXguZXNtLmpzIiwiLi4vLi4vQGZpcmViYXNlL2NvbXBvbmVudC9kaXN0L2VzbS9pbmRleC5lc20uanMiLCIuLi8uLi9AZmlyZWJhc2UvbG9nZ2VyL2Rpc3QvZXNtL2luZGV4LmVzbS5qcyIsIi4uLy4uL2lkYi9idWlsZC93cmFwLWlkYi12YWx1ZS5qcyIsIi4uLy4uL2lkYi9idWlsZC9pbmRleC5qcyIsIi4uLy4uL0BmaXJlYmFzZS9hcHAvZGlzdC9lc20vaW5kZXguZXNtLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGdldERlZmF1bHRzRnJvbVBvc3RpbnN0YWxsID0gKCkgPT4gKHVuZGVmaW5lZCk7XG5leHBvcnQgeyBnZXREZWZhdWx0c0Zyb21Qb3N0aW5zdGFsbCB9OyIsImltcG9ydCB7IGdldERlZmF1bHRzRnJvbVBvc3RpbnN0YWxsIH0gZnJvbSAnLi9wb3N0aW5zdGFsbC5tanMnO1xuXG4vKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IEZpcmViYXNlIGNvbnN0YW50cy4gIFNvbWUgb2YgdGhlc2UgKEBkZWZpbmVzKSBjYW4gYmUgb3ZlcnJpZGRlbiBhdCBjb21waWxlLXRpbWUuXG4gKi9cbmNvbnN0IENPTlNUQU5UUyA9IHtcbiAgICAvKipcbiAgICAgKiBAZGVmaW5lIHtib29sZWFufSBXaGV0aGVyIHRoaXMgaXMgdGhlIGNsaWVudCBOb2RlLmpzIFNESy5cbiAgICAgKi9cbiAgICBOT0RFX0NMSUVOVDogZmFsc2UsXG4gICAgLyoqXG4gICAgICogQGRlZmluZSB7Ym9vbGVhbn0gV2hldGhlciB0aGlzIGlzIHRoZSBBZG1pbiBOb2RlLmpzIFNESy5cbiAgICAgKi9cbiAgICBOT0RFX0FETUlOOiBmYWxzZSxcbiAgICAvKipcbiAgICAgKiBGaXJlYmFzZSBTREsgVmVyc2lvblxuICAgICAqL1xuICAgIFNES19WRVJTSU9OOiAnJHtKU0NPUkVfVkVSU0lPTn0nXG59O1xuXG4vKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuLyoqXG4gKiBUaHJvd3MgYW4gZXJyb3IgaWYgdGhlIHByb3ZpZGVkIGFzc2VydGlvbiBpcyBmYWxzeVxuICovXG5jb25zdCBhc3NlcnQgPSBmdW5jdGlvbiAoYXNzZXJ0aW9uLCBtZXNzYWdlKSB7XG4gICAgaWYgKCFhc3NlcnRpb24pIHtcbiAgICAgICAgdGhyb3cgYXNzZXJ0aW9uRXJyb3IobWVzc2FnZSk7XG4gICAgfVxufTtcbi8qKlxuICogUmV0dXJucyBhbiBFcnJvciBvYmplY3Qgc3VpdGFibGUgZm9yIHRocm93aW5nLlxuICovXG5jb25zdCBhc3NlcnRpb25FcnJvciA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgcmV0dXJuIG5ldyBFcnJvcignRmlyZWJhc2UgRGF0YWJhc2UgKCcgK1xuICAgICAgICBDT05TVEFOVFMuU0RLX1ZFUlNJT04gK1xuICAgICAgICAnKSBJTlRFUk5BTCBBU1NFUlQgRkFJTEVEOiAnICtcbiAgICAgICAgbWVzc2FnZSk7XG59O1xuXG4vKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuY29uc3Qgc3RyaW5nVG9CeXRlQXJyYXkkMSA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgICAvLyBUT0RPKHVzZXIpOiBVc2UgbmF0aXZlIGltcGxlbWVudGF0aW9ucyBpZi93aGVuIGF2YWlsYWJsZVxuICAgIGNvbnN0IG91dCA9IFtdO1xuICAgIGxldCBwID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgYyA9IHN0ci5jaGFyQ29kZUF0KGkpO1xuICAgICAgICBpZiAoYyA8IDEyOCkge1xuICAgICAgICAgICAgb3V0W3ArK10gPSBjO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGMgPCAyMDQ4KSB7XG4gICAgICAgICAgICBvdXRbcCsrXSA9IChjID4+IDYpIHwgMTkyO1xuICAgICAgICAgICAgb3V0W3ArK10gPSAoYyAmIDYzKSB8IDEyODtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICgoYyAmIDB4ZmMwMCkgPT09IDB4ZDgwMCAmJlxuICAgICAgICAgICAgaSArIDEgPCBzdHIubGVuZ3RoICYmXG4gICAgICAgICAgICAoc3RyLmNoYXJDb2RlQXQoaSArIDEpICYgMHhmYzAwKSA9PT0gMHhkYzAwKSB7XG4gICAgICAgICAgICAvLyBTdXJyb2dhdGUgUGFpclxuICAgICAgICAgICAgYyA9IDB4MTAwMDAgKyAoKGMgJiAweDAzZmYpIDw8IDEwKSArIChzdHIuY2hhckNvZGVBdCgrK2kpICYgMHgwM2ZmKTtcbiAgICAgICAgICAgIG91dFtwKytdID0gKGMgPj4gMTgpIHwgMjQwO1xuICAgICAgICAgICAgb3V0W3ArK10gPSAoKGMgPj4gMTIpICYgNjMpIHwgMTI4O1xuICAgICAgICAgICAgb3V0W3ArK10gPSAoKGMgPj4gNikgJiA2MykgfCAxMjg7XG4gICAgICAgICAgICBvdXRbcCsrXSA9IChjICYgNjMpIHwgMTI4O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgb3V0W3ArK10gPSAoYyA+PiAxMikgfCAyMjQ7XG4gICAgICAgICAgICBvdXRbcCsrXSA9ICgoYyA+PiA2KSAmIDYzKSB8IDEyODtcbiAgICAgICAgICAgIG91dFtwKytdID0gKGMgJiA2MykgfCAxMjg7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG91dDtcbn07XG4vKipcbiAqIFR1cm5zIGFuIGFycmF5IG9mIG51bWJlcnMgaW50byB0aGUgc3RyaW5nIGdpdmVuIGJ5IHRoZSBjb25jYXRlbmF0aW9uIG9mIHRoZVxuICogY2hhcmFjdGVycyB0byB3aGljaCB0aGUgbnVtYmVycyBjb3JyZXNwb25kLlxuICogQHBhcmFtIGJ5dGVzIEFycmF5IG9mIG51bWJlcnMgcmVwcmVzZW50aW5nIGNoYXJhY3RlcnMuXG4gKiBAcmV0dXJuIFN0cmluZ2lmaWNhdGlvbiBvZiB0aGUgYXJyYXkuXG4gKi9cbmNvbnN0IGJ5dGVBcnJheVRvU3RyaW5nID0gZnVuY3Rpb24gKGJ5dGVzKSB7XG4gICAgLy8gVE9ETyh1c2VyKTogVXNlIG5hdGl2ZSBpbXBsZW1lbnRhdGlvbnMgaWYvd2hlbiBhdmFpbGFibGVcbiAgICBjb25zdCBvdXQgPSBbXTtcbiAgICBsZXQgcG9zID0gMCwgYyA9IDA7XG4gICAgd2hpbGUgKHBvcyA8IGJ5dGVzLmxlbmd0aCkge1xuICAgICAgICBjb25zdCBjMSA9IGJ5dGVzW3BvcysrXTtcbiAgICAgICAgaWYgKGMxIDwgMTI4KSB7XG4gICAgICAgICAgICBvdXRbYysrXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoYzEpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGMxID4gMTkxICYmIGMxIDwgMjI0KSB7XG4gICAgICAgICAgICBjb25zdCBjMiA9IGJ5dGVzW3BvcysrXTtcbiAgICAgICAgICAgIG91dFtjKytdID0gU3RyaW5nLmZyb21DaGFyQ29kZSgoKGMxICYgMzEpIDw8IDYpIHwgKGMyICYgNjMpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjMSA+IDIzOSAmJiBjMSA8IDM2NSkge1xuICAgICAgICAgICAgLy8gU3Vycm9nYXRlIFBhaXJcbiAgICAgICAgICAgIGNvbnN0IGMyID0gYnl0ZXNbcG9zKytdO1xuICAgICAgICAgICAgY29uc3QgYzMgPSBieXRlc1twb3MrK107XG4gICAgICAgICAgICBjb25zdCBjNCA9IGJ5dGVzW3BvcysrXTtcbiAgICAgICAgICAgIGNvbnN0IHUgPSAoKChjMSAmIDcpIDw8IDE4KSB8ICgoYzIgJiA2MykgPDwgMTIpIHwgKChjMyAmIDYzKSA8PCA2KSB8IChjNCAmIDYzKSkgLVxuICAgICAgICAgICAgICAgIDB4MTAwMDA7XG4gICAgICAgICAgICBvdXRbYysrXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoMHhkODAwICsgKHUgPj4gMTApKTtcbiAgICAgICAgICAgIG91dFtjKytdID0gU3RyaW5nLmZyb21DaGFyQ29kZSgweGRjMDAgKyAodSAmIDEwMjMpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGMyID0gYnl0ZXNbcG9zKytdO1xuICAgICAgICAgICAgY29uc3QgYzMgPSBieXRlc1twb3MrK107XG4gICAgICAgICAgICBvdXRbYysrXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoKChjMSAmIDE1KSA8PCAxMikgfCAoKGMyICYgNjMpIDw8IDYpIHwgKGMzICYgNjMpKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb3V0LmpvaW4oJycpO1xufTtcbi8vIFdlIGRlZmluZSBpdCBhcyBhbiBvYmplY3QgbGl0ZXJhbCBpbnN0ZWFkIG9mIGEgY2xhc3MgYmVjYXVzZSBhIGNsYXNzIGNvbXBpbGVkIGRvd24gdG8gZXM1IGNhbid0XG4vLyBiZSB0cmVlc2hha2VkLiBodHRwczovL2dpdGh1Yi5jb20vcm9sbHVwL3JvbGx1cC9pc3N1ZXMvMTY5MVxuLy8gU3RhdGljIGxvb2t1cCBtYXBzLCBsYXppbHkgcG9wdWxhdGVkIGJ5IGluaXRfKClcbi8vIFRPRE8oZGxhcm9jcXVlKTogRGVmaW5lIHRoaXMgYXMgYSBjbGFzcywgc2luY2Ugd2Ugbm8gbG9uZ2VyIHRhcmdldCBFUzUuXG5jb25zdCBiYXNlNjQgPSB7XG4gICAgLyoqXG4gICAgICogTWFwcyBieXRlcyB0byBjaGFyYWN0ZXJzLlxuICAgICAqL1xuICAgIGJ5dGVUb0NoYXJNYXBfOiBudWxsLFxuICAgIC8qKlxuICAgICAqIE1hcHMgY2hhcmFjdGVycyB0byBieXRlcy5cbiAgICAgKi9cbiAgICBjaGFyVG9CeXRlTWFwXzogbnVsbCxcbiAgICAvKipcbiAgICAgKiBNYXBzIGJ5dGVzIHRvIHdlYnNhZmUgY2hhcmFjdGVycy5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGJ5dGVUb0NoYXJNYXBXZWJTYWZlXzogbnVsbCxcbiAgICAvKipcbiAgICAgKiBNYXBzIHdlYnNhZmUgY2hhcmFjdGVycyB0byBieXRlcy5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGNoYXJUb0J5dGVNYXBXZWJTYWZlXzogbnVsbCxcbiAgICAvKipcbiAgICAgKiBPdXIgZGVmYXVsdCBhbHBoYWJldCwgc2hhcmVkIGJldHdlZW5cbiAgICAgKiBFTkNPREVEX1ZBTFMgYW5kIEVOQ09ERURfVkFMU19XRUJTQUZFXG4gICAgICovXG4gICAgRU5DT0RFRF9WQUxTX0JBU0U6ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWicgKyAnYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXonICsgJzAxMjM0NTY3ODknLFxuICAgIC8qKlxuICAgICAqIE91ciBkZWZhdWx0IGFscGhhYmV0LiBWYWx1ZSA2NCAoPSkgaXMgc3BlY2lhbDsgaXQgbWVhbnMgXCJub3RoaW5nLlwiXG4gICAgICovXG4gICAgZ2V0IEVOQ09ERURfVkFMUygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuRU5DT0RFRF9WQUxTX0JBU0UgKyAnKy89JztcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIE91ciB3ZWJzYWZlIGFscGhhYmV0LlxuICAgICAqL1xuICAgIGdldCBFTkNPREVEX1ZBTFNfV0VCU0FGRSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuRU5DT0RFRF9WQUxTX0JBU0UgKyAnLV8uJztcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFdoZXRoZXIgdGhpcyBicm93c2VyIHN1cHBvcnRzIHRoZSBhdG9iIGFuZCBidG9hIGZ1bmN0aW9ucy4gVGhpcyBleHRlbnNpb25cbiAgICAgKiBzdGFydGVkIGF0IE1vemlsbGEgYnV0IGlzIG5vdyBpbXBsZW1lbnRlZCBieSBtYW55IGJyb3dzZXJzLiBXZSB1c2UgdGhlXG4gICAgICogQVNTVU1FXyogdmFyaWFibGVzIHRvIGF2b2lkIHB1bGxpbmcgaW4gdGhlIGZ1bGwgdXNlcmFnZW50IGRldGVjdGlvbiBsaWJyYXJ5XG4gICAgICogYnV0IHN0aWxsIGFsbG93aW5nIHRoZSBzdGFuZGFyZCBwZXItYnJvd3NlciBjb21waWxhdGlvbnMuXG4gICAgICpcbiAgICAgKi9cbiAgICBIQVNfTkFUSVZFX1NVUFBPUlQ6IHR5cGVvZiBhdG9iID09PSAnZnVuY3Rpb24nLFxuICAgIC8qKlxuICAgICAqIEJhc2U2NC1lbmNvZGUgYW4gYXJyYXkgb2YgYnl0ZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5wdXQgQW4gYXJyYXkgb2YgYnl0ZXMgKG51bWJlcnMgd2l0aFxuICAgICAqICAgICB2YWx1ZSBpbiBbMCwgMjU1XSkgdG8gZW5jb2RlLlxuICAgICAqIEBwYXJhbSB3ZWJTYWZlIEJvb2xlYW4gaW5kaWNhdGluZyB3ZSBzaG91bGQgdXNlIHRoZVxuICAgICAqICAgICBhbHRlcm5hdGl2ZSBhbHBoYWJldC5cbiAgICAgKiBAcmV0dXJuIFRoZSBiYXNlNjQgZW5jb2RlZCBzdHJpbmcuXG4gICAgICovXG4gICAgZW5jb2RlQnl0ZUFycmF5KGlucHV0LCB3ZWJTYWZlKSB7XG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShpbnB1dCkpIHtcbiAgICAgICAgICAgIHRocm93IEVycm9yKCdlbmNvZGVCeXRlQXJyYXkgdGFrZXMgYW4gYXJyYXkgYXMgYSBwYXJhbWV0ZXInKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmluaXRfKCk7XG4gICAgICAgIGNvbnN0IGJ5dGVUb0NoYXJNYXAgPSB3ZWJTYWZlXG4gICAgICAgICAgICA/IHRoaXMuYnl0ZVRvQ2hhck1hcFdlYlNhZmVfXG4gICAgICAgICAgICA6IHRoaXMuYnl0ZVRvQ2hhck1hcF87XG4gICAgICAgIGNvbnN0IG91dHB1dCA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGlucHV0Lmxlbmd0aDsgaSArPSAzKSB7XG4gICAgICAgICAgICBjb25zdCBieXRlMSA9IGlucHV0W2ldO1xuICAgICAgICAgICAgY29uc3QgaGF2ZUJ5dGUyID0gaSArIDEgPCBpbnB1dC5sZW5ndGg7XG4gICAgICAgICAgICBjb25zdCBieXRlMiA9IGhhdmVCeXRlMiA/IGlucHV0W2kgKyAxXSA6IDA7XG4gICAgICAgICAgICBjb25zdCBoYXZlQnl0ZTMgPSBpICsgMiA8IGlucHV0Lmxlbmd0aDtcbiAgICAgICAgICAgIGNvbnN0IGJ5dGUzID0gaGF2ZUJ5dGUzID8gaW5wdXRbaSArIDJdIDogMDtcbiAgICAgICAgICAgIGNvbnN0IG91dEJ5dGUxID0gYnl0ZTEgPj4gMjtcbiAgICAgICAgICAgIGNvbnN0IG91dEJ5dGUyID0gKChieXRlMSAmIDB4MDMpIDw8IDQpIHwgKGJ5dGUyID4+IDQpO1xuICAgICAgICAgICAgbGV0IG91dEJ5dGUzID0gKChieXRlMiAmIDB4MGYpIDw8IDIpIHwgKGJ5dGUzID4+IDYpO1xuICAgICAgICAgICAgbGV0IG91dEJ5dGU0ID0gYnl0ZTMgJiAweDNmO1xuICAgICAgICAgICAgaWYgKCFoYXZlQnl0ZTMpIHtcbiAgICAgICAgICAgICAgICBvdXRCeXRlNCA9IDY0O1xuICAgICAgICAgICAgICAgIGlmICghaGF2ZUJ5dGUyKSB7XG4gICAgICAgICAgICAgICAgICAgIG91dEJ5dGUzID0gNjQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3V0cHV0LnB1c2goYnl0ZVRvQ2hhck1hcFtvdXRCeXRlMV0sIGJ5dGVUb0NoYXJNYXBbb3V0Qnl0ZTJdLCBieXRlVG9DaGFyTWFwW291dEJ5dGUzXSwgYnl0ZVRvQ2hhck1hcFtvdXRCeXRlNF0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXRwdXQuam9pbignJyk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBCYXNlNjQtZW5jb2RlIGEgc3RyaW5nLlxuICAgICAqXG4gICAgICogQHBhcmFtIGlucHV0IEEgc3RyaW5nIHRvIGVuY29kZS5cbiAgICAgKiBAcGFyYW0gd2ViU2FmZSBJZiB0cnVlLCB3ZSBzaG91bGQgdXNlIHRoZVxuICAgICAqICAgICBhbHRlcm5hdGl2ZSBhbHBoYWJldC5cbiAgICAgKiBAcmV0dXJuIFRoZSBiYXNlNjQgZW5jb2RlZCBzdHJpbmcuXG4gICAgICovXG4gICAgZW5jb2RlU3RyaW5nKGlucHV0LCB3ZWJTYWZlKSB7XG4gICAgICAgIC8vIFNob3J0Y3V0IGZvciBNb3ppbGxhIGJyb3dzZXJzIHRoYXQgaW1wbGVtZW50XG4gICAgICAgIC8vIGEgbmF0aXZlIGJhc2U2NCBlbmNvZGVyIGluIHRoZSBmb3JtIG9mIFwiYnRvYS9hdG9iXCJcbiAgICAgICAgaWYgKHRoaXMuSEFTX05BVElWRV9TVVBQT1JUICYmICF3ZWJTYWZlKSB7XG4gICAgICAgICAgICByZXR1cm4gYnRvYShpbnB1dCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZW5jb2RlQnl0ZUFycmF5KHN0cmluZ1RvQnl0ZUFycmF5JDEoaW5wdXQpLCB3ZWJTYWZlKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEJhc2U2NC1kZWNvZGUgYSBzdHJpbmcuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5wdXQgdG8gZGVjb2RlLlxuICAgICAqIEBwYXJhbSB3ZWJTYWZlIFRydWUgaWYgd2Ugc2hvdWxkIHVzZSB0aGVcbiAgICAgKiAgICAgYWx0ZXJuYXRpdmUgYWxwaGFiZXQuXG4gICAgICogQHJldHVybiBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBkZWNvZGVkIHZhbHVlLlxuICAgICAqL1xuICAgIGRlY29kZVN0cmluZyhpbnB1dCwgd2ViU2FmZSkge1xuICAgICAgICAvLyBTaG9ydGN1dCBmb3IgTW96aWxsYSBicm93c2VycyB0aGF0IGltcGxlbWVudFxuICAgICAgICAvLyBhIG5hdGl2ZSBiYXNlNjQgZW5jb2RlciBpbiB0aGUgZm9ybSBvZiBcImJ0b2EvYXRvYlwiXG4gICAgICAgIGlmICh0aGlzLkhBU19OQVRJVkVfU1VQUE9SVCAmJiAhd2ViU2FmZSkge1xuICAgICAgICAgICAgcmV0dXJuIGF0b2IoaW5wdXQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBieXRlQXJyYXlUb1N0cmluZyh0aGlzLmRlY29kZVN0cmluZ1RvQnl0ZUFycmF5KGlucHV0LCB3ZWJTYWZlKSk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBCYXNlNjQtZGVjb2RlIGEgc3RyaW5nLlxuICAgICAqXG4gICAgICogSW4gYmFzZS02NCBkZWNvZGluZywgZ3JvdXBzIG9mIGZvdXIgY2hhcmFjdGVycyBhcmUgY29udmVydGVkIGludG8gdGhyZWVcbiAgICAgKiBieXRlcy4gIElmIHRoZSBlbmNvZGVyIGRpZCBub3QgYXBwbHkgcGFkZGluZywgdGhlIGlucHV0IGxlbmd0aCBtYXkgbm90XG4gICAgICogYmUgYSBtdWx0aXBsZSBvZiA0LlxuICAgICAqXG4gICAgICogSW4gdGhpcyBjYXNlLCB0aGUgbGFzdCBncm91cCB3aWxsIGhhdmUgZmV3ZXIgdGhhbiA0IGNoYXJhY3RlcnMsIGFuZFxuICAgICAqIHBhZGRpbmcgd2lsbCBiZSBpbmZlcnJlZC4gIElmIHRoZSBncm91cCBoYXMgb25lIG9yIHR3byBjaGFyYWN0ZXJzLCBpdCBkZWNvZGVzXG4gICAgICogdG8gb25lIGJ5dGUuICBJZiB0aGUgZ3JvdXAgaGFzIHRocmVlIGNoYXJhY3RlcnMsIGl0IGRlY29kZXMgdG8gdHdvIGJ5dGVzLlxuICAgICAqXG4gICAgICogQHBhcmFtIGlucHV0IElucHV0IHRvIGRlY29kZS5cbiAgICAgKiBAcGFyYW0gd2ViU2FmZSBUcnVlIGlmIHdlIHNob3VsZCB1c2UgdGhlIHdlYi1zYWZlIGFscGhhYmV0LlxuICAgICAqIEByZXR1cm4gYnl0ZXMgcmVwcmVzZW50aW5nIHRoZSBkZWNvZGVkIHZhbHVlLlxuICAgICAqL1xuICAgIGRlY29kZVN0cmluZ1RvQnl0ZUFycmF5KGlucHV0LCB3ZWJTYWZlKSB7XG4gICAgICAgIHRoaXMuaW5pdF8oKTtcbiAgICAgICAgY29uc3QgY2hhclRvQnl0ZU1hcCA9IHdlYlNhZmVcbiAgICAgICAgICAgID8gdGhpcy5jaGFyVG9CeXRlTWFwV2ViU2FmZV9cbiAgICAgICAgICAgIDogdGhpcy5jaGFyVG9CeXRlTWFwXztcbiAgICAgICAgY29uc3Qgb3V0cHV0ID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5wdXQubGVuZ3RoOykge1xuICAgICAgICAgICAgY29uc3QgYnl0ZTEgPSBjaGFyVG9CeXRlTWFwW2lucHV0LmNoYXJBdChpKyspXTtcbiAgICAgICAgICAgIGNvbnN0IGhhdmVCeXRlMiA9IGkgPCBpbnB1dC5sZW5ndGg7XG4gICAgICAgICAgICBjb25zdCBieXRlMiA9IGhhdmVCeXRlMiA/IGNoYXJUb0J5dGVNYXBbaW5wdXQuY2hhckF0KGkpXSA6IDA7XG4gICAgICAgICAgICArK2k7XG4gICAgICAgICAgICBjb25zdCBoYXZlQnl0ZTMgPSBpIDwgaW5wdXQubGVuZ3RoO1xuICAgICAgICAgICAgY29uc3QgYnl0ZTMgPSBoYXZlQnl0ZTMgPyBjaGFyVG9CeXRlTWFwW2lucHV0LmNoYXJBdChpKV0gOiA2NDtcbiAgICAgICAgICAgICsraTtcbiAgICAgICAgICAgIGNvbnN0IGhhdmVCeXRlNCA9IGkgPCBpbnB1dC5sZW5ndGg7XG4gICAgICAgICAgICBjb25zdCBieXRlNCA9IGhhdmVCeXRlNCA/IGNoYXJUb0J5dGVNYXBbaW5wdXQuY2hhckF0KGkpXSA6IDY0O1xuICAgICAgICAgICAgKytpO1xuICAgICAgICAgICAgaWYgKGJ5dGUxID09IG51bGwgfHwgYnl0ZTIgPT0gbnVsbCB8fCBieXRlMyA9PSBudWxsIHx8IGJ5dGU0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRGVjb2RlQmFzZTY0U3RyaW5nRXJyb3IoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG91dEJ5dGUxID0gKGJ5dGUxIDw8IDIpIHwgKGJ5dGUyID4+IDQpO1xuICAgICAgICAgICAgb3V0cHV0LnB1c2gob3V0Qnl0ZTEpO1xuICAgICAgICAgICAgaWYgKGJ5dGUzICE9PSA2NCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG91dEJ5dGUyID0gKChieXRlMiA8PCA0KSAmIDB4ZjApIHwgKGJ5dGUzID4+IDIpO1xuICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKG91dEJ5dGUyKTtcbiAgICAgICAgICAgICAgICBpZiAoYnl0ZTQgIT09IDY0KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG91dEJ5dGUzID0gKChieXRlMyA8PCA2KSAmIDB4YzApIHwgYnl0ZTQ7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKG91dEJ5dGUzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIExhenkgc3RhdGljIGluaXRpYWxpemF0aW9uIGZ1bmN0aW9uLiBDYWxsZWQgYmVmb3JlXG4gICAgICogYWNjZXNzaW5nIGFueSBvZiB0aGUgc3RhdGljIG1hcCB2YXJpYWJsZXMuXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBpbml0XygpIHtcbiAgICAgICAgaWYgKCF0aGlzLmJ5dGVUb0NoYXJNYXBfKSB7XG4gICAgICAgICAgICB0aGlzLmJ5dGVUb0NoYXJNYXBfID0ge307XG4gICAgICAgICAgICB0aGlzLmNoYXJUb0J5dGVNYXBfID0ge307XG4gICAgICAgICAgICB0aGlzLmJ5dGVUb0NoYXJNYXBXZWJTYWZlXyA9IHt9O1xuICAgICAgICAgICAgdGhpcy5jaGFyVG9CeXRlTWFwV2ViU2FmZV8gPSB7fTtcbiAgICAgICAgICAgIC8vIFdlIHdhbnQgcXVpY2sgbWFwcGluZ3MgYmFjayBhbmQgZm9ydGgsIHNvIHdlIHByZWNvbXB1dGUgdHdvIG1hcHMuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuRU5DT0RFRF9WQUxTLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ieXRlVG9DaGFyTWFwX1tpXSA9IHRoaXMuRU5DT0RFRF9WQUxTLmNoYXJBdChpKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNoYXJUb0J5dGVNYXBfW3RoaXMuYnl0ZVRvQ2hhck1hcF9baV1dID0gaTtcbiAgICAgICAgICAgICAgICB0aGlzLmJ5dGVUb0NoYXJNYXBXZWJTYWZlX1tpXSA9IHRoaXMuRU5DT0RFRF9WQUxTX1dFQlNBRkUuY2hhckF0KGkpO1xuICAgICAgICAgICAgICAgIHRoaXMuY2hhclRvQnl0ZU1hcFdlYlNhZmVfW3RoaXMuYnl0ZVRvQ2hhck1hcFdlYlNhZmVfW2ldXSA9IGk7XG4gICAgICAgICAgICAgICAgLy8gQmUgZm9yZ2l2aW5nIHdoZW4gZGVjb2RpbmcgYW5kIGNvcnJlY3RseSBkZWNvZGUgYm90aCBlbmNvZGluZ3MuXG4gICAgICAgICAgICAgICAgaWYgKGkgPj0gdGhpcy5FTkNPREVEX1ZBTFNfQkFTRS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFyVG9CeXRlTWFwX1t0aGlzLkVOQ09ERURfVkFMU19XRUJTQUZFLmNoYXJBdChpKV0gPSBpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYXJUb0J5dGVNYXBXZWJTYWZlX1t0aGlzLkVOQ09ERURfVkFMUy5jaGFyQXQoaSldID0gaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xuLyoqXG4gKiBBbiBlcnJvciBlbmNvdW50ZXJlZCB3aGlsZSBkZWNvZGluZyBiYXNlNjQgc3RyaW5nLlxuICovXG5jbGFzcyBEZWNvZGVCYXNlNjRTdHJpbmdFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICAgICAgdGhpcy5uYW1lID0gJ0RlY29kZUJhc2U2NFN0cmluZ0Vycm9yJztcbiAgICB9XG59XG4vKipcbiAqIFVSTC1zYWZlIGJhc2U2NCBlbmNvZGluZ1xuICovXG5jb25zdCBiYXNlNjRFbmNvZGUgPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgY29uc3QgdXRmOEJ5dGVzID0gc3RyaW5nVG9CeXRlQXJyYXkkMShzdHIpO1xuICAgIHJldHVybiBiYXNlNjQuZW5jb2RlQnl0ZUFycmF5KHV0ZjhCeXRlcywgdHJ1ZSk7XG59O1xuLyoqXG4gKiBVUkwtc2FmZSBiYXNlNjQgZW5jb2RpbmcgKHdpdGhvdXQgXCIuXCIgcGFkZGluZyBpbiB0aGUgZW5kKS5cbiAqIGUuZy4gVXNlZCBpbiBKU09OIFdlYiBUb2tlbiAoSldUKSBwYXJ0cy5cbiAqL1xuY29uc3QgYmFzZTY0dXJsRW5jb2RlV2l0aG91dFBhZGRpbmcgPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgLy8gVXNlIGJhc2U2NHVybCBlbmNvZGluZyBhbmQgcmVtb3ZlIHBhZGRpbmcgaW4gdGhlIGVuZCAoZG90IGNoYXJhY3RlcnMpLlxuICAgIHJldHVybiBiYXNlNjRFbmNvZGUoc3RyKS5yZXBsYWNlKC9cXC4vZywgJycpO1xufTtcbi8qKlxuICogVVJMLXNhZmUgYmFzZTY0IGRlY29kaW5nXG4gKlxuICogTk9URTogRE8gTk9UIHVzZSB0aGUgZ2xvYmFsIGF0b2IoKSBmdW5jdGlvbiAtIGl0IGRvZXMgTk9UIHN1cHBvcnQgdGhlXG4gKiBiYXNlNjRVcmwgdmFyaWFudCBlbmNvZGluZy5cbiAqXG4gKiBAcGFyYW0gc3RyIFRvIGJlIGRlY29kZWRcbiAqIEByZXR1cm4gRGVjb2RlZCByZXN1bHQsIGlmIHBvc3NpYmxlXG4gKi9cbmNvbnN0IGJhc2U2NERlY29kZSA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gYmFzZTY0LmRlY29kZVN0cmluZyhzdHIsIHRydWUpO1xuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdiYXNlNjREZWNvZGUgZmFpbGVkOiAnLCBlKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG59O1xuXG4vKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuLyoqXG4gKiBEbyBhIGRlZXAtY29weSBvZiBiYXNpYyBKYXZhU2NyaXB0IE9iamVjdHMgb3IgQXJyYXlzLlxuICovXG5mdW5jdGlvbiBkZWVwQ29weSh2YWx1ZSkge1xuICAgIHJldHVybiBkZWVwRXh0ZW5kKHVuZGVmaW5lZCwgdmFsdWUpO1xufVxuLyoqXG4gKiBDb3B5IHByb3BlcnRpZXMgZnJvbSBzb3VyY2UgdG8gdGFyZ2V0IChyZWN1cnNpdmVseSBhbGxvd3MgZXh0ZW5zaW9uXG4gKiBvZiBPYmplY3RzIGFuZCBBcnJheXMpLiAgU2NhbGFyIHZhbHVlcyBpbiB0aGUgdGFyZ2V0IGFyZSBvdmVyLXdyaXR0ZW4uXG4gKiBJZiB0YXJnZXQgaXMgdW5kZWZpbmVkLCBhbiBvYmplY3Qgb2YgdGhlIGFwcHJvcHJpYXRlIHR5cGUgd2lsbCBiZSBjcmVhdGVkXG4gKiAoYW5kIHJldHVybmVkKS5cbiAqXG4gKiBXZSByZWN1cnNpdmVseSBjb3B5IGFsbCBjaGlsZCBwcm9wZXJ0aWVzIG9mIHBsYWluIE9iamVjdHMgaW4gdGhlIHNvdXJjZS0gc29cbiAqIHRoYXQgbmFtZXNwYWNlLSBsaWtlIGRpY3Rpb25hcmllcyBhcmUgbWVyZ2VkLlxuICpcbiAqIE5vdGUgdGhhdCB0aGUgdGFyZ2V0IGNhbiBiZSBhIGZ1bmN0aW9uLCBpbiB3aGljaCBjYXNlIHRoZSBwcm9wZXJ0aWVzIGluXG4gKiB0aGUgc291cmNlIE9iamVjdCBhcmUgY29waWVkIG9udG8gaXQgYXMgc3RhdGljIHByb3BlcnRpZXMgb2YgdGhlIEZ1bmN0aW9uLlxuICpcbiAqIE5vdGU6IHdlIGRvbid0IG1lcmdlIF9fcHJvdG9fXyB0byBwcmV2ZW50IHByb3RvdHlwZSBwb2xsdXRpb25cbiAqL1xuZnVuY3Rpb24gZGVlcEV4dGVuZCh0YXJnZXQsIHNvdXJjZSkge1xuICAgIGlmICghKHNvdXJjZSBpbnN0YW5jZW9mIE9iamVjdCkpIHtcbiAgICAgICAgcmV0dXJuIHNvdXJjZTtcbiAgICB9XG4gICAgc3dpdGNoIChzb3VyY2UuY29uc3RydWN0b3IpIHtcbiAgICAgICAgY2FzZSBEYXRlOlxuICAgICAgICAgICAgLy8gVHJlYXQgRGF0ZXMgbGlrZSBzY2FsYXJzOyBpZiB0aGUgdGFyZ2V0IGRhdGUgb2JqZWN0IGhhZCBhbnkgY2hpbGRcbiAgICAgICAgICAgIC8vIHByb3BlcnRpZXMgLSB0aGV5IHdpbGwgYmUgbG9zdCFcbiAgICAgICAgICAgIGNvbnN0IGRhdGVWYWx1ZSA9IHNvdXJjZTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZShkYXRlVmFsdWUuZ2V0VGltZSgpKTtcbiAgICAgICAgY2FzZSBPYmplY3Q6XG4gICAgICAgICAgICBpZiAodGFyZ2V0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXQgPSB7fTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEFycmF5OlxuICAgICAgICAgICAgLy8gQWx3YXlzIGNvcHkgdGhlIGFycmF5IHNvdXJjZSBhbmQgb3ZlcndyaXRlIHRoZSB0YXJnZXQuXG4gICAgICAgICAgICB0YXJnZXQgPSBbXTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgLy8gTm90IGEgcGxhaW4gT2JqZWN0IC0gdHJlYXQgaXQgYXMgYSBzY2FsYXIuXG4gICAgICAgICAgICByZXR1cm4gc291cmNlO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IHByb3AgaW4gc291cmNlKSB7XG4gICAgICAgIC8vIHVzZSBpc1ZhbGlkS2V5IHRvIGd1YXJkIGFnYWluc3QgcHJvdG90eXBlIHBvbGx1dGlvbi4gU2VlIGh0dHBzOi8vc255ay5pby92dWxuL1NOWUstSlMtTE9EQVNILTQ1MDIwMlxuICAgICAgICBpZiAoIXNvdXJjZS5oYXNPd25Qcm9wZXJ0eShwcm9wKSB8fCAhaXNWYWxpZEtleShwcm9wKSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgdGFyZ2V0W3Byb3BdID0gZGVlcEV4dGVuZCh0YXJnZXRbcHJvcF0sIHNvdXJjZVtwcm9wXSk7XG4gICAgfVxuICAgIHJldHVybiB0YXJnZXQ7XG59XG5mdW5jdGlvbiBpc1ZhbGlkS2V5KGtleSkge1xuICAgIHJldHVybiBrZXkgIT09ICdfX3Byb3RvX18nO1xufVxuXG4vKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMiBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuLyoqXG4gKiBQb2x5ZmlsbCBmb3IgYGdsb2JhbFRoaXNgIG9iamVjdC5cbiAqIEByZXR1cm5zIHRoZSBgZ2xvYmFsVGhpc2Agb2JqZWN0IGZvciB0aGUgZ2l2ZW4gZW52aXJvbm1lbnQuXG4gKiBAcHVibGljXG4gKi9cbmZ1bmN0aW9uIGdldEdsb2JhbCgpIHtcbiAgICBpZiAodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybiBzZWxmO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdztcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybiBnbG9iYWw7XG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIGxvY2F0ZSBnbG9iYWwgb2JqZWN0LicpO1xufVxuXG4vKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMiBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuY29uc3QgZ2V0RGVmYXVsdHNGcm9tR2xvYmFsID0gKCkgPT4gZ2V0R2xvYmFsKCkuX19GSVJFQkFTRV9ERUZBVUxUU19fO1xuLyoqXG4gKiBBdHRlbXB0IHRvIHJlYWQgZGVmYXVsdHMgZnJvbSBhIEpTT04gc3RyaW5nIHByb3ZpZGVkIHRvXG4gKiBwcm9jZXNzKC4pZW52KC4pX19GSVJFQkFTRV9ERUZBVUxUU19fIG9yIGEgSlNPTiBmaWxlIHdob3NlIHBhdGggaXMgaW5cbiAqIHByb2Nlc3MoLillbnYoLilfX0ZJUkVCQVNFX0RFRkFVTFRTX1BBVEhfX1xuICogVGhlIGRvdHMgYXJlIGluIHBhcmVucyBiZWNhdXNlIGNlcnRhaW4gY29tcGlsZXJzIChWaXRlPykgY2Fubm90XG4gKiBoYW5kbGUgc2VlaW5nIHRoYXQgdmFyaWFibGUgaW4gY29tbWVudHMuXG4gKiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2ZpcmViYXNlL2ZpcmViYXNlLWpzLXNkay9pc3N1ZXMvNjgzOFxuICovXG5jb25zdCBnZXREZWZhdWx0c0Zyb21FbnZWYXJpYWJsZSA9ICgpID0+IHtcbiAgICBpZiAodHlwZW9mIHByb2Nlc3MgPT09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiBwcm9jZXNzLmVudiA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBkZWZhdWx0c0pzb25TdHJpbmcgPSBwcm9jZXNzLmVudi5fX0ZJUkVCQVNFX0RFRkFVTFRTX187XG4gICAgaWYgKGRlZmF1bHRzSnNvblN0cmluZykge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShkZWZhdWx0c0pzb25TdHJpbmcpO1xuICAgIH1cbn07XG5jb25zdCBnZXREZWZhdWx0c0Zyb21Db29raWUgPSAoKSA9PiB7XG4gICAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsZXQgbWF0Y2g7XG4gICAgdHJ5IHtcbiAgICAgICAgbWF0Y2ggPSBkb2N1bWVudC5jb29raWUubWF0Y2goL19fRklSRUJBU0VfREVGQVVMVFNfXz0oW147XSspLyk7XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIC8vIFNvbWUgZW52aXJvbm1lbnRzIHN1Y2ggYXMgQW5ndWxhciBVbml2ZXJzYWwgU1NSIGhhdmUgYVxuICAgICAgICAvLyBgZG9jdW1lbnRgIG9iamVjdCBidXQgZXJyb3Igb24gYWNjZXNzaW5nIGBkb2N1bWVudC5jb29raWVgLlxuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGRlY29kZWQgPSBtYXRjaCAmJiBiYXNlNjREZWNvZGUobWF0Y2hbMV0pO1xuICAgIHJldHVybiBkZWNvZGVkICYmIEpTT04ucGFyc2UoZGVjb2RlZCk7XG59O1xuLyoqXG4gKiBHZXQgdGhlIF9fRklSRUJBU0VfREVGQVVMVFNfXyBvYmplY3QuIEl0IGNoZWNrcyBpbiBvcmRlcjpcbiAqICgxKSBpZiBzdWNoIGFuIG9iamVjdCBleGlzdHMgYXMgYSBwcm9wZXJ0eSBvZiBgZ2xvYmFsVGhpc2BcbiAqICgyKSBpZiBzdWNoIGFuIG9iamVjdCB3YXMgcHJvdmlkZWQgb24gYSBzaGVsbCBlbnZpcm9ubWVudCB2YXJpYWJsZVxuICogKDMpIGlmIHN1Y2ggYW4gb2JqZWN0IGV4aXN0cyBpbiBhIGNvb2tpZVxuICogQHB1YmxpY1xuICovXG5jb25zdCBnZXREZWZhdWx0cyA9ICgpID0+IHtcbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gKGdldERlZmF1bHRzRnJvbVBvc3RpbnN0YWxsKCkgfHxcbiAgICAgICAgICAgIGdldERlZmF1bHRzRnJvbUdsb2JhbCgpIHx8XG4gICAgICAgICAgICBnZXREZWZhdWx0c0Zyb21FbnZWYXJpYWJsZSgpIHx8XG4gICAgICAgICAgICBnZXREZWZhdWx0c0Zyb21Db29raWUoKSk7XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDYXRjaC1hbGwgZm9yIGJlaW5nIHVuYWJsZSB0byBnZXQgX19GSVJFQkFTRV9ERUZBVUxUU19fIGR1ZVxuICAgICAgICAgKiB0byBhbnkgZW52aXJvbm1lbnQgY2FzZSB3ZSBoYXZlIG5vdCBhY2NvdW50ZWQgZm9yLiBMb2cgdG9cbiAgICAgICAgICogaW5mbyBpbnN0ZWFkIG9mIHN3YWxsb3dpbmcgc28gd2UgY2FuIGZpbmQgdGhlc2UgdW5rbm93biBjYXNlc1xuICAgICAgICAgKiBhbmQgYWRkIHBhdGhzIGZvciB0aGVtIGlmIG5lZWRlZC5cbiAgICAgICAgICovXG4gICAgICAgIGNvbnNvbGUuaW5mbyhgVW5hYmxlIHRvIGdldCBfX0ZJUkVCQVNFX0RFRkFVTFRTX18gZHVlIHRvOiAke2V9YCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG59O1xuLyoqXG4gKiBSZXR1cm5zIGVtdWxhdG9yIGhvc3Qgc3RvcmVkIGluIHRoZSBfX0ZJUkVCQVNFX0RFRkFVTFRTX18gb2JqZWN0XG4gKiBmb3IgdGhlIGdpdmVuIHByb2R1Y3QuXG4gKiBAcmV0dXJucyBhIFVSTCBob3N0IGZvcm1hdHRlZCBsaWtlIGAxMjcuMC4wLjE6OTk5OWAgb3IgYFs6OjFdOjQwMDBgIGlmIGF2YWlsYWJsZVxuICogQHB1YmxpY1xuICovXG5jb25zdCBnZXREZWZhdWx0RW11bGF0b3JIb3N0ID0gKHByb2R1Y3ROYW1lKSA9PiBnZXREZWZhdWx0cygpPy5lbXVsYXRvckhvc3RzPy5bcHJvZHVjdE5hbWVdO1xuLyoqXG4gKiBSZXR1cm5zIGVtdWxhdG9yIGhvc3RuYW1lIGFuZCBwb3J0IHN0b3JlZCBpbiB0aGUgX19GSVJFQkFTRV9ERUZBVUxUU19fIG9iamVjdFxuICogZm9yIHRoZSBnaXZlbiBwcm9kdWN0LlxuICogQHJldHVybnMgYSBwYWlyIG9mIGhvc3RuYW1lIGFuZCBwb3J0IGxpa2UgYFtcIjo6MVwiLCA0MDAwXWAgaWYgYXZhaWxhYmxlXG4gKiBAcHVibGljXG4gKi9cbmNvbnN0IGdldERlZmF1bHRFbXVsYXRvckhvc3RuYW1lQW5kUG9ydCA9IChwcm9kdWN0TmFtZSkgPT4ge1xuICAgIGNvbnN0IGhvc3QgPSBnZXREZWZhdWx0RW11bGF0b3JIb3N0KHByb2R1Y3ROYW1lKTtcbiAgICBpZiAoIWhvc3QpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgY29uc3Qgc2VwYXJhdG9ySW5kZXggPSBob3N0Lmxhc3RJbmRleE9mKCc6Jyk7IC8vIEZpbmRpbmcgdGhlIGxhc3Qgc2luY2UgSVB2NiBhZGRyIGFsc28gaGFzIGNvbG9ucy5cbiAgICBpZiAoc2VwYXJhdG9ySW5kZXggPD0gMCB8fCBzZXBhcmF0b3JJbmRleCArIDEgPT09IGhvc3QubGVuZ3RoKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBob3N0ICR7aG9zdH0gd2l0aCBubyBzZXBhcmF0ZSBob3N0bmFtZSBhbmQgcG9ydCFgKTtcbiAgICB9XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXJlc3RyaWN0ZWQtZ2xvYmFsc1xuICAgIGNvbnN0IHBvcnQgPSBwYXJzZUludChob3N0LnN1YnN0cmluZyhzZXBhcmF0b3JJbmRleCArIDEpLCAxMCk7XG4gICAgaWYgKGhvc3RbMF0gPT09ICdbJykge1xuICAgICAgICAvLyBCcmFja2V0LXF1b3RlZCBgW2lwdjZhZGRyXTpwb3J0YCA9PiByZXR1cm4gXCJpcHY2YWRkclwiICh3aXRob3V0IGJyYWNrZXRzKS5cbiAgICAgICAgcmV0dXJuIFtob3N0LnN1YnN0cmluZygxLCBzZXBhcmF0b3JJbmRleCAtIDEpLCBwb3J0XTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiBbaG9zdC5zdWJzdHJpbmcoMCwgc2VwYXJhdG9ySW5kZXgpLCBwb3J0XTtcbiAgICB9XG59O1xuLyoqXG4gKiBSZXR1cm5zIEZpcmViYXNlIGFwcCBjb25maWcgc3RvcmVkIGluIHRoZSBfX0ZJUkVCQVNFX0RFRkFVTFRTX18gb2JqZWN0LlxuICogQHB1YmxpY1xuICovXG5jb25zdCBnZXREZWZhdWx0QXBwQ29uZmlnID0gKCkgPT4gZ2V0RGVmYXVsdHMoKT8uY29uZmlnO1xuLyoqXG4gKiBSZXR1cm5zIGFuIGV4cGVyaW1lbnRhbCBzZXR0aW5nIG9uIHRoZSBfX0ZJUkVCQVNFX0RFRkFVTFRTX18gb2JqZWN0IChwcm9wZXJ0aWVzXG4gKiBwcmVmaXhlZCBieSBcIl9cIilcbiAqIEBwdWJsaWNcbiAqL1xuY29uc3QgZ2V0RXhwZXJpbWVudGFsU2V0dGluZyA9IChuYW1lKSA9PiBnZXREZWZhdWx0cygpPy5bYF8ke25hbWV9YF07XG5cbi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5jbGFzcyBEZWZlcnJlZCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMucmVqZWN0ID0gKCkgPT4geyB9O1xuICAgICAgICB0aGlzLnJlc29sdmUgPSAoKSA9PiB7IH07XG4gICAgICAgIHRoaXMucHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgICAgICAgICB0aGlzLnJlamVjdCA9IHJlamVjdDtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIE91ciBBUEkgaW50ZXJuYWxzIGFyZSBub3QgcHJvbWlzaWZpZWQgYW5kIGNhbm5vdCBiZWNhdXNlIG91ciBjYWxsYmFjayBBUElzIGhhdmUgc3VidGxlIGV4cGVjdGF0aW9ucyBhcm91bmRcbiAgICAgKiBpbnZva2luZyBwcm9taXNlcyBpbmxpbmUsIHdoaWNoIFByb21pc2VzIGFyZSBmb3JiaWRkZW4gdG8gZG8uIFRoaXMgbWV0aG9kIGFjY2VwdHMgYW4gb3B0aW9uYWwgbm9kZS1zdHlsZSBjYWxsYmFja1xuICAgICAqIGFuZCByZXR1cm5zIGEgbm9kZS1zdHlsZSBjYWxsYmFjayB3aGljaCB3aWxsIHJlc29sdmUgb3IgcmVqZWN0IHRoZSBEZWZlcnJlZCdzIHByb21pc2UuXG4gICAgICovXG4gICAgd3JhcENhbGxiYWNrKGNhbGxiYWNrKSB7XG4gICAgICAgIHJldHVybiAoZXJyb3IsIHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlamVjdChlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc29sdmUodmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIC8vIEF0dGFjaGluZyBub29wIGhhbmRsZXIganVzdCBpbiBjYXNlIGRldmVsb3BlciB3YXNuJ3QgZXhwZWN0aW5nXG4gICAgICAgICAgICAgICAgLy8gcHJvbWlzZXNcbiAgICAgICAgICAgICAgICB0aGlzLnByb21pc2UuY2F0Y2goKCkgPT4geyB9KTtcbiAgICAgICAgICAgICAgICAvLyBTb21lIG9mIG91ciBjYWxsYmFja3MgZG9uJ3QgZXhwZWN0IGEgdmFsdWUgYW5kIG91ciBvd24gdGVzdHNcbiAgICAgICAgICAgICAgICAvLyBhc3NlcnQgdGhhdCB0aGUgcGFyYW1ldGVyIGxlbmd0aCBpcyAxXG4gICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59XG5cbi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIxIEdvb2dsZSBMTENcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5mdW5jdGlvbiBjcmVhdGVNb2NrVXNlclRva2VuKHRva2VuLCBwcm9qZWN0SWQpIHtcbiAgICBpZiAodG9rZW4udWlkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIFwidWlkXCIgZmllbGQgaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZCBieSBtb2NrVXNlclRva2VuLiBQbGVhc2UgdXNlIFwic3ViXCIgaW5zdGVhZCBmb3IgRmlyZWJhc2UgQXV0aCBVc2VyIElELicpO1xuICAgIH1cbiAgICAvLyBVbnNlY3VyZWQgSldUcyB1c2UgXCJub25lXCIgYXMgdGhlIGFsZ29yaXRobS5cbiAgICBjb25zdCBoZWFkZXIgPSB7XG4gICAgICAgIGFsZzogJ25vbmUnLFxuICAgICAgICB0eXBlOiAnSldUJ1xuICAgIH07XG4gICAgY29uc3QgcHJvamVjdCA9IHByb2plY3RJZCB8fCAnZGVtby1wcm9qZWN0JztcbiAgICBjb25zdCBpYXQgPSB0b2tlbi5pYXQgfHwgMDtcbiAgICBjb25zdCBzdWIgPSB0b2tlbi5zdWIgfHwgdG9rZW4udXNlcl9pZDtcbiAgICBpZiAoIXN1Yikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJtb2NrVXNlclRva2VuIG11c3QgY29udGFpbiAnc3ViJyBvciAndXNlcl9pZCcgZmllbGQhXCIpO1xuICAgIH1cbiAgICBjb25zdCBwYXlsb2FkID0ge1xuICAgICAgICAvLyBTZXQgYWxsIHJlcXVpcmVkIGZpZWxkcyB0byBkZWNlbnQgZGVmYXVsdHNcbiAgICAgICAgaXNzOiBgaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tLyR7cHJvamVjdH1gLFxuICAgICAgICBhdWQ6IHByb2plY3QsXG4gICAgICAgIGlhdCxcbiAgICAgICAgZXhwOiBpYXQgKyAzNjAwLFxuICAgICAgICBhdXRoX3RpbWU6IGlhdCxcbiAgICAgICAgc3ViLFxuICAgICAgICB1c2VyX2lkOiBzdWIsXG4gICAgICAgIGZpcmViYXNlOiB7XG4gICAgICAgICAgICBzaWduX2luX3Byb3ZpZGVyOiAnY3VzdG9tJyxcbiAgICAgICAgICAgIGlkZW50aXRpZXM6IHt9XG4gICAgICAgIH0sXG4gICAgICAgIC8vIE92ZXJyaWRlIHdpdGggdXNlciBvcHRpb25zXG4gICAgICAgIC4uLnRva2VuXG4gICAgfTtcbiAgICAvLyBVbnNlY3VyZWQgSldUcyB1c2UgdGhlIGVtcHR5IHN0cmluZyBhcyBhIHNpZ25hdHVyZS5cbiAgICBjb25zdCBzaWduYXR1cmUgPSAnJztcbiAgICByZXR1cm4gW1xuICAgICAgICBiYXNlNjR1cmxFbmNvZGVXaXRob3V0UGFkZGluZyhKU09OLnN0cmluZ2lmeShoZWFkZXIpKSxcbiAgICAgICAgYmFzZTY0dXJsRW5jb2RlV2l0aG91dFBhZGRpbmcoSlNPTi5zdHJpbmdpZnkocGF5bG9hZCkpLFxuICAgICAgICBzaWduYXR1cmVcbiAgICBdLmpvaW4oJy4nKTtcbn1cblxuLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cbi8qKlxuICogUmV0dXJucyBuYXZpZ2F0b3IudXNlckFnZW50IHN0cmluZyBvciAnJyBpZiBpdCdzIG5vdCBkZWZpbmVkLlxuICogQHJldHVybiB1c2VyIGFnZW50IHN0cmluZ1xuICovXG5mdW5jdGlvbiBnZXRVQSgpIHtcbiAgICBpZiAodHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgdHlwZW9mIG5hdmlnYXRvclsndXNlckFnZW50J10gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiBuYXZpZ2F0b3JbJ3VzZXJBZ2VudCddO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH1cbn1cbi8qKlxuICogRGV0ZWN0IENvcmRvdmEgLyBQaG9uZUdhcCAvIElvbmljIGZyYW1ld29ya3Mgb24gYSBtb2JpbGUgZGV2aWNlLlxuICpcbiAqIERlbGliZXJhdGVseSBkb2VzIG5vdCByZWx5IG9uIGNoZWNraW5nIGBmaWxlOi8vYCBVUkxzIChhcyB0aGlzIGZhaWxzIFBob25lR2FwXG4gKiBpbiB0aGUgUmlwcGxlIGVtdWxhdG9yKSBub3IgQ29yZG92YSBgb25EZXZpY2VSZWFkeWAsIHdoaWNoIHdvdWxkIG5vcm1hbGx5XG4gKiB3YWl0IGZvciBhIGNhbGxiYWNrLlxuICovXG5mdW5jdGlvbiBpc01vYmlsZUNvcmRvdmEoKSB7XG4gICAgcmV0dXJuICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgICAvLyBAdHMtaWdub3JlIFNldHRpbmcgdXAgYW4gYnJvYWRseSBhcHBsaWNhYmxlIGluZGV4IHNpZ25hdHVyZSBmb3IgV2luZG93XG4gICAgICAgIC8vIGp1c3QgdG8gZGVhbCB3aXRoIHRoaXMgY2FzZSB3b3VsZCBwcm9iYWJseSBiZSBhIGJhZCBpZGVhLlxuICAgICAgICAhISh3aW5kb3dbJ2NvcmRvdmEnXSB8fCB3aW5kb3dbJ3Bob25lZ2FwJ10gfHwgd2luZG93WydQaG9uZUdhcCddKSAmJlxuICAgICAgICAvaW9zfGlwaG9uZXxpcG9kfGlwYWR8YW5kcm9pZHxibGFja2JlcnJ5fGllbW9iaWxlL2kudGVzdChnZXRVQSgpKSk7XG59XG4vKipcbiAqIERldGVjdCBOb2RlLmpzLlxuICpcbiAqIEByZXR1cm4gdHJ1ZSBpZiBOb2RlLmpzIGVudmlyb25tZW50IGlzIGRldGVjdGVkIG9yIHNwZWNpZmllZC5cbiAqL1xuLy8gTm9kZSBkZXRlY3Rpb24gbG9naWMgZnJvbTogaHR0cHM6Ly9naXRodWIuY29tL2lsaWFrYW4vZGV0ZWN0LW5vZGUvXG5mdW5jdGlvbiBpc05vZGUoKSB7XG4gICAgY29uc3QgZm9yY2VFbnZpcm9ubWVudCA9IGdldERlZmF1bHRzKCk/LmZvcmNlRW52aXJvbm1lbnQ7XG4gICAgaWYgKGZvcmNlRW52aXJvbm1lbnQgPT09ICdub2RlJykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgZWxzZSBpZiAoZm9yY2VFbnZpcm9ubWVudCA9PT0gJ2Jyb3dzZXInKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZ2xvYmFsLnByb2Nlc3MpID09PSAnW29iamVjdCBwcm9jZXNzXScpO1xuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuLyoqXG4gKiBEZXRlY3QgQnJvd3NlciBFbnZpcm9ubWVudC5cbiAqIE5vdGU6IFRoaXMgd2lsbCByZXR1cm4gdHJ1ZSBmb3IgY2VydGFpbiB0ZXN0IGZyYW1ld29ya3MgdGhhdCBhcmUgaW5jb21wbGV0ZWx5XG4gKiBtaW1pY2tpbmcgYSBicm93c2VyLCBhbmQgc2hvdWxkIG5vdCBsZWFkIHRvIGFzc3VtaW5nIGFsbCBicm93c2VyIEFQSXMgYXJlXG4gKiBhdmFpbGFibGUuXG4gKi9cbmZ1bmN0aW9uIGlzQnJvd3NlcigpIHtcbiAgICByZXR1cm4gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgfHwgaXNXZWJXb3JrZXIoKTtcbn1cbi8qKlxuICogRGV0ZWN0IFdlYiBXb3JrZXIgY29udGV4dC5cbiAqL1xuZnVuY3Rpb24gaXNXZWJXb3JrZXIoKSB7XG4gICAgcmV0dXJuICh0eXBlb2YgV29ya2VyR2xvYmFsU2NvcGUgIT09ICd1bmRlZmluZWQnICYmXG4gICAgICAgIHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgICBzZWxmIGluc3RhbmNlb2YgV29ya2VyR2xvYmFsU2NvcGUpO1xufVxuLyoqXG4gKiBEZXRlY3QgQ2xvdWRmbGFyZSBXb3JrZXIgY29udGV4dC5cbiAqL1xuZnVuY3Rpb24gaXNDbG91ZGZsYXJlV29ya2VyKCkge1xuICAgIHJldHVybiAodHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgbmF2aWdhdG9yLnVzZXJBZ2VudCA9PT0gJ0Nsb3VkZmxhcmUtV29ya2VycycpO1xufVxuZnVuY3Rpb24gaXNCcm93c2VyRXh0ZW5zaW9uKCkge1xuICAgIGNvbnN0IHJ1bnRpbWUgPSB0eXBlb2YgY2hyb21lID09PSAnb2JqZWN0J1xuICAgICAgICA/IGNocm9tZS5ydW50aW1lXG4gICAgICAgIDogdHlwZW9mIGJyb3dzZXIgPT09ICdvYmplY3QnXG4gICAgICAgICAgICA/IGJyb3dzZXIucnVudGltZVxuICAgICAgICAgICAgOiB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHR5cGVvZiBydW50aW1lID09PSAnb2JqZWN0JyAmJiBydW50aW1lLmlkICE9PSB1bmRlZmluZWQ7XG59XG4vKipcbiAqIERldGVjdCBSZWFjdCBOYXRpdmUuXG4gKlxuICogQHJldHVybiB0cnVlIGlmIFJlYWN0TmF0aXZlIGVudmlyb25tZW50IGlzIGRldGVjdGVkLlxuICovXG5mdW5jdGlvbiBpc1JlYWN0TmF0aXZlKCkge1xuICAgIHJldHVybiAodHlwZW9mIG5hdmlnYXRvciA9PT0gJ29iamVjdCcgJiYgbmF2aWdhdG9yWydwcm9kdWN0J10gPT09ICdSZWFjdE5hdGl2ZScpO1xufVxuLyoqIERldGVjdHMgRWxlY3Ryb24gYXBwcy4gKi9cbmZ1bmN0aW9uIGlzRWxlY3Ryb24oKSB7XG4gICAgcmV0dXJuIGdldFVBKCkuaW5kZXhPZignRWxlY3Ryb24vJykgPj0gMDtcbn1cbi8qKiBEZXRlY3RzIEludGVybmV0IEV4cGxvcmVyLiAqL1xuZnVuY3Rpb24gaXNJRSgpIHtcbiAgICBjb25zdCB1YSA9IGdldFVBKCk7XG4gICAgcmV0dXJuIHVhLmluZGV4T2YoJ01TSUUgJykgPj0gMCB8fCB1YS5pbmRleE9mKCdUcmlkZW50LycpID49IDA7XG59XG4vKiogRGV0ZWN0cyBVbml2ZXJzYWwgV2luZG93cyBQbGF0Zm9ybSBhcHBzLiAqL1xuZnVuY3Rpb24gaXNVV1AoKSB7XG4gICAgcmV0dXJuIGdldFVBKCkuaW5kZXhPZignTVNBcHBIb3N0LycpID49IDA7XG59XG4vKipcbiAqIERldGVjdCB3aGV0aGVyIHRoZSBjdXJyZW50IFNESyBidWlsZCBpcyB0aGUgTm9kZSB2ZXJzaW9uLlxuICpcbiAqIEByZXR1cm4gdHJ1ZSBpZiBpdCdzIHRoZSBOb2RlIFNESyBidWlsZC5cbiAqL1xuZnVuY3Rpb24gaXNOb2RlU2RrKCkge1xuICAgIHJldHVybiBDT05TVEFOVFMuTk9ERV9DTElFTlQgPT09IHRydWUgfHwgQ09OU1RBTlRTLk5PREVfQURNSU4gPT09IHRydWU7XG59XG4vKiogUmV0dXJucyB0cnVlIGlmIHdlIGFyZSBydW5uaW5nIGluIFNhZmFyaS4gKi9cbmZ1bmN0aW9uIGlzU2FmYXJpKCkge1xuICAgIHJldHVybiAoIWlzTm9kZSgpICYmXG4gICAgICAgICEhbmF2aWdhdG9yLnVzZXJBZ2VudCAmJlxuICAgICAgICBuYXZpZ2F0b3IudXNlckFnZW50LmluY2x1ZGVzKCdTYWZhcmknKSAmJlxuICAgICAgICAhbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmNsdWRlcygnQ2hyb21lJykpO1xufVxuLyoqIFJldHVybnMgdHJ1ZSBpZiB3ZSBhcmUgcnVubmluZyBpbiBTYWZhcmkgb3IgV2ViS2l0ICovXG5mdW5jdGlvbiBpc1NhZmFyaU9yV2Via2l0KCkge1xuICAgIHJldHVybiAoIWlzTm9kZSgpICYmXG4gICAgICAgICEhbmF2aWdhdG9yLnVzZXJBZ2VudCAmJlxuICAgICAgICAobmF2aWdhdG9yLnVzZXJBZ2VudC5pbmNsdWRlcygnU2FmYXJpJykgfHxcbiAgICAgICAgICAgIG5hdmlnYXRvci51c2VyQWdlbnQuaW5jbHVkZXMoJ1dlYktpdCcpKSAmJlxuICAgICAgICAhbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmNsdWRlcygnQ2hyb21lJykpO1xufVxuLyoqXG4gKiBUaGlzIG1ldGhvZCBjaGVja3MgaWYgaW5kZXhlZERCIGlzIHN1cHBvcnRlZCBieSBjdXJyZW50IGJyb3dzZXIvc2VydmljZSB3b3JrZXIgY29udGV4dFxuICogQHJldHVybiB0cnVlIGlmIGluZGV4ZWREQiBpcyBzdXBwb3J0ZWQgYnkgY3VycmVudCBicm93c2VyL3NlcnZpY2Ugd29ya2VyIGNvbnRleHRcbiAqL1xuZnVuY3Rpb24gaXNJbmRleGVkREJBdmFpbGFibGUoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBpbmRleGVkREIgPT09ICdvYmplY3QnO1xuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuLyoqXG4gKiBUaGlzIG1ldGhvZCB2YWxpZGF0ZXMgYnJvd3Nlci9zdyBjb250ZXh0IGZvciBpbmRleGVkREIgYnkgb3BlbmluZyBhIGR1bW15IGluZGV4ZWREQiBkYXRhYmFzZSBhbmQgcmVqZWN0XG4gKiBpZiBlcnJvcnMgb2NjdXIgZHVyaW5nIHRoZSBkYXRhYmFzZSBvcGVuIG9wZXJhdGlvbi5cbiAqXG4gKiBAdGhyb3dzIGV4Y2VwdGlvbiBpZiBjdXJyZW50IGJyb3dzZXIvc3cgY29udGV4dCBjYW4ndCBydW4gaWRiLm9wZW4gKGV4OiBTYWZhcmkgaWZyYW1lLCBGaXJlZm94XG4gKiBwcml2YXRlIGJyb3dzaW5nKVxuICovXG5mdW5jdGlvbiB2YWxpZGF0ZUluZGV4ZWREQk9wZW5hYmxlKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgcHJlRXhpc3QgPSB0cnVlO1xuICAgICAgICAgICAgY29uc3QgREJfQ0hFQ0tfTkFNRSA9ICd2YWxpZGF0ZS1icm93c2VyLWNvbnRleHQtZm9yLWluZGV4ZWRkYi1hbmFseXRpY3MtbW9kdWxlJztcbiAgICAgICAgICAgIGNvbnN0IHJlcXVlc3QgPSBzZWxmLmluZGV4ZWREQi5vcGVuKERCX0NIRUNLX05BTUUpO1xuICAgICAgICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVxdWVzdC5yZXN1bHQuY2xvc2UoKTtcbiAgICAgICAgICAgICAgICAvLyBkZWxldGUgZGF0YWJhc2Ugb25seSB3aGVuIGl0IGRvZXNuJ3QgcHJlLWV4aXN0XG4gICAgICAgICAgICAgICAgaWYgKCFwcmVFeGlzdCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmluZGV4ZWREQi5kZWxldGVEYXRhYmFzZShEQl9DSEVDS19OQU1FKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXF1ZXN0Lm9udXBncmFkZW5lZWRlZCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBwcmVFeGlzdCA9IGZhbHNlO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJlcXVlc3Qub25lcnJvciA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICByZWplY3QocmVxdWVzdC5lcnJvcj8ubWVzc2FnZSB8fCAnJyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuLyoqXG4gKlxuICogVGhpcyBtZXRob2QgY2hlY2tzIHdoZXRoZXIgY29va2llIGlzIGVuYWJsZWQgd2l0aGluIGN1cnJlbnQgYnJvd3NlclxuICogQHJldHVybiB0cnVlIGlmIGNvb2tpZSBpcyBlbmFibGVkIHdpdGhpbiBjdXJyZW50IGJyb3dzZXJcbiAqL1xuZnVuY3Rpb24gYXJlQ29va2llc0VuYWJsZWQoKSB7XG4gICAgaWYgKHR5cGVvZiBuYXZpZ2F0b3IgPT09ICd1bmRlZmluZWQnIHx8ICFuYXZpZ2F0b3IuY29va2llRW5hYmxlZCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xufVxuXG4vKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IFN0YW5kYXJkaXplZCBGaXJlYmFzZSBFcnJvci5cbiAqXG4gKiBVc2FnZTpcbiAqXG4gKiAgIC8vIFR5cGVTY3JpcHQgc3RyaW5nIGxpdGVyYWxzIGZvciB0eXBlLXNhZmUgY29kZXNcbiAqICAgdHlwZSBFcnIgPVxuICogICAgICd1bmtub3duJyB8XG4gKiAgICAgJ29iamVjdC1ub3QtZm91bmQnXG4gKiAgICAgO1xuICpcbiAqICAgLy8gQ2xvc3VyZSBlbnVtIGZvciB0eXBlLXNhZmUgZXJyb3IgY29kZXNcbiAqICAgLy8gYXQtZW51bSB7c3RyaW5nfVxuICogICB2YXIgRXJyID0ge1xuICogICAgIFVOS05PV046ICd1bmtub3duJyxcbiAqICAgICBPQkpFQ1RfTk9UX0ZPVU5EOiAnb2JqZWN0LW5vdC1mb3VuZCcsXG4gKiAgIH1cbiAqXG4gKiAgIGxldCBlcnJvcnM6IE1hcDxFcnIsIHN0cmluZz4gPSB7XG4gKiAgICAgJ2dlbmVyaWMtZXJyb3InOiBcIlVua25vd24gZXJyb3JcIixcbiAqICAgICAnZmlsZS1ub3QtZm91bmQnOiBcIkNvdWxkIG5vdCBmaW5kIGZpbGU6IHskZmlsZX1cIixcbiAqICAgfTtcbiAqXG4gKiAgIC8vIFR5cGUtc2FmZSBmdW5jdGlvbiAtIG11c3QgcGFzcyBhIHZhbGlkIGVycm9yIGNvZGUgYXMgcGFyYW0uXG4gKiAgIGxldCBlcnJvciA9IG5ldyBFcnJvckZhY3Rvcnk8RXJyPignc2VydmljZScsICdTZXJ2aWNlJywgZXJyb3JzKTtcbiAqXG4gKiAgIC4uLlxuICogICB0aHJvdyBlcnJvci5jcmVhdGUoRXJyLkdFTkVSSUMpO1xuICogICAuLi5cbiAqICAgdGhyb3cgZXJyb3IuY3JlYXRlKEVyci5GSUxFX05PVF9GT1VORCwgeydmaWxlJzogZmlsZU5hbWV9KTtcbiAqICAgLi4uXG4gKiAgIC8vIFNlcnZpY2U6IENvdWxkIG5vdCBmaWxlIGZpbGU6IGZvby50eHQgKHNlcnZpY2UvZmlsZS1ub3QtZm91bmQpLlxuICpcbiAqICAgY2F0Y2ggKGUpIHtcbiAqICAgICBhc3NlcnQoZS5tZXNzYWdlID09PSBcIkNvdWxkIG5vdCBmaW5kIGZpbGU6IGZvby50eHQuXCIpO1xuICogICAgIGlmICgoZSBhcyBGaXJlYmFzZUVycm9yKT8uY29kZSA9PT0gJ3NlcnZpY2UvZmlsZS1ub3QtZm91bmQnKSB7XG4gKiAgICAgICBjb25zb2xlLmxvZyhcIkNvdWxkIG5vdCByZWFkIGZpbGU6IFwiICsgZVsnZmlsZSddKTtcbiAqICAgICB9XG4gKiAgIH1cbiAqL1xuY29uc3QgRVJST1JfTkFNRSA9ICdGaXJlYmFzZUVycm9yJztcbi8vIEJhc2VkIG9uIGNvZGUgZnJvbTpcbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0Vycm9yI0N1c3RvbV9FcnJvcl9UeXBlc1xuY2xhc3MgRmlyZWJhc2VFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcihcbiAgICAvKiogVGhlIGVycm9yIGNvZGUgZm9yIHRoaXMgZXJyb3IuICovXG4gICAgY29kZSwgbWVzc2FnZSwgXG4gICAgLyoqIEN1c3RvbSBkYXRhIGZvciB0aGlzIGVycm9yLiAqL1xuICAgIGN1c3RvbURhdGEpIHtcbiAgICAgICAgc3VwZXIobWVzc2FnZSk7XG4gICAgICAgIHRoaXMuY29kZSA9IGNvZGU7XG4gICAgICAgIHRoaXMuY3VzdG9tRGF0YSA9IGN1c3RvbURhdGE7XG4gICAgICAgIC8qKiBUaGUgY3VzdG9tIG5hbWUgZm9yIGFsbCBGaXJlYmFzZUVycm9ycy4gKi9cbiAgICAgICAgdGhpcy5uYW1lID0gRVJST1JfTkFNRTtcbiAgICAgICAgLy8gRml4IEZvciBFUzVcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9UeXBlU2NyaXB0LXdpa2kvYmxvYi9tYXN0ZXIvQnJlYWtpbmctQ2hhbmdlcy5tZCNleHRlbmRpbmctYnVpbHQtaW5zLWxpa2UtZXJyb3ItYXJyYXktYW5kLW1hcC1tYXktbm8tbG9uZ2VyLXdvcmtcbiAgICAgICAgLy8gVE9ETyhkbGFyb2NxdWUpOiBSZXBsYWNlIHRoaXMgd2l0aCBgbmV3LnRhcmdldGA6IGh0dHBzOi8vd3d3LnR5cGVzY3JpcHRsYW5nLm9yZy9kb2NzL2hhbmRib29rL3JlbGVhc2Utbm90ZXMvdHlwZXNjcmlwdC0yLTIuaHRtbCNzdXBwb3J0LWZvci1uZXd0YXJnZXRcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgd2hpY2ggd2UgY2FuIG5vdyB1c2Ugc2luY2Ugd2Ugbm8gbG9uZ2VyIHRhcmdldCBFUzUuXG4gICAgICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZih0aGlzLCBGaXJlYmFzZUVycm9yLnByb3RvdHlwZSk7XG4gICAgICAgIC8vIE1haW50YWlucyBwcm9wZXIgc3RhY2sgdHJhY2UgZm9yIHdoZXJlIG91ciBlcnJvciB3YXMgdGhyb3duLlxuICAgICAgICAvLyBPbmx5IGF2YWlsYWJsZSBvbiBWOC5cbiAgICAgICAgaWYgKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKSB7XG4gICAgICAgICAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCBFcnJvckZhY3RvcnkucHJvdG90eXBlLmNyZWF0ZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5jbGFzcyBFcnJvckZhY3Rvcnkge1xuICAgIGNvbnN0cnVjdG9yKHNlcnZpY2UsIHNlcnZpY2VOYW1lLCBlcnJvcnMpIHtcbiAgICAgICAgdGhpcy5zZXJ2aWNlID0gc2VydmljZTtcbiAgICAgICAgdGhpcy5zZXJ2aWNlTmFtZSA9IHNlcnZpY2VOYW1lO1xuICAgICAgICB0aGlzLmVycm9ycyA9IGVycm9ycztcbiAgICB9XG4gICAgY3JlYXRlKGNvZGUsIC4uLmRhdGEpIHtcbiAgICAgICAgY29uc3QgY3VzdG9tRGF0YSA9IGRhdGFbMF0gfHwge307XG4gICAgICAgIGNvbnN0IGZ1bGxDb2RlID0gYCR7dGhpcy5zZXJ2aWNlfS8ke2NvZGV9YDtcbiAgICAgICAgY29uc3QgdGVtcGxhdGUgPSB0aGlzLmVycm9yc1tjb2RlXTtcbiAgICAgICAgY29uc3QgbWVzc2FnZSA9IHRlbXBsYXRlID8gcmVwbGFjZVRlbXBsYXRlKHRlbXBsYXRlLCBjdXN0b21EYXRhKSA6ICdFcnJvcic7XG4gICAgICAgIC8vIFNlcnZpY2UgTmFtZTogRXJyb3IgbWVzc2FnZSAoc2VydmljZS9jb2RlKS5cbiAgICAgICAgY29uc3QgZnVsbE1lc3NhZ2UgPSBgJHt0aGlzLnNlcnZpY2VOYW1lfTogJHttZXNzYWdlfSAoJHtmdWxsQ29kZX0pLmA7XG4gICAgICAgIGNvbnN0IGVycm9yID0gbmV3IEZpcmViYXNlRXJyb3IoZnVsbENvZGUsIGZ1bGxNZXNzYWdlLCBjdXN0b21EYXRhKTtcbiAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHJlcGxhY2VUZW1wbGF0ZSh0ZW1wbGF0ZSwgZGF0YSkge1xuICAgIHJldHVybiB0ZW1wbGF0ZS5yZXBsYWNlKFBBVFRFUk4sIChfLCBrZXkpID0+IHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBkYXRhW2tleV07XG4gICAgICAgIHJldHVybiB2YWx1ZSAhPSBudWxsID8gU3RyaW5nKHZhbHVlKSA6IGA8JHtrZXl9Pz5gO1xuICAgIH0pO1xufVxuY29uc3QgUEFUVEVSTiA9IC9cXHtcXCQoW159XSspfS9nO1xuXG4vKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuLyoqXG4gKiBFdmFsdWF0ZXMgYSBKU09OIHN0cmluZyBpbnRvIGEgamF2YXNjcmlwdCBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHN0ciBBIHN0cmluZyBjb250YWluaW5nIEpTT04uXG4gKiBAcmV0dXJuIHsqfSBUaGUgamF2YXNjcmlwdCBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBzcGVjaWZpZWQgSlNPTi5cbiAqL1xuZnVuY3Rpb24ganNvbkV2YWwoc3RyKSB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2Uoc3RyKTtcbn1cbi8qKlxuICogUmV0dXJucyBKU09OIHJlcHJlc2VudGluZyBhIGphdmFzY3JpcHQgb2JqZWN0LlxuICogQHBhcmFtIHsqfSBkYXRhIEphdmFTY3JpcHQgb2JqZWN0IHRvIGJlIHN0cmluZ2lmaWVkLlxuICogQHJldHVybiB7c3RyaW5nfSBUaGUgSlNPTiBjb250ZW50cyBvZiB0aGUgb2JqZWN0LlxuICovXG5mdW5jdGlvbiBzdHJpbmdpZnkoZGF0YSkge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShkYXRhKTtcbn1cblxuLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cbi8qKlxuICogRGVjb2RlcyBhIEZpcmViYXNlIGF1dGguIHRva2VuIGludG8gY29uc3RpdHVlbnQgcGFydHMuXG4gKlxuICogTm90ZXM6XG4gKiAtIE1heSByZXR1cm4gd2l0aCBpbnZhbGlkIC8gaW5jb21wbGV0ZSBjbGFpbXMgaWYgdGhlcmUncyBubyBuYXRpdmUgYmFzZTY0IGRlY29kaW5nIHN1cHBvcnQuXG4gKiAtIERvZXNuJ3QgY2hlY2sgaWYgdGhlIHRva2VuIGlzIGFjdHVhbGx5IHZhbGlkLlxuICovXG5jb25zdCBkZWNvZGUgPSBmdW5jdGlvbiAodG9rZW4pIHtcbiAgICBsZXQgaGVhZGVyID0ge30sIGNsYWltcyA9IHt9LCBkYXRhID0ge30sIHNpZ25hdHVyZSA9ICcnO1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHBhcnRzID0gdG9rZW4uc3BsaXQoJy4nKTtcbiAgICAgICAgaGVhZGVyID0ganNvbkV2YWwoYmFzZTY0RGVjb2RlKHBhcnRzWzBdKSB8fCAnJyk7XG4gICAgICAgIGNsYWltcyA9IGpzb25FdmFsKGJhc2U2NERlY29kZShwYXJ0c1sxXSkgfHwgJycpO1xuICAgICAgICBzaWduYXR1cmUgPSBwYXJ0c1syXTtcbiAgICAgICAgZGF0YSA9IGNsYWltc1snZCddIHx8IHt9O1xuICAgICAgICBkZWxldGUgY2xhaW1zWydkJ107XG4gICAgfVxuICAgIGNhdGNoIChlKSB7IH1cbiAgICByZXR1cm4ge1xuICAgICAgICBoZWFkZXIsXG4gICAgICAgIGNsYWltcyxcbiAgICAgICAgZGF0YSxcbiAgICAgICAgc2lnbmF0dXJlXG4gICAgfTtcbn07XG4vKipcbiAqIERlY29kZXMgYSBGaXJlYmFzZSBhdXRoLiB0b2tlbiBhbmQgY2hlY2tzIHRoZSB2YWxpZGl0eSBvZiBpdHMgdGltZS1iYXNlZCBjbGFpbXMuIFdpbGwgcmV0dXJuIHRydWUgaWYgdGhlXG4gKiB0b2tlbiBpcyB3aXRoaW4gdGhlIHRpbWUgd2luZG93IGF1dGhvcml6ZWQgYnkgdGhlICduYmYnIChub3QtYmVmb3JlKSBhbmQgJ2lhdCcgKGlzc3VlZC1hdCkgY2xhaW1zLlxuICpcbiAqIE5vdGVzOlxuICogLSBNYXkgcmV0dXJuIGEgZmFsc2UgbmVnYXRpdmUgaWYgdGhlcmUncyBubyBuYXRpdmUgYmFzZTY0IGRlY29kaW5nIHN1cHBvcnQuXG4gKiAtIERvZXNuJ3QgY2hlY2sgaWYgdGhlIHRva2VuIGlzIGFjdHVhbGx5IHZhbGlkLlxuICovXG5jb25zdCBpc1ZhbGlkVGltZXN0YW1wID0gZnVuY3Rpb24gKHRva2VuKSB7XG4gICAgY29uc3QgY2xhaW1zID0gZGVjb2RlKHRva2VuKS5jbGFpbXM7XG4gICAgY29uc3Qgbm93ID0gTWF0aC5mbG9vcihuZXcgRGF0ZSgpLmdldFRpbWUoKSAvIDEwMDApO1xuICAgIGxldCB2YWxpZFNpbmNlID0gMCwgdmFsaWRVbnRpbCA9IDA7XG4gICAgaWYgKHR5cGVvZiBjbGFpbXMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIGlmIChjbGFpbXMuaGFzT3duUHJvcGVydHkoJ25iZicpKSB7XG4gICAgICAgICAgICB2YWxpZFNpbmNlID0gY2xhaW1zWyduYmYnXTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjbGFpbXMuaGFzT3duUHJvcGVydHkoJ2lhdCcpKSB7XG4gICAgICAgICAgICB2YWxpZFNpbmNlID0gY2xhaW1zWydpYXQnXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2xhaW1zLmhhc093blByb3BlcnR5KCdleHAnKSkge1xuICAgICAgICAgICAgdmFsaWRVbnRpbCA9IGNsYWltc1snZXhwJ107XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyB0b2tlbiB3aWxsIGV4cGlyZSBhZnRlciAyNGggYnkgZGVmYXVsdFxuICAgICAgICAgICAgdmFsaWRVbnRpbCA9IHZhbGlkU2luY2UgKyA4NjQwMDtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gKCEhbm93ICYmXG4gICAgICAgICEhdmFsaWRTaW5jZSAmJlxuICAgICAgICAhIXZhbGlkVW50aWwgJiZcbiAgICAgICAgbm93ID49IHZhbGlkU2luY2UgJiZcbiAgICAgICAgbm93IDw9IHZhbGlkVW50aWwpO1xufTtcbi8qKlxuICogRGVjb2RlcyBhIEZpcmViYXNlIGF1dGguIHRva2VuIGFuZCByZXR1cm5zIGl0cyBpc3N1ZWQgYXQgdGltZSBpZiB2YWxpZCwgbnVsbCBvdGhlcndpc2UuXG4gKlxuICogTm90ZXM6XG4gKiAtIE1heSByZXR1cm4gbnVsbCBpZiB0aGVyZSdzIG5vIG5hdGl2ZSBiYXNlNjQgZGVjb2Rpbmcgc3VwcG9ydC5cbiAqIC0gRG9lc24ndCBjaGVjayBpZiB0aGUgdG9rZW4gaXMgYWN0dWFsbHkgdmFsaWQuXG4gKi9cbmNvbnN0IGlzc3VlZEF0VGltZSA9IGZ1bmN0aW9uICh0b2tlbikge1xuICAgIGNvbnN0IGNsYWltcyA9IGRlY29kZSh0b2tlbikuY2xhaW1zO1xuICAgIGlmICh0eXBlb2YgY2xhaW1zID09PSAnb2JqZWN0JyAmJiBjbGFpbXMuaGFzT3duUHJvcGVydHkoJ2lhdCcpKSB7XG4gICAgICAgIHJldHVybiBjbGFpbXNbJ2lhdCddO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn07XG4vKipcbiAqIERlY29kZXMgYSBGaXJlYmFzZSBhdXRoLiB0b2tlbiBhbmQgY2hlY2tzIHRoZSB2YWxpZGl0eSBvZiBpdHMgZm9ybWF0LiBFeHBlY3RzIGEgdmFsaWQgaXNzdWVkLWF0IHRpbWUuXG4gKlxuICogTm90ZXM6XG4gKiAtIE1heSByZXR1cm4gYSBmYWxzZSBuZWdhdGl2ZSBpZiB0aGVyZSdzIG5vIG5hdGl2ZSBiYXNlNjQgZGVjb2Rpbmcgc3VwcG9ydC5cbiAqIC0gRG9lc24ndCBjaGVjayBpZiB0aGUgdG9rZW4gaXMgYWN0dWFsbHkgdmFsaWQuXG4gKi9cbmNvbnN0IGlzVmFsaWRGb3JtYXQgPSBmdW5jdGlvbiAodG9rZW4pIHtcbiAgICBjb25zdCBkZWNvZGVkID0gZGVjb2RlKHRva2VuKSwgY2xhaW1zID0gZGVjb2RlZC5jbGFpbXM7XG4gICAgcmV0dXJuICEhY2xhaW1zICYmIHR5cGVvZiBjbGFpbXMgPT09ICdvYmplY3QnICYmIGNsYWltcy5oYXNPd25Qcm9wZXJ0eSgnaWF0Jyk7XG59O1xuLyoqXG4gKiBBdHRlbXB0cyB0byBwZWVyIGludG8gYW4gYXV0aCB0b2tlbiBhbmQgZGV0ZXJtaW5lIGlmIGl0J3MgYW4gYWRtaW4gYXV0aCB0b2tlbiBieSBsb29raW5nIGF0IHRoZSBjbGFpbXMgcG9ydGlvbi5cbiAqXG4gKiBOb3RlczpcbiAqIC0gTWF5IHJldHVybiBhIGZhbHNlIG5lZ2F0aXZlIGlmIHRoZXJlJ3Mgbm8gbmF0aXZlIGJhc2U2NCBkZWNvZGluZyBzdXBwb3J0LlxuICogLSBEb2Vzbid0IGNoZWNrIGlmIHRoZSB0b2tlbiBpcyBhY3R1YWxseSB2YWxpZC5cbiAqL1xuY29uc3QgaXNBZG1pbiA9IGZ1bmN0aW9uICh0b2tlbikge1xuICAgIGNvbnN0IGNsYWltcyA9IGRlY29kZSh0b2tlbikuY2xhaW1zO1xuICAgIHJldHVybiB0eXBlb2YgY2xhaW1zID09PSAnb2JqZWN0JyAmJiBjbGFpbXNbJ2FkbWluJ10gPT09IHRydWU7XG59O1xuXG4vKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuZnVuY3Rpb24gY29udGFpbnMob2JqLCBrZXkpIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KTtcbn1cbmZ1bmN0aW9uIHNhZmVHZXQob2JqLCBrZXkpIHtcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkge1xuICAgICAgICByZXR1cm4gb2JqW2tleV07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGlzRW1wdHkob2JqKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gb2JqKSB7XG4gICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59XG5mdW5jdGlvbiBtYXAob2JqLCBmbiwgY29udGV4dE9iaikge1xuICAgIGNvbnN0IHJlcyA9IHt9O1xuICAgIGZvciAoY29uc3Qga2V5IGluIG9iaikge1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkge1xuICAgICAgICAgICAgcmVzW2tleV0gPSBmbi5jYWxsKGNvbnRleHRPYmosIG9ialtrZXldLCBrZXksIG9iaik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbn1cbi8qKlxuICogRGVlcCBlcXVhbCB0d28gb2JqZWN0cy4gU3VwcG9ydCBBcnJheXMgYW5kIE9iamVjdHMuXG4gKi9cbmZ1bmN0aW9uIGRlZXBFcXVhbChhLCBiKSB7XG4gICAgaWYgKGEgPT09IGIpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGNvbnN0IGFLZXlzID0gT2JqZWN0LmtleXMoYSk7XG4gICAgY29uc3QgYktleXMgPSBPYmplY3Qua2V5cyhiKTtcbiAgICBmb3IgKGNvbnN0IGsgb2YgYUtleXMpIHtcbiAgICAgICAgaWYgKCFiS2V5cy5pbmNsdWRlcyhrKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGFQcm9wID0gYVtrXTtcbiAgICAgICAgY29uc3QgYlByb3AgPSBiW2tdO1xuICAgICAgICBpZiAoaXNPYmplY3QoYVByb3ApICYmIGlzT2JqZWN0KGJQcm9wKSkge1xuICAgICAgICAgICAgaWYgKCFkZWVwRXF1YWwoYVByb3AsIGJQcm9wKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChhUHJvcCAhPT0gYlByb3ApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGNvbnN0IGsgb2YgYktleXMpIHtcbiAgICAgICAgaWYgKCFhS2V5cy5pbmNsdWRlcyhrKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xufVxuZnVuY3Rpb24gaXNPYmplY3QodGhpbmcpIHtcbiAgICByZXR1cm4gdGhpbmcgIT09IG51bGwgJiYgdHlwZW9mIHRoaW5nID09PSAnb2JqZWN0Jztcbn1cblxuLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjIgR29vZ2xlIExMQ1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cbi8qKlxuICogUmVqZWN0cyBpZiB0aGUgZ2l2ZW4gcHJvbWlzZSBkb2Vzbid0IHJlc29sdmUgaW4gdGltZUluTVMgbWlsbGlzZWNvbmRzLlxuICogQGludGVybmFsXG4gKi9cbmZ1bmN0aW9uIHByb21pc2VXaXRoVGltZW91dChwcm9taXNlLCB0aW1lSW5NUyA9IDIwMDApIHtcbiAgICBjb25zdCBkZWZlcnJlZFByb21pc2UgPSBuZXcgRGVmZXJyZWQoKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IGRlZmVycmVkUHJvbWlzZS5yZWplY3QoJ3RpbWVvdXQhJyksIHRpbWVJbk1TKTtcbiAgICBwcm9taXNlLnRoZW4oZGVmZXJyZWRQcm9taXNlLnJlc29sdmUsIGRlZmVycmVkUHJvbWlzZS5yZWplY3QpO1xuICAgIHJldHVybiBkZWZlcnJlZFByb21pc2UucHJvbWlzZTtcbn1cblxuLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cbi8qKlxuICogUmV0dXJucyBhIHF1ZXJ5c3RyaW5nLWZvcm1hdHRlZCBzdHJpbmcgKGUuZy4gJmFyZz12YWwmYXJnMj12YWwyKSBmcm9tIGFcbiAqIHBhcmFtcyBvYmplY3QgKGUuZy4ge2FyZzogJ3ZhbCcsIGFyZzI6ICd2YWwyJ30pXG4gKiBOb3RlOiBZb3UgbXVzdCBwcmVwZW5kIGl0IHdpdGggPyB3aGVuIGFkZGluZyBpdCB0byBhIFVSTC5cbiAqL1xuZnVuY3Rpb24gcXVlcnlzdHJpbmcocXVlcnlzdHJpbmdQYXJhbXMpIHtcbiAgICBjb25zdCBwYXJhbXMgPSBbXTtcbiAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhxdWVyeXN0cmluZ1BhcmFtcykpIHtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgICB2YWx1ZS5mb3JFYWNoKGFycmF5VmFsID0+IHtcbiAgICAgICAgICAgICAgICBwYXJhbXMucHVzaChlbmNvZGVVUklDb21wb25lbnQoa2V5KSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudChhcnJheVZhbCkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBwYXJhbXMucHVzaChlbmNvZGVVUklDb21wb25lbnQoa2V5KSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwYXJhbXMubGVuZ3RoID8gJyYnICsgcGFyYW1zLmpvaW4oJyYnKSA6ICcnO1xufVxuLyoqXG4gKiBEZWNvZGVzIGEgcXVlcnlzdHJpbmcgKGUuZy4gP2FyZz12YWwmYXJnMj12YWwyKSBpbnRvIGEgcGFyYW1zIG9iamVjdFxuICogKGUuZy4ge2FyZzogJ3ZhbCcsIGFyZzI6ICd2YWwyJ30pXG4gKi9cbmZ1bmN0aW9uIHF1ZXJ5c3RyaW5nRGVjb2RlKHF1ZXJ5c3RyaW5nKSB7XG4gICAgY29uc3Qgb2JqID0ge307XG4gICAgY29uc3QgdG9rZW5zID0gcXVlcnlzdHJpbmcucmVwbGFjZSgvXlxcPy8sICcnKS5zcGxpdCgnJicpO1xuICAgIHRva2Vucy5mb3JFYWNoKHRva2VuID0+IHtcbiAgICAgICAgaWYgKHRva2VuKSB7XG4gICAgICAgICAgICBjb25zdCBba2V5LCB2YWx1ZV0gPSB0b2tlbi5zcGxpdCgnPScpO1xuICAgICAgICAgICAgb2JqW2RlY29kZVVSSUNvbXBvbmVudChrZXkpXSA9IGRlY29kZVVSSUNvbXBvbmVudCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gb2JqO1xufVxuLyoqXG4gKiBFeHRyYWN0IHRoZSBxdWVyeSBzdHJpbmcgcGFydCBvZiBhIFVSTCwgaW5jbHVkaW5nIHRoZSBsZWFkaW5nIHF1ZXN0aW9uIG1hcmsgKGlmIHByZXNlbnQpLlxuICovXG5mdW5jdGlvbiBleHRyYWN0UXVlcnlzdHJpbmcodXJsKSB7XG4gICAgY29uc3QgcXVlcnlTdGFydCA9IHVybC5pbmRleE9mKCc/Jyk7XG4gICAgaWYgKCFxdWVyeVN0YXJ0KSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgY29uc3QgZnJhZ21lbnRTdGFydCA9IHVybC5pbmRleE9mKCcjJywgcXVlcnlTdGFydCk7XG4gICAgcmV0dXJuIHVybC5zdWJzdHJpbmcocXVlcnlTdGFydCwgZnJhZ21lbnRTdGFydCA+IDAgPyBmcmFnbWVudFN0YXJ0IDogdW5kZWZpbmVkKTtcbn1cblxuLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cbi8qKlxuICogQGZpbGVvdmVydmlldyBTSEEtMSBjcnlwdG9ncmFwaGljIGhhc2guXG4gKiBWYXJpYWJsZSBuYW1lcyBmb2xsb3cgdGhlIG5vdGF0aW9uIGluIEZJUFMgUFVCIDE4MC0zOlxuICogaHR0cDovL2NzcmMubmlzdC5nb3YvcHVibGljYXRpb25zL2ZpcHMvZmlwczE4MC0zL2ZpcHMxODAtM19maW5hbC5wZGYuXG4gKlxuICogVXNhZ2U6XG4gKiAgIHZhciBzaGExID0gbmV3IHNoYTEoKTtcbiAqICAgc2hhMS51cGRhdGUoYnl0ZXMpO1xuICogICB2YXIgaGFzaCA9IHNoYTEuZGlnZXN0KCk7XG4gKlxuICogUGVyZm9ybWFuY2U6XG4gKiAgIENocm9tZSAyMzogICB+NDAwIE1iaXQvc1xuICogICBGaXJlZm94IDE2OiAgfjI1MCBNYml0L3NcbiAqXG4gKi9cbi8qKlxuICogU0hBLTEgY3J5cHRvZ3JhcGhpYyBoYXNoIGNvbnN0cnVjdG9yLlxuICpcbiAqIFRoZSBwcm9wZXJ0aWVzIGRlY2xhcmVkIGhlcmUgYXJlIGRpc2N1c3NlZCBpbiB0aGUgYWJvdmUgYWxnb3JpdGhtIGRvY3VtZW50LlxuICogQGNvbnN0cnVjdG9yXG4gKiBAZmluYWxcbiAqIEBzdHJ1Y3RcbiAqL1xuY2xhc3MgU2hhMSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBIb2xkcyB0aGUgcHJldmlvdXMgdmFsdWVzIG9mIGFjY3VtdWxhdGVkIHZhcmlhYmxlcyBhLWUgaW4gdGhlIGNvbXByZXNzX1xuICAgICAgICAgKiBmdW5jdGlvbi5cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuY2hhaW5fID0gW107XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIGJ1ZmZlciBob2xkaW5nIHRoZSBwYXJ0aWFsbHkgY29tcHV0ZWQgaGFzaCByZXN1bHQuXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmJ1Zl8gPSBbXTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFuIGFycmF5IG9mIDgwIGJ5dGVzLCBlYWNoIGEgcGFydCBvZiB0aGUgbWVzc2FnZSB0byBiZSBoYXNoZWQuICBSZWZlcnJlZCB0b1xuICAgICAgICAgKiBhcyB0aGUgbWVzc2FnZSBzY2hlZHVsZSBpbiB0aGUgZG9jcy5cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuV18gPSBbXTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIENvbnRhaW5zIGRhdGEgbmVlZGVkIHRvIHBhZCBtZXNzYWdlcyBsZXNzIHRoYW4gNjQgYnl0ZXMuXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnBhZF8gPSBbXTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwcml2YXRlIHtudW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmluYnVmXyA9IDA7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcHJpdmF0ZSB7bnVtYmVyfVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy50b3RhbF8gPSAwO1xuICAgICAgICB0aGlzLmJsb2NrU2l6ZSA9IDUxMiAvIDg7XG4gICAgICAgIHRoaXMucGFkX1swXSA9IDEyODtcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCB0aGlzLmJsb2NrU2l6ZTsgKytpKSB7XG4gICAgICAgICAgICB0aGlzLnBhZF9baV0gPSAwO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICB9XG4gICAgcmVzZXQoKSB7XG4gICAgICAgIHRoaXMuY2hhaW5fWzBdID0gMHg2NzQ1MjMwMTtcbiAgICAgICAgdGhpcy5jaGFpbl9bMV0gPSAweGVmY2RhYjg5O1xuICAgICAgICB0aGlzLmNoYWluX1syXSA9IDB4OThiYWRjZmU7XG4gICAgICAgIHRoaXMuY2hhaW5fWzNdID0gMHgxMDMyNTQ3NjtcbiAgICAgICAgdGhpcy5jaGFpbl9bNF0gPSAweGMzZDJlMWYwO1xuICAgICAgICB0aGlzLmluYnVmXyA9IDA7XG4gICAgICAgIHRoaXMudG90YWxfID0gMDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSW50ZXJuYWwgY29tcHJlc3MgaGVscGVyIGZ1bmN0aW9uLlxuICAgICAqIEBwYXJhbSBidWYgQmxvY2sgdG8gY29tcHJlc3MuXG4gICAgICogQHBhcmFtIG9mZnNldCBPZmZzZXQgb2YgdGhlIGJsb2NrIGluIHRoZSBidWZmZXIuXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBjb21wcmVzc18oYnVmLCBvZmZzZXQpIHtcbiAgICAgICAgaWYgKCFvZmZzZXQpIHtcbiAgICAgICAgICAgIG9mZnNldCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgVyA9IHRoaXMuV187XG4gICAgICAgIC8vIGdldCAxNiBiaWcgZW5kaWFuIHdvcmRzXG4gICAgICAgIGlmICh0eXBlb2YgYnVmID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxNjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgLy8gVE9ETyh1c2VyKTogW2J1ZyA4MTQwMTIyXSBSZWNlbnQgdmVyc2lvbnMgb2YgU2FmYXJpIGZvciBNYWMgT1MgYW5kIGlPU1xuICAgICAgICAgICAgICAgIC8vIGhhdmUgYSBidWcgdGhhdCB0dXJucyB0aGUgcG9zdC1pbmNyZW1lbnQgKysgb3BlcmF0b3IgaW50byBwcmUtaW5jcmVtZW50XG4gICAgICAgICAgICAgICAgLy8gZHVyaW5nIEpJVCBjb21waWxhdGlvbi4gIFdlIGhhdmUgY29kZSB0aGF0IGRlcGVuZHMgaGVhdmlseSBvbiBTSEEtMSBmb3JcbiAgICAgICAgICAgICAgICAvLyBjb3JyZWN0bmVzcyBhbmQgd2hpY2ggaXMgYWZmZWN0ZWQgYnkgdGhpcyBidWcsIHNvIEkndmUgcmVtb3ZlZCBhbGwgdXNlc1xuICAgICAgICAgICAgICAgIC8vIG9mIHBvc3QtaW5jcmVtZW50ICsrIGluIHdoaWNoIHRoZSByZXN1bHQgdmFsdWUgaXMgdXNlZC4gIFdlIGNhbiByZXZlcnRcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGNoYW5nZSBvbmNlIHRoZSBTYWZhcmkgYnVnXG4gICAgICAgICAgICAgICAgLy8gKGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD0xMDkwMzYpIGhhcyBiZWVuIGZpeGVkIGFuZFxuICAgICAgICAgICAgICAgIC8vIG1vc3QgY2xpZW50cyBoYXZlIGJlZW4gdXBkYXRlZC5cbiAgICAgICAgICAgICAgICBXW2ldID1cbiAgICAgICAgICAgICAgICAgICAgKGJ1Zi5jaGFyQ29kZUF0KG9mZnNldCkgPDwgMjQpIHxcbiAgICAgICAgICAgICAgICAgICAgICAgIChidWYuY2hhckNvZGVBdChvZmZzZXQgKyAxKSA8PCAxNikgfFxuICAgICAgICAgICAgICAgICAgICAgICAgKGJ1Zi5jaGFyQ29kZUF0KG9mZnNldCArIDIpIDw8IDgpIHxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1Zi5jaGFyQ29kZUF0KG9mZnNldCArIDMpO1xuICAgICAgICAgICAgICAgIG9mZnNldCArPSA0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxNjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgV1tpXSA9XG4gICAgICAgICAgICAgICAgICAgIChidWZbb2Zmc2V0XSA8PCAyNCkgfFxuICAgICAgICAgICAgICAgICAgICAgICAgKGJ1ZltvZmZzZXQgKyAxXSA8PCAxNikgfFxuICAgICAgICAgICAgICAgICAgICAgICAgKGJ1ZltvZmZzZXQgKyAyXSA8PCA4KSB8XG4gICAgICAgICAgICAgICAgICAgICAgICBidWZbb2Zmc2V0ICsgM107XG4gICAgICAgICAgICAgICAgb2Zmc2V0ICs9IDQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gZXhwYW5kIHRvIDgwIHdvcmRzXG4gICAgICAgIGZvciAobGV0IGkgPSAxNjsgaSA8IDgwOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHQgPSBXW2kgLSAzXSBeIFdbaSAtIDhdIF4gV1tpIC0gMTRdIF4gV1tpIC0gMTZdO1xuICAgICAgICAgICAgV1tpXSA9ICgodCA8PCAxKSB8ICh0ID4+PiAzMSkpICYgMHhmZmZmZmZmZjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgYSA9IHRoaXMuY2hhaW5fWzBdO1xuICAgICAgICBsZXQgYiA9IHRoaXMuY2hhaW5fWzFdO1xuICAgICAgICBsZXQgYyA9IHRoaXMuY2hhaW5fWzJdO1xuICAgICAgICBsZXQgZCA9IHRoaXMuY2hhaW5fWzNdO1xuICAgICAgICBsZXQgZSA9IHRoaXMuY2hhaW5fWzRdO1xuICAgICAgICBsZXQgZiwgaztcbiAgICAgICAgLy8gVE9ETyh1c2VyKTogVHJ5IHRvIHVucm9sbCB0aGlzIGxvb3AgdG8gc3BlZWQgdXAgdGhlIGNvbXB1dGF0aW9uLlxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDgwOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChpIDwgNDApIHtcbiAgICAgICAgICAgICAgICBpZiAoaSA8IDIwKSB7XG4gICAgICAgICAgICAgICAgICAgIGYgPSBkIF4gKGIgJiAoYyBeIGQpKTtcbiAgICAgICAgICAgICAgICAgICAgayA9IDB4NWE4Mjc5OTk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmID0gYiBeIGMgXiBkO1xuICAgICAgICAgICAgICAgICAgICBrID0gMHg2ZWQ5ZWJhMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoaSA8IDYwKSB7XG4gICAgICAgICAgICAgICAgICAgIGYgPSAoYiAmIGMpIHwgKGQgJiAoYiB8IGMpKTtcbiAgICAgICAgICAgICAgICAgICAgayA9IDB4OGYxYmJjZGM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmID0gYiBeIGMgXiBkO1xuICAgICAgICAgICAgICAgICAgICBrID0gMHhjYTYyYzFkNjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCB0ID0gKCgoYSA8PCA1KSB8IChhID4+PiAyNykpICsgZiArIGUgKyBrICsgV1tpXSkgJiAweGZmZmZmZmZmO1xuICAgICAgICAgICAgZSA9IGQ7XG4gICAgICAgICAgICBkID0gYztcbiAgICAgICAgICAgIGMgPSAoKGIgPDwgMzApIHwgKGIgPj4+IDIpKSAmIDB4ZmZmZmZmZmY7XG4gICAgICAgICAgICBiID0gYTtcbiAgICAgICAgICAgIGEgPSB0O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2hhaW5fWzBdID0gKHRoaXMuY2hhaW5fWzBdICsgYSkgJiAweGZmZmZmZmZmO1xuICAgICAgICB0aGlzLmNoYWluX1sxXSA9ICh0aGlzLmNoYWluX1sxXSArIGIpICYgMHhmZmZmZmZmZjtcbiAgICAgICAgdGhpcy5jaGFpbl9bMl0gPSAodGhpcy5jaGFpbl9bMl0gKyBjKSAmIDB4ZmZmZmZmZmY7XG4gICAgICAgIHRoaXMuY2hhaW5fWzNdID0gKHRoaXMuY2hhaW5fWzNdICsgZCkgJiAweGZmZmZmZmZmO1xuICAgICAgICB0aGlzLmNoYWluX1s0XSA9ICh0aGlzLmNoYWluX1s0XSArIGUpICYgMHhmZmZmZmZmZjtcbiAgICB9XG4gICAgdXBkYXRlKGJ5dGVzLCBsZW5ndGgpIHtcbiAgICAgICAgLy8gVE9ETyhqb2hubGVueik6IHRpZ2h0ZW4gdGhlIGZ1bmN0aW9uIHNpZ25hdHVyZSBhbmQgcmVtb3ZlIHRoaXMgY2hlY2tcbiAgICAgICAgaWYgKGJ5dGVzID09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGxlbmd0aCA9IGJ5dGVzLmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBsZW5ndGhNaW51c0Jsb2NrID0gbGVuZ3RoIC0gdGhpcy5ibG9ja1NpemU7XG4gICAgICAgIGxldCBuID0gMDtcbiAgICAgICAgLy8gVXNpbmcgbG9jYWwgaW5zdGVhZCBvZiBtZW1iZXIgdmFyaWFibGVzIGdpdmVzIH41JSBzcGVlZHVwIG9uIEZpcmVmb3ggMTYuXG4gICAgICAgIGNvbnN0IGJ1ZiA9IHRoaXMuYnVmXztcbiAgICAgICAgbGV0IGluYnVmID0gdGhpcy5pbmJ1Zl87XG4gICAgICAgIC8vIFRoZSBvdXRlciB3aGlsZSBsb29wIHNob3VsZCBleGVjdXRlIGF0IG1vc3QgdHdpY2UuXG4gICAgICAgIHdoaWxlIChuIDwgbGVuZ3RoKSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGhhdmUgbm8gZGF0YSBpbiB0aGUgYmxvY2sgdG8gdG9wIHVwLCB3ZSBjYW4gZGlyZWN0bHkgcHJvY2VzcyB0aGVcbiAgICAgICAgICAgIC8vIGlucHV0IGJ1ZmZlciAoYXNzdW1pbmcgaXQgY29udGFpbnMgc3VmZmljaWVudCBkYXRhKS4gVGhpcyBnaXZlcyB+MjUlXG4gICAgICAgICAgICAvLyBzcGVlZHVwIG9uIENocm9tZSAyMyBhbmQgfjE1JSBzcGVlZHVwIG9uIEZpcmVmb3ggMTYsIGJ1dCByZXF1aXJlcyB0aGF0XG4gICAgICAgICAgICAvLyB0aGUgZGF0YSBpcyBwcm92aWRlZCBpbiBsYXJnZSBjaHVua3MgKG9yIGluIG11bHRpcGxlcyBvZiA2NCBieXRlcykuXG4gICAgICAgICAgICBpZiAoaW5idWYgPT09IDApIHtcbiAgICAgICAgICAgICAgICB3aGlsZSAobiA8PSBsZW5ndGhNaW51c0Jsb2NrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcHJlc3NfKGJ5dGVzLCBuKTtcbiAgICAgICAgICAgICAgICAgICAgbiArPSB0aGlzLmJsb2NrU2l6ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIGJ5dGVzID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIHdoaWxlIChuIDwgbGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIGJ1ZltpbmJ1Zl0gPSBieXRlcy5jaGFyQ29kZUF0KG4pO1xuICAgICAgICAgICAgICAgICAgICArK2luYnVmO1xuICAgICAgICAgICAgICAgICAgICArK247XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbmJ1ZiA9PT0gdGhpcy5ibG9ja1NpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcHJlc3NfKGJ1Zik7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmJ1ZiA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBKdW1wIHRvIHRoZSBvdXRlciBsb29wIHNvIHdlIHVzZSB0aGUgZnVsbC1ibG9jayBvcHRpbWl6YXRpb24uXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHdoaWxlIChuIDwgbGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIGJ1ZltpbmJ1Zl0gPSBieXRlc1tuXTtcbiAgICAgICAgICAgICAgICAgICAgKytpbmJ1ZjtcbiAgICAgICAgICAgICAgICAgICAgKytuO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW5idWYgPT09IHRoaXMuYmxvY2tTaXplKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbXByZXNzXyhidWYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5idWYgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSnVtcCB0byB0aGUgb3V0ZXIgbG9vcCBzbyB3ZSB1c2UgdGhlIGZ1bGwtYmxvY2sgb3B0aW1pemF0aW9uLlxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbmJ1Zl8gPSBpbmJ1ZjtcbiAgICAgICAgdGhpcy50b3RhbF8gKz0gbGVuZ3RoO1xuICAgIH1cbiAgICAvKiogQG92ZXJyaWRlICovXG4gICAgZGlnZXN0KCkge1xuICAgICAgICBjb25zdCBkaWdlc3QgPSBbXTtcbiAgICAgICAgbGV0IHRvdGFsQml0cyA9IHRoaXMudG90YWxfICogODtcbiAgICAgICAgLy8gQWRkIHBhZCAweDgwIDB4MDAqLlxuICAgICAgICBpZiAodGhpcy5pbmJ1Zl8gPCA1Nikge1xuICAgICAgICAgICAgdGhpcy51cGRhdGUodGhpcy5wYWRfLCA1NiAtIHRoaXMuaW5idWZfKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKHRoaXMucGFkXywgdGhpcy5ibG9ja1NpemUgLSAodGhpcy5pbmJ1Zl8gLSA1NikpO1xuICAgICAgICB9XG4gICAgICAgIC8vIEFkZCAjIGJpdHMuXG4gICAgICAgIGZvciAobGV0IGkgPSB0aGlzLmJsb2NrU2l6ZSAtIDE7IGkgPj0gNTY7IGktLSkge1xuICAgICAgICAgICAgdGhpcy5idWZfW2ldID0gdG90YWxCaXRzICYgMjU1O1xuICAgICAgICAgICAgdG90YWxCaXRzIC89IDI1NjsgLy8gRG9uJ3QgdXNlIGJpdC1zaGlmdGluZyBoZXJlIVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29tcHJlc3NfKHRoaXMuYnVmXyk7XG4gICAgICAgIGxldCBuID0gMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA1OyBpKyspIHtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAyNDsgaiA+PSAwOyBqIC09IDgpIHtcbiAgICAgICAgICAgICAgICBkaWdlc3Rbbl0gPSAodGhpcy5jaGFpbl9baV0gPj4gaikgJiAyNTU7XG4gICAgICAgICAgICAgICAgKytuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkaWdlc3Q7XG4gICAgfVxufVxuXG4vKipcbiAqIEhlbHBlciB0byBtYWtlIGEgU3Vic2NyaWJlIGZ1bmN0aW9uIChqdXN0IGxpa2UgUHJvbWlzZSBoZWxwcyBtYWtlIGFcbiAqIFRoZW5hYmxlKS5cbiAqXG4gKiBAcGFyYW0gZXhlY3V0b3IgRnVuY3Rpb24gd2hpY2ggY2FuIG1ha2UgY2FsbHMgdG8gYSBzaW5nbGUgT2JzZXJ2ZXJcbiAqICAgICBhcyBhIHByb3h5LlxuICogQHBhcmFtIG9uTm9PYnNlcnZlcnMgQ2FsbGJhY2sgd2hlbiBjb3VudCBvZiBPYnNlcnZlcnMgZ29lcyB0byB6ZXJvLlxuICovXG5mdW5jdGlvbiBjcmVhdGVTdWJzY3JpYmUoZXhlY3V0b3IsIG9uTm9PYnNlcnZlcnMpIHtcbiAgICBjb25zdCBwcm94eSA9IG5ldyBPYnNlcnZlclByb3h5KGV4ZWN1dG9yLCBvbk5vT2JzZXJ2ZXJzKTtcbiAgICByZXR1cm4gcHJveHkuc3Vic2NyaWJlLmJpbmQocHJveHkpO1xufVxuLyoqXG4gKiBJbXBsZW1lbnQgZmFuLW91dCBmb3IgYW55IG51bWJlciBvZiBPYnNlcnZlcnMgYXR0YWNoZWQgdmlhIGEgc3Vic2NyaWJlXG4gKiBmdW5jdGlvbi5cbiAqL1xuY2xhc3MgT2JzZXJ2ZXJQcm94eSB7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIGV4ZWN1dG9yIEZ1bmN0aW9uIHdoaWNoIGNhbiBtYWtlIGNhbGxzIHRvIGEgc2luZ2xlIE9ic2VydmVyXG4gICAgICogICAgIGFzIGEgcHJveHkuXG4gICAgICogQHBhcmFtIG9uTm9PYnNlcnZlcnMgQ2FsbGJhY2sgd2hlbiBjb3VudCBvZiBPYnNlcnZlcnMgZ29lcyB0byB6ZXJvLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGV4ZWN1dG9yLCBvbk5vT2JzZXJ2ZXJzKSB7XG4gICAgICAgIHRoaXMub2JzZXJ2ZXJzID0gW107XG4gICAgICAgIHRoaXMudW5zdWJzY3JpYmVzID0gW107XG4gICAgICAgIHRoaXMub2JzZXJ2ZXJDb3VudCA9IDA7XG4gICAgICAgIC8vIE1pY3JvLXRhc2sgc2NoZWR1bGluZyBieSBjYWxsaW5nIHRhc2sudGhlbigpLlxuICAgICAgICB0aGlzLnRhc2sgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgdGhpcy5maW5hbGl6ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5vbk5vT2JzZXJ2ZXJzID0gb25Ob09ic2VydmVycztcbiAgICAgICAgLy8gQ2FsbCB0aGUgZXhlY3V0b3IgYXN5bmNocm9ub3VzbHkgc28gc3Vic2NyaWJlcnMgdGhhdCBhcmUgY2FsbGVkXG4gICAgICAgIC8vIHN5bmNocm9ub3VzbHkgYWZ0ZXIgdGhlIGNyZWF0aW9uIG9mIHRoZSBzdWJzY3JpYmUgZnVuY3Rpb25cbiAgICAgICAgLy8gY2FuIHN0aWxsIHJlY2VpdmUgdGhlIHZlcnkgZmlyc3QgdmFsdWUgZ2VuZXJhdGVkIGluIHRoZSBleGVjdXRvci5cbiAgICAgICAgdGhpcy50YXNrXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBleGVjdXRvcih0aGlzKTtcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChlID0+IHtcbiAgICAgICAgICAgIHRoaXMuZXJyb3IoZSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBuZXh0KHZhbHVlKSB7XG4gICAgICAgIHRoaXMuZm9yRWFjaE9ic2VydmVyKChvYnNlcnZlcikgPT4ge1xuICAgICAgICAgICAgb2JzZXJ2ZXIubmV4dCh2YWx1ZSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBlcnJvcihlcnJvcikge1xuICAgICAgICB0aGlzLmZvckVhY2hPYnNlcnZlcigob2JzZXJ2ZXIpID0+IHtcbiAgICAgICAgICAgIG9ic2VydmVyLmVycm9yKGVycm9yKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuY2xvc2UoZXJyb3IpO1xuICAgIH1cbiAgICBjb21wbGV0ZSgpIHtcbiAgICAgICAgdGhpcy5mb3JFYWNoT2JzZXJ2ZXIoKG9ic2VydmVyKSA9PiB7XG4gICAgICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTdWJzY3JpYmUgZnVuY3Rpb24gdGhhdCBjYW4gYmUgdXNlZCB0byBhZGQgYW4gT2JzZXJ2ZXIgdG8gdGhlIGZhbi1vdXQgbGlzdC5cbiAgICAgKlxuICAgICAqIC0gV2UgcmVxdWlyZSB0aGF0IG5vIGV2ZW50IGlzIHNlbnQgdG8gYSBzdWJzY3JpYmVyIHN5bmNocm9ub3VzbHkgdG8gdGhlaXJcbiAgICAgKiAgIGNhbGwgdG8gc3Vic2NyaWJlKCkuXG4gICAgICovXG4gICAgc3Vic2NyaWJlKG5leHRPck9ic2VydmVyLCBlcnJvciwgY29tcGxldGUpIHtcbiAgICAgICAgbGV0IG9ic2VydmVyO1xuICAgICAgICBpZiAobmV4dE9yT2JzZXJ2ZXIgPT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgICAgZXJyb3IgPT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgICAgY29tcGxldGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIE9ic2VydmVyLicpO1xuICAgICAgICB9XG4gICAgICAgIC8vIEFzc2VtYmxlIGFuIE9ic2VydmVyIG9iamVjdCB3aGVuIHBhc3NlZCBhcyBjYWxsYmFjayBmdW5jdGlvbnMuXG4gICAgICAgIGlmIChpbXBsZW1lbnRzQW55TWV0aG9kcyhuZXh0T3JPYnNlcnZlciwgW1xuICAgICAgICAgICAgJ25leHQnLFxuICAgICAgICAgICAgJ2Vycm9yJyxcbiAgICAgICAgICAgICdjb21wbGV0ZSdcbiAgICAgICAgXSkpIHtcbiAgICAgICAgICAgIG9ic2VydmVyID0gbmV4dE9yT2JzZXJ2ZXI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBvYnNlcnZlciA9IHtcbiAgICAgICAgICAgICAgICBuZXh0OiBuZXh0T3JPYnNlcnZlcixcbiAgICAgICAgICAgICAgICBlcnJvcixcbiAgICAgICAgICAgICAgICBjb21wbGV0ZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob2JzZXJ2ZXIubmV4dCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBvYnNlcnZlci5uZXh0ID0gbm9vcDtcbiAgICAgICAgfVxuICAgICAgICBpZiAob2JzZXJ2ZXIuZXJyb3IgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgb2JzZXJ2ZXIuZXJyb3IgPSBub29wO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvYnNlcnZlci5jb21wbGV0ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSA9IG5vb3A7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdW5zdWIgPSB0aGlzLnVuc3Vic2NyaWJlT25lLmJpbmQodGhpcywgdGhpcy5vYnNlcnZlcnMubGVuZ3RoKTtcbiAgICAgICAgLy8gQXR0ZW1wdCB0byBzdWJzY3JpYmUgdG8gYSB0ZXJtaW5hdGVkIE9ic2VydmFibGUgLSB3ZVxuICAgICAgICAvLyBqdXN0IHJlc3BvbmQgdG8gdGhlIE9ic2VydmVyIHdpdGggdGhlIGZpbmFsIGVycm9yIG9yIGNvbXBsZXRlXG4gICAgICAgIC8vIGV2ZW50LlxuICAgICAgICBpZiAodGhpcy5maW5hbGl6ZWQpIHtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZmxvYXRpbmctcHJvbWlzZXNcbiAgICAgICAgICAgIHRoaXMudGFzay50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5maW5hbEVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvYnNlcnZlci5lcnJvcih0aGlzLmZpbmFsRXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBub3RoaW5nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMub2JzZXJ2ZXJzLnB1c2gob2JzZXJ2ZXIpO1xuICAgICAgICByZXR1cm4gdW5zdWI7XG4gICAgfVxuICAgIC8vIFVuc3Vic2NyaWJlIGlzIHN5bmNocm9ub3VzIC0gd2UgZ3VhcmFudGVlIHRoYXQgbm8gZXZlbnRzIGFyZSBzZW50IHRvXG4gICAgLy8gYW55IHVuc3Vic2NyaWJlZCBPYnNlcnZlci5cbiAgICB1bnN1YnNjcmliZU9uZShpKSB7XG4gICAgICAgIGlmICh0aGlzLm9ic2VydmVycyA9PT0gdW5kZWZpbmVkIHx8IHRoaXMub2JzZXJ2ZXJzW2ldID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgdGhpcy5vYnNlcnZlcnNbaV07XG4gICAgICAgIHRoaXMub2JzZXJ2ZXJDb3VudCAtPSAxO1xuICAgICAgICBpZiAodGhpcy5vYnNlcnZlckNvdW50ID09PSAwICYmIHRoaXMub25Ob09ic2VydmVycyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLm9uTm9PYnNlcnZlcnModGhpcyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZm9yRWFjaE9ic2VydmVyKGZuKSB7XG4gICAgICAgIGlmICh0aGlzLmZpbmFsaXplZCkge1xuICAgICAgICAgICAgLy8gQWxyZWFkeSBjbG9zZWQgYnkgcHJldmlvdXMgZXZlbnQuLi4uanVzdCBlYXQgdGhlIGFkZGl0aW9uYWwgdmFsdWVzLlxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIFNpbmNlIHNlbmRPbmUgY2FsbHMgYXN5bmNocm9ub3VzbHkgLSB0aGVyZSBpcyBubyBjaGFuY2UgdGhhdFxuICAgICAgICAvLyB0aGlzLm9ic2VydmVycyB3aWxsIGJlY29tZSB1bmRlZmluZWQuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5vYnNlcnZlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuc2VuZE9uZShpLCBmbik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gQ2FsbCB0aGUgT2JzZXJ2ZXIgdmlhIG9uZSBvZiBpdCdzIGNhbGxiYWNrIGZ1bmN0aW9uLiBXZSBhcmUgY2FyZWZ1bCB0b1xuICAgIC8vIGNvbmZpcm0gdGhhdCB0aGUgb2JzZXJ2ZSBoYXMgbm90IGJlZW4gdW5zdWJzY3JpYmVkIHNpbmNlIHRoaXMgYXN5bmNocm9ub3VzXG4gICAgLy8gZnVuY3Rpb24gaGFkIGJlZW4gcXVldWVkLlxuICAgIHNlbmRPbmUoaSwgZm4pIHtcbiAgICAgICAgLy8gRXhlY3V0ZSB0aGUgY2FsbGJhY2sgYXN5bmNocm9ub3VzbHlcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1mbG9hdGluZy1wcm9taXNlc1xuICAgICAgICB0aGlzLnRhc2sudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5vYnNlcnZlcnMgIT09IHVuZGVmaW5lZCAmJiB0aGlzLm9ic2VydmVyc1tpXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgZm4odGhpcy5vYnNlcnZlcnNbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBJZ25vcmUgZXhjZXB0aW9ucyByYWlzZWQgaW4gT2JzZXJ2ZXJzIG9yIG1pc3NpbmcgbWV0aG9kcyBvZiBhblxuICAgICAgICAgICAgICAgICAgICAvLyBPYnNlcnZlci5cbiAgICAgICAgICAgICAgICAgICAgLy8gTG9nIGVycm9yIHRvIGNvbnNvbGUuIGIvMzE0MDQ4MDZcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJyAmJiBjb25zb2xlLmVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgY2xvc2UoZXJyKSB7XG4gICAgICAgIGlmICh0aGlzLmZpbmFsaXplZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZmluYWxpemVkID0gdHJ1ZTtcbiAgICAgICAgaWYgKGVyciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmZpbmFsRXJyb3IgPSBlcnI7XG4gICAgICAgIH1cbiAgICAgICAgLy8gUHJveHkgaXMgbm8gbG9uZ2VyIG5lZWRlZCAtIGdhcmJhZ2UgY29sbGVjdCByZWZlcmVuY2VzXG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZmxvYXRpbmctcHJvbWlzZXNcbiAgICAgICAgdGhpcy50YXNrLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5vYnNlcnZlcnMgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB0aGlzLm9uTm9PYnNlcnZlcnMgPSB1bmRlZmluZWQ7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbi8qKiBUdXJuIHN5bmNocm9ub3VzIGZ1bmN0aW9uIGludG8gb25lIGNhbGxlZCBhc3luY2hyb25vdXNseS4gKi9cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvYmFuLXR5cGVzXG5mdW5jdGlvbiBhc3luYyhmbiwgb25FcnJvcikge1xuICAgIHJldHVybiAoLi4uYXJncykgPT4ge1xuICAgICAgICBQcm9taXNlLnJlc29sdmUodHJ1ZSlcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIGZuKC4uLmFyZ3MpO1xuICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICAgICAgaWYgKG9uRXJyb3IpIHtcbiAgICAgICAgICAgICAgICBvbkVycm9yKGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcbn1cbi8qKlxuICogUmV0dXJuIHRydWUgaWYgdGhlIG9iamVjdCBwYXNzZWQgaW4gaW1wbGVtZW50cyBhbnkgb2YgdGhlIG5hbWVkIG1ldGhvZHMuXG4gKi9cbmZ1bmN0aW9uIGltcGxlbWVudHNBbnlNZXRob2RzKG9iaiwgbWV0aG9kcykge1xuICAgIGlmICh0eXBlb2Ygb2JqICE9PSAnb2JqZWN0JyB8fCBvYmogPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IG1ldGhvZCBvZiBtZXRob2RzKSB7XG4gICAgICAgIGlmIChtZXRob2QgaW4gb2JqICYmIHR5cGVvZiBvYmpbbWV0aG9kXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuZnVuY3Rpb24gbm9vcCgpIHtcbiAgICAvLyBkbyBub3RoaW5nXG59XG5cbi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG4vKipcbiAqIENoZWNrIHRvIG1ha2Ugc3VyZSB0aGUgYXBwcm9wcmlhdGUgbnVtYmVyIG9mIGFyZ3VtZW50cyBhcmUgcHJvdmlkZWQgZm9yIGEgcHVibGljIGZ1bmN0aW9uLlxuICogVGhyb3dzIGFuIGVycm9yIGlmIGl0IGZhaWxzLlxuICpcbiAqIEBwYXJhbSBmbk5hbWUgVGhlIGZ1bmN0aW9uIG5hbWVcbiAqIEBwYXJhbSBtaW5Db3VudCBUaGUgbWluaW11bSBudW1iZXIgb2YgYXJndW1lbnRzIHRvIGFsbG93IGZvciB0aGUgZnVuY3Rpb24gY2FsbFxuICogQHBhcmFtIG1heENvdW50IFRoZSBtYXhpbXVtIG51bWJlciBvZiBhcmd1bWVudCB0byBhbGxvdyBmb3IgdGhlIGZ1bmN0aW9uIGNhbGxcbiAqIEBwYXJhbSBhcmdDb3VudCBUaGUgYWN0dWFsIG51bWJlciBvZiBhcmd1bWVudHMgcHJvdmlkZWQuXG4gKi9cbmNvbnN0IHZhbGlkYXRlQXJnQ291bnQgPSBmdW5jdGlvbiAoZm5OYW1lLCBtaW5Db3VudCwgbWF4Q291bnQsIGFyZ0NvdW50KSB7XG4gICAgbGV0IGFyZ0Vycm9yO1xuICAgIGlmIChhcmdDb3VudCA8IG1pbkNvdW50KSB7XG4gICAgICAgIGFyZ0Vycm9yID0gJ2F0IGxlYXN0ICcgKyBtaW5Db3VudDtcbiAgICB9XG4gICAgZWxzZSBpZiAoYXJnQ291bnQgPiBtYXhDb3VudCkge1xuICAgICAgICBhcmdFcnJvciA9IG1heENvdW50ID09PSAwID8gJ25vbmUnIDogJ25vIG1vcmUgdGhhbiAnICsgbWF4Q291bnQ7XG4gICAgfVxuICAgIGlmIChhcmdFcnJvcikge1xuICAgICAgICBjb25zdCBlcnJvciA9IGZuTmFtZSArXG4gICAgICAgICAgICAnIGZhaWxlZDogV2FzIGNhbGxlZCB3aXRoICcgK1xuICAgICAgICAgICAgYXJnQ291bnQgK1xuICAgICAgICAgICAgKGFyZ0NvdW50ID09PSAxID8gJyBhcmd1bWVudC4nIDogJyBhcmd1bWVudHMuJykgK1xuICAgICAgICAgICAgJyBFeHBlY3RzICcgK1xuICAgICAgICAgICAgYXJnRXJyb3IgK1xuICAgICAgICAgICAgJy4nO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3IpO1xuICAgIH1cbn07XG4vKipcbiAqIEdlbmVyYXRlcyBhIHN0cmluZyB0byBwcmVmaXggYW4gZXJyb3IgbWVzc2FnZSBhYm91dCBmYWlsZWQgYXJndW1lbnQgdmFsaWRhdGlvblxuICpcbiAqIEBwYXJhbSBmbk5hbWUgVGhlIGZ1bmN0aW9uIG5hbWVcbiAqIEBwYXJhbSBhcmdOYW1lIFRoZSBuYW1lIG9mIHRoZSBhcmd1bWVudFxuICogQHJldHVybiBUaGUgcHJlZml4IHRvIGFkZCB0byB0aGUgZXJyb3IgdGhyb3duIGZvciB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBlcnJvclByZWZpeChmbk5hbWUsIGFyZ05hbWUpIHtcbiAgICByZXR1cm4gYCR7Zm5OYW1lfSBmYWlsZWQ6ICR7YXJnTmFtZX0gYXJndW1lbnQgYDtcbn1cbi8qKlxuICogQHBhcmFtIGZuTmFtZVxuICogQHBhcmFtIGFyZ3VtZW50TnVtYmVyXG4gKiBAcGFyYW0gbmFtZXNwYWNlXG4gKiBAcGFyYW0gb3B0aW9uYWxcbiAqL1xuZnVuY3Rpb24gdmFsaWRhdGVOYW1lc3BhY2UoZm5OYW1lLCBuYW1lc3BhY2UsIG9wdGlvbmFsKSB7XG4gICAgaWYgKG9wdGlvbmFsICYmICFuYW1lc3BhY2UpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIG5hbWVzcGFjZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgLy9UT0RPOiBJIHNob3VsZCBkbyBtb3JlIHZhbGlkYXRpb24gaGVyZS4gV2Ugb25seSBhbGxvdyBjZXJ0YWluIGNoYXJzIGluIG5hbWVzcGFjZXMuXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvclByZWZpeChmbk5hbWUsICduYW1lc3BhY2UnKSArICdtdXN0IGJlIGEgdmFsaWQgZmlyZWJhc2UgbmFtZXNwYWNlLicpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHZhbGlkYXRlQ2FsbGJhY2soZm5OYW1lLCBhcmd1bWVudE5hbWUsIFxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9iYW4tdHlwZXNcbmNhbGxiYWNrLCBvcHRpb25hbCkge1xuICAgIGlmIChvcHRpb25hbCAmJiAhY2FsbGJhY2spIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvclByZWZpeChmbk5hbWUsIGFyZ3VtZW50TmFtZSkgKyAnbXVzdCBiZSBhIHZhbGlkIGZ1bmN0aW9uLicpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHZhbGlkYXRlQ29udGV4dE9iamVjdChmbk5hbWUsIGFyZ3VtZW50TmFtZSwgY29udGV4dCwgb3B0aW9uYWwpIHtcbiAgICBpZiAob3B0aW9uYWwgJiYgIWNvbnRleHQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGNvbnRleHQgIT09ICdvYmplY3QnIHx8IGNvbnRleHQgPT09IG51bGwpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yUHJlZml4KGZuTmFtZSwgYXJndW1lbnROYW1lKSArICdtdXN0IGJlIGEgdmFsaWQgY29udGV4dCBvYmplY3QuJyk7XG4gICAgfVxufVxuXG4vKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuLy8gQ29kZSBvcmlnaW5hbGx5IGNhbWUgZnJvbSBnb29nLmNyeXB0LnN0cmluZ1RvVXRmOEJ5dGVBcnJheSwgYnV0IGZvciBzb21lIHJlYXNvbiB0aGV5XG4vLyBhdXRvbWF0aWNhbGx5IHJlcGxhY2VkICdcXHJcXG4nIHdpdGggJ1xcbicsIGFuZCB0aGV5IGRpZG4ndCBoYW5kbGUgc3Vycm9nYXRlIHBhaXJzLFxuLy8gc28gaXQncyBiZWVuIG1vZGlmaWVkLlxuLy8gTm90ZSB0aGF0IG5vdCBhbGwgVW5pY29kZSBjaGFyYWN0ZXJzIGFwcGVhciBhcyBzaW5nbGUgY2hhcmFjdGVycyBpbiBKYXZhU2NyaXB0IHN0cmluZ3MuXG4vLyBmcm9tQ2hhckNvZGUgcmV0dXJucyB0aGUgVVRGLTE2IGVuY29kaW5nIG9mIGEgY2hhcmFjdGVyIC0gc28gc29tZSBVbmljb2RlIGNoYXJhY3RlcnNcbi8vIHVzZSAyIGNoYXJhY3RlcnMgaW4gSmF2YVNjcmlwdC4gIEFsbCA0LWJ5dGUgVVRGLTggY2hhcmFjdGVycyBiZWdpbiB3aXRoIGEgZmlyc3Rcbi8vIGNoYXJhY3RlciBpbiB0aGUgcmFuZ2UgMHhEODAwIC0gMHhEQkZGICh0aGUgZmlyc3QgY2hhcmFjdGVyIG9mIGEgc28tY2FsbGVkIHN1cnJvZ2F0ZVxuLy8gcGFpcikuXG4vLyBTZWUgaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzUuMS8jc2VjLTE1LjEuM1xuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqL1xuY29uc3Qgc3RyaW5nVG9CeXRlQXJyYXkgPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgY29uc3Qgb3V0ID0gW107XG4gICAgbGV0IHAgPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBjID0gc3RyLmNoYXJDb2RlQXQoaSk7XG4gICAgICAgIC8vIElzIHRoaXMgdGhlIGxlYWQgc3Vycm9nYXRlIGluIGEgc3Vycm9nYXRlIHBhaXI/XG4gICAgICAgIGlmIChjID49IDB4ZDgwMCAmJiBjIDw9IDB4ZGJmZikge1xuICAgICAgICAgICAgY29uc3QgaGlnaCA9IGMgLSAweGQ4MDA7IC8vIHRoZSBoaWdoIDEwIGJpdHMuXG4gICAgICAgICAgICBpKys7XG4gICAgICAgICAgICBhc3NlcnQoaSA8IHN0ci5sZW5ndGgsICdTdXJyb2dhdGUgcGFpciBtaXNzaW5nIHRyYWlsIHN1cnJvZ2F0ZS4nKTtcbiAgICAgICAgICAgIGNvbnN0IGxvdyA9IHN0ci5jaGFyQ29kZUF0KGkpIC0gMHhkYzAwOyAvLyB0aGUgbG93IDEwIGJpdHMuXG4gICAgICAgICAgICBjID0gMHgxMDAwMCArIChoaWdoIDw8IDEwKSArIGxvdztcbiAgICAgICAgfVxuICAgICAgICBpZiAoYyA8IDEyOCkge1xuICAgICAgICAgICAgb3V0W3ArK10gPSBjO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGMgPCAyMDQ4KSB7XG4gICAgICAgICAgICBvdXRbcCsrXSA9IChjID4+IDYpIHwgMTkyO1xuICAgICAgICAgICAgb3V0W3ArK10gPSAoYyAmIDYzKSB8IDEyODtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjIDwgNjU1MzYpIHtcbiAgICAgICAgICAgIG91dFtwKytdID0gKGMgPj4gMTIpIHwgMjI0O1xuICAgICAgICAgICAgb3V0W3ArK10gPSAoKGMgPj4gNikgJiA2MykgfCAxMjg7XG4gICAgICAgICAgICBvdXRbcCsrXSA9IChjICYgNjMpIHwgMTI4O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgb3V0W3ArK10gPSAoYyA+PiAxOCkgfCAyNDA7XG4gICAgICAgICAgICBvdXRbcCsrXSA9ICgoYyA+PiAxMikgJiA2MykgfCAxMjg7XG4gICAgICAgICAgICBvdXRbcCsrXSA9ICgoYyA+PiA2KSAmIDYzKSB8IDEyODtcbiAgICAgICAgICAgIG91dFtwKytdID0gKGMgJiA2MykgfCAxMjg7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG91dDtcbn07XG4vKipcbiAqIENhbGN1bGF0ZSBsZW5ndGggd2l0aG91dCBhY3R1YWxseSBjb252ZXJ0aW5nOyB1c2VmdWwgZm9yIGRvaW5nIGNoZWFwZXIgdmFsaWRhdGlvbi5cbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge251bWJlcn1cbiAqL1xuY29uc3Qgc3RyaW5nTGVuZ3RoID0gZnVuY3Rpb24gKHN0cikge1xuICAgIGxldCBwID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBjID0gc3RyLmNoYXJDb2RlQXQoaSk7XG4gICAgICAgIGlmIChjIDwgMTI4KSB7XG4gICAgICAgICAgICBwKys7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoYyA8IDIwNDgpIHtcbiAgICAgICAgICAgIHAgKz0gMjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjID49IDB4ZDgwMCAmJiBjIDw9IDB4ZGJmZikge1xuICAgICAgICAgICAgLy8gTGVhZCBzdXJyb2dhdGUgb2YgYSBzdXJyb2dhdGUgcGFpci4gIFRoZSBwYWlyIHRvZ2V0aGVyIHdpbGwgdGFrZSA0IGJ5dGVzIHRvIHJlcHJlc2VudC5cbiAgICAgICAgICAgIHAgKz0gNDtcbiAgICAgICAgICAgIGkrKzsgLy8gc2tpcCB0cmFpbCBzdXJyb2dhdGUuXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBwICs9IDM7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHA7XG59O1xuXG4vKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuLyoqXG4gKiBUaGUgYW1vdW50IG9mIG1pbGxpc2Vjb25kcyB0byBleHBvbmVudGlhbGx5IGluY3JlYXNlLlxuICovXG5jb25zdCBERUZBVUxUX0lOVEVSVkFMX01JTExJUyA9IDEwMDA7XG4vKipcbiAqIFRoZSBmYWN0b3IgdG8gYmFja29mZiBieS5cbiAqIFNob3VsZCBiZSBhIG51bWJlciBncmVhdGVyIHRoYW4gMS5cbiAqL1xuY29uc3QgREVGQVVMVF9CQUNLT0ZGX0ZBQ1RPUiA9IDI7XG4vKipcbiAqIFRoZSBtYXhpbXVtIG1pbGxpc2Vjb25kcyB0byBpbmNyZWFzZSB0by5cbiAqXG4gKiA8cD5WaXNpYmxlIGZvciB0ZXN0aW5nXG4gKi9cbmNvbnN0IE1BWF9WQUxVRV9NSUxMSVMgPSA0ICogNjAgKiA2MCAqIDEwMDA7IC8vIEZvdXIgaG91cnMsIGxpa2UgaU9TIGFuZCBBbmRyb2lkLlxuLyoqXG4gKiBUaGUgcGVyY2VudGFnZSBvZiBiYWNrb2ZmIHRpbWUgdG8gcmFuZG9taXplIGJ5LlxuICogU2VlXG4gKiBodHRwOi8vZ28vc2FmZS1jbGllbnQtYmVoYXZpb3Ijc3RlcC0xLWRldGVybWluZS10aGUtYXBwcm9wcmlhdGUtcmV0cnktaW50ZXJ2YWwtdG8taGFuZGxlLXNwaWtlLXRyYWZmaWNcbiAqIGZvciBjb250ZXh0LlxuICpcbiAqIDxwPlZpc2libGUgZm9yIHRlc3RpbmdcbiAqL1xuY29uc3QgUkFORE9NX0ZBQ1RPUiA9IDAuNTtcbi8qKlxuICogQmFzZWQgb24gdGhlIGJhY2tvZmYgbWV0aG9kIGZyb21cbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9nb29nbGUvY2xvc3VyZS1saWJyYXJ5L2Jsb2IvbWFzdGVyL2Nsb3N1cmUvZ29vZy9tYXRoL2V4cG9uZW50aWFsYmFja29mZi5qcy5cbiAqIEV4dHJhY3RlZCBoZXJlIHNvIHdlIGRvbid0IG5lZWQgdG8gcGFzcyBtZXRhZGF0YSBhbmQgYSBzdGF0ZWZ1bCBFeHBvbmVudGlhbEJhY2tvZmYgb2JqZWN0IGFyb3VuZC5cbiAqL1xuZnVuY3Rpb24gY2FsY3VsYXRlQmFja29mZk1pbGxpcyhiYWNrb2ZmQ291bnQsIGludGVydmFsTWlsbGlzID0gREVGQVVMVF9JTlRFUlZBTF9NSUxMSVMsIGJhY2tvZmZGYWN0b3IgPSBERUZBVUxUX0JBQ0tPRkZfRkFDVE9SKSB7XG4gICAgLy8gQ2FsY3VsYXRlcyBhbiBleHBvbmVudGlhbGx5IGluY3JlYXNpbmcgdmFsdWUuXG4gICAgLy8gRGV2aWF0aW9uOiBjYWxjdWxhdGVzIHZhbHVlIGZyb20gY291bnQgYW5kIGEgY29uc3RhbnQgaW50ZXJ2YWwsIHNvIHdlIG9ubHkgbmVlZCB0byBzYXZlIHZhbHVlXG4gICAgLy8gYW5kIGNvdW50IHRvIHJlc3RvcmUgc3RhdGUuXG4gICAgY29uc3QgY3VyckJhc2VWYWx1ZSA9IGludGVydmFsTWlsbGlzICogTWF0aC5wb3coYmFja29mZkZhY3RvciwgYmFja29mZkNvdW50KTtcbiAgICAvLyBBIHJhbmRvbSBcImZ1enpcIiB0byBhdm9pZCB3YXZlcyBvZiByZXRyaWVzLlxuICAgIC8vIERldmlhdGlvbjogcmFuZG9tRmFjdG9yIGlzIHJlcXVpcmVkLlxuICAgIGNvbnN0IHJhbmRvbVdhaXQgPSBNYXRoLnJvdW5kKFxuICAgIC8vIEEgZnJhY3Rpb24gb2YgdGhlIGJhY2tvZmYgdmFsdWUgdG8gYWRkL3N1YnRyYWN0LlxuICAgIC8vIERldmlhdGlvbjogY2hhbmdlcyBtdWx0aXBsaWNhdGlvbiBvcmRlciB0byBpbXByb3ZlIHJlYWRhYmlsaXR5LlxuICAgIFJBTkRPTV9GQUNUT1IgKlxuICAgICAgICBjdXJyQmFzZVZhbHVlICpcbiAgICAgICAgLy8gQSByYW5kb20gZmxvYXQgKHJvdW5kZWQgdG8gaW50IGJ5IE1hdGgucm91bmQgYWJvdmUpIGluIHRoZSByYW5nZSBbLTEsIDFdLiBEZXRlcm1pbmVzXG4gICAgICAgIC8vIGlmIHdlIGFkZCBvciBzdWJ0cmFjdC5cbiAgICAgICAgKE1hdGgucmFuZG9tKCkgLSAwLjUpICpcbiAgICAgICAgMik7XG4gICAgLy8gTGltaXRzIGJhY2tvZmYgdG8gbWF4IHRvIGF2b2lkIGVmZmVjdGl2ZWx5IHBlcm1hbmVudCBiYWNrb2ZmLlxuICAgIHJldHVybiBNYXRoLm1pbihNQVhfVkFMVUVfTUlMTElTLCBjdXJyQmFzZVZhbHVlICsgcmFuZG9tV2FpdCk7XG59XG5cbi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTENcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG4vKipcbiAqIFByb3ZpZGUgRW5nbGlzaCBvcmRpbmFsIGxldHRlcnMgYWZ0ZXIgYSBudW1iZXJcbiAqL1xuZnVuY3Rpb24gb3JkaW5hbChpKSB7XG4gICAgaWYgKCFOdW1iZXIuaXNGaW5pdGUoaSkpIHtcbiAgICAgICAgcmV0dXJuIGAke2l9YDtcbiAgICB9XG4gICAgcmV0dXJuIGkgKyBpbmRpY2F0b3IoaSk7XG59XG5mdW5jdGlvbiBpbmRpY2F0b3IoaSkge1xuICAgIGkgPSBNYXRoLmFicyhpKTtcbiAgICBjb25zdCBjZW50ID0gaSAlIDEwMDtcbiAgICBpZiAoY2VudCA+PSAxMCAmJiBjZW50IDw9IDIwKSB7XG4gICAgICAgIHJldHVybiAndGgnO1xuICAgIH1cbiAgICBjb25zdCBkZWMgPSBpICUgMTA7XG4gICAgaWYgKGRlYyA9PT0gMSkge1xuICAgICAgICByZXR1cm4gJ3N0JztcbiAgICB9XG4gICAgaWYgKGRlYyA9PT0gMikge1xuICAgICAgICByZXR1cm4gJ25kJztcbiAgICB9XG4gICAgaWYgKGRlYyA9PT0gMykge1xuICAgICAgICByZXR1cm4gJ3JkJztcbiAgICB9XG4gICAgcmV0dXJuICd0aCc7XG59XG5cbi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIxIEdvb2dsZSBMTENcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5mdW5jdGlvbiBnZXRNb2R1bGFySW5zdGFuY2Uoc2VydmljZSkge1xuICAgIGlmIChzZXJ2aWNlICYmIHNlcnZpY2UuX2RlbGVnYXRlKSB7XG4gICAgICAgIHJldHVybiBzZXJ2aWNlLl9kZWxlZ2F0ZTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiBzZXJ2aWNlO1xuICAgIH1cbn1cblxuLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjUgR29vZ2xlIExMQ1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cbi8qKlxuICogQ2hlY2tzIHdoZXRoZXIgaG9zdCBpcyBhIGNsb3VkIHdvcmtzdGF0aW9uIG9yIG5vdC5cbiAqIEBwdWJsaWNcbiAqL1xuZnVuY3Rpb24gaXNDbG91ZFdvcmtzdGF0aW9uKHVybCkge1xuICAgIC8vIGBpc0Nsb3VkV29ya3N0YXRpb25gIGlzIGNhbGxlZCB3aXRob3V0IHByb3RvY29sIGluIGNlcnRhaW4gY29ubmVjdCpFbXVsYXRvciBmdW5jdGlvbnNcbiAgICAvLyBJbiBIVFRQIHJlcXVlc3QgYnVpbGRlcnMsIGl0J3MgY2FsbGVkIHdpdGggdGhlIHByb3RvY29sLlxuICAgIC8vIElmIGNhbGxlZCB3aXRoIHByb3RvY29sIHByZWZpeCwgaXQncyBhIHZhbGlkIFVSTCwgc28gd2UgZXh0cmFjdCB0aGUgaG9zdG5hbWVcbiAgICAvLyBJZiBjYWxsZWQgd2l0aG91dCwgd2UgYXNzdW1lIHRoZSBzdHJpbmcgaXMgdGhlIGhvc3RuYW1lLlxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGhvc3QgPSB1cmwuc3RhcnRzV2l0aCgnaHR0cDovLycpIHx8IHVybC5zdGFydHNXaXRoKCdodHRwczovLycpXG4gICAgICAgICAgICA/IG5ldyBVUkwodXJsKS5ob3N0bmFtZVxuICAgICAgICAgICAgOiB1cmw7XG4gICAgICAgIHJldHVybiBob3N0LmVuZHNXaXRoKCcuY2xvdWR3b3Jrc3RhdGlvbnMuZGV2Jyk7XG4gICAgfVxuICAgIGNhdGNoIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cbi8qKlxuICogTWFrZXMgYSBmZXRjaCByZXF1ZXN0IHRvIHRoZSBnaXZlbiBzZXJ2ZXIuXG4gKiBNb3N0bHkgdXNlZCBmb3IgZm9yd2FyZGluZyBjb29raWVzIGluIEZpcmViYXNlIFN0dWRpby5cbiAqIEBwdWJsaWNcbiAqL1xuYXN5bmMgZnVuY3Rpb24gcGluZ1NlcnZlcihlbmRwb2ludCkge1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGZldGNoKGVuZHBvaW50LCB7XG4gICAgICAgIGNyZWRlbnRpYWxzOiAnaW5jbHVkZSdcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0Lm9rO1xufVxuXG4vKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyNSBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuLyoqXG4gKiBAcHVibGljXG4gKiBHZW5lcmF0ZXMgYSBTSEEtMjU2IGhhc2ggZm9yIHRoZSBnaXZlbiBpbnB1dCBzdHJpbmcuXG4gKlxuICogQHBhcmFtIGlucHV0IFRoZSBzdHJpbmcgdG8gaGFzaC5cbiAqIEByZXR1cm5zIEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIHRoZSBTSEEtMjU2IGhhc2ggYXMgYSBoZXggc3RyaW5nLlxuICovXG5hc3luYyBmdW5jdGlvbiBnZW5lcmF0ZVNIQTI1Nkhhc2goaW5wdXQpIHtcbiAgICBjb25zdCB0ZXh0RW5jb2RlciA9IG5ldyBUZXh0RW5jb2RlcigpO1xuICAgIGNvbnN0IGRhdGEgPSB0ZXh0RW5jb2Rlci5lbmNvZGUoaW5wdXQpO1xuICAgIGNvbnN0IGhhc2hCdWZmZXIgPSBhd2FpdCBjcnlwdG8uc3VidGxlLmRpZ2VzdCgnU0hBLTI1NicsIGRhdGEpO1xuICAgIC8vIENvbnZlcnQgQXJyYXlCdWZmZXIgdG8gaGV4IHN0cmluZ1xuICAgIGNvbnN0IGhhc2hBcnJheSA9IEFycmF5LmZyb20obmV3IFVpbnQ4QXJyYXkoaGFzaEJ1ZmZlcikpO1xuICAgIGNvbnN0IGhleEhhc2ggPSBoYXNoQXJyYXkubWFwKGIgPT4gYi50b1N0cmluZygxNikucGFkU3RhcnQoMiwgJzAnKSkuam9pbignJyk7XG4gICAgcmV0dXJuIGhleEhhc2g7XG59XG5cbmV4cG9ydCB7IENPTlNUQU5UUywgRGVjb2RlQmFzZTY0U3RyaW5nRXJyb3IsIERlZmVycmVkLCBFcnJvckZhY3RvcnksIEZpcmViYXNlRXJyb3IsIE1BWF9WQUxVRV9NSUxMSVMsIFJBTkRPTV9GQUNUT1IsIFNoYTEsIGFyZUNvb2tpZXNFbmFibGVkLCBhc3NlcnQsIGFzc2VydGlvbkVycm9yLCBhc3luYywgYmFzZTY0LCBiYXNlNjREZWNvZGUsIGJhc2U2NEVuY29kZSwgYmFzZTY0dXJsRW5jb2RlV2l0aG91dFBhZGRpbmcsIGNhbGN1bGF0ZUJhY2tvZmZNaWxsaXMsIGNvbnRhaW5zLCBjcmVhdGVNb2NrVXNlclRva2VuLCBjcmVhdGVTdWJzY3JpYmUsIGRlY29kZSwgZGVlcENvcHksIGRlZXBFcXVhbCwgZGVlcEV4dGVuZCwgZXJyb3JQcmVmaXgsIGV4dHJhY3RRdWVyeXN0cmluZywgZ2VuZXJhdGVTSEEyNTZIYXNoLCBnZXREZWZhdWx0QXBwQ29uZmlnLCBnZXREZWZhdWx0RW11bGF0b3JIb3N0LCBnZXREZWZhdWx0RW11bGF0b3JIb3N0bmFtZUFuZFBvcnQsIGdldERlZmF1bHRzLCBnZXRFeHBlcmltZW50YWxTZXR0aW5nLCBnZXRHbG9iYWwsIGdldE1vZHVsYXJJbnN0YW5jZSwgZ2V0VUEsIGlzQWRtaW4sIGlzQnJvd3NlciwgaXNCcm93c2VyRXh0ZW5zaW9uLCBpc0Nsb3VkV29ya3N0YXRpb24sIGlzQ2xvdWRmbGFyZVdvcmtlciwgaXNFbGVjdHJvbiwgaXNFbXB0eSwgaXNJRSwgaXNJbmRleGVkREJBdmFpbGFibGUsIGlzTW9iaWxlQ29yZG92YSwgaXNOb2RlLCBpc05vZGVTZGssIGlzUmVhY3ROYXRpdmUsIGlzU2FmYXJpLCBpc1NhZmFyaU9yV2Via2l0LCBpc1VXUCwgaXNWYWxpZEZvcm1hdCwgaXNWYWxpZFRpbWVzdGFtcCwgaXNXZWJXb3JrZXIsIGlzc3VlZEF0VGltZSwganNvbkV2YWwsIG1hcCwgb3JkaW5hbCwgcGluZ1NlcnZlciwgcHJvbWlzZVdpdGhUaW1lb3V0LCBxdWVyeXN0cmluZywgcXVlcnlzdHJpbmdEZWNvZGUsIHNhZmVHZXQsIHN0cmluZ0xlbmd0aCwgc3RyaW5nVG9CeXRlQXJyYXksIHN0cmluZ2lmeSwgdmFsaWRhdGVBcmdDb3VudCwgdmFsaWRhdGVDYWxsYmFjaywgdmFsaWRhdGVDb250ZXh0T2JqZWN0LCB2YWxpZGF0ZUluZGV4ZWREQk9wZW5hYmxlLCB2YWxpZGF0ZU5hbWVzcGFjZSB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguZXNtLmpzLm1hcFxuIiwiaW1wb3J0IHsgRGVmZXJyZWQgfSBmcm9tICdAZmlyZWJhc2UvdXRpbCc7XG5cbi8qKlxuICogQ29tcG9uZW50IGZvciBzZXJ2aWNlIG5hbWUgVCwgZS5nLiBgYXV0aGAsIGBhdXRoLWludGVybmFsYFxuICovXG5jbGFzcyBDb21wb25lbnQge1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIG5hbWUgVGhlIHB1YmxpYyBzZXJ2aWNlIG5hbWUsIGUuZy4gYXBwLCBhdXRoLCBmaXJlc3RvcmUsIGRhdGFiYXNlXG4gICAgICogQHBhcmFtIGluc3RhbmNlRmFjdG9yeSBTZXJ2aWNlIGZhY3RvcnkgcmVzcG9uc2libGUgZm9yIGNyZWF0aW5nIHRoZSBwdWJsaWMgaW50ZXJmYWNlXG4gICAgICogQHBhcmFtIHR5cGUgd2hldGhlciB0aGUgc2VydmljZSBwcm92aWRlZCBieSB0aGUgY29tcG9uZW50IGlzIHB1YmxpYyBvciBwcml2YXRlXG4gICAgICovXG4gICAgY29uc3RydWN0b3IobmFtZSwgaW5zdGFuY2VGYWN0b3J5LCB0eXBlKSB7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuaW5zdGFuY2VGYWN0b3J5ID0gaW5zdGFuY2VGYWN0b3J5O1xuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgICAgICB0aGlzLm11bHRpcGxlSW5zdGFuY2VzID0gZmFsc2U7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBQcm9wZXJ0aWVzIHRvIGJlIGFkZGVkIHRvIHRoZSBzZXJ2aWNlIG5hbWVzcGFjZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5zZXJ2aWNlUHJvcHMgPSB7fTtcbiAgICAgICAgdGhpcy5pbnN0YW50aWF0aW9uTW9kZSA9IFwiTEFaWVwiIC8qIEluc3RhbnRpYXRpb25Nb2RlLkxBWlkgKi87XG4gICAgICAgIHRoaXMub25JbnN0YW5jZUNyZWF0ZWQgPSBudWxsO1xuICAgIH1cbiAgICBzZXRJbnN0YW50aWF0aW9uTW9kZShtb2RlKSB7XG4gICAgICAgIHRoaXMuaW5zdGFudGlhdGlvbk1vZGUgPSBtb2RlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgc2V0TXVsdGlwbGVJbnN0YW5jZXMobXVsdGlwbGVJbnN0YW5jZXMpIHtcbiAgICAgICAgdGhpcy5tdWx0aXBsZUluc3RhbmNlcyA9IG11bHRpcGxlSW5zdGFuY2VzO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgc2V0U2VydmljZVByb3BzKHByb3BzKSB7XG4gICAgICAgIHRoaXMuc2VydmljZVByb3BzID0gcHJvcHM7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBzZXRJbnN0YW5jZUNyZWF0ZWRDYWxsYmFjayhjYWxsYmFjaykge1xuICAgICAgICB0aGlzLm9uSW5zdGFuY2VDcmVhdGVkID0gY2FsbGJhY2s7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn1cblxuLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cbmNvbnN0IERFRkFVTFRfRU5UUllfTkFNRSA9ICdbREVGQVVMVF0nO1xuXG4vKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuLyoqXG4gKiBQcm92aWRlciBmb3IgaW5zdGFuY2UgZm9yIHNlcnZpY2UgbmFtZSBULCBlLmcuICdhdXRoJywgJ2F1dGgtaW50ZXJuYWwnXG4gKiBOYW1lU2VydmljZU1hcHBpbmdbVF0gaXMgYW4gYWxpYXMgZm9yIHRoZSB0eXBlIG9mIHRoZSBpbnN0YW5jZVxuICovXG5jbGFzcyBQcm92aWRlciB7XG4gICAgY29uc3RydWN0b3IobmFtZSwgY29udGFpbmVyKSB7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xuICAgICAgICB0aGlzLmNvbXBvbmVudCA9IG51bGw7XG4gICAgICAgIHRoaXMuaW5zdGFuY2VzID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLmluc3RhbmNlc0RlZmVycmVkID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLmluc3RhbmNlc09wdGlvbnMgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMub25Jbml0Q2FsbGJhY2tzID0gbmV3IE1hcCgpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gaWRlbnRpZmllciBBIHByb3ZpZGVyIGNhbiBwcm92aWRlIG11bHRpcGxlIGluc3RhbmNlcyBvZiBhIHNlcnZpY2VcbiAgICAgKiBpZiB0aGlzLmNvbXBvbmVudC5tdWx0aXBsZUluc3RhbmNlcyBpcyB0cnVlLlxuICAgICAqL1xuICAgIGdldChpZGVudGlmaWVyKSB7XG4gICAgICAgIC8vIGlmIG11bHRpcGxlSW5zdGFuY2VzIGlzIG5vdCBzdXBwb3J0ZWQsIHVzZSB0aGUgZGVmYXVsdCBuYW1lXG4gICAgICAgIGNvbnN0IG5vcm1hbGl6ZWRJZGVudGlmaWVyID0gdGhpcy5ub3JtYWxpemVJbnN0YW5jZUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgICAgIGlmICghdGhpcy5pbnN0YW5jZXNEZWZlcnJlZC5oYXMobm9ybWFsaXplZElkZW50aWZpZXIpKSB7XG4gICAgICAgICAgICBjb25zdCBkZWZlcnJlZCA9IG5ldyBEZWZlcnJlZCgpO1xuICAgICAgICAgICAgdGhpcy5pbnN0YW5jZXNEZWZlcnJlZC5zZXQobm9ybWFsaXplZElkZW50aWZpZXIsIGRlZmVycmVkKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzSW5pdGlhbGl6ZWQobm9ybWFsaXplZElkZW50aWZpZXIpIHx8XG4gICAgICAgICAgICAgICAgdGhpcy5zaG91bGRBdXRvSW5pdGlhbGl6ZSgpKSB7XG4gICAgICAgICAgICAgICAgLy8gaW5pdGlhbGl6ZSB0aGUgc2VydmljZSBpZiBpdCBjYW4gYmUgYXV0by1pbml0aWFsaXplZFxuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5nZXRPckluaXRpYWxpemVTZXJ2aWNlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc3RhbmNlSWRlbnRpZmllcjogbm9ybWFsaXplZElkZW50aWZpZXJcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbnN0YW5jZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShpbnN0YW5jZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gd2hlbiB0aGUgaW5zdGFuY2UgZmFjdG9yeSB0aHJvd3MgYW4gZXhjZXB0aW9uIGR1cmluZyBnZXQoKSwgaXQgc2hvdWxkIG5vdCBjYXVzZVxuICAgICAgICAgICAgICAgICAgICAvLyBhIGZhdGFsIGVycm9yLiBXZSBqdXN0IHJldHVybiB0aGUgdW5yZXNvbHZlZCBwcm9taXNlIGluIHRoaXMgY2FzZS5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2VzRGVmZXJyZWQuZ2V0KG5vcm1hbGl6ZWRJZGVudGlmaWVyKS5wcm9taXNlO1xuICAgIH1cbiAgICBnZXRJbW1lZGlhdGUob3B0aW9ucykge1xuICAgICAgICAvLyBpZiBtdWx0aXBsZUluc3RhbmNlcyBpcyBub3Qgc3VwcG9ydGVkLCB1c2UgdGhlIGRlZmF1bHQgbmFtZVxuICAgICAgICBjb25zdCBub3JtYWxpemVkSWRlbnRpZmllciA9IHRoaXMubm9ybWFsaXplSW5zdGFuY2VJZGVudGlmaWVyKG9wdGlvbnM/LmlkZW50aWZpZXIpO1xuICAgICAgICBjb25zdCBvcHRpb25hbCA9IG9wdGlvbnM/Lm9wdGlvbmFsID8/IGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5pc0luaXRpYWxpemVkKG5vcm1hbGl6ZWRJZGVudGlmaWVyKSB8fFxuICAgICAgICAgICAgdGhpcy5zaG91bGRBdXRvSW5pdGlhbGl6ZSgpKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldE9ySW5pdGlhbGl6ZVNlcnZpY2Uoe1xuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZUlkZW50aWZpZXI6IG5vcm1hbGl6ZWRJZGVudGlmaWVyXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIGlmIChvcHRpb25hbCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gSW4gY2FzZSBhIGNvbXBvbmVudCBpcyBub3QgaW5pdGlhbGl6ZWQgYW5kIHNob3VsZC9jYW5ub3QgYmUgYXV0by1pbml0aWFsaXplZCBhdCB0aGUgbW9tZW50LCByZXR1cm4gbnVsbCBpZiB0aGUgb3B0aW9uYWwgZmxhZyBpcyBzZXQsIG9yIHRocm93XG4gICAgICAgICAgICBpZiAob3B0aW9uYWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IEVycm9yKGBTZXJ2aWNlICR7dGhpcy5uYW1lfSBpcyBub3QgYXZhaWxhYmxlYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZ2V0Q29tcG9uZW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb21wb25lbnQ7XG4gICAgfVxuICAgIHNldENvbXBvbmVudChjb21wb25lbnQpIHtcbiAgICAgICAgaWYgKGNvbXBvbmVudC5uYW1lICE9PSB0aGlzLm5hbWUpIHtcbiAgICAgICAgICAgIHRocm93IEVycm9yKGBNaXNtYXRjaGluZyBDb21wb25lbnQgJHtjb21wb25lbnQubmFtZX0gZm9yIFByb3ZpZGVyICR7dGhpcy5uYW1lfS5gKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jb21wb25lbnQpIHtcbiAgICAgICAgICAgIHRocm93IEVycm9yKGBDb21wb25lbnQgZm9yICR7dGhpcy5uYW1lfSBoYXMgYWxyZWFkeSBiZWVuIHByb3ZpZGVkYCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb21wb25lbnQgPSBjb21wb25lbnQ7XG4gICAgICAgIC8vIHJldHVybiBlYXJseSB3aXRob3V0IGF0dGVtcHRpbmcgdG8gaW5pdGlhbGl6ZSB0aGUgY29tcG9uZW50IGlmIHRoZSBjb21wb25lbnQgcmVxdWlyZXMgZXhwbGljaXQgaW5pdGlhbGl6YXRpb24gKGNhbGxpbmcgYFByb3ZpZGVyLmluaXRpYWxpemUoKWApXG4gICAgICAgIGlmICghdGhpcy5zaG91bGRBdXRvSW5pdGlhbGl6ZSgpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gaWYgdGhlIHNlcnZpY2UgaXMgZWFnZXIsIGluaXRpYWxpemUgdGhlIGRlZmF1bHQgaW5zdGFuY2VcbiAgICAgICAgaWYgKGlzQ29tcG9uZW50RWFnZXIoY29tcG9uZW50KSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB0aGlzLmdldE9ySW5pdGlhbGl6ZVNlcnZpY2UoeyBpbnN0YW5jZUlkZW50aWZpZXI6IERFRkFVTFRfRU5UUllfTkFNRSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgLy8gd2hlbiB0aGUgaW5zdGFuY2UgZmFjdG9yeSBmb3IgYW4gZWFnZXIgQ29tcG9uZW50IHRocm93cyBhbiBleGNlcHRpb24gZHVyaW5nIHRoZSBlYWdlclxuICAgICAgICAgICAgICAgIC8vIGluaXRpYWxpemF0aW9uLCBpdCBzaG91bGQgbm90IGNhdXNlIGEgZmF0YWwgZXJyb3IuXG4gICAgICAgICAgICAgICAgLy8gVE9ETzogSW52ZXN0aWdhdGUgaWYgd2UgbmVlZCB0byBtYWtlIGl0IGNvbmZpZ3VyYWJsZSwgYmVjYXVzZSBzb21lIGNvbXBvbmVudCBtYXkgd2FudCB0byBjYXVzZVxuICAgICAgICAgICAgICAgIC8vIGEgZmF0YWwgZXJyb3IgaW4gdGhpcyBjYXNlP1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIENyZWF0ZSBzZXJ2aWNlIGluc3RhbmNlcyBmb3IgdGhlIHBlbmRpbmcgcHJvbWlzZXMgYW5kIHJlc29sdmUgdGhlbVxuICAgICAgICAvLyBOT1RFOiBpZiB0aGlzLm11bHRpcGxlSW5zdGFuY2VzIGlzIGZhbHNlLCBvbmx5IHRoZSBkZWZhdWx0IGluc3RhbmNlIHdpbGwgYmUgY3JlYXRlZFxuICAgICAgICAvLyBhbmQgYWxsIHByb21pc2VzIHdpdGggcmVzb2x2ZSB3aXRoIGl0IHJlZ2FyZGxlc3Mgb2YgdGhlIGlkZW50aWZpZXIuXG4gICAgICAgIGZvciAoY29uc3QgW2luc3RhbmNlSWRlbnRpZmllciwgaW5zdGFuY2VEZWZlcnJlZF0gb2YgdGhpcy5pbnN0YW5jZXNEZWZlcnJlZC5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgIGNvbnN0IG5vcm1hbGl6ZWRJZGVudGlmaWVyID0gdGhpcy5ub3JtYWxpemVJbnN0YW5jZUlkZW50aWZpZXIoaW5zdGFuY2VJZGVudGlmaWVyKTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgLy8gYGdldE9ySW5pdGlhbGl6ZVNlcnZpY2UoKWAgc2hvdWxkIGFsd2F5cyByZXR1cm4gYSB2YWxpZCBpbnN0YW5jZSBzaW5jZSBhIGNvbXBvbmVudCBpcyBndWFyYW50ZWVkLiB1c2UgISB0byBtYWtlIHR5cGVzY3JpcHQgaGFwcHkuXG4gICAgICAgICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmdldE9ySW5pdGlhbGl6ZVNlcnZpY2Uoe1xuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZUlkZW50aWZpZXI6IG5vcm1hbGl6ZWRJZGVudGlmaWVyXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaW5zdGFuY2VEZWZlcnJlZC5yZXNvbHZlKGluc3RhbmNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgLy8gd2hlbiB0aGUgaW5zdGFuY2UgZmFjdG9yeSB0aHJvd3MgYW4gZXhjZXB0aW9uLCBpdCBzaG91bGQgbm90IGNhdXNlXG4gICAgICAgICAgICAgICAgLy8gYSBmYXRhbCBlcnJvci4gV2UganVzdCBsZWF2ZSB0aGUgcHJvbWlzZSB1bnJlc29sdmVkLlxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGNsZWFySW5zdGFuY2UoaWRlbnRpZmllciA9IERFRkFVTFRfRU5UUllfTkFNRSkge1xuICAgICAgICB0aGlzLmluc3RhbmNlc0RlZmVycmVkLmRlbGV0ZShpZGVudGlmaWVyKTtcbiAgICAgICAgdGhpcy5pbnN0YW5jZXNPcHRpb25zLmRlbGV0ZShpZGVudGlmaWVyKTtcbiAgICAgICAgdGhpcy5pbnN0YW5jZXMuZGVsZXRlKGlkZW50aWZpZXIpO1xuICAgIH1cbiAgICAvLyBhcHAuZGVsZXRlKCkgd2lsbCBjYWxsIHRoaXMgbWV0aG9kIG9uIGV2ZXJ5IHByb3ZpZGVyIHRvIGRlbGV0ZSB0aGUgc2VydmljZXNcbiAgICAvLyBUT0RPOiBzaG91bGQgd2UgbWFyayB0aGUgcHJvdmlkZXIgYXMgZGVsZXRlZD9cbiAgICBhc3luYyBkZWxldGUoKSB7XG4gICAgICAgIGNvbnN0IHNlcnZpY2VzID0gQXJyYXkuZnJvbSh0aGlzLmluc3RhbmNlcy52YWx1ZXMoKSk7XG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgICAgIC4uLnNlcnZpY2VzXG4gICAgICAgICAgICAgICAgLmZpbHRlcihzZXJ2aWNlID0+ICdJTlRFUk5BTCcgaW4gc2VydmljZSkgLy8gbGVnYWN5IHNlcnZpY2VzXG4gICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICAgICAgICAgICAgICAubWFwKHNlcnZpY2UgPT4gc2VydmljZS5JTlRFUk5BTC5kZWxldGUoKSksXG4gICAgICAgICAgICAuLi5zZXJ2aWNlc1xuICAgICAgICAgICAgICAgIC5maWx0ZXIoc2VydmljZSA9PiAnX2RlbGV0ZScgaW4gc2VydmljZSkgLy8gbW9kdWxhcml6ZWQgc2VydmljZXNcbiAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgICAgICAgICAgICAgIC5tYXAoc2VydmljZSA9PiBzZXJ2aWNlLl9kZWxldGUoKSlcbiAgICAgICAgXSk7XG4gICAgfVxuICAgIGlzQ29tcG9uZW50U2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb21wb25lbnQgIT0gbnVsbDtcbiAgICB9XG4gICAgaXNJbml0aWFsaXplZChpZGVudGlmaWVyID0gREVGQVVMVF9FTlRSWV9OQU1FKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlcy5oYXMoaWRlbnRpZmllcik7XG4gICAgfVxuICAgIGdldE9wdGlvbnMoaWRlbnRpZmllciA9IERFRkFVTFRfRU5UUllfTkFNRSkge1xuICAgICAgICByZXR1cm4gdGhpcy5pbnN0YW5jZXNPcHRpb25zLmdldChpZGVudGlmaWVyKSB8fCB7fTtcbiAgICB9XG4gICAgaW5pdGlhbGl6ZShvcHRzID0ge30pIHtcbiAgICAgICAgY29uc3QgeyBvcHRpb25zID0ge30gfSA9IG9wdHM7XG4gICAgICAgIGNvbnN0IG5vcm1hbGl6ZWRJZGVudGlmaWVyID0gdGhpcy5ub3JtYWxpemVJbnN0YW5jZUlkZW50aWZpZXIob3B0cy5pbnN0YW5jZUlkZW50aWZpZXIpO1xuICAgICAgICBpZiAodGhpcy5pc0luaXRpYWxpemVkKG5vcm1hbGl6ZWRJZGVudGlmaWVyKSkge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoYCR7dGhpcy5uYW1lfSgke25vcm1hbGl6ZWRJZGVudGlmaWVyfSkgaGFzIGFscmVhZHkgYmVlbiBpbml0aWFsaXplZGApO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5pc0NvbXBvbmVudFNldCgpKSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcihgQ29tcG9uZW50ICR7dGhpcy5uYW1lfSBoYXMgbm90IGJlZW4gcmVnaXN0ZXJlZCB5ZXRgKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuZ2V0T3JJbml0aWFsaXplU2VydmljZSh7XG4gICAgICAgICAgICBpbnN0YW5jZUlkZW50aWZpZXI6IG5vcm1hbGl6ZWRJZGVudGlmaWVyLFxuICAgICAgICAgICAgb3B0aW9uc1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gcmVzb2x2ZSBhbnkgcGVuZGluZyBwcm9taXNlIHdhaXRpbmcgZm9yIHRoZSBzZXJ2aWNlIGluc3RhbmNlXG4gICAgICAgIGZvciAoY29uc3QgW2luc3RhbmNlSWRlbnRpZmllciwgaW5zdGFuY2VEZWZlcnJlZF0gb2YgdGhpcy5pbnN0YW5jZXNEZWZlcnJlZC5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgIGNvbnN0IG5vcm1hbGl6ZWREZWZlcnJlZElkZW50aWZpZXIgPSB0aGlzLm5vcm1hbGl6ZUluc3RhbmNlSWRlbnRpZmllcihpbnN0YW5jZUlkZW50aWZpZXIpO1xuICAgICAgICAgICAgaWYgKG5vcm1hbGl6ZWRJZGVudGlmaWVyID09PSBub3JtYWxpemVkRGVmZXJyZWRJZGVudGlmaWVyKSB7XG4gICAgICAgICAgICAgICAgaW5zdGFuY2VEZWZlcnJlZC5yZXNvbHZlKGluc3RhbmNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgfVxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIC0gYSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgaW52b2tlZCAgYWZ0ZXIgdGhlIHByb3ZpZGVyIGhhcyBiZWVuIGluaXRpYWxpemVkIGJ5IGNhbGxpbmcgcHJvdmlkZXIuaW5pdGlhbGl6ZSgpLlxuICAgICAqIFRoZSBmdW5jdGlvbiBpcyBpbnZva2VkIFNZTkNIUk9OT1VTTFksIHNvIGl0IHNob3VsZCBub3QgZXhlY3V0ZSBhbnkgbG9uZ3J1bm5pbmcgdGFza3MgaW4gb3JkZXIgdG8gbm90IGJsb2NrIHRoZSBwcm9ncmFtLlxuICAgICAqXG4gICAgICogQHBhcmFtIGlkZW50aWZpZXIgQW4gb3B0aW9uYWwgaW5zdGFuY2UgaWRlbnRpZmllclxuICAgICAqIEByZXR1cm5zIGEgZnVuY3Rpb24gdG8gdW5yZWdpc3RlciB0aGUgY2FsbGJhY2tcbiAgICAgKi9cbiAgICBvbkluaXQoY2FsbGJhY2ssIGlkZW50aWZpZXIpIHtcbiAgICAgICAgY29uc3Qgbm9ybWFsaXplZElkZW50aWZpZXIgPSB0aGlzLm5vcm1hbGl6ZUluc3RhbmNlSWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICAgICAgY29uc3QgZXhpc3RpbmdDYWxsYmFja3MgPSB0aGlzLm9uSW5pdENhbGxiYWNrcy5nZXQobm9ybWFsaXplZElkZW50aWZpZXIpID8/XG4gICAgICAgICAgICBuZXcgU2V0KCk7XG4gICAgICAgIGV4aXN0aW5nQ2FsbGJhY2tzLmFkZChjYWxsYmFjayk7XG4gICAgICAgIHRoaXMub25Jbml0Q2FsbGJhY2tzLnNldChub3JtYWxpemVkSWRlbnRpZmllciwgZXhpc3RpbmdDYWxsYmFja3MpO1xuICAgICAgICBjb25zdCBleGlzdGluZ0luc3RhbmNlID0gdGhpcy5pbnN0YW5jZXMuZ2V0KG5vcm1hbGl6ZWRJZGVudGlmaWVyKTtcbiAgICAgICAgaWYgKGV4aXN0aW5nSW5zdGFuY2UpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGV4aXN0aW5nSW5zdGFuY2UsIG5vcm1hbGl6ZWRJZGVudGlmaWVyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgZXhpc3RpbmdDYWxsYmFja3MuZGVsZXRlKGNhbGxiYWNrKTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSW52b2tlIG9uSW5pdCBjYWxsYmFja3Mgc3luY2hyb25vdXNseVxuICAgICAqIEBwYXJhbSBpbnN0YW5jZSB0aGUgc2VydmljZSBpbnN0YW5jZWBcbiAgICAgKi9cbiAgICBpbnZva2VPbkluaXRDYWxsYmFja3MoaW5zdGFuY2UsIGlkZW50aWZpZXIpIHtcbiAgICAgICAgY29uc3QgY2FsbGJhY2tzID0gdGhpcy5vbkluaXRDYWxsYmFja3MuZ2V0KGlkZW50aWZpZXIpO1xuICAgICAgICBpZiAoIWNhbGxiYWNrcykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgY2FsbGJhY2sgb2YgY2FsbGJhY2tzKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGluc3RhbmNlLCBpZGVudGlmaWVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIHtcbiAgICAgICAgICAgICAgICAvLyBpZ25vcmUgZXJyb3JzIGluIHRoZSBvbkluaXQgY2FsbGJhY2tcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBnZXRPckluaXRpYWxpemVTZXJ2aWNlKHsgaW5zdGFuY2VJZGVudGlmaWVyLCBvcHRpb25zID0ge30gfSkge1xuICAgICAgICBsZXQgaW5zdGFuY2UgPSB0aGlzLmluc3RhbmNlcy5nZXQoaW5zdGFuY2VJZGVudGlmaWVyKTtcbiAgICAgICAgaWYgKCFpbnN0YW5jZSAmJiB0aGlzLmNvbXBvbmVudCkge1xuICAgICAgICAgICAgaW5zdGFuY2UgPSB0aGlzLmNvbXBvbmVudC5pbnN0YW5jZUZhY3RvcnkodGhpcy5jb250YWluZXIsIHtcbiAgICAgICAgICAgICAgICBpbnN0YW5jZUlkZW50aWZpZXI6IG5vcm1hbGl6ZUlkZW50aWZpZXJGb3JGYWN0b3J5KGluc3RhbmNlSWRlbnRpZmllciksXG4gICAgICAgICAgICAgICAgb3B0aW9uc1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmluc3RhbmNlcy5zZXQoaW5zdGFuY2VJZGVudGlmaWVyLCBpbnN0YW5jZSk7XG4gICAgICAgICAgICB0aGlzLmluc3RhbmNlc09wdGlvbnMuc2V0KGluc3RhbmNlSWRlbnRpZmllciwgb3B0aW9ucyk7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEludm9rZSBvbkluaXQgbGlzdGVuZXJzLlxuICAgICAgICAgICAgICogTm90ZSB0aGlzLmNvbXBvbmVudC5vbkluc3RhbmNlQ3JlYXRlZCBpcyBkaWZmZXJlbnQsIHdoaWNoIGlzIHVzZWQgYnkgdGhlIGNvbXBvbmVudCBjcmVhdG9yLFxuICAgICAgICAgICAgICogd2hpbGUgb25Jbml0IGxpc3RlbmVycyBhcmUgcmVnaXN0ZXJlZCBieSBjb25zdW1lcnMgb2YgdGhlIHByb3ZpZGVyLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0aGlzLmludm9rZU9uSW5pdENhbGxiYWNrcyhpbnN0YW5jZSwgaW5zdGFuY2VJZGVudGlmaWVyKTtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogT3JkZXIgaXMgaW1wb3J0YW50XG4gICAgICAgICAgICAgKiBvbkluc3RhbmNlQ3JlYXRlZCgpIHNob3VsZCBiZSBjYWxsZWQgYWZ0ZXIgdGhpcy5pbnN0YW5jZXMuc2V0KGluc3RhbmNlSWRlbnRpZmllciwgaW5zdGFuY2UpOyB3aGljaFxuICAgICAgICAgICAgICogbWFrZXMgYGlzSW5pdGlhbGl6ZWQoKWAgcmV0dXJuIHRydWUuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmICh0aGlzLmNvbXBvbmVudC5vbkluc3RhbmNlQ3JlYXRlZCkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50Lm9uSW5zdGFuY2VDcmVhdGVkKHRoaXMuY29udGFpbmVyLCBpbnN0YW5jZUlkZW50aWZpZXIsIGluc3RhbmNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2gge1xuICAgICAgICAgICAgICAgICAgICAvLyBpZ25vcmUgZXJyb3JzIGluIHRoZSBvbkluc3RhbmNlQ3JlYXRlZENhbGxiYWNrXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbnN0YW5jZSB8fCBudWxsO1xuICAgIH1cbiAgICBub3JtYWxpemVJbnN0YW5jZUlkZW50aWZpZXIoaWRlbnRpZmllciA9IERFRkFVTFRfRU5UUllfTkFNRSkge1xuICAgICAgICBpZiAodGhpcy5jb21wb25lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbXBvbmVudC5tdWx0aXBsZUluc3RhbmNlcyA/IGlkZW50aWZpZXIgOiBERUZBVUxUX0VOVFJZX05BTUU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gaWRlbnRpZmllcjsgLy8gYXNzdW1lIG11bHRpcGxlIGluc3RhbmNlcyBhcmUgc3VwcG9ydGVkIGJlZm9yZSB0aGUgY29tcG9uZW50IGlzIHByb3ZpZGVkLlxuICAgICAgICB9XG4gICAgfVxuICAgIHNob3VsZEF1dG9Jbml0aWFsaXplKCkge1xuICAgICAgICByZXR1cm4gKCEhdGhpcy5jb21wb25lbnQgJiZcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50Lmluc3RhbnRpYXRpb25Nb2RlICE9PSBcIkVYUExJQ0lUXCIgLyogSW5zdGFudGlhdGlvbk1vZGUuRVhQTElDSVQgKi8pO1xuICAgIH1cbn1cbi8vIHVuZGVmaW5lZCBzaG91bGQgYmUgcGFzc2VkIHRvIHRoZSBzZXJ2aWNlIGZhY3RvcnkgZm9yIHRoZSBkZWZhdWx0IGluc3RhbmNlXG5mdW5jdGlvbiBub3JtYWxpemVJZGVudGlmaWVyRm9yRmFjdG9yeShpZGVudGlmaWVyKSB7XG4gICAgcmV0dXJuIGlkZW50aWZpZXIgPT09IERFRkFVTFRfRU5UUllfTkFNRSA/IHVuZGVmaW5lZCA6IGlkZW50aWZpZXI7XG59XG5mdW5jdGlvbiBpc0NvbXBvbmVudEVhZ2VyKGNvbXBvbmVudCkge1xuICAgIHJldHVybiBjb21wb25lbnQuaW5zdGFudGlhdGlvbk1vZGUgPT09IFwiRUFHRVJcIiAvKiBJbnN0YW50aWF0aW9uTW9kZS5FQUdFUiAqLztcbn1cblxuLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cbi8qKlxuICogQ29tcG9uZW50Q29udGFpbmVyIHRoYXQgcHJvdmlkZXMgUHJvdmlkZXJzIGZvciBzZXJ2aWNlIG5hbWUgVCwgZS5nLiBgYXV0aGAsIGBhdXRoLWludGVybmFsYFxuICovXG5jbGFzcyBDb21wb25lbnRDb250YWluZXIge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUpIHtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5wcm92aWRlcnMgPSBuZXcgTWFwKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIGNvbXBvbmVudCBDb21wb25lbnQgYmVpbmcgYWRkZWRcbiAgICAgKiBAcGFyYW0gb3ZlcndyaXRlIFdoZW4gYSBjb21wb25lbnQgd2l0aCB0aGUgc2FtZSBuYW1lIGhhcyBhbHJlYWR5IGJlZW4gcmVnaXN0ZXJlZCxcbiAgICAgKiBpZiBvdmVyd3JpdGUgaXMgdHJ1ZTogb3ZlcndyaXRlIHRoZSBleGlzdGluZyBjb21wb25lbnQgd2l0aCB0aGUgbmV3IGNvbXBvbmVudCBhbmQgY3JlYXRlIGEgbmV3XG4gICAgICogcHJvdmlkZXIgd2l0aCB0aGUgbmV3IGNvbXBvbmVudC4gSXQgY2FuIGJlIHVzZWZ1bCBpbiB0ZXN0cyB3aGVyZSB5b3Ugd2FudCB0byB1c2UgZGlmZmVyZW50IG1vY2tzXG4gICAgICogZm9yIGRpZmZlcmVudCB0ZXN0cy5cbiAgICAgKiBpZiBvdmVyd3JpdGUgaXMgZmFsc2U6IHRocm93IGFuIGV4Y2VwdGlvblxuICAgICAqL1xuICAgIGFkZENvbXBvbmVudChjb21wb25lbnQpIHtcbiAgICAgICAgY29uc3QgcHJvdmlkZXIgPSB0aGlzLmdldFByb3ZpZGVyKGNvbXBvbmVudC5uYW1lKTtcbiAgICAgICAgaWYgKHByb3ZpZGVyLmlzQ29tcG9uZW50U2V0KCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ29tcG9uZW50ICR7Y29tcG9uZW50Lm5hbWV9IGhhcyBhbHJlYWR5IGJlZW4gcmVnaXN0ZXJlZCB3aXRoICR7dGhpcy5uYW1lfWApO1xuICAgICAgICB9XG4gICAgICAgIHByb3ZpZGVyLnNldENvbXBvbmVudChjb21wb25lbnQpO1xuICAgIH1cbiAgICBhZGRPck92ZXJ3cml0ZUNvbXBvbmVudChjb21wb25lbnQpIHtcbiAgICAgICAgY29uc3QgcHJvdmlkZXIgPSB0aGlzLmdldFByb3ZpZGVyKGNvbXBvbmVudC5uYW1lKTtcbiAgICAgICAgaWYgKHByb3ZpZGVyLmlzQ29tcG9uZW50U2V0KCkpIHtcbiAgICAgICAgICAgIC8vIGRlbGV0ZSB0aGUgZXhpc3RpbmcgcHJvdmlkZXIgZnJvbSB0aGUgY29udGFpbmVyLCBzbyB3ZSBjYW4gcmVnaXN0ZXIgdGhlIG5ldyBjb21wb25lbnRcbiAgICAgICAgICAgIHRoaXMucHJvdmlkZXJzLmRlbGV0ZShjb21wb25lbnQubmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hZGRDb21wb25lbnQoY29tcG9uZW50KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogZ2V0UHJvdmlkZXIgcHJvdmlkZXMgYSB0eXBlIHNhZmUgaW50ZXJmYWNlIHdoZXJlIGl0IGNhbiBvbmx5IGJlIGNhbGxlZCB3aXRoIGEgZmllbGQgbmFtZVxuICAgICAqIHByZXNlbnQgaW4gTmFtZVNlcnZpY2VNYXBwaW5nIGludGVyZmFjZS5cbiAgICAgKlxuICAgICAqIEZpcmViYXNlIFNES3MgcHJvdmlkaW5nIHNlcnZpY2VzIHNob3VsZCBleHRlbmQgTmFtZVNlcnZpY2VNYXBwaW5nIGludGVyZmFjZSB0byByZWdpc3RlclxuICAgICAqIHRoZW1zZWx2ZXMuXG4gICAgICovXG4gICAgZ2V0UHJvdmlkZXIobmFtZSkge1xuICAgICAgICBpZiAodGhpcy5wcm92aWRlcnMuaGFzKG5hbWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm92aWRlcnMuZ2V0KG5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGNyZWF0ZSBhIFByb3ZpZGVyIGZvciBhIHNlcnZpY2UgdGhhdCBoYXNuJ3QgcmVnaXN0ZXJlZCB3aXRoIEZpcmViYXNlXG4gICAgICAgIGNvbnN0IHByb3ZpZGVyID0gbmV3IFByb3ZpZGVyKG5hbWUsIHRoaXMpO1xuICAgICAgICB0aGlzLnByb3ZpZGVycy5zZXQobmFtZSwgcHJvdmlkZXIpO1xuICAgICAgICByZXR1cm4gcHJvdmlkZXI7XG4gICAgfVxuICAgIGdldFByb3ZpZGVycygpIHtcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5wcm92aWRlcnMudmFsdWVzKCkpO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgQ29tcG9uZW50LCBDb21wb25lbnRDb250YWluZXIsIFByb3ZpZGVyIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5lc20uanMubWFwXG4iLCIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuLyoqXG4gKiBBIGNvbnRhaW5lciBmb3IgYWxsIG9mIHRoZSBMb2dnZXIgaW5zdGFuY2VzXG4gKi9cbmNvbnN0IGluc3RhbmNlcyA9IFtdO1xuLyoqXG4gKiBUaGUgSlMgU0RLIHN1cHBvcnRzIDUgbG9nIGxldmVscyBhbmQgYWxzbyBhbGxvd3MgYSB1c2VyIHRoZSBhYmlsaXR5IHRvXG4gKiBzaWxlbmNlIHRoZSBsb2dzIGFsdG9nZXRoZXIuXG4gKlxuICogVGhlIG9yZGVyIGlzIGEgZm9sbG93czpcbiAqIERFQlVHIDwgVkVSQk9TRSA8IElORk8gPCBXQVJOIDwgRVJST1JcbiAqXG4gKiBBbGwgb2YgdGhlIGxvZyB0eXBlcyBhYm92ZSB0aGUgY3VycmVudCBsb2cgbGV2ZWwgd2lsbCBiZSBjYXB0dXJlZCAoaS5lLiBpZlxuICogeW91IHNldCB0aGUgbG9nIGxldmVsIHRvIGBJTkZPYCwgZXJyb3JzIHdpbGwgc3RpbGwgYmUgbG9nZ2VkLCBidXQgYERFQlVHYCBhbmRcbiAqIGBWRVJCT1NFYCBsb2dzIHdpbGwgbm90KVxuICovXG52YXIgTG9nTGV2ZWw7XG4oZnVuY3Rpb24gKExvZ0xldmVsKSB7XG4gICAgTG9nTGV2ZWxbTG9nTGV2ZWxbXCJERUJVR1wiXSA9IDBdID0gXCJERUJVR1wiO1xuICAgIExvZ0xldmVsW0xvZ0xldmVsW1wiVkVSQk9TRVwiXSA9IDFdID0gXCJWRVJCT1NFXCI7XG4gICAgTG9nTGV2ZWxbTG9nTGV2ZWxbXCJJTkZPXCJdID0gMl0gPSBcIklORk9cIjtcbiAgICBMb2dMZXZlbFtMb2dMZXZlbFtcIldBUk5cIl0gPSAzXSA9IFwiV0FSTlwiO1xuICAgIExvZ0xldmVsW0xvZ0xldmVsW1wiRVJST1JcIl0gPSA0XSA9IFwiRVJST1JcIjtcbiAgICBMb2dMZXZlbFtMb2dMZXZlbFtcIlNJTEVOVFwiXSA9IDVdID0gXCJTSUxFTlRcIjtcbn0pKExvZ0xldmVsIHx8IChMb2dMZXZlbCA9IHt9KSk7XG5jb25zdCBsZXZlbFN0cmluZ1RvRW51bSA9IHtcbiAgICAnZGVidWcnOiBMb2dMZXZlbC5ERUJVRyxcbiAgICAndmVyYm9zZSc6IExvZ0xldmVsLlZFUkJPU0UsXG4gICAgJ2luZm8nOiBMb2dMZXZlbC5JTkZPLFxuICAgICd3YXJuJzogTG9nTGV2ZWwuV0FSTixcbiAgICAnZXJyb3InOiBMb2dMZXZlbC5FUlJPUixcbiAgICAnc2lsZW50JzogTG9nTGV2ZWwuU0lMRU5UXG59O1xuLyoqXG4gKiBUaGUgZGVmYXVsdCBsb2cgbGV2ZWxcbiAqL1xuY29uc3QgZGVmYXVsdExvZ0xldmVsID0gTG9nTGV2ZWwuSU5GTztcbi8qKlxuICogQnkgZGVmYXVsdCwgYGNvbnNvbGUuZGVidWdgIGlzIG5vdCBkaXNwbGF5ZWQgaW4gdGhlIGRldmVsb3BlciBjb25zb2xlIChpblxuICogY2hyb21lKS4gVG8gYXZvaWQgZm9yY2luZyB1c2VycyB0byBoYXZlIHRvIG9wdC1pbiB0byB0aGVzZSBsb2dzIHR3aWNlXG4gKiAoaS5lLiBvbmNlIGZvciBmaXJlYmFzZSwgYW5kIG9uY2UgaW4gdGhlIGNvbnNvbGUpLCB3ZSBhcmUgc2VuZGluZyBgREVCVUdgXG4gKiBsb2dzIHRvIHRoZSBgY29uc29sZS5sb2dgIGZ1bmN0aW9uLlxuICovXG5jb25zdCBDb25zb2xlTWV0aG9kID0ge1xuICAgIFtMb2dMZXZlbC5ERUJVR106ICdsb2cnLFxuICAgIFtMb2dMZXZlbC5WRVJCT1NFXTogJ2xvZycsXG4gICAgW0xvZ0xldmVsLklORk9dOiAnaW5mbycsXG4gICAgW0xvZ0xldmVsLldBUk5dOiAnd2FybicsXG4gICAgW0xvZ0xldmVsLkVSUk9SXTogJ2Vycm9yJ1xufTtcbi8qKlxuICogVGhlIGRlZmF1bHQgbG9nIGhhbmRsZXIgd2lsbCBmb3J3YXJkIERFQlVHLCBWRVJCT1NFLCBJTkZPLCBXQVJOLCBhbmQgRVJST1JcbiAqIG1lc3NhZ2VzIG9uIHRvIHRoZWlyIGNvcnJlc3BvbmRpbmcgY29uc29sZSBjb3VudGVycGFydHMgKGlmIHRoZSBsb2cgbWV0aG9kXG4gKiBpcyBzdXBwb3J0ZWQgYnkgdGhlIGN1cnJlbnQgbG9nIGxldmVsKVxuICovXG5jb25zdCBkZWZhdWx0TG9nSGFuZGxlciA9IChpbnN0YW5jZSwgbG9nVHlwZSwgLi4uYXJncykgPT4ge1xuICAgIGlmIChsb2dUeXBlIDwgaW5zdGFuY2UubG9nTGV2ZWwpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XG4gICAgY29uc3QgbWV0aG9kID0gQ29uc29sZU1ldGhvZFtsb2dUeXBlXTtcbiAgICBpZiAobWV0aG9kKSB7XG4gICAgICAgIGNvbnNvbGVbbWV0aG9kXShgWyR7bm93fV0gICR7aW5zdGFuY2UubmFtZX06YCwgLi4uYXJncyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEF0dGVtcHRlZCB0byBsb2cgYSBtZXNzYWdlIHdpdGggYW4gaW52YWxpZCBsb2dUeXBlICh2YWx1ZTogJHtsb2dUeXBlfSlgKTtcbiAgICB9XG59O1xuY2xhc3MgTG9nZ2VyIHtcbiAgICAvKipcbiAgICAgKiBHaXZlcyB5b3UgYW4gaW5zdGFuY2Ugb2YgYSBMb2dnZXIgdG8gY2FwdHVyZSBtZXNzYWdlcyBhY2NvcmRpbmcgdG9cbiAgICAgKiBGaXJlYmFzZSdzIGxvZ2dpbmcgc2NoZW1lLlxuICAgICAqXG4gICAgICogQHBhcmFtIG5hbWUgVGhlIG5hbWUgdGhhdCB0aGUgbG9ncyB3aWxsIGJlIGFzc29jaWF0ZWQgd2l0aFxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKG5hbWUpIHtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBsb2cgbGV2ZWwgb2YgdGhlIGdpdmVuIExvZ2dlciBpbnN0YW5jZS5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2xvZ0xldmVsID0gZGVmYXVsdExvZ0xldmVsO1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIG1haW4gKGludGVybmFsKSBsb2cgaGFuZGxlciBmb3IgdGhlIExvZ2dlciBpbnN0YW5jZS5cbiAgICAgICAgICogQ2FuIGJlIHNldCB0byBhIG5ldyBmdW5jdGlvbiBpbiBpbnRlcm5hbCBwYWNrYWdlIGNvZGUgYnV0IG5vdCBieSB1c2VyLlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fbG9nSGFuZGxlciA9IGRlZmF1bHRMb2dIYW5kbGVyO1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIG9wdGlvbmFsLCBhZGRpdGlvbmFsLCB1c2VyLWRlZmluZWQgbG9nIGhhbmRsZXIgZm9yIHRoZSBMb2dnZXIgaW5zdGFuY2UuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl91c2VyTG9nSGFuZGxlciA9IG51bGw7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDYXB0dXJlIHRoZSBjdXJyZW50IGluc3RhbmNlIGZvciBsYXRlciB1c2VcbiAgICAgICAgICovXG4gICAgICAgIGluc3RhbmNlcy5wdXNoKHRoaXMpO1xuICAgIH1cbiAgICBnZXQgbG9nTGV2ZWwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sb2dMZXZlbDtcbiAgICB9XG4gICAgc2V0IGxvZ0xldmVsKHZhbCkge1xuICAgICAgICBpZiAoISh2YWwgaW4gTG9nTGV2ZWwpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGBJbnZhbGlkIHZhbHVlIFwiJHt2YWx9XCIgYXNzaWduZWQgdG8gXFxgbG9nTGV2ZWxcXGBgKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9sb2dMZXZlbCA9IHZhbDtcbiAgICB9XG4gICAgLy8gV29ya2Fyb3VuZCBmb3Igc2V0dGVyL2dldHRlciBoYXZpbmcgdG8gYmUgdGhlIHNhbWUgdHlwZS5cbiAgICBzZXRMb2dMZXZlbCh2YWwpIHtcbiAgICAgICAgdGhpcy5fbG9nTGV2ZWwgPSB0eXBlb2YgdmFsID09PSAnc3RyaW5nJyA/IGxldmVsU3RyaW5nVG9FbnVtW3ZhbF0gOiB2YWw7XG4gICAgfVxuICAgIGdldCBsb2dIYW5kbGVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbG9nSGFuZGxlcjtcbiAgICB9XG4gICAgc2V0IGxvZ0hhbmRsZXIodmFsKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdmFsICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdWYWx1ZSBhc3NpZ25lZCB0byBgbG9nSGFuZGxlcmAgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fbG9nSGFuZGxlciA9IHZhbDtcbiAgICB9XG4gICAgZ2V0IHVzZXJMb2dIYW5kbGVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdXNlckxvZ0hhbmRsZXI7XG4gICAgfVxuICAgIHNldCB1c2VyTG9nSGFuZGxlcih2YWwpIHtcbiAgICAgICAgdGhpcy5fdXNlckxvZ0hhbmRsZXIgPSB2YWw7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRoZSBmdW5jdGlvbnMgYmVsb3cgYXJlIGFsbCBiYXNlZCBvbiB0aGUgYGNvbnNvbGVgIGludGVyZmFjZVxuICAgICAqL1xuICAgIGRlYnVnKC4uLmFyZ3MpIHtcbiAgICAgICAgdGhpcy5fdXNlckxvZ0hhbmRsZXIgJiYgdGhpcy5fdXNlckxvZ0hhbmRsZXIodGhpcywgTG9nTGV2ZWwuREVCVUcsIC4uLmFyZ3MpO1xuICAgICAgICB0aGlzLl9sb2dIYW5kbGVyKHRoaXMsIExvZ0xldmVsLkRFQlVHLCAuLi5hcmdzKTtcbiAgICB9XG4gICAgbG9nKC4uLmFyZ3MpIHtcbiAgICAgICAgdGhpcy5fdXNlckxvZ0hhbmRsZXIgJiZcbiAgICAgICAgICAgIHRoaXMuX3VzZXJMb2dIYW5kbGVyKHRoaXMsIExvZ0xldmVsLlZFUkJPU0UsIC4uLmFyZ3MpO1xuICAgICAgICB0aGlzLl9sb2dIYW5kbGVyKHRoaXMsIExvZ0xldmVsLlZFUkJPU0UsIC4uLmFyZ3MpO1xuICAgIH1cbiAgICBpbmZvKC4uLmFyZ3MpIHtcbiAgICAgICAgdGhpcy5fdXNlckxvZ0hhbmRsZXIgJiYgdGhpcy5fdXNlckxvZ0hhbmRsZXIodGhpcywgTG9nTGV2ZWwuSU5GTywgLi4uYXJncyk7XG4gICAgICAgIHRoaXMuX2xvZ0hhbmRsZXIodGhpcywgTG9nTGV2ZWwuSU5GTywgLi4uYXJncyk7XG4gICAgfVxuICAgIHdhcm4oLi4uYXJncykge1xuICAgICAgICB0aGlzLl91c2VyTG9nSGFuZGxlciAmJiB0aGlzLl91c2VyTG9nSGFuZGxlcih0aGlzLCBMb2dMZXZlbC5XQVJOLCAuLi5hcmdzKTtcbiAgICAgICAgdGhpcy5fbG9nSGFuZGxlcih0aGlzLCBMb2dMZXZlbC5XQVJOLCAuLi5hcmdzKTtcbiAgICB9XG4gICAgZXJyb3IoLi4uYXJncykge1xuICAgICAgICB0aGlzLl91c2VyTG9nSGFuZGxlciAmJiB0aGlzLl91c2VyTG9nSGFuZGxlcih0aGlzLCBMb2dMZXZlbC5FUlJPUiwgLi4uYXJncyk7XG4gICAgICAgIHRoaXMuX2xvZ0hhbmRsZXIodGhpcywgTG9nTGV2ZWwuRVJST1IsIC4uLmFyZ3MpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHNldExvZ0xldmVsKGxldmVsKSB7XG4gICAgaW5zdGFuY2VzLmZvckVhY2goaW5zdCA9PiB7XG4gICAgICAgIGluc3Quc2V0TG9nTGV2ZWwobGV2ZWwpO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gc2V0VXNlckxvZ0hhbmRsZXIobG9nQ2FsbGJhY2ssIG9wdGlvbnMpIHtcbiAgICBmb3IgKGNvbnN0IGluc3RhbmNlIG9mIGluc3RhbmNlcykge1xuICAgICAgICBsZXQgY3VzdG9tTG9nTGV2ZWwgPSBudWxsO1xuICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmxldmVsKSB7XG4gICAgICAgICAgICBjdXN0b21Mb2dMZXZlbCA9IGxldmVsU3RyaW5nVG9FbnVtW29wdGlvbnMubGV2ZWxdO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsb2dDYWxsYmFjayA9PT0gbnVsbCkge1xuICAgICAgICAgICAgaW5zdGFuY2UudXNlckxvZ0hhbmRsZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaW5zdGFuY2UudXNlckxvZ0hhbmRsZXIgPSAoaW5zdGFuY2UsIGxldmVsLCAuLi5hcmdzKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IGFyZ3NcbiAgICAgICAgICAgICAgICAgICAgLm1hcChhcmcgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYXJnID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXJnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiBhcmcgPT09ICdudW1iZXInIHx8IHR5cGVvZiBhcmcgPT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFyZy50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGFyZyBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXJnLm1lc3NhZ2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShhcmcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGlnbm9yZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoYXJnID0+IGFyZylcbiAgICAgICAgICAgICAgICAgICAgLmpvaW4oJyAnKTtcbiAgICAgICAgICAgICAgICBpZiAobGV2ZWwgPj0gKGN1c3RvbUxvZ0xldmVsID8/IGluc3RhbmNlLmxvZ0xldmVsKSkge1xuICAgICAgICAgICAgICAgICAgICBsb2dDYWxsYmFjayh7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXZlbDogTG9nTGV2ZWxbbGV2ZWxdLnRvTG93ZXJDYXNlKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXJncyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGluc3RhbmNlLm5hbWVcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IHsgTG9nTGV2ZWwsIExvZ2dlciwgc2V0TG9nTGV2ZWwsIHNldFVzZXJMb2dIYW5kbGVyIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5lc20uanMubWFwXG4iLCJjb25zdCBpbnN0YW5jZU9mQW55ID0gKG9iamVjdCwgY29uc3RydWN0b3JzKSA9PiBjb25zdHJ1Y3RvcnMuc29tZSgoYykgPT4gb2JqZWN0IGluc3RhbmNlb2YgYyk7XG5cbmxldCBpZGJQcm94eWFibGVUeXBlcztcbmxldCBjdXJzb3JBZHZhbmNlTWV0aG9kcztcbi8vIFRoaXMgaXMgYSBmdW5jdGlvbiB0byBwcmV2ZW50IGl0IHRocm93aW5nIHVwIGluIG5vZGUgZW52aXJvbm1lbnRzLlxuZnVuY3Rpb24gZ2V0SWRiUHJveHlhYmxlVHlwZXMoKSB7XG4gICAgcmV0dXJuIChpZGJQcm94eWFibGVUeXBlcyB8fFxuICAgICAgICAoaWRiUHJveHlhYmxlVHlwZXMgPSBbXG4gICAgICAgICAgICBJREJEYXRhYmFzZSxcbiAgICAgICAgICAgIElEQk9iamVjdFN0b3JlLFxuICAgICAgICAgICAgSURCSW5kZXgsXG4gICAgICAgICAgICBJREJDdXJzb3IsXG4gICAgICAgICAgICBJREJUcmFuc2FjdGlvbixcbiAgICAgICAgXSkpO1xufVxuLy8gVGhpcyBpcyBhIGZ1bmN0aW9uIHRvIHByZXZlbnQgaXQgdGhyb3dpbmcgdXAgaW4gbm9kZSBlbnZpcm9ubWVudHMuXG5mdW5jdGlvbiBnZXRDdXJzb3JBZHZhbmNlTWV0aG9kcygpIHtcbiAgICByZXR1cm4gKGN1cnNvckFkdmFuY2VNZXRob2RzIHx8XG4gICAgICAgIChjdXJzb3JBZHZhbmNlTWV0aG9kcyA9IFtcbiAgICAgICAgICAgIElEQkN1cnNvci5wcm90b3R5cGUuYWR2YW5jZSxcbiAgICAgICAgICAgIElEQkN1cnNvci5wcm90b3R5cGUuY29udGludWUsXG4gICAgICAgICAgICBJREJDdXJzb3IucHJvdG90eXBlLmNvbnRpbnVlUHJpbWFyeUtleSxcbiAgICAgICAgXSkpO1xufVxuY29uc3QgY3Vyc29yUmVxdWVzdE1hcCA9IG5ldyBXZWFrTWFwKCk7XG5jb25zdCB0cmFuc2FjdGlvbkRvbmVNYXAgPSBuZXcgV2Vha01hcCgpO1xuY29uc3QgdHJhbnNhY3Rpb25TdG9yZU5hbWVzTWFwID0gbmV3IFdlYWtNYXAoKTtcbmNvbnN0IHRyYW5zZm9ybUNhY2hlID0gbmV3IFdlYWtNYXAoKTtcbmNvbnN0IHJldmVyc2VUcmFuc2Zvcm1DYWNoZSA9IG5ldyBXZWFrTWFwKCk7XG5mdW5jdGlvbiBwcm9taXNpZnlSZXF1ZXN0KHJlcXVlc3QpIHtcbiAgICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBjb25zdCB1bmxpc3RlbiA9ICgpID0+IHtcbiAgICAgICAgICAgIHJlcXVlc3QucmVtb3ZlRXZlbnRMaXN0ZW5lcignc3VjY2VzcycsIHN1Y2Nlc3MpO1xuICAgICAgICAgICAgcmVxdWVzdC5yZW1vdmVFdmVudExpc3RlbmVyKCdlcnJvcicsIGVycm9yKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3Qgc3VjY2VzcyA9ICgpID0+IHtcbiAgICAgICAgICAgIHJlc29sdmUod3JhcChyZXF1ZXN0LnJlc3VsdCkpO1xuICAgICAgICAgICAgdW5saXN0ZW4oKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgZXJyb3IgPSAoKSA9PiB7XG4gICAgICAgICAgICByZWplY3QocmVxdWVzdC5lcnJvcik7XG4gICAgICAgICAgICB1bmxpc3RlbigpO1xuICAgICAgICB9O1xuICAgICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ3N1Y2Nlc3MnLCBzdWNjZXNzKTtcbiAgICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIGVycm9yKTtcbiAgICB9KTtcbiAgICBwcm9taXNlXG4gICAgICAgIC50aGVuKCh2YWx1ZSkgPT4ge1xuICAgICAgICAvLyBTaW5jZSBjdXJzb3JpbmcgcmV1c2VzIHRoZSBJREJSZXF1ZXN0ICgqc2lnaCopLCB3ZSBjYWNoZSBpdCBmb3IgbGF0ZXIgcmV0cmlldmFsXG4gICAgICAgIC8vIChzZWUgd3JhcEZ1bmN0aW9uKS5cbiAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgSURCQ3Vyc29yKSB7XG4gICAgICAgICAgICBjdXJzb3JSZXF1ZXN0TWFwLnNldCh2YWx1ZSwgcmVxdWVzdCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ2F0Y2hpbmcgdG8gYXZvaWQgXCJVbmNhdWdodCBQcm9taXNlIGV4Y2VwdGlvbnNcIlxuICAgIH0pXG4gICAgICAgIC5jYXRjaCgoKSA9PiB7IH0pO1xuICAgIC8vIFRoaXMgbWFwcGluZyBleGlzdHMgaW4gcmV2ZXJzZVRyYW5zZm9ybUNhY2hlIGJ1dCBkb2Vzbid0IGRvZXNuJ3QgZXhpc3QgaW4gdHJhbnNmb3JtQ2FjaGUuIFRoaXNcbiAgICAvLyBpcyBiZWNhdXNlIHdlIGNyZWF0ZSBtYW55IHByb21pc2VzIGZyb20gYSBzaW5nbGUgSURCUmVxdWVzdC5cbiAgICByZXZlcnNlVHJhbnNmb3JtQ2FjaGUuc2V0KHByb21pc2UsIHJlcXVlc3QpO1xuICAgIHJldHVybiBwcm9taXNlO1xufVxuZnVuY3Rpb24gY2FjaGVEb25lUHJvbWlzZUZvclRyYW5zYWN0aW9uKHR4KSB7XG4gICAgLy8gRWFybHkgYmFpbCBpZiB3ZSd2ZSBhbHJlYWR5IGNyZWF0ZWQgYSBkb25lIHByb21pc2UgZm9yIHRoaXMgdHJhbnNhY3Rpb24uXG4gICAgaWYgKHRyYW5zYWN0aW9uRG9uZU1hcC5oYXModHgpKVxuICAgICAgICByZXR1cm47XG4gICAgY29uc3QgZG9uZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgY29uc3QgdW5saXN0ZW4gPSAoKSA9PiB7XG4gICAgICAgICAgICB0eC5yZW1vdmVFdmVudExpc3RlbmVyKCdjb21wbGV0ZScsIGNvbXBsZXRlKTtcbiAgICAgICAgICAgIHR4LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgZXJyb3IpO1xuICAgICAgICAgICAgdHgucmVtb3ZlRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBlcnJvcik7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGNvbXBsZXRlID0gKCkgPT4ge1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgdW5saXN0ZW4oKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgZXJyb3IgPSAoKSA9PiB7XG4gICAgICAgICAgICByZWplY3QodHguZXJyb3IgfHwgbmV3IERPTUV4Y2VwdGlvbignQWJvcnRFcnJvcicsICdBYm9ydEVycm9yJykpO1xuICAgICAgICAgICAgdW5saXN0ZW4oKTtcbiAgICAgICAgfTtcbiAgICAgICAgdHguYWRkRXZlbnRMaXN0ZW5lcignY29tcGxldGUnLCBjb21wbGV0ZSk7XG4gICAgICAgIHR4LmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgZXJyb3IpO1xuICAgICAgICB0eC5hZGRFdmVudExpc3RlbmVyKCdhYm9ydCcsIGVycm9yKTtcbiAgICB9KTtcbiAgICAvLyBDYWNoZSBpdCBmb3IgbGF0ZXIgcmV0cmlldmFsLlxuICAgIHRyYW5zYWN0aW9uRG9uZU1hcC5zZXQodHgsIGRvbmUpO1xufVxubGV0IGlkYlByb3h5VHJhcHMgPSB7XG4gICAgZ2V0KHRhcmdldCwgcHJvcCwgcmVjZWl2ZXIpIHtcbiAgICAgICAgaWYgKHRhcmdldCBpbnN0YW5jZW9mIElEQlRyYW5zYWN0aW9uKSB7XG4gICAgICAgICAgICAvLyBTcGVjaWFsIGhhbmRsaW5nIGZvciB0cmFuc2FjdGlvbi5kb25lLlxuICAgICAgICAgICAgaWYgKHByb3AgPT09ICdkb25lJylcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJhbnNhY3Rpb25Eb25lTWFwLmdldCh0YXJnZXQpO1xuICAgICAgICAgICAgLy8gUG9seWZpbGwgZm9yIG9iamVjdFN0b3JlTmFtZXMgYmVjYXVzZSBvZiBFZGdlLlxuICAgICAgICAgICAgaWYgKHByb3AgPT09ICdvYmplY3RTdG9yZU5hbWVzJykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0YXJnZXQub2JqZWN0U3RvcmVOYW1lcyB8fCB0cmFuc2FjdGlvblN0b3JlTmFtZXNNYXAuZ2V0KHRhcmdldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBNYWtlIHR4LnN0b3JlIHJldHVybiB0aGUgb25seSBzdG9yZSBpbiB0aGUgdHJhbnNhY3Rpb24sIG9yIHVuZGVmaW5lZCBpZiB0aGVyZSBhcmUgbWFueS5cbiAgICAgICAgICAgIGlmIChwcm9wID09PSAnc3RvcmUnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlY2VpdmVyLm9iamVjdFN0b3JlTmFtZXNbMV1cbiAgICAgICAgICAgICAgICAgICAgPyB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgOiByZWNlaXZlci5vYmplY3RTdG9yZShyZWNlaXZlci5vYmplY3RTdG9yZU5hbWVzWzBdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBFbHNlIHRyYW5zZm9ybSB3aGF0ZXZlciB3ZSBnZXQgYmFjay5cbiAgICAgICAgcmV0dXJuIHdyYXAodGFyZ2V0W3Byb3BdKTtcbiAgICB9LFxuICAgIHNldCh0YXJnZXQsIHByb3AsIHZhbHVlKSB7XG4gICAgICAgIHRhcmdldFtwcm9wXSA9IHZhbHVlO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIGhhcyh0YXJnZXQsIHByb3ApIHtcbiAgICAgICAgaWYgKHRhcmdldCBpbnN0YW5jZW9mIElEQlRyYW5zYWN0aW9uICYmXG4gICAgICAgICAgICAocHJvcCA9PT0gJ2RvbmUnIHx8IHByb3AgPT09ICdzdG9yZScpKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHJvcCBpbiB0YXJnZXQ7XG4gICAgfSxcbn07XG5mdW5jdGlvbiByZXBsYWNlVHJhcHMoY2FsbGJhY2spIHtcbiAgICBpZGJQcm94eVRyYXBzID0gY2FsbGJhY2soaWRiUHJveHlUcmFwcyk7XG59XG5mdW5jdGlvbiB3cmFwRnVuY3Rpb24oZnVuYykge1xuICAgIC8vIER1ZSB0byBleHBlY3RlZCBvYmplY3QgZXF1YWxpdHkgKHdoaWNoIGlzIGVuZm9yY2VkIGJ5IHRoZSBjYWNoaW5nIGluIGB3cmFwYCksIHdlXG4gICAgLy8gb25seSBjcmVhdGUgb25lIG5ldyBmdW5jIHBlciBmdW5jLlxuICAgIC8vIEVkZ2UgZG9lc24ndCBzdXBwb3J0IG9iamVjdFN0b3JlTmFtZXMgKGJvb28pLCBzbyB3ZSBwb2x5ZmlsbCBpdCBoZXJlLlxuICAgIGlmIChmdW5jID09PSBJREJEYXRhYmFzZS5wcm90b3R5cGUudHJhbnNhY3Rpb24gJiZcbiAgICAgICAgISgnb2JqZWN0U3RvcmVOYW1lcycgaW4gSURCVHJhbnNhY3Rpb24ucHJvdG90eXBlKSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHN0b3JlTmFtZXMsIC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIGNvbnN0IHR4ID0gZnVuYy5jYWxsKHVud3JhcCh0aGlzKSwgc3RvcmVOYW1lcywgLi4uYXJncyk7XG4gICAgICAgICAgICB0cmFuc2FjdGlvblN0b3JlTmFtZXNNYXAuc2V0KHR4LCBzdG9yZU5hbWVzLnNvcnQgPyBzdG9yZU5hbWVzLnNvcnQoKSA6IFtzdG9yZU5hbWVzXSk7XG4gICAgICAgICAgICByZXR1cm4gd3JhcCh0eCk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIC8vIEN1cnNvciBtZXRob2RzIGFyZSBzcGVjaWFsLCBhcyB0aGUgYmVoYXZpb3VyIGlzIGEgbGl0dGxlIG1vcmUgZGlmZmVyZW50IHRvIHN0YW5kYXJkIElEQi4gSW5cbiAgICAvLyBJREIsIHlvdSBhZHZhbmNlIHRoZSBjdXJzb3IgYW5kIHdhaXQgZm9yIGEgbmV3ICdzdWNjZXNzJyBvbiB0aGUgSURCUmVxdWVzdCB0aGF0IGdhdmUgeW91IHRoZVxuICAgIC8vIGN1cnNvci4gSXQncyBraW5kYSBsaWtlIGEgcHJvbWlzZSB0aGF0IGNhbiByZXNvbHZlIHdpdGggbWFueSB2YWx1ZXMuIFRoYXQgZG9lc24ndCBtYWtlIHNlbnNlXG4gICAgLy8gd2l0aCByZWFsIHByb21pc2VzLCBzbyBlYWNoIGFkdmFuY2UgbWV0aG9kcyByZXR1cm5zIGEgbmV3IHByb21pc2UgZm9yIHRoZSBjdXJzb3Igb2JqZWN0LCBvclxuICAgIC8vIHVuZGVmaW5lZCBpZiB0aGUgZW5kIG9mIHRoZSBjdXJzb3IgaGFzIGJlZW4gcmVhY2hlZC5cbiAgICBpZiAoZ2V0Q3Vyc29yQWR2YW5jZU1ldGhvZHMoKS5pbmNsdWRlcyhmdW5jKSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIC8vIENhbGxpbmcgdGhlIG9yaWdpbmFsIGZ1bmN0aW9uIHdpdGggdGhlIHByb3h5IGFzICd0aGlzJyBjYXVzZXMgSUxMRUdBTCBJTlZPQ0FUSU9OLCBzbyB3ZSB1c2VcbiAgICAgICAgICAgIC8vIHRoZSBvcmlnaW5hbCBvYmplY3QuXG4gICAgICAgICAgICBmdW5jLmFwcGx5KHVud3JhcCh0aGlzKSwgYXJncyk7XG4gICAgICAgICAgICByZXR1cm4gd3JhcChjdXJzb3JSZXF1ZXN0TWFwLmdldCh0aGlzKSk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICAvLyBDYWxsaW5nIHRoZSBvcmlnaW5hbCBmdW5jdGlvbiB3aXRoIHRoZSBwcm94eSBhcyAndGhpcycgY2F1c2VzIElMTEVHQUwgSU5WT0NBVElPTiwgc28gd2UgdXNlXG4gICAgICAgIC8vIHRoZSBvcmlnaW5hbCBvYmplY3QuXG4gICAgICAgIHJldHVybiB3cmFwKGZ1bmMuYXBwbHkodW53cmFwKHRoaXMpLCBhcmdzKSk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIHRyYW5zZm9ybUNhY2hhYmxlVmFsdWUodmFsdWUpIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKVxuICAgICAgICByZXR1cm4gd3JhcEZ1bmN0aW9uKHZhbHVlKTtcbiAgICAvLyBUaGlzIGRvZXNuJ3QgcmV0dXJuLCBpdCBqdXN0IGNyZWF0ZXMgYSAnZG9uZScgcHJvbWlzZSBmb3IgdGhlIHRyYW5zYWN0aW9uLFxuICAgIC8vIHdoaWNoIGlzIGxhdGVyIHJldHVybmVkIGZvciB0cmFuc2FjdGlvbi5kb25lIChzZWUgaWRiT2JqZWN0SGFuZGxlcikuXG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgSURCVHJhbnNhY3Rpb24pXG4gICAgICAgIGNhY2hlRG9uZVByb21pc2VGb3JUcmFuc2FjdGlvbih2YWx1ZSk7XG4gICAgaWYgKGluc3RhbmNlT2ZBbnkodmFsdWUsIGdldElkYlByb3h5YWJsZVR5cGVzKCkpKVxuICAgICAgICByZXR1cm4gbmV3IFByb3h5KHZhbHVlLCBpZGJQcm94eVRyYXBzKTtcbiAgICAvLyBSZXR1cm4gdGhlIHNhbWUgdmFsdWUgYmFjayBpZiB3ZSdyZSBub3QgZ29pbmcgdG8gdHJhbnNmb3JtIGl0LlxuICAgIHJldHVybiB2YWx1ZTtcbn1cbmZ1bmN0aW9uIHdyYXAodmFsdWUpIHtcbiAgICAvLyBXZSBzb21ldGltZXMgZ2VuZXJhdGUgbXVsdGlwbGUgcHJvbWlzZXMgZnJvbSBhIHNpbmdsZSBJREJSZXF1ZXN0IChlZyB3aGVuIGN1cnNvcmluZyksIGJlY2F1c2VcbiAgICAvLyBJREIgaXMgd2VpcmQgYW5kIGEgc2luZ2xlIElEQlJlcXVlc3QgY2FuIHlpZWxkIG1hbnkgcmVzcG9uc2VzLCBzbyB0aGVzZSBjYW4ndCBiZSBjYWNoZWQuXG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgSURCUmVxdWVzdClcbiAgICAgICAgcmV0dXJuIHByb21pc2lmeVJlcXVlc3QodmFsdWUpO1xuICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgdHJhbnNmb3JtZWQgdGhpcyB2YWx1ZSBiZWZvcmUsIHJldXNlIHRoZSB0cmFuc2Zvcm1lZCB2YWx1ZS5cbiAgICAvLyBUaGlzIGlzIGZhc3RlciwgYnV0IGl0IGFsc28gcHJvdmlkZXMgb2JqZWN0IGVxdWFsaXR5LlxuICAgIGlmICh0cmFuc2Zvcm1DYWNoZS5oYXModmFsdWUpKVxuICAgICAgICByZXR1cm4gdHJhbnNmb3JtQ2FjaGUuZ2V0KHZhbHVlKTtcbiAgICBjb25zdCBuZXdWYWx1ZSA9IHRyYW5zZm9ybUNhY2hhYmxlVmFsdWUodmFsdWUpO1xuICAgIC8vIE5vdCBhbGwgdHlwZXMgYXJlIHRyYW5zZm9ybWVkLlxuICAgIC8vIFRoZXNlIG1heSBiZSBwcmltaXRpdmUgdHlwZXMsIHNvIHRoZXkgY2FuJ3QgYmUgV2Vha01hcCBrZXlzLlxuICAgIGlmIChuZXdWYWx1ZSAhPT0gdmFsdWUpIHtcbiAgICAgICAgdHJhbnNmb3JtQ2FjaGUuc2V0KHZhbHVlLCBuZXdWYWx1ZSk7XG4gICAgICAgIHJldmVyc2VUcmFuc2Zvcm1DYWNoZS5zZXQobmV3VmFsdWUsIHZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ld1ZhbHVlO1xufVxuY29uc3QgdW53cmFwID0gKHZhbHVlKSA9PiByZXZlcnNlVHJhbnNmb3JtQ2FjaGUuZ2V0KHZhbHVlKTtcblxuZXhwb3J0IHsgcmV2ZXJzZVRyYW5zZm9ybUNhY2hlIGFzIGEsIGluc3RhbmNlT2ZBbnkgYXMgaSwgcmVwbGFjZVRyYXBzIGFzIHIsIHVud3JhcCBhcyB1LCB3cmFwIGFzIHcgfTtcbiIsImltcG9ydCB7IHcgYXMgd3JhcCwgciBhcyByZXBsYWNlVHJhcHMgfSBmcm9tICcuL3dyYXAtaWRiLXZhbHVlLmpzJztcbmV4cG9ydCB7IHUgYXMgdW53cmFwLCB3IGFzIHdyYXAgfSBmcm9tICcuL3dyYXAtaWRiLXZhbHVlLmpzJztcblxuLyoqXG4gKiBPcGVuIGEgZGF0YWJhc2UuXG4gKlxuICogQHBhcmFtIG5hbWUgTmFtZSBvZiB0aGUgZGF0YWJhc2UuXG4gKiBAcGFyYW0gdmVyc2lvbiBTY2hlbWEgdmVyc2lvbi5cbiAqIEBwYXJhbSBjYWxsYmFja3MgQWRkaXRpb25hbCBjYWxsYmFja3MuXG4gKi9cbmZ1bmN0aW9uIG9wZW5EQihuYW1lLCB2ZXJzaW9uLCB7IGJsb2NrZWQsIHVwZ3JhZGUsIGJsb2NraW5nLCB0ZXJtaW5hdGVkIH0gPSB7fSkge1xuICAgIGNvbnN0IHJlcXVlc3QgPSBpbmRleGVkREIub3BlbihuYW1lLCB2ZXJzaW9uKTtcbiAgICBjb25zdCBvcGVuUHJvbWlzZSA9IHdyYXAocmVxdWVzdCk7XG4gICAgaWYgKHVwZ3JhZGUpIHtcbiAgICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCd1cGdyYWRlbmVlZGVkJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICB1cGdyYWRlKHdyYXAocmVxdWVzdC5yZXN1bHQpLCBldmVudC5vbGRWZXJzaW9uLCBldmVudC5uZXdWZXJzaW9uLCB3cmFwKHJlcXVlc3QudHJhbnNhY3Rpb24pLCBldmVudCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoYmxvY2tlZCkge1xuICAgICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2Jsb2NrZWQnLCAoZXZlbnQpID0+IGJsb2NrZWQoXG4gICAgICAgIC8vIENhc3RpbmcgZHVlIHRvIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvVHlwZVNjcmlwdC1ET00tbGliLWdlbmVyYXRvci9wdWxsLzE0MDVcbiAgICAgICAgZXZlbnQub2xkVmVyc2lvbiwgZXZlbnQubmV3VmVyc2lvbiwgZXZlbnQpKTtcbiAgICB9XG4gICAgb3BlblByb21pc2VcbiAgICAgICAgLnRoZW4oKGRiKSA9PiB7XG4gICAgICAgIGlmICh0ZXJtaW5hdGVkKVxuICAgICAgICAgICAgZGIuYWRkRXZlbnRMaXN0ZW5lcignY2xvc2UnLCAoKSA9PiB0ZXJtaW5hdGVkKCkpO1xuICAgICAgICBpZiAoYmxvY2tpbmcpIHtcbiAgICAgICAgICAgIGRiLmFkZEV2ZW50TGlzdGVuZXIoJ3ZlcnNpb25jaGFuZ2UnLCAoZXZlbnQpID0+IGJsb2NraW5nKGV2ZW50Lm9sZFZlcnNpb24sIGV2ZW50Lm5ld1ZlcnNpb24sIGV2ZW50KSk7XG4gICAgICAgIH1cbiAgICB9KVxuICAgICAgICAuY2F0Y2goKCkgPT4geyB9KTtcbiAgICByZXR1cm4gb3BlblByb21pc2U7XG59XG4vKipcbiAqIERlbGV0ZSBhIGRhdGFiYXNlLlxuICpcbiAqIEBwYXJhbSBuYW1lIE5hbWUgb2YgdGhlIGRhdGFiYXNlLlxuICovXG5mdW5jdGlvbiBkZWxldGVEQihuYW1lLCB7IGJsb2NrZWQgfSA9IHt9KSB7XG4gICAgY29uc3QgcmVxdWVzdCA9IGluZGV4ZWREQi5kZWxldGVEYXRhYmFzZShuYW1lKTtcbiAgICBpZiAoYmxvY2tlZCkge1xuICAgICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2Jsb2NrZWQnLCAoZXZlbnQpID0+IGJsb2NrZWQoXG4gICAgICAgIC8vIENhc3RpbmcgZHVlIHRvIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvVHlwZVNjcmlwdC1ET00tbGliLWdlbmVyYXRvci9wdWxsLzE0MDVcbiAgICAgICAgZXZlbnQub2xkVmVyc2lvbiwgZXZlbnQpKTtcbiAgICB9XG4gICAgcmV0dXJuIHdyYXAocmVxdWVzdCkudGhlbigoKSA9PiB1bmRlZmluZWQpO1xufVxuXG5jb25zdCByZWFkTWV0aG9kcyA9IFsnZ2V0JywgJ2dldEtleScsICdnZXRBbGwnLCAnZ2V0QWxsS2V5cycsICdjb3VudCddO1xuY29uc3Qgd3JpdGVNZXRob2RzID0gWydwdXQnLCAnYWRkJywgJ2RlbGV0ZScsICdjbGVhciddO1xuY29uc3QgY2FjaGVkTWV0aG9kcyA9IG5ldyBNYXAoKTtcbmZ1bmN0aW9uIGdldE1ldGhvZCh0YXJnZXQsIHByb3ApIHtcbiAgICBpZiAoISh0YXJnZXQgaW5zdGFuY2VvZiBJREJEYXRhYmFzZSAmJlxuICAgICAgICAhKHByb3AgaW4gdGFyZ2V0KSAmJlxuICAgICAgICB0eXBlb2YgcHJvcCA9PT0gJ3N0cmluZycpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGNhY2hlZE1ldGhvZHMuZ2V0KHByb3ApKVxuICAgICAgICByZXR1cm4gY2FjaGVkTWV0aG9kcy5nZXQocHJvcCk7XG4gICAgY29uc3QgdGFyZ2V0RnVuY05hbWUgPSBwcm9wLnJlcGxhY2UoL0Zyb21JbmRleCQvLCAnJyk7XG4gICAgY29uc3QgdXNlSW5kZXggPSBwcm9wICE9PSB0YXJnZXRGdW5jTmFtZTtcbiAgICBjb25zdCBpc1dyaXRlID0gd3JpdGVNZXRob2RzLmluY2x1ZGVzKHRhcmdldEZ1bmNOYW1lKTtcbiAgICBpZiAoXG4gICAgLy8gQmFpbCBpZiB0aGUgdGFyZ2V0IGRvZXNuJ3QgZXhpc3Qgb24gdGhlIHRhcmdldC4gRWcsIGdldEFsbCBpc24ndCBpbiBFZGdlLlxuICAgICEodGFyZ2V0RnVuY05hbWUgaW4gKHVzZUluZGV4ID8gSURCSW5kZXggOiBJREJPYmplY3RTdG9yZSkucHJvdG90eXBlKSB8fFxuICAgICAgICAhKGlzV3JpdGUgfHwgcmVhZE1ldGhvZHMuaW5jbHVkZXModGFyZ2V0RnVuY05hbWUpKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG1ldGhvZCA9IGFzeW5jIGZ1bmN0aW9uIChzdG9yZU5hbWUsIC4uLmFyZ3MpIHtcbiAgICAgICAgLy8gaXNXcml0ZSA/ICdyZWFkd3JpdGUnIDogdW5kZWZpbmVkIGd6aXBwcyBiZXR0ZXIsIGJ1dCBmYWlscyBpbiBFZGdlIDooXG4gICAgICAgIGNvbnN0IHR4ID0gdGhpcy50cmFuc2FjdGlvbihzdG9yZU5hbWUsIGlzV3JpdGUgPyAncmVhZHdyaXRlJyA6ICdyZWFkb25seScpO1xuICAgICAgICBsZXQgdGFyZ2V0ID0gdHguc3RvcmU7XG4gICAgICAgIGlmICh1c2VJbmRleClcbiAgICAgICAgICAgIHRhcmdldCA9IHRhcmdldC5pbmRleChhcmdzLnNoaWZ0KCkpO1xuICAgICAgICAvLyBNdXN0IHJlamVjdCBpZiBvcCByZWplY3RzLlxuICAgICAgICAvLyBJZiBpdCdzIGEgd3JpdGUgb3BlcmF0aW9uLCBtdXN0IHJlamVjdCBpZiB0eC5kb25lIHJlamVjdHMuXG4gICAgICAgIC8vIE11c3QgcmVqZWN0IHdpdGggb3AgcmVqZWN0aW9uIGZpcnN0LlxuICAgICAgICAvLyBNdXN0IHJlc29sdmUgd2l0aCBvcCB2YWx1ZS5cbiAgICAgICAgLy8gTXVzdCBoYW5kbGUgYm90aCBwcm9taXNlcyAobm8gdW5oYW5kbGVkIHJlamVjdGlvbnMpXG4gICAgICAgIHJldHVybiAoYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgdGFyZ2V0W3RhcmdldEZ1bmNOYW1lXSguLi5hcmdzKSxcbiAgICAgICAgICAgIGlzV3JpdGUgJiYgdHguZG9uZSxcbiAgICAgICAgXSkpWzBdO1xuICAgIH07XG4gICAgY2FjaGVkTWV0aG9kcy5zZXQocHJvcCwgbWV0aG9kKTtcbiAgICByZXR1cm4gbWV0aG9kO1xufVxucmVwbGFjZVRyYXBzKChvbGRUcmFwcykgPT4gKHtcbiAgICAuLi5vbGRUcmFwcyxcbiAgICBnZXQ6ICh0YXJnZXQsIHByb3AsIHJlY2VpdmVyKSA9PiBnZXRNZXRob2QodGFyZ2V0LCBwcm9wKSB8fCBvbGRUcmFwcy5nZXQodGFyZ2V0LCBwcm9wLCByZWNlaXZlciksXG4gICAgaGFzOiAodGFyZ2V0LCBwcm9wKSA9PiAhIWdldE1ldGhvZCh0YXJnZXQsIHByb3ApIHx8IG9sZFRyYXBzLmhhcyh0YXJnZXQsIHByb3ApLFxufSkpO1xuXG5leHBvcnQgeyBkZWxldGVEQiwgb3BlbkRCIH07XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIENvbXBvbmVudENvbnRhaW5lciB9IGZyb20gJ0BmaXJlYmFzZS9jb21wb25lbnQnO1xuaW1wb3J0IHsgTG9nZ2VyLCBzZXRVc2VyTG9nSGFuZGxlciwgc2V0TG9nTGV2ZWwgYXMgc2V0TG9nTGV2ZWwkMSB9IGZyb20gJ0BmaXJlYmFzZS9sb2dnZXInO1xuaW1wb3J0IHsgRXJyb3JGYWN0b3J5LCBiYXNlNjREZWNvZGUsIGdldERlZmF1bHRBcHBDb25maWcsIGRlZXBFcXVhbCwgaXNCcm93c2VyLCBpc1dlYldvcmtlciwgRmlyZWJhc2VFcnJvciwgYmFzZTY0dXJsRW5jb2RlV2l0aG91dFBhZGRpbmcsIGlzSW5kZXhlZERCQXZhaWxhYmxlLCB2YWxpZGF0ZUluZGV4ZWREQk9wZW5hYmxlIH0gZnJvbSAnQGZpcmViYXNlL3V0aWwnO1xuZXhwb3J0IHsgRmlyZWJhc2VFcnJvciB9IGZyb20gJ0BmaXJlYmFzZS91dGlsJztcbmltcG9ydCB7IG9wZW5EQiB9IGZyb20gJ2lkYic7XG5cbi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5jbGFzcyBQbGF0Zm9ybUxvZ2dlclNlcnZpY2VJbXBsIHtcbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXIpIHtcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XG4gICAgfVxuICAgIC8vIEluIGluaXRpYWwgaW1wbGVtZW50YXRpb24sIHRoaXMgd2lsbCBiZSBjYWxsZWQgYnkgaW5zdGFsbGF0aW9ucyBvblxuICAgIC8vIGF1dGggdG9rZW4gcmVmcmVzaCwgYW5kIGluc3RhbGxhdGlvbnMgd2lsbCBzZW5kIHRoaXMgc3RyaW5nLlxuICAgIGdldFBsYXRmb3JtSW5mb1N0cmluZygpIHtcbiAgICAgICAgY29uc3QgcHJvdmlkZXJzID0gdGhpcy5jb250YWluZXIuZ2V0UHJvdmlkZXJzKCk7XG4gICAgICAgIC8vIExvb3AgdGhyb3VnaCBwcm92aWRlcnMgYW5kIGdldCBsaWJyYXJ5L3ZlcnNpb24gcGFpcnMgZnJvbSBhbnkgdGhhdCBhcmVcbiAgICAgICAgLy8gdmVyc2lvbiBjb21wb25lbnRzLlxuICAgICAgICByZXR1cm4gcHJvdmlkZXJzXG4gICAgICAgICAgICAubWFwKHByb3ZpZGVyID0+IHtcbiAgICAgICAgICAgIGlmIChpc1ZlcnNpb25TZXJ2aWNlUHJvdmlkZXIocHJvdmlkZXIpKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2VydmljZSA9IHByb3ZpZGVyLmdldEltbWVkaWF0ZSgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBgJHtzZXJ2aWNlLmxpYnJhcnl9LyR7c2VydmljZS52ZXJzaW9ufWA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgICAgIC5maWx0ZXIobG9nU3RyaW5nID0+IGxvZ1N0cmluZylcbiAgICAgICAgICAgIC5qb2luKCcgJyk7XG4gICAgfVxufVxuLyoqXG4gKlxuICogQHBhcmFtIHByb3ZpZGVyIGNoZWNrIGlmIHRoaXMgcHJvdmlkZXIgcHJvdmlkZXMgYSBWZXJzaW9uU2VydmljZVxuICpcbiAqIE5PVEU6IFVzaW5nIFByb3ZpZGVyPCdhcHAtdmVyc2lvbic+IGlzIGEgaGFjayB0byBpbmRpY2F0ZSB0aGF0IHRoZSBwcm92aWRlclxuICogcHJvdmlkZXMgVmVyc2lvblNlcnZpY2UuIFRoZSBwcm92aWRlciBpcyBub3QgbmVjZXNzYXJpbHkgYSAnYXBwLXZlcnNpb24nXG4gKiBwcm92aWRlci5cbiAqL1xuZnVuY3Rpb24gaXNWZXJzaW9uU2VydmljZVByb3ZpZGVyKHByb3ZpZGVyKSB7XG4gICAgY29uc3QgY29tcG9uZW50ID0gcHJvdmlkZXIuZ2V0Q29tcG9uZW50KCk7XG4gICAgcmV0dXJuIGNvbXBvbmVudD8udHlwZSA9PT0gXCJWRVJTSU9OXCIgLyogQ29tcG9uZW50VHlwZS5WRVJTSU9OICovO1xufVxuXG5jb25zdCBuYW1lJHEgPSBcIkBmaXJlYmFzZS9hcHBcIjtcbmNvbnN0IHZlcnNpb24kMSA9IFwiMC4xNS4xXCI7XG5cbi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5jb25zdCBsb2dnZXIgPSBuZXcgTG9nZ2VyKCdAZmlyZWJhc2UvYXBwJyk7XG5cbmNvbnN0IG5hbWUkcCA9IFwiQGZpcmViYXNlL2FwcC1jb21wYXRcIjtcblxuY29uc3QgbmFtZSRvID0gXCJAZmlyZWJhc2UvYW5hbHl0aWNzLWNvbXBhdFwiO1xuXG5jb25zdCBuYW1lJG4gPSBcIkBmaXJlYmFzZS9hbmFseXRpY3NcIjtcblxuY29uc3QgbmFtZSRtID0gXCJAZmlyZWJhc2UvYXBwLWNoZWNrLWNvbXBhdFwiO1xuXG5jb25zdCBuYW1lJGwgPSBcIkBmaXJlYmFzZS9hcHAtY2hlY2tcIjtcblxuY29uc3QgbmFtZSRrID0gXCJAZmlyZWJhc2UvYXV0aFwiO1xuXG5jb25zdCBuYW1lJGogPSBcIkBmaXJlYmFzZS9hdXRoLWNvbXBhdFwiO1xuXG5jb25zdCBuYW1lJGkgPSBcIkBmaXJlYmFzZS9kYXRhYmFzZVwiO1xuXG5jb25zdCBuYW1lJGggPSBcIkBmaXJlYmFzZS9kYXRhLWNvbm5lY3RcIjtcblxuY29uc3QgbmFtZSRnID0gXCJAZmlyZWJhc2UvZGF0YWJhc2UtY29tcGF0XCI7XG5cbmNvbnN0IG5hbWUkZiA9IFwiQGZpcmViYXNlL2Z1bmN0aW9uc1wiO1xuXG5jb25zdCBuYW1lJGUgPSBcIkBmaXJlYmFzZS9mdW5jdGlvbnMtY29tcGF0XCI7XG5cbmNvbnN0IG5hbWUkZCA9IFwiQGZpcmViYXNlL2luc3RhbGxhdGlvbnNcIjtcblxuY29uc3QgbmFtZSRjID0gXCJAZmlyZWJhc2UvaW5zdGFsbGF0aW9ucy1jb21wYXRcIjtcblxuY29uc3QgbmFtZSRiID0gXCJAZmlyZWJhc2UvbWVzc2FnaW5nXCI7XG5cbmNvbnN0IG5hbWUkYSA9IFwiQGZpcmViYXNlL21lc3NhZ2luZy1jb21wYXRcIjtcblxuY29uc3QgbmFtZSQ5ID0gXCJAZmlyZWJhc2UvcGVyZm9ybWFuY2VcIjtcblxuY29uc3QgbmFtZSQ4ID0gXCJAZmlyZWJhc2UvcGVyZm9ybWFuY2UtY29tcGF0XCI7XG5cbmNvbnN0IG5hbWUkNyA9IFwiQGZpcmViYXNlL3JlbW90ZS1jb25maWdcIjtcblxuY29uc3QgbmFtZSQ2ID0gXCJAZmlyZWJhc2UvcmVtb3RlLWNvbmZpZy1jb21wYXRcIjtcblxuY29uc3QgbmFtZSQ1ID0gXCJAZmlyZWJhc2Uvc3RvcmFnZVwiO1xuXG5jb25zdCBuYW1lJDQgPSBcIkBmaXJlYmFzZS9zdG9yYWdlLWNvbXBhdFwiO1xuXG5jb25zdCBuYW1lJDMgPSBcIkBmaXJlYmFzZS9maXJlc3RvcmVcIjtcblxuY29uc3QgbmFtZSQyID0gXCJAZmlyZWJhc2UvYWlcIjtcblxuY29uc3QgbmFtZSQxID0gXCJAZmlyZWJhc2UvZmlyZXN0b3JlLWNvbXBhdFwiO1xuXG5jb25zdCBuYW1lID0gXCJmaXJlYmFzZVwiO1xuY29uc3QgdmVyc2lvbiA9IFwiMTIuMTYuMFwiO1xuXG4vKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuLyoqXG4gKiBUaGUgZGVmYXVsdCBhcHAgbmFtZVxuICpcbiAqIEBpbnRlcm5hbFxuICovXG5jb25zdCBERUZBVUxUX0VOVFJZX05BTUUgPSAnW0RFRkFVTFRdJztcbmNvbnN0IFBMQVRGT1JNX0xPR19TVFJJTkcgPSB7XG4gICAgW25hbWUkcV06ICdmaXJlLWNvcmUnLFxuICAgIFtuYW1lJHBdOiAnZmlyZS1jb3JlLWNvbXBhdCcsXG4gICAgW25hbWUkbl06ICdmaXJlLWFuYWx5dGljcycsXG4gICAgW25hbWUkb106ICdmaXJlLWFuYWx5dGljcy1jb21wYXQnLFxuICAgIFtuYW1lJGxdOiAnZmlyZS1hcHAtY2hlY2snLFxuICAgIFtuYW1lJG1dOiAnZmlyZS1hcHAtY2hlY2stY29tcGF0JyxcbiAgICBbbmFtZSRrXTogJ2ZpcmUtYXV0aCcsXG4gICAgW25hbWUkal06ICdmaXJlLWF1dGgtY29tcGF0JyxcbiAgICBbbmFtZSRpXTogJ2ZpcmUtcnRkYicsXG4gICAgW25hbWUkaF06ICdmaXJlLWRhdGEtY29ubmVjdCcsXG4gICAgW25hbWUkZ106ICdmaXJlLXJ0ZGItY29tcGF0JyxcbiAgICBbbmFtZSRmXTogJ2ZpcmUtZm4nLFxuICAgIFtuYW1lJGVdOiAnZmlyZS1mbi1jb21wYXQnLFxuICAgIFtuYW1lJGRdOiAnZmlyZS1paWQnLFxuICAgIFtuYW1lJGNdOiAnZmlyZS1paWQtY29tcGF0JyxcbiAgICBbbmFtZSRiXTogJ2ZpcmUtZmNtJyxcbiAgICBbbmFtZSRhXTogJ2ZpcmUtZmNtLWNvbXBhdCcsXG4gICAgW25hbWUkOV06ICdmaXJlLXBlcmYnLFxuICAgIFtuYW1lJDhdOiAnZmlyZS1wZXJmLWNvbXBhdCcsXG4gICAgW25hbWUkN106ICdmaXJlLXJjJyxcbiAgICBbbmFtZSQ2XTogJ2ZpcmUtcmMtY29tcGF0JyxcbiAgICBbbmFtZSQ1XTogJ2ZpcmUtZ2NzJyxcbiAgICBbbmFtZSQ0XTogJ2ZpcmUtZ2NzLWNvbXBhdCcsXG4gICAgW25hbWUkM106ICdmaXJlLWZzdCcsXG4gICAgW25hbWUkMV06ICdmaXJlLWZzdC1jb21wYXQnLFxuICAgIFtuYW1lJDJdOiAnZmlyZS12ZXJ0ZXgnLFxuICAgICdmaXJlLWpzJzogJ2ZpcmUtanMnLCAvLyBQbGF0Zm9ybSBpZGVudGlmaWVyIGZvciBKUyBTREsuXG4gICAgW25hbWVdOiAnZmlyZS1qcy1hbGwnXG59O1xuXG4vKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuLyoqXG4gKiBAaW50ZXJuYWxcbiAqL1xuY29uc3QgX2FwcHMgPSBuZXcgTWFwKCk7XG4vKipcbiAqIEBpbnRlcm5hbFxuICovXG5jb25zdCBfc2VydmVyQXBwcyA9IG5ldyBNYXAoKTtcbi8qKlxuICogUmVnaXN0ZXJlZCBjb21wb25lbnRzLlxuICpcbiAqIEBpbnRlcm5hbFxuICovXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuY29uc3QgX2NvbXBvbmVudHMgPSBuZXcgTWFwKCk7XG4vKipcbiAqIEBwYXJhbSBjb21wb25lbnQgLSB0aGUgY29tcG9uZW50IGJlaW5nIGFkZGVkIHRvIHRoaXMgYXBwJ3MgY29udGFpbmVyXG4gKlxuICogQGludGVybmFsXG4gKi9cbmZ1bmN0aW9uIF9hZGRDb21wb25lbnQoYXBwLCBjb21wb25lbnQpIHtcbiAgICB0cnkge1xuICAgICAgICBhcHAuY29udGFpbmVyLmFkZENvbXBvbmVudChjb21wb25lbnQpO1xuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgICBsb2dnZXIuZGVidWcoYENvbXBvbmVudCAke2NvbXBvbmVudC5uYW1lfSBmYWlsZWQgdG8gcmVnaXN0ZXIgd2l0aCBGaXJlYmFzZUFwcCAke2FwcC5uYW1lfWAsIGUpO1xuICAgIH1cbn1cbi8qKlxuICpcbiAqIEBpbnRlcm5hbFxuICovXG5mdW5jdGlvbiBfYWRkT3JPdmVyd3JpdGVDb21wb25lbnQoYXBwLCBjb21wb25lbnQpIHtcbiAgICBhcHAuY29udGFpbmVyLmFkZE9yT3ZlcndyaXRlQ29tcG9uZW50KGNvbXBvbmVudCk7XG59XG4vKipcbiAqXG4gKiBAcGFyYW0gY29tcG9uZW50IC0gdGhlIGNvbXBvbmVudCB0byByZWdpc3RlclxuICogQHJldHVybnMgd2hldGhlciBvciBub3QgdGhlIGNvbXBvbmVudCBpcyByZWdpc3RlcmVkIHN1Y2Nlc3NmdWxseVxuICpcbiAqIEBpbnRlcm5hbFxuICovXG5mdW5jdGlvbiBfcmVnaXN0ZXJDb21wb25lbnQoY29tcG9uZW50KSB7XG4gICAgY29uc3QgY29tcG9uZW50TmFtZSA9IGNvbXBvbmVudC5uYW1lO1xuICAgIGlmIChfY29tcG9uZW50cy5oYXMoY29tcG9uZW50TmFtZSkpIHtcbiAgICAgICAgbG9nZ2VyLmRlYnVnKGBUaGVyZSB3ZXJlIG11bHRpcGxlIGF0dGVtcHRzIHRvIHJlZ2lzdGVyIGNvbXBvbmVudCAke2NvbXBvbmVudE5hbWV9LmApO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIF9jb21wb25lbnRzLnNldChjb21wb25lbnROYW1lLCBjb21wb25lbnQpO1xuICAgIC8vIGFkZCB0aGUgY29tcG9uZW50IHRvIGV4aXN0aW5nIGFwcCBpbnN0YW5jZXNcbiAgICBmb3IgKGNvbnN0IGFwcCBvZiBfYXBwcy52YWx1ZXMoKSkge1xuICAgICAgICBfYWRkQ29tcG9uZW50KGFwcCwgY29tcG9uZW50KTtcbiAgICB9XG4gICAgZm9yIChjb25zdCBzZXJ2ZXJBcHAgb2YgX3NlcnZlckFwcHMudmFsdWVzKCkpIHtcbiAgICAgICAgX2FkZENvbXBvbmVudChzZXJ2ZXJBcHAsIGNvbXBvbmVudCk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xufVxuLyoqXG4gKlxuICogQHBhcmFtIGFwcCAtIEZpcmViYXNlQXBwIGluc3RhbmNlXG4gKiBAcGFyYW0gbmFtZSAtIHNlcnZpY2UgbmFtZVxuICpcbiAqIEByZXR1cm5zIHRoZSBwcm92aWRlciBmb3IgdGhlIHNlcnZpY2Ugd2l0aCB0aGUgbWF0Y2hpbmcgbmFtZVxuICpcbiAqIEBpbnRlcm5hbFxuICovXG5mdW5jdGlvbiBfZ2V0UHJvdmlkZXIoYXBwLCBuYW1lKSB7XG4gICAgY29uc3QgaGVhcnRiZWF0Q29udHJvbGxlciA9IGFwcC5jb250YWluZXJcbiAgICAgICAgLmdldFByb3ZpZGVyKCdoZWFydGJlYXQnKVxuICAgICAgICAuZ2V0SW1tZWRpYXRlKHsgb3B0aW9uYWw6IHRydWUgfSk7XG4gICAgaWYgKGhlYXJ0YmVhdENvbnRyb2xsZXIpIHtcbiAgICAgICAgdm9pZCBoZWFydGJlYXRDb250cm9sbGVyLnRyaWdnZXJIZWFydGJlYXQoKTtcbiAgICB9XG4gICAgcmV0dXJuIGFwcC5jb250YWluZXIuZ2V0UHJvdmlkZXIobmFtZSk7XG59XG4vKipcbiAqXG4gKiBAcGFyYW0gYXBwIC0gRmlyZWJhc2VBcHAgaW5zdGFuY2VcbiAqIEBwYXJhbSBuYW1lIC0gc2VydmljZSBuYW1lXG4gKiBAcGFyYW0gaW5zdGFuY2VJZGVudGlmaWVyIC0gc2VydmljZSBpbnN0YW5jZSBpZGVudGlmaWVyIGluIGNhc2UgdGhlIHNlcnZpY2Ugc3VwcG9ydHMgbXVsdGlwbGUgaW5zdGFuY2VzXG4gKlxuICogQGludGVybmFsXG4gKi9cbmZ1bmN0aW9uIF9yZW1vdmVTZXJ2aWNlSW5zdGFuY2UoYXBwLCBuYW1lLCBpbnN0YW5jZUlkZW50aWZpZXIgPSBERUZBVUxUX0VOVFJZX05BTUUpIHtcbiAgICBfZ2V0UHJvdmlkZXIoYXBwLCBuYW1lKS5jbGVhckluc3RhbmNlKGluc3RhbmNlSWRlbnRpZmllcik7XG59XG4vKipcbiAqXG4gKiBAcGFyYW0gb2JqIC0gYW4gb2JqZWN0IG9mIHR5cGUgRmlyZWJhc2VBcHAsIEZpcmViYXNlT3B0aW9ucyBvciBGaXJlYmFzZUFwcFNldHRpbmdzLlxuICpcbiAqIEByZXR1cm5zIHRydWUgaWYgdGhlIHByb3ZpZGUgb2JqZWN0IGlzIG9mIHR5cGUgRmlyZWJhc2VBcHAuXG4gKlxuICogQGludGVybmFsXG4gKi9cbmZ1bmN0aW9uIF9pc0ZpcmViYXNlQXBwKG9iaikge1xuICAgIHJldHVybiBvYmoub3B0aW9ucyAhPT0gdW5kZWZpbmVkO1xufVxuLyoqXG4gKlxuICogQHBhcmFtIG9iaiAtIGFuIG9iamVjdCBvZiB0eXBlIEZpcmViYXNlQXBwLCBGaXJlYmFzZU9wdGlvbnMgb3IgRmlyZWJhc2VBcHBTZXR0aW5ncy5cbiAqXG4gKiBAcmV0dXJucyB0cnVlIGlmIHRoZSBwcm92aWRlZCBvYmplY3QgaXMgb2YgdHlwZSBGaXJlYmFzZVNlcnZlckFwcEltcGwuXG4gKlxuICogQGludGVybmFsXG4gKi9cbmZ1bmN0aW9uIF9pc0ZpcmViYXNlU2VydmVyQXBwU2V0dGluZ3Mob2JqKSB7XG4gICAgaWYgKF9pc0ZpcmViYXNlQXBwKG9iaikpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gKCdhdXRoSWRUb2tlbicgaW4gb2JqIHx8XG4gICAgICAgICdhcHBDaGVja1Rva2VuJyBpbiBvYmogfHxcbiAgICAgICAgJ3JlbGVhc2VPbkRlcmVmJyBpbiBvYmogfHxcbiAgICAgICAgJ2F1dG9tYXRpY0RhdGFDb2xsZWN0aW9uRW5hYmxlZCcgaW4gb2JqKTtcbn1cbi8qKlxuICpcbiAqIEBwYXJhbSBvYmogLSBhbiBvYmplY3Qgb2YgdHlwZSBGaXJlYmFzZUFwcC5cbiAqXG4gKiBAcmV0dXJucyB0cnVlIGlmIHRoZSBwcm92aWRlZCBvYmplY3QgaXMgb2YgdHlwZSBGaXJlYmFzZVNlcnZlckFwcEltcGwuXG4gKlxuICogQGludGVybmFsXG4gKi9cbmZ1bmN0aW9uIF9pc0ZpcmViYXNlU2VydmVyQXBwKG9iaikge1xuICAgIGlmIChvYmogPT09IG51bGwgfHwgb2JqID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gb2JqLnNldHRpbmdzICE9PSB1bmRlZmluZWQ7XG59XG4vKipcbiAqIFRlc3Qgb25seVxuICpcbiAqIEBpbnRlcm5hbFxuICovXG5mdW5jdGlvbiBfY2xlYXJDb21wb25lbnRzKCkge1xuICAgIF9jb21wb25lbnRzLmNsZWFyKCk7XG59XG5cbi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5jb25zdCBFUlJPUlMgPSB7XG4gICAgW1wibm8tYXBwXCIgLyogQXBwRXJyb3IuTk9fQVBQICovXTogXCJObyBGaXJlYmFzZSBBcHAgJ3skYXBwTmFtZX0nIGhhcyBiZWVuIGNyZWF0ZWQgLSBcIiArXG4gICAgICAgICdjYWxsIGluaXRpYWxpemVBcHAoKSBmaXJzdCcsXG4gICAgW1wiYmFkLWFwcC1uYW1lXCIgLyogQXBwRXJyb3IuQkFEX0FQUF9OQU1FICovXTogXCJJbGxlZ2FsIEFwcCBuYW1lOiAneyRhcHBOYW1lfSdcIixcbiAgICBbXCJkdXBsaWNhdGUtYXBwXCIgLyogQXBwRXJyb3IuRFVQTElDQVRFX0FQUCAqL106IFwiRmlyZWJhc2UgQXBwIG5hbWVkICd7JGFwcE5hbWV9JyBhbHJlYWR5IGV4aXN0cyB3aXRoIGRpZmZlcmVudCBvcHRpb25zIG9yIGNvbmZpZ1wiLFxuICAgIFtcImFwcC1kZWxldGVkXCIgLyogQXBwRXJyb3IuQVBQX0RFTEVURUQgKi9dOiBcIkZpcmViYXNlIEFwcCBuYW1lZCAneyRhcHBOYW1lfScgYWxyZWFkeSBkZWxldGVkXCIsXG4gICAgW1wic2VydmVyLWFwcC1kZWxldGVkXCIgLyogQXBwRXJyb3IuU0VSVkVSX0FQUF9ERUxFVEVEICovXTogJ0ZpcmViYXNlIFNlcnZlciBBcHAgaGFzIGJlZW4gZGVsZXRlZCcsXG4gICAgW1wibm8tb3B0aW9uc1wiIC8qIEFwcEVycm9yLk5PX09QVElPTlMgKi9dOiAnTmVlZCB0byBwcm92aWRlIG9wdGlvbnMsIHdoZW4gbm90IGJlaW5nIGRlcGxveWVkIHRvIGhvc3RpbmcgdmlhIHNvdXJjZS4nLFxuICAgIFtcImludmFsaWQtYXBwLWFyZ3VtZW50XCIgLyogQXBwRXJyb3IuSU5WQUxJRF9BUFBfQVJHVU1FTlQgKi9dOiAnZmlyZWJhc2UueyRhcHBOYW1lfSgpIHRha2VzIGVpdGhlciBubyBhcmd1bWVudCBvciBhICcgK1xuICAgICAgICAnRmlyZWJhc2UgQXBwIGluc3RhbmNlLicsXG4gICAgW1wiaW52YWxpZC1sb2ctYXJndW1lbnRcIiAvKiBBcHBFcnJvci5JTlZBTElEX0xPR19BUkdVTUVOVCAqL106ICdGaXJzdCBhcmd1bWVudCB0byBgb25Mb2dgIG11c3QgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLicsXG4gICAgW1wiaWRiLW9wZW5cIiAvKiBBcHBFcnJvci5JREJfT1BFTiAqL106ICdFcnJvciB0aHJvd24gd2hlbiBvcGVuaW5nIEluZGV4ZWREQi4gT3JpZ2luYWwgZXJyb3I6IHskb3JpZ2luYWxFcnJvck1lc3NhZ2V9LicsXG4gICAgW1wiaWRiLWdldFwiIC8qIEFwcEVycm9yLklEQl9HRVQgKi9dOiAnRXJyb3IgdGhyb3duIHdoZW4gcmVhZGluZyBmcm9tIEluZGV4ZWREQi4gT3JpZ2luYWwgZXJyb3I6IHskb3JpZ2luYWxFcnJvck1lc3NhZ2V9LicsXG4gICAgW1wiaWRiLXNldFwiIC8qIEFwcEVycm9yLklEQl9XUklURSAqL106ICdFcnJvciB0aHJvd24gd2hlbiB3cml0aW5nIHRvIEluZGV4ZWREQi4gT3JpZ2luYWwgZXJyb3I6IHskb3JpZ2luYWxFcnJvck1lc3NhZ2V9LicsXG4gICAgW1wiaWRiLWRlbGV0ZVwiIC8qIEFwcEVycm9yLklEQl9ERUxFVEUgKi9dOiAnRXJyb3IgdGhyb3duIHdoZW4gZGVsZXRpbmcgZnJvbSBJbmRleGVkREIuIE9yaWdpbmFsIGVycm9yOiB7JG9yaWdpbmFsRXJyb3JNZXNzYWdlfS4nLFxuICAgIFtcImZpbmFsaXphdGlvbi1yZWdpc3RyeS1ub3Qtc3VwcG9ydGVkXCIgLyogQXBwRXJyb3IuRklOQUxJWkFUSU9OX1JFR0lTVFJZX05PVF9TVVBQT1JURUQgKi9dOiAnRmlyZWJhc2VTZXJ2ZXJBcHAgZGVsZXRlT25EZXJlZiBmaWVsZCBkZWZpbmVkIGJ1dCB0aGUgSlMgcnVudGltZSBkb2VzIG5vdCBzdXBwb3J0IEZpbmFsaXphdGlvblJlZ2lzdHJ5LicsXG4gICAgW1wiaW52YWxpZC1zZXJ2ZXItYXBwLWVudmlyb25tZW50XCIgLyogQXBwRXJyb3IuSU5WQUxJRF9TRVJWRVJfQVBQX0VOVklST05NRU5UICovXTogJ0ZpcmViYXNlU2VydmVyQXBwIGlzIG5vdCBmb3IgdXNlIGluIGJyb3dzZXIgZW52aXJvbm1lbnRzLidcbn07XG5jb25zdCBFUlJPUl9GQUNUT1JZID0gbmV3IEVycm9yRmFjdG9yeSgnYXBwJywgJ0ZpcmViYXNlJywgRVJST1JTKTtcblxuLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cbmNsYXNzIEZpcmViYXNlQXBwSW1wbCB7XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucywgY29uZmlnLCBjb250YWluZXIpIHtcbiAgICAgICAgdGhpcy5faXNEZWxldGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX29wdGlvbnMgPSB7IC4uLm9wdGlvbnMgfTtcbiAgICAgICAgdGhpcy5fY29uZmlnID0geyAuLi5jb25maWcgfTtcbiAgICAgICAgdGhpcy5fbmFtZSA9IGNvbmZpZy5uYW1lO1xuICAgICAgICB0aGlzLl9hdXRvbWF0aWNEYXRhQ29sbGVjdGlvbkVuYWJsZWQgPVxuICAgICAgICAgICAgY29uZmlnLmF1dG9tYXRpY0RhdGFDb2xsZWN0aW9uRW5hYmxlZDtcbiAgICAgICAgdGhpcy5fY29udGFpbmVyID0gY29udGFpbmVyO1xuICAgICAgICB0aGlzLmNvbnRhaW5lci5hZGRDb21wb25lbnQobmV3IENvbXBvbmVudCgnYXBwJywgKCkgPT4gdGhpcywgXCJQVUJMSUNcIiAvKiBDb21wb25lbnRUeXBlLlBVQkxJQyAqLykpO1xuICAgIH1cbiAgICBnZXQgYXV0b21hdGljRGF0YUNvbGxlY3Rpb25FbmFibGVkKCkge1xuICAgICAgICB0aGlzLmNoZWNrRGVzdHJveWVkKCk7XG4gICAgICAgIHJldHVybiB0aGlzLl9hdXRvbWF0aWNEYXRhQ29sbGVjdGlvbkVuYWJsZWQ7XG4gICAgfVxuICAgIHNldCBhdXRvbWF0aWNEYXRhQ29sbGVjdGlvbkVuYWJsZWQodmFsKSB7XG4gICAgICAgIHRoaXMuY2hlY2tEZXN0cm95ZWQoKTtcbiAgICAgICAgdGhpcy5fYXV0b21hdGljRGF0YUNvbGxlY3Rpb25FbmFibGVkID0gdmFsO1xuICAgIH1cbiAgICBnZXQgbmFtZSgpIHtcbiAgICAgICAgdGhpcy5jaGVja0Rlc3Ryb3llZCgpO1xuICAgICAgICByZXR1cm4gdGhpcy5fbmFtZTtcbiAgICB9XG4gICAgZ2V0IG9wdGlvbnMoKSB7XG4gICAgICAgIHRoaXMuY2hlY2tEZXN0cm95ZWQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX29wdGlvbnM7XG4gICAgfVxuICAgIGdldCBjb25maWcoKSB7XG4gICAgICAgIHRoaXMuY2hlY2tEZXN0cm95ZWQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbmZpZztcbiAgICB9XG4gICAgZ2V0IGNvbnRhaW5lcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnRhaW5lcjtcbiAgICB9XG4gICAgZ2V0IGlzRGVsZXRlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzRGVsZXRlZDtcbiAgICB9XG4gICAgc2V0IGlzRGVsZXRlZCh2YWwpIHtcbiAgICAgICAgdGhpcy5faXNEZWxldGVkID0gdmFsO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIHdpbGwgdGhyb3cgYW4gRXJyb3IgaWYgdGhlIEFwcCBoYXMgYWxyZWFkeSBiZWVuIGRlbGV0ZWQgLVxuICAgICAqIHVzZSBiZWZvcmUgcGVyZm9ybWluZyBBUEkgYWN0aW9ucyBvbiB0aGUgQXBwLlxuICAgICAqL1xuICAgIGNoZWNrRGVzdHJveWVkKCkge1xuICAgICAgICBpZiAodGhpcy5pc0RlbGV0ZWQpIHtcbiAgICAgICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwiYXBwLWRlbGV0ZWRcIiAvKiBBcHBFcnJvci5BUFBfREVMRVRFRCAqLywgeyBhcHBOYW1lOiB0aGlzLl9uYW1lIH0pO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMyBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuLy8gUGFyc2UgdGhlIHRva2VuIGFuZCBjaGVjayB0byBzZWUgaWYgdGhlIGBleHBgIGNsYWltIGlzIGluIHRoZSBmdXR1cmUuXG4vLyBSZXBvcnRzIGFuIGVycm9yIHRvIHRoZSBjb25zb2xlIGlmIHRoZSB0b2tlbiBvciBjbGFpbSBjb3VsZCBub3QgYmUgcGFyc2VkLCBvciBpZiBgZXhwYCBpcyBpblxuLy8gdGhlIHBhc3QuXG5mdW5jdGlvbiB2YWxpZGF0ZVRva2VuVFRMKGJhc2U2NFRva2VuLCB0b2tlbk5hbWUpIHtcbiAgICBjb25zdCBzZWNvbmRQYXJ0ID0gYmFzZTY0RGVjb2RlKGJhc2U2NFRva2VuLnNwbGl0KCcuJylbMV0pO1xuICAgIGlmIChzZWNvbmRQYXJ0ID09PSBudWxsKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYEZpcmViYXNlU2VydmVyQXBwICR7dG9rZW5OYW1lfSBpcyBpbnZhbGlkOiBzZWNvbmQgcGFydCBjb3VsZCBub3QgYmUgcGFyc2VkLmApO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGV4cENsYWltID0gSlNPTi5wYXJzZShzZWNvbmRQYXJ0KS5leHA7XG4gICAgaWYgKGV4cENsYWltID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihgRmlyZWJhc2VTZXJ2ZXJBcHAgJHt0b2tlbk5hbWV9IGlzIGludmFsaWQ6IGV4cGlyYXRpb24gY2xhaW0gY291bGQgbm90IGJlIHBhcnNlZGApO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGV4cCA9IEpTT04ucGFyc2Uoc2Vjb25kUGFydCkuZXhwICogMTAwMDtcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICBjb25zdCBkaWZmID0gZXhwIC0gbm93O1xuICAgIGlmIChkaWZmIDw9IDApIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihgRmlyZWJhc2VTZXJ2ZXJBcHAgJHt0b2tlbk5hbWV9IGlzIGludmFsaWQ6IHRoZSB0b2tlbiBoYXMgZXhwaXJlZC5gKTtcbiAgICB9XG59XG5jbGFzcyBGaXJlYmFzZVNlcnZlckFwcEltcGwgZXh0ZW5kcyBGaXJlYmFzZUFwcEltcGwge1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMsIHNlcnZlckNvbmZpZywgbmFtZSwgY29udGFpbmVyKSB7XG4gICAgICAgIC8vIEJ1aWxkIGNvbmZpZ3VyYXRpb24gcGFyYW1ldGVycyBmb3IgdGhlIEZpcmViYXNlQXBwSW1wbCBiYXNlIGNsYXNzLlxuICAgICAgICBjb25zdCBhdXRvbWF0aWNEYXRhQ29sbGVjdGlvbkVuYWJsZWQgPSBzZXJ2ZXJDb25maWcuYXV0b21hdGljRGF0YUNvbGxlY3Rpb25FbmFibGVkICE9PSB1bmRlZmluZWRcbiAgICAgICAgICAgID8gc2VydmVyQ29uZmlnLmF1dG9tYXRpY0RhdGFDb2xsZWN0aW9uRW5hYmxlZFxuICAgICAgICAgICAgOiB0cnVlO1xuICAgICAgICAvLyBDcmVhdGUgdGhlIEZpcmViYXNlQXBwU2V0dGluZ3Mgb2JqZWN0IGZvciB0aGUgRmlyZWJhc2VBcHBJbXAgY29uc3RydWN0b3IuXG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IHtcbiAgICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgICBhdXRvbWF0aWNEYXRhQ29sbGVjdGlvbkVuYWJsZWRcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKG9wdGlvbnMuYXBpS2V5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIC8vIENvbnN0cnVjdCB0aGUgcGFyZW50IEZpcmViYXNlQXBwSW1wIG9iamVjdC5cbiAgICAgICAgICAgIHN1cGVyKG9wdGlvbnMsIGNvbmZpZywgY29udGFpbmVyKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGFwcEltcGwgPSBvcHRpb25zO1xuICAgICAgICAgICAgc3VwZXIoYXBwSW1wbC5vcHRpb25zLCBjb25maWcsIGNvbnRhaW5lcik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gTm93IGNvbnN0cnVjdCB0aGUgZGF0YSBmb3IgdGhlIEZpcmViYXNlU2VydmVyQXBwSW1wbC5cbiAgICAgICAgdGhpcy5fc2VydmVyQ29uZmlnID0ge1xuICAgICAgICAgICAgYXV0b21hdGljRGF0YUNvbGxlY3Rpb25FbmFibGVkLFxuICAgICAgICAgICAgLi4uc2VydmVyQ29uZmlnXG4gICAgICAgIH07XG4gICAgICAgIC8vIEVuc3VyZSB0aGF0IHRoZSBjdXJyZW50IHRpbWUgaXMgd2l0aGluIHRoZSBgYXV0aElkdG9rZW5gIHdpbmRvdyBvZiB2YWxpZGl0eS5cbiAgICAgICAgaWYgKHRoaXMuX3NlcnZlckNvbmZpZy5hdXRoSWRUb2tlbikge1xuICAgICAgICAgICAgdmFsaWRhdGVUb2tlblRUTCh0aGlzLl9zZXJ2ZXJDb25maWcuYXV0aElkVG9rZW4sICdhdXRoSWRUb2tlbicpO1xuICAgICAgICB9XG4gICAgICAgIC8vIEVuc3VyZSB0aGF0IHRoZSBjdXJyZW50IHRpbWUgaXMgd2l0aGluIHRoZSBgYXBwQ2hlY2tUb2tlbmAgd2luZG93IG9mIHZhbGlkaXR5LlxuICAgICAgICBpZiAodGhpcy5fc2VydmVyQ29uZmlnLmFwcENoZWNrVG9rZW4pIHtcbiAgICAgICAgICAgIHZhbGlkYXRlVG9rZW5UVEwodGhpcy5fc2VydmVyQ29uZmlnLmFwcENoZWNrVG9rZW4sICdhcHBDaGVja1Rva2VuJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fZmluYWxpemF0aW9uUmVnaXN0cnkgPSBudWxsO1xuICAgICAgICBpZiAodHlwZW9mIEZpbmFsaXphdGlvblJlZ2lzdHJ5ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdGhpcy5fZmluYWxpemF0aW9uUmVnaXN0cnkgPSBuZXcgRmluYWxpemF0aW9uUmVnaXN0cnkoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYXV0b21hdGljQ2xlYW51cCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fcmVmQ291bnQgPSAwO1xuICAgICAgICB0aGlzLmluY1JlZkNvdW50KHRoaXMuX3NlcnZlckNvbmZpZy5yZWxlYXNlT25EZXJlZik7XG4gICAgICAgIC8vIERvIG5vdCByZXRhaW4gYSBoYXJkIHJlZmVyZW5jZSB0byB0aGUgZHJlZiBvYmplY3QsIG90aGVyd2lzZSB0aGUgRmluYWxpemF0aW9uUmVnaXN0cnlcbiAgICAgICAgLy8gd2lsbCBuZXZlciB0cmlnZ2VyLlxuICAgICAgICB0aGlzLl9zZXJ2ZXJDb25maWcucmVsZWFzZU9uRGVyZWYgPSB1bmRlZmluZWQ7XG4gICAgICAgIHNlcnZlckNvbmZpZy5yZWxlYXNlT25EZXJlZiA9IHVuZGVmaW5lZDtcbiAgICAgICAgcmVnaXN0ZXJWZXJzaW9uKG5hbWUkcSwgdmVyc2lvbiQxLCAnc2VydmVyYXBwJyk7XG4gICAgfVxuICAgIHRvSlNPTigpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgZ2V0IHJlZkNvdW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcmVmQ291bnQ7XG4gICAgfVxuICAgIC8vIEluY3JlbWVudCB0aGUgcmVmZXJlbmNlIGNvdW50IG9mIHRoaXMgc2VydmVyIGFwcC4gSWYgYW4gb2JqZWN0IGlzIHByb3ZpZGVkLCByZWdpc3RlciBpdFxuICAgIC8vIHdpdGggdGhlIGZpbmFsaXphdGlvbiByZWdpc3RyeS5cbiAgICBpbmNSZWZDb3VudChvYmopIHtcbiAgICAgICAgaWYgKHRoaXMuaXNEZWxldGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fcmVmQ291bnQrKztcbiAgICAgICAgaWYgKG9iaiAhPT0gdW5kZWZpbmVkICYmIHRoaXMuX2ZpbmFsaXphdGlvblJlZ2lzdHJ5ICE9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLl9maW5hbGl6YXRpb25SZWdpc3RyeS5yZWdpc3RlcihvYmosIHRoaXMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIERlY3JlbWVudCB0aGUgcmVmZXJlbmNlIGNvdW50LlxuICAgIGRlY1JlZkNvdW50KCkge1xuICAgICAgICBpZiAodGhpcy5pc0RlbGV0ZWQpIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAtLXRoaXMuX3JlZkNvdW50O1xuICAgIH1cbiAgICAvLyBJbnZva2VkIGJ5IHRoZSBGaW5hbGl6YXRpb25SZWdpc3RyeSBjYWxsYmFjayB0byBub3RlIHRoYXQgdGhpcyBhcHAgc2hvdWxkIGdvIHRocm91Z2ggaXRzXG4gICAgLy8gcmVmZXJlbmNlIGNvdW50cyBhbmQgZGVsZXRlIGl0c2VsZiBpZiBubyByZWZlcmVuY2UgY291bnQgcmVtYWluLiBUaGUgY29vcmRpbmF0aW5nIGxvZ2ljIHRoYXRcbiAgICAvLyBoYW5kbGVzIHRoaXMgaXMgaW4gZGVsZXRlQXBwKC4uLikuXG4gICAgYXV0b21hdGljQ2xlYW51cCgpIHtcbiAgICAgICAgdm9pZCBkZWxldGVBcHAodGhpcyk7XG4gICAgfVxuICAgIGdldCBzZXR0aW5ncygpIHtcbiAgICAgICAgdGhpcy5jaGVja0Rlc3Ryb3llZCgpO1xuICAgICAgICByZXR1cm4gdGhpcy5fc2VydmVyQ29uZmlnO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIHdpbGwgdGhyb3cgYW4gRXJyb3IgaWYgdGhlIEFwcCBoYXMgYWxyZWFkeSBiZWVuIGRlbGV0ZWQgLVxuICAgICAqIHVzZSBiZWZvcmUgcGVyZm9ybWluZyBBUEkgYWN0aW9ucyBvbiB0aGUgQXBwLlxuICAgICAqL1xuICAgIGNoZWNrRGVzdHJveWVkKCkge1xuICAgICAgICBpZiAodGhpcy5pc0RlbGV0ZWQpIHtcbiAgICAgICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwic2VydmVyLWFwcC1kZWxldGVkXCIgLyogQXBwRXJyb3IuU0VSVkVSX0FQUF9ERUxFVEVEICovKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cbi8qKlxuICogVGhlIGN1cnJlbnQgU0RLIHZlcnNpb24uXG4gKlxuICogQHB1YmxpY1xuICovXG5jb25zdCBTREtfVkVSU0lPTiA9IHZlcnNpb247XG5mdW5jdGlvbiBpbml0aWFsaXplQXBwKF9vcHRpb25zLCByYXdDb25maWcgPSB7fSkge1xuICAgIGxldCBvcHRpb25zID0gX29wdGlvbnM7XG4gICAgaWYgKHR5cGVvZiByYXdDb25maWcgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGNvbnN0IG5hbWUgPSByYXdDb25maWc7XG4gICAgICAgIHJhd0NvbmZpZyA9IHsgbmFtZSB9O1xuICAgIH1cbiAgICBjb25zdCBjb25maWcgPSB7XG4gICAgICAgIG5hbWU6IERFRkFVTFRfRU5UUllfTkFNRSxcbiAgICAgICAgYXV0b21hdGljRGF0YUNvbGxlY3Rpb25FbmFibGVkOiB0cnVlLFxuICAgICAgICAuLi5yYXdDb25maWdcbiAgICB9O1xuICAgIGNvbnN0IG5hbWUgPSBjb25maWcubmFtZTtcbiAgICBpZiAodHlwZW9mIG5hbWUgIT09ICdzdHJpbmcnIHx8ICFuYW1lKSB7XG4gICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwiYmFkLWFwcC1uYW1lXCIgLyogQXBwRXJyb3IuQkFEX0FQUF9OQU1FICovLCB7XG4gICAgICAgICAgICBhcHBOYW1lOiBTdHJpbmcobmFtZSlcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIG9wdGlvbnMgfHwgKG9wdGlvbnMgPSBnZXREZWZhdWx0QXBwQ29uZmlnKCkpO1xuICAgIGlmICghb3B0aW9ucykge1xuICAgICAgICB0aHJvdyBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcIm5vLW9wdGlvbnNcIiAvKiBBcHBFcnJvci5OT19PUFRJT05TICovKTtcbiAgICB9XG4gICAgY29uc3QgZXhpc3RpbmdBcHAgPSBfYXBwcy5nZXQobmFtZSk7XG4gICAgaWYgKGV4aXN0aW5nQXBwKSB7XG4gICAgICAgIC8vIHJldHVybiB0aGUgZXhpc3RpbmcgYXBwIGlmIG9wdGlvbnMgYW5kIGNvbmZpZyBkZWVwIGVxdWFsIHRoZSBvbmVzIGluIHRoZSBleGlzdGluZyBhcHAuXG4gICAgICAgIGlmIChkZWVwRXF1YWwob3B0aW9ucywgZXhpc3RpbmdBcHAub3B0aW9ucykgJiZcbiAgICAgICAgICAgIGRlZXBFcXVhbChjb25maWcsIGV4aXN0aW5nQXBwLmNvbmZpZykpIHtcbiAgICAgICAgICAgIHJldHVybiBleGlzdGluZ0FwcDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwiZHVwbGljYXRlLWFwcFwiIC8qIEFwcEVycm9yLkRVUExJQ0FURV9BUFAgKi8sIHsgYXBwTmFtZTogbmFtZSB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBjb250YWluZXIgPSBuZXcgQ29tcG9uZW50Q29udGFpbmVyKG5hbWUpO1xuICAgIGZvciAoY29uc3QgY29tcG9uZW50IG9mIF9jb21wb25lbnRzLnZhbHVlcygpKSB7XG4gICAgICAgIGNvbnRhaW5lci5hZGRDb21wb25lbnQoY29tcG9uZW50KTtcbiAgICB9XG4gICAgY29uc3QgbmV3QXBwID0gbmV3IEZpcmViYXNlQXBwSW1wbChvcHRpb25zLCBjb25maWcsIGNvbnRhaW5lcik7XG4gICAgX2FwcHMuc2V0KG5hbWUsIG5ld0FwcCk7XG4gICAgcmV0dXJuIG5ld0FwcDtcbn1cbmZ1bmN0aW9uIGluaXRpYWxpemVTZXJ2ZXJBcHAoX29wdGlvbnMsIF9zZXJ2ZXJBcHBDb25maWcgPSB7fSkge1xuICAgIGlmIChpc0Jyb3dzZXIoKSAmJiAhaXNXZWJXb3JrZXIoKSkge1xuICAgICAgICAvLyBGaXJlYmFzZVNlcnZlckFwcCBpc24ndCBkZXNpZ25lZCB0byBiZSBydW4gaW4gYnJvd3NlcnMuXG4gICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwiaW52YWxpZC1zZXJ2ZXItYXBwLWVudmlyb25tZW50XCIgLyogQXBwRXJyb3IuSU5WQUxJRF9TRVJWRVJfQVBQX0VOVklST05NRU5UICovKTtcbiAgICB9XG4gICAgbGV0IGZpcmViYXNlT3B0aW9ucztcbiAgICBsZXQgc2VydmVyQXBwU2V0dGluZ3MgPSBfc2VydmVyQXBwQ29uZmlnIHx8IHt9O1xuICAgIGlmIChfb3B0aW9ucykge1xuICAgICAgICBpZiAoX2lzRmlyZWJhc2VBcHAoX29wdGlvbnMpKSB7XG4gICAgICAgICAgICBmaXJlYmFzZU9wdGlvbnMgPSBfb3B0aW9ucy5vcHRpb25zO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKF9pc0ZpcmViYXNlU2VydmVyQXBwU2V0dGluZ3MoX29wdGlvbnMpKSB7XG4gICAgICAgICAgICBzZXJ2ZXJBcHBTZXR0aW5ncyA9IF9vcHRpb25zO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZmlyZWJhc2VPcHRpb25zID0gX29wdGlvbnM7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKHNlcnZlckFwcFNldHRpbmdzLmF1dG9tYXRpY0RhdGFDb2xsZWN0aW9uRW5hYmxlZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHNlcnZlckFwcFNldHRpbmdzLmF1dG9tYXRpY0RhdGFDb2xsZWN0aW9uRW5hYmxlZCA9IHRydWU7XG4gICAgfVxuICAgIGZpcmViYXNlT3B0aW9ucyB8fCAoZmlyZWJhc2VPcHRpb25zID0gZ2V0RGVmYXVsdEFwcENvbmZpZygpKTtcbiAgICBpZiAoIWZpcmViYXNlT3B0aW9ucykge1xuICAgICAgICB0aHJvdyBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcIm5vLW9wdGlvbnNcIiAvKiBBcHBFcnJvci5OT19PUFRJT05TICovKTtcbiAgICB9XG4gICAgLy8gQnVpbGQgYW4gYXBwIG5hbWUgYmFzZWQgb24gYSBoYXNoIG9mIHRoZSBjb25maWd1cmF0aW9uIG9wdGlvbnMuXG4gICAgY29uc3QgbmFtZU9iaiA9IHtcbiAgICAgICAgLi4uc2VydmVyQXBwU2V0dGluZ3MsXG4gICAgICAgIC4uLmZpcmViYXNlT3B0aW9uc1xuICAgIH07XG4gICAgLy8gSG93ZXZlciwgRG8gbm90IG1hbmdsZSB0aGUgbmFtZSBiYXNlZCBvbiByZWxlYXNlT25EZXJlZiwgc2luY2UgaXQgd2lsbCB2YXJ5IGJldHdlZW4gdGhlXG4gICAgLy8gY29uc3RydWN0aW9uIG9mIEZpcmViYXNlU2VydmVyQXBwIGluc3RhbmNlcy4gRm9yIGV4YW1wbGUsIGlmIHRoZSBvYmplY3QgaXMgdGhlIHJlcXVlc3QgaGVhZGVycy5cbiAgICBpZiAobmFtZU9iai5yZWxlYXNlT25EZXJlZiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGRlbGV0ZSBuYW1lT2JqLnJlbGVhc2VPbkRlcmVmO1xuICAgIH1cbiAgICBjb25zdCBoYXNoQ29kZSA9IChzKSA9PiB7XG4gICAgICAgIHJldHVybiBbLi4uc10ucmVkdWNlKChoYXNoLCBjKSA9PiAoTWF0aC5pbXVsKDMxLCBoYXNoKSArIGMuY2hhckNvZGVBdCgwKSkgfCAwLCAwKTtcbiAgICB9O1xuICAgIGlmIChzZXJ2ZXJBcHBTZXR0aW5ncy5yZWxlYXNlT25EZXJlZiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmICh0eXBlb2YgRmluYWxpemF0aW9uUmVnaXN0cnkgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0aHJvdyBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcImZpbmFsaXphdGlvbi1yZWdpc3RyeS1ub3Qtc3VwcG9ydGVkXCIgLyogQXBwRXJyb3IuRklOQUxJWkFUSU9OX1JFR0lTVFJZX05PVF9TVVBQT1JURUQgKi8sIHt9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBuYW1lU3RyaW5nID0gJycgKyBoYXNoQ29kZShKU09OLnN0cmluZ2lmeShuYW1lT2JqKSk7XG4gICAgY29uc3QgZXhpc3RpbmdBcHAgPSBfc2VydmVyQXBwcy5nZXQobmFtZVN0cmluZyk7XG4gICAgaWYgKGV4aXN0aW5nQXBwKSB7XG4gICAgICAgIGV4aXN0aW5nQXBwLmluY1JlZkNvdW50KHNlcnZlckFwcFNldHRpbmdzLnJlbGVhc2VPbkRlcmVmKTtcbiAgICAgICAgcmV0dXJuIGV4aXN0aW5nQXBwO1xuICAgIH1cbiAgICBjb25zdCBjb250YWluZXIgPSBuZXcgQ29tcG9uZW50Q29udGFpbmVyKG5hbWVTdHJpbmcpO1xuICAgIGZvciAoY29uc3QgY29tcG9uZW50IG9mIF9jb21wb25lbnRzLnZhbHVlcygpKSB7XG4gICAgICAgIGNvbnRhaW5lci5hZGRDb21wb25lbnQoY29tcG9uZW50KTtcbiAgICB9XG4gICAgY29uc3QgbmV3QXBwID0gbmV3IEZpcmViYXNlU2VydmVyQXBwSW1wbChmaXJlYmFzZU9wdGlvbnMsIHNlcnZlckFwcFNldHRpbmdzLCBuYW1lU3RyaW5nLCBjb250YWluZXIpO1xuICAgIF9zZXJ2ZXJBcHBzLnNldChuYW1lU3RyaW5nLCBuZXdBcHApO1xuICAgIHJldHVybiBuZXdBcHA7XG59XG4vKipcbiAqIFJldHJpZXZlcyBhIHtAbGluayBAZmlyZWJhc2UvYXBwI0ZpcmViYXNlQXBwfSBpbnN0YW5jZS5cbiAqXG4gKiBXaGVuIGNhbGxlZCB3aXRoIG5vIGFyZ3VtZW50cywgdGhlIGRlZmF1bHQgYXBwIGlzIHJldHVybmVkLiBXaGVuIGFuIGFwcCBuYW1lXG4gKiBpcyBwcm92aWRlZCwgdGhlIGFwcCBjb3JyZXNwb25kaW5nIHRvIHRoYXQgbmFtZSBpcyByZXR1cm5lZC5cbiAqXG4gKiBBbiBleGNlcHRpb24gaXMgdGhyb3duIGlmIHRoZSBhcHAgYmVpbmcgcmV0cmlldmVkIGhhcyBub3QgeWV0IGJlZW5cbiAqIGluaXRpYWxpemVkLlxuICpcbiAqIEBleGFtcGxlXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiAvLyBSZXR1cm4gdGhlIGRlZmF1bHQgYXBwXG4gKiBjb25zdCBhcHAgPSBnZXRBcHAoKTtcbiAqIGBgYFxuICpcbiAqIEBleGFtcGxlXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiAvLyBSZXR1cm4gYSBuYW1lZCBhcHBcbiAqIGNvbnN0IG90aGVyQXBwID0gZ2V0QXBwKFwib3RoZXJBcHBcIik7XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0gbmFtZSAtIE9wdGlvbmFsIG5hbWUgb2YgdGhlIGFwcCB0byByZXR1cm4uIElmIG5vIG5hbWUgaXNcbiAqICAgcHJvdmlkZWQsIHRoZSBkZWZhdWx0IGlzIGBcIltERUZBVUxUXVwiYC5cbiAqXG4gKiBAcmV0dXJucyBUaGUgYXBwIGNvcnJlc3BvbmRpbmcgdG8gdGhlIHByb3ZpZGVkIGFwcCBuYW1lLlxuICogICBJZiBubyBhcHAgbmFtZSBpcyBwcm92aWRlZCwgdGhlIGRlZmF1bHQgYXBwIGlzIHJldHVybmVkLlxuICpcbiAqIEBwdWJsaWNcbiAqL1xuZnVuY3Rpb24gZ2V0QXBwKG5hbWUgPSBERUZBVUxUX0VOVFJZX05BTUUpIHtcbiAgICBjb25zdCBhcHAgPSBfYXBwcy5nZXQobmFtZSk7XG4gICAgaWYgKCFhcHAgJiYgbmFtZSA9PT0gREVGQVVMVF9FTlRSWV9OQU1FICYmIGdldERlZmF1bHRBcHBDb25maWcoKSkge1xuICAgICAgICByZXR1cm4gaW5pdGlhbGl6ZUFwcCgpO1xuICAgIH1cbiAgICBpZiAoIWFwcCkge1xuICAgICAgICB0aHJvdyBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcIm5vLWFwcFwiIC8qIEFwcEVycm9yLk5PX0FQUCAqLywgeyBhcHBOYW1lOiBuYW1lIH0pO1xuICAgIH1cbiAgICByZXR1cm4gYXBwO1xufVxuLyoqXG4gKiBBIChyZWFkLW9ubHkpIGFycmF5IG9mIGFsbCBpbml0aWFsaXplZCBhcHBzLlxuICogQHB1YmxpY1xuICovXG5mdW5jdGlvbiBnZXRBcHBzKCkge1xuICAgIHJldHVybiBBcnJheS5mcm9tKF9hcHBzLnZhbHVlcygpKTtcbn1cbi8qKlxuICogUmVuZGVycyB0aGlzIGFwcCB1bnVzYWJsZSBhbmQgZnJlZXMgdGhlIHJlc291cmNlcyBvZiBhbGwgYXNzb2NpYXRlZFxuICogc2VydmljZXMuXG4gKlxuICogQGV4YW1wbGVcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGRlbGV0ZUFwcChhcHApXG4gKiAgIC50aGVuKGZ1bmN0aW9uKCkge1xuICogICAgIGNvbnNvbGUubG9nKFwiQXBwIGRlbGV0ZWQgc3VjY2Vzc2Z1bGx5XCIpO1xuICogICB9KVxuICogICAuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHtcbiAqICAgICBjb25zb2xlLmxvZyhcIkVycm9yIGRlbGV0aW5nIGFwcDpcIiwgZXJyb3IpO1xuICogICB9KTtcbiAqIGBgYFxuICpcbiAqIEBwdWJsaWNcbiAqL1xuYXN5bmMgZnVuY3Rpb24gZGVsZXRlQXBwKGFwcCkge1xuICAgIGxldCBjbGVhbnVwUHJvdmlkZXJzID0gZmFsc2U7XG4gICAgY29uc3QgbmFtZSA9IGFwcC5uYW1lO1xuICAgIGlmIChfYXBwcy5oYXMobmFtZSkpIHtcbiAgICAgICAgY2xlYW51cFByb3ZpZGVycyA9IHRydWU7XG4gICAgICAgIF9hcHBzLmRlbGV0ZShuYW1lKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoX3NlcnZlckFwcHMuaGFzKG5hbWUpKSB7XG4gICAgICAgIGNvbnN0IGZpcmViYXNlU2VydmVyQXBwID0gYXBwO1xuICAgICAgICBpZiAoZmlyZWJhc2VTZXJ2ZXJBcHAuZGVjUmVmQ291bnQoKSA8PSAwKSB7XG4gICAgICAgICAgICBfc2VydmVyQXBwcy5kZWxldGUobmFtZSk7XG4gICAgICAgICAgICBjbGVhbnVwUHJvdmlkZXJzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoY2xlYW51cFByb3ZpZGVycykge1xuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChhcHAuY29udGFpbmVyXG4gICAgICAgICAgICAuZ2V0UHJvdmlkZXJzKClcbiAgICAgICAgICAgIC5tYXAocHJvdmlkZXIgPT4gcHJvdmlkZXIuZGVsZXRlKCkpKTtcbiAgICAgICAgYXBwLmlzRGVsZXRlZCA9IHRydWU7XG4gICAgfVxufVxuLyoqXG4gKiBSZWdpc3RlcnMgYSBsaWJyYXJ5J3MgbmFtZSBhbmQgdmVyc2lvbiBmb3IgcGxhdGZvcm0gbG9nZ2luZyBwdXJwb3Nlcy5cbiAqIEBwYXJhbSBsaWJyYXJ5IC0gTmFtZSBvZiAxcCBvciAzcCBsaWJyYXJ5IChlLmcuIGZpcmVzdG9yZSwgYW5ndWxhcmZpcmUpXG4gKiBAcGFyYW0gdmVyc2lvbiAtIEN1cnJlbnQgdmVyc2lvbiBvZiB0aGF0IGxpYnJhcnkuXG4gKiBAcGFyYW0gdmFyaWFudCAtIEJ1bmRsZSB2YXJpYW50LCBlLmcuLCBub2RlLCBybiwgZXRjLlxuICpcbiAqIEBwdWJsaWNcbiAqL1xuZnVuY3Rpb24gcmVnaXN0ZXJWZXJzaW9uKGxpYnJhcnlLZXlPck5hbWUsIHZlcnNpb24sIHZhcmlhbnQpIHtcbiAgICAvLyBUT0RPOiBXZSBjYW4gdXNlIHRoaXMgY2hlY2sgdG8gd2hpdGVsaXN0IHN0cmluZ3Mgd2hlbi9pZiB3ZSBzZXQgdXBcbiAgICAvLyBhIGdvb2Qgd2hpdGVsaXN0IHN5c3RlbS5cbiAgICBsZXQgbGlicmFyeSA9IFBMQVRGT1JNX0xPR19TVFJJTkdbbGlicmFyeUtleU9yTmFtZV0gPz8gbGlicmFyeUtleU9yTmFtZTtcbiAgICBpZiAodmFyaWFudCkge1xuICAgICAgICBsaWJyYXJ5ICs9IGAtJHt2YXJpYW50fWA7XG4gICAgfVxuICAgIGNvbnN0IGxpYnJhcnlNaXNtYXRjaCA9IGxpYnJhcnkubWF0Y2goL1xcc3xcXC8vKTtcbiAgICBjb25zdCB2ZXJzaW9uTWlzbWF0Y2ggPSB2ZXJzaW9uLm1hdGNoKC9cXHN8XFwvLyk7XG4gICAgaWYgKGxpYnJhcnlNaXNtYXRjaCB8fCB2ZXJzaW9uTWlzbWF0Y2gpIHtcbiAgICAgICAgY29uc3Qgd2FybmluZyA9IFtcbiAgICAgICAgICAgIGBVbmFibGUgdG8gcmVnaXN0ZXIgbGlicmFyeSBcIiR7bGlicmFyeX1cIiB3aXRoIHZlcnNpb24gXCIke3ZlcnNpb259XCI6YFxuICAgICAgICBdO1xuICAgICAgICBpZiAobGlicmFyeU1pc21hdGNoKSB7XG4gICAgICAgICAgICB3YXJuaW5nLnB1c2goYGxpYnJhcnkgbmFtZSBcIiR7bGlicmFyeX1cIiBjb250YWlucyBpbGxlZ2FsIGNoYXJhY3RlcnMgKHdoaXRlc3BhY2Ugb3IgXCIvXCIpYCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxpYnJhcnlNaXNtYXRjaCAmJiB2ZXJzaW9uTWlzbWF0Y2gpIHtcbiAgICAgICAgICAgIHdhcm5pbmcucHVzaCgnYW5kJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZlcnNpb25NaXNtYXRjaCkge1xuICAgICAgICAgICAgd2FybmluZy5wdXNoKGB2ZXJzaW9uIG5hbWUgXCIke3ZlcnNpb259XCIgY29udGFpbnMgaWxsZWdhbCBjaGFyYWN0ZXJzICh3aGl0ZXNwYWNlIG9yIFwiL1wiKWApO1xuICAgICAgICB9XG4gICAgICAgIGxvZ2dlci53YXJuKHdhcm5pbmcuam9pbignICcpKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBfcmVnaXN0ZXJDb21wb25lbnQobmV3IENvbXBvbmVudChgJHtsaWJyYXJ5fS12ZXJzaW9uYCwgKCkgPT4gKHsgbGlicmFyeSwgdmVyc2lvbiB9KSwgXCJWRVJTSU9OXCIgLyogQ29tcG9uZW50VHlwZS5WRVJTSU9OICovKSk7XG59XG4vKipcbiAqIFNldHMgbG9nIGhhbmRsZXIgZm9yIGFsbCBGaXJlYmFzZSBTREtzLlxuICogQHBhcmFtIGxvZ0NhbGxiYWNrIC0gQW4gb3B0aW9uYWwgY3VzdG9tIGxvZyBoYW5kbGVyIHRoYXQgZXhlY3V0ZXMgdXNlciBjb2RlIHdoZW5ldmVyXG4gKiB0aGUgRmlyZWJhc2UgU0RLIG1ha2VzIGEgbG9nZ2luZyBjYWxsLlxuICpcbiAqIEBwdWJsaWNcbiAqL1xuZnVuY3Rpb24gb25Mb2cobG9nQ2FsbGJhY2ssIG9wdGlvbnMpIHtcbiAgICBpZiAobG9nQ2FsbGJhY2sgIT09IG51bGwgJiYgdHlwZW9mIGxvZ0NhbGxiYWNrICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwiaW52YWxpZC1sb2ctYXJndW1lbnRcIiAvKiBBcHBFcnJvci5JTlZBTElEX0xPR19BUkdVTUVOVCAqLyk7XG4gICAgfVxuICAgIHNldFVzZXJMb2dIYW5kbGVyKGxvZ0NhbGxiYWNrLCBvcHRpb25zKTtcbn1cbi8qKlxuICogU2V0cyBsb2cgbGV2ZWwgZm9yIGFsbCBGaXJlYmFzZSBTREtzLlxuICpcbiAqIEFsbCBvZiB0aGUgbG9nIHR5cGVzIGFib3ZlIHRoZSBjdXJyZW50IGxvZyBsZXZlbCBhcmUgY2FwdHVyZWQgKGkuZS4gaWZcbiAqIHlvdSBzZXQgdGhlIGxvZyBsZXZlbCB0byBgaW5mb2AsIGVycm9ycyBhcmUgbG9nZ2VkLCBidXQgYGRlYnVnYCBhbmRcbiAqIGB2ZXJib3NlYCBsb2dzIGFyZSBub3QpLlxuICpcbiAqIEBwdWJsaWNcbiAqL1xuZnVuY3Rpb24gc2V0TG9nTGV2ZWwobG9nTGV2ZWwpIHtcbiAgICBzZXRMb2dMZXZlbCQxKGxvZ0xldmVsKTtcbn1cblxuLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjEgR29vZ2xlIExMQ1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cbmNvbnN0IERCX05BTUUgPSAnZmlyZWJhc2UtaGVhcnRiZWF0LWRhdGFiYXNlJztcbmNvbnN0IERCX1ZFUlNJT04gPSAxO1xuY29uc3QgU1RPUkVfTkFNRSA9ICdmaXJlYmFzZS1oZWFydGJlYXQtc3RvcmUnO1xubGV0IGRiUHJvbWlzZSA9IG51bGw7XG5mdW5jdGlvbiBnZXREYlByb21pc2UoKSB7XG4gICAgaWYgKCFkYlByb21pc2UpIHtcbiAgICAgICAgZGJQcm9taXNlID0gb3BlbkRCKERCX05BTUUsIERCX1ZFUlNJT04sIHtcbiAgICAgICAgICAgIHVwZ3JhZGU6IChkYiwgb2xkVmVyc2lvbikgPT4ge1xuICAgICAgICAgICAgICAgIC8vIFdlIGRvbid0IHVzZSAnYnJlYWsnIGluIHRoaXMgc3dpdGNoIHN0YXRlbWVudCwgdGhlIGZhbGwtdGhyb3VnaFxuICAgICAgICAgICAgICAgIC8vIGJlaGF2aW9yIGlzIHdoYXQgd2Ugd2FudCwgYmVjYXVzZSBpZiB0aGVyZSBhcmUgbXVsdGlwbGUgdmVyc2lvbnMgYmV0d2VlblxuICAgICAgICAgICAgICAgIC8vIHRoZSBvbGQgdmVyc2lvbiBhbmQgdGhlIGN1cnJlbnQgdmVyc2lvbiwgd2Ugd2FudCBBTEwgdGhlIG1pZ3JhdGlvbnNcbiAgICAgICAgICAgICAgICAvLyB0aGF0IGNvcnJlc3BvbmQgdG8gdGhvc2UgdmVyc2lvbnMgdG8gcnVuLCBub3Qgb25seSB0aGUgbGFzdCBvbmUuXG4gICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGRlZmF1bHQtY2FzZVxuICAgICAgICAgICAgICAgIHN3aXRjaCAob2xkVmVyc2lvbikge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRiLmNyZWF0ZU9iamVjdFN0b3JlKFNUT1JFX05BTUUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTYWZhcmkvaU9TIGJyb3dzZXJzIHRocm93IG9jY2FzaW9uYWwgZXhjZXB0aW9ucyBvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGRiLmNyZWF0ZU9iamVjdFN0b3JlKCkgdGhhdCBtYXkgYmUgYSBidWcuIEF2b2lkIGJsb2NraW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhlIHJlc3Qgb2YgdGhlIGFwcCBmdW5jdGlvbmFsaXR5LlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLmNhdGNoKGUgPT4ge1xuICAgICAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJpZGItb3BlblwiIC8qIEFwcEVycm9yLklEQl9PUEVOICovLCB7XG4gICAgICAgICAgICAgICAgb3JpZ2luYWxFcnJvck1lc3NhZ2U6IGUubWVzc2FnZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gZGJQcm9taXNlO1xufVxuYXN5bmMgZnVuY3Rpb24gcmVhZEhlYXJ0YmVhdHNGcm9tSW5kZXhlZERCKGFwcCkge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGRiID0gYXdhaXQgZ2V0RGJQcm9taXNlKCk7XG4gICAgICAgIGNvbnN0IHR4ID0gZGIudHJhbnNhY3Rpb24oU1RPUkVfTkFNRSk7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHR4Lm9iamVjdFN0b3JlKFNUT1JFX05BTUUpLmdldChjb21wdXRlS2V5KGFwcCkpO1xuICAgICAgICAvLyBXZSBhbHJlYWR5IGhhdmUgdGhlIHZhbHVlIGJ1dCB0eC5kb25lIGNhbiB0aHJvdyxcbiAgICAgICAgLy8gc28gd2UgbmVlZCB0byBhd2FpdCBpdCBoZXJlIHRvIGNhdGNoIGVycm9yc1xuICAgICAgICBhd2FpdCB0eC5kb25lO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgICBpZiAoZSBpbnN0YW5jZW9mIEZpcmViYXNlRXJyb3IpIHtcbiAgICAgICAgICAgIGxvZ2dlci53YXJuKGUubWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBpZGJHZXRFcnJvciA9IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwiaWRiLWdldFwiIC8qIEFwcEVycm9yLklEQl9HRVQgKi8sIHtcbiAgICAgICAgICAgICAgICBvcmlnaW5hbEVycm9yTWVzc2FnZTogZT8ubWVzc2FnZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBsb2dnZXIud2FybihpZGJHZXRFcnJvci5tZXNzYWdlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmFzeW5jIGZ1bmN0aW9uIHdyaXRlSGVhcnRiZWF0c1RvSW5kZXhlZERCKGFwcCwgaGVhcnRiZWF0T2JqZWN0KSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZGIgPSBhd2FpdCBnZXREYlByb21pc2UoKTtcbiAgICAgICAgY29uc3QgdHggPSBkYi50cmFuc2FjdGlvbihTVE9SRV9OQU1FLCAncmVhZHdyaXRlJyk7XG4gICAgICAgIGNvbnN0IG9iamVjdFN0b3JlID0gdHgub2JqZWN0U3RvcmUoU1RPUkVfTkFNRSk7XG4gICAgICAgIGF3YWl0IG9iamVjdFN0b3JlLnB1dChoZWFydGJlYXRPYmplY3QsIGNvbXB1dGVLZXkoYXBwKSk7XG4gICAgICAgIGF3YWl0IHR4LmRvbmU7XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChlIGluc3RhbmNlb2YgRmlyZWJhc2VFcnJvcikge1xuICAgICAgICAgICAgbG9nZ2VyLndhcm4oZS5tZXNzYWdlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGlkYkdldEVycm9yID0gRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJpZGItc2V0XCIgLyogQXBwRXJyb3IuSURCX1dSSVRFICovLCB7XG4gICAgICAgICAgICAgICAgb3JpZ2luYWxFcnJvck1lc3NhZ2U6IGU/Lm1lc3NhZ2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbG9nZ2VyLndhcm4oaWRiR2V0RXJyb3IubWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5mdW5jdGlvbiBjb21wdXRlS2V5KGFwcCkge1xuICAgIHJldHVybiBgJHthcHAubmFtZX0hJHthcHAub3B0aW9ucy5hcHBJZH1gO1xufVxuXG4vKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMSBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuY29uc3QgTUFYX0hFQURFUl9CWVRFUyA9IDEwMjQ7XG5jb25zdCBNQVhfTlVNX1NUT1JFRF9IRUFSVEJFQVRTID0gMzA7XG5jbGFzcyBIZWFydGJlYXRTZXJ2aWNlSW1wbCB7XG4gICAgY29uc3RydWN0b3IoY29udGFpbmVyKSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xuICAgICAgICAvKipcbiAgICAgICAgICogSW4tbWVtb3J5IGNhY2hlIGZvciBoZWFydGJlYXRzLCB1c2VkIGJ5IGdldEhlYXJ0YmVhdHNIZWFkZXIoKSB0byBnZW5lcmF0ZVxuICAgICAgICAgKiB0aGUgaGVhZGVyIHN0cmluZy5cbiAgICAgICAgICogU3RvcmVzIG9uZSByZWNvcmQgcGVyIGRhdGUuIFRoaXMgd2lsbCBiZSBjb25zb2xpZGF0ZWQgaW50byB0aGUgc3RhbmRhcmRcbiAgICAgICAgICogZm9ybWF0IG9mIG9uZSByZWNvcmQgcGVyIHVzZXIgYWdlbnQgc3RyaW5nIGJlZm9yZSBiZWluZyBzZW50IGFzIGEgaGVhZGVyLlxuICAgICAgICAgKiBQb3B1bGF0ZWQgZnJvbSBpbmRleGVkREIgd2hlbiB0aGUgY29udHJvbGxlciBpcyBpbnN0YW50aWF0ZWQgYW5kIHNob3VsZFxuICAgICAgICAgKiBiZSBrZXB0IGluIHN5bmMgd2l0aCBpbmRleGVkREIuXG4gICAgICAgICAqIExlYXZlIHB1YmxpYyBmb3IgZWFzaWVyIHRlc3RpbmcuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9oZWFydGJlYXRzQ2FjaGUgPSBudWxsO1xuICAgICAgICBjb25zdCBhcHAgPSB0aGlzLmNvbnRhaW5lci5nZXRQcm92aWRlcignYXBwJykuZ2V0SW1tZWRpYXRlKCk7XG4gICAgICAgIHRoaXMuX3N0b3JhZ2UgPSBuZXcgSGVhcnRiZWF0U3RvcmFnZUltcGwoYXBwKTtcbiAgICAgICAgdGhpcy5faGVhcnRiZWF0c0NhY2hlUHJvbWlzZSA9IHRoaXMuX3N0b3JhZ2UucmVhZCgpLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2hlYXJ0YmVhdHNDYWNoZSA9IHJlc3VsdDtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDYWxsZWQgdG8gcmVwb3J0IGEgaGVhcnRiZWF0LiBUaGUgZnVuY3Rpb24gd2lsbCBnZW5lcmF0ZVxuICAgICAqIGEgSGVhcnRiZWF0c0J5VXNlckFnZW50IG9iamVjdCwgdXBkYXRlIGhlYXJ0YmVhdHNDYWNoZSwgYW5kIHBlcnNpc3QgaXRcbiAgICAgKiB0byBJbmRleGVkREIuXG4gICAgICogTm90ZSB0aGF0IHdlIG9ubHkgc3RvcmUgb25lIGhlYXJ0YmVhdCBwZXIgZGF5LiBTbyBpZiBhIGhlYXJ0YmVhdCBmb3IgdG9kYXkgaXNcbiAgICAgKiBhbHJlYWR5IGxvZ2dlZCwgc3Vic2VxdWVudCBjYWxscyB0byB0aGlzIGZ1bmN0aW9uIGluIHRoZSBzYW1lIGRheSB3aWxsIGJlIGlnbm9yZWQuXG4gICAgICovXG4gICAgYXN5bmMgdHJpZ2dlckhlYXJ0YmVhdCgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHBsYXRmb3JtTG9nZ2VyID0gdGhpcy5jb250YWluZXJcbiAgICAgICAgICAgICAgICAuZ2V0UHJvdmlkZXIoJ3BsYXRmb3JtLWxvZ2dlcicpXG4gICAgICAgICAgICAgICAgLmdldEltbWVkaWF0ZSgpO1xuICAgICAgICAgICAgLy8gVGhpcyBpcyB0aGUgXCJGaXJlYmFzZSB1c2VyIGFnZW50XCIgc3RyaW5nIGZyb20gdGhlIHBsYXRmb3JtIGxvZ2dlclxuICAgICAgICAgICAgLy8gc2VydmljZSwgbm90IHRoZSBicm93c2VyIHVzZXIgYWdlbnQuXG4gICAgICAgICAgICBjb25zdCBhZ2VudCA9IHBsYXRmb3JtTG9nZ2VyLmdldFBsYXRmb3JtSW5mb1N0cmluZygpO1xuICAgICAgICAgICAgY29uc3QgZGF0ZSA9IGdldFVUQ0RhdGVTdHJpbmcoKTtcbiAgICAgICAgICAgIGlmICh0aGlzLl9oZWFydGJlYXRzQ2FjaGU/LmhlYXJ0YmVhdHMgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2hlYXJ0YmVhdHNDYWNoZSA9IGF3YWl0IHRoaXMuX2hlYXJ0YmVhdHNDYWNoZVByb21pc2U7XG4gICAgICAgICAgICAgICAgLy8gSWYgd2UgZmFpbGVkIHRvIGNvbnN0cnVjdCBhIGhlYXJ0YmVhdHMgY2FjaGUsIHRoZW4gcmV0dXJuIGltbWVkaWF0ZWx5LlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9oZWFydGJlYXRzQ2FjaGU/LmhlYXJ0YmVhdHMgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gRG8gbm90IHN0b3JlIGEgaGVhcnRiZWF0IGlmIG9uZSBpcyBhbHJlYWR5IHN0b3JlZCBmb3IgdGhpcyBkYXlcbiAgICAgICAgICAgIC8vIG9yIGlmIGEgaGVhZGVyIGhhcyBhbHJlYWR5IGJlZW4gc2VudCB0b2RheS5cbiAgICAgICAgICAgIGlmICh0aGlzLl9oZWFydGJlYXRzQ2FjaGUubGFzdFNlbnRIZWFydGJlYXREYXRlID09PSBkYXRlIHx8XG4gICAgICAgICAgICAgICAgdGhpcy5faGVhcnRiZWF0c0NhY2hlLmhlYXJ0YmVhdHMuc29tZShzaW5nbGVEYXRlSGVhcnRiZWF0ID0+IHNpbmdsZURhdGVIZWFydGJlYXQuZGF0ZSA9PT0gZGF0ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBUaGVyZSBpcyBubyBlbnRyeSBmb3IgdGhpcyBkYXRlLiBDcmVhdGUgb25lLlxuICAgICAgICAgICAgICAgIHRoaXMuX2hlYXJ0YmVhdHNDYWNoZS5oZWFydGJlYXRzLnB1c2goeyBkYXRlLCBhZ2VudCB9KTtcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGUgbnVtYmVyIG9mIHN0b3JlZCBoZWFydGJlYXRzIGV4Y2VlZHMgdGhlIG1heGltdW0gbnVtYmVyIG9mIHN0b3JlZCBoZWFydGJlYXRzLCByZW1vdmUgdGhlIGhlYXJ0YmVhdCB3aXRoIHRoZSBlYXJsaWVzdCBkYXRlLlxuICAgICAgICAgICAgICAgIC8vIFNpbmNlIHRoaXMgaXMgZXhlY3V0ZWQgZWFjaCB0aW1lIGEgaGVhcnRiZWF0IGlzIHB1c2hlZCwgdGhlIGxpbWl0IGNhbiBvbmx5IGJlIGV4Y2VlZGVkIGJ5IG9uZSwgc28gb25seSBvbmUgbmVlZHMgdG8gYmUgcmVtb3ZlZC5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5faGVhcnRiZWF0c0NhY2hlLmhlYXJ0YmVhdHMubGVuZ3RoID4gTUFYX05VTV9TVE9SRURfSEVBUlRCRUFUUykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBlYXJsaWVzdEhlYXJ0YmVhdElkeCA9IGdldEVhcmxpZXN0SGVhcnRiZWF0SWR4KHRoaXMuX2hlYXJ0YmVhdHNDYWNoZS5oZWFydGJlYXRzKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faGVhcnRiZWF0c0NhY2hlLmhlYXJ0YmVhdHMuc3BsaWNlKGVhcmxpZXN0SGVhcnRiZWF0SWR4LCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RvcmFnZS5vdmVyd3JpdGUodGhpcy5faGVhcnRiZWF0c0NhY2hlKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgbG9nZ2VyLndhcm4oZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIGJhc2U2NCBlbmNvZGVkIHN0cmluZyB3aGljaCBjYW4gYmUgYXR0YWNoZWQgdG8gdGhlIGhlYXJ0YmVhdC1zcGVjaWZpYyBoZWFkZXIgZGlyZWN0bHkuXG4gICAgICogSXQgYWxzbyBjbGVhcnMgYWxsIGhlYXJ0YmVhdHMgZnJvbSBtZW1vcnkgYXMgd2VsbCBhcyBpbiBJbmRleGVkREIuXG4gICAgICpcbiAgICAgKiBOT1RFOiBDb25zdW1pbmcgcHJvZHVjdCBTREtzIHNob3VsZCBub3Qgc2VuZCB0aGUgaGVhZGVyIGlmIHRoaXMgbWV0aG9kXG4gICAgICogcmV0dXJucyBhbiBlbXB0eSBzdHJpbmcuXG4gICAgICovXG4gICAgYXN5bmMgZ2V0SGVhcnRiZWF0c0hlYWRlcigpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9oZWFydGJlYXRzQ2FjaGUgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLl9oZWFydGJlYXRzQ2FjaGVQcm9taXNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gSWYgaXQncyBzdGlsbCBudWxsIG9yIHRoZSBhcnJheSBpcyBlbXB0eSwgdGhlcmUgaXMgbm8gZGF0YSB0byBzZW5kLlxuICAgICAgICAgICAgaWYgKHRoaXMuX2hlYXJ0YmVhdHNDYWNoZT8uaGVhcnRiZWF0cyA9PSBudWxsIHx8XG4gICAgICAgICAgICAgICAgdGhpcy5faGVhcnRiZWF0c0NhY2hlLmhlYXJ0YmVhdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgZGF0ZSA9IGdldFVUQ0RhdGVTdHJpbmcoKTtcbiAgICAgICAgICAgIC8vIEV4dHJhY3QgYXMgbWFueSBoZWFydGJlYXRzIGZyb20gdGhlIGNhY2hlIGFzIHdpbGwgZml0IHVuZGVyIHRoZSBzaXplIGxpbWl0LlxuICAgICAgICAgICAgY29uc3QgeyBoZWFydGJlYXRzVG9TZW5kLCB1bnNlbnRFbnRyaWVzIH0gPSBleHRyYWN0SGVhcnRiZWF0c0ZvckhlYWRlcih0aGlzLl9oZWFydGJlYXRzQ2FjaGUuaGVhcnRiZWF0cyk7XG4gICAgICAgICAgICBjb25zdCBoZWFkZXJTdHJpbmcgPSBiYXNlNjR1cmxFbmNvZGVXaXRob3V0UGFkZGluZyhKU09OLnN0cmluZ2lmeSh7IHZlcnNpb246IDIsIGhlYXJ0YmVhdHM6IGhlYXJ0YmVhdHNUb1NlbmQgfSkpO1xuICAgICAgICAgICAgLy8gU3RvcmUgbGFzdCBzZW50IGRhdGUgdG8gcHJldmVudCBhbm90aGVyIGJlaW5nIGxvZ2dlZC9zZW50IGZvciB0aGUgc2FtZSBkYXkuXG4gICAgICAgICAgICB0aGlzLl9oZWFydGJlYXRzQ2FjaGUubGFzdFNlbnRIZWFydGJlYXREYXRlID0gZGF0ZTtcbiAgICAgICAgICAgIGlmICh1bnNlbnRFbnRyaWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAvLyBTdG9yZSBhbnkgdW5zZW50IGVudHJpZXMgaWYgdGhleSBleGlzdC5cbiAgICAgICAgICAgICAgICB0aGlzLl9oZWFydGJlYXRzQ2FjaGUuaGVhcnRiZWF0cyA9IHVuc2VudEVudHJpZXM7XG4gICAgICAgICAgICAgICAgLy8gVGhpcyBzZWVtcyBtb3JlIGxpa2VseSB0aGFuIGVtcHR5aW5nIHRoZSBhcnJheSAoYmVsb3cpIHRvIGxlYWQgdG8gc29tZSBvZGQgc3RhdGVcbiAgICAgICAgICAgICAgICAvLyBzaW5jZSB0aGUgY2FjaGUgaXNuJ3QgZW1wdHkgYW5kIHRoaXMgd2lsbCBiZSBjYWxsZWQgYWdhaW4gb24gdGhlIG5leHQgcmVxdWVzdCxcbiAgICAgICAgICAgICAgICAvLyBhbmQgaXMgcHJvYmFibHkgc2FmZXN0IGlmIHdlIGF3YWl0IGl0LlxuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuX3N0b3JhZ2Uub3ZlcndyaXRlKHRoaXMuX2hlYXJ0YmVhdHNDYWNoZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9oZWFydGJlYXRzQ2FjaGUuaGVhcnRiZWF0cyA9IFtdO1xuICAgICAgICAgICAgICAgIC8vIERvIG5vdCB3YWl0IGZvciB0aGlzLCB0byByZWR1Y2UgbGF0ZW5jeS5cbiAgICAgICAgICAgICAgICB2b2lkIHRoaXMuX3N0b3JhZ2Uub3ZlcndyaXRlKHRoaXMuX2hlYXJ0YmVhdHNDYWNoZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaGVhZGVyU3RyaW5nO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICBsb2dnZXIud2FybihlKTtcbiAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgIH1cbn1cbmZ1bmN0aW9uIGdldFVUQ0RhdGVTdHJpbmcoKSB7XG4gICAgY29uc3QgdG9kYXkgPSBuZXcgRGF0ZSgpO1xuICAgIC8vIFJldHVybnMgZGF0ZSBmb3JtYXQgJ1lZWVktTU0tREQnXG4gICAgcmV0dXJuIHRvZGF5LnRvSVNPU3RyaW5nKCkuc3Vic3RyaW5nKDAsIDEwKTtcbn1cbmZ1bmN0aW9uIGV4dHJhY3RIZWFydGJlYXRzRm9ySGVhZGVyKGhlYXJ0YmVhdHNDYWNoZSwgbWF4U2l6ZSA9IE1BWF9IRUFERVJfQllURVMpIHtcbiAgICAvLyBIZWFydGJlYXRzIGdyb3VwZWQgYnkgdXNlciBhZ2VudCBpbiB0aGUgc3RhbmRhcmQgZm9ybWF0IHRvIGJlIHNlbnQgaW5cbiAgICAvLyB0aGUgaGVhZGVyLlxuICAgIGNvbnN0IGhlYXJ0YmVhdHNUb1NlbmQgPSBbXTtcbiAgICAvLyBTaW5nbGUgZGF0ZSBmb3JtYXQgaGVhcnRiZWF0cyB0aGF0IGFyZSBub3Qgc2VudC5cbiAgICBsZXQgdW5zZW50RW50cmllcyA9IGhlYXJ0YmVhdHNDYWNoZS5zbGljZSgpO1xuICAgIGZvciAoY29uc3Qgc2luZ2xlRGF0ZUhlYXJ0YmVhdCBvZiBoZWFydGJlYXRzQ2FjaGUpIHtcbiAgICAgICAgLy8gTG9vayBmb3IgYW4gZXhpc3RpbmcgZW50cnkgd2l0aCB0aGUgc2FtZSB1c2VyIGFnZW50LlxuICAgICAgICBjb25zdCBoZWFydGJlYXRFbnRyeSA9IGhlYXJ0YmVhdHNUb1NlbmQuZmluZChoYiA9PiBoYi5hZ2VudCA9PT0gc2luZ2xlRGF0ZUhlYXJ0YmVhdC5hZ2VudCk7XG4gICAgICAgIGlmICghaGVhcnRiZWF0RW50cnkpIHtcbiAgICAgICAgICAgIC8vIElmIG5vIGVudHJ5IGZvciB0aGlzIHVzZXIgYWdlbnQgZXhpc3RzLCBjcmVhdGUgb25lLlxuICAgICAgICAgICAgaGVhcnRiZWF0c1RvU2VuZC5wdXNoKHtcbiAgICAgICAgICAgICAgICBhZ2VudDogc2luZ2xlRGF0ZUhlYXJ0YmVhdC5hZ2VudCxcbiAgICAgICAgICAgICAgICBkYXRlczogW3NpbmdsZURhdGVIZWFydGJlYXQuZGF0ZV1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGNvdW50Qnl0ZXMoaGVhcnRiZWF0c1RvU2VuZCkgPiBtYXhTaXplKSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlIGhlYWRlciB3b3VsZCBleGNlZWQgbWF4IHNpemUsIHJlbW92ZSB0aGUgYWRkZWQgaGVhcnRiZWF0XG4gICAgICAgICAgICAgICAgLy8gZW50cnkgYW5kIHN0b3AgYWRkaW5nIHRvIHRoZSBoZWFkZXIuXG4gICAgICAgICAgICAgICAgaGVhcnRiZWF0c1RvU2VuZC5wb3AoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGhlYXJ0YmVhdEVudHJ5LmRhdGVzLnB1c2goc2luZ2xlRGF0ZUhlYXJ0YmVhdC5kYXRlKTtcbiAgICAgICAgICAgIC8vIElmIHRoZSBoZWFkZXIgd291bGQgZXhjZWVkIG1heCBzaXplLCByZW1vdmUgdGhlIGFkZGVkIGRhdGVcbiAgICAgICAgICAgIC8vIGFuZCBzdG9wIGFkZGluZyB0byB0aGUgaGVhZGVyLlxuICAgICAgICAgICAgaWYgKGNvdW50Qnl0ZXMoaGVhcnRiZWF0c1RvU2VuZCkgPiBtYXhTaXplKSB7XG4gICAgICAgICAgICAgICAgaGVhcnRiZWF0RW50cnkuZGF0ZXMucG9wKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gUG9wIHVuc2VudCBlbnRyeSBmcm9tIHF1ZXVlLiAoU2tpcHBlZCBpZiBhZGRpbmcgdGhlIGVudHJ5IGV4Y2VlZGVkXG4gICAgICAgIC8vIHF1b3RhIGFuZCB0aGUgbG9vcCBicmVha3MgZWFybHkuKVxuICAgICAgICB1bnNlbnRFbnRyaWVzID0gdW5zZW50RW50cmllcy5zbGljZSgxKTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgaGVhcnRiZWF0c1RvU2VuZCxcbiAgICAgICAgdW5zZW50RW50cmllc1xuICAgIH07XG59XG5jbGFzcyBIZWFydGJlYXRTdG9yYWdlSW1wbCB7XG4gICAgY29uc3RydWN0b3IoYXBwKSB7XG4gICAgICAgIHRoaXMuYXBwID0gYXBwO1xuICAgICAgICB0aGlzLl9jYW5Vc2VJbmRleGVkREJQcm9taXNlID0gdGhpcy5ydW5JbmRleGVkREJFbnZpcm9ubWVudENoZWNrKCk7XG4gICAgfVxuICAgIGFzeW5jIHJ1bkluZGV4ZWREQkVudmlyb25tZW50Q2hlY2soKSB7XG4gICAgICAgIGlmICghaXNJbmRleGVkREJBdmFpbGFibGUoKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHZhbGlkYXRlSW5kZXhlZERCT3BlbmFibGUoKVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHRydWUpXG4gICAgICAgICAgICAgICAgLmNhdGNoKCgpID0+IGZhbHNlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZWFkIGFsbCBoZWFydGJlYXRzLlxuICAgICAqL1xuICAgIGFzeW5jIHJlYWQoKSB7XG4gICAgICAgIGNvbnN0IGNhblVzZUluZGV4ZWREQiA9IGF3YWl0IHRoaXMuX2NhblVzZUluZGV4ZWREQlByb21pc2U7XG4gICAgICAgIGlmICghY2FuVXNlSW5kZXhlZERCKSB7XG4gICAgICAgICAgICByZXR1cm4geyBoZWFydGJlYXRzOiBbXSB9O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgaWRiSGVhcnRiZWF0T2JqZWN0ID0gYXdhaXQgcmVhZEhlYXJ0YmVhdHNGcm9tSW5kZXhlZERCKHRoaXMuYXBwKTtcbiAgICAgICAgICAgIGlmIChpZGJIZWFydGJlYXRPYmplY3Q/LmhlYXJ0YmVhdHMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaWRiSGVhcnRiZWF0T2JqZWN0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgaGVhcnRiZWF0czogW10gfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBvdmVyd3JpdGUgdGhlIHN0b3JhZ2Ugd2l0aCB0aGUgcHJvdmlkZWQgaGVhcnRiZWF0c1xuICAgIGFzeW5jIG92ZXJ3cml0ZShoZWFydGJlYXRzT2JqZWN0KSB7XG4gICAgICAgIGNvbnN0IGNhblVzZUluZGV4ZWREQiA9IGF3YWl0IHRoaXMuX2NhblVzZUluZGV4ZWREQlByb21pc2U7XG4gICAgICAgIGlmICghY2FuVXNlSW5kZXhlZERCKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBleGlzdGluZ0hlYXJ0YmVhdHNPYmplY3QgPSBhd2FpdCB0aGlzLnJlYWQoKTtcbiAgICAgICAgICAgIHJldHVybiB3cml0ZUhlYXJ0YmVhdHNUb0luZGV4ZWREQih0aGlzLmFwcCwge1xuICAgICAgICAgICAgICAgIGxhc3RTZW50SGVhcnRiZWF0RGF0ZTogaGVhcnRiZWF0c09iamVjdC5sYXN0U2VudEhlYXJ0YmVhdERhdGUgPz9cbiAgICAgICAgICAgICAgICAgICAgZXhpc3RpbmdIZWFydGJlYXRzT2JqZWN0Lmxhc3RTZW50SGVhcnRiZWF0RGF0ZSxcbiAgICAgICAgICAgICAgICBoZWFydGJlYXRzOiBoZWFydGJlYXRzT2JqZWN0LmhlYXJ0YmVhdHNcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIGFkZCBoZWFydGJlYXRzXG4gICAgYXN5bmMgYWRkKGhlYXJ0YmVhdHNPYmplY3QpIHtcbiAgICAgICAgY29uc3QgY2FuVXNlSW5kZXhlZERCID0gYXdhaXQgdGhpcy5fY2FuVXNlSW5kZXhlZERCUHJvbWlzZTtcbiAgICAgICAgaWYgKCFjYW5Vc2VJbmRleGVkREIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nSGVhcnRiZWF0c09iamVjdCA9IGF3YWl0IHRoaXMucmVhZCgpO1xuICAgICAgICAgICAgcmV0dXJuIHdyaXRlSGVhcnRiZWF0c1RvSW5kZXhlZERCKHRoaXMuYXBwLCB7XG4gICAgICAgICAgICAgICAgbGFzdFNlbnRIZWFydGJlYXREYXRlOiBoZWFydGJlYXRzT2JqZWN0Lmxhc3RTZW50SGVhcnRiZWF0RGF0ZSA/P1xuICAgICAgICAgICAgICAgICAgICBleGlzdGluZ0hlYXJ0YmVhdHNPYmplY3QubGFzdFNlbnRIZWFydGJlYXREYXRlLFxuICAgICAgICAgICAgICAgIGhlYXJ0YmVhdHM6IFtcbiAgICAgICAgICAgICAgICAgICAgLi4uZXhpc3RpbmdIZWFydGJlYXRzT2JqZWN0LmhlYXJ0YmVhdHMsXG4gICAgICAgICAgICAgICAgICAgIC4uLmhlYXJ0YmVhdHNPYmplY3QuaGVhcnRiZWF0c1xuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufVxuLyoqXG4gKiBDYWxjdWxhdGUgYnl0ZXMgb2YgYSBIZWFydGJlYXRzQnlVc2VyQWdlbnQgYXJyYXkgYWZ0ZXIgYmVpbmcgd3JhcHBlZFxuICogaW4gYSBwbGF0Zm9ybSBsb2dnaW5nIGhlYWRlciBKU09OIG9iamVjdCwgc3RyaW5naWZpZWQsIGFuZCBjb252ZXJ0ZWRcbiAqIHRvIGJhc2UgNjQuXG4gKi9cbmZ1bmN0aW9uIGNvdW50Qnl0ZXMoaGVhcnRiZWF0c0NhY2hlKSB7XG4gICAgLy8gYmFzZTY0IGhhcyBhIHJlc3RyaWN0ZWQgc2V0IG9mIGNoYXJhY3RlcnMsIGFsbCBvZiB3aGljaCBzaG91bGQgYmUgMSBieXRlLlxuICAgIHJldHVybiBiYXNlNjR1cmxFbmNvZGVXaXRob3V0UGFkZGluZyhcbiAgICAvLyBoZWFydGJlYXRzQ2FjaGUgd3JhcHBlciBwcm9wZXJ0aWVzXG4gICAgSlNPTi5zdHJpbmdpZnkoeyB2ZXJzaW9uOiAyLCBoZWFydGJlYXRzOiBoZWFydGJlYXRzQ2FjaGUgfSkpLmxlbmd0aDtcbn1cbi8qKlxuICogUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIGhlYXJ0YmVhdCB3aXRoIHRoZSBlYXJsaWVzdCBkYXRlLlxuICogSWYgdGhlIGhlYXJ0YmVhdHMgYXJyYXkgaXMgZW1wdHksIC0xIGlzIHJldHVybmVkLlxuICovXG5mdW5jdGlvbiBnZXRFYXJsaWVzdEhlYXJ0YmVhdElkeChoZWFydGJlYXRzKSB7XG4gICAgaWYgKGhlYXJ0YmVhdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG4gICAgbGV0IGVhcmxpZXN0SGVhcnRiZWF0SWR4ID0gMDtcbiAgICBsZXQgZWFybGllc3RIZWFydGJlYXREYXRlID0gaGVhcnRiZWF0c1swXS5kYXRlO1xuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgaGVhcnRiZWF0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoaGVhcnRiZWF0c1tpXS5kYXRlIDwgZWFybGllc3RIZWFydGJlYXREYXRlKSB7XG4gICAgICAgICAgICBlYXJsaWVzdEhlYXJ0YmVhdERhdGUgPSBoZWFydGJlYXRzW2ldLmRhdGU7XG4gICAgICAgICAgICBlYXJsaWVzdEhlYXJ0YmVhdElkeCA9IGk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGVhcmxpZXN0SGVhcnRiZWF0SWR4O1xufVxuXG4vKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuZnVuY3Rpb24gcmVnaXN0ZXJDb3JlQ29tcG9uZW50cyh2YXJpYW50KSB7XG4gICAgX3JlZ2lzdGVyQ29tcG9uZW50KG5ldyBDb21wb25lbnQoJ3BsYXRmb3JtLWxvZ2dlcicsIGNvbnRhaW5lciA9PiBuZXcgUGxhdGZvcm1Mb2dnZXJTZXJ2aWNlSW1wbChjb250YWluZXIpLCBcIlBSSVZBVEVcIiAvKiBDb21wb25lbnRUeXBlLlBSSVZBVEUgKi8pKTtcbiAgICBfcmVnaXN0ZXJDb21wb25lbnQobmV3IENvbXBvbmVudCgnaGVhcnRiZWF0JywgY29udGFpbmVyID0+IG5ldyBIZWFydGJlYXRTZXJ2aWNlSW1wbChjb250YWluZXIpLCBcIlBSSVZBVEVcIiAvKiBDb21wb25lbnRUeXBlLlBSSVZBVEUgKi8pKTtcbiAgICAvLyBSZWdpc3RlciBgYXBwYCBwYWNrYWdlLlxuICAgIHJlZ2lzdGVyVmVyc2lvbihuYW1lJHEsIHZlcnNpb24kMSwgdmFyaWFudCk7XG4gICAgLy8gQlVJTERfVEFSR0VUIHdpbGwgYmUgcmVwbGFjZWQgYnkgdmFsdWVzIGxpa2UgZXNtLCBjanMsIGV0YyBkdXJpbmcgdGhlIGNvbXBpbGF0aW9uXG4gICAgcmVnaXN0ZXJWZXJzaW9uKG5hbWUkcSwgdmVyc2lvbiQxLCAnZXNtMjAyMCcpO1xuICAgIC8vIFJlZ2lzdGVyIHBsYXRmb3JtIFNESyBpZGVudGlmaWVyIChubyB2ZXJzaW9uKS5cbiAgICByZWdpc3RlclZlcnNpb24oJ2ZpcmUtanMnLCAnJyk7XG59XG5cbi8qKlxuICogRmlyZWJhc2UgQXBwXG4gKlxuICogQHJlbWFya3MgVGhpcyBwYWNrYWdlIGNvb3JkaW5hdGVzIHRoZSBjb21tdW5pY2F0aW9uIGJldHdlZW4gdGhlIGRpZmZlcmVudCBGaXJlYmFzZSBjb21wb25lbnRzXG4gKiBAcGFja2FnZURvY3VtZW50YXRpb25cbiAqL1xucmVnaXN0ZXJDb3JlQ29tcG9uZW50cygnJyk7XG5cbmV4cG9ydCB7IFNES19WRVJTSU9OLCBERUZBVUxUX0VOVFJZX05BTUUgYXMgX0RFRkFVTFRfRU5UUllfTkFNRSwgX2FkZENvbXBvbmVudCwgX2FkZE9yT3ZlcndyaXRlQ29tcG9uZW50LCBfYXBwcywgX2NsZWFyQ29tcG9uZW50cywgX2NvbXBvbmVudHMsIF9nZXRQcm92aWRlciwgX2lzRmlyZWJhc2VBcHAsIF9pc0ZpcmViYXNlU2VydmVyQXBwLCBfaXNGaXJlYmFzZVNlcnZlckFwcFNldHRpbmdzLCBfcmVnaXN0ZXJDb21wb25lbnQsIF9yZW1vdmVTZXJ2aWNlSW5zdGFuY2UsIF9zZXJ2ZXJBcHBzLCBkZWxldGVBcHAsIGdldEFwcCwgZ2V0QXBwcywgaW5pdGlhbGl6ZUFwcCwgaW5pdGlhbGl6ZVNlcnZlckFwcCwgb25Mb2csIHJlZ2lzdGVyVmVyc2lvbiwgc2V0TG9nTGV2ZWwgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmVzbS5qcy5tYXBcbiJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFNLG1DQUFvQyxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNzRjFDLElBQU0sc0JBQXNCLFNBQVUsS0FBSztDQUV2QyxNQUFNLE1BQU0sQ0FBQztDQUNiLElBQUksSUFBSTtDQUNSLEtBQUssSUFBSSxJQUFJLEdBQUcsSUFBSSxJQUFJLFFBQVEsS0FBSztFQUNqQyxJQUFJLElBQUksSUFBSSxXQUFXLENBQUM7RUFDeEIsSUFBSSxJQUFJLEtBQ0osSUFBSSxPQUFPO09B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LE1BRHlCLEtBQUsseUJBRS9CLE9BQU8sRUFBRSxZQUFZLENBQUMsRUFBRTtPQUV2QjtHQUNELE1BQU0scUJBQXFCLE1BQU0sNEJBQTRCLEtBQUssR0FBRztHQUNyRSxJQUFJLG9CQUFvQixZQUNwQixPQUFPO1FBR1AsT0FBTyxFQUFFLFlBQVksQ0FBQyxFQUFFO0VBRWhDO0NBQ0o7Q0FFQSxNQUFNLFVBQVUsa0JBQWtCO0VBRTlCLElBQUksQ0FBQyxNQUR5QixLQUFLLHlCQUUvQjtPQUVDO0dBQ0QsTUFBTSwyQkFBMkIsTUFBTSxLQUFLLEtBQUs7R0FDakQsT0FBTywyQkFBMkIsS0FBSyxLQUFLO0lBQ3hDLHVCQUF1QixpQkFBaUIseUJBQ3BDLHlCQUF5QjtJQUM3QixZQUFZLGlCQUFpQjtHQUNqQyxDQUFDO0VBQ0w7Q0FDSjtDQUVBLE1BQU0sSUFBSSxrQkFBa0I7RUFFeEIsSUFBSSxDQUFDLE1BRHlCLEtBQUsseUJBRS9CO09BRUM7R0FDRCxNQUFNLDJCQUEyQixNQUFNLEtBQUssS0FBSztHQUNqRCxPQUFPLDJCQUEyQixLQUFLLEtBQUs7SUFDeEMsdUJBQXVCLGlCQUFpQix5QkFDcEMseUJBQXlCO0lBQzdCLFlBQVksQ0FDUixHQUFHLHlCQUF5QixZQUM1QixHQUFHLGlCQUFpQixVQUN4QjtHQUNKLENBQUM7RUFDTDtDQUNKO0FBQ0o7Ozs7OztBQU1BLFNBQVMsV0FBVyxpQkFBaUI7Q0FFakMsT0FBTyw4QkFFUCxLQUFLLFVBQVU7RUFBRSxTQUFTO0VBQUcsWUFBWTtDQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2pFOzs7OztBQUtBLFNBQVMsd0JBQXdCLFlBQVk7Q0FDekMsSUFBSSxXQUFXLFdBQVcsR0FDdEIsT0FBTztDQUVYLElBQUksdUJBQXVCO0NBQzNCLElBQUksd0JBQXdCLFdBQVcsRUFBRSxDQUFDO0NBQzFDLEtBQUssSUFBSSxJQUFJLEdBQUcsSUFBSSxXQUFXLFFBQVEsS0FDbkMsSUFBSSxXQUFXLEVBQUUsQ0FBQyxPQUFPLHVCQUF1QjtFQUM1Qyx3QkFBd0IsV0FBVyxFQUFFLENBQUM7RUFDdEMsdUJBQXVCO0NBQzNCO0NBRUosT0FBTztBQUNYOzs7Ozs7Ozs7Ozs7Ozs7OztBQWtCQSxTQUFTLHVCQUF1QixTQUFTO0NBQ3JDLG1CQUFtQixJQUFJLFVBQVUsb0JBQW1CLGNBQWEsSUFBSSwwQkFBMEIsU0FBUyxHQUFHLFNBQXFDLENBQUM7Q0FDakosbUJBQW1CLElBQUksVUFBVSxjQUFhLGNBQWEsSUFBSSxxQkFBcUIsU0FBUyxHQUFHLFNBQXFDLENBQUM7Q0FFdEksZ0JBQWdCLFFBQVEsV0FBVyxPQUFPO0NBRTFDLGdCQUFnQixRQUFRLFdBQVcsU0FBUztDQUU1QyxnQkFBZ0IsV0FBVyxFQUFFO0FBQ2pDOzs7Ozs7O0FBUUEsdUJBQXVCLEVBQUUiLCJ4X2dvb2dsZV9pZ25vcmVMaXN0IjpbMCwxLDIsMyw0LDUsNl19