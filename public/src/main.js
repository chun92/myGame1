import gameManager from './gameManager';
import { GameObject, GameObjectType } from './gameObject';
import { Scene } from './scene';
import { Map, Tile } from './map';
import { PositionBase, Vector2D } from './util';

gameManager.initialize();

const scene = new Scene("test", gameManager.width, gameManager.height);
gameManager.changeScene(scene);

const map = new Map(new Vector2D(0, 0), PositionBase.CENTER, 80, scene);
map.initialize();
scene.addChild(map);