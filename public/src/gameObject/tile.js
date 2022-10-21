import { GameObject, GameObjectType } from "./gameObject";
import { PositionBase } from "../util/util";
import { Polygon } from "pixi.js";

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
    }

    async initialize() {
        await super.initialize();

        // this.asset.hitArea = new Circle(0, 0, 10);
        this.asset.on('pointerdown', () => {
            this.parent.asset.emit('tiledown', this.vectorHexagon);
        });

        this.asset.on('pointerup', () => {
            this.parent.asset.emit('tileup', this.vectorHexagon);
        });

        this.asset.on('pointerupoutside', () => {
            this.parent.asset.emit('tileupoutside', this.vectorHexagon);
        });

        this.asset.on('pointerenter', () => {
            this.parent.asset.emit('tileenter', this.vectorHexagon);
        });

        this.asset.on('pointerleave', () => {
            this.parent.asset.emit('tileleave', this.vectorHexagon);
        });

        this.asset.interactive = true;

        const r = this.asset.width / this.asset.scale.x / 2;
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

    setObject(obj) {
        this.object = obj;
        this.addChild(obj);
    }

    getObject() {
        return this.object;
    }

    resize() {
        super.resize();
        const r = this.asset.width / this.asset.scale.x / 2;
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
}