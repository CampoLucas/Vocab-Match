function openGamePopup() {
    document.getElementById("game-overlay").classList.remove("hidden");
}

function closeGamePopup() {
    document.getElementById("game-overlay").classList.add("hidden");
}

document.getElementById("game-close-btn").addEventListener("click", closeGamePopup);

// Start button
document.querySelector(".start-button").addEventListener("click", () => {
    if (!fromSelected || !toSelected) {
        alert("Select both languages first!");
        return;
    }

    startGame(fromSelected, toSelected);
    openGamePopup();
});

// Game logic

async function startGame(fromLang, toLang) {
    // Step 1 — get 4 random IDs
    const wordIds = await getRandomWords("animals", 0); // level1

    // Step 2 — fetch translations
    const tiles = await getTranslationsForWords(wordIds, fromLang, toLang);

    // Step 3 — mix 8 tiles
    const shuffledTiles = prepareTiles(tiles);

    // Step 4 — send to UI (you will populate popup here)
    renderGamePopup(shuffledTiles);
}

function renderGamePopup(tiles) {
    const grid = document.getElementById("game-grid");
    grid.innerHTML = "";

    tiles.forEach(tile => {
        const div = document.createElement("div");
        div.classList.add("game-tile");
        div.dataset.id = tile.id;
        div.dataset.lang = tile.lang;

        if (typeof tile.display === "string") {
            div.textContent = tile.display;  // EN/ES
        } else {
            div.textContent = tile.display.kanji ?? tile.display.kana; // JP
        }

        div.addEventListener("click", () => onTileClick(div));
        grid.appendChild(div);
    });
}

let selectedTile = null;

function onTileClick(tile) {
    if (!selectedTile) {
        selectedTile = tile;
        tile.classList.add("selected");
        return;
    }

    // second click
    if (selectedTile.dataset.id === tile.dataset.id &&
        selectedTile.dataset.lang !== tile.dataset.lang) {

        // MATCH!
        selectedTile.classList.add("correct");
        tile.classList.add("correct");
    } else {
        // FAIL
        selectedTile.classList.add("wrong");
        tile.classList.add("wrong");

        setTimeout(() => {
            selectedTile.classList.remove("wrong");
            tile.classList.remove("wrong");
        }, 800);
    }

    selectedTile.classList.remove("selected");
    selectedTile = null;
}

// Get the words

async function getRandomWords(categoryId, levelIndex = 0) {
    const response = await fetch("./assets/data/categories.json");
    const data = await response.json();

    const cat = data.categories.find(c => c.id === categoryId);
    if (!cat) throw new Error(`Category: ${categoryId} not found`);

    const levelObj = cat.levels[levelIndex];
    const levelKey = Object.keys(levelObj)[0];
    const words = levelObj[levelKey];

    // Shuffle and pick 4
    return shuffleArray(words).slice(0, 4);
}

async function getTranslationsForWords(wordIds, lang1, lang2){
    const [res1, res2] = await Promise.all([
        fetch(`./assets/data/lang/${lang1}.json`),
        fetch(`./assets/data/lang/${lang2}.json`)
    ]);

    const dict1 = (await res1.json()).translations;
    const dict2 = (await res2.json()).translations;

    const lang1Words = wordIds.map(id => ({
        id,
        lang: lang1,
        display: dict1[id] // For JP this will be object (kanji/kana/etc)
    }));

    const lang2Words = wordIds.map(id => ({
        id,
        lang: lang2,
        display: dict2[id]
    }));

    return [...lang1Words, ...lang2Words];
}

function prepareTiles(tiles) {
    // return shuffleArray(tiles).map((tile, index) => ({
    //     ...tile,
    //     tileId: index
    // }));

    return shuffleArray(tiles);
}

// Shuffle helper
function shuffleArray(arr) {
    return arr
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(obj => obj.value);
}