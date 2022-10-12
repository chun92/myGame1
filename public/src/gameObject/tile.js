import { GameObject, GameObjectType } from "./gameObject";

export class Tile extends GameObject {
    constructor (vectorHexagon, positionBase, sizePercent, parent, scene) {
        const margin = 1;
        const positionPercent = vectorHexagon.getVector2D().vectorScale(parent.size).scalarScale(sizePercent/2 + margin);
        super('tile', GameObjectType.SPRITE, positionPercent, positionBase, sizePercent, parent, scene);
    }

    setObject(obj) {
        this.object = obj;
        this.addChild(obj);
    }

    getObject() {
        return this.object;
    }
}