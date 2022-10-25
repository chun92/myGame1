import { Energy } from "./gameObject/energy";
import { Map } from "./gameObject/map"
import { UpperUI } from "./ui/upperUi";
import { PositionBase, Vector2DFactory } from "./util/util";

import { EnergyType } from "./enums/energyType";
import { AbilityType } from "./enums/abilityType";
import { Character } from "./gameObject/character";
import { CharacterType } from "./enums/characterType";

export class Stage {
    static totalCount = 0;
    constructor(scene) {
        this.totalCount++;
        this.id = this.totalCount;

        this.scene = scene;
        this.turn = 0;
        this.player = null;
        this.enemies = [];
        this.energy = {};
        this.abilities = {};
    }

    async test() {
        await this.initialize();
        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min)) + min; 
        }

        const tile = this.map.getTile(0, 0, 0);

        if (tile) {
            const character = new Character('player', CharacterType.CHARACTER_PLAYER, [
                { name: 'idle', speed: 0.5, isDefault: true },
                { name: 'run', speed: 0.5 }], tile, this.scene, {
                positionPercent: Vector2DFactory.make(0, 0),
                positionBase: PositionBase.CENTER,
                sizePercent: 40
            });
            await character.initialize();
            tile.setObject(character);
        }

        for (const pos in this.map.tileMap) {
            const tile = this.map.tileMap[pos];
            if (tile.getObject()) {
                continue;
            }
            let energyType = EnergyType.ENERGY_BLACK;
            switch (getRandomInt(0, 7)) {
                case 0:
                    energyType = EnergyType.ENERGY_BLACK;
                    break;
                case 1:
                    energyType = EnergyType.ENERGY_BLUE;
                    break;
                case 2:
                    energyType = EnergyType.ENERGY_GREEN;
                    break;
                case 3:
                    energyType = EnergyType.ENERGY_ORANGE;
                    break;
                case 4:
                    energyType = EnergyType.ENERGY_RED;
                    break;
                case 5:
                    energyType = EnergyType.ENERGY_WHITE;
                    break;
                case 6:
                    energyType = EnergyType.ENERGY_YELLOW;
                    break;
            }
            const energy = new Energy(energyType, tile, this.scene, {
                positionPercent: Vector2DFactory.make(0, 0), 
                positionBase: PositionBase.CENTER, 
                sizePercent: 30,
            });
            await energy.initialize();
            tile.setObject(energy);

            if (this.energy[energyType]) {
                this.energy[energyType]++;
            } else {
                this.energy[energyType] = 1;
            }
        }

        this.abilities[AbilityType.ABILITY_MOVE] = 3;
        this.abilities[AbilityType.ABILITY_ATTACK] = 1;
        this.abilities[AbilityType.ABILITY_DEFENSE] = 1;

        this.upperUi.setEnergyResourcesUI(this.energy);
        this.upperUi.setTurn(1);
        this.upperUi.setAbilityUI(this.abilities);

        const character = this.map.getTile(0, 0, 0).getObject();
        character.move(this.map.getTile(0, 1, -1));
    }

    async initialize() {
        // TODO: stage info will be saved as json or xml file format later
        const map = new Map(this.scene);
        await map.initialize(3);
        this.scene.addChild(map);
        this.map = map;

        const upperUi = new UpperUI(this.scene);
        await upperUi.initialize();
        this.scene.addChild(upperUi);
        this.upperUi = upperUi;
    }

    async addEnergyOnMap(x, y, z, energyType) {
        const tile = this.map.getTile(x, y, z);
        if (!tile) {
            console.warn("addEnergyOnMap failed, because there's no tile on map at " + Map.getTileKey(x, y, z));
            return;
        }

        if (tile.getObject()) {
            console.warn("addEnergyOnMap failed, because there's object on tile at  " + Map.getTileKey(x, y, z));
            return;
        }
        
        const energy = new Energy(energyType, tile, this.scene, {
            positionPercent: Vector2DFactory.make(0, 0), 
            positionBase: PositionBase.CENTER, 
            sizePercent: 10,
        });
        await energy.initialize();
        tile.setObject(energy);
    }

    nextTurn() {

    }

    moveCharacter() {

    }

    moveEnemies() {

    }
}
