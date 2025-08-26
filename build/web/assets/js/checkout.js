

// PayHere payment callbacks
payhere.onCompleted = function onCompleted(orderId) {
    const popup = new Notification();
    popup.success({
        message: "Payment completed successfully. Order Id: " + orderId 
    });
    
    // Redirect to success page or reload cart
    setTimeout(() => {
        window.location = "index.html";
    }, 2000);
};

payhere.onDismissed = function onDismissed() {
    console.log("Payment dismissed by user");
    const popup = new Notification();
    popup.error({
        message: "Payment was cancelled"
    });
};

payhere.onError = function onError(error) {
    console.log("Payment Error: " + error);
    const popup = new Notification();
    popup.error({
        message: "Payment failed: " + error
    });
};

async function loadCheckoutData() {
    const popup = new Notification();

    try {
        const response = await fetch("LoadCheckoutData");

        if (response.ok) {
            const json = await response.json();

            if (json.status) {
                console.log(json);
                const userAddress = json.userAddress;
                const cityList = json.cityList;
                const cartItems = json.cartList;
                const deliveryTypes = json.deliveryTypes;

                const city_select = document.getElementById("city-select");

                // Clear existing options except the first one
                city_select.innerHTML = '<option value="0">Select</option>';

                cityList.forEach(city => {
                    let option = document.createElement("option");
                    option.value = city.id;
                    option.innerHTML = city.name;
                    city_select.appendChild(option);
                });

                //load current address
                const current_address_checkbox = document.getElementById("checkbox1");

                current_address_checkbox.addEventListener("change", function () {
                    let first_name = document.getElementById("first-name");
                    let last_name = document.getElementById("last-name");
                    let line_one = document.getElementById("line-one");
                    let line_two = document.getElementById("line-two");
                    let postal_code = document.getElementById("postal-code");
                    let mobile = document.getElementById("mobile");

                    if (current_address_checkbox.checked) {
                        first_name.value = userAddress.user.first_name;
                        last_name.value = userAddress.user.last_name;
                        city_select.value = userAddress.city.id;
                        city_select.disabled = true;
                        city_select.dispatchEvent(new Event("change"));
                        line_one.value = userAddress.lineOne;
                        line_two.value = userAddress.lineTwo;
                        postal_code.value = userAddress.postalCode;
                        mobile.value = userAddress.mobile;
                    } else {
                        first_name.value = "";
                        last_name.value = "";
                        city_select.value = 0;
                        city_select.disabled = false;
                        city_select.dispatchEvent(new Event("change"));
                        line_one.value = "";
                        line_two.value = "";
                        postal_code.value = "";
                        mobile.value = "";
                    }
                });

                //cart details
                let st_tbody = document.getElementById("st-tbody");
                let st_item_tr = document.getElementById("st-item-tr");
                let st_subtotal_tr = document.getElementById("st-subtotal-tr");
                let st_order_shipping_tr = document.getElementById("st-order-shipping-tr");
                let st_order_total_tr = document.getElementById("st-order-total-tr");

                st_tbody.innerHTML = "";

                let total = 0;
                let item_count = 0;

                cartItems.forEach(cart => {
                    let st_item_tr_clone = st_item_tr.cloneNode(true);
                    st_item_tr_clone.querySelector("#st-product-title").innerHTML = cart.product.title;
                    st_item_tr_clone.querySelector("#st-product-qty").innerHTML = cart.qty;
                    item_count += cart.qty;
                    let item_sub_total = Number(cart.qty) * Number(cart.product.price);

                    st_item_tr_clone.querySelector("#st-product-price").innerHTML = new Intl.NumberFormat(
                            "en-US",
                            {
                                minimumFractionDigits: 2
                            })
                            .format(item_sub_total);
                    st_tbody.appendChild(st_item_tr_clone);

                    total += item_sub_total;
                });

                st_subtotal_tr.querySelector("#st-product-total-amount").innerHTML = new Intl.NumberFormat(
                        "en-US",
                        {
                            minimumFractionDigits: 2
                        })
                        .format(total);
                st_tbody.appendChild(st_subtotal_tr);

                let shipping_charges = 0;
                city_select.addEventListener("change", (e) => {
                    let cityName = city_select.options[city_select.selectedIndex].innerHTML;
                    
                    // Remove existing shipping and total rows
                    const existingShippingRow = document.querySelector('#st-order-shipping-tr');
                    const existingTotalRow = document.querySelector('#st-order-total-tr');
                    if (existingShippingRow && existingShippingRow.parentNode) {
                        existingShippingRow.remove();
                    }
                    if (existingTotalRow && existingTotalRow.parentNode) {
                        existingTotalRow.remove();
                    }

                    if (cityName.toLowerCase() === "colombo") {
                        shipping_charges = deliveryTypes[0].price;
                    } else if (cityName !== "Select") {
                        shipping_charges = deliveryTypes[1].price;
                    } else {
                        shipping_charges = 0;
                    }

                    if (shipping_charges > 0) {
                        // Clone and add shipping row
                        let shipping_row_clone = st_order_shipping_tr.cloneNode(true);
                        shipping_row_clone.querySelector("#st-product-shipping-charges").innerHTML = new Intl.NumberFormat(
                                "en-US",
                                {
                                    minimumFractionDigits: 2
                                }).format(shipping_charges);
                        st_tbody.appendChild(shipping_row_clone);

                        // Clone and add total row
                        let total_row_clone = st_order_total_tr.cloneNode(true);
                        total_row_clone.querySelector("#st-order-total-amount")
                                .innerHTML = new Intl.NumberFormat(
                                        "en-US",
                                        {
                                            minimumFractionDigits: 2
                                        }).format(shipping_charges + total);
                        st_tbody.appendChild(total_row_clone);
                    }
                });

                // Trigger change event if address is pre-filled
                if (userAddress && current_address_checkbox.checked) {
                    city_select.dispatchEvent(new Event("change"));
                }

            } else {
                if (json.message === "Empty cart") {
                    popup.error({
                        message: "Empty cart. Please add some products"
                    });
                    window.location = "index.html";
                } else {
                    popup.error({
                        message: json.message
                    });
                }
            }

        } else {
            if (response.status === 401) {
                popup.error({
                    message: "Please sign in to continue"
                });
                window.location = "sign-in.html";
            } else {
                popup.error({
                    message: "Failed to load checkout data"
                });
            }
        }

    } catch (error) {
        console.error('Error loading checkout data:', error);
        popup.error({
            message: "Network error occurred"
        });
    }
}

