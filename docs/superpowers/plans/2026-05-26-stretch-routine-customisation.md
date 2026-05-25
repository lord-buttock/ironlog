# Customisable Stretch Routine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static full-body flexibility routine with a three-screen customisable flow — Setup (12 rows with Change buttons), Picker overlay, and Guided execution with countdown timer and bilateral auto-advance — matching the warm-up UX exactly.

**Architecture:** All changes are in `src/IronLog.jsx`. A new `STRETCH_GROUPS` constant (12 slots) mirrors `WARMUP_GROUPS`. Three new components (`StretchSetup`, `StretchPicker`, `StretchActive`) replace the existing `ActiveStretch`. `StretchSetup` manages picker state internally (no parent like ActiveWorkout needed). The Dashboard accordion is replaced with a simple card. Config persisted in `il_stretch_config` localStorage key (single 12-element array, not per-workout).

**Tech Stack:** React 18 (UMD CDN globals — `useState`, `useEffect`, `useRef`; no imports), JSX pre-compiled with `npm run build` (writes both `dist/index.html` and root `index.html`), localStorage persistence.

**Reusable helpers already in the file:**
- `StretchThumb` component (~line 1715) — reuse in StretchSetup and StretchActive
- `fmtStretchDur(stretch)` function (~line 566) — reuse in StretchSetup and StretchPicker
- `STRETCH_LIBRARY` array — source of stretch definitions for all three screens

**ID corrections** (spec doc had wrong IDs — use these):
- Hamstrings option: `str_nerve_glide_supine` (not `str_sciatic_nerve_glide`)
- Spine/Rotation option: `str_trunk_rotations` (not `str_lower_trunk_rotations`)
- Lower Back option: `str_spine_twist` (not `str_lying_spine_twist`)

---

### Task 1: Add STRETCH_GROUPS constant and helper functions

**Files:**
- Modify: `src/IronLog.jsx` — after the closing `}` of `resetWarmupConfig` (~line 562)

- [ ] **Step 1: Insert STRETCH_GROUPS and helpers**

Find `function resetWarmupConfig(workout) {` in `src/IronLog.jsx`. After its closing `}`, insert:

