// function indexOnloadFunctions() {

//     loadProductData();
// }

// async function loadProductData() {


//     const response = await fetch(
//         "http://localhost:8080/Zay1/LoadHomeData",
//         {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json"
//             }
//         }
//     );

//     if (response.ok) {
//         const json = await response.json();

//         if (json.status) {
//             console.log(json);
//             loadProducts(json);
//         } else {
//             popup.error({
//                 message: "Something went wrong ! Try again shortly"
//             });
//         }
//     } else {
//         popup.error({
//             message: "Something went wrong ! Try again shortly"
//         });
//     }

// }

// function loadProducts(json) {
//     const productContainer = document.getElementById('products-container');
//     const loadingMessage = document.getElementById('loading-message');

//     if (!productContainer) {
//         console.warn('Product container not found');
//         return;
//     }

//     // Remove loading message
//     if (loadingMessage) {
//         loadingMessage.remove();
//     }

//     // Clear existing content
//     productContainer.innerHTML = '';

//     json.productList.forEach((product) => {
//         // Debug: Log each product ID to console
//         console.log('Creating card for product ID:', product.id);

//         const productCard = `
//         <div class="col-md-4">
//             <div class="card mb-4 product-wap rounded-0">
//                 <div class="card rounded-0">
//                     <img class="card-img rounded-0 img-fluid" 
//                          src="assets/img/${product.id}/image1.png" 
//                          alt="${product.title}"
//                          onerror="console.log('Image not found for product ${product.id}'); this.src='assets/img/placeholder.png';">
//                     <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
//                         <ul class="list-unstyled">
//                             <li><a class="btn btn-success text-white" 
//                                    href="#" 
//                                    onclick="event.preventDefault(); console.log('Wishlist clicked for ID: ${product.id}'); addToWishlist(${product.id});">
//                                    <i class="far fa-heart"></i></a></li>
//                             <li><a class="btn btn-success text-white mt-2" 
//                                    href="shop-single.html?id=${product.id}"
//                                    onclick="console.log('Eye icon clicked for ID: ${product.id}');">
//                                    <i class="far fa-eye"></i></a></li>
//                             <li><a class="btn btn-success text-white mt-2" 
//                                    href="#" 
//                                    onclick="event.preventDefault(); console.log('Add to cart clicked for ID: ${product.id}'); addToCart(${product.id}, 1);">
//                                    <i class="fas fa-cart-plus"></i></a></li>
//                         </ul>
//                     </div>
//                 </div>
//                 <div class="card-body">
//                     <a href="shop-single.html?id=${product.id}" 
//                        class="h3 text-decoration-none"
//                        onclick="console.log('Product title clicked for ID: ${product.id}');">${product.title}</a>
//                     <ul class="w-100 list-unstyled d-flex justify-content-between mb-0">
//                         <li><small class="text-muted">Brand: ${product.brand_id.name}</small><br>M/L/X/XL</li>
//                         <li class="pt-2">
//                             <span class="product-color-dot color-dot-red float-left rounded-circle ml-1"></span>
//                             <span class="product-color-dot color-dot-blue float-left rounded-circle ml-1"></span>
//                             <span class="product-color-dot color-dot-black float-left rounded-circle ml-1"></span>
//                             <span class="product-color-dot color-dot-light float-left rounded-circle ml-1"></span>
//                             <span class="product-color-dot color-dot-green float-left rounded-circle ml-1"></span>
//                         </li>
//                     </ul>
//                     <ul class="list-unstyled d-flex justify-content-center mb-1">
//                         <li>
//                             <i class="text-warning fa fa-star"></i>
//                             <i class="text-warning fa fa-star"></i>
//                             <i class="text-warning fa fa-star"></i>
//                             <i class="text-muted fa fa-star"></i>
//                             <i class="text-muted fa fa-star"></i>
//                         </li>
//                     </ul>
//                     <p class="text-center mb-0">$${new Intl.NumberFormat("en-US", {
//             minimumFractionDigits: 2
//         }).format(product.price)}</p>
//                 </div>
//             </div>
//         </div>
//     `;

//         productContainer.innerHTML += productCard;
//     });
// }

// async function addToCart(productId, qty) {
//     console.log(`Adding product ${productId} with quantity ${qty} to cart`);

//     const popup = new Notification();

//     try {
//         const response = await fetch(`http://localhost:8080/Zay1/AddToCart?prId=${productId}&qty=${qty}`);

//         if (response.ok) {
//             const json = await response.json();
//             if (json.status) {
//                 popup.success({
//                     message: json.message || "Product added to cart successfully!"
//                 });

