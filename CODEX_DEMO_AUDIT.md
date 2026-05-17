# Codex Instructions — Demo Frame Audit & Repair

*Read this fully before doing anything. This task comes before Phase 2C.*

---

## Purpose

All existing demo frames must be audited and repaired before new ones are generated. Three categories of errors were found in review:

1. **Scale inconsistency** — figures appear at different sizes between frames of the same exercise
2. **Direction reversal** — AI generated one frame as a horizontal mirror of another (already fixed for `p_band_ext_rot`)
3. **Wrong exercise interpretation** — e.g. person standing on the platform instead of the kettlebell being on the platform; gym cable machine shown instead of door anchor

This document tells you exactly what to check for every exercise, how to fix each type of error, and what to regenerate vs. what to fix in-place.

---

## Equipment Phill owns (home gym)

**Has:**
- Kettlebells
- Dumbbells
- Resistance bands + door anchor (can mount high or low on door frame)
- Barbell + flat bench (with safety pins)
- Incline bench
- Swiss ball
- Pull-up bar (door-mounted)
- Stepper

**Does NOT have:**
- Gym cable machine / cable stack
- Lat pulldown machine
- Leg press machine
- Smith machine

Any workout A/B exercise (these are the main workouts, not preset library) that shows gym cable machine equipment must be regenerated using door anchor instead.

---

## Step 1 — Run scale normalization on all existing frames

The frames are already background-cleaned (transparent 1024×1024). Run this script to recompute the union bounding box across all frames of each exercise and rescale so the figure is the same apparent size in every frame.

**This must run first, before any visual review.** Some apparent alignment issues will disappear after normalization and don't need regeneration.

```bash
python3 - <<'PY'
from PIL import Image
from pathlib import Path
from collections import defaultdict

demos = Path('assets/demos')
if not demos.exists():
    raise SystemExit('Run from repo root')

TARGET = 1024
PAD = 40

# Group frames by exercise
exercises = defaultdict(list)
for f in sorted(demos.glob('*.png')):
    parts = f.stem.rsplit('_', 1)
    if len(parts) == 2 and parts[1].isdigit():
        exercises[parts[0]].append(f)

for ex_id, files in sorted(exercises.items()):
    if len(files) < 2:
        print(f'SKIP (only 1 frame): {ex_id}')
        continue

    imgs = [(p, Image.open(p).convert('RGBA')) for p in files]

    # Compute union bounding box across all frames
    union_bbox = None
    for _, img in imgs:
        bbox = img.getchannel('A').getbbox()
        if bbox is None:
            continue
        if union_bbox is None:
            union_bbox = list(bbox)
        else:
            union_bbox[0] = min(union_bbox[0], bbox[0])
            union_bbox[1] = min(union_bbox[1], bbox[1])
            union_bbox[2] = max(union_bbox[2], bbox[2])
            union_bbox[3] = max(union_bbox[3], bbox[3])

    if union_bbox is None:
        print(f'SKIP (no content): {ex_id}')
        continue

    union_bbox = tuple(union_bbox)
    cw = union_bbox[2] - union_bbox[0]
    ch = union_bbox[3] - union_bbox[1]
    scale = min((TARGET - PAD * 2) / cw, (TARGET - PAD * 2) / ch)
    nw = max(1, round(cw * scale))
    nh = max(1, round(ch * scale))

    for i, (path, img) in enumerate(imgs, start=1):
        content = img.crop(union_bbox).resize((nw, nh), Image.Resampling.LANCZOS)
        canvas = Image.new('RGBA', (TARGET, TARGET), (0, 0, 0, 0))
        canvas.alpha_composite(content, ((TARGET - nw) // 2, (TARGET - nh) // 2))
        canvas.save(path)

    print(f'Normalized: {ex_id}  ({len(files)} frames)  union {cw}×{ch}  scale {scale:.3f}')

print('Done.')
PY
```

After running: verify with `sips` that all frames are still 1024×1024 with hasAlpha: yes.

---

## Step 2 — Visual review checklist

After normalization, view each exercise's frames and check against this list.

### Error types — what to look for

| Type | Description | Fix |
|---|---|---|
| **Direction flip** | Figure faces a different direction in one frame vs others | Flip with one-liner (see below) |
| **Equipment mismatch** | Different equipment between frames (cable machine vs door anchor) | Regenerate the wrong frame |
| **Wrong interpretation** | Pose doesn't match the exercise at all | Regenerate the frame |
| **Person on the platform** | For kb_deadlift: person is standing on the raised block (should be standing on floor, kettlebell on block) | Regenerate |
| **Gym machine shown** | Cable machine, lat pulldown machine, leg press — for Phill's workout exercises | Regenerate using door anchor |
| **Figure cut off** | Part of the body is outside the 1024×1024 canvas | Regenerate |
| **Blank oval head** | No facial detail, hair, or profile | Regenerate |
| **No body shading** | Pure line art with no pale-blue fill | Regenerate |
| **Text in image** | Any text present | Regenerate |
| **Anatomically impossible** | Extra limbs, twisted body, broken proportions | Regenerate |

