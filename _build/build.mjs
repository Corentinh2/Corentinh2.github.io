// Générateur du site : node _build/build.mjs
// Produit les pages françaises à la racine et les pages anglaises dans /en/,
// ainsi que sitemap.xml, robots.txt et le service worker (sw.js).
import { writeFileSync, mkdirSync, readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { teams, archivesExtra, board, SITE_URL, RACE_2027, GOATCOUNTER, historyImages, crewImages, driverImages, classImages, results } from "./data.mjs";
import frBase from "./i18n/fr.mjs";
import enBase from "./i18n/en.mjs";
import frX from "./i18n/fr-extra.mjs";
import enX from "./i18n/en-extra.mjs";
const fr = { ...frBase, x: frX };
const en = { ...enBase, x: enX };
const credits = JSON.parse(readFileSync(new URL("./credits.json", import.meta.url), "utf8"));

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const written = [];
const write = (rel, html) => {
  const full = join(ROOT, rel);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, html.replace(/\n\s*\n\s*\n/g, "\n\n"));
  written.push(rel.replace(/\\/g, "/"));
};
const gridTeams = teams.filter(t => t.grid);
const otherTeams = teams.filter(t => !t.grid);
const esc = s => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const json = o => JSON.stringify(o).replace(/</g, "\\u003c");

const FAVICON = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#ffd400"/><text x="32" y="44" font-family="Arial Black,Arial" font-weight="900" font-style="italic" font-size="30" text-anchor="middle" fill="#000">24</text></svg>`)}`;

/* ============================================================
   Gabarits communs
   ============================================================ */
function ctx(T, file, opts = {}) {
  const isEn = T.lang === "en";
  const B = opts.abs ? "/" + (isEn ? "en/" : "") : "";
  const A = opts.abs ? "/" : isEn ? "../" : "";             // préfixe des assets
  return { T, file, B, A, isEn };
}

const FONTS = "https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,600;0,700;0,800;1,800&family=Inter:wght@400;500;600;700;800&display=swap";
function head(c, { title, desc, accent = "#ffd400", scripts = [], hero = null }) {
  const { T, file, A, isEn } = c;
  const frURL = `${SITE_URL}/${file === "index.html" ? "" : file}`;
  const enURL = `${SITE_URL}/en/${file === "index.html" ? "" : file}`;
  const canonical = isEn ? enURL : frURL;
  return `<!DOCTYPE html>
<html lang="${T.lang}" class="no-js">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${esc(desc)}">
  <meta name="theme-color" content="#07080c">
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" hreflang="fr" href="${frURL}">
  <link rel="alternate" hreflang="en" href="${enURL}">
  <link rel="alternate" hreflang="x-default" href="${frURL}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Le Mans Hypercars">
  <meta property="og:locale" content="${T.locale.replace("-", "_")}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${SITE_URL}/assets/img/og.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="${FAVICON}">
  <link rel="apple-touch-icon" href="${A}assets/img/icon-192.png">
  <link rel="manifest" href="${A}manifest.webmanifest">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" as="style" href="${FONTS}" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="${FONTS}"></noscript>
${hero ? `  <link rel="preload" as="image" href="${A}assets/img/${hero}.webp" fetchpriority="high">` : ""}
  <link rel="stylesheet" href="${A}assets/css/style.css">
  <script>document.documentElement.className = "js"; try { var t = localStorage.getItem("theme"); if (t) document.documentElement.dataset.theme = t; } catch (e) {}</script>
  <script src="${A}assets/js/main.js" defer></script>
${scripts.map(s => `  <script src="${A}assets/js/${s}.js" defer></script>`).join("\n")}
${opts_jsonld(c)}
${GOATCOUNTER ? `  <script data-goatcounter="https://${GOATCOUNTER}.goatcounter.com/count" async src="https://gc.zgo.at/count.js"></script>` : ""}
</head>
<body style="--accent: ${accent};" data-sw="${A}sw.js">
<a class="skip" href="#contenu">${T.ui.skip}</a>
<div class="progress" aria-hidden="true"></div>`;
}
let _jsonld = "";
const opts_jsonld = () => { const s = _jsonld; _jsonld = ""; return s; };

function nav(c) {
  const { T, file, B, isEn } = c;
  const cur = f => (f === file ? ' aria-current="page"' : "");
  const links = teams.map(t => `          <a href="${B}${t.file}" style="--c: ${t.color}"${cur(t.file)}><i class="dot"></i><span>${t.name}<small>${T.teams[t.slug] && t.car}${t.archive ? " · " + T.ui.archive : !t.grid ? " · " + T.ui.absent26 : ""}</small></span></a>`).join("\n");
  const X = T.x.nav;
  const more = [["Resultats.html", X.results], ["Histoire.html", T.ui.history], ["Pilotes.html", T.ui.drivers], ["Venir.html", X.visit], ["Comparateur.html", T.ui.compare], ["Strategie.html", X.strategy], ["Quiz.html", T.ui.quiz], ["Jeu.html", X.game], ["Lexique.html", X.glossary], ["FondsEcran.html", X.wallpapers], ["Archives.html", T.ui.archives], ["Credits.html", X.credits]];
  const special = ["404.html", "offline.html"].includes(file);
  const otherHref = special ? "/en/" : isEn ? "../" + file : "en/" + file;
  return `
<nav class="nav" aria-label="Navigation">
  <div class="container">
    <a class="brand" href="${B}index.html"><span class="brand-mark">24</span><span>Le Mans <small>Hypercars</small></span></a>
    <div class="nav-tools">
      <a class="lang-switch" href="${otherHref}" hreflang="${T.other}" lang="${T.other}" title="${T.ui.lang}">${T.otherLabel}</a>
      <button class="theme-toggle" aria-label="${T.ui.theme}" title="${T.ui.theme}"><span aria-hidden="true"></span></button>
      <button class="burger" aria-label="${T.ui.menuOpen}" aria-expanded="false" aria-controls="menu"><span></span></button>
    </div>
    <ul class="nav-links" id="menu">
      <li><a href="${B}index.html"${cur("index.html")}>${T.ui.home}</a></li>
      <li class="has-mega">
        <button aria-expanded="false">${T.ui.teams}</button>
        <div class="mega">
${links}
          <a class="mega-foot" href="${B}Archives.html"><span>${T.ui.allArchives}<small>${T.ui.allArchivesSub}</small></span></a>
        </div>
      </li>
      <li><a href="${B}Circuit.html"${cur("Circuit.html")}>${T.ui.circuit}</a></li>
      <li><a href="${B}Comprendre.html"${cur("Comprendre.html")}>${T.ui.understand}</a></li>
      <li class="has-mega">
        <button aria-expanded="false">${T.ui.more}</button>
        <div class="mega small two">
${more.map(([f, l]) => `          <a href="${B}${f}"${cur(f)}><span>${l}</span></a>`).join("\n")}
        </div>
      </li>
      <li><a href="${B}me_contacter.html"${cur("me_contacter.html")}>${T.ui.contact}</a></li>
    </ul>
  </div>
</nav>`;
}

