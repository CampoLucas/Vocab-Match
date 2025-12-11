import { SettingSelector } from "./SettingSelector.js";

// Controls the setup popup UI
export class SetupUIManager {
    constructor(app) {
        this.app = app;
        this.selectedModeId = null;
    }

    // Called when popup opens
    refresh() {
        const container = document.getElementById("setup-settings");
        container.innerHTML = "";

        this.createGameModeSelector(container);
        this.createCategorySelector(container);
        this.createLevelSelector(container);
    }

    getSettings() {
        return {
            modeId: this.selectedModeId,
            categoryId: this.selectedCategoryId,
            levelIndex: this.selectedLevel,
            fromLang: window.fromSelected,
            toLang: window.toSelected
        };
    }

    createGameModeSelector(container) {
        const modes = this.app.modes.getCompatibleModes(window.toSelected);

        const items = modes.map(m => ({
            id: m.id,
            label: m.name
        }));

        const selector = new SettingSelector("setup-setting-selector", {
            title: "Game Mode",
            id: "game-mode",
            items,
            defaultIdex: 0,
            onSelect: (modeId) => {
                this.selectedModeId = modeId;
            }
        });

        container.appendChild(selector.element);
    }

    createCategorySelector(container) {
        const items = this.app.categories.map(c => ({
            id: c.id,
            label: c.name
        }));

        const selector = new SettingSelector("setup-setting-selector", {
            title: "Category",
            id: "category",
            items,
            defaultIdex: 0,
            onSelect: (catId) => {
                this.selectedCategoryId = catId;
            }
        });

        container.appendChild(selector.element);
    }

    createLevelSelector(container) {
        if (!this.selectedCategoryId) return;

        const category = this.app.categories.find(c => c.id === this.selectedCategoryId);

        // Extract the level names
        const items = category.levels.map((lvl, i) => ({
            id: i,
            label: "Level " + (i + 1)
        }));

        const selector = new SettingSelector("setup-setting-selector", {
            title: "Difficulty",
            id: "difficulty",
            items,
            defaultIdex: 0,
            onSelect: (levelIndex) => {
                this.selectedLevel = levelIndex;
            }
        });

        container.appendChild(selector.element);
    }
}