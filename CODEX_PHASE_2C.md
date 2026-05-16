# Codex Instructions — Phase 2C: Workout C Demo Frames

*Read this fully before doing anything.*

---

## Context

IronLog is a single-file React 18 PWA for workout tracking. You are generating **animated demo frames** for the 12 Workout C exercises.

All 12 exercises already have icons at `assets/icons/<id>.png` — **do not regenerate icons**.

You are only generating demo frames: `assets/demos/<id>_1.png`, `assets/demos/<id>_2.png`, `assets/demos/<id>_3.png`

---

## What demo frames are

- Each exercise has 2–3 frames showing key positions of the movement
- They are displayed in a full-screen modal (ExerciseDemoModal) that animates them in a ping-pong loop (1→2→3→2→1) at 450ms per frame
- Frame 1 = start position, Frame 2 = mid or end position, Frame 3 = end position (if 3-frame)

---

## Two critical rules for demo frames

### Rule 1 — Consistent scale (multi-frame cleanup)

A bug in previous phases caused the figure to appear at different sizes between frames because each frame was cropped and scaled independently. **You must process all frames of each exercise together** using the multi-frame cleanup script so all frames share the same scale factor.

The multi-frame script is in this document (below) and in `IMAGE-PROCESS.md`.

### Rule 2 — Consistent facing direction

A bug seen in `p_band_ext_rot`: the AI generated frame 1 with the figure facing right and frame 2 with the figure facing left (mirrored). This looks like the figure teleports between frames.

**Prevention:** Include the phrase `"person facing right"` in every frame prompt for the same exercise. Use the same direction in all frames.

**Detection:** After generating all frames for an exercise, visually confirm the figure faces the same direction in every frame before running the cleanup script.

**Fix:** If a frame is mirrored, flip it horizontally with this one-liner:

```bash
python3 -c "
from PIL import Image; from pathlib import Path
p = Path('assets/demos/<exercise_id>_2.png')
Image.open(p).transpose(Image.FLIP_LEFT_RIGHT).save(p)
print('Flipped:', p)
"
```

Replace `_2.png` with whichever frame is the wrong direction.

---

## Image specifications

- **Resolution:** 1024 × 1024 px
- **Format:** PNG with true transparent alpha
- **Background:** none (transparent)
- **Style:** same as icons — blue line art with subtle pale-blue body shading, shaped head with hair and facial profile, realistic exercise pose
- **Output folder:** `assets/demos/`
- **Filename format:** `<exercise_id>_1.png`, `<exercise_id>_2.png`, `<exercise_id>_3.png`

---

## Generation prompt template

```
Professional fitness app exercise illustration, [FRAME DESCRIPTION], person facing right,
blue line art with subtle pale-blue body shading, transparent background,
detailed human figure with shaped head and hair and facial profile,
no blank oval face, realistic exercise pose with correct body proportions,
clear equipment visible, clean vector illustration style,
consistent stroke weight, no text, no border, no background, 1024x1024 PNG
```

**Always include `person facing right` in every frame prompt for the same exercise.** This prevents the AI from mirroring the figure between frames.

---

## Quality gate — reject and regenerate if:

| Check | Pass | Fail |
|---|---|---|
| Head | Shaped with profile/hair | Blank oval or circle |
| Body | Has pale-blue shading/fill | Line art only, no fill |
| Pose | Clearly shows the described position | Generic standing figure |
| Equipment | Visible and identifiable | Missing or ambiguous |
| Direction | Figure faces same direction as all other frames | Figure is mirrored/flipped vs other frames |
| Overall | Polished illustration | Pictogram / symbol |

**Direction check is mandatory.** After generating all frames for an exercise, line them up mentally: does the figure face the same way in every frame? If not, use the flip one-liner above before proceeding.

---

## Workflow for each exercise

1. Generate frames 1, 2 (and 3 if applicable) — include `person facing right` in every prompt
2. Visually check all frames against the quality gate (style, shading, head, equipment)
3. **Direction check:** confirm the figure faces right in every frame. If any frame is mirrored, use the flip one-liner to fix it before continuing
4. If any frame fails the quality gate — regenerate it (do not clean and ship a substandard frame)
5. Run the **multi-frame cleanup script** (below) on all frames together — this applies one shared scale factor so the figure stays the same size across all frames
6. Verify all output frames with `sips`: must be 1024×1024, hasAlpha: yes
7. Save to `assets/demos/<id>_1.png`, `_2.png`, `_3.png`
8. Move on to the next exercise

---

## The 12 exercises and their frame descriptions

All frames must have **person facing right** unless otherwise noted. Include that phrase in every prompt.

### 1. goblet_squat

| Frame | Description |
|---|---|
| 1 | Standing upright, holding kettlebell at chest height with both hands, goblet grip, person facing right |
| 2 | Bottom of goblet squat — deep squat, thighs parallel or below, elbows inside knees, kettlebell at chest, person facing right |
| 3 | Same as frame 1 (standing, kettlebell at chest), person facing right |

### 2. p_sumo_squat

