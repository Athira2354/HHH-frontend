document.addEventListener("DOMContentLoaded", function () {
    const loginBtn = document.querySelector("body > div > form > button");

    loginBtn.addEventListener('click', async function (e) {
        e.preventDefault();
        await loginUser();
    });
});

async function loginUser() {
    const email = document.querySelector("body > div > form > input[type=email]");
    const password = document.querySelector("body > div > form > input[type=password]");

    const requestBody = {
        // If backend expects username:
        // username: email.value,
        
        // If backend expects email:
        email: email.value,
        password: password.value
    };

    try {
        const response = await fetch("http://127.0.0.1:8000/api/login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Login failed:", data);
            alert("Error: " + JSON.stringify(data));
            return;
        }

        console.log("Login successful:", data);
        alert("Login successful!");
        window.location.href = "shop.html";

        
        // // Save token if JWT
        // if (data.access) {
        //     localStorage.setItem("access_token", data.access);
        //     localStorage.setItem("refresh_token", data.refresh);
        // }

        // Redirect to dashboard/home page
        
    } catch (error) {
        console.error("An error occurred:", error);
        alert("Something went wrong. Please try again.");
    }
}
