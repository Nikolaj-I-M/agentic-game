export interface Point {
  x: number;
  y: number;
}

export interface Blob extends Point {
  radius: number;
}

export interface Level {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface World {
  blob: Blob;
  level: Level;
}

export function createInitialWorld(): World {
  return {
    blob: {
      x: 160,
      y: 120,
      radius: 24,
    },
    level: {
      x: 80,
      y: 60,
      width: 320,
      height: 200,
    },
  };
}

export function updateWorld(state: World, _dt: number): World {
  return {
    blob: { ...state.blob },
    level: { ...state.level },
  };
}
