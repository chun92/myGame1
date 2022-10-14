import { Energy, EnergyType } from "./gameObject/energy";
import { Map } from "./gameObject/map"
import { UpperUI } from "./ui/upperUi";
import { PositionBase, Vector2DFactory } from "./util";

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
    }

    async test() {
        await this.initialize();
        //await this.addEnergyOnMap(0, 0, 0, EnergyType.ENERGY_BLUE);
        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min)) + min; 
        }

        for (let pos in this.map.tileMap) {
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
            const tile = this.map.tileMap[pos];
            const energy = new Energy(energyType, Vector2DFactory.make(0, 0), PositionBase.CENTER, 20, tile, this.scene);
            await energy.initialize();
            tile.setObject(energy);
        }

        this.energy[EnergyType.ENERGY_BLACK] = 1;
        this.energy[EnergyType.ENERGY_GREEN] = 2;
        this.energy[EnergyType.ENERGY_BLUE] = 1;
        this.energy[EnergyType.ENERGY_ORANGE] = 3;
        this.energy[EnergyType.ENERGY_RED] = 4;
        this.energy[EnergyType.ENERGY_WHITE] = 0;
    }

    async initialize() {
        // TODO: stage info will be saved as json or xml file format later
        const map = new Map(100, this.scene);
        await map.initialize(3);
        this.scene.addChild(map);
        this.map = map;

        const upperUi = new UpperUI(this.scene);
        await upperUi.initialize();
        this.scene.addChild(upperUi);
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

        const energy = new Energy(energyType, Vector2DFactory.make(0, 0), PositionBase.CENTER, 10, tile, this.scene);
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
