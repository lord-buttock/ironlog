# Codex Instructions — Overnight Task

*Read this fully before doing anything. This document covers two sequential tasks: Part 1 is Phase 2C Batch 3 demo frames, Part 2 is the 43 missing preset library icons. Complete Part 1 fully and commit before starting Part 2.*

---

## Do not touch (applies to the whole session)

- `src/IronLog.jsx` — no code changes needed
- `index.html` — do not modify
- `version.json` — do not modify
- `assets/anatomy/` — do not modify
- `assets/icons/warmup/` — do not modify

---

# PART 1 — Phase 2C Batch 3: Demo Frames

Generate animated demo frames for the final 4 Workout C exercises.

---

## Context

IronLog is a single-file React 18 PWA for workout tracking. Demo frames are displayed in a full-screen modal (ExerciseDemoModal) that animates them in a ping-pong loop (1→2→3→2→1) at 450ms per frame.

- Batches 1 and 2 are already committed. This is the final batch.
- Batches 1 and 2 used `assets/demos/<id>_N.png` — follow the same pattern exactly.

---

## Image spec

- **Resolution:** 1024 × 1024 px
- **Format:** PNG with true transparent alpha
- **Background:** none (transparent)
- **Output folder:** `assets/demos/`
- **Filename format:** `<exercise_id>_1.png`, `<exercise_id>_2.png`, `<exercise_id>_3.png`

---

## Two critical rules

### Rule 1 — Consistent scale (multi-frame cleanup)

All frames of each exercise must be processed together using the multi-frame cleanup script below so all frames share the same scale factor.

### Rule 2 — Consistent facing direction

Include `person facing right` in every frame prompt for the same exercise. After generating all frames, confirm the figure faces the same direction in every frame. If any frame is mirrored, flip it:

```bash
python3 -c "
from PIL import Image; from pathlib import Path
p = Path('assets/demos/<exercise_id>_<N>.png')
Image.open(p).transpose(Image.FLIP_LEFT_RIGHT).save(p)
print('Flipped:', p)
"
```

---

## Athlete style — include in every prompt

```
Use the same IronLog athlete in every frame: an adult male fitness illustration with a lean, muscular build, broad shoulders, defined arms, narrow waist, athletic legs, and realistic but not bodybuilder-extreme proportions. He has a three-quarter facial profile with a strong angular jaw, straight nose, small focused eyes under defined brows, neutral concentrated expression, and visible ear when side-on. His hair is deep navy blue, short on the sides, fuller on top, swept upward and back in a clean quiff with visible strand lines. He wears a white sleeveless athletic tank with blue outline details only and no interior fill — the tank body appears white against the pale-blue filled skin underneath, light pale-blue athletic shorts ending just above the knee with simple seam lines, and white/very pale-blue low-top training shoes with blue outline details and visible laces. The body uses pale-blue translucent fill on skin, clothing highlights, and equipment highlights, sitting inside and just under the blue line work to create volume. Edges use crisp medium-blue vector line art with consistent 2-3px apparent stroke weight, darker blue contour accents for anatomy and folds, clean anti-aliased outlines, no sketchiness, no grey shadows, no text, and no background.
```

---

## Generation prompt template

```
Professional fitness app exercise illustration, [FRAME DESCRIPTION], person facing right,
[ATHLETE STYLE],
transparent background, clean vector illustration style,
no text, no border, no background, 1024x1024 PNG
```

Replace `[FRAME DESCRIPTION]` with each frame's description below. Replace `[ATHLETE STYLE]` with the locked athlete description above.

---

## Quality gate — reject and regenerate if:

| Check | Pass | Fail |
|---|---|---|
| Head | Shaped with profile/hair | Blank oval or circle |
| Body | Has pale-blue shading/fill | Line art only, no fill |
| Pose | Clearly shows the described position | Generic standing figure |
| Equipment | Visible and identifiable | Missing or ambiguous |
| Direction | Figure faces same direction as all other frames | Figure is mirrored vs other frames |
| Overall | Polished illustration | Pictogram / symbol |

---

## Workflow for each exercise

