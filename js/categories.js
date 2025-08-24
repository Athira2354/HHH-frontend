document.addEventListener("DOMContentLoaded",function(){
    const categoryDropdown=document.querySelector(".category-dropdown");
    if(!categoryDropdown)
        {
            console.error("category element not found");
            return;
        }
    // fetch categories from django backend
    fetch("http://127.0.0.1:8000/categories/")
    .then(response=>response.json())
    .then(data=>{
        // clear existing options
        categoryDropdown.innerHTML='<option selected disabled>SelectedCategory </option>';
        // populate categories
        data.forEach(category=>{
            const option= document.createElement("option");
            option.value=category.id;  //backend id
            option.textContent=category.name; //backend name
            categoryDropdown.appendChild(option);
        });
        })
        .catch(error=>{
            console.error("error fetching categories",error);
            categoryDropdown.innerHTML='<option disabled>Error loading categories</option>';

        });
        // handle category selection
        categoryDropdown.addEventListener("change",function(){
            const selectedCategoryId = this.value;
            const selectedCategoryName = this.options[this.selectedIndex].text;
            console.log("Selected Category:",selectedCategoryId,selectedCategoryName);

            // Example: Send selected category to backend for filtering products
            fetch(`http://127.0.0.1:8000/products/?category=${selectedCategoryId}`)
                .then(response => response.json())
                .then(products => {
                console.log("Products in this category:", products);

            
        })
        .catch(error=>console.error("error fetching products:",error));
    })

});