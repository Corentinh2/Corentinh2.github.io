/* =========================================================
   Comparateur : deux hypercars côte à côte
   ========================================================= */
(() => {
  const root = document.querySelector(".cmp");
  if (!root) return;
  const { teams, labels: L, assets } = JSON.parse(document.getElementById("compare-data").textContent);
  const sides = { a: root.querySelector('[data-side="a"]'), b: root.querySelector('[data-side="b"]') };
  const rowsEl = root.querySelector(".cmp-rows");
  const get = slug => teams.find(t => t.slug === slug);
  // Échappe le texte avant de l'insérer dans le HTML
  const esc = v => String(v).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const safeSlug = v => String(v).replace(/[^a-z0-9-]/gi, "");

  // Lignes : [clé, formatage, valeur numérique pour les barres (ou null), plus grand = mieux ?]
  const rows = [
    ["type", t => t.type, null],
    ["engine", t => t.engine, null],
    ["litres", t => `${t.litres.toLocaleString(document.documentElement.lang)}${L.litresUnit}`, t => t.litres, 7],
    ["cyl", t => t.cyl, t => t.cyl, 12],
    ["turbo", t => (t.turbo ? L.yes : L.no), null],
    ["hybrid", t => (t.hybrid ? L.yes : L.no), null],
    ["wins", t => t.wins, t => t.wins, 19],
    ["debut", t => t.debut, null],
  ];

  function media(side, t) {
    const box = side.querySelector(".cmp-media");
    side.style.setProperty("--c", t.color);
    box.innerHTML = (t.img
      ? `<img src="${esc(assets)}assets/img/${safeSlug(t.img)}.webp" alt="${esc(t.name)} ${esc(t.car)}">`
      : `<div class="silhouette" style="--c:${esc(t.color)}"><span class="ph">${esc(L.photoSoon)}</span></div>`) +
      `<a class="name" href="${esc(t.file)}">${esc(t.name)}</a>`;
  }

  function render() {
    const A = get(sides.a.querySelector("select").value);
    const B = get(sides.b.querySelector("select").value);
    media(sides.a, A); media(sides.b, B);
    rowsEl.innerHTML = rows.map(([k, fmt, num, max], i) => {
      const va = num ? num(A) : null, vb = num ? num(B) : null;
      const wa = num && va > vb ? " win" : "", wb = num && vb > va ? " win" : "";
      const bar = (v, t) => (num ? `<span class="b" style="--c:${esc(t.color)}; width:0" data-w="${Math.max(2, v / max * 100)}%"></span>` : "");
      return `<div class="cmp-row" style="animation-delay:${i * 50}ms">
        <span class="v a${wa}">${bar(va, A)}<span>${esc(fmt(A))}</span></span>
        <span class="lab">${esc(L[k])}</span>
        <span class="v b${wb}">${bar(vb, B)}<span>${esc(fmt(B))}</span></span>
      </div>`;
    }).join("");
    // Les barres se remplissent après l'affichage
    requestAnimationFrame(() => requestAnimationFrame(() => rowsEl.querySelectorAll(".b").forEach(b => b.style.width = `calc(${b.dataset.w} * .5)`)));
  }

  Object.values(sides).forEach(s => s.querySelector("select").addEventListener("change", render));
  root.querySelector(".cmp-swap").addEventListener("click", () => {
    const sa = sides.a.querySelector("select"), sb = sides.b.querySelector("select");
    [sa.value, sb.value] = [sb.value, sa.value];
    render();
  });
  render();
})();
