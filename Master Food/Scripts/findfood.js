import { el, els, on, escapeRegExp, store, isEmpty } from "./script.js"

const restaurantSearchField = el`input.search-restaurants-field`
const restaurantLinks = els`a.restaurants-list-item-link`
const findFoodSearchField = el`input.search-food-field`
const searchFoodBtn = el`button.search-food-btn`
const categoryListHeadings = els`span.category-tab-listing-item`
const categoryTabSelectorLine = el`hr.category-tab-selector-line`
const cusinesSlides = els`.cusines-slide`
const cusineListItems = els`li.cusines-list-item`
const heartIcons = els`img.heart-icon`
const orderFoodBtns = els`button.order-cusine-btn`
const foodItemWrapper = el`.selected-food-items-wrapper`
const customerImage = el`img.customer-image`
const foodLinks = els`a.food-list-item-link`
const notificationIcon = el`img.notification-icon`
const notifications = el`dialog.notifications`
const discountCarouselSlides = els`.discount-item-slide`
const discountCarouselCircles = els`.discounts-carousel > .carousel-circle`
const orderNowBtns = els`button.order-now-btn`
const totalAmount = el`span.total-price-amount`
const checkoutBtn = el`button.checkout-btn`
let currentSlideIdx = 0;

const customer = store.get("customer")

if (customer) {
	customerImage.src = "/Images/Customers/" + customer.imagePath
	customerImage.width = 30
	customerImage.height = 30

	if (store.includes("selectedRestaurant"))
		restaurantSearchField.value = store.get("selectedRestaurant").name

	displaySelectedOrders(store.session.get("orders") || [])
}

