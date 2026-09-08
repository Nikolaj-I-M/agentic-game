export type GameState =
  | "start"
  | "playing"
  | "paused"
  | "gameOver"
  | "levelCompleted";

export type GameStateAction =
  | "start"
  | "pause"
  | "resume"
  | "fail"
  | "complete"
  | "restart";

export const STATE_TRANSITIONS: Readonly<
  Record<GameState, Readonly<Partial<Record<GameStateAction, GameState>>>>
> = {
  start: { start: "playing" },
  playing: {
    pause: "paused",
    fail: "gameOver",
    complete: "levelCompleted",
  },
  paused: { resume: "playing" },
  gameOver: { restart: "playing" },
  levelCompleted: { restart: "playing" },
};

export class GameStateMachine {
  private currentState: GameState;

  constructor(initialState: GameState = "start") {
    this.currentState = initialState;
  }

  get state(): GameState {
    return this.currentState;
  }

  canTransition(action: GameStateAction): boolean {
    return STATE_TRANSITIONS[this.currentState][action] !== undefined;
  }

  transition(action: GameStateAction): GameState {
    const nextState = STATE_TRANSITIONS[this.currentState][action];
    if (nextState !== undefined) {
      this.currentState = nextState;
    }
    return this.currentState;
  }

  start(): GameState {
    return this.transition("start");
  }

  pause(): GameState {
    return this.transition("pause");
  }

  resume(): GameState {
    return this.transition("resume");
  }

  fail(): GameState {
    return this.transition("fail");
  }

  complete(): GameState {
    return this.transition("complete");
  }

  restart(): GameState {
    return this.transition("restart");
  }
}
