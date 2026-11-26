// Reveals the contact address only after a real user interaction, decoding it
// from an obfuscated payload. Until then, the HTML fallback (with CSS-hidden
// decoys) stays readable for screen readers and visitors without JavaScript.
(function () {
  "use strict";

  var payload = "4x.51.3d.2h.4i.4o.3s.3i.44.4c.3n.2t.34.3e.36.3s.35.2p.35.37";
  var key = [23, 7, 41, 13, 31];
  var events = ["pointerdown", "pointermove", "touchstart", "keydown", "focusin"];
  var done = false;

  function decode(s) {
    return s.split(".").reverse().map(function (part, i) {
      return String.fromCharCode((parseInt(part, 36) - i * 3) ^ key[i % key.length]);
    }).join("");
  }

  function reveal() {
    if (done) return;
    done = true;
    events.forEach(function (type) {
      window.removeEventListener(type, reveal, true);
    });

    var address = decode(payload);
    document.querySelectorAll("[data-contact]").forEach(function (el) {
      var link = document.createElement("a");
      link.href = "mailto:" + address;
      link.textContent = address;
      el.replaceWith(link);
    });
  }

  events.forEach(function (type) {
    window.addEventListener(type, reveal, { capture: true, passive: true });
  });
})();
