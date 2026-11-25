/* =========================================================
   Quiz : 12 questions, score animé et confettis
   ========================================================= */
(() => {
  const root = document.querySelector(".quiz");
  if (!root) return;
  const { q: questions, t: T } = JSON.parse(document.getElementById("quiz-data").textContent);
  const $ = s => root.querySelector(s);
  const start = $(".quiz-start"), body = $(".quiz-body"), end = $(".quiz-end");
  const qEl = $(".quiz-q"), answers = $(".quiz-answers"), feedback = $(".quiz-feedback"), next = $(".quiz-next");
  let order = [], idx = 0, score = 0;

  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  function begin() {
    order = shuffle(questions.map((_, i) => i));
    idx = 0; score = 0;
    start.hidden = true; end.hidden = true; body.hidden = false;
    show();
  }

  function show() {
    const [text, opts, good] = questions[order[idx]];
    $(".quiz-count").textContent = `${T.question} ${idx + 1}/${questions.length}`;
    $(".quiz-score").textContent = `${score} ★`;
    $(".quiz-progress i").style.width = `${idx / questions.length * 100}%`;
    qEl.textContent = text;
    qEl.classList.remove("enter"); void qEl.offsetWidth; qEl.classList.add("enter");
    feedback.innerHTML = "";
    next.hidden = true;
    // Les réponses sont mélangées à chaque fois
    answers.innerHTML = "";
    shuffle(opts.map((o, i) => [o, i])).forEach(([o, i]) => {
      const b = document.createElement("button");
      b.textContent = o;
      b.addEventListener("click", () => answer(b, i === good));
      b.dataset.good = i === good;
      answers.append(b);
    });
    answers.querySelector("button").focus({ preventScroll: true });
  }

  function answer(btn, ok) {
    const [, , , why] = questions[order[idx]];
    answers.querySelectorAll("button").forEach(b => {
      b.disabled = true;
      if (b.dataset.good === "true") b.classList.add("ok");
    });
    if (ok) score++; else btn.classList.add("ko");
    feedback.innerHTML = `<b class="${ok ? "ok" : "ko"}">${ok ? T.good : T.bad}</b> ${why}`;
    $(".quiz-score").textContent = `${score} ★`;
    next.textContent = idx < questions.length - 1 ? `${T.next} →` : `${T.results} →`;
    next.hidden = false;
    next.focus({ preventScroll: true });
  }

  next.addEventListener("click", () => {
    idx++;
    if (idx < questions.length) show(); else finish();
  });

  function finish() {
    body.hidden = true; end.hidden = false;
    const ratio = score / questions.length;
    const ring = $(".score-ring .ring"), val = $(".score-val");
    ring.style.strokeDashoffset = 327;
    requestAnimationFrame(() => requestAnimationFrame(() => ring.style.strokeDashoffset = 327 * (1 - ratio)));
    // Compteur du score
    const t0 = performance.now();
    const tick = now => {
      const k = Math.min(1, (now - t0) / 1400);
      val.textContent = `${Math.round(score * (1 - Math.pow(1 - k, 3)))}/${questions.length}`;
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    $(".quiz-verdict").textContent = T.verdicts[ratio < .4 ? 0 : ratio < .7 ? 1 : ratio < 1 ? 2 : 3];
    if (ratio >= .7 && !matchMedia("(prefers-reduced-motion: reduce)").matches) confetti();
  }

  function confetti() {
    const colors = ["#ffd400", "#ff2b3d", "#3d8bff", "#2fd3a0", "#ffffff"];
    for (let i = 0; i < 80; i++) {
      const c = document.createElement("i");
      c.className = "confetti";
      c.style.left = `${Math.random() * 100}vw`;
      c.style.background = colors[i % colors.length];
      c.style.animationDelay = `${Math.random() * .8}s`;
      c.style.animationDuration = `${2 + Math.random() * 1.5}s`;
      document.body.append(c);
      setTimeout(() => c.remove(), 4500);
    }
  }

  $(".quiz-go").addEventListener("click", begin);
  $(".quiz-restart").addEventListener("click", begin);
})();
