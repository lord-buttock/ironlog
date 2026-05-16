# Codex Briefing — IronLog Current State

*Generated 2026-05-16. Read this before doing anything else.*

---

## What IronLog is

A single-file React 18 PWA for personal workout logging.

- **Source:** `src/IronLog.jsx`
- **Build:** `node build.js` → `index.html` (self-contained, no bundler)
- **Stack:** Plain JSX, no TypeScript, no separate component files
- **Deployed:** GitHub Pages via `lord-buttock/ironlog`

Read `README.md` for full architecture, user profile, and medical constraints.  
Read `ROADMAP.md` for the full feature backlog.

---

## What was completed before context was lost

### Anatomy muscle diagrams — ✅ fully complete

The `MuscleDiagram` component has been completely rewritten. It now uses
two annotated SVG body diagrams (front and rear) stored in `assets/anatomy/`
with named muscle paths. The component accepts `primary[]` and `secondary[]`
arrays and dynamically colours paths blue/purple/grey.

- `assets/anatomy/front-muscle-map.svg` — 28 muscle paths, fully annotated
- `assets/anatomy/rear-muscle-map.svg` — 22 muscle paths, fully annotated
- `assets/anatomy/assign_muscle_ids.py` — preprocessing script (already run, do not re-run)
- `MUSCLE-DIAGRAM-SPEC.md` — v1.1, authoritative muscle mapping reference
- `CODEX_ANATOMY_SVG_INSTRUCTIONS.md` — implementation reference

`MUSCLE_META` in `src/IronLog.jsx` has been updated with anatomical muscle
names (cross-referenced against ExRx.net). `applyMuscleMeta()` stamps
`primary[]` and `secondary[]` arrays onto every exercise at runtime.

Do not touch any of this. It is complete and working.

### Exercise icons — ✅ 36 done, 43 still missing

Exercise icons are 108×108px transparent PNG illustrations in a blue line-art
style. They live in `assets/icons/<exercise_id>.png`.

**Icons that exist (36):**
bb_flat_bench, calf_raises, chin_up, cs_db_row, db_curl, db_hammer,
db_shoulder, face_pull, farmers_walk, goblet_squat, hip_thrust, kb_deadlift,
lateral_raise, p_band_ext_rot, p_cable_kickback, p_close_grip_bench,
p_db_bicep_curl, p_db_fly, p_db_shoulder_press, p_dead_bug, p_lateral_raise,
p_plank, p_rear_delt_fly, p_skull_crushers, p_straight_arm_pd, p_sumo_squat,
p_tricep_pushdown, pallof_press, rdl, reverse_fly, reverse_lunge, sb_ham_curl,
split_squat, step_ups, suitcase_carry, tricep_pushdown

**Icons still missing (43):**
band_row, bb_incline_bench, db_bench, db_floor_press, db_lateral,
db_row_1arm, db_tricep, incline_pushups, p_ab_wheel, p_arnold_press,
p_band_face_pull, p_barbell_curl, p_bird_dog, p_bulgarian_squat,
p_cable_crunch, p_cable_fly, p_chest_dip, p_clamshell, p_concentration_curl,
p_diamond_pushup, p_donkey_kick, p_frog_pumps, p_front_raise, p_hammer_curl,
p_hanging_knee_raise, p_hip_abduction, p_incline_db_press, p_lat_pulldown,
p_leg_extension, p_leg_press, p_overhead_ext, p_preacher_curl, p_pull_up,
p_push_up, p_rdl, p_seated_cable_row, p_seated_leg_curl, p_shrugs,
p_side_plank, p_t_bar_row, p_tricep_dips, p_wall_sit, single_leg_bal

### Warmup and finisher icons — ✅ fully complete

- Phase 1 (code): WARMUP and finisher arrays converted to `{id, text}` objects,
  all 4 render sites updated with icon `<img>` + onError fallback,
  wording bug fixed. Commit: 2e8b65a
- Phase 2 (images): 14 icons generated and committed to `assets/icons/warmup/`.
  Commit: d34cc78

Do not touch any of this. It is complete and working.

---

## The task that was in progress — complete this first (ARCHIVED)

### Warmup & finisher icons (two-phase task) — ✅ DONE

#### Phase 1 — Data structure and rendering (code only)

**Step 1 — Convert WARMUP to objects**

Find `const WARMUP = [` in `src/IronLog.jsx` and replace the string array
with this object array:

