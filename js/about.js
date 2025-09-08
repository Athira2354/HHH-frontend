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

refreshAccessToken();
loadCartItems();