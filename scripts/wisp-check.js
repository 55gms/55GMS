// Checks a Wisp server the way the proxy uses it: a stream to a public site
// gets an HTTP reply, and a stream to this machine is refused. Works against
// the built-in server and epoxy-server alike (docs/proxy-stack.md).
//
//   node scripts/wisp-check.js [ws://127.0.0.1:8080/api/live/]
//
// Exits non-zero, saying which check failed.
import { client } from "@mercuryworkshop/wisp-js/client";

const url = process.argv[2] || "ws://127.0.0.1:8080/api/live/";
const TIMEOUT_MS = 10000;
// Wisp close reason "destination host is blocked".
const BLOCKED = 0x48;

function connect() {
  return new Promise((resolve, reject) => {
    const conn = new client.ClientConnection(url);
    const timer = setTimeout(
      () => reject(new Error("no handshake")),
      TIMEOUT_MS,
    );
    conn.onopen = () => {
      clearTimeout(timer);
      resolve(conn);
    };
    conn.onerror = () => {
      clearTimeout(timer);
      reject(new Error("websocket error"));
    };
    conn.onclose = () => {
      clearTimeout(timer);
      reject(new Error("closed during the handshake"));
    };
  });
}

// Resolves with { data } for the first bytes the stream returns, or
// { reason } with the close reason if it closes first.
function firstReply(conn, host, port, request) {
  return new Promise((resolve, reject) => {
    const stream = conn.create_stream(host, port);
    const timer = setTimeout(() => reject(new Error("no reply")), TIMEOUT_MS);
    stream.onmessage = (data) => {
      clearTimeout(timer);
      stream.close();
      resolve({ data: Buffer.from(data).toString("latin1") });
    };
    stream.onclose = (reason) => {
      clearTimeout(timer);
      resolve({ reason });
    };
    if (request) stream.send(new TextEncoder().encode(request));
  });
}

let failed = false;
function report(ok, what) {
  console.log(`${ok ? "ok  " : "FAIL"} ${what}`);
  if (!ok) failed = true;
}

try {
  const conn = await connect();
  report(true, `handshake with ${url} (Wisp v${conn.wisp_version})`);

  const reply = await firstReply(
    conn,
    "example.com",
    80,
    "HEAD / HTTP/1.1\r\nHost: example.com\r\nConnection: close\r\n\r\n",
  );
  report(!!reply.data?.startsWith("HTTP/1."), "a public site answers");

  // Loopback and private addresses must be closed as blocked, before the
  // server tries to connect.
  for (const host of [
    "127.0.0.1",
    "localhost",
    "10.0.0.1",
    "169.254.169.254",
  ]) {
    const local = await firstReply(conn, host, 80).catch((e) => ({ e }));
    report(local.reason === BLOCKED, `${host} is blocked`);
  }

  conn.close();
} catch (error) {
  report(false, `${url}: ${error.message}`);
}

process.exit(failed ? 1 : 0);