```js
// ─── STRETCH ROUTINE GROUPS ───────────────────────────────────────────────
// 12 slots matching the current STRETCHES order. Each slot has a curated
// options list from STRETCH_LIBRARY. Single global config — not per-workout.
const STRETCH_GROUPS = [
  {
    id: 'neck', label: 'Neck', emoji: '🧠',
    defaultId: 'str_neck',
    options: ['str_neck', 'str_neck_rotation'],
  },
  {
    id: 'shoulders', label: 'Shoulders', emoji: '💪',
    defaultId: 'str_cross_shoulder',
    options: ['str_cross_shoulder', 'str_overhead_triceps', 'wu_pendulum'],
  },
  {
    id: 'chest', label: 'Chest', emoji: '🫁',
    defaultId: 'str_pec_roller_t',
    options: ['str_pec_roller_t', 'wu_chest_opener', 'str_upward_dog', 'str_biceps_wall'],
  },
  {
    id: 'upperback', label: 'Upper Back', emoji: '🔙',
    defaultId: 'str_upper_back_roller',
    options: ['str_upper_back_roller', 'wu_prone_cobra'],
  },
  {
    id: 'trunk', label: 'Trunk', emoji: '🔄',
    defaultId: 'str_cat_cow_cow',
    options: ['str_cat_cow_cow', 'str_sideways_bend', 'str_pilates_saw'],
  },
  {
    id: 'lowerback', label: 'Lower Back', emoji: '🔻',
    defaultId: 'str_childs_pose',
    options: ['str_childs_pose', 'str_knee_to_chest', 'str_double_knee_chest', 'str_spine_twist'],
  },
  {
    id: 'spine', label: 'Spine / Rotation', emoji: '🌀',
    defaultId: 'str_spinal_rotation',
    options: ['str_spinal_rotation', 'str_trunk_rotations', 'str_pilates_saw'],
  },
  {
    id: 'hipflexors', label: 'Hip Flexors', emoji: '🏃',
    defaultId: 'str_hip_flexor',
    options: ['str_hip_flexor', 'str_90_90_hip', 'str_lateral_lunge', 'str_deep_squat'],
  },
  {
    id: 'hips', label: 'Hips / Glutes', emoji: '🦋',
    defaultId: 'str_figure_four',
    options: ['str_figure_four', 'str_pigeon', 'str_piriformis_seated', 'str_butterfly', 'str_knee_opp_shoulder'],
  },
  {
    id: 'hamstrings', label: 'Hamstrings', emoji: '🦵',
    defaultId: 'str_hamstring',
    options: ['str_hamstring', 'wu_hamstring_stretch', 'str_forward_fold', 'str_nerve_glide_supine'],
  },
  {
    id: 'itband', label: 'IT Band', emoji: '🦴',
    defaultId: 'str_it_band',
    options: ['str_it_band', 'str_lateral_lunge'],
  },
  {
    id: 'calves', label: 'Calves / Ankles', emoji: '🦶',
    defaultId: 'str_calf_straight',
    options: ['str_calf_straight', 'str_ankle_circles', 'str_ankle_dorsiflexion'],
  },
];

// Returns the 12-element stretch-ID array for the routine.
// Falls back to each group's defaultId for any unset slot.
function getStretchConfig() {
  const raw = JSON.parse(localStorage.getItem('il_stretch_config') || '[]');
  return STRETCH_GROUPS.map((group, i) => raw[i] || group.defaultId);
}

// Saves a single slot choice to il_stretch_config.
function saveStretchChoice(slotIndex, stretchId) {
  const raw = JSON.parse(localStorage.getItem('il_stretch_config') || '[]');
  const saved = Array.isArray(raw) && raw.length === 12
    ? [...raw]
    : STRETCH_GROUPS.map(g => g.defaultId);
  saved[slotIndex] = stretchId;
  localStorage.setItem('il_stretch_config', JSON.stringify(saved));
}

// Clears the stretch config — next load will use all defaults.
function resetStretchConfig() {
  localStorage.removeItem('il_stretch_config');
}
```

- [ ] **Step 2: Build and verify**

```bash
cd "/Users/phillcantone/Library/Mobile Documents/com~apple~CloudDocs/Family/Phill/AI Coding/IRONLOG"
npm run build
```

Expected: Build completes with no errors. Output ends with the build success message.

- [ ] **Step 3: Commit**

```bash
cd "/Users/phillcantone/Library/Mobile Documents/com~apple~CloudDocs/Family/Phill/AI Coding/IRONLOG"
git add src/IronLog.jsx
git commit -m "feat: add STRETCH_GROUPS constant and getStretchConfig/saveStretchChoice/resetStretchConfig helpers"
```

---

### Task 2: Add StretchPicker component

Full-screen overlay for selecting an alternative stretch for one slot. Mirrors `WarmupPicker` exactly, using `STRETCH_GROUPS`, `STRETCH_LIBRARY`, and the already-existing `StretchThumb`, `fmtStretchDur`, and `st.pill` helpers.

**Files:**
- Modify: `src/IronLog.jsx` — insert after the closing `}` of `WarmupActive` (~line 2060)

- [ ] **Step 1: Insert StretchPicker**

Find the closing `}` of `WarmupActive`. Insert immediately after it:

```jsx
// ═══════════════════════════════════════════════════════════════════════
// STRETCH ROUTINE — Screen 2: full-screen picker for one slot
// ═══════════════════════════════════════════════════════════════════════
// group     — the STRETCH_GROUPS entry for the slot being edited
// currentId — currently selected stretch ID for this slot
// onSelect(stretchId) — user picked a stretch; caller saves and closes
// onBack()  — user pressed ← without selecting; closes overlay
function StretchPicker({ group, currentId, onSelect, onBack }) {
  const options = group.options
    .map(id => STRETCH_LIBRARY.find(s => s.id === id))
    .filter(Boolean);

  return (
    <div style={{ position: 'fixed', inset: 0, background: C.bg, zIndex: 200, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      {/* Sticky header */}
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
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px))' }}>
        {options.map(s => {
          const isSelected = s.id === currentId;
          return (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
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
cd "/Users/phillcantone/Library/Mobile Documents/com~apple~CloudDocs/Family/Phill/AI Coding/IRONLOG"
npm run build
```

