// Controls opening/closing the pop-up and switching between the setup and game view

const hiddenOverlay = "hidden";
const disabledOverlay = "disabled";
const hiddenView = "hidden-view";

export class PopupManager {
    
    constructor(app) {
        this.app = app;

        this.overlay = document.getElementById("game-overlay");
        this.popup = document.getElementById("game-popup");

        this.setupView = document.getElementById("setup-view");
        this.gameView = document.getElementById("game-view");

        this.closeBtn = document.getElementById("game-close-btn");
        this.playBtn = document.getElementById("setup-play-btn");

        this.closeBtn.addEventListener("click", () => this.close());
        this.playBtn.addEventListener("click", () => this.showGame());
    }

    // Makes overlay visible and shows the setup screen
    open() {
        this.overlay.classList.remove(hiddenOverlay, disabledOverlay);
        this.showSetup();
    }

    // Hides the entire popup
    close(){
        this.overlay.classList.add(hiddenOverlay);
        setTimeout(() => this.overlay.classList.add("disabled"), 150);
    }

    // Switch popup to setup
    showSetup() {
        this.setPlayButtonText("Play");
        this.enablePlayButton();
        
        this.setupView.classList.remove(hiddenView);
        this.gameView.classList.add(hiddenView);

        // Update title
        document.getElementById("game-title").textContent = "Setup";

        // Refresh UI when shown
        if (window.app && window.app.setupUI) {
            window.app.setupUI.refresh();
        }
    }

    // Switch popup to game
    showGame() {
        if (!window.app) return;

        this.setPlayButtonText("Next");
        this.disablePlayButton();

        const settings = window.app.setupUI.getSettings();
        const game = window.app.startGame(settings);
        
        
        this.setupView.classList.add(hiddenView);
        this.gameView.classList.remove(hiddenView);

        // Update title
        document.getElementById("game-title").textContent = "Exercise";
    }

    setPlayButtonText(text) {
        this.playBtn.textContent = text;
    }

    disablePlayButton() {
        this.playBtn.classList.add("disabled");
        this.playBtn.disabled = true;
    }

    enablePlayButton() {
        this.playBtn.classList.remove("disabled");
        this.playBtn.disabled = false;
    }
}