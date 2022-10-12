import { GameObject, GameObjectType } from "./gameObject";

export const EnergyType = Object.freeze({
    ENERGY_BLACK: 'energy_black',
    ENERGY_WHITE: 'energy_white',
    ENERGY_RED: 'energy_red',
    ENERGY_GREEN: 'energy_green',
    ENERGY_BLUE: 'energy_blue',
    ENERGY_ORANGE: 'energy_orange',
    ENERGY_YELLOW: 'energy_yellow',
});

export class Energy extends GameObject {
    constructor (energy_type, positionPercent, positionBase, sizePercent, parent, scene) {
        super(energy_type, GameObjectType.SPRITE, positionPercent, positionBase, sizePercent, parent, scene);
    }

    update(framesPassed) {
        this.asset.rotation -= 0.05 * framesPassed;
    }
}