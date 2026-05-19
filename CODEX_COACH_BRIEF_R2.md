# Codex Brief R2 — AI Coach, Response to Review Feedback
*Generated 2026-05-19. Read this alongside the updated spec.*

---

## File path issue — you were reading the wrong copy

Your review linked to `/Users/phillcantone/Documents/New project 3/src/IronLog.jsx`. The correct file is:

```
/Users/phillcantone/Library/Mobile Documents/com~apple~CloudDocs/Family/Phill/AI Coding/Ironlog/src/IronLog.jsx
```

Several of your concerns do not apply to the current source. In the correct file:

- **`caution` field exists and renders** — `SetRow` renders it at line 1441 with amber styling. `kb_deadlift`, `rdl`, `chin_up`, `p_bb_row`, and many others already have `caution` strings. The spec's plan to inject coach caution notes is valid and uses an already-working mechanism.
- **`p_bb_row` exists** — line 2151, with a `caution` field.
- **Stretch routine accordion exists** — Dashboard renders it at lines 881–928 using `showStretches` state.
- **`p_rdl` exists** — line 2119.

Please re-read the correct file before your next pass.

---

## Genuine issues you found — confirmed and addressed

### 1. Pre-start / energy check flow (valid concern, spec updated)

You are correct that `ActiveWorkout` phase initialisation at line 1129 defaults to `'workout'` when `activeSession` exists. However the full line is:

```js
const [phase, setPhase] = useState(activeSession?.phase || (activeSession ? 'workout' : 'energy'));
```

This means if `activeSession.phase = 'energy'` is set, it correctly starts at energy. The fix is simple: when pre-start calls `buildSession()` and sets `activeSession`, set `phase: 'energy'` explicitly on the session object. `buildSession()` does not currently set `.phase`, so this is a one-line addition.

**Spec update:** `buildSession()` returns `{ ...session, phase: 'energy' }`. Pre-start sets this as `activeSession` before advancing to `'workout'` view.

### 2. `p_band_seated_row` is not a valid exercise ID (valid concern, spec updated)

Confirmed — that ID does not exist. The correct swap for `chin_up` when shoulders are sore is `band_row` (line 378). Updated swap table below.

### 3. Session sort order (valid concern, spec updated)

Confirmed — `nextWorkout()` uses `done[done.length - 1]` and assumes chronological order. Supabase restore may produce descending order. `computeCoachRecommendation()` must sort sessions by `date` field before reading the last one.

**Spec update:** `computeCoachRecommendation` sorts `sessions` by `date` ascending before any reads.

### 4. Week strip Monday vs Sunday start (valid concern, spec updated)

Confirmed — `weekStart()` at line 621 uses `d.getDay()` making Sunday day 0. The week strip shows Mon–Sun so a Monday-based helper is needed.

**Spec update:** `computeWeekDays()` uses `((d.getDay() + 6) % 7)` to make Monday day 0.

### 5. "Pain ≥ 3 blocks progression nudge" contradiction (valid concern, removed from spec)

You are correct — the nudge function is unchanged, and the spec listing this as a safety guarantee was wrong. The nudge fix is a pre-existing open bug (BUG-002) that is separate from this feature. Removed from the safety rules in the spec. The coach layer does not fix BUG-002.

---

## Your missing decisions — resolved

**Does the coach track `selectedWorkout` or override to computed next?**
The coach computes the next workout from rotation and suggests it. The A/B/C selector on the home card still lets the user override. If the user manually selects a different workout, the coach note and flags recompute for that workout. `computeCoachRecommendation` accepts an optional `override` parameter; if passed, it uses that workout but still computes flags against the override's exercise list.

**Should pre-start appear when resuming an active session?**
No. Pre-start only appears from a fresh Start tap when `activeSession === null`. If `activeSession` exists, the app goes directly to `'workout'` as it does now.

**Should coach caution notes persist in session history?**
No. The `caution` string is injected into the in-memory session object at build time. It is not saved to `il_sessions` or Supabase. Session history is unchanged.

**How should the week strip show days with both a ride and workout?**
Show the workout letter (A/B/C) with priority. Rides on the same day are indicated with a small 🚴 indicator below the workout letter.

**Exact modification notes per flag:**
| Trigger | Modification note |
|---|---|
| Pain ≥ 3 on hinge exercise | "Pain logged last session — keep weight conservative, increase range only if pain-free." |
| Ride within 48h + hinge exercise | "Rode recently — keep weight raised and light. Prioritise pull movements." |
| Average RPE ≥ 8 last session | "High effort last time — train at RPE 6–7 today." |
| Days since last session ≥ 4 | "Been a while — ease in, RPE 6 max for first two exercises." |

**What if a safe swap was already added as a custom workout extra?**
The swap still applies — it replaces the flagged exercise in `buildSession()`. If the replacement is also in the custom extras list, it may appear twice; `buildSession()` should deduplicate by exercise ID.

---

## Updated safe swap table (corrected IDs)

| Exercise flagged | Suggested swap ID | Rationale |
|---|---|---|
| `rdl` | `hip_thrust` | Removes hinge load, keeps glutes |
| `kb_deadlift` | `hip_thrust` | Same — conservative on back |
| `p_bb_row` | `cs_db_row` | Chest-supported removes spinal load |
| `chin_up` | `band_row` | If shoulders are sore |
| `goblet_squat` | `reverse_lunge` | Lower spinal load option |

---

## What still needs your attention before implementing

1. **Re-read the correct source file** at the iCloud path above.
2. **Confirm `buildSession()` output shape** — specifically that adding `phase: 'energy'` to the returned object does not break any existing callers.
3. **Confirm `ActiveWorkout` handles `activeSession.phase = 'energy'`** correctly end-to-end, including the resume-from-storage path (line 1129).
4. **Confirm deduplication logic** for the swap-already-in-custom-extras edge case.

Once you've confirmed those four items, the spec is ready to implement. Please re-confirm your "ready to implement?" verdict after reading the correct file.

---

## Do not touch

- `assets/anatomy/` — fully complete
- `MuscleDiagram` component — complete
- `MUSCLE_META` — complete
- Any existing localStorage keys or their shapes
- `dist/index.html` — never edit directly, always rebuild via `node build.js`
