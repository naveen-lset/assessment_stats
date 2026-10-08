/* Version B · Workspace — review first, then record.
   Screen 1: animals as cards (what's due is visible before you open one).
   Screen 2: one animal's workspace: its assessments on the left, the selected one's graph + records on the right.
   Add Entry opens the compact bottom sheet. Best when the vet wants to look at trends before entering. */
'use strict';
(() => {
const { esc, ic, plural, ANIMALS, A, M, recs, animalMasters, doneThisWeek, dueOf, fmt, numOf, isNumeric, trend, trendHTML, ago,
  thumb, spark, historyHTML, entrySheet, popover, popItems, render, CATEGORIES, TYPE, badge } = C;
const SB = { screen: 'grid', q: '', filter: 'All', sel: null, m: null, cat: 'All', newId: null };

function renderB() { return SB.screen === 'grid' ? grid() : workspace(); }
function grid() {
  const q = SB.q.toLowerCase();
  const base = ANIMALS.filter(a => !q || `${a.tag} ${a.species} ${a.encl}`.toLowerCase().includes(q));
  const counts = { All: base.length, Due: base.filter(a => dueOf(a).length).length, Done: base.filter(a => !dueOf(a).length).length };
  const list = base.filter(a => SB.filter === 'All' || (SB.filter === 'Due') === !!dueOf(a).length);
  return `<header class="hdr"><div class="hdr__row">${ic('back', 'var(--on-secondary-container)')}
      <div class="hdr__title"><div class="hdr__title-row"><span class="t-major-title name">Assessments</span></div>
        <div class="hdr__sub t-body-medium"><span class="t-body-medium">Rescue &amp; Rehab Centre</span><span class="sep t-body-medium">|</span><span class="t-body-medium">${plural(ANIMALS.length, 'animal')}</span><span class="sep t-body-medium">|</span><span class="t-body-medium">Week of 23 Sep</span></div></div></div>
    <div class="hdr__tools"><label class="tab-search">${ic('search', 'var(--on-surface-variant)', 'app-icon--20')}<input class="t-body-medium" data-in="bq" value="${esc(SB.q)}" placeholder="Search animals by tag, species or enclosure"></label></div>
    <div class="hdr__tabs-wrap"><div class="tab-primary-tabs t-body-medium">${Object.keys(counts).map(k => `<button class="tab-primary t-body-medium${k === SB.filter ? ' tab-primary--active' : ''}" data-act="b-filter" data-v="${k}">${k === 'Due' ? 'Has due' : k === 'Done' ? 'All recorded' : 'All'} - ${counts[k]}</button>`).join('')}</div></div></header>
  <div class="canvas" style="overflow-y:auto" data-keep-scroll="grid">
    ${list.length ? `<div class="grid3">${list.map(card).join('')}</div>` : `<div class="card empty t-body-regular">No animals match.</div>`}
  </div>`;
}
function card(a) {
  const ms = animalMasters(a), due = dueOf(a), done = ms.length - due.length;
  return `<button class="card" data-act="b-open" data-v="${a.id}" style="display:flex;flex-direction:column;border:0;padding:0;overflow:hidden;text-align:left;cursor:pointer;color:inherit">
    <span style="position:relative;display:flex;align-items:center;justify-content:center;height:132px;background:var(--displaybg-primary)"><img src="${a.img}" alt="" style="${a.small ? 'width:88px;height:88px;border-radius:50%' : 'width:100%;height:100%'};object-fit:cover;display:block"><span style="position:absolute;left:8px;top:8px">${badge(a)}</span></span>
    <span style="display:flex;flex-direction:column;gap:var(--sp-8);padding:var(--sp-12) var(--sp-16) var(--sp-16)">
      <span style="display:flex;flex-direction:column;gap:2px"><span class="t-body-title navy ellipsis">${esc(a.tag)}</span><span class="t-subtext-regular muted ellipsis">${esc(a.species)} · ${esc(a.encl)}</span></span>
      <span class="progress"><span class="progress__bar"><i style="width:${ms.length ? done / ms.length * 100 : 0}%"></i></span><span class="t-small muted">${done}/${ms.length}</span></span>
      <span class="t-subtext-regular ${due.length ? 'warn' : 'ok'} ellipsis">${due.length ? `Due: ${due.slice(0, 2).map(m => m.name).join(', ')}${due.length > 2 ? ` +${due.length - 2}` : ''}` : 'All recorded this week'}</span>
    </span></button>`;
}
function workspace() {
  const a = A(SB.sel), all = animalMasters(a);
  const ms = all.filter(m => SB.cat === 'All' || m.cat === SB.cat);
  if (!ms.some(m => m.id === SB.m)) SB.m = (ms.find(m => !doneThisWeek(a, m)) || ms[0])?.id;
  const m = M(SB.m), cats = ['All', ...CATEGORIES].filter(c => c === 'All' || all.some(x => x.cat === c));
  const due = dueOf(a).length;
  return `<header class="hdr"><div class="hdr__row"><button class="hdr__back" data-act="b-back" aria-label="All animals">${ic('back', 'var(--on-secondary-container)')}</button>
      <span class="hdr__logo">${thumb(a, 40)}</span>
      <div class="hdr__title"><button class="hdr__title-row" data-act="b-switch" aria-label="Switch animal" style="border:0;background:none;padding:0;cursor:pointer"><span class="t-major-title name">${esc(a.tag)}</span>${ic('dropdown', 'var(--on-secondary-container)', 'app-icon--20')}</button>
        <div class="hdr__sub t-body-medium"><span class="t-body-medium">${esc(a.species)}</span><span class="sep t-body-medium">|</span><span class="t-body-medium">${esc(a.site)}</span><span class="sep t-body-medium">|</span><span class="t-body-medium">${esc(a.encl)}</span></div></div>
      <div class="hdr__end"><span class="pill ${due ? 'pill--due' : 'pill--done'} t-subtext-title">${due ? `${due} due` : 'All recorded'}</span></div></div>
    <div class="hdr__tabs-wrap"><div class="tab-primary-tabs t-body-medium">${cats.map(c => `<button class="tab-primary t-body-medium${c === SB.cat ? ' tab-primary--active' : ''}" data-act="b-cat" data-v="${c}">${c} - ${all.filter(x => c === 'All' || x.cat === c).length}</button>`).join('')}</div></div></header>
  <div class="canvas"><div class="split">
    <section class="card pane pane--list"><div class="pane__hd"><span class="t-minor-medium">${plural(ms.length, 'Assessment')}</span></div>
      <div class="pane__bd" data-keep-scroll="blist">${ms.map(x => { const l = recs(a.id, x.id), f = l[0] ? fmt(x, l[0]) : null, dn = doneThisWeek(a, x);
        return `<button class="lrow${x.id === SB.m ? ' on' : ''}" data-act="b-m" data-v="${x.id}"><span class="dot ${dn ? 'dot--done' : 'dot--due'}"></span><span class="body"><span class="t-body-title navy ellipsis">${esc(x.name)}</span><span class="t-subtext-regular muted ellipsis">${f ? `${esc(f.v)}${f.u ? ' ' + esc(f.u) : ''} · ${ago(l[0].t)}` : 'Not recorded yet'}</span></span>${trendHTML(trend(x, l))}</button>`; }).join('')}</div></section>
    <section class="card pane pane--main">${m ? `<div class="pane__hd"><div class="ttl"><span class="t-minor-medium ellipsis">${esc(m.name)}</span><span class="t-subtext-regular muted ellipsis">${esc(m.cat)} · ${TYPE(m.type).label}${m.desc ? ` · ${esc(m.desc)}` : ''}</span></div>
        <button class="btn btn--admit t-body-medium" data-act="b-add" data-v="${m.id}">${ic('plus', 'var(--on-primary)', 'app-icon--20')}Add Entry</button></div>
      <div class="pane__bd" data-keep-scroll="bhist">${historyHTML(a, m, { newId: SB.newId })}</div>` : `<div class="empty t-body-regular">No assessments in this category.</div>`}</section>
  </div></div>`;
}
function click(act, t) {
  const v = t.dataset.v;
  switch (act) {
    case 'b-filter': SB.filter = v; render(); return true;
    case 'b-open': SB.sel = v; SB.screen = 'animal'; SB.m = null; SB.cat = 'All'; render(); return true;
    case 'b-back': SB.screen = 'grid'; render(); return true;
    case 'b-cat': SB.cat = v; render(); return true;
    case 'b-m': SB.m = v; SB.newId = null; C.H.tip = null; render(); return true;
    case 'b-add': entrySheet(A(SB.sel), M(v), rec => { SB.newId = rec.id; if (C.TODAY - rec.t > C.RANGES[C.H.range] * 86400000) C.H.range = '6M'; render(); }); return true;
    case 'b-switch': popover(t, `<span class="pop__title t-subtext-title">Switch animal</span>` + ANIMALS.map(x => `<button class="pop__item t-body-regular" data-pick="${x.id}">${thumb(x, 32)}<span style="display:flex;flex-direction:column"><span class="t-body-title">${esc(x.tag)}</span><span class="t-subtext-regular muted">${esc(x.species)} · ${dueOf(x).length} due</span></span></button>`).join(''), id => { SB.sel = id; SB.m = null; render(); }); return true;
  }
  return false;
}
C.animals = {
  render: renderB, click, input: (k, val) => { if (k === 'bq') SB.q = val; },
  start: (screen, arg) => { if (screen === 'animal' || screen === 'sheet') { SB.sel = 'a1'; SB.screen = 'animal'; if (C.MN(arg)) SB.m = C.MN(arg).id; render(); if (screen === 'sheet' && C.MN(arg)) click('b-add', { dataset: { v: C.MN(arg).id } }); } },
};
C.boot();
})();
