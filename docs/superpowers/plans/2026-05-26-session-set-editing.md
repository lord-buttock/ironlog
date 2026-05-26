# Session Set Editing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow the user to edit set data (weight, reps, RPE, pain, duration), add sets, and delete sets within past sessions directly from the History card.

**Architecture:** All changes are confined to the `History` component in `src/IronLog.jsx`. Two new state variables (`editingId`, `draft`) track which session is being edited and hold a deep copy of it. Helper functions mutate the draft; Save flushes it to `il_sessions` in localStorage via `setSessions`. No new components or screens needed.

**Tech Stack:** React 18 (UMD globals — no imports), inline styles, localStorage

---

## File structure

- **Modify only:** `src/IronLog.jsx` — specifically the `History` function (lines ~3056–3153)
- **Build output:** `dist/index.html` and root `index.html` (written by `node build.js`)
- **Never edit** `dist/index.html` or root `index.html` directly

---

## Codebase context (read before touching code)

The project is at:
```
/Users/phillcantone/Library/Mobile Documents/com~apple~CloudDocs/Family/Phill/AI Coding/IRONLOG/
```

**Colour theme** (`const C` at line 6):
```js
const C = {
  bg: '#f6f9fc', surface: '#ffffff', card: '#ffffff', border: '#d9e4ef',
  amber: '#5b9df5',  // the accent colour (blue in this theme)
  amberDim: '#dcecff', red: '#dc5252', green: '#1f9d8a',
  text: '#17212b', muted: '#6b7788', dim: '#eaf1f8',
  fDisplay: "'Barlow Condensed', sans-serif",
  fMono: "'JetBrains Mono', monospace",
  fBody: "'Barlow', sans-serif",
};
```

**Style helpers** (`const st` at line 1129) — use these, don't write raw styles:
```js
st.inp     // input/select style — background C.surface, border C.border, monospace, centred
st.btn()   // filled button (amber bg, white text, full-width)
st.btnSm() // smaller filled button
st.ghost   // ghost button (transparent bg, border, full-width)
st.card()  // card container
st.label   // 10px mono uppercase muted label
st.mono(size, color)  // monospace text
st.pill(color)        // pill badge
st.col(gap)           // flex column
```

**Session data shape** (each item in `il_sessions`):
```js
{
  id: string,            // timestamp string, e.g. "1748000000000"
  workout: 'A'|'B'|'C',
  date: string,          // ISO date string
  energy: 1-5 | null,
  duration: number | null,  // minutes
  completed: boolean,
  exercises: [
    {
      id: string,        // exercise ID, e.g. 'bb_flat_bench'
      notes: string,
      sets: [
        {
          weight: number | '',
          reps: number | '',
          duration: number | '',  // seconds, for isTimed exercises
          rpe: number | null,     // 5-10
          pain: number | null,    // 0-5
          done: boolean,
          mode: 'bw'|'band'|'neg',  // pullupTracking exercises only
          band: string,              // pullupTracking + band mode only
        }
      ]
    }
  ],
  notes: string,
}
```

**Exercise definition flags** (from `allExercises[id]`):
```js
{
  name: string,
  unit: 'kg' | 'bw' | 'band',
  isTimed: boolean,        // duration instead of weight
  pullupTracking: boolean, // special mode selector
}
```

**Build command:**
```bash
cd "/Users/phillcantone/Library/Mobile Documents/com~apple~CloudDocs/Family/Phill/AI Coding/IRONLOG" && npm run build
```
Expected output: `✓ Built dist/index.html and index.html (XXX KB)`

**Commit all four files together:**
```bash
cd "/Users/phillcantone/Library/Mobile Documents/com~apple~CloudDocs/Family/Phill/AI Coding/IRONLOG"
git add src/IronLog.jsx && git add -f dist/index.html && git add index.html version.json
git commit -m "your message"
git push origin main
```
Note: `dist/` is in `.gitignore` — you must use `git add -f dist/index.html`.

---

## Task 1: Edit state, helper functions, and footer layout

**Files:**
- Modify: `src/IronLog.jsx` — `History` function (~line 3056)

