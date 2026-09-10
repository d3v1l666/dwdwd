/* Service Worker: macht die App offline lauffähig.
   Strategie: sofort aus dem Cache ausliefern, im Hintergrund aktualisieren
   (stale-while-revalidate). Neue Fassungen sind damit beim übernächsten
   Start aktiv, ohne dass die Cache-Version hochgezählt werden muss. */
var CACHE = "fls-trainer-v9";

var ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./data/questions.js",
  "./data/formulas.js",
  "./manifest.webmanifest",
  "./icons/icon-180.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-512-maskable.png"
];

self.addEventListener("install", function (ev) {
  ev.waitUntil(
    caches.open(CACHE)
      .then(function (c) { return c.addAll(ASSETS); })
      .then(function () { return self.skipWaiting(); })
      .catch(function () { /* einzelne fehlende Datei darf die Installation nicht verhindern */ })
  );
});

self.addEventListener("activate", function (ev) {
  ev.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.map(function (k) {
          return k === CACHE ? null : caches.delete(k);
        }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (ev) {
  var req = ev.request;
  if (req.method !== "GET") return;

  // Die App laedt ausschliesslich eigene Dateien und die Systemschrift des Geraets.
  if (new URL(req.url).origin !== self.location.origin) return;

  ev.respondWith(
    caches.open(CACHE).then(function (cache) {
      return cache.match(req).then(function (hit) {
        var net = fetch(req).then(function (res) {
          if (res && (res.ok || res.type === "opaque")) cache.put(req, res.clone());
          return res;
        }).catch(function () { return null; });

        if (hit) { net; return hit; }

        return net.then(function (res) {
          if (res) return res;
          // Offline und nicht im Cache: bei Seitenaufrufen die App selbst ausliefern.
          if (req.mode === "navigate") return cache.match("./index.html");
          return new Response("", { status: 504, statusText: "Offline" });
        });
      });
    })
  );
});
