import { GameObject, GameObjectType } from "./gameObject";

export class Character extends GameObject {
    constructor (name, characterType, parent, scene, option) {
        super(name, GameObjectType.SPRITE, parent, scene, option);
        this.characterType = characterType;
        this.assetMap = {};
        this.abilityMap = {};
    }
}