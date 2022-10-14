import { Vector2DFactory, PositionBase } from "../util";
import { AssetMap } from "../../data/assetMap";
import { Assets } from "@pixi/assets";
import { Container, Sprite, Text } from "pixi.js";

export const GameObjectType = Object.freeze({
    SPRITE: "sprite",
    CONTAINER: "container",
    TEXT: 'text',
});

export class GameObject {
    static count = 0;
    constructor (name, objectType, positionPercent, positionBase, sizePercent, parent, scene) {
        GameObject.count++;
        this.id = GameObject.count;
        this.name = name;
        this.objectType = objectType;
        this.positionPercent = positionPercent;
        this.positionBase = positionBase;
        this.sizePercent = sizePercent;

        this.postion;
        this.size;

        this.parent = parent;
        this.scene = scene;
        this.children = [];
    }

    async initialize() {
        try {
            if (this.objectType === GameObjectType.CONTAINER) {
                this.setContainer();
                this.updateSize();
            } else if (this.objectType === GameObjectType.SPRITE) {
                await this.loadAsset();
                this.updateSize();
            } else if (this.objectType === GameObjectType.TEXT) {
                this.setText();
                this.updateSize();
            }
        } catch (error) {
            console.error(error);
        }
    }

    updateSize() {
        const coordinateCalculator = this.scene.coordinateCalculator;
        if (this.objectType === GameObjectType.CONTAINER) {
            const size = coordinateCalculator.getSize(this.sizePercent, this.size);
            this.size = size;
        } else {
            this.setAnchor(this.positionBase);
            if (!this.parent || this.parent.objectType === GameObjectType.CONTAINER) {
                const size = coordinateCalculator.getSize(this.sizePercent, this.size);
                this.size = size;
                this.asset.width = size.x;
                this.asset.height = size.y;
            } else {
                this.asset.scale.x = this.sizePercent/100;
                this.asset.scale.y = this.sizePercent/100;
                this.size = Vector2DFactory.makeFromContainer(this.asset);
            }
        }

        if (this.objectType === GameObjectType.CONTAINER) {
            const position = coordinateCalculator.getTargetPosition(this.positionPercent.x, this.positionPercent.y);
            this.position = position;
            this.asset.position.x = position.x;
            this.asset.position.y = position.y;
        } else {
            const position = coordinateCalculator.getTargetPosition(this.positionPercent.x, this.positionPercent.y, this.position);
            this.position = position;
            this.asset.position.x = position.x;
            this.asset.position.y = position.y;
        }
    }

    setAnchor(positionBase) {
        switch (positionBase) {
            case PositionBase.LEFT_TOP:
                this.asset.anchor.set(0, 0);
                break;
            case PositionBase.RIGHT_TOP:
                this.asset.anchor.set(1, 0);
                break;
            case PositionBase.LEFT_BOTTOM:
                this.asset.anchor.set(0, 1);
                break;
            case PositionBase.RIGHT_BOTTOM:
                this.asset.anchor.set(1, 1);
                break;
            case PositionBase.LEFT_MID:
                this.asset.anchor.set(0, 0.5);
                break;
            case PositionBase.RIGHT_MID:
                this.asset.anchor.set(1, 0.5);
                break;
            case PositionBase.TOP_MID:
                this.asset.anchor.set(0.5, 0);
                break;
            case PositionBase.BOTTOM_MID:
                this.asset.anchor.set(0.5, 1);
                break;
            case PositionBase.CENTER:
                this.asset.anchor.set(0.5, 0.5);
                break;
        }
    }

    setContainer() {
        this.asset = new Container();
        this.parent.asset.addChild(this.asset);
        this.size = this.scene.coordinateCalculator.getSize(this.sizePercent);
    }

    setText() {
        this.asset = new Text(this.name);
        this.parent.asset.addChild(this.asset);
        this.size = Vector2DFactory.make(this.asset.width, this.asset.height);
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
        this.children.forEach((child) => {
            child.resize();
        });
    }

    addChild(gameObject) {
        this.children.push(gameObject);
    }

    update(framesPassed) {
        this.children.forEach((child) => {
            child.update(framesPassed);
        });
    }
}