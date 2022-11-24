import { GameObject } from "./gameObject";
import { GameObjectType } from "../enums/gameObjectType";
import { PositionBase } from "../enums/positionBase"
import { Polygon } from "pixi.js";
import { LayerGroup } from "../enums/LayerGroup";
import gameManager from "../common/gameManager";
import { ColorTheme } from "../enums/colorTheme";

const tileMagin = 1;
export class Tile extends GameObject {
    constructor (parent, scene, vectorHexagon, sizePercent) {
        const positionPercent = vectorHexagon.getVector2D().vectorScale(parent.size).scalarScale(sizePercent/2 + tileMagin);
        super('tile', GameObjectType.SPRITE, parent, scene, {
            positionPercent: positionPercent,
            positionBase: PositionBase.CENTER,
            sizePercent: sizePercent
        });
        this.vectorHexagon = vectorHexagon;
        this.map = parent;
    }

    async initialize() {
        await super.initialize();

        gameManager.layerManager.setObject(this, LayerGroup.TILE);
        
        Object.entries({
            'pointerdown': 'tiledown',
            'pointerup': 'tileup',
            'pointerupoutside': 'tileupoutside',
            'pointerenter': 'tileenter',
            'pointerleave': 'tileleave'
        }).forEach(elem => {
            const key = elem[0];
            const value = elem[1];
            this.asset.on(key, () => this.parent.asset.emit(value, this.vectorHexagon));
        });

        this.setHitArea();
        this.asset.interactive = true;

    }

    setObject(obj) {
        if (this.object) {
            if (this.object.energyType) {
                const stage = gameManager.currentScene.currentStage;
                stage.addEnergy(this.object.energyType);
            }
            this.removeChild(this.object);
        }
        this.object = obj;
        this.addChild(this.object);
    }

    clearObject() {
        this.object = null;
    }

    removeObject() {
        if (this.object) {
            this.removeChild(this.object);
        }
        this.object = null;
    }

    getObject() {
        return this.object;
    }

    setHitArea() {
        const r = this.asset.width / this.asset.scale.x / 2 + tileMagin;
        const root3_div2 = Math.pow(3, 0.5) / 2;

        const polygon = new Polygon([
            -r, 0,
            -1 / 2 * r, root3_div2 * r,
            1 / 2 * r, root3_div2 * r,
            r, 0,
            1 / 2 * r, -root3_div2 * r,
            -1 / 2 * r, -root3_div2 * r,
        ]);
        this.asset.hitArea = polygon;
    }

    resize() {
        super.resize();
        this.setHitArea();
    }

    setActive(isActive) {
        if (isActive) {
            this.asset.tint = ColorTheme.TILE_ACTIVE;
        } else {
            this.asset.tint = ColorTheme.TILE_DEACTIVE;
        }
    }
}