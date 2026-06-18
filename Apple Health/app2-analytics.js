/* ===========================================================================
   Antz Welfare — Index 2 · Animal Assessment Analytics Detail Page
   Loaded AFTER app2.js. Reuses its kit (I2, components, ASSESS, go2/back2,
   assessChartSVG / mountAssessChart / showAssessTip) so the whole module stays
   one design language. NO risk scores/levels/analytics anywhere here.
   Flow:  Summary Card → Analytics (5 tabs) → Assessment Record → Detail
   =========================================================================== */

/* ---- extend activity data with the Custom-range dataset ------------------ */
ASSESS.Custom = {
  unit: 'records per month', range: '1 Jan – 19 Jun 2025',
  buckets: makeBuckets(
    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    ['January', 'February', 'March', 'April', 'May', 'June'],
    [12, 18, 9, 22, 16, 27],
    ['Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025', 'May 2025', 'Jun 2025'],
    [10, 14, 11, 17, 13, 20]),
};

/* ---- assessment history (newest first) ----------------------------------
   One recurring "Health Check" template carrying every response type, so
   Comparison + Analytics can adapt by type without assuming scores exist. */
const ASSESS_TYPE_TAGS = ['Nutrition', 'Behaviour', 'Medical', 'Body Condition', 'Weight', 'Enrichment'];
const ASSESSORS2 = ['Dr. R. Mehta', 'Dr. L. Owens', 'S. Park', 'J. Alvarez'];
const HISTORY = (() => {
  const meta = [
    ['19 Jun 2025', '10:45 AM'], ['5 Jun 2025', '3:20 PM'], ['22 May 2025', '9:15 AM'],
    ['8 May 2025', '11:30 AM'], ['24 Apr 2025', '2:40 PM'], ['10 Apr 2025', '10:05 AM'],
    ['27 Mar 2025', '4:05 PM'], ['13 Mar 2025', '9:50 AM'],
  ];
  const weight = [24, 22, 23, 22.5, 21.8, 22.2, 21.5, 21];
  const temp   = [38.5, 38.6, 38.4, 38.5, 38.5, 38.4, 38.6, 38.5];
  const bc     = [4, 3, 4, 3, 3, 3, 2, 3];
  const act    = [8, 6, 7, 7, 5, 6, 5, 6];
  const app    = ['Excellent', 'Good', 'Good', 'Good', 'Reduced', 'Good', 'Good', 'Poor'];
  const notes  = [
    'Bright and active this morning. Engaged well with enrichment. Coat condition improved.',
    'Calm, feeding normally. Slight reduction in afternoon activity observed.',
    'Active and responsive. Good interaction with the group.',
    'Normal behaviour throughout the session. Appetite steady.',
    'Lower activity observed today; monitoring appetite over the week.',
    'Recovered well since last check. Feeding consistently.',
    'Reduced movement noted during the observation window.',
    'Baseline assessment recorded on intake to the section.',
  ];
  const types = ['Medical Observation', 'Nutrition Assessment', 'Behaviour Assessment', 'Weight Check', 'Body Condition Score', 'Medical Observation', 'Behaviour Assessment', 'Nutrition Assessment'];
  const cats  = ['Medical', 'Nutrition', 'Behaviour', 'Weight', 'Body Condition', 'Medical', 'Behaviour', 'Nutrition'];
  return meta.map((m, i) => ({
    id: 'AS-' + (2087 - i * 6), tmpl: 'Health Check', type: types[i], cat: cats[i], date: m[0], time: m[1],
    assessor: ASSESSORS2[i % 4], status: i === 0 ? 'Completed' : (i % 5 === 4 ? 'Approved' : 'Completed'),
    attachments: i % 2 === 0 ? 2 : 1,
    items: [
      { q: 'Weight', cat: 'Weight', rt: 'numeric', unit: 'kg', value: weight[i] },
      { q: 'Temperature', cat: 'Medical', rt: 'numeric', unit: '°C', value: temp[i] },
      { q: 'Body Condition', cat: 'Body Condition', rt: 'scale', min: 1, max: 9, value: bc[i] },
      { q: 'Activity Level', cat: 'Behaviour', rt: 'scale', min: 1, max: 10, value: act[i] },
      { q: 'Appetite', cat: 'Nutrition', rt: 'list', options: ['Poor', 'Reduced', 'Good', 'Excellent'], value: app[i] },
      { q: 'Observation Notes', cat: 'Medical', rt: 'text', value: notes[i] },
    ],
  }));
})();
function recById2(id) { return HISTORY.find(r => r.id === id) || HISTORY[0]; }

/* ===========================================================================
   ASSESSMENT CATALOGUE — single source of truth
   Category → Type → Response Type. Drives the Detailed cards, the metric
   detail sheet, History, Comparison and the Schedule form. Real history exists
   only for a few types, so values are synthesised deterministically per type
   (seeded by name) across a shared set of 8 assessment sessions.
   =========================================================================== */
/* shared list-option presets (best value LAST so ↑ = improvement) */
const OPT = {
  quality:  ['Poor', 'Fair', 'Good', 'Excellent'],
  appetite: ['Poor', 'Reduced', 'Good', 'Excellent'],
  social:   ['Withdrawn', 'Reserved', 'Social', 'Very Social'],
  feeding:  ['Poor', 'Hesitant', 'Normal', 'Eager'],
  play:     ['None', 'Low', 'Moderate', 'Active'],
  calm:     ['Severe', 'Moderate', 'Mild', 'None'],
  access:   ['None', 'Limited', 'Adequate', 'Full'],
  lighting: ['Poor', 'Dim', 'Adequate', 'Optimal'],
  emotion:  ['Distressed', 'Anxious', 'Calm', 'Content'],
  curiosity:['None', 'Low', 'Moderate', 'High'],
  diet:     ['Refused', 'Partial', 'Accepted', 'Eager'],
  supp:     ['None', 'Partial', 'Most', 'Full'],
};
/* n=numeric{unit,base,dp} · s=scale{max} · l=list{options} · t=text */
const n = (unit, base, dp = 1) => ({ rt: 'numeric', unit, base, dp });
const s = (max) => ({ rt: 'scale', max });
const l = (options) => ({ rt: 'list', options });
const t = () => ({ rt: 'text' });
const CATALOGUE = [
  { cat: 'Physical Health', color: '#FA6140', types: [
    { q: 'Weight', ...n('kg', 22) }, { q: 'Temperature', ...n('°C', 38.5) }, { q: 'Heart Rate', ...n('bpm', 80, 0) },
    { q: 'Body Condition Score', ...s(9) }, { q: 'Hydration Status', ...s(5) },
    { q: 'Eye Condition', ...l(OPT.quality) }, { q: 'Ear Condition', ...l(OPT.quality) }, { q: 'Oral Health', ...l(OPT.quality) },
    { q: 'Posture', ...l(OPT.quality) }, { q: 'Mobility', ...l(OPT.quality) },
    { q: 'Injury Assessment', ...t() }, { q: 'Veterinary Notes', ...t() },
  ] },
  { cat: 'Behaviour', color: '#8479F9', types: [
    { q: 'Activity Level', ...s(10) }, { q: 'Stress Behaviour', ...s(5) },
    { q: 'Social Behaviour', ...l(OPT.social) }, { q: 'Feeding Behaviour', ...l(OPT.feeding) }, { q: 'Play Behaviour', ...l(OPT.play) },
    { q: 'Aggression', ...l(OPT.calm) }, { q: 'Enrichment Response', ...s(5) },
    { q: 'Behaviour Observation', ...t() }, { q: 'Keeper Notes', ...t() },
  ] },
  { cat: 'Environment', color: '#00AFD6', types: [
    { q: 'Ambient Temperature', ...n('°C', 24) }, { q: 'Humidity', ...n('%', 60, 0) }, { q: 'Noise Level', ...n('dB', 55, 0) },
    { q: 'Enclosure Cleanliness', ...s(5) }, { q: 'Habitat Condition', ...s(5) },
    { q: 'Water Availability', ...l(OPT.access) }, { q: 'Food Access', ...l(OPT.access) }, { q: 'Lighting Condition', ...l(OPT.lighting) },
    { q: 'Environment Observation', ...t() },
  ] },
  { cat: 'Mental Domain', color: '#E4A11B', types: [
    { q: 'Alertness', ...s(5) }, { q: 'Stress Level', ...s(5) }, { q: 'Comfort Level', ...s(5) },
    { q: 'Emotional State', ...l(OPT.emotion) }, { q: 'Curiosity', ...l(OPT.curiosity) }, { q: 'Fear Indicators', ...l(OPT.calm) },
    { q: 'Welfare Observation', ...t() }, { q: 'Mental State Notes', ...t() },
  ] },
  { cat: 'Nutrition', color: '#37BD69', types: [
    { q: 'Food Intake', ...n('g', 850, 0) }, { q: 'Water Intake', ...n('ml', 1200, 0) }, { q: 'Feeding Frequency', ...n('/day', 4, 0) },
    { q: 'Nutritional Status', ...s(5) }, { q: 'Appetite', ...l(OPT.appetite) }, { q: 'Diet Acceptance', ...l(OPT.diet) },
    { q: 'Supplement Intake', ...l(OPT.supp) }, { q: 'Feeding Observation', ...t() }, { q: 'Nutrition Notes', ...t() },
  ] },
];
const CAT_COLOR = {}; CATALOGUE.forEach(c => CAT_COLOR[c.cat] = c.color);
const CAT_DOMAINS = ['All', ...CATALOGUE.map(c => c.cat)];
const TYPE_INDEX = {};      // q → { ...type, cat, color }
CATALOGUE.forEach(c => c.types.forEach(ty => { TYPE_INDEX[ty.q] = { ...ty, cat: c.cat, color: c.color }; }));
function catType(q) { return TYPE_INDEX[q]; }

