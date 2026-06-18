/* ===========================================================================
   Antz Welfare — Index 2 runtime
   Figma-replica build. Router + reusable component kit + screens.
   Mirrors v1 architecture: SCREENS.<key>() returns an HTML string, navigated
   via go()/back(), rendered into #viewport. Keep every screen on this kit so
   the design system stays consistent across the whole flow.
   =========================================================================== */

/* --------------------------------------------------------------- ICONS ---- */
/* 24x24 Material-style glyphs matching the Figma node set. */
const I2 = {
  back:    '<svg viewBox="0 0 24 24" fill="none"><path d="M20 12H4M4 12l6-6M4 12l6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  star:    '<svg viewBox="0 0 24 24" fill="none"><path d="M12 3.5l2.6 5.27 5.82.85-4.21 4.1.99 5.8L12 16.77 6.8 19.5l.99-5.8-4.21-4.1 5.82-.85L12 3.5z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  qr:      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v2h-3v-2zm-5 0h3v3h-2v-1h-1v-2zm5 5h3v3h-3v-1h-2v-2h2v0zm-5 0h2v3h-2v-3z"/></svg>',
  more:    '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>',
  pencil:  '<svg viewBox="0 0 24 24" fill="none"><path d="M14.5 5.5l4 4M4 20l1-4L16 5l3 3L8 19l-4 1z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  chevDown:'<svg viewBox="0 0 24 24" fill="none"><path d="M7 10l5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  chevR:   '<svg viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  home:    '<svg viewBox="0 0 24 24" fill="none"><path d="M4 11l8-6 8 6M6 9.5V19h12V9.5M10 19v-4h4v4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  search:  '<svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.8"/><path d="M16.5 16.5L21 21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  spark:   '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.6 5.4L19 9l-5.4 1.6L12 16l-1.6-5.4L5 9l5.4-1.6L12 2z"/><path d="M19 14l.8 2.7L22.5 17.5l-2.7.8L19 21l-.8-2.7-2.7-.8 2.7-.8L19 14z" opacity=".7"/></svg>',
  cal:     '<svg viewBox="0 0 24 24" fill="none"><rect x="3.5" y="5" width="17" height="15" rx="3" stroke="currentColor" stroke-width="1.7"/><path d="M3.5 9.5h17M8 3v4M16 3v4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  photo:   '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="4.5" width="18" height="15" rx="3" stroke="currentColor" stroke-width="1.7"/><circle cx="8.5" cy="9.7" r="1.8" fill="currentColor"/><path d="M3.6 17.5 9 12.6l3.4 3 3.3-3.2 4.7 4.6" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
};

/* ------------------------------------------------------------- ROUTER ----- */
const SCREENS2 = {};
const NAV = { stack: ['amOverview'], params: {} };

let LAST_RENDER_KEY = null;
function render2() {
  const key = NAV.stack[NAV.stack.length - 1];
  const fn = SCREENS2[key] || SCREENS2.amOverview;
  // Re-rendering the same screen (filter/tab/toggle change) rebuilds .scroll and
  // would jump back to the top. Preserve the scroll position in that case; on a
  // real navigation to a different screen, start at the top.
  const prev = document.querySelector('#viewport .scroll');
  const savedTop = (prev && key === LAST_RENDER_KEY) ? prev.scrollTop : 0;
  document.getElementById('viewport').innerHTML = fn(NAV.params[key] || {});
  if (savedTop) {
    const next = document.querySelector('#viewport .scroll');
    if (next) next.scrollTop = savedTop;
  }
  LAST_RENDER_KEY = key;
  if (document.getElementById('assessSvg')) requestAnimationFrame(mountAssessChart);
}
function go2(key, params) {
  NAV.stack.push(key);
  if (params) NAV.params[key] = params;
  render2();
}
function back2() {
  if (NAV.stack.length > 1) NAV.stack.pop();
  render2();
}

/* ------------------------------------------------- REUSABLE COMPONENT KIT -- */
/* Keep new screens built from THESE helpers so the look stays identical. */

