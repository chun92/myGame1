import * as PIXI from 'pixi.js';
import { Application, extensions, InteractionManager } from 'pixi.js'
import { EventSystem } from '@pixi/events'
import { Stage } from '@pixi/layers'
import { LayerManager } from './layerManager';
import { Group } from 'tweedle.js';

class GameManager {
    static getInstance() {
        if (!this.instance) {
            this.instance = new GameManager();
        }

        return this.instance;
    }

    getWidth() {
        return window.screen.width;
    }

    getHeight() {
        return window.screen.height;
    }

    initialize() {
        // remove pre-defined interaction system
        extensions.remove(InteractionManager);

        // create app
        this.app = new Application({
            view: document.getElementById("pixi-canvas"),
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            backgroundColor: 0xffffff,
            resizeTo: window
        });

        // initialize stage
        this.app.stage = new Stage();

        // set new event system
        const { renderer } = this.app;
        renderer.addSystem(EventSystem, 'events');

        // add debugger for inspect
        window.__PIXI_INSPECTOR_GLOBAL_HOOK__ &&  window.__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI: PIXI });

        // resize event listener
        window.addEventListener('resize', () => {
            this.app.resize();
            if (this.currentScene) {
                this.currentScene.resize(window.screen.width, window.screen.height);
            }
        }, true);

        // set 
        this.layerManager = new LayerManager().initialize(this.app.stage);
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