/* Assessments · iPad v4 — core (copied from v3/shared/core.js, then extended for the tablet interaction layer in touch.js).
   Data + persistence, formatting, response inputs, graph, history view, entry sheet, popover / viewer / toast,
   and the Assessment Masters section (same in every version). Each version registers its own Animals section:
     C.animals = { render() → html, click(act, el, e) → true if handled, after?(), start?(screen, arg) }
   Figma fAOcpkMwZPWEkHO3kMvNoy: Master 1485:8667 · User 1485:10626 · Components 1485:16978. */
'use strict';
const C = (() => {
/* ------------------------------------------------------------------ helpers */
const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const ic = (slug, color = 'var(--on-surface-variant)', size = '', extra = '') => `<span class="app-icon ${size} app-icon--tint i-${slug} ${extra}" style="color: ${color}" aria-hidden="true"></span>`;
const plural = (n, w, pl) => `${n} ${n === 1 ? w : (pl || w + 's')}`;
const TODAY = new Date(2026, 8, 29, 9, 41);
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fDate = d => `${d.getDate()} ${MON[d.getMonth()]} ${d.getFullYear()}`;
const fShort = d => `${d.getDate()} ${MON[d.getMonth()]}`;
const fTime = d => { let h = d.getHours(); const m = String(d.getMinutes()).padStart(2, '0'), ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12; return `${String(h).padStart(2, '0')}:${m} ${ap}`; };
const ago = d => { const min = Math.round((TODAY - d) / 60000); if (min < 1) return 'just now'; if (min < 60) return `${min} min ago`; const h = Math.round(min / 60); if (h < 24) return `${h} h ago`; const dd = Math.round(h / 24); return dd === 1 ? 'yesterday' : dd < 30 ? `${dd} days ago` : fShort(d); };
const isoDate = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const isoTime = d => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
const uid = () => Math.random().toString(36).slice(2, 9);
let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const pick = a => a[Math.floor(rnd() * a.length)];

/* ------------------------------------------------------------------ reference data */
const TYPES = [
  { key: 'text',   label: 'Text',           icon: 'notes',          hint: 'A free-text observation' },
  { key: 'number', label: 'Numeric Value',  icon: 'percentage',     hint: 'A number with a unit' },
  { key: 'list',   label: 'List',           icon: 'list',           hint: 'Pick one or more options' },
  { key: 'scale',  label: 'Numeric Scale',  icon: 'reason-or-list', hint: 'One scored option' },
  { key: 'slider', label: 'Numeric Slider', icon: 'filter-2',       hint: 'Drag to a value or range' },
];
const TYPE = k => TYPES.find(t => t.key === k);
const CATEGORIES = ['Physical Health', 'Behaviour', 'Environment'];
const MEASURES = { Weight: ['kg', 'g'], Temperature: ['°C', '°F'], 'Heart Rate': ['bpm'], Length: ['cm', 'm'], Volume: ['ml', 'L'], Percentage: ['%'], Count: ['count'] };
const IMG = { leopard: '../../../app/sample-leopard-84.png', cheetah: '../../../app/sample-cheetah-104.png', bird: '../../../app/sample-bird-44.png' };
const DOCTORS = ['Dr. Mehta', 'Dr. Swathi', 'Dr. Nitin', 'Dr. Mehta'];
const NOTES = ['Taken during the routine examination; animal was calm.', 'Slight change from last week, keep monitoring.', 'Observed after feeding.', 'Keeper reported the same in the morning round.'];
const MOODS = ['Calm, eating well', 'Alert and curious', 'Slightly withdrawn', 'Calm', 'Playful with enrichment', 'Resting most of the day', 'Restless before feeding'];
const DEFAULT_MASTERS = () => [
  { id: 'm1', name: 'Weight', cat: 'Physical Health', type: 'number', measure: 'Weight', unit: 'kg', active: true, templates: 4, desc: 'Body weight, measured on the ward scale.', refs: [] },
  { id: 'm2', name: 'Heart Rate', cat: 'Physical Health', type: 'slider', measure: 'Heart Rate', unit: 'bpm', min: 40, max: 180, minL: 'Poor', maxL: 'Extreme', step: 5, range: true, active: true, templates: 3, desc: 'Resting heart rate during the routine examination.', refs: [] },
  { id: 'm3', name: 'Eye Condition', cat: 'Physical Health', type: 'list', multi: true, items: ['Pain', 'Redness', 'Swelling', 'Discharge', 'Itchiness'], active: true, templates: 2, desc: 'Check both eyes for pain, redness, swelling or discharge.',
    refs: [{ kind: 'img', src: IMG.leopard, name: 'Healthy eye.jpg' }, { kind: 'img', src: IMG.cheetah, name: 'Mild redness.jpg' }, { kind: 'pdf', name: 'Eye scoring guide.pdf' }, { kind: 'img', src: IMG.leopard, name: 'Discharge.jpg' }] },
  { id: 'm4', name: 'Body Score', cat: 'Physical Health', type: 'scale', scale: [[1, 'Poor'], [4, 'Fair'], [6, 'Good'], [10, 'Excellent']], active: true, templates: 5, desc: 'Body condition from a visual and hands-on check.', refs: [{ kind: 'pdf', name: 'Body condition chart.pdf' }] },
  { id: 'm5', name: 'Temperature', cat: 'Physical Health', type: 'number', measure: 'Temperature', unit: '°C', active: true, templates: 1, desc: 'Rectal body temperature.', refs: [] },
  { id: 'm6', name: 'Activeness', cat: 'Behaviour', type: 'slider', measure: 'Count', unit: 'count', min: 0, max: 100, minL: 'Lowest', maxL: 'Highest', step: 5, range: false, active: true, templates: 0, desc: 'How active the animal was during observation.', refs: [] },
  { id: 'm7', name: 'Mood', cat: 'Behaviour', type: 'text', active: true, templates: 2, desc: 'Keeper and vet observation of mood.', refs: [] },
  { id: 'm8', name: 'Stress Behaviour', cat: 'Behaviour', type: 'list', multi: false, items: ['None', 'Pacing', 'Over-grooming', 'Hiding', 'Vocalising'], active: true, templates: 1, desc: 'Signs of stress seen during observation.', refs: [] },
  { id: 'm9', name: 'Feeding Behaviour', cat: 'Behaviour', type: 'text', active: false, templates: 0, desc: 'How the animal approaches food.', refs: [] },
  { id: 'm10', name: 'Humidity', cat: 'Environment', type: 'number', measure: 'Percentage', unit: '%', active: true, templates: 1, desc: 'Enclosure humidity at check time.', refs: [] },
  { id: 'm11', name: 'Enclosure Cleanliness', cat: 'Environment', type: 'scale', scale: [[1, 'Dirty'], [3, 'Acceptable'], [5, 'Clean']], active: false, templates: 0, desc: 'Cleanliness of the enclosure at check time.', refs: [] },
];
const ANIMALS = [
  { id: 'a1', tag: 'Ear Tag: 123456', aid: 'AID: 87546/24', species: 'Leopard', sci: 'Panthera pardus', g: 'male', img: IMG.leopard, site: 'Leopard Site', encl: 'Big Cat 2', list: ['Weight', 'Heart Rate', 'Eye Condition', 'Body Score', 'Temperature', 'Mood', 'Stress Behaviour', 'Humidity'], base: 58 },
  { id: 'a2', tag: 'Ear Tag: 234567', aid: 'AID: 87547/24', species: 'Cheetah', sci: 'Acinonyx jubatus', g: 'female', img: IMG.cheetah, site: 'Cheetah Site', encl: 'Run 1', list: ['Weight', 'Heart Rate', 'Eye Condition', 'Body Score', 'Mood', 'Activeness'], base: 42 },
  { id: 'a3', tag: 'BI23000123', small: true, aid: 'AID: 90112/25', species: 'Peach Fronted Conure', sci: 'Eupsittula aurea', g: 'male', img: IMG.bird, site: 'Aviary', encl: 'Aviary 3', list: ['Weight', 'Body Score', 'Mood', 'Activeness', 'Humidity'], base: 0.085 },
  { id: 'a4', tag: 'Ear Tag: 345678', aid: 'AID: 87548/24', species: 'Leopard', sci: 'Panthera pardus', g: 'female', img: IMG.leopard, site: 'Leopard Site', encl: 'Big Cat 1', list: ['Weight', 'Heart Rate', 'Eye Condition', 'Temperature', 'Stress Behaviour'], base: 36 },
  { id: 'a5', tag: 'Ear Tag: 456789', aid: 'AID: 87549/24', species: 'Cheetah', sci: 'Acinonyx jubatus', g: 'male', img: IMG.cheetah, site: 'Cheetah Site', encl: 'Run 2', list: ['Weight', 'Heart Rate', 'Body Score', 'Mood'], base: 51 },
  { id: 'a6', tag: 'BI23000456', small: true, aid: 'AID: 90113/25', species: 'Peach Fronted Conure', sci: 'Eupsittula aurea', g: 'female', img: IMG.bird, site: 'Aviary', encl: 'Aviary 3', list: ['Weight', 'Mood', 'Humidity'], base: 0.079 },
];
function seedRecords(masters) {
  seed = 11; const R = {};
  for (const a of ANIMALS) for (const name of a.list) {
    const m = masters.find(x => x.name === name); if (!m) continue;
    const list = [], bird = a.species.includes('Conure');
    let d = new Date(TODAY); d.setHours(d.getHours() - 1 - Math.floor(rnd() * 3));
    if (rnd() > .55) d = new Date(d.getTime() - (8 + Math.floor(rnd() * 7)) * 86400000);   // roughly half are due, so rounds have work
    let w = a.base * (bird ? 1000 : 1);
    const n = name === 'Stress Behaviour' && a.id === 'a4' ? 0 : 28 + Math.floor(rnd() * 20);
    for (let i = 0; i < n; i++) {
      let v, unit = m.unit;
      if (name === 'Weight') { w += (rnd() - .55) * (bird ? 2 : .8); v = Math.round(w * 10) / 10; unit = bird ? 'g' : 'kg'; }
      else if (name === 'Temperature') v = Math.round((37.6 + (rnd() - .5) * 1.4) * 10) / 10;
      else if (name === 'Humidity') v = Math.round(55 + rnd() * 15);
      else if (m.type === 'slider' && m.range) { const lo = 60 + Math.round(rnd() * 6) * 5; v = [lo, lo + 20 + Math.round(rnd() * 5) * 5]; }
      else if (m.type === 'slider') v = Math.round(rnd() * 20) * 5;
      else if (m.type === 'list') v = m.multi ? [...new Set([pick(m.items), ...(rnd() > .6 ? [pick(m.items)] : [])])] : [pick(m.items)];
      else if (m.type === 'scale') v = pick(m.scale)[0];
      else v = pick(MOODS);
      list.push({ id: uid(), t: new Date(d), v, unit, by: DOCTORS[i % 4], note: rnd() > .7 ? pick(NOTES) : '' });
      d = new Date(d.getTime() - (1 + Math.floor(rnd() * 5)) * 86400000 - Math.floor(rnd() * 5) * 3600000);
    }
    R[`${a.id}|${m.id}`] = list;
  }
  return R;
}

/* ------------------------------------------------------------------ persistence (shared by A, B, C) */
const KEY = 'antz-assessments-ipad-v3';
let DB;
function load() {
  try { const raw = localStorage.getItem(KEY); if (raw) { const j = JSON.parse(raw); for (const k in j.records) j.records[k].forEach(r => r.t = new Date(r.t)); DB = j; return; } } catch (e) { /* storage blocked → fresh */ }
  const masters = DEFAULT_MASTERS(); DB = { masters, records: seedRecords(masters) };
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(DB)); } catch (e) { /* keep in memory */ } }
function reset() { try { localStorage.removeItem(KEY); } catch (e) {} load(); }
load();
const M = id => DB.masters.find(m => m.id === id);
const MN = name => DB.masters.find(m => m.name === name);
const A = id => ANIMALS.find(a => a.id === id);
const recs = (aId, mId) => DB.records[`${aId}|${mId}`] || (DB.records[`${aId}|${mId}`] = []);
const animalMasters = a => a.list.map(MN).filter(Boolean).concat(DB.masters.filter(m => m.extraFor?.includes(a.id))).filter(m => m.active || recs(a.id, m.id).length);
const doneThisWeek = (a, m) => recs(a.id, m.id).some(r => TODAY - r.t < 7 * 86400000);
const dueOf = a => animalMasters(a).filter(m => !doneThisWeek(a, m));
function addRecord(a, m, r) { const rec = { id: uid(), by: 'Dr. Mehta', note: '', ...r }; const list = recs(a.id, m.id); list.push(rec); list.sort((p, q) => q.t - p.t); save(); return rec; }
function removeRecord(a, m, rec) { const list = recs(a.id, m.id), i = list.indexOf(rec); if (i > -1) list.splice(i, 1); save(); }

