# Stretch Library Tab — Design Spec
*2026-05-22*

## Overview

Add a **Stretches** sub-tab to the Library section of the Manage screen, alongside the existing **Exercises** sub-tab. The Exercises tab is unchanged. The Stretches tab shows a flat, curated list of 19 items drawn from the full-body flexibility routine, the warm-up routine, and the workout finishers — with the same expandable card treatment as exercises: image, muscle diagram, highlighted muscles, and form cue.

---

## Scope

- **In scope:** New inner sub-tabs within the Library tab; `STRETCH_LIBRARY` data array; `STRETCH_MUSCLE_META` mapping; stretch card UI in the Manage component.
- **Out of scope:** Changes to the existing ActiveStretch flow, Dashboard stretch section, warm-up/finisher modals, or any other screen.

---

## Data

### `STRETCH_LIBRARY` array

A new top-level constant placed after the existing `STRETCHES` array. Combines and normalises all 19 curated items into a consistent shape.

**Shape of each item:**
```js
{
  id:           string,           // primary image id (also used as muscle meta key)
  id2:          string | null,    // second image id for dual-pose stretches
  name:         string,
  targets:      string,           // human-readable muscle/area string
  cue:          string,           // form instruction
  bilateral:    boolean,
  suggestedSecs: number,          // hold time in seconds
  imageDir:     'stretches' | 'warmup',  // omitted for STRETCHES items (defaults to 'stretches')
}
```

**Sources:**
- All 12 items from the existing `STRETCHES` array (spread in, no change to their shape — `imageDir` defaults to `'stretches'` when absent).
- 5 items from the warm-up routine (`imageDir: 'warmup'`):
  - `wu_cat_cow` — Cat-Cow
  - `wu_prone_cobra` — Prone Cobra
  - `wu_hamstring_stretch` — Lying Hamstring Stretch
  - `wu_chest_opener` — Doorframe Chest & Shoulder Opener
  - `wu_pendulum` — Pendulum Swings
- 2 items from workout finishers (`imageDir: 'warmup'`):
  - `fin_ham_floss` — Hamstring Floss
  - `fin_childs_pose` — Child's Pose Breathing

**Excluded from warm-up:** `wu_stepper` (cardio), `wu_pull_aparts` (activation), `wu_glute_bridge` (activation).

**Excluded from finishers:** `fin_wall_slides`, `fin_pull_aparts`, `fin_ext_rotation`, `fin_single_leg` (all exercises, not stretches).

### `STRETCH_MUSCLE_META` object

Maps each stretch item's primary `id` to `[primaryMuscle, secondaryMuscle | null]`, using only names present in `DISPLAY_TO_SVG_IDS`. Placed immediately after `STRETCH_LIBRARY`.

| id | Primary | Secondary |
|---|---|---|
| `str_neck` | Upper Traps | — |
| `str_cross_shoulder` | Rear Delts | Mid Traps |
| `str_pec_roller_t` | Chest | Front Delts |
| `str_upper_back_roller` | Mid Traps | Spinal Erectors |
| `str_cat_cow_cow` | Spinal Erectors | Abs |
| `str_childs_pose` | Lats | Spinal Erectors |
| `str_spinal_rotation` | Obliques | Spinal Erectors |
| `str_hip_flexor` | Quads | — |
| `str_figure_four` | Glutes | — |
| `str_hamstring` | Hamstrings | Spinal Erectors |
| `str_it_band` | Glutes | — |
| `str_calf_straight` | Calves | — |
| `wu_cat_cow` | Spinal Erectors | Abs |
| `wu_prone_cobra` | Spinal Erectors | Abs |
| `wu_hamstring_stretch` | Hamstrings | Spinal Erectors |
| `wu_chest_opener` | Chest | Front Delts |
| `wu_pendulum` | Rear Delts | — |
| `fin_ham_floss` | Hamstrings | Spinal Erectors |
| `fin_childs_pose` | Lats | Spinal Erectors |

### `applyStretchMeta()` function

