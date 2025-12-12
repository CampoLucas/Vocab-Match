// Loads the HTML templates via fetch
// Uses a refistry so gamemodes can request templates by ID instead of file paths
export class TemplateLoader {
    constructor() {
        this.cache = new Map();
        this.registry = new Map();
    }

    // Loads the template registry JSON into memory
    loadRegistry(jsonData) {
        const temp = jsonData.templates;

        if (temp !== null) {
            for (let i = 0; i < temp.length; i++) {
                const t = temp[i];

                if (i === null){
                    console.log(`Error: The template of index ${i} is null`);
                    continue;
                } 

                this.registry.set(t.id, t.path);
            }
        } else {
            console.log(`ERROR: No templates found`);
        }
    }

    // Loads a template by ID
    // Returns the raw HTML string
    async get(id) {
        if (!this.registry.has(id)) {
            throw new Error(`Template ID not found: ${id}`);
        }

        const path = this.registry.get(id);
        
        // return cached HTML if already loaded
        if (this.cache.has(path)) {
            return this.cache.get(path);
        }

        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`Failed to load template: ${path}`);
        }

        const html = await response.text();

        // cache the HTML so it's only fetched once
        this.cache.set(path, html);
        return html;
    }
}