/* ------------------------------------------------------------------ values */
function fmt(m, r) {
  const v = r.v;
  if (m.type === 'number') return { v: String(v), u: r.unit || m.unit };
  if (m.type === 'slider') return { v: Array.isArray(v) ? `${v[0]} – ${v[1]}` : String(v), u: m.unit };
  if (m.type === 'scale') { const s = m.scale.find(x => +x[0] === +v); return { v: s ? `${s[0]} · ${s[1]}` : String(v), u: '' }; }
  if (m.type === 'list') return { v: v.join(', '), u: '' };
  return { v, u: '' };
}
const numOf = (m, r) => m.type === 'slider' && Array.isArray(r.v) ? (r.v[0] + r.v[1]) / 2 : +r.v;
const isNumeric = m => m.type === 'number' || m.type === 'slider';
function trend(m, list) {
  if (!isNumeric(m) || list.length < 2) return null;
  const d = numOf(m, list[0]) - numOf(m, list[1]); if (Math.abs(d) < 1e-9) return { dir: 'flat', txt: 'No change' };
  const dec = Math.abs(d) < 1 ? 1 : 0, u = m.type === 'slider' ? m.unit : (list[0].unit || m.unit);
  return { dir: d > 0 ? 'up' : 'down', txt: `${d > 0 ? '+' : '−'}${Math.abs(d).toFixed(dec)} ${u}` };
}
const trendHTML = t => t ? `<span class="trend trend--${t.dir} t-subtext-title">${t.dir === 'flat' ? '' : ic('dropdown', 'currentColor', 'app-icon--16', t.dir === 'up' ? 'chev-u' : '')}${esc(t.txt)}</span>` : '';
const RANGES = { W: 7, M: 30, '3M': 90, '6M': 180 };
const RANGE_LABEL = { W: 'Last 1 week', M: 'Last 1 month', '3M': 'Last 3 months', '6M': 'Last 6 months' };
const inRange = (list, key) => list.filter(r => TODAY - r.t <= RANGES[key] * 86400000);

/* ------------------------------------------------------------------ small building blocks */
const badge = a => `<span class="app-photo-badge app-photo-badge--${a.g} t-small">${a.g === 'male' ? 'M' : 'F'}</span>`;
const thumb = (a, size = 48) => `<span class="thumb" style="width:${size}px;height:${size}px"><img src="${a.img}" alt="">${badge(a)}</span>`;
const ring = (done, total) => `<span class="ring" style="--p:${total ? Math.round(done / total * 100) : 0}"><span class="t-small">${done}/${total}</span></span>`;
function refStrip(m, cls = '') {
  if (!m.refs?.length) return '';
  return `<div class="refs ${cls}">${m.refs.map((x, i) => `<button data-act="viewer" data-v="${m.id}" data-i="${i}" aria-label="${esc(x.name)}">${x.kind === 'img' ? `<img src="${x.src}" alt="">` : `<span class="doc">${ic('pdf', 'var(--tertiary)', 'app-icon--28')}</span>`}</button>`).join('')}</div>`;
}
function spark(vals, W = 96, H = 28) {
  if (vals.length < 2) return `<svg width="${W}" height="${H}"></svg>`;
  const lo = Math.min(...vals), hi = Math.max(...vals), span = hi - lo || 1;
  const pts = vals.map((v, i) => `${(i / (vals.length - 1)) * W},${H - 3 - ((v - lo) / span) * (H - 6)}`).join(' ');
  const col = vals[vals.length - 1] >= vals[0] ? 'var(--primary-main)' : 'var(--tertiary)';
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" aria-hidden="true"><polyline points="${pts}" fill="none" style="stroke:${col};stroke-width:1.5;stroke-linejoin:round;stroke-linecap:round"/></svg>`;
}
const seg = (items, cur, act, cls = 't-body-medium') => `<div class="app-segmented" data-seg="${act}">${items.map(([k, l]) => `<button class="app-segment ${k === cur ? 'app-segment--active t-subtext-title' : 't-subtext-regular'}" data-act="${act}" data-v="${k}">${l}</button>`).join('')}</div>`;