/* 8 shared sessions (newest first) — reuse HISTORY meta so dates feel real */
const CAT_SESS = [
  { date: '19 Jun 2025', time: '10:45 AM', by: 'Dr. R. Mehta' }, { date: '5 Jun 2025', time: '3:20 PM', by: 'Dr. L. Owens' },
  { date: '22 May 2025', time: '9:15 AM', by: 'S. Park' }, { date: '8 May 2025', time: '11:30 AM', by: 'J. Alvarez' },
  { date: '24 Apr 2025', time: '2:40 PM', by: 'Dr. R. Mehta' }, { date: '10 Apr 2025', time: '10:05 AM', by: 'Dr. L. Owens' },
  { date: '27 Mar 2025', time: '4:05 PM', by: 'S. Park' }, { date: '13 Mar 2025', time: '9:50 AM', by: 'J. Alvarez' },
];
const CAT_NOTES = [
  'Bright and responsive during the session; engaged well with surroundings.',
  'Calm and settled. No abnormal findings noted on observation.',
  'Slight reduction in activity observed; monitoring over the coming days.',
  'Good interaction with the group; condition stable since last check.',
  'Recovered well; feeding and movement consistent throughout.',
  'Baseline observation recorded on intake to the section.',
];
function catSeed(str) { let h = 7; for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0; return h; }
/* chronological values (oldest→newest, length 8); cached per type */
const _catCache = {};
function catChron(q) {
  if (_catCache[q]) return _catCache[q];
  const ty = catType(q); if (!ty) return [];
  const N = CAT_SESS.length, seed = catSeed(q), out = [];
  for (let i = 0; i < N; i++) {
    const t01 = i / (N - 1);
    const wob = Math.sin((seed % 11) + i * 0.8) * 0.5 + (((seed + i * 53) % 100) / 100 - 0.5);
    if (ty.rt === 'numeric') {
      const span = Math.max(0.4, Math.abs(ty.base) * 0.05);
      let v = ty.base * (1 + 0.05 * (t01 - 0.5) * 2) + wob * span;
      out.push(+v.toFixed(ty.dp));
    } else if (ty.rt === 'scale') {
      let v = 1 + (ty.max - 1) * (0.45 + 0.4 * t01) + wob * (ty.max * 0.12);
      out.push(Math.max(1, Math.min(ty.max, Math.round(v))));
    } else if (ty.rt === 'list') {
      const li = ty.options.length;
      let idx = Math.round((li - 1) * (0.35 + 0.45 * t01) + wob * 0.9);
      out.push(ty.options[Math.max(0, Math.min(li - 1, idx))]);
    } else {
      out.push(CAT_NOTES[(seed + i) % CAT_NOTES.length]);
    }
  }
  return (_catCache[q] = out);
}
/* newest-first values aligned to CAT_SESS */
function catNewest(q) { return catChron(q).slice().reverse(); }

/* ---- page state (filter context persists across tabs) -------------------- */
/* Only 3 tabs — Analytics + Notes content live as scrollable Overview sections */
let AA_TAB = 'overview';
let AA_FILTER = 'Week';
let AA_HIST_TYPE = 'All';
let AA_CMP_MODE = 'prev';
let AA_CMP_A = HISTORY[0].id, AA_CMP_B = HISTORY[1].id;
const AA_TABLIST = [
  { key: 'overview', label: 'Overview' },
  { key: 'history', label: 'History' },
  { key: 'comparison', label: 'Comparison' },
  { key: 'schedule', label: 'Schedule' },
];
let AA_FIELD = 'Weight';        // selected metric in the Assessment Trend card
let MD_FILTER = 'D';            // D/W/M/6M/Y in the See More Data drill-down
let AA_OV_MODE = 'detailed';    // Overview layout: 'summary' (V1 chip container) | 'detailed' (V2 metric cards)
function setOvMode(m) { AA_OV_MODE = m; render2(); }
const TREND_FIELDS = [
  { q: 'Weight', label: 'Weight' }, { q: 'Temperature', label: 'Temperature' },
  { q: 'Body Condition Score', label: 'Body Score' }, { q: 'Activity Level', label: 'Activity' },
  { q: 'Appetite', label: 'Appetite' }, { q: 'Welfare Observation', label: 'Welfare' },
];
const TEAL = '#00ABAB';
/* catalogue-backed: a "trend item" is the type's definition + its latest value */
function trendItem(q) { const ty = catType(q); if (!ty) return HISTORY[0].items.find(it => it.q === q); return { ...ty, value: catNewest(q)[0] }; }
/* switch trend field WITHOUT a full re-render (preserves scroll position) */
function setAaField(q) {
  AA_FIELD = q;
  const h = document.getElementById('aaOvHost');
  if (h) h.innerHTML = aaTrend() + aaLatest(); else render2();
}
/* ---- bottom-sheet kit (index 2 had none); sheet overlays the phone frame ---- */
function sheetHost2() {
  let s = document.getElementById('sheet2-scrim');
  if (!s) {
    s = document.createElement('div'); s.id = 'sheet2-scrim'; s.className = 'sheet2-scrim';
    s.addEventListener('click', e => { if (e.target === s) closeSheet2(); });
    (document.querySelector('.phone') || document.body).appendChild(s);
  }
  return s;
}
function openSheet2(html) { const s = sheetHost2(); s.innerHTML = `<div class="sheet2">${html}</div>`; s.classList.add('open'); }
function closeSheet2() { const s = document.getElementById('sheet2-scrim'); if (s) { s.classList.remove('open'); s.innerHTML = ''; } }
/* "See More Data" → bottom sheet (NOT a separate page) */
function openMetric(q) { MD_FILTER = 'D'; openSheet2(metricSheetHTML(q)); }
function setMdFilter(q, f) {
  MD_FILTER = f;
  const host = document.getElementById('mdSheetBody');
  if (host) host.innerHTML = metricSheetInner(q); else openSheet2(metricSheetHTML(q));
}

function setAaTab(k) { AA_TAB = k; hideAssessTip(); render2(); }
function setAaFilter(f) { AA_FILTER = f; ASSESS_SEG = f; hideAssessTip(); render2(); }
function setHistType(t) { AA_HIST_TYPE = t; render2(); }
function setCmpMode(m) { AA_CMP_MODE = m; render2(); }
function setCmpRec(which, id) { if (which === 'a') AA_CMP_A = id; else AA_CMP_B = id; render2(); }
function openDetail(id) { hideAssessTip(); go2('assessDetail', { id }); }
/* override: carry current filter context into the analytics page */
function openAnalytics() { AA_FILTER = ASSESS_SEG; go2('assessAnalytics', { animalId: 'mk001', filter: ASSESS_SEG }); }

