import { Layer, Group } from '@pixi/layers'
import { LayerGroup } from '../enums/LayerGroup';

class LayerManager {
    static getInstance() {
        if (!this.instance) {
            this.instance = new LayerManager();
        }

        return this.instance;
    }

    initialize(stage) {
        stage.sortableChildren = true;
        Object.entries(LayerGroup).forEach(value => stage.addChild(new Layer(new Group(value[1], true))));
    }
}

const layerManager = LayerManager.getInstance();
export default layerManager;