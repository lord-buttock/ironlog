# IronLog — Open Design Decisions

This document captures features that are planned but not yet implemented, where the best technical approach hasn't been decided. It is intended for review by AI agents and collaborators — feedback, recommendations, and implementation notes are welcome at the bottom of each section.

Read README.md for full project context before commenting. Key constraints:
- Single HTML file deployed to GitHub Pages (no server, no build pipeline beyond Babel)
- No npm packages that require bundling — CDN or vanilla JS only
- Storage is currently `localStorage` only
- The user already has a Supabase project running (`bhlbebdmuodscdgcwkyb`) for a separate app

---

## Decision 1 — Exercise Demo Videos

### Current behaviour
Each exercise in the library has a `demo` field containing a YouTube *search* URL constructed like:
```js
const YT = q => `https://www.youtube.com/results?search_query=${q}`;
demo: YT('dumbbell+bench+press+form+tutorial')
```
Tapping the demo link opens a YouTube search in the browser. The user then picks a video themselves.

### Problem
- Search results are inconsistent — ads, irrelevant videos, results change over time
- No in-app experience — user is taken out of the app entirely
- On iPhone (PWA full-screen mode), returning to the app after Safari opens is disruptive

### Options Considered

#### Option A — Curated YouTube video IDs (recommended starting point)
Replace search URLs with direct links to specific, hand-picked YouTube videos.
```js
demo: 'https://www.youtube.com/watch?v=VIDEO_ID'
```
- **Pro:** Free, no infrastructure, works immediately, eliminates bad search results
- **Con:** Videos can be deleted or go private over time — requires occasional maintenance
- **Effort:** Low — update the `demo` field for each exercise in `src/IronLog.jsx`

#### Option B — ExerciseDB API (animated GIFs)
[ExerciseDB on RapidAPI](https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb) provides animated GIF demonstrations for hundreds of exercises, accessible via a REST API.
```js
// Example response includes:
{ "gifUrl": "https://v2.exercisedb.io/image/abc123" }
```
- **Pro:** Clean looping animations, no ads, no YouTube dependency, renders inside the app
- **Con:** RapidAPI free tier has rate limits; paid tiers required for heavy use; third-party dependency
- **Effort:** Medium — fetch GIF URL per exercise at load time or cache in `localStorage`

#### Option C — Self-hosted GIFs / images (most robust)
Source or create short animated GIFs for each exercise and host them in this GitHub repo (under `assets/`) or on a free CDN (Cloudflare R2, Supabase Storage).
- **Pro:** Fully controlled, never disappears, no API dependency, can be tailored to the user's specific equipment
- **Con:** Effort to source or create ~50 GIFs; storage to manage; GIF file sizes can be large
- **Effort:** High upfront, zero ongoing maintenance

#### Option D — In-app YouTube embed (iframe)
Store a specific YouTube video ID per exercise and render it in an `<iframe>` inside the app.
```jsx
<iframe
  src={`https://www.youtube.com/embed/${exercise.videoId}`}
  allow="accelerometer; autoplay"
  style={{ width: '100%', height: 200, border: 0 }}
/>
```
- **Pro:** Video plays inside the app without leaving; curated to exact video
- **Con:** GitHub Pages CSP may block iframe embeds; YouTube embeds require internet; disruptive to workout flow if video plays mid-set
- **Effort:** Low code-wise, but CSP needs testing

### Current Recommendation
Start with **Option A** (curated YouTube video IDs) as an immediate improvement — it requires no architectural change, just updating the `demo` field for each exercise. In parallel, evaluate **Option B** (ExerciseDB GIFs) for a future in-app experience.

### Agent Feedback
*Add recommendations, concerns, or implementation notes below.*

---

## Decision 2 — Cross-Device Data Sync & Backup

### Current behaviour
All app data lives in `localStorage` on the device. The app provides a JSON export button (downloads a `.json` file) and a JSON import button (upload to restore). This works but is entirely manual — the user must remember to export, transfer the file, and import on the new device.

### Problem
- Data is siloed per device — training on a phone doesn't sync to a tablet or desktop
- If the user clears browser storage or reinstalls, all data is lost
- Manual export/import is friction that users often skip until it's too late
- The PWA on iPhone home screen is especially vulnerable — iOS can purge PWA storage

### Data Shape (for reference)
```js
localStorage keys:
  il_sessions       → array of completed session objects
  il_rides          → array of ride log objects
  il_active         → current in-progress session (or null)
  il_custom_exercises → user-created exercises
  il_workout_custom → { A: [...], B: [...], C: [...] } customisations
