import { el, els, on, store } from "./script.js"

const feedbackForm = el`form.customer-feedback-form`
const satisfactionScale = el`input.satisfaction-scale`
const feedbackField = el`textarea.feedback-input-box`

on(feedbackForm, "submit", async function (evt) {
    evt.preventDefault()

	const data = {
		CustomerId: Number(store.get("customer").id),
		Comment: feedbackField.value,
		Rating: Number(satisfactionScale.value)
	}

	console.log(data)

	const res = await fetch("/Feedback/AcceptFeedback", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ data })
	})

	const json = await res.json()

	if (json.isAdded)
		alert("Thank you for your Feedback"),
		window.location.href = "/"
})