// Collapsible navigation for narrow screens. Without JavaScript, the nav
// stays a single horizontally scrollable row.
(function () {
  "use strict";

  var nav = document.querySelector(".site-nav");
  var button = nav && nav.querySelector(".nav-toggle");
  var menu = nav && nav.querySelector("#nav-menu");
  if (!button || !menu) return;

  var narrow = window.matchMedia("(max-width: 55.99rem)");

  function setOpen(open) {
    button.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
  }

  button.hidden = false;
  nav.classList.add("has-toggle");

  button.addEventListener("click", function () {
    setOpen(button.getAttribute("aria-expanded") !== "true");
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      setOpen(false);
      button.focus();
    }
  });

  document.addEventListener("click", function (e) {
    if (nav.classList.contains("is-open") && !nav.contains(e.target)) setOpen(false);
  });

  menu.addEventListener("click", function (e) {
    if (e.target.closest("a")) setOpen(false);
  });

  function onBreakpoint() {
    if (!narrow.matches) setOpen(false);
  }
  if (narrow.addEventListener) narrow.addEventListener("change", onBreakpoint);
})();
