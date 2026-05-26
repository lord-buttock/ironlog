# Session Set Editing — Design Spec
*2026-05-26 — approved by Phill*

---

## Overview

Allow the user to correct entry errors in past sessions — primarily weight/reps typos (e.g. 80kg logged instead of 8kg). Editing is inline within the existing expanded History card. No new screens or navigation required.

---

## Design decisions

| Decision | Choice | Rationale |
|---|---|---|
| Entry point | Expanded session card footer | No new screen; stays in context |
| Edit scope | Set fields only (weight, reps, RPE, pain, duration); exercise notes; add/remove sets | Session-level fields (energy, date, session notes) not editable — not needed |
| Edit UX | Inline edit mode — card switches state, all sets visible as inputs at once | No tap-to-expand per set; faster for correcting a value at a glance |
| Edit vs Delete placement | Edit on left, Delete on right of footer | Prevents accidental deletion when reaching for Edit on a mobile screen |
| Save | Writes immediately to `il_sessions` in localStorage | No staging layer; consistent with how ActiveWorkout saves |
| Cancel | Discards draft, restores read-only view | No confirmation needed — nothing has been persisted yet |

---

## Entry point — expanded session card footer

Current footer (read-only state):
```
[ ✏ Edit ]                          [ 🗑 Delete session ]
```

- **✏ Edit** — left-aligned ghost/muted button
- **🗑 Delete session** — right-aligned ghost/muted button (existing)
- Separated by `justify-content: space-between` — never adjacent

Tapping **✏ Edit** sets `editingId = sess.id` and initialises `draftSession` as a deep copy of the session.

---

## Edit mode — card layout

The expanded section of the card switches from read-only pills to an editable form. The card header (workout letter, title, date, energy emoji, duration pill) remains unchanged — not editable.

### Per-exercise block

```
┌─────────────────────────────────┐
│ FLAT BENCH PRESS        [label] │
├─────────────────────────────────┤
│ S1  [80] kg × [8] reps  R[7] P[–]  🗑 │
│ S2  [80] kg × [8] reps  R[7] P[–]  🗑 │
│ S3  [75] kg × [6] reps  R[8] P[–]  🗑 │
│                  [+ Add set]    │
│ Notes: [________________________]│
└─────────────────────────────────┘
```

**Set row fields:**

| Field | Type | When shown |
|---|---|---|
| Weight | Numeric input (kg) | When `!isTimed && unit !== 'bw' && unit !== 'band'` |
| Duration | Numeric input (s) | When `isTimed` |
| Reps | Numeric input | Always (except pure timed-only exercises) |
| RPE | Small stepper or tap input (1–10, blank = none) | Always |
| Pain | Small stepper or tap input (0–5, blank = none) | Always |
| 🗑 | Delete button | Always; removes set from draft |

For `pullupTracking` exercises: a small mode selector (bw / band / neg) replaces weight, same as active workout. Band name input shown when mode = `band`.

**+ Add set:** duplicates the values from the last set in that exercise (weight, reps, RPE=null, pain=null, done=true). Appended to the bottom of that exercise's set list.

**Exercise notes:** single-line text input, pre-filled with existing `ex.notes`. Shown below the sets for each exercise.

### Edit mode footer

```
[ ✓ Save changes ]
[ Cancel ]
```

- **✓ Save changes** — blue filled button, full width
- **Cancel** — ghost text link centred below, small muted text

---

## State management

### New state in `History` component

```js
const [editingId, setEditingId] = useState(null);   // sess.id or null
const [draft, setDraft] = useState(null);            // deep copy of session
```

### Entering edit mode

```js
function startEdit(sess) {
  setEditingId(sess.id);
  setDraft(JSON.parse(JSON.stringify(sess)));  // deep copy
}
```

### Updating a set field

```js
function updateSet(exIdx, setIdx, field, value) {
  setDraft(prev => {
    const next = JSON.parse(JSON.stringify(prev));
    next.exercises[exIdx].sets[setIdx][field] = value;
    return next;
  });
}
```

### Deleting a set

```js
function deleteSet(exIdx, setIdx) {
  setDraft(prev => {
    const next = JSON.parse(JSON.stringify(prev));
    next.exercises[exIdx].sets.splice(setIdx, 1);
    return next;
  });
}
```

### Updating exercise notes

```js
function updateNotes(exIdx, value) {
  setDraft(prev => {
    const next = JSON.parse(JSON.stringify(prev));
    next.exercises[exIdx].notes = value;
    return next;
  });
}
```

### Adding a set

```js
function addSet(exIdx) {
  setDraft(prev => {
    const next = JSON.parse(JSON.stringify(prev));
    const sets = next.exercises[exIdx].sets;
    const last = sets[sets.length - 1] || {};
    sets.push({ ...last, rpe: null, pain: null, done: true });
    return next;
  });
}
```

### Saving

```js
function saveEdit() {
  setSessions(prev => {
    const next = prev.map(s => s.id === editingId ? draft : s);
    localStorage.setItem('il_sessions', JSON.stringify(next));
    return next;
  });
  setEditingId(null);
  setDraft(null);
}
```

### Cancelling

```js
function cancelEdit() {
  setEditingId(null);
  setDraft(null);
}
```

---

## Colour scheme (light theme)

All existing theme values — no new colours.

| Element | Value |
|---|---|
| Background | `C.bg` (`#f6f9fc`) |
| Card | `C.card` (`#ffffff`) |
| Input background | `C.surface` (`#ffffff`) |
| Input border (normal) | `C.border` (`#d9e4ef`) |
| Input border (focused) | `C.amber` (`#5b9df5`) |
| Accent / blue | `C.amber` (`#5b9df5`) |
| Muted text | `C.muted` (`#6b7788`) |
| Delete icon | `C.muted` — no red, not destructive enough to warn |
| Save button | `C.amber` fill, `#fff` text |

---

## Edge cases

| Scenario | Behaviour |
|---|---|
| Delete last set in an exercise | Allowed — exercise remains with zero sets (won't pre-fill next session for that exercise) |
| Exercise has `isTimed` | Duration field shown instead of weight |
| Exercise has `pullupTracking` | Mode selector (bw/band/neg) shown instead of weight |
| `unit === 'bw'` or `unit === 'band'` | Weight field hidden, reps only |
| RPE or pain left blank | Stored as `null` |
| Two sessions expanded simultaneously | Not possible — History only allows one card expanded at a time (`expanded` state is a single ID) |
| Edit while another session is expanded | Tapping Edit on a collapsed card is not exposed — Edit only appears in the expanded footer |
| Supabase sync | No change needed — sync reads from `il_sessions` which is updated on Save |

---

## What is NOT in scope

- Editing session date, energy rating, or session notes
- Reordering exercises within a session
- Adding or removing exercises from a past session
- Editing the workout type (A/B/C)

---

## Files touched

- `src/IronLog.jsx` only
  - Modify `History` component: add `editingId` and `draft` state; add helper functions; render edit mode within expanded card
  - No new components needed — edit mode is inline within the existing card render

- Build: `node build.js` after every edit
- Commit: `src/IronLog.jsx` + `dist/index.html` + `index.html` + `version.json` together
