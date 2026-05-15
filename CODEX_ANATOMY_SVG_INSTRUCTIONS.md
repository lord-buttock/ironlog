# Codex Instructions: Build Reusable Anatomy Muscle Highlight Component

## Project context — read this first

IronLog is a **single-file React 18 JSX web app**.

- Source: `src/IronLog.jsx`
- Build: `node build.js` → produces `index.html` (self-contained, no bundler)
- Stack: plain JSX, no TypeScript, no separate component directories
- All new code lives inside `src/IronLog.jsx` **or** as a sibling `.jsx` file
  that `build.js` already knows about

Do **not** create `.tsx` files, `src/components/`, `src/data/`, `src/types/`,
or any directory structure that does not already exist in the repo.
Do **not** import from `node_modules` packages that are not already used.

---

## Goal

Replace the current hard-coded `MuscleDiagram` component inside `IronLog.jsx`
with a data-driven anatomy diagram that shows two body views (front and rear)
with muscles highlighted as primary or secondary for each exercise.

The system must use **one front SVG and one rear SVG** and colour the correct
muscle paths based on structured exercise data — not per-exercise images.

---

## Step 0 — Preprocessing (already done, do not repeat)

The source SVGs were flat-colour-coded anatomical illustrations. A Python
preprocessing script (`assets/anatomy/assign_muscle_ids.py`) has already:

1. Read the source files (`assets/front torso.svg`, `assets/rear torso.svg`)
2. Matched each coloured muscle path to its anatomical name using colour
   proximity (not exact hex matching — the generated colours are close but not
   identical to the target palette)
3. Assigned `id`, `data-muscle`, and `data-side` attributes to every muscle path
4. Written the annotated output SVGs

The files Codex should work from are:

```
assets/anatomy/front-muscle-map.svg
assets/anatomy/rear-muscle-map.svg
```

Do not rerun the preprocessing script. Do not modify these SVG files.

### How to confirm the SVGs are ready

Before writing any component code, verify the output SVGs contain the expected
IDs by running:

```bash
grep -o 'id="[^"]*"' assets/anatomy/front-muscle-map.svg | sort
grep -o 'id="[^"]*"' assets/anatomy/rear-muscle-map.svg | sort
```

You should see exactly these IDs.

**Front view (28 muscle paths):**

```
anterior_deltoid_left
anterior_deltoid_right
biceps_brachii_left
biceps_brachii_right
external_obliques_left
external_obliques_right
forearm_flexors_left_1
forearm_flexors_left_2
forearm_flexors_right_1
forearm_flexors_right_2
front_lower_leg_left_1
front_lower_leg_left_2
front_lower_leg_right_1
front_lower_leg_right_2
lateral_deltoid_left
lateral_deltoid_right
pectoralis_major_left
pectoralis_major_right
quadriceps_left
quadriceps_right
rectus_abdominis_1
rectus_abdominis_2
rectus_abdominis_3
rectus_abdominis_4
rectus_abdominis_5
rectus_abdominis_6
rectus_abdominis_7
rectus_abdominis_8
```

**Rear view (22 muscle paths):**

```
erector_spinae_left
erector_spinae_right
forearm_extensors_left_1
forearm_extensors_left_2
forearm_extensors_right_1
forearm_extensors_right_2
gastrocnemius_left
gastrocnemius_right
gluteus_maximus_left
gluteus_maximus_right
hamstrings_left
hamstrings_right
latissimus_dorsi_left
latissimus_dorsi_right
middle_trapezius_rhomboids_1
middle_trapezius_rhomboids_2
posterior_deltoid_left
posterior_deltoid_right
triceps_brachii_left
triceps_brachii_right
upper_trapezius_left
upper_trapezius_right
```

---

## SVG orientation convention

Both SVGs use `viewBox="0 0 1024 1536"`. The midpoint is x = 512.

**Left/right refers to the figure's own body side** (standard anatomical convention):

- `*_left` paths have centroid x > 512 (figure's left = viewer's right)
- `*_right` paths have centroid x < 512 (figure's right = viewer's left)

Multi-segment muscles (forearms × 4, abs × 8, central traps × 2) use a numeric
suffix (`_1`, `_2`, …) instead of or in addition to a side suffix.

