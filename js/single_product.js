// single_product.js

// ✅ Fetch product details by ID
async function fetchProductDetails(productId) {
    if (!productId) {
        console.error("Product ID is required to fetch details.");
        return null;
    }

    const apiUrl = `http://127.0.0.1:8000/api/view-product/${productId}/`;

    try {
        const response = await fetch(apiUrl);
        console.log("product response",response)

        if (!response.ok) {
            throw new Error(`Failed to fetch product details: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching product details:", error);
        return null;
    }
}
// ✅ Fetch product details by ID
const fetchProductMedia = async (productId) => {
    const productIdParsed = parseInt(productId);
    const response = await fetch(`http://127.0.0.1:8000/api/get-product-media/${productIdParsed}`);

    if (!response.ok) {
        alert("Failed to fetch product media.");
        return null;
    }
    const data = await response.json();
    return data;
};
async function fetchProductImages(productId) {
    if (!productId) {
        console.error("Product ID is required to fetch details.");
        return null;
    }

    const apiUrl = `http://127.0.0.1:8000/api/get-product-media/${productId}`;

    try {
        const response = await fetch(apiUrl);
        console.log("image response",response)

        if (!response.ok) {
            throw new Error(`Failed to fetch product details: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching product details:", error);
        return null;
    }
}

// ✅ Render product details
async function renderProduct(product,productImages) {
    // console.log("kkskskskskk",productImages,product)
    const productDetailsContainer = document.querySelector(".product-details");
    const thumbnailContainer = document.querySelector(".thumbnail-images");
    const featureGrid = document.querySelector("feature-grid");
    const faqList = document.querySelector(".faq ul");
    const mainImage = document.getElementById("selectedImage");
    const reviewsContainer = document.querySelector(".reviews");
    // const actionContainer = document.querySelector(".action-buttons");
    

    // Fallback if container missing
    if (!productDetailsContainer) {
        console.error("Missing #product-details in HTML");
        return;
    }

    if (!product) {
        productDetailsContainer.innerHTML = "<p>Product not found or an error occurred.</p>";
        return;
    }

    // ✅ Product Basic Info
    productDetailsContainer.innerHTML = `
         <h2>${product.name}</h2>
        <p><strong>Price:</strong> $${product.price}</p>
        <p>${product.description}</p>
          <div class="quantity-section">
                    <label for="quantity">Quantity:</label>
                    <input type="number" id="quantity" min="1" value="1">
                </div>

                <div class="action-buttons">
                    <a href="checkoutpage.html"><button class="buy-now">Buy it now</button></a>
                    <button class="wishlist-btn" title="Add to Wishlist">❤️</button>
                    <a href="http://127.0.0.1:3000/viewcart.html"><button class="add-to-cart">🛒</button></a>
                </div>
    `;
        // actionContainer.innerHTML = `<a href="checkoutpage.html"><button class="buy-now">Buy it now</button></a>
        //             <button class="wishlist-btn" title="Add to Wishlist">❤️</button>
        //             <a href="http://127.0.0.1:3000/viewcart.html"><button class="add-to-cart">🛒</button></a>`;
       
       

    // ✅ Thumbnails
    // if (thumbnailContainer) {
    //     thumbnailContainer.innerHTML = "";
    //     if (productImages) {
    //         console.log('yyyyyyyyyyyyyyyyy',productImages);
    //         const img = document.createElement("img");
    //         img.src = productImages.image1;
    //         // img.alt = productImages.name;
    //         img.onclick = () => selectImage(img);
    //         thumbnailContainer.appendChild(img);
    //          img.src = productImages.image2;
    //         // img.alt = productImages.name;
    //         img.onclick = () => selectImage(img);
    //         thumbnailContainer.appendChild(img);
    //          img.src = productImages.image3;
    //         // img.alt = productImages.name;
    //         img.onclick = () => selectImage(img);
    //         thumbnailContainer.appendChild(img);
    //     }
    // }
     if (thumbnailContainer) {
        thumbnailContainer.innerHTML = "";

      // Collect available images
    const images = [productImages.image1, productImages.image2, productImages.image3].filter(Boolean);

    images.forEach((src, index) => {
        const img = document.createElement("img");
        img.src = src;
        img.alt = `Image ${index + 1}`;
        img.onclick = () => selectImage(img);
        thumbnailContainer.appendChild(img);

        if (index === 0 && mainImage) {
            mainImage.src = src;  // first image default
        }
    });
    }

    // ✅ function for switching image
function selectImage(imgElement) {
    const mainImage = document.getElementById("selectedImage");
    if (mainImage) {
        mainImage.src = imgElement.src;
    }
}

    // ✅ Features
    if (featureGrid) {
        featureGrid.innerHTML = "";
        if (product.features && product.features.length > 0) {
            product.features.forEach(feature => {
                const featureItem = document.createElement("div");
                featureItem.className = "feature-item";
                featureItem.innerHTML = `<p>${feature}</p>`;
                featureGrid.appendChild(featureItem);
            });
        }
    }

    // ✅ FAQs
    if (faqList) {
        faqList.innerHTML = "";
        if (product.faqs && product.faqs.length > 0) {
            product.faqs.forEach(faq => {
                const faqItem = document.createElement("li");
                faqItem.innerHTML = `<strong>Q:</strong> ${faq.question} <br> <strong>A:</strong> ${faq.answer}`;
                faqList.appendChild(faqItem);
            });
        }
    }

    // ✅ Reviews
    if (reviewsContainer) {
        reviewsContainer.innerHTML = "<h3>Customer Reviews</h3>";
        if (product.reviews && product.reviews.length > 0) {
            product.reviews.forEach(review => {
                const reviewDiv = document.createElement("div");
                reviewDiv.className = "review";
                reviewDiv.innerHTML = `<p><strong>${review.user}:</strong> ${review.comment}</p>`;
                reviewsContainer.appendChild(reviewDiv);
            });
        }
    }
}

// function selectImage(imgElement) {
//     const mainImage = document.getElementById("selectedImage");
//     if (mainImage) {
//         mainImage.src = imgElement.src;
//     }
// }

window.onload=async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");
    console.log(productId)
    if (!productId) {
        console.error("No product ID found in URL.");
        return;
    }

    const product = await fetchProductDetails(parseInt(productId));
    const productImages = await fetchProductImages(parseInt(productId));
    renderProduct(product,productImages);
}

