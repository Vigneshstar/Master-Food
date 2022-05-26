/**
 * @type {function(string): HTMLElement} - returns an html element from a css query
 */
const el = query => document.querySelector(query)

/**
 * @type {function(string): HTMLElement[]} - returns an array of html elements from a css query
 */
const els = query => Array.from(document.querySelectorAll(query) || [])

/**
 * @type {function(string): boolean} - checks to see if a string is empty or not
 */
const isEmpty = str => !Boolean(str.trim())

/**
 * @param {HTMLElement} element
 * @param {string} event
 * @param {function(Event): void} handler
 * @returns {void}
 * @description attaches an event to an element
 */
function on(element, event, handler) {
	element.addEventListener(event, handler)
}

/**
 * @param {string} str 
 * @returns {string}
 */
function sanitize(str) {
	const map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#x27;',
		"/": '&#x2F;',
	};
	const reg = /[&<>"'/]/ig;
	return str.replace(reg, match => map[match]);
}

/**
 * @param {string} str 
 * @returns {string}
 */
function unsanitize(str) {
	const map = {
		'&amp;': '&',
		'&lt;': '<',
		'&gt;': '>',
		'&quot;': '"',
		'&#x27;': "'",
		'&#x2F;': "/",
	};
	const reg = /[&<>"'/]/ig;
	return str.replace(reg, match => map[match]);
}

/**
 * @param {string} str
 * @returns {RegExp}
 */

function escapeRegExp(str, flags="") {
	return new RegExp(
		str.replace(/\+|\*|\{|\}|\[|\]|\||\\|\^|\$|\.|\-|\?|\(|\)|\>|\</, x => "\\" + x), flags)
}

const store = {
	clear: () => localStorage.clear(),
	remove: key => localStorage.removeItem(key),
	key: index => localStorage.key(index),
	includes: key => localStorage.getItem(key) !== null,
	get length() {
		return localStorage.length
	},
	get(key) {
		const data = localStorage.getItem(key)
		return data ? JSON.parse(localStorage.getItem(key)).data : null
	},
	set(key, value) {
		localStorage.setItem(key, JSON.stringify({ data: value }))
	}
}


/**
 * @param {HTMLElement} elm
 * @param {string} evtName
 * @param {object?} data
 */
function emitEvent(elm, evtName, data = null) {
	elm.dispatchEvent(new CustomEvent(evtName, { detail: data }))
}

/**
 * @param {HTMLElement} elm
 * @param {object} cssObj
 */

function style(elm, cssObj) {
	Object.assign(elm.style, cssObj)
}

/**
 * @param {string} str
 * @returns {string}
*/

function titleCaseToCababCase(str) {
	let strs = str.split(/\s/)
	strs = strs.map(str => str.toLowerCase())
	return strs.join("-")
}

/**
 * @param {ValidityState} validity
 * @returns {string} - if invalid returns error message, else valid returns empty string
 */
function validateUsername(validity) {
	if (validity.valueMissing)
		return "The username must not be empty"
	else if (validity.typeMismatch)
		return "The entry must be a valid username"
	else if (validity.tooShort)
		return "The username must be atleast 3 characters long"
	else if (validity.tooLong)
		return "The username must be less than 50 characters"
	else if (validity.patternMismatch)
		return "The username must begin with a letter or underscore followed by letters, numbers, spaces or underscores"
	return ""
}

/**
 * @param {ValidityState} validity
 * @returns {string} - if invalid returns error message, else valid returns empty string
 */
function validatePassword(validity) {
	if (validity.valueMissing)
		return "The password must not be empty"
	else if (validity.typeMismatch)
		return "The entry must be a valid password"
	else if (validity.tooShort)
		return "The password must be atleast 3 characters long"
	else if (validity.tooLong)
		return "The password must be less than 50 characters"
	return ""
}

/**
 * @param {ValidityState} validity
 * @returns {string} - if invalid returns error message, else valid returns empty string
 */
function validateEmail(validity) {
	if (validity.valueMissing)
		return "The email must not be empty"
	else if (validity.typeMismatch || validity.patternMismatch)
		return "The entry must be a valid email"
	return ""
}

/**
 * @param {ValidityState} validity
 * @returns {string} - if invalid returns error message, else valid returns empty string
 */
function validateAddress(validity) {
	if (validity.valueMissing)
		return "The address must not be empty"
	else if (validity.typeMismatch)
		return "The entry must be a valid address"
	else if (validity.tooShort)
		return "The address must be atleast 3 characters long"
	else if (validity.tooLong)
		return "The addresss must be less than 50 characters"
	else if (validity.patternMismatch)
		return "The address must only contain letters, numbers, spaces, dashes, colons, commas or underscores"
	return ""
}

/**
 * @param {ValidityState} validity
 * @returns {string} - if invalid returns error message, else valid returns empty string
 */
function validateBankAccNo(validity) {
	if (validity.valueMissing)
		return "The bank account number must not be empty"
	else if (validity.typeMismatch)
		return "The entry must be a valid bank account number"
	else if (validity.tooShort)
		return "The bank account number must be atleast 3 characters long"
	else if (validity.tooLong)
		return "The bank account number must be less than 50 characters"
	else if (validity.patternMismatch)
		return "The bank account number must only contain letters, numbers or underscores"
	return ""
}

export {
	el, els, on, emitEvent,
	isEmpty, sanitize, unsanitize,
	escapeRegExp, store, style,
	titleCaseToCababCase, validateUsername,
	validatePassword, validateEmail,
	validateAddress, validateBankAccNo
}