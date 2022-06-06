import {
    el, els, on, store, isEmpty, emitEvent,
    style, titleCaseToCababCase, camelCaseToCababCase,
    cababCaseToCamelCase,
    validateUsername, validatePassword,
    validateEmail, validateAddress,
    validateContactNumber, validateBankAccNo
} from "./script.js"

const profileForm = el`form.profile-detail-form`
const profileImage = el`img.profile-image`
const profileImageOverlay = el`.profile-image-overlay`
const profileEditBtn = el`button.profile-edit-btn`
const profileLogoutBtn = el`button.profile-logout-btn`
const customerNameInput = el`input.customer-name`
const customerEmailInput = el`input.customer-email`
const customerImageInput = el`input.customer-image-input`
const customerPasswordInput = el`input.customer-password`
const customerAddressInput = el`input.customer-address`
const customerContactNumberInput = el`input.contact-number`
const customerBankAccNoInput = el`input.customer-bank-acc-no`
const adminStandinUserLoginIdInput = el`input.user-id`
const contactNumberGeographic = el`small.geographics-detail-contact-number`
const contactAddressGeographic = el`small.geographics-detail-address`
const hiddenInputs = els`.customer-details > input:not(input.customer-name, input.customer-email)`
const editProfileInputs = [customerNameInput, customerEmailInput, ...hiddenInputs]
const orderListsTable = el`table.order-lists-table`
const orderCategoryHeadings = els`span.order-category-heading`
const totalOrdersElm = el`span.total-order-count`
const totalMoneySpentElm = el`span.total-money-spent`
const latestOrderDtElm = el`small.geographics-detail-last-order`

const getAdminEditableElms = () => els`span.order-list-item-description`
    .filter(elm => !elm.closest("td").classList.contains("list-item-id"))


const customer = store.get("customer")
const completedOrdersChangedRows = []

customerNameInput.value = customer.name
customerEmailInput.value = customer.email

if (customer.address)
    customerAddressInput.value = customer.address

if (customer.contactNumber)
    contactNumberGeographic.textContent = customer.contactNumber

if (customer.address)
    contactAddressGeographic.textContent = customer.address

if (customer.imagePath)
    setProfileImageStyles(),
        profileImage.src = "../Images/Customers/" + customer.imagePath + `?nocache=${new Date().getTime()}`


async function fetchFoodItems(productOptionList) {

    const res = await fetch("/Dashboard/GetFoodItems")
        .catch(e => console.log(e))

    const data = await res.json()
        .catch(e => console.log(e))

    createDropdownDetails(data, productOptionList)
}

void async function fetchOrders() {
    const res = await fetch("/Dashboard/GetOrders/" + customer.id)
        .catch(e => console.log(e))

    const data = await res.json()
        .catch(e => console.log(e))

    totalOrdersElm.textContent = data.orders.length
    totalMoneySpentElm.textContent = data.totalMoneySpent
    latestOrderDtElm.textContent = data.latestOrderDate

    orderListsTable.appendChild(createOrdersTbody(data, _ => true, "all-orders"))
    orderListsTable.appendChild(createOrdersTbody(data, order => order.status == "completed", "completed-orders"))
    orderListsTable.appendChild(createOrdersTbody(data, order => order.status == "pending", "pending-orders"))
    orderListsTable.appendChild(createOrdersTbody(data, order => order.status == "cancelled", "cancelled-orders"))

    const tbodies = els`table.order-lists-table > tbody`

    for (let [i, heading] of orderCategoryHeadings.entries())
        on(heading, "click", function (evt) {
            tbodies.forEach((elm, j) => elm.style.display = j !== i ? "none" : "table-row-group")
            orderCategoryHeadings.forEach((elm, j) => j !== i ? elm.classList.remove("selected-order") : elm.classList.add("selected-order"))
        })
}()

function createOrdersTbody({ orders }, predicate, className) {
    const tbody = document.createElement("tbody")
    tbody.className = className

    for (let order of orders.filter(predicate)) {

        const tr = document.createElement("tr")
        tr.className = "order-list-row"

        createOrderList(tr, order)
        tbody.appendChild(tr)
    }

    return tbody
}

