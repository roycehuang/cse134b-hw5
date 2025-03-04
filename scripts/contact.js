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
    // Validate each field
    // validateField(nameField, /^[a-zA-Z.]+$/, "Name can only contain letters and periods.");
    // validateField(emailField, /^[^@\s]+@[^@\s]+\.[^@\s]+$/, "Please enter a valid email address.");
    // validateField(messageField, /^[a-zA-Z0-9\s.,!?'-]+$/, "Message contains invalid characters.");
    // validateMessageField(messageField);

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
    // Serialize errors into the hidden input field (empty if no errors)
    // document.getElementById("form-errors").value = JSON.stringify(form_errors);

    // infoOutput.textContent = "Form submitted successfully!";
    // // infoOutput.classList.remove("hidden");

    // Serialize form_errors to a hidden input field before submission
    const errorsInput = document.createElement("input");
    errorsInput.type = "hidden";
    errorsInput.name = "form-errors";
    errorsInput.value = JSON.stringify(form_errors);
    event.target.appendChild(errorsInput);

    event.target.submit();  // Proceed with the form submission
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