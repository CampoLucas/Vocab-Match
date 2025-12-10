import { App } from "./core/App.js";

const app = new App();
await app.init();

window.app = app;

// Get references
const fromBox = document.getElementById("from-lang");
const toBox = document.getElementById("to-lang");

const dropdownFrom = document.getElementById("dropdown-from");
const dropdownTo = document.getElementById("dropdown-to");

const fromFlag = document.getElementById("from-flag");
const fromName = document.getElementById("from-name");

const toFlag = document.getElementById("to-flag");
const toName = document.getElementById("to-name");

const subtitle = document.getElementById("subtitle");

// state

let fromSelected = null;
let toSelected = null;

// initial setup

renderDropdowns(); // Populate dropdowns using app.Languages
startSubtitleRotation(true); // Start rotating subtitle using app data

// Open popup when clicking start
document.querySelector(".start-button").addEventListener("click", () => {
    if (!fromSelected || !toSelected) {
        alert("Select both languages first!");
        return;
    }
    
    app.popup.open();
})

// dropdowns

function renderDropdowns() {
    const languages = app.languages;
    
    dropdownFrom.innerHTML = "";
    dropdownTo.innerHTML = "";

    if (languages === null) {
        dropdownFrom.innerHTML += `<p>languages is null</p>`;
        dropdownTo.innerHTML += `<p>languages is null</p>`;
    }
    else{
        languages.forEach(lang => {
            if (lang.id !== toSelected) {
                const item = createDropdownItem(lang, "from");
                dropdownFrom.appendChild(item);
            }
            if (lang.id !== fromSelected) {
                const item = createDropdownItem(lang, "to");
                dropdownTo.appendChild(item);
            }
        });

    }

    
}

function createDropdownItem(lang, side){
    const template = document.getElementById("dropdown-item");

    const div = template.content.firstElementChild.cloneNode(true);

    // fill image
    const img = div.querySelector("img.flag");
    img.src = lang.icon;
    img.alt = lang.iconAlt;

    // fill text
    const label = div.querySelector(".lang-name");
    label.textContent = lang.name;

    div.addEventListener("click", () => {
        selectLanguage(lang.id, side);
    });

    return div;
}

function selectLanguage(id, side) {
    const lang = app.languages.find(l => l.id === id);

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

fromBox.addEventListener("click", () => toggleDropdown(dropdownFrom));
toBox.addEventListener("click", () => toggleDropdown(dropdownTo));

function toggleDropdown(drop) {
    dropdownFrom.classList.add("disabled");
    dropdownTo.classList.add("disabled");

    drop.classList.remove("disabled");
    drop.classList.remove("drop-up"); // Remove previous drop-up state

    const rect = drop.getBoundingClientRect(); // Measure dropdown
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
    const clickedInsideTo   = toBox.contains(event.target) || dropdownTo.contains(event.target);

    // If NOT clicking inside either language selector → close both
    if (!clickedInsideFrom && !clickedInsideTo) {
        dropdownFrom.classList.add("disabled");
        dropdownTo.classList.add("disabled");
    }
});

function startSubtitleRotation(forceSet = false) {
    let list = app.selectPhrases;
    let index = 0;

    if (forceSet){
        subtitle.textContent = list[0];
    }

    setInterval(() => {
        index = (index + 1) % list.length;
        subtitle.textContent = list[index];
    }, 10000);
}