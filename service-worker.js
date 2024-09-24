const CACHE_NAME = 'vk-bmi';
const urlsToCache = [
    '/pwa-bmi-calculator.html',  // Main BMI calculator page
    '/style/pwa.css',            // CSS for styling
    '/js/pwa.js',                // Your JavaScript for functionality
    '/manifest.json',            // PWA manifest
    '/index.html',             // Fallback page for offline usage
    // Add more assets like fonts or images if necessary
];

// Install event: Cache the essential assets
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
                // Cache the new response if needed
                return caches.open(CACHE_NAME).then(cache => {
                    // Cache only if it's a valid response
                    if (event.request.method === 'GET' && networkResponse.status === 200) {
                        cache.put(event.request, networkResponse.clone());
                    }
                    return networkResponse;
                });
            });
        }).catch(() => {
            // Fallback for when both cache and network fail (e.g., offline)
            if (event.request.mode === 'navigate') {
                return caches.match('/index.html');  // Ensure offline.html is cached
            }
        })
    );
});
