# IronLog — Peer Review Request for AI Agents

This is a request for an AI agent to peer-review the feedback written by Claude Sonnet 4.6 in `DECISIONS.md` and `ROADMAP.md`, and to publish responses directly into those files on GitHub.

---

## Context

IronLog is a single-file React 18 PWA fitness tracker deployed to GitHub Pages. There is no backend, no bundler, and no npm packages beyond Babel at build time. All data lives in `localStorage`. The app is built for one specific user — a 51-year-old male returning to strength training after 5 years off, with bilateral shoulder bursitis, a slipped disc, tight hamstrings, and limited shoulder flexibility.

**Read these files before reviewing — they are essential context:**
- `README.md` — full project architecture, user profile, medical constraints, tech stack, build process
- `DECISIONS.md` — open architectural decisions with agent feedback threads
- `ROADMAP.md` — known bugs, planned features, bug fix priority table, existing agent reviews
- `src/IronLog.jsx` — the full application source (1,735 lines)

All files are at: https://github.com/lord-buttock/ironlog

Raw file URLs for direct access:
- https://raw.githubusercontent.com/lord-buttock/ironlog/main/README.md
- https://raw.githubusercontent.com/lord-buttock/ironlog/main/DECISIONS.md
- https://raw.githubusercontent.com/lord-buttock/ironlog/main/ROADMAP.md
- https://raw.githubusercontent.com/lord-buttock/ironlog/main/src/IronLog.jsx

---

## What to Review

Your job is to **peer-review Claude Sonnet 4.6's entries specifically** — not to repeat what has already been said, but to assess whether Claude's reasoning is sound, flag anything missed or incorrect, and add any new considerations. Focus on corrections, gaps, and additions. If Claude got something right, a one-line confirmation is enough.

---

### ROADMAP.md — Code Review Entry

Claude's code review entry (dated 2026-05-12) covers 10 bug findings with specific file and line references. The full bug fix priority table has 14 items combining findings from both Claude and GPT-5 Codex.

**Review questions:**
1. Are the line number references in Claude's entry accurate against the current `src/IronLog.jsx`? (Check at least: line 134 PR detection, line 500 exIdx, line 638 blank screen, line 1269 p_good_morning, line 1292 p_russian_twist)
2. Is the proposed fix for PR detection (`ex.sets.filter(s => s.done)`) correct — does `s.done` exist on set objects in this codebase?
3. Is the overload nudge fix description accurate — does requiring `repMax > defaultReps` actually solve the problem, or does the `>=` vs `>` distinction matter here?
4. Are the medical constraint violations (p_good_morning, p_russian_twist, p_nordic_curl) correctly identified? Are there other contraindicated exercises in PRESET_LIBRARY not flagged?
5. Are there bugs in `src/IronLog.jsx` that neither Claude nor GPT-5 Codex have identified?

---

### DECISIONS.md — Decision 1: Exercise Demo Videos

Claude's entry covers:
- Endorsing Option A (curated YouTube watch URLs) as the first step
- Warning that ExerciseDB GIFs (Option B) will show contraindicated technique for this user's specific medical constraints
- Claiming GitHub Pages CSP does not block YouTube iframes (Option D)
- Implementation steps for the Option A curation pass

**Review questions:**
1. Is the ExerciseDB concern valid — do their GIFs actually default to wide-grip pull-ups and other contraindicated variants, or is Claude overstating the risk?
2. Is the iframe CSP claim accurate? Does GitHub Pages emit a CSP header that would affect YouTube embeds?
3. Is Option A truly a "no render logic changes" pass, given the current `demo` field is used in multiple places (`src/IronLog.jsx:676-684`, `src/IronLog.jsx:1463-1468`)?
4. Are there other options or risks Claude did not consider?

---

### DECISIONS.md — Decision 2: Cross-Device Data Sync & Backup

Claude's entry covers:
- Confirming Option C (Supabase) is correct
- A critical fix: restore condition should compare counts (`supabaseSessions.length > localSessions.length`), not check for empty localStorage
- Blocking sync while `activeSession !== null`
- A JSONB schema recommendation (full session as JSONB, not row-per-set)
- The `handleComplete()` integration point

**Review questions:**
1. Is the count-based restore condition actually correct? What edge cases does it miss (e.g. the user intentionally deleted old sessions locally, or the Supabase table is behind local)?
2. Is JSONB-per-session the right schema choice, or would a more normalised schema pay off for querying progress data later?
3. Is blocking sync on `activeSession !== null` sufficient, or are there other race conditions to consider in a single-user PWA context?
4. Are there Supabase-specific gotchas (RLS, anon key exposure, free tier limits) not covered?

---

## How to Respond

1. Read `ROADMAP.md` and `DECISIONS.md` in full — pay particular attention to Claude Sonnet 4.6's entries
2. Read the relevant sections of `src/IronLog.jsx` to verify any code claims
3. Write your peer reviews directly into the files:
   - **ROADMAP.md:** add your entry under **"Peer review of Claude Sonnet 4.6 — Code review"**
   - **DECISIONS.md — Decision 1:** add your entry under **"Peer review of Claude Sonnet 4.6 — Decision 1"**
   - **DECISIONS.md — Decision 2:** add your entry under **"Peer review of Claude Sonnet 4.6 — Decision 2"**
4. Format each entry as: `#### YYYY-MM-DD — [Your model name]`
5. Commit and push to `main` — the repo is: https://github.com/lord-buttock/ironlog

**Do not repeat what has already been said.** If Claude got something right, say so briefly and move on. If something is wrong or incomplete, explain why and what the correct approach is.

If you make any changes to `src/IronLog.jsx` as part of this session, note them in `ROADMAP.md` under the relevant priority item and run `npm run build` to verify the JSX compiles.
