export type ActionName =
  | "moveLeft"
  | "moveRight"
  | "jump"
  | "pause"
  | "restart";

const KEY_BINDINGS: Readonly<Record<string, ActionName>> = {
  ArrowLeft: "moveLeft",
  KeyA: "moveLeft",
  a: "moveLeft",
  A: "moveLeft",
  ArrowRight: "moveRight",
  KeyD: "moveRight",
  d: "moveRight",
  D: "moveRight",
  Space: "jump",
  " ": "jump",
  Spacebar: "jump",
  ArrowUp: "jump",
  KeyW: "jump",
  w: "jump",
  W: "jump",
  Escape: "pause",
  KeyP: "pause",
  p: "pause",
  P: "pause",
  Enter: "restart",
  NumpadEnter: "restart",
  KeyR: "restart",
  r: "restart",
  R: "restart",
};

const PREVENT_DEFAULT_ACTIONS = new Set<ActionName>([
  "moveLeft",
  "moveRight",
  "jump",
]);

export class InputHandler {
  private readonly pressedKeys = new Set<string>();
  private readonly pressedActions = new Set<ActionName>();
  private attached = false;

  private readonly handleKeyDown = (event: KeyboardEvent): void => {
    const action = this.actionFor(event);
    if (!action) {
      return;
    }

    if (PREVENT_DEFAULT_ACTIONS.has(action)) {
      event.preventDefault();
    }

    const key = this.keyFor(event);
    if (this.pressedKeys.has(key)) {
      return;
    }

    this.pressedKeys.add(key);
    this.pressedActions.add(action);
  };

  private readonly handleKeyUp = (event: KeyboardEvent): void => {
    const action = this.actionFor(event);
    if (!action) {
      return;
    }

    this.pressedKeys.delete(this.keyFor(event));
    if (![...this.pressedKeys].some((key) => KEY_BINDINGS[key] === action)) {
      this.pressedActions.delete(action);
    }
  };

  constructor(private readonly target: Window = window) {
    this.attach();
  }

  isPressed(action: ActionName): boolean {
    return this.pressedActions.has(action);
  }

  attach(): void {
    if (this.attached) {
      return;
    }

    this.target.addEventListener("keydown", this.handleKeyDown);
    this.target.addEventListener("keyup", this.handleKeyUp);
    this.attached = true;
  }

  destroy(): void {
    if (!this.attached) {
      return;
    }

    this.target.removeEventListener("keydown", this.handleKeyDown);
    this.target.removeEventListener("keyup", this.handleKeyUp);
    this.pressedKeys.clear();
    this.pressedActions.clear();
    this.attached = false;
  }

  dispose(): void {
    this.destroy();
  }

  private actionFor(event: KeyboardEvent): ActionName | undefined {
    // Prefer event.code for layout-independent bindings, with key as a compatibility fallback.
    return KEY_BINDINGS[event.code] ?? KEY_BINDINGS[event.key];
  }

  private keyFor(event: KeyboardEvent): string {
    return event.code || event.key;
  }
}

export const inputScaffoldReady = true;
