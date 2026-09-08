import type { World } from "../game/world";

export interface Renderer {
  render(world: World): void;
}

export function createRenderer(canvas: HTMLCanvasElement): Renderer {
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Unable to create a 2D rendering context.");
  }

  return {
    render(world) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      context.clearRect(0, 0, canvas.width, canvas.height);

      context.fillStyle = "#4a5568";
      context.fillRect(
        world.level.x,
        world.level.y,
        world.level.width,
        world.level.height,
      );

      context.beginPath();
      context.arc(
        world.blob.x,
        world.blob.y,
        world.blob.radius,
        0,
        Math.PI * 2,
      );
      context.fillStyle = "#f56565";
      context.fill();
    },
  };
}