/* ------------------------------------------------------------------ graph (Components 1485:17171) */
const H = { range: 'M', chart: 'line', tip: null };   // history view state shared by every version
function graph(m, pts) {
  const W = 470, Hh = 200, L = 40, R = 12, T = 18, B = 26, pw = W - L - R, ph = Hh - T - B, range = m.type === 'slider' && m.range;
  const vals = pts.flatMap(r => range ? r.v : [numOf(m, r)]);
  let lo = Math.min(...vals), hi = Math.max(...vals); const pad = Math.max((hi - lo) * .2, Math.abs(hi) * .01, .5); lo -= pad; hi += pad;
  const t0 = TODAY - RANGES[H.range] * 86400000, t1 = +TODAY;
  const x = r => L + ((r.t - t0) / (t1 - t0)) * pw, y = v => T + ph - ((v - lo) / (hi - lo)) * ph;
  const dec = hi - lo > 10 ? 0 : 1, ticks = [0, 1, 2, 3, 4].map(i => lo + (hi - lo) * i / 4);
  const col = range || numOf(m, pts[pts.length - 1]) >= numOf(m, pts[0]) ? 'var(--primary-main)' : 'var(--tertiary)';
  let g = ticks.map(v => `<line class="grid" x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}"/><text class="axis t-small" x="${L - 8}" y="${y(v) + 3}" text-anchor="end">${v.toFixed(dec)}</text>`).join('');
  for (let i = 0; i <= 6; i++) { const d = new Date(t0 + (t1 - t0) * i / 6); g += `<text class="axis t-small" x="${L + pw * i / 6}" y="${Hh - 6}" text-anchor="middle">${RANGES[H.range] <= 7 ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()] : fShort(d)}</text>`; }
  const avg = vals.reduce((s, v) => s + v, 0) / vals.length, bw = Math.max(4, Math.min(20, pw / Math.max(pts.length, 1) * .55));
  let marks;
  if (range) marks = pts.map(r => `<rect x="${x(r) - bw / 2}" y="${y(r.v[1])}" width="${bw}" height="${Math.max(2, y(r.v[0]) - y(r.v[1]))}" rx="${Math.min(4, bw / 2)}" style="fill:${col}"/>`).join('');
  else if (H.chart === 'bar') marks = `<line class="avgline" x1="${L}" x2="${W - R}" y1="${y(avg)}" y2="${y(avg)}"/>` + pts.map(r => `<rect x="${x(r) - bw / 2}" y="${y(numOf(m, r))}" width="${bw}" height="${T + ph - y(numOf(m, r))}" rx="3" style="fill:${col}"/>`).join('');
  else {
    const P = pts.map(r => [x(r), y(numOf(m, r))]);
    const d = P.map((p, i) => i ? `C${(P[i - 1][0] + p[0]) / 2},${P[i - 1][1]} ${(P[i - 1][0] + p[0]) / 2},${p[1]} ${p[0]},${p[1]}` : `M${p[0]},${p[1]}`).join(' ');
    marks = `<defs><linearGradient id="gF" x1="0" x2="0" y1="0" y2="1"><stop offset="0" style="stop-color:${col};stop-opacity:.22"/><stop offset="1" style="stop-color:${col};stop-opacity:0"/></linearGradient></defs>
      <line class="avgline" x1="${L}" x2="${W - R}" y1="${y(avg)}" y2="${y(avg)}"/>
      ${P.length > 1 ? `<path d="${d} L${P[P.length - 1][0]},${T + ph} L${P[0][0]},${T + ph} Z" fill="url(#gF)"/><path d="${d}" fill="none" style="stroke:${col};stroke-width:2"/>` : ''}
      ${P.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="${pts.length > 20 ? 2 : 3.5}" style="fill:var(--on-primary);stroke:${col};stroke-width:2"/>`).join('')}`;
  }
  const hits = pts.map(r => { const f = fmt(m, r); return `<rect class="hit" x="${x(r) - 8}" y="${T}" width="16" height="${ph}" data-act="h-tip" data-v="${r.id}" data-cx="${x(r)}" data-cy="${y(range ? r.v[1] : numOf(m, r))}" data-label="${esc(`${f.v} ${f.u} · ${fShort(r.t)}`)}" data-top="${T}" data-bottom="${T + ph}" data-w="${W - R}" data-l="${L}"/>`; }).join('');
  let tip = ''; const tr = pts.find(r => r.id === H.tip);
  if (tr) { const f = fmt(m, tr), label = `${f.v} ${f.u} · ${fShort(tr.t)}`, tw = label.length * 6 + 16, tx = Math.min(Math.max(x(tr) - tw / 2, L), W - R - tw), ty = Math.max(0, y(range ? tr.v[1] : numOf(m, tr)) - 30);
    tip = `<g class="tip"><line x1="${x(tr)}" x2="${x(tr)}" y1="${T}" y2="${T + ph}" style="stroke:var(--on-primary-container);stroke-width:1"/><rect x="${tx}" y="${ty}" width="${tw}" height="22" rx="4"/><text class="t-small" x="${tx + tw / 2}" y="${ty + 14}" text-anchor="middle">${esc(label)}</text></g>`; }
  return `<svg viewBox="0 0 ${W} ${Hh}" role="img" aria-label="${esc(m.name)} over ${RANGE_LABEL[H.range].toLowerCase()}">${g}${marks}${hits}${tip}</svg>`;
}

/* ------------------------------------------------------------------ history view (graph + stats + refs + records) */
function historyHTML(a, m, opts = {}) {
  const all = recs(a.id, m.id), list = inRange(all, H.range);
  const rangeSeg = seg(Object.keys(RANGES).map(k => [k, k]), H.range, 'h-range');
  let summary = '';
  if (m.type !== 'text') {
    if (!list.length) summary = `<div class="empty t-body-regular">No readings in ${RANGE_LABEL[H.range].toLowerCase()}.</div>`;
    else if (isNumeric(m)) {
      const nums = list.map(r => numOf(m, r)), avg = nums.reduce((s, v) => s + v, 0) / nums.length, u = fmt(m, list[0]).u;
      const hiR = list[nums.indexOf(Math.max(...nums))], loR = list[nums.indexOf(Math.min(...nums))];
      const stat = (k, r, cls = '') => `<div class="stat"><span class="t-subtext-regular muted">${k}</span><span class="v${cls}"><span class="t-medium-medium">${esc(fmt(m, r).v)}</span> <span class="t-subtext-regular">${esc(u)}</span></span><span class="t-small muted">${fShort(r.t)}</span></div>`;
      summary = `<div class="graph-top"><div class="avg"><span class="t-small muted">AVERAGE</span><span class="ink"><span class="t-stat-title">${Math.round(avg * 10) / 10}</span> <span class="t-body-regular">${esc(u)}</span></span><span class="t-subtext-regular muted">${plural(list.length, 'reading')} · ${RANGE_LABEL[H.range].toLowerCase()}</span></div>
          ${m.range ? '' : `<div style="width:132px">${seg([['line', 'Line'], ['bar', 'Bar']], H.chart, 'h-chart')}</div>`}</div>
        <div class="graph">${graph(m, list.slice().reverse())}</div>
        <div class="stats">${stat('Latest', list[0])}${stat('Highest', hiR)}${stat('Lowest', loR, ' lo')}</div>`;
    } else {
      const counts = {}; list.forEach(r => (m.type === 'list' ? r.v : [fmt(m, r).v]).forEach(k => counts[k] = (counts[k] || 0) + 1));
      const top = Object.entries(counts).sort((p, q) => q[1] - p[1]).slice(0, 5);
      summary = `<div class="graph-top"><div class="avg"><span class="t-small muted">MOST FREQUENT</span><span class="t-major-medium ink">${esc(top[0][0])}</span><span class="t-subtext-regular muted">${plural(list.length, 'reading')} · ${RANGE_LABEL[H.range].toLowerCase()}</span></div></div>
        <div class="freq">${top.map(([k, n]) => `<div class="freq__row"><div class="top"><span class="t-body-regular">${esc(k)}</span><span class="t-subtext-regular muted">${plural(n, 'time')} · ${Math.round(n / list.length * 100)}%</span></div><div class="bar"><i style="width:${n / top[0][1] * 100}%"></i></div></div>`).join('')}</div>`;
    }
  }
  return `<div class="blk">${rangeSeg}${summary}</div>
    ${m.refs?.length ? `<div class="blk"><div class="blk__hd"><span class="t-minor-medium">References</span><span class="t-subtext-regular muted">${m.refs.length} files</span></div>${refStrip(m, 'refs--lg')}</div>` : ''}
    <div class="blk"><div class="blk__hd"><span class="t-minor-medium">All Records</span><span class="t-subtext-regular muted">${plural(list.length, 'reading')}</span></div>
      ${list.length ? `<div class="records">${list.map(r => recRow(m, r, opts.newId, opts.swipe)).join('')}</div>` : `<div class="empty t-body-regular">Nothing recorded in this period.</div>`}</div>`;
}
function recRow(m, r, newId, swipe) {
  const f = fmt(m, r), big = isNumeric(m);
  const row = `<div class="rec${r.id === newId ? ' is-new' : ''}" data-rec="${r.id}">
    <div class="rec__date"><span class="t-subtext-title">${fShort(r.t)} ${r.t.getFullYear()}</span><span class="t-subtext-regular muted">${fTime(r.t)}</span></div>
    <div class="rec__body"><span class="rec__val">${big ? `<span class="t-minor-title">${esc(f.v)}</span><span class="u t-subtext-regular">${esc(f.u)}</span>` : `<span class="t-body-medium">${esc(f.v)}</span>`}</span>
      ${r.note ? `<span class="rec__note t-subtext-regular">${ic('notes', 'var(--moderate-secondary)', 'app-icon--16')}${esc(r.note)}</span>` : ''}</div>
    <span class="rec__by t-subtext-regular">${esc(r.by)}</span></div>`;
  if (!swipe) return row;
  return `<div class="sw" data-lp="rec" data-v="${r.id}"><div class="sw__acts"><button class="sw__act sw__act--edit t-body-title" data-act="rec-edit" data-v="${r.id}">${ic('pencil', 'var(--on-primary)', 'app-icon--20')}Edit</button><button class="sw__act sw__act--del t-body-title" data-act="rec-del" data-v="${r.id}">${ic('delete', 'var(--on-primary)', 'app-icon--20')}Delete</button></div><div class="sw__row">${row}</div></div>`;
}

/* ------------------------------------------------------------------ response inputs */
const sliderDefaults = m => { const st = +m.step || 1, snap = v => Math.round(v / st) * st; return { lo: m.range ? snap(+m.min + (m.max - m.min) * .2) : +m.min, hi: snap(+m.min + (m.max - m.min) * (m.range ? .5 : .4)) }; };
function renderInput(m, st, o = {}) {
  const dis = o.readonly ? ' disabled' : '', big = o.big;
  if (m.type === 'text') return `<label class="app-field app-field--area${st.err ? ' app-field--error' : ''}"><textarea class="t-minor-regular" rows="${big ? 5 : 3}" placeholder="Type your observation" data-in-text${dis}>${esc(st.text || '')}</textarea></label>${st.err ? `<span class="field__err t-subtext-regular">${esc(st.err)}</span>` : ''}`;
  if (m.type === 'number' && o.pad) {   // tablet: an in-sheet number pad, so the system keyboard never covers the sheet
    const units = MEASURES[m.measure] || [m.unit], u = st.unit || o.unit || m.unit;
    return `<div class="pad-display${st.err ? ' is-err' : ''}" aria-live="polite"><span class="${st.value ? 'ink' : 'muted'} t-display-title">${esc(st.value || '0')}</span><span class="t-minor-regular navy">${esc(u)}</span>${o.last ? `<span class="t-subtext-regular muted" style="margin-left:auto">Last ${esc(o.last)}</span>` : ''}</div>
      ${units.length > 1 ? `<div data-units>${seg(units.map(x => [x, x]), u, 'pad-unit')}</div>` : ''}
      ${st.err ? `<span class="field__err t-subtext-regular">${esc(st.err)}</span>` : ''}
      <div class="numpad">${['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'del'].map(k => `<button type="button" class="numpad__k${k === 'del' || k === '.' ? ' numpad__k--fn' : ''} t-medium-medium" data-key="${k}" aria-label="${k === 'del' ? 'Delete' : k}">${k === 'del' ? ic('back', 'var(--on-surface-variant)') : k}</button>`).join('')}</div>`;
  }
  if (m.type === 'number') {
    const units = MEASURES[m.measure] || [m.unit];
    return `<div class="grid2"><label class="app-field${st.err ? ' app-field--error' : ''}"><span class="app-field__label t-subtext-regular">${esc(m.measure || 'Value')}</span><input class="${big ? 't-major-medium' : 't-minor-medium'}" type="text" inputmode="decimal" placeholder="0.0" value="${esc(st.value ?? '')}" data-in-num${dis}></label>
      <label class="app-field"><span class="app-field__label t-subtext-regular">Unit</span><select class="t-minor-medium" data-in-unit${dis}>${units.map(u => `<option${u === (st.unit || o.unit || m.unit) ? ' selected' : ''}>${u}</option>`).join('')}</select>${ic('dropdown')}</label></div>
      ${o.last ? `<span class="t-subtext-regular muted">Last: ${esc(o.last)}</span>` : ''}${st.err ? `<span class="field__err t-subtext-regular">${esc(st.err)}</span>` : ''}`;
  }
  if (m.type === 'list' || m.type === 'scale') {
    const multi = m.type === 'list' && m.multi, sel = st.sel || [];
    const opts = m.type === 'scale' ? m.scale.map(([n, l]) => ({ k: String(n), l: `<span class="t-minor-title">${esc(n)}</span>&nbsp;&nbsp;${esc(l)}` })) : m.items.map(i => ({ k: i, l: esc(i) }));
    return `<span class="t-subtext-regular muted">${multi ? 'Select all that apply' : 'Select one'}</span>
      <div class="${opts.length > 4 && !o.narrow ? 'opts--2' : 'opts'}">${opts.map(op => { const on = sel.includes(op.k), icn = multi ? (on ? 'checkbox-checked' : 'checkbox-unchecked') : (on ? 'radio-selected' : 'radio-unselect');
        return `<button type="button" class="app-radio${on ? ' app-radio--active' : ''} t-minor-regular" style="height:${big ? 56 : 48}px" data-opt="${esc(op.k)}" aria-pressed="${on}"${dis}><span class="lbl">${op.l}</span>${ic(icn, on ? 'var(--primary-container)' : 'var(--outline)')}</button>`; }).join('')}</div>
      ${st.err ? `<span class="field__err t-subtext-regular">${esc(st.err)}</span>` : ''}`;
  }
  if (m.type === 'slider') {
    const dv = sliderDefaults(m), lo = st.lo ?? dv.lo, hi = st.hi ?? dv.hi, min = +m.min, max = +m.max, pct = v => max > min ? ((v - min) / (max - min)) * 100 : 0;
    return `<div class="bigval"><span class="${big ? 't-display-title' : 't-large-title'}">${m.range ? `${lo} – ${hi}` : hi}</span><span class="t-minor-regular">${esc(m.unit)}</span></div>
      <div class="slider" data-slider role="slider" aria-valuemin="${min}" aria-valuemax="${max}" aria-valuenow="${hi}" tabindex="0"><div class="slider__track"></div><div class="slider__fill" style="left:${m.range ? pct(lo) : 0}%;width:${pct(hi) - (m.range ? pct(lo) : 0)}%"></div>${m.range ? `<div class="slider__knob" style="left:${pct(lo)}%"></div>` : ''}<div class="slider__knob" style="left:${pct(hi)}%"></div></div>
      <div class="slider__ends t-subtext-regular"><span><span class="t-subtext-title">${min}</span>${esc(m.minL || '')}</span><span><span class="t-subtext-title">${max}</span>${esc(m.maxL || '')}</span></div>`;
  }
  return '';
}
function wireInput(root, m, st, redraw, onAuto) {
  root.querySelectorAll('[data-key]').forEach(b => b.onclick = () => {
    let v = st.value || ''; const k = b.dataset.key;
    if (k === 'del') v = v.slice(0, -1); else if (k === '.') { if (!v.includes('.')) v = (v || '0') + '.'; } else { if (v.replace('.', '').length >= 6) return; v = v === '0' ? k : v + k; }
    st.value = v; st.err = ''; window.T?.haptic(); redraw();
  });
  root.querySelectorAll('[data-units] [data-act=pad-unit]').forEach(b => b.onclick = e => { e.stopPropagation(); st.unit = b.dataset.v; redraw(); });
  root.querySelectorAll('[data-opt]').forEach(b => b.onclick = () => {
    const k = b.dataset.opt, multi = m.type === 'list' && m.multi; st.sel = st.sel || []; st.err = '';
    st.sel = multi ? (st.sel.includes(k) ? st.sel.filter(x => x !== k) : [...st.sel, k]) : [k]; redraw();
    if (!multi && onAuto) onAuto();   // single choice: the pick is the answer
  });
  const sl = root.querySelector('[data-slider]');
  if (sl) {
    const min = +m.min, max = +m.max, step = +m.step || 1, dv = sliderDefaults(m);
    sl.onpointerdown = e => {
      e.preventDefault(); let which = null;
      const move = ev => { const r = sl.getBoundingClientRect(); const v = Math.min(max, Math.max(min, Math.round((min + Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width)) * (max - min)) / step) * step));
        const lo = st.lo ?? dv.lo, hi = st.hi ?? dv.hi; if (!which) which = m.range && Math.abs(v - lo) < Math.abs(v - hi) ? 'lo' : 'hi';
        if (which === 'lo') st.lo = Math.min(v, hi); else st.hi = Math.max(v, m.range ? lo : min); redraw(); };
      move(e); const up = () => { removeEventListener('pointermove', move); removeEventListener('pointerup', up); }; addEventListener('pointermove', move); addEventListener('pointerup', up);
    };
    sl.onkeydown = e => { if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return; e.preventDefault(); const d = e.key === 'ArrowRight' ? step : -step; st.hi = Math.min(max, Math.max(m.range ? (st.lo ?? dv.lo) : min, (st.hi ?? dv.hi) + d)); redraw(); root.querySelector('[data-slider]')?.focus(); };
  }
  const num = root.querySelector('[data-in-num]'); if (num) num.oninput = () => { const clean = num.value.replace(/[^0-9.]/g, ''); if (clean !== num.value) num.value = clean; st.value = clean; if (st.err) { st.err = ''; num.closest('.app-field').classList.remove('app-field--error'); root.querySelector('.field__err')?.remove(); } };
  const unit = root.querySelector('[data-in-unit]'); if (unit) unit.onchange = () => { st.unit = unit.value; };
  const tx = root.querySelector('[data-in-text]'); if (tx) tx.oninput = () => { st.text = tx.value; if (st.err) { st.err = ''; tx.closest('.app-field').classList.remove('app-field--error'); root.querySelector('.field__err')?.remove(); } };
}
/* mount an input into a container and keep it live */
function mountInput(box, m, st, o = {}, onAuto) { const go = () => { box.innerHTML = renderInput(m, st, o); wireInput(box, m, st, go, onAuto); window.T?.segments(box); }; go(); return go; }
/* read a value out of an input state; sets st.err when missing */
function readValue(m, st) {
  if (m.type === 'number') { if (st.value === undefined || st.value === '' || isNaN(+st.value)) { st.err = `Enter the ${(m.measure || 'value').toLowerCase()}.`; return null; } return { v: +st.value, unit: st.unit || st.defUnit || m.unit }; }
  if (m.type === 'text') { if (!st.text?.trim()) { st.err = 'Type an observation.'; return null; } return { v: st.text.trim() }; }
  if (m.type === 'list') { if (!st.sel?.length) { st.err = 'Choose at least one option.'; return null; } return { v: st.sel.slice() }; }
  if (m.type === 'scale') { if (!st.sel?.length) { st.err = 'Choose one option.'; return null; } return { v: +st.sel[0] }; }
  const dv = sliderDefaults(m); return { v: m.range ? [st.lo ?? dv.lo, st.hi ?? dv.hi] : (st.hi ?? dv.hi) };
}
const lastText = (a, m) => { const r = recs(a.id, m.id)[0]; if (!r) return ''; const f = fmt(m, r); return `${f.v}${f.u ? ' ' + f.u : ''} · ${ago(r.t)}`; };
const defaultUnit = (a, m) => recs(a.id, m.id)[0]?.unit || m.unit;

