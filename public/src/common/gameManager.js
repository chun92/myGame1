import * as PIXI from 'pixi.js';
import { Application, extensions, InteractionManager } from 'pixi.js'
import { EventSystem } from '@pixi/events'
import { Stage } from '@pixi/layers'
import layerManager from './layerManager';
import { Group } from 'tweedle.js';

class GameManager {
    static getInstance() {
        if (!this.instance) {
            this.instance = new GameManager();
        }

        return this.instance;
    }

    registerPixiInspector() {
        window.__PIXI_INSPECTOR_GLOBAL_HOOK__ &&  window.__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI: PIXI });
    }

    initialize() {
        extensions.remove(InteractionManager);

        this.width = window.screen.width;
        this.height = window.screen.height;

        this.app = new Application({
            view: document.getElementById("pixi-canvas"),
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            backgroundColor: 0xffffff,
            resizeTo: window
        });

        this.app.stage = new Stage();

        const { renderer } = this.app;
        renderer.addSystem(EventSystem, 'events');

        this.registerPixiInspector();

        window.addEventListener('resize', () => {
            this.width = window.screen.width;
            this.height = window.screen.height;

            this.app.resize();
            if (this.currentScene) {
                this.currentScene.resize(this.width, this.height);
            }
        }, true);

        layerManager.initialize(this.app.stage);
    }

    changeScene(newScene) {
        if (this.currentScene) {
            this.app.stage.removeChild(this.currentScene);
            this.currentScene.destroy();
        }

        this.currentScene = newScene;
        this.app.stage.addChild(this.currentScene.asset);

        if (this.updateCallback) {
            this.app.ticker.remove(this.updateCallback);
        }

        this.updateCallback = (framesPassed) => {
            Group.shared.update();
        };

        this.app.ticker.add(this.updateCallback);
    }
}

const gameManager = GameManager.getInstance();
export default gameManager;