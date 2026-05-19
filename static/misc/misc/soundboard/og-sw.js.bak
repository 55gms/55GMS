// Install and activate the service worker
self.addEventListener("install", function (event) {
  console.log("SW installing...");
  event.waitUntil(
    caches.open("soundboard-cache-v1").then(function (cache) {
      return cache.addAll([
        "/",
        "index.html",
        "css/styles.css",
        "css/spinner.css",
        "img/mlg-favicon.png",
        "loader.js",
        "sounds.json",
      ]);
    })
  );
});

self.addEventListener("activate", function (event) {
  console.log("SW activating...");
});

// Intercept network requests and return cached responses
self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});