/* ------------------------------------------------------------------ entry sheet (used by B; A and C can open it for "more options") */
let SH = null;
function prefill(m, st, r) {
  if (m.type === 'number') { st.value = String(r.v); st.unit = r.unit; } else if (m.type === 'text') st.text = r.v;
  else if (m.type === 'list') st.sel = r.v.slice(); else if (m.type === 'scale') st.sel = [String(r.v)];
  else if (m.type === 'slider') { if (Array.isArray(r.v)) { st.lo = r.v[0]; st.hi = r.v[1]; } else st.hi = r.v; }
  st.err = '';
}
function entrySheet(a, m, onSaved, rec) {
  const st = { defUnit: rec?.unit || defaultUnit(a, m) }; if (rec) prefill(m, st, rec);
  const t0 = rec ? rec.t : TODAY, last = recs(a.id, m.id).find(r => r !== rec);
  SH = { a, m, st, date: isoDate(t0), time: isoTime(t0), note: rec?.note || '', onSaved, rec, last };
  const dLabel = () => SH.date === isoDate(TODAY) ? 'Today' : fDate(new Date(SH.date + 'T00:00'));
  const tLabel = () => { const [h, mi] = SH.time.split(':'); const d = new Date(TODAY); d.setHours(+h, +mi); return fTime(d); };
  $('sheet').innerHTML = `<div class="sheet__drag" data-drag><span class="sheet__grab"></span></div>
    <div class="sheet__hd" data-drag><div class="ttl"><span class="t-medium-medium navy">${rec ? `Edit ${esc(m.name)}` : esc(m.name)}</span><span class="t-subtext-regular muted">${esc(a.tag)} · ${esc(a.species)} · ${esc(m.cat)}</span></div><button class="x" data-sh="close" aria-label="Close">${ic('close')}</button></div>
    <div class="sheet__bd">
      ${m.desc && !rec ? `<p class="t-body-regular" style="margin:0">${esc(m.desc)}</p>` : ''}
      ${rec ? '' : refStrip(m)}
      <div style="display:flex;gap:var(--sp-8);flex-wrap:wrap;align-items:center"><label class="when t-body-medium">${ic('calendar', 'var(--on-primary-container)', 'app-icon--20')}<span data-when="date">${dLabel()}</span><input type="date" value="${SH.date}" max="${isoDate(TODAY)}" data-sh="date" aria-label="Date"></label>
        <label class="when t-body-medium">${ic('time', 'var(--on-primary-container)', 'app-icon--20')}<span data-when="time">${tLabel()}</span><input type="time" value="${SH.time}" data-sh="time" aria-label="Time"></label>
        ${last && !rec && m.type !== 'text' ? `<button class="when t-body-medium" data-sh="same" style="margin-left:auto">${ic('reset', 'var(--on-primary-container)', 'app-icon--20')}Same as last · ${esc(fmt(m, last).v)} ${esc(fmt(m, last).u)}</button>` : ''}</div>
      <div class="field" style="gap:var(--sp-12)" data-sheet-input></div>
      <label class="notes"><textarea class="t-body-regular" rows="1" placeholder="Add Notes (optional)" data-sh="note">${esc(SH.note)}</textarea></label>
    </div>
    <div class="actionbar"><button class="bigbtn bigbtn--ghost t-minor-medium" data-sh="close">Cancel</button><button class="bigbtn bigbtn--primary t-minor-medium" data-sh="save">${rec ? 'Save changes' : 'Add Entry'}</button></div>`;
  const box = $('sheet').querySelector('[data-sheet-input]');
  SH.redraw = mountInput(box, m, SH.st, { unit: SH.st.defUnit, pad: true, last: m.type === 'number' && last ? `${fmt(m, last).v} ${fmt(m, last).u}` : '' });
  $('sheet').querySelectorAll('[data-sh=date],[data-sh=time],[data-sh=note]').forEach(el => el.oninput = () => {
    SH[el.dataset.sh] = el.value;
    if (el.dataset.sh === 'date') $('sheet').querySelector('[data-when=date]').textContent = dLabel();
    if (el.dataset.sh === 'time') $('sheet').querySelector('[data-when=time]').textContent = tLabel();
  });
  $('sheet').querySelectorAll('label.when').forEach(w => w.addEventListener('click', () => { const i = w.querySelector('input'); try { i.showPicker(); } catch (e) { i.focus(); } }));
  const sheet = $('sheet'); sheet.style.transform = ''; sheet.dataset.detent = 'medium';
  $('scrimSheet').classList.add('on');
  requestAnimationFrame(() => { if (sheet.scrollHeight > $('app').clientHeight * .62) sheet.dataset.detent = 'large'; });
  window.T?.haptic();
  if (m.type === 'text') setTimeout(() => sheet.querySelector('[data-in-text]')?.focus({ preventScroll: true }), 260);
}
function closeSheet() { $('scrimSheet').classList.remove('on'); $('sheet').style.transform = ''; SH = null; }
function saveSheet() {
  const { a, m, st, rec: old } = SH, val = readValue(m, st);
  if (!val) { SH.redraw(); window.T?.shake($('sheet').querySelector('[data-sheet-input]')); return; }
  const [y, mo, d] = SH.date.split('-').map(Number), [h, mi] = SH.time.split(':').map(Number), t = new Date(y, mo - 1, d, h, mi);
  if (t > TODAY) { toast('Entries can’t be in the future'); return; }
  if (old) removeRecord(a, m, old);
  const rec = addRecord(a, m, { ...val, t, note: SH.note.trim(), ...(old ? { by: old.by } : {}) }), cb = SH.onSaved; closeSheet();
  window.T?.haptic(12); cb?.(rec);
  toast(old ? `${m.name} updated` : `${m.name} saved`, () => { removeRecord(a, m, rec); if (old) recs(a.id, m.id).push(old), recs(a.id, m.id).sort((p, q) => q.t - p.t), save(); render(); toast(old ? 'Change undone' : 'Entry removed'); });
}
function sheetSame() { if (!SH?.last) return; prefill(SH.m, SH.st, SH.last); SH.redraw(); window.T?.haptic(); }
function sheetKey(e) {   // hardware keyboard on the number pad
  if (!SH || SH.m.type !== 'number' || e.target.matches('textarea, input')) return false;
  const k = e.key === 'Backspace' ? 'del' : e.key; const b = $('sheet').querySelector(`[data-key="${CSS.escape(k)}"]`);
  if (b) { b.click(); b.classList.add('is-pressed'); setTimeout(() => b.classList.remove('is-pressed'), 120); return true; }
  if (e.key === 'Enter') { saveSheet(); return true; }
  return false;
}

