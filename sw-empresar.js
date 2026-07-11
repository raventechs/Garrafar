// sw-empresar.js — Service Worker EmpresAR v2.0
// P3 ROBUSTEZ: shell offline + clone fix
const CACHE = 'empresar-v2.0';
const SHELL = [
  '/Garrafar/',
  '/Garrafar/index.html',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(response => {
      const clone = response.clone(); // P3: clone fix obligatorio
      caches.open(CACHE).then(c => c.put(e.request, clone));
      return response;
    }).catch(() => caches.match(e.request))
  );
});