/* ---- small shared bits --------------------------------------------------- */
const HIST_CAT_COLOR = { Nutrition: '#37BD69', Behaviour: '#8479F9', Medical: '#00AFD6', Weight: '#FA6140', 'Body Condition': '#E4B819' };
const STATUS_COLOR = { Completed: '#37BD69', Approved: '#00B894', Draft: '#7A8684' };
function statusBadge(s) { return `<span class="stbadge" style="color:${STATUS_COLOR[s] || '#7A8684'};background:${(STATUS_COLOR[s] || '#7A8684')}1f">${s}</span>`; }
function emojiThumb(emoji, size) { return `<div class="emoji-thumb" style="width:${size}px;height:${size}px">${emoji}</div>`; }
function fmtResponse(it) {
  if (it.rt === 'numeric') return `${it.value}${it.unit}`;
  if (it.rt === 'scale')   return `${it.value} / ${it.max}`;
  return it.value;
}

/* ---- generic mini trend chart (numeric / scale analytics) ---------------- */
function metricChart(values, color) {
  const w = 326, h = 84, padX = 8, padY = 10, iw = w - padX * 2, ih = h - padY * 2;
  const lo = Math.min(...values), hi = Math.max(...values), rng = (hi - lo) || 1;
  const X = i => padX + (i / (values.length - 1)) * iw;
  const Y = v => padY + (1 - (v - lo) / rng) * ih;
  const pts = values.map((v, i) => [X(i), Y(v)]);
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    d += ` C ${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)},`
       + ` ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)},`
       + ` ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  const dots = pts.map(p => `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3" fill="#fff" stroke="${color}" stroke-width="2"/>`).join('');
  return `<svg class="mc-svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
    <path d="${d}" fill="none" stroke="${color}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>${dots}</svg>`;
}
/* extract a metric series in chronological order (oldest→newest) — catalogue-backed */
function seriesFor(q) {
  if (catType(q)) return catChron(q);
  return HISTORY.slice().reverse().map(r => r.items.find(it => it.q === q).value);
}

/* ===========================================================================
   HEADER  (animal image + name, species image + name, summary stats, types)
   =========================================================================== */
/* Figma "Details Page" header — AID top app bar */
function aidTopbar() {
  return `<div class="pg-head pg-head-plain">
    <button class="pg-back" onclick="back2()">${I2.back}</button>
    <div class="pg-aid">AID: ${ANIMAL.aid}</div>
  </div>`;
}
/* 4-stat grid (Total Records · Types · Last Recorded · Overall Welfare) */
const WELFARE = { score: 77, label: 'Good', delta: '2%' };
function aaStatGrid() {
  return `<div class="aa-grid">
    <div class="aa-st"><div class="ast-l">Total Records</div><div class="ast-v" style="color:#FA6140">4,820</div></div>
    <div class="aa-st"><div class="ast-l">Assessment Types Used</div><div class="ast-v">${ASSESS_TYPE_TAGS.length}</div></div>
    <div class="aa-st"><div class="ast-l">Last Recorded On</div><div class="ast-v sm" style="color:#00AFD6">12 Jan 2026</div></div>
    <div class="aa-st"><div class="ast-l">Overall Animal Welfare</div>
      <div class="ast-wf"><span class="wf-v">${WELFARE.score}</span><span class="wf-g">${WELFARE.label}</span><span class="wf-d">↑ ${WELFARE.delta}</span></div></div>
  </div>`;
}
/* activity chart card — Week/Month/Year inside; coral "previous" dashed line (Figma) */
function aaActivityCard() {
  const segs = ['Week', 'Month', 'Year'];
  return `<div class="assess-card" id="assessCard">
    <div class="segment" id="assessSeg">
      ${segs.map(s => `<button class="seg ${s === AA_FILTER ? 'active' : ''}" data-seg="${s}" onclick="setAaFilter('${s}')">${s}</button>`).join('')}
    </div>
    <div class="ac-wrap" id="assessChart">${assessChartSVG(AA_FILTER, '#FA6140')}</div>
    <div class="ac-tip" id="assessTip"></div>
  </div>`;
}

/* ---- global filters (Week / Month / Year / Custom Range) ----------------- */
function aaFilters() {
  const opts = ['Week', 'Month', 'Year', 'Custom'];
  return `<div class="aa-filter">
    <div class="segment seg4" id="assessSeg">
      ${opts.map(o => `<button class="seg ${o === AA_FILTER ? 'active' : ''}" data-seg="${o}" onclick="setAaFilter('${o}')">${o === 'Custom' ? 'Custom' : o}</button>`).join('')}
    </div>
    ${AA_FILTER === 'Custom' ? `<div class="range-pill">${I2.cal || '📅'} ${ASSESS.Custom.range}</div>` : ''}
  </div>`;
}

/* white-card record row + history card (shared) */
function recRow(r) {
  return `<div class="rec-row" onclick="openDetail('${r.id}')">
    <span class="rec-dot" style="background:${HIST_CAT_COLOR[r.cat] || '#7A8684'}"></span>
    <div class="rec-body"><div class="rec-t">${r.type}</div>
      <div class="rec-s">${r.date} · ${r.time} · ${r.assessor}</div></div>
    <span class="rec-chev">${I2.chevR}</span></div>`;
}

/* ===========================================================================
   OVERVIEW — single scrolling dashboard. Every chart lives on a WHITE card.
   =========================================================================== */
/* ===========================================================================
   V2 — Apple-Health-inspired dedicated metric cards (one card per assessment)
   =========================================================================== */
/* Detailed-tab domain filter state (chips come from CAT_DOMAINS, cards from CATALOGUE) */
let AA_OV_DOM = 'All';
function setOvDom(d) { AA_OV_DOM = d; render2(); }
/* numeric → smooth AREA trend line, latest point accented */
function v2Area(values, color, id) {
  const w = 132, h = 48, pad = 3, iw = w - pad * 2, ih = h - pad * 2;
  const lo = Math.min(...values), hi = Math.max(...values), rng = (hi - lo) || 1;
  const X = i => pad + (i / (values.length - 1)) * iw, Y = v => pad + (1 - (v - lo) / rng) * ih;
  const pts = values.map((v, i) => [X(i), Y(v)]), line = smoothPath2(pts), last = pts[pts.length - 1];
  const area = `${line} L${last[0].toFixed(1)} ${h} L${pts[0][0].toFixed(1)} ${h} Z`;
  return `<svg class="v2-area" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity=".2"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>
    <path class="v2-fill" d="${area}" fill="url(#${id})"/><path class="v2-line" d="${line}" fill="none" stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    <circle class="v2-dot" cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="3" fill="${color}"/></svg>`;
}
/* scale → mini bar chart, final (latest) bar accented */
function v2Bars(values, color) {
  const n = values.length, w = 132, h = 48, gap = 4, bw = (w - gap * (n - 1)) / n;
  const lo = Math.min(...values), hi = Math.max(...values), rng = (hi - lo) || 1;
  const bars = values.map((v, i) => {
    const bh = 8 + ((v - lo) / rng) * (h - 8), x = i * (bw + gap), y = h - bh;
    const fill = i === n - 1 ? color : '#E3E8EA';
    return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" rx="3" fill="${fill}" style="animation-delay:${(i * 0.05).toFixed(2)}s"/>`;
  }).join('');
  return `<svg class="v2-bars" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">${bars}</svg>`;
}

/* one tappable card per metric — Apple-Health concept: colored icon + title,
   chevron top-right, hero value + insight + small date caption bottom-left,
   a DISTINCT viz per response type bottom-right (numeric→area, scale→bars,
   list→distribution, text→chips). Full analytics open on tap (openMetric). */
