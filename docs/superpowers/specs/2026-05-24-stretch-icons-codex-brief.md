# Stretch Icons — Codex Brief
*2026-05-24 — for implementation by Codex*

---

## What you are doing

Generating 108×108 px transparent PNG icon images for **23 new stretches** that have been added to `STRETCH_LIBRARY` in `src/IronLog.jsx`. The icons will appear in the Stretches tab of the Manage screen. They already gracefully hide on load error, so the app works fine without them — but they need to be generated to complete the library.

---

## MANDATORY PROCESS — reference image first, then generate

**Do not generate any icon without first finding a reference image.** This is the process for every single stretch, no exceptions:

### Step 1 — Find a reference image
Search the web for a real photograph or clear illustration of the stretch. Good search queries:
- `"[stretch name] exercise photo"`
- `"[stretch name] how to step by step"`
- `"[stretch name] yoga pose"`
- `"[stretch name] physiotherapy"`

You are looking for an image that clearly shows:
- The correct body position
- The correct limb angles
- Any props involved (chair, wall, band, towel)
- Which direction the stretch is directed

**Record the URL** of the best reference image you find. If you cannot find a reliable reference, state this explicitly and describe what you assumed — do not silently guess.

### Step 2 — Generate the icon based on the reference
Use what the reference image shows to determine the correct body position for the icon. The icon must reflect the actual movement shown in the reference — not a generic body shape.

### Step 3 — Record your reference for review
For every stretch, output a line in this format:
```
[str_id] — Reference: [URL] — Generated: assets/icons/stretches/[str_id].png
```

This is mandatory. Phill will compare your reference URL against your generated icon to verify accuracy. The pec roller and IT band errors in the previous batch happened because no reference was checked — this process exists to prevent that.

---

## Icon style specification

- **Format:** PNG, 108×108 px, transparent background
- **Style:** White line-art figure, 2–3 px stroke, minimal anatomical detail
- **Reference style file:** `assets/icons/stretches/str_childs_pose.png` — match this exactly
- **No text, no labels, no colour fill, no background**
- The figure should be centred with a small margin on all sides

---

## Review gallery

After generating all icons, create `stretch-icons-review-2.html` in the project root.

For each stretch, show a row containing:
1. The stretch name and ID as a heading
2. Left column: the reference image — either an `<img src="[URL]">` if the image is hotlinkable, or the URL printed as a link if not
3. Right column: the generated icon `<img src="assets/icons/stretches/[id].png" style="width:108px; height:108px; background:#222;">`

This gallery is the review artifact Phill uses to confirm each icon before it ships.

**Delete this HTML file after Phill confirms all icons are correct.**

---

## The 23 icons to generate

All files go in `assets/icons/stretches/`.

### Group 1 — General stretch library (from 2026-05-24 expansion)

| ID | Name | Key visual to show |
|---|---|---|
| `str_neck_rotation` | Neck Rotation | Seated figure, head turned clearly to one side |
| `str_overhead_triceps` | Overhead Triceps Stretch | Standing, one arm bent overhead, opposite hand pressing the elbow |
| `str_upward_dog` | Upward Facing Dog | Prone on floor, arms extended, chest and head lifted, hips down |
| `str_biceps_wall` | Biceps Wall Stretch | Standing side-on to wall, one arm extended back with palm flat on wall, body rotating away |
| `str_sideways_bend` | Standing Side Bend | Standing, one arm raised overhead, whole torso leaning to one side |
| `str_knee_to_chest` | Knee to Chest | Supine, one knee drawn to chest with both hands, other leg flat |
| `str_spine_twist` | Lying Spine Twist | Supine, both knees together tipped to one side, arms out to sides |
| `str_90_90_hip` | 90/90 Hip Stretch | Seated on floor, front shin across the body at 90°, rear shin out to the side at 90°, torso upright |
| `str_pigeon` | Pigeon Pose | Prone position, front shin diagonally across mat, back leg extended straight behind |
| `str_quad_standing` | Standing Quad Stretch | Standing, one hand holding ankle pulled up behind the body, knees together |
| `str_forward_fold` | Seated Forward Fold | Seated on floor, both legs extended, arms reaching forward along the shins |
| `str_ankle_circles` | Ankle Circles | Seated or lying, one foot lifted, toes tracing a circle |
| `str_ankle_dorsiflexion` | Wall Ankle Dorsiflexion | Standing facing a wall, one foot forward, knee pushed forward toward wall, heel flat |

