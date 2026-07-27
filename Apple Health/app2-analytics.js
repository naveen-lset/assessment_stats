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
/* n=numeric{unit,base,dp} · s=scale{max} · l=list{options} · t=text
   Optional trailing `viz` pins a non-default graph (from that rt's compatible
   set — see compatibleViz); omit it and the type falls back to defaultViz(rt). */
const n = (unit, base, dp = 1, viz) => ({ rt: 'numeric', unit, base, dp, ...(viz ? { viz } : {}) });
const s = (max, viz) => ({ rt: 'scale', max, ...(viz ? { viz } : {}) });
const l = (options, viz) => ({ rt: 'list', options, ...(viz ? { viz } : {}) });
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
const TYPE_INDEX = {};      // q → { ...type, cat, catColor, color, viz }
/* lighten(+)/darken(-) a hex colour by amt (-1..1) */
function shadeHex(hex, amt) {
  const nu = parseInt(hex.slice(1), 16); let r = (nu >> 16) & 255, g = (nu >> 8) & 255, b = nu & 255;
  if (amt >= 0) { r += (255 - r) * amt; g += (255 - g) * amt; b += (255 - b) * amt; }
  else { r *= (1 + amt); g *= (1 + amt); b *= (1 + amt); }
  return '#' + [r, g, b].map(x => Math.round(x).toString(16).padStart(2, '0')).join('');
}
/* per-type chart style + a colour that's a SHADE of its category hue
   (harmonious within a category, still distinct per type). */
/* Compatible graph sets per response type — the FIRST entry is the canonical
   default (Graph Spec V2026.06.24). This is the single source for both the
   picker options on the master and the fallback when a type declares no viz.
   `label` is the human name shown in the master graph picker. */
const GRAPHS = {
  numeric: [
    { viz: 'area',  label: 'Trend area' },
    { viz: 'line',  label: 'Trend line' },
    { viz: 'col',   label: 'Recency columns' },
  ],
  scale: [
    { viz: 'bars',  label: 'Bars vs ceiling' },
    { viz: 'gauge', label: 'Ring gauge' },
    { viz: 'lolli', label: 'Lollipop' },
    { viz: 'dots',  label: 'Dot strip' },
  ],
  list: [
    { viz: 'dist',  label: 'Distribution bars' },
    { viz: 'donut', label: 'Donut' },
  ],
  text: [],   // no chart — notes timeline only
};
/* the graphs an rt may use (array of {viz,label}); text → [] */
function compatibleViz(rt) { return GRAPHS[rt] || []; }
/* the canonical default viz for an rt ('area'/'bars'/'dist'); text → null */
function defaultViz(rt) { return (GRAPHS[rt] && GRAPHS[rt][0]) ? GRAPHS[rt][0].viz : null; }
/* display label for a viz key (falls back to the key itself) */
function vizLabel(viz) { for (const rt in GRAPHS) { const g = GRAPHS[rt].find(x => x.viz === viz); if (g) return g.label; } return viz; }
/* is `viz` valid for `rt`? (used to clear an override when rt changes) */
function vizCompatible(rt, viz) { return compatibleViz(rt).some(g => g.viz === viz); }
const SHADE_STEPS = [0, -0.16, 0.16, -0.30, 0.30, -0.08, 0.42];
/* Distinct per-metric hues so adjacent graphs never read as the same colour.
   Starts with the 5 brand category colours, then extends with more distinct
   hues; assigned by a running index so neighbouring cards always differ. */
const VIZ_PALETTE = [
  '#FA6140', '#8479F9', '#00AFD6', '#E4A11B', '#37BD69',
  '#EC4899', '#3B82F6', '#F97316', '#14B8A6', '#A855F7',
  '#84CC16', '#E11D48',
];
const HERO_TYPES = ['Weight'];                               // rendered as a prominent detail card
/* Resolve every catalogue type into TYPE_INDEX. The chart is the type's stored
   `viz` if it declares one, else the canonical default for its response type
   (defaultViz) — an explicit, per-type choice, no longer a round-robin.
   Colours stay round-robin so neighbouring cards never share a hue.
   Callable again after the master adds/edits a type. */
function buildTypeIndex() {
  let gi = 0;
  for (const k in TYPE_INDEX) delete TYPE_INDEX[k];
  CATALOGUE.forEach(c => c.types.forEach(ty => {
    const color = VIZ_PALETTE[gi++ % VIZ_PALETTE.length];
    const viz = ty.rt === 'text' ? 'chips'
      : (vizCompatible(ty.rt, ty.viz) ? ty.viz : defaultViz(ty.rt));
    TYPE_INDEX[ty.q] = { ...ty, cat: c.cat, catColor: c.color, color, viz, hero: HERO_TYPES.includes(ty.q) };
  }));
}
buildTypeIndex();
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
const USER_ENTRIES = {};   // q -> [{ value, date, time, by, note }] newest-first (user-added readings)
function catChronBase(q) {
  if (_catCache[q]) return _catCache[q];
  const ty = catType(q); if (!ty) return [];
  const N = CAT_SESS.length, seed = catSeed(q), out = [];
  // gentle, mostly-monotonic trend + a single soft sine ripple (no harsh noise)
  const dir = (seed % 2 === 0) ? 1 : -1;                 // overall up or down
  const phase = (seed % 7) * 0.5, freq = 0.55 + (seed % 3) * 0.12;
  for (let i = 0; i < N; i++) {
    const t01 = i / (N - 1);
    const ripple = Math.sin(phase + i * freq);           // smooth, ~[-1,1]
    if (ty.rt === 'numeric') {
      const span = Math.max(0.3, Math.abs(ty.base) * 0.03);
      const v = ty.base * (1 + dir * 0.035 * (t01 - 0.5) * 2) + ripple * span * 0.6;
      out.push(+v.toFixed(ty.dp));
    } else if (ty.rt === 'scale') {
      const v = 1 + (ty.max - 1) * (0.42 + 0.42 * t01) + ripple * (ty.max * 0.09);
      out.push(Math.max(1, Math.min(ty.max, Math.round(v))));
    } else if (ty.rt === 'list') {
      const li = ty.options.length;
      const idx = Math.round((li - 1) * (0.32 + 0.5 * t01) + ripple * 0.55);
      out.push(ty.options[Math.max(0, Math.min(li - 1, idx))]);
    } else {
      out.push(CAT_NOTES[(seed + i) % CAT_NOTES.length]);
    }
  }
  return (_catCache[q] = out);
}
/* base synthetic series + any user-added readings, appended as the newest values */
function catChron(q) {
  const base = catChronBase(q), u = USER_ENTRIES[q];
  return (u && u.length) ? base.concat(u.slice().reverse().map(e => e.value)) : base;
}
/* newest-first values aligned to catSessions(q) */
function catNewest(q) { return catChron(q).slice().reverse(); }
/* session meta (date/time/by) aligned to catNewest — user entries lead (newest-first) */
function catSessions(q) {
  const u = USER_ENTRIES[q];
  return (u && u.length) ? u.map(e => ({ date: e.date, time: e.time, by: e.by })).concat(CAT_SESS) : CAT_SESS;
}

/* ===========================================================================
   ASSESSMENT-TAB TYPE CONTAINERS  (Animal Profile · Assessment tab)
   Figma "Assessment" list reference: teal-banded card per assessment type,
   category filter chips on top, most-recent readings in the body. Catalogue-
   driven so it stays in sync with Detailed / History / Schedule. Tapping a
   card opens the same "See More Data" analytics sheet (openMetric).
   =========================================================================== */
/* demo recency labels for the most-recent readings (newest → older) */
const ATC_REL = ['57 Mins ago', '3h ago', 'Yesterday', '7 Days ago', '30 Days ago', '60 Days ago', '90 Days ago', '120 Days ago'];
const ATC_PLUS = '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><path d="M12 8v8M8 12h8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';

