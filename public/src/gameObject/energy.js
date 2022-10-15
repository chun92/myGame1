import { GameObject, GameObjectType } from "./gameObject";

export class Energy extends GameObject {
    constructor (energy_type, positionPercent, positionBase, sizePercent, parent, scene) {
        super(energy_type, GameObjectType.SPRITE, positionPercent, positionBase, sizePercent, parent, scene);
    }

    update(framesPassed) {
        this.asset.rotation -= 0.05 * framesPassed;
    }
}