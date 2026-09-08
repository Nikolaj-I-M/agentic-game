import { renderPlaceholderScene } from "./render/placeholder-scene";

const canvas = document.querySelector<HTMLCanvasElement>("#game-canvas");

if (!canvas) {
  throw new Error("The game canvas is missing from index.html.");
}

renderPlaceholderScene(canvas);
