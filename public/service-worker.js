// Service Worker for Keuangan Telaga Pakisaji PWA

const CACHE_NAME = 'keuangan-telaga-pakisaji-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/index.css',
  '/assets/index.js',
];

// Install a service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Cache and return requests
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

// Update a service worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Handle offline functionality
self.addEventListener('fetch', event => {
  if (!navigator.onLine) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            return response;
          }
          // If the request is for an API call, we might want to queue it for later
          if (event.request.url.includes('/api/')) {
            // Here you could implement a system to queue failed requests
            // and retry them when back online
            return new Response(JSON.stringify({ 
              error: 'You are offline. This request will be queued.'
            }), {
              headers: { 'Content-Type': 'application/json' }
            });
          }
          return caches.match('/');
        })
    );
  }
});

// Listen for online/offline events
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'ONLINE_STATUS_CHANGE') {
    // You could implement logic here to handle online/offline status changes
    console.log('Online status changed:', event.data.online);
  }
});