| Frame | Description |
|---|---|
| 1 | Standing, wide sumo stance, toes turned out, hands clasped or holding dumbbell between legs |
| 2 | Bottom of sumo squat — deep squat, wide stance, knees tracking over toes, weight between legs |
| 3 | Same as frame 1 |

### 3. rdl (Romanian Deadlift)

| Frame | Description |
|---|---|
| 1 | Standing tall, barbell held at thighs, slight knee bend, chest proud |
| 2 | Hinged forward at hips, back flat, barbell sliding down shins, hamstrings loaded |
| 3 | Same as frame 1 |

### 4. hip_thrust

| Frame | Description |
|---|---|
| 1 | Shoulders resting on bench, hips lowered to floor, barbell across hips, knees bent, feet flat |
| 2 | Hips driven up to full extension, body forms a straight line from knees to shoulders, barbell across hips |
| 3 | Same as frame 1 |

### 5. reverse_lunge

| Frame | Description |
|---|---|
| 1 | Standing upright, feet together |
| 2 | One leg stepped back into lunge, rear knee near floor, front thigh parallel to ground |
| 3 | Same as frame 1 |

### 6. sb_ham_curl (Swiss ball hamstring curl)

| Frame | Description |
|---|---|
| 1 | Lying on back on mat, heels resting on Swiss ball, hips on floor, legs straight |
| 2 | Hips raised into bridge, heels pulling ball toward glutes, knees bent, body in straight line |
| 3 | Same as frame 1 |

### 7. p_cable_kickback (cable glute kickback)

| Frame | Description |
|---|---|
| 1 | Standing facing cable machine (or door anchor), one ankle cuffed to cable, leg at rest |
| 2 | Working leg kicked back and up, glute fully contracted, slight forward lean, hips square |
| 3 | Same as frame 1 |

### 8. calf_raises

| Frame | Description |
|---|---|
| 1 | Standing, feet flat on floor (or heel off step edge), holding support |
| 2 | On tiptoes, full plantar flexion, calves contracted |

*(2 frames only for this exercise)*

### 9. p_dead_bug

| Frame | Description |
|---|---|
| 1 | Lying on back, arms pointing straight up to ceiling, knees bent at 90 degrees above hips |
| 2 | Opposite arm and leg extended — one arm lowered toward floor overhead, opposite leg extended straight out, lower back pressed into mat |
| 3 | Same as frame 1 |

### 10. p_plank

| Frame | Description |
|---|---|
| 1 | Full plank on hands — straight line from head to heels, arms straight, looking down |
| 2 | Low forearm plank — on forearms, body straight, holding position |

*(2 frames — showing hand plank and forearm plank as two variations)*

### 11. pallof_press

| Frame | Description |
|---|---|
| 1 | Standing side-on to cable/band anchor, hands holding handle at chest, band taut |
| 2 | Arms extended straight out at chest height, pressing handle away from body, core braced against rotation |
| 3 | Same as frame 1 |

### 12. farmers_walk

| Frame | Description |
|---|---|
| 1 | Standing tall holding a heavy dumbbell or kettlebell in each hand at sides |
| 2 | Mid-stride walking, one foot forward, weights hanging at sides, upright posture |

*(2 frames — standing loaded and walking)*

---

## Pillow multi-frame cleanup script

Copy this script, set `EXERCISE_ID`, `FRAME_PATHS`, and `OUT_DIR` for each exercise, then run:

```bash
python3 - <<'PY'
from PIL import Image, ImageDraw
from pathlib import Path

EXERCISE_ID = 'goblet_squat'   # ← change this for each exercise
FRAME_PATHS = [
    Path('/path/to/frame1.png'),    # ← update paths to generated images
    Path('/path/to/frame2.png'),
    Path('/path/to/frame3.png'),    # ← remove this line if only 2 frames
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

# Remove backgrounds
cleaned = []
for p in FRAME_PATHS:
    if not p.exists():
        print(f'SKIP (not found): {p}')
        cleaned.append(None)
        continue
    cleaned.append(make_transparent(Image.open(p)))

# Union bounding box across all frames
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

After cleaning each exercise's frames:

```bash
for n in 1 2 3; do
  sips -g pixelWidth -g pixelHeight -g hasAlpha "assets/demos/<exercise_id>_${n}.png"
done
```

All present frames must show: `pixelWidth: 1024`, `pixelHeight: 1024`, `hasAlpha: yes`

---

## Commit

After all 12 exercises are done:

```bash
git add assets/demos/
git commit -m "feat: add demo frames — Phase 2C Workout C (goblet_squat, p_sumo_squat, rdl, hip_thrust, reverse_lunge, sb_ham_curl, p_cable_kickback, calf_raises, p_dead_bug, p_plank, pallof_press, farmers_walk)"
git push
```

You may also commit in batches (e.g. after every 4 exercises) if preferred.

---

## Do not touch

- `assets/anatomy/` — do not modify
- `assets/icons/` — icons already exist for all 12 Workout C exercises, do not regenerate
- `src/IronLog.jsx` — no code changes needed for this phase
