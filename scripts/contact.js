// Modified version of contact.js with EmailJS integration
let form_errors = [];

function validateForm(event) {
    event.preventDefault();

    const nameField = document.getElementById("name");
    const emailField = document.getElementById("email");
    const messageField = document.getElementById("message");

    const errorOutput = document.getElementById("error-message");
    resetValidationState();

    errorOutput.textContent = "";

    // Validate fields
    const nameValid = validateField(nameField, /^[a-zA-Z. ]+$/, "Name can only contain letters, periods, and spaces.");
    const emailValid = validateField(emailField, /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid email address.");
    const messageValid = validateField(messageField, /^[a-zA-Z0-9\s.,!?'-]+$/, "Message contains invalid characters.");
    const messageCntValid = validateMessageField(messageField);

    // Show errors if any
    if (!nameValid || !emailValid || !messageValid || !messageCntValid) {
        errorOutput.innerHTML = form_errors
            .map(error => `${error.field}: ${error.error}`)
            .join("<br>");
        errorOutput.classList.remove("hidden");

        return false; // Prevent form submission if there are errors
    }

    // If validation passes, send email using EmailJS
    sendEmail(nameField.value, emailField.value, messageField.value);
    
    return false; // Prevent the default form submission
}

// New function to send email using EmailJS
function sendEmail(name, email, message) {
    // Show loading state
    const submitButton = document.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
    
    const infoMessage = document.getElementById("info-message");
    infoMessage.textContent = "Sending your message...";
    infoMessage.className = "";

    // Prepare template parameters
    const templateParams = {
        from_name: name,
        reply_to: email,
        message: message
    };
    
    // Send email using EmailJS
    emailjs.send("service_sp9kkg9", "template_ubfnhn6", templateParams)
        .then(function(response) {
            console.log("SUCCESS!", response.status, response.text);
            
            // Show success message
            infoMessage.textContent = "Your message has been sent successfully!";
            infoMessage.className = "success";
            
            // Reset form
            document.querySelector('form').reset();
            
            // Record successful submission (if needed)
            // You could send this to analytics or your backend
        })
        .catch(function(error) {
            console.error("FAILED...", error);
            
            // Show error message
            const errorOutput = document.getElementById("error-message");
            errorOutput.textContent = "Failed to send message. Please try again later.";
            errorOutput.classList.remove("hidden");
            
            // Record error for debugging
            recordError("email-service", "sending-failed", JSON.stringify(error));
        })
        .finally(function() {
            // Re-enable the submit button
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        });
}

function validateField(field, regex, errorMessage) {
    // Check if field exists and is a valid form element
    console.log("field", field.name, !regex.test(field.value.trim()), field.value.trim());
    const value = field.value ? field.value.trim() : ""; // Ensure value is defined
    if (!value || !regex.test(value)) {
        // Set custom validity message for invalid input
        field.setCustomValidity(errorMessage);
        flashError(field, errorMessage); // Flash error message
        recordError(field.name, "validation", field.value); // Record error details
        return false;
    } else {
        // Clear custom validity message for valid input
        field.setCustomValidity("");
        field.classList.remove("input-error");
        return true;
    }
}

function validateMessageField(field) {
    if (!field || !field.value) return; // Check if field exists and has value
    const value = field.value ? field.value.trim() : ""; // Ensure value is defined
    
    if (value.length < 10) {
        flashError(field, "Message must be at least 10 characters.");
        recordError("message", "too short", value);
        return false;
    } else if (value.length > 200) {
        flashError(field, "Message exceeds 200 characters.");
        recordError("message", "too long", value);
        return false;
    }
    return true;
}

function flashError(element, message) {
    element.classList.add("input-error"); // Highlight the input field
    const errorOutput = document.getElementById("error-message");
    errorOutput.textContent = message;

    // errorOutput.classList.remove("hidden");

    setTimeout(() => {
        element.classList.remove("input-error");
        // fadeOutError(errorOutput);
        errorOutput.textContent = "";
    }, 3000); // Flash for 3 seconds
}

function maskInput(input) {
    input.addEventListener("input", (e) => {
        const pattern = new RegExp(input.pattern || ".*");
        const value = e.target.value.trim();
        if (!pattern.test(value)) {
            flashError(input, `Illegal character entered in ${input.name}`);
            recordError(input.name, "illegal character", value[value.length - 1]);
        } else {
            input.setCustomValidity(""); // Reset custom validity when input is corrected
            input.classList.remove("input-error"); // Remove error styles
        }
    });
}

function updateCharCount(textarea) {
    const maxLength = parseInt(textarea.getAttribute("maxlength"));
    const infoMessage = document.getElementById("info-message");

    textarea.addEventListener("input", () => {
        const remainingChars = maxLength - textarea.value.length;

        infoMessage.textContent = `${remainingChars} characters remaining`;

        if (remainingChars <= maxLength * 0.05) {
            infoMessage.className = "error"; // Critical state
        } else if (remainingChars <= maxLength * 0.1) {
            infoMessage.className = "warning"; // Less critical state
        } else {
            infoMessage.className = ""; // Normal state
        }
    });
}

function recordError(fieldName, errorType, inputValue) {
    if (!inputValue || inputValue === "undefined") return; // Avoid logging undefined values
    form_errors.push({
        field: fieldName,
        type: errorType,
        input: inputValue,
    });
}

function resetValidationState() {
    const inputs = document.querySelectorAll("input, textarea");
    
    inputs.forEach((input) => {
        input.setCustomValidity(""); // Clear custom validity messages
        input.classList.remove("input-error"); // Remove error styles
    });

    const errorOutput = document.getElementById("error-message");
    if (errorOutput) {
        errorOutput.textContent = ""; // Clear error message block
        errorOutput.classList.add("hidden"); // Hide the block
    }
}

document.addEventListener("DOMContentLoaded", () => {
    maskInput(document.getElementById("name"));
    maskInput(document.getElementById("email"));
    maskInput(document.getElementById("message"));
    
    updateCharCount(document.getElementById("message"));
});