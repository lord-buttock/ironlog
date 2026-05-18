# Codex Instructions — Stretch Routine Icons: 15 Images

*Read this fully before doing anything.*

---

## What we're building

IronLog is a single-file React PWA fitness tracker. We've just added a **full-body stretch routine** — a standalone guided sequence accessible from the Home screen via a "Start Stretching" button.

The stretch routine works like this:
- The app steps through 12 stretches one at a time
- Each stretch screen shows: stretch name, target muscles, one or two thumbnail images, a count-up timer, cue text, and a Next/Switch Sides button
- The user taps any image to enlarge it (lightbox) with full cue text
- For bilateral stretches, the app prompts "Left Side" then "Right Side" separately
- Three stretches display **two images side by side** (with labels) because they involve distinct positions that are both important to show

Your job is to generate all 15 images for these stretch screens.

---

## Spec

- **Output folder:** `assets/icons/stretches/`
- **Filename:** `<image_id>.png` — see the table below for exact filenames
- **Format:** PNG with true transparent alpha background
- **Style:** Blue line art with subtle pale-blue body shading — same style as the existing icons
- **Pipeline:** Follow the single-frame cleanup pipeline in `Image-Process.md` exactly

Read `Image-Process.md` now for the authoritative size spec, Pillow cleanup script, and quality gate.

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
clear equipment visible where applicable, clean vector illustration style,
consistent stroke weight, no text, no border, no background, [SIZE] PNG
```

Replace `[SIZE]` with the output size from `Image-Process.md`. Replace `[DESCRIPTION]` with the description from the table below.

---

## Quality gate — reject and regenerate if:

| Check | Pass | Fail |
|---|---|---|
| Head | Shaped with profile and hair | Blank oval or circle |
| Body | Has pale-blue shading/fill | Line art only, no fill |
| Pose | Clearly shows the described position | Generic standing figure |
| Equipment | Visible and identifiable where applicable | Missing or ambiguous |
| Overall | Polished illustration | Pictogram or symbol |

---

## Workflow for each icon

1. Generate image using the prompt template
2. Check against quality gate — regenerate if any check fails
3. Run the single-frame Pillow cleanup script from `Image-Process.md`
4. Verify with `sips`: correct pixel dimensions, `hasAlpha: yes`
5. Save to `assets/icons/stretches/<image_id>.png`
6. Move to the next image

---

## The 15 images

Most stretches have one image. Three stretches have two images each (marked with ★) because they involve distinct positions that are displayed side-by-side in the app with a label under each.

### Single-image stretches (9 images)

| Image ID | Display label | Description for prompt |
|---|---|---|
| `str_neck` | Neck Side Stretch | Person seated or standing upright, one hand placed gently on the side of their head, tilting their ear toward their shoulder in a neck side stretch, face remaining forward with no rotation |
| `str_cross_shoulder` | Cross-Body Shoulder Stretch | Person standing, one arm drawn straight across their chest at shoulder height, opposite hand placed on the upper arm gently pulling it closer to the body, cross-body shoulder stretch |
| `str_upper_back_roller` | Upper Back Foam Roller | Person lying on the floor with a cylindrical foam roller placed horizontally across their upper back (perpendicular to the spine), hips resting on the ground, hands clasped behind the head, upper back extending backwards over the roller in a thoracic extension stretch |
| `str_childs_pose` | Child's Pose | Person kneeling on a mat, sitting back toward their heels, arms stretched forward along the floor, forehead lowered toward the mat, lower back lengthening in a child's pose yoga stretch |
| `str_spinal_rotation` | Seated Spinal Rotation | Person seated upright on the floor with legs crossed, hands placed behind their head with elbows wide, torso rotated to one side while hips remain facing forward, seated spinal rotation stretch |
| `str_hip_flexor` | Kneeling Hip Flexor Stretch | Person in a kneeling lunge position, one knee on the floor and the other foot forward, hips gently pressed forward, feeling a stretch at the front of the rear hip, kneeling hip flexor stretch |
| `str_figure_four` | Figure-4 Glute Stretch | Person lying on their back on a mat, knees bent, one ankle crossed over the opposite knee forming a figure-4 shape, hands gently pulling the uncrossed leg toward the chest, figure-four glute and piriformis stretch |
| `str_hamstring` | Lying Hamstring Stretch | Person lying flat on their back on a mat, one leg flat on the floor and the other raised toward the ceiling with a resistance band or towel looped around the raised foot, lying hamstring stretch |
| `str_it_band` | IT Band Stretch | Person standing near a wall with one hand lightly touching it for balance, one leg crossed behind the other, hips leaning away from the crossed leg to create a stretch along the outer hip and thigh, IT band lateral hip stretch |

---

### ★ Two-image stretches (6 images across 3 stretches)

These three stretches each have two distinct positions. Generate both images. They will be displayed side by side in the app with a small label beneath each.

---

#### Pec Stretch on Foam Roller — T Position and W Position

The person lies lengthways along a foam roller (the roller runs along the spine from head to tailbone). These two images show the two arm positions used in sequence.

| Image ID | Label shown in app | Description for prompt |
|---|---|---|
| `str_pec_roller_t` | T Position | Person lying lengthways on a cylindrical foam roller that supports the full spine from head to tailbone, arms spread out to the sides at shoulder height forming a T shape, palms facing upward, chest opening toward the ceiling, pec stretch T position on foam roller |
| `str_pec_roller_w` | W Position | Person lying lengthways on a cylindrical foam roller that supports the full spine, arms raised with elbows bent to 90 degrees and forearms pointing upward forming a W shape, palms facing upward, chest opening toward the ceiling, pec stretch W position on foam roller |

---

#### Cat-Cow — Cow Position and Cat Position

These two images show the opposite ends of the cat-cow movement. They are always done together as a flowing spinal mobility exercise.

| Image ID | Label shown in app | Description for prompt |
|---|---|---|
| `str_cat_cow_cow` | Cow | Person on hands and knees on a mat, spine arched downward with belly dropping toward the floor, head lifted and gaze forward, tailbone tilted upward, cow position of the cat-cow spinal mobility exercise |
| `str_cat_cow_cat` | Cat | Person on hands and knees on a mat, spine rounded upward toward the ceiling like a scared cat, chin tucked toward the chest, tailbone tucked under, cat position of the cat-cow spinal mobility exercise |

---

#### Calf Stretch — Straight Knee and Bent Knee

These two images show the two knee positions used in the calf stretch, which target different muscles (gastrocnemius vs soleus).

| Image ID | Label shown in app | Description for prompt |
|---|---|---|
| `str_calf_straight` | Straight Knee | Person in a lunge stance facing a wall with both hands flat on the wall, back leg fully straight with heel pressed firmly into the floor, front knee slightly bent, stretching the upper calf gastrocnemius muscle, straight-knee calf stretch |
| `str_calf_bent` | Bent Knee | Person in a lunge stance facing a wall with both hands flat on the wall, back knee slightly bent while heel stays pressed into the floor, front knee also bent, targeting the lower calf soleus muscle, bent-knee calf stretch |

---

## Commit schedule

Commit after all 15 icons are done in one commit:

```
feat: add stretch routine icons (15 images, 12 stretches)
```

Then push once.

---

## Do not touch

- `assets/demos/` — demo frames, do not modify
- `assets/icons/warmup/` — warmup/finisher icons, do not modify
- `assets/icons/` (root level icons) — exercise icons, do not modify
- `assets/anatomy/` — do not modify
- `src/IronLog.jsx` — no code changes needed
- `index.html`, `version.json` — do not modify
