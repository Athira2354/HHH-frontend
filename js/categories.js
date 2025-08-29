document.addEventListener("DOMContentLoaded", () => {
  const categoryDropdown = document.querySelector(".category-dropdown");
  const productContainer = document.querySelector(".product-list"); // div where products will be shown

  // Fetch categories from backend
  async function loadCategories() {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/categories/");
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const categories = await response.json();
        console(data)
      // Reset dropdown
      categoryDropdown.innerHTML = `<option selected disabled>Select Category</option>`;

      // Populate categories
      categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category.slug; // using slug for products filtering
        option.textContent = category.name;
        categoryDropdown.appendChild(option);
      });
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  }

  // Fetch products for selected category
  async function loadProductsByCategory(categorySlug) {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/products/?category=${categorySlug}`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const products = await response.json();

      // Clear old products
      productContainer.innerHTML = "";

      if (products.length === 0) {
        productContainer.innerHTML = `<p>No products found in this category.</p>`;
        return;
      }

      // Render products
      products.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");
        productCard.innerHTML = `
          <img src="${product.image}" alt="${product.name}" />
          <h3>${product.name}</h3>
          <p>₹${product.price}</p>
          <button>Add to Cart</button>
        `;
        productContainer.appendChild(productCard);
      });
    } catch (error) {
      console.error("Error loading products:", error);
    }
  }

  // When category changes → load products
  categoryDropdown.addEventListener("change", (e) => {
    const selectedCategory = e.target.value;
    loadProductsByCategory(selectedCategory);
  });

  // Load categories on page load
  loadCategories();
});
