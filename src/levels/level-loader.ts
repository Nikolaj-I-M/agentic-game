import type { Bounds, Goal, Level, LevelData, Point } from "./level";

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

function isRectangle(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  const rectangle = value as Record<string, unknown>;
  return (
    isFiniteNumber(rectangle.x) &&
    isFiniteNumber(rectangle.y) &&
    isFiniteNumber(rectangle.width) &&
    isFiniteNumber(rectangle.height) &&
    rectangle.width > 0 &&
    rectangle.height > 0
  );
}

function isBounds(value: unknown): value is Bounds {
  return isRectangle(value);
}

function isGoal(value: unknown): value is Goal {
  return isRectangle(value);
}

function isPoint(value: unknown): value is Point {
  if (!value || typeof value !== "object") return false;
  const point = value as Record<string, unknown>;
  return isFiniteNumber(point.x) && isFiniteNumber(point.y);
}

function assertRectangle(value: unknown, name: string): void {
  if (!isRectangle(value)) {
    throw new Error(`${name} must be a rectangle with positive dimensions.`);
  }
}

export function parseLevel(data: unknown): Level {
  if (!data || typeof data !== "object") {
    throw new Error("Level data must be an object.");
  }

  const level = data as Partial<LevelData>;
  if (typeof level.id !== "string" || level.id.length === 0) {
    throw new Error("Level id is required.");
  }
  if (!isBounds(level.bounds)) {
    throw new Error("Level bounds must be a rectangle with positive dimensions.");
  }
  const bounds = level.bounds;
  if (!isGoal(level.goal)) {
    throw new Error("Level goal must be a rectangle with positive dimensions.");
  }
  const goal = level.goal;
  if (!isPoint(level.start)) {
    throw new Error("Level start must be a point.");
  }
  const start = level.start;
  if (
    level.checkpoints !== undefined &&
    (!Array.isArray(level.checkpoints) ||
      level.checkpoints.some((checkpoint) => !isPoint(checkpoint)))
  ) {
    throw new Error("Level checkpoints must contain only points.");
  }

  for (const [name, items] of [
    ["platforms", level.platforms],
    ["obstacles", level.obstacles],
    ["hazards", level.hazards],
  ] as const) {
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error(`Level ${name} must contain at least one item.`);
    }
    items.forEach((item, index) => {
      assertRectangle(item, `${name}[${index}]`);
      if (
        name === "obstacles" &&
        (!("type" in item) ||
          (item.type !== "solid" && item.type !== "moving"))
      ) {
        throw new Error(`obstacles[${index}] has an invalid type.`);
      }
      if (name === "hazards" && (!("type" in item) || item.type !== "spikes")) {
        throw new Error(`hazards[${index}] has an invalid type.`);
      }
    });
  }

  if (
    start.x < bounds.x ||
    start.y < bounds.y ||
    start.x > bounds.x + bounds.width ||
    start.y > bounds.y + bounds.height
  ) {
    throw new Error("Level start must be inside level bounds.");
  }
  if (
    goal.x < bounds.x ||
    goal.y < bounds.y ||
    goal.x + goal.width > bounds.x + bounds.width ||
    goal.y + goal.height > bounds.y + bounds.height
  ) {
    throw new Error("Level goal must be inside level bounds.");
  }

  return {
    id: level.id,
    bounds: { ...bounds },
    start: { ...start },
    goal: { ...goal },
    platforms: level.platforms!.map((platform) => ({ ...platform })),
    obstacles: level.obstacles!.map((obstacle) => ({ ...obstacle })),
    hazards: level.hazards!.map((hazard) => ({ ...hazard })),
    checkpoints: level.checkpoints?.map((checkpoint) => ({ ...checkpoint })),
  };
}

export function loadLevel(data: LevelData): Level {
  return parseLevel(data);
}
