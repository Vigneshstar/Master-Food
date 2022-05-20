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

export { el, els, on, isEmpty, sanitize, unsanitize, escapeRegExp, store }