---

## Step 3 — Fix tools

### Direction flip (one-liner)
```bash
python3 -c "
from PIL import Image; from pathlib import Path
p = Path('assets/demos/<exercise_id>_<N>.png')
Image.open(p).transpose(Image.FLIP_LEFT_RIGHT).save(p)
print('Flipped:', p)
"
```

### Regeneration prompt
```
Professional fitness app exercise illustration, [FRAME DESCRIPTION], person facing right,
blue line art with subtle pale-blue body shading, transparent background,
detailed human figure with shaped head and hair and facial profile,
no blank oval face, realistic exercise pose with correct body proportions,
clear equipment visible, clean vector illustration style,
consistent stroke weight, no text, no border, no background, 1024x1024 PNG
```

### Single-frame re-cleanup (after regenerating one frame)
If you regenerate one frame of an exercise, you must re-run the multi-frame normalization script for that exercise so the new frame matches the scale of the others.

---

## Step 4 — Per-exercise audit guide

Review each exercise. The "Expected" column describes what every frame should show. The "Known issues" column flags problems already identified. If no known issue is listed, do a full visual check and fix anything that fails.

---

### Workout A — Push

#### bb_flat_bench (3 frames)
**Expected:** Person lying on flat barbell bench, hands gripping barbell at chest width, elbows at 45°. Person facing right (head on left, feet toward right). Equipment: barbell, flat bench with safety uprights.
- Frame 1: Bar at chest
- Frame 2: Arms extended, bar overhead at full lockout
- Frame 3: Return to chest (same as frame 1 is fine, or mid-lowering)

**Known issues:** None confirmed. Check direction and scale.

---

#### p_db_fly (2 frames)
**Expected:** Person lying on flat bench, holding dumbbells. Arms arc outward and inward like a chest fly.
- Frame 1: Dumbbells at sides, arms wide, slight elbow bend (stretched position)
- Frame 2: Dumbbells together above chest, arms nearly straight (contracted position)

**Known issues:** None confirmed. Check direction and scale.

---

#### p_db_shoulder_press (3 frames)
**Expected:** Person seated or standing, dumbbells at shoulder height, pressing overhead.
- Frame 1: Dumbbells at shoulder height, elbows bent 90°
- Frame 2: Dumbbells pressed overhead, arms extended
- Frame 3: Same as frame 1

**Known issues:** Scale differences between frames were reported. Should be fixed by normalization script. Verify after Step 1.

---

#### p_lateral_raise (2 frames)
**Expected:** Person standing, dumbbells or band at sides.
- Frame 1: Dumbbells hanging at sides
- Frame 2: Arms raised to shoulder height, elbows slightly bent, T-position

**Known issues:** None confirmed. Check direction and scale.

---

#### p_rear_delt_fly (2 frames)
**Expected:** Person hinged forward at hips or lying face-down on incline bench, dumbbells hanging, then arms raised out to sides (rear delt fly motion).
- Frame 1: Arms hanging down
- Frame 2: Arms raised out to sides, rear delts contracted

**Known issues:** None confirmed.

---

#### p_band_ext_rot (2 frames)
**Expected:** Person standing, elbow tucked at side, forearm rotating outward against band. Band anchored at elbow height to the right side (door anchor or wall anchor). Person facing right.
- Frame 1: Forearm pointing forward (neutral / starting position), band taut
- Frame 2: Forearm rotated outward (externally rotated), band stretched

**Known issues:** Direction flip already fixed in git. Verify both frames face right.

---

#### p_close_grip_bench (3 frames)
**Expected:** Person lying on flat barbell bench, hands close-grip on bar (narrower than shoulder width).
- Frame 1: Bar at chest, elbows close to body
- Frame 2: Arms extended, bar overhead
- Frame 3: Same as frame 1

**Known issues:** None confirmed.

---

#### p_tricep_pushdown (2 frames)
**Expected:** Person standing at **door anchor** (NOT gym cable machine). Band anchored high on door frame, rope attachment. Elbows pinned at sides, pushing rope downward.
- Frame 1: Hands at chest height, elbows bent, starting position
- Frame 2: Arms fully extended downward, triceps contracted

**Known issues:** Check whether a cable machine is shown. If yes — regenerate using door anchor.

---

### Workout B — Pull

#### kb_deadlift (3 frames)
**Expected:** Person standing on the **floor** (not on a raised surface). Kettlebell resting on a small raised block/step/plates approximately 15–20cm off the floor. Person hinges to pick up kettlebell from the raised block, not from the ground.
- Frame 1: Person standing tall, kettlebell on raised block in front at hip height (between reps / lockout)
- Frame 2: Person hinged forward, hands on kettlebell on the raised block, knees slightly bent, back flat
- Frame 3: Same as frame 1

**Known issues:** ⚠️ CONFIRMED ERROR — one or more frames show the person standing ON TOP of the raised platform, which is wrong. Person should always stand on the floor. Regenerate any frame where the person is on the platform.

