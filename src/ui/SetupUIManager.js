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
        this.populateModeDropdown();
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