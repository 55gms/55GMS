// Sends a ripped game's own network traffic through this site's Wisp server
// (/api/live/, the one the proxy uses), so a game whose files are served
// from 55GMS still reaches its real multiplayer servers. The game needs no
// change: WebSocket, fetch and XMLHttpRequest calls to the hosts named below
// open a Wisp stream from the server instead of a connection from the
// browser. That gets past what stops them otherwise: a ws:// server on an
// https:// page (mixed content), a server that only answers its own site's
// Origin, and filters that block the game's domains.
//
// Load it in the game page's <head>, before the <base> and the game:
//   <script src="/assets/js/game-net.js?v=1"
//     data-sockets="*" data-fetch="slither.io"
//     data-origin="http://slither.io"></script>
//
// data-sockets  hosts whose WebSockets go through Wisp
// data-fetch    hosts whose fetch and XMLHttpRequest calls go through Wisp
// data-origin   the Origin header sent with both (the game's own site)
// data-root     for a game that expects to be at the root of its own site:
//               that site's origin. Root paths and this host's sockets go
//               there (see remap below).
// data-local    root path prefixes that stay in the game folder ("/data/")
// data-block    hosts whose <script>s never load (a game's own ad code)
// data-disable  globals to remove, such as WebTransport, which Wisp cannot
//               carry, so the game falls back to a WebSocket
//
// Hosts are separated by spaces or commas: "slither.io" is that host only,
// "*.slither.io" also its subdomains, "*" every host but this page's own.
// Game servers on raw IP addresses need "*". The Wisp server only connects
// to public addresses, so "*" never reaches this machine or its network.
// See docs/multiplayer.md.
(() => {
  const script = document.currentScript;
  if (!script || window.GMSNet) return;
  const data = script.dataset;
  const hosts = (value) =>
    String(value || "")
      .toLowerCase()
      .split(/[\s,]+/)
      .filter(Boolean);
  const socketHosts = hosts(data.sockets);
  const fetchHosts = hosts(data.fetch);
  const origin = data.origin || "";
  let root = null;
  try {
    if (data.root) root = new URL(data.root);
  } catch {}
  const localPaths = String(data.local || "")
    .split(/[\s,]+/)
    .filter((p) => p.startsWith("/"));
  for (const name of String(data.disable || "").split(/[\s,]+/))
    if (name) {
      try {
        delete window[name];
      } catch {}
      if (name in window) window[name] = undefined;
    }
  const blocked = hosts(data.block);
  if (!socketHosts.length && !fetchHosts.length && !root && !blocked.length)
    return;

  const pageHost = location.host.toLowerCase();
  const matches = (patterns, url) => {
    if (url.host.toLowerCase() === pageHost) return false;
    const host = url.hostname.toLowerCase();
    return patterns.some(
      (p) =>
        p === "*" ||
        p === host ||
        (p.startsWith("*.") &&
          (host === p.slice(2) || host.endsWith(p.slice(1)))),
    );
  };
  const resolve = (url) => {
    try {
      return new URL(String(url), document.baseURI);
    } catch {
      return null;
    }
  };

  // data-root: the game thinks it is at the root of its own site. A root
  // path (which lands on this page's host, or on the CDN's host through the
  // page's <base>) goes to that site, or stays in the game folder when it
  // starts with one of data-local's prefixes; a server on a subdomain of
  // this page's host ("2.<host>") becomes the same subdomain of that site.
  const SITE_PATHS = /^\/(assets|api|misc|img|_ads)\//;
  const remap = (url) => {
    if (!root || !url) return url;
    const base = new URL(document.baseURI);
    const page = location.hostname.toLowerCase();
    const host = url.hostname.toLowerCase();
    const atRoot =
      (url.host === location.host && !SITE_PATHS.test(url.pathname)) ||
      (base.host !== location.host &&
        url.host === base.host &&
        !/^\/(gh|npm)\//.test(url.pathname));
    const sub =
      !atRoot && host.endsWith("." + page) ? host.slice(0, -page.length) : null;
    if (!atRoot && sub === null) return url;
    const path = url.pathname + url.search + url.hash;
    if (atRoot && localPaths.some((p) => url.pathname.startsWith(p)))
      return new URL(path.slice(1), base);
    const out = new URL(path, root);
    if (sub) out.hostname = sub + root.hostname;
    if (/^wss?:$/.test(url.protocol))
      out.protocol = root.protocol === "https:" ? "wss:" : "ws:";
    return out;
  };
  // data-block: hosts whose scripts never load (the ad and tracking code a
  // game pulls in by itself). The script fires "error", as if it had failed.
  if (blocked.length) {
    const desc = Object.getOwnPropertyDescriptor(
      HTMLScriptElement.prototype,
      "src",
    );
    const refuse = (el) =>
      setTimeout(() => el.dispatchEvent(new Event("error")));
    const isBlocked = (value) => {
      const url = resolve(value);
      return !!url && matches(blocked, url);
    };
    Object.defineProperty(HTMLScriptElement.prototype, "src", {
      ...desc,
      set(value) {
        if (isBlocked(value)) refuse(this);
        else desc.set.call(this, value);
      },
    });
    const setAttribute = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function (name, value) {
      if (
        this instanceof HTMLScriptElement &&
        String(name).toLowerCase() === "src" &&
        isBlocked(value)
      )
        return refuse(this);
      return setAttribute.call(this, name, value);
    };
  }

  // Images: root paths are remapped (data-root), and an image from the
  // page's <base> host (the CDN, which always allows CORS) is fetched with
  // CORS, so a game can still draw it into WebGL or read its pixels as it
  // could when it came from its own origin.
  {
    const src = Object.getOwnPropertyDescriptor(
      HTMLImageElement.prototype,
      "src",
    );
    Object.defineProperty(HTMLImageElement.prototype, "src", {
      ...src,
      set(value) {
        const url = remap(resolve(value));
        if (
          url &&
          url.host !== location.host &&
          url.host === new URL(document.baseURI).host &&
          this.crossOrigin === null
        )
          this.crossOrigin = "anonymous";
        src.set.call(this, url ? url.href : value);
      },
    });
  }

  // The transport is the proxy's own Epoxy build (utils/proxyAssets.js). It
  // is large, so it starts loading now, while the game loads, and every
  // connection waits for it.
  const wisp = `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/api/live/`;
  let transport = null;
  const ready = () =>
    (transport ||= new Promise((resolve, reject) => {
      const tag = document.createElement("script");
      tag.src = location.origin + "/assets/lib/vendor-net.js?v=3.0.1-1";
      // The bundle is UMD: under a page's AMD loader it would register a
      // module instead of setting its global.
      const amd = window.define && window.define.amd;
      if (amd) window.define.amd = undefined;
      const done = () => {
        if (amd) window.define.amd = amd;
        tag.remove();
      };
      // Intermediate certificates the TLS client trusts on top of its roots:
      // browsers fetch a server's missing intermediate (AIA), rustls does
      // not, so a game server that sends only its leaf would fail.
      const certs = fetch(
        location.origin + "/assets/json/tls-intermediates.json",
      )
        .then((r) => (r.ok ? r.json() : {}))
        .then((j) => (Array.isArray(j.certs) ? j.certs : []))
        .catch(() => []);
      tag.onload = async () => {
        done();
        const Transport = window[["Epo", "xyTran", "sport"].join("")];
        if (!Transport) return reject(new Error("The transport did not load."));
        const t = new Transport.default({ wisp, wisp_v2: true });
        const pems = await certs;
        // The transport copies only its own options onto the client's; add
        // the certificates while it does.
        const setopt = t.setopt;
        t.setopt = function (options, opt) {
          if (pems.length) options.pem_files = pems;
          return setopt.call(this, options, opt);
        };
        t.init().then(() => resolve(t), reject);
      };
      tag.onerror = () => {
        done();
        reject(new Error("The transport did not load."));
      };
      (document.head || document.documentElement).appendChild(tag);
    }));
  ready().catch((err) => console.warn("game-net:", err));

  const originHeaders = () => (origin ? [["Origin", origin]] : []);

  // One HTTP request through Wisp, following redirects like fetch does.
  async function request(
    url,
    {
      method = "GET",
      headers = [],
      body = null,
      signal,
      redirect = "follow",
    } = {},
  ) {
    const t = await ready();
    const sent = [...originHeaders()];
    for (const [k, v] of headers)
      if (k.toLowerCase() !== "origin" || !origin) sent.push([k, v]);
    for (let hops = 0; ; hops++) {
      const res = await t.request(url, method, body, sent, signal);
      const moved = res.headers.find(([k]) => k.toLowerCase() === "location");
      if (
        redirect === "follow" &&
        moved &&
        [301, 302, 303, 307, 308].includes(res.status)
      ) {
        if (hops >= 10) throw new TypeError("Too many redirects.");
        url = new URL(moved[1], url);
        if (
          res.status === 303 ||
          ((res.status === 301 || res.status === 302) && method === "POST")
        ) {
          method = "GET";
          body = null;
        }
        continue;
      }
      if (res.status < 200 || res.status > 599)
        throw new TypeError("Failed to fetch");
      const out = new Headers();
      for (const [k, v] of res.headers) {
        try {
          out.append(k, v);
        } catch {}
      }
      const empty = method === "HEAD" || [204, 205, 304].includes(res.status);
      const response = new Response(empty ? null : res.body, {
        status: res.status,
        statusText: res.statusText,
        headers: out,
      });
      Object.defineProperty(response, "url", { value: url.href });
      return response;
    }
  }

  if (fetchHosts.length || root) {
    const nativeFetch = window.fetch;
    window.fetch = function (input, init) {
      const raw = resolve(input instanceof Request ? input.url : input);
      const url = remap(raw);
      if (
        !url ||
        !/^https?:$/.test(url.protocol) ||
        !matches(fetchHosts, url)
      ) {
        if (!url || url.href === raw.href)
          return nativeFetch.apply(this, arguments);
        return nativeFetch.call(
          this,
          input instanceof Request ? new Request(url.href, input) : url.href,
          init,
        );
      }
      return (async () => {
        const req = new Request(
          input instanceof Request ? input : url.href,
          init,
        );
        const body =
          req.method === "GET" || req.method === "HEAD"
            ? null
            : await req.arrayBuffer();
        return request(url, {
          method: req.method,
          headers: [...req.headers],
          body,
          signal: req.signal,
          redirect: req.redirect,
        });
      })();
    };

    // XMLHttpRequest: the native object is opened as usual, so its
    // setRequestHeader and state checks keep working, but send() goes
    // through Wisp and the result is written onto the instance.
    const XHR = XMLHttpRequest.prototype;
    const { open, send, setRequestHeader, abort } = XHR;
    const pending = new WeakMap();
    const RESULT = [
      "readyState",
      "status",
      "statusText",
      "responseURL",
      "responseText",
      "response",
      "responseXML",
      "getResponseHeader",
      "getAllResponseHeaders",
    ];
    const define = (xhr, values) => {
      for (const [k, value] of Object.entries(values))
        Object.defineProperty(xhr, k, { value, configurable: true });
    };
    XHR.open = function (method, url, async) {
      pending.delete(this);
      for (const k of RESULT) delete this[k];
      const target = remap(resolve(url));
      if (
        target &&
        async !== false &&
        /^https?:$/.test(target.protocol) &&
        matches(fetchHosts, target)
      )
        pending.set(this, {
          method: String(method).toUpperCase(),
          url: target,
          headers: [],
        });
      const args = [...arguments];
      if (target) args[1] = target.href;
      return open.apply(this, args);
    };
    XHR.setRequestHeader = function (name, value) {
      setRequestHeader.call(this, name, value);
      const job = pending.get(this);
      if (job) job.headers.push([String(name), String(value)]);
    };
    XHR.abort = function () {
      const job = pending.get(this);
      if (job) job.aborted = true;
      return abort.call(this);
    };
    XHR.send = function (body) {
      const job = pending.get(this);
      if (!job) return send.apply(this, arguments);
      if (job.sent)
        throw new DOMException(
          "The object's state must be OPENED.",
          "InvalidStateError",
        );
      job.sent = true;
      const xhr = this;
      const fire = (type) =>
        xhr.dispatchEvent(
          type === "readystatechange"
            ? new Event(type)
            : new ProgressEvent(type),
        );
      fire("loadstart");
      (async () => {
        let payload = null;
        if (body != null && job.method !== "GET" && job.method !== "HEAD")
          payload = await new Response(body).arrayBuffer();
        const res = await request(job.url, {
          method: job.method,
          headers: job.headers,
          body: payload,
        });
        const buf = await res.arrayBuffer();
        if (job.aborted) return;
        const type = xhr.responseType;
        const text =
          type === "" || type === "text" ? new TextDecoder().decode(buf) : "";
        let response = text;
        if (type === "arraybuffer") response = buf;
        else if (type === "blob")
          response = new Blob([buf], {
            type: res.headers.get("content-type") || "",
          });
        else if (type === "json") {
          try {
            response = JSON.parse(new TextDecoder().decode(buf));
          } catch {
            response = null;
          }
        } else if (type === "document") response = null;
        const raw = [...res.headers].map(([k, v]) => `${k}: ${v}`).join("\r\n");
        define(xhr, {
          readyState: 4,
          status: res.status,
          statusText: res.statusText,
          responseURL: res.url,
          responseText: text,
          response,
          responseXML: null,
          getResponseHeader: (name) => res.headers.get(name),
          getAllResponseHeaders: () => (raw ? raw + "\r\n" : ""),
        });
        fire("readystatechange");
        fire("progress");
        fire("load");
        fire("loadend");
      })().catch(() => {
        if (job.aborted) return;
        define(xhr, {
          readyState: 4,
          status: 0,
          statusText: "",
          responseText: "",
          response:
            xhr.responseType === "" || xhr.responseType === "text" ? "" : null,
        });
        fire("readystatechange");
        fire("error");
        fire("loadend");
      });
    };
  }

  if (socketHosts.length || root) {
    const Native = window.WebSocket;
    const [CONNECTING, OPEN, CLOSING, CLOSED] = [0, 1, 2, 3];
    const TYPES = ["open", "message", "error", "close"];
    const GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    const concat = (a, b) => {
      if (!a.length) return b;
      const out = new Uint8Array(a.length + b.length);
      out.set(a);
      out.set(b, a.length);
      return out;
    };
    const base64 = (bytes) => btoa(String.fromCharCode(...bytes));

    // One masked client frame (RFC 6455 section 5.2).
    const frame = (opcode, payload) => {
      const len = payload.length;
      const head = len < 126 ? 2 : len < 65536 ? 4 : 10;
      const out = new Uint8Array(head + 4 + len);
      out[0] = 0x80 | opcode;
      if (len < 126) out[1] = 0x80 | len;
      else if (len < 65536) {
        out[1] = 0x80 | 126;
        out[2] = len >> 8;
        out[3] = len & 255;
      } else {
        out[1] = 0x80 | 127;
        new DataView(out.buffer).setBigUint64(2, BigInt(len));
      }
      const mask = crypto.getRandomValues(new Uint8Array(4));
      out.set(mask, head);
      for (let i = 0; i < len; i++)
        out[head + 4 + i] = payload[i] ^ mask[i & 3];
      return out;
    };
    const closePayload = (code, reason) => {
      if (code == null) return new Uint8Array(0);
      const text = encoder.encode(reason || "");
      const out = new Uint8Array(2 + text.length);
      out[0] = code >> 8;
      out[1] = code & 255;
      out.set(text, 2);
      return out;
    };

    // A WebSocket with the browser's API, spoken by this script over a raw
    // TCP (ws:) or TLS (wss:) stream through Wisp. Not Epoxy's own WebSocket:
    // its write half never flushes, so a frame waits until the next one is
    // sent, and a game that sends one message and waits for the answer hangs.
    class TunnelSocket extends EventTarget {
      #url;
      #protocol = "";
      #state = CONNECTING;
      #binaryType = "blob";
      #handlers = {};
      #reader = null;
      #writer = null;
      #queue = Promise.resolve();
      #closeTimer = 0;

      constructor(url, protocols) {
        super();
        this.#url = url;
        for (const type of TYPES)
          this.addEventListener(type, (e) => {
            const h = this.#handlers[type];
            if (typeof h === "function") h.call(this, e);
          });
        const list = protocols == null ? [] : [].concat(protocols).map(String);
        this.#connect(list).catch(() => this.#fail());
      }

      async #connect(protocols) {
        const t = await ready();
        if (this.#state !== CONNECTING) return;
        const url = this.#url;
        const tls = url.protocol === "wss:";
        const target = `${tls ? "tls" : "tcp"}://${url.hostname}:${url.port || (tls ? 443 : 80)}`;
        const io = await (tls
          ? t.client.connect_tls(target)
          : t.client.connect_tcp(target));
        this.#reader = io.read.getReader();
        this.#writer = io.write.getWriter();
        if (this.#state !== CONNECTING) return this.#shutdown();

        const key = base64(crypto.getRandomValues(new Uint8Array(16)));
        const lines = [
          `GET ${url.pathname}${url.search} HTTP/1.1`,
          `Host: ${url.host}`,
          "Upgrade: websocket",
          "Connection: Upgrade",
          `Sec-WebSocket-Key: ${key}`,
          "Sec-WebSocket-Version: 13",
          `User-Agent: ${navigator.userAgent}`,
        ];
        if (origin) lines.push(`Origin: ${origin}`);
        if (protocols.length)
          lines.push(`Sec-WebSocket-Protocol: ${protocols.join(", ")}`);
        await this.#writer.write(
          encoder.encode(lines.join("\r\n") + "\r\n\r\n"),
        );

        // The response head, then frames from whatever follows it.
        let buf = new Uint8Array(0);
        let end = -1;
        while (end < 0) {
          const { value, done } = await this.#reader.read();
          if (done) throw new Error("closed during the handshake");
          buf = concat(buf, value);
          for (let i = 3; i < buf.length && end < 0; i++)
            if (
              buf[i - 3] === 13 &&
              buf[i - 2] === 10 &&
              buf[i - 1] === 13 &&
              buf[i] === 10
            )
              end = i + 1;
          if (end < 0 && buf.length > 16384)
            throw new Error("handshake too long");
        }
        const [status, ...fields] = decoder
          .decode(buf.subarray(0, end))
          .split("\r\n");
        const headers = {};
        for (const line of fields) {
          const i = line.indexOf(":");
          if (i > 0)
            headers[line.slice(0, i).trim().toLowerCase()] = line
              .slice(i + 1)
              .trim();
        }
        const digest = new Uint8Array(
          await crypto.subtle.digest("SHA-1", encoder.encode(key + GUID)),
        );
        if (
          !/^HTTP\/1\.1 101\b/.test(status) ||
          headers["sec-websocket-accept"] !== base64(digest)
        )
          throw new Error("handshake refused");
        if (this.#state !== CONNECTING) return this.#shutdown();
        this.#protocol = headers["sec-websocket-protocol"] || "";
        this.#state = OPEN;
        this.dispatchEvent(new Event("open"));
        this.#read(buf.subarray(end));
      }

      async #read(buf) {
        let parts = null;
        let partsText = false;
        try {
          for (;;) {
            // Every complete frame in the buffer.
            for (;;) {
              if (buf.length < 2) break;
              const fin = buf[0] & 0x80;
              const opcode = buf[0] & 0x0f;
              const masked = buf[1] & 0x80;
              let len = buf[1] & 0x7f;
              let off = 2;
              if (len === 126) {
                if (buf.length < 4) break;
                len = (buf[2] << 8) | buf[3];
                off = 4;
              } else if (len === 127) {
                if (buf.length < 10) break;
                len = Number(
                  new DataView(buf.buffer, buf.byteOffset + 2, 8).getBigUint64(
                    0,
                  ),
                );
                off = 10;
              }
              const mask = masked ? buf.slice(off, off + 4) : null;
              if (masked) off += 4;
              if (buf.length < off + len) break;
              const payload = buf.slice(off, off + len);
              buf = buf.subarray(off + len);
              if (mask)
                for (let i = 0; i < payload.length; i++)
                  payload[i] ^= mask[i & 3];

              if (opcode === 0x9) this.#write(0xa, payload);
              else if (opcode === 0x8) {
                const code =
                  payload.length >= 2 ? (payload[0] << 8) | payload[1] : 1005;
                const reason = decoder.decode(payload.subarray(2));
                if (this.#state === OPEN)
                  this.#write(0x8, payload.subarray(0, 2));
                this.#state = CLOSING;
                await this.#queue;
                this.#finish(code, reason, true);
                return;
              } else if (opcode === 0x1 || opcode === 0x2 || opcode === 0x0) {
                if (opcode !== 0x0) {
                  parts = [];
                  partsText = opcode === 0x1;
                }
                if (!parts) throw new Error("unexpected continuation frame");
                parts.push(payload);
                if (fin) {
                  const whole =
                    parts.length === 1 ? parts[0] : parts.reduce(concat);
                  parts = null;
                  this.#message(
                    partsText ? decoder.decode(whole) : whole.buffer,
                  );
                }
              }
            }
            const { value, done } = await this.#reader.read();
            if (done) break;
            buf = concat(buf, value);
          }
        } catch {}
        this.#fail();
      }

      #write(opcode, payload) {
        const writer = this.#writer;
        this.#queue = this.#queue
          .then(() => writer.write(frame(opcode, payload)))
          .catch(() => this.#fail());
      }

      #message(data) {
        if (this.#state !== OPEN) return;
        if (typeof data !== "string" && this.#binaryType === "blob")
          data = new Blob([data]);
        this.dispatchEvent(
          new MessageEvent("message", { data, origin: this.#url.origin }),
        );
      }

      #shutdown() {
        clearTimeout(this.#closeTimer);
        if (this.#reader) this.#reader.cancel().catch(() => {});
        if (this.#writer) this.#writer.close().catch(() => {});
      }

      #fail() {
        if (this.#state === CLOSED) return;
        this.dispatchEvent(new Event("error"));
        this.#finish(1006, "", false);
      }

      #finish(code, reason, wasClean) {
        if (this.#state === CLOSED) return;
        this.#state = CLOSED;
        this.#shutdown();
        this.dispatchEvent(new CloseEvent("close", { code, reason, wasClean }));
      }

      get url() {
        return this.#url.href;
      }
      get readyState() {
        return this.#state;
      }
      get bufferedAmount() {
        return 0;
      }
      get extensions() {
        return "";
      }
      get protocol() {
        return this.#protocol;
      }
      get binaryType() {
        return this.#binaryType;
      }
      set binaryType(value) {
        if (value === "blob" || value === "arraybuffer")
          this.#binaryType = value;
      }
      #handler(type, value) {
        this.#handlers[type] = typeof value === "function" ? value : null;
      }
      get onopen() {
        return this.#handlers.open ?? null;
      }
      set onopen(value) {
        this.#handler("open", value);
      }
      get onmessage() {
        return this.#handlers.message ?? null;
      }
      set onmessage(value) {
        this.#handler("message", value);
      }
      get onerror() {
        return this.#handlers.error ?? null;
      }
      set onerror(value) {
        this.#handler("error", value);
      }
      get onclose() {
        return this.#handlers.close ?? null;
      }
      set onclose(value) {
        this.#handler("close", value);
      }

      send(data) {
        if (this.#state === CONNECTING)
          throw new DOMException(
            "Failed to execute 'send' on 'WebSocket': Still in CONNECTING state.",
            "InvalidStateError",
          );
        if (this.#state !== OPEN) return;
        if (typeof data === "string")
          return this.#write(0x1, encoder.encode(data));
        if (data instanceof Blob) {
          // Read in order with the frames around it.
          const writer = this.#writer;
          this.#queue = this.#queue
            .then(async () =>
              writer.write(
                frame(0x2, new Uint8Array(await data.arrayBuffer())),
              ),
            )
            .catch(() => this.#fail());
          return;
        }
        if (ArrayBuffer.isView(data))
          return this.#write(
            0x2,
            new Uint8Array(
              data.buffer,
              data.byteOffset,
              data.byteLength,
            ).slice(),
          );
        if (data instanceof ArrayBuffer)
          return this.#write(0x2, new Uint8Array(data.slice(0)));
        this.#write(0x1, encoder.encode(String(data)));
      }

      close(code, reason) {
        if (
          code !== undefined &&
          code !== 1000 &&
          !(code >= 3000 && code <= 4999)
        )
          throw new DOMException(
            `Failed to execute 'close' on 'WebSocket': The code must be either 1000, or between 3000 and 4999. ${code} is neither.`,
            "InvalidAccessError",
          );
        if (this.#state === CLOSING || this.#state === CLOSED) return;
        if (this.#state === CONNECTING) {
          this.#state = CLOSING;
          setTimeout(() => this.#fail());
          return;
        }
        this.#state = CLOSING;
        this.#write(0x8, closePayload(code, reason ? String(reason) : ""));
        // The server answers with its own close frame (#read); give up on it
        // after a while, as browsers do.
        this.#closeTimer = setTimeout(
          () => this.#finish(1006, "", false),
          5000,
        );
      }
    }
    // Keeps `socket instanceof WebSocket` true and the constants reachable.
    Object.setPrototypeOf(TunnelSocket.prototype, Native.prototype);

    function GMSWebSocket(url, protocols) {
      if (!new.target)
        throw new TypeError(
          "Failed to construct 'WebSocket': Please use the 'new' operator.",
        );
      const raw = resolve(url);
      const target = remap(raw);
      if (
        target &&
        /^(wss?|https?):$/.test(target.protocol) &&
        matches(socketHosts, target)
      ) {
        target.protocol = target.protocol.replace(/^http/, "ws");
        return new TunnelSocket(target, protocols);
      }
      if (target && target.href !== raw.href) url = target.href;
      return protocols === undefined
        ? new Native(url)
        : new Native(url, protocols);
    }
    GMSWebSocket.prototype = Native.prototype;
    for (const k of ["CONNECTING", "OPEN", "CLOSING", "CLOSED"])
      Object.defineProperty(GMSWebSocket, k, {
        value: Native[k],
        enumerable: true,
      });
    window.WebSocket = GMSWebSocket;
  }

  window.GMSNet = { fetch: request, ready };
})();