function heroHeader({ photo, name, latin, lines = [], aid }) {
  return `
  <div class="hero" style="background-image:url('${photo}')">
    <div class="appbar">
      <button class="ab-btn ab-back" onclick="back2()">${I2.back}</button>
      <div class="ab-right">
        <button class="ab-btn">${I2.star}</button>
        <button class="ab-btn">${I2.qr}</button>
        <button class="ab-btn">${I2.more}</button>
      </div>
    </div>
    <div class="hero-spacer"></div>
    <div class="animal-card">
      <div class="ac-name">${name}</div>
      ${latin ? `<div class="ac-latin">(${latin})</div>` : ''}
      ${lines.map(l => `<div class="ac-line">${l}</div>`).join('')}
      ${aid ? `<div class="ac-aid">AID: ${aid}</div>` : ''}
    </div>
  </div>`;
}

function tabsBar(tabs, activeKey, onSelect) {
  return `<div class="tabsbar"><div class="tabs">
    ${tabs.map(t => `<button class="tab ${t.key === activeKey ? 'active' : ''}"
        onclick="${onSelect}('${t.key}')">${t.label}</button>`).join('')}
  </div></div>`;
}

function field(label, value) {
  return `<div class="field"><div class="f-label">${label}</div><div class="f-value">${value}</div></div>`;
}

function sectionCard(title, bodyHTML) {
  return `<div class="card card-pad">
    <div class="sec-head"><span class="sh-icon">${I2.home}</span><span class="sh-title">${title}</span></div>
    <div class="sec-body">${bodyHTML}</div>
  </div>`;
}

