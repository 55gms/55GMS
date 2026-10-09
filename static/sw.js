importScripts("/assets/lib/vendor-worker.js?v=0.0.14-1");

const frames = self[["$scr", "amj", "etController"].join("")];

// The controller owns RPC, activation, client claiming and worker recovery.
// Leave local requests to the browser instead of intercepting every asset.
self.addEventListener("fetch", (event) => {
  if (frames.shouldRoute(event)) {
    event.respondWith(frames.route(event));
  }
});

// This worker is scoped to the frame prefix, so the embed pages that own the
// controllers are not its clients and miss the controller bundle's restart
// notice. Tell them too, or a restarted worker would stop routing their frames.
setTimeout(async () => {
  const scope = new URL(registration.scope).pathname;
  const windows = await clients.matchAll({
    type: "window",
    includeUncontrolled: true,
  });
  for (const client of windows) {
    if (new URL(client.url).pathname.startsWith(scope)) continue;
    client.postMessage({ $controller$swrevive: {} });
  }
}, 100);