function v2Card(m) {
  const it = trendItem(m.q), rt = it.rt, last = CAT_SESS[0].date;
  const head = `<div class="v2-head">
    <span class="v2-name">${qLabel(m.q)}</span>
    <span class="v2-chev">${I2.chevR}</span></div>`;
  let val = '', sub = '', viz = '', when = `Last recorded · ${last}`;
  if (rt === 'numeric') {
    const s = seriesFor(m.q), cur = s[s.length - 1], prev = s[s.length - 2], d = +(cur - prev).toFixed(1), flat = Math.abs(d) < 0.01, up = d > 0;
    val = `<span class="v2-val">${cur}<small>${it.unit}</small></span>`;
    sub = `<div class="v2-sub ${flat ? 'eq' : up ? 'up' : 'dn'}">${flat ? '→ Stable' : (up ? '↑ +' : '↓ ') + Math.abs(d) + ' ' + it.unit}</div>`;
    viz = v2Area(s, m.color, 'va' + m.q.replace(/\W/g, ''));
  } else if (rt === 'scale') {
    const s = seriesFor(m.q), cur = s[s.length - 1], prev = s[s.length - 2], d = cur - prev, flat = d === 0, up = d > 0;
    val = `<span class="v2-val">${cur}<small>/ ${it.max}</small></span>`;
    sub = `<div class="v2-sub ${flat ? 'eq' : up ? 'up' : 'dn'}">${flat ? '→ Stable' : up ? '↑ Improved' : '↓ Declined'}</div>`;
    viz = v2Bars(s, m.color);
  } else if (rt === 'list') {
    const vals = seriesFor(m.q), cur = vals[vals.length - 1];
    const dist = {}; it.options.forEach(o => dist[o] = 0); vals.forEach(v => dist[v]++);
    const total = vals.length, freq = Object.entries(dist).sort((a, b) => b[1] - a[1])[0][0];
    val = `<span class="v2-val text">${cur}</span>`;
    sub = `<div class="v2-sub muted">Most frequent · ${freq}</div>`;
    const rows = it.options.map(o => ({ o, n: dist[o] })).sort((a, b) => b.n - a.n).slice(0, 3);
    viz = `<div class="v2-dist">${rows.map(r => `<div class="v2-dist-bar"><i style="width:${Math.round(r.n / total * 100)}%;background:${r.o === cur ? m.color : '#C9D2D6'}"></i></div>`).join('')}</div>`;
  } else {
    val = `<span class="v2-val">${CAT_SESS.length}<small>notes</small></span>`;
    sub = `<div class="v2-sub muted">Observation journal</div>`;
    viz = `<div class="v2-chips">${['Active', 'Eating well', 'Alert'].map(h => `<span class="v2-chip">${h}</span>`).join('')}</div>`;
  }
  return `<div class="v2-card" onclick="openMetric('${m.q}')">${head}
    <div class="v2-foot"><div class="v2-lead">${val}${sub}<div class="v2-when">${when}</div></div><div class="v2-viz">${viz}</div></div></div>`;
}
function aaOverview() {
  const mode = AA_OV_MODE || 'detailed';
  const toggle = `<div class="segment v2-toggle">
    <button class="seg ${mode === 'summary' ? 'active' : ''}" onclick="setOvMode('summary')">Summary</button>
    <button class="seg ${mode === 'detailed' ? 'active' : ''}" onclick="setOvMode('detailed')">Detailed</button></div>`;
  const metricSearch = `<div class="hist-search v2-search"><span class="hs-box">${I2.search}<input class="hs-in" type="text" placeholder="Search metrics" oninput="searchFilter(this,'.v2-card')"></span></div>`;
  const domChips = `<div class="tchip-row v2-doms">${CAT_DOMAINS.map(d =>
    `<button class="tchip ${d === AA_OV_DOM ? 'active' : ''}" onclick="setOvDom('${d}')">${d}</button>`).join('')}</div>`;
  const cats = AA_OV_DOM === 'All' ? CATALOGUE : CATALOGUE.filter(c => c.cat === AA_OV_DOM);
  const showLabels = AA_OV_DOM === 'All';
  const cards = cats.map(c =>
    (showLabels ? `<div class="v2-catlabel">${c.cat}</div>` : '') + c.types.map(ty => v2Card({ q: ty.q, color: c.color })).join('')
  ).join('');
  const body = mode === 'summary'
    ? `<div id="aaOvHost">${aaTrend()}${aaLatest()}</div>`
    : `<div data-searchbox>${metricSearch}${domChips}<div class="v2-list">${cards}</div><div class="ls-empty">No matching metrics</div></div>`;
  return toggle + body;
}

/* Assessment Trend — field chips → selected metric value · trend · "See More Data" */
function aaTrend() {
  const q = AA_FIELD, it = trendItem(q), rt = it.rt;
  const chips = `<div class="trend-chips">${TREND_FIELDS.map(f =>
    `<button class="tc ${f.q === q ? 'active' : ''}" onclick="setAaField('${f.q}')">${f.label}</button>`).join('')}</div>`;
  let valHTML = '', viz = '';
  if (rt === 'numeric') {
    const s = seriesFor(q), cur = s[s.length - 1], prev = s[s.length - 2];
    const d = +(cur - prev).toFixed(1), up = d > 0, flat = Math.abs(d) < 0.01, pct = prev ? Math.round((cur - prev) / prev * 100) : 0;
    valHTML = `<span class="tv">${cur}<small> ${it.unit}</small></span><span class="td ${flat ? 'eq' : up ? 'up' : 'dn'}">${flat ? '→ stable' : (up ? '▲ +' : '▼ ') + Math.abs(pct) + '%'}</span>`;
    viz = lineInteractive('tlc', s, TEAL, { area: true, h: 120, labels: trendLabels(), valStrs: s.map(v => v + ' ' + it.unit) });
  } else if (rt === 'scale') {
    const s = seriesFor(q), cur = s[s.length - 1], prev = s[s.length - 2], d = cur - prev, up = d > 0, flat = d === 0;
    valHTML = `<span class="tv">${cur}<small>/${it.max}</small></span><span class="td ${flat ? 'eq' : up ? 'up' : 'dn'}">${flat ? '→ stable' : (up ? '▲ +' + d : '▼ ' + d)}</span>`;
    viz = lineInteractive('tlc', s, TEAL, { area: true, h: 120, labels: trendLabels(), valStrs: s.map(v => v + '/' + it.max) });
  } else if (rt === 'list') {
    const vals = seriesFor(q);
    const cur = vals[vals.length - 1], prev = vals[vals.length - 2], up = it.options.indexOf(cur) >= it.options.indexOf(prev);
    valHTML = `<span class="tv">${cur}</span><span class="td ${up ? 'up' : 'dn'}">${up ? '▲ Improving' : '▼ Declining'}</span>`;
    const last4 = vals.slice(-4);
    viz = `<div class="jrny">${last4.map((v, i) => (i ? '<span class="jr-arr">→</span>' : '') + `<span class="jr-step ${i === last4.length - 1 ? 'cur' : ''}">${v}</span>`).join('')}</div>`;
  } else {
    valHTML = `<span class="tv" style="font-size:22px">${HISTORY.length} entries</span><span class="td up">✦ latest today</span>`;
    viz = `<div class="oh-row">${['Active', 'Eating Well', 'Social', 'Alert', 'Playful'].map(h => `<span class="oh-c">✦ ${h}</span>`).join('')}</div>`;
  }
  return `<div class="wcard">
    <div class="wc-title">Assessment Trend</div>
    ${chips}
    <div class="trend-val">${valHTML}</div>
    ${viz}
    <button class="see-more" onclick="openMetric('${q}')">See More Data ${I2.chevR}</button>
  </div>`;
}

/* Latest Record — selected metric's latest vs previous reading */
function aaLatest() {
  const q = AA_FIELD, a = HISTORY[0].items.find(x => x.q === q), b = HISTORY[1].items.find(x => x.q === q), rt = a.rt;
  let latest, prev;
  if (rt === 'numeric') { latest = `${a.value} ${a.unit}`; prev = `${b.value} ${b.unit}`; }
  else if (rt === 'scale') { latest = `${a.value}/${a.max}`; prev = `${b.value}/${b.max}`; }
  else if (rt === 'list') { latest = a.value; prev = b.value; }
  else { latest = HISTORY[0].date.replace(/ 20\d\d/, ''); prev = HISTORY[1].date.replace(/ 20\d\d/, ''); }
  return `<div class="wcard">
    <div class="wc-title">Latest Record</div>
    <div class="lr-grid">
      <div class="lr-box"><div class="lr-l">Latest</div><div class="lr-v">${latest}</div></div>
      <div class="lr-box"><div class="lr-l">Previous</div><div class="lr-v prev">${prev}</div></div>
    </div>
  </div>`;
}

/* ===========================================================================
   HISTORY — chronological, type-filterable → Assessment Detail
   =========================================================================== */
