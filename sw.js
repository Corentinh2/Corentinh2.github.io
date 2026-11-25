/* Service worker : permet de consulter le site hors connexion.
   Fichier généré par _build/build.mjs — ne pas modifier directement. */
const VERSION = "7b56a76782";
const CACHE = `lemans-${VERSION}`;
const PRECACHE = [
  "/",
  "/en/",
  "/index.html",
  "/Toyota.html",
  "/Ferrari.html",
  "/BMW.html",
  "/Cadillac.html",
  "/Peugeot.html",
  "/Alpine.html",
  "/AstonMartin.html",
  "/Genesis.html",
  "/Porsche.html",
  "/Glickenhaus.html",
  "/Circuit.html",
  "/Comprendre.html",
  "/Histoire.html",
  "/Pilotes.html",
  "/Comparateur.html",
  "/Quiz.html",
  "/Archives.html",
  "/me_contacter.html",
  "/en/index.html",
  "/en/Toyota.html",
  "/en/Ferrari.html",
  "/en/BMW.html",
  "/en/Cadillac.html",
  "/en/Peugeot.html",
  "/en/Alpine.html",
  "/en/AstonMartin.html",
  "/en/Genesis.html",
  "/en/Porsche.html",
  "/en/Glickenhaus.html",
  "/en/Circuit.html",
  "/en/Comprendre.html",
  "/en/Histoire.html",
  "/en/Pilotes.html",
  "/en/Comparateur.html",
  "/en/Quiz.html",
  "/en/Archives.html",
  "/en/me_contacter.html",
  "/offline.html",
  "/manifest.webmanifest",
  "/assets/css/style.css",
  "/assets/js/circuit.js",
  "/assets/js/compare.js",
  "/assets/js/engine.js",
  "/assets/js/main.js",
  "/assets/js/quiz.js",
  "/assets/img/centenaire.webp",
  "/assets/img/icon-192.png",
  "/assets/img/icon-512.png",
  "/assets/img/icon-maskable-512.png",
  "/assets/img/silhouette.svg",
  "/assets/img/toyota-3.webp"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith("lemans-") && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Pages : le réseau d'abord (contenu à jour), le cache si hors connexion
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res; })
        .catch(() => caches.match(req).then(r => r || caches.match("/offline.html")))
    );
    return;
  }

  // Fichiers du site et polices Google : le cache d'abord, mis à jour en arrière-plan
  const sameOrigin = url.origin === location.origin;
  const fonts = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (!sameOrigin && !fonts) return;
  event.respondWith(
    caches.match(req).then(cached => {
      const network = fetch(req).then(res => {
        if (res.ok || res.type === "opaque") { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
