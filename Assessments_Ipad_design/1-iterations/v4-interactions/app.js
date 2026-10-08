/* Assessments · iPad v4 — Animals section + wiring of the tablet interaction layer (touch.js) onto the core.
   Flow (as v2): animals list │ the animal's assessments → push → one assessment's history → Add / Edit entry sheet.
   Tablet behaviour: tap · swipe a row (Add / History, or Edit / Delete on a record) · long-press for a context menu ·
   swipe from the pane's left edge to go back · pull the animal list to refresh · drag across a graph to read values ·
   drag the sheet down to dismiss, up to expand · number pad in the sheet · collapsible list pane · portrait / landscape ·
   hardware keyboard shortcuts (hold ⌘ to see them). */
'use strict';
(() => {
const { $, esc, ic, plural, ANIMALS, A, M, S, recs, animalMasters, doneThisWeek, dueOf, addRecord, removeRecord, fmt, numOf, isNumeric, trend, trendHTML, ago,
  TODAY, thumb, ring, spark, historyHTML, entrySheet, closeSheet, popover, popItems, closePop, toast, render, CATEGORIES, TYPE, H, RANGES, RANGE_LABEL, save } = C;
const SV = { sel: 'a1', q: '', cat: 'All', view: 'overview', m: null, dir: '', collapsed: false, synced: 2, newId: null, flash: null };

/* ------------------------------------------------------------------ render */
function renderAnimals() {
  const q = SV.q.toLowerCase(), list = ANIMALS.filter(a => !q || `${a.tag} ${a.species} ${a.encl}`.toLowerCase().includes(q));
  if (!list.some(a => a.id === SV.sel) && list[0]) SV.sel = list[0].id;
  const a = A(SV.sel), all = a ? animalMasters(a) : [];
  const cats = ['All', ...CATEGORIES].filter(c => c === 'All' || all.some(m => m.cat === c));
  if (!cats.includes(SV.cat)) SV.cat = 'All';
  const dueTotal = ANIMALS.reduce((s, x) => s + dueOf(x).length, 0);
  const dir = SV.dir; SV.dir = '';
  return `<header class="hdr"><div class="hdr__row">${ic('back', 'var(--on-secondary-container)')}
      <div class="hdr__title">${SV.collapsed && a
        ? `<button class="hdr__title-row" data-act="a-switch" style="border:0;background:none;padding:0;cursor:pointer" aria-label="Switch animal"><span class="t-major-title name">${esc(a.tag)}</span>${ic('dropdown', 'var(--on-secondary-container)', 'app-icon--20')}</button>`
        : `<div class="hdr__title-row"><span class="t-major-title name">Assessments</span></div>`}
        <div class="hdr__sub t-body-medium"><span class="t-body-medium">Rescue &amp; Rehab Centre</span><span class="sep t-body-medium">|</span><span class="t-body-medium">${plural(ANIMALS.length, 'animal')}</span><span class="sep t-body-medium">|</span><span class="t-body-medium">${dueTotal} due this week</span></div></div>
      <div class="hdr__end"><button class="tab-iconbox${SV.collapsed ? '' : ' is-on'}" data-act="a-side" aria-label="${SV.collapsed ? 'Show' : 'Hide'} animal list" aria-pressed="${!SV.collapsed}">${ic('list', SV.collapsed ? 'var(--on-surface-variant)' : 'var(--on-primary)')}</button></div></div>
    <div class="hdr__tools"><label class="tab-search">${ic('search', 'var(--on-surface-variant)', 'app-icon--20')}<input class="t-body-medium" data-in="aq" value="${esc(SV.q)}" placeholder="Search animals by tag, species or enclosure" enterkeyhint="search"></label>
      <button class="tab-date" data-act="a-range" aria-label="Period"><span class="value t-body-medium">${RANGE_LABEL[H.range]}</span><span class="well">${ic('calendar')}</span></button></div>
    <div class="hdr__tabs-wrap"><div class="tab-primary-tabs t-body-medium">${cats.map(c => `<button class="tab-primary t-body-medium${c === SV.cat ? ' tab-primary--active' : ''}" data-act="a-cat" data-v="${c}">${c} - ${all.filter(m => c === 'All' || m.cat === c).length}</button>`).join('')}</div></div></header>
  <div class="canvas"><div class="split${SV.collapsed ? ' is-collapsed' : ''}">
    <section class="card pane pane--list" aria-label="Animals"><div class="pane__hd"><div class="ttl"><span class="t-minor-medium">${plural(list.length, 'Animal')}</span><span class="t-small muted">${SV.synced ? `Synced ${SV.synced} min ago` : 'Synced just now'}</span></div></div>
      <div class="ptr" aria-hidden="true"><span class="spinner"></span><span class="t-subtext-regular"><span class="when-pull">Pull to refresh</span><span class="when-ready">Release to refresh</span></span></div>
      <div class="pane__bd" data-ptr data-keep-scroll="animals">${list.map(x => { const ms = animalMasters(x), dn = ms.filter(m => doneThisWeek(x, m)).length;
        return `<button class="lrow${x.id === SV.sel ? ' on' : ''}" data-act="a-sel" data-v="${x.id}" data-lp="animal" aria-current="${x.id === SV.sel}">${thumb(x)}<span class="body"><span class="t-body-title navy ellipsis">${esc(x.tag)}</span><span class="t-subtext-regular muted ellipsis">${esc(x.species)} · ${esc(x.encl)}</span></span>${ring(dn, ms.length)}</button>`; }).join('') || `<div class="empty t-body-regular">No animals match “${esc(SV.q)}”.</div>`}</div></section>
    <section class="card pane pane--main"><div class="stack ${dir}">${a ? (SV.view === 'history' && M(SV.m) ? history(a, M(SV.m)) : overview(a, all)) : ''}</div></section>
  </div></div>`;
}
function overview(a, all) {
  const ms = all.filter(m => SV.cat === 'All' || m.cat === SV.cat), done = all.filter(m => doneThisWeek(a, m)).length;
  const groups = (SV.cat === 'All' ? CATEGORIES : [SV.cat]).filter(c => ms.some(m => m.cat === c));
  return `<div class="pane__hd">${thumb(a, 44)}<div class="ttl"><span class="t-minor-medium ellipsis">${esc(a.tag)}</span><span class="t-subtext-regular muted ellipsis">${esc(a.species)} · ${esc(a.site)} · ${esc(a.encl)}</span></div>
      <div style="width:140px;display:flex;flex-direction:column;gap:var(--sp-4)"><span class="t-subtext-title ${done < all.length ? 'warn' : 'ok'}" style="text-align:right">${done < all.length ? `${all.length - done} due this week` : 'All recorded'}</span><span class="progress"><span class="progress__bar"><i style="width:${all.length ? done / all.length * 100 : 0}%"></i></span><span class="t-small muted">${done}/${all.length}</span></span></div></div>
    <div class="pane__bd" data-keep-scroll="ov-${a.id}">
      ${groups.map(c => `<div class="label t-subtext-title">${c}</div>${ms.filter(m => m.cat === c).map(m => arow(a, m)).join('')}`).join('')}
      <p class="t-subtext-regular muted" style="margin:0;padding:var(--sp-16);text-align:center">Tap to open · swipe left for quick actions · press and hold for more</p>
    </div>`;
}
function arow(a, m) {
  const list = recs(a.id, m.id), last = list[0], done = doneThisWeek(a, m), f = last ? fmt(m, last) : null;
  return `<div class="sw" data-lp="assess" data-v="${m.id}">
    <div class="sw__acts"><button class="sw__act sw__act--add t-body-title" data-act="a-add" data-v="${m.id}">${ic('plus', 'var(--on-primary)', 'app-icon--20')}Add</button><button class="sw__act sw__act--hist t-body-title" data-act="a-open" data-v="${m.id}">${ic('time', 'var(--on-primary)', 'app-icon--20')}History</button></div>
    <div class="sw__row"><button class="lrow${SV.flash === m.id ? ' is-flash' : ''}" data-act="a-open" data-v="${m.id}" style="min-height:68px">
      <span class="dot ${done ? 'dot--done' : 'dot--due'}" title="${done ? 'Recorded this week' : 'Due'}"></span>
      <span class="body"><span class="t-body-title navy">${esc(m.name)}</span><span class="t-subtext-regular muted">${TYPE(m.type).label} · ${last ? ago(last.t) : 'not recorded yet'}</span></span>
      ${last && isNumeric(m) ? `<span style="flex:0 0 auto">${spark(list.slice(0, 8).reverse().map(r => numOf(m, r)), 64, 24)}</span>` : ''}
      <span class="end" style="max-width:160px">${last ? `<span class="ink ellipsis" style="max-width:160px">${isNumeric(m) ? `<span class="t-minor-title">${esc(f.v)}</span> <span class="t-subtext-regular navy">${esc(f.u)}</span>` : `<span class="t-body-medium">${esc(f.v)}</span>`}</span>${trendHTML(trend(m, list))}` : `<span class="t-body-medium muted">—</span>`}</span>
      ${ic('dropdown', 'var(--outline)', 'app-icon--20', 'chev-r')}</button></div></div>`;
}
function history(a, m) {
  return `<div class="pane__hd"><button class="iconbtn iconbtn--plain" data-act="a-back" aria-label="Back to assessments">${ic('back', 'var(--on-primary-container)')}</button>
      <div class="ttl"><span class="t-minor-medium ellipsis">${esc(m.name)}</span><span class="t-subtext-regular muted ellipsis">${esc(a.tag)} · ${esc(m.cat)} · ${TYPE(m.type).label}</span></div>
      <button class="btn btn--admit t-body-medium" data-act="a-add" data-v="${m.id}">${ic('plus', 'var(--on-primary)', 'app-icon--20')}Add Entry</button></div>
    <div class="pane__bd" data-keep-scroll="h-${a.id}-${m.id}">${historyHTML(a, m, { newId: SV.newId, swipe: true })}
      <p class="t-subtext-regular muted" style="margin:0;padding:0 var(--sp-16) var(--sp-16);text-align:center">${isNumeric(m) ? 'Drag across the graph to read values · ' : ''}swipe a record to edit or delete · swipe from the left edge to go back</p></div>`;
}

/* ------------------------------------------------------------------ actions */
const cur = () => A(SV.sel);
function go(view, mId, dir) { SV.view = view; if (mId) SV.m = mId; SV.dir = dir; C.H.tip = null; render(); }
function addEntry(mId) {
  const a = cur(), m = M(mId);
  entrySheet(a, m, rec => { SV.newId = rec.id; SV.flash = m.id; if (TODAY - rec.t > RANGES[H.range] * 86400000) H.range = '6M'; render(); setTimeout(() => { SV.flash = null; SV.newId = null; }, 2400); });
}
function quickSame(mId) {   // long-press → "Same as last": one tap, no sheet
  const a = cur(), m = M(mId), last = recs(a.id, m.id)[0]; if (!last) return;
  const rec = addRecord(a, m, { v: JSON.parse(JSON.stringify(last.v)), unit: last.unit, t: new Date(TODAY) }); SV.flash = m.id; render(); T.haptic(12);
  toast(`${m.name} recorded · ${fmt(m, rec).v} ${fmt(m, rec).u}`, () => { removeRecord(a, m, rec); render(); toast('Entry removed'); });
  setTimeout(() => { SV.flash = null; }, 2400);
}
function findRec(id) { const a = cur(); for (const m of animalMasters(a)) { const r = recs(a.id, m.id).find(x => x.id === id); if (r) return { a, m, r }; } return null; }
function delRec(id) {
  const f = findRec(id); if (!f) return; removeRecord(f.a, f.m, f.r); T.haptic(12); render();
  toast(`Entry deleted`, () => { recs(f.a.id, f.m.id).push(f.r); recs(f.a.id, f.m.id).sort((p, q) => q.t - p.t); save(); render(); toast('Entry restored'); });
}
function ctx(x, y, head, items, onPick) {
  const app = $('app').getBoundingClientRect();
  const anchor = { getBoundingClientRect: () => ({ left: x, right: x + 260, top: y, bottom: y }) };
  popover(anchor, (head ? `<div class="pop__head">${head}</div>` : '') + popItems(items), onPick);
  const pop = $('pop'); pop.classList.add('ctx'); pop.style.transformOrigin = `${x - app.left - parseFloat(pop.style.left)}px 0`;
}
function onLongPress(el, x, y) {
  const kind = el.dataset.lp, v = el.dataset.v;
  if (kind === 'animal') { const a = A(v), due = dueOf(a); ctx(x, y, `${thumb(a, 36)}<span style="display:flex;flex-direction:column"><span class="t-body-title navy">${esc(a.tag)}</span><span class="t-subtext-regular muted">${esc(a.species)} · ${due.length} due</span></span>`,
      [['open', 'Open', 'dropdown'], ...(due.length ? [['due', `Add ${due[0].name}`, 'plus']] : [])], k => { SV.sel = v; if (k === 'open') go('overview', null, ''); if (k === 'due') { go('overview', null, ''); addEntry(due[0].id); } }); }
  if (kind === 'assess') { const a = cur(), m = M(v), last = recs(a.id, m.id)[0];
    ctx(x, y, `<span style="display:flex;flex-direction:column"><span class="t-body-title navy">${esc(m.name)}</span><span class="t-subtext-regular muted">${last ? `Last ${esc(fmt(m, last).v)} ${esc(fmt(m, last).u)} · ${ago(last.t)}` : 'Not recorded yet'}</span></span>`,
      [['add', 'Add entry', 'plus'], ...(last ? [['same', `Record same as last`, 'reset']] : []), ['hist', 'View history', 'time']], k => { if (k === 'add') addEntry(v); if (k === 'same') quickSame(v); if (k === 'hist') go('history', v, 'push'); }); }
  if (kind === 'rec') { const f = findRec(v); if (!f) return;
    ctx(x, y, `<span style="display:flex;flex-direction:column"><span class="t-body-title navy">${esc(fmt(f.m, f.r).v)} ${esc(fmt(f.m, f.r).u)}</span><span class="t-subtext-regular muted">${esc(f.m.name)} · ${C.fDate(f.r.t)}</span></span>`,
      [['edit', 'Edit', 'pencil'], ['del', 'Delete', 'delete', 'pop__item--danger']], k => { if (k === 'edit') entrySheet(f.a, f.m, rec => { SV.newId = rec.id; render(); }, f.r); if (k === 'del') delRec(v); }); }
  if (kind === 'type') C.mastersClick('m-more', el);
}
function click(act, t) {
  const v = t.dataset.v;
  switch (act) {
    case 'a-sel': if (SV.sel === v && SV.view === 'overview') return true; SV.sel = v; go('overview', null, SV.view === 'history' ? 'pop' : 'push'); return true;
    case 'a-open': go('history', v, 'push'); return true;
    case 'a-back': go('overview', null, 'pop'); return true;
    case 'a-add': addEntry(v); return true;
    case 'a-cat': SV.cat = v; if (SV.view === 'history' && M(SV.m)?.cat !== v && v !== 'All') SV.view = 'overview'; render(); return true;
    case 'a-side': SV.collapsed = !SV.collapsed; T.haptic(); render(); return true;
    case 'a-range': popover(t, `<span class="pop__title t-subtext-title">Show readings from</span>` + popItems(Object.keys(RANGES).map(k => [k, RANGE_LABEL[k]]), H.range), k => { H.range = k; render(); }); return true;
    case 'a-switch': popover(t, `<span class="pop__title t-subtext-title">Switch animal</span>` + ANIMALS.map(x => `<button class="pop__item t-body-regular" data-pick="${x.id}">${thumb(x, 32)}<span style="display:flex;flex-direction:column"><span class="t-body-title">${esc(x.tag)}</span><span class="t-subtext-regular muted">${esc(x.species)} · ${dueOf(x).length} due</span></span></button>`).join(''), id => { SV.sel = id; go('overview', null, 'push'); }); return true;
    case 'rec-edit': { const f = findRec(v); if (f) entrySheet(f.a, f.m, rec => { SV.newId = rec.id; render(); }, f.r); return true; }
    case 'rec-del': delRec(v); return true;
  }
  return false;
}

/* ------------------------------------------------------------------ keyboard (hardware keyboard on iPad) */
function shortcut(e) {
  const typing = e.target.matches('input, textarea, select'), meta = e.metaKey || e.ctrlKey;
  if (meta && e.key === '1') { S.tab = S.view = 'animals'; render(); return true; }
  if (meta && e.key === '2') { S.tab = S.view = 'masters'; render(); return true; }
  if (S.view !== 'animals' || C.SH || !$('pop').hidden) return false;
  if ((meta && e.key.toLowerCase() === 'f') || (!typing && e.key === '/')) { $('view').querySelector('[data-in=aq]')?.focus(); return true; }
  if (meta && e.key === '\\') { click('a-side', {}); return true; }
  if (typing) return false;
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { const ids = [...$('view').querySelectorAll('[data-act=a-sel]')].map(b => b.dataset.v), i = ids.indexOf(SV.sel), j = Math.max(0, Math.min(ids.length - 1, i + (e.key === 'ArrowDown' ? 1 : -1))); if (ids[j] && ids[j] !== SV.sel) { SV.sel = ids[j]; go('overview', null, ''); $('view').querySelector('.lrow.on')?.scrollIntoView({ block: 'nearest' }); } return true; }
  if ((e.key === 'ArrowLeft' || (meta && e.key === '[')) && SV.view === 'history') { go('overview', null, 'pop'); return true; }
  if (e.key === 'n' || (meta && e.key.toLowerCase() === 'n')) { if (SV.view === 'history') addEntry(SV.m); else { const d = dueOf(cur())[0]; if (d) addEntry(d.id); } return true; }
  return false;
}

/* ------------------------------------------------------------------ boot: register + wire the interaction layer */
C.animals = {
  render: renderAnimals, click, input: (k, val) => { if (k === 'aq') SV.q = val; },
  start: (screen, arg) => {
    if (screen === 'history' && C.MN(arg)) go('history', C.MN(arg).id, '');
    if (screen === 'sheet' && C.MN(arg)) addEntry(C.MN(arg).id);
    if (screen === 'collapsed') { SV.collapsed = true; render(); }
    if (screen === 'land') setOrient('land');
  },
};
C.shortcut = shortcut;
C.afterAny = () => {
  T.segments($('app'));
  $('view').querySelectorAll('[data-act=m-sel]').forEach(el => el.dataset.lp = 'type');   // masters rows get the context menu too
};
const view = $('view');
T.swipeRows(view); T.scrub(view); T.longPress($('app'), onLongPress);
T.edgeBack(view, '.pane--main', () => S.view === 'animals' && SV.view === 'history', () => go('overview', null, ''));
T.pullToRefresh(view, () => { SV.synced = 0; render(); toast('Up to date'); });
T.sheetDrag($('sheet'), closeSheet);
T.shortcutSheet($('app'), [['⌘ 1 / ⌘ 2', 'Animals / Assessment Masters'], ['⌘ F  or  /', 'Search animals'], ['↑ ↓', 'Previous / next animal'], ['N', 'Add entry (next due, or this assessment)'], ['← or ⌘ [', 'Back'], ['⌘ \\', 'Show / hide animal list'], ['0 – 9 · ⌫ · Return', 'Number pad in the entry sheet'], ['Esc', 'Close sheet or menu']]);

/* orientation (review bar outside the device; a real iPad follows the device) */
function setOrient(o) { $('app').classList.toggle('is-land', o === 'land'); document.querySelectorAll('[data-orient]').forEach(b => b.classList.toggle('on', b.dataset.orient === o)); try { localStorage.setItem('antz-v4-orient', o); } catch (e) {} setTimeout(render, 360); }
document.querySelectorAll('[data-orient]').forEach(b => b.onclick = () => setOrient(b.dataset.orient));
document.querySelector('[data-reset]')?.addEventListener('click', () => { C.reset(); render(); toast('Demo data reset'); });
try { if (localStorage.getItem('antz-v4-orient') === 'land') setOrient('land'); } catch (e) {}
C.boot();
})();