const HIST_FILTERS = ['All', 'Physical Health', 'Behaviour', 'Environment'];
const Q_LABEL = { 'Body Condition': 'Body Score', 'Activity Level': 'Activity', 'Observation Notes': 'Environment' };
function qLabel(q) { return Q_LABEL[q] || q; }
/* feed = readings grouped by domain (Physical Health / Behaviour / Environment) */
const FEED_DEF = [
  { q: 'Weight', dom: 'Physical Health' }, { q: 'Weight', dom: 'Physical Health' },
  { q: 'Observation Notes', dom: 'Environment' }, { q: 'Weight', dom: 'Physical Health' },
  { q: 'Body Condition', dom: 'Physical Health' }, { q: 'Observation Notes', dom: 'Environment' },
  { q: 'Activity Level', dom: 'Behaviour' }, { q: 'Appetite', dom: 'Behaviour' },
  { q: 'Observation Notes', dom: 'Environment' }, { q: 'Temperature', dom: 'Physical Health' },
];
function buildFeed() {
  return FEED_DEF.map((d, i) => {
    const r = HISTORY[i % HISTORY.length], it = r.items.find(x => x.q === d.q);
    return { q: d.q, label: qLabel(d.q), dom: d.dom, rt: it.rt, value: it.value, unit: it.unit, max: it.max, by: r.assessor, date: r.date, time: r.time, id: r.id };
  });
}
const HS_FILT_ICON = '<svg viewBox="0 0 24 24" fill="none"><path d="M4 7h9M19 7h1M4 17h1M11 17h9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="16" cy="7" r="2.4" stroke="currentColor" stroke-width="1.8"/><circle cx="8" cy="17" r="2.4" stroke="currentColor" stroke-width="1.8"/></svg>';
/* generic in-place list search — filters items inside the nearest [data-searchbox] by text */
function listSearch(sel, ph) {
  return `<div class="ls-search"><span class="ls-ic">${I2.search}</span><input class="ls-in" type="text" placeholder="${ph || 'Search'}" oninput="searchFilter(this,'${sel}')"></div>`;
}
function searchFilter(inp, sel) {
  const q = inp.value.trim().toLowerCase(), box = inp.closest('[data-searchbox]'); if (!box) return;
  let shown = 0;
  box.querySelectorAll(sel).forEach(el => { const m = !q || el.textContent.toLowerCase().includes(q); el.style.display = m ? '' : 'none'; if (m) shown++; });
  const e = box.querySelector('.ls-empty'); if (e) e.style.display = shown ? 'none' : 'block';
}
function aaHistory() {
  const chips = HIST_FILTERS.map(t =>
    `<button class="tchip ${t === AA_HIST_TYPE ? 'active' : ''}" onclick="setHistType('${t}')">${t}</button>`).join('');
  const search = `<div class="hist-search"><span class="hs-box">${I2.search}<input class="hs-in" type="text" placeholder="Search" oninput="searchFilter(this,'.feed-card')"></span><button class="hs-filt">${HS_FILT_ICON}</button></div>`;
  let feed = buildFeed();
  if (AA_HIST_TYPE !== 'All') feed = feed.filter(f => f.dom === AA_HIST_TYPE);
  const cards = feed.length ? feed.map(f => {
    const val = f.rt === 'text'
      ? `<div class="fc-note">${f.value}</div>`
      : `<div class="fc-val">${f.rt === 'numeric' ? f.value + ' ' + f.unit : f.rt === 'scale' ? f.value + ' / ' + f.max : f.value}</div>`;
    const tap = f.rt === 'text' ? `openDetail('${f.id}')` : `openMetric('${f.q}')`;
    return `<div class="feed-card" onclick="${tap}">
      <div class="fc-body"><div class="fc-cat">${f.label}</div>${val}
        <div class="fc-meta">${f.by} · ${f.date} · ${f.time}</div></div>
      <span class="fc-chev">${I2.chevR}</span></div>`;
  }).join('')
    : `<div class="muted" style="text-align:center;padding:34px 16px">No ${AA_HIST_TYPE} records in this period.</div>`;
  return `<div class="tchip-row">${chips}</div><div data-searchbox>${search}<div class="feed-list">${cards}</div><div class="ls-empty">No matching records</div></div>`;
}

/* ===========================================================================
   TAB 3 — COMPARISON  (HERO feature)
   =========================================================================== */
function aiSummary(a, b) {
  const out = [];
  a.items.forEach(it => {
    const pv = b.items.find(x => x.q === it.q); if (!pv) return;
    if (it.rt === 'numeric') {
      const d = +(it.value - pv.value).toFixed(1);
      if (d !== 0) out.push(`${it.q} ${d > 0 ? 'increased' : 'decreased'} from ${pv.value}${it.unit} to ${it.value}${it.unit}.`);
    } else if (it.rt === 'scale') {
      const d = it.value - pv.value;
      if (d !== 0) out.push(`${it.q.toLowerCase().includes('body') ? 'Body condition' : it.q} ${d > 0 ? 'increased' : 'decreased'} from ${pv.value} to ${it.value}.`);
    } else if (it.rt === 'list') {
      if (it.value !== pv.value) {
        const imp = it.options.indexOf(it.value) > it.options.indexOf(pv.value);
        out.push(`${it.q} ${imp ? 'improved' : 'changed'} from ${pv.value} to ${it.value}.`);
      }
    } else if (it.rt === 'text') {
      if (it.value !== pv.value) out.push(`Observation notes were updated — latest entry notes ${it.value.split('.')[0].toLowerCase()}.`);
    }
  });
  if (!out.length) out.push('No significant changes since the previous assessment.');
  return out;
}
function cmpRowFor(itA, itB) {
  let valueHTML = '', deltaHTML = '';
  if (itA.rt === 'numeric' || itA.rt === 'scale') {
    const d = +(itA.value - itB.value).toFixed(1), unit = itA.unit || '', dir = d > 0 ? 'up' : d < 0 ? 'dn' : 'eq';
    deltaHTML = `<span class="cmp-delta ${dir}">${dir === 'up' ? '↑ ' : dir === 'dn' ? '↓ ' : ''}${d > 0 ? '+' : ''}${d}${unit}</span>`;
    valueHTML = `<span class="cmp-prev">${itB.value}${unit}</span><span class="cmp-arrow">»</span><span class="cmp-cur">${itA.value}${unit}</span>`;
  } else {
    const changed = itA.value !== itB.value;
    deltaHTML = `<span class="cmp-delta ${changed ? 'up' : 'eq'}">${changed ? 'Changed' : 'Same'}</span>`;
    valueHTML = `<span class="cmp-prev">${itB.value}</span><span class="cmp-arrow">»</span><span class="cmp-cur">${itA.value}</span>`;
  }
  return `<div class="cmp-card">
    <div class="cmp-head"><span class="cmp-q">${qLabel(itA.q)}</span>${deltaHTML}</div>
    <div class="cmp-val">${valueHTML}</div>
  </div>`;
}
function rtLabel(rt) { return { numeric: 'Numeric Value', scale: 'Numeric Scale', list: 'List', text: 'Text' }[rt] || rt; }
function cmpTextCard(itA, itB) {
  return `<div class="cmp-card">
    <div class="cmp-head"><span class="cmp-q">${qLabel(itA.q)}</span></div>
    <div class="cmp-tblock"><div class="cmp-tlab">Previous</div><div class="cmp-tbox prev">${itB.value}</div></div>
    <div class="cmp-tblock"><div class="cmp-tlab">Current</div><div class="cmp-tbox cur">${itA.value}</div></div>
  </div>`;
}
function aaComparison() {
  let a, b;
  if (AA_CMP_MODE === 'prev') { a = HISTORY[0]; b = HISTORY[1]; }
  else { a = recById2(AA_CMP_A); b = recById2(AA_CMP_B); }
  const opt = sel => HISTORY.map(r => `<option value="${r.id}" ${r.id === sel ? 'selected' : ''}>${r.date} · ${r.time}</option>`).join('');
  const selector = AA_CMP_MODE === 'custom' ? `
    <div class="cmp-selects">
      <label>Record A<select onchange="setCmpRec('a',this.value)">${opt(AA_CMP_A)}</select></label>
      <label>Record B<select onchange="setCmpRec('b',this.value)">${opt(AA_CMP_B)}</select></label>
    </div>` : `
    <div class="cmp-context"><span>Current · ${a.date}</span><span class="cmp-vs">vs</span><span>Previous · ${b.date}</span></div>`;

  const rows = a.items.map(itA => {
    const itB = b.items.find(x => x.q === itA.q);
    return itA.rt === 'text' ? cmpTextCard(itA, itB) : cmpRowFor(itA, itB);
  }).join('');

  return `
    <div class="segment" id="cmpSeg">
      <button class="seg ${AA_CMP_MODE === 'prev' ? 'active' : ''}" onclick="setCmpMode('prev')">Current vs Previous</button>
      <button class="seg ${AA_CMP_MODE === 'custom' ? 'active' : ''}" onclick="setCmpMode('custom')">Custom</button>
    </div>
    ${selector}
    <div class="cmp-list">${rows}</div>`;
}

