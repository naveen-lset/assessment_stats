/* ===========================================================================
   ASSESSMENT MASTER  ·  app2-master.js
   ---------------------------------------------------------------------------
   The catalogue-admin side of INDEX 2: create / edit an assessment TYPE and
   assign its GRAPH. Mirrors the real app's "Animal assessment" → "New
   Assessment Type" flow (reference photos in Assessment_Master/).

   Depends on globals from app2-analytics.js (load order in index2.html):
     CATALOGUE · buildTypeIndex · catType · CAT_COLOR · CAT_DOMAINS
     GRAPHS · compatibleViz · defaultViz · vizLabel · rtLabel · qLabel
     v2Area/v2Bars/v2Gauge/v2Donut/… (thumbnail renderers)
     openSheet2 / closeSheet2 · render2 / go2 / back2 · I2 · ATC_PLUS

   Built ONLY from COMPONENTS.md parts — same classes as the Add Entry sheet
   (.ae-*), section cards (.card-pad / field), stat tiles (.aa-st), category
   chips (.tchip), page search (.hist-search). No new framework, no INDEX 1.
   =========================================================================== */

/* ---- catalogue helpers ---------------------------------------------------- */
/* fixed 5 domains, in catalogue order, with their brand colour */
function mstCats() { return CATALOGUE.map(c => ({ cat: c.cat, color: c.color, count: c.types.length })); }
function mstTotalTypes() { return CATALOGUE.reduce((s, c) => s + c.types.length, 0); }
/* the 4 response types, in the order the real app's picker shows them */
const MST_RTS = ['numeric', 'scale', 'list', 'text'];
/* a short, human "what the graph shows" line per rt (from SRS §2.7) */
const MST_RT_HINT = {
  numeric: 'A measured number with a unit — trend over time.',
  scale: 'A bounded rating (1…max) — bars against the ceiling.',
  list: 'One option from a fixed set — distribution of choices.',
  text: 'Free-form notes — a searchable notes timeline, no chart.',
};

/* ---- sample series for the graph-picker thumbnails ----------------------- */
/* Deterministic little series so each thumbnail shows the REAL chart the type
   will use. Not tied to any one metric — purely illustrative. */
const MST_NUM_SAMPLE = [21.4, 21.9, 21.6, 22.3, 22.0, 22.6, 22.4, 22.9];
const MST_SCALE_SAMPLE = { max: 5, vals: [3, 4, 3, 4, 4, 5, 4, 5] };
function mstListSample() {
  const it = { rt: 'list', options: ['Poor', 'Reduced', 'Good', 'Excellent'] };
  const vals = ['Reduced', 'Good', 'Good', 'Reduced', 'Good', 'Excellent', 'Good', 'Excellent'];
  return { it, vals };
}
/* render a mini thumbnail for one graph `viz` on sample data, in `color` */
function mstThumb(rt, viz, color) {
  if (rt === 'numeric') {
    const s = MST_NUM_SAMPLE;
    return viz === 'line' ? v2Line(s, color) : viz === 'col' ? v2Col(s, color) : v2Area(s, color, 'mt' + viz);
  }
  if (rt === 'scale') {
    const s = MST_SCALE_SAMPLE.vals, mx = MST_SCALE_SAMPLE.max;
    return viz === 'gauge' ? v2Gauge(s[s.length - 1], mx, color)
      : viz === 'lolli' ? v2Lolli(s, color)
      : viz === 'dots' ? v2Dots(s, color)
      : v2Bars(s, color);
  }
  if (rt === 'list') {
    const { it, vals } = mstListSample();
    if (viz === 'donut') return v2Donut(it, vals, color);
    // distribution bars (same .v2-dist markup v2Card uses)
    const dist = {}; it.options.forEach(o => dist[o] = 0); vals.forEach(v => dist[v]++);
    const total = vals.length, cur = vals[vals.length - 1];
    const rows = it.options.map(o => ({ o, n: dist[o] })).sort((a, b) => b.n - a.n).slice(0, 3);
    return `<div class="v2-dist">${rows.map(r => `<div class="v2-dist-bar"><i style="width:${Math.round(r.n / total * 100)}%;background:${r.o === cur ? color : '#C9D2D6'}"></i></div>`).join('')}</div>`;
  }
  return '';
}

/* ===========================================================================
   SCREEN — Assessment Master landing  (Types tab)
   Header stat card (Types / Templates) → category rows with counts → + FAB.
   =========================================================================== */
/* visual-only profile tabs (Figma node 18:148) — Assessments is the active tab;
   the others are inert (this is the master landing, not an animal profile). */
