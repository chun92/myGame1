import { GameObject, GameObjectType } from "./gameObject";

const tileMagin = 1;
export class Tile extends GameObject {
    constructor (vectorHexagon, positionBase, sizePercent, parent, scene) {
        const positionPercent = vectorHexagon.getVector2D().vectorScale(parent.size).scalarScale(sizePercent/2 + tileMagin);
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