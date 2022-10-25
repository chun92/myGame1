import { PositionBase } from "../util/util";
import { AnimatedSpriteObject } from "./animatedSpriteObject";
import { GameObject, GameObjectType } from "./gameObject";
export class Character extends GameObject {
    constructor (name, characterType, animations, defaultAnimation, parent, scene, option) {
        super(name, GameObjectType.CONTAINER, parent, scene, option);
        this.name = name;
        this.characterType = characterType;
        this.animations = animations;
        this.option = option;
        this.assetMap = {};
        this.abilityMap = {};
        this.currentAnimation = defaultAnimation;
    }

    async initialize() {
        await super.initialize();
        await this.loadCharacterAsset();
    }

    async loadCharacterAsset() {
        for (const animation of this.animations) {
            const assetName = this.name + "_" + animation;
            const anim = new AnimatedSpriteObject(assetName, this, this.scene, this.option);
            await anim.initialize();
            this.addChild(anim);
            anim.setSpeed(0.5);
            this.assetMap[animation] = anim;
        }

        this.assetMap[this.currentAnimation].play();
    }
}