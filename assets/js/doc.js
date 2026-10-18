// Long-form prose (_layouts/doc.html, doc.css): the privacy page's header and the browser's bars, which take the colors
// of what's under them; its running index; the square dots of its names; its landings; the first screen's arrival; and
// its bands' arrivals.
//
// It moves the page only as the browser would: a jump to a part on first load (an App Store link to
// /privacy/#kozeni) is put right again once the fonts are in and the page has its final size, in case they moved it,
// unless the reader has scrolled since; and a link followed on the page makes its jump a moment early, with the bands'
// changes, rather than the browser just after. Otherwise it reads the scroll, and draws: once a frame at most, only
// while the page scrolls or something is arriving, and only what changed.
//
// The header. Under the real header lies a copy of it for each region of the page (the layout's .gd-heads), each in
// its region's colors, fixed to the screen in a box of its own that stands where its region does (the layout's script
// places the boxes): the browser moves the boxes with the page as it scrolls it, so the header is always in the colors
// of what's under it, and where an edge between two regions passes under it, it's split there, in every frame, as the
// page is. Here it's kept in step with the bands: a band's copy is in its plan's colors while the band waits, and
// while it arrives, its plan's copy lies over it, cut back column by column as the band's columns come in.
//
// The first screen. It arrives as the home page's does: for a beat the void, its grid ruled down it and only the mark
// lit; then the canvas strikes up over it in the grid's columns (six on a phone), each carrying its strip of the title,
// left to right, quicker as they go, moved here frame by frame, and the header and the foot are uncovered column by
// column as they land; the rest of its arrival (the void's beat, the dot, the stop, the margin, the give) is doc.css's,
// timed from the same moment (.gd-striking). It plays only where the page opens on it.
//
// The bands. Each part opens on a band, its app's room. Until it has arrived it's drawn in outline on the page's canvas
// (.is-waiting), the plan of it: its grid, its label, its name and its number as hairlines. When it has come far enough
// up the screen for its name to be where the eye goes next, it arrives, once: twelve columns of its ground (six on a
// phone) rise into it, each a damped spring, each pushing its strip of the outline out of the band's top ahead of it,
// like the flap of a departures board, and bringing its strip of the band in behind: its name, its label, its number
// and the header's colors over it, the name going only a fifth as far as the column past its place, so it's a few
// pixels out of register while the columns overshoot, and clicks into register as they settle. The part's summary, on
// the band under its name, is read, so it never moves: a column's edge passing over it changes its colors, and the name
// comes up out of its top edge (or the outline's sinks into it), never across it. Then the band itself takes over from
// the columns, and they're gone. Each part keeps its app's time, as the rooms do on the home page: Michi's columns
// struck home left to right, quickening, like a postmark; Lark's in a call and its echo; Kozeni's counted in like coins
// from the right, its name dropped last into its slot from the top, and the band gives under it; the website's, the
// studio's, come down as a curtain. Every one is home in under 0.75s.
// Followed from the index (or from a link to it on the first screen), a part arrives the same way where the jump
// lands, as a room does on the home page, unless it's there already, finished, at the top of the screen; the bands the
// jump leaves or passes are simply there. The part the page opens at (/privacy/#michi, an index link opened anew, a
// reload at a part's band) arrives where the page lands, never shown finished first: the layout's script draws it in
// its plan from the first frame. A band that comes in any other way (a find in the page, a step back or forward, a
// scroll back up to it) is simply there.
(function () {
  'use strict';
  var root = document.documentElement;
  var doc = document.querySelector('.gd');
  var list = function (nodes) { return Array.prototype.slice.call(nodes); };
  var fx = root.classList.contains('gd-fx');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var forced = window.matchMedia('(forced-colors: active)');
  var on = function (mq, fn) { mq.addEventListener('change', fn); };
  // How the page was opened: anew, reloaded, or by a step back or forward (where the browser has no navigation
  // entries, its older word for it).
  var nav = null;
  try { nav = performance.getEntriesByType('navigation')[0] || null; } catch (e) { nav = null; }
  var opened = nav ? nav.type : window.performance && performance.navigation ? ['navigate', 'reload', 'back_forward'][performance.navigation.type] || 'navigate' : 'navigate';
  // What the page kept for the tab as it was last left (below): the region under the header, the band in view, the
  // scroll.
  var store = 'gd-at:' + location.pathname, kept = {};
  try { kept = JSON.parse(sessionStorage.getItem(store)) || {}; } catch (e) { kept = {}; }

  // ------------------------------------------------------------ The running index

  // The real one goes in the header, between the wordmark and Contact, so the keys take it in the order it's seen.
  var head = document.querySelector('body > .site-head');
  var runner = document.querySelector('.gd-runner--real');
  var nav0 = head.querySelector('.site-nav');
  head.insertBefore(runner, nav0);
  runner.classList.add('is-ready');
  var runLinks = list(document.querySelectorAll('.gd-runner--real .gd-runner__link'));

  // The first screen's links to the parts take each part's color for their underline on hover: an app's own color
  // where the part's id is an app's key (head.html writes them from apps.yml), the ink for the rest.
  var rootStyle = getComputedStyle(root);
  list(doc.querySelectorAll('.gd-intro a[href^="#"]')).forEach(function (a) {
    var key = a.getAttribute('href').slice(1);
    if (/^[a-z0-9-]+$/.test(key) && rootStyle.getPropertyValue('--' + key).trim()) a.style.setProperty('--app', 'var(--' + key + ')');
  });

  // It stands on the header's own baseline: the nav's links sit a few pixels lower in their row than a plain row of
  // the same links would (they're set on the wordmark's baseline), so the index is moved by what that is. Both are
  // links 44px tall with their words in the meta centred in them, so it's their tops that are lined up.
  var lineUp = function () {
    var a = head.querySelector('.site-nav a'), r = runner.querySelector('.gd-runner__link');
    if (!fx) return;
    var was = parseFloat(root.style.getPropertyValue('--gd-runner-dy')) || 4;
    var d = a.getBoundingClientRect().top - r.getBoundingClientRect().top;
    if (Math.abs(d) > 0.01) root.style.setProperty('--gd-runner-dy', (was + d).toFixed(2) + 'px');
  };

  // ------------------------------------------------------------ The regions

  // The page's regions, in order: the poster, each part's band and text, the end; and each one's copy of the header
  // (the layout writes them in the same order, and its script places each copy's box where its region is: gdPlace,
  // asked again here whenever the page is laid out anew). The one under the header's band is the one the reader is
  // in: the header's focus rings take its ink, the index marks its part (aria-current), and the bar of a browser that
  // tints it from the theme colour takes its ground: the theme colour head.html sets for the canvas, rewritten. (The
  // page's own background stays the canvas, which every region but a band lets show through, with the grid ruled on
  // it.) Safari 26 and later tint their bars from strips along the top and the foot instead (.gd-chrome, below).
  var heads = list(document.querySelectorAll('.gd-heads > .gd-head'));
  var regions = list(doc.querySelectorAll('[data-gd-region]')).map(function (el, i) {
    var part = el.closest('[data-gd-part]');
    return { el: el, head: heads[i], key: part ? part.getAttribute('data-gd-part') : '', band: el.hasAttribute('data-gd-band'), start: el.classList.contains('gd-poster'), end: el.classList.contains('gd-end') };
  });
  var tops = [];
  var hh = 0;
  var measure = function () {
    var y = window.scrollY;
    tops = regions.map(function (r) { return r.el.getBoundingClientRect().top + y; });
    hh = head.getBoundingClientRect().height;
  };
  var themes = list(document.querySelectorAll('meta[name="theme-color"]'));
  var inked = list(document.querySelectorAll('body > .site-head, .gd-runner--real'));
  var under = function (y) { var k = 0; for (var i = 0; i < tops.length; i++) if (tops[i] <= y) k = i; return k; };
  var place = function () { if (fx && window.gdPlace) window.gdPlace(); };
  // A length on the screen's pixels.
  var snap = function (v) { var d = window.devicePixelRatio; return Math.round(v * d) / d; };

  // Until the browser has put the page where it opens (at a part linked to, or back where a reload or a step back
  // found it; some browsers do that only once the page has loaded), what the header says (below) stays as it is for
  // there, not for the top of the page the reader never sees.
  var opening = function () {
    if (moved || (loadedAt && performance.now() - loadedAt > 1000)) return false;
    if (opened !== 'navigate') return typeof kept.y === 'number' && Math.abs(window.scrollY - kept.y) > 2;
    var to = location.hash.length > 1 ? target(location.hash) : null;
    return !!to && window.scrollY < 1 && to.getBoundingClientRect().top > window.innerHeight;
  };
  // Two lines are read: the top of the screen, for the bar, which lies over it; and the middle of the header's band,
  // where its words are, for what the header says (its ink, the index's mark, whether there's an index at all), so
  // the real header's clear links are always where the copy they lie over draws them.
  var at = -1, bar = -1, ink = '', tint = '';
  var paint = function (force) {
    if (opening()) return;
    edgesPaint();
    var y = window.scrollY;
    var rk = under(y + 1), hk = under(y + hh / 2);
    var r = regions[rk], h = regions[hk];
    if (rk === bar && hk === at && !force) return;
    bar = rk;
    at = hk;
    var g = getComputedStyle(r.el).backgroundColor;
    // A band arriving is the canvas under its columns; it's the band's ground for the bar once that's at the top.
    var rb = r.band ? byEl.get(r.el) : null;
    if (rb && rb.state === 'arriving' && rb.topped && rb.ground) g = rb.ground;
    if (g === 'rgba(0, 0, 0, 0)') g = canvas();
    if (fx && g !== tint && !arrival.holds()) {
      tint = g;
      themes.forEach(function (m) { m.setAttribute('content', g); });
    }
    var c = getComputedStyle(h.el).color;
    if (c !== ink) { ink = c; inked.forEach(function (e) { e.style.setProperty('--gd-ink', ink); }); }
    root.classList.toggle('gd-at-start', h.start);
    root.classList.toggle('gd-at-end', h.end);
    runLinks.forEach(function (a) {
      if (h.key && a.getAttribute('data-gd-key') === h.key) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    });
  };
  var canvas = function () { return getComputedStyle(document.body).backgroundColor; };

  // ------------------------------------------------------------ The browser's bars

  // On a Mac, Safari's bar takes the strip along the top, the canvas always but for the void's while the first screen
  // arrives (doc.css; the arrival, below). On a phone or a tablet (iOS, every browser there being Safari's engine) the
  // edges over and under the page take their colors from a strip along the top and one along the foot, and read a strip
  // again only when it's a new one (a change of its color alone is never seen): there each is the color of what's under
  // it, the void's while the first screen arrives over it, a band's ground where a band is at that edge (one arriving,
  // once most of its columns have brought it there) and the canvas elsewhere, and both are new strips each time that
  // changes (redo). --gd-chrome is set on the strip itself, the one element that reads it.
  // While the first screen's arrival holds them, they're its own (arrival.holds).
  var ua = navigator.userAgent;
  var edges = navigator.maxTouchPoints > 0 && /AppleWebKit/.test(ua) && !/Android|Chrome\//.test(ua);
  var strip = document.querySelector('.gd-chrome'), sill = null;
  if (edges) { sill = strip.cloneNode(false); sill.classList.add('gd-chrome--foot'); strip.parentNode.insertBefore(sill, strip.nextSibling); }
  var redo = function (el, c) { var n = el.cloneNode(false); n.style.setProperty('--gd-chrome', c); el.parentNode.replaceChild(n, el); return n; };
  var edgeTop = '', edgeFoot = '';
  // What's under the screen's line y (from its top): a band's ground, or the canvas. The lines read are 2px in from
  // the screen's edges, so a band landed a fraction of a pixel short of the top is the band's.
  var groundAt = function (y, foot) {
    var k = under(window.scrollY + y), r = regions[k];
    var b = r.band ? byEl.get(r.el) : null;
    if (!b || b.state === 'waiting') return canvas();
    if (b.state === 'arriving') return (foot ? b.atFoot : b.atTop) && b.ground ? b.ground : canvas();
    return getComputedStyle(b.el).backgroundColor;
  };
  var edgesPaint = function () {
    if (!sill || !tops.length || arrival.holds()) return;
    var t = groundAt(2, false), f = groundAt(window.innerHeight - 2, true);
    if (t !== edgeTop) { edgeTop = t; strip = redo(strip, t); }
    if (f !== edgeFoot) { edgeFoot = f; sill = redo(sill, f); }
  };
  var scheme = window.matchMedia('(prefers-color-scheme: dark)');
  on(scheme, function () { tint = edgeTop = edgeFoot = ''; paint(true); });

  // ------------------------------------------------------------ The square dots

  // Each name keeps its own words, one text node, so it's read, found and copied as it is; its i's round dots are
  // masked off, and square bits, the width of the stem, drawn over the stems beside it (.gd-decor), as the title's
  // are (doc.css says the measures: the stem runs from 0.051em to 0.156em of the i, the round dot's ink from 0.037em to
  // 0.171em and from 0.63em to 0.757em over the baseline). Where each i is, and its line's baseline, is measured on the
  // letters as they're set, so it holds however the name wraps.
  var names = list(doc.querySelectorAll('.gd-band h2'));
  var dot = function (h) {
    var decor = h.nextElementSibling && h.nextElementSibling.classList.contains('gd-decor') ? h.nextElementSibling : null;
    if (!decor) {
      decor = document.createElement('span');
      decor.className = 'gd-decor gd-name__decor';
      decor.setAttribute('aria-hidden', 'true');
      h.parentNode.insertBefore(decor, h.nextSibling);
    }
    h.classList.add('gd-dotted');
    // Each i's own box (a range over it: its left is where the letter starts), and its line's baseline, which lies as
    // far under the top of its box as an empty box set after the last letter finds it under the last letter's.
    var spots = [], text = [];
    list(h.childNodes).forEach(function (node) { if (node.nodeType === 3) text.push(node); });
    var range = document.createRange();
    var last = text[text.length - 1];
    if (!last) return;
    var p = document.createElement('span');
    p.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline';
    h.appendChild(p);
    range.setStart(last, last.length - 1);
    range.setEnd(last, last.length);
    var drop = p.getBoundingClientRect().bottom - range.getBoundingClientRect().top;
    text.forEach(function (node) {
      for (var i = node.data.indexOf('i'); i > -1; i = node.data.indexOf('i', i + 1)) {
        range.setStart(node, i);
        range.setEnd(node, i + 1);
        var b = range.getClientRects()[0] || range.getBoundingClientRect();
        spots.push({ x: b.left, base: b.top + drop });
      }
    });
    var box = h.getBoundingClientRect(), d = decor.getBoundingClientRect();
    var em = parseFloat(getComputedStyle(h).fontSize);
    p.remove();
    var f = function (n) { return (n / em).toFixed(4) + 'em'; };
    var holes = spots.map(function (s) { return { x: f(s.x - box.left + 0.031 * em), y: f(s.base - box.top - 0.763 * em) }; });
    var img = holes.map(function () { return 'linear-gradient(#000 0 0)'; }).concat('linear-gradient(#000 0 0)').join(', ');
    var pos = holes.map(function (o) { return o.x + ' ' + o.y; }).concat('0 0').join(', ');
    var size = holes.map(function () { return '0.146em 0.139em'; }).concat('100% 100%').join(', ');
    [['mask-image', img], ['mask-position', pos], ['mask-size', size]].forEach(function (p) { h.style.setProperty(p[0], p[1]); });
    // The bits kept and moved, not made again, so a dot that has popped out of its stem doesn't pop again.
    var bits = list(decor.children);
    while (bits.length > spots.length) bits.pop().remove();
    spots.forEach(function (s, k) {
      var b = bits[k];
      if (!b) { b = document.createElement('b'); b.className = 'gd-bit'; decor.appendChild(b); }
      b.style.left = f(s.x - d.left + 0.051 * em);
      b.style.top = f(s.base - d.top - 0.7455 * em);
    });
  };
  var dotAll = function () {
    if (!root.classList.contains('gd-type')) return;
    names.forEach(dot);
  };
  // Each band's number reaches from its name's cap line to a third past the band's foot, however tall the band is
  // with its summary: how far that is, measured (doc.css, --below).
  var figures = list(doc.querySelectorAll('.gd-band .gd-no'));
  var reach = function () {
    figures.forEach(function (n) {
      var band = n.closest('.gd-band');
      var top = parseFloat(getComputedStyle(n).top) || 0;
      band.style.setProperty('--below', Math.max(0, band.offsetHeight - top).toFixed(1) + 'px');
    });
  };

  // ------------------------------------------------------------ The title, short

  // Whether the screen is too short for the title to run to the measure (doc.css, --tag): then its stop stands after
  // the word, short of the right margin, and the margin doesn't light as it lands (.gd-short).
  var title = doc.querySelector('h1.gd-title'), poster = doc.querySelector('.gd-poster__main');
  var shortness = function () {
    var pc = getComputedStyle(poster), D = parseFloat(pc.getPropertyValue('--tag-d'));
    var width = poster.clientWidth - parseFloat(pc.paddingLeft) - parseFloat(pc.paddingRight);
    root.classList.toggle('gd-short', parseFloat(getComputedStyle(title).fontSize) < width / D - 0.5);
  };

  // ------------------------------------------------------------ Springs

  // A damped spring's step response, t seconds after it's let go (f, its frequency in Hz; z, its damping ratio: the
  // lower, the further past its place it goes); how long it takes to settle for good; and how far past its place it
  // goes (its first peak, a fraction of the way), and back (its second, the square of that).
  var spring = function (f, z, t) {
    if (t <= 0) return 0;
    var w = 2 * Math.PI * f, wd = w * Math.sqrt(1 - z * z);
    return 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + (z * w / wd) * Math.sin(wd * t));
  };
  var settles = function (f, z) { return Math.log(2000) / (z * 2 * Math.PI * f); };
  var peak = function (z) { return Math.exp(-z * Math.PI / Math.sqrt(1 - z * z)); };

  // ------------------------------------------------------------ The first screen's arrival

  // The home page's first screen's (grid.js), as the not-found page plays it too (lost.js), frame by frame. doc.css
  // draws the void from the first frame, wherever it will play, with the canvas's columns waiting under the screen's
  // foot. Once the type is in, so that the columns carry the real letters (the font is the site's own, and preloaded:
  // never more than a moment, and never more than 0.6s), and the void has held a beat (BEAT, 0.3s from the first frame
  // the page drew), this strikes them up (html.gd-striking): all twelve (six on a phone), left to right and quicker as
  // they go, each a damped spring's step answered exactly at every frame, carrying its strip of the title.
  // Each has landed 97% up, when its void and its ground go and the page is there under it, the header and the foot
  // uncovered column by column; its strip goes only a fifth as far past its place as the column would, so the type
  // clicks into register as the columns settle. Its edges, brighter while it flies, fade as it lands, and at night its
  // canvas, a step lighter while it flies, settles to the canvas as it lands. Once every strip is home the heading
  // takes over from the copies in one frame (html.gd-here); the beats that finish the poster play on (the dot, the
  // stop, the margin, the give: doc.css, timed from html.gd-striking), and once they're over the poster is simply there
  // for good (html.gd-posted). It plays only where the page opens on its first screen, at the top; otherwise (the page
  // opened further on, Reduce Motion, forced colors, the script so late, the page scrolled already) it's simply there,
  // and the void, if it was drawn, fades away over it. Anything the reader does before it's over (a key, a press, the
  // wheel, a touch, a scroll, the focus moving, the window resized, Reduce Motion or forced colors turned on) finishes
  // it at once: the poster simply there.
  var arrival = (function () {
    var layer = document.querySelector('[data-gd-arrive]');
    var state = '';   // '' not yet decided, 'void' held, 'play' playing, 'fade' let go unplayed, 'done'
    var timers = [];
    var later = function (ms, fn) { timers.push(setTimeout(fn, ms)); };
    // The columns strike up as the home page's poster's do: each a damped spring's step (F Hz, Z its damping ratio)
    // from its moment in the cascade, CASCADE x (i / (n - 1))^0.8 ms, the last at 224ms; landed once it's UP of the way;
    // and from the moment it's first at its place (AT on), its strip goes only GIVE as far past as the column would.
    var F = 3.1, Z = 0.74, UP = 0.97, GIVE = 0.2, CASCADE = 224;
    // How fast a column's swing dies away (per second), how fast it swings, and so when it's first at its place.
    var DECAY = Z * 2 * Math.PI * F, SWING = 2 * Math.PI * F * Math.sqrt(1 - Z * Z), AT = (Math.PI - Math.atan(SWING / DECAY)) / SWING;
    // A column's edges are drawn brighter while it flies: they come in over its first RISE ms in flight, and once it's
    // LANDS of the way up they fade, over FADE ms, both on the site's ease, as the home page's do (its leading edge goes
    // as it lands). At night the canvas under it, the lift (doc.css), settles from a step lighter to the canvas over
    // SETTLE ms from then.
    var RISE = 60, LANDS = 0.985, FADE = 260, SETTLE = 200;
    // Safari's edges take the canvas's color from the strips over about a tenth of a second, so each strip is given it
    // a little before half the columns have passed it: the strip along the top as the first of them pass the top, and
    // by day the strip along the foot (on iOS) as the columns come up across the foot. At night, when what rises there
    // is the canvas lifted a step, the edge under it stays the void's till the top's turns, and the two turn together,
    // as the home page's do: never the canvas's beside the void's black under lifted columns. The beats are over by
    // BEATS. The void holds the screen a BEAT from the first frame the page drew, as the home and not-found pages'
    // voids do, however the page was opened and however late this script came.
    var SILL = 60, TINT = 250, BEATS = 1500, BEAT = 300;
    // The site's ease, cubic-bezier(0.2, 0.7, 0.2, 1) (site.css, --ease), at u of the way through.
    var ease = function (u) {
      if (u <= 0) return 0;
      var lo = 0, hi = 1, t = u;
      for (var k = 0; k < 24; k++) { t = (lo + hi) / 2; if (0.6 * (1 - t) * (1 - t) * t + 0.6 * (1 - t) * t * t + t * t * t < u) lo = t; else hi = t; }
      return 2.1 * (1 - t) * (1 - t) * t + 3 * (1 - t) * t * t + t * t * t;
    };
    // When the void is first seen to be there: the first frame the page drew, noted by the layout's first script
    // (window.gdSeen), else the first frame after this one (a browser may say it painted the page some frames before
    // the screen shows it, as Safari does on a first visit, so its paint timing isn't asked).
    var cols = [], t0 = 0, H = 0, raf = 0, silled = false, tinted = false, here = false, seen = null;
    var size = [window.innerWidth, window.innerHeight];

    // Safari's bars (doc.css, .gd-chrome): the void's color while it holds the top of the screen and the foot, and then
    // the canvas's, each when its moment comes (above). On iOS a strip is read only when it's a new one, so each is
    // replaced by a new strip in the canvas's color (redo, The browser's bars); on a Mac, whose bar follows the strip
    // along the top as it changes, that strip takes it in place. The theme colour goes back to the canvas's with the
    // strip along the top (paint).
    var footed = function () {
      silled = true;
      if (sill) { edgeFoot = canvas(); sill = redo(sill, edgeFoot); }
    };
    var topped = function () {
      tinted = true;
      if (!silled) footed();
      if (sill) { edgeTop = canvas(); strip = redo(strip, edgeTop); }
      else strip.style.setProperty('--gd-chrome', 'var(--canvas)');
      paint(true);
    };

    // The columns, as they're laid out (six on a phone), each with its void, its ground and its lift.
    var lay = function () {
      var all = list(layer.querySelectorAll('.gd-a')), voids = list(layer.querySelectorAll('.gd-void'));
      var lifts = list(document.querySelectorAll('.gd-lift > i'));
      var shown = all.filter(function (a) { return a.offsetWidth > 0; }), n = shown.length;
      H = layer.clientHeight;
      // At rest once its strip is within a quarter of a pixel of its place, for good.
      var rest = Math.max(AT, Math.log(Math.max(2, GIVE * H / Math.sqrt(1 - Z * Z) / 0.25)) / DECAY);
      cols = shown.map(function (a, i) {
        var k = all.indexOf(a);
        return { el: a, ground: a.querySelector('.gd-a__ground'), voidEl: voids[k], lift: lifts[k], delay: CASCADE * Math.pow(i / Math.max(1, n - 1), 0.8), rest: rest, drawn: null, landed: false, flies: -1, lit: null, lands: -1, faded: null, settled: null };
      });
      // Each column's strip of the title's baseline ends where the next column begins, so the pixel the two share is
      // drawn once, by the one over it, as the page's line is (doc.css, --gd-to); the last runs on to the
      // screen's edge.
      var lines = shown.map(function (a) { return a.querySelector('.gd-a__plate > .gd-title__decor'); });
      var ends = lines.map(function (l, i) { return i < n - 1 ? l.getBoundingClientRect().right - shown[i + 1].getBoundingClientRect().left : null; });
      lines.forEach(function (l, i) { if (ends[i] !== null) l.style.setProperty('--gd-to', ends[i].toFixed(2) + 'px'); });
    };
    // A frame, te ms into the strike: every column where its spring has it, written only where it has moved, and its
    // edges as bright as they are by then, and the canvas under it as light; the strips, and the heading, when their
    // moment comes. Whether there's more to draw.
    var draw = function (t) {
      var te = Math.max(0, t - t0), all = true, busy = false;
      for (var i = 0; i < cols.length; i++) {
        var c = cols[i], s = (te - c.delay) / 1000, y = spring(F, Z, s);
        var r = s >= c.rest ? 1 : s < AT ? y : 1 + GIVE * (y - 1);
        if (s < c.rest) all = false;
        var tr = r === 1 ? '' : 'translateY(' + (s <= 0 ? H + 2 : (1 - r) * H).toFixed(2) + 'px)';
        if (tr !== c.drawn) { c.drawn = tr; c.el.style.transform = tr; }
        // Landed: its void and its ground go, and the page is there under its strip (doc.css).
        if (!c.landed && y >= UP) {
          c.landed = true;
          c.ground.classList.add('is-landed');
          c.voidEl.style.visibility = 'hidden';
        }
        // Its edges come in from its first frame in flight (drawn at nothing in that frame, as a transition starts).
        if (c.lands < 0 && s > 0) {
          if (c.flies < 0) c.flies = te;
          var w = (te - c.flies) / RISE, lit = w >= 1 ? '1' : ease(w).toFixed(3);
          if (lit !== c.lit) { c.lit = lit; c.ground.style.setProperty('--gd-edges', lit); }
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
            else c.ground.style.setProperty('--gd-edges', o);
          }
        }
        if (c.lands >= 0 && c.settled !== 'gone') {
          var q = (te - c.lands) / SETTLE;
          var l = q >= 1 ? 'gone' : (100 * (1 - ease(q))).toFixed(2) + '%';
          if (l !== c.settled) {
            c.settled = l;
            if (l === 'gone') c.lift.style.visibility = 'hidden';
            else c.lift.style.setProperty('--gd-lift', l);
          }
        }
        if (c.faded !== 'gone' || c.settled !== 'gone') busy = true;
      }
      if (!silled && te >= SILL && !scheme.matches) footed();
      if (!tinted && te >= TINT) topped();
      // The heading takes over from the copies in one frame, once every strip is home (doc.css, gd-here).
      if (!here && all) { here = true; root.classList.add('gd-here'); }
      return !here || busy;
    };
    var tick = function (t) {
      raf = 0;
      var more = false;
      try { more = draw(t); } catch (e) { done(); return; }
      if (more) raf = requestAnimationFrame(tick);
    };
    // Over: the arrival taken away (at once, if it was still going), the poster simply there, and the bars and the
    // theme colour given back to what's under them.
    var done = function () {
      state = 'done';
      timers.forEach(clearTimeout);
      timers = [];
      cancelAnimationFrame(raf);
      raf = 0;
      root.classList.remove('gd-striking', 'gd-unvoid');
      root.classList.add('gd-posted');
      tinted = silled = true;
      paint(true);
    };
    // No arrival after all, with the void already drawn: once the browser has painted it, it fades away over the poster
    // as the home page's does (doc.css, html.gd-unvoid), rather than going in a frame; else it simply goes.
    var painted = function () { return !!performance.getEntriesByType('paint').length; };
    var unvoid = function () {
      if (!painted()) { done(); return; }
      state = 'fade';
      root.classList.add('gd-unvoid');
      later(240, done);
    };
    var begin = function (t) {
      if (state !== 'void') return;
      // Its script in long after the page opened (in the background, say), or the page already scrolled: no arrival,
      // the poster as it is.
      if (window.scrollY > 2 || performance.now() - (window.gdT0 || 0) > 2400) { unvoid(); return; }
      state = 'play';
      lay();
      t0 = t;
      // The first frame of the strike is drawn with the class that begins it, so no frame shows the columns anywhere
      // but under the screen's foot before they move.
      root.classList.add('gd-striking');
      tick(t0);
      later(BEATS, done);
    };
    var cut = function () { if (state === 'void' || state === 'play' || state === 'fade') done(); };
    ['pointerdown', 'keydown', 'wheel', 'touchstart', 'focusin'].forEach(function (type) {
      window.addEventListener(type, cut, { passive: true, capture: true });
    });
    window.addEventListener('scroll', function () { if (window.scrollY > 2) cut(); }, { passive: true });
    // A window resized: a new width, or a new height of more than a browser's bars (which come and go on a phone, and
    // change nothing the arrival has laid out).
    window.addEventListener('resize', function () { if (window.innerWidth !== size[0] || Math.abs(window.innerHeight - size[1]) > 120) cut(); });
    on(reduce, function () { if (reduce.matches) cut(); });
    on(forced, function () { if (forced.matches) cut(); });
    return {
      // Whether it plays: the page's CSS drew the void (motion allowed, no forced colors, the page opening on its first
      // screen), and the reader is at the top.
      start: function () {
        var drawn = getComputedStyle(layer).display !== 'none';
        if (!drawn) { done(); return; }
        if (window.scrollY > 2) { unvoid(); return; }
        state = 'void';
        edgeTop = edgeFoot = 'void';
        requestAnimationFrame(function (t) { seen = t; });
        var fonts = document.fonts.ready;
        var cap = new Promise(function (resolve) { setTimeout(resolve, 600); });
        Promise.race([fonts, cap]).then(function () {
          var go = function () {
            if (state !== 'void' || document.hidden) return;
            document.removeEventListener('visibilitychange', go);
            var from = typeof window.gdSeen === 'number' ? window.gdSeen : seen;
            if (from === null) { requestAnimationFrame(go); return; }
            later(Math.max(0, from + BEAT - performance.now()), function () { requestAnimationFrame(begin); });
          };
          if (document.hidden) document.addEventListener('visibilitychange', go);
          go();
        });
      },
      // Whether it still holds the browser's bars: from the first frame till the strip along the top is the canvas's.
      holds: function () { return !tinted; }
    };
  })();

  // ------------------------------------------------------------ Landing

  // The page opened at one of its parts (/privacy/#michi): once it has its final size, the jump is put right, so the
  // band's top is at the top of the screen in every engine, unless the reader has moved since. Only when it was
  // opened there: a reload or a step back puts the reader back where they were, which the browser keeps.
  var moved = false;
  var mark = function () { moved = true; };
  ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function (t) { window.addEventListener(t, mark, { passive: true, once: true }); });
  var land = function () {
    if (moved || !location.hash || opened !== 'navigate') return;
    var to = target(location.hash);
    if (to) to.scrollIntoView({ block: 'start' });
  };

  // ------------------------------------------------------------ The bands' arrivals

  var range = function (n, fn) { var out = []; for (var i = 0; i < n; i++) out.push(fn(i)); return out; };
  // Each gives every column, counted from the left, its moment of delay after the first to move (ms), which way it
  // comes (1, up from the band's foot; -1, down from its top) and its spring (f, its frequency in Hz; z, its damping
  // ratio: at 0.84 a column goes a pixel or two past its place, at 0.88 and over hardly at all), or, for a name
  // dropped into its slot, its fall (drop). They're the home page's rooms' own, in its rooms' time, kept to 0.75s:
  // every column is home by then.
  var CASCADES = {
    // Michi: left to right, each column struck home and held, like a postmark, quicker and quicker, as a hand
    // franking a pile of letters goes: each wait a little shorter than the one before.
    strike: function (n) {
      var r = Math.pow(2 / n, 1 / Math.max(1, n - 2)), all = 1 - Math.pow(r, n - 1);
      return range(n, function (i) { return { delay: 320 * (1 - Math.pow(r, i)) / all, from: 1, f: 4.6, z: 0.84 }; });
    },
    // Lark: a call and its echo, as its drill plays a sentence and you say it back. The right half from the margin
    // in, a beat's rest, then the left half the same way, a little softer.
    echo: function (n) {
      var half = n / 2;
      return range(n, function (i) {
        var j = n - 1 - i;
        return j < half
          ? { delay: 100 * j / Math.max(1, half - 1), from: 1, f: 4.6, z: 0.84 }
          : { delay: 100 + 130 + 100 * (j - half) / Math.max(1, half - 1), from: 1, f: 4.2, z: 0.88 };
      });
    },
    // Kozeni: coins counted onto a counter, from the right, short and hard, none past its place, a coin every 30ms;
    // then its name dropped into its slot from the top, its columns as one, falling faster as it goes to a dead stop,
    // and the band gives under it. Where the name takes every column (a phone), its columns drop one after another
    // from the right, counted in.
    coins: function (n, spine) {
      var coins = [];
      for (var i = n - 1; i >= 0; i--) if (!spine[i]) coins.push(i);
      var plan = [];
      coins.forEach(function (c, at) { plan[c] = { delay: at * 30, from: 1, f: 6, z: 0.92 }; });
      var at = coins.length ? (coins.length - 1) * 30 + 40 : 0, k = 0;
      for (var s = n - 1; s >= 0; s--) if (spine[s]) plan[s] = { delay: coins.length ? at : 30 * k++, from: -1, drop: 200, spine: true };
      return plan;
    },
    // The website, the studio's: a curtain, left to right, from the top, as the home page's last screen comes down.
    curtain: function (n) {
      return range(n, function (i) { return { delay: 240 * Math.pow(i / (n - 1), 0.9), from: -1, f: 4.2, z: 0.88 }; });
    }
  };
  var GIVE = 0.2;    // how far the type goes with a column past its place
  // A band arrives once its name's top is this far down the screen: where the eye goes next (the layout's script says
  // it, as it draws the bands to arrive on the first screen in their plan).
  var LINE = window.gdLine || 0.62;
  // Where a column is, t seconds after its delay: on its spring, or falling (a quarter of the way at half its time).
  var motion = function (c, t) {
    if (c.drop) return t <= 0 ? 0 : Math.min(1, Math.pow(t / c.drop, 2));
    return spring(c.f, c.z, t);
  };

  // Each band, with its region's copy of the header, which shows the band's state: in its plan's colors while the
  // band waits (the layout's script may have drawn it so already, to be landed on, or to arrive as it comes up the
  // screen), in the band's own once it arrives.
  var bands = list(doc.querySelectorAll('[data-gd-band]')).map(function (el) {
    var r = regions.filter(function (g) { return g.el === el; })[0];
    var part = el.closest('[data-gd-part]');
    return { el: el, h: el.querySelector('h2'), key: part.getAttribute('data-gd-part'), head: r.head, how: el.getAttribute('data-gd-cascade'), state: el.classList.contains('is-waiting') ? 'waiting' : 'here', cols: null };
  });
  var shown = function (b) {
    b.head.classList.toggle('is-waiting', b.state === 'waiting');
  };
  var live = function () { return fx && !reduce.matches; };

  // A copy of a piece of the band for a column: its words drawn by CSS, no ids, placed to the pixel where the piece is.
  var copy = function (d, x0) {
    var c = d.el.cloneNode(true);
    c.removeAttribute('id');
    list(c.querySelectorAll('[id]')).forEach(function (e) { e.removeAttribute('id'); });
    var walk = document.createTreeWalker(c, NodeFilter.SHOW_TEXT), texts = [];
    while (walk.nextNode()) texts.push(walk.currentNode);
    texts.forEach(function (t) {
      if (!t.data.trim()) return;
      var w = document.createElement('span');
      w.className = 'gd-t';
      w.setAttribute('data-t', t.data);
      t.parentNode.replaceChild(w, t);
    });
    c.style.left = (d.left - x0).toFixed(2) + 'px';
    c.style.top = d.top.toFixed(2) + 'px';
    c.style.width = d.width.toFixed(2) + 'px';
    c.style.height = d.height.toFixed(2) + 'px';
    return c;
  };
  var el = function (cls, css) { var e = document.createElement('div'); e.className = cls; if (css) e.style.cssText = css; return e; };
  var px = function (n) { return n.toFixed(2) + 'px'; };
  var down = function (n) { return 'translate(0,' + n.toFixed(3) + 'px)'; };
  // An element moved down by v: by a transform of whole pixels of the screen, and by its own top for what's left, a
  // fraction of a pixel, which only changes when the page scrolls. Under a transform of a fraction of a pixel, text
  // isn't drawn as the same text laid out there is (Chrome draws it on other pixels; Firefox moves a layer moved so
  // onto a whole pixel), so what's held still in a column would shift as the band took over from it. Gives what's left
  // over, to be given back next time (was), so the top is only set when that changes.
  var nudge = function (e, v, dpr, was) {
    var w = Math.round(v * dpr) / dpr, r = v - w;
    if (Math.abs(r - was) > 0.0005) e.style.top = r.toFixed(3) + 'px';
    e.style.transform = down(w);
    return r;
  };

  // The columns of a band, each with its belt: the plan's pane where the band is, the band's on from it.
  var build = function (b) {
    var band = b.el, grid = band.querySelector('.gd-band__grid');
    var br = band.getBoundingClientRect();
    var W = br.width, H = br.height;
    var gs = getComputedStyle(grid);
    var m = parseFloat(gs.paddingLeft) || 0, gap = parseFloat(gs.columnGap) || 0;
    var per = window.innerWidth < 720 ? 2 : 1, n = 12 / per;
    var P = (W - 2 * m + gap) / 12;
    // The columns meet in the middle of the gutters a pixel over, their edges on the screen's own pixels, so what a
    // column carries is drawn on the pixels the band draws it on.
    var dpr = window.devicePixelRatio;
    var edge = function (j) { return m + j * P - gap / 2; };
    var bounds = range(n, function (i) { return [i === 0 ? 0 : snap(edge(i * per) - 0.5), i === n - 1 ? W : snap(edge((i + 1) * per) + 0.5)]; });
    // Its pieces: what the columns carry (the label, the name and its dots, the number), and what they hold still,
    // the summary, which is read and so never moves: a column's edge passing over it changes its colors, nothing more.
    // And what's carried is seen only above the summary's top (all but the number, which stands behind the summary as
    // it does in the band), so the type never crosses the words held still: the band's name rises out of the
    // summary's top edge, and the plan's sinks into it.
    var pieces = list(grid.children).map(function (e) {
      var r = e.getBoundingClientRect();
      return { el: e, left: r.left - br.left, top: r.top - br.top, width: r.width, height: r.height, held: e.classList.contains('gd-lead'), figure: e.classList.contains('gd-no') };
    }).filter(function (d) { return d.width > 0 && d.height > 0; });
    var s0 = H;
    pieces.forEach(function (d) { if (d.held) s0 = Math.min(s0, d.top); });
    var rg = document.createRange();
    rg.selectNodeContents(b.h);
    var nr = rg.getBoundingClientRect();
    var spine = bounds.map(function (c) { return c[1] > nr.left - br.left + 2 && c[0] < nr.right - br.left - 2; });
    var plan = CASCADES[b.how](n, spine);
    // How far the springs go past their place, and back: the band's pane has that much more of its ground on its
    // trailing side (over), and on its leading side (lip), so a column ringing never shows the plan or the page.
    var o = 0;
    plan.forEach(function (c) { if (!c.drop) o = Math.max(o, peak(c.z)); });
    var lip = Math.ceil(H * o * o / (1 - o * o)) + 2;
    var D = H + lip;
    var over = Math.ceil(o * D) + 8;
    var cols = el('gd-cols');
    cols.setAttribute('aria-hidden', 'true');
    b.W = W;
    b.H = H;
    b.dpr = dpr;
    b.D = D;
    b.topped = false;
    b.atTop = b.atFoot = false;
    // Where each column's strip of the header begins and ends: from the column's left edge to the next one's, which
    // lies over it in the pixel they share (the first and last run out past the screen's edges).
    b.xs = bounds.map(function (c, i) { return i === 0 ? -2 : c[0]; }).concat(W + 2);
    b.cols = plan.map(function (c, i) {
      var x0 = bounds[i][0], x1 = bounds[i][1];
      var col = el('gd-col', 'left:' + px(x0) + ';width:' + px(x1 - x0));
      var belt = el('gd-belt');
      var lines = function (top) { return el('gd-pane__lines', 'top:' + px(top) + ';left:' + px(m + i * per * P - x0) + ';width:' + px(per * P - gap) + ';--h:' + px(H)); };
      var mine = pieces.filter(function (d) { return d.left < x1 && d.left + d.width > x0; });
      var up = c.from > 0;
      // A pane: its ground and its grid; and over them, a layer held still where the band is while the belt moves,
      // which holds the summary, and carries the band's number, and its label, name and dots in a window down to the
      // summary's top. top: where the pane is on the belt; at: where the band's own top is in the pane.
      var carry = function (pane, top, at) {
        pane.appendChild(lines(at));
        var still = el('gd-pane__still', 'height:' + px(H));
        var figure = el('gd-pane__type', 'bottom:auto;height:' + px(H));
        var win = el('gd-pane__win', 'height:' + px(s0));
        var type = el('gd-pane__type', 'bottom:auto;height:' + px(H));
        win.appendChild(type);
        still.appendChild(figure);
        still.appendChild(win);
        mine.forEach(function (d) {
          var k = copy(d, x0);
          if (d.held) { k.classList.add('gd-pane__held'); still.appendChild(k); } else (d.figure ? figure : type).appendChild(k);
        });
        pane.appendChild(still);
        return { el: pane, top: top, at: at, figure: figure, still: still, type: type, rest: 0 };
      };
      // The plan, where the band is; and the band: its lip, its height, and what it may go past by, in the order the
      // column brings them.
      var paneTop = up ? H : -(over + H + lip), inset = up ? lip : over;
      var planPane = el('gd-pane gd-pane--plan');
      var bandPane = el('gd-pane gd-pane--band', 'top:' + px(paneTop) + ';height:' + px(lip + H + over));
      var panes = [carry(planPane, 0, 0), carry(bandPane, paneTop, inset)];
      panes[1].band = true;
      var lead = el('gd-pane__edge', 'opacity:0;' + (up ? 'top:0' : 'bottom:0;border-top:0;border-bottom:1px solid var(--edge)'));
      bandPane.appendChild(lead);
      belt.appendChild(planPane);
      belt.appendChild(bandPane);
      col.appendChild(belt);
      cols.appendChild(col);
      return { belt: belt, panes: panes, edge: lead, y: 0, whole: 0, rest: 0, delay: c.delay / 1000, from: c.from, f: c.f, z: c.z, drop: c.drop ? c.drop / 1000 : 0, spine: !!c.spine, settle: c.delay / 1000 + (c.drop ? c.drop / 1000 : settles(c.f, c.z)), rested: false };
    });
    band.appendChild(cols);
    b.wrap = cols;
    // The header over the band as it arrives: its copy, in the band's colors from now on, under a copy of it in the
    // plan's, in the same box (.gd-head__plan), which draw() cuts back, a frame at a time, to what of each column the
    // band hasn't brought in yet. Both lie fixed to the screen in the band's box, as the page scrolls; only the cut
    // follows the columns.
    var cover = el('gd-head__plan');
    cover.appendChild(b.head.querySelector('.gd-head__bar').cloneNode(true));
    b.head.appendChild(cover);
    b.plan = cover;
    b.cut = null;
  };
  var unbuild = function (b) {
    if (b.wrap) b.wrap.remove();
    if (b.plan) b.plan.remove();
    b.wrap = b.plan = null;
    b.cols = null;
  };

  // A band, here at once: its plan or its columns put away, nothing played.
  var still = function (b) {
    if (b.state === 'here') return;
    unbuild(b);
    b.el.classList.remove('is-waiting', 'is-arriving', 'is-moving', 'is-give');
    b.state = 'here';
    shown(b);
    paint(true);
  };
  var raf = 0;
  var loop = function () { if (!raf) raf = requestAnimationFrame(step); };
  var arrive = function (b) {
    b.el.classList.remove('is-waiting');
    build(b);
    b.el.classList.add('is-arriving', 'is-moving');
    b.state = 'arriving';
    b.gave = false;
    shown(b);
    // The columns are laid out now, and drawn at their start, so what's held still (the summary) is in its place, and
    // the header's plan over the band whole, before they're ever seen. Their clock starts on the next frame, which
    // draws them as they are now (this is never run in a frame's own callbacks): the work of making them is all done
    // before anything moves, and no column moves more than a frame's worth at once.
    void b.wrap.offsetHeight;
    b.ground = getComputedStyle(b.cols[0].panes[1].el).backgroundColor;
    b.t0 = null;
    draw(b, null);
    paint(true);
    loop();
  };
  var draw = function (b, now) {
    if (now !== null && b.t0 === null) b.t0 = now;
    var t = now === null ? 0 : (now - b.t0) / 1000, all = true, landed = false, topped = false, nTop = 0, nFoot = 0;
    // Where the band is on the screen, now (read off the band itself: an engine may round the scroll it gives), so
    // where the top of the screen is over it, and its foot.
    var at = b.el.getBoundingClientRect().top, s = -at, sf = window.innerHeight - 1 - at;
    b.cols.forEach(function (c) {
      if (!c.rested) {
        var y = t >= c.settle ? 1 : motion(c, t - c.delay);
        if (t < c.settle) all = false; else c.rested = true;
        c.y = y;
        // The belt moves, a layer of its own, always onto a whole pixel of the screen; what's held still is moved back
        // by as much, and what's carried is put exactly where it goes, so at rest either is drawn on the pixels the band
        // draws it on, and nothing changes as the band takes over. The type is carried, but the band's goes only a
        // fifth as far as its column past its place.
        var dy = (c.from > 0 ? -1 : 1) * y * b.D;
        var whole = Math.round((at + dy) * b.dpr) / b.dpr - at;
        var give = (c.from > 0 ? 1 : -1) * Math.max(0, y - 1) * b.D * (1 - GIVE);
        c.whole = whole;
        c.rest = nudge(c.belt, whole, b.dpr, c.rest);
        c.panes.forEach(function (p) {
          var v = p.top + p.at + dy + (p.band ? give : 0), carried = Math.abs(v) < 0.005 ? '' : down(v);
          p.rest = nudge(p.still, -(p.top + whole), b.dpr, p.rest);
          p.type.style.transform = carried;
          p.figure.style.transform = carried;
        });
        c.edge.style.opacity = y > 0.002 ? Math.max(0, Math.min(1, (1 - y) * 6)).toFixed(3) : '0';
        if (c.spine && y >= 1) landed = true;
      }
      // Whether its ground has come up (or down) to the top of the screen yet, and to its foot.
      var covers = function (v) { return c.from > 0 ? b.H - c.y * b.D <= v + 0.5 : c.y * b.D >= v + 0.5; };
      if (covers(s)) { topped = true; nTop++; }
      if (sf >= 0 && sf < b.H && covers(sf)) nFoot++;
    });
    cut(b);
    // Once the band's ground is at the top of the screen in a column, the bar of a browser that tints it from the theme
    // colour takes it (paint); a phone's edges, once it's there in most of them.
    var n = b.cols.length, atTop = s > -1 && nTop * 2 >= n, atFoot = nFoot * 2 >= n;
    if (topped && !b.topped && s > -1) { b.topped = true; paint(true); }
    if (atTop !== b.atTop || atFoot !== b.atFoot) { b.atTop = atTop; b.atFoot = atFoot; edgesPaint(); }
    if (landed && !b.gave) {
      b.gave = true;
      b.el.classList.add('is-give');
      setTimeout(function () { b.el.classList.remove('is-give'); }, 600);
    }
    if (all) {
      unbuild(b);
      b.el.classList.remove('is-arriving', 'is-moving');
      b.el.classList.add('is-here');
      b.state = 'here';
      shown(b);
      paint(true);
    }
  };
  // The plan's copy of the header over a band arriving, cut to what of each column is still the plan's: from the
  // band's top down to the edge of the band's pane as the column's belt has it now (or from its foot up to it, for a
  // column that drops), all as one polygon on the band's box, the copy's box. It runs a little past the box, which
  // clips it, so nothing is left at the box's own edges.
  var cut = function (b) {
    var H = b.H, e = 0.5 / b.dpr, upper = [], lower = [], any = false, all = true;
    b.cols.forEach(function (c, i) {
      var top = -2, bot = H + 2;
      if (c.from > 0) { var q = H + c.whole; if (q < H - e) bot = q > e ? q : -2; } else { var p = c.whole; if (p > e) top = p < H - e ? p : H + 2; }
      if (bot > top) any = true;
      if (top > -2 || bot < H + 2) all = false;
      upper.push(px(b.xs[i]) + ' ' + px(top), px(b.xs[i + 1]) + ' ' + px(top));
      lower.unshift(px(b.xs[i]) + ' ' + px(bot));
      lower.unshift(px(b.xs[i + 1]) + ' ' + px(bot));
    });
    var clip = !any ? 'inset(0 0 100% 0)' : all ? '' : 'polygon(' + upper.concat(lower).join(', ') + ')';
    if (clip !== b.cut) { b.cut = clip; b.plan.style.clipPath = clip; }
  };
  var step = function (now) {
    raf = 0;
    var any = false;
    bands.forEach(function (b) { if (b.state === 'arriving') { draw(b, now); if (b.state === 'arriving') any = true; } });
    if (any) loop();
  };

  // A part followed from the index or a link to it: whether its band is to arrive where the jump lands. It goes back to
  // its plan, unless it's on its way there already (a second click on the same entry: it goes on as it is, so it plays
  // once), or there already, finished, at the top of the screen (its entry followed again: there's no jump, and it has
  // nowhere to come from).
  var follow = function (b) {
    if (!live()) { still(b); return false; }
    if (b.state === 'arriving') return false;
    if (b.state === 'here' && Math.abs(b.el.getBoundingClientRect().top) < 1.5) return false;
    unbuild(b);
    b.el.classList.remove('is-arriving', 'is-moving', 'is-give', 'is-here');
    b.state = 'waiting';
    shown(b);
    return true;
  };
  // Whatever else is arriving is left behind by a jump (the reader followed another part, or stepped back): finished
  // at once, never left half-built, wherever it is.
  var leave = function (keep) { bands.forEach(function (b) { if (b !== keep && b.state === 'arriving') still(b); }); };

  // A leap: the page moved more than a screen at once (a jump, a find in the page, the scroll put back on reload).
  var lastY = window.scrollY, leapAt = -1e9;
  var leaping = function () { return performance.now() - leapAt < 400; };
  var track = function () {
    var y = window.scrollY;
    if (Math.abs(y - lastY) > window.innerHeight * 1.2) leapAt = performance.now();
    lastY = y;
  };
  // A band a jump lands in, or passes, is simply there; but the band of a part the reader followed a link to arrives.
  var target = function (hash) { try { return hash && hash.length > 1 ? document.getElementById(decodeURIComponent(hash.slice(1))) : null; } catch (e) { return null; } };
  var byEl = new Map();
  bands.forEach(function (b) { byEl.set(b.el, b); byEl.set(b.h, b); });
  var upTo = function (to, keep) {
    if (!to) return;
    bands.forEach(function (b) {
      if (b === keep) return;
      if (b.el.contains(to) || b.el.closest('.gd-part').contains(to) || (b.el.compareDocumentPosition(to) & Node.DOCUMENT_POSITION_FOLLOWING)) still(b);
    });
  };
  var followed = { hash: '', at: -1e9 };
  document.addEventListener('click', function (e) {
    if (e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var hash = a.getAttribute('href'), to = target(hash);
    if (!to) return;
    leapAt = performance.now();
    followed = { hash: hash, at: leapAt };
    var b = byEl.get(to);
    var part = b && b.h === to ? b : null;
    if (landing && landing !== part) { landing = null; }
    leave(part);
    upTo(to, part);
    var go = part ? follow(part) : false;
    // The jump, made here, with the bands' changes, so the frame that draws them draws it too (Firefox can draw one
    // between a click's changes and its jump); the browser's own then finds the page there already, and only sets the
    // address and the target. Then the part's band arrives where it has landed: its columns are made now, at their
    // start, so the first frame that shows the jump shows the band in its plan, and the next sets them going.
    to.scrollIntoView({ block: 'start' });
    if (go) { measure(); arrive(part); }
  }, true);
  // A step back or forward to a part (the history's, not a link): simply there.
  window.addEventListener('hashchange', function () {
    if (location.hash === followed.hash && performance.now() - followed.at < 1000) return;
    leapAt = performance.now();
    landing = null;
    leave(null);
    upTo(target(location.hash));
  });

  // The band the page lands on, if it opened at one (the layout's script says which, data-gd-land, and has drawn it in
  // its plan): it arrives where the page has landed, once it's there, its name in view under the header and well up
  // the screen. A reload puts the page back where it was, which some browsers do only once the page has loaded, so
  // until the scroll is back there (or a second after the load, at most) the band waits in its plan. The bands before
  // it are simply there. If the page never gets there, it's as any other band.
  var landing = null, loadedAt = 0;
  var keyed = root.getAttribute('data-gd-land');
  bands.forEach(function (b) { if (b.state === 'waiting') { if (b.key === keyed) landing = b; shown(b); } });
  var landed = function (b) {
    var r = b.h.getBoundingClientRect();
    return r.bottom > hh && r.top < window.innerHeight * LINE;
  };
  var restoring = function () {
    return opened === 'reload' && typeof kept.y === 'number' && Math.abs(window.scrollY - kept.y) > 2 && !(loadedAt && performance.now() - loadedAt > 1000);
  };
  var landOn = function () {
    var b = landing;
    if (!b || !started) return;
    if (b.state !== 'waiting' || !live()) { landing = null; if (b.state === 'waiting') still(b); return; }
    if (!landed(b)) {
      if (restoring()) return;
      landing = null;
      if (b.h.getBoundingClientRect().bottom <= hh) still(b);
      return;
    }
    landing = null;
    bands.forEach(function (o) { if (o !== b && (o.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING)) still(o); });
    measure();
    arrive(b);
  };
  window.addEventListener('load', function () {
    loadedAt = performance.now();
    setTimeout(function () { requestAnimationFrame(function () { paint(true); if (landing) landOn(); }); }, 1050);
  }, { once: true });

  // Watching: a band coming in from above (the reader went past it, and has come back), or in a leap, is there at
  // once; one coming up the screen arrives once its name is well up it.
  var waiting = function (b) { return b.state === 'waiting' && b !== landing; };
  var started = false;
  var start = function () {
    started = true;
    // (Come so late that the layout's script has given up on it and shown every band as it is: they stay so.)
    if (!live() || window.gdLate) { bands.forEach(still); landing = null; return; }
    var to = target(location.hash);
    bands.forEach(function (b) {
      if (b.state !== 'here') return;
      var past = to && (b.el.closest('.gd-part').contains(to) || (b.el.compareDocumentPosition(to) & Node.DOCUMENT_POSITION_FOLLOWING));
      if (landing && (b.el.compareDocumentPosition(landing.el) & Node.DOCUMENT_POSITION_FOLLOWING)) past = true;
      if (past || b.h.getBoundingClientRect().top < window.innerHeight * LINE) return;
      b.state = 'waiting';
      b.el.classList.add('is-waiting');
      shown(b);
    });
    landOn();
    var enter = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var b = byEl.get(e.target);
        if (e.isIntersecting && waiting(b) && (e.boundingClientRect.top < 0 || leaping())) still(b);
      });
    });
    var line = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var b = byEl.get(e.target);
        if (!e.isIntersecting || !waiting(b)) return;
        if (leaping() || e.boundingClientRect.bottom < 0) still(b); else arrive(b);
      });
    }, { rootMargin: '0px 0px -' + Math.round((1 - LINE) * 100) + '% 0px' });
    bands.forEach(function (b) { enter.observe(b.el); line.observe(b.h); });
  };
  var stillAll = function () { landing = null; bands.forEach(still); };
  on(reduce, function () { if (reduce.matches) stillAll(); });
  // On paper every band is simply there.
  window.addEventListener('beforeprint', stillAll);

  // Kept for the tab as the page is left, so a reload lands where the reader was: the region under the header (whose
  // copy the layout's script shows until the copies are placed), the band they were on, if one was in view (none at
  // the very top, where a reload plays the first screen's arrival, as the page opening does), and the scroll, which
  // the browser puts back (anywhere below the very top, the layout's script has the page simply there from the first
  // frame, since the browser would put it back under the arrival).
  window.addEventListener('pagehide', function () {
    var y = window.scrollY, b = y >= 1 ? bands.filter(function (o) { return landed(o); })[0] : null;
    try { sessionStorage.setItem(store, JSON.stringify({ at: under(y + hh / 2), land: b ? b.key : '', y: y })); } catch (e) { /* no storage: nothing kept */ }
  });

  // ------------------------------------------------------------ Setting it going

  var frame = 0;
  var onScroll = function () {
    track();
    if (frame) return;
    frame = requestAnimationFrame(function () { frame = 0; paint(); if (landing) landOn(); });
  };
  var relayout = function () {
    shortness();
    if (fx && window.gdFoot) window.gdFoot();
    reach();
    dotAll();
    lineUp();
    place();
    measure();
    paint(true);
  };
  // A resize that lays a band out anew (the window's width, or its height where the band's measures follow it)
  // finishes it at once if it's on its way, as its columns were made for the band as it was (the first screen's
  // arrival keeps its own watch, above). One that doesn't, as when a phone's browser hides or shows its bars as the
  // page scrolls, lets them go on.
  var resizing = 0;
  window.addEventListener('resize', function () {
    bands.forEach(function (b) {
      if (b.state !== 'arriving') return;
      var r = b.el.getBoundingClientRect();
      if (Math.abs(r.width - b.W) > 0.5 || Math.abs(r.height - b.H) > 0.5) still(b);
    });
    cancelAnimationFrame(resizing);
    resizing = requestAnimationFrame(relayout);
  });
  window.addEventListener('scroll', onScroll, { passive: true });
  relayout();
  // The first screen's arrival: the void held, or let go at once where it's not to play.
  arrival.start();
  // The title's face, loaded (the layout's script asks first, and sets .gd-type; a face that failed doesn't count).
  var face = window.gdFace ? window.gdFace() : Promise.resolve(false);
  var ready = document.fonts.ready;
  Promise.all([face, ready]).then(function (r) {
    if (r[0]) root.classList.add('gd-type');
    relayout();
    land();
    start();
  });
  window.addEventListener('load', function () { measure(); land(); paint(true); });
  // The page laid out again without the window changing (the fonts in, a larger text size): measured again, a frame
  // later, once.
  var settling = 0;
  new ResizeObserver(function () { cancelAnimationFrame(settling); settling = requestAnimationFrame(relayout); }).observe(doc);
  // Here, and set going: the layout's script, which draws a band to be landed on or to arrive in its plan before this
  // comes, needn't show it as it is after all.
  window.gdLive = true;
})();
