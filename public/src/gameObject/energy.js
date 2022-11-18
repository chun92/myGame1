import layerManager from "../common/layerManager";
import { GameObject } from "./gameObject";
import { GameObjectType } from "../enums/gameObjectType";
import { Tween } from "tweedle.js"

export class Energy extends GameObject {
    constructor (energyType, parent, scene, option) {
        super(energyType, GameObjectType.SPRITE, parent, scene, option);
        this.energyType = energyType;
    }

    async initialize() {
        await super.initialize();
        this.setLayerGroup(layerManager.resourceGroup);

        this.setAnimation();
    }

    setAnimation() {
        new Tween(this.asset).to({rotation: 2 * Math.PI}, 1000).repeat(Infinity).start();
    }
}