# IronLog Image Process

This file records the tested workflow for producing exercise icon PNGs for IronLog.

## Goal

Create exercise icons that can be used at:

```text
assets/icons/<exercise_id>.png
```

Target format:

- PNG
- **324 × 324 px** (3× Retina — renders sharp at 108px CSS display size)
- true transparent alpha channel
- no checkerboard baked into the image
- no text
- no background
- blue fitness illustration suitable for display inside IronLog's circular icon holder

> **Note:** Early test icons were produced at 108×108px (see test record below). The current standard is 324×324px. All new icons must use the updated spec.

## Test Icon

The first tested image was a generated goblet squat icon.

Source generated image:

```text
/Users/phillcantone/.codex/generated_images/019e1c0a-ea13-73b2-8130-2813705f765c/ig_090e99d2b488713a016a06360506c48191a38490a5851b11a1.png
```

Cleaned output:

```text
/private/tmp/ironlog-icon-tests/goblet_squat_ai_clean.png
```

Verification result:

```text
pixelWidth: 108
pixelHeight: 108
hasAlpha: yes
```

## What Was Tried

### 1. Check local repo state

Before touching anything:

```bash
cd "/Users/phillcantone/Library/Mobile Documents/com~apple~CloudDocs/Family/Phill/AI Coding/Ironlog"
git status --short --branch
```

Result:

```text
## main...origin/main
```

The repo was clean and aligned with GitHub.

### 2. Check available image tooling

Commands:

```bash
node -e "for (const m of ['sharp','canvas','svg-to-img']) { try { require.resolve(m); console.log(m+': yes') } catch(e) { console.log(m+': no') } }"
sips --version
command -v qlmanage
command -v magick
command -v convert
command -v rsvg-convert
```

Results:

```text
sharp: no
canvas: no
svg-to-img: no
sips-316
/usr/bin/qlmanage
```

ImageMagick (`magick` / `convert`) and `rsvg-convert` were not installed.

### 3. Test SVG to PNG conversion with Quick Look

A hand-authored test SVG was created at:

```text
/private/tmp/ironlog-icon-tests/goblet_squat.svg
```

Then Quick Look was tried:

```bash
mkdir -p /private/tmp/ironlog-icon-tests/ql
qlmanage -t -s 108 -o /private/tmp/ironlog-icon-tests/ql /private/tmp/ironlog-icon-tests/goblet_squat.svg
```

First attempt failed inside the sandbox:

```text
sandbox initialization failed: invalid data type of path filter; expected pattern, got boolean
```

The same command worked after approval to run outside the sandbox:

```text
Testing Quick Look thumbnails with files:
  /private/tmp/ironlog-icon-tests/goblet_squat.svg
* /tmp/ironlog-icon-tests/goblet_squat.svg produced one thumbnail
Done producing thumbnails
```

Output:

```text
/private/tmp/ironlog-icon-tests/ql/goblet_squat.svg.png
```

Verification:

```bash
sips -g pixelWidth -g pixelHeight -g hasAlpha /private/tmp/ironlog-icon-tests/ql/goblet_squat.svg.png
```

Result:

```text
pixelWidth: 108
pixelHeight: 108
hasAlpha: yes
```

Conclusion: Quick Look can produce true transparent PNGs from SVG, but it may require elevated permission in Codex Desktop.

### 4. Test direct SVG conversion with `sips`

Command:

```bash
sips -s format png /private/tmp/ironlog-icon-tests/goblet_squat.svg --out /private/tmp/ironlog-icon-tests/goblet_squat_sips.png
```

Result:

```text
Error: Cannot extract image from file.
Error 13: an unknown error occurred
```

Conclusion: `sips` can inspect PNGs, but it could not convert the SVG directly.

### 5. Generate an AI PNG

Prompt used:

```text
Minimal fitness line art illustration, person in deep squat position holding a kettlebell at chest height with both hands,
clean vector style, blue #5b9df5 strokes on transparent background,
simple stick figure with body mass, equipment clearly visible,
no text, no background, no border, 108x108px PNG,
consistent with a professional fitness app icon set
```

The image looked visually good, but verification showed it was not actually transparent.

Command:

```bash
sips -g pixelWidth -g pixelHeight -g hasAlpha /Users/phillcantone/.codex/generated_images/019e1c0a-ea13-73b2-8130-2813705f765c/ig_090e99d2b488713a016a06360506c48191a38490a5851b11a1.png
file /Users/phillcantone/.codex/generated_images/019e1c0a-ea13-73b2-8130-2813705f765c/ig_090e99d2b488713a016a06360506c48191a38490a5851b11a1.png
```

