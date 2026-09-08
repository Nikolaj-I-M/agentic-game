import type { GameState } from "../game/state-machine";

export interface GameUi {
  render(state: GameState): void;
  destroy(): void;
}

const OVERLAY_CONTENT: Readonly<
  Record<Exclude<GameState, "playing">, { title: string; message: string; action: string }>
> = {
  start: {
    title: "McSquishy: Blob on the Run",
    message: "Reach the green goal and avoid the red hazards.",
    action: "Start Game",
  },
  paused: {
    title: "Paused",
    message: "Press Escape or P to resume.",
    action: "",
  },
  gameOver: {
    title: "Game Over",
    message: "The blob got squished. Press R or Enter to restart.",
    action: "Restart",
  },
  levelCompleted: {
    title: "Level Completed",
    message: "You reached the goal. Press R or Enter to play again.",
    action: "Play Again",
  },
};

export function createGameUi(
  container: HTMLElement,
  onStart: () => void,
  onRestart: () => void,
): GameUi {
  const overlays = new Map<GameState, HTMLDivElement>();

  for (const state of ["start", "paused", "gameOver", "levelCompleted"] as const) {
    const content = OVERLAY_CONTENT[state];
    const overlay = document.createElement("div");
    overlay.className = "game-overlay";
    overlay.dataset.state = state;
    overlay.hidden = true;

    const title = document.createElement("h1");
    title.textContent = content.title;
    overlay.append(title);

    const message = document.createElement("p");
    message.textContent = content.message;
    overlay.append(message);

    if (content.action) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = content.action;
      button.addEventListener("click", state === "start" ? onStart : onRestart);
      overlay.append(button);
    }

    container.append(overlay);
    overlays.set(state, overlay);
  }

  return {
    render(state) {
      for (const [overlayState, overlay] of overlays) {
        overlay.hidden = overlayState !== state;
      }
    },
    destroy() {
      for (const overlay of overlays.values()) {
        overlay.remove();
      }
      overlays.clear();
    },
  };
}
