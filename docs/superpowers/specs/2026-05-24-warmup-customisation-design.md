# Customisable Warm-Up — Design Spec
*2026-05-24 — approved by Phill*

---

## Overview

Replace the existing static warm-up checklist with a two-phase flow: a setup screen where the user reviews and optionally swaps stretches, followed by a guided execution screen that steps through each stretch one at a time with a countdown timer.

The warm-up is per-workout (A, B, C each have their own configuration), appears before each workout session, and is entirely optional (the user can skip it).

---

## Design decisions

| Decision | Choice | Rationale |
|---|---|---|
| When it appears | Before each workout session (between energy check and exercises) | Natural warm-up position; one clear moment |
| Scope | Per-workout — A, B, C each have their own saved config | Push/pull/legs days target different areas |
| Default preset | Fixed sensible defaults covering all 8 groups | Lower friction; smart defaults beat blank-slate config |
| Setup screen layout | Compact rows (8 rows, all visible at once) | No scrolling; efficient pre-workout glance |
| Picker interaction | Full-screen overlay | More room; shows Sciatica / Cross-legged tags for informed choice |
| Execution mode | Guided — one stretch at a time with countdown | Hands-off; phone propped up; no tapping between stretches |

---

## Data model

### `WARMUP_GROUPS` constant

A fixed 8-element array defining the warm-up slots. Each entry:

```js
{
  id: string,          // group key, e.g. 'hips'
  label: string,       // display name, e.g. 'Hips'
  emoji: string,       // fallback icon, e.g. '🦋'
  defaultId: string,   // stretch ID used if no saved config
  options: string[],   // stretch IDs available in the picker for this group
}
```

Default assignments:

| Slot | Group | Default stretch ID |
|---|---|---|
| 0 | Neck | `str_neck_rotation` |
| 1 | Shoulders | `wu_pendulum` |
| 2 | Chest | `wu_chest_opener` |
| 3 | Trunk | `str_cat_cow_cow` |
| 4 | Lower Back | `wu_prone_cobra` |
| 5 | Hips | `str_figure_four` |
| 6 | Legs | `wu_hamstring_stretch` |
| 7 | Ankles | `str_ankle_circles` |

The `options` list for each group is a curated subset of `STRETCH_LIBRARY` filtered to stretches appropriate for that muscle area. Minimum 3 options per group.

### Storage

**Key:** `il_warmup_config`

**Shape:** `{ A: [id, id, id, id, id, id, id, id], B: [...], C: [...] }`

- An 8-element array per workout, indexed to match `WARMUP_GROUPS` order.
- A `null` entry or missing key falls back to the group's `defaultId`.
- First run (no key in localStorage) = all defaults, nothing written until the user makes a change.

---

## Session flow

**Before:** `'energy'` → `'warmup'` → `'workout'` → `'finisher'`

**After:** `'energy'` → `'warmup_setup'` → `'warmup_active'` → `'workout'` → `'finisher'`

The existing `'warmup'` phase string is replaced. `buildSession()` emits `phase: 'warmup_setup'` after the energy check.

A `warmupIndex` integer (0–7) in `ActiveWorkout` state tracks which stretch is currently active during `warmup_active`. Initialised to 0 when entering `warmup_active`.

---

## Screen 1 — Warm-Up Setup

**Phase:** `warmup_setup`

### Layout

```
┌─────────────────────────────────┐
│ Workout A · Push          [label]│
│ WARM-UP STRETCHES         [h3]  │
│ Tap any stretch to change it    │
├─────────────────────────────────┤
│ 🧠  Neck          Neck Rotation  │
│                   30s each side [Change]│
├────────────────────────────────-┤
│ 💪  Shoulders     Pendulum Swings│
│                   30s each side [Change]│
│  … (6 more rows)                │
├─────────────────────────────────┤
│  ▶ BEGIN WARM-UP  (≈8 min)      │
│    Reset to defaults · Skip     │
└─────────────────────────────────┘
```

### Row structure

Each row: `[emoji thumb] [group label / stretch name / duration] [Change button]`

- Thumb: 36×36px circle, `C.bg2` fill, emoji centred. If the stretch has a PNG icon in `assets/icons/stretches/`, show it; fall back to emoji on load error.
- Group label: 9px uppercase amber (`C.amber`)
- Stretch name: 13px semibold
- Duration: 10px muted
- Change button: small ghost button (10px, `C.muted` text, `#252525` background, 1px `#333` border, 4px radius)