Result:

```text
pixelWidth: 1254
pixelHeight: 1254
hasAlpha: no
PNG image data, 1254 x 1254, 8-bit/color RGB, non-interlaced
```

Conclusion: the checkerboard was baked into the image. The AI-generated PNG was visually useful but not directly usable as an app asset.

## Successful Cleanup Method

Pillow was available:

```bash
python3 - <<'PY'
try:
    from PIL import Image
    print('pillow: yes')
except Exception as e:
    print('pillow: no', e)
PY
```

Result:

```text
pillow: yes
```

The cleanup script removed the fake checkerboard by treating low-saturation grey/white pixels as background and preserving blue artwork pixels.

```bash
python3 - <<'PY'
from PIL import Image
from pathlib import Path

src = Path('/Users/phillcantone/.codex/generated_images/019e1c0a-ea13-73b2-8130-2813705f765c/ig_090e99d2b488713a016a06360506c48191a38490a5851b11a1.png')
out = Path('/private/tmp/ironlog-icon-tests/goblet_squat_ai_clean.png')

img = Image.open(src).convert('RGBA')
pix = img.load()
w, h = img.size

# Make alpha from colour saturation / blue dominance.
# The checkerboard is near-neutral; the icon is blue.
for y in range(h):
    for x in range(w):
        r, g, b, a = pix[x, y]
        mx = max(r, g, b)
        mn = min(r, g, b)
        sat = 0 if mx == 0 else (mx - mn) / mx
        blue_bias = b - max(r, g)

        # Strongly keep blue line/fill pixels; fade anti-aliased edge pixels.
        score = max((sat - 0.055) / 0.16, (blue_bias - 5) / 55)
        alpha = int(max(0, min(1, score)) * 255)

        # Prevent tiny compression noise in the checkerboard from surviving.
        if alpha < 18:
            alpha = 0

        pix[x, y] = (r, g, b, alpha)

# Crop visible content.
alpha = img.getchannel('A')
bbox = alpha.getbbox()
if not bbox:
    raise SystemExit('No visible content found')

content = img.crop(bbox)

# Fit into a 108px transparent square with padding.
target = 108
pad = 8
scale = min((target - pad * 2) / content.width, (target - pad * 2) / content.height)
new_size = (
    max(1, round(content.width * scale)),
    max(1, round(content.height * scale)),
)
content = content.resize(new_size, Image.Resampling.LANCZOS)

canvas = Image.new('RGBA', (target, target), (0, 0, 0, 0))
canvas.alpha_composite(content, ((target - new_size[0]) // 2, (target - new_size[1]) // 2))

out.parent.mkdir(parents=True, exist_ok=True)
canvas.save(out)
print(out)
PY
```

Verification:

```bash
sips -g pixelWidth -g pixelHeight -g hasAlpha /private/tmp/ironlog-icon-tests/goblet_squat_ai_clean.png
```

Result:

```text
pixelWidth: 108
pixelHeight: 108
hasAlpha: yes
```

## Icon Art Direction — Approved Style Standard

**Established 2026-05-15 after Workout C first-pass review.**

### Approved style anchor

The **RDL (Romanian Deadlift) icon** is the approved style reference for all future icons.

What defines this style:
- **Shaped head with hair and profile** — not a blank oval or circle. The head reads as a real person.
- **Subtle pale-blue body shading** — filled body regions, not just outlines. Torso, limbs, and clothing areas have a light blue fill that gives the figure volume.
- **Realistic human anatomy and pose** — proportions suggest a real body. The pose is recognisably the exercise, not a generic standing figure.
- **Clear equipment** — weights, bands, or surfaces are unambiguous at small sizes.
- **Polished illustration feel** — consistent stroke weight, clean anti-aliasing, professional finish.

### Rejected style (do not use)

The first **goblet squat icon** represents the style to avoid:
- Blank oval head — no profile, hair, or facial detail
- No body shading — pure line art with no fill
- Generic pictogram quality — could be from any icon set
- Reads as a symbol, not an illustration

### Quality gate — reject and regenerate if any of the following apply

| Check | Pass | Fail |
|---|---|---|
| Head | Shaped with profile/hair | Blank oval or circle |
| Body | Has pale-blue shading/fill | Line art only, no fill |
| Pose | Clearly shows the exercise | Generic standing figure |
| Equipment | Visible and identifiable | Missing or ambiguous |
| Overall | Polished illustration | Pictogram / symbol |