/* Assessment-tab type list — same clean metric cards as the analytics Detailed
   view (v2HeroCard / v2Card: big value + trend chart + Previous/Average/Min/Max).
   Search + category chips on top. Cards are tappable — tapping opens the regular
   "See More Data" bottom sheet (openMetric), which is where the Insights show. */
function assessTypeContainers() {
  const dom = (typeof AM_ACAT !== 'undefined') ? AM_ACAT : 'All';
  const metricSearch = `<div class="hist-search v2-search"><span class="hs-box">${I2.search}<input class="hs-in" type="text" placeholder="Search" oninput="searchFilter(this,'.v2-card')"></span></div>`;
  const domChips = `<div class="tchip-row v2-doms">${CAT_DOMAINS.map(d =>
    `<button class="tchip ${d === dom ? 'active' : ''}" onclick="setAmACat('${d}')">${d}</button>`).join('')}</div>`;
  const cats = dom === 'All' ? CATALOGUE : CATALOGUE.filter(c => c.cat === dom);
  const showLabels = dom === 'All';
  const cards = cats.map(c =>
    (showLabels ? `<div class="v2-catlabel">${c.cat}</div>` : '') +
    c.types.map(ty => {
      const t = catType(ty.q);
      return (t.hero ? v2HeroCard : v2Card)({ q: ty.q, color: t.color }, { tap: true, add: true });
    }).join('')
  ).join('');
  return `<div data-searchbox>${metricSearch}${domChips}<div class="v2-list">${cards}</div><div class="ls-empty">No matching metrics</div></div>`;
}

/* ===========================================================================
   ASSESSMENT LANDING PAGE  (Figma node 29:7518 — animal-profile Assessment tab)
   Faithful port: bordered header (type name + green category + add_circle) over
   a response-type body. Catalogue-driven — every type renders with its assigned
   graph; category chips filter. Tapping a card opens the metric sheet.
   =========================================================================== */
/* small calendar (recorded-date) icon + plain plus (listing-bar Add, node 36:9299) */
const ASC_CAL = '<svg viewBox="0 0 24 24" fill="none"><rect x="3.5" y="5" width="17" height="15" rx="3" stroke="currentColor" stroke-width="1.7"/><path d="M3.5 9.5h17M8 3v4M16 3v4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>';
const ATC_ADD_SQ = '<svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

/* The 5 cards shown in the mockup (node 29:7518), with the design's literal
   values. `body` picks the response-type layout; `note` forces a note-preview
   body (Eye Condition in the design shows an observation, not a chart). */
const ASC_MOCK = [
  { q: 'Weight', cat: 'Physical Health', body: 'numeric', unit: 'kg',
    value: '20.8', delta: '↓ 0.3 kg', dir: 'dn', vizKind: 'bars',
    stats: [['Previous', '21.1 kg'], ['Average', '22 kg'], ['Min', '20.8 kg'], ['Max', '23.1 kg']] },
  { q: 'Eye Condition', cat: 'Physical Health', body: 'note',
    note: 'Good interaction with the group; condition stable since last check.' },
  { q: 'Stress Behaviour', cat: 'Behaviour', body: 'scale',
    value: '5', max: '5', delta: '↑ Improved', dir: 'up', vizKind: 'line' },
  { q: 'Posture', cat: 'Physical Health', body: 'list', value: 'Good', vizKind: 'bars' },
  { q: 'Feeding Behaviour', cat: 'Behaviour', body: 'list', value: 'Normal', vizKind: 'line' },
];
const ASC_DATE = 'Last tested on 28 Jun 2026';   // design uses this on every card

/* map a series to numbers for the mini charts: numeric/scale pass through,
   list options → their ordinal index (worst→best) so a line/bar can draw. */
function numify(s, it) {
  return s.map(v => {
    if (typeof v === 'number') return v;
    const i = it && it.options ? it.options.indexOf(v) : -1;
    return i >= 0 ? i + 1 : 0;
  });
}

/* one Assessment Card — bordered header + per-body content (build-as-is, node 29:7805).
   `m` is an ASC_MOCK entry; the graph shape is pinned by m.vizKind. */
function ascCard(m) {
  const it = catType(m.q) || {};
  const color = it.color || '#37BD69';
  const date = `<div class="asc-date">${ASC_CAL}<span>${ASC_DATE}</span></div>`;
  const head = `<div class="asc-head">
      <div class="asc-htext"><div class="asc-name">${m.q}</div><div class="asc-cat">${m.cat}</div></div>
      <button class="asc-add" onclick="event.stopPropagation();openAddEntry('${m.q}')" aria-label="Add ${m.q}">${ATC_PLUS}</button>
    </div>`;

  // graph — the mock pins the exact chart shape shown in the design (m.vizKind);
  // series is synthetic. bars → v2Bars, line → v2Line, area → v2Area.
  const seriesViz = () => {
    const s = numify(seriesFor(m.q), it);
    if (m.vizKind === 'line') return v2Line(s, color);
    if (m.vizKind === 'area') return v2Area(s, color, 'asc' + m.q.replace(/\W/g, ''));
    return v2Bars(s, color);   // bars-vs-ceiling default
  };

  let body;
  if (m.body === 'note') {
    body = `<div class="asc-body asc-body-note">
        <div class="asc-note">“${m.note}”</div>
        ${date}
      </div>`;
  } else if (m.body === 'numeric') {
    body = `<div class="asc-body">
        <div class="asc-row">
          <div class="asc-lead">
            <div class="asc-main"><span class="asc-val">${m.value}<small>${m.unit}</small></span><span class="asc-chg ${m.dir}">${m.delta}</span></div>
            ${date}
          </div>
          <div class="asc-viz">${seriesViz()}</div>
        </div>
        <div class="asc-stats">${m.stats.map(([l, v]) => `<div class="asc-hs"><div class="asc-hs-l">${l}</div><div class="asc-hs-v">${v}</div></div>`).join('')}</div>
      </div>`;
  } else if (m.body === 'scale') {
    body = `<div class="asc-body">
        <div class="asc-row">
          <div class="asc-lead">
            <div class="asc-main"><span class="asc-val">${m.value}<small> /${m.max}</small></span><span class="asc-chg ${m.dir}">${m.delta}</span></div>
            ${date}
          </div>
          <div class="asc-viz">${seriesViz()}</div>
        </div>
      </div>`;
  } else { // list
    body = `<div class="asc-body">
        <div class="asc-row">
          <div class="asc-lead">
            <div class="asc-main"><span class="asc-val text">${m.value}</span></div>
            ${date}
          </div>
          <div class="asc-viz">${seriesViz()}</div>
        </div>
      </div>`;
  }
  return `<div class="asc-card" onclick="openMetric('${m.q}')">${head}${body}</div>`;
}

/* Assessment Landing screen content (node 29:7518) — exactly the 5 mockup cards.
   Chips are visual (design shows All active). "3 Types" per the mockup. */
function ascListing() {
  const chips = `<div class="tchip-row v2-doms asc-chips">${CAT_DOMAINS.map(d =>
    `<button class="tchip ${d === 'All' ? 'active' : ''}" onclick="setAmACat('${d}')">${d}</button>`).join('')}</div>`;
  const cards = ASC_MOCK.map(ascCard).join('');
  // sticky "3 Types" bar with add + search icons (design node 36:9296)
  const bar = `<div class="asc-listbar">
      <span class="asc-count">3 Types</span>
      <div class="asc-listicons">
        <button class="asc-listic" onclick="go2('mstLanding')" aria-label="Add assessment type">${ATC_ADD_SQ}</button>
        <button class="asc-listic" aria-label="Search">${I2.search}</button>
      </div>
    </div>`;
  return { bar, body: `<div class="asc-body-wrap">${chips}<div class="asc-cards">${cards}</div></div>` };
}