### Footer

- Primary button: amber fill, "▶ BEGIN WARM-UP (≈X min)". Estimated time = sum of all selected stretch durations (in minutes, rounded to nearest minute).
- Ghost link: "Reset to defaults · Skip". "Reset to defaults" clears `il_warmup_config[workout]` and re-renders with defaults. "Skip" advances directly to `'workout'` phase.

### Behaviour

Tapping **Change** on any row opens Screen 2 (the full-screen picker) for that group. When the picker closes, the row updates immediately.

Tapping **Begin Warm-Up** saves no additional state (config is already saved on each picker selection) and advances to `warmup_active`, setting `warmupIndex = 0`.

---

## Screen 2 — Stretch Picker

**Triggered by:** tapping Change on any row in Screen 1

### Layout

Full-screen overlay (position absolute, inset 0, `C.bg` background, same border-radius as phone).

```
┌─────────────────────────────────┐
│ ← Choose stretch · Hips   [header]│
│   HIPS                          │
├─────────────────────────────────┤
│ ┌──────────────────────────────┐│
│ │🪑  Figure Four               ││  ← currently selected (amber border + ✓)
│ │    45s each side             ││
│ │    [Sciatica] [Cross-legged] ││
│ └──────────────────────────────┘│
│ ┌──────────────────────────────┐│
│ │🦢  Pigeon Pose               ││
│ │    45s each side             ││
│ │    [Sciatica] [Cross-legged] ││
│ └──────────────────────────────┘│
│  … (remaining options)          │
└─────────────────────────────────┘
```

### Card structure

Each option card:
- Background: `C.card` (unselected) / `#3a2800` (selected)
- Border: `#333` (unselected) / `C.amber` (selected)
- Icon: 40×40px rounded square, stretch PNG if available, emoji fallback
- Name: 14px semibold
- Detail: duration string, 10px muted
- Pills: Sciatica (purple `#2d1b4e` / `#a78bfa`) and Cross-legged (green `#0a2e1e` / `#34d399`) shown where applicable
- Selected card: amber ✓ icon right-aligned

### Behaviour

- Tapping a card immediately writes the new stretch ID to `il_warmup_config[workout][slotIndex]` and returns to Screen 1 (removes the overlay).
- Back arrow (←) returns to Screen 1 without making a change.
- No confirm step — selection is immediate.

---

## Screen 3 — Guided Execution

**Phase:** `warmup_active`

*Updated 2026-05-25 — timer is now manual-start; see behaviour notes below.*

### Layout

```
┌─────────────────────────────────┐
│ ● ● ◉ ○ ○ ○ ○ ○   3 of 8   Skip all →│
├─────────────────────────────────┤
│                                 │
│          [stretch icon]         │
│             HIPS                │
│         FIGURE FOUR             │
│        45 sec each side         │
│                                 │
│        ┌─────────────┐          │
│        │  countdown  │  (ring)  │
│        │    0:32     │          │
│        └─────────────┘          │
│                                 │
│  "Cross ankle over knee. Sit    │
│   tall. Press knee gently down. │
│   Feel it in the glute."        │
│                                 │
├─────────────────────────────────┤
│          ▶ START                │   ← shown when paused
│     Skip → [next group]         │
└─────────────────────────────────┘
```

### Progress dots

8 dots in a row. Completed = green (`C.green`). Active = amber (`C.amber`). Remaining = dark (`C.border`). Counter "X of 8" to the right.

### Timer ring

SVG circle, 120×120px. Track ring: `C.border`. Progress arc: `C.amber`, stroke-linecap round, rotated −90°. Countdown numeral centred in `C.fMono` 36px amber.

Duration comes from the selected stretch's `suggestedSecs` field. The ring shows full (offset=0) when paused; drains as the timer counts down (offset increases toward circumference=326.7).

### Timer start behaviour

Each stretch loads in a **paused state** — the timer does not run until the user taps **▶ Start**. This gives time to read the stretch and get into position.

**Unilateral stretches:** user taps ▶ Start → timer counts down → when it reaches 0, auto-advances to the next stretch (also paused).

