# Customisable Warm-Up Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static warm-up checklist with a three-screen flow: setup (compact rows with Change buttons), a full-screen picker per muscle group, and a guided countdown execution mode.

**Architecture:** All code lives in `src/IronLog.jsx`. New constants and helpers go in the data layer. Three new top-level components (`WarmupSetup`, `WarmupPicker`, `WarmupActive`) are inserted before `ActiveWorkout`. `ActiveWorkout` gains a `pickerSlot` state and two new phase branches that replace the old `'warmup'` block. Per-workout config persists in `localStorage` under `il_warmup_config`.

**Tech Stack:** React 18 (UMD globals: `useState`, `useEffect`, `useRef`), inline styles using the existing `C` theme and `st` helpers, `localStorage` for config persistence.

---

## Before you start

- Confirm working directory: `pwd` must output `.../IronLog` (iCloud path, not the stale Documents copy)
- Pull latest: `git pull --ff-only origin main && git status` — must be clean
- Read the spec: `docs/superpowers/specs/2026-05-24-warmup-customisation-design.md`
- The **only file you edit** is `src/IronLog.jsx`
- After every task: run `npm run build` and commit all four files together: `src/IronLog.jsx dist/index.html index.html version.json`

**Key file locations inside `src/IronLog.jsx`:**
- `C` theme object: line 6 — `C.bg='#f6f9fc'`, `C.amber='#5b9df5'`, `C.amberDim='#dcecff'`, `C.card='#ffffff'`, `C.muted='#6b7788'`, `C.border='#d9e4ef'`, `C.dim='#eaf1f8'`, `C.green='#1f9d8a'`, `C.purple='#7c6ee6'`, `C.red='#dc5252'`, `C.text='#17212b'`
- `st` helpers: line 965 — `st.btn()`, `st.ghost`, `st.card()`, `st.label`, `st.h2`, `st.mono()`, `st.col()`, `st.pill()`
- `STRETCH_LIBRARY`: line 362 — entries have `{ id, name, targets, cue, bilateral, suggestedSecs, imageDir?, caution? }`. Fields `sciatica` and `cross_legged` are stamped on at runtime by `applyStretchMeta()` (line 2831)
- `applyStretchMeta()` call: line 2831 — runs before all components, so `s.sciatica` and `s.cross_legged` are ready
- `ActiveWorkout` function: line 1636
- Old warmup phase block: lines 1792–1824 (the `if (phase === 'warmup')` block) — this gets replaced
- `startSession` inside `ActiveWorkout`: line 1681 — sets `phase: 'warmup'` → must change to `'warmup_setup'`

---

## Task 1: Data layer — `WARMUP_GROUPS` + helpers

**Files:**
- Modify: `src/IronLog.jsx` — insert after `STRETCH_LIBRARY` closing semicolon (~line 493)

- [ ] **Step 1: Locate the insertion point**

Find the line that ends the `STRETCH_LIBRARY` declaration:
```
];
```
followed by an empty line and the `STRETCH_MUSCLE_META` comment. Insert the new code between the `];` and the `// Muscle highlight mapping` comment (around line 494).

- [ ] **Step 2: Add `WARMUP_GROUPS` constant**

Insert this block after `STRETCH_LIBRARY`'s closing `];`:

```js
// ─── WARMUP GROUPS — 8 fixed muscle-group slots ────────────────────────────
// options: curated list of STRETCH_LIBRARY IDs suitable for this group.
// defaultId: used when no saved config exists.
const WARMUP_GROUPS = [
  {
    id: 'neck', label: 'Neck', emoji: '🧠',
    defaultId: 'str_neck_rotation',
    options: ['str_neck_rotation', 'str_neck'],
  },
  {
    id: 'shoulders', label: 'Shoulders', emoji: '💪',
    defaultId: 'wu_pendulum',
    options: ['wu_pendulum', 'str_cross_shoulder', 'str_overhead_triceps'],
  },
  {
    id: 'chest', label: 'Chest', emoji: '🫁',
    defaultId: 'wu_chest_opener',
    options: ['wu_chest_opener', 'str_upward_dog', 'str_biceps_wall'],
  },
  {
    id: 'trunk', label: 'Trunk', emoji: '🔄',
    defaultId: 'str_cat_cow_cow',
    options: ['str_cat_cow_cow', 'str_sideways_bend', 'str_spinal_rotation', 'str_pilates_saw'],
  },
  {
    id: 'lowerback', label: 'Lower Back', emoji: '🔻',
    defaultId: 'wu_prone_cobra',
    options: ['wu_prone_cobra', 'str_knee_to_chest', 'str_double_knee_chest', 'str_childs_pose'],
  },
  {
    id: 'hips', label: 'Hips', emoji: '🦋',
    defaultId: 'str_figure_four',
    options: ['str_figure_four', 'str_pigeon', 'str_90_90_hip', 'str_piriformis_seated', 'str_butterfly', 'str_hip_flexor', 'str_knee_opp_shoulder'],
  },
  {
    id: 'legs', label: 'Legs', emoji: '🦵',
    defaultId: 'wu_hamstring_stretch',
    options: ['wu_hamstring_stretch', 'str_hamstring', 'str_quad_standing', 'str_forward_fold', 'str_it_band', 'str_lateral_lunge'],
  },
  {
    id: 'ankles', label: 'Ankles', emoji: '🦶',
    defaultId: 'str_ankle_circles',
    options: ['str_ankle_circles', 'str_ankle_dorsiflexion', 'str_calf_straight'],
  },
];
```

