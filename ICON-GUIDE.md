# IronLog Icon Guide — Mandatory Read Before Any Image Generation

**Read this file in full before generating any icon or demo frame. Every time. Without exception.**

This is the single source of truth for IronLog image assets. It supersedes any older ad-hoc prompts.

---

## Visual Style Anchor

**Before generating anything, open this file and look at it:**

```
assets/demos/chin_up_1.png
```

Every icon and demo frame must match this visual style. If you cannot open this file, stop and ask.

---

## File Locations

| Asset type | Path | Size |
|---|---|---|
| Exercise icon | `assets/icons/<exercise_id>.png` | 324×324px |
| Stretch icon | `assets/icons/stretches/<stretch_id>.png` | 324×324px |
| Warmup/finisher icon | `assets/icons/warmup/<id>.png` | 324×324px |
| Demo animation frame | `assets/demos/<exercise_id>_1.png`, `_2.png`, `_3.png` | 1024×1024px |

All assets: **true transparent alpha**, **no background**, **no text**, **no border**.

---

## The IronLog Athlete — Locked Description

Paste this verbatim into every generation prompt. Do not paraphrase or shorten it.

```
Use the same IronLog athlete in every frame: an adult male fitness illustration with a lean, muscular build, broad shoulders, defined arms, narrow waist, athletic legs, and realistic but not bodybuilder-extreme proportions. He has a three-quarter facial profile with a strong angular jaw, straight nose, small focused eyes under defined brows, neutral concentrated expression, and visible ear when side-on. His hair is deep navy blue, short on the sides, fuller on top, swept upward and back in a clean quiff with visible strand lines. He wears a white sleeveless athletic tank with blue outline details only and no interior fill — the tank body appears white against the pale-blue filled skin underneath, light pale-blue athletic shorts ending just above the knee with simple seam lines, and white/very pale-blue low-top training shoes with blue outline details and visible laces. The body uses pale-blue translucent fill on skin, clothing highlights, and equipment highlights, sitting inside and just under the blue line work to create volume. Edges use crisp medium-blue vector line art with consistent 2-3px apparent stroke weight, darker blue contour accents for anatomy and folds, clean anti-aliased outlines, no sketchiness, no grey shadows, no text, and no background.
```

---

## Camera Families

Pick exactly one camera sentence per image and paste it into the prompt. Never mix or omit.

### Standing frontal/three-quarter
*Use for: curls, shoulder press, raises, pushdowns, face pulls, farmer's walk, Pallof press, calf raises, and other upright exercises.*
```
Camera: full-body standing view at chest height, slight three-quarter angle with the athlete facing right, neutral flat perspective, feet fully visible, equipment fully visible, figure occupies 72-82% of frame height and remains centred with generous transparent padding.
```

### Squat/lunge
*Use for: goblet squat, sumo squat, reverse lunge, split squat, step-up, walking lunge.*
```
Camera: full-body side-to-three-quarter view at hip height, athlete facing right, floor line implied but not drawn, both feet and the full lower-body position visible, weight held clearly in frame, figure occupies 72-82% of frame height and remains centred with generous transparent padding.
```

### Hinge
*Use for: RDL, deadlift, kettlebell deadlift, barbell row, tricep kickback, and other hip-hinge movements.*
```
Camera: full-body side-to-three-quarter view at hip height, athlete facing right, flat back and hip hinge readable, hands and weight visible close to the legs, feet fully visible, figure occupies 72-82% of frame height and remains centred with generous transparent padding.
```

### Bench/supine
*Use for: hip thrust, barbell hip thrust, Swiss ball hamstring curl, bench press family, incline/decline bench, fly, skull crushers, incline DB curl, lying stretches.*
```
Camera: side view at bench or torso height, athlete facing right unless the exercise guide specifies otherwise, bench/mat/ball runs horizontally across the frame, head, feet, and equipment all fully visible, figure and equipment together occupy 70-82% of frame width and remain centred with generous transparent padding.
```

### Floor/mat
*Use for: dead bug, plank, side plank, bird dog, child's pose, clamshell, frog pumps, donkey kick, and other mat-based exercises and stretches.*
```
Camera: low side view at torso height, athlete facing right where anatomically natural, mat runs horizontally across the frame, full body visible from head to feet or hands, pose silhouette clear at small size, figure occupies 70-82% of frame width and remains centred with generous transparent padding.
```

### Quadruped/low anchor
*Use for: cable kickback and hands-and-knees band/cable movements.*
```
Camera: low side view at hip height, athlete facing right on hands and knees, low door anchor or band attachment visible behind the working foot, band line visible but not dominant, full body and anchor visible, figure occupies 70-82% of frame width and remains centred with generous transparent padding.
```

---

## Master Prompt Template

Use this structure for every icon or demo frame. Fill in the three marked sections:

