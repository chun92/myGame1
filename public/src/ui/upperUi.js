import { GameObject, GameObjectType } from "../gameObject/gameObject";
import { PositionBase, StringUtils, Vector2DFactory } from "../util/util";

export class UpperUI extends GameObject {
    constructor (scene) {
        super('upperUI', GameObjectType.CONTAINER, scene, scene, { 
            positionPercent: new Vector2DFactory.make(0, 0),
            sizePercent: 100
        });
        
    }

    async initialize() {
        await super.initialize();
        const energyResourcesUI = new EnergyResourcesUI(this, this.scene);
        await energyResourcesUI.initialize();
        this.energyResourcesUI = energyResourcesUI;
        this.addChild(energyResourcesUI);

        const turnUI = new TurnUI(this, this.scene);
        await turnUI.initialize();
        this.turnUI = turnUI;
        this.addChild(turnUI);

        const abilitiesUI = new AbilitiesUI(this, this.scene);
        await abilitiesUI.initialize();
        this.abilitiesUI = abilitiesUI;
        this.addChild(abilitiesUI);
    }

    setEnergyResourcesUI(energyCount) {
        this.energyResourcesUI.updateResourceEnergies(energyCount);
    }

    setTurn(turn) {
        this.turnUI.setTurn(turn);
    }

    setAbilityUI(abilityCount) {
        this.abilitiesUI.updateAbilities(abilityCount);
    }
}

class EnergyResourcesUI extends GameObject {
    constructor (parent, scene) {
        super('energyResourcesUI', GameObjectType.CONTAINER, parent, scene, { 
            positionPercent: new Vector2DFactory.make(1, 1),
            sizePercent: 40
        });
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
        super('energyResourcesUI', GameObjectType.CONTAINER, parent, scene, { 
            positionPercent: new Vector2DFactory.make(row * 10, 0),
            sizePercent: 10
        });

        this.energyType = energyType;
        this.num = num;

        this.row = row;
        this.column = column;
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

    updateSize() {
        super.updateSize();
        const height = this.size.y;
        const margin = 10;
        this.asset.y = height * this.column + margin * this.column;
        this.position.y = this.asset.y;
    }
}

class EnergyResourceImage extends GameObject {
    constructor (energyType, parent, scene) {
        super(energyType, GameObjectType.SPRITE, parent, scene, { 
            positionPercent: new Vector2DFactory.make(0, 0),
            positionBase: PositionBase.LEFT_TOP,
            sizePercent: 4
        });
    }
}

class EnergyResourceText extends GameObject {
    constructor (text, parent, scene) {
        super(text, GameObjectType.TEXT, parent, scene, { 
            positionPercent: new Vector2DFactory.make(5, 0),
            positionBase: PositionBase.LEFT_TOP,
            sizePercent: 4
        });
    }
}

class TurnUI extends GameObject {
    constructor (parent, scene) {
        super('turnUI', GameObjectType.CONTAINER, parent, scene, {
            positionPercent: new Vector2DFactory.make(0, 1),
        });
    }

    async initialize() {
        this.turn = 0;
        await super.initialize();

        const turnText = new TurnText(this, this.scene);
        await turnText.initialize();
        this.addChild(turnText);

        const turnCount = new TurnCount(StringUtils.getNthNumber(0, 2), this, this.scene);
        await turnCount.initialize();
        this.addChild(turnCount);
        this.turnCount = turnCount;
    }

    setTurn(turn) {
        this.turn = turn;
        this.turnCount.setText(StringUtils.getNthNumber(turn, 2));
    }
}

class TurnText extends GameObject {
    constructor (parent, scene) {
        super('TURN', GameObjectType.TEXT, parent, scene, {
            positionPercent: new Vector2DFactory.make(42.5, 0), 
            positionBase: PositionBase.LEFT_TOP, 
            sizePercent: 15, 
        });
    }
}

class TurnCount extends GameObject {
    constructor (text, parent, scene) {
        super(text, GameObjectType.TEXT, parent, scene, {
            positionPercent: new Vector2DFactory.make(45, 6),
            positionBase: PositionBase.LEFT_TOP, 
            sizePercent: 10, 
        });
    }
}
class AbilitiesUI extends GameObject {
    constructor (parent, scene) {
        super('abilitiesUI', GameObjectType.CONTAINER, parent, scene, {
            positionPercent: new Vector2DFactory.make(59, 1), 
            sizePercent: 40,
        });
    }
    
    async initialize() {
        this.abilityMap = {};
        this.count = 0;
        await super.initialize();
    }

    async updateAbilities(abilityCount) {
        for (const abilityType in abilityCount) {
            await this.setAbilityUI(abilityType, abilityCount[abilityType]);
        }
    }

    async setAbilityUI(abilityType, num) {
        const abilityUI = this.abilityMap[abilityType];
        if (!abilityUI) {
            const abilityUI = new AbilityUI(abilityType, num, this.count, this, this.scene);
            await abilityUI.initialize();
            this.addChild(abilityUI);
            this.abilityMap[abilityType] = abilityUI;
            this.count++;
        } else {
            abilityUI.setNum(num);
        }
    }
}

class AbilityUI extends GameObject {
    constructor (abilityType, num, index, parent, scene) {
        const row = index % 4;
        const column = Math.floor(index / 4);
        super('abilityUI', GameObjectType.CONTAINER, parent, scene, {
            positionPercent: new Vector2DFactory.make(row * 10, 0), 
            sizePercent: 10, 
        });

        this.abilityType = abilityType;
        this.num = num;

        this.row = row;
        this.column = column;
    }

    async initialize() {
        await super.initialize();
        const abilityIconImage = new AbilityIconImage(this.abilityType, this, this.scene);
        await abilityIconImage.initialize();
        this.addChild(abilityIconImage);
        this.abilityIconImage = abilityIconImage;

        const text = StringUtils.getNthNumber(this.num, 2)
        const abilityNumberText = new AbilityNumberText(text, this, this.scene)
        await abilityNumberText.initialize();
        this.addChild(abilityNumberText);
        this.abilityNumberText = abilityNumberText;
    }

    setNum(num) {
        this.num = num;
        const text = StringUtils.getNthNumber(num, 2)
        this.abilityNumberText.setText(text);
    }

    updateSize() {
        super.updateSize();
        const height = this.size.y;
        const margin = 10;
        this.asset.y = height * this.column + margin * this.column;
        this.position.y = this.asset.y;
    }
}

class AbilityIconImage extends GameObject {
    constructor (abilityType, parent, scene) {
        super(abilityType, GameObjectType.SPRITE, parent, scene, {
            positionPercent: new Vector2DFactory.make(0, 0), 
            positionBase: PositionBase.LEFT_TOP, 
            sizePercent: 4, 
        });
    }
}

class AbilityNumberText extends GameObject {
    constructor (text, parent, scene) {
        super(text, GameObjectType.TEXT, parent, scene, {
            positionPercent: new Vector2DFactory.make(5, 0), 
            positionBase: PositionBase.LEFT_TOP, 
            sizePercent: 4, 
        });
    }
}