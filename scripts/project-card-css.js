export function getMyComponentCSS() {
    return `
            :host {
                --card-bg: #fff;
                --card-border: 1px solid #ddd;
                --card-radius: 8px;
                --text-color: #333;
                --hover-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
                display: block;
                max-width: 350px;
                border: var(--card-border);
                border-radius: var(--card-radius);
                box-shadow: var(--hover-shadow);
                background: var(--card-bg);
                padding: 16px;
                font-family: Arial, sans-serif;
                transition: transform 0.2s ease-in-out;
            }
            
            :host(:hover) {
                transform: scale(1.05);
            }

            .simple-card h2{
                font-size: 1.2rem;
                color: var(--text-color);
            }

            picture {
                display: block;
                width: 100%;
                height: 200px; /* Fixed height for all images */
                overflow: hidden; /* Prevents overflow if image aspect ratio differs */
            }

            picture img, picture source {
                width: 100%;
                height: 100%;
                object-fit: cover; /* This is the key property */
                object-position: center; /* Centers the image */
                border-radius: 4px;
            }

            .simple-card p{
                font-size: 0.9rem;
                color: var(--text-color);
            }

            .simple-card a{
                display: inline-block;
                margin-top: 10px;
                text-decoration: none;
                color: #007bff;
                font-weight: bold;
            }

            .simple-card a:hover {
                text-decoration: underline;
            }
            `;
}