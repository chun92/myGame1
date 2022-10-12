import { GameObject, GameObjectType } from "./gameObject";
import { PositionBase, Vector2DFactory, VectorHexagonFactory } from "../util";
import { Tile } from "./tile";

export class Map extends GameObject {
    constructor (sizePercent, scene) {
        super('map', GameObjectType.CONTAINER, new Vector2DFactory.make(50, 50), PositionBase.CENTER, sizePercent, scene, scene);
    }

    async initialize(tileRingSize) {
        super.initialize();
        const numOfTiles = tileRingSize * 2 - 1;
        const radius = 100.0 / numOfTiles;
        this.tileMap = {};

        await this.setTiles(tileRingSize, radius);
    }

    static getTileKey(x, y, z) {
        return x + ',' + y + ',' + z;
    }

    async setTiles(tileRingSize, radius) {
        for (let i = 0; i < tileRingSize; i++) {
            for (let j = -i; j <= i; j++) 
            for (let k = -i; k <= i; k++) 
            for (let l = -i; l <= i; l++) {
                if (Math.abs(j) + Math.abs(k) + Math.abs(l) == i * 2 && j + k + l == 0) {
                    const tile = new Tile(VectorHexagonFactory.make(j, k, l), PositionBase.CENTER, radius, this, this.scene);
                    await tile.initialize();
                    this.addChild(tile);

                    this.tileMap[Map.getTileKey(j, k, l)] = tile;
                }
            }
        }
        console.log(this.tileMap);
    }

    getTile(x, y, z) {
        return this.tileMap[Map.getTileKey(x, y, z)];
    }
}
