# Customisable Stretch Routine — Design Spec
*2026-05-26 — approved by Phill*

---

## Overview

Replace the static full-body flexibility routine with the same three-screen flow used by the warm-up: a **Setup screen** where the user reviews and optionally swaps stretches, a **Picker overlay** for choosing an alternative, and a **Guided execution screen** with a countdown timer.

The routine is standalone (accessed from the Dashboard, not tied to a workout session). There is a single config shared across all workout days.

---

## Design decisions

| Decision | Choice | Rationale |
|---|---|---|
| Entry point | Dashboard card → "Start Stretching" button | Accordion removed; setup screen replaces it |
| Number of slots | 12 (matching current STRETCHES order) | Preserves existing routine structure |
| Scope | Single config (not per-workout) | Stretch routine is the same regardless of workout day |
| Setup screen | Same compact-row layout as WarmupSetup | Consistent UX, zero learning curve |
| Picker | Full-screen overlay, identical to WarmupPicker | More room; Sciatica/Cross-legged pills visible |
| Execution | Same guided mode as WarmupActive — manual ▶ Start, countdown ring | Hands-off; consistent with warm-up experience |
| Bilateral | Side 1 manual start → green ✓ Switch Sides 1.5s → side 2 auto-starts | Same as warm-up |
| Duration estimate | Computed live from selected stretch suggestedSecs (bilateral × 2) | Stays accurate when user changes stretches |

---

## Data model

### `STRETCH_GROUPS` constant

A fixed 12-element array defining the routine slots. Each entry:

```js
{
  id: string,          // group key, e.g. 'hips'
  label: string,       // display name, e.g. 'Hips / Glutes'
  emoji: string,       // fallback icon
  defaultId: string,   // stretch ID used if no saved config
  options: string[],   // stretch IDs available in the picker for this group
}
```

Default assignments:

| Slot | Group | Default stretch ID |
|---|---|---|
| 0 | Neck | `str_neck` |
| 1 | Shoulders | `str_cross_shoulder` |
| 2 | Chest | `str_pec_roller_t` |
| 3 | Upper Back | `str_upper_back_roller` |
| 4 | Trunk | `str_cat_cow_cow` |
| 5 | Lower Back | `str_childs_pose` |
| 6 | Spine / Rotation | `str_spinal_rotation` |
| 7 | Hip Flexors | `str_hip_flexor` |
| 8 | Hips / Glutes | `str_figure_four` |
| 9 | Hamstrings | `str_hamstring` |
| 10 | IT Band | `str_it_band` |
| 11 | Calves / Ankles | `str_calf_straight` |

Options per group:

| Slot | Group | Options |
|---|---|---|
| 0 | Neck | `str_neck`, `str_neck_rotation` |
| 1 | Shoulders | `str_cross_shoulder`, `str_overhead_triceps`, `wu_pendulum` |
| 2 | Chest | `str_pec_roller_t`, `wu_chest_opener`, `str_upward_dog`, `str_biceps_wall` |
| 3 | Upper Back | `str_upper_back_roller`, `wu_prone_cobra` |
| 4 | Trunk | `str_cat_cow_cow`, `str_sideways_bend`, `str_pilates_saw` |
| 5 | Lower Back | `str_childs_pose`, `str_knee_to_chest`, `str_double_knee_chest`, `str_lying_spine_twist` |
| 6 | Spine / Rotation | `str_spinal_rotation`, `str_lower_trunk_rotations`, `str_pilates_saw` |
| 7 | Hip Flexors | `str_hip_flexor`, `str_90_90_hip`, `str_lateral_lunge`, `str_deep_squat` |
| 8 | Hips / Glutes | `str_figure_four`, `str_pigeon`, `str_piriformis_seated`, `str_butterfly`, `str_knee_opp_shoulder` |
| 9 | Hamstrings | `str_hamstring`, `wu_hamstring_stretch`, `str_forward_fold`, `str_sciatic_nerve_glide` |
| 10 | IT Band | `str_it_band`, `str_lateral_lunge` |
| 11 | Calves / Ankles | `str_calf_straight`, `str_ankle_circles`, `str_ankle_dorsiflexion` |

Slots 8 (Hips / Glutes) and 9 (Hamstrings) intentionally carry the richest option lists.

### Storage

**Key:** `il_stretch_config`

**Shape:** `[id, id, id, id, id, id, id, id, id, id, id, id]`

- A 12-element array indexed to match `STRETCH_GROUPS` order.
- A `null` entry or missing key falls back to the group's `defaultId`.
- First run (no key in localStorage) = all defaults, nothing written until the user makes a change.

