/* Animal page · Assessment tab — mockup board with 4 variations (static; data typed in to match the prototype).
   Every frame = status bar · collapsed animal header · tab row (Assessment on) · the variation's content. 810 × 1080. */
'use strict';
(() => {
const ic = (s, c = 'var(--on-surface-variant)', sz = '', x = '') => `<span class="app-icon ${sz} app-icon--tint i-${s} ${x}" style="color:${c}" aria-hidden="true"></span>`;
const IMG = '../../../app/sample-leopard-84.png';

/* ------------------------------------------------------------------ data (one animal, 8 assessments) */
const W = [53.1, 53.4, 53.6, 53.8, 54.0, 54.1, 54.2, 54.3];
const AS = [
  { id: 'w', name: 'Weight', cat: 'Physical Health', icon: 'percentage', v: '54.3', u: 'kg', when: '19 Sep', ago: '10 days ago', st: 'due', ch: '+0.1 kg', up: true, spark: W, every: 7, n: 34 },
  { id: 'hr', name: 'Heart Rate', cat: 'Physical Health', icon: 'filter-2', v: '80 – 105', u: 'bpm', when: 'Today', ago: '2 h ago', st: 'ok', ch: '+18 bpm', up: true, spark: [92, 88, 95, 86, 99, 90, 84, 93], every: 7, n: 31 },
  { id: 'eye', name: 'Eye Condition', cat: 'Physical Health', icon: 'list', v: 'Discharge, Pain', u: '', when: 'Today', ago: '2 h ago', st: 'ok', every: 7, n: 37 },
  { id: 'bs', name: 'Body Score', cat: 'Physical Health', icon: 'reason-or-list', v: '1 · Poor', u: '', when: '16 Sep', ago: '13 days ago', st: 'ok', flag: true, every: 14, n: 34 },
  { id: 't', name: 'Temperature', cat: 'Physical Health', icon: 'percentage', v: '38.2', u: '°C', when: '20 Sep', ago: '9 days ago', st: 'due', ch: '−0.1 °C', up: false, spark: [38.4, 38.1, 38.3, 38.6, 38.2, 38.5, 38.3, 38.2], every: 7, n: 30 },
  { id: 'mo', name: 'Mood', cat: 'Behaviour', icon: 'notes', v: 'Resting most of the day', u: '', when: '17 Sep', ago: '12 days ago', st: 'over', every: 3, n: 44 },
  { id: 'sb', name: 'Stress Behaviour', cat: 'Behaviour', icon: 'list', v: 'None', u: '', when: 'Yesterday', ago: '1 day ago', st: 'ok', every: 7, n: 32 },
  { id: 'hu', name: 'Humidity', cat: 'Environment', icon: 'percentage', v: '61', u: '%', when: 'Today', ago: '1 h ago', st: 'ok', ch: '−7 %', up: false, spark: [64, 66, 63, 68, 65, 69, 66, 61], every: 3, n: 41 },
];
const CATS = ['Physical Health', 'Behaviour', 'Environment'];
const byCat = c => AS.filter(a => a.cat === c);
const REC_W = [['19 Sep 2026', '08:41 AM', '54.3', 'Dr. Mehta', ''], ['12 Sep 2026', '09:10 AM', '54.2', 'Dr. Swathi', 'Weighed after fasting.'], ['5 Sep 2026', '08:55 AM', '54.1', 'Dr. Mehta', ''], ['29 Aug 2026', '10:02 AM', '54.0', 'Dr. Nitin', ''], ['22 Aug 2026', '08:30 AM', '53.8', 'Dr. Mehta', '']];

/* ------------------------------------------------------------------ small parts */
const dot = st => `<i class="mk-dot mk-dot--${st}"></i>`;
const stText = a => a.st === 'due' ? `<span class="mk-st due t-subtext-title">Due</span>` : a.st === 'over' ? `<span class="mk-st over t-subtext-title">Overdue</span>` : '';
const spark = (vals, w = 88, h = 28, col) => { if (!vals) return `<span style="width:${w}px"></span>`; const lo = Math.min(...vals), hi = Math.max(...vals), sp = hi - lo || 1; col = col || (vals.at(-1) >= vals[0] ? 'var(--primary-main)' : 'var(--tertiary)');
  const y = v => h - 3 - (v - lo) / sp * (h - 6); return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true"><polyline points="${vals.map((v, i) => `${i / (vals.length - 1) * w},${y(v)}`).join(' ')}" fill="none" style="stroke:${col};stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round"/><circle cx="${w}" cy="${y(vals.at(-1))}" r="2.5" style="fill:${col}"/></svg>`; };
function graph(vals, w = 560, h = 190, labels = [[0, '22 Aug'], [2, '5 Sep'], [4, '19 Sep']]) {   // labels = [point index, text]; the dashed line is today
  const L = 36, B = 22, T = 10, pw = w - L - 12, ph = h - T - B, lo = Math.min(...vals) - .3, hi = Math.max(...vals) + .3, n = vals.length;
  const x = i => L + i / (n - 1) * pw * .88, y = v => T + ph - (v - lo) / (hi - lo) * ph, tx = L + pw;
  const P = vals.map((v, i) => [x(i), y(v)]), d = P.map((p, i) => i ? `C${(P[i - 1][0] + p[0]) / 2},${P[i - 1][1]} ${(P[i - 1][0] + p[0]) / 2},${p[1]} ${p[0]},${p[1]}` : `M${p[0]},${p[1]}`).join(' ');
  const grid = [0, .5, 1].map(f => { const v = lo + (hi - lo) * f; return `<line class="grid" x1="${L}" x2="${tx}" y1="${y(v)}" y2="${y(v)}"/><text class="axis t-small" x="${L - 6}" y="${y(v) + 3}" text-anchor="end">${v.toFixed(1)}</text>`; }).join('');
  const xl = labels.map(([k, l]) => `<text class="axis t-small" x="${x(k)}" y="${h - 4}" text-anchor="middle">${l}</text>`).join('') + `<text class="axis t-small" x="${tx}" y="${h - 4}" text-anchor="end">Today</text>`;
  return `<div class="graph"><svg viewBox="0 0 ${w} ${h}"><defs><linearGradient id="mkF" x1="0" x2="0" y1="0" y2="1"><stop offset="0" style="stop-color:var(--primary-main);stop-opacity:.2"/><stop offset="1" style="stop-color:var(--primary-main);stop-opacity:0"/></linearGradient></defs>${grid}${xl}
    <line x1="${tx}" x2="${tx}" y1="${T}" y2="${T + ph}" class="mk-today"/>
    <path d="${d} L${P.at(-1)[0]},${T + ph} L${P[0][0]},${T + ph} Z" fill="url(#mkF)"/><path d="${d}" fill="none" style="stroke:var(--primary-main);stroke-width:2"/>${P.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="3.5" style="fill:var(--on-primary);stroke:var(--primary-main);stroke-width:2"/>`).join('')}</svg></div>`;
}
const seg = (items, on) => `<div class="app-segmented mk-seg">${items.map(l => `<span class="app-segment ${l === on ? 'app-segment--active t-subtext-title' : 't-subtext-regular'}">${l}</span>`).join('')}</div>`;
const recRows = (rows, u = 'kg') => rows.map(([d, t, v, by, note], i) => `<div class="mk-rec${i === 0 ? ' first' : ''}"><span class="d"><span class="t-subtext-title">${d}</span><span class="t-small muted">${t}</span></span><span class="v"><span class="t-body-title ink">${v}</span> <span class="t-subtext-regular navy">${u}</span>${note ? `<span class="t-small muted">${note}</span>` : ''}</span><span class="t-subtext-regular muted">${by}</span></div>`).join('');

/* ------------------------------------------------------------------ frame chrome */
const status = `<div class="statusbar" aria-hidden="true"><span class="l"><span class="t-body-title">9:41 AM</span><span class="t-body-medium">Tue Sep 29</span></span><span class="r"><span class="t-body-title">100%</span><span class="battery"></span></span></div>`;
const head = `<div class="mk-head"><div class="mk-head__bg" style="background-image:url(${IMG})"></div>${ic('back', 'var(--on-primary)', 'app-icon--28')}
  <span class="mk-head__ph"><img src="${IMG}" alt=""><span class="app-photo-badge app-photo-badge--male t-small">M</span></span>
  <span class="mk-head__id"><span class="t-minor-title">Ear Tag: 456789</span><span class="t-subtext-regular">Indian Leopard · Male · Big Cat Rescue · Run 2 · AID 87549/24</span></span><span class="sp"></span>
  ${ic('saved', 'var(--on-primary)', 'app-icon--24')}${ic('qr-code', 'var(--on-primary)', 'app-icon--24')}${ic('menu-vertical', 'var(--on-primary)', 'app-icon--24')}</div>`;
const tabs = `<div class="atab mk-atab"><span class="atab__all">${ic('list', 'var(--on-surface-variant)', 'app-icon--24')}</span>${['Overview', 'Taxonomy', 'Assessment', 'Notes', 'Journal', 'Medical', 'Media'].map(t => `<span class="atab__t t-minor-medium${t === 'Assessment' ? ' on' : ''}">${t}</span>`).join('')}</div>`;
const chips = (on = 'All', extra = '') => `<div class="mk-chips">${[['All', 8], ['Due', 3], ['Physical Health', 5], ['Behaviour', 2], ['Environment', 1]].map(([l, n]) => `<span class="fchip t-body-medium${l === on ? ' on' : ''}">${l} <span class="n t-small">${n}</span></span>`).join('')}<span class="sp"></span>${extra}<span class="mk-iconbtn">${ic('search', 'var(--on-surface)', 'app-icon--20')}</span></div>`;
const frame = (body, overlay = '') => `<div class="fit"><div class="app">${status}${head}${tabs}<div class="mk-body">${body}</div>${overlay}</div></div>`;

/* ------------------------------------------------------------------ A · List rows (expand inline) */
const rowA = (a, open) => `<div class="mk-row${open ? ' open' : ''}"><span class="mk-row__ic">${ic(a.icon, 'var(--on-primary-container)', 'app-icon--20')}</span>
  <span class="mk-row__nm"><span class="t-body-title ink">${a.name}</span><span class="t-small muted">every ${a.every} days</span></span>
  <span class="mk-row__v"><span class="${a.u ? 't-minor-title' : 't-body-title'} ink ellipsis">${a.v}</span>${a.u ? `<span class="t-subtext-regular navy">${a.u}</span>` : ''}</span>
  <span class="mk-row__sp">${spark(a.spark, 80, 26)}</span>
  <span class="mk-row__when"><span class="t-subtext-title ${a.st === 'ok' ? 'ink' : a.st === 'over' ? 'bad' : 'warn'}">${a.st === 'ok' ? a.when : a.st === 'over' ? 'Overdue' : 'Due'}</span><span class="t-small muted">${a.ago}</span></span>
  <span class="mk-add mk-add--ghost">${ic('plus', 'var(--on-surface)', 'app-icon--20')}</span></div>`;
const listA = open => CATS.map(c => `<span class="sec-label t-small">${c.toUpperCase()}</span><div class="mk-card">${byCat(c).map(a => rowA(a, a.id === open) + (a.id === open ? expandA : '')).join('')}</div>`).join('');
const expandA = `<div class="mk-expand"><div class="mk-expand__top"><span class="t-subtext-regular muted">Last 5 of 34 readings · average 54.1 kg</span>${seg(['1M', '3M', '6M', '1Y'], '3M')}</div>${graph(W.slice(3), 700, 150, [[0, '22 Aug'], [1, '29 Aug'], [2, '5 Sep'], [3, '12 Sep'], [4, '19 Sep']])}
  <div class="mk-mini">${recRows(REC_W.slice(0, 3))}</div><div class="mk-expand__ft"><span class="link t-body-title">See all 34 readings ${ic('dropdown', 'var(--on-surface)', 'app-icon--16', 'chev-r')}</span><span class="sp"></span><span class="mk-btn mk-btn--primary t-body-title">${ic('plus', 'var(--on-primary)', 'app-icon--20')}Add Weight reading</span></div></div>`;
const A1 = frame(chips() + listA());
const A2 = frame(chips() + listA('w'));

/* ------------------------------------------------------------------ B · Split view (list + detail, add inline) */
const listB = sel => `<div class="mk-split__l"><div class="mk-split__search">${ic('search', 'var(--on-surface-variant)', 'app-icon--20')}<span class="t-body-regular muted">Search</span></div>
  <div class="mk-seg2">${seg(['All', 'Due 3'], 'All')}</div>
  ${CATS.map(c => `<span class="sec-label t-small">${c.toUpperCase()}</span>${byCat(c).map(a => `<div class="mk-li${a.id === sel ? ' on' : ''}"><span class="mk-li__t"><span class="t-body-title ${a.id === sel ? 'navy' : 'ink'}">${a.name}</span><span class="t-small muted ellipsis">${a.v}${a.u ? ' ' + a.u : ''} · ${a.ago}</span></span>${a.st !== 'ok' ? dot(a.st) : ''}</div>`).join('')}`).join('')}</div>`;
const quickNum = `<div class="mk-quick"><span class="t-subtext-title muted">NEW READING</span><div class="mk-quick__row"><span class="mk-input"><span class="t-minor-title ink">54.6</span><span class="caret"></span><span class="t-body-regular navy">kg</span></span>
  <span class="mk-pillbtn t-body-medium">${ic('calendar', 'var(--on-surface-variant)', 'app-icon--20')}Today 09:41</span><span class="mk-pillbtn mk-pillbtn--ic" aria-label="Note">${ic('notes', 'var(--on-surface-variant)', 'app-icon--20')}</span><span class="sp"></span><span class="mk-btn mk-btn--primary t-body-title">Save</span></div>
  <span class="t-small muted">Last 54.3 kg on 19 Sep · this one is +0.3 kg (+0.6%)</span></div>`;
const detailB = `<div class="mk-split__r"><div class="mk-dh"><span class="ttl"><span class="mk-dh__n"><span class="t-medium-medium ink">Weight</span><span class="mk-st due t-subtext-title">Due · 10 days</span></span><span class="t-subtext-regular muted">Physical Health · every 7 days · 34 readings</span></span></div>
  <div class="mk-big"><span class="t-stat-title ink">54.3</span><span class="t-body-regular navy">kg</span><span class="trend trend--up t-subtext-title">${ic('dropdown', 'currentColor', 'app-icon--16', 'chev-u')}+0.1 kg</span><span class="sp"></span>${seg(['1M', '3M', '6M', '1Y'], '3M')}</div>
  ${graph(W, 480, 170, [[0, '1 Aug'], [3, '22 Aug'], [5, '5 Sep'], [7, '19 Sep']])}
  ${quickNum}
  <div class="mk-rh"><span class="t-minor-medium ink">History</span><span class="t-subtext-regular muted">34</span></div>${recRows(REC_W.slice(0, 4))}</div>`;
const quickList = `<div class="mk-quick"><span class="t-subtext-title muted">NEW READING · choose all that apply</span><div class="mk-opts">${['Pain', 'Redness', 'Swelling', 'Discharge', 'Itchiness', 'Normal'].map((o, i) => `<span class="mk-opt t-body-medium${i === 0 || i === 3 ? ' on' : ''}">${i === 0 || i === 3 ? ic('just-tick-mark', 'var(--on-primary)', 'app-icon--16') : ''}${o}</span>`).join('')}</div>
  <div class="mk-quick__row"><span class="mk-pillbtn t-body-medium">${ic('calendar', 'var(--on-surface-variant)', 'app-icon--20')}Today 09:41</span><span class="mk-pillbtn mk-pillbtn--ic" aria-label="Photo">${ic('image', 'var(--on-surface-variant)', 'app-icon--20')}</span><span class="mk-pillbtn mk-pillbtn--ic" aria-label="Note">${ic('notes', 'var(--on-surface-variant)', 'app-icon--20')}</span><span class="sp"></span><span class="mk-btn mk-btn--primary t-body-title">Save</span></div></div>`;
const freq = [['Discharge', 9], ['Pain', 6], ['Redness', 4], ['Normal', 3], ['Swelling', 1]];
const detailB2 = `<div class="mk-split__r"><div class="mk-dh"><span class="ttl"><span class="mk-dh__n"><span class="t-medium-medium ink">Eye Condition</span><span class="mk-st ok t-subtext-title">Done today</span></span><span class="t-subtext-regular muted">Physical Health · every 7 days · 37 readings</span></span></div>
  ${quickList}
  <div class="mk-rh"><span class="t-minor-medium ink">Last 3 months</span>${seg(['1M', '3M', '6M', '1Y'], '3M')}</div>
  <div class="freq">${freq.map(([k, n]) => `<div class="freq__row"><div class="top"><span class="t-body-regular">${k}</span><span class="t-subtext-regular muted">${n} ${n === 1 ? "time" : "times"}</span></div><div class="bar"><i style="width:${n / 9 * 100}%"></i></div></div>`).join('')}</div>
  <div class="mk-rh"><span class="t-minor-medium ink">History</span><span class="t-subtext-regular muted">37</span></div>${recRows([['29 Sep 2026', '07:32 AM', 'Discharge, Pain', 'Dr. Mehta', ''], ['22 Sep 2026', '08:10 AM', 'Discharge', 'Dr. Swathi', 'Left eye only.'], ['15 Sep 2026', '09:00 AM', 'Redness', 'Dr. Mehta', '']], '')}</div>`;
const B1 = frame(`<div class="mk-split">${listB('w')}${detailB}</div>`);
const B2 = frame(`<div class="mk-split">${listB('eye')}${detailB2}</div>`);

/* ------------------------------------------------------------------ C · To do + History (rounds) */
const segC = on => `<div class="mk-segc">${seg(['To record · 3', 'History'], on)}<span class="sp"></span><span class="mk-iconbtn">${ic('search', 'var(--on-surface)', 'app-icon--20')}</span></div>`;
const todoRow = (a, input) => `<div class="mk-todo"><span class="mk-todo__nm"><span class="mk-dh__n"><span class="t-body-title ink">${a.name}</span>${stText(a)}</span><span class="t-small muted">Last ${a.v}${a.u ? ' ' + a.u : ''} · ${a.ago}</span></span>${input}</div>`;
const numIn = (v, u, ph) => `<span class="mk-input mk-input--sm${v ? '' : ' blank'}">${v ? `<span class="t-minor-title ink">${v}</span>` : `<span class="t-body-regular muted">${ph}</span>`}<span class="t-body-regular navy">${u}</span></span>`;
const C1 = frame(segC('To record · 3') + `<div class="mk-card mk-card--pad"><div class="mk-rh"><span class="t-minor-medium ink">Due now</span><span class="t-subtext-regular muted">fill what you have · Save records all at once</span></div>
  ${todoRow(AS[0], numIn('54.6', 'kg'))}${todoRow(AS[4], numIn('', '°C', 'e.g. 38.2'))}
  ${todoRow(AS[5], `<span class="mk-text t-body-regular">Calm, eating well<span class="caret"></span></span>`)}
  <div class="mk-todo__ft"><span class="mk-pillbtn t-body-medium">${ic('calendar', 'var(--on-surface-variant)', 'app-icon--20')}Today 09:41</span><span class="t-subtext-regular muted">2 of 3 filled</span><span class="sp"></span><span class="mk-btn mk-btn--primary t-body-title">Save 2 readings</span></div></div>
  <span class="sec-label t-small">UP TO DATE · 5</span><div class="mk-card">${AS.filter(a => a.st === 'ok').map(a => `<div class="mk-row mk-row--c"><span class="mk-row__nm"><span class="t-body-title ink">${a.name}</span><span class="t-small muted">${a.cat}</span></span><span class="mk-row__v"><span class="t-body-title ink ellipsis">${a.v}</span>${a.u ? `<span class="t-subtext-regular navy">${a.u}</span>` : ''}</span><span class="mk-row__when"><span class="t-subtext-regular ink">${a.when}</span><span class="t-small muted">next in ${a.every} d</span></span><span class="mk-add mk-add--ghost">${ic('plus', 'var(--on-surface)', 'app-icon--20')}</span></div>`).join('')}</div>`);
const feed = [['TODAY', [['08:40 AM', 'Humidity', '61 %', 'Keeper Ravi'], ['07:32 AM', 'Eye Condition', 'Discharge, Pain', 'Dr. Mehta'], ['07:30 AM', 'Heart Rate', '80 – 105 bpm', 'Dr. Mehta']]], ['YESTERDAY', [['05:10 PM', 'Stress Behaviour', 'None', 'Dr. Swathi']]], ['20 SEP', [['09:12 AM', 'Temperature', '38.2 °C', 'Dr. Nitin']]], ['19 SEP', [['08:45 AM', 'Mood', 'Resting most of the day', 'Dr. Mehta'], ['08:41 AM', 'Weight', '54.3 kg', 'Dr. Mehta']]]];
const C2 = frame(segC('History') + `<div class="mk-chips mk-chips--sm">${['All', 'Weight', 'Heart Rate', 'Eye Condition', 'Body Score', 'Temperature', 'Mood'].map((l, i) => `<span class="fchip t-body-medium${i === 0 ? ' on' : ''}">${l}</span>`).join('')}</div>
  <div class="mk-card mk-card--pad">${feed.map(([d, items]) => `<span class="sec-label t-small">${d}</span>${items.map(([t, n, v, by]) => `<div class="mk-feed"><span class="t-subtext-regular muted">${t}</span><span class="mk-feed__line"><i></i></span><span class="mk-feed__b"><span class="t-subtext-title navy">${n}</span><span class="t-body-title ink">${v}</span></span><span class="t-subtext-regular muted">${by}</span></div>`).join('')}`).join('')}</div>`);

/* ------------------------------------------------------------------ D · Tidy cards + history side sheet */
const cardD = a => `<div class="mk-dc"><span class="mk-dc__hd"><span class="t-body-title ink">${a.name}</span>${stText(a) || `<span class="t-small muted">${a.when}</span>`}</span>
  <span class="mk-dc__v"><span class="${a.u ? 't-large-title' : 't-minor-title'} ink ellipsis2">${a.v}</span>${a.u ? `<span class="t-body-regular navy">${a.u}</span>` : ''}<span class="sp"></span>${spark(a.spark, 84, 28)}</span>
  <span class="t-small muted">${a.st === 'ok' ? `${a.ago} · every ${a.every} days` : `Last ${a.when} · ${a.ago}`}</span></div>`;
const gridD = CATS.map(c => `<span class="sec-label t-small">${c.toUpperCase()}</span><div class="mk-dgrid">${byCat(c).map(cardD).join('')}</div>`).join('');
const fabD = `<span class="mk-fab t-body-title">${ic('plus', 'var(--on-primary)', 'app-icon--20')}Add reading</span>`;
const sheetD = `<div class="mk-dim"></div><div class="mk-side"><div class="mk-dh"><span class="ttl"><span class="mk-dh__n"><span class="t-medium-medium ink">Weight</span><span class="mk-st due t-subtext-title">Due</span></span><span class="t-subtext-regular muted">Ear Tag: 456789 · every 7 days</span></span>${ic('close', 'var(--on-surface-variant)', 'app-icon--24')}</div>
  <div class="mk-big"><span class="t-stat-title ink">54.3</span><span class="t-body-regular navy">kg</span><span class="trend trend--up t-subtext-title">${ic('dropdown', 'currentColor', 'app-icon--16', 'chev-u')}+0.1 kg</span><span class="sp"></span>${seg(['1M', '3M', '6M'], '3M')}</div>
  ${graph(W, 480, 170, [[0, '1 Aug'], [3, '22 Aug'], [5, '5 Sep'], [7, '19 Sep']])}
  <div class="mk-stats">${[['Average', '53.9'], ['Highest', '54.3'], ['Lowest', '53.1']].map(([k, v]) => `<div class="stat"><span class="t-small muted">${k}</span><span class="t-minor-title ink">${v} <span class="t-subtext-regular navy">kg</span></span></div>`).join('')}</div>
  <div class="mk-rh"><span class="t-minor-medium ink">History</span><span class="t-subtext-regular muted">34</span></div>${recRows(REC_W.slice(0, 4))}
  <div class="mk-side__ft"><span class="mk-btn mk-btn--ghost t-body-medium">${ic('reset', 'var(--on-surface-variant)', 'app-icon--20')}Same as last</span><span class="mk-btn mk-btn--primary mk-btn--grow t-body-title">${ic('plus', 'var(--on-primary)', 'app-icon--20')}Add Weight reading</span></div></div>`;
const D1 = frame(chips() + gridD, fabD);
const D2 = frame(chips() + gridD, sheetD);

/* ------------------------------------------------------------------ board */
const V = [
  ['A', 'List rows · expand in place', 'Each assessment is one row: value, trend, when, and a + button. Tapping a row opens its history right there (graph, last readings), with Add in the same place.', A1, 'Overview: 8 rows, grouped. “Up to date” isn’t written; only Due and Overdue show, in colour.', A2, 'Tap Weight: history opens under the row. + (or Add Weight reading) opens the number-pad sheet.', ['Densest: all 8 fit on one screen', 'History without leaving the list', 'Rows get tall when several are open']],
  ['B', 'Split view · list + detail', 'The iPad pattern (like Mail or Settings): the assessment list on the left, the chosen one on the right with graph, a new-reading box and history. You add a reading without opening anything.', B1, 'Weight: type the value in the box, tap Save. The new reading lands on top of History.', B2, 'Eye Condition (list type): the box turns into option chips, with how often each was seen.', ['Adding and history on one screen, no pop-ups', 'Each type gets its own quick input', 'Only one assessment shown at a time', 'Recommended'], true],
  ['C', 'To record + History', 'Built for rounds. “To record” lists what’s due, with inputs right in the list, so you can save several at once. “History” is one timeline of everything recorded for this animal.', C1, 'To record: fill Weight and Mood, then save them together. Up-to-date assessments sit underneath.', C2, 'History: a timeline across all assessments, grouped by day; chips narrow it to one.', ['Fastest for daily rounds', 'One timeline answers “what happened recently?”', 'Trends per assessment are less visible']],
  ['D', 'Tidy cards · side sheet', 'The current cards, cleaned up: no tinted header, no repeated category, no + on every card. One “Add reading” button. Tapping a card slides its history in from the right.', D1, 'Overview: quieter cards; only Due and Overdue are called out.', D2, 'Tap Weight: a side sheet with graph, stats and history; Add Weight reading sits at its foot.', ['Closest to what we have now', 'Very calm and easy to read', 'Two taps to add (open, then add)']],
];
document.getElementById('rules').innerHTML = `<span class="t-minor-title">What “clean” means here (applies to every variation)</span><ul class="t-body-regular">
  <li><b>One status language.</b> Only Due and Overdue are shown, in colour. “Up to date” is the normal state, so it isn’t labelled.</li>
  <li><b>No repeated text.</b> The category is the section heading, so cards and rows don’t repeat it. No tinted card headers.</li>
  <li><b>One add action per place.</b> Not a ⊕ on every card plus a floating button.</li>
  <li><b>The header shrinks.</b> Once you’re in the Assessment tab, the big photo collapses to a single row (as shown), so the content gets the screen.</li>
  <li><b>Chips carry the counts.</b> “Due 3” replaces the separate “8 Types · 5 up to date · 3 due” line.</li></ul>`;
document.getElementById('board').innerHTML = V.map(([k, t, d, f1, n1, f2, n2, pros, rec]) => `<section class="var${rec ? ' var--rec' : ''}"><div class="var__hd"><span class="var__k t-major-title">${k}</span><div class="var__t"><span class="t-medium-medium">${t}${rec ? ' <span class="var__rec t-subtext-title">Recommended</span>' : ''}</span><span class="t-body-regular d">${d}</span>
    <div class="var__pros">${pros.filter(p => p !== 'Recommended').map((p, i) => `<span class="t-subtext-regular">${i < 2 ? '＋' : '−'} ${p}</span>`).join('')}</div></div></div>
  <div class="shots"><div class="shot"><div class="shot__hd"><span class="t-subtext-title n">${k}1 · Overview</span><span class="t-subtext-regular note">${n1}</span></div>${f1}</div><div class="shot"><div class="shot__hd"><span class="t-subtext-title n">${k}2 · Add / history</span><span class="t-subtext-regular note">${n2}</span></div>${f2}</div></div></section>`).join('');
document.querySelectorAll('[data-scale]').forEach(b => b.onclick = () => { document.querySelectorAll('[data-scale]').forEach(x => x.classList.toggle('on', x === b)); document.body.style.setProperty('--s', b.dataset.scale); });
})();