function createDropdownDetails(data, productOptionList) {
    const columnName = productOptionList.closest("td").classList[1]
    const enclosingCellTextElm = productOptionList.previousElementSibling

    if (columnName == "list-item-product-name") {
        for (let foodItem of data.foodItems) {
            const productOption = document.createElement("li")
            productOption.className = "product-option"
            productOptionList.appendChild(productOption)

            productOption.textContent = foodItem.name

            on(productOption, "click", function (evt) {
                const enclosingCellTextElm = evt.target.closest("td").querySelector("span.order-list-item-description")
                enclosingCellTextElm.textContent = evt.target.textContent
            })

            on(productOption, "mousedown", evt =>
                evt.preventDefault())
        }
    }
    else if (columnName == "list-item-ordered-date") {

        on(enclosingCellTextElm, "focus", () => {
            productOptionList.style.display = "none"
            flatpickr(productOptionList.previousElementSibling, {
                defaultDate: enclosingCellTextElm.textContent,
                dateFormat: "d-m-Y",
                onChange(selectedDates, dateStr, instance) {
                    enclosingCellTextElm.textContent = dateStr
                },
                onClose(selectedDates, dateStr, instance) {
                    enclosingCellTextElm.textContent = dateStr
                    instance.destroy()
                }
            })
            on(el`.flatpickr-calendar`, "mousedown", evt =>
                evt.preventDefault())
        })
    }

    else if (columnName == "list-item-product-price")
        on(enclosingCellTextElm, "focus", () =>
            productOptionList.style.display = "none")

    else if (columnName == "list-item-status") {
        const deliveryStates = ["cancelled", "pending", "completed"]
        for (let status of deliveryStates) {
            const productOption = document.createElement("li")
            productOption.className = "product-option"
            productOptionList.appendChild(productOption)

            productOption.textContent = status

            on(productOption, "click", function (evt) {
                const enclosingCellTextElm = evt.target.closest("td").querySelector("span.order-list-item-description")
                enclosingCellTextElm.textContent = evt.target.textContent
            })

            on(productOption, "mousedown", evt =>
                evt.preventDefault())
        }
    }
}

on(profileLogoutBtn, "click", function (evt) {
    store.clear()
    store.session.clear()
	window.location.href = "/"
})

let isEditable = false
on(profileEditBtn, "click", function (evt) {
    isEditable = !isEditable
    profileEditBtn.textContent = isEditable ? "Save" : "Edit"
    emitEvent(profileForm, isEditable ? "profileEditable" : "profileSaveable")
})

on(profileForm, "profileEditable", function (evt) {
    setTimeout(() => customerNameInput.focus(), 100)
    hiddenInputs.forEach(elm => style(elm, { display: "inline-block" }))
    style(profileImageOverlay, { display: "block" })
    if (!store.get("customer").imagePath)
        profileImage.src = "../Images/Icons/camera-icon.svg",
            unsetProfileImageStyles()
    if (store.get("customer").type == "admin")
        enableAdminEdit()
    else
        adminStandinUserLoginIdInput.style.display = "none"

    editProfileInputs.forEach(elm => elm.disabled = false)
})

