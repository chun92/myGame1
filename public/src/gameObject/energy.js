import { GameObject, GameObjectType } from "./gameObject";

export class Energy extends GameObject {
    constructor (energy_type, parent, scene, option) {
        super(energy_type, GameObjectType.SPRITE, parent, scene, option);
    }

    update(framesPassed) {
        this.asset.rotation -= 0.05 * framesPassed;
    }
}