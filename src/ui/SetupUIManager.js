import { SettingSelector } from "./SettingSelector.js";

const randomCategory = "__random__";
const settingsSelectorTemplate = "setup-setting-selector";
const gmSelectedEvent = "gameModeSelected";
const catSelectedEvent = "categorySelected";
const lvSelectedEvent = "levelSelected";

// Controls the setup popup UI
export class SetupUIManager {
    constructor(app) {
        this.app = app;
        this.selectedModeId = null;

        this.gameModeSelector = null;
        this.categorySelector = null;
        this.levelSelector = null;

        this.listeners = {
            gameModeSelected: [],
            categorySelected: [],
            levelSelected: []
        };
    }

    on(event, fn) {
        this.listeners[event].push(fn);
    }

    emit(event, data) {
        for (const fn of this.listeners[event]) {
            fn(data);
        }
    }

    // Called when popup opens
    refresh() {
        const container = document.getElementById("setup-settings");
        container.innerHTML = "";

        this.gameModeSelector = null;
        this.categorySelector = null;
        this.levelSelector = null;

        this.setGameModeSelector(container);
        this.setCategorySelector(container);
        this.setLevelSelector(container);
    }

    getSettings() {
        let categoryId = this.selectedCategoryId;

        // random category
        if (categoryId === "__random__") {
            const cats = this.app.modes.getAvailableCategories(
                this.selectedModeId
            );
            const randomCat = cats[Math.floor(Math.random() * cats.length)];
            categoryId = randomCat.id;
        }
        
        return {
            modeId: this.selectedModeId,
            categoryId: categoryId,
            levelIndex: this.selectedLevel,
            fromLang: window.fromSelected,
            toLang: window.toSelected
        };
    }

    setGameModeSelector(container) {
        if (!this.gameModeSelector) {
            const modes = this.app.modes.getCompatibleModes(window.toSelected);

            const items = modes.map(m => ({
                id: m.id,
                label: m.name
            }));    

            this.gameModeSelector = new SettingSelector(settingsSelectorTemplate, {
                title: "Game Mode",
                items: items,
                defaultIndex: 0,
                onSelect: (mode) => this.onGameModeSelected(mode)
            });

            container.appendChild(this.gameModeSelector.element);
        }
        else {
            console.log(`already has`);
        }
    }

    setCategorySelector(container) {
        if (!this.categorySelector) {
            this.categorySelector = new SettingSelector(settingsSelectorTemplate, {
                title: "Category",
                defaultIndex: 0,
                onSelect: (category) => this.onCategorySelected(category)
            });

            container.appendChild(this.categorySelector.element);
        }

        this.refreshCategorySelector();
        
    }

    setLevelSelector(container) {
        if (!this.levelSelector) {
            this.levelSelector = new SettingSelector(settingsSelectorTemplate, {
                title: "Difficulty",
                defaultIndex: 0,
                onSelect: (level) => this.onLevelSelected(level)
            });

            container.appendChild(this.levelSelector.element);
        }

        this.refreshLevelSelector();
    }

    refreshCategorySelector() {
        if (!this.categorySelector) return;
        console.log(`refresh categories ${this.categorySelected ? this.categorySelected : 0}`);

        const available = this.app.modes.getAvailableCategories(this.selectedMode, window.toLang);

        const isActive = available && available.length !== 0;
        this.categorySelector.setActive(isActive);
        if (!isActive) return;

        const items = [
            { id: randomCategory, label: "Random" },
            ...available.map(c => ({ id: c.id, label: c.name }))
        ]

        this.categorySelector.setItems(items);
    }

    refreshLevelSelector() {
        console.log("refresh levels");
        if (!this.levelSelector) return;
        let cat = null;
        let isActive = this.categorySelected !== null && this.categorySelected !== randomCategory;
        
        if (isActive) {
            // category not found or disabled
            cat = this.app.modes.getCategory(this.categorySelected);
            if (!cat || !cat.levels || !Array.isArray(cat.levels)) {
                isActive = false;
            }
        }

        this.levelSelector.setActive(isActive);
        if (!isActive) return;

        // Build items for each level
        const items = cat.levels.map((lvl, i) => ({
            id: i,
            label: "Level " + (i + 1)
        }));

        this.levelSelector.setItems(items);
    }

    onGameModeSelected(mode) {
        this.selectedMode = mode;
        this.emit(gmSelectedEvent, mode);

        this.refreshCategorySelector(this.categorySelector);
    }

    onCategorySelected(category) {
        this.categorySelected = category;
        this.emit(catSelectedEvent, category);

        this.refreshLevelSelector(this.levelSelector);
    }

    onLevelSelected(level) {
        this.selectedLevel = level;
        this.emit(lvSelectedEvent, level);
    }

    
}