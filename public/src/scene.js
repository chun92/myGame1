import { Container } from "pixi.js";
import { Vector2DFactory, CoordinateCalculator } from "./util";

export class Scene {
    static count = 0;
    constructor(name, width, height) {
        this.count++;
        this.id = this.count;
        this.name = name;
        this.asset = new Container();
        this.children = [];

        const sceneSize = Vector2DFactory.make(width, height);
        this.coordinateCalculator = new CoordinateCalculator(sceneSize.x, sceneSize.y);
        this.size = sceneSize;
    }

    resize(width, height) {
        this.coordinateCalculator.setSize(width, height);
        this.children.forEach((value, index, array) => {
            value.resize();
        });
    }

    addChild(object) {
        this.children.push(object);
    }

    update(framesPassed) {
        
    }
}
