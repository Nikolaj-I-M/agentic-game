import { describe, expect, it } from "vitest";
import { level1, loadLevel, parseLevel } from "../src/levels";

describe("level loader", () => {
  it("loads a valid level into an independent normalized value", () => {
    const level = loadLevel(level1);
    expect(level.id).toBe("level-1");
    expect(level.platforms.length).toBeGreaterThan(0);
    expect(level.obstacles.length).toBeGreaterThan(0);
    expect(level.hazards.length).toBeGreaterThan(0);
    expect(level).not.toBe(level1);
    expect(level.platforms[0]).not.toBe(level1.platforms[0]);
  });

  it("rejects missing collections and out-of-bounds goals", () => {
    expect(() => parseLevel({ ...level1, hazards: [] })).toThrow(
      /hazards must contain/,
    );
    expect(() =>
      parseLevel({
        ...level1,
        goal: { ...level1.goal, x: level1.bounds.width },
      }),
    ).toThrow(/goal must be inside/);
  });
});
