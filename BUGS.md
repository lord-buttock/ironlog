# IronLog — Bug Tracker

Canonical list of open and closed bugs. Use stable IDs when referencing from commits, ROADMAP.md, or CHANGELOG.md.

Format for commits: `Fix BUG-NNN: short description`

---

## Open

### BUG-002 [OPEN] Overload nudge fires too early
**Priority:** High
**File:** `src/IronLog.jsx` ~lines 148–157, 709
**Detail:** Several exercises have `defaultReps === repMax` (goblet squat, DB bench, KB deadlift, split squat). Completing prescribed reps on the first session triggers "add load." Logic also ignores high pain and high RPE.
**Fix:** Require `repMax > defaultReps` + no sets with `pain >= 3` + avg RPE ≤ 8 (exclude blank RPE from average). Do not change the per-set comparison (`>= repMax`).

---

### BUG-003 [OPEN] Import validation missing — bad JSON shape crashes app
**Priority:** High
**File:** `src/IronLog.jsx` ~lines 1654–1664
**Detail:** `importData()` parses JSON but does not validate that `sessions` and `rides` are arrays. Also does not call `setActiveSession(null)` on success — importing mid-workout leaves a stale active session in state.
**Fix:** Add `Array.isArray()` checks before accepting imported data. Call `setActiveSession(null)` on successful import.

---

### BUG-004 [OPEN] Resume state incomplete — phase, exIdx, and elapsed time reset on reload
**Priority:** High
**File:** `src/IronLog.jsx` ~lines 499–503, 512
**Detail:** When `il_active` exists, `ActiveWorkout` always reopens at workout phase and exercise index 0. Elapsed time restarts from zero. A reload during warm-up, finisher, or mid-workout loses position and under-reports session duration.
**Fix:** Persist `phase` and `exIdx` into `activeSession`. On resume, derive `exIdx` from first incomplete exercise. Use wall-clock `startTime` (timestamp) to compute elapsed rather than a counter.

---

### BUG-005 [OPEN] Blank Train screen — no recovery path for malformed active session
**Priority:** High
**File:** `src/IronLog.jsx` ~line 638
**Detail:** If `il_active` contains a session with no valid `exercises` array, the workout phase returns `null`. The screen goes blank with no error state and no escape except manually clearing browser storage.
**Fix:** Add a fallback UI: detect malformed session on mount, render a "Session data is corrupted — clear and start fresh" screen with a button that calls `clearActiveSession()`.

---

### BUG-008 [OPEN] Finisher notes lost on reload before completion
**Priority:** Medium
**File:** `src/IronLog.jsx` ~lines 820–825
**Detail:** Finisher note updates only local `session` state and never call `setActiveSession`. If the app reloads during the finisher after notes are typed but before the session is completed, the notes are lost even though set updates are persisted immediately.
**Fix:** Call `setActiveSession(updated)` (or equivalent persistence call) whenever finisher notes change.

---

### BUG-009 [OPEN] EXERCISES not browseable in Manage → Library
**Priority:** Medium
**File:** `src/IronLog.jsx` ~lines 1313–1317
**Detail:** The Library tab in Manage only shows `PRESET_LIBRARY` and custom exercises. Base `EXERCISES` items (the default workout exercises) are not listed. Their form cues and demo links are inaccessible outside an active workout.
**Fix:** Include `EXERCISES` entries in the Library tab display.

---

### BUG-010 [OPEN] Equipment-incompatible exercises appear in mid-session Add Exercise picker
**Priority:** Low
**File:** `src/IronLog.jsx` ~lines 1262–1293
**Detail:** Cable machines, leg press, T-bar row, and other equipment the user does not own appear in the Add Exercise picker mid-session.
**Fix:** Add an `equipment` or `available` flag to incompatible preset exercises and filter them from the picker.

---

## Fixed

### BUG-001 [FIXED] False PR detection on undone sets
**Fixed:** 2026-05-13 by Claude
**Commit:** f0ba663
**Detail:** `detectPRs` included sets where `s.done === false`. Pre-filled weights from the previous session that were never lifted could register as PRs. Also affected historical baseline (`prevMax`).
**Fix applied:** `filter(s => s.done)` added before mapping weights in both current-session and historical-session paths.

---

### BUG-006 [FIXED] Contraindicated exercises in PRESET_LIBRARY
**Fixed:** 2026-05-13 by Claude
**Commit:** 908a90d
**Detail:** `p_good_morning` (loaded spinal flexion), `p_russian_twist` (loaded spinal rotation), and `p_nordic_curl` (extreme eccentric hamstring load) were present in PRESET_LIBRARY and appeared in the mid-session Add Exercise picker. All three are contraindicated for this user's medical constraints.
**Fix applied:** All three removed from PRESET_LIBRARY.

---

### BUG-007 [FIXED] p_pull_up cue unsafe for shoulder bursitis
**Fixed:** 2026-05-13 by Claude
**Commit:** 908a90d
**Detail:** Cue said "full hang to chin over bar" without specifying grip width. Wide-grip pull-ups are contraindicated for bilateral shoulder bursitis.
**Fix applied:** Cue updated to specify shoulder-width or narrower grip only, band-assisted start, negatives progression.
