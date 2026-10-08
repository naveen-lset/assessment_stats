/* Version A · Inline — record where you read.
   Animals on the left; the animal's assessments as rows on the right. Tap a row → it opens in place with the input,
   the last reading and Save. Saving closes it and opens the next assessment that is still due, so a vet can go down
   the list without leaving the screen. History opens in a side panel. */
'use strict';
(() => {
const { esc, ic, plural, ANIMALS, A, M, recs, animalMasters, doneThisWeek, dueOf, addRecord, removeRecord, fmt, numOf, isNumeric, trend, trendHTML,
  ago, fTime, fDate, isoDate, isoTime, TODAY, thumb, ring, spark, mountInput, readValue, lastText, defaultUnit, historyHTML, panel, closePanel, popover, popItems, toast, render, CATEGORIES, TYPE, refStrip } = C;
const SA = { sel: 'a1', q: '', cat: 'All', show: 'all', open: null, st: {}, note: '', noteOpen: false, date: null, time: null, saved: {}, histFor: null };

function openRow(mId) {
  const a = A(SA.sel), m = M(mId);
  SA.open = mId; SA.st = { defUnit: defaultUnit(a, m) }; SA.note = ''; SA.noteOpen = false; SA.date = isoDate(TODAY); SA.time = isoTime(TODAY); SA.focus = true;
}
function nextDue(a, afterId) {
  const ms = visible(a), i = ms.findIndex(m => m.id === afterId);
  return [...ms.slice(i + 1), ...ms.slice(0, Math.max(i, 0))].find(m => !doneThisWeek(a, m));
}
const visible = a => animalMasters(a).filter(m => (SA.cat === 'All' || m.cat === SA.cat) && (SA.show === 'all' || !doneThisWeek(a, m) || SA.saved[m.id]));

function renderA() {
  const q = SA.q.toLowerCase(), list = ANIMALS.filter(a => !q || `${a.tag} ${a.species} ${a.encl}`.toLowerCase().includes(q));
  if (!list.some(a => a.id === SA.sel) && list[0]) SA.sel = list[0].id;
  const a = A(SA.sel), all = a ? animalMasters(a) : [], done = all.filter(m => doneThisWeek(a, m)).length;
  const dueTotal = ANIMALS.reduce((s, x) => s + dueOf(x).length, 0);
  const cats = ['All', ...CATEGORIES].filter(c => c === 'All' || all.some(m => m.cat === c));
  return `<header class="hdr"><div class="hdr__row">${ic('back', 'var(--on-secondary-container)')}
      <div class="hdr__title"><div class="hdr__title-row"><span class="t-major-title name">Assessments</span></div>
        <div class="hdr__sub t-body-medium"><span class="t-body-medium">Rescue &amp; Rehab Centre</span><span class="sep t-body-medium">|</span><span class="t-body-medium">${plural(ANIMALS.length, 'animal')}</span><span class="sep t-body-medium">|</span><span class="t-body-medium">${dueTotal} due this week</span></div></div></div>
    <div class="hdr__tools"><label class="tab-search">${ic('search', 'var(--on-surface-variant)', 'app-icon--20')}<input class="t-body-medium" data-in="aq" value="${esc(SA.q)}" placeholder="Search animals by tag, species or enclosure"></label>
      <button class="tab-iconbox" data-act="a-show" aria-label="Show">${ic('filter-2', SA.show === 'due' ? 'var(--primary-main)' : 'var(--on-surface-variant)')}</button></div>
    <div class="hdr__tabs-wrap"><div class="tab-primary-tabs t-body-medium">${cats.map(c => `<button class="tab-primary t-body-medium${c === SA.cat ? ' tab-primary--active' : ''}" data-act="a-cat" data-v="${c}">${c} - ${all.filter(m => c === 'All' || m.cat === c).length}</button>`).join('')}</div></div></header>
  <div class="canvas"><div class="split">
    <section class="card pane pane--list"><div class="pane__hd"><span class="t-minor-medium">${plural(list.length, 'Animal')}</span></div>
      <div class="pane__bd" data-keep-scroll="animals">${list.map(x => { const ms = animalMasters(x), dn = ms.filter(m => doneThisWeek(x, m)).length;
        return `<button class="lrow${x.id === SA.sel ? ' on' : ''}" data-act="a-sel" data-v="${x.id}">${thumb(x)}<span class="body"><span class="t-body-title navy ellipsis">${esc(x.tag)}</span><span class="t-subtext-regular muted ellipsis">${esc(x.species)} · ${esc(x.encl)}</span></span>${ring(dn, ms.length)}</button>`; }).join('') || `<div class="empty t-body-regular">No animals match.</div>`}</div></section>
    <section class="card pane pane--main">${a ? main(a, all, done) : ''}</section>
  </div></div>`;
}
function main(a, all, done) {
  const ms = visible(a), left = all.length - done;
  const groups = (SA.cat === 'All' ? CATEGORIES : [SA.cat]).filter(c => ms.some(m => m.cat === c));
  const next = ANIMALS.find(x => x.id !== a.id && dueOf(x).length);
  return `<div class="pane__hd">${thumb(a, 44)}<div class="ttl"><span class="t-minor-medium ellipsis">${esc(a.tag)}</span><span class="t-subtext-regular muted ellipsis">${esc(a.species)} · ${esc(a.site)} · ${esc(a.encl)}</span></div>
      <div style="width:148px;display:flex;flex-direction:column;gap:var(--sp-4)"><span class="t-subtext-title ${left ? 'warn' : 'ok'}" style="text-align:right">${left ? `${left} due this week` : 'All recorded'}</span><span class="progress"><span class="progress__bar"><i style="width:${all.length ? done / all.length * 100 : 0}%"></i></span><span class="t-small muted">${done}/${all.length}</span></span></div></div>
    <div class="pane__bd" data-keep-scroll="rows">
      ${!left && next ? `<div class="blk" style="background:var(--primary-main-a10)"><div class="blk__hd"><span class="t-body-medium ok">${ic('just-tick-mark', 'var(--on-surface)', 'app-icon--20')} Everything recorded for ${esc(a.tag)}</span><button class="btn btn--admit t-body-medium" data-act="a-sel" data-v="${next.id}">Next: ${esc(next.tag)} ${ic('dropdown', 'var(--on-primary)', 'app-icon--16', 'chev-r')}</button></div></div>` : ''}
      ${groups.map(c => `<div class="label t-subtext-title">${c}</div>${ms.filter(m => m.cat === c).map(m => row(a, m)).join('')}`).join('') || `<div class="empty t-body-regular">${SA.show === 'due' ? 'Nothing due here. Switch the filter to see everything.' : 'No assessments in this category.'}</div>`}
    </div>`;
}
function row(a, m) {
  const list = recs(a.id, m.id), last = list[0], done = doneThisWeek(a, m), open = SA.open === m.id, f = last ? fmt(m, last) : null, justSaved = SA.saved[m.id];
  const head = `<button class="lrow" data-act="a-row" data-v="${m.id}" aria-expanded="${open}" style="min-height:68px${open ? ';background:var(--background)' : ''}">
      <span class="dot ${done ? 'dot--done' : 'dot--due'}" title="${done ? 'Recorded this week' : 'Due'}"></span>
      <span class="body"><span class="t-body-title navy">${esc(m.name)}</span><span class="t-subtext-regular ${justSaved ? 'ok' : 'muted'}">${justSaved ? 'Saved just now' : last ? `${TYPE(m.type).label} · ${ago(last.t)}` : `${TYPE(m.type).label} · not recorded yet`}</span></span>
      ${last && isNumeric(m) ? `<span style="flex:0 0 auto">${spark(list.slice(0, 8).reverse().map(r => numOf(m, r)), 64, 24)}</span>` : ''}
      <span class="end" style="max-width:150px">${last ? `<span class="ink ellipsis" style="max-width:150px">${isNumeric(m) ? `<span class="t-minor-title">${esc(f.v)}</span> <span class="t-subtext-regular navy">${esc(f.u)}</span>` : `<span class="t-body-medium">${esc(f.v)}</span>`}</span>${trendHTML(trend(m, list))}` : `<span class="t-body-medium muted">—</span>`}</span>
      ${ic('dropdown', 'var(--outline)', 'app-icon--20', open ? 'chev-u' : '')}</button>`;
  if (!open) return head;
  return head + `<div class="blk" style="background:var(--background);padding-top:0;border-top:0" data-open-row>
      ${m.desc ? `<span class="t-body-regular muted">${esc(m.desc)}</span>` : ''}
      ${refStrip(m)}
      <div class="field" style="gap:var(--sp-12)" data-row-input></div>
      ${SA.noteOpen ? `<label class="notes"><textarea class="t-body-regular" rows="2" placeholder="Add a note" data-a-note>${esc(SA.note)}</textarea></label>` : ''}
      <div style="display:flex;align-items:center;gap:var(--sp-8);flex-wrap:wrap">
        <label class="when t-subtext-title">${ic('calendar', 'var(--on-primary-container)', 'app-icon--16')}<span>${SA.date === isoDate(TODAY) ? 'Today' : fDate(new Date(SA.date + 'T00:00'))}</span><input type="date" value="${SA.date}" max="${isoDate(TODAY)}" data-a-when="date" aria-label="Date"></label>
        <label class="when t-subtext-title">${ic('time', 'var(--on-primary-container)', 'app-icon--16')}<span>${(() => { const [h, mi] = SA.time.split(':'); const d = new Date(TODAY); d.setHours(+h, +mi); return fTime(d); })()}</span><input type="time" value="${SA.time}" data-a-when="time" aria-label="Time"></label>
        ${SA.noteOpen ? '' : `<button class="btn btn--text t-body-medium" data-act="a-note">${ic('notes', 'var(--on-surface)', 'app-icon--20')}Note</button>`}
        <button class="btn btn--text t-body-medium" data-act="a-hist" data-v="${m.id}">History ${ic('dropdown', 'var(--on-surface)', 'app-icon--16', 'chev-r')}</button></div>
      <div style="display:flex;justify-content:flex-end;gap:var(--sp-12);padding-top:var(--sp-4)">
        <button class="btn btn--ghost t-body-medium" data-act="a-row" data-v="${m.id}">Cancel</button>
        <button class="btn btn--admit t-body-medium" data-act="a-save" data-v="${m.id}" style="min-width:144px">Save</button></div>
    </div>`;
}
function after() {
  const box = document.querySelector('[data-row-input]');
  if (box && SA.open) {
    const a = A(SA.sel), m = M(SA.open);
    mountInput(box, m, SA.st, { last: lastText(a, m), unit: SA.st.defUnit });
    box.querySelector('[data-in-num]')?.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); save(m.id); } });
    const n = document.querySelector('[data-a-note]'); if (n) n.oninput = () => SA.note = n.value;
    document.querySelectorAll('[data-a-when]').forEach(i => { i.onchange = () => { SA[i.dataset.aWhen] = i.value; render(); }; i.closest('.when').onclick = () => { try { i.showPicker(); } catch (e) { i.focus(); } }; });
    if (SA.focus) {   // only when a row has just opened, never on re-renders from typing elsewhere
      SA.focus = false; const el = document.querySelector('[data-open-row]'); el?.previousElementSibling?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      setTimeout(() => box.querySelector('[data-in-num],[data-in-text]')?.focus({ preventScroll: true }), 60);
    }
  }
}
function save(mId) {
  const a = A(SA.sel), m = M(mId), val = readValue(m, SA.st);
  if (!val) { render(); return; }
  const [y, mo, d] = SA.date.split('-').map(Number), [h, mi] = SA.time.split(':').map(Number), t = new Date(y, mo - 1, d, h, mi);
  if (t > TODAY) { toast('Entries can’t be in the future'); return; }
  const rec = addRecord(a, m, { ...val, t, note: SA.note.trim() });
  SA.saved[m.id] = rec.id;
  const nx = nextDue(a, m.id);
  if (nx) openRow(nx.id); else SA.open = null;
  render();
  toast(nx ? `${m.name} saved · next: ${nx.name}` : `${m.name} saved`, () => { removeRecord(a, m, rec); delete SA.saved[m.id]; openRow(m.id); render(); toast('Entry removed'); });
}
function drawHistory() {
  const a = A(SA.sel), m = M(SA.histFor);
  panel(`<div class="panel__hd"><div class="ttl"><span class="t-medium-medium navy">${esc(m.name)}</span><span class="t-subtext-regular muted">${esc(a.tag)} · ${esc(m.cat)} · ${TYPE(m.type).label}</span></div><button class="x" data-pn="close" aria-label="Close">${ic('close')}</button></div>
    <div class="panel__bd" style="padding:0;gap:0">${historyHTML(a, m)}</div>`);
}
function click(act, t) {
  const v = t.dataset.v;
  switch (act) {
    case 'a-sel': SA.sel = v; SA.open = null; SA.saved = {}; render(); { const nx = nextDue(A(v), null); if (nx) { openRow(nx.id); render(); } } return true;
    case 'a-cat': SA.cat = v; SA.open = null; render(); return true;
    case 'a-show': popover(t, `<span class="pop__title t-subtext-title">Show</span>` + popItems([['all', 'All assessments'], ['due', 'Only what’s due']], SA.show), k => { SA.show = k; render(); }); return true;
    case 'a-row': if (SA.open === v) SA.open = null; else openRow(v); render(); return true;
    case 'a-save': save(v); return true;
    case 'a-note': SA.noteOpen = true; render(); document.querySelector('[data-a-note]')?.focus(); return true;
    case 'a-hist': SA.histFor = v; drawHistory(); return true;
  }
  return false;
}
C.animals = {
  render: renderA, click, after,
  input: (k, val) => { if (k === 'aq') SA.q = val; },
  historyChanged: () => { if (SA.histFor && document.getElementById('scrimPanel').classList.contains('on')) drawHistory(); else render(); },
  start: (screen, arg) => { if (screen === 'row' && C.MN(arg)) { openRow(C.MN(arg).id); render(); } else { const nx = nextDue(A(SA.sel), null); if (nx) { openRow(nx.id); render(); } } if (screen === 'history' && C.MN(arg)) { SA.histFor = C.MN(arg).id; drawHistory(); } },
};
C.boot();
})();
