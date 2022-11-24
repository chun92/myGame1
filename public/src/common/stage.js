import { Energy } from "../gameObject/energy";
import { Map } from "../gameObject/map"
import { UpperUI } from "../ui/upperUi";
import { Vector2DFactory } from "../util/vector2D";
import { VectorHexagonFactory } from "../util/vectorHexagon";
import { PositionBase } from "../enums/positionBase"

import { EnergyType } from "../enums/energyType";
import { AbilityType } from "../enums/abilityType";
import { Character } from "../gameObject/character";
import { CharacterType } from "../enums/characterType";

export class Stage {
    static totalCount = 0;
    constructor(scene) {
        this.totalCount++;
        this.id = this.totalCount;

        this.scene = scene;
        this.turn = 1;
        this.player = null;
        this.enemies = [];
        this.energy = {};
        this.abilities = {};
    }

    async test() {
        await this.initialize();
        
        this.energyTypes = [EnergyType.ENERGY_BLACK, EnergyType.ENERGY_WHITE, EnergyType.ENERGY_RED];
        this.respawnRate = 0.35;
        this.startPosition = VectorHexagonFactory.make(-2, 1, 1);

        for (const energyType of this.energyTypes) {
            this.energy[energyType] = 0;
        }

        await this.setCharacterPosition(this.startPosition);
        await this.generateEnergiesOnMap(this.energyTypes, this.respawnRate);
        await this.updateUI();
    }

    async initialize() {
        // TODO: stage info will be saved as json or xml file format later
        const map = new Map(this, this.scene);
        await map.initialize(3);
        this.map = map;

        const upperUi = new UpperUI(this.scene);
        await upperUi.initialize();
        this.upperUi = upperUi;
    }

    async updateUI() {
        this.upperUi.setEnergyResourcesUI(this.energy);
        this.upperUi.setTurn(this.turn);
        this.upperUi.setAbilityUI(this.abilities);
    }

    async setCharacterPosition(vectorHexagon) {
        const tile = this.map.getTile(vectorHexagon);
        if (!tile) {
            throw "setCharacterPosition failed, " + vectorHexagon;
        }

        const abilities = {};
        abilities[AbilityType.ABILITY_MOVE] = 3;
        abilities[AbilityType.ABILITY_ATTACK] = 1;
        abilities[AbilityType.ABILITY_DEFENSE] = 1;
        const character = new Character('player', CharacterType.CHARACTER_PLAYER, [
            { name: 'idle', speed: 0.5, isDefault: true },
            { name: 'run', speed: 0.5 }], abilities, tile, tile, this.scene, {
            positionPercent: Vector2DFactory.make(0, 0),
            positionBase: PositionBase.CENTER,
            sizePercent: 40
        });
        await character.initialize();
        tile.setObject(character);
        this.player = character;
        this.abilities = abilities;
    }

    async generateEnergiesOnMap(energyTypes, respawnRate) {
        const numOfTypes = energyTypes.length;

        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min)) + min; 
        }

        for (const pos in this.map.tileMap) {
            const tile = this.map.tileMap[pos];
            if (tile.getObject()) {
                continue;
            }

            if (Math.random() > respawnRate) {
                continue;
            }

            const energyType = energyTypes[getRandomInt(0, numOfTypes)];
            const energy = new Energy(energyType, tile, this.scene, {
                positionPercent: Vector2DFactory.make(0, 0), 
                positionBase: PositionBase.CENTER, 
                sizePercent: 30,
            });
            await energy.initialize();
            tile.setObject(energy);
        }
    }

    async addEnergyOnMap(vectorHexagon, energyType) {
        const tile = this.map.getTile(vectorHexagon);
        if (!tile) {
            console.warn("addEnergyOnMap failed, because there's no tile on map at " + vectorHexagon);
            return;
        }

        if (tile.getObject()) {
            console.warn("addEnergyOnMap failed, because there's object on tile at  " + vectorHexagon);
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

    getPlayer() {
        return this.player;
    }

    getPlayerTile() {
        return this.player.tile;
    }

    getNumberOfMoveAbility() {
        return this.abilities[AbilityType.ABILITY_MOVE];
    }

    addEnergy(energyType) {
        if (this.energy[energyType]) {
            this.energy[energyType]++;
        } else {
            this.energy[energyType] = 1;
        }
    }

    async endTurn() {
        this.turn++;
        await this.generateEnergiesOnMap(this.energyTypes, this.respawnRate);
        await this.updateUI();
    }
}
