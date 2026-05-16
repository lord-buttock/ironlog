# IronLog — Roadmap & Feedback

This document tracks planned features, known issues, and agent feedback. It is the first place any AI agent should check before starting new work — to avoid duplicating effort or building something already planned.

Read README.md first for full project context, user profile, medical constraints, and architecture.

---

## Current State (as of May 2026)

The app is functional and in active daily use. Core features are complete:
- 3-day Push/Pull/Legs split (A/B/C) with full session flow
- Per-set logging: weight, reps/duration, RPE, pain
- Pre-fill from last session
- Rest timer, session clock
- PR detection and progressive overload nudges
- Progress charts (custom SVG)
- Session history
- Ride log
- Exercise library with form cues and YouTube links
- Custom exercise creator and workout builder
- JSON export/import backup
- PWA — works on iPhone home screen

---

## Bug Fixes

See **BUGS.md** for the canonical tracker with stable IDs, details, and fix descriptions.

**Open (medium):** BUG-008 (finisher notes), BUG-009 (EXERCISES not browseable)
**Fixed:** BUG-001 ✅, BUG-002 ✅, BUG-003 ✅, BUG-004 ✅, BUG-005 ✅, BUG-006 ✅, BUG-007 ✅
**Open (low):** BUG-010 (equipment-incompatible exercises in picker)
**Fixed:** BUG-001 (false PR detection ✅), BUG-006 (contraindicated exercises ✅), BUG-007 (p_pull_up cue ✅)

Additional non-bug technical items:
- Replace all 66 YouTube search URLs with curated specific video IDs (`IronLog.jsx` lines 26, 29–44, 1237–1293) — Medium
- Add `manifest.json` + service worker — app requires internet on every load — Medium
- Rest timer: switch to wall-clock timestamps — iOS throttles `setInterval` when PWA is backgrounded (`IronLog.jsx` lines 512, 517–521) — Medium

---

## Priority 1 — Exercise Library Expansion

**Status:** Planned — not yet started  
**Context:** The current exercise library is too small and skewed toward dumbbell-only movements. The user has a full barbell setup (flat bench, incline/decline bench, barbell + plates) that is almost entirely unused by the current exercise list. A proper PPL split should have 40–60 exercises available to rotate through.

### Exercises to Add

The following have been researched and assessed against the user's medical constraints and available equipment. See README.md for the constraint definitions and the 🟢/🟡/🔴 key.

#### PUSH — Chest · Shoulders · Triceps

| Exercise | Status | Notes for Implementation |
|---|---|---|
| Barbell Flat Bench Press | 🟢 | Primary push compound. Should be first exercise in Workout A. |
| Barbell Incline Bench Press | 🟡 | Keep incline low (30°). Add cue: "Low incline only — steep incline approaches overhead press angle and may stress shoulders." |
| Barbell Decline Bench Press | 🟢 | Easier on shoulders than flat. Good chest variation. |
| DB Incline Press | 🟡 | Same incline warning as barbell version. |
| DB Chest Fly | 🟡 | Light weight. Cue: "Stop before arms go fully wide — limit range to protect shoulders." |
| Incline DB Fly | 🟡 | Low incline only. Same shoulder caution. |
| Close-Grip Bench Press | 🟢 | Excellent tricep compound. Barbell or DB. Elbows tucked. |
| Skull Crushers | 🟢 | Lying on bench. Barbell or DB. Lower to forehead, extend up. |
| DB Tricep Kickback | 🟢 | Isolation. Hinge forward, upper arm parallel to floor. |
| Bench Dips | 🟡 | Hands on flat bench, feet on floor. Cue: "Stop if you feel shoulder impingement." |
| Arnold Press (seated DB) | 🟡 | Rotation may aggravate bursitis. Start light, monitor. |

#### PULL — Back · Biceps · Rear Delts · Hinge

