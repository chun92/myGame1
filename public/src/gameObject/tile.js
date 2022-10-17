import { GameObject, GameObjectType } from "./gameObject";
import { PositionBase } from "../util";

const tileMagin = 1;
export class Tile extends GameObject {
    constructor (parent, scene, vectorHexagon, sizePercent) {
        const positionPercent = vectorHexagon.getVector2D().vectorScale(parent.size).scalarScale(sizePercent/2 + tileMagin);
        super('tile', GameObjectType.SPRITE, parent, scene, {
            positionPercent: positionPercent,
            positionBase: PositionBase.CENTER,
            sizePercent: sizePercent
        });
    }

    setObject(obj) {
        this.object = obj;
        this.addChild(obj);
    }

    getObject() {
        return this.object;
    }
}