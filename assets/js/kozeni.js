// Kozeni's exhibit: its keypad (_includes/exhibits/kozeni.html), taking an amount by Kozeni's own rules
// and showing it as Kozeni does. Runs on the home page (index.html's scripts:), after site.js.
(function (TB) {
  'use strict';
  if (!TB) return;

  var pad = document.querySelector('[data-keypad]');
  var amount = pad && pad.querySelector('[data-amount]');
  var figure = amount && amount.firstElementChild;
  var status = pad && pad.querySelector('[data-amount-status]');
  var keys = pad && pad.querySelector('[data-keys]');
  if (!figure || !status || !keys) return;

  // The amount as Kozeni keeps it while you type: a string, "0" to start.
  var input = '0';

  // ExpenseEditorView.handleKey, rule for rule: a digit is refused once the whole part has 12 digits
  // (even after a ".") or the decimals 2, and replaces a lone "0"; "." goes on once; delete leaves "0"
  // rather than nothing; a held delete is "clear".
  var handle = function (value) {
    var dot = input.indexOf('.');
    var whole = dot < 0 ? input.length : dot;
    var decimals = dot < 0 ? 0 : input.length - dot - 1;
    if (value === 'delete') {
      input = input.length <= 1 ? '0' : input.slice(0, -1);
      if (input === '-' || input === '') input = '0';
    } else if (value === 'clear') {
      input = '0';
    } else if (value === '.') {
      if (dot < 0) input += '.';
    } else if (/^[0-9]$/.test(value) && whole < 12 && decimals < 2) {
      input = input === '0' ? value : input + value;
    }
  };

  // Its formattedAmount (addGroupingToAmount). Kozeni's symbol and grouping are the device region's;
  // this page is in US English, so "$" and ",".
  var formatted = function () {
    var dot = input.indexOf('.');
    var whole = String(Number(dot < 0 ? input : input.slice(0, dot)));
    return '$' + whole.replace(/\B(?=(\d{3})+$)/g, ',') + (dot < 0 ? '' : input.slice(dot));
  };

  // Fits the amount to its column, never under half: one measurement, one write.
  var fit = 1;
  var refit = function () {
    var width = figure.getBoundingClientRect().width;
    if (!width) return;   // not laid out
    var next = Math.max(0.5, Math.min(1, Math.floor((amount.clientWidth * fit / width) * 1000) / 1000));
    if (next !== fit) amount.style.setProperty('--fit', fit = next);
  };

  // Said once the keys rest for 400ms (emptied first, so a repeat is said too).
  var telling = 0;
  var show = function () {
    var text = formatted();
    if (figure.textContent !== text) {
      figure.textContent = text;
      refit();
    }
    clearTimeout(telling);
    telling = setTimeout(function () {
      status.textContent = '';
      requestAnimationFrame(function () { status.textContent = text; });
    }, 400);
  };

  // The picture becomes buttons, named by data-label or text, in a group.
  keys.querySelectorAll('.key').forEach(function (span) {
    var key = document.createElement('button');
    key.type = 'button';
    key.className = span.className;
    key.dataset.key = span.dataset.key;
    ['label', 'describedby'].forEach(function (name) {
      if (span.dataset[name]) key.setAttribute('aria-' + name, span.dataset[name]);
    });
    while (span.firstChild) key.appendChild(span.firstChild);
    span.replaceWith(key);
  });
  keys.setAttribute('role', 'group');
  keys.setAttribute('aria-label', keys.dataset.label || 'Keypad');
  keys.removeAttribute('aria-hidden');
  var description = pad.querySelector('[data-nojs-description]');
  if (description) description.remove();

  // Pressed while it's held (kozeni.css keeps it so 120ms more); by Enter, Space or typing, a flash. A finger's (or a
  // pen's) press is shown only once it's clearly a tap, held still TAP ms or let go within its reach, as a scroll view
  // on iPhone holds its touches back: a swipe that starts on the keypad is the page's, and presses nothing.
  var press = function (key, on) { key.classList.toggle('is-pressed', on); };
  var flash = function (key) {
    press(key, true);
    getComputedStyle(key).backgroundColor;   // so that letting go is a change
    press(key, false);
  };
  var TAP = 70, REACH = 10;
  var touched = null, showing = 0;   // a finger's key, and where it went down, while its press is still to be shown
  var untouch = function () { clearTimeout(showing); touched = null; };

  // Holding delete for 400ms clears, as Kozeni's LongPressGesture(minimumDuration: 0.4), and the tap that
  // ends the hold is ignored (ignoreNextTap). Moving over 10px first (its reach), or scrolling, is no hold.
  var holding = 0;
  var from = null;
  var ignoreNextTap = false;
  var letGo = function () { clearTimeout(holding); from = null; };
  keys.addEventListener('pointerdown', function (event) {
    var key = event.target.closest('.key');
    if (!key || event.button !== 0) return;
    ignoreNextTap = false;
    untouch();
    if (event.pointerType === 'mouse') press(key, true);
    else {
      touched = { key: key, x: event.clientX, y: event.clientY };
      showing = setTimeout(function () { if (touched) press(touched.key, true); touched = null; }, TAP);
    }
    if (key.dataset.key !== 'delete') return;
    letGo();
    from = [event.clientX, event.clientY];
    holding = setTimeout(function () {
      from = null;
      ignoreNextTap = true;
      handle('clear');
      show();
    }, 400);
  });
  keys.addEventListener('pointermove', function (event) {
    if (touched && Math.hypot(event.clientX - touched.x, event.clientY - touched.y) > REACH) untouch();
    if (from && Math.hypot(event.clientX - from[0], event.clientY - from[1]) > REACH) letGo();
  });
  // pointerleave doesn't bubble, so it's caught on its way down.
  // A tap let go before its press was shown is shown as it ends (and kept a moment, as any press is).
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (type) {
    keys.addEventListener(type, function (event) {
      var key = event.target.closest('.key');
      if (type === 'pointerleave' && event.target !== key) return;
      if (type === 'pointerup' && touched && touched.key === key) flash(key);
      untouch();
      if (key) press(key, false);
      letGo();
    }, type === 'pointerleave');
  });
  // A long touch is a hold, not a menu.
  keys.addEventListener('contextmenu', function (event) {
    if (event.target.closest('.is-pressed')) event.preventDefault();
  });

  keys.addEventListener('click', function (event) {
    var key = event.target.closest('.key');
    if (!key) return;
    // Safari and Firefox don't focus a clicked button; focused, it takes typed keys too.
    if (!pad.contains(document.activeElement)) key.focus({ preventScroll: true });
    if (key.dataset.key === 'delete' && ignoreNextTap) {
      ignoreNextTap = false;
      return;
    }
    if (!event.detail) flash(key);
    handle(key.dataset.key);
    show();
  });

  // Typed in the keypad: digits, "." or "," (a decimal key may be either), Backspace or Delete.
  var typed = { '.': '.', ',': '.', Backspace: 'delete', Delete: 'delete' };
  pad.addEventListener('keydown', function (event) {
    ignoreNextTap = false;
    var value = /^[0-9]$/.test(event.key) ? event.key : typed[event.key];
    if (!value || event.ctrlKey || event.metaKey || event.altKey) return;
    event.preventDefault();
    flash(keys.querySelector('[data-key="' + value + '"]'));
    handle(value);
    show();
  });

  // Refitted when its column changes size.
  if (window.ResizeObserver) new ResizeObserver(refit).observe(amount);

  pad.querySelectorAll('[data-js-only]').forEach(function (el) { el.classList.add('is-ready'); });
})(window.TB);
