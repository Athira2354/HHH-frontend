document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");

  form.addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent default form submission

    // Collect form data
    const formData = {
      username: form.querySelector('input[placeholder="User Name"]').value,
      full_name: form.querySelector('input[placeholder="Full Name"]').value,
      email: form.querySelector('input[placeholder="Email"]').value,
      password: form.querySelector('input[placeholder="Password"]').value,
      terms: form.querySelector('input[type="checkbox"]').checked,
    };

    if (!formData.terms) {
      alert("You must agree with Terms & Conditions");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCSRFToken(), // for Django CSRF protection
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful!");
        window.location.href = "login.html"; // redirect to login
      } else {
        alert(data.error || "Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    }
  });

  // Helper function to get CSRF token from cookies
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