### Group 2 — Sciatica-specific (from 2026-05-24 sciatica additions)

| ID | Name | Key visual to show |
|---|---|---|
| `str_nerve_floss` | Sciatic Nerve Floss | Seated on chair, one leg extended straight out, head tilted back (show the extended-leg phase) |
| `str_piriformis_seated` | Seated Piriformis Stretch | Seated on chair, one ankle crossed over the opposite knee (figure 4 seated), slight forward lean |
| `str_knee_opp_shoulder` | Knee to Opposite Shoulder | Supine, one bent knee being pulled diagonally across the body toward the opposite shoulder |
| `str_double_knee_chest` | Double Knee to Chest | Supine, both knees drawn up to chest together, hands behind thighs |
| `str_nerve_glide_supine` | Supine Sciatic Nerve Glide | Supine, one leg held behind the thigh, knee straightening upward, ankle dorsiflexed (foot pulled toward face) |
| `str_trunk_rotations` | Lower Trunk Rotations | Supine, knees bent, both knees tipping to one side — show mid-rotation with a directional arrow if style allows |

### Group 3 — Cross-legged sitting (from 2026-05-24 cross-legged additions)

| ID | Name | Key visual to show |
|---|---|---|
| `str_butterfly` | Butterfly Stretch | Seated on floor, soles of feet pressed together, knees falling out to the sides, upright torso |
| `str_deep_squat` | Deep Squat Hold | Deep squat, feet wide, heels down, hands clasped in front or holding a support, chest upright |
| `str_lateral_lunge` | Lateral Lunge Stretch | Wide stance, one knee bent and body weight shifted to that side, other leg straight — deep inner thigh stretch position |
| `str_pilates_saw` | Pilates Saw | Seated, legs extended wide, one arm reaching past the outside of the opposite foot (the reaching/sawing position), torso rotated |

---

## Do not touch

These files already exist and must not be overwritten or regenerated:
- All 15 original `str_*.png` files: `str_neck`, `str_cross_shoulder`, `str_pec_roller_t`, `str_pec_roller_w`, `str_upper_back_roller`, `str_cat_cow_cow`, `str_cat_cow_cat`, `str_childs_pose`, `str_spinal_rotation`, `str_hip_flexor`, `str_figure_four`, `str_hamstring`, `str_it_band`, `str_calf_straight`, `str_calf_bent`
- All `assets/icons/warmup/` files
- `src/IronLog.jsx` — all data and UI work is complete, do not edit
- `dist/index.html`, `index.html` — do not rebuild

---

## Commit

Add only the new PNG files (do not commit the review HTML):

```bash
git add \
  assets/icons/stretches/str_neck_rotation.png \
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
  assets/icons/stretches/str_piriformis_seated.png \
  assets/icons/stretches/str_knee_opp_shoulder.png \
  assets/icons/stretches/str_double_knee_chest.png \
  assets/icons/stretches/str_nerve_glide_supine.png \
  assets/icons/stretches/str_trunk_rotations.png \
  assets/icons/stretches/str_butterfly.png \
  assets/icons/stretches/str_deep_squat.png \
  assets/icons/stretches/str_lateral_lunge.png \
  assets/icons/stretches/str_pilates_saw.png

git commit -m "assets: add 23 new stretch icons (reference-image approach)"
git push origin main
```