/* ------------------------------------------------------------------ side panel (A uses it for history) */
function panel(html) { $('panel').innerHTML = html; $('scrimPanel').classList.add('on'); }
function closePanel() { $('scrimPanel').classList.remove('on'); }

/* ------------------------------------------------------------------ popover / viewer / toast */
function popover(anchor, html, onPick) {
  const pop = $('pop'), app = $('app').getBoundingClientRect(), r = anchor.getBoundingClientRect();
  pop.className = 'pop'; pop.style.transformOrigin = ''; pop.innerHTML = html; pop.hidden = false; $('popScrim').hidden = false;
  const w = pop.offsetWidth; let left = r.right - app.left - w; if (left < 12) left = r.left - app.left;
  pop.style.left = `${Math.max(12, Math.min(left, app.width - w - 12))}px`; pop.style.top = `${Math.min(r.bottom - app.top + 8, app.height - pop.offsetHeight - 12)}px`;
  pop.onclick = e => { const it = e.target.closest('[data-pick]'); if (!it) return; closePop(); onPick(it.dataset.pick); };
}
const popItems = (items, cur) => items.map(([k, l, icon, cls = '']) => `<button class="pop__item ${cls} t-body-regular" data-pick="${esc(k)}">${icon ? ic(icon, cls ? 'var(--error)' : 'var(--on-surface-variant)', 'app-icon--20') : ic(k === cur ? 'radio-selected' : 'radio-unselect', k === cur ? 'var(--primary-main)' : 'var(--outline)', 'app-icon--20')}${esc(l)}</button>`).join('');
function closePop() { $('pop').hidden = true; $('popScrim').hidden = true; }
let VW = null;
function openViewer(mId, i) { VW = { m: M(mId), i }; drawViewer(); $('viewer').hidden = false; }
function drawViewer() {
  const { m, i } = VW, r = m.refs[i];
  $('viewer').innerHTML = `<div class="viewer__hd"><div class="ttl"><span class="t-minor-title">${esc(m.name)} · References</span><span class="t-subtext-regular" style="color:var(--on-primary-a80)">${i + 1} of ${m.refs.length} · ${esc(r.name)}</span></div><button class="x" data-vw="close" aria-label="Close">${ic('close', 'var(--on-primary)')}</button></div>
    <div class="viewer__img">${r.kind === 'img' ? `<img src="${r.src}" alt="${esc(r.name)}">` : `<div class="doc">${ic('pdf', 'var(--tertiary)', 'app-icon--28')}<span class="t-minor-title">${esc(r.name)}</span><span class="t-body-regular muted">Opens in the document viewer</span></div>`}</div>
    <div class="viewer__thumbs">${m.refs.map((x, j) => `<button class="${j === i ? 'on' : ''}" data-vw="${j}" aria-label="${esc(x.name)}">${x.kind === 'img' ? `<img src="${x.src}" alt="">` : `<span class="doc">${ic('pdf', 'var(--tertiary)')}</span>`}</button>`).join('')}</div>`;
}
let toastT;
function toast(msg, undo) { $('toastMsg').textContent = msg; $('toastUndo').hidden = !undo; $('toastUndo').onclick = () => { $('toast').classList.remove('on'); undo(); }; $('toast').classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => $('toast').classList.remove('on'), undo ? 5000 : 2400); }

/* ------------------------------------------------------------------ shell */
const S = { tab: 'animals', view: 'animals', m: { sel: 'm3', q: '', filter: 'All', cat: 'All Categories' }, f: null };
const api = {};
function render() {
  document.querySelectorAll('#tabnav button').forEach(b => b.classList.toggle('on', b.dataset.tab === S.tab));
  $('tabnav').hidden = S.view === 'form' || api.animals?.hideNav?.();
  const keepScroll = [...$('view').querySelectorAll('[data-keep-scroll]')].map(el => [el.dataset.keepScroll, el.scrollTop]);
  $('view').innerHTML = S.view === 'animals' ? api.animals.render() : S.view === 'masters' ? vMasters() : vForm();
  keepScroll.forEach(([k, top]) => { const el = $('view').querySelector(`[data-keep-scroll="${k}"]`); if (el) el.scrollTop = top; });
  if (S.view === 'form') { wireForm(); refreshPreview(); }
  if (S.view === 'animals') api.animals.after?.();
  api.afterAny?.();
}

