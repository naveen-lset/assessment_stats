/* Assessments · iPad v2 — a working prototype.
   Figma fAOcpkMwZPWEkHO3kMvNoy: Master 1485:8667 (create / view assessment types), User 1485:10626 (record on an animal),
   Components 1485:16978 (graphs, tiles, inputs). Adapted to the hospital tablet layout language.
   Data lives in this browser (localStorage) so entries and new types survive a reload; "Reset demo data" is in the Masters ⋮ menu. */
'use strict';

/* =============================== helpers =============================== */
const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const ic = (slug, color = 'var(--on-surface-variant)', size = '', extra = '') => `<span class="app-icon ${size} app-icon--tint i-${slug} ${extra}" style="color: ${color}"></span>`;
const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
const TODAY = new Date(2026, 8, 29, 9, 41);
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fDate = d => `${d.getDate()} ${MON[d.getMonth()]} ${d.getFullYear()}`;
const fShort = d => `${d.getDate()} ${MON[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`;
const fTime = d => { let h = d.getHours(), m = String(d.getMinutes()).padStart(2, '0'); const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12; return `${String(h).padStart(2, '0')}:${m} ${ap}`; };
const ago = d => { const min = Math.round((TODAY - d) / 60000); if (min < 60) return `${Math.max(1, min)} min ago`; const h = Math.round(min / 60); if (h < 24) return `${h} h ago`; const dd = Math.round(h / 24); return dd < 30 ? `${dd}d ago` : fShort(d); };
const isoDate = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const isoTime = d => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
const uid = () => Math.random().toString(36).slice(2, 9);
let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const pick = a => a[Math.floor(rnd() * a.length)];

/* =============================== reference data =============================== */
const TYPES = [
  { key: 'text',   label: 'Text',           icon: 'notes',          hint: 'Vets type a free-text observation.' },
  { key: 'number', label: 'Numeric Value',  icon: 'percentage',     hint: 'Vets enter a number with a unit, e.g. weight or temperature.' },
  { key: 'list',   label: 'List',           icon: 'list',           hint: 'Vets pick one or more options from your list.' },
  { key: 'scale',  label: 'Numeric Scale',  icon: 'reason-or-list', hint: 'Vets pick one scored option, e.g. 1 - Poor … 10 - Excellent.' },
  { key: 'slider', label: 'Numeric Slider', icon: 'filter-2',       hint: 'Vets drag to a value, or to a range, between your limits.' },
];
const TYPE = k => TYPES.find(t => t.key === k);
const CATEGORIES = ['Physical Health', 'Behaviour', 'Environment'];
const MEASURES = { Weight: ['kg', 'g'], Temperature: ['°C', '°F'], 'Heart Rate': ['bpm'], Length: ['cm', 'm'], Volume: ['ml', 'L'], Percentage: ['%'], Count: ['count'] };
const IMG = { leopard: '../../../app/sample-leopard-84.png', cheetah: '../../../app/sample-cheetah-104.png', bird: '../../../app/sample-bird-44.png' };
const DOCTORS = ['Dr. Mehta', 'Dr. Swathi', 'Dr. Nitin', 'Dr. Mehta'];
const NOTES = ['Reading taken during routine examination; animal was calm.', 'Slight change from last week, keep monitoring.', 'Observed after feeding.', 'Keeper reported the same in the morning round.'];

const DEFAULT_MASTERS = () => [
  { id: 'm1', name: 'Weight', cat: 'Physical Health', type: 'number', measure: 'Weight', unit: 'kg', active: true, templates: 4, desc: 'Body weight of the animal, measured on the ward scale.', refs: [] },
  { id: 'm2', name: 'Heart Rate', cat: 'Physical Health', type: 'slider', measure: 'Heart Rate', unit: 'bpm', min: 40, max: 180, minL: 'Poor', maxL: 'Extreme', step: 5, range: true, active: true, templates: 3, desc: 'Resting heart rate taken during routine examination.', refs: [] },
  { id: 'm3', name: 'Eye Condition', cat: 'Physical Health', type: 'list', multi: true, items: ['Pain', 'Redness', 'Swelling', 'Discharge', 'Itchiness'], active: true, templates: 2, desc: 'This is to assess the eye condition of the animals.',
    refs: [{ kind: 'img', src: IMG.leopard, name: 'Healthy eye.jpg' }, { kind: 'img', src: IMG.cheetah, name: 'Mild redness.jpg' }, { kind: 'pdf', name: 'Eye scoring guide.pdf' }, { kind: 'img', src: IMG.leopard, name: 'Discharge.jpg' }, { kind: 'img', src: IMG.cheetah, name: 'Swelling.jpg' }] },
  { id: 'm4', name: 'Body Score', cat: 'Physical Health', type: 'scale', scale: [[1, 'Poor'], [4, 'Fair'], [6, 'Good'], [10, 'Excellent']], active: true, templates: 5, desc: 'Body condition score from a visual and hands-on check.', refs: [{ kind: 'pdf', name: 'Body condition chart.pdf' }] },
  { id: 'm5', name: 'Temperature', cat: 'Physical Health', type: 'number', measure: 'Temperature', unit: '°C', active: true, templates: 1, desc: 'Rectal body temperature.', refs: [] },
  { id: 'm6', name: 'Activeness', cat: 'Behaviour', type: 'slider', measure: 'Count', unit: 'count', min: 0, max: 100, minL: 'Lowest', maxL: 'Highest', step: 5, range: false, active: true, templates: 0, desc: 'This is to assess the activity of the animals.', refs: [] },
  { id: 'm7', name: 'Mood', cat: 'Behaviour', type: 'text', active: true, templates: 2, desc: 'Keeper and vet observation of mood.', refs: [] },
  { id: 'm8', name: 'Stress Behaviour', cat: 'Behaviour', type: 'list', multi: false, items: ['None', 'Pacing', 'Over-grooming', 'Hiding', 'Vocalising'], active: true, templates: 1, desc: 'Signs of stress seen during observation.', refs: [] },
  { id: 'm9', name: 'Feeding Behaviour', cat: 'Behaviour', type: 'text', active: false, templates: 0, desc: 'How the animal approaches food.', refs: [] },
  { id: 'm10', name: 'Humidity', cat: 'Environment', type: 'number', measure: 'Percentage', unit: '%', active: true, templates: 1, desc: 'Enclosure humidity at check time.', refs: [] },
  { id: 'm11', name: 'Enclosure Cleanliness', cat: 'Environment', type: 'scale', scale: [[1, 'Dirty'], [3, 'Acceptable'], [5, 'Clean']], active: false, templates: 0, desc: 'Cleanliness of the enclosure at check time.', refs: [] },
];
const ANIMALS = [
  { id: 'a1', tag: 'Ear Tag: 123456', aid: 'AID: 87546/24', species: 'Leopard', sci: 'Panthera pardus', g: 'male', img: IMG.leopard, site: 'Leopard Site', encl: 'Encl: Big Cat 2', list: ['Weight', 'Heart Rate', 'Eye Condition', 'Body Score', 'Temperature', 'Mood', 'Stress Behaviour', 'Humidity'], base: 58 },
  { id: 'a2', tag: 'Ear Tag: 234567', aid: 'AID: 87547/24', species: 'Cheetah', sci: 'Acinonyx jubatus', g: 'female', img: IMG.cheetah, site: 'Cheetah Site', encl: 'Encl: Run 1', list: ['Weight', 'Heart Rate', 'Eye Condition', 'Body Score', 'Mood', 'Activeness'], base: 42 },
  { id: 'a3', tag: 'BI23000123', aid: 'AID: 90112/25', species: 'Peach Fronted Conure', sci: 'Eupsittula aurea', g: 'male', img: IMG.bird, site: 'Aviary', encl: 'Encl: Aviary 3', list: ['Weight', 'Body Score', 'Mood', 'Activeness', 'Humidity'], base: 0.085 },
  { id: 'a4', tag: 'Ear Tag: 345678', aid: 'AID: 87548/24', species: 'Leopard', sci: 'Panthera pardus', g: 'female', img: IMG.leopard, site: 'Leopard Site', encl: 'Encl: Big Cat 1', list: ['Weight', 'Heart Rate', 'Eye Condition', 'Temperature', 'Stress Behaviour'], base: 36 },
  { id: 'a5', tag: 'Ear Tag: 456789', aid: 'AID: 87549/24', species: 'Cheetah', sci: 'Acinonyx jubatus', g: 'male', img: IMG.cheetah, site: 'Cheetah Site', encl: 'Encl: Run 2', list: ['Weight', 'Heart Rate', 'Body Score', 'Mood'], base: 51 },
  { id: 'a6', tag: 'BI23000456', aid: 'AID: 90113/25', species: 'Peach Fronted Conure', sci: 'Eupsittula aurea', g: 'female', img: IMG.bird, site: 'Aviary', encl: 'Encl: Aviary 3', list: ['Weight', 'Mood', 'Humidity'], base: 0.079 },
];
const MOODS = ['Calm, eating well', 'Alert and curious', 'Slightly withdrawn', 'Calm', 'Playful with enrichment', 'Resting most of the day', 'Restless before feeding'];