Expected: Build completes with no errors.

- [ ] **Step 3: Commit**

```bash
cd "/Users/phillcantone/Library/Mobile Documents/com~apple~CloudDocs/Family/Phill/AI Coding/IRONLOG"
git add src/IronLog.jsx
git commit -m "feat: add StretchPicker component"
```

---

### Task 3: Add StretchSetup component

Setup screen showing all 12 stretch rows. Manages its own picker overlay state — when a Change button is tapped, it renders `StretchPicker` as a `position: fixed` overlay, then closes it and updates the row on selection.

**Files:**
- Modify: `src/IronLog.jsx` — insert immediately after the closing `}` of `StretchPicker` (added in Task 2)

- [ ] **Step 1: Insert StretchSetup**

Find the closing `}` of `StretchPicker`. Insert immediately after it:

```jsx
// ═══════════════════════════════════════════════════════════════════════
// STRETCH ROUTINE — Screen 1: setup (review and customise 12 slots)
// ═══════════════════════════════════════════════════════════════════════
// onBegin() — user tapped Begin Stretching → navigate to StretchActive
// onSkip()  — user tapped Skip → navigate back to dashboard
function StretchSetup({ onBegin, onSkip }) {
  const [config, setConfig] = useState(() => getStretchConfig());
  const [pickerSlot, setPickerSlot] = useState(null); // null = closed; 0–11 = slot being edited

  const totalSecs = STRETCH_GROUPS.reduce((acc, group, i) => {
    const s = STRETCH_LIBRARY.find(x => x.id === config[i]);
    if (!s) return acc;
    return acc + s.suggestedSecs * (s.bilateral ? 2 : 1);
  }, 0);
  const estMin = Math.max(1, Math.round(totalSecs / 60));

  const handleReset = () => {
    resetStretchConfig();
    setConfig(STRETCH_GROUPS.map(g => g.defaultId));
  };

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px))' }}>
      {/* Header */}
      <div style={{ padding: '8px 16px 12px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ ...st.h2, marginTop: 2 }}>Full-Body Flexibility</div>
        <div style={{ fontSize: 11, color: C.muted, fontFamily: C.fBody, marginTop: 2 }}>Tap Change to swap any stretch</div>
      </div>

      {/* Rows */}
      {STRETCH_GROUPS.map((group, i) => {
        const stretch = STRETCH_LIBRARY.find(s => s.id === config[i])
                     || STRETCH_LIBRARY.find(s => s.id === group.defaultId);
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
              onClick={() => setPickerSlot(i)}
              style={{ fontSize: 10, background: C.dim, border: `1px solid ${C.border}`, color: C.muted, borderRadius: 4, padding: '4px 8px', cursor: 'pointer', flexShrink: 0, fontFamily: C.fMono, letterSpacing: 0.5 }}
            >
              Change
            </button>
          </div>
        );
      })}

      {/* Footer */}
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button style={st.btn()} onClick={onBegin}>▶ Begin Stretching (≈{estMin} min)</button>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ ...st.ghost, flex: 1 }} onClick={handleReset}>Reset to defaults</button>
          <button style={{ ...st.ghost, flex: 1 }} onClick={onSkip}>Skip</button>
        </div>
      </div>

      {/* Picker overlay — position:fixed so it floats over everything */}
      {pickerSlot !== null && (
        <StretchPicker
          group={STRETCH_GROUPS[pickerSlot]}
          currentId={config[pickerSlot]}
          onSelect={id => {
            saveStretchChoice(pickerSlot, id);
            setConfig(c => c.map((x, j) => j === pickerSlot ? id : x));
            setPickerSlot(null);
          }}
          onBack={() => setPickerSlot(null)}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 2: Build and verify**

```bash
cd "/Users/phillcantone/Library/Mobile Documents/com~apple~CloudDocs/Family/Phill/AI Coding/IRONLOG"
npm run build
```

Expected: Build completes with no errors.

- [ ] **Step 3: Commit**

```bash
cd "/Users/phillcantone/Library/Mobile Documents/com~apple~CloudDocs/Family/Phill/AI Coding/IRONLOG"
git add src/IronLog.jsx
git commit -m "feat: add StretchSetup component with inline picker management"
```

---

### Task 4: Add StretchActive component

Guided execution screen. Mirrors `WarmupActive` exactly: 12 progress dots, SVG countdown ring, manual ▶ Start, bilateral side 1 → 1.5s Switch Sides → side 2 auto-starts, Skip all and Skip this stretch controls.

**Files:**
- Modify: `src/IronLog.jsx` — insert immediately after the closing `}` of `StretchSetup` (added in Task 3)

- [ ] **Step 1: Insert StretchActive**

Find the closing `}` of `StretchSetup`. Insert immediately after it:

```jsx
// ═══════════════════════════════════════════════════════════════════════
// STRETCH ROUTINE — Screen 3: guided execution with countdown timer
// ═══════════════════════════════════════════════════════════════════════
// onDone() — called when all stretches complete or user taps Skip all
function StretchActive({ onDone }) {
  // Build stretch list once on mount from saved config
  const stretchesRef = useRef(null);
  if (!stretchesRef.current) {
    stretchesRef.current = STRETCH_GROUPS.map((group, i) => {
      const id = getStretchConfig()[i];
      return STRETCH_LIBRARY.find(s => s.id === id)
          || STRETCH_LIBRARY.find(s => s.id === group.defaultId);
    }).filter(Boolean);
  }
  const stretches = stretchesRef.current;

  const [index, setIndex]           = useState(0);
  const [timeLeft, setTimeLeft]     = useState(null);
  const [side, setSide]             = useState(1);       // 1 = first side, 2 = second
  const [showSwitch, setShowSwitch] = useState(false);   // bilateral side-switch indicator
  const [running, setRunning]       = useState(false);   // timer ticks only when true

  const current = stretches[index] || null;

  // Reset to paused state whenever index changes
  useEffect(() => {
    if (!current) { onDone(); return; }
    setTimeLeft(current.suggestedSecs);
    setSide(1);
    setShowSwitch(false);
    setRunning(false);
  }, [index]); // eslint-disable-line react-hooks/exhaustive-deps

  // Tick down every second — only when running
  useEffect(() => {
    if (!running || timeLeft === null || timeLeft <= 0) return;
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, running]);

  // Refs to avoid stale closures in the at-zero handler
  const currentRef = useRef(current);
  const sideRef    = useRef(side);
  const indexRef   = useRef(index);
  useEffect(() => { currentRef.current = current; }, [current]);
  useEffect(() => { sideRef.current    = side;    }, [side]);
  useEffect(() => { indexRef.current   = index;   }, [index]);

  // Handle timer reaching zero — only fires when actively running
  useEffect(() => {
    if (!running || timeLeft !== 0) return;
    const s = currentRef.current;
    if (!s) { onDone(); return; }

    if (s.bilateral && sideRef.current === 1) {
      // Side 1 done — show Switch Sides for 1.5s then auto-start side 2
      setShowSwitch(true);
      setRunning(false);
      const switchId = setTimeout(() => {
        setShowSwitch(false);
        setSide(2);
        setTimeLeft(s.suggestedSecs);
        setRunning(true);
      }, 1500);
      return () => clearTimeout(switchId);
    }

    // Unilateral or side 2 done — 0.5s pause then advance (paused)
    const id = setTimeout(() => {
      const next = indexRef.current + 1;
      if (next < stretches.length) {
        setIndex(next);
      } else {
        onDone();
      }
    }, 500);
    return () => clearTimeout(id);
  }, [timeLeft, running]); // eslint-disable-line react-hooks/exhaustive-deps

  function advance() {
    const next = index + 1;
    if (next < stretches.length) {
      setIndex(next);
    } else {
      onDone();
    }
  }

  function startTimer() {
    setShowSwitch(false);
    setRunning(true);
  }

  if (!current) return null;

  const totalSecs     = current.suggestedSecs;
  const circumference = 326.7; // 2π × 52 (radius of the SVG ring)
  const elapsed       = totalSecs - (timeLeft ?? totalSecs);
  const arcOffset     = circumference * (elapsed / totalSecs);

  const isLast         = index === stretches.length - 1;
  const nextGroupLabel = !isLast ? STRETCH_GROUPS[index + 1]?.label : null;

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, display: 'flex', flexDirection: 'column', paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px))' }}>

      {/* Progress dots */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap' }}>
          {stretches.map((_, i) => (
            <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i < index ? C.green : i === index ? C.amber : C.border, flexShrink: 0 }} />
          ))}
        </div>
        <div style={st.label}>{index + 1} of {stretches.length}</div>
        <button
          onClick={onDone}
          style={{ background: 'none', border: 'none', color: C.muted, fontFamily: C.fMono, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, cursor: 'pointer', padding: 0 }}
        >
          Skip all →
        </button>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: '16px 24px 8px', gap: 2 }}>
        <StretchThumb stretch={current} group={STRETCH_GROUPS[index]} size={90} />

        <div style={{ ...st.label, marginTop: 10 }}>{STRETCH_GROUPS[index]?.label}</div>
        <div style={{ fontFamily: C.fDisplay, fontSize: 24, fontWeight: 700, textTransform: 'uppercase', textAlign: 'center', letterSpacing: 0.5, marginTop: 2 }}>
          {current.name}
        </div>
        <div style={{ fontSize: 11, color: C.muted, fontFamily: C.fBody }}>
          {current.bilateral ? `${current.suggestedSecs}s each side` : `${current.suggestedSecs}s`}
          {current.bilateral && side === 2 && ' — side 2'}
        </div>

        {/* Countdown ring */}
        <div style={{ position: 'relative', width: 120, height: 120, margin: '10px 0' }}>
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

        {/* Cue text or Switch Sides indicator */}
        {showSwitch ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18, fontWeight: 700 }}>✓</div>
            <div style={{ fontFamily: C.fDisplay, fontSize: 20, fontWeight: 700, color: C.green, textTransform: 'uppercase', letterSpacing: 1 }}>Switch Sides</div>
          </div>
        ) : current.cue ? (
          <div style={{ fontSize: 12, color: C.muted, fontFamily: C.fBody, textAlign: 'center', lineHeight: 1.6, maxWidth: 280, fontStyle: 'italic' }}>
            {current.cue}
          </div>
        ) : null}
      </div>

      {/* Footer — three states: paused / running / switch-sides window */}
      <div style={{ padding: '12px 16px 24px', borderTop: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {running ? (
          <>
            <button style={st.btn()} onClick={advance}>
              {isLast ? '→ Finish' : `→ Next: ${nextGroupLabel}`}
            </button>
            <button style={st.ghost} onClick={advance}>Skip this stretch</button>
          </>
        ) : showSwitch ? (
          <button style={st.ghost} onClick={advance}>
            {isLast ? 'Skip → Finish' : `Skip → ${nextGroupLabel || 'next'}`}
          </button>
        ) : (
          <>
            <button style={st.btn()} onClick={startTimer}>▶ Start</button>
            <button style={st.ghost} onClick={advance}>
              {isLast ? 'Skip → Finish' : `Skip → ${nextGroupLabel || 'next'}`}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Build and verify**

```bash
cd "/Users/phillcantone/Library/Mobile Documents/com~apple~CloudDocs/Family/Phill/AI Coding/IRONLOG"
npm run build
```

Expected: Build completes with no errors.

- [ ] **Step 3: Commit**

```bash
cd "/Users/phillcantone/Library/Mobile Documents/com~apple~CloudDocs/Family/Phill/AI Coding/IRONLOG"
git add src/IronLog.jsx
git commit -m "feat: add StretchActive component with countdown ring and bilateral auto-advance"
```

---

### Task 5: Wire into App, simplify Dashboard, remove ActiveStretch

Connect the three new components, simplify the Dashboard card (remove accordion + lightbox), delete the old `ActiveStretch` component, and do the final push.

**Files:**
- Modify: `src/IronLog.jsx` — four targeted edits

- [ ] **Step 1: Remove Dashboard accordion state**

Find these two lines in the `Dashboard` function body (~line 1237):
```js
const [showStretches, setShowStretches] = useState(false);
```
and (~line 1240):
```js
const [stretchDemoItem, setStretchDemoItem] = useState(null);
```
Delete both lines.

- [ ] **Step 2: Replace the stretch accordion card with a simple card**

Find the stretch card block. It starts with:
```jsx
<div style={{ ...st.card(), marginBottom: 16 }}>
  <button onClick={() => setShowStretches(v => !v)}
```
and ends after the `stretchDemoItem` lightbox closing tag (the `</div>` that closes the lightbox's outer `<div onClick={() => setStretchDemoItem(null)}`), just before the stats grid `<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr'`.

Replace that entire block (from the opening `<div style={{ ...st.card(), marginBottom: 16 }}>` through the closing `</div>` of the lightbox) with:

```jsx
{/* Stretch Routine card */}
<div style={{ ...st.card(), marginBottom: 16, padding: '14px 16px' }}>
  <div style={{ ...st.label, marginBottom: 4 }}>Stretch Routine</div>
  <div style={{ fontSize: 16, fontWeight: 700, fontFamily: C.fDisplay, textTransform: 'uppercase', marginBottom: 2 }}>Full-Body Flexibility</div>
  <div style={{ fontSize: 12, color: C.muted, fontFamily: C.fMono, marginBottom: 12 }}>12 stretches</div>
  <button style={{ ...st.ghost }} onClick={() => setView('stretch_setup')}>
    Start Stretching →
  </button>
</div>
```

- [ ] **Step 3: Update App view handler**

Find this line in the App render section (~line 4308):
```jsx
{view === 'stretch' && <ActiveStretch onDone={() => setView('dashboard')} />}
```

Replace it with:
```jsx
{(view === 'stretch' || view === 'stretch_setup') && (
  <StretchSetup
    onBegin={() => setView('stretch_active')}
    onSkip={() => setView('dashboard')}
  />
)}
{view === 'stretch_active' && (
  <StretchActive onDone={() => setView('dashboard')} />
)}
```

- [ ] **Step 4: Delete the old ActiveStretch component**

Find `function ActiveStretch({ onDone }) {` (~line 3940). Delete the entire function — from that line through its closing `}` (the one just before `function WarmupDemoModal`).

- [ ] **Step 5: Build and verify**

```bash
cd "/Users/phillcantone/Library/Mobile Documents/com~apple~CloudDocs/Family/Phill/AI Coding/IRONLOG"
npm run build
```

Expected: Build completes with no errors.

- [ ] **Step 6: Smoke test**

Open the built app in a browser. Verify:
1. Dashboard shows simplified stretch card with "Start Stretching →" button (no accordion)
2. Tapping "Start Stretching" shows the Setup screen with 12 rows, each with a Change button
3. Duration estimate (≈NN min) appears in the Begin button
4. Tapping Change opens the full-screen Picker with option cards and Sciatica/Cross-legged/Caution pills
5. Selecting a stretch updates the row and closes the picker
6. Reset to defaults reverts all rows to their defaults
7. Skip returns to dashboard
8. Tapping Begin Stretching opens the Active screen with 12 dots, stretch icon, group label, countdown ring (full, not ticking)
9. Tapping ▶ Start begins the countdown; ring drains
10. On a bilateral stretch: side 1 reaches zero → green ✓ Switch Sides appears → 1.5s later side 2 auto-starts
11. Skip all → returns to dashboard from the active screen
12. Skip this stretch (running) or Skip → [next] (paused) advance to next stretch

- [ ] **Step 7: Commit the final build**

```bash
cd "/Users/phillcantone/Library/Mobile Documents/com~apple~CloudDocs/Family/Phill/AI Coding/IRONLOG"
git add src/IronLog.jsx dist/index.html index.html version.json
git commit -m "feat: wire customisable stretch routine into App; simplify Dashboard; remove ActiveStretch"
git push origin main
```

- [ ] **Step 8: Update CHANGELOG.md**

Add this entry at the top of `CHANGELOG.md` (below the `---` separator, above the most recent entry):

```markdown
## 2026-05-26 — Customisable Stretch Routine

- Replaced static full-body flexibility routine with a three-screen flow: **Setup → Picker → Guided execution**
- Setup screen: 12 compact rows (Neck, Shoulders, Chest, Upper Back, Trunk, Lower Back, Spine/Rotation, Hip Flexors, Hips/Glutes, Hamstrings, IT Band, Calves/Ankles), each with a Change button and live duration estimate
- Picker: full-screen overlay per group with curated options and Sciatica / Cross-legged / Caution pills
- Guided execution: SVG countdown ring, manual ▶ Start, bilateral auto-start side 2 after 1.5s Switch Sides indicator — identical UX to warm-up
- Hips/Glutes slot: 5 options (Figure-4, Pigeon, Seated Piriformis, Butterfly, Knee to Opposite Shoulder)
- Hamstrings slot: 4 options (Lying Hamstring, Hamstring Stretch, Seated Forward Fold, Supine Nerve Glide)
- Config persisted in `il_stretch_config` localStorage key; Reset to defaults and Skip available from setup screen
- Dashboard stretch card simplified — accordion removed, single "Start Stretching →" button
- Legacy `view='stretch'` aliased to `view='stretch_setup'` for backward compatibility
```

Then commit:
```bash
cd "/Users/phillcantone/Library/Mobile Documents/com~apple~CloudDocs/Family/Phill/AI Coding/IRONLOG"
git add CHANGELOG.md
git commit -m "docs: update CHANGELOG for customisable stretch routine"
git push origin main
```

---

## Self-Review

**Spec coverage:**

| Spec requirement | Task |
|---|---|
| STRETCH_GROUPS constant (12 slots, all options) | Task 1 |
| getStretchConfig / saveStretchChoice / resetStretchConfig | Task 1 |
| il_stretch_config storage (12-element array) | Task 1 |
| StretchSetup — 12 rows with Change buttons | Task 3 |
| StretchSetup — Begin / Reset / Skip footer | Task 3 |
| StretchSetup — live duration estimate in button | Task 3 |
| StretchPicker — full-screen overlay, sticky header | Task 2 |
| StretchPicker — Sciatica / Cross-legged / Caution pills | Task 2 |
| StretchPicker — immediate write on tap, no confirm step | Task 2 |
| StretchPicker — ← returns without changing | Task 2 |
| StretchActive — 12 progress dots | Task 4 |
| StretchActive — SVG countdown ring (circumference 326.7) | Task 4 |
| StretchActive — manual ▶ Start, timer paused on load | Task 4 |
| StretchActive — bilateral: side 1 → Switch Sides 1.5s → side 2 auto | Task 4 |
| StretchActive — Skip all → returns to dashboard | Task 4 |
| StretchActive — Skip this stretch / Skip → next | Task 4 |
| StretchActive — cue text; omitted when no cue field | Task 4 |
| Dashboard accordion removed | Task 5 |
| App wiring: stretch_setup + stretch_active views | Task 5 |
| Legacy view='stretch' aliased to stretch_setup | Task 5 |
| ActiveStretch component removed | Task 5 |
| CHANGELOG updated | Task 5 |

**Placeholder scan:** No TBDs. All code blocks are complete. All commands include exact paths.

**Type consistency:**
- `getStretchConfig()` → `string[]` (12 elements). Used consistently in StretchSetup and StretchActive. ✓
- `saveStretchChoice(slotIndex: number, stretchId: string)` — matches all call sites. ✓
- `StretchPicker` props: `{ group, currentId, onSelect, onBack }` — match the call in StretchSetup. ✓
- `StretchSetup` props: `{ onBegin, onSkip }` — match the App render call. ✓
- `StretchActive` props: `{ onDone }` — matches the App render call. ✓
- `StretchThumb` called as `<StretchThumb stretch={...} group={...} size={N} />` — matches existing signature. ✓
- `fmtStretchDur(stretch)` — existing function, used identically to WarmupSetup. ✓