/* ------------------------------------------------------------------ MASTERS (same in every version) */
function vMasters() {
  const q = S.m.q.toLowerCase(), all = DB.masters;
  const counts = { All: all.length, Active: all.filter(m => m.active).length, Inactive: all.filter(m => !m.active).length };
  const list = all.filter(m => (S.m.filter === 'All' || (S.m.filter === 'Active') === m.active) && (S.m.cat === 'All Categories' || m.cat === S.m.cat) && (!q || `${m.name} ${m.cat} ${TYPE(m.type).label}`.toLowerCase().includes(q)));
  if (!list.find(m => m.id === S.m.sel) && list[0]) S.m.sel = list[0].id;
  const m = list.find(x => x.id === S.m.sel);
  return `<header class="hdr"><div class="hdr__row">${ic('back', 'var(--on-secondary-container)')}
      <div class="hdr__title"><div class="hdr__title-row"><span class="t-major-title name">Assessment Masters</span></div>
        <div class="hdr__sub t-body-medium"><span class="t-body-medium">${plural(all.length, 'type')}</span><span class="sep t-body-medium">|</span><span class="t-body-medium">${counts.Active} active</span><span class="sep t-body-medium">|</span><span class="t-body-medium">Used in animal templates</span></div></div>
      <div class="hdr__end"><button class="tab-iconbox" data-act="m-menu" aria-label="More">${ic('menu-vertical')}</button></div></div>
    <div class="hdr__tools"><label class="tab-search">${ic('search', 'var(--on-surface-variant)', 'app-icon--20')}<input class="t-body-medium" data-in="mq" value="${esc(S.m.q)}" placeholder="Search assessment types"></label>
      <button class="tab-dd t-body-medium" data-act="m-cat" style="height:44px;border:1px solid var(--outline-variant);cursor:pointer">${esc(S.m.cat)} ${ic('dropdown', 'var(--on-surface-variant)', 'app-icon--20')}</button></div>
    <div class="hdr__tabs-wrap"><div class="tab-primary-tabs t-body-medium">${Object.keys(counts).map(k => `<button class="tab-primary t-body-medium${k === S.m.filter ? ' tab-primary--active' : ''}" data-act="m-filter" data-v="${k}">${k} - ${counts[k]}</button>`).join('')}</div></div></header>
  <div class="canvas"><div class="split">
    <section class="card pane pane--list"><div class="pane__hd"><span class="t-minor-medium">${plural(list.length, 'Type')}</span></div>
      <div class="pane__bd" data-keep-scroll="mlist">${CATEGORIES.filter(c => list.some(x => x.cat === c)).map(c => `<div class="label t-subtext-title">${c}</div>` + list.filter(x => x.cat === c).map(x => `
        <button class="lrow${x.id === S.m.sel ? ' on' : ''}" data-act="m-sel" data-v="${x.id}"><span class="body"><span class="t-body-title navy ellipsis">${esc(x.name)}</span><span class="t-subtext-regular muted">${TYPE(x.type).label} · ${plural(x.templates, 'template')}</span></span>${x.active ? '' : `<span class="pill pill--off t-small">Inactive</span>`}</button>`).join('')).join('') || `<div class="empty t-body-regular">No types match.</div>`}</div></section>
    <section class="card pane pane--main">${m ? masterDetail(m) : `<div class="empty t-body-regular">Select a type to see its details.</div>`}</section>
  </div></div>
  <button class="fab t-minor-medium" data-act="m-new">${ic('plus', 'var(--on-primary)')}New Assessment Type</button>`;
}
function masterDetail(m) {
  const kv = (k, v) => `<div><span class="t-subtext-regular muted">${esc(k)}</span><span class="t-body-regular">${esc(v)}</span></div>`;
  let cfg = '';
  if (m.type === 'number') cfg = kv('Measurement', `${m.measure} (${m.unit})`);
  if (m.type === 'slider') cfg = kv('Measurement', `${m.measure} (${m.unit})`) + kv('Limits', `${m.min} ${m.minL ? '(' + m.minL + ')' : ''} – ${m.max} ${m.maxL ? '(' + m.maxL + ')' : ''}`) + kv('Step', m.step) + kv('Range selection', m.range ? 'On' : 'Off');
  if (m.type === 'list') cfg = kv('Selection', m.multi ? 'Multi select' : 'Single select');
  const opts = m.type === 'list' ? m.items.map(i => `<span class="chip t-body-regular">${esc(i)}</span>`) : m.type === 'scale' ? m.scale.map(([n, l]) => `<span class="chip t-body-regular"><span class="t-body-title">${esc(n)}</span>${esc(l)}</span>`) : [];
  return `<div class="pane__hd"><div class="ttl"><span class="t-minor-medium ellipsis">${esc(m.name)}</span><span class="t-subtext-regular muted">${esc(m.cat)} · ${TYPE(m.type).label}</span></div>
      <span class="pill ${m.active ? 'pill--done' : 'pill--off'} t-subtext-title">${m.active ? 'Active' : 'Inactive'}</span>
      <button class="iconbtn iconbtn--plain" data-act="m-edit" data-v="${m.id}" aria-label="Edit">${ic('pencil')}</button><button class="iconbtn iconbtn--plain" data-act="m-more" data-v="${m.id}" aria-label="More">${ic('menu-vertical')}</button></div>
    <div class="pane__bd has-fab">
      <div class="blk"><span class="t-body-regular">${esc(m.desc) || '<span class="muted">No description</span>'}</span><div class="kv">${kv('Category', m.cat)}${kv('Response type', TYPE(m.type).label)}${cfg}${kv('Used in templates', m.templates)}</div></div>
      ${opts.length ? `<div class="blk"><div class="blk__hd"><span class="t-minor-medium">${m.type === 'list' ? 'List items' : 'Scale'}</span><span class="t-subtext-regular muted">${opts.length}</span></div><div class="chips">${opts.join('')}</div></div>` : ''}
      ${m.refs?.length ? `<div class="blk"><div class="blk__hd"><span class="t-minor-medium">References</span><span class="t-subtext-regular muted">${m.refs.length} files</span></div>${refStrip(m, 'refs--lg')}</div>` : ''}
      <div class="blk"><div class="blk__hd"><span class="t-minor-medium">What vets see</span><span class="t-subtext-regular muted">Preview</span></div><div class="preview">${renderInput(m, {}, { readonly: true })}</div></div>
    </div>`;
}

