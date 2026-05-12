import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════════════
// THEME
// ═══════════════════════════════════════════════════════════════════════
const C = {
  bg: '#0a0a0a', surface: '#111', card: '#181818', border: '#252525',
  amber: '#f59e0b', amberDim: '#78450a', red: '#ef4444', green: '#10b981',
  blue: '#60a5fa', purple: '#a78bfa', text: '#ebebeb', muted: '#5a5a5a', dim: '#2a2a2a',
  fDisplay: "'Barlow Condensed', sans-serif",
  fMono: "'JetBrains Mono', monospace",
  fBody: "'Barlow', sans-serif",
};

// ═══════════════════════════════════════════════════════════════════════
// WORKOUT DATA
// ═══════════════════════════════════════════════════════════════════════
const WARMUP = [
  '2 min · Easy stepper or gentle trampoline bounce',
  '1 min · Bodyweight squats (slow, comfortable depth)',
  '1 min · Hip hinge drill (hands on hips, small range)',
  '1 min · Band pull-aparts (easy tension)',
  '1 min · Glute bridge (bodyweight)',
];

const YT = q => `https://www.youtube.com/results?search_query=${q}`;

const EXERCISES = {
  goblet_squat:       { name: 'Goblet Squat',               muscle: 'Legs',    unit: 'kg',   defaultReps: 8,  defaultSets: 3, repMax: 8,  cue: '2 sec down, 1 sec pause, drive up. Use KB or DB held at chest.',                                                                   demo: YT('goblet+squat+tutorial+form+how+to') },
  db_bench:           { name: 'DB Bench Press',              muscle: 'Push',    unit: 'kg',   defaultReps: 8,  defaultSets: 3, repMax: 8,  cue: 'Elbows 30–45° from body, not flared. Flat or slight incline — choose what shoulders tolerate best.',                                demo: YT('dumbbell+bench+press+form+tutorial') },
  db_row_1arm:        { name: 'One-Arm DB Row',              muscle: 'Pull',    unit: 'kg',   defaultReps: 10, defaultSets: 3, repMax: 10, cue: 'Bench-supported. Torso parallel to floor. No twisting.',                               perSide: true,              demo: YT('one+arm+dumbbell+row+proper+form+tutorial') },
  step_ups:           { name: 'Step-Ups',                    muscle: 'Legs',    unit: 'kg',   defaultReps: 8,  defaultSets: 3, repMax: 8,  cue: 'Drive through heel. Control descent. Bodyweight or light load.',                        perSide: true, canBW: true, demo: YT('step+ups+exercise+proper+form+tutorial') },
  pallof_press:       { name: 'Pallof Press',                muscle: 'Core',    unit: 'band', defaultReps: 10, defaultSets: 2, repMax: 10, cue: 'Anti-rotation. Brace core. Resist the pull.',                                           perSide: true,              demo: YT('pallof+press+tutorial+how+to+anti+rotation') },
  kb_deadlift:        { name: 'KB Deadlift (Raised Height)', muscle: 'Hinge',   unit: 'kg',   defaultReps: 8,  defaultSets: 3, repMax: 8,  cue: 'KB on plates/platform to reduce depth. Neutral spine. Push the floor away. Conservative — do not rush depth progression.',           demo: YT('kettlebell+deadlift+form+tutorial+beginners') },
  hip_thrust:         { name: 'Hip Thrust / Glute Bridge',   muscle: 'Glutes',  unit: 'kg',   defaultReps: 10, defaultSets: 3, repMax: 10, cue: 'Start bodyweight. Add DB/KB across hips when comfortable. Full hip extension at top.',                        canBW: true, demo: YT('hip+thrust+glute+bridge+form+tutorial') },
  incline_pushups:    { name: 'Incline Push-Ups',            muscle: 'Push',    unit: 'bw',   defaultReps: 8,  defaultSets: 3, repMax: 12, cue: 'Hands on bench. Stop 1–2 reps before failure. Lower incline gradually as strength improves.',                                       demo: YT('incline+push+ups+form+tutorial+how+to') },
  band_row:           { name: 'Band Row',                    muscle: 'Pull',    unit: 'band', defaultReps: 12, defaultSets: 3, repMax: 12, cue: 'Squeeze shoulder blades down and back. Control the return.',                                                                        demo: YT('resistance+band+row+exercise+form+tutorial') },
  suitcase_carry:     { name: 'Suitcase Carry / Hold',       muscle: 'Core',    unit: 'kg',   defaultReps: null, defaultDuration: 25, defaultSets: 4, repMax: null, cue: 'Stand tall, do not lean. Walk 5m down and back, or hold if no space.',  isTimed: true, perSide: true, demo: YT('suitcase+carry+exercise+form+tutorial+core') },
  split_squat:        { name: 'Split Squat',                 muscle: 'Legs',    unit: 'kg',   defaultReps: 8,  defaultSets: 3, repMax: 8,  cue: 'Shallow range if hips/knees complain. Bodyweight first, then add load.',                 perSide: true, canBW: true, demo: YT('split+squat+how+to+form+tutorial+beginners') },
  db_floor_press:     { name: 'DB Floor Press',              muscle: 'Push',    unit: 'kg',   defaultReps: 9,  defaultSets: 3, repMax: 10, cue: 'Shoulder-friendly: limited range on floor. Keep elbows at 45°.',                                                                    demo: YT('dumbbell+floor+press+form+tutorial') },
  cs_db_row:          { name: 'Chest-Supported DB Row',      muscle: 'Pull',    unit: 'kg',   defaultReps: 10, defaultSets: 3, repMax: 10, cue: 'Face down on incline bench. No momentum. Full scapular retraction.',                                                                demo: YT('chest+supported+dumbbell+row+incline+bench+tutorial') },
  sb_ham_curl:        { name: 'Swiss Ball Hamstring Curl',   muscle: 'Legs',    unit: 'bw',   defaultReps: 8,  defaultSets: 3, repMax: 10, cue: 'Small range to start. Swap for glute bridge if cramping occurs.',                                                                   demo: YT('swiss+ball+hamstring+curl+tutorial+how+to') },
  calf_raises:        { name: 'Calf Raises',                 muscle: 'Legs',    unit: 'bw',   defaultReps: 12, defaultSets: 2, repMax: 15, cue: 'Full range, slow descent. Can add weight when easy.',                                                                               demo: YT('calf+raises+proper+form+tutorial') },
  single_leg_bal:     { name: 'Single-Leg Balance',          muscle: 'Balance', unit: 'bw',   defaultReps: null, defaultDuration: 25, defaultSets: 2, repMax: null, cue: '20–30 sec each side. Eyes closed to progress.',                   isTimed: true, perSide: true, demo: YT('single+leg+balance+exercise+tutorial+proprioception') },
};

const WORKOUTS = {
  A: {
    title: 'Push — Chest · Shoulders · Triceps',
    exercises: ['db_bench','p_db_shoulder_press','p_lateral_raise','db_floor_press','p_overhead_ext','p_tricep_pushdown'],
    finisher: ['Band face pulls — 2 × 12','Wall slides — 2 × 6 slow (pain-free only)'],
  },
  B: {
    title: 'Pull — Back · Biceps · Hinge',
    exercises: ['kb_deadlift','db_row_1arm','cs_db_row','p_db_bicep_curl','p_hammer_curl'],
    finisher: ['Hamstring floss (band, lying) — 45 sec each side',"Child's pose breathing — 60 sec"],
  },
  C: {
    title: 'Legs + Core',
    exercises: ['goblet_squat','split_squat','hip_thrust','sb_ham_curl','pallof_press','calf_raises','single_leg_bal'],
    finisher: ['Band external rotation — 2 × 10 each side','Band pull-aparts — 2 × 12'],
  },
};

// ═══════════════════════════════════════════════════════════════════════
// STORAGE  (localStorage — works in any browser)
// ═══════════════════════════════════════════════════════════════════════
async function load(key) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; }
  catch { return null; }
}
async function save(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

// ═══════════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════════
const pad = n => String(n).padStart(2, '0');
const fmtTimer = s => `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;
const fmtDate = iso => new Date(iso).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' });
const fmtShortDate = iso => new Date(iso).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });

function nextWorkout(sessions) {
  const done = sessions.filter(s => s.completed);
  if (!done.length) return 'A';
  const last = done[done.length - 1].workout;
  return { A: 'B', B: 'C', C: 'A' }[last] || 'A';
}

function getLastLogged(sessions, exId) {
  for (let i = sessions.length - 1; i >= 0; i--) {
    const ex = sessions[i].exercises?.find(e => e.id === exId);
    if (ex?.sets?.length) return ex;
  }
  return null;
}

function buildSession(workoutKey, prevSessions, allExercises = EXERCISES, workoutCustom = {}) {
  const wkt = WORKOUTS[workoutKey];
  const extraIds = workoutCustom[workoutKey] || [];
  const exerciseIds = [...wkt.exercises, ...extraIds];
  const exercises = exerciseIds.map(exId => {
    const def = allExercises[exId] || EXERCISES[exId];
    if (!def) return null;
    const last = getLastLogged(prevSessions, exId);
    const numSets = last?.sets?.length || def.defaultSets;
    const sets = Array.from({ length: numSets }, (_, i) => {
      const ls = last?.sets?.[i] || last?.sets?.[0];
      return {
        weight: ls?.weight ?? '',
        reps: ls?.reps ?? (def.defaultReps || ''),
        duration: ls?.duration ?? (def.defaultDuration || ''),
        rpe: null, pain: null, done: false,
      };
    });
    return { id: exId, sets, notes: '' };
  }).filter(Boolean);
  return {
    id: Date.now().toString(),
    workout: workoutKey,
    date: new Date().toISOString(),
    startTime: Date.now(),
    energy: null,
    exercises,
    notes: '',
    completed: false,
  };
}

function detectPRs(newSess, prevSessions, allExercises = EXERCISES) {
  const prs = [];
  newSess.exercises.forEach(ex => {
    const def = allExercises[ex.id] || EXERCISES[ex.id];
    if (!def || def.unit !== 'kg') return;
    const newMax = Math.max(...ex.sets.map(s => Number(s.weight) || 0));
    if (!newMax) return;
    const prevMax = prevSessions.reduce((mx, sess) => {
      const pe = sess.exercises?.find(e => e.id === ex.id);
      if (!pe) return mx;
      return Math.max(mx, ...pe.sets.map(s => Number(s.weight) || 0));
    }, 0);
    if (newMax > prevMax) prs.push({ name: def.name, weight: newMax });
  });
  return prs;
}

function checkOverloadNudges(sess, allExercises = EXERCISES) {
  const nudges = [];
  sess.exercises.forEach(ex => {
    const def = allExercises[ex.id] || EXERCISES[ex.id];
    if (!def || !def.repMax || def.unit === 'bw' || def.unit === 'band') return;
    const allHitMax = ex.sets.every(s => s.done && Number(s.reps) >= def.repMax);
    if (allHitMax) nudges.push(def.name);
  });
  return nudges;
}

function weekStart() {
  const d = new Date(); d.setHours(0,0,0,0);
  d.setDate(d.getDate() - d.getDay());
  return d;
}

// ═══════════════════════════════════════════════════════════════════════
// STYLE HELPERS
// ═══════════════════════════════════════════════════════════════════════
const st = {
  screen: { minHeight: '100vh', background: C.bg, color: C.text, fontFamily: C.fBody, paddingBottom: 80 },
  card: bg => ({ background: bg || C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16 }),
  h1: { fontFamily: C.fDisplay, fontSize: 34, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', margin: 0, lineHeight: 1 },
  h2: { fontFamily: C.fDisplay, fontSize: 22, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', margin: 0 },
  label: { fontSize: 10, fontFamily: C.fMono, color: C.muted, textTransform: 'uppercase', letterSpacing: 1.5 },
  mono: (size = 14, color = C.text) => ({ fontFamily: C.fMono, fontSize: size, color }),
  inp: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, color: C.text, fontFamily: C.fMono, fontSize: 15, padding: '8px 0', width: '100%', boxSizing: 'border-box', textAlign: 'center', WebkitAppearance: 'none' },
  btn: (bg = C.amber, color = '#000') => ({ background: bg, color, border: 'none', borderRadius: 5, padding: '12px 20px', fontFamily: C.fDisplay, fontSize: 14, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer', width: '100%' }),
  btnSm: (bg = C.amber, color = '#000') => ({ background: bg, color, border: 'none', borderRadius: 4, padding: '8px 14px', fontFamily: C.fDisplay, fontSize: 13, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer' }),
  ghost: { background: 'transparent', color: C.muted, border: `1px solid ${C.border}`, borderRadius: 5, padding: '10px 20px', fontFamily: C.fDisplay, fontSize: 13, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer', width: '100%' },
  pill: (color = C.amber) => ({ background: color + '20', color, border: `1px solid ${color}40`, borderRadius: 20, padding: '2px 9px', fontSize: 10, fontFamily: C.fMono, letterSpacing: 0.8 }),
  row: { display: 'flex', alignItems: 'center', gap: 8 },
  col: (gap = 8) => ({ display: 'flex', flexDirection: 'column', gap }),
};

// ═══════════════════════════════════════════════════════════════════════
// DATA EXPORT / IMPORT  (JSON file — works on any device, any host)
// ═══════════════════════════════════════════════════════════════════════
function exportData(data) {
  const payload = JSON.stringify({
    version: 2,
    exportedAt: new Date().toISOString(),
    sessions: data.sessions,
    rides: data.rides,
    customExercises: data.customExercises,
    workoutCustom: data.workoutCustom,
  }, null, 2);
  const blob = new Blob([payload], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `IronLog-backup-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      try { resolve(JSON.parse(e.target.result)); }
      catch { reject(new Error('File is not valid JSON.')); }
    };
    reader.onerror = () => reject(new Error('Could not read file.'));
    reader.readAsText(file);
  });
}