```
Professional fitness app exercise illustration.

[PASTE FULL ATHLETE BIBLE HERE — see "The IronLog Athlete" section above]

[PASTE ONE CAMERA FAMILY SENTENCE HERE — see "Camera Families" above]

[DESCRIBE THE SPECIFIC POSE/FRAME HERE]

Blue line art with subtle pale-blue body shading, transparent background, clean vector illustration style, consistent stroke weight, no text, no border, no background, 1024x1024 PNG.
```

For a 324px icon: generate at 1024px, then run the single-frame cleanup script. Do not request 324px directly from the generator.

---

## Quality Gate — Reject and Regenerate if Any Fail

| Check | Pass | Fail — regenerate |
|---|---|---|
| Head | Shaped with profile and hair | Blank oval or circle |
| Body | Pale-blue shading/fill on skin and clothing | Line art only, no fill |
| Pose | Clearly shows the exercise or stretch | Generic standing figure |
| Equipment | Visible and identifiable | Missing or ambiguous |
| Overall | Polished illustration | Pictogram / symbol |

**Do not run Pillow cleanup on a failing image.** Regenerate first.

---

## Generation Pipeline

### For a standalone icon (no animation)

1. Generate at 1024×1024 using the master prompt template
2. Visually check against the quality gate — regenerate if it fails
3. Run the **single-frame icon cleanup script** (outputs 324×324px)
4. Verify with `sips` — must show `pixelWidth: 324`, `pixelHeight: 324`, `hasAlpha: yes`
5. Save to the correct path (see File Locations above)

### For a demo animation set

1. **Generate demo frames first** (1024×1024) — typically 2 frames, 3 for complex movements
2. Visually check all frames against the quality gate — regenerate failures before cleanup
3. Run the **multi-frame cleanup script** — processes all frames together with a shared union bounding box so the figure stays the same apparent size across frames
4. Verify all frames with `sips` — all must show `pixelWidth: 1024`, `pixelHeight: 1024`, `hasAlpha: yes`
5. Derive the icon from the best demo frame using the **single-frame icon cleanup script**
6. Save demo frames to `assets/demos/<id>_1.png`, `_2.png`, etc. and icon to `assets/icons/<id>.png`

---

## Single-Frame Icon Cleanup Script (324×324px)

Use for standalone icons. Set `src` to the generated file path; set `out` to the final asset path.

```bash
python3 - <<'PY'
from PIL import Image, ImageDraw
from pathlib import Path

src = Path('/path/to/generated_image.png')   # ← set this
out = Path('assets/icons/<exercise_id>.png')  # ← set this

img = Image.open(src).convert('RGBA')
w, h = img.size
rgb = img.convert('RGB')
mask = Image.new('L', (w, h), 0)
draw = ImageDraw.Draw(mask)
visited = set()
seeds = [(0,0),(w-1,0),(0,h-1),(w-1,h-1)]

def flood(sx, sy, bg_color):
    stack = [(sx, sy)]
    while stack:
        x, y = stack.pop()
        if (x, y) in visited or not (0 <= x < w and 0 <= y < h):
            continue
        visited.add((x, y))
        pr, pg, pb = rgb.getpixel((x, y))
        br, bg_, bb = bg_color
        if abs(pr-br) + abs(pg-bg_) + abs(pb-bb) > 120:
            continue
        draw.point((x, y), fill=255)
        stack += [(x+1,y),(x-1,y),(x,y+1),(x,y-1)]

for sx, sy in seeds:
    flood(sx, sy, rgb.getpixel((sx, sy)))

r, g, b, a = img.split()
new_a = Image.composite(Image.new('L', (w, h), 0), a, mask)
img = Image.merge('RGBA', (r, g, b, new_a))

alpha = img.getchannel('A')
bbox = alpha.getbbox()
if not bbox:
    raise SystemExit('No visible content found')

content = img.crop(bbox)
target = 324
pad = 24
scale = min((target - pad * 2) / content.width, (target - pad * 2) / content.height)
new_size = (max(1, round(content.width * scale)), max(1, round(content.height * scale)))
content = content.resize(new_size, Image.Resampling.LANCZOS)

canvas = Image.new('RGBA', (target, target), (0, 0, 0, 0))
canvas.alpha_composite(content, ((target - new_size[0]) // 2, (target - new_size[1]) // 2))
out.parent.mkdir(parents=True, exist_ok=True)
canvas.save(out)
print(f'Saved: {out}')
PY
```

Verify:
```bash
sips -g pixelWidth -g pixelHeight -g hasAlpha assets/icons/<exercise_id>.png
# Must show: pixelWidth: 324 / pixelHeight: 324 / hasAlpha: yes
```

---

## Multi-Frame Demo Cleanup Script (1024×1024px)

Use for demo animation frames. All frames of one exercise are processed together so the figure stays the same apparent size across frames (union bounding box). Set `EXERCISE_ID` and `FRAME_PATHS` before running.

