// Tiny Bit Studio. Progressive enhancement only: every page works, and reads the same, without it.
// This is the shared part, which runs first on every page: window.TB, its TB.reduce and TB.inView for
// Lark's Practice (lark.js). Each exhibit has a script of its own (album.js, lark.js, kozeni.js).
(function () {
  'use strict';

  var motion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // TB.reduce follows the system's setting as it changes.
  var TB = window.TB = {
    reduce: motion.matches,
    // Calls fn with each IntersectionObserver entry for el (opts are the observer's own: rootMargin,
    // threshold). Returns the function that stops it.
    inView: function (el, fn, opts) {
      var io = new IntersectionObserver(function (entries) { entries.forEach(fn); }, opts);
      io.observe(el);
      return function () { io.disconnect(); };
    }
  };

  var follow = function (query, change) {
    var update = function () { change(query.matches); };
    query.addEventListener('change', update);
  };
  follow(motion, function (reduce) { TB.reduce = reduce; });
})();
