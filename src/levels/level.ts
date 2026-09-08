export interface Point {
  x: number;
  y: number;
}

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type ObstacleType = "solid" | "moving";

export interface Obstacle extends Platform {
  type: ObstacleType;
  velocityX?: number;
}

export type HazardType = "spikes";

export interface Hazard extends Platform {
  type: HazardType;
}

export interface Goal extends Point {
  width: number;
  height: number;
}

export interface LevelData {
  id: string;
  bounds: Bounds;
  start: Point;
  goal: Goal;
  platforms: Platform[];
  obstacles: Obstacle[];
  hazards: Hazard[];
}

export type Level = LevelData;
