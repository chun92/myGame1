import gameManager from './common/gameManager';
import { Scene } from './common/scene';
import { Stage } from './common/stage';

gameManager.initialize();

const scene = new Scene("test", gameManager.getWidth(), gameManager.getHeight());
gameManager.changeScene(scene);

const stage = new Stage(scene);
scene.setStage(stage);
stage.test();