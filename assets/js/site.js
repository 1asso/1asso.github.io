// Tiny Bit Studio. Progressive enhancement only: every page works, and reads the same, without it.
(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lit = document.querySelectorAll('[data-light]');

  // 1. The lights come up once on each plinth as you reach it, then stay.
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.15 });
    lit.forEach(function (el) { io.observe(el); });
  } else {
    lit.forEach(function (el) { el.classList.add('is-in'); });
  }

  // 2. Covered sentences: covered during "your turn", shown by the toggle (or a click on the bars).
  document.querySelectorAll('[data-covered]').forEach(function (figure) {
    var button = figure.querySelector('button[aria-pressed]');
    var line = figure.querySelector('.covered__line');
    if (!button || !line) return;
    var show = function (shown) {
      figure.classList.toggle('is-covered', !shown);
      button.setAttribute('aria-pressed', shown ? 'true' : 'false');
      // Covered, the line is only bars: screen readers get the caption and the button instead.
      if (shown) line.removeAttribute('aria-hidden'); else line.setAttribute('aria-hidden', 'true');
    };
    show(false);
    button.hidden = false;
    button.addEventListener('click', function () {
      show(button.getAttribute('aria-pressed') !== 'true');
    });
    line.addEventListener('click', function () {
      if (figure.classList.contains('is-covered')) show(true);
    });
  });
})();
