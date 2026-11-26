/* Service worker : permet de consulter le site hors connexion.
   Fichier généré par _build/build.mjs — ne pas modifier directement. */
const VERSION = "__VERSION__";
const CACHE = `lemans-${VERSION}`;
const PRECACHE = __PRECACHE__;

self.addEventListener("install", event => {
  // cache: "reload" évite de récupérer une ancienne version gardée par le navigateur
  // Chaque fichier est ajouté séparément : un fichier manquant ne bloque pas toute l'installation
  event.waitUntil(caches.open(CACHE)
    .then(cache => Promise.all(PRECACHE.map(u => cache.add(new Request(u, { cache: "reload" })).catch(() => {}))))
    .then(() => self.skipWaiting()));
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
        .then(res => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return res; })
        .catch(() => caches.match(req).then(r => r || caches.match("/offline.html")))
    );
    return;
  }

  const sameOrigin = url.origin === location.origin;
  const fonts = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (!sameOrigin && !fonts) return;
  const put = res => { if (res.ok || (res.type === "opaque" && fonts)) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return res; };

  // Code du site (CSS, JS, données) : toujours la dernière version, le cache seulement hors connexion
  if (sameOrigin && /\.(css|js|json|webmanifest|xml|txt)$/.test(url.pathname)) {
    event.respondWith(fetch(req, { cache: "no-cache" }).then(put).catch(() => caches.match(req, { cacheName: CACHE })));
    return;
  }

  // Images et polices : le cache d'abord (elles changent rarement), mises à jour en arrière-plan
  event.respondWith(
    caches.match(req, { cacheName: CACHE }).then(cached => {
      const network = fetch(req).then(put).catch(() => cached);
      return cached || network;
    })
  );
});
