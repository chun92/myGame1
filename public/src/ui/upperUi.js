import { EnergyType } from "../gameObject/energy";
import { GameObject, GameObjectType } from "../gameObject/gameObject";
import { PositionBase, Vector2DFactory } from "../util";

export class UpperUI extends GameObject {
    constructor (scene) {
        super('upperUI', GameObjectType.CONTAINER, new Vector2DFactory.make(0, 0), PositionBase.NONE, 100, scene, scene);
        
    }

    setEnergyResourcesUI(energyCount) {
        this.energyResourcesUI.updateResourceEnergies(energyCount);
    }

    async initialize() {
        await super.initialize();
        const energyResourcesUI = new EnergyResourcesUI(this, this.scene);
        await energyResourcesUI.initialize();
        this.energyResourcesUI = energyResourcesUI;
        this.addChild(energyResourcesUI);
    }
}

class EnergyResourcesUI extends GameObject {
    constructor (parent, scene) {
        super('energyResourcesUI', GameObjectType.CONTAINER, new Vector2DFactory.make(1, 1), PositionBase.NONE, 40, parent, scene);
    }
    
    async initialize() {
        this.energyMap = {};
        this.count = 0;
        await super.initialize();
    }

    async updateResourceEnergies(energyCount) {
        for (const energyType in energyCount) {
            await this.setResourceEnergy(energyType, energyCount[energyType]);
        }
    }

    async setResourceEnergy(energyType, num) {
        const energyUI = this.energyMap[energyType];
        if (!energyUI) {
            const energyResourceUI = new EnergyResourceUI(energyType, num, this.count, this, this.scene);
            await energyResourceUI.initialize();
            this.addChild(energyResourceUI);
            this.energyMap[energyType] = energyResourceUI;
            this.count++;
        } else {
            energyUI.setNum(num);
        }
    }
}

class EnergyResourceUI extends GameObject {
    constructor (energyType, num, index, parent, scene) {
        const row = index % 4;
        const column = Math.floor(index / 4);
        super('energyResourcesUI', GameObjectType.CONTAINER, new Vector2DFactory.make(row * 10, column * 5), PositionBase.NONE, 40, parent, scene);
        this.energyType = energyType;
        this.num = num;
    }

    async initialize() {
        await super.initialize();
        const energyResourceImage = new EnergyResourceImage(this.energyType, this, this.scene);
        await energyResourceImage.initialize();
        this.addChild(energyResourceImage);
        this.energyResourceImage = energyResourceImage;

        const text = 'x' + this.num;
        const energyResourceText = new EnergyResourceText(text, this, this.scene)
        await energyResourceText.initialize();
        this.addChild(energyResourceText);
        this.energyResourceText = energyResourceText;
    }

    setNum(num) {
        this.num = num;
        const text = 'x' + num;
        this.energyResourceText.setText(text);
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