import {
    el, els, on, escapeRegExp, store, isEmpty, emitEvent,
    style, titleCaseToCababCase,
    validateUsername, validatePassword,
    validateEmail, validateAddress,
    validateBankAccNo
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
const customerBankAccNoInput = el`input.customer-bank-acc-no`
const hiddenInputs = els`.customer-details > input:not(input.customer-name, input.customer-email)`
const editProfileInputs = [customerNameInput, customerEmailInput, ...hiddenInputs]

const customer = store.get("customer")

customerNameInput.value = customer.name
customerEmailInput.value = customer.email

if (customer.address)
    customerAddressInput.value = customer.address

if (customer.imagePath)
    setProfileImageStyles(),
        profileImage.src = "../Images/Customers/" + customer.imagePath +`?nocache=${new Date().getTime()}`

on(profileLogoutBtn, "click", function (evt) {
	store.remove("customer")
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

    editProfileInputs.forEach(elm => elm.disabled = false)
})

on(profileForm, "profileSaveable", async function (evt) {
    let Image = customerImageInput.files[0]
    const Id = store.get("customer").id
    const Name = customerNameInput.value.trim()
    const Email = customerEmailInput.value.trim()
    const Password = customerPasswordInput.value.trim()
    const Address = customerAddressInput.value.trim()
    const BankAccNo = customerBankAccNoInput.value.trim()
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

    if (profileForm.checkValidity()) {

        const res = await fetch("/Dashboard/EditProfile", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                data: {
                    Id, Type, ImagePath, Image,
                    Name: !!Name ? Name : null,
                    Password: !!Password ? Password : null,
                    Email: !!Email ? Email : null,
                    Address: !!Address ? Address : null,
                    BankAccNo: !!BankAccNo ? BankAccNo : null
                }
            })
        })

        const data = await res.json()
            .catch(error => alert("An error occured while updating your account; Please try again. If the problem persists, please contact the admin."))

        if (data.isEdited) {
            delete data.isEdited
            store.set("customer", { ...data, isValidCustomer: true })
            window.location.reload()
        }
        else
            alert("Looks like the username you entered already exists")
    }
    else {
        alert(
            validateUsername(customerNameInput.validity)
            || validateEmail(customerEmailInput.validity)
            || validateAddress(customerAddressInput.validity)
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

