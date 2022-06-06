import { el, els, on, store } from "./script.js"

const serviceOptionsSection = el`section.service-options`
const vendorSeviceForm = el`form.vendor-service-form`
const restaurantServiceForm = el`form.restaurant-service-form`
const serviceFormInputs = els`input.service-form-input`
const addFoodItemSection = el`section.add-food-item`
const dialogBox = el`dialog.message-box`
const learnMoreBtn = el`button.learn-more-btn`

const customer = store.get("customer")

if (store.includes("customer")) {
	if (["vendor", "restaurant"].includes(customer.type)) {
		serviceOptionsSection.style.display = "none"
		addFoodItemSection.style.display = "flex"
	}
	else if (customer.type == "admin") {
		serviceOptionsSection.style.display = "flex"
		addFoodItemSection.style.display = "flex"
    }
}

on(vendorSeviceForm, "submit", function (evt) {
	evt.preventDefault()

	const vendorNameField = el`input.vendor-name-input`
	const vendorPasswordField = el`input.vendor-password-input`
	const vendorEmailField = el`input.vendor-email-input`
	const vendorAddressField = el`input.vendor-address-input`
	const vendorBankAccNoField = el`input.vendor-bank-acc-no-input`

	validateUsernameFields(vendorNameField)
	validatePasswordFields(vendorPasswordField)
	validateEmailFields(vendorEmailField)
	validateAddressFields(vendorAddressField)
	validateBankAccNoFields(vendorBankAccNoField)

	if (evt.target.checkValidity()) {
		const Username = vendorNameField.value.trim()
		const Password = vendorPasswordField.value.trim()
		const Email = vendorEmailField.value.trim()
		const Address = vendorAddressField.value.trim()
		const BankAccNo = vendorBankAccNoField.value.trim()

		fetch("/Auth/Signup", {
			method: "POST",
			headers: {
				"Accept": "application/json",
				"Content-type": "application/json"
			},
			body: JSON.stringify({ data: { Username, Password, Email, Address, BankAccNo, Type: "vendor" } })
		})
			.then(res => res.json())
			.then(function (data) {
				if (data.isValidCustomer) {
					evt.target.reset()
					store.set("customer", { ...data })
					window.location.href = "/"
				}
				else
					alert("A customer by the same name already exist")
			})
			.catch(error => alert("An error occured while creating your account; Please try to signup again. If the problem persists, please contact the admin."))
	}
})

on(restaurantServiceForm, "submit", function (evt) {
	evt.preventDefault()

	const restaurantUsernameField = el`input.restaurant-name-input`
	const restaurantPasswordField = el`input.restaurant-password-input`
	const restaurantEmailField = el`input.restaurant-email-input`
	const restaurantAddressField = el`input.restaurant-address-input`
	const restaurantBankAccNoField = el`input.restaurant-bank-acc-no-input`

	validateUsernameFields(restaurantUsernameField)
	validatePasswordFields(restaurantPasswordField)
	validateEmailFields(restaurantEmailField)
	validateAddressFields(restaurantAddressField)
	validateBankAccNoFields(restaurantBankAccNoField)

	if (evt.target.checkValidity()) {
		const Username = restaurantUsernameField.value.trim()
		const Password = restaurantPasswordField.value.trim()
		const Email = restaurantEmailField.value.trim()
		const Address = restaurantAddressField.value.trim()
		const BankAccNo = restaurantBankAccNoField.value.trim()

		fetch("/Auth/Signup", {
			method: "POST",
			headers: {
				"Accept": "application/json",
				"Content-type": "application/json"
			},
			body: JSON.stringify({ data: { Username, Password, Email, Address, BankAccNo, Type: "restaurant" } })
		})
			.then(res => res.json())
			.then(function (data) {
				if (data.isValidCustomer) {
					evt.target.reset()
					store.set("customer", { ...data })
					window.location.href = "/"
				}
				else
					alert("A customer by the same name already exist")
			})
			.catch(error => alert("An error occured while creating your account; Please try to signup again. If the problem persists, please contact the admin."))
	}
})

