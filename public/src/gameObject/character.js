import { AnimatedGameObject } from "./animatedGameObject";
export class Character extends AnimatedGameObject {
    constructor (name, characterType, animations, defaultAnimation, parent, scene, option) {
        super(name, animations, defaultAnimation, parent, scene, option);
        this.characterType = characterType;
        this.abilityMap = {};
    }
}