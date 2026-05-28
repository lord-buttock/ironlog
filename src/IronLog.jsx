import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════════════
// THEME
// ═══════════════════════════════════════════════════════════════════════
const C = {
  bg: '#f6f9fc', surface: '#ffffff', card: '#ffffff', border: '#d9e4ef',
  amber: '#5b9df5', amberDim: '#dcecff', red: '#dc5252', green: '#1f9d8a',
  blue: '#5b9df5', purple: '#7c6ee6', text: '#17212b', muted: '#6b7788', dim: '#eaf1f8',
  fDisplay: "'Barlow Condensed', sans-serif",
  fMono: "'JetBrains Mono', monospace",
  fBody: "'Barlow', sans-serif",
};

const EXERCISE_ICONS = {
  db_bench: <><line x1="6" y1="23" x2="26" y2="23" /><circle cx="12" cy="18" r="2" /><line x1="14" y1="18" x2="21" y2="18" /><line x1="17" y1="17" x2="17" y2="10" /><line x1="22" y1="17" x2="22" y2="10" /><line x1="14" y1="10" x2="25" y2="10" /><line x1="14" y1="23" x2="10" y2="27" /><line x1="20" y1="23" x2="24" y2="27" /></>,
  bb_flat_bench: <><line x1="5" y1="23" x2="27" y2="23" /><circle cx="12" cy="18" r="2" /><line x1="14" y1="18" x2="21" y2="18" /><line x1="17" y1="17" x2="17" y2="10" /><line x1="22" y1="17" x2="22" y2="10" /><line x1="8" y1="9" x2="28" y2="9" /><line x1="8" y1="7" x2="8" y2="11" /><line x1="28" y1="7" x2="28" y2="11" /></>,
  bb_incline_bench: <><line x1="6" y1="25" x2="22" y2="14" /><circle cx="12" cy="19" r="2" /><line x1="14" y1="18" x2="20" y2="15" /><line x1="18" y1="15" x2="16" y2="9" /><line x1="21" y1="14" x2="24" y2="9" /><line x1="11" y1="8" x2="29" y2="8" /><line x1="11" y1="6" x2="11" y2="10" /><line x1="29" y1="6" x2="29" y2="10" /></>,
  db_floor_press: <><line x1="5" y1="25" x2="27" y2="25" /><circle cx="11" cy="20" r="2" /><line x1="13" y1="20" x2="21" y2="20" /><line x1="16" y1="19" x2="16" y2="11" /><line x1="22" y1="19" x2="22" y2="11" /><line x1="14" y1="11" x2="24" y2="11" /><line x1="20" y1="20" x2="25" y2="25" /></>,
  incline_pushups: <><line x1="21" y1="18" x2="29" y2="18" /><line x1="24" y1="18" x2="24" y2="26" /><circle cx="7" cy="13" r="2" /><line x1="9" y1="14" x2="19" y2="18" /><line x1="19" y1="18" x2="23" y2="18" /><line x1="11" y1="15" x2="7" y2="24" /><line x1="16" y1="17" x2="13" y2="25" /></>,
  p_push_up: <><line x1="5" y1="25" x2="27" y2="25" /><circle cx="7" cy="17" r="2" /><line x1="9" y1="18" x2="21" y2="21" /><line x1="21" y1="21" x2="25" y2="25" /><line x1="14" y1="19" x2="12" y2="25" /><line x1="19" y1="21" x2="18" y2="25" /></>,
  p_diamond_pushup: <><line x1="5" y1="25" x2="27" y2="25" /><circle cx="7" cy="17" r="2" /><line x1="9" y1="18" x2="21" y2="21" /><line x1="16" y1="20" x2="15" y2="25" /><path d="M14 24l2-2 2 2-2 2z" /><line x1="21" y1="21" x2="25" y2="25" /></>,
  p_db_fly: <><line x1="6" y1="23" x2="26" y2="23" /><circle cx="13" cy="18" r="2" /><line x1="15" y1="18" x2="20" y2="18" /><path d="M17 17c-4-4-7-5-10-5" /><path d="M20 17c4-4 7-5 10-5" /><line x1="7" y1="12" x2="5" y2="10" /><line x1="29" y1="12" x2="27" y2="10" /></>,
  p_incline_db_press: <><line x1="7" y1="25" x2="22" y2="14" /><circle cx="12" cy="19" r="2" /><line x1="14" y1="18" x2="20" y2="15" /><line x1="18" y1="16" x2="20" y2="10" /><line x1="22" y1="14" x2="25" y2="10" /><line x1="19" y1="10" x2="21" y2="8" /><line x1="24" y1="10" x2="26" y2="8" /></>,
  p_chest_dip: <><line x1="9" y1="10" x2="9" y2="26" /><line x1="23" y1="10" x2="23" y2="26" /><line x1="7" y1="12" x2="13" y2="12" /><line x1="19" y1="12" x2="25" y2="12" /><circle cx="16" cy="9" r="2" /><line x1="16" y1="11" x2="16" y2="18" /><line x1="16" y1="13" x2="11" y2="15" /><line x1="16" y1="13" x2="21" y2="15" /><line x1="16" y1="18" x2="13" y2="25" /><line x1="16" y1="18" x2="20" y2="25" /></>,
  p_cable_fly: <><line x1="4" y1="4" x2="4" y2="26" /><line x1="28" y1="4" x2="28" y2="26" /><circle cx="16" cy="7" r="2" /><line x1="16" y1="9" x2="16" y2="19" /><path d="M16 12c-5 1-8 3-10 7" /><path d="M16 12c5 1 8 3 10 7" /><line x1="16" y1="19" x2="12" y2="27" /><line x1="16" y1="19" x2="20" y2="27" /></>,
  p_close_grip_bench: <><line x1="5" y1="23" x2="27" y2="23" /><circle cx="12" cy="18" r="2" /><line x1="14" y1="18" x2="21" y2="18" /><line x1="18" y1="17" x2="18" y2="10" /><line x1="20" y1="17" x2="20" y2="10" /><line x1="10" y1="9" x2="28" y2="9" /><line x1="10" y1="7" x2="10" y2="11" /><line x1="28" y1="7" x2="28" y2="11" /></>,
  p_lateral_raise: <><circle cx="16" cy="5" r="2.2" /><line x1="16" y1="7" x2="16" y2="18" /><line x1="16" y1="11" x2="7" y2="11" /><line x1="16" y1="11" x2="25" y2="11" /><line x1="6" y1="10" x2="6" y2="13" /><line x1="26" y1="10" x2="26" y2="13" /><line x1="16" y1="18" x2="12" y2="27" /><line x1="16" y1="18" x2="20" y2="27" /></>,
  p_front_raise: <><circle cx="16" cy="5" r="2.2" /><line x1="16" y1="7" x2="16" y2="18" /><line x1="16" y1="11" x2="16" y2="4" /><line x1="16" y1="11" x2="23" y2="14" /><line x1="15" y1="3" x2="18" y2="3" /><line x1="24" y1="13" x2="24" y2="16" /><line x1="16" y1="18" x2="12" y2="27" /><line x1="16" y1="18" x2="20" y2="27" /></>,
  p_db_shoulder_press: <><line x1="11" y1="25" x2="21" y2="25" /><circle cx="16" cy="6" r="2.2" /><line x1="16" y1="8" x2="16" y2="17" /><line x1="16" y1="11" x2="12" y2="7" /><line x1="16" y1="11" x2="20" y2="7" /><line x1="12" y1="7" x2="12" y2="3" /><line x1="20" y1="7" x2="20" y2="3" /><line x1="10" y1="3" x2="14" y2="3" /><line x1="18" y1="3" x2="22" y2="3" /></>,
  p_arnold_press: <><line x1="11" y1="25" x2="21" y2="25" /><circle cx="16" cy="6" r="2.2" /><line x1="16" y1="8" x2="16" y2="17" /><path d="M16 11c-3 0-5-2-5-4" /><path d="M16 11c3 0 5-2 5-4" /><path d="M11 7c0-3 2-4 4-5" /><path d="M21 7c0-3-2-4-4-5" /><line x1="16" y1="17" x2="13" y2="25" /><line x1="16" y1="17" x2="19" y2="25" /></>,
  p_rear_delt_fly: <><circle cx="12" cy="9" r="2" /><line x1="14" y1="10" x2="21" y2="16" /><line x1="20" y1="16" x2="13" y2="16" /><line x1="20" y1="16" x2="27" y2="16" /><line x1="12" y1="16" x2="10" y2="19" /><line x1="28" y1="16" x2="30" y2="19" /><line x1="21" y1="16" x2="16" y2="25" /><line x1="21" y1="16" x2="24" y2="25" /></>,
  p_band_face_pull: <><line x1="28" y1="7" x2="28" y2="25" /><circle cx="14" cy="8" r="2.2" /><line x1="14" y1="10" x2="14" y2="20" /><line x1="14" y1="13" x2="20" y2="9" /><line x1="14" y1="13" x2="20" y2="15" /><line x1="20" y1="9" x2="28" y2="10" /><line x1="20" y1="15" x2="28" y2="12" /><line x1="14" y1="20" x2="10" y2="28" /><line x1="14" y1="20" x2="18" y2="28" /></>,
  p_shrugs: <><circle cx="16" cy="5" r="2.2" /><path d="M12 10c1-2 7-2 8 0" /><line x1="16" y1="8" x2="16" y2="18" /><line x1="16" y1="11" x2="11" y2="18" /><line x1="16" y1="11" x2="21" y2="18" /><line x1="10" y1="18" x2="10" y2="22" /><line x1="22" y1="18" x2="22" y2="22" /><line x1="16" y1="18" x2="12" y2="27" /><line x1="16" y1="18" x2="20" y2="27" /></>,
  face_pull: <><line x1="28" y1="7" x2="28" y2="25" /><circle cx="14" cy="8" r="2.2" /><line x1="14" y1="10" x2="14" y2="20" /><line x1="14" y1="13" x2="20" y2="9" /><line x1="14" y1="13" x2="20" y2="15" /><line x1="20" y1="9" x2="28" y2="10" /><line x1="20" y1="15" x2="28" y2="12" /><line x1="14" y1="20" x2="10" y2="28" /><line x1="14" y1="20" x2="18" y2="28" /></>,
  reverse_fly: <><circle cx="12" cy="9" r="2" /><line x1="14" y1="10" x2="21" y2="16" /><line x1="20" y1="16" x2="13" y2="16" /><line x1="20" y1="16" x2="27" y2="16" /><line x1="12" y1="16" x2="10" y2="19" /><line x1="28" y1="16" x2="30" y2="19" /><line x1="21" y1="16" x2="16" y2="25" /><line x1="21" y1="16" x2="24" y2="25" /></>,
  p_tricep_pushdown: <><line x1="24" y1="4" x2="24" y2="13" /><circle cx="14" cy="7" r="2.2" /><line x1="14" y1="9" x2="14" y2="20" /><line x1="14" y1="12" x2="20" y2="12" /><line x1="20" y1="12" x2="24" y2="10" /><line x1="19" y1="12" x2="19" y2="21" /><line x1="14" y1="20" x2="10" y2="28" /><line x1="14" y1="20" x2="18" y2="28" /></>,
  p_overhead_ext: <><circle cx="16" cy="5" r="2.2" /><line x1="16" y1="7" x2="16" y2="18" /><line x1="16" y1="10" x2="12" y2="4" /><line x1="16" y1="10" x2="20" y2="4" /><line x1="12" y1="4" x2="16" y2="13" /><line x1="20" y1="4" x2="16" y2="13" /><line x1="16" y1="18" x2="12" y2="27" /><line x1="16" y1="18" x2="20" y2="27" /></>,
  p_skull_crushers: <><line x1="6" y1="23" x2="26" y2="23" /><circle cx="12" cy="18" r="2" /><line x1="14" y1="18" x2="21" y2="18" /><line x1="17" y1="17" x2="15" y2="12" /><line x1="22" y1="17" x2="24" y2="12" /><line x1="14" y1="12" x2="25" y2="12" /><line x1="20" y1="23" x2="24" y2="27" /></>,
  p_tricep_dips: <><line x1="6" y1="15" x2="19" y2="15" /><line x1="8" y1="15" x2="8" y2="25" /><line x1="19" y1="15" x2="19" y2="25" /><circle cx="20" cy="12" r="2" /><line x1="19" y1="14" x2="16" y2="20" /><line x1="16" y1="20" x2="25" y2="20" /><line x1="17" y1="17" x2="19" y2="15" /><line x1="25" y1="20" x2="28" y2="25" /></>,
  db_row_1arm: <><line x1="7" y1="18" x2="18" y2="18" /><line x1="10" y1="18" x2="10" y2="25" /><circle cx="14" cy="9" r="2" /><line x1="16" y1="10" x2="23" y2="16" /><line x1="18" y1="14" x2="12" y2="18" /><line x1="23" y1="16" x2="23" y2="23" /><line x1="23" y1="23" x2="25" y2="23" /><line x1="23" y1="16" x2="28" y2="25" /></>,
  cs_db_row: <><line x1="8" y1="22" x2="24" y2="14" /><circle cx="14" cy="16" r="2" /><line x1="16" y1="16" x2="22" y2="14" /><line x1="18" y1="17" x2="17" y2="24" /><line x1="22" y1="14" x2="22" y2="22" /><line x1="16" y1="24" x2="18" y2="24" /><line x1="21" y1="22" x2="23" y2="22" /></>,
  band_row: <><line x1="26" y1="8" x2="26" y2="25" /><circle cx="10" cy="11" r="2" /><line x1="10" y1="13" x2="10" y2="22" /><line x1="10" y1="16" x2="18" y2="16" /><line x1="18" y1="16" x2="26" y2="12" /><line x1="18" y1="16" x2="26" y2="20" /><line x1="10" y1="22" x2="6" y2="27" /><line x1="10" y1="22" x2="16" y2="27" /></>,
  chin_up: <><line x1="7" y1="5" x2="25" y2="5" /><circle cx="16" cy="9" r="2.2" /><line x1="16" y1="11" x2="16" y2="20" /><line x1="16" y1="12" x2="11" y2="5" /><line x1="16" y1="12" x2="21" y2="5" /><line x1="16" y1="20" x2="12" y2="28" /><line x1="16" y1="20" x2="20" y2="28" /></>,
  p_pull_up: <><line x1="7" y1="5" x2="25" y2="5" /><circle cx="16" cy="11" r="2.2" /><line x1="16" y1="13" x2="16" y2="21" /><line x1="16" y1="14" x2="10" y2="5" /><line x1="16" y1="14" x2="22" y2="5" /><line x1="16" y1="21" x2="12" y2="28" /><line x1="16" y1="21" x2="20" y2="28" /></>,
  p_lat_pulldown: <><line x1="8" y1="5" x2="24" y2="5" /><circle cx="16" cy="9" r="2.2" /><line x1="16" y1="11" x2="16" y2="21" /><line x1="16" y1="13" x2="11" y2="8" /><line x1="16" y1="13" x2="21" y2="8" /><line x1="11" y1="8" x2="8" y2="5" /><line x1="21" y1="8" x2="24" y2="5" /><line x1="10" y1="25" x2="22" y2="25" /></>,
  p_seated_cable_row: <><line x1="27" y1="7" x2="27" y2="24" /><circle cx="10" cy="12" r="2" /><line x1="10" y1="14" x2="13" y2="22" /><line x1="13" y1="17" x2="21" y2="17" /><line x1="21" y1="17" x2="27" y2="14" /><line x1="13" y1="22" x2="8" y2="26" /><line x1="13" y1="22" x2="20" y2="26" /></>,
  p_t_bar_row: <><circle cx="12" cy="9" r="2" /><line x1="14" y1="10" x2="22" y2="16" /><line x1="22" y1="16" x2="16" y2="24" /><line x1="22" y1="16" x2="26" y2="24" /><line x1="18" y1="13" x2="23" y2="18" /><line x1="12" y1="24" x2="30" y2="17" /><line x1="29" y1="15" x2="31" y2="19" /></>,
  p_straight_arm_pd: <><line x1="25" y1="4" x2="25" y2="15" /><circle cx="14" cy="7" r="2.2" /><line x1="14" y1="9" x2="14" y2="20" /><line x1="14" y1="12" x2="22" y2="8" /><line x1="22" y1="8" x2="25" y2="6" /><line x1="14" y1="15" x2="22" y2="21" /><line x1="14" y1="20" x2="10" y2="28" /><line x1="14" y1="20" x2="18" y2="28" /></>,
  p_db_bicep_curl: <><circle cx="16" cy="5" r="2.2" /><line x1="16" y1="7" x2="16" y2="18" /><line x1="16" y1="11" x2="11" y2="16" /><line x1="11" y1="16" x2="13" y2="10" /><line x1="13" y1="10" x2="15" y2="10" /><line x1="16" y1="11" x2="21" y2="18" /><line x1="16" y1="18" x2="12" y2="27" /><line x1="16" y1="18" x2="20" y2="27" /></>,
  p_barbell_curl: <><circle cx="16" cy="5" r="2.2" /><line x1="16" y1="7" x2="16" y2="18" /><line x1="16" y1="11" x2="12" y2="17" /><line x1="16" y1="11" x2="20" y2="17" /><line x1="10" y1="15" x2="22" y2="15" /><line x1="10" y1="13" x2="10" y2="17" /><line x1="22" y1="13" x2="22" y2="17" /><line x1="16" y1="18" x2="12" y2="27" /><line x1="16" y1="18" x2="20" y2="27" /></>,
  p_hammer_curl: <><circle cx="16" cy="5" r="2.2" /><line x1="16" y1="7" x2="16" y2="18" /><line x1="16" y1="11" x2="11" y2="17" /><line x1="11" y1="17" x2="13" y2="12" /><line x1="13" y1="11" x2="13" y2="14" /><line x1="16" y1="11" x2="21" y2="18" /><line x1="16" y1="18" x2="12" y2="27" /><line x1="16" y1="18" x2="20" y2="27" /></>,
  p_concentration_curl: <><line x1="9" y1="24" x2="23" y2="24" /><circle cx="14" cy="8" r="2" /><line x1="14" y1="10" x2="18" y2="18" /><line x1="18" y1="18" x2="13" y2="22" /><line x1="13" y1="22" x2="15" y2="16" /><line x1="15" y1="16" x2="17" y2="16" /><line x1="18" y1="18" x2="24" y2="24" /></>,
  p_preacher_curl: <><line x1="8" y1="24" x2="24" y2="16" /><line x1="10" y1="25" x2="23" y2="25" /><circle cx="12" cy="9" r="2" /><line x1="12" y1="11" x2="16" y2="18" /><line x1="16" y1="18" x2="21" y2="16" /><line x1="21" y1="16" x2="18" y2="12" /><line x1="18" y1="12" x2="20" y2="11" /></>,
  kb_deadlift: <><rect x="13" y="21" width="6" height="5" rx="2" /><path d="M14 21c0-3 4-3 4 0" /><circle cx="16" cy="7" r="2.2" /><line x1="16" y1="9" x2="21" y2="16" /><line x1="21" y1="16" x2="17" y2="21" /><line x1="21" y1="16" x2="25" y2="25" /><line x1="17" y1="21" x2="10" y2="25" /><line x1="8" y1="27" x2="22" y2="27" /></>,
  rdl: <><circle cx="10.5" cy="8" r="1.8" fill="#243244" /><path d="M12.2 9.1l8.3 5.2-2.6 3.7-8.3-5.2z" fill="#e8f0fe" stroke="#243244" strokeWidth="1.25" /><path d="M15.5 13.4l-4.1 9.7M20.3 14.5l4.3 10.1M11.5 23.2h4.7M24.5 24.6h4.2" stroke="#243244" strokeWidth="1.25" /><path d="M18 16.8l-2.2 5.8M21.3 16.1l-2.2 5.8" stroke="#243244" strokeWidth="1.25" /><rect x="13.8" y="21.6" width="3.5" height="2.5" rx=".6" fill="#dbeafe" stroke="#5b9df5" strokeWidth="1" /><rect x="17.1" y="21" width="3.5" height="2.5" rx=".6" fill="#dbeafe" stroke="#5b9df5" strokeWidth="1" /></>,
  p_rdl: <><circle cx="12" cy="8" r="2.2" /><line x1="14" y1="9" x2="22" y2="16" /><line x1="18" y1="13" x2="14" y2="21" /><line x1="22" y1="16" x2="17" y2="26" /><line x1="22" y1="16" x2="26" y2="26" /><line x1="14" y1="21" x2="16" y2="21" /><line x1="24" y1="19" x2="26" y2="19" /></>,
  goblet_squat: <><circle cx="15.5" cy="5.2" r="1.9" fill="#243244" /><path d="M13.5 8.2c1.2-.8 3.6-.8 4.8 0l1.2 5.3-2.1 3.3h-3.6l-2.1-3.3z" fill="#e8f0fe" stroke="#243244" strokeWidth="1.25" /><rect x="12.6" y="11.2" width="6.4" height="4.2" rx="1" fill="#dbeafe" stroke="#5b9df5" strokeWidth="1" /><path d="M13.2 13.2l-5.5 5.4 3.7 6.6M18.9 13.2l5.4 5.4-3.7 6.6" stroke="#243244" strokeWidth="1.25" /><path d="M11.4 25.2H7.6M20.6 25.2h3.8M13.2 10.2l-2.8 3M18.9 10.2l2.8 3" stroke="#243244" strokeWidth="1.25" /></>,
  reverse_lunge: <><circle cx="14.8" cy="5.4" r="1.9" fill="#243244" /><path d="M13.1 8.2c1.2-.8 3.6-.8 4.8 0l.7 8.8-2.2 2.2h-3.1l-1.5-5.5z" fill="#e8f0fe" stroke="#243244" strokeWidth="1.25" /><path d="M13.1 13.1l-4.2 4.2M18 13.1l4.4 3.4" stroke="#243244" strokeWidth="1.25" /><path d="M16 18.8l-5.3 7.1h-4M16.5 18.8l7.2 4.5 4.4-.1" stroke="#243244" strokeWidth="1.25" /><path d="M23.7 23.3v3.2" stroke="#5b9df5" strokeWidth="1.2" /></>,
  split_squat: <><circle cx="15" cy="5" r="2.2" /><line x1="15" y1="7" x2="15" y2="17" /><line x1="15" y1="17" x2="9" y2="25" /><line x1="15" y1="17" x2="22" y2="25" /><line x1="8" y1="25" x2="13" y2="25" /><line x1="21" y1="25" x2="27" y2="25" /><line x1="15" y1="11" x2="10" y2="15" /><line x1="15" y1="11" x2="20" y2="15" /></>,
  step_ups: <><line x1="17" y1="22" x2="29" y2="22" /><line x1="19" y1="22" x2="19" y2="27" /><circle cx="12" cy="6" r="2.2" /><line x1="12" y1="8" x2="14" y2="17" /><line x1="14" y1="17" x2="20" y2="22" /><line x1="14" y1="17" x2="10" y2="27" /><line x1="12" y1="11" x2="8" y2="15" /><line x1="12" y1="11" x2="17" y2="14" /></>,
  sb_ham_curl: <><circle cx="24" cy="22.6" r="5.2" fill="#dbeafe" stroke="#5b9df5" strokeWidth="1.1" /><path d="M20 22.6c2.4-1.5 5.3-1.5 8 0" stroke="#5b9df5" strokeWidth=".9" /><circle cx="7.8" cy="17.2" r="1.8" fill="#243244" /><path d="M9.6 17.2l8.8-1.2 5.7 3.1-1.8 3.1-4.9-2.7-8.2 1.4z" fill="#e8f0fe" stroke="#243244" strokeWidth="1.25" /><path d="M13.1 19.9l-5.1 4.5M17.8 19.4l2.1 4.4" stroke="#243244" strokeWidth="1.25" /><line x1="4.5" y1="26.5" x2="29" y2="26.5" stroke="#d9e4ef" strokeWidth="1" /></>,
  calf_raises: <><circle cx="16" cy="5" r="2.2" /><line x1="16" y1="7" x2="16" y2="18" /><line x1="16" y1="11" x2="12" y2="16" /><line x1="16" y1="11" x2="20" y2="16" /><line x1="16" y1="18" x2="13" y2="27" /><line x1="16" y1="18" x2="20" y2="27" /><line x1="12" y1="27" x2="16" y2="25" /><line x1="19" y1="27" x2="23" y2="25" /></>,
  single_leg_bal: <><circle cx="16" cy="5" r="2.2" /><line x1="16" y1="7" x2="16" y2="18" /><line x1="16" y1="11" x2="10" y2="13" /><line x1="16" y1="11" x2="22" y2="13" /><line x1="16" y1="18" x2="15" y2="28" /><line x1="16" y1="18" x2="23" y2="22" /><line x1="13" y1="28" x2="18" y2="28" /></>,
  p_bulgarian_squat: <><line x1="22" y1="20" x2="30" y2="20" /><circle cx="14" cy="5" r="2.2" /><line x1="14" y1="7" x2="14" y2="17" /><line x1="14" y1="17" x2="8" y2="26" /><line x1="14" y1="17" x2="24" y2="20" /><line x1="8" y1="26" x2="14" y2="26" /><line x1="14" y1="11" x2="10" y2="15" /><line x1="14" y1="11" x2="19" y2="15" /></>,
  p_leg_press: <><line x1="8" y1="24" x2="18" y2="16" /><circle cx="10" cy="17" r="2" /><line x1="12" y1="17" x2="18" y2="20" /><line x1="18" y1="20" x2="25" y2="12" /><line x1="24" y1="5" x2="29" y2="16" /><line x1="18" y1="20" x2="22" y2="25" /><line x1="22" y1="25" x2="28" y2="25" /></>,
  p_leg_extension: <><line x1="7" y1="22" x2="19" y2="22" /><line x1="19" y1="22" x2="19" y2="27" /><circle cx="12" cy="12" r="2" /><line x1="12" y1="14" x2="16" y2="21" /><line x1="16" y1="21" x2="27" y2="18" /><line x1="27" y1="18" x2="29" y2="20" /><line x1="16" y1="21" x2="11" y2="24" /></>,
  p_seated_leg_curl: <><line x1="7" y1="20" x2="19" y2="20" /><line x1="19" y1="20" x2="19" y2="27" /><circle cx="12" cy="11" r="2" /><line x1="12" y1="13" x2="16" y2="20" /><line x1="16" y1="20" x2="24" y2="25" /><line x1="24" y1="25" x2="21" y2="28" /><line x1="16" y1="20" x2="10" y2="24" /></>,
  p_sumo_squat: <><circle cx="16" cy="5" r="2.2" /><line x1="16" y1="7" x2="16" y2="15" /><line x1="16" y1="10" x2="12" y2="14" /><line x1="16" y1="10" x2="20" y2="14" /><line x1="16" y1="15" x2="9" y2="24" /><line x1="16" y1="15" x2="23" y2="24" /><line x1="9" y1="24" x2="5" y2="26" /><line x1="23" y1="24" x2="27" y2="26" /><circle cx="16" cy="18" r="2" /></>,
  p_wall_sit: <><line x1="24" y1="5" x2="24" y2="28" /><circle cx="18" cy="8" r="2" /><line x1="18" y1="10" x2="20" y2="18" /><line x1="20" y1="18" x2="12" y2="18" /><line x1="12" y1="18" x2="12" y2="26" /><line x1="20" y1="18" x2="24" y2="18" /><line x1="12" y1="26" x2="18" y2="26" /></>,
  hip_thrust: <><rect x="3.5" y="16.7" width="10.5" height="3.8" rx="1" fill="#dbeafe" stroke="#5b9df5" strokeWidth="1" /><line x1="6" y1="20.5" x2="6" y2="26.5" stroke="#5b9df5" strokeWidth="1" /><line x1="12" y1="20.5" x2="12" y2="26.5" stroke="#5b9df5" strokeWidth="1" /><circle cx="11.5" cy="13.2" r="1.8" fill="#243244" /><path d="M13 14.1l8.4 2.4 2.7 4.8-3.3 2.1-2.4-4.2-7-1.7z" fill="#e8f0fe" stroke="#243244" strokeWidth="1.25" /><rect x="17.3" y="14.4" width="7.3" height="2.5" rx=".8" fill="#dbeafe" stroke="#5b9df5" strokeWidth="1" /><path d="M20.8 23.4h-5.6M24 21.2l4.2 5.2M28.2 26.4h-4.7" stroke="#243244" strokeWidth="1.25" /></>,
  p_cable_kickback: <><line x1="25" y1="6" x2="25" y2="27" /><circle cx="12" cy="12" r="2" /><line x1="14" y1="13" x2="20" y2="18" /><line x1="20" y1="18" x2="14" y2="24" /><line x1="20" y1="18" x2="28" y2="12" /><line x1="14" y1="16" x2="9" y2="22" /><line x1="28" y1="12" x2="25" y2="14" /></>,
  p_hip_abduction: <><circle cx="16" cy="8" r="2" /><line x1="16" y1="10" x2="16" y2="19" /><line x1="16" y1="14" x2="11" y2="17" /><line x1="16" y1="14" x2="21" y2="17" /><line x1="16" y1="19" x2="9" y2="25" /><line x1="16" y1="19" x2="23" y2="25" /><path d="M10 23c4 3 8 3 12 0" /></>,
  p_frog_pumps: <><circle cx="10" cy="17" r="2" /><line x1="12" y1="17" x2="20" y2="17" /><line x1="20" y1="17" x2="15" y2="24" /><line x1="20" y1="17" x2="25" y2="24" /><line x1="15" y1="24" x2="20" y2="27" /><line x1="25" y1="24" x2="20" y2="27" /><line x1="4" y1="27" x2="28" y2="27" /></>,
  p_donkey_kick: <><circle cx="10" cy="12" r="2" /><line x1="12" y1="13" x2="19" y2="18" /><line x1="19" y1="18" x2="13" y2="24" /><line x1="19" y1="18" x2="25" y2="12" /><line x1="25" y1="12" x2="25" y2="7" /><line x1="12" y1="16" x2="8" y2="24" /></>,
  p_clamshell: <><circle cx="10" cy="17" r="2" /><line x1="12" y1="17" x2="20" y2="20" /><line x1="20" y1="20" x2="26" y2="25" /><line x1="20" y1="20" x2="26" y2="15" /><path d="M18 21c3-2 5-4 8-6" /><line x1="5" y1="26" x2="28" y2="26" /></>,
  pallof_press: <><line x1="28" y1="7" x2="28" y2="25" stroke="#d9e4ef" strokeWidth="1.2" /><path d="M18.2 13.2h9.2" stroke="#5b9df5" strokeWidth="1" strokeDasharray="1.8 1.4" /><circle cx="11.5" cy="6.2" r="1.9" fill="#243244" /><path d="M9.8 9c1.2-.8 3.5-.8 4.8 0l1.1 10.4h-6.6z" fill="#e8f0fe" stroke="#243244" strokeWidth="1.25" /><path d="M14.5 12.9h7.2M21.7 12.9l-1.8 1.9M21.7 12.9l-1.8-1.9" stroke="#243244" strokeWidth="1.25" /><path d="M11.5 19.4L8.5 27M13.4 19.4l4.2 7.6" stroke="#243244" strokeWidth="1.25" /></>,
  farmers_walk: <><circle cx="16" cy="5.3" r="1.9" fill="#243244" /><path d="M14.2 8.1c1.2-.8 3.6-.8 4.8 0l.8 10.3h-6.4z" fill="#e8f0fe" stroke="#243244" strokeWidth="1.25" /><path d="M13.8 11.7l-4.6 5.6M19.4 11.7l4.6 5.7" stroke="#243244" strokeWidth="1.25" /><rect x="6.6" y="17" width="4.4" height="6.3" rx=".8" fill="#dbeafe" stroke="#5b9df5" strokeWidth="1" /><rect x="21.4" y="17.2" width="4.4" height="6.3" rx=".8" fill="#dbeafe" stroke="#5b9df5" strokeWidth="1" /><path d="M15.2 18.4l-4.4 8.1h-3.4M18.1 18.4l5.7 7.6h3.5" stroke="#243244" strokeWidth="1.25" /></>,
  suitcase_carry: <><circle cx="16" cy="5" r="2.2" /><line x1="16" y1="7" x2="16" y2="18" /><line x1="16" y1="11" x2="10" y2="18" /><line x1="16" y1="11" x2="21" y2="14" /><rect x="7" y="18" width="4" height="5" rx="1" /><line x1="16" y1="18" x2="12" y2="27" /><line x1="16" y1="18" x2="21" y2="26" /></>,
  p_plank: <><line x1="5" y1="25" x2="27" y2="25" /><circle cx="8" cy="18" r="2" /><line x1="10" y1="19" x2="23" y2="22" /><line x1="10" y1="20" x2="8" y2="25" /><line x1="17" y1="21" x2="16" y2="25" /><line x1="23" y1="22" x2="27" y2="25" /></>,
  p_side_plank: <><line x1="6" y1="26" x2="27" y2="26" /><circle cx="9" cy="17" r="2" /><line x1="11" y1="18" x2="24" y2="21" /><line x1="13" y1="19" x2="10" y2="26" /><line x1="24" y1="21" x2="28" y2="26" /><line x1="16" y1="16" x2="20" y2="10" /></>,
  p_dead_bug: <><circle cx="16" cy="17" r="2" /><line x1="16" y1="19" x2="16" y2="24" /><line x1="16" y1="19" x2="9" y2="13" /><line x1="16" y1="19" x2="24" y2="13" /><line x1="16" y1="24" x2="10" y2="28" /><line x1="16" y1="24" x2="23" y2="28" /><line x1="6" y1="29" x2="28" y2="29" /></>,
  p_bird_dog: <><circle cx="10" cy="12" r="2" /><line x1="12" y1="13" x2="19" y2="18" /><line x1="12" y1="13" x2="5" y2="9" /><line x1="19" y1="18" x2="27" y2="14" /><line x1="19" y1="18" x2="13" y2="25" /><line x1="12" y1="16" x2="8" y2="24" /></>,
  p_ab_wheel: <><circle cx="10" cy="12" r="2" /><line x1="12" y1="13" x2="20" y2="19" /><line x1="20" y1="19" x2="26" y2="19" /><circle cx="27" cy="20" r="2" /><line x1="20" y1="19" x2="14" y2="26" /><line x1="14" y1="26" x2="9" y2="26" /></>,
  p_hanging_knee_raise: <><line x1="7" y1="5" x2="25" y2="5" /><circle cx="16" cy="9" r="2.2" /><line x1="16" y1="11" x2="16" y2="19" /><line x1="16" y1="12" x2="11" y2="5" /><line x1="16" y1="12" x2="21" y2="5" /><line x1="16" y1="19" x2="12" y2="23" /><line x1="16" y1="19" x2="21" y2="23" /><line x1="12" y1="23" x2="20" y2="23" /></>,
  p_cable_crunch: <><line x1="23" y1="4" x2="23" y2="13" /><circle cx="15" cy="10" r="2" /><path d="M15 12c1 5 4 8 8 9" /><line x1="15" y1="14" x2="21" y2="13" /><line x1="21" y1="13" x2="23" y2="9" /><line x1="21" y1="21" x2="16" y2="27" /><line x1="21" y1="21" x2="26" y2="27" /></>,
  p_band_ext_rot: <><circle cx="13" cy="5" r="2.2" /><line x1="13" y1="7" x2="13" y2="16" /><line x1="13" y1="11" x2="8" y2="14" /><line x1="13" y1="16" x2="10" y2="25" /><line x1="13" y1="16" x2="18" y2="24" /><line x1="13" y1="11" x2="13" y2="18" /><line x1="13" y1="18" x2="22" y2="18" /><path d="M22 18 Q26 14 24 10" strokeDasharray="2 1.5" /><line x1="24" y1="10" x2="27" y2="9" /></>,
  // ── Priority 1 additions ─────────────────────────────────────────────
  p_bb_decline_bench: <><line x1="5" y1="26" x2="28" y2="20" /><circle cx="9" cy="23" r="2" /><line x1="11" y1="22" x2="22" y2="19" /><line x1="17" y1="18" x2="15" y2="11" /><line x1="22" y1="19" x2="25" y2="12" /><line x1="13" y1="10" x2="27" y2="10" /><line x1="13" y1="8" x2="13" y2="12" /><line x1="27" y1="8" x2="27" y2="12" /></>,
  p_incline_db_fly: <><line x1="7" y1="25" x2="22" y2="14" /><circle cx="12" cy="19" r="2" /><line x1="14" y1="18" x2="20" y2="15" /><path d="M17 16c-3-4-6-5-9-5" /><path d="M20 15c3-3 6-4 9-3" /><line x1="8" y1="11" x2="6" y2="9" /><line x1="28" y1="12" x2="30" y2="10" /></>,
  p_db_tricep_kickback: <><circle cx="9" cy="9" r="2" /><line x1="11" y1="10" x2="21" y2="16" /><line x1="21" y1="16" x2="15" y2="24" /><line x1="21" y1="16" x2="27" y2="24" /><line x1="16" y1="13" x2="19" y2="10" /><line x1="19" y1="10" x2="26" y2="8" /><line x1="25" y1="7" x2="28" y2="7" /></>,
  p_incline_db_curl: <><line x1="8" y1="25" x2="22" y2="14" /><circle cx="11" cy="15" r="2" /><line x1="13" y1="16" x2="17" y2="22" /><line x1="16" y1="19" x2="12" y2="26" /><line x1="11" y1="13" x2="16" y2="14" /><line x1="16" y1="14" x2="21" y2="19" /><line x1="21" y1="19" x2="23" y2="18" /></>,
  p_bb_hip_thrust: <><rect x="3.5" y="16.7" width="10.5" height="3.8" rx="1" fill="#dbeafe" stroke="#5b9df5" strokeWidth="1" /><line x1="6" y1="20.5" x2="6" y2="26.5" /><line x1="12" y1="20.5" x2="12" y2="26.5" /><circle cx="11.5" cy="13.2" r="1.8" /><line x1="13" y1="14" x2="21" y2="17" /><line x1="19" y1="16" x2="22" y2="22" /><line x1="22" y1="22" x2="28" y2="22" /><line x1="17" y1="17" x2="28" y2="17" /><line x1="28" y1="15" x2="28" y2="19" /></>,
  p_db_squat: <><circle cx="16" cy="5" r="2.2" /><line x1="16" y1="7" x2="16" y2="16" /><line x1="16" y1="10" x2="10" y2="14" /><line x1="16" y1="10" x2="22" y2="14" /><rect x="8" y="13" width="3" height="4" rx=".5" /><rect x="21" y="13" width="3" height="4" rx=".5" /><line x1="16" y1="16" x2="11" y2="25" /><line x1="16" y1="16" x2="21" y2="25" /><line x1="9" y1="25" x2="14" y2="25" /><line x1="19" y1="25" x2="24" y2="25" /></>,
  p_bb_row: <><circle cx="10" cy="9" r="2" /><line x1="12" y1="10" x2="21" y2="16" /><line x1="21" y1="16" x2="15" y2="25" /><line x1="21" y1="16" x2="25" y2="25" /><line x1="14" y1="12" x2="13" y2="19" /><line x1="6" y1="17" x2="23" y2="13" /><line x1="6" y1="15" x2="6" y2="19" /><line x1="23" y1="11" x2="23" y2="15" /></>,
  p_deadlift: <><circle cx="13" cy="8" r="2" /><line x1="15" y1="9" x2="20" y2="17" /><line x1="15" y1="9" x2="12" y2="14" /><line x1="20" y1="17" x2="15" y2="25" /><line x1="20" y1="17" x2="23" y2="25" /><line x1="7" y1="21" x2="26" y2="21" /><line x1="7" y1="19" x2="7" y2="23" /><line x1="26" y1="19" x2="26" y2="23" /></>,
  p_walking_lunge: <><circle cx="15" cy="5" r="2.2" /><line x1="15" y1="7" x2="15" y2="16" /><line x1="15" y1="10" x2="10" y2="14" /><line x1="15" y1="10" x2="20" y2="14" /><line x1="15" y1="16" x2="8" y2="24" /><line x1="15" y1="16" x2="22" y2="22" /><line x1="7" y1="24" x2="12" y2="24" /><line x1="22" y1="22" x2="21" y2="27" /></>,
  _fallback: <><circle cx="16" cy="4" r="2.2" /><line x1="16" y1="6.2" x2="16" y2="17" /><line x1="16" y1="10" x2="10" y2="14" /><line x1="10" y1="14" x2="8" y2="13" /><line x1="8" y1="12" x2="8" y2="15" /><line x1="16" y1="17" x2="12" y2="25" /><line x1="16" y1="17" x2="20" y2="25" /></>,
};

