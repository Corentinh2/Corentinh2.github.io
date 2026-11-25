/* =========================================================
   Dessins vectoriels des hypercars (vue de profil).
   Tracés originaux, faits à la main à partir des proportions
   de chaque voiture : aucune photo n'est utilisée.
   Repère : 420 × 130, voiture tournée vers la gauche,
   roues avant (x = 86) et arrière (x = 338), sol à y = 122.
   ========================================================= */
(() => {
  // Valeurs par défaut d'un prototype Hypercar (proportions : 5 m de long,
  // 1,05 m de haut, roues de 72 cm, empattement de 3,15 m)
  const BASE = {
    nose: 96, lip: 80,            // museau : hauteur de la pointe et de la lèvre
    fx: 92, fy: 50,               // sommet de l'aile avant (au-dessus de la roue avant)
    vy: 64,                       // creux entre l'aile avant et le cockpit
    cx: 210, cy: 38, ce: 252,     // cockpit : centre, hauteur du toit, fin du toit
    rx: 336, rfy: 54,             // sommet de l'aile arrière (au-dessus de la roue arrière)
    ty: 80, tl: 412,              // arrière de la voiture
    wx: 350, wy: 26,              // aileron arrière
    fin: true, scoop: false, bubble: false, frontGap: false,
  };

  // Particularités de chaque voiture + livrée (couleurs d'inspiration, sans logos)
  const CARS = {
    toyota:      { fx: 94, fy: 50, cx: 212, cy: 38, ce: 256, rfy: 54,
                   livery: { base: "#f3f3f3", nose: "#d8001a", stripe: "#d8001a", rear: "#141414", wing: "#141414", light: "#ffffff", num: "#141414", roundel: "#ffffff" } },
    ferrari:     { fx: 90, fy: 41, vy: 68, cx: 206, cy: 42, ce: 248, rx: 334, rfy: 45, ty: 74, wx: 358, wy: 36,
                   livery: { base: "#cf1010", nose: "#cf1010", stripe: "#ffd400", rear: "#a30808", wing: "#141414", light: "#ffe9b0", num: "#141414", roundel: "#ffd400" } },
    bmw:         { nose: 90, lip: 72, fx: 96, fy: 48, cy: 38, rfy: 52, wx: 344, wy: 20,
                   livery: { base: "#eef2f7", nose: "#1c69d4", stripe: "#0a2a66", stripe2: "#e4002b", rear: "#1c69d4", wing: "#141414", light: "#ffffff", num: "#0a2a66", roundel: "#ffffff" } },
    cadillac:    { fx: 92, fy: 52, cy: 40, rfy: 56, ty: 86, tl: 414, wx: 352, wy: 32,
                   livery: { base: "#161616", nose: "#161616", stripe: "#ffd000", rear: "#161616", wing: "#0b0b0b", light: "#ffffff", num: "#161616", roundel: "#ffd000", vlight: true } },
    peugeot:     { nose: 92, lip: 72, fx: 96, fy: 47, cy: 36, rfy: 49, ty: 72, wx: 356, wy: 23,
                   livery: { base: "#3c4046", nose: "#3c4046", stripe: "#c6f432", rear: "#1e2024", wing: "#1e2024", light: "#c6f432", num: "#1e2024", roundel: "#c6f432", claws: true } },
    alpine:      { fx: 94, fy: 50, cy: 39, rfy: 53,
                   livery: { base: "#1f5fff", nose: "#1f5fff", stripe: "#ffffff", stripe2: "#e4002b", rear: "#0b1d55", wing: "#0b1d55", light: "#ffffff", num: "#0b1d55", roundel: "#ffffff" } },
    aston:       { fx: 88, fy: 45, vy: 70, cx: 198, cy: 31, ce: 244, rfy: 58, ty: 84, wx: 362, wy: 38, bubble: true, frontGap: true,
                   livery: { base: "#00594f", nose: "#00594f", stripe: "#c6ff00", rear: "#003b33", wing: "#003b33", light: "#ffffff", num: "#003b33", roundel: "#c6ff00" } },
    genesis:     { fx: 94, fy: 50, cy: 38, rfy: 53, wy: 25,
                   livery: { base: "#2b2b30", nose: "#2b2b30", stripe: "#ff7a2f", rear: "#ff7a2f", wing: "#141414", light: "#ffffff", num: "#2b2b30", roundel: "#ffffff", dual: true } },
    porsche:     { fx: 92, fy: 49, cy: 39, rfy: 52,
                   livery: { base: "#f5f5f5", nose: "#f5f5f5", stripe: "#d5001c", rear: "#141414", wing: "#141414", light: "#ffffff", num: "#141414", roundel: "#ffffff", bar: true } },
    glickenhaus: { fx: 90, fy: 41, vy: 68, cx: 216, cy: 40, rfy: 45, ty: 74, wx: 356, scoop: true,
                   livery: { base: "#34c1f0", nose: "#ffffff", stripe: "#e4002b", stripe2: "#ffffff", rear: "#0d3550", wing: "#0d3550", light: "#ffffff", num: "#0d3550", roundel: "#ffffff" } },
  };

  // Construit les tracés d'une voiture à partir de ses paramètres
  function shapes(slug) {
    const p = { ...BASE, ...(CARS[slug] || {}) };
    const { nose, lip, fx, fy, vy, cx, cy, ce, rx, rfy, ty, tl, wx, wy } = p;
    p.dx = rx; p.deck = rfy;
    const S = {};
    S.body =
      `M4 ${nose} C8 ${nose - 8} 30 ${lip} 46 ${lip - 6} ` +                                   // museau
      `C60 ${fy + 12} 70 ${fy} ${fx} ${fy} ` +                                                 // montée vers l'aile avant
      `C${fx + 22} ${fy} ${fx + 36} ${vy - 6} ${fx + 50} ${vy} ` +                              // arrière de l'aile avant
      `C${fx + 66} ${vy + 2} ${cx - 42} ${cy + 18} ${cx - 24} ${cy + 6} ` +                     // pare-brise
      `C${cx - 12} ${cy} ${cx + 14} ${cy - 2} ${ce} ${cy + 6} ` +                               // toit
      `C${ce + 22} ${cy + 16} ${rx - 44} ${rfy + 4} ${rx} ${rfy} ` +                            // vers l'aile arrière
      `C${rx + 30} ${rfy - 1} ${tl - 10} ${ty - 12} ${tl} ${ty} ` +                             // arrière
      `L${tl} 110 L366 110 A33 33 0 1 0 310 110 L114 110 A33 33 0 1 0 58 110 L4 110 Z`;       // passages de roues
    S.glass =
      `M${cx - 34} ${cy + 15} C${cx - 22} ${cy + 6} ${cx - 4} ${cy + 3} ${cx + 14} ${cy + 3} ` +
      `C${cx + 26} ${cy + 3} ${ce - 14} ${cy + 6} ${ce - 6} ${cy + 9} L${ce - 10} ${cy + 15} ` +
      `C${cx + 10} ${cy + 12} ${cx - 14} ${cy + 14} ${cx - 34} ${cy + 20} Z`;
    S.fin = p.fin ? `M${cx + 14} ${cy - 1} L${wx - 4} ${wy + 8} L${wx} ${rfy + 2} L${ce + 4} ${cy + 10} Z` : "";
    S.wing =
      `M${wx} ${wy} L414 ${wy - 4} L414 ${wy + 4} L${wx + 2} ${wy + 7} Z ` +                    // plan principal
      `M398 ${wy - 6} L414 ${wy - 6} L414 ${ty} L398 ${ty - 6} Z ` +                             // dérive latérale
      `M${wx + 24} ${wy + 6} L${wx + 30} ${wy + 6} L${wx + 28} ${rfy + 4} L${wx + 22} ${rfy + 4} Z`; // support
    S.scoop = p.scoop ? `M${cx - 6} ${cy + 1} L${cx - 2} ${cy - 13} L${cx + 22} ${cy - 13} L${cx + 26} ${cy + 1} Z` : "";
    // Valkyrie : canopée en goutte d'eau très marquée et passage d'air sous l'aile avant
    S.bubble = p.bubble ? `M${cx - 28} ${cy + 12} C${cx - 16} ${cy - 4} ${cx + 20} ${cy - 6} ${cx + 46} ${cy + 10} Z` : "";
    S.gap = p.frontGap ? `M34 98 C56 86 102 84 130 90 L126 96 C100 92 62 94 38 102 Z` : "";
    S.light = `M8 ${nose - 8} L42 ${lip - 5} L45 ${lip - 1} L10 ${nose - 4} Z`;
    S.wheels = [[86, 93], [338, 93]];
    S.roundel = [ce + 10, 82];
    S.p = p;
    return S;
  }

  // Dessine la voiture dans un contexte <canvas> (repère 420 × 130)
  function draw(ctx, slug, number = "", { glow = null } = {}) {
    const S = shapes(slug);
    const L = S.p.livery || { base: "#ccc", nose: "#ccc", stripe: "#888", rear: "#333", wing: "#222", light: "#fff", num: "#111", roundel: "#fff" };
    const { cx, cy, fx, dx, deck, nose, lip } = S.p;
    const body = new Path2D(S.body);

    // Ombre au sol
    ctx.save();
    const sh = ctx.createRadialGradient(210, 122, 10, 210, 122, 220);
    sh.addColorStop(0, "rgba(0,0,0,.55)"); sh.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = sh; ctx.fillRect(-20, 112, 460, 22);
    ctx.restore();

    // Aileron et dérive (derrière la carrosserie)
    ctx.fillStyle = L.wing; ctx.strokeStyle = "rgba(255,255,255,.22)"; ctx.lineWidth = 0.8;
    if (S.fin) { const f = new Path2D(S.fin); ctx.fill(f); ctx.stroke(f); }
    const w = new Path2D(S.wing); ctx.fill(w); ctx.stroke(w);

    // Carrosserie + livrée (découpée selon la forme de la voiture)
    ctx.save();
    if (glow) { ctx.shadowColor = glow; ctx.shadowBlur = 50; }
    ctx.fillStyle = L.base; ctx.fill(body);
    ctx.restore();
    ctx.strokeStyle = "rgba(255,255,255,.18)"; ctx.lineWidth = 0.8; ctx.stroke(body);
    ctx.save();
    ctx.clip(body);
    ctx.fillStyle = L.nose; ctx.fill(new Path2D(`M0 0 L${fx + 14} 0 L${fx - 24} 130 L0 130 Z`));
    ctx.fillStyle = L.stripe; ctx.fill(new Path2D(`M${cx - 14} 130 L${cx + 36} 0 L${cx + 56} 0 L${cx + 6} 130 Z`));
    if (L.stripe2) { ctx.fillStyle = L.stripe2; ctx.fill(new Path2D(`M${cx + 10} 130 L${cx + 60} 0 L${cx + 68} 0 L${cx + 18} 130 Z`)); }
    ctx.fillStyle = L.rear; ctx.fill(new Path2D(`M${dx + 4} 0 L420 0 L420 130 L${dx - 26} 130 Z`));
    // Bas de caisse sombre + reflet sur le haut
    ctx.fillStyle = "rgba(0,0,0,.35)"; ctx.fillRect(0, 101, 420, 10);
    const hl = ctx.createLinearGradient(0, 30, 0, 100);
    hl.addColorStop(0, "rgba(255,255,255,.28)"); hl.addColorStop(.45, "rgba(255,255,255,0)"); hl.addColorStop(1, "rgba(0,0,0,.25)");
    ctx.fillStyle = hl; ctx.fillRect(0, 0, 420, 130);
    ctx.restore();

    if (S.gap) { ctx.fillStyle = "rgba(0,0,0,.65)"; ctx.fill(new Path2D(S.gap)); }
    if (S.scoop) { ctx.fillStyle = L.wing; ctx.fill(new Path2D(S.scoop)); }

    // Vitrage
    const glass = ctx.createLinearGradient(cx - 40, cy, cx + 40, cy + 24);
    glass.addColorStop(0, "#0b0d14"); glass.addColorStop(.5, "#2a3142"); glass.addColorStop(1, "#0b0d14");
    ctx.fillStyle = glass;
    if (S.bubble) ctx.fill(new Path2D(S.bubble));
    ctx.fill(new Path2D(S.glass));

    // Phares (signature lumineuse de chaque marque)
    ctx.save();
    ctx.shadowColor = L.light; ctx.shadowBlur = 14; ctx.fillStyle = L.light;
    if (L.claws) [0, 6, 12].forEach(o => ctx.fill(new Path2D(`M${10 + o} ${nose - 10} l4 0 l-3 9 l-4 0 Z`)));
    else if (L.vlight) ctx.fillRect(12, lip - 8, 3, 14);
    else if (L.dual) { ctx.fillRect(10, lip - 2, 30, 2.4); ctx.fillRect(12, lip + 2, 26, 2.4); }
    else if (L.bar) ctx.fillRect(8, lip - 1, 40, 3);
    else ctx.fill(new Path2D(S.light));
    // Feu arrière
    ctx.shadowColor = "#ff2020"; ctx.fillStyle = "#ff3030";
    ctx.fillRect(S.p.tl - 5, S.p.ty + 2, 4, 8);
    ctx.restore();

    // Rond du numéro
    if (number) {
      const [rx, ry] = S.roundel;
      ctx.fillStyle = L.roundel; ctx.beginPath(); ctx.arc(rx, ry, 13, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = L.num; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.font = `italic 800 ${number.length > 2 ? 12 : 16}px "Barlow Condensed", "Arial Narrow", sans-serif`;
      ctx.fillText(number, rx, ry + 1);
    }

    // Roues : pneu, jante à branches, étrier
    S.wheels.forEach(([x, y]) => {
      ctx.fillStyle = "#0a0a0c"; ctx.beginPath(); ctx.arc(x, y, 29, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#2c2f36"; ctx.beginPath(); ctx.arc(x, y, 20, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#8a909c"; ctx.lineWidth = 2.2;
      for (let k = 0; k < 10; k++) {
        const a = k * Math.PI / 5;
        ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * 4, y + Math.sin(a) * 4); ctx.lineTo(x + Math.cos(a) * 19, y + Math.sin(a) * 19); ctx.stroke();
      }
      ctx.fillStyle = L.stripe; ctx.beginPath(); ctx.arc(x, y, 4.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = L.stripe; ctx.fillRect(x - 21, y - 8, 5, 16);
    });
  }

  window.LM_CARS = { draw, shapes, list: Object.keys(CARS) };
})();
