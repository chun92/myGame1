import { Layer, Group } from '@pixi/layers'

class LayerManager {
    static getInstance() {
        if (!this.instance) {
            this.instance = new LayerManager();
        }

        return this.instance;
    }

    initialize(stage) {
        stage.sortableChildren = true;

        this.defaultGroup = new Group(0, true);
        this.tileGroup = new Group(-1, true);
        this.resourceGroup = new Group(1, true);
        this.characterGroup = new Group(2, true);
        this.uiGroup = new Group(100, true);

        stage.addChild(new Layer(this.defaultGroup));
        stage.addChild(new Layer(this.tileGroup));
        stage.addChild(new Layer(this.resourceGroup));
        stage.addChild(new Layer(this.characterGroup));
        stage.addChild(new Layer(this.uiGroup));
    }
}

const layerManager = LayerManager.getInstance();
export default layerManager;