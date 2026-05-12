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

**Status:** Planned — depends on Priority 1 being done first

Once the exercise library is expanded, the default workout selections need updating. The current defaults lean too heavily on dumbbell variations when barbell options are now available and appropriate.

Suggested revised defaults:

**Workout A — Push**
Barbell Flat Bench Press → DB Shoulder Press → Lateral Raise → Incline DB Press → Close-Grip Bench Press → Skull Crushers

**Workout B — Pull**
KB Deadlift (Raised) → Chin-Up → One-Arm DB Row → Chest-Supported DB Row → Face Pull → Barbell Curl → Hammer Curl

**Workout C — Legs + Core**
Goblet Squat → Bulgarian Split Squat → Barbell Hip Thrust → Romanian Deadlift → Swiss Ball Ham Curl → Pallof Press → Calf Raises → Single-Leg Balance

---

## Priority 3 — Caution Flags on Modified Exercises

**Status:** Planned

🟡 exercises should show a caution banner or note during a session — similar to how pain ≥ 3 currently shows a warning. For example, when the user logs a set of Barbell Bent-Over Row, a yellow note should appear: *"Neutral spine only. Stop if lower back tightens."*

Implementation suggestion: add an optional `caution` string field to the exercise data shape. If present, render it in the `SetRow` component in amber.

---

## Priority 4 — Pull-Up Bar Onboarding

**Status:** Planned

The user has a doorframe chin-up bar. The app should support:
- Band-assisted chin-ups (log as assisted with a band colour/tension note)
- Negative-only reps (timed descent, e.g. "5 sec negatives × 5")
- Progress tracking toward first unassisted rep

---

## Priority 5 — Workout Rotation Logic

**Status:** Under consideration

Currently the user manually selects which workout to do. The app suggests the next workout (A→B→C→A) on the dashboard but doesn't enforce it. A smarter rotation could:
- Auto-suggest based on last session + rest days elapsed
- Flag if the same workout is being repeated too soon
- Track A/B/C balance over time in the Progress screen

---

## Known Issues / Technical Debt

| Issue | Detail |
|---|---|
| GitHub is behind local | Local `src/IronLog.jsx` is ~2 weeks newer than the last GitHub push (April 28). Need to build and push. |
| `PRESET_LIBRARY` vs `EXERCISES` split | The distinction between these two objects is unclear. Consider merging into one `EXERCISE_LIBRARY` with a `inDefaultWorkout` flag. |
| No `repMax` on timed exercises | `isTimed` exercises have `repMax: null` which is fine, but the overload nudge logic should explicitly handle this case. |

---

## Completed Features (Reference)

- [x] Session flow: energy → warmup → exercises → finisher → done
- [x] Per-set: weight, reps/duration, RPE, pain
- [x] Pain ≥ 3 warning banner
- [x] Pre-fill from last session
- [x] Rest timer (60/90/120s)
- [x] Session clock
- [x] PR detection
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

---

## Agent Notes & Feedback Log

*Append notes here after any significant agent session — what was changed, what was decided, what was left for next time.*

