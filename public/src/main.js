import gameManager from './gameManager';
import { Scene } from './scene';
import { Stage } from './stage';

gameManager.initialize();

const scene = new Scene("test", gameManager.width, gameManager.height);
gameManager.changeScene(scene);

const stage = new Stage(scene);
stage.test();