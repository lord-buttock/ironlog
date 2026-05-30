# Iron Series Integration — Design Spec
*2026-05-30 — approved by Phill*

---

## Overview

Add Caroline Girvan's Iron Series (30-workout, 6-week dumbbell programme) as a parallel programme in IronLog alongside the existing A/B/C push/pull/legs split. The two programmes run independently — Phill chooses session by session which to do.

Playlist: https://www.youtube.com/playlist?list=PLhu1QCKrfgPWmStsg7imo5EQ0zmkxymJ2

---

## Design decisions

| Decision | Choice | Rationale |
|---|---|---|
| Programme coexistence | Both run in parallel; Phill picks each session | User chose Option A (parallel tracking) |
| Entry point | Workout tab toggle: "My Split" / "🔩 Iron Series" | User chose Option B (toggle) |
| Session storage | `workout: 'IRON_1'` … `'IRON_30'` in existing `il_sessions` | No new storage key; Log tab handles automatically |
| Exercise IDs | Reuse existing IDs where movement matches; new `iron_*` for Iron-only movements | Unified progress charts across both programmes |
| Tracking | Weight logged per set; `isTimed: true`, `defaultDuration` per workout format | Consistent with existing timed exercises (e.g. `farmers_walk`) |
| Session flow | Energy check → exercises → complete | No warmup (video handles it); no finisher |
| Constraint violations | Replace 10 flagged exercises with safer alternatives | See replacement table below |

---

## Entry point — Workout tab toggle

Segmented control added at top of Workout tab:

```
[ My Split ]  [ 🔩 Iron Series ]
```

**My Split** (default): unchanged — next A/B/C workout exactly as today.

**🔩 Iron Series** view shows:
- Week strip: 6 chips (Wk 1–6); completed weeks tinted blue, current week filled solid blue
- Day card: "Day N of 30 · [Title]" with the exercise list for that day
- "▶ Watch on YouTube" link — opens the video in Safari/browser
- "▶ Start Iron Day N" primary button

---

## Session flow for Iron sessions

```
Energy check → Exercises → Complete
```

- **No warmup screen** — the video handles warm-up internally
- **No finisher screen** — programme has no finisher structure
- Exercises displayed and logged using the standard `SetRow` component
- All sets are timed (`isTimed: true`)

---

## Progression tracking

```js
function nextIronDay(sessions) {
  const done = sessions.filter(s => s.completed && s.workout?.startsWith('IRON_'));
  if (!done.length) return 1;
  const last = done[done.length - 1].workout;       // e.g. 'IRON_4'
  const lastDay = parseInt(last.split('_')[1], 10);
  return lastDay >= 30 ? 1 : lastDay + 1;           // loops back to Day 1 after Day 30
}
```

When all 30 days are complete, the programme loops back to Day 1. The Iron Series is designed to be repeated.

---

## History (Log tab)

Iron sessions appear in the existing history list alongside A/B/C sessions.

- Badge: `🔩 4` (day number) instead of a workout letter
- Subtitle: day title (e.g. "Full Body Circuits")
- Expandable card: exercises and sets logged, same layout as A/B/C

---

## Stats (Progress tab)

Exercises shared with A/B/C (e.g. `rdl`, `hip_thrust`, `goblet_squat`) accumulate data across both programmes in the same chart. New Iron-only exercises appear in their own chart once logged.

---

## Workout format variations

Most Iron days use 4 sets × 60s work / 30s rest. Exceptions:

| Days | Format | defaultSets | defaultDuration |
|---|---|---|---|
| 1–3, 5–8, 10–17, 21, 28–30 | 4 sets × 60s / 30s rest | 4 | 60 |
| Day 4 | 9 moves × 3 rounds, 40s / 20s rest | 3 | 40 |
| Day 9 | Continuous interval circuit | 3 | 40 |
| Days 18, 20, 22, 23, 25, 27 | Supersets (back-to-back pairs) | 4 | 60 |
| Day 19 | Mixed straight + supersets | 4 | 60 |

**Supersets:** Represented as adjacent exercises in the list with a small "SUPERSET" label between them. No change to the exercise data model — just visual grouping.

### Timer behaviour for Iron sessions

`defaultDuration` is a **reference value only** — it pre-fills the duration field in the set row so the log reflects the programme's intended interval length. It does **not** trigger an automatic countdown or lock the user out when the time expires.