---

## Required output

1. An inline SVG component `MuscleDiagram` (replaces the existing one in
   `IronLog.jsx`)
2. An updated `MUSCLE_META` / exercise muscle database (see format below)
3. A visual test: open the app, navigate to any exercise in the Library, and
   confirm muscles highlight correctly

---

## Anatomy colour system

The SVGs currently contain the temporary working colours from generation.
The component must **not** display those colours. Replace them at render time:

```js
const ANATOMY_COLOURS = {
  primary:    '#5B8DEF',   // blue  — primary muscles
  secondary:  '#B8A7FF',   // purple — secondary muscles
  neutral:    '#D2D1D1',   // grey  — inactive muscles
  outline:    '#C9D6EA',   // light blue — body silhouette / non-muscle paths
  background: 'transparent',
};
```

Any path that is **not** a muscle path (body outline, skin fill) should keep
its original colour or be set to `outline`. Do not colour non-muscle paths with
the muscle palette.

---

## Component API

```js
// Inside IronLog.jsx — plain JSX, no TypeScript

function MuscleDiagram({ primary = [], secondary = [], size = 'medium' }) {
  // primary  — array of base muscle names, e.g. ['pectoralis_major', 'anterior_deltoid']
  // secondary — array of base muscle names
  // size     — 'small' | 'medium' | 'large'
  //
  // The component renders both front and rear views side by side (or stacked
  // on very small screens).  It loads the SVG content inline (not as <img>).
}
```

### Muscle name matching

The `primary` and `secondary` arrays contain **base muscle names** without
side or segment suffixes (e.g. `'pectoralis_major'`, not
`'pectoralis_major_left'`).

The component must highlight a path if its `data-muscle` attribute value
matches any entry in the `primary` or `secondary` array.

```js
// Colouring logic per path (pseudo-code):
const muscleName = path.getAttribute('data-muscle');
if (primary.includes(muscleName))   return ANATOMY_COLOURS.primary;
if (secondary.includes(muscleName)) return ANATOMY_COLOURS.secondary;
return ANATOMY_COLOURS.neutral;
```

This means you do **not** need to enumerate every `_left` / `_right` variant
in the exercise data — one entry covers both sides automatically.

---

## How to load the SVGs inline in React

Do **not** use `<img src="...">` — that prevents styling individual paths.

Fetch the SVG text at component mount and inject it as innerHTML, or use a
build-time approach to inline the SVG string into the JS bundle.

Recommended approach for this project (no bundler, single JS file build):

```js
// At the top of IronLog.jsx (or in a sibling file included by build.js),
// read the SVG files at build time and embed them as JS string constants.
// build.js already handles reading and inlining assets — check how it
// currently handles other assets and follow the same pattern.
//
// If build.js does not already inline SVGs, the simplest alternative is:
// fetch('/assets/anatomy/front-muscle-map.svg') at component mount,
// parse the response text, and inject into a <div> ref.
```

Check `build.js` first to understand what it currently does with assets,
then choose the approach that fits.

---

## Exercise muscle database format

Replace the existing `MUSCLE_META` object in `IronLog.jsx` with entries that
use base muscle names (no `_left` / `_right`).

```js
const MUSCLE_META = {
  bench_press: {
    primary:   ['pectoralis_major'],
    secondary: ['anterior_deltoid', 'triceps_brachii'],
  },
  overhead_press: {
    primary:   ['anterior_deltoid', 'lateral_deltoid'],
    secondary: ['triceps_brachii', 'upper_trapezius'],
  },
  pull_up: {
    primary:   ['latissimus_dorsi'],
    secondary: ['biceps_brachii', 'middle_trapezius_rhomboids', 'posterior_deltoid'],
  },
  back_squat: {
    primary:   ['quadriceps', 'gluteus_maximus'],
    secondary: ['hamstrings', 'erector_spinae'],
  },
  romanian_deadlift: {
    primary:   ['hamstrings', 'gluteus_maximus'],
    secondary: ['erector_spinae', 'forearm_flexors'],
  },
  tricep_pushdown: {
    primary:   ['triceps_brachii'],
    secondary: ['forearm_extensors'],
  },
  lateral_raise: {
    primary:   ['lateral_deltoid'],
    secondary: ['upper_trapezius', 'anterior_deltoid'],
  },
  // … extend for all exercises in the EXERCISES object
};
```

