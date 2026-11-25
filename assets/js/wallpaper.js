/* =========================================================
   Générateur de fonds d'écran (dessinés dans un <canvas>)
   ========================================================= */
(() => {
  const root = document.querySelector(".wp");
  if (!root) return;
  const teams = JSON.parse(document.getElementById("wp-data").textContent);
  const canvas = root.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const dl = root.querySelector(".wp-dl");
  // Même silhouette que assets/img/silhouette.svg (viewBox 400 × 124)
  const CAR = [
    new Path2D("M4 94 C6 88 16 85 32 83 C52 80 62 66 92 62 C118 59 132 66 146 68 C160 66 170 52 190 44 C210 37 238 36 256 42 C268 46 274 54 282 58 L336 60 L344 30 L398 26 L398 40 L362 44 L360 64 C378 66 392 72 396 82 L396 96 L350 96 A30 30 0 0 0 290 96 L126 96 A30 30 0 0 0 66 96 L4 96 Z"),
    new Path2D("M236 38 L338 32 L342 60 L266 54 Z"),
  ];
  const WHEELS = [[96, 98], [320, 98]];

  const val = name => root.querySelector(`input[name="${name}"]:checked`).value;

  function draw() {
    const t = teams.find(x => x.slug === root.querySelector(".wp-team").value);
    const phone = val("fmt") === "phone";
    const style = +val("style");
    const W = phone ? 1080 : 1920, H = phone ? 1920 : 1080;
    canvas.width = W; canvas.height = H;
    canvas.parentElement.classList.toggle("phone", phone);

    // Fond
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, style === 2 ? "#101218" : "#07080c");
    bg.addColorStop(1, style === 1 ? "#02030a" : "#14171f");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    if (style === 0) {                                   // Rayures diagonales
      ctx.save(); ctx.translate(W * 0.62, 0); ctx.rotate(0.35);
      [[0, 140, 1], [170, 40, 0.6], [240, 18, 0.35]].forEach(([x, w, a]) => { ctx.globalAlpha = a; ctx.fillStyle = t.color; ctx.fillRect(x, -H, w, H * 3); });
      ctx.restore(); ctx.globalAlpha = 1;
    } else if (style === 1) {                            // Nuit : traînées lumineuses
      for (let i = 0; i < 40; i++) {
        const y = H * (0.45 + Math.random() * 0.5), x = Math.random() * W, len = 200 + Math.random() * 600;
        const g = ctx.createLinearGradient(x, 0, x + len, 0);
        const col = i % 3 ? "#ff2a2a" : "#ffe9b0";
        g.addColorStop(0, "transparent"); g.addColorStop(1, col);
        ctx.strokeStyle = g; ctx.lineWidth = 2 + Math.random() * 3; ctx.globalAlpha = 0.5 + Math.random() * 0.5;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + len, y); ctx.stroke();
      }
      ctx.globalAlpha = 1;
      const glow = ctx.createRadialGradient(W * 0.7, H * 0.4, 0, W * 0.7, H * 0.4, W * 0.6);
      glow.addColorStop(0, t.color + "55"); glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
    } else {                                             // Minimal : une ligne fine
      ctx.fillStyle = t.color; ctx.fillRect(0, H - 24, W, 24);
    }

    // Grand numéro en contour
    const big = phone ? 760 : 820;
    ctx.font = `italic 800 ${big}px "Barlow Condensed", "Arial Narrow", sans-serif`;
    ctx.textAlign = "right"; ctx.textBaseline = "middle";
    ctx.lineWidth = 6; ctx.strokeStyle = t.color + "66";
    ctx.strokeText(t.number, phone ? W - 40 : W - 80, phone ? H * 0.3 : H * 0.48);

    // Silhouette de la voiture
    const cw = phone ? W * 0.9 : W * 0.55, s = cw / 400;
    ctx.save();
    ctx.translate(phone ? W * 0.05 : W * 0.4, phone ? H * 0.5 : H * 0.55);
    ctx.scale(s, s);
    const g = ctx.createLinearGradient(0, 0, 400, 0);
    g.addColorStop(0, t.color); g.addColorStop(1, "#ffffff");
    ctx.shadowColor = t.color; ctx.shadowBlur = 40;
    ctx.fillStyle = g;
    CAR.forEach(p => ctx.fill(p));
    ctx.shadowBlur = 0; ctx.fillStyle = "#0b0d12";
    WHEELS.forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, 24, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = t.color; ctx.lineWidth = 3; ctx.stroke(); });
    ctx.restore();

    // Textes
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic"; ctx.fillStyle = "#eef1f7";
    const x = phone ? 70 : 110, y = phone ? H * 0.78 : H * 0.36;
    ctx.font = `800 ${phone ? 150 : 170}px "Barlow Condensed", "Arial Narrow", sans-serif`;
    ctx.fillText(t.name.toUpperCase(), x, y);
    ctx.fillStyle = t.color;
    ctx.font = `700 ${phone ? 70 : 72}px "Barlow Condensed", "Arial Narrow", sans-serif`;
    ctx.fillText(t.car.toUpperCase(), x, y + (phone ? 90 : 90));
    ctx.fillStyle = "#9aa3b5";
    ctx.font = `700 ${phone ? 38 : 34}px "Inter", sans-serif`;
    ctx.fillText(document.documentElement.lang === "en" ? "24 HOURS OF LE MANS · HYPERCAR" : "24 HEURES DU MANS · HYPERCAR", x, y + (phone ? 160 : 150));

    dl.download = `le-mans-${t.slug}-${phone ? "telephone" : "ordinateur"}.png`;
  }

  dl.addEventListener("click", e => {
    e.preventDefault();
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = dl.download;
      document.body.append(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    }, "image/png");
  });
  root.addEventListener("change", draw);
  // On attend les polices pour que le texte soit bien dessiné
  (document.fonts?.ready || Promise.resolve()).then(draw);
  draw();
})();
