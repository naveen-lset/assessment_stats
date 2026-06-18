/* ===========================================================================
   Scroll-through shim
   ---------------------------------------------------------------------------
   The agentation feedback tool drops a full-viewport capture overlay on top of
   the page while its annotation mode is active. That overlay swallows wheel /
   touch gestures before they reach the prototype's inner `.scroll`, so the page
   appears frozen while you're annotating.

   This forwards those gestures to the active screen's scroller — but ONLY when
   the gesture lands OUTSIDE the scroller (i.e. on an overlay). When you interact
   directly with the prototype the event target is inside `.scroll`, we do
   nothing, and native scrolling/momentum behaves exactly as before (no
   double-scroll). Taps don't move, so they still register as annotations; only
   drags scroll.
   =========================================================================== */
(function () {
  function activeScroll() {
    // An open bottom sheet is the topmost scroller and must win — it sits AFTER
    // the screen in the DOM, so a combined selector would wrongly pick the
    // background screen's .scroll instead.
    return document.querySelector('.sheet2-scrim.open .sheet2')
        || document.querySelector('.screen.active .scroll');
  }
  // wheel (desktop / trackpad)
  window.addEventListener('wheel', function (e) {
    var sc = activeScroll();
    if (!sc || sc.contains(e.target)) return;   // native handles direct scroll
    sc.scrollTop += e.deltaY;
    sc.scrollLeft += e.deltaX;
    e.preventDefault();
  }, { passive: false, capture: true });

  // touch (mobile / responsive preview)
  var lastY = 0, dragging = false;
  window.addEventListener('touchstart', function (e) {
    var sc = activeScroll();
    if (sc && !sc.contains(e.target) && e.touches.length === 1) {
      lastY = e.touches[0].clientY;
      dragging = true;
    } else {
      dragging = false;
    }
  }, { passive: true, capture: true });

  window.addEventListener('touchmove', function (e) {
    if (!dragging) return;
    var sc = activeScroll();
    if (!sc) { dragging = false; return; }
    var y = e.touches[0].clientY;
    sc.scrollTop += (lastY - y);
    lastY = y;
    e.preventDefault();   // claim the gesture as a scroll, not an annotation
  }, { passive: false, capture: true });

  window.addEventListener('touchend', function () { dragging = false; }, { capture: true });
})();
