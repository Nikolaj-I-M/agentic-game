import { describe, expect, it } from "vitest";
import { GameLoop } from "../src/game/game-loop";

describe("GameLoop", () => {
  it("advances by deterministic fixed steps", () => {
    let timestamp = 0;
    let callback: ((timestamp: number) => void) | undefined;
    const updates: number[] = [];
    let renders = 0;

    const loop = new GameLoop(
      (dt) => updates.push(dt),
      () => {
        renders += 1;
      },
      {
        fixedStep: 0.1,
        now: () => timestamp,
        requestAnimationFrame: (nextCallback) => {
          callback = nextCallback;
          return 1;
        },
        cancelAnimationFrame: () => undefined,
      },
    );

    loop.start();
    timestamp = 250;
    callback?.(timestamp);

    expect(updates).toEqual([0.1, 0.1]);
    expect(renders).toBe(1);
  });

  it("caps a slow frame and does not schedule after stopping", () => {
    let callback: ((timestamp: number) => void) | undefined;
    let updates = 0;
    let cancelled = 0;

    const loop = new GameLoop(
      () => {
        updates += 1;
      },
      () => undefined,
      {
        fixedStep: 0.1,
        maxDelta: 0.25,
        now: () => 0,
        requestAnimationFrame: (nextCallback) => {
          callback = nextCallback;
          return 7;
        },
        cancelAnimationFrame: () => {
          cancelled += 1;
        },
      },
    );

    loop.start();
    callback?.(1000);
    loop.stop();

    expect(updates).toBe(2);
    expect(cancelled).toBe(1);
  });
});
