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
        await this.addEnergyOnMap(0, 0, 0, EnergyType.ENERGY_BLUE);
    }

    async initialize() {
        // TODO: stage info will be saved as json or xml file format later
        const map = new Map(new Vector2DFactory.make(0, 0), PositionBase.CENTER, 100, this.scene);
        await map.initialize(1);
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

        const energy = new Energy(energyType, Vector2DFactory.make(0, 0), PositionBase.LEFT_TOP, 50, tile);
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
