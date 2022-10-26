import layerManager from "../ui/layerManager";
import { GameObject, GameObjectType } from "./gameObject";
import { Tween } from "tweedle.js"

export class Energy extends GameObject {
    constructor (energy_type, parent, scene, option) {
        super(energy_type, GameObjectType.SPRITE, parent, scene, option);
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