/* ===========================================================================
   TAB 4 — ANALYTICS  (adapts by response type; never assumes scores)
   =========================================================================== */
/* ----- Response Analytics blocks (each on its own WHITE card) ------------- */
function statBox(lab, val) { return `<div class="mini-stat"><div class="ms-v">${val}</div><div class="ms-l">${lab}</div></div>`; }
function wcHead(title, sub, tag) {
  return `<div class="wc-head"><div><div class="wc-title">${title}</div><div class="wc-sub">${sub}</div></div><span class="rt-tag">${tag}</span></div>`;
}
function numericBlock(q, unit, color) {
  const s = seriesFor(q);
  const latest = s[s.length - 1], min = Math.min(...s), max = Math.max(...s);
  return `<div class="wcard">
    ${wcHead(q, `Trend · last ${s.length} records`, 'Numeric Value')}
    ${metricChart(s, color)}
    <div class="mini-stats">${statBox('Latest', latest + unit)}${statBox('Min', min + unit)}${statBox('Max', max + unit)}</div>
  </div>`;
}
function scaleBlock(q, max, color) {
  const s = seriesFor(q);
  const dist = {};
  s.forEach(v => dist[v] = (dist[v] || 0) + 1);
  const maxC = Math.max(...Object.values(dist));
  const bars = Object.keys(dist).sort((a, b) => a - b).map(k =>
    `<div class="bd-row"><div class="bd-top"><span>${k} / ${max}</span><b>${dist[k]}×</b></div>
      <div class="bd-bar"><i style="width:${Math.round(dist[k] / maxC * 100)}%;background:${color}"></i></div></div>`).join('');
  return `<div class="wcard">
    ${wcHead(q, 'Scale progression & distribution', 'Numeric Scale')}
    ${metricChart(s, color)}
    <div class="ana-sublab">Distribution</div>
    <div class="bd-list">${bars}</div>
  </div>`;
}
function listBlock(q, options, color) {
  const vals = seriesFor(q);
  const dist = {}; options.forEach(o => dist[o] = 0); vals.forEach(v => dist[v]++);
  const maxC = Math.max(...Object.values(dist), 1);
  const bars = options.map(o =>
    `<div class="bd-row"><div class="bd-top"><span>${o}</span><b>${dist[o]}×</b></div>
      <div class="bd-bar"><i style="width:${Math.round(dist[o] / maxC * 100)}%;background:${color}"></i></div></div>`).join('');
  const hist = HISTORY.slice(0, 5).map(r => `<span class="freq-pill">${r.items.find(it => it.q === q).value}</span>`).join('<span class="freq-arrow">←</span>');
  return `<div class="wcard">
    ${wcHead(q, 'Distribution & frequency', 'List')}
    <div class="bd-list">${bars}</div>
    <div class="ana-sublab">Historical Changes</div>
    <div class="freq-row">${hist}</div>
  </div>`;
}
function textBlock(q) {
  const tv = catNewest(q);
  const items = CAT_SESS.map((r, i) => ({ date: r.date, by: r.by, text: tv[i] }));
  const tl = items.slice(0, 3).map(x => `
    <div class="tl-item"><span class="tl-dot"></span>
      <div class="tl-body"><div class="tl-meta">${x.date} · ${x.by}</div><div class="tl-text">${x.text}</div></div></div>`).join('');
  return `<div class="wcard">
    ${wcHead(q, 'Recent observations', 'Text')}
    <div class="timeline" style="margin-top:4px">${tl}</div>
  </div>`;
}

/* ===========================================================================
   SCREEN — Analytics Detail (assembles header + filters + tabs + active body)
   =========================================================================== */
/* tabs + global filters share one sticky region so both stay pinned */
function aaStickyNav() {
  return `<div class="aa-sticky">
    ${tabsBar(AA_TABLIST, AA_TAB, 'setAaTab')}
    ${aaFilters()}
  </div>`;
}
SCREENS2.assessAnalytics = (p = {}) => {
  ASSESS_SEG = AA_FILTER;   // keep activity chart + tooltip in sync (AA_FILTER persists via setAaFilter)
  let body;
  if (AA_TAB === 'comparison') body = aaComparison();
  else if (AA_TAB === 'history') body = aaHistory();
  else if (AA_TAB === 'schedule') body = aaSchedule();
  else body = aaOverview();
  return `<div class="screen active"><div class="scroll">
    ${aidTopbar()}
    <div class="aa-context">${aaStatGrid()}${aaActivityCard()}</div>
    <div class="aa-tabwrap">${tabsBar(AA_TABLIST, AA_TAB, 'setAaTab')}
      <div class="body">${body}</div>
      <div style="height:24px"></div>
    </div>
  </div></div>`;
};

/* ===========================================================================
   SCREEN — See More Data  (drill-down; adapts to the metric's response type)
   Numeric → line + avg + Average/Min/Max + history pills
   Scale   → line + Average/Lowest/Highest + progression + history pills
   List    → distribution + Current/Most-Frequent + option pills
   Text    → search + highlights + chronological observations
   =========================================================================== */
