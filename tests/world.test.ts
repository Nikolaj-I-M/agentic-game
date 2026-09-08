import { describe, expect, it } from "vitest";
import {
  applyGravity,
  applyHorizontalMovement,
  applyJump,
  createInitialWorld,
  checkForHazardCollision,
  restartWorld,
  resolveAabbCollision,
  resolveRestartPosition,
  updateWorld,
  updatePlayer,
  type Platform,
  type Player,
} from "../src/game/world";
import type { Level } from "../src/levels";

const player = (overrides: Partial<Player> = {}): Player => ({
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  width: 10,
  height: 10,
  grounded: false,
  ...overrides,
});

describe("world physics", () => {
  it("creates a player and solid test layout", () => {
    const world = createInitialWorld();
    expect(world.player.width).toBeGreaterThan(0);
    expect(world.platforms.length).toBeGreaterThan(0);
  });

  it("accumulates gravity over fixed steps", () => {
    let current = player();
    for (let step = 0; step < 3; step += 1) {
      current = applyGravity(current, 0.5, 10);
    }
    expect(current.vy).toBe(15);
  });

  it("sets horizontal speed from directional input", () => {
    expect(applyHorizontalMovement(player(), true, false, 20).vx).toBe(-20);
    expect(applyHorizontalMovement(player(), false, true, 20).vx).toBe(20);
    expect(applyHorizontalMovement(player(), true, true, 20).vx).toBe(0);
  });

  it("moves horizontally at the configured speed", () => {
    const current = updatePlayer(
      player({ grounded: true }),
      { moveLeft: false, moveRight: true, jump: false },
      [],
      0.5,
    );
    expect(current.x).toBe(120);
  });

  it("only jumps while grounded", () => {
    expect(applyJump(player({ grounded: true }), true, 25)).toMatchObject({
      vy: -25,
      grounded: false,
    });
    expect(applyJump(player({ grounded: false }), true, 25).vy).toBe(0);
  });

  it("lands on top of a platform and becomes grounded", () => {
    const platform: Platform = { x: 0, y: 100, width: 100, height: 10 };
    const resolved = resolveAabbCollision(
      player({ x: 20, y: 95, vy: 20 }),
      [platform],
    );
    expect(resolved.y).toBe(90);
    expect(resolved.vy).toBe(0);
    expect(resolved.grounded).toBe(true);
  });

  it("stops at a wall edge without becoming grounded", () => {
    const wall: Platform = { x: 100, y: 0, width: 10, height: 100 };
    const resolved = resolveAabbCollision(
      player({ x: 95, y: 40, vx: 20 }),
      [wall],
    );
    expect(resolved.x).toBe(90);
    expect(resolved.vx).toBe(0);
    expect(resolved.grounded).toBe(false);
  });

  it("does not retain grounded state after walking off a platform", () => {
    const platform: Platform = { x: 0, y: 100, width: 20, height: 10 };
    const resolved = updatePlayer(
      player({ x: 15, y: 90, grounded: true }),
      { moveLeft: false, moveRight: true, jump: false },
      [platform],
      0.1,
    );
    expect(resolved.grounded).toBe(false);
  });

  it("detects hazard overlap but not separated hazards", () => {
    const hazard = {
      x: 10,
      y: 10,
      width: 20,
      height: 10,
      type: "spikes" as const,
    };
    expect(checkForHazardCollision(player({ x: 20, y: 15 }), [hazard])).toBe(
      true,
    );
    expect(checkForHazardCollision(player({ x: 31, y: 15 }), [hazard])).toBe(
      false,
    );
  });

  it("fails the world on hazard contact or falling out of bounds", () => {
    const world = createInitialWorld();
    const hazardWorld = {
      ...world,
      player: { ...world.player, x: world.hazards[0].x, y: world.hazards[0].y },
    };
    expect(updateWorld(hazardWorld, 0).status).toBe("failed");

    const fallingWorld = {
      ...world,
      player: { ...world.player, y: world.bounds.y + world.bounds.height },
    };
    expect(updateWorld(fallingWorld, 0).status).toBe("failed");
  });

  it("resolves restart positions from the start or nearest passed checkpoint", () => {
    const levelWithCheckpoints: Level = {
      id: "test",
      bounds: { x: 0, y: 0, width: 500, height: 300 },
      start: { x: 10, y: 10 },
      goal: { x: 450, y: 250, width: 20, height: 20 },
      platforms: [{ x: 0, y: 280, width: 500, height: 20 }],
      obstacles: [],
      hazards: [{ x: 100, y: 250, width: 20, height: 30, type: "spikes" }],
      checkpoints: [{ x: 100, y: 10 }, { x: 200, y: 10 }],
    };
    const levelWithoutCheckpoints: Level = {
      ...levelWithCheckpoints,
      checkpoints: undefined,
    };
    expect(
      resolveRestartPosition(levelWithoutCheckpoints, { x: 300, y: 10 }),
    ).toEqual({ x: 10, y: 10 });
    expect(
      resolveRestartPosition(levelWithCheckpoints, { x: 250, y: 10 }),
    ).toEqual({ x: 200, y: 10 });
  });

  it("restarts a failed world at its resolved position and clears failure", () => {
    const world = createInitialWorld();
    const failed = {
      ...world,
      status: "failed" as const,
      player: {
        ...world.player,
        x: 900,
        y: 900,
        vx: 4,
        vy: 5,
        grounded: true,
      },
      feedback: { type: "fail" as const, at: 4 },
    };
    const restarted = restartWorld(failed, {
      id: "test",
      bounds: world.bounds,
      start: { x: 20, y: 30 },
      goal: world.goal,
      platforms: world.platforms,
      obstacles: world.obstacles,
      hazards: world.hazards,
    });
    expect(restarted.status).toBe("playing");
    expect(restarted.player).toMatchObject({
      x: 20,
      y: 30,
      vx: 0,
      vy: 0,
      grounded: false,
    });
    expect(restarted.feedback).toEqual({ type: "restart", at: 5 });
  });
});
