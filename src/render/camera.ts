import type { Bounds } from "../levels";
import type { Player } from "../game/world";

export interface Viewport {
  width: number;
  height: number;
}

export interface Camera {
  x: number;
  y: number;
  update(player: Player, bounds: Bounds, viewport: Viewport): void;
}

export function calculateCameraOffset(
  player: Pick<Player, "x" | "y" | "width" | "height">,
  bounds: Bounds,
  viewport: Viewport,
): { x: number; y: number } {
  const centeredX = player.x + player.width / 2 - viewport.width / 2;
  const centeredY = player.y + player.height / 2 - viewport.height / 2;
  return {
    x: Math.min(Math.max(centeredX, bounds.x), Math.max(bounds.x, bounds.x + bounds.width - viewport.width)),
    y: Math.min(Math.max(centeredY, bounds.y), Math.max(bounds.y, bounds.y + bounds.height - viewport.height)),
  };
}

export function createCamera(): Camera {
  const camera: Camera = {
    x: 0,
    y: 0,
    update(player, bounds, viewport) {
      const offset = calculateCameraOffset(player, bounds, viewport);
      camera.x = offset.x;
      camera.y = offset.y;
    },
  };
  return camera;
}