### Generation prompt — approved version

Use the master prompt template in **IronLog Athlete Bible & Camera Families** for all icon and demo generation going forward. The old single-slot prompt is retired because it did not lock the athlete identity or camera angle tightly enough.

### Workflow for remaining icons

1. Generate using the approved prompt above
2. Visually check against the quality gate before running Pillow cleanup
3. If the icon fails the quality gate — regenerate, do not clean and ship a substandard icon
4. Run Pillow cleanup script (see above)
5. Verify with `sips` (324×324, hasAlpha: yes)
6. Save to `assets/icons/<exercise_id>.png`

### Regeneration required

The following Workout C icons were generated before this style standard was established and should be regenerated to match the RDL style anchor:

- `goblet_squat.png` — confirmed substandard (blank oval head, no body shading)
- All other Workout C icons should be reviewed against the quality gate and regenerated if they do not match

---

## IronLog Athlete Bible & Camera Families

**Established 2026-05-17 before Phase 2C.** This section is the source of truth for character identity and camera consistency. Paste the locked athlete description and the appropriate camera-family sentence into every future image generation prompt.

### Locked athlete description

```text
Use the same IronLog athlete in every frame: an adult male fitness illustration with a lean, muscular build, broad shoulders, defined arms, narrow waist, athletic legs, and realistic but not bodybuilder-extreme proportions. He has a three-quarter facial profile with a strong angular jaw, straight nose, small focused eyes under defined brows, neutral concentrated expression, and visible ear when side-on. His hair is deep navy blue, short on the sides, fuller on top, swept upward and back in a clean quiff with visible strand lines. He wears a white sleeveless athletic tank with blue outline details only and no interior fill — the tank body appears white against the pale-blue filled skin underneath, light pale-blue athletic shorts ending just above the knee with simple seam lines, and white/very pale-blue low-top training shoes with blue outline details and visible laces. The body uses pale-blue translucent fill on skin, clothing highlights, and equipment highlights, sitting inside and just under the blue line work to create volume. Edges use crisp medium-blue vector line art with consistent 2-3px apparent stroke weight, darker blue contour accents for anatomy and folds, clean anti-aliased outlines, no sketchiness, no grey shadows, no text, and no background.
```

### Camera families

#### Standing frontal/three-quarter

Use for calf raises, farmer's walk, Pallof press, curls, shoulder press, raises, pushdowns, face pulls, and other upright exercises.

```text
Camera: full-body standing view at chest height, slight three-quarter angle with the athlete facing right, neutral flat perspective, feet fully visible, equipment fully visible, figure occupies 72-82% of frame height and remains centred with generous transparent padding.
```

#### Squat/lunge

Use for goblet squat, sumo squat, reverse lunge, split squat, and step-up patterns.

```text
Camera: full-body side-to-three-quarter view at hip height, athlete facing right, floor line implied but not drawn, both feet and the full lower-body position visible, weight held clearly in frame, figure occupies 72-82% of frame height and remains centred with generous transparent padding.
```

#### Hinge

Use for RDL, deadlift, kettlebell deadlift, and other hip-hinge movements.

```text
Camera: full-body side-to-three-quarter view at hip height, athlete facing right, flat back and hip hinge readable, hands and weight visible close to the legs, feet fully visible, figure occupies 72-82% of frame height and remains centred with generous transparent padding.
```

#### Bench/supine

Use for hip thrust, Swiss ball hamstring curl, bench press family, floor press, fly, skull crushers, glute bridge, and lying stretches.

```text
Camera: side view at bench or torso height, athlete facing right unless the exercise guide specifies otherwise, bench/mat/ball runs horizontally across the frame, head, feet, and equipment all fully visible, figure and equipment together occupy 70-82% of frame width and remain centred with generous transparent padding.
```

#### Floor/mat

Use for dead bug, plank, side plank, bird dog, child's pose, clamshell, frog pumps, donkey kick, and other mat-based work.

```text
Camera: low side view at torso height, athlete facing right where anatomically natural, mat runs horizontally across the frame, full body visible from head to feet or hands, pose silhouette clear at small size, figure occupies 70-82% of frame width and remains centred with generous transparent padding.
```

#### Quadruped/low anchor

Use for cable kickback and any hands-and-knees band/cable movement.

```text
Camera: low side view at hip height, athlete facing right on hands and knees, low door anchor or band attachment visible behind the working foot, band line visible but not dominant, full body and anchor visible, figure occupies 70-82% of frame width and remains centred with generous transparent padding.
```