Phill follows the video for actual timing. He can continue an exercise past the 60-second target (or stop early) without IronLog interfering. The logged duration stays editable, just like weight and reps in A/B/C sessions. The existing rest timer between sets remains available but is optional — the video handles rest cues.

---

## Constraint modifications — exercise replacements

| Original exercise | Days | Issue | Replaced with |
|---|---|---|---|
| Arnold Press | 7, 24, 27 | Overhead rotation → shoulder bursitis | Lateral Raises |
| Isometric Overhead Holds | 15 | Sustained overhead position | Lateral Raise Hold (arms at 90°) |
| Squat-to-Overhead Press | 19 | Explosive overhead load | Goblet Squat |
| Clean & Presses | 9 | Explosive overhead | Bent-Over DB Rows |
| Devil Presses | 9 | Burpee + overhead | Reverse Lunges |
| Renegade Rows | 4 | Loaded rotation in plank → disc | Single-Arm DB Row |
| Good Mornings | 13, 16, 23 | Loaded spinal flexion → disc | Hip Hinge Hold (isometric) |
| Deficit RDLs | 16 | Excessive hamstring range → disc | Standard RDLs |
| Decline / Reverse Crunches | 20 | Spinal flexion → disc | Dead Bug |
| Hollow Body Holds | 5, 30 | Spinal flexion load | Forearm Plank |

**Kept as-is (user preference):** Chair/Bench Dips (Days 7, 12), Overhead Tricep Extensions (Days 5, 17, 20, 30).

**Seated DB shoulder press** appears in Days 2, 14, 17, 25, 27, 29 — explicitly approved for shoulder bursitis per medical constraints. No change.

---

## Exercise ID strategy

### Reuse existing IDs

| Existing ID | Used for |
|---|---|
| `rdl` | All RDL variations (standard) |
| `hip_thrust` | Hip thrusts and floor hip thrusts |
| `reverse_lunge` | All reverse lunge variations |
| `goblet_squat` | Goblet squats and heel-elevated goblet squats |
| `split_squat` | Static lunges, split squats |
| `step_ups` | Weighted step-ups |
| `calf_raises` | Standing calf raises |
| `suitcase_carry` | Suitcase carries (Day 29) |
| `db_row_1arm` | Single-arm bent-over rows |
| `db_bench` | Flat DB chest press |
| `reverse_fly` | Rear delt flies |
| `p_db_shoulder_press` | All seated overhead shoulder press variations |
| `p_lateral_raise` | Lateral raises and lean-away lateral raises |
| `p_db_bicep_curl` | Bicep curls and supinating curls |
| `p_hammer_curl` | Hammer curls, cross-body hammer curls |
| `p_skull_crushers` | Skull crushers |
| `p_rear_delt_fly` | Rear delt flies (where used interchangeably) |
| `p_db_fly` | Floor chest flies |
| `p_close_grip_bench` | Close-grip DB presses |
| `p_dead_bug` | Dead Bug (replacement for crunches) |
| `p_plank` | Forearm planks (replacement for hollow body holds) |
| `p_sumo_squat` | Sumo squats |

### New `IRON_EXERCISES` entries