function FontLoader() {
  useEffect(() => {
    if (document.getElementById('ironlog-fonts')) return;
    const link = document.createElement('link');
    link.id = 'ironlog-fonts'; link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap';
    document.head.appendChild(link);
  }, []);
  return null;
}

// ═══════════════════════════════════════════════════════════════════════
// NAV
// ═══════════════════════════════════════════════════════════════════════
function Nav({ view, setView, hasActive }) {
  const tabs = [
    { id: 'dashboard', label: 'Home',    icon: '▣' },
    { id: 'workout',   label: 'Train',   icon: '◈', dot: hasActive },
    { id: 'history',   label: 'Log',     icon: '◫' },
    { id: 'progress',  label: 'Stats',   icon: '▲' },
    { id: 'rides',     label: 'Rides',   icon: '○' },
    { id: 'manage',    label: 'Manage',  icon: '⊞' },
  ];
  return (
    <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: C.surface, borderTop: `1px solid ${C.border}`, display: 'flex', zIndex: 200 }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => setView(t.id)} style={{
          flex: 1, background: 'none', border: 'none', padding: '10px 4px 12px',
          color: view === t.id ? C.amber : C.muted, cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, position: 'relative',
        }}>
          {view === t.id && <span style={{ position: 'absolute', top: 0, left: '25%', right: '25%', height: 2, background: C.amber, borderRadius: 2 }} />}
          <span style={{ fontSize: 16 }}>{t.icon}</span>
          <span style={{ fontSize: 9, fontFamily: C.fMono, letterSpacing: 0.8, textTransform: 'uppercase' }}>{t.label}</span>
          {t.dot && <span style={{ position: 'absolute', top: 6, right: '28%', width: 5, height: 5, borderRadius: 3, background: C.amber }} />}
        </button>
      ))}
    </nav>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════════════
