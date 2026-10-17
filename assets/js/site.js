// Tiny Bit Studio. Progressive enhancement only: every page works, and reads the same, without it.
// This is the shared part, which runs first on every page: window.TB, which every other script builds
// on. Each exhibit has a script of its own (album.js, lark.js, kozeni.js).
(function () {
  'use strict';

  var motion = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var scheme = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  var saying = 0;

  // TB.reduce and TB.dark follow the system's settings as they change, and each change is an event:
  // TB.on('motion', function (event) { … event.detail.reduce … }), and 'scheme' with detail.dark.
  // TB.on and TB.off take the events every script shares, each tb:<type> on the document; TB.emit
  // sends one.
  var TB = window.TB = {
    reduce: !!(motion && motion.matches),
    dark: !!(scheme && scheme.matches),
    on: function (type, fn) { document.addEventListener('tb:' + type, fn); },
    off: function (type, fn) { document.removeEventListener('tb:' + type, fn); },
    emit: function (type, detail) { document.dispatchEvent(new CustomEvent('tb:' + type, { detail: detail })); },
    // Says something politely through the page's live region (#tb-status, in the default layout):
    // emptied first, then set on the next frame, so the same words said twice are said twice.
    say: function (text) {
      var status = document.getElementById('tb-status');
      if (!status) return;
      cancelAnimationFrame(saying);
      status.textContent = '';
      saying = requestAnimationFrame(function () { status.textContent = text; });
    },
    // Calls fn with each IntersectionObserver entry for el (opts are the observer's own: rootMargin,
    // threshold). Returns the function that stops it. Without IntersectionObserver, el counts as in view.
    inView: function (el, fn, opts) {
      if (!el) return function () {};
      if (!('IntersectionObserver' in window)) {
        fn({ target: el, isIntersecting: true, intersectionRatio: 1 });
        return function () {};
      }
      var io = new IntersectionObserver(function (entries) { entries.forEach(fn); }, opts);
      io.observe(el);
      return function () { io.disconnect(); };
    },
    // How much of el is on screen, from 0 to 1.
    visibleRatio: function (el) {
      var r = el.getBoundingClientRect();
      var w = Math.min(r.right, window.innerWidth) - Math.max(r.left, 0);
      var h = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
      return w > 0 && h > 0 && r.width * r.height > 0 ? (w * h) / (r.width * r.height) : 0;
    }
  };

  var follow = function (query, change) {
    if (!query) return;
    var update = function () { change(query.matches); };
    if (query.addEventListener) query.addEventListener('change', update);
    else if (query.addListener) query.addListener(update);
  };
  follow(motion, function (reduce) { TB.reduce = reduce; TB.emit('motion', { reduce: reduce }); });
  follow(scheme, function (dark) { TB.dark = dark; TB.emit('scheme', { dark: dark }); });
})();
