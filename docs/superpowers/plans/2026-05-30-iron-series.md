# Iron Series Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Caroline Girvan's Iron Series (30 workouts, dumbbell-only) as a parallel programme alongside the existing A/B/C split, accessible via a toggle on the Workout tab.

**Architecture:** All code lives in `src/IronLog.jsx`. Iron sessions are stored in the existing `il_sessions` array with `workout: 'IRON_N'` keys. New `IRON_EXERCISES` and `IRON_WORKOUTS` constants provide the data; `nextIronDay()` derives progression from session history. The Workout tab gains a segmented toggle; `buildSession` and `ActiveWorkout` gain Iron-aware branches; History gains a badge renderer for Iron sessions.

**Tech Stack:** React 18 UMD globals (no imports), inline styles, localStorage, same build pipeline (`node build.js`).

---

## Before you start

```bash
cd "/Users/phillcantone/Library/Mobile Documents/com~apple~CloudDocs/Family/Phill/AI Coding/Ironlog"
git pull --ff-only origin main
git status   # must be clean
```

Read these docs before touching code:
- `CLAUDE.md` — working rules, build process, commit rules
- `docs/superpowers/specs/2026-05-30-iron-series-design.md` — full design spec
- `ICON-GUIDE.md` — icon pipeline (icons are a separate pass, not in this plan)

Build command (run after every task):
```bash
node build.js
# Expected: ✓ Built dist/index.html and index.html (NNN KB)
```

Commit rule: always commit these four files together:
```
src/IronLog.jsx   dist/index.html   index.html   version.json
```

---

## File structure

Only `src/IronLog.jsx` is modified. Additions in order of their position in the file:

| Addition | Position in file |
|---|---|
| `IRON_EXERCISES` constant | After `PRESET_LIBRARY` (~line 3800+) |
| `IRON_WORKOUTS` constant | After `WORKOUTS` (~line 850) |
| `nextIronDay()` function | After `nextWorkout()` (~line 933) |
| `IronSeriesView` component | Before `ActiveWorkout` component |
| `buildSession` modification | Existing function (~line 943) — add Iron branch at top |
| `ActiveWorkout` modification | Existing component — add Iron phase skip |
| `History` modification | Existing component — add Iron badge |
| `App` modification | `allExercises` merge + `selectedWorkout` init |
| `MUSCLE_META` additions | Existing constant (~line 1811) |

---

## Task 1: IRON_EXERCISES constant + MUSCLE_META entries

**Files:**
- Modify: `src/IronLog.jsx` — add after `PRESET_LIBRARY` block; add entries to `MUSCLE_META`

- [ ] **Step 1: Locate insertion point**

Find the line containing `const PRESET_LIBRARY = {` in `src/IronLog.jsx`. Scroll to the closing `};` of that block. Add `IRON_EXERCISES` immediately after it.

- [ ] **Step 2: Add IRON_EXERCISES constant**

