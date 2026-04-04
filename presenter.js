/* ============================================
   VEIN PITCH DECK — Presenter Overlay
   ============================================ */
(function () {
  'use strict';

  var TOTAL_TIME_SEC = 300; // 5 minutes
  var AUTO_HIDE_MS = 5000;

  var overlay = document.getElementById('presenter-overlay');
  var isVisible = false;
  var timerStarted = false;
  var startTime = null;
  var timerInterval = null;
  var hideTimeout = null;

  // --- Build overlay DOM ---
  overlay.innerHTML = '<div class="presenter-counter"><span id="pres-slide-num">1</span> / <span id="pres-slide-total">10</span></div>' +
    '<div class="presenter-timer"><div id="pres-elapsed">0:00</div><div class="remaining" id="pres-remaining">5:00 left</div></div>' +
    '<div class="presenter-notes" id="pres-notes"></div>' +
    '<div style="font-size:0.7rem;opacity:0.35;white-space:nowrap;">P toggle · T reset · B bar</div>';

  var elSlideNum = document.getElementById('pres-slide-num');
  var elSlideTotal = document.getElementById('pres-slide-total');
  var elElapsed = document.getElementById('pres-elapsed');
  var elRemaining = document.getElementById('pres-remaining');
  var elNotes = document.getElementById('pres-notes');

  function show() {
    isVisible = true;
    overlay.classList.add('visible');
    overlay.classList.remove('fading');
    resetHideTimer();
    if (!timerStarted) startTimer();
  }

  function hide() {
    isVisible = false;
    overlay.classList.remove('visible');
  }

  function toggle() { isVisible ? hide() : show(); }

  function startTimer() {
    timerStarted = true;
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 500);
  }

  function resetTimer() {
    startTime = Date.now();
    updateTimer();
  }

  function updateTimer() {
    if (!startTime) return;
    var elapsed = Math.floor((Date.now() - startTime) / 1000);
    var remaining = Math.max(0, TOTAL_TIME_SEC - elapsed);
    elElapsed.textContent = formatTime(elapsed);
    elRemaining.textContent = formatTime(remaining) + ' left';
    // Color coding: red under 1 min, orange under 2 min
    if (remaining <= 60) elRemaining.style.color = '#ef4444';
    else if (remaining <= 120) elRemaining.style.color = '#E68C3A';
    else elRemaining.style.color = '';
  }

  function formatTime(sec) {
    return Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0');
  }

  function resetHideTimer() {
    clearTimeout(hideTimeout);
    overlay.classList.remove('fading');
    hideTimeout = setTimeout(function() {
      if (isVisible) overlay.classList.add('fading');
    }, AUTO_HIDE_MS);
  }

  // Listen for slidechange events from deck.js
  document.addEventListener('slidechange', function(e) {
    var d = e.detail;
    elSlideNum.textContent = d.isAppendix ? 'A' + (d.index - d.coreTotal + 1) : String(d.coreIndex + 1);
    elSlideTotal.textContent = d.coreTotal;
    elNotes.textContent = d.notes;
  });

  // Keyboard
  document.addEventListener('keydown', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    switch (e.key) {
      case 'p': case 'P':
        if (e.shiftKey) return;
        toggle();
        break;
      case 't': case 'T': resetTimer(); break;
      case 'b': case 'B':
        var bar = document.getElementById('progress-bar');
        if (bar) bar.style.display = bar.style.display === 'none' ? '' : 'none';
        break;
    }
  });

  // Mouse/key activity resets auto-hide
  document.addEventListener('mousemove', function() { if (isVisible) resetHideTimer(); });
  document.addEventListener('keydown', function() { if (isVisible) resetHideTimer(); });
})();
