# IronLog — AI Coach & Home Screen Redesign
**Spec date:** 2026-05-19  
**Status:** Approved by Phill — ready for Codex brief  
**Phase:** 1 of N (this spec covers coach + home screen only)

---

## What This Is

A rules-based AI coach layer added to IronLog's home screen. The coach reads the last 7 days of sessions and rides, determines what to do today, flags any exercises that need modification given recent pain or fatigue signals, and offers safe swaps. The home screen is refactored to make the workout card and coach note a unified card. A new pre-start screen appears between tapping Start and the existing energy check.

Phase 2 (Supabase Edge Function + Claude API for natural language summaries, "Ask Coach" chat) is explicitly out of scope for this spec.

---

## Decisions Made

| Decision | Choice |
|---|---|
| AI approach | Rules-only now, Edge Function + Claude API in Phase 2 |
| Home screen layout | Option C — Action First (big Start button, compact coach note) |
| Safe swaps | Modifications first, with "Swap it out" option below |
| Pre-start screen | Brief review screen before energy check — not a modal |
| Architecture | Approach 2 — integrated (coach note merged into workout card, focused Dashboard refactor) |

---

## Section 1 — Rules Engine

### Location
A pure function `computeCoachRecommendation(sessions, rides)` defined near the top of `IronLog.jsx`, called once inside `App()` and stored as a derived value (not state). Recomputed on every render. Passed as a prop to `Dashboard` and `PreStartScreen`.

### Input signals (last 7 days)
| Signal | How it's read | What it triggers |
|---|---|---|
| Last completed session | Most recent item in `sessions` array | Determines next workout in A→B→C→A rotation |
| Per-exercise pain ≥ 3 | `session.exercises[].sets[].pain` | Flags that exercise with a modification note |
| Last session average RPE ≥ 8 | Average across all completed sets | Adds "high effort last time, take it steady" to coach note |
| Any ride within last 48h | `rides` array, sorted by date | Adds "rode recently" flag — specifically cautions hinge movements |
| Days since last session ≥ 4 | Date diff from last session | Adds "been a while, ease in" note |

### Output — `CoachRec` object
```js
{
  workout: 'A' | 'B' | 'C',       // recommended next workout
  headline: string,                 // e.g. "Pull Day · Back · Biceps · Hinge"
  note: string,                     // 1–2 sentence coach note
  reasons: string[],                // bullet list for "Why?" expand
  flags: [
    {
      exerciseId: string,
      exerciseName: string,
      modification: string,         // shown on pre-start screen and in-session amber banner
      swap: string | null,          // suggested replacement exercise name
      swapId: string | null         // replacement exercise ID (null = no swap button shown)
    }
  ]
}
```

### Safety rules (always applied, cannot be overridden by coach output)
- Pain ≥ 3 blocks progression nudge regardless of coach output
- Exercise `caution` strings always show their amber banner in `SetRow`
- Medical constraints in exercise data are never removed or softened by the coach
- The coach can suggest rest or modification — it cannot suggest contraindicated movements

---

## Section 2 — Home Screen (Dashboard Refactor)

### Layout (Option C — Action First)
The existing Dashboard component is refactored. Structure from top to bottom:

1. **App header** — `IRONLOG` logo + ↺ update button (unchanged)
2. **Unified workout + coach card** (refactored from existing workout card)
3. **Week strip** (new — 7-day compact row)
4. **Stats row** — Total Sessions · Sessions This Week · Rides This Week (existing, repositioned)
5. **Stretch routine accordion** (existing, unchanged)

### Unified workout + coach card
Replaces the existing selected workout card. Contains:
- `SELECTED WORKOUT` section label + A/B/C pill selector (existing behaviour preserved)
- Workout letter badge + name + exercise count + ▾ expand-to-see-exercises (existing behaviour preserved)
- Coach note panel (new):
  - Blue `#F0F4FF` background panel
  - 🤖 icon + 1–2 sentence coach note
  - "Why? ›" link — tapping toggles inline expansion showing `reasons[]` bullets
  - "Safe Swaps ›" link — only visible when `flags.length > 0`, navigates to pre-start screen
  - Amber flag pill(s) — one per flagged exercise, shown between workout row and coach note
- **▷ Start Workout [X]** primary button (existing, full width)

