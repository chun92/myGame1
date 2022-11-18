import { immerable, produce } from "immer";
import { Vector2DFactory } from "./vector2D";

export class CoordinateCalculator {
    [immerable] = true

    constructor() {
        this.width = 0;
        this.height = 0;
        this.prevWidth = 0;
        this.prevHeight = 0;
    }

    getPosition(xPercent, yPercent) {
        const x = this.width / 100.0 * xPercent;
        const y = this.height / 100.0 * yPercent;
        return Vector2DFactory.make(x, y);
    }

    setSize(width, height) {
        return produce(this, draft => {
            draft.prevWidth = this.width;
            draft.prevHeight = this.height;
            draft.width = width;
            draft.height = height;
            draft.ratioChanged = draft.width / draft.prevWidth;
        });
    }

    getSize(percent, original) {
        if (original) {
            const ratio = this.width / 100;
            const width = ratio * percent;
            const height = original.y / original.x * width;
            return Vector2DFactory.make(width, height);
        } else {
            const width = this.width * percent / 100;
            const height = this.height * percent / 100;
            return Vector2DFactory.make(width, height);
        }
    }

    getTargetPosition(xPercent, yPercent, original) {
        if (original) {
            const x = original.x * this.ratioChanged;
            const y = original.y * this.ratioChanged;
            return Vector2DFactory.make(x, y);
        } else {
            const x = this.width/100.0 * xPercent;
            const y = this.height/100.0 * yPercent;
            return Vector2DFactory.make(x, y);
        }
    }
}