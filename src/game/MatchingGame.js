import { BaseGame } from "./BaseGame.js";

export class MatchingGame extends BaseGame {
    async load() {
        const { categoryId, levelIndex, fromLang, toLang } = this.settings;

        const category = this.app.modes.getCategory(categoryId);
        if (!category) throw new Error(`Category not found: ${categoryId}`);

        const level = category.levels[levelIndex]
        if (!level) throw new Error(`Level not found: ${levelIndex}`);

        const words = Object.values(level)[0];
        if (!words || !words.length) throw new Error("Empty level");

        const count = 4;
        const chosen = this.shuffle(words).slice(0, count);

        this.tiles = await this.loadTiles(chosen, fromLang, toLang);

        await this.renderGrid(this.shuffle(this.tiles));
    }

    async loadTiles(wordIds, langA, langB) {

        const fileA = await fetch(`./data/lang/${langA}.json`).then(r => r.json());
        const fileB = await fetch(`./data/lang/${langB}.json`).then(r => r.json());

        return [
            ...wordIds.map(id => ({ id, text: fileA.translations[id] })),
            ...wordIds.map(id => ({ id, text: fileB.translations[id] }))
        ];
    }

    async render(tiles) {
        const html = await this.app.templates.get("matching-base");
        this.container.innerHTML = html;

        this.grid = this.container.querySelector("#game-grid");
        this.grid.innerHTML = "";
        
        this.first = null;
        this.locked = false;

        // Create tile DOM elements WITHOUT IDs
        tiles.forEach(tile => {
            const btn = document.createElement("div");
            btn.classList.add("game-tile");
            btn.textContent = tile.text;

            tile.element = btn; // keep connection inside JS only

            btn.addEventListener("click", () => this.onTile(btn, tile.id));
            this.grid.appendChild(btn);
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

    onTile(btn, id) {

        if (this.locked) return;
        if (btn.classList.contains("correct")) return;

        if (!this.selectedTile) {
            this.selectedTile = { btn, id };
            btn.classList.add("selected");
            return;
        }

        const first = this.selectedTile;
        const second = { btn, id };

        first.btn.classList.remove("selected");
        this.selectedTile = null;

        if (first.id === second.id && first.btn !== second.btn) {

            first.btn.classList.add("correct");
            second.btn.classList.add("correct");

            this.checkWin();
        } else {

            this.locked = true;
            first.btn.classList.add("wrong");
            second.btn.classList.add("wrong");

            setTimeout(() => {
                first.btn.classList.remove("wrong");
                second.btn.classList.remove("wrong");
                this.locked = false;
            }, 900);
        }
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
        //await this.render();
    }

    shuffle(arr) {
        return arr.map(x => ({ x, r: Math.random() }))
                  .sort((a, b) => a.r - b.r)
                  .map(o => o.x);
    }
}