### Week strip (new component)
7 cells, one per day of current week (Mon–Sun). Each cell shows:
- Day letter (M/T/W/T/F/S/S)
- Content: workout letter (A/B/C) + ✓ if completed, 🚴 + ✓ if ride, `–` if rest, today highlighted in blue
- Derived from `sessions` and `rides` arrays — no new state

### "Why?" expand behaviour
- Controlled by `showWhy` boolean state (default false, resets when `coachRec.workout` changes)
- Expands inline within the unified card — not a modal
- Shows `reasons[]` as bullet list with ✕ close link
- Card expands in place (grows downward); Start button stays at the bottom of the card and remains reachable by scrolling

---

## Section 3 — Pre-Start Screen

### When it appears
Triggered by tapping **▷ Start Workout [X]** on the home screen. Sets `currentView = 'preStart'`. The existing energy check, warmup, and session flow are unchanged — pre-start is inserted before them.

### Session flow
```
Home (tap Start) → PreStartScreen → Energy check → Warmup → Exercises → Finisher → Done
```

### Screen contents
- Back arrow (returns to `'dashboard'`)
- Workout badge: letter + name + exercise count
- **If `flags.length > 0`:** "TODAY'S ADJUSTMENTS" section label + one flag row per flagged exercise
- **If `flags.length === 0`:** Green "All clear" card — "Good recovery since last session. No modifications needed."
- **▷ Start Session** primary button

### Flag row (per flagged exercise)
- Exercise name
- Modification note (amber left border)
- "⇄ Swap it out" button — only shown if `flag.swapId !== null`

### Swap behaviour
- Tapping "⇄ Swap it out" updates `preStartSwaps[exerciseId] = swapId`
- Flag row changes to blue (swapped state): shows "⇄ Swapped → [replacement name]" + brief rationale + "↩ Undo swap" button
- Multiple exercises can be swapped independently

### Tapping "Start Session" (with or without swaps)
- `buildSession()` is called
- Any `preStartSwaps` entries replace the original exercise IDs in the session
- Modification notes from `coachRec.flags` are injected as `caution` strings on flagged exercises (shows as amber banner during workout — existing mechanism)
- `preStartSwaps` is cleared
- `activeSession` is set with the built session, `currentView` advances to `'workout'` — the energy check phase inside `ActiveWorkout` runs as normal

---

## Section 4 — Data Model Changes

### New state in `App()`
| Variable | Type | Purpose | Persisted? |
|---|---|---|---|
| `showWhy` | boolean | "Why?" expand/collapse | No |
| `preStartSwaps` | `{ [exerciseId]: replacementExerciseId }` | Tracks swaps on pre-start screen | No |

### New view state value
`currentView` gains: `'preStart'`

### New exercise field (optional)
```js
safeSwap: 'hip_thrust'  // ID of suggested replacement — omit or null = no swap button shown
```
Added to exercises that have a natural conservative alternative. Does not affect any existing behaviour if absent.

### Modified functions
- `buildSession()` — applies `preStartSwaps` before building, injects `caution` strings from coach flags
- `Dashboard` component — refactored to unified card + week strip
- `App()` — adds `computeCoachRecommendation()` call, new state vars, `'preStart'` view handling

### Unchanged
- All localStorage keys and their shapes
- `detectPRs()`, `progressiveOverloadNudge()`, history, Supabase sync
- `ActiveWorkout`, `SetRow`, `History`, `Progress`, `Rides`, `Manage` components
- The existing energy check, warmup, finisher flows

---

## Out of Scope (Phase 2)
- Supabase Edge Function for AI-generated coach text
- Claude API integration
- "Ask Coach" chat interface
- Sleep/CPAP import and insight layer
- Body tracking (weight, waist)
- Apple Health import

---

## Safe Swap Definitions (starter set)
To be expanded — initial set covering exercises most likely to be flagged:

| Exercise flagged | Suggested swap | Rationale |
|---|---|---|
| Romanian Deadlift (`rdl`) | Hip Thrust (`hip_thrust`) | Removes hinge load, keeps glutes |
| KB Deadlift (`kb_deadlift`) | Hip Thrust (`hip_thrust`) | Same — conservative on back |
| Barbell Bent-Over Row (`p_bb_row`) | Chest-Supported DB Row (`cs_db_row`) | Removes spinal load |
| Chin-Up (`chin_up`) | Band Seated Row (`p_band_seated_row`) | If shoulders are sore |
| Goblet Squat (`goblet_squat`) | Reverse Lunge (`reverse_lunge`) | Lower spinal load option |