---

## Navigation & flow

**Dashboard card** (simplified — accordion removed):

```
┌─────────────────────────────────┐
│ STRETCH ROUTINE          [label]│
│ Full-Body Flexibility    [h3]   │
│ 12 stretches · ≈13 min  [muted] │
│  [ Start Stretching → ]         │
└─────────────────────────────────┘
```

Duration estimate is computed live: sum of each selected stretch's `suggestedSecs`, with bilateral stretches counted twice.

**View values** (App-level `view` state):

- `'stretch_setup'` → StretchSetup screen
- `'stretch_active'` → StretchActive screen
- `'stretch'` (legacy) → aliased to `'stretch_setup'` for backward compatibility

**`stretchIndex`** integer (0–11) lives in App state. Reset to 0 when entering `stretch_setup`.

---

## Screen 1 — Stretch Setup

**View:** `stretch_setup`

### Layout

```
┌─────────────────────────────────┐
│ FULL-BODY FLEXIBILITY     [h3]  │
│ Tap any stretch to change it    │
├─────────────────────────────────┤
│ 🧠  Neck          Neck Side Stretch  │
│                   30s each side [Change]│
│ 💪  Shoulders     Cross-Body Shoulder │
│                   30s each side [Change]│
│  … (10 more rows)               │
├─────────────────────────────────┤
│  ▶ BEGIN STRETCHING  (≈13 min)  │
│    Reset to defaults · Skip     │
└─────────────────────────────────┘
```

### Row structure

Each row: `[emoji thumb] [group label / stretch name / duration] [Change button]`

- Thumb: 36×36px circle, `C.bg2` fill, emoji centred. PNG from `assets/icons/stretches/` if available; emoji fallback on error.
- Group label: 9px uppercase amber (`C.amber`)
- Stretch name: 13px semibold
- Duration: 10px muted (e.g. "30s each side" for bilateral, "60s" for unilateral)
- Change button: small ghost button (10px, `C.muted` text, `#252525` background, 1px `#333` border, 4px radius)

### Footer

- Primary button: amber fill, "▶ BEGIN STRETCHING (≈X min)"
- Ghost link: "Reset to defaults · Skip"
  - "Reset to defaults" → calls `resetStretchConfig()`, re-renders with defaults
  - "Skip" → sets `view = 'dashboard'`

### Behaviour

Tapping **Change** opens StretchPicker for that slot. When picker closes, row updates immediately.

Tapping **Begin Stretching** sets `stretchIndex = 0` and `view = 'stretch_active'`.

---

## Screen 2 — Stretch Picker

**Triggered by:** tapping Change on any row in StretchSetup

Full-screen overlay (position absolute, inset 0, `C.bg` background). Identical layout and behaviour to WarmupPicker.

### Layout

```
┌─────────────────────────────────┐
│ ← Choose stretch · Hips   [header]│
│   HIPS / GLUTES                 │
├─────────────────────────────────┤
│ ┌──────────────────────────────┐│
│ │🪑  Figure Four               ││  ← currently selected (amber border + ✓)
│ │    45s each side             ││
│ │    [Sciatica] [Cross-legged] ││
│ └──────────────────────────────┘│
│  … (remaining options)          │
└─────────────────────────────────┘
```

### Card structure

- Background: `C.card` (unselected) / `#3a2800` (selected)
- Border: `#333` (unselected) / `C.amber` (selected)
- Icon: 40×40px rounded square, stretch PNG if available, emoji fallback
- Name: 14px semibold
- Detail: duration string, 10px muted
- Pills: Sciatica (purple) and Cross-legged (green) shown where applicable
- Selected card: amber ✓ right-aligned

### Behaviour

- Tapping a card immediately writes the new stretch ID to `il_stretch_config[slotIndex]` and closes the overlay (returns to StretchSetup).
- Back arrow (←) returns to StretchSetup without making a change.
- No confirm step — selection is immediate.

---

## Screen 3 — Guided Execution

**View:** `stretch_active`

Identical to WarmupActive scaled to 12 slots.

### Layout

```
┌─────────────────────────────────┐
│ ● ● ◉ ○ ○ ○ ○ ○ ○ ○ ○ ○  3/12  Skip all →│
├─────────────────────────────────┤
│                                 │
│          [stretch icon]         │
│           HIPS / GLUTES         │
│           FIGURE FOUR           │
│          45 sec each side       │
│                                 │
│        ┌─────────────┐          │
│        │  countdown  │  (ring)  │
│        │    0:45     │          │
│        └─────────────┘          │
│                                 │
│  "Cross ankle over knee..."     │
│                                 │
├─────────────────────────────────┤
│          ▶ START                │
│     Skip → [next group label]   │
└─────────────────────────────────┘
```

