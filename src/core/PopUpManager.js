// Controls opening/closing the pop-up and switching between the setup and game view
const hiddenView = "hidden-view";
const hiddenOverlay = "hidden";

export class PopupManager {
    
    constructor() {
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
        this.overlay.classList.remove(hiddenOverlay);
        this.showSetup();
    }

    // Hides the entire popup
    close(){
        this.overlay.classList.add(hiddenOverlay);
    }

    // Switch popup to setup
    showSetup() {
        this.setupView.classList.remove(hiddenView);
        this.gameView.classList.add(hiddenView);

        // Update title
        document.getElementById("game-title").textContent = "Setup";
    }

    // Switch popup to game
    showGame() {
        this.setupView.classList.add(hiddenView);
        this.gameView.classList.remove(hiddenView);

        // Update title
        document.getElementById("game-title").textContent = "Exercise";
    }
}