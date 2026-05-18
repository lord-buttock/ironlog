# Codex Instructions — Phase 2C Icons: 43 Missing Preset Library Exercise Icons

*Read this fully before doing anything. Run this task after Phase 2C Batch 3 demo frames are committed.*

---

## Purpose

Generate the 43 missing exercise icons for the preset library. These are small thumbnail illustrations that appear in the Manage → Library tab next to each exercise name.

---

## Spec

- **Output folder:** `assets/icons/`
- **Filename:** `<exercise_id>.png` (e.g. `assets/icons/p_pull_up.png`)
- **Format:** PNG with true transparent alpha background
- **Style:** Blue line art with subtle pale-blue body shading — same style as the existing icons (use `assets/icons/rdl.png` as your visual reference)
- **Pipeline:** Follow the single-frame cleanup pipeline in `Image-Process.md` exactly

Read `Image-Process.md` now for the authoritative size spec, Pillow cleanup script, and quality gate. Use that as your technical reference throughout this task.

---

## Style anchor

Open `assets/icons/rdl.png` and use it as your visual reference for every icon. Every icon must match:
- Blue line art strokes
- Subtle pale-blue fill on skin/body areas
- Shaped head with hair and a facial profile (no blank oval face)
- Transparent background
- Clean, polished vector illustration style
- Consistent stroke weight

---

## Prompt template

```
Professional fitness app exercise illustration, [DESCRIPTION],
blue line art with subtle pale-blue body shading, transparent background,
detailed human figure with shaped head and hair and facial profile,
no blank oval face, realistic exercise pose with correct body proportions,
clear equipment visible, clean vector illustration style,
consistent stroke weight, no text, no border, no background, [SIZE] PNG
```

Replace `[SIZE]` with the output size from `Image-Process.md`. Replace `[DESCRIPTION]` with the exercise description from the table below.

---

## Quality gate — reject and regenerate if:

| Check | Pass | Fail |
|---|---|---|
| Head | Shaped with profile and hair | Blank oval or circle |
| Body | Has pale-blue shading/fill | Line art only, no fill |
| Pose | Clearly shows the described exercise | Generic standing figure |
| Equipment | Visible and identifiable | Missing or ambiguous |
| Overall | Polished illustration | Pictogram or symbol |

---

## Workflow for each icon

1. Generate image using the prompt template
2. Check against quality gate — regenerate if any check fails
3. Run the single-frame Pillow cleanup script from `Image-Process.md`
4. Verify with `sips`: correct pixel dimensions, `hasAlpha: yes`
5. Save to `assets/icons/<exercise_id>.png`
6. Move to the next exercise

---

## The 43 exercises

Work through these in order. Commit in batches of 10–12 with descriptive messages (see Commit section below).