//                 // Update cart badge if it exists
//                 updateCartBadge();
//             } else {
//                 popup.error({
//                     message: json.message || "Failed to add product to cart"
//                 });
//             }
//         } else {
//             popup.error({
//                 message: "Server error! Please try again"
//             });
//         }
//     } catch (error) {
//         console.error('Error adding to cart:', error);
//         popup.error({
//             message: "Connection error! Please try again"
//         });
//     }
// }

// function updateCartBadge() {
//     // Update the cart badge number - you might want to fetch the actual cart count
//     const cartBadge = document.querySelector('.fa-cart-arrow-down + .badge');
//     if (cartBadge) {
//         let currentCount = parseInt(cartBadge.textContent) || 0;
//         cartBadge.textContent = currentCount + 1;
//     }
// }

// // Initialize when DOM is loaded
// document.addEventListener('DOMContentLoaded', function () {
//     // Check if we're on the main page before running index functions
//     if (typeof indexOnloadFunctions === 'function') {
//         indexOnloadFunctions();
//     }
// });

// // Utility function for handling notification popups
// // You'll need to include a notification library or create your own
// function Notification() {
//     this.success = function (options) {
//         console.log('Success:', options.message);
//         alert('Success: ' + options.message); // Replace with proper notification
//     };

//     this.error = function (options) {
//         console.error('Error:', options.message);
//         alert('Error: ' + options.message); // Replace with proper notification
//     };
// }


function indexOnloadFunctions() {
    loadProductData();
}

async function loadProductData() {
    const response = await fetch(
        "http://localhost:8080/Zay1/LoadHomeData",
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }
    );

    if (response.ok) {
        const json = await response.json();

        if (json.status) {
            console.log(json);
            loadProducts(json);
        } else {
            popup.error({
                message: "Something went wrong ! Try again shortly"
            });
        }
    } else {
        popup.error({
            message: "Something went wrong ! Try again shortly"
        });
    }
}

