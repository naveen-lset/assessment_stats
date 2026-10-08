/* Assessments · iPad v4 — tablet interaction layer.
   Everything here is how the product *behaves* under a finger, independent of any one screen:
   haptic tick · press feedback · swipe-to-reveal row actions · long-press context menu · swipe-from-edge to go back ·
   bottom-sheet drag (detents + drag to dismiss) · pull to refresh · finger-scrub on graphs · sliding segmented indicator ·
   shake on invalid · hold ⌘ for the shortcut sheet. Pointer Events throughout, so it works with touch, Apple Pencil and a mouse. */
'use strict';
const T = (() => {
  const haptic = (ms = 8) => { try { navigator.vibrate?.(ms); } catch (e) { /* iPadOS has no vibrate; the visual feedback carries it */ } };
  let blockUntil = 0;
  const blockClick = () => { blockUntil = Date.now() + 350; };
  document.addEventListener('click', e => { if (Date.now() < blockUntil) { e.stopPropagation(); e.preventDefault(); } }, true);   // a drag or long-press must not also "tap"
  document.addEventListener('touchstart', () => {}, { passive: true });   // lets :active paint immediately on iPad Safari

  const shake = el => { if (!el) return; el.classList.remove('is-shake'); void el.offsetWidth; el.classList.add('is-shake'); haptic(20); };

  /* ---------------- swipe-to-reveal: .sw > .sw__acts + .sw__row ---------------- */
  function swipeRows(root) {
    let cur = null, openEl = null;
    const close = el => { if (!el) return; const r = el.querySelector('.sw__row'); if (r) r.style.transform = ''; el.classList.remove('open'); if (openEl === el) openEl = null; };
    root.addEventListener('pointerdown', e => {
      const el = e.target.closest('.sw');
      if (openEl && openEl !== el && openEl.isConnected) close(openEl);
      if (!el || e.button > 0 || e.target.closest('.sw__acts')) return;
      const acts = el.querySelector('.sw__acts');
      cur = { el, row: el.querySelector('.sw__row'), x: e.clientX, y: e.clientY, w: acts.offsetWidth, base: el.classList.contains('open') ? -acts.offsetWidth : 0, t: 0, drag: false, id: e.pointerId };
    });
    root.addEventListener('pointermove', e => {
      if (!cur || e.pointerId !== cur.id) return;
      const dx = e.clientX - cur.x, dy = e.clientY - cur.y;
      if (!cur.drag) { if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 1.4) { cur.drag = true; cur.row.style.transition = 'none'; cur.el.classList.add('dragging'); try { cur.row.setPointerCapture(e.pointerId); } catch (x) {} } else if (Math.abs(dy) > 10) { cur = null; return; } else return; }
      let t = Math.min(0, cur.base + dx); if (t < -cur.w) t = -cur.w + (t + cur.w) * .35;   // rubber-band past the actions
      if (t < -cur.w * 1.5 && !cur.armed) { cur.armed = true; haptic(); cur.el.classList.add('armed'); } else if (t >= -cur.w * 1.5 && cur.armed) { cur.armed = false; cur.el.classList.remove('armed'); }
      cur.t = t; cur.row.style.transform = `translateX(${t}px)`;
    });
    const end = () => {
      if (!cur) return; const c = cur; cur = null; if (!c.drag) return;
      c.row.style.transition = ''; c.el.classList.remove('dragging', 'armed'); blockClick();
      if (c.t < -c.w * 1.5) { close(c.el); c.el.querySelector('.sw__acts [data-act]')?.click(); return; }   // full swipe = first action
      if (c.t < -c.w * .4) { c.row.style.transform = `translateX(${-c.w}px)`; c.el.classList.add('open'); openEl = c.el; haptic(4); } else close(c.el);
    };
    root.addEventListener('pointerup', end); root.addEventListener('pointercancel', end);
    root.addEventListener('click', e => { if (openEl && !e.target.closest('.sw__acts')) { const was = openEl; close(openEl); if (e.target.closest('.sw') === was) { e.stopPropagation(); e.preventDefault(); } } }, true);
  }

  /* ---------------- long-press → context menu (also right-click / two-finger tap) ---------------- */
  function longPress(root, cb) {
    let timer = null, start = null;
    const cancel = () => { clearTimeout(timer); timer = null; start?.el.classList.remove('is-holding'); start = null; };
    root.addEventListener('pointerdown', e => {
      const el = e.target.closest('[data-lp]'); if (!el || e.button > 0) return;
      start = { el, x: e.clientX, y: e.clientY }; el.classList.add('is-holding');
      timer = setTimeout(() => { const s = start; cancel(); if (!s) return; haptic(15); blockClick(); cb(s.el, s.x, s.y); }, 480);
    });
    root.addEventListener('pointermove', e => { if (start && Math.hypot(e.clientX - start.x, e.clientY - start.y) > 8) cancel(); });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(t => root.addEventListener(t, cancel));
    root.addEventListener('contextmenu', e => { const el = e.target.closest('[data-lp]'); if (!el) return; e.preventDefault(); cancel(); cb(el, e.clientX, e.clientY); });
  }

  /* ---------------- swipe from the left edge of a pane to go back ---------------- */
  function edgeBack(root, paneSel, canBack, onBack) {
    let cur = null;
    root.addEventListener('pointerdown', e => {
      const pane = e.target.closest(paneSel); if (!pane || !canBack() || e.button > 0) return;
      const r = pane.getBoundingClientRect(); if (e.clientX - r.left > 28) return;
      cur = { pane, stack: pane.querySelector('.stack'), x: e.clientX, y: e.clientY, dx: 0, drag: false, w: r.width, id: e.pointerId };
    });
    root.addEventListener('pointermove', e => {
      if (!cur || e.pointerId !== cur.id) return; const dx = e.clientX - cur.x, dy = e.clientY - cur.y;
      if (!cur.drag) { if (dx > 8 && dx > Math.abs(dy)) { cur.drag = true; cur.stack.style.transition = 'none'; cur.pane.classList.add('is-backing'); } else if (Math.abs(dy) > 10) { cur = null; return; } else return; }
      cur.dx = Math.max(0, dx); cur.stack.style.transform = `translateX(${cur.dx}px)`; cur.stack.style.opacity = String(1 - cur.dx / cur.w * .5);
    });
    const end = () => {
      if (!cur) return; const c = cur; cur = null; if (!c.drag) return; blockClick();
      c.stack.style.transition = ''; c.pane.classList.remove('is-backing');
      if (c.dx > Math.min(120, c.w * .3)) { c.stack.style.transform = `translateX(${c.w}px)`; c.stack.style.opacity = '0'; haptic(); setTimeout(onBack, 160); }
      else { c.stack.style.transform = ''; c.stack.style.opacity = ''; }
    };
    root.addEventListener('pointerup', end); root.addEventListener('pointercancel', end);
  }

  /* ---------------- bottom sheet: drag the grabber / header ---------------- */
  function sheetDrag(sheet, onClose) {
    let cur = null;
    sheet.addEventListener('pointerdown', e => { if (!e.target.closest('[data-drag]') || e.target.closest('button')) return; cur = { y: e.clientY, dy: 0, t: Date.now(), id: e.pointerId }; sheet.style.transition = 'none'; try { sheet.setPointerCapture(e.pointerId); } catch (x) {} });
    sheet.addEventListener('pointermove', e => { if (!cur || e.pointerId !== cur.id) return; cur.dy = e.clientY - cur.y; sheet.style.transform = `translateY(${cur.dy > 0 ? cur.dy : cur.dy * .25}px)`; });
    const end = () => {
      if (!cur) return; const c = cur; cur = null; sheet.style.transition = '';
      const v = c.dy / Math.max(1, Date.now() - c.t);   // px per ms, a flick closes even when short
      if (c.dy > 140 || v > .6) { if (sheet.dataset.detent === 'large' && c.dy < 260 && v <= .6) { sheet.dataset.detent = 'medium'; sheet.style.transform = ''; haptic(); } else { haptic(); onClose(); } }
      else if (c.dy < -60) { sheet.dataset.detent = 'large'; sheet.style.transform = ''; haptic(); }
      else sheet.style.transform = '';
      if (Math.abs(c.dy) > 6) blockClick();
    };
    sheet.addEventListener('pointerup', end); sheet.addEventListener('pointercancel', end);
  }

  /* ---------------- pull to refresh on a scroll area marked [data-ptr] ---------------- */
  function pullToRefresh(root, onRefresh) {
    let cur = null;
    const start = (el, y) => { if (el.scrollTop > 0) return; cur = { el, y, dy: 0, ind: el.parentElement.querySelector('.ptr') }; };   // the indicator sits behind the list, outside the scroll area
    const move = y => { if (!cur) return; cur.dy = Math.max(0, y - cur.y); if (!cur.dy) return; const d = Math.min(96, cur.dy * .5); cur.el.style.transform = `translateY(${d}px)`; cur.el.style.transition = 'none'; if (cur.ind) { cur.ind.classList.toggle('ready', d > 56); cur.ind.style.opacity = String(Math.min(1, d / 56)); } };
    const end = () => { if (!cur) return; const c = cur; cur = null; c.el.style.transition = ''; const ready = c.dy * .5 > 56; if (ready) { haptic(); c.ind?.classList.add('spin'); c.el.style.transform = 'translateY(48px)'; setTimeout(() => { c.el.style.transform = ''; c.ind?.classList.remove('spin', 'ready'); onRefresh(); }, 650); } else c.el.style.transform = ''; };
    root.addEventListener('touchstart', e => { const el = e.target.closest('[data-ptr]'); if (el) start(el, e.touches[0].clientY); }, { passive: true });
    root.addEventListener('touchmove', e => { if (cur) { move(e.touches[0].clientY); if (cur?.dy > 0) e.preventDefault(); } }, { passive: false });
    root.addEventListener('touchend', end);
    root.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; const el = e.target.closest('[data-ptr]'); if (el && !e.target.closest('button, input')) start(el, e.clientY); });
    root.addEventListener('pointermove', e => { if (e.pointerType === 'mouse' && cur && e.buttons) move(e.clientY); });
    root.addEventListener('pointerup', e => { if (e.pointerType === 'mouse' && cur) { if (cur.dy > 6) blockClick(); end(); } });
  }

  /* ---------------- finger-scrub on graphs: crosshair + value follow the finger ---------------- */
  function scrub(root) {
    let on = null;
    const show = (svg, clientX) => {
      const hits = [...svg.querySelectorAll('.hit')]; if (!hits.length) return;
      const pt = svg.createSVGPoint(); pt.x = clientX; pt.y = 0; const x = pt.matrixTransform(svg.getScreenCTM().inverse()).x;
      let best = hits[0]; for (const h of hits) if (Math.abs(+h.dataset.cx - x) < Math.abs(+best.dataset.cx - x)) best = h;
      if (on === best) return; on = best;
      svg.querySelector('.tip')?.remove();
      const d = best.dataset, label = d.label, tw = label.length * 6 + 16, tx = Math.min(Math.max(+d.cx - tw / 2, +d.l), +d.w - tw), ty = Math.max(0, +d.cy - 30);
      svg.insertAdjacentHTML('beforeend', `<g class="tip"><line x1="${d.cx}" x2="${d.cx}" y1="${d.top}" y2="${d.bottom}" style="stroke:var(--on-primary-container);stroke-width:1"/><circle cx="${d.cx}" cy="${d.cy}" r="5" style="fill:var(--on-primary-container);stroke:var(--on-primary);stroke-width:2"/><rect x="${tx}" y="${ty}" width="${tw}" height="22" rx="4"/><text class="t-small" x="${tx + tw / 2}" y="${ty + 14}" text-anchor="middle">${label}</text></g>`);
      haptic(3);
    };
    root.addEventListener('pointerdown', e => { const svg = e.target.closest('.graph svg'); if (!svg) return; on = null; svg.dataset.scrub = '1'; show(svg, e.clientX); try { svg.setPointerCapture(e.pointerId); } catch (x) {} });
    root.addEventListener('pointermove', e => { const svg = e.target.closest?.('.graph svg[data-scrub]') || root.querySelector('.graph svg[data-scrub]'); if (svg && e.buttons) show(svg, e.clientX); });
    const end = () => { root.querySelectorAll('.graph svg[data-scrub]').forEach(s => { delete s.dataset.scrub; if (on) blockClick(); }); };
    root.addEventListener('pointerup', end); root.addEventListener('pointercancel', end);
  }

  /* ---------------- sliding indicator for .app-segmented[data-seg] (FLIP between renders) ---------------- */
  const segPos = {};
  function segments(root) {
    root.querySelectorAll('.app-segmented[data-seg]').forEach(g => {
      const act = g.querySelector('.app-segment--active'); if (!act) return;
      g.classList.add('has-ind');   // positioned first, so offsetLeft is measured against the control itself
      const key = g.dataset.seg, now = { l: act.offsetLeft, w: act.offsetWidth };
      const ind = document.createElement('span'); ind.className = 'seg-ind'; g.prepend(ind);
      const prev = segPos[key];
      ind.style.transform = `translateX(${(prev || now).l}px)`; ind.style.width = `${(prev || now).w}px`;
      if (prev && (prev.l !== now.l || prev.w !== now.w)) requestAnimationFrame(() => requestAnimationFrame(() => { ind.style.transform = `translateX(${now.l}px)`; ind.style.width = `${now.w}px`; }));
      segPos[key] = now;
    });
  }

  /* ---------------- hold ⌘ for the shortcut sheet (as iPadOS does) ---------------- */
  function shortcutSheet(app, list) {
    let t = null; const el = document.createElement('div'); el.className = 'kbd-sheet'; el.hidden = true;
    el.innerHTML = `<span class="t-body-title">Keyboard shortcuts</span>${list.map(([k, d]) => `<span class="kbd-row"><span class="t-body-regular">${d}</span><kbd class="t-body-title">${k}</kbd></span>`).join('')}`;
    app.append(el);
    document.addEventListener('keydown', e => { if (e.key === 'Meta' && !t) t = setTimeout(() => { el.hidden = false; }, 700); else if (e.key !== 'Meta') { clearTimeout(t); t = null; el.hidden = true; } });
    document.addEventListener('keyup', e => { if (e.key === 'Meta') { clearTimeout(t); t = null; el.hidden = true; } });
    addEventListener('blur', () => { clearTimeout(t); t = null; el.hidden = true; });
  }

  return { haptic, shake, blockClick, swipeRows, longPress, edgeBack, sheetDrag, pullToRefresh, scrub, segments, shortcutSheet };
})();
