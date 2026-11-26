// Variant switcher for the texture explorations. Arrow keys cycle variants;
// the choice is kept in the URL hash (#3) so it survives reloads.
(function () {
  "use strict";

  var VARIANTS = [
    ["Current", "The site as it is today, for comparison."],
    ["Ledger", "Horizontal pinstripes fading down the hero, ruled theme cards, double-rule dividers, a pinstriped footer."],
    ["Grain", "Warm paper tone with a fine noise overlay across the whole page, dotted dividers."],
    ["Graph", "Dot-grid paper behind the hero, corner tick marks and dot fill on cards, blue cursor-bar dividers."],
    ["Fan", "Art Deco overlapping fans across the top of the hero, fan-ornament dividers, small fans on cards."],
    ["Sunburst", "Art Deco rays and concentric arcs rising behind the hero, arc dividers, double-outline cards, arc marks on labels."],
    ["Lattice", "Diamond tessellation behind the hero and footer, chevron-band dividers with a diamond centrepiece."],
    ["Tesseract", "A hypercube wireframe (inner cube in cursor blue) on an isometric grid, cube-ornament dividers."],
    ["Composite", "Faint grain, diagonal pinstripes in the hero and footer, fan dividers, double-outline cards, and the tesseract."],
    ["Blend", "Warm paper with coarser, visible grain; the fan header (dots replaced by a third arc); the blue cursor rule with tighter gaps."]
  ];

  var bar = document.querySelector(".switcher-buttons");
  var desc = document.getElementById("variant-desc");
  var buttons = VARIANTS.map(function (v, i) {
    var b = document.createElement("button");
    b.type = "button";
    b.textContent = i + " · " + v[0];
    b.addEventListener("click", function () { set(i); });
    bar.appendChild(b);
    return b;
  });

  function set(i) {
    i = (i + VARIANTS.length) % VARIANTS.length;
    document.body.dataset.variant = String(i);
    buttons.forEach(function (b, j) { b.setAttribute("aria-pressed", String(i === j)); });
    desc.innerHTML = "";
    var name = document.createElement("strong");
    name.textContent = i + " · " + VARIANTS[i][0] + " — ";
    desc.appendChild(name);
    desc.appendChild(document.createTextNode(VARIANTS[i][1] + " (← → to switch)"));
    history.replaceState(null, "", "#" + i);
  }

  document.addEventListener("keydown", function (e) {
    if (e.target.closest("input, textarea")) return;
    var cur = Number(document.body.dataset.variant);
    if (e.key === "ArrowRight") set(cur + 1);
    if (e.key === "ArrowLeft") set(cur - 1);
  });

  set(parseInt(location.hash.slice(1), 10) || 0);
})();
