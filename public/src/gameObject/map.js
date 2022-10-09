import { GameObject, GameObjectType } from "./gameObject";
import { PositionBase, VectorHexagonFactory } from "../util";
import { Tile } from "./tile";

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
