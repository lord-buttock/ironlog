# Stretch Library Tab — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Stretches sub-tab to the Manage → Library screen, showing 19 curated stretch items (from the full-body flexibility routine, warm-up, and workout finishers) with expandable cards that include the stretch image, a muscle diagram with highlighted target areas, and form cue text.

**Architecture:** All changes are confined to `src/IronLog.jsx`. Three additions: (1) a `STRETCH_LIBRARY` data array and `STRETCH_MUSCLE_META` mapping near the top of the file, (2) an `applyStretchMeta()` helper called at module level, (3) UI changes inside the `Manage` component to add inner Exercises/Stretches pill sub-tabs and the stretch card render.

**Tech Stack:** React 18 (CDN globals — no imports). Pre-compiled JSX via `node build.js`. Inline styles throughout. `MuscleDiagram` component already exists and accepts `primary` and `secondary` arrays. All image assets already exist on disk.

---

## Orientation — read this first

**Canonical project path:**
```
/Users/phillcantone/Library/Mobile Documents/com~apple~CloudDocs/Family/Phill/AI Coding/IRONLOG/
```

**The only source file:** `src/IronLog.jsx`

**Build command:** `node build.js` — compiles JSX and writes output to both `dist/index.html` and root `index.html`. Run after every change.

**Commit rule:** Always commit these four files together: `src/IronLog.jsx`, `dist/index.html`, `index.html`, `version.json`. Never one without the others. Push immediately after every commit.

**Key existing constants (do not modify):**
- `STRETCHES` array — lines 257–357: the 12-item full-body flexibility routine. Do not alter these objects.
- `WORKOUTS` — line 388: A/B/C workout definitions including finisher arrays.
- `WARMUP` — line 245: warm-up checklist. Do not alter.
- `DISPLAY_TO_SVG_IDS` — line 126: maps display muscle names to SVG element ids. Only these names work in `MuscleDiagram`: `'Chest'`, `'Front Delts'`, `'Side Delts'`, `'Biceps'`, `'Forearms'`, `'Abs'`, `'Obliques'`, `'Quads'`, `'Calves'`, `'Rear Delts'`, `'Lats'`, `'Mid Traps'`, `'Upper Traps'`, `'Triceps'`, `'Spinal Erectors'`, `'Glutes'`, `'Hamstrings'`.
- `applyMuscleMeta()` — lines 2579–2590: mutates exercise objects with `primary`/`secondary` arrays. Model `applyStretchMeta` on this.
- `Manage` component — line 2598: the screen we're modifying.

**Style helpers available inside JSX** (already defined earlier in the file, use these):
- `st.card()` — card container style object
- `st.pill(color?)` — pill badge style object (no color arg = amber)
- `st.mono(size, color)` — monospace text style object
- `st.col(gap)` — flex column with given gap
- `C.amber`, `C.amberDim`, `C.dim`, `C.border`, `C.muted`, `C.text`, `C.fDisplay`, `C.fMono` — theme tokens

---

## Task 1 — Add STRETCH_LIBRARY data array

**Files:**
- Modify: `src/IronLog.jsx` — insert after line 357 (the `];` that closes the `STRETCHES` array), before `const YT = ...`

- [ ] **Step 1: Insert STRETCH_LIBRARY and STRETCH_MUSCLE_META**

Find this exact line (line 357–359):
```js
  },
];

const YT = q => `https://www.youtube.com/results?search_query=${q}`;
```

Replace with:
```js
  },
];

