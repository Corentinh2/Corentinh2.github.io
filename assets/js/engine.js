/* =========================================================
   Son moteur synthétisé en direct (Web Audio API).
   Ce n'est pas un enregistrement : le son est calculé à partir
   de l'architecture du moteur (cylindres, turbo, régime max, hybride).
   Fréquence d'allumage = régime / 60 × cylindres / 2
   ========================================================= */
(() => {
  const player = document.querySelector(".engine-player");
  if (!player) return;
  const btn = player.querySelector(".engine-btn");
  const lbl = btn.querySelector(".lbl");
  const rpmEl = player.querySelector(".rpm");
  const bar = player.querySelector(".tacho-bar i");
  const cfg = {
    cyl: +player.dataset.cyl,
    turbo: player.dataset.turbo === "true",
    rpm: +player.dataset.rpm,
    hybrid: player.dataset.hybrid === "true",
  };
  let ctx = null, running = null;

  // Courbe de régime : départ électrique (hybride), montée des rapports, puis lâcher d'accélérateur
  function timeline() {
    const max = cfg.rpm, idle = max * 0.32;
    const pts = [];
    let t = 0;
    if (cfg.hybrid) { pts.push([0, 0, 0]); t = 0.9; }        // [temps, tr/min, accélérateur]
    pts.push([t, idle, 0.2]); t += 0.5;
    pts.push([t, idle * 1.05, 0.2]);
    const gears = [0.75, 0.95, 1.15, 1.35, 1.55];
    gears.forEach((d, i) => {
      t += 0.04; pts.push([t, i ? max * 0.68 : idle * 1.1, 1]);
      t += d; pts.push([t, max * (0.985 + i * 0.003), 1]);
      t += 0.06; pts.push([t, max * 0.9, 0.25]);               // coupure au passage de rapport
    });
    t += 0.2; pts.push([t, max * 0.75, 0.05]);
    t += 1.6; pts.push([t, idle * 1.1, 0.08]);
    t += 0.8; pts.push([t, idle, 0.0]);
    return { pts, end: t + 0.3 };
  }

  function makeNoise(c) {
    const buf = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource();
    src.buffer = buf; src.loop = true;
    return src;
  }

  function shaper(c, amount) {
    const ws = c.createWaveShaper();
    const n = 2048, curve = new Float32Array(n);
    for (let i = 0; i < n; i++) { const x = i * 2 / n - 1; curve[i] = (1 + amount) * x / (1 + amount * Math.abs(x)); }
    ws.curve = curve; ws.oversample = "4x";
    return ws;
  }

  function play() {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    ctx.resume();
    const c = ctx, now = c.currentTime + 0.05;
    const { pts, end } = timeline();
    const fire = r => Math.max(1, r / 60 * cfg.cyl / 2);

    const master = c.createGain(); master.gain.value = 0.0001;
    const comp = c.createDynamicsCompressor();
    master.connect(comp).connect(c.destination);

    // Moteur thermique : plusieurs harmoniques + distorsion + filtre
    const lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.Q.value = 3;
    const dist = shaper(c, cfg.cyl >= 10 ? 6 : cfg.turbo ? 14 : 22);
    const engGain = c.createGain(); engGain.gain.value = 0;
    dist.connect(lp).connect(engGain).connect(master);
    const oscs = [
      { type: "sawtooth", mul: 1, g: 0.5 },
      { type: "square", mul: 0.5, g: cfg.cyl === 8 ? 0.45 : 0.2 },    // grondement (V8 surtout)
      { type: "sawtooth", mul: 2, g: cfg.cyl >= 10 ? 0.5 : 0.18 },    // cri aigu (V12)
      { type: "triangle", mul: 3, g: cfg.cyl >= 10 ? 0.25 : 0.06 },
    ].map(o => {
      const osc = c.createOscillator(); osc.type = o.type;
      const g = c.createGain(); g.gain.value = o.g;
      osc.connect(g).connect(dist);
      return { osc, mul: o.mul };
    });

    // Échappement : bruit filtré qui suit le régime
    const noise = makeNoise(c);
    const bp = c.createBiquadFilter(); bp.type = "bandpass"; bp.Q.value = 1.2;
    const nGain = c.createGain(); nGain.gain.value = 0;
    noise.connect(bp).connect(nGain).connect(master);

    // Turbo : sifflement aigu
    let turbo = null;
    if (cfg.turbo) {
      const osc = c.createOscillator(); osc.type = "sine";
      const g = c.createGain(); g.gain.value = 0;
      osc.connect(g).connect(master);
      turbo = { osc, g };
    }
    // Hybride : sifflement électrique au départ
    let elec = null;
    if (cfg.hybrid) {
      const osc = c.createOscillator(); osc.type = "sine";
      const g = c.createGain(); g.gain.value = 0;
      osc.connect(g).connect(master);
      elec = { osc, g };
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.linearRampToValueAtTime(2400, now + 1.1);
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.05, now + 0.3);
      g.gain.linearRampToValueAtTime(0.0, now + 1.3);
    }

    // Programmation de toute la séquence
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(0.5, now + 0.15);
    pts.forEach(([t, r, thr], i) => {
      const at = now + t;
      const ramp = i === 0 ? "setValueAtTime" : "linearRampToValueAtTime";
      const on = r > 0 ? 1 : 0;
      oscs.forEach(o => o.osc.frequency[ramp](fire(r || 1) * o.mul, at));
      lp.frequency[ramp](300 + (r / cfg.rpm) * (1800 + thr * 3200), at);
      engGain.gain[ramp](on * (0.18 + thr * 0.32), at);
      bp.frequency[ramp](Math.max(80, fire(r) * 2.5), at);
      nGain.gain[ramp](on * (0.02 + thr * 0.09), at);
      if (turbo) {
        turbo.osc.frequency[ramp](2500 + (r / cfg.rpm) * 6000, at);
        turbo.g.gain[ramp](on * thr * (r / cfg.rpm) * 0.025, at);
      }
    });
    // Petites détonations à la décélération
    const tLift = pts[pts.length - 3][0];
    const pops = [];
    for (let k = 0; k < 6; k++) {
      const at = now + tLift + 0.15 + k * 0.17 + Math.random() * 0.08;
      const pop = makeNoise(c), pg = c.createGain(), pf = c.createBiquadFilter();
      pf.type = "lowpass"; pf.frequency.value = 900;
      pg.gain.setValueAtTime(0, at); pg.gain.linearRampToValueAtTime(0.35, at + 0.005); pg.gain.exponentialRampToValueAtTime(0.001, at + 0.07);
      pop.connect(pf).connect(pg).connect(master);
      pop.start(at); pop.stop(at + 0.1);
      pops.push(pop);
    }
    master.gain.setValueAtTime(0.5, now + end - 0.4);
    master.gain.exponentialRampToValueAtTime(0.0001, now + end);

    const sources = [...oscs.map(o => o.osc), noise, turbo?.osc, elec?.osc].filter(Boolean);
    sources.forEach(n => { n.start(now); n.stop(now + end + 0.05); });
    const all = [...sources, ...pops];

    // Compte-tours synchronisé
    const t0 = performance.now();
    const raf = () => {
      const t = (performance.now() - t0) / 1000;
      let r = 0;
      for (let i = 1; i < pts.length; i++) {
        if (t <= pts[i][0]) { const [ta, ra] = pts[i - 1], [tb, rb] = pts[i]; r = ra + (rb - ra) * ((t - ta) / (tb - ta || 1)); break; }
        r = pts[i][1];
      }
      if (t > end) r = 0;
      rpmEl.textContent = Math.round(r / 50) * 50;
      bar.style.transform = `scaleX(${Math.min(1, r / cfg.rpm)})`;
      if (t <= end && running) running.raf = requestAnimationFrame(raf);
      else stop();
    };
    running = { all, master, raf: requestAnimationFrame(raf) };
    btn.classList.add("playing");
    lbl.textContent = btn.dataset.labelStop;
  }

  function stop() {
    if (running) {
      cancelAnimationFrame(running.raf);
      try {
        running.master.gain.cancelScheduledValues(ctx.currentTime);
        running.master.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.05);
        running.all.forEach(n => { try { n.stop(ctx.currentTime + 0.2); } catch (e) {} });
      } catch (e) {}
    }
    running = null;
    btn.classList.remove("playing");
    lbl.textContent = btn.dataset.labelPlay;
    rpmEl.textContent = "0";
    bar.style.transform = "scaleX(0)";
  }

  btn.addEventListener("click", () => (running ? stop() : play()));
})();