function footer(c) {
  const { T, B } = c;
  const list = gridTeams.map(t => `<li><a href="${B}${t.file}">${t.name}</a></li>`).join("");
  return `
<footer>
  <div class="container foot">
    <div>
      <a class="brand" href="${B}index.html"><span class="brand-mark">24</span><span>Le Mans <small>Hypercars</small></span></a>
      <p class="muted" style="max-width: 40ch; margin-top: 16px;">${T.footer.blurb}</p>
    </div>
    <div>
      <h2 class="foot-title">${T.footer.grid}</h2>
      <ul>${list}</ul>
    </div>
    <div>
      <h2 class="foot-title">${T.footer.explore}</h2>
      <ul>
        <li><a href="${B}Circuit.html">${T.ui.circuit}</a></li>
        <li><a href="${B}Comprendre.html">${T.ui.understand}</a></li>
        <li><a href="${B}Histoire.html">${T.ui.history}</a></li>
        <li><a href="${B}Pilotes.html">${T.ui.drivers}</a></li>
        <li><a href="${B}Comparateur.html">${T.ui.compare}</a></li>
        <li><a href="${B}Quiz.html">${T.ui.quiz}</a></li>
        <li><a href="${B}Resultats.html">${T.x.nav.results}</a></li>
        <li><a href="${B}Venir.html">${T.x.nav.visit}</a></li>
        <li><a href="${B}Jeu.html">${T.x.nav.game}</a></li>
        <li><a href="${B}Strategie.html">${T.x.nav.strategy}</a></li>
        <li><a href="${B}Lexique.html">${T.x.nav.glossary}</a></li>
        <li><a href="${B}FondsEcran.html">${T.x.nav.wallpapers}</a></li>
        <li><a href="${B}Archives.html">${T.ui.archives}</a></li>
        <li><a href="${B}Credits.html">${T.x.nav.credits}</a></li>
      </ul>
    </div>
    <div>
      <h2 class="foot-title">${T.footer.links}</h2>
      <ul>
        <li><a href="https://www.24h-lemans.com/" target="_blank" rel="noopener">24h-lemans.com</a></li>
        <li><a href="https://www.lemans.org/" target="_blank" rel="noopener">${T.footer.organiser}</a></li>
        <li><a href="https://www.fiawec.com/" target="_blank" rel="noopener">FIA WEC</a></li>
        <li><a href="${B}me_contacter.html">${T.ui.contact}</a></li>
      </ul>
    </div>
    <div class="copy">
      <span>© <span data-year>2026</span> ${T.footer.copy}</span>
      <span>${T.footer.photos}</span>
    </div>
  </div>
</footer>
<div class="offline-bar" role="status">${T.ui.offline}</div>

<button class="to-top" aria-label="${T.ui.toTop}">
  <svg viewBox="0 0 52 52" aria-hidden="true"><circle class="track" cx="26" cy="26" r="23"/><circle class="ring" cx="26" cy="26" r="23"/></svg>
  <span aria-hidden="true">↑</span>
</button>
</body>
</html>
`;
}

const lines = (arr, cls = "") => arr.map((w, k) => `<span class="line"><span${cls && k === arr.length - 1 ? ` class="${cls}"` : ""} style="animation-delay: ${k * .1}s">${w}</span></span>`).join("");

function pageHero(c, P, { img, opacity, compact = true } = {}) {
  return `  <header class="team-hero${compact ? " compact" : ""}">
    <div class="bg">${img ? `<img src="${c.A}assets/img/${img}.webp" alt="" data-parallax="0.25" fetchpriority="high"${opacity ? ` style="${opacity}"` : ""}>` : `<div class="hero-grid" aria-hidden="true"></div>`}</div>
    <div class="trails" aria-hidden="true">${trails}</div>
    <div class="container">
      <span class="eyebrow">${P.eyebrow}</span>
      <h1>${lines(P.h1)}</h1>
      <p class="lead">${P.lead}</p>
    </div>
  </header>`;
}

const media = (c, t, label) => t.img
  ? `<img src="${c.A}assets/img/${t.img}.webp" alt="${t.name} ${t.car}" loading="lazy">`
  : `<div class="silhouette"><span class="ph">${label}</span></div>`;

function teamCard(c, t) {
  const TT = c.T.teams[t.slug];
  const badge = TT.badge ? `<span class="badge${t.archive || !t.grid ? " dark" : ""}">${TT.badge}</span>` : t.isNew ? `<span class="badge">${c.T.ui.newBadge}</span>` : "";
  return `<a class="team-card" href="${c.B}${t.file}" style="--c: ${t.color}">
          <div class="media" style="view-transition-name: car-${t.slug}">
            ${badge}
            ${media(c, t, c.T.ui.photoSoon)}
          </div>
          <div class="body">
            <h3>${t.name}</h3>
            <span class="car">${t.car} · ${t.type}</span>
            <span class="go">${c.T.ui.discover}</span>
          </div>
        </a>`;
}

const trails = Array.from({ length: 14 }, (_, i) => {
  const top = 30 + ((i * 37) % 60);
  const red = i % 3 !== 0;
  const d = (2.2 + ((i * 7) % 10) / 4).toFixed(2);
  const delay = (-((i * 13) % 40) / 10).toFixed(1);
  return `<i style="top:${top}%; --c:${red ? "#ff2a2a" : "#ffe9b0"}; --d:${d}s; --delay:${delay}s"></i>`;
}).join("");

/* ============================================================
   Pages
   ============================================================ */