1. Generate all frames — include `person facing right` in every prompt
2. Quality gate check — regenerate any frame that fails
3. Direction check — confirm figure faces right in every frame; flip any mirrored frame
4. Run the multi-frame cleanup script on all frames together
5. Verify with `sips`: must be 1024×1024, `hasAlpha: yes`
6. Save to `assets/demos/<id>_N.png`

---

## The 4 exercises

### 1. p_dead_bug (3 frames)

| Frame | Description |
|---|---|
| 1 | Lying on back on a mat, arms pointing straight up to ceiling, knees bent at 90 degrees above hips, person facing right |
| 2 | Opposite arm and leg extended — one arm lowered toward floor overhead, opposite leg extended straight out, lower back pressed into mat, person facing right |
| 3 | Same as frame 1 — lying on back, arms up, knees at 90 degrees, person facing right |

### 2. p_plank (2 frames)

*(2 frames — showing two plank variations)*

| Frame | Description |
|---|---|
| 1 | Full plank on hands — arms straight, body in a straight line from head to heels, looking down at the mat, person facing right |
| 2 | Forearm plank — on forearms with elbows under shoulders, body straight from head to heels, holding position, person facing right |

### 3. pallof_press (3 frames)

| Frame | Description |
|---|---|
| 1 | Standing side-on to a resistance band anchored at chest height on a door frame, hands holding the band handle at chest, band taut, core braced, person facing right |
| 2 | Arms extended straight out at chest height, pressing the band handle away from the body, core bracing against rotation, band fully stretched, person facing right |
| 3 | Same as frame 1 — standing side-on, hands at chest, band taut, person facing right |

### 4. farmers_walk (2 frames)

*(2 frames — standing loaded and mid-stride)*

| Frame | Description |
|---|---|
| 1 | Standing tall, holding a heavy dumbbell or kettlebell in each hand at sides, upright posture, shoulders back, person facing right |
| 2 | Mid-stride walking forward, one foot forward and one foot back, both weights hanging at sides, tall upright posture, person facing right |

---

## Multi-frame cleanup script

Run this for each exercise after generating all its frames. Set `EXERCISE_ID` and `FRAME_PATHS` for each exercise.

```bash
python3 - <<'PY'
from PIL import Image, ImageDraw
from pathlib import Path

EXERCISE_ID = 'p_dead_bug'   # ← change for each exercise
FRAME_PATHS = [
    Path('/path/to/frame1.png'),    # ← update to actual generated image paths
    Path('/path/to/frame2.png'),
    Path('/path/to/frame3.png'),    # ← remove if only 2 frames
]
OUT_DIR = Path('assets/demos')
TARGET = 1024
PAD = 40

def make_transparent(img):
    rgba = img.convert('RGBA')
    rgb = rgba.convert('RGB')
    mask = Image.new('L', rgba.size, 0)
    draw = ImageDraw.Draw(mask)
    w, h = rgba.size
    seeds = [(0,0),(w-1,0),(0,h-1),(w-1,h-1)]
    visited = set()
    def flood(sx, sy):
        bg_color = rgb.getpixel((sx, sy))
        stack = [(sx, sy)]
        while stack:
            x, y = stack.pop()
            if (x, y) in visited or not (0 <= x < w and 0 <= y < h):
                continue
            visited.add((x, y))
            pr, pg, pb = rgb.getpixel((x, y))
            br, bg_, bb = bg_color
            if abs(pr-br) + abs(pg-bg_) + abs(pb-bb) > 40 * 3:
                continue
            draw.point((x, y), fill=255)
            stack += [(x+1,y),(x-1,y),(x,y+1),(x,y-1)]
    for sx, sy in seeds:
        flood(sx, sy)
    r, g, b, a = rgba.split()
    new_a = Image.composite(Image.new('L', rgba.size, 0), a, mask)
    return Image.merge('RGBA', (r, g, b, new_a))

cleaned = []
for p in FRAME_PATHS:
    if not p.exists():
        print(f'SKIP (not found): {p}')
        cleaned.append(None)
        continue
    cleaned.append(make_transparent(Image.open(p)))

union_bbox = None
for img in cleaned:
    if img is None:
        continue
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
    raise SystemExit('No visible content found')

union_bbox = tuple(union_bbox)
cw = union_bbox[2] - union_bbox[0]
ch = union_bbox[3] - union_bbox[1]
scale = min((TARGET - PAD*2) / cw, (TARGET - PAD*2) / ch)
nw = max(1, round(cw * scale))
nh = max(1, round(ch * scale))
print(f'Union: {cw}×{ch}  scale: {scale:.3f}  output: {nw}×{nh}')

OUT_DIR.mkdir(parents=True, exist_ok=True)
for i, img in enumerate(cleaned, start=1):
    if img is None:
        continue
    content = img.crop(union_bbox).resize((nw, nh), Image.Resampling.LANCZOS)
    canvas = Image.new('RGBA', (TARGET, TARGET), (0,0,0,0))
    canvas.alpha_composite(content, ((TARGET-nw)//2, (TARGET-nh)//2))
    out = OUT_DIR / f'{EXERCISE_ID}_{i}.png'
    canvas.save(out)
    print(f'Saved: {out}')
print('Done.')
PY
```

