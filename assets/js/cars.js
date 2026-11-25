/* =========================================================
   Dessins vectoriels des hypercars (vue de profil).
   Tracés originaux, dessinés à la main en observant les photos
   des voitures (proportions, formes, livrées 2026) : aucune
   photo n'est copiée ni utilisée dans le rendu.
   Repère : 420 × 130, voiture tournée vers la gauche,
   roues avant (x = 86) et arrière (x = 338), sol à y = 122.
   ========================================================= */
(() => {
  // Valeurs par défaut : un prototype bas, plat et anguleux
  const BASE = {
    nose: 104, nt: 84,            // museau : bas du bouclier, haut du capot avant
    fx: 88, fy: 61,               // aile avant : centre et hauteur (juste au-dessus du pneu)
    vy: 70,                       // flanc entre l'aile avant et le cockpit
    cx: 206, cy: 40, ce: 246,     // cockpit : centre, haut de la bulle, fin du toit
    rx: 338, rfy: 60,             // aile arrière (au-dessus de la roue arrière)
    ty: 66, tl: 412,              // haut et bout de l'arrière
    wx: 350, wy: 20,              // aileron : début et hauteur
    fin: true, pylons: 1, bigEnd: false,
    scoop: false, bubble: false, frontGap: false, vent: false, pod: true,
  };

  // Particularités observées sur chaque voiture + livrée 2026 (couleurs, sans logos)
  const CARS = {
    toyota:      { fy: 60, vy: 71, cy: 40, ty: 66, wy: 18,
                   livery: { base: "#d0021b", nose: "#d0021b", stripe: "#ffffff", stripe2: "#141414", rear: "#141414", wing: "#141414", light: "#ffffff", num: "#d0021b", roundel: "#ffffff", lights: "slim" } },
    ferrari:     { fx: 84, fy: 55, vy: 73, cx: 204, cy: 42, rfy: 57, ty: 62, wx: 352, wy: 22, vent: true,
                   livery: { base: "#c8102e", nose: "#c8102e", stripe: "#ffd400", rear: "#a00a1f", wing: "#141414", light: "#ffe9b0", num: "#141414", roundel: "#ffd400", lights: "bar" } },
    bmw:         { nt: 76, fy: 60, vy: 70, cy: 40, ty: 66, wx: 344, wy: 16, bigEnd: true,
                   livery: { base: "#f4f4f4", nose: "#f4f4f4", stripe: "#ffd100", stripe2: "#e30613", rear: "#e30613", wing: "#141414", light: "#ffd100", num: "#ffffff", roundel: "#e30613", lights: "kidney" } },
    cadillac:    { nose: 106, nt: 88, fx: 92, fy: 63, vy: 72, cy: 42, ce: 250, rfy: 61, ty: 72, tl: 416, wy: 28,
                   livery: { base: "#121212", nose: "#121212", stripe: "#c9a227", rear: "#121212", wing: "#0b0b0b", light: "#ffffff", num: "#121212", roundel: "#c9a227", lights: "vertical" } },
    peugeot:     { nt: 80, fy: 60, vy: 66, cy: 39, rfy: 58, ty: 60, wx: 346, wy: 22, fin: false, pylons: 2,
                   livery: { base: "#151515", nose: "#151515", stripe: "#e4002b", rear: "#151515", wing: "#151515", light: "#ffffff", num: "#ffffff", roundel: "#e4002b", lights: "claws", zebra: "#f2f2f2" } },
    alpine:      { nt: 82, fy: 60, vy: 70, cy: 40, ty: 64, wy: 18,
                   livery: { base: "#1d3fbf", nose: "#1d3fbf", stripe: "#ffffff", stripe2: "#e4002b", rear: "#0b1d55", wing: "#0b1d55", light: "#ffffff", num: "#0b1d55", roundel: "#ffffff", lights: "slim" } },
    aston:       { fx: 84, fy: 57, vy: 74, cx: 196, cy: 33, ce: 236, rfy: 62, ty: 70, wx: 356, wy: 24, bubble: true, frontGap: true,
                   livery: { base: "#00665a", nose: "#00665a", stripe: "#c6ff00", rear: "#00463e", wing: "#00463e", light: "#ffffff", num: "#00463e", roundel: "#c6ff00", lights: "round" } },
    genesis:     { fy: 60, vy: 70, cy: 39, ty: 66, wy: 18,
                   livery: { base: "#ff7a1f", nose: "#ff7a1f", stripe: "#d81e1e", rear: "#d81e1e", wing: "#141414", light: "#ffffff", num: "#d81e1e", roundel: "#ffffff", lights: "dual" } },
    porsche:     { nose: 105, nt: 86, fy: 61, vy: 70, cy: 41, ty: 66, wy: 18,
                   livery: { base: "#f5f5f5", nose: "#f5f5f5", stripe: "#d5001c", rear: "#ff7a00", wing: "#141414", light: "#ffffff", num: "#141414", roundel: "#ffffff", lights: "four" } },
    glickenhaus: { fx: 86, fy: 54, vy: 73, cx: 210, cy: 41, rfy: 56, ty: 62, wy: 20, scoop: true, pod: false,
                   livery: { base: "#8fd3ef", nose: "#8fd3ef", stripe: "#e4002b", stripe2: "#ffffff", stripe3: "#1e3a8a", rear: "#8fd3ef", wing: "#1e3a8a", light: "#ffffff", num: "#1e3a8a", roundel: "#ffffff", lights: "round" } },
  };

  // Construit les tracés d'une voiture à partir de ses paramètres
  function shapes(slug) {
    const p = { ...BASE, ...(CARS[slug] || {}) };
    const { nose, nt, fx, fy, vy, cx, cy, ce, rx, rfy, ty, tl, wx, wy } = p;
    const S = {};
    S.body =
      `M4 ${nose} L8 ${nose - 6} C18 ${nt + 8} 30 ${nt + 1} 44 ${nt - 2} ` +                   // museau et capot avant
      `L${fx - 24} ${fy + 3} C${fx - 12} ${fy} ${fx + 14} ${fy - 1} ${fx + 28} ${fy + 1} ` +   // dessus de l'aile avant (plat)
      `C${fx + 38} ${fy + 3} ${fx + 46} ${vy} ${fx + 58} ${vy} ` +                             // arrière de l'aile avant
      `L${cx - 50} ${vy + 1} ` +                                                              // flanc
      `C${cx - 36} ${vy - 6} ${cx - 24} ${cy + 4} ${cx - 6} ${cy} ` +                          // pare-brise
      `C${cx + 10} ${cy - 2} ${ce - 10} ${cy - 1} ${ce} ${cy + 5} ` +                          // bulle du cockpit
      `C${ce + 14} ${cy + 12} ${rx - 54} ${rfy + 3} ${rx - 24} ${rfy + 1} ` +                  // long capot arrière
      `C${rx - 4} ${rfy - 1} ${rx + 30} ${rfy - 1} ${tl - 8} ${ty} ` +                         // aile arrière
      `L${tl} ${ty + 4} L${tl} 104 ` +                                                        // arrière
      `L369 104 A33 33 0 1 0 307 104 L117 104 A33 33 0 1 0 55 104 L4 104 Z`;                  // passages de roues
    // Vitrage : pare-brise + vitre latérale de la bulle
    S.glass =
      `M${cx - 30} ${cy + 13} C${cx - 18} ${cy + 4} ${cx - 2} ${cy + 2} ${cx + 12} ${cy + 2} ` +
      `C${cx + 24} ${cy + 2} ${ce - 10} ${cy + 4} ${ce - 4} ${cy + 8} L${ce - 10} ${cy + 15} ` +
      `C${cx + 6} ${cy + 12} ${cx - 12} ${cy + 14} ${cx - 30} ${cy + 19} Z`;
    // Haute dérive (« shark fin ») qui relie le toit à l'aileron
    S.fin = p.fin ? `M${cx + 6} ${cy - 1} L${wx + 4} ${wy + 6} L${wx + 8} ${rfy + 2} L${ce + 6} ${cy + 12} Z` : "";
    const endTop = p.bigEnd ? wy - 10 : wy - 5;
    const endX = p.bigEnd ? 390 : 396;
    const pyl = x => `M${x} ${wy + 6} C${x - 4} ${wy + 16} ${x + 6} ${rfy - 10} ${x + 2} ${rfy + 3} L${x - 4} ${rfy + 3} C${x} ${rfy - 10} ${x - 10} ${wy + 16} ${x - 6} ${wy + 6} Z `;
    S.wing =
      `M${wx} ${wy + 1} L416 ${wy - 3} L416 ${wy + 5} L${wx + 2} ${wy + 8} Z ` +              // plan principal
      `M${wx + 6} ${wy + 10} L414 ${wy + 7} L414 ${wy + 11} L${wx + 8} ${wy + 13} Z ` +        // volet
      `M${endX} ${endTop} L416 ${endTop - 1} L416 ${ty + 6} L${endX} ${ty + 2} Z ` +          // dérive latérale
      (p.pylons === 2 ? pyl(wx + 20) + pyl(wx + 44) : pyl(wx + 34));                          // col de cygne
    S.intake = `M${fx + 40} ${vy + 6} L${cx - 54} ${vy + 7} L${cx - 58} ${vy + 18} L${fx + 46} ${vy + 18} Z`; // entrée d'air latérale
    S.diffuser = `M${tl - 30} 104 L${tl} 104 L${tl} ${ty + 22} Z`;
    S.splitter = `M2 106 L120 106 L120 109 L6 109 Z M300 106 L414 106 L414 108 L300 108 Z`;
    S.scoop = p.scoop ? `M${cx - 4} ${cy + 1} L${cx} ${cy - 12} L${cx + 26} ${cy - 12} L${cx + 30} ${cy + 1} Z` : "";
    S.pod = p.pod ? `M${cx + 4} ${cy - 1} L${cx + 6} ${cy - 6} L${cx + 20} ${cy - 6} L${cx + 22} ${cy - 1} Z` : "";
    S.mirror = `M${fx + 6} ${fy - 1} L${fx + 10} ${fy - 9} L${fx + 24} ${fy - 9} L${fx + 22} ${fy - 1} Z`;
    // Valkyrie : bulle en goutte d'eau et grand passage d'air sous l'aile avant
    S.bubble = p.bubble ? `M${cx - 28} ${cy + 12} C${cx - 14} ${cy - 6} ${cx + 24} ${cy - 6} ${ce + 4} ${cy + 10} Z` : "";
    S.gap = p.frontGap ? `M30 ${nose - 4} C52 ${fy + 24} 104 ${fy + 22} ${fx + 46} ${vy + 10} L${fx + 42} ${vy + 18} C100 ${fy + 30} 60 ${fy + 32} 34 ${nose} Z` : "";
    // Ferrari : grande ouïe derrière la roue avant
    S.vent = p.vent ? `M${fx + 30} ${fy + 8} L${fx + 52} ${vy - 2} L${fx + 56} ${vy + 22} L${fx + 34} ${fy + 30} Z` : "";
    S.wheels = [[86, 93], [338, 93]];
    S.roundel = [ce + 14, 80];
    S.p = p;
    return S;
  }

  // Dessine la voiture dans un contexte <canvas> (repère 420 × 130)
  function draw(ctx, slug, number = "", { glow = null } = {}) {
    const S = shapes(slug);
    const L = S.p.livery;
    const { cx, cy, fx, rx, nose, nt, tl, ty } = S.p;
    const body = new Path2D(S.body);
    const P = d => new Path2D(d);

    // Ombre au sol
    const sh = ctx.createRadialGradient(210, 122, 10, 210, 122, 220);
    sh.addColorStop(0, "rgba(0,0,0,.6)"); sh.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = sh; ctx.fillRect(-20, 110, 460, 24);

    // Aileron et dérive (derrière la carrosserie)
    ctx.fillStyle = L.wing; ctx.strokeStyle = "rgba(255,255,255,.22)"; ctx.lineWidth = 0.7;
    if (S.fin) { const f = P(S.fin); ctx.fill(f); ctx.stroke(f); }
    const w = P(S.wing); ctx.fill(w); ctx.stroke(w);

    // Carrosserie
    ctx.save();
    if (glow) { ctx.shadowColor = glow; ctx.shadowBlur = 50; }
    ctx.fillStyle = L.base; ctx.fill(body);
    ctx.restore();

    // Livrée, découpée selon la forme de la voiture
    ctx.save();
    ctx.clip(body);
    ctx.fillStyle = L.nose; ctx.fill(P(`M0 0 L${fx + 20} 0 L${fx - 18} 130 L0 130 Z`));
    if (L.zebra) {                                         // motif zébré (Peugeot 2026)
      ctx.fillStyle = L.zebra;
      for (let i = 0; i < 14; i++) {
        const x = 10 + i * 30 + (i % 3) * 6;
        ctx.fill(P(`M${x} 130 L${x + 26} 30 L${x + 34 + (i % 2) * 6} 30 L${x + 12 + (i % 2) * 4} 130 Z`));
      }
    }
    ctx.fillStyle = L.stripe; ctx.fill(P(`M${cx - 18} 130 L${cx + 30} 0 L${cx + 48} 0 L${cx} 130 Z`));
    if (L.stripe2) { ctx.fillStyle = L.stripe2; ctx.fill(P(`M${cx + 4} 130 L${cx + 52} 0 L${cx + 60} 0 L${cx + 12} 130 Z`)); }
    if (L.stripe3) { ctx.fillStyle = L.stripe3; ctx.fill(P(`M${cx + 16} 130 L${cx + 64} 0 L${cx + 72} 0 L${cx + 24} 130 Z`)); }
    ctx.fillStyle = L.rear; ctx.fill(P(`M${rx - 10} 0 L420 0 L420 130 L${rx - 40} 130 Z`));
    // Bas de caisse sombre, ligne de caisse et reflets
    ctx.fillStyle = "rgba(0,0,0,.45)"; ctx.fill(P(`M0 96 L420 92 L420 106 L0 106 Z`));
    ctx.strokeStyle = "rgba(0,0,0,.25)"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(40, nt + 8); ctx.lineTo(tl - 10, ty + 12); ctx.stroke();
    const hl = ctx.createLinearGradient(0, 30, 0, 106);
    hl.addColorStop(0, "rgba(255,255,255,.3)"); hl.addColorStop(.4, "rgba(255,255,255,0)"); hl.addColorStop(1, "rgba(0,0,0,.3)");
    ctx.fillStyle = hl; ctx.fillRect(0, 0, 420, 130);
    ctx.restore();
    ctx.strokeStyle = "rgba(255,255,255,.2)"; ctx.lineWidth = 0.7; ctx.stroke(body);

    // Détails sombres : entrée d'air, ouïes, diffuseur, lame avant
    ctx.fillStyle = "rgba(0,0,0,.55)";
    ctx.fill(P(S.intake)); ctx.fill(P(S.diffuser));
    if (S.gap) ctx.fill(P(S.gap));
    if (S.vent) ctx.fill(P(S.vent));
    ctx.fillStyle = "#0b0b0e"; ctx.fill(P(S.splitter));
    ctx.fillStyle = L.wing;
    if (S.scoop) ctx.fill(P(S.scoop));
    if (S.pod) ctx.fill(P(S.pod));
    ctx.fill(P(S.mirror));

    // Vitrage
    const glass = ctx.createLinearGradient(cx - 30, cy, cx + 40, cy + 20);
    glass.addColorStop(0, "#0b0d14"); glass.addColorStop(.45, "#3a4256"); glass.addColorStop(1, "#0b0d14");
    ctx.fillStyle = glass;
    if (S.bubble) ctx.fill(P(S.bubble));
    ctx.fill(P(S.glass));

    // Phares : signature lumineuse de chaque marque
    ctx.save();
    ctx.shadowColor = L.light; ctx.shadowBlur = 12; ctx.fillStyle = L.light;
    const ly = nt + 6;
    switch (L.lights) {
      case "claws": [0, 7, 14].forEach(o => ctx.fill(P(`M${12 + o} ${ly - 4} l4 0 l-3 10 l-4 0 Z`))); break;
      case "vertical": ctx.fillRect(14, ly - 6, 3, 14); break;
      case "dual": ctx.fillRect(12, ly - 2, 30, 2.2); ctx.fillRect(14, ly + 2, 26, 2.2); break;
      case "four": [0, 9, 18, 27].forEach(o => ctx.fillRect(12 + o, ly, 6, 2.4)); break;
      case "bar": ctx.fillRect(6, nose - 9, 44, 2.6); break;
      case "round": ctx.beginPath(); ctx.ellipse(26, ly + 1, 10, 4.5, -0.15, 0, Math.PI * 2); ctx.fill(); break;
      case "kidney":
        ctx.fillRect(14, ly - 1, 26, 2.4);
        ctx.fillStyle = "rgba(0,0,0,.6)"; ctx.fill(P(`M4 ${nose - 3} L10 ${nt + 6} L20 ${nt + 6} L18 ${nose - 3} Z`)); break;
      default: ctx.fill(P(`M10 ${ly + 2} L44 ${ly - 4} L46 ${ly - 1} L12 ${ly + 5} Z`));
    }
    // Feu arrière
    ctx.shadowColor = "#ff2020"; ctx.fillStyle = "#ff3030";
    ctx.fillRect(tl - 5, ty + 5, 4, 10);
    ctx.restore();

    // Rond du numéro
    if (number) {
      const [rx2, ry] = S.roundel;
      ctx.fillStyle = L.roundel; ctx.beginPath(); ctx.arc(rx2, ry, 12, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = L.num; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.font = `italic 800 ${number.length > 2 ? 11 : 15}px "Barlow Condensed", "Arial Narrow", sans-serif`;
      ctx.fillText(number, rx2, ry + 1);
    }

    // Roues : pneu à flanc marqué, jante noire à branches, étrier
    S.wheels.forEach(([x, y]) => {
      ctx.fillStyle = "#0a0a0c"; ctx.beginPath(); ctx.arc(x, y, 29, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = L.stripe === "#ffffff" ? "#d0d4dc" : "#e8c400"; ctx.globalAlpha = .55; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(x, y, 25.5, Math.PI * 1.1, Math.PI * 1.45); ctx.stroke(); ctx.globalAlpha = 1;   // marquage du pneu
      ctx.fillStyle = "#1b1d22"; ctx.beginPath(); ctx.arc(x, y, 20, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#5c616c"; ctx.lineWidth = 2.4;
      for (let k = 0; k < 10; k++) {
        const a = k * Math.PI / 5;
        ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * 5, y + Math.sin(a) * 5); ctx.lineTo(x + Math.cos(a) * 19, y + Math.sin(a) * 19); ctx.stroke();
      }
      ctx.fillStyle = "#9aa0aa"; ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = L.stripe; ctx.fillRect(x - 21, y - 9, 5, 18);
    });
  }

  window.LM_CARS = { draw, shapes, list: Object.keys(CARS) };
})();
