import { getMyComponentCSS } from './project-card-css.js';
class ProjectCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    connectedCallback() {
        // HTML and inline style as template literals for easy modification
        const style = document.createElement('style');
        style.textContent = getMyComponentCSS();

        const title = this.getAttribute('title') || 'Unknown Title';
        const description = this.getAttribute('description') || 'Unknown Description';
        const imageUrl = this.getAttribute('imageUrl') || '';
        const link = this.getAttribute('link') || '#';

        // Template for component content
        this.shadowRoot.innerHTML = '';
        this.shadowRoot.appendChild(style);
        this.shadowRoot.innerHTML += `
            <div class="simple-card">
                <h2>${title}</h2>
                <picture>
                    <img src=${imageUrl} alt="${title} Image"/>
                </picture>
                <p>${description}</p>
                <a target="_blank" >Learn More</a>
            </div>
        `;

    }
}

// Define the custom element
console.log("custom element defined");
customElements.define('project-card', ProjectCard);