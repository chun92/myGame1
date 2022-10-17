import { Vector2DFactory } from "./util"

class CoordinateCalculator {
    constructor() {
        this.width = 0;
        this.height = 0;
        this.prevWidth = 0;
        this.prevHeight = 0;
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new CoordinateCalculator();
        }

        return this.instance;
    }

    getPosition(xPercent, yPercent) {
        const x = this.width/100.0 * xPercent;
        const y = this.height/100.0 * yPercent;
        return Vector2DFactory.make(x, y);
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

const coordinateCalculator = CoordinateCalculator.getInstance();
export default coordinateCalculator;