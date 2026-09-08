import { GameLoop } from "./game/game-loop";
import { createInitialWorld, updateWorld } from "./game/world";
import { InputHandler } from "./input";
import { createRenderer } from "./render/renderer";

const canvas = document.querySelector<HTMLCanvasElement>("#game-canvas");

if (!canvas) {
  throw new Error("The game canvas is missing from index.html.");
}

let world = createInitialWorld();
const renderer = createRenderer(canvas);
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
