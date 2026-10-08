/* Assessments · iPad v4 — includes the Animal Details page: tap an animal → the page pushes in with every assessment of that animal,
   filtered by chips (All · Due · one chip per assessment). A chip for one assessment opens its graph + records + Add Entry.
   Everything below is v4 — Species › Assessments (the v5 mockup, made to work).
   Structure from the reference species page (species-management ipad-3): dark hero · sticky icon tabs · ☰ All Tabs drawer ·
   sub-tabs (Population · a tab per category · Alerts) · type chips · KPI strip · charts · animal table.
   Our Figma flows on top: tap an animal → its assessment panel (history, records) → Add Entry sheet (number pad) ·
   ⚙ → Assessment settings (Masters: types, schedule, new type).
   Tablet behaviour from touch.js: swipe a row (Add · History), long-press menus, finger-scrub graphs, swipe records (Edit · Delete),
   pull to refresh, drag the sheet, sliding segmented controls, hardware keyboard (hold ⌘). Previous animals-list v4: ../v4-interactions/ */
'use strict';
(() => {
const { $, esc, ic, plural, ANIMALS, A, M, S, recs, animalMasters, doneThisWeek, daysSince, removeRecord, fmt, numOf, isNumeric, TYPE,
  fShort, fDate, ago, TODAY, thumb, spark, historyHTML, entrySheet, closeSheet, panel, closePanel, popover, popItems, toast, render, CATEGORIES, H, save } = C;
const DAY = 86400000;
const TABS = [['user', 'Profile'], ['file-doc', 'Ledger'], ['paw', 'Population'], ['location-icon', 'Enclosure Demographics'], ['dashboard', 'Housing'], ['cycle', 'Circle of Life'], ['egg', 'Eggs'], ['approved', 'Assessments'], ['administer', 'Medical'], ['site-incharge', 'Hospital'], ['lab-test', 'Lab Module'], ['mortality-12', 'Mortality'], ['scan', 'Necropsy']];
const SP = { det: null, spTop: null, tab: 'Assessments', sub: 'Physical Health', type: {}, q: '', site: 'All sites', sort: { key: 'change', dir: -1 }, kpi: null, alert: 'overdue', pn: null, newId: null, flash: null, synced: 0, drawer: false, tabq: '' };

/* ------------------------------------------------------------------ data helpers */
const typesIn = cat => C.DB.masters.filter(m => m.active && m.cat === cat && ANIMALS.some(a => animalMasters(a).includes(m)));
const curType = () => { const list = typesIn(SP.sub); let m = list.find(x => x.id === SP.type[SP.sub]); if (!m) { m = list[0]; if (m) SP.type[SP.sub] = m.id; } return m; };
const withType = m => ANIMALS.filter(a => animalMasters(a).includes(m));
function change30(a, m) {   // % change of the latest reading against the reading ~30 days before it
  const l = recs(a.id, m.id); if (l.length < 2 || !isNumeric(m)) return null;
  const last = l[0], base = l.find(r => last.t - r.t >= 30 * DAY) || l[l.length - 1]; const b = numOf(m, base); if (!b) return null;
  return (numOf(m, last) - b) / b * 100;
}
const trendClass = p => p == null ? 'none' : p > 2 ? 'gaining' : p < -2 ? 'losing' : 'stable';
const pctTxt = p => p == null ? '—' : `${p > 0 ? '+' : p < 0 ? '−' : ''}${Math.abs(p).toFixed(1)}%`;
const siteOk = a => SP.site === 'All sites' || a.site === SP.site;
const qOk = a => !SP.q || `${a.tag} ${a.aid} ${a.site} ${a.encl}`.toLowerCase().includes(SP.q.toLowerCase());
const dueTypes = a => animalMasters(a).filter(m => !doneThisWeek(a, m));

/* ------------------------------------------------------------------ alerts (rules across every type) */
function alerts() {
  const R = [];
  const add = (key, group, label, color, items) => R.push({ key, group, label, color, items });
  const all = (fn) => ANIMALS.flatMap(a => animalMasters(a).map(m => fn(a, m)).filter(Boolean));
  add('overdue', 'SCHEDULE', 'Overdue (past schedule + grace)', 'var(--moderate-secondary)', all((a, m) => { const d = daysSince(a, m); if (d <= (m.every || 7) + (m.grace || 7)) return null; const l = recs(a.id, m.id)[0]; return { a, m, why: l ? `${m.name} · last ${fShort(l.t)} · ${d} days` : `${m.name} · never recorded` }; }));
  const W = C.MN('Weight'), BS = C.MN('Body Score'), EY = C.MN('Eye Condition'), HR = C.MN('Heart Rate'), ST = C.MN('Stress Behaviour'), MO = C.MN('Mood');
  if (W) { add('wdown', 'PHYSICAL HEALTH', 'Weight down > 5% (30 days)', 'var(--error)', ANIMALS.map(a => { const p = change30(a, W); return p != null && p < -5 ? { a, m: W, why: `Weight ${pctTxt(p)} in 30 days` } : null; }).filter(Boolean));
    add('wup', 'PHYSICAL HEALTH', 'Weight up > 5% (30 days)', 'var(--primary-main)', ANIMALS.map(a => { const p = change30(a, W); return p != null && p > 5 ? { a, m: W, why: `Weight ${pctTxt(p)} in 30 days` } : null; }).filter(Boolean)); }
  if (BS) add('bcs', 'PHYSICAL HEALTH', 'Body score Emaciated (1)', 'var(--error)', ANIMALS.map(a => { const l = recs(a.id, BS.id)[0]; return l && +l.v <= 1 ? { a, m: BS, why: `Body Score 1 · Emaciated · ${fShort(l.t)}` } : null; }).filter(Boolean));
  if (EY) add('eye', 'PHYSICAL HEALTH', 'Eye: discharge 2× in a row', 'var(--tertiary)', ANIMALS.map(a => { const l = recs(a.id, EY.id); return l.length > 1 && l[0].v.includes('Discharge') && l[1].v.includes('Discharge') ? { a, m: EY, why: `Discharge on ${fShort(l[1].t)} and ${fShort(l[0].t)}` } : null; }).filter(Boolean));
  if (HR) add('hr', 'PHYSICAL HEALTH', 'Heart rate above 110 bpm', 'var(--error)', ANIMALS.filter(a => animalMasters(a).includes(HR)).map(a => { const l = recs(a.id, HR.id)[0]; return l && Array.isArray(l.v) && l.v[1] > 110 ? { a, m: HR, why: `Heart Rate ${l.v[0]} – ${l.v[1]} bpm · ${fShort(l.t)}` } : null; }).filter(Boolean));
  if (ST) add('stress', 'BEHAVIOUR', 'Stress high or severe (14 days)', 'var(--tertiary)', ANIMALS.map(a => { const l = recs(a.id, ST.id).find(r => TODAY - r.t < 14 * DAY && +r.v <= 2); return l ? { a, m: ST, why: `${fmt(ST, l).v} · ${fShort(l.t)}` } : null; }).filter(Boolean));
  if (MO) add('mood', 'BEHAVIOUR', 'Mood not recorded (> 14 days)', 'var(--moderate-secondary)', ANIMALS.filter(a => animalMasters(a).includes(MO)).map(a => { const d = daysSince(a, MO); return d > 14 ? { a, m: MO, why: d === Infinity ? 'Mood · never recorded' : `Mood · ${d} days ago` } : null; }).filter(Boolean));
  return R;
}

/* ------------------------------------------------------------------ chrome */
function hero() {
  const n = ANIMALS.length, sites = new Set(ANIMALS.map(a => a.site)).size, encl = new Set(ANIMALS.map(a => a.encl)).size, g = k => ANIMALS.filter(a => a.g === k).length;
  return `<div class="hero"><div class="hero__bg" style="background-image:url(${ANIMALS[0].img})"></div>
    <div class="hero__photo"><img src="${ANIMALS[0].img}" alt="Indian Leopard"><span class="hero__dots"><i></i><i></i><i></i></span></div>
    <div class="hero__main"><div class="hero__name"><div><span class="t-major-title">Indian Leopard</span><span class="sci t-body-reg-italic">Panthera pardus fusca</span></div>
        <div class="hero__pills"><span class="hpill t-subtext-title"><i></i>IUCN · VU</span><span class="hpill t-subtext-title">CITES · App I</span></div></div>
      <div class="hero__stats"><div><span class="k t-body-regular">Animals</span><span class="v1 t-large-title">${n}</span></div><div><span class="k t-body-regular">Site</span><span class="v2 t-large-title">${sites}</span></div><div><span class="k t-body-regular">Enclosure</span><span class="v3 t-large-title">${encl}</span></div></div>
      <div class="hero__chips"><span class="gchip gchip--m t-body-title">M - ${g('male')}</span><span class="gchip gchip--f t-body-title">F - ${g('female')}</span><span class="gchip gchip--u t-body-title">U - ${g('undetermined')}</span><span class="gchip gchip--c t-body-title">Chipped - ${Math.round(ANIMALS.filter(a => a.chipped).length / n * 100)}%</span></div></div></div>`;
}
function tabsBar() {
  return `<div class="sp-tabs"><button class="sp-tabs__all" data-act="sp-drawer" aria-label="All tabs">${ic('list')}</button><div class="sp-tabs__track" data-keep-scroll-x="tabs">${TABS.map(([i, l]) => `<button class="sp-tab t-minor-medium${l === SP.tab ? ' on' : ''}" data-act="sp-tab" data-v="${l}">${ic(i, l === SP.tab ? 'var(--on-primary)' : 'var(--on-surface-variant)', 'app-icon--20')}${l}</button>`).join('')}</div></div>`;
}
function subBar(nAlerts) {
  const subs = [['Population', `${ANIMALS.length}`], ...CATEGORIES.filter(c => typesIn(c).length).map(c => [c]), ['Alerts', `${nAlerts}`]];
  return `<div class="sub" role="tablist">${subs.map(([l, c]) => `<button class="sub__t t-body-medium${l === SP.sub ? ' on' : ''}" role="tab" aria-selected="${l === SP.sub}" data-act="sp-sub" data-v="${l}">${l}${c ? (l === 'Alerts' ? ` <span class="cnt t-small">${c}</span>` : ` (${c})`) : ''}</button>`).join('')}<span class="sub__sp"></span><button class="sub__gear" data-act="sp-settings" aria-label="Assessment settings" title="Assessment settings">${ic('view-settings')}</button></div>`;
}

/* ------------------------------------------------------------------ page */
function renderSpecies() {
  H.gw = SP.det ? ($('app').classList.contains('is-land') ? 1000 : 760) : null;   // the page is wider than the panel: draw the graph 1:1
  if (SP.det && SP.pick) return pickPage();
  if (SP.det) return renderDetail();
  const R = alerts(), nAlerts = R.reduce((s, r) => s + r.items.length, 0);
  let body;
  if (SP.tab !== 'Assessments') body = `<div class="placeholder">${ic(TABS.find(t => t[1] === SP.tab)[0], 'var(--outline)', 'app-icon--28')}<span class="t-minor-medium ink">${esc(SP.tab)}</span><span class="t-body-regular">This tab is part of the Species module. This prototype covers Assessments.</span><button class="btn btn--admit t-body-medium" data-act="sp-tab" data-v="Assessments">Go to Assessments</button></div>`;
  else if (SP.sub === 'Population') body = population();
  else if (SP.sub === 'Alerts') body = alertsView(R);
  else body = typeView();
  return `<div class="sp-bar"><button data-act="sp-menu" aria-label="Menu">${ic('list')}</button><button class="back t-minor-title" data-act="sp-species">${ic('dropdown', 'var(--on-surface)', 'app-icon--20', 'chev-l')}Species</button><span class="sp"></span><span class="t-small muted">${SP.synced ? 'Synced just now' : 'Synced 2 min ago'}</span><button data-act="sp-logout" aria-label="Sign out">${ic('transfer')}</button></div>
    <div class="ptr" aria-hidden="true"><span class="spinner"></span><span class="t-subtext-regular"><span class="when-pull">Pull to refresh</span><span class="when-ready">Release to refresh</span></span></div>
    <div class="sp-scroll" data-ptr data-keep-scroll="sp">${hero()}<div class="sp-sticky">${tabsBar()}${SP.tab === 'Assessments' ? subBar(nAlerts) : ''}</div>${body}</div>`;
}

/* ---------- a category tab: one assessment type across the population ---------- */
function typeView() {
  const list = typesIn(SP.sub), m = curType();
  if (!m) return `<div class="placeholder"><span class="t-body-regular">No active ${esc(SP.sub)} assessments. Add one in ⚙ settings.</span></div>`;
  const chips = `<div class="fchips" data-keep-scroll-x="chips">${list.map(x => `<button class="fchip t-body-medium${x.id === m.id ? ' on' : ''}" data-act="sp-type" data-v="${x.id}">${esc(x.name)}${withType(x).some(a => !doneThisWeek(a, x)) ? '<span class="due" title="Some animals are due"></span>' : ''}</button>`).join('')}</div>`;
  const animals = withType(m), done = animals.filter(a => doneThisWeek(a, m));
  let kpis, charts = '';
  /* KPI strip = library .app-tabs--status: count · label · Tertiary underline on the selected filter. The rule (sub) rides in the title. */
  const K = (key, label, val, sub) => `<${key ? 'button' : 'div'} class="app-tab-status${key ? ' clickable' : ''}${SP.kpi === key && key ? ' app-tab-status--active' : ''}" ${key ? `data-act="sp-kpi" data-v="${key}"` : ''} title="${esc(String(sub))}"><span class="count t-minor-title">${val}</span><span class="t-body-regular">${label[0] + label.slice(1).toLowerCase()}</span><span class="indicator"></span></${key ? 'button' : 'div'}>`;
  if (isNumeric(m)) {
    const ch = animals.map(a => [a, change30(a, m)]), cls = k => ch.filter(([, p]) => trendClass(p) === k);
    const up = m.name === 'Weight' ? 'GAINING' : 'RISING', dn = m.name === 'Weight' ? 'LOSING' : 'FALLING';
    kpis = `<div class="sp-kpis"><div class="app-tabs--status">${K('due', 'ASSESSED', `${done.length} / ${animals.length}`, `${animals.length - done.length} due · every ${m.every || 7} days`)}${K('gaining', up, cls('gaining').length, '> 2% in 30 days')}${K('losing', dn, cls('losing').length, '> 2% in 30 days')}${K('stable', 'STABLE', cls('stable').length, 'within ±2%')}</div></div>`;
    const lat = animals.map(a => recs(a.id, m.id)[0]).filter(Boolean).map(r => numOf(m, r));
    const sorted = ch.filter(([, p]) => p != null).sort((x, y) => y[1] - x[1]);
    charts = `<div class="charts"><div class="ccard"><div class="ccard__hd"><span class="t-minor-medium">${esc(m.name)} distribution</span><span class="t-small muted">${esc(m.unit)} · latest</span></div>${histogram(lat, m)}</div>
      <div class="ccard"><div class="ccard__hd"><span class="t-minor-medium">${esc(m.name)} trend</span><span class="t-small muted">last 30 days</span></div><div class="donut">${donut([[cls('gaining').length, 'var(--primary-main)'], [cls('stable').length, 'var(--outline-variant)'], [cls('losing').length, 'var(--tertiary)']], up[0] + up.slice(1).toLowerCase(), `${animals.length ? Math.round(cls('gaining').length / animals.length * 100) : 0}%`)}
        <div class="legend t-body-regular"><div><i style="background:var(--primary-main)"></i>${up[0] + up.slice(1).toLowerCase()}<span class="n t-body-title">${cls('gaining').length}</span></div><div><i style="background:var(--outline-variant)"></i>Stable<span class="n t-body-title">${cls('stable').length}</span></div><div><i style="background:var(--tertiary)"></i>${dn[0] + dn.slice(1).toLowerCase()}<span class="n t-body-title">${cls('losing').length}</span></div></div></div>
        ${sorted.length ? `<div class="movers t-subtext-regular"><button class="link t-subtext-regular" data-act="sp-open" data-v="${sorted[0][0].id}"><span class="ok t-subtext-title">↑ Top</span>&nbsp;· ${esc(sorted[0][0].tag)} · ${pctTxt(sorted[0][1])}</button><button class="link t-subtext-regular" data-act="sp-open" data-v="${sorted.at(-1)[0].id}"><span class="warn t-subtext-title">↓ Bottom</span>&nbsp;· ${esc(sorted.at(-1)[0].tag)} · ${pctTxt(sorted.at(-1)[1])}</button></div>` : ''}</div></div>`;
  } else {
    const latest = animals.map(a => recs(a.id, m.id)[0]).filter(Boolean);
    const counts = {}; latest.forEach(r => (m.type === 'list' ? r.v : [fmt(m, r).v]).forEach(k => counts[k] = (counts[k] || 0) + 1));
    const top = Object.entries(counts).sort((x, y) => y[1] - x[1]);
    kpis = `<div class="sp-kpis"><div class="app-tabs--status">${K('due', 'ASSESSED', `${done.length} / ${animals.length}`, `every ${m.every || 7} days`)}${K('overdue', 'DUE', animals.length - done.length, 'not recorded in schedule', )}${K(null, 'MOST COMMON', esc(top[0]?.[0] || '—'), `${top[0]?.[1] || 0} of ${latest.length} latest`)}${K(null, 'LAST RECORDED', latest.length ? ago(latest.sort((x, y) => y.t - x.t)[0].t) : '—', 'across the species')}</div></div>`;
    if (m.type !== 'text') charts = `<div class="ccard freqcard"><div class="ccard__hd"><span class="t-minor-medium">Latest answers</span><span class="t-small muted">one per animal</span></div><div class="freq">${top.slice(0, 6).map(([k, n]) => `<div class="freq__row"><div class="top"><span class="t-body-regular">${esc(k)}</span><span class="t-subtext-regular muted">${plural(n, 'animal')} · ${Math.round(n / latest.length * 100)}%</span></div><div class="bar"><i style="width:${n / top[0][1] * 100}%"></i></div></div>`).join('')}</div></div>`;
  }
  return chips + kpis + charts + table(m, animals);
}
function histogram(vals, m) {
  if (!vals.length) return '<div class="empty t-body-regular">No readings</div>';
  const lo = Math.floor(Math.min(...vals)), hi = Math.ceil(Math.max(...vals)) + 1e-9, n = 6, w = (hi - lo) / n || 1, bins = Array(n).fill(0);
  vals.forEach(v => bins[Math.min(n - 1, Math.floor((v - lo) / w))]++);
  const W = 360, Hh = 150, mx = Math.max(...bins, 1), dec = w < 2 ? 1 : 0;
  return `<svg viewBox="0 0 ${W} ${Hh}">${[0, .5, 1].map(f => `<line class="grid" x1="28" x2="${W}" y1="${Hh - 24 - f * (Hh - 40)}" y2="${Hh - 24 - f * (Hh - 40)}"/><text class="axis t-small" x="20" y="${Hh - 20 - f * (Hh - 40)}" text-anchor="end">${Math.round(f * mx)}</text>`).join('')}
    ${bins.map((v, i) => { const x = 40 + i * 54, h = v / mx * (Hh - 40); return `<rect x="${x}" y="${Hh - 24 - h}" width="34" height="${Math.max(h, 1)}" rx="4" style="fill:var(--secondary-main)"><title>${v} animals</title></rect><text class="axis t-small" x="${x + 17}" y="${Hh - 6}" text-anchor="middle">${(lo + i * w).toFixed(dec)}–${(lo + (i + 1) * w).toFixed(dec)}</text>`; }).join('')}</svg>`;
}
function donut(parts, label, val) {
  let a = -Math.PI / 2; const R = 54, r = 36, cx = 64, cy = 64, tot = parts.reduce((s, p) => s + p[0], 0) || 1;
  const arcs = parts.filter(p => p[0]).map(([v, col]) => { const a2 = a + v / tot * Math.PI * 2 - (v === tot ? 1e-4 : 0), lg = a2 - a > Math.PI ? 1 : 0; const p = (ang, rr) => `${cx + rr * Math.cos(ang)},${cy + rr * Math.sin(ang)}`;
    const d = `M${p(a, R)} A${R},${R} 0 ${lg} 1 ${p(a2, R)} L${p(a2, r)} A${r},${r} 0 ${lg} 0 ${p(a, r)} Z`; a = a2; return `<path d="${d}" style="fill:${col}"/>`; }).join('');
  return `<svg width="128" height="128" viewBox="0 0 128 128" style="flex:0 0 128px">${arcs}<text class="axis t-small" x="64" y="58" text-anchor="middle">${label}</text><text x="64" y="78" text-anchor="middle" class="t-minor-title" style="fill:var(--neutral-primary)">${val}</text></svg>`;
}
function table(m, animals) {
  let rows = animals.filter(a => siteOk(a) && qOk(a)).map(a => ({ a, l: recs(a.id, m.id), p: change30(a, m), due: !doneThisWeek(a, m) }));
  if (SP.kpi === 'due' || SP.kpi === 'overdue') rows = rows.filter(r => r.due); else if (SP.kpi) rows = rows.filter(r => trendClass(r.p) === SP.kpi);
  const { key, dir } = SP.sort, num = isNumeric(m);
  const val = r => key === 'change' ? (r.p ?? -1e9) : key === 'latest' ? (r.l[0] ? (num ? numOf(m, r.l[0]) : fmt(m, r.l[0]).v) : '') : key === 'recent' ? (r.l[0]?.t || 0) : key === 'due' ? (r.due ? 1 : 0) : r.a.tag;
  rows.sort((x, y) => { const p = val(x), q = val(y); return (p > q ? 1 : p < q ? -1 : 0) * dir; });
  const sortBtn = (k, label) => `<button data-act="sp-sort" data-v="${k}" class="t-small">${label}${key === k ? ic('dropdown', 'var(--on-surface-variant)', 'app-icon--16', dir > 0 ? 'chev-u' : '') : ''}</button>`;
  const head = num ? [sortBtn('name', 'ANIMAL'), sortBtn('latest', `${m.name.toUpperCase()} · TREND`), sortBtn('change', 'CHANGE')] : [sortBtn('name', 'ANIMAL'), sortBtn('recent', 'LATEST ANSWER'), sortBtn('due', 'STATUS')];
  return `<div class="tcard"><div class="tcard__tools"><label class="tab-search" style="flex:1">${ic('search', 'var(--on-surface-variant)', 'app-icon--20')}<input class="t-body-regular" data-in="sq" value="${esc(SP.q)}" placeholder="Search animals…" enterkeyhint="search" style="border:0;outline:0;flex:1;min-width:0;background:transparent"></label>
      <button class="tsel t-body-medium" data-act="sp-site">${esc(SP.site)} ${ic('dropdown', 'var(--on-surface-variant)', 'app-icon--20')}</button>
      ${SP.kpi ? `<button class="tsel t-body-medium" data-act="sp-kpi" data-v="${SP.kpi}" style="border-color:var(--on-primary-container);color:var(--on-primary-container)">${{ due: 'Due', overdue: 'Due', gaining: 'Rising', losing: 'Falling', stable: 'Stable' }[SP.kpi]} ${ic('close', 'var(--on-primary-container)', 'app-icon--16')}</button>` : ''}</div>
    <div class="thead t-small">${head.map(h => `<span>${h}</span>`).join('')}<span></span></div>
    <div class="tbody">${rows.map(r => trow(m, r)).join('') || `<div class="empty t-body-regular">No animals match.</div>`}</div>
    <div class="tfoot t-subtext-regular"><span>${plural(rows.length, 'animal')} of ${animals.length}</span><span>Tap to open · swipe left to add · hold for more</span></div></div>`;
}
function trow(m, { a, l, p, due }) {
  const last = l[0], f = last ? fmt(m, last) : null, num = isNumeric(m), tc = trendClass(p);
  const val = !last ? `<span class="t-body-regular muted">Not recorded</span>` : num
    ? `<span class="vcell"><span class="vbox"><span class="v"><span class="t-minor-title">${esc(f.v)}</span><span class="t-subtext-regular navy">${esc(f.u)}</span></span><span class="t-small muted">${fShort(last.t)}</span></span>${spark(l.slice(0, 7).reverse().map(r => numOf(m, r)), 96, 28)}</span>`
    : `<span class="vbox" style="min-width:0"><span class="t-body-medium ink ellipsis">${esc(f.v)}</span><span class="t-small muted">${fShort(last.t)} · ${esc(last.by)}</span></span>`;
  const end = num ? `<span class="pct ${tc === 'gaining' ? 'up' : tc === 'losing' ? 'down' : 'flat'} t-subtext-title">${pctTxt(p)}</span>` : due ? `<span class="pill pill--due t-subtext-title">Due</span>` : `<span class="pill pill--done t-subtext-title">${ago(last.t)}</span>`;
  return `<div class="sw" data-lp="arow" data-v="${a.id}"><div class="sw__acts"><button class="sw__act sw__act--add t-body-title" data-act="sp-add" data-v="${a.id}">${ic('plus', 'var(--on-primary)', 'app-icon--20')}Add</button><button class="sw__act sw__act--hist t-body-title" data-act="sp-open" data-v="${a.id}">${ic('time', 'var(--on-primary)', 'app-icon--20')}History</button></div>
    <div class="sw__row"><button class="trow${SP.pn?.a === a.id ? ' hl' : ''}${SP.flash === a.id ? ' is-flash' : ''}" data-act="sp-open" data-v="${a.id}"><span class="acell">${thumb(a, 52)}<span><span class="t-body-title navy">${esc(a.tag)}</span><span class="t-subtext-regular">${esc(a.aid)}</span><span class="t-subtext-regular muted ellipsis">Site: ${esc(a.site)}${due && num ? ' · <span class="warn">due</span>' : ''}</span></span></span>${val}${end}${ic('dropdown', 'var(--outline)', 'app-icon--20', 'chev-r')}</button></div></div>`;
}

/* ---------- Population: every animal, key assessments side by side ---------- */
function population() {
  const W = C.MN('Weight'), BS = C.MN('Body Score');
  const rows = ANIMALS.filter(a => siteOk(a) && qOk(a));
  const cell = (a, m) => { const l = m && recs(a.id, m.id)[0]; if (!l) return '<span class="t-body-regular muted">—</span>'; const f = fmt(m, l); return `<span class="vbox"><span class="v"><span class="t-body-title">${esc(f.v)}</span>${f.u ? `<span class="t-subtext-regular navy">${esc(f.u)}</span>` : ''}</span><span class="t-small muted">${fShort(l.t)}</span></span>`; };
  const cols = 'grid-template-columns:1.3fr .8fr .9fr .7fr 36px';
  return `<div class="tcard"><div class="tcard__tools"><label class="tab-search" style="flex:1">${ic('search', 'var(--on-surface-variant)', 'app-icon--20')}<input class="t-body-regular" data-in="sq" value="${esc(SP.q)}" placeholder="Search animals…" style="border:0;outline:0;flex:1;min-width:0;background:transparent"></label><button class="tsel t-body-medium" data-act="sp-site">${esc(SP.site)} ${ic('dropdown', 'var(--on-surface-variant)', 'app-icon--20')}</button></div>
    <div class="thead t-small" style="${cols}"><span>ANIMAL</span><span>WEIGHT</span><span>BODY SCORE</span><span>DUE</span><span></span></div>
    <div class="tbody">${rows.map(a => { const d = dueTypes(a); return `<div class="sw" data-lp="arow" data-v="${a.id}"><div class="sw__acts"><button class="sw__act sw__act--add t-body-title" data-act="sp-add" data-v="${a.id}">${ic('plus', 'var(--on-primary)', 'app-icon--20')}Add</button></div>
      <div class="sw__row"><button class="trow${SP.flash === a.id ? ' is-flash' : ''}" style="${cols}" data-act="sp-open" data-v="${a.id}"><span class="acell">${thumb(a, 52)}<span><span class="t-body-title navy">${esc(a.tag)}</span><span class="t-subtext-regular">${esc(a.aid)}</span><span class="t-subtext-regular muted ellipsis">${esc(a.site)} · ${esc(a.encl)}</span></span></span>${cell(a, W)}${cell(a, BS)}<span>${d.length ? `<span class="pill pill--due t-subtext-title">${d.length} due</span>` : `<span class="pill pill--done t-subtext-title">All done</span>`}</span>${ic('dropdown', 'var(--outline)', 'app-icon--20', 'chev-r')}</button></div></div>`; }).join('')}</div>
    <div class="tfoot t-subtext-regular"><span>${plural(rows.length, 'animal')}</span><span>Tap an animal to see all of its assessments</span></div></div>`;
}

/* ---------- Alerts ---------- */
function alertsView(R) {
  if (!R.some(r => r.key === SP.alert)) SP.alert = R[0]?.key;
  const groups = [...new Set(R.map(r => r.group))], sel = R.find(r => r.key === SP.alert);
  return groups.map(g => `<span class="sec-label t-small">${g}</span><div class="rules">${R.filter(r => r.group === g).map(r => `<button class="rule${r.key === SP.alert ? ' on' : ''}" data-act="sp-alert" data-v="${r.key}"><span class="v"><i style="background:${r.color}"></i><span class="t-major-medium ink">${r.items.length}</span></span><span class="d t-body-regular">${esc(r.label)}</span></button>`).join('')}</div>`).join('') +
    (sel ? `<div class="tcard"><div class="tcard__tools"><span class="t-minor-medium" style="flex:1">${esc(sel.label)} · ${plural(new Set(sel.items.map(i => i.a.id)).size, 'animal')}</span></div>
      <div class="thead t-small" style="grid-template-columns:1.2fr 1.5fr 36px"><span>ANIMAL</span><span>WHY</span><span></span></div>
      <div class="tbody">${sel.items.map(({ a, m, why }) => `<div class="sw" data-lp="arow" data-v="${a.id}" data-m="${m.id}"><div class="sw__acts"><button class="sw__act sw__act--add t-body-title" data-act="sp-add" data-v="${a.id}" data-m="${m.id}">${ic('plus', 'var(--on-primary)', 'app-icon--20')}Add</button></div>
        <div class="sw__row"><button class="trow${SP.flash === a.id ? ' is-flash' : ''}" style="grid-template-columns:1.2fr 1.5fr 36px" data-act="sp-open" data-v="${a.id}" data-m="${m.id}"><span class="acell">${thumb(a, 52)}<span><span class="t-body-title navy">${esc(a.tag)}</span><span class="t-subtext-regular muted ellipsis">${esc(a.site)} · ${esc(a.encl)}</span></span></span><span><span class="why t-subtext-title">${ic(sel.key === 'overdue' || sel.key === 'mood' ? 'time' : 'alert', 'var(--tertiary)', 'app-icon--16')}${esc(why)}</span></span>${ic('dropdown', 'var(--outline)', 'app-icon--20', 'chev-r')}</button></div></div>`).join('') || `<div class="empty t-body-regular">${ic('just-tick-mark', 'var(--primary-main)', 'app-icon--28')}Nothing flagged.</div>`}</div></div>` : '');
}

/* ------------------------------------------------------------------ Animal Details page 
   Same shape as the Antz app's animal page: photo hero with a dark info card · sticky underline tabs (☰ Overview · Taxonomy ·
   Assessment · …) · the Assessment tab is ours: "N Types" toolbar + search · chips (All · Due · a chip per category) · cards ·
   tap a card → that assessment's graph + records · + button → Add Entry. */
const SEX = { male: 'Male', female: 'Female', undetermined: 'Indeterminate' };
const ATABS = ['Overview', 'Taxonomy', 'Assessment', 'Notes', 'Medical', 'Journal'];   // Figma 1540:13003
function statusOf(a, m) {   // ok · due · over (past schedule + grace) · none (never recorded)
  if (!recs(a.id, m.id).length) return 'none';
  if (doneThisWeek(a, m)) return 'ok';
  return daysSince(a, m) > (m.every || 7) + (m.grace || 7) ? 'over' : 'due';
}
const statusPill = (a, m) => ({ ok: '<span class="pill pill--done t-subtext-title">Up to date</span>', due: '<span class="pill pill--due t-subtext-title">Due</span>', over: '<span class="pill pill--over t-subtext-title">Overdue</span>', none: '<span class="pill pill--off t-subtext-title">Not recorded</span>' })[statusOf(a, m)];
const detOrder = () => { const l = ANIMALS.filter(x => siteOk(x) && qOk(x)); return l.some(x => x.id === SP.det?.a) ? l : ANIMALS; };
function openDetail(aId, mId) {
  const sc = $('view').querySelector('.sp-scroll'); if (!SP.det && sc) SP.spTop = sc.scrollTop;
  SP.det = { a: aId, tab: 'Assessment', f: 'all', m: null, q: '', anim: true, top: true }; H.tip = null; closePanel(); render();
  if (M(mId)) openDetSheet(mId);
}
const markCard = mId => { document.querySelectorAll('.ac.on').forEach(x => x.classList.remove('on')); if (mId) document.querySelector(`.ac[data-v="${mId}"]`)?.classList.add('on'); };   // highlight without redrawing the page behind the sheet
function openDetSheet(mId) { SP.det.m = mId; H.tip = null; drawDetSheet(); markCard(mId); }
function closeDetail() { SP.det = null; H.tip = null; render(); }
function setDet(patch) { Object.assign(SP.det, patch, { snap: true }); H.tip = null; render(); }
const detList = (a, useQ = true) => { const ms = animalMasters(a), f = SP.det.f, q = useQ ? SP.det.q.toLowerCase() : '';
  return byOrder(ms).filter(m => (f === 'all' || (f === 'due' ? statusOf(a, m) !== 'ok' : m.cat === f)) && (!q || m.name.toLowerCase().includes(q))); };
/* the keeper's card order (drag to arrange): one list of master ids for every animal, kept in DB so it survives a reload */
const ordIdx = () => { const o = C.DB.cardOrder || [], at = {}; o.forEach((id, i) => at[id] = i); return at; };
const byOrder = ms => { const at = ordIdx(); return ms.map((m, i) => [m, at[m.id] ?? 1e4 + i]).sort((p, q) => p[1] - q[1]).map(x => x[0]); };
function setOrder(visIds) {   // the visible cards were rearranged: they take back the slots they held in the full list, in their new order
  const full = byOrder(C.DB.masters).map(m => m.id), vis = new Set(visIds), q = visIds.slice();
  C.DB.cardOrder = full.map(id => vis.has(id) ? q.shift() : id); save();
}

function renderDetail() {
  const a = A(SP.det.a), d = SP.det;
  const hero = `<div class="ah2"><div class="ah2__bg" style="background-image:url(${a.img})"></div>
    <button class="ah2__back" data-act="ad-back" aria-label="Back">${ic('back', 'var(--on-primary)', 'app-icon--28')}</button>
    <div class="ah2__card"><span class="t-major-title">${esc(a.tag)}</span><span class="t-body-reg-italic">${esc(a.sci)}</span>
      <span class="ah2__rows t-body-regular"><span><span>Species: ${esc(a.species)}</span><span>Sex: ${SEX[a.g]}</span></span><span><span>Site: ${esc(a.site)}</span><span>Encl: ${esc(a.encl)}</span></span><span>${esc(a.aid)}</span></span></div>
    <div class="ah2__tags"><span class="ah2__tag t-subtext-title">Individual</span>${a.chipped ? '<span class="ah2__tag t-subtext-title">Chipped</span>' : ''}</div></div>`;   /* Figma 1538:9572 */
  const tabs = `<div class="ad-tabs2" data-keep-scroll-x="atab"><button class="ad-tabs2__all" data-act="ad-soon" data-v="All tabs" aria-label="All tabs"><span class="app-icon app-icon--24"><img src="../../../app/icons/new/tabs-menu.svg" alt=""></span></button><div class="ad-tabs2__links">${ATABS.map(t => `<button class="ad-tabs2__t t-minor-medium${t === d.tab ? ' on' : ''}" data-act="ad-tab" data-v="${t}">${t}</button>`).join('')}</div></div>`;   /* Figma 1540:13003 */
  let body;
  if (d.tab !== 'Assessment') body = `<div class="placeholder">${ic('file-doc', 'var(--outline)', 'app-icon--28')}<span class="t-minor-medium ink">${esc(d.tab)}</span><span class="t-body-regular">Part of the Animal page. This prototype covers Assessment.</span><button class="btn btn--admit t-body-medium" data-act="ad-tab" data-v="Assessment">Go to Assessment</button></div>`;
  else body = assessList(a);
  return `<div class="sp-scroll ad-scroll${d.anim ? ' ad-in' : ''}" data-keep-scroll="ad">${hero}<div class="ad-sticky">${tabs}</div><div class="ad-body">${body}</div></div>`;
}
function assessList(a) {
  const d = SP.det, ms = animalMasters(a), due = ms.filter(m => statusOf(a, m) !== 'ok'), list = detList(a);
  const chip = (v, label, n) => `<button class="tab-primary${d.f === v ? ' tab-primary--active' : ''}" data-act="ad-f" data-v="${v}">${esc(label)} - ${n}</button>`;
  const cats = CATEGORIES.filter(c => ms.some(m => m.cat === c));   // Figma order: Physical Health · Behaviour · Environment · then the rest
  const tools = `<div class="ad-bar"><span class="ad-bar__n t-minor-title">${plural(ms.length, 'Type')}</span>
      <label class="ad-search">${ic('search', 'var(--on-surface-variant)', 'app-icon--20')}<input class="t-body-regular" data-in="adq" value="${esc(d.q)}" placeholder="Search Assessments" enterkeyhint="search"></label>
      <i class="ad-bar__sep"></i><button class="ad-cta" data-act="ad-addpick" aria-label="Add assessment types">${ic('add', 'var(--on-primary)', 'app-icon--20')}</button></div>
    <div class="ad-chiprow"><div class="ad-chips2" data-keep-scroll-x="adchips">${[['all', 'All']].concat(cats.map(c => [c, c])).map(([v, l]) => `<button class="ad-chip t-body-medium${d.f === v || (v === 'all' && d.f === 'due') ? ' on' : ''}" data-act="ad-f" data-v="${v}">${esc(l)}</button>`).join('')}</div></div>`;   /* Figma 1540:13353 + 1543:13708 */
  const groups = (d.f === 'all' || d.f === 'due' ? CATEGORIES : [d.f]).map(c => [c, list.filter(m => m.cat === c)]).filter(([, l]) => l.length);
  const wide = list.find(m => m.name === 'Weight' && recs(a.id, m.id).length), rest = list.filter(m => m !== wide);   // Weight runs full width above the two columns; the rest deal left / right as before
  const cards = !list.length ? (d.q ? `<div class="placeholder"><span class="t-body-regular">No assessments match “${esc(d.q)}”.</span></div>`
      : `<div class="placeholder">${ic('just-tick-mark', 'var(--primary-main)', 'app-icon--28')}<span class="t-minor-medium ink">All assessments are up to date</span><span class="t-body-regular">Nothing is due for ${esc(a.tag)} right now.</span><button class="btn btn--admit t-body-medium" data-act="ad-f" data-v="all">Show all</button></div>`)
    : (wide ? acardWide(a, wide) : '') + `<div class="ad-cols"><div class="ad-col">${rest.map((m, i) => i % 2 ? '' : acard(a, m, i)).join('')}</div><div class="ad-col">${rest.map((m, i) => i % 2 ? acard(a, m, i) : '').join('')}</div></div>`;
  return `${tools}<div class="ad-list">${cards}</div>`;
}
/* one card = Figma Assessment card (1528:9130): head (name · category · add) · body (value + change, last tested, viz) · stats tiles / note box.
   New in the prototype (not in the library yet): classes .ac-*, listed in Needs review. */
/* card graphs (Figma 1538:9571): the colour follows the change — up green, down orange, steady blue (yellow for an area that holds) */
const TONE = { up: 'var(--primary-main)', down: 'var(--tertiary)', flat: 'var(--add-primary)' };
function dirOf(m, l) { if (l.length < 2) return 'flat'; const p = isNumeric(m) ? numOf(m, l[1]) : +l[1].v, c = isNumeric(m) ? numOf(m, l[0]) : +l[0].v; return Math.abs(c - p) < 1e-9 ? 'flat' : c > p ? 'up' : 'down'; }
function acViz(m, l, dir) {
  const W = 132, H = 48, vals = l.slice(0, 10).reverse().map(r => isNumeric(m) ? numOf(m, r) : +r.v);
  if (m.type === 'list') { const cnt = {}; l.forEach(r => r.v.forEach(o => cnt[o] = (cnt[o] || 0) + 1)); const top = Object.entries(cnt).sort((p, q) => q[1] - p[1]).slice(0, 3), mx = top[0]?.[1] || 1;
    return `<span class="ac-viz ac-dist ac-dist--${m.tone || 'mid'}">${top.map(([o, n], k) => `<span class="ac-dist__row" title="${esc(o)} (${n}×)"><i class="${k ? '' : 'on'}" style="width:${Math.max(14, n / mx * 43)}%"></i></span>`).join('')}</span>`; }
  if (m.type === 'text' || vals.length < 2) return '';
  const lo = m.type === 'scale' ? 0 : Math.min(...vals), hi = m.type === 'scale' ? Math.max(...m.scale.map(x => +x[0])) : Math.max(...vals), span = hi - lo || 1;
  const col = m.viz === 'area' && dir === 'flat' ? 'var(--moderate-secondary)' : m.viz === 'lollipop' ? 'var(--on-surface)' : TONE[dir];
  const y = v => 4 + (H - 8) - ((v - lo) / span) * (H - 8), x = i => 2 + i * (W - 4) / (vals.length - 1);
  if (m.viz === 'bars') return `<span class="ac-viz ac-bars" style="--c:${col}">${vals.map((v, i) => `<i style="height:${Math.max(14, (v - lo) / span * 100)}%;opacity:${(.25 + .75 * i / (vals.length - 1)).toFixed(2)}"></i>`).join('')}</span>`;
  if (m.viz === 'lollipop') return `<span class="ac-viz"><svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" aria-hidden="true">${vals.map((v, i) => `<line x1="${x(i)}" x2="${x(i)}" y1="${H}" y2="${y(v)}" style="stroke:${col};stroke-width:1.5"/><circle cx="${x(i)}" cy="${y(v)}" r="2.5" style="fill:${col}"/>`).join('')}</svg></span>`;
  const pts = vals.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`), last = pts[pts.length - 1].split(',');
  if (m.viz === 'line') return `<span class="ac-viz"><svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" aria-hidden="true"><polyline points="${pts.join(' ')}" fill="none" style="stroke:${col};stroke-width:1;stroke-dasharray:2 2"/>${pts.map(p => `<circle cx="${p.split(',')[0]}" cy="${p.split(',')[1]}" r="1.8" style="fill:${col}"/>`).join('')}</svg></span>`;
  const gid = 'g' + m.id;   // area (default)
  return `<span class="ac-viz"><svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" aria-hidden="true"><defs><linearGradient id="${gid}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" style="stop-color:${col};stop-opacity:.45"/><stop offset="1" style="stop-color:${col};stop-opacity:.05"/></linearGradient></defs><polygon points="2,${H} ${pts.join(' ')} ${last[0]},${H}" fill="url(#${gid})"/><polyline points="${pts.join(' ')}" fill="none" style="stroke:${col};stroke-width:1.5;stroke-linejoin:round"/><circle cx="${last[0]}" cy="${last[1]}" r="2.5" style="fill:var(--on-primary);stroke:${col};stroke-width:1.5"/></svg></span>`;
}
function acard(a, m, i = 0) {
  const l = recs(a.id, m.id), last = l[0], f = last && fmt(m, last), num = isNumeric(m), dir = dirOf(m, l), t = C.trend(m, l);
  let chg = '';
  if (num && t) chg = t.dir === 'flat' ? '<span class="ac-chg ac-chg--flat t-subtext-regular">→ Stable</span>' : `<span class="ac-chg ac-chg--${t.dir} t-subtext-regular">${t.dir === 'up' ? '↑' : '↓'} ${esc(t.txt.replace(/^[+−]/, ''))}</span>`;
  if (m.type === 'scale' && l.length > 1) chg = dir === 'flat' ? '<span class="ac-chg ac-chg--flat t-subtext-regular">→ Stable</span>' : `<span class="ac-chg ac-chg--${dir} t-subtext-regular">${dir === 'up' ? '↑ Improved' : '↓ Declined'}</span>`;
  const mx = m.type === 'scale' ? Math.max(...m.scale.map(x => +x[0])) : 0;
  const val = !last ? '<span class="t-body-regular muted">No readings yet</span>'
    : num ? `<span class="ac-val"><span class="ac-val__n t-medium-medium">${esc(f.v)}</span><span class="ac-val__u t-minor-medium">${esc(f.u)}</span></span>`
    : m.type === 'scale' ? `<span class="ac-val"><span class="ac-val__n t-medium-medium">${esc(String(last.v))}</span><span class="ac-val__u t-minor-medium">/${mx}</span></span>`
    : `<span class="ac-val"><span class="ac-val__n ac-val__n--txt t-medium-medium">${esc(f.v)}</span></span>`;
  const vals = num ? l.map(r => numOf(m, r)) : [];
  const stats = num && l.length > 1 ? `<span class="ac-stats">${[['PREVIOUS', numOf(m, l[1])], ['AVERAGE', vals.reduce((p, q) => p + q, 0) / vals.length], ['MIN', Math.min(...vals)], ['MAX', Math.max(...vals)]].map(([k, v]) => `<span class="ac-stat"><span class="ac-stat__k t-small">${k}</span><span class="ac-stat__v t-body-title">${+v.toFixed(1)} ${esc(f.u)}</span></span>`).join('')}</span>` : '';
  const date = `<span class="ac__date t-small">${ic('calendar', 'currentColor', 'app-icon--14')}<i>${last ? `Last tested on ${fDate(last.t)}` : 'Never recorded'}</i></span>`;
  const body = m.type === 'text' ? `${last ? `<span class="ac-note t-subtext-regular">“${esc(f.v)}”</span>` : val}${date}`
    : `<span class="ac__row"><span class="ac__lead"><span class="ac__main">${val}${chg}</span>${date}</span>${acViz(m, l, dir)}</span>${stats}`;
  return `<div class="ac${SP.flashM === m.id ? ' is-flash' : ''}${SP.det.m === m.id ? ' on' : ''}" style="--i:${i + 1}" role="button" tabindex="0" data-act="ad-m" data-v="${m.id}" data-i="${i}">
    <span class="ac__hd"><span class="ac__name"><span class="t-body-medium">${esc(m.name)}</span><span class="ac__cat t-subtext-regular">${esc(m.cat)}</span></span><button class="ac__add" data-act="ad-add" data-v="${m.id}" aria-label="Add ${esc(m.name)} reading">${ic('add-with-circle', 'var(--add-primary)', 'app-icon--24')}</button></span>
    <span class="ac__bd">${body}</span></div>`;
}
/* Weight, full width (pinned above the columns, not part of drag to arrange). Same parts as every card (acard): header · value + change ·
   calendar date · graph on the right (the last 30 days, drawn like the Figma card graph, with dates) ·
   under the date, two tiles: this animal's min and max over those 30 days, with the day each was recorded. New in the prototype, Needs review. */
function acardWide(a, m) {
  const l = recs(a.id, m.id), last = l[0], f = fmt(m, last), u = f.u, t = C.trend(m, l), l30 = DSC.inWin(l, 'M');
  const chg = t ? (t.dir === 'flat' ? '<span class="ac-chg ac-chg--flat t-subtext-regular">→ Stable</span>' : `<span class="ac-chg ac-chg--${t.dir} t-subtext-regular">${t.dir === 'up' ? '↑' : '↓'} ${esc(t.txt.replace(/^[+−]/, ''))}</span>`) : '';
  const by = (pick) => l30.reduce((p, r) => !p || pick(numOf(m, r), numOf(m, p)) ? r : p, null), lo = by((x, y) => x < y), hi = by((x, y) => x > y);
  const tile = (k, r) => `<span class="ac-stat"><span class="ac-stat__k t-small">${k}</span><span class="ac-stat__v t-body-title">${+numOf(m, r).toFixed(1)} ${esc(u)}</span><span class="ac-stat__k t-small">${fShort(r.t)}</span></span>`;
  const stats = l30.length ? `<span class="ac-stats">${tile('MIN', lo)}${tile('MAX', hi)}</span>` : '';
  const viz = l30.length ? `<span class="ac-viz ac-viz--wide">${DSC.chart(m, l30, { w: $('view').clientWidth - 72 - 200 - 24, h: 112, range: 'M', card: true })}</span>` : '';   // the rest of the row: card 738 − lead 200 − gap 24, drawn 1:1
  return `<div class="ac ac--wide${SP.flashM === m.id ? ' is-flash' : ''}${SP.det.m === m.id ? ' on' : ''}" style="--i:0" role="button" tabindex="0" data-act="ad-m" data-v="${m.id}">
    <span class="ac__hd"><span class="ac__name"><span class="t-body-medium">${esc(m.name)}</span><span class="ac__cat t-subtext-regular">${esc(m.cat)}</span></span><button class="ac__add" data-act="ad-add" data-v="${m.id}" aria-label="Add ${esc(m.name)} reading">${ic('add-with-circle', 'var(--add-primary)', 'app-icon--24')}</button></span>
    <span class="ac__bd"><span class="ac__row ac-wide"><span class="ac__lead"><span class="ac__main"><span class="ac-val"><span class="ac-val__n t-medium-medium">${esc(f.v)}</span><span class="ac-val__u t-minor-medium">${esc(u)}</span></span>${chg}</span><span class="ac__date t-small">${ic('calendar', 'currentColor', 'app-icon--14')}<i>Last tested on ${fDate(last.t)}</i></span>${stats}</span>${viz}</span></span></div>`;
}
/* ------------------------------------------------------------------ Add assessments (the + on the Animal page) — the app's "Search Assessment Type" page on the tablet.
   Same content as the phone: a name and a checkbox per type, nothing else. Built for hundreds of types:
   library header (.hdr) + search (.tab-search, searches every category, highlights the match) · category chips with counts ·
   two columns of cards A–Z (the Animal page card look: white, soft shadow, no outline) ·
   types the animal already has sit in their place, ticked (grey); untick one to remove it (its readings are kept) ·
   footer as on the phone: "N Types Selected ⌄" opens the list of changes, Add / Save applies them, the toast offers Undo. New in the prototype, Needs review. */
function pickPage() {
  const a = A(SP.det.a), p = SP.pick, mine = new Set(animalMasters(a).map(m => m.id)), q = p.q.trim().toLowerCase();
  const all = C.DB.masters.filter(m => m.active).sort((x, y) => x.name.localeCompare(y.name)), cats = CATEGORIES.filter(c => all.some(m => m.cat === c));
  const list = all.filter(m => q ? m.name.toLowerCase().includes(q) : p.f === 'all' || m.cat === p.f);   // a search looks in every category
  const on = m => mine.has(m.id) ? !p.rem.includes(m.id) : p.add.includes(m.id);
  const hl = name => { if (!q) return esc(name); const i = name.toLowerCase().indexOf(q); return `${esc(name.slice(0, i))}<mark class="pk-hl">${esc(name.slice(i, i + q.length))}</mark>${esc(name.slice(i + q.length))}`; };
  const fx = p.anim, pop = p.pop, trayIn = p.trayIn; p.anim = p.pop = p.trayIn = null;   // one-shot motion flags: page in · list in · check pop · tray in
  const row = (m, k) => { const x = on(m), had = mine.has(m.id);
    return `<button class="app-radio pk-row${x ? ' is-on' : ''}${had && x ? ' is-had' : ''}${pop === m.id ? ' is-pop' : ''}" style="--i:${Math.min(k, 24)}" data-act="pk-tog" data-v="${m.id}" aria-pressed="${x}"><span class="t-body-medium pk-row__n">${hl(m.name)}</span>${ic(x ? 'checkbox-checked' : 'checkbox-unchecked', x ? (had ? 'var(--outline)' : 'var(--primary-main)') : 'var(--on-surface-variant)', 'app-icon--24')}</button>`; };
  const body = list.length ? `<div class="pk-grid">${list.map(row).join('')}</div>`
    : `<div class="placeholder"><span class="t-body-regular">No assessment type matches “${esc(p.q)}”.</span></div>`;
  const nA = p.add.length, nR = p.rem.length, n = nA + nR;
  const summary = !n ? 'No types selected' : nR && nA ? `${nA} to add · ${nR} to remove` : nR ? `${plural(nR, 'Type')} to remove` : `${plural(nA, 'Type')} Selected`;
  const change = (id, kind) => `<div class="pk-tray__row"><span class="t-body-medium">${esc(M(id).name)}</span><span class="pk-tray__tag pk-tray__tag--${kind} t-subtext-title">${kind === 'add' ? 'Adding' : 'Removing'}</span><button class="pk-tray__x" data-act="pk-tog" data-v="${id}" aria-label="Undo ${esc(M(id).name)}">${ic('close', 'var(--on-surface-variant)', 'app-icon--20')}</button></div>`;
  const tray = p.open && n ? `<div class="pk-tray${trayIn ? ' is-in' : ''}">${p.add.map(id => change(id, 'add')).join('')}${p.rem.map(id => change(id, 'rem')).join('')}</div>` : '';
  return `<div class="pk${fx === 'page' ? ' is-enter' : ''}">
    <div class="hdr"><div class="hdr__row"><button class="hdr__back" data-act="pk-close" aria-label="Back">${ic('back', 'var(--on-secondary-container)', 'app-icon--24')}</button><div class="hdr__title"><span class="t-minor-title pk-title">Search Assessment Type</span></div></div>
      <div class="hdr__tools pk-tools"><label class="tab-search">${ic('search', 'var(--on-surface-variant)', 'app-icon--20')}<input class="t-body-regular" data-in="pq" value="${esc(p.q)}" placeholder="Search ${all.length} assessment types" enterkeyhint="search"></label></div>
      ${q ? `<div class="pk-found t-body-medium">${plural(list.length, 'result')} for “${esc(p.q)}” in all categories</div>` : `<div class="pk-chips ad-chips2">${[['all', 'All', all.length]].concat(cats.map(c => [c, c, all.filter(m => m.cat === c).length])).map(([k, l, c]) => `<button class="ad-chip t-body-medium${p.f === k ? ' on' : ''}" data-act="pk-f" data-v="${k}">${esc(l)} <span class="pk-chip__n">${c}</span></button>`).join('')}</div>`}</div>
    <div class="pk-body"><div class="pk-list${fx ? ' is-in' : ''}" data-keep-scroll="pk">${body}</div></div>
    ${tray ? `<div class="pk-shade${trayIn ? ' is-in' : ''}" data-act="pk-tray"></div>` : ''}
    <div class="pk-ft">${tray}<div class="pk-ft__bar"><button class="pk-count t-minor-medium" data-act="pk-tray" ${n ? '' : 'disabled'}>${summary}${n ? ic('dropdown', 'var(--on-surface-variant)', 'app-icon--24', p.open ? 'chev-u' : '') : ''}</button><button class="btn btn--admit pk-add t-minor-title" data-act="pk-save" ${n ? '' : 'disabled'}>${nR ? 'Save' : 'Add'}</button></div></div>
  </div>`;
}
function pkSave() {
  const a = A(SP.det.a), { add, rem } = SP.pick; if (!add.length && !rem.length) return;
  const before = { hidden: JSON.parse(JSON.stringify(C.DB.hidden || {})), extra: C.DB.masters.map(m => [m.id, (m.extraFor || []).slice()]) };
  const hid = (C.DB.hidden ||= {})[a.id] ||= [];
  add.forEach(id => { const m = M(id), i = hid.indexOf(id); if (i > -1) hid.splice(i, 1); if (!animalMasters(a).some(x => x.id === id)) m.extraFor = [...new Set([...(m.extraFor || []), a.id])]; });
  rem.forEach(id => { if (!hid.includes(id)) hid.push(id); });
  save(); SP.pick = null; SP.det.f = 'all'; SP.flashM = add[0] || null; render(); setTimeout(() => { SP.flashM = null; }, 2400);
  const msg = [add.length ? `${plural(add.length, 'type')} added` : '', rem.length ? `${plural(rem.length, 'type')} removed` : ''].filter(Boolean).join(' · ');
  toast(msg, () => { C.DB.hidden = before.hidden; before.extra.forEach(([id, e]) => { M(id).extraFor = e; }); save(); render(); });
}
/* ------------------------------------------------------------------ drag to arrange the cards (new in the prototype, Needs review)
   Touch: press and hold a card → it lifts off the page (grows, tilts, deep shadow) and the rest of the cards wobble to show they can move.
   Its old place becomes a dashed landing slot. Drag it: the card leans the way you move it, like a real card held by a corner;
   pass over another card and the cards slide aside with a spring and a haptic tick. Near the top or bottom edge the page scrolls.
   Let go → it drops into the slot with a small bounce, the order is saved for every animal, and the toast offers Undo.
   Mouse: no hold, it lifts once you drag 6px. Hold 300ms (iOS starts text selection at ~500ms). Esc puts it back. */
function cardDrag(root) {
  const HOLD = 300;
  let p = null;   // { card, id, x, y, sx, sy, ... }
  const cards = cols => [...cols.querySelectorAll('.ac, .ac-slot')].sort((a, b) => +a.dataset.i - +b.dataset.i);
  function lay(cols, list, flip = true) {   // deal the cards back into the two columns (even → left, odd → right), animating the move
    const before = flip ? new Map(list.map(el => [el, el.getBoundingClientRect()])) : null, [c0, c1] = cols.children;   // where they are on screen now (mid-animation too)
    list.forEach((el, i) => { el.dataset.i = i; (i % 2 ? c1 : c0).appendChild(el); el.style.transition = 'none'; el.style.transform = ''; });
    const c = cols.getBoundingClientRect(), box = new Map();   // the real resting places, for hit-testing (never the in-flight ones)
    list.forEach(el => { const n = el.getBoundingClientRect(); box.set(el, { l: n.left - c.left, t: n.top - c.top, r: n.right - c.left, b: n.bottom - c.top });
      const o = before?.get(el), dx = o ? o.left - n.left : 0, dy = o ? o.top - n.top : 0; if (!dx && !dy) { el.style.transition = ''; return; }
      el.style.transform = `translate(${dx}px,${dy}px)`; void el.offsetWidth;
      el.style.transition = 'transform .34s cubic-bezier(.2,1.25,.35,1)'; el.style.transform = ''; });
    if (p) p.box = box;
  }
  function start(e, card) {
    p = { card, id: e.pointerId, x: e.clientX, y: e.clientY, mouse: e.pointerType === 'mouse', live: false, vx: 0, tilt: 0, lastX: e.clientX, lastHit: null, timer: null };
    if (!p.mouse) { card.classList.add('is-charging'); blockScroll(true); p.timer = setTimeout(lift, HOLD); }
  }
  function cancel() { if (!p) return; clearTimeout(p.timer); p.card.classList.remove('is-charging'); blockScroll(false); p = null; }
  function lift() {
    const { card } = p, cols = card.closest('.ad-cols'), r = card.getBoundingClientRect();
    card.classList.remove('is-charging'); T.haptic(15); blockScroll(true);
    const list = cards(cols);
    const slot = document.createElement('div'); slot.className = 'ac-slot'; slot.style.height = `${r.height}px`;
    slot.innerHTML = `<span class="t-subtext-regular">${esc(card.querySelector('.ac__name .t-body-medium').textContent)}</span>`;
    slot.dataset.i = card.dataset.i; card.replaceWith(slot);
    Object.assign(p, { live: true, cols, slot, from: list.map(el => el.dataset.v), ox: p.x - r.left, oy: p.y - r.top, w: r.width, scroller: cols.closest('.sp-scroll') });
    card.classList.add('is-lifted'); card.style.width = `${r.width}px`; card.style.left = `${r.left}px`; card.style.top = `${r.top}px`;
    $('app').appendChild(card); cols.classList.add('is-arranging');
    cols.querySelectorAll('.ac').forEach((el, i) => el.style.animationDelay = `${-(i * 137 % 300)}ms`);
    lay(cols, cards(cols), false); move(p.x, p.y); p.raf = requestAnimationFrame(tick);
  }
  function move(x, y) {
    const dt = x - p.lastX; p.lastX = x; p.vx = p.vx * .7 + dt * .3;
    p.tilt = Math.max(-7, Math.min(7, p.vx * .9)); p.x = x; p.y = y;
    p.card.style.transform = `translate(${x - p.ox - parseFloat(p.card.style.left)}px,${y - p.oy - parseFloat(p.card.style.top)}px) rotate(${p.tilt.toFixed(2)}deg) scale(1.04)`;
    hit();
  }
  function hit() {   // the card whose resting place is under the finger takes the slot's place; it must be left before it can trigger again
    if (Date.now() < (p.coolUntil || 0)) return;
    const c = p.cols.getBoundingClientRect(), x = p.x - c.left, y = p.y - c.top, list = cards(p.cols);
    const over = list.find(el => { const r = p.box.get(el); if (!r) return false; const h = r.b - r.t; return x > r.l && x < r.r && y > r.t + h * .05 && y < r.b - h * .05; });
    if (over === p.lastHit) return; p.lastHit = over;
    if (!over || over === p.slot) return;
    const to = list.indexOf(over), next = list.filter(el => el !== p.slot); next.splice(to, 0, p.slot);
    lay(p.cols, next); p.coolUntil = Date.now() + 120; T.haptic(6);
  }
  function tick() {   // edge auto-scroll + let the tilt settle when the finger stops
    if (!p?.live) return;
    const sc = p.scroller, r = sc.getBoundingClientRect(), top = Math.max(r.top, sc.querySelector('.ad-sticky')?.getBoundingClientRect().bottom || r.top), E = 72;
    const v = p.y < top + E ? -(1 - (p.y - top) / E) * 14 : p.y > r.bottom - E ? (1 - (r.bottom - p.y) / E) * 14 : 0;
    if (v) { sc.scrollTop += v; p.lastHit = null; }
    if (Math.abs(p.vx) > .05 || v) { p.vx *= .85; move(p.x, p.y); }
    p.raf = requestAnimationFrame(tick);
  }
  function drop(keep) {
    const c = p; p = null; cancelAnimationFrame(c.raf); blockScroll(false); T.blockClick();
    if (!keep) { const list = cards(c.cols).filter(el => el !== c.slot); list.splice(c.from.indexOf(c.card.dataset.v), 0, c.slot); lay(c.cols, list); }
    const s = c.slot.getBoundingClientRect(), L = parseFloat(c.card.style.left), Tp = parseFloat(c.card.style.top);
    c.card.classList.add('is-dropping'); c.card.style.transform = `translate(${s.left - L}px,${s.top - Tp}px) rotate(0deg) scale(1)`;
    const done = () => { if (!c.card.isConnected || !c.slot.isConnected) return; c.card.removeEventListener('transitionend', done);
      c.card.classList.remove('is-lifted', 'is-dropping'); ['width', 'left', 'top', 'transform'].forEach(k => c.card.style[k] = '');
      c.slot.replaceWith(c.card); c.cols.classList.remove('is-arranging'); c.cols.querySelectorAll('.ac').forEach(el => { el.style.animationDelay = ''; el.style.transition = ''; });
      const ids = cards(c.cols).map(el => el.dataset.v), at = ids.indexOf(c.card.dataset.v);
      if (keep && ids.join() !== c.from.join()) {
        const prev = (C.DB.cardOrder || []).slice(); setOrder(ids); c.card.classList.add('is-landed'); T.haptic(10);
        toast(`${M(c.card.dataset.v).name} moved to place ${at + 1}`, () => { C.DB.cardOrder = prev; save(); render(); });
      } };
    c.card.addEventListener('transitionend', done); setTimeout(done, 420);
  }
  /* iPad: touch events, not pointer events. A long press would otherwise start iOS text selection, which steals the finger
     (pointer events stop, the card is left behind). So: nothing on the page is selectable while a card is held, the hold (300ms)
     ends before iOS's own (~500ms), and once lifted every touchmove is ours (preventDefault → no scroll, no selection). */
  const blockScroll = on => { document.documentElement.classList.toggle('is-card-drag', on); if (on) window.getSelection()?.removeAllRanges(); };
  const moveTo = (x, y) => {
    if (!p) return; if (p.live) { move(x, y); return; }
    const d = Math.hypot(x - p.x, y - p.y);
    if (p.mouse) { if (d > 6) lift(); } else if (d > 10) cancel();   // finger moved before the hold finished → it's a scroll
  };
  const up = keep => { if (!p) return; if (p.live) drop(keep); else cancel(); };
  root.addEventListener('touchstart', e => {
    const card = e.target.closest('.ad-cols .ac'); if (!card || p || e.touches.length > 1 || e.target.closest('button')) { if (p && !p.live) cancel(); return; }
    const t = e.changedTouches[0]; start({ pointerId: t.identifier, clientX: t.clientX, clientY: t.clientY, pointerType: 'touch' }, card);
  }, { passive: true });
  const touchOf = e => p && [...e.changedTouches].find(t => t.identifier === p.id);
  document.addEventListener('touchmove', e => { const t = touchOf(e); if (p?.live) e.preventDefault(); if (t) moveTo(t.clientX, t.clientY); }, { passive: false });
  document.addEventListener('touchend', e => { if (touchOf(e)) { if (p.live) e.preventDefault(); up(true); } }, { passive: false });
  document.addEventListener('touchcancel', e => { if (touchOf(e)) up(true); });   // iOS took the touch: keep the card where its slot is
  document.addEventListener('selectstart', e => { if (p) e.preventDefault(); });
  root.addEventListener('pointerdown', e => {   // mouse / pen only
    if (e.pointerType === 'touch') return;
    const card = e.target.closest('.ad-cols .ac'); if (!card || p || e.button > 0 || e.target.closest('button')) return; start(e, card);
  });
  document.addEventListener('pointermove', e => { if (p && e.pointerId === p.id && e.pointerType !== 'touch') moveTo(e.clientX, e.clientY); });
  ['pointerup', 'pointercancel'].forEach(t => document.addEventListener(t, e => { if (p && e.pointerId === p.id && e.pointerType !== 'touch') up(t === 'pointerup'); }));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && p?.live) { e.stopPropagation(); drop(false); } }, true);
  root.addEventListener('contextmenu', e => { if (e.target.closest('.ad-cols .ac')) e.preventDefault(); });
}

