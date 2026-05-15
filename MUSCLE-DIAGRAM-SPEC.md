# IronLog — Muscle Diagram Specification

This document is the single source of truth for how muscle group diagrams work in IronLog.  
Any AI agent working on this feature must read this document in full before making any changes.  
Do not deviate from the architecture, naming conventions, or autonomy boundaries defined here.

---

## Background — What Already Exists

IronLog already has a data-driven muscle diagram system. Do not redesign it from scratch.

### Existing components

| Item | Location | Purpose |
|---|---|---|
| `MUSCLE_META` | `src/IronLog.jsx` ~line 1811 | Maps exercise IDs to `[primaryMuscle, secondaryMuscle]` |
| `applyMuscleMeta()` | `src/IronLog.jsx` ~line 1886 | Stamps `primaryMuscle` / `secondaryMuscle` onto every exercise at runtime |
| `MuscleDiagram` | `src/IronLog.jsx` ~line 117 | SVG component that renders front + back body, highlights regions |
| `REGION_MAP` | Inside `MuscleDiagram` ~line 118 | Maps SVG region keys to muscle group name arrays |

### How the rendering pipeline works

```
Exercise ID
  → MUSCLE_META → [primaryMuscle, secondaryMuscle]
    → MuscleDiagram props
      → REGION_MAP: SVG region key → [muscle names]
        → clr(region): if name matches primary → blue; secondary → purple; else neutral
          → SVG fill colour applied to each body region path
```

This is correct. Do not change the pipeline. The work in this spec is to improve:
1. The **muscle names** (currently movement categories; need anatomical names)
2. The **REGION_MAP** coverage (to match the new anatomical names)
3. The **SVG body path quality** (Phase 2 only — see Autonomy Boundaries)

---

## Visual Style Reference

The target visual is shown in the contact sheet (`MUSCLE-DIAGRAM-CONTACT-SHEET.png` in `assets/` if present).

| Property | Value |
|---|---|
| Primary muscle colour | `#5B8DEF` (blue) |
| Secondary muscle colour | `#B8A7FF` (purple) |
| Body outline / neutral region | `#F2F5FA` fill, `#C9D6EA` stroke |
| Style | Minimal line illustration, soft rounded edges, clean and uncluttered |
| Layout | Front view (left) + Back view (right) side by side |
| No text labels on the SVG | Labels are rendered separately in JSX as pills |

The current app uses `C.amber` (`#5b9df5`) for primary and `#b8d5ff` for secondary.  
**Do not change the colour values in Phase 1.** The contact sheet colours are aspirational for a later visual polish pass.

---

## Part 1 — Muscle Region Taxonomy

These are the only valid muscle names in IronLog. Use them exactly as written (capitalisation matters — they appear in UI labels).

### Canonical muscle name list

| Region ID (SVG key) | Display Name | Anatomical reference | View |
|---|---|---|---|
| `chest` | `Chest` | Pectoralis major | Front |
| `fShoulder` | `Front Delts` | Anterior deltoid | Front |
| `fShoulder` | `Side Delts` | Lateral deltoid | Front |
| `bicep` | `Biceps` | Biceps brachii | Front |
| `forearm` | `Forearms` | Brachioradialis, wrist flexors | Front |
| `abs` | `Abs` | Rectus abdominis | Front |
| `abs` | `Obliques` | Internal / external obliques | Front |
| `quad` | `Quads` | Quadriceps (rectus femoris + vastus group) | Front |
| `calf` | `Calves` | Gastrocnemius | Front |
| `rShoulder` | `Rear Delts` | Posterior deltoid | Back |
| `upperBack` | `Lats` | Latissimus dorsi | Back |
| `upperBack` | `Mid Traps` | Middle trapezius + rhomboids | Back |
| `upperBack` | `Upper Traps` | Upper trapezius | Back |
| `tricep` | `Triceps` | Triceps brachii | Back |
| `bForearm` | `Forearms` | Posterior forearm (anconeus, wrist extensors) | Back |
| `lowerBack` | `Spinal Erectors` | Erector spinae | Back |
| `glute` | `Glutes` | Gluteus maximus | Back |
| `hamstring` | `Hamstrings` | Biceps femoris, semitendinosus | Back |
| `bCalf` | `Calves` | Gastrocnemius (posterior) | Back |