```js
// ─── IRON SERIES EXERCISES ─────────────────────────────────────────────────
const IRON_EXERCISES = {
  iron_heel_elev_squat: {
    name: 'Heel-Elevated Squat', muscle: 'Quads', unit: 'kg',
    defaultSets: 4, defaultDuration: 60, defaultReps: null, isTimed: true,
    cue: 'Heels raised on yoga block or weight plate. Sit deep into squat, knees track over toes. Upright torso throughout. Drive through quads on the way up.',
    demo: YT('heel+elevated+squat+dumbbell+tutorial+form'),
  },
  iron_bulgarian_split: {
    name: 'Bulgarian Split Squat', muscle: 'Quads', unit: 'kg',
    defaultSets: 4, defaultDuration: 60, defaultReps: null, isTimed: true, perSide: true,
    cue: 'Rear foot elevated on chair behind you. Lower rear knee toward floor, torso upright. Front foot flat, drive through heel. Keep most weight through the front leg.',
    caution: 'Slipped disc — stop if lower back rounds or you feel any lumbar discomfort.',
    demo: YT('bulgarian+split+squat+dumbbell+tutorial+form'),
  },
  iron_kas_bridge: {
    name: 'Kas Glute Bridge', muscle: 'Glutes', unit: 'kg',
    defaultSets: 4, defaultDuration: 60, defaultReps: null, isTimed: true,
    cue: 'Like a glute bridge but with very small ROM — do not lock out at the top. Keep constant glute tension throughout. Slow, deliberate pace. Weight across hips.',
    demo: YT('kas+glute+bridge+tutorial+constant+tension'),
  },
  iron_sl_rdl: {
    name: 'Single-Leg RDL', muscle: 'Hamstrings', unit: 'kg',
    defaultSets: 4, defaultDuration: 60, defaultReps: null, isTimed: true, perSide: true,
    cue: 'Hinge on one leg, rear leg floats back as counterweight. Neutral spine — no rounding. Light load, focus on the hip hinge and balance. Stop well before hamstring pull.',
    caution: 'Slipped disc — neutral spine only. Stop if lower back tightens.',
    demo: YT('single+leg+romanian+deadlift+dumbbell+form+tutorial'),
  },
  iron_bw_kickback: {
    name: 'Bodyweight Glute Kickback', muscle: 'Glutes', unit: 'bw',
    defaultSets: 4, defaultDuration: 60, defaultReps: null, isTimed: true, perSide: true,
    cue: 'On hands and knees. Drive heel toward ceiling, squeezing glute at top. Keep hips square — do not twist. Controlled return. Can add band around thighs.',
    demo: YT('bodyweight+glute+kickback+quadruped+tutorial'),
  },
  iron_cyclist_squat: {
    name: 'Cyclist Squat', muscle: 'Quads', unit: 'kg',
    defaultSets: 4, defaultDuration: 60, defaultReps: null, isTimed: true,
    cue: 'Very narrow stance, heels elevated on block. Extreme quad isolation. Go deep — the elevated heels allow the knees to travel well forward. Dumbbells held at sides or in goblet position.',
    demo: YT('cyclist+squat+dumbbell+heel+elevated+quad+tutorial'),
  },
  iron_fwd_lunge: {
    name: 'Forward Alternating Lunge', muscle: 'Quads', unit: 'kg',
    defaultSets: 4, defaultDuration: 60, defaultReps: null, isTimed: true,
    cue: 'Step forward, lower rear knee toward floor. Drive through front heel to return. Alternate legs. More quad-dominant than reverse lunge. Keep torso upright throughout.',
    demo: YT('forward+alternating+lunge+dumbbell+form+tutorial'),
  },
  iron_1_5_goblet: {
    name: '1.5 Rep Goblet Squat', muscle: 'Quads', unit: 'kg',
    defaultSets: 4, defaultDuration: 60, defaultReps: null, isTimed: true,
    cue: 'Full squat down, rise halfway, lower back down fully, then stand completely = 1 rep. Constant time under tension. Slower tempo than standard goblet squat.',
    demo: YT('1.5+rep+goblet+squat+time+under+tension+tutorial'),
  },
  iron_squat_pulse: {
    name: 'Bodyweight Squat Pulse', muscle: 'Quads', unit: 'bw',
    defaultSets: 4, defaultDuration: 60, defaultReps: null, isTimed: true,
    cue: 'Stay at the bottom of a squat and pulse up and down through a very small range. Maintain tension throughout — do not stand up. Burn-out finisher for quads.',
    demo: YT('squat+pulse+bodyweight+legs+burnout+tutorial'),
  },
  iron_b_stance_rdl: {
    name: 'B-Stance RDL', muscle: 'Hamstrings', unit: 'kg',
    defaultSets: 4, defaultDuration: 60, defaultReps: null, isTimed: true, perSide: true,
    cue: 'Staggered stance — front foot takes most of the load. Rear foot touches floor for balance only. Hinge at hip, neutral spine. Most of the work goes through the front leg.',
    caution: 'Slipped disc — neutral spine only. Stop if lower back tightens.',
    demo: YT('b+stance+rdl+dumbbell+single+leg+hinge+tutorial'),
  },
  iron_sumo_dl: {
    name: 'Sumo Deadlift', muscle: 'Glutes', unit: 'kg',
    defaultSets: 4, defaultDuration: 60, defaultReps: null, isTimed: true,
    cue: 'Wide stance, toes pointed out 30–45°. Grip DBs between legs. Push knees out in line with toes as you drive up. Neutral spine throughout. Full hip extension at the top.',
    caution: 'Slipped disc — neutral spine only. Stop immediately if lower back pain.',
    demo: YT('dumbbell+sumo+deadlift+form+tutorial+glutes'),
  },
  iron_banded_abduct: {
    name: 'Banded Glute Abduction', muscle: 'Glutes', unit: 'band',
    defaultSets: 4, defaultDuration: 60, defaultReps: null, isTimed: true,
    cue: 'Resistance band around thighs just above knees. Seated or lying with knees bent. Push knees apart against band resistance, controlling return. Targets glute medius.',
    demo: YT('banded+glute+abduction+seated+lying+tutorial'),
  },
  iron_db_row: {
    name: 'Bent-Over DB Row', muscle: 'Lats', unit: 'kg',
    defaultSets: 4, defaultDuration: 60, defaultReps: null, isTimed: true,
    cue: 'Hinge forward at hips, flat back. Both DBs hang below chest. Pull elbows back and up, squeezing shoulder blades. Control the descent. Core braced throughout.',
    demo: YT('bent+over+dumbbell+row+both+arms+form+tutorial'),
  },
  iron_pronated_row: {
    name: 'Pronated (Palms Down) Row', muscle: 'Lats', unit: 'kg',
    defaultSets: 4, defaultDuration: 60, defaultReps: null, isTimed: true,
    cue: 'Overhand grip (palms facing you as you hinge). Pull elbows back. Overhand grip increases upper back and rear delt engagement compared to underhand. Flat back throughout.',
    demo: YT('pronated+overhand+dumbbell+row+back+tutorial'),
  },
  iron_supinated_row: {
    name: 'Supinated (Palms Up) Row', muscle: 'Lats', unit: 'kg',
    defaultSets: 4, defaultDuration: 60, defaultReps: null, isTimed: true,
    cue: 'Underhand grip (palms facing ceiling as you hinge). Pull elbows back close to body. Underhand grip increases bicep involvement compared to overhand. Flat back throughout.',
    demo: YT('supinated+underhand+dumbbell+row+bicep+back+tutorial'),
  },
  iron_pullover: {
    name: 'DB Pullover', muscle: 'Lats', unit: 'kg',
    defaultSets: 4, defaultDuration: 60, defaultReps: null, isTimed: true,
    cue: 'Lie on bench, hold one DB with both hands above chest. Arc slowly behind head, keeping slight bend in elbows. Return to start. Light weight — this is a stretch movement.',
    caution: 'Shoulder bursitis — use light weight only. Stop if you feel impingement at the stretched (overhead) position.',
    demo: YT('dumbbell+pullover+lat+stretch+tutorial+form'),
  },
  iron_zottman: {
    name: 'Zottman Curl', muscle: 'Biceps', unit: 'kg',
    defaultSets: 4, defaultDuration: 60, defaultReps: null, isTimed: true,
    cue: 'Curl up with supinated (palms up) grip, rotate to pronated (palms down) at top, lower slowly with pronated grip. Trains biceps on the way up and forearms on the way down.',
    demo: YT('zottman+curl+dumbbell+tutorial+bicep+forearm'),
  },
  iron_suitcase_squat: {
    name: 'Suitcase Squat', muscle: 'Quads', unit: 'kg',
    defaultSets: 4, defaultDuration: 60, defaultReps: null, isTimed: true,
    cue: 'Feet shoulder-width, DBs held at sides (not goblet position). Squat down keeping torso upright. Resist the urge to lean — maintain a vertical torso throughout.',
    demo: YT('suitcase+squat+dumbbell+sides+tutorial'),
  },
  iron_curtsy_lunge: {
    name: 'Curtsy Lunge', muscle: 'Glutes', unit: 'kg',
    defaultSets: 4, defaultDuration: 60, defaultReps: null, isTimed: true, perSide: true,
    cue: 'Step one foot behind and across the other (curtsy position). Lower rear knee toward floor. Front knee tracks over toes. Works glutes and abductors. Return to start.',
    demo: YT('curtsy+lunge+dumbbell+glute+abductor+tutorial'),
  },
  iron_seated_calf: {
    name: 'Seated Calf Raise', muscle: 'Calves', unit: 'kg',
    defaultSets: 4, defaultDuration: 60, defaultReps: null, isTimed: true,
    cue: 'Seated, weight plates or DBs resting on knees. Rise onto balls of feet, hold 1 second at top. Lower fully to feel the stretch at the bottom. Slow, controlled tempo.',
    demo: YT('seated+calf+raise+dumbbell+knees+tutorial+form'),
  },
  iron_incline_press: {
    name: 'Incline DB Chest Press', muscle: 'Chest', unit: 'kg',
    defaultSets: 4, defaultDuration: 60, defaultReps: null, isTimed: true,
    cue: 'Low incline only (20–30°). Elbows at 45° from body — not flared. Lower to chest, press up. Higher inclines approach overhead pressing angle — stay low.',
    caution: 'Shoulder bursitis — low incline only (20–30°). Stop if you feel any shoulder impingement.',
    demo: YT('incline+dumbbell+chest+press+low+incline+form+tutorial'),
  },
  iron_bench_dip: {
    name: 'Chair / Bench Dip', muscle: 'Triceps', unit: 'bw',
    defaultSets: 4, defaultDuration: 60, defaultReps: null, isTimed: true,
    cue: 'Hands on chair edge behind, fingers pointing forward. Lower by bending elbows. Keep elbows pointing straight back — do not flare. Stop range if shoulders feel uncomfortable.',
    demo: YT('bench+dip+tricep+chair+tutorial+form'),
  },
  iron_hip_hinge_hold: {
    name: 'Hip Hinge Hold', muscle: 'Hamstrings', unit: 'kg',
    defaultSets: 4, defaultDuration: 60, defaultReps: null, isTimed: true,
    cue: 'Hinge at hips with DBs held at thighs. Hold the hinge position isometrically — back flat, slight knee bend, hamstrings loaded. Replaces Good Mornings; eliminates loaded spinal flexion risk.',
    demo: YT('hip+hinge+hold+isometric+hamstring+tutorial'),
  },
  iron_bw_hyper_ext: {
    name: 'Bodyweight Back Extension', muscle: 'Glutes', unit: 'bw',
    defaultSets: 4, defaultDuration: 60, defaultReps: null, isTimed: true,
    cue: 'Lie prone on mat. Lift chest and legs together (superman position), or just chest if lower back complains. No added load — bodyweight only. Stop if lower back is uncomfortable.',
    demo: YT('bodyweight+back+extension+prone+superman+tutorial'),
  },
  iron_lying_ham_curl: {
    name: 'Lying DB Hamstring Curl', muscle: 'Hamstrings', unit: 'kg',
    defaultSets: 4, defaultDuration: 60, defaultReps: null, isTimed: true,
    cue: 'Lie face down, feet together squeezing a single DB between them. Curl DB toward glutes, hold briefly, lower with control. Light weight — squeeze the hamstrings, no momentum.',
    demo: YT('lying+dumbbell+hamstring+curl+feet+squeeze+tutorial'),
  },
  iron_lateral_hold: {
    name: 'Lateral Raise Hold', muscle: 'Side Delts', unit: 'kg',
    defaultSets: 4, defaultDuration: 60, defaultReps: null, isTimed: true,
    cue: 'Hold DBs at shoulder height (arms extended to sides at 90°) for the set duration. Isometric lateral deltoid work. Arms stay at shoulder height — not overhead. Replaces Isometric Overhead Holds.',
    demo: YT('lateral+raise+isometric+hold+shoulder+height+tutorial'),
  },
  iron_rear_delt_row: {
    name: 'Rear Delt Row', muscle: 'Rear Delts', unit: 'kg',
    defaultSets: 4, defaultDuration: 60, defaultReps: null, isTimed: true,
    cue: 'Hinge forward, elbows flare wide as you pull. Target is to get elbows level with shoulders. Lead with elbows, not hands. Targets posterior deltoid rather than lats.',
    demo: YT('rear+delt+row+dumbbell+hinge+elbow+flare+tutorial'),
  },
  iron_front_raise: {
    name: 'Front DB Raise', muscle: 'Front Delts', unit: 'kg',
    defaultSets: 4, defaultDuration: 60, defaultReps: null, isTimed: true,
    cue: 'Straight arms, raise DBs to shoulder height in front. Control the descent — no momentum. Light weight only. Can alternate arms to manage fatigue.',
    demo: YT('front+dumbbell+raise+shoulder+tutorial+form'),
  },
  iron_crossover_stepup: {
    name: 'Cross-over Step-up', muscle: 'Glutes', unit: 'kg',
    defaultSets: 4, defaultDuration: 60, defaultReps: null, isTimed: true, perSide: true,
    cue: 'Step across midline onto bench with one foot. Drive through that hip to step up. The cross pattern emphasises the glute over the quad. Step down slowly and controlled.',
    demo: YT('crossover+step+up+glute+emphasis+dumbbell+tutorial'),
  },
  iron_squat_hold: {
    name: 'Squat Isometric Hold', muscle: 'Quads', unit: 'bw',
    defaultSets: 4, defaultDuration: 60, defaultReps: null, isTimed: true,
    cue: 'Lower to squat position and hold. Thighs parallel to floor or as low as comfortable. Chest up, weight through heels. Static hold — no pulsing, no movement.',
    demo: YT('squat+isometric+hold+wall+sit+quad+tutorial'),
  },
  iron_frog_pump: {
    name: 'Frog Pump', muscle: 'Glutes', unit: 'bw',
    defaultSets: 4, defaultDuration: 60, defaultReps: null, isTimed: true,
    cue: 'Lie on back, soles of feet pressed together, knees falling out (frog position). Press hips up using glutes. Small range, constant tension. Bodyweight only — no additional load.',
    demo: YT('frog+pump+glute+bodyweight+tutorial+form'),
  },
  iron_diamond_pushup: {
    name: 'Diamond Push-up', muscle: 'Triceps', unit: 'bw',
    defaultSets: 4, defaultDuration: 60, defaultReps: null, isTimed: true,
    cue: 'Hands form a diamond shape (index fingers and thumbs touching) on the floor. Lower chest to hands, press back up. Tricep-dominant push-up variation. Modify on knees if needed.',
    demo: YT('diamond+push+up+tricep+form+tutorial'),
  },
  iron_plank_tap: {
    name: 'High Plank Hand Tap', muscle: 'Abs', unit: 'bw',
    defaultSets: 4, defaultDuration: 60, defaultReps: null, isTimed: true,
    cue: 'High plank position. Tap opposite hand to opposite shoulder alternately while keeping hips still. Resist rotation — brace core hard. Slow and controlled.',
    demo: YT('high+plank+shoulder+tap+anti+rotation+core+tutorial'),
  },
  iron_b_stance_hip_thrust: {
    name: 'B-Stance Hip Thrust', muscle: 'Glutes', unit: 'kg',
    defaultSets: 4, defaultDuration: 60, defaultReps: null, isTimed: true, perSide: true,
    cue: 'Most load on the front leg. Rear foot just touches floor for balance only. Drive through front heel. One glute does most of the work. Back supported on bench edge.',
    demo: YT('b+stance+hip+thrust+single+leg+glute+dumbbell+tutorial'),
  },
  iron_tricep_kickback: {
    name: 'Tricep Kickback', muscle: 'Triceps', unit: 'kg',
    defaultSets: 4, defaultDuration: 60, defaultReps: null, isTimed: true,
    cue: 'Hinge forward, upper arm parallel to floor and pinned to torso. Extend forearm back until arm is straight, squeezing tricep at top. Control return. No swinging.',
    demo: YT('tricep+kickback+dumbbell+form+tutorial+isolation'),
  },
  iron_shrug: {
    name: 'DB Shrug', muscle: 'Upper Traps', unit: 'kg',
    defaultSets: 4, defaultDuration: 60, defaultReps: null, isTimed: true,
    cue: 'Dumbbells at sides. Shrug shoulders straight up toward ears, hold 1 second at top, lower with control. No neck rolling — straight up and down only.',
    demo: YT('dumbbell+shrug+upper+trap+form+tutorial'),
  },
  iron_overhead_tricep: {
    name: 'Overhead Tricep Extension', muscle: 'Triceps', unit: 'kg',
    defaultSets: 4, defaultDuration: 60, defaultReps: null, isTimed: true,
    cue: 'Hold one or two DBs overhead with both hands. Lower weight behind head by bending elbows, keeping upper arms vertical and close together. Extend back up fully.',
    demo: YT('overhead+tricep+extension+dumbbell+form+tutorial'),
  },
  iron_pushup: {
    name: 'Standard Push-up', muscle: 'Chest', unit: 'bw',
    defaultSets: 4, defaultDuration: 60, defaultReps: null, isTimed: true,
    cue: 'Hands slightly wider than shoulder-width. Elbows at 45° from body — not flared. Lower chest to floor, press back up. Body in a straight line throughout. Modify on knees if needed.',
    demo: YT('standard+push+up+form+tutorial+chest+triceps'),
  },
  iron_lean_lateral: {
    name: 'Lean-Away Lateral Raise', muscle: 'Side Delts', unit: 'kg',
    defaultSets: 4, defaultDuration: 60, defaultReps: null, isTimed: true, perSide: true,
    cue: 'Hold a fixed support with one hand, lean away to create a long lever. Raise the free arm out to the side. The lean increases range of motion and stretch at the bottom.',
    demo: YT('lean+away+lateral+raise+cable+dumbbell+tutorial'),
  },
  iron_glute_bridge: {
    name: 'Glute Bridge Hold', muscle: 'Glutes', unit: 'bw',
    defaultSets: 4, defaultDuration: 60, defaultReps: null, isTimed: true,
    cue: 'Floor-based bridge. Drive hips up to full extension and hold, or perform small pulsing movements. No bench needed. Used as the hold/isometric partner in superset pairs.',
    demo: YT('glute+bridge+hold+isometric+floor+tutorial'),
  },
};
```

