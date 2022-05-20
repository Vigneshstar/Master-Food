import { el, els, on, isEmpty } from "./script.js"

const passwordToggleIcons = els`i.password-visiblity-icon`

function LoginValidation() {

}

function SignUpValidation() {

}

function validateUsernameField(field) {
	const validity = field.validity
	if (validity.valid)
		return

	const errorMessageElmWrapper = field.parentElement.querySelector("div.error-message-wrapper")
	const errorMessageElm = errorMessageElmWrapper.firstElementChild
	errorMessageElmWrapper.style.display = "block"

	if (validity.valueMissing)
		errorMessageElm.textContent = "The username must not be empty"
	else if (validity.typeMismatch)
		errorMessageElm.textContent = "The entry must be a valid username"
	else if (validity.tooShort)
		errorMessageElm.textContent = "The username must be atleast 3 characters long"
	else if (validity.tooLong)
		errorMessageElm.textContent = "The username must be less than 50 characters"
	else if (validity.patternMismatch)
		errorMessageElm.textContent = "The username must begin with a letter or underscore followed by letters, numbers, spaces or underscores"
}

function validatePasswordField(field) {
	const validity = field.validity

	if (validity.valid)
		return

	const errorMessageElmWrapper = field.parentElement.querySelector("div.error-message-wrapper")
	const errorMessageElm = errorMessageElmWrapper.firstElementChild
	errorMessageElmWrapper.style.display = "block"

	if (validity.valueMissing)
		errorMessageElm.textContent = "The password must not be empty"
	else if (validity.typeMismatch)
		errorMessageElm.textContent = "The entry must be a valid password"
	else if (validity.tooShort)
		errorMessageElm.textContent = "The password must be atleast 3 characters long"
	else if (validity.tooLong)
		errorMessageElm.textContent = "The password must be less than 50 characters"
}

function validateEmailField(field) {
	const validity = field.validity

	if (validity.valid)
		return

	const errorMessageElmWrapper = field.parentElement.querySelector("div.error-message-wrapper")
	const errorMessageElm = errorMessageElmWrapper.firstElementChild
	errorMessageElmWrapper.style.display = "block"

	if (validity.valueMissing)
		errorMessageElm.textContent = "The email must not be empty"
	else if (validity.typeMismatch || validity.patternMismatch)
		errorMessageElm.textContent = "The entry must be a valid email"
}

function hideValidationErrorMessages() {
	els`div.error-message-wrapper`.forEach(elm => elm.style.display = "none")
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

	const inputFields = [
		loginUsernameInput, loginPasswordInput,
		signupUsernameInput, signupPasswordInput,
		signupConfirmPasswordInput, signupEmailInput
	]

	const usernameFields = [loginUsernameInput, signupUsernameInput]
	const passwordFields = [loginPasswordInput, signupPasswordInput, signupConfirmPasswordInput]

	loginForm.setAttribute("novalidate", true)
	signupForm.setAttribute("novalidate", true);

	inputFields.forEach(field => on(field, "focus", _ => hideValidationErrorMessages()))

	usernameFields.forEach(field => on(field, "blur", _ => {
		hideValidationErrorMessages()
		validateUsernameField(field)
	}))

	passwordFields.forEach(field => on(field, "blur", _ => {
		hideValidationErrorMessages()
		validatePasswordField(field)
	}))

	on(signupEmailInput, "blur", _ => {
		hideValidationErrorMessages()
		validateEmailField(signupEmailInput)
	})

	passwordToggleIcons.forEach((passwordToggleIcon, idx) =>
		on(passwordToggleIcon, "click", evt => {
			togglePasswordVisibility(evt.target, idx)
		})
	)

	on(loginForm, "submit", evt => {
		evt.preventDefault()

		validateUsernameField(loginUsernameInput)
		validatePasswordField(loginPasswordInput)

		if (!loginForm.checkValidity()) return

		loginForm.reset()
		disablePasswordVisibility(passwordToggleIcons[0], 0)
	})

	on(signupForm, "submit", evt => {
		evt.preventDefault()

		validateUsernameField(signupUsernameInput)
		validatePasswordField(signupPasswordInput)
		validatePasswordField(signupConfirmPasswordInput)
		validateEmailField(signupEmailInput)

		if (!signupForm.checkValidity()) return

		signupForm.reset()
		disablePasswordVisibility(passwordToggleIcons[1], 1)
		disablePasswordVisibility(passwordToggleIcons[2], 2)
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

/**
 * @type {boolean[]}
 */

const passwordVisibilities = Array.from({ length: passwordToggleIcons.length }).fill(false)
/**
 * @param {HTMLElement} passwordTogglerElm
 * @param {number} idx 
 */
function togglePasswordVisibility(passwordTogglerElm, idx) {
	const isPasswordVisible = passwordVisibilities[idx]
	if (isPasswordVisible)
		disablePasswordVisibility(passwordTogglerElm, idx)
	else
		enablePasswordVisibility(passwordTogglerElm, idx)
}

/**
 * @param {HTMLElement} passwordTogglerElm
 * @param {number} idx 
 */
function enablePasswordVisibility(passwordTogglerElm, idx) {
	passwordTogglerElm.textContent = "visibility"
	passwordTogglerElm.nextElementSibling.setAttribute("type", "text")
	passwordVisibilities[idx] = true
}

/**
 * @param {HTMLElement} passwordTogglerElm
 * @param {number} idx 
 */
function disablePasswordVisibility(passwordTogglerElm, idx) {
	passwordTogglerElm.textContent = "visibility_off"
	passwordTogglerElm.nextElementSibling.setAttribute("type", "password")
	passwordVisibilities[idx] = false
}