```js
const WARMUP = [
  { id: 'wu_stepper',           text: '2 min · Easy stepper or gentle trampoline bounce — get the blood moving' },
  { id: 'wu_cat_cow',           text: '1 min · Cat-cow — 10 slow reps, unloaded, pain-free range · Gentle spinal mobility' },
  { id: 'wu_prone_cobra',       text: '1 min · Prone cobra — lie face down, hands beside chest, lift chest gently · 6 × 5 sec holds · Back extension and disc health' },
  { id: 'wu_hamstring_stretch', text: '30 sec each side · Lying hamstring stretch — on back, loop band or towel around foot, gentle straight-leg pull' },
  { id: 'wu_chest_opener',      text: '1 min · Doorframe chest & shoulder opener — arms at 90° on frame, lean body gently forward · Chest and anterior shoulder' },
  { id: 'wu_pendulum',          text: '30 sec each side · Pendulum swings — lean on bench, arm hangs loose, small gentle circles · Shoulder mobility, important for bursitis' },
  { id: 'wu_pull_aparts',       text: '1 min · Band pull-aparts — 15 reps, light tension · Scapular retraction and upper back activation' },
  { id: 'wu_glute_bridge',      text: '1 min · Glute bridge — 10–12 reps bodyweight · Full hip extension at top' },
];
```

**Step 2 — Convert finisher arrays to objects**

In the `WORKOUTS` object, convert each `finisher` string array to objects:

```js
// Workout A
finisher: [
  { id: 'fin_wall_slides', text: 'Wall slides — 2 × 6 slow (pain-free only)' },
  { id: 'fin_pull_aparts', text: 'Band pull-aparts — 2 × 12' },
],

// Workout B
finisher: [
  { id: 'fin_ham_floss',   text: 'Hamstring floss (band, lying) — 45 sec each side' },
  { id: 'fin_childs_pose', text: "Child's pose breathing — 60 sec" },
],

// Workout C
finisher: [
  { id: 'fin_ext_rotation', text: 'Band external rotation — 2 × 10 each side' },
  { id: 'fin_single_leg',   text: 'Single-leg balance — 30 sec each side' },
],
```

**Step 3 — Update all four render sites**

There are four places that map over WARMUP or finisher items. Update each
to use `item.text` instead of the item string, and render an icon:

Render sites (find by line number or by searching for WARMUP.map and
wkt.finisher.map):
- Home warmup preview: ~line 701
- Active workout warmup phase: ~line 1040
- Home finisher preview: ~line 717
- Active workout finisher phase: ~line 1301

At each site, render an icon before the text like this:

```jsx
<img
  src={`assets/icons/warmup/${item.id}.png`}
  style={{ width: 40, height: 40, borderRadius: '50%',
           objectFit: 'contain', background: '#EEF3FF',
           marginRight: 12, flexShrink: 0 }}
  onError={e => { e.target.style.display = 'none'; }}
/>
```

The `onError` handler hides the image silently if the file does not exist —
this allows Phase 1 to be committed and working before Phase 2 icons exist.

**Step 4 — Fix wording bug**

While editing the warmup section, find and fix a wording bug:
somewhere in the active warmup phase UI there is text saying something like
"6 minutes · complete all five items" — this is wrong on two counts.
WARMUP has 8 items, not 5. Fix the label to reflect 8 items and an accurate
time estimate (~10 minutes total).

**Step 5 — Build and verify**

```bash
npm run build
```
Must pass cleanly. Warmup text must still render. No console errors when
icons are missing (onError fires silently).

Commit Phase 1:
```
refactor: convert warmup/finisher to objects with IDs, add icon render sites
```

---

#### Phase 2 — Icon generation (images)

Generate icons using the same approved pipeline documented in `Image-Process.md`.

**Style anchor:** `assets/icons/rdl.png` — open and use as your visual reference  
**Output folder:** `assets/icons/warmup/` (create it)  
**Size:** 108×108px, transparent PNG, hasAlpha: yes  
**Quality gate:** shaped head/profile, pale-blue shading, identifiable pose, polished illustration — see `Image-Process.md` for full gate

**Prompt template:**
```
Professional fitness app exercise illustration, [DESCRIPTION],
blue line art with subtle pale-blue body shading, transparent background,
detailed human figure with shaped head and hair and facial profile,
no blank oval face, realistic exercise pose with correct body proportions,
clear equipment visible, clean vector illustration style,
consistent stroke weight, no text, no border, no background, 108x108 PNG
```

