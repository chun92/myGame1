import { AnimatedSpriteObject } from "./animatedSpriteObject";
import { GameObject, GameObjectType } from "./gameObject";
export class AnimatedGameObject extends GameObject {
    constructor (name, animations, defaultAnimation, parent, scene, option) {
        super(name, GameObjectType.CONTAINER, parent, scene, option);
        this.name = name;
        this.animations = animations;
        this.option = option;
        this.assetMap = {};
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