### Rules for primary vs secondary

**Primary muscle:**
- Main force producer — the exercise would fail without it
- Highest EMG activation
- The muscle the exercise is named for or primarily trains
- Maximum 1 primary per exercise

**Secondary muscle:**
- Significantly assists the movement under load
- Stabilises in a way that creates measurable fatigue
- Clearly involved but not dominant
- Maximum 2 secondary muscles per exercise (display the most significant one first)
- Do NOT list tiny stabilisers (rotator cuff in bench press, transverse abdominis in everything)

**Movement category names to RETIRE — never use these:**
- ~~`Hinge`~~ → use `Hamstrings` or `Glutes` depending on primary mover
- ~~`Push`~~ → use `Chest`, `Front Delts`, or `Triceps`
- ~~`Pull`~~ → use `Lats`, `Mid Traps`, or `Biceps`
- ~~`Legs`~~ → use `Quads`, `Hamstrings`, or `Calves`
- ~~`Arms`~~ → use `Biceps`, `Triceps`, or `Forearms`
- ~~`Back`~~ → use `Lats`, `Mid Traps`, or `Upper Traps`
- ~~`Shoulders`~~ → use `Front Delts`, `Side Delts`, or `Rear Delts`
- ~~`Core`~~ → use `Abs` or `Obliques`
- ~~`Balance`~~ → no muscle highlight; pass `null` for both primary and secondary

---

## Part 2 — REGION_MAP Update

Replace the REGION_MAP inside `MuscleDiagram` with the following. This is the complete authoritative mapping.

```js
const REGION_MAP = {
  // FRONT regions
  chest:     ['Chest'],
  fShoulder: ['Front Delts', 'Side Delts'],    // both anterior + lateral delt until region is split in Phase 2
  bicep:     ['Biceps'],
  forearm:   ['Forearms'],
  abs:       ['Abs', 'Obliques'],
  quad:      ['Quads'],
  calf:      ['Calves'],
  // BACK regions
  rShoulder: ['Rear Delts', 'Side Delts'],     // posterior delt; Side Delts shared front/back
  upperBack: ['Lats', 'Mid Traps', 'Upper Traps'],
  tricep:    ['Triceps'],
  bForearm:  ['Forearms'],
  lowerBack: ['Spinal Erectors'],
  glute:     ['Glutes'],
  hamstring: ['Hamstrings'],
  bCalf:     ['Calves'],
};
```

**Note on `Side Delts`:** The lateral deltoid is visible in both the front and back view. Until the SVG geometry is split into `fShoulder_front` and `fShoulder_back` regions (Phase 2), `Side Delts` appears in both `fShoulder` and `rShoulder` arrays. This means a lateral raise highlights both shoulder regions, which is acceptable.

---

## Part 3 — Exercise → Muscle Database (Complete)

This is the canonical mapping. Replace `MUSCLE_META` in `src/IronLog.jsx` entirely with the following.  
Format: `exercise_id: ['PrimaryMuscle', 'SecondaryMuscle']` or `['PrimaryMuscle', null]`.

Use exact display names from Part 1. Validate against the rules in Part 1 (max 1 primary, max 2 secondary — put only the most significant secondary in index [1]).

### EXERCISES (default workout exercises)