| Exercise | Status | Notes for Implementation |
|---|---|---|
| Barbell Bent-Over Row | 🟡 | Slipped disc risk. Cue: "Strict neutral spine only. No rounding. Start very light." |
| Face Pull (band) | 🟢 | High priority — essential for shoulder health and rear delts. Band anchored at face height. |
| Reverse Fly (DB) | 🟢 | Rear delts. Hinged forward or chest-supported on incline bench. Light weight. |
| Romanian Deadlift (RDL) | 🟡 | Slipped disc + tight hamstrings. Cue: "Neutral spine. Conservative range — stop well before hamstring pull. Start from raised height." |
| Conventional Deadlift | 🟡 | Progress toward this from raised KB deadlift over time. Same back constraint as RDL. |
| Barbell Curl | 🟢 | Standing, strict form. |
| Incline DB Curl | 🟢 | On incline bench. Excellent bicep isolation, good stretch. |
| Chin-Up | 🟡 | Doorframe chin-up bar available. Start band-assisted or negatives-only. Shoulder-width grip. Cue: "Underhand grip. Shoulder-width or narrower only — wide grip may aggravate bursitis." |
| Pull-Up | 🟡 | Same bar. Overhand grip, harder than chin-up. Narrow to shoulder-width only. |
| Band Seated Row | 🟢 | Band anchored low, seated on floor or bench. Substitute for cable row. |

#### LEGS — Quads · Hamstrings · Glutes · Core

| Exercise | Status | Notes for Implementation |
|---|---|---|
| DB Squat (held at sides) | 🟢 | Heavier squat option as goblet becomes limiting with load. |
| Bulgarian Split Squat | 🟢 | Already in app. Harder variation of split squat — rear foot elevated on bench. |
| Reverse Lunge | 🟢 | Safer for back than forward lunge. DB or bodyweight. |
| Walking Lunge | 🟡 | Light or bodyweight only. Cue: "Keep torso upright. No loaded trunk rotation." |
| Romanian Deadlift | 🟡 | See Pull day entry above — same exercise, same constraints. |
| Barbell Hip Thrust | 🟢 | Progression from DB/bodyweight hip thrust. Barbell across hips on bench. |
| Farmer's Walk | 🟢 | KB or DB, 5m carry. Core stability, no spinal flexion. |
| Suitcase Carry | 🟢 | Already in app. One-sided carry — anti-lateral-flexion core work. |

#### NOT to Add (Ruled Out)

| Exercise | Reason |
|---|---|
| Barbell Back Squat | Cannot back-rack barbell — shoulder flexibility |
| Barbell Front Squat | Front rack requires wrist/shoulder flexibility unavailable |
| Barbell Overhead Press | Shoulder bursitis — no overhead barbell |
| Pendlay Row | Too explosive, too much spinal load at current stage |
| KB Swing | Explosive hip hinge — spinal risk at current stage |
| Leg Press | No machine |
| Leg Extension | No machine |
| Wide-Grip Pull-Up | Shoulder bursitis — wide grip contraindicated |

---

## Priority 2 — Revised Default Workouts (A/B/C)

**Status:** ✅ Done — 2026-05-13

**Workout A — Push**
Barbell Flat Bench Press → DB Shoulder Press → Lateral Raise → Close-Grip Bench Press → Skull Crushers → Tricep Pushdown (band)

**Workout B — Pull**
KB Deadlift (Raised) → Chin-Up → Chest-Supported DB Row → Face Pull → DB Bicep Curl → Hammer Curl

**Workout C — Legs + Core**
Goblet Squat → Romanian Deadlift → Hip Thrust → Reverse Lunge → Swiss Ball Ham Curl → Pallof Press → Farmer's Walk

---

## Priority 3 — Muscle Group Anatomy Diagrams (SVG replacement)

**Status:** Phase 1 complete — Phase 2 (component rewrite) ready for Codex  
**Spec:** `MUSCLE-DIAGRAM-SPEC.md` (v1.1) — authoritative reference for all muscle diagram work  
**Implementation instructions:** `CODEX_ANATOMY_SVG_INSTRUCTIONS.md`

### What was planned vs what was built

The original plan (PNG generation) was superseded. The approach changed to a data-driven SVG system after flat-colour muscle atlas SVGs were generated in ChatGPT.

### Current architecture

```
Exercise ID
  → MUSCLE_META { primary: [...], secondary: [...] }
    → MuscleDiagram component
      → Inline SVG (front + rear body) with named muscle paths
        → Each path coloured by data-muscle attribute match:
            primary match  → #5B8DEF (blue)
            secondary match → #B8A7FF (purple)
            no match        → #D2D1D1 (neutral grey)
```

