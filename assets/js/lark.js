// Lark's exhibit (exhibits/lark.html): the covered sentence (covered.html) and Practice. Runs on the home
// page (index.html's scripts:), after site.js.
(function (TB) {
  'use strict';
  if (!TB) return;

  // Shows a toggle now that it works, in a place as wide as its longest label (lark.css).
  var ready = function (button, labels) {
    var place = button.closest('.covered__control') || button;
    place.setAttribute('data-labels', labels.join('\n'));
    place.classList.add('is-ready');
  };

  // Covered sentences: covered during "your turn", shown by the toggle (or a click on the bars). The
  // toggle's label says what it will do: "Show the sentence", then "Cover the sentence". Covered, the
  // line is only bars, so screen readers get the caption and the toggle instead.
  var covers = [];
  document.querySelectorAll('[data-covered]').forEach(function (figure) {
    var button = figure.querySelector('.covered__toggle');
    var line = figure.querySelector('.covered__line');
    if (!button || !line) return;
    var labels = { show: button.textContent, cover: button.getAttribute('data-shown-label') || button.textContent };
    var cover = {
      figure: figure,
      shown: false,
      // The line shown or covered, as Practice's phases want; the toggle stays as it is.
      set: function (shown) {
        figure.classList.toggle('is-covered', !shown);
        if (shown) line.removeAttribute('aria-hidden'); else line.setAttribute('aria-hidden', 'true');
      },
      // The reader's own choice, which the toggle shows.
      choose: function (shown) {
        cover.shown = shown;
        cover.set(shown);
        button.textContent = shown ? labels.cover : labels.show;
        button.classList.toggle('is-on', shown);
      },
      interrupt: function () {}   // set by Practice: a press mid-turn puts it back at rest first
    };
    var press = function (shown) { cover.interrupt(); cover.choose(shown); };
    button.addEventListener('click', function () { press(!cover.shown); });
    line.addEventListener('click', function () { if (figure.classList.contains('is-covered')) press(true); });
    // Covered at once, without the fade, even when this script comes late.
    figure.classList.add('is-still');
    cover.choose(false);
    requestAnimationFrame(function () { requestAnimationFrame(function () { figure.classList.remove('is-still'); }); });
    ready(button, [labels.show, labels.cover]);
    covers.push(cover);
  });

  // Practice: one silent turn of Lark's drill, at its defaults, on a sentence of 2 seconds: "Listen", shown;
  // "Your turn", covered, 1.7 times as long; "Listen" again. Each phase is a run of the rhythm, --n squares
  // of 0.2 s, lit as they pass, or whole under reduced motion (read every frame). It pauses itself out of
  // sight or hidden, and Escape or the sentence's toggle puts it back at rest.
  var turn = document.querySelector('[data-turn]');
  var start = turn && turn.querySelector('[data-practice]');
  var cover = turn && covers.filter(function (c) { return turn.contains(c.figure); })[0];
  var runs = turn ? Array.prototype.slice.call(turn.querySelectorAll('.rhythm__run')) : [];
  var word = cover && cover.figure.querySelector('.covered__turn [data-phase]');
  var bit = cover && cover.figure.querySelector('.covered__turn .bit');
  var status = turn && turn.querySelector('[data-turn-status]');
  if (!start || !cover || !runs.length || !word || !bit || !status) return;

  var SQUARE = 200;   // ms
  var phases = runs.map(function (run) {
    var yours = run.classList.contains('rhythm__run--turn');
    var n = parseInt(run.style.getPropertyValue('--n'), 10) || 0;
    return { n: n, ms: n * SQUARE, shown: !yours, words: yours ? 'Your turn' : 'Listen' };
  });
  var restWords = word.textContent;
  var labels = { practice: start.textContent, pause: 'Pause', resume: 'Resume' };
  var thresholds = [];
  for (var step = 0; step <= 20; step++) thresholds.push(step / 20);

  var state = 'rest';   // rest, running, paused, or done (the 600 ms after a turn, before rest)
  var elapsed = 0;      // ms of the turn, counted only while it runs
  var last = 0;
  var phase = -1;
  var lit = [];         // each run's --k
  var frame = 0, saying = 0, resting = 0;
  var unwatch = function () {};

  // Said through the turn's own status line, emptied first, so that "Listen." said again is said again.
  var say = function (text) {
    cancelAnimationFrame(saying);
    status.textContent = '';
    saying = requestAnimationFrame(function () { status.textContent = text; });
  };
  var label = function (text, on) { start.textContent = text; start.classList.toggle('is-on', on); };
  var caption = function (text, filled) { word.textContent = text; bit.classList.toggle('bit--hollow', !filled); };
  var activate = function (i) { runs.forEach(function (run, j) { run.classList.toggle('is-active', j === i); }); };
  var light = function (i, k) {
    if (lit[i] === k) return;
    lit[i] = k;
    if (k) runs[i].style.setProperty('--k', k); else runs[i].style.removeProperty('--k');
  };

  // The turn at `elapsed`: its phase, and how many squares of each run have come.
  var paint = function () {
    var t = elapsed, i = 0;
    while (i < phases.length && t >= phases[i].ms) { t -= phases[i].ms; i++; }
    if (i === phases.length) return finish();
    if (i !== phase) {
      phase = i;
      caption(phases[i].words, phases[i].shown);
      cover.set(phases[i].shown);
      activate(i);
      say(phases[i].words + '.');
    }
    phases.forEach(function (p, j) {
      light(j, j < i ? p.n : j > i ? 0 : TB.reduce ? p.n : Math.min(p.n, Math.floor(t / SQUARE) + 1));
    });
  };
  // The one loop, only while running. A frame adds at most 250 ms, so a page the browser stopped drawing
  // doesn't come back with its turn gone.
  var tick = function () {
    var now = performance.now();
    elapsed += Math.min(Math.max(0, now - last), 250);
    last = now;
    paint();
    if (state === 'running') frame = requestAnimationFrame(tick);
  };
  var go = function () {
    state = 'running';
    last = performance.now();
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(tick);
    label(labels.pause, true);
    watch();
  };
  var halt = function () {
    cancelAnimationFrame(frame);
    unwatch();
    unwatch = function () {};
  };
  // Out of sight, with under 30% of the turn on screen (or of the screen, if the turn is taller), it pauses.
  var watch = function () {
    unwatch();
    unwatch = TB.inView(turn, function (entry) {
      var box = entry.boundingClientRect, seen = entry.intersectionRect;
      var ratio = box && seen ? seen.height / Math.max(1, Math.min(box.height, window.innerHeight)) : entry.intersectionRatio;
      if (ratio < 0.3) pause();
    }, { threshold: thresholds });
  };

  var begin = function () {
    clearTimeout(resting);
    cover.choose(false);   // the line is Practice's now, and covered again at the end
    elapsed = 0;
    phase = -1;
    turn.classList.add('is-running');
    paint();
    go();
  };
  var pause = function () {
    if (state !== 'running') return;
    halt();
    state = 'paused';
    label(labels.resume, false);
  };
  // The end: covered again, "Finished.", the runs lit to the end, and 600 ms later at rest.
  var finish = function () {
    halt();
    state = 'done';
    phases.forEach(function (p, j) { light(j, p.n); });
    activate(-1);
    cover.set(false);
    caption(restWords, false);
    label(labels.practice, false);
    say('Finished.');
    resting = setTimeout(reset, 600);
  };
  var reset = function () {
    halt();
    clearTimeout(resting);
    state = 'rest';
    elapsed = 0;
    phase = -1;
    turn.classList.remove('is-running');
    phases.forEach(function (p, j) { light(j, 0); });
    activate(-1);
    caption(restWords, false);
    cover.set(cover.shown);
    label(labels.practice, false);
  };

  start.addEventListener('click', function () {
    if (state === 'running') pause();
    else if (state === 'paused') go();
    else begin();
  });
  cover.interrupt = function () { if (state !== 'rest') reset(); };
  turn.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && state !== 'rest') reset();
  });
  document.addEventListener('visibilitychange', function () { if (document.hidden) pause(); });
  // Back from the back/forward cache: at rest.
  window.addEventListener('pageshow', function (event) { if (event.persisted && state !== 'rest') reset(); });

  ready(start, [labels.practice, labels.pause, labels.resume]);
})(window.TB);
