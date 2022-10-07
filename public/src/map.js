import { GameObject, GameObjectType } from "./gameObject";
import { PositionBase, Vector2D } from "./util";

export class Map extends GameObject {
    constructor (positionPercent, positionBase, sizePercent, parent) {
        super('map', GameObjectType.CONTAINER, positionPercent, positionBase, sizePercent, parent);

        this.tiles = [];
    }

    async initialize() {
        super.initialize();
        await this.setTiles(1);
    }

    async setTiles(radius) {
        for (let i = 0; i < radius; i++) {
            for (let j = -i; j <= i; j++) 
            for (let k = -i; k <= i; k++) 
            for (let l = -i; l <= i; l++) {
                if (Math.abs(j) + Math.abs(k) + Math.abs(l) == i*2 && j + k + l == 0) {
                    console.log(j + ", " + k + ", " + l);
                    const tile = new Tile(new Vector2D(0, 0), PositionBase.CENTER, 20, this);
                    await tile.initialize();
                    this.tiles.push(tile);
                    this.addChild(tile);
                }
            }
            console.log("");
        }
    }
}


export class Tile extends GameObject {
    constructor (positionPercent, positionBase, sizePercent, parent) {
        super('tile', GameObjectType.SPRITE, positionPercent, positionBase, sizePercent, parent);
    }
}