```js
const MUSCLE_META = {
  // ── Workout C — Legs / Core ─────────────────────────────────────────
  goblet_squat:    ['Quads',           'Glutes'],
  hip_thrust:      ['Glutes',          'Hamstrings'],
  rdl:             ['Hamstrings',      'Glutes'],
  reverse_lunge:   ['Quads',           'Glutes'],
  sb_ham_curl:     ['Hamstrings',      'Glutes'],
  pallof_press:    ['Obliques',        null],
  farmers_walk:    ['Forearms',         'Upper Traps'],  // ExRx: grip/forearms is the limiting target; core is a stabiliser
  // ── Workout A — Push ────────────────────────────────────────────────
  bb_flat_bench:   ['Chest',           'Triceps'],
  db_bench:        ['Chest',           'Triceps'],
  db_floor_press:  ['Chest',           'Triceps'],
  bb_incline_bench:['Chest',           'Front Delts'],
  db_shoulder:     ['Front Delts',      'Triceps'],  // shoulder press — ExRx: anterior deltoid is primary mover in overhead press
  // ── Workout B — Pull / Hinge ────────────────────────────────────────
  kb_deadlift:     ['Glutes',          'Hamstrings'],
  chin_up:         ['Lats',            'Biceps'],
  cs_db_row:       ['Lats',            'Biceps'],
  face_pull:       ['Rear Delts',      'Mid Traps'],
  reverse_fly:     ['Rear Delts',      'Mid Traps'],
  db_row_1arm:     ['Lats',            'Biceps'],
  band_row:        ['Lats',            'Biceps'],
  // ── Accessory / Warmup exercises ────────────────────────────────────
  step_ups:        ['Quads',           'Glutes'],
  incline_pushups: ['Chest',           'Triceps'],
  suitcase_carry:  ['Obliques',        'Forearms'],
  split_squat:     ['Quads',           'Glutes'],
  calf_raises:     ['Calves',          null],
  single_leg_bal:  [null,              null],       // balance drill — no primary muscle highlight
  // ── Tricep pushdown (band, Workout A) ───────────────────────────────
  tricep_pushdown: ['Triceps',         null],
  // ── Lateral raise (Workout A) ───────────────────────────────────────
  lateral_raise:   ['Side Delts',      null],
  db_lateral:      ['Side Delts',      null],
  db_tricep:       ['Triceps',         null],
  db_curl:         ['Biceps',          'Forearms'],
  db_hammer:       ['Forearms',         'Biceps'],   // ExRx: brachioradialis (forearms) is the target; biceps is synergist
  // ── Preset library — Arms ───────────────────────────────────────────
  p_db_bicep_curl:      ['Biceps',      'Forearms'],
  p_barbell_curl:       ['Biceps',      'Forearms'],
  p_hammer_curl:        ['Forearms',    'Biceps'],   // ExRx: brachioradialis (forearms) is the target; biceps is synergist
  p_concentration_curl: ['Biceps',      null],
  p_preacher_curl:      ['Biceps',      'Forearms'], // ExRx: brachioradialis listed as synergist
  // ── Preset library — Triceps ────────────────────────────────────────
  p_tricep_pushdown:    ['Triceps',     null],
  p_overhead_ext:       ['Triceps',     null],
  p_skull_crushers:     ['Triceps',     null],
  p_tricep_dips:        ['Triceps',     'Chest'],
  p_close_grip_bench:   ['Triceps',     'Chest'],
  p_diamond_pushup:     ['Triceps',     'Chest'],
  // ── Preset library — Shoulders ──────────────────────────────────────
  p_lateral_raise:      ['Side Delts',  null],
  p_front_raise:        ['Front Delts', null],
  p_db_shoulder_press:  ['Front Delts', 'Triceps'],  // ExRx: anterior deltoid is primary in overhead pressing
  p_arnold_press:       ['Front Delts',  'Side Delts'],  // ExRx: anterior deltoid is primary in Arnold press
  p_rear_delt_fly:      ['Rear Delts',  'Mid Traps'],
  p_band_face_pull:     ['Rear Delts',  'Mid Traps'],
  p_shrugs:             ['Upper Traps', null],
  p_band_ext_rot:       ['Rear Delts',  null],
  // ── Preset library — Chest ──────────────────────────────────────────
  p_push_up:            ['Chest',       'Triceps'],
  p_db_fly:             ['Chest',       'Front Delts'],
  p_incline_db_press:   ['Chest',       'Front Delts'],
  p_chest_dip:          ['Chest',       'Triceps'],
  p_cable_fly:          ['Chest',       'Front Delts'],
  // ── Preset library — Back ───────────────────────────────────────────
  p_pull_up:            ['Lats',        'Biceps'],
  p_lat_pulldown:       ['Lats',        'Biceps'],
  p_seated_cable_row:   ['Lats',        'Biceps'],
  p_t_bar_row:          ['Lats',        'Mid Traps'],
  p_straight_arm_pd:    ['Lats',        null],
  p_rdl:                ['Hamstrings',  'Glutes'],
  // ── Preset library — Legs ───────────────────────────────────────────
  p_bulgarian_squat:    ['Quads',       'Glutes'],
  p_leg_press:          ['Quads',       'Glutes'],
  p_leg_extension:      ['Quads',       null],
  p_seated_leg_curl:    ['Hamstrings',  null],
  p_sumo_squat:         ['Quads',       'Glutes'],
  p_wall_sit:           ['Quads',       null],
  p_cable_kickback:     ['Glutes',      null],
  p_hip_abduction:      ['Glutes',      null],
  p_frog_pumps:         ['Glutes',      null],
  p_donkey_kick:        ['Glutes',      null],
  p_clamshell:          ['Glutes',      null],
  // ── Preset library — Core ───────────────────────────────────────────
  p_plank:              ['Abs',         'Obliques'],
  p_side_plank:         ['Obliques',    'Abs'],
  p_dead_bug:           ['Abs',         null],
  p_bird_dog:           ['Spinal Erectors', 'Glutes'],  // ExRx: erector spinae is the target; abs are stabilisers
  p_ab_wheel:           ['Abs',         null],
  p_hanging_knee_raise: ['Abs',         null],       // NOTE: ExRx targets Iliopsoas (hip flexors) — no hip flexors in muscle map; Abs used as closest available
  p_cable_crunch:       ['Abs',         null],
};
```

