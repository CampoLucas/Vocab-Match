const categories = [ 
    "animals", "food-drinks", "clothing", "body-parts", "household", 
    "nature", "travel", "technology", "abstract", "verbs" 
];

let selectedTile = null;
let isBoardLocked = false;

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
    selectedTile = null;
    isBoardLocked = false;
    
    // get 4 random IDs
    const wordIds = await getRandomWords(pickRandom(categories), 0); // level1

    // fetch translations
    const tiles = await getTranslationsForWords(wordIds, fromLang, toLang);

    // mix 8 tiles
    const shuffledTiles = prepareTiles(tiles);

    // send to UI (you will populate popup here)
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

function showWinScreen() {
    // Basic version – you can replace with a custom overlay
    alert("Nice! You matched all pairs! 🎉");
    closeGamePopup();
}

function onTileClick(tile) {
    // Block clicks while animating wrong pair
    if (isBoardLocked) return;

    // Don't allow clicking already matched tiles
    if (tile.classList.contains("correct")) return;

    // Don’t allow re-clicking the same tile as second click
    if (tile === selectedTile) return;

    // First click
    if (!selectedTile) {
        selectedTile = tile;
        tile.classList.add("selected");
        return;
    }

    const first = selectedTile;
    const second = tile;

    //


    // Reset selection for next round
    selectedTile = null;
    first.classList.remove("selected");

    // match
    if (first.dataset.id === second.dataset.id &&
        first.dataset.lang !== second.dataset.lang) {

        first.classList.add("correct");
        second.classList.add("correct");

        // Check if all tiles are matched
        const totalTiles = document.querySelectorAll("#game-grid .game-tile").length;
        const matchedTiles = document.querySelectorAll("#game-grid .game-tile.correct").length;

        if (matchedTiles === totalTiles) {
            showWinScreen();
        }

    } else {
        // wrong
        isBoardLocked = true;
        first.classList.add("wrong");
        second.classList.add("wrong");

        setTimeout(() => {
            first.classList.remove("wrong");
            second.classList.remove("wrong");
            isBoardLocked = false;
        }, 1000); // 1 second
    }
}

// Get the words

async function getRandomWords(categoryId, levelIndex = 0) {
    const response = await fetch("./data/categories.json");
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
        fetch(`./data/lang/${lang1}.json`),
        fetch(`./data/lang/${lang2}.json`)
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

function pickRandom(arr) {
    if (!Array.isArray(arr) || arr.length === 0) {
        throw new Error("Array is empty or invalid");
    }
    const i = Math.floor(Math.random() * arr.length);
    return arr[i];
}