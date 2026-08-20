// Socio Service Worker — cache-first for static assets, network-first for HTML
const CACHE = 'socio-v1';
const PRECACHE = [
  '/assets/output.css',
  '/assets/socio.css',
  '/assets/whatsapp-widget.js',
  '/manifest.json',
  '/favicon.svg'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(()=> self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (req.url.includes('/api/')) return; // never cache API
  e.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(res => {
        if (res.ok && req.url.includes('/assets/')) {
          const clone = res.clone();
          caches.open(CACHE).then(c=>c.put(req, clone));
        }
        return res;
      }).catch(()=> cached);
    })
  );
});