/* profile Assessment-tab tabs (visual — Assessment is active; others inert) */
const ASC_TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'assessment', label: 'Assessment' },
  { key: 'medical', label: 'Medical' },
  { key: 'enclosures', label: 'Enclosures' },
  { key: 'records', label: 'Records' },
  { key: 'diet', label: 'Diet' },
  { key: 'notes', label: 'Notes' },
];
function ascTabNoop() { /* visual only — profile tabs are not wired on this screen */ }

/* ---- page state (filter context persists across tabs) -------------------- */
/* Only 3 tabs — Analytics + Notes content live as scrollable Overview sections */
let AA_TAB = 'overview';
let AA_FILTER = 'Week';
let AA_HIST_TYPE = 'All';
let AA_CMP_CAT = 'Physical Health';   // comparison is scoped to one category
let AA_CMP_IA = 0, AA_CMP_IB = 1;     // session indices (0 = newest)
const AA_TABLIST = [
  { key: 'overview', label: 'Summary' },
  { key: 'history', label: 'History' },
  { key: 'comparison', label: 'Comparison' },
  { key: 'schedule', label: 'Schedule' },
];
let AA_FIELD = 'Weight';        // selected metric in the Assessment Trend card
let MD_FILTER = 'W';            // W/M/6M/Y in the See More Data drill-down (no intraday: an assessment is one scheduled record, not a sensor stream)
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
function openMetric(q) { MD_FILTER = 'W'; openSheet2(metricSheetHTML(q)); }
function setMdFilter(q, f) {
  MD_FILTER = f;
  const host = document.getElementById('mdSheetBody');
  if (host) host.innerHTML = metricSheetInner(q); else openSheet2(metricSheetHTML(q));
}

