import { GameObject, GameObjectType } from "./gameObject";

export class AnimatedSpriteObject extends GameObject {
    constructor (name, parent, scene, option) {
        super(name, GameObjectType.ANIMATED_SPRITE, parent, scene, option);
    }

    play() {
        this.asset.play();
    }

    stop() {
        this.asset.stop();
    }

    setSpeed(speed) {
        this.asset.animationSpeed = speed;
    }

    setVisible(visible) {
        this.asset.visible = visible;
    }

    flipX(isFlip) {
        const absScale = Math.abs(this.asset.scale.x);
        if (isFlip) {
            this.asset.scale.x = -1 * absScale;
        } else {
            this.asset.scale.x = absScale;
        }
    }

    flipY(isFlip) {
        const absScale = Math.abs(this.asset.scale.y);
        if (isFlip) {
            this.asset.scale.y = -1 * absScale;
        } else {
            this.asset.scale.y = absScale;
        }
    }
}