/* ------------------------------------------------------------------ FORM: new / edit type */
function openForm(m) {
  const base = { name: '', cat: 'Physical Health', desc: '', active: true, type: '', measure: 'Weight', unit: 'kg', min: 0, max: 100, minL: '', maxL: '', step: 1, range: false, multi: false, items: [], scale: [], refs: [] };
  S.f = { mode: m ? 'edit' : 'new', id: m?.id, d: m ? JSON.parse(JSON.stringify({ ...base, ...m })) : base, err: {}, tried: false, pv: {} };
  S.view = 'form'; render();
}
const previewMaster = () => ({ ...S.f.d, name: S.f.d.name || 'Assessment name', items: S.f.d.items.length ? S.f.d.items : ['Option 1', 'Option 2'], scale: S.f.d.scale.length ? S.f.d.scale : [[1, 'Option']] });
function validate() {
  const d = S.f.d, e = {};
  if (!d.name.trim()) e.name = 'Enter a name.'; else if (DB.masters.some(m => m.name.toLowerCase() === d.name.trim().toLowerCase() && m.id !== S.f.id)) e.name = 'This name is already used.';
  if (!d.type) e.type = 'Choose how vets answer.';
  if (d.type === 'list' && d.items.filter(s => s.trim()).length < 2) e.items = 'Add at least two items.';
  if (d.type === 'scale' && d.scale.length < 2) e.scale = 'Add at least two options.';
  if (d.type === 'slider') { if (!(+d.max > +d.min)) e.max = 'Maximum must be more than minimum.'; if (!(+d.step > 0) || +d.step > +d.max - +d.min) e.step = 'Step must fit inside the range.'; }
  S.f.err = e; return !Object.keys(e).length;
}
function vForm() {
  const f = S.f, d = f.d, E = f.tried ? f.err : {}, err = k => E[k] ? `<span class="field__err t-subtext-regular">${esc(E[k])}</span>` : '';
  const measureSel = lbl => `<label class="app-field"><span class="app-field__label t-subtext-regular">${lbl}</span><select class="t-minor-regular" data-f="measure">${Object.keys(MEASURES).map(k => `<option${k === d.measure ? ' selected' : ''}>${k}</option>`).join('')}</select>${ic('dropdown')}</label>`;
  let cfg = '';
  if (d.type === 'text') cfg = `<span class="t-body-regular muted">Nothing to set up. Vets type a free-text answer.</span>`;
  if (d.type === 'number') cfg = `<div class="grid2">${measureSel('Measurement')}<label class="app-field"><span class="app-field__label t-subtext-regular">Default unit</span><select class="t-minor-regular" data-f="unit">${(MEASURES[d.measure] || ['']).map(u => `<option${u === d.unit ? ' selected' : ''}>${u}</option>`).join('')}</select>${ic('dropdown')}</label></div>`;
  if (d.type === 'list') cfg = `${seg([['0', 'Single select'], ['1', 'Multi select']], d.multi ? '1' : '0', 'f-multi')}
      ${d.items.map((it, i) => `<div class="item-row"><label class="app-field app-field--sm"><input class="t-body-regular" value="${esc(it)}" data-item="${i}" aria-label="Item ${i + 1}"></label><button class="sq sq--del" data-act="f-del" data-v="${i}" aria-label="Remove">${ic('close-with-circle', 'var(--error)')}</button></div>`).join('')}
      <div class="item-row"><label class="app-field app-field--sm${E.items ? ' app-field--error' : ''}"><input class="t-body-regular" placeholder="Add an item and press Return" data-new="item"></label><button class="sq sq--add" data-act="f-add" aria-label="Add">${ic('plus', 'var(--on-primary)')}</button></div>${err('items')}`;
  if (d.type === 'scale') cfg = `${d.scale.map(([n, l], i) => `<div class="item-row"><label class="app-field app-field--sm num"><input class="t-body-regular" inputmode="decimal" value="${esc(n)}" data-sn="${i}" aria-label="Score"></label><label class="app-field app-field--sm"><input class="t-body-regular" value="${esc(l)}" data-sl="${i}" aria-label="Label"></label><button class="sq sq--del" data-act="f-sdel" data-v="${i}" aria-label="Remove">${ic('close-with-circle', 'var(--error)')}</button></div>`).join('')}
      <div class="item-row"><label class="app-field app-field--sm num${E.scale ? ' app-field--error' : ''}"><input class="t-body-regular" inputmode="decimal" placeholder="Score" data-new="sn"></label><label class="app-field app-field--sm${E.scale ? ' app-field--error' : ''}"><input class="t-body-regular" placeholder="Label, then Return" data-new="sl"></label><button class="sq sq--add" data-act="f-sadd" aria-label="Add">${ic('plus', 'var(--on-primary)')}</button></div>${err('scale')}`;
  if (d.type === 'slider') cfg = `${measureSel('Measurement')}
      <div class="grid2"><label class="app-field"><span class="app-field__label t-subtext-regular">Minimum</span><input class="t-minor-regular" inputmode="decimal" value="${esc(d.min)}" data-f="min"><span class="unit t-body-regular">${esc(d.unit)}</span></label><label class="app-field"><span class="app-field__label t-subtext-regular">Label (optional)</span><input class="t-minor-regular" value="${esc(d.minL)}" placeholder="e.g. Low" data-f="minL"></label></div>
      <div class="field"><div class="grid2"><label class="app-field${E.max ? ' app-field--error' : ''}"><span class="app-field__label t-subtext-regular">Maximum</span><input class="t-minor-regular" inputmode="decimal" value="${esc(d.max)}" data-f="max"><span class="unit t-body-regular">${esc(d.unit)}</span></label><label class="app-field"><span class="app-field__label t-subtext-regular">Label (optional)</span><input class="t-minor-regular" value="${esc(d.maxL)}" placeholder="e.g. High" data-f="maxL"></label></div>${err('max')}</div>
      <div class="switch-row"><div><span class="t-body-medium navy">Step</span><span class="t-subtext-regular muted">Gap between values</span></div><div class="stepper"><button class="t-minor-title" data-act="f-step" data-v="-1" aria-label="Decrease">−</button><input class="t-minor-medium" inputmode="decimal" value="${esc(d.step)}" data-f="step" aria-label="Step"><button class="t-minor-title" data-act="f-step" data-v="1" aria-label="Increase">+</button></div></div>${err('step')}
      <div class="switch-row"><div><span class="t-body-medium navy">Allow range selection</span><span class="t-subtext-regular muted">Vets pick two values, e.g. 60 – 100 bpm</span></div><button class="app-switch ${d.range ? 'is-on' : 'is-off'}" data-act="f-range" role="switch" aria-checked="${d.range}" aria-label="Allow range selection"><span class="app-switch__knob"></span></button></div>`;
  return `<header class="hdr hdr--flat"><div class="hdr__row"><button class="hdr__back" data-act="f-cancel" aria-label="Back">${ic('back', 'var(--on-secondary-container)')}</button>
      <div class="hdr__title"><div class="hdr__title-row"><span class="t-major-title name">${f.mode === 'edit' ? 'Edit Assessment Type' : 'New Assessment Type'}</span></div>${f.mode === 'edit' ? `<div class="hdr__sub t-body-medium"><span class="t-body-medium">Changes apply to new entries only</span></div>` : ''}</div></div></header>
  <div class="form-scroll" data-keep-scroll="form">
    <section class="fcard"><div class="fcard__hd"><span class="t-minor-medium">Details</span></div>
      <div class="grid2"><label class="app-field"><span class="app-field__label t-subtext-regular">Category</span><select class="t-minor-regular" data-f="cat">${CATEGORIES.map(c => `<option${c === d.cat ? ' selected' : ''}>${c}</option>`).join('')}</select>${ic('dropdown')}</label>
        <div class="field"><label class="app-field${E.name ? ' app-field--error' : ''}"><span class="app-field__label t-subtext-regular">Assessment name</span><input class="t-minor-regular" value="${esc(d.name)}" placeholder="e.g. Eye Condition" data-f="name" maxlength="60"></label>${err('name')}</div></div>
      <label class="app-field app-field--area"><span class="app-field__label t-subtext-regular">Description (shown to vets)</span><textarea class="t-minor-regular" rows="2" placeholder="What should the vet look for?" data-f="desc">${esc(d.desc)}</textarea></label>
      <div class="switch-row"><div><span class="t-body-medium navy">Active</span><span class="t-subtext-regular muted">Available for selection in animal templates</span></div><button class="app-switch ${d.active ? 'is-on' : 'is-off'}" data-act="f-active" role="switch" aria-checked="${d.active}" aria-label="Active"><span class="app-switch__knob"></span></button></div></section>
    <section class="fcard"><div class="fcard__hd"><span class="t-minor-medium">Response type</span><span class="t-subtext-regular muted">How vets answer</span></div>
      <div class="types">${TYPES.map(t => `<button class="type${t.key === d.type ? ' on' : ''}" data-act="f-type" data-v="${t.key}" aria-pressed="${t.key === d.type}"><span class="g">${ic(t.icon, 'var(--on-primary-container)', 'app-icon--20')}</span><span class="t-body-title">${t.label}</span><span class="t-small muted">${t.hint}</span></button>`).join('')}</div>${err('type')}
      ${d.type ? `<div class="fcard__hd" style="margin-top:var(--sp-4)"><span class="t-body-title navy">${TYPE(d.type).label} settings</span></div>${cfg}` : ''}</section>
    ${d.type ? `<section class="fcard"><div class="fcard__hd"><span class="t-minor-medium">What vets see</span><span class="t-subtext-regular muted">Live preview, try it</span></div><div class="preview"><span class="t-minor-title navy" data-pv-name>${esc(d.name || 'Assessment name')}</span><div class="field" style="gap:var(--sp-12)" data-preview></div></div></section>` : ''}
    <section class="fcard"><div class="fcard__hd"><span class="t-minor-medium">References</span><span class="t-subtext-regular muted">Optional · photos or documents that show what to look for</span></div>
      ${d.refs.length ? `<div class="files">${d.refs.map((r, i) => `<span class="file">${r.kind === 'img' ? `<img src="${r.src}" alt="">` : `<span class="app-attachment app-attachment--pdf">${ic('pdf', 'var(--tertiary)')}</span>`}<span class="t-body-regular ellipsis">${esc(r.name)}</span><button data-act="f-refdel" data-v="${i}" aria-label="Remove">${ic('close-with-circle', 'var(--outline)', 'app-icon--20')}</button></span>`).join('')}</div>` : ''}
      <label class="upload"><span class="app-attachment">${ic('attachment', 'var(--on-primary-container)')}</span><span class="txt"><span class="t-body-title">Upload files</span><span class="t-subtext-regular muted">JPEG, PNG, PDF, DOC or MP4 · max 50 MB each</span></span><input type="file" multiple accept="image/*,.pdf,.doc,.docx,video/mp4" data-f="files" hidden></label></section>
  </div>
  <div class="actionbar"><button class="bigbtn bigbtn--ghost t-minor-medium" data-act="f-cancel">Cancel</button><button class="bigbtn bigbtn--navy t-minor-medium" data-act="f-submit">${f.mode === 'edit' ? 'Save changes' : 'Create assessment'}</button></div>`;
}
function wireForm() {
  const root = $('view');
  root.querySelectorAll('[data-f]').forEach(el => {
    const k = el.dataset.f;
    if (k === 'files') { el.onchange = () => { [...el.files].forEach(file => { if (file.size > 50 * 1024 * 1024) { toast(`${file.name} is over 50 MB`); return; } S.f.d.refs.push(file.type.startsWith('image/') ? { kind: 'img', src: URL.createObjectURL(file), name: file.name } : { kind: 'pdf', name: file.name }); }); render(); }; return; }
    el.addEventListener(el.tagName === 'SELECT' ? 'change' : 'input', () => {
      S.f.d[k] = el.value;
      if (k === 'measure') { S.f.d.unit = MEASURES[S.f.d.measure][0]; render(); return; }
      if (k === 'unit' || k === 'cat') { render(); return; }
      if (k === 'name') { const n = root.querySelector('[data-pv-name]'); if (n) n.textContent = el.value || 'Assessment name'; if (S.f.tried) { validate(); } return; }
      refreshPreview();
    });
    if (['min', 'max', 'step'].includes(k)) el.addEventListener('change', () => { S.f.d[k] = +el.value || 0; S.f.pv = {}; if (S.f.tried) validate(); render(); });
  });
  root.querySelectorAll('[data-item]').forEach(el => el.oninput = () => { S.f.d.items[+el.dataset.item] = el.value; refreshPreview(); });
  root.querySelectorAll('[data-sn]').forEach(el => el.oninput = () => { S.f.d.scale[+el.dataset.sn][0] = el.value; refreshPreview(); });
  root.querySelectorAll('[data-sl]').forEach(el => el.oninput = () => { S.f.d.scale[+el.dataset.sl][1] = el.value; refreshPreview(); });
  root.querySelectorAll('[data-new]').forEach(el => el.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); el.dataset.new === 'item' ? addItem() : addScale(); } });
}
function refreshPreview() { const pv = $('view').querySelector('[data-preview]'); if (pv) mountInput(pv, previewMaster(), S.f.pv); }
function addItem() { const el = $('view').querySelector('[data-new="item"]'), v = el.value.trim(); if (!v) { el.focus(); return; } if (S.f.d.items.some(x => x.toLowerCase() === v.toLowerCase())) { toast(`“${v}” is already in the list`); return; } S.f.d.items.push(v); if (S.f.tried) validate(); render(); $('view').querySelector('[data-new="item"]')?.focus(); }
function addScale() { const n = $('view').querySelector('[data-new="sn"]'), l = $('view').querySelector('[data-new="sl"]'); if (n.value.trim() === '' || isNaN(+n.value)) { n.focus(); return; } if (!l.value.trim()) { l.focus(); return; } S.f.d.scale.push([+n.value, l.value.trim()]); S.f.d.scale.sort((p, q) => p[0] - q[0]); if (S.f.tried) validate(); render(); $('view').querySelector('[data-new="sn"]')?.focus(); }
function submitForm() {
  S.f.tried = true;
  if (!validate()) { render(); $('view').querySelector('.field__err')?.scrollIntoView({ block: 'center', behavior: 'smooth' }); return; }
  const d = S.f.d, clean = { ...d, name: d.name.trim(), min: +d.min, max: +d.max, step: +d.step || 1, items: d.items.map(s => s.trim()).filter(Boolean), scale: d.scale.map(([n, l]) => [+n, l]) };
  if (S.f.mode === 'edit') { Object.assign(M(S.f.id), clean); S.m.sel = S.f.id; toast(`${clean.name} updated`); }
  else { const id = 'm' + uid(); DB.masters.push({ ...clean, id, templates: 0, extraFor: ANIMALS.map(a => a.id) }); S.m.sel = id; S.m.filter = 'All'; S.m.cat = 'All Categories'; S.m.q = ''; toast(`${clean.name} created · added to every animal`); }
  save(); S.f = null; S.view = S.tab = 'masters'; render();
}
function mastersClick(act, t) {
  const v = t.dataset.v;
  switch (act) {
    case 'm-sel': S.m.sel = v; render(); return true;
    case 'm-filter': S.m.filter = v; render(); return true;
    case 'm-cat': popover(t, popItems(['All Categories', ...CATEGORIES].map(c => [c, c]), S.m.cat), c => { S.m.cat = c; render(); }); return true;
    case 'm-menu': popover(t, popItems([['reset', 'Reset demo data', 'reset']]), () => { reset(); render(); toast('Demo data reset'); }); return true;
    case 'm-new': openForm(null); return true;
    case 'm-edit': openForm(M(v)); return true;
    case 'm-more': { const m = M(v); popover(t, popItems([['edit', 'Edit', 'pencil'], ['dup', 'Duplicate', 'add-with-circle'], ['toggle', m.active ? 'Mark as inactive' : 'Mark as active', m.active ? 'toggle-off' : 'toggle-on'], ...(m.templates ? [] : [['del', 'Delete', 'delete', 'pop__item--danger']])]), k => {
        if (k === 'edit') openForm(m);
        if (k === 'dup') { const c = JSON.parse(JSON.stringify(m)); c.id = 'm' + uid(); c.name = `${m.name} (copy)`; c.templates = 0; c.active = false; DB.masters.push(c); S.m.sel = c.id; save(); render(); toast(`${c.name} created as inactive`); }
        if (k === 'toggle') { m.active = !m.active; save(); render(); toast(`${m.name} is now ${m.active ? 'active' : 'inactive'}`); }
        if (k === 'del') { DB.masters.splice(DB.masters.indexOf(m), 1); save(); render(); toast(`${m.name} deleted`); }
      }); return true; }
    case 'f-cancel': S.f = null; S.view = 'masters'; render(); return true;
    case 'f-submit': submitForm(); return true;
    case 'f-type': S.f.d.type = v; S.f.pv = {}; if (S.f.tried) validate(); render(); return true;
    case 'f-multi': S.f.d.multi = v === '1'; S.f.pv = {}; render(); return true;
    case 'f-add': addItem(); return true;
    case 'f-del': S.f.d.items.splice(+v, 1); S.f.pv = {}; if (S.f.tried) validate(); render(); return true;
    case 'f-sadd': addScale(); return true;
    case 'f-sdel': S.f.d.scale.splice(+v, 1); S.f.pv = {}; if (S.f.tried) validate(); render(); return true;
    case 'f-step': S.f.d.step = Math.max(1, (+S.f.d.step || 0) + +v); S.f.pv = {}; if (S.f.tried) validate(); render(); return true;
    case 'f-range': S.f.d.range = !S.f.d.range; S.f.pv = {}; render(); return true;
    case 'f-active': S.f.d.active = !S.f.d.active; render(); return true;
    case 'f-refdel': S.f.d.refs.splice(+v, 1); render(); return true;
  }
  return false;
}

