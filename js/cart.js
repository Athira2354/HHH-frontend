document.addEventListener("DOMContentLoaded", function () {
    const cartTableBody = document.querySelector("table tbody");
    const subtotalElement = document.querySelector(".cart-summary .d-flex:nth-child(1) strong");
    const shippingElement = document.querySelector(".cart-summary .d-flex:nth-child(2) strong");
    const totalElement = document.querySelector(".cart-summary .d-flex:nth-child(3) strong");

    const SHIPPING_COST = 50;

    // ✅ get CSRF token
    function getCSRFToken() {
        let cookieValue = null;
        const cookies = document.cookie.split(";");
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith("csrftoken=")) {
                cookieValue = cookie.substring("csrftoken=".length, cookie.length);
                break;
            }
        }
        return cookieValue;
    }

    // ✅ Fetch cart items from Django
    function fetchCart() {
        fetch("http://127.0.0.1:8000/basket-items/view-cart/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCSRFToken()
            },
            credentials: "include"
        })
            .then(response => {
                if (!response.ok) throw new Error("Failed to fetch Cart");
                return response.json();
            })
            .then(items => {
                renderCart(items);
            })
            .catch(error => console.error("Error Loading cart:", error));
    }

    // ✅ Render cart into HTML
    function renderCart(items) {
        cartTableBody.innerHTML = "";
        let subtotal = 0;

        if (!items || items.length === 0) {
            cartTableBody.innerHTML = `<tr><td colspan="5" class="text-center">Your cart is empty.</td></tr>`;
        }

        items.forEach(item => {
            const itemSubtotal = item.product_object.price * item.quantity;
            subtotal += itemSubtotal;
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>
                    <div class="d-flex align-items-center">
                        <img src="${item.product_object.image || 'placeholder.jpg'}" 
                             class="cart-img me-3" alt="${item.product_object.name}" 
                             style="width:60px; height:60px; object-fit:cover;">
                        <div>
                            <strong>${item.product_object.name}</strong><br>
                            <small>${item.product_object.description || ''}</small>
                        </div>
                    </div>
                </td>
                <td>₹${item.product_object.price}</td>
                <td>
                    <input type="number" value="${item.quantity}" min="1" 
                           class="form-control quantity-input" 
                           data-id="${item.id}" style="width:80px;">
                </td>
                <td class="item-subtotal">₹${itemSubtotal}</td>
                <td><span class="remove-btn text-danger" style="cursor:pointer;" data-id="${item.id}">&times;</span></td>
            `;
            cartTableBody.appendChild(row);
        });

        subtotalElement.textContent = `₹${subtotal}`;
        shippingElement.textContent = `₹${items.length > 0 ? SHIPPING_COST : 0}`;
        totalElement.textContent = `₹${subtotal + (items.length > 0 ? SHIPPING_COST : 0)}`;

        attachEventListeners();
    }

    // ✅ Add event listeners for quantity change & remove
    function attachEventListeners() {
        document.querySelectorAll(".quantity-input").forEach(input => {
            input.addEventListener("change", function () {
                const itemId = this.dataset.id;
                let newQty = parseInt(this.value);

                if (newQty < 1) {
                    removeFromCart(itemId);
                    return;
                }

                // update subtotal instantly
                const price = parseInt(this.closest("tr").querySelector("td:nth-child(2)").textContent.replace("₹", ""));
                const newSubtotal = price * newQty;
                this.closest("tr").querySelector(".item-subtotal").textContent = `₹${newSubtotal}`;

                recalcCartTotals();

                // sync with backend
                updateQuantity(itemId, newQty);
            });
        });

        document.querySelectorAll(".remove-btn").forEach(btn => {
            btn.addEventListener("click", function () {
                const itemId = this.dataset.id;
                removeFromCart(itemId);
            });
        });
    }

    // ✅ Update quantity in backend
    function updateQuantity(itemId, quantity) {
        fetch(`http://127.0.0.1:8000/basket-items/${itemId}/update-quantity/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCSRFToken()
            },
            credentials: "include",
            body: JSON.stringify({ quantity })
        })
            .then(response => {
                if (!response.ok) throw new Error("Failed to update quantity");
                return response.json();
            })
            .then(() => fetchCart())
            .catch(error => console.error("Error updating quantity:", error));
    }

    // ✅ Remove item from backend
    function removeFromCart(itemId) {
        fetch(`http://127.0.0.1:8000/basket-items/${itemId}/remove-from-cart/`, {
            method: 'DELETE',
            headers: {
                "X-CSRFToken": getCSRFToken()
            },
            credentials: "include"
        })
            .then(response => {
                if (response.status === 204) {
                    fetchCart();
                } else {
                    throw new Error("failed to remove item");
                }
            })
            .catch(error => console.error("Error removing item:", error));
    }

    // ✅ Recalculate totals dynamically
    function recalcCartTotals() {
        let subtotal = 0;

        document.querySelectorAll("table tbody tr").forEach(row => {
            const subtotalCell = row.querySelector(".item-subtotal");
            if (subtotalCell) {
                const amount = parseInt(subtotalCell.textContent.replace("₹", ""));
                subtotal += isNaN(amount) ? 0 : amount;
            }
        });

        subtotalElement.textContent = `₹${subtotal}`;
        shippingElement.textContent = `₹${subtotal > 0 ? SHIPPING_COST : 0}`;
        totalElement.textContent = `₹${subtotal + (subtotal > 0 ? SHIPPING_COST : 0)}`;
    }

    // ✅ Initial load
    fetchCart();
});
