async function refreshAccessToken() {
  const refreshToken = sessionStorage.getItem("refresh_token");
  if (!refreshToken) {
    alert("Session expired. Please login again.");
    return false;
  }

  const response = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ refresh: refreshToken })
  });

  if (response.ok) {
    const data = await response.json();
    sessionStorage.setItem("access_token", data.access);
    return true;
  } else {
    alert("Session expired. Please login again.");
    return false;
  }
}
refreshAccessToken();
function populateOrderSummary(cartItems) {
    const orderSummary = document.querySelector(".right-section");

    // Clear current content (optional: if dynamically refilling)
    orderSummary.innerHTML = `
        <h5 class="mb-3">Order Summary</h5>
    `;

    let subtotal = 0;

    cartItems.forEach(item => {
        const product = item.product;
        const quantity = item.quantity;
        const price = parseFloat(product.price);
        const itemTotal = parseFloat(item.item_total);
        subtotal += itemTotal;

        const itemHTML = `
            <div class="d-flex align-items-center mb-3">
                <img src="http://127.0.0.1:8000${product.image}" class="product-image me-3" alt="${product.name}" width="50" height="50">
                <div>
                    <strong>${product.name}</strong><br>
                    <small>${quantity} x ₹${price.toFixed(2)}</small>
                </div>
                <span class="ms-auto fw-bold">₹${itemTotal.toFixed(2)}</span>
            </div>
        `;

        orderSummary.insertAdjacentHTML('beforeend', itemHTML);
    });

    // Add summary rows
    const summaryHTML = `
        <hr>
        <div class="d-flex justify-content-between">
            <span>Subtotal</span>
            <span>₹${subtotal.toFixed(2)}</span>
        </div>
        <div class="d-flex justify-content-between mb-3">
            <span>Shipping</span>
            <span class="text-muted">Enter shipping address</span>
        </div>
        <hr>
        <div class="d-flex justify-content-between">
            <strong>Total</strong>
            <strong>₹${subtotal.toFixed(2)}</strong>
        </div>
    `;

    orderSummary.insertAdjacentHTML('beforeend', summaryHTML);
}

async function loadCartItems() {
    const token = sessionStorage.getItem("access_token");
    if (!token) {
        alert("Please login to view cart");
        return;
    }

    const headers = {
        "Authorization": `Bearer ${token}`
    };

    const response = await fetch("http://127.0.0.1:8000/api/basket-items/view-cart/", {
        method: "GET",
        headers: headers,
        // credentials: 'include'
    });

    if (response.ok) {
        const cartItems = await response.json();
        populateOrderSummary(cartItems);
        
    } else {
        alert("Failed to load cart items");
    }
}

loadCartItems();

async function refreshAccessToken() {
  const refreshToken = sessionStorage.getItem("refresh_token");
  if (!refreshToken) {
    alert("Session expired. Please login again.");
    return false;
  }

  const response = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ refresh: refreshToken })
  });

  if (response.ok) {
    const data = await response.json();
    sessionStorage.setItem("access_token", data.access);
    return true;
  } else {
    alert("Session expired. Please login again.");
    return false;
  }
}

async function loadCartItemsToCart() {
    const token = sessionStorage.getItem("access_token");
    if (!token) {
        alert("Please login to view cart");
        return;
    }

    const headers = {
        "Authorization": `Bearer ${token}`
    };

    const response = await fetch("http://127.0.0.1:8000/api/basket-items/view-cart/", {
        method: "GET",
        headers: headers,
        // credentials: 'include'
    });

    if (response.ok) {
        const cartItems = await response.json();

        const cartList = document.querySelector(".cart-wrapper ul");
        const cartTotalElement = document.querySelector(".cart-wrapper .float-right");

        // Clear existing items
        cartList.innerHTML = "";

        let cartTotal = 0;

        if (cartItems.length > 0) {
            cartItems.forEach(item => {
                const product = item.product;
                const quantity = item.quantity;
                const price = parseFloat(product.price);
                const itemTotal = parseFloat(item.item_total);
                cartTotal += itemTotal;

                const cartItemHTML = `
                    <li class="d-flex border-bottom">
                        <img src="http://127.0.0.1:8000${product.image || 'images/categories/default.png'}" width="63" height="85" alt="${product.name}">
                        <div class="mx-3">
                            <h6>${product.name}</h6>
                            <span>${quantity}</span> X <span>₹${price.toFixed(2)}</span>
                        </div>
                        <i class="ti-close" data-cart-item-id="${item.id}" onclick="removeFromCart(${item.id})"></i>
                    </li>
                `;

                cartList.insertAdjacentHTML("beforeend", cartItemHTML);
            });
        } else {
            cartList.innerHTML = "<li>Your cart is empty</li>";
        }

        cartTotalElement.textContent = `₹${cartTotal.toFixed(2)}`;
    } else {
        alert("Failed to load cart items");
    }
}
async function removeFromCart(itemId) {
    const token = sessionStorage.getItem("access_token");
    if (!token) {
        alert("Please login to remove items from cart");
        return;
    }

    const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
    };

    try {
        const response = await fetch(`http://127.0.0.1:8000/api/basket-items/${itemId}/remove-from-cart/`, {
            method: "DELETE",
            headers: headers,
        });

        if (response.ok) {
            alert("Item removed from cart");
            // Reload or update cart UI here, e.g.:
            loadCartItems();
        } else {
            const data = await response.json();
            alert(data.detail || "Failed to remove item");
        }
    } catch (error) {
        alert("Error removing item from cart");
        console.error(error);
    }
}
 
async function loadCheckoutProduct(){
    const UrlParams= new URLSearchParams(window.location.search);
    const productId=UrlParams.get("id")
    if(!productId){
        alert("invalid productID")
        return;
    }
    const product=await fetchProductDetails(productId);
    if(product){
        document.getElementById("ProductName").textContent=product.name;
        document.getElementById("ProductPrice").textContent=`₹${product.price}`;
        if(product.image){
            document.getElementById("ProductImage").src=`http://127.0.0.1:8000/products/${product.image}`;
        }
    }
}
loadCheckoutProduct();
refreshAccessToken();
loadCartItemsToCart();