/* the details bottom sheet (Figma Assessment Animal added 1485:10627 …): animal header · a tab per assessment · range + graph/stats ·
   References · All Records · Add New. Sits on core .panel, restyled as a sheet. Records / graph / stats pieces are core's. */
function recRow2(m, r, newId) {
  const f = fmt(m, r), when = `${fDate(r.t)} • ${C.fTime(r.t)}`;
  const row = `<div class="rec2${r.id === newId ? ' is-new' : ''}" data-rec="${r.id}">
    <div class="rec2__date"><span class="t-subtext-title">${fDate(r.t)}</span><span class="t-subtext-regular">${C.fTime(r.t)}</span></div>
    <div class="rec2__card"><div class="rec2__top"><span class="t-body-medium">${esc(f.v)}${f.u ? ` ${esc(f.u)}` : ''}</span>${r.note ? ic('notes', 'var(--moderate-secondary)', 'app-icon--16') : ''}</div>
      ${r.note ? `<p class="t-subtext-regular">${esc(r.note)}</p>` : ''}
      <div class="rec2__by t-subtext-regular"><span>${esc(r.by)}</span><span>${when}</span></div></div></div>`;
  return `<div class="sw" data-lp="rec" data-v="${r.id}"><div class="sw__acts"><button class="sw__act sw__act--edit t-body-title" data-act="rec-edit" data-v="${r.id}">${ic('pencil', 'var(--on-primary)', 'app-icon--20')}Edit</button><button class="sw__act sw__act--del t-body-title" data-act="rec-del" data-v="${r.id}">${ic('delete', 'var(--on-primary)', 'app-icon--20')}Delete</button></div><div class="sw__row">${row}</div></div>`;
}
/* range control + summary at the top of the sheet (Figma 1566:2669): the headline number · 7d 30D 3M 6M Custom · the type's chart (charts.js) */
const DS_RANGES = [['W', '7d'], ['M', '30D'], ['3M', '3M'], ['6M', '6M']];
function dsSummary(m, list) {
  const w = DSC.win(), a0 = new Date(w.t0), a1 = new Date(w.t1 - 1), span = `${a0.getFullYear() === a1.getFullYear() ? fShort(a0) : fDate(a0)} - ${fDate(a1)}`;
  const seg = `<div class="app-segmented ds-seg" data-seg="ds-range">${DS_RANGES.map(([k, l]) => `<button class="app-segment t-body-regular${k === H.range ? ' app-segment--active' : ''}" data-act="h-range" data-v="${k}">${l}</button>`).join('')}<button class="app-segment t-body-regular${H.range === 'C' ? ' app-segment--active' : ''}" data-act="ds-custom">Custom</button></div>`;
  const big = (v, u = '') => `<span class="ds-avg__v"><span class="t-large-title">${esc(String(v))}</span>${u ? `<span class="t-body-medium">${esc(u)}</span>` : ''}</span>`;
  const top = (k, v, sub = span) => `<div class="ds-sum__top"><div class="ds-avg"><span class="t-small">${k}</span>${v}<span class="t-body-regular">${sub}</span></div>${seg}</div>`;
  if (!list.length) return top('NO READINGS', big('–'), span) + `<div class="empty t-body-regular">Nothing recorded between ${span}.</div>`;
  const chart = DSC.chart(m, list, { w: $('app').clientWidth - 96 });   // sheet 810 − 24 × 2 section − 24 × 2 card = 714, drawn 1:1
  if (m.type === 'text') return top('LATEST NOTE', `<p class="ds-note t-minor-regular">“${esc(list[0].v)}”</p>`);
  if (m.type === 'list') { const c = {}; list.forEach(r => r.v.forEach(k => c[k] = (c[k] || 0) + 1)); const k = Object.keys(c).sort((p, q) => c[q] - c[p])[0]; return top('MOST FREQUENT', big(k, `${c[k]} of ${list.length}`)) + chart; }
  const avg = a => Math.round(a.reduce((t, v) => t + v, 0) / a.length * 10) / 10;
  if (m.type === 'slider' && m.range) return top('AVERAGE', big(`${avg(list.map(r => r.v[0]))} – ${avg(list.map(r => r.v[1]))}`, m.unit)) + chart;
  if (m.type === 'scale') return top('AVERAGE', big(avg(list.map(r => +r.v)), `/${Math.max(...m.scale.map(x => +x[0]))}`)) + chart;
  return top('AVERAGE', big(avg(list.map(r => numOf(m, r))), fmt(m, list[0]).u)) + chart;
}
/* Custom range: a From / To pick (library date fields .app-field) in a popover under the switch; Apply draws every part of the sheet for those days */
function customRange(anchor) {
  const iso = t => { const d = new Date(t); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
  const w = DSC.win(), max = iso(TODAY);
  C.popover(anchor, `<div class="ds-cr"><span class="t-body-title ds-cr__t">Custom range</span>
    <div class="ds-cr__f"><label class="app-field"><span class="app-field__label t-subtext-regular">From</span><input class="t-body-regular" type="date" data-cr="from" value="${iso(w.t0)}" max="${max}"></label>
      <label class="app-field"><span class="app-field__label t-subtext-regular">To</span><input class="t-body-regular" type="date" data-cr="to" value="${iso(w.t1 - DAY)}" max="${max}"></label></div>
    <div class="ds-cr__b"><button class="btn btn--revert t-body-medium" data-pick="cancel">Cancel</button><button class="btn btn--admit t-body-medium" data-pick="apply">Apply</button></div></div>`, k => {
    if (k !== 'apply') return;
    const pop = $('pop'), f = pop.querySelector('[data-cr=from]').value, to = pop.querySelector('[data-cr=to]').value;
    const t0 = new Date(`${f}T00:00`), t1 = new Date(`${to}T00:00`); t1.setDate(t1.getDate() + 1);
    if (!f || !to || t0 >= t1) { setTimeout(() => customRange(anchor), 0); toast('“From” has to be on or before “To”'); return; }
    H.custom = { t0: +t0, t1: +t1 }; H.range = 'C'; H.tip = null; drawDetSheet();
  });
  $('pop').querySelectorAll('.app-field').forEach(l => l.addEventListener('click', () => { try { l.querySelector('input').showPicker(); } catch (e) {} }));
}
function drawDetSheet() {
  const d = SP.det; if (!d?.m) return; const a = A(d.a), m = M(d.m), ms = animalMasters(a), all = recs(a.id, m.id), list = DSC.inWin(all);
  const el = $('panel'), prev = el.dataset.for === `det|${a.id}`, keep = el.querySelector('.ds-bd')?.scrollTop || 0, keepTabs = el.querySelector('.ds-tabs')?.scrollLeft || 0;
  const opening = !$('scrimPanel').classList.contains('on') || !el.classList.contains('panel--sheet');
  if (opening) el.style.transition = 'none';   // start from the hidden pose, so the sheet slides up from the bottom
  el.classList.remove('panel--narrow'); el.classList.add('panel--sheet'); $('scrimPanel').classList.add('scrim--bottom'); el.dataset.detent = 'large';
  const refs = m.refs?.length ? `<div class="ds-sec"><details class="ds-card ds-refs" open><summary class="t-minor-medium"><span>References</span>${ic('dropdown', 'var(--on-surface-variant)', 'app-icon--20', 'chev-u')}</summary>
      <div class="ds-refs__row">${m.refs.map((x, i) => `<button data-act="viewer" data-v="${m.id}" data-i="${i}" aria-label="${esc(x.name)}">${x.kind === 'img' ? `<img src="${x.src}" alt="">` : `<span class="doc">${ic('pdf', 'var(--tertiary)', 'app-icon--28')}</span>`}</button>`).join('')}</div>
      <button class="ds-refs__all t-body-medium" data-act="viewer" data-v="${m.id}" data-i="0">View All${ic('dropdown', 'var(--on-surface-variant)', 'app-icon--20', 'chev-r')}</button></details></div>` : '';
  /* src: Figma 1566:2625 — header = animal card (library .app-profile 82 + .pcard__content) · pill tabs · summary card · All Records on white · floating footer */
  el.innerHTML = `<div class="ds-hd" data-drag><div class="ds-hd__card"><span class="app-profile"><img class="photo" src="${a.img}" alt="">${C.badge(a)}</span>
      <div class="pcard__content"><span class="t-minor-title tag">${esc(a.tag)}</span><span class="t-body-medium">${esc(a.aid)}</span><span class="t-body-regular">${esc(a.species)}</span><span class="t-body-medium">Site: ${esc(a.site)}</span></div></div></div>
    <div class="ds-tabs"><button class="ds-tab ds-tab--icon" data-act="ad-soon" data-v="All assessments" aria-label="All assessments">${ic('list', 'var(--on-surface-variant)', 'app-icon--24')}</button>${ms.map(x => `<button class="ds-tab t-minor-medium${x.id === m.id ? ' ds-tab--on' : ''}" data-act="ad-m" data-v="${x.id}">${esc(x.name)}</button>`).join('')}</div>
    <div class="ds-bd">
      <div class="ds-sec"><div class="ds-card ds-sum">${dsSummary(m, list)}</div></div>
      ${refs}
      <div class="ds-recs"><span class="t-minor-medium ds-recs__hd">All Records</span>
        <div class="ds-recs__list">${list.length ? list.map(r => recRow2(m, r, SP.newId)).join('') : `<div class="empty t-body-regular">Nothing recorded in this period.</div>`}</div></div>
    </div>
    <div class="ds-ft"><button class="ds-ft__btn t-minor-title" data-act="ad-add" data-v="${m.id}">Add New ${esc(m.name)}</button></div>`;
  el.dataset.for = `det|${a.id}`;
  const key = `${a.id}|${m.id}|${H.range}`; el.classList.toggle('ds-anim', opening || el.dataset.key !== key); el.dataset.key = key;   // draw the chart / records in only when the content changed, not on a tap
  if (opening) { $('scrimPanel').classList.remove('on'); void el.offsetWidth; el.style.transition = ''; requestAnimationFrame(() => requestAnimationFrame(() => $('scrimPanel').classList.add('on'))); } else $('scrimPanel').classList.add('on');
  const bd = el.querySelector('.ds-bd'); if (prev) { bd.scrollTop = keep; el.querySelector('.ds-tabs').scrollLeft = keepTabs; }
  const tabs = el.querySelector('.ds-tabs'), on = tabs.querySelector('.ds-tab--on');   // scroll only the strip: scrollIntoView ran while the sheet was still below the screen and scrolled #app up (the page jumped as the sheet opened)
  if (on && !prev) tabs.scrollLeft = on.offsetLeft - (tabs.clientWidth - on.offsetWidth) / 2; else if (on) tabs.scrollTo({ left: on.offsetLeft - (tabs.clientWidth - on.offsetWidth) / 2, behavior: 'smooth' });
  T.segments(el);
}
const detSheetOpen = () => SP.det?.m && $('scrimPanel').classList.contains('on') && $('panel').dataset.for?.startsWith('det|');
function refreshDet() { if (detSheetOpen()) drawDetSheet(); render(); }

/* ------------------------------------------------------------------ animal panel (Figma User flow; rows now open the Animal page instead) */
function openPanel(aId, mId) {
  const a = A(aId), ms = animalMasters(a);
  const m = M(mId) || (SP.sub !== 'Population' && SP.sub !== 'Alerts' && curType() && ms.includes(curType()) ? curType() : null) || dueTypes(a)[0] || ms[0];
  SP.pn = { a: a.id, m: m.id }; H.tip = null; drawPanel(); render();
}
function drawPanel() {
  if (!SP.pn) return; const a = A(SP.pn.a), m = M(SP.pn.m), ms = animalMasters(a), due = dueTypes(a), last = recs(a.id, m.id)[0];
  $('panel').classList.remove('panel--narrow', 'panel--sheet'); $('scrimPanel').classList.remove('scrim--bottom');
  const keep = $('panel').querySelector('.panel__bd')?.scrollTop || 0, same = $('panel').dataset.for === `${a.id}|${m.id}`;
  panel(`<div class="ahead">${thumb(a, 64)}<div><span class="t-minor-title navy">${esc(a.tag)}</span><span class="t-body-regular">${esc(a.species)} · ${esc(a.aid)}</span><span class="t-subtext-regular muted">Site: ${esc(a.site)} · Encl: ${esc(a.encl)}</span></div>${due.length ? `<span class="pill pill--due t-subtext-title">${due.length} due</span>` : `<span class="pill pill--done t-subtext-title">All done</span>`}<button class="x" data-pn="close" aria-label="Close">${ic('close')}</button></div>
    <div class="atabs" data-keep-scroll-x="atabs">${ms.map(x => `<button class="fchip t-body-medium${x.id === m.id ? ' on' : ''}" data-act="pn-type" data-v="${x.id}">${esc(x.name)}${!doneThisWeek(a, x) ? '<span class="due"></span>' : ''}</button>`).join('')}</div>
    <div class="panel__bd hist">${historyHTML(a, m, { newId: SP.newId, swipe: true })}</div>
    <div class="pfoot">${last && m.type !== 'text' ? `<button class="bigbtn bigbtn--ghost t-body-medium" data-act="pn-same" style="flex:0 0 auto">${ic('reset', 'var(--on-primary-container)', 'app-icon--16')}Same as last</button>` : ''}<button class="bigbtn bigbtn--primary t-body-medium" data-act="pn-add">${ic('plus', 'var(--on-primary)', 'app-icon--20')}Add ${esc(m.name)} Entry</button></div>`);
  $('panel').dataset.for = `${a.id}|${m.id}`;
  if (same) $('panel').querySelector('.panel__bd').scrollTop = keep;
  T.segments($('panel'));
  { const on = $('panel').querySelector('.atabs .fchip.on'), tr = on?.parentElement; if (on && (on.offsetLeft < tr.scrollLeft || on.offsetLeft + on.offsetWidth > tr.scrollLeft + tr.clientWidth)) tr.scrollLeft = on.offsetLeft - 20; }
}
function drawer() {
  $('panel').classList.add('panel--narrow'); $('panel').dataset.for = '';
  const list = TABS.filter(([, l]) => !SP.tabq || l.toLowerCase().includes(SP.tabq.toLowerCase()));
  panel(`<div class="panel__hd"><div class="ttl"><span class="t-medium-medium ink">All Tabs</span><span class="t-small muted">TABS ${TABS.length}</span></div><button class="x" data-pn="close" aria-label="Close">${ic('close')}</button></div>
    <div style="padding:var(--sp-12) var(--sp-20)"><label class="tab-search" style="background:var(--background);border-color:transparent">${ic('search', 'var(--on-surface-variant)', 'app-icon--20')}<input class="t-body-regular" data-tabq value="${esc(SP.tabq)}" placeholder="Search tabs…" style="border:0;outline:0;flex:1;min-width:0;background:transparent"></label></div>
    <div class="panel__bd drawer-list" style="padding:0;gap:0"><div class="dlist">${list.map(([i, l]) => `<button class="${l === SP.tab ? 'on' : ''}" data-act="sp-tab" data-v="${l}"><span class="ico">${ic(i, 'var(--on-primary-container)', 'app-icon--20')}</span><span class="grow t-body-title">${l}</span>${l === SP.tab ? ic('approved', 'var(--primary-main)') : ''}</button>`).join('') || `<div class="empty t-body-regular">No tabs match.</div>`}</div></div>`);
  const inp = $('panel').querySelector('[data-tabq]'); inp.oninput = () => { SP.tabq = inp.value; const pos = inp.selectionStart; drawer(); const n = $('panel').querySelector('[data-tabq]'); n.focus(); n.setSelectionRange(pos, pos); };
}

/* ------------------------------------------------------------------ actions */
function addEntry(aId, mId) {
  const a = A(aId), m = M(mId);
  entrySheet(a, m, rec => { SP.newId = rec.id; SP.flash = a.id; SP.flashM = m.id; if (SP.pn?.a === a.id) { SP.pn.m = m.id; drawPanel(); } if (detSheetOpen()) { SP.det.m = m.id; drawDetSheet(); } render(); setTimeout(() => { SP.flash = null; SP.flashM = null; SP.newId = null; }, 2400); });
}
const typeFor = (aId, el) => el?.dataset.m || (SP.det?.m || null) || (SP.sub !== 'Population' && SP.sub !== 'Alerts' ? curType()?.id : dueTypes(A(aId))[0]?.id) || animalMasters(A(aId))[0].id;
function delRec(id) {
  const a = A(SP.det?.a || SP.pn.a); for (const m of animalMasters(a)) { const r = recs(a.id, m.id).find(x => x.id === id); if (r) { removeRecord(a, m, r); T.haptic(12); drawPanel(); refreshDet(); toast('Entry deleted', () => { recs(a.id, m.id).push(r); recs(a.id, m.id).sort((p, q) => q.t - p.t); save(); drawPanel(); refreshDet(); toast('Entry restored'); }); return; } }
}
function recById(id) { const a = A(SP.det?.a || SP.pn?.a); if (!a) return null; for (const m of animalMasters(a)) { const r = recs(a.id, m.id).find(x => x.id === id); if (r) return { a, m, r }; } return null; }
function onLongPress(el, x, y) {
  const kind = el.dataset.lp;
  const ctx = (head, items, pick) => { const app = $('app').getBoundingClientRect(); popover({ getBoundingClientRect: () => ({ left: x, right: x + 260, top: y, bottom: y }) }, `<div class="pop__head">${head}</div>` + popItems(items), pick); const p = $('pop'); p.classList.add('ctx'); };
  if (kind === 'arow') { const a = A(el.dataset.v), mId = typeFor(a.id, el), m = M(mId), last = recs(a.id, mId)[0];
    ctx(`${thumb(a, 36)}<span style="display:flex;flex-direction:column"><span class="t-body-title navy">${esc(a.tag)}</span><span class="t-subtext-regular muted">${esc(m.name)} · ${last ? `${esc(fmt(m, last).v)} ${esc(fmt(m, last).u)} · ${ago(last.t)}` : 'not recorded'}</span></span>`,
      [['add', `Add ${m.name} entry`, 'plus'], ...(last && m.type !== 'text' ? [['same', 'Record same as last', 'reset']] : []), ['open', 'Open animal details', 'time']],
      k => { if (k === 'add') addEntry(a.id, mId); if (k === 'open') openDetail(a.id); if (k === 'same') sameAsLast(a.id, mId); }); }
  if (kind === 'rec') { const f = recById(el.dataset.v); if (!f) return; ctx(`<span style="display:flex;flex-direction:column"><span class="t-body-title navy">${esc(fmt(f.m, f.r).v)} ${esc(fmt(f.m, f.r).u)}</span><span class="t-subtext-regular muted">${esc(f.m.name)} · ${fDate(f.r.t)}</span></span>`, [['edit', 'Edit', 'pencil'], ['del', 'Delete', 'delete', 'pop__item--danger']], k => { if (k === 'edit') entrySheet(f.a, f.m, rec => { SP.newId = rec.id; drawPanel(); refreshDet(); }, f.r); if (k === 'del') delRec(f.r.id); }); }
  if (kind === 'type') C.mastersClick('m-more', el);
}
function sameAsLast(aId, mId) {
  const a = A(aId), m = M(mId), last = recs(a.id, m.id)[0]; if (!last) return;
  const rec = C.addRecord(a, m, { v: JSON.parse(JSON.stringify(last.v)), unit: last.unit, t: new Date(TODAY) }); SP.flash = a.id; SP.flashM = m.id; SP.newId = rec.id; T.haptic(12);
  if (SP.pn?.a === a.id) drawPanel(); refreshDet();
  toast(`${m.name} recorded · ${fmt(m, rec).v} ${fmt(m, rec).u}`, () => { removeRecord(a, m, rec); if (SP.pn) drawPanel(); refreshDet(); toast('Entry removed'); });
  setTimeout(() => { SP.flash = null; SP.flashM = null; SP.newId = null; }, 2400);
}
function click(act, t) {
  const v = t.dataset.v;
  switch (act) {
    case 'sp-tab': SP.tab = v; if (SP.drawer || $('panel').classList.contains('panel--narrow')) closePanel(); render(); centerTab(); return true;
    case 'sp-drawer': SP.tabq = ''; drawer(); return true;
    case 'sp-sub': SP.sub = v; SP.kpi = null; SP.sort = { key: v === 'Population' ? 'name' : 'change', dir: v === 'Population' ? 1 : -1 }; render(); return true;
    case 'sp-type': SP.type[SP.sub] = v; SP.kpi = null; SP.sort = { key: isNumeric(M(v)) ? 'change' : 'due', dir: -1 }; render(); return true;
    case 'sp-kpi': SP.kpi = SP.kpi === v ? null : v; render(); return true;
    case 'sp-sort': SP.sort = SP.sort.key === v ? { key: v, dir: -SP.sort.dir } : { key: v, dir: v === 'name' ? 1 : -1 }; render(); return true;
    case 'sp-site': popover(t, `<span class="pop__title t-subtext-title">Site</span>` + popItems(['All sites', ...new Set(ANIMALS.map(a => a.site))].map(s => [s, s]), SP.site), s => { SP.site = s; render(); }); return true;
    case 'sp-alert': SP.alert = v; render(); return true;
    case 'sp-open': openDetail(v); return true;   // an animal (row, Top / Bottom link) opens its Animal Details page — no sheet on top
    case 'ad-back': closeDetail(); return true;
    case 'ad-step': { const o = detOrder(), j = o.findIndex(x => x.id === SP.det.a) + +v; if (o[j]) { const m = SP.det.m && animalMasters(o[j]).some(x => x.id === SP.det.m) ? SP.det.m : null; SP.det = { ...SP.det, a: o[j].id, m: null, top: true }; H.tip = null; closePanel(); render(); toast(`${o[j].tag}`); } return true; }
    case 'ad-tab': setDet({ tab: v }); return true;
    case 'ad-f': setDet({ f: v }); return true;
    case 'ad-sq': setDet({ sq: !SP.det.sq, q: SP.det.sq ? '' : SP.det.q }); setTimeout(() => document.querySelector('[data-in=adq]')?.focus(), 0); return true;
    case 'ad-m': openDetSheet(v); return true;
    case 'ds-custom': customRange(t); return true;
    case 'ad-soon': toast(`${v} isn’t part of this prototype`); return true;
    case 'ad-add': addEntry(SP.det.a, v); return true;
    case 'ad-same': sameAsLast(SP.det.a, v); return true;
    case 'ad-addpick': SP.pick = { q: '', f: 'all', add: [], rem: [], open: false, anim: 'page' }; H.tip = null; render(); return true;
    case 'pk-close': SP.pick = null; render(); return true;
    case 'pk-f': SP.pick.f = v; SP.pick.anim = 'list'; render(); document.querySelector('.pk-list')?.scrollTo(0, 0); return true;
    case 'pk-tog': { const p = SP.pick, had = animalMasters(A(SP.det.a)).some(x => x.id === v), l = had ? p.rem : p.add, i = l.indexOf(v); i > -1 ? l.splice(i, 1) : l.push(v); p.pop = v; if (!p.add.length && !p.rem.length) p.open = false; T.haptic(); render(); return true; }
    case 'pk-tray': SP.pick.open = !SP.pick.open; SP.pick.trayIn = SP.pick.open; render(); return true;
    case 'pk-save': pkSave(); return true;
    case 'sp-add': addEntry(v, typeFor(v, t)); return true;
    case 'sp-settings': S.view = 'masters'; render(); return true;
    case 'sp-menu': toast('App menu (modules) isn’t part of this prototype'); return true;
    case 'sp-species': toast('The species list isn’t part of this prototype'); return true;
    case 'sp-logout': toast('Sign out is disabled in the prototype'); return true;
    case 'pn-type': SP.pn.m = v; H.tip = null; drawPanel(); return true;
    case 'pn-add': addEntry(SP.pn.a, SP.pn.m); return true;
    case 'pn-same': sameAsLast(SP.pn.a, SP.pn.m); return true;
    case 'rec-edit': { const f = recById(v); if (f) entrySheet(f.a, f.m, rec => { SP.newId = rec.id; drawPanel(); refreshDet(); }, f.r); return true; }
    case 'rec-del': delRec(v); return true;
  }
  return false;
}

/* ------------------------------------------------------------------ keyboard */
function shortcut(e) {
  const typing = e.target.matches('input, textarea, select'), meta = e.metaKey || e.ctrlKey, pnOpen = $('scrimPanel').classList.contains('on');
  if (S.view !== 'animals' || $('scrimSheet').classList.contains('on') || !$('pop').hidden) return false;   // C.SH is copied once by Object.assign, so read the sheet from the DOM
  if ((meta && e.key.toLowerCase() === 'f') || (!typing && e.key === '/')) { const s = $('view').querySelector('[data-in=sq]'); if (s) { s.focus(); return true; } }
  if (typing) return false;
  if (SP.det) {
    if (e.key === 'Escape') { if (pnOpen) { SP.det.m = null; markCard(null); return false; } closeDetail(); return true; }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { click('ad-step', { dataset: { v: e.key === 'ArrowLeft' ? '-1' : '1' } }); return true; }
    if (e.key === 'n' && SP.det.m) { addEntry(SP.det.a, SP.det.m); return true; }
    if (e.key === '[' || e.key === ']') { const fs = [...$('view').querySelectorAll('.ad-chips [data-act=ad-f]')].map(b => b.dataset.v), k = fs.indexOf(SP.det.f), j = Math.max(0, Math.min(fs.length - 1, k + (e.key === ']' ? 1 : -1))); if (fs.length && fs[j] !== SP.det.f) setDet({ f: fs[j] }); return true; }
    return false;
  }
  if (e.key === 'n' && pnOpen && SP.pn && !$('panel').classList.contains('panel--narrow')) { addEntry(SP.pn.a, SP.pn.m); return true; }
  if (e.key === '[' || e.key === ']') { const subs = [...$('view').querySelectorAll('[data-act=sp-sub]')].map(b => b.dataset.v), i = subs.indexOf(SP.sub), j = Math.max(0, Math.min(subs.length - 1, i + (e.key === ']' ? 1 : -1))); if (subs[j] !== SP.sub) click('sp-sub', { dataset: { v: subs[j] } }); return true; }
  if (e.key === ',' && meta) { click('sp-settings', {}); return true; }
  return false;
}

/* ------------------------------------------------------------------ register + wire */
C.animals = {
  render: renderSpecies, click, hideNav: () => true,
  input: (k, val) => { if (k === 'sq') SP.q = val; if (k === 'adq' && SP.det) SP.det.q = val; if (k === 'pq' && SP.pick) SP.pick.q = val; },
  historyChanged: () => { if (detSheetOpen()) drawDetSheet(); else if (SP.det) render(); else if (SP.pn && $('scrimPanel').classList.contains('on') && !$('panel').classList.contains('panel--narrow')) drawPanel(); else render(); },
  after: () => {
    const sc = $('view').querySelector('.sp-scroll'), st = $('view').querySelector('.sp-sticky, .ad-sticky'), hero = $('view').querySelector('.hero, .ah2');
    if (sc && SP.det) { if (SP.det.top) sc.scrollTop = 0; else if (SP.det.snap && hero) sc.scrollTop = Math.min(sc.scrollTop, hero.offsetHeight); SP.det.top = SP.det.snap = SP.det.anim = false; }
    else if (sc && SP.spTop != null) { sc.scrollTop = SP.spTop; SP.spTop = null; }
    if (sc && st && hero) { const upd = () => st.classList.toggle('stuck', sc.scrollTop > hero.offsetHeight); sc.onscroll = upd; upd(); }
    $('view').querySelectorAll('[data-keep-scroll-x]').forEach(el => { const k = el.dataset.keepScrollX; if (C.animals._x?.[k] != null) el.scrollLeft = C.animals._x[k]; el.onscroll = () => { (C.animals._x ||= {})[k] = el.scrollLeft; }; });
  },
  start: (screen, arg, arg2) => {
    const [s, x, y, z] = decodeURIComponent(location.hash.slice(1)).split(':');
    if (s === 'alerts') { SP.sub = 'Alerts'; render(); }
    if (s === 'population') { SP.sub = 'Population'; render(); }
    if (s === 'behaviour') { SP.sub = 'Behaviour'; render(); }
    if (s === 'tab' && x) { SP.tab = x; render(); }
    if (s === 'drawer') drawer();
    if (s === 'animal') openDetail(A(x) ? x : 'a1', C.MN(y)?.id);
    if (s === 'animal' && z === 'add' && C.MN(y)) addEntry(A(x) ? x : 'a1', C.MN(y).id);   // deep link: the Add Entry sheet over the details sheet
    if (s === 'panel' || s === 'sheet') { const a = A(x) ? x : 'a2', m = C.MN(y); openPanel(a, m?.id); if (s === 'sheet') addEntry(a, SP.pn.m); }
    if (s === 'settings') { S.view = 'masters'; render(); }
    if (s === 'land') setOrient('land');
    if (s === 'scrolled') { const sc = $('view').querySelector('.sp-scroll'); sc.scrollTop = $('view').querySelector('.hero').offsetHeight + 12; sc.onscroll(); }
  },
};
C.shortcut = shortcut;
// scroll only the strip itself; scrollIntoView would also scroll every ancestor (the page shifted sideways)
function centerTab() { const on = $('view').querySelector('.sp-tab.on'), tr = on?.parentElement; if (tr) tr.scrollTo({ left: on.offsetLeft - (tr.clientWidth - on.offsetWidth) / 2, behavior: 'smooth' }); }
C.afterAny = () => { $('view').scrollLeft = 0; const sc = $('view').querySelector('.sp-scroll'); if (sc) sc.scrollLeft = 0; T.segments($('app')); $('view').querySelectorAll('[data-act=m-sel]').forEach(el => el.dataset.lp = 'type'); };
const view = $('view');
[view, $('panel')].forEach(el => { T.swipeRows(el); T.scrub(el); });
$('app').classList.add('is-boot'); setTimeout(() => $('app').classList.remove('is-boot'), 1400);   // the first screen rises in once, on launch
T.longPress($('app'), onLongPress);
cardDrag(view);
T.pullToRefresh(view, () => { SP.synced = 1; render(); toast('Up to date'); });
T.sheetDrag($('sheet'), closeSheet);
T.sheetDrag($('panel'), () => { $('scrimPanel').click(); setTimeout(() => { $('panel').style.transform = ''; }, 260); });
T.shortcutSheet($('app'), [['/  or  ⌘ F', 'Search animals'], ['[  ]', 'Previous / next sub-tab'], ['← →', 'Previous / next animal (details page)'], ['N', 'Add entry (details page, one assessment)'], ['⌘ ,', 'Assessment settings'], ['0 – 9 · ⌫ · Return', 'Number pad in the entry sheet'], ['Esc', 'Close sheet or menu · back from details']]);
$('scrimPanel').addEventListener('click', e => { if (e.target === $('scrimPanel') || e.target.closest('[data-pn=close]')) { SP.pn = null; if (SP.det) { SP.det.m = null; markCard(null); } else setTimeout(render, 0); } });

/* orientation (review bar outside the device) */
function setOrient(o) { $('app').classList.toggle('is-land', o === 'land'); document.querySelectorAll('[data-orient]').forEach(b => b.classList.toggle('on', b.dataset.orient === o)); try { localStorage.setItem('antz-v4-orient', o); } catch (e) {} setTimeout(render, 360); }
document.querySelectorAll('[data-orient]').forEach(b => b.onclick = () => setOrient(b.dataset.orient));
document.querySelector('[data-reset]')?.addEventListener('click', () => { C.reset(); SP.pn = null; closePanel(); render(); toast('Demo data reset'); });
try { if (localStorage.getItem('antz-v4-orient') === 'land') setOrient('land'); } catch (e) {}
C.boot();
})();
