import { GameObjectType } from "../enums/gameObjectType";
import { Vector2DFactory } from "../util/vector2D";
import { StringUtils } from "../util/util";
import { PositionBase } from "../enums/positionBase"
import { UI } from "./ui";

export class UpperUI extends UI {
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

        const turnUI = new TurnUI(this, this.scene);
        await turnUI.initialize();
        this.turnUI = turnUI;

        const abilitiesUI = new AbilitiesUI(this, this.scene);
        await abilitiesUI.initialize();
        this.abilitiesUI = abilitiesUI;
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

class EnergyResourcesUI extends UI {
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
            this.energyMap[energyType] = energyResourceUI;
            this.count++;
        } else {
            energyUI.setNum(num);
        }
    }
}

class EnergyResourceUI extends UI {
    constructor (energyType, num, index, parent, scene) {
        const row = index % 4;
        const column = Math.floor(index / 4);
        const heightMax = scene.coordinateCalculator.getSize(4).x;
        const margin = 10;
        const fixedPositionY = column * (heightMax + margin);
        super('energyResourcesUI', GameObjectType.CONTAINER, parent, scene, { 
            positionPercent: new Vector2DFactory.make(row * 10, 0),
            sizePercent: 10,
            heightMax: heightMax,
            fixedPositionY: fixedPositionY,
        });

        this.energyType = energyType;
        this.num = num;

        this.row = row;
        this.column = column;
    }

    async initialize() {
        await super.initialize();
        const energyResourceImage = new EnergyResourceImage(this.energyType, this.heightMax, this, this.scene);
        await energyResourceImage.initialize();
        this.energyResourceImage = energyResourceImage;

        const text = 'x' + this.num;
        const energyResourceText = new EnergyResourceText(text, this.heightMax, this, this.scene)
        await energyResourceText.initialize();
        this.energyResourceText = energyResourceText;
    }

    setNum(num) {
        this.num = num;
        const text = 'x' + num;
        this.energyResourceText.setText(text);
    }

    resize() {
        this.heightMax = this.scene.coordinateCalculator.getSize(4).x;
        const margin = 10;
        this.fixedPositionY = this.column * (this.heightMax + margin);
        super.resize();
    }
}

class EnergyResourceImage extends UI {
    constructor (energyType, heightMax, parent, scene) {
        super(energyType, GameObjectType.SPRITE, parent, scene, { 
            positionPercent: new Vector2DFactory.make(0, 0),
            positionBase: PositionBase.LEFT_TOP,
            sizePercent: 4,
            heightMax: heightMax,
        });
    }
}

class EnergyResourceText extends UI {
    constructor (text, heightMax, parent, scene) {
        super(text, GameObjectType.TEXT, parent, scene, { 
            positionPercent: new Vector2DFactory.make(5, 0),
            positionBase: PositionBase.LEFT_TOP,
            sizePercent: 4,
            heightMax: heightMax,
        });
    }
}

class TurnUI extends UI {
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
        this.turnText = turnText;

        const pos = turnText.size.y;

        const turnCount = new TurnCount(StringUtils.getNthNumber(0, 2), pos, this, this.scene);
        await turnCount.initialize();
        this.turnCount = turnCount;
    }

    setTurn(turn) {
        this.turn = turn;
        this.turnCount.setText(StringUtils.getNthNumber(turn, 2));
    }

    resize() {
        const pos = this.scene.coordinateCalculator.getSize(this.turnText.size).y;
        this.turnCount.fixedPositionY = pos;
        super.resize();
    }
}

class TurnText extends UI {
    constructor (parent, scene) {
        super('TURN', GameObjectType.TEXT, parent, scene, {
            positionPercent: new Vector2DFactory.make(42.5, 0), 
            positionBase: PositionBase.LEFT_TOP, 
            sizePercent: 15, 
        });
    }
}

class TurnCount extends UI {
    constructor (text, fixedPositionY, parent, scene) {
        super(text, GameObjectType.TEXT, parent, scene, {
            positionPercent: new Vector2DFactory.make(45, 0),
            positionBase: PositionBase.LEFT_TOP, 
            sizePercent: 10, 
            fixedPositionY: fixedPositionY,
        });
    }
}
class AbilitiesUI extends UI {
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
            this.abilityMap[abilityType] = abilityUI;
            this.count++;
        } else {
            abilityUI.setNum(num);
        }
    }
}

class AbilityUI extends UI {
    constructor (abilityType, num, index, parent, scene) {
        const row = index % 4;
        const column = Math.floor(index / 4);
        const heightMax = scene.coordinateCalculator.getSize(4).x;
        const margin = 10;
        const fixedPositionY = column * (heightMax + margin);
        super('abilityUI', GameObjectType.CONTAINER, parent, scene, {
            positionPercent: new Vector2DFactory.make(row * 10, 0), 
            sizePercent: 10, 
            heightMax: heightMax,
            fixedPositionY: fixedPositionY
        });

        this.abilityType = abilityType;
        this.num = num;

        this.row = row;
        this.column = column;
        this.heightMax = heightMax;
    }

    async initialize() {
        await super.initialize();
        const abilityIconImage = new AbilityIconImage(this.abilityType, this.heightMax, this, this.scene);
        await abilityIconImage.initialize();
        this.abilityIconImage = abilityIconImage;

        const text = StringUtils.getNthNumber(this.num, 2)
        const abilityNumberText = new AbilityNumberText(text, this.heightMax, this, this.scene)
        await abilityNumberText.initialize();
        this.abilityNumberText = abilityNumberText;
    }

    setNum(num) {
        this.num = num;
        const text = StringUtils.getNthNumber(num, 2)
        this.abilityNumberText.setText(text);
    }

    resize() {
        this.heightMax = this.scene.coordinateCalculator.getSize(4).x;
        const margin = 10;
        this.fixedPositionY = this.column * (this.heightMax + margin);
        super.resize();
    }
}

class AbilityIconImage extends UI {
    constructor (abilityType, heightMax, parent, scene) {
        super(abilityType, GameObjectType.SPRITE, parent, scene, {
            positionPercent: new Vector2DFactory.make(0, 0), 
            positionBase: PositionBase.LEFT_TOP, 
            sizePercent: 4,
            heightMax: heightMax,
        });
    }
}

class AbilityNumberText extends UI {
    constructor (text, heightMax, parent, scene) {
        super(text, GameObjectType.TEXT, parent, scene, {
            positionPercent: new Vector2DFactory.make(5, 0), 
            positionBase: PositionBase.LEFT_TOP, 
            sizePercent: 4, 
            heightMax: heightMax,
        });
    }
}