function setAaTab(k) { AA_TAB = k; hideAssessTip(); render2(); }
function setAaFilter(f) { AA_FILTER = f; ASSESS_SEG = f; hideAssessTip(); render2(); }
let AA_ACT_CAT = 'All';   // activity-chart assessment-category filter (left)
function setActCat(c) { AA_ACT_CAT = c; hideAssessTip(); render2(); }
function setHistType(t) { AA_HIST_TYPE = t; render2(); }
function setCmpCat(c) { AA_CMP_CAT = c; render2(); }
function setCmpIdx(which, v) { v = +v; if (which === 'a') AA_CMP_IA = v; else AA_CMP_IB = v; render2(); }
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
  const catName = AA_ACT_CAT || 'All';
  const catOpts = CAT_DOMAINS.map(c => `<option value="${c}" ${c === catName ? 'selected' : ''}>${c === 'All' ? 'All Assessments' : c}</option>`).join('');
  return `<div class="assess-card" id="assessCard">
    <div class="ac-top">
      <span class="ac-catwrap">
        <select class="ac-cat" onchange="setActCat(this.value)">${catOpts}</select>
        <span class="ac-cat-chev">${I2.chevDown}</span>
      </span>
      <div class="segment ac-seg" id="assessSeg">
        ${segs.map(s => `<button class="seg ${s === AA_FILTER ? 'active' : ''}" data-seg="${s}" onclick="setAaFilter('${s}')">${s}</button>`).join('')}
      </div>
    </div>
    <div class="ac-wrap" id="assessChart">${assessChartSVG(AA_FILTER, catName)}</div>
    <div class="ac-scrub" id="acScrubTip"></div>
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
/* shared: white-halo end dot so the marker reads cleanly over the line */
function endDot(x, y, color, r) {
  return `<circle class="v2-dot" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(r + 1.6).toFixed(1)}" fill="#fff"/>`
    + `<circle class="v2-dot" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="${color}"/>`;
}
/* numeric → smooth AREA trend line, latest point accented */
function v2Area(values, color, id) {
  const w = 132, h = 48, pad = 5, iw = w - pad * 2, ih = h - pad * 2;
  const lo = Math.min(...values), hi = Math.max(...values), rng = (hi - lo) || 1;
  const X = i => pad + (i / (values.length - 1)) * iw, Y = v => pad + (1 - (v - lo) / rng) * ih;
  const pts = values.map((v, i) => [X(i), Y(v)]), line = smoothPath2(pts), last = pts[pts.length - 1];
  const area = `${line} L${last[0].toFixed(1)} ${h} L${pts[0][0].toFixed(1)} ${h} Z`;
  return `<svg class="v2-area" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity=".18"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>
    <path class="v2-fill" d="${area}" fill="url(#${id})"/><path class="v2-line" d="${line}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    ${endDot(last[0], last[1], color, 2.8)}</svg>`;
}
/* numeric variant → line with markers (no fill) */
function v2Line(values, color) {
  const w = 132, h = 48, pad = 5, iw = w - pad * 2, ih = h - pad * 2;
  const lo = Math.min(...values), hi = Math.max(...values), rng = (hi - lo) || 1;
  const X = i => pad + (i / (values.length - 1)) * iw, Y = v => pad + (1 - (v - lo) / rng) * ih;
  const pts = values.map((v, i) => [X(i), Y(v)]), line = smoothPath2(pts), last = pts[pts.length - 1];
  const dots = pts.map((p, i) => i === pts.length - 1 ? '' :
    `<circle class="v2-dot" cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="2" fill="#fff" stroke="${color}" stroke-width="1.4"/>`).join('');
  return `<svg class="v2-area" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
    <path class="v2-line" d="${line}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    ${dots}${endDot(last[0], last[1], color, 3)}</svg>`;
}
/* numeric variant → recency columns (older lighter, latest full colour) */
function v2Col(values, color) {
  const n = values.length, w = 132, h = 48, gap = 5, bw = (w - gap * (n - 1)) / n;
  const lo = Math.min(...values), hi = Math.max(...values), rng = (hi - lo) || 1;
  const r = Math.min(3, bw / 2);
  const bars = values.map((v, i) => {
    const bh = 7 + ((v - lo) / rng) * (h - 7), x = i * (bw + gap), y = h - bh;
    const op = (0.30 + 0.70 * (i / (n - 1))).toFixed(2);
    return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" rx="${r.toFixed(1)}" fill="${color}" fill-opacity="${op}" style="animation-delay:${(i * 0.05).toFixed(2)}s"/>`;
  }).join('');
  return `<svg class="v2-bars" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">${bars}</svg>`;
}
/* scale → mini bar chart, final (latest) bar accented */
function v2Bars(values, color) {
  const n = values.length, w = 132, h = 48, gap = 5, bw = (w - gap * (n - 1)) / n;
  const lo = Math.min(...values), hi = Math.max(...values), rng = (hi - lo) || 1;
  const r = Math.min(3, bw / 2);
  const bars = values.map((v, i) => {
    const bh = 7 + ((v - lo) / rng) * (h - 7), x = i * (bw + gap), y = h - bh;
    const fill = i === n - 1 ? color : '#E6EBED';
    return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" rx="${r.toFixed(1)}" fill="${fill}" style="animation-delay:${(i * 0.05).toFixed(2)}s"/>`;
  }).join('');
  return `<svg class="v2-bars" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">${bars}</svg>`;
}
/* scale variant → lollipop (stem + dot), latest accented */
function v2Lolli(values, color) {
  const n = values.length, w = 132, h = 48, gap = 5, bw = (w - gap * (n - 1)) / n;
  const lo = Math.min(...values), hi = Math.max(...values), rng = (hi - lo) || 1;
  const out = values.map((v, i) => {
    const cy = 7 + (1 - (v - lo) / rng) * (h - 14), cx = i * (bw + gap) + bw / 2, lastOne = i === n - 1;
    const col = lastOne ? color : '#C5CFD4';
    return `<rect x="${(cx - 1.25).toFixed(1)}" y="${cy.toFixed(1)}" width="2.5" height="${(h - cy).toFixed(1)}" rx="1.25" fill="${col}" fill-opacity="${lastOne ? 1 : .7}" style="animation-delay:${(i * 0.05).toFixed(2)}s"/>`
      + (lastOne ? endDot(cx, cy, color, 3.4) : `<circle class="v2-dot" cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="2.8" fill="${col}"/>`);
  }).join('');
  return `<svg class="v2-lolli" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">${out}</svg>`;
}
/* scale variant → connected dot track, latest accented */
function v2Dots(values, color) {
  const n = values.length, w = 132, h = 48, pad = 7, iw = w - pad * 2;
  const lo = Math.min(...values), hi = Math.max(...values), rng = (hi - lo) || 1;
  const X = i => pad + (i / (n - 1)) * iw, Y = v => 9 + (1 - (v - lo) / rng) * (h - 18);
  const poly = values.map((v, i) => `${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(' ');
  const dots = values.map((v, i) => {
    const lastOne = i === n - 1;
    return lastOne ? endDot(X(i), Y(v), color, 3.6)
      : `<circle class="v2-dot" cx="${X(i).toFixed(1)}" cy="${Y(v).toFixed(1)}" r="2.6" fill="#C5CFD4" style="animation-delay:${(i * 0.05).toFixed(2)}s"/>`;
  }).join('');
  return `<svg class="v2-dots" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
    <polyline points="${poly}" fill="none" stroke="#E6EBED" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>${dots}</svg>`;
}
/* scale variant → circular gauge (value / max) */
function v2Gauge(value, max, color) {
  const r = 17, cx = 24, cy = 24, C = 2 * Math.PI * r, frac = Math.max(0.001, Math.min(1, value / max));
  return `<svg class="v2-gauge" viewBox="0 0 48 48">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#EDF1F3" stroke-width="5.5"/>
    <circle class="v2-gauge-arc" cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="5.5" stroke-linecap="round" stroke-dasharray="${(frac * C).toFixed(2)} ${C.toFixed(2)}" transform="rotate(-90 ${cx} ${cy})"/>
    <text x="24" y="26.5" text-anchor="middle" font-size="13.5" font-weight="700" fill="#1A1D1F">${value}</text>
    <text x="24" y="33" text-anchor="middle" font-size="7" font-weight="600" fill="#9AA6A2">/ ${max}</text></svg>`;
}
/* list variant → circular donut of the distribution, current value accented */
function v2Donut(it, vals, color) {
  const dist = {}; it.options.forEach(o => dist[o] = 0); vals.forEach(v => dist[v]++);
  const total = vals.length || 1, cur = vals[vals.length - 1];
  const r = 16, cx = 24, cy = 24, C = 2 * Math.PI * r, gap = 3, greys = ['#D7DEE2', '#C2CBD0', '#AEB9BF', '#97A4AA'];
  const present = it.options.filter(o => dist[o] > 0);
  let off = 0, g = 0;
  const segs = present.map(o => {
    const len = dist[o] / total * C, col = o === cur ? color : greys[g++ % greys.length];
    const draw = Math.max(0.5, len - (present.length > 1 ? gap : 0));
    const s = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${col}" stroke-width="6" stroke-linecap="round" stroke-dasharray="${draw.toFixed(2)} ${(C - draw).toFixed(2)}" stroke-dashoffset="${(-off - gap / 2).toFixed(2)}" transform="rotate(-90 ${cx} ${cy})"/>`;
    off += len; return s;
  }).join('');
  return `<svg class="v2-donut" viewBox="0 0 48 48"><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#EDF1F3" stroke-width="6"/>${segs}<text x="24" y="27.5" text-anchor="middle" font-size="11" font-weight="700" fill="#1A1D1F">${dist[cur]}</text></svg>`;
}
/* pick the numeric/scale renderer for a type's assigned variant */
function v2Viz(it, s, color) {
  if (it.rt === 'numeric') return it.viz === 'line' ? v2Line(s, color) : it.viz === 'col' ? v2Col(s, color) : v2Area(s, color, 'va' + it.q.replace(/\W/g, ''));
  return it.viz === 'gauge' ? v2Gauge(s[s.length - 1], it.max, color) : it.viz === 'lolli' ? v2Lolli(s, color) : it.viz === 'dots' ? v2Dots(s, color) : v2Bars(s, color);
}
/* wide trend chart for the prominent hero card */
function v2HeroChart(values, color, id) {
  const w = 320, h = 92, pad = 5, iw = w - pad * 2, ih = h - pad * 2;
  const lo = Math.min(...values), hi = Math.max(...values), rng = (hi - lo) || 1;
  const X = i => pad + (i / (values.length - 1)) * iw, Y = v => pad + (1 - (v - lo) / rng) * ih;
  const pts = values.map((v, i) => [X(i), Y(v)]), line = smoothPath2(pts), last = pts[pts.length - 1];
  const area = `${line} L${last[0].toFixed(1)} ${h} L${pts[0][0].toFixed(1)} ${h} Z`;
  return `<svg class="v2-hero-svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity=".22"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>
    <path class="v2-fill" d="${area}" fill="url(#${id})"/><path class="v2-line" d="${line}" fill="none" stroke="${color}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
    <circle class="v2-dot" cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="5" fill="#fff"/><circle class="v2-dot" cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="3.2" fill="${color}"/></svg>`;
}
/* prominent hero card (numeric) — big value + wide trend + Previous/Average/Min/Max */
function v2HeroCard(m, opts) {
  const tap = !opts || opts.tap !== false, add = opts && opts.add;
  const it = trendItem(m.q), color = it.color || m.color, s = seriesFor(m.q), u = it.unit;
  const cur = s[s.length - 1], prev = s[s.length - 2], d = +(cur - prev).toFixed(1), flat = Math.abs(d) < 0.01, up = d > 0;
  const avg = +(s.reduce((a, b) => a + b, 0) / s.length).toFixed(1), min = Math.min(...s), max = Math.max(...s);
  const stats = [['Previous', prev + ' ' + u], ['Average', avg + ' ' + u], ['Min', min + ' ' + u], ['Max', max + ' ' + u]];
  return `<div class="v2-card v2-hero"${tap ? ` onclick="openMetric('${m.q}')"` : ''}>
    <div class="v2-head"><span class="v2-name">${qLabel(m.q)}</span>${add ? `<button class="v2-add" onclick="event.stopPropagation();openAddEntry('${m.q}')" aria-label="Add ${qLabel(m.q)}">${ATC_PLUS}</button>` : ''}${tap && !add ? `<span class="v2-chev">${I2.chevR}</span>` : ''}</div>
    <div class="v2-hero-top"><span class="v2-hero-val">${cur}<small>${u}</small></span><span class="v2-sub ${flat ? 'eq' : up ? 'up' : 'dn'}">${flat ? '→ Stable' : (up ? '↑ +' : '↓ ') + Math.abs(d) + ' ' + u}</span></div>
    <div class="v2-hero-chart">${v2HeroChart(s, color, 'vh' + m.q.replace(/\W/g, ''))}</div>
    <div class="v2-hero-stats">${stats.map(([l, v]) => `<div class="v2-hs"><div class="v2-hs-l">${l}</div><div class="v2-hs-v">${v}</div></div>`).join('')}</div>
    <div class="v2-when">${catSessions(m.q)[0].date}</div>
  </div>`;
}

/* one tappable card per metric — Apple-Health concept: colored icon + title,
   chevron top-right, hero value + insight + small date caption bottom-left,
   a DISTINCT viz per response type bottom-right (numeric→area, scale→bars,
   list→distribution, text→chips). Full analytics open on tap (openMetric). */
