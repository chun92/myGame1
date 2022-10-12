export const Vector2DFactory = {
    make: function (x, y) {
        return new Vector2D(x, y);
    },
    makeFromContainer: function (container) {
        return new Vector2D(container.width, container.height);
    }
}
export class Vector2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(other) {
        this.x += other.x;
        this.y += other.y;
        return this;
    }

    vectorScale(other) {
        this.y = this.y * other.x / other.y;
        return this;
    }
    
    scalarScale(val) {
        this.x = this.x * val;
        this.y = this.y * val;
        return this;
    }
}

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

export const HexagonDirection = Object.freeze({
    HEX_60: 60,
    HEX_120: 120,
    HEX_180: 180
});

export class VectorHexagon {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    validate() {
        return (this.x + this.y + this.z) == 0;
    }

    getDistance(target) {
        const targetX = target ? target.x : 0;
        const targetY = target ? target.y : 0;
        const targetZ = target ? target.z : 0;

        const xDiff = this.x - targetX;
        const yDiff = this.y - targetY;
        const zDiff = this.z - targetZ;

        let res = {};
        if (xDiff * yDiff < 0) {
            const xyLen = Math.min(Math.abs(xDiff), Math.abs(yDiff));
            if (xDiff > 0) {
                res[HexagonDirection.HEX_60] = xyLen;
            } else {
                res[HexagonDirection.HEX_60] = -xyLen;
            }
        }

        if (yDiff * zDiff < 0) {
            const yzLen = Math.min(Math.abs(yDiff), Math.abs(zDiff));
            if (yDiff > 0) {
                res[HexagonDirection.HEX_180] = yzLen;
            } else {
                res[HexagonDirection.HEX_180] = -yzLen;
            }
        }

        if (zDiff * xDiff < 0) {
            const zxLen = Math.min(Math.abs(zDiff), Math.abs(xDiff));
            if (zDiff > 0) {
                res[HexagonDirection.HEX_120] = -zxLen;
            } else {
                res[HexagonDirection.HEX_120] = zxLen;
            }
        }

        return res;
    }

    getLength(target) {
        const targetX = target ? target.x : 0;
        const targetY = target ? target.y : 0;
        const targetZ = target ? target.z : 0;

        const xDiff = this.x - targetX;
        const yDiff = this.y - targetY;
        const zDiff = this.z - targetZ;
        return (Math.abs(xDiff) + Math.abs(yDiff) + Math.abs(zDiff))/2;
    }

    getVector2D(target) {
        const dist = this.getDistance(target);
        let x = 0;
        let y = 0;

        const root3 = Math.pow(3, 0.5);
        if (dist[HexagonDirection.HEX_60]) {
            x += dist[HexagonDirection.HEX_60] * 1.5;
            y += dist[HexagonDirection.HEX_60] * root3 / 2;
        }

        if (dist[HexagonDirection.HEX_120]) {
            x += dist[HexagonDirection.HEX_120] * 1.5;
            y += - dist[HexagonDirection.HEX_120] * root3 / 2;
        }

        if (dist[HexagonDirection.HEX_180]) {
            y +=  - dist[HexagonDirection.HEX_180] * root3 ;
        }

        return Vector2DFactory.make(x, y);
    }
}

export const PositionBase = Object.freeze({
    LEFT_TOP: 'left_top',
    RIGHT_TOP: 'right_top',
    LEFT_BOTTOM: 'left_bottom',
    RIGHT_BOTTOM: 'right_bottom',
    LEFT_MID: 'left_mid',
    RIGHT_MID: 'right_mid',
    TOP_MID: 'top_mid',
    BOTTOM_MID: 'bottom_mid',
    CENTER: 'center'
});

export class CoordinateCalculator {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.prevWidth = 0;
        this.prevHeight = 0;
    }

    getPosition(xPercent, yPercent) {
        const x = this.width/100.0 * xPercent;
        const y = this.height/100.0 * yPercent;
        return new Vector2D(x, y);
    }

    setSize(width, height) {
        this.prevWidth = this.width;
        this.prevHeight = this.height;
        this.width = width;
        this.height = height;
        this.ratioChanged = this.width / this.prevWidth;
    }

    getSize(percent, original) {
        if (original) {
            const ratio = this.width / 100;
            const width = ratio * percent;
            const height = original.y / original.x * width;
            return new Vector2D(width, height);
        } else {
            const width = this.width * percent / 100;
            const height = this.height * percent / 100;
            return new Vector2D(width, height);
        }
    }

    getTargetPosition(xPercent, yPercent, original) {
        if (original) {
            const x = original.x * this.ratioChanged;
            const y = original.y * this.ratioChanged;
            return new Vector2D(x, y);
        } else {
            const x = this.width/100.0 * xPercent;
            const y = this.height/100.0 * yPercent;
            return new Vector2D(x, y);
        }
    }
}