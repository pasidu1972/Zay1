async function loadData() {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has("id")) {
        const productId = searchParams.get("id");
        const response = await fetch("http://localhost:8080/Zay1/LoadSingleProduct?id=" + productId);

        if (response.ok) {
            const json = await response.json();
            if (json.status) {
                // Set product image (single image)
                document.getElementById("product-image").src = "assets/img/" + json.product.id + "/image1.png";
                
                // Set product details
                document.getElementById("product-title").innerHTML = json.product.title;
                document.getElementById("product-description").innerHTML = json.product.description;
                document.getElementById("product-price").innerHTML = "$" + new Intl.NumberFormat("en-US", {minimumFractionDigits: 2}).format(json.product.price);
                document.getElementById("product-brand").innerHTML = json.product.brand_id.name;
                
                // Store actual product quantity for validation
                const actualStock = json.product.qty;
                document.getElementById("actual-stock").value = actualStock;
                
                // Initialize quantity controls with actual stock limit
                initializeQuantityControls(actualStock);

                // Add to cart button functionality
                const addToCartButton = document.getElementById("add-to-cart-btn");
                if (addToCartButton) {
                    addToCartButton.addEventListener("click", (e) => {
                        e.preventDefault();
                        const selectedQty = parseInt(document.getElementById("var-value").textContent);
                        addToCart(json.product.id, selectedQty);
                    });
                }

                // Buy button functionality (if needed)
                const buyButton = document.getElementById("buy-btn");
                if (buyButton) {
                    buyButton.addEventListener("click", (e) => {
                        e.preventDefault();
                        const selectedQty = parseInt(document.getElementById("var-value").textContent);
                        // Add your buy functionality here
                        console.log("Buy product:", json.product.id, "Quantity:", selectedQty);
                    });
                }

            } else {
                console.error("Product not found:", json.message);
                window.location = "index.html";
            }
        } else {
            console.error("Failed to fetch product");
            window.location = "index.html";
        }
    } else {
        console.error("No product ID provided");
        window.location = "index.html";
    }
}

function initializeQuantityControls(maxStock) {
    const btnMinus = document.getElementById("btn-minus");
    const btnPlus = document.getElementById("btn-plus");
    const varValue = document.getElementById("var-value");
    const productQuantity = document.getElementById("product-quanity");

    let currentQty = 1;
    varValue.textContent = currentQty;
    if (productQuantity) productQuantity.value = currentQty;

    // Minus button functionality
    btnMinus.addEventListener("click", (e) => {
        e.preventDefault();
        if (currentQty > 1) {
            currentQty--;
            varValue.textContent = currentQty;
            if (productQuantity) productQuantity.value = currentQty;
        }
    });

    // Plus button functionality
    btnPlus.addEventListener("click", (e) => {
        e.preventDefault();
        if (currentQty < maxStock) {
            currentQty++;
            varValue.textContent = currentQty;
            if (productQuantity) productQuantity.value = currentQty;
        } else {
            alert(`Sorry, only ${maxStock} items available in stock.`);
        }
    });
}

async function addToCart(productId, qty) {
    console.log("Adding to cart:", productId, "Quantity:", qty);
    
    try {
        const response = await fetch("AddToCart?prId=" + productId + "&qty=" + qty);
        
        if (response.ok) {
            const json = await response.json();
            if (json.status) {
                // Success notification
                alert("Product added to cart successfully!");
                // If you have a notification library, use it instead:
                // const popup = new Notification();
                // popup.success({ message: json.message });
            } else {
                alert("Failed to add product to cart: " + json.message);
            }
        } else {
            alert("Error adding product to cart. Please try again.");
        }
    } catch (error) {
        console.error("Error adding to cart:", error);
        alert("Error adding product to cart. Please try again.");
    }
}

// Load data when page loads
window.addEventListener('DOMContentLoaded', loadData);