function buildIndex(T) {
  const c = ctx(T, "index.html");
  const P = T.index;
  const ticker = P.ticker.join(`<span class="sep">◆</span>`) + `<span class="sep">◆</span>`;
  _jsonld = `  <script type="application/ld+json">${json([
    { "@context": "https://schema.org", "@type": "WebSite", name: "Le Mans Hypercars", url: `${SITE_URL}/${c.isEn ? "en/" : ""}`, inLanguage: T.lang },
    { "@context": "https://schema.org", "@type": "SportsEvent", name: c.isEn ? "24 Hours of Le Mans 2027" : "24 Heures du Mans 2027", startDate: "2027-06-12", endDate: "2027-06-13", eventStatus: "https://schema.org/EventScheduled", eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode", location: { "@type": "Place", name: "Circuit des 24 Heures du Mans", address: { "@type": "PostalAddress", addressLocality: "Le Mans", addressCountry: "FR" } }, organizer: { "@type": "Organization", name: "Automobile Club de l'Ouest", url: "https://www.lemans.org/" } },
  ])}</script>`;
  write(`${c.isEn ? "en/" : ""}index.html`, `${head(c, { title: P.title, desc: P.desc, hero: "toyota-3" })}
${nav(c)}

<main id="contenu">
  <header class="hero">
    <div class="hero-bg" data-parallax="0.35"><img src="${c.A}assets/img/toyota-3.webp" alt="" fetchpriority="high"></div>
    <div class="trails" aria-hidden="true">${trails}</div>
    <div class="container hero-inner">
      <div>
        <span class="eyebrow">${P.eyebrow}</span>
        <h1>
          <span class="line"><span>${P.h1[0]}</span></span>
          <span class="line"><span class="stroke">${P.h1[1]}</span></span>
          <span class="line"><span class="accent">${P.h1[2]}</span></span>
        </h1>
        <p class="lead">${P.lead}</p>
        <div class="btn-row">
          <a class="btn" href="#ecuries">${P.ctaTeams} <span class="arrow">→</span></a>
          <a class="btn ghost" href="#palmares">${P.ctaWinners}</a>
        </div>
      </div>
      <aside class="countdown" data-countdown="${RACE_2027}" aria-label="${T.countdown.title}">
        <span class="eyebrow">${T.countdown.eyebrow}</span>
        <strong class="cd-title">${T.countdown.title}</strong>
        <span class="cd-date">${T.countdown.date}</span>
        <div class="cd-grid">${T.countdown.units.map((u, i) => `<div><b data-cd="${i}">--</b><small>${u}</small></div>`).join("")}</div>
        <span class="cd-live" hidden>${T.countdown.live}</span>
        <small class="muted">${T.countdown.note}</small>
      </aside>
    </div>
    <span class="scroll-cue" aria-hidden="true"></span>
    <div class="ticker" aria-hidden="true"><div class="ticker-track">${ticker}${ticker}</div></div>
  </header>

  <section>
    <div class="container">
      <div class="stats" data-stagger>
${P.stats.map(([v, s, l]) => `        <div class="stat"><strong data-count="${v}"${s ? ` data-suffix="${s}"` : ""}>${Number(v).toLocaleString(T.locale)}${s}</strong><span>${l}</span></div>`).join("\n")}
      </div>
    </div>
  </section>

  <section id="centenaire">
    <div class="container split">
      <div class="frame" data-reveal="left"><img src="${c.A}assets/img/centenaire.webp" alt="${esc(P.centAlt)}" loading="lazy"></div>
      <div class="prose" data-reveal="right">
        <span class="eyebrow">${P.centEyebrow}</span>
        <h2>${P.centTitle}</h2>
        <div style="margin-top: 20px;">${P.cent.map(p => `<p>${p}</p>`).join("")}</div>
        <a class="btn ghost" href="Histoire.html">${P.centMore} <span class="arrow">→</span></a>
      </div>
    </div>
  </section>

  <section id="palmares">
    <div class="container">
      <div class="section-head" data-reveal>
        <span class="eyebrow">${P.palEyebrow}</span>
        <h2>${P.palTitle}</h2>
        <p class="lead">${P.palLead}</p>
      </div>
      <div class="winners" data-stagger>
${P.winners.map(w => `        <a class="winner" href="${w.f}" style="--c: ${w.c}">
          <div class="card-in">
            <div class="year">${w.y}</div>
            <h3>${w.team}</h3>
            <p><strong>${w.car}</strong><br>${w.crew}</p>
            <p style="margin-top: 10px;">${w.note}</p>
          </div>
        </a>`).join("\n")}
      </div>
    </div>
  </section>

  <section id="nouveautes" class="band">
    <div class="container">
      <div class="section-head" data-reveal>
        <span class="eyebrow">${P.newsEyebrow}</span>
        <h2>${P.newsTitle}</h2>
        <p class="lead">${P.newsLead}</p>
      </div>
      <div class="news" data-stagger>
${P.news.map(([i, h, p]) => `        <article><span class="ico">${i}</span><h3>${h}</h3><p>${p}</p></article>`).join("\n")}
      </div>
    </div>
  </section>

  <section id="ecuries">
    <div class="container">
      <div class="section-head" data-reveal>
        <span class="eyebrow">${P.teamsEyebrow}</span>
        <h2>${P.teamsTitle}</h2>
        <p class="lead">${P.teamsLead}</p>
      </div>
      <div class="teams" data-stagger>
        ${gridTeams.map(t => teamCard(c, t)).join("\n        ")}
      </div>
      <div class="section-head" data-reveal style="margin-top: 90px;">
        <span class="eyebrow">${P.absentEyebrow}</span>
        <h2>${P.absentTitle}</h2>
      </div>
      <div class="teams" data-stagger>
        ${otherTeams.map(t => teamCard(c, t)).join("\n        ")}
        <a class="team-card" href="Archives.html" style="--c: #9aa3b5">
          <div class="media"><div class="silhouette"></div></div>
          <div class="body"><h3>${T.ui.archives}</h3><span class="car">${T.ui.allArchivesSub}</span><span class="go">${T.ui.seeAll}</span></div>
        </a>
      </div>
    </div>
  </section>

  <section id="explorer" class="band">
    <div class="container">
      <div class="section-head" data-reveal>
        <span class="eyebrow">${P.exploreEyebrow}</span>
        <h2>${P.exploreTitle}</h2>
      </div>
      <div class="explore" data-stagger>
${[...P.explore, ...T.x.explore].map(([f, i, h, p]) => `        <a href="${f}"><span class="ico">${i}</span><h3>${h}</h3><p>${p}</p><span class="go">→</span></a>`).join("\n")}
      </div>
    </div>
  </section>

  <section id="victoires">
    <div class="container split reverse">
      <div class="board" data-reveal>
${board.map(([n, v, col], i) => `        <div class="bar-row" style="--c: ${col}; --v: ${v}; --i: ${i}"><span class="name">${n}</span><span class="bar"><i></i></span><span class="val">${v}</span></div>`).join("\n")}
      </div>
      <div data-reveal="left">
        <span class="eyebrow">${P.boardEyebrow}</span>
        <h2>${P.boardTitle}</h2>
        <p class="lead" style="margin-top: 16px;">${P.boardLead}</p>
      </div>
    </div>
  </section>

  <section id="video">
    <div class="container">
      <div class="section-head" data-reveal>
        <span class="eyebrow">${P.videoEyebrow}</span>
        <h2>${P.videoTitle}</h2>
      </div>
      <div class="video" data-reveal="zoom">
        <iframe src="https://www.youtube-nocookie.com/embed/wbvQ5U5PDhY" title="${P.videoIframe}" loading="lazy" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
      <div class="btn-row" style="justify-content: center;" data-reveal>
        <a class="btn" href="https://www.24h-lemans.com/" target="_blank" rel="noopener">${P.official} <span class="arrow">↗</span></a>
      </div>
    </div>
  </section>
</main>
${footer(c)}`);
}

function buildTeam(T, t, i) {
  const c = ctx(T, t.file);
  const TT = T.teams[t.slug];
  const prev = teams[(i - 1 + teams.length) % teams.length];
  const next = teams[(i + 1) % teams.length];
  const tags = [`<span class="tag hot">${t.type}</span>`, `<span class="tag">${TT.full}</span>`, TT.badge ? `<span class="tag">${TT.badge}</span>` : ""].join("");
  const gallery = t.gallery.length
    ? `<section>
    <div class="container">
      <div class="section-head" data-reveal><span class="eyebrow">${T.ui.gallery}</span><h2>${T.ui.inPictures}</h2></div>
      <div class="gallery" data-stagger="zoom">
${t.gallery.map(g => `        <button aria-label="${T.ui.enlarge}"><img src="${c.A}assets/img/${g}.webp" alt="${t.name} ${t.car}" loading="lazy"></button>`).join("\n")}
      </div>
    </div>
  </section>
  <dialog class="lightbox"><button aria-label="${T.ui.close}">✕</button><img src="" alt=""></dialog>`
    : `<section style="padding-top: 0;">
    <div class="container"><div class="notice" data-reveal><span>📷</span><p style="margin: 0;">${T.ui.photosTodo(t.car)}</p></div></div>
  </section>`;
  const e = t.engine;
  write(`${c.isEn ? "en/" : ""}${t.file}`, `${head(c, { title: `${t.name} ${t.car} — ${TT.full} | 24h Le Mans`, desc: `${t.name} ${t.car}: ${TT.lead}`, accent: t.color, scripts: ["engine"], hero: t.img })}
${nav(c)}

<main id="contenu">
  <header class="team-hero">
    <div class="bg" style="view-transition-name: car-${t.slug}">${t.img ? `<img src="${c.A}assets/img/${t.img}.webp" alt="" data-parallax="0.25" fetchpriority="high">` : `<div class="silhouette"><span class="ph">${T.ui.photoSoon}</span></div>`}</div>
    <span class="number" aria-hidden="true">${t.number}</span>
    <div class="container">
      <span class="eyebrow">${T.ui.teamEyebrow}${t.archive ? " · " + T.ui.archive : ""}</span>
      <h1>${lines(t.name.split(" "))}</h1>
      <div class="car-name">${t.car}</div>
      <p class="lead">${TT.lead}</p>
      <div class="tags">${tags}</div>
    </div>
  </header>

  <section style="padding-top: 40px;">
    <div class="container">
      ${TT.notice ? `<div class="notice" data-reveal style="margin-bottom: 32px;"><span>ℹ️</span><p style="margin: 0;">${TT.notice}</p></div>` : ""}
      <div class="specs" data-stagger>
${TT.specs.map(([k, v]) => `        <div class="spec"><small>${k}</small>${/^\d+$/.test(v) ? `<strong data-count="${v}">${v}</strong>` : `<strong>${v}</strong>`}</div>`).join("\n")}
      </div>
      <div class="engine-player" data-reveal data-cyl="${e.cyl}" data-turbo="${e.turbo}" data-rpm="${e.rpm}" data-hybrid="${e.hybrid}">
        <button class="btn engine-btn" data-label-play="${T.ui.sound}" data-label-stop="${T.ui.soundStop}"><span class="eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="lbl">${T.ui.sound}</span></button>
        <div class="tacho" aria-hidden="true"><span class="rpm">0</span><small>tr/min</small><div class="tacho-bar"><i></i></div></div>
        <p class="muted">${T.ui.soundNote}</p>
      </div>
    </div>
  </section>

  <section style="padding-top: 40px;">
    <div class="container split">
      <div class="prose" data-reveal="left">
        <span class="eyebrow">${T.ui.theCar}</span>
        <h2>${t.name} ${t.car}</h2>
        <div style="margin-top: 24px;">
${TT.story.map(p => `          <p>${p}</p>`).join("\n")}
        </div>
        <div class="btn-row"><a class="btn" href="${t.link}" target="_blank" rel="noopener">${TT.linkLabel} <span class="arrow">↗</span></a></div>
      </div>
      <div data-reveal="right">
        <span class="eyebrow">${T.ui.results}</span>
        <ul class="results" style="margin-top: 18px;" data-stagger>
${TT.results.map(r => `          <li${r.win ? ' class="win"' : ""}><span class="yr">${r.y}</span><span class="pos">${r.pos}</span><p>${r.text}</p></li>`).join("\n")}
        </ul>
      </div>
    </div>
  </section>

  ${gallery}

  <section style="padding-top: 20px;">
    <div class="container team-nav" data-stagger>
      <a href="${prev.file}" style="--c: ${prev.color}"><small>${T.ui.prevTeam}</small><strong>${prev.name}</strong></a>
      <a href="${next.file}" style="--c: ${next.color}"><small>${T.ui.nextTeam}</small><strong>${next.name}</strong></a>
    </div>
  </section>
</main>
${footer(c)}`.replace("tr/min", c.isEn ? "rpm" : "tr/min"));
}

