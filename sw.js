const CACHE_NAME = 'neomonitor-v1';

self.addEventListener('install', event => {
  const base = self.registration.scope;
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll([
      base,
      base + 'index.html',
      base + 'icons/icon-192.png',
      base + 'icons/icon-512.png',
      base + 'offline.html'
    ]))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (!event.request.url.startsWith(self.registration.scope)) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        const url = event.request.url;
        if (url.endsWith('/') || url.includes('index.html') || url.includes('/icons/')) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() =>
        caches.match(event.request).then(cached =>
          cached || caches.match(self.registration.scope + 'offline.html')
        )
      )
  );
});
