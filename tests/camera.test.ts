import { describe, expect, it } from "vitest";
import { calculateCameraOffset } from "../src/render/camera";

const bounds = { x: 0, y: 0, width: 1000, height: 800 };
const viewport = { width: 400, height: 300 };

describe("camera", () => {
  it("follows the player while staying within bounds", () => {
    expect(
      calculateCameraOffset({ x: 500, y: 400, width: 40, height: 40 }, bounds, viewport),
    ).toEqual({ x: 320, y: 270 });
    expect(
      calculateCameraOffset({ x: 0, y: 0, width: 40, height: 40 }, bounds, viewport),
    ).toEqual({ x: 0, y: 0 });
    expect(
      calculateCameraOffset({ x: 990, y: 790, width: 40, height: 40 }, bounds, viewport),
    ).toEqual({ x: 600, y: 500 });
  });

  it("does not offset a level narrower than the viewport", () => {
    expect(
      calculateCameraOffset(
        { x: 100, y: 100, width: 20, height: 20 },
        { x: 0, y: 0, width: 200, height: 150 },
        viewport,
      ),
    ).toEqual({ x: 0, y: 0 });
  });
});