/* smooth area spark line for the Assessments chart */
function sparkChart(data, { color = 'var(--chart-green)', w = 326, h = 92 } = {}) {
  const pad = 6, iw = w - pad * 2, ih = h - pad * 2;
  const lo = Math.min(...data), hi = Math.max(...data), rng = (hi - lo) || 1;
  const X = i => pad + (i / (data.length - 1)) * iw;
  const Y = v => pad + (1 - (v - lo) / rng) * ih;
  const pts = data.map((v, i) => [X(i), Y(v)]);
  // catmull-rom -> bezier smoothing
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  const last = pts[pts.length - 1];
  const area = d + ` L ${last[0].toFixed(1)} ${h} L ${pts[0][0].toFixed(1)} ${h} Z`;
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
    <defs><linearGradient id="sparkfill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${color}" stop-opacity=".18"/>
      <stop offset="1" stop-color="${color}" stop-opacity="0"/>
    </linearGradient></defs>
    <path d="${area}" fill="url(#sparkfill)"/>
    <path d="${d}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="4" fill="${color}"/>
  </svg>`;
}

/* ===========================================================================
   SCREEN — Animal Profile · Overview tab  (Figma node 66144:46145)
   =========================================================================== */
const ANIMAL = {
  photo: 'v2-assets/hero-macaque.png',
  name: 'Assam Macaque',
  latin: 'Anodorhynchus Hyacinthinus',
  lines: ['Enc: C1 enclosure', 'Female • 19y 2m old • 24 Animals'],
  aid: '123451234567890',
  fields: [
    ['Life Stage', 'Juvenile'], ['Accession Date', '24 Jul 2024'],
    ['Organization', 'Exhibit'], ['From Institution', 'Mahima'],
    ['Collection Type', 'Rehab'], ['Locality', 'India'],
  ],
  identifiers: [['Animal Name', 'Exhibit'], ['DNA', '12345565']],
  enclosure: { id: 'MK001', lines: ['Enclosure type: Aviary', 'Section: Mount Kailash', 'Site: Gagwa'] },
};

/* ===========================================================================
   ASSESSMENT ACTIVITY DATA  (record COUNTS, not scores)
   Works regardless of assessment type — every bucket carries a breakdown by
   assessment type so the chart + tooltip stay type-agnostic.
   =========================================================================== */
const ASSESS_TYPES = ['Nutrition Assessment', 'Behaviour Assessment', 'Medical Observation', 'Physical Exam'];
const REC_CATS = {
  'Nutrition Assessment': '#37BD69',
  'Behaviour Assessment': '#8479F9',
  'Medical Observation':  '#00AFD6',
  'Physical Exam':        '#FA6140',
};
/* deterministic per-type split that always sums to `count` (each shown type >=1) */
function breakdownFor(count, seed) {
  if (count <= 0) return [];
  const order = [seed % 4, (seed + 1) % 4, (seed + 2) % 4];
  const uniq = [...new Set(order)].slice(0, Math.max(1, Math.min(3, count)));
  const parts = new Array(uniq.length).fill(1);
  let rem = count - uniq.length, j = 0;
  while (rem > 0) { parts[j % uniq.length]++; rem--; j++; }
  return uniq.map((t, i) => ({ type: ASSESS_TYPES[t], n: parts[i] }));
}
function makeBuckets(axis, full, counts, dates, prev) {
  return counts.map((c, i) => ({
    axis: axis[i], full: full[i], count: c, date: dates[i],
    prev: prev ? prev[i] : Math.max(0, Math.round(c * 0.8)),
    breakdown: breakdownFor(c, i * 3 + c),
  }));
}
const ASSESS = {
  total: 34,
  last: 'Today, 10:45 AM',
  Week: { unit: 'records per day', buckets: makeBuckets(
    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    [3, 5, 2, 6, 4, 7, 5],
    ['16 Jun 2025', '17 Jun 2025', '18 Jun 2025', '19 Jun 2025', '20 Jun 2025', '21 Jun 2025', '22 Jun 2025'],
    [2, 4, 3, 4, 3, 5, 4]) },
  Month: { unit: 'records per week', buckets: makeBuckets(
    ['W1', 'W2', 'W3', 'W4', 'W5'],
    ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
    [8, 12, 6, 14, 9],
    ['1–7 Jun 2025', '8–14 Jun 2025', '15–21 Jun 2025', '22–28 Jun 2025', '29 Jun–5 Jul 2025'],
    [6, 9, 7, 10, 8]) },
  Year: { unit: 'records per month', buckets: makeBuckets(
    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    [12, 18, 9, 22, 16, 27, 20, 25, 14, 19, 23, 17],
    ['Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025', 'May 2025', 'Jun 2025', 'Jul 2025', 'Aug 2025', 'Sep 2025', 'Oct 2025', 'Nov 2025', 'Dec 2025'],
    [10, 14, 11, 17, 13, 20, 16, 19, 12, 15, 18, 14]) },
};

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'medical', label: 'Medical' },
  { key: 'enclosures', label: 'Enclosures' },
  { key: 'records', label: 'Records' },
  { key: 'diet', label: 'Diet' },
  { key: 'notes', label: 'Notes' },
];

let AM_TAB = 'overview';
let ASSESS_SEG = 'Week';
let ACTIVE_TIP = false;
function setAmTab(k) { AM_TAB = k; render2(); }

/* ----------------------------------------------- ASSESSMENT ACTIVITY CHART -- */
/* Count-based volume bars (gradient green) + dashed "Previous period" line +
   gridlines/axis + legend. Bars grow declaratively (SVG <animate>); the
   previous line + dots fade in via mountAssessChart. Tap a column → popover. */
function smoothPath2(pts) {
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    d += ` C ${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)},`
       + ` ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)},`
       + ` ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}
/* activity series for a filter + assessment category ('All' = every assessment).
   Category series are a deterministic, weighted subset of the totals. */
const ACT_CAT_W = { 'Physical Health': 0.30, 'Behaviour': 0.22, 'Environment': 0.16, 'Mental Domain': 0.14, 'Nutrition': 0.18 };
const ACT_CAT_COLOR = { 'Physical Health': '#FA6140', 'Behaviour': '#8479F9', 'Environment': '#00AFD6', 'Mental Domain': '#E4A11B', 'Nutrition': '#37BD69' };
function actVals(filterKey, cat) {
  const bk = ASSESS[filterKey].buckets, axis = bk.map(b => b.axis), full = bk.map(b => b.full);
  if (!cat || cat === 'All') return { vals: bk.map(b => b.count), prev: bk.map(b => b.prev), axis, full, breakdown: bk.map(b => b.breakdown) };
  const wt = ACT_CAT_W[cat] || 0.2, seed = cat.length * 7;
  const vals = bk.map((b, i) => Math.max(0, Math.round(b.count * wt * (0.85 + 0.3 * (((seed + i * 13) % 10) / 10)))));
  const prev = bk.map((b, i) => Math.max(0, Math.round(b.prev * wt * (0.80 + 0.3 * (((seed + i * 7) % 10) / 10)))));
  return { vals, prev, axis, full, breakdown: vals.map(v => [{ type: cat, n: v }]) };
}
/* Apple-Fitness-style dual chart: cumulative trend line (current vs previous)
   on top + per-bucket bars with an average line below; scrubbable marker.
   Geometry is stashed on window.__AC for the scrub/tap interactions. */