### Progress dots

12 dots in a row. Completed = green (`C.green`). Active = amber (`C.amber`). Remaining = dark (`C.border`). Counter "X / 12" to the right.

### Timer ring

SVG circle, 120×120px. Track: `C.border`. Arc: `C.amber`, stroke-linecap round, rotated −90°. Countdown numeral centred, `C.fMono` 36px amber. Duration from selected stretch's `suggestedSecs`. Ring shows full when paused; drains as timer counts down.

### Timer start behaviour

Each stretch loads **paused** — timer does not run until user taps ▶ Start.

**Unilateral stretches:** ▶ Start → countdown → at zero, auto-advance to next stretch (paused).

**Bilateral stretches (`bilateral: true`):**
- ▶ Start → side 1 counts down.
- At zero: green ✓ Switch Sides indicator replaces cue text; timer resets to `suggestedSecs`; after 1.5s side 2 auto-starts.
- Side 2 at zero: auto-advance to next stretch (paused).

### Cue text

Stretch's `cue` string, 12px italic `C.muted`, centred, max-width 280px. During Switch Sides window, replaced by the green ✓ indicator.

### Footer — three states

**Paused:**
- Primary: amber "▶ Start"
- Ghost: "Skip → [next group label]" or "Skip → Finish" on last stretch

**Running:**
- Primary: amber "→ Next: [next group label]" (manual advance)
- Ghost: "Skip this stretch"

**Switch Sides window (1.5s):**
- Ghost only: "Skip → [next group label]"

### Header

"Skip all →" top-right: sets `view = 'dashboard'` immediately.

### Completion

Last stretch side 2 (or unilateral) at zero → 0.5s pause → `view = 'dashboard'`.

---

## Colour scheme

All existing theme values — no new colours introduced.

| Element | Value |
|---|---|
| Background | `C.bg` (`#161616`) |
| Card/row background | `C.card` (`#1e1e1e`) |
| Selected card | `#3a2800` |
| Accent / amber | `C.amber` (`#f5a623`) |
| Muted text | `C.muted` (`#888`) |
| Borders | `C.border` (`#2a2a2a`) |
| Body text | `C.text` (`#f0f0f0`) |
| Completed dot | `#4a6` |
| Sciatica pill | `#2d1b4e` / `#a78bfa` |
| Cross-legged pill | `#0a2e1e` / `#34d399` |

---

## Edge cases

| Scenario | Behaviour |
|---|---|
| First run, no saved config | All defaults used; nothing written until user makes a change |
| "Reset to defaults" tapped | Deletes `il_stretch_config`, re-renders setup with defaults |
| "Skip" on setup | `view = 'dashboard'` |
| "Skip all →" mid-execution | `view = 'dashboard'` immediately |
| Last stretch completes | Auto-advance after 0.5s → `view = 'dashboard'` |
| Bilateral stretch | Side 1 manual start; Switch Sides 1.5s; side 2 auto-starts |
| No `cue` field | Cue text element omitted |
| No PNG icon | Falls back to `group.emoji` |
| `view = 'stretch'` (legacy) | Treated as `'stretch_setup'` |
| `str_lying_spine_twist` or `str_pigeon` selected | These carry `caution: true` in STRETCH_LIBRARY; StretchPicker renders their caution pill; the existing caution pill style from WarmupPicker is reused |

---

## What is NOT in scope

- Reordering the 12 slots (order is fixed)
- Adding or removing slots
- Editing stretch duration (comes from stretch definition)
- Stretch history / logging
- Per-workout stretch configs

---

## Files touched

- `src/IronLog.jsx` only
  - Add `STRETCH_GROUPS` constant (after `WARMUP_GROUPS`)
  - Add `getStretchConfig()` helper
  - Add `saveStretchChoice(slotIndex, stretchId)` helper
  - Add `resetStretchConfig()` helper
  - Add `StretchSetup` component
  - Add `StretchPicker` component
  - Rewrite `ActiveStretch` → `StretchActive` component
  - Update Dashboard: remove accordion (`showStretches` state, `stretchDemoItem` state, full stretch list render, demo lightbox); simplify card to title + duration + single button
  - Update App: add `stretchIndex` state; handle `view === 'stretch_setup'` and `view === 'stretch_active'`; alias `view === 'stretch'` → `'stretch_setup'`

- Build: `node build.js` after every edit
- Commit: `src/IronLog.jsx` + `dist/index.html` + `index.html` + `version.json` together
