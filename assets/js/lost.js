// The not-found page (404.html, lost.css): the arrival, and the lens.
//
// The arrival is the home page's first screen's (grid.js), played frame by frame. lost.css draws the void from the
// first frame, wherever it will play, with the canvas's columns waiting under the screen's foot. Once the type is in,
// so that the columns carry the real letters (the font is the site's own, and preloaded: never more than a moment, and
// never more than 0.6s), and the void has held a beat (BEAT, 0.3s from the first frame the page drew, as the home
// page's and the privacy page's do), this strikes them up (html.gl-go): all twelve (six on a phone), left to right and
// quicker as they go, each a damped spring's step answered exactly at every frame, carrying its strip of the title.
// Each has landed 97% up, when its void and its ground go and the page is there under it; its strip goes only a fifth
// as far past its place as the column would, so the type clicks into register as the columns settle. The i's dots pop
// out of their stems in the columns' copies, and the heading's own stop slides out of the last column's edge into it;
// once the dots are home the heading takes over from the copies in one frame (html.gl-here), and 1.04s from the start
// html.gl-done takes the arrival away. All that moves in the strike is written here at every frame, as the home page's
// columns are, not animated by CSS: Safari 27 can draw a layer that CSS animates without the clip of the box it moves
// in, and each column's copy is the whole title. A moving column is itself the box that clips its strip, and it's drawn
// with the page, never made a layer of its own, as the home page's poster's columns are. Its edges, brighter while it
// flies, come in as it starts and fade as it lands, and at night its canvas, a step lighter while it flies, settles to
// the canvas as it lands, as the home page's do. Anything the reader does before it's over (a key, a press, the wheel,
// a touch, a scroll, the focus moving, the window resized, Reduce Motion or forced colors turned on) finishes it at
// once: the poster simply there.
//
// The lens is the home page's (grid.js): the column of the grid under a mouse over the title, or under a finger dragged
// sideways across it, is a lens on the poster's decisions. Through it the poster is drawn in outline, in register with
// its letters, and on it, in mono, what was decided in that strip: each line's cap height, x-height and baseline, the
// first letters hung into the margin, the word spaces, the lead, the dots' size, and each column's number and width; in
// the last column, empty, the stop drawn at its own weight and 404 for its width. Its window moves from column to
// column on a spring, a little past and back. Where a column is too narrow to write in, the lens is two of them and
// moves two at a time (on a phone, a third of the measure). A moment after it's let go, it goes quiet where it is, and
// nothing of it is drawn: the empty column is simply empty. It's built when it's first wanted, and again after a
// resize, and works only while it's moving.
(function () {
  'use strict';
  var gl = document.querySelector('[data-gl]');

  var root = document.documentElement;
  var list = function (nodes) { return Array.prototype.slice.call(nodes); };
  var now = function () { return performance.now(); };
  var clamp = function (n, a, b) { return Math.max(a, Math.min(b, n)); };
  var still = window.matchMedia('(prefers-reduced-motion: reduce)');
  var forced = window.matchMedia('(forced-colors: active)');
  var scheme = window.matchMedia('(prefers-color-scheme: dark)');
  var main = gl.querySelector('[data-gl-main]');
  var title = gl.querySelector('[data-gl-title]');
  var foot = gl.querySelector('[data-gl-foot]');
  var el = gl.querySelector('[data-gl-lens]');
  var arrive = document.querySelector('[data-gl-arrive]');

  // ------------------------------------------------------------ The foot

  // What the foot takes, which sizes the title on a short screen (the page measured it before the first frame, with
  // whatever fonts it had then): again once the fonts are in, and after every resize.
  var measureFoot = function () {
    root.style.setProperty('--gl-foot', Math.ceil(foot.getBoundingClientRect().height) + 'px');
  };

  // ------------------------------------------------------------ The arrival

  var arrival = (function () {
    var state = '';   // '' not yet decided, 'void' held, 'play' playing, 'fade' let go unplayed, 'done'
    var timers = [], then = [];
    var later = function (ms, fn) { timers.push(setTimeout(fn, ms)); };
    // The columns strike up as the home page's poster's do: each a damped spring's step (F Hz, Z its damping ratio)
    // from its moment in the cascade, 224ms x (i / (n - 1))^0.8, the last at 224ms; landed once it's UP of the way,
    // and from the moment it's first at its place (AT on), its strip goes only GIVE as far past as the column would.
    var F = 3.1, Z = 0.74, UP = 0.97, GIVE = 0.2, CASCADE = 224;
    // How fast a column's swing dies away (per second), how fast it swings, and so when it's first at its place.
    var DECAY = Z * 2 * Math.PI * F, SWING = 2 * Math.PI * F * Math.sqrt(1 - Z * Z), AT = (Math.PI - Math.atan(SWING / DECAY)) / SWING;
    // A column's edges are drawn brighter while it flies: they come in over its first RISE ms in flight, and once it's
    // LANDS of the way up they fade, over FADE ms, both on the site's ease, as the home page's do (grid.css,
    // .is-flying); its leading edge goes once it's at its place, at the top of the screen, as the home page's goes out
    // of the top of it. At night its canvas is a step lighter while it flies, and from the same moment it settles to
    // the canvas, over SETTLE ms on the site's ease, as the home page's does; by then the column has landed, and what
    // settles is the page's own canvas under it, the lift (lost.css, .gl-lift), which then goes. By day the lift
    // isn't drawn.
    var RISE = 60, LANDS = 0.985, FADE = 260, SETTLE = 200;
    // The bits pop on a quicker spring (12.6% past, done in 420ms): the i's dots out of their stems as the last
    // columns land, 72ms apart, and the stop out of the last column's edge.
    var PF = 4.323, PZ = 0.55, POP = 420, DOTS = [440, 512], STOP = 584;
    // Safari's edges take the canvas's color from the strips (below) over about a tenth of a second, so each strip is
    // given it a little before half the columns have passed it, and its edge turns with the page's row beside it: by
    // day the strip along the foot as the columns come up across the foot (on iOS), the strip along the top as the
    // first of them pass the top. At night, when what rises at the foot is the canvas lifted a step, the edge under it
    // stays the void's till the top's turns, and the two turn together, as the home and privacy pages' do: never the
    // canvas's beside the void's black under lifted columns. The heading takes over once the dots are home; and at the
    // end it's all taken away.
    var SILL = 60, TINT = 250, HERE = 949, END = 1040;
    // How long the void holds the screen before the columns strike up, from the first frame the page drew (noted by
    // 404.html's first script, window.glSeen; else the first frame after this), as the home and privacy pages'.
    var BEAT = 300;
    var step = function (s, f, z) {
      if (s <= 0) return 0;
      var w = 2 * Math.PI * f, wd = w * Math.sqrt(1 - z * z), e = Math.exp(-z * w * s);
      return 1 - e * (Math.cos(wd * s) + (z * w / wd) * Math.sin(wd * s));
    };
    var pop = function (ms) { return ms <= 0 ? 0 : ms >= POP ? 1 : step(ms / 1000, PF, PZ); };
    // The site's ease, cubic-bezier(0.2, 0.7, 0.2, 1) (site.css, --ease), at u of the way through.
    var ease = function (u) {
      if (u <= 0) return 0;
      var lo = 0, hi = 1, t = u;
      for (var k = 0; k < 24; k++) { t = (lo + hi) / 2; if (0.6 * (1 - t) * (1 - t) * t + 0.6 * (1 - t) * t * t + t * t * t < u) lo = t; else hi = t; }
      return 2.1 * (1 - t) * (1 - t) * t + 3 * (1 - t) * t * t + t * t * t;
    };
    var cols = [], dots = [], stop = title.querySelector('.gl-stop');
    var t0 = 0, H = 0, raf = 0, into = null, silled = false, tinted = false, here = false;

    // Safari's bars (lost.css, .gl-chrome). On the Mac its compact tabs follow the color of the strip along the top as
    // it changes, so the strip takes the canvas's color in place. On a phone or a tablet (iOS, every browser there
    // being Safari's engine) the edges over and under the page take their colors from a strip along the top and one
    // along the foot, and read a strip only when it's a new one (a change of its color alone is never seen): there each
    // is replaced by a new strip in the canvas's color when its moment comes (above), as the home page's are
    // (grid.js, redo).
    var ua = navigator.userAgent;
    var edges = navigator.maxTouchPoints > 0 && /AppleWebKit/.test(ua) && !/Android|Chrome\//.test(ua);
    var strip = document.querySelector('.gl-chrome'), sill = null;
    var redo = function (n) { var m = n.cloneNode(false); m.style.setProperty('--gl-chrome', 'var(--canvas)'); n.parentNode.replaceChild(m, n); return m; };
    var tintSill = function () {
      silled = true;
      if (sill) sill = redo(sill);
    };
    var tint = function () {
      tinted = true;
      if (!silled) tintSill();
      if (edges) strip = redo(strip);
      else strip.style.setProperty('--gl-chrome', 'var(--canvas)');
    };

    // The columns, as they're laid out (six on a phone), each with its void, its ground and its lift, and the copies'
    // dots.
    var lay = function () {
      var all = list(arrive.querySelectorAll('.gl-a')), voids = list(arrive.querySelectorAll('.gl-void'));
      var lifts = list(document.querySelectorAll('.gl-lift > i'));
      var shown = all.filter(function (a) { return a.offsetWidth > 0; }), n = shown.length;
      H = arrive.clientHeight;
      // At rest once its strip is within a quarter of a pixel of its place, for good.
      var rest = Math.max(AT, Math.log(Math.max(2, GIVE * H / Math.sqrt(1 - Z * Z) / 0.25)) / DECAY);
      cols = shown.map(function (a, i) {
        var k = all.indexOf(a);
        return { el: a, ground: a.querySelector('.gl-a__ground'), voidEl: voids[k], lift: lifts[k], delay: CASCADE * Math.pow(i / Math.max(1, n - 1), 0.8), rest: rest, drawn: null, landed: false, home: false, flies: -1, lit: null, lands: -1, faded: null, settled: null };
      });
      var mis = list(arrive.querySelectorAll('.gl-a .gl-mi'));
      dots = DOTS.map(function (at, k) {
        return { at: at, els: mis.filter(function (d) { return parseFloat(d.style.getPropertyValue('--d')) === k; }), drawn: null };
      });
    };
    // A frame, te ms into the strike: every column where its spring has it, written only where it has moved, and its
    // edges as bright as they are by then; the dots and the stop where theirs have them; the strips, and the heading,
    // when their moment comes. Whether there's more to draw.
    var draw = function (t) {
      var te = Math.max(0, t - t0);
      for (var i = 0; i < cols.length; i++) {
        var c = cols[i], s = (te - c.delay) / 1000, y = step(s, F, Z);
        var r = s >= c.rest ? 1 : s < AT ? y : 1 + GIVE * (y - 1);
        var tr = r === 1 ? '' : 'translateY(' + (s <= 0 ? H + 2 : (1 - r) * H).toFixed(2) + 'px)';
        if (tr !== c.drawn) { c.drawn = tr; c.el.style.transform = tr; }
        // Landed: its void and its ground go, and the page is there under its strip (lost.css).
        if (!c.landed && y >= UP) {
          c.landed = true;
          c.ground.classList.add('is-landed');
          c.voidEl.style.visibility = 'hidden';
        }
        if (!c.home && s >= AT) { c.home = true; c.ground.classList.add('is-home'); }
        // Its edges come in from its first frame in flight (drawn at nothing in that frame, as a transition starts).
        if (c.lands < 0 && s > 0) {
          if (c.flies < 0) c.flies = te;
          var w = (te - c.flies) / RISE, lit = w >= 1 ? '1' : ease(w).toFixed(3);
          if (lit !== c.lit) { c.lit = lit; c.ground.style.setProperty('--gl-edges', lit); }
        }
        // Its edges fade, and once they're gone, so is what's left of its ground; and the canvas under it settles, and
        // once it has, the lift goes.
        if (c.lands < 0 && y >= LANDS) c.lands = te;
        if (c.lands >= 0 && c.faded !== 'gone') {
          var u = (te - c.lands) / FADE;
          var o = u >= 1 ? 'gone' : (1 - ease(u)).toFixed(3);
          if (o !== c.faded) {
            c.faded = o;
            if (o === 'gone') c.ground.style.visibility = 'hidden';
            else c.ground.style.setProperty('--gl-edges', o);
          }
        }
        if (c.lands >= 0 && c.settled !== 'gone') {
          var q = (te - c.lands) / SETTLE;
          var l = q >= 1 ? 'gone' : (100 * (1 - ease(q))).toFixed(2) + '%';
          if (l !== c.settled) {
            c.settled = l;
            if (l === 'gone') c.lift.style.visibility = 'hidden';
            else c.lift.style.setProperty('--gl-lift', l);
          }
        }
      }
      dots.forEach(function (d) {
        var sink = (1 - pop(te - d.at)).toFixed(4);
        if (sink !== d.drawn) { d.drawn = sink; d.els.forEach(function (e) { e.style.setProperty('--gl-sink', sink); }); }
      });
      var v = pop(te - STOP).toFixed(4);
      if (v !== into) { into = v; stop.style.setProperty('--gl-in', v); }
      if (!silled && te >= SILL && !scheme.matches) tintSill();
      if (!tinted && te >= TINT) tint();
      // The heading takes over from the copies in one frame (lost.css, html.gl-here).
      if (!here && te >= HERE) { here = true; root.classList.add('gl-here'); }
      return te < STOP + POP;
    };
    var tick = function (t) {
      raf = 0;
      var more = false;
      try { more = draw(t); } catch (e) { done(); return; }
      if (more) raf = requestAnimationFrame(tick);
    };
    // Over: the arrival taken away (at once, if it was still going), and what waited for it let go.
    var done = function () {
      state = 'done';
      timers.forEach(clearTimeout);
      timers = [];
      cancelAnimationFrame(raf);
      raf = 0;
      stop.style.removeProperty('--gl-in');
      root.classList.add('gl-done');
      root.classList.remove('gl-unvoid');
      then.splice(0).forEach(function (fn) { fn(); });
    };
    // No arrival after all, with the void already drawn: once the browser has painted it, it fades away over the poster
    // as the home page's does (lost.css, html.gl-unvoid), rather than going in a frame; else it simply goes.
    var painted = function () { return !!performance.getEntriesByType('paint').length; };
    var unvoid = function () {
      if (!painted()) { done(); return; }
      state = 'fade';
      tint();
      root.classList.add('gl-unvoid');
      later(240, done);
    };
    var begin = function (t) {
      if (state !== 'void') return;
      // Shown, or its script in, long after the page opened (in the background, say), or already scrolled: no
      // arrival, the poster as it is.
      if (window.scrollY > 2 || now() > 2600) { unvoid(); return; }
      state = 'play';
      lay();
      t0 = t;
      // The first frame of the strike is drawn with the class that begins it, so no frame shows the columns anywhere
      // but under the screen's foot before they move.
      root.classList.add('gl-go');
      tick(t0);
      later(END, done);
    };
    var cut = function () { if (state === 'void' || state === 'play' || state === 'fade') done(); };
    // A window resized: a new width, or a new height of more than a browser's bars (which come and go on a phone, and
    // change nothing the arrival has laid out).
    var size = [window.innerWidth, window.innerHeight];
    var reshaped = function () { if (window.innerWidth !== size[0] || Math.abs(window.innerHeight - size[1]) > 120) cut(); };
    ['pointerdown', 'keydown', 'wheel', 'touchstart', 'focusin'].forEach(function (type) {
      window.addEventListener(type, cut, { passive: true, capture: true });
    });
    window.addEventListener('scroll', cut, { passive: true });
    window.addEventListener('resize', reshaped);
    // Reduce Motion or forced colors turned on while it plays: lost.css takes it off the screen, and it's over, as the
    // home page's is (grid.js).
    [still, forced].forEach(function (q) {
      q.addEventListener('change', cut);
    });
    return {
      // Whether it plays: the page's CSS drew the void (motion allowed, no forced colors, a screen that holds the
      // page), and the reader is at the top.
      start: function () {
        var drawn = getComputedStyle(arrive).display !== 'none';
        if (!drawn) { done(); return; }
        if (window.scrollY > 2) { unvoid(); return; }
        state = 'void';
        // On iOS, the strip along the foot too (above), in the void's color till the canvas comes.
        if (edges) { sill = strip.cloneNode(false); sill.classList.add('gl-chrome--foot'); strip.parentNode.insertBefore(sill, strip.nextSibling); }
        var fonts = document.fonts.ready;
        var cap = new Promise(function (resolve) { setTimeout(resolve, 600); });
        Promise.race([fonts, cap]).then(function () {
          var hold = function () {
            if (state !== 'void') return;
            if (typeof window.glSeen !== 'number') { requestAnimationFrame(function (t) { window.glSeen = t; hold(); }); return; }
            later(Math.max(0, window.glSeen + BEAT - now()), function () { requestAnimationFrame(begin); });
          };
          var go = function () {
            if (state !== 'void' || document.hidden) return;
            document.removeEventListener('visibilitychange', go);
            measureFoot();
            hold();
          };
          if (document.hidden) document.addEventListener('visibilitychange', go);
          go();
        });
      },
      // Something to do once it's over (at once, if it is).
      after: function (fn) { then.push(fn); }
    };
  })();

  // ------------------------------------------------------------ The lens

  var lens = (function () {
    var win = null, plate = null, edges = null, U = null, band = null;
    var x = 0, v = 0, aimed = 0, spring = 0, then = 0, at = -1, built = false, live = false;
    var hush = true, back = 0, drag = null;

    var make = function (tag, cls) { var n = document.createElement(tag); n.className = cls; return n; };
    var px = function (n) { return n.toFixed(1) + 'px'; };
    // Awake (drawn, its window and edges shown) or quiet (gone).
    var quiet = function (yes) {
      hush = yes;
      el.classList.toggle('is-on', !yes);
    };
    // A note: its name, and under it its value, in mono, inside the column it's in (or against its right edge).
    var note = function (key, value, left, top, opts) {
      var n = make('span', 'gl-lens__note' + (opts.quiet ? ' gl-lens__note--quiet' : '') + (opts.end ? ' gl-lens__note--end' : '') + (opts.mid ? ' gl-lens__note--mid' : ''));
      n.textContent = key;
      if (value) { var b = document.createElement('b'); b.textContent = value; n.appendChild(b); }
      n.style.left = px(left);
      n.style.top = px(top);
      plate.appendChild(n);
      return { el: n, unit: opts.unit, top: top };
    };
    var rule = function (cls, top, left, height) {
      var r = make('i', 'gl-lens__rule' + (cls ? ' gl-lens__rule--' + cls : ''));
      r.style.top = px(top);
      if (cls === 'v') { r.style.left = px(left); r.style.height = px(height); }
      plate.appendChild(r);
    };
    var span = function (x0, x1, top) {
      var s = make('i', 'gl-lens__span');
      s.style.left = px(Math.min(x0, x1));
      s.style.width = px(Math.abs(x1 - x0));
      s.style.top = px(top);
      plate.appendChild(s);
    };
    var boxAround = function (b) {
      var o = make('i', 'gl-lens__box');
      o.style.left = px(b.left);
      o.style.top = px(b.top);
      o.style.width = px(b.width);
      o.style.height = px(b.height);
      plate.appendChild(o);
    };
    var fmt = function (em) { return (em > 0 ? '+' : em < 0 ? '−' : '') + Math.abs(em).toFixed(4).replace(/0+$/, '').replace(/\.$/, '') + 'em'; };
    var bare = function (em) { return fmt(em).replace(/^[+−]/, ''); };
    var two = function (n) { return (n < 10 ? '0' : '') + n; };
    // Where a line's baseline is: a zero-sized mark set on it.
    var baseOf = function (node, top) {
      var m = document.createElement('i');
      m.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline';
      node.appendChild(m);
      var y = m.getBoundingClientRect().top - top;
      m.remove();
      return y;
    };

    var build = function () {
      el.textContent = '';
      el.classList.remove('is-built');
      built = false;
      var g = gl.getBoundingClientRect();
      if (!g.width || !title.getBoundingClientRect().width) return;
      var rel = function (b) { return { left: b.left - g.left, top: b.top - g.top, right: b.right - g.left, bottom: b.bottom - g.top, width: b.width, height: b.height }; };
      var s = getComputedStyle(main), W = main.clientWidth;
      var m = parseFloat(s.paddingLeft) || 0, gap = parseFloat(s.columnGap) || 0, P = (W - 2 * m + gap) / 12;
      // The lens's unit is a column of the grid, or on a phone the pair of them the screen arrives in; where that's too
      // narrow to write in, the lens is two units, and moves two at a time. Its last unit holds the empty column.
      var per = W < 720 ? 2 : 1, n = 12 / per;
      var pair = per * P - gap < 84 ? 2 : 1;
      U = { left: m, step: pair * per * P, w: pair * per * P - gap, count: Math.floor(n / pair), per: per * pair };
      var fs = parseFloat(getComputedStyle(title).fontSize) || 100;
      var tb = rel(title.getBoundingClientRect());
      // The window, from the header's foot down (as deep as its notes, below).
      win = make('div', 'gl-lens__win');
      plate = make('div', 'gl-lens__plate');
      win.style.width = px(U.w);
      plate.style.width = px(g.width);
      win.appendChild(plate);
      el.appendChild(win);
      edges = make('i', 'gl-lens__edges');
      edges.style.width = px(U.w);
      el.appendChild(edges);

      // The lines: each row of words, its baseline found on the type itself, its caps 0.7275em above it, its
      // x-height 0.546em.
      var rows = [];
      list(title.querySelectorAll('.gl-slot')).forEach(function (slot) {
        var b = rel(slot.getBoundingClientRect()), base = baseOf(slot, g.top);
        var row = rows.filter(function (r) { return Math.abs(r.base - base) < 2; })[0];
        if (!row) rows.push(row = { base: base, words: [] });
        row.words.push({ el: slot, box: b, item: rel(slot.parentNode.getBoundingClientRect()) });
      });
      rows.sort(function (a, b) { return a.base - b.base; });
      rows.forEach(function (r) { r.cap = r.base - fs * 0.7275; r.x = r.base - fs * 0.546; r.words.sort(function (a, b) { return a.box.left - b.box.left; }); });
      var rowOf = function (b) { var mid = (b.top + b.bottom) / 2; return rows.filter(function (r) { return mid > r.cap - fs * 0.3 && mid < r.base + fs * 0.3; })[0] || rows[0]; };
      var last = rows[rows.length - 1];
      var one = rows.length === 1;
      band = { bottom: Math.max(tb.bottom, last.base) + fs * 0.3 };

      var ground = make('i', 'gl-lens__ground');
      plate.appendChild(ground);
      // The poster in outline, in register: a copy of the title, laid out as it is (its words' margins,
      // which are measured against the poster's columns, set in pixels), and a pixel wider: its last line fills the
      // heading's to the edge, and a size read back a hair larger would wrap it. On one line, which never wraps, it's
      // as wide as the heading and packed the same way (to its end), so it's in register even where Firefox's
      // rounding makes the line a hair too long for its room.
      var copy = title.cloneNode(true);
      copy.removeAttribute('data-gl-title');
      copy.removeAttribute('aria-hidden');
      copy.classList.add('gl-lens__type');
      copy.style.left = tb.left + 'px';
      copy.style.top = tb.top + 'px';
      copy.style.width = (tb.width + (one ? 0 : 1)) + 'px';
      copy.style.justifyContent = getComputedStyle(title).justifyContent;
      copy.style.fontSize = fs + 'px';
      copy.style.letterSpacing = getComputedStyle(title).letterSpacing;
      var from = title.querySelectorAll('.gl-w, .gl-slot'), into = copy.querySelectorAll('.gl-w, .gl-slot');
      for (var w = 0; w < from.length && w < into.length; w++) {
        var ws = getComputedStyle(from[w]);
        into[w].style.marginLeft = ws.marginLeft;
        into[w].style.marginRight = ws.marginRight;
      }
      plate.appendChild(copy);
      rows.forEach(function (r) { rule('', r.cap); rule('x', r.x); rule('', r.base); });

      var uLeft = function (k) { return U.left + k * U.step; };
      var unitOf = function (x) { return clamp(Math.floor((x - U.left + gap / 2) / U.step), 0, U.count - 1); };
      var lh = 13;   // a note's line
      // Under the last line: each unit's number and width, 8px down (on one line, under the g's tail), and over them,
      // what was decided in that line. Where the room before the foot (kept 8px clear) is short of both, on a short
      // screen with the title as large as it will go, it's one row: a unit with a decision under the last line gives
      // that in place of its number and width, where the baseline's name was.
      var low0 = one ? last.base + fs * 0.3 + 5 : last.base + 8;
      var footTop = rel(foot.getBoundingClientRect()).top;
      var room = footTop - 8 - last.base;
      var tight = room < Math.max(3 * lh + 16, low0 - last.base) + 2 * lh + 6;
      var named = {};   // the last baseline's name, in each unit
      // Each line's metrics, named at each unit's right edge (a baseline's, unless the lead under it is too little for
      // it and the next line's caps name both; and not the last's in the last unit, where its 404 is).
      for (var k = 0; k < U.count; k++) {
        rows.forEach(function (r, i) {
          note('cap', '', uLeft(k) + U.w - 4, r.cap - lh - 2, { quiet: true, end: true });
          note('x', '', uLeft(k) + U.w - 4, r.x - lh - 2, { quiet: true, end: true });
          var lastOne = i === rows.length - 1;
          if (lastOne ? k < U.count - 1 || one : rows[i + 1].cap - r.base >= 2 * lh + 6) {
            var nb = note('base', '', uLeft(k) + U.w - 4, r.base + 3, { quiet: true, end: true });
            if (lastOne) named[k] = nb.el;
          }
        });
      }
      // What was decided where, each noted in its own unit: above the first line's caps (or under its baseline, where
      // the header takes the room above), and under a later line's baseline. In the last unit, against its right edge.
      var taken = {}, used = {}, under = [];
      var put = function (key, value, x, row) {
        var k = unitOf(x), first = row === rows[0], id = k + ':' + rows.indexOf(row);
        var slot = (taken[id] = (taken[id] || 0) + 1) - 1;
        // Over the first line, clear of the box round a bit (whose top stands 0.018em over the caps), where there's
        // room; else as close as there is, or under the line.
        var below = tight && row === last ? low0 - row.base : lh + 10;
        var y = first ? row.cap - 2 * lh - 9 - slot * (2 * lh + 4) : row.base + below + slot * (2 * lh + 4);
        if (first && y < 2) y += 3;
        if (first && y < 2) y = row.base + below + slot * (2 * lh + 4);
        var end = k === U.count - 1;
        var nt = note(key, value, end ? uLeft(k) + U.w - 4 : uLeft(k) + 5, y, { end: end, unit: k });
        if (y > last.base) under.push(nt);
        if (named[k] && y > last.base && y < last.base + 3 + lh) { named[k].remove(); named[k] = null; }
        used[k] = 1;
        return k;
      };
      // The first letter of each line, hung into the margin (or past the edge it's set to) by what its shape asks: the
      // N by its side bearing, so its stem stands on the margin; the t by half its bar; the a's bowl a hair over.
      rows.forEach(function (r) {
        var word = r.words[0];
        var hang = parseFloat(getComputedStyle(word.el).marginLeft) / fs;
        if (!hang) return;
        var letter = word.el.textContent.trim().charAt(0);
        rule('v', r.cap - fs * 0.05, word.item.left, fs * 0.83);
        put(letter + ' hangs', fmt(Math.round(hang * 1000) / 1000), word.item.left + 1, r);
      });
      // The word spaces.
      rows.forEach(function (r) {
        for (var i = 1; i < r.words.length; i++) {
          var a = r.words[i - 1].box, b = r.words[i].box;
          if (b.left - a.right < fs * 0.1) continue;
          span(a.right, b.left, r.x + fs * 0.27);
          put('space', bare((b.left - a.right) / fs), (a.right + b.left) / 2, r);
        }
      });
      // The dots: square bits, the width of the stem, in place of the i's own (drawn by the box round the i, from the
      // foot of that box: lost.css, .gl-mi).
      list(title.querySelectorAll('.gl-mi')).forEach(function (d) {
        var i = rel(d.getBoundingClientRect());
        var b = { left: i.left + fs * 0.051, top: i.bottom - fs * 0.9867, width: fs * 0.105, height: fs * 0.105 };
        b.bottom = b.top + b.height;
        boxAround(b);
        put('i → bit', '0.105em', b.left, rowOf({ top: b.top + fs * 0.4, bottom: b.bottom + fs * 0.4 }));
      });
      // The stop, drawn as it is, in register, on the last column's edge: the rule it stands on, from the first line's
      // caps to the last baseline; and before it, in the column the word ends in (where that's not the empty column's
      // unit too, whose one note is 404), its space.
      var stop = title.querySelector('.gl-stop');
      var sb = rel(stop.getBoundingClientRect());
      span(sb.left - fs * 0.045, sb.left, last.x + fs * 0.27);
      if (unitOf(sb.left - gap - 1) < U.count - 1) put('stop', fmt(0.045), sb.left - gap - 1, last);
      var drawn = make('i', 'gl-lens__stop');
      drawn.style.cssText = 'left:' + px(sb.left) + ';top:' + px(sb.top) + ';width:' + px(sb.width) + ';height:' + px(sb.height) + ';--sw:' + (fs * 0.0214).toFixed(2) + 'px';
      plate.appendChild(drawn);
      rule('v', rows[0].cap - fs * 0.05, m + (12 - per) * P, last.base - rows[0].cap + fs * 0.1);
      // The lead, from one line's baseline to the next one's caps, in the unit nearest the middle with nothing else to
      // say: a dimension line down the middle of the unit, broken by its note.
      if (rows.length > 1) {
        var free = [];
        for (var q = 0; q < U.count - 1; q++) if (!used[q]) free.push(q);
        free.sort(function (a, b) { return Math.abs(a - (U.count - 1) / 2) - Math.abs(b - (U.count - 1) / 2); });
        if (free.length) {
          var gx = uLeft(free[0]) + U.w / 2;
          rule('v', rows[0].base, gx, rows[1].cap - rows[0].base);
          note('lead', bare((rows[1].cap - rows[0].base) / fs), gx, (rows[0].base + rows[1].cap) / 2 - lh, { unit: free[0], mid: true });
          used[free[0]] = 1;
        }
      }
      // The tracking, once, in the first unit with nothing else to say.
      for (var t = 0; t < U.count - 1; t++) {
        if (used[t]) continue;
        var ty = rows[0].cap - 2 * lh - 9 >= 2 ? rows[0].cap - 2 * lh - 9 : rows[0].cap - 2 * lh - 6 >= 2 ? rows[0].cap - 2 * lh - 6 : rows[0].base + lh + 10;
        note('tracking', '−0.034em', uLeft(t) + 5, ty, { quiet: true, unit: t });
        break;
      }
      // Each unit's number and width, under the title and under every note under it (tight, not where a decision
      // stands in its place); the last's is the empty column's, and where a width would be, 404.
      var deep = 0;
      for (var u = 0; u < U.count; u++) {
        var low = low0, gave = false;
        under.forEach(function (nt) { if (nt.unit === u) { low = Math.max(low, nt.top + 2 * lh + 6); gave = true; } });
        var instead = tight && gave && u < U.count - 1;
        if (u === U.count - 1) {
          note(per > 1 ? 'cols 11–12' : 'col 12', '404', uLeft(u) + U.w - 4, low, { end: true });
        } else if (!instead) {
          var c0 = u * U.per + 1, cn = (u + 1) * U.per;
          note(U.per > 1 ? 'cols ' + two(c0) + '–' + two(cn) : 'col ' + two(u + 1), Math.round(U.w) + 'px', uLeft(u) + 5, low, { quiet: true });
        }
        deep = Math.max(deep, instead ? low : low + 2 * lh + 6);
      }
      // The window ends 6px under its lowest note, as the home page's, and never lies over the foot: 8px over it at
      // the most.
      deep = Math.min(deep, footTop - 8);
      win.style.height = plate.style.height = edges.style.height = px(deep);
      el.classList.add('is-built');
      built = true;
      at = U.count - 1;
      x = aimed = posX(at);
      v = 0;
      place(x);
    };
    var posX = function (j) { return U.left + j * U.step; };
    // The window's place, and the plate's the other way, so the drawing stands still under it: written on the three of
    // them alone, so a step restyles nothing else.
    var place = function (p) {
      var t = p.toFixed(2) + 'px 0';
      win.style.translate = t;
      edges.style.translate = t;
      plate.style.translate = (-p).toFixed(2) + 'px 0';
    };
    // The window's spring: the home page's, 4.2 per second, zeta 0.68.
    var run = function (t) {
      var dt = Math.min(0.032, Math.max(0.001, (t - then) / 1000));
      then = t;
      var w = 2 * Math.PI * 4.2, z = 0.68;
      v += (-w * w * (x - aimed) - 2 * z * w * v) * dt;
      x += v * dt;
      if (Math.abs(x - aimed) < 0.1 && Math.abs(v) < 1) { x = aimed; v = 0; spring = 0; }
      else spring = requestAnimationFrame(run);
      place(x);
    };
    var to = function (j, instant) {
      if (!built) return;
      at = clamp(j, 0, U.count - 1);
      aimed = posX(at);
      if (instant || still.matches) { cancelAnimationFrame(spring); spring = 0; x = aimed; v = 0; place(x); return; }
      if (!spring) { then = now(); spring = requestAnimationFrame(run); }
    };
    // A moment after it's let go, quiet where it is.
    var home = function (ms) {
      clearTimeout(back);
      back = setTimeout(function () { if (!drag) quiet(true); }, ms);
    };
    var unitAt = function (clientX) {
      var p = clientX - gl.getBoundingClientRect().left;
      return Math.floor((p - U.left + (U.step - U.w) / 2) / U.step);
    };
    var wake = function (clientX) {
      if (!built) build();
      if (!built) return;
      clearTimeout(back);
      // Woken from quiet, it's there under the pointer at once; awake, it springs after it.
      if (hush) { quiet(false); to(unitAt(clientX), true); } else to(unitAt(clientX));
    };
    var inBand = function (clientY) {
      var y = clientY - gl.getBoundingClientRect().top;
      if (!band) { var tb = title.getBoundingClientRect(); return y >= 0 && y <= tb.bottom - gl.getBoundingClientRect().top + 30; }
      return y >= 0 && y <= band.bottom;
    };
    // A mouse over the title moves it, and a moment after it leaves, it goes quiet. A finger's sideways drag on the
    // title scrubs it (an up or down one is the page's scroll, and lets it be), and a tap puts it where the finger is.
    gl.addEventListener('pointermove', function (e) {
      if (!live || forced.matches) return;
      if (e.pointerType === 'mouse') {
        if (inBand(e.clientY)) wake(e.clientX);
        else if (!hush) home(1100);
        return;
      }
      if (!drag || drag.id !== e.pointerId) return;
      var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (!drag.side) {
        if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy) * 1.2) drag.side = true;
        else if (Math.abs(dy) > 10) { drag = null; return; }
      }
      if (drag.side) wake(e.clientX);
    });
    gl.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse' && !hush) home(1100); });
    title.parentNode.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' || !live || forced.matches) return;
      drag = { id: e.pointerId, x: e.clientX, y: e.clientY, side: false, t: now() };
    });
    var lift = function (e) {
      if (!drag || drag.id !== e.pointerId) return;
      if (!drag.side && now() - drag.t < 350 && Math.abs(e.clientX - drag.x) < 8 && Math.abs(e.clientY - drag.y) < 8) wake(e.clientX);
      var moved = !hush;
      drag = null;
      if (moved) home(2600);
    };
    gl.addEventListener('pointerup', lift);
    gl.addEventListener('pointercancel', function (e) { if (drag && drag.id === e.pointerId) { drag = null; if (!hush) home(2600); } });
    return {
      // Moved only once the poster has arrived.
      ready: function () { live = true; },
      // After a resize, or the fonts: built again when next wanted (the type may have moved), and quiet.
      reset: function () {
        cancelAnimationFrame(spring); spring = 0;
        clearTimeout(back);
        drag = null;
        built = false;
        band = null;
        el.classList.remove('is-built');
        el.textContent = '';
        quiet(true);
      }
    };
  })();

  // ------------------------------------------------------------ Setting it going

  arrival.after(function () { lens.ready(); });
  arrival.start();
  document.fonts.ready.then(function () { measureFoot(); lens.reset(); });
  var resized = 0;
  window.addEventListener('resize', function () {
    cancelAnimationFrame(resized);
    resized = requestAnimationFrame(function () { measureFoot(); lens.reset(); });
  });
})();
