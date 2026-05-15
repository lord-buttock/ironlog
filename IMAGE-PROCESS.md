# IronLog Image Process

This file records the tested workflow for producing exercise icon PNGs for IronLog.

## Goal

Create exercise icons that can be used at:

```text
assets/icons/<exercise_id>.png
```

Target format:

- PNG
- 108 x 108 px
- true transparent alpha channel
- no checkerboard baked into the image
- no text
- no background
- blue fitness illustration suitable for display inside IronLog's circular icon holder

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

Use this prompt for all icon generation going forward:

```text
Professional fitness app exercise illustration, [EXERCISE DESCRIPTION],
blue line art with subtle pale-blue body shading, transparent background,
detailed human figure with shaped head and hair and facial profile,
no blank oval face, realistic exercise pose with correct body proportions,
clear equipment visible, clean vector illustration style,
consistent stroke weight, no text, no border, no background, 108x108 PNG
```

Replace `[EXERCISE DESCRIPTION]` with the specific movement description for each exercise.

### Workflow for remaining icons

1. Generate using the approved prompt above
2. Visually check against the quality gate before running Pillow cleanup
3. If the icon fails the quality gate — regenerate, do not clean and ship a substandard icon
4. Run Pillow cleanup script (see above)
5. Verify with `sips` (108×108, hasAlpha: yes)
6. Save to `assets/icons/<exercise_id>.png`

### Regeneration required

The following Workout C icons were generated before this style standard was established and should be regenerated to match the RDL style anchor:

- `goblet_squat.png` — confirmed substandard (blank oval head, no body shading)
- All other Workout C icons should be reviewed against the quality gate and regenerated if they do not match

---

## Current Recommendation

For all remaining icons (Workouts A and B, plus any Workout C regenerations):

1. Use the approved generation prompt with the RDL icon as the visual reference.
2. Apply the quality gate check before Pillow cleanup — regenerate failures immediately.
3. Run the Pillow cleanup script on each approved generated image.
4. Save cleaned outputs to:

```text
assets/icons/<exercise_id>.png
```

5. Verify every output with:

```bash
sips -g pixelWidth -g pixelHeight -g hasAlpha assets/icons/<exercise_id>.png
```

6. Confirm:

```text
pixelWidth: 108
pixelHeight: 108
hasAlpha: yes
```

Quick Look SVG conversion is also viable for hand-authored SVG icons, but for AI-generated artwork, Pillow cleanup is currently the best tested route.