function assessChartSVG(filterKey, cat) {
  cat = cat || 'All';
  const GREEN = '#37BD69', GHOST = '#DFE8E3';
  const d = actVals(filterKey, cat);
  const vals = d.vals, prev = d.prev, axis = d.axis, full = d.full, breakdown = d.breakdown;
  const n = vals.length, cur = n - 1;

  const w = 340, pl = 8, pr = 28, pt = 16, pb = 26, iw = w - pl - pr, h = 184, ih = h - pt - pb;
  const slot = iw / n, X = i => pl + slot * i + slot / 2;
  const bwC = Math.min(18, slot * 0.5), bwP = Math.min(26, slot * 0.72);
  const max = Math.max(...vals, ...prev, 1), niceTop = Math.max(4, Math.ceil(max * 1.18 / 4) * 4);
  const base = pt + ih, Y = v => pt + (1 - v / niceTop) * ih;
  const avg = vals.reduce((s, v) => s + v, 0) / n;

  // gridlines + single count axis on the right (0 / mid / top)
  let grid = '';
  [0, niceTop / 2, niceTop].forEach(val => {
    const y = Y(val);
    grid += `<line x1="${pl}" y1="${y.toFixed(1)}" x2="${w - pr}" y2="${y.toFixed(1)}" stroke="rgba(0,0,0,0.05)" stroke-width="1"/>`
          + `<text class="ac-ylab" x="${w - 4}" y="${(y + 3).toFixed(1)}" text-anchor="end">${Math.round(val)}</text>`;
  });
  // previous-period ghost bars (behind) — the "vs last period" comparison
  let ghost = '';
  prev.forEach((v, i) => {
    const bh = (v / niceTop) * ih, x = X(i) - bwP / 2, y = base - bh;
    ghost += `<rect class="ac-ghost" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${bwP.toFixed(1)}" height="${Math.max(0, bh).toFixed(1)}" rx="5" fill="${GHOST}"/>`;
  });
  // average line (dashed) + label
  const ay = Y(avg);
  const avgLine = `<line x1="${pl}" y1="${ay.toFixed(1)}" x2="${w - pr}" y2="${ay.toFixed(1)}" stroke="${GREEN}" stroke-width="1.3" stroke-dasharray="4 4" opacity=".7"/>`
    + `<text x="${w - 4}" y="${(ay - 5).toFixed(1)}" text-anchor="end" class="ac-avglab">avg ${Math.round(avg)}</text>`;
  // current-period bars (front), latest emphasised
  let bars = '';
  vals.forEach((v, i) => {
    const bh = (v / niceTop) * ih, x = X(i) - bwC / 2, y = base - bh, fill = i === cur ? GREEN : 'url(#acbar)';
    bars += `<rect class="ac-bar" data-i="${i}" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${bwC.toFixed(1)}" height="${Math.max(0, bh).toFixed(1)}" rx="5" fill="${fill}">`
          + `<animate attributeName="height" values="0;${Math.max(0, bh).toFixed(1)}" dur="0.5s" begin="${(i * 0.04).toFixed(2)}s" fill="freeze" calcMode="spline" keySplines="0.33 0 0.2 1" keyTimes="0;1"/>`
          + `<animate attributeName="y" values="${base};${y.toFixed(1)}" dur="0.5s" begin="${(i * 0.04).toFixed(2)}s" fill="freeze" calcMode="spline" keySplines="0.33 0 0.2 1" keyTimes="0;1"/></rect>`;
  });
  const labels = axis.map((ax, i) => `<text class="ac-xlab ${i === cur ? 'cur' : ''}" data-i="${i}" x="${X(i).toFixed(1)}" y="${h - 7}" text-anchor="middle">${ax}</text>`).join('');
  const overlay = `<rect id="acScrubArea" x="${pl}" y="${pt}" width="${iw}" height="${ih}" fill="transparent" style="cursor:pointer;touch-action:none" onpointerdown="assessTap(event)" onpointermove="assessScrub(event)" onpointerleave="assessScrubEnd()"/>`;

  window.__AC = { w, h, xs: vals.map((_, i) => +X(i).toFixed(1)), topY: vals.map(v => +Y(v).toFixed(1)), prevTop: prev.map(v => +Y(v).toFixed(1)), vals, prev, full, axis, breakdown, cat, filter: filterKey, cur };

  return `<svg id="assessSvg" class="ac-svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet">
    <defs><linearGradient id="acbar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#63D293"/><stop offset="1" stop-color="#41C074"/></linearGradient></defs>
    ${grid}${ghost}${avgLine}${bars}${labels}${overlay}
  </svg>`;
}

