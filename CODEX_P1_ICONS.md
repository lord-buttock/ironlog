# Codex Instructions — Priority 1 Exercise Icons & Demo Animations

*Read this fully before doing anything.*

---

## What we're building

IronLog is a single-file React PWA fitness tracker. We just added **9 new exercises** to the preset library. Your job is to generate:

1. **1 icon PNG per exercise** — `assets/icons/<id>.png` (324×324px, transparent)
2. **2–3 demo frame PNGs per exercise** — `assets/demos/<id>_1.png`, `_2.png`, `_3.png` (1024×1024px, transparent, showing the movement arc)
3. **Update `PNG_EXERCISE_ICON_IDS`** in `src/IronLog.jsx` — add all 9 new IDs to the Set so the app uses the PNG instead of the fallback SVG

---

## Style anchor and prompt system

Open `assets/icons/rdl.png`. This is the visual reference for every icon and demo frame.

**Read `IMAGE-PROCESS.md` in full before proceeding.** It contains:
- The locked athlete description (copy verbatim into every prompt)
- Camera family sentences for each exercise type
- The quality gate (reject/regenerate if it fails)
- The single-frame Pillow cleanup script (icons)
- The multi-frame Pillow cleanup script (demo animations)

---

## Pipeline for each exercise (in order)

1. Generate demo frames first (1024×1024) using the multi-frame prompt
2. Run multi-frame Pillow cleanup — output to `assets/demos/<id>_1.png` etc.
3. Verify with `sips`: 1024×1024, hasAlpha: yes for each frame
4. Derive the icon from the best demo frame (or generate a dedicated 324px icon separately)
5. Run single-frame Pillow cleanup — output to `assets/icons/<id>.png`
6. Verify with `sips`: 324×324, hasAlpha: yes
7. Move to the next exercise

---

## The 9 exercises

### 1. `p_bb_decline_bench` — Barbell Decline Bench Press

**Camera family:** Bench/supine

**Icon frame:** Athlete lying on decline bench (head lower, feet elevated), barbell lowered to lower chest at mid-rep, elbows at about 45°.

**Demo frames (2):**
- Frame 1 (`_1`): Starting position — barbell held above lower chest at arm's length, elbows nearly locked, decline bench visible
- Frame 2 (`_2`): Bottom of press — barbell lowered to lower chest, elbows at about 75° bend

---

### 2. `p_incline_db_fly` — Incline DB Fly

**Camera family:** Bench/supine

**Icon frame:** Athlete lying on 30–45° incline bench, arms open wide to sides holding dumbbells at the bottom of the fly — slight bend in elbows, chest fully stretched.

**Demo frames (2):**
- Frame 1 (`_1`): Top position — arms above chest with slight bend in elbows, dumbbells close together above chest
- Frame 2 (`_2`): Bottom/stretch position — arms opened wide out to sides, elbows slightly bent, dumbbells at chest level showing the pec stretch

---

### 3. `p_db_tricep_kickback` — DB Tricep Kickback

**Camera family:** Hinge

*Note: This is a hinge exercise where the torso is parallel to the floor. Use the hinge camera family but describe the upper arm staying close to the body (not swinging back) with the forearm extending back.*

**Icon frame:** Athlete hinged forward with torso nearly horizontal, upper arm held parallel to the floor close to the body, forearm fully extended back — arm is straight and at its peak contraction, dumbbell clearly visible.

**Demo frames (2):**
- Frame 1 (`_1`): Start position — torso hinged forward, elbow bent 90°, upper arm parallel to floor, forearm pointing down
- Frame 2 (`_2`): Peak contraction — forearm fully extended back, arm straight, dumbbell at hip level, tricep visibly contracted

---

### 4. `p_incline_db_curl` — Incline DB Curl

**Camera family:** Bench/supine

*Note: The athlete is seated on an incline bench, not lying. Arms hang behind the body at the bottom — the stretch position is the key feature of this exercise.*

**Icon frame:** Athlete seated on incline bench (30–45°), arms hanging down behind the body at the fully extended/stretched position — this is what makes the incline curl distinctive.

**Demo frames (2):**
- Frame 1 (`_1`): Stretched start — seated on incline, arms hanging straight down behind the torso, dumbbells at their lowest point
- Frame 2 (`_2`): Top of curl — arms curled up, biceps contracted, dumbbells near the shoulders

---

### 5. `p_bb_hip_thrust` — Barbell Hip Thrust

**Camera family:** Bench/supine

*Note: Very similar to the existing `hip_thrust` (which uses no barbell). The key difference is a padded barbell resting across the hips. The padding is important — it can be shown as a dark foam pad between the bar and the hip bones.*

