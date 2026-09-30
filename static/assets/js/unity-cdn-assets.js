// Keep Unity's original filenames intact: its decompression code uses their suffixes.
export function assetKey(input, base) {
  const url = new URL(input instanceof Request ? input.url : input, base);
  url.search = "";
  url.hash = "";
  return url.href;
}

export async function downloadPart(part, base, onProgress, fetchFile = fetch) {
  const response = await fetchFile(new URL(part.path, base));
  if (!response.ok) throw new Error(`${part.path}: HTTP ${response.status}`);
  const bytes = new Uint8Array(part.size);
  let received = 0;
  if (response.body) {
    const reader = response.body.getReader();
    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        if (received + value.byteLength > bytes.byteLength) {
          throw new Error(`${part.path}: unexpected chunk size`);
        }
        bytes.set(value, received);
        received += value.byteLength;
        onProgress(part.path, received);
      }
    } finally {
      reader.releaseLock();
    }
  } else {
    const buffer = await response.arrayBuffer();
    if (buffer.byteLength !== part.size) {
      throw new Error(`${part.path}: unexpected chunk size`);
    }
    bytes.set(new Uint8Array(buffer));
    received = buffer.byteLength;
    onProgress(part.path, received);
  }
  if (received !== part.size) throw new Error(`${part.path}: incomplete chunk`);
  return bytes;
}

export async function prepareAssets(
  manifest,
  base,
  onProgress,
  fetchFile = fetch,
) {
  const routes = new Map();
  const blobs = [];
  // Process files sequentially and at most three parts at a time to bound memory.
  try {
    for (const file of manifest.files) {
      let target = new URL(file.path, base).href;
      if (
        file.parts ||
        (file.type === "application/javascript" && file.path.endsWith(".br"))
      ) {
        const parts = file.parts || [{ path: file.path, size: file.size }];
        if (parts.reduce((size, part) => size + part.size, 0) !== file.size) {
          throw new Error(`${file.path}: invalid chunk manifest`);
        }
        const buffers = [];
        for (let offset = 0; offset < parts.length; offset += 3) {
          buffers.push(
            ...(await Promise.all(
              parts
                .slice(offset, offset + 3)
                .map((part) => downloadPart(part, base, onProgress, fetchFile)),
            )),
          );
        }
        target = URL.createObjectURL(new Blob(buffers, { type: file.type }));
        blobs.push(target);
      }
      routes.set(assetKey(file.path, base), target);
    }
  } catch (error) {
    blobs.forEach((url) => URL.revokeObjectURL(url));
    throw error;
  }
  return { routes, blobs };
}

export function installAssetRoutes(routes, base, environment = window) {
  const originalFetch = environment.fetch;
  const originalOpen = environment.XMLHttpRequest.prototype.open;
  const scriptPrototype = environment.HTMLScriptElement?.prototype;
  const scriptSource =
    scriptPrototype && Object.getOwnPropertyDescriptor(scriptPrototype, "src");
  const resolve = (input) => {
    const siteOrigin = environment.location?.origin;
    if (
      siteOrigin &&
      typeof input === "string" &&
      input.startsWith("/") &&
      !input.startsWith("//")
    ) {
      input = new URL(input, siteOrigin).href;
      return routes.get(assetKey(input, base)) || input;
    }
    return routes.get(assetKey(input, base));
  };
  environment.fetch = function (input, options) {
    const target = resolve(input);
    if (target) {
      input = input instanceof Request ? new Request(target, input) : target;
    }
    return originalFetch.call(this, input, options);
  };
  environment.XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    return originalOpen.call(this, method, resolve(url) || url, ...rest);
  };
  if (scriptSource) {
    Object.defineProperty(scriptPrototype, "src", {
      ...scriptSource,
      set(url) {
        scriptSource.set.call(this, resolve(url) || url);
      },
    });
  }
  return () => {
    environment.fetch = originalFetch;
    environment.XMLHttpRequest.prototype.open = originalOpen;
    if (scriptSource)
      Object.defineProperty(scriptPrototype, "src", scriptSource);
  };
}
