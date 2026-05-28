const CACHE_NAME = 'shiftcalc-v1';
const ASSETS = ['/', '/index.html', '/manifest.json', '/icons/icon-192.png', '/icons/icon-512.png'];
self.addEventListener('install', evt => { evt.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))); self.skipWaiting(); });
self.addEventListener('activate', evt => { evt.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => (k !== CACHE_NAME) ? caches.delete(k) : Promise.resolve())))); self.clients.claim(); });
self.addEventListener('fetch', evt => {
  if(evt.request.mode === 'navigate'){ evt.respondWith(fetch(evt.request).catch(()=> caches.match('/index.html'))); return; }
  evt.respondWith(caches.match(evt.request).then(res => res || fetch(evt.request).then(fetchRes => { if(evt.request.method === 'GET'){ caches.open(CACHE_NAME).then(cache => cache.put(evt.request, fetchRes.clone())); } return fetchRes; })).catch(()=> caches.match('/index.html')));
});