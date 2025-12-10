let selectedTile = null;
let isBoardLocked = false;

export async function startLegacyMatchGame(fromLang, toLang){
    selectedTile = null;
    isBoardLocked = false;

    const catId = pickRandom(["animals", "food-drinks", "clothing", "body-parts", "household", 
        "nature", "travel", "technology", "abstract", "verbs"]);

    const wordIds = await getRandomWords(catId, 0);

    const tiles = await getTranslationsForWords(wordIds, fromLang, toLang);

    const shuffledTiles = prepareTiles(tiles);

    renderGamePopup(shuffledTiles);
}

// Rendering and game logic


function renderGamePopup(tiles) {
    const grid = document.getElementById("game-grid");
    grid.innerHTML = "";

    tiles.forEach(tile => {
        const div = document.createElement("div");
        div.classList.add("game-tile");
        div.dataset.id = tile.id;
        div.dataset.lang = tile.lang;

        if (typeof tile.display === "string") {
            div.textContent = tile.display;
        } else {
            div.textContent = tile.display.kanji ?? tile.display.kana;
        }

        div.addEventListener("click", () => onTileClick(div));
        grid.appendChild(div);
    });
}

function onTileClick(tile) {
    if (isBoardLocked) return;
    if (tile.classList.contains("correct")) return;
    if (tile === selectedTile) return;

    if (!selectedTile) {
        selectedTile = tile;
        tile.classList.add("selected");
        return;
    }

    const first = selectedTile;
    const second = tile;
    selectedTile = null;
    first.classList.remove("selected");

    // match
    if (first.dataset.id === second.dataset.id &&
        first.dataset.lang !== second.dataset.lang) {

        first.classList.add("correct");
        second.classList.add("correct");

        const total = document.querySelectorAll("#game-grid .game-tile").length;
        const matched = document.querySelectorAll("#game-grid .game-tile.correct").length;
        if (matched === total) {
            alert("Nice! You matched all pairs!");
        }

    } else {
        isBoardLocked = true;
        first.classList.add("wrong");
        second.classList.add("wrong");

        setTimeout(() => {
            first.classList.remove("wrong");
            second.classList.remove("wrong");
            isBoardLocked = false;
        }, 1000);
    }
}

// Data helpers

async function getRandomWords(categoryId, levelIndex = 0) {
    const response = await fetch("./data/categories.json");
    const data = await response.json();

    const cat = data.categories.find(c => c.id === categoryId);
    const levelObj = cat.levels[levelIndex];
    const levelKey = Object.keys(levelObj)[0];
    const words = levelObj[levelKey];

    return shuffleArray(words).slice(0, 4);
}

async function getTranslationsForWords(wordIds, lang1, lang2) {
    const [res1, res2] = await Promise.all([
        fetch(`./data/lang/${lang1}.json`),
        fetch(`./data/lang/${lang2}.json`)
    ]);

    const dict1 = (await res1.json()).translations;
    const dict2 = (await res2.json()).translations;

    const lang1Words = wordIds.map(id => ({
        id,
        lang: lang1,
        display: dict1[id]
    }));

    const lang2Words = wordIds.map(id => ({
        id,
        lang: lang2,
        display: dict2[id]
    }));

    return [...lang1Words, ...lang2Words];
}

function shuffleArray(arr) {
    return arr
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(obj => obj.value);
}

function pickRandom(arr) {
    const i = Math.floor(Math.random() * arr.length);
    return arr[i];
}