const MST_TABS = [
  { key: 'medical', label: 'Medical' },
  { key: 'assessments', label: 'Assessments' },
  { key: 'enclosures', label: 'Enclosures' },
  { key: 'enclosures2', label: 'Enclosures' },
  { key: 'enclosures3', label: 'Enclosures' },
  { key: 'enclosures4', label: 'Enclosures' },
];
function mstTabNoop() { /* visual only — tabs are not wired on the master landing */ }

SCREENS2.mstLanding = () => {
  const cats = mstCats();
  const rows = cats.map(c => `
    <button class="mst-catrow" onclick="go2('mstCategory',{cat:'${c.cat}'})">
      <span class="mst-cat-dot" style="background:${c.color}"></span>
      <span class="mst-cat-name">${c.cat}</span>
      <span class="mst-cat-n">${c.count}</span>
      <span class="mst-cat-chev">${I2.chevR}</span>
    </button>`).join('');
  const search = `<div class="hist-search"><span class="hs-box">${I2.search}<input class="hs-in" type="text" placeholder="Search categories" oninput="searchFilter(this,'.mst-catrow')"></span></div>`;
  return `<div class="screen active"><div class="scroll prof-scroll assess-landing">
    ${heroHeader(ANIMAL)}
    ${tabsBar(MST_TABS, 'assessments', 'mstTabNoop')}
    <div class="body" style="padding-top:12px">
      <div class="mst-stats">
        <div class="aa-st"><div class="ast-l">Types</div><div class="ast-v" style="color:#006D35">${mstTotalTypes()}</div></div>
        <div class="aa-st"><div class="ast-l">Domains</div><div class="ast-v">5</div></div>
      </div>
      <div data-searchbox>
        ${search}
        <div class="mst-catlist">${rows}</div>
        <div class="ls-empty">No matching categories</div>
      </div>
    </div>
    <button class="mst-fab" onclick="mstOpenNew()" aria-label="New Assessment Type">${ATC_PLUS}</button>
    <div style="height:24px"></div>
  </div></div>`;
};

/* ===========================================================================
   SCREEN — one category → its assessment types (each row → type detail)
   =========================================================================== */
SCREENS2.mstCategory = (p = {}) => {
  const c = CATALOGUE.find(x => x.cat === p.cat) || CATALOGUE[0];
  const rows = c.types.map(ty => {
    const it = catType(ty.q);
    const graph = it.rt === 'text' ? 'Notes timeline' : vizLabel(it.viz);
    return `<button class="mst-typerow" onclick="go2('mstTypeDetail',{q:'${ty.q}'})">
      <span class="mst-type-graph" style="color:${it.color}">${mstThumb(it.rt, it.viz, it.color)}</span>
      <span class="mst-type-body">
        <span class="mst-type-name">${qLabel(ty.q)}</span>
        <span class="mst-type-meta">${rtLabel(it.rt)} · ${graph}</span>
      </span>
      <span class="mst-cat-chev">${I2.chevR}</span>
    </button>`;
  }).join('');
  const search = `<div class="hist-search"><span class="hs-box">${I2.search}<input class="hs-in" type="text" placeholder="Search types" oninput="searchFilter(this,'.mst-typerow')"></span></div>`;
  return `<div class="screen active"><div class="scroll prof-scroll assess-landing">
    ${pageHeader(p.cat, c.types.length + ' Assessment Types')}
    <div class="body" style="padding-top:12px">
      <div data-searchbox>
        ${search}
        <div class="mst-typelist">${rows}</div>
        <div class="ls-empty">No matching types</div>
      </div>
    </div>
    <button class="mst-fab" onclick="mstOpenNew('${p.cat}')" aria-label="New Assessment Type">${ATC_PLUS}</button>
    <div style="height:24px"></div>
  </div></div>`;
};

/* ===========================================================================
   SCREEN — Assessment Type detail  (read-only, mirrors the real app screen)
   Active chip · name · Category · Description · Response Type · GRAPH row.
   =========================================================================== */
