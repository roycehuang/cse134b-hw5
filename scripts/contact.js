document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contactForm");
    const errorOutput = document.getElementById("error-message");
    const infoOutput = document.getElementById("info-message");

    form.addEventListener("submit", function (event) {
        errorOutput.textContent = "";  // Clear previous errors
        infoOutput.textContent = "";   // Clear previous info messages
        
        let errors = [];

        // Get form fields
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        // Validate fields
        if (!name) {
            errors.push("Name is required.");
        }

        if (!email) {
            errors.push("Email is required.");
        } else if (!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
            errors.push("Please enter a valid email address.");
        }

        // Display errors if any
        if (errors.length > 0) {
            errorOutput.textContent = errors.join(" ");
            event.preventDefault(); // Stop form submission if there are errors
            return;
        }

        // If no errors, show success message
        infoOutput.textContent = "Form submitted successfully!";
    });
});