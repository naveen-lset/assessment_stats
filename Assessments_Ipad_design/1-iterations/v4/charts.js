/* Assessments · iPad v4 — the details sheet's charts (Figma 1566:2689 card, one chart per assessment type).
   Every chart sits on real calendar days (7d = the last 7 whole days, Wed 23 … Tue 29), shows the actual readings
   (value on each point, average line with its value) and draws 1:1 so a 10px label stays 10px.
     number  → the card's graph (m.viz: area · line · bars · lollipop), Y tight around the data
     scale   → same, Y = the scale's own steps with their names (5 Ideal)
     slider  → single value on its min…max; a range (Heart Rate) as a min–max capsule per reading
     list    → timeline grid: a row per option, a dot on each day it was recorded, count at the end
     text    → no chart (the sheet shows the latest note instead)
   o = { w: width px, h: height px (240), range: 'W' | 'M' | '3M' | '6M' (the sheet's H.range), few: label only latest / high / low, steps: Y steps (4), col: colour (else the card's rule), card: the Figma card graph (1566:2227) — smooth line, fill to the base, a ring on the latest, no grid / values / average; dates kept }.
   Tokens and type classes only. Uses core's C helpers. */
'use strict';
const DSC = (() => {
const { esc, fmt, numOf, fShort, TODAY, H } = C;
let gid = 0;   // one gradient id per chart: the card and the sheet can both be on screen in different colours
const DAY = 86400000, WK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAYS = { W: 7, M: 30, '3M': 90, '6M': 180 };
const TONE = { up: 'var(--primary-main)', down: 'var(--tertiary)', flat: 'var(--add-primary)' };

/* the window: N whole days ending today, so the header, the records and the chart all agree */
function win(key = H.range) {
  if (key === 'C' && H.custom) return { days: Math.round((H.custom.t1 - H.custom.t0) / DAY), t0: H.custom.t0, t1: H.custom.t1 };   // Custom: from / to, whole days
  const days = DAYS[key] || 30, end = new Date(TODAY); end.setHours(24, 0, 0, 0);
  return { days, t0: +end - days * DAY, t1: +end };
}
const inWin = (list, key) => { const w = win(key); return list.filter(r => +r.t >= w.t0 && +r.t < w.t1); };

/* round ticks over lo…hi (about 4 steps), never padded beyond one step */
function nice(lo, hi, steps = 4) {
  if (hi - lo < 1e-9) { const s = Math.max(Math.abs(hi) * .02, 1); lo -= s; hi += s; }
  const raw = (hi - lo) / steps, mag = 10 ** Math.floor(Math.log10(raw)), f = raw / mag;
  const step = (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * mag;
  const a = Math.floor(lo / step) * step, b = Math.ceil(hi / step) * step, dec = step % 1 ? (String(step).split('.')[1] || '').length : 0;
  return { lo: a, hi: b, ticks: Array.from({ length: Math.round((b - a) / step) + 1 }, (_, i) => +(a + step * i).toFixed(dec)), dec };
}

/* X labels on real days, kept few (about 5): 7d every day · up to 90 days a date every quarter of the range · longer, each month start. Always ends on the last day. */
function xTicks(w) {
  const out = [], dayAt = i => new Date(w.t0 + i * DAY);
  if (w.days <= 7) for (let i = 0; i < w.days; i++) { const d = dayAt(i); out.push({ t: w.t0 + (i + .5) * DAY, l: `${WK[d.getDay()]} ${d.getDate()}`, edge: w.t0 + i * DAY }); }
  else if (w.days <= 90) { const every = Math.ceil(w.days / 4); for (let i = w.days - 1; i >= 0; i -= every) out.unshift({ t: w.t0 + (i + .5) * DAY, l: fShort(dayAt(i)) }); }
  else for (let i = 0; i < w.days; i++) { const d = dayAt(i); if (d.getDate() === 1) out.push({ t: +d, l: C.fDate(d).split(' ')[1] }); }
  return out;
}

const dirOf = (m, l) => { if (l.length < 2) return 'flat'; const c = numOf(m, l[0]), p = numOf(m, l[1]); return Math.abs(c - p) < 1e-9 ? 'flat' : c > p ? 'up' : 'down'; };
const colOf = (m, l, viz) => { const d = dirOf(m, l); return viz === 'area' && d === 'flat' ? 'var(--moderate-secondary)' : viz === 'lollipop' ? 'var(--on-surface)' : TONE[d]; };
const short = (m, r) => m.type === 'slider' && Array.isArray(r.v) ? `${r.v[0]}–${r.v[1]}` : String(r.v);
const tipText = (m, r) => { const f = fmt(m, r); return `${f.v}${f.u ? ' ' + f.u : ''} · ${fShort(r.t)}, ${C.fTime(r.t)}`; };
const txt = (x, y, s, cls = 'axis', anchor = 'middle', type = 't-small') => `<text class="${cls} ${type}" x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="${anchor}">${esc(s)}</text>`;

/* tap / finger-scrub targets in the format touch.js T.scrub and core's h-tip expect */
const hit = (r, cx, cy, label, f) => `<rect class="hit" x="${(cx - 10).toFixed(1)}" y="${f.T}" width="20" height="${f.ph}" data-act="h-tip" data-v="${r.id}" data-cx="${cx.toFixed(1)}" data-cy="${cy.toFixed(1)}" data-label="${esc(label)}" data-top="${f.T}" data-bottom="${f.T + f.ph}" data-w="${f.W - f.R}" data-l="${f.L}"/>`;
function tip(cx, cy, label, f) {
  const tw = label.length * 6 + 16, tx = Math.min(Math.max(cx - tw / 2, f.L), f.W - f.R - tw), ty = Math.max(0, cy - 30);
  return `<g class="tip"><line x1="${cx}" x2="${cx}" y1="${f.T}" y2="${f.T + f.ph}" style="stroke:var(--on-primary-container);stroke-width:1"/><rect x="${tx}" y="${ty}" width="${tw}" height="22" rx="4"/><text class="t-small" x="${tx + tw / 2}" y="${ty + 14}" text-anchor="middle">${esc(label)}</text></g>`;
}
/* the shared frame: Y grid + values (+ unit / names), X day labels, day ticks on the baseline */
function frame(f, yTicks, yLab, w) {
  let s = yTicks.map(v => `<line class="grid" x1="${f.L}" x2="${f.W - f.R}" y1="${f.y(v).toFixed(1)}" y2="${f.y(v).toFixed(1)}"/>${txt(f.L - 8, f.y(v) + 3, yLab(v), 'axis', 'end')}`).join('');
  if (f.unit) s += txt(f.L - 8, 10, f.unit, 'axis', 'end');
  const base = f.T + f.ph;
  xTicks(w).forEach(k => { s += txt(f.x(k.t), base + (f.card ? 17 : 18), k.l); if (k.edge != null && k.edge > w.t0) s += `<line class="tick" x1="${f.x(k.edge).toFixed(1)}" x2="${f.x(k.edge).toFixed(1)}" y1="${base}" y2="${base + 5}"/>`; });
  return s;
}

/* ---------------- numbers · sliders · scales: one mark per reading at its real time ---------------- */
/* bars and lollipops stand on 0 (a bar's height is its value). At 3M / 6M they show the weekly average, so a mark never shrinks to a sliver. */
function series(m, list, o) {
  const w = win(o.range), pts = list.slice().reverse(), range = m.type === 'slider' && m.range, scale = m.type === 'scale';
  const viz = range ? 'range' : m.viz || 'area', col = o.col || (range ? 'var(--primary-main)' : colOf(m, list, viz)), u = fmt(m, pts[0]).u;
  const stand = viz === 'bars' || viz === 'lollipop', weekly = stand && w.days > 30;
  /* marks: raw readings, or weekly buckets (avg of the week, at the middle of the week) */
  let items = pts.map(r => ({ t: +r.t, v: numOf(m, r), lo: range ? r.v[0] : null, hi: range ? r.v[1] : null, id: r.id, lab: short(m, r), tip: tipText(m, r), day: Math.floor((+r.t - w.t0) / DAY) }));
  if (weekly) {
    const wk = {}; items.forEach(i => (wk[Math.floor(i.day / 7)] ||= []).push(i));
    items = Object.keys(wk).map(Number).sort((p, q) => p - q).map(k => { const g = wk[k], v = g.reduce((a, b) => a + b.v, 0) / g.length, d0 = new Date(w.t0 + k * 7 * DAY), r1 = +v.toFixed(1);
      return { t: w.t0 + (k * 7 + 3.5) * DAY, v, id: g[g.length - 1].id, lab: String(r1), tip: `Week of ${fShort(d0)} · avg ${r1}${u ? ' ' + u : ''} (${g.length} reading${g.length > 1 ? 's' : ''})`, slot: 7, day: k * 7 + 3.5 }; });
  }
  const vals = items.flatMap(i => range ? [i.lo, i.hi] : [i.v]), avg = pts.map(r => numOf(m, r)).reduce((a, b) => a + b, 0) / pts.length;
  let Y, yLab, L = 48;
  if (scale) { const steps = m.scale.map(x => +x[0]), lo = stand ? 0 : Math.min(...steps), hi = Math.max(...steps); Y = { lo, hi, ticks: [lo, Math.round((lo + hi) / 2), hi] }; yLab = v => String(v); L = 28; }   // a scale: its low · middle · top, numbers only
  else { Y = m.type === 'slider' && !range ? nice(+m.min, +m.max, o.steps || 2) : nice(stand ? 0 : Math.min(...vals), Math.max(...vals), o.steps || 2); yLab = v => v.toFixed(Y.dec); L = 8 + Math.max(...Y.ticks.map(v => v.toFixed(Y.dec).length)) * 6 + 8; }   // about three round values, the left margin just wide enough for them
  if (o.card) L = 8;   // card look: no Y numbers or grid, like the small card graphs — the points carry their values
  const W = o.w, T = o.card ? 8 : 28, B = o.card ? 24 : 32, R = 12, Hh = o.h || 240, ph = Hh - T - B, pw = W - L - R;
  const f = { W, L, R, T, ph, card: !!o.card, unit: '', x: t => L + ((t - w.t0) / (w.t1 - w.t0)) * pw, y: v => T + ph - ((v - Y.lo) / (Y.hi - Y.lo)) * ph };
  const base = T + ph, slotW = pw / w.days * (weekly ? 7 : 1), bw = Math.max(4, Math.min(28, slotW * .6));
  /* a bar / capsule stands on its day (or week); two readings on one day sit side by side */
  const same = {}; items.forEach(i => { const k = Math.floor(i.day); (same[k] ||= []).push(i); });
  const onSlot = viz === 'bars' || viz === 'range';
  const X = items.map(i => { if (!onSlot) return f.x(i.t); if (weekly) return f.x(i.t); const g = same[Math.floor(i.day)], k = Math.floor(i.day); return f.x(w.t0 + (k + .5) * DAY) - bw / 2 + bw / g.length * (g.indexOf(i) + .5); });
  const BW = items.map(i => onSlot && !weekly ? Math.max(3, bw / same[Math.floor(i.day)].length - 2) : bw);
  const Yv = items.map(i => f.y(range ? i.hi : i.v));
  let s = frame(f, o.card ? [] : Y.ticks, yLab, w);
  const v = items.map(i => i.v), iHi = v.indexOf(Math.max(...v)), iLo = v.lastIndexOf(Math.min(...v));
  if (!o.card) s += `<line class="avgline" x1="${L}" x2="${W - R}" y1="${f.y(avg).toFixed(1)}" y2="${f.y(avg).toFixed(1)}"/>`;   // its value is the headline above the chart
  s += '<g class="mk">';   // the marks reveal left → right when the chart is drawn in (.ds-anim / .ad-in)
  if (viz === 'range') s += items.map((i, k) => `<rect class="br" style="--k:${k}" x="${(X[k] - BW[k] / 2).toFixed(1)}" y="${Yv[k].toFixed(1)}" width="${BW[k].toFixed(1)}" height="${Math.max(3, f.y(i.lo) - f.y(i.hi)).toFixed(1)}" rx="${Math.min(6, BW[k] / 2).toFixed(1)}" style="fill:${col}"/>`).join('');
  else if (viz === 'bars') s += items.map((i, k) => `<rect class="br" x="${(X[k] - BW[k] / 2).toFixed(1)}" y="${Yv[k].toFixed(1)}" width="${BW[k].toFixed(1)}" height="${Math.max(2, base - Yv[k]).toFixed(1)}" rx="3" style="--k:${k};fill:${col};opacity:${items.length > 1 ? (.35 + .65 * k / (items.length - 1)).toFixed(2) : 1}"/>`).join('');   // the card's bars: fade in toward the latest
  else if (viz === 'lollipop') s += items.map((i, k) => `<line class="ln" pathLength="1" x1="${X[k].toFixed(1)}" x2="${X[k].toFixed(1)}" y1="${base}" y2="${Yv[k].toFixed(1)}" style="stroke:${col};stroke-width:2"/><circle class="dt" cx="${X[k].toFixed(1)}" cy="${Yv[k].toFixed(1)}" r="4" style="fill:${col}"/>`).join('');
  else {
    const line = items.map((i, k) => `${X[k].toFixed(1)},${Yv[k].toFixed(1)}`).join(' '), n = items.length;
    const curve = items.map((i, k) => k ? `C${((X[k - 1] + X[k]) / 2).toFixed(1)},${Yv[k - 1].toFixed(1)} ${((X[k - 1] + X[k]) / 2).toFixed(1)},${Yv[k].toFixed(1)} ${X[k].toFixed(1)},${Yv[k].toFixed(1)}` : `M${X[0].toFixed(1)},${Yv[0].toFixed(1)}`).join(' ');   // the card graph's smooth line (Figma 1566:2227)
    if (o.card && n > 1) { const id = `dsF${++gid}`;   // Figma card graph: fill .55 → .04 to the baseline, line 2px at 85 %, round ends, a white ring on the latest only
      s += `<defs><linearGradient id="${id}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" style="stop-color:${col};stop-opacity:.55"/><stop offset="1" style="stop-color:${col};stop-opacity:.04"/></linearGradient></defs><path d="${curve} L${X[n - 1].toFixed(1)},${base} L${X[0].toFixed(1)},${base} Z" fill="url(#${id})" class="ar"/><path class="ln" pathLength="1" d="${curve}" fill="none" style="stroke:${col};stroke-width:2;stroke-opacity:.85;stroke-linecap:round;stroke-linejoin:round"/><circle class="dt" cx="${X[n - 1].toFixed(1)}" cy="${Yv[n - 1].toFixed(1)}" r="4" style="fill:var(--on-primary);stroke:${col};stroke-width:1.6"/>`;
    } else {
      if (viz === 'area' && n > 1) s += `<defs><linearGradient id="dsF${++gid}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" style="stop-color:${col};stop-opacity:.35"/><stop offset="1" style="stop-color:${col};stop-opacity:.03"/></linearGradient></defs><polygon points="${X[0].toFixed(1)},${base} ${line} ${X[n - 1].toFixed(1)},${base}" fill="url(#dsF${gid})" class="ar"/>`;
      if (n > 1) s += `<polyline class="ln" pathLength="1" points="${line}" fill="none" style="stroke:${col};stroke-width:2;stroke-linejoin:round${viz === 'line' ? ';stroke-dasharray:4 4' : ''}"/>`;
      s += items.map((i, k) => `<circle class="dt" cx="${X[k].toFixed(1)}" cy="${Yv[k].toFixed(1)}" r="${k === n - 1 ? 5 : n > 40 ? 2.5 : 3.5}" style="fill:${viz === 'line' ? col : 'var(--on-primary)'};stroke:${col};stroke-width:2"/>`).join('');
    }
  }
  s += '</g>';
  /* the actual values: on every mark when there are few, else on the latest, highest and lowest */
  const keep = items.length <= 12 && !o.few ? null : new Set([items.length - 1, iHi, iLo]);
  if (!o.card) s += items.map((i, k) => !keep || keep.has(k) ? txt(X[k], Yv[k] - 9, i.lab, 'val') : '').join('');
  s += items.map((i, k) => hit({ id: i.id }, X[k], Yv[k], i.tip, f)).join('');
  const tr = items.findIndex(i => i.id === H.tip); if (tr > -1) s += tip(X[tr], Yv[tr], items[tr].tip, f);
  return `<svg viewBox="0 0 ${W} ${Hh}" style="height:${Hh}px" role="img" aria-label="${esc(m.name)}: ${pts.length} readings${weekly ? ', weekly averages' : ''}">${s}</svg>`;
}

/* ---------------- lists: timeline grid — which option was recorded on which day ---------------- */
function grid(m, list, o) {
  const w = win(o.range), pts = list.slice().reverse(), cnt = {}; m.items.forEach(k => cnt[k] = 0); pts.forEach(r => r.v.forEach(k => cnt[k] = (cnt[k] || 0) + 1));
  const rows = Object.keys(cnt).sort((p, q) => cnt[q] - cnt[p]), col = { bad: 'var(--tertiary)', good: 'var(--primary-main)', mid: 'var(--moderate-secondary)' }[m.tone || 'mid'];
  const W = o.w, L = 104, R = 40, T = 8, RH = 32, ph = rows.length * RH, B = 32, Hh = T + ph + B, pw = W - L - R;
  const f = { W, L, R, T, ph, x: t => L + ((t - w.t0) / (w.t1 - w.t0)) * pw }, ry = i => T + i * RH + RH / 2;
  let s = rows.map((k, i) => `<line class="grid" x1="${L}" x2="${W - R}" y1="${ry(i)}" y2="${ry(i)}"/><text class="lab t-subtext-regular" x="0" y="${ry(i) + 4}">${esc(k)}</text><text class="axis t-subtext-regular" x="${W}" y="${ry(i) + 4}" text-anchor="end">${cnt[k]}×</text>`).join('');
  xTicks(w).forEach(k => { s += txt(f.x(k.t), T + ph + 18, k.l); if (k.edge != null && k.edge > w.t0) s += `<line class="tick" x1="${f.x(k.edge).toFixed(1)}" x2="${f.x(k.edge).toFixed(1)}" y1="${T + ph}" y2="${T + ph + 5}"/>`; });
  const dot = w.days > 30 ? 4 : 6;   // smaller on long ranges so busy weeks stay apart
  s += '<g class="mk">' + pts.map(r => r.v.map(k => `<circle class="dt" cx="${f.x(+r.t).toFixed(1)}" cy="${ry(rows.indexOf(k))}" r="${dot}" style="fill:${col}"/>`).join('')).join('') + '</g>';
  s += pts.map(r => hit(r, f.x(+r.t), ry(rows.indexOf(r.v[0])), tipText(m, r), f)).join('');
  const tr = pts.find(r => r.id === H.tip); if (tr) s += tip(f.x(+tr.t), ry(rows.indexOf(tr.v[0])), tipText(m, tr), f);
  return `<svg viewBox="0 0 ${W} ${Hh}" style="height:${Hh}px" role="img" aria-label="${esc(m.name)}: ${pts.length} readings">${s}</svg>`;
}

function chart(m, list, o) {
  if (!list.length || m.type === 'text') return '';
  return `<div class="graph ds-graph">${m.type === 'list' ? grid(m, list, o) : series(m, list, o)}</div>`;
}
return { win, inWin, chart };
})();
