import { describe, expect, it } from "vitest";
import {
  createInitialWorld,
  isOutOfBounds,
  updatePlayer,
  type Player,
} from "../src/game/world";
import type { Bounds } from "../src/levels";

const bounds: Bounds = { x: 0, y: 0, width: 100, height: 100 };
const player: Player = {
  x: 50,
  y: 50,
  vx: 0,
  vy: 0,
  width: 20,
  height: 20,
  grounded: false,
};

describe("world bounds", () => {
  it("clamps horizontal and top edges but allows a bottom fall", () => {
    const input = { moveLeft: false, moveRight: false, jump: false };
    expect(updatePlayer({ ...player, x: -10 }, input, [], 0, bounds).x).toBe(0);
    expect(updatePlayer({ ...player, x: 90 }, input, [], 0, bounds).x).toBe(80);
    expect(updatePlayer({ ...player, y: -10 }, input, [], 0, bounds).y).toBe(0);
    expect(updatePlayer({ ...player, y: 90 }, input, [], 0, bounds).y).toBe(90);
  });

  it("detects a player falling below the bottom bound", () => {
    expect(isOutOfBounds({ ...player, y: 79 }, bounds)).toBe(false);
    expect(isOutOfBounds({ ...player, y: 81 }, bounds)).toBe(true);
  });

  it("initializes bounds from the loaded level", () => {
    expect(createInitialWorld().bounds.width).toBe(2400);
  });
});
