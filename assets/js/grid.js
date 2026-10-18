// The home page (index.html, grid.css): the deck, its columns and the rooms' arrivals; the header's ink; the arrival of
// the screen the page opens on, from the void (the first screen's, or a room's); and the first screen's lens.
//
// The page scrolls as any other, and snaps a screen at a time (CSS scroll snap). A finger scrolls it, and the deck
// reads that, and draws. Everything else that would scroll it a screen at a time, the deck takes itself, as one
// instant move to a stop, never an animated scroll, and plays the columns by time (Keys and the wheel, below): Page
// Down and Up, the space bar, the arrows, End and Home, and the wheel or a trackpad, a screen to each gesture. A press
// or a gesture while a step is still arriving hurries it and is taken once it's there, one press a screen; one the
// other way turns it back at once. A few times it puts the reader somewhere, as the browser itself would if it could.
// When the keyboard's focus, or a find in the page, goes to a screen that isn't showing, it goes to that screen (the
// browser can't, because every screen is held to the viewport and so counts as in view): for the focus, the screen is
// simply there, at once, so what has the focus is never under a column coming in; for a find, it plays its arrival
// there, once. A link to a passage (a text fragment) opens on the screen the passage is on (Safari keeps the passage
// to itself: there it's the screen Safari moves to it on). When the page is laid out anew (the deck turned on or off,
// a window resized, a phone turned), it keeps the reader on their screen; on a reload or a step back to the page, it
// puts them back on the one they were on (kept for the tab), and should Safari put the page back at the top as it
// finishes loading, or as it brings the page back from its cache (it does on an iPhone), back on that screen. Whichever
// screen the page opens on plays its arrival over the void, the first screen's or a room's (The first screen's
// arrival, below). In Safari on a Mac and in Firefox on a desktop the page doesn't snap while the deck is drawn
// (ownSnap, below): there the deck keeps it on its stops itself, and a scroll come to rest between two of them finishes
// the step the reader was taking, or, if it's only a small move from the stop the reader is on, goes back there.
//
// The deck. Every screen after the first rises over the one before as twelve columns of its ground (six on a phone),
// each carrying its strip of the room's big type: its name, its number, the Studio's motto. Each column is a damped
// spring. A step the deck takes is played by time: each column's spring is let go towards its place at its moment in
// its app's cascade, and moves at once, from wherever it is. Under a finger, and as the browser's own glide and snap
// carry the scroll on after it, each column's target is how far the scroll has come through the screen's track, its
// rise beginning the later in the track the later it is in the cascade, so a slow drag scrubs the cascade under the
// finger; and scrolling back brings them down, the last risen first. A column going past its place takes the type
// only a fifth as far, so the name is a pixel or two out of register as the columns overshoot, and clicks into
// register as they settle. As each column lands, the rest of the room over it is uncovered (one clip, changed a column
// at a time). When the columns are all up, the room has arrived (.is-here: the square dots of its i's come out of
// their stems); when they've settled and the scroll is at rest, it's done (.is-done).
//
// Each app keeps its own time (CASCADES): Michi's columns are struck home left to right, quicker and quicker, like a
// postmark; Lark's come in from the right margin carrying its name, the call, and in each the name's echo comes up a
// beat behind (ECHO); Kozeni's stack like coins counted onto a counter, short and hard, and then its spine drops into
// its slot from the top; the Studio's come down as a curtain. Each room arrives in about half a second and is at rest
// in about four fifths of one (Lark, its echo a beat behind, a little later).
//
// A jump of more than one screen (an index link, the header's Contact, End or Home) doesn't play every room it passes:
// the screen the reader left is held where it was, the rooms between are left out, and only the screen they land on
// plays its columns, over the one they left, as a step would. And while a room's columns are in flight, the screen
// under them is held where it rests, however the scroll moves. It works once a frame, only while the scroll moves or a
// spring hasn't settled, and writes only what changed.
(function () {
  'use strict';
  var root = document.documentElement;
  var deck = document.querySelector('[data-g-deck]');

  var still = window.matchMedia('(prefers-reduced-motion: reduce), (forced-colors: active)');
  var clamp = function (x) { return x < 0 ? 0 : x > 1 ? 1 : x; };
  var now = function () { return performance.now(); };
  var list = function (nodes) { return Array.prototype.slice.call(nodes); };

  // ------------------------------------------------------------ The site's links to this page

  // The header's Contact, the footer's apps and the mark point at this page from every page (/#contact, /#michi, /).
  // Here they're pointed at its own screens (#contact, #michi; the mark at #, the first), so they're links within the
  // page: the mark's goes to the first screen as the others go to theirs, where / would load the page anew, and the
  // header's Contact is marked as the screen it leads to is reached (navLinks, At rest).
  list(document.querySelectorAll('a[href]')).forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === '/') a.setAttribute('href', '#');
    else if (/^\/#[\w-]+$/.test(href) && document.getElementById(href.slice(2))) a.setAttribute('href', href.slice(1));
  });

  // ------------------------------------------------------------ The screens

  var screens = list(deck.querySelectorAll('[data-g-screen]')).sort(function (a, b) {
    return parseInt(a.getAttribute('data-g-screen'), 10) - parseInt(b.getAttribute('data-g-screen'), 10);
  });
  var hero = screens[0];
  var marks = screens.map(function (el, k) { return k === 0 ? deck.querySelector('[data-g-stage] > .g-snap') : el.querySelector(':scope > .g-snap'); });
  var rooms = screens.slice(1).map(function (el, j) {
    return {
      k: j + 1,
      el: el,
      key: el.id,
      screen: el.querySelector('.g-screen'),
      bed: el.querySelector('.g-slabs'),
      content: el.querySelector('.g-content'),
      head: el.querySelector('.g-screen > .g-head'),
      grid: el.querySelector('.g-grid'),
      album: el.querySelector('.g-piece .album'),
      cascade: el.getAttribute('data-g-cascade'),
      slabs: [], n: 0, h: 0, over: 0,
      p: 0, landed: '', here: false, done: false, moving: false,
      drive: null, frozen: false, skipped: false, hit: false
    };
  });

  // ------------------------------------------------------------ The cascades

  // Each gives every column, counted from the left, its moment of delay after the first to rise (ms), which way it
  // comes (1, up from the foot; -1, down from the head) and its spring (f, its frequency in Hz; z, its damping
  // ratio: at 0.84 a column goes a pixel past its place on a laptop's screen, at 0.88 and over not at all). spine
  // marks the columns a vertical name stands in (Kozeni's), which drop rather than spring (DROP).
  var range = function (n, fn) { var out = []; for (var i = 0; i < n; i++) out.push(fn(i)); return out; };
  var CASCADES = {
    // Michi: left to right, each column struck home and held, like a postmark, quicker and quicker, as a hand
    // franking a pile of letters goes: each wait a little shorter than the one before, the first n/2 times the last
    // (of twelve, 61ms between the first two, 10ms between the last two).
    strike: function (n) {
      var r = Math.pow(2 / n, 1 / Math.max(1, n - 2)), all = 1 - Math.pow(r, n - 1);
      return range(n, function (i) { return { delay: 320 * (1 - Math.pow(r, i)) / all, from: 1, f: 4.6, z: 0.84 }; });
    },
    // Lark: a call and its echo, as its drill plays a sentence and you say it back. From the right margin in, where
    // its name stands, over a quarter of a second; in every column the strip of the name's echo, a line under the
    // name, rises a beat (ECHO) behind its column, as you say a sentence back a beat behind (draw), so the room is at
    // rest by about four fifths of a second.
    echo: function (n) {
      return range(n, function (i) { return { delay: 260 * (n - 1 - i) / Math.max(1, n - 1), from: 1, f: 4.6, z: 0.84 }; });
    },
    // Kozeni: coins counted onto a counter, from the right, short and hard, none past its place; then its spine
    // dropped into its slot from the top, both its columns as one, falling faster as it goes to a dead stop, and the
    // room gives under it.
    coins: function (n, spine) {
      var coins = [];
      for (var i = n - 1; i >= 0; i--) if (!spine[i]) coins.push(i);
      var plan = [];
      var step = 24 * 9 / Math.max(1, coins.length - 1);
      coins.forEach(function (c, at) { plan[c] = { delay: at * step, from: 1, f: 6, z: 0.92 }; });
      var drop = (coins.length - 1) * step + 40;
      for (var s = 0; s < n; s++) if (spine[s]) plan[s] = { delay: drop, from: -1, f: 6, z: 1, spine: true };
      return plan;
    },
    // The Studio: a curtain, left to right, from the top.
    curtain: function (n) {
      return range(n, function (i) { return { delay: 240 * Math.pow(i / (n - 1), 0.9), from: -1, f: 4.2, z: 0.88 }; });
    }
  };
  // Following the scroll (under a finger, on through the browser's own glide and snap after it, or the scrollbar's):
  // each column's rise begins a share of the way through the track (spread over the first SPREAD of it, in its
  // cascade's order) and takes STRETCH of it, its spring a little quicker and never past its place, so the columns stay
  // with the scroll. A step played by time has no share: its columns keep their cascade's delays, and nothing else.
  var SPREAD = 0.42, STRETCH = 0.5, HELD = { f: 1.25, z: 0.9 };
  var UP = 0.97;   // a column this far up has landed: what's over it is uncovered
  var GIVE = 0.2;  // how far the type goes with a column past its place
  // Lark's echo: its strip in each column rises ECHO ms behind the column, on the column's spring, when a step is
  // played by time (following the scroll, or going back, it goes with its column).
  var ECHO = 150;
  // A spine's drop, from the top: DROP ms, falling faster as it goes, as a weight does, to a dead stop.
  var DROP = 200;
  // Going back, the columns go down the reverse of their cascade, the last risen first, BACK_GAP ms apart, on a
  // spring that never goes past its foot, so no column bounces at the screen's edge; any in flight turn at once.
  var BACK_GAP = 16, BACK = { f: 5, z: 1 };
  // A step taken while the one before is still arriving: what's left of that one's delays is cut to HURRY of them and
  // its springs quickened HURRY_F times, and the next starts as soon as it's there, its delays QUICK of its own.
  var HURRY = 0.3, HURRY_F = 1.6, QUICK = 0.6;

  // ------------------------------------------------------------ State

  var on = false;      // the deck is drawn
  var stops = [];      // where each screen rests, in the page's scroll
  var raf = 0, last = 0, moved = 0;
  var lastY = window.scrollY;
  var anchor = 0;      // the screen the reader is on: where the scroll came to rest, or has since got to
  var place = 0;       // the same, kept while the screens are stacked too, so a new layout puts the reader back there
  var jump = null;     // a jump of more than one screen, while it plays
  var touching = 0, pressing = false, resizedAt = -1e9;

  // The page's scroll, and an instant move of it (never an animated one: the deck draws the rest).
  var Y = function () { return window.scrollY; };
  var to = function (y) { if (Math.abs(window.scrollY - y) > 0.5) window.scrollTo({ top: y, left: 0, behavior: 'instant' }); };

  // ------------------------------------------------------------ The scroll, as it was a moment ago

  var hist = [];   // [time, the scroll], the last 800ms
  var record = function (t, y) {
    var n = hist.length;
    // Waking from rest, the scroll stood still until now: a step, not a slope from the last sample.
    if (n && t - hist[n - 1][0] > 90 && hist[n - 1][1] !== y) hist.push([t - 1, hist[n - 1][1]]);
    n = hist.length;
    if (!n || hist[n - 1][1] !== y || t - hist[n - 1][0] > 50) hist.push([t, y]);
    while (hist.length > 2 && hist[1][0] < t - 800) hist.shift();
  };
  var scrollAt = function (t) {
    var n = hist.length;
    if (t >= hist[n - 1][0]) return hist[n - 1][1];
    for (var i = n - 1; i > 0; i--) {
      var a = hist[i - 1], b = hist[i];
      if (t >= a[0]) return a[1] + (b[1] - a[1]) * ((t - a[0]) / Math.max(1, b[0] - a[0]));
    }
    return hist[0][1];
  };

  // ------------------------------------------------------------ Measuring

  var measure = function () {
    var y = Y();
    stops = marks.map(function (m, k) { return k === 0 ? 0 : Math.round(m.getBoundingClientRect().top + y); });
  };
  var nearest = function (y) {
    var k = 0;
    for (var i = 1; i < stops.length; i++) if (Math.abs(y - stops[i]) < Math.abs(y - stops[k])) k = i;
    return k;
  };
  // How far room r has risen over the screen before it, for a scroll of y.
  var progress = function (r, y) {
    var a = stops[r.k - 1], b = stops[r.k];
    return clamp((y - a) / Math.max(1, b - a));
  };
  // Where screen k's top is in the viewport for a scroll of y, as the page lays it out (sticky, it's held at the top
  // from the rest of the screen before it to the rest of the one after it).
  var natTop = function (k, y) {
    var from = k === 0 ? 0 : stops[k - 1];
    var till = k === 0 ? stops[1] : k === stops.length - 1 ? stops[k] : stops[k + 1];
    return y < from ? from - y : y > till ? till - y : 0;
  };

  // A room's columns: one to a column of its grid, or two on a phone, meeting in the middle of its gutters a pixel
  // over, the first and last running out to the screen's edges; each with its cascade's timing, and a copy of each
  // piece of the room's big type it crosses, placed to the pixel where the room has it.
  var build = function (r) {
    r.bed.textContent = '';
    r.echoes = false;
    // The columns' type rides in a layer of its own over their grounds, cut off under the header's band, so that the
    // big type a column carries in, or pushes out, never crosses the header (grid.css); the numbers, which are
    // architecture, ride on the grounds themselves and run on to the screen's edge.
    if (!r.types) {
      r.types = document.createElement('div');
      r.types.className = 'g-types';
      r.types.setAttribute('aria-hidden', 'true');
      r.bed.after(r.types);
    }
    r.types.textContent = '';
    var g = r.grid, s = getComputedStyle(g);
    var W = g.clientWidth, m = parseFloat(s.paddingLeft) || 0, gap = parseFloat(s.columnGap) || 0;
    var P = (W - 2 * m + gap) / 12;
    var n = W < 720 ? 6 : 12, per = 12 / n;
    var edge = function (j) { return m + j * P - gap / 2; };
    var box = r.screen.getBoundingClientRect();
    // (Everything of each piece read here, before anything is written: its insides' lengths too, once, not once for
    // each column's copy, each of which would have the page's styles worked out again.)
    var rides = list(r.content.querySelectorAll('[data-g-ride]')).map(function (el) {
      var b = el.getBoundingClientRect(), cs = getComputedStyle(el), wm = cs.writingMode;
      return {
        el: el, left: b.left - box.left, top: b.top - box.top, width: b.width, height: b.height,
        size: cs.fontSize, mode: wm, rotate: cs.rotate, side: wm !== 'horizontal-tb',
        pad: parseFloat(cs.fontSize) * 0.12, name: el.classList.contains('g-art--name') && !el.classList.contains('g-echo'),
        echo: el.classList.contains('g-echo'), no: el.classList.contains('g-no'),
        inner: list(el.querySelectorAll('*')).map(function (x) { var xs = getComputedStyle(x); return [xs.paddingLeft, xs.paddingRight, xs.marginLeft, xs.marginRight]; })
      };
    }).filter(function (d) { return d.width > 0 && d.height > 0; });
    var bounds = range(n, function (i) { return [i === 0 ? 0 : edge(i * per), i === n - 1 ? W : edge((i + 1) * per)]; });
    // Kozeni's spine: the columns its name stands in, where it's set on its side: every column its letters touch, their
    // ink running a little past the name's box (its round letters, a K's arms: the box widened by 0.04em), so no coin
    // column ever carries a strip of it. (Less than half a gutter, so a spine that fills its columns takes no more.)
    var spine = range(n, function () { return false; });
    rides.forEach(function (d) {
      if (!d.side || !d.name) return;
      var over = parseFloat(d.size) * 0.04;
      bounds.forEach(function (b, i) { if (b[1] > d.left - over && b[0] < d.left + d.width + over) spine[i] = true; });
    });
    var plan = CASCADES[r.cascade](n, spine);
    var most = Math.max.apply(null, plan.map(function (c) { return c.delay; })) || 1;
    var frag = document.createDocumentFragment(), tfrag = document.createDocumentFragment();
    r.slabs = plan.map(function (c, i) {
      var x0 = bounds[i][0] - 0.5, x1 = bounds[i][1] + 0.5;
      var el = document.createElement('div');
      el.className = 'g-slab' + (c.from < 0 ? ' g-slab--drop' : '');
      el.style.left = x0.toFixed(2) + 'px';
      el.style.width = (x1 - x0).toFixed(2) + 'px';
      // The grid's column in it drawn as its two edges at rest, and a tick on each at the foot: one column of the
      // grid, or on a phone the two it carries, as one.
      var col = document.createElement('i');
      col.className = 'g-slab__col';
      col.style.left = (m + i * per * P - x0).toFixed(2) + 'px';
      col.style.width = (per * P - gap).toFixed(2) + 'px';
      el.appendChild(col);
      var lines = document.createElement('b');
      lines.className = 'g-slab__lines';
      var colL = m + i * per * P, colR = m + (i + 1) * per * P - gap;
      lines.style.setProperty('--l0', (colL - x0).toFixed(2) + 'px');
      lines.style.setProperty('--r0', (x1 - colR).toFixed(2) + 'px');
      el.appendChild(lines);
      frag.appendChild(el);
      var strip = document.createElement('div');
      strip.className = 'g-strip' + (c.from < 0 ? ' g-strip--drop' : '');
      strip.style.left = el.style.left;
      strip.style.width = el.style.width;
      tfrag.appendChild(strip);
      // y, how far up it is (0 at its foot, 1 home), and v, how fast it's going; under a finger its rise begins at
      // start in the track; played by time, at at, towards goal, on its spring (sf, sz), or for a spine, its drop.
      return { el: el, strip: strip, rides: [], from: c.from, delay: c.delay, start: (c.delay / most) * SPREAD, f: c.f, z: c.z, sf: c.f, sz: c.z, spine: !!c.spine, y: 0, v: 0, goal: 0, at: 0, busy: false, drop: null, drawn: null, flying: false, ey: 0, ev: 0, eg: 0 };
    });
    r.bed.appendChild(frag);
    r.types.appendChild(tfrag);
    // The column under the pointer, brightened (pointer, below): its two edges, and its number at the foot.
    r.hi = document.createElement('i');
    r.hi.className = 'g-colhi';
    r.hi.style.left = m.toFixed(2) + 'px';
    r.hi.style.width = (per * P - gap).toFixed(2) + 'px';
    r.hi.appendChild(document.createElement('b')).className = 'g-colhi__no';
    r.bed.appendChild(r.hi);
    r.grid12 = { m: m, step: per * P, gap: gap, n: n, per: per };
    // The columns are as tall as the screen and a little more on both sides: on their trailing side, so that going
    // past their place they never show what's under their foot, and on their leading side, so that springing back
    // from past it they never show it either (grid.css). r.over is the one, r.lead the other.
    r.H = r.screen.offsetHeight;
    var first = r.slabs[0].el;
    r.h = first.offsetHeight;
    var rising = r.slabs.filter(function (s) { return s.from > 0; })[0], dropping = r.slabs.filter(function (s) { return s.from < 0; })[0];
    if (rising) { r.lead = -rising.el.offsetTop; r.over = Math.max(0, r.h - r.H - r.lead); }
    else if (dropping) { r.over = -dropping.el.offsetTop; r.lead = Math.max(0, r.h - r.H - r.over); }
    r.slabs.forEach(function (sl, i) {
      var x0 = bounds[i][0] - 0.5, x1 = bounds[i][1] + 0.5, top = sl.from < 0 ? -r.over : -r.lead;
      sl.el.style.setProperty('--y0', (-top).toFixed(1) + 'px');
      rides.forEach(function (d) {
        if (d.left + d.width + d.pad < x0 || d.left - d.pad > x1) return;
        var copy = d.el.cloneNode(true);
        copy.removeAttribute('data-g-ride');
        copy.classList.add('g-ride');
        if (d.side) copy.classList.add('g-art--side');
        copy.style.left = (d.left - x0).toFixed(2) + 'px';
        copy.style.top = (d.top - top).toFixed(2) + 'px';
        copy.style.width = d.width + 'px';   // to the full fraction, so a line that just fits still fits
        copy.style.height = d.height.toFixed(2) + 'px';
        copy.style.fontSize = d.size;
        copy.style.writingMode = d.mode;
        if (d.rotate && d.rotate !== 'none') copy.style.rotate = d.rotate;
        // Its insides as they're laid out in the room: lengths measured against the room's columns (the motto's
        // indent) mean nothing in a column, so each is set in pixels.
        var to = copy.querySelectorAll('*');
        for (var e = 0; e < d.inner.length && e < to.length; e++) {
          var q = d.inner[e];
          to[e].style.paddingLeft = q[0];
          to[e].style.paddingRight = q[1];
          to[e].style.marginLeft = q[2];
          to[e].style.marginRight = q[3];
        }
        (d.no ? sl.el : sl.strip).appendChild(copy);
        sl.rides.push({ el: copy, top: d.top, bottom: d.top + d.height, echo: d.echo });
        if (d.echo) r.echoes = true;
      });
    });
    r.n = n;
    r.bounds = bounds;
    r.width = W;
    r.landed = '';
    r.clip = null;
    r.headH = r.head.offsetHeight;
    r.covered = '';
  };

  // ------------------------------------------------------------ Drawing

  // What of the room is uncovered: the columns that have landed, as one polygon of upright strips.
  var clipFor = function (r, up) {
    var strips = [], i = 0;
    while (i < r.n) {
      if (!up[i]) { i++; continue; }
      var a = i;
      while (i + 1 < r.n && up[i + 1]) i++;
      strips.push([a === 0 ? -r.width : r.bounds[a][0] - 0.5, i === r.n - 1 ? 2 * r.width : r.bounds[i][1] + 0.5]);
      i++;
    }
    if (!strips.length) return 'inset(0 0 100% 0)';
    if (strips.length === 1 && strips[0][0] < 0 && strips[0][1] > r.width) return 'none';
    var pts = [];
    strips.forEach(function (s) { pts.push(s[0].toFixed(1) + 'px 200%', s[0].toFixed(1) + 'px -100%', s[1].toFixed(1) + 'px -100%', s[1].toFixed(1) + 'px 200%'); });
    return 'polygon(' + pts.join(', ') + ')';
  };

  var draw = function (r) {
    var moving = false, all = true, any = false, up = [], key = '';
    for (var i = 0; i < r.slabs.length; i++) {
      var s = r.slabs[i], y = s.y;
      var t = y <= 0 ? 'translateY(' + (s.from * 100) + '%)' : y === 1 ? 'none' : 'translateY(' + (s.from * (1 - y) * r.h).toFixed(2) + 'px)';
      if (t !== s.drawn) { s.drawn = t; s.el.style.transform = t; s.strip.style.transform = t; }
      // Past its place, the column takes the type only GIVE as far: the rest is the type's give within it. And the
      // type is pushed on out of the column by the next room's column rising into it (push, below). Lark's echo is
      // where its own spring, a beat behind the column's, has it (tick), and goes only GIVE as far past its place too.
      var rel = y > 1 ? s.from * (1 - GIVE) * (y - 1) * r.h : 0;
      var ey = s.ey, erel = r.echoes ? s.from * (y - (ey > 1 ? 1 + GIVE * (ey - 1) : ey)) * r.h : rel;
      for (var j = 0; j < s.rides.length; j++) {
        var d = s.rides[j], off = (d.echo ? erel : rel) + (d.push || 0);
        // Pushed right out of its column, it's simply hidden: no transform, no layer.
        var out = d.push && (d.bottom + off <= 0 || d.top + off >= r.H);
        var rt = out ? 'out' : Math.abs(off) < 0.05 ? '' : 'translateY(' + off.toFixed(2) + 'px)';
        if (rt !== d.drawn) {
          d.drawn = rt;
          d.el.style.transform = out ? '' : rt;
          d.el.style.visibility = out ? 'hidden' : '';
          d.el.classList.toggle('is-off', !out && rt !== '');
        }
      }
      // In flight, its edges are drawn; once it has landed they fade (grid.css).
      var flying = y > 0.001 && y < 0.985;
      if (flying !== s.flying) { s.flying = flying; s.el.classList.toggle('is-flying', flying); }
      if (s.busy) moving = true;
      var landed = y >= UP;
      up.push(landed);
      key += landed ? '1' : '0';
      if (landed) any = true; else all = false;
      // Kozeni's spine, dropped into its slot: the room gives under it, once.
      if (s.spine && y >= 1 && !r.hit) { r.hit = true; give(r); }
      if (s.spine && y < 0.5) r.hit = false;
    }
    if (key !== r.landed) {
      r.landed = key;
      var clip = clipFor(r, up);
      if (clip !== r.clip) { r.clip = clip; r.content.style.clipPath = clip === 'none' ? '' : clip; }
    }
    // The header is the screen's as soon as a column is under it: its copy in this room's ink is uncovered over each
    // column whose leading edge has passed most of the header's band (rising, near its top; coming down, near its foot).
    // (How many are, capped: the browser's bar goes with most of them, atTop.)
    var over = [], ck = '', capped = 0;
    for (var c = 0; c < r.slabs.length; c++) {
      var sl = r.slabs[c];
      var under = sl.y <= 0 ? false : sl.from > 0 ? (1 - sl.y) * r.h - r.lead <= r.headH * 0.35 : (r.h - r.over) - (1 - sl.y) * r.h >= r.headH * 0.65;
      over.push(under);
      ck += under ? '1' : '0';
      if (under) capped++;
    }
    r.capped = capped;
    if (ck !== r.covered) {
      r.covered = ck;
      var hc = clipFor(r, over);
      r.head.style.clipPath = hc === 'none' ? '' : hc;
    }
    // How far the room has come: by the scroll, or, played home by time ahead of the browser's snap, by its columns
    // (its screen is held where it rests the while).
    var here = r.here ? any && (r.p > 0.04 || !!(r.drive && r.drive.to > 0)) : all && (r.p >= 0.9 || !!(r.drive && r.drive.to > 0));
    var done = all && !moving && r.p >= 0.999;
    // While its columns move, each is a layer of its own (is-moving, grid.css), and stays one for a moment after they
    // stop (LAYERED), so that a column coming to rest and set off again doesn't make and unmake its layer from one
    // frame to the next (which Safari can show as a flash).
    var t = now();
    if (moving) r.movedAt = t;
    var layered = moving || t - (r.movedAt || -1e9) < LAYERED;
    r.moving = moving;
    if (layered !== r.layered) { r.layered = layered; r.el.classList.toggle('is-moving', layered); }
    if (here !== r.here) {
      r.here = here;
      r.el.classList.toggle('is-here', here);
      // Arrived while laid out at once (on load, after a resize or a jump): simply there, its dots already out, and
      // so it stays until it leaves (a class that's let go of would start its arrival over).
      r.el.classList.toggle('is-still', here && root.classList.contains('g-quiet'));
    }
    if (done !== r.done) { r.done = done; r.doneAt = done ? now() : null; r.el.classList.toggle('is-done', done); }
  };
  // A room come to rest covers every screen under it: a moment after it has (COVER), they're clipped away and paint
  // nothing at all, and only a moment after that (LET_GO) are they let go, their holds and the first screen's strips,
  // so that nothing under a room changes in the frame it lands, nor while it can still be seen. A room left out of a
  // jump covers nothing.
  var COVER = 40, LET_GO = 110, LAYERED = 150;
  // A room over the screen before it: from the moment its first column moves until a moment after it has come to
  // rest (its columns all landed counts, whether or not the scroll has caught up yet).
  var over = function (r, t) {
    if (r.skipped) return false;
    var flying = r.landed.indexOf('0') >= 0 && (r.moving || r.landed.indexOf('1') >= 0);
    var landed = r.landed !== '' && r.landed.indexOf('0') < 0;
    return flying || (landed && (!r.done || r.doneAt == null || t - r.doneAt < LET_GO));
  };
  var rested_ = function (r, t, ms) { return r.done && !r.skipped && r.doneAt != null && t - r.doneAt >= ms; };
  var settling = function (t) { return rooms.some(function (r) { return r.done && r.doneAt != null && t - r.doneAt < LET_GO + 20; }); };
  var covering = function (t) {
    var top = -1;
    rooms.forEach(function (r) { if (rested_(r, t, COVER)) top = Math.max(top, r.k - 1); });
    for (var k = 0; k < screens.length; k++) {
      var el = k === 0 ? hero : rooms[k - 1].screen, c = k <= top;
      if (c !== !!el.gCovered) { el.gCovered = c; el.classList.toggle('g-covered', c); }
    }
  };
  // The next room's columns push this one's type out ahead of them: a column rising into the screen takes the type in
  // it up and out of the top with its leading edge, as the next name comes in just behind; a column coming down (the
  // Studio's curtain) takes it down and out of the foot. Two strips of type meeting a column at a time, like the flaps
  // of a departures board.
  // What pushes a screen's type: the nearest room after it that isn't left out (the next, or in a jump the room it
  // lands on, or, going back, the screen it drops away from).
  var pusher = function (i) {
    for (var j = i; j < rooms.length; j++) if (!rooms[j].skipped) return rooms[j];
    return null;
  };
  var pushes = function () {
    rooms.forEach(function (r, i) {
      var next = pusher(i + 1);
      r.slabs.forEach(function (s, c) {
        var n = next && !next.skipped && next.slabs[c];
        s.rides.forEach(function (d) {
          var push = 0;
          if (n && n.y > 0) {
            if (n.from > 0) push = Math.min(0, (1 - n.y) * next.h - next.lead - d.bottom);
            else push = Math.max(0, (next.h - next.over) - (1 - n.y) * next.h - d.top);
          }
          d.push = push;
        });
      });
    });
  };
  var give = function (r) {
    r.el.classList.remove('is-give');
    void r.el.offsetWidth;
    r.el.classList.add('is-give');
    clearTimeout(r.gave);
    r.gave = setTimeout(function () { r.el.classList.remove('is-give'); }, 600);
  };

  // A held screen stays where it rests in the viewport while the scroll goes on: the screen a jump of more than one
  // left, and the screen under any room whose columns are still in flight (a scroll that runs past a room's stop
  // before its columns have landed, as a wheel's can, mustn't take the screen they're rising over with it).
  var hold = function (el, k, y, yes) {
    var t = yes ? 'translateY(' + (-natTop(k, y)).toFixed(1) + 'px)' : '';
    if (t !== el.gHeld) { el.gHeld = t; el.style.transform = t; }
  };
  var holdAll = function (y) {
    var under = {}, t = now();
    rooms.forEach(function (r) { if (over(r, t)) under[r.k - 1] = true; });
    var pinned = function (k) { return !!(jump && jump.held[k]) || !!under[k]; };
    hold(hero, 0, y, pinned(0));
    rooms.forEach(function (r) { hold(r.screen, r.k, y, pinned(r.k)); });
  };

  // Every column straight to where the scroll puts it, with no spring: on load, after a resize, and when a jump has
  // played. (But a room the page has landed on, whose arrival is still to begin, is kept down, held: arrival.)
  var settle = function () {
    var y = Y(), hushed = arrival.hushed();
    hist = [];
    record(now(), y);
    root.classList.add('g-quiet');
    rooms.forEach(function (r) {
      r.p = progress(r, y);
      r.drive = null; r.frozen = r === hushed; r.skipped = false;
      r.el.classList.remove('is-skipped');
      r.slabs.forEach(function (s) { s.y = s.goal = s.ey = s.eg = r === hushed ? 0 : clamp((r.p - s.start) / STRETCH); s.v = s.ev = 0; s.busy = false; s.at = 0; s.drop = null; });
      r.hit = r.slabs.some(function (s) { return s.spine && s.y >= 1; });
      r.landed = '';
    });
    pushes();
    rooms.forEach(draw);
    // Laid out at once: what's at rest has been so for a while.
    rooms.forEach(function (r) { if (r.done) r.doneAt = -1e9; });
    strips.push();
    jump = null;
    covering(now());
    holdAll(y);
    queue();
    requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.remove('g-quiet'); }); });
  };
  // The scroll moved by the deck itself (a key's step, a link, the focus): each room's progress is where the move put
  // it, so the frame after doesn't take it for a finger's.
  var sync = function (y) { rooms.forEach(function (r) { r.p = progress(r, y); }); };

  // A step played by time: room r's columns to their place (aim 1) or to their foot (aim 0), each from its moment in
  // the cascade on (its delay, or QUICK of it, quick), from wherever it is, at once. Going back, the last risen go
  // first, BACK_GAP apart. Turned back (or on again) part way, every column already in flight turns at once, from
  // where it is and at the speed it's going, and a column still waiting keeps its turn.
  var play = function (r, aim, t, quick) {
    r.drive = { to: aim, t0: t, hurried: false };
    r.frozen = r.skipped = false;
    r.el.classList.remove('is-skipped');
    var far = 1 - aim, k = quick ? QUICK : 1;
    var waiting = function (s) { return Math.abs(s.y - far) < 0.002 && Math.abs(s.v) < 0.02; };
    if (aim > 0) {
      var first = Infinity;
      r.slabs.forEach(function (s) { if (waiting(s) && s.delay < first) first = s.delay; });
      r.slabs.forEach(function (s) { s.at = waiting(s) ? t + (s.delay - first) * k : t; s.sf = s.f; s.sz = s.z; s.drop = null; });
    } else {
      var order = r.slabs.filter(waiting).sort(function (a, b) { return b.delay - a.delay; });
      r.slabs.forEach(function (s) { var i = order.indexOf(s); s.at = i < 0 ? t : t + i * BACK_GAP * k; s.sf = BACK.f; s.sz = BACK.z; s.drop = null; });
    }
  };
  // Another step pressed while one is still arriving: that one is hurried home, so the next can start the sooner.
  var hurry = function (t) {
    rooms.forEach(function (r) {
      var d = r.drive;
      if (!d || d.hurried || r.skipped || r.frozen) return;
      d.hurried = true;
      r.slabs.forEach(function (s) {
        if (s.at > t) s.at = t + (s.at - t) * HURRY;
        s.sf *= HURRY_F;
      });
    });
  };

  var tick = function (t) {
    raf = 0;
    // (A phone turned, its resize still to come: nothing the scroll does now is the reader's. onScroll, below.)
    if (turning && now() - turning < 1000) { lastY = Y(); return; }
    if (wheel.pin >= 0) keep();   // (a gesture the browser scrolls itself: the page back on its screen first)
    var y = Y();
    if (y !== lastY) { var y0 = lastY; lastY = y; seen(now(), y0, y); }
    record(t, y);
    var dt = Math.min(0.05, Math.max(0, (t - last) / 1000));
    last = t;
    var before = scrollAt(t - 60);
    if (y !== before) moved = t;
    var busy = t - moved < 400;
    if (arrival.frame(t)) busy = true;
    follow(y);
    rooms.forEach(function (r) {
      var was = r.p;
      r.p = progress(r, y);
      // The scroll moved this room on or back by itself (a finger, the browser's glide and snap, the scrollbar): its
      // columns follow the scroll from wherever they are, whatever step was playing.
      if (r.p !== was) r.drive = null;
      if (r.frozen || r.skipped) return;
      var d = r.drive;
      for (var i = 0; i < r.slabs.length; i++) {
        var s = r.slabs[i], f = s.sf, z = s.sz, goal;
        if (!d) { goal = clamp((r.p - s.start) / STRETCH); f = s.f * HELD.f; z = Math.max(s.z, HELD.z); }
        else goal = t < s.at ? s.goal : d.to;
        var w = 2 * Math.PI * f, steps = Math.max(1, Math.ceil(dt / 0.008)), h = dt / steps, k;
        // A spine dropped home by time: falling faster as it goes, to a dead stop.
        if (d && d.to > 0 && s.spine && t >= s.at) {
          if (!s.drop) s.drop = { from: s.y, t0: s.at, T: DROP * Math.sqrt(Math.max(0.01, 1 - s.y)) * (d.hurried ? QUICK : 1) };
          var u = (t - s.drop.t0) / s.drop.T;
          s.y = u >= 1 ? 1 : s.drop.from + (1 - s.drop.from) * u * u;
          s.v = 0; s.goal = 1; s.busy = u < 1;
          if (s.busy) busy = true;
        } else {
          s.goal = goal;
          var x = s.y, v = s.v;
          if (Math.abs(goal - x) < 0.0004 && Math.abs(v) < 0.004) { s.y = goal; s.v = 0; s.busy = false; }
          else {
            for (k = 0; k < steps; k++) {
              v += (-w * w * (x - goal) - 2 * z * w * v) * h;
              x += v * h;
            }
            s.y = x;
            s.v = v;
            s.busy = true;
            busy = true;
          }
        }
        // Lark's echo: going up by time, its goal is its column's a beat (ECHO) later, on the same spring; following
        // the scroll, or going back, it's simply with its column.
        if (r.echoes) {
          if (!d || d.to <= 0) { s.ey = s.eg = s.y; s.ev = s.v; }
          else {
            if (t >= s.at + (d.hurried ? ECHO * HURRY : ECHO)) s.eg = d.to;
            var ex = s.ey, ev = s.ev;
            if (Math.abs(s.eg - ex) < 0.0004 && Math.abs(ev) < 0.004) { s.ey = s.eg; s.ev = 0; }
            else {
              for (k = 0; k < steps; k++) {
                ev += (-w * w * (ex - s.eg) - 2 * z * w * ev) * h;
                ex += ev * h;
              }
              s.ey = ex;
              s.ev = ev;
              s.busy = true;
              busy = true;
            }
          }
        }
      }
      if (d && r.slabs.some(function (s) { return s.at > t; })) busy = true;
      // A screen a jump holds, played back into the screen it left: it stays there until the jump is over.
      if (d && d.to === 0 && jump && jump.held[r.k] && r.slabs.every(function (s) { return !s.busy && s.y === 0 && s.at <= t; })) r.frozen = true;
    });
    pushes();
    rooms.forEach(draw);
    bar();
    strips.push();
    covering(t);
    if (settling(t) || rooms.some(function (r) { return r.layered; })) busy = true;
    if (jump) {
      busy = true;
      // A jump is over once its landing has played, every column is still and the scroll is at its stop, or has
      // stopped somewhere else (or, whatever is still moving, once its landing is well past: nothing may hold the
      // deck).
      var still = function (r) { return r.frozen || r.skipped || (!r.moving && !(r.drive && r.slabs.some(function (s) { return s.at > t; }))); };
      var there = Math.abs(y - stops[jump.b]) <= 1 || t - moved > 300;
      if (t - jump.landed > 2400 || (there && rooms.every(still))) { settle(); setAnchor(nearest(Y())); }
    }
    holdAll(y);
    lens.follow(lensable());
    // A key pressed on the way, taken once the step before it has arrived (Keys, below).
    if (pending != null) { busy = true; flush(); }
    if (busy && !raf) raf = requestAnimationFrame(tick);
  };
  var queue = function () {
    if (raf || !on) return;
    last = now();
    raf = requestAnimationFrame(tick);
  };

  // ------------------------------------------------------------ Jumps

  // A jump in one frame (a link, the browser's own jump to the address's screen, a key's step, focus moved to another
  // screen, a find): a step plays its columns by time; a jump of more than one is a leap.
  var instant = function (t, y0, y1, quick) {
    var a = anchor, b = nearest(y1);
    if (Math.abs(y0 - stops[a]) > 2) a = nearest(y0);
    sync(y1);
    if (b === a) return;
    if (jump) settle();
    if (Math.abs(b - a) === 1) {
      if (b > a) play(rooms[b - 1], 1, t, quick); else play(rooms[a - 1], 0, t, quick);
      return;
    }
    leap(t, a, b);
  };
  // A jump of more than one screen: the screen left is held where it was, the rooms between are left out, and the
  // landing plays at once. The room it leaves, if it was still coming in, is finished at once under the landing going
  // on (which covers it in a moment: only the screen landed on moves), or, going back, turns back from where it is.
  var leap = function (t, a, b) {
    var fwd = b > a;
    var held = {};
    held[a] = true;
    rooms.forEach(function (r) {
      var k = r.k;
      if (k === a) {
        var arriving = r.drive && r.drive.to > 0;
        if (arriving && fwd) { r.slabs.forEach(function (s) { s.y = s.goal = s.ey = s.eg = 1; s.v = s.ev = 0; s.busy = false; s.at = 0; s.drop = null; }); arriving = false; }
        if (!arriving) { r.drive = null; r.frozen = true; }
        return;
      }
      if (fwd ? k > a && k < b : k < a && k > b) { r.skipped = true; r.drive = null; r.el.classList.add('is-skipped'); }
    });
    // (playing from this frame: every jump plays its landing at once. Keys and the wheel read it to know where the
    // deck is taking the reader.)
    jump = { a: a, b: b, fwd: fwd, held: held, playing: true, landed: t };
    // Held from this very frame: the browser runs the frame's callbacks (tick) after the scroll's events and before it
    // paints, so the jump is never seen without its hold. (Not here, in the scroll's own event: a scroll handler that
    // moves things is what browsers warn of as a scroll-linked effect.)
    queue();
    land(t, b);
  };
  // The landing, at b: forward, b's columns rise over what's held; back, what's held drops away from over b.
  var land = function (t, b) {
    if (jump.fwd) {
      rooms.forEach(function (r) {
        if (r.k === b) { r.slabs.forEach(function (s) { s.y = s.goal = 0; s.v = 0; s.busy = false; }); r.hit = false; r.landed = ''; play(r, 1, t); }
        else if (r.k > b) { r.skipped = false; r.el.classList.remove('is-skipped'); }
      });
    } else {
      rooms.forEach(function (r) {
        if (jump.held[r.k]) play(r, 0, t);
        else if (r.k <= b) { r.skipped = false; r.el.classList.remove('is-skipped'); }
      });
    }
  };
  // The scroll moving by itself (a finger, the browser's own glide and snap, the scrollbar): its columns follow it
  // (tick), and once it has got to the next stop (or back to the one before), the reader is on that screen, whatever
  // they do next (the screen kept for the tab, the lens, and a key's step or a jump taken from there).
  var follow = function (y) {
    if (jump) return;
    while (anchor < stops.length - 1 && y >= stops[anchor + 1] - 1 && !rooms[anchor].skipped && !rooms[anchor].frozen) setAnchor(anchor + 1, true);
    while (anchor > 0 && y <= stops[anchor - 1] + 1 && !rooms[anchor - 1].skipped && !rooms[anchor - 1].frozen) setAnchor(anchor - 1, true);
  };

  // ------------------------------------------------------------ Keys and the wheel

  // The keys that scroll a screen at a time, as the deck has them, the same in every browser, wherever the focus is
  // (but in a field, or on a control the key works). Left to the browser, each would go its own way: its snap an
  // animated scroll that the columns could only follow, softly, a second press made during it dropped (Chrome) or run
  // on past the next stop (Safari, Firefox), and End stopped a screen on (Safari). Here each is one instant move to a
  // stop, which the deck then plays out by time, as it does a link's: the columns set off in the frame after the
  // press. End and Home (and their Command-arrow forms on a Mac) go to the last screen or the first, from wherever the
  // reader is, at once: a jump, its landing played over the screen left. A step (Page Down or Up, the space bar, an
  // arrow) goes a screen on or back; pressed while the last step is still arriving, it hurries that one home and is
  // taken once it's there, a screen on from it: one press, one screen. Pressed the other way, it turns the step back
  // at once.
  var pending = null;   // where keys pressed on the way go once the step before is there: { k }
  var ownAt = -1e9;     // when the deck last moved the scroll itself
  // (Option with an arrow is a screen's step too: on a Mac, Safari and Chrome scroll a page for it.)
  var stepOf = function (e) {
    if (e.ctrlKey || e.metaKey) return 0;
    if (e.key === ' ' || e.key === 'Spacebar') return e.altKey ? 0 : e.shiftKey ? -1 : 1;
    if (e.shiftKey) return 0;
    return e.key === 'PageDown' || e.key === 'ArrowDown' ? 1 : e.key === 'PageUp' || e.key === 'ArrowUp' ? -1 : 0;
  };
  // A step played by time still on its way: a room still coming in, or one going whose columns are still over the
  // screen under it.
  var timed = function () {
    for (var i = 0; i < rooms.length; i++) {
      var r = rooms[i], d = r.drive;
      if (!d || r.skipped || r.frozen) continue;
      if (d.to > 0 ? !r.here : r.slabs.some(function (s) { return s.y > 1 - UP; })) return { k: d.to > 0 ? r.k : r.k - 1, dir: d.to > 0 ? 1 : -1 };
    }
    return null;
  };
  // The scroll is on its way: between two stops, or a jump or a step playing, or at its stop while the room it has
  // come to is still coming in, or the one it has left is still going (its columns still on their way, for at most
  // a second and a half after the scroll last moved). A step is over once its room has arrived.
  var inFlight = function () {
    var y = Y(), k = nearest(y), t = now();
    if (jump || Math.abs(y - stops[k]) > 1 || timed()) return true;
    if (t - moved > 1500) return false;
    var coming = k > 0 ? rooms[k - 1] : null, going = rooms[k];
    return !!(coming && !coming.skipped && !coming.here && coming.moving) || !!(going && !going.skipped && going.here);
  };
  // Where it's going, and which way: the stop a jump or a timed step lands on (own: the deck's, not the browser's),
  // or the next stop the way the scroll moves.
  var heading = function () {
    var t = now(), y = Y(), q = timed(), k;
    if (jump && jump.playing) return { k: jump.b, dir: jump.fwd ? 1 : -1, own: true };
    if (q) return { k: q.k, dir: q.dir, own: true };
    var going = y - scrollAt(t - 120);
    if (going > 0.5) { k = 0; while (k < stops.length - 1 && stops[k] < y - 1) k++; return { k: k, dir: 1 }; }
    if (going < -0.5) { k = stops.length - 1; while (k > 0 && stops[k] > y + 1) k--; return { k: k, dir: -1 }; }
    return { k: nearest(y), dir: 0 };
  };
  var within = function (k) { return Math.max(0, Math.min(stops.length - 1, k)); };
  // The screen the reader is on, or on their way to.
  var where = function () {
    if (!on) return place;
    var y = Y(), k = nearest(y);
    if (jump && jump.playing) return jump.b;
    return Math.abs(y - stops[k]) <= 1.5 ? k : anchor;
  };
  // One instant move to screen k, played as the browser's own scroll there would be (a step's columns, or a jump's
  // landing), from this very frame.
  var jumpTo = function (k, quick) {
    var y0 = Y(), k0 = nearest(y0);
    if (!on || k < 0 || k >= stops.length) return;
    // (A gesture the browser scrolls itself keeps the page on the screen the deck takes the reader to: keep, below.)
    if (wheel.pin >= 0) wheel.pin = k;
    if (Math.abs(y0 - stops[k]) <= 1) return;
    // Leaving a stop the scroll has only just come to, and whose room is there: it's where the move is from.
    if (k0 !== anchor && Math.abs(y0 - stops[k0]) <= 1 && (k0 === 0 || rooms[k0 - 1].here)) setAnchor(k0, true);
    to(stops[k]);
    lastY = Y();
    moved = ownAt = now();
    record(moved, lastY);
    instant(moved, y0, lastY, quick);
    // Held where they were in this very frame, which may already be on its way to the screen (a key's step taken
    // from the frame's own callbacks).
    holdAll(lastY);
    queue();
  };
  // A step, a screen on (1) or back (-1): a key's, or a gesture of the wheel's (once: a gesture queues one step at
  // most, wherever the last one is going).
  var step = function (dir, again, once) {
    if (!on) return;
    if (!inFlight()) { pending = null; jumpTo(within(where() + dir)); return; }
    var h = heading();
    // The other way: the step turned back at once (or the scroll the browser was snapping, sent back where it came
    // from).
    if (h.dir && h.dir !== dir) { pending = null; jumpTo(within(h.k - h.dir)); return; }
    // Each press a screen on from the last one's, but a key held down (repeating) only ever one past where the
    // scroll is going.
    var from = pending && !again && !once ? pending.k : h.k;
    pending = { k: within(from + dir), dir: dir };
    hurry(now());
    queue();
  };
  // The steps pressed on the way, once the one before has arrived: a screen at a time, each played in turn, its
  // stagger a little closer, as it comes on the heels of the last.
  var flush = function () {
    if (pending == null || !on || touching || pressing || inFlight()) return;
    var k0 = nearest(Y()), k = pending.k;
    // (Queued one way, and the reader since taken there or past it, by a jump or the browser's own scroll: done.)
    if ((k - k0) * pending.dir <= 0) { pending = null; return; }
    if (Math.abs(k - k0) > 1) k = k0 + (k > k0 ? 1 : -1);
    else pending = null;
    jumpTo(k, true);
  };
  document.addEventListener('keydown', function (e) {
    if (arrival.on() && !/^(Shift|Control|Alt|Meta|CapsLock|Fn)$/.test(e.key)) arrival.finish();
    if (!on || e.defaultPrevented) return;
    var el = e.target;
    if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
    var plain = !e.altKey && !e.ctrlKey && !e.shiftKey;
    var end = plain && (e.key === 'End' || (e.metaKey && e.key === 'ArrowDown'));
    var home = plain && (e.key === 'Home' || (e.metaKey && e.key === 'ArrowUp'));
    var dir = end || home ? 0 : stepOf(e);
    if (!end && !home && !dir) return;
    // The space bar presses the button the focus is on (on a link it scrolls, as it does anywhere).
    if (dir && (e.key === ' ' || e.key === 'Spacebar') && el && el.closest && el.closest('button, summary, [role="button"], [role="checkbox"], [role="switch"], [role="radio"], [role="tab"], [role="menuitem"], [role="option"]')) return;
    e.preventDefault();
    if (end || home) { pending = null; hurry(now()); jumpTo(end ? stops.length - 1 : 0); return; }
    step(dir, e.repeat, false);
  });

  // The wheel, and a trackpad, move the deck as the keys do, through the same steps: each gesture a step, a screen on
  // or back, taken at once and played by time; one during a step is taken once it's there, one at most (step). Left to
  // the browser, Safari's snap after a notch or a swipe takes the best part of a second, with the columns crawling
  // behind it, and runs a screen too far after a notch, a pause and a notch; Firefox's runs a screen to every notch.
  // A gesture is a notch, or a run of notches, or a swipe and the whole of the glide that follows it, until the input
  // stops (GAP ms with nothing, or longer while a free-spinning wheel slows, its notches further and further apart),
  // or stops for a moment and picks up again (another swipe: the fingers came down on the pad and set off again), or
  // goes the other way: more than REV px of it, so the fingers rolling back a pixel or two as they lift don't end the
  // swipe and start its glide as another. A busy page gets its events late, in a burst, or several made into one, so
  // the deck reads the input's own time (each event's timeStamp), how far each event went, and how fast, and never
  // takes a pause the page had for one the input had.
  // Which way it goes is decided once, by its first event, as the browsers themselves decide whether a gesture is the
  // page's: one begun sideways (the browser's back and forward) is left to the browser to its end, its drift up or
  // down too (resnap puts that back); one begun up or down is the deck's to its end, its sideways jitter too, so no
  // part of it ever scrolls the page on its own. A pinch (zoom), and a wheel over something that scrolls by itself,
  // are left to the browser.
  var GAP = 160, REV = 12;
  var wheel = { at: -1e9, ts: -1e9, iv: 0, ivMin: 1e9, gap: 0, dir: 0, sum: 0, took: false, back: 0, rate: 0, per: 0, peak: 0, peakAt: 0, rises: 0, low: 0, lowAt: 0, lowPeak: 0, lowPeakAt: 0, lowHoled: false, holeAt: -1e9, holeMag: 0, flip: 0, acc: 0, n: 0, rts: 0, bunched: false, own: false, side: false, free: false, pin: -1 };
  var scrolls = function (el, dy) {
    for (; el && el !== deck && el.nodeType === 1; el = el.parentElement) {
      var o = getComputedStyle(el).overflowY;
      if ((o === 'auto' || o === 'scroll') && el.scrollHeight > el.clientHeight + 1 && (dy > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 1 : el.scrollTop > 0)) return true;
    }
    return false;
  };
  var wheeled = function (e) {
    if (!on || e.ctrlKey || e.defaultPrevented) return;
    var unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
    var dy = e.deltaY * unit, dx = e.deltaX * unit;
    if (!dy && !dx) return;
    var t = now(), w = wheel, dir = dy > 0 ? 1 : dy < 0 ? -1 : w.dir, mag = Math.abs(dy);
    // When it was made: the event's own time, where that's this page's clock and moving on (else now).
    var ts = e.timeStamp;
    if (!(ts > t - 3000 && ts < t + 50) || (ts <= w.ts && t - w.at > GAP)) ts = t;
    if (ts < w.ts) ts = w.ts;
    // A pause, and a new gesture: nothing for GAP ms (or, while a wheel spun fast slows down, its notches once under
    // 40ms apart and since half as far apart again or more, for twice its own pace, if that's longer), by both clocks
    // (one event the page got late shows a gap only in when it came, several made into one only in when they were
    // made), and this event not carrying about what the gesture would have gone meanwhile at its last speed, two of
    // its events' worth or more (several made into one; much more than that is the input speeding up: a new gesture;
    // one notch, after a run of slow ones, a new turn of the wheel). A gesture the browser scrolls itself (free, below)
    // has no pause: a new one would be the page's again.
    var quiet = Math.min(t - w.at, ts - w.ts), would = w.rate * quiet;
    var spin = w.ivMin < 40 && w.iv > 1.5 * w.ivMin;
    var fresh = quiet > Math.max(GAP, spin ? Math.min(4 * GAP, 2 * w.iv) : 0) && !(w.rate > 0.04 && mag >= 2 * w.per && mag >= 0.6 * would && mag <= 2 * would) && !(w.free && !e.cancelable);
    // Or the glide cut short: a hole in the input of 30ms or more (by its own time), and after it an event of under
    // 0.3 of one of the glide's (and of what the glide would have gone in the hole), while the glide was still going
    // (its events 4px or more): the fingers came down on the pad, stopping it, and set off again, slowly at first. (A
    // frame the page got late, or several made into one, carries what the glide went meanwhile, and the glide that
    // sets off as the fingers lift goes on at their speed.)
    var gap = ts - w.ts, gap0 = w.gap;
    if (!fresh && w.took && dy && dir === w.dir && gap >= 30 && w.per >= 4 && mag < 0.3 * w.per && mag < 0.3 * w.rate * gap) fresh = true;
    // Any hole in the input, by which a new swipe is told below: 25ms or more, twice its pace, and after it an event
    // carrying clearly less or more than the input would have gone meanwhile (not a frame or two late, or merged).
    if (!fresh && dy && dir === w.dir && gap >= 25 && gap >= 2 * w.iv && (mag < 0.8 * w.rate * gap || mag > 1.25 * w.rate * gap)) { w.holeAt = ts; w.holeMag = mag; }
    w.gap = gap;
    // The other way: a new gesture at once if this one hasn't taken its step, else once it has gone REV px. And back
    // the way of the one before, this one gone too little the other way for a step of its own: that one still (the
    // fingers rolled back further than REV as they lifted, and the glide went on the swipe's way).
    var back = !fresh && !w.side && dy !== 0 && dir !== w.dir;
    if (back) { w.back += mag; fresh = !w.took || w.back >= REV; }
    else if (dy) w.back = 0;
    w.iv = fresh ? 0 : ts - w.ts;
    w.ivMin = fresh ? 1e9 : Math.min(w.ivMin, w.iv);
    w.at = t;
    w.ts = ts;
    if (fresh) {
      w.side = Math.abs(dx) > Math.abs(dy);
      // A gesture begun over something that scrolls by itself is that thing's, to its end.
      w.own = !w.side && scrolls(e.target, dy);
    }
    if (w.side || w.own) { if (dy) w.dir = dir; return; }
    e.preventDefault();
    if (!dy || (back && !fresh)) return;
    // How fast it goes (px a ms), by the input's own time, over 32ms of it or more at a time, so events that came late
    // or merged read as the speed they were made at. A swipe that comes while the last one's glide is still dying
    // away: the input picks up again, twice running, each time a quarter faster than the last (and faster than 4px a
    // frame), from as slow as the glide had come down to (under 0.7 of its fastest before, and 100ms or more after it:
    // the fingers lifting, then the glide setting off, is no new swipe); or at once to three times as fast (a quick
    // swipe, its rise all in one stretch), from under 0.3 of the glide's fastest, a fifth of a second or more after it,
    // or sooner if what came after the hole set off with a small first step (under 0.4 of a frame's worth at the speed
    // that followed: a glide sets off at its speed at once). All of this only after a hole in the input on the way
    // down, as the fingers coming down on the pad make: a swipe that slows and speeds up again with them on it has
    // none, and is a new one only from all but a standstill (under 0.1 of its fastest). Where events came stamped all
    // at once (under 4ms apart, closer than any device sends them: a browser that times them as the page gets them),
    // their speed can't be read, and each rise must also be one of how far an event goes: a quarter further (and more
    // than 4px), or three times.
    var rose = false;
    if (!fresh) {
      w.acc += mag;
      w.n++;
      if (w.iv < 4) w.bunched = true;
      if (ts - w.rts >= 32) {
        var rate = w.acc / (ts - w.rts), per = w.acc / w.n, holed = w.holeAt > w.peakAt;
        w.rises = rate > w.rate * 1.25 && rate > 0.25 && (!w.bunched || (per > w.per * 1.25 && per > 4)) ? w.rises + 1 : 0;
        if (w.rises === 1) { w.low = w.rate; w.lowAt = w.rts; w.lowPeak = w.peak; w.lowPeakAt = w.peakAt; w.lowHoled = holed; }
        rose = fresh = w.took && ((w.rises >= 2 && w.low < w.lowPeak * (w.lowHoled || holed ? 0.7 : 0.1) && w.lowAt - w.lowPeakAt >= 100) || (rate > 3 * w.rate && rate > 0.5 && (!w.bunched || per > 3 * w.per) && w.rate < w.peak * (holed ? 0.3 : 0.1) && (w.rts - w.peakAt >= 200 || (holed && w.holeMag < 0.4 * rate * w.ivMin))));
        w.rate = rate;
        w.per = per;
        if (rate > w.peak) { w.peak = rate; w.peakAt = ts; }
        w.acc = w.n = 0;
        w.bunched = false;
        w.rts = ts;
      }
    }
    if (fresh) {
      var resumed = back && !w.took && w.flip === dir;
      w.flip = back && w.took ? w.dir : 0;
      w.sum = back ? w.back - mag : 0;
      w.dir = dir; w.took = resumed; w.back = 0; w.rises = 0; w.free = false; w.pin = -1; w.holeAt = -1e9;
      w.peakAt = ts;
      if (rose) w.peak = w.rate;
      else { w.rate = w.per = w.peak = w.acc = w.n = 0; w.bunched = false; w.rts = ts; }
    }
    w.sum += mag;
    // A gesture the browser has let go on its own: Safari waits only so long for a page to answer a gesture's first
    // event, and one begun while the page is busy that long it scrolls itself, none of it to be cancelled. It's still
    // one step, as any gesture is: from the screen the deck is on, or taking the reader to, by its own moves (the
    // browser's are undone), at once, or once the step before is there; and the page is kept on its screen while it
    // lasts (keep). Safari lets a gesture go only as it begins, so one taken for the last one's (begun after a hole in
    // the input) is a new one, with a step of its own.
    if (e.cancelable === false && !w.free) {
      if (w.took && !fresh && gap0 >= 25) w.took = false;
      w.free = true;
      var q = timed();
      w.pin = jump && jump.playing ? jump.b : q ? q.k : anchor;
      keep();
      if (arrival.on()) arrival.finish();
      if (!w.took) { w.took = true; step(w.dir, false, true); }
      return;
    }
    if (!w.took && w.sum >= Math.max(24, Math.min(60, (stops[1] || window.innerHeight) * 0.04))) {
      w.took = true;
      if (arrival.on()) arrival.finish();
      step(dir, false, true);
    }
  };
  // The page kept on its screen (the deck's: the one it's on, or has since taken the reader to) while a gesture the
  // browser scrolls itself lasts, or until the reader does anything else (a key, a press, a touch): its every move
  // undone at once, before anything reads it (every screen being held to the viewport, a move of less than a screen
  // shows nothing). True while it's kept.
  var keep = function () {
    var w = wheel;
    if (w.pin < 0) return false;
    if (!on || now() - w.at > GAP || w.pin >= stops.length) { w.pin = -1; return false; }
    if (Math.abs(Y() - stops[w.pin]) > 1) { to(stops[w.pin]); lastY = Y(); record(now(), lastY); }
    return true;
  };
  // Safari on a Mac (and any Mac app built on its engine) doesn't snap the page while the deck is drawn (.g-own-snap,
  // grid.css): the deck puts it on its stops itself (resnap, below, for a scroll it didn't make). A listener that
  // may cancel the wheel has Safari 27 run its snap for the end of every trackpad gesture (two fingers resting on the
  // pad, even) on the page's main thread, and one that ends where the page already rests, as each does on a stop,
  // leaves an empty snap animation behind there, which the window's next resize reads: the page crashes. So the wheel
  // is listened to only while the deck is drawn (take), and while it is, Safari has nothing to snap; stacked, the page
  // snaps as everywhere else, the browser's own way, with nothing waiting on the page.
  // Firefox on a desktop (no touch) doesn't snap the page while the deck is drawn either: snapping, it goes a whole
  // screen for every event of the wheel's it's left (a pixel of a sideways swipe's drift runs it on, a screen to each
  // event, to the end of the page), and the deck keeps it on its stops itself as it does Safari's.
  var ua = navigator.userAgent;
  var ownSnap = !(navigator.maxTouchPoints > 0) && ((/AppleWebKit/.test(ua) && !/Chrome|Chromium|CriOS|Edg|OPR|Firefox|FxiOS/.test(ua)) || /Firefox\//.test(ua));
  var take = function (yes) {
    root.classList.toggle('g-own-snap', yes && ownSnap);
    window[yes ? 'addEventListener' : 'removeEventListener']('wheel', wheeled, { passive: false });
  };

  // ------------------------------------------------------------ At rest

  // What the screen the reader is on is shown by: the header's ink (the copies draw it; the real one's focus ring wants
  // it), the running index, the header's Contact, the browser's bar.
  var runnerLinks = list(document.querySelectorAll('.g-runner--real .g-runner__link'));
  // The header's own links to this page's screens (Contact): current on the screen they lead to.
  var navLinks = list(document.querySelectorAll('body > .site-head .site-nav a[href^="#"]')).map(function (a) {
    return { a: a, to: document.getElementById(a.getAttribute('href').slice(1)) };
  }).filter(function (l) { return l.to; });
  var practice = document.querySelector('.g-room [data-practice]');
  // Only the real header, the running index and the footer use the ink: set there, not on the page, whose every
  // element would otherwise be restyled.
  var inked = list(document.querySelectorAll('body > .site-head, .g-runner--real, body > .site-foot'));
  var ink = '';
  // The browser's own bar (Safari's compact tabs, a phone's status bar) takes the ground of the screen the reader is
  // on: the theme colour head.html sets for the page's canvas, rewritten screen by screen, and the page's own
  // background, which Safari looks at where it doesn't use the theme colour. Safari 26 and later tint their bar from
  // a strip along the top instead (.g-chrome, grid.css), and stop following it for good at the reader's first click,
  // scroll key, wheel or scroll: a room's colour there would stay on the bar over every screen after. So the strip
  // (--g-chrome) only ever has the opening's colours: the void's while the screen the page opens on arrives, then the
  // canvas. On a phone (iOS, every browser there being Safari's engine) the edges over and under the page take their
  // colours from a strip along the top and one along the foot, and read a strip again only when it's a new one (a
  // change of its colour alone is never seen), there at every scroll: there both strips have the ground of the screen
  // under the header's band, new strips for each screen as it comes (redo), so the edges are the screen's. On an iPad
  // Safari's bar is the Mac's, and stops following at the reader's first scroll as the Mac's does: there the strip
  // keeps the opening's colours, as on a Mac, each a new strip, as on a phone (the only change Safari sees there). All
  // of it changes as the header's ink does, with the columns (bar, atTop). Put back when the deck is off (the theme
  // colours as head.html set them, which index.html kept before giving them the void's).
  var themes = list(document.querySelectorAll('meta[name="theme-color"]')).map(function (m) { return { m: m, was: m.getAttribute('data-g-was') || m.getAttribute('content') }; });
  // --g-chrome is set on the strip itself, the one element that reads it: set on the page's root, it would restyle
  // every element of the page (a custom property is inherited), a frame's work on a slow phone.
  var strip = document.querySelector('.g-chrome');
  var edges = navigator.maxTouchPoints > 0 && /AppleWebKit/.test(ua) && !/Android|Chrome\//.test(ua);
  var phone = edges && /iPhone|iPod/.test(ua);   // (an iPad's Safari says it's a Mac's)
  var sill = null;
  if (phone) { sill = strip.cloneNode(false); sill.classList.add('g-chrome--foot'); strip.parentNode.insertBefore(sill, strip.nextSibling); }
  var redo = function (el, c) { var n = el.cloneNode(false); n.style.setProperty('--g-chrome', c); el.parentNode.replaceChild(n, el); return n; };
  var tint = '', band = '';
  // The colours it takes, read once (and again when the scheme changes), so that a change of the bar's in the middle of
  // a step reads nothing of the page's styles: the canvas, the void, each room's ground.
  var palette = null;
  var colours = function () {
    if (!palette) {
      var hs = getComputedStyle(hero);
      palette = { canvas: hs.backgroundColor, dark: hs.getPropertyValue('--void').trim(), grounds: rooms.map(function (r) { return getComputedStyle(r.el).getPropertyValue('--ground').trim(); }) };
    }
    return palette;
  };
  // The void's while it's at the top of the screen (the opening, or a room arriving over it), else screen k's.
  var chrome = function (k) {
    var c = colours(), dark = arrival.dark(), canvas = c.canvas;
    var g = dark ? c.dark : k > 0 ? c.grounds[k - 1] : canvas;
    var b = dark || phone ? g : canvas;
    if (g && g !== tint) {
      tint = g;
      themes.forEach(function (t) { t.m.setAttribute('content', g); });
      root.style.backgroundColor = g;
    }
    if (b && b !== band) {
      band = b;
      if (edges) { strip = redo(strip, b); if (sill) sill = redo(sill, b); }
      else strip.style.setProperty('--g-chrome', b);
    }
  };
  var unchrome = function () {
    tint = band = '';
    themes.forEach(function (t) { t.m.setAttribute('content', t.was); });
    root.style.removeProperty('background-color');
    strip.style.removeProperty('--g-chrome');
    if (sill) sill.style.removeProperty('--g-chrome');
  };
  var scheme = window.matchMedia('(prefers-color-scheme: dark)');
  var onScheme = function () { palette = null; barAt = ''; if (on) chrome(atTop()); };
  // The screen under the header's band, whose ground the bar takes while the screens move: the last room, not left
  // out, with most of its columns over the band (draw: as its header's ink goes, so the bar changes in the frame the
  // header does, both ways), or, while a room arrives over the void, that room (its colour the void's until then);
  // or the first screen.
  var atTop = function () {
    var landing = arrival.landing();
    for (var i = rooms.length - 1; i >= 0; i--) {
      var r = rooms[i];
      if (r.k === landing) return r.k;
      if (!r.skipped && r.n && 2 * (r.capped || 0) >= r.n) return r.k;
    }
    return 0;
  };
  var barAt = '';
  var bar = function () {
    var k = atTop(), key = k + (arrival.dark() ? 'v' : '');
    if (key !== barAt) { barAt = key; chrome(k); }
  };
  scheme.addEventListener('change', onScheme);
  // The reader is on screen k. Quietly, while the deck moves (the scroll has got to k's stop, or the deck has moved
  // there): only what the deck itself goes by. At rest, all of it: the header's ink, the bar's color, the running
  // index, the classes on the page (each of which restyles all of it, which is never done while anything moves).
  var setAnchor = function (k, quiet) {
    var moved = k !== anchor;
    if (moved) pointer.off();
    anchor = k;
    var key = k === 0 ? '' : rooms[k - 1].key;
    if (moved) {
      // Lark's Practice, which pauses itself only once it's out of sight (and a screen held to the viewport never
      // is), is paused once Lark isn't the screen.
      if (practice && practice.classList.contains('is-on')) {
        var room = practice.closest('[data-g-room]');
        if (!room || room.id !== key) practice.click();
      }
      // Kept for this tab, so that a reload, or a step back to the page, puts the reader back on this screen, whatever
      // the address says (start, below), and doesn't open on the void (index.html reads it).
      try { sessionStorage.setItem('g-screen', String(k)); } catch (e) { /* no storage: nothing kept */ }
    }
    lens.follow(lensable());
    if (quiet) return;
    var el = k === 0 ? hero : rooms[k - 1].screen;
    var c = getComputedStyle(el).color;
    if (c !== ink) { ink = c; inked.forEach(function (e) { e.style.setProperty('--g-ink', c); }); }
    // (The bar's the screen's under the header's band: after a key's step, the scroll is at its stop well before the
    // room's columns have passed the header, and the bar changes with them, bar.)
    chrome(atTop());
    root.classList.toggle('g-at-hero', k === 0);
    root.classList.toggle('g-at-last', k === rooms.length);   // the Studio and Contact: no running index there
    runnerLinks.forEach(function (a) {
      var is = a.getAttribute('data-g-key') === key;
      if (is !== a.hasAttribute('aria-current')) { if (is) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); }
    });
    navLinks.forEach(function (l) {
      var is = k > 0 && screenOf(l.to) === k;
      if (is !== l.a.hasAttribute('aria-current')) { if (is) l.a.setAttribute('aria-current', 'location'); else l.a.removeAttribute('aria-current'); }
    });
  };
  // The lens is shown while the poster is the screen and up, with nothing over it.
  var lensable = function () {
    return anchor === 0 && !jump && arrival.up() && !(rooms[0] && rooms[0].slabs.some(function (s) { return s.y > 0.001; }));
  };
  var rest = 0;
  var rested = function () {
    clearTimeout(rest);
    if (!on || pressing) return;
    // Just after a resize the layout may still be settling: look again once it has.
    if (now() - resizedAt < 350) { rest = setTimeout(rested, 370 - (now() - resizedAt)); return; }
    var y = Y(), k = nearest(y);
    // Between two stops: where the browser snaps the page, its snap is still to come; where the deck does (ownSnap),
    // if the scroll is still there a while later, the deck finishes the step (resnap).
    if (Math.abs(y - stops[k]) > 1.5) { rest = setTimeout(resnap, RESNAP); return; }
    setAnchor(k);
    flush();
  };
  // Which way the scroll last moved (1 down, -1 up, 0 if it hasn't in the last moment): by where it was last
  // somewhere else, so a step turned back mid-way counts as going back.
  var lastWay = function (y) {
    for (var i = hist.length - 1; i >= 0; i--) { var d = y - hist[i][1]; if (Math.abs(d) > 1) return d > 0 ? 1 : -1; }
    return 0;
  };
  // Where the deck snaps the page itself (ownSnap: Safari on a Mac, Firefox on a desktop), a scroll at rest between two
  // stops for a while (RESNAP ms: the scrollbar let go there, say) is finished, to the next stop the way it was last
  // going: the deck plays the rest of the step. But a small move from the stop the reader is on, with no step under
  // way (the drift of a sideways swipe, which the browser has: a quarter of a screen or less), is put back there.
  var RESNAP = 450;
  var resnap = function () {
    if (!on || !ownSnap || pressing || now() - moved < RESNAP - 20) return;
    var y = Y(), k = nearest(y), going = lastWay(y), H = stops[1];
    if (!jump && !timed() && Math.abs(y - stops[anchor]) <= H / 4) k = anchor;
    else if (going > 0) { k = 0; while (k < stops.length - 1 && stops[k] < y) k++; }
    else if (going < 0) { k = stops.length - 1; while (k > 0 && stops[k] > y) k--; }
    if (Math.abs(y - stops[k]) > 1.5) jumpTo(k);
  };

  // Stacked, the page scrolls as any other, and the screen the reader is on is kept as it comes to rest, so that when
  // the page is laid out anew (a phone turned, the window resized into the deck) they're put back on it, not on the
  // one the new layout happens to have under the old scroll (which, in a browser that doesn't anchor the scroll, is the
  // one before).
  var stackedRest = 0;
  // A move of the scroll the deck didn't make (its own are already counted in lastY), seen in its scroll event or, if
  // it was made by a script in this very frame, in the frame first. One of most of a screen at once, onto a stop, is a
  // jump (a link, a find, the browser putting the page back), played at once. Any other is the scroll moving, and the
  // columns follow it, however fast it goes, and however seldom the page is told where it is (Safari on an iPhone or
  // an iPad tells it only every tenth of a second or so while its bars come and go, so a flick can be seen to go most
  // of a screen at once, but never onto its stop: its snap slows to it).
  var seen = function (t, y0, y) {
    if (jump || t - resizedAt <= 350) return;
    var H = stops[1];
    if (Math.abs(y - y0) >= 0.6 * H && Math.abs(y - stops[nearest(y)]) <= 1) instant(t, y0, y);
  };
  // Safari on an iPhone, as the page finishes loading with the deck drawn, puts the scroll back at the top, and moves it
  // to the screen the address names only a few frames later (iOS 27: on the room's stop once the document is read, at
  // the top by the load event, on the stop again 60ms after; the stacked page it leaves alone). In between, the first
  // screen would be shown, and a room the page lands on would take that move for the reader's: its arrival would end,
  // and Safari's move back to the room would play as a jump over the first screen. So until a moment after the load
  // event (OPENING ms), and until the reader does anything, a page that opened on another screen is put straight back
  // on it if it's found at the very top. (So is one brought back from the back/forward cache, pageshow, below; one
  // opened on a passage that Safari has shown, found where Safari put it again, aside, shown; and one opened on a
  // passage the browser had gone to before this ran, found anywhere else, held, start: Firefox goes to it again, from
  // where the deck has put it.)
  var opened = 0, openUntil = Infinity, OPENING = 1000, aside = -1, held = false;
  var reopen = function () {
    var y = Y();
    if (!opened || now() > openUntil || Math.abs(y - stops[opened]) <= 1 || (y > 1 && Math.abs(y - aside) > 1 && !held)) return false;
    restore(opened);
    return true;
  };
  ['pointerdown', 'touchstart', 'keydown', 'wheel'].forEach(function (type) { window.addEventListener(type, function () { openUntil = 0; if (type !== 'wheel') wheel.pin = -1; }, { passive: true, capture: true }); });
  window.addEventListener('load', function () { openUntil = now() + OPENING; reopen(); });
  var onScroll = function () {
    if (reopen()) return;
    // A phone turned: Safari moves the scroll for the new layout before it says the window has been resized (its width
    // has changed already), a move that isn't the reader's, and in the old layout's terms often a fast one back to the
    // top. Left to the deck, it would take the reader off their screen. Putting them back is the resize's (below).
    if (root.clientWidth !== wide) { turning = resizedAt = now(); lastY = Y(); return; }
    if (shown(Y())) return;
    var t = now(), y = Y();
    var y0 = lastY;
    lastY = y;
    if (!on) {
      clearTimeout(stackedRest);
      stackedRest = setTimeout(function () { if (!on && now() - resizedAt > 500) place = current(); }, 120);
      return;
    }
    if (arrival.on() && arrival.left(y)) arrival.finish();
    if (y !== y0) arrival.poke();
    clearTimeout(rest);
    rest = setTimeout(rested, 160);
    if (keep()) { queue(); return; }
    record(t, y);
    seen(t, y0, y);
    queue();
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  if ('onscrollend' in window) window.addEventListener('scrollend', function () { if (on) { clearTimeout(rest); rest = setTimeout(rested, 30); } });
  // A finger on the screen (a key's step waits for it to lift, and what it selects is no find), or a button held (on
  // the scrollbar, say: the reader still scrolling, rested and resnap wait for it).
  ['touchstart', 'touchend', 'touchcancel'].forEach(function (type) { window.addEventListener(type, function (e) { touching = e.touches.length; }, { passive: true }); });
  window.addEventListener('pointerdown', function (e) { if (e.pointerType === 'mouse') pressing = true; }, { passive: true });
  window.addEventListener('pointerup', function () { if (pressing) { pressing = false; clearTimeout(rest); rest = setTimeout(rested, 160); } }, { passive: true });

  // ------------------------------------------------------------ Focus and find

  // The screen something is on (0 the first), or -1.
  var screenOf = function (node) {
    var el = node && (node.nodeType === 1 ? node : node.parentElement);
    var s = el && el.closest('[data-g-screen]');
    return s ? parseInt(s.getAttribute('data-g-screen'), 10) : -1;
  };
  // The keyboard's focus moving into a screen that isn't showing (Tab from one room into the next), or into one
  // still on its way in: there, and the screen simply there, at once, its columns all landed and its dots out, so
  // what has the focus is never under a column still coming in.
  document.addEventListener('focusin', function (event) {
    if (arrival.on()) arrival.finish();
    if (!on) return;
    var k = screenOf(event.target);
    if (k < 0) return;
    if (!event.target.matches(':focus-visible')) return;
    var y = Y(), r = k > 0 ? rooms[k - 1] : null;
    if (!jump && !timed() && Math.abs(y - stops[k]) <= 1 && (!r || r.done)) return;
    pending = null;
    to(stops[k]);
    lastY = Y();
    settle();
    setAnchor(nearest(lastY));
  });
  // A find in the page, which selects what it finds (Firefox, Safari, window.find): to the screen it's on, playing
  // that screen's arrival, once. The browser has often moved the scroll towards it already, but only as far as the
  // screen before (every screen being held to the viewport, the one before has it in view): the move is taken from
  // where the reader was before that, at once (the selection changes before the scroll's event, and before the
  // frame), so nothing of the browser's move is ever drawn.
  var findTo = function (k) {
    var y0 = lastY;
    pending = null;
    to(stops[k]);
    var y1 = Y();
    lastY = y1;
    moved = now();
    record(moved, y1);
    instant(moved, y0, y1);
    holdAll(y1);
    queue();
  };
  document.addEventListener('selectionchange', function () {
    if (!on || pressing || touching) return;
    var sel = window.getSelection();
    if (sel.isCollapsed || !sel.anchorNode || String(sel).length > 200) return;
    var k = screenOf(sel.anchorNode);
    if (k >= 0 && k !== where()) findTo(k);
  });
  // A link to a passage (a text fragment, #:~:text=, as search results and "Copy link to highlight" make): the screen
  // the passage is on, among the words a reader can read (not the copies the screens draw of the header, the footer
  // and the big type, which are aria-hidden), or -1. The browser's own move there would stop a screen short, as a
  // find's does.
  var passage = function () {
    var n = performance.getEntriesByType('navigation')[0];
    var m = n && /:~:(?:.*&)?text=([^&]+)/.exec(n.name || '');
    if (!m) return -1;
    var parts = m[1].split(',').filter(function (p) { return !/-$/.test(p) && !/^-/.test(p); });
    var norm = function (t) { return t.replace(/\s+/g, ' ').trim().toLowerCase(); };
    var want = '';
    try { want = norm(decodeURIComponent(parts[0] || '')); } catch (e) { return -1; }
    if (!want) return -1;
    for (var k = 0; k < screens.length; k++) {
      var words = [], walk = document.createTreeWalker(screens[k], NodeFilter.SHOW_TEXT);
      for (var node = walk.nextNode(); node; node = walk.nextNode()) {
        if (!node.parentElement.closest('[aria-hidden="true"], [inert]')) words.push(node.nodeValue);
      }
      if (norm(words.join('')).indexOf(want) >= 0) return k;
    }
    return -1;
  };
  // Safari keeps a link's passage to itself: it's gone from the address and from the navigation's name before this
  // runs, so passage() finds nothing, and Safari moves the scroll to it only as the page loads, while the void is up.
  // So a move the deck didn't make, before the reader has done anything, on a page that a plain link (not a reload,
  // nor a step back) opened on the first screen, is Safari showing a passage, and where it went tells which screen the
  // passage is on. Safari centres it in the window as the page is laid out at the top, where each room after Michi's
  // is just in, under the screen before, at the top of the window. On an iPhone or an iPad the page snaps, and Safari's
  // move with it: to the stop before the passage's room. On a Mac nothing snaps (.g-own-snap): Safari centres the
  // passage, and centres it again at every layout after, until anything else moves the scroll, each time a step
  // further where its screen is held to the window; there it's the screen with a line of words (or a run of a few)
  // that Safari's centring, once or the fewest times over, brings the scroll to. (Where it went alone doesn't tell the
  // first screen from Michi's, both held to the top of the window there.) The page then opens on that screen, its
  // arrival played over the void, as a link to it would; or, the first screen's columns already under way, it lands
  // over the first screen, as from an index link. (A passage in Michi's room already in the window at the top is never
  // moved to: the first screen plays, as for any plain link.)
  var plainly = false;   // the page was opened by a plain link (start)
  var found = function (y0, y) {
    if ((getComputedStyle(root).scrollSnapType || '').indexOf('mandatory') >= 0) {
      var j = nearest(y);
      return j > 0 && Math.abs(y - stops[j]) <= 1.5 ? Math.min(j + 1, stops.length - 1) : -1;
    }
    var vh = window.innerHeight, most = Math.max(0, root.scrollHeight - vh), best = -1, soonest = Infinity, off = Infinity;
    screens.forEach(function (el, k) {
      var top = natTop(k, y), walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), r = document.createRange();
      for (var node = walk.nextNode(); node; node = walk.nextNode()) {
        var p = node.parentElement;
        if (!node.nodeValue.trim() || p.closest('[aria-hidden="true"], [inert], .visually-hidden') || getComputedStyle(p).visibility === 'hidden') continue;
        r.selectNodeContents(node);
        var lines = list(r.getClientRects()).filter(function (b) { return b.height > 0; });
        for (var i = 0; i < lines.length; i++) for (var j = i; j < lines.length && j < i + 4; j++) {
          var mid = (lines[i].top + lines[j].bottom) / 2 - top;   // its middle, from its screen's top
          // Centred once, or n times over (each within a pixel or two of Safari's own: so much leeway each time),
          // the fewest times that bring the scroll where it went.
          for (var s = y0, n = 0; n < 24 && n <= soonest; n++) {
            var at = Math.round(Math.max(0, Math.min(most, s + natTop(k, s) + mid - vh / 2))), e = Math.abs(at - y);
            if (e <= 3 + 1.5 * n && (n < soonest || e < off)) { soonest = n; off = e; best = k; }
            if (Math.abs(at - s) < 1) break;
            s = at;
          }
        }
      }
    });
    return best;
  };
  var shown = function (y) {
    if (!plainly || opened || !on || !arrival.on() || arrival.landing() || now() > openUntil || y <= 2) return false;
    var k = found(lastY, y);
    if (k < 0) return false;
    plainly = false;
    if (k > 0 && !arrival.retarget(k)) {
      arrival.finish();
      restore(0);
      settle();
      setAnchor(0);
      jumpTo(k);
      return true;
    }
    if (k > 0) { opened = k; aside = y; }
    restore(k);
    settle();
    setAnchor(k);
    return true;
  };

  // ------------------------------------------------------------ On and off

  // A screen of the small viewport, in pixels: what a room's content has to fit in.
  var probe = document.createElement('div');
  probe.style.cssText = 'position:absolute;top:0;left:0;width:0;height:100svh;visibility:hidden;pointer-events:none';
  var small = function () {
    document.body.appendChild(probe);
    var h = probe.offsetHeight;
    probe.remove();
    return h;
  };
  // Every room, and the first screen, fit on a screen: their content is no taller than it, or runs at most a few
  // pixels (SLACK) into the bottom margin, which is never less than 14px: rounding, a font's metrics a hair apart from
  // one engine to the next, are never a reason to give up the deck.
  var SLACK = 6;
  var main = hero.querySelector('[data-g-hero-main]');
  var fits = function () {
    footing();
    var h = small() + SLACK;
    var head = document.querySelector('body > .site-head');
    if (main.offsetHeight + (on || !head ? 0 : head.offsetHeight) > h) return false;
    return rooms.every(function (r) { return list(r.el.querySelectorAll('.g-grid')).every(function (g) { return g.offsetHeight <= h; }); });
  };
  // What the feet take, measured. A room's exhibit (--g-piece), and what Michi's words leave its album (--g-words). The
  // Studio keeps the footer's height clear at its foot, where the deck draws the footer's line, and upright its address
  // takes what the motto and the paragraph above it leave (--g-para, the paragraph, whose height depends on its width
  // alone). The first screen's tagline takes what its foot (the lede, whose height doesn't depend on the tagline's)
  // leaves of the screen (--g-foot, grid.css). Each is written only when it changes.
  var foot = document.querySelector('body > .site-foot');
  var studio = deck.querySelector('.g-room--studio');
  var lark = deck.querySelector('.g-set--lark .g-grid');
  var para = studio.querySelector('.g-studio__text');
  var heroFoot = main.querySelector(':scope > .g-foot');
  var setPx = function (el, name, px) { var v = px + 'px'; if (el.style.getPropertyValue(name) !== v) el.style.setProperty(name, v); };
  // The Studio, on a wide screen: its motto and its address both at the full measure where the screen holds them, and
  // where either of them would have to be set in from the margin, the address keeps the measure and the motto goes
  // beside its first line (.is-short, grid.css). Decided on the layout with both at the measure.
  var wideStudio = window.matchMedia('(orientation: landscape) and (min-width: 900px) and (min-aspect-ratio: 25/18)');
  var mottoA = studio.querySelector('.g-motto__a'), mailP = studio.querySelector('.g-mail');
  var shorten = function () {
    studio.classList.remove('is-short');
    if (wideStudio.matches && (parseFloat(getComputedStyle(mottoA).marginLeft) > 0.5 || parseFloat(getComputedStyle(mailP).marginLeft) > 0.5)) studio.classList.add('is-short');
  };
  var footing = function () {
    // A room's name takes what its foot (its exhibit, or its icon beside it, the taller) leaves of it (Lark's,
    // grid.css), and neither's height depends on the name's.
    rooms.forEach(function (r) {
      var h = 0;
      list(r.content.querySelectorAll('.g-piece, .g-icon')).forEach(function (el) { h = Math.max(h, el.getBoundingClientRect().height); });
      if (h) setPx(r.el, '--g-piece', Math.ceil(h));
      // Michi's stamps take what the room leaves under its words and the icon beside them (on a phone, grid.css): how
      // far down the room those reach (--g-words), which doesn't depend on the album's height.
      if (r.album) {
        var y0 = r.grid.getBoundingClientRect().top, w = 0;
        list(r.content.querySelectorAll('.g-intro, .g-icon')).forEach(function (el) { w = Math.max(w, el.getBoundingClientRect().bottom - y0); });
        setPx(r.el, '--g-words', Math.ceil(w));
      }
    });
    // Lark, upright on a phone, hangs its icon under its pitch wherever the room fits on the screen so (grid.css), and
    // puts it beside the pitch where it doesn't (.g-lark-side): a phone's own size doesn't say which, as an app's own
    // browser, under bars taller than Safari's, leaves the page less of the screen.
    if (lark) {
      root.classList.remove('g-lark-side');
      if (lark.offsetHeight > small() + SLACK) root.classList.add('g-lark-side');
    }
    setPx(studio, '--foot-h', foot.offsetHeight);
    shorten();
    setPx(studio, '--g-para', Math.ceil(para.getBoundingClientRect().height));
    setPx(root, '--g-foot', Math.ceil(heroFoot.getBoundingClientRect().height));
  };
  var wanted = function () { return !still.matches && window.innerHeight >= 460 && fits(); };

  // The screen the reader is on while the screens stack: the last whose top the scroll has reached.
  var current = function () {
    var k = 0;
    screens.forEach(function (el, i) { if (el.getBoundingClientRect().top <= 2) k = i; });
    return k;
  };
  var restore = function (k) {
    var y = 0;
    if (on) y = stops[k] || 0;
    else if (k > 0) y = screens[k].getBoundingClientRect().top + window.scrollY;
    to(Math.round(y));
    lastY = Y();
    place = k;
  };
  var teardown = function () {
    arrival.finish();
    rooms.forEach(function (r) {
      r.bed.textContent = '';
      r.types.textContent = '';
      r.slabs = [];
      r.screen.classList.remove('g-covered');
      r.content.style.clipPath = '';
      r.head.style.clipPath = '';
      hold(r.screen, r.k, 0, false);
      r.el.classList.remove('is-done', 'is-here', 'is-moving', 'is-skipped', 'is-give');
      r.here = r.done = r.moving = r.layered = false;
      r.drive = null; r.frozen = r.skipped = false;
    });
    hold(hero, 0, 0, false);
    hero.classList.remove('g-covered');
    strips.remove();
    jump = null;
    pending = null;
  };
  // What the deck was laid out on, in a word: the sizes of every piece of big type the columns carry and of what the
  // rooms' sizes are measured from (their feet, the poster's foot, the Studio's paragraph), and each room's. The
  // fonts coming in change it only if they change one of those (the mono, say, changes none of them).
  var signed = '';
  var signature = function () {
    var px = function (el) { return el.offsetWidth + 'x' + el.offsetHeight; };
    return rooms.map(function (r) { return list(r.content.querySelectorAll('[data-g-ride], .g-piece, .g-icon, .g-studio__text')).map(px).join(',') + '/' + r.grid.offsetHeight; }).join(';') + '|' + px(main) + px(heroFoot);
  };
  var buildAll = function () {
    // The feet again, as the deck has them (its footer is shorter than the stacked page's: no mark, and nothing under
    // its last line but what frames the screen, grid.css).
    footing();
    measure();
    rooms.forEach(build);
    strips.build();
    root.classList.add('g-built');
    lineUp();
    signed = signature();
  };

  // The first screen's tagline in strips, so that the columns rising over it can push it out as they come: the
  // poster's own columns (.g-cast, which built it on arrival), each a copy of the tagline clipped to a column of the
  // grid, the same columns as the rooms' (grid.css lays them out to match). They're shown, and the heading hidden, only
  // while the columns over the first screen are in flight (.is-pushed); each card is pushed up ahead of its column's
  // leading edge, and cut off under the header. That's a tagline of two lines (a laptop's, a desktop's).
  // One of three or four (a phone's, a tablet's either way up) is too tall to push: each strip would carry all its
  // lines up past its neighbours', the end of one line beside the start of another, a jumble for as long as the columns
  // are in flight. There the heading stays, and the columns cover it where it stands, so it reads to the last.
  var strips = (function () {
    var set = hero.querySelector('[data-g-tagline]'), cuts = [], top = 0, bottom = 0, shown = false;
    return {
      build: function () {
        cuts = []; shown = false;
        hero.classList.remove('is-pushed');
        var h = hero.getBoundingClientRect(), b = set.getBoundingClientRect();
        var fs = parseFloat(getComputedStyle(set).fontSize) || 100;
        top = b.top - h.top - fs * 0.06;
        bottom = b.bottom - h.top + fs * 0.26;
        var lines = 0, at = null;
        list(set.querySelectorAll(':scope > .g-w')).forEach(function (w) {
          var t = Math.round(w.getBoundingClientRect().top);
          if (t !== at) { lines++; at = t; }
        });
        var cards = list(hero.querySelectorAll('.g-cast__col')).filter(function (col) { return col.offsetWidth > 0; }).map(function (col) {
          var card = col.querySelector('.g-cast__card');
          card.style.transform = '';
          return { el: card, drawn: '' };
        });
        if (lines <= 2) cuts = cards;
        arrival.relayout();
      },
      // The columns over the first screen as they are (Michi's, or a jump's landing).
      push: function () {
        var r = pusher(0);
        if (!cuts.length || !r || !r.slabs.length) return;
        var flying = over(r, now()) && r.slabs.some(function (s) { return s.y > 0.001; });
        if (flying !== shown) { shown = flying; hero.classList.toggle('is-pushed', flying); }
        if (!flying) {
          cuts.forEach(function (d) { if (d.drawn) { d.drawn = ''; d.el.style.transform = ''; } });
          return;
        }
        r.slabs.forEach(function (s, c) {
          var d = cuts[c];
          if (!d) return;
          var lead = s.from > 0 ? (1 - s.y) * r.h - r.lead : (r.h - r.over) - (1 - s.y) * r.h;
          var push = s.y <= 0 ? 0 : s.from > 0 ? Math.min(0, lead - bottom) : Math.max(0, lead - top);
          var t = Math.abs(push) < 0.05 ? '' : 'translateY(' + push.toFixed(2) + 'px)';
          if (t !== d.drawn) { d.drawn = t; d.el.style.transform = t; }
        });
      },
      remove: function () {
        cuts.forEach(function (d) { d.el.style.transform = ''; });
        cuts = []; hero.classList.remove('is-pushed'); shown = false;
      }
    };
  })();
  // The running index stands on the header's own baseline, Contact's: the nav's links sit a few pixels lower in its row
  // than a plain row of the same links would (they're set on the wordmark's baseline), so the index is moved by what
  // that is. Measured on the words themselves, not their boxes (each is a flex item, centred in its link): the foot of
  // each one's text, which, both being in the same face at the same size, differ by just what their baselines do.
  var lineUp = function () {
    var head = rooms[0] && rooms[0].head;
    var nav = head && head.querySelector('.site-nav a'), run = head && head.querySelector('.g-runner__no');
    if (!nav || !run) return;
    var base = function (el) {
      var r = document.createRange();
      r.selectNodeContents(el);
      return r.getBoundingClientRect().bottom;
    };
    // What it's moved by now: what was measured last, or, the first time, the stylesheet's own 8px (grid.css,
    // .g-runner), not none.
    var now = root.style.getPropertyValue('--g-runner-dy');
    var was = now ? parseFloat(now) : 8;
    var dy = (was + base(nav) - base(run)).toFixed(2) + 'px';
    if (root.style.getPropertyValue('--g-runner-dy') !== dy) root.style.setProperty('--g-runner-dy', dy);
  };
  var set = function (want, k) {
    on = want;
    cancelAnimationFrame(raf);
    raf = 0;
    if (want) {
      root.classList.add('g-fx', 'g-live');
      take(true);
      buildAll();
      restore(k);
      measure();
      settle();
      setAnchor(nearest(Y()));
    } else {
      teardown();
      root.classList.remove('g-fx', 'g-live', 'g-built', 'g-at-hero', 'g-at-last');
      take(false);
      unchrome();
      inked.forEach(function (e) { e.style.removeProperty('--g-ink'); });
      ink = '';
      restore(k);
    }
  };
  // The deck where it's wanted: motion allowed, a screen tall enough, and every room fitting on one. Stacked, a room
  // that doesn't fit makes the page snap only near its stops (.g-tall). Nothing changes unless something has to.
  var decide = function (k) {
    var want = wanted();
    if (want !== on) set(want, k);
    root.classList.toggle('g-tall', !on && !fits());
  };

  // A resize that changes the layout (the width, or the deck's screen) lays the columns out again and keeps the
  // reader on their screen: the one they were on (or on their way to) in the deck, or the one they last came to
  // rest on, stacked (where() says which), never the one the new layout happens to have under the old scroll. One
  // that doesn't change it leaves everything as it is.
  var laid = '';
  var layout = function () { return window.innerWidth + 'x' + (on ? Math.round(stops[1]) : window.innerHeight); };
  var resizing = 0, wide = root.clientWidth, turning = 0;   // the width it's laid out on (the layout's: a pinch doesn't change it)
  window.addEventListener('resize', function () {
    resizedAt = now();
    cancelAnimationFrame(resizing);
    resizing = requestAnimationFrame(function () {
      arrival.finish();
      // Turned, the scroll is already the new layout's (Safari's, before the resize), so it says nothing of the old
      // one's stops: the reader is on the screen the deck had them on.
      var was = on, turned = root.clientWidth !== wide;
      var k = turned && on && !(jump && jump.playing) ? anchor : where();
      wide = root.clientWidth;
      turning = 0;
      decide(k);
      if (!on) {
        // Stacked before and after, and turned (a phone on its side, say): back on the screen they were on. (Not
        // when only the height changes, as when a phone's browser hides its bars as the page scrolls.)
        if (!was && turned) restore(k);
        laid = layout();
        return;
      }
      measure();
      var l = layout();
      if (!was || l !== laid) {
        laid = l;
        buildAll();
        restore(k);
        measure();
        settle();
        setAnchor(nearest(Y()));
        lens.reset();
      }
    });
  });
  var change = function () { decide(where()); lens.reset(); };
  still.addEventListener('change', change);
  // Back from the back/forward cache, the page is as it was left: on the screen the reader was on, at rest, as the
  // browser has already shown it (its picture of the page, before any of this runs), so it's not played again. Safari
  // on an iPhone has the scroll at the top for a moment first, putting it back only 50ms later, which the deck would
  // take for the reader's: the first screen shown, then a jump through every room back to theirs. So it's put straight
  // back on their screen, and kept there for a moment, as a page that opens on a room is (reopen).
  window.addEventListener('pageshow', function (event) {
    if (!event.persisted) return;
    arrival.finish();
    if (!on) return;
    opened = anchor;
    openUntil = now() + OPENING;
    reopen();
    measure();
    settle();
    setAnchor(nearest(Y()));
  });

  // ------------------------------------------------------------ The lens

  // On the first screen a column of the grid is a lens on the poster's decisions: through it the poster is drawn in
  // outline, in register, and on it, in mono, what was decided in that strip: each line's cap height,
  // x-height and baseline, the G hung into the margin, the kerning put back between letters set apart, the word
  // spaces, the lead, the dots' size, and the stop on the margin. Its window moves from column to column on a spring,
  // a little past and back. Where a column is too narrow to write in, the lens is two of them and moves two at a time
  // (on a phone, a third of the measure), so no note is ever cut off. Once the stop has clicked home it sweeps across
  // the tagline, once, and goes quiet on the stop's column: nothing of it is drawn, and the poster is simply there. A
  // mouse over the tagline wakes it where the pointer is and moves it; on a touch screen a sideways drag on the
  // tagline scrubs it, and a tap puts it where the finger is; either way, a moment after it's let go, it goes quiet
  // where it is. It's built when it's first wanted, and again after a resize.
  var lens = (function () {
    var el = hero.querySelector('[data-g-lens]');
    var scrub = hero.querySelector('[data-g-scrub]');
    var main = hero.querySelector('[data-g-hero-main]');
    var tagline = hero.querySelector('[data-g-tagline]');
    var win = null, plate = null, U = null;
    var x = 0, v = 0, aimed = 0, spring = 0, then = 0, at = -1, built = false, wanted = false, shown = true;
    var sweeping = 0, hush = true, back = 0, drag = null;

    var quiet = function (yes) { hush = yes; el.classList.toggle('is-quiet', yes); };
    var paint = function () { el.classList.toggle('is-on', built && wanted && shown); };
    // A note: its name, and under it its value, in mono, inside the column it's in (or against its right edge).
    var note = function (key, value, left, top, opts) {
      opts = opts || {};
      var n = document.createElement('span');
      n.className = 'g-lens__note' + (opts.quiet ? ' g-lens__note--quiet' : '') + (opts.end ? ' g-lens__note--end' : '');
      n.textContent = key;
      if (value) { var b = document.createElement('b'); b.textContent = value; n.appendChild(b); }
      n.style.left = left.toFixed(1) + 'px';
      n.style.top = top.toFixed(1) + 'px';
      plate.appendChild(n);
      return n;
    };
    var rule = function (cls, top, left, height) {
      var r = document.createElement('i');
      r.className = 'g-lens__rule' + (cls ? ' g-lens__rule--' + cls : '');
      r.style.top = top.toFixed(1) + 'px';
      if (cls === 'v') { r.style.left = left.toFixed(1) + 'px'; r.style.height = height.toFixed(1) + 'px'; }
      plate.appendChild(r);
      return r;
    };
    var span = function (x0, x1, top) {
      var s = document.createElement('i');
      s.className = 'g-lens__span';
      s.style.left = Math.min(x0, x1).toFixed(1) + 'px';
      s.style.width = Math.abs(x1 - x0).toFixed(1) + 'px';
      s.style.top = top.toFixed(1) + 'px';
      plate.appendChild(s);
    };
    var boxAround = function (b) {
      var o = document.createElement('i');
      o.className = 'g-lens__box';
      o.style.left = b.left.toFixed(1) + 'px';
      o.style.top = b.top.toFixed(1) + 'px';
      o.style.width = b.width.toFixed(1) + 'px';
      o.style.height = b.height.toFixed(1) + 'px';
      plate.appendChild(o);
      return o;
    };
    var fmt = function (em) { return (em > 0 ? '+' : em < 0 ? '−' : '') + Math.abs(em).toFixed(4).replace(/0+$/, '').replace(/\.$/, '') + 'em'; };
    var bare = function (em) { return fmt(em).replace(/^[+−]/, ''); };
    // Where a line's baseline is: a zero-sized mark set on it.
    var baseOf = function (node, top) {
      var m = document.createElement('i');
      m.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline';
      node.appendChild(m);
      var y = m.getBoundingClientRect().top - top;
      m.remove();
      return y;
    };

    // Measured at rest: whatever of the tagline is still on its way (the dots, the stop, the give, if the lens is
    // wanted before they're home) taken to its end for the moment of measuring, and put back, in the same frame.
    var steady = function (fn) {
      var anims = tagline.getAnimations({ subtree: true });
      var times = anims.map(function (a) {
        var t = a.currentTime, end = a.effect.getComputedTiming().endTime;
        if (t != null && isFinite(end)) a.currentTime = end + 1;
        return t;
      });
      try { fn(); } finally { anims.forEach(function (a, i) { if (times[i] != null) a.currentTime = times[i]; }); }
    };
    var build = function () { steady(make); };
    var make = function () {
      el.textContent = '';
      built = false;
      var h = hero.getBoundingClientRect();
      if (!h.width || !tagline.getBoundingClientRect().width) return;
      var rel = function (b) { return { left: b.left - h.left, top: b.top - h.top, right: b.right - h.left, bottom: b.bottom - h.top, width: b.width, height: b.height }; };
      var s = getComputedStyle(main), W = main.clientWidth;
      var m = parseFloat(s.paddingLeft) || 0, gap = parseFloat(s.columnGap) || 0, P = (W - 2 * m + gap) / 12;
      // The lens's unit is a column of the grid, or on a phone the pair of them the screen arrives in; where that's
      // too narrow to write in, the lens is two units, and moves two at a time.
      var per = W < 720 ? 2 : 1, n = 12 / per;
      var pair = per * P - gap < 84 ? 2 : 1;
      U = { left: m, step: pair * per * P, w: pair * per * P - gap, count: Math.floor(n / pair), per: per * pair };
      var fs = parseFloat(getComputedStyle(tagline).fontSize) || 100;
      var tb = rel(tagline.getBoundingClientRect());
      // The window starts under the header.
      var head = document.querySelector('.g-hero > .g-head .site-head');
      var top = Math.max(0, head.getBoundingClientRect().bottom - h.top);
      if (!on) top = 0;
      win = document.createElement('div');
      win.className = 'g-lens__win';
      plate = document.createElement('div');
      plate.className = 'g-lens__plate';
      plate.style.setProperty('--w', h.width.toFixed(1) + 'px');
      plate.style.top = (-top).toFixed(1) + 'px';
      plate.style.height = h.height.toFixed(1) + 'px';
      win.appendChild(plate);
      el.appendChild(win);

      // The lines: each row of words, its baseline found on the type itself, its caps 0.7275em above it, its
      // x-height 0.546em.
      var rows = [];
      list(tagline.querySelectorAll('.g-slot')).forEach(function (slot) {
        var b = rel(slot.getBoundingClientRect()), base = baseOf(slot, h.top);
        var row = rows.filter(function (r) { return Math.abs(r.base - base) < 2; })[0];
        if (!row) rows.push(row = { base: base, words: [] });
        row.words.push({ box: b });
      });
      rows.sort(function (a, b) { return a.base - b.base; });
      rows.forEach(function (r) { r.cap = r.base - fs * 0.7275; r.x = r.base - fs * 0.546; r.words.sort(function (a, b) { return a.box.left - b.box.left; }); });
      var rowOf = function (b) { var mid = (b.top + b.bottom) / 2; return rows.filter(function (r) { return mid > r.cap - fs * 0.3 && mid < r.base + fs * 0.3; })[0] || rows[0]; };
      var last = rows[rows.length - 1];
      var bandEnd = last.base + fs * 0.3;
      // The band the lens is worked in: the tagline's, from the header down.
      scrub.style.top = top.toFixed(1) + 'px';
      scrub.style.height = Math.max(0, bandEnd - top).toFixed(1) + 'px';
      var ground = document.createElement('i');
      ground.className = 'g-lens__ground';
      plate.appendChild(ground);
      // The poster in outline, in register: a copy of the tagline, laid out as it is (its words'
      // margins, which are measured against the poster's columns, set in pixels).
      var copy = tagline.cloneNode(true);
      copy.removeAttribute('data-g-tagline');
      copy.classList.add('g-lens__type');
      copy.style.left = tb.left.toFixed(1) + 'px';
      copy.style.top = tb.top.toFixed(1) + 'px';
      // A pixel over: its words' margins come back from getComputedStyle rounded, and a line that just fits must
      // still fit (to a tenth of a pixel, "right." went to a line of its own at 1512x982 and 1536x864). The words are
      // set from the left, by their margins, so nothing moves.
      copy.style.width = (tb.width + 1) + 'px';
      copy.style.fontSize = fs + 'px';
      copy.style.letterSpacing = getComputedStyle(tagline).letterSpacing;
      var from = tagline.querySelectorAll('.g-w'), into = copy.querySelectorAll('.g-w');
      for (var w = 0; w < from.length && w < into.length; w++) {
        var ws = getComputedStyle(from[w]);
        into[w].style.marginLeft = ws.marginLeft;
        into[w].style.marginRight = ws.marginRight;
      }
      plate.appendChild(copy);
      rows.forEach(function (r) { rule('', r.cap); rule('x', r.x); rule('', r.base); });
      var uLeft = function (k) { return U.left + k * U.step; };
      var unitOf = function (px) { return Math.max(0, Math.min(U.count - 1, Math.floor((px - U.left + gap / 2) / U.step))); };
      var lh = 13;   // a note's line
      // Each line's metrics, named at each unit's right edge (the last line's baseline names kept, by unit, for a
      // decision that must stand in their place, below).
      var names = [], caps = [];
      for (var k = 0; k < U.count; k++) {
        rows.forEach(function (r) {
          var nc = note('cap', '', uLeft(k) + U.w - 4, r.cap - lh - 2, { quiet: true, end: true });
          if (r === rows[0]) caps[k] = nc;
          note('x', '', uLeft(k) + U.w - 4, r.x - lh - 2, { quiet: true, end: true });
          var nb = note('base', '', uLeft(k) + U.w - 4, r.base + 3, { quiet: true, end: true });
          if (r === last) names[k] = nb;
        });
      }
      // What was decided where, each noted in its own unit: above the first line's caps, or under its line's
      // baseline (or, for the first line, under it when the space above is taken by the header). In the last unit,
      // against its right edge.
      // Under the last line, the foot (the lede) bounds what's written: the window never lies over it, and stops 8px
      // over it at the most, as the not-found page's does.
      var foot = main.querySelector('.g-foot');
      var floor = rel(foot.getBoundingClientRect()).top - 8;
      // A note's width, in the mono's 0.6em figures, 10px, padded 3px a side.
      var wide = function (key, value) { return 6 + 6 * Math.max(key.length, (value || '').length); };
      var taken = {}, used = {}, firsts = {};
      var put = function (key, value, px, row) {
        var k = unitOf(px), first = row === rows[0], id = k + ':' + rows.indexOf(row);
        var slot = (taken[id] = (taken[id] || 0) + 1) - 1;
        var y = first ? row.cap - 2 * lh - 6 - slot * (2 * lh + 4) : row.base + lh + 10 + slot * (2 * lh + 4);
        // Over the first line, as many as the header leaves room for (none, on a short screen); the rest under it.
        if (first && y < top + 2) y = row.base + lh + 10 + (slot - Math.max(0, Math.floor((row.cap - 2 * lh - 8 - top) / (2 * lh + 4)) + 1)) * (2 * lh + 4);
        var end = k === U.count - 1, side = false;
        // Under the last line, where it would run into the foot: the first as low as there's room for, in place of
        // the baseline's name if it must be; one more beside it, against the unit's other edge, if the two fit side
        // by side; any other left out.
        if (row === last && y > row.base && y + 2 * lh > floor) {
          var one = firsts[id];
          if (!one) {
            y = Math.max(row.base + 3, floor - 2 * lh);
            if (y < row.base + lh + 6 && names[k]) { names[k].remove(); names[k] = null; }
          } else {
            if (one.side || one.w + wide(key, value) + 9 > U.w) return k;
            one.side = side = true;
            y = one.y;
          }
        }
        var e = end !== side;
        // Over the first line's caps, a decision is on the line of that unit's "cap", which it would run into, or come
        // within a few pixels of and read as one run with: the lane is the decision's, and the name gives way to it.
        if (first && caps[k] && y < row.cap && y + 2 * lh > row.cap - lh - 2) { caps[k].remove(); caps[k] = null; }
        note(key, value, e ? uLeft(k) + U.w - 4 : uLeft(k) + 5, y, { end: e });
        if (!slot) firsts[id] = { y: y, w: wide(key, value) };
        used[k] = 1;
        return k;
      };
      // The G, hung 0.06em into the left margin so its curve sits on it.
      var G = tagline.querySelector('.g-w--get .g-l');
      var g = rel(G.getBoundingClientRect());
      rule('v', rows[0].cap - fs * 0.05, m, fs * 0.83);
      span(g.left, m, rows[0].x + fs * 0.12);
      put('G hangs', fmt(-0.06), m, rows[0]);
      // The kerning put back as a margin, where letters set apart would lose it.
      list(tagline.querySelectorAll('.g-l')).forEach(function (l) {
        var kv = l.style.getPropertyValue('--k');
        if (!kv) return;
        var b = rel(l.getBoundingClientRect()), row = rowOf(b), prev = l.previousElementSibling;
        rule('v', row.cap - fs * 0.05, b.left, fs * 0.83);
        put(prev.textContent + l.textContent, fmt(parseFloat(kv)), b.left + 1, row);
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
      // The dots: square bits, the width of the stem.
      list(tagline.querySelectorAll('.g-dot')).forEach(function (d) {
        var b = rel(d.getBoundingClientRect());
        boxAround(b);
        put('ı + bit', bare(Math.round(b.width / fs * 1000) / 1000), b.left, rowOf({ top: b.top + fs * 0.4, bottom: b.bottom + fs * 0.4 }));
      });
      // The stop, on the margin: its box, the margin, and what it measured.
      var stop = tagline.querySelector('.g-stop');
      var sb = rel(stop.getBoundingClientRect());
      var edge = W - m;
      boxAround(sb);
      rule('v', rows[0].cap - fs * 0.05, edge, last.base - rows[0].cap + fs * 0.1);
      put('stop 0.15em', Math.round(Math.abs(sb.right - edge)) + 'px off', sb.left, rowOf(sb));
      // The lead, from one line's baseline to the next one's caps, in the unit nearest the middle with nothing else
      // to say.
      if (rows.length > 1) {
        var free = range(U.count, function (q) { return q; }).filter(function (q) { return !used[q]; })
          .sort(function (a, b) { return Math.abs(a - (U.count - 1) / 2) - Math.abs(b - (U.count - 1) / 2); })[0];
        if (free != null) {
          var gx = uLeft(free) + U.w / 2;
          rule('v', rows[0].base, gx, rows[1].cap - rows[0].base);
          note('lead', bare((rows[1].cap - rows[0].base) / fs), gx + 5, (rows[0].base + rows[1].cap) / 2 - lh);
          used[free] = 1;
        }
      }
      // A unit with nothing else to say gives the tracking.
      var ty = rows[0].cap - 2 * lh - 6 < top + 2 ? rows[0].base + lh + 10 : rows[0].cap - 2 * lh - 6;
      // (Under a tagline of one line, only if there's room for it before the foot.)
      if (!(rows.length === 1 && ty > rows[0].base && ty + 2 * lh > floor))
        for (var q = 0; q < U.count; q++) {
          if (used[q]) continue;
          var qe = q === U.count - 1;
          if (caps[q] && ty < rows[0].cap) { caps[q].remove(); caps[q] = null; }
          note('tracking', '−0.034em', qe ? uLeft(q) + U.w - 4 : uLeft(q) + 5, ty, { quiet: true, end: qe });
        }
      // Each unit's number and width, under everything else written in it: in a row under the band, where there's
      // room for that before the foot; where there isn't (a short screen, the tagline as large as the foot leaves room
      // for), in a row as close under the notes as they go, or else in each unit as close under its own; and in a unit
      // with no room left at all, not there, what was decided in it standing in its place.
      var lowest = range(U.count, function () { return 0; });
      list(plate.querySelectorAll('.g-lens__note')).forEach(function (nt) {
        var q = unitOf(parseFloat(nt.style.left));
        lowest[q] = Math.max(lowest[q], parseFloat(nt.style.top) + (nt.querySelector('b') ? 2 : 1) * lh);
      });
      var low = Math.max(bandEnd + 8, Math.max.apply(null, lowest) + 6);
      if (low + 2 * lh > floor) low = Math.max.apply(null, lowest) + 6;
      for (var u = 0; u < U.count; u++) {
        var c0 = u * U.per + 1, cn = (u + 1) * U.per, end = u === U.count - 1;
        var label = U.per > 1 ? 'cols ' + (c0 < 10 ? '0' : '') + c0 + '–' + (cn < 10 ? '0' : '') + cn : 'col ' + (u < 9 ? '0' : '') + (u + 1);
        var ly = low + 2 * lh > floor ? lowest[u] + 6 : low;
        if (ly + 2 * lh > floor) continue;
        note(label, Math.round(U.w) + 'px', end ? uLeft(u) + U.w - 4 : uLeft(u) + 5, ly, { quiet: true, end: end });
        lowest[u] = ly + 2 * lh;
      }
      // The window, from under the header to 6px under its lowest note, and past the last line's descenders, but
      // never over the foot.
      var deep = Math.min(Math.max(Math.max.apply(null, lowest) + 6, last.base + fs * 0.25), floor);
      var winH = deep - top;
      win.style.top = top.toFixed(1) + 'px';
      win.style.height = winH.toFixed(1) + 'px';
      ground.style.height = deep.toFixed(1) + 'px';
      var edges = document.createElement('i');
      edges.className = 'g-lens__edges';
      edges.style.top = top.toFixed(1) + 'px';
      edges.style.height = winH.toFixed(1) + 'px';
      el.appendChild(edges);
      el.style.setProperty('--lw', U.w.toFixed(2) + 'px');
      el.classList.add('is-built');
      hero.classList.add('is-lensed');
      built = true;
      at = U.count - 1;
      x = aimed = posX(at);
      v = 0;
      place(x);
      quiet(hush);
      paint();
    };
    var posX = function (j) { return U.left + j * U.step; };
    var place = function (px) { el.style.setProperty('--x', px.toFixed(2) + 'px'); };
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
      at = Math.max(0, Math.min(U.count - 1, j));
      aimed = posX(at);
      if (sweeping) return;
      if (instant || still.matches) { cancelAnimationFrame(spring); spring = 0; x = aimed; v = 0; place(x); return; }
      if (!spring) { then = now(); spring = requestAnimationFrame(run); }
    };
    // A moment after it's let go, quiet where it is.
    var park = function (ms) {
      clearTimeout(back);
      back = setTimeout(function () { if (!drag) quiet(true); }, ms);
    };
    var halt = function () {
      cancelAnimationFrame(sweeping); sweeping = 0;
      cancelAnimationFrame(spring); spring = 0;
      clearTimeout(back);
    };
    // The sweep: once, from the first unit to the stop's, eased in and out, then quiet there.
    var sweep = function () {
      if (!built) build();
      if (!built || still.matches) return;
      halt();
      wanted = true;
      quiet(false);
      var from = posX(0), t0 = now(), D = 400;
      at = U.count - 1;
      aimed = posX(at);
      x = from;
      place(x);
      paint();
      var go = function (t) {
        var u = clamp((t - t0) / D);
        u = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
        x = from + (aimed - from) * u;
        place(x);
        if (u < 1) sweeping = requestAnimationFrame(go);
        else { sweeping = 0; x = aimed; place(x); if (at === U.count - 1 && !drag) quiet(true); }
      };
      sweeping = requestAnimationFrame(go);
    };
    var unitAt = function (clientX) {
      var px = clientX - hero.getBoundingClientRect().left;
      return Math.floor((px - U.left + (U.step - U.w) / 2) / U.step);
    };
    // Woken from quiet, it's there under the pointer at once; awake, it springs after it.
    var wake = function (clientX) { clearTimeout(back); if (hush) { quiet(false); to(unitAt(clientX), true); } else to(unitAt(clientX)); };
    var live = function () { return built && wanted && shown; };
    // A mouse over the band moves it, and a moment after it leaves, it goes quiet. A finger's sideways drag scrubs it
    // (an up or down one is the page's scroll, and lets it be), and a tap puts it where the finger is.
    scrub.addEventListener('pointermove', function (e) {
      if (!live()) return;
      if (e.pointerType === 'mouse') { if (!sweeping) wake(e.clientX); return; }
      if (!drag || drag.id !== e.pointerId) return;
      var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (!drag.side) {
        if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy) * 1.2) drag.side = true;
        else if (Math.abs(dy) > 10) { drag = null; return; }
      }
      if (drag.side) { e.preventDefault(); if (sweeping) halt(); wake(e.clientX); }
    });
    scrub.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse' && built) park(1100); });
    scrub.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' || !live()) return;
      drag = { id: e.pointerId, x: e.clientX, y: e.clientY, side: false, t: now() };
    });
    var lift = function (e) {
      if (!drag || drag.id !== e.pointerId) return;
      if (!drag.side && now() - drag.t < 350 && Math.abs(e.clientX - drag.x) < 8 && Math.abs(e.clientY - drag.y) < 8) { if (sweeping) halt(); wake(e.clientX); }
      drag = null;
      park(2600);
    };
    scrub.addEventListener('pointerup', lift);
    scrub.addEventListener('pointercancel', function (e) { if (drag && drag.id === e.pointerId) drag = null; });
    return {
      // Shown only while the poster is the screen, with nothing over it.
      follow: function (yes) {
        if (yes === shown) return;
        shown = yes;
        if (!yes) { drag = null; clearTimeout(back); if (built && !hush && !sweeping) { to(U.count - 1, true); quiet(true); } }
        paint();
      },
      // Parked on the stop, quiet, at once: the poster laid out without its arrival, or the arrival cut short.
      rest: function () {
        if (!built) build();
        if (!built) return;
        halt();
        wanted = true;
        to(U.count - 1, true);
        quiet(true);
        paint();
      },
      sweep: sweep,
      // Built ahead, unseen (while the void holds the screen and nothing moves), so the sweep has only to move it.
      prepare: function () { if (!built) build(); },
      // After a resize, or the fonts: built again (the type may have moved), and parked, if it was showing.
      reset: function () {
        var was = built, showing = built && wanted;
        halt();
        built = false;
        el.classList.remove('is-built', 'is-on');
        hero.classList.remove('is-lensed');
        el.textContent = '';
        if (was) { build(); if (built && showing) { to(U.count - 1, true); quiet(true); paint(); } }
      },
      busy: function () { return !!drag || !!sweeping || !hush; }
    };
  })();

  // ------------------------------------------------------------ The first screen's arrival, or the room landed on

  // Whatever screen the page opens on arrives (index.html tells it). The void holds the screen from the first frame
  // (grid.css draws it before this has run, wherever this can play an arrival, and index.html gives the browser's bar
  // its colour before then); once the type is in (never more than a moment: the font is the site's own, and preloaded),
  // so that the columns carry the real letters, the screen arrives over it.
  // The poster: the canvas strikes up over the void, a column of the ground (.g-ground) and the tagline's strip in it
  // (.g-cast) to each column of the grid, two on a phone. They're played by time, not by the scroll: each column a
  // damped spring's step, answered exactly at every frame, from its moment in the cascade, left to right and quicker
  // as they go, as Michi's are struck home; the type goes only a fifth as far past its place as its column (GIVE), and
  // so clicks into register as the columns settle. The header's copy is uncovered over each column once its leading
  // edge has passed most of the header's band, and the poster's foot over each as it lands. Once the last has settled,
  // the heading takes over from the columns' copies, and the void is let go. The beats that finish the poster are
  // grid.css's, timed from .is-struck; the lens's sweep and the tease are timed here.
  // A room, where the page opens on one (a link to it, /#lark or the apps' /#contact, or to a passage in it; a reload
  // or a step back to it: start, below): the void is laid in its screen, under its columns (grid.css), which are held
  // down there; then they rise over it as a step's do, by time, in the room's own rhythm, carrying its name and its
  // number, the rest of the room uncovered column by column as they land; once it has come to rest, the void is let go.
  // The screens before it are at rest under the void, so a step back from it is a step like any other.
  // The browser's bar has the void's colour while the void is at the top, and the screen's once most of the columns
  // have passed the header's band (atTop).
  // Anything the reader does before it's over (a key, a press, the wheel, a touch, a scroll, the focus moving, the
  // window resized, the page left) finishes it at once: the screen simply there, composed, as it is under Reduce
  // Motion.
  var arrival = (function () {
    var voidEl = hero.querySelector('[data-g-void]');
    var home = voidEl.parentNode, after = voidEl.nextSibling;
    var paper = hero.querySelector('[data-g-hero-main]');
    var headCopy = hero.querySelector(':scope > .g-head');
    var grounds = list(hero.querySelectorAll('.g-ground > i'));
    var casts = list(hero.querySelectorAll('.g-cast__col'));
    var state = '';   // '' not yet decided, 'void' held, 'strike' playing, 'done'
    var room = null;  // the room it's playing, landed on; null for the poster
    var t0 = 0, cols = [], A = null, timers = [], keyUp = '', keyHead = '', tinted = false, waited = null, voidDrawn = null;
    // How long the void holds the screen before the columns strike up, from the first frame the page drew (start).
    var BEAT = 300;
    var later = function (ms, fn) { timers.push(setTimeout(fn, ms)); };
    var painted = function () { return !!performance.getEntriesByType('paint').length; };
    // Whether the void is drawn (grid.css decides, from the first frame), as the page opened.
    var drawn = function () { if (voidDrawn === null) voidDrawn = getComputedStyle(voidEl).display !== 'none'; return voidDrawn; };
    // A damped spring's response to a step, s seconds after it (f, its frequency in Hz; z, its damping ratio).
    var stepAt = function (s, f, z) {
      if (s <= 0) return 0;
      var w = 2 * Math.PI * f, wd = w * Math.sqrt(1 - z * z), e = Math.exp(-z * w * s);
      return 1 - e * (Math.cos(wd * s) + (z * w / wd) * Math.sin(wd * s));
    };
    // The poster's columns, as they're laid out: the ground's and the cast's, one to a column (two on a phone).
    var lay = function () {
      var h = hero.getBoundingClientRect();
      var shown = grounds.filter(function (g) { return g.offsetWidth > 0; });
      var n = shown.length;
      var plan = range(n, function (i) { return { delay: 224 * Math.pow(i / Math.max(1, n - 1), 0.8), f: 3.1, z: 0.74 }; });
      var first = shown[0];
      A = {
        n: n,
        width: h.width,
        bounds: shown.map(function (g, i) { var b = g.getBoundingClientRect(); return [i === 0 ? 0 : b.left - h.left + 0.5, i === n - 1 ? h.width : b.right - h.left - 0.5]; }),
        h: first ? first.offsetHeight : window.innerHeight,
        lead: first ? -first.offsetTop : 0,
        headH: headCopy.offsetHeight
      };
      var was = cols;
      cols = shown.map(function (g, i) {
        var c = plan[i], w = 2 * Math.PI * c.f;
        // Settled: once the spring is within a quarter of a pixel of its place, for good.
        var settle = Math.log(Math.max(2, A.h / Math.sqrt(1 - c.z * c.z) / 0.25)) / (c.z * w);
        var cast = casts[parseInt(g.style.getPropertyValue('--col'), 10)];
        return { ground: g, cast: cast, card: cast.querySelector('.g-cast__card'), delay: c.delay, f: c.f, z: c.z, settle: settle, y: was[i] ? was[i].y : 0, drawn: null, gave: null, flying: false };
      });
      keyUp = keyHead = '';
    };
    // The poster's columns at time t.
    var strike = function (t) {
      var te = t - t0, alive = false, up = [], under = [], ku = '', kh = '', passed = 0;
      for (var i = 0; i < cols.length; i++) {
        var c = cols[i], s = (te - c.delay) / 1000, y = stepAt(s, c.f, c.z);
        if (s < c.settle) alive = true; else y = 1;
        c.y = y;
        var off = y <= 0 ? A.h + 2 : (1 - y) * A.h;
        var tr = y === 1 ? '' : 'translateY(' + off.toFixed(2) + 'px)';
        if (tr !== c.drawn) { c.drawn = tr; c.ground.style.transform = tr; c.cast.style.transform = tr; }
        // Past its place, the column takes the type only GIVE as far: the rest is the type's give within it.
        var give = y > 1 ? (1 - GIVE) * (y - 1) * A.h : 0;
        var gt = Math.abs(give) < 0.05 ? '' : 'translateY(' + give.toFixed(2) + 'px)';
        if (gt !== c.gave && c.card) { c.gave = gt; c.card.style.transform = gt; }
        var flying = y > 0.001 && y < 0.985;
        if (flying !== c.flying) { c.flying = flying; c.ground.classList.toggle('is-flying', flying); }
        var landed = y >= UP;
        up.push(landed);
        ku += landed ? '1' : '0';
        var lead = off - A.lead;   // its leading edge, from the top of the screen
        var over = y > 0 && lead <= A.headH * 0.35;
        under.push(over);
        kh += over ? '1' : '0';
        if (lead <= 0) passed++;
      }
      if (ku !== keyUp) { keyUp = ku; var cu = clipFor(A, up); paper.style.clipPath = cu === 'none' ? '' : cu; }
      if (kh !== keyHead) { keyHead = kh; var ch = clipFor(A, under); headCopy.style.clipPath = ch === 'none' ? '' : ch; }
      if (!tinted && passed * 2 >= cols.length) { tinted = true; chrome(anchor); }
      if (!alive) land();
    };
    // Arrived: the void is let go (and put back in the first screen, if it was laid in a room's).
    var letGo = function () {
      state = 'done';
      if (room) home.insertBefore(voidEl, after);
      hero.classList.remove('is-arriving', 'is-striking');
      root.classList.remove('g-arriving');
      root.classList.add('g-arrived');
      tinted = true;
      chrome(anchor);
    };
    // Every column of the poster home: the heading takes over from the columns' copies.
    var land = function () {
      cols.forEach(function (c) {
        c.y = 1;
        c.ground.style.transform = '';
        c.ground.classList.remove('is-flying');
        c.cast.style.transform = '';
        c.card.style.transform = '';
        c.drawn = c.gave = '';
      });
      paper.style.clipPath = '';
      headCopy.style.clipPath = '';
      letGo();
    };
    // The room landed on: its columns down and held there, the void under them in its screen, until the type is in.
    var hush = function (r) {
      r.screen.insertBefore(voidEl, r.screen.firstChild);
      r.frozen = true;
      r.drive = null;
      r.slabs.forEach(function (s) { s.y = s.goal = s.ey = s.eg = 0; s.v = s.ev = 0; s.busy = false; s.at = 0; s.drop = null; });
      r.hit = false;
      pushes();
      draw(r);
    };
    // The reader came back to the poster after leaving it alone: Michi's ground, once.
    var calm = 0;
    var poke = function () { calm = now(); };
    // Pressed, wheeled or touched before it's over: the screen, at once.
    ['pointerdown', 'wheel', 'touchstart'].forEach(function (type) {
      window.addEventListener(type, function () { if (state === 'void' || state === 'strike') { clearTimeout(waited); finish(); } }, { passive: true, capture: true });
    });
    ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(function (type) { window.addEventListener(type, poke, { passive: true }); });
    window.addEventListener('pointermove', function (e) { if (e.pointerType !== 'mouse' || Math.abs(e.movementX) + Math.abs(e.movementY) > 2) poke(); }, { passive: true });
    var tries = 0;
    var tease = function () {
      var free = on && anchor === 0 && !jump && Y() <= 1 && !document.hidden && !lens.busy() && now() - calm > 1500;
      if (!free) { if (++tries < 5) later(1200, tease); return; }
      hero.classList.add('is-teased');
      later(1500, function () { hero.classList.remove('is-teased'); });
    };
    var begin = function () {
      if (state !== 'void') return;
      // Safari may have shown a passage since the void went up (shown, above): then it's that screen that arrives.
      if (!room && on && Y() > 2) shown(Y());
      // A room: still where it landed, in the deck, its columns let go, in its own rhythm, as a step's are.
      if (room) {
        if (!on || anchor !== room.k || Math.abs(Y() - stops[room.k]) > 2) { finish(); return; }
        state = 'strike';
        room.frozen = false;
        play(room, 1, now());
        queue();
        return;
      }
      if (!on || anchor !== 0 || Y() > 2) { finish(); return; }
      state = 'strike';
      lay();
      t0 = now();
      hero.classList.add('is-arriving', 'is-striking', 'is-struck');
      strike(t0);
      // The lens's one sweep once the stop is home and the margin's light and the poster's give have died away.
      later(1150, function () { lens.sweep(); });
      later(1600, function () { hero.classList.remove('is-struck'); });
      later(2300, tease);
      queue();
    };
    // At once, composed: no arrival to play, or the reader moved first.
    var finish = function () {
      if (state === 'done') return;
      var playing = state === 'strike' || state === 'void';
      state = 'done';
      timers.forEach(clearTimeout);
      timers = [];
      if (playing && room) {
        // The room simply there, every column where the scroll puts it, its dots already out.
        room.frozen = false;
        if (on) settle();
        letGo();
      } else if (playing) {
        if (!cols.length) lay();
        land();
        hero.classList.remove('is-struck', 'is-teased');
      } else {
        if (drawn() && painted()) {
          // No arrival after all (the screens didn't fit, and stack), but the void was already drawn (Chrome may
          // paint before this runs): it fades away rather than going in a frame.
          root.classList.add('g-unvoid');
          later(260, function () { root.classList.remove('g-unvoid'); root.classList.add('g-arrived'); });
        } else {
          root.classList.remove('g-arriving');
          root.classList.add('g-arrived');
        }
        // The bar, given the void's colour before the first frame: the screen's, or, stacked, the page's own again.
        tinted = true;
        if (drawn()) { if (on) chrome(anchor); else unchrome(); }
      }
      lens.rest();
    };
    return {
      // Whether it plays: the deck is on, the reader's on a screen at its stop (the first, or the one the page
      // landed on), and the void was there for them from the first frame (grid.css decides that, before this has run:
      // motion allowed, a screen tall enough).
      start: function () {
        var k = anchor;
        var wanted = on && drawn() && Math.abs(Y() - (k > 0 ? stops[k] : 0)) <= 2;
        if (!wanted) { finish(); return; }
        state = 'void';
        room = k > 0 ? rooms[k - 1] : null;
        root.classList.add('g-arriving');
        if (room) hush(room);
        tinted = false;
        chrome(anchor);
        // The type first, the page shown, and the void held a beat: BEAT from the first frame the page drew
        // (window.gSeen, noted by index.html before the deck is read; else the next), however late this script came,
        // as the privacy and not-found pages hold theirs. The fonts are the site's own and the tagline's is preloaded;
        // were they still loading, the deck would be laid out again on them (below, Setting it going), which is
        // better done before the columns move than while they do. So the void waits for them, but never more than 0.6s.
        var fonts = document.fonts.ready;
        var cap = new Promise(function (resolve) { setTimeout(resolve, 600); });
        Promise.race([fonts, cap]).then(function () {
          var hold = function () {
            if (state !== 'void') return;
            if (typeof window.gSeen !== 'number') { requestAnimationFrame(function (t) { window.gSeen = t; hold(); }); return; }
            waited = setTimeout(function () { requestAnimationFrame(begin); }, Math.max(0, window.gSeen + BEAT - now()));
          };
          var go = function () {
            if (document.hidden || state !== 'void') return;
            document.removeEventListener('visibilitychange', go);
            if (!room) lens.prepare();
            hold();
          };
          if (document.hidden) document.addEventListener('visibilitychange', go);
          go();
        });
      },
      finish: function () { clearTimeout(waited); finish(); },
      // The page opens on room k after all (a passage Safari shows only as the page loads: shown, above): while the
      // void still holds the screen, that room arrives over it in the first screen's place. False once the first
      // screen's columns have set off.
      retarget: function (k) {
        if (state !== 'void' || room || k < 1) return false;
        room = rooms[k - 1];
        hush(room);
        return true;
      },
      // The reader did something (scrolled): the poster isn't left alone.
      poke: poke,
      // Played in the deck's frame: the poster's columns; or, a room's being played by the deck, whether it's done.
      frame: function (t) {
        if (state !== 'strike') return false;
        if (room) { if (room.done) { letGo(); setTimeout(function () { lens.rest(); }, 60); return false; } return true; }
        strike(t);
        return true;
      },
      // Laid out again (the fonts, a resize): measured anew, everything drawn afresh at the next frame.
      relayout: function () { if (state === 'strike' && !room) { lay(); cols.forEach(function (c) { c.drawn = c.gave = null; }); } },
      on: function () { return state === 'void' || state === 'strike'; },
      // The scroll has left the screen it plays on (the reader moved it): it's over.
      left: function (y) { return Math.abs(y - (room ? stops[room.k] : 0)) > 2; },
      // The room it plays (its screen), while it does; 0, the poster, or none.
      landing: function () { return room && (state === 'void' || state === 'strike') ? room.k : 0; },
      // The room held down, its arrival still to begin (settle keeps it so).
      hushed: function () { return state === 'void' ? room : null; },
      // The void is at the top of the screen (the browser's bar takes its colour): from the first frame, until most of
      // the columns arriving over it have passed the header's band.
      dark: function () {
        if (state === '') return drawn();
        if (state !== 'void' && state !== 'strike') return false;
        return room ? 2 * (room.capped || 0) < room.n : !tinted;
      },
      // The lens may be shown: the poster is up.
      up: function () { return state === 'done' || state === ''; }
    };
  })();

  // ------------------------------------------------------------ The pointer's column

  // In a room at rest, with a mouse, the grid's column under the pointer is brightened, as the lens does on the first
  // screen: its two edges come up from a tenth of the room's ink to nearly half, and its number shows at the foot,
  // by the ticks. It slides from column to column on a spring, a little past and back.
  var pointer = (function () {
    var mouse = window.matchMedia('(hover: hover) and (pointer: fine)');
    var room = null, x = 0, v = 0, aimed = 0, frame = 0, then = 0, col = -1;
    var place = function () { if (room) room.hi.style.translate = x.toFixed(2) + 'px 0'; };
    var spring = function (t) {
      var dt = Math.min(0.032, Math.max(0.001, (t - then) / 1000));
      then = t;
      var w = 2 * Math.PI * 4.2, z = 0.68;
      v += (-w * w * (x - aimed) - 2 * z * w * v) * dt;
      x += v * dt;
      if (Math.abs(x - aimed) < 0.1 && Math.abs(v) < 1) { x = aimed; v = 0; frame = 0; }
      else frame = requestAnimationFrame(spring);
      place();
    };
    var off = function () {
      if (room) room.hi.classList.remove('is-on');
      room = null; col = -1;
    };
    document.addEventListener('pointermove', function (event) {
      if (!on || !mouse.matches || (event.pointerType !== 'mouse' && event.pointerType !== 'pen')) return;
      var r = anchor > 0 ? rooms[anchor - 1] : null;
      if (!r || !r.done || jump) { off(); return; }
      var g = r.grid12, box = r.screen.getBoundingClientRect();
      var px = event.clientX - box.left, py = event.clientY - box.top;
      if (py < r.headH || px < 0 || px > r.width) { off(); return; }
      var c = Math.max(0, Math.min(g.n - 1, Math.floor((px - g.m + g.gap / 2) / g.step)));
      var target = c * g.step;
      if (room !== r) { off(); room = r; x = aimed = target; v = 0; place(); }
      aimed = target;
      if (c !== col) {
        col = c;
        r.hi.firstChild.textContent = ('0' + (c * g.per + 1)).slice(-2);
        if (!r.hi.classList.contains('is-on') || still.matches) { x = aimed; v = 0; place(); }
        else if (!frame) { then = now(); frame = requestAnimationFrame(spring); }
      }
      r.hi.classList.add('is-on');
    }, { passive: true });
    document.documentElement.addEventListener('mouseleave', off);
    return { off: off };
  })();

  // ------------------------------------------------------------ Setting it going

  // The reader's place at the start. On a reload, or a step back to the page, the screen they were on (kept for the
  // tab), whatever the address says, which may name the screen they first came to, and wherever the browser has put
  // the scroll back so far (some do it only later, some not at all). Otherwise the screen the address names (/#lark,
  // /#contact), or the one a link to a passage is on, or, put back part way down, the one the browser has put them on;
  // or the first.
  var named = function () {
    var id = '';
    try { id = decodeURIComponent((location.hash || '').slice(1)); } catch (e) { /* not an id */ }
    var target = id && document.getElementById(id);
    return target ? screenOf(target) : -1;
  };
  var start = function () {
    var n = performance.getEntriesByType('navigation')[0];
    var kept = -1, k = named();
    plainly = !n || n.type === 'navigate';
    try { kept = parseInt(sessionStorage.getItem('g-screen'), 10); } catch (e) { /* no storage: nothing kept */ }
    if (n && (n.type === 'reload' || n.type === 'back_forward') && kept >= 0 && kept < screens.length) {
      // The address may still name the screen they first came to (/#lark): it's made to name the one they're on, so
      // that the browser's own move to the screen it names, which Safari makes once the page is in, takes them
      // nowhere else.
      if (k >= 0 && k !== kept) {
        try { history.replaceState(history.state, '', location.pathname + location.search + (kept > 0 ? '#' + screens[kept].id : '')); } catch (e) { /* left as it was */ }
      }
      return kept;
    }
    if (k < 0) k = passage();
    if (k >= 0) return k;
    // Put part way down by the browser already: after a plain link, it has gone to a passage (Firefox, which keeps the
    // passage to itself too, goes to it, snapped to its screen, before this runs), and may go to it again (held).
    if (window.scrollY > 0) { held = plainly; return current(); }
    return 0;
  };
  place = opened = start();
  decide(place);
  laid = layout();
  arrival.start();
  // The fonts can change a room's height and where its type stands: if they were still loading as the deck was laid
  // out, then once they're in, check again that every room fits, and lay the columns out again on the type as it is
  // now, keeping the reader where they are. (In already, as they nearly always are, or changing nothing the deck was
  // laid out on, there's nothing to do: on a slow phone, a quarter of a second's work saved before anything moves.)
  if (document.fonts.status !== 'loaded') {
    document.fonts.ready.then(function () {
      if (on && signed && signature() === signed) return;
      var k = where();
      decide(k);
      if (on) { buildAll(); restore(k); measure(); settle(); setAnchor(nearest(Y())); }
      laid = layout();   // what it's laid out on now, so that Safari's first move of its bars after it isn't a new layout
      lens.reset();
    });
  }
})();