/* ---------------- Circuit ---------------- */
// Tracé simplifié (viewBox 1000 x 720). Coordonnées des virages et vitesse de passage (km/h).
const TRACK = "M170 250 L190 150 C200 110 230 95 265 100 C285 103 290 88 310 90 C340 95 345 125 370 122 C395 119 400 100 425 110 C450 120 455 140 465 155 L560 300 C568 312 582 306 588 318 L690 470 C698 482 712 476 718 488 L790 590 C800 605 805 610 815 622 C830 640 828 660 805 662 L640 660 C600 660 585 640 560 650 C535 660 520 668 495 668 C455 668 445 660 440 640 C430 600 380 590 360 560 C340 530 300 540 280 510 C262 485 250 470 230 455 C205 440 200 410 185 395 C170 380 175 360 165 345 C155 330 168 310 165 290 Z";
const CORNERS = {
  start: { x: 172, y: 240, lx: 60, ly: 230, v: 0 },
  dunlop: { x: 262, y: 100, lx: 200, ly: 60, v: 165 },
  esses: { x: 372, y: 121, lx: 330, ly: 175, v: 210 },
  tertre: { x: 462, y: 150, lx: 490, ly: 125, v: 160 },
  hunaudieres: { x: 640, y: 390, lx: 680, ly: 360, v: 0 },
  mulsanne: { x: 818, y: 645, lx: 730, ly: 705, v: 105 },
  indianapolis: { x: 560, y: 650, lx: 550, ly: 615, v: 175 },
  arnage: { x: 442, y: 648, lx: 330, ly: 690, v: 95 },
  porsche: { x: 330, y: 540, lx: 380, ly: 515, v: 215 },
  ford: { x: 172, y: 360, lx: 40, ly: 380, v: 120 },
};
const CHICANES = [{ x: 588, y: 318, v: 175 }, { x: 718, y: 488, v: 175 }];

function buildCircuit(T) {
  const c = ctx(T, "Circuit.html");
  const P = T.circuit;
  const data = { corners: P.corners.map(([id]) => ({ id, ...CORNERS[id] })), chicanes: CHICANES };
  write(`${c.isEn ? "en/" : ""}Circuit.html`, `${head(c, { title: P.title, desc: P.desc, scripts: ["circuit"] })}
${nav(c)}

<main id="contenu">
${pageHero(c, P)}

  <section style="padding-top: 20px;">
    <div class="container circuit-wrap">
      <div class="track-card" data-reveal="zoom">
        <div class="track-hud">
          <div><small>${P.lap}</small><b class="hud-time">0:00.000</b></div>
          <div><small>km/h</small><b class="hud-speed">0</b></div>
          <div class="hud-sector"><small>${P.sector}</small><b>—</b></div>
        </div>
        <svg class="track" viewBox="20 40 900 680" role="img" aria-label="${P.eyebrow}">
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>
          <path class="track-base" d="${TRACK}"/>
          <path class="track-line" d="${TRACK}" id="trackPath"/>
          <path class="track-trace" d="${TRACK}"/>
          <line class="finish" x1="155" y1="246" x2="190" y2="252"/>
${data.corners.map(k => `          <g class="corner" data-id="${k.id}" tabindex="0" role="button" aria-label="${esc(P.corners.find(x => x[0] === k.id)[1])}"><circle cx="${k.x}" cy="${k.y}" r="9"/><text x="${k.lx}" y="${k.ly}">${P.corners.find(x => x[0] === k.id)[1]}</text></g>`).join("\n")}
          <g class="car" filter="url(#glow)"><circle r="9"/></g>
        </svg>
        <div class="track-controls">
          <button class="btn play" data-play="${P.play}" data-pause="${P.pause}">▶ ${P.play}</button>
          <label>${P.speed}
            <select class="speed"><option value="1">×1</option><option value="5">×5</option><option value="10" selected>×10</option><option value="20">×20</option></select>
          </label>
          <small class="muted">${P.simplified}</small>
        </div>
      </div>
      <div class="corner-list" data-stagger>
${P.corners.map(([id, name, text], i) => `        <article class="corner-info" data-id="${id}"><span class="num">${String(i + 1).padStart(2, "0")}</span><div><h3>${name}</h3><p>${text}</p></div></article>`).join("\n")}
      </div>
    </div>
    <script type="application/json" id="circuit-data">${json(data)}</script>
  </section>

  <section>
    <div class="container">
      <div class="stats" data-stagger>
${P.stats.map(([v, s, l]) => `        <div class="stat"><strong${/^[\d.]+$/.test(v) ? ` data-count="${v}"${s ? ` data-suffix="${s}"` : ""}` : ""}>${v.replace(".", c.isEn ? "." : ",")}${s}</strong><span>${l}</span></div>`).join("\n")}
      </div>
    </div>
  </section>

  <section class="band">
    <div class="container">
      <div class="section-head" data-reveal><span class="eyebrow">${P.factsEyebrow}</span><h2>${P.factsTitle}</h2></div>
      <div class="news" data-stagger>
${P.facts.map(([i, h, p]) => `        <article><span class="ico">${i}</span><h3>${h}</h3><p>${p}</p></article>`).join("\n")}
      </div>
    </div>
  </section>
</main>
${footer(c)}`);
}

