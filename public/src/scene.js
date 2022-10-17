import { Container } from "pixi.js";
import { Vector2DFactory } from "./util/util";
import coordinateCalculator from "./util/coordinateCalculator"

export class Scene {
    static count = 0;
    constructor(name, width, height) {
        this.count++;
        this.id = this.count;
        this.name = name;
        this.asset = new Container();
        this.children = [];

        const sceneSize = Vector2DFactory.make(width, height);
        coordinateCalculator.setSize(sceneSize.x, sceneSize.y);
        this.size = sceneSize;
    }

    resize(width, height) {
        coordinateCalculator.setSize(width, height);
        this.children.forEach((child) => {
            child.resize();
        });
    }

    addChild(object) {
        this.children.push(object);
    }

    update(framesPassed) {
        this.children.forEach((child) => {
            child.update(framesPassed);
        });
    }
}
