import { el, els, on, escapeRegExp, store, isEmpty } from "./script.js"


const authBtn = el`button.auth-btn`
const isCustomerLoggedIn = store.includes("customer")

if (isCustomerLoggedIn)
	authBtn.textContent = "logout"
on(authBtn, "click", function (evt) {
	if (isCustomerLoggedIn) {
		store.clear()
		store.session.clear()
		return window.location.reload()
	}
	window.location.href = "/Auth"
})