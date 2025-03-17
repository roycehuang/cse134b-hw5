document.addEventListener("DOMContentLoaded", () => {

    const projectsList = document.getElementById("projectsList");
    const projectForm = document.getElementById("projectForm");
    const formTitle = document.getElementById("formTitle");
    const saveBtn = document.getElementById("saveBtn");
    const cancelBtn = document.getElementById("cancelBtn");
    
    const projectIdField = document.getElementById("projectId");
    const titleField = document.getElementById("title");
    const descriptionField = document.getElementById("description");
    const imageUrlField = document.getElementById("imageUrl");
    const altImgField = document.getElementById("altImg");
    const linkField = document.getElementById("link");
    
    const dataControls = document.querySelector(".data-source-controls");
    const loadLocalBtn = document.getElementById("loadLocalBtn");
    const loadRemoteBtn = document.getElementById("loadRemoteBtn");
    const saveLocalBtn = document.getElementById("saveLocalBtn");
    const saveRemoteBtn = document.getElementById("saveRemoteBtn");
    
    let projects = [];
    
    loadFromLocalStorage();
    
    loadLocalBtn.addEventListener("click", loadFromLocalStorage);
    loadRemoteBtn.addEventListener("click", loadFromRemote);
    saveLocalBtn.addEventListener("click", saveToLocalStorage);
    saveRemoteBtn.addEventListener("click", saveToRemote);
    cancelBtn.addEventListener("click", resetForm);
    projectForm.addEventListener("submit", handleFormSubmit);
    
    function loadFromLocalStorage() {
        const storedData = localStorage.getItem("projectsData");
        if (storedData) {
            projects = JSON.parse(storedData);
            // Ensure projects is always an array
            if (!Array.isArray(projects)) {
                console.warn("Stored data is not an array, attempting to extract array");
                projects = projects.record?.record || projects.record || projects.projects || [];
            }
            renderProjectsList();
            showStatusMessage("Projects loaded from local storage", "success");
        } else {
            projects = [];
            renderProjectsList();
            showStatusMessage("No projects found in local storage", "error");
        }
    }
    
    async function loadFromRemote() {
        try {
            showStatusMessage("Loading from remote server...", "info");
            const url = "https://api.jsonbin.io/v3/b/67d77abf8a456b7966773190";
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            
            const jsonData = await response.json();
            
            // Handle the nested structure from the API response
            if (jsonData.record && jsonData.record.record && Array.isArray(jsonData.record.record)) {
                projects = jsonData.record.record;
            } else if (jsonData.record && Array.isArray(jsonData.record)) {
                projects = jsonData.record;
            } else {
                console.error("Unexpected data structure:", jsonData);
                throw new Error("Unexpected data format from API");
            }
            
            renderProjectsList();
            showStatusMessage("Projects loaded from remote server", "success");
        } catch (error) {
            console.error("Error loading remote data:", error);
            showStatusMessage(`Error loading data: ${error.message}`, "error");
        }
    }
    
    function saveToLocalStorage() {
        localStorage.setItem("projectsData", JSON.stringify(projects));
        showStatusMessage("Projects saved to local storage", "success");
    }
    
    async function saveToRemote() {
        if (projects.length === 0) {
            showStatusMessage("No projects to save", "error");
            return;
        }
        try {
            showStatusMessage("Saving to remote server...", "info");
            
            // Format data to match the expected structure
            const dataToSave = {
                record: projects
            };
            
            // access key
            const url = "https://api.jsonbin.io/v3/b/67d77abf8a456b7966773190";
            const response = await fetch(url, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dataToSave)
            });
            
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            
            showStatusMessage("Projects saved to remote server", "success");
        } catch (error) {
            console.error("Error saving to remote:", error);
            showStatusMessage(`Error saving data: ${error.message}`, "error");
        }
    }
    
    function renderProjectsList() {
        projectsList.innerHTML = "";
        
        if (!Array.isArray(projects) || projects.length === 0) {
            projectsList.innerHTML = "<p>No projects available. Add a new project to get started.</p>";
            return;
        }
        
        projects.forEach((project, index) => {
            const projectItem = document.createElement("div");
            projectItem.className = "project-item";
            projectItem.innerHTML = `
                <div class="project-item-title">${project.title}</div>
                <div class="project-item-actions">
                    <button class="edit-btn" data-index="${index}">Edit</button>
                    <button class="delete-btn" data-index="${index}">Delete</button>
                </div>
            `;
            
            projectsList.appendChild(projectItem);
        });
        
        // Add event listeners to the newly created buttons
        document.querySelectorAll(".edit-btn").forEach(button => {
            button.addEventListener("click", handleEdit);
        });
        
        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", handleDelete);
        });
    }
    
    // Function to handle form submit (Create or Update)
    function handleFormSubmit(event) {
        event.preventDefault();
        
        const projectData = {
            title: titleField.value,
            description: descriptionField.value,
            imageUrl: imageUrlField.value,
            altImg: altImgField.value || imageUrlField.value,
            link: linkField.value
        };
        
        const projectId = projectIdField.value;
        
        if (projectId === "") {
            projects.push(projectData);
            showStatusMessage("Project added successfully", "success");
        } else {
            const index = parseInt(projectId);
            projects[index] = projectData;
            showStatusMessage("Project updated successfully", "success");
        }
        
        renderProjectsList();
        resetForm();
    }
    
    // Function to handle edit button click
    function handleEdit(event) {
        const index = event.target.getAttribute("data-index");
        const project = projects[index];
        
        // Populate the form with project data
        projectIdField.value = index;
        titleField.value = project.title;
        descriptionField.value = project.description;
        imageUrlField.value = project.imageUrl;
        altImgField.value = project.altImg;
        linkField.value = project.link;
        
        // Update form title and button text
        formTitle.textContent = "Edit Project";
        saveBtn.textContent = "Update Project";
        
        // Scroll to form
        document.querySelector(".project-form").scrollIntoView({ behavior: "smooth" });
    }
    
    // Function to handle delete button click
    function handleDelete(event) {
        if (confirm("Are you sure you want to delete this project?")) {
            const index = event.target.getAttribute("data-index");
            projects.splice(index, 1);
            renderProjectsList();
            showStatusMessage("Project deleted successfully", "success");
        }
    }
    
    // Function to reset form
    function resetForm() {
        projectForm.reset();
        projectIdField.value = "";
        formTitle.textContent = "Add New Project";
        saveBtn.textContent = "Save Project";
    }
    
    // Function to show status messages
    function showStatusMessage(message, type) {
        // Remove any existing status messages
        const existingMessage = document.querySelector(".status-message");
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message
        const statusMessage = document.createElement("div");
        statusMessage.className = `status-message ${type}`;
        statusMessage.textContent = message;
        
        // Insert after the data source controls
        dataControls.after(statusMessage);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            statusMessage.remove();
        }, 3000);
    }
    
    // Add styles for the info status
    const style = document.createElement("style");
    style.textContent = `
        .info {
            background-color: rgba(0, 123, 255, 0.2);
            border: 1px solid #007bff;
        }
        #saveRemoteBtn {
            background-color: #17a2b8;
            color: white;
        }
    `;
    document.head.appendChild(style);
});