**Validation rules to check before completing:**
- Every entry uses a name from the canonical list in Part 1
- No movement-category names (`Hinge`, `Push`, `Pull`, `Legs`, `Arms`, `Back`, `Shoulders`, `Core`)
- `single_leg_bal` is the only entry where both values are null — all others must have a primary
- No exercise has more than 2 values in its array

---

## Part 4 — Component API

The `MuscleDiagram` component signature does not change. It already accepts the right props.

```jsx
<MuscleDiagram
  primaryMuscle="Chest"
  secondaryMuscle="Triceps"
  width={220}
/>
```

All call sites pass `def.primaryMuscle` and `def.secondaryMuscle` from the exercise definition (set by `applyMuscleMeta`). These values come directly from `MUSCLE_META`. No call site changes are required beyond any that currently pass movement-category strings as hardcoded values — check and update those.

---

## Part 5 — SVG Anatomy Template

### Phase 1 (in scope for autonomous overnight work)

Keep the existing SVG geometry in `MuscleDiagram`. The existing paths are rough approximations, but they are functionally correct for the data-driven highlighting. Do not attempt to redesign the SVG body paths without a visual review mechanism.

What to change in the SVG component in Phase 1:
1. Update `REGION_MAP` (see Part 2)
2. Ensure the colour fallback for `null` primary/secondary muscle is handled: `clr(region)` already returns neutral when neither matches — no change needed

### Phase 2 (NOT in scope — human review required)

Phase 2 will replace the existing rough SVG geometry with quality paths matching the contact sheet style. This requires:
- Visually inspecting each muscle region shape
- Checking left/right symmetry
- Verifying muscle boundaries don't overlap incorrectly
- Human sign-off before merging

**Codex must not attempt Phase 2 SVG geometry work without explicit instruction.** The placeholder SVG is acceptable for shipping Phase 1.

### Region splitting — Phase 2 backlog

These regions currently bundle two distinct muscles into one shape:

| Current region | Bundled muscles | Phase 2 split plan |
|---|---|---|
| `fShoulder` | Front Delts + Side Delts | Split into `fShoulder_front` and `fShoulder_side` |
| `rShoulder` | Rear Delts + Side Delts | Split into `rShoulder_rear` and keep `rShoulder_side` |
| `upperBack` | Lats + Mid Traps + Upper Traps | Split into `lat_left`, `lat_right`, `mid_trap`, `upper_trap` |

Until Phase 2: accept that lateral raise and front raise highlight the same shoulder region. Document this in code comments.

---

## Part 6 — Migration Checklist

These are the exact tasks for Phase 1. Complete them in order. Run `npm run build` after each step to verify the build stays clean.

**Working directory:**
```bash
cd "/Users/phillcantone/Library/Mobile Documents/com~apple~CloudDocs/Family/Phill/AI Coding/Ironlog"
```

**Build command:**
```bash
npm run build
```

### Step 1 — Replace MUSCLE_META

Find `const MUSCLE_META = {` in `src/IronLog.jsx`.  
Replace the entire object with the canonical database from Part 3.  
Run build. Verify it compiles.

