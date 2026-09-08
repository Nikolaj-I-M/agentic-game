import { describe, expect, it } from "vitest";
import { createInitialWorld, updateWorld } from "../src/game/world";

describe("world", () => {
  it("creates the placeholder level and blob", () => {
    expect(createInitialWorld()).toEqual({
      blob: { x: 160, y: 120, radius: 24 },
      level: { x: 80, y: 60, width: 320, height: 200 },
    });
  });

  it("updates without mutating the previous state", () => {
    const world = createInitialWorld();
    const updated = updateWorld(world, 1 / 60);

    expect(updated).toEqual(world);
    expect(updated).not.toBe(world);
    expect(updated.blob).not.toBe(world.blob);
    expect(updated.level).not.toBe(world.level);
  });
});