| ID | Name | Notes |
|---|---|---|
| `iron_heel_elev_squat` | Heel-Elevated Squat | Yoga block under heels; quad-dominant |
| `iron_bulgarian_split` | Bulgarian Split Squat | Rear foot elevated on chair |
| `iron_kas_bridge` | Kas Glute Bridge | Small ROM, constant glute tension; no lockout |
| `iron_sl_rdl` | Single-Leg RDL | Per side; light load, balance focus |
| `iron_bw_kickback` | Bodyweight Glute Kickback | Banded or unloaded; prone or quadruped |
| `iron_cyclist_squat` | Cyclist Squat | Very narrow stance, heels elevated; extreme quad isolation |
| `iron_fwd_lunge` | Forward Alternating Lunge | Step forward; more quad than reverse lunge |
| `iron_1_5_goblet` | 1.5 Rep Goblet Squat | Full rep + half rep = 1 rep; constant tension |
| `iron_squat_pulse` | Bodyweight Squat Pulse | Partial range pulses at bottom; BW only |
| `iron_b_stance_rdl` | B-Stance RDL | Staggered stance; most load on front leg |
| `iron_sumo_dl` | Sumo Deadlift | Wide stance DB pull from floor |
| `iron_banded_abduct` | Banded Glute Abduction | Seated or lying; resistance band |
| `iron_db_row` | Bent-Over DB Row (dual) | Standing hinge; both arms; not chest-supported |
| `iron_pronated_row` | Pronated (Palms Down) Row | Overhand grip; more upper back / rear delt |
| `iron_supinated_row` | Supinated (Palms Up) Row | Underhand grip; more bicep involvement |
| `iron_pullover` | DB Pullover | Lying; arm arcs overhead — note shoulder caution |
| `iron_zottman` | Zottman Curl | Supinate on the way up, pronate on the way down |
| `iron_suitcase_squat` | Suitcase Squat | DB at sides (not goblet); upright torso |
| `iron_curtsy_lunge` | Curtsy Lunge | Rear foot crosses behind; glute/abductor focus |
| `iron_seated_calf` | Seated Calf Raise | Seated, weight plate on knees |
| `iron_incline_press` | Incline DB Chest Press | Low incline only (20–30°); same shoulder note as `bb_incline_bench` |
| `iron_bench_dip` | Chair / Bench Dip | Hands on chair edge behind; triceps |
| `iron_hip_hinge_hold` | Hip Hinge Hold | Isometric hold at hinge position; replaces Good Mornings |
| `iron_bw_hyper_ext` | Bodyweight Back Hyper-Extension | Prone; arms behind head; no load |
| `iron_lying_ham_curl` | Lying DB Hamstring Curl | Prone; feet squeeze DB |
| `iron_lateral_hold` | Lateral Raise Hold | Arms held at 90° (shoulder height); replaces Overhead Holds |
| `iron_rear_delt_row` | Rear Delt Row | Elbow flared; targets posterior deltoid |
| `iron_front_raise` | Front DB Raise | Straight arms to shoulder height |
| `iron_crossover_stepup` | Cross-over Step-up | Step across midline onto bench; glute emphasis |
| `iron_squat_hold` | Squat Isometric Hold | Static hold at bottom of squat |
| `iron_frog_pump` | Frog Pump | Supine; soles of feet together; BW |
| `iron_diamond_pushup` | Diamond Push-up | Hands form diamond; tricep-dominant |
| `iron_plank_tap` | High Plank Hand Tap | Alternating hand to opposite shoulder in plank |
| `iron_b_stance_hip_thrust` | B-Stance Hip Thrust | Staggered; most load on front glute |
| `iron_tricep_kickback` | Tricep Kickback | Hinge forward; elbow pinned; extend back |
| `iron_shrug` | DB Shrug | Straight arms, elevate shoulders |
| `iron_overhead_tricep` | Overhead Tricep Extension | Both arms; DB behind head; kept by user preference |
| `iron_pushup` | Standard Push-up | Floor push-up (full or modified) |

---

## The 30-day workout list

Replacements applied. *(orig)* notes the original exercise where replaced.

### Day 1 — Legs · 4 × 60s
Heel-Elevated Squats · RDLs · Static Lunges R · Static Lunges L · Bulgarian Split Squats · Sumo Squats

### Day 2 — Upper Body (Shoulders, Back, Chest) · 4 × 60s
Seated DB Shoulder Press · Bent-Over DB Rows · Flat DB Chest Press · Lateral Raises · Push-ups

### Day 3 — Glutes · 4 × 60s
Hip Thrusts · Kas Glute Bridges · Single-Leg RDLs · Sumo Squats · Bodyweight Glute Kickbacks

### Day 4 — Full Body Circuits · 3 rounds × 40s / 20s
Bent-Over DB Rows · Reverse Lunges · RDLs · Flat DB Chest Press · Seated DB Shoulder Press *(orig: Push Press)* · Heel-Elevated Goblet Squats · Hammer Curls · Skull Crushers · Single-Arm DB Row *(orig: Renegade/Plank Rows)*

### Day 5 — Arms & Abs · 4 × 60s
Seated Bicep Curls · Overhead Tricep Extensions · Hammer Curls · Diamond Push-ups · Forearm Plank · Forearm Plank *(orig: Hollow Body Holds)*

