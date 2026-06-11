/* Dylan J Koch theme behavior: scroll reveals and stat counters. */
(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function revealAll() {
    document.querySelectorAll('.djk-reveal').forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  function initReveals() {
    var elements = document.querySelectorAll('.djk-reveal');
    if (!elements.length) return;

    if (reducedMotion || !('IntersectionObserver' in window)) {
      revealAll();
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  function animateCounter(el) {
    var raw = el.getAttribute('data-djk-count');
    var target = parseFloat(raw);
    if (isNaN(target)) return;

    var prefix = el.getAttribute('data-djk-prefix') || '';
    var suffix = el.getAttribute('data-djk-suffix') || '';
    var duration = 1400;
    var start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.round(target * eased);
      el.textContent = prefix + value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  function initCounters() {
    var counters = document.querySelectorAll('[data-djk-count]');
    if (!counters.length) return;

    if (reducedMotion || !('IntersectionObserver' in window)) {
      counters.forEach(function (el) {
        var prefix = el.getAttribute('data-djk-prefix') || '';
        var suffix = el.getAttribute('data-djk-suffix') || '';
        var target = parseFloat(el.getAttribute('data-djk-count'));
        if (!isNaN(target)) el.textContent = prefix + target.toLocaleString() + suffix;
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    counters.forEach(function (el) {
      observer.observe(el);
    });
  }

  // Open only one accordion at a time within a group marked data-djk-single.
  function initAccordions() {
    document.querySelectorAll('[data-djk-single]').forEach(function (group) {
      group.addEventListener('toggle', function (event) {
        var opened = event.target;
        if (!(opened instanceof HTMLDetailsElement) || !opened.open) return;
        group.querySelectorAll('details[open]').forEach(function (other) {
          if (other !== opened) other.open = false;
        });
      }, true);
    });
  }

  function init() {
    initReveals();
    initCounters();
    initAccordions();

    // Re-run reveals when the merchant edits sections in the theme customizer.
    document.addEventListener('shopify:section:load', function () {
      initReveals();
      initCounters();
      initAccordions();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
