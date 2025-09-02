
document.addEventListener("DOMContentLoaded", async () => {
    const categoryDropdown = document.querySelector(".category-dropdown");
    const productGrid = document.querySelector(".product-grid");

    if (!categoryDropdown || !productGrid) {
        console.error("Missing dropdown or grid");
        return;
    }

    try {
        const res = await fetch("http://127.0.0.1:8000/api/categories/");
        if (!res.ok) throw new Error("Failed to load categories");

        const categories = await res.json();
        console.log("Fetched categories:", categories);

        // Clear existing options
        categoryDropdown.innerHTML = '<option value="">Select Category</option>';

        // Add new options
        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.name;
            categoryDropdown.appendChild(option);
        });

        // ✅ Refresh nice-select UI after modifying <select>
        if (window.jQuery && typeof $().niceSelect === 'function') {
            $('select.category-dropdown').niceSelect('update');
        }

    } catch (err) {
        console.error("Category fetch error:", err);
        categoryDropdown.innerHTML = '<option value="">Failed to load categories</option>';
        $('select.category-dropdown').niceSelect('update');
    }

    // Handle change event (via jQuery, to catch plugin events too)
    $(document).on('change', '.category-dropdown', async function () {
        const categoryId = this.value;

        if (!categoryId) {
            productGrid.innerHTML = "<p>Please select a category.</p>";
            return;
        }

        try {
            const prodRes = await fetch(`http://127.0.0.1:8000/api/categories/${categoryId}/products/`);
            if (!prodRes.ok) throw new Error("Failed to load products");

            const products = await prodRes.json();
            productGrid.innerHTML = "";

            if (products.length === 0) {
                productGrid.innerHTML = "<p>No products found in this category.</p>";
                return;
            }

            products.forEach(product => {
                productGrid.innerHTML += `
                    <a href="single_product.html?id=${product.id}" class="product-card-link">
                    <div class="product-card">
                        <img src="http://127.0.0.1:8000/${product.image}" alt="${product.name}" class="product-image">
                        <div class="product-details">
                            <p class="brand">${product.brand || ""}</p>
                            <h4 class="product-name">${product.name}</h4>
                            <p class="description">${product.description || ""}</p>
                            <p class="price">₹${product.price}</p>
                        </div>
                    </div>
                    </a>
                `;
            });

        } catch (err) {
            console.error("Product fetch error:", err);
            productGrid.innerHTML = "<p>Error loading products.</p>";
        }
    });
});