/* ------------------------------------------------------------------ boot + global events */
function boot() {
  const app = $('app');
  $('tabnav').addEventListener('click', e => { const b = e.target.closest('[data-tab]'); if (!b) return; S.tab = S.view = b.dataset.tab; render(); });
  app.addEventListener('input', e => { const k = e.target.dataset.in; if (!k) return; const pos = e.target.selectionStart; if (k === 'mq') S.m.q = e.target.value; else api.animals.input?.(k, e.target.value); render(); const el = $('view').querySelector(`[data-in="${k}"]`); if (el) { el.focus(); el.setSelectionRange(pos, pos); } });
  document.addEventListener('keydown', e => { if (sheetKey(e)) { e.preventDefault(); return; } if (api.shortcut?.(e)) e.preventDefault(); });
  document.addEventListener('keydown', e => {   // document, not the app frame: keys arrive at <body> when nothing inside has focus
    if (e.key === 'Escape') { if (!$('viewer').hidden) $('viewer').hidden = true; else if (!$('pop').hidden) closePop(); else if (SH) closeSheet(); else if ($('scrimPanel').classList.contains('on')) closePanel(); }
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[role=button][data-act]')) { e.preventDefault(); e.target.click(); }
  });
  app.addEventListener('click', e => {
    const t = e.target.closest('[data-act]'); if (!t || !app.contains(t)) return;
    const act = t.dataset.act, v = t.dataset.v;
    if (act === 'viewer') { e.stopPropagation(); openViewer(v, +t.dataset.i); return; }
    if (act === 'h-range') { H.range = v; H.tip = null; (api.animals.historyChanged ? api.animals.historyChanged() : render()); return; }
    if (act === 'h-chart') { H.chart = v; (api.animals.historyChanged ? api.animals.historyChanged() : render()); return; }
    if (act === 'h-tip') { H.tip = H.tip === v ? null : v; (api.animals.historyChanged ? api.animals.historyChanged() : render()); return; }
    if (S.view === 'animals' && api.animals.click(act, t, e)) return;
    mastersClick(act, t);
  });
  $('popScrim').addEventListener('click', closePop);
  $('scrimSheet').addEventListener('click', e => { if (e.target === $('scrimSheet')) return closeSheet(); const b = e.target.closest('[data-sh]'); if (!b) return; if (b.dataset.sh === 'close') closeSheet(); if (b.dataset.sh === 'save') saveSheet(); if (b.dataset.sh === 'same') sheetSame(); });
  $('scrimPanel').addEventListener('click', e => { if (e.target === $('scrimPanel') || e.target.closest('[data-pn=close]')) closePanel(); });
  $('viewer').addEventListener('click', e => { const b = e.target.closest('[data-vw]'); if (!b) return; if (b.dataset.vw === 'close') { $('viewer').hidden = true; return; } VW.i = +b.dataset.vw; drawViewer(); });
  const [screen, arg] = decodeURIComponent(location.hash.slice(1)).split(':');
  if (screen === 'masters') S.tab = S.view = 'masters';
  if (screen === 'new') { S.tab = 'masters'; openForm(null); if (arg && TYPE(arg)) { S.f.d.type = arg; S.f.d.name = 'Activeness'; render(); } return; }
  render();
  api.animals.start?.(screen, arg);
}

return Object.assign(api, { $, esc, ic, plural, TODAY, fDate, fShort, fTime, ago, isoDate, isoTime, TYPES, TYPE, CATEGORIES, ANIMALS,
  get DB() { return DB; }, M, MN, A, recs, animalMasters, doneThisWeek, dueOf, addRecord, removeRecord, save, reset,
  fmt, numOf, isNumeric, trend, trendHTML, RANGES, RANGE_LABEL, inRange, badge, thumb, ring, refStrip, spark, seg, H, graph, historyHTML, recRow,
  renderInput, wireInput, mountInput, readValue, mastersClick, get SH() { return SH; }, sheetSame, lastText, defaultUnit, entrySheet, closeSheet, panel, closePanel, popover, popItems, closePop, openViewer, toast, S, render, boot });
})();
