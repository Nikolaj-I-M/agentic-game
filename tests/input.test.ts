import { describe, expect, it } from "vitest";
import { InputHandler, type ActionName } from "../src/input";

const dispatchKey = (
  type: "keydown" | "keyup",
  code: string,
  key = "",
): KeyboardEvent => {
  const event = new KeyboardEvent(type, { code, key, cancelable: true });
  window.dispatchEvent(event);
  return event;
};

describe("InputHandler", () => {
  it.each([
    ["moveLeft", "ArrowLeft", "KeyA"],
    ["moveRight", "ArrowRight", "KeyD"],
    ["jump", "Space", "ArrowUp"],
    ["pause", "Escape", "KeyP"],
  ] as const)(
    "maps primary and alternate keys to %s",
    (action: ActionName, primary: string, alternate: string) => {
      const input = new InputHandler(window);

      dispatchKey("keydown", primary);
      expect(input.isPressed(action)).toBe(true);
      dispatchKey("keyup", primary);
      expect(input.isPressed(action)).toBe(false);

      dispatchKey("keydown", alternate);
      expect(input.isPressed(action)).toBe(true);
      dispatchKey("keyup", alternate);
      expect(input.isPressed(action)).toBe(false);

      input.destroy();
    },
  );

  it("keeps an action pressed while another bound key remains held", () => {
    const input = new InputHandler(window);

    dispatchKey("keydown", "ArrowLeft");
    dispatchKey("keydown", "KeyA");
    dispatchKey("keyup", "KeyA");

    expect(input.isPressed("moveLeft")).toBe(true);

    dispatchKey("keyup", "ArrowLeft");
    expect(input.isPressed("moveLeft")).toBe(false);
    input.destroy();
  });

  it("prevents browser defaults for movement and jump keys", () => {
    const input = new InputHandler(window);

    expect(dispatchKey("keydown", "ArrowLeft").defaultPrevented).toBe(true);
    expect(dispatchKey("keydown", "Space").defaultPrevented).toBe(true);
    expect(dispatchKey("keydown", "Escape").defaultPrevented).toBe(false);

    input.destroy();
  });

  it("removes listeners and clears state on destroy", () => {
    const input = new InputHandler(window);

    dispatchKey("keydown", "ArrowRight");
    input.destroy();
    dispatchKey("keyup", "ArrowRight");
    dispatchKey("keydown", "ArrowRight");

    expect(input.isPressed("moveRight")).toBe(false);
  });

  it("does not register duplicate listeners when attached repeatedly", () => {
    const input = new InputHandler(window);

    input.attach();
    dispatchKey("keydown", "KeyD");
    dispatchKey("keyup", "KeyD");

    expect(input.isPressed("moveRight")).toBe(false);
    input.dispose();
  });
});
