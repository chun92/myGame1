import { immerable, produce } from "immer";

export const Vector2DFactory = {
    make: function (x, y) {
        return new Vector2D(x, y);
    },
    makeFromContainer: function (container) {
        return new Vector2D(container.width, container.height);
    }
}
class Vector2D {
    [immerable] = true;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(other) {
        return produce(this, draft => {
            draft.x = this.x + other.x;
            draft.y = this.y + other.y;
        });
    }

    vectorScale(other) {
        return produce(this, draft => {
            draft.y = this.y * other.x / other.y;
        });
    }
    
    scalarScale(val) {
        return produce(this, draft => {
            draft.x = this.x * val;
            draft.y = this.y * val;
        });
    }
}