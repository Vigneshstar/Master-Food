import { el, els, on, escapeRegExp, store, isEmpty } from "./script.js"

const authBtn = el`button.auth-btn`
const restaurantSearchField = el`input.search-restaurents-field`
const restaurantLinks = els`a.restaurents-list-item-link`
const serarchRestaurantsBtn = el`button.search-restaurents-btn`
const discoverMenuBtn = el`button.discover-menu-btn`
const categoryListHeadings = els`span.category-tab-listing-item`
const categoryTabSelectorLine = el`hr.category-tab-selector-line`
const cusineListItems = els`li.cusines-list-item`
const carouselCircles = els`span.carousel-circle`

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


for (let link of restaurantLinks)
	on(link, "click", function (evt) {
		evt.preventDefault()
		const name = link.querySelector("span.restaurant-name").textContent.trim()
		const location = link.querySelector("span.restaurant-location").textContent.trim()

		store.set("selectedRestaurant", { name, location })
		restaurantSearchField.value = name
		restaurantSearchField.blur()
	})


on(restaurantSearchField, "input", function (evt) {

	const searchTerm = restaurantSearchField.value
	for (let link of restaurantLinks) {

		const regex = escapeRegExp(searchTerm.trim(), "i")

		if (regex.test(link.textContent.trim()))
			link.parentElement.style.display = "block"
		else
			link.parentElement.style.display = "none"
	}
})

on(serarchRestaurantsBtn, "click", function (evt) {

	const searchTerm = restaurantSearchField.value.trim()

	if (!isEmpty(searchTerm)) {

		const regex = escapeRegExp(searchTerm.trim(), "i")
		const link = restaurantLinks.find(link => regex.test(link.textContent.trim()))

		if (link !== undefined) {
			const name = link.querySelector("span.restaurant-name").textContent.trim()
			const location = link.querySelector("span.restaurant-location").textContent.trim()

			store.set("selectedRestaurant", { name, location })
		}

		window.location.href = "/FindFood"
		return
	}
})

on(discoverMenuBtn, "click", function (evt) {
	window.location.href = "/FindFood"
})


for (let categoryListHeading of categoryListHeadings)
	on(categoryListHeading, "click", function (evt) {
		const headingXPos = categoryListHeading.offsetLeft
		categoryTabSelectorLine.style.left = `calc(${headingXPos}px - 0.625vw)`
		categoryListHeadings.forEach(elm => elm.classList.remove("category-tab-listing-item-selected"))
		categoryListHeading.classList.add("category-tab-listing-item-selected")
	})

for (let cusineListItem of cusineListItems) {
	const cusineInfoOverlay = cusineListItem.querySelector(".cusines-list-info")

	on(cusineListItem, "mouseover", function (evt) {
		cusineInfoOverlay.style.height = "85%"
	})

	on(cusineListItem, "mouseout", function (evt) {
		cusineInfoOverlay.style.height = "0%"
	})
}

for (let carouselCircle of carouselCircles)
	on(carouselCircle, "click", function (evt) {
		const carouselCircles = Array.from(carouselCircle.parentElement.children || [])
		carouselCircles.forEach(elm => elm.classList.remove("carousel-circle-selected"))
		carouselCircle.classList.add("carousel-circle-selected")
    })

