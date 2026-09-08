import { GameLoop } from "./game/game-loop";
import { createInitialWorld, updateWorld } from "./game/world";
import { createRenderer } from "./render/renderer";

const canvas = document.querySelector<HTMLCanvasElement>("#game-canvas");

if (!canvas) {
  throw new Error("The game canvas is missing from index.html.");
}

let world = createInitialWorld();
const renderer = createRenderer(canvas);
const loop = new GameLoop(
  (dt) => {
    world = updateWorld(world, dt);
  },
  () => renderer.render(world),
);

loop.start();
