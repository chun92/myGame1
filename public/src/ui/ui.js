import { GameObject } from "../gameObject/gameObject";
import layerManager from "./layerManager";

export class UI extends GameObject {
    constructor (name, objectType, parent, scene, option) {
        super(name, objectType, parent, scene, option)
    }

    async initialize() {
        await super.initialize();
        this.setLayerGroup(layerManager.uiGroup);
    }
}