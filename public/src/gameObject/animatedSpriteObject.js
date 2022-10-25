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
}