function seedRecords(masters) {
  seed = 11; const R = {};
  for (const a of ANIMALS) for (const name of a.list) {
    const m = masters.find(x => x.name === name); if (!m) continue;
    const list = []; let d = new Date(TODAY); d.setHours(d.getHours() - 1 - Math.floor(rnd() * 3));
    if (rnd() > .72) d = new Date(d.getTime() - (8 + Math.floor(rnd() * 7)) * 86400000);   // some are overdue, so the 'due' state shows
    const isBird = a.species.includes('Conure');
    let w = a.base * (isBird ? 1000 : 1);
    const n = name === 'Stress Behaviour' && a.id === 'a4' ? 0 : 28 + Math.floor(rnd() * 20);
    for (let i = 0; i < n; i++) {
      let v, unit = m.unit;
      if (name === 'Weight') { w += (rnd() - .55) * (isBird ? 2 : .8); v = Math.round(w * 10) / 10; unit = isBird ? 'g' : 'kg'; }
      else if (name === 'Temperature') v = Math.round((37.6 + (rnd() - .5) * 1.4) * 10) / 10;
      else if (name === 'Humidity') v = Math.round(55 + rnd() * 15);
      else if (m.type === 'slider' && m.range) { const lo = 60 + Math.round(rnd() * 6) * 5; v = [lo, lo + 20 + Math.round(rnd() * 5) * 5]; }
      else if (m.type === 'slider') v = Math.round(rnd() * 20) * 5;
      else if (m.type === 'list') v = m.multi ? [...new Set([pick(m.items), ...(rnd() > .6 ? [pick(m.items)] : [])])] : [pick(m.items)];
      else if (m.type === 'scale') v = pick(m.scale)[0];
      else v = pick(MOODS);
      list.push({ id: uid(), t: new Date(d), v, unit, by: DOCTORS[i % 4], note: rnd() > .65 ? pick(NOTES) : '' });
      d = new Date(d.getTime() - (1 + Math.floor(rnd() * 5)) * 86400000 - Math.floor(rnd() * 5) * 3600000);
    }
    R[`${a.id}|${m.id}`] = list;
  }
  return R;
}

/* =============================== state + persistence =============================== */
const KEY = 'antz-assessments-ipad-v2';
let DB;
function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) { const j = JSON.parse(raw); for (const k in j.records) j.records[k].forEach(r => r.t = new Date(r.t)); DB = j; return; }
  } catch (e) { /* storage blocked or corrupt → fresh demo data */ }
  const masters = DEFAULT_MASTERS(); DB = { masters, records: seedRecords(masters) };
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(DB)); } catch (e) { /* private mode: keep in memory */ } }
load();
const M = id => DB.masters.find(m => m.id === id);
const MN = name => DB.masters.find(m => m.name === name);
const recs = (aId, mId) => DB.records[`${aId}|${mId}`] || (DB.records[`${aId}|${mId}`] = []);
const animalMasters = a => a.list.map(MN).filter(Boolean).concat(DB.masters.filter(m => m.extraFor?.includes(a.id)));

const S = {
  tab: 'animals', view: 'animals',
  a: { sel: 'a1', q: '', cat: 'All', open: null, range: 'M', chart: 'line', tip: null, newId: null },
  m: { sel: 'm3', q: '', filter: 'All', cat: 'All Categories' },
  f: null,
};

/* =============================== values + formatting =============================== */
function fmt(m, r) {
  const v = r.v;
  if (m.type === 'number') return { v: String(v), u: r.unit || m.unit };
  if (m.type === 'slider') return { v: Array.isArray(v) ? `${v[0]} - ${v[1]}` : String(v), u: m.unit };
  if (m.type === 'scale') { const s = m.scale.find(x => +x[0] === +v); return { v: s ? `${s[0]}  -  ${s[1]}` : String(v), u: '' }; }
  if (m.type === 'list') return { v: v.join(', '), u: '' };
  return { v, u: '' };
}
const numOf = (m, r) => m.type === 'slider' && Array.isArray(r.v) ? (r.v[0] + r.v[1]) / 2 : +r.v;
const isNumeric = m => m.type === 'number' || m.type === 'slider';
const RANGES = { W: 7, M: 30, '3M': 90, '6M': 180 };
const RANGE_LABEL = { W: 'Last 1 week', M: 'Last 1 month', '3M': 'Last 3 months', '6M': 'Last 6 months' };
const inRange = (list, key) => { const from = TODAY.getTime() - RANGES[key] * 86400000; return list.filter(r => r.t.getTime() >= from); };

/* =============================== shell =============================== */
function render() {
  document.querySelectorAll('#tabnav button').forEach(b => b.classList.toggle('on', b.dataset.tab === S.tab));
  $('tabnav').hidden = S.view === 'form';
  $('view').innerHTML = S.view === 'animals' ? vAnimals() : S.view === 'masters' ? vMasters() : vForm();
  afterRender();
}
function afterRender() {
  if (S.view === 'form') { wireForm(); refreshPreview(); }
  if (S.a.newId) { const el = document.querySelector(`[data-rec="${S.a.newId}"]`); if (el) el.scrollIntoView({ block: 'nearest' }); setTimeout(() => { S.a.newId = null; document.querySelectorAll('.rec.is-new').forEach(x => x.classList.remove('is-new')); }, 2400); }
}
$('tabnav').addEventListener('click', e => { const b = e.target.closest('[data-tab]'); if (!b) return; S.tab = b.dataset.tab; S.view = S.tab; render(); });

