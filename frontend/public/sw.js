// Simple service worker for PWA functionality
const CACHE_NAME = 'fs-app-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  // Check if this is an API request (contains /api/ in the path)
  const url = new URL(event.request.url);
  const isApiRequest = url.pathname.includes('/api/');
  const isSameOrigin = event.request.url.startsWith(self.location.origin);

  // For API requests or requests to different origins, bypass the cache and fetch directly
  if (!isSameOrigin || isApiRequest) {
    event.respondWith(fetch(event.request));
  } else {
    // For same-origin static assets, use cache-first strategy
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          // Return cached version if available, otherwise fetch from network
          if (response) {
            return response;
          }
          return fetch(event.request);
        }
      )
    );
  }
});