const MD_FILT = {
  D: { n: 30, ends: ['May 10', 'May 24', 'Jun 8'] }, W: { n: 12, ends: ['Mar', 'Apr', 'Jun'] },
  M: { n: 12, ends: ['Jan', 'Apr', 'Jun'] }, '6M': { n: 26, ends: ['Jan', 'Mar', 'Jun'] }, Y: { n: 12, ends: ['Jul', 'Dec', 'Jun'] },
};
function mdSeed(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
function mdSeries(q, filter) {
  const it = trendItem(q), base = seriesFor(q), isScale = it.rt === 'scale';
  const cur = base[base.length - 1], prev = base[0], cf = MD_FILT[filter] || MD_FILT.D, n = cf.n, seed = mdSeed(q + filter);
  const span = isScale ? Math.max(0.9, it.max * 0.12) : Math.max(0.5, Math.abs(cur) * 0.05);
  const vals = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1), wob = Math.sin((seed % 9) + i * 0.85) * 0.6 + ((((seed + i * 97) % 100) / 100) - 0.5);
    let v = prev + (cur - prev) * t + wob * span;
    if (isScale) v = Math.max(0.6, Math.min(it.max + 0.4, v));
    vals.push(+v.toFixed(isScale ? 2 : 1));
  }
  vals[n - 1] = cur;
  return { values: vals, ends: cf.ends, labels: mdLabels(filter, n), avg: +(vals.reduce((a, b) => a + b, 0) / n).toFixed(1) };
}
const MD_MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function mdLabels(filter, n) {
  if (filter === 'D') return Array.from({ length: n }, (_, i) => { const d = 10 + i; return d <= 31 ? 'May ' + d : 'Jun ' + (d - 31); });
  if (filter === 'W' || filter === '6M') return Array.from({ length: n }, (_, i) => 'Week ' + (i + 1));
  return Array.from({ length: n }, (_, i) => MD_MON[(6 + i) % 12]);
}
function mdChart(values, color, avg, ends) {
  const W = 340, H = 188, pl = 8, pr = 10, pt = 20, pb = 26, iw = W - pl - pr, ih = H - pt - pb;
  const lo = Math.min(...values, avg), hi = Math.max(...values, avg), pad = (hi - lo || 1) * 0.14, L = lo - pad, rng = (hi + pad - L) || 1;
  const X = i => pl + (i / (values.length - 1)) * iw, Y = v => pt + (1 - (v - L) / rng) * ih;
  const pts = values.map((v, i) => [X(i), Y(v)]), ay = Y(avg);
  const xs = [[pl, ends[0], 'start'], [pl + iw / 2, ends[1], 'middle'], [pl + iw, ends[2], 'end']]
    .map(([x, t, a]) => `<text x="${x.toFixed(1)}" y="${H - 8}" text-anchor="${a}" font-size="11" fill="#7A8684" font-weight="600">${t}</text>`).join('');
  return `<svg class="md-chart" viewBox="0 0 ${W} ${H}" style="width:100%;display:block">
    <line x1="${pl}" y1="${ay.toFixed(1)}" x2="${pl + iw}" y2="${ay.toFixed(1)}" stroke="#C8D2CE" stroke-width="1.2" stroke-dasharray="5 5"/>
    <text x="${pl + 2}" y="${(ay - 6).toFixed(1)}" font-size="11" fill="#7A8684" font-weight="700">avg ${avg}</text>
    <path d="${smoothPath2(pts)}" fill="none" stroke="${color}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>${xs}</svg>`;
}
/* ---- interactive line chart: touch/hover scrubber (guide line + dot + tooltip) ---- */
function trendLabels() { return CAT_SESS.slice().reverse().map(s => s.date); }
function lineInteractive(id, values, color, opts) {
  opts = opts || {};
  const axes = !!opts.axes;
  const W = 340, H = opts.h || 188;
  const pl = axes ? 30 : 8, pr = 12, pt = (opts.avg != null || axes) ? 18 : 14, pb = (opts.ends || axes) ? 28 : 12, iw = W - pl - pr, ih = H - pt - pb;
  const avg = opts.avg, ends = opts.ends, labels = opts.labels || values.map((_, i) => String(i + 1)), valStrs = opts.valStrs || values.map(String);
  let lo = Math.min(...values), hi = Math.max(...values);
  if (avg != null) { lo = Math.min(lo, avg); hi = Math.max(hi, avg); }
  const pad = (hi - lo || 1) * 0.14, L = lo - pad, rng = (hi + pad - L) || 1;
  const X = i => pl + (i / (values.length - 1)) * iw, Y = v => pt + (1 - (v - L) / rng) * ih;
  const pts = values.map((v, i) => [X(i), Y(v)]);
  window['__LC_' + id] = { W, xs: pts.map(p => +p[0].toFixed(2)), ys: pts.map(p => +p[1].toFixed(2)), labels, valStrs };
  // X + Y axes (every tick labelled)
  let grid = '', xsEl = '';
  if (axes) {
    for (let k = 0; k <= 4; k++) {
      const val = L + rng * k / 4, y = pt + (1 - k / 4) * ih;
      grid += `<line x1="${pl}" y1="${y.toFixed(1)}" x2="${W - pr}" y2="${y.toFixed(1)}" stroke="#E2E8E5" stroke-width="1"/>`
        + `<text x="${pl - 6}" y="${(y + 3).toFixed(1)}" text-anchor="end" font-size="9.5" fill="#7A8684">${rng >= 4 ? Math.round(val) : Math.round(val * 10) / 10}</text>`;
    }
    const step = Math.max(1, Math.round((values.length - 1) / 6));
    for (let i = 0; i < values.length; i += step) xsEl += `<text x="${X(i).toFixed(1)}" y="${H - 9}" text-anchor="middle" font-size="9.5" fill="#7A8684" font-weight="600">${labels[i]}</text>`;
  } else if (ends) {
    xsEl = [[pl, ends[0], 'start'], [pl + iw / 2, ends[1], 'middle'], [pl + iw, ends[2], 'end']].map(([x, t, a]) => `<text x="${x.toFixed(1)}" y="${H - 8}" text-anchor="${a}" font-size="11" fill="#7A8684" font-weight="600">${t}</text>`).join('');
  }
  let defs = '', areaEl = '';
  if (opts.area) {
    defs = `<defs><linearGradient id="${id}_g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity=".18"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>`;
    areaEl = `<path d="M${pts[0][0].toFixed(1)} ${pt + ih} ${pts.map(p => 'L' + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ')} L${pts[pts.length - 1][0].toFixed(1)} ${pt + ih} Z" fill="url(#${id}_g)"/>`;
  }
  let avgEl = '';
  if (avg != null) { const ay = Y(avg); avgEl = `<line x1="${pl}" y1="${ay.toFixed(1)}" x2="${pl + iw}" y2="${ay.toFixed(1)}" stroke="#A9C3B8" stroke-width="1.2" stroke-dasharray="5 5"/><text x="${pl + 2}" y="${(ay - 6).toFixed(1)}" font-size="11" fill="#5C6B63" font-weight="700">avg ${avg}</text>`; }
  return `<div class="lc-wrap"><div class="lc-tip" id="${id}_tip"></div>
    <svg id="${id}_svg" class="lc-svg" viewBox="0 0 ${W} ${H}" style="width:100%;display:block">
      ${defs}${grid}${areaEl}${avgEl}
      <path d="${smoothPath2(pts)}" fill="none" stroke="${color}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>${xsEl}
      <line id="${id}_cl" x1="0" y1="${pt}" x2="0" y2="${pt + ih}" stroke="${color}" stroke-width="1.2" stroke-dasharray="3 3" style="opacity:0"/>
      <circle id="${id}_cd" r="5" fill="${color}" stroke="#fff" stroke-width="2.5" style="opacity:0"/>
      <rect x="${pl}" y="${pt}" width="${iw}" height="${ih}" fill="transparent" style="cursor:crosshair"
        onpointerdown="lcMove(event,'${id}')" onpointermove="lcMove(event,'${id}')" onpointerleave="lcLeave('${id}')"/>
    </svg></div>`;
}
function lcMove(e, id) {
  const C = window['__LC_' + id], svg = document.getElementById(id + '_svg'); if (!C || !svg) return;
  const r = svg.getBoundingClientRect(), vx = (e.clientX - r.left) / r.width * C.W;
  let idx = 0, best = 1e9; for (let i = 0; i < C.xs.length; i++) { const dd = Math.abs(C.xs[i] - vx); if (dd < best) { best = dd; idx = i; } }
  const cl = document.getElementById(id + '_cl'), cd = document.getElementById(id + '_cd'), tip = document.getElementById(id + '_tip');
  if (cl) { cl.setAttribute('x1', C.xs[idx]); cl.setAttribute('x2', C.xs[idx]); cl.style.opacity = '.45'; }
  if (cd) { cd.setAttribute('cx', C.xs[idx]); cd.setAttribute('cy', C.ys[idx]); cd.style.opacity = '1'; }
  if (tip) { tip.innerHTML = `<b>${C.valStrs[idx]}</b><i>${C.labels[idx]}</i>`; tip.style.display = 'block'; tip.style.left = Math.max(34, Math.min(C.xs[idx] / C.W * r.width, r.width - 34)) + 'px'; }
}
function lcLeave(id) { ['_cl', '_cd'].forEach(s => { const el = document.getElementById(id + s); if (el) el.style.opacity = '0'; }); const t = document.getElementById(id + '_tip'); if (t) t.style.display = 'none'; }
function mdStats(pairs) {
  return `<div class="md-stats">${pairs.map(([l, v]) => `<div class="md-s"><div class="md-sl">${l}</div><div class="md-sv">${v}</div></div>`).join('')}</div>`;
}
function mdHist(q, fmt) {
  const vals = catNewest(q);
  const rows = CAT_SESS.map((r, i) => {
    const v = vals[i], bg = i === 0 ? '#37BD69' : (i === 1 ? '#D4EFDF' : '#EEF3F1'), fg = i === 0 ? '#fff' : (i === 1 ? '#1B6B43' : '#44544A');
    return `<div class="md-hrow"><div class="md-meta"><div class="mh-t">${r.time}</div><div class="mh-d">${r.date}</div><div class="mh-a">${r.by}</div></div>
      <div class="md-pill" style="background:${bg};color:${fg}">${fmt(v)}</div></div>`;
  }).join('');
  return `<div class="md-sname">${q} History</div><div class="md-hist">${rows}</div>`;
}
/* --- sheet building blocks (Figma: white header + white chart section, mint lower w/ white cards) --- */
function msFlt(q) {
  return `<div class="segment seg5 ms-flt">${['D', 'W', 'M', '6M', 'Y'].map(f =>
    `<button class="seg ${f === MD_FILTER ? 'active' : ''}" onclick="setMdFilter('${q}','${f}')">${f}</button>`).join('')}</div>`;
}
function msStat(l, v) { return `<div class="ms-s"><div class="ms-sl">${l}</div><div class="ms-sv">${v}</div></div>`; }
function msRows(q, fmt, colFn) {
  const vals = catNewest(q);
  return CAT_SESS.map((r, i) => {
    const v = vals[i];
    const style = colFn ? `background:${colFn(v)};color:#1F515B` : `background:${i < 2 ? '#E1F9ED' : '#EFF5F2'};color:#1F515B`;
    return `<div class="ms-row"><div class="ms-meta"><div class="ms-t">${r.time}</div><div class="ms-d">${r.date}</div><div class="ms-a">${r.by}</div></div>
      <div class="ms-pill" style="${style}">${fmt(v)}</div></div>`;
  }).join('');
}
/* sheet content (filter + type-adaptive body); re-rendered in place on filter change */
function metricSheetInner(q) {
  const it = trendItem(q), rt = it.rt, flt = msFlt(q);
  if (rt === 'numeric') {
    const s = mdSeries(q, MD_FILTER), min = Math.min(...s.values), max = Math.max(...s.values);
    return `<div class="ms-white">${flt}${lineInteractive('mdc', s.values, '#FA6140', { avg: s.avg, axes: true, labels: s.labels, valStrs: s.values.map(v => v + ' ' + it.unit) })}</div>
      <div class="ms-lower">
        <div class="ms-card ms-stats">${msStat('Average', s.avg + ' ' + it.unit)}${msStat('Minimum', min + ' ' + it.unit)}${msStat('Maximum', max + ' ' + it.unit)}</div>
        <div class="ms-card" data-searchbox><div class="ms-card-t">${q} History</div>${listSearch('.ms-row')}<div class="ms-hist">${msRows(q, v => v + ' ' + it.unit)}</div><div class="ls-empty">No matching entries</div></div>
      </div>`;
  }
  if (rt === 'scale') {
    const s = mdSeries(q, MD_FILTER), vals = s.values.map(v => Math.round(v)), min = Math.min(...vals), max = Math.max(...vals);
    const avg = +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1), prog = seriesFor(q).slice(-4);
    return `<div class="ms-white">${flt}${lineInteractive('mdc', s.values, '#00AFD6', { avg, axes: true, labels: s.labels, valStrs: s.values.map(v => Math.round(v) + ' / ' + it.max) })}</div>
      <div class="ms-lower">
        <div class="ms-card ms-stats">${msStat('Average', avg + '/' + it.max)}${msStat('Lowest', min + '/' + it.max)}${msStat('Highest', max + '/' + it.max)}</div>
        <div class="ms-card"><div class="ms-card-t">Scale Progression</div>
          <div class="jrny">${prog.map((v, i) => (i ? '<span class="jr-arr">→</span>' : '') + `<span class="jr-step ${i === prog.length - 1 ? 'cur' : ''}">${v}/${it.max}</span>`).join('')}</div></div>
        <div class="ms-card" data-searchbox><div class="ms-card-t">${q} History</div>${listSearch('.ms-row')}<div class="ms-hist">${msRows(q, v => Math.round(v) + ' / ' + it.max)}</div><div class="ls-empty">No matching entries</div></div>
      </div>`;
  }
  if (rt === 'list') {
    const vals = seriesFor(q);
    const dist = {}; it.options.forEach(o => dist[o] = 0); vals.forEach(v => dist[v]++);
    const maxC = Math.max(1, ...Object.values(dist)), freq = Object.entries(dist).sort((a, b) => b[1] - a[1])[0][0];
    const PAL = ['#FA6140', '#E4B819', '#7BC96A', '#37BD69'], col = o => PAL[Math.round(it.options.indexOf(o) / Math.max(1, it.options.length - 1) * 3)];
    return `<div class="ms-white">${flt}</div>
      <div class="ms-lower">
        <div class="ms-card ms-stats">${msStat('Current', it.value)}${msStat('Most Frequent', freq)}${msStat('Records', vals.length)}</div>
        <div class="ms-card"><div class="ms-card-t">Distribution</div>
          ${it.options.map(o => `<div class="bd-row"><div class="bd-top"><span>${o}</span><b>${dist[o]}×</b></div><div class="bd-bar"><i style="width:${Math.round(dist[o] / maxC * 100)}%;background:${col(o)}"></i></div></div>`).join('')}</div>
        <div class="ms-card" data-searchbox><div class="ms-card-t">${q} History</div>${listSearch('.ms-row')}<div class="ms-hist">${msRows(q, v => v, v => col(v) + '22')}</div><div class="ls-empty">No matching entries</div></div>
      </div>`;
  }
  const ntext = catNewest(q);
  const notes = CAT_SESS.map((r, i) => ({ by: r.by, date: r.date, time: r.time, text: ntext[i] }));
  return `<div class="ms-white">${flt}</div>
    <div class="ms-lower">
      <div class="ms-card"><div class="ms-card-t">Observation Highlights</div>
        <div class="oh-row">${['Active', 'Eating Well', 'Social', 'Alert', 'Playful'].map(h => `<span class="oh-c">✦ ${h}</span>`).join('')}</div></div>
      <div class="ms-card" data-searchbox><div class="ms-card-t">All Observations</div>${listSearch('.md-note', 'Search observations')}
        ${notes.map(n => `<div class="md-note"><div class="mn-m">${n.by} · ${n.date} · ${n.time}</div><div class="mn-q">"${n.text}"</div></div>`).join('')}<div class="ls-empty">No matching observations</div></div>
    </div>`;
}
function metricSheetHTML(q) {
  const title = q === 'Observation Notes' ? 'Observations' : q;
  return `<div class="ms-head"><div class="ms-title">${title}</div><button class="ms-x" onclick="closeSheet2()">✕</button></div>
    <div id="mdSheetBody">${metricSheetInner(q)}</div>`;
}