/* =============================== ANIMALS (vet) =============================== */
function vAnimals() {
  const q = S.a.q.toLowerCase();
  const list = ANIMALS.filter(a => !q || `${a.tag} ${a.species} ${a.aid} ${a.encl}`.toLowerCase().includes(q));
  if (!list.find(a => a.id === S.a.sel) && list[0]) S.a.sel = list[0].id;
  const a = ANIMALS.find(x => x.id === S.a.sel);
  const cats = ['All', ...CATEGORIES];
  const catCount = c => a ? animalMasters(a).filter(m => c === 'All' || m.cat === c).length : 0;
  const totalEntries = ANIMALS.reduce((s, x) => s + animalMasters(x).reduce((t, m) => t + inRange(recs(x.id, m.id), 'W').length, 0), 0);
  return `
  <header class="hdr">
    <div class="hdr__row">
      ${ic('back', 'var(--on-secondary-container)')}
      <div class="hdr__title">
        <div class="hdr__title-row"><span class="t-major-title name">Assessments</span></div>
        <div class="hdr__sub t-body-medium"><span class="t-body-medium">Rescue &amp; Rehab Centre</span><span class="sep t-body-medium">|</span><span class="t-body-medium">${plural(ANIMALS.length, 'Animal')}</span><span class="sep t-body-medium">|</span><span class="t-body-medium">${totalEntries} entries this week</span></div>
      </div>
    </div>
    <div class="hdr__tools">
      <label class="tab-search">${ic('search', 'var(--on-surface-variant)', 'app-icon--20')}<input class="t-body-medium" data-in="aq" value="${esc(S.a.q)}" placeholder="Search animals by tag, species or enclosure"></label>
      <button class="tab-date" data-act="rangeMenu" style="background:none;padding:0;cursor:pointer"><span class="value t-body-medium" style="text-align:left">${RANGE_LABEL[S.a.range]}</span><span class="well">${ic('calendar')}</span></button>
    </div>
    <div class="hdr__tabs-wrap"><div class="tab-primary-tabs t-body-medium">${cats.map(c => `<button class="tab-primary t-body-medium${c === S.a.cat ? ' tab-primary--active' : ''}" data-act="aCat" data-v="${c}">${c} - ${catCount(c)}</button>`).join('')}</div></div>
  </header>
  <div class="canvas">
    <div class="split">
      <section class="card list-card" aria-label="Animals">
        <div class="list-card__hd"><span class="t-minor-medium">${plural(list.length, 'Animal')}</span></div>
        <div class="list-card__scroll">${list.map(x => animalRow(x)).join('') || `<div class="empty t-body-regular">No animals match “${esc(S.a.q)}”.</div>`}</div>
      </section>
      <section class="card detail-card">${a ? (S.a.open ? assessDetail(a, M(S.a.open)) : animalOverview(a)) : ''}</section>
    </div>
  </div>`;
}
function badge(a) { return `<span class="app-photo-badge app-photo-badge--${a.g} t-small">${a.g === 'male' ? 'M' : 'F'}</span>`; }
function animalRow(a) {
  const ms = animalMasters(a), done = ms.filter(m => inRange(recs(a.id, m.id), 'W').length).length;
  return `<button class="row${a.id === S.a.sel ? ' on' : ''}" data-act="aSel" data-v="${a.id}">
    <div class="app-animal-card app-animal-card--compact"><div class="app-profile"><img class="photo" src="${a.img}" alt="">${badge(a)}</div>
      <div class="app-animal-card__details"><span class="tag t-body-title">${esc(a.tag)}</span><span class="t-body-medium">${esc(a.species)}</span><span class="t-subtext-regular muted">${done}/${ms.length} recorded this week</span></div></div></button>`;
}
function animalOverview(a) {
  const ms = animalMasters(a).filter(m => S.a.cat === 'All' || m.cat === S.a.cat);
  const all = animalMasters(a), done = all.filter(m => inRange(recs(a.id, m.id), 'W').length).length;
  return `<div class="detail-card__hd"><div class="ttl"><span class="t-minor-medium">Assessments</span><span class="t-subtext-regular muted">${done} of ${all.length} recorded this week · tap a card for history, ⊕ to add an entry</span></div></div>
  <div class="detail-card__bd">
    <div class="block"><div class="animal-sum"><div class="app-profile"><img class="photo" src="${a.img}" alt="">${badge(a)}</div>
      <div class="info"><span class="t-body-title navy">${esc(a.tag)}</span><span class="t-body-medium">${esc(a.aid)}</span><span class="t-body-medium">${esc(a.species)}</span><span class="t-body-reg-italic muted">${esc(a.sci)}</span><span class="t-body-medium">Site: ${esc(a.site)} · ${esc(a.encl)}</span></div>
      <div class="progress"><span class="stag ${done === all.length ? 'sstag--done' : 'sstag--due'} t-subtext-title">${done === all.length ? 'All recorded' : `${all.length - done} due`}</span></div></div></div>
    <div class="block">${ms.length ? `<div class="tiles">${ms.map(m => tile(a, m)).join('')}</div>` : `<div class="empty t-body-regular">No ${esc(S.a.cat)} assessments for this animal.</div>`}</div>
  </div>`;
}
function tile(a, m) {
  const list = recs(a.id, m.id), last = list[0];
  let body;
  if (!last) body = `<div class="tile__val"><div class="now"><span class="v t-minor-medium">No readings yet</span></div></div>`;
  else if (isNumeric(m)) {
    const f = fmt(m, last), prev = list.slice(1, m.range ? 2 : 3);
    body = `<div class="tile__val"><div class="now"><span class="v"><span class="t-medium-medium">${esc(f.v)}</span> <span class="t-subtext-regular navy">${esc(f.u)}</span></span><span class="t-small muted">${fShort(last.t)}</span></div>
      ${spark(list.slice(0, 8).reverse().map(r => numOf(m, r)))}</div>
      <div class="tile__foot t-small">${prev.map(r => `<span>${esc(fmt(m, r).v)} ${esc(fmt(m, r).u)} · ${ago(r.t)}</span>`).join('')}</div>`;
  } else body = `<span class="tile__text t-body-medium">${esc(fmt(m, last).v)}</span><div class="tile__foot t-small"><span>${esc(last.by)}</span><span>${ago(last.t)}</span></div>`;
  return `<div class="tile${last ? '' : ' tile--empty'}" role="button" tabindex="0" data-act="aOpen" data-v="${m.id}">
    <div class="tile__hd"><div class="ttl"><span class="name t-body-title">${esc(m.name)} ${ic('dropdown', 'var(--on-primary-container)', 'app-icon--16', 'chev-r')}</span><span class="t-subtext-regular muted">${esc(m.cat)}</span></div></div>
    <button class="tile__add" data-act="add" data-v="${m.id}" aria-label="Add ${esc(m.name)} entry">${ic('plus', 'var(--on-surface)', 'app-icon--20')}</button>
    ${body}</div>`;
}
function spark(vals) {
  if (vals.length < 2) return '<span class="spark"></span>';
  const W = 100, H = 32, lo = Math.min(...vals), hi = Math.max(...vals), span = hi - lo || 1;
  const pts = vals.map((v, i) => `${(i / (vals.length - 1)) * W},${H - 3 - ((v - lo) / span) * (H - 6)}`).join(' ');
  const col = vals[vals.length - 1] >= vals[0] ? 'var(--primary-main)' : 'var(--tertiary)';
  return `<svg class="spark" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><polyline points="${pts}" fill="none" style="stroke:${col};stroke-width:1.5" vector-effect="non-scaling-stroke"/></svg>`;
}
function assessDetail(a, m) {
  if (!m) { S.a.open = null; return animalOverview(a); }
  const all = recs(a.id, m.id), list = inRange(all, S.a.range);
  return `<div class="detail-card__hd"><button class="tab-iconbox" style="width:36px;height:36px;padding:6px;background:var(--background)" data-act="aBack" aria-label="All assessments">${ic('back', 'var(--on-primary-container)')}</button>
      <div class="ttl"><span class="t-minor-medium">${esc(m.name)}</span><span class="t-subtext-regular muted">${esc(a.tag)} · ${esc(m.cat)} · ${TYPE(m.type).label}</span></div>
      <button class="btn btn--admit t-body-medium" style="width:auto;padding:0 var(--sp-16);gap:var(--sp-4)" data-act="add" data-v="${m.id}">${ic('plus', 'var(--on-primary)', 'app-icon--20')}Add Entry</button></div>
  <div class="detail-card__bd">
    ${m.type === 'text' ? '' : `<div class="block">${summary(m, list)}</div>`}
    ${m.refs?.length ? `<div class="block"><div class="block__hd"><span class="t-minor-medium">References</span><button class="link t-body-medium" data-act="viewer" data-v="${m.id}" data-i="0">View All ${ic('dropdown', 'var(--on-surface)', 'app-icon--16', 'chev-r')}</button></div>${refGrid(m)}</div>` : ''}
    <div class="block"><div class="block__hd"><span class="t-minor-medium">All Records</span><span class="t-subtext-regular muted">${plural(list.length, 'Reading')} · ${RANGE_LABEL[S.a.range].toLowerCase()}</span></div>
      ${list.length ? `<div class="records">${list.map(r => recRow(m, r)).join('')}</div>` : `<div class="empty t-body-regular">${ic('notes', 'var(--outline)', 'app-icon--28')}<span class="t-body-regular">No readings in this period.</span><button class="btn btn--admit t-body-medium" style="width:auto;padding:0 var(--sp-16)" data-act="add" data-v="${m.id}">Add the first entry</button></div>`}</div>
  </div>`;
}
function refGrid(m, max = 4, cls = '') {
  const r = m.refs, show = r.slice(0, max);
  return `<div class="refs ${cls}">${show.map((x, i) => `<button data-act="viewer" data-v="${m.id}" data-i="${i}" aria-label="${esc(x.name)}">${x.kind === 'img' ? `<img src="${x.src}" alt="">` : `<span class="doc">${ic('pdf', 'var(--tertiary)', 'app-icon--28')}</span>`}${i === max - 1 && r.length > max ? `<span class="more t-minor-title">+${r.length - max + 1}</span>` : ''}</button>`).join('')}</div>`;
}
function recRow(m, r) {
  const f = fmt(m, r), big = isNumeric(m);
  return `<div class="rec${r.id === S.a.newId ? ' is-new' : ''}" data-rec="${r.id}">
    <div class="rec__date"><span class="t-subtext-title">${fDate(r.t)}</span><span class="t-subtext-regular muted">${fTime(r.t)}</span></div>
    <div class="rec__pill" ${r.note ? `data-act="note" role="button" tabindex="0" data-note` : ''}>
      <div class="rec__val"><span class="v ${big ? '' : 't-body-medium'}">${big ? `<span class="t-medium-medium">${esc(f.v)}</span> <span class="u t-subtext-regular">${esc(f.u)}</span>` : esc(f.v)}</span>${r.note ? ic('notes', 'var(--moderate-secondary)', 'app-icon--20') : ''}</div>
      <div class="rec__by t-subtext-regular"><span>${esc(r.by)}</span><span>${fDate(r.t)} • ${fTime(r.t)}</span></div>
      ${r.note ? `<div class="rec__note t-body-regular">${esc(r.note)}</div>` : ''}</div></div>`;
}
function summary(m, list) {
  const seg = `<div class="graph-hd"><div class="seg" style="flex:1">${Object.keys(RANGES).map(k => `<button class="t-body-medium${k === S.a.range ? ' on' : ''}" data-act="range" data-v="${k}">${k}</button>`).join('')}</div>
    ${isNumeric(m) ? `<div class="seg seg--sm">${['line', 'bar'].map(c => `<button class="t-subtext-title${c === S.a.chart ? ' on' : ''}" data-act="chart" data-v="${c}">${c === 'line' ? 'Line' : 'Bar'}</button>`).join('')}</div>` : ''}</div>`;
  if (!list.length) return seg + `<div class="empty t-body-regular">No readings in ${RANGE_LABEL[S.a.range].toLowerCase()}.</div>`;
  const span = `${fShort(list[list.length - 1].t)} – ${fShort(list[0].t)} · ${plural(list.length, 'reading')}`;
  if (isNumeric(m)) {
    const nums = list.map(r => numOf(m, r)), avg = nums.reduce((s, v) => s + v, 0) / nums.length;
    const hiR = list[nums.indexOf(Math.max(...nums))], loR = list[nums.indexOf(Math.min(...nums))];
    const u = fmt(m, list[0]).u;
    const stat = (k, r, cls = '') => `<div class="stat"><span class="t-body-regular">${k}</span><span class="v${cls}"><span class="t-medium-medium">${esc(fmt(m, r).v)}</span> <span class="t-subtext-regular">${esc(u)}</span></span><span class="t-small muted">${fShort(r.t)}</span></div>`;
    return seg + `<div class="graph-hd"><div class="avg"><span class="t-small muted">AVERAGE</span><span class="ink"><span class="t-stat-title">${Math.round(avg * 10) / 10}</span> <span class="t-body-regular">${esc(u)}</span></span><span class="t-subtext-regular muted">${span}</span></div></div>
      <div class="graph">${graph(m, list.slice().reverse())}</div>
      <div class="stats">${stat('Latest', list[0])}${stat('Highest', hiR)}${stat('Lowest', loR, ' lo')}</div>`;
  }
  const counts = {}; list.forEach(r => (m.type === 'list' ? r.v : [fmt(m, r).v]).forEach(x => counts[x] = (counts[x] || 0) + 1));
  const top = Object.entries(counts).sort((x, y) => y[1] - x[1]).slice(0, 5);
  return seg + `<div class="avg" style="display:flex;flex-direction:column;gap:2px"><span class="t-subtext-regular muted">Most Frequent</span><span class="t-major-medium ink">${esc(top[0][0])}</span><span class="t-subtext-regular muted">${span}</span></div>
    <span class="t-body-medium">Top ${top.length} responses recorded</span>
    <div class="freq">${top.map(([k, n]) => `<div class="freq__row"><div class="top"><span class="t-body-regular">${esc(k)}</span><span class="t-subtext-regular muted">${plural(n, 'time')} • ${Math.round(n / list.length * 100)}%</span></div><div class="bar"><i style="width:${n / top[0][1] * 100}%"></i></div></div>`).join('')}</div>`;
}
function graph(m, pts) {
  const W = 470, H = 210, L = 40, R = 12, T = 20, B = 26, pw = W - L - R, ph = H - T - B, range = m.type === 'slider' && m.range;
  const vals = pts.flatMap(r => range ? r.v : [numOf(m, r)]);
  let lo = Math.min(...vals), hi = Math.max(...vals); const pad = Math.max((hi - lo) * .2, hi * .01, .5); lo -= pad; hi += pad;
  const t0 = TODAY.getTime() - RANGES[S.a.range] * 86400000, t1 = TODAY.getTime();
  const x = r => L + ((r.t.getTime() - t0) / (t1 - t0)) * pw, y = v => T + ph - ((v - lo) / (hi - lo)) * ph;
  const dec = hi - lo > 10 ? 0 : 1, ticks = [0, 1, 2, 3, 4].map(i => lo + (hi - lo) * i / 4);
  const first = numOf(m, pts[0]), lastV = numOf(m, pts[pts.length - 1]);
  const col = range || lastV >= first ? 'var(--primary-main)' : 'var(--tertiary)';
  let g = ticks.map(v => `<line class="grid" x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}"/><text class="axis t-small" x="${L - 8}" y="${y(v) + 3}" text-anchor="end">${v.toFixed(dec)}</text>`).join('');
  const days = RANGES[S.a.range], nt = 6;
  for (let i = 0; i <= nt; i++) { const d = new Date(t0 + (t1 - t0) * i / nt); g += `<text class="axis t-small" x="${L + pw * i / nt}" y="${H - 6}" text-anchor="middle">${days <= 7 ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()] : `${d.getDate()} ${MON[d.getMonth()]}`}</text>`; }
  const avg = vals.reduce((s, v) => s + v, 0) / vals.length;
  const bw = Math.max(4, Math.min(24, pw / Math.max(pts.length, 1) * .6));
  let marks;
  if (range) marks = pts.map(r => `<rect x="${x(r) - bw / 2}" y="${y(r.v[1])}" width="${bw}" height="${Math.max(2, y(r.v[0]) - y(r.v[1]))}" rx="${Math.min(4, bw / 2)}" style="fill:${col}"/>`).join('');
  else if (S.a.chart === 'bar') marks = `<line class="avgline" x1="${L}" x2="${W - R}" y1="${y(avg)}" y2="${y(avg)}"/>` + pts.map(r => `<rect x="${x(r) - bw / 2}" y="${y(numOf(m, r))}" width="${bw}" height="${T + ph - y(numOf(m, r))}" rx="3" style="fill:${col}"/>`).join('');
  else {
    const P = pts.map(r => [x(r), y(numOf(m, r))]);
    const d = P.map((p, i) => i ? `C${(P[i - 1][0] + p[0]) / 2},${P[i - 1][1]} ${(P[i - 1][0] + p[0]) / 2},${p[1]} ${p[0]},${p[1]}` : `M${p[0]},${p[1]}`).join(' ');
    marks = `<defs><linearGradient id="gFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" style="stop-color:${col};stop-opacity:.28"/><stop offset="1" style="stop-color:${col};stop-opacity:0"/></linearGradient></defs>
      <line class="avgline" x1="${L}" x2="${W - R}" y1="${y(avg)}" y2="${y(avg)}"/>
      ${P.length > 1 ? `<path d="${d} L${P[P.length - 1][0]},${T + ph} L${P[0][0]},${T + ph} Z" fill="url(#gFill)"/><path d="${d}" fill="none" style="stroke:${col};stroke-width:2"/>` : ''}
      ${P.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="${pts.length > 20 ? 2 : 3.5}" style="fill:var(--on-primary);stroke:${col};stroke-width:2"/>`).join('')}`;
  }
  const hits = pts.map((r, i) => `<rect class="hit" x="${x(r) - 8}" y="${T}" width="16" height="${ph}" data-act="tip" data-v="${r.id}"/>`).join('');
  let tip = '';
  const tr = pts.find(r => r.id === S.a.tip);
  if (tr) { const f = fmt(m, tr), label = `${f.v} ${f.u} · ${fShort(tr.t)}`, tw = label.length * 6 + 16, tx = Math.min(Math.max(x(tr) - tw / 2, L), W - R - tw), ty = Math.max(0, y(range ? tr.v[1] : numOf(m, tr)) - 30);
    tip = `<g class="tip"><line x1="${x(tr)}" x2="${x(tr)}" y1="${T}" y2="${T + ph}" style="stroke:var(--on-primary-container);stroke-width:1"/><rect x="${tx}" y="${ty}" width="${tw}" height="22" rx="4"/><text class="t-small" x="${tx + tw / 2}" y="${ty + 14}" text-anchor="middle">${esc(label)}</text></g>`; }
  return `<svg viewBox="0 0 ${W} ${H}">${g}${marks}${hits}${tip}</svg>`;
}

/* =============================== MASTERS (admin) =============================== */
function vMasters() {
  const q = S.m.q.toLowerCase(), all = DB.masters;
  const counts = { All: all.length, Active: all.filter(m => m.active).length, Inactive: all.filter(m => !m.active).length };
  const list = all.filter(m => (S.m.filter === 'All' || (S.m.filter === 'Active') === m.active) && (S.m.cat === 'All Categories' || m.cat === S.m.cat) && (!q || `${m.name} ${m.cat} ${TYPE(m.type).label}`.toLowerCase().includes(q)));
  if (!list.find(m => m.id === S.m.sel) && list[0]) S.m.sel = list[0].id;
  const m = list.find(x => x.id === S.m.sel);
  const groups = CATEGORIES.filter(c => list.some(x => x.cat === c));
  return `
  <header class="hdr">
    <div class="hdr__row">
      ${ic('back', 'var(--on-secondary-container)')}
      <div class="hdr__title">
        <div class="hdr__title-row"><span class="t-major-title name">Assessment Masters</span></div>
        <div class="hdr__sub t-body-medium"><span class="t-body-medium">${plural(all.length, 'type')}</span><span class="sep t-body-medium">|</span><span class="t-body-medium">${plural(CATEGORIES.length, 'category').replace('categorys', 'categories')}</span><span class="sep t-body-medium">|</span><span class="t-body-medium">Used in animal templates</span></div>
      </div>
      <div class="hdr__end"><button class="tab-iconbox" data-act="mastersMenu" aria-label="More">${ic('menu-vertical')}</button></div>
    </div>
    <div class="hdr__tools">
      <label class="tab-search">${ic('search', 'var(--on-surface-variant)', 'app-icon--20')}<input class="t-body-medium" data-in="mq" value="${esc(S.m.q)}" placeholder="Search assessment types"></label>
      <button class="tab-dd t-body-medium" data-act="catMenu" style="height:44px;border:1px solid var(--outline-variant);cursor:pointer">${esc(S.m.cat)} ${ic('dropdown', 'var(--on-surface-variant)', 'app-icon--20')}</button>
    </div>
    <div class="hdr__tabs-wrap"><div class="tab-primary-tabs t-body-medium">${Object.keys(counts).map(k => `<button class="tab-primary t-body-medium${k === S.m.filter ? ' tab-primary--active' : ''}" data-act="mFilter" data-v="${k}">${k} - ${counts[k]}</button>`).join('')}</div></div>
  </header>
  <div class="canvas">
    <div class="split">
      <section class="card list-card" aria-label="Assessment types">
        <div class="list-card__hd"><span class="t-minor-medium">${plural(list.length, 'Type')}</span></div>
        <div class="list-card__scroll">${groups.map(c => `<div class="group t-subtext-title">${c}</div>` + list.filter(x => x.cat === c).map(x => `
          <button class="row${x.id === S.m.sel ? ' on' : ''}" data-act="mSel" data-v="${x.id}"><div class="row-type"><div class="top"><span class="name t-body-title">${esc(x.name)}</span><span class="stag ${x.active ? 'stag--active' : 'stag--inactive'} t-small">${x.active ? 'Active' : 'Inactive'}</span></div>
            <span class="t-subtext-regular muted">${TYPE(x.type).label} · ${plural(x.templates, 'template')}</span></div></button>`).join('')).join('') || `<div class="empty t-body-regular">No types match.</div>`}</div>
      </section>
      <section class="card detail-card">${m ? masterDetail(m) : `<div class="empty t-body-regular">Select a type to see its details.</div>`}</section>
    </div>
  </div>
  <button class="fab t-minor-medium" data-act="newType">${ic('plus', 'var(--on-primary)')}New Assessment Type</button>`;
}
function masterDetail(m) {
  let cfg = '';
  if (m.type === 'number') cfg = kv('Measurement Type', m.measure) + kv('Unit', m.unit);
  if (m.type === 'slider') cfg = kv('Measurement Type', `${m.measure} (${m.unit})`) + kv('Interval', m.step) + kv('Lowest', `${m.min}${m.minL ? ' · ' + m.minL : ''}`) + kv('Highest', `${m.max}${m.maxL ? ' · ' + m.maxL : ''}`) + kv('Range Selection', m.range ? 'Enabled' : 'Disabled');
  if (m.type === 'list') cfg = kv('Selection', m.multi ? 'Multi Select' : 'Single Select');
  const items = m.type === 'list' ? `<div class="block"><div class="block__hd"><span class="t-minor-medium">List Items</span><span class="t-subtext-regular muted">${m.items.length}</span></div><div class="opts--2">${m.items.map(i => `<div class="app-radio app-field--filled t-body-regular" style="height:48px;cursor:default"><span class="lbl">${esc(i)}</span></div>`).join('')}</div></div>`
    : m.type === 'scale' ? `<div class="block"><div class="block__hd"><span class="t-minor-medium">Scale</span><span class="t-subtext-regular muted">${m.scale.length} options</span></div><div class="opts--2">${m.scale.map(([n, l]) => `<div class="app-radio app-field--filled t-body-regular" style="height:48px;cursor:default"><span class="lbl"><span class="t-body-title">${esc(n)}</span>  -  ${esc(l)}</span></div>`).join('')}</div></div>` : '';
  return `<div class="detail-card__hd"><div class="ttl"><span class="t-minor-medium" style="display:flex;align-items:center;gap:var(--sp-8)">${esc(m.name)} <span class="stag ${m.active ? 'stag--active' : 'stag--inactive'} t-small">${m.active ? 'Active' : 'Inactive'}</span></span><span class="t-subtext-regular muted">${esc(m.cat)} · ${TYPE(m.type).label}</span></div>
      <button class="tab-iconbox" style="width:40px;height:40px" data-act="edit" data-v="${m.id}" aria-label="Edit">${ic('pencil')}</button>
      <button class="tab-iconbox" style="width:40px;height:40px" data-act="typeMenu" data-v="${m.id}" aria-label="More">${ic('menu-vertical')}</button></div>
    <div class="detail-card__bd">
      <div class="block"><span class="t-subtext-regular muted">Description</span><span class="t-body-regular">${esc(m.desc) || '—'}</span></div>
      <div class="block"><div class="grid2">${kv('Category', m.cat)}${kv('Response Type', TYPE(m.type).label)}${cfg}</div></div>
      ${items}
      ${m.refs?.length ? `<div class="block"><div class="block__hd"><span class="t-minor-medium">References Added</span><button class="link t-body-medium" data-act="viewer" data-v="${m.id}" data-i="0">View All ${ic('dropdown', 'var(--on-surface)', 'app-icon--16', 'chev-r')}</button></div>${refGrid(m)}</div>` : ''}
      <div class="block"><div class="block__hd"><span class="t-minor-medium">Preview</span><span class="t-subtext-regular muted">What vets see in Add Entry</span></div><div class="preview-box" data-static-preview>${renderInput(m, {}, true)}</div></div>
      <div class="block"><div class="block__hd"><span class="t-body-medium navy">Used in Templates</span><span class="t-minor-title navy">${m.templates}</span></div></div>
    </div>`;
}
const kv = (k, v) => `<div style="display:flex;flex-direction:column;gap:var(--sp-4)"><span class="t-subtext-regular muted">${esc(k)}</span><span class="t-body-regular">${esc(v)}</span></div>`;

/* =============================== FORM (new / edit type) =============================== */
function openForm(m) {
  const base = { name: '', cat: 'Physical Health', desc: '', active: true, type: '', measure: 'Weight', unit: 'kg', min: 0, max: 100, minL: '', maxL: '', step: 1, range: false, multi: false, items: [], scale: [], refs: [] };
  S.f = { mode: m ? 'edit' : 'new', id: m?.id, d: m ? JSON.parse(JSON.stringify({ ...base, ...m })) : base, err: {}, tried: false, pv: {} };
  S.view = 'form'; render(); $('view').querySelector('.form-scroll').scrollTop = 0;
}
const previewMaster = () => ({ ...S.f.d, name: S.f.d.name || 'Assessment name', items: S.f.d.items.length ? S.f.d.items : ['Option 1', 'Option 2'], scale: S.f.d.scale.length ? S.f.d.scale : [[1, 'Option']] });
function validate() {
  const d = S.f.d, e = {};
  if (!d.name.trim()) e.name = 'Enter a name for this assessment.';
  else if (DB.masters.some(m => m.name.toLowerCase() === d.name.trim().toLowerCase() && m.id !== S.f.id)) e.name = 'An assessment with this name already exists.';
  if (!d.type) e.type = 'Choose how vets will answer.';
  if (d.type === 'list' && d.items.length < 2) e.items = 'Add at least two list items.';
  if (d.type === 'scale' && d.scale.length < 2) e.scale = 'Add at least two scale options.';
  if (d.type === 'slider') { if (!(+d.max > +d.min)) e.max = 'Maximum must be more than the minimum.'; if (!(+d.step > 0) || +d.step > +d.max - +d.min) e.step = 'Step must fit inside the range.'; }
  S.f.err = e; return !Object.keys(e).length;
}
function vForm() {
  const f = S.f, d = f.d, E = f.tried ? f.err : {};
  const err = k => E[k] ? `<span class="field__err t-subtext-regular">${esc(E[k])}</span>` : '';
  const units = MEASURES[d.measure] || [''];
  let cfg = '';
  if (d.type === 'text') cfg = `<span class="t-body-regular muted">Nothing to set up. Vets type a free-text answer, and can add notes and a date.</span>`;
  if (d.type === 'number') cfg = `<div class="grid2">
      <label class="app-field app-field--white"><span class="app-field__label t-subtext-regular">Measurement Type</span><select class="t-minor-regular" data-f="measure">${Object.keys(MEASURES).map(k => `<option${k === d.measure ? ' selected' : ''}>${k}</option>`).join('')}</select>${ic('dropdown')}</label>
      <label class="app-field app-field--white"><span class="app-field__label t-subtext-regular">Default Unit</span><select class="t-minor-regular" data-f="unit">${units.map(u => `<option${u === d.unit ? ' selected' : ''}>${u}</option>`).join('')}</select>${ic('dropdown')}</label></div>`;
  if (d.type === 'list') cfg = `<span class="t-minor-regular">Selection Type</span>
      <div class="grid2">${[['0', 'Single Select', 'Vet picks one'], ['1', 'Multi Select', 'Vet picks all that apply']].map(([v, l]) => { const on = (v === '1') === !!d.multi; return `<button class="app-radio${on ? ' app-radio--active' : ''} t-minor-regular" data-act="fMulti" data-v="${v}"><span class="lbl">${l}</span>${ic(on ? 'radio-selected' : 'radio-unselect', on ? 'var(--primary-container)' : 'var(--outline)')}</button>`; }).join('')}</div>
      <div class="fcard__hd" style="margin-top:var(--sp-4)"><span class="t-minor-regular">List Items</span><span class="t-subtext-regular muted">${d.items.length} added</span></div>
      ${d.items.map((it, i) => `<div class="item-row"><label class="app-field app-field--white"><input class="t-body-regular" value="${esc(it)}" data-item="${i}"></label><button class="sqbtn sqbtn--del" data-act="fDel" data-v="${i}" aria-label="Remove">${ic('close-with-circle', 'var(--error)')}</button></div>`).join('')}
      <div class="item-row"><label class="app-field${E.items ? ' app-field--error' : ''}"><input class="t-body-regular" placeholder="Add list item… (press Return)" data-new="item"></label><button class="sqbtn sqbtn--add" data-act="fAdd" aria-label="Add">${ic('plus', 'var(--on-primary)')}</button></div>${err('items')}`;
  if (d.type === 'scale') cfg = `<div class="item-row t-body-title"><span class="num">#&nbsp;Scale</span><span>Option name</span></div>
      ${d.scale.map(([n, l], i) => `<div class="item-row"><label class="app-field app-field--white num"><input class="t-body-regular" inputmode="decimal" value="${esc(n)}" data-sn="${i}"></label><label class="app-field app-field--white"><input class="t-body-regular" value="${esc(l)}" data-sl="${i}"></label><button class="sqbtn sqbtn--del" data-act="fSDel" data-v="${i}" aria-label="Remove">${ic('close-with-circle', 'var(--error)')}</button></div>`).join('')}
      <div class="item-row"><label class="app-field num${E.scale ? ' app-field--error' : ''}"><input class="t-body-regular" inputmode="decimal" placeholder="0" data-new="sn"></label><label class="app-field${E.scale ? ' app-field--error' : ''}"><input class="t-body-regular" placeholder="Name (press Return)" data-new="sl"></label><button class="sqbtn sqbtn--add" data-act="fSAdd" aria-label="Add">${ic('plus', 'var(--on-primary)')}</button></div>${err('scale')}`;
  if (d.type === 'slider') cfg = `<label class="app-field app-field--white"><span class="app-field__label t-subtext-regular">Set Measurement Type</span><select class="t-minor-regular" data-f="measure">${Object.keys(MEASURES).map(k => `<option${k === d.measure ? ' selected' : ''}>${k}</option>`).join('')}</select>${ic('dropdown')}</label>
      <div class="grid2"><label class="app-field app-field--white"><span class="app-field__label t-subtext-regular">Minimum</span><input class="t-minor-regular" inputmode="decimal" value="${esc(d.min)}" data-f="min"><span class="unit t-body-regular">${esc(d.unit)}</span></label><label class="app-field app-field--white"><span class="app-field__label t-subtext-regular">Label (optional)</span><input class="t-minor-regular" value="${esc(d.minL)}" placeholder="e.g. Lowest" data-f="minL"></label></div>
      <div class="field"><div class="grid2"><label class="app-field app-field--white${E.max ? ' app-field--error' : ''}"><span class="app-field__label t-subtext-regular">Maximum</span><input class="t-minor-regular" inputmode="decimal" value="${esc(d.max)}" data-f="max"><span class="unit t-body-regular">${esc(d.unit)}</span></label><label class="app-field app-field--white"><span class="app-field__label t-subtext-regular">Label (optional)</span><input class="t-minor-regular" value="${esc(d.maxL)}" placeholder="e.g. Highest" data-f="maxL"></label></div>${err('max')}</div>
      <div class="field"><span class="t-minor-regular">Interval / Steps <span class="t-subtext-regular muted">(optional)</span></span><span class="t-subtext-regular muted">The step size between values.</span>
        <div class="stepper"><button class="t-minor-title" data-act="fStep" data-v="-1" aria-label="Decrease">−</button><input class="t-minor-medium" inputmode="decimal" value="${esc(d.step)}" data-f="step"><button class="t-minor-title" data-act="fStep" data-v="1" aria-label="Increase">+</button></div>${err('step')}</div>
      <div class="switch-row"><div><span class="t-minor-regular navy">Allow Range Selection?</span><span class="t-subtext-regular muted">Let vets select any two values within this range, e.g. 60 - 100 bpm.</span></div><button class="app-switch ${d.range ? 'is-on' : 'is-off'}" data-act="fRange" role="switch" aria-checked="${d.range}"><span class="app-switch__knob"></span></button></div>`;
  return `
  <header class="hdr hdr--plain"><div class="hdr__row">${ic('back', 'var(--on-secondary-container)', '', 'hdr__back" data-act="fCancel')}
    <div class="hdr__title"><div class="hdr__title-row"><span class="t-major-title name">${f.mode === 'edit' ? 'Edit Assessment Type' : 'New Assessment Type'}</span></div>${f.mode === 'edit' ? `<div class="hdr__sub t-body-medium"><span class="t-body-medium">Changes apply to new entries; past records keep their values</span></div>` : ''}</div></div></header>
  <div class="form-scroll">
    <section class="fcard">
      <div class="fcard__hd"><span class="t-minor-regular">Basic Details</span></div>
      <div class="grid2">
        <label class="app-field app-field--white"><span class="app-field__label t-subtext-regular">Category</span><select class="t-minor-regular" data-f="cat">${CATEGORIES.map(c => `<option${c === d.cat ? ' selected' : ''}>${c}</option>`).join('')}</select>${ic('dropdown')}</label>
        <div class="field"><label class="app-field app-field--white${E.name ? ' app-field--error' : ''}"><span class="app-field__label t-subtext-regular">Assessment Name*</span><input class="t-minor-regular" value="${esc(d.name)}" placeholder="e.g. Eye Condition" data-f="name" maxlength="60"></label>${err('name')}</div>
      </div>
      <label class="app-field app-field--white app-field--area"><span class="app-field__label t-subtext-regular">Description</span><textarea class="t-minor-regular" rows="2" placeholder="What should the vet look for?" data-f="desc">${esc(d.desc)}</textarea></label>
      <div class="switch-row"><div><span class="t-minor-regular navy">Mark as Active</span><span class="t-subtext-regular muted">Active types are available for selection in animal templates.</span></div><button class="app-switch ${d.active ? 'is-on' : 'is-off'}" data-act="fActive" role="switch" aria-checked="${d.active}"><span class="app-switch__knob"></span></button></div>
    </section>
    <section class="fcard">
      <div class="fcard__hd"><div><span class="t-minor-regular">Response Type*</span><span class="sub t-subtext-regular muted">How vets answer this assessment</span></div></div>
      <div class="choice-row">${TYPES.map(t => `<button class="choice t-body-medium${t.key === d.type ? ' on' : ''}" data-act="fType" data-v="${t.key}">${ic(t.icon, t.key === d.type ? 'var(--on-primary-container)' : 'var(--outline)', 'app-icon--20')}${t.label}</button>`).join('')}</div>
      ${d.type ? `<span class="t-subtext-regular muted">${TYPE(d.type).hint}</span>` : err('type')}
    </section>
    ${d.type ? `<section class="fcard"><div class="fcard__hd"><span class="t-minor-regular">${TYPE(d.type).label} Settings</span></div>${cfg}</section>` : ''}
    <section class="fcard">
      <div class="fcard__hd"><div><span class="t-minor-regular">Reference Details</span><span class="sub t-subtext-regular muted">Optional · photos or documents that show vets what to look for</span></div></div>
      ${d.refs.length ? `<div class="files">${d.refs.map((r, i) => `<span class="file">${r.kind === 'img' ? `<img src="${r.src}" alt="">` : `<span class="app-attachment app-attachment--pdf">${ic('pdf', 'var(--tertiary)')}</span>`}<span class="n t-body-regular">${esc(r.name)}</span><button data-act="fRefDel" data-v="${i}" aria-label="Remove">${ic('close-with-circle', 'var(--outline)', 'app-icon--20')}</button></span>`).join('')}</div>` : ''}
      <label class="upload"><span class="app-attachment">${ic('attachment', 'var(--on-primary-container)')}</span><span class="txt"><span class="t-body-title">Upload Files</span><span class="t-subtext-regular muted">JPEG, PNG, PDF, DOC or MP4 · max 50 MB each</span></span><input type="file" multiple accept="image/*,.pdf,.doc,.docx,video/mp4" data-f="files" hidden></label>
    </section>
    ${d.type ? `<section class="fcard"><div class="fcard__hd"><div><span class="t-minor-regular">Preview</span><span class="sub t-subtext-regular muted">This is what vets see in Add Entry. Try it.</span></div></div><div class="preview-box"><div class="sec"><span class="t-minor-title navy">${esc(d.name || 'Assessment name')}</span></div><div data-preview>${renderInput(previewMaster(), f.pv)}</div></div></section>` : ''}
  </div>
  <div class="actionbar"><button class="bigbtn bigbtn--ghost t-minor-medium" data-act="fCancel">Cancel</button><button class="bigbtn bigbtn--navy t-minor-medium" data-act="fSubmit">${f.mode === 'edit' ? 'Save Changes' : 'Submit'}</button></div>`;
}
function wireForm() {
  const root = $('view');
  root.querySelectorAll('[data-f]').forEach(el => {
    const k = el.dataset.f;
    if (k === 'files') { el.onchange = () => { [...el.files].forEach(file => { if (file.size > 50 * 1024 * 1024) { toast(`${file.name} is over 50 MB`); return; } S.f.d.refs.push(file.type.startsWith('image/') ? { kind: 'img', src: URL.createObjectURL(file), name: file.name } : { kind: 'pdf', name: file.name }); }); rerenderForm(); }; return; }
    const ev = el.tagName === 'SELECT' ? 'change' : 'input';
    el.addEventListener(ev, () => {
      const d = S.f.d; d[k] = ['min', 'max', 'step'].includes(k) ? el.value : el.value;
      if (k === 'measure') { d.unit = MEASURES[d.measure][0]; rerenderForm(); return; }
      if (S.f.tried) validate();
      if (k === 'name' || k === 'unit' || ['min', 'max', 'minL', 'maxL', 'step'].includes(k)) refreshPreview();
      if (k === 'cat' || k === 'unit') rerenderForm();
    });
    if (['min', 'max', 'step'].includes(k)) el.addEventListener('change', () => { S.f.d[k] = +el.value || 0; if (S.f.tried) validate(); rerenderForm(); });
  });
  root.querySelectorAll('[data-item]').forEach(el => el.oninput = () => { S.f.d.items[+el.dataset.item] = el.value; refreshPreview(); });
  root.querySelectorAll('[data-sn]').forEach(el => el.oninput = () => { S.f.d.scale[+el.dataset.sn][0] = el.value; refreshPreview(); });
  root.querySelectorAll('[data-sl]').forEach(el => el.oninput = () => { S.f.d.scale[+el.dataset.sl][1] = el.value; refreshPreview(); });
  root.querySelectorAll('[data-new]').forEach(el => el.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); el.dataset.new === 'item' ? addItem() : addScale(); } });
}
function refreshPreview() { const pv = document.querySelector('[data-preview]'); if (!pv) return; const t = document.querySelector('.preview-box .sec .t-minor-title'); if (t) t.textContent = S.f.d.name || 'Assessment name'; const go = () => { pv.innerHTML = renderInput(previewMaster(), S.f.pv); wireInput(pv, previewMaster(), S.f.pv, go); }; go(); }
function rerenderForm(focusSel) { const sc = $('view').querySelector('.form-scroll')?.scrollTop || 0; $('view').innerHTML = vForm(); wireForm(); refreshPreview(); const s = $('view').querySelector('.form-scroll'); if (s) s.scrollTop = sc; if (focusSel) $('view').querySelector(focusSel)?.focus(); }
function addItem() { const el = $('view').querySelector('[data-new="item"]'), v = el.value.trim(); if (!v) { el.focus(); return; } if (S.f.d.items.some(x => x.toLowerCase() === v.toLowerCase())) { toast(`“${v}” is already in the list`); return; } S.f.d.items.push(v); if (S.f.tried) validate(); rerenderForm('[data-new="item"]'); }
function addScale() { const n = $('view').querySelector('[data-new="sn"]'), l = $('view').querySelector('[data-new="sl"]'); if (n.value.trim() === '' || isNaN(+n.value)) { n.focus(); return; } if (!l.value.trim()) { l.focus(); return; } S.f.d.scale.push([+n.value, l.value.trim()]); S.f.d.scale.sort((a, b) => a[0] - b[0]); if (S.f.tried) validate(); rerenderForm('[data-new="sn"]'); }
function submitForm() {
  S.f.tried = true;
  if (!validate()) { rerenderForm(); const firstErr = $('view').querySelector('.app-field--error input, .field__err'); firstErr?.scrollIntoView({ block: 'center', behavior: 'smooth' }); toast('Check the highlighted fields'); return; }
  const d = S.f.d, clean = { ...d, name: d.name.trim(), min: +d.min, max: +d.max, step: +d.step || 1, items: d.items.map(s => s.trim()).filter(Boolean), scale: d.scale.map(([n, l]) => [+n, l]) };
  if (S.f.mode === 'edit') { Object.assign(M(S.f.id), clean); S.m.sel = S.f.id; toast(`${clean.name} updated`); }
  else { const id = 'm' + uid(); DB.masters.push({ ...clean, id, templates: 0, extraFor: ['a1', 'a2', 'a3', 'a4', 'a5', 'a6'] }); S.m.sel = id; S.m.filter = 'All'; S.m.cat = 'All Categories'; S.m.q = ''; toast(`${clean.name} created · added to all animals`); }
  save(); S.f = null; S.view = 'masters'; S.tab = 'masters'; render();
}

/* =============================== response inputs (sheet + previews) =============================== */
const sliderDefaults = m => { const st = +m.step || 1, snap = v => Math.round(v / st) * st; return { lo: m.range ? snap(+m.min + (m.max - m.min) * .2) : +m.min, hi: snap(+m.min + (m.max - m.min) * (m.range ? .5 : .4)) }; };
function renderInput(m, st, readonly = false) {
  const dis = readonly ? ' disabled' : '';
  if (m.type === 'text') return `<label class="app-field app-field--white app-field--area"><textarea class="t-minor-regular" rows="3" placeholder="Type your observation" data-in-text${dis}>${esc(st.text || '')}</textarea></label>`;
  if (m.type === 'number') { const units = MEASURES[m.measure] || [m.unit]; return `<div class="grid2"><label class="app-field app-field--white${st.err ? ' app-field--error' : ''}"><span class="app-field__label t-subtext-regular">${esc(m.measure || 'Value')}*</span><input class="t-minor-medium" type="text" inputmode="decimal" placeholder="0.0" value="${esc(st.value ?? '')}" data-in-num${dis}></label>
      <label class="app-field app-field--white"><span class="app-field__label t-subtext-regular">Unit</span><select class="t-minor-medium" data-in-unit${dis}>${units.map(u => `<option${u === (st.unit || m.unit) ? ' selected' : ''}>${u}</option>`).join('')}</select>${ic('dropdown')}</label></div>${st.err ? `<span class="field__err t-subtext-regular">${esc(st.err)}</span>` : ''}`; }
  if (m.type === 'list' || m.type === 'scale') {
    const multi = m.type === 'list' && m.multi, sel = st.sel || [];
    const opts = m.type === 'scale' ? m.scale.map(([n, l]) => ({ k: String(n), l: `<span class="t-minor-title">${esc(n)}</span>  -  ${esc(l)}` })) : m.items.map(i => ({ k: i, l: esc(i) }));
    return `<div class="field"><span class="t-body-title navy">${multi ? 'Select all that apply' : 'Select any one'}</span><span class="t-subtext-regular muted">${multi ? 'Choose one or more options.' : 'Select the most appropriate.'}</span></div>
      <div class="${opts.length > 4 ? 'opts--2' : 'opts'}">${opts.map(o => { const on = sel.includes(o.k); const icn = multi ? (on ? 'checkbox-checked' : 'checkbox-unchecked') : (on ? 'radio-selected' : 'radio-unselect');
        return `<button type="button" class="app-radio${on ? ' app-radio--active' : ''} t-minor-regular" style="height:52px" data-opt="${esc(o.k)}"${dis}><span class="lbl">${o.l}</span>${ic(icn, on ? 'var(--primary-container)' : 'var(--outline)')}</button>`; }).join('')}</div>${st.err ? `<span class="field__err t-subtext-regular">${esc(st.err)}</span>` : ''}`;
  }
  if (m.type === 'slider') {
    const dv = sliderDefaults(m), lo = st.lo ?? dv.lo, hi = st.hi ?? dv.hi, min = +m.min, max = +m.max, pct = v => max > min ? ((v - min) / (max - min)) * 100 : 0;
    return `<div class="field"><span class="t-body-title navy">${m.range ? 'Range' : 'Value'}</span><span class="t-subtext-regular muted">Drag to set the ${m.range ? 'value range' : 'value'} for this assessment.</span></div>
      <div class="bigval"><span class="t-large-title">${m.range ? `${lo} - ${hi}` : hi}</span><span class="t-minor-regular">${esc(m.unit)}</span></div>
      <div class="slider" data-slider role="slider" aria-valuemin="${min}" aria-valuemax="${max}" aria-valuenow="${hi}"><div class="slider__track"></div><div class="slider__fill" style="left:${m.range ? pct(lo) : 0}%;width:${pct(hi) - (m.range ? pct(lo) : 0)}%"></div>${m.range ? `<div class="slider__knob" style="left:${pct(lo)}%"></div>` : ''}<div class="slider__knob" style="left:${pct(hi)}%"></div></div>
      <div class="slider__ends t-subtext-regular"><span><span class="t-subtext-title">${min}</span>${esc(m.minL || '')}</span><span><span class="t-subtext-title">${max}</span>${esc(m.maxL || '')}</span></div>`;
  }
  return '';
}
function wireInput(root, m, st, rerender) {
  root.querySelectorAll('[data-opt]').forEach(b => b.onclick = () => {
    const k = b.dataset.opt, multi = m.type === 'list' && m.multi; st.sel = st.sel || []; st.err = '';
    st.sel = multi ? (st.sel.includes(k) ? st.sel.filter(x => x !== k) : [...st.sel, k]) : [k]; rerender();
  });
  const sl = root.querySelector('[data-slider]');
  if (sl) sl.onpointerdown = e => {
    e.preventDefault(); const min = +m.min, max = +m.max, step = +m.step || 1, dv = sliderDefaults(m);
    let which = null;
    const move = ev => { const r = sl.getBoundingClientRect(); const raw = min + Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width)) * (max - min); const v = Math.min(max, Math.max(min, Math.round(raw / step) * step));
      const lo = st.lo ?? dv.lo, hi = st.hi ?? dv.hi;
      if (!which) which = m.range && Math.abs(v - lo) < Math.abs(v - hi) ? 'lo' : 'hi';
      if (which === 'lo') st.lo = Math.min(v, hi); else st.hi = Math.max(v, m.range ? lo : min);
      rerender(); };
    move(e); const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
  };
  const num = root.querySelector('[data-in-num]'); if (num) num.oninput = () => { st.value = num.value.replace(/[^0-9.]/g, ''); if (num.value !== st.value) num.value = st.value; if (st.err) { st.err = ''; num.closest('.app-field').classList.remove('app-field--error'); num.closest('.grid2').nextElementSibling?.classList.contains('field__err') && num.closest('.grid2').nextElementSibling.remove(); } };
  const unit = root.querySelector('[data-in-unit]'); if (unit) unit.onchange = () => { st.unit = unit.value; };
  const tx = root.querySelector('[data-in-text]'); if (tx) tx.oninput = () => { st.text = tx.value; };
}

/* =============================== ADD ENTRY sheet =============================== */
let SH = null;
function openSheet(mId) {
  const a = ANIMALS.find(x => x.id === S.a.sel), m = M(mId);
  SH = { a, m, st: {}, date: isoDate(TODAY), time: isoTime(TODAY), note: '' };
  drawSheet(); $('scrim').classList.add('on');
  setTimeout(() => $('sheet').querySelector('[data-in-num], [data-in-text]')?.focus({ preventScroll: true }), 220);
}
function drawSheet() {
  const { a, m } = SH;
  $('sheet').innerHTML = `
    <div class="sheet__hd"><div class="ttl"><span class="t-medium-medium navy">Add ${esc(m.name)}</span><span class="t-subtext-regular">${esc(m.cat)} · ${TYPE(m.type).label}</span></div><button class="close" data-sh="close" aria-label="Close">${ic('close', 'var(--on-surface-variant)')}</button></div>
    <div class="sheet__bd">
      <div class="animal-sum" style="align-items:center"><div class="app-profile" style="width:64px;height:64px"><img class="photo" src="${a.img}" alt="">${badge(a)}</div><div class="info"><span class="t-body-title navy">${esc(a.tag)}</span><span class="t-body-medium">${esc(a.species)}</span><span class="t-subtext-regular muted">${esc(a.encl)}</span></div></div>
      ${m.desc ? `<p class="t-body-regular" style="margin:0">${esc(m.desc)}</p>` : ''}
      ${m.refs?.length ? `<div class="field"><div class="block__hd"><span class="t-body-title">References</span><button class="link t-body-medium" data-act="viewer" data-v="${m.id}" data-i="0">View All ${ic('dropdown', 'var(--on-surface)', 'app-icon--16', 'chev-r')}</button></div>${refGrid(m, 8, 'refs--strip')}</div>` : ''}
      <div class="grid2">
        <label class="app-field app-field--white"><span class="app-field__label t-subtext-regular">Date</span><input class="t-minor-regular" type="date" value="${SH.date}" max="${isoDate(TODAY)}" data-sh="date">${ic('calendar')}</label>
        <label class="app-field app-field--white"><span class="app-field__label t-subtext-regular">Time</span><input class="t-minor-regular" type="time" value="${SH.time}" data-sh="time">${ic('time')}</label>
      </div>
      <div data-sheet-input class="field" style="gap:var(--sp-12)">${renderInput(m, SH.st)}</div>
      <label class="notes"><textarea class="t-minor-regular" rows="2" placeholder="Add Notes" data-sh="note">${esc(SH.note)}</textarea></label>
    </div>
    <div class="actionbar"><button class="bigbtn bigbtn--ghost t-minor-medium" data-sh="close">Cancel</button><button class="bigbtn bigbtn--primary t-minor-medium" data-sh="save">Add Entry</button></div>`;
  wireSheetInput();
  $('sheet').querySelectorAll('[data-sh="date"],[data-sh="time"],[data-sh="note"]').forEach(el => el.oninput = () => { SH[el.dataset.sh] = el.value; });
  $('sheet').querySelectorAll('input[type=date],input[type=time]').forEach(el => el.closest('.app-field').addEventListener('click', () => { try { el.showPicker(); } catch (e) { el.focus(); } }));
}
function wireSheetInput() { const box = $('sheet').querySelector('[data-sheet-input]'); const go = () => { box.innerHTML = renderInput(SH.m, SH.st); wireInput(box, SH.m, SH.st, go); }; wireInput(box, SH.m, SH.st, go); }
function closeSheet() { $('scrim').classList.remove('on'); SH = null; }
function saveEntry() {
  const { a, m, st } = SH; let v, unit = m.unit;
  if (m.type === 'number') { if (st.value === undefined || st.value === '' || isNaN(+st.value)) { st.err = `Enter the ${(m.measure || 'value').toLowerCase()}.`; wireSheetRedraw(); return; } v = +st.value; unit = st.unit || m.unit; }
  if (m.type === 'text') { if (!st.text?.trim()) { $('sheet').querySelector('[data-in-text]').closest('.app-field').classList.add('app-field--error'); toast('Type an observation first'); return; } v = st.text.trim(); }
  if (m.type === 'list') { if (!st.sel?.length) { st.err = 'Choose at least one option.'; wireSheetRedraw(); return; } v = st.sel.slice(); }
  if (m.type === 'scale') { if (!st.sel?.length) { st.err = 'Choose one option.'; wireSheetRedraw(); return; } v = +st.sel[0]; }
  if (m.type === 'slider') { const dv = sliderDefaults(m); v = m.range ? [st.lo ?? dv.lo, st.hi ?? dv.hi] : (st.hi ?? dv.hi); }
  const [y, mo, d] = SH.date.split('-').map(Number), [h, mi] = SH.time.split(':').map(Number);
  const t = new Date(y, mo - 1, d, h, mi);
  if (t > TODAY) { toast('Entries can’t be in the future'); return; }
  const r = { id: uid(), t, v, unit, by: 'Dr. Mehta', note: SH.note.trim() };
  const list = recs(a.id, m.id); list.push(r); list.sort((p, q) => q.t - p.t);
  save(); closeSheet();
  S.a.open = m.id; S.a.newId = r.id; if (TODAY - t > RANGES[S.a.range] * 86400000) S.a.range = Object.keys(RANGES).find(k => TODAY - t <= RANGES[k] * 86400000) || '6M';
  render();
  toast(`${m.name} added for ${a.tag}`, () => { const i = list.indexOf(r); if (i > -1) list.splice(i, 1); save(); render(); toast('Entry removed'); });
}
function wireSheetRedraw() { const box = $('sheet').querySelector('[data-sheet-input]'); box.innerHTML = renderInput(SH.m, SH.st); wireSheetInput(); box.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
$('scrim').addEventListener('click', e => {
  if (e.target === $('scrim')) return closeSheet();
  const b = e.target.closest('[data-sh]'); if (!b) return;
  if (b.dataset.sh === 'close') closeSheet(); if (b.dataset.sh === 'save') saveEntry();
});

/* =============================== popovers, viewer, toast =============================== */
function popover(anchor, html, onPick) {
  const pop = $('pop'), app = $('app').getBoundingClientRect(), r = anchor.getBoundingClientRect();
  pop.innerHTML = html; pop.hidden = false; $('popScrim').hidden = false;
  const w = pop.offsetWidth; let left = r.right - app.left - w; if (left < 12) left = r.left - app.left;
  pop.style.left = `${Math.max(12, Math.min(left, app.width - w - 12))}px`; pop.style.top = `${r.bottom - app.top + 8}px`;
  pop.onclick = e => { const it = e.target.closest('[data-pick]'); if (!it) return; closePop(); onPick(it.dataset.pick); };
}
function closePop() { $('pop').hidden = true; $('popScrim').hidden = true; }
$('popScrim').addEventListener('click', closePop);
let VW = null;
function openViewer(mId, i) { VW = { m: M(mId), i }; drawViewer(); $('viewer').hidden = false; }
function drawViewer() {
  const { m, i } = VW, r = m.refs[i];
  $('viewer').innerHTML = `<div class="viewer__hd"><div class="ttl"><span class="t-minor-title">${esc(m.name)} · References</span><span class="t-subtext-regular" style="color:var(--on-primary-a80)">${i + 1} of ${m.refs.length} · ${esc(r.name)}</span></div><button data-vw="close" aria-label="Close">${ic('close', 'var(--on-primary)')}</button></div>
    <div class="viewer__img">${r.kind === 'img' ? `<img src="${r.src}" alt="${esc(r.name)}">` : `<div class="doc">${ic('pdf', 'var(--tertiary)', 'app-icon--28')}<span class="t-minor-title">${esc(r.name)}</span><span class="t-body-regular muted">PDF preview opens in the document viewer</span></div>`}</div>
    <div class="viewer__thumbs">${m.refs.map((x, j) => `<button class="${j === i ? 'on' : ''}" data-vw="${j}" aria-label="${esc(x.name)}">${x.kind === 'img' ? `<img src="${x.src}" alt="">` : `<span class="refs"><span class="doc" style="height:60px">${ic('pdf', 'var(--tertiary)')}</span></span>`}</button>`).join('')}</div>`;
}
$('viewer').addEventListener('click', e => { const b = e.target.closest('[data-vw]'); if (!b) return; if (b.dataset.vw === 'close') { $('viewer').hidden = true; return; } VW.i = +b.dataset.vw; drawViewer(); });
let toastT;
function toast(msg, undo) { $('toastMsg').textContent = msg; $('toastUndo').hidden = !undo; $('toastUndo').onclick = () => { $('toast').classList.remove('on'); undo(); }; $('toast').classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => $('toast').classList.remove('on'), undo ? 5000 : 2400); }

/* =============================== events =============================== */
$('app').addEventListener('input', e => {
  const k = e.target.dataset.in; if (!k) return;
  const pos = e.target.selectionStart;
  if (k === 'aq') S.a.q = e.target.value; if (k === 'mq') S.m.q = e.target.value;
  render(); const el = $('view').querySelector(`[data-in="${k}"]`); el.focus(); el.setSelectionRange(pos, pos);
});
$('app').addEventListener('keydown', e => { if (e.key === 'Escape') { if (!$('viewer').hidden) $('viewer').hidden = true; else if (!$('pop').hidden) closePop(); else if (SH) closeSheet(); } if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[role=button][data-act]')) { e.preventDefault(); e.target.click(); } });
$('view').addEventListener('click', e => {
  const t = e.target.closest('[data-act]'); if (!t) return;
  const v = t.dataset.v, act = t.dataset.act;
  switch (act) {
    case 'aSel': S.a.sel = v; S.a.open = null; S.a.tip = null; render(); break;
    case 'aCat': S.a.cat = v; render(); break;
    case 'aOpen': S.a.open = v; S.a.tip = null; render(); break;
    case 'aBack': S.a.open = null; render(); break;
    case 'add': e.stopPropagation(); openSheet(v); break;
    case 'range': S.a.range = v; S.a.tip = null; render(); break;
    case 'chart': S.a.chart = v; render(); break;
    case 'tip': S.a.tip = S.a.tip === v ? null : v; render(); break;
    case 'note': t.closest('.rec').classList.toggle('open'); break;
    case 'viewer': e.stopPropagation(); openViewer(v, +t.dataset.i); break;
    case 'rangeMenu': popover(t, `<span class="pop__title t-body-title">Show readings from</span>${Object.keys(RANGES).map(k => `<button class="pop__item t-body-regular" data-pick="${k}">${ic(k === S.a.range ? 'radio-selected' : 'radio-unselect', k === S.a.range ? 'var(--primary-main)' : 'var(--outline)', 'app-icon--20')}${RANGE_LABEL[k]}</button>`).join('')}`, k => { S.a.range = k; render(); }); break;
    case 'mSel': S.m.sel = v; render(); break;
    case 'mFilter': S.m.filter = v; render(); break;
    case 'catMenu': popover(t, ['All Categories', ...CATEGORIES].map(c => `<button class="pop__item t-body-regular" data-pick="${c}">${ic(c === S.m.cat ? 'radio-selected' : 'radio-unselect', c === S.m.cat ? 'var(--primary-main)' : 'var(--outline)', 'app-icon--20')}${c}</button>`).join(''), c => { S.m.cat = c; render(); }); break;
    case 'mastersMenu': popover(t, `<button class="pop__item t-body-regular" data-pick="reset">${ic('reset', 'var(--on-surface-variant)', 'app-icon--20')}Reset demo data</button>`, () => { try { localStorage.removeItem(KEY); } catch (err) {} load(); S.a.open = null; render(); toast('Demo data reset'); }); break;
    case 'typeMenu': { const m = M(v); popover(t, `<button class="pop__item t-body-regular" data-pick="edit">${ic('pencil', 'var(--on-surface-variant)', 'app-icon--20')}Edit</button><button class="pop__item t-body-regular" data-pick="dup">${ic('add-with-circle', 'var(--on-surface-variant)', 'app-icon--20')}Duplicate</button><button class="pop__item t-body-regular" data-pick="toggle">${ic(m.active ? 'toggle-off' : 'toggle-on', 'var(--on-surface-variant)', 'app-icon--20')}${m.active ? 'Mark as Inactive' : 'Mark as Active'}</button>${m.templates ? '' : `<button class="pop__item pop__item--danger t-body-regular" data-pick="del">${ic('delete', 'var(--error)', 'app-icon--20')}Delete</button>`}`, k => {
        if (k === 'edit') openForm(m);
        if (k === 'dup') { const c = JSON.parse(JSON.stringify(m)); c.id = 'm' + uid(); c.name = `${m.name} (copy)`; c.templates = 0; c.active = false; DB.masters.push(c); S.m.sel = c.id; save(); render(); toast(`${c.name} created as inactive`); }
        if (k === 'toggle') { m.active = !m.active; save(); render(); toast(`${m.name} is now ${m.active ? 'active' : 'inactive'}`); }
        if (k === 'del') { DB.masters.splice(DB.masters.indexOf(m), 1); save(); render(); toast(`${m.name} deleted`); }
      }); break; }
    case 'edit': openForm(M(v)); break;
    case 'newType': openForm(null); break;
    case 'fCancel': S.f = null; S.view = 'masters'; render(); break;
    case 'fSubmit': submitForm(); break;
    case 'fType': S.f.d.type = v; S.f.pv = {}; if (v === 'slider' && S.f.d.measure === 'Weight' && !S.f.id) { S.f.d.min = 0; S.f.d.max = 100; } if (S.f.tried) validate(); rerenderForm(); break;
    case 'fMulti': S.f.d.multi = v === '1'; S.f.pv = {}; rerenderForm(); break;
    case 'fAdd': addItem(); break;
    case 'fDel': S.f.d.items.splice(+v, 1); S.f.pv = {}; if (S.f.tried) validate(); rerenderForm(); break;
    case 'fSAdd': addScale(); break;
    case 'fSDel': S.f.d.scale.splice(+v, 1); S.f.pv = {}; if (S.f.tried) validate(); rerenderForm(); break;
    case 'fStep': S.f.d.step = Math.max(1, (+S.f.d.step || 0) + +v); S.f.pv = {}; if (S.f.tried) validate(); rerenderForm(); break;
    case 'fRange': S.f.d.range = !S.f.d.range; S.f.pv = {}; rerenderForm(); break;
    case 'fActive': S.f.d.active = !S.f.d.active; rerenderForm(); break;
    case 'fRefDel': S.f.d.refs.splice(+v, 1); rerenderForm(); break;
  }
});
$('sheet').addEventListener('click', e => { const t = e.target.closest('[data-act="viewer"]'); if (t) openViewer(t.dataset.v, +t.dataset.i); });

/* deep links for review: #animals · #masters · #new · #sheet:<assessment> · #detail:<assessment> */
(function start() {
  const [screen, arg] = decodeURIComponent(location.hash.slice(1)).split(':');
  if (screen === 'masters') { S.tab = S.view = 'masters'; }
  if (screen === 'new') { S.tab = 'masters'; openForm(null); if (arg && TYPE(arg)) { S.f.d.type = arg; S.f.d.name = 'Activeness'; rerenderForm(); } return; }
  if (screen === 'detail' && MN(arg)) S.a.open = MN(arg).id;
  render();
  if (screen === 'sheet' && MN(arg)) openSheet(MN(arg).id);
})();
