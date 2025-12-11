export class SettingSelector {
    constructor(templateId, { title, items, onSelect}) {
        this.templateId = templateId;
        this.title = title;
        this.items = items;
        this.onSelect = onSelect;

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
        this.dropdownBtn.id = this.dropdownBtn.id + "-" + this.title;
        this.dropdownList.id = this.dropdownList.id + "-" + this.title;

        // Open/close events
        this.dropdownBtn.addEventListener("click", () => {
            this.dropdownList.classList.toggle("disabled");
        });

        // Fill items
        this.populateItems();
    }

    populateItems() {
        this.dropdownList.innerHTML = "";

        this.items.forEach(item => {
            const div = document.createElement("div");
            div.classList.add("dropdown-item");
            div.textContent = item.label;

            div.addEventListener("click", () => {
                this.selectedId = item.id;
                this.dropdownLabel.textContent = item.label;
                this.dropdownList.classList.add("disabled");

                if (this.onSelect) this.onSelect(item.id);
            });

            this.dropdownList.appendChild(div);
        });
    }
}