function v2Card(m, opts) {
  const tap = !opts || opts.tap !== false, add = opts && opts.add;
  const it = trendItem(m.q), rt = it.rt, last = catSessions(m.q)[0].date, color = it.color || m.color;
  const head = `<div class="v2-head">
    <span class="v2-name">${qLabel(m.q)}</span>
    ${add ? `<button class="v2-add" onclick="event.stopPropagation();openAddEntry('${m.q}')" aria-label="Add ${qLabel(m.q)}">${ATC_PLUS}</button>` : ''}
    ${tap && !add ? `<span class="v2-chev">${I2.chevR}</span>` : ''}</div>`;
  const when = `${last}`;
  // TEXT has no metric to chart — show the latest note itself (content-first, no fake graph)
  if (rt === 'text') {
    const latest = catNewest(m.q)[0];
    return `<div class="v2-card v2-card-text"${tap ? ` onclick="openMetric('${m.q}')"` : ''}>${head}
      <div class="v2-note-preview">“${latest}”</div>
      <div class="v2-foot"><div class="v2-lead">
        <span class="v2-val">${catSessions(m.q).length}<small>entries</small></span>
        <div class="v2-sub muted">${tap ? 'Tap to read all notes' : 'Latest note'}</div>
        <div class="v2-when">${when}</div></div></div></div>`;
  }
  let val = '', sub = '', viz = '';
  if (rt === 'numeric') {
    const s = seriesFor(m.q), cur = s[s.length - 1], prev = s[s.length - 2], d = +(cur - prev).toFixed(1), flat = Math.abs(d) < 0.01, up = d > 0;
    val = `<span class="v2-val">${cur}<small>${it.unit}</small></span>`;
    sub = `<div class="v2-sub ${flat ? 'eq' : up ? 'up' : 'dn'}">${flat ? '→ Stable' : (up ? '↑ +' : '↓ ') + Math.abs(d) + ' ' + it.unit}</div>`;
    viz = v2Viz(it, s, color);
  } else if (rt === 'scale') {
    const s = seriesFor(m.q), cur = s[s.length - 1], prev = s[s.length - 2], d = cur - prev, flat = d === 0, up = d > 0;
    val = `<span class="v2-val">${cur}<small>/ ${it.max}</small></span>`;
    sub = `<div class="v2-sub ${flat ? 'eq' : up ? 'up' : 'dn'}">${flat ? '→ Stable' : up ? '↑ Improved' : '↓ Declined'}</div>`;
    viz = v2Viz(it, s, color);
  } else if (rt === 'list') {
    const vals = seriesFor(m.q), cur = vals[vals.length - 1];
    const dist = {}; it.options.forEach(o => dist[o] = 0); vals.forEach(v => dist[v]++);
    const total = vals.length, freq = Object.entries(dist).sort((a, b) => b[1] - a[1])[0][0];
    val = `<span class="v2-val text">${cur}</span>`;
    sub = `<div class="v2-sub muted">Most frequent · ${freq}</div>`;
    if (it.viz === 'donut') {
      viz = v2Donut(it, vals, color);
    } else {
      const rows = it.options.map(o => ({ o, n: dist[o] })).sort((a, b) => b.n - a.n).slice(0, 3);
      viz = `<div class="v2-dist">${rows.map(r => `<div class="v2-dist-bar"><i style="width:${Math.round(r.n / total * 100)}%;background:${r.o === cur ? color : '#C9D2D6'}"></i></div>`).join('')}</div>`;
    }
  }
  return `<div class="v2-card"${tap ? ` onclick="openMetric('${m.q}')"` : ''}>${head}
    <div class="v2-foot"><div class="v2-lead">${val}${sub}<div class="v2-when">${when}</div></div><div class="v2-viz">${viz}</div></div></div>`;
}
function aaOverview() {
  // Summary view (Assessment Trend + Latest Record) hidden for now — show Detailed directly.
  const mode = 'detailed';
  const toggle = '';
  const metricSearch = `<div class="hist-search v2-search"><span class="hs-box">${I2.search}<input class="hs-in" type="text" placeholder="Search" oninput="searchFilter(this,'.v2-card')"></span></div>`;
  const domChips = `<div class="tchip-row v2-doms">${CAT_DOMAINS.map(d =>
    `<button class="tchip ${d === AA_OV_DOM ? 'active' : ''}" onclick="setOvDom('${d}')">${d}</button>`).join('')}</div>`;
  const cats = AA_OV_DOM === 'All' ? CATALOGUE : CATALOGUE.filter(c => c.cat === AA_OV_DOM);
  const showLabels = AA_OV_DOM === 'All';
  const cards = cats.map(c =>
    (showLabels ? `<div class="v2-catlabel">${c.cat}</div>` : '') + c.types.map(ty => {
      const t = catType(ty.q);
      return (t.hero ? v2HeroCard : v2Card)({ q: ty.q, color: t.color });
    }).join('')
  ).join('');
  const body = mode === 'summary'
    ? `<div id="aaOvHost">${aaTrend()}${aaLatest()}</div>`
    : `<div data-searchbox>${metricSearch}${domChips}<div class="v2-list">${cards}</div><div class="ls-empty">No matching metrics</div></div>`;
  return toggle + body;
}

/* Assessment Trend — field chips → selected metric value · trend · "See More Data".
   Inner content split out so it can render flat inside another card (home page)
   or wrapped in its own .wcard (analytics Summary view). */