/* ===========================================================================
   SCREEN — Assessment Detail (Information · Q&R · Attachments · Notes · Audit)
   =========================================================================== */
SCREENS2.assessDetail = (p = {}) => {
  const r = recById2(p.id);
  const info = [
    ['Assessment Type', r.tmpl], ['Animal', ANIMAL.name], ['Date', r.date],
    ['Time', r.time], ['Assessor', r.assessor], ['Status', r.status],
  ];
  const qr = r.items.map(it => `
    <div class="qr-row">
      <div class="qr-q">${it.q}<span class="rt-tag">${rtLabel(it.rt)}</span></div>
      <div class="qr-a ${it.rt === 'text' ? 'text' : ''}">${fmtResponse(it)}</div>
    </div>`).join('');
  const atts = Array.from({ length: r.attachments }, (_, i) =>
    `<div class="att-thumb">${I2.photo || '🖼️'}<span>IMG_${100 + i}</span></div>`).join('');
  return `<div class="screen active"><div class="scroll">
    ${pageHeader(r.tmpl, `${r.date} · ${r.time}`)}
    <div class="body">
      <div class="card card-pad">
        <div class="sec-head"><span class="sh-icon">${I2.home}</span><span class="sh-title">Assessment Information</span></div>
        <div class="info-grid" style="margin-top:14px">${info.map(([l, v]) => field(l, v)).join('')}</div>
      </div>
      <div class="card card-pad">
        <div class="sec-head"><span class="sh-title">Questions & Responses</span></div>
        <div class="qr-list">${qr}</div>
      </div>
      <div class="card card-pad">
        <div class="sec-head"><span class="sh-title">Attachments</span></div>
        <div class="att-row">${atts || '<div class="muted">No attachments</div>'}</div>
      </div>
      <div class="card card-pad">
        <div class="sec-head"><span class="sh-title">Notes</span></div>
        <div class="dl-line" style="margin-top:10px;color:var(--on-surface-variant)">${r.items.find(it => it.q === 'Observation Notes').value}</div>
      </div>
      <div class="card card-pad">
        <div class="sec-head"><span class="sh-title">Audit Information</span></div>
        <div class="info-grid" style="margin-top:14px">
          ${field('Recorded By', r.assessor)}${field('Recorded Date', r.date)}
          ${field('Last Updated', r.date + ' · ' + r.time)}${field('Record ID', r.id)}
        </div>
      </div>
    </div><div style="height:24px"></div>
  </div></div>`;
};