---

## Verification

```bash
for n in 1 2 3; do
  sips -g pixelWidth -g pixelHeight -g hasAlpha "assets/demos/<exercise_id>_${n}.png"
done
```

All present frames must show: `pixelWidth: 1024`, `pixelHeight: 1024`, `hasAlpha: yes`

---

## Part 1 Commit

After all 4 exercises are done:

```bash
git add assets/demos/
git commit -m "feat: add demo frames — Phase 2C Batch 3 (p_dead_bug, p_plank, pallof_press, farmers_walk)"
git push
```

---

---

# PART 2 — 43 Missing Preset Library Icons

Generate the 43 missing exercise icons for the Manage → Library tab. These are small single-image thumbnails — not animated demo frames.

---

## Image spec

- **Output folder:** `assets/icons/`
- **Filename:** `<exercise_id>.png`
- **Size:** 108 × 108 px
- **Format:** PNG with true transparent alpha
- **Background:** none (transparent)
- **Style anchor:** open `assets/icons/rdl.png` and match it exactly

---

## Cleanup script (single-frame icons)

Use this script for each icon. It removes the white/checkerboard background by detecting blue artwork pixels vs neutral background pixels, then fits the content into a 108×108 transparent canvas.

```bash
python3 - <<'PY'
from PIL import Image
from pathlib import Path

src = Path('/path/to/generated_image.png')   # ← update to actual generated image path
out = Path('assets/icons/<exercise_id>.png') # ← update exercise id

img = Image.open(src).convert('RGBA')
pix = img.load()
w, h = img.size

for y in range(h):
    for x in range(w):
        r, g, b, a = pix[x, y]
        mx = max(r, g, b)
        mn = min(r, g, b)
        sat = 0 if mx == 0 else (mx - mn) / mx
        blue_bias = b - max(r, g)
        score = max((sat - 0.055) / 0.16, (blue_bias - 5) / 55)
        alpha = int(max(0, min(1, score)) * 255)
        if alpha < 18:
            alpha = 0
        pix[x, y] = (r, g, b, alpha)

alpha_ch = img.getchannel('A')
bbox = alpha_ch.getbbox()
if not bbox:
    raise SystemExit('No visible content found')

content = img.crop(bbox)
target = 108
pad = 8
scale = min((target - pad*2) / content.width, (target - pad*2) / content.height)
new_size = (max(1, round(content.width * scale)), max(1, round(content.height * scale)))
content = content.resize(new_size, Image.Resampling.LANCZOS)

canvas = Image.new('RGBA', (target, target), (0, 0, 0, 0))
canvas.alpha_composite(content, ((target - new_size[0]) // 2, (target - new_size[1]) // 2))
out.parent.mkdir(parents=True, exist_ok=True)
canvas.save(out)
print(f'Saved: {out}')
PY
```

---

## Prompt template

```
Professional fitness app exercise illustration, [DESCRIPTION],
blue line art with subtle pale-blue body shading, transparent background,
detailed human figure with shaped head and hair and facial profile,
no blank oval face, realistic exercise pose with correct body proportions,
clear equipment visible, clean vector illustration style,
consistent stroke weight, no text, no border, no background, 108x108 PNG
```