// ─── STRETCH LIBRARY (exercises + warm-up + finisher stretches) ────────────
// STRETCHES items are shallow-cloned so applyStretchMeta does not mutate
// the originals used by ActiveStretch and Dashboard.
const STRETCH_LIBRARY = [
  ...STRETCHES.map(s => ({ ...s })),
  // ── Warm-up mobility stretches ────────────────────────────────────────────
  { id: 'wu_cat_cow',           imageDir: 'warmup', bilateral: false, suggestedSecs: 60,
    name: 'Cat-Cow',
    targets: 'Spine · Lower back · Core',
    cue: '10 slow reps on hands and knees. Inhale — drop belly, lift head and tailbone (cow). Exhale — round spine toward ceiling, tuck chin and pelvis (cat). Move slowly, pain-free range.' },
  { id: 'wu_prone_cobra',       imageDir: 'warmup', bilateral: false, suggestedSecs: 30,
    name: 'Prone Cobra',
    targets: 'Lower back · Spinal extension',
    cue: 'Lie face down, hands beside chest. Gently lift chest off the floor. 6 × 5 sec holds. Back extension and disc health — lift only as high as is comfortable, no pain.' },
  { id: 'wu_hamstring_stretch', imageDir: 'warmup', bilateral: true,  suggestedSecs: 30,
    name: 'Lying Hamstring Stretch',
    targets: 'Hamstrings · Lower back',
    cue: 'Lie on your back. Loop a resistance band or towel around one foot and lift the leg slowly toward the ceiling. Keep the opposite leg flat. Stop at first gentle resistance — no bouncing. 30 sec each side.' },
  { id: 'wu_chest_opener',      imageDir: 'warmup', bilateral: false, suggestedSecs: 60,
    name: 'Doorframe Chest & Shoulder Opener',
    targets: 'Chest · Anterior shoulder',
    cue: 'Stand in a doorframe, arms at 90° on the frame. Lean your body gently forward until you feel a stretch across the chest and front of the shoulders. Keep shoulders down, not shrugging.' },
  { id: 'wu_pendulum',          imageDir: 'warmup', bilateral: true,  suggestedSecs: 30,
    name: 'Pendulum Swings',
    targets: 'Shoulder · Rotator cuff',
    cue: 'Lean on a bench with one hand for support. Let the opposite arm hang loose and make small, gentle circles — gravity does the work. No forced movement. Important for shoulder bursitis recovery. 30 sec each side.' },
  // ── Workout finisher stretches ────────────────────────────────────────────
  { id: 'fin_ham_floss',   imageDir: 'warmup', bilateral: true,  suggestedSecs: 45,
    name: 'Hamstring Floss',
    targets: 'Hamstrings · Neural',
    cue: 'Lie on your back with a band around one foot. Gently pump the leg toward the ceiling and back — slow, rhythmic neural flossing, not a held stretch. 45 sec each side.' },
  { id: 'fin_childs_pose', imageDir: 'warmup', bilateral: false, suggestedSecs: 60,
    name: "Child's Pose Breathing",
    targets: 'Lower back · Lats · Hips',
    cue: 'Kneel and sit back toward your heels. Reach arms forward along the floor. Breathe slowly and let your lower back lengthen with each exhale. For a lat stretch, walk both hands to one side and hold.' },
];

// Muscle highlight mapping for MuscleDiagram.
// "primary" = main anatomical area being stretched / mobilised (not activation).
// Only names from DISPLAY_TO_SVG_IDS are valid here.
const STRETCH_MUSCLE_META = {
  str_neck:             ['Upper Traps',     null],
  str_cross_shoulder:   ['Rear Delts',      'Mid Traps'],
  str_pec_roller_t:     ['Chest',           'Front Delts'],
  str_upper_back_roller:['Mid Traps',       'Spinal Erectors'],
  str_cat_cow_cow:      ['Spinal Erectors', 'Abs'],
  str_childs_pose:      ['Lats',            'Spinal Erectors'],
  str_spinal_rotation:  ['Obliques',        'Spinal Erectors'],
  str_hip_flexor:       ['Quads',           null],
  str_figure_four:      ['Glutes',          null],
  str_hamstring:        ['Hamstrings',      'Spinal Erectors'],
  str_it_band:          ['Glutes',          null],
  str_calf_straight:    ['Calves',          null],
  wu_cat_cow:           ['Spinal Erectors', 'Abs'],
  wu_prone_cobra:       ['Spinal Erectors', 'Abs'],
  wu_hamstring_stretch: ['Hamstrings',      'Spinal Erectors'],
  wu_chest_opener:      ['Chest',           'Front Delts'],
  wu_pendulum:          ['Rear Delts',      null],
  fin_ham_floss:        ['Hamstrings',      'Spinal Erectors'],
  fin_childs_pose:      ['Lats',            'Spinal Erectors'],
};