A short helper (mirrors `applyMuscleMeta`) that iterates `STRETCH_LIBRARY` and sets `item.primary` and `item.secondary` from `STRETCH_MUSCLE_META`. Called once at module level so the data is ready before any render.

```js
function applyStretchMeta() {
  STRETCH_LIBRARY.forEach(s => {
    const [p, sec] = STRETCH_MUSCLE_META[s.id] || [null, null];
    s.primary   = p   ? [p]   : [];
    s.secondary = sec ? [sec] : [];
  });
}
applyStretchMeta();
```

---

## UI — Manage component

### Inner sub-tabs

Inside the Library tab, above the existing search/filter bar, add two pill-style sub-tabs:

```
[ Exercises ]  [ Stretches ]
```

Styled consistently with existing pill buttons (`C.amber` background when active, `C.dim` when inactive). Controlled by a new `useState('exercises')` inside `Manage` (e.g. `librarySubTab`).

When `librarySubTab === 'exercises'`: render existing Library content exactly as-is (search, muscle filters, exercise cards, create custom).

When `librarySubTab === 'stretches'`: render the stretch list (no search, no filter pills — 19 items scrolls trivially).

### Stretch card — collapsed state

```
[ 40px image ]  Name
                targets string            [ Both sides ]
```

- Image path: `` `assets/icons/${s.imageDir || 'stretches'}/${s.id}.png` ``
- `onError`: hide image gracefully (same pattern as existing warmup icons)
- "Both sides" amber pill shown when `s.bilateral === true`
- Tapping the card toggles expanded state (same `expandedLib`-style pattern, using `expandedStretch` state variable)

### Stretch card — expanded state

Reveals below the header row:

1. **Image(s):** If `s.id2` exists, show two images side-by-side (each ~140 px wide, labelled underneath if needed — matching the existing `ActiveStretch` dual-image pattern). If no `id2`, show one image (~180 px).
2. **MuscleDiagram:** `<MuscleDiagram primary={s.primary} secondary={s.secondary} size="medium" />`
3. **Muscle pills:** Primary (amber) and secondary (blue) pills, same style as exercise cards.
4. **Hold time:** e.g. `30s each side` or `60s` — derived from `s.suggestedSecs` and `s.bilateral`.
5. **Cue text:** `s.cue` in the same muted mono style as exercise form cues.

No "Add to Workout" button. No demo link. Stretches are reference-only in the library.

---

## Image assets

All required assets already exist:

- `assets/icons/stretches/str_*.png` — all 12 STRETCHES items (including dual-pose: `str_pec_roller_t`, `str_pec_roller_w`, `str_cat_cow_cow`, `str_cat_cow_cat`, `str_calf_straight`, `str_calf_bent`)
- `assets/icons/warmup/wu_cat_cow.png`, `wu_prone_cobra.png`, `wu_hamstring_stretch.png`, `wu_chest_opener.png`, `wu_pendulum.png`
- `assets/icons/warmup/fin_ham_floss.png`, `fin_childs_pose.png`

No new image generation needed.

---

## Files changed

| File | Change |
|---|---|
| `src/IronLog.jsx` | Add `STRETCH_LIBRARY`, `STRETCH_MUSCLE_META`, `applyStretchMeta()`. Modify `Manage` component: add `librarySubTab` state, inner sub-tab buttons, stretch card render block. |
| `dist/index.html` | Rebuilt output |
| `index.html` | Rebuilt output |
| `version.json` | Bumped |

No new files. No schema changes. No Supabase changes.

---

## Edge cases

- **Missing image:** `onError` hides the `<img>` (existing pattern, already used for warmup icons throughout the app).
- **Hip flexors / IT band / Rotator cuff / Neck:** Not present in `DISPLAY_TO_SVG_IDS`. The closest available muscle is used (Quads for hip flexor, Glutes for IT band, Rear Delts for rotator cuff, Upper Traps for neck). These are noted in the spec; no change to the SVG anatomy files.
- **Dual-pose stretches:** `id2` is present on three STRETCHES items. Expanded card renders both images side-by-side at 140 px, same as `ActiveStretch` component.
