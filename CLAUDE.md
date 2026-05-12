# IronLog — Claude Code Project Handover

## What this is
A personal fitness tracking web app for Phill (age 51, male, returning to training after ~5 years off).
Built as a single HTML file deployed to GitHub Pages. No backend, no build server, no framework beyond React.

The app is called **IronLog**.

---

## Live deployment
- **GitHub Pages URL:** `https://<phill-username>.github.io/ironlog`
- **Repo:** `github.com/<phill-username>/ironlog`
- **Branch:** `main` — the file `dist/index.html` is what gets deployed

To deploy an update: build the project (see below), then push `dist/index.html` to GitHub.
GitHub Pages auto-deploys within ~30 seconds of a push.

---

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| UI | React 18 (UMD from cdnjs) | Loaded via `<script>` tag — no bundler needed |
| Language | JSX compiled to plain JS | Pre-compiled with Babel CLI at build time |
| Charts | Custom SVG (`MiniLineChart` component) | Recharts was blocked by GitHub Pages CSP |
| Styling | Inline styles (React style objects) | Keeps everything in one file |
| Storage | `localStorage` | Per-device persistence, no server |
| Data backup | JSON export/import | User downloads/uploads a `.json` file |
| Fonts | Google Fonts CDN | Barlow Condensed, Barlow, JetBrains Mono |
| Hosting | GitHub Pages | Free, reliable, single-file deployment |

**What was tried and abandoned:**
- Google Apps Script — file too large (116KB), `doGet` failed with "something went wrong"
- Recharts CDN — `Recharts is not defined` error in some environments; replaced with custom SVG
- Client-side Babel (`text/babel`) — blocked by CSP; now pre-compiled at build time

---

## Build process

### Install dependencies (first time only)
```bash
npm install
```

### Build (every time you change src/IronLog.jsx)
```bash
npm run build
```

This does three things:
1. Strips React/Recharts imports (they come from CDN globals)
2. Compiles JSX → plain JS using Babel
3. Wraps the output in `dist/index.html` with the CDN script tags, fonts, icon, and PWA meta tags

### Deploy to GitHub Pages
```bash
git add dist/index.html
git commit -m "Update app"
git push
```

---

## Source file: src/IronLog.jsx

This is the **only file you edit**. Never edit `dist/index.html` directly — it gets overwritten on every build.

### Key sections in order:
1. **THEME** (`C` object) — all colours and font names
2. **WORKOUT DATA** — `WARMUP`, `EXERCISES`, `WORKOUTS`, `PRESET_LIBRARY`
3. **STORAGE** — `load()` / `save()` using `localStorage`
4. **GOOGLE DRIVE SYNC** — `exportData()` / `importData()` (JSON file download/upload)
5. **UTILITIES** — date formatting, timer helpers
6. **SVG CHART** — `MiniLineChart` component (no external library)
7. **Components** — `Nav`, `Dashboard`, `ActiveWorkout`, `SetRow`, `History`, `Progress`, `Rides`, `Manage`
8. **App root** — `App()` — state, persistence, renders all screens

### Globals available at runtime (from CDN, not imported):
```js
const { useState, useEffect, useRef, useCallback } = React;
// Recharts is NOT used — custom SVG charts instead
```

---

## App structure

### Navigation (bottom tab bar)
| Tab | Screen | Key state |
|---|---|---|
| Home | Dashboard | Next workout, Drive sync card, recent sessions |
| Train | ActiveWorkout | Session flow: energy → warmup → exercises → finisher → done |
| Log | History | Expandable session cards with sets, notes |
| Stats | Progress | SVG line charts per exercise (weight, volume, RPE) |
| Rides | Rides | Cycling log with programme guide |
| Manage | Manage | Exercise library + workout builder |

### Session flow
Energy check → Warm-up checklist → Exercises (with sets, RPE, pain, notes) → Finisher → Complete

### Data shape (localStorage keys)
```
il_sessions       → array of completed session objects
il_rides          → array of ride log objects
il_active         → current in-progress session (or null)
il_custom_exercises → user-created exercise objects
il_workout_custom → { A: [...extraIds], B: [...], C: [...] }
```

---

## Current workouts (Push / Pull / Legs split)

### Workout A — Push (Chest · Shoulders · Triceps)
`db_bench` → `p_db_shoulder_press` → `p_lateral_raise` → `db_floor_press` → `p_overhead_ext` → `p_tricep_pushdown`

### Workout B — Pull (Back · Biceps · Hinge)
`kb_deadlift` → `db_row_1arm` → `cs_db_row` → `p_db_bicep_curl` → `p_hammer_curl`

### Workout C — Legs + Core
`goblet_squat` → `split_squat` → `hip_thrust` → `sb_ham_curl` → `pallof_press` → `calf_raises` → `single_leg_bal`

Exercise IDs prefixed `p_` are in `PRESET_LIBRARY`. All others are in `EXERCISES`.
Both are merged into `allExercises` at runtime: `{ ...EXERCISES, ...PRESET_LIBRARY, ...customExercises }`.

---

## User's medical constraints — ALWAYS respect these

These must be honoured whenever suggesting or modifying exercises:

| Condition | Constraint |
|---|---|
| Bilateral shoulder bursitis | No overhead barbell pressing. DB shoulder press seated is OK. Emphasise scapular control. |
| Slipped disc / lower back pain | No loaded spinal flexion or rotation. Conservative hinge range. KB deadlift from raised height only. |
| Tight hamstrings | Raised deadlift height. Small range on hamstring curls. |
| Limited shoulder flexibility | Cannot back-rack a barbell. No back squat. Front-loaded or goblet only. |
| Returning after 5 years off | Conservative progression. RPE 6–7 early weeks. 3–4 reps in reserve. |

**Equipment available:** Dumbbells + plates, kettlebells (4–12kg), barbell, bench press rack,
weight plates (5kg, 10kg), Swiss ball, stepper, resistance bands, small trampoline, sturdy step, 5m carry space.

---

## iOS home screen / PWA
The app is configured as a PWA (add to home screen on iPhone via Safari):
- `apple-mobile-web-app-capable` — launches full screen, no browser chrome
- `apple-mobile-web-app-title` — shows "IronLog" under the icon
- `apple-mobile-web-app-status-bar-style: black` — dark status bar
- Home screen icon is a 180×180 PNG (dumbbell on dark background) embedded as base64 in the HTML

The icon base64 string is stored in `build.js` so it survives rebuilds.

---

## Features summary
- 3 workouts (A/B/C) in rotation, selectable manually
- Warm-up checklist + finisher checklist per workout
- Per-set logging: weight, reps/duration, RPE (1–10), pain (0–10)
- Pain ≥ 3/10 shows a warning banner
- Pre-filled from last session automatically
- Rest timer (60/90/120s shortcuts)
- Session clock
- Energy level check-in (😴 to 🔥) before each session
- Per-exercise notes (free text, shown in history)
- Session notes at finisher stage
- PR detection on session completion
- Progressive overload nudge when all sets hit top of rep range
- Progress charts: top weight, volume, RPE per exercise over time
- Session history (expandable, shows all sets + notes)
- Ride log with programme phases
- Exercise library (50+ preset exercises with form cues + YouTube demo links)
- Custom exercise creator
- Workout builder (add/remove exercises from A/B/C)
- Mid-session exercise addition
- JSON export / import for cross-device data transfer
- GitHub Pages deployment (single `dist/index.html`)
