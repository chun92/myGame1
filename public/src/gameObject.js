import { Vector2DFactory, CoordinateCalculator } from "./util";
import { AssetMap } from "../data/assetMap";
import { Assets } from "@pixi/assets";
import { Container, Sprite } from "pixi.js";

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

        this.postion;
        this.size;

        this.parent = parent;
        this.children = [];
    }

    async initialize() {
        try {
            if (this.objectType === GameObjectType.CONTAINER) {
                this.setContainer();
                this.updateSize();
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
        const size = parentCoordinateCalculator.getSize(this.sizePercent, this.size);
        this.size = size;

        const position = parentCoordinateCalculator.getTargetPosition(this.positionBase, size, this.positionPercent.x, this.positionPercent.y);
        this.position = position;

        this.asset.position.x = position.x;
        this.asset.position.y = position.y;

        if (this.objectType !== GameObjectType.CONTAINER) {
            this.asset.width = size.x;
            this.asset.height = size.y;
        }

        if (this.coordinateCalculator) {
            this.coordinateCalculator.setSize(size.x, size.y);
        } else {
            this.coordinateCalculator = new CoordinateCalculator(size.x, size.y);
        }
    }

    setContainer() {
        this.asset = new Container();
        this.parent.asset.addChild(this.asset);

        const parentCoordinateCalculator = this.parent.coordinateCalculator;
        this.size = parentCoordinateCalculator.getSize(this.sizePercent, this.parent.size);
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
                break;
        }
        this.parent.asset.addChild(this.asset);
        this.size = Vector2DFactory.make(this.asset.width, this.asset.height);
    }

    resize() {
        this.updateSize();
        this.children.forEach((value, index, array) => {
            value.resize();
        });
    }

    addChild(gameObject) {
        this.children.push(gameObject);
    }
}