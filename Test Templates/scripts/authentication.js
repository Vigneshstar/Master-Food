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


function LoginValidation() {

}

function SignUpValidation() {

}

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

void function handleFormSubmissions() {

	const loginForm = el`form.login`
	const loginUsernameInput = el`input.login-username`
	const loginPasswordInput = el`input.login-password`

	const signupForm = el`form.signup`
	const signupUsernameInput = el`input.signup-username`
	const signupPasswordInput = el`input.signup-password`
	const signupConfirmPasswordInput = el`input.signup-confirm-password`
	const signupEmailInput = el`input.signup-email`

	loginForm.setAttribute("novalidate", true)
	signupForm.setAttribute("novalidate", true);

	[loginUsernameInput, signupUsernameInput].forEach(field =>
		on(field, "blur", _ => {
			const validity = field.validity
			if (validity.valid)
				return
			else if (validity.valueMissing)
				null
			else if (validity.typeMismatch)
				null
			else if (validity.tooShort)
				null
			else if (validity.tooLong)
				null
			else if(validity.patternMismatch)
				null
		})
	);

	[loginPasswordInput, signupPasswordInput, signupConfirmPasswordInput].forEach(field =>
		on(field, "blur", _ => {
			const validity = field.validity

			if (validity.valid)
				return
			else if (validity.valueMissing)
				null
			else if (validity.typeMismatch)
				null
			else if (validity.tooShort)
				null
			else if (validity.tooLong)
				null
		})
	)

	on(signupEmailInput, "blur", _ => _ => {
		const validity = signupEmailInput.validity

		if (validity.valid)
			return
		else if (validity.valueMissing)
			null
		else if (validity.typeMismatch)
			null
	})

	const passwordToggleIcons = els`i.password-visiblity-icon`
	let passwordVisibilities = Array.from({ length: passwordToggleIcons.length }).fill(false)

	passwordToggleIcons.forEach((passwordToggleIcon, idx) =>
		on(passwordToggleIcon, "click", evt => {
			evt.target.textContent = passwordVisibilities[idx] ? "visibility_off" : "visibility"
			evt.target.nextElementSibling.type = passwordVisibilities[idx] ? "password" : "text"
			passwordVisibilities[idx] = !passwordVisibilities[idx]
		})
	)

	on(loginForm, "submit", evt => {
		evt.preventDefault()
		loginForm.reset()

		console.log(loginForm.checkValidity())
		if (!loginForm.checkValidity()) return
	})

	on(signupForm, "submit", evt => {
		evt.preventDefault()
		signupForm.reset()

		if (!signupForm.checkValidity()) return
	})
}()

void function handleAuthTypeToggle() {

	const loginBtn = el`label.login`
	const signupBtn = el`label.signup`
	const signupLink = el`form .signup-link a`

	on(signupBtn, "click", _ =>
		document.documentElement.style.setProperty("--auth-shift-transform", "translateX(-100%)"))
	
	on(loginBtn, "click", _ =>
		document.documentElement.style.setProperty("--auth-shift-transform", "translateX(0%)"))

	on(signupLink, "click", _ => signupBtn.click())
}()