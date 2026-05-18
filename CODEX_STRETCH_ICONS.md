# Codex Instructions — Stretch Routine Icons: 12 Stretches

*Read this fully before doing anything.*

---

## Purpose

Generate 12 exercise icons for the IronLog stretch routine. These appear as thumbnails in the guided stretch sequence screen and can be tapped to enlarge (lightbox).

---

## Spec

- **Output folder:** `assets/icons/stretches/`
- **Filename:** `<stretch_id>.png` (e.g. `assets/icons/stretches/str_neck.png`)
- **Format:** PNG with true transparent alpha background
- **Style:** Blue line art with subtle pale-blue body shading — same style as existing icons
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
| Pose | Clearly shows the described stretch | Generic standing figure |
| Equipment | Visible and identifiable (where applicable) | Missing or ambiguous |
| Overall | Polished illustration | Pictogram or symbol |

---

## Workflow for each icon

1. Generate image using the prompt template
2. Check against quality gate — regenerate if any check fails
3. Run the single-frame Pillow cleanup script from `Image-Process.md`
4. Verify with `sips`: correct pixel dimensions, `hasAlpha: yes`
5. Save to `assets/icons/stretches/<stretch_id>.png`
6. Move to the next stretch

---

## The 12 stretches

| Stretch ID | Description for prompt |
|---|---|
| `str_neck` | Person seated or standing, one hand gently placed on the side of their head, tilting ear toward shoulder in a neck side stretch, keeping face forward |
| `str_cross_shoulder` | Person standing, one arm drawn across their chest at shoulder height, opposite hand gently pulling the arm closer to the body, cross-body shoulder stretch |
| `str_pec_roller` | Person lying lengthways on a cylindrical foam roller that supports the full spine, arms spread wide to the sides in a T position, chest opening toward the ceiling, pec stretch on foam roller |
| `str_upper_back_roller` | Person lying with a foam roller placed perpendicular across their upper back, hips on the floor, hands clasped behind the head, upper back extending backwards over the roller |
| `str_cat_cow` | Person on hands and knees on a mat, spine arched upward in the cat position — back rounded toward ceiling, chin tucked toward chest, cat-cow spinal mobility exercise |
| `str_childs_pose` | Person kneeling on a mat, sitting back toward heels, arms stretched forward along the floor in front, forehead resting toward the mat, child's pose yoga stretch |
| `str_spinal_rotation` | Person seated upright on the floor, hands behind head, torso rotating to one side with hips staying forward, seated spinal rotation stretch |
| `str_hip_flexor` | Person in a kneeling lunge position, one knee on the floor and the other foot forward, hips pressed gently forward to stretch the front of the rear hip, kneeling hip flexor stretch |
| `str_figure_four` | Person lying on their back on a mat, knees bent, one ankle crossed over the opposite knee forming a figure-4 shape, hands pulling the uncrossed leg gently toward the chest, figure-four glute stretch |
| `str_hamstring` | Person lying on their back on a mat, one leg flat and one leg raised toward the ceiling with a resistance band or towel looped around the raised foot, lying hamstring stretch |
| `str_it_band` | Person standing near a wall, one leg crossed behind the other, hips leaning away from the crossed leg to feel a stretch along the outer hip and thigh, IT band lateral hip stretch |
| `str_calf` | Person in a lunge stance facing a wall, hands on the wall, back leg straight with heel pressed to the floor, calf stretch against a wall |

---

## Commit schedule

Commit after all 12 icons are done:

```
feat: add stretch routine icons (12 stretches)
```

Then push.

---

## Do not touch

- `assets/demos/` — demo frames, do not modify
- `assets/icons/warmup/` — warmup/finisher icons, do not modify
- `assets/icons/` (root) — exercise icons, do not modify
- `assets/anatomy/` — do not modify
- `src/IronLog.jsx` — no code changes needed
- `index.html`, `version.json` — do not modify
