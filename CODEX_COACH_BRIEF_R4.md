# Codex Brief R4 — AI Coach Debug: Pre-Start Screen Not Appearing
*Generated 2026-05-20. Read this alongside CLAUDE.md.*

---

## Before anything else — read CLAUDE.md

```
/Users/phillcantone/Library/Mobile Documents/com~apple~CloudDocs/Family/Phill/AI Coding/Ironlog/CLAUDE.md
```

Read it first. It tells you the correct file paths and build process. Work from the **local iCloud path**, not GitHub.

---

## Your task: find and fix a bug — no new features

The AI Coach feature was implemented (all 8 tasks from the plan). The code is built and deployed. But in the live app, two things are broken:

1. **Tapping "Start Workout A" on the home screen goes directly to the energy check screen** — it should navigate to `view === 'preStart'` (the new PreStartScreen component) first.
2. **The coach note panel does not appear on the home screen** — the blue `#F0F4FF` panel with the 🤖 icon and coach note is not visible.

The user has done the nuclear option (deleted + re-added the PWA on iOS). Still broken. This is a code bug, not a caching issue.

---

## What the code is supposed to do

### Start button routing (Dashboard component)
The Start button should navigate to `'preStart'` when no session is active, or resume `'workout'` if one is already in progress:

```jsx
<button onClick={() => activeSession ? setView('workout') : setView('preStart')}>
  {activeSession ? 'Resume Workout' : `Start Workout ${selectedWorkout}`}
</button>
```

### Coach panel (Dashboard component)
The coach panel should render when `coachRec` is available and no session is active:

```jsx
{!activeSession && coachRec && (
  <div style={{ background: '#F0F4FF', ... }}>
    🤖 {coachRec.note}
    ...
  </div>
)}
```

### PreStartScreen routing (App component)
In App()'s render, the preStart view should be handled:

```jsx
{view === 'preStart' && (
  <PreStartScreen ... />
)}
```

### coachRec computation (App component)
`coachRec` is computed as a derived value (not state) inside App():

```jsx
const coachRec = computeCoachRecommendation(sessions, rides, selectedWorkout);
```

---

## What we already know

- The compiled `index.html` (root, 629KB) contains the coach code — grep confirms 20+ references to `coachRec`, `PreStartScreen`, `computeCoachRecommendation`.
- The compiled JS parses without errors when run through `new Function()`.
- `setView('preStart')` is present in the compiled output.
- The user is tapping the **home screen** "Start Workout A" button — not the WORKOUT nav tab, not a resume button.
- The user sees the button text "Start Workout A" (which means `activeSession` is null / falsy at render time). But when they tap it, they land on the energy check — which is `phase === 'energy'` inside `ActiveWorkout`. This means either:
  - (a) `setView('preStart')` is being called but `PreStartScreen` crashes immediately on render, causing a fallback, OR
  - (b) `activeSession` becomes truthy at the moment of the click (race condition or stale closure), routing to `'workout'` instead, OR
  - (c) The Start button's `onClick` is not the one we think — there may be another Start button wired differently that is being tapped.

---

## Your investigation

Read `src/IronLog.jsx` carefully. Focus on:

1. **The Start button in Dashboard** — find the exact `onClick` handler. Is it `setView('preStart')` or `setView('workout')` under what condition? Is there more than one Start button? Is there any other path that could route to `'workout'` directly?

2. **The App() render switch** — find where `view === 'preStart'` is handled. Is `PreStartScreen` actually rendered? Is there an early-return or conditional that could prevent it from mounting?

3. **`computeCoachRecommendation`** — does it throw for a user with no prior sessions? If it throws, `coachRec` will be `undefined`, which would cause the coach panel to not render (expected). But could a thrown error in a derived value computation cause App() to crash or re-render in an unexpected state?

4. **`PreStartScreen` component** — does it have any prop access that could throw on mount? For example, accessing `coachRec.flags` when `coachRec` is `undefined`, or reading from `allExercises` with a bad key?

5. **The `activeSession` state** — is there any code path that sets `activeSession` to a non-null value before the user taps Start? For example, is it loaded from localStorage on startup?

---

## Your output

1. Identify the exact root cause with a line number.
2. Write the minimal fix — change as little as possible.
3. Rebuild: `node build.js`
4. Verify the compiled `index.html` contains the fix.
5. Commit: `git add src/IronLog.jsx index.html && git commit -m "fix: [describe the bug]"`
6. Push: `git push origin main`

Report back:
- What the bug was (line number and explanation)
- What you changed
- Confirmation that the build succeeded and was pushed