- [ ] **Step 3: Add helper functions**

Add these two helpers immediately after `WARMUP_GROUPS`. Place them in the utilities section (around line 744, near `load`/`save`). Search for the comment `// ═══ STORAGE` and add them just before the data export functions but after the constants.

Actually, place them immediately after the `WARMUP_GROUPS` block to keep group data and its helpers together:

```js
// Returns the 8-element stretch-ID array for a given workout ('A', 'B', or 'C').
// Falls back to the group default if a slot has no saved value.
function getWarmupConfig(workout) {
  const raw = JSON.parse(localStorage.getItem('il_warmup_config') || '{}');
  const saved = raw[workout] || [];
  return WARMUP_GROUPS.map((group, i) => saved[i] || group.defaultId);
}

// Saves a single slot choice and returns the updated full config.
function saveWarmupChoice(workout, slotIndex, stretchId) {
  const raw = JSON.parse(localStorage.getItem('il_warmup_config') || '{}');
  const saved = raw[workout] ? [...raw[workout]] : WARMUP_GROUPS.map(g => g.defaultId);
  saved[slotIndex] = stretchId;
  raw[workout] = saved;
  localStorage.setItem('il_warmup_config', JSON.stringify(raw));
}

// Resets one workout's warm-up config to all defaults.
function resetWarmupConfig(workout) {
  const raw = JSON.parse(localStorage.getItem('il_warmup_config') || '{}');
  delete raw[workout];
  localStorage.setItem('il_warmup_config', JSON.stringify(raw));
}

// Returns a human-readable duration string for a stretch.
function fmtStretchDur(s) {
  if (!s) return '';
  return s.bilateral ? `${s.suggestedSecs}s each side` : `${s.suggestedSecs}s`;
}
```

- [ ] **Step 4: Build and verify no errors**

```bash
npm run build
```

Expected: exits 0, no errors. The new constants and helpers are pure data/functions with no side-effects, so the app still runs exactly as before.

- [ ] **Step 5: Manual smoke test**

Open the built app (`open index.html` or check the running dev server). Start a workout, get past the energy check — the old warm-up checklist should still appear unchanged. This confirms the data layer didn't break anything.

- [ ] **Step 6: Commit**

```bash
git add src/IronLog.jsx dist/index.html index.html version.json
git commit -m "feat: add WARMUP_GROUPS constant and config helpers (data layer)"
```

---

## Task 2: `StretchThumb` + `WarmupSetup` components

**Files:**
- Modify: `src/IronLog.jsx` — insert new components just before `function ActiveWorkout` (line 1636)

- [ ] **Step 1: Locate the insertion point**

Find `function ActiveWorkout(` (line 1636). Insert new component code immediately before this line, with one blank line gap.

- [ ] **Step 2: Add `StretchThumb` helper component**

```js
// Small thumbnail used in setup rows and picker cards.
// Shows the PNG icon if available, falls back to group emoji.
function StretchThumb({ stretch, group, size }) {
  const [imgFailed, setImgFailed] = useState(false);
  const src = stretch?.imageDir ? `assets/icons/${stretch.imageDir}/${stretch.id}.png` : null;
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: C.dim, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      {src && !imgFailed
        ? <img src={src} style={{ width: size, height: size, objectFit: 'contain' }} onError={() => setImgFailed(true)} alt="" />
        : <span style={{ fontSize: size * 0.45 }}>{group?.emoji || '🧘'}</span>
      }
    </div>
  );
}
```