- [ ] **Step 3: Add MUSCLE_META entries for all Iron exercises**

Find `const MUSCLE_META = {` in `src/IronLog.jsx` (~line 1811). Add these entries inside it, after the existing entries:

```js
  // ── Iron Series exercises ────────────────────────────────────────────────
  iron_heel_elev_squat:    ['Quads',           'Glutes'],
  iron_bulgarian_split:    ['Quads',           'Glutes'],
  iron_kas_bridge:         ['Glutes',          null],
  iron_sl_rdl:             ['Hamstrings',      'Glutes'],
  iron_bw_kickback:        ['Glutes',          null],
  iron_cyclist_squat:      ['Quads',           null],
  iron_fwd_lunge:          ['Quads',           'Glutes'],
  iron_1_5_goblet:         ['Quads',           'Glutes'],
  iron_squat_pulse:        ['Quads',           null],
  iron_b_stance_rdl:       ['Hamstrings',      'Glutes'],
  iron_sumo_dl:            ['Glutes',          'Quads'],
  iron_banded_abduct:      ['Glutes',          null],
  iron_db_row:             ['Lats',            'Biceps'],
  iron_pronated_row:       ['Lats',            'Mid Traps'],
  iron_supinated_row:      ['Lats',            'Biceps'],
  iron_pullover:           ['Lats',            null],
  iron_zottman:            ['Biceps',          'Forearms'],
  iron_suitcase_squat:     ['Quads',           'Glutes'],
  iron_curtsy_lunge:       ['Glutes',          'Quads'],
  iron_seated_calf:        ['Calves',          null],
  iron_incline_press:      ['Chest',           'Front Delts'],
  iron_bench_dip:          ['Triceps',         'Chest'],
  iron_hip_hinge_hold:     ['Hamstrings',      'Glutes'],
  iron_bw_hyper_ext:       ['Glutes',          'Spinal Erectors'],
  iron_lying_ham_curl:     ['Hamstrings',      null],
  iron_lateral_hold:       ['Side Delts',      null],
  iron_rear_delt_row:      ['Rear Delts',      'Mid Traps'],
  iron_front_raise:        ['Front Delts',     null],
  iron_crossover_stepup:   ['Glutes',          'Quads'],
  iron_squat_hold:         ['Quads',           null],
  iron_frog_pump:          ['Glutes',          null],
  iron_diamond_pushup:     ['Triceps',         'Chest'],
  iron_plank_tap:          ['Abs',             'Obliques'],
  iron_b_stance_hip_thrust:['Glutes',          null],
  iron_tricep_kickback:    ['Triceps',         null],
  iron_shrug:              ['Upper Traps',     null],
  iron_overhead_tricep:    ['Triceps',         null],
  iron_pushup:             ['Chest',           'Triceps'],
  iron_lean_lateral:       ['Side Delts',      null],
  iron_glute_bridge:       ['Glutes',          null],
```

