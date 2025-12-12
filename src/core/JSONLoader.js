
// Responsible for fetching JSON files
// It caches results
export class JSONLoader {
    constructor() {
        this.cache = new Map();
    }

    // Loads and parses a JSON file
    // Uses cache to avoid fetching the same file twice
    async load(path) {
        // return cached
        if (this.cache.has(path)) {
            console.log(`has cache for ${path}`);
            return this.cache.get(path);
        }

        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`Failed to load JSON: ${path}`);
        }

        // save to cache
        const data = await response.json();
        this.cache.set(path, data);

        return data;
    }
}