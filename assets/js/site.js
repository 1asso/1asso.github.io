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
  //    The toggle's label says what it will do: "Show the sentence", then "Cover the sentence".
  document.querySelectorAll('[data-covered]').forEach(function (figure) {
    var button = figure.querySelector('.covered__toggle');
    var line = figure.querySelector('.covered__line');
    if (!button || !line) return;
    var showLabel = button.textContent;
    var coverLabel = button.getAttribute('data-shown-label') || showLabel;
    var show = function (shown) {
      figure.classList.toggle('is-covered', !shown);
      button.textContent = shown ? coverLabel : showLabel;
      // Covered, the line is only bars: screen readers get the caption and the button instead.
      if (shown) line.removeAttribute('aria-hidden'); else line.setAttribute('aria-hidden', 'true');
    };
    show(false);
    button.hidden = false;
    button.addEventListener('click', function () {
      show(figure.classList.contains('is-covered'));
    });
    line.addEventListener('click', function () {
      if (figure.classList.contains('is-covered')) show(true);
    });
  });

  // 3. Michi's album, two shelves of it, Upcoming and Postmarked. A press on a stamp postmarks it and files
  //    it first on Postmarked, or takes its postmark off and files it back on Upcoming. A stamp dragged
  //    along its shelf is picked up and held over the page, the stamps it passes making way, then pressed
  //    into its new place, as in Michi; dragged onto the other shelf, it's postmarked as it's set down
  //    there, or has its postmark taken off. A drag sideways picks it up, or one that rests on it a moment
  //    first; a drag up or down at once scrolls the page (a mouse picks it up whichever way it goes). From
  //    the keyboard, Enter or Space is a press, and Alt with the left and right arrows moves a stamp along
  //    its shelf, with up and down onto the other one. The order isn't kept.
  document.querySelectorAll('[data-album]').forEach(function (album) {
    var shelves = Array.prototype.slice.call(album.querySelectorAll('[data-shelf]'));
    var status = album.querySelector('[data-album-status]');
    var keys = album.querySelector('#album-keys');
    var listOf = function (shelf) { return shelf.querySelector('.album__stamps'); };
    var shelfOf = function (stamp) { return stamp.closest('[data-shelf]'); };
    var postmarking = function (shelf) { return shelf.getAttribute('data-shelf') === 'postmarked'; };
    var stampsIn = function (list) { return Array.prototype.slice.call(list.querySelectorAll('.album__stamp')); };
    var everyStamp = function () { return Array.prototype.slice.call(album.querySelectorAll('.album__stamp')); };
    var say = function (text) { if (status) status.textContent = text; };
    var name = function (stamp) { return stamp.getAttribute('data-name'); };
    var place = function (stamp) {
      var all = stampsIn(stamp.parentNode);
      return (all.indexOf(stamp) + 1) + ' of ' + all.length;
    };
    var describe = function (stamp) {
      stamp.setAttribute('aria-label', stamp.getAttribute('data-label') + (stamp.classList.contains('is-postmarked') ? ', postmarked' : ''));
    };
    // Each shelf is as wide as its stamps; an empty one keeps a place, and a stamp's height, to be dropped on.
    var tidy = function () {
      var slots = 0;
      shelves.forEach(function (shelf) {
        var count = stampsIn(listOf(shelf)).length;
        shelf.classList.toggle('is-empty', !count);
        shelf.style.setProperty('--count', Math.max(1, count));
        slots += Math.max(1, count);
      });
      album.style.setProperty('--slots', slots);
      var first = album.querySelector('.album__stamp');
      if (first) album.style.setProperty('--stamp-height', first.offsetHeight + 'px');
    };
    var replay = function (stamp, kind) {
      stamp.classList.remove('is-lifted', 'is-pressed', 'is-striking');
      void stamp.offsetWidth;   // so the animation plays every time
      stamp.classList.add(kind);
    };
    // Postmarked on the Postmarked shelf, not on Upcoming: the postmark comes down as the stamp is set there.
    var settle = function (stamp) {
      var postmarked = postmarking(shelfOf(stamp));
      var changed = stamp.classList.contains('is-postmarked') !== postmarked;
      stamp.classList.toggle('is-postmarked', postmarked);
      describe(stamp);
      replay(stamp, changed && postmarked ? 'is-striking' : 'is-pressed');
      return changed;
    };

    // Moves stamps in the DOM, then slides each from where it was to where it is.
    var slide = function (sliding, change) {
      var before = sliding.map(function (s) { return s.getBoundingClientRect(); });
      change();
      tidy();
      if (reduce) return;
      sliding.forEach(function (s, n) {
        s.style.transition = 'none';
        s.style.translate = 'none';
        var after = s.getBoundingClientRect();
        s.style.translate = (before[n].left - after.left) + 'px ' + (before[n].top - after.top) + 'px';
      });
      void album.offsetWidth;
      sliding.forEach(function (s) {
        s.style.transition = 'translate 320ms cubic-bezier(0.2, 0.7, 0.2, 1)';
        s.style.translate = 'none';
      });
    };
    // Along its shelf, by moving the stamps between, so the one held keeps its pointer capture and focus.
    var along = function (stamp, index, withIt) {
      var list = stamp.parentNode;
      var all = stampsIn(list);
      var from = all.indexOf(stamp);
      if (index === from || index < 0 || index >= all.length) return;
      slide(everyStamp().filter(function (s) { return withIt || s !== stamp; }), function () {
        var i;
        if (index > from) for (i = from + 1; i <= index; i++) list.insertBefore(all[i], stamp);
        else for (i = index; i < from; i++) list.insertBefore(all[i], stamp.nextSibling);
      });
    };
    // Onto the other shelf, at a place on it.
    var onto = function (stamp, shelf, index, withIt) {
      var list = listOf(shelf);
      var all = stampsIn(list);
      var focused = document.activeElement === stamp;
      slide(everyStamp().filter(function (s) { return withIt || s !== stamp; }), function () {
        list.insertBefore(stamp, all[index] || null);
      });
      if (focused) stamp.focus();
    };

    // Where a point (the held stamp's middle) falls: the shelf, and the place on it.
    var target = function (stamp, x, y) {
      var shelf = shelves.reduce(function (best, s) {
        var r = listOf(s).getBoundingClientRect();
        var dx = x < r.left ? r.left - x : x > r.right ? x - r.right : 0;
        var dy = y < r.top ? r.top - y : y > r.bottom ? y - r.bottom : 0;
        var d = dx * dx + dy * dy;
        return !best || d < best.d ? { shelf: s, d: d } : best;
      }, null).shelf;
      var list = listOf(shelf);
      var box = list.getBoundingClientRect();
      var all = stampsIn(list);
      var same = shelf === shelfOf(stamp);
      var index = 0;
      var bestDistance = Infinity;
      all.forEach(function (s, i) {
        var cx = box.left + s.offsetLeft + s.offsetWidth / 2;
        var cy = box.top + s.offsetTop + s.offsetHeight / 2;
        var d = Math.pow(cx - x, 2) + Math.pow(cy - y, 2);
        if (d < bestDistance) { bestDistance = d; index = !same && x > cx ? i + 1 : i; }
      });
      return { shelf: shelf, index: index, same: same };
    };

    // A press: the postmark comes down (or goes), then the stamp is filed first on the other shelf.
    var filing = null;
    var press = function (stamp) {
      if (filing) return;
      var to = shelves.filter(function (s) { return s !== shelfOf(stamp); })[0];
      var postmarked = postmarking(to);
      stamp.classList.toggle('is-postmarked', postmarked);
      describe(stamp);
      replay(stamp, postmarked ? 'is-striking' : 'is-pressed');
      filing = setTimeout(function () {
        filing = null;
        onto(stamp, to, 0, true);
        say(name(stamp) + (postmarked ? ', postmarked, now on Postmarked, ' : ', postmark taken off, now on Upcoming, ') + place(stamp) + '.');
      }, reduce ? 0 : postmarked ? 380 : 240);
    };

    var drag = null;      // the stamp held, where it was picked up and where its shelf was then
    var pending = null;   // a press on a stamp that hasn't become a drag (yet)
    var held = null;      // the timer of a press resting on a stamp
    var dragged = false;  // a drag just ended, so the click that ends it isn't a press

    var lift = function (stamp, event) {
      clearTimeout(held);
      var r = stamp.getBoundingClientRect();
      drag = { stamp: stamp, id: event.pointerId, dx: event.clientX - r.left, dy: event.clientY - r.top, shelf: shelfOf(stamp), from: stampsIn(stamp.parentNode).indexOf(stamp) };
      pending = null;
      dragged = true;
      try { stamp.setPointerCapture(event.pointerId); } catch (e) { /* the window still hears it */ }
      // Stacked (on narrower screens), a shelf a stamp leaves would close up under the finger, and the
      // shelf below it jump: while a stamp is held, no shelf gets shorter.
      shelves.forEach(function (s) { listOf(s).style.minHeight = listOf(s).offsetHeight + 'px'; });
      stamp.style.transition = 'none';
      stamp.classList.remove('is-pressed', 'is-striking');
      stamp.classList.add('is-lifted');
    };
    var follow = function (event) {
      var stamp = drag.stamp;
      var left = event.clientX - drag.dx;
      var top = event.clientY - drag.dy;
      var to = target(stamp, left + stamp.offsetWidth / 2, top + stamp.offsetHeight / 2);
      if (to.same) {
        if (to.index !== stampsIn(stamp.parentNode).indexOf(stamp)) along(stamp, to.index);
      } else {
        onto(stamp, to.shelf, to.index);
        try { stamp.setPointerCapture(drag.id); } catch (e) { /* the window still hears it */ }
      }
      var box = stamp.parentNode.getBoundingClientRect();
      stamp.style.translate = (left - box.left - stamp.offsetLeft) + 'px ' + (top - box.top - stamp.offsetTop) + 'px';
    };
    var setDown = function () {
      var stamp = drag.stamp;
      var moved = shelfOf(stamp) !== drag.shelf || stampsIn(stamp.parentNode).indexOf(stamp) !== drag.from;
      drag = null;
      slide(everyStamp().filter(function (s) { return s !== stamp; }), function () {
        shelves.forEach(function (s) { listOf(s).style.minHeight = ''; });
      });
      stamp.style.transition = reduce ? 'none' : 'translate 260ms cubic-bezier(0.2, 0.7, 0.2, 1)';
      stamp.style.translate = 'none';
      var changed = settle(stamp);
      if (changed) say(name(stamp) + (stamp.classList.contains('is-postmarked') ? ', postmarked, ' : ', postmark taken off, now upcoming, ') + place(stamp) + '.');
      else if (moved) say(name(stamp) + ', moved to ' + place(stamp) + '.');
    };

    window.addEventListener('pointermove', function (event) {
      if (drag && drag.id === event.pointerId) { follow(event); return; }
      if (!pending || pending.id !== event.pointerId) return;
      var dx = Math.abs(event.clientX - pending.x);
      var dy = Math.abs(event.clientY - pending.y);
      if (dx < 6 && dy < 6) return;
      if (event.pointerType === 'mouse' || dx > dy) { lift(pending.stamp, pending.event); follow(event); }
      else { clearTimeout(held); pending = null; }   // up or down: the page scrolls
    });
    ['pointerup', 'pointercancel'].forEach(function (type) {
      window.addEventListener(type, function (event) {
        if (pending && pending.id === event.pointerId) { clearTimeout(held); pending = null; }
        if (drag && drag.id === event.pointerId) setDown();
      });
    });

    everyStamp().forEach(function (stamp) {
      stamp.tabIndex = 0;
      if (keys) stamp.setAttribute('aria-describedby', keys.id);
      describe(stamp);
      stamp.addEventListener('pointerdown', function (event) {
        if (drag || (event.pointerType === 'mouse' && event.button !== 0)) return;
        if (event.pointerType === 'mouse') event.preventDefault();   // no text selection while it's dragged
        dragged = false;
        pending = { stamp: stamp, event: event, id: event.pointerId, x: event.clientX, y: event.clientY };
        clearTimeout(held);
        held = setTimeout(function () { if (pending && pending.stamp === stamp) lift(stamp, pending.event); }, 300);
      });
      stamp.addEventListener('contextmenu', function (event) { event.preventDefault(); });
      stamp.addEventListener('click', function () {
        if (dragged) { dragged = false; return; }
        if (!drag) press(stamp);
      });
      stamp.addEventListener('keydown', function (event) {
        if ((event.key === 'Enter' || event.key === ' ') && !event.altKey) {
          event.preventDefault();
          press(stamp);
          return;
        }
        if (!event.altKey || !/^Arrow/.test(event.key)) return;
        event.preventDefault();
        var shelf = shelfOf(stamp);
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          along(stamp, stampsIn(stamp.parentNode).indexOf(stamp) + (event.key === 'ArrowLeft' ? -1 : 1), true);
          replay(stamp, 'is-pressed');
          say(name(stamp) + ', ' + place(stamp) + '.');
          return;
        }
        var other = shelves[(shelves.indexOf(shelf) + (event.key === 'ArrowUp' ? -1 : 1) + shelves.length) % shelves.length];
        if (other === shelf || (event.key === 'ArrowUp') !== (shelves.indexOf(other) < shelves.indexOf(shelf))) return;
        onto(stamp, other, 0, true);
        settle(stamp);
        say(name(stamp) + (stamp.classList.contains('is-postmarked') ? ', postmarked, ' : ', postmark taken off, now upcoming, ') + place(stamp) + '.');
      });
    });

    // Once a stamp is held, a finger moving it moves only it: the page stays where it is.
    album.addEventListener('touchmove', function (event) { if (drag) event.preventDefault(); }, { passive: false });
    tidy();
    // A stamp's height, which an empty shelf keeps, changes with the window's width.
    if ('ResizeObserver' in window) new ResizeObserver(function () { if (!drag) tidy(); }).observe(album);
  });
})();