```bash
python3 - <<'PY'
from PIL import Image, ImageDraw
from pathlib import Path

EXERCISE_ID = 'exercise_name_here'      # ← set this
FRAME_PATHS = [
    Path(f'/path/to/generated/{EXERCISE_ID}_frame1.png'),
    Path(f'/path/to/generated/{EXERCISE_ID}_frame2.png'),
    # Path(f'/path/to/generated/{EXERCISE_ID}_frame3.png'),  # uncomment for 3-frame exercises
]
OUT_DIR = Path('assets/demos')
TARGET = 1024
PAD = 40

def make_transparent(img):
    rgba = img.convert('RGBA')
    rgb  = rgba.convert('RGB')
    mask = Image.new('L', rgba.size, 0)
    draw = ImageDraw.Draw(mask)
    w, h = rgba.size
    seeds = [(0,0),(w-1,0),(0,h-1),(w-1,h-1)]
    bg_color = rgb.getpixel((0, 0))
    visited = set()

    def flood(sx, sy):
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
        bg_color = rgb.getpixel((sx, sy))
        flood(sx, sy)

    r, g, b, a = rgba.split()
    new_a = Image.composite(Image.new('L', rgba.size, 0), a, mask)
    return Image.merge('RGBA', (r, g, b, new_a))

# Step 1 — remove backgrounds
cleaned = []
for p in FRAME_PATHS:
    if not p.exists():
        print(f'SKIP (not found): {p}')
        cleaned.append(None)
        continue
    cleaned.append(make_transparent(Image.open(p)))

# Step 2 — compute union bounding box across all frames
union_bbox = None
for img in cleaned:
    if img is None:
        continue
    alpha = img.getchannel('A')
    bbox = alpha.getbbox()
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
    raise SystemExit('No visible content in any frame')

union_bbox = tuple(union_bbox)
content_w = union_bbox[2] - union_bbox[0]
content_h = union_bbox[3] - union_bbox[1]
scale = min((TARGET - PAD * 2) / content_w, (TARGET - PAD * 2) / content_h)
new_w = max(1, round(content_w * scale))
new_h = max(1, round(content_h * scale))
print(f'Union bbox: {union_bbox}  scale: {scale:.3f}  output: {new_w}×{new_h}')

# Step 3 — crop, scale, centre, and save each frame
OUT_DIR.mkdir(parents=True, exist_ok=True)
for i, (img, src_path) in enumerate(zip(cleaned, FRAME_PATHS), start=1):
    if img is None:
        continue
    content = img.crop(union_bbox).resize((new_w, new_h), Image.Resampling.LANCZOS)
    canvas = Image.new('RGBA', (TARGET, TARGET), (0, 0, 0, 0))
    canvas.alpha_composite(content, ((TARGET - new_w) // 2, (TARGET - new_h) // 2))
    out_path = OUT_DIR / f'{EXERCISE_ID}_{i}.png'
    canvas.save(out_path)
    print(f'Saved: {out_path}')

print('Done.')
PY
```

Verify all frames:
```bash
sips -g pixelWidth -g pixelHeight -g hasAlpha assets/demos/<exercise_id>_1.png
sips -g pixelWidth -g pixelHeight -g hasAlpha assets/demos/<exercise_id>_2.png
# All must show: pixelWidth: 1024 / pixelHeight: 1024 / hasAlpha: yes
```

---

## Stretch Icons

Stretch icons follow exactly the same process as exercise icons:
- Same athlete bible (locked description above)
- Same quality gate
- Same 324×324px standard (single-frame cleanup script)
- Same camera families — use **Floor/mat** for most stretches, **Bench/supine** for lying stretches, **Standing frontal** for standing stretches
- Save to `assets/icons/stretches/<stretch_id>.png`

**Stretch animated demo frames** (multi-frame, 1024×1024) are a planned future feature — not yet implemented. When the time comes, use the multi-frame cleanup script above and save to `assets/demos/stretches/<stretch_id>_1.png` etc.

---

## Updating `PNG_EXERCISE_ICON_IDS` in `src/IronLog.jsx`

After adding new exercise icons, add the exercise IDs to the `PNG_EXERCISE_ICON_IDS` Set in `src/IronLog.jsx` (around line 186) so the app uses the PNG instead of the SVG fallback.

After editing:
```bash
cd "/Users/phillcantone/Library/Mobile Documents/com~apple~CloudDocs/Family/Phill/AI Coding/Ironlog"
node build.js
```

Commit these four files together:
```
src/IronLog.jsx  dist/index.html  index.html  version.json
```

Then push immediately:
```bash
git push origin main
```

---

## Do Not Touch

- `assets/anatomy/` — annotated anatomical SVGs, fully complete, do not modify or regenerate
- `assets/icons/warmup/` — warmup/finisher icons (complete set), do not modify unless specifically asked
- `dist/index.html` and root `index.html` — never edit directly, always rebuild via `node build.js`
- `src/IronLog.jsx` — for image tasks, only change `PNG_EXERCISE_ICON_IDS`, nothing else
