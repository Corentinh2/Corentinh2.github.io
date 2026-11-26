/* =========================================================
   Mini-jeu : l'arrêt aux stands parfait
   1. arrêter la voiture sur la zone   2. changer les 4 pneus
   3. faire le plein (zone verte)       4. repartir au feu vert
   ========================================================= */
(() => {
  const root = document.querySelector(".game");
  if (!root) return;
  const T = JSON.parse(document.getElementById("game-data").textContent);
  const $ = s => root.querySelector(s);
  const car = $(".g-car"), lane = $(".pitlane"), msg = $(".g-msg"), lights = [...root.querySelectorAll(".lights i")];
  const wheels = [...root.querySelectorAll(".wheel")];
  const fuel = $(".fuel"), fuelBar = $(".fuel-bar i"), fuelBtn = $(".fuel-btn"), fuelOk = $(".fuel-ok");
  const tEl = $(".g-time"), pEl = $(".g-pen"), bEl = $(".g-best");
  const KEY = "lemans-pitstop-best";
  // Le stockage peut être bloqué (navigation privée, cookies désactivés) : on ne doit pas planter
  const load = () => { try { return parseFloat(localStorage.getItem(KEY)) || null; } catch (e) { return null; } };
  const save = v => { try { localStorage.setItem(KEY, v); } catch (e) {} };
  let best = load();
  let timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  let phase = "idle", t0 = 0, pen = 0, raf = 0, carY = 0, wheelOrder = [], fuelLvl = 0, filling = false, okZone = [0, 0], greenAt = 0;

  const show = s => { msg.textContent = s; msg.classList.remove("pop"); void msg.offsetWidth; msg.classList.add("pop"); };
  const fmt = s => `${s.toFixed(2)} s`;
  bEl.textContent = best ? fmt(best) : "—";
  const elapsed = () => (performance.now() - t0) / 1000;
  const addPen = (s, text) => { pen += s; pEl.textContent = `${pen} s`; show(text); lane.classList.add("shake"); setTimeout(() => lane.classList.remove("shake"), 400); };

  function tick() {
    tEl.textContent = fmt(elapsed() + pen);
    if (phase === "brake") {
      carY += 0.55;                                  // la voiture descend la voie des stands (en %)
      car.style.top = `${carY}%`;
      if (carY > 78) { addPen(2, T.msgs.miss); stopCar(); }
    }
    if (phase === "fuel") {
      if (filling) fuelLvl = Math.min(100, fuelLvl + 0.9);
      fuelBar.style.width = `${fuelLvl}%`;
    }
    raf = requestAnimationFrame(tick);
  }

  function start() {
    timers.forEach(clearTimeout); timers = [];          // annule les minuteries d'une partie précédente
    car.classList.remove("leave");
    $(".game-start").hidden = true; $(".game-end").hidden = true;
    pen = 0; pEl.textContent = "0 s"; carY = -30; car.style.top = `${carY}%`;
    wheels.forEach(w => w.classList.remove("done", "next"));
    lights.forEach(l => l.className = "");
    fuel.hidden = true; fuelLvl = 0; fuelBar.style.width = "0";
    t0 = performance.now(); phase = "brake"; show(T.msgs.brake);
    cancelAnimationFrame(raf); raf = requestAnimationFrame(tick);
  }

  function stopCar() {
    if (phase !== "brake") return;
    // La zone jaune se trouve entre 38 % et 46 %
    const diff = Math.abs(carY - 42);
    if (diff > 6 && carY <= 78) addPen(2, T.msgs.miss); else if (diff <= 2) show(T.msgs.perfect);
    carY = 42; car.style.top = "42%";
    phase = "wheels";
    wheelOrder = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
    later(() => { show(T.msgs.wheels); nextWheel(); }, 250);
  }

  function nextWheel() {
    wheels.forEach(w => w.classList.remove("next"));
    if (!wheelOrder.length) return startFuel();
    wheels[wheelOrder[0]].classList.add("next");
  }

  wheels.forEach(w => w.addEventListener("click", e => {
    e.stopPropagation();
    if (phase !== "wheels") return;
    if (+w.dataset.w === wheelOrder[0]) { w.classList.add("done"); wheelOrder.shift(); nextWheel(); }
    else addPen(1, T.msgs.miss.replace("2", "1"));
  }));

  function startFuel() {
    phase = "fuel"; fuel.hidden = false; show(T.msgs.fuel);
    const a = 62 + Math.random() * 20;               // zone verte aléatoire
    okZone = [a, a + 10];
    fuelOk.style.left = `${okZone[0]}%`; fuelOk.style.width = "10%";
  }
  const fillOn = e => { if (phase === "fuel") { e.preventDefault(); filling = true; } };
  const fillOff = () => {
    if (phase !== "fuel" || !filling) return;
    filling = false;
    if (fuelLvl < okZone[0]) addPen(3, T.msgs.under);
    else if (fuelLvl > okZone[1]) addPen(3, T.msgs.over);
    else show(T.msgs.perfect);
    fuel.hidden = true;
    startRelease();
  };
  fuelBtn.addEventListener("pointerdown", fillOn);
  addEventListener("pointerup", fillOff);
  fuelBtn.addEventListener("keydown", e => { if (e.key === " " || e.key === "Enter") fillOn(e); });
  fuelBtn.addEventListener("keyup", e => { if (e.key === " " || e.key === "Enter") fillOff(); });

  function startRelease() {
    phase = "release"; show(T.msgs.go);
    lights.forEach(l => l.className = "red");
    const wait = 900 + Math.random() * 2200;
    greenAt = performance.now() + wait;
    later(() => { if (phase === "release") { lights.forEach(l => l.className = "green"); show(T.msgs.now); } }, wait);
  }

  function release() {
    if (performance.now() < greenAt) { addPen(5, T.msgs.early); return; }
    phase = "leaving";
    car.classList.add("leave");
    later(() => { car.style.top = "130%"; car.classList.remove("leave"); finish(); }, 600);
  }

  function finish() {
    cancelAnimationFrame(raf);
    phase = "end";
    const total = elapsed() + pen - 0.6;
    tEl.textContent = fmt(total);
    $(".game-end").hidden = false;
    let text = fmt(total);
    if (!best || total < best) { best = total; save(best); bEl.textContent = fmt(best); text += ` · ${T.newBest}`; }
    $(".g-final").textContent = text;
    $(".g-verdict").textContent = T.end[total < 9 ? 0 : total < 12 ? 1 : total < 16 ? 2 : 3];
  }

  // Un seul geste (clic sur la voie ou touche Espace) pour freiner et repartir
  const action = () => { if (phase === "brake") stopCar(); else if (phase === "release") release(); };
  lane.addEventListener("click", action);
  addEventListener("keydown", e => {
    if (e.code === "Space" && (phase === "brake" || phase === "release") && document.activeElement !== fuelBtn) { e.preventDefault(); action(); }
  });
  $(".g-go").addEventListener("click", start);
  $(".g-again").addEventListener("click", start);
})();
