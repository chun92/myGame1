import { Layer, Group } from '@pixi/layers'
import { immerable, produce } from 'immer';
import { LayerGroup } from '../enums/LayerGroup';

export class LayerManager {
    [immerable] = true;
    initialize(stage) {
        return produce(this, draftLayerManager => {
            stage.sortableChildren = true;
            draftLayerManager.group = Object.entries(LayerGroup).reduce((res, elem) => produce(res, draft => {
                const value = elem[1];
                const group = new Group(value, true);
                stage.addChild(new Layer(group));
                draft[value] = group;
            }), {});
        });
    }

    setObject(gameObject, group) {
        // TODO: change setObject immerable after GameObject becomes immerable
        /*
        const test = produce(gameObject, draft => {
            draft.asset.parentGroup = this.group[group];
        });
        */
        gameObject.asset.parentGroup = this.group[group];
    }
}