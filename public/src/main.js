import gameManager from './gameManager';
import { GameObject, GameObjectType } from './gameObject';
import { Scene } from './scene';
import { PositionBase, Vector2D } from './util';

gameManager.initialize();

const scene = new Scene("test", gameManager.width, gameManager.height);
gameManager.changeScene(scene);

const gameObject = new GameObject("ball_black", GameObjectType.SPRITE, new Vector2D(0, 0), PositionBase.CENTER, 20, scene);
gameObject.initialize();
scene.addChild(gameObject);
