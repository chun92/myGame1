import { Application } from 'pixi.js'

class GameManager {
    constructor() {
        this.instance = null;
        this.app = null;
        this.width = null;
        this.height = null;
        this.currentScene = null;
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new GameManager();
        }

        return this.instance;
    }

    initialize() {
        this.width = window.screen.width;
        this.height = window.screen.height;

        this.app = new Application({
            view: document.getElementById("pixi-canvas"),
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            backgroundColor: 0xffffff,
            resizeTo: window
        });

        window.addEventListener('resize', () => {
            this.width = window.screen.width;
            this.height = window.screen.height;

            this.app.resize();
            if (this.currentScene) {
                this.currentScene.resize(this.width, this.height);
            }
        }, true);

        this.app.ticker.add(this.update);
    }

    changeScene(newScene) {
        if (this.currentScene) {
            this.app.stage.removeChild(this.currentScene);
            this.currentScene.destroy();
        }

        this.currentScene = newScene;
        this.app.stage.addChild(this.currentScene.asset);
    }

    update(framesPassed) {
        /*
        if (this.currentScene) {
            this.currentScene.update(framesPassed);
        }
        */
    }
}

const gameManager = GameManager.getInstance();
export default gameManager;