/* ---------------- Comprendre ---------------- */
function buildUnderstand(T) {
  const c = ctx(T, "Comprendre.html");
  const P = T.understand;
  write(`${c.isEn ? "en/" : ""}Comprendre.html`, `${head(c, { title: P.title, desc: P.desc })}
${nav(c)}

<main id="contenu">
${pageHero(c, P)}

  <section style="padding-top: 30px;">
    <div class="container">
      <div class="section-head" data-reveal><span class="eyebrow">${P.classesEyebrow}</span><h2>${P.classesTitle}</h2><p class="lead">${P.classesLead}</p></div>
      <div class="classes" data-stagger>
${P.classes.map(([col, n, sub, p], i) => `        <article style="--c: ${col}"><div class="class-img"><img src="${c.A}assets/img/${classImages[i]}.webp" alt="${n}" loading="lazy"></div><figure class="plate"><span class="class-num">${P.plates[i][0]}</span><figcaption>${P.plates[i][1]}</figcaption></figure><h3>${n}</h3><strong>${sub}</strong><p>${p}</p></article>`).join("\n")}
      </div>
    </div>
  </section>

  <section class="band">
    <div class="container">
      <div class="section-head" data-reveal><span class="eyebrow">Hypercar</span><h2>${P.lmhTitle}</h2><p class="lead">${P.lmhLead}</p></div>
      <div class="table-wrap" data-reveal>
        <table class="cmp-table">
          <thead><tr>${P.lmhCols.map(h => `<th>${h}</th>`).join("")}</tr></thead>
          <tbody>${P.lmhRows.map(r => `<tr><th>${r[0]}</th><td>${r[1]}</td><td>${r[2]}</td></tr>`).join("")}</tbody>
        </table>
      </div>
      <div class="split" style="margin-top: 60px;">
        <div class="prose" data-reveal="left"><span class="eyebrow">BoP</span><h2 style="font-size: 2.4rem;">${P.bopTitle}</h2><p style="margin-top: 18px;">${P.bop}</p></div>
        <div class="bop-visual" data-reveal="right" aria-hidden="true">
          <div class="scale"><div class="beam"><span class="pan l">🏎️<small>+ kg</small></span><span class="pan r">🏎️<small>+ kW</small></span></div><div class="pivot"></div></div>
        </div>
      </div>
    </div>
  </section>

  <section>
    <div class="container">
      <div class="section-head" data-reveal><span class="eyebrow">${T.ui.drivers}</span><h2>${P.driversTitle}</h2></div>
      <div class="news four" data-stagger>
${P.drivers.map(([i, h, p]) => `        <article><span class="ico">${i}</span><h3>${h}</h3><p>${p}</p></article>`).join("\n")}
      </div>
    </div>
  </section>

  <section class="band">
    <div class="container">
      <div class="section-head" data-reveal><span class="eyebrow">🏁</span><h2>${P.flagsTitle}</h2><p class="lead">${P.flagsLead}</p></div>
      <div class="flags" data-stagger>
${P.flags.map(([bg, n, p]) => `        <button class="flag-card" aria-label="${esc(n)}"><span class="inner"><span class="front"><span class="flag" style="background: ${bg}"></span><b>${n}</b></span><span class="back"><b>${n}</b><span>${p}</span></span></span></button>`).join("\n")}
      </div>
    </div>
  </section>

  <section>
    <div class="container">
      <div class="section-head" data-reveal><span class="eyebrow">🚨</span><h2>${P.safetyTitle}</h2></div>
      <div class="news" data-stagger>
${P.safety.map(([i, h, p]) => `        <article><span class="ico">${i}</span><h3>${h}</h3><p>${p}</p></article>`).join("\n")}
      </div>
      <div class="lights-demo split" style="margin-top: 70px;">
        <div class="prose" data-reveal="left"><span class="eyebrow">💡</span><h2 style="font-size: 2.4rem;">${P.lightsTitle}</h2><p style="margin-top: 18px;">${P.lights}</p></div>
        <div class="leds" data-reveal="right" aria-hidden="true">
          ${[1, 2, 3].map(n => `<div class="led-row"><span class="p">P${n}</span>${[1, 2, 3].map(k => `<i class="${k <= n ? "on" : ""}"></i>`).join("")}</div>`).join("")}
        </div>
      </div>
    </div>
  </section>
</main>
${footer(c)}`);
}

/* ---------------- Histoire ---------------- */
function buildHistory(T) {
  const c = ctx(T, "Histoire.html");
  const P = T.history;
  write(`${c.isEn ? "en/" : ""}Histoire.html`, `${head(c, { title: P.title, desc: P.desc })}
${nav(c)}

<main id="contenu">
${pageHero(c, P, { img: "centenaire", opacity: "opacity:.35" })}

  <section style="padding-top: 30px;">
    <div class="container">
      <div class="year-rail" aria-hidden="true"><span class="year-now">1923</span></div>
      <ol class="timeline">
${P.events.map(([y, h, p], i) => `        <li data-reveal="${i % 2 ? "right" : "left"}" data-y="${y}"><div class="tl-card">${historyImages[y] ? `<img class="tl-img" src="${c.A}assets/img/${historyImages[y]}.webp" alt="${esc(h)}" loading="lazy">` : ""}<span class="tl-year">${y}</span><h3>${h}</h3><p>${p}</p></div></li>`).join("\n")}
      </ol>
    </div>
  </section>
</main>
${footer(c)}`);
}

/* ---------------- Pilotes ---------------- */
function buildDrivers(T) {
  const c = ctx(T, "Pilotes.html");
  const P = T.driversPage;
  const initials = n => n.split(" ").map(w => w[0]).join("").slice(0, 2);
  // Les emojis drapeaux ne s'affichent pas sous Windows : on affiche le code pays
  const cc = f => [...f].map(ch => String.fromCharCode(ch.codePointAt(0) - 0x1F1E6 + 65)).join("");
  write(`${c.isEn ? "en/" : ""}Pilotes.html`, `${head(c, { title: P.title, desc: P.desc })}
${nav(c)}

<main id="contenu">
${pageHero(c, P)}

  <section style="padding-top: 30px;">
    <div class="container">
      <div class="section-head" data-reveal><span class="eyebrow">2023 → 2026</span><h2>${P.crewsTitle}</h2></div>
${P.crews.map(cr => `      <div class="crew" style="--c: ${cr.c}" data-reveal>
        <div class="crew-head"><span class="crew-year">${cr.y}</span><span class="crew-car">${cr.car}</span></div>
        ${crewImages[cr.y] ? `<div class="crew-photo"><img src="${c.A}assets/img/${crewImages[cr.y]}.webp" alt="${esc(cr.car)}" loading="lazy"></div>` : ""}
        <div class="drivers" data-stagger>
${cr.drivers.map(([n, f, p]) => `          <article class="driver"><div class="avatar">${driverImages[n] ? `<img src="${c.A}assets/img/${driverImages[n]}.webp" alt="${n}" loading="lazy">` : `<span>${initials(n)}</span>`}<i class="cc">${cc(f)}</i></div><h3>${n}</h3><p>${p}</p></article>`).join("\n")}
        </div>
      </div>`).join("\n")}
    </div>
  </section>

  <section class="band">
    <div class="container">
      <div class="section-head" data-reveal><span class="eyebrow">🏆</span><h2>${P.legendsTitle}</h2></div>
      <div class="legends" data-stagger>
${P.legends.map(([w, n, f, p]) => `        <article><strong data-count="${w}">${w}</strong><div><h3>${n} <i class="cc">${cc(f)}</i></h3><p>${p}</p></div></article>`).join("\n")}
      </div>
    </div>
  </section>
</main>
${footer(c)}`);
}

