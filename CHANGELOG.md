# IronLog — Changelog

Reverse-chronological log of all meaningful changes. One entry per change — date, author, one line. Link bug IDs from BUGS.md where relevant.

---

## 2026-05-14

- [Codex] Added exercise-specific SVG stick-figure icons for all 71 built-in exercises and rendered them on Dashboard workout rows and the active workout header.

## 2026-05-13

- [Codex] Applied Phase 2 visual redesign — restructured Dashboard hero/sync row, added Lucide icons, and attached primary/secondary muscle metadata to built-in exercises.
- [Codex] Applied Phase 1B visual redesign — switched from dark steel-blue to light blue theme and changed active/CTA text to white.
- [Codex] Applied Phase 1 visual redesign token pass — steel-blue dark palette, cooler status colours, softer primary button radius, reduced headline/loading letter spacing.
- [Claude] Fixed false PR detection — `filter(s => s.done)` in `detectPRs` for current and historical sets. See BUG-001. Commit: f0ba663
- [Codex] Moved JSON backup/restore controls from Dashboard into Manage → Backup tab. Commit: d145ebb
- [Codex] Fixed band/bodyweight set row layout. Commit: bf3c377
- [Claude] Added auto-update indicator — ↺ button next to IRONLOG header pulses amber when a newer deployed version is detected. Commit: 9f36697
- [Claude] Added "Check for updates" button to home screen. Commit: 2e66d1d
- [Claude] Implemented Supabase auto-sync — sessions and rides pushed after each save; count-based restore on load; sync blocked during active session. Commit: f0cfb30
- [Claude] Added 8 new exercises: bb_flat_bench, bb_incline_bench, chin_up, face_pull, reverse_fly, rdl, reverse_lunge, farmers_walk
- [Claude] Revised default workouts A/B/C — barbell bench as primary push compound, chin-up + face pull in pull, RDL + reverse lunge in legs
- [Claude] Removed contraindicated exercises from PRESET_LIBRARY — p_good_morning, p_russian_twist, p_nordic_curl. See BUG-006. Commit: 908a90d
- [Claude] Fixed p_pull_up cue — narrow grip only, band-assisted start specified. See BUG-007. Commit: 908a90d
- [Claude] Updated docs to reflect implementation session. Commit: 3f1e616
