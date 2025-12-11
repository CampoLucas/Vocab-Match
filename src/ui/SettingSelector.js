export class SettingSelector {
    constructor(templateId, { title, id, items, onSelect, defaultIdex = null}) {
        this.templateId = templateId;
        this.title = title;
        this.items = items;
        this.onSelect = onSelect;
        this.id = id;

        this.defaultIdex = defaultIdex;
        this.selectedId = null;

        this.build();
    }

    build() {
        const template = document.getElementById(this.templateId);
        this.element = template.content.firstElementChild.cloneNode(true);
    
        // Tittle
        this.element.querySelector(".setting-title").textContent = this.title;

        // dropdown
        this.dropdownBtn = this.element.querySelector(".dropdown");
        this.dropdownList = this.element.querySelector(".dropdown-list");
        this.dropdownLabel = this.element.querySelector(".dropdown-name");

        // Make IDs unique
        this.dropdownBtn.id = this.dropdownBtn.id + "-" + this.id;
        this.dropdownList.id = this.dropdownList.id + "-" + this.id;

        // Open/close events
        this.dropdownBtn.addEventListener("click", () => {
            this.dropdownList.classList.toggle("disabled");
        });

        // Fill items
        this.populateItems();
    }

    populateItems() {
        this.dropdownList.innerHTML = "";

        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];

            if (item === null) {
                console.log(`WARNING: SettingSelector.populateItems() item from idx ${i} is null.`);
                continue;
            }

            const div = document.createElement("div");
            div.classList.add("dropdown-item");
            div.textContent = item.label;

            // If it has a default index, it preselects it
            if (this.defaultIdex !== null && this.defaultIdex === i) {
                this.selectedId = item.id;
                this.dropdownLabel.textContent = item.label;
                div.classList.add("selected");
                this.onSelect(item.id);
            }

            div.addEventListener("click", () => {
                this.selectedId = item.id;
                this.dropdownLabel.textContent = item.label;
                this.dropdownList.classList.add("disabled");

                if (this.onSelect) this.onSelect(item.id);
            });

            this.dropdownList.appendChild(div);

        }
    }
}