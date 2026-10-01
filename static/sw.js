importScripts("/controller/controller.sw.js?v=0.0.14");

// The controller owns RPC, activation, client claiming and worker recovery.
// Leave local requests to the browser instead of intercepting every asset.
self.addEventListener("fetch", (event) => {
  if ($scramjetController.shouldRoute(event)) {
    event.respondWith($scramjetController.route(event));
  }
});
