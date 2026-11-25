/* =========================================================
   Carte animée du circuit : une voiture parcourt le tracé
   avec une vitesse réaliste (rapide en ligne droite, lente
   dans les virages), un chrono et la section en cours.
   ========================================================= */
(() => {
  const svg = document.querySelector(".track");
  if (!svg) return;
  const data = JSON.parse(document.getElementById("circuit-data").textContent);
  const path = svg.querySelector("#trackPath");
  const trace = svg.querySelector(".track-trace");
  const car = svg.querySelector(".car");
  const playBtn = document.querySelector(".track-controls .play");
  const speedSel = document.querySelector(".track-controls .speed");
  const hudTime = document.querySelector(".hud-time");
  const hudSpeed = document.querySelector(".hud-speed");
  const hudSector = document.querySelector(".hud-sector b");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const LAP_M = 13626, VMAX = 335, N = 1200;
  const total = path.getTotalLength();
  trace.style.strokeDasharray = total;
  trace.style.strokeDashoffset = total;

  // Échantillonnage du tracé
  const pts = Array.from({ length: N }, (_, i) => path.getPointAtLength(i / N * total));
  const nearest = (x, y) => {
    let best = 0, bd = Infinity;
    pts.forEach((p, i) => { const d = (p.x - x) ** 2 + (p.y - y) ** 2; if (d < bd) { bd = d; best = i; } });
    return best;
  };
  const corners = data.corners.map(c => ({ ...c, i: nearest(c.x, c.y) }));
  const slow = [...corners.filter(c => c.v > 0), ...data.chicanes.map(c => ({ ...c, i: nearest(c.x, c.y) }))];

  // Profil de vitesse : on freine avant chaque virage et on réaccélère après
  const circ = (a, b) => { const d = Math.abs(a - b); return Math.min(d, N - d); };
  const speed = pts.map((_, i) => {
    let v = VMAX;
    slow.forEach(c => {
      const d = circ(i, c.i) / N * LAP_M;        // distance en mètres
      const k = Math.min(1, d / 650);
      v = Math.min(v, c.v + (VMAX - c.v) * (k * k * (3 - 2 * k)));
    });
    return v;
  });
  // Temps cumulé (en secondes réelles) pour chaque échantillon
  const seg = LAP_M / N;
  const cum = [0];
  for (let i = 1; i <= N; i++) cum[i] = cum[i - 1] + seg / (speed[(i - 1) % N] / 3.6);
  const LAP_T = cum[N];

  // Section en cours = dernier repère franchi
  const sorted = [...corners].sort((a, b) => a.i - b.i);
  const sectionAt = i => { let s = sorted[sorted.length - 1]; sorted.forEach(c => { if (c.i <= i) s = c; }); return s; };
  const nameOf = id => document.querySelector(`.corner-info[data-id="${id}"] h3`).textContent;

  let playing = false, simT = 0, last = 0, activeId = null;
  const fmt = t => { const m = Math.floor(t / 60), s = t - m * 60; return `${m}:${s.toFixed(3).padStart(6, "0")}`; };

  function place(t) {
    const tt = t % LAP_T;
    let lo = 0, hi = N;
    while (lo < hi) { const mid = (lo + hi) >> 1; if (cum[mid] < tt) lo = mid + 1; else hi = mid; }
    const i = Math.max(0, lo - 1);
    const f = (tt - cum[i]) / (cum[i + 1] - cum[i] || 1);
    const len = ((i + f) / N) * total;
    const p = path.getPointAtLength(len);
    car.setAttribute("transform", `translate(${p.x} ${p.y})`);
    trace.style.strokeDashoffset = total - len;
    hudTime.textContent = fmt(tt);
    hudSpeed.textContent = Math.round(speed[i % N]);
    setActive(sectionAt(i).id);
  }

  function setActive(id) {
    if (id === activeId) return;
    activeId = id;
    document.querySelectorAll(".corner, .corner-info").forEach(el => el.classList.toggle("active", el.dataset.id === id));
    hudSector.textContent = nameOf(id);
  }

  function loop(now) {
    if (!playing) return;
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    simT += dt * +speedSel.value;
    place(simT);
    requestAnimationFrame(loop);
  }

  playBtn.addEventListener("click", () => {
    playing = !playing;
    playBtn.textContent = playing ? `❚❚ ${playBtn.dataset.pause}` : `▶ ${playBtn.dataset.play}`;
    if (playing) { last = performance.now(); requestAnimationFrame(loop); }
  });

  // Cliquer sur un virage (sur la carte ou dans la liste) y place la voiture
  const jump = id => {
    const c = corners.find(k => k.id === id);
    if (!c) return;
    simT = Math.floor(simT / LAP_T) * LAP_T + cum[c.i];
    place(simT);
  };
  svg.querySelectorAll(".corner").forEach(g => {
    g.addEventListener("click", () => jump(g.dataset.id));
    g.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); jump(g.dataset.id); } });
  });
  document.querySelectorAll(".corner-info").forEach(el => el.addEventListener("click", () => jump(el.dataset.id)));

  place(0);
  // Démarrage automatique quand la carte devient visible
  if (!reduceMotion) {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !playing) { playBtn.click(); io.disconnect(); }
    }, { threshold: .5 });
    io.observe(svg);
  }
})();