/* premium entrance: bars grow (SVG animate) · green line draws on · grey line +
   marker fade in */
function mountAssessChart() {
  const svg = document.getElementById('assessSvg'); if (!svg) return;
  const prev = svg.querySelector('.ac-prev');
  if (prev) {
    prev.style.transition = 'none'; prev.style.opacity = '0';
    void prev.getBoundingClientRect();
    prev.style.transition = 'opacity 500ms ease 420ms'; prev.style.opacity = '.95';
  }
  const line = svg.querySelector('.ac-line'), fill = svg.querySelector('.ac-cfill');
  if (line) {
    const len = line.getTotalLength ? line.getTotalLength() : 700;
    line.style.transition = 'none'; line.style.strokeDasharray = len; line.style.strokeDashoffset = len;
    void line.getBoundingClientRect();
    line.style.transition = 'stroke-dashoffset 850ms cubic-bezier(.33,0,.2,1)'; line.style.strokeDashoffset = '0';
  }
  if (fill) { fill.style.transition = 'none'; fill.style.opacity = '0'; void fill.getBoundingClientRect(); fill.style.transition = 'opacity 700ms ease 250ms'; fill.style.opacity = '1'; }
  const mk = svg.querySelector('#acMarker');
  if (mk) { mk.style.transition = 'none'; mk.style.opacity = '0'; void mk.getBoundingClientRect(); mk.style.transition = 'opacity 300ms ease 650ms'; mk.style.opacity = '1'; }
}
/* ---- scrub micro-interaction: hover/drag moves the marker + value bubble ---- */
function acIdxFromEvent(e) {
  const C = window.__AC, svg = document.getElementById('assessSvg'); if (!C || !svg) return -1;
  const r = svg.getBoundingClientRect(), vx = (e.clientX - r.left) / r.width * C.w;
  let idx = 0, best = 1e9; for (let i = 0; i < C.xs.length; i++) { const dd = Math.abs(C.xs[i] - vx); if (dd < best) { best = dd; idx = i; } }
  return idx;
}
function acBoldLabel(i) { document.querySelectorAll('#assessSvg .ac-xlab').forEach(t => t.classList.toggle('cur', +t.dataset.i === i)); }
function assessScrub(e) {
  const C = window.__AC; if (!C) return;
  const idx = acIdxFromEvent(e); if (idx < 0) return;
  svgActiveDot(idx); acBoldLabel(idx);
  const tip = document.getElementById('acScrubTip'), svg = document.getElementById('assessSvg'), card = document.getElementById('assessCard');
  if (tip && svg && card) {
    const sr = svg.getBoundingClientRect(), cr = card.getBoundingClientRect();
    tip.innerHTML = `<b>${C.vals[idx]}</b><i>${C.axis[idx]}</i>`; tip.style.display = 'block';
    tip.style.left = ((sr.left - cr.left) + C.xs[idx] / C.w * sr.width) + 'px';
    tip.style.top = ((sr.top - cr.top) + C.topY[idx] / C.h * sr.height - 12) + 'px';
  }
}
function assessScrubEnd() {
  const C = window.__AC; if (C) { svgActiveDot(-1); acBoldLabel(C.cur); }
  const tip = document.getElementById('acScrubTip'); if (tip) tip.style.display = 'none';
}
function assessTap(e) { const idx = acIdxFromEvent(e); if (idx < 0) return; if (e.stopPropagation) e.stopPropagation(); showAssessTipAt(idx); }

