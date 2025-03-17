document.addEventListener("DOMContentLoaded", async () => {
    console.log("DOM Content Loaded");
    initializeLocalStorage();
  });

document.getElementById("loadLocal").addEventListener("click", () => {
    const localData = JSON.parse(localStorage.getItem("projectsData")) || [];
    
    if (localData.length === 0) {
        const container = document.getElementById("projects");
        container.innerHTML = "No projects found in local storage";
    } else {
        // Proceed with populating projects as before
        populateProjects(localData);
    }
});

document.getElementById("loadRemote").addEventListener("click", async () => {
    await loadRemoteData();
});

function populateProjects(projects) {
    const container = document.getElementById("projects");
    container.innerHTML = ""; // Clear previous content

    projects.forEach(project => {
        // console.log("Project data:", project);

        const projectCard = document.createElement("project-card");
        projectCard.setAttribute("title", project.title || "Unknown Title");
        projectCard.setAttribute("description", project.description || "No description available");
        projectCard.setAttribute("imageUrl", project.imageUrl || "default.jpg");
        projectCard.setAttribute("altImg", project.altImg || "default.png");
        projectCard.setAttribute("link", project.link || "#");


        container.appendChild(projectCard);
    });
}

// Add this function and call it during page load
function initializeLocalStorage() {
    if (!localStorage.getItem("projectsData")) {
      // Sample data for localStorage
      const sampleProjects = [
        {
            title: "PomoSquare WebApp",
            description: "A project using MERN stack connecting students to study together.",
            imageUrl: "https://roycehuang.github.io/cse134b-hw5/images/pomosquare.png",
            altImg: "https://cdn-icons-png.flaticon.com/512/14359/14359077.png",
            link: "https://pomofocus.io/"
        },
        {
            title: "Flight Costs Predictor",
            description: "Utilizing Machine Learning to predict the airline costs based on distance, time, and location.",
            imageUrl: "https://roycehuang.github.io/cse134b-hw5/images/flights.png",
            altImg: "https://www.shutterstock.com/image-vector/flight-cost-growth-rising-airfare-600nw-2367596125.jpg",
            link: "https://github.com/BillWang04/CSE151A-Group-Project"
        },
        {
            title: "Website Portfolio",
            description: "Deployment of a personal portfolio that utilizes vanilla HTML, CSS, and JavaScript to display a strong understanding of basic webclient languages.",
            imageUrl: "https://roycehuang.github.io/cse134b-hw5/images/portfolio.png",
            altImg: "https://cdn-icons-png.flaticon.com/512/7867/7867852.png",
            link: "https://roycehuang.netlify.app/"
        },
        {
            title: "Developer Journal",
            description: "A project showing CRUD operations implemented using HTML, CSS, and JavaScript.",
            imageUrl: "https://roycehuang.github.io/cse134b-hw5/images/developerjournal.png",
            altImg: "https://cdn-icons-png.flaticon.com/512/5145/5145902.png",
            link: "https://github.com/cse110-sp24-group20/cse110-sp24-group20"
        },
        {
            title: "9-Bit Microprocessor",
            description: "Designed and implemented a custom Instruction Set Architecture (ISA) based on RISC principles limited to a 9-bit instruction format and optimized instruction efficiency by reducing the number of registers and operations",
            imageUrl: "https://roycehuang.github.io/cse134b-hw5/images/microprocessor.png",
            altImg: "https://cdn-icons-png.flaticon.com/512/4404/4404420.png",  
            link: "https://github.com/roycehuang/CSE141L-Final-Project"
        }
    ];

    localStorage.setItem("projectsData", JSON.stringify(sampleProjects));

    }
  }
  
  async function loadRemoteData() {
    const url = "https://api.jsonbin.io/v3/b/67d77abf8a456b7966773190";
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const jsonData = await response.json();
        const projectsContainer = document.getElementById("projects");
        projectsContainer.innerHTML = ""; 
        const projects = jsonData.record;
        if (!Array.isArray(projects)) {
            throw new Error("Expected an array of projects, but got something else");
        }
        projects.forEach(project => {
            const projectCard = document.createElement("project-card");
            projectCard.setAttribute("title", project.title || "Untitled Project");
            projectCard.setAttribute("description", project.description || "No description available");
            projectCard.setAttribute("imageUrl", project.imageUrl || "");
            projectCard.setAttribute("altImg", project.altImg || "");
            projectCard.setAttribute("link", project.link || "#");
            
            projectsContainer.appendChild(projectCard);
        });

    } catch (error) {
        console.error("Error loading remote data:", error.message);
        const projectsContainer = document.getElementById("projects");
        projectsContainer.innerHTML = `
            <div class="error-message">
                <h3>Error loading projects</h3>
                <p>${error.message}</p>
            </div>
        `;
    }
}