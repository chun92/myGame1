import { Container } from "pixi.js";
import { Vector2DFactory } from "./util/util";
import coordinateCalculator from "./util/coordinateCalculator"
import { GameObjectType } from "./gameObject/gameObject";

export class Scene {
    static count = 0;
    constructor(name, width, height) {
        Scene.count++;
        this.id = Scene.count;
        this.name = name;
        this.asset = new Container();
        this.children = [];
        this.objectType = GameObjectType.SCENE;

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
        this.asset.addChild(object.asset);
        this.children.push(object);
    }

    setStage(stage) {
        this.currentStage = stage;
    }
}