- [ ] **Step 4: Build and verify**

```bash
node build.js
# Expected: ✓ Built dist/index.html and index.html (NNN KB)
# No errors in output
```

- [ ] **Step 5: Commit**

```bash
git add src/IronLog.jsx dist/index.html index.html version.json
git commit -m "feat: add IRON_EXERCISES constant and MUSCLE_META entries (40 exercises)"
```

---

## Task 2: IRON_WORKOUTS constant + nextIronDay function

**Files:**
- Modify: `src/IronLog.jsx` — add after the `WORKOUTS` closing `};` (~line 850), before SUPABASE SYNC

- [ ] **Step 1: Locate insertion point**

Find the end of `const WORKOUTS = { ... };` in `src/IronLog.jsx`. Add the following immediately after it.

- [ ] **Step 2: Add IRON_WORKOUTS constant**

Each entry: `day` (1-30), `title`, `ytId` (video ID or `null`), `format` (display string), `defaultSets`, `defaultDuration` (seconds), `exercises` (array of exercise IDs), optional `supersets` (array of `[idxA, idxB]` pairs for visual grouping).

```js
// ─── IRON SERIES WORKOUTS — 30-day dumbbell programme ──────────────────────
// ytId: direct YouTube video ID where known; null = use playlist link.
// supersets: pairs of adjacent exercise indices displayed with a SUPERSET label.
const IRON_WORKOUTS = [
  {
    day: 1, title: 'Legs', ytId: 'SCxNnWW2zB8',
    format: '4 × 60s work / 30s rest', defaultSets: 4, defaultDuration: 60,
    exercises: ['iron_heel_elev_squat', 'rdl', 'split_squat', 'iron_bulgarian_split', 'p_sumo_squat'],
  },
  {
    day: 2, title: 'Upper Body', ytId: null,
    format: '4 × 60s work / 30s rest', defaultSets: 4, defaultDuration: 60,
    exercises: ['p_db_shoulder_press', 'iron_db_row', 'db_bench', 'p_lateral_raise', 'iron_pushup'],
  },
  {
    day: 3, title: 'Glutes', ytId: null,
    format: '4 × 60s work / 30s rest', defaultSets: 4, defaultDuration: 60,
    exercises: ['hip_thrust', 'iron_kas_bridge', 'iron_sl_rdl', 'p_sumo_squat', 'iron_bw_kickback'],
  },
  {
    day: 4, title: 'Full Body Circuits', ytId: null,
    format: '9 moves × 3 rounds / 40s work / 20s rest', defaultSets: 3, defaultDuration: 40,
    exercises: ['iron_db_row', 'reverse_lunge', 'rdl', 'db_bench', 'p_db_shoulder_press', 'iron_heel_elev_squat', 'p_hammer_curl', 'p_skull_crushers', 'db_row_1arm'],
  },
  {
    day: 5, title: 'Arms & Abs', ytId: null,
    format: '4 × 60s work / 30s rest', defaultSets: 4, defaultDuration: 60,
    exercises: ['p_db_bicep_curl', 'iron_overhead_tricep', 'p_hammer_curl', 'iron_diamond_pushup', 'p_plank'],
  },
  {
    day: 6, title: 'Quads', ytId: null,
    format: '4 × 60s work / 30s rest', defaultSets: 4, defaultDuration: 60,
    exercises: ['iron_heel_elev_squat', 'iron_cyclist_squat', 'iron_fwd_lunge', 'iron_1_5_goblet', 'iron_squat_pulse'],
  },
  {
    day: 7, title: 'Shoulders & Triceps', ytId: null,
    format: '4 × 60s work / 30s rest', defaultSets: 4, defaultDuration: 60,
    exercises: ['p_lateral_raise', 'iron_lean_lateral', 'iron_bench_dip', 'p_skull_crushers', 'p_rear_delt_fly'],
  },
  {
    day: 8, title: 'Glutes & Hamstrings', ytId: null,
    format: '4 × 60s work / 30s rest', defaultSets: 4, defaultDuration: 60,
    exercises: ['rdl', 'hip_thrust', 'iron_b_stance_rdl', 'iron_sumo_dl', 'iron_banded_abduct'],
  },
  {
    day: 9, title: 'Full Body Cardio', ytId: null,
    format: 'Continuous interval circuit', defaultSets: 3, defaultDuration: 40,
    exercises: ['iron_db_row', 'goblet_squat', 'reverse_lunge', 'iron_plank_tap'],
  },
  {
    day: 10, title: 'Back & Biceps', ytId: null,
    format: '4 × 60s work / 30s rest', defaultSets: 4, defaultDuration: 60,
    exercises: ['iron_pronated_row', 'iron_supinated_row', 'p_hammer_curl', 'iron_pullover', 'iron_zottman'],
  },
  {
    day: 11, title: 'Legs + Calves', ytId: null,
    format: '4 × 60s work / 30s rest', defaultSets: 4, defaultDuration: 60,
    exercises: ['iron_suitcase_squat', 'iron_curtsy_lunge', 'rdl', 'calf_raises', 'iron_seated_calf'],
  },
  {
    day: 12, title: 'Chest & Triceps', ytId: null,
    format: '4 × 60s work / 30s rest', defaultSets: 4, defaultDuration: 60,
    exercises: ['db_bench', 'iron_incline_press', 'p_db_fly', 'p_close_grip_bench', 'iron_bench_dip'],
  },
  {
    day: 13, title: 'Posterior Chain', ytId: null,
    format: '4 × 60s work / 30s rest', defaultSets: 4, defaultDuration: 60,
    exercises: ['rdl', 'db_row_1arm', 'iron_hip_hinge_hold', 'hip_thrust', 'iron_bw_hyper_ext'],
  },
  {
    day: 14, title: 'Unilateral Full Body', ytId: null,
    format: '4 × 60s per side', defaultSets: 4, defaultDuration: 60,
    exercises: ['db_row_1arm', 'iron_sl_rdl', 'step_ups', 'p_db_shoulder_press'],
  },
  {
    day: 15, title: 'Shoulders', ytId: null,
    format: '4 × 60s work / 30s rest', defaultSets: 4, defaultDuration: 60,
    exercises: ['p_db_shoulder_press', 'p_lateral_raise', 'iron_front_raise', 'iron_rear_delt_row', 'iron_lateral_hold'],
  },
  {
    day: 16, title: 'Hamstrings', ytId: null,
    format: '4 × 60s work / 30s rest', defaultSets: 4, defaultDuration: 60,
    exercises: ['iron_lying_ham_curl', 'rdl', 'iron_hip_hinge_hold'],
  },
  {
    day: 17, title: 'Complete Upper Body', ytId: null,
    format: '4 × 60s work / 30s rest', defaultSets: 4, defaultDuration: 60,
    exercises: ['iron_db_row', 'db_bench', 'p_db_shoulder_press', 'p_db_bicep_curl', 'iron_overhead_tricep'],
  },
  {
    day: 18, title: 'Glutes Supersets', ytId: null,
    format: 'Supersets — no rest between pairs', defaultSets: 4, defaultDuration: 60,
    exercises: ['hip_thrust', 'iron_kas_bridge', 'p_sumo_squat', 'iron_squat_pulse', 'iron_b_stance_hip_thrust', 'iron_glute_bridge'],
    supersets: [[0, 1], [2, 3], [4, 5]],
  },
  {
    day: 19, title: 'Full Body Muscle Building', ytId: null,
    format: 'Straight sets + supersets mixed', defaultSets: 4, defaultDuration: 60,
    exercises: ['goblet_squat', 'db_row_1arm', 'db_bench', 'p_hammer_curl'],
  },
  {
    day: 20, title: 'Arms, Abs & Core Supersets', ytId: null,
    format: 'Supersets — 60s on back-to-back moves', defaultSets: 4, defaultDuration: 60,
    exercises: ['p_db_bicep_curl', 'p_hammer_curl', 'iron_overhead_tricep', 'iron_tricep_kickback', 'p_dead_bug'],
    supersets: [[0, 1], [2, 3]],
  },
  {
    day: 21, title: 'Legs + Step-ups', ytId: null,
    format: '4 × 60s work / 30s rest', defaultSets: 4, defaultDuration: 60,
    exercises: ['step_ups', 'reverse_lunge', 'iron_crossover_stepup', 'goblet_squat'],
  },
  {
    day: 22, title: 'Chest & Back Antagonist', ytId: null,
    format: 'Antagonist pairs — push immediately to pull', defaultSets: 4, defaultDuration: 60,
    exercises: ['db_bench', 'iron_db_row', 'p_db_fly', 'p_rear_delt_fly', 'p_close_grip_bench', 'iron_pronated_row'],
    supersets: [[0, 1], [2, 3], [4, 5]],
  },
  {
    day: 23, title: 'Glutes & Hamstrings Supersets', ytId: null,
    format: 'Supersets — extended tension blocks', defaultSets: 4, defaultDuration: 60,
    exercises: ['rdl', 'iron_hip_hinge_hold', 'hip_thrust', 'iron_glute_bridge', 'p_sumo_squat', 'iron_squat_pulse'],
    supersets: [[0, 1], [2, 3], [4, 5]],
  },
  {
    day: 24, title: 'Full Body Circuits', ytId: null,
    format: 'Continuous circuit rounds', defaultSets: 3, defaultDuration: 40,
    exercises: ['goblet_squat', 'iron_db_row', 'p_lateral_raise', 'reverse_lunge', 'iron_diamond_pushup'],
  },
  {
    day: 25, title: 'Shoulders Supersets', ytId: null,
    format: 'Supersets — deltoid continuous fatigue', defaultSets: 4, defaultDuration: 60,
    exercises: ['p_db_shoulder_press', 'p_lateral_raise', 'iron_front_raise', 'iron_rear_delt_row', 'p_rear_delt_fly', 'iron_shrug'],
    supersets: [[0, 1], [2, 3], [4, 5]],
  },
  {
    day: 26, title: 'Legs Circuits', ytId: null,
    format: 'High density leg circuit', defaultSets: 3, defaultDuration: 40,
    exercises: ['step_ups', 'split_squat', 'iron_squat_hold', 'rdl'],
  },
  {
    day: 27, title: 'Upper Body Antagonist', ytId: null,
    format: 'Antagonist pairs — push vs pull', defaultSets: 4, defaultDuration: 60,
    exercises: ['iron_db_row', 'db_bench', 'p_lateral_raise', 'iron_rear_delt_row', 'p_hammer_curl', 'iron_tricep_kickback'],
    supersets: [[0, 1], [2, 3], [4, 5]],
  },
  {
    day: 28, title: 'Iron Glutes', ytId: null,
    format: '4 × constant tension blocks', defaultSets: 4, defaultDuration: 60,
    exercises: ['hip_thrust', 'iron_kas_bridge', 'p_sumo_squat', 'iron_frog_pump'],
  },
  {
    day: 29, title: 'Final Full Body', ytId: null,
    format: '4 heavy compound sets per movement', defaultSets: 4, defaultDuration: 60,
    exercises: ['iron_heel_elev_squat', 'rdl', 'iron_db_row', 'p_db_shoulder_press', 'suitcase_carry'],
  },
  {
    day: 30, title: 'Arms, Abs & Core Finale', ytId: null,
    format: 'High volume sets + finisher track', defaultSets: 4, defaultDuration: 60,
    exercises: ['p_db_bicep_curl', 'iron_overhead_tricep', 'p_hammer_curl', 'p_skull_crushers', 'p_plank'],
  },
];
```