This task adds the state machinery and changes the footer from read-only to split Edit/Delete (read mode) or Save/Cancel (edit mode). No edit-mode content rendering yet.

- [ ] **Step 1: Add `editingId` and `draft` state**

Find the `History` function. It currently starts like this:
```jsx
function History({ sessions, setSessions, allExercises = EXERCISES }) {
  const [expanded, setExpanded] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null); // sess.id pending delete
```

Add two new state variables immediately after `confirmDelete`:
```jsx
function History({ sessions, setSessions, allExercises = EXERCISES }) {
  const [expanded, setExpanded] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null); // sess.id pending delete
  const [editingId, setEditingId] = useState(null);   // sess.id being edited, or null
  const [draft, setDraft] = useState(null);            // deep copy of session under edit
```

- [ ] **Step 2: Add helper functions**

After the existing `deleteSession` function, add all edit helpers:

```jsx
  function startEdit(sess) {
    setEditingId(sess.id);
    setDraft(JSON.parse(JSON.stringify(sess)));
    setConfirmDelete(null); // clear any pending delete
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft(null);
  }

  function saveEdit() {
    setSessions(prev => {
      const next = prev.map(s => s.id === editingId ? draft : s);
      localStorage.setItem('il_sessions', JSON.stringify(next));
      return next;
    });
    setEditingId(null);
    setDraft(null);
  }

  function updateSet(exIdx, setIdx, field, value) {
    setDraft(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      next.exercises[exIdx].sets[setIdx][field] = value;
      return next;
    });
  }

  function updateNotes(exIdx, value) {
    setDraft(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      next.exercises[exIdx].notes = value;
      return next;
    });
  }

  function deleteSet(exIdx, setIdx) {
    setDraft(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      next.exercises[exIdx].sets.splice(setIdx, 1);
      return next;
    });
  }

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

- [ ] **Step 3: Rework the expanded footer**

Find the current footer block inside the expanded section. It currently looks like:
```jsx
<div style={{ marginTop: 12, borderTop: `1px solid ${C.dim}`, paddingTop: 10 }}>
  {confirmDelete === sess.id ? (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 12, color: C.muted, flex: 1 }}>Delete this session?</span>
      <button onClick={() => deleteSession(sess.id)} style={{ ...st.btnSm('#d9534f'), padding: '5px 12px', fontSize: 12 }}>Delete</button>
      <button onClick={() => setConfirmDelete(null)} style={{ ...st.btnSm(), padding: '5px 12px', fontSize: 12 }}>Cancel</button>
    </div>
  ) : (
    <button onClick={() => setConfirmDelete(sess.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, fontSize: 12, padding: 0, opacity: 0.7 }}>
      🗑 Delete session
    </button>
  )}
</div>
```

Replace the entire block with:
```jsx
<div style={{ marginTop: 12, borderTop: `1px solid ${C.dim}`, paddingTop: 10 }}>
  {editingId === sess.id ? (
    /* Edit mode footer: Save full-width, Cancel below */
    <div>
      <button onClick={saveEdit} style={{ ...st.btn(), marginBottom: 8 }}>
        ✓ Save changes
      </button>
      <button onClick={cancelEdit} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, fontSize: 12, display: 'block', width: '100%', textAlign: 'center', padding: '4px 0' }}>
        Cancel
      </button>
    </div>
  ) : confirmDelete === sess.id ? (
    /* Delete confirmation */
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 12, color: C.muted, flex: 1 }}>Delete this session?</span>
      <button onClick={() => deleteSession(sess.id)} style={{ ...st.btnSm('#d9534f'), padding: '5px 12px', fontSize: 12 }}>Delete</button>
      <button onClick={() => setConfirmDelete(null)} style={{ ...st.btnSm(), padding: '5px 12px', fontSize: 12 }}>Cancel</button>
    </div>
  ) : (
    /* Read mode footer: Edit left, Delete right — never adjacent */
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <button onClick={() => { startEdit(sess); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.amber, fontSize: 12, padding: 0 }}>
        ✏ Edit
      </button>
      <button onClick={() => setConfirmDelete(sess.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, fontSize: 12, padding: 0, opacity: 0.7 }}>
        🗑 Delete session
      </button>
    </div>
  )}
