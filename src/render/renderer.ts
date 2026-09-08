import type { World } from "../game/world";
import type { GameState } from "../game/state-machine";
import { createCamera, type Camera } from "./camera";

export interface Renderer {
  render(world: World, state: GameState): void;
}

export function createRenderer(
  canvas: HTMLCanvasElement,
  camera: Camera = createCamera(),
): Renderer {
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Unable to create a 2D rendering context.");
  }

  return {
    render(world, state) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      context.clearRect(0, 0, canvas.width, canvas.height);
      camera.update(world.player, world.bounds, {
        width: canvas.width,
        height: canvas.height,
      });
      context.save();
      context.translate(-camera.x, -camera.y);

      context.fillStyle = "#4a5568";
      for (const platform of world.platforms) {
        context.fillRect(
          platform.x,
          platform.y,
          platform.width,
          platform.height,
        );
      }

      context.fillStyle = "#f6ad55";
      for (const obstacle of world.obstacles) {
        context.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      }
      context.fillStyle = "#e53e3e";
      for (const hazard of world.hazards) {
        context.fillRect(hazard.x, hazard.y, hazard.width, hazard.height);
      }
      context.fillStyle = "#68d391";
      context.fillRect(world.goal.x, world.goal.y, world.goal.width, world.goal.height);
      context.fillStyle = "#f56565";
      context.fillRect(
        world.player.x,
        world.player.y,
        world.player.width,
        world.player.height,
      );
      context.restore();

      if (state === "gameOver") {
        context.fillStyle = "rgba(229, 62, 62, 0.35)";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "#ffffff";
        context.font = "bold 28px sans-serif";
        context.textAlign = "center";
      }
    },
  };
}
