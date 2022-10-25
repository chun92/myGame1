import { GameObject, GameObjectType } from "./gameObject";

const defaultAnimation = 'idle';
export class Character extends GameObject {
    constructor (name, characterType, animations, parent, scene, option) {
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
            const asset = new CharacterAnimation(assetName, this, this.scene, this.option);
            await asset.initialize();
            this.assetMap[animation] = asset;
        }

        this.assetMap[this.currentAnimation].play();
        this.animationSpeed = 0.5;
    }
}

class CharacterAnimation extends GameObject {
    constructor (name, parent, scene, option) {
        super(name, GameObjectType.ANIMATED_SPRITE, parent, scene, option);
    }

    play() {
        this.asset.play();
    }

    stop() {
        this.asset.stop();
    }
}