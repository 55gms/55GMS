// Loaded ahead of the <base> on game pages whose files come from jsDelivr.
// Two things a game expects of its own files stop working once they are on
// another origin, and both are restored here:
//
// - Workers: browsers refuse a Worker script from another origin, so it is
//   started from a same-origin blob that loads the real script, with relative
//   URLs inside it resolved against that script instead of the blob.
// - Images and media drawn into WebGL or a canvas: without CORS they taint it.
//   jsDelivr allows any origin, so requests to the <base> host ask for CORS.
(() => {
  const cdnOrigin = () => new URL(document.baseURI).origin;
  const onCdn = (url) => {
    try {
      const { origin } = new URL(url, document.baseURI);
      return origin !== location.origin && origin === cdnOrigin();
    } catch {
      return false;
    }
  };

  for (const Element of [window.HTMLImageElement, window.HTMLMediaElement]) {
    const src =
      Element && Object.getOwnPropertyDescriptor(Element.prototype, "src");
    if (!src?.set) continue;
    Object.defineProperty(Element.prototype, "src", {
      ...src,
      set(value) {
        if (this.crossOrigin === null && onCdn(value))
          this.crossOrigin = "anonymous";
        src.set.call(this, value);
      },
    });
  }

  const Native = window.Worker;
  if (!Native) return;
  const classic = (href) => `const base = ${JSON.stringify(href)};
const at = (url) => (typeof url === "string" ? new URL(url, base).href : url);
const load = self.importScripts.bind(self);
self.importScripts = (...urls) => load(...urls.map(at));
const get = self.fetch.bind(self);
self.fetch = (input, options) => get(at(input), options);
if (self.XMLHttpRequest) {
  const open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    return open.call(this, method, at(url), ...rest);
  };
}
importScripts(base);`;
  window.Worker = class Worker extends Native {
    constructor(url, options) {
      const script = new URL(url, document.baseURI);
      if (
        script.origin !== location.origin &&
        /^https?:$/.test(script.protocol)
      ) {
        const source =
          options?.type === "module"
            ? `import ${JSON.stringify(script.href)};`
            : classic(script.href);
        url = URL.createObjectURL(
          new Blob([source], { type: "text/javascript" }),
        );
      }
      super(url, options);
    }
  };
})();