**Icon frame:** Athlete at the top of the hip thrust — hips fully extended and level, barbell (with pad) across the hips, upper back on the bench, feet flat on the floor.

**Demo frames (2):**
- Frame 1 (`_1`): Bottom position — hips near the floor, torso at an angle, barbell with pad resting on hips, knees bent, feet flat
- Frame 2 (`_2`): Top position — hips fully extended to a straight line, barbell held at hip level, glutes squeezed at the top

---

### 6. `p_db_squat` — DB Squat

**Camera family:** Squat/lunge

*Note: Dumbbells are held at the sides (not at chest). This is a dumbbell-at-sides squat, not a goblet squat.*

**Icon frame:** Athlete in the bottom of a squat — thighs parallel to floor, dumbbells hanging at sides, knees tracking over toes.

**Demo frames (2):**
- Frame 1 (`_1`): Standing start — upright stance, dumbbells at sides, ready to descend
- Frame 2 (`_2`): Bottom of squat — thighs parallel, dumbbells still at sides, chest up, knees tracking toes

---

### 7. `p_bb_row` — Barbell Bent-Over Row

**Camera family:** Hinge

*Note: The barbell extends across the full width of the frame with plates on both ends. The torso is hinged to approximately 45°. The bar is pulled to the lower chest/upper abdomen.*

**Icon frame:** Athlete hinged at 45°, barbell pulled to lower chest at peak contraction, shoulder blades squeezed together, back flat.

**Demo frames (2):**
- Frame 1 (`_1`): Start position — hinged at 45°, barbell hanging at arm's length below the torso, plates visible on both ends
- Frame 2 (`_2`): Top/row position — barbell pulled to lower chest, elbows behind the torso, shoulder blades retracted

---

### 8. `p_deadlift` — Conventional Deadlift

**Camera family:** Hinge

*Note: This is the conventional barbell deadlift — bar on the floor, pulling from below. The key is to show the hip hinge and the bar being pulled from floor level.*

**Icon frame:** Athlete at the starting pull position — bar just breaking the floor, hips hinged, back flat, arms straight, head neutral.

**Demo frames (3):**
- Frame 1 (`_1`): Setup/starting position — hips hinged down to the bar, back flat, hands gripping the bar at about shoulder width, bar on the floor, chest up
- Frame 2 (`_2`): Mid-pull — bar just below the knees, hips still lower than shoulders, back flat, legs driving
- Frame 3 (`_3`): Lockout — standing tall, hips fully extended, barbell at mid-thigh, shoulders back, glutes squeezed

---

### 9. `p_walking_lunge` — Walking Lunge

**Camera family:** Squat/lunge

*Note: Walking lunge shows a forward step mid-stride — one foot forward, one behind, front knee tracking over the front foot. Dumbbells are held at the sides.*

**Icon frame:** Athlete mid-lunge — front knee bent 90°, rear knee near the floor, dumbbells at sides, upright torso, stepping forward.

**Demo frames (2):**
- Frame 1 (`_1`): Upright stride position — one foot just landing forward, back leg still extended, about to drop into the lunge, dumbbells at sides
- Frame 2 (`_2`): Bottom of lunge — front knee at 90°, rear knee near the floor, torso upright, dumbbells at sides

---

## After all 9 exercises are complete — update PNG_EXERCISE_ICON_IDS

Find `PNG_EXERCISE_ICON_IDS` in `src/IronLog.jsx` (around line 186). It is a `new Set([...])` with all existing icon IDs. Add these 9 IDs to the set in the `// Preset library exercises` section:

```
'p_bb_decline_bench', 'p_bb_hip_thrust', 'p_bb_row',
'p_db_squat', 'p_db_tricep_kickback', 'p_deadlift',
'p_incline_db_curl', 'p_incline_db_fly', 'p_walking_lunge',
```

Then rebuild:
```bash
cd "/Users/phillcantone/Library/Mobile Documents/com~apple~CloudDocs/Family/Phill/AI Coding/Ironlog"
node build.js
```

---

## Commit schedule

Commit and push once all 9 icons + demos are done and `PNG_EXERCISE_ICON_IDS` is updated:

```
feat: add Priority 1 exercise icons and demo animations (9 exercises)
```

---

## Do not touch

- `assets/icons/stretches/` — stretch icons from a separate task, do not modify
- `assets/icons/warmup/` — warmup/finisher icons, do not modify
- `src/IronLog.jsx` — only change the `PNG_EXERCISE_ICON_IDS` Set, nothing else
- `index.html`, `BUGS.md`, `ROADMAP.md` — do not modify