### Phase 1 — Data migration ✅ Complete (2026-05-16, commit b6c4047)

- `MUSCLE_META` replaced with full anatomical database (~65 exercises)
- All assignments cross-referenced against ExRx.net — 8 corrections made
- `applyMuscleMeta()` now stamps `primary[]` and `secondary[]` arrays onto each exercise
- `primaryMuscle` / `secondaryMuscle` string fields preserved temporarily for current UI

### Phase 2 — Component rewrite ✅ Complete (2026-05-16, commit 325c10e)

- `build.js` inlines both SVGs as JS string constants
- `MuscleDiagram` rewritten to use annotated SVGs, `primary[]`/`secondary[]` arrays, and `DISPLAY_TO_SVG_IDS` translation map
- Both call sites updated (active workout + manage exercise detail)
- All 10 QA gates passed before commit

---

## Priority 4 — Exercise Demo Animations

**Status:** Planned — after all exercise icons are complete  
**Depends on:** All 79 exercise icons generated and committed

### Concept

Replace YouTube demo links with a built-in flip-book animation. Each exercise gets 2–3 still frames showing key positions. The demo viewer cycles through them automatically, simulating motion without video.

### Animation pattern

```
2-frame exercises:  start → end → start → end …
3-frame exercises:  start → mid → end → mid → start … (ping-pong)
```

Interval: 0.4–0.5s per frame (tune after visual testing — 0.25s may feel too fast for slower movements like deadlifts).

### Frame counts by exercise type

| Use 2 frames | Use 3 frames |
|---|---|
| Curls, raises, pushdowns, rows, flies | Squat, deadlift, hip thrust, lunge, split squat |
| Any single-joint isolation movement | Any multi-joint compound with a meaningful mid-position |

### Asset spec

- Folder: `assets/demos/`
- Naming: `{exercise_id}_1.png`, `{exercise_id}_2.png`, `{exercise_id}_3.png`
- Size: 300×300px (larger than the 108×108 icon — these are shown in a modal/expanded view)
- Format: transparent PNG, same blue illustration style as icons
- Generation: same prompt template and Pillow cleanup pipeline as icons

The 108×108 icon in `assets/icons/` is unchanged — it stays as a single peak-position image for exercise cards and library tiles.

### Implementation

- New `ExerciseDemo` component replaces the current YouTube link button
- Accepts a `frames` array of image paths and an optional `interval` prop
- Uses `useEffect` + `setInterval` to cycle frames
- Falls back gracefully if only 1 frame exists (static image, no animation)
- Codex task: ~20 lines of React once frames exist

### Dependency check before starting

```bash
ls assets/demos/ 2>/dev/null | wc -l   # should be 0 until this feature begins
ls assets/icons/ | wc -l               # should be 79 (all icons complete)
```

---

## Priority 5 — Caution Flags on Modified Exercises

**Status:** Planned

🟡 exercises should show a caution banner or note during a session — similar to how pain ≥ 3 currently shows a warning. For example, when the user logs a set of Barbell Bent-Over Row, a yellow note should appear: *"Neutral spine only. Stop if lower back tightens."*

Implementation suggestion: add an optional `caution` string field to the exercise data shape. If present, render it in the `SetRow` component in amber.

---

## Priority 6 — Pull-Up Bar Onboarding

**Status:** Planned

The user has a doorframe chin-up bar. The app should support:
- Band-assisted chin-ups (log as assisted with a band colour/tension note)
- Negative-only reps (timed descent, e.g. "5 sec negatives × 5")
- Progress tracking toward first unassisted rep

---

## Priority 7 — Workout Rotation Logic

**Status:** Under consideration

Currently the user manually selects which workout to do. The app suggests the next workout (A→B→C→A) on the dashboard but doesn't enforce it. A smarter rotation could:
- Auto-suggest based on last session + rest days elapsed
- Flag if the same workout is being repeated too soon
- Track A/B/C balance over time in the Progress screen

---

## Known Issues / Technical Debt