/* ---------------- Comparateur ---------------- */
function buildCompare(T) {
  const c = ctx(T, "Comparateur.html");
  const P = T.compare;
  const data = { teams: teams.map(t => ({ slug: t.slug, name: t.name, car: t.car, color: t.color, type: t.type, img: t.img, file: t.file, ...t.cmp })), labels: { ...P.rows, yes: P.yes, no: P.no, litresUnit: P.litresUnit, photoSoon: T.ui.photoSoon }, assets: c.A };
  const opts = sel => teams.map(t => `<option value="${t.slug}"${t.slug === sel ? " selected" : ""}>${t.name} ${t.car}</option>`).join("");
  write(`${c.isEn ? "en/" : ""}Comparateur.html`, `${head(c, { title: P.title, desc: P.desc, scripts: ["compare"] })}
${nav(c)}

<main id="contenu">
${pageHero(c, P)}

  <section style="padding-top: 20px;">
    <div class="container">
      <div class="cmp" data-reveal="zoom">
        <div class="cmp-pick">
          <div class="cmp-side" data-side="a"><select aria-label="A">${opts("toyota")}</select><div class="cmp-media"></div></div>
          <button class="cmp-swap" aria-label="${P.swap}" title="${P.swap}"><span>${P.vs}</span></button>
          <div class="cmp-side" data-side="b"><select aria-label="B">${opts("ferrari")}</select><div class="cmp-media"></div></div>
        </div>
        <div class="cmp-rows"></div>
      </div>
      <p class="muted" style="margin-top: 20px;">${P.note}<br>${P.winsNote}</p>
    </div>
    <script type="application/json" id="compare-data">${json(data)}</script>
  </section>
</main>
${footer(c)}`);
}

/* ---------------- Quiz ---------------- */
function buildQuiz(T) {
  const c = ctx(T, "Quiz.html");
  const P = T.quizPage;
  const data = { q: P.questions, t: { next: P.next, results: P.results, restart: P.restart, question: P.question, good: P.good, bad: P.bad, verdicts: P.verdicts, scoreTitle: P.scoreTitle } };
  write(`${c.isEn ? "en/" : ""}Quiz.html`, `${head(c, { title: P.title, desc: P.desc, scripts: ["quiz"] })}
${nav(c)}

<main id="contenu">
${pageHero(c, P)}

  <section style="padding-top: 20px;">
    <div class="container">
      <div class="quiz" data-reveal="zoom">
        <div class="quiz-start">
          <span class="quiz-big">12</span>
          <p class="lead" style="margin-inline: auto;">${P.lead}</p>
          <button class="btn quiz-go">${P.start} <span class="arrow">→</span></button>
        </div>
        <div class="quiz-body" hidden>
          <div class="quiz-top"><span class="quiz-count"></span><div class="quiz-progress"><i></i></div><span class="quiz-score"></span></div>
          <h2 class="quiz-q"></h2>
          <div class="quiz-answers"></div>
          <p class="quiz-feedback" aria-live="polite"></p>
          <button class="btn quiz-next" hidden></button>
        </div>
        <div class="quiz-end" hidden>
          <span class="eyebrow">${P.scoreTitle}</span>
          <div class="score-ring"><svg viewBox="0 0 120 120"><circle class="track" cx="60" cy="60" r="52"/><circle class="ring" cx="60" cy="60" r="52"/></svg><b class="score-val">0</b></div>
          <p class="lead quiz-verdict" style="margin-inline: auto;"></p>
          <button class="btn quiz-restart">${P.restart} ↺</button>
        </div>
      </div>
    </div>
    <script type="application/json" id="quiz-data">${json(data)}</script>
  </section>
</main>
${footer(c)}`);
}

/* ---------------- Archives / Contact / 404 / Hors ligne ---------------- */
function buildArchives(T) {
  const c = ctx(T, "Archives.html");
  const P = T.archives;
  write(`${c.isEn ? "en/" : ""}Archives.html`, `${head(c, { title: P.title, desc: P.desc, accent: "#9aa3b5" })}
${nav(c)}

<main id="contenu">
${pageHero(c, P, { img: "glickenhaus-3", opacity: "filter: grayscale(1); opacity: .6;" })}

  <section style="padding-top: 40px;">
    <div class="container">
      <div class="teams" data-stagger>
        ${otherTeams.map(t => teamCard(c, t)).join("\n        ")}
${archivesExtra.map(a => `        <div class="team-card" style="--c: ${a.color}">
          <div class="media"><span class="badge dark">2024</span>${a.img ? `<img src="${c.A}assets/img/${a.img}.webp" alt="${a.name} ${a.car}" loading="lazy">` : `<div class="silhouette"></div>`}</div>
          <div class="body"><h3>${a.name}</h3><span class="car">${a.car}</span><p class="muted" style="margin: 10px 0 0; font-size: .92rem;">${T.archivesExtra[a.key]}</p></div>
        </div>`).join("\n")}
      </div>
    </div>
  </section>
</main>
${footer(c)}`);
}

function buildContact(T) {
  const c = ctx(T, "me_contacter.html");
  const P = T.contact;
  write(`${c.isEn ? "en/" : ""}me_contacter.html`, `${head(c, { title: P.title, desc: P.desc })}
${nav(c)}

<main id="contenu">
  <section class="contact-section">
    <div class="trails" aria-hidden="true">${trails}</div>
    <div class="container">
      <div class="contact-card" data-reveal="zoom">
        <span class="eyebrow">${P.eyebrow}</span>
        <h1 style="font-size: clamp(2.6rem, 7vw, 4.6rem);">${P.h1}</h1>
        <p class="lead" style="margin: 20px auto 0;">${P.lead}</p>
        <p class="mail-label" data-mail-label>${P.mailFallback}</p>
        <div class="btn-row">
          <a class="btn" data-mail-user="corentinhubert2405" data-mail-domain="gmail.com" href="#">${P.write} <span class="arrow">→</span></a>
          <a class="btn ghost" href="https://github.com/Corentinh2" target="_blank" rel="noopener">GitHub ↗</a>
        </div>
      </div>
    </div>
  </section>
</main>
${footer(c)}`);
}

function buildSimple(T, file, P, opts = {}) {
  const c = ctx(T, file, opts);
  write(file, `${head(c, { title: P.title, desc: P.desc || P.lead })}
${nav(c)}

<main id="contenu">
  <section class="hero" style="text-align: center;">
    <div class="trails" aria-hidden="true">${trails}</div>
    <div class="container">
      <h1>${opts.big ? `<span class="line"><span class="accent">${opts.big}</span></span>` : ""}<span class="line"><span>${P.h1}</span></span></h1>
      <p class="lead" style="margin-inline: auto;">${P.lead}</p>
      <div class="btn-row" style="justify-content: center;"><a class="btn" href="${c.B}index.html">${P.back} <span class="arrow">→</span></a></div>
    </div>
  </section>
</main>
${footer(c)}`);
}

/* ============================================================
   Pages ajoutées (résultats, venir, lexique, jeu, stratégie,
   fonds d'écran, crédits)
   ============================================================ */
const out = (c, f) => `${c.isEn ? "en/" : ""}${f}`;
const num = (c, s) => (c.isEn ? s.replace(/n°/g, "#") : s);