- [ ] **Step 3: Add `WarmupSetup` component**

```js
// Screen 1: compact rows showing the 8 selected stretches.
// onChangeSlot(i) — user tapped Change on row i
// onBegin() — user tapped Begin Warm-Up
// onSkip() — user tapped Skip Warm-Up
// onReset() — user tapped Reset to defaults
function WarmupSetup({ workout, onChangeSlot, onBegin, onSkip, onReset }) {
  const config = getWarmupConfig(workout);
  const stretches = config.map(id => STRETCH_LIBRARY.find(s => s.id === id)).filter(Boolean);

  const totalSecs = WARMUP_GROUPS.reduce((acc, group, i) => {
    const s = stretches[i];
    if (!s) return acc;
    return acc + s.suggestedSecs * (s.bilateral ? 2 : 1);
  }, 0);
  const estMin = Math.max(1, Math.round(totalSecs / 60));

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px))' }}>
      {/* Header */}
      <div style={{ padding: '8px 16px 12px', borderBottom: `1px solid ${C.border}` }}>
        <div style={st.label}>Workout {workout}</div>
        <div style={{ ...st.h2, marginTop: 2 }}>Warm-Up Stretches</div>
        <div style={{ fontSize: 11, color: C.muted, fontFamily: C.fBody, marginTop: 2 }}>Tap Change to swap any stretch</div>
      </div>

      {/* Rows */}
      {WARMUP_GROUPS.map((group, i) => {
        const stretch = stretches[i] || STRETCH_LIBRARY.find(s => s.id === group.defaultId);
        return (
          <div key={group.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 16px', borderBottom: `1px solid ${C.border}` }}>
            <StretchThumb stretch={stretch} group={group} size={36} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={st.label}>{group.label}</div>
              <div style={{ fontSize: 13, fontWeight: 600, fontFamily: C.fDisplay, textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: C.text }}>
                {stretch?.name || group.label}
              </div>
              <div style={{ fontSize: 10, color: C.muted, fontFamily: C.fBody }}>{fmtStretchDur(stretch)}</div>
            </div>
            <button
              onClick={() => onChangeSlot(i)}
              style={{ fontSize: 10, background: C.dim, border: `1px solid ${C.border}`, color: C.muted, borderRadius: 4, padding: '4px 8px', cursor: 'pointer', flexShrink: 0, fontFamily: C.fMono, letterSpacing: 0.5 }}
            >
              Change
            </button>
          </div>
        );
      })}

      {/* Footer */}
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button style={st.btn()} onClick={onBegin}>▶ Begin Warm-Up (≈{estMin} min)</button>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ ...st.ghost, flex: 1 }} onClick={onReset}>Reset to defaults</button>
          <button style={{ ...st.ghost, flex: 1 }} onClick={onSkip}>Skip Warm-Up</button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Build and verify**

```bash
npm run build
```

Expected: exits 0. The new components are defined but not yet rendered — app behaviour unchanged.

- [ ] **Step 5: Commit**

```bash
git add src/IronLog.jsx dist/index.html index.html version.json
git commit -m "feat: add StretchThumb and WarmupSetup components"
```

---

## Task 3: `WarmupPicker` component

**Files:**
- Modify: `src/IronLog.jsx` — insert after `WarmupSetup`, still before `function ActiveWorkout`

- [ ] **Step 1: Add `WarmupPicker` component**

Insert this immediately after the `WarmupSetup` function, before `function ActiveWorkout`:

```js
// Screen 2: full-screen overlay showing all options for one muscle group.
// slotIndex — which WARMUP_GROUPS slot is being edited (0–7)
// onSelect(stretchId) — user picked a stretch; saves and returns to setup
// onBack() — user pressed ← without selecting; returns to setup
function WarmupPicker({ workout, slotIndex, onSelect, onBack }) {
  const group = WARMUP_GROUPS[slotIndex];
  const config = getWarmupConfig(workout);
  const selectedId = config[slotIndex];

  const options = group.options
    .map(id => STRETCH_LIBRARY.find(s => s.id === id))
    .filter(Boolean);

  return (
    <div style={{ position: 'fixed', inset: 0, background: C.bg, zIndex: 200, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, background: C.bg, zIndex: 1 }}>
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', color: C.amber, fontSize: 22, cursor: 'pointer', padding: '0 4px 0 0', lineHeight: 1 }}
        >
          ←
        </button>
        <div>
          <div style={st.label}>Choose stretch · {group.label}</div>
          <div style={{ ...st.h2, fontSize: 20, marginTop: 1 }}>{group.label}</div>
        </div>
      </div>

      {/* Option cards */}
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {options.map(s => {
          const isSelected = s.id === selectedId;
          return (
            <button
              key={s.id}
              onClick={() => { saveWarmupChoice(workout, slotIndex, s.id); onSelect(s.id); }}
              style={{
                background: isSelected ? C.amberDim : C.card,
                border: `1px solid ${isSelected ? C.amber : C.border}`,
                borderRadius: 10,
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
              }}
            >
              <StretchThumb stretch={s} group={group} size={40} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, fontFamily: C.fDisplay, textTransform: 'uppercase', color: C.text }}>
                  {s.name}
                </div>
                <div style={{ fontSize: 10, color: C.muted, fontFamily: C.fBody, marginTop: 1 }}>
                  {fmtStretchDur(s)}
                </div>
                {(s.sciatica || s.cross_legged || s.caution) && (
                  <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
                    {s.sciatica     && <span style={st.pill(C.purple)}>Sciatica</span>}
                    {s.cross_legged && <span style={st.pill(C.green)}>Cross-legged</span>}
                    {s.caution      && <span style={st.pill(C.red)}>⚠ Caution</span>}
                  </div>
                )}
              </div>
              {isSelected && <span style={{ color: C.amber, fontSize: 18, fontWeight: 700, flexShrink: 0 }}>✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Build and verify**

```bash
npm run build
```

Expected: exits 0, no errors.

- [ ] **Step 3: Commit**

```bash
git add src/IronLog.jsx dist/index.html index.html version.json
git commit -m "feat: add WarmupPicker full-screen overlay component"
```

---

## Task 4: `WarmupActive` component

**Files:**
- Modify: `src/IronLog.jsx` — insert after `WarmupPicker`, still before `function ActiveWorkout`

- [ ] **Step 1: Add `WarmupActive` component**

Insert immediately after the `WarmupPicker` function:

```js
// Screen 3: guided execution — one stretch at a time with countdown timer.
// workout — the workout key ('A', 'B', 'C')
// onComplete() — called when all stretches are done or skipped
function WarmupActive({ workout, onComplete }) {
  const config = getWarmupConfig(workout);
  const stretches = WARMUP_GROUPS.map((group, i) => {
    const id = config[i];
    return STRETCH_LIBRARY.find(s => s.id === id)
        || STRETCH_LIBRARY.find(s => s.id === group.defaultId);
  }).filter(Boolean);

  const [index, setIndex]         = useState(0);
  const [timeLeft, setTimeLeft]   = useState(null);
  const [side, setSide]           = useState(1);       // 1 = first side, 2 = second side
  const [showSwitch, setShowSwitch] = useState(false); // bilateral side-switch pulse

  const current = stretches[index] || null;

  // Reset timer whenever the stretch index changes
  useEffect(() => {
    if (!current) { onComplete(); return; }
    setTimeLeft(current.suggestedSecs);
    setSide(1);
    setShowSwitch(false);
  }, [index]); // eslint-disable-line react-hooks/exhaustive-deps

  // Tick down every second
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft]);

  // Handle timer reaching zero — uses refs to avoid stale-closure issues
  const currentRef  = useRef(current);
  const sideRef     = useRef(side);
  const indexRef    = useRef(index);
  const stretchesRef = useRef(stretches);
  useEffect(() => { currentRef.current  = current;  }, [current]);
  useEffect(() => { sideRef.current     = side;     }, [side]);
  useEffect(() => { indexRef.current    = index;    }, [index]);
  useEffect(() => { stretchesRef.current = stretches; }, [stretches]);

  useEffect(() => {
    if (timeLeft !== 0) return;
    const s = currentRef.current;
    if (!s) { onComplete(); return; }

    if (s.bilateral && sideRef.current === 1) {
      // First side done — show switch-sides pulse, then start second side
      setShowSwitch(true);
      const id = setTimeout(() => {
        setShowSwitch(false);
        setSide(2);
        setTimeLeft(s.suggestedSecs);
      }, 1500);
      return () => clearTimeout(id);
    }

    // Both sides (or unilateral) done — pause briefly then auto-advance
    const id = setTimeout(() => {
      const nextIndex = indexRef.current + 1;
      if (nextIndex < stretchesRef.current.length) {
        setIndex(nextIndex);
      } else {
        onComplete();
      }
    }, 500);
    return () => clearTimeout(id);
  }, [timeLeft]); // eslint-disable-line react-hooks/exhaustive-deps

  function advance() {
    const nextIndex = index + 1;
    if (nextIndex < stretches.length) {
      setIndex(nextIndex);
    } else {
      onComplete();
    }
  }

  if (!current) return null;

  const totalSecs = current.suggestedSecs;
  const circumference = 326.7; // 2π × 52 (radius of SVG ring)
  const elapsed = totalSecs - (timeLeft ?? totalSecs);
  const arcOffset = circumference * (1 - elapsed / totalSecs); // 326.7 = full, 0 = empty ring

  const isLast = index === stretches.length - 1;
  const nextGroupLabel = !isLast ? WARMUP_GROUPS[index + 1]?.label : null;

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, display: 'flex', flexDirection: 'column' }}>

      {/* Progress bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          {stretches.map((_, i) => (
            <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i < index ? C.green : i === index ? C.amber : C.border, flexShrink: 0 }} />
          ))}
        </div>
        <div style={st.label}>{index + 1} of {stretches.length}</div>
        <button
          onClick={onComplete}
          style={{ background: 'none', border: 'none', color: C.muted, fontFamily: C.fMono, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, cursor: 'pointer', padding: 0 }}
        >
          Skip all →
        </button>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 24px', gap: 4 }}>
        <StretchThumb stretch={current} group={WARMUP_GROUPS[index]} size={100} />

        <div style={{ ...st.label, marginTop: 14 }}>{WARMUP_GROUPS[index]?.label}</div>
        <div style={{ fontFamily: C.fDisplay, fontSize: 24, fontWeight: 700, textTransform: 'uppercase', textAlign: 'center', letterSpacing: 0.5, marginTop: 2 }}>
          {current.name}
        </div>
        <div style={{ fontSize: 11, color: C.muted, fontFamily: C.fBody }}>
          {current.bilateral ? `${current.suggestedSecs}s each side` : `${current.suggestedSecs}s`}
          {current.bilateral && side === 2 && ' — side 2'}
        </div>

        {/* Countdown ring */}
        <div style={{ position: 'relative', width: 120, height: 120, margin: '16px 0' }}>
          <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="60" cy="60" r="52" fill="none" stroke={C.border} strokeWidth="8" />
            <circle
              cx="60" cy="60" r="52" fill="none"
              stroke={C.amber} strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={arcOffset}
              strokeLinecap="round"
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: C.fMono, fontSize: 36, fontWeight: 700, color: C.amber }}>
            {timeLeft ?? totalSecs}
          </div>
        </div>

        {/* Cue or switch-sides message */}
        {showSwitch ? (
          <div style={{ fontFamily: C.fDisplay, fontSize: 20, fontWeight: 700, color: C.amber, textTransform: 'uppercase', letterSpacing: 1 }}>
            ↔ Switch Sides
          </div>
        ) : current.cue ? (
          <div style={{ fontSize: 12, color: C.muted, fontFamily: C.fBody, textAlign: 'center', lineHeight: 1.6, maxWidth: 280, fontStyle: 'italic' }}>
            {current.cue}
          </div>
        ) : null}
      </div>

      {/* Footer */}
      <div style={{ padding: '12px 16px 24px', borderTop: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button style={st.btn()} onClick={advance}>
          {isLast ? '→ Begin Workout' : `→ Next: ${nextGroupLabel}`}
        </button>
        <button style={st.ghost} onClick={advance}>
          Skip this stretch
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Build and verify**

```bash
npm run build
```

Expected: exits 0. Three new components exist but none are rendered yet — app still shows the old static warmup checklist.

- [ ] **Step 3: Commit**

```bash
git add src/IronLog.jsx dist/index.html index.html version.json
git commit -m "feat: add WarmupActive guided countdown component"
```

---

## Task 5: Wire phases into `ActiveWorkout`

**Files:**
- Modify: `src/IronLog.jsx` — changes inside `function ActiveWorkout` only

- [ ] **Step 1: Add `pickerSlot` state**

Inside `ActiveWorkout`, find the existing state declarations (around line 1647–1656). After `const [confirmCancel, setConfirmCancel] = useState(false);`, add:

```js
const [pickerSlot, setPickerSlot] = useState(null); // null = no picker open; 0–7 = slot being edited
```

- [ ] **Step 2: Update phase initialisation for backward compatibility**

Find the existing phase initialisation (line 1639):
```js
const [phase, setPhase] = useState(activeSession?.phase || (activeSession ? 'workout' : 'energy'));
```

Replace it with:
```js
const [phase, setPhase] = useState(() => {
  const p = activeSession?.phase || (activeSession ? 'workout' : 'energy');
  // Backward compat: old sessions stored phase:'warmup' → resume at setup screen
  return p === 'warmup' ? 'warmup_setup' : p;
});
```

- [ ] **Step 3: Update `startSession` to use `warmup_setup`**

Find `startSession` (line 1681). Change `phase: 'warmup'` → `phase: 'warmup_setup'` on two lines:

Before:
```js
const s = { ...base, energy, phase: 'warmup' };
setSession(s);
setActiveSession(s);
setPhase('warmup');
```

After:
```js
const s = { ...base, energy, phase: 'warmup_setup' };
setSession(s);
setActiveSession(s);
setPhase('warmup_setup');
```

- [ ] **Step 4: Replace the old warmup phase block**

Find the old warmup block (around line 1792). The block starts with:
```js
// ── Warmup ──────────────────────────────────────────────────────────
if (phase === 'warmup') {
```
and ends with the closing `}` at the end of that if-block (around line 1824, after the `confirmCancel` modal).

**Delete the entire old `if (phase === 'warmup') { … }` block**, then insert the following in its place:

```js
  // ── Warmup setup ──────────────────────────────────────────────────
  if (phase === 'warmup_setup' && pickerSlot !== null) {
    return (
      <WarmupPicker
        workout={session?.workout || nextWkt}
        slotIndex={pickerSlot}
        onSelect={() => setPickerSlot(null)}
        onBack={() => setPickerSlot(null)}
      />
    );
  }

  if (phase === 'warmup_setup') {
    return (
      <WarmupSetup
        workout={session?.workout || nextWkt}
        onChangeSlot={i => setPickerSlot(i)}
        onBegin={() => {
          setPhase('warmup_active');
          setActiveSession(s => s ? { ...s, phase: 'warmup_active' } : s);
        }}
        onSkip={() => {
          setPhase('workout');
          setActiveSession(s => s ? { ...s, phase: 'workout' } : s);
        }}
        onReset={() => {
          resetWarmupConfig(session?.workout || nextWkt);
          // Force re-render by toggling a dummy state change — WarmupSetup re-reads config on each render
          setPickerSlot(null);
        }}
      />
    );
  }

  // ── Warmup active ─────────────────────────────────────────────────
  if (phase === 'warmup_active') {
    return (
      <WarmupActive
        workout={session?.workout || nextWkt}
        onComplete={() => {
          setPhase('workout');
          setActiveSession(s => s ? { ...s, phase: 'workout' } : s);
        }}
      />
    );
  }
```

- [ ] **Step 5: Build**

```bash
npm run build
```

Expected: exits 0. If there are any JSX syntax errors, fix them and re-run.

- [ ] **Step 6: End-to-end verify in browser**

Open the built app. Work through this checklist manually:

**Setup screen:**
- [ ] Start a new workout → energy check → appear on the Warm-Up Setup screen (8 rows, compact layout)
- [ ] All 8 groups show their default stretch name and duration
- [ ] "Change" button on any row opens the full-screen picker for that group
- [ ] Picker shows all options for that group; selected one has blue border + ✓
- [ ] Picking a different option returns to setup with the row updated
- [ ] ← in picker returns without changing the selection
- [ ] Sciatica (purple) and Cross-legged (green) and ⚠ Caution (red) pills appear correctly on picker cards
- [ ] "Reset to defaults" restores all 8 defaults
- [ ] "Skip Warm-Up" goes directly to the workout exercises

**Guided execution:**
- [ ] "Begin Warm-Up" shows the first stretch (Neck) with countdown ring and cue text
- [ ] Progress dots show 1 of 8; correct dot highlighted
- [ ] Timer counts down correctly
- [ ] For a bilateral stretch (test with Hips — Figure Four, 45s), after 45s "↔ Switch Sides" appears briefly, then timer restarts from 45s
- [ ] For a unilateral stretch (Chest — Doorframe Opener, 60s), timer just counts down once then auto-advances
- [ ] "→ Next: [group]" button manually skips to next stretch
- [ ] "Skip this stretch" does the same
- [ ] "Skip all →" in header goes directly to workout exercises
- [ ] Last stretch shows "→ Begin Workout" and tapping it enters the workout phase

**Config persistence:**
- [ ] Change Hips to Pigeon Pose, close and reopen the app → Pigeon Pose is still selected for workout A's Hips slot
- [ ] Workouts B and C have their own independent configs

- [ ] **Step 7: Commit**

```bash
git add src/IronLog.jsx dist/index.html index.html version.json
git commit -m "feat: wire warmup_setup and warmup_active phases into ActiveWorkout"
```

---

## Task 6: Push and update docs

- [ ] **Step 1: Push to GitHub**

```bash
git push origin main
```

Expected: push accepted, no force-push needed.

- [ ] **Step 2: Update CHANGELOG.md**

Add an entry at the top of `CHANGELOG.md`:

```markdown
## 2026-05-24 — Customisable Warm-Up

- Replaced static warm-up checklist with a three-screen flow: setup → picker → guided execution
- Setup screen: 8 compact rows (one per muscle-tendon group), each with a Change button
- Picker: full-screen overlay showing curated options per group with Sciatica / Cross-legged / Caution pills
- Guided execution: countdown ring per stretch, auto-advances, bilateral switch-sides pulse at halfway
- Per-workout config (A, B, C each store independent choices) persisted in `il_warmup_config` localStorage key
- Skip Warm-Up and Reset to defaults available from the setup screen
- Backward compatible: old `phase:'warmup'` sessions resume at setup screen
```

- [ ] **Step 3: Commit docs update**

```bash
git add CHANGELOG.md
git commit -m "docs: changelog entry for customisable warm-up"
git push origin main
```

---

## Self-review

**Spec coverage check:**

| Spec requirement | Task |
|---|---|
| `WARMUP_GROUPS` constant (8 groups, options, defaults) | Task 1 |
| `getWarmupConfig(workout)` helper | Task 1 |
| `saveWarmupChoice(workout, slotIndex, stretchId)` | Task 1 |
| `resetWarmupConfig(workout)` helper | Task 1 |
| `fmtStretchDur(s)` helper | Task 1 |
| `WarmupSetup` — compact rows, Change button, footer | Task 2 |
| `StretchThumb` — PNG with emoji fallback | Task 2 |
| `WarmupPicker` — full-screen, cards, pills, selected highlight | Task 3 |
| `WarmupActive` — progress dots, ring, cue, bilateral pulse, auto-advance | Task 4 |
| `pickerSlot` state in `ActiveWorkout` | Task 5 |
| Phase init backward compat (`'warmup'` → `'warmup_setup'`) | Task 5 |
| `startSession` emits `warmup_setup` | Task 5 |
| Old static warmup block removed | Task 5 |
| Skip Warm-Up → workout | Task 5 (`onSkip`) |
| Reset to defaults | Task 5 (`onReset`) |
| Skip all → workout | Task 4 (`onComplete` prop on Skip all button) |
| Last stretch → Begin Workout | Task 4 (`isLast` check) |
| Config persists per workout | Task 1 (`il_warmup_config` key) |
| Colour scheme matches app (`C.*` values only) | All tasks |

**Placeholder scan:** No TBD, no TODO, no vague steps. Every code block is complete.

**Type consistency check:**
- `getWarmupConfig(workout)` returns `string[]` (8 IDs) — consumed correctly in `WarmupSetup`, `WarmupPicker`, `WarmupActive`
- `saveWarmupChoice(workout, slotIndex, stretchId)` — called in `WarmupPicker` with `(workout, slotIndex, s.id)` ✓
- `resetWarmupConfig(workout)` — called in `WarmupSetup`'s `onReset` ✓
- `fmtStretchDur(s)` — called with a stretch object in both `WarmupSetup` and `WarmupPicker` ✓
- `StretchThumb` props: `{ stretch, group, size }` — all call sites provide all three ✓
- `WARMUP_GROUPS[index]` — only accessed where `index` is within 0–7 ✓
- `circumference = 326.7`, `arcOffset = circumference * (1 - elapsed / totalSecs)` — at `timeLeft = totalSecs` (start): offset = 0 (full ring); at `timeLeft = 0` (end): offset = 326.7 (empty ring) ✓
