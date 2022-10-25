import { CharacterAction } from "../enums/characterAction";
import layerManager from "../ui/layerManager";
import { AnimatedGameObject } from "./animatedGameObject";

const movingSpeed = 0.01;
export class Character extends AnimatedGameObject {
    constructor (name, characterType, animations, parent, scene, option) {
        super(name, animations, parent, scene, option);
        this.characterType = characterType;
        this.abilityMap = {};
        this.currentAction = CharacterAction.IDLE;
    }

    async initialize() {
        await super.initialize();
        for (const asset in this.assetMap) {
            this.assetMap[asset].setLayerGroup(layerManager.characterGroup);
        }
    }

    changeAnimation(target) {
        const targetAnimation = this.assetMap[target];
        if (!targetAnimation) {
            console.warn('There is no animation:', target);
            return;
        }

        this.currentAnimation.stop();
        this.currentAnimation.setVisible(false);
        this.currentAnimation = targetAnimation;
        targetAnimation.setVisible(true);
        targetAnimation.play();
    }

    move(targetTile, speed) {
        if (speed) {
            this.speed = speed;
        } else {
            this.speed = movingSpeed;
        }

        this.destination = this.asset.toLocal(targetTile.asset.getGlobalPosition());
        const distance = Math.sqrt(this.destination.x * this.destination.x + this.destination.y * this.destination.y);
        this.speedX = this.destination.x / distance;
        this.speedY = this.destination.y / distance;
        this.currentAction = CharacterAction.MOVE;
        this.changeAnimation('run');
    }

    update(framesPassed) {
        if (this.currentAction === CharacterAction.MOVE) {
            let x = this.asset.x + this.speedX * framesPassed;
            let y = this.asset.y + this.speedY * framesPassed;

            if (Math.abs(x) >= Math.abs(this.destination.x)) {
                x = this.destination.x;
                y = this.destination.y;
                this.currentAction = CharacterAction.IDLE;
                this.changeAnimation('idle');
            }

            this.asset.x = x;
            this.asset.y = y;
        }
    }
}