import { EnergyType } from "../gameObject/energy";
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
        super('energyResourcesUI', GameObjectType.CONTAINER, new Vector2DFactory.make(1, 1), PositionBase.NONE, 40, parent, scene);
    }
    
    async initialize() {
        await super.initialize();
        const energyResourceUI = new EnergyResourceUI(EnergyType.ENERGY_BLACK, 1, 0, this, this.scene);
        await energyResourceUI.initialize();
        this.addChild(energyResourceUI);

        const energyResourceUI1 = new EnergyResourceUI(EnergyType.ENERGY_BLUE, 1, 1, this, this.scene);
        await energyResourceUI1.initialize();
        this.addChild(energyResourceUI1);
    }
}

class EnergyResourceUI extends GameObject {
    constructor (energyType, num, index, parent, scene) {
        const row = index % 4;
        const column = Math.floor(index / 4);
        super('energyResourcesUI', GameObjectType.CONTAINER, new Vector2DFactory.make(row * 10, column), PositionBase.NONE, 40, parent, scene);
        this.energyType = energyType;
        this.num = num;
    }

    async initialize() {
        await super.initialize();
        const energyResourceImage = new EnergyResourceImage(this.energyType, this, this.scene);
        await energyResourceImage.initialize();
        this.addChild(energyResourceImage);

        const str = 'x' + this.num;
        const energyResourceText = new EnergyResourceText(str, this, this.scene)
        await energyResourceText.initialize();
        this.addChild(energyResourceText);
    }
}

class EnergyResourceImage extends GameObject {
    constructor (energyType, parent, scene) {
        super(energyType, GameObjectType.SPRITE, new Vector2DFactory.make(0, 0), PositionBase.LEFT_TOP, 4, parent, scene);
    }
}

class EnergyResourceText extends GameObject {
    constructor (text, parent, scene) {
        super(text, GameObjectType.TEXT, new Vector2DFactory.make(5, 0), PositionBase.LEFT_TOP, 4, parent, scene);
    }
}