const YT = q => `https://www.youtube.com/results?search_query=${q}`;
```

- [ ] **Step 2: Insert applyStretchMeta after the existing applyMuscleMeta calls**

Find this exact block (lines 2589–2591 in the original, now shifted by the insertion above — search by content, not line number):
```js
applyMuscleMeta(EXERCISES);
applyMuscleMeta(PRESET_LIBRARY);

// ═══════════════════════════════════════════════════════════════════════
// MANAGE (Exercise Library + Workout Builder)
```

Replace with:
```js
applyMuscleMeta(EXERCISES);
applyMuscleMeta(PRESET_LIBRARY);

function applyStretchMeta() {
  STRETCH_LIBRARY.forEach(s => {
    const [p, sec] = STRETCH_MUSCLE_META[s.id] || [null, null];
    s.primary   = p   ? [p]   : [];
    s.secondary = sec ? [sec] : [];
  });
}
applyStretchMeta();

// ═══════════════════════════════════════════════════════════════════════
// MANAGE (Exercise Library + Workout Builder)
```

- [ ] **Step 3: Build and verify no errors**

```bash
cd "/Users/phillcantone/Library/Mobile Documents/com~apple~CloudDocs/Family/Phill/AI Coding/IRONLOG"
node build.js
```

Expected output:
```
Compiling JSX...
✓ Built dist/index.html and index.html (NNN KB)
```

If the build fails with a syntax error, fix it before proceeding. Do not commit a broken build.

- [ ] **Step 4: Commit**

```bash
cd "/Users/phillcantone/Library/Mobile Documents/com~apple~CloudDocs/Family/Phill/AI Coding/IRONLOG"
git add src/IronLog.jsx dist/index.html index.html version.json
git add -f dist/index.html
git commit -m "feat: add STRETCH_LIBRARY data and STRETCH_MUSCLE_META mappings"
git push origin main
```

---

## Task 2 — Add sub-tabs and stretch card render to Manage component

**Files:**
- Modify: `src/IronLog.jsx` — Manage component only (search by content, not line number)

### Step 2a — Add two new state variables

- [ ] **Step 2a: Add librarySubTab and expandedStretch state**

Find this exact block inside the `Manage` function:
```js
  const [wktSearch, setWktSearch] = useState('');

  // All exercises that can be browsed/added
```

Replace with:
```js
  const [wktSearch, setWktSearch] = useState('');
  const [librarySubTab, setLibrarySubTab]   = useState('exercises');
  const [expandedStretch, setExpandedStretch] = useState(null);

  // All exercises that can be browsed/added