function Dashboard({ sessions, rides, setView, activeSession, selectedWorkout, setSelectedWorkout, allExercises = EXERCISES, workoutCustom = {}, driveSync, onDriveSave, onDriveLoad }) {
  const suggested = nextWorkout(sessions);
  const wkt = WORKOUTS[selectedWorkout];
  const extraIds = workoutCustom[selectedWorkout] || [];
  const allWorkoutExIds = [...wkt.exercises, ...extraIds];
  const ws = weekStart();
  const weekSessions = sessions.filter(s => new Date(s.date) >= ws);
  const weekRides = rides.filter(r => new Date(r.date) >= ws);
  const recent = [...sessions].reverse().slice(0, 4);

  return (
    <div style={{ padding: '20px 16px 8px' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ ...st.label, marginBottom: 6 }}>Training Log</div>
        <div style={{ ...st.h1 }}>IRON<span style={{ color: C.amber }}>LOG</span></div>
      </div>

      {/* Next workout card */}
      <div style={{ ...st.card(), marginBottom: 12, borderColor: C.border }}>

        {/* Workout selector — hidden if a session is already active */}
        {activeSession ? (
          <div style={{ ...st.label, marginBottom: 10, color: C.amber }}>Session in progress</div>
        ) : (
          <>
            <div style={{ ...st.label, marginBottom: 8 }}>Choose workout</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 16 }}>
              {['A', 'B', 'C'].map(key => {
                const active = selectedWorkout === key;
                const isSuggested = suggested === key;
                return (
                  <button key={key} onClick={() => setSelectedWorkout(key)} style={{
                    background: active ? C.amber : C.dim,
                    border: `1px solid ${active ? C.amber : isSuggested ? C.amber + '55' : C.border}`,
                    borderRadius: 6, padding: '10px 6px', cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                    position: 'relative',
                  }}>
                    {isSuggested && !active && (
                      <span style={{
                        position: 'absolute', top: -7, left: '50%', transform: 'translateX(-50%)',
                        background: C.amber, color: '#000', fontSize: 8, fontFamily: C.fMono,
                        padding: '1px 6px', borderRadius: 10, letterSpacing: 0.5, whiteSpace: 'nowrap',
                        textTransform: 'uppercase',
                      }}>next</span>
                    )}
                    <span style={{ fontFamily: C.fDisplay, fontSize: 28, fontWeight: 700, color: active ? '#000' : C.text, lineHeight: 1 }}>{key}</span>
                    <span style={{ fontSize: 9, fontFamily: C.fMono, color: active ? '#00000099' : C.muted, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 0.3, lineHeight: 1.3 }}>
                      {WORKOUTS[key].title}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* Exercise list for selected workout */}
        <div style={{ marginBottom: 14 }}>
          {allWorkoutExIds.map(id => {
            const ex = allExercises[id] || EXERCISES[id];
            const isExtra = extraIds.includes(id);
            return (
              <div key={id} style={{ fontSize: 13, color: C.muted, padding: '4px 0', borderBottom: `1px solid ${C.dim}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{ex?.name || id}</span>
                <span style={{ fontFamily: C.fMono, fontSize: 10, color: isExtra ? C.amber : C.muted }}>
                  {isExtra ? '+ added' : ex?.muscle}
                </span>
              </div>
            );
          })}
        </div>
        <button style={{ ...st.btn() }} onClick={() => setView('workout')}>
          {activeSession ? '▶ Resume Workout' : `▶ Start Workout ${selectedWorkout}`}
        </button>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
        {[
          { label: 'Total sessions', value: sessions.length },
          { label: 'Sessions this week', value: weekSessions.length + '/3' },
          { label: 'Rides this week', value: weekRides.length },
        ].map((s, i) => (
          <div key={i} style={{ ...st.card(), textAlign: 'center', padding: 12 }}>
            <div style={{ fontFamily: C.fMono, fontSize: 22, color: C.amber, lineHeight: 1 }}>{s.value}</div>
            <div style={{ ...st.label, fontSize: 9, marginTop: 5, lineHeight: 1.4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Data Export / Import */}
      {driveSync && (
        <div style={{ ...st.card(), marginBottom: 16 }}>
          <div style={{ ...st.label, marginBottom: 8 }}>Data Backup</div>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 12, lineHeight: 1.5 }}>
            Export your data as a JSON file to back up or move to another device. Import it on any device to restore.
          </div>

          {driveSync.status === 'error' && (
            <div style={{ fontSize: 12, color: C.red, marginBottom: 10, fontFamily: C.fMono }}>⚠ {driveSync.error}</div>
          )}
          {driveSync.status === 'done' && driveSync.lastSync && (
            <div style={{ fontSize: 11, color: C.green, marginBottom: 10, fontFamily: C.fMono }}>
              ✓ Exported {new Date(driveSync.lastSync).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button onClick={onDriveSave} style={{ ...st.btn() }}>
              ↓ Export JSON
            </button>
            <label style={{ ...st.btn(C.dim, C.muted), textAlign: 'center', cursor: 'pointer', border: `1px solid ${C.border}` }}>
              ↑ Import JSON
              <input type="file" accept=".json" style={{ display: 'none' }}
                onChange={e => { if (e.target.files[0]) onDriveLoad(e.target.files[0]); e.target.value = ''; }} />
            </label>
          </div>
        </div>
      )}

      {/* Recent sessions */}
      {recent.length > 0 && (
        <>
          <div style={{ ...st.label, marginBottom: 8 }}>Recent</div>
          <div style={{ ...st.col() }}>
            {recent.map(sess => (
              <div key={sess.id} style={{ ...st.card(), display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px' }}>
                <div style={{ ...st.row }}>
                  <span style={{ fontFamily: C.fDisplay, fontSize: 26, color: C.amber, width: 22 }}>{sess.workout}</span>
                  <div>
                    <div style={{ fontSize: 13, fontFamily: C.fDisplay, textTransform: 'uppercase', letterSpacing: 0.5 }}>{WORKOUTS[sess.workout].title}</div>
                    <div style={{ ...st.mono(11, C.muted) }}>{fmtDate(sess.date)}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  {sess.duration && <div style={{ ...st.mono(12, C.muted) }}>{sess.duration}min</div>}
                  {sess.energy && <div style={{ fontSize: 16 }}>{'😴😕😐💪🔥'[sess.energy - 1]}</div>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// SET ROW
// ═══════════════════════════════════════════════════════════════════════
function SetRow({ num, set, def, onUpdate, onDone }) {
  const done = set.done;
  const isTimed = def.isTimed;
  const isBW = def.unit === 'bw' || def.unit === 'band';

  const gridCols = isBW || isTimed ? '28px 1fr 56px 56px 38px' : '28px 1fr 1fr 56px 56px 38px';

  return (
    <div style={{ background: done ? C.green + '12' : C.dim, border: `1px solid ${done ? C.green + '44' : C.border}`, borderRadius: 6, padding: '8px 10px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: 5, alignItems: 'center' }}>
        <div style={{ fontFamily: C.fMono, fontSize: 13, color: done ? C.green : C.muted, textAlign: 'center', fontWeight: 600 }}>
          {done ? '✓' : num}
        </div>

        {isTimed ? (
          <input type="number" inputMode="numeric" value={set.duration} onChange={e => onUpdate('duration', e.target.value)}
            style={{ ...st.inp }} placeholder="sec" />
        ) : isBW ? (
          <div style={{ ...st.inp, color: C.muted, fontSize: 11, lineHeight: '34px', border: `1px solid ${C.border}` }}>BW</div>
        ) : (
          <input type="number" inputMode="decimal" value={set.weight} onChange={e => onUpdate('weight', e.target.value)}
            style={{ ...st.inp }} placeholder="kg" />
        )}

        {!isTimed && !isBW && (
          <input type="number" inputMode="numeric" value={set.reps} onChange={e => onUpdate('reps', e.target.value)}
            style={{ ...st.inp }} placeholder="reps" />
        )}
        {(isTimed || isBW) && (
          <input type="number" inputMode="numeric" value={set.reps} onChange={e => onUpdate('reps', e.target.value)}
            style={{ ...st.inp, display: isTimed ? 'none' : 'block' }} placeholder="reps" />
        )}

        <select value={set.rpe ?? ''} onChange={e => onUpdate('rpe', e.target.value ? +e.target.value : null)}
          style={{ ...st.inp, fontSize: 12 }}>
          <option value=''>RPE</option>
          {[5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
        </select>

        <select value={set.pain ?? ''} onChange={e => onUpdate('pain', e.target.value !== '' ? +e.target.value : null)}
          style={{ ...st.inp, fontSize: 12, borderColor: set.pain >= 3 ? C.red + '88' : C.border }}>
          <option value=''>Pain</option>
          {[0,1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
        </select>

        <button onClick={onDone} disabled={done} style={{
          background: done ? C.green + '33' : C.amber, border: 'none', borderRadius: 4,
          padding: '7px 0', cursor: done ? 'default' : 'pointer', fontSize: 14, width: '100%',
        }}>
          {done ? '✓' : '›'}
        </button>
      </div>

      {!isTimed && !isBW && (
        <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr 1fr 56px 56px 38px', gap: 5, marginTop: 3 }}>
          <div/><div style={{ ...st.label, fontSize: 9, textAlign: 'center' }}>kg</div>
          <div style={{ ...st.label, fontSize: 9, textAlign: 'center' }}>reps</div>
          <div style={{ ...st.label, fontSize: 9, textAlign: 'center' }}>rpe</div>
          <div style={{ ...st.label, fontSize: 9, textAlign: 'center' }}>pain</div>
          <div/>
        </div>
      )}
      {(isTimed || isBW) && (
        <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr 56px 56px 38px', gap: 5, marginTop: 3 }}>
          <div/><div style={{ ...st.label, fontSize: 9, textAlign: 'center' }}>{isTimed ? 'secs' : 'bw'}</div>
          <div style={{ ...st.label, fontSize: 9, textAlign: 'center' }}>rpe</div>
          <div style={{ ...st.label, fontSize: 9, textAlign: 'center' }}>pain</div>
          <div/>
        </div>
      )}

      {set.pain >= 3 && (
        <div style={{ marginTop: 6, background: C.red + '18', border: `1px solid ${C.red}44`, borderRadius: 4, padding: '6px 10px', fontSize: 12, color: C.red }}>
          ⚠ Pain ≥ 3/10 — stop or swap this exercise
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// ACTIVE WORKOUT
// ═══════════════════════════════════════════════════════════════════════
function ActiveWorkout({ sessions, activeSession, setActiveSession, onComplete, setView, selectedWorkout, allExercises = EXERCISES, workoutCustom = {} }) {
  const nextWkt = selectedWorkout;
  const [session, setSession] = useState(activeSession || null);
  const [phase, setPhase] = useState(activeSession ? 'workout' : 'energy');
  const [exIdx, setExIdx] = useState(0);
  const [restSecs, setRestSecs] = useState(90);
  const [restActive, setRestActive] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [prs, setPRs] = useState([]);
  const [nudges, setNudges] = useState([]);
  const [showAddEx, setShowAddEx] = useState(false);

  const elapsedRef = useRef(null);
  const restRef = useRef(null);

  useEffect(() => {
    elapsedRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(elapsedRef.current);
  }, []);

  useEffect(() => {
    if (!restActive) { clearTimeout(restRef.current); return; }
    if (restSecs <= 0) { setRestActive(false); return; }
    restRef.current = setTimeout(() => setRestSecs(s => s - 1), 1000);
    return () => clearTimeout(restRef.current);
  }, [restActive, restSecs]);

  function startRest(s = 90) { setRestSecs(s); setRestActive(true); }
  function stopRest() { setRestActive(false); setRestSecs(90); }

  function startSession(energy) {
    const s = buildSession(nextWkt, sessions, allExercises, workoutCustom);
    s.energy = energy;
    setSession(s);
    setActiveSession(s);
    setPhase('warmup');
  }

  function updateSet(eIdx, sIdx, field, val) {
    setSession(prev => {
      const updated = {
        ...prev,
        exercises: prev.exercises.map((ex, ei) => ei !== eIdx ? ex : {
          ...ex,
          sets: ex.sets.map((s, si) => si !== sIdx ? s : { ...s, [field]: val }),
        }),
      };
      setActiveSession(updated);
      return updated;
    });
  }

  function doneSet(eIdx, sIdx) {
    updateSet(eIdx, sIdx, 'done', true);
    startRest(90);
  }

  function addSet(eIdx) {
    setSession(prev => {
      const ex = prev.exercises[eIdx];
      const last = ex.sets[ex.sets.length - 1];
      const newSet = { ...last, done: false, rpe: null, pain: null };
      const updated = {
        ...prev,
        exercises: prev.exercises.map((e, i) => i !== eIdx ? e : { ...e, sets: [...e.sets, newSet] }),
      };
      setActiveSession(updated);
      return updated;
    });
  }

  function updateExNotes(eIdx, notes) {
    setSession(prev => {
      const updated = {
        ...prev,
        exercises: prev.exercises.map((e, i) => i !== eIdx ? e : { ...e, notes }),
      };
      setActiveSession(updated);
      return updated;
    });
  }

  function completeWorkout() {
    const completed = { ...session, completed: true, duration: Math.round(elapsed / 60) };
    setPRs(detectPRs(completed, sessions, allExercises));
    setNudges(checkOverloadNudges(completed, allExercises));
    onComplete(completed);
    setPhase('done');
  }

  // ── Energy ──────────────────────────────────────────────────────────
  if (phase === 'energy') {
    return (
      <div style={{ padding: 16 }}>
        <div style={{ ...st.label, marginBottom: 4 }}>Workout {nextWkt}</div>
        <div style={{ fontFamily: C.fDisplay, fontSize: 26, textTransform: 'uppercase', marginBottom: 24 }}>{WORKOUTS[nextWkt].title}</div>
        <div style={{ ...st.card(), marginBottom: 16 }}>
          <div style={{ fontFamily: C.fDisplay, fontSize: 16, textTransform: 'uppercase', letterSpacing: 1, color: C.muted, marginBottom: 16 }}>Energy level today?</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[['😴','Low'],['😕','Tired'],['😐','OK'],['💪','Good'],['🔥','Great']].map(([emoji, label], i) => (
              <button key={i} onClick={() => startSession(i + 1)} style={{
                flex: 1, background: C.dim, border: `1px solid ${C.border}`, borderRadius: 6,
                padding: '12px 4px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              }}>
                <span style={{ fontSize: 22 }}>{emoji}</span>
                <span style={{ fontSize: 9, fontFamily: C.fMono, color: C.muted, textTransform: 'uppercase' }}>{label}</span>
              </button>
            ))}
          </div>
        </div>
        <button style={{ ...st.ghost }} onClick={() => startSession(3)}>Skip</button>
      </div>
    );
  }

  // ── Warmup ──────────────────────────────────────────────────────────
  if (phase === 'warmup') {
    return (
      <div style={{ padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={st.h2}>Warm-Up</div>
          <div style={{ ...st.mono(20, C.amber) }}>{fmtTimer(elapsed)}</div>
        </div>
        <div style={{ ...st.label, marginBottom: 12 }}>6 minutes · complete all five items</div>
        <div style={{ ...st.col(), marginBottom: 24 }}>
          {WARMUP.map((item, i) => (
            <div key={i} style={{ ...st.card(), display: 'flex', gap: 12, alignItems: 'center', padding: '12px 14px' }}>
              <div style={{ fontFamily: C.fMono, color: C.amber, fontSize: 14, minWidth: 20 }}>{i + 1}</div>
              <div style={{ fontSize: 13, lineHeight: 1.4 }}>{item}</div>
            </div>
          ))}
        </div>
        <button style={{ ...st.btn() }} onClick={() => setPhase('workout')}>Begin Workout ›</button>
      </div>
    );
  }

  // ── Workout ──────────────────────────────────────────────────────────
  if (phase === 'workout' && session) {
    const exId = session.exercises[exIdx]?.id;
    const def = allExercises[exId] || EXERCISES[exId] || {};
    const exData = session.exercises[exIdx];
    if (!exData) return null;

    const doneSetsCount = exData.sets.filter(s => s.done).length;
    const allExDone = exData.sets.every(s => s.done);
    const sessionExIds = new Set(session.exercises.map(e => e.id));
    const availableToAdd = Object.entries(allExercises).filter(([id]) => !sessionExIds.has(id));

    return (
      <div style={{ padding: 16 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
          <div>
            <div style={{ ...st.label, marginBottom: 3 }}>
              {session.workout} · {exIdx + 1} / {session.exercises.length} · {doneSetsCount}/{exData.sets.length} sets
            </div>
            <div style={{ fontFamily: C.fDisplay, fontSize: 22, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, lineHeight: 1.2 }}>{def.name}</div>
          </div>
          <div style={{ textAlign: 'right', minWidth: 80 }}>
            {restActive ? (
              <div>
                <div style={{ ...st.mono(9, C.muted) }}>REST</div>
                <div style={{ fontFamily: C.fMono, fontSize: 22, color: C.amber, lineHeight: 1 }}>{fmtTimer(restSecs)}</div>
                <button onClick={stopRest} style={{ ...st.btnSm(C.dim, C.muted), padding: '2px 6px', fontSize: 10, marginTop: 2 }}>Skip</button>
              </div>
            ) : (
              <div style={{ fontFamily: C.fMono, fontSize: 18, color: C.muted }}>{fmtTimer(elapsed)}</div>
            )}
          </div>
        </div>

        {/* Tags + cue */}
        <div style={{ ...st.row, flexWrap: 'wrap', marginBottom: 8, gap: 4 }}>
          <span style={st.pill()}>{def.muscle}</span>
          {def.perSide && <span style={st.pill(C.blue)}>Per side</span>}
          {def.repMax && <span style={st.pill(C.purple)}>{def.repMax === def.defaultReps ? `${def.defaultReps} reps` : `${def.defaultReps}–${def.repMax} reps`}</span>}
        </div>
        <div style={{ ...st.card(), padding: '10px 12px', borderLeft: `2px solid ${C.amber}`, marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5, marginBottom: def.demo ? 10 : 0 }}>{def.cue}</div>
          {def.demo && (
            <a href={def.demo} target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: C.dim, border: `1px solid ${C.border}`, borderRadius: 4,
              padding: '6px 12px', fontSize: 11, fontFamily: C.fMono,
              color: C.text, textDecoration: 'none', letterSpacing: 0.8, textTransform: 'uppercase',
            }}>
              <span style={{ color: C.red, fontSize: 13 }}>▶</span> Watch Demo
            </a>
          )}
        </div>

        {/* Sets */}
        <div style={{ ...st.col(6), marginBottom: 10 }}>
          {exData.sets.map((set, si) => (
            <SetRow key={si} num={si + 1} set={set} def={def}
              onUpdate={(f, v) => updateSet(exIdx, si, f, v)}
              onDone={() => doneSet(exIdx, si)} />
          ))}
        </div>

        {/* Add set */}
        <button style={{ ...st.ghost, marginBottom: 12, fontSize: 12 }} onClick={() => addSet(exIdx)}>+ Add Set</button>

        {/* Rest timer shortcuts */}
        <div style={{ ...st.row, justifyContent: 'center', gap: 6, marginBottom: 14 }}>
          <span style={{ ...st.label, fontSize: 9 }}>Rest:</span>
          {[60, 90, 120].map(t => (
            <button key={t} onClick={() => startRest(t)} style={{ ...st.btnSm(C.dim, C.muted), fontSize: 11, padding: '6px 10px' }}>{t}s</button>
          ))}
        </div>

        {/* Overload nudge for this exercise */}
        {allExDone && def.repMax && def.unit === 'kg' && exData.sets.every(s => Number(s.reps) >= def.repMax) && (
          <div style={{ ...st.card(C.amber + '10'), borderColor: C.amber + '44', marginBottom: 12, padding: '10px 14px' }}>
            <div style={{ fontSize: 12, color: C.amber }}>
              ◈ All sets at top of rep range — consider adding load next session
            </div>
          </div>
        )}

        {/* Exercise notes */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ ...st.label, marginBottom: 5 }}>Exercise notes</div>
          <textarea
            value={exData.notes || ''}
            onChange={e => updateExNotes(exIdx, e.target.value)}
            placeholder="e.g. shoulder felt tight, went lighter than planned…"
            style={{
              ...st.inp, textAlign: 'left', padding: '10px 12px',
              minHeight: 64, resize: 'none', fontSize: 12,
              lineHeight: 1.5, fontFamily: C.fBody,
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {exIdx > 0 && <button style={{ ...st.ghost, flex: '0 0 80px' }} onClick={() => setExIdx(i => i - 1)}>‹</button>}
          {exIdx < session.exercises.length - 1 ? (
            <button style={{ ...st.btn(), flex: 1 }} onClick={() => setExIdx(i => i + 1)}>Next ›</button>
          ) : (
            <button style={{ ...st.btn(C.green), flex: 1 }} onClick={() => setPhase('finisher')}>Finisher ›</button>
          )}
        </div>

        {/* Exercise list mini-nav */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 14, justifyContent: 'center' }}>
          {session.exercises.map((ex, i) => {
            const done = ex.sets.every(s => s.done);
            const isCustom = !EXERCISES[ex.id];
            return (
              <button key={ex.id + i} onClick={() => { setExIdx(i); setShowAddEx(false); }} style={{
                width: 28, height: 28, borderRadius: 14,
                background: done ? C.green + '22' : i === exIdx ? C.amber : C.dim,
                border: `1px solid ${done ? C.green + '44' : i === exIdx ? C.amber : isCustom ? C.amber + '44' : C.border}`,
                color: done ? C.green : i === exIdx ? '#000' : C.muted,
                fontFamily: C.fMono, fontSize: 10, cursor: 'pointer',
              }}>{i + 1}</button>
            );
          })}
        </div>

        {/* Mid-session add exercise */}
        <div style={{ marginTop: 14 }}>
          <button style={{ ...st.ghost, fontSize: 12 }} onClick={() => setShowAddEx(!showAddEx)}>
            {showAddEx ? '✕ Cancel' : '＋ Add Exercise to Session'}
          </button>
          {showAddEx && (
            <div style={{ marginTop: 8 }}>
              <div style={{ ...st.label, marginBottom: 8 }}>Select exercise</div>
              <div style={{ ...st.col(4), maxHeight: 280, overflowY: 'auto' }}>
                {availableToAdd.length === 0
                  ? <div style={{ fontSize: 12, color: C.muted, padding: 12, textAlign: 'center' }}>All exercises already in this session.</div>
                  : availableToAdd.map(([id, ex]) => (
                    <button key={id} onClick={() => {
                      const def = allExercises[id];
                      const last = getLastLogged(sessions, id);
                      const numSets = def.defaultSets || 3;
                      const sets = Array.from({ length: numSets }, (_, i) => {
                        const ls = last?.sets?.[i] || last?.sets?.[0];
                        return { weight: ls?.weight ?? '', reps: ls?.reps ?? (def.defaultReps || ''), duration: ls?.duration ?? (def.defaultDuration || ''), rpe: null, pain: null, done: false };
                      });
                      setSession(prev => {
                        const updated = { ...prev, exercises: [...prev.exercises, { id, sets }] };
                        setActiveSession(updated);
                        return updated;
                      });
                      setExIdx(session.exercises.length);
                      setShowAddEx(false);
                    }} style={{
                      ...st.card(), width: '100%', textAlign: 'left', cursor: 'pointer',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '10px 14px', background: ex.isCustom ? C.amber + '0a' : C.card,
                    }}>
                      <span style={{ fontSize: 13 }}>{ex.name}</span>
                      <span style={st.pill(ex.isCustom ? C.amber : C.muted)}>{ex.muscle}</span>
                    </button>
                  ))
                }
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Finisher ─────────────────────────────────────────────────────────
  if (phase === 'finisher' && session) {
    const wkt = WORKOUTS[session.workout];
    return (
      <div style={{ padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <div style={st.h2}>Finisher</div>
          <div style={{ ...st.mono(16, C.muted) }}>{fmtTimer(elapsed)}</div>
        </div>
        <div style={{ ...st.label, marginBottom: 16 }}>Cool-down · {session.workout}</div>
        <div style={{ ...st.col(), marginBottom: 20 }}>
          {wkt.finisher.map((item, i) => (
            <div key={i} style={{ ...st.card(), display: 'flex', gap: 12, padding: '12px 14px' }}>
              <div style={{ color: C.amber, fontFamily: C.fMono, minWidth: 18 }}>{i + 1}</div>
              <div style={{ fontSize: 13 }}>{item}</div>
            </div>
          ))}
        </div>
        <div style={{ ...st.label, marginBottom: 6 }}>Session notes (optional)</div>
        <textarea
          style={{ ...st.inp, textAlign: 'left', minHeight: 72, resize: 'vertical', marginBottom: 16, fontSize: 13, padding: 10 }}
          placeholder="How did it feel? Any niggles or things to note..."
          value={session.notes}
          onChange={e => setSession(p => ({ ...p, notes: e.target.value }))}
        />
        <button style={{ ...st.btn(C.green) }} onClick={completeWorkout}>Complete Session ✓</button>
      </div>
    );
  }

  // ── Done ──────────────────────────────────────────────────────────────
  if (phase === 'done') {
    return (
      <div style={{ padding: 16, textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>💪</div>
        <div style={{ ...st.h1, marginBottom: 6 }}>Session Complete</div>
        <div style={{ ...st.label, marginBottom: 24 }}>Workout {session?.workout} · {session?.duration} min</div>

        {prs.length > 0 && (
          <div style={{ ...st.card(C.green + '10'), borderColor: C.green + '44', marginBottom: 16, textAlign: 'left' }}>
            <div style={{ ...st.label, color: C.green, marginBottom: 8 }}>🏆 New Personal Records</div>
            {prs.map((pr, i) => (
              <div key={i} style={{ fontSize: 13, color: C.green, fontFamily: C.fMono }}>{pr.name} — {pr.weight}kg</div>
            ))}
          </div>
        )}

        {nudges.length > 0 && (
          <div style={{ ...st.card(C.amber + '10'), borderColor: C.amber + '44', marginBottom: 16, textAlign: 'left' }}>
            <div style={{ ...st.label, color: C.amber, marginBottom: 8 }}>◈ Progressive Overload</div>
            {nudges.map((n, i) => (
              <div key={i} style={{ fontSize: 12, color: C.amber, marginBottom: 2 }}>{n} — ready to increase load</div>
            ))}
          </div>
        )}

        <button style={{ ...st.btn(), marginBottom: 8 }} onClick={() => setView('dashboard')}>Back to Home</button>
        <button style={{ ...st.ghost }} onClick={() => setView('progress')}>View Progress Charts</button>
      </div>
    );
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════════════
// HISTORY
// ═══════════════════════════════════════════════════════════════════════
function History({ sessions, allExercises = EXERCISES }) {
  const [expanded, setExpanded] = useState(null);
  const sorted = [...sessions].reverse();

  if (!sessions.length) return (
    <div style={{ padding: 16, textAlign: 'center', color: C.muted, paddingTop: 64 }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>◫</div>
      <div style={{ fontFamily: C.fDisplay, fontSize: 16, textTransform: 'uppercase', color: C.muted }}>No sessions yet</div>
    </div>
  );

  return (
    <div style={{ padding: 16 }}>
      <div style={{ ...st.h2, marginBottom: 16 }}>Session Log</div>
      <div style={{ ...st.col() }}>
        {sorted.map(sess => (
          <div key={sess.id} style={{ ...st.card(), overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
              onClick={() => setExpanded(expanded === sess.id ? null : sess.id)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontFamily: C.fDisplay, fontSize: 34, color: C.amber, lineHeight: 1 }}>{sess.workout}</span>
                <div>
                  <div style={{ fontFamily: C.fDisplay, fontSize: 14, textTransform: 'uppercase', letterSpacing: 0.5 }}>{WORKOUTS[sess.workout].title}</div>
                  <div style={{ ...st.mono(11, C.muted) }}>{fmtDate(sess.date)}</div>
                </div>
              </div>
              <div style={{ ...st.row, gap: 6 }}>
                {sess.energy && <span style={{ fontSize: 14 }}>{'😴😕😐💪🔥'[sess.energy - 1]}</span>}
                {sess.duration && <span style={st.pill(C.muted)}>{sess.duration}min</span>}
                <span style={{ color: C.muted, fontSize: 12 }}>{expanded === sess.id ? '▲' : '▼'}</span>
              </div>
            </div>

            {expanded === sess.id && (
              <div style={{ marginTop: 12, borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
                {sess.exercises?.map(ex => {
                  const def = allExercises[ex.id] || EXERCISES[ex.id];
                  return (
                    <div key={ex.id} style={{ marginBottom: 10 }}>
                      <div style={{ ...st.label, marginBottom: 4 }}>{def?.name}</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {ex.sets.map((s, i) => {
                          const display = def?.isTimed ? `${s.duration}s` : def?.unit === 'bw' || def?.unit === 'band' ? `${s.reps} reps` : `${s.weight}kg × ${s.reps}`;
                          return (
                            <span key={i} style={{ ...st.pill(s.done ? C.text : C.muted), fontSize: 11 }}>
                              {display}{s.rpe ? ` r${s.rpe}` : ''}
                            </span>
                          );
                        })}
                      </div>
                      {ex.notes && (
                        <div style={{ fontSize: 11, color: C.muted, fontStyle: 'italic', marginTop: 4 }}>
                          {'\uD83D\uDCDD'} {ex.notes}
                        </div>
                      )}
                    </div>
                  );
                })}
                {sess.notes && <div style={{ marginTop: 8, fontSize: 13, color: C.muted, fontStyle: 'italic', borderTop: `1px solid ${C.dim}`, paddingTop: 8 }}>"{sess.notes}"</div>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// MINI SVG LINE CHART  (no external library)
// ═══════════════════════════════════════════════════════════════════════
function MiniLineChart({ data, dataKey, color, height = 160, domain }) {
  const [tooltip, setTooltip] = useState(null);
  const PAD = { top: 12, right: 12, bottom: 28, left: 38 };

  const vals = data.map(d => d[dataKey]).filter(v => v != null && !isNaN(v));
  if (vals.length < 2) return null;

  const rawMin = domain ? domain[0] : Math.min(...vals);
  const rawMax = domain ? domain[1] : Math.max(...vals);
  const pad    = rawMax === rawMin ? 1 : (rawMax - rawMin) * 0.1;
  const yMin   = rawMin - pad;
  const yMax   = rawMax + pad;

  // We use a fixed render width for coordinate maths; CSS scales it.
  const W = 320;
  const H = height;
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top  - PAD.bottom;

  const xOf = i  => PAD.left + (i / (data.length - 1)) * innerW;
  const yOf = v  => PAD.top  + innerH - ((v - yMin) / (yMax - yMin)) * innerH;

  // Y-axis ticks
  const tickCount = 4;
  const yTicks = Array.from({ length: tickCount + 1 }, (_, i) => {
    const v = yMin + (i / tickCount) * (yMax - yMin);
    return { v: Math.round(v * 10) / 10, y: yOf(v) };
  });

  // Build polyline points (skip nulls)
  const segments = [];
  let cur = [];
  data.forEach((d, i) => {
    const v = d[dataKey];
    if (v != null && !isNaN(v)) { cur.push(`${xOf(i)},${yOf(v)}`); }
    else if (cur.length) { segments.push(cur); cur = []; }
  });
  if (cur.length) segments.push(cur);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: '100%', height, display: 'block' }}
        onMouseLeave={() => setTooltip(null)}
      >
        {/* Grid lines */}
        {yTicks.map(({ y }, i) => (
          <line key={i} x1={PAD.left} x2={W - PAD.right} y1={y} y2={y}
            stroke={C.border} strokeWidth={1} strokeDasharray="2 4" />
        ))}

        {/* Y-axis labels */}
        {yTicks.map(({ v, y }, i) => (
          <text key={i} x={PAD.left - 5} y={y + 4}
            textAnchor="end" fill={C.muted} fontSize={9} fontFamily="JetBrains Mono, monospace">
            {v}
          </text>
        ))}

        {/* X-axis labels (show up to 6 evenly spaced) */}
        {data.map((d, i) => {
          const step = Math.max(1, Math.floor(data.length / 6));
          if (i % step !== 0 && i !== data.length - 1) return null;
          return (
            <text key={i} x={xOf(i)} y={H - 6}
              textAnchor="middle" fill={C.muted} fontSize={9} fontFamily="JetBrains Mono, monospace">
              {d.date}
            </text>
          );
        })}

        {/* Lines */}
        {segments.map((pts, si) => (
          <polyline key={si} points={pts.join(' ')}
            fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" />
        ))}

        {/* Dots + hit areas */}
        {data.map((d, i) => {
          const v = d[dataKey];
          if (v == null || isNaN(v)) return null;
          const cx = xOf(i), cy = yOf(v);
          return (
            <g key={i}>
              <circle cx={cx} cy={cy} r={3} fill={color} />
              <circle cx={cx} cy={cy} r={14} fill="transparent"
                onMouseEnter={() => setTooltip({ i, x: cx, y: cy, v, date: d.date })}
                style={{ cursor: 'crosshair' }} />
            </g>
          );
        })}

        {/* Tooltip */}
        {tooltip && (() => {
          const tx = tooltip.x > W * 0.7 ? tooltip.x - 64 : tooltip.x + 8;
          const ty = tooltip.y < PAD.top + 28 ? tooltip.y + 6 : tooltip.y - 28;
          return (
            <g>
              <rect x={tx} y={ty} width={60} height={22} rx={3}
                fill={C.card} stroke={C.border} strokeWidth={1} />
              <text x={tx + 30} y={ty + 15} textAnchor="middle"
                fill={C.text} fontSize={10} fontFamily="JetBrains Mono, monospace">
                {tooltip.date}: {tooltip.v}
              </text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// PROGRESS
// ═══════════════════════════════════════════════════════════════════════
function Progress({ sessions, allExercises = EXERCISES }) {
  const exKeys = Object.keys(allExercises);
  const [selEx, setSelEx] = useState(exKeys[0]);

  const def = allExercises[selEx] || EXERCISES[selEx];

  const data = sessions
    .filter(s => s.exercises?.some(e => e.id === selEx))
    .map(s => {
      const ex = s.exercises.find(e => e.id === selEx);
      if (!ex) return null;
      const weights = ex.sets.map(s => Number(s.weight) || 0);
      const reps    = ex.sets.map(s => Number(s.reps)   || 0);
      const volume  = ex.sets.reduce((t, s) => t + (Number(s.weight)||0) * (Number(s.reps)||0), 0);
      const maxRPE  = Math.max(...ex.sets.map(s => Number(s.rpe) || 0).filter(Boolean));
      return {
        date:   fmtShortDate(s.date),
        weight: def.unit === 'kg' ? (Math.max(...weights) || null) : null,
        reps:   Math.max(...reps) || null,
        volume: volume || null,
        rpe:    maxRPE || null,
      };
    }).filter(Boolean);

  if (!sessions.length) return (
    <div style={{ padding: 16, textAlign: 'center', color: C.muted, paddingTop: 64 }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>▲</div>
      <div style={{ fontFamily: C.fDisplay, fontSize: 16, textTransform: 'uppercase' }}>No data yet</div>
    </div>
  );

  return (
    <div style={{ padding: 16 }}>
      <div style={{ ...st.h2, marginBottom: 16 }}>Progress</div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ ...st.label, marginBottom: 6 }}>Exercise</div>
        <select value={selEx} onChange={e => setSelEx(e.target.value)}
          style={{ ...st.inp, textAlign: 'left', fontSize: 14, padding: '10px 12px' }}>
          {exKeys.map(id => <option key={id} value={id}>{allExercises[id]?.name || id}</option>)}
        </select>
      </div>

      {data.length < 2 ? (
        <div style={{ ...st.card(), textAlign: 'center', color: C.muted, padding: 32, fontSize: 13 }}>
          Need at least 2 sessions with this exercise to show a trend.
        </div>
      ) : (
        <div style={{ ...st.col(12) }}>
          {def.unit === 'kg' && (
            <div style={{ ...st.card() }}>
              <div style={{ ...st.label, marginBottom: 8 }}>Top Set Weight (kg)</div>
              <MiniLineChart data={data} dataKey="weight" color={C.amber} height={160} />
            </div>
          )}
          {(def.unit === 'bw' || def.unit === 'band') && (
            <div style={{ ...st.card() }}>
              <div style={{ ...st.label, marginBottom: 8 }}>Top Set Reps</div>
              <MiniLineChart data={data} dataKey="reps" color={C.green} height={160} />
            </div>
          )}
          {def.unit === 'kg' && data.some(d => d.volume) && (
            <div style={{ ...st.card() }}>
              <div style={{ ...st.label, marginBottom: 8 }}>Session Volume (kg total)</div>
              <MiniLineChart data={data} dataKey="volume" color={C.blue} height={140} />
            </div>
          )}
          {data.some(d => d.rpe) && (
            <div style={{ ...st.card() }}>
              <div style={{ ...st.label, marginBottom: 8 }}>Session RPE</div>
              <MiniLineChart data={data} dataKey="rpe" color={C.purple} height={130} domain={[5, 10]} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// RIDES
// ═══════════════════════════════════════════════════════════════════════
function Rides({ rides, setRides }) {
  const [open, setOpen] = useState(false);
  const [dur, setDur] = useState('');
  const [rpe, setRpe] = useState('');
  const [type, setType] = useState('easy');
  const [notes, setNotes] = useState('');

  function log() {
    if (!dur) return;
    setRides(p => [...p, { id: Date.now().toString(), date: new Date().toISOString(), duration: +dur, effort: rpe ? +rpe : null, type, notes }]);
    setOpen(false); setDur(''); setRpe(''); setType('easy'); setNotes('');
  }

  const typeColor = { easy: C.muted, sprinkles: C.blue, long: C.green };
  const sorted = [...rides].reverse();

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={st.h2}>Rides</div>
        <button style={{ ...st.btnSm(), padding: '8px 14px' }} onClick={() => setOpen(!open)}>+ Log Ride</button>
      </div>

      {open && (
        <div style={{ ...st.card(), marginBottom: 16 }}>
          <div style={{ ...st.col(12) }}>
            <div>
              <div style={{ ...st.label, marginBottom: 5 }}>Duration (minutes)</div>
              <input type="number" inputMode="numeric" value={dur} onChange={e => setDur(e.target.value)} style={{ ...st.inp }} placeholder="e.g. 30" />
            </div>
            <div>
              <div style={{ ...st.label, marginBottom: 5 }}>Ride type</div>
              <select value={type} onChange={e => setType(e.target.value)} style={{ ...st.inp, textAlign: 'left', padding: '10px 12px' }}>
                <option value="easy">Easy (conversational)</option>
                <option value="sprinkles">Sprinkles (intervals)</option>
                <option value="long">Long easy</option>
              </select>
            </div>
            <div>
              <div style={{ ...st.label, marginBottom: 5 }}>Effort (1–10)</div>
              <input type="number" inputMode="numeric" min="1" max="10" value={rpe} onChange={e => setRpe(e.target.value)} style={{ ...st.inp }} placeholder="e.g. 5" />
            </div>
            <div>
              <div style={{ ...st.label, marginBottom: 5 }}>Notes</div>
              <input type="text" value={notes} onChange={e => setNotes(e.target.value)} style={{ ...st.inp, textAlign: 'left', padding: '10px 12px' }} placeholder="How was it?" />
            </div>
            <button style={{ ...st.btn() }} onClick={log}>Save Ride</button>
          </div>
        </div>
      )}

      {/* Programme guide */}
      <div style={{ ...st.card(), marginBottom: 16, padding: '12px 14px' }}>
        <div style={{ ...st.label, marginBottom: 8 }}>Programme Guide</div>
        {[
          { phase: 'Wks 1–2', text: '2 rides/week · 20–30 min easy · conversational pace' },
          { phase: 'Wks 3–4', text: '2–3/week · 25–40 min · optional 6 × 20s slightly harder' },
          { phase: 'Wk 5+',   text: '3/week · long easy (45–60), easy (25–35), sprinkles (8 × 30s)' },
        ].map((r, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, fontSize: 12, padding: '4px 0', borderBottom: i < 2 ? `1px solid ${C.dim}` : 'none' }}>
            <span style={{ fontFamily: C.fMono, color: C.amber, minWidth: 56 }}>{r.phase}</span>
            <span style={{ color: C.muted }}>{r.text}</span>
          </div>
        ))}
      </div>

      {!rides.length ? (
        <div style={{ textAlign: 'center', color: C.muted, paddingTop: 32 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>○</div>
          <div style={{ fontFamily: C.fDisplay, fontSize: 14, textTransform: 'uppercase' }}>No rides logged yet</div>
        </div>
      ) : (
        <div style={{ ...st.col() }}>
          {sorted.map(r => (
            <div key={r.id} style={{ ...st.card(), display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px' }}>
              <div>
                <div style={{ ...st.row, marginBottom: 4 }}>
                  <span style={st.pill(typeColor[r.type] || C.muted)}>{r.type}</span>
                  {r.effort && <span style={{ ...st.mono(11, C.muted) }}>RPE {r.effort}</span>}
                </div>
                {r.notes && <div style={{ fontSize: 12, color: C.muted }}>{r.notes}</div>}
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: C.fMono, fontSize: 22, color: C.text, lineHeight: 1 }}>{r.duration}<span style={{ fontSize: 11, color: C.muted }}>min</span></div>
                <div style={{ ...st.mono(10, C.muted) }}>{fmtDate(r.date)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// PRESET EXERCISE LIBRARY
// ═══════════════════════════════════════════════════════════════════════
const PRESET_LIBRARY = {
  // ── Arms: Biceps ──────────────────────────────────────────────────
  p_db_bicep_curl:      { name: 'Dumbbell Bicep Curl',        muscle: 'Arms',      unit: 'kg',   defaultSets: 3, defaultReps: 10, repMax: 12, cue: 'Keep elbows tucked to sides. Full range, controlled descent.', demo: YT('dumbbell+bicep+curl+proper+form') },
  p_barbell_curl:       { name: 'Barbell Curl',               muscle: 'Arms',      unit: 'kg',   defaultSets: 3, defaultReps: 8,  repMax: 10, cue: 'Shoulder-width grip. No swinging. Squeeze at the top.',        demo: YT('barbell+curl+proper+form+tutorial') },
  p_hammer_curl:        { name: 'Hammer Curl',                muscle: 'Arms',      unit: 'kg',   defaultSets: 3, defaultReps: 10, repMax: 12, cue: 'Neutral grip (thumbs up). Targets brachialis and forearms.',    demo: YT('hammer+curl+form+tutorial') },
  p_concentration_curl: { name: 'Concentration Curl',         muscle: 'Arms',      unit: 'kg',   defaultSets: 3, defaultReps: 12, repMax: 12, cue: 'Elbow braced on inner thigh. Slow and deliberate.',            demo: YT('concentration+curl+tutorial+form') },
  p_preacher_curl:      { name: 'Preacher Curl',              muscle: 'Arms',      unit: 'kg',   defaultSets: 3, defaultReps: 10, repMax: 10, cue: 'Arm supported on pad. Do not let elbow fully lock out.',        demo: YT('preacher+curl+tutorial+form') },
  // ── Arms: Triceps ─────────────────────────────────────────────────
  p_tricep_pushdown:    { name: 'Tricep Pushdown',            muscle: 'Arms',      unit: 'band', defaultSets: 3, defaultReps: 12, repMax: 15, cue: 'Elbows at sides, push down to full extension. Control return.', demo: YT('tricep+pushdown+band+cable+form') },
  p_overhead_ext:       { name: 'Tricep Overhead Extension',  muscle: 'Arms',      unit: 'kg',   defaultSets: 3, defaultReps: 10, repMax: 12, cue: 'Upper arms vertical. Only forearms move. Keep core braced.',    demo: YT('tricep+overhead+extension+dumbbell+form') },
  p_skull_crushers:     { name: 'Skull Crushers',             muscle: 'Arms',      unit: 'kg',   defaultSets: 3, defaultReps: 8,  repMax: 10, cue: 'Lower bar to forehead slowly. Keep elbows narrow and vertical.', demo: YT('skull+crushers+proper+form+tutorial') },
  p_tricep_dips:        { name: 'Tricep Dips',                muscle: 'Arms',      unit: 'bw',   defaultSets: 3, defaultReps: 8,  repMax: 12, cue: 'Hands on bench behind you. Lower slowly, elbows back.',        demo: YT('tricep+dips+bench+form+tutorial') },
  p_close_grip_bench:   { name: 'Close-Grip Bench Press',     muscle: 'Arms',      unit: 'kg',   defaultSets: 3, defaultReps: 8,  repMax: 10, cue: 'Hands shoulder-width. Elbows close to body throughout.',       demo: YT('close+grip+bench+press+form+tutorial') },
  p_diamond_pushup:     { name: 'Diamond Push-Up',            muscle: 'Arms',      unit: 'bw',   defaultSets: 3, defaultReps: 8,  repMax: 15, cue: 'Hands form a diamond shape. Elbows track back, not out.',      demo: YT('diamond+push+up+form+tutorial') },
  // ── Shoulders ─────────────────────────────────────────────────────
  p_lateral_raise:      { name: 'Lateral Raise',              muscle: 'Shoulders', unit: 'kg',   defaultSets: 3, defaultReps: 12, repMax: 15, cue: 'Slight bend in elbows. Raise to shoulder height only. Light weight.', demo: YT('lateral+raise+proper+form+tutorial') },
  p_front_raise:        { name: 'Front Raise',                muscle: 'Shoulders', unit: 'kg',   defaultSets: 3, defaultReps: 12, repMax: 12, cue: 'Arms straight, raise to eye level. Avoid shoulder impingement.', demo: YT('front+raise+dumbbell+form+tutorial') },
  p_db_shoulder_press:  { name: 'DB Shoulder Press',          muscle: 'Shoulders', unit: 'kg',   defaultSets: 3, defaultReps: 8,  repMax: 10, cue: 'Start at ear level, press overhead. Avoid arching lower back.', demo: YT('dumbbell+shoulder+press+form+tutorial') },
  p_arnold_press:       { name: 'Arnold Press',               muscle: 'Shoulders', unit: 'kg',   defaultSets: 3, defaultReps: 10, repMax: 10, cue: 'Rotate palms as you press — in to out. Covers all three delt heads.', demo: YT('arnold+press+form+tutorial') },
  p_rear_delt_fly:      { name: 'Rear Delt Fly',              muscle: 'Shoulders', unit: 'kg',   defaultSets: 3, defaultReps: 15, repMax: 15, cue: 'Hinge at hips, slight bend in elbows. Lead with elbows back.',  demo: YT('rear+delt+fly+dumbbell+form+tutorial') },
  p_band_face_pull:     { name: 'Face Pull',                  muscle: 'Shoulders', unit: 'band', defaultSets: 3, defaultReps: 15, repMax: 20, cue: 'Pull to face level, elbows high. Great for shoulder health.',   demo: YT('face+pull+band+cable+form+tutorial') },
  p_shrugs:             { name: 'Dumbbell Shrugs',            muscle: 'Shoulders', unit: 'kg',   defaultSets: 3, defaultReps: 15, repMax: 15, cue: 'Straight up and down. No rolling. Hold at top 1 sec.',          demo: YT('dumbbell+shrugs+form+tutorial') },
  // ── Push: Chest ───────────────────────────────────────────────────
  p_push_up:            { name: 'Push-Up',                    muscle: 'Push',      unit: 'bw',   defaultSets: 3, defaultReps: 10, repMax: 20, cue: 'Straight body, elbows 45°. Lower chest to floor.',              demo: YT('push+up+proper+form+tutorial') },
  p_db_fly:             { name: 'Dumbbell Fly',               muscle: 'Push',      unit: 'kg',   defaultSets: 3, defaultReps: 12, repMax: 12, cue: 'Slight bend in elbows throughout. Wide arc, feel the stretch.', demo: YT('dumbbell+fly+proper+form+tutorial') },
  p_incline_db_press:   { name: 'Incline DB Press',           muscle: 'Push',      unit: 'kg',   defaultSets: 3, defaultReps: 10, repMax: 10, cue: '30–45° incline. Elbows at 45°. Targets upper chest.',           demo: YT('incline+dumbbell+press+form+tutorial') },
  p_chest_dip:          { name: 'Chest Dip',                  muscle: 'Push',      unit: 'bw',   defaultSets: 3, defaultReps: 8,  repMax: 12, cue: 'Lean slightly forward. Elbows flare to target chest.',          demo: YT('chest+dip+form+tutorial') },
  p_cable_fly:          { name: 'Cable Fly',                  muscle: 'Push',      unit: 'kg',   defaultSets: 3, defaultReps: 12, repMax: 15, cue: 'Arms arc in a hugging motion. Squeeze at the midpoint.',        demo: YT('cable+fly+chest+form+tutorial') },
  // ── Pull: Back ────────────────────────────────────────────────────
  p_pull_up:            { name: 'Pull-Up',                    muscle: 'Pull',      unit: 'bw',   defaultSets: 3, defaultReps: 5,  repMax: 10, cue: 'Full hang to chin over bar. Engage lats, not just arms.',       demo: YT('pull+up+proper+form+tutorial+beginners') },
  p_lat_pulldown:       { name: 'Lat Pulldown',               muscle: 'Pull',      unit: 'kg',   defaultSets: 3, defaultReps: 10, repMax: 12, cue: 'Pull bar to upper chest. Lean back slightly, lead with elbows.', demo: YT('lat+pulldown+proper+form+tutorial') },
  p_seated_cable_row:   { name: 'Seated Cable Row',           muscle: 'Pull',      unit: 'kg',   defaultSets: 3, defaultReps: 10, repMax: 12, cue: 'Sit tall. Pull to lower chest. Squeeze shoulder blades together.', demo: YT('seated+cable+row+form+tutorial') },
  p_t_bar_row:          { name: 'T-Bar Row',                  muscle: 'Pull',      unit: 'kg',   defaultSets: 3, defaultReps: 8,  repMax: 10, cue: 'Neutral spine, hinge at hips. Pull to lower chest.',            demo: YT('t+bar+row+form+tutorial') },
  p_straight_arm_pd:    { name: 'Straight-Arm Pulldown',      muscle: 'Pull',      unit: 'kg',   defaultSets: 3, defaultReps: 12, repMax: 15, cue: 'Arms straight. Hinge at shoulder only. Excellent lat isolation.', demo: YT('straight+arm+pulldown+form+tutorial') },
  p_good_morning:       { name: 'Good Morning',               muscle: 'Hinge',     unit: 'kg',   defaultSets: 3, defaultReps: 10, repMax: 12, cue: 'Soft knee bend. Hinge at hips, keep back flat. Light weight.',   demo: YT('good+morning+exercise+form+tutorial') },
  // ── Legs ──────────────────────────────────────────────────────────
  p_rdl:                { name: 'Romanian Deadlift',          muscle: 'Hinge',     unit: 'kg',   defaultSets: 3, defaultReps: 10, repMax: 10, cue: 'Hinge at hips, soft knee bend. Bar stays close to legs. Feel hamstring stretch.', demo: YT('romanian+deadlift+form+tutorial+beginners') },
  p_bulgarian_squat:    { name: 'Bulgarian Split Squat',      muscle: 'Legs',      unit: 'kg',   defaultSets: 3, defaultReps: 8,  repMax: 8,  cue: 'Rear foot elevated. Front knee tracks over toes. Stay upright.', demo: YT('bulgarian+split+squat+form+tutorial'), perSide: true },
  p_leg_press:          { name: 'Leg Press',                  muscle: 'Legs',      unit: 'kg',   defaultSets: 3, defaultReps: 10, repMax: 12, cue: 'Feet hip-width. Do not lock knees at top. Full range.',         demo: YT('leg+press+proper+form+tutorial') },
  p_leg_extension:      { name: 'Leg Extension',              muscle: 'Legs',      unit: 'kg',   defaultSets: 3, defaultReps: 12, repMax: 15, cue: 'Extend fully, hold 1 sec, lower controlled. Isolates quads.',    demo: YT('leg+extension+machine+form+tutorial') },
  p_seated_leg_curl:    { name: 'Seated Leg Curl',            muscle: 'Legs',      unit: 'kg',   defaultSets: 3, defaultReps: 12, repMax: 12, cue: 'Curl to full flexion. Control the return. Hamstring isolation.', demo: YT('seated+leg+curl+machine+form+tutorial') },
  p_sumo_squat:         { name: 'Sumo Squat',                 muscle: 'Legs',      unit: 'kg',   defaultSets: 3, defaultReps: 10, repMax: 12, cue: 'Wide stance, toes out. Knees track over toes. Targets inner thigh.', demo: YT('sumo+squat+form+tutorial') },
  p_nordic_curl:        { name: 'Nordic Curl',                muscle: 'Legs',      unit: 'bw',   defaultSets: 3, defaultReps: 4,  repMax: 8,  cue: 'Anchor feet, lower slowly. Very challenging. Use arms to push back up.', demo: YT('nordic+curl+hamstring+tutorial') },
  p_wall_sit:           { name: 'Wall Sit',                   muscle: 'Legs',      unit: 'bw',   defaultSets: 3, defaultReps: null, defaultDuration: 30, repMax: null, cue: 'Back flat on wall, thighs parallel to floor. Hold.',   demo: YT('wall+sit+exercise+tutorial'), isTimed: true },
  // ── Glutes ────────────────────────────────────────────────────────
  p_cable_kickback:     { name: 'Cable Kickback',             muscle: 'Glutes',    unit: 'kg',   defaultSets: 3, defaultReps: 15, repMax: 15, cue: 'Slight hinge, kick back and up. Squeeze glute at top.',         demo: YT('cable+kickback+glute+form+tutorial'), perSide: true },
  p_hip_abduction:      { name: 'Hip Abduction',              muscle: 'Glutes',    unit: 'kg',   defaultSets: 3, defaultReps: 15, repMax: 20, cue: 'Push knees outward against resistance. Targets glute med.',      demo: YT('hip+abduction+machine+band+form+tutorial') },
  p_frog_pumps:         { name: 'Frog Pumps',                 muscle: 'Glutes',    unit: 'bw',   defaultSets: 3, defaultReps: 20, repMax: 30, cue: 'Soles of feet together. Drive hips up. Great glute activation.', demo: YT('frog+pumps+glute+exercise+tutorial') },
  p_donkey_kick:        { name: 'Donkey Kicks',               muscle: 'Glutes',    unit: 'bw',   defaultSets: 3, defaultReps: 15, repMax: 20, cue: 'On all fours. Kick heel toward ceiling, squeeze glute at top.',  demo: YT('donkey+kicks+exercise+form+tutorial'), perSide: true },
  p_clamshell:          { name: 'Clamshell',                  muscle: 'Glutes',    unit: 'band', defaultSets: 3, defaultReps: 15, repMax: 20, cue: 'Side-lying. Rotate top knee up like a clamshell. Band optional.', demo: YT('clamshell+exercise+form+tutorial'), perSide: true },
  // ── Core ──────────────────────────────────────────────────────────
  p_plank:              { name: 'Plank',                      muscle: 'Core',      unit: 'bw',   defaultSets: 3, defaultReps: null, defaultDuration: 30, repMax: null, cue: 'Forearms or hands. Straight line head to heels. Brace hard.', demo: YT('plank+proper+form+tutorial'), isTimed: true },
  p_side_plank:         { name: 'Side Plank',                 muscle: 'Core',      unit: 'bw',   defaultSets: 2, defaultReps: null, defaultDuration: 25, repMax: null, cue: 'Hip off floor, straight line. Stack feet or stagger.',      demo: YT('side+plank+form+tutorial'), isTimed: true, perSide: true },
  p_dead_bug:           { name: 'Dead Bug',                   muscle: 'Core',      unit: 'bw',   defaultSets: 3, defaultReps: 10, repMax: 12, cue: 'Lower back pressed to floor. Opposite arm and leg extend slowly.', demo: YT('dead+bug+exercise+form+tutorial') },
  p_bird_dog:           { name: 'Bird Dog',                   muscle: 'Core',      unit: 'bw',   defaultSets: 3, defaultReps: 10, repMax: 12, cue: 'On all fours. Extend opposite arm and leg. Keep hips level.',    demo: YT('bird+dog+exercise+form+tutorial'), perSide: true },
  p_ab_wheel:           { name: 'Ab Wheel Rollout',           muscle: 'Core',      unit: 'bw',   defaultSets: 3, defaultReps: 6,  repMax: 10, cue: 'From knees. Roll out slowly, pull back in. Do not let hips sag.', demo: YT('ab+wheel+rollout+form+tutorial+beginners') },
  p_hanging_knee_raise: { name: 'Hanging Knee Raise',         muscle: 'Core',      unit: 'bw',   defaultSets: 3, defaultReps: 10, repMax: 15, cue: 'Hang from bar. Bring knees to chest, lower slowly.',            demo: YT('hanging+knee+raise+form+tutorial') },
  p_russian_twist:      { name: 'Russian Twist',              muscle: 'Core',      unit: 'kg',   defaultSets: 3, defaultReps: 20, repMax: 20, cue: 'Lean back slightly, feet up. Rotate side to side with control.',  demo: YT('russian+twist+exercise+form+tutorial') },
  p_cable_crunch:       { name: 'Cable Crunch',               muscle: 'Core',      unit: 'kg',   defaultSets: 3, defaultReps: 15, repMax: 20, cue: 'Kneel, pull rope to floor. Round spine. Abs do the work.',       demo: YT('cable+crunch+abs+form+tutorial') },
};

// ═══════════════════════════════════════════════════════════════════════
// MANAGE (Exercise Library + Workout Builder)
// ═══════════════════════════════════════════════════════════════════════
const MUSCLE_FILTERS = ['All','Arms','Shoulders','Push','Pull','Hinge','Legs','Glutes','Core'];
const EMPTY_FORM = { name: '', muscle: 'Arms', unit: 'kg', defaultSets: 3, defaultReps: 10, repMax: 10, cue: '' };

function Manage({ customExercises, setCustomExercises, workoutCustom, setWorkoutCustom, allExercises }) {
  const [tab, setTab] = useState('library');
  const [search, setSearch] = useState('');
  const [muscle, setMuscle] = useState('All');
  const [addWktPicker, setAddWktPicker] = useState(null); // exId being placed into a workout
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [wktTab, setWktTab] = useState('A');
  const [addingTo, setAddingTo] = useState(null);
  const [wktSearch, setWktSearch] = useState('');

  // All exercises that can be browsed/added (presets + user-created custom)
  const libraryEntries = [
    ...Object.entries(PRESET_LIBRARY),
    ...Object.entries(customExercises),
  ];

  const allInAnyWorkout = new Set(
    ['A','B','C'].flatMap(k => [...WORKOUTS[k].exercises, ...(workoutCustom[k] || [])])
  );

  const filtered = libraryEntries.filter(([, ex]) => {
    const mMatch = muscle === 'All' || ex.muscle === muscle;
    const sMatch = !search.trim() || ex.name.toLowerCase().includes(search.toLowerCase());
    return mMatch && sMatch;
  });

  function addToWorkout(wKey, exId) {
    setWorkoutCustom(prev => ({ ...prev, [wKey]: [...(prev[wKey] || []), exId] }));
    setAddWktPicker(null);
    setAddingTo(null);
  }

  function removeFromWorkout(wKey, exId) {
    setWorkoutCustom(prev => ({ ...prev, [wKey]: (prev[wKey] || []).filter(id => id !== exId) }));
  }

  function saveCustom() {
    if (!form.name.trim()) return;
    const id = 'custom_' + Date.now();
    setCustomExercises(prev => ({ ...prev, [id]: {
      name: form.name.trim(), muscle: form.muscle, unit: form.unit,
      defaultSets: Number(form.defaultSets) || 3,
      defaultReps: Number(form.defaultReps) || 10,
      repMax: Number(form.repMax) || Number(form.defaultReps) || 10,
      cue: form.cue.trim(), isCustom: true,
    }}));
    setShowForm(false);
    setForm(EMPTY_FORM);
  }

  function deleteCustom(id) {
    setCustomExercises(prev => { const n = { ...prev }; delete n[id]; return n; });
    setWorkoutCustom(prev => {
      const n = { ...prev };
      Object.keys(n).forEach(k => { n[k] = (n[k] || []).filter(eid => eid !== id); });
      return n;
    });
  }

  const f = (field, val) => setForm(p => ({ ...p, [field]: val }));

  return (
    <div style={{ padding: 16 }}>
      <div style={{ ...st.h2, marginBottom: 16 }}>Manage</div>

      {/* Sub-tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', marginBottom: 20, border: `1px solid ${C.border}`, borderRadius: 6, overflow: 'hidden' }}>
        {[['library','Library'],['workouts','Workouts']].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            background: tab === id ? C.amber : C.dim, color: tab === id ? '#000' : C.muted,
            border: 'none', padding: '11px', fontFamily: C.fDisplay, fontSize: 13, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: 1, cursor: 'pointer',
          }}>{label}</button>
        ))}
      </div>

      {/* ── Library tab ── */}
      {tab === 'library' && (
        <div>
          {/* Search */}
          <input value={search} onChange={e => setSearch(e.target.value)}
            style={{ ...st.inp, textAlign: 'left', padding: '10px 12px', marginBottom: 10 }}
            placeholder="Search exercises…" />

          {/* Muscle filter pills */}
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8, marginBottom: 14 }}>
            {MUSCLE_FILTERS.map(m => (
              <button key={m} onClick={() => setMuscle(m)} style={{
                background: muscle === m ? C.amber : C.dim,
                color: muscle === m ? '#000' : C.muted,
                border: `1px solid ${muscle === m ? C.amber : C.border}`,
                borderRadius: 20, padding: '5px 12px', fontSize: 11, fontFamily: C.fMono,
                cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
              }}>{m}</button>
            ))}
          </div>

          {/* Exercise cards */}
          <div style={{ ...st.col(8), marginBottom: 20 }}>
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', color: C.muted, padding: 24, fontSize: 13 }}>No exercises match. Try creating a custom one below.</div>
            )}
            {filtered.map(([id, ex]) => {
              const inWorkouts = ['A','B','C'].filter(k =>
                [...WORKOUTS[k].exercises, ...(workoutCustom[k] || [])].includes(id)
              );
              const isAdding = addWktPicker === id;
              return (
                <div key={id} style={{ ...st.card(), borderColor: ex.isCustom ? C.amber + '44' : C.border }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                        <span style={{ fontFamily: C.fDisplay, fontSize: 16, textTransform: 'uppercase', letterSpacing: 0.5 }}>{ex.name}</span>
                        {ex.isCustom && <span style={{ ...st.pill(), fontSize: 9 }}>Custom</span>}
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <span style={st.pill(C.muted)}>{ex.muscle}</span>
                        <span style={{ ...st.mono(10, C.muted) }}>{ex.defaultSets} sets · {ex.isTimed ? `${ex.defaultDuration}s` : `${ex.defaultReps}${ex.repMax && ex.repMax !== ex.defaultReps ? '–' + ex.repMax : ''} reps`} · {ex.unit}</span>
                        {ex.perSide && <span style={st.pill(C.blue)}>Per side</span>}
                      </div>
                      {ex.cue && <div style={{ fontSize: 11, color: C.muted, marginTop: 5, lineHeight: 1.4 }}>{ex.cue}</div>}
                    </div>
                    {ex.isCustom && (
                      <button onClick={() => deleteCustom(id)} style={{ background: C.red + '18', border: `1px solid ${C.red}33`, borderRadius: 4, color: C.red, padding: '4px 8px', cursor: 'pointer', fontSize: 12, marginLeft: 8, flexShrink: 0 }}>✕</button>
                    )}
                  </div>

                  {/* Already-in badges */}
                  {inWorkouts.length > 0 && (
                    <div style={{ display: 'flex', gap: 4, marginBottom: 8, flexWrap: 'wrap' }}>
                      {inWorkouts.map(k => (
                        <span key={k} style={{ ...st.pill(C.green), fontSize: 9 }}>In Workout {k}</span>
                      ))}
                    </div>
                  )}

                  {/* Add to workout */}
                  {isAdding ? (
                    <div>
                      <div style={{ ...st.label, marginBottom: 6, fontSize: 9 }}>Add to which workout?</div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {['A','B','C'].map(k => {
                          const alreadyIn = [...WORKOUTS[k].exercises, ...(workoutCustom[k] || [])].includes(id);
                          return (
                            <button key={k} onClick={() => !alreadyIn && addToWorkout(k, id)} style={{
                              flex: 1, background: alreadyIn ? C.dim : C.amber, color: alreadyIn ? C.muted : '#000',
                              border: 'none', borderRadius: 4, padding: '8px', fontFamily: C.fDisplay,
                              fontSize: 16, fontWeight: 700, cursor: alreadyIn ? 'default' : 'pointer',
                              opacity: alreadyIn ? 0.4 : 1,
                            }}>{k}</button>
                          );
                        })}
                        <button onClick={() => setAddWktPicker(null)} style={{ ...st.btnSm(C.dim, C.muted), flex: 1 }}>✕</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => setAddWktPicker(id)} style={{ ...st.btnSm(), fontSize: 12, flex: 1 }}>
                        ＋ Add to Workout
                      </button>
                      {ex.demo && (
                        <a href={ex.demo} target="_blank" rel="noopener noreferrer" style={{
                          ...st.btnSm(C.dim, C.muted), fontSize: 11, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4,
                        }}>
                          <span style={{ color: C.red }}>▶</span> Demo
                        </a>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Create custom */}
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
            <div style={{ ...st.label, marginBottom: 8 }}>Can't find what you need?</div>
            <button style={{ ...st.btn(showForm ? C.dim : C.surface, showForm ? C.muted : C.amber), border: `1px solid ${showForm ? C.border : C.amber}`, marginBottom: showForm ? 12 : 0 }}
              onClick={() => { setShowForm(!showForm); setForm(EMPTY_FORM); }}>
              {showForm ? '✕ Cancel' : '＋ Create Custom Exercise'}
            </button>
            {showForm && (
              <div style={{ ...st.card(), borderColor: C.amber + '33' }}>
                <div style={{ ...st.col(12) }}>
                  <div>
                    <div style={{ ...st.label, marginBottom: 5 }}>Exercise Name *</div>
                    <input value={form.name} onChange={e => f('name', e.target.value)}
                      style={{ ...st.inp, textAlign: 'left', padding: '10px 12px' }} placeholder="e.g. Cable Lateral Raise" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <div style={{ ...st.label, marginBottom: 5 }}>Muscle Group</div>
                      <select value={form.muscle} onChange={e => f('muscle', e.target.value)} style={{ ...st.inp, textAlign: 'left', padding: '10px 8px' }}>
                        {['Arms','Shoulders','Push','Pull','Hinge','Legs','Glutes','Core','Balance','Other'].map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div>
                      <div style={{ ...st.label, marginBottom: 5 }}>Load Type</div>
                      <select value={form.unit} onChange={e => f('unit', e.target.value)} style={{ ...st.inp, textAlign: 'left', padding: '10px 8px' }}>
                        <option value="kg">Weight (kg)</option>
                        <option value="bw">Bodyweight</option>
                        <option value="band">Band</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                    <div><div style={{ ...st.label, marginBottom: 5 }}>Sets</div><input type="number" inputMode="numeric" value={form.defaultSets} onChange={e => f('defaultSets', e.target.value)} style={{ ...st.inp }} /></div>
                    <div><div style={{ ...st.label, marginBottom: 5 }}>Start Reps</div><input type="number" inputMode="numeric" value={form.defaultReps} onChange={e => f('defaultReps', e.target.value)} style={{ ...st.inp }} /></div>
                    <div><div style={{ ...st.label, marginBottom: 5 }}>Top Reps</div><input type="number" inputMode="numeric" value={form.repMax} onChange={e => f('repMax', e.target.value)} style={{ ...st.inp }} /></div>
                  </div>
                  <div>
                    <div style={{ ...st.label, marginBottom: 5 }}>Form Cue (optional)</div>
                    <input value={form.cue} onChange={e => f('cue', e.target.value)} style={{ ...st.inp, textAlign: 'left', padding: '10px 12px' }} placeholder="e.g. Keep elbows high throughout" />
                  </div>
                  <button style={{ ...st.btn(), opacity: form.name.trim() ? 1 : 0.4 }} onClick={saveCustom}>Save Exercise</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Workouts tab ── */}
      {tab === 'workouts' && (
        <div>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 14, lineHeight: 1.5 }}>
            Add exercises from the library to each workout permanently. Built-in exercises are locked.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 20 }}>
            {['A','B','C'].map(k => (
              <button key={k} onClick={() => { setWktTab(k); setAddingTo(null); setWktSearch(''); }} style={{
                background: wktTab === k ? C.amber : C.dim, color: wktTab === k ? '#000' : C.muted,
                border: 'none', borderRadius: 5, padding: '8px', fontFamily: C.fDisplay, fontSize: 18, fontWeight: 700, cursor: 'pointer',
              }}>{k}</button>
            ))}
          </div>

          {(() => {
            const key = wktTab;
            const baseIds = WORKOUTS[key].exercises;
            const extraIds = workoutCustom[key] || [];
            const inWorkout = new Set([...baseIds, ...extraIds]);
            const available = [...Object.entries(PRESET_LIBRARY), ...Object.entries(customExercises)]
              .filter(([id]) => !inWorkout.has(id))
              .filter(([, ex]) => !wktSearch || ex.name.toLowerCase().includes(wktSearch.toLowerCase()));

            return (
              <div>
                <div style={{ ...st.label, marginBottom: 4 }}>Workout {key} · {WORKOUTS[key].title}</div>
                <div style={{ ...st.col(4), marginBottom: 14 }}>
                  {baseIds.map(id => (
                    <div key={id} style={{ ...st.card(), display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px' }}>
                      <div><span style={{ fontSize: 13 }}>{allExercises[id]?.name || id}</span><span style={{ ...st.mono(10, C.muted), marginLeft: 8 }}>{allExercises[id]?.muscle}</span></div>
                      <span style={{ fontSize: 11, color: C.dim }}>🔒</span>
                    </div>
                  ))}
                  {extraIds.map(id => (
                    <div key={id} style={{ ...st.card(), display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderColor: C.amber + '44' }}>
                      <div><span style={{ fontSize: 13 }}>{allExercises[id]?.name || id}</span><span style={{ ...st.mono(10, C.muted), marginLeft: 8 }}>{allExercises[id]?.muscle}</span></div>
                      <button onClick={() => removeFromWorkout(key, id)} style={{ background: C.red + '18', border: `1px solid ${C.red}44`, borderRadius: 4, color: C.red, padding: '4px 8px', cursor: 'pointer', fontSize: 12 }}>✕</button>
                    </div>
                  ))}
                </div>

                {addingTo === key ? (
                  <div>
                    <input value={wktSearch} onChange={e => setWktSearch(e.target.value)}
                      style={{ ...st.inp, textAlign: 'left', padding: '10px 12px', marginBottom: 10 }}
                      placeholder="Search exercises…" autoFocus />
                    <div style={{ ...st.col(4), maxHeight: 340, overflowY: 'auto', marginBottom: 8 }}>
                      {available.length === 0
                        ? <div style={{ fontSize: 12, color: C.muted, padding: 16, textAlign: 'center' }}>{wktSearch ? 'No matches.' : 'All exercises already in this workout.'}</div>
                        : available.map(([id, ex]) => (
                          <button key={id} onClick={() => addToWorkout(key, id)} style={{
                            ...st.card(), width: '100%', textAlign: 'left', cursor: 'pointer',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '10px 14px', background: ex.isCustom ? C.amber + '0a' : C.card,
                          }}>
                            <div>
                              <div style={{ fontSize: 13 }}>{ex.name}</div>
                              <div style={{ ...st.mono(10, C.muted) }}>{ex.defaultSets}×{ex.isTimed ? ex.defaultDuration + 's' : ex.defaultReps + ' reps'} · {ex.unit}</div>
                            </div>
                            <span style={st.pill(ex.isCustom ? C.amber : C.muted)}>{ex.muscle}</span>
                          </button>
                        ))
                      }
                    </div>
                    <button style={{ ...st.ghost }} onClick={() => { setAddingTo(null); setWktSearch(''); }}>Cancel</button>
                  </div>
                ) : (
                  <button style={{ ...st.btn() }} onClick={() => setAddingTo(key)}>＋ Add Exercise to Workout {key}</button>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════════════════
export default function App() {
  const [view, setView] = useState('dashboard');
  const [sessions, setSessions] = useState([]);
  const [rides, setRides] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [selectedWorkout, setSelectedWorkout] = useState('A');
  const [customExercises, setCustomExercises] = useState({});
  const [workoutCustom, setWorkoutCustom] = useState({ A: [], B: [], C: [] });
  const [ready, setReady] = useState(false);
  const [driveSync, setDriveSync] = useState({ status: 'idle', lastSync: null, error: null });

  // Keep a ref to current data so export always uses the latest state
  const dataRef = useRef({});

  const allExercises = { ...EXERCISES, ...PRESET_LIBRARY, ...customExercises };

  useEffect(() => {
    dataRef.current = { sessions, rides, customExercises, workoutCustom };
  }, [sessions, rides, customExercises, workoutCustom]);

  useEffect(() => {
    (async () => {
      const [s, r, a, ce, wc] = await Promise.all([
        load('il_sessions'), load('il_rides'), load('il_active'),
        load('il_custom_exercises'), load('il_workout_custom'),
      ]);
      if (s) setSessions(s);
      if (r) setRides(r);
      if (a) setActiveSession(a);
      if (ce) setCustomExercises(ce);
      if (wc) setWorkoutCustom(wc);
      setSelectedWorkout(nextWorkout(s || []));
      setReady(true);
    })();
  }, []);

  useEffect(() => { if (ready) save('il_sessions', sessions); }, [sessions, ready]);
  useEffect(() => { if (ready) save('il_rides', rides); }, [rides, ready]);
  useEffect(() => { if (ready) save('il_active', activeSession); }, [activeSession, ready]);
  useEffect(() => { if (ready) save('il_custom_exercises', customExercises); }, [customExercises, ready]);
  useEffect(() => { if (ready) save('il_workout_custom', workoutCustom); }, [workoutCustom, ready]);

  function handleExport() {
    exportData(dataRef.current);
    setDriveSync({ status: 'done', lastSync: new Date().toISOString(), error: null });
  }

  async function handleImport(file) {
    if (!file) return;
    setDriveSync(s => ({ ...s, status: 'loading', error: null }));
    try {
      const data = await importData(file);
      if (data.sessions)        setSessions(data.sessions);
      if (data.rides)           setRides(data.rides);
      if (data.customExercises) setCustomExercises(data.customExercises);
      if (data.workoutCustom)   setWorkoutCustom(data.workoutCustom);
      if (data.sessions)        setSelectedWorkout(nextWorkout(data.sessions));
      setDriveSync({ status: 'done', lastSync: new Date().toISOString(), error: null });
    } catch (e) {
      setDriveSync(s => ({ ...s, status: 'error', error: e.message }));
    }
  }

  async function driveSave() { handleExport(); }
  async function driveLoad() {}

  function handleComplete(sess) {
    setSessions(p => {
      const updated = [...p, sess];
      return updated;
    });
    setActiveSession(null);
  }

  if (!ready) return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: C.fMono, color: C.amber, letterSpacing: 2 }}>LOADING...</div>
    </div>
  );

  return (
    <>
      <FontLoader />
      <style>{`
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
        body{margin:0;background:${C.bg};}
        input,select,textarea{outline:none;-webkit-appearance:none;appearance:none;}
        input:focus,select:focus,textarea:focus{border-color:${C.amber}!important;}
        select option{background:${C.surface};color:${C.text};}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-thumb{background:${C.border};}
        ::placeholder{color:${C.muted};}
      `}</style>
      <div style={st.screen}>
        {view === 'dashboard' && (
          <Dashboard sessions={sessions} rides={rides} setView={setView} activeSession={activeSession}
            selectedWorkout={selectedWorkout} setSelectedWorkout={setSelectedWorkout}
            allExercises={allExercises} workoutCustom={workoutCustom}
            driveSync={driveSync} onDriveSave={handleExport} onDriveLoad={handleImport} />
        )}
        {view === 'workout' && (
          <ActiveWorkout
            sessions={sessions}
            activeSession={activeSession}
            setActiveSession={setActiveSession}
            onComplete={handleComplete}
            setView={setView}
            selectedWorkout={selectedWorkout}
            allExercises={allExercises}
            workoutCustom={workoutCustom}
          />
        )}
        {view === 'history' && <History sessions={sessions} allExercises={allExercises} />}
        {view === 'progress' && <Progress sessions={sessions} allExercises={allExercises} />}
        {view === 'rides' && <Rides rides={rides} setRides={setRides} />}
        {view === 'manage' && (
          <Manage
            customExercises={customExercises}
            setCustomExercises={setCustomExercises}
            workoutCustom={workoutCustom}
            setWorkoutCustom={setWorkoutCustom}
            allExercises={allExercises}
          />
        )}
      </div>
      <Nav view={view} setView={setView} hasActive={!!activeSession} />
    </>
  );
}
