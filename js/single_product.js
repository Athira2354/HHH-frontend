// ✅ Fetch product details by ID
async function fetchProductDetails(productId) {
    if (!productId) {
        console.error("Product ID is required to fetch details.");
        return null;
    }

    const apiUrl = `http://127.0.0.1:8000/api/view-product/${productId}/`;

    try {
        const response = await fetch(apiUrl);

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

    console.log("gfhgfhgffhf",productIdParsed)

    // if (!response.ok) {
    //     alert("Failed to fetch product media.");
    //     return null;
    // }
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
    if (productMedia) {
        const image1 = document.querySelector("body > div > div.product-display > div.thumbnail-images > img:nth-child(1)");
        const image2 = document.querySelector("body > div > div.product-display > div.thumbnail-images > img:nth-child(2)");
        const image3 = document.querySelector("body > div > div.product-display > div.thumbnail-images > img:nth-child(3)");
        if (productMedia) {
            image1.src = productMedia.image1;
            image2.src = productMedia.image2;
            image3.src = productMedia.image3;
        } else {
            alert("No product media found.")
        }

    }

    const productDetailsContainer = document.getElementById("product-details-container");
    const thumbnailContainer = document.querySelector(".thumbnail-images");
    const featureGrid = document.querySelector(".feature-grid");
    const faqList = document.querySelector(".faq ul");
    const reviewsContainer = document.querySelector(".reviews");

    // Fallback if container missing
    if (!productDetailsContainer) {
        console.error("Missing #product-details-container in HTML");
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
    `;

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

function selectImage(imgElement) {
    const mainImage = document.getElementById("selectedImage");
    if (mainImage) {
        mainImage.src = imgElement.src;
    }
}

window.onload=async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");
    console.log(productId)
    if (!productId) {
        console.error("No product ID found in URL.");
        return;
    }

    const product = await fetchProductDetails(parseInt(productId));
    renderProduct(product);
}