on(profileForm, "profileSaveable", async function (evt) {
    let Image = customerImageInput.files[0]
    const Id = store.get("customer").id
    const Name = customerNameInput.value.trim()
    const Email = customerEmailInput.value.trim()
    const Password = customerPasswordInput.value.trim()
    const Address = customerAddressInput.value.trim()
    const ContactNumber = customerContactNumberInput.value.trim()
    const BankAccNo = customerBankAccNoInput.value.trim()
    const adminStandinUserLoginId = adminStandinUserLoginIdInput.valueAsNumber

    const ImagePath = !!Name && !!Image ?
        titleCaseToCababCase(Name) + "." + Image.type.replace(/(.*)\//g, '') :
        !!Image ? titleCaseToCababCase(store.get("customer").name) + "." + Image.type.replace(/(.*)\//g, '') : null

    const Type = store.get("customer").type

    if (!!Image)
        Image = await new Promise((resolve, _) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(Image);
        }).catch(e => {
            Image = null;
            alert("An error occured while uploading your profile picture")
        })
    else
        Image = null

    if (completedOrdersChangedRows.length > 0) {
        const res = await fetch("/Dashboard/EditOrderDetails", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-type": "application/json"
            },
            body: JSON.stringify({ data: completedOrdersChangedRows })
        })
            .catch(e => alert("An error occured while updating the order details"))

        const data = await res.json()
            .catch(error => alert("An error occured while updating the order details"))

        console.log(data)

        if (!data.isEdited)
            alert("Looks like the order details were invalid")
    }

    if (profileForm.checkValidity()) {

        const res = await fetch("/Dashboard/EditProfile", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                data: {
                    ImagePath, Image,
                    Type: !!adminStandinUserLoginId ? null : Type,
                    Id: !!adminStandinUserLoginId ? adminStandinUserLoginId : Id,
                    Name: !!Name ? Name : null,
                    Password: !!Password ? Password : null,
                    Email: !!Email ? Email : null,
                    Address: !!Address ? Address : null,
                    ContactNumber: !!ContactNumber ? ContactNumber : 0,
                    BankAccNo: !!BankAccNo ? BankAccNo : null
                }
            })
        })

        const data = await res.json()
            .catch(error => alert("An error occured while updating your account; Please try again. If the problem persists, please contact the admin."))

        if (data.isEdited) {
            delete data.isEdited
            store.set("customer", { ...data, isValidCustomer: true })
            editProfileInputs.forEach(elm => elm.disabled = true)
            window.location.reload()
        }
        else
            alert("Looks like the username you entered already exists")
    }
    else {
        alert(
            validateUsername(customerNameInput.validity)
            || validatePassword(customerPasswordInput.validity)
            || validateEmail(customerEmailInput.validity)
            || validateAddress(customerAddressInput.validity)
            || validateContactNumber(customerContactNumberInput.validity)
            || validateBankAccNo(customerBankAccNoInput.validity))
    }
})

on(customerImageInput, "input", function (evt) {
    const image = evt.target.files[0]
    setProfileImageStyles()
    profileImage.src = URL.createObjectURL(image)
})

function setProfileImageStyles() {
    style(profileImage, {
        aspectRatio: "1/1",
        height: "100px",
        objectFit: "cover",
        borderRadius: "50%"
    })

}

function unsetProfileImageStyles() {
    style(profileImage, {
        aspectRatio: "unset",
        height: "50px",
        objectFit: "unset",
        borderRadius: "unset"
    })
}

function createOrderList(listRow, order) {

    Object.entries(order).forEach(([orderName, value]) => {

        listRow.dataset[orderName] = value
        let listItemCell = createOrderListItem(order[orderName], "order-list-item list-item-" + camelCaseToCababCase(orderName))

        listItemCell.classList.add()
        listItemCell.spellcheck = false

        listItemCell.dataset[orderName]
        listRow.appendChild(listItemCell)
    })
}

function createOrderListItem(text, className) {
    const listItemCell = document.createElement("td")
    listItemCell.className = className

    const listItemCellText = document.createElement("span")
    listItemCellText.className = "order-list-item-description"
    listItemCellText.textContent = text

    listItemCell.appendChild(listItemCellText)

    const productOptionList = document.createElement("ul")
    productOptionList.className = "product-option-list"
    listItemCell.appendChild(productOptionList)

    fetchFoodItems(productOptionList)

    let cellTextContent;

    on(listItemCellText, "focus", function (evt) {
        cellTextContent = evt.target.textContent
        productOptionList.style.display = "inline-block"
    })

    on(listItemCellText, "blur", function (evt) {
        if (!isEmpty(evt.target.textContent) && cellTextContent !== evt.target.textContent) {
            const changedCellName = cababCaseToCamelCase(evt.target.closest("td").classList[1].replace("list-item-", ""))
            completedOrdersChangedRows.push({
                id: Number(evt.target.closest("tr").dataset.id),
                orderedDate: null,
                productName: null,
                productPrice: null,
                status: null,
                [changedCellName]: evt.target.textContent
            })
        }
        setTimeout(() => productOptionList.style.display = "none", 100)
    })

    return listItemCell
}

function enableAdminEdit() {
    for (let elm of getAdminEditableElms())
        elm.contentEditable = true
}

