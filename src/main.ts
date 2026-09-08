import { GameLoop } from "./game/game-loop";
import { createInitialWorld, restartWorld, updateWorld } from "./game/world";
import { InputHandler } from "./input";
import { createRenderer } from "./render/renderer";
import { createCamera } from "./render/camera";
import { createGameUi } from "./render/ui";
import { GameStateMachine } from "./game/state-machine";
import { loadLevel, level1 } from "./levels";

const canvas = document.querySelector<HTMLCanvasElement>("#game-canvas");

if (!canvas) {
  throw new Error("The game canvas is missing from index.html.");
}

const level = loadLevel(level1);
let world = createInitialWorld(level);
const camera = createCamera();
const renderer = createRenderer(canvas, camera);
const input = new InputHandler();
const stateMachine = new GameStateMachine();
const uiContainer = document.querySelector<HTMLElement>("#game-ui");

if (!uiContainer) {
  throw new Error("The game UI container is missing from index.html.");
}

const startGame = (): void => {
  stateMachine.start();
};
const restartGame = (): void => {
  if (stateMachine.state !== "gameOver" && stateMachine.state !== "levelCompleted") {
    return;
  }
  world = restartWorld(world, level);
  stateMachine.restart();
};
const ui = createGameUi(uiContainer, startGame, restartGame);
let pauseWasPressed = false;
let restartWasPressed = false;
const loop = new GameLoop(
  (dt) => {
    const pausePressed = input.isPressed("pause");
    const restartPressed = input.isPressed("restart");
    const pausePressedThisFrame = pausePressed && !pauseWasPressed;
    const restartPressedThisFrame = restartPressed && !restartWasPressed;
    pauseWasPressed = pausePressed;
    restartWasPressed = restartPressed;

    if (stateMachine.state === "start") {
      if (restartPressedThisFrame) {
        stateMachine.start();
      }
      return;
    }

    if (restartPressedThisFrame) {
      restartGame();
    }
    if (pausePressedThisFrame) {
      if (stateMachine.state === "playing") {
        stateMachine.pause();
      } else if (stateMachine.state === "paused") {
        stateMachine.resume();
      }
    }
    if (stateMachine.state !== "playing") {
      return;
    }

    world = updateWorld(world, dt, {
      moveLeft: input.isPressed("moveLeft"),
      moveRight: input.isPressed("moveRight"),
      jump: input.isPressed("jump"),
    });
    if (world.status === "failed") {
      stateMachine.fail();
    } else if (world.status === "completed") {
      stateMachine.complete();
    }
  },
  () => {
    renderer.render(world, stateMachine.state);
    ui.render(stateMachine.state);
  },
);

loop.start();
