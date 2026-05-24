# Stretch Icons — Codex Brief
*2026-05-24 — for implementation by Codex*

---

## Task summary

Generate 108×108 px transparent PNG icon images for **15 new stretches** added to `STRETCH_LIBRARY`. The style must match the existing icons in `assets/icons/stretches/` and `assets/icons/warmup/` — white line-art figure on transparent background.

---

## Process — IMPORTANT: reference-image approach

For each stretch below, you must:

1. **Find a reference image** — search for a real photograph or diagram of the stretch (e.g. `"[stretch name] exercise photo"` or `"[stretch name] how to"` on the web). Save or record the URL of the best reference you find.
2. **Generate the icon** based on what the reference image shows — correct body position, limb angles, props if relevant (chair, wall, band).
3. **Output a review row** for each stretch: reference image URL next to the generated icon file, so Phill can compare them side-by-side.

This prevents the errors from the previous batch (foam roller orientation, IT band position). If you cannot find a reliable reference image, flag it and describe what you assumed.

---

## Output format

- Format: PNG, 108×108 px, transparent background
- Style: white line-art figure, 2–3 px stroke, minimal anatomical detail — match `assets/icons/stretches/str_childs_pose.png` as the reference style
- No text, no labels, no colour fill

---

## Files to create

All go in `assets/icons/stretches/` unless marked `warmup`.

### Group 1 — New stretches (from 2026-05-24 library expansion)

| ID | Name | Key visual |
|---|---|---|
| `str_neck_rotation` | Neck Rotation | Seated figure, head turned to one side |
| `str_overhead_triceps` | Overhead Triceps Stretch | Standing, one arm bent overhead, other hand pressing elbow |
| `str_upward_dog` | Upward Facing Dog | Prone, arms extended, chest lifted, hips on floor |
| `str_biceps_wall` | Biceps Wall Stretch | Standing facing wall, arm extended back with palm on wall, body rotated away |
| `str_sideways_bend` | Standing Side Bend | Standing, one arm raised overhead, body leaning to opposite side |
| `str_knee_to_chest` | Knee to Chest | Supine, one knee drawn toward chest, other leg flat |
| `str_spine_twist` | Lying Spine Twist | Supine, both knees together fallen to one side, arms out to sides |
| `str_90_90_hip` | 90/90 Hip Stretch | Seated on floor, front shin across body at 90°, back leg at 90° to side, leaning forward |
| `str_pigeon` | Pigeon Pose | Prone position — front shin diagonally across mat, back leg extended straight behind |
| `str_quad_standing` | Standing Quad Stretch | Standing, one hand holding ankle behind body, knees together |
| `str_forward_fold` | Seated Forward Fold | Seated, both legs extended, reaching forward along shins |
| `str_ankle_circles` | Ankle Circles | Seated or lying, one foot lifted, drawing circles in the air |
| `str_ankle_dorsiflexion` | Wall Ankle Dorsiflexion | Standing facing wall, one foot forward, knee pushed toward wall |

### Group 2 — Sciatica-specific stretches

| ID | Name | Key visual |
|---|---|---|
| `str_nerve_floss` | Sciatic Nerve Floss | Seated on chair, one leg extended straight, head tilted back — shows the extension phase |
| `str_piriformis_seated` | Seated Piriformis Stretch | Seated on chair, one ankle crossed over opposite knee (figure 4 seated), leaning forward slightly |

---

## Review gallery

After generating, create an HTML review file `stretch-icons-review-2.html` in the project root. For each stretch, show:
- Left column: the reference image URL as a link (or an `<img>` if the URL is hotlinkable) with the URL printed below it
- Right column: the generated icon (`<img src="assets/icons/stretches/[id].png">`)
- The stretch name as a heading between pairs

Delete this review file once Phill has confirmed all icons are correct.

---

## Do not touch

- `assets/icons/stretches/str_*.png` files that already existed before this session (the 12 original STRETCHES icons — `str_neck`, `str_cross_shoulder`, `str_pec_roller_t`, `str_pec_roller_w`, `str_upper_back_roller`, `str_cat_cow_cow`, `str_cat_cow_cat`, `str_childs_pose`, `str_spinal_rotation`, `str_hip_flexor`, `str_figure_four`, `str_hamstring`, `str_it_band`, `str_calf_straight`, `str_calf_bent`)
- `assets/icons/warmup/` — all existing warmup and finisher icons
- `src/IronLog.jsx` — all data and UI work is done; do not edit
- `dist/index.html`, `index.html` — do not rebuild; no source changes

---

## Commit

Commit only the new PNG files:
```bash
git add assets/icons/stretches/str_neck_rotation.png \
        assets/icons/stretches/str_overhead_triceps.png \
        assets/icons/stretches/str_upward_dog.png \
        assets/icons/stretches/str_biceps_wall.png \
        assets/icons/stretches/str_sideways_bend.png \
        assets/icons/stretches/str_knee_to_chest.png \
        assets/icons/stretches/str_spine_twist.png \
        assets/icons/stretches/str_90_90_hip.png \
        assets/icons/stretches/str_pigeon.png \
        assets/icons/stretches/str_quad_standing.png \
        assets/icons/stretches/str_forward_fold.png \
        assets/icons/stretches/str_ankle_circles.png \
        assets/icons/stretches/str_ankle_dorsiflexion.png \
        assets/icons/stretches/str_nerve_floss.png \
        assets/icons/stretches/str_piriformis_seated.png
git commit -m "assets: add 15 new stretch icons (reference-image approach)"
git push origin main
```
