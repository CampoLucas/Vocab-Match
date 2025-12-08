
let languages = [];
let subtitleTexts = [];
let appData = null;
let fromSelected = null;
let toSelected = null;

const fromBox = document.getElementById("from-lang");
const toBox = document.getElementById("to-lang");
const dropdownFrom = document.getElementById("dropdown-from");
const dropdownTo = document.getElementById("dropdown-to");

const fromFlag = document.getElementById("from-flag");
const fromName = document.getElementById("from-name");

const toFlag = document.getElementById("to-flag");
const toName = document.getElementById("to-name");

const subtitle = document.getElementById("subtitle");

// Load JSON
fetch("/assets/data/app-data.json")
    .then(response => {
        if (!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        appData = data;
        languages = data.languages;
        renderDropdowns();
        startSubtitleRotation();
    })
    // .catch(error => {
    //     console.error('Listen! Error fetching or parsing JSON:', error);
    //     document.getElementById("json-output").textContent = "Failed to load JSON";
    // });

function renderDropdowns() {
    dropdownFrom.innerHTML = "";
    dropdownTo.innerHTML = "";

    if (languages === null) {
        dropdownFrom.innerHTML += `<p>languages is null</p>`;
        dropdownTo.innerHTML += `<p>languages is null</p>`;
    }
    else{
        languages.forEach(lang => {
            if (lang.id !== toSelected) {
                dropdownFrom.innerHTML += dropdownItem(lang, "from");
            }
            if (lang.id !== fromSelected) {
                dropdownTo.innerHTML += dropdownItem(lang, "to");
            }
        });

    }

    
}

function dropdownItem(lang, side) {
    return `
    <div class="dropdown-item" onclick="selectLanguage('${lang.id}','${side}')">
      <img class="icon flag" src="${lang.icon}" />
      <span class="lang-name">${lang.name}</span>
    </div>`;
}

function selectLanguage(id, side) {
    const lang = languages.find(l => l.id === id);

    if (side === "from") {
        fromSelected = id;
        fromFlag.src = lang.icon;
        fromFlag.alt = lang.iconAlt;
        fromFlag.classList.remove("disabled");
        fromName.textContent = lang.name;
    } else {
        toSelected = id;
        toFlag.src = lang.icon;
        toFlag.alt = lang.iconAlt;
        toFlag.classList.remove("disabled");
        toName.textContent = lang.name;
    }

    dropdownFrom.classList.add("disabled");
    dropdownTo.classList.add("disabled");
    renderDropdowns();
}

fromBox.addEventListener("click", () => toggle(dropdownFrom));
toBox.addEventListener("click", () => toggle(dropdownTo));

function toggle(drop) {
    dropdownFrom.classList.add("disabled");
    dropdownTo.classList.add("disabled");

    drop.classList.remove("disabled");

    // Remove previous drop-up state
    drop.classList.remove("drop-up");

    // Measure dropdown
    const rect = drop.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.top;
    const dropdownHeight = drop.scrollHeight;

    // If dropdown would overflow, open upward
    if (dropdownHeight > spaceBelow) {
        drop.classList.add("drop-up");
    }
}

// Close dropdowns when clicking outside
document.addEventListener("click", (event) => {
    const clickedInsideFrom = fromBox.contains(event.target) || dropdownFrom.contains(event.target);
    const clickedInsideTo   = toBox.contains(event.target)   || dropdownTo.contains(event.target);

    // If NOT clicking inside either language selector → close both
    if (!clickedInsideFrom && !clickedInsideTo) {
        dropdownFrom.classList.add("disabled");
        dropdownTo.classList.add("disabled");
    }
});

function startSubtitleRotation() {
    let list = appData["select-phrases"];
    let index = 0;

    setInterval(() => {
        index = (index + 1) % list.length;
        subtitle.textContent = list[index];
    }, 10000);
}