**Bilateral stretches (`bilateral: true`):**
- User taps ▶ Start → side 1 counts down.
- When side 1 reaches 0: a green ✓ **Switch Sides** indicator replaces the cue text; timer resets to `suggestedSecs`; after 1.5s side 2 auto-starts (no tap required).
- When side 2 reaches 0: auto-advances to the next stretch (paused).

### Cue text

Stretch's `cue` string rendered at 12px italic `C.muted`, centred, max-width 280px. If no `cue` field, omit the element. During the side-switch window the Switch Sides indicator replaces the cue text.

### Footer — three states

**Paused (not running, not switching):**
- Primary button: amber fill, "▶ Start" — starts the timer.
- Ghost link: "Skip → [next group label]" or "Skip → Begin Workout" on the last stretch.

**Running:**
- Primary button: amber fill, "→ Next: [next group label]" — manually advances early.
- Ghost link: "Skip this stretch".

**Side-switch window (1.5s between side 1 and side 2):**
- Ghost link only: "Skip → [next group label]" — allows escaping; side 2 will auto-start when the window closes.

### Header actions

"Skip all →" in the top-right: advances directly to `'workout'` phase immediately, at any point.

---

## Colour scheme

All UI elements use the existing app theme object (`C`). No new colour values are introduced.

| Element | Value |
|---|---|
| Background | `C.bg` (`#161616`) |
| Card/row background | `C.card` (`#1e1e1e`) |
| Selected card background | `#3a2800` (existing amber-dim) |
| Accent / amber | `C.amber` (`#f5a623`) |
| Muted text | `C.muted` (`#888`) |
| Borders | `C.border` (`#2a2a2a`) |
| Body text | `C.text` (`#f0f0f0`) |
| Timer ring track | `#2a2a2a` |
| Completed dot | `#4a6` (existing green — same as PR badge) |
| Sciatica pill | `#2d1b4e` / `#a78bfa` (existing) |
| Cross-legged pill | `#0a2e1e` / `#34d399` (existing) |
| Fonts | `C.fCond` (Barlow Condensed), `C.fMono` (JetBrains Mono) |

---

## Edge cases

| Scenario | Behaviour |
|---|---|
| First run, no saved config | All defaults used; nothing written to localStorage until user makes a change |
| "Reset to defaults" tapped | Deletes `il_warmup_config[workout]`, re-renders setup with defaults |
| "Skip" tapped on setup | Phase advances directly to `'workout'`; warm-up not logged |
| "Skip all" tapped mid-execution | Phase advances directly to `'workout'` immediately |
| Last stretch completes | Side 2 (or unilateral) timer reaches 0 → auto-advances after 0.5s pause; footer shows "→ Begin Workout" while running |
| `bilateral: true` stretch | Side 1 requires manual ▶ Start; at zero a green ✓ Switch Sides indicator shows for 1.5s then side 2 auto-starts; side 2 completion auto-advances |
| Stretch has no `cue` field | Cue text element omitted; icon and timer centred in available space |
| Stretch has no PNG icon | Falls back to `group.emoji`; no broken image shown |
| Mid-session app refresh | `il_active` stores `phase` and `warmupIndex`; resumes at correct stretch |

---

## What is NOT in scope

- Reordering the 8 groups (order is fixed)
- Adding or removing groups (always 8)
- Editing stretch duration from the warm-up screens (duration comes from the stretch definition)
- Warm-up history / logging (warm-up completion is not stored in session data)
- Warm-up in the finisher phase (that remains a separate static flow)

---

## Files touched

- `src/IronLog.jsx` only
  - Add `WARMUP_GROUPS` constant (after `STRETCH_LIBRARY`)
  - Add `getWarmupConfig(workout)` helper (reads `il_warmup_config`, applies defaults)
  - Add `saveWarmupChoice(workout, slotIndex, stretchId)` helper
  - Add `WarmupSetup` component
  - Add `WarmupPicker` component
  - Add `WarmupActive` component
  - Update `ActiveWorkout`: handle `warmup_setup` and `warmup_active` phases; add `warmupIndex` state
  - Update `buildSession()`: emit `phase: 'warmup_setup'` (was `'warmup'`)
  - Remove old static warmup checklist render block

- Build: `node build.js` after every edit
- Commit: `src/IronLog.jsx` + `dist/index.html` + `index.html` + `version.json` together
