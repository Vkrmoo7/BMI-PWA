const CACHE_NAME = 'bmi-cache-v1';
const urlsToCache = [
    '/index.html',
    '/styles.css',
    '/pwa-bmi-calculator.html',
    '/style/pwa.css',
    '/js/pwa.js',
    '/manifest.json',
    // Add more resources if needed, such as images, fonts, etc.
];

// Install event: Cache assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
    );
});

// Activate event: Clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch event: Serve from cache or fetch from network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            // Return cache hit or fetch from network
            return response || fetch(event.request).then(networkResponse => {
                // Optionally cache the new request if needed
                return caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            });
        }).catch(() => {
            // Fallback in case of an error (e.g., user is offline)
            if (event.request.mode === 'navigate') {
                return caches.match('/offline.html');  // Make sure you cache an offline.html page if needed
            }
        })
    );
});
