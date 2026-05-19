# Codex Brief — AI Coach & Home Screen Redesign
*Generated 2026-05-19. Read this before doing anything else.*

---

## Before anything else — read CLAUDE.md

```
/Users/phillcantone/Library/Mobile Documents/com~apple~CloudDocs/Family/Phill/AI Coding/Ironlog/CLAUDE.md
```

This is the canonical session guide for all agents working on this project. It contains the correct file paths, the document map, multi-agent working rules, and the build process. **Read it first, every session, without exception.**

---

## Your task for this session: REVIEW ONLY — no code

Read the spec below and the relevant parts of `src/IronLog.jsx`, then provide written feedback on:

1. **Is the plan sound?** Any logical gaps, missing edge cases, or safety concerns?
2. **Is the implementation approach correct?** Any places where the spec assumes something about the existing code that isn't true?
3. **Anything that would be harder than expected?** Flag specific line numbers or code patterns that complicate the approach.
4. **Anything missing from the spec?** Things that will need to be decided before implementation that aren't covered yet.

**Do not write any code. Do not modify any files. Feedback only.**

---

## Project context

IronLog is a single-file React 18 PWA for personal workout logging.

- **Source:** `src/IronLog.jsx` — the only file ever edited
- **Build:** `node build.js` → `dist/index.html` (self-contained, no bundler)
- **Stack:** Plain JSX, no TypeScript, no separate component files
- **Storage:** `localStorage` (primary) + Supabase REST (cloud sync)
- **Deployed:** GitHub Pages via `lord-buttock/ironlog`

Read `README.md` for full architecture, user profile, and medical constraints before reviewing the spec. The medical constraints are hard rules — any feedback touching exercise suggestions must respect them.

---

## The spec to review

Full spec: `docs/superpowers/specs/2026-05-19-ai-coach-design.md`

Summary of what is being built:

### Rules engine (`computeCoachRecommendation`)
A pure function added near the top of `IronLog.jsx`. Reads `sessions` and `rides` arrays (last 7 days), returns a `CoachRec` object with:
- `workout` — next A/B/C in rotation
- `note` — 1–2 sentence coach note
- `reasons[]` — bullet list for "Why?" expand
- `flags[]` — per-exercise modifications and optional safe swap IDs

Signals it reads:
- Last completed session → next workout rotation
- Pain ≥ 3 on any exercise in last session → flags that exercise
- Average RPE ≥ 8 last session → "high effort" note
- Any ride within last 48h → cautions hinge movements
- Days since last session ≥ 4 → "been a while, ease in" note

### Home screen (Dashboard refactor)
The existing workout card is refactored into a unified workout + coach card containing:
- Existing A/B/C selector + workout letter/name/expand (unchanged behaviour)
- New coach note panel (blue `#F0F4FF` background, 🤖 icon, 1–2 sentence note)
- Amber flag pill(s) per flagged exercise
- "Why? ›" inline expand (new `showWhy` state)
- "Safe Swaps ›" link (only when flags exist) → navigates to pre-start screen
- Existing ▷ Start Workout button (unchanged)

Below the unified card: new 7-day week strip (derived from sessions/rides, no new state), then existing stats row and stretch accordion.

### Pre-start screen (new view state `'preStart'`)
Inserted between tapping Start on home and the existing energy check inside `ActiveWorkout`.

Flow: `'dashboard'` → tap Start → `'preStart'` → tap Start Session → sets `activeSession`, advances to `'workout'` (existing energy check resumes normally inside `ActiveWorkout`)

Contents:
- Back arrow → returns to `'dashboard'`
- Workout badge
- If flags: "TODAY'S ADJUSTMENTS" — one flag row per exercise with modification note + optional "⇄ Swap it out" button
- If no flags: green "All clear" card
- ▷ Start Session button

### Swap behaviour
`preStartSwaps` state: `{ [exerciseId]: replacementExerciseId }` — ephemeral, cleared on session start.

Tapping "⇄ Swap it out" updates `preStartSwaps`. On Start Session:
- `buildSession()` applies swaps (replaces exercise IDs)
- Modification notes from flags are injected as `caution` strings on flagged exercises → existing amber banner in `SetRow` displays them during the workout

### New optional exercise field
```js
safeSwap: 'hip_thrust'  // ID of suggested replacement — omit = no swap button
```

### New state variables
| Variable | Type | Persisted? |
|---|---|---|
| `showWhy` | boolean | No |
| `preStartSwaps` | `{ [exerciseId]: string }` | No |

### Nothing else changes
`detectPRs`, `progressiveOverloadNudge`, `History`, `Progress`, `Rides`, `Manage`, `ActiveWorkout`, `SetRow`, all localStorage keys — untouched.

---

## Key areas of `src/IronLog.jsx` to inspect before giving feedback

Focus your review on these specific areas:

1. **Dashboard component** — how it currently renders the workout card, A/B/C selector, stats row, stretch accordion. The spec refactors this component.

2. **`buildSession()` function** — how it constructs the active session object. The spec modifies it to apply swaps and inject `caution` strings.

3. **`currentView` state and its render switch** — how view transitions work. The spec adds `'preStart'` as a new value.

4. **The `caution` field on exercises** — Priority 5 in ROADMAP.md says this was implemented 2026-05-18. Confirm it exists in `SetRow` and how it's currently used — the spec depends on injecting caution strings from the coach into this field at session-build time.

5. **Session data shape** — specifically `session.exercises[].sets[].pain` and the RPE field name — confirm the exact field names the rules engine will read.

6. **`rides` array shape** — confirm what fields a ride object has (particularly the date field name) so the "ride within 48h" check can be written correctly.

---

## What good feedback looks like

Structure your response as:

### Plan assessment
Is the overall approach correct for this codebase? Any structural concerns?

### Implementation risks
Specific line numbers or code patterns that complicate the spec. Be precise.

### Missing decisions
Things the spec doesn't cover that will need to be resolved before or during implementation.

### Suggested changes to the spec
Anything you'd change, add, or remove before implementation begins.

### Ready to implement?
A clear yes/no — and if no, what needs to be resolved first.

---

## Do not touch

- `assets/anatomy/` — fully complete
- `MuscleDiagram` component — complete
- `MUSCLE_META` — complete
- Any existing localStorage keys or their shapes
- `dist/index.html` — never edit directly, always rebuild via `node build.js`
