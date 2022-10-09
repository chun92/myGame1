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
    constructor (energy_type, positionPercent, positionBase, sizePercent, parent) {
        super(energy_type, GameObjectType.SPRITE, positionPercent, positionBase, sizePercent, parent);
    }
}

export class Tile extends GameObject {
    constructor (vectorHexagon, positionBase, sizePercent, parent) {
        const margin = 1;
        const positionPercent = vectorHexagon.getVector2D().vectorScale(parent.size).scalarScale(sizePercent/2 + margin);
        super('tile', GameObjectType.SPRITE, positionPercent, positionBase, sizePercent, parent);
    }
}