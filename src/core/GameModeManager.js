// Holds all game modes from game-modes.json
// Filters, retrives and access the game mode's info
export class GameModeManager {
    constructor() {
        this.modes = [];
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
            if (!mode.requires || mode.requires.lenght === 0) return true;
            return mode.requires.includes(languageId);
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