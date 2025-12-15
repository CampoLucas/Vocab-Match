const selectedClass = "selected";
const dropdownItemClass = "dropdown-item";
const disabledClass = "disabled";

export class SettingSelector {
    constructor(templateId, { title, defaultLabel = "Select", items = [], onSelect = null, defaultIndex = null }) {
        this.templateId = templateId;
        this.data = {
            title,
            defaultLabel,
            items,
            onSelect,
            currentIndex: defaultIndex
        };

        this.build();

        if (this.data.currentIndex !== null) {
            this.selectIndex(this.data.currentIndex, true);
        }
    }

    setOnSelect(onSelect) {
        this.data.onSelect = onSelect;
    }

    setItems(items) {
        this.data.items = items ?? [];
        this.refreshItems(this.data.items);

        if (this.data.currentIndex !== null) {
            this.selectIndex(this.data.currentIndex, true);
        }
    }

    setActive(state) {
        this.element.classList.toggle(disabledClass, !state);
        if (!state) {
            this.dropdownList.classList.add(disabledClass);
            this.dropdownLabel.textContent = "disabled";
        }
    }

    build() {
        if (!this.templateId) throw new Error(`ERROR: The templateId is null.`);
        const template = document.getElementById(this.templateId);

        if (!template) throw new Error(`ERROR: A template with the id ${this.templateId} was not found.`)

        this.element = template.content.firstElementChild.cloneNode(true);
    
        // Tittle
        var title = this.data.title;
        this.element.querySelector(".setting-title").textContent = title ? title : "";

        // dropdown
        this.dropdownBtn = this.element.querySelector(".dropdown");
        this.dropdownList = this.element.querySelector(".dropdown-list");
        this.dropdownLabel = this.element.querySelector(".dropdown-name");

        // // Make IDs unique
        // this.dropdownBtn.id = this.dropdownBtn.id + "-" + this.id;
        // this.dropdownList.id = this.dropdownList.id + "-" + this.id;

        // Open/close events
        this.dropdownBtn.addEventListener("click", () => {
            this.dropdownList.classList.toggle("disabled");
        });

        document.addEventListener("click", (event) => {
            const clickedInside = this.dropdownBtn.contains(event.target) || this.dropdownList.contains(event.target);
            
            if (!clickedInside) {
                this.dropdownList.classList.add("disabled");
            }
        });

        this.refreshItems(this.data.items);
    }

    refreshItems(items) {
        this.dropdownList.innerHTML = "";
        
        const label = this.dropdownLabel;
        if (!items || items.length === 0) {
            // this.data.currentIndex = null;
            label.textContent = "No items";
            
            return;
        }

        const currIndex = this.data.currentIndex;
        if (currIndex !== null && currIndex < items.length) {
            this.dropdownLabel.textContent = items[currIndex].label;
        } else {
            this.dropdownLabel.textContent = this.data.defaultLabel;
        }

        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            if (item === null) {
                console.log(`WARNING: SettingSelector.populateItems() item from idx ${i} is null.`);
                continue;
            }

            const div = document.createElement("div");
            div.classList.add(dropdownItemClass);
            div.textContent = item.label;

            div.addEventListener("click", () => this.selectIndex(i, true))

            this.dropdownList.appendChild(div);
        }
    }

    selectIndex(index, notify) {
        const items = this.data.items;
        if (!items || index < 0 || index >= items.length) return;

        this.data.currentIndex = index;
        const item = items[index];

        this.dropdownLabel.textContent = item.label;
        this.dropdownList.classList.add(disabledClass);

        if (notify && this.data.onSelect) {
            this.data.onSelect(item.id);
        }
    }

    getValue() {
        if (this.data.currentIndex === null) return null;
        const item = this.data.items[this.data.currentIndex];
        return item ? item.id : null;
    }
}