function buildResults(T) {
  const c = ctx(T, "Resultats.html");
  const P = T.x.results;
  const years = Object.keys(results).sort((a, b) => b - a);
  write(out(c, "Resultats.html"), `${head(c, { title: P.title, desc: P.desc, scripts: ["tools"] })}
${nav(c)}

<main id="contenu">
${pageHero(c, P, { img: "ferrari-25-win", opacity: "opacity:.45" })}

  <section style="padding-top: 20px;">
    <div class="container">
      <div class="tabs" role="tablist" data-reveal>
${years.map((y, i) => `        <button role="tab" aria-selected="${i === 0}" aria-controls="res-${y}" id="tab-${y}">${y}</button>`).join("\n")}
      </div>
${years.map((y, i) => {
    const R = results[y];
    const pod = R.overall.slice(0, 3);
    const order = [1, 0, 2];
    return `      <div class="tab-panel" role="tabpanel" id="res-${y}" aria-labelledby="tab-${y}"${i ? " hidden" : ""}>
        <h2 class="panel-title">${P.overall} ${y}</h2>
        <div class="podium">
${order.map(k => `          <div class="step s${k + 1}" style="--c: ${pod[k][1]}"><div class="who"><b>${pod[k][0]}</b><span>${num(c, pod[k][2])}</span>${pod[k][3] ? `<small>${pod[k][3]}</small>` : ""}</div><div class="block"><span>${k + 1}</span></div></div>`).join("\n")}
        </div>
        ${R.overall.length > 3 ? `<ol class="rest" start="4">${R.overall.slice(3).map(r => `<li style="--c: ${r[1]}"><b>${P.place[R.overall.indexOf(r)]}</b> ${r[0]} · ${num(c, r[2])}${r[3] ? ` <small>(${r[3]})</small>` : ""}</li>`).join("")}</ol>` : ""}
        <h3 class="panel-sub">${P.classWinners}</h3>
        <div class="class-winners">
${R.classes.map(([cl, col, team, car]) => `          <article style="--c: ${col}"><span class="cl">${cl}</span><b>${team}</b><span>${num(c, car)}</span></article>`).join("\n")}
        </div>
        <p class="notice" style="margin-top: 24px;"><span>ℹ️</span> ${P.notes[y]}</p>
      </div>`;
  }).join("\n")}
    </div>
  </section>
</main>
${footer(c)}`);
}

function buildVisit(T) {
  const c = ctx(T, "Venir.html");
  const P = T.x.visit;
  write(out(c, "Venir.html"), `${head(c, { title: P.title, desc: P.desc, scripts: ["tools"] })}
${nav(c)}

<main id="contenu">
${pageHero(c, P, { img: "lemans-above", opacity: "opacity:.55" })}

  <section style="padding-top: 30px;">
    <div class="container">
      <div class="section-head" data-reveal><span class="eyebrow">📅</span><h2>${P.weekTitle}</h2><p class="lead">${P.weekNote}</p></div>
      <ol class="week" data-stagger>
${P.week.map(([d, h, p], i) => `        <li${i === 5 ? ' class="race"' : ""}><span class="d">${d}</span><h3>${h}</h3><p>${p}</p></li>`).join("\n")}
      </ol>
      <div class="btn-row"><a class="btn" href="https://www.24h-lemans.com/" target="_blank" rel="noopener">${P.official} <span class="arrow">↗</span></a></div>
    </div>
  </section>

  <section class="band">
    <div class="container split">
      <div data-reveal="left">
        <span class="eyebrow">✅</span><h2>${P.tipsTitle}</h2><p class="lead" style="margin-top: 14px;">${P.tipsLead}</p>
        <div class="check-progress"><i></i></div>
        <button class="btn ghost check-reset" style="margin-top: 20px;">${P.reset}</button>
      </div>
      <ul class="checklist" data-reveal="right">
${P.tips.map((t, i) => `        <li><label><input type="checkbox" data-check="tip${i}"><span class="box"></span><span>${t}</span></label></li>`).join("\n")}
      </ul>
    </div>
  </section>

  <section>
    <div class="container">
      <div class="section-head" data-reveal><span class="eyebrow">ℹ️</span><h2>${P.practicalTitle}</h2></div>
      <div class="news four" data-stagger>
${P.practical.map(([i, h, p]) => `        <article><span class="ico">${i}</span><h3>${h}</h3><p>${p}</p></article>`).join("\n")}
      </div>
    </div>
  </section>
</main>
${footer(c)}`);
}

function buildGlossary(T) {
  const c = ctx(T, "Lexique.html");
  const P = T.x.glossary;
  const terms = [...P.terms].sort((a, b) => a[0].localeCompare(b[0], T.lang));
  const letters = [...new Set(terms.map(t => t[0][0].toUpperCase()))];
  write(out(c, "Lexique.html"), `${head(c, { title: P.title, desc: P.desc, scripts: ["tools"] })}
${nav(c)}

<main id="contenu">
${pageHero(c, P)}

  <section style="padding-top: 20px;">
    <div class="container glossary">
      <div class="gl-tools" data-reveal>
        <input type="search" class="gl-search" placeholder="${P.search}" aria-label="${P.search}">
        <nav class="gl-letters" aria-label="A-Z">${letters.map(l => `<a href="#l-${l}">${l}</a>`).join("")}</nav>
      </div>
      <dl class="gl-list">
${terms.map((t, i) => {
    const l = t[0][0].toUpperCase();
    const first = i === 0 || terms[i - 1][0][0].toUpperCase() !== l;
    return `${first ? `        <div class="gl-letter" id="l-${l}">${l}</div>\n` : ""}        <div class="gl-item" data-reveal><dt>${t[0]}</dt><dd>${t[1]}</dd></div>`;
  }).join("\n")}
      </dl>
      <p class="gl-none muted" hidden>${P.none}</p>
    </div>
  </section>
</main>
${footer(c)}`);
}

function buildGame(T) {
  const c = ctx(T, "Jeu.html");
  const P = T.x.game;
  write(out(c, "Jeu.html"), `${head(c, { title: P.title, desc: P.desc, scripts: ["game"] })}
${nav(c)}

<main id="contenu">
${pageHero(c, P)}

  <section style="padding-top: 20px;">
    <div class="container">
      <div class="game" data-reveal="zoom">
        <div class="game-hud"><div><small>${P.time}</small><b class="g-time">0.00 s</b></div><div><small>${P.penalty}</small><b class="g-pen">0 s</b></div><div><small>${P.best}</small><b class="g-best">—</b></div></div>
        <div class="pitlane" aria-live="polite">
          <div class="box-zone"></div>
          <div class="g-car" style="--c: var(--accent)">
            <svg viewBox="0 0 120 240" aria-hidden="true">
              <rect x="22" y="10" width="76" height="220" rx="30" class="body"/>
              <rect x="40" y="80" width="40" height="60" rx="14" class="cockpit"/>
              <rect x="14" y="196" width="92" height="16" rx="4" class="wing"/>
              <rect x="0" y="36" width="20" height="40" rx="5" class="wheel" data-w="0"/>
              <rect x="100" y="36" width="20" height="40" rx="5" class="wheel" data-w="1"/>
              <rect x="0" y="160" width="20" height="40" rx="5" class="wheel" data-w="2"/>
              <rect x="100" y="160" width="20" height="40" rx="5" class="wheel" data-w="3"/>
            </svg>
          </div>
          <div class="lights" aria-hidden="true"><i></i><i></i><i></i></div>
          <p class="g-msg"></p>
        </div>
        <div class="fuel" hidden><div class="fuel-bar"><span class="fuel-ok"></span><i></i></div><button class="btn fuel-btn">⛽ ${P.hold}</button></div>
        <div class="game-start">
          <ol class="game-steps">${P.steps.map(([h, p]) => `<li><b>${h}</b><span>${p}</span></li>`).join("")}</ol>
          <button class="btn g-go">${P.start} <span class="arrow">→</span></button>
        </div>
        <div class="game-end" hidden><strong class="g-final"></strong><p class="g-verdict lead"></p><button class="btn g-again">${P.again} ↺</button></div>
      </div>
    </div>
    <script type="application/json" id="game-data">${json(P)}</script>
  </section>
</main>
${footer(c)}`);
}