- [ ] **Step 3: Add nextIronDay function**

Immediately after the `nextWorkout` function (~line 933), add:

```js
// Returns the next Iron Series day number (1-30). Loops back to 1 after Day 30.
function nextIronDay(sessions) {
  const done = sessions.filter(s => s.completed && s.workout?.startsWith('IRON_'));
  if (!done.length) return 1;
  const last = done[done.length - 1].workout;          // e.g. 'IRON_4'
  const lastDay = parseInt(last.split('_')[1], 10);
  return lastDay >= 30 ? 1 : lastDay + 1;
}

// Returns the IRON_WORKOUTS entry for the given day number (1-30).
function getIronWorkout(day) {
  return IRON_WORKOUTS.find(w => w.day === day) || IRON_WORKOUTS[0];
}
```

- [ ] **Step 4: Research remaining YouTube video IDs**

Navigate to the Iron Series playlist: `https://www.youtube.com/playlist?list=PLhu1QCKrfgPWmStsg7imo5EQ0zmkxymJ2`

For each video (Days 2–30), click through and copy the `v=` parameter from the URL. Update the corresponding `ytId` field in `IRON_WORKOUTS`. Day 1 is already set (`SCxNnWW2zB8`). Leave `ytId: null` for any day where the direct URL is not found — the component will fall back to the playlist URL.

