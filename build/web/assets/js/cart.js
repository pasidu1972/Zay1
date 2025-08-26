async function loadCartItems() {
    const popup = new Notification();
    const response = await fetch("LoadCartItems");
    if (response.ok) {

        const json = await response.json();
        if (json.status) {
            //  console.log(json.cartItems);
            const cart_item_container = document.getElementById("cart-item-container");
            cart_item_container.innerHTML = "";

            let total = 0;
            let totalQty = 0;

            json.cartItems.forEach(cart => {
                let productSubTotal = cart.product.price * cart.qty;
                total += productSubTotal;
                totalQty += cart.qty;

                let tableData = ` <tr id="cart-item-row">
                                        <td class="product-remove">
                                            <a href="#" class="remove-wishlist" onclick="removeFromCart(${cart.product.id })">
                                                <i class="fal fa-times"></i>
                                            </a>
                                        </td>
                                        <td class="product-thumbnail"><a href="#"><img src="assets/img/${cart.product.id }/image1.png" alt="Product"></a></td>
                                        <td class="product-title"><a href="#">${cart.product.title}</a></td>
                                        <td class="product-price" data-title="Price"><span class="currency-symbol">Rs. </span><span>${new Intl.NumberFormat(
                        "en-US",
                        {
                            minimumFractionDigits: 2
                        })
                        .format(cart.product.price)}</span></td>
                                        <td class="product-quantity" data-title="Qty">
                                            <div class="pro-qty">
                                                <input type="number" class="quantity-input" value="${cart.qty}" onchange="updateCartQuantity(${cart.product.id}, this.value)">
                                            </div>
                                        </td>
                                        <td class="product-subtotal" data-title="Subtotal"><span class="currency-symbol">Rs. </span><span>
${new Intl.NumberFormat(
                        "en-US",
                        {
                            minimumFractionDigits: 2
                        })
                        .format(productSubTotal)}
</span></td>
                                    </tr>`;
                cart_item_container.innerHTML += tableData;
            });

            document.getElementById("order-total-quantity").innerHTML = totalQty;
            document.getElementById("order-total-amount").innerHTML = new Intl.NumberFormat(
                    "en-US",
                    {
                        minimumFractionDigits: 2
                    })
                    .format(total);

        } else {
            popup.error(
                    {
                        message: json.message
                    }
            );
        }

    } else {
        popup.error(
                {
                    message: "Cart Items Loading Failed"
                }
        );
    }
}

// Add to cart function
async function addToCart(productId, quantity) {
    const popup = new Notification();
    
    const response = await fetch(`AddToCart?prId=${productId}&qty=${quantity}`);
    
    if (response.ok) {
        const json = await response.json();
        
        if (json.status) {
            popup.success({
                message: json.message
            });
            // Reload cart items to update the display
            loadCartItems();
        } else {
            popup.error({
                message: json.message
            });
        }
    } else {
        popup.error({
            message: "Failed to add product to cart"
        });
    }
}

// Remove from cart function
async function removeFromCart(productId) {
    const popup = new Notification();
    
    // Show confirmation dialog
    if (!confirm("Are you sure you want to remove this item from cart?")) {
        return;
    }
    
    const response = await fetch(`RemoveFromCart?prId=${productId}`);
    
    if (response.ok) {
        const json = await response.json();
        
        if (json.status) {
            popup.success({
                message: json.message
            });
            // Reload cart items to update the display
            loadCartItems();
        } else {
            popup.error({
                message: json.message
            });
        }
    } else {
        popup.error({
            message: "Failed to remove product from cart"
        });
    }
}

// Update cart quantity function (optional - for quantity changes)
async function updateCartQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    const popup = new Notification();
    
    const response = await fetch(`AddToCart?prId=${productId}&qty=${newQuantity - getCurrentQuantity(productId)}`);
    
    if (response.ok) {
        const json = await response.json();
        
        if (json.status) {
            popup.success({
                message: "Cart updated successfully"
            });
            loadCartItems();
        } else {
            popup.error({
                message: json.message
            });
            // Reload to reset the quantity input
            loadCartItems();
        }
    } else {
        popup.error({
            message: "Failed to update cart"
        });
        loadCartItems();
    }
}

// Helper function to get current quantity (you might need to adjust this based on your implementation)
function getCurrentQuantity(productId) {
    // This is a placeholder - you would need to implement this based on your current cart state
    // For now, returning 0 so the quantity change works as a replacement
    return 0;
}