for (let field of serviceFormInputs)
	on(field, "focus", function (evt) {
		const errorMessageElm = field.parentElement.querySelector("span.error-message")
		errorMessageElm.style.display = "none"
	})

function validateUsernameFields(field) {
	const validity = field.validity
	if (validity.valid)
		return

	const errorMessageElm = field.parentElement.querySelector("span.error-message")
	errorMessageElm.style.display = "inline-block"

	if (validity.valueMissing)
		errorMessageElm.textContent = "The username must not be empty"
	else if (validity.tooShort)
		errorMessageElm.textContent = "The username must be atleast 3 characters long"
	else if (validity.tooLong)
		errorMessageElm.textContent = "The username must be less than 50 characters"
	else if (validity.patternMismatch)
		errorMessageElm.textContent = "The username must begin with a letter or underscore followed by letters, numbers, spaces or underscores"
}

function validatePasswordFields(field) {
	const validity = field.validity
	if (validity.valid)
		return

	const errorMessageElm = field.parentElement.querySelector("span.error-message")
	errorMessageElm.style.display = "inline-block"

	if (validity.valueMissing)
		errorMessageElm.textContent = "The password must not be empty"
	else if (validity.tooShort)
		errorMessageElm.textContent = "The password must be atleast 6 characters long"
	else if (validity.tooLong)
		errorMessageElm.textContent = "The password must be less than 50 characters"
}

function validateEmailFields(field) {
	const validity = field.validity
	if (validity.valid)
		return

	const errorMessageElm = field.parentElement.querySelector("span.error-message")
	errorMessageElm.style.display = "inline-block"

	if (validity.valueMissing)
		errorMessageElm.textContent = "The email must not be empty"
	else if (validity.typeMismatch)
		errorMessageElm.textContent = "The entry must be a valid email"
	else if (validity.tooShort)
		errorMessageElm.textContent = "Please enter a valid email"
	else if (validity.tooLong)
		errorMessageElm.textContent = "The email id is too long"
}

function validateAddressFields(field) {
	const validity = field.validity
	if (validity.valid)
		return

	const errorMessageElm = field.parentElement.querySelector("span.error-message")
	errorMessageElm.style.display = "inline-block"

	if (validity.valueMissing)
		errorMessageElm.textContent = "The address must not be empty"
	else if (validity.patternMismatch)
		errorMessageElm.textContent = "The address contains invalid characters"
	else if (validity.tooShort)
		errorMessageElm.textContent = "The address must be atleast 6 characters long"
	else if (validity.tooLong)
		errorMessageElm.textContent = "The address must be less than 50 characters"
}

function validateBankAccNoFields(field) {
	const validity = field.validity
	if (validity.valid)
		return

	const errorMessageElm = field.parentElement.querySelector("span.error-message")
	errorMessageElm.style.display = "inline-block"

	if (validity.valueMissing)
		errorMessageElm.textContent = "The account number must not be empty"
	else if (validity.patternMismatch)
		errorMessageElm.textContent = "The account number contains invalid characters"
	else if (validity.tooShort)
		errorMessageElm.textContent = "Please enter a valid bank account number"
	else if (validity.tooLong)
		errorMessageElm.textContent = "Please enter a valid bank account number"
}

on(learnMoreBtn, "click", _ => {
	dialogBox.showModal()
	dialogBox.scrollTop = 0
})

on(dialogBox, "click", evt => {
	const rect = dialogBox.getBoundingClientRect()
	const isInDialog = (rect.top <= evt.clientY && evt.clientY <= rect.top + rect.height
		&& rect.left <= evt.clientX && evt.clientX <= rect.left + rect.width)

	if (!isInDialog)
		dialogBox.close()
})