| Exercise ID | Description for prompt |
|---|---|
| `band_row` | Person standing, both hands gripping a resistance band anchored in front at waist height, pulling band toward torso, elbows driving back, rowing motion |
| `bb_incline_bench` | Person lying on an incline bench set to 30–45 degrees, hands gripping a barbell at chest width, incline barbell bench press |
| `db_bench` | Person lying on a flat bench, holding a dumbbell in each hand at chest level, elbows at 45 degrees, dumbbell bench press |
| `db_floor_press` | Person lying flat on the floor, holding a dumbbell in each hand, pressing dumbbells up from floor level, elbows resting on the ground at bottom position |
| `db_lateral` | Person standing upright, holding a single dumbbell in one hand at their side, performing a single-arm lateral raise, arm raised to shoulder height |
| `db_row_1arm` | Person with one hand and one knee resting on a flat bench for support, other hand pulling a single dumbbell up toward the hip, single-arm dumbbell row |
| `db_tricep` | Person standing, holding a single dumbbell with both hands overhead, arms bent at elbows, dumbbell lowered behind the head, overhead tricep extension |
| `incline_pushups` | Person in a push-up position with hands elevated on a bench or step, body straight, performing an incline push-up, hands on the raised surface |
| `p_ab_wheel` | Person kneeling on a mat, hands gripping an ab wheel on the floor in front, rolling the wheel forward with arms extended, ab wheel rollout |
| `p_arnold_press` | Person seated on a bench, holding dumbbells in front of face with palms facing them, rotating palms outward as pressing dumbbells overhead, Arnold press |
| `p_band_face_pull` | Person standing, pulling a resistance band anchored at face height on a door frame toward their forehead, elbows high and flared wide, face pull |
| `p_barbell_curl` | Person standing upright, both hands gripping a barbell with underhand grip at thigh level, curling barbell up toward chest, bicep curl |
| `p_bird_dog` | Person on hands and knees on a mat, simultaneously extending one arm straight forward and the opposite leg straight back, body balanced, bird dog exercise |
| `p_bulgarian_squat` | Person in a split stance with the rear foot elevated on a bench behind them, front knee bent in a deep lunge position, Bulgarian split squat |
| `p_cable_crunch` | Person kneeling on a mat facing a door anchor mounted high, hands holding band at forehead level, crunching forward and down, cable crunch |
| `p_cable_fly` | Person standing, arms spread wide to sides, holding resistance band handles anchored at shoulder height on each side, squeezing arms together in front, cable chest fly |
| `p_chest_dip` | Person supporting body weight on parallel dip bars, torso leaning forward, elbows bending, lowering chest between the bars, chest dip |
| `p_clamshell` | Person lying on their side on a mat, knees bent and stacked, feet together, top knee opening upward like a clamshell while keeping feet touching, clamshell exercise |
| `p_concentration_curl` | Person seated on a bench, one elbow resting on the inside of their thigh, curling a dumbbell upward with full concentration, concentration curl |
| `p_diamond_pushup` | Person in a push-up position with hands close together forming a diamond or triangle shape under their chest, performing a diamond push-up |
| `p_donkey_kick` | Person on hands and knees on a mat, kicking one leg back and up toward the ceiling with knee bent, glute contraction, donkey kick exercise |
| `p_frog_pumps` | Person lying on their back on a mat, soles of feet pressed together with knees falling out wide like a frog, thrusting hips upward, frog pump glute exercise |
| `p_front_raise` | Person standing upright, holding a dumbbell in each hand at thigh level, raising both arms straight forward to shoulder height, front raise |
| `p_hammer_curl` | Person standing upright, holding dumbbells with a neutral grip (thumbs up, palms facing each other), curling dumbbells upward, hammer curl |
| `p_hanging_knee_raise` | Person hanging from a pull-up bar with both hands, raising knees toward chest in a tucked position, hanging knee raise |
| `p_hip_abduction` | Person standing on one leg, other leg raised out to the side against a resistance band looped around ankle, hip abduction exercise |
| `p_incline_db_press` | Person lying on an incline bench set to 30–45 degrees, holding a dumbbell in each hand at chest level, pressing dumbbells up overhead, incline dumbbell press |
| `p_lat_pulldown` | Person seated at a lat pulldown machine, hands gripping a wide bar overhead, pulling bar down toward collarbone, lat pulldown |
| `p_leg_extension` | Person seated on a leg extension machine, lower legs extending forward and upward against the padded resistance, leg extension |
| `p_leg_press` | Person seated in a leg press machine, feet flat on the sled, legs pressing the sled upward, leg press |
| `p_overhead_ext` | Person seated or standing, holding a single dumbbell with both hands overhead, lowering the weight behind the head with elbows bent, overhead tricep extension |
| `p_preacher_curl` | Person seated at a preacher curl bench, upper arms resting on the angled pad, curling a barbell or dumbbell upward, preacher curl |
| `p_pull_up` | Person hanging from a pull-up bar with an overhand pronated grip slightly wider than shoulders, pulling chin up toward bar, full pull-up |
| `p_push_up` | Person in a standard push-up position on hands and toes, body straight from head to heels, lowering chest toward the floor, push-up |
| `p_rdl` | Person standing on one leg, holding a dumbbell in the opposite hand, hinging forward at the hip with the free leg extending back, single-leg Romanian deadlift |
| `p_seated_cable_row` | Person seated facing a cable machine or door anchor at low height, both hands gripping a handle, pulling toward the abdomen with elbows driving back, seated cable row |
| `p_seated_leg_curl` | Person seated at a leg curl machine, lower legs curling downward against resistance pads beneath the seat, seated leg curl |
| `p_shrugs` | Person standing upright, holding a heavy dumbbell in each hand at sides, shoulders shrugging upward toward ears, shrug exercise |
| `p_side_plank` | Person lying on their side, supported on one forearm with elbow under shoulder, body in a straight line from head to feet, side plank hold |
| `p_t_bar_row` | Person bent forward at the hips over a T-bar row setup, both hands gripping the handles, rowing the bar up toward the chest, T-bar row |
| `p_tricep_dips` | Person supporting themselves between two parallel bars or the edge of a bench, elbows bending to lower body, tricep dips |
| `p_wall_sit` | Person standing with back flat against a wall, knees bent at 90 degrees, thighs parallel to the floor, holding a wall sit position |
| `single_leg_bal` | Person standing balanced on one leg, the other leg slightly raised with knee bent, arms relaxed at sides, single-leg balance |

---

## Commit schedule

Commit after every 10–12 icons so progress is saved incrementally. Use messages like:

```
feat: add preset library icons batch 1 (band_row → p_cable_fly)
feat: add preset library icons batch 2 (p_chest_dip → p_lat_pulldown)
feat: add preset library icons batch 3 (p_leg_extension → single_leg_bal)
```

After all 43 are done, push once.

---

## Do not touch

- `assets/demos/` — demo frames, do not modify
- `assets/icons/warmup/` — warmup/finisher icons, do not modify
- `assets/anatomy/` — do not modify
- `src/IronLog.jsx` — no code changes needed
- `index.html`, `version.json` — do not modify