- [ ] **Step 5: Build and verify**

```bash
node build.js
# Expected: ✓ Built dist/index.html and index.html (NNN KB)
```

- [ ] **Step 6: Commit**

```bash
git add src/IronLog.jsx dist/index.html index.html version.json
git commit -m "feat: add IRON_WORKOUTS constant and nextIronDay/getIronWorkout functions"
```

---

## Task 3: IronSeriesView component + Workout tab toggle

**Files:**
- Modify: `src/IronLog.jsx` — add `IronSeriesView` component; modify the Workout tab rendering

- [ ] **Step 1: Add IronSeriesView component**

Find the `function ActiveWorkout(` declaration. Add `IronSeriesView` immediately before it:

```js
// ─── IRON SERIES VIEW ──────────────────────────────────────────────────────
// Shown when the "Iron Series" toggle is active on the Workout tab.
function IronSeriesView({ sessions, allExercises, onStart }) {
  const day = nextIronDay(sessions);
  const wkt = getIronWorkout(day);
  const PLAYLIST = 'https://www.youtube.com/playlist?list=PLhu1QCKrfgPWmStsg7imo5EQ0zmkxymJ2';
  const ytUrl = wkt.ytId ? `https://www.youtube.com/watch?v=${wkt.ytId}` : PLAYLIST;

  // Week number (1-6) and progress
  const week = Math.ceil(day / 5);
  const totalDone = sessions.filter(s => s.completed && s.workout?.startsWith('IRON_')).length % 30;

  return (
    <div style={{ padding: '16px 14px' }}>
      {/* Week strip */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        {[1, 2, 3, 4, 5, 6].map(w => (
          <div key={w} style={{
            flex: 1, textAlign: 'center', padding: '5px 0',
            borderRadius: 7, fontSize: 11, fontWeight: 700,
            background: w < week ? C.dim : w === week ? C.amber : C.dim,
            color: w < week ? C.amber : w === week ? '#fff' : C.muted,
            border: w < week ? `1px solid ${C.amber}` : 'none',
          }}>
            Wk {w}
          </div>
        ))}
      </div>

      {/* Day card */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14, marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <div style={{ fontFamily: C.fCond, fontSize: 13, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 1 }}>
            🔩 Day {day} of 30
          </div>
          <div style={{ fontSize: 11, color: C.muted }}>{wkt.format}</div>
        </div>
        <div style={{ fontFamily: C.fCond, fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 10 }}>
          {wkt.title}
        </div>

        {/* Exercise list */}
        <div style={{ marginBottom: 10 }}>
          {wkt.exercises.map((exId, idx) => {
            const def = allExercises[exId];
            if (!def) return null;
            const isSuperset = wkt.supersets?.some(([a, b]) => b === idx);
            return (
              <div key={idx}>
                {isSuperset && (
                  <div style={{ textAlign: 'center', fontSize: 9, fontWeight: 700, color: C.amber, letterSpacing: 1, textTransform: 'uppercase', padding: '2px 0' }}>
                    SUPERSET
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', borderBottom: `1px solid ${C.dim}` }}>
                  <div style={{ width: 18, height: 18, borderRadius: 4, background: C.dim, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: C.muted }}>
                    {idx + 1}
                  </div>
                  <div style={{ flex: 1, fontSize: 13, color: C.text }}>{def.name}</div>
                  {def.perSide && <div style={{ fontSize: 10, color: C.muted }}>/ side</div>}
                </div>
              </div>
            );
          }).filter(Boolean)}
        </div>

        {/* YouTube link */}
        <a href={ytUrl} target="_blank" rel="noopener noreferrer"
          style={{ display: 'block', textAlign: 'center', fontSize: 12, color: C.amber, textDecoration: 'none', marginBottom: 10 }}>
          ▶ Watch on YouTube
        </a>
      </div>

      {/* Start button */}
      <button
        onClick={() => onStart(`IRON_${day}`)}
        style={{ ...st.btn('lg'), width: '100%', background: C.amber, color: '#fff', fontFamily: C.fCond, fontSize: 17, fontWeight: 700 }}>
        ▶ Start Iron Day {day}
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Add toggle state to the Workout tab**

Find the component that renders the Workout tab (look for where `selectedWorkout` and the "Start Workout" button are rendered — this is likely inside `App` or a `WorkoutTab` section). Add `ironView` state and the toggle control.

Search for the text `selectedWorkout` in the JSX rendering section to find the Workout tab render. Add state at the top of `App`:

```js
const [ironView, setIronView] = useState(false);
```

- [ ] **Step 3: Add the toggle and conditional render**

In the Workout tab JSX (the section rendered when `view === 'workout'` or similar), wrap the existing content and add the toggle at the top:

```jsx
{/* Segmented toggle */}
<div style={{ display: 'flex', background: C.dim, borderRadius: 10, padding: 3, margin: '12px 14px 0', gap: 3 }}>
  {[['My Split', false], ['🔩 Iron Series', true]].map(([label, val]) => (
    <button key={label} onClick={() => setIronView(val)} style={{
      flex: 1, padding: '7px 4px',
      borderRadius: 7, border: 'none',
      background: ironView === val ? C.card : 'transparent',
      color: ironView === val ? C.text : C.muted,
      fontFamily: C.fCond, fontSize: 13, fontWeight: 700,
      boxShadow: ironView === val ? '0 1px 3px rgba(0,0,0,0.10)' : 'none',
      cursor: 'pointer',
    }}>
      {label}
    </button>
  ))}
</div>

{/* Conditional content */}
{ironView
  ? <IronSeriesView sessions={sessions} allExercises={allExercises} onStart={key => {
      const sess = buildSession(key, sessions, allExercises);
      if (sess) { setActive(sess); setView('active'); }
    }} />
  : /* existing Workout tab content unchanged */
    <> {/* ...existing A/B/C workout picker JSX... */} </>
}
```

Note: The exact prop names (`sessions`, `allExercises`, `setActive`, `setView`) must match what is already used in the surrounding component. Read the existing Workout tab code carefully before wiring up.

- [ ] **Step 4: Build and verify**

```bash
node build.js
# Expected: ✓ Built — no errors
```

Open the app, navigate to Workout tab, verify the toggle appears and the Iron Series view shows Day 1.

- [ ] **Step 5: Commit**

```bash
git add src/IronLog.jsx dist/index.html index.html version.json
git commit -m "feat: add IronSeriesView component and Workout tab toggle"
```

---

## Task 4: Session flow — buildSession + ActiveWorkout phase skip

**Files:**
- Modify: `src/IronLog.jsx` — `buildSession` function; `ActiveWorkout` component

- [ ] **Step 1: Add Iron branch to buildSession**

Find `function buildSession(workoutKey, ...)`. Add an early-return branch at the very top of the function, before the existing `const wkt = WORKOUTS[workoutKey];` line:

```js
function buildSession(workoutKey, prevSessions, allExercises = EXERCISES, workoutCustom = {}, workoutHidden = {}, preStartSwaps = {}) {
  // ── Iron Series sessions ─────────────────────────────────────────────────
  if (workoutKey.startsWith('IRON_')) {
    const dayNum = parseInt(workoutKey.split('_')[1], 10);
    const ironWkt = getIronWorkout(dayNum);
    const exercises = ironWkt.exercises.map(exId => {
      const def = allExercises[exId];
      if (!def) return null;
      const last = getLastLogged(prevSessions, exId);
      const sets = Array.from({ length: ironWkt.defaultSets }, (_, i) => {
        const ls = last?.sets?.[i] || last?.sets?.[0];
        return {
          weight: ls?.weight ?? '',
          reps: null,
          duration: ls?.duration ?? ironWkt.defaultDuration,
          rpe: null, pain: null, done: false,
        };
      });
      return { id: exId, sets, notes: '' };
    }).filter(Boolean);
    return {
      id: Date.now().toString(),
      workout: workoutKey,
      date: new Date().toISOString(),
      startTime: Date.now(),
      energy: null,
      exercises,
      notes: '',
      completed: false,
      phase: 'energy',
    };
  }
  // ── A/B/C sessions (existing code unchanged below) ──────────────────────
  const wkt = WORKOUTS[workoutKey];
  // ... rest of existing function unchanged
```

- [ ] **Step 2: Skip warmup phase for Iron sessions**

In `ActiveWorkout`, find where the energy check submission transitions the session to the warmup phase. Look for code that sets `phase: 'warmup'` or calls `setSession(s => ({ ...s, phase: 'warmup' }))`.

Add an Iron-aware check:

```js
// Before: setSession(s => ({ ...s, phase: 'warmup' }))
// After:
const isIron = session.workout?.startsWith('IRON_');
setSession(s => ({ ...s, phase: isIron ? 'workout' : 'warmup' }));
```

- [ ] **Step 3: Skip finisher phase for Iron sessions**

In `ActiveWorkout`, find where completing the last exercise transitions to `phase: 'finisher'`. Add the same Iron check:

```js
// Before: setSession(s => ({ ...s, phase: 'finisher' }))
// After:
const isIron = session.workout?.startsWith('IRON_');
if (isIron) {
  // Iron sessions complete directly — no finisher
  const completed = { ...session, completed: true };
  onComplete(completed);
} else {
  setSession(s => ({ ...s, phase: 'finisher' }));
}
```

Note: `onComplete` is whatever callback `ActiveWorkout` uses to finish a session. Check the existing `phase: 'finisher'` transition code to find the right pattern — copy the session-completion logic from the finisher completion handler and use it here.

- [ ] **Step 4: Build and verify**

```bash
node build.js
```

Test manually:
1. Start an Iron Day session from the Workout tab
2. Confirm energy check appears, then goes straight to exercises (no warmup screen)
3. Complete all sets of all exercises, confirm session completes without a finisher screen
4. Check `il_sessions` in localStorage — the entry should have `workout: 'IRON_1'`

- [ ] **Step 5: Commit**

```bash
git add src/IronLog.jsx dist/index.html index.html version.json
git commit -m "feat: Iron sessions skip warmup and finisher phases in ActiveWorkout"
```

---

## Task 5: History badge for Iron sessions

**Files:**
- Modify: `src/IronLog.jsx` — `History` component

- [ ] **Step 1: Find the workout badge renderer in History**

In the `History` component, find where it renders the workout letter badge (e.g. the `A`, `B`, `C` coloured circle or chip at the top of each session card). This is typically inside the card header render.

- [ ] **Step 2: Add Iron badge branch**

```js
// Find the existing badge render, something like:
//   <div ...>{sess.workout}</div>
// Replace with:

const isIron = sess.workout?.startsWith('IRON_');
const ironDay = isIron ? parseInt(sess.workout.split('_')[1], 10) : null;
const ironWkt = isIron ? getIronWorkout(ironDay) : null;
```

In the card header JSX, replace or wrap the existing workout badge:

```jsx
{isIron ? (
  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
    <div style={{
      background: C.dim, border: `1px solid ${C.border}`,
      borderRadius: 8, padding: '3px 8px',
      fontFamily: C.fCond, fontSize: 13, fontWeight: 700, color: C.text,
    }}>
      🔩 {ironDay}
    </div>
    <div style={{ fontSize: 12, color: C.muted }}>{ironWkt?.title}</div>
  </div>
) : (
  /* existing A/B/C badge JSX unchanged */
)}
```

Also update the History card title line (which typically shows the workout title like "Push — Chest · Shoulders · Triceps"):

```js
const workoutTitle = isIron
  ? `Iron Series — Day ${ironDay}`
  : WORKOUTS[sess.workout]?.title || sess.workout;
```

- [ ] **Step 3: Build and verify**

```bash
node build.js
```

Complete at least one Iron session and check the Log tab — the session card should show `🔩 1` badge and "Iron Series — Day 1" title.

- [ ] **Step 4: Commit**

```bash
git add src/IronLog.jsx dist/index.html index.html version.json
git commit -m "feat: History displays Iron session badge and day title"
```

---

## Task 6: allExercises merge + final integration + CHANGELOG

**Files:**
- Modify: `src/IronLog.jsx` — `allExercises` merge in `App`; `CHANGELOG.md`

- [ ] **Step 1: Add IRON_EXERCISES to allExercises merge**

In the `App` component, find where `allExercises` is assembled. It currently looks like:

```js
const allExercises = { ...EXERCISES, ...PRESET_LIBRARY, ...customExercises };
```

Add `IRON_EXERCISES`:

```js
const allExercises = { ...EXERCISES, ...PRESET_LIBRARY, ...IRON_EXERCISES, ...customExercises };
```

This ensures `buildSession`, `IronSeriesView`, `History`, and `Progress` all see Iron exercise definitions.

- [ ] **Step 2: Verify nextIronDay is called correctly**

In `App`, the initial `selectedWorkout` is derived from `nextWorkout(sessions)`. Iron's next day is tracked separately via `nextIronDay(sessions)` inside `IronSeriesView`. No App-level state change is needed — `IronSeriesView` calls `nextIronDay` directly. Confirm there is no conflict.

- [ ] **Step 3: Build final**

```bash
node build.js
# Expected: ✓ Built dist/index.html and index.html (NNN KB)
```

- [ ] **Step 4: Manual integration smoke test**

1. Open the app (open `index.html` in browser or deploy)
2. Workout tab → toggle to Iron Series → verify Day 1 shows with exercise list
3. Tap "Start Iron Day 1" → energy check → straight to exercises (no warmup)
4. Log some sets → complete → session saved
5. Return to Workout tab → toggle Iron → verify Day 2 shows
6. Log tab → verify 🔩 1 badge appears on the Iron session
7. Stats tab → verify exercises like RDL, hip_thrust show data from Iron session

- [ ] **Step 5: Update CHANGELOG**

Add an entry at the top of `CHANGELOG.md`:

```markdown
## 2026-05-30 — Iron Series Integration

- Added Caroline Girvan's Iron Series (30 workouts, 6-week dumbbell programme) as a parallel programme
- Workout tab now has "My Split / 🔩 Iron Series" toggle — both programmes track independently
- 40 new exercises in `IRON_EXERCISES` constant; 30 workouts in `IRON_WORKOUTS` constant
- `nextIronDay(sessions)` derives next Iron day from session history; loops back to Day 1 after Day 30
- Iron sessions: energy check → exercises → complete (no warmup, no finisher; user follows video)
- `defaultDuration` is reference-only — no timer lockout; user follows video timing
- History: Iron sessions show `🔩 N` day badge and "Iron Series — Day N" title
- Exercises shared with A/B/C (RDL, hip thrust, etc.) contribute to the same Stats charts
- 40 MUSCLE_META entries added for all new Iron exercises
- Icons and YouTube video IDs (Days 2–30) are a separate Codex pass — see ICON-GUIDE.md
```

- [ ] **Step 6: Final commit and push**

```bash
git add src/IronLog.jsx dist/index.html index.html version.json CHANGELOG.md
git commit -m "feat: Iron Series integration — 30 workouts, toggle, session flow, history badge"
git push origin main
```

---

## Post-implementation: separate Codex passes

These are NOT part of this plan — hand off separately:

**Icon pass:** Generate 40 exercise icons (324×324px) + demo animation frames (1024×1024px) following `ICON-GUIDE.md`. After each icon is saved to `assets/icons/iron_*.png`, add the ID to `PNG_EXERCISE_ICON_IDS` in `src/IronLog.jsx`.

**YouTube ID pass:** Navigate to each Iron Series video in the playlist, extract the `v=` ID from the URL, update the `ytId` field for Days 2–30 in `IRON_WORKOUTS`.