| Issue | Detail |
|---|---|
| `PRESET_LIBRARY` vs `EXERCISES` split | The distinction between these two objects is unclear. Consider merging into one `EXERCISE_LIBRARY` with an `inDefaultWorkout` flag. |
| No `repMax` on timed exercises | `isTimed` exercises have `repMax: null` which is fine, but the overload nudge logic should explicitly handle this case. |
| `EXERCISES` not browseable in Library | Base workout exercises cannot be browsed from the Manage → Library tab — only `PRESET_LIBRARY` items appear. Form cues and demos are inaccessible outside an active workout. |
| No offline support | No service worker or web app manifest. All CDN assets (React, fonts) require internet on every load. App cannot function offline even when installed as PWA. |
| Silent localStorage failure | `save()` swallows all errors silently including `QuotaExceededError`. User has no feedback if iOS storage is full and data is not saving. |

---

## Completed Features (Reference)

- [x] Session flow: energy → warmup → exercises → finisher → done
- [x] Per-set: weight, reps/duration, RPE, pain
- [x] Pain ≥ 3 warning banner
- [x] Pre-fill from last session
- [x] Rest timer (30/60/120s shortcuts, auto-starts at 30s)
- [x] Session clock
- [x] PR detection (top weight, kg exercises only)
- [x] Progressive overload nudge
- [x] SVG progress charts (weight, volume, RPE)
- [x] Session history (expandable)
- [x] Ride log with programme phases
- [x] Exercise library with form cues + YouTube links
- [x] Custom exercise creator
- [x] Workout builder (add/remove exercises from A/B/C)
- [x] Mid-session exercise addition
- [x] JSON export/import
- [x] PWA / iPhone home screen
- [x] Inline Google Fonts
- [x] Build script (JSX → single HTML)
- [x] GitHub Pages deployment
- [x] Expanded exercise library — 8 new exercises added (barbell flat bench, incline bench, chin-up, face pull, reverse fly, RDL, reverse lunge, farmer's walk) — 2026-05-13
- [x] Revised default workouts A/B/C — barbell bench as primary push compound, chin-up + face pull in pull, RDL + reverse lunge in legs — 2026-05-13
- [x] Removed contraindicated exercises from PRESET_LIBRARY — p_good_morning, p_russian_twist, p_nordic_curl — 2026-05-13
- [x] Fixed p_pull_up cue — narrow grip only, band-assisted start, no wide grip warning — 2026-05-13
- [x] Supabase auto-sync — sessions and rides pushed to cloud after each save; restore on app load if cloud has more records — 2026-05-13
- [x] Auto-update indicator — ↺ button next to IRONLOG header pulses amber when a newer version is deployed — 2026-05-13
- [x] Moved JSON backup/restore into Manage → Backup; dashboard now keeps only cloud sync status — 2026-05-13

---

## Agent Notes & Feedback Log

*Append notes here after any significant agent session — what was changed, what was decided, what was left for next time.*

### 2026-05-16 — Codex (Task 4 — MuscleDiagram component rewrite)

- Identified display-name vs anatomical-ID mismatch between Task 3 output and SVG attributes
- Resolved via `DISPLAY_TO_SVG_IDS` translation map inside MuscleDiagram (Option 2)
- Rewrote MuscleDiagram: build.js inlines SVGs, useEffect colours paths by data-muscle attribute
- Updated both call sites to pass primary[] / secondary[] arrays
- All 10 QA gates passed — commit 325c10e

### 2026-05-16 — Claude Sonnet 4.6 + Codex (anatomy SVG pipeline)

**Claude (this session):**
- Analysed original `body_front_back_template_high_res.svg` — found it contained only stroke line art, unsuitable for fill-based highlighting
- Pivoted to flat-colour atlas approach: user generated front and rear body SVGs in ChatGPT with one distinct colour per muscle group
- Verified both SVGs: 14 unique colours in front (9 muscle groups), 16 in rear (10 muscle groups), all matching expected palette within tolerance
- Wrote `assets/anatomy/assign_muscle_ids.py` — reads source SVGs, matches colours by proximity, assigns `id`/`data-muscle`/`data-side` to every muscle path, sorts bilateral pairs by centroid x for correct left/right labelling
- Ran script: produced `assets/anatomy/front-muscle-map.svg` (28 annotated paths) and `rear-muscle-map.svg` (22 annotated paths)
- Rewrote `CODEX_ANATOMY_SVG_INSTRUCTIONS.md` — fixed TypeScript assumptions, added preprocessing step, corrected colour matching note, simplified exercise data to base muscle names
- Cross-referenced all 50 MUSCLE_META entries against ExRx.net — corrected 8 assignments (Farmer's Walk, Bird Dog, Hammer Curl ×2, Shoulder Press ×2, Arnold Press, Preacher Curl)
- Updated `MUSCLE-DIAGRAM-SPEC.md` to v1.1 with ExRx corrections and full audit table
- Pushed all assets and docs to GitHub

**Codex (Task 3):**
- Replaced `MUSCLE_META` with full anatomical database from spec
- Updated `applyMuscleMeta()` to stamp `primary[]` and `secondary[]` arrays
- Verified no retired category names in MUSCLE_META, all exercise IDs covered
- Committed: b6c4047

**Next:** Codex Task 4 — component rewrite. See `CODEX_ANATOMY_SVG_INSTRUCTIONS.md`.

### 2026-05-13 — GPT-5 Codex implementation note
- Moved JSON export/import controls out of the dashboard and into a new **Manage → Backup** sub-tab, alongside Supabase sync status, "Sync now", and "Check for updates".
- Simplified the dashboard data card to show only Supabase auto-sync status and a manual sync action, keeping the home screen focused on the next workout.
- Updated README and DECISIONS to reflect the new backup/restore location.
- Documentation rule confirmed: after each program change, update this Agent Notes log; update README for current user-facing behaviour/architecture changes; update DECISIONS when a decision changes status or implementation approach.

### 2026-05-12 — GPT-5 Codex code review
- Resume state is incomplete. If `il_active` exists, `ActiveWorkout` always reopens at workout phase and exercise index 0 (`src/IronLog.jsx:499-500`), while elapsed time restarts from zero (`src/IronLog.jsx:503`, `src/IronLog.jsx:512-514`). A reload during warm-up, finisher, or later exercises loses the user's position and under-reports final duration (`src/IronLog.jsx:579`).
- Progressive overload nudges are too eager for a conservative return-to-training app. Several defaults have `defaultReps === repMax` (for example goblet squat, DB bench, KB deadlift, split squat at `src/IronLog.jsx:29-34`, `src/IronLog.jsx:39`), so simply completing the prescribed first-session reps can trigger "add load" (`src/IronLog.jsx:148-154`, `src/IronLog.jsx:708-714`). The logic also ignores high pain and high RPE, so painful or maximal-effort sets can still be marked ready to progress.
- PR detection is weight-only for `kg` exercises (`src/IronLog.jsx:131-145`). A heavier but much lower-rep set is treated as a PR, and bodyweight/band/timed progress is excluded entirely. That may be acceptable as "top weight PR", but the UI label says "Personal Records" without that nuance (`src/IronLog.jsx:840-845`).
- Rest timer behaviour is inconsistent with the roadmap. The completed-features note said 60/90/120s, but the app offers 30/60/120s shortcuts and auto-starts 30s after every set (`src/IronLog.jsx:523-550`, `src/IronLog.jsx:700-705`). The timer is interval/timeout based and not wall-clock based, so iOS backgrounding can pause or skew rest and elapsed time.
- Import/localStorage handling lacks shape validation. `load()` catches malformed JSON but accepts any parsed truthy value (`src/IronLog.jsx:68-74`); startup then assumes `sessions` is an array and passes it to `nextWorkout()` (`src/IronLog.jsx:84-89`, `src/IronLog.jsx:1627-1639`). `importData()` parses JSON only, without validating arrays or expected object shapes (`src/IronLog.jsx:205-214`, `src/IronLog.jsx:1654-1664`).
- Empty or corrupted active sessions can blank the Train screen. If an active session has no valid `exercises`, workout phase returns `null` with no recovery path (`src/IronLog.jsx:634-639`).
- `EXERCISES` vs `PRESET_LIBRARY` is already leaking into UX and data maintenance. Built-in default workout exercises live in both places (`WORKOUTS` references `p_` preset IDs at `src/IronLog.jsx:50-60`), but Manage's library intentionally lists only `PRESET_LIBRARY` and custom exercises (`src/IronLog.jsx:1313-1317`), so base `EXERCISES` items are not browsable from the Library tab even though they are part of the merged runtime library (`src/IronLog.jsx:1621`).
- Several preset exercises conflict with the documented equipment or constraints and should be hidden, flagged, or removed before library expansion: machine/cable-only entries (`p_cable_fly`, `p_lat_pulldown`, `p_seated_cable_row`, `p_leg_press`, `p_leg_extension`, `p_seated_leg_curl`, `p_cable_kickback`, `p_hip_abduction`, `p_cable_crunch` at `src/IronLog.jsx:1262-1293`), higher-risk hinge/core entries for slipped disc constraints (`p_good_morning`, `p_russian_twist`, `p_cable_crunch` at `src/IronLog.jsx:1269`, `src/IronLog.jsx:1292-1293`), and shoulder-sensitive entries lacking cautions (`p_chest_dip`, `p_arnold_press`, `p_db_fly`, `p_incline_db_press`, `p_pull_up` at `src/IronLog.jsx:1253-1264`).
- Pull-up guidance is under-specified for shoulder bursitis. `p_pull_up` says full hang to chin over bar but does not mention shoulder-width/narrow grip, band assistance, or negatives-only progression (`src/IronLog.jsx:1264`), even though the roadmap calls this out as a planned onboarding need.
- All 66 built-in exercise demos are YouTube search URLs generated by `YT()` (`src/IronLog.jsx:26`, `src/IronLog.jsx:29-44`, `src/IronLog.jsx:1237-1293`); none are curated watch URLs or specific video IDs. This supports Decision 1's Option A as a low-risk data cleanup before any embed/API work.
- iOS/PWA risk: `build.js` has iPhone home-screen meta tags and icons (`build.js:51-59`) but no web app manifest or service worker, and runtime React/ReactDOM/fonts load from CDNs (`build.js:60-62`). Once cached, the current page may remain usable from browser cache, but it is not a robust offline PWA install.

### 2026-05-12 — Claude Sonnet 4.6 code review
- Confirmed all GPT-5 Codex findings independently. Added the following:
- **PR detection false positive:** `detectPRs` includes sets where `s.done === false` (line 134). Pre-filled weights from the previous session that were never lifted can register as PRs. Fix: `ex.sets.filter(s => s.done)` before mapping weights.
- **Resume position:** `exIdx` (line 500) always initialises to 0, regardless of where in the session the user was. Warm-up and finisher phases also cannot be resumed — phase hardcodes to `'workout'` when `activeSession` exists (line 499). Three things need persisting: phase, exIdx, and startTime.
- **Overload nudge too eager — medical concern:** Several exercises have `defaultReps === repMax` (goblet squat, db bench, kb deadlift, split squat — lines 29–39). The nudge fires on the first session at prescribed reps. For a user returning after 5 years at RPE 6–7, this is premature and potentially harmful. Fix: require `repMax > defaultReps`, no sets with `pain >= 3`, and average RPE ≤ 8.
- **Blank Train screen has no recovery path:** Line 638 returns `null` if `exData` is falsy. If `il_active` contains a malformed session (missing or empty `exercises` array), the Train screen goes blank with no error state and no way out except clearing browser storage. Needs a fallback UI with a "Clear session" button.
- **Medical constraint violations in PRESET_LIBRARY:** `p_good_morning` (line 1269, loaded spinal flexion) and `p_russian_twist` (line 1292, loaded spinal rotation) are both 🔴 contraindicated per README. `p_nordic_curl` (line 1277) is 🔴 for tight hamstrings. All three appear in the mid-session Add Exercise picker. Remove or hide from this user's library.
- **`p_pull_up` cue is medically unsafe as written:** Line 1264 cue says "full hang to chin over bar" — does not specify grip width. Wide-grip pull-ups are contraindicated for bilateral shoulder bursitis. Cue must say: shoulder-width or narrower grip only, start band-assisted or negatives, no wide grip.
- **Import clears nothing on success:** `handleImport` (lines 1658–1663) does not call `setActiveSession(null)`. Importing while mid-workout leaves a stale active session in state against the new data.
- **iOS timer throttling:** Both `setInterval` (elapsed, line 512) and recursive `setTimeout` (rest timer, lines 517–521) are throttled by iOS when the PWA is backgrounded. Switch to wall-clock timestamps: store `startTime = Date.now()` and compute `elapsed = Date.now() - startTime` on each render.
- **No offline support:** No service worker or `manifest.json`. React, ReactDOM, and Google Fonts all load from CDN at startup. Internet required on every load — app cannot start offline even when installed as a home screen PWA.
- **Supabase sync (Decision 2) gotcha not in DECISIONS.md:** The current plan says "restore if localStorage is empty." iOS can purge PWA localStorage without warning — after a purge, localStorage is empty but this is not the same as a new device. Restore condition should compare counts (`localSessions.length < supabaseSessions.length`), not check for empty. Also: sync must be blocked while `activeSession !== null` to prevent mid-workout data loss.
- **Equipment conflicts in PRESET_LIBRARY:** `p_cable_fly`, `p_lat_pulldown`, `p_seated_cable_row`, `p_leg_press`, `p_leg_extension`, `p_seated_leg_curl`, `p_cable_kickback`, `p_hip_abduction`, `p_cable_crunch`, `p_chest_dip`, `p_t_bar_row` all require equipment the user does not own. They appear in the mid-session picker.


#### Peer review of Claude Sonnet 4.6 — Code review
*Another AI agent: please add your peer review of Claude's code review entry above here. Do you agree with the bug priority order? Are any of the line number references wrong? Are there bugs or safety issues Claude missed? Are any fixes described incorrectly? Add your entry below with a date and model tag.*

#### 2026-05-12 — GPT-5 Codex

Mostly agree with Claude's code review and the priority order. The requested line checks are accurate against current `src/IronLog.jsx`: PR detection starts at `detectPRs` line 131, with the problematic unfiltered `ex.sets.map(...)` on line 136 rather than line 134; `exIdx` is line 500; malformed active sessions blank at line 638; `p_good_morning` is line 1269; `p_russian_twist` is line 1292.

The proposed PR fix is structurally correct: `s.done` exists on set objects created by `buildSession()` (`src/IronLog.jsx:108-115`), `addSet()` (`src/IronLog.jsx:557`), and mid-session exercise insertion (`src/IronLog.jsx:773-775`). One gotcha: previous saved sessions should also be filtered to completed sets when calculating `prevMax`, otherwise older partial or imported sessions can still pollute the baseline.

The overload nudge fix needs one precision tweak. Requiring `repMax > defaultReps` prevents the first-session nudge for exercises where the prescribed reps already equal the top of range, but the set-level comparison should remain `Number(s.reps) >= def.repMax`; changing that to `>` would incorrectly require reps above the top of the range. Also calculate average RPE only from numeric RPE values, because RPE can be left blank.

Claude correctly flags the major medical issues. `p_russian_twist` is the clearest avoid because it directly conflicts with "no loaded spinal rotation"; `p_good_morning` is better described as a loaded hinge with high back-risk rather than "loaded spinal flexion," but avoiding it is still appropriate for this user. `p_nordic_curl` is reasonably high risk with tight hamstrings. Additional entries worth flagging before expansion: `p_cable_crunch` for loaded spinal flexion, `p_ab_wheel` as a high-bracing/high-shoulder-demand core movement, `p_hanging_knee_raise` for hanging shoulder load plus possible lumbar flexion, and both dip variants (`p_chest_dip`, `p_tricep_dips`) as shoulder-sensitive rather than broadly safe.

One missed bug: finisher notes update only local `session` state and never call `setActiveSession` (`src/IronLog.jsx:820-825`). If the app reloads during the finisher after notes are typed but before completion, those notes are lost even though set updates and exercise notes are persisted immediately.

### 2026-05-15 — UX polish + muscle groups + chart fix (Claude Sonnet 4.6)

**6 UX fixes committed (09ce945):**
- Fix 1: iOS safe area — `viewport-fit=cover`; nav `paddingBottom: env(safe-area-inset-bottom, 0px)`; screen `paddingBottom: calc(80px + env(safe-area-inset-bottom, 0px))`
- Fix 2: Nav label "Train" → "Workout"; energy phase gets "← Back to Home" button
- Fix 3: Dashboard Warm-Up and Cool-Down/Finisher sections collapse into accordions (`showWarmup`/`showCooldown` state)
- Fix 4: Cancel-session confirmation modal (`confirmCancel` state + `cancelSession()`) in workout and warmup phases
- Fix 5: `Icon` useEffect in try/catch; duration pill gets ⏱ prefix; "in progress" pill for incomplete sessions
- Fix 6: `ExerciseIcon` added to each library card in Manage
- Fix 7: Per-workout hide/restore exercises (`workoutHidden` state, persisted to `il_workout_hidden`; Manage shows ✕ Remove / ↩ Restore)

**Muscle group feature:**
- Added `MUSCLE_META` mapping exercise IDs to `[primaryMuscle, secondaryMuscle]`; `applyMuscleMeta()` runs at startup
- Added `MuscleDiagram` inline SVG component (front + back body, colour-coded by muscle group)
- Library cards are tappable to expand; expanded view shows MuscleDiagram + muscle pills + cue
- Active workout screen shows MuscleDiagram below the cue card
- SVG quality is visually poor — flagged for replacement with Codex-generated PNG anatomy images (see Priority 3)

**Chart y-axis fix (0190531):**
- Previous: ticks at 5.1, 4.8, 4.5, 4.2, 3.9 — illogical weight values
- Fixed with "nice numbers" algorithm using step candidates [0.5, 1, 2, 2.5, 5, 10, 20, 25, 50, 100, 250, 500]
- Ticks now snap to meaningful increments (e.g. 4.0, 4.5, 5.0 for a 4–5 kg range)
- RPE fixed-domain [5,10] charts unchanged

**Remaining priorities:**
- Complete Workout A + B exercise icons (status unknown — Codex tasked in prior session)
- Quality-gate Workout C icons against approved RDL style anchor; regenerate failures
- Generate remaining PRESET_LIBRARY icons
- Replace SVG MuscleDiagram with PNG anatomy images (after all exercise icons done)
- High-priority bugs: BUG-002, BUG-003, BUG-004, BUG-005, BUG-008, BUG-009

### 2026-05-13 — Implementation session (Claude Sonnet 4.6)
- Added 8 new exercises to `EXERCISES`: bb_flat_bench, bb_incline_bench, chin_up, face_pull, reverse_fly, rdl, reverse_lunge, farmers_walk
- Revised all three default workouts (Priority 1 + 2 complete)
- Removed p_good_morning, p_russian_twist, p_nordic_curl from PRESET_LIBRARY (Bug fixes #6, #7)
- Fixed p_pull_up cue: narrow grip only, band-assisted start (Bug fix #8)
- Implemented Supabase sync: auto-push after workout/ride, count-based restore on load, "Sync now" button, sync blocked during active session (Decision 2 resolved)
- Added auto-update indicator: build timestamp in version.json + bundle, ↺ button pulses amber when update is available
- Created Supabase tables: ironlog_sessions, ironlog_rides with RLS (anon role, hardcoded user_id)
- Remaining high-priority bugs: #1 (PR detection), #2 (overload nudge), #3 (import validation), #4 (resume state), #5 (blank Train screen recovery)

### 2026-05-12 — Exercise library planning session
- Audited full equipment list: barbell + stand, flat bench, incline/decline bench, DBs, KBs, bands, fit ball, medicine ball, stepper, small trampoline, doorframe chin-up bar
- Researched 3-day PPL splits for men 50+
- Mapped all candidate exercises against medical constraints and equipment
- Produced full priority-ranked exercise list above (Priority 1)
- Key finding: barbell flat bench, incline bench, close-grip bench, skull crushers, face pulls, chin-ups, RDL are the most important additions
- Exercises ruled out: barbell back squat, barbell front squat, barbell overhead press, Pendlay row, KB swing, leg press, leg extension, wide-grip pull-up
- Next step: implement Priority 1 (exercise library expansion) in `src/IronLog.jsx`
