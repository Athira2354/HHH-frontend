document.addEventListener("DOMContentLoaded",function(){
    const productGrid=document.querySelector(".product-grid");

    if(!productGrid){
        console.error("product grid element not found");
        return;

    }
    
    fetch("http://127.0.0.1:8000/products/")
    .then(response=>response.json())
    .then(product=>{
        console.log("products:",product);
        productGrid.innerHTML="";
        product.forEach(product=>{

             
                const card = document.createElement("a");
                card.href = `../single_product.html?id=${product.id}`;  
                card.classList.add("product-card-link");

                card.innerHTML = `
                    <div class="product-card">
                        ${product.is_sale ? `<span class="badge sale">Sale</span>` : ""}
                        ${product.is_bestseller ? `<span class="badge bestseller">Best Seller</span>` : ""}
                        
                        <img src="${product.image}" alt="${product.name}" class="product-image">
                        
                        <div class="product-details">
                            <p class="brand">${product.brand || "No Brand"}</p>
                            <h4 class="product-name">${product.name}</h4>
                            <p class="price">
                                ${product.old_price ? `<span class="old-price">₹ ${product.old_price}</span>` : ""}
                                <span class="new-price">₹ ${product.price}</span>
                            </p>
                        </div>
                    </div>
                `;
                productGrid.appendChild(card);
        });

        })
        .catch(error=>{
            console.error("error fetching products:",error);
            productGrid.innerHTML= '<P>Failed to load products.</P>';
        });
    })