import { SettingSelector } from "./SettingSelector.js";

// Controls the setup popup UI
export class SetupUIManager {
    constructor(app) {
        this.app = app;
        this.selectedModeId = null;

        // refs
        this.modeBox = document.getElementById("mode-select");
        this.modeDropdown = document.getElementById("dropdown-modes");
        this.modeSelectedName = document.getElementById("mode-name");

        this.modeBox.addEventListener("click", () => this.toggleModeDropdown());
    }

    // Called when popup opens
    refresh() {
        const container = document.getElementById("setup-settings");
        container.innerHTML = "";

        this.createGameModeSelector(container);
        this.createCategorySelector(container);
        this.createLevelSelector(container);
    }

    createGameModeSelector(container) {
        const modes = this.app.modes.getCompatibleModes(window.toSelected);

        const items = modes.map(m => ({
            id: m.id,
            label: m.name
        }));

        const selector = new SettingSelector("setup-setting-selector", {
            title: "Game Mode",
            items,
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
            items,
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
            items,
            onSelect: (levelIndex) => {
                this.selectedLevel = levelIndex;
            }
        });

        container.appendChild(selector.element);
    }

    toggleModeDropdown() {
        this.modeDropdown.classList.toggle("disabled");
    }

    populateModeDropdown() {
        if (window.toSelected === null) return;
        const modes = this.app.modes.getCompatibleModes(window.toSelected);
        this.modeDropdown.innerHTML = "";

        const template = document.getElementById("mode-item");

        modes.forEach(mode => {
            const element = template.content.firstElementChild.cloneNode(true);

            element.querySelector(".dropdown-name").textContent = mode.name;

            element.addEventListener("click", () => {
                this.selectMode(mode.id);
            });

            this.modeDropdown.appendChild(element);
        });
    }

    selectMode(modeId) {
        this.selectedModeId = modeId;

        const mode = this.app.modes.getMode(modeId);
        this.modeSelectedName.textContent = mode.name;

        this.modeDropdown.classList.add("disabled");
    }
}