/* filter switch — fade previous chart out, swap, transition new chart in */
function selectSeg(f) {
  if (f === ASSESS_SEG) return;
  ASSESS_SEG = f; hideAssessTip();
  document.querySelectorAll('#assessSeg .seg').forEach(b => b.classList.toggle('active', b.dataset.seg === f));
  const wrap = document.getElementById('assessChart');
  wrap.style.transition = 'opacity 170ms ease'; wrap.style.opacity = '0';
  setTimeout(() => {
    wrap.innerHTML = assessChartSVG(f);
    wrap.style.opacity = '1';
    requestAnimationFrame(mountAssessChart);
  }, 180);
}

/* breakdown popover, anchored to a bucket's point via the stashed geometry */
function showAssessTipAt(i) {
  const C = window.__AC; if (!C) return;
  const tip = document.getElementById('assessTip'), card = document.getElementById('assessCard'), svg = document.getElementById('assessSvg');
  if (!tip || !card || !svg) return;
  const bd = C.breakdown[i] || [], cnt = C.vals[i];
  tip.innerHTML =
    `<div class="tip-day">${C.full[i]}</div>
     <div class="tip-count">${cnt} Records</div>
     <div class="tip-list">${bd.map(x =>
        `<div class="tip-row"><span><i style="background:${REC_CATS[x.type] || ACT_CAT_COLOR[C.cat] || '#37BD69'}"></i>${x.type}</span><b>${x.n}</b></div>`).join('')}</div>
     <button class="tip-link" onclick="openRecords(${i})">View Details →</button>`;
  tip.style.display = 'block'; tip.style.opacity = '0';
  const sr = svg.getBoundingClientRect(), cr = card.getBoundingClientRect();
  const cx = (sr.left - cr.left) + C.xs[i] / C.w * sr.width, cy = (sr.top - cr.top) + C.topY[i] / C.h * sr.height;
  const tw = tip.offsetWidth, th = tip.offsetHeight;
  const left = Math.max(8, Math.min(cx - tw / 2, cr.width - tw - 8));
  let top = cy - th - 14; const below = top < 4; if (below) top = cy + 18;
  tip.classList.toggle('below', below);
  tip.style.left = left + 'px'; tip.style.top = top + 'px';
  tip.style.setProperty('--caret', (cx - left) + 'px');
  svgActiveDot(i);
  requestAnimationFrame(() => { tip.style.opacity = '1'; tip.style.transform = 'translateY(0)'; });
  ACTIVE_TIP = true;
}
function showAssessTip(e, i) { if (e && e.stopPropagation) e.stopPropagation(); showAssessTipAt(i); }
function hideAssessTip() {
  const t = document.getElementById('assessTip');
  if (t) { t.style.display = 'none'; t.style.transform = 'translateY(4px)'; }
  svgActiveDot(-1); ACTIVE_TIP = false;
}
function svgActiveDot(i) {
  document.querySelectorAll('#assessSvg .ac-bar').forEach(b =>
    b.style.opacity = (i < 0 || +b.dataset.i === i) ? '1' : '0.4');
}
/* tooltip "View Details →" → Assessment Records, filtered for animal+date+filter */
function openRecords(i) {
  const b = ASSESS[ASSESS_SEG].buckets[i];
  hideAssessTip();
  go2('assessRecords', { animalId: 'mk001', filter: ASSESS_SEG, bucket: i, label: b.full, date: b.date });
}
/* right arrow → Animal Assessment Analytics (animal + filter + range) */
function openAnalytics() { go2('assessAnalytics', { animalId: 'mk001', filter: ASSESS_SEG }); }
function setAnalyticsFilter(f) {
  NAV.params.assessAnalytics = { ...(NAV.params.assessAnalytics || {}), filter: f };
  render2();
}
/* close popover on any outside tap (point taps stopPropagation, so they're safe) */
document.addEventListener('click', e => {
  if (!ACTIVE_TIP) return;
  const tip = document.getElementById('assessTip');
  if (tip && !tip.contains(e.target)) hideAssessTip();
});

