// ✅ Fetch product details by ID
async function fetchProductDetails(productId) {
    if (!productId) {
        console.error("Product ID is required to fetch details.");
        return null;
    }

    const apiUrl = `http://127.0.0.1:8000/api/view-product/${productId}/`;

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },

        });

        if (!response.ok) {
            throw new Error(`Failed to fetch product details: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching product details:", error);
        return null;
    }
}

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

// ✅ Render product details
async function renderProduct(product) {
    const productTitle = document.querySelector("body > div > div.product-display > div.product-details > h1");
    productTitle.textContent = product.name;

    const productPrice = document.querySelector("body > div > div.product-display > div.product-details > p > strong");
    productPrice.textContent = `₹${product.price}`;
    const featuresArray= product.description.split(".");

    const feature1 = document.querySelector("body > div > div.features > div > div:nth-child(1) > p");
    const feature2 = document.querySelector("body > div > div.features > div > div:nth-child(2) > p");
    const feature3 = document.querySelector("body > div > div.features > div > div:nth-child(3) > p");
    const feature4 = document.querySelector("body > div > div.features > div > div:nth-child(4) > p");
    const feature5 = document.querySelector("body > div > div.features > div > div:nth-child(5) > p");
    const feature6 = document.querySelector("body > div > div.features > div > div:nth-child(6) > p");
    feature1.textContent = featuresArray[0];
    feature2.textContent = featuresArray[1];
    feature3.textContent = featuresArray[2];
    feature4.textContent = featuresArray[3];
    feature5.textContent = featuresArray[4];
    feature6.textContent = featuresArray[5];

    const productMedia = await fetchProductMedia(product.id);
    // console.log(productMedia);
    if (productMedia && productMedia.length>0) {
        const thumbnails = document.querySelector(".thumbnail-images");
        const selectedImage = document.getElementById("selectedImage");
        const selectedVideo = document.getElementById("selectedVideo");

        thumbnails.innerHTML = ""; // clear old thumbnails

        let firstMediaSet = false;

        productMedia.forEach((media, index) => {
            if (media.media_type === "image") {
            // Create a new <img> for every image
                const img = document.createElement("img");
                img.src = media.file;
                img.alt = `Product Image ${index + 1}`;
                img.classList.add("thumbnail");

                img.addEventListener("click", () => {
                selectedImage.src = media.file;
                selectedImage.style.display = "block";
                selectedVideo.style.display = "none";
            });

                thumbnails.appendChild(img);

            // Default first media
            if (!firstMediaSet) {
                selectedImage.src = media.file;
                selectedImage.style.display = "block";
                selectedVideo.style.display = "none";
                firstMediaSet = true;
            }
        }

        if (media.media_type === "video") {
            const videoThumb = document.createElement("video");
            videoThumb.src = media.file;
            videoThumb.width = 100;
            videoThumb.muted = true;
            videoThumb.controls = false;
            videoThumb.classList.add("thumbnail");

            videoThumb.addEventListener("click", () => {
                selectedVideo.src = media.file;
                selectedVideo.style.display = "block";
                selectedImage.style.display = "none";
                selectedVideo.play();
            });

            thumbnails.appendChild(videoThumb);

            if (!firstMediaSet) {
                selectedVideo.src = media.file;
                selectedVideo.style.display = "block";
                selectedImage.style.display = "none";
                firstMediaSet = true;
            }
        }
    });
        
        } else {
            alert("No product media found.")
        }

    const thumbnailContainer = document.querySelector(".thumbnail-images");
    const featureGrid = document.querySelector(".feature-grid");
    const faqList = document.querySelector(".faq ul");
    const reviewsContainer = document.querySelector(".reviews");

    // Fallback if container missing
    // if (!productDetailsContainer) {
    //     console.error("Missing #product-details-container in HTML");
    //     return;
    // }

    // if (!product) {
    //     productDetailsContainer.innerHTML = "<p>Product not found or an error occurred.</p>";
    //     return;
    // }

    // ✅ Product Basic Info
    // productDetailsContainer.innerHTML = `
    //     <h2>${product.name}</h2>
    //     <p><strong>Price:</strong> $${product.price}</p>
    //     <p>${product.description}</p>
    // `;

    // ✅ Thumbnails
    if (thumbnailContainer) {
        thumbnailContainer.innerHTML = "";
        if (product.image) {
            const img = document.createElement("img");
            img.src = product.image;
            img.alt = product.name;
            img.onclick = () => selectImage(img);
            thumbnailContainer.appendChild(img);
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


    // const productDetailsContainer = document.getElementById("product-details-container");
   

function selectImage(imgElement) {
    const mainImage = document.getElementById("selectedImage");
    if (mainImage) {
        mainImage.src = imgElement.src;
    }
}

window.onload = async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    console.log("Product ID from URL:", productId);

    if (!productId) {
        console.error("No product ID found in URL.");
        return;
    }

    try {
        const product = await fetchProductDetails(parseInt(productId));
        if (product) {
            await renderProduct(product);  // ✅ ensure renderProduct only runs if product exists
        } else {
            console.warn("Product not found, skipping render.");
        }
    } catch (error) {
        console.error("Error in product flow:", error);
    }
};

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

async function addProductToCart(){
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");
    // const productQuantity = document.getElementById("quantity").value;
    const token = sessionStorage.getItem("access_token");
    if (!token) {
        alert("Please login to add product to cart");
        return;
    }
    const headers = {
        "Authorization": `Bearer ${token}`
    }
    const respone = await fetch(`http://127.0.0.1:8000/cart/${productId}/add-to-cart/`,{
        method: "POST",
        headers: headers
    });
    if(respone.ok){
        alert("Product added to cart");
        loadCartItems();
    }else{
        alert("Failed to add product to cart");
    }
} 
refreshAccessToken();

// cart-wrapper open
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

loadCartItems();

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