**13 icons to generate:**

| ID | Description for prompt |
|---|---|
| `wu_stepper` | Person stepping on a small stepper platform, one foot raised, arms relaxed, light warm-up movement, stepper platform clearly visible |
| `wu_cat_cow` | Person on hands and knees on a mat, arching back upward in cat stretch or dipping belly downward in cow stretch, clearly on all fours |
| `wu_prone_cobra` | Person lying face down on a mat, hands beside chest, gently lifting chest and head off the floor, arms lightly pressing down, gentle back extension |
| `wu_hamstring_stretch` | Person lying on back on a mat, one leg raised straight upward, hands or a band looped around the raised foot, gentle hamstring stretch |
| `wu_chest_opener` | Person standing in a doorframe, both arms at 90 degrees against the frame, leaning gently forward through the doorway, chest stretch, doorframe clearly visible |
| `wu_pendulum` | Person leaning forward with one hand resting on a bench for support, other arm hanging loose making small relaxed circles, pendulum shoulder swing, bench clearly visible |
| `wu_pull_aparts` | Person standing holding a resistance band with both hands at shoulder height, pulling band apart horizontally, arms extending outward, band taut between hands |
| `wu_glute_bridge` | Person lying on back on a mat, knees bent, feet flat on floor, hips raised into a bridge position, shoulders and feet on the ground, full hip extension |
| `fin_wall_slides` | Person standing with back flat against a wall, arms raised in a goalpost position against the wall, sliding arms upward, wall clearly shown behind the figure |
| `fin_pull_aparts` | **Copy** the cleaned `wu_pull_aparts.png` file — do not generate a second image |
| `fin_ham_floss` | Person lying on back on a mat, one leg raised, looping a resistance band around the foot and gently oscillating the leg for hamstring mobility, band clearly visible |
| `fin_childs_pose` | Person kneeling on a mat, torso folded forward, arms extended in front, forehead toward the mat, classic child's pose resting position |
| `fin_ext_rotation` | Person standing with a resistance band anchored at elbow height, elbow pinned to side at 90 degrees, rotating forearm outward against the band, band clearly visible |
| `fin_single_leg` | Person standing on one leg, other leg slightly raised, arms relaxed at sides, balanced single-leg stance |

Workflow for each (from `Image-Process.md`):
1. Generate → 2. Quality gate check → 3. Regenerate if fail → 4. Pillow cleanup → 5. `sips` verify → 6. Save to `assets/icons/warmup/<id>.png`

Commit Phase 2:
```
feat: add warmup and finisher icons (13)
```

---

## Current task — generate the remaining 43 exercise icons

Warmup/finisher icons are done. The next task is generating the remaining
**43 missing exercise icons** for the preset library.

Use the same pipeline (Image-Process.md), same style anchor (rdl.png),
same output folder (`assets/icons/<id>.png`).

The full missing list is at the top of this document. Work through them in
batches, committing after each batch.

Note: several preset exercises require equipment the user does not own
(leg press machine, cable machine, lat pulldown machine). Generate icons
for these anyway — they are still in the library even if rarely used.

---

## Key reference files

| File | What it is |
|---|---|
| `README.md` | Full project context, user profile, medical constraints |
| `ROADMAP.md` | Feature backlog and priorities |
| `BUGS.md` | Bug tracker |
| `Image-Process.md` | Icon generation workflow, Pillow cleanup script, quality gate |
| `MUSCLE-DIAGRAM-SPEC.md` | Muscle diagram data — do not modify |
| `CODEX_ANATOMY_SVG_INSTRUCTIONS.md` | Anatomy SVG reference — do not modify |
| `assets/anatomy/` | Annotated SVGs — do not modify |
| `assets/icons/` | Exercise icons (36 present, 43 missing) |
| `assets/icons/warmup/` | Warmup/finisher icons — does not exist yet |

---

## Do not touch

- `assets/anatomy/` — fully complete, do not regenerate or modify
- `MUSCLE-DIAGRAM-SPEC.md` — authoritative, do not modify
- `assets/front torso.png`, `assets/rear torso.png` — untracked source files, leave alone
- The `MuscleDiagram` component — complete, do not modify
- `MUSCLE_META` — complete, do not modify