for (let link of restaurantLinks)
	on(link, "click", function (evt) {
		evt.preventDefault()
		const restaurantId = link.closest("li").dataset.restaurantId
		const name = link.querySelector("span.restaurant-name").textContent.trim()
		const location = link.querySelector("span.restaurant-location").textContent.trim()

		store.set("selectedRestaurant", { name, location, restaurantId })
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

for (let link of foodLinks)
	on(link, "click", function (evt) {
		evt.preventDefault()
		const name = link.querySelector("span.food-name").textContent.trim()

		findFoodSearchField.value = name
		findFoodSearchField.blur()
	})

on(findFoodSearchField, "input", function (evt) {

	const searchTerm = findFoodSearchField.value
	for (let link of foodLinks) {

		const regex = escapeRegExp(searchTerm.trim(), "i")

		if (regex.test(link.textContent.trim()))
			link.parentElement.style.display = "block"
		else
			link.parentElement.style.display = "none"
	}
})

on(searchFoodBtn, "click", function (evt) {

	const searchTerm = findFoodSearchField.value.trim()

	if (!isEmpty(searchTerm)) {

		const regex = escapeRegExp(searchTerm.trim(), "i")
		const link = foodLinks.find(link => regex.test(link.textContent.trim()))

		if (link !== undefined) {
			const name = link.querySelector("span.food-name").textContent.trim()
			cusineListItems.forEach(elm => {
				const searchFoodListItem = link.closest("li")
				const foodListItem = cusineListItems.find(item =>
					item.dataset.foodId == searchFoodListItem.dataset.foodId)
				foodListItem && foodListItem.scrollIntoView()

				// trigger mouseover event
				const mouseoverEvent = new Event('mouseover');
				foodListItem.dispatchEvent(mouseoverEvent);
            })
		}
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
			categoryTabSelectorLine.style.left = `calc(${headingXPos}px - 2.125vw)`
			categoryListHeadings.forEach(elm => elm.classList.remove("category-tab-listing-item-selected"))
			categoryListHeadings[idx].classList.add("category-tab-listing-item-selected")
		}
	}
}, { root: el`.cusines-list-wrapper`, threshold: 0.5 })

for (let cusinesSlide of cusinesSlides)
	observer1.observe(cusinesSlide)

const observer2 = new IntersectionObserver(function (entries, observer) {
	for (let [i, entry] of entries.entries()) {
		const discountSlide = entry.target
		const isIntersecting = entry.isIntersecting
		const entryRatio = entry.intersectionRatio

		if (isIntersecting) {
			const idx = Array.prototype
				.indexOf.call(discountSlide.parentElement.children, discountSlide)
			discountCarouselCircles
				.forEach(elm => elm.classList.remove("carousel-circle-selected"))
			discountCarouselCircles[idx]
				.classList.add("carousel-circle-selected")
		}
	}
}, { root: el`.discount-item-slides`, threshold: 0.5 })

for (let discountSlide of discountCarouselSlides)
	observer2.observe(discountSlide)

setInterval(() => {
	const currentSlide = discountCarouselSlides[currentSlideIdx]
	const remainingSpace = currentSlide.parentElement.clientWidth - currentSlide.offsetWidth;
	const spaceLeftAndRight = remainingSpace / 2;
	currentSlide.parentElement.scrollLeft = currentSlide.offsetLeft - spaceLeftAndRight;
	currentSlideIdx = currentSlideIdx == discountCarouselSlides.length-1 ?
		0 : currentSlideIdx+1;
}, 5000)

for (let [i, categoryListHeading] of categoryListHeadings.entries())
	on(categoryListHeading, "click", function (evt) {

		for (let cusinesSlide of cusinesSlides)
			observer1.unobserve(cusinesSlide)

		const headingXPos = categoryListHeading.offsetLeft
		categoryTabSelectorLine.style.left = `calc(${headingXPos}px - 2.125vw)`
		categoryListHeadings.forEach(elm => elm.classList.remove("category-tab-listing-item-selected"))
		categoryListHeading.classList.add("category-tab-listing-item-selected")

		cusinesSlides[i].parentElement.scrollLeft = cusinesSlides[i].offsetLeft

		setTimeout(() => {
			for (let cusinesSlide of cusinesSlides)
				observer1.observe(cusinesSlide)
		}, 600)
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

for (let heartIcon of heartIcons) {
	let isLiked = true
	on(heartIcon, "click", function (evt) {
		if (!customer) {
			window.location.href = "/Auth"
			return;
		}
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
					customerId: Number(customer.id)
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
	on(orderFoodBtn, "click", evt => {
		if (!customer) {
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
			totalPrice: Number(cusineListItem.querySelector("b.cusine-price").textContent.trim().slice(1)) * (store.session.get("orders")?.quantity ?? 1),
			customerId: store.get("customer").id
		}

		const orderList = store.session.get("orders")
		const foodItems = [...(orderList || []), foodItemDetails]

		if (orderList && orderList.some(x => x.foodId == foodItemId)) {
			const selectedFoodItem = els`.selected-food-item`.find(x => x.dataset.foodId == foodItemId)
			const foodItemQuantity = selectedFoodItem.querySelector(`span.selected-food-item-quantity-label`)
			const foodItemPrice = selectedFoodItem.querySelector(`span.selected-food-item-price`)

			foodItemQuantity.textContent = Number(foodItemQuantity.textContent) + 1
			const order = store.session.get("orders").find(x => x.foodId == foodItemId)
			order.quantity++
			order.totalPrice = order.price * order.quantity
			foodItemPrice.textContent = order.totalPrice
			store.session.set("orders",
				[...store.session.get("orders").filter(x => x.foodId != foodItemId), order]
			)
			totalAmount.textContent = store.session.get("orders").reduce((acc, curr) => Number(curr.totalPrice) + acc, 0)
			return;
		}

		store.session.set("orders", foodItems)
		totalAmount.textContent = store.session.get("orders").reduce((acc, curr) => Number(curr.totalPrice) + acc, 0)

		displaySelectedOrders(foodItems)
	})
}

function displaySelectedOrders(foodItems) {
	foodItemWrapper.innerHTML = ""

	const handleDecrement = `
	void async function handleDecrement(evt) {
		const {store, el} = await import("/Scripts/script.js")
        const selectedFoodItem = evt.target.closest(".selected-food-item")
        const foodItemQuantity = selectedFoodItem.querySelector("span.selected-food-item-quantity-label")
        const foodItemPrice = selectedFoodItem.querySelector("span.selected-food-item-price")

        const foodItemId = Number(selectedFoodItem.dataset.foodId)
        const order = store.session.get("orders").find(x => x.foodId == foodItemId)

        if (order.quantity == 1) {
            selectedFoodItem.remove()
            store.session.set("orders",
                store.session.get("orders").filter(x => x.foodId != foodItemId)
            )
        }
        else {
            order.quantity -= 1
            foodItemQuantity.textContent = order.quantity
            order.totalPrice = order.price * order.quantity
            foodItemPrice.textContent = order.totalPrice
            store.session.set("orders",
                [...store.session.get("orders").filter(x => x.foodId != foodItemId), order]
            )
        }

		const totalAmount = el("span.total-price-amount")
        totalAmount.textContent = store.session.get("orders").reduce((acc, curr) => Number(curr.totalPrice) + acc, 0)
    }(event)`.replace(/"/g, "'")

	const handleIncrement = `
	void async function handleIncrement(evt) {
		const {store, el} = await import("/Scripts/script.js")
        const selectedFoodItem = evt.target.closest(".selected-food-item")
        const foodItemQuantity = selectedFoodItem.querySelector("span.selected-food-item-quantity-label")
        const foodItemPrice = selectedFoodItem.querySelector("span.selected-food-item-price")

        const foodItemId = Number(selectedFoodItem.dataset.foodId)
        const order = store.session.get("orders").find(x => x.foodId == foodItemId)
        order.quantity += 1
        foodItemQuantity.textContent = order.quantity
        order.totalPrice = order.price * order.quantity
        foodItemPrice.textContent = order.totalPrice
        store.session.set("orders",
            [...store.session.get("orders").filter(x => x.foodId != foodItemId), order]
        )

		const totalAmount = el("span.total-price-amount")
        totalAmount.textContent = store.session.get("orders").reduce((acc, curr) => Number(curr.totalPrice) + acc, 0)
    }(event)`.replace(/"/g, "'")

	for (let foodItem of foodItems) {
		const selectedFoodItem = `
				<div class="selected-food-item" data-food-id=${foodItem.foodId}>
					<img src="${foodItem.image}" alt="" class="selected-food-item-image" width="80" height="75" />
					<div class="selected-food-item-name-quantity-wrapper">
						<b class="selected-food-item-name">${foodItem.name}</b><br />
						<div class="selected-food-item-quantity">
							<button class="selected-food-item-quantity-decr" onclick="${handleDecrement}">-</button>
							<span class="selected-food-item-quantity-label">${foodItem.quantity}</span>
							<button class="selected-fod-item-quantity-inc" onclick="${handleIncrement}">+</button>
						</div>
					</div>
					<span class="selected-food-item-price">${foodItem.totalPrice}</span>
				</div>`

		foodItemWrapper.innerHTML += selectedFoodItem
	}

	store.session.get("orders") && (totalAmount.textContent = store.session.get("orders").reduce((acc, curr) => Number(curr.totalPrice) + acc, 0))
}

on(notificationIcon, "click", function (evt) {
	notifications.showModal()
})

on(notifications, "click", function (evt) {
	const rect = evt.target.getBoundingClientRect()

	const isDialogClicked = (
		rect.top <= evt.clientY &&
		evt.clientY <= rect.top + rect.height &&
		rect.left <= evt.clientX &&
		evt.clientX <= rect.left + rect.width
	)

	if (!isDialogClicked)
		evt.target.close()
})


for (let orderNowBtn of orderNowBtns)
	on(orderNowBtn, "click", function (evt) {
		if (!customer) {
			window.location.href = "/Auth"
			return;
		}

		const foodItemId = evt.target.dataset.foodId
		const foodItemDetails = {
			foodId: foodItemId,
			quantity: 1,
			date: new Date(),
			image: evt.target.dataset.foodImage,
			name: evt.target.dataset.foodName,
			price: evt.target.dataset.foodPrice,
			totalPrice: evt.target.dataset.foodPrice,
			customerId: store.get("customer").id
		}

		const orderList = store.session.get("orders")
		const foodItems = [...(orderList || []), foodItemDetails]

		if (orderList && orderList.some(x => x.foodId == foodItemId)) {
			const selectedFoodItem = els`.selected-food-item`.find(x => x.dataset.foodId == foodItemId)
			const foodItemQuantity = selectedFoodItem.querySelector(`span.selected-food-item-quantity-label`)
			const foodItemPrice = selectedFoodItem.querySelector(`span.selected-food-item-price`)

			const order = store.session.get("orders").find(x => x.foodId == foodItemId)
			foodItemQuantity.textContent = ++order.quantity
			order.totalPrice = order.price * order.quantity
			foodItemPrice.textContent = order.totalPrice
			store.session.set("orders",
				[...store.session.get("orders").filter(x => x.foodId != foodItemId), order]
			)
			totalAmount.textContent = store.session.get("orders").reduce((acc, curr) => Number(curr.totalPrice) + acc, 0)
			return;
		}
		
		store.session.set("orders", foodItems)
		totalAmount.textContent = store.session.get("orders").reduce((acc, curr) => Number(curr.totalPrice) + acc, 0)

		displaySelectedOrders(foodItems)
	})

on(checkoutBtn, "click", async function(evt) {
	const orders = store.session.get("orders")
	if (orders == null)
		return;

	if (!store.includes("selectedRestaurant")) {
		alert("Please select a restaurant")
		restaurantSearchField.scrollIntoView()
		restaurantSearchField.focus()
		return;
	}

	const data = new Array()
	const restaurantId = store.get("selectedRestaurant").restaurantId

	for (let order of orders)
		data.push({
			CustomerId: Number(order.customerId),
			FoodItemId: Number(order.foodId),
			RestaurantId: Number(restaurantId),
			Quantity: Number(order.quantity)
		})

	const res = await fetch("/FindFood/AcceptOrders", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ data })
	})

	const json = await res.json()

	if (json.isAdded)
		alert("Order Successful!"),
		store.session.remove("orders")
		window.location.reload()
})