import { GameObject, GameObjectType } from "../gameObject/gameObject";
import { PositionBase, Vector2DFactory } from "../util";

export class UpperUI extends GameObject {
    constructor (scene) {
        super('upperUI', GameObjectType.CONTAINER, new Vector2DFactory.make(0, 0), PositionBase.NONE, 100, scene, scene);
        
    }

    async initialize() {
        await super.initialize();
        const energyResourcesUI = new EnergyResourcesUI(this, this.scene);
        await energyResourcesUI.initialize();
        this.addChild(energyResourcesUI);
    }
}

class EnergyResourcesUI extends GameObject {
    constructor (parent, scene) {
        super('energyResourcesUI', GameObjectType.CONTAINER, new Vector2DFactory.make(0, 0), PositionBase.NONE, 40, parent, scene);
    }
    
    async initialize() {
        await super.initialize();
        const energyResourceUI = new EnergyResourceUI(this, this.scene);
        await energyResourceUI.initialize();
        this.addChild(energyResourceUI);
    }
}

class EnergyResourceUI extends GameObject {
    constructor (parent, scene) {
        super('energyResourcesUI', GameObjectType.CONTAINER, new Vector2DFactory.make(0, 0), PositionBase.NONE, 40, parent, scene);
    }

    async initialize() {
        await super.initialize();
        const energyResourceImage = new EnergyResourceImage(this, this.scene);
        await energyResourceImage.initialize();
        this.addChild(energyResourceImage);

        const energyResourceText = new EnergyResourceText('x1', this, this.scene)
        await energyResourceText.initialize();
        this.addChild(energyResourceText);
    }
}

class EnergyResourceImage extends GameObject {
    constructor (parent, scene) {
        super('energy_resources_image', GameObjectType.SPRITE, new Vector2DFactory.make(0, 0), PositionBase.LEFT_TOP, 10, parent, scene);
    }
}

class EnergyResourceText extends GameObject {
    constructor (text, parent, scene) {
        super(text, GameObjectType.TEXT, new Vector2DFactory.make(10, 0), PositionBase.LEFT_TOP, 10, parent, scene);
    }
}