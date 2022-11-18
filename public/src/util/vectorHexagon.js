import produce, { immerable } from "immer";
import { Vector2DFactory } from "./vector2D";
import { HexagonDirection } from "../enums/hexagonDirection";

export const VectorHexagonFactory = {
    make: function(x, y, z) {
        const vector = new VectorHexagon(x, y, z);
        if (vector.validate()) {
            return vector;
        } else {
            return null;
        }
    }
}

export class VectorHexagon {
    [immerable] = true;

    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    validate() {
        return (this.x + this.y + this.z) == 0;
    }

    getDiffs(source, target) {
        return {
            xDiff: source.x - (target ? target.x : 0),
            yDiff: source.y - (target ? target.y : 0),
            zDiff: source.z - (target ? target.z : 0)
        };
    }

    getDistance(target) {
        const diff = this.getDiffs(this, target);
        const res = [
            {diff1: diff.xDiff, diff2: diff.yDiff, direction: HexagonDirection.HEX_60},
            {diff1: diff.xDiff, diff2: diff.zDiff, direction: HexagonDirection.HEX_120},
            {diff1: diff.yDiff, diff2: diff.zDiff, direction: HexagonDirection.HEX_180}
        ].reduce((res, elem) => produce(res, draft => {
            if (elem.diff1 * elem.diff2 < 0) {
                const len = Math.min(Math.abs(elem.diff1), Math.abs(elem.diff2));
                if (elem.diff1 > 0) {
                    draft[elem.direction] = len;
                } else {
                    draft[elem.direction] = -len;
                }
            }
        }), {});

        return res;
    }

    getLength(target) {
        const diff = this.getDiffs(this, target);
        return (Math.abs(diff.xDiff) + Math.abs(diff.yDiff) + Math.abs(diff.zDiff))/2;
    }

    getVector2D(target) {
        const dist = this.getDistance(target);
        const root3 = Math.pow(3, 0.5);
        return Object.entries(dist).reduce((res, elem) => produce(res, draft => {
            const key = elem[0];
            const value = elem[1];

            if (key == HexagonDirection.HEX_60) {
                draft.x += value * 1.5;
                draft.y += value * root3 / 2;
            } else if (key == HexagonDirection.HEX_120) {
                draft.x += value * 1.5;
                draft.y += -value * root3 / 2;
            } else if (key == HexagonDirection.HEX_180) {
                draft.y += -value * root3;
            }
        }), Vector2DFactory.make(0, 0));
    }
}