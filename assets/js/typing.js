// Home-page hero demo: a small text field above the static heading, where
// someone types a phrase, an autocomplete suggestion appears as ghost text,
// and they "tab" to accept it. Every phrase keeps the W-I-T-S initials.
(function () {
  "use strict";

  var root = document.querySelector(".typing");
  if (!root) return;

  var PHRASES = [
    "Workers, Imagination, and Thinking Skills",
    "Writing, Inquiry, and Thinking Skills",
    "Work, Intellect, and Tacit Skill",
    "Wisdom, Insight, and Thoughtful Software",
    "Workflows, Interfaces, and Thinking Support",
    "Wisdom, Intuition, and Trustworthy Systems",
    "Workers, Intelligence, and Tool Stewardship",
    "Work, Insight, and Thinking Strategies",
    "Writing, Imagination, and Thoughtful Software",
    "Work, Ingenuity, and Tacit Skills",
    "Workplaces, Intelligence, and Team Science",
    "Wonder, Imagination, and Thinking Spaces",
    "Work, Inquiry, and Team Sensemaking",
    "Workers, Intention, and Thoughtful Systems",
    "Writers, Inspiration, and Thinking Spaces"
  ];
  var CANONICAL = "Work, Intelligence, and Thought Science";
  var RESTING_TYPED = "Work, Intelligence, and ";

  var live = root.querySelector(".typing-live");
  var sizer = root.querySelector(".typing-sizer");
  var typedEl = live.querySelector(".typed");
  var ghostEl = live.querySelector(".suggestion");
  var caretEl = live.querySelector(".caret");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  var run = 0;          // bumping this cancels the current loop
  var onScreen = true;
  var wake = null;

  function pick(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function between(min, max) {
    return min + Math.random() * (max - min);
  }

  // Positions of the W, I, T and S that start each word (skipping "and").
  function initials(text) {
    var keys = {};
    var re = /\S+/g;
    var m;
    while ((m = re.exec(text))) {
      if (m[0] !== "and") keys[m.index] = true;
    }
    return keys;
  }

  function charSpan(ch, cls, delay) {
    var s = document.createElement("span");
    s.className = cls ? "ch " + cls : "ch";
    s.textContent = ch;
    if (delay) s.style.animationDelay = delay + "ms";
    return s;
  }

  function spans(text, cls, offset, keys, stagger) {
    var frag = document.createDocumentFragment();
    for (var i = 0; i < text.length; i++) {
      var c = cls;
      if (keys && keys[offset + i]) c = (c ? c + " " : "") + "ch-key";
      frag.appendChild(charSpan(text[i], c, stagger ? i * stagger : 0));
    }
    return frag;
  }

  // Size the field to the longest phrase so it never changes size.
  (function sizeToLongest() {
    var longest = PHRASES.concat(CANONICAL).reduce(function (a, b) {
      return b.length > a.length ? b : a;
    });
    sizer.textContent = longest;
    var caret = document.createElement("span");
    caret.className = "caret";
    sizer.appendChild(caret);
    root.style.setProperty("--chars", String(longest.length + 1));
  })();

  function rest() {
    root.classList.remove("is-typing", "is-selected");
    typedEl.replaceChildren(spans(RESTING_TYPED));
    ghostEl.replaceChildren(spans(CANONICAL.slice(RESTING_TYPED.length)));
    follow();
  }

  function setTyping(on) {
    root.classList.toggle("is-typing", on);
  }

  function liveChars() {
    return typedEl.querySelectorAll(".ch");
  }

  function typeChar(text, i, keys) {
    typedEl.appendChild(charSpan(text[i], keys[i] ? "ch-key" : ""));
    if (ghostEl.firstChild) ghostEl.firstChild.remove();
  }

  function showGhost(text, from) {
    ghostEl.replaceChildren(spans(text.slice(from), "gh-in", 0, null, 14));
  }

  function accept(text, from, keys) {
    typedEl.appendChild(spans(text.slice(from), "ch-accept", from, keys, 8));
    ghostEl.replaceChildren();
    caretEl.classList.remove("caret-bump");
    void caretEl.offsetWidth; // restart the animation
    caretEl.classList.add("caret-bump");
  }

  // Keystrokes and deletions are instant, like a real editor.
  function backspace() {
    var chars = liveChars();
    if (chars.length) chars[chars.length - 1].remove();
  }

  function clearAll() {
    typedEl.replaceChildren();
  }

  // Resolves after `ms`, counting only while the hero is visible.
  // Rejects if the loop has been cancelled.
  function sleep(ms, id) {
    follow();
    return new Promise(function (resolve, reject) {
      function tick() {
        if (id !== run) return reject();
        if (!onScreen || document.hidden) {
          wake = tick;
          return;
        }
        setTimeout(function () {
          if (id !== run) return reject();
          if (!onScreen || document.hidden) {
            wake = tick;
            return;
          }
          resolve();
        }, ms);
      }
      tick();
    });
  }

  function resume() {
    var w = wake;
    wake = null;
    if (w) w();
  }

  // Like a real text box: if the text outgrows the field (narrow screens),
  // scroll it so the caret stays in view.
  function follow() {
    var cs = getComputedStyle(root);
    var inner = root.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    var caretRight = caretEl.offsetLeft + caretEl.offsetWidth;
    var shift = Math.max(0, caretRight - inner + 2);
    live.style.transform = shift ? "translateX(" + -shift + "px)" : "";
  }

  function keyDelay(ch) {
    if (ch === "," || ch === " ") return between(90, 220);
    return Math.random() < 0.08 ? between(180, 320) : between(55, 125);
  }

  async function erase(id) {
    await sleep(between(2200, 3200), id);
    if (Math.random() < 0.4) {
      // Select all, then delete in one go.
      root.classList.add("is-selected");
      await sleep(between(450, 700), id);
      root.classList.remove("is-selected");
      clearAll();
      await sleep(250, id);
    } else {
      setTyping(true);
      while (liveChars().length) {
        backspace();
        await sleep(between(22, 42), id);
      }
      setTyping(false);
    }
    await sleep(between(400, 700), id);
  }

  async function cycle(text, id) {
    var keys = initials(text);
    // The suggestion appears at a word boundary after the first word, and is
    // accepted somewhere between then and the start of the last word.
    var boundaries = [];
    for (var i = 1; i < text.length; i++) {
      if (text[i - 1] === " ") boundaries.push(i);
    }
    var suggestAt = pick(boundaries.slice(0, -1));
    var tabAt = Math.round(between(suggestAt, boundaries[boundaries.length - 1]));

    setTyping(true);
    for (var n = 0; n < text.length; n++) {
      if (n === suggestAt) {
        showGhost(text, n);
        setTyping(false);
        await sleep(between(550, 1000), id);
        setTyping(true);
      }
      if (n === tabAt) {
        setTyping(false);
        await sleep(between(250, 600), id);
        accept(text, n, keys);
        break;
      }
      typeChar(text, n, keys);
      await sleep(keyDelay(text[n]), id);
    }
    setTyping(false);
    await erase(id);
  }

  async function loop(id) {
    try {
      // Start from the resting state and accept its suggestion.
      rest();
      await sleep(1600, id);
      accept(CANONICAL, RESTING_TYPED.length, initials(CANONICAL));
      await erase(id);

      var queue = [];
      var prev = "";
      for (;;) {
        if (!queue.length) {
          queue = PHRASES.slice().sort(function () { return Math.random() - 0.5; });
          if (queue[0] === prev) queue.push(queue.shift());
        }
        prev = queue.shift();
        await cycle(prev, id);
      }
    } catch (e) {
      // Cancelled.
    }
  }

  function start() {
    run++;
    wake = null;
    loop(run);
  }

  function stop() {
    run++;
    wake = null;
    rest();
  }

  function applyMotionPreference() {
    if (reduceMotion.matches) stop();
    else start();
  }

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      onScreen = entries[0].isIntersecting;
      if (onScreen) resume();
    }).observe(root);
  }
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) resume();
  });
  if (reduceMotion.addEventListener) {
    reduceMotion.addEventListener("change", applyMotionPreference);
  }

  applyMotionPreference();
})();