function aaTrendInner(opts) {
  opts = opts || {};
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
  const seeMore = opts.noSeeMore ? '' :
    `<button class="see-more" onclick="openMetric('${q}')">See More Data ${I2.chevR}</button>`;
  return `${chips}
    <div class="trend-val">${valHTML}</div>
    ${viz}
    ${seeMore}`;
}
function aaTrend() {
  return `<div class="wcard"><div class="wc-title">Assessment Trend</div>${aaTrendInner()}</div>`;
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
const HIST_FILTERS = CAT_DOMAINS;   // All + the five assessment categories
const Q_LABEL = { 'Body Condition Score': 'Body Score', 'Activity Level': 'Activity' };
function qLabel(q) { return Q_LABEL[q] || q; }
/* feed = one reading per catalogue type, distributed across sessions, newest first */
function buildFeed() {
  const rows = [];
  CATALOGUE.forEach(c => c.types.forEach(ty => {
    const idx = catSeed(ty.q) % CAT_SESS.length, sess = CAT_SESS[idx], val = catNewest(ty.q)[idx];
    rows.push({ q: ty.q, label: qLabel(ty.q), dom: c.cat, color: c.color, rt: ty.rt, value: val,
      unit: ty.unit, max: ty.max, by: sess.by, date: sess.date, time: sess.time, k: idx });
  }));
  return rows.sort((a, b) => a.k - b.k);
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
    return `<div class="feed-card" onclick="openMetric('${f.q}')">
      <div class="fc-body"><div class="fc-cat">${f.label}</div>${val}
        <div class="fc-meta">${f.dom} · ${f.by} · ${f.date}</div></div>
      <span class="fc-chev">${I2.chevR}</span></div>`;
  }).join('')
    : `<div class="muted" style="text-align:center;padding:34px 16px">No ${AA_HIST_TYPE} records in this period.</div>`;
  return `<div class="tchip-row v2-doms">${chips}</div><div data-searchbox>${search}<div class="feed-list">${cards}</div><div class="ls-empty">No matching records</div></div>`;
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
/* classify a numeric value against its ideal (base): healthy band ±6%, caution ±16%, beyond = at risk */
function numStatus(cur, ideal) {
  const dev = (cur - ideal) / ideal, a = Math.abs(dev);
  if (a <= 0.06) return { cls: 'ok', label: 'Healthy' };
  const side = dev < 0 ? 'Low' : 'High';
  if (a <= 0.16) return { cls: 'warn', label: side };
  return { cls: 'risk', label: `${side} · At Risk` };
}
/* horizontal track placing current + previous against the ideal band */
function idealTrack(cur, prev, ideal, dp) {
  const lo = ideal * 0.7, hi = ideal * 1.3, span = hi - lo;
  const pct = v => Math.max(2, Math.min(98, ((v - lo) / span) * 100));
  const bandL = ((ideal * 0.94 - lo) / span) * 100, bandW = ((ideal * 1.06 - ideal * 0.94) / span) * 100;
  return `<div class="cmp-track">
    <i class="cmp-band" style="left:${bandL.toFixed(1)}%;width:${bandW.toFixed(1)}%"></i>
    <i class="cmp-tick" style="left:${pct(prev).toFixed(1)}%"></i>
    <i class="cmp-dot" style="left:${pct(cur).toFixed(1)}%"></i>
  </div>`;
}
function cmpRowFor(itA, itB) {
  const unit = itA.unit || '';
  if (itA.rt === 'numeric') {
    const ideal = catType(itA.q).base, dp = catType(itA.q).dp;
    const d = +(itA.value - itB.value).toFixed(dp), dir = d > 0 ? 'up' : d < 0 ? 'dn' : 'eq';
    const st = numStatus(itA.value, ideal);
    const deltaHTML = `<span class="cmp-delta ${dir}">${dir === 'up' ? '↑' : dir === 'dn' ? '↓' : ''}${d > 0 ? '+' : ''}${d}${unit}</span>`;
    return `<div class="cmp-card">
      <div class="cmp-head"><span class="cmp-q">${qLabel(itA.q)}</span><span class="cmp-status ${st.cls}">${st.label}</span></div>
      <div class="cmp-val"><span class="cmp-prev">${itB.value}${unit}</span><span class="cmp-arrow">»</span><span class="cmp-cur">${itA.value}${unit}</span>${deltaHTML}</div>
      ${idealTrack(itA.value, itB.value, ideal, dp)}
      <div class="cmp-scale"><span>Low</span><span class="cmp-ideal">Ideal ${+ideal.toFixed(dp)}${unit}</span><span>High</span></div>
    </div>`;
  }
  let valueHTML = '', deltaHTML = '';
  if (itA.rt === 'scale') {
    const d = +(itA.value - itB.value).toFixed(1), dir = d > 0 ? 'up' : d < 0 ? 'dn' : 'eq';
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
/* build a comparable item from a type's value at session index idx */
function cmpItem(ty, idx) {
  return { q: ty.q, rt: ty.rt, unit: ty.unit, max: ty.max, options: ty.options, value: catNewest(ty.q)[idx] };
}
function aaComparison() {
  const cat = CATALOGUE.find(c => c.cat === AA_CMP_CAT) || CATALOGUE[0];
  if (AA_CMP_IA === AA_CMP_IB) AA_CMP_IB = (AA_CMP_IA + 1) % CAT_SESS.length;
  const chips = CATALOGUE.map(c =>
    `<button class="tchip ${c.cat === AA_CMP_CAT ? 'active' : ''}" onclick="setCmpCat('${c.cat}')">${c.cat}</button>`).join('');
  const opt = (sel) => CAT_SESS.map((s, i) => `<option value="${i}" ${i === sel ? 'selected' : ''}>${s.date}</option>`).join('');
  const selector = `<div class="cmp-selects">
      <label>Compare<select onchange="setCmpIdx('a',this.value)">${opt(AA_CMP_IA)}</select></label>
      <label>With<select onchange="setCmpIdx('b',this.value)">${opt(AA_CMP_IB)}</select></label>
    </div>`;
  const rows = cat.types.map(ty => {
    const itA = cmpItem(ty, AA_CMP_IA), itB = cmpItem(ty, AA_CMP_IB);
    return ty.rt === 'text' ? cmpTextCard(itA, itB) : cmpRowFor(itA, itB);
  }).join('');
  return `
    <div class="tchip-row v2-doms">${chips}</div>
    ${selector}
    <div class="cmp-context"><span>${CAT_SESS[AA_CMP_IA].date}</span><span class="cmp-vs">vs</span><span>${CAT_SESS[AA_CMP_IB].date}</span></div>
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
    <div class="aa-context">${aaStatGrid()}</div><!-- ${'' /* aaActivityCard() hidden for now */} -->
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
  W: { n: 12, ends: ['Mar', 'Apr', 'Jun'] },
  M: { n: 12, ends: ['Jan', 'Apr', 'Jun'] }, '6M': { n: 26, ends: ['Jan', 'Mar', 'Jun'] }, Y: { n: 12, ends: ['Jul', 'Dec', 'Jun'] },
};
function mdSeed(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
function mdSeries(q, filter) {
  const it = trendItem(q), base = seriesFor(q), isScale = it.rt === 'scale';
  const cur = base[base.length - 1], prev = base[0], cf = MD_FILT[filter] || MD_FILT.W, n = cf.n, seed = mdSeed(q + filter);
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
    areaEl = `<path class="lc-area" d="M${pts[0][0].toFixed(1)} ${pt + ih} ${pts.map(p => 'L' + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ')} L${pts[pts.length - 1][0].toFixed(1)} ${pt + ih} Z" fill="url(#${id}_g)"/>`;
  }
  let avgEl = '';
  if (avg != null) { const ay = Y(avg); avgEl = `<line x1="${pl}" y1="${ay.toFixed(1)}" x2="${pl + iw}" y2="${ay.toFixed(1)}" stroke="#A9C3B8" stroke-width="1.2" stroke-dasharray="5 5"/><text x="${pl + 2}" y="${(ay - 6).toFixed(1)}" font-size="11" fill="#5C6B63" font-weight="700">avg ${avg}</text>`; }
  return `<div class="lc-wrap"><div class="lc-tip" id="${id}_tip"></div>
    <svg id="${id}_svg" class="lc-svg" viewBox="0 0 ${W} ${H}" style="width:100%;display:block">
      ${defs}${grid}${areaEl}${avgEl}
      <path class="lc-line" d="${smoothPath2(pts)}" fill="none" stroke="${color}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>${xsEl}
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
  const rows = catSessions(q).map((r, i) => {
    const v = vals[i], bg = i === 0 ? '#37BD69' : (i === 1 ? '#D4EFDF' : '#EEF3F1'), fg = i === 0 ? '#fff' : (i === 1 ? '#1B6B43' : '#44544A');
    return `<div class="md-hrow"><div class="md-meta"><div class="mh-t">${r.time}</div><div class="mh-d">${r.date}</div><div class="mh-a">${r.by}</div></div>
      <div class="md-pill" style="background:${bg};color:${fg}">${fmt(v)}</div></div>`;
  }).join('');
  return `<div class="md-sname">${q} History</div><div class="md-hist">${rows}</div>`;
}
/* --- sheet building blocks (Figma: white header + white chart section, mint lower w/ white cards) --- */
function msFlt(q) {
  return `<div class="segment seg4 ms-flt">${['W', 'M', '6M', 'Y'].map(f =>
    `<button class="seg ${f === MD_FILTER ? 'active' : ''}" onclick="setMdFilter('${q}','${f}')">${f}</button>`).join('')}</div>`;
}
function msStat(l, v) { return `<div class="ms-s"><div class="ms-sl">${l}</div><div class="ms-sv">${v}</div></div>`; }
function msRows(q, fmt, colFn) {
  const vals = catNewest(q);
  return catSessions(q).map((r, i) => {
    const v = vals[i];
    const style = colFn ? `background:${colFn(v)};color:#1F515B` : `background:${i < 2 ? '#E1F9ED' : '#EFF5F2'};color:#1F515B`;
    return `<div class="ms-row"><div class="ms-meta"><div class="ms-t">${r.time}</div><div class="ms-d">${r.date}</div><div class="ms-a">${r.by}</div></div>
      <div class="ms-pill" style="${style}">${fmt(v)}</div></div>`;
  }).join('');
}
/* ---- Schedule (planning) card — cadence + last/next planned reading + link to
        the Schedule tab. Planning only: NO completion/overdue status. ---- */
const MS_MON2 = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function msAddDays(dateStr, days) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime()) || !days) return null;
  d.setDate(d.getDate() + days);
  return d.getDate() + ' ' + MS_MON2[d.getMonth()] + ' ' + d.getFullYear();
}
const MS_CADENCE = { numeric: ['Weekly', 7], scale: ['Fortnightly', 14], list: ['Monthly', 30], text: ['As needed', 0] };
const MS_REPEAT_IC = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M17 2l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>';
const MS_PLUS_IC = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>';
/* Cadence range chips at the top of the Your Schedule container (30/60/90 days) */
let MS_SCHED_RANGE = '30D';
function setSchedRange(q, r) {
  MS_SCHED_RANGE = r;
  const host = document.getElementById('mdSheetBody');
  if (host) host.innerHTML = metricSheetInner(q); else render2();
}
const MS_SCHED_RANGES = [['30D', '30 Days'], ['60D', '60 Days'], ['90D', '90 Days']];
/* "Your Schedule" card (Apple-Sleep style): next assessment + week strip + repeat,
   sourced from the real planning data (SCHEDULE) for this assessment type. */
