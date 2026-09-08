import { describe, expect, it } from "vitest";
import { GameStateMachine, STATE_TRANSITIONS } from "../src/game/state-machine";

describe("GameStateMachine", () => {
  it("allows every transition in the transition table", () => {
    const cases = [
      ["start", "start", "playing"],
      ["playing", "pause", "paused"],
      ["paused", "resume", "playing"],
      ["playing", "fail", "gameOver"],
      ["playing", "complete", "levelCompleted"],
      ["gameOver", "restart", "playing"],
      ["levelCompleted", "restart", "playing"],
    ] as const;

    for (const [initialState, action, expectedState] of cases) {
      const machine = new GameStateMachine(initialState);
      expect(machine.transition(action)).toBe(expectedState);
      expect(machine.state).toBe(expectedState);
    }
  });

  it("rejects transitions that are not in the transition table", () => {
    const actions = ["start", "pause", "resume", "fail", "complete", "restart"] as const;

    for (const state of Object.keys(STATE_TRANSITIONS) as Array<
      keyof typeof STATE_TRANSITIONS
    >) {
      for (const action of actions) {
        const machine = new GameStateMachine(state);
        const allowed = STATE_TRANSITIONS[state][action] !== undefined;
        const before = machine.state;
        machine.transition(action);
        expect(machine.state === before).toBe(!allowed);
      }
    }
  });

  it("supports the explicit convenience methods", () => {
    const machine = new GameStateMachine();
    expect(machine.start()).toBe("playing");
    expect(machine.pause()).toBe("paused");
    expect(machine.resume()).toBe("playing");
    expect(machine.complete()).toBe("levelCompleted");
    expect(machine.restart()).toBe("playing");
  });
});
