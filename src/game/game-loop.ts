export interface GameLoopOptions {
  fixedStep?: number;
  maxDelta?: number;
  now?: () => number;
  requestAnimationFrame?: (callback: (timestamp: number) => void) => number;
  cancelAnimationFrame?: (handle: number) => void;
}

export type UpdateCallback = (dt: number) => void;
export type RenderCallback = () => void;

export class GameLoop {
  private readonly fixedStep: number;
  private readonly maxDelta: number;
  private readonly now: () => number;
  private readonly requestFrame: (
    callback: (timestamp: number) => void,
  ) => number;
  private readonly cancelFrame: (handle: number) => void;
  private readonly update: UpdateCallback;
  private readonly render: RenderCallback;
  private animationFrame: number | undefined;
  private lastTimestamp = 0;
  private accumulator = 0;
  private running = false;

  constructor(
    update: UpdateCallback,
    render: RenderCallback,
    options: GameLoopOptions = {},
  ) {
    this.update = update;
    this.render = render;
    this.fixedStep = options.fixedStep ?? 1 / 60;
    this.maxDelta = options.maxDelta ?? 0.25;
    this.now = options.now ?? (() => performance.now());
    this.requestFrame =
      options.requestAnimationFrame ??
      ((callback) => window.requestAnimationFrame(callback));
    this.cancelFrame =
      options.cancelAnimationFrame ??
      ((handle) => window.cancelAnimationFrame(handle));

    if (this.fixedStep <= 0 || this.maxDelta <= 0) {
      throw new Error("GameLoop timing values must be greater than zero.");
    }
  }

  start(): void {
    if (this.running) {
      return;
    }

    this.running = true;
    this.lastTimestamp = this.now();
    this.animationFrame = this.requestFrame((timestamp) =>
      this.onFrame(timestamp),
    );
  }

  stop(): void {
    if (!this.running) {
      return;
    }

    this.running = false;
    if (this.animationFrame !== undefined) {
      this.cancelFrame(this.animationFrame);
      this.animationFrame = undefined;
    }
  }

  private onFrame(timestamp: number): void {
    if (!this.running) {
      return;
    }

    const elapsed = Math.min(
      Math.max(0, (timestamp - this.lastTimestamp) / 1000),
      this.maxDelta,
    );
    this.lastTimestamp = timestamp;
    this.accumulator += elapsed;

    while (this.accumulator >= this.fixedStep) {
      this.update(this.fixedStep);
      this.accumulator -= this.fixedStep;
    }

    this.render();
    this.animationFrame = this.requestFrame((nextTimestamp) =>
      this.onFrame(nextTimestamp),
    );
  }
}
