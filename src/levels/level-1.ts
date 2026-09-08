import type { LevelData } from "./level";

export const level1: LevelData = {
  id: "level-1",
  bounds: { x: 0, y: 0, width: 2400, height: 600 },
  start: { x: 100, y: 420 },
  goal: { x: 2290, y: 440, width: 50, height: 80 },
  platforms: [
    { x: 0, y: 500, width: 520, height: 100 },
    { x: 650, y: 430, width: 300, height: 30 },
    { x: 1080, y: 500, width: 300, height: 100 },
    { x: 1480, y: 400, width: 220, height: 30 },
    { x: 1770, y: 470, width: 280, height: 130 },
    { x: 2170, y: 500, width: 230, height: 100 },
  ],
  obstacles: [
    { x: 820, y: 400, width: 80, height: 30, type: "solid" },
    { x: 1220, y: 350, width: 140, height: 25, type: "moving", velocityX: 45 },
  ],
  hazards: [
    { x: 760, y: 400, width: 90, height: 30, type: "spikes" },
    { x: 1280, y: 470, width: 100, height: 30, type: "spikes" },
    { x: 1980, y: 440, width: 70, height: 30, type: "spikes" },
  ],
};
