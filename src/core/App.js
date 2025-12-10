import { JSONLoader } from "./JSONLoader.js";
import { TemplateLoader } from "./TemplateLoader.js";
import { PopupManager } from "./PopUpManager.js";
import { GameModeManager } from "./GameModeManager.js";
import { SetupUIManager } from "../ui/SetupUIManager.js";

const appDataPath = "./data/app-data.json";
const catDataPath = "./data/categories.json";
const tempDataPath = "./data/templates.json";
const gameModesPath = "./data/game-modes.json";

// The main controller of the entire website.
// Initializes loaders, loads JSON files and prepares global data.
export class App {
    constructor() {
        this.json = new JSONLoader();
        this.templates = new TemplateLoader();
        this.popup = new PopupManager();
        this.modes = new GameModeManager();
        this.setupUI = new SetupUIManager(this);

        // data loaded asynchronously
        this.languages = [];
        this.categories = [];
        this.selectPhrases = [];
    }

    // entry point, loads the data needed at start up
    async init() {
        // load the app-data.json
        const appData = await this.json.load(appDataPath);
        this.languages = appData.languages;
        this.selectPhrases = appData.selectPhrases;

        // load the categories
        const catData = await this.json.load(catDataPath);
        this.categories = catData.categories;

        // load template registry
        const temRegistry = await this.json.load(tempDataPath);
        this.templates.loadRegistry(temRegistry);

        const modesJson = await this.json.load(gameModesPath);
        this.modes.loadModes(modesJson.modes);

        this.setupUI.refresh();

        console.log("App initialized")
        console.log(`Loaded game modes: ${this.modes.getAllModes()}`);
    }
}