---

#### chin_up (3 frames)
**Expected:** Person hanging from pull-up bar, **underhand (supinated) grip, shoulder-width or narrower**. No wide overhand grip.
- Frame 1: Dead hang at bottom, arms fully extended
- Frame 2: Chin at or above bar height, elbows bent, chest close to bar
- Frame 3: Same as frame 1

**Known issues:** Check grip — must be underhand (palms facing person). Check whether bar is a door-mounted pull-up bar (correct) vs. large gym rig (acceptable either way).

---

#### cs_db_row (2 frames)
**Expected:** Person lying face-down on an incline bench, one or both arms hanging, pulling dumbbells toward hips. Chest-supported row.
- Frame 1: Arm(s) hanging down, dumbbells at full stretch
- Frame 2: Arm(s) pulled up, dumbbells at hip/rib level, elbows high

**Known issues:** None confirmed.

---

#### reverse_fly (2 frames)
**Expected:** Person hinged forward at hips or face-down on incline bench. Dumbbells arc outward (rear delt fly motion). Light weight.
- Frame 1: Arms hanging/low, dumbbells close together
- Frame 2: Arms raised out wide, rear delts contracted

**Known issues:** None confirmed.

---

#### face_pull (2 frames)
**Expected:** Person standing, band anchored at **face height** on door frame (door anchor). Pulling band toward forehead with elbows high and wide. NOT a gym cable machine with a pulley.
- Frame 1: Arms extended forward, hands at face level, band taut
- Frame 2: Hands pulled to forehead level, elbows high and flared out, band stretched

**Known issues:** Check whether gym cable machine is shown instead of door anchor. Regenerate if so.

---

#### p_straight_arm_pd (2 frames)
**Expected:** Person standing at **door anchor mounted HIGH** on door frame. Arms straight (or nearly straight), pulling the band downward from overhead to thighs.
- Frame 1: Arms raised overhead or at shoulder height, band taut to high anchor
- Frame 2: Arms pulled down to thighs, lat contracted, arms near straight

**Known issues:** ⚠️ CONFIRMED ERROR — Frame 1 shows a gym cable machine with a full weight stack. Frame 2 shows a door anchor. These must match. Since Phill uses a door anchor, regenerate **frame 1** to show a door anchor mounted high, not a gym cable machine.

---

#### p_db_bicep_curl (2 frames)
**Expected:** Person standing, dumbbells at sides, curling upward. Both arms curl simultaneously (not alternating).
- Frame 1: Arms hanging at sides, dumbbells at thighs
- Frame 2: Dumbbells curled to shoulder height, biceps contracted

**Known issues:** None confirmed.

---

### Additional exercises (from EXERCISES object — may have demos)

#### db_bench (3 frames)
**Expected:** Person lying on flat bench, holding two dumbbells (not a barbell), elbows at 45°.
- Frame 1: Dumbbells at chest level
- Frame 2: Arms extended overhead (dumbbells at full lockout)
- Frame 3: Same as frame 1

**Known issues:** None confirmed.

---

#### p_pull_up (3 frames)
**Expected:** Person hanging from pull-up bar, **overhand (pronated) grip**. Full range of motion.
- Frame 1: Dead hang, arms fully extended
- Frame 2: Mid-pull or chin approaching bar
- Frame 3: Chin at or above bar, full contraction

**Known issues:** None confirmed. Check grip type (overhand for pull-up, not underhand — that's chin_up).

---

#### p_hammer_curl (2 frames)
**Expected:** Person standing, dumbbells at sides with **neutral grip** (thumbs up, palms facing each other). Curling upward.
- Frame 1: Arms at sides, neutral grip
- Frame 2: Dumbbells curled to shoulder height, neutral grip

**Known issues:** None confirmed.

---

## Step 5 — After all fixes, commit

```bash
git add assets/demos/
git commit -m "fix: demo frame audit — scale normalization + correct exercise interpretations"
git push
```

If regenerations are needed, commit in batches per exercise with descriptive messages.

---

## Step 6 — Proceed to Phase 2C

Once this audit is complete and committed, read `CODEX_PHASE_2C.md` and generate Workout C demo frames.

---

## Summary of confirmed errors requiring regeneration

| Exercise | Frame | Issue | Action |
|---|---|---|---|
| `kb_deadlift` | Any frame showing person on platform | Person standing ON raised block instead of ON floor | Regenerate — person on floor, KB on small raised block |
| `p_straight_arm_pd` | Frame 1 | Gym cable machine shown, not door anchor | Regenerate with door anchor mounted high |
| `p_tricep_pushdown` | Any frame | Check for cable machine | Regenerate with door anchor if found |
| `face_pull` | Any frame | Check for cable machine | Regenerate with door anchor if found |
| `p_band_ext_rot` | Frame 2 | Direction flip | Already fixed — verify both frames face right |

All other exercises: scale normalization only (automated), plus direction check.
