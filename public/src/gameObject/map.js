import { GameObject } from "./gameObject";
import { Vector2DFactory } from "../util/vector2D";
import { VectorHexagonFactory } from "../util/vectorHexagon";
import { Tile } from "./tile";
import { GameObjectType } from "../enums/gameObjectType";
import gameManager from "../common/gameManager";

export class Map extends GameObject {
    constructor (stage, scene) {
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

        Object.entries({
            'tiledown': this.initStep.bind(this),
            'tileup': this.endStep.bind(this),
            'tileupoutside': this.cancelStep.bind(this),
            'tileenter': this.stepTo.bind(this),
            'tileleave': this.stepDone.bind(this),
        }).forEach(elem => {
            const key = elem[0];
            const value = elem[1];
            this.asset.addListener(key, (vectorHexagon) => value(vectorHexagon));
        });
    }

    initStep(vectorHexagon) {
        if (this.inEndStep) {
            return;
        }
        const stage = gameManager.currentScene.currentStage;
        const playerTile = stage.getPlayerTile();
        if (playerTile && playerTile.vectorHexagon.getLength(vectorHexagon) == 1) {
            this.tileMovePreview = [];
            this.currentTile = vectorHexagon;
            this.getTile(vectorHexagon).setActive(true);
            this.stepFinished = false;
            this.tileMovePreview.push(vectorHexagon);
        }
    }

    stepTo(vectorHexagon) {
        const stage = gameManager.currentScene.currentStage;
        if (this.inEndStep) {
            return;
        }
        const numOfTiles = this.tileMovePreview.length;
        if (numOfTiles > 0) {
            const lastTile = this.tileMovePreview[numOfTiles - 1];
            if (vectorHexagon.getLength(lastTile) > 1) {
                this.cancelStep(vectorHexagon);
                return;
            }

            const index = this.tileMovePreview.indexOf(vectorHexagon);
            if (index == -1) {
                if (numOfTiles >= stage.getNumberOfMoveAbility()) {
                    return;
                } 
                this.getTile(vectorHexagon).setActive(true);
                this.tileMovePreview.push(vectorHexagon);
            } else {
                const saved = this.tileMovePreview.slice(0, index + 1);
                const discarded = this.tileMovePreview.slice(index + 1);
                for (const tile in discarded) {
                    this.getTile(discarded[tile]).setActive(false);
                }
                this.tileMovePreview = saved;
            }
            this.currentTile = vectorHexagon;
        }
    }

    stepDone(vectorHexagon) {
        if (this.inEndStep) {
            return;
        }
        if (this.currentTile == vectorHexagon) {
            this.currentTile = null;
        }
    }

    cancelStep(vectorHexagon) {
        if (this.inEndStep) {
            return;
        }

        if (!this.stepFinished && !this.currentTile) {
            for (const index in this.tileMovePreview) {
                const destination = this.tileMovePreview[index];
                this.getTile(destination).setActive(false);
            }
            this.tileMovePreview = [];
            this.currentTile = null;
            this.stepFinished = true;
        }
    }

    async endStep(vectorHexagon) {
        if (this.inEndStep) {
            return;
        }
        const stage = gameManager.currentScene.currentStage;
        if (this.tileMovePreview.length > 0) {
            this.inEndStep = true;
            for (const index in this.tileMovePreview) {
                const destination = this.tileMovePreview[index];
                this.getTile(destination).setActive(false);
            }

            for (const index in this.tileMovePreview) {
                const destination = this.tileMovePreview[index];
                const tile = this.getTile(destination);
                const player = stage.getPlayer();
                const previousTile = stage.getPlayer().tile;
                await player.move(this.getTile(destination));
                
                tile.setObject(player);
                previousTile.clearObject();
            }

            stage.endTurn();
            
            this.tileMovePreview = [];
            this.currentTile = null;
            this.stepFinished = true;
            this.inEndStep = false;
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

                    this.tileMap[Map.getTileKey(j, k, l)] = tile;
                }
            }
        }
    }

    getTile(vectorHexagon) {
        return this.tileMap[Map.getTileKey(vectorHexagon.x, vectorHexagon.y, vectorHexagon.z)];
    }
}
