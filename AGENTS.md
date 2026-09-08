# Agentic Game Development

## Local development

From the repository root:

```sh
npm install
npm run dev
```

Use the other scripts to validate changes:

```sh
npm run build
npm test
npm run typecheck
```

The game is a browser-only TypeScript application. It has no backend or cloud
runtime dependency, and the generated `dist/` directory is a static build.

## Source layout

- `src/main.ts` is the browser entry point.
- `src/game/` contains game rules and state.
- `src/render/` contains canvas rendering.
- `src/input/` contains keyboard and other input handling.
- `src/levels/` contains level definitions.
- `tests/` contains automated tests.

Keep these responsibilities separate as gameplay is added. The existing
requirements documents remain in `src/` alongside these application folders.