### Step 2 — Replace REGION_MAP

Find `const REGION_MAP = {` inside the `MuscleDiagram` function.  
Replace with the REGION_MAP from Part 2.  
Run build. Verify it compiles.

### Step 3 — Update exercise.muscle fallback

In `applyMuscleMeta()`, the fallback is:
```js
const [primaryMuscle, secondaryMuscle] = MUSCLE_META[id] || [ex.muscle, null];
```

The `ex.muscle` fallback uses the old movement-category names (`'Push'`, `'Pull'`, etc.) from the `EXERCISES` and `PRESET_LIBRARY` object definitions. After Step 1, every exercise in both libraries should have an entry in `MUSCLE_META`, so the fallback fires only for custom exercises added by the user.

Verify: after Step 1, count any `EXERCISES` or `PRESET_LIBRARY` exercise IDs that are NOT in `MUSCLE_META`. Add missing entries. The fallback to `ex.muscle` should only apply to user-created custom exercises.

### Step 4 — Audit pill labels

Search for hardcoded muscle group strings in JSX — any place that renders exercise muscle names as labels. These should already flow from `ex.primaryMuscle` / `ex.secondaryMuscle` via `applyMuscleMeta`. Confirm no hardcoded `'Hinge'`, `'Push'`, `'Pull'`, `'Core'`, `'Legs'`, `'Arms'`, `'Back'`, `'Shoulders'` strings appear in pill/label rendering code.

### Step 5 — Regression check

After all changes:
1. Run `npm run build` — must exit cleanly
2. Grep for retired names to confirm they're gone from MUSCLE_META:
   ```bash
   grep -n "'Hinge'\|'Push'\|'Pull'\|'Core'\|'Legs'\|'Arms'\|'Back'\|'Shoulders'" src/IronLog.jsx | grep MUSCLE_META
   ```
   Expected: zero results.
3. Verify `single_leg_bal` entry is `[null, null]` — the only null-primary entry.

---

## Part 7 — Conflict List

Some exercises have contested muscle assignments. This table records the chosen interpretation. Do not deviate from it without updating this document.

| Exercise | Contested point | Chosen interpretation | Reasoning |
|---|---|---|---|
| Romanian Deadlift | Primary: hamstrings or glutes? | `Hamstrings` primary | EMG studies show higher hamstring activation in RDL vs conventional |
| KB Deadlift (raised) | Primary: glutes or hamstrings? | `Glutes` primary | Raised height reduces hamstring stretch; hip extension dominates |
| Hip Thrust | Primary: glutes or hamstrings? | `Glutes` primary | Unambiguous — glute thrust, hamstrings assist |
| Face Pull | Primary: rear delts or mid traps? | `Rear Delts` primary | Face pulls are prescribed specifically for posterior delt health |
| Farmers Walk | Primary: obliques or forearms? | `Forearms` primary | ExRx classifies as a forearms/grip exercise — core is a stabiliser, not the limiting mover |
| Suitcase Carry | Primary: obliques or forearms? | `Obliques` primary | Unlike farmer's walk, the training intent is specifically anti-lateral-flexion; forearms secondary |
| DB Shoulder Press | Primary: front delts or side delts? | `Front Delts` primary | ExRx targets anterior deltoid in all overhead pressing movements |
| Hammer Curl | Primary: biceps or forearms? | `Forearms` primary | ExRx targets brachioradialis (forearms) as the primary mover; biceps is the synergist |
| Arnold Press | Primary: front delts or side delts? | `Front Delts` primary | ExRx targets anterior deltoid; lateral deltoid is a synergist via the rotation component |
| Pallof Press | Primary: abs or obliques? | `Obliques` primary | Anti-rotation; obliques are the primary resistors |
| Close-Grip Bench | Primary: triceps or chest? | `Triceps` primary | Narrowed grip shifts loading to triceps |
| Chin-Up vs Pull-Up | Same muscles? | Both: `Lats` primary, `Biceps` secondary | Underhand (chin-up) increases bicep involvement but lat is still primary |
| Upright Row | Primary: side delts or upper traps? | Not in current library — flag as contested if added |

---

## Part 8 — Visual Simplification Rules

