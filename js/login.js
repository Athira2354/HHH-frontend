document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");

  form.addEventListener("submit", async function (e) {
    e.preventDefault(); // Stop default form submission

    // Collect form data
    const formData = {
      email: form.querySelector('input[placeholder="Email"]').value,
      password: form.querySelector('input[placeholder="Password"]').value,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCSRFToken(), // CSRF token for Django
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login successful!");
        // Save token or session info if provided by backend
        if (data.token) {
          localStorage.setItem("authToken", data.token);
        }
        // Redirect after login
        window.location.href = "index.html";
      } else {
        alert(data.error || "Invalid email or password");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    }
  });

  // Helper function to fetch CSRF token from cookies
  function getCSRFToken() {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith("csrftoken=")) {
          cookieValue = cookie.substring("csrftoken=".length, cookie.length);
          break;
        }
      }
    }
    return cookieValue;
  }
});
