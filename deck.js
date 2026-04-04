/* ============================================
   VEIN PITCH DECK — Navigation & Animation
   ============================================ */

(function () {
  'use strict';

  // --- Constants ---
  const CORE_SLIDE_COUNT = 10;

  // --- DOM ---
  const deck = document.getElementById('deck');
  const progressBar = document.getElementById('progress-bar');
  const slides = Array.from(document.querySelectorAll('.slide'));
  const coreSlides = slides.filter(s => !s.dataset.appendix);
  let currentIndex = 0;
  let isOverview = false;

  // --- goToSlide: scrolls to slide at index ---
  function goToSlide(index) {
    if (index < 0 || index >= slides.length) return;
    currentIndex = index;
    slides[index].scrollIntoView({ behavior: 'smooth' });
    updateProgress();
    dispatchSlideChange();
  }

  function nextSlide() { goToSlide(Math.min(currentIndex + 1, slides.length - 1)); }
  function prevSlide() { goToSlide(Math.max(currentIndex - 1, 0)); }

  // --- Progress bar: based on core slides only (10), caps at 100% ---
  function updateProgress() {
    var coreIndex = Math.min(currentIndex, CORE_SLIDE_COUNT - 1);
    progressBar.style.width = ((coreIndex + 1) / CORE_SLIDE_COUNT * 100) + '%';
  }

  // --- slidechange custom event: consumed by presenter.js ---
  function dispatchSlideChange() {
    var slide = slides[currentIndex];
    document.dispatchEvent(new CustomEvent('slidechange', {
      detail: {
        index: currentIndex,
        total: slides.length,
        coreIndex: Math.min(currentIndex, CORE_SLIDE_COUNT - 1),
        coreTotal: CORE_SLIDE_COUNT,
        title: slide.dataset.title || '',
        notes: slide.dataset.notes || '',
        isAppendix: !!slide.dataset.appendix,
      }
    }));
  }

  // --- IntersectionObserver: detects which slide is in view during scroll ---
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
        var idx = slides.indexOf(entry.target);
        if (idx !== -1 && idx !== currentIndex) {
          currentIndex = idx;
          updateProgress();
          dispatchSlideChange();
        }
      }
    });
  }, { threshold: 0.5 });

  slides.forEach(function(slide) { observer.observe(slide); });

  // --- Keyboard navigation ---
  document.addEventListener('keydown', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    switch (e.key) {
      case 'ArrowRight': case 'ArrowDown': e.preventDefault(); nextSlide(); break;
      case ' ': e.preventDefault(); nextSlide(); break;
      case 'ArrowLeft': case 'ArrowUp': e.preventDefault(); prevSlide(); break;
      case 'Home': e.preventDefault(); goToSlide(0); break;
      case 'End': e.preventDefault(); goToSlide(slides.length - 1); break;
      case 'f': case 'F': toggleFullscreen(); break;
      case 'o': case 'O': toggleOverview(); break;
      case '1': case '2': case '3': case '4': case '5':
      case '6': case '7': case '8': case '9':
        e.preventDefault(); goToSlide(parseInt(e.key) - 1); break;
      case '0': e.preventDefault(); goToSlide(9); break;
    }
  });

  // --- Fullscreen ---
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(function(){});
    } else {
      document.exitFullscreen();
    }
  }

  // --- Overview mode: shows all slides in a grid ---
  function toggleOverview() {
    isOverview = !isOverview;
    document.body.classList.toggle('overview-mode', isOverview);
    if (isOverview) {
      document.documentElement.style.scrollSnapType = 'none';
      slides.forEach(function(s) { s.addEventListener('click', handleOverviewClick); });
    } else {
      document.documentElement.style.scrollSnapType = 'y mandatory';
      slides.forEach(function(s) { s.removeEventListener('click', handleOverviewClick); });
      goToSlide(currentIndex);
    }
  }

  function handleOverviewClick(e) {
    var idx = slides.indexOf(e.currentTarget);
    toggleOverview();
    setTimeout(function() { goToSlide(idx); }, 50);
  }

  // --- Click to advance (non-interactive elements) ---
  deck.addEventListener('click', function(e) {
    if (isOverview) return;
    if (e.target.closest('a, button, .founder-linkedin')) return;
    var rect = deck.getBoundingClientRect();
    if (e.clientX > rect.left + rect.width * 0.3) { nextSlide(); }
    else { prevSlide(); }
  });

  // Initialize
  updateProgress();
  dispatchSlideChange();

  // ======================================================
  // GSAP ANIMATION SYSTEM
  // ======================================================
  gsap.registerPlugin(ScrollTrigger);

  var DURATION = 0.6;
  var EASE = 'power2.out';
  var STAGGER = 0.12;
  var REVEAL_Y = 40;
  var COUNT_DURATION = 1.5;
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {

    // --- Per-slide ScrollTrigger ---
    slides.forEach(function(slide) {
      var content = slide.querySelector('.slide-content');
      if (!content) return;
      var slideTl = null;

      ScrollTrigger.create({
        trigger: slide,
        start: 'top 60%',
        end: 'bottom 20%',
        onEnter: function() {
          if (slideTl) { slideTl.restart(); return; }
          slideTl = gsap.timeline();
          var tl = slideTl;

          // Common elements
          var eyebrow = content.querySelector('.eyebrow');
          if (eyebrow) tl.from(eyebrow, { opacity: 0, y: 20, duration: DURATION * 0.6, ease: EASE }, 0);

          var h2 = content.querySelector('h2');
          if (h2) tl.from(h2, { opacity: 0, y: REVEAL_Y, duration: DURATION, ease: EASE }, 0.1);

          var subhead = content.querySelector('.subhead');
          if (subhead) tl.from(subhead, { opacity: 0, y: 20, duration: DURATION, ease: EASE }, 0.2);

          // Title slide
          var logo = content.querySelector('.title-logo');
          if (logo) tl.from(logo, { opacity: 0, scale: 0.8, duration: DURATION, ease: EASE }, 0);

          var tagline = content.querySelector('.title-tagline');
          if (tagline && tagline.dataset.animate === 'typewriter') {
            var text = tagline.textContent;
            tagline.innerHTML = text.split('').map(function(c) {
              return c === ' ' ? ' ' : '<span class="char">' + c + '</span>';
            }).join('');
            tl.to(tagline.querySelectorAll('.char'), { opacity: 1, duration: 0.03, stagger: 0.02, ease: 'none' }, 0.4);
          }

          // Title subhead
          var titleSubhead = content.querySelector('.title-subhead');
          if (titleSubhead) {
            tl.from(titleSubhead, { opacity: 0, y: 20, duration: DURATION, ease: EASE }, 0.6);
          }

          // Meta pills
          var pills = content.querySelectorAll('.meta-pills .pill');
          if (pills.length) tl.from(pills, { opacity: 0, y: 20, stagger: STAGGER, duration: DURATION, ease: EASE }, 0.9);

          // Stat count-ups (numeric)
          content.querySelectorAll('.stat-number[data-count]').forEach(function(el) {
            var target = parseInt(el.dataset.count, 10);
            var prefix = el.dataset.countPrefix || '';
            var suffix = el.dataset.suffix || '';
            if (isNaN(target)) return;
            var obj = { val: 0 };
            tl.to(obj, {
              val: target,
              duration: COUNT_DURATION,
              ease: 'power1.out',
              onUpdate: function() {
                el.textContent = prefix + Math.round(obj.val).toLocaleString() + suffix;
              }
            }, 0.3);
          });

          // Text-based stat numbers (45-57%, 30-40%)
          content.querySelectorAll('.stat-number[data-count-text]').forEach(function(el) {
            var finalText = el.dataset.countText;
            tl.set(el, { textContent: finalText }, 0.3);
            tl.from(el, { opacity: 0, scale: 0.8, duration: DURATION * 0.5, ease: EASE }, 0.3);
          });

          // Card grids
          var cards = content.querySelectorAll('.card-grid .card');
          if (cards.length) {
            var cardDelay = content.querySelector('.stat-number') ? 0.5 : 0.3;
            tl.from(cards, { opacity: 0, y: REVEAL_Y, stagger: STAGGER, duration: DURATION, ease: EASE }, cardDelay);
          }

          // Quote
          var quote = content.querySelector('.quote');
          if (quote) tl.from(quote, { opacity: 0, y: 20, duration: DURATION, ease: EASE }, '-=0.2');

          // Pipeline line + steps
          var pipelineFill = content.querySelector('.pipeline-line-fill');
          if (pipelineFill) tl.to(pipelineFill, { width: '100%', duration: 1.5, ease: EASE }, 0.3);
          var pipelineSteps = content.querySelectorAll('.pipeline-step');
          if (pipelineSteps.length) tl.from(pipelineSteps, { opacity: 0, y: 20, stagger: 0.2, duration: DURATION, ease: EASE }, 0.3);

          // LINE callout
          var lineCallout = content.querySelector('.line-callout');
          if (lineCallout) tl.from(lineCallout, { opacity: 0, scale: 0.95, duration: DURATION, ease: EASE }, '-=0.2');

          // Market circles (concentric expand)
          var circles = content.querySelectorAll('.market-circle');
          if (circles.length >= 1) tl.from(circles[0], { opacity: 0, scale: 0, duration: DURATION * 1.2, ease: 'back.out(1.2)' }, 0.3);
          if (circles.length >= 2) tl.from(circles[1], { opacity: 0, scale: 0, duration: DURATION, ease: 'back.out(1.2)' }, 0.6);
          if (circles.length >= 3) tl.from(circles[2], { opacity: 0, scale: 0, duration: DURATION * 0.8, ease: 'back.out(1.4)' }, 0.9);

          // Circle value count-ups
          content.querySelectorAll('.circle-value[data-count]').forEach(function(el) {
            var target = parseInt(el.dataset.count, 10);
            var prefix = el.dataset.countPrefix || '';
            var suffix = el.dataset.suffix || '';
            if (isNaN(target)) return;
            var obj = { val: 0 };
            tl.to(obj, {
              val: target,
              duration: COUNT_DURATION,
              ease: 'power1.out',
              onUpdate: function() {
                el.textContent = prefix + Math.round(obj.val).toLocaleString() + suffix;
              }
            }, 0.8);
          });

          // Bar chart fills
          content.querySelectorAll('.bar-fill[data-width], .bar[data-width]').forEach(function(bar, i) {
            tl.to(bar, { width: bar.dataset.width, duration: 0.5, ease: EASE }, 0.1 + i * 0.15);
          });

          // Checklist cascade
          var checkItems = content.querySelectorAll('.checklist-item');
          if (checkItems.length) tl.from(checkItems, { opacity: 0, x: -20, stagger: STAGGER, duration: DURATION * 0.7, ease: EASE }, 0.2);

          // Comparison grid rows
          var gridRows = content.querySelectorAll('.comparison-grid tbody tr');
          if (gridRows.length) tl.from(gridRows, { opacity: 0, y: 15, stagger: STAGGER, duration: DURATION * 0.7, ease: EASE }, 0.3);

          // Vein column glow pulse
          var veinCols = content.querySelectorAll('.col-vein');
          if (veinCols.length) {
            tl.to(veinCols, { boxShadow: '0 0 20px rgba(148,182,239,0.25)', duration: 0.8, ease: EASE, yoyo: true, repeat: 1 }, 0.8);
          }

          // Comparables
          var comps = content.querySelectorAll('.comparable');
          if (comps.length) tl.from(comps, { opacity: 0, y: 20, stagger: STAGGER, duration: DURATION, ease: EASE }, '-=0.3');

          // Founder cards
          var founderCards = content.querySelectorAll('.founder-card');
          if (founderCards.length) tl.from(founderCards, { opacity: 0, scale: 0.85, stagger: 0.15, duration: DURATION, ease: 'back.out(1.4)' }, 0.3);

          // Benefit cards
          var benefits = content.querySelectorAll('.benefit-card');
          if (benefits.length) tl.from(benefits, { opacity: 0, y: REVEAL_Y, stagger: STAGGER, duration: DURATION, ease: EASE }, 0.3);

          // Milestones
          var milestones = content.querySelectorAll('.milestone');
          if (milestones.length) tl.from(milestones, { opacity: 0, y: 20, stagger: STAGGER, duration: DURATION, ease: EASE }, '-=0.2');

          // Product screenshots (skip animation on mobile — they may be below fold)
          var screenshots = content.querySelectorAll('.product-screenshot');
          if (screenshots.length && window.innerWidth > 767) {
            tl.from(screenshots, { opacity: 0, scale: 0.9, y: 20, duration: DURATION, ease: EASE }, '-=0.3');
          }

          // Appendix tables
          var appendixTables = content.querySelectorAll('.appendix-table');
          if (appendixTables.length) tl.from(appendixTables, { opacity: 0, y: 20, stagger: 0.15, duration: DURATION, ease: EASE }, 0.3);
        },
        onLeaveBack: function() {
          if (slideTl && window.innerWidth > 767) slideTl.reverse();
        },
        onEnterBack: function() {
          if (slideTl && window.innerWidth > 767) slideTl.restart();
        }
      });
    });

  } // end reduced motion check

  // --- Tap-to-expand for mobile images ---
  if (window.innerWidth <= 767) {
    var overlay = document.getElementById('expand-overlay');
    if (overlay) {
      document.querySelectorAll('.product-screenshot, .founder-photo').forEach(function(img) {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', function(e) {
          e.stopPropagation();
          var clone = img.cloneNode(true);
          clone.style.cursor = 'zoom-out';
          clone.style.maxWidth = '90vw';
          clone.style.maxHeight = '85vh';
          overlay.innerHTML = '';
          overlay.appendChild(clone);
          overlay.classList.add('active');
        });
      });

      overlay.addEventListener('click', function() {
        overlay.classList.remove('active');
      });
    }
  }

})();