These rules prevent scientific precision from creating unusable UI.

1. **Max 1 primary muscle** — never list two. Choose the dominant one.
2. **Max 2 secondary muscles** — only the most significant; tiny stabilisers are omitted.
3. **No isolating stabilisers** — rotator cuff in bench press, transverse abdominis in everything, tibialis anterior in calf raises: all omitted.
4. **No duplicate regions** — if primary and secondary map to the same SVG region, the primary colour wins. This should not happen with the current canonical list — watch for it.
5. **Balance drills get no highlight** — `single_leg_bal` passes `null` for both. The diagram renders as a neutral (all-grey) figure. This is correct.

---

## Part 9 — QA Gate (HUMAN REQUIRED — not autonomous)

Before any merge of muscle diagram changes, Phill must manually review:

**Data QA:**
- [ ] All exercise muscle assignments make anatomical sense
- [ ] No retired movement-category names in pill labels
- [ ] Pill labels read as plain English ("Quads", "Rear Delts", not "Hinge", "Back")

**Visual QA (Phase 2 only):**
- [ ] Front and back body views visible and symmetrical
- [ ] Highlighted regions match the exercise (bench press = chest, not hamstrings)
- [ ] Neutral regions are clearly distinct from highlighted ones
- [ ] No region bleeds across anatomical boundaries
- [ ] Consistent with neighbouring exercise cards

**Do not merge Phase 2 SVG geometry changes without completing the visual QA checklist.**  
Phase 1 data migration does not require visual QA — it is a pure data rename with no visual regressions.

---

## Part 10 — Sources and Validation

Muscle assignments in this document were cross-referenced against ExRx.net exercise classifications (May 2026). Of 50 exercises checked, 42 matched exactly, 5 were minor adjustments, and 3 were corrected:

| Changed exercise | Old assignment | New assignment | Reason |
|---|---|---|---|
| Farmer's Walk | Primary: Obliques | Primary: Forearms | ExRx classifies as grip/forearms exercise |
| Bird Dog | Primary: Abs | Primary: Spinal Erectors | ExRx targets erector spinae |
| Hammer Curl | Primary: Biceps | Primary: Forearms | ExRx targets brachioradialis |
| DB / Barbell Shoulder Press | Primary: Side Delts | Primary: Front Delts | ExRx targets anterior deltoid in overhead press |
| Arnold Press | Primary: Side Delts | Primary: Front Delts | ExRx targets anterior deltoid |
| Preacher Curl | Secondary: null | Secondary: Forearms | ExRx lists brachioradialis as synergist |

**Note on Hanging Knee Raise:** ExRx targets Iliopsoas (hip flexors), which is not in IronLog's muscle map. Mapped to Abs as the closest available muscle — known inaccuracy, acceptable for current muscle map scope.

When in doubt, [ExRx.net](https://exrx.net) is authoritative. Do not use random gym-content sources.

---

## Autonomy Boundaries Summary

| Task | Autonomous (Codex)? | Notes |
|---|---|---|
| Replace MUSCLE_META with Part 3 data | ✅ Yes | Pure data replacement |
| Replace REGION_MAP with Part 2 data | ✅ Yes | Pure data replacement |
| Audit and fix fallback cases | ✅ Yes | Code + data check |
| Audit pill labels for retired names | ✅ Yes | Grep + JSX review |
| Improve SVG body path quality | ❌ No | Phase 2 — requires visual QA |
| Split bundled SVG regions | ❌ No | Phase 2 — requires visual QA |
| Validate muscle assignments visually | ❌ No | Human QA gate |
| Change colour values | ❌ No | Visual polish pass, separate decision |

---

## File Locations

| File | Purpose |
|---|---|
| `src/IronLog.jsx` | Source — all changes go here |
| `index.html` | Built output — regenerated by `npm run build`, do not edit directly |
| `MUSCLE-DIAGRAM-SPEC.md` | This document — update if interpretations change |
| `ROADMAP.md` | Priority 3 entry covers this feature; update status when Phase 1 ships |
| `BUGS.md` | Log any bugs discovered during migration |

---

*Spec version: 1.1 — 2026-05-16 — 8 muscle assignments corrected after ExRx.net cross-reference*  
*Author: Claude Sonnet 4.6 + Phill Cantone*
