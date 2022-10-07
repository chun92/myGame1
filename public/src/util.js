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

export class VectorHexagon {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    validate() {
        return (x + y + z) == 0;
    }

    getDistance(target) {
        if (!target) {
            return 0;
        }

        const deltaX = target.x - this.x;
        const deltaY = target.y - this.y;
        const deltaZ = target.z - this.z;
        return (Math.abs(deltaX) + Math.abs(deltaY) + Math.abs(deltaZ))/2;
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
    constructor(x, y, width, height) {
        this.setPosition(x, y);
        this.setSize(width, height);
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    getPosition(xPercent, yPercent) {
        const x = this.x + this.width/100.0 * xPercent;
        const y = this.y + this.height/100.0 * yPercent;
        return new Vector2D(x, y);
    }

    setSize(width, height) {
        this.width = width;
        this.height = height;
    }

    getSize(percent, original) {
        const ratio = this.width / 100;
        const width = ratio * percent;
        const height = original.y / original.x * width;
        return new Vector2D(width, height);
    }

    getTargetPosition(base, target, xPercent, yPercent) {
        let x = this.x + this.width/100.0 * xPercent;
        let y = this.y + this.height/100.0 * yPercent;

        const width = target.x;
        const height = target.y;

        switch (base) {
            case PositionBase.LEFT_TOP:
                break;
            case PositionBase.RIGHT_TOP:
                x = x + this.width - width;
                break;
            case PositionBase.LEFT_BOTTOM:
                y = y + this.height - height;
                break;
            case PositionBase.RIGHT_BOTTOM:
                x = x + this.width - width;
                y = y + this.height - height;
                break;
            case PositionBase.LEFT_MID:
                y = y + (this.height - height) / 2;
                break;
            case PositionBase.RIGHT_MID:
                x = x + this.width - width;
                y = y + (this.height - height) / 2;
                break;
            case PositionBase.TOP_MID:
                x = x + (this.width - width) / 2;
                break;
            case PositionBase.BOTTOM_MID:
                x = x + (this.width - width) / 2;
                y = y + this.height - height;
                break;
            case PositionBase.CENTER:
                x = x + (this.width - width) / 2;
                y = y + (this.height - height) / 2;
                break;
        }
        
        return new Vector2D(x, y);
    }
}