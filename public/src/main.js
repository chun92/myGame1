import gameManager from './gameManager';
import { Scene } from './scene';
import { Map } from './gameObject/map';
import { PositionBase, Vector2D } from './util';

gameManager.initialize();

const scene = new Scene("test", gameManager.width, gameManager.height);
gameManager.changeScene(scene);

const map = new Map(new Vector2D(0, 0), PositionBase.CENTER, 100, scene);
map.initialize(3);
scene.addChild(map);