function buildStrategy(T) {
  const c = ctx(T, "Strategie.html");
  const P = T.x.strategy;
  const ctl = (id, label, min, max, val, step = 1) => `<label class="range"><span>${label} <b data-out="${id}">${val}</b></span><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}"></label>`;
  write(out(c, "Strategie.html"), `${head(c, { title: P.title, desc: P.desc, scripts: ["strategy"] })}
${nav(c)}

<main id="contenu">
${pageHero(c, P)}

  <section style="padding-top: 20px;">
    <div class="container strat" data-hours="${P.hours}">
      <div class="strat-controls" data-reveal="left">
        ${ctl("stint", P.controls.stint, 8, 16, 13)}
        <p class="strat-warn" hidden>⚠️ ${P.warning}</p>
        ${ctl("tyres", P.controls.tyres, 1, 4, 2)}
        ${ctl("driver", P.controls.driver, 1, 4, 2)}
        ${ctl("sc", P.controls.sc, 0, 10, 4)}
        ${ctl("pace", P.controls.pace, 205, 220, 210)}
      </div>
      <div data-reveal="right">
        <div class="stats strat-out">
          <div class="stat"><strong data-o="laps">0</strong><span>${P.out.laps}</span></div>
          <div class="stat"><strong data-o="stops">0</strong><span>${P.out.stops}</span></div>
          <div class="stat"><strong data-o="pit">0</strong><span>${P.out.pit}</span></div>
          <div class="stat"><strong data-o="dist">0</strong><span>${P.out.distance}</span></div>
        </div>
        <div class="strat-chart"><svg viewBox="0 0 600 220" preserveAspectRatio="none" aria-label="${esc(P.chart)}"><path class="area"/><path class="line"/></svg><div class="axis"><span>0 ${P.hours}</span><span>6 ${P.hours}</span><span>12 ${P.hours}</span><span>18 ${P.hours}</span><span>24 ${P.hours}</span></div></div>
        <p class="muted" style="font-size: .85rem;">${P.chart}. ${P.out.avg} : <b data-o="avg">—</b></p>
        <p class="muted" style="font-size: .8rem;">${P.model}</p>
      </div>
    </div>
  </section>
</main>
${footer(c)}`);
}

function buildWallpapers(T) {
  const c = ctx(T, "FondsEcran.html");
  const P = T.x.wallpapers;
  const data = teams.map(t => ({ slug: t.slug, name: t.name, car: t.car, color: t.color, number: t.number }));
  write(out(c, "FondsEcran.html"), `${head(c, { title: P.title, desc: P.desc, scripts: ["cars", "wallpaper"] })}
${nav(c)}

<main id="contenu">
${pageHero(c, P)}

  <section style="padding-top: 20px;">
    <div class="container wp">
      <div class="wp-controls" data-reveal="left">
        <label>${P.team}<select class="wp-team">${teams.map(t => `<option value="${t.slug}">${t.name} ${t.car}</option>`).join("")}</select></label>
        <fieldset><legend>${P.format}</legend>
          <label class="pill"><input type="radio" name="fmt" value="desktop" checked><span>${P.desktop}</span></label>
          <label class="pill"><input type="radio" name="fmt" value="phone"><span>${P.phone}</span></label>
        </fieldset>
        <fieldset><legend>${P.style}</legend>
          ${P.styles.map((s, i) => `<label class="pill"><input type="radio" name="style" value="${i}"${i ? "" : " checked"}><span>${s}</span></label>`).join("")}
        </fieldset>
        <a class="btn wp-dl" download="le-mans.png" href="#">⬇ ${P.download}</a>
      </div>
      <div class="wp-preview" data-reveal="right"><canvas width="1920" height="1080"></canvas></div>
    </div>
    <script type="application/json" id="wp-data">${json(data)}</script>
  </section>
</main>
${footer(c)}`);
}

function buildCredits(T) {
  const c = ctx(T, "Credits.html");
  const P = T.x.credits;
  write(out(c, "Credits.html"), `${head(c, { title: P.title, desc: P.desc })}
${nav(c)}

<main id="contenu">
${pageHero(c, P)}

  <section style="padding-top: 20px;">
    <div class="container">
      <div class="credits" data-stagger>
${Object.entries(credits).map(([file, k]) => `        <article><img src="${c.A}assets/img/${file}.webp" alt="" loading="lazy"><div><b>${esc(k.title.replace(/\.(jpe?g|png)$/i, ""))}</b><span>${P.author} : ${esc(k.artist)}</span><span>${P.license} : ${k.licenseUrl ? `<a href="${k.licenseUrl}" target="_blank" rel="noopener license">${k.license}</a>` : k.license}</span><a href="${k.source}" target="_blank" rel="noopener">${P.source} ↗</a></div></article>`).join("\n")}
      </div>
      <p class="muted" style="margin-top: 24px;">${P.changes}</p>
      <div class="notice" style="margin-top: 24px;"><span>📷</span><p style="margin: 0;"><b>${P.original}.</b> ${P.originalText}</p></div>
    </div>
  </section>
</main>
${footer(c)}`);
}

/* ============================================================
   Génération
   ============================================================ */
for (const T of [fr, en]) {
  buildResults(T);
  buildVisit(T);
  buildGlossary(T);
  buildGame(T);
  buildStrategy(T);
  buildWallpapers(T);
  buildCredits(T);
  buildIndex(T);
  teams.forEach((t, i) => buildTeam(T, t, i));
  buildCircuit(T);
  buildUnderstand(T);
  buildHistory(T);
  buildDrivers(T);
  buildCompare(T);
  buildQuiz(T);
  buildArchives(T);
  buildContact(T);
}
buildSimple(fr, "404.html", fr.notFound, { abs: true, big: "404" });
buildSimple(fr, "offline.html", fr.offlinePage, { abs: true });

/* ---------------- sitemap.xml & robots.txt ---------------- */
const today = new Date().toISOString().slice(0, 10);
const pagesFr = written.filter(f => f.endsWith(".html") && !f.startsWith("en/") && !["404.html", "offline.html"].includes(f));
writeFileSync(join(ROOT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pagesFr.map(f => {
  const p = f === "index.html" ? "" : f;
  return `  <url>
    <loc>${SITE_URL}/${p}</loc><lastmod>${today}</lastmod>
    <xhtml:link rel="alternate" hreflang="fr" href="${SITE_URL}/${p}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}/en/${p}"/>
  </url>
  <url>
    <loc>${SITE_URL}/en/${p}</loc><lastmod>${today}</lastmod>
    <xhtml:link rel="alternate" hreflang="fr" href="${SITE_URL}/${p}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}/en/${p}"/>
  </url>`;
}).join("\n")}
</urlset>
`);
writeFileSync(join(ROOT, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /_build/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

/* ---------------- Service worker (hors connexion) ---------------- */
const assetFiles = ["assets/css", "assets/js", "assets/img"].flatMap(d => readdirSync(join(ROOT, d)).map(f => `${d}/${f}`));
// Pages, CSS, JS et petites images sont mis en cache dès la première visite ;
// les photos sont mises en cache au fur et à mesure qu'elles sont affichées.
const light = assetFiles.filter(f => !f.startsWith("assets/img/") || /icon-|silhouette|toyota-3|centenaire/.test(f));
const precache = ["/", "/en/", ...written.filter(f => f !== "404.html").map(f => "/" + f), "/manifest.webmanifest", ...light.map(f => "/" + f)];
const hash = createHash("sha1");
[...written, ...assetFiles].forEach(f => hash.update(readFileSync(join(ROOT, f))));
const version = hash.digest("hex").slice(0, 10);
writeFileSync(join(ROOT, "sw.js"), readFileSync(join(ROOT, "_build/sw.template.js"), "utf8")
  .replace("__VERSION__", version)
  .replace("__PRECACHE__", JSON.stringify(precache, null, 2)));

console.log(`OK : ${written.length} pages, ${precache.length} fichiers en cache (v${version})`);
