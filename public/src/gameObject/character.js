import { CharacterAction } from "../enums/characterAction";
import { AnimatedGameObject } from "./animatedGameObject";
import { EventEmitter } from 'events';
import { waitFor } from "wait-for-event";
import { Tween } from "tweedle.js"
import gameManager from "../common/gameManager";
import { LayerGroup } from "../enums/LayerGroup";

const movingSpeed = 3;
export class Character extends AnimatedGameObject {
    constructor (name, characterType, animations, abilities, tile, parent, scene, option) {
        super(name, animations, parent, scene, option);
        this.characterType = characterType;
        this.abilities = abilities;
        this.currentAction = CharacterAction.IDLE;
        this.emitter = new EventEmitter();
        this.tile = tile;
        this.xDirection = 1; // right
    }

    async initialize() {
        await super.initialize();
        for (const asset in this.assetMap) {
            gameManager.layerManager.setObject(this.assetMap[asset], LayerGroup.CHARACTER);
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

    async move(targetTile, speed) {
        if (speed) {
            this.speed = speed;
        } else {
            this.speed = movingSpeed;
        }

        this.destination = this.asset.toLocal(targetTile.asset.getGlobalPosition());

        this.currentAction = CharacterAction.MOVE;
        this.changeAnimation('run');

        let direction = this.destination.x;
        if (Math.abs(this.destination.x) < 0.1) {
            direction = 0;
        }

        if (direction < 0) {
            this.currentAnimation.flipX(true);
            this.xDirection = -1;
        } else if (direction > 0) { 
            this.currentAnimation.flipX(false);
            this.xDirection = 1;
        }

        new Tween(this.asset).to({x: this.destination.x, y: this.destination.y}, 400).start().onComplete(() => {
            this.currentAction = CharacterAction.IDLE;
            this.changeAnimation('idle');
            if (this.xDirection < 0) {
                this.currentAnimation.flipX(true);
            } else if (this.xDirection > 0) {
                this.currentAnimation.flipX(false);
            }
            this.emitter.emit('moveDone');
        })

        await waitFor('moveDone', this.emitter);
        this.asset.x = 0;
        this.asset.y = 0;
        this.tile = targetTile;
    }
}