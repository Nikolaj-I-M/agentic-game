# McSquishy Gameplay Decisions

This document is the canonical v1 decision record for gameplay details that
are intentionally left open by the product requirements. Downstream
implementation work for Player Physics, Level System, Hazards & Failure,
Level Completion, and Game States & UI should reference this document rather
than make separate assumptions.

These decisions narrow the requirements; they do not add a backend, network
dependency, or a requirement for installation.

## 1. Failure and lives

**Decision:** v1 uses a single-life failure model with no life counter.
Contact with a hazard or falling outside the playable area immediately ends
the current attempt. The player sees the failure/game-over state and can
restart Level 1 from its defined starting position.

There is no accumulated life total, damage health bar, or lives UI in v1.
Failure is an attempt reset, not a permanent game-ending condition. A restart
resets the player and all level objects to their initial state.

**Rationale:** This keeps the rules legible and supports the description's
accessible, short-level framing. It satisfies Functional Requirements §4,
which permits failing or losing a life and permits restarting from the level
beginning or a checkpoint. The failure state required by Functional
Requirements §6 is still shown before the player restarts.

## 2. Checkpoints

**Decision:** Level 1 has zero checkpoints. Every failure restarts the player
at the level's beginning; no progress is retained within the level.

**Rationale:** A short first level does not need checkpoint state, and this
keeps the single-life attempt model consistent. This is the
“restart from the beginning of the level” option explicitly allowed by
Functional Requirements §4.

## 3. Score and timer

**Decision:** v1 has no score, collectibles, countdown timer, elapsed-time
target, combo, or leaderboard. Level progress is communicated by the camera,
the finish goal, and the level-completed state.

The game must not fail the player for taking too long. The implementation may
track elapsed time internally for diagnostics, but it must not expose that
value as a gameplay objective or use it to alter success or failure.

**Rationale:** Neither the description nor the functional or technical
requirements requires scoring or timed play. Omitting these systems keeps the
first playable experience focused on movement, timing, and platforming, as
the description specifies, without contradicting any requirement.

## 4. Visual direction

**Decision:** Use a bright, high-contrast, cartoon direction:

- Base surfaces use saturated teal, blue, and warm yellow/orange accents.
- Hazards use a clearly distinct hot red/orange treatment with strong
  silhouettes; the finish goal uses green/gold so it is not confused with a
  hazard.
- Backgrounds use softer, lower-contrast cool colours so platforms and
  McSquishy remain readable.
- McSquishy is a simple rounded blob with an expressive face. Small squash
  and stretch changes on landing, jumping, and failure are preferred over
  detailed anatomy.
- Use crisp, readable shapes and short state animations for idle, run,
  jump/fall, failure, and completion. Animation should support gameplay
  feedback and remain understandable without sound.
- Art may use deliberately oversized features and unexpected colour
  combinations to preserve the playful, slightly absurd tone. These are
  directional art cues, not fixed asset dimensions or a requirement for
  external art libraries.

**Rationale:** This makes the description's “colourful, playful, and slightly
absurd” direction actionable while preserving flexibility for future assets.
Clear hazard and goal contrast also supports the required visual feedback in
Functional Requirements §7.

## 5. First playable level

**Decision:** Level 1 is a compact, linear side-scrolling course roughly
2,400 world pixels long (about three nominal 800-pixel view widths). It has
one start at the left and one clearly marked finish goal at the right. The
player should normally reach the goal in about two to four minutes on a
successful attempt, without a timer or required speed.

The course is divided into three readable sections:

1. **Introduction:** a broad starting platform, a small gap, and static
   platforms that teach walking and jumping safely.
2. **Timing:** two static spike strips and one slow horizontal moving
   platform over a pit. Safe platforms are provided before and after each
   timing challenge.
3. **Finish approach:** two staggered platforms, one wider gap, and a final
   short spike strip before the goal platform and finish marker.

The concrete hazards and obstacles for v1 are:

- platform gaps and pits; falling beyond the level bounds is failure;
- static spike strips;
- one slow horizontal moving platform over a pit;
- solid platform edges and walls used to shape the route.

There are no enemies, projectiles, disappearing platforms, or instant-kill
moving hazards in Level 1. The moving platform is the only moving obstacle.
This keeps the first level short and accessible while still covering
platforming, hazards, and timing. Exact coordinates may be chosen by the
level implementation as long as this order, approximate length, hazard set,
start, and finish remain intact.

**Rationale:** Functional Requirements §3 requires a side-scrolling level
with platforms, obstacles, hazards, a start, an end goal, and a camera that
follows the player. This layout supplies each one without adding systems not
required by the description or Technical Requirements.

## 6. Default keyboard bindings

The default bindings are:

| Action | Primary key | Alternate key |
| --- | --- | --- |
| Move left | ArrowLeft | A |
| Move right | ArrowRight | D |
| Jump | Space | ArrowUp / W |
| Pause / resume | Escape | P |

Both primary and alternate keys perform the same action. Space and the
movement keys should prevent their normal browser action while the game has
keyboard focus. Pause is available during play; Escape or P resumes from the
paused state. The start, failure, and completion screens should expose the
available restart/start action using the same keyboard-first approach, but
that action is not an additional gameplay binding in this table.

**Rationale:** The table uses the commonly recognised arrow, WASD, and Space
families named by Functional Requirements §8, and adds the conventional
Escape/P pause alternatives. It covers all four required actions without
requiring a mouse or network service.

## 7. Requirements cross-check

| Source | Constraint | Decision response |
| --- | --- | --- |
| `src/DESCRIPTION.md` | Short, accessible browser platform game focused on movement, timing, and platforming | No lives UI, checkpoints, score, timer, enemies, or complex first-level systems |
| `src/DESCRIPTION.md` | Colourful, playful, slightly absurd presentation | Bright palette, expressive blob animation, and directional absurdist art cues |
| Functional Requirements §3 | Side-scrolling level with platforms, obstacles, hazards, start, end goal, and camera follow | Three-section, approximately 2,400-pixel course with a finish marker and camera-follow route |
| Functional Requirements §4 | Hazard contact/falling causes failure; restart from start or checkpoint | Immediate single-life failure and restart from level start; zero checkpoints |
| Functional Requirements §5–6 | Completion feedback, restart after completion, and start/playing/paused/failure/completed states | Finish goal and completion state remain required; failure is an observable restartable state |
| Functional Requirements §7 | Instructions and feedback for failure, goal, and restart | Hazard/goal contrast and the defined state transitions provide the visual direction for that feedback |
| Functional Requirements §8 | Keyboard left, right, jump, and pause using familiar key families | Definitive Arrow/WASD/Space/Escape/P table |
| Technical Requirements | TypeScript, browser-only operation, no cloud dependency, separated concerns, important logic tested | This is documentation only and introduces no runtime, dependency, or architecture change |

If a future requirement conflicts with a decision here, the requirement
should be updated or this document should be revised deliberately before
implementation diverges. Until then, these values are the acceptance
baseline for the dependent issues.
