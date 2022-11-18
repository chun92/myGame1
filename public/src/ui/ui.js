import { GameObject } from "../gameObject/gameObject";
import gameManager from "../common/gameManager";
import { LayerGroup } from "../enums/LayerGroup";

export class UI extends GameObject {
    constructor (name, objectType, parent, scene, option) {
        super(name, objectType, parent, scene, option)
    }

    async initialize() {
        await super.initialize();
        gameManager.layerManager.setObject(this, LayerGroup.UI);
    }
}