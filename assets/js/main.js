/* =========================================================
   24h du Mans — Hypercars
   Animations et interactions communes à toutes les pages.
   ========================================================= */
(() => {
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  /* ---------- Navigation : fond au défilement + menu mobile ---------- */
  const nav = $(".nav");
  const burger = $(".burger");
  burger?.addEventListener("click", () => {
    const open = document.body.classList.toggle("menu-open");
    burger.setAttribute("aria-expanded", open);
  });
  const closeMenu = () => { document.body.classList.remove("menu-open"); burger?.setAttribute("aria-expanded", "false"); };
  $$(".nav-links a").forEach(a => a.addEventListener("click", closeMenu));
  addEventListener("keydown", e => { if (e.key === "Escape" && document.body.classList.contains("menu-open")) { closeMenu(); burger?.focus(); } });

  // Le bouton "Écuries" ouvre/ferme le méga-menu au clic (utile au clavier et sur tablette)
  $$(".has-mega > button").forEach(btn => btn.addEventListener("click", () => {
    const li = btn.parentElement;
    li.classList.toggle("open");
    btn.setAttribute("aria-expanded", li.classList.contains("open"));
  }));
  document.addEventListener("click", e => {
    $$(".has-mega.open").forEach(li => { if (!li.contains(e.target)) li.classList.remove("open"); });
  });

  /* ---------- Barre de progression, nav, retour en haut, parallaxe ---------- */
  const progress = $(".progress");
  const toTop = $(".to-top");
  const ring = $(".to-top .ring");
  const parallax = $$("[data-parallax]");
  let ticking = false;

  function onScroll() {
    const y = scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? y / max : 0;
    if (progress) progress.style.transform = `scaleX(${p})`;
    nav?.classList.toggle("scrolled", y > 30);
    toTop?.classList.toggle("show", y > innerHeight * .6);
    if (ring) ring.style.strokeDashoffset = 145 - 145 * p;
    if (!reduceMotion) {
      parallax.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || .3;
        el.style.transform = `translate3d(0, ${y * speed}px, 0)`;
      });
    }
    ticking = false;
  }
  addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();
  toTop?.addEventListener("click", () => scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));

  /* ---------- Apparition des éléments au défilement ---------- */
  // Les enfants d'un conteneur [data-stagger] apparaissent l'un après l'autre
  $$("[data-stagger]").forEach(parent => {
    [...parent.children].forEach((child, i) => {
      if (!child.hasAttribute("data-reveal")) child.setAttribute("data-reveal", parent.dataset.stagger || "");
      child.style.setProperty("--i", i);
    });
  });

  const counters = new WeakSet();
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      $$("[data-count]", entry.target).concat(entry.target.matches("[data-count]") ? [entry.target] : [])
        .forEach(countUp);
      io.unobserve(entry.target);
    });
  }, { threshold: .15, rootMargin: "0px 0px -8% 0px" });
  $$("[data-reveal], [data-count], .spec").forEach(el => io.observe(el));

  /* ---------- Compteurs animés ---------- */
  function countUp(el) {
    if (counters.has(el)) return;
    counters.add(el);
    const target = parseFloat(el.dataset.count);
    const decimals = (el.dataset.count.split(".")[1] || "").length;
    const suffix = el.dataset.suffix || "";
    const fmt = n => n.toLocaleString("fr-FR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
    if (reduceMotion) { el.textContent = fmt(target); return; }
    const duration = 1800;
    const start = performance.now();
    const step = now => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      el.textContent = fmt(target * eased);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ---------- Cartes écuries : inclinaison 3D qui suit la souris ---------- */
  if (!reduceMotion && matchMedia("(hover: hover)").matches) {
    $$(".team-card").forEach(card => {
      card.addEventListener("pointermove", e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        card.style.setProperty("--ry", `${(x - .5) * 10}deg`);
        card.style.setProperty("--rx", `${(.5 - y) * 10}deg`);
        card.style.setProperty("--mx", `${x * 100}%`);
        card.style.setProperty("--my", `${y * 100}%`);
      });
      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
      });
    });
  }

  /* ---------- Galerie photo plein écran ---------- */
  const lightbox = $(".lightbox");
  if (lightbox) {
    const img = $("img", lightbox);
    $$(".gallery button").forEach(btn => btn.addEventListener("click", () => {
      const src = $("img", btn);
      img.src = src.currentSrc || src.src;
      img.alt = src.alt;
      lightbox.showModal();
    }));
    $("button", lightbox).addEventListener("click", () => lightbox.close());
    lightbox.addEventListener("click", e => { if (e.target === lightbox) lightbox.close(); });
  }

  /* ---------- Adresse mail reconstituée (évite les robots de spam) ---------- */
  $$("[data-mail-user]").forEach(el => {
    const addr = `${el.dataset.mailUser}@${el.dataset.mailDomain}`;
    el.href = `mailto:${addr}`;
    $$("[data-mail-label]").forEach(label => label.textContent = addr);
  });

  /* ---------- Année courante dans le pied de page ---------- */
  $$("[data-year]").forEach(el => el.textContent = new Date().getFullYear());

  /* ---------- Thème clair / sombre ---------- */
  $(".theme-toggle")?.addEventListener("click", () => {
    const root = document.documentElement;
    const next = root.dataset.theme === "light" ? "dark" : "light";
    const apply = () => {
      root.dataset.theme = next;
      try { localStorage.setItem("theme", next); } catch (e) {}
    };
    // Transition en cercle depuis le bouton quand le navigateur le permet
    if (document.startViewTransition && !reduceMotion) document.startViewTransition(apply);
    else apply();
  });

  /* ---------- Compte à rebours jusqu'aux prochaines 24 Heures ---------- */
  const cd = $("[data-countdown]");
  if (cd) {
    const start = new Date(cd.dataset.countdown).getTime();
    const finish = start + 24 * 3600 * 1000;                 // la course dure 24 heures
    const cells = $$("[data-cd]", cd);
    let timer = 0, state = "";
    const setText = (sel, txt) => { const el = $(sel, cd); if (el && txt) el.textContent = txt; };
    const update = () => {
      const now = Date.now();
      // Trois états : avant le départ, pendant la course, après l'arrivée
      const next = now < start ? "before" : now < finish ? "live" : "after";
      if (next !== state) {
        state = next;
        cd.dataset.state = state;
        $(".cd-live", cd).hidden = state !== "live";
        if (state === "live") { setText(".cd-title", cd.dataset.liveTitle); setText(".cd-date", cd.dataset.liveDate); }
        if (state === "after") {
          setText(".cd-title", cd.dataset.afterTitle); setText(".cd-date", cd.dataset.afterDate); setText(".cd-note", cd.dataset.afterNote);
          $(".cd-grid", cd).hidden = true;
          clearInterval(timer);
          return;
        }
      }
      const s = Math.max(0, Math.floor(((state === "live" ? finish : start) - now) / 1000));
      const parts = [Math.floor(s / 86400), Math.floor(s % 86400 / 3600), Math.floor(s % 3600 / 60), s % 60];
      parts.forEach((v, i) => {
        const txt = String(v).padStart(i ? 2 : 1, "0");
        if (cells[i].textContent !== txt) {
          cells[i].textContent = txt;
          if (!reduceMotion) { cells[i].classList.remove("tick"); void cells[i].offsetWidth; cells[i].classList.add("tick"); }
        }
      });
    };
    update();
    if (state !== "after") timer = setInterval(update, 1000);
  }

  /* ---------- Cartes drapeaux qui se retournent ---------- */
  $$(".flag-card").forEach(card => card.addEventListener("click", () => card.classList.toggle("flipped")));

  /* ---------- Histoire : année affichée en suivant le défilement ---------- */
  const yearNow = $(".year-now");
  if (yearNow) {
    const items = $$(".timeline li");
    const yio = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) yearNow.textContent = e.target.dataset.y; });
    }, { rootMargin: "-45% 0px -50% 0px" });
    items.forEach(li => yio.observe(li));
  }

  /* ---------- Mode hors connexion (service worker) ---------- */
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
    addEventListener("load", () => navigator.serviceWorker.register(document.body.dataset.sw || "/sw.js", { scope: "/" }).catch(() => {}));
  }
  const setOnline = () => document.body.classList.toggle("is-offline", !navigator.onLine);
  addEventListener("online", setOnline);
  addEventListener("offline", setOnline);
  setOnline();
})();