SCREENS2.mstTypeDetail = (p = {}) => {
  const it = catType(p.q); if (!it) return SCREENS2.mstLanding();
  const desc = it.desc || (qLabel(p.q) + ' assessment.');
  const graphRow = it.rt === 'text'
    ? `<div class="mst-graph-view">
         <div class="mst-gv-thumb muted">${I2.spark}</div>
         <div class="mst-gv-txt"><div class="mst-gv-name">Notes timeline</div><div class="mst-gv-sub">No chart — text responses show as a searchable note timeline.</div></div>
       </div>`
    : `<div class="mst-graph-view">
         <div class="mst-gv-thumb" style="color:${it.color}">${mstThumb(it.rt, it.viz, it.color)}</div>
         <div class="mst-gv-txt"><div class="mst-gv-name">${vizLabel(it.viz)}</div><div class="mst-gv-sub">${MST_RT_HINT[it.rt]}</div></div>
       </div>`;
  return `<div class="screen active"><div class="scroll prof-scroll assess-landing">
    ${pageHeader('Assessment Type')}
    <div class="body" style="padding-top:8px">
      <div class="mst-detail-top">
        <span class="mst-active-chip">${it.active === false ? 'Inactive' : 'Active'}</span>
        <div class="mst-detail-name">${qLabel(p.q)}</div>
      </div>
      <div class="card card-pad mst-detail-card">
        ${field('Category', `<span class="mst-inline"><span class="mst-cat-dot sm" style="background:${it.catColor}"></span>${it.cat}</span>`)}
        ${field('Description', desc)}
        ${field('Response Type', rtLabel(it.rt))}
      </div>
      <div class="v2-catlabel">Graph</div>
      <div class="card card-pad">${graphRow}</div>
      <button class="mst-edit-btn" onclick="mstOpenEdit('${p.q}')">${I2.pencil}<span>Edit Assessment Type</span></button>
    </div>
    <div style="height:24px"></div>
  </div></div>`;
};

/* ===========================================================================
   New / Edit Assessment Type  — bottom sheet form (Add-Entry .ae-* pattern)
   Draft state lives in MST_DRAFT; the form re-renders in place on change so
   the graph picker reacts to Response Type without losing the sheet.
   =========================================================================== */
let MST_DRAFT = null;

function mstOpenNew(cat) {
  MST_DRAFT = { mode: 'new', q: '', origQ: null, cat: cat || CATALOGUE[0].cat, desc: '', active: true, rt: 'numeric', viz: defaultViz('numeric') };
  openSheet2(mstFormHTML());
}
function mstOpenEdit(q) {
  const it = catType(q); if (!it) return;
  MST_DRAFT = { mode: 'edit', q: q, origQ: q, cat: it.cat, desc: it.desc || '', active: it.active !== false, rt: it.rt, viz: it.rt === 'text' ? null : it.viz };
  openSheet2(mstFormHTML());
}

/* rebuild only the sheet body in place (keeps sheet open + scroll) */
function mstRerender() {
  const sheet = document.querySelector('.sheet2');
  if (sheet) sheet.innerHTML = mstFormHTML();
}

/* pull the live text inputs into the draft before a reactive re-render so
   typing isn't lost when the Response Type / graph changes */
function mstSyncInputs() {
  const root = document.querySelector('.sheet2'); if (!root || !MST_DRAFT) return;
  const nm = root.querySelector('#mstName'); if (nm) MST_DRAFT.q = nm.value;
  const ds = root.querySelector('#mstDesc'); if (ds) MST_DRAFT.desc = ds.value;
}

function mstSetCat(cat) { mstSyncInputs(); MST_DRAFT.cat = cat; mstRerender(); }
function mstSetActive(on) { mstSyncInputs(); MST_DRAFT.active = on; mstRerender(); }
/* changing Response Type re-defaults the graph + clears an incompatible override
   (SRS §2.7 integrity rule 2) */
function mstSetRt(rt) {
  mstSyncInputs();
  MST_DRAFT.rt = rt;
  MST_DRAFT.viz = rt === 'text' ? null : defaultViz(rt);
  mstRerender();
}
function mstSetViz(viz) { mstSyncInputs(); MST_DRAFT.viz = viz; mstRerender(); }

