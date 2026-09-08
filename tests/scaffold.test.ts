import { describe, expect, it } from "vitest";
import { gameScaffoldReady } from "../src/game";

describe("game scaffold", () => {
  it("exposes a ready placeholder module", () => {
    expect(gameScaffoldReady).toBe(true);
  });
});
