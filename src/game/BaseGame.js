export class BaseGame {
    constructor(app, settings, container) {
        this.app = app;
        this.settings = settings;

        this.container = container;
    }

    async load() {
        throw new Error("GameMode must implement load()");
    }

    render() {
        throw new Error("GameMode must implement render()");
    }

    start() {
        throw new Error("GameMode must implement start()");
    }

    finish() {
        if (this.settings.onFinish) {
            this.settings.onFinish();
        }
    }
}