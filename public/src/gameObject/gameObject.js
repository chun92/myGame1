import { Vector2DFactory, PositionBase } from "../util/util";
import { AssetMap } from "../../data/assetMap";
import { Assets } from "@pixi/assets";
import { AnimatedSprite, Container, Loader, Sprite, Text } from "pixi.js";
import coordinateCalculator from "../util/coordinateCalculator"

export const GameObjectType = Object.freeze({
    SPRITE: "sprite",
    ANIMATED_SPRITE: "aniamted_sprite",
    CONTAINER: "container",
    TEXT: 'text',
});

export class GameObject {
    static count = 0;
    constructor (name, objectType, parent, scene, option) {
        GameObject.count++;
        this.id = GameObject.count;
        this.name = name;
        this.objectType = objectType;
        this.positionPercent = option.positionPercent || Vector2DFactory.make(0, 0);
        this.positionBase = option.positionBase || PositionBase.NONE;
        this.sizePercent = option.sizePercent || 0;
        this.heightMax = option.heightMax;
        this.fixedPositionX = option.fixedPositionX;
        this.fixedPositionY = option.fixedPositionY;

        this.postion;
        this.size;

        this.parent = parent;
        this.scene = scene;
        this.children = [];
    }

    async initialize() {
        try {
            if (this.objectType === GameObjectType.CONTAINER) {
                this.createContainer();
            } else if (this.objectType === GameObjectType.SPRITE) {
                await this.loadAsset();
            } else if (this.objectType === GameObjectType.ANIMATED_SPRITE) {
                await this.loadAsset();
            } else if (this.objectType === GameObjectType.TEXT) {
                this.createText();
            }
            this.updateSize();
        } catch (error) {
            console.error(error);
        }
    }

    getSizeWithHeightMax(size) {
        const y = this.heightMax;
        if (!y) {
            return size;
        }

        if (size.y <= y) {
            return size;
        }

        const x = size.x / size.y * y;
        return Vector2DFactory.make(x, y);
    }

    updateSize() {
        if (this.objectType === GameObjectType.CONTAINER) {
            let size = coordinateCalculator.getSize(this.sizePercent, this.size);
            if (this.heightMax) {
                if (size.y > this.heightMax) {
                    size.y = this.heightMax;
                }
            }
            this.size = size;
        } else {
            this.setAnchor(this.positionBase);
            if (!this.parent || this.parent.objectType === GameObjectType.CONTAINER) {
                const size = coordinateCalculator.getSize(this.sizePercent, this.size);
                this.size = this.getSizeWithHeightMax(size);
                this.asset.width = size.x;
                this.asset.height = size.y;
            } else {
                this.asset.scale.x = this.sizePercent / 100;
                this.asset.scale.y = this.sizePercent / 100;
                const size = this.getSizeWithHeightMax(Vector2DFactory.makeFromContainer(this.asset));
                this.size = size;
                this.asset.width = size.x;
                this.asset.height = size.y;
            }
        }

        if (this.objectType === GameObjectType.CONTAINER) {
            const position = coordinateCalculator.getTargetPosition(this.positionPercent.x, this.positionPercent.y);
            this.position = position;
        } else {
            const position = coordinateCalculator.getTargetPosition(this.positionPercent.x, this.positionPercent.y, this.position);
            this.position = position;
        }

        if (this.fixedPositionX) {
            this.position.x = this.fixedPositionX;
        }

        if (this.fixedPositionY) {
            this.position.y = this.fixedPositionY;
        }

        this.asset.position.x = this.position.x;
        this.asset.position.y = this.position.y;
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

    createContainer() {
        this.asset = new Container();
        this.parent.asset.addChild(this.asset);
        this.size = coordinateCalculator.getSize(this.sizePercent);
    }

    createText() {
        this.asset = new Text(this.name);
        this.parent.asset.addChild(this.asset);
        this.size = Vector2DFactory.make(this.asset.width, this.asset.height);
    }

    setText(text) {
        if (this.asset && this.objectType == GameObjectType.TEXT) {
            this.asset.text = text;
            this.size = Vector2DFactory.make(this.asset.width, this.asset.height);
        }
    }
    
    async loadAsset() {
        const assetPath = AssetMap[this.name];
        if (!assetPath) {
            throw "asset " + this.name + " doesn't exist";
        }
        const asset = await Assets.load(assetPath);
        switch (this.objectType) {
            case GameObjectType.SPRITE:
                this.asset = Sprite.from(asset);
                break;
            case GameObjectType.ANIMATED_SPRITE:
                this.asset = new AnimatedSprite(asset.animations['animation']);
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