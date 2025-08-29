document.addEventListener("DOMContentLoaded", function () {
    const signup = document.querySelector("body > div > form > button");

    signup.addEventListener('click', async function (e) {
        e.preventDefault(); 
        await signupUser();
    });
});

async function signupUser() {
    const userName = document.querySelector("body > div > form > input[type=text]:nth-child(1)");
    const fullName = document.querySelector("body > div > form > input[type=text]:nth-child(2)");
    const emailId = document.querySelector("body > div > form > input[type=email]:nth-child(3)");
    const password = document.querySelector("body > div > form > input[type=password]:nth-child(4)");
    const password2 = document.querySelector("body > div > form > input[type=password]:nth-child(4)");

    const requestBody = {
        username: userName.value,
        email: emailId.value,
        full_name: fullName.value,
        password: password.value,
        password2 : password2.value
    };

    try {
        const response = await fetch("http://127.0.0.1:8000/api/register/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Registration failed:", data);
            alert("Error: " + JSON.stringify(data));
            return;
        }

        console.log("User registered successfully:", data);
        alert("User registered successfully!");
        window.location.href = "login.html"

    } catch (error) {
        console.error("An error occurred:", error);
        alert("Something went wrong. Please try again.");
    }
}