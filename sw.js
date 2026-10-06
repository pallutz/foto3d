// Eenvoudige service worker: bewaart de pagina en bibliotheken, zodat de app
// ook zonder (goed) internet opstart. Het AI-model bewaart de browser zelf.
const CACHE = 'foto3d-v2';
const KERN = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(KERN.map(u => new Request(u, { cache: 'reload' }))))
    .then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Eigen pagina: eerst netwerk (nieuwste versie, niet de 10 minuten oude browserkopie), anders uit de cache
  if (url.origin === location.origin) {
    e.respondWith(fetch(req, { cache: 'no-cache' }).then(r => { const k = r.clone(); caches.open(CACHE).then(c => c.put(req, k)); return r; })
      .catch(() => caches.match(req).then(r => r || caches.match('./index.html'))));
    return;
  }
  // Bibliotheken van jsDelivr: eerst cache, anders netwerk en bewaren
  if (url.hostname === 'cdn.jsdelivr.net') {
    e.respondWith(caches.match(req).then(r => r || fetch(req).then(n => {
      const k = n.clone(); caches.open(CACHE).then(c => c.put(req, k)); return n; })));
  }
});
