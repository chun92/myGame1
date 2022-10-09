import { GameObject, GameObjectType } from "./gameObject";
import { PositionBase, Vector2DFactory, VectorHexagonFactory } from "./util";

export class Map extends GameObject {
    constructor (positionPercent, positionBase, sizePercent, parent) {
        super('map', GameObjectType.CONTAINER, positionPercent, positionBase, sizePercent, parent);

        this.tiles = [];
    }

    async initialize(tileRingSize) {
        super.initialize();
        const numOfTiles = tileRingSize * 2 - 1;
        const radius = 100.0 / numOfTiles;
        await this.setTiles(tileRingSize, radius);
    }

    async setTiles(tileRingSize, radius) {
        for (let i = 0; i < tileRingSize; i++) {
            for (let j = -i; j <= i; j++) 
            for (let k = -i; k <= i; k++) 
            for (let l = -i; l <= i; l++) {
                if (Math.abs(j) + Math.abs(k) + Math.abs(l) == i * 2 && j + k + l == 0) {
                    const tile = new Tile(VectorHexagonFactory.make(j, k, l), PositionBase.CENTER, radius, this);
                    await tile.initialize();
                    this.tiles.push(tile);
                    this.addChild(tile);
                }
            }
        }
    }
}


export class Tile extends GameObject {
    constructor (vectorHexagon, positionBase, sizePercent, parent) {
        const margin = 1;
        const positionPercent = vectorHexagon.getVector2D().vectorScale(parent.size).scalarScale(sizePercent/2 + margin);
        super('tile', GameObjectType.SPRITE, positionPercent, positionBase, sizePercent, parent);
    }
}