import { el, els, on, store } from "script.js"

const authBtn = el`.auth-btn`

const isCustomerLoggedIn = store.includes("customer")
if (isCustomerLoggedIn)
	authBtn.textContent = "logout"

on(authBtn, "click", function (evt) {
	if (isCustomerLoggedIn) {
		store.remove("customer")
		return window.location.reload()
	}
	window.location.href = "/Auth"
})