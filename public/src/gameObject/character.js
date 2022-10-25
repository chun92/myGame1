import layerManager from "../ui/layerManager";
import { AnimatedGameObject } from "./animatedGameObject";

const movingSpeed = 1;
export class Character extends AnimatedGameObject {
    constructor (name, characterType, animations, defaultAnimation, parent, scene, option) {
        super(name, animations, defaultAnimation, parent, scene, option);
        this.characterType = characterType;
        this.abilityMap = {};
    }

    async initialize() {
        await super.initialize();
        for (const asset in this.assetMap) {
            this.assetMap[asset].setLayerGroup(layerManager.characterGroup);
        }
    }

    move(targetTile, speed) {
        // XXX:
        /*
        if (speed) {
            this.speed = speed;
        }

        console.log(this.asset.position);
        this.destination = this.asset.toLocal(targetTile.asset.getGlobalPosition());
        this.asset.x += this.destination.x;
        this.asset.y += this.destination.y/2;
        console.log(this.asset.position);
        */
    }

    update(framesPassed) {

    }
}