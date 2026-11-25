/* =========================================================
   Petits outils : onglets (Résultats), liste à cocher (Venir),
   recherche du lexique
   ========================================================= */
(() => {
  /* ---------- Onglets ---------- */
  const tabs = [...document.querySelectorAll('.tabs [role="tab"]')];
  const select = tab => {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute("aria-selected", on);
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute("aria-controls"));
      panel.hidden = !on;
      if (on) { panel.classList.remove("enter"); void panel.offsetWidth; panel.classList.add("enter"); }
    });
  };
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => select(t));
    t.addEventListener("keydown", e => {
      const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (d) { const n = tabs[(i + d + tabs.length) % tabs.length]; n.focus(); select(n); }
    });
  });
  if (tabs.length) select(tabs.find(t => t.getAttribute("aria-selected") === "true") || tabs[0]);

  /* ---------- Liste à cocher, gardée sur l'appareil ---------- */
  const boxes = [...document.querySelectorAll("[data-check]")];
  if (boxes.length) {
    const KEY = "lemans-checklist";
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) {}
    const bar = document.querySelector(".check-progress i");
    const refresh = () => {
      const done = boxes.filter(b => b.checked).length;
      if (bar) bar.style.width = `${done / boxes.length * 100}%`;
      try { localStorage.setItem(KEY, JSON.stringify(Object.fromEntries(boxes.map(b => [b.dataset.check, b.checked])))); } catch (e) {}
    };
    boxes.forEach(b => { b.checked = !!saved[b.dataset.check]; b.addEventListener("change", refresh); });
    document.querySelector(".check-reset")?.addEventListener("click", () => { boxes.forEach(b => b.checked = false); refresh(); });
    refresh();
  }

  /* ---------- Recherche instantanée dans le lexique ---------- */
  const search = document.querySelector(".gl-search");
  if (search) {
    const items = [...document.querySelectorAll(".gl-item")];
    const letters = [...document.querySelectorAll(".gl-letter")];
    const none = document.querySelector(".gl-none");
    const norm = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    search.addEventListener("input", () => {
      const q = norm(search.value.trim());
      let shown = 0;
      items.forEach(it => {
        const ok = !q || norm(it.textContent).includes(q);
        it.hidden = !ok;
        if (ok) { shown++; it.classList.add("in"); }
      });
      letters.forEach(l => {
        let n = l.nextElementSibling, any = false;
        while (n && !n.classList.contains("gl-letter")) { if (!n.hidden) any = true; n = n.nextElementSibling; }
        l.hidden = !any;
      });
      none.hidden = shown > 0;
    });
  }
})();