### Updated master prompt template

Use this structure for every future icon or demo frame. Paste the complete athlete bible into `[ATHLETE BIBLE]`, paste exactly one camera-family sentence into `[CAMERA FAMILY]`, then add the specific frame/exercise instruction.

```text
Professional fitness app exercise illustration.

[ATHLETE BIBLE]

[CAMERA FAMILY]

[EXERCISE DESCRIPTION]

Blue line art with subtle pale-blue body shading, transparent background, clean vector illustration style, consistent stroke weight, no text, no border, no background, 1024x1024 PNG.
```

For a 324px icon, generate the same source style and derive the icon from the best cleaned demo frame using the icon cleanup process. Do not use a separate character or camera prompt for the icon.

### Worked example — goblet squat frame 2

```text
Professional fitness app exercise illustration.

Use the same IronLog athlete in every frame: an adult male fitness illustration with a lean, muscular build, broad shoulders, defined arms, narrow waist, athletic legs, and realistic but not bodybuilder-extreme proportions. He has a three-quarter facial profile with a strong angular jaw, straight nose, small focused eyes under defined brows, neutral concentrated expression, and visible ear when side-on. His hair is deep navy blue, short on the sides, fuller on top, swept upward and back in a clean quiff with visible strand lines. He wears a white sleeveless athletic tank with blue outline details only and no interior fill — the tank body appears white against the pale-blue filled skin underneath, light pale-blue athletic shorts ending just above the knee with simple seam lines, and white/very pale-blue low-top training shoes with blue outline details and visible laces. The body uses pale-blue translucent fill on skin, clothing highlights, and equipment highlights, sitting inside and just under the blue line work to create volume. Edges use crisp medium-blue vector line art with consistent 2-3px apparent stroke weight, darker blue contour accents for anatomy and folds, clean anti-aliased outlines, no sketchiness, no grey shadows, no text, and no background.

Camera: full-body side-to-three-quarter view at hip height, athlete facing right, floor line implied but not drawn, both feet and the full lower-body position visible, weight held clearly in frame, figure occupies 72-82% of frame height and remains centred with generous transparent padding.

Goblet squat midpoint frame: athlete holding a kettlebell at chest height with both hands, descending into a squat halfway through the range of motion, knees tracking outward, chest upright, kettlebell clearly visible and consistent with the other goblet squat frames.

Blue line art with subtle pale-blue body shading, transparent background, clean vector illustration style, consistent stroke weight, no text, no border, no background, 1024x1024 PNG.
```

### Phase 2C camera lookup table

| Exercise ID | Camera family |
|---|---|
| `goblet_squat` | Squat/lunge |
| `p_sumo_squat` | Squat/lunge |
| `rdl` | Hinge |
| `hip_thrust` | Bench/supine |
| `reverse_lunge` | Squat/lunge |
| `sb_ham_curl` | Bench/supine |
| `p_cable_kickback` | Quadruped/low anchor |
| `calf_raises` | Standing frontal/three-quarter |
| `p_dead_bug` | Floor/mat |
| `p_plank` | Floor/mat |
| `pallof_press` | Standing frontal/three-quarter |
| `farmers_walk` | Standing frontal/three-quarter |

---

## Multi-Frame Demo Animation — Consistent Scale Cleanup

**Problem identified 2026-05-17:** When frames of an animated demo are cleaned independently, each frame is cropped to its own content bounding box and scaled to fit 108×108px. This causes the figure to appear larger or smaller between frames — e.g. a seated frame with arms low (wide bbox) vs. a frame with arms raised overhead (tall narrow bbox) appear at different scales, creating a jarring jump in the animation.

**Fix:** Process all frames of an exercise together. Compute a single union bounding box across all frames (after alpha masking), then apply the same scale factor to every frame. The figure stays the same apparent size throughout the animation.

### Multi-frame cleanup script (use for all demo animations)

