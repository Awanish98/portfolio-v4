/* ============================================================
   PREMIUM LAYER — badge guard + enhanced motion.
   No dependencies. Loaded with `defer` after the page scripts.
   ============================================================ */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -----------------------------------------------------------
     1. NETLIFY BADGE GUARD
     Netlify injects its "Powered by Netlify" badge at the edge with a
     markup/id that has changed over time. CSS hides the known shells in
     responsive.css; this removes anything injected later too.
     ----------------------------------------------------------- */
  (function badgeGuard() {
    var selectors = [
      '#nl-badge-frame',
      '[id*="nl-badge"]', '[id*="netlify-badge"]',
      '[class*="nl-badge"]', '[class*="netlify-badge"]',
      '[data-netlify-badge]', 'netlify-badge',
      'iframe[src*="netlify.com"]:not(#modalFrame)',
      'iframe[src*="netlify.app/badge"]'
    ];

    function isBadge(el) {
      if (!el || el.nodeType !== 1) return false;
      for (var i = 0; i < selectors.length; i++) {
        try { if (el.matches(selectors[i])) return true; } catch (_) {}
      }
      /* Netlify's badge is an iframe with inline fixed-corner styling.
         Catch rebranded injections that no longer use a predictable id. */
      if (el.tagName === 'IFRAME' && el.id !== 'modalFrame' &&
          !el.closest('.fcard, .pc-media, .promo-stage, .sh-window, .modal')) {
        var inline = el.getAttribute('style') || '';
        if ((/position\s*:\s*fixed/i.test(inline) || el.style.position === 'fixed') &&
            /bottom\s*:/i.test(inline) && /right\s*:/i.test(inline)) return true;
      }
      return false;
    }

    function purge(root) {
      if (!root || root.nodeType !== 1) return;
      if (isBadge(root)) { root.remove(); return; }
      selectors.forEach(function (sel) {
        try {
          root.querySelectorAll(sel).forEach(function (node) { node.remove(); });
        } catch (_) {}
      });
    }

    purge(document.documentElement);
    window.addEventListener('load', function () { purge(document.documentElement); }, { once: true });

    if ('MutationObserver' in window) {
      var observer = new MutationObserver(function (records) {
        for (var i = 0; i < records.length; i++) {
          records[i].addedNodes.forEach(purge);
        }
      });
      observer.observe(document.documentElement, { childList: true, subtree: true });
      /* badge is injected during load — stop watching after that so we do
         not pay for mutation records when projects/chat render. */
      window.setTimeout(function () { observer.disconnect(); }, 8000);
    }
  })();

  /* -----------------------------------------------------------
     2. MAGIC UI / MOTION-PRIMITIVES INTERACTIONS
     ----------------------------------------------------------- */

  /* Mouse-follow spotlight + tilt glare + border beam on cards.
     --mx / --my are plain CSS variables: no layout read per frame. */
  var hosts = Array.prototype.slice.call(
    document.querySelectorAll('.fcard, .bcard, .proj-card, .lab-card, .spot')
  );

  hosts.forEach(function (host) {
    host.classList.add('pm-host');

    var spot = document.createElement('span');
    spot.className = 'pm-spot';
    spot.setAttribute('aria-hidden', 'true');
    host.appendChild(spot);

    var glare = document.createElement('span');
    glare.className = 'pm-glare';
    glare.setAttribute('aria-hidden', 'true');
    host.appendChild(glare);

    if (host.classList.contains('fcard')) {
      var beam = document.createElement('span');
      beam.className = 'pm-beam';
      beam.setAttribute('aria-hidden', 'true');
      host.appendChild(beam);
    }

    if (reduce || window.matchMedia('(pointer: coarse)').matches) return;

    var rect = null, measured = 0;
    host.addEventListener('pointerenter', function () {
      rect = host.getBoundingClientRect();
      measured = performance.now();
    }, { passive: true });

    host.addEventListener('pointermove', function (e) {
      var now = performance.now();
      /* refresh the cached rect at most ~8x/sec instead of every event */
      if (!rect || now - measured > 120) {
        rect = host.getBoundingClientRect();
        measured = now;
      }
      if (!rect.width || !rect.height) return;
      host.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width * 100).toFixed(1) + '%');
      host.style.setProperty('--my', ((e.clientY - rect.top) / rect.height * 100).toFixed(1) + '%');
      host.style.setProperty('--pm-x', (e.clientX - rect.left).toFixed(0) + 'px');
      host.style.setProperty('--pm-y', (e.clientY - rect.top).toFixed(0) + 'px');
    }, { passive: true });
  });

  /* Magic UI "Sparkles" around the hero portrait — transform + opacity only. */
  var portrait = document.querySelector('.hero-portrait');
  if (portrait && !reduce) {
    var field = document.createElement('div');
    field.className = 'pm-sparkles';
    field.setAttribute('aria-hidden', 'true');
    var points = [
      [8, 18], [26, 6], [47, 14], [72, 5], [92, 22],
      [96, 58], [82, 88], [56, 96], [28, 86], [5, 62]
    ];
    points.forEach(function (p, i) {
      var spark = document.createElement('i');
      spark.className = 'pm-spark';
      spark.style.left = p[0] + '%';
      spark.style.top = p[1] + '%';
      spark.style.setProperty('--delay', (i * 0.37).toFixed(2) + 's');
      spark.style.setProperty('--dur', (2.6 + (i % 3) * 0.7).toFixed(1) + 's');
      field.appendChild(spark);
    });
    portrait.appendChild(field);
  }

  /* Gentle staggered rise for cards that were not already using .reveal.
     Uses the independent `translate` property so hover transforms still work. */
  if ('IntersectionObserver' in window && !reduce) {
    var rise = Array.prototype.slice.call(
      document.querySelectorAll('.fcard, .bcard, .cat-card, .lab-card')
    );
    rise.forEach(function (el, i) { el.classList.add('pm-rise'); });

    var riseIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('pm-in');
        riseIo.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    rise.forEach(function (el) { riseIo.observe(el); });

    /* safety net: never leave cards invisible if IO callbacks are suppressed */
    window.setTimeout(function () {
      if (!document.querySelector('.pm-rise.pm-in')) {
        rise.forEach(function (el) { el.classList.add('pm-in'); });
      }
    }, 2500);
  }

  /* Pause endless decorative animation in sections that are offscreen.
     Big win on the 106-project page and on long scrolls. */
  if ('IntersectionObserver' in window && !reduce) {
    var zones = Array.prototype.slice.call(
      document.querySelectorAll('.hero, .sh-hero, .section, .ticker, .carousel')
    );
    var motionIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        entry.target.classList.toggle('motion-paused', !entry.isIntersecting);
      });
    }, { rootMargin: '180px 0px' });
    zones.forEach(function (zone) { motionIo.observe(zone); });
  }
})();