function mstFormHTML() {
  const d = MST_DRAFT;
  const title = d.mode === 'edit' ? 'Edit Assessment Type' : 'New Assessment Type';

  // Category chips (5 fixed domains, brand colour dot)
  const catChips = `<div class="tchip-row v2-doms mst-catchips">${CATALOGUE.map(c =>
    `<button class="tchip ${c.cat === d.cat ? 'active' : ''}" onclick="mstSetCat('${c.cat}')">
       <span class="mst-cat-dot xs" style="background:${c.color}"></span>${c.cat}</button>`).join('')}</div>`;

  // Response Type option cards (.ae-opt selected style)
  const rtOpts = `<div class="ae-opts">${MST_RTS.map(rt =>
    `<button class="ae-opt ${rt === d.rt ? 'on' : ''}" onclick="mstSetRt('${rt}')">
       <span class="ae-olab">${rtLabel(rt)}</span><span class="ae-check">${AE_CHECK}</span></button>`).join('')}</div>`;

  // Graph picker — compatible set for the chosen rt, canonical default badged.
  // Hidden for text (notes timeline note shown instead).
  let graphBlock;
  if (d.rt === 'text') {
    graphBlock = `<div class="mst-graph-none">${I2.spark}<div><b>Notes timeline</b><span>Text responses have no chart — they show as a searchable, dated note timeline.</span></div></div>`;
  } else {
    const color = (catType(d.origQ) && catType(d.origQ).color) || CAT_COLOR[d.cat] || '#006D35';
    const def = defaultViz(d.rt);
    const opts = compatibleViz(d.rt).map(g =>
      `<button class="mst-gopt ${g.viz === d.viz ? 'on' : ''}" onclick="mstSetViz('${g.viz}')">
         <span class="mst-gopt-thumb" style="color:${color}">${mstThumb(d.rt, g.viz, color)}</span>
         <span class="mst-gopt-lab">${g.label}${g.viz === def ? '<span class="mst-gopt-def">Default</span>' : ''}</span>
         <span class="mst-gopt-check">${AE_CHECK}</span>
       </button>`).join('');
    graphBlock = `<div class="mst-gopts">${opts}</div>
      <div class="mst-graph-hint">${MST_RT_HINT[d.rt]}</div>`;
  }

  return `<div class="ae-head">
      <div class="ae-htext"><div class="ae-title">${title}</div><div class="ae-cat">Assessment Master</div></div>
      <button class="ae-x" onclick="mstCloseForm()">✕</button>
    </div>
    <div class="ae-body">
      <label class="mst-flabel">Category</label>
      ${catChips}

      <label class="mst-flabel">Assessment Name<span class="mst-req">*</span></label>
      <input id="mstName" class="ae-input mst-input" type="text" placeholder="e.g. Body Condition Score" value="${(d.q || '').replace(/"/g, '&quot;')}" oninput="this.classList.remove('ae-err')">

      <label class="mst-flabel">Description</label>
      <textarea id="mstDesc" class="ae-textarea" rows="2" placeholder="What this assessment captures">${d.desc || ''}</textarea>

      <button class="mst-active ${d.active ? 'on' : ''}" onclick="mstSetActive(${d.active ? 'false' : 'true'})">
        <span class="mst-active-box">${d.active ? AE_CHECK : ''}</span>
        <span>Mark as Active (available for selection)</span>
      </button>

      <label class="mst-flabel">Response Type<span class="mst-req">*</span></label>
      ${rtOpts}

      <label class="mst-flabel">Graph</label>
      ${graphBlock}
    </div>
    <div class="ae-foot">
      <button class="ae-cancel" onclick="mstCloseForm()">Cancel</button>
      <button class="ae-add" onclick="mstSubmit()">${d.mode === 'edit' ? 'Save' : 'Create Type'}</button>
    </div>`;
}

function mstCloseForm() { MST_DRAFT = null; closeSheet2(); }

/* commit the draft into CATALOGUE, rebuild TYPE_INDEX, land on the type detail */
function mstSubmit() {
  const d = MST_DRAFT; if (!d) return;
  mstSyncInputs();
  const root = document.querySelector('.sheet2');
  const name = (d.q || '').trim();
  if (!name) { const nm = root && root.querySelector('#mstName'); if (nm) { nm.classList.add('ae-err'); nm.focus(); } return; }
  // no duplicate names (except the type being edited)
  if (catType(name) && name !== d.origQ) { const nm = root && root.querySelector('#mstName'); if (nm) { nm.classList.add('ae-err'); nm.focus(); } return; }

  // build the catalogue entry for this response type (reuses n/s/l/t factories)
  let entry;
  if (d.rt === 'numeric') entry = { q: name, ...n('kg', 10, 1, d.viz) };
  else if (d.rt === 'scale') entry = { q: name, ...s(5, d.viz) };
  else if (d.rt === 'list') entry = { q: name, ...l(['Poor', 'Reduced', 'Good', 'Excellent'], d.viz) };
  else entry = { q: name, ...t() };
  entry.desc = (d.desc || '').trim();
  entry.active = d.active;

  const cat = CATALOGUE.find(c => c.cat === d.cat) || CATALOGUE[0];
  if (d.mode === 'edit' && d.origQ) {
    // remove the original (it may have moved category) then re-add
    CATALOGUE.forEach(c => { const i = c.types.findIndex(x => x.q === d.origQ); if (i >= 0) c.types.splice(i, 1); });
  }
  cat.types.push(entry);

  buildTypeIndex();          // re-resolve every type (new/edited included)
  MST_DRAFT = null;
  closeSheet2();
  // land on the type detail so the assigned graph is visible immediately
  NAV.stack = ['mstLanding', 'mstCategory', 'mstTypeDetail'];
  NAV.params.mstCategory = { cat: d.cat };
  NAV.params.mstTypeDetail = { q: name };
  render2();
}
