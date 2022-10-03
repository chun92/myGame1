import { Vector2DFactory, CoordinateCalculator } from "./util";
import { AssetMap } from "../data/assetMap";
import { Assets } from "@pixi/assets";
import { Sprite } from "pixi.js";

export const GameObjectType = Object.freeze({
    SPRITE: "sprite",
    CONTAINER: "container",
    TEXT: 'text',
});

export class GameObject {
    static count = 0;
    constructor (name, objectType, positionPercent, positionBase, sizePercent, parent) {
        this.count++;
        this.id = this.count;
        this.name = name;
        this.objectType = objectType;
        this.positionPercent = positionPercent;
        this.positionBase = positionBase;
        this.sizePercent = sizePercent;
        this.parent = parent;
        this.children = [];
    }

    async initialize() {
        try {
            if (this.objectType === GameObjectType.CONTAINER) {

            } else {
                await this.loadAsset();
                this.updateSize();
            }
        } catch (error) {
            console.error(error);
        }
    }

    updateSize() {
        const parentCoordinateCalculator = this.parent.coordinateCalculator;
        const size = parentCoordinateCalculator.getSize(this.sizePercent, Vector2DFactory.makeFromContainer(this.asset));
        this.asset.width = size.x;
        this.asset.height = size.y;
        const position = parentCoordinateCalculator.getTargetPosition(this.positionBase, this.asset, this.positionPercent.x, this.positionPercent.y);
        this.asset.position.x = position.x;
        this.asset.position.y = position.y;
        this.coordinateCalculator.setSize(position.x, position.y, this.asset.width, this.asset.height);
    }
    
    async loadAsset() {
        const assetPath = AssetMap[this.name];
        if (!assetPath) {
            throw new Exception("asset " + this.name + "doesn't exist");
        }
        const asset = await Assets.load(assetPath);
        switch (this.objectType) {
            case GameObjectType.SPRITE:
                this.asset = Sprite.from(asset);
        }
        this.parent.asset.addChild(this.asset);
        this.coordinateCalculator = new CoordinateCalculator(0, 0, this.asset.width, this.asset.height);
    }

    resize() {
        this.updateSize();
        this.children.forEach((value, index, array) => {
            value.resize();
        });
    }


}