async function checkout() {
    const popup = new Notification();
    
    try {
        let checkbox1 = document.getElementById("checkbox1").checked;
        let first_name = document.getElementById("first-name");
        let last_name = document.getElementById("last-name");
        let line_one = document.getElementById("line-one");
        let line_two = document.getElementById("line-two");
        let postal_code = document.getElementById("postal-code");
        let mobile = document.getElementById("mobile");
        const city_select = document.getElementById("city-select");

        // Validate form data
        if (!checkbox1) {
            if (!first_name.value.trim()) {
                popup.error({ message: "First name is required" });
                first_name.focus();
                return;
            }
            if (!last_name.value.trim()) {
                popup.error({ message: "Last name is required" });
                last_name.focus();
                return;
            }
            if (city_select.value === "0") {
                popup.error({ message: "Please select a city" });
                city_select.focus();
                return;
            }
            if (!line_one.value.trim()) {
                popup.error({ message: "Address line 1 is required" });
                line_one.focus();
                return;
            }
            if (!line_two.value.trim()) {
                popup.error({ message: "Address line 2 is required" });
                line_two.focus();
                return;
            }
            if (!postal_code.value.trim()) {
                popup.error({ message: "Postal code is required" });
                postal_code.focus();
                return;
            }
            if (!mobile.value.trim()) {
                popup.error({ message: "Mobile number is required" });
                mobile.focus();
                return;
            }
        }

        let data = {
            isCurrentAddress: checkbox1,
            firstName: first_name.value.trim(),
            lastName: last_name.value.trim(),
            citySelect: city_select.value,
            lineOne: line_one.value.trim(),
            lineTwo: line_two.value.trim(),
            postalCode: postal_code.value.trim(),
            mobile: mobile.value.trim()
        };

        let dataJSON = JSON.stringify(data);

        // Show loading state
        const checkoutBtn = document.querySelector('.checkout-btn');
        const originalText = checkoutBtn.textContent;
        checkoutBtn.textContent = 'Processing...';
        checkoutBtn.disabled = true;

        const response = await fetch("Checkout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: dataJSON
        });

        // Reset button state
        checkoutBtn.textContent = originalText;
        checkoutBtn.disabled = false;

        if (response.ok) {
            const json = await response.json();
            if (json.status) {
                console.log("Checkout response:", json);
                
                // Validate PayHere JSON before starting payment
                if (json.payhereJson && json.payhereJson.amount && parseFloat(json.payhereJson.amount) > 0) {
                    console.log("Starting PayHere payment with:", json.payhereJson);
                    payhere.startPayment(json.payhereJson);
                } else {
                    popup.error({
                        message: "Payment configuration error"
                    });
                }
            } else {
                popup.error({
                    message: json.message || "Checkout failed"
                });
            }
        } else {
            if (response.status === 401) {
                popup.error({
                    message: "Please sign in to continue"
                });
                window.location = "sign-in.html";
            } else {
                popup.error({
                    message: "Server error occurred. Please try again."
                });
            }
        }

    } catch (error) {
        console.error('Checkout error:', error);
        popup.error({
            message: "Network error. Please check your connection and try again."
        });
        
        // Reset button state in case of error
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.textContent = 'Process to Checkout';
            checkoutBtn.disabled = false;
        }
    }
}