SCREENS2.amOverview = () => {
  const a = ANIMAL;

  // --- Overview info grid card ---
  const infoCard = `<div class="card info-card">
    <button class="info-edit">${I2.pencil}</button>
    <div class="info-grid">${a.fields.map(([l, v]) => field(l, v)).join('')}</div>
    <div class="info-expand">${I2.chevDown}</div>
  </div>`;

  // --- Identifiers ---
  const identifiers = sectionCard('Identifiers',
    a.identifiers.map(([l, v]) => field(l, v)).join(''));

  // --- Assessment Summary card (interactive activity chart + analytics entry) ---
  const segs = ['Week', 'Month', 'Year'];
  const assessCard = `<div class="assess-card" id="assessCard">
    <div class="assess-head">
      <div class="ah-title">Assessments</div>
      <button class="ah-next" onclick="openAnalytics()" aria-label="Open assessment analytics">${I2.chevR}</button>
    </div>
    <div class="segment" id="assessSeg">
      ${segs.map(s => `<button class="seg ${s === ASSESS_SEG ? 'active' : ''}" data-seg="${s}" onclick="selectSeg('${s}')">${s}</button>`).join('')}
    </div>
    <div class="ac-wrap" id="assessChart">${assessChartSVG(ASSESS_SEG)}</div>
    <div class="stat-row">
      <div class="stat"><div class="st-num">${ASSESS.total}</div><div class="st-lab">Total Records</div></div>
      <div class="stat"><div class="st-date">${ASSESS.last}</div><div class="st-lab">Last Recorded On</div></div>
    </div>
    <div class="ac-tip" id="assessTip"></div>
  </div>`;

  // --- Enclosure ---
  const enc = a.enclosure;
  const enclosure = sectionCard('Enclosure', `
    <div class="detail-list">
      <div class="dl-head">${enc.id}</div>
      ${enc.lines.map(l => `<div class="dl-line">${l}</div>`).join('')}
    </div>`);

  const upcoming = (typeof overviewUpcomingContainer === 'function') ? overviewUpcomingContainer() : '';
  const body = AM_TAB === 'overview'
    ? `${infoCard}${identifiers}${assessCard}${upcoming}${enclosure}`
    : `<div style="padding:48px 16px;text-align:center;color:var(--neutral-secondary);font-size:14px">
         ${TABS.find(t => t.key === AM_TAB).label} — coming soon</div>`;

  return `<div class="screen active"><div class="scroll prof-scroll">
    ${heroHeader(a)}
    ${tabsBar(TABS, AM_TAB, 'setAmTab')}
    <div class="body">${body}</div>
    <div style="height:24px"></div>
  </div></div>`;
};

/* ===========================================================================
   SCREEN — Assessment Records  (drill-down from a chart point / "View Details")
   Filtered for: selected animal + selected date + current time filter.
   =========================================================================== */
