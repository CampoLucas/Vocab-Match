import { SettingSelector } from "./SettingSelector.js";

const elementClass = "settings-group";

export class SettingsGroup {
    constructor(templateId) {
        this.templateId = templateId;
        this.selectors = [];
        this.element = document.createElement("div");
        this.element.classList.add("settings-group");
    }

    build() {
        this.element = document.createElement("div");
    }

    // needs a method to refresh itself, it takes the new options
    refresh(options) {
        this.element.innerHTML = "";
        // ToDo: dispose all selectors
        this.selectors.length = 0;

        if (!options || options.length === 0) return;

        for (const opt of options) {
            if (!opt || !opt.items || opt.items.length === 0) {
                console.log(`WARNING: item not found`);
                continue;
            }

            const selector = new SettingSelector(this.templateId, {
                title: opt.title,
                items: opt.items,
                defaultIndex: opt.defaultIndex ? opt.defaultIndex : 0
            });

            this.selectors.push({
                id: opt.id,
                selector
            });

            this.element.appendChild(selector.element);
        }
    }

    getSettings() {
        const result = {};

        for (const entry of this.selectors) {
            result[entry.id] = entry.selector.getValue();
        }

        return result;
    }

    clear() {
        this.element.innerHTML = "";
        this.selectors.length = 0;
    }

}