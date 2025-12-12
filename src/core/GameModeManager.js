// Holds all game modes from game-modes.json
// Filters, retrives and access the game mode's info
export class GameModeManager {
    constructor(app) {
        this.app = app;
        this.modes = [];
    }

    // Only the modes that are not disabled and match the language requirements
    getAvailableModes(lang) {
        return this.modes.filter(mode => {
            if (mode.options?.disabled) return false;
            if (!mode.requires) return true;
            return mode.requires.every(req => lang);
        })
    }

    // Only categories usable by the selected mode
    getAvailableCategories(modeId, lang) {
        const mode = this.getAvailableModes(lang).find(m => m.id === modeId);
        if (!mode) return [];

        const langReq = mode.requires || [];

        return this.app.categories.filter(c => {
            if (c.options?.disabled) return false;
            if (c.language.includes("any")) return true;
            return langReq.some(r => c.language.includes(r));
        });
    }

    getCategory(id) {
        return this.app.categories.find(c => c.id === id);
    }

    // Initialize manager with mode list from JSON
    loadModes(modeList) {
        if (!Array.isArray(modeList)) {
            console.error("Error: GameModeManager.loadModes expected an array.");
            return;
        }

        this.modes = modeList;
    }

    // Returns a full list of all modes
    getAllModes() {
        return this.modes;
    }

    // Get a single mode by id
    getMode(id) {
        return this.modes.find(m => m.id === id) || null;
    }

    // Filter modes by tequired target language
    getCompatibleModes(languageId) {
        return this.modes.filter(mode => {
            
            // Exclude disabled modes
            //if (mode.disabled === true) return false;
            if (mode.options?.disabled === true) return false;

            // Mode requires specific languages
            if (mode.requires && 
                Array.isArray(mode.requires) && 
                mode.requires.lenght > 0 && 
                !mode.requires.includes(toLang)) {
                return false;
            }
            
            return true;
        })
    }

    // Get the template ID associated with a mode
    getTemplateId(modeId) {
        const mode = this.getModes(modeId);
        return mode ? mode.template : null;
    }

    // Get the js class name associated with a mode
    getClassName(modeId) {
        const mode = this.getMode(modeId);
        return mode ? mode.class : null;
    }

    // Get options (pairCounts, choices, etc)
    getOptions(modeId) {
        const mode = this.getMode(modeId);
        return mode ? mode.options : null;
    }

}