### 2026-05-12 — GPT-5 Codex code review
- Resume state is incomplete. If `il_active` exists, `ActiveWorkout` always reopens at workout phase and exercise index 0 (`src/IronLog.jsx:499-500`), while elapsed time restarts from zero (`src/IronLog.jsx:503`, `src/IronLog.jsx:512-514`). A reload during warm-up, finisher, or later exercises loses the user's position and under-reports final duration (`src/IronLog.jsx:579`).
- Progressive overload nudges are too eager for a conservative return-to-training app. Several defaults have `defaultReps === repMax` (for example goblet squat, DB bench, KB deadlift, split squat at `src/IronLog.jsx:29-34`, `src/IronLog.jsx:39`), so simply completing the prescribed first-session reps can trigger "add load" (`src/IronLog.jsx:148-154`, `src/IronLog.jsx:708-714`). The logic also ignores high pain and high RPE, so painful or maximal-effort sets can still be marked ready to progress.
- PR detection is weight-only for `kg` exercises (`src/IronLog.jsx:131-145`). A heavier but much lower-rep set is treated as a PR, and bodyweight/band/timed progress is excluded entirely. That may be acceptable as "top weight PR", but the UI label says "Personal Records" without that nuance (`src/IronLog.jsx:840-845`).
- Rest timer behaviour is inconsistent with the roadmap. The completed-features note says 60/90/120s, but the app offers 30/60/120s shortcuts and auto-starts 30s after every set (`src/IronLog.jsx:523-550`, `src/IronLog.jsx:700-705`). The timer is interval/timeout based and not wall-clock based, so iOS backgrounding can pause or skew rest and elapsed time.
- Import/localStorage handling lacks shape validation. `load()` catches malformed JSON but accepts any parsed truthy value (`src/IronLog.jsx:68-74`); startup then assumes `sessions` is an array and passes it to `nextWorkout()` (`src/IronLog.jsx:84-89`, `src/IronLog.jsx:1627-1639`). `importData()` parses JSON only, without validating arrays or expected object shapes (`src/IronLog.jsx:205-214`, `src/IronLog.jsx:1654-1664`).
- Empty or corrupted active sessions can blank the Train screen. If an active session has no valid `exercises`, workout phase returns `null` with no recovery path (`src/IronLog.jsx:634-639`).
- `EXERCISES` vs `PRESET_LIBRARY` is already leaking into UX and data maintenance. Built-in default workout exercises live in both places (`WORKOUTS` references `p_` preset IDs at `src/IronLog.jsx:50-60`), but Manage's library intentionally lists only `PRESET_LIBRARY` and custom exercises (`src/IronLog.jsx:1313-1317`), so base `EXERCISES` items are not browsable from the Library tab even though they are part of the merged runtime library (`src/IronLog.jsx:1621`).
- Several preset exercises conflict with the documented equipment or constraints and should be hidden, flagged, or removed before library expansion: machine/cable-only entries (`p_cable_fly`, `p_lat_pulldown`, `p_seated_cable_row`, `p_leg_press`, `p_leg_extension`, `p_seated_leg_curl`, `p_cable_kickback`, `p_hip_abduction`, `p_cable_crunch` at `src/IronLog.jsx:1262-1293`), higher-risk hinge/core entries for slipped disc constraints (`p_good_morning`, `p_russian_twist`, `p_cable_crunch` at `src/IronLog.jsx:1269`, `src/IronLog.jsx:1292-1293`), and shoulder-sensitive entries lacking cautions (`p_chest_dip`, `p_arnold_press`, `p_db_fly`, `p_incline_db_press`, `p_pull_up` at `src/IronLog.jsx:1253-1264`).
- Pull-up guidance is under-specified for shoulder bursitis. `p_pull_up` says full hang to chin over bar but does not mention shoulder-width/narrow grip, band assistance, or negatives-only progression (`src/IronLog.jsx:1264`), even though the roadmap calls this out as a planned onboarding need.
- All 66 built-in exercise demos are YouTube search URLs generated by `YT()` (`src/IronLog.jsx:26`, `src/IronLog.jsx:29-44`, `src/IronLog.jsx:1237-1293`); none are curated watch URLs or specific video IDs. This supports Decision 1's Option A as a low-risk data cleanup before any embed/API work.
- iOS/PWA risk: `build.js` has iPhone home-screen meta tags and icons (`build.js:51-59`) but no web app manifest or service worker, and runtime React/ReactDOM/fonts load from CDNs (`build.js:60-62`). Once cached, the current page may remain usable from browser cache, but it is not a robust offline PWA install.

### 2026-05-12 — Exercise library planning session
- Audited full equipment list: barbell + stand, flat bench, incline/decline bench, DBs, KBs, bands, fit ball, medicine ball, stepper, small trampoline, doorframe chin-up bar
- Researched 3-day PPL splits for men 50+
- Mapped all candidate exercises against medical constraints and equipment
- Produced full priority-ranked exercise list above (Priority 1)
- Key finding: barbell flat bench, incline bench, close-grip bench, skull crushers, face pulls, chin-ups, RDL are the most important additions
- Exercises ruled out: barbell back squat, barbell front squat, barbell overhead press, Pendlay row, KB swing, leg press, leg extension, wide-grip pull-up
- Next step: implement Priority 1 (exercise library expansion) in `src/IronLog.jsx`