function loadProducts(json) {
    const productContainer = document.getElementById('products-container');
    const loadingMessage = document.getElementById('loading-message');

    if (!productContainer) {
        console.warn('Product container not found');
        return;
    }

    // Remove loading message
    if (loadingMessage) {
        loadingMessage.remove();
    }

    // Clear existing content
    productContainer.innerHTML = '';

    // Ensure the container has proper Bootstrap row class
    if (!productContainer.classList.contains('row')) {
        productContainer.classList.add('row');
    }

    // Add CSS for better card alignment if not already added
    if (!document.getElementById('product-grid-styles')) {
        const style = document.createElement('style');
        style.id = 'product-grid-styles';
        style.textContent = `
            .products-container.row {
                margin: 0 -15px;
            }
            
            .product-col {
                padding: 15px;
                margin-bottom: 30px;
                display: flex;
            }
            
            .product-wap {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
            }
            
            .product-wap .card {
                flex: 1;
                display: flex;
                flex-direction: column;
                min-height: 400px;
            }
            
            .product-wap .card-body {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }
            
            .product-wap .card img {
                height: 250px;
                object-fit: cover;
                width: 100%;
            }
            
            .product-overlay {
                opacity: 0;
                transition: all 0.3s ease;
                background: rgba(0, 0, 0, 0.5);
            }
            
            .product-wap:hover .product-overlay {
                opacity: 1;
            }
            
            @media (max-width: 768px) {
                .product-col {
                    flex: 0 0 100%;
                    max-width: 100%;
                }
            }
            
            @media (min-width: 769px) and (max-width: 992px) {
                .product-col {
                    flex: 0 0 50%;
                    max-width: 50%;
                }
            }
            
            @media (min-width: 993px) {
                .product-col {
                    flex: 0 0 33.333333%;
                    max-width: 33.333333%;
                }
            }
        `;
        document.head.appendChild(style);
    }

    json.productList.forEach((product) => {
        // Debug: Log each product ID to console
        console.log('Creating card for product ID:', product.id);

        const productCard = `
        <div class="product-col">
            <div class="card mb-4 product-wap rounded-0">
                <div class="card rounded-0 position-relative">
                    <img class="card-img rounded-0 img-fluid" 
                         src="assets/img/${product.id}/image1.png" 
                         alt="${product.title}"
                         onerror="console.log('Image not found for product ${product.id}'); this.src='assets/img/placeholder.png';">
                    <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                        <ul class="list-unstyled mb-0">
                            <li class="mb-2"><a class="btn btn-success text-white" 
                                   href="#" 
                                   onclick="event.preventDefault(); console.log('Wishlist clicked for ID: ${product.id}'); addToWishlist(${product.id});">
                                   <i class="far fa-heart"></i></a></li>
                            <li class="mb-2"><a class="btn btn-success text-white" 
                                   href="shop-single.html?id=${product.id}"
                                   onclick="console.log('Eye icon clicked for ID: ${product.id}');">
                                   <i class="far fa-eye"></i></a></li>
                            <li><a class="btn btn-success text-white" 
                                   href="#" 
                                   onclick="event.preventDefault(); console.log('Add to cart clicked for ID: ${product.id}'); addToCart(${product.id}, 1);">
                                   <i class="fas fa-cart-plus"></i></a></li>
                        </ul>
                    </div>
                </div>
                <div class="card-body">
                    <a href="shop-single.html?id=${product.id}" 
                       class="h3 text-decoration-none mb-3 d-block"
                       onclick="console.log('Product title clicked for ID: ${product.id}');">${product.title}</a>
                    
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <small class="text-muted">Brand: ${product.brand_id && product.brand_id.name ? product.brand_id.name : 'N/A'}</small>
                        <small class="text-muted">M/L/X/XL</small>
                    </div>
                    
                    <div class="d-flex justify-content-center mb-2">
                        <div class="color-options">
                            <span class="product-color-dot color-dot-red rounded-circle d-inline-block mr-1"></span>
                            <span class="product-color-dot color-dot-blue rounded-circle d-inline-block mr-1"></span>
                            <span class="product-color-dot color-dot-black rounded-circle d-inline-block mr-1"></span>
                            <span class="product-color-dot color-dot-light rounded-circle d-inline-block mr-1"></span>
                            <span class="product-color-dot color-dot-green rounded-circle d-inline-block"></span>
                        </div>
                    </div>
                    
                    <div class="d-flex justify-content-center mb-2">
                        <div class="stars">
                            <i class="text-warning fa fa-star"></i>
                            <i class="text-warning fa fa-star"></i>
                            <i class="text-warning fa fa-star"></i>
                            <i class="text-muted fa fa-star"></i>
                            <i class="text-muted fa fa-star"></i>
                        </div>
                    </div>
                    
                    <p class="text-center mb-0 h5 font-weight-bold text-success">$${new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 2
        }).format(product.price)}</p>
                </div>
            </div>
        </div>
    `;

        productContainer.innerHTML += productCard;
    });

    // Add color dot styles if not already added
    if (!document.getElementById('color-dot-styles')) {
        const colorStyle = document.createElement('style');
        colorStyle.id = 'color-dot-styles';
        colorStyle.textContent = `
            .product-color-dot {
                width: 15px;
                height: 15px;
                border: 2px solid #fff;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                cursor: pointer;
                transition: transform 0.2s;
            }
            
            .product-color-dot:hover {
                transform: scale(1.2);
            }
            
            .color-dot-red { background-color: #dc3545; }
            .color-dot-blue { background-color: #007bff; }
            .color-dot-black { background-color: #343a40; }
            .color-dot-light { background-color: #f8f9fa; border-color: #dee2e6; }
            .color-dot-green { background-color: #28a745; }
        `;
        document.head.appendChild(colorStyle);
    }
}

async function addToCart(productId, qty) {
    console.log(`Adding product ${productId} with quantity ${qty} to cart`);

    const popup = new Notification();

    try {
        const response = await fetch(`http://localhost:8080/Zay1/AddToCart?prId=${productId}&qty=${qty}`);

        if (response.ok) {
            const json = await response.json();
            if (json.status) {
                popup.success({
                    message: json.message || "Product added to cart successfully!"
                });

                // Update cart badge if it exists
                updateCartBadge();
            } else {
                popup.error({
                    message: json.message || "Failed to add product to cart"
                });
            }
        } else {
            popup.error({
                message: "Server error! Please try again"
            });
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        popup.error({
            message: "Connection error! Please try again"
        });
    }
}

function updateCartBadge() {
    // Update the cart badge number - you might want to fetch the actual cart count
    const cartBadge = document.querySelector('.fa-cart-arrow-down + .badge');
    if (cartBadge) {
        let currentCount = parseInt(cartBadge.textContent) || 0;
        cartBadge.textContent = currentCount + 1;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Check if we're on the main page before running index functions
    if (typeof indexOnloadFunctions === 'function') {
        indexOnloadFunctions();
    }
});

// Utility function for handling notification popups
// You'll need to include a notification library or create your own
function Notification() {
    this.success = function (options) {
        console.log('Success:', options.message);
        alert('Success: ' + options.message); // Replace with proper notification
    };

    this.error = function (options) {
        console.error('Error:', options.message);
        alert('Error: ' + options.message); // Replace with proper notification
    };
}

// Placeholder function for wishlist
function addToWishlist(productId) {
    console.log('Adding to wishlist:', productId);
    // Implement wishlist functionality here
    const popup = new Notification();
    popup.success({
        message: "Product added to wishlist!"
    });
}