---

## Quality gate — reject and regenerate if:

| Check | Pass | Fail |
|---|---|---|
| Head | Shaped with profile/hair | Blank oval or circle |
| Body | Has pale-blue shading/fill | Line art only, no fill |
| Pose | Clearly shows the described exercise | Generic standing figure |
| Equipment | Visible and identifiable | Missing or ambiguous |
| Overall | Polished illustration | Pictogram / symbol |

---

## Workflow for each icon

1. Generate using the prompt template
2. Quality gate check — regenerate if any check fails
3. Run the single-frame cleanup script
4. Verify: `sips -g pixelWidth -g pixelHeight -g hasAlpha assets/icons/<id>.png` — must be 108×108, hasAlpha: yes
5. Save to `assets/icons/<exercise_id>.png`

---

## The 43 exercises

Work through in order. Commit every 10–12 icons (see Commit section below).

| Exercise ID | Description for prompt |
|---|---|
| `band_row` | Person standing, both hands gripping a resistance band anchored in front at waist height, pulling band toward torso, elbows driving back, rowing motion |
| `bb_incline_bench` | Person lying on an incline bench set to 30–45 degrees, hands gripping a barbell at chest width, performing an incline barbell bench press |
| `db_bench` | Person lying on a flat bench, holding a dumbbell in each hand at chest level, elbows at 45 degrees, dumbbell bench press |
| `db_floor_press` | Person lying flat on the floor, holding a dumbbell in each hand, pressing dumbbells up from floor level, elbows resting on the ground at the bottom position |
| `db_lateral` | Person standing upright, holding a single dumbbell in one hand, performing a single-arm lateral raise with arm raised to shoulder height |
| `db_row_1arm` | Person with one hand and one knee resting on a flat bench for support, other hand pulling a single dumbbell up toward the hip, single-arm dumbbell row |
| `db_tricep` | Person standing, holding a single dumbbell with both hands overhead, arms bent at elbows, dumbbell lowered behind the head, overhead tricep extension |
| `incline_pushups` | Person in a push-up position with hands elevated on a bench, body straight, performing an incline push-up with hands on the raised surface |
| `p_ab_wheel` | Person kneeling on a mat, hands gripping an ab wheel on the floor in front, rolling the wheel forward with arms extended, ab wheel rollout |
| `p_arnold_press` | Person seated on a bench, holding dumbbells in front of face with palms facing them, rotating palms outward while pressing dumbbells overhead, Arnold press |
| `p_band_face_pull` | Person standing, pulling a resistance band anchored at face height on a door frame toward their forehead, elbows high and flared wide, face pull |
| `p_barbell_curl` | Person standing upright, both hands gripping a barbell with underhand grip, curling barbell up toward chest, barbell bicep curl |
| `p_bird_dog` | Person on hands and knees on a mat, simultaneously extending one arm straight forward and the opposite leg straight back, bird dog exercise |
| `p_bulgarian_squat` | Person in a split stance with the rear foot elevated on a bench behind them, front knee bent in a deep lunge, Bulgarian split squat |
| `p_cable_crunch` | Person kneeling on a mat facing a resistance band anchored high on a door frame, hands holding band at forehead level, crunching torso forward and down, cable crunch |
| `p_cable_fly` | Person standing, arms spread wide to sides, holding resistance band handles anchored at shoulder height, squeezing arms together in front, cable chest fly |
| `p_chest_dip` | Person supporting body weight on parallel dip bars, torso leaning slightly forward, elbows bending to lower chest between the bars, chest dip |
| `p_clamshell` | Person lying on their side on a mat, knees bent and stacked, feet together, top knee opening upward while keeping feet touching, clamshell exercise |
| `p_concentration_curl` | Person seated on a bench, one elbow resting on the inside of their thigh, curling a single dumbbell upward with focused concentration, concentration curl |
| `p_diamond_pushup` | Person in a push-up position with hands placed close together forming a diamond shape under their chest, performing a diamond push-up |
| `p_donkey_kick` | Person on hands and knees on a mat, kicking one leg back and up toward the ceiling with knee bent, glute contraction at the top, donkey kick |
| `p_frog_pumps` | Person lying on their back on a mat, soles of feet pressed together with knees falling out wide like a frog, thrusting hips upward, frog pump glute exercise |
| `p_front_raise` | Person standing upright, holding a dumbbell in each hand at thigh level, raising both arms straight forward to shoulder height, dumbbell front raise |
| `p_hammer_curl` | Person standing upright, holding dumbbells with a neutral grip with thumbs pointing up and palms facing each other, curling dumbbells upward, hammer curl |
| `p_hanging_knee_raise` | Person hanging from a pull-up bar with both hands, raising knees toward chest in a tucked position, hanging knee raise |
| `p_hip_abduction` | Person standing on one leg, other leg raised out to the side against a resistance band looped around the ankle, hip abduction exercise |
| `p_incline_db_press` | Person lying on an incline bench set to 30–45 degrees, holding a dumbbell in each hand at chest level, pressing dumbbells overhead, incline dumbbell press |
| `p_lat_pulldown` | Person seated at a lat pulldown machine, hands gripping a wide bar overhead with overhand grip, pulling bar down toward the collarbone, lat pulldown |
| `p_leg_extension` | Person seated on a leg extension machine, lower legs extending forward and upward against the padded resistance, leg extension |
| `p_leg_press` | Person seated in a leg press machine, feet flat on the sled, legs pushing the sled upward, leg press |
| `p_overhead_ext` | Person seated or standing, holding a single dumbbell with both hands overhead, lowering the weight behind the head with elbows bent close together, overhead tricep extension |
| `p_preacher_curl` | Person seated at a preacher curl bench, upper arms resting on the angled pad, curling a barbell or dumbbell upward, preacher curl |
| `p_pull_up` | Person hanging from a pull-up bar with an overhand pronated grip slightly wider than shoulders, pulling chin up toward the bar, full pull-up |
| `p_push_up` | Person in a standard push-up position on hands and toes, body straight from head to heels, lowering chest toward the floor, push-up |
| `p_rdl` | Person standing on one leg, holding a dumbbell in the opposite hand, hinging forward at the hip with the free leg extending back behind them, single-leg Romanian deadlift |
| `p_seated_cable_row` | Person seated facing a resistance band or cable anchored at low height, both hands gripping a handle, pulling toward the abdomen with elbows driving back, seated cable row |
| `p_seated_leg_curl` | Person seated at a leg curl machine, lower legs curling downward against resistance pads beneath the seat, seated leg curl |
| `p_shrugs` | Person standing upright, holding a heavy dumbbell in each hand at sides, shoulders shrugging upward toward ears, dumbbell shrug |
| `p_side_plank` | Person lying on their side, supported on one forearm with elbow directly under shoulder, body in a straight line from head to feet, side plank hold |
| `p_t_bar_row` | Person bent forward at the hips over a T-bar row setup, both hands gripping the handles close together, rowing the bar up toward the chest, T-bar row |
| `p_tricep_dips` | Person supporting body weight between two parallel bars or the edge of a bench, elbows bending to lower body with upright torso, tricep dips |
| `p_wall_sit` | Person standing with back flat against a wall, knees bent at 90 degrees, thighs parallel to the floor, isometric wall sit hold |
| `single_leg_bal` | Person standing balanced on one leg, the other leg slightly raised with knee gently bent, arms relaxed at sides, single-leg balance |

---

## Commit schedule

Commit after every 10–12 icons to save progress incrementally:

```bash
# After icons 1–12
git add assets/icons/
git commit -m "feat: add preset library icons batch 1 (band_row → p_concentration_curl)"

# After icons 13–24
git add assets/icons/
git commit -m "feat: add preset library icons batch 2 (p_diamond_pushup → p_incline_db_press)"

# After icons 25–36
git add assets/icons/
git commit -m "feat: add preset library icons batch 3 (p_lat_pulldown → p_seated_cable_row)"

# After icons 37–43
git add assets/icons/
git commit -m "feat: add preset library icons batch 4 (p_seated_leg_curl → single_leg_bal)"

git push
```

---

## End of overnight task

When both parts are committed and pushed, the session is complete. No further action required until Phill reviews in the morning.
