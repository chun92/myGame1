import { GameObject, GameObjectType } from "./gameObject";
import { Vector2DFactory, VectorHexagonFactory } from "../util/util";
import { Tile } from "./tile";

export class Map extends GameObject {
    constructor (scene) {
        super('map', GameObjectType.CONTAINER, scene, scene, {
            positionPercent: new Vector2DFactory.make(50, 50),
            sizePercent: 100
        });
    }

    async initialize(tileRingSize) {
        await super.initialize();

        const numOfTiles = tileRingSize * 2 - 1;
        const radius = 100.0 / numOfTiles;
        this.tileMap = {};

        await this.setTiles(tileRingSize, radius);

        this.tileMovePreview = [];

        this.asset.addListener('tiledown', (vectorHexagon) => {
            this.initStep(vectorHexagon);
        });

        this.asset.addListener('tileup', (vectorHexagon) => {
            this.endStep(vectorHexagon);
        });

        this.asset.addListener('tileupoutside', (vectorHexagon) => {
            this.cancelStep(vectorHexagon);
        });

        this.asset.addListener('tileenter', (vectorHexagon) => {
            this.stepTo(vectorHexagon);
        });

        this.asset.addListener('tileleave', (vectorHexagon) => {
            this.stepDone(vectorHexagon);
        });
    }

    initStep(vectorHexagon) {
        this.tileMovePreview = [];
        this.currentTile = vectorHexagon;
        this.activeTile(vectorHexagon);
        this.stepFinished = false;
        this.tileMovePreview.push(vectorHexagon);
    }

    stepTo(vectorHexagon) {
        const numOfTiles = this.tileMovePreview.length;
        if (numOfTiles > 0) {
            const lastTile = this.tileMovePreview[numOfTiles - 1];
            if (vectorHexagon.getLength(lastTile) != 1) {
                this.cancelStep(vectorHexagon);
                return;
            }

            const index = this.tileMovePreview.indexOf(vectorHexagon);
            if (index == -1) {
                this.activeTile(vectorHexagon);
                this.tileMovePreview.push(vectorHexagon);
            } else {
                const saved = this.tileMovePreview.slice(0, index + 1);
                const discarded = this.tileMovePreview.slice(index + 1);
                for (const tile in discarded) {
                    this.deactivateTile(discarded[tile]);
                }
                this.tileMovePreview = saved;
            }
            this.currentTile = vectorHexagon;
        }
    }

    stepDone(vectorHexagon) {
        this.currentTile = null;
    }

    cancelStep(vectorHexagon) {
        if (!this.stepFinished && !this.currentTile) {
            for (const tile in this.tileMovePreview) {
                this.deactivateTile(this.tileMovePreview[tile]);
            }
            this.tileMovePreview = [];
            this.currentTile = null;
            this.stepFinished = true;
        }
    }

    endStep(vectorHexagon) {
        if (this.tileMovePreview.length > 0) {
            for (const tile in this.tileMovePreview) {
                this.deactivateTile(this.tileMovePreview[tile]);
            }
            this.tileMovePreview = [];
            this.currentTile = null;
            this.stepFinished = true;
        }
    }

    activeTile(vectorHexagon) {
        const tile = this.getTile(vectorHexagon.x, vectorHexagon.y, vectorHexagon.z);
        if (tile) {
            tile.asset.tint = 0x90EE90;
        }
    }

    deactivateTile(vectorHexagon) {
        const tile = this.getTile(vectorHexagon.x, vectorHexagon.y, vectorHexagon.z);
        if (tile) {
            tile.asset.tint = 0xFFFFFF;
        }
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
                    const tile = new Tile(this, this.scene, VectorHexagonFactory.make(j, k, l), radius);
                    await tile.initialize();
                    this.addChild(tile);

                    this.tileMap[Map.getTileKey(j, k, l)] = tile;
                }
            }
        }
    }

    getTile(x, y, z) {
        return this.tileMap[Map.getTileKey(x, y, z)];
    }
}
