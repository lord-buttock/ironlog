# IronLog — Changelog

Reverse-chronological log of all meaningful changes. One entry per change — date, author, one line. Link bug IDs from BUGS.md where relevant.

---

## 2026-05-24 — Sciatica Stretches + Filter

- Added 2 new sciatica-specific stretches: Sciatic Nerve Floss (neural mobilisation), Seated Piriformis Stretch. Both appear in the Stretches tab.
- 11 stretches now flagged `sciatica: true` via `STRETCH_SCIATICA_IDS` set — includes Figure Four, Pigeon, Child's Pose, Knee to Chest, both hamstring stretches, Prone Cobra, 90/90 Hip, Seated Forward Fold, and both new ones.
- Purple "Sciatica" pill shown on flagged cards. "All stretches / ◈ Sciatica only" toggle added to the Stretches tab header.

## 2026-05-24 — Stretch Library Expanded (13 new stretches)

- Added 13 new stretches to STRETCH_LIBRARY covering all 8 major muscle-tendon groups: neck (Neck Rotation), shoulders (Overhead Triceps Stretch), chest (Upward Facing Dog, Biceps Wall Stretch), trunk (Standing Side Bend), lower back (Knee to Chest, Lying Spine Twist ⚠️), hips (90/90 Hip Stretch, Pigeon Pose ⚠️), legs (Standing Quad Stretch, Seated Forward Fold), ankles (Ankle Circles, Wall Ankle Dorsiflexion). Caution banners added for Lying Spine Twist and Pigeon Pose. Redrawn icons for str_pec_roller_t, str_pec_roller_w, str_it_band committed. Library now shows 29 stretch cards total.

## 2026-05-23 — Stretch Library Tab

- Manage → Library now has Exercises / Stretches sub-tabs. Stretches tab shows 19 curated items (12 full-body flexibility, 5 warm-up mobility, 2 workout finishers) with expandable cards: stretch image, MuscleDiagram with target-area highlights, hold time, and cue text.

## 2026-05-20 — Exercise View Improvements

- Previous session notes reminder: if notes were written for an exercise in the last session, shown as a read-only 📝 banner above the set rows
- Muscle diagram collapsed by default: tap MUSCLES ▼ to expand, resets to collapsed on each exercise

## 2026-05-19 — AI Coach & Home Screen Redesign

- Added `computeCoachRecommendation(sessions, rides, override)` rules engine
- Reads last 7 days: pain ≥ 3, avg RPE ≥ 8, ride within 48h, days since last session ≥ 4
- New `'preStart'` view — review modifications and optionally swap exercises before session begins
- Safe swaps: rdl → hip_thrust, kb_deadlift → hip_thrust, p_bb_row → cs_db_row, chin_up → band_row, goblet_squat → reverse_lunge
- Coach modification notes rendered ephemerally via props in ActiveWorkout — not stored in sessions
- Dashboard unified card: coach note panel (🤖), flag pills, Why? expand, Safe Swaps link
- New 7-day week strip (Mon–Sun) below unified card
- `buildSession()` updated: accepts preStartSwaps, deduplicates exercise list, returns phase:'energy'
- `startSession()` updated: preserves pre-built session from pre-start screen

## 2026-05-16

- [Codex] Added and verified PNG exercise icons for ten missing/default workout exercise IDs.
- [Codex] Rewrote MuscleDiagram to inline annotated anatomical SVGs and colour muscles from primary/secondary arrays.
- [Codex] Revised the iOS/PWA app icon again to remove the blue monogram look and better match the brushed-metal reference.
- [Codex] Replaced the iOS/PWA app icon with a brushed-metal rounded-square IL design.

## 2026-05-15

- [Codex] Replaced the iOS/PWA app icon with a steel-blue IL monogram and moved icon source to assets/app-icon.png.
- [Codex] Replaced chin-up PNG icon with a reference-style wall-mounted pull-up bar illustration.
- [Codex] Added build-version cache busting to PNG exercise icon URLs so updated icons load on deployed devices.
- [Codex] Added transparent PNG exercise icons for Workouts A and B using the approved RDL-style art direction.
- [Codex] Regenerated Workout C PNG icons to match the approved RDL-style art direction.
- [Codex] Added transparent PNG exercise icons for the current Workout C lineup and updated ExerciseIcon to prefer PNG assets with SVG fallback.
- [Codex] Updated warmup with mobility/stretch work and revised Workout A/B/C exercise lineups.

## 2026-05-14

- [Codex] Added IMAGE-PROCESS.md documenting the tested exercise icon PNG cleanup workflow and failed conversion attempts.
- [Codex] Prototyped richer two-tone mini-illustration icons for the seven visible Workout C exercises.
- [Codex] Added exercise-specific SVG stick-figure icons for all 71 built-in exercises and rendered them on Dashboard workout rows and the active workout header.

## 2026-05-13

- [Codex] Applied Phase 2 visual redesign — restructured Dashboard hero/sync row, added Lucide icons, and attached primary/secondary muscle metadata to built-in exercises.
- [Codex] Applied Phase 1B visual redesign — switched from dark steel-blue to light blue theme and changed active/CTA text to white.
- [Codex] Applied Phase 1 visual redesign token pass — steel-blue dark palette, cooler status colours, softer primary button radius, reduced headline/loading letter spacing.
- [Claude] Fixed false PR detection — `filter(s => s.done)` in `detectPRs` for current and historical sets. See BUG-001. Commit: f0ba663
- [Codex] Moved JSON backup/restore controls from Dashboard into Manage → Backup tab. Commit: d145ebb
- [Codex] Fixed band/bodyweight set row layout. Commit: bf3c377
- [Claude] Added auto-update indicator — ↺ button next to IRONLOG header pulses amber when a newer deployed version is detected. Commit: 9f36697
- [Claude] Added "Check for updates" button to home screen. Commit: 2e66d1d
- [Claude] Implemented Supabase auto-sync — sessions and rides pushed after each save; count-based restore on load; sync blocked during active session. Commit: f0cfb30
- [Claude] Added 8 new exercises: bb_flat_bench, bb_incline_bench, chin_up, face_pull, reverse_fly, rdl, reverse_lunge, farmers_walk
- [Claude] Revised default workouts A/B/C — barbell bench as primary push compound, chin-up + face pull in pull, RDL + reverse lunge in legs
- [Claude] Removed contraindicated exercises from PRESET_LIBRARY — p_good_morning, p_russian_twist, p_nordic_curl. See BUG-006. Commit: 908a90d
- [Claude] Fixed p_pull_up cue — narrow grip only, band-assisted start specified. See BUG-007. Commit: 908a90d
- [Claude] Updated docs to reflect implementation session. Commit: 3f1e616
