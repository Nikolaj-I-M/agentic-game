import { level1 } from "../levels";
import type { Bounds, Goal, Hazard, Level, Obstacle } from "../levels";

export interface Player {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  grounded: boolean;
}

export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PlayerInput {
  moveLeft: boolean;
  moveRight: boolean;
  jump: boolean;
}

export interface World {
  player: Player;
  platforms: Platform[];
  obstacles: Obstacle[];
  hazards: Hazard[];
  goal: Goal;
  bounds: Bounds;
}

// Tuning defaults for the first playable physics pass, in pixels and seconds.
export const GRAVITY = 1200;
export const MOVE_SPEED = 240;
export const JUMP_IMPULSE = 500;
export const PLAYER_WIDTH = 40;
export const PLAYER_HEIGHT = 40;

export function createInitialWorld(level: Level = level1): World {
  return {
    player: {
      x: level.start.x,
      y: level.start.y,
      vx: 0,
      vy: 0,
      width: PLAYER_WIDTH,
      height: PLAYER_HEIGHT,
      grounded: false,
    },
    platforms: level.platforms.map((platform) => ({ ...platform })),
    obstacles: level.obstacles.map((obstacle) => ({ ...obstacle })),
    hazards: level.hazards.map((hazard) => ({ ...hazard })),
    goal: { ...level.goal },
    bounds: { ...level.bounds },
  };
}

export function applyGravity(
  player: Player,
  dt: number,
  gravity = GRAVITY,
): Player {
  return { ...player, vy: player.vy + gravity * dt };
}

export function applyHorizontalMovement(
  player: Player,
  moveLeft: boolean,
  moveRight: boolean,
  speed = MOVE_SPEED,
): Player {
  const vx = moveLeft === moveRight ? 0 : moveLeft ? -speed : speed;
  return { ...player, vx };
}

export function applyJump(
  player: Player,
  jumpPressed: boolean,
  jumpImpulse = JUMP_IMPULSE,
): Player {
  if (!jumpPressed || !player.grounded) {
    return { ...player };
  }

  return { ...player, vy: -jumpImpulse, grounded: false };
}

export function integratePosition(player: Player, dt: number): Player {
  return {
    ...player,
    x: player.x + player.vx * dt,
    y: player.y + player.vy * dt,
  };
}

function overlapsVertically(player: Player, platform: Platform): boolean {
  return (
    player.y < platform.y + platform.height &&
    player.y + player.height > platform.y
  );
}

function overlapsHorizontally(player: Player, platform: Platform): boolean {
  return (
    player.x < platform.x + platform.width &&
    player.x + player.width > platform.x
  );
}

export function resolveAabbCollision(
  player: Player,
  platforms: readonly Platform[],
): Player {
  let resolved = { ...player };

  // Resolve horizontal motion first so a wall cannot change the vertical result.
  for (const platform of platforms) {
    if (
      !overlapsVertically(resolved, platform) ||
      !overlapsHorizontally(resolved, platform)
    ) {
      continue;
    }

    if (resolved.vx > 0 && resolved.x + resolved.width > platform.x) {
      resolved = { ...resolved, x: platform.x - resolved.width, vx: 0 };
    } else if (resolved.vx < 0 && resolved.x < platform.x + platform.width) {
      resolved = { ...resolved, x: platform.x + platform.width, vx: 0 };
    }
  }

  let grounded = false;
  for (const platform of platforms) {
    if (!overlapsHorizontally(resolved, platform)) {
      continue;
    }

    const bottom = resolved.y + resolved.height;
    if (resolved.vy >= 0 && bottom >= platform.y && resolved.y < platform.y) {
      resolved = { ...resolved, y: platform.y - resolved.height, vy: 0 };
      grounded = true;
    } else if (resolved.vy < 0 && resolved.y < platform.y + platform.height) {
      resolved = { ...resolved, y: platform.y + platform.height, vy: 0 };
    }
  }

  return { ...resolved, grounded };
}

export function updatePlayer(
  player: Player,
  input: PlayerInput,
  platforms: readonly Platform[],
  dt: number,
  bounds?: Bounds,
): Player {
  const moved = applyHorizontalMovement(
    applyJump(applyGravity(player, dt), input.jump),
    input.moveLeft,
    input.moveRight,
  );

  const resolved = resolveAabbCollision(integratePosition(moved, dt), platforms);
  if (!bounds) return resolved;

  return {
    ...resolved,
    x: Math.min(
      Math.max(resolved.x, bounds.x),
      Math.max(bounds.x, bounds.x + bounds.width - resolved.width),
    ),
    y: Math.min(
      Math.max(resolved.y, bounds.y),
      Math.max(bounds.y, bounds.y + bounds.height - resolved.height),
    ),
  };
}

export function updateWorld(
  state: World,
  dt: number,
  input: PlayerInput = { moveLeft: false, moveRight: false, jump: false },
): World {
  return {
    player: updatePlayer(
      state.player,
      input,
      [...state.platforms, ...state.obstacles],
      dt,
      state.bounds,
    ),
    platforms: state.platforms.map((platform) => ({ ...platform })),
    obstacles: state.obstacles.map((obstacle) => ({ ...obstacle })),
    hazards: state.hazards.map((hazard) => ({ ...hazard })),
    goal: { ...state.goal },
    bounds: { ...state.bounds },
  };
}
