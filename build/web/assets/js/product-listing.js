
var brandList;

async function loadProductData() {
    const response = await fetch("LoadProductData");

    if (response.ok) {
        const json = await response.json();
        if (json.status) {
            //load brands only
            loadSelect("brand", json.brandList, "name");
            brandList = json.brandList;
        } else {
            showMessage("Unable to get product data! Please try again later", "error");
        }
    } else {
        showMessage("Unable to get product data! Please try again later", "error");
    }
}

function loadSelect(selectId, list, property) {
    const select = document.getElementById(selectId);
    list.forEach(item => {
        const option = document.createElement("option");
        option.value = item.id;
        option.innerHTML = item[property];
        select.appendChild(option);
    });
}

async function saveProduct() {
    const brandId = document.getElementById("brand").value;
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const price = document.getElementById("price").value;
    const qty = document.getElementById("qty").value;
    const image = document.getElementById("image").files[0];

    const form = new FormData();
    form.append("brandId", brandId);
    form.append("title", title);
    form.append("description", description);
    form.append("price", price);
    form.append("qty", qty);
    form.append("image", image);

    try {
        const response = await fetch("SaveProduct", {
            method: "POST",
            body: form
        });
    
        if (response.ok) {
            const json = await response.json();
            if (json.status) {
                showMessage("New Product added successfully!", "success");
                resetForm();
                setTimeout(() => {
                    closeModal();
                }, 2000);
            } else {
                showMessage(json.message, "error");
            }
        } else {
            showMessage("Network error occurred. Please try again.", "error");
        }
    } catch (error) {
        showMessage("An error occurred: " + error.message, "error");
    }
}

function showMessage(message, type) {
    const messageDiv = document.getElementById("message");
    messageDiv.textContent = message;
    messageDiv.className = type;
    messageDiv.style.display = "block";
    
    setTimeout(() => {
        messageDiv.style.display = "none";
    }, 5000);
}

function resetForm() {
    document.getElementById("brand").value = 0;
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("price").value = "0.00";
    document.getElementById("qty").value = 1;
    document.getElementById("image").value = "";
    
    // Reset file input label
    const label = document.querySelector('label[for="image"]');
    label.textContent = "Choose Image";
}

function openModal() {
    document.getElementById("productModal").classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeModal() {
    document.getElementById("productModal").classList.remove("active");
    document.body.style.overflow = "auto";
    resetForm();
}