function msScheduleCard(q, it) {
  const plans = (typeof SCHEDULE !== 'undefined') ? SCHEDULE.filter(p => p.types && p.types.includes(q)) : [];
  const sorted = plans.slice().sort((a, b) => a.date - b.date);
  const rel = (typeof schRel === 'function') ? schRel : (d => '' + d);
  const repLbl = (typeof schRepeatLabel === 'function') ? schRepeatLabel : (p => p.repeat || '');
  const head = `<div class="ms-sched-head"><div class="ms-card-t">Your Schedule</div>
    <button class="ms-sched-link" onclick="closeSheet2();setAaTab('schedule')">Schedule ${I2.chevR}</button></div>`;
  const chips = `<div class="ms-sched-chips">${MS_SCHED_RANGES.map(([v, l]) =>
    `<button class="msc-chip ${v === MS_SCHED_RANGE ? 'active' : ''}" onclick="setSchedRange('${q}','${v}')">${l}</button>`).join('')}</div>`;
  // Always offer a Schedule action button…
  const scheduleBtn = `<button class="ms-sched-btn" onclick="closeSheet2();setAaTab('schedule')">${MS_PLUS_IC}<span>Schedule</span></button>`;
  // …and under it, list anything already scheduled for this assessment type.
  let below;
  if (sorted.length) {
    const items = sorted.map(p => {
      const rep = repLbl(p);
      return `<div class="ms-sched-next">
        <span class="ms-sched-ic">${I2.cal}</span>
        <div class="ms-sched-next-b"><div class="ms-sched-next-v">${rel(p.date)} · ${p.time}</div>
          <div class="ms-sched-next-l">${rep === 'One Time' ? 'Does not repeat' : 'Repeats · ' + rep}</div></div>
      </div>`;
    }).join('');
    below = `<div class="ms-sched-list-lab">Scheduled · ${sorted.length}</div>${items}`;
  } else {
    const cad = MS_CADENCE[it.rt] || ['Weekly', 7];
    below = `<div class="ms-sched-empty">
      <div class="ms-sched-empty-t">Not scheduled yet</div>
      <div class="ms-sched-empty-s">Recommended cadence · ${cad[0]}</div></div>`;
  }
  return `<div class="ms-card ms-sched">${head}${chips}${scheduleBtn}${below}</div>`;
}
/* sheet content (filter + type-adaptive body); re-rendered in place on filter change */
function metricSheetInner(q) {
  const it = trendItem(q), rt = it.rt, flt = msFlt(q);
  const scheduleCard = msScheduleCard(q, it);
  if (rt === 'numeric') {
    const color = it.color || '#FA6140';
    const s = mdSeries(q, MD_FILTER), min = Math.min(...s.values), max = Math.max(...s.values);
    return `<div class="ms-white">${flt}${lineInteractive('mdc', s.values, color, { avg: s.avg, axes: true, area: it.viz !== 'line', labels: s.labels, valStrs: s.values.map(v => v + ' ' + it.unit) })}</div>
      <div class="ms-lower">${scheduleCard}
        <div class="ms-card ms-stats">${msStat('Average', s.avg + ' ' + it.unit)}${msStat('Minimum', min + ' ' + it.unit)}${msStat('Maximum', max + ' ' + it.unit)}</div>
        <div class="ms-card" data-searchbox><div class="ms-card-t">${q} History</div>${listSearch('.ms-row')}<div class="ms-hist">${msRows(q, v => v + ' ' + it.unit)}</div><div class="ls-empty">No matching entries</div></div>
      </div>`;
  }
  if (rt === 'scale') {
    const color = it.color || '#00AFD6';
    const s = mdSeries(q, MD_FILTER), vals = s.values.map(v => Math.round(v)), min = Math.min(...vals), max = Math.max(...vals);
    const avg = +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1), prog = seriesFor(q).slice(-4);
    // Honour the type's assigned graph: bars/lolli/dots/gauge render enlarged in
    // the white area (mini renderers reused, scaled by .ms-viz); anything else
    // falls back to the interactive line.
    const scaleViz = it.viz === 'bars' ? `<div class="ms-viz">${v2Bars(vals, color)}</div>`
      : it.viz === 'lolli' ? `<div class="ms-viz">${v2Lolli(vals, color)}</div>`
      : it.viz === 'dots' ? `<div class="ms-viz">${v2Dots(vals, color)}</div>`
      : it.viz === 'gauge' ? `<div class="ms-viz ms-viz-gauge">${v2Gauge(vals[vals.length - 1], it.max, color)}</div>`
      : lineInteractive('mdc', s.values, color, { avg, axes: true, labels: s.labels, valStrs: s.values.map(v => Math.round(v) + ' / ' + it.max) });
    return `<div class="ms-white">${flt}${scaleViz}</div>
      <div class="ms-lower">${scheduleCard}
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
    // Honour the assigned graph: donut renders enlarged in the white area (the
    // distribution card below always stays as the numeric breakdown).
    const listViz = it.viz === 'donut' ? `<div class="ms-viz ms-viz-donut">${v2Donut(it, vals, it.color || '#37BD69')}</div>` : '';
    return `<div class="ms-white">${flt}${listViz}</div>
      <div class="ms-lower">${scheduleCard}
        <div class="ms-card ms-stats">${msStat('Current', it.value)}${msStat('Most Frequent', freq)}${msStat('Records', vals.length)}</div>
        <div class="ms-card"><div class="ms-card-t">Distribution</div>
          ${it.options.map(o => `<div class="bd-row"><div class="bd-top"><span>${o}</span><b>${dist[o]}×</b></div><div class="bd-bar"><i style="width:${Math.round(dist[o] / maxC * 100)}%;background:${col(o)}"></i></div></div>`).join('')}</div>
        <div class="ms-card" data-searchbox><div class="ms-card-t">${q} History</div>${listSearch('.ms-row')}<div class="ms-hist">${msRows(q, v => v, v => col(v) + '22')}</div><div class="ls-empty">No matching entries</div></div>
      </div>`;
  }
  // TEXT: no chart/filter — feature the latest note, then a searchable timeline of all entries
  const ntext = catNewest(q);
  const notes = catSessions(q).map((r, i) => ({ by: r.by, date: r.date, time: r.time, text: ntext[i] }));
  const latest = notes[0];
  return `<div class="ms-white">
      <div class="ms-latest">
        <div class="ms-latest-lab">Latest entry · ${latest.date}</div>
        <div class="ms-latest-q">“${latest.text}”</div>
        <div class="ms-latest-by">— ${latest.by}</div>
      </div></div>
    <div class="ms-lower">${scheduleCard}
      <div class="ms-card" data-searchbox><div class="ms-card-t">All Observations · ${notes.length}</div>${listSearch('.md-note', 'Search observations')}
        <div class="md-timeline">${notes.map(n => `<div class="md-note"><span class="md-note-dot"></span><div class="md-note-body"><div class="mn-m">${n.date} · ${n.by}</div><div class="mn-q">${n.text}</div></div></div>`).join('')}</div><div class="ls-empty">No matching observations</div></div>
    </div>`;
}
function metricSheetHTML(q) {
  const title = q === 'Observation Notes' ? 'Observations' : q;
  return `<div class="ms-head"><div class="ms-title">${title}</div><button class="ms-x" onclick="closeSheet2()">✕</button></div>
    <div id="mdSheetBody">${metricSheetInner(q)}</div>`;
}

/* ===========================================================================
   ADD ENTRY bottom sheet — opened from the "+" on an assessment card. The form
   adapts to the assessment's response type:
     numeric → value input + unit + notes ·  text → free-text area
     list    → selectable option cards     ·  scale → numbered scale options
   =========================================================================== */
const AE_CLOCK = '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.7"/><path d="M12 7.5V12l3 2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const AE_CHECK = '<svg viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const AE_DESC = 'Record a new reading for this assessment. Set the date and time, enter the value, and add any notes for the keeper log.';
/* optional human labels for a few welfare scales; otherwise the number stands alone */
const AE_SCALE_LABELS = {
  'Body Condition Score': ['Emaciated', 'Very Thin', 'Thin', 'Lean', 'Ideal', 'Stout', 'Overweight', 'Obese', 'Severely Obese'],
  'Hydration Status': ['Severely Dehydrated', 'Dehydrated', 'Mild', 'Adequate', 'Optimal'],
};
/* selectable unit options per base unit (so the dropdown actually has choices) */
const AE_UNITS = { 'kg': ['kg', 'g', 'lb'], '°C': ['°C', '°F'], 'g': ['g', 'kg'], 'ml': ['ml', 'L'], '%': ['%'], 'bpm': ['bpm'], 'dB': ['dB'], '/day': ['/day'] };
function aeUnits(u) { return AE_UNITS[u] || [u]; }
function aeSelect(el) {
  const grp = el.parentElement;
  grp.classList.remove('ae-err');
  grp.querySelectorAll('.ae-opt').forEach(o => o.classList.remove('on'));
  el.classList.add('on');
}
function addEntrySheet(q) {
  const it = catType(q); if (!it) return '';
  const rt = it.rt, cat = it.cat;
  const dt = `<div class="ae-dt">
    <label class="ae-field"><span class="ae-fic">${I2.cal}</span><input class="ae-field-in" type="date" value="2024-03-12"></label>
    <label class="ae-field"><span class="ae-fic">${AE_CLOCK}</span><input class="ae-field-in" type="time" value="16:38"></label>
  </div>`;
  let body = '';
  if (rt === 'numeric') {
    const units = aeUnits(it.unit);
    body = `<div class="ae-numrow">
        <input class="ae-input" type="text" inputmode="decimal" placeholder="Enter value" autofocus oninput="this.classList.remove('ae-err')">
        <div class="ae-unit-wrap"><select class="ae-unit">${units.map(u => `<option ${u === it.unit ? 'selected' : ''}>${u}</option>`).join('')}</select><span class="ae-uchev">${I2.chevDown}</span></div>
      </div>
      <textarea class="ae-notes" rows="1" placeholder="Add Notes"></textarea>`;
  } else if (rt === 'text') {
    body = `<textarea class="ae-textarea" rows="3" placeholder="Text input" oninput="this.classList.remove('ae-err')"></textarea>`;
  } else if (rt === 'list') {
    const cur = catNewest(q)[0];
    body = `<div class="ae-opts">${it.options.map(o =>
      `<button class="ae-opt ${o === cur ? 'on' : ''}" onclick="aeSelect(this)">
         <span class="ae-olab">${o}</span><span class="ae-check">${AE_CHECK}</span></button>`).join('')}</div>`;
  } else if (rt === 'scale') {
    const cur = Math.round(catNewest(q)[0]), labs = AE_SCALE_LABELS[q] || [];
    body = `<div class="ae-opts">${Array.from({ length: it.max }, (_, i) => {
      const lvl = i + 1, lab = labs[i];
      return `<button class="ae-opt ae-scale ${lvl === cur ? 'on' : ''}" onclick="aeSelect(this)">
         <span class="ae-num">${lvl}</span>${lab ? `<span class="ae-olab">${lab}</span>` : ''}<span class="ae-check">${AE_CHECK}</span></button>`;
    }).join('')}</div>`;
  }
  return `<div class="ae-head">
      <div class="ae-htext"><div class="ae-title">${qLabel(q)}</div><div class="ae-cat">${cat}</div></div>
      <button class="ae-x" onclick="closeSheet2()">✕</button>
    </div>
    <div class="ae-body">
      <div class="ae-desc">${AE_DESC}</div>
      ${dt}
      ${body}
    </div>
    <div class="ae-foot">
      <button class="ae-cancel" onclick="closeSheet2()">Cancel</button>
      <button class="ae-add" onclick="aeSubmit('${q}')">Add Entry</button>
    </div>`;
}
function openAddEntry(q) { openSheet2(addEntrySheet(q)); }
const AE_MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function aeFmtDate(v) { if (!v) return CAT_SESS[0].date; const [y, m, d] = v.split('-').map(Number); return d + ' ' + AE_MON[(m || 1) - 1] + ' ' + y; }
function aeFmtTime(v) { if (!v) return CAT_SESS[0].time; let [h, mi] = v.split(':').map(Number); const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12; return h + ':' + String(mi).padStart(2, '0') + ' ' + ap; }
/* commit the Add Entry form → prepend a reading to USER_ENTRIES, then show its History */
function aeSubmit(q) {
  const it = catType(q); if (!it) return;
  const root = document.querySelector('.sheet2'); if (!root) return;
  const date = aeFmtDate(root.querySelector('input[type=date]') && root.querySelector('input[type=date]').value);
  const time = aeFmtTime(root.querySelector('input[type=time]') && root.querySelector('input[type=time]').value);
  let value, note = '';
  if (it.rt === 'numeric') {
    const inp = root.querySelector('.ae-input'), n = parseFloat((inp.value || '').trim());
    if (isNaN(n)) { inp.classList.add('ae-err'); inp.focus(); return; }
    value = +n.toFixed(it.dp != null ? it.dp : 1);
    const nt = root.querySelector('.ae-notes'); note = nt ? nt.value.trim() : '';
  } else if (it.rt === 'scale') {
    const sel = root.querySelector('.ae-opt.on .ae-num'); if (!sel) { root.querySelector('.ae-opts').classList.add('ae-err'); return; }
    value = parseInt(sel.textContent, 10);
  } else if (it.rt === 'list') {
    const sel = root.querySelector('.ae-opt.on .ae-olab'); if (!sel) { root.querySelector('.ae-opts').classList.add('ae-err'); return; }
    value = sel.textContent;
  } else {
    const ta = root.querySelector('.ae-textarea'), txt = (ta.value || '').trim();
    if (!txt) { ta.classList.add('ae-err'); ta.focus(); return; }
    value = txt;
  }
  (USER_ENTRIES[q] = USER_ENTRIES[q] || []).unshift({ value, date, time, by: 'You', note });
  render2();        // refresh the landing so the card's latest value/date update
  openMetric(q);    // reopen on the metric sheet so the new reading shows at the top of History
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
