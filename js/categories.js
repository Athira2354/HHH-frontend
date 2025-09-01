document.addEventListener("DOMContentLoaded", async () => {
    const categoryDropdown = document.querySelector(".category-dropdown");
    const productGrid = document.querySelector(".product-grid");

    if (!categoryDropdown || !productGrid) {
        console.error("Something wrong: missing dropdown or grid");
        return;
    }

    try {
        // Fetch categories
        const res = await fetch("http://127.0.0.1:8000/api/categories/");
        if (!res.ok) throw new Error("Failed to load categories");
        const categories = await res.json();

        // Populate dropdown
        categoryDropdown.innerHTML = '<option value="">Select Category</option>';
        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.name;
            categoryDropdown.appendChild(option);
        });

        // Handle dropdown change
        categoryDropdown.onchange = async () => {
            const categoryId = categoryDropdown.value; // ✅ direct access
            if (!categoryId) {
                productGrid.innerHTML = "<p>Please select a category.</p>";
                return;
            }

            try {
                const prodRes = await fetch(`http://127.0.0.1:8000/api/categories/${categoryId}/products/`);
                if (!prodRes.ok) throw new Error("Failed to load products");
                const products = await prodRes.json();

                productGrid.innerHTML = ""; // clear old products

                if (products.length === 0) {
                    productGrid.innerHTML = "<p>No products found in this category.</p>";
                    return;
                }

                // Render products
                products.forEach(product => {
                    productGrid.innerHTML += `
                        <div class="product-card">
                            <img src="${product.image}" alt="${product.name}" class="product-image">
                            <div class="product-details">
                                <p class="brand">${product.brand || ""}</p>
                                <h4 class="product-name">${product.name}</h4>
                                <p class="description">${product.description || ""}</p>
                                <p class="price">₹${product.price}</p>
                            </div>
                        </div>
                    `;
                });
            } catch (err) {
                console.error("Product fetch error:", err);
                productGrid.innerHTML = "<p>Error loading products.</p>";
            }
        };
    } catch (err) {
        console.error("Category fetch error:", err);
        categoryDropdown.innerHTML = '<option value="">Failed to load categories</option>';
    }
});