</div>
```

- [ ] **Step 4: Build and verify footer renders correctly**

```bash
cd "/Users/phillcantone/Library/Mobile Documents/com~apple~CloudDocs/Family/Phill/AI Coding/IRONLOG" && npm run build
```

Expected: `✓ Built dist/index.html and index.html (XXX KB)` with no errors.

Open the app in a browser, go to Log tab, expand a session. Verify:
- Footer shows "✏ Edit" on left and "🗑 Delete session" on right
- Tapping "✏ Edit" does not crash (the edit-mode content will render read-only pills still — that's fine, Task 2 fixes that)
- Tapping "🗑 Delete session" still shows the confirm prompt
- In edit mode, footer shows "✓ Save changes" button and "Cancel" link
- "Cancel" restores read-only view

- [ ] **Step 5: Commit**

```bash
cd "/Users/phillcantone/Library/Mobile Documents/com~apple~CloudDocs/Family/Phill/AI Coding/IRONLOG"
git add src/IronLog.jsx && git add -f dist/index.html && git add index.html version.json
git commit -m "feat: history edit mode — state, helpers, and footer layout"
git push origin main
```

---

## Task 2: Edit-mode set rows, add/delete set, exercise notes

**Files:**
- Modify: `src/IronLog.jsx` — expanded content inside `History` (~line 3103)

When `editingId === sess.id`, replace read-only set pills with editable input rows. Add "+ Add set" and delete-set (🗑) per set. Make exercise notes an editable text field.

- [ ] **Step 1: Locate the exercise block render**

Inside the expanded section, find:
```jsx
{sess.exercises?.map(ex => {
  const def = allExercises[ex.id] || EXERCISES[ex.id];
  return (
    <div key={ex.id} style={{ marginBottom: 10 }}>
      <div style={{ ...st.label, marginBottom: 4 }}>{def?.name}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {ex.sets.map((s, i) => {
          const display = def?.isTimed ? `${s.duration}s`
            : def?.pullupTracking
              ? s.mode === 'band' ? `${s.reps}r (${s.band || 'band'})`
                : s.mode === 'neg' ? `${s.reps}×${s.duration||'?'}s neg`
                : `${s.reps} reps`
            : def?.unit === 'bw' || def?.unit === 'band' ? `${s.reps} reps`
            : `${s.weight}kg × ${s.reps}`;
          return (
            <span key={i} style={{ ...st.pill(s.done ? C.text : C.muted), fontSize: 11 }}>
              {display}{s.rpe ? ` r${s.rpe}` : ''}
            </span>
          );
        })}
      </div>
      {ex.notes && (
        <div style={{ fontSize: 11, color: C.muted, fontStyle: 'italic', marginTop: 4 }}>
          {'📝'} {ex.notes}
        </div>
      )}
    </div>
  );
})}
```

- [ ] **Step 2: Replace with conditional read/edit rendering**

Replace the entire block above with the following. Read mode is unchanged; edit mode adds input rows, delete-set buttons, add-set button, and notes textarea.

The variable `isEditing` selects between the two branches. In edit mode, `exIdx` is the index into `draft.exercises` (same order as the original).

```jsx
{(editingId === sess.id ? draft.exercises : sess.exercises)?.map((ex, exIdx) => {
  const def = allExercises[ex.id] || EXERCISES[ex.id];
  const isEditing = editingId === sess.id;
  const isTimed = !!def?.isTimed;
  const isBW = def?.unit === 'bw' || def?.unit === 'band';
  const isPullup = !!def?.pullupTracking;
  const loadLabel = def?.unit === 'band' ? 'BAND' : 'BW';

  return (
    <div key={ex.id} style={{ marginBottom: isEditing ? 14 : 10 }}>
      <div style={{ ...st.label, marginBottom: 4 }}>{def?.name}</div>

      {isEditing ? (
        /* ── EDIT MODE ── */
        <div>
          {ex.sets.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4, background: C.dim, borderRadius: 6, padding: '6px 8px' }}>
              {/* Set number */}
              <span style={{ ...st.mono(11, C.muted), width: 20, textAlign: 'center', flexShrink: 0 }}>S{i + 1}</span>

              {/* Pullup mode selector */}
              {isPullup && (
                <select value={s.mode || 'bw'} onChange={e => updateSet(exIdx, i, 'mode', e.target.value)}
                  style={{ ...st.inp, fontSize: 11, flex: '0 0 68px' }}>
                  <option value="bw">BW</option>
                  <option value="band">Band</option>
                  <option value="neg">Neg</option>
                </select>
              )}

              {/* Weight / Duration / BW label */}
              {isTimed ? (
                <input type="number" inputMode="numeric" value={s.duration ?? ''}
                  onChange={e => updateSet(exIdx, i, 'duration', e.target.value)}
                  style={{ ...st.inp, flex: 1 }} placeholder="sec" />
              ) : isPullup && (s.mode || 'bw') === 'band' ? (
                <input type="text" value={s.band || ''}
                  onChange={e => updateSet(exIdx, i, 'band', e.target.value)}
                  style={{ ...st.inp, flex: 1, fontSize: 12 }} placeholder="band" />
              ) : isPullup && (s.mode || 'bw') === 'neg' ? (
                <input type="number" inputMode="numeric" value={s.duration ?? ''}
                  onChange={e => updateSet(exIdx, i, 'duration', e.target.value)}
                  style={{ ...st.inp, flex: 1 }} placeholder="sec" />
              ) : isBW ? (
                <div style={{ ...st.inp, flex: 1, color: C.muted, fontSize: 10, lineHeight: '34px', border: `1px solid ${C.border}` }}>{loadLabel}</div>
              ) : (
                <input type="number" inputMode="decimal" value={s.weight ?? ''}
                  onChange={e => updateSet(exIdx, i, 'weight', e.target.value)}
                  style={{ ...st.inp, flex: 1 }} placeholder="kg" />
              )}

              {/* Reps (hidden for pure timed) */}
              {!isTimed && (
                <input type="number" inputMode="numeric" value={s.reps ?? ''}
                  onChange={e => updateSet(exIdx, i, 'reps', e.target.value)}
                  style={{ ...st.inp, flex: 1 }} placeholder="reps" />
              )}

              {/* RPE */}
              <select value={s.rpe ?? ''} onChange={e => updateSet(exIdx, i, 'rpe', e.target.value ? +e.target.value : null)}
                style={{ ...st.inp, flex: '0 0 52px', fontSize: 12 }}>
                <option value=''>RPE</option>
                {[5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
              </select>

              {/* Pain */}
              <select value={s.pain ?? ''} onChange={e => updateSet(exIdx, i, 'pain', e.target.value !== '' ? +e.target.value : null)}
                style={{ ...st.inp, flex: '0 0 52px', fontSize: 12 }}>
                <option value=''>Pain</option>
                {[0,1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
              </select>

              {/* Delete set */}
              <button onClick={() => deleteSet(exIdx, i)}
                style={{ background: 'none', border: 'none', color: C.muted, fontSize: 15, cursor: 'pointer', padding: '0 2px', flexShrink: 0 }}>
                🗑
              </button>
            </div>
          ))}

          {/* Add set */}
          <button onClick={() => addSet(exIdx)}
            style={{ background: 'none', border: `1px dashed ${C.border}`, color: C.muted, borderRadius: 4, fontSize: 11, padding: '5px 12px', width: '100%', cursor: 'pointer', marginTop: 2 }}>
            + Add set
          </button>

          {/* Exercise notes */}
          <input type="text" value={ex.notes || ''} onChange={e => updateNotes(exIdx, e.target.value)}
            placeholder="Exercise notes…"
            style={{ ...st.inp, marginTop: 6, fontSize: 12, textAlign: 'left', padding: '7px 10px' }} />
        </div>
      ) : (
        /* ── READ MODE (unchanged) ── */
        <div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {ex.sets.map((s, i) => {
              const display = def?.isTimed ? `${s.duration}s`
                : def?.pullupTracking
                  ? s.mode === 'band' ? `${s.reps}r (${s.band || 'band'})`
                    : s.mode === 'neg' ? `${s.reps}×${s.duration||'?'}s neg`
                    : `${s.reps} reps`
                : def?.unit === 'bw' || def?.unit === 'band' ? `${s.reps} reps`
                : `${s.weight}kg × ${s.reps}`;
              return (
                <span key={i} style={{ ...st.pill(s.done ? C.text : C.muted), fontSize: 11 }}>
                  {display}{s.rpe ? ` r${s.rpe}` : ''}
                </span>
              );
            })}
          </div>
          {ex.notes && (
            <div style={{ fontSize: 11, color: C.muted, fontStyle: 'italic', marginTop: 4 }}>
              {'📝'} {ex.notes}
            </div>
          )}
        </div>
      )}
    </div>
  );
})}
```

- [ ] **Step 3: Build**

```bash
cd "/Users/phillcantone/Library/Mobile Documents/com~apple~CloudDocs/Family/Phill/AI Coding/IRONLOG" && npm run build
```

Expected: clean build, no errors.

- [ ] **Step 4: Manual verification**

Open the app. Go to Log tab. Expand a session.

Check read mode:
- Footer shows "✏ Edit" (left) and "🗑 Delete session" (right), well separated
- Set pills render exactly as before

Tap "✏ Edit":
- All set rows switch to input fields
- Footer shows "✓ Save changes" and "Cancel"
- Weight inputs are pre-filled with existing values
- RPE and Pain selects are pre-filled
- "🗑" per set removes that set row immediately
- "+ Add set" appends a new row with the last set's weight/reps pre-filled
- Exercise notes field shows existing notes

Tap "Cancel":
- Card returns to read-only view, original data unchanged

Make a change (e.g. fix 80kg → 8kg), tap "✓ Save changes":
- Card returns to read-only view
- The corrected value shows in the set pill
- Collapse and re-expand the card — correction persists
- Reload the page (or close/reopen app) — correction still there (saved to localStorage)

- [ ] **Step 5: Update CHANGELOG.md**

Prepend to the top of `CHANGELOG.md`:

```markdown
## 2026-05-26 — Session Set Editing

