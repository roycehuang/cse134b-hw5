document.addEventListener("DOMContentLoaded", async () => {
    console.log("DOM Content Loaded");
    // await loadRemoteData(); // Load remote data initially
});

document.getElementById("loadLocal").addEventListener("click", () => {
    const localData = JSON.parse(localStorage.getItem("projectsData")) || [];
    populateProjects(localData);
});

document.getElementById("loadRemote").addEventListener("click", async () => {
    await loadRemoteData();
});

async function loadRemoteData() {
    const url = "https://api.jsonbin.io/v3/b/67ccbf0ead19ca34f818d739";

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Response status: ${response.status}`);

        const jsonData = await response.json();
        populateProjects(jsonData.record);
    } catch (error) {
        console.error("Error fetching remote data:", error);
    }
}

function populateProjects(projects) {
    const container = document.getElementById("projects");
    container.innerHTML = ""; // Clear previous content

    projects.forEach(project => {
        const projectCard = document.createElement("project-card");
        projectCard.setAttribute("title", project.title);
        projectCard.setAttribute("description", project.description);
        projectCard.setAttribute("imageUrl", project.imageUrl);
        projectCard.setAttribute("link", project.link);

        container.appendChild(projectCard);
    });
}
