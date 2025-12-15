import { SettingSelector } from "./SettingSelector.js";
import { SettingsGroup } from "./SettingsGroup.js";

const randomCategory = "__random__";
const settingsSelectorTemplate = "setup-setting-selector";
const gmSelectedEvent = "gameModeSelected";
const catSelectedEvent = "categorySelected";
const lvSelectedEvent = "levelSelected";

// Controls the setup popup UI
export class SetupUIManager {
    constructor(app) {
        this.app = app;

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
        console.log("hey")
        const container = document.getElementById("setup-settings");
        container.innerHTML = "";

        this.gameModeSelector = null;
        this.categorySelector = null;
        this.levelSelector = null;
        this.modeSettings = null;
        this.langSettings = null;

        this.setMainSettings(container);

        this.setModeSettings(container);
    }

    getSettings() {
        let categoryId = this.categorySelected;
        let selectedLevel = this.selectedLevel ?? 0;

        // random category
        if (categoryId === "__random__") {
            const available = this.app.modes.getAvailableCategories(this.selectedMode, window.toLang);
            const randomCat = available[Math.floor(Math.random() * available.length)];
            categoryId = randomCat.id;
        }
        
        if (selectedLevel === -1) {
            selectedLevel = Math.floor(Math.random() * 5);
        }

        const modeOptions = this.modeSettings
            ? this.modeSettings.getSettings()
            : {};

        const langOptions = this.langSettings
            ? this.langSettings.getSettings()
            : {};
        
        return {
            modeId: this.selectedMode,
            categoryId: categoryId,
            levelIndex: selectedLevel,
            fromLang: window.fromSelected,
            toLang: window.toSelected,
            options: {
                ...modeOptions,
                ...langOptions
            }
        };
    }

    setMainSettings(container) {
        this.setGameModeSelector(container);
        this.setCategorySelector(container);
        this.setLevelSelector(container);

        this.setModeSettings(container);
        this.setLanguageSettings(container);
    }

    setModeSettings(container) {
        if (!this.modeSettings) {
            this.modeSettings = new SettingsGroup(settingsSelectorTemplate);
            container.appendChild(this.modeSettings.element);
        }

        this.refreshModeSettings();

        
    }

    setLanguageSettings(container) {
        //if (!window.toSelected) return;
        if (!this.langSettings) {
            this.langSettings = new SettingsGroup(settingsSelectorTemplate);
            container.appendChild(this.langSettings.element);
        }

        const lang = this.app.getLangById(window.toSelected);
        this.langSettings.refresh(lang.options);
    }

    refreshModeSettings(){
        if (!this.modeSettings) return;
        const options = this.app.modes.getOptions(this.selectedMode);

        this.modeSettings.refresh(options);
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
        if (!this.levelSelector) return;
        let cat = null;
        let isActive = this.categorySelected !== null;
        
        this.levelSelector.setActive(isActive);
        if (!isActive) return;

        // Build items for each level
        const items = [
            { id: -1, label: "Random" },
            { id: 0, label: "Level 1" },
            { id: 1, label: "Level 2" },
            { id: 2, label: "Level 3" },
            { id: 3, label: "Level 4" },
            { id: 4, label: "Level 5" }
        ]

        this.levelSelector.setItems(items);
    }

    onGameModeSelected(mode) {
        this.selectedMode = mode;
        this.emit(gmSelectedEvent, mode);

        this.refreshCategorySelector(this.categorySelector);
        this.refreshModeSettings();
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