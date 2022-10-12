import { Energy, EnergyType } from "./gameObject/energy";
import { Map } from "./gameObject/map"
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
    }

    async test() {
        await this.initialize();
        //await this.addEnergyOnMap(0, 0, 0, EnergyType.ENERGY_BLUE);
        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
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
    }

    async initialize() {
        // TODO: stage info will be saved as json or xml file format later
        const map = new Map(100, this.scene);
        await map.initialize(3);
        this.scene.addChild(map);
        this.map = map;
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