- History: expanded session cards now have an "✏ Edit" button (left) alongside "🗑 Delete" (right)
- Edit mode allows correcting weight, reps, RPE, pain, and duration per set
- Add set (copies last set's values) and delete set per exercise
- Exercise notes editable as a text field
- Save writes to localStorage immediately; Cancel discards all changes
```

- [ ] **Step 6: Commit and push**

```bash
cd "/Users/phillcantone/Library/Mobile Documents/com~apple~CloudDocs/Family/Phill/AI Coding/IRONLOG"
git add src/IronLog.jsx && git add -f dist/index.html && git add index.html version.json CHANGELOG.md
git commit -m "feat: inline session editing — edit sets, add/delete sets, exercise notes"
git push origin main
```

---

## Self-review notes

**Spec coverage check:**
- ✅ Edit/Delete separated (space-between, never adjacent)
- ✅ All set fields: weight, reps, RPE, pain, duration (for timed)
- ✅ pullupTracking: mode selector + band/neg inputs
- ✅ BW/band exercises: loadLabel shown instead of weight input
- ✅ Add set (copies last set, clears RPE/pain)
- ✅ Delete set (splice from draft)
- ✅ Exercise notes textarea
- ✅ Save writes to localStorage via setSessions
- ✅ Cancel discards draft
- ✅ Light colour scheme (C.bg = #f6f9fc, C.amber = #5b9df5)
- ✅ Session-level fields (energy, date, session notes) NOT editable — out of scope

**Edge cases handled:**
- Zero sets after deletion: exercise block shows only "+ Add set" — fine
- Empty notes field: `placeholder="Exercise notes…"` shows; saves empty string
- `allExercises` lookup fallback: `allExercises[ex.id] || EXERCISES[ex.id]` — same as existing code
- `draft` is always read in edit mode: `editingId === sess.id ? draft.exercises : sess.exercises`