### Day 6 — Quads · 4 × 60s
Heel-Elevated Goblet Squats · Cyclist Squats · Forward Alternating Lunges · 1.5 Rep Goblet Squats · Bodyweight Squat Pulses

### Day 7 — Shoulders & Triceps · 4 × 60s
Lateral Raises *(orig: Arnold Presses)* · Lean-Away Lateral Raises · Chair Tricep Dips · Lying Skull Crushers · Rear Delt Flies

### Day 8 — Glutes & Hamstrings · 4 × 60s
Heavy RDLs · Hip Thrusts · B-Stance RDLs · Sumo Deadlifts · Banded Glute Abductions

### Day 9 — Full Body Cardio · Continuous intervals
Bent-Over DB Rows *(orig: Clean & Presses)* · Goblet Squats · Reverse Lunges *(orig: Devil Presses)* · Alternating Reverse Lunges · High Plank Hand Taps

### Day 10 — Back & Biceps · 4 × 60s
Pronated DB Rows · Supinated DB Rows · Alternating Hammer Curls · DB Pullovers · Zottman Curls

### Day 11 — Legs + Calves · 4 × 60s
Suitcase Squats · Curtsy Lunges · RDLs · Standing Calf Raises · Seated Calf Raises

### Day 12 — Chest & Triceps · 4 × 60s
Flat DB Chest Press · Incline DB Chest Press · Floor Chest Flies · Close-Grip DB Press · Chair/Bench Dips

### Day 13 — Posterior Chain · 4 × 60s
RDLs · Single-Arm DB Rows · Hip Hinge Hold *(orig: Good Mornings)* · Floor Hip Thrusts · Bodyweight Back Hyper-Extensions

### Day 14 — Unilateral Full Body · 4 × 60s per side
Single-Arm Bent-Over Rows · Single-Leg RDLs · Weighted Step-ups · Single-Arm Seated Shoulder Press

### Day 15 — Shoulders · 4 × 60s
Seated Shoulder Press · Lateral Raises · Front DB Raises · Rear Delt Rows · Lateral Raise Hold *(orig: Isometric Overhead Holds)*

### Day 16 — Hamstrings · 4 × 60s
Lying DB Hamstring Curls · Heavy RDLs · Standard RDLs *(orig: Deficit RDLs)* · Hip Hinge Hold *(orig: Good Mornings)*

### Day 17 — Complete Upper Body · 4 × 60s
Bent-Over DB Rows · Flat Floor Chest Press · Seated Overhead Press · Bicep Curls · Overhead Tricep Extensions

### Day 18 — Glutes Supersets · 4 × 60s pairs
[SUPERSET] Hip Thrusts + Kas Glute Bridges · [SUPERSET] Sumo Squats + Bodyweight Sumo Pulses · [SUPERSET] B-Stance Hip Thrusts + Isometric Hold

### Day 19 — Full Body Muscle Building · Mixed format
Goblet Squat *(orig: Squat-to-Overhead Press)* · Single-Arm DB Row *(orig: Renegade Rows)* · Goblet Squats · Flat Floor Chest Press · Cross-Body Hammer Curls

### Day 20 — Arms, Abs & Core Supersets · 4 × 60s pairs
[SUPERSET] Bicep Curls + Hammer Curls · [SUPERSET] Overhead Tricep Extensions + Tricep Kickbacks · Dead Bug *(orig: Decline Crunches)* · Dead Bug *(orig: Reverse Crunches)*

### Day 21 — Legs + Step-ups · 4 × 60s
Weighted Step-ups R · Weighted Step-ups L · Reverse Lunges · Cross-over Step-ups · Goblet Squats

### Day 22 — Chest & Back Antagonist · 4 × 60s pairs
[SUPERSET] Flat DB Chest Press + Bent-Over DB Rows · [SUPERSET] Floor Chest Flies + Rear Delt Flies · [SUPERSET] Close-Grip DB Press + Pronated Rows

### Day 23 — Glutes & Hamstrings Supersets · Extended tension
[SUPERSET] Heavy RDLs + Hip Hinge Hold *(orig: Good Mornings)* · [SUPERSET] Hip Thrusts + Glute Bridges · [SUPERSET] Sumo Squats + Sumo Pulses

### Day 24 — Full Body Circuits · Continuous rounds
Goblet Squats · Bent-Over DB Rows · Lateral Raises *(orig: Arnold Shoulder Presses)* · Alternating Reverse Lunges · Diamond Push-ups

