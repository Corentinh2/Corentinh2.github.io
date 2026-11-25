/* =========================================================
   Simulateur de stratégie (modèle simplifié et pédagogique)
   ========================================================= */
(() => {
  const root = document.querySelector(".strat");
  if (!root) return;
  const lang = document.documentElement.lang;
  const $ = id => document.getElementById(id);
  const ids = ["stint", "tyres", "driver", "sc", "pace"];
  const RACE = 24 * 3600, LAP_KM = 13.626;
  const BASE_STOP = 35, TYRE_STOP = 25, DRIVER_STOP = 6, DEG = 0.08, SC_COST = 180;
  const H = root.dataset.hours;
  const fmtLap = s => `${Math.floor(s / 60)}:${(s % 60).toFixed(1).padStart(4, "0")}`;
  const fmtDur = s => `${Math.floor(s / 60)} min ${String(Math.round(s % 60)).padStart(2, "0")} s`;
  const shown = {};

  function simulate(v) {
    let t = v.sc * SC_COST, laps = 0, stops = 0, pit = 0, tyreAge = 0, stintN = 0, lapInStint = 0;
    const series = [];
    while (t < RACE) {
      const lap = v.pace + tyreAge * DEG;
      t += lap; laps++; tyreAge++; lapInStint++;
      series.push([t, lap]);
      if (lapInStint >= v.stint && t < RACE) {
        stintN++; lapInStint = 0; stops++;
        let stop = BASE_STOP;
        if (stintN % v.tyres === 0) { stop += TYRE_STOP; tyreAge = 0; }
        if (stintN % v.driver === 0) stop += DRIVER_STOP;
        pit += stop; t += stop;
      }
    }
    return { laps, stops, pit, series, avg: (RACE - v.sc * SC_COST) / laps };
  }

  function animateTo(key, value, format) {
    const el = root.querySelector(`[data-o="${key}"]`);
    const from = shown[key] ?? 0;
    const t0 = performance.now();
    const step = now => {
      const k = Math.min(1, (now - t0) / 600), e = 1 - Math.pow(1 - k, 3);
      el.textContent = format(from + (value - from) * e);
      if (k < 1) requestAnimationFrame(step);
    };
    shown[key] = value;
    requestAnimationFrame(step);
  }

  function render() {
    const v = Object.fromEntries(ids.map(id => [id, +$(id).value]));
    root.querySelector('[data-out="pace"]').textContent = fmtLap(v.pace);
    ["stint", "tyres", "driver", "sc"].forEach(id => root.querySelector(`[data-out="${id}"]`).textContent = v[id]);
    root.querySelector(".strat-warn").hidden = v.stint <= 14;
    const r = simulate(v);
    animateTo("laps", r.laps, n => Math.round(n));
    animateTo("stops", r.stops, n => Math.round(n));
    animateTo("pit", r.pit, n => fmtDur(n));
    animateTo("dist", r.laps * LAP_KM, n => `${Math.round(n).toLocaleString(lang)} km`);
    root.querySelector('[data-o="avg"]').textContent = fmtLap(r.avg);
    // Graphique : temps au tour au fil des 24 heures
    const min = v.pace - 1, max = v.pace + 16 * 4 * DEG + 1;
    const pts = r.series.map(([t, lap]) => [t / RACE * 600, 210 - (lap - min) / (max - min) * 190]);
    const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
    root.querySelector(".line").setAttribute("d", d);
    root.querySelector(".area").setAttribute("d", `${d} L600 220 L0 220 Z`);
  }

  ids.forEach(id => $(id).addEventListener("input", render));
  render();
})();
