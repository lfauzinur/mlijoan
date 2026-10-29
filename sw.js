const CACHE_NAME = 'mlijoan-v1.0.0';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/main.css',
  '/js/data.js',
  '/js/app.js',
  '/images/logo.png',
  '/images/sembako.png',
  '/images/fresh_produce.png',
  '/images/promo_banner.png',
  '/manifest.json',
];

// Install
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch — Stale-while-revalidate for static, network-first for API
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      const fetched = fetch(e.request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return response;
      }).catch(() => cached);
      return cached || fetched;
    })
  );
});

// Push Notifications
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  const opts = {
    body: data.body || 'Ada update pesanan Anda!',
    icon: '/images/logo.png',
    badge: '/images/logo.png',
    vibrate: [200, 100, 200],
    data: { url: data.url || '/' },
    actions: [
      { action: 'view', title: 'Lihat Sekarang' },
      { action: 'dismiss', title: 'Nanti' },
    ],
  };
  e.waitUntil(self.registration.showNotification(data.title || 'Mlijoan', opts));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  if (e.action === 'view' || !e.action) {
    e.waitUntil(clients.openWindow(e.notification.data.url));
  }
});