### Day 25 — Shoulders Supersets · 4 × 60s pairs
[SUPERSET] Seated Shoulder Press + Lateral Raises · [SUPERSET] Front DB Raises + Rear Delt Rows · [SUPERSET] Rear Delt Flies + DB Shrugs

### Day 26 — Legs Circuits · High density
Box Step-ups · Static Lunges · Squat Isometric Holds · RDLs

### Day 27 — Upper Body Antagonist · Alternating pairs
[SUPERSET] Bent-Over DB Rows + Flat DB Chest Press · [SUPERSET] Lateral Raises *(orig: Arnold Presses)* + Rear Delt Rows · [SUPERSET] Hammer Curls + Tricep Kickbacks

### Day 28 — Iron Glutes · 4 × constant tension
Heavy Hip Thrusts · Kas Glute Bridges · Constant-Tension Sumo Squats · Frog Pumps

### Day 29 — Final Full Body · 4 heavy compound sets
Heel-Elevated Squats · RDLs · Bent-Over DB Rows · Seated DB Shoulder Press · Suitcase Carries

### Day 30 — Arms, Abs & Core Finale · High volume
Bicep Curls · Overhead Tricep Extensions · Hammer Curls · Skull Crushers · Forearm Plank · Forearm Plank *(orig: Hollow Body Holds)*

---

## YouTube video IDs

The CSV provides the playlist URL for most days (not individual video links). Video IDs need to be researched from the playlist during implementation. Only Day 1 has a confirmed direct link: `https://www.youtube.com/watch?v=SCxNnWW2zB8`.

Implementation task: open the playlist, extract individual video IDs for all 30 days, add as `demo` field on each `IRON_WORKOUTS` entry.

---

## Icons and animation frames

Iron exercises follow the same icon convention as all other exercises. This work is separate from the main implementation and can be done by Codex in a dedicated pass.

### Static icons
- **Location:** `assets/icons/[exercise_id].png`
- **Size:** 108 × 108 px, transparent PNG
- **Naming:** exactly matches the exercise ID, e.g. `iron_heel_elev_squat.png`
- **Style:** consistent with existing exercise icons (line-art, single colour, transparent background)

All 37 new `iron_*` exercise IDs listed in the exercise table above need a corresponding icon file. Codex can generate these in a single batch once the exercise IDs are finalised in code.

### Animation frames (if applicable)
- If Codex adds animated SVG or frame-based icons for any Iron exercises, they follow the same pattern as warmup icons in `assets/icons/warmup/`
- A dedicated subfolder `assets/icons/iron/` is **not** used — keep the flat `assets/icons/` structure to match the existing icon-loading code
- The `iron_` prefix already namespaces the files visually in the directory

### Codex brief note
When creating an icon/animation brief for Codex, include:
1. The exercise ID (exact filename to create)
2. The exercise name and a one-line description of the movement
3. Reference to the existing icon style (line-art, 108×108, transparent)

---

## Files touched

- `src/IronLog.jsx` only:
  - Add `IRON_EXERCISES` constant (~35 new exercise definitions)
  - Add `IRON_WORKOUTS` constant (30 entries with day, title, ytId, format, exercises[])
  - Add `nextIronDay(sessions)` function
  - Add `IronToggle` component: segmented control on Workout tab
  - Add `IronSeriesView` component: week strip, day card, YouTube link, start button
  - Modify `buildSession`: handle `IRON_N` workout keys (uses `IRON_WORKOUTS[day]`)
  - Modify `ActiveWorkout`: skip warmup + finisher phases when `workout.startsWith('IRON_')`
  - Modify `History`: render `🔩 N` badge for Iron sessions
  - Modify `Dashboard`: `nextIronDay` does not affect the existing `selectedWorkout` for A/B/C

- Build: `node build.js` after every edit
- Commit: `src/IronLog.jsx` + `dist/index.html` + `index.html` + `version.json` together

---

## What is NOT in scope

- Reordering or customising Iron workouts (no workout builder for Iron)
- Per-workout warm-up targeting for Iron days (no warmup phase)
- Iron-specific finishers
- Supabase schema changes (sessions already sync via `il_sessions`)
- Progress charts specific to the Iron programme (uses shared Stats tab)