```

### Step 2b — Add sub-tab pills + wrap existing library content

- [ ] **Step 2b: Replace the library tab opening to add sub-tab pills**

Find this exact block (the opening of the library tab render):
```jsx
      {/* ── Library tab ── */}
      {tab === 'library' && (
        <div>
          {/* Search */}
          <input value={search} onChange={e => setSearch(e.target.value)}
            style={{ ...st.inp, textAlign: 'left', padding: '10px 12px', marginBottom: 10 }}
            placeholder="Search exercises…" />
```

Replace with:
```jsx
      {/* ── Library tab ── */}
      {tab === 'library' && (
        <div>
          {/* Exercises / Stretches sub-tabs */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
            {[['exercises','Exercises'],['stretches','Stretches']].map(([id, label]) => (
              <button key={id}
                onClick={() => { setLibrarySubTab(id); setExpandedStretch(null); setExpandedLib(null); }}
                style={{
                  background: librarySubTab === id ? C.amber : C.dim,
                  color: librarySubTab === id ? '#fff' : C.muted,
                  border: `1px solid ${librarySubTab === id ? C.amber : C.border}`,
                  borderRadius: 20, padding: '6px 16px', fontSize: 12, fontFamily: C.fDisplay,
                  fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, cursor: 'pointer',
                }}>{label}</button>
            ))}
          </div>

          {/* ── Exercises sub-tab ── */}
          {librarySubTab === 'exercises' && (
          <div>
          {/* Search */}
          <input value={search} onChange={e => setSearch(e.target.value)}
            style={{ ...st.inp, textAlign: 'left', padding: '10px 12px', marginBottom: 10 }}
            placeholder="Search exercises…" />
```

### Step 2c — Close the exercises wrapper and add the stretches render

- [ ] **Step 2c: Close exercises wrapper and add stretch list**

Find this exact block (the closing of the library tab — the `</div>` for "Create custom" section through the closing of the tab):
```jsx
          </div>
        </div>
      )}

      {/* ── Workouts tab ── */}
```

Replace with:
```jsx
          </div>
          </div>
          )}

          {/* ── Stretches sub-tab ── */}
          {librarySubTab === 'stretches' && (
            <div style={{ ...st.col(8) }}>
              {STRETCH_LIBRARY.map((s) => {
                const isExp    = expandedStretch === s.id;
                const imgDir   = s.imageDir || 'stretches';
                const holdLabel = s.suggestedSecs
                  ? (s.bilateral ? `${s.suggestedSecs}s each side` : `${s.suggestedSecs}s`)
                  : null;
                return (
                  <div key={s.id} style={{ ...st.card(), display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {/* Collapsed header — tappable */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}
                      onClick={() => setExpandedStretch(isExp ? null : s.id)}>
                      <img
                        src={`assets/icons/${imgDir}/${s.id}.png`}
                        style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'contain', background: '#EEF3FF', flexShrink: 0 }}
                        onError={e => { e.target.style.display = 'none'; }}
                        alt={s.name}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                          <span style={{ fontFamily: C.fDisplay, fontSize: 16, textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.name}</span>
                          <span style={{ marginLeft: 'auto', color: C.muted, fontSize: 11, flexShrink: 0 }}>{isExp ? '▲' : '▼'}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                          <span style={{ ...st.mono(11, C.muted) }}>{s.targets}</span>
                          {s.bilateral && <span style={{ ...st.pill(C.amber), fontSize: 9 }}>Both sides</span>}
                        </div>
                      </div>
                    </div>

                    {/* Expanded detail */}
                    {isExp && (
                      <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
                        {/* Image(s) — dual side-by-side for stretches with id2 */}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 14 }}>
                          {[s.id, s.id2].filter(Boolean).map(imgId => {
                            const sz = s.id2 ? 140 : 180;
                            return (
                              <img key={imgId}
                                src={`assets/icons/${imgDir}/${imgId}.png`}
                                style={{ width: sz, height: sz, objectFit: 'contain', display: 'block' }}
                                onError={e => { e.target.style.opacity = 0.2; }}
                                alt={s.name}
                              />
                            );
                          })}
                        </div>
                        {/* Muscle diagram */}
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                          <MuscleDiagram primary={s.primary || []} secondary={s.secondary || []} size="medium" />
                        </div>
                        {/* Muscle pills */}
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
                          {s.primary && s.primary[0] && (
                            <span style={{ background: C.amberDim, color: C.amber, fontSize: 11, borderRadius: 20, padding: '3px 10px', fontFamily: C.fMono }}>
                              ● {s.primary[0]}
                            </span>
                          )}
                          {s.secondary && s.secondary[0] && (
                            <span style={{ background: '#e8f0ff', color: '#5b8fdc', fontSize: 11, borderRadius: 20, padding: '3px 10px', fontFamily: C.fMono }}>
                              ○ {s.secondary[0]}
                            </span>
                          )}
                        </div>
                        {/* Hold time */}
                        {holdLabel && (
                          <div style={{ textAlign: 'center', fontSize: 11, color: C.amber, fontFamily: C.fMono, marginBottom: s.cue ? 8 : 0 }}>
                            ⏱ {holdLabel}
                          </div>
                        )}
                        {/* Cue text */}
                        {s.cue && (
                          <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5, padding: '8px 0' }}>
                            {s.cue}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Workouts tab ── */}
```

---

## Task 3 — Build, smoke-test, commit, push

- [ ] **Step 1: Build**

```bash
cd "/Users/phillcantone/Library/Mobile Documents/com~apple~CloudDocs/Family/Phill/AI Coding/IRONLOG"
node build.js
```

Expected:
```
Compiling JSX...
✓ Built dist/index.html and index.html (NNN KB)
```

If this fails, fix the JSX syntax error before proceeding. Common mistakes: mismatched braces/parens in the new JSX, extra or missing `)}` around the exercises wrapper.

- [ ] **Step 2: Smoke-test checklist**

Open `index.html` in a browser (or check the live app after pushing). Verify:

1. Manage → Library shows two pill buttons: **Exercises** and **Stretches**
2. **Exercises** pill is active by default — existing exercise list renders exactly as before
3. Switching to **Stretches** pill shows 19 cards
4. Each card shows: round 40 px image, stretch name, targets string, "Both sides" pill on bilateral stretches
5. Tapping a card expands it to show: large image (or two side-by-side for Cat-Cow, Pec Roller, Calf Stretch), muscle diagram with blue/purple highlights, hold time, cue text
6. Verify MuscleDiagram highlights appear on at least three cards with different muscle groups (e.g. Neck → Upper Traps; Figure-4 Glute → Glutes; Pec Roller → Chest)
7. Switching back to Exercises — all exercises still work, search and filter still function
8. No console errors

- [ ] **Step 3: Update CHANGELOG.md**

Add a line at the top of the changelog (under the `## [Unreleased]` or current-date section):

```
- Manage → Library now has Exercises / Stretches sub-tabs. Stretches tab shows 19 curated items (12 full-body flexibility, 5 warm-up mobility, 2 workout finishers) with expandable cards: stretch image, MuscleDiagram with target-area highlights, hold time, and cue text.
```

- [ ] **Step 4: Commit and push**

```bash
cd "/Users/phillcantone/Library/Mobile Documents/com~apple~CloudDocs/Family/Phill/AI Coding/IRONLOG"
git add src/IronLog.jsx CHANGELOG.md
git add -f dist/index.html
git add index.html version.json
git status   # confirm only expected files are staged
git log --oneline -3   # confirm you are on main and ahead of last good commit
git commit -m "feat: add Stretches sub-tab to Manage Library with muscle diagram cards

19 curated stretch items (full-body flexibility, warm-up, finishers).
Expandable cards show stretch image, MuscleDiagram target highlights,
hold time, and cue text. Exercises tab unchanged.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
git push origin main
```

---

## Self-review notes

**Spec coverage check:**
- ✅ STRETCH_LIBRARY (19 items, exact literals) — Task 1 Step 1
- ✅ STRETCH_MUSCLE_META (19 entries) — Task 1 Step 1
- ✅ applyStretchMeta (clones, no mutation of originals) — Task 1 Step 2
- ✅ Inner sub-tabs (Exercises / Stretches pills) — Task 2b
- ✅ librarySubTab + expandedStretch state — Task 2a
- ✅ Exercises tab unchanged — Task 2b (existing content wrapped, not rewritten)
- ✅ Collapsed card: image, name, targets, bilateral pill — Task 2c
- ✅ Expanded card: image(s), MuscleDiagram, muscle pills, hold time, cue — Task 2c
- ✅ Dual images for id2 stretches at 140 px — Task 2c
- ✅ Single image for non-dual stretches at 180 px — Task 2c
- ✅ Image path uses imageDir || 'stretches' — Task 2c
- ✅ onError hides missing images gracefully — Task 2c
- ✅ No Add-to-Workout button on stretch cards — Task 2c (none added)
- ✅ Build, smoke-test, CHANGELOG, commit, push — Task 3

**Type consistency:** `expandedStretch` is set/read consistently as a stretch `id` string (or `null`) throughout Tasks 2a and 2c. `librarySubTab` is `'exercises'` or `'stretches'` throughout.

**No placeholders found.**