```
A typical `il_sessions` entry looks like:
```js
{
  id: 'uuid',
  workout: 'A',
  date: 'YYYY-MM-DD',
  energy: 3,
  duration: 45,
  exercises: [
    {
      id: 'db_bench',
      sets: [{ weight: 20, reps: 8, rpe: 6, pain: 0, done: true }],
      notes: ''
    }
  ],
  notes: ''
}
```

### Options Considered

#### Option A — iCloud / Google Drive (workflow, no code)
User manually exports JSON, saves to cloud storage, imports on new device.
- **Pro:** Zero development effort
- **Con:** Entirely manual, relies on user discipline, no automatic protection against data loss
- **Effort:** None

#### Option B — GitHub Gist as cloud storage
Use the GitHub API to save the full JSON backup to a private Gist. A "Cloud Save" button writes to the Gist; a "Cloud Load" button fetches it. Uses the user's existing GitHub account.
```js
// Save
fetch('https://api.github.com/gists/GIST_ID', {
  method: 'PATCH',
  headers: { Authorization: `token ${TOKEN}` },
  body: JSON.stringify({ files: { 'ironlog.json': { content: JSON.stringify(data) } } })
});
```
- **Pro:** Free, uses existing GitHub account, no separate service
- **Con:** Requires storing a GitHub personal access token in the app (security concern); not automatic sync — still button-triggered; not real-time
- **Effort:** Low-medium

#### Option C — Supabase (recommended)
The user already runs a Supabase project (`bhlbebdmuodscdgcwkyb`) for a separate app (ADHD Task Manager). Adding IronLog sync to the same project would mean:
- A `ironlog_sessions` table stores each completed session
- A `ironlog_rides` table stores rides
- After each workout, the session is saved to both `localStorage` and Supabase
- On first load on a new device, the app fetches history from Supabase

Authentication could be handled by:
- A hardcoded user ID (same as the ADHD Task Manager — this is a single-user app)
- Or Supabase Auth (email/password or magic link) if multi-user is ever needed

```js
// Example: save session after workout
const { error } = await supabase
  .from('ironlog_sessions')
  .upsert(session, { onConflict: 'id' });
```

- **Pro:** Real sync across devices; automatic backup; user already has the account; Supabase JS client loads from CDN (no bundler needed); free tier is generous
- **Con:** Requires internet connection to sync (app still works offline via localStorage); requires setting up new tables; adds Supabase CDN dependency to the app
- **Effort:** Medium — schema design, CDN script tag, sync logic on session complete and app load

#### Option D — URL-encoded snapshot
Encode the entire dataset as base64 in a URL. The user can bookmark or share the URL to restore on another device.
- **Pro:** No backend, no accounts, works anywhere
- **Con:** URLs become very long for large datasets; not practical for ongoing sync; breaks bookmark on every session
- **Effort:** Low but limited utility

### Current Recommendation
**Option C (Supabase)** is the best long-term solution given the user already has a Supabase project. Suggested implementation order:
1. Add Supabase JS client via CDN script tag in `build.js`
2. Create `ironlog_sessions` and `ironlog_rides` tables with the user's existing user ID
3. After `handleComplete()`, upsert the session to Supabase
4. On app load, if `il_sessions` is empty, fetch from Supabase as a restore
5. Add a manual "Sync now" button in the Manage screen for on-demand push/pull

**Option B (GitHub Gist)** is a good interim solution if Supabase feels like too much infrastructure for now.

### Agent Feedback
*Add recommendations, concerns, or implementation notes below.*

---

## How to Contribute Feedback

If you are an AI agent reviewing this document:
1. Read README.md for the full project architecture and constraints
2. Add your feedback under the relevant **Agent Feedback** section
3. Include your recommended option, reasoning, and any implementation gotchas
4. If you have started or completed an implementation, note it in ROADMAP.md under the relevant priority item
