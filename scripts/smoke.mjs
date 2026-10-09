// Boot the server and verify the proxy embed chain actually serves.
//
//   node scripts/smoke.mjs            # serve what `node .` serves (built if
//                                     # dist/current exists, else static/)
//   node scripts/smoke.mjs --source   # force the un-built sources
//   node scripts/smoke.mjs --port 8123
//
// This is the check that would have caught the "vendor-core.js 404 / text-html"
// failure: it loads /embed.html and every bundle frame-runtime needs, asserts
// each is served as JavaScript/WASM (not the SPA fallback HTML), and confirms
// the served vendor-core.js still defines $scramjet. Exits non-zero on the
// first problem so it is usable in a pre-push check.

import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(fileURLToPath(import.meta.url), "../..");
const args = process.argv.slice(2);
const portArg = args.indexOf("--port");
const PORT = portArg !== -1 ? Number(args[portArg + 1]) : 8199;
const BASE = `http://localhost:${PORT}`;
const forceSource = args.includes("--source");

// Each check: a URL, the HTTP status we expect, and a substring the
// Content-Type must contain. The SPA fallback answers unmatched routes with
// `text/html`, so a bundle served as `text/html` is the failure we are hunting.
const checks = [
  { url: "/embed.html", status: 200, type: "text/html" },
  { url: "/b", status: 200, type: "text/html" },
  { url: "/assets/js/frame-runtime.js", status: 200, type: "javascript" },
  { url: "/assets/lib/vendor-core.js?v=2.0.67-alpha.2-1", status: 200, type: "javascript" },
  { url: "/assets/lib/vendor-frame.js?v=0.0.14-1", status: 200, type: "javascript" },
  { url: "/assets/lib/vendor-util.js?v=0.0.3-1", status: 200, type: "javascript" },
  { url: "/assets/lib/vendor-net.js?v=3.0.1-1", status: 200, type: "javascript" },
  { url: "/assets/lib/vendor-core.wasm?v=2.0.67-alpha.2-1", status: 200, type: "wasm" },
  { url: "/sw.js", status: 200, type: "javascript" },
];

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function waitForServer(deadlineMs = 25000) {
  const start = Date.now();
  while (Date.now() - start < deadlineMs) {
    try {
      const res = await fetch(`${BASE}/embed.html`, { redirect: "manual" });
      if (res.status < 500) return true;
    } catch {
      // not up yet
    }
    await wait(300);
  }
  return false;
}

async function main() {
  const env = { ...process.env, PORT: String(PORT) };
  if (forceSource) env.STATIC_ROOT = "static";

  const server = spawn("node", ["."], { cwd: ROOT, env, stdio: ["ignore", "pipe", "pipe"] });
  let serverLog = "";
  server.stdout.on("data", (d) => (serverLog += d));
  server.stderr.on("data", (d) => (serverLog += d));

  let failed = 0;
  try {
    if (!(await waitForServer())) {
      console.error(`[smoke] server never answered on ${BASE}\n${serverLog}`);
      process.exitCode = 1;
      return;
    }
    console.log(`[smoke] server up on ${BASE}\n`);

    for (const c of checks) {
      let line;
      try {
        const res = await fetch(`${BASE}${c.url}`, { redirect: "manual" });
        const type = res.headers.get("content-type") || "";
        const ok = res.status === c.status && type.includes(c.type);
        if (!ok) failed++;
        line = `${ok ? "ok  " : "FAIL"} ${c.url}\n       status ${res.status} (want ${c.status}), type "${type}" (want *${c.type}*)`;
      } catch (err) {
        failed++;
        line = `FAIL ${c.url}\n       ${err.message}`;
      }
      console.log(line);
    }

    // The served core bundle must still publish the global the rest of the
    // stack destructures; an empty/HTML body would pass the type check in
    // theory but fail here.
    try {
      const body = await (await fetch(`${BASE}/assets/lib/vendor-core.js?v=2.0.67-alpha.2-1`)).text();
      const defines = /\$scramjet/.test(body) && body.length > 1000;
      if (!defines) failed++;
      console.log(`${defines ? "ok  " : "FAIL"} vendor-core defines $scramjet (${body.length} bytes)`);
    } catch (err) {
      failed++;
      console.log(`FAIL reading vendor-core body: ${err.message}`);
    }
  } finally {
    server.kill("SIGTERM");
  }

  console.log(failed ? `\n[smoke] ${failed} check(s) FAILED` : `\n[smoke] all checks passed`);
  process.exitCode = failed ? 1 : 0;
}

main();
