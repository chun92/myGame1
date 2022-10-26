import { AnimatedSpriteObject } from "./animatedSpriteObject";
import { GameObject, GameObjectType } from "./gameObject";
export class AnimatedGameObject extends GameObject {
    constructor (name, animations, parent, scene, option) {
        super(name, GameObjectType.CONTAINER, parent, scene, option);
        this.name = name;
        this.animations = animations;
        this.option = option;
        this.assetMap = {};
    }

    async initialize() {
        await super.initialize();
        await this.loadCharacterAsset();
    }

    async loadCharacterAsset() {
        for (const animationInfo of this.animations) {
            const animationName = animationInfo.name;
            const assetName = this.name + "_" + animationName;
            const anim = new AnimatedSpriteObject(assetName, this, this.scene, this.option);
            await anim.initialize();

            const speed = animationInfo.speed;
            if (speed) {
                anim.setSpeed(0.5);
            }

            const isDefault = animationInfo.isDefault;
            if (isDefault) {
                this.currentAnimation = anim;
                anim.setVisible(true);
                this.currentAnimation.play();
            } else {
                anim.setVisible(false);
            }

            this.assetMap[animationName] = anim;
        }
    }
}