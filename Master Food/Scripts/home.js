import { el, els, on, escapeRegExp, store, isEmpty } from "./script.js"

const restaurantSearchField = el`input.search-restaurents-field`
const restaurantLinks = els`a.restaurents-list-item-link`
const searchRestaurantsBtn = el`button.search-restaurents-btn`
const discoverMenuBtn = el`button.discover-menu-btn`
const categoryListHeadings = els`span.category-tab-listing-item`
const categoryTabSelectorLine = el`hr.category-tab-selector-line`
const cusineListItems = els`li.cusines-list-item`
const cusinesSlides = els`.cusines-slide`
const testimonialsCarouselSlide = els`.testimonials-carousel-slide`
const carouselCircles = els`span.carousel-circle`
const cusinesCarouselCircles = els`.cusines-carousel-circles > .carousel-circle`
const testimonialsCarouselCircles = els`.testimonials-carousel-circles > .carousel-circle`
const heartIcons = els`img.heart-icon`
const orderFoodBtns = els`button.order-cusine-btn`

const isCustomerLoggedIn = store.includes("customer")

isCustomerLoggedIn &&
	heartIcons.forEach(elm => {
		const foodItemId = Number(elm.closest("li").dataset.foodId)
		if (store.includes("likedFoodItems") && store.get("likedFoodItems").find(x => x.foodId == foodItemId))
			elm.setAttribute("src", "/Images/Icons/heart-icon-filled.svg")
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

on(searchRestaurantsBtn, "click", function (evt) {

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


for (let [i, categoryListHeading] of categoryListHeadings.entries())
	on(categoryListHeading, "click", function (evt) {
		const headingXPos = categoryListHeading.offsetLeft
		categoryTabSelectorLine.style.left = `calc(${headingXPos}px - 0.625vw)`
		categoryListHeadings.forEach(elm => elm.classList.remove("category-tab-listing-item-selected"))
		categoryListHeading.classList.add("category-tab-listing-item-selected")

		cusinesSlides[i].parentElement.scrollLeft = cusinesSlides[i].offsetLeft
		const carouselCircles = els`.cusines-carousel-circles > span.carousel-circle`
		carouselCircles.forEach(elm => elm.classList.remove("carousel-circle-selected"))
		carouselCircles[i].classList.add("carousel-circle-selected")
	})

for (let cusineListItem of cusineListItems) {
	const cusineInfoOverlay = cusineListItem.querySelector(".cusines-list-info")

	on(cusineListItem, "mouseover", function (evt) {
		const listItem = cusineInfoOverlay.closest("li.cusines-list-item")
		const listItemRect = listItem.getBoundingClientRect()
		const imageRect = listItem.querySelector("img.cusine-image").getBoundingClientRect()
		cusineInfoOverlay.style.bottom = listItemRect.height - imageRect.height + "px"
		cusineInfoOverlay.style.height = "160px"
	})

	on(cusineListItem, "mouseout", function (evt) {
		cusineInfoOverlay.style.height = "0px"
	})
}

for (let [i, carouselCircle] of carouselCircles.entries())
	on(carouselCircle, "click", function (evt) {

		if (carouselCircle.parentElement.matches(".cusines-carousel-circles")) {
			categoryListHeadings[i].click()
		}
		else {
			const idx = i - carouselCircle.parentElement.children.length - 1
			const carouselCircles = Array.from(carouselCircle.parentElement.children || [])
			carouselCircles.forEach(elm => elm.classList.remove("carousel-circle-selected"))
			carouselCircle.classList.add("carousel-circle-selected")
			testimonialsCarouselSlide[idx].parentElement.scrollLeft = testimonialsCarouselSlide[idx].offsetLeft
        }
	})

const observer1 = new IntersectionObserver(function (entries, observer) {
	for (let [i, entry] of entries.entries()) {
		const cusinesSlide = entry.target
		const isIntersecting = entry.isIntersecting

		if (isIntersecting) {
			const idx = Array.prototype
				.indexOf.call(cusinesSlide.parentElement.children, cusinesSlide)

			const headingXPos = categoryListHeadings[idx].offsetLeft
			categoryTabSelectorLine.style.left = `calc(${headingXPos}px - 0.625vw)`
			categoryListHeadings.forEach(elm => elm.classList.remove("category-tab-listing-item-selected"))
			categoryListHeadings[idx].classList.add("category-tab-listing-item-selected")

			cusinesCarouselCircles
				.forEach(elm => elm.classList.remove("carousel-circle-selected"))
			cusinesCarouselCircles[idx]
				.classList.add("carousel-circle-selected")
		}
	}
}, { root: el`.cusines-list-wrapper`, threshold: 0.5 })

for (let cusinesSlide of cusinesSlides)
	observer1.observe(cusinesSlide)

const observer2 = new IntersectionObserver(function (entries, observer) {
	for (let [i, entry] of entries.entries()) {
		const testimonialSlide = entry.target
		const isIntersecting = entry.isIntersecting
		const entryRatio = entry.intersectionRatio

		if (isIntersecting) {
			const idx = Array.prototype
				.indexOf.call(testimonialSlide.parentElement.children, testimonialSlide)
			testimonialsCarouselCircles
				.forEach(elm => elm.classList.remove("carousel-circle-selected"))
			testimonialsCarouselCircles[idx]
				.classList.add("carousel-circle-selected")
		}
	}
}, { root: el`.testimonials-carousel`, threshold: 0.5 })

for (let testimonialSlide of testimonialsCarouselSlide)
	observer2.observe(testimonialSlide)


for (let heartIcon of heartIcons) {
	let isLiked = true
	on(heartIcon, "click", function (evt) {
		heartIcon.setAttribute("src", "/Images/Icons/" + (isLiked ? "heart-icon-filled.svg" : "heart-icon.svg"))

		const foodItemId = Number(heartIcon.closest("li").dataset.foodId)
		if (isLiked) {

			fetch("/Home/AddToFavFoods", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json"
				},
				body: JSON.stringify({
					foodId: foodItemId,
					customerId: Number(store.get("customer").id)
				})
			})
				.then(res => res.json())
				.then(data => {
					const foodItem = { id: data.favFoodId, foodId: foodItemId }
					store.set("likedFoodItems",
						store.includes("likedFoodItems")
							? [...store.get("likedFoodItems"), foodItem]
							: [foodItem])
				})
		}
		else if (store.includes("likedFoodItems")) {
			const foodItems = store.get("likedFoodItems")
			const id = foodItems.find(foodItem => foodItem.foodId == foodItemId).id

			fetch("/Home/RemoveFromFavFoods/" + id, { method: "DELETE" }).then(_ =>
				store.set("likedFoodItems", foodItems.filter(foodItem => foodItem.foodId != foodItemId)))
		}

		isLiked = !isLiked
	})
}

for (let orderFoodBtn of orderFoodBtns) {
	on(orderFoodBtn, "click", function (evt) {

		if (!store.includes("customer")) {
			window.location.href = "/Auth"
			return;
		}

		const cusineListItem = orderFoodBtn.closest("li")

		const foodItemId = Number(cusineListItem.dataset.foodId)
		const foodItemDetails = {
			foodId: foodItemId,
			date: new Date(),
			quantity: 1,
			image: cusineListItem.querySelector("img.cusine-image").src,
			name: cusineListItem.querySelector(".cusine-name").textContent.trim(),
			price: cusineListItem.querySelector("b.cusine-price").textContent.trim().slice(1),
			totalPrice: cusineListItem.querySelector("b.cusine-price").textContent.trim().slice(1),
			customerId: store.get("customer").id
		}

		const orderList = store.session.get("orders")
		const foodItems = [...(orderList || []), foodItemDetails]

		if (orderList && orderList.some(x => x.foodId == foodItemId)) {
			const order = store.session.get("orders").find(x => x.foodId == foodItemId)
			order.quantity++
			order.totalPrice = order.price * order.quantity
			store.session.set("orders",
				[...store.session.get("orders").filter(x => x.foodId != foodItemId), order]
			)
			return;
		}

		store.session.set("orders", foodItems)
		window.location.href = "/FindFood"
    })
}