```bash
python3 - <<'PY'
from PIL import Image
from pathlib import Path

EXERCISE_ID = 'exercise_name_here'   # ← set this
FRAME_PATHS = [
    Path(f'/path/to/generated/{EXERCISE_ID}_frame1.png'),
    Path(f'/path/to/generated/{EXERCISE_ID}_frame2.png'),
    Path(f'/path/to/generated/{EXERCISE_ID}_frame3.png'),  # omit if only 2 frames
]
OUT_DIR = Path('/path/to/assets/demos')
TARGET = 1024   # demo frames are 1024×1024
PAD = 40

def make_transparent(img):
    """Flood-fill background from all four edges, then erase."""
    from PIL import ImageDraw
    rgba = img.convert('RGBA')
    rgb  = rgba.convert('RGB')
    # Flood-fill from all four corners with tolerance=40
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
            diff = abs(pr-br) + abs(pg-bg_) + abs(pb-bb)
            if diff > 40 * 3:
                continue
            draw.point((x, y), fill=255)
            stack += [(x+1,y),(x-1,y),(x,y+1),(x,y-1)]

    for sx, sy in seeds:
        bg_color = rgb.getpixel((sx, sy))
        flood(sx, sy)

    # Apply mask: background pixels → transparent
    r, g, b, a = rgba.split()
    new_a = Image.eval(mask, lambda v: 0 if v > 128 else 255)
    new_a = Image.composite(Image.new('L', rgba.size, 0), a, mask)
    result = Image.merge('RGBA', (r, g, b, new_a))
    return result

# Step 1 — remove backgrounds from all frames
cleaned = []
for p in FRAME_PATHS:
    if not p.exists():
        print(f'SKIP (not found): {p}')
        cleaned.append(None)
        continue
    img = Image.open(p)
    cleaned.append(make_transparent(img))

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
    raise SystemExit('No visible content found in any frame')

union_bbox = tuple(union_bbox)
content_w = union_bbox[2] - union_bbox[0]
content_h = union_bbox[3] - union_bbox[1]
scale = min((TARGET - PAD * 2) / content_w, (TARGET - PAD * 2) / content_h)
new_w = max(1, round(content_w * scale))
new_h = max(1, round(content_h * scale))

print(f'Union bbox: {union_bbox}  content: {content_w}×{content_h}  scale: {scale:.3f}  output: {new_w}×{new_h}')

# Step 3 — crop each frame to the union bbox, scale, centre, and save
OUT_DIR.mkdir(parents=True, exist_ok=True)
for i, (img, src_path) in enumerate(zip(cleaned, FRAME_PATHS), start=1):
    if img is None:
        continue
    content = img.crop(union_bbox)
    content = content.resize((new_w, new_h), Image.Resampling.LANCZOS)
    canvas = Image.new('RGBA', (TARGET, TARGET), (0, 0, 0, 0))
    canvas.alpha_composite(content, ((TARGET - new_w) // 2, (TARGET - new_h) // 2))
    out_path = OUT_DIR / f'{EXERCISE_ID}_{i}.png'
    canvas.save(out_path)
    print(f'Saved: {out_path}')

print('Done.')
PY
```

### Verification (all frames must match)

```bash
sips -g pixelWidth -g pixelHeight -g hasAlpha assets/demos/<exercise_id>_1.png
sips -g pixelWidth -g pixelHeight -g hasAlpha assets/demos/<exercise_id>_2.png
sips -g pixelWidth -g pixelHeight -g hasAlpha assets/demos/<exercise_id>_3.png
```

All frames must report `pixelWidth: 1024`, `pixelHeight: 1024`, `hasAlpha: yes`.

---

## Single-Frame Icon Cleanup (standalone icon, no animation)

Use this for icons that are not part of a demo animation set. It crops to the image's own bounding box and scales independently.

```bash
python3 - <<'PY'
from PIL import Image
from pathlib import Path

src = Path('/path/to/generated_image.png')
out = Path('assets/icons/<exercise_id>.png')

img = Image.open(src).convert('RGBA')
pix = img.load()
w, h = img.size

# Flood-fill from all four edges to find background
from PIL import ImageDraw
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
target = 324   # 3× Retina: 324px source renders sharp at 108px CSS
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

Verification:

```bash
sips -g pixelWidth -g pixelHeight -g hasAlpha assets/icons/<exercise_id>.png
```

Must report `pixelWidth: 324`, `pixelHeight: 324`, `hasAlpha: yes`.

---

## Current Recommendation

For all icons and demo frames:

1. **Icons (standalone):** Use the single-frame cleanup script above. Output is 324×324px.
2. **Demo frames (animation):** Use the multi-frame cleanup script above. Output is 1024×1024px. All frames of an exercise must be processed together to share the same scale factor.
3. Use the approved generation prompt with the RDL icon as the visual reference.
4. Apply the quality gate check before Pillow cleanup — regenerate failures immediately.
5. Verify every output with `sips`.

Quick Look SVG conversion is also viable for hand-authored SVG icons, but for AI-generated artwork, Pillow cleanup is currently the best tested route.
