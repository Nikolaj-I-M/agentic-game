import { GameLoop } from "./game/game-loop";
import { createInitialWorld, updateWorld } from "./game/world";
import { InputHandler } from "./input";
import { createRenderer } from "./render/renderer";
import { createCamera } from "./render/camera";
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
const loop = new GameLoop(
  (dt) => {
    world = updateWorld(world, dt, {
      moveLeft: input.isPressed("moveLeft"),
      moveRight: input.isPressed("moveRight"),
      jump: input.isPressed("jump"),
    });
  },
  () => renderer.render(world),
);

loop.start();
