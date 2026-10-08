/* Version C · Rounds — guided entry for the daily round.
   Screen 1: who needs what today. Screen 2: one assessment per step, big input, the last reading for reference,
   Save & Next / Skip / Previous and a step bar. Screen 3: summary to check before finishing, with "Next animal".
   Best for the vet doing a round on the ward with the iPad in one hand. */
'use strict';
(() => {
const { esc, ic, plural, ANIMALS, A, M, recs, animalMasters, doneThisWeek, dueOf, addRecord, removeRecord, fmt, numOf, isNumeric, trend, trendHTML,
  ago, fTime, fDate, isoDate, isoTime, TODAY, thumb, spark, mountInput, readValue, lastText, defaultUnit, refStrip, toast, render, TYPE, popover, popItems, badge } = C;
const SC = { screen: 'list', filter: 'Due', q: '', aId: null, queue: [], i: 0, st: {}, notes: {}, saved: {}, skipped: {} };

function startRound(aId, all) {
  const a = A(aId), due = dueOf(a);
  SC.aId = aId; SC.queue = (all || !due.length ? animalMasters(a) : due).map(m => m.id); SC.i = 0; SC.st = {}; SC.notes = {}; SC.saved = {}; SC.skipped = {}; SC.screen = 'round';
  SC.queue.forEach(id => { SC.st[id] = { defUnit: defaultUnit(a, M(id)) }; });
  render();
}
const hideNav = () => SC.screen !== 'list';
function renderC() { return SC.screen === 'list' ? list() : SC.screen === 'round' ? step() : summary(); }

function list() {
  const q = SC.q.toLowerCase(), base = ANIMALS.filter(a => !q || `${a.tag} ${a.species} ${a.encl}`.toLowerCase().includes(q));
  const due = base.filter(a => dueOf(a).length), shown = SC.filter === 'Due' ? due : base;
  const totalDue = ANIMALS.reduce((s, a) => s + dueOf(a).length, 0);
  return `<header class="hdr"><div class="hdr__row">${ic('back', 'var(--on-secondary-container)')}
      <div class="hdr__title"><div class="hdr__title-row"><span class="t-major-title name">Today’s Rounds</span></div>
        <div class="hdr__sub t-body-medium"><span class="t-body-medium">Tue, 29 Sep</span><span class="sep t-body-medium">|</span><span class="t-body-medium">${plural(totalDue, 'assessment')} due</span><span class="sep t-body-medium">|</span><span class="t-body-medium">${plural(ANIMALS.filter(a => dueOf(a).length).length, 'animal')}</span></div></div></div>
    <div class="hdr__tools"><label class="tab-search">${ic('search', 'var(--on-surface-variant)', 'app-icon--20')}<input class="t-body-medium" data-in="cq" value="${esc(SC.q)}" placeholder="Search animals by tag, species or enclosure"></label></div>
    <div class="hdr__tabs-wrap"><div class="tab-primary-tabs t-body-medium"><button class="tab-primary t-body-medium${SC.filter === 'Due' ? ' tab-primary--active' : ''}" data-act="c-filter" data-v="Due">Due - ${due.length}</button><button class="tab-primary t-body-medium${SC.filter === 'All' ? ' tab-primary--active' : ''}" data-act="c-filter" data-v="All">All animals - ${base.length}</button></div></div></header>
  <div class="canvas"><section class="card pane" style="flex:1"><div class="pane__hd"><div class="ttl"><span class="t-minor-medium">${SC.filter === 'Due' ? 'Needs recording' : 'All animals'}</span><span class="t-subtext-regular muted">Start a round to record each assessment one at a time</span></div></div>
    <div class="pane__bd" data-keep-scroll="clist">${shown.map(a => { const d = dueOf(a), ms = animalMasters(a);
      return `<div class="lrow" style="cursor:default;min-height:88px">${thumb(a, 56)}<span class="body"><span class="t-body-title navy">${esc(a.tag)}</span><span class="t-subtext-regular muted">${esc(a.species)} · ${esc(a.site)} · ${esc(a.encl)}</span>
          <span class="t-subtext-regular ${d.length ? 'warn' : 'ok'} ellipsis">${d.length ? d.map(m => m.name).join(' · ') : `All ${ms.length} recorded this week`}</span></span>
        ${d.length ? `<span class="pill pill--due t-subtext-title">${d.length} due</span><button class="btn btn--admit t-body-medium" data-act="c-start" data-v="${a.id}">Start round</button>` : `<button class="btn btn--ghost t-body-medium" data-act="c-all" data-v="${a.id}">Record again</button>`}</div>`; }).join('') || `<div class="empty t-body-regular">${ic('just-tick-mark', 'var(--primary-main)', 'app-icon--28')}<span class="t-minor-medium ink">Nothing due. Nice work.</span><span class="t-body-regular">Switch to “All animals” to record again.</span></div>`}</div></section></div>`;
}
function stepBar() {
  return `<div style="display:flex;gap:4px;padding:0 var(--sp-20) var(--sp-12);background:var(--on-primary)">${SC.queue.map((id, j) => {
    const col = SC.saved[id] ? 'var(--primary-main)' : SC.skipped[id] ? 'var(--outline)' : j === SC.i ? 'var(--on-primary-container)' : 'var(--surface-variant)';
    return `<button data-act="c-go" data-v="${j}" title="${esc(M(id).name)}" aria-label="Step ${j + 1}: ${esc(M(id).name)}" style="flex:1;height:6px;border:0;border-radius:3px;padding:0;cursor:pointer;background:${col}"></button>`; }).join('')}</div>`;
}
function roundHeader(right) {
  const a = A(SC.aId);
  return `<header class="hdr" style="border-bottom:0"><div class="hdr__row"><button class="hdr__back" data-act="c-exit" aria-label="Exit round">${ic('close', 'var(--on-secondary-container)')}</button>
      <span class="hdr__logo">${thumb(a, 40)}</span>
      <div class="hdr__title"><div class="hdr__title-row"><span class="t-major-title name">${esc(a.tag)}</span></div><div class="hdr__sub t-body-medium"><span class="t-body-medium">${esc(a.species)}</span><span class="sep t-body-medium">|</span><span class="t-body-medium">${esc(a.encl)}</span></div></div>
      <div class="hdr__end">${right}</div></div>${stepBar()}</header>`;
}
function step() {
  const a = A(SC.aId), m = M(SC.queue[SC.i]), l = recs(a.id, m.id), last = l[0], isLast = SC.i === SC.queue.length - 1, savedRec = SC.saved[m.id];
  return roundHeader(`<span class="t-body-medium muted">${SC.i + 1} of ${SC.queue.length}</span>`) + `
  <div class="form-scroll" style="align-items:center;padding-top:var(--sp-24)" data-keep-scroll="step">
    <section class="fcard" style="width:100%;max-width:640px;gap:var(--sp-20)">
      <div style="display:flex;align-items:flex-start;gap:var(--sp-12)"><div style="flex:1;display:flex;flex-direction:column;gap:var(--sp-4)"><span class="t-small muted">${esc(m.cat.toUpperCase())} · ${esc(TYPE(m.type).label.toUpperCase())}</span><span class="t-major-title navy">${esc(m.name)}</span>${m.desc ? `<span class="t-body-regular muted">${esc(m.desc)}</span>` : ''}</div>
        ${savedRec ? `<span class="pill pill--done t-subtext-title">${ic('just-tick-mark', 'var(--on-surface)', 'app-icon--16')}Saved</span>` : SC.skipped[m.id] ? `<span class="pill pill--off t-subtext-title">Skipped</span>` : ''}</div>
      ${last ? `<div style="display:flex;align-items:center;gap:var(--sp-12);padding:var(--sp-12);border-radius:8px;background:var(--background)"><span class="t-subtext-regular muted" style="flex:1">Last reading · ${ago(last.t)} · ${esc(last.by)}<br><span class="t-body-medium ink">${esc(fmt(m, last).v)} ${esc(fmt(m, last).u)}</span></span>${isNumeric(m) ? spark(l.slice(0, 8).reverse().map(r => numOf(m, r)), 120, 32) : ''}${trendHTML(trend(m, l))}</div>` : `<span class="t-subtext-regular muted">First reading for this animal.</span>`}
      ${refStrip(m)}
      <div class="field" style="gap:var(--sp-12)" data-step-input></div>
      <label class="notes"><textarea class="t-body-regular" rows="2" placeholder="Add Notes (optional)" data-c-note>${esc(SC.notes[m.id] || '')}</textarea></label>
      <span class="t-subtext-regular muted">${ic('time', 'var(--outline)', 'app-icon--16')} Recorded as today, ${fTime(TODAY)} · Dr. Mehta</span>
    </section>
  </div>
  <div class="actionbar"><button class="bigbtn bigbtn--ghost t-minor-medium" data-act="c-prev" ${SC.i ? '' : 'disabled'} style="flex:0 0 160px">${ic('back', 'var(--on-surface-variant)', 'app-icon--20')}Previous</button>
    <span style="flex:1"></span><button class="bigbtn bigbtn--text t-minor-medium" data-act="c-skip">Skip</button>
    <button class="bigbtn bigbtn--primary t-minor-medium" data-act="c-save" style="flex:0 0 240px">${savedRec ? (isLast ? 'Update & Finish' : 'Update & Next') : (isLast ? 'Save & Finish' : 'Save & Next')}</button></div>`;
}
function summary() {
  const a = A(SC.aId), saved = SC.queue.filter(id => SC.saved[id]).length, skipped = SC.queue.filter(id => SC.skipped[id]).length;
  const next = ANIMALS.find(x => x.id !== a.id && dueOf(x).length);
  return roundHeader(`<span class="pill pill--done t-subtext-title">${saved} saved</span>${skipped ? `<span class="pill pill--off t-subtext-title">${skipped} skipped</span>` : ''}`) + `
  <div class="form-scroll" style="align-items:center;padding-top:var(--sp-24)">
    <section class="fcard" style="width:100%;max-width:640px;padding:0;gap:0">
      <div class="blk" style="align-items:center;text-align:center;padding:var(--sp-24)">${ic('approved', 'var(--primary-main)', 'app-icon--28')}<span class="t-medium-medium navy">${saved ? `Round complete for ${esc(a.tag)}` : `Nothing saved yet for ${esc(a.tag)}`}</span><span class="t-body-regular muted">Check what was recorded. Tap any row to change it.</span></div>
      ${SC.queue.map((id, j) => { const m = M(id), r = SC.saved[id] ? recs(a.id, id).find(x => x.id === SC.saved[id]) : null, f = r ? fmt(m, r) : null;
        return `<button class="lrow" data-act="c-go" data-v="${j}"><span class="dot ${r ? 'dot--done' : SC.skipped[id] ? '' : 'dot--due'}"></span><span class="body"><span class="t-body-title navy">${esc(m.name)}</span><span class="t-subtext-regular muted">${r ? `${fTime(r.t)}${r.note ? ' · note added' : ''}` : SC.skipped[id] ? 'Skipped · still due' : 'Not recorded'}</span></span><span class="end">${r ? `<span class="t-body-medium ink">${esc(f.v)} ${esc(f.u)}</span>` : `<span class="t-body-medium warn">Record now</span>`}</span>${ic('dropdown', 'var(--outline)', 'app-icon--20', 'chev-r')}</button>`; }).join('')}
    </section>
  </div>
  <div class="actionbar"><button class="bigbtn bigbtn--ghost t-minor-medium" data-act="c-exit">Back to rounds</button>${next ? `<button class="bigbtn bigbtn--primary t-minor-medium" data-act="c-start" data-v="${next.id}">Next: ${esc(next.tag)} · ${dueOf(next).length} due</button>` : `<button class="bigbtn bigbtn--primary t-minor-medium" data-act="c-exit">Finish</button>`}</div>`;
}
function after() {
  const box = document.querySelector('[data-step-input]'); if (!box) return;
  const a = A(SC.aId), m = M(SC.queue[SC.i]), st = SC.st[m.id];
  mountInput(box, m, st, { big: true, unit: st.defUnit });
  box.querySelector('[data-in-num]')?.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); saveStep(); } });
  const n = document.querySelector('[data-c-note]'); if (n) n.oninput = () => SC.notes[m.id] = n.value;
  if (SC.focus) { SC.focus = false; setTimeout(() => box.querySelector('[data-in-num],[data-in-text]')?.focus({ preventScroll: true }), 60); }
}
function go(j) { SC.i = j; SC.screen = 'round'; SC.focus = true; render(); document.querySelector('.form-scroll')?.scrollTo(0, 0); }
function advance() { const j = SC.queue.findIndex((id, k) => k > SC.i && !SC.saved[id] && !SC.skipped[id]); if (j > -1) go(j); else if (SC.i < SC.queue.length - 1) go(SC.i + 1); else { SC.screen = 'summary'; render(); } }
function saveStep() {
  const a = A(SC.aId), m = M(SC.queue[SC.i]), st = SC.st[m.id], val = readValue(m, st);
  if (!val) { render(); return; }
  if (SC.saved[m.id]) { const old = recs(a.id, m.id).find(r => r.id === SC.saved[m.id]); if (old) removeRecord(a, m, old); }
  const rec = addRecord(a, m, { ...val, t: new Date(TODAY), note: (SC.notes[m.id] || '').trim() });
  SC.saved[m.id] = rec.id; delete SC.skipped[m.id];
  toast(`${m.name} saved`);
  advance();
}
function click(act, t) {
  const v = t.dataset.v;
  switch (act) {
    case 'c-filter': SC.filter = v; render(); return true;
    case 'c-start': SC.focus = true; startRound(v); return true;
    case 'c-all': SC.focus = true; startRound(v, true); return true;
    case 'c-exit': {
      const pending = SC.screen === 'round' && SC.queue.some(id => !SC.saved[id] && !SC.skipped[id]);
      if (pending && SC.queue.some(id => SC.saved[id])) { popover(t, `<span class="pop__title t-subtext-title">Leave this round?</span>` + popItems([['leave', 'Leave · saved entries are kept', 'close'], ['stay', 'Keep going', 'back']]), k => { if (k === 'leave') { SC.screen = 'list'; render(); } }); return true; }
      SC.screen = 'list'; render(); return true;
    }
    case 'c-go': go(+v); return true;
    case 'c-prev': if (SC.i) go(SC.i - 1); return true;
    case 'c-skip': { const id = SC.queue[SC.i]; if (!SC.saved[id]) SC.skipped[id] = true; advance(); return true; }
    case 'c-save': saveStep(); return true;
  }
  return false;
}
C.animals = { render: renderC, click, after, hideNav, input: (k, val) => { if (k === 'cq') SC.q = val; },
  start: (screen, arg) => { if (screen === 'round') { SC.focus = true; startRound(arg && A(arg) ? arg : 'a1'); } if (screen === 'summary') { startRound('a1'); SC.queue.forEach((id, j) => { if (j % 3 === 2) SC.skipped[id] = true; }); SC.screen = 'summary'; render(); } } };
C.boot();
})();