function pageHeader(title, sub) {
  return `<div class="pg-head">
    <button class="pg-back" onclick="back2()">${I2.back}</button>
    <div class="pg-tt"><div class="pg-title">${title}</div>${sub ? `<div class="pg-sub">${sub}</div>` : ''}</div>
  </div>`;
}
/* expand a bucket's type-breakdown into individual record rows with times */
function expandRecords(b) {
  const times = ['09:15 AM', '10:45 AM', '11:30 AM', '01:10 PM', '02:40 PM', '03:20 PM', '04:05 PM', '05:25 PM'];
  const rows = []; let t = 0;
  b.breakdown.forEach(x => { for (let k = 0; k < x.n; k++) { rows.push({ type: x.type, time: times[t % times.length], cat: REC_CATS[x.type] }); t++; } });
  return rows;
}
SCREENS2.assessRecords = (p = {}) => {
  const b = ASSESS[p.filter].buckets[p.bucket];
  const rows = expandRecords(b);
  const chips = [ANIMAL.name, p.label, `${p.filter} filter`]
    .map(c => `<span class="chip">${c}</span>`).join('');
  const list = rows.map((r, i) => `<div class="rec-row" onclick="openDetail('${HISTORY[i % HISTORY.length].id}')">
      <span class="rec-dot" style="background:${r.cat}"></span>
      <div class="rec-body"><div class="rec-t">${r.type}</div><div class="rec-s">${b.date} · ${r.time}</div></div>
      <span class="rec-chev">${I2.chevR}</span></div>`).join('');
  return `<div class="screen active"><div class="scroll">
    ${pageHeader('Assessment Records', `${b.count} records · ${b.date}`)}
    <div class="body">
      <div class="chips">${chips}</div>
      <div class="card card-pad rec-list">${list}</div>
    </div><div style="height:24px"></div>
  </div></div>`;
};

/* ===========================================================================
   SCREEN — Animal Assessment Analytics  (right-arrow drill-down)
   Deeper view: activity chart + totals + breakdown by assessment type.
   =========================================================================== */
SCREENS2.assessAnalytics = (p = {}) => {
  const f = p.filter || 'Week', data = ASSESS[f], bk = data.buckets;
  ASSESS_SEG = f;   // keep tooltip/openRecords in sync with the analytics filter
  const total = bk.reduce((s, b) => s + b.count, 0);
  const peak = bk.reduce((m, b) => b.count > m.count ? b : m, bk[0]);
  const byType = {};
  bk.forEach(b => b.breakdown.forEach(x => { byType[x.type] = (byType[x.type] || 0) + x.n; }));
  const maxT = Math.max(...Object.values(byType), 1);
  const seg = ['Week', 'Month', 'Year'].map(s =>
    `<button class="seg ${s === f ? 'active' : ''}" data-seg="${s}" onclick="setAnalyticsFilter('${s}')">${s}</button>`).join('');
  const bars = Object.entries(byType).sort((a, b) => b[1] - a[1]).map(([t, n]) =>
    `<div class="bd-row"><div class="bd-top"><span>${t}</span><b>${n}</b></div>
       <div class="bd-bar"><i style="width:${Math.round(n / maxT * 100)}%;background:${REC_CATS[t]}"></i></div></div>`).join('');
  return `<div class="screen active"><div class="scroll">
    ${pageHeader('Assessment Analytics', `${ANIMAL.name} · ${ANIMAL.enclosure.id}`)}
    <div class="body">
      <div class="segment" style="margin-bottom:4px">${seg}</div>
      <div class="assess-card" id="assessCard">
        <div class="assess-head"><div class="ah-title">Activity · ${data.unit}</div></div>
        <div class="ac-wrap" id="assessChart">${assessChartSVG(f)}</div>
        <div class="ac-tip" id="assessTip"></div>
      </div>
      <div class="stat-row">
        <div class="stat"><div class="st-num">${total}</div><div class="st-lab">Records this ${f.toLowerCase()}</div></div>
        <div class="stat"><div class="st-num">${peak.count}</div><div class="st-lab">Peak · ${peak.axis}</div></div>
      </div>
      <div class="card card-pad">
        <div class="sec-head"><span class="sh-icon">${I2.home}</span><span class="sh-title">By Assessment Type</span></div>
        <div class="bd-list">${bars}</div>
      </div>
    </div><div style="height:24px"></div>
  </div></div>`;
};

/* ------------------------------------------------------------ BOOTSTRAP --- */
/* deep-link for demos: #analytics → land on the Details Page; otherwise Animal Profile */
document.addEventListener('DOMContentLoaded', () => {
  const h = location.hash.replace('#', '');
  if (h === 'analytics') { NAV.stack = ['amOverview', 'assessAnalytics']; NAV.params.assessAnalytics = { filter: 'Week' }; }
  render2();
});
