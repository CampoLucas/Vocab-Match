let languages = LANGUAGES;
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

renderDropdowns();

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
        fromFlag.style.opacity = 1;
        fromFlag.classList.remove("disabled");
        fromName.textContent = lang.name;
    } else {
        toSelected = id;
        toFlag.src = lang.icon;
        toFlag.alt = lang.iconAlt;
        toFlag.style.opacity = 1;
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

// Rotate subtitle language every 10s
const subtitleTexts = [
    "Select your language!!!",
    "Elige tu idioma!!!",
    "言語を選択してください!!!",
    "Scegli la tua lingua!!!"
];

let index = 0;

setInterval(() => {
    index = (index + 1) % subtitleTexts.length;
    subtitle.textContent = subtitleTexts[index];
}, 10000);

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