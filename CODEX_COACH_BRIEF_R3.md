# Codex Brief R3 — AI Coach, Four Blockers Resolved
*Generated 2026-05-19. Read this alongside the updated spec.*

---

## Before anything else — read CLAUDE.md

```
/Users/phillcantone/Library/Mobile Documents/com~apple~CloudDocs/Family/Phill/AI Coding/Ironlog/CLAUDE.md
```

This is the canonical session guide. Read it first, every session, without exception.

---

## All four blockers from your R2 review are resolved

The spec at `docs/superpowers/specs/2026-05-19-ai-coach-design.md` has been updated. Below is a precise account of what changed for each blocker.

---

### Blocker 1 — Spec was stale (now fixed in spec)

The spec now matches R2. Specific corrections:

- **Swap table:** `p_band_seated_row` → `band_row` (line in safe swap table)
- **Function signature:** `computeCoachRecommendation(sessions, rides, override = null)` — override parameter documented in Section 1
- **`buildSession()` return:** explicitly returns `{ ...session, phase: 'energy' }` — documented in Section 4
- **Deduplicate:** `buildSession()` deduplicates the final exercise list by ID — documented in Section 4
- **Caution injection removed:** `buildSession()` no longer injects caution strings — see Blocker 3 below

---

### Blocker 2 — `startSession()` discards the pre-built session (now fixed in spec)

**The problem:** When PreStart taps "Start Session", it sets `activeSession` with swaps applied and `phase: 'energy'`, then enters `ActiveWorkout`. The energy check screen shows. But when the user picks an energy level, `startSession()` at line 1168 calls `buildSession()` again — discarding swaps.

**The fix (now in spec Section 3 and Section 4):**

`startSession()` inside `ActiveWorkout` is modified:
- If `activeSession` already has `.exercises` (pre-built): use it as-is. Only attach the selected energy level and advance `phase` to `'warmup'`. Do **not** call `buildSession()`.
- If `activeSession` is null or has no exercises (direct launch without pre-start): call `buildSession()` as today.

This is a small, safe change. The only new branch is the `activeSession?.exercises?.length > 0` check at the top of `startSession()`.

---

### Blocker 3 — Coach cautions don't render from session exercise objects (approach changed)

**The problem:** `def.caution` at line 1441 reads from `allExercises[exId]`, not from the session exercise object. Injecting caution into `session.exercises[]` wouldn't render.

**The fix (now in spec Section 4 — "Coach caution rendering"):**

Coach modification notes are **never stored in the session**. Instead:

1. `coachRec.flags` is passed as a prop to `ActiveWorkout`.
2. `ActiveWorkout` passes a `coachFlag` prop to each `SetRow`, containing the matching flag object for that exercise (by `exerciseId`), or `null`.
3. `SetRow` renders `coachFlag.modification` as an amber note if non-null — same visual style as `def.caution` but sourced from props.

This is purely additive. No existing `SetRow` logic changes. The existing `def.caution` banner continues to work exactly as before. The coach note appears alongside it.

---

### Blocker 4 — Ephemeral cautions would have been saved to il_sessions (solved by Blocker 3)

Because coach modification notes are now passed via props rather than written into the session object, this problem does not arise. `handleComplete()` persists `activeSession` as-is — no coach data is ever in that object.

---

## Summary of spec changes

| Section | Change |
|---|---|
| Section 1 | `override = null` parameter added to function signature |
| Section 3 | "Tapping Start Session" rewritten — 5-step flow, `startSession()` modification described, caution injection removed |
| Section 4 | `buildSession()` description updated (phase: 'energy', dedupe, no caution injection) |
| Section 4 | `startSession()` modification added |
| Section 4 | "Coach caution rendering" subsection added (props-based, ephemeral) |
| Section 4 | "Unchanged" list corrected (`ActiveWorkout` and `SetRow` are now listed as modified) |
| Safe swap table | `p_band_seated_row` → `band_row` |

---

## Your task

Re-read the updated spec. Confirm:

1. Is the `startSession()` fix (check for pre-existing `activeSession.exercises` before calling `buildSession()`) correct given line 1168 in the source?
2. Is the props-based coach caution rendering approach workable — specifically, does `SetRow` receive enough context to conditionally render a `coachFlag.modification` string alongside `def.caution`?
3. Are there any remaining blockers, or is the spec now ready to implement?

**Do not write any code yet. Confirmation only.**
