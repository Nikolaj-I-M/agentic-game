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
      for (const platform of world.platforms) {
        context.fillRect(
          platform.x,
          platform.y,
          platform.width,
          platform.height,
        );
      }

      context.fillStyle = "#f56565";
      context.fillRect(
        world.player.x,
        world.player.y,
        world.player.width,
        world.player.height,
      );
    },
  };
}
