import { BaseGame } from "./BaseGame.js";

export class MatchingGame extends BaseGame {
    async load() {
        const { categoryId, levelIndex, fromLang, toLang } = this.settings;

        const category = this.app.categories.find(c => c.id === categoryId);
        const levelObj = category.levels[levelIndex];
        const wordIds = Object.values(levelObj)[0];
        const shuffled = [...wordIds].sort(() => Math.random() - 0.5);

        // Take 4 words
        const pairCount = 4;
        const selectedIds = shuffled.slice(0, pairCount);

        // Load lenguages
        const dictA = await this.app.json.load(`./data/lang/${fromLang}.json`);
        const dictB = await this.app.json.load(`./data/lang/${toLang}.json`);

        const wordsA = dictA.translations;
        const wordsB = dictB.translations;

        // Build the internal tile data
        this.tiles = [
            ...selectedIds.map(id => ({ id, lang: fromLang, display: wordsA[id] })),
            ...selectedIds.map(id => ({ id, lang: toLang,  display: wordsB[id] }))
        ].sort(() => Math.random() - 0.5); // Shuffle
    }

    async render() {
        const html = await this.app.templates.get("matching-base");
        this.container.innerHTML = html;

        this.grid = this.container.querySelector("#game-grid");
        this.first = null;
        this.locked = false;

        // Create tile DOM elements WITHOUT IDs
        this.tiles.forEach(tile => {
            const el = document.createElement("div");
            el.classList.add("game-tile");

            el.textContent =
                typeof tile.display === "string"
                ? tile.display
                : tile.display.kanji ?? tile.display.kana;

            tile.element = el; // keep connection inside JS only

            el.addEventListener("click", () => this.select(tile));
            this.grid.appendChild(el);
        });
    }

    select(tile) {
        if (this.locked) return;
        if (tile.element.classList.contains("correct")) return;

        if (!this.first) {
            this.first = tile;
            tile.element.classList.add("selected");
            return;
        }
        else {
            this.first.element.classList.remove("selected");
        }

        const a = this.first;
        const b = tile;

        // Correct match: same id but different language
        if (a.id === b.id && a.lang !== b.lang) {
            a.element.classList.add("correct");
            b.element.classList.add("correct");
        } else {
            // Wrong -> temporary lock + wrong animation
            this.locked = true;
            a.element.classList.add("wrong");
            b.element.classList.add("wrong");

            setTimeout(() => {
                a.element.classList.remove("wrong", "selected");
                b.element.classList.remove("wrong");
                this.locked = false;
            }, 700);
        }

        this.first = null;
        this.checkWin();
    }

    // Check if all tiles are marked correct
    checkWin() {
        const total = this.tiles.length;
        const done = this.tiles.filter(t => t.element.classList.contains("correct")).length;

        if (done === total) {
            this.finish(); // PopupManager handles Continue
        }
    }

    async start() {
        await this.load();
        await this.render();
    }
}