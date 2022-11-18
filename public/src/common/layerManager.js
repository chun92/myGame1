import { Layer, Group } from '@pixi/layers'
import produce from 'immer';
import { LayerGroup } from '../enums/LayerGroup';

export class LayerManager {
    initialize(stage) {
        stage.sortableChildren = true;
        this.group = Object.entries(LayerGroup).reduce((res, elem) => produce(res, draft => {
            const key = elem[0];
            const value = elem[1];
            const group = new Group(value, true);
            stage.addChild(new Layer(group));
            draft[key] = group;
        }), {});
    }

    setObject(gameObject, group) {
        gameObject.asset.parentGroup = this.group[group];
    }
}