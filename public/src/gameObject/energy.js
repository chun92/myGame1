import layerManager from "../ui/layerManager";
import { GameObject, GameObjectType } from "./gameObject";
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