The keys must match the exercise `id` values already used in the `EXERCISES`
object. Do **not** invent new IDs.

---

## Valid base muscle names

Use only these names in `MUSCLE_META`. Any other string will silently fail
to highlight.

**Front view muscles:**

| Base name | Paths in SVG |
|---|---|
| `pectoralis_major` | `_left`, `_right` |
| `anterior_deltoid` | `_left`, `_right` |
| `lateral_deltoid` | `_left`, `_right` |
| `biceps_brachii` | `_left`, `_right` |
| `forearm_flexors` | `_left_1`, `_left_2`, `_right_1`, `_right_2` |
| `rectus_abdominis` | `_1` through `_8` |
| `external_obliques` | `_left`, `_right` |
| `quadriceps` | `_left`, `_right` |
| `front_lower_leg` | `_left_1`, `_left_2`, `_right_1`, `_right_2` |

**Rear view muscles:**

| Base name | Paths in SVG |
|---|---|
| `upper_trapezius` | `_left`, `_right` |
| `posterior_deltoid` | `_left`, `_right` |
| `latissimus_dorsi` | `_left`, `_right` |
| `middle_trapezius_rhomboids` | `_1`, `_2` |
| `erector_spinae` | `_left`, `_right` |
| `triceps_brachii` | `_left`, `_right` |
| `forearm_extensors` | `_left_1`, `_left_2`, `_right_1`, `_right_2` |
| `gluteus_maximus` | `_left`, `_right` |
| `hamstrings` | `_left`, `_right` |
| `gastrocnemius` | `_left`, `_right` |

---

## Quality control checklist

Before marking the task complete, verify every item:

1. No temporary generation colours appear in the rendered component
2. Primary muscles render as `#5B8DEF` (blue)
3. Secondary muscles render as `#B8A7FF` (purple)
4. All inactive muscle paths render as `#D2D1D1` (neutral grey)
5. Non-muscle body paths (skin fill, silhouette) are not coloured with
   the muscle palette
6. Both front and rear views display at the same scale
7. Left and right sides highlight symmetrically for bilateral exercises
8. At least these seven exercises display correctly:
   - Bench Press → chest blue, front delts + triceps purple
   - Overhead Press → front + side delts blue, triceps + upper traps purple
   - Pull Up → lats blue, biceps + mid traps + rear delts purple
   - Back Squat → quads + glutes blue, hamstrings + erectors purple
   - Romanian Deadlift → hamstrings + glutes blue, erectors + forearms purple
   - Tricep Pushdown → triceps blue, forearm extensors purple
   - Dumbbell Lateral Raise → side delts blue, upper traps + front delts purple
9. No muscle IDs in `MUSCLE_META` reference non-existent base muscle names
10. Component renders without console errors

---

## Do not do these things

- Create `.tsx`, `.ts`, or typed files of any kind
- Create `src/components/`, `src/data/`, `src/types/`, or any new directory
- Import packages not already in `package.json`
- Redraw or regenerate the anatomy SVG files
- Use raster images (PNG / JPEG) inside the app component
- Hardcode exercise-specific SVGs
- Create one image per exercise
- Use vague path IDs like `path1` or `muscle_A`
- Enumerate `_left` / `_right` variants in the exercise data — use base names only
- Modify the files inside `assets/anatomy/` directly
- Rerun `assets/anatomy/assign_muscle_ids.py`

---

## First task for Codex

Before writing any component code:

1. Run the grep commands from Step 0 to confirm both SVGs contain the expected IDs
2. Read `build.js` to understand how assets are currently loaded
3. Read the existing `MuscleDiagram` component in `src/IronLog.jsx` to understand
   what it currently does and what props it already receives
4. Report:
   - Confirm the SVG IDs match the expected list above (or note any discrepancies)
   - How `build.js` currently handles assets (inline? file references?)
   - What props `MuscleDiagram` currently accepts
   - Your implementation plan before writing any code

Only after that report should you start implementing.
