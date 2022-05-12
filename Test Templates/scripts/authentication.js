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
const isEmpty = str => Boolean(str.trim())

void function LoginValidation() {

}

void function SignUpValidation() {

}

void function handleFormSubmission() {
	//const form = el``
}()

void function handleAuthTypeToggle() {
	
}()