const Icon = ({ name, size = 18, color = 'currentColor', strokeWidth = 1.8 }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && window.lucide) {
      try {
        window.lucide.createIcons({ nameAttr: 'data-lucide', rootNode: ref.current });
      } catch(e) {}
    }
  }, [name]);
  return (
    <span ref={ref} style={{ display: 'inline-flex', alignItems: 'center' }}>
      <i data-lucide={name} width={size} height={size} color={color} strokeWidth={strokeWidth} />
    </span>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// MUSCLE DIAGRAM  (inline anatomical SVGs — front + rear)
// ═══════════════════════════════════════════════════════════════════════
const ANATOMY_COLOURS = {
  primary: '#5B8DEF',
  secondary: '#B8A7FF',
  neutral: '#D2D1D1',
};

const DISPLAY_TO_SVG_IDS = {
  'Chest': ['pectoralis_major'],
  'Front Delts': ['anterior_deltoid'],
  'Side Delts': ['lateral_deltoid'],
  'Biceps': ['biceps_brachii'],
  'Forearms': ['forearm_flexors', 'forearm_extensors'],
  'Abs': ['rectus_abdominis'],
  'Obliques': ['external_obliques'],
  'Quads': ['quadriceps'],
  'Calves': ['front_lower_leg', 'gastrocnemius'],
  'Rear Delts': ['posterior_deltoid'],
  'Lats': ['latissimus_dorsi'],
  'Mid Traps': ['middle_trapezius_rhomboids'],
  'Upper Traps': ['upper_trapezius'],
  'Triceps': ['triceps_brachii'],
  'Spinal Erectors': ['erector_spinae'],
  'Glutes': ['gluteus_maximus'],
  'Hamstrings': ['hamstrings'],
};

function MuscleDiagram({ primary = [], secondary = [], size = 'medium' }) {
  const frontRef = useRef(null);
  const rearRef = useRef(null);
  const viewSize = { small: 100, medium: 160, large: 220 }[size] || 160;
  const toSvgIdSet = (names) => new Set(
    (Array.isArray(names) ? names : [])
      .flatMap(name => DISPLAY_TO_SVG_IDS[name] || [])
  );

  useEffect(() => {
    const primaryIds = toSvgIdSet(primary);
    const secondaryIds = toSvgIdSet(secondary);
    [frontRef.current, rearRef.current].forEach(root => {
      if (!root) return;
      const svg = root.querySelector('svg');
      if (svg) {
        svg.style.width = '100%';
        svg.style.height = 'auto';
        svg.style.display = 'block';
      }
      root.querySelectorAll('[data-muscle]').forEach(path => {
        const muscleName = path.getAttribute('data-muscle');
        if (primaryIds.has(muscleName)) path.setAttribute('fill', ANATOMY_COLOURS.primary);
        else if (secondaryIds.has(muscleName)) path.setAttribute('fill', ANATOMY_COLOURS.secondary);
        else path.setAttribute('fill', ANATOMY_COLOURS.neutral);
      });
    });
  }, [primary.join('|'), secondary.join('|')]);

  const viewStyle = {
    width: viewSize,
    flex: '0 0 auto',
    lineHeight: 0,
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: Math.max(8, Math.round(viewSize * 0.08)) }}>
      <div ref={frontRef} style={viewStyle} dangerouslySetInnerHTML={{ __html: FRONT_MUSCLE_SVG }} />
      <div ref={rearRef} style={viewStyle} dangerouslySetInnerHTML={{ __html: REAR_MUSCLE_SVG }} />
    </div>
  );
}

const PNG_EXERCISE_ICON_IDS = new Set([
  // Default workout exercises
  'band_row', 'bb_flat_bench', 'bb_incline_bench', 'calf_raises', 'chin_up',
  'cs_db_row', 'db_bench', 'db_floor_press', 'db_row_1arm', 'face_pull', 'farmers_walk',
  'goblet_squat', 'hip_thrust', 'incline_pushups', 'kb_deadlift',
  'pallof_press', 'rdl', 'reverse_fly', 'reverse_lunge', 'sb_ham_curl',
  'single_leg_bal', 'split_squat', 'step_ups', 'suitcase_carry',
  // Preset library exercises
  'p_ab_wheel', 'p_arnold_press', 'p_band_ext_rot', 'p_band_face_pull',
  'p_barbell_curl', 'p_bb_decline_bench', 'p_bb_hip_thrust', 'p_bb_row',
  'p_bird_dog', 'p_bulgarian_squat', 'p_cable_crunch', 'p_cable_fly',
  'p_cable_kickback', 'p_chest_dip', 'p_clamshell', 'p_close_grip_bench',
  'p_concentration_curl', 'p_db_bicep_curl', 'p_db_fly', 'p_db_shoulder_press',
  'p_db_squat', 'p_db_tricep_kickback', 'p_dead_bug', 'p_deadlift',
  'p_diamond_pushup', 'p_donkey_kick', 'p_frog_pumps', 'p_front_raise',
  'p_hammer_curl', 'p_hanging_knee_raise', 'p_hip_abduction', 'p_incline_db_curl',
  'p_incline_db_fly', 'p_incline_db_press', 'p_lat_pulldown', 'p_lateral_raise',
  'p_leg_extension', 'p_leg_press', 'p_overhead_ext', 'p_plank', 'p_preacher_curl',
  'p_pull_up', 'p_push_up', 'p_rdl', 'p_rear_delt_fly', 'p_seated_cable_row',
  'p_seated_leg_curl', 'p_shrugs', 'p_side_plank', 'p_skull_crushers',
  'p_straight_arm_pd', 'p_sumo_squat', 'p_t_bar_row', 'p_tricep_dips',
  'p_tricep_pushdown', 'p_walking_lunge', 'p_wall_sit',
]);

const ExerciseIcon = ({ id, size = 36 }) => {
  const hasPng = PNG_EXERCISE_ICON_IDS.has(id);
  const paths = EXERCISE_ICONS[id] || EXERCISE_ICONS._fallback;
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: '#f1f7ff',
      border: '1px solid #d9e8fb',
      display: 'flex', overflow: 'hidden',
      alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      {hasPng ? (
        <img
          src={`assets/icons/${id}.png?v=${APP_BUILD}`}
          width={size * 0.78}
          height={size * 0.78}
          alt=""
        />
      ) : (
        <svg viewBox="0 0 32 32" width={size * 0.8} height={size * 0.8}
          fill="none" stroke={C.amber} strokeWidth="1.6"
          strokeLinecap="round" strokeLinejoin="round">
          {paths}
        </svg>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// WORKOUT DATA
// ═══════════════════════════════════════════════════════════════════════
const WARMUP = [
  { id: 'wu_stepper',           text: '2 min · Easy stepper or gentle trampoline bounce — get the blood moving' },
  { id: 'wu_cat_cow',           text: '1 min · Cat-cow — 10 slow reps, unloaded, pain-free range · Gentle spinal mobility' },
  { id: 'wu_prone_cobra',       text: '1 min · Prone cobra — lie face down, hands beside chest, lift chest gently · 6 × 5 sec holds · Back extension and disc health' },
  { id: 'wu_hamstring_stretch', text: '30 sec each side · Lying hamstring stretch — on back, loop band or towel around foot, gentle straight-leg pull' },
  { id: 'wu_chest_opener',      text: '1 min · Doorframe chest & shoulder opener — arms at 90° on frame, lean body gently forward · Chest and anterior shoulder' },
  { id: 'wu_pendulum',          text: '30 sec each side · Pendulum swings — lean on bench, arm hangs loose, small gentle circles · Shoulder mobility, important for bursitis' },
  { id: 'wu_pull_aparts',       text: '1 min · Band pull-aparts — 15 reps, light tension · Scapular retraction and upper back activation' },
  { id: 'wu_glute_bridge',      text: '1 min · Glute bridge — 10–12 reps bodyweight · Full hip extension at top' },
];

// ─── STRETCH ROUTINE DATA ───────────────────────────────────────────────────
const STRETCHES = [
  {
    id: 'str_neck',
    name: 'Neck Side Stretch',
    targets: 'Upper traps · Neck',
    cue: 'Sit or stand tall. Place one hand gently over your head and draw your ear toward your shoulder. Keep your face forward — no rotation. Breathe slowly and hold.',
    bilateral: true,
    suggestedSecs: 30,
  },
  {
    id: 'str_cross_shoulder',
    name: 'Cross-Body Shoulder Stretch',
    targets: 'Posterior shoulder · Rotator cuff',
    cue: 'Bring one arm across your chest at shoulder height. Use your other hand to gently pull it closer to your body. Keep your shoulder down, not shrugging. Good for shoulder bursitis recovery.',
    bilateral: true,
    suggestedSecs: 30,
  },
  {
    id: 'str_pec_roller_t',
    id2: 'str_pec_roller_w',
    name: 'Pec Stretch on Foam Roller',
    targets: 'Chest · Anterior shoulder',
    cue: 'Lie lengthways along the foam roller so it supports your entire spine. First: T position — arms spread level with shoulders. Then: W position — elbows bent, forearms raised. Let gravity open the chest in each position. Don\'t force your hands to the floor.',
    bilateral: false,
    suggestedSecs: 60,
  },
  {
    id: 'str_upper_back_roller',
    name: 'Upper Back Foam Roller',
    targets: 'Thoracic spine · Upper back',
    cue: 'Place the foam roller perpendicular to your spine across your upper back, hips on the floor. Clasp hands behind your head to support your neck. Slowly allow your upper back to extend backwards over the roller. Shift position to find tight spots.',
    bilateral: false,
    suggestedSecs: 60,
  },
  {
    id: 'str_cat_cow_cow',
    id2: 'str_cat_cow_cat',
    name: 'Cat-Cow',
    targets: 'Spine · Lower back · Core',
    cue: 'On hands and knees, wrists under shoulders. Inhale — drop belly, lift head and tailbone (cow). Exhale — round spine toward ceiling, tuck chin and pelvis (cat). Move slowly through 10 full breaths, one breath per rep.',
    bilateral: false,
    suggestedSecs: 60,
  },
  {
    id: 'str_childs_pose',
    name: "Child's Pose",
    targets: 'Lower back · Lats · Hips',
    cue: 'Kneel and sit back toward your heels. Reach arms forward along the floor and let your lower back lengthen and relax. For a lat stretch, walk both hands to one side, hold, then the other side.',
    bilateral: false,
    suggestedSecs: 60,
  },
  {
    id: 'str_spinal_rotation',
    name: 'Seated Spinal Rotation',
    targets: 'Thoracic spine · Obliques',
    cue: 'Sit upright with legs crossed or extended. Place hands behind your head or cross arms over your chest. Rotate your torso to one side as far as comfortable, keeping hips facing forward. Hold, then switch sides.',
    bilateral: true,
    suggestedSecs: 30,
  },
  {
    id: 'str_hip_flexor',
    name: 'Kneeling Hip Flexor Stretch',
    targets: 'Hip flexors · Quads',
    cue: 'Kneel with one knee on the floor, other foot forward in a lunge. Tuck your pelvis under — bring your hips forward without arching your lower back. Feel the stretch at the front of the rear hip. Hold without leaning forward excessively.',
    bilateral: true,
    suggestedSecs: 45,
  },
  {
    id: 'str_figure_four',
    name: 'Figure-4 Glute Stretch',
    targets: 'Glutes · Piriformis · Hip',
    cue: 'Lie on your back, knees bent, feet flat. Cross one ankle over the opposite knee to form a figure-4. Pull the uncrossed leg gently toward your chest until you feel the stretch deep in the crossed-leg glute. Hold, then switch sides.',
    bilateral: true,
    suggestedSecs: 45,
  },
  {
    id: 'str_hamstring',
    name: 'Lying Hamstring Stretch',
    targets: 'Hamstrings · Lower back',
    cue: 'Lie on your back, both legs flat. Loop a towel or resistance band around one foot and slowly lift that leg toward the ceiling. Keep the opposite leg flat on the floor. Stop when you feel a gentle stretch down the back of the raised leg. Breathe slowly.',
    bilateral: true,
    suggestedSecs: 45,
  },
  {
    id: 'str_it_band',
    name: 'IT Band / Lateral Hip Stretch',
    targets: 'IT band · Outer hip · Glutes',
    cue: 'Stand near a wall for balance. Cross one leg behind the other and lean your hips away from the crossed leg — you should feel a stretch along the outside of the front hip and thigh. Keep both feet flat on the floor.',
    bilateral: true,
    suggestedSecs: 30,
  },
  {
    id: 'str_calf_straight',
    id2: 'str_calf_bent',
    name: 'Calf Stretch',
    targets: 'Gastrocnemius · Soleus',
    cue: 'Stand in a lunge, hands on a wall. First: back leg straight, heel pressed to the floor — stretches the upper calf (gastroc). Then: slightly bend the back knee — shifts the stretch to the lower calf (soleus). Hold each variation before switching sides.',
    bilateral: true,
    suggestedSecs: 30,
  },
];

// ─── STRETCH LIBRARY (exercises + warm-up + finisher stretches) ────────────
// STRETCHES items are shallow-cloned so applyStretchMeta does not mutate
// the originals used by StretchActive, WarmupActive, and Dashboard.
const STRETCH_LIBRARY = [
  ...STRETCHES.map(s => ({ ...s })),
  // ── Warm-up mobility stretches ────────────────────────────────────────────
  // wu_cat_cow excluded — duplicate of str_cat_cow_cow above
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
  // fin_ham_floss excluded — duplicate of str_hamstring above
  // fin_childs_pose excluded — duplicate of str_childs_pose above

  // ── Additional stretches — full muscle-tendon coverage ─────────────────────
  // Neck
  { id: 'str_neck_rotation',      imageDir: 'stretches', bilateral: true,  suggestedSecs: 30,
    name: 'Neck Rotation',
    targets: 'Neck · Upper traps',
    cue: 'Sit or stand tall with shoulders relaxed. Slowly turn your head to look over one shoulder — go only as far as comfortable, no forcing. Hold 5 sec, return to centre, repeat the other side. Stop if any dizziness or pinching.' },
  // Shoulders
  { id: 'str_overhead_triceps',   imageDir: 'stretches', bilateral: true,  suggestedSecs: 30,
    name: 'Overhead Triceps Stretch',
    targets: 'Triceps · Shoulder',
    cue: 'Raise one arm overhead and bend the elbow so your hand reaches toward your upper back. Use the opposite hand to gently press the elbow backward. Keep your torso upright — do not arch the lower back. 30 sec each side.' },
  // Chest
  { id: 'str_upward_dog',         imageDir: 'stretches', bilateral: false, suggestedSecs: 30,
    name: 'Upward Facing Dog',
    targets: 'Chest · Abs · Anterior shoulder',
    cue: 'Lie face down, hands flat beside your lower chest. Press up through your arms, lifting your chest off the floor. Keep legs and feet flat. Open the chest and look forward or slightly upward. Stop if any lower-back discomfort.' },
  { id: 'str_biceps_wall',        imageDir: 'stretches', bilateral: true,  suggestedSecs: 30,
    name: 'Biceps Wall Stretch',
    targets: 'Biceps · Chest · Anterior shoulder',
    cue: 'Stand facing a wall. Extend one arm and place your palm flat against the surface with fingers pointing backward. Gently rotate your body away until you feel a stretch along the front of your arm and chest. Keep your shoulder down. 30 sec each side.' },
  // Trunk
  { id: 'str_sideways_bend',      imageDir: 'stretches', bilateral: true,  suggestedSecs: 30,
    name: 'Standing Side Bend',
    targets: 'Obliques · Lats · Trunk',
    cue: 'Stand tall with feet hip-width apart. Raise one arm overhead and lean slowly to the opposite side — feel the stretch along the side of your trunk and lat. Support with the other hand on your hip. Do not twist. Return upright slowly. 30 sec each side.' },
  // Lower back
  { id: 'str_knee_to_chest',      imageDir: 'stretches', bilateral: true,  suggestedSecs: 30,
    name: 'Knee to Chest',
    targets: 'Lower back · Glutes',
    cue: 'Lie on your back with knees bent. Draw one knee gently toward your chest, holding behind the thigh (not the knee). Keep the other foot flat on the floor. Feel the stretch in your lower back and glute. 30 sec each side.' },
  { id: 'str_spine_twist',        imageDir: 'stretches', bilateral: true,  suggestedSecs: 30,
    name: 'Lying Spine Twist',
    targets: 'Thoracic spine · Obliques',
    caution: 'Slipped disc — rotate from your upper back (thoracic) only. Stop immediately if any lower-back pain or sensation down your legs.',
    cue: 'Lie on your back with knees bent. Let both knees fall slowly to one side — go only as far as comfortable, hips stacked. Focus on rotating from your upper back (thoracic), not your lower back. ⚠️ Stop immediately if any lower-back pain or sensation down your legs. 30 sec each side.' },
  // Hips
  { id: 'str_90_90_hip',          imageDir: 'stretches', bilateral: true,  suggestedSecs: 45,
    name: '90/90 Hip Stretch',
    targets: 'Hip flexors · Glutes · Hip rotators',
    cue: 'Sit on the floor with both legs bent at 90°: front leg across in front, back leg out to the side. Sit tall and lean gently forward over the front shin. Feel the stretch deep in the outer glute and hip. 45 sec each side.' },
  { id: 'str_pigeon',             imageDir: 'stretches', bilateral: true,  suggestedSecs: 45,
    name: 'Pigeon Pose',
    targets: 'Glutes · Hip rotators · Hip flexors',
    caution: 'Skip if you feel any pain in your knee — this is a deep stretch and must never be forced.',
    cue: 'From all-fours, bring one knee forward toward your wrist and let the shin angle across the mat. Extend the back leg straight behind. Sit tall first — if hips are level and comfortable, fold forward gently. Do not force the hip toward the floor. ⚠️ Stop if you feel knee pain. 45 sec each side.' },
  // Legs
  { id: 'str_quad_standing',      imageDir: 'stretches', bilateral: true,  suggestedSecs: 30,
    name: 'Standing Quad Stretch',
    targets: 'Quadriceps · Hip flexors',
    cue: 'Stand near a wall for balance. Bend one knee and hold your ankle behind you — draw the heel toward your glute. Keep knees together and stand tall. Squeeze the glute of the stretching leg for a deeper hip flexor stretch. 30 sec each side.' },
  { id: 'str_forward_fold',       imageDir: 'stretches', bilateral: false, suggestedSecs: 45,
    name: 'Seated Forward Fold',
    targets: 'Hamstrings · Lower back',
    cue: 'Sit on the floor with both legs extended straight. Hinge from your hips and reach forward along your legs — do not round your lower back. Feel the stretch in your hamstrings. If very tight, sit on a folded towel to tilt the pelvis forward. Hold 45 sec.' },
  // Ankles
  { id: 'str_ankle_circles',      imageDir: 'stretches', bilateral: true,  suggestedSecs: 30,
    name: 'Ankle Circles',
    targets: 'Ankle · Lower leg',
    cue: 'Sit or lie down. Lift one foot and draw slow, full circles with your toes — 10 clockwise then 10 anti-clockwise. Move through the full comfortable range of the ankle joint. Repeat on the other foot.' },
  { id: 'str_ankle_dorsiflexion', imageDir: 'stretches', bilateral: true,  suggestedSecs: 30,
    name: 'Wall Ankle Dorsiflexion',
    targets: 'Ankle · Calves',
    cue: 'Stand facing a wall, about 10–15 cm away. Place one foot forward with toes near the wall. Bend your knee and push it toward the wall — heel must stay flat on the floor. If your knee reaches the wall easily, step slightly farther back. 30 sec each side.' },
  // ── Sciatica-specific stretches ───────────────────────────────────────────
  { id: 'str_nerve_floss',        imageDir: 'stretches', bilateral: true,  suggestedSecs: 30,
    name: 'Sciatic Nerve Floss',
    targets: 'Sciatic nerve · Neural mobility · Hamstrings',
    cue: 'Sit upright on a chair with feet flat on the floor. Extend one leg out straight while tilting your head back — look up at the ceiling. Then bend the knee back down and drop your chin to your chest at the same time. Keep the movement slow and rhythmic. You should feel a gentle pulling sensation along the back of the leg — not pain. 10–15 reps each side.' },
  { id: 'str_piriformis_seated',  imageDir: 'stretches', bilateral: true,  suggestedSecs: 45,
    name: 'Seated Piriformis Stretch',
    targets: 'Piriformis · Glutes · Hip rotators',
    cue: 'Sit tall on a chair with feet flat on the floor. Cross one ankle over the opposite knee — keep your foot flexed to protect the knee. Gently lean forward from the hips (not the waist) until you feel a deep stretch in the outer glute and hip. Keep your back straight. 45 sec each side.' },
  // ── Additional sciatica stretches (from clinical sources) ─────────────────
  { id: 'str_knee_opp_shoulder', imageDir: 'stretches', bilateral: true,  suggestedSecs: 20,
    name: 'Knee to Opposite Shoulder',
    targets: 'Piriformis · Glutes · Sciatic nerve',
    cue: 'Lie on your back with both legs extended. Bend one knee and use both hands to gently pull it diagonally across your body toward the opposite shoulder. Keep your other leg flat and your lower back in contact with the floor. Feel the deep stretch in the outer glute and hip. 20 sec each side, 3 reps.' },
  { id: 'str_double_knee_chest', imageDir: 'stretches', bilateral: false, suggestedSecs: 30,
    name: 'Double Knee to Chest',
    targets: 'Lower back · Glutes · Lumbar decompression',
    cue: 'Lie on your back. Bend both knees and draw them toward your chest together, holding behind your thighs (not your knees). Gently rock side to side if comfortable. Feel the stretch across the lower back. 30 sec.' },
  { id: 'str_nerve_glide_supine', imageDir: 'stretches', bilateral: true, suggestedSecs: 30,
    name: 'Supine Sciatic Nerve Glide',
    targets: 'Sciatic nerve · Neural mobility · Hamstrings',
    cue: 'Lie on your back. Bend one knee and hold the back of that thigh with both hands. Gently straighten the knee until you feel a pull in the back of the leg. From there, slowly pump your ankle — toes toward you, then away — without bending the knee. Keep the movement controlled. You should feel a gentle sliding sensation along the back of the leg, not sharp pain. 10 reps × 3 sec, 2 sets each side.' },
  { id: 'str_trunk_rotations',   imageDir: 'stretches', bilateral: false, suggestedSecs: 60,
    name: 'Lower Trunk Rotations',
    targets: 'Lower back · Lumbar mobility · Hip rotators',
    caution: 'Slipped disc — use only a pain-free range. Stop immediately if any lower-back pain or sensation down your legs. This is gentle rhythmic mobilisation, not a forced rotation.',
    cue: 'Lie on your back with knees bent and feet flat. Keeping your shoulders on the floor, gently let both knees rock to one side — go only as far as comfortable. Return to centre and rock to the other side. Slow, rhythmic motion — not a stretch, just a gentle roll. 20 reps total (10 each side).' },
  // ── Cross-legged sitting stretches ───────────────────────────────────────
  { id: 'str_butterfly',         imageDir: 'stretches', bilateral: false, suggestedSecs: 45,
    name: 'Butterfly Stretch',
    targets: 'Inner thigh · Adductors · Hip external rotators',
    cue: 'Sit tall on the floor with the soles of your feet together and your heels drawn in toward your body. Let your knees fall gently toward the floor — do not force them down. To deepen, hinge slightly forward from the hips with a straight back. If very tight, sit on a folded blanket to tilt your pelvis forward. 45 sec.' },
  { id: 'str_deep_squat',        imageDir: 'stretches', bilateral: false, suggestedSecs: 45,
    name: 'Deep Squat Hold',
    targets: 'Hips · Adductors · Hip flexors · Ankles',
    caution: 'Slipped disc — keep your spine absolutely neutral. No rounding of the lower back. Use a doorframe or chair for support and stop immediately if any lower-back pain or leg sensation.',
    cue: 'Stand with feet slightly wider than shoulder-width, toes turned out 30–45°. Hold a doorframe or chair for support. Slowly lower into a squat, keeping heels on the floor if possible. Keep your chest up and spine neutral — do not round your lower back. Breathe slowly and let your hips sink deeper with each exhale. If heels rise, place a folded mat under them. 45 sec.' },
  { id: 'str_lateral_lunge',     imageDir: 'stretches', bilateral: true,  suggestedSecs: 30,
    name: 'Lateral Lunge Stretch',
    targets: 'Inner thigh · Adductors · Hip flexors',
    cue: 'Stand with feet roughly twice shoulder-width apart, toes pointing forward. Keeping both feet flat on the floor, slowly bend one knee and shift your weight to that side — lower until you feel a deep stretch in the inner thigh of the straight leg. Keep your bent knee tracking over your toes and your chest upright. 30 sec each side.' },
  { id: 'str_pilates_saw',       imageDir: 'stretches', bilateral: true,  suggestedSecs: 30,
    name: 'Pilates Saw',
    targets: 'Hamstrings · Inner thigh · Thoracic rotation · Posture',
    cue: 'Sit on the floor with legs extended wide apart and arms out to the sides at shoulder height. Sit as tall as possible — do not slouch. Inhale to prepare, then exhale as you rotate your torso toward one leg and reach the opposite hand past the outside of that foot (the "saw" motion). Keep both hips grounded. Inhale back to centre. 4–5 reps each side, holding each reach for 2–3 breaths.' },
];

// ─── WARMUP GROUPS — 8 fixed muscle-group slots ────────────────────────────
// options: curated list of STRETCH_LIBRARY IDs suitable for this group.
// defaultId: used when no saved config exists.
const WARMUP_GROUPS = [
  {
    id: 'neck', label: 'Neck', emoji: '🧠',
    defaultId: { A: 'str_neck_rotation', B: 'str_neck_rotation', C: 'str_neck_rotation' },
    options: ['str_neck_rotation', 'str_neck'],
  },
  {
    id: 'shoulders', label: 'Shoulders', emoji: '💪',
    // A (Push): pendulum loosens the joint before pressing; B (Pull): same — scapular prep; C (Legs): same
    defaultId: { A: 'wu_pendulum', B: 'wu_pendulum', C: 'wu_pendulum' },
    options: ['wu_pendulum', 'str_cross_shoulder', 'str_overhead_triceps'],
  },
  {
    id: 'chest', label: 'Chest', emoji: '🫁',
    // A (Push): chest opener primes pec/anterior delt for pressing; B (Pull): biceps wall stretch
    // targets the biceps/anterior chain loaded during rows & curls; C (Legs): upward dog opens hip
    // flexors and thoracic spine before squatting
    defaultId: { A: 'wu_chest_opener', B: 'str_biceps_wall', C: 'str_upward_dog' },
    options: ['wu_chest_opener', 'str_upward_dog', 'str_biceps_wall'],
  },
  {
    id: 'trunk', label: 'Trunk', emoji: '🔄',
    defaultId: { A: 'str_cat_cow_cow', B: 'str_cat_cow_cow', C: 'str_cat_cow_cow' },
    options: ['str_cat_cow_cow', 'str_sideways_bend', 'str_spinal_rotation', 'str_pilates_saw'],
  },
  {
    id: 'lowerback', label: 'Lower Back', emoji: '🔻',
    // A & B: prone cobra activates thoracic extensors; C (Legs/hinge day): child's pose
    // decompresses the lumbar spine before deadlifts, squats, and hip thrusts
    defaultId: { A: 'wu_prone_cobra', B: 'wu_prone_cobra', C: 'str_childs_pose' },
    options: ['wu_prone_cobra', 'str_knee_to_chest', 'str_double_knee_chest', 'str_childs_pose'],
  },
  {
    id: 'hips', label: 'Hips', emoji: '🦋',
    // A (Push): figure-four keeps hip/sciatica coverage on a session that doesn't load hips;
    // B (Pull): hip-flexor stretch counters the anterior tilt loaded by deadlifts;
    // C (Legs): 90/90 opens both hip internal & external rotation — critical before squats/lunges
    defaultId: { A: 'str_figure_four', B: 'str_hip_flexor', C: 'str_90_90_hip' },
    options: ['str_figure_four', 'str_pigeon', 'str_90_90_hip', 'str_piriformis_seated', 'str_butterfly', 'str_hip_flexor', 'str_knee_opp_shoulder'],
  },
  {
    id: 'legs', label: 'Legs', emoji: '🦵',
    // Hamstring stretch retained across all workouts — core sciatica/hamstring care requirement
    defaultId: { A: 'wu_hamstring_stretch', B: 'wu_hamstring_stretch', C: 'wu_hamstring_stretch' },
    options: ['wu_hamstring_stretch', 'str_hamstring', 'str_quad_standing', 'str_forward_fold', 'str_it_band', 'str_lateral_lunge'],
  },
  {
    id: 'ankles', label: 'Ankles', emoji: '🦶',
    // A & B: circles for general ankle mobility; C (Legs): dorsiflexion prep is critical for
    // squat depth and lunge stability
    defaultId: { A: 'str_ankle_circles', B: 'str_ankle_circles', C: 'str_ankle_dorsiflexion' },
    options: ['str_ankle_circles', 'str_ankle_dorsiflexion', 'str_calf_straight'],
  },
];

// Returns the 8-element stretch-ID array for a given workout ('A', 'B', or 'C').
// Falls back to the per-workout group default if a slot has no saved value.
function getWarmupConfig(workout) {
  const raw = JSON.parse(localStorage.getItem('il_warmup_config') || '{}');
  const saved = raw[workout] || [];
  return WARMUP_GROUPS.map((group, i) => saved[i] || group.defaultId[workout] || group.defaultId.A);
}

// Saves a single slot choice.
function saveWarmupChoice(workout, slotIndex, stretchId) {
  const raw = JSON.parse(localStorage.getItem('il_warmup_config') || '{}');
  const saved = raw[workout] ? [...raw[workout]] : WARMUP_GROUPS.map(g => g.defaultId[workout] || g.defaultId.A);
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

// Returns a human-readable duration string for a stretch.
function fmtStretchDur(s) {
  if (!s) return '';
  return s.bilateral ? `${s.suggestedSecs}s each side` : `${s.suggestedSecs}s`;
}

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
  // wu_cat_cow excluded — duplicate of str_cat_cow_cow
  wu_prone_cobra:       ['Spinal Erectors', 'Abs'],
  wu_hamstring_stretch: ['Hamstrings',      'Spinal Erectors'],
  wu_chest_opener:      ['Chest',           'Front Delts'],
  wu_pendulum:          ['Rear Delts',      null],
  // fin_ham_floss excluded — duplicate of str_hamstring
  // fin_childs_pose excluded — duplicate of str_childs_pose
  // Additional stretches — full muscle-tendon coverage
  str_neck_rotation:      ['Upper Traps',     null],
  str_overhead_triceps:   ['Triceps',         null],
  str_upward_dog:         ['Abs',             'Chest'],
  str_biceps_wall:        ['Biceps',          'Chest'],
  str_sideways_bend:      ['Obliques',        'Lats'],
  str_knee_to_chest:      ['Spinal Erectors', 'Glutes'],
  str_spine_twist:        ['Obliques',        'Spinal Erectors'],
  str_90_90_hip:          ['Glutes',          null],
  str_pigeon:             ['Glutes',          null],
  str_quad_standing:      ['Quads',           null],
  str_forward_fold:       ['Hamstrings',      'Spinal Erectors'],
  str_ankle_circles:      ['Calves',          null],
  str_ankle_dorsiflexion: ['Calves',          null],
  // Sciatica-specific
  str_nerve_floss:          ['Hamstrings',      null],
  str_piriformis_seated:    ['Glutes',          null],
  // Additional sciatica (clinical sources)
  str_knee_opp_shoulder:    ['Glutes',          null],
  str_double_knee_chest:    ['Spinal Erectors', 'Glutes'],
  str_nerve_glide_supine:   ['Hamstrings',      null],
  str_trunk_rotations:      ['Spinal Erectors', 'Obliques'],
  // Cross-legged sitting
  str_butterfly:            ['Glutes',          null],   // adductors not in SVG — glutes closest
  str_deep_squat:           ['Glutes',          'Quads'],
  str_lateral_lunge:        ['Glutes',          'Quads'], // adductors not in SVG
  str_pilates_saw:          ['Hamstrings',      'Obliques'],
};

// IDs of stretches that directly address sciatica nerve pain.
// This set drives the s.sciatica flag (applied in applyStretchMeta)
// and the Sciatica filter toggle in the Stretches tab.
const STRETCH_SCIATICA_IDS = new Set([
  'str_figure_four',       // piriformis — compresses sciatic nerve
  'str_childs_pose',       // lumbar decompression
  'str_hamstring',         // tight hamstrings contribute to sciatica
  'wu_hamstring_stretch',  // same
  'wu_prone_cobra',        // lumbar extension (McKenzie method)
  'str_knee_to_chest',     // lumbar decompression
  'str_pigeon',            // deep piriformis
  'str_90_90_hip',         // piriformis / hip external rotators
  'str_forward_fold',      // hamstring + neural tension
  'str_nerve_floss',       // direct sciatic nerve mobilisation (seated)
  'str_piriformis_seated', // piriformis
  // Clinical additions (OAH PDF + Healthline):
  'str_knee_opp_shoulder', // piriformis pull toward opposite shoulder
  'str_double_knee_chest', // bilateral lumbar decompression
  'str_nerve_glide_supine',// supine sciatic nerve glide (pump ankle)
  'str_trunk_rotations',   // gentle lumbar mobilisation (wig wags)
]);

// IDs of stretches that help achieve comfortable cross-legged floor sitting.
// Covers adductors, hip external rotation, hip flexors, hamstrings (pelvic tilt),
// and thoracic extension (to prevent slouching).
const STRETCH_CROSS_LEGGED_IDS = new Set([
  'str_figure_four',       // piriformis / hip external rotation
  'str_piriformis_seated', // piriformis / hip external rotation
  'str_pigeon',            // deep hip external rotation
  'str_90_90_hip',         // hip external rotation
  'str_hip_flexor',        // hip flexors
  'str_hamstring',         // hamstrings → tight = posterior pelvic tilt = slouch
  'wu_hamstring_stretch',  // same
  'str_forward_fold',      // hamstrings
  'str_childs_pose',       // general hip / lower back mobility
  'str_knee_to_chest',     // hip flexor / back decompression
  'str_butterfly',         // adductors — the primary missing ingredient
  'str_deep_squat',        // comprehensive hip joint opener
  'str_lateral_lunge',     // adductors from standing angle
  'str_pilates_saw',       // seated wide-leg reach — trains upright posture
]);

const YT = q => `https://www.youtube.com/results?search_query=${q}`;

const EXERCISES = {
  goblet_squat:       { name: 'Goblet Squat',               muscle: 'Legs',    unit: 'kg',   defaultReps: 8,  defaultSets: 3, repMax: 8,  cue: '2 sec down, 1 sec pause, drive up. Use KB or DB held at chest.',                                                                   demo: YT('goblet+squat+tutorial+form+how+to') },
  db_bench:           { name: 'DB Bench Press',              muscle: 'Push',    unit: 'kg',   defaultReps: 8,  defaultSets: 3, repMax: 8,  cue: 'Elbows 30–45° from body, not flared. Flat or slight incline — choose what shoulders tolerate best.',                                demo: YT('dumbbell+bench+press+form+tutorial') },
  db_row_1arm:        { name: 'One-Arm DB Row',              muscle: 'Pull',    unit: 'kg',   defaultReps: 10, defaultSets: 3, repMax: 10, cue: 'Bench-supported. Torso parallel to floor. No twisting.',                               perSide: true,              demo: YT('one+arm+dumbbell+row+proper+form+tutorial') },
  step_ups:           { name: 'Step-Ups',                    muscle: 'Legs',    unit: 'kg',   defaultReps: 8,  defaultSets: 3, repMax: 8,  cue: 'Drive through heel. Control descent. Bodyweight or light load.',                        perSide: true, canBW: true, demo: YT('step+ups+exercise+proper+form+tutorial') },
  pallof_press:       { name: 'Pallof Press',                muscle: 'Core',    unit: 'band', defaultReps: 10, defaultSets: 2, repMax: 10, cue: 'Anti-rotation. Brace core. Resist the pull.',                                           perSide: true,              demo: YT('pallof+press+tutorial+how+to+anti+rotation') },
  kb_deadlift:        { name: 'KB Deadlift (Raised Height)', muscle: 'Hinge',   unit: 'kg',   defaultReps: 8,  defaultSets: 3, repMax: 8,  cue: 'KB on plates/platform to reduce depth. Neutral spine. Push the floor away. Conservative — do not rush depth progression.',           demo: YT('kettlebell+deadlift+form+tutorial+beginners'), caution: 'Slipped disc — stop immediately if lower back pain or any sensation radiating down your legs.' },
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
  bb_flat_bench:      { name: 'Barbell Flat Bench Press',    muscle: 'Push',    unit: 'kg',   defaultReps: 6,   defaultSets: 3, repMax: 8,  cue: 'Elbows 45° from body. Bar lowers to mid-chest. Drive up explosively. Use safety pins or spotter.', demo: YT('barbell+bench+press+proper+form+tutorial') },
  bb_incline_bench:   { name: 'Barbell Incline Bench Press', muscle: 'Push',    unit: 'kg',   defaultReps: 6,   defaultSets: 3, repMax: 8,  cue: 'Low incline only (20–30°). Higher angles approach overhead press — avoid for shoulder bursitis. Elbows at 45°.', demo: YT('barbell+incline+bench+press+form+tutorial'), caution: 'Shoulder bursitis — low incline only (20–30°). Stop if you feel any shoulder impingement.' },
  chin_up:            { name: 'Chin-Up',                     muscle: 'Pull',    unit: 'bw',   defaultReps: 4,   defaultSets: 3, repMax: 8,  cue: 'Underhand grip, shoulder-width or narrower only. No wide grip — aggravates shoulder bursitis. Start with band assistance or negatives. Full hang, chin over bar.', canBW: true, pullupTracking: true, demo: YT('chin+up+form+band+assisted+beginners+underhand'), caution: 'Shoulder bursitis — shoulder-width or narrower grip only. No wide grip. Stop if impingement.' },
  face_pull:          { name: 'Face Pull',                   muscle: 'Pull',    unit: 'band', defaultReps: 15,  defaultSets: 3, repMax: 20, cue: 'Band at face height. Pull to forehead, elbows high and wide. Finish with external rotation. Essential for shoulder health.', demo: YT('face+pull+band+form+shoulder+health+tutorial') },
  reverse_fly:        { name: 'Reverse Fly',                 muscle: 'Pull',    unit: 'kg',   defaultReps: 15,  defaultSets: 3, repMax: 15, cue: 'Hinge forward or lie face-down on incline bench. Light weight only. Lead with elbows back and out. Rear delts, not traps.', demo: YT('reverse+fly+rear+delt+dumbbell+form+tutorial') },
  rdl:                { name: 'Romanian Deadlift',           muscle: 'Hinge',   unit: 'kg',   defaultReps: 8,   defaultSets: 3, repMax: 10, cue: 'Neutral spine throughout — no rounding. Hinge at hips, soft knee bend. Bar stays close to legs. Stop well before hamstring pull. Conservative range.', demo: YT('romanian+deadlift+form+tutorial+neutral+spine+beginners'), caution: 'Slipped disc — neutral spine only, no rounding. Stop before any lower back tightness or hamstring pull.' },
  reverse_lunge:      { name: 'Reverse Lunge',               muscle: 'Legs',    unit: 'kg',   defaultReps: 8,   defaultSets: 3, repMax: 10, cue: 'Step back, lower rear knee toward floor. Torso upright. Drive through front heel to return. Safer for lower back than forward lunges.', perSide: true, canBW: true, demo: YT('reverse+lunge+proper+form+dumbbell+tutorial') },
  farmers_walk:       { name: "Farmer's Walk",               muscle: 'Core',    unit: 'kg',   defaultReps: null, defaultDuration: 20, defaultSets: 3, repMax: null, cue: 'Stand tall, brace core hard, do not lean. Walk 5m each way. KB or DB. Builds anti-lateral-flexion core strength and grip.', isTimed: true, demo: YT('farmers+walk+exercise+form+core+grip+tutorial') },
};

const WORKOUTS = {
  A: {
    title: 'Push — Chest · Shoulders · Triceps',
    exercises: [
      'bb_flat_bench',      // Chest / Triceps
      'p_db_fly',           // Chest / Shoulders — isolation, fills chest gap
      'p_db_shoulder_press',// Shoulders / Triceps
      'p_lateral_raise',    // Shoulders — lateral head
      'p_rear_delt_fly',    // Shoulders / Back — balances pushing, shoulder health
      'p_band_ext_rot',     // Shoulders — rotator cuff, critical for bursitis
      'p_close_grip_bench', // Triceps / Chest
      'p_tricep_pushdown',  // Triceps — band, door anchor
    ],
    finisher: [
      { id: 'fin_wall_slides', text: 'Wall slides — 2 × 6 slow (pain-free only)' },
      { id: 'fin_pull_aparts', text: 'Band pull-aparts — 2 × 12' },
    ],
  },
  B: {
    title: 'Pull — Back · Biceps · Hinge',
    exercises: [
      'kb_deadlift',        // Hinge / Glutes — raised height
      'cs_db_row',          // Back / Biceps — chest supported
      'reverse_fly',        // Back / Shoulders — rear delt, posterior chain
      'face_pull',          // Shoulders / Back — band, door anchor, shoulder health
      'p_straight_arm_pd',  // Back / Shoulders — lat isolation, door anchor high hook
      'p_db_bicep_curl',    // Biceps / Forearms
      'p_hammer_curl',      // Biceps / Forearms — neutral grip
    ],
    finisher: [
      { id: 'fin_ham_floss',   text: 'Hamstring floss (band, lying) — 45 sec each side' },
      { id: 'fin_childs_pose', text: "Child's pose breathing — 60 sec" },
    ],
  },
  C: {
    title: 'Legs + Core',
    exercises: [
      'goblet_squat',       // Legs / Glutes
      'p_sumo_squat',       // Legs / Glutes — inner thigh, previously untrained
      'rdl',                // Hinge / Glutes
      'hip_thrust',         // Glutes / Legs
      'reverse_lunge',      // Legs / Glutes
      'sb_ham_curl',        // Legs / Core — hamstring isolation
      'p_cable_kickback',   // Glutes / Legs — ankle strap, door anchor low hook
      'calf_raises',        // Legs — previously untrained
      'p_dead_bug',         // Core — deep abs, spine neutral, safe for lower back
      'p_plank',            // Core — isometric abs, full body stability
      'pallof_press',       // Core — anti-rotation, band
      'farmers_walk',       // Core / Forearms
    ],
    finisher: [
      { id: 'fin_ext_rotation', text: 'Band external rotation — 2 × 10 each side' },
      { id: 'fin_single_leg',   text: 'Single-leg balance — 30 sec each side' },
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════
// SUPABASE SYNC
// ═══════════════════════════════════════════════════════════════════════
const SUPABASE_URL  = 'https://bhlbebdmuodscdgcwkyb.supabase.co';
const SUPABASE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJobGJlYmRtdW9kc2NkZ2N3a3liIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1NDY2MjEsImV4cCI6MjA5MzEyMjYyMX0.0Z6eLhcbVZIuSA9V_l4z9IRPbdrlfAlY6UOh8lvJFDU';
const IRONLOG_UID   = 'ba29275d-ad25-48b4-9d7d-43a5ad8124cf';
const db = window.supabase?.createClient(SUPABASE_URL, SUPABASE_KEY);

async function pushSession(session) {
  if (!db) return;
  try {
    await db.from('ironlog_sessions').upsert({
      id: session.id, user_id: IRONLOG_UID,
      workout: session.workout, date: session.date,
      data: session, updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });
  } catch (e) { console.warn('IronLog sync (session):', e); }
}

async function pushRide(ride) {
  if (!db) return;
  try {
    await db.from('ironlog_rides').upsert({
      id: ride.id, user_id: IRONLOG_UID,
      data: ride, updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });
  } catch (e) { console.warn('IronLog sync (ride):', e); }
}

async function pullSessions(localSessions) {
  if (!db) return null;
  try {
    const { data, error } = await db
      .from('ironlog_sessions')
      .select('data')
      .eq('user_id', IRONLOG_UID)
      .order('date', { ascending: false });
    if (error || !data) return null;
    // Only restore if cloud has more sessions — guards against iOS localStorage purge
    if (data.length > localSessions.length) return data.map(r => r.data);
  } catch (e) { console.warn('IronLog restore (sessions):', e); }
  return null;
}

async function pullRides(localRides) {
  if (!db) return null;
  try {
    const { data, error } = await db
      .from('ironlog_rides')
      .select('data')
      .eq('user_id', IRONLOG_UID)
      .order('created_at', { ascending: false });
    if (error || !data) return null;
    if (data.length > localRides.length) return data.map(r => r.data);
  } catch (e) { console.warn('IronLog restore (rides):', e); }
  return null;
}

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

function buildSession(workoutKey, prevSessions, allExercises = EXERCISES, workoutCustom = {}, workoutHidden = {}, preStartSwaps = {}) {
  const wkt = WORKOUTS[workoutKey];
  const extraIds = workoutCustom[workoutKey] || [];
  const hiddenIds = new Set(workoutHidden[workoutKey] || []);
  // Apply swaps: replace flagged IDs with their chosen replacements
  const rawIds = [...wkt.exercises, ...extraIds].filter(id => !hiddenIds.has(id));
  const swappedIds = rawIds.map(id => preStartSwaps[id] || id);
  // Deduplicate (swap target may already appear in custom extras)
  const exerciseIds = [...new Set(swappedIds)];
  const exercises = exerciseIds.map(exId => {
    const def = allExercises[exId] || EXERCISES[exId];
    if (!def) return null;
    const last = getLastLogged(prevSessions, exId);
    const numSets = last?.sets?.length || def.defaultSets;
    const sets = Array.from({ length: numSets }, (_, i) => {
      const ls = last?.sets?.[i] || last?.sets?.[0];
      const base = {
        weight: ls?.weight ?? '',
        reps: ls?.reps ?? (def.defaultReps || ''),
        duration: ls?.duration ?? (def.defaultDuration || ''),
        rpe: null, pain: null, done: false,
      };
      if (def.pullupTracking) {
        base.mode = ls?.mode ?? 'bw';
        base.band = ls?.band ?? '';
      }
      return base;
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
    phase: 'energy',
  };
}

function detectPRs(newSess, prevSessions, allExercises = EXERCISES) {
  const prs = [];
  newSess.exercises.forEach(ex => {
    const def = allExercises[ex.id] || EXERCISES[ex.id];
    if (!def || def.unit !== 'kg') return;
    const newMax = Math.max(...ex.sets.filter(s => s.done).map(s => Number(s.weight) || 0));
    if (!newMax) return;
    const prevMax = prevSessions.reduce((mx, sess) => {
      const pe = sess.exercises?.find(e => e.id === ex.id);
      if (!pe) return mx;
      return Math.max(mx, ...pe.sets.filter(s => s.done).map(s => Number(s.weight) || 0));
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
    if (!def.defaultReps || def.repMax <= def.defaultReps) return;
    const doneSets = ex.sets.filter(s => s.done);
    if (doneSets.length === 0) return;
    const allHitMax = doneSets.every(s => Number(s.reps) >= def.repMax);
    if (!allHitMax) return;
    if (doneSets.some(s => Number(s.pain) >= 3)) return;
    const rpeValues = doneSets.map(s => Number(s.rpe)).filter(v => !isNaN(v) && v > 0);
    if (rpeValues.length > 0) {
      const avgRpe = rpeValues.reduce((a, b) => a + b, 0) / rpeValues.length;
      if (avgRpe > 8) return;
    }
    nudges.push(def.name);
  });
  return nudges;
}

function weekStart() {
  const d = new Date(); d.setHours(0,0,0,0);
  d.setDate(d.getDate() - d.getDay());
  return d;
}

function weekMondayStart() {
  const d = new Date(); d.setHours(0,0,0,0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d;
}

function computeCoachRecommendation(sessions, rides, override = null) {
  const SWAP_MAP = {
    rdl:           { name: 'Hip Thrust',              id: 'hip_thrust' },
    kb_deadlift:   { name: 'Hip Thrust',              id: 'hip_thrust' },
    p_bb_row:      { name: 'Chest-Supported DB Row',  id: 'cs_db_row' },
    chin_up:       { name: 'Band Row',                id: 'band_row' },
    goblet_squat:  { name: 'Reverse Lunge',           id: 'reverse_lunge' },
  };
  const HINGE_IDS = new Set(['rdl', 'kb_deadlift']);

  const completed = [...sessions]
    .filter(s => s.completed)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const last = completed[completed.length - 1] || null;

  // Determine workout
  const workout = override || (last ? ({ A: 'B', B: 'C', C: 'A' }[last.workout] || 'A') : 'A');
  const wkt = WORKOUTS[workout];

  const reasons = [];
  const noteFragments = [];
  const flags = [];

  // Signal: days since last session
  if (last) {
    const daysSince = Math.floor((Date.now() - new Date(last.date)) / 86400000);
    if (daysSince >= 4) {
      noteFragments.push(`${daysSince} days since your last session.`);
      reasons.push(`Last session was ${daysSince} days ago — ease in, RPE 6 max for first two exercises.`);
    }
  }

  // Signal: average RPE last session
  if (last) {
    const doneSets = (last.exercises || []).flatMap(ex => (ex.sets || []).filter(s => s.done));
    const rpeVals = doneSets.map(s => Number(s.rpe)).filter(v => !isNaN(v) && v > 0);
    if (rpeVals.length > 0) {
      const avg = rpeVals.reduce((a, b) => a + b, 0) / rpeVals.length;
      if (avg >= 8) {
        noteFragments.push('High effort last session.');
        reasons.push(`Average RPE was ${avg.toFixed(1)} last session — train at RPE 6–7 today.`);
      }
    }
  }

  // Signal: ride within last 48 hours
  const now = Date.now();
  const recentRide = rides.some(r => (now - new Date(r.date).getTime()) < 48 * 3600000);
  if (recentRide) {
    reasons.push('Rode in the last 48 hours — keep hinge movements light.');
    wkt.exercises.forEach(exId => {
      if (!HINGE_IDS.has(exId)) return;
      if (flags.some(f => f.exerciseId === exId)) return;
      const def = EXERCISES[exId] || PRESET_LIBRARY[exId];
      const sw = SWAP_MAP[exId];
      flags.push({
        exerciseId: exId,
        exerciseName: def?.name || exId,
        modification: 'Rode recently — keep weight raised and light. Prioritise pull movements.',
        swap: sw?.name || null,
        swapId: sw?.id || null,
      });
    });
  }

  // Signal: pain >= 3 on any workout exercise last session
  if (last) {
    (last.exercises || []).forEach(ex => {
      if (!wkt.exercises.includes(ex.id)) return;
      if (flags.some(f => f.exerciseId === ex.id)) return;
      const hasPain = (ex.sets || []).some(s => Number(s.pain) >= 3);
      if (!hasPain) return;
      const def = EXERCISES[ex.id] || PRESET_LIBRARY[ex.id];
      const sw = SWAP_MAP[ex.id];
      flags.push({
        exerciseId: ex.id,
        exerciseName: def?.name || ex.id,
        modification: 'Pain logged last session — keep weight conservative, increase range only if pain-free.',
        swap: sw?.name || null,
        swapId: sw?.id || null,
      });
      reasons.push(`Pain ≥ 3 logged on ${def?.name || ex.id} last session.`);
    });
  }

  // Compose note
  let note;
  if (noteFragments.length === 0 && flags.length === 0) {
    note = 'Good recovery. Train at your planned intensity today.';
  } else if (noteFragments.length > 0 && flags.length > 0) {
    note = noteFragments.join(' ') + ' Some exercises flagged — see adjustments below.';
  } else if (noteFragments.length > 0) {
    note = noteFragments.join(' ') + ' Take it steady today.';
  } else {
    note = 'All signals normal. Some exercises flagged below — review before starting.';
  }

  if (reasons.length === 0) reasons.push('No flags from the last 7 days. Good to go.');

  return { workout, headline: wkt.title, note, reasons, flags };
}

// ═══════════════════════════════════════════════════════════════════════
// STYLE HELPERS
// ═══════════════════════════════════════════════════════════════════════
const st = {
  screen: { minHeight: '100vh', background: C.bg, color: C.text, fontFamily: C.fBody, paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px))' },
  card: bg => ({ background: bg || C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16 }),
  h1: { fontFamily: C.fDisplay, fontSize: 34, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', margin: 0, lineHeight: 1 },
  h2: { fontFamily: C.fDisplay, fontSize: 22, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', margin: 0 },
  label: { fontSize: 10, fontFamily: C.fMono, color: C.muted, textTransform: 'uppercase', letterSpacing: 1.5 },
  mono: (size = 14, color = C.text) => ({ fontFamily: C.fMono, fontSize: size, color }),
  inp: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, color: C.text, fontFamily: C.fMono, fontSize: 15, padding: '8px 0', width: '100%', boxSizing: 'border-box', textAlign: 'center', WebkitAppearance: 'none' },
  btn: (bg = C.amber, color = '#fff') => ({ background: bg, color, border: 'none', borderRadius: 10, padding: '12px 20px', fontFamily: C.fDisplay, fontSize: 14, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer', width: '100%' }),
  btnSm: (bg = C.amber, color = '#fff') => ({ background: bg, color, border: 'none', borderRadius: 4, padding: '8px 14px', fontFamily: C.fDisplay, fontSize: 13, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer' }),
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
    { id: 'dashboard', label: 'Home',   icon: 'home' },
    { id: 'workout',   label: 'Workout',  icon: 'dumbbell', dot: hasActive },
    { id: 'history',   label: 'Log',    icon: 'clipboard-list' },
    { id: 'progress',  label: 'Stats',  icon: 'bar-chart-2' },
    { id: 'rides',     label: 'Rides',  icon: 'bike' },
    { id: 'manage',    label: 'Manage', icon: 'grid-2x2' },
  ];
  return (
    <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: C.surface, borderTop: `1px solid ${C.border}`, display: 'flex', zIndex: 200, paddingBottom: 'env(safe-area-inset-bottom, 0px)', paddingLeft: 'env(safe-area-inset-left, 0px)', paddingRight: 'env(safe-area-inset-right, 0px)' }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => setView(t.id)} style={{
          flex: 1, background: 'none', border: 'none', padding: '10px 4px 12px',
          color: view === t.id ? C.amber : C.muted, cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, position: 'relative',
        }}>
          {view === t.id && <span style={{ position: 'absolute', top: 0, left: '25%', right: '25%', height: 2, background: C.amber, borderRadius: 2 }} />}
          <Icon name={t.icon} size={20} />
          <span style={{ fontSize: 9, fontFamily: C.fMono, letterSpacing: 0.8, textTransform: 'uppercase' }}>{t.label}</span>
          {t.dot && <span style={{ position: 'absolute', top: 6, right: '28%', width: 5, height: 5, borderRadius: 3, background: C.amber }} />}
        </button>
      ))}
    </nav>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// PRE-START SCREEN
// ═══════════════════════════════════════════════════════════════════════
function PreStartScreen({ selectedWorkout, coachRec, preStartSwaps, setPreStartSwaps, allExercises, sessions, workoutCustom, workoutHidden, setActiveSession, setView }) {
  const wkt = WORKOUTS[selectedWorkout];
  const extraIds = workoutCustom[selectedWorkout] || [];
  const hiddenIds = new Set((workoutHidden || {})[selectedWorkout] || []);
  const exerciseCount = [...wkt.exercises, ...extraIds].filter(id => !hiddenIds.has(id)).length;

  function handleStartSession() {
    const session = buildSession(selectedWorkout, sessions, allExercises, workoutCustom, workoutHidden, preStartSwaps);
    setActiveSession(session);
    setPreStartSwaps({});
    setView('workout');
  }

  function toggleSwap(flag) {
    setPreStartSwaps(prev => {
      if (prev[flag.exerciseId]) {
        const next = { ...prev };
        delete next[flag.exerciseId];
        return next;
      }
      return { ...prev, [flag.exerciseId]: flag.swapId };
    });
  }

  return (
    <div style={{ padding: '16px 16px 100px', minHeight: '100vh', background: C.bg }}>
      {/* Back */}
      <button onClick={() => setView('dashboard')} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 13, fontFamily: C.fMono, padding: 0, marginBottom: 20, display: 'block' }}>
        ← Back
      </button>

      {/* Workout badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
        <div style={{ fontSize: 52, fontFamily: C.fDisplay, fontWeight: 700, color: C.amber, lineHeight: 1, flexShrink: 0 }}>
          {selectedWorkout}
        </div>
        <div>
          <div style={{ fontFamily: C.fDisplay, fontSize: 20, textTransform: 'uppercase', fontWeight: 700, letterSpacing: 0.5 }}>{wkt.title}</div>
          <div style={{ fontSize: 12, color: C.muted, fontFamily: C.fMono, marginTop: 3 }}>{exerciseCount} exercises</div>
        </div>
      </div>

      {/* Flags or all-clear */}
      {coachRec.flags.length === 0 ? (
        <div style={{ ...st.card(), borderLeft: `3px solid ${C.green}`, marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 18 }}>✓</span>
            <div>
              <div style={{ fontFamily: C.fDisplay, fontSize: 14, textTransform: 'uppercase', color: C.green, letterSpacing: 1, marginBottom: 4 }}>All clear</div>
              <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.5 }}>Good recovery since last session. No modifications needed.</div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ marginBottom: 20 }}>
          <div style={{ ...st.label, marginBottom: 10 }}>Today's adjustments</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {coachRec.flags.map(flag => {
              const isSwapped = !!preStartSwaps[flag.exerciseId];
              const swapDef = isSwapped ? (allExercises[flag.swapId] || EXERCISES[flag.swapId]) : null;
              return (
                <div key={flag.exerciseId} style={{ ...st.card(), borderLeft: `3px solid ${isSwapped ? C.blue : C.amber}` }}>
                  <div style={{ fontSize: 14, fontWeight: 700, fontFamily: C.fDisplay, textTransform: 'uppercase', marginBottom: 8 }}>
                    {flag.exerciseName}
                  </div>
                  {isSwapped ? (
                    <div>
                      <div style={{ fontSize: 13, color: C.blue, marginBottom: 8 }}>⇄ Swapped → {swapDef?.name || flag.swap}</div>
                      <button onClick={() => toggleSwap(flag)} style={{ ...st.btnSm(C.dim, C.muted), fontSize: 11 }}>↩ Undo swap</button>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: 12, color: C.amber, lineHeight: 1.5, marginBottom: flag.swapId ? 10 : 0 }}>
                        ⚠️ {flag.modification}
                      </div>
                      {flag.swapId && (
                        <button onClick={() => toggleSwap(flag)} style={{ ...st.btnSm(C.dim, C.muted), fontSize: 12 }}>
                          ⇄ Swap it out → {flag.swap}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Start button */}
      <button style={{ ...st.btn(), display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }} onClick={handleStartSession}>
        <Icon name="play" size={16} /> Start Session
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════════════
function Dashboard({ sessions, rides, setView, activeSession, selectedWorkout, setSelectedWorkout, allExercises = EXERCISES, workoutCustom = {}, workoutHidden = {}, driveSync, onCloudSync, updateAvailable, onWarmupOpen, onDemoOpen, coachRec, showWhy, setShowWhy }) {
  const [showExercises, setShowExercises] = useState(false);
  const [showWarmup, setShowWarmup] = useState(false);
  const [showCooldown, setShowCooldown] = useState(false);
  const suggested = nextWorkout(sessions);
  const wkt = WORKOUTS[selectedWorkout];
  const extraIds = workoutCustom[selectedWorkout] || [];
  const hiddenIds = new Set((workoutHidden || {})[selectedWorkout] || []);
  const allWorkoutExIds = [...wkt.exercises, ...extraIds].filter(id => !hiddenIds.has(id));
  const ws = weekStart();
  const weekSessions = sessions.filter(s => new Date(s.date) >= ws);
  const weekRides = rides.filter(r => new Date(r.date) >= ws);
  // Week strip: Mon–Sun cells
  const mondayStart = weekMondayStart();
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(mondayStart);
    d.setDate(mondayStart.getDate() + i);
    const dateStr = d.toISOString().slice(0, 10);
    const sess = sessions.find(s => s.completed && s.date?.slice(0, 10) === dateStr);
    const ride = rides.find(r => r.date?.slice(0, 10) === dateStr);
    const isToday = dateStr === new Date().toISOString().slice(0, 10);
    return { d, dateStr, sess, ride, isToday, dayLetter: ['M','T','W','T','F','S','S'][i] };
  });
  const recent = [...sessions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4);
  const lastSyncTime = driveSync?.lastCloudSync
    ? new Date(driveSync.lastCloudSync).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })
    : 'not yet';
  const cloudLabel = driveSync?.cloudStatus === 'syncing'
    ? 'Supabase syncing...'
    : driveSync?.cloudStatus === 'error'
      ? 'Supabase sync failed'
      : `Supabase auto-sync on · Last synced ${lastSyncTime}`;

  return (
    <div style={{ padding: '20px 16px 8px' }}>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div style={{ ...st.label, marginBottom: 6 }}>Training Log</div>
          <div style={{ ...st.h1 }}>IRON<span style={{ color: C.amber }}>LOG</span></div>
        </div>
        <button
          onClick={() => window.location.reload(true)}
          title={updateAvailable ? 'Update available — tap to reload' : 'Check for updates'}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0 4px 12px',
            color: updateAvailable ? C.amber : C.muted, fontSize: 20, lineHeight: 1,
            animation: updateAvailable ? 'pulse 1.5s ease-in-out infinite' : 'none',
          }}
        >↺</button>
        {updateAvailable && <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>}
      </div>

      {/* Selected workout hero */}
      <div style={{ ...st.card(), marginBottom: 12, borderColor: C.border }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <div style={{ ...st.label }}>Selected workout</div>
          {!activeSession && (
            <div style={{ display: 'flex', gap: 5 }}>
              {['A', 'B', 'C'].map(key => {
                const active = selectedWorkout === key;
                return (
                  <button key={key} onClick={() => { setSelectedWorkout(key); setShowExercises(false); }} style={{
                    background: active ? C.amber : C.dim,
                    color: active ? '#fff' : C.muted,
                    border: 'none',
                    borderRadius: 8,
                    padding: '6px 14px',
                    fontFamily: C.fDisplay,
                    fontSize: 16,
                    fontWeight: 700,
                    lineHeight: 1,
                    cursor: 'pointer',
                  }}>{key}</button>
                );
              })}
            </div>
          )}
        </div>

        {/* Compact summary row — always visible */}
        <button onClick={() => setShowExercises(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, width: '100%', textAlign: 'left', marginBottom: showExercises ? 0 : 14 }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{ fontSize: 56, fontFamily: C.fDisplay, fontWeight: 700, color: C.amber, lineHeight: 1, flexShrink: 0 }}>
              {selectedWorkout}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 20, fontWeight: 700, fontFamily: C.fDisplay, textTransform: 'uppercase', letterSpacing: 0.5, lineHeight: 1.1 }}>
                {wkt.title}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5 }}>
                {(selectedWorkout === suggested || activeSession) && (
                  <span style={{ background: C.amberDim, color: C.amber, fontSize: 10, borderRadius: 4, padding: '2px 6px', fontFamily: C.fMono, textTransform: 'uppercase' }}>
                    {activeSession ? 'active' : 'next'}
                  </span>
                )}
                <span style={{ fontSize: 12, color: C.muted, fontFamily: C.fMono }}>
                  {activeSession ? 'Session in progress' : `${allWorkoutExIds.length} exercises`}
                </span>
              </div>
            </div>
            <span style={{ color: C.muted, fontSize: 13, flexShrink: 0, paddingRight: 2 }}>{showExercises ? '▲' : '▼'}</span>
          </div>
        </button>

        {/* Expanded: exercise list + warmup + cooldown */}
        {showExercises && (
          <div style={{ marginTop: 14 }}>
            <div style={{ marginBottom: 8 }}>
              {allWorkoutExIds.map(id => {
                const ex = allExercises[id] || EXERCISES[id];
                const isExtra = extraIds.includes(id);
                return (
                  <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: `1px solid ${C.border}` }}>
                    <div onClick={() => onDemoOpen && onDemoOpen(id)} style={{ cursor: 'pointer', flexShrink: 0 }}>
                      <ExerciseIcon id={id} size={36} />
                    </div>
                    <span style={{ flex: 1, minWidth: 0, fontSize: 15, color: C.text }}>{ex?.name || id}</span>
                    <span style={{ border: `1px solid ${C.border}`, borderRadius: 20, padding: '2px 9px', fontSize: 11, color: isExtra ? C.amber : C.muted, fontFamily: C.fMono, whiteSpace: 'nowrap' }}>
                      {isExtra ? '+ Added' : ex?.primaryMuscle || ex?.muscle}
                    </span>
                  </div>
                );
              })}
            </div>
            <div style={{ borderTop: '1px solid ' + C.border, paddingTop: 10, marginBottom: 10 }}>
              <button onClick={() => setShowWarmup(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                <span style={{ ...st.label, fontSize: 10, color: C.muted }}>Warm-Up Routine</span>
                <span style={{ color: C.muted, fontSize: 11, marginLeft: 'auto' }}>{showWarmup ? '▲' : '▼'}</span>
              </button>
              {showWarmup && (
                <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {WARMUP.map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, fontSize: 12, color: C.muted, lineHeight: 1.4, alignItems: 'center' }}>
                      <img src={`assets/icons/warmup/${item.id}.png`} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'contain', background: '#EEF3FF', marginRight: 12, flexShrink: 0, cursor: 'pointer' }} onError={e => { e.target.style.display = 'none'; }} onClick={() => onWarmupOpen && onWarmupOpen(item)} />
                      <span style={{ color: C.amber, fontFamily: C.fMono, minWidth: 16 }}>{i + 1}</span>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ borderTop: '1px solid ' + C.border, paddingTop: 10, marginBottom: 14 }}>
              <button onClick={() => setShowCooldown(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                <span style={{ ...st.label, fontSize: 10, color: C.muted }}>Cool-Down / Finisher</span>
                <span style={{ color: C.muted, fontSize: 11, marginLeft: 'auto' }}>{showCooldown ? '▲' : '▼'}</span>
              </button>
              {showCooldown && (
                <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {wkt.finisher.map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, fontSize: 12, color: C.muted, lineHeight: 1.4, alignItems: 'center' }}>
                      <img src={`assets/icons/warmup/${item.id}.png`} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'contain', background: '#EEF3FF', marginRight: 12, flexShrink: 0, cursor: 'pointer' }} onError={e => { e.target.style.display = 'none'; }} onClick={() => onWarmupOpen && onWarmupOpen(item)} />
                      <span style={{ color: C.green, fontFamily: C.fMono, minWidth: 16 }}>{i + 1}</span>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Flag pills */}
        {!activeSession && coachRec?.flags?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
            {coachRec.flags.map(flag => (
              <span key={flag.exerciseId} style={{ background: C.amber + '18', color: C.amber, border: `1px solid ${C.amber}44`, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontFamily: C.fMono }}>
                ⚠ {flag.exerciseName}
              </span>
            ))}
          </div>
        )}

        {/* Coach note panel */}
        {!activeSession && coachRec && (
          <div style={{ background: '#F0F4FF', borderRadius: 8, padding: '12px 14px', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: showWhy ? 8 : 0 }}>
              <span style={{ fontSize: 15, flexShrink: 0 }}>🤖</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: '#2a3f6f', lineHeight: 1.5 }}>{coachRec.note}</div>
                <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
                  <button onClick={() => setShowWhy(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 12, color: '#4A82E8', fontFamily: C.fMono }}>
                    {showWhy ? '✕ Hide' : 'Why? ›'}
                  </button>
                  {coachRec.flags.length > 0 && (
                    <button onClick={() => setView('preStart')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 12, color: C.amber, fontFamily: C.fMono }}>
                      Safe swaps ›
                    </button>
                  )}
                </div>
              </div>
            </div>
            {showWhy && (
              <div style={{ borderTop: '1px solid #d0daff', paddingTop: 10, marginTop: 2 }}>
                {coachRec.reasons.map((r, i) => (
                  <div key={i} style={{ fontSize: 12, color: '#4a5a7a', lineHeight: 1.5, marginBottom: 4, paddingLeft: 8 }}>• {r}</div>
                ))}
              </div>
            )}
          </div>
        )}

        <button style={{ ...st.btn(), display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}
          onClick={() => activeSession ? setView('workout') : setView('preStart')}>
          <Icon name="play" size={16} /> {activeSession ? 'Resume Workout' : `Start Workout ${selectedWorkout}`}
        </button>
      </div>

      {/* 7-day week strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 12 }}>
        {weekDays.map(({ dayLetter, sess, ride, isToday, dateStr }) => (
          <div key={dateStr} style={{
            ...st.card(),
            padding: '8px 4px',
            textAlign: 'center',
            borderColor: isToday ? C.amber : C.border,
            background: isToday ? C.amberDim : C.card,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
          }}>
            <div style={{ ...st.label, fontSize: 9 }}>{dayLetter}</div>
            {sess ? (
              <div style={{ fontSize: 11, fontFamily: C.fDisplay, color: C.amber, lineHeight: 1 }}>{sess.workout}✓</div>
            ) : ride ? (
              <div style={{ fontSize: 12, lineHeight: 1 }}>🚴</div>
            ) : (
              <div style={{ fontSize: 11, color: C.muted, lineHeight: 1 }}>–</div>
            )}
          </div>
        ))}
      </div>

      {/* Stretch Routine Card */}
      <div style={{ ...st.card(), marginBottom: 16, padding: '14px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 10, fontFamily: C.fMono, color: C.amber, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Stretch Routine</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 2 }}>Full-Body Flexibility</div>
            <div style={{ fontSize: 12, color: C.muted }}>
              {(() => {
                const cfg = getStretchConfig();
                const totalSecs = cfg.reduce((sum, id) => {
                  const s = STRETCH_LIBRARY.find(x => x.id === id);
                  if (!s) return sum;
                  return sum + (s.bilateral ? s.suggestedSecs * 2 : s.suggestedSecs);
                }, 0);
                const mins = Math.round(totalSecs / 60);
                return `12 stretches · ≈${mins} min`;
              })()}
            </div>
          </div>
        </div>
        <button
          onClick={() => setView('stretch_setup')}
          style={{ ...st.btn(), marginTop: 12, width: '100%' }}
        >
          ▶ Start Stretching
        </button>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
        {[
          { label: 'Total sessions', value: sessions.length, icon: 'dumbbell' },
          { label: 'Sessions this week', value: weekSessions.length + '/3', icon: 'calendar' },
          { label: 'Rides this week', value: weekRides.length, icon: 'bike' },
        ].map((s, i) => (
          <div key={i} style={{ ...st.card(), textAlign: 'center', padding: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <Icon name={s.icon} size={22} color={C.amber} />
            <div style={{ fontFamily: C.fMono, fontSize: 22, color: C.amber, lineHeight: 1 }}>{s.value}</div>
            <div style={{ ...st.label, fontSize: 9, marginTop: 5, lineHeight: 1.4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Cloud sync status */}
      {driveSync && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px',
          background: C.surface, borderRadius: 10, border: `1px solid ${C.border}`, marginBottom: 16,
        }}>
          <Icon name={driveSync.cloudStatus === 'error' ? 'alert-circle' : 'check-circle'} size={16} color={driveSync.cloudStatus === 'error' ? C.red : C.green} />
          <span style={{ flex: 1, fontSize: 13, color: C.muted, minWidth: 0 }}>
            {cloudLabel}
          </span>
          <button onClick={onCloudSync} style={{ ...st.btnSm(C.dim, C.muted), padding: '4px 10px', fontSize: 11, flexShrink: 0 }}>
            Sync now
          </button>
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
                  {sess.energy && <div style={{ fontSize: 16 }}>{['😴','😕','😐','💪','🔥'][sess.energy - 1]}</div>}
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
  const isPullup = !!def.pullupTracking;
  const pullupMode = set.mode || 'bw'; // 'bw' | 'band' | 'neg'

  const gridCols = isTimed
    ? '28px minmax(52px,1fr) 56px 56px 38px'
    : (isBW && !isPullup)
      ? '28px minmax(48px,.8fr) minmax(48px,1fr) 56px 56px 38px'
      : isPullup && pullupMode === 'band'
        ? '28px minmax(0,1.2fr) minmax(48px,.8fr) 56px 56px 38px'
        : isPullup && pullupMode === 'neg'
          ? '28px minmax(48px,.8fr) minmax(48px,.8fr) 56px 56px 38px'
          : isPullup
            ? '28px minmax(48px,.8fr) minmax(48px,1fr) 56px 56px 38px'
            : '28px minmax(0,1fr) minmax(0,1fr) 56px 56px 38px';
  const loadLabel = def.unit === 'band' ? 'BAND' : 'BW';

  return (
    <div style={{ background: done ? C.green + '12' : C.dim, border: `1px solid ${done ? C.green + '44' : C.border}`, borderRadius: 6, padding: '8px 10px' }}>

      {/* Pullup mode toggle */}
      {isPullup && (
        <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
          {[['bw', 'Unassisted'], ['band', 'Band'], ['neg', 'Negatives']].map(([m, label]) => (
            <button key={m} onClick={() => !done && onUpdate('mode', m)} style={{
              flex: 1, padding: '4px 0', fontSize: 10, fontFamily: C.fMono,
              background: pullupMode === m ? C.amber : C.bg,
              color: pullupMode === m ? '#0a0f28' : C.muted,
              border: `1px solid ${pullupMode === m ? C.amber : C.border}`,
              borderRadius: 4, cursor: done ? 'default' : 'pointer', letterSpacing: 0.5,
            }}>{label}</button>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: 5, alignItems: 'center' }}>
        <div style={{ fontFamily: C.fMono, fontSize: 13, color: done ? C.green : C.muted, textAlign: 'center', fontWeight: 600 }}>
          {done ? '✓' : num}
        </div>

        {isTimed ? (
          <input type="number" inputMode="numeric" value={set.duration} onChange={e => onUpdate('duration', e.target.value)}
            style={{ ...st.inp }} placeholder="sec" />
        ) : isPullup && pullupMode === 'band' ? (
          <input type="text" value={set.band || ''} onChange={e => onUpdate('band', e.target.value)}
            style={{ ...st.inp, fontSize: 11 }} placeholder="band" />
        ) : isPullup && pullupMode === 'neg' ? (
          <input type="number" inputMode="numeric" value={set.duration || ''} onChange={e => onUpdate('duration', e.target.value)}
            style={{ ...st.inp }} placeholder="sec" />
        ) : isBW ? (
          <div style={{ ...st.inp, color: C.muted, fontSize: 10, lineHeight: '34px', border: `1px solid ${C.border}` }}>{loadLabel}</div>
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
      {(isTimed || isBW) && !isPullup && (
        <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: 5, marginTop: 3 }}>
          <div/><div style={{ ...st.label, fontSize: 9, textAlign: 'center' }}>{isTimed ? 'secs' : loadLabel.toLowerCase()}</div>
          {isBW && <div style={{ ...st.label, fontSize: 9, textAlign: 'center' }}>reps</div>}
          <div style={{ ...st.label, fontSize: 9, textAlign: 'center' }}>rpe</div>
          <div style={{ ...st.label, fontSize: 9, textAlign: 'center' }}>pain</div>
          <div/>
        </div>
      )}
      {isPullup && (
        <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: 5, marginTop: 3 }}>
          <div/>
          <div style={{ ...st.label, fontSize: 9, textAlign: 'center' }}>
            {pullupMode === 'band' ? 'band' : pullupMode === 'neg' ? 'sec/rep' : 'bw'}
          </div>
          <div style={{ ...st.label, fontSize: 9, textAlign: 'center' }}>reps</div>
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
// WARMUP SETUP COMPONENTS
// ═══════════════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════════════
// WARMUP ACTIVE — Screen 3: guided execution, one stretch at a time
// ═══════════════════════════════════════════════════════════════════════

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

  const [index, setIndex]           = useState(0);
  const [timeLeft, setTimeLeft]     = useState(null);
  const [side, setSide]             = useState(1);       // 1 = first side, 2 = second side
  const [showSwitch, setShowSwitch] = useState(false);   // bilateral side-switch message
  const [running, setRunning]       = useState(false);   // timer only ticks when true

  const current = stretches[index] || null;

  // Reset to paused state whenever the stretch index changes
  useEffect(() => {
    if (!current) { onComplete(); return; }
    setTimeLeft(current.suggestedSecs);
    setSide(1);
    setShowSwitch(false);
    setRunning(false);   // always start paused — user must press Start
  }, [index]); // eslint-disable-line react-hooks/exhaustive-deps

  // Tick down every second — only when running
  useEffect(() => {
    if (!running || timeLeft === null || timeLeft <= 0) return;
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, running]);

  // Refs to avoid stale closures in the at-zero handler
  const currentRef   = useRef(current);
  const sideRef      = useRef(side);
  const indexRef     = useRef(index);
  const stretchesRef = useRef(stretches);
  useEffect(() => { currentRef.current   = current;   }, [current]);
  useEffect(() => { sideRef.current      = side;      }, [side]);
  useEffect(() => { indexRef.current     = index;     }, [index]);
  useEffect(() => { stretchesRef.current = stretches; }, [stretches]);

  // Handle timer reaching zero — only fires when actively running
  useEffect(() => {
    if (!running || timeLeft !== 0) return;
    const s = currentRef.current;
    if (!s) { onComplete(); return; }

    if (s.bilateral && sideRef.current === 1) {
      // Side 1 done — signal Switch Sides; separate useEffect handles the 1.5s auto-start
      setShowSwitch(true);
      setRunning(false);
      return;
    }

    // Both sides (or unilateral) done — brief pause then advance to next stretch (paused)
    const id = setTimeout(() => {
      const nextIndex = indexRef.current + 1;
      if (nextIndex < stretchesRef.current.length) {
        setIndex(nextIndex);   // index useEffect will reset running=false
      } else {
        onComplete();
      }
    }, 500);
    return () => clearTimeout(id);
  }, [timeLeft, running]); // eslint-disable-line react-hooks/exhaustive-deps

  // Switch Sides: auto-start side 2 after 1.5s — isolated so setRunning(false) can't cancel it
  useEffect(() => {
    if (!showSwitch) return;
    const s = currentRef.current;
    if (!s) return;
    const switchId = setTimeout(() => {
      setShowSwitch(false);
      setSide(2);
      setTimeLeft(s.suggestedSecs);
      setRunning(true);
    }, 1500);
    return () => clearTimeout(switchId);
  }, [showSwitch]); // eslint-disable-line react-hooks/exhaustive-deps

  function advance() {
    const nextIndex = index + 1;
    if (nextIndex < stretches.length) {
      setIndex(nextIndex);
    } else {
      onComplete();
    }
  }

  function startTimer() {
    setShowSwitch(false);
    setRunning(true);
  }

  if (!current) return null;

  const totalSecs = current.suggestedSecs;
  const circumference = 326.7; // 2π × 52 (radius of SVG ring at 120×120)
  const elapsed = totalSecs - (timeLeft ?? totalSecs);
  // arcOffset=0 → full ring visible (start); arcOffset=circumference → ring empty (end)
  const arcOffset = circumference * (elapsed / totalSecs);

  const isLast = index === stretches.length - 1;
  const nextGroupLabel = !isLast ? WARMUP_GROUPS[index + 1]?.label : null;

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, display: 'flex', flexDirection: 'column', paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px))' }}>

      {/* Progress dots */}
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: '16px 24px 8px', gap: 2 }}>
        <StretchThumb stretch={current} group={WARMUP_GROUPS[index]} size={90} />

        <div style={{ ...st.label, marginTop: 10 }}>{WARMUP_GROUPS[index]?.label}</div>
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

        {/* Cue or switch-sides message */}
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

      {/* Footer — Start when paused, Next when running, Skip-only during side-switch */}
      <div style={{ padding: '12px 16px 24px', borderTop: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {running ? (
          <>
            <button style={st.btn()} onClick={advance}>
              {isLast ? '→ Begin Workout' : `→ Next: ${nextGroupLabel}`}
            </button>
            <button style={st.ghost} onClick={advance}>
              Skip this stretch
            </button>
          </>
        ) : showSwitch ? (
          // Side-switch window — auto-start incoming, just offer escape
          <button style={st.ghost} onClick={advance}>
            {isLast ? 'Skip → Begin Workout' : `Skip → ${nextGroupLabel || 'next'}`}
          </button>
        ) : (
          <>
            <button style={st.btn()} onClick={startTimer}>
              ▶ Start
            </button>
            <button style={st.ghost} onClick={advance}>
              {isLast ? 'Skip → Begin Workout' : `Skip → ${nextGroupLabel || 'next'}`}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

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

// ═══════════════════════════════════════════════════════════════════════
// STRETCH ROUTINE — Screen 3: guided execution with countdown timer
// ═══════════════════════════════════════════════════════════════════════
// onDone() — called when all stretches complete or user taps Skip all
function StretchActive({ onDone }) {
  // Build stretch list once on mount from saved config
  const stretchesRef = useRef(null);
  const stretchesListRef = useRef([]);
  if (!stretchesRef.current) {
    stretchesRef.current = STRETCH_GROUPS.map((group, i) => {
      const id = getStretchConfig()[i];
      return STRETCH_LIBRARY.find(s => s.id === id)
          || STRETCH_LIBRARY.find(s => s.id === group.defaultId);
    }).filter(Boolean);
    stretchesListRef.current = stretchesRef.current;
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
      // Side 1 done — signal Switch Sides; separate useEffect handles the 1.5s auto-start
      setShowSwitch(true);
      setRunning(false);
      return;
    }

    // Unilateral or side 2 done — 0.5s pause then advance (paused)
    const id = setTimeout(() => {
      const next = indexRef.current + 1;
      if (next < stretchesListRef.current.length) {
        setIndex(next);
      } else {
        onDone();
      }
    }, 500);
    return () => clearTimeout(id);
  }, [timeLeft, running]); // eslint-disable-line react-hooks/exhaustive-deps

  // Switch Sides: auto-start side 2 after 1.5s — isolated so setRunning(false) can't cancel it
  useEffect(() => {
    if (!showSwitch) return;
    const s = currentRef.current;
    if (!s) return;
    const switchId = setTimeout(() => {
      setShowSwitch(false);
      setSide(2);
      setTimeLeft(s.suggestedSecs);
      setRunning(true);
    }, 1500);
    return () => clearTimeout(switchId);
  }, [showSwitch]); // eslint-disable-line react-hooks/exhaustive-deps

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
  const circumference = 326.7; // 2π × 52
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

// ═══════════════════════════════════════════════════════════════════════
// ACTIVE WORKOUT
// ═══════════════════════════════════════════════════════════════════════
function ActiveWorkout({ sessions, activeSession, setActiveSession, onComplete, setView, selectedWorkout, allExercises = EXERCISES, workoutCustom = {}, workoutHidden = {}, onDemoOpen, onWarmupOpen, coachRec }) {
  const nextWkt = selectedWorkout;
  const [session, setSession] = useState(activeSession || null);
  const [phase, setPhase] = useState(() => {
    const p = activeSession?.phase || (activeSession ? 'workout' : 'energy');
    // Backward compat: sessions stored before this feature used phase:'warmup'
    return p === 'warmup' ? 'warmup_setup' : p;
  });
  const [exIdx, setExIdx] = useState(() => {
    if (!activeSession?.exercises) return 0;
    const firstIncomplete = activeSession.exercises.findIndex(
      ex => ex.sets && ex.sets.some(s => !s.done)
    );
    return firstIncomplete >= 0 ? firstIncomplete : 0;
  });
  const [restSecs, setRestSecs] = useState(30);
  const [restActive, setRestActive] = useState(false);
  const [elapsed, setElapsed] = useState(
    session?.startTime ? Math.floor((Date.now() - session.startTime) / 1000) : 0
  );
  const [prs, setPRs] = useState([]);
  const [nudges, setNudges] = useState([]);
  const [showAddEx, setShowAddEx] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [showDiagram, setShowDiagram] = useState(false);
  const [pickerSlot, setPickerSlot] = useState(null); // null = no picker; 0–7 = slot being edited

  const elapsedRef = useRef(null);
  const restRef = useRef(null);

  useEffect(() => {
    const origin = session?.startTime || Date.now();
    elapsedRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - origin) / 1000));
    }, 1000);
    return () => clearInterval(elapsedRef.current);
  }, []);

  useEffect(() => {
    if (!restActive) { clearTimeout(restRef.current); return; }
    if (restSecs <= 0) { setRestActive(false); return; }
    restRef.current = setTimeout(() => setRestSecs(s => s - 1), 1000);
    return () => clearTimeout(restRef.current);
  }, [restActive, restSecs]);

  useEffect(() => { setShowDiagram(false); }, [exIdx]);

  function startRest(s = 30) { setRestSecs(s); setRestActive(true); }
  function stopRest() { setRestActive(false); setRestSecs(30); }

  function startSession(energy) {
    // If activeSession was pre-built by the pre-start screen (has exercises), preserve it.
    // Only add the energy level and advance to warmup — do not rebuild.
    const base = (activeSession?.exercises?.length > 0)
      ? activeSession
      : buildSession(nextWkt, sessions, allExercises, workoutCustom, workoutHidden);
    const s = { ...base, energy, phase: 'warmup_setup' };
    setSession(s);
    setActiveSession(s);
    setPhase('warmup_setup');
  }

  function cancelSession() {
    setActiveSession(null);
    setConfirmCancel(false);
    setView('dashboard');
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
    startRest(30);
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

  if (session && (!Array.isArray(session.exercises) || session.exercises.length === 0)) {
    return (
      <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16 }}>
        <div style={{ fontFamily: C.fDisplay, fontSize: 18, color: C.amber, letterSpacing: 1, textAlign: 'center' }}>SESSION DATA CORRUPTED</div>
        <div style={{ fontFamily: C.fMono, fontSize: 13, color: C.muted, textAlign: 'center' }}>The active session could not be loaded. Your completed sessions are safe.</div>
        <button style={st.btn(C.red || '#e05c5c')} onClick={() => { setActiveSession(null); setSession(null); setPhase('energy'); }}>
          Clear Session &amp; Start Fresh
        </button>
      </div>
    );
  }

  // ── Energy ──────────────────────────────────────────────────────────
  if (phase === 'energy') {
    return (
      <div style={{ padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
          <button onClick={() => setView('dashboard')} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 13, fontFamily: C.fMono, padding: 0 }}>back to Home</button>
        </div>
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
          setPickerSlot(null); // force re-render — WarmupSetup re-reads config on each render
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

  // ── Workout ──────────────────────────────────────────────────────────
  if (phase === 'workout' && session) {
    const exId = session.exercises[exIdx]?.id;
    const def = allExercises[exId] || EXERCISES[exId] || {};
    const exData = session.exercises[exIdx];
    if (!exData) {
      return (
        <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16 }}>
          <div style={{ fontFamily: C.fDisplay, fontSize: 18, color: C.amber, letterSpacing: 1, textAlign: 'center' }}>EXERCISE NOT FOUND</div>
          <div style={{ fontFamily: C.fMono, fontSize: 13, color: C.muted, textAlign: 'center' }}>Could not load exercise data. Try going back to the first exercise.</div>
          <button style={st.btn()} onClick={() => setExIdx(0)}>Go to First Exercise</button>
          <button style={st.ghost} onClick={() => { setActiveSession(null); setSession(null); setPhase('energy'); }}>Cancel Session</button>
        </div>
      );
    }

    const primaryMuscle = def.primaryMuscle || def.muscle;
    const secondaryMuscle = def.secondaryMuscle;
    const doneSetsCount = exData.sets.filter(s => s.done).length;
    const allExDone = exData.sets.every(s => s.done);
    const sessionExIds = new Set(session.exercises.map(e => e.id));
    const availableToAdd = Object.entries(allExercises).filter(([id, def]) => !sessionExIds.has(id) && !def.gymOnly);

    return (
      <div style={{ padding: 16 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ ...st.label, marginBottom: 3 }}>
              {session.workout} · {exIdx + 1} / {session.exercises.length} · {doneSetsCount}/{exData.sets.length} sets
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <ExerciseIcon id={exId} size={44} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: C.fDisplay, fontSize: 22, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, lineHeight: 1.2, color: C.text }}>{def.name}</div>
                <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                  {primaryMuscle && (
                    <span style={{ background: C.amberDim, color: C.amber, fontSize: 10, borderRadius: 20, padding: '2px 8px', fontFamily: C.fMono }}>
                      {primaryMuscle}
                    </span>
                  )}
                  {secondaryMuscle && (
                    <span style={{ background: C.dim, color: C.muted, fontSize: 10, borderRadius: 20, padding: '2px 8px', fontFamily: C.fMono }}>
                      {secondaryMuscle}
                    </span>
                  )}
                </div>
              </div>
            </div>
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
            <button onClick={() => setConfirmCancel(true)} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 10, fontFamily: C.fMono, marginTop: 6, padding: 0, textDecoration: 'underline', display: 'block' }}>Cancel</button>
          </div>
        </div>

        {/* Tags + cue */}
        <div style={{ ...st.row, flexWrap: 'wrap', marginBottom: 8, gap: 4 }}>
          {def.perSide && <span style={st.pill(C.blue)}>Per side</span>}
          {def.repMax && <span style={st.pill(C.purple)}>{def.repMax === def.defaultReps ? `${def.defaultReps} reps` : `${def.defaultReps}–${def.repMax} reps`}</span>}
        </div>
        <div style={{ ...st.card(), padding: '10px 12px', borderLeft: `2px solid ${C.amber}`, marginBottom: 14, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
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
          <div onClick={() => onDemoOpen && onDemoOpen(exId)} style={{ cursor: 'pointer', flexShrink: 0 }}>
            <ExerciseIcon id={exId} size={96} />
          </div>
        </div>

        {/* Muscle diagram (collapsible) */}
        <div style={{ marginBottom: 14 }}>
          <button
            onClick={() => setShowDiagram(v => !v)}
            style={{ background: 'none', border: 'none', padding: '4px 0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}
          >
            <span style={{ ...st.label, fontSize: 9 }}>MUSCLES</span>
            {!showDiagram && primaryMuscle && (
              <span style={{ fontFamily: C.fMono, fontSize: 11, color: C.muted }}>{primaryMuscle}</span>
            )}
            <span style={{ fontFamily: C.fMono, fontSize: 11, color: C.muted, marginLeft: 'auto' }}>
              {showDiagram ? '▲ Hide' : '▼ Show'}
            </span>
          </button>
          {showDiagram && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
              <MuscleDiagram
                primary={def.primary || []}
                secondary={def.secondary || []}
                size="medium"
              />
            </div>
          )}
        </div>

        {/* Pull-up progress card */}
        {def.pullupTracking && (() => {
          const allSets = sessions.flatMap(s => (s.exercises || []).find(e => e.id === exId)?.sets || []);
          const unassistedSets = allSets.filter(s => s.done && (!s.mode || s.mode === 'bw') && Number(s.reps) > 0);
          const bestReps = unassistedSets.length > 0 ? Math.max(...unassistedSets.map(s => Number(s.reps))) : 0;
          const totalSessions = sessions.filter(s => (s.exercises || []).some(e => e.id === exId)).length;
          return (
            <div style={{ ...st.card(), padding: '10px 14px', borderLeft: `2px solid ${C.blue}`, marginBottom: 14 }}>
              <div style={{ ...st.label, fontSize: 9, color: C.blue, marginBottom: 6 }}>PULL-UP PROGRESS</div>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: C.fMono, fontSize: 22, color: bestReps > 0 ? C.green : C.muted, lineHeight: 1 }}>{bestReps}</div>
                  <div style={{ ...st.label, fontSize: 9, marginTop: 2 }}>best unassisted</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: C.fMono, fontSize: 22, color: C.muted, lineHeight: 1 }}>{totalSessions}</div>
                  <div style={{ ...st.label, fontSize: 9, marginTop: 2 }}>sessions logged</div>
                </div>
                <div style={{ flex: 1, fontSize: 11, color: C.muted, lineHeight: 1.4 }}>
                  {bestReps === 0
                    ? 'No unassisted reps yet — band assist or negatives to build strength.'
                    : bestReps < 3
                    ? 'Getting there — keep adding reps before dropping the band.'
                    : bestReps < 6
                    ? 'Good base — try adding one more rep each session.'
                    : '💪 Strong — work toward sets of 8+ unassisted.'}
                </div>
              </div>
            </div>
          );
        })()}

        {/* Caution banner */}
        {def.caution && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: C.amber + '18', border: `1px solid ${C.amber}66`, borderRadius: 10, padding: '10px 14px', marginBottom: 14 }}>
            <span style={{ fontSize: 16, lineHeight: 1.4, flexShrink: 0 }}>⚠️</span>
            <div style={{ fontSize: 12, color: C.amber, lineHeight: 1.5, fontFamily: C.fMono }}>{def.caution}</div>
          </div>
        )}
        {/* Coach modification note (ephemeral — from coachRec props, not stored in session) */}
        {coachRec?.flags?.find(f => f.exerciseId === exId)?.modification && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: C.amber + '18', border: `1px solid ${C.amber}66`, borderRadius: 10, padding: '10px 14px', marginBottom: 14 }}>
            <span style={{ fontSize: 16, lineHeight: 1.4, flexShrink: 0 }}>🤖</span>
            <div style={{ fontSize: 12, color: C.amber, lineHeight: 1.5, fontFamily: C.fMono }}>
              Coach: {coachRec.flags.find(f => f.exerciseId === exId).modification}
            </div>
          </div>
        )}

        {/* Previous session notes reminder */}
        {(() => {
          const lastNotes = getLastLogged(sessions, exId)?.notes;
          return lastNotes ? (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: C.dim, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.muted}`, borderRadius: 10, padding: '10px 14px', marginBottom: 14 }}>
              <span style={{ fontSize: 16, lineHeight: 1.4, flexShrink: 0 }}>📝</span>
              <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5, fontFamily: C.fMono }}>{lastNotes}</div>
            </div>
          ) : null;
        })()}

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
          {[30, 60, 120].map(t => (
            <button key={t} onClick={() => startRest(t)} style={{ ...st.btnSm(C.dim, C.muted), fontSize: 11, padding: '6px 10px' }}>{t}s</button>
          ))}
        </div>

        {/* Overload nudge for this exercise */}
        {allExDone && def.repMax && def.unit === 'kg' &&
          def.repMax > (def.defaultReps || 0) &&
          exData.sets.filter(s => s.done).every(s => Number(s.reps) >= def.repMax) &&
          !exData.sets.filter(s => s.done).some(s => Number(s.pain) >= 3) &&
          (() => {
            const rpes = exData.sets.filter(s => s.done).map(s => Number(s.rpe)).filter(v => !isNaN(v) && v > 0);
            return rpes.length === 0 || rpes.reduce((a,b)=>a+b,0)/rpes.length <= 8;
          })() && (
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
            <button style={{ ...st.btn(C.green), flex: 1 }} onClick={() => { setPhase('finisher'); setActiveSession(s => s ? { ...s, phase: 'finisher' } : s); }}>Finisher ›</button>
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
                color: done ? C.green : i === exIdx ? '#fff' : C.muted,
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
        {confirmCancel && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}>
            <div style={{ ...st.card(), margin: 24, padding: 24, maxWidth: 320 }}>
              <div style={{ fontFamily: C.fDisplay, fontSize: 18, textTransform: 'uppercase', marginBottom: 8 }}>Cancel Session?</div>
              <div style={{ fontSize: 13, color: C.muted, marginBottom: 20 }}>Progress will not be saved.</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={{ ...st.btn(C.red), flex: 1 }} onClick={cancelSession}>Yes, Cancel</button>
                <button style={{ ...st.ghost, flex: 1 }} onClick={() => setConfirmCancel(false)}>Keep Going</button>
              </div>
            </div>
          </div>
        )}
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
            <div key={i} style={{ ...st.card(), display: 'flex', gap: 12, padding: '12px 14px', alignItems: 'center' }}>
              <img src={`assets/icons/warmup/${item.id}.png`} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'contain', background: '#EEF3FF', flexShrink: 0, cursor: 'pointer' }} onError={e => { e.target.style.display = 'none'; }} onClick={() => onWarmupOpen && onWarmupOpen(item)} />
              <div style={{ color: C.amber, fontFamily: C.fMono, minWidth: 18 }}>{i + 1}</div>
              <div style={{ fontSize: 13 }}>{item.text}</div>
            </div>
          ))}
        </div>
        <div style={{ ...st.label, marginBottom: 6 }}>Session notes (optional)</div>
        <textarea
          style={{ ...st.inp, textAlign: 'left', minHeight: 72, resize: 'vertical', marginBottom: 16, fontSize: 13, padding: 10 }}
          placeholder="How did it feel? Any niggles or things to note..."
          value={session.notes}
          onChange={e => {
            const notes = e.target.value;
            setSession(p => ({ ...p, notes }));
            setActiveSession(p => p ? { ...p, notes } : p);
          }}
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
function History({ sessions, setSessions, allExercises = EXERCISES }) {
  const [expanded, setExpanded] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null); // sess.id pending delete
  const [editingId, setEditingId] = useState(null);   // sess.id being edited, or null
  const [draft, setDraft] = useState(null);            // deep copy of session under edit
  const sorted = [...sessions].sort((a, b) => new Date(b.date) - new Date(a.date));

  function deleteSession(id) {
    setSessions(p => {
      const next = p.filter(s => s.id !== id);
      localStorage.setItem('il_sessions', JSON.stringify(next));
      return next;
    });
    setExpanded(null);
    setConfirmDelete(null);
  }

  function startEdit(sess) {
    setEditingId(sess.id);
    setDraft(JSON.parse(JSON.stringify(sess)));
    setConfirmDelete(null); // clear any pending delete
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft(null);
  }

  function saveEdit() {
    setSessions(prev => {
      const next = prev.map(s => s.id === editingId ? draft : s);
      localStorage.setItem('il_sessions', JSON.stringify(next));
      return next;
    });
    setEditingId(null);
    setDraft(null);
  }

  function updateSet(exIdx, setIdx, field, value) {
    setDraft(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      next.exercises[exIdx].sets[setIdx][field] = value;
      return next;
    });
  }

  function updateNotes(exIdx, value) {
    setDraft(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      next.exercises[exIdx].notes = value;
      return next;
    });
  }

  function deleteSet(exIdx, setIdx) {
    setDraft(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      next.exercises[exIdx].sets.splice(setIdx, 1);
      return next;
    });
  }

  function addSet(exIdx) {
    setDraft(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      const sets = next.exercises[exIdx].sets;
      const last = sets[sets.length - 1] || {};
      sets.push({ ...last, rpe: null, pain: null, done: true });
      return next;
    });
  }

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
                {sess.energy && <span style={{ fontSize: 14 }}>{['😴','😕','😐','💪','🔥'][sess.energy - 1]}</span>}
                {sess.duration && <span style={st.pill(C.muted)}>⏱ {sess.duration}min</span>}
                {!sess.duration && !sess.completed && <span style={st.pill(C.muted)}>in progress</span>}
                <span style={{ color: C.muted, fontSize: 12 }}>{expanded === sess.id ? '▲' : '▼'}</span>
              </div>
            </div>

            {expanded === sess.id && (
              <div style={{ marginTop: 12, borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
                {(editingId === sess.id ? draft.exercises : sess.exercises)?.map((ex, exIdx) => {
                  const def = allExercises[ex.id] || EXERCISES[ex.id];
                  const isEditing = editingId === sess.id;
                  const isTimed = !!def?.isTimed;
                  const isBW = def?.unit === 'bw' || def?.unit === 'band';
                  const isPullup = !!def?.pullupTracking;
                  const loadLabel = def?.unit === 'band' ? 'BAND' : 'BW';

                  return (
                    <div key={ex.id} style={{ marginBottom: isEditing ? 14 : 10 }}>
                      <div style={{ ...st.label, marginBottom: 4 }}>{def?.name}</div>

                      {isEditing ? (
                        /* ── EDIT MODE ── */
                        <div>
                          {ex.sets.map((s, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4, background: C.dim, borderRadius: 6, padding: '6px 8px' }}>
                              {/* Set number */}
                              <span style={{ ...st.mono(11, C.muted), width: 20, textAlign: 'center', flexShrink: 0 }}>S{i + 1}</span>

                              {/* Pullup mode selector */}
                              {isPullup && (
                                <select value={s.mode || 'bw'} onChange={e => updateSet(exIdx, i, 'mode', e.target.value)}
                                  style={{ ...st.inp, fontSize: 11, flex: '0 0 68px' }}>
                                  <option value="bw">BW</option>
                                  <option value="band">Band</option>
                                  <option value="neg">Neg</option>
                                </select>
                              )}

                              {/* Weight / Duration / BW label */}
                              {isTimed ? (
                                <input type="number" inputMode="numeric" value={s.duration ?? ''}
                                  onChange={e => updateSet(exIdx, i, 'duration', e.target.value)}
                                  style={{ ...st.inp, flex: 1 }} placeholder="sec" />
                              ) : isPullup && (s.mode || 'bw') === 'band' ? (
                                <input type="text" value={s.band || ''}
                                  onChange={e => updateSet(exIdx, i, 'band', e.target.value)}
                                  style={{ ...st.inp, flex: 1, fontSize: 12 }} placeholder="band" />
                              ) : isPullup && (s.mode || 'bw') === 'neg' ? (
                                <input type="number" inputMode="numeric" value={s.duration ?? ''}
                                  onChange={e => updateSet(exIdx, i, 'duration', e.target.value)}
                                  style={{ ...st.inp, flex: 1 }} placeholder="sec" />
                              ) : isBW ? (
                                <div style={{ ...st.inp, flex: 1, color: C.muted, fontSize: 10, lineHeight: '34px', border: `1px solid ${C.border}` }}>{loadLabel}</div>
                              ) : (
                                <input type="number" inputMode="decimal" value={s.weight ?? ''}
                                  onChange={e => updateSet(exIdx, i, 'weight', e.target.value)}
                                  style={{ ...st.inp, flex: 1 }} placeholder="kg" />
                              )}

                              {/* Reps (hidden for pure timed) */}
                              {!isTimed && (
                                <input type="number" inputMode="numeric" value={s.reps ?? ''}
                                  onChange={e => updateSet(exIdx, i, 'reps', e.target.value)}
                                  style={{ ...st.inp, flex: 1 }} placeholder="reps" />
                              )}

                              {/* RPE */}
                              <select value={s.rpe ?? ''} onChange={e => updateSet(exIdx, i, 'rpe', e.target.value ? +e.target.value : null)}
                                style={{ ...st.inp, flex: '0 0 52px', fontSize: 12 }}>
                                <option value=''>RPE</option>
                                {[5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                              </select>

                              {/* Pain */}
                              <select value={s.pain ?? ''} onChange={e => updateSet(exIdx, i, 'pain', e.target.value !== '' ? +e.target.value : null)}
                                style={{ ...st.inp, flex: '0 0 52px', fontSize: 12 }}>
                                <option value=''>Pain</option>
                                {[0,1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                              </select>

                              {/* Delete set */}
                              <button onClick={() => deleteSet(exIdx, i)}
                                style={{ background: 'none', border: 'none', color: C.muted, fontSize: 15, cursor: 'pointer', padding: '0 2px', flexShrink: 0 }}>
                                🗑
                              </button>
                            </div>
                          ))}

                          {/* Add set */}
                          <button onClick={() => addSet(exIdx)}
                            style={{ background: 'none', border: `1px dashed ${C.border}`, color: C.muted, borderRadius: 4, fontSize: 11, padding: '5px 12px', width: '100%', cursor: 'pointer', marginTop: 2 }}>
                            + Add set
                          </button>

                          {/* Exercise notes */}
                          <input type="text" value={ex.notes || ''} onChange={e => updateNotes(exIdx, e.target.value)}
                            placeholder="Exercise notes…"
                            style={{ ...st.inp, marginTop: 6, fontSize: 12, textAlign: 'left', padding: '7px 10px' }} />
                        </div>
                      ) : (
                        /* ── READ MODE (unchanged) ── */
                        <div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                            {ex.sets.map((s, i) => {
                              const display = def?.isTimed ? `${s.duration}s`
                                : def?.pullupTracking
                                  ? s.mode === 'band' ? `${s.reps}r (${s.band || 'band'})`
                                    : s.mode === 'neg' ? `${s.reps}×${s.duration||'?'}s neg`
                                    : `${s.reps} reps`
                                : def?.unit === 'bw' || def?.unit === 'band' ? `${s.reps} reps`
                                : `${s.weight}kg × ${s.reps}`;
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
                      )}
                    </div>
                  );
                })}
                {sess.notes && <div style={{ marginTop: 8, fontSize: 13, color: C.muted, fontStyle: 'italic', borderTop: `1px solid ${C.dim}`, paddingTop: 8 }}>"{sess.notes}"</div>}
                <div style={{ marginTop: 12, borderTop: `1px solid ${C.dim}`, paddingTop: 10 }}>
                  {editingId === sess.id ? (
                    /* Edit mode footer: Save full-width, Cancel below */
                    <div>
                      <button onClick={saveEdit} style={{ ...st.btn(), marginBottom: 8 }}>
                        ✓ Save changes
                      </button>
                      <button onClick={cancelEdit} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, fontSize: 12, display: 'block', width: '100%', textAlign: 'center', padding: '4px 0' }}>
                        Cancel
                      </button>
                    </div>
                  ) : confirmDelete === sess.id ? (
                    /* Delete confirmation */
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, color: C.muted, flex: 1 }}>Delete this session?</span>
                      <button onClick={() => deleteSession(sess.id)} style={{ ...st.btnSm('#d9534f'), padding: '5px 12px', fontSize: 12 }}>Delete</button>
                      <button onClick={() => setConfirmDelete(null)} style={{ ...st.btnSm(), padding: '5px 12px', fontSize: 12 }}>Cancel</button>
                    </div>
                  ) : (
                    /* Read mode footer: Edit left, Delete right — never adjacent */
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <button onClick={() => { startEdit(sess); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.amber, fontSize: 12, padding: 0 }}>
                        ✏ Edit
                      </button>
                      <button onClick={() => setConfirmDelete(sess.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, fontSize: 12, padding: 0, opacity: 0.7 }}>
                        🗑 Delete session
                      </button>
                    </div>
                  )}
                </div>
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

  // Choose a step size that gives "nice" round tick values (0.5 / 1 / 2.5 / 5 / 10 / 25 …)
  const niceStep = (() => {
    if (domain) return null; // fixed-domain charts (e.g. RPE) keep their own scale
    const range = rawMax === rawMin ? 1 : rawMax - rawMin;
    const candidates = [0.5, 1, 2, 2.5, 5, 10, 20, 25, 50, 100, 250, 500];
    return candidates.find(c => c >= range / 5) || 500;
  })();

  const yMin = niceStep
    ? Math.floor(rawMin / niceStep) * niceStep
    : rawMin - (rawMax === rawMin ? 1 : (rawMax - rawMin) * 0.1);
  const yMax = niceStep
    ? Math.max(Math.ceil(rawMax / niceStep) * niceStep, yMin + niceStep)
    : rawMax + (rawMax === rawMin ? 1 : (rawMax - rawMin) * 0.1);

  // We use a fixed render width for coordinate maths; CSS scales it.
  const W = 320;
  const H = height;
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top  - PAD.bottom;

  const xOf = i  => PAD.left + (i / (data.length - 1)) * innerW;
  const yOf = v  => PAD.top  + innerH - ((v - yMin) / (yMax - yMin)) * innerH;

  // Y-axis ticks at each step interval (or 5 evenly-spaced for fixed-domain)
  const yTicks = niceStep
    ? (() => {
        const ticks = [];
        for (let v = yMin; v <= yMax + niceStep * 0.01; v = Math.round((v + niceStep) * 1e9) / 1e9) {
          ticks.push({ v, y: yOf(v) });
        }
        return ticks;
      })()
    : Array.from({ length: 5 }, (_, i) => {
        const v = yMin + (i / 4) * (yMax - yMin);
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
  // Group exercises by workout, sorted alphabetically within each group
  const workoutGroups = ['A', 'B', 'C'].map(key => {
    const w = WORKOUTS[key];
    const shortTitle = key === 'A' ? 'Push' : key === 'B' ? 'Pull' : 'Legs + Core';
    const ids = w.exercises
      .filter(id => allExercises[id])
      .sort((a, b) => (allExercises[a]?.name || a).localeCompare(allExercises[b]?.name || b));
    return { key, label: `Workout ${key} — ${shortTitle}`, ids };
  });
  const workoutExIds = new Set(['A', 'B', 'C'].flatMap(k => WORKOUTS[k].exercises));
  const otherIds = Object.keys(allExercises)
    .filter(id => !workoutExIds.has(id))
    .sort((a, b) => (allExercises[a]?.name || a).localeCompare(allExercises[b]?.name || b));

  const firstId = workoutGroups[0]?.ids[0] || Object.keys(allExercises)[0];
  const [selEx, setSelEx] = useState(firstId);

  const def = allExercises[selEx] || EXERCISES[selEx];

  const data = sessions
    .filter(s => s.exercises?.some(e => e.id === selEx))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
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
          {workoutGroups.map(({ key, label, ids }) => (
            <optgroup key={key} label={label}>
              {ids.map(id => <option key={id} value={id}>{allExercises[id]?.name || id}</option>)}
            </optgroup>
          ))}
          {otherIds.length > 0 && (
            <optgroup label="Other">
              {otherIds.map(id => <option key={id} value={id}>{allExercises[id]?.name || id}</option>)}
            </optgroup>
          )}
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
  const [dist, setDist] = useState('');
  const [rpe, setRpe] = useState('');
  const [type, setType] = useState('moderate');
  const [notes, setNotes] = useState('');

  function log() {
    if (!dur) return;
    const ride = { id: Date.now().toString(), date: new Date().toISOString(), duration: +dur, distance: dist ? +dist : null, effort: rpe ? +rpe : null, type, notes };
    setRides(p => [...p, ride]);
    pushRide(ride); // fire-and-forget cloud backup
    setOpen(false); setDur(''); setDist(''); setRpe(''); setType('moderate'); setNotes('');
  }

  const typeColor = { easy: C.green, moderate: C.amber, hard: C.blue, hilly: C.amber, recovery: C.green, intervals: C.blue, sprinkles: C.blue, tempo: C.amber, long: C.green };
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <div style={{ ...st.label, marginBottom: 5 }}>Duration (min)</div>
                <input type="number" inputMode="numeric" value={dur} onChange={e => setDur(e.target.value)} style={{ ...st.inp }} placeholder="e.g. 45" />
              </div>
              <div>
                <div style={{ ...st.label, marginBottom: 5 }}>Distance (km)</div>
                <input type="number" inputMode="decimal" value={dist} onChange={e => setDist(e.target.value)} style={{ ...st.inp }} placeholder="e.g. 18.5" />
              </div>
            </div>
            <div>
              <div style={{ ...st.label, marginBottom: 5 }}>Ride type</div>
              <select value={type} onChange={e => setType(e.target.value)} style={{ ...st.inp, textAlign: 'left', padding: '10px 12px' }}>
                <option value="easy">Easy — felt easy, could talk</option>
                <option value="moderate">Moderate — working steadily</option>
                <option value="hard">Hard — really pushed it</option>
                <option value="hilly">Hilly — lots of climbing</option>
                <option value="recovery">Recovery — very easy spin</option>
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
          { phase: 'Wks 1–2', text: '2 rides/week · 20–30 min · keep it easy, conversational pace' },
          { phase: 'Wks 3–4', text: '2–3/week · 25–40 min · mostly easy, occasionally moderate effort' },
          { phase: 'Wk 5+',   text: '3/week · mix of easy, moderate, and one harder or hilly ride' },
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
                {r.distance != null && (
                  <div style={{ fontFamily: C.fMono, fontSize: 22, color: C.amber, lineHeight: 1 }}>{r.distance}<span style={{ fontSize: 11, color: C.muted }}>km</span></div>
                )}
                <div style={{ fontFamily: C.fMono, fontSize: r.distance != null ? 15 : 22, color: C.text, lineHeight: 1.4 }}>{r.duration}<span style={{ fontSize: 11, color: C.muted }}>min</span></div>
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
  p_arnold_press:       { name: 'Arnold Press',               muscle: 'Shoulders', unit: 'kg',   defaultSets: 3, defaultReps: 10, repMax: 10, cue: 'Rotate palms as you press — in to out. Covers all three delt heads.', demo: YT('arnold+press+form+tutorial'), caution: 'Shoulder bursitis — rotation may aggravate. Start very light and stop if impingement.' },
  p_rear_delt_fly:      { name: 'Rear Delt Fly',              muscle: 'Shoulders', unit: 'kg',   defaultSets: 3, defaultReps: 15, repMax: 15, cue: 'Hinge at hips, slight bend in elbows. Lead with elbows back.',  demo: YT('rear+delt+fly+dumbbell+form+tutorial') },
  p_band_face_pull:     { name: 'Face Pull',                  muscle: 'Shoulders', unit: 'band', defaultSets: 3, defaultReps: 15, repMax: 20, cue: 'Pull to face level, elbows high. Great for shoulder health.',   demo: YT('face+pull+band+cable+form+tutorial') },
  p_shrugs:             { name: 'Dumbbell Shrugs',            muscle: 'Shoulders', unit: 'kg',   defaultSets: 3, defaultReps: 15, repMax: 15, cue: 'Straight up and down. No rolling. Hold at top 1 sec.',          demo: YT('dumbbell+shrugs+form+tutorial') },
  // ── Push: Chest ───────────────────────────────────────────────────
  p_push_up:            { name: 'Push-Up',                    muscle: 'Push',      unit: 'bw',   defaultSets: 3, defaultReps: 10, repMax: 20, cue: 'Straight body, elbows 45°. Lower chest to floor.',              demo: YT('push+up+proper+form+tutorial') },
  p_db_fly:             { name: 'Dumbbell Fly',               muscle: 'Push',      unit: 'kg',   defaultSets: 3, defaultReps: 12, repMax: 12, cue: 'Slight bend in elbows throughout. Wide arc, feel the stretch.', demo: YT('dumbbell+fly+proper+form+tutorial'), caution: 'Shoulder bursitis — light weight only. Limit range, stop before arms go fully wide. Stop if impingement.' },
  p_incline_db_press:   { name: 'Incline DB Press',           muscle: 'Push',      unit: 'kg',   defaultSets: 3, defaultReps: 10, repMax: 10, cue: '30–45° incline. Elbows at 45°. Targets upper chest.',           demo: YT('incline+dumbbell+press+form+tutorial'), caution: 'Shoulder bursitis — 30–45° incline maximum. Stop if you feel any shoulder impingement.' },
  p_chest_dip:          { name: 'Chest Dip',                  muscle: 'Push',      unit: 'bw',   defaultSets: 3, defaultReps: 8,  repMax: 12, cue: 'Lean slightly forward. Elbows flare to target chest.',          demo: YT('chest+dip+form+tutorial'), caution: 'Shoulder bursitis — stop immediately if you feel any shoulder impingement.' },
  p_cable_fly:          { name: 'Cable Fly',                  muscle: 'Push',      unit: 'kg',   defaultSets: 3, defaultReps: 12, repMax: 15, cue: 'Arms arc in a hugging motion. Squeeze at the midpoint.',        demo: YT('cable+fly+chest+form+tutorial'), gymOnly: true },
  // ── Pull: Back ────────────────────────────────────────────────────
  p_pull_up:            { name: 'Pull-Up',                    muscle: 'Pull',      unit: 'bw',   defaultSets: 3, defaultReps: 4,  repMax: 8,  cue: 'Shoulder-width or narrower grip only — no wide grip (aggravates shoulder bursitis). Overhand. Start band-assisted or negatives only. Full hang, chin over bar.', pullupTracking: true, demo: YT('pull+up+form+narrow+grip+band+assisted+beginners'), caution: 'Shoulder bursitis — narrow grip only. No wide grip. Stop if you feel shoulder impingement.' },
  p_lat_pulldown:       { name: 'Lat Pulldown',               muscle: 'Pull',      unit: 'kg',   defaultSets: 3, defaultReps: 10, repMax: 12, cue: 'Pull bar to upper chest. Lean back slightly, lead with elbows.', demo: YT('lat+pulldown+proper+form+tutorial'), gymOnly: true },
  p_seated_cable_row:   { name: 'Seated Cable Row',           muscle: 'Pull',      unit: 'kg',   defaultSets: 3, defaultReps: 10, repMax: 12, cue: 'Sit tall. Pull to lower chest. Squeeze shoulder blades together.', demo: YT('seated+cable+row+form+tutorial'), gymOnly: true },
  p_t_bar_row:          { name: 'T-Bar Row',                  muscle: 'Pull',      unit: 'kg',   defaultSets: 3, defaultReps: 8,  repMax: 10, cue: 'Neutral spine, hinge at hips. Pull to lower chest.',            demo: YT('t+bar+row+form+tutorial'), gymOnly: true },
  p_straight_arm_pd:    { name: 'Straight-Arm Pulldown',      muscle: 'Pull',      unit: 'kg',   defaultSets: 3, defaultReps: 12, repMax: 15, cue: 'Arms straight. Hinge at shoulder only. Excellent lat isolation.', demo: YT('straight+arm+pulldown+form+tutorial') },
  // ── Legs ──────────────────────────────────────────────────────────
  p_rdl:                { name: 'Romanian Deadlift',          muscle: 'Hinge',     unit: 'kg',   defaultSets: 3, defaultReps: 10, repMax: 10, cue: 'Hinge at hips, soft knee bend. Bar stays close to legs. Feel hamstring stretch.', demo: YT('romanian+deadlift+form+tutorial+beginners') },
  p_bulgarian_squat:    { name: 'Bulgarian Split Squat',      muscle: 'Legs',      unit: 'kg',   defaultSets: 3, defaultReps: 8,  repMax: 8,  cue: 'Rear foot elevated. Front knee tracks over toes. Stay upright.', demo: YT('bulgarian+split+squat+form+tutorial'), perSide: true },
  p_leg_press:          { name: 'Leg Press',                  muscle: 'Legs',      unit: 'kg',   defaultSets: 3, defaultReps: 10, repMax: 12, cue: 'Feet hip-width. Do not lock knees at top. Full range.',         demo: YT('leg+press+proper+form+tutorial'), gymOnly: true },
  p_leg_extension:      { name: 'Leg Extension',              muscle: 'Legs',      unit: 'kg',   defaultSets: 3, defaultReps: 12, repMax: 15, cue: 'Extend fully, hold 1 sec, lower controlled. Isolates quads.',    demo: YT('leg+extension+machine+form+tutorial'), gymOnly: true },
  p_seated_leg_curl:    { name: 'Seated Leg Curl',            muscle: 'Legs',      unit: 'kg',   defaultSets: 3, defaultReps: 12, repMax: 12, cue: 'Curl to full flexion. Control the return. Hamstring isolation.', demo: YT('seated+leg+curl+machine+form+tutorial'), gymOnly: true },
  p_sumo_squat:         { name: 'Sumo Squat',                 muscle: 'Legs',      unit: 'kg',   defaultSets: 3, defaultReps: 10, repMax: 12, cue: 'Wide stance, toes out. Knees track over toes. Targets inner thigh.', demo: YT('sumo+squat+form+tutorial') },
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
  p_cable_crunch:       { name: 'Cable Crunch',               muscle: 'Core',      unit: 'kg',   defaultSets: 3, defaultReps: 15, repMax: 20, cue: 'Kneel, pull rope to floor. Round spine. Abs do the work.',       demo: YT('cable+crunch+abs+form+tutorial') },
  // ── Shoulder health ───────────────────────────────────────────────────
  p_band_ext_rot:       { name: 'Band External Rotation',     muscle: 'Shoulders', unit: 'band', defaultSets: 3, defaultReps: 12, repMax: 15, cue: 'Elbow tucked at 90° at your side. Rotate forearm outward against band resistance. Slow and controlled both ways. Critical for rotator cuff health — do not skip.', demo: YT('band+external+rotation+rotator+cuff+exercise+form'), perSide: true },
  // ── Priority 1 additions ─────────────────────────────────────────────
  // Push: Chest
  p_bb_decline_bench:   { name: 'Barbell Decline Bench Press', muscle: 'Push',    unit: 'kg',   defaultSets: 3, defaultReps: 8,  repMax: 10, cue: 'Grip just outside shoulder-width. Lower bar to lower chest under control. Drive up. Decline angle targets the lower chest.', demo: YT('barbell+decline+bench+press+form+tutorial') },
  p_incline_db_fly:     { name: 'Incline DB Fly',              muscle: 'Push',    unit: 'kg',   defaultSets: 3, defaultReps: 12, repMax: 12, cue: '30–45° incline. Slight bend in elbows throughout. Wide arc down then back up — the stretch at the bottom is the key benefit.', demo: YT('incline+dumbbell+fly+form+tutorial'), caution: 'Shoulder bursitis — light weight only. Limit range, stop before arms go fully wide. Stop immediately if shoulder impingement.' },
  // Triceps
  p_db_tricep_kickback: { name: 'DB Tricep Kickback',          muscle: 'Arms',    unit: 'kg',   defaultSets: 3, defaultReps: 12, repMax: 15, cue: 'Hinge forward, upper arm parallel to floor. Extend forearm back fully. Squeeze tricep at top. Control the return.', demo: YT('dumbbell+tricep+kickback+form+tutorial'), perSide: true },
  // Biceps
  p_incline_db_curl:    { name: 'Incline DB Curl',             muscle: 'Arms',    unit: 'kg',   defaultSets: 3, defaultReps: 10, repMax: 12, cue: 'Sit on incline bench. Arms hang behind the body. Curl up slowly — the stretched starting position is the key benefit. Control down.', demo: YT('incline+dumbbell+curl+form+tutorial') },
  // Pull: Back
  p_bb_row:             { name: 'Barbell Bent-Over Row',       muscle: 'Pull',    unit: 'kg',   defaultSets: 3, defaultReps: 8,  repMax: 10, cue: 'Hinge to ~45°. Bar stays close to legs. Pull to lower chest. Squeeze shoulder blades. Keep back FLAT throughout — no rounding.', demo: YT('barbell+bent+over+row+form+tutorial'), caution: 'Slipped disc — keep weight conservative, back must stay flat. Stop immediately if any lower back pain.' },
  // Hinge
  p_deadlift:           { name: 'Conventional Deadlift',       muscle: 'Hinge',   unit: 'kg',   defaultSets: 3, defaultReps: 5,  repMax: 5,  cue: 'Bar over mid-foot. Hinge, grip just outside legs. Chest up, back flat, brace. Drive the floor away. Lock out hips at top.', demo: YT('conventional+deadlift+form+tutorial+beginners'), caution: 'Slipped disc — start conservative (60% max). Back must stay neutral throughout. Skip entirely during any disc flare-up.' },
  // Legs
  p_db_squat:           { name: 'DB Squat',                    muscle: 'Legs',    unit: 'kg',   defaultSets: 3, defaultReps: 10, repMax: 12, cue: 'Hold dumbbells at your sides. Feet shoulder-width. Squat to parallel. Knees track over toes. Drive through heels to stand.', demo: YT('dumbbell+squat+at+sides+form+tutorial') },
  p_walking_lunge:      { name: 'Walking Lunge',               muscle: 'Legs',    unit: 'kg',   defaultSets: 3, defaultReps: 10, repMax: 12, cue: 'Long stride forward. Front knee tracks over toes. Stay upright — no forward lean. Alternate legs. Rep count is total steps.', demo: YT('walking+lunge+form+tutorial'), caution: 'Light weight or bodyweight only. Stop if knee pain.' },
  // Glutes
  p_bb_hip_thrust:      { name: 'Barbell Hip Thrust',          muscle: 'Glutes',  unit: 'kg',   defaultSets: 3, defaultReps: 10, repMax: 12, cue: 'Shoulders on bench, bar across hips with pad. Drive hips up to full extension. Squeeze glutes hard at top. Control the descent.', demo: YT('barbell+hip+thrust+form+tutorial') },
};

const MUSCLE_META = {
  // ── Workout C — Legs / Core ─────────────────────────────────────────
  goblet_squat:    ['Quads',           'Glutes'],
  hip_thrust:      ['Glutes',          'Hamstrings'],
  rdl:             ['Hamstrings',      'Glutes'],
  reverse_lunge:   ['Quads',           'Glutes'],
  sb_ham_curl:     ['Hamstrings',      'Glutes'],
  pallof_press:    ['Obliques',        null],
  farmers_walk:    ['Forearms',        'Upper Traps'],  // ExRx: grip/forearms is the limiting target; core is a stabiliser
  // ── Workout A — Push ────────────────────────────────────────────────
  bb_flat_bench:   ['Chest',           'Triceps'],
  db_bench:        ['Chest',           'Triceps'],
  db_floor_press:  ['Chest',           'Triceps'],
  bb_incline_bench:['Chest',           'Front Delts'],
  // ── Workout B — Pull / Hinge ────────────────────────────────────────
  kb_deadlift:     ['Glutes',          'Hamstrings'],
  chin_up:         ['Lats',            'Biceps'],
  cs_db_row:       ['Lats',            'Biceps'],
  face_pull:       ['Rear Delts',      'Mid Traps'],
  reverse_fly:     ['Rear Delts',      'Mid Traps'],
  db_row_1arm:     ['Lats',            'Biceps'],
  band_row:        ['Lats',            'Biceps'],
  // ── Accessory / Warmup exercises ────────────────────────────────────
  step_ups:        ['Quads',           'Glutes'],
  incline_pushups: ['Chest',           'Triceps'],
  suitcase_carry:  ['Obliques',        'Forearms'],
  split_squat:     ['Quads',           'Glutes'],
  calf_raises:     ['Calves',          null],
  single_leg_bal:  [null,              null],       // balance drill — no primary muscle highlight
  // ── Preset library — Arms ───────────────────────────────────────────
  p_db_bicep_curl:      ['Biceps',      'Forearms'],
  p_barbell_curl:       ['Biceps',      'Forearms'],
  p_hammer_curl:        ['Forearms',    'Biceps'],   // ExRx: brachioradialis (forearms) is the target; biceps is synergist
  p_concentration_curl: ['Biceps',      null],
  p_preacher_curl:      ['Biceps',      'Forearms'], // ExRx: brachioradialis listed as synergist
  // ── Preset library — Triceps ────────────────────────────────────────
  p_tricep_pushdown:    ['Triceps',     null],
  p_overhead_ext:       ['Triceps',     null],
  p_skull_crushers:     ['Triceps',     null],
  p_tricep_dips:        ['Triceps',     'Chest'],
  p_close_grip_bench:   ['Triceps',     'Chest'],
  p_diamond_pushup:     ['Triceps',     'Chest'],
  // ── Preset library — Shoulders ──────────────────────────────────────
  p_lateral_raise:      ['Side Delts',  null],
  p_front_raise:        ['Front Delts', null],
  p_db_shoulder_press:  ['Front Delts', 'Triceps'],  // ExRx: anterior deltoid is primary in overhead pressing
  p_arnold_press:       ['Front Delts', 'Side Delts'],  // ExRx: anterior deltoid is primary in Arnold press
  p_rear_delt_fly:      ['Rear Delts',  'Mid Traps'],
  p_band_face_pull:     ['Rear Delts',  'Mid Traps'],
  p_shrugs:             ['Upper Traps', null],
  p_band_ext_rot:       ['Rear Delts',  null],
  // ── Preset library — Chest ──────────────────────────────────────────
  p_push_up:            ['Chest',       'Triceps'],
  p_db_fly:             ['Chest',       'Front Delts'],
  p_incline_db_press:   ['Chest',       'Front Delts'],
  p_chest_dip:          ['Chest',       'Triceps'],
  p_cable_fly:          ['Chest',       'Front Delts'],
  // ── Preset library — Back ───────────────────────────────────────────
  p_pull_up:            ['Lats',        'Biceps'],
  p_lat_pulldown:       ['Lats',        'Biceps'],
  p_seated_cable_row:   ['Lats',        'Biceps'],
  p_t_bar_row:          ['Lats',        'Mid Traps'],
  p_straight_arm_pd:    ['Lats',        null],
  p_rdl:                ['Hamstrings',  'Glutes'],
  // ── Preset library — Legs ───────────────────────────────────────────
  p_bulgarian_squat:    ['Quads',       'Glutes'],
  p_leg_press:          ['Quads',       'Glutes'],
  p_leg_extension:      ['Quads',       null],
  p_seated_leg_curl:    ['Hamstrings',  null],
  p_sumo_squat:         ['Quads',       'Glutes'],
  p_wall_sit:           ['Quads',       null],
  p_cable_kickback:     ['Glutes',      null],
  p_hip_abduction:      ['Glutes',      null],
  p_frog_pumps:         ['Glutes',      null],
  p_donkey_kick:        ['Glutes',      null],
  p_clamshell:          ['Glutes',      null],
  // ── Preset library — Core ───────────────────────────────────────────
  p_plank:              ['Abs',         'Obliques'],
  p_side_plank:         ['Obliques',    'Abs'],
  p_dead_bug:           ['Abs',         null],
  p_bird_dog:           ['Spinal Erectors', 'Glutes'],  // ExRx: erector spinae is the target; abs are stabilisers
  p_ab_wheel:           ['Abs',         null],
  p_hanging_knee_raise: ['Abs',         null],       // NOTE: ExRx targets Iliopsoas (hip flexors) — no hip flexors in muscle map; Abs used as closest available
  p_cable_crunch:       ['Abs',         null],
  // ── Priority 1 additions ────────────────────────────────────────────
  p_bb_decline_bench:   ['Chest',       'Triceps'],
  p_incline_db_fly:     ['Chest',       'Front Delts'],
  p_db_tricep_kickback: ['Triceps',     null],
  p_incline_db_curl:    ['Biceps',      'Forearms'],
  p_bb_row:             ['Lats',        'Mid Traps'],
  p_deadlift:           ['Glutes',      'Hamstrings'],  // ExRx: glutes & hamstrings are primary movers in conventional deadlift
  p_db_squat:           ['Quads',       'Glutes'],
  p_walking_lunge:      ['Quads',       'Glutes'],
  p_bb_hip_thrust:      ['Glutes',      'Hamstrings'],
};

function applyMuscleMeta(library) {
  Object.entries(library).forEach(([id, ex]) => {
    const [primaryMuscle, secondaryMuscle] = MUSCLE_META[id] || [null, null];
    ex.primary = primaryMuscle ? [primaryMuscle] : [];
    ex.secondary = secondaryMuscle ? [secondaryMuscle] : [];
    ex.primaryMuscle = primaryMuscle;
    ex.secondaryMuscle = secondaryMuscle;
  });
}

applyMuscleMeta(EXERCISES);
applyMuscleMeta(PRESET_LIBRARY);

function applyStretchMeta() {
  STRETCH_LIBRARY.forEach(s => {
    const [p, sec] = STRETCH_MUSCLE_META[s.id] || [null, null];
    s.primary      = p   ? [p]   : [];
    s.secondary    = sec ? [sec] : [];
    s.sciatica     = STRETCH_SCIATICA_IDS.has(s.id);
    s.cross_legged = STRETCH_CROSS_LEGGED_IDS.has(s.id);
  });
}
applyStretchMeta();

// ═══════════════════════════════════════════════════════════════════════
// MANAGE (Exercise Library + Workout Builder)
// ═══════════════════════════════════════════════════════════════════════
const MUSCLE_FILTERS = ['All','Arms','Shoulders','Push','Pull','Hinge','Legs','Glutes','Core'];
const EMPTY_FORM = { name: '', muscle: 'Arms', unit: 'kg', defaultSets: 3, defaultReps: 10, repMax: 10, cue: '' };

function Manage({ customExercises, setCustomExercises, workoutCustom, setWorkoutCustom, workoutHidden, setWorkoutHidden, allExercises, driveSync, onDriveSave, onDriveLoad, onCloudSync, onDemoOpen }) {
  const [tab, setTab] = useState('library');
  const [search, setSearch] = useState('');
  const [muscle, setMuscle] = useState('All');
  const [addWktPicker, setAddWktPicker] = useState(null); // exId being placed into a workout
  const [expandedLib, setExpandedLib] = useState(null);  // exId currently expanded in library
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [wktTab, setWktTab] = useState('A');
  const [addingTo, setAddingTo] = useState(null);
  const [wktSearch, setWktSearch] = useState('');
  const [librarySubTab, setLibrarySubTab]   = useState('exercises');
  const [expandedStretch, setExpandedStretch] = useState(null);
  const [strFilter, setStrFilter]            = useState('all'); // 'all' | 'sciatica' | 'crosslegged'

  // All exercises that can be browsed/added (workout exercises + presets + user-created custom)
  const libraryEntries = [
    ...Object.entries(EXERCISES),
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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', marginBottom: 20, border: `1px solid ${C.border}`, borderRadius: 6, overflow: 'hidden' }}>
        {[['library','Library'],['workouts','Workouts'],['backup','Backup']].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            background: tab === id ? C.amber : C.dim, color: tab === id ? '#fff' : C.muted,
            border: 'none', padding: '11px', fontFamily: C.fDisplay, fontSize: 13, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: 1, cursor: 'pointer',
          }}>{label}</button>
        ))}
      </div>

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

          {/* Muscle filter pills */}
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8, marginBottom: 14 }}>
            {MUSCLE_FILTERS.map(m => (
              <button key={m} onClick={() => setMuscle(m)} style={{
                background: muscle === m ? C.amber : C.dim,
                color: muscle === m ? '#fff' : C.muted,
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
              const isExpanded = expandedLib === id;
              return (
                <div key={id} style={{ ...st.card(), borderColor: ex.isCustom ? C.amber + '44' : C.border, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {/* Card header — tappable to expand/collapse */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}
                    onClick={() => setExpandedLib(isExpanded ? null : id)}>
                    <ExerciseIcon id={id} size={36} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                        <span style={{ fontFamily: C.fDisplay, fontSize: 16, textTransform: 'uppercase', letterSpacing: 0.5 }}>{ex.name}</span>
                        {ex.isCustom && <span style={{ ...st.pill(), fontSize: 9 }}>Custom</span>}
                        <span style={{ marginLeft: 'auto', color: C.muted, fontSize: 11, flexShrink: 0 }}>{isExpanded ? '▲' : '▼'}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <span style={st.pill(C.muted)}>{ex.primaryMuscle || ex.muscle}</span>
                        {ex.secondaryMuscle && <span style={{ ...st.pill('#e8f0ff'), color: '#5b8fdc', fontSize: 9 }}>{ex.secondaryMuscle}</span>}
                        <span style={{ ...st.mono(10, C.muted) }}>{ex.defaultSets} sets · {ex.isTimed ? `${ex.defaultDuration}s` : `${ex.defaultReps}${ex.repMax && ex.repMax !== ex.defaultReps ? '–' + ex.repMax : ''} reps`} · {ex.unit}</span>
                        {ex.perSide && <span style={st.pill(C.blue)}>Per side</span>}
                      </div>
                    </div>
                    {ex.isCustom && (
                      <button onClick={e => { e.stopPropagation(); deleteCustom(id); }} style={{ background: C.red + '18', border: `1px solid ${C.red}33`, borderRadius: 4, color: C.red, padding: '4px 8px', cursor: 'pointer', fontSize: 12, flexShrink: 0 }}>✕</button>
                    )}
                  </div>

                  {/* Expanded detail — muscle diagram + cue */}
                  {isExpanded && (
                    <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
                        <div onClick={() => onDemoOpen && onDemoOpen(id)} style={{ cursor: 'pointer' }}>
                          <ExerciseIcon id={id} size={96} />
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                        <MuscleDiagram
                          primary={ex.primary || []}
                          secondary={ex.secondary || []}
                          size="medium"
                        />
                      </div>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: ex.cue ? 10 : 0 }}>
                        {(ex.primaryMuscle || ex.muscle) && (
                          <span style={{ background: C.amberDim, color: C.amber, fontSize: 11, borderRadius: 20, padding: '3px 10px', fontFamily: C.fMono }}>
                            ● {ex.primaryMuscle || ex.muscle}
                          </span>
                        )}
                        {ex.secondaryMuscle && (
                          <span style={{ background: '#e8f0ff', color: '#5b8fdc', fontSize: 11, borderRadius: 20, padding: '3px 10px', fontFamily: C.fMono }}>
                            ○ {ex.secondaryMuscle}
                          </span>
                        )}
                      </div>
                      {ex.cue && (
                        <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5, marginBottom: 6, padding: '8px 0' }}>
                          {ex.cue}
                        </div>
                      )}
                    </div>
                  )}

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
                              flex: 1, background: alreadyIn ? C.dim : C.amber, color: alreadyIn ? C.muted : '#fff',
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

          {/* ── Stretches sub-tab ── */}
          {librarySubTab === 'stretches' && (
            <div style={{ ...st.col(8) }}>
              {/* Filter toggle — All / Sciatica / Cross-legged */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                <button onClick={() => setStrFilter('all')}
                  style={{ flex: 1, padding: '7px 4px', borderRadius: 8,
                    border: `1px solid ${strFilter === 'all' ? C.border : C.dim}`,
                    background: strFilter === 'all' ? C.dim : 'transparent',
                    color: strFilter === 'all' ? '#fff' : C.muted,
                    fontFamily: C.fDisplay, fontSize: 11, cursor: 'pointer' }}>
                  All
                </button>
                <button onClick={() => setStrFilter('sciatica')}
                  style={{ flex: 1, padding: '7px 4px', borderRadius: 8,
                    border: `1px solid ${strFilter === 'sciatica' ? '#a78bfa' : C.dim}`,
                    background: strFilter === 'sciatica' ? '#2d1b4e' : 'transparent',
                    color: strFilter === 'sciatica' ? '#a78bfa' : C.muted,
                    fontFamily: C.fDisplay, fontSize: 11, cursor: 'pointer' }}>
                  ◈ Sciatica
                </button>
                <button onClick={() => setStrFilter('crosslegged')}
                  style={{ flex: 1, padding: '7px 4px', borderRadius: 8,
                    border: `1px solid ${strFilter === 'crosslegged' ? '#34d399' : C.dim}`,
                    background: strFilter === 'crosslegged' ? '#0a2e1e' : 'transparent',
                    color: strFilter === 'crosslegged' ? '#34d399' : C.muted,
                    fontFamily: C.fDisplay, fontSize: 11, cursor: 'pointer' }}>
                  ⊕ Cross-legged
                </button>
              </div>

              {STRETCH_LIBRARY.filter(s =>
                strFilter === 'all' ||
                (strFilter === 'sciatica'     && s.sciatica)     ||
                (strFilter === 'crosslegged'  && s.cross_legged)
              ).map((s) => {
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
                          {s.sciatica     && <span style={{ background: '#2d1b4e', color: '#a78bfa', fontSize: 9, borderRadius: 20, padding: '2px 8px', fontFamily: C.fMono, fontWeight: 700 }}>Sciatica</span>}
                          {s.cross_legged && <span style={{ background: '#0a2e1e', color: '#34d399',  fontSize: 9, borderRadius: 20, padding: '2px 8px', fontFamily: C.fMono, fontWeight: 700 }}>Cross-legged</span>}
                          {s.bilateral   && <span style={{ ...st.pill(C.amber), fontSize: 9 }}>Both sides</span>}
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
                        {/* Caution banner */}
                        {s.caution && (
                          <div style={{ background: '#3a2800', border: `1px solid ${C.amber}`, borderRadius: 6, padding: '8px 10px', marginBottom: 8 }}>
                            <div style={{ fontSize: 11, fontFamily: C.fMono, color: C.amber, fontWeight: 700, marginBottom: 2 }}>⚠ CAUTION</div>
                            <div style={{ fontSize: 12, color: C.amber, lineHeight: 1.5, fontFamily: C.fMono }}>{s.caution}</div>
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
      {tab === 'workouts' && (
        <div>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 14, lineHeight: 1.5 }}>
            Add or remove exercises from each workout. Tap Remove to hide a built-in exercise, Restore to bring it back.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 20 }}>
            {['A','B','C'].map(k => (
              <button key={k} onClick={() => { setWktTab(k); setAddingTo(null); setWktSearch(''); }} style={{
                background: wktTab === k ? C.amber : C.dim, color: wktTab === k ? '#fff' : C.muted,
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
                  {baseIds.map(id => {
                    const isHidden = (workoutHidden[key] || []).includes(id);
                    return (
                      <div key={id} style={{ ...st.card(), display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', opacity: isHidden ? 0.45 : 1 }}>
                        <div>
                          <span style={{ fontSize: 13, textDecoration: isHidden ? 'line-through' : 'none' }}>{allExercises[id]?.name || id}</span>
                          <span style={{ ...st.mono(10, C.muted), marginLeft: 8 }}>{allExercises[id]?.muscle}</span>
                        </div>
                        {isHidden ? (
                          <button onClick={() => setWorkoutHidden(prev => ({ ...prev, [key]: (prev[key] || []).filter(eid => eid !== id) }))}
                            style={{ background: C.green + '18', border: '1px solid ' + C.green + '44', borderRadius: 4, color: C.green, padding: '4px 8px', cursor: 'pointer', fontSize: 11 }}>Restore</button>
                        ) : (
                          <button onClick={() => setWorkoutHidden(prev => ({ ...prev, [key]: [...(prev[key] || []), id] }))}
                            style={{ background: C.red + '18', border: '1px solid ' + C.red + '44', borderRadius: 4, color: C.red, padding: '4px 8px', cursor: 'pointer', fontSize: 12 }}>Remove</button>
                        )}
                      </div>
                    );
                  })}
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

      {/* ── Backup tab ── */}
      {tab === 'backup' && (
        <div>
          <div style={{ ...st.card(), marginBottom: 16 }}>
            <div style={{ ...st.label, marginBottom: 10 }}>Cloud Sync</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: driveSync?.cloudStatus === 'ok' ? C.green : driveSync?.cloudStatus === 'error' ? C.red : C.muted, fontFamily: C.fMono }}>
                {driveSync?.cloudStatus === 'ok' && `☁ Synced ${driveSync.lastCloudSync ? new Date(driveSync.lastCloudSync).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' }) : ''}`}
                {driveSync?.cloudStatus === 'error' && '☁ Sync failed'}
                {driveSync?.cloudStatus === 'syncing' && '☁ Syncing…'}
                {(!driveSync?.cloudStatus || driveSync.cloudStatus === 'idle') && '☁ Supabase auto-sync on'}
              </span>
              <button onClick={onCloudSync} style={{ ...st.btnSm(C.dim, C.muted), fontSize: 11, marginLeft: 'auto' }}>
                Sync now
              </button>
            </div>
            <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>
              Sessions and rides are backed up automatically. Use JSON backup only for manual archives or emergency restore.
            </div>
          </div>

          <div style={{ ...st.card(), marginBottom: 16 }}>
            <div style={{ ...st.label, marginBottom: 10 }}>JSON Backup & Restore</div>
            {driveSync?.status === 'error' && (
              <div style={{ fontSize: 12, color: C.red, marginBottom: 10, fontFamily: C.fMono }}>⚠ {driveSync.error}</div>
            )}
            {driveSync?.status === 'done' && driveSync.lastSync && (
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

          <button
            onClick={() => window.location.reload(true)}
            style={{ ...st.btn(C.dim, C.muted), width: '100%', fontSize: 12 }}
          >
            ↺ Check for updates
          </button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// EXERCISE DEMO MODAL
// ═══════════════════════════════════════════════════════════════════════
function ExerciseDemoModal({ exerciseId, onClose }) {
  const [frames, setFrames] = React.useState([]);
  const [seqIdx, setSeqIdx] = React.useState(0);

  // Probe for available demo frames (up to 3)
  React.useEffect(() => {
    setFrames([]);
    setSeqIdx(0);
    let checked = 0;
    const found = [];
    for (let i = 1; i <= 3; i++) {
      const img = new window.Image();
      const src = `assets/demos/${exerciseId}_${i}.png?v=${APP_BUILD}`;
      const idx = i - 1;
      img.onload  = () => { found[idx] = src; checked++; if (checked === 3) setFrames(found.filter(Boolean)); };
      img.onerror = () => {                    checked++; if (checked === 3) setFrames(found.filter(Boolean)); };
      img.src = src;
    }
  }, [exerciseId]);

  // Ping-pong cycle: 2 frames → [0,1], 3 frames → [0,1,2,1]
  React.useEffect(() => {
    if (frames.length < 2) return;
    const seq = frames.length >= 3 ? [0, 1, 2, 1] : [0, 1];
    const id = setInterval(() => setSeqIdx(p => (p + 1) % seq.length), 450);
    return () => clearInterval(id);
  }, [frames]);

  const seq = frames.length >= 3 ? [0, 1, 2, 1] : [0, 1];
  const currentSrc = frames.length > 0 ? frames[seq[seqIdx]] : null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 500,
        background: 'rgba(10,15,40,0.92)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {currentSrc ? (
        <div
          onClick={e => e.stopPropagation()}
          style={{
            background: '#EEF3FF',
            borderRadius: 28,
            padding: 16,
            boxShadow: '0 8px 48px rgba(0,0,0,0.5)',
          }}
        >
          <img
            src={currentSrc}
            style={{ width: 300, height: 300, objectFit: 'contain', display: 'block' }}
          />
        </div>
      ) : (
        <div style={{ color: 'rgba(255,255,255,0.35)', fontFamily: C.fMono, fontSize: 11, letterSpacing: 1 }}>
          NO DEMO YET
        </div>
      )}
      <div style={{
        position: 'absolute', top: 24, right: 24,
        color: 'rgba(255,255,255,0.5)', fontSize: 28, lineHeight: 1, cursor: 'pointer',
      }}>✕</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// WARMUP / FINISHER ICON MODAL
function WarmupDemoModal({ item, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 500,
        background: 'rgba(10,15,40,0.92)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 16,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#EEF3FF',
          borderRadius: 28,
          padding: 20,
          boxShadow: '0 8px 48px rgba(0,0,0,0.5)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
          maxWidth: 320, margin: 24,
        }}
      >
        <img
          src={`assets/icons/warmup/${item.id}.png`}
          style={{ width: 260, height: 260, objectFit: 'contain', display: 'block' }}
          onError={e => { e.target.style.opacity = 0.2; }}
        />
        <div style={{ fontSize: 13, lineHeight: 1.5, color: '#1a2a4a', textAlign: 'center', fontFamily: C.fMono }}>
          {item.text}
        </div>
      </div>
      <div style={{
        position: 'absolute', top: 24, right: 24,
        color: 'rgba(255,255,255,0.5)', fontSize: 28, lineHeight: 1, cursor: 'pointer',
      }}>✕</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════════════════
export default function App() {
  const [demoExId, setDemoExId] = useState(null);
  const [warmupDemoItem, setWarmupDemoItem] = useState(null);
  const [view, setView] = useState('dashboard');
  const [sessions, setSessions] = useState([]);
  const [rides, setRides] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [selectedWorkout, setSelectedWorkout] = useState('A');
  const [customExercises, setCustomExercises] = useState({});
  const [workoutCustom, setWorkoutCustom] = useState({ A: [], B: [], C: [] });
  const [workoutHidden, setWorkoutHidden] = useState({ A: [], B: [], C: [] });
  const [ready, setReady] = useState(false);
  const [driveSync, setDriveSync] = useState({ status: 'idle', lastSync: null, error: null });
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [showWhy, setShowWhy] = useState(false);
  const [preStartSwaps, setPreStartSwaps] = useState({});

  // Keep a ref to current data so export always uses the latest state
  const dataRef = useRef({});

  const allExercises = { ...EXERCISES, ...PRESET_LIBRARY, ...customExercises };
  const coachRec = computeCoachRecommendation(sessions, rides, selectedWorkout);

  useEffect(() => {
    dataRef.current = { sessions, rides, customExercises, workoutCustom };
  }, [sessions, rides, customExercises, workoutCustom]);

  useEffect(() => {
    (async () => {
      const [s, r, a, ce, wc, wh] = await Promise.all([
        load('il_sessions'), load('il_rides'), load('il_active'),
        load('il_custom_exercises'), load('il_workout_custom'), load('il_workout_hidden'),
      ]);
      const localSessions = s || [];
      const localRides    = r || [];

      // Attempt cloud restore — only replaces local if cloud has more records
      const cloudSessions = await pullSessions(localSessions);
      const cloudRides    = await pullRides(localRides);
      const finalSessions = cloudSessions || localSessions;
      const finalRides    = cloudRides    || localRides;

      setSessions(finalSessions);
      setRides(finalRides);
      if (a)  setActiveSession(a);
      if (ce) setCustomExercises(ce);
      if (wc) setWorkoutCustom(wc);
      if (wh) setWorkoutHidden(wh);
      setSelectedWorkout(nextWorkout(finalSessions));
      setReady(true);
    })();
  }, []);

  useEffect(() => {
    fetch('version.json?t=' + Date.now())
      .then(r => r.json())
      .then(d => { if (d.v && d.v > APP_BUILD) setUpdateAvailable(true); })
      .catch(() => {});
  }, []);

  useEffect(() => { if (ready) save('il_sessions', sessions); }, [sessions, ready]);
  useEffect(() => { if (ready) save('il_rides', rides); }, [rides, ready]);
  useEffect(() => { if (ready) save('il_active', activeSession); }, [activeSession, ready]);
  useEffect(() => { if (ready) save('il_custom_exercises', customExercises); }, [customExercises, ready]);
  useEffect(() => { if (ready) save('il_workout_custom', workoutCustom); }, [workoutCustom, ready]);
  useEffect(() => { if (ready) save('il_workout_hidden', workoutHidden); }, [workoutHidden, ready]);

  function handleExport() {
    exportData(dataRef.current);
    setDriveSync({ status: 'done', lastSync: new Date().toISOString(), error: null });
  }

  async function handleImport(file) {
    if (!file) return;
    setDriveSync(s => ({ ...s, status: 'loading', error: null }));
    try {
      const data = await importData(file);
      if (data.sessions !== undefined && !Array.isArray(data.sessions))
        throw new Error('Invalid backup: sessions must be an array.');
      if (data.rides !== undefined && !Array.isArray(data.rides))
        throw new Error('Invalid backup: rides must be an array.');
      if (data.customExercises !== undefined && !Array.isArray(data.customExercises) && typeof data.customExercises !== 'object')
        throw new Error('Invalid backup: customExercises is malformed.');
      setActiveSession(null);
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

  async function handleCloudSync() {
    if (activeSession) return; // never sync mid-workout
    setDriveSync(s => ({ ...s, cloudStatus: 'syncing' }));
    try {
      const { sessions: cur, rides: curRides } = dataRef.current;
      await Promise.all([
        ...cur.map(pushSession),
        ...curRides.map(pushRide),
      ]);
      setDriveSync(s => ({ ...s, cloudStatus: 'ok', lastCloudSync: new Date().toISOString() }));
    } catch (e) {
      setDriveSync(s => ({ ...s, cloudStatus: 'error' }));
    }
  }

  function handleComplete(sess) {
    setSessions(p => [...p, sess]);
    setActiveSession(null);
    pushSession(sess); // fire-and-forget cloud backup
  }

  if (!ready) return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: C.fMono, color: C.amber, letterSpacing: 1 }}>LOADING...</div>
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
        {view === 'preStart' && (
          <PreStartScreen
            selectedWorkout={selectedWorkout}
            coachRec={coachRec}
            preStartSwaps={preStartSwaps}
            setPreStartSwaps={setPreStartSwaps}
            allExercises={allExercises}
            sessions={sessions}
            workoutCustom={workoutCustom}
            workoutHidden={workoutHidden}
            setActiveSession={setActiveSession}
            setView={setView}
          />
        )}
        {view === 'dashboard' && (
          <Dashboard sessions={sessions} rides={rides} setView={setView} activeSession={activeSession}
            selectedWorkout={selectedWorkout} setSelectedWorkout={setSelectedWorkout}
            allExercises={allExercises} workoutCustom={workoutCustom}
            workoutHidden={workoutHidden} setWorkoutHidden={setWorkoutHidden}
            driveSync={driveSync} onCloudSync={handleCloudSync}
            updateAvailable={updateAvailable} onWarmupOpen={setWarmupDemoItem}
            onDemoOpen={setDemoExId}
            coachRec={coachRec} showWhy={showWhy} setShowWhy={setShowWhy} />
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
            workoutHidden={workoutHidden}
            setWorkoutHidden={setWorkoutHidden}
            onDemoOpen={setDemoExId}
            onWarmupOpen={setWarmupDemoItem}
            coachRec={coachRec}
          />
        )}
        {(view === 'stretch' || view === 'stretch_setup') && <StretchSetup onBegin={() => setView('stretch_active')} onSkip={() => setView('dashboard')} />}
        {view === 'stretch_active' && <StretchActive onDone={() => setView('dashboard')} />}
        {view === 'history' && <History sessions={sessions} setSessions={setSessions} allExercises={allExercises} />}
        {view === 'progress' && <Progress sessions={sessions} allExercises={allExercises} />}
        {view === 'rides' && <Rides rides={rides} setRides={setRides} />}
        {view === 'manage' && (
          <Manage
            customExercises={customExercises}
            setCustomExercises={setCustomExercises}
            workoutCustom={workoutCustom}
            setWorkoutCustom={setWorkoutCustom}
            workoutHidden={workoutHidden}
            setWorkoutHidden={setWorkoutHidden}
            allExercises={allExercises}
            driveSync={driveSync}
            onDriveSave={handleExport}
            onDriveLoad={handleImport}
            onCloudSync={handleCloudSync}
            onDemoOpen={setDemoExId}
          />
        )}
      </div>
      <Nav view={view} setView={setView} hasActive={!!activeSession} />
      {demoExId && <ExerciseDemoModal exerciseId={demoExId} onClose={() => setDemoExId(null)} />}
      {warmupDemoItem && <WarmupDemoModal item={warmupDemoItem} onClose={() => setWarmupDemoItem(null)} />}
    </>
  );
}
