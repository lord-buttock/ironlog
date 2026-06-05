# IronLog — Changelog

Reverse-chronological log of all meaningful changes. One entry per change — date, author, one line. Link bug IDs from BUGS.md where relevant.

---

## 2026-06-05 — Apple Health Body Import

- Added Health → Body section for Apple Watch / Apple Health imports
- Added localStorage-backed imports for HRV, Resting HR, Steps, Active Calories, Cardio Fitness, and Sleep
- Added paste-JSON import modal per metric with validation, date dedupe, newest-value merge, imported count, and error feedback
- Added Body charts: HRV and Resting HR 30-day lines, Steps / Active Calories / Sleep 14-day bars, and sparse Cardio Fitness line chart
- Added HRV workout-day vs rest-day comparison for the last 30 days when enough HRV data exists

## 2026-06-05 — Health Tab (Training section)

- Added ❤️ Health tab (7th nav tab)
- Weekly volume: 6-week bar chart (kg × reps, completed kg sets, non-Iron sessions)
- Volume by workout type: Push / Pull / Legs+Core horizontal bars for current week
- Consistency: 28-day heatmap grid + streak / total sessions / per-week stats
- Recent PRs: kg exercises that hit their all-time max weight within the last 30 days
- Effort trend: line chart of average RPE per session, last 10 sessions, coloured green/amber/red by intensity
- Body section (Apple Watch / HRV / Sleep) deferred — to be added once Watch Shortcut is set up

## 2026-05-30 — Iron Series Integration

- Added Caroline Girvan's Iron Series (30 workouts, 6-week dumbbell programme) as a parallel programme
- Workout tab now has "My Split / 🔩 Iron Series" toggle — both programmes track independently
- 40 new exercises in `IRON_EXERCISES` constant; 30 workouts in `IRON_WORKOUTS` constant
- `nextIronDay(sessions)` derives next Iron day from session history; loops back to Day 1 after Day 30
- Iron sessions: energy check → exercises → complete (no warmup, no finisher; user follows video)
- `defaultDuration` is reference-only — no timer lockout; user follows video timing
- History: Iron sessions show `🔩 N` day badge and "Iron Series — Day N" title
- Exercises shared with A/B/C (RDL, hip thrust, etc.) contribute to the same Stats charts
- 40 MUSCLE_META entries added for all new Iron exercises
- Direct YouTube video IDs populated for all 30 Iron days; icons remain a separate Codex pass — see ICON-GUIDE.md

## 2026-05-28 — Per-Workout Warm-Up Defaults

- `WARMUP_GROUPS.defaultId` changed from a single string to `{ A, B, C }` so each workout gets targeted defaults
- Workout A (Push): Chest slot = chest-opener; Hips = figure-four; Ankles = circles
- Workout B (Pull): Chest slot = biceps-wall stretch (primes pull chain); Hips = hip-flexor; Ankles = circles
- Workout C (Legs): Chest slot = upward-dog (thoracic/hip-flexor); Lower Back = child's pose (lumbar decompression); Hips = 90/90-hip; Ankles = dorsiflexion
- Neck, shoulders, trunk, and legs (hamstring) unchanged across all workouts — sciatica/hamstring care retained
- `getWarmupConfig` and `saveWarmupChoice` updated to resolve per-workout defaults; existing saved choices unaffected

---

## 2026-05-26 — Session Set Editing

- History: expanded session cards now have an "✏ Edit" button (left) alongside "🗑 Delete" (right)
- Edit mode: inline input rows for weight, reps, RPE, pain, duration per set
- Add set (copies last set's values) and delete set per exercise
- Exercise notes editable as a text field
- Save writes to localStorage immediately; Cancel discards all changes
- Handles all exercise types: standard (kg), timed (secs), bodyweight, band, pullup-tracking (bw/band/neg)

---

## 2026-05-26 — Customisable Stretch Routine

- Added `STRETCH_GROUPS` constant: 12 body-part slots each with a default stretch and picker options
- Added `getStretchConfig()`, `saveStretchChoice()`, `resetStretchConfig()` helpers; storage key `il_stretch_config`
- Added `StretchSetup` component: 12 rows with Change button, duration estimate, Reset to defaults
- Added `StretchPicker` component: full-screen overlay with all options for a slot; Sciatica/Cross-legged/Caution pills
- Added `StretchActive` component: guided execution with SVG countdown ring, bilateral auto-advance (1.5s Switch Sides), three footer states, Skip all
- Dashboard: replaced static stretch accordion with simple card + "Start Stretching" button
- Removed old `ActiveStretch` component
- `view === 'stretch'` aliased to `'stretch_setup'` for backward compatibility

---

## 2026-05-25 — Warm-Up UX refinements + Stats picker grouping

- Warm-up execution: timer now requires a manual **▶ Start** tap before counting down — gives time to read the stretch and get into position
- Bilateral stretches (e.g. Neck Rotation): side 1 requires manual start; when it finishes a green ✓ Switch Sides indicator shows for 1.5s then side 2 auto-starts — no second tap needed
- Fixed warm-up active screen footer being hidden behind the fixed nav bar (missing `paddingBottom` to clear safe-area + nav height)
- Stats screen exercise picker now grouped by workout (Workout A — Push / Workout B — Pull / Workout C — Legs + Core / Other) with exercises sorted A–Z within each group, using native `<optgroup>` labels

## 2026-05-24 — Customisable Warm-Up

- Replaced static warm-up checklist with a three-screen flow: **Setup → Picker → Guided execution**
- Setup screen: 8 compact rows (one per muscle-tendon group — Neck, Shoulders, Chest, Trunk, Lower Back, Hips, Legs, Ankles), each with a Change button
- Picker: full-screen overlay per group showing curated stretch options with Sciatica / Cross-legged / Caution pills so you can pick based on your goal
- Guided execution: one stretch at a time, SVG countdown ring, cue text; see 2026-05-25 entry for final execution behaviour
- Per-workout config (A, B, C each store independent choices) persisted in `il_warmup_config` localStorage key
- Skip Warm-Up and Reset to defaults available from the setup screen; Skip all → and Skip this stretch available during execution
- Backward compatible: sessions stored with old `phase:'warmup'` resume at the setup screen

## 2026-05-24 — 8 new stretches + three-way filter (Sciatica / Cross-legged)

- **Sciatica additions** (from OAH clinical PDF + Healthline): Knee to Opposite Shoulder, Double Knee to Chest, Supine Sciatic Nerve Glide, Lower Trunk Rotations (Wig Wags ⚠️ disc caution). SCIATICA_IDS now covers 15 stretches.
- **Cross-legged sitting additions**: Butterfly Stretch (adductors — the key missing piece), Deep Squat Hold (⚠️ disc caution), Lateral Lunge Stretch, Pilates Saw (posture/thoracic). CROSS_LEGGED_IDS covers 14 stretches.
- Stretches tab filter upgraded from 2-way to 3-way: **All / ◈ Sciatica / ⊕ Cross-legged**. Purple pill = Sciatica, Green pill = Cross-legged. Both flags independent (a stretch can carry both).
- Total stretch library: 39 cards.

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
