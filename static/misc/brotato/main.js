const originalFetch = window.fetch;
const LOCAL_ASSET_BASE = "/misc/brotato/";
let totalBytes = 0;
let loadedBytes = 0;

function setLoadingText(text) {
    const loadingText = document.getElementById("loading-text");

    if (loadingText) {
        loadingText.textContent = text;
    }
}

function updateLoadingProgress() {
    const mbDone = (loadedBytes / (1024 * 1024)).toFixed(2);
    const mbTotal = (totalBytes / (1024 * 1024)).toFixed(2);

    setLoadingText(`LOADING... ${mbDone} MB / ${mbTotal} MB`);
}

async function mergeFiles(fileParts) {
    const buffers = [];

    for (const part of fileParts) {
        buffers.push(await fetchPartBuffer(part));
    }

    setLoadingText("LOADING...");
    return URL.createObjectURL(new Blob(buffers));
}

async function fetchPartBuffer(part) {
    const response = await fetchPartUrl(part);

    if (!response.ok) {
        throw new Error("Missing part: " + response.url);
    }

    if (!response.body) {
        const data = await response.arrayBuffer();
        loadedBytes += data.byteLength;
        updateLoadingProgress();
        return data;
    }

    const reader = response.body.getReader();
    const chunks = [];
    let received = 0;

    while (true) {
        const { done, value } = await reader.read();

        if (done) {
            break;
        }

        received += value.length;
        loadedBytes += value.length;
        chunks.push(value);
        updateLoadingProgress();
    }

    const fullBuffer = new Uint8Array(received);
    let offset = 0;

    for (const chunk of chunks) {
        fullBuffer.set(chunk, offset);
        offset += chunk.length;
    }

    return fullBuffer.buffer;
}

async function fetchPartUrl(part) {
    const cdnUrl = new URL(part, document.baseURI).href;

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2500);
        const cdnResponse = await originalFetch(cdnUrl, { signal: controller.signal });
        clearTimeout(timeout);

        if (cdnResponse.ok) {
            return cdnResponse;
        }
    } catch (error) {
        console.warn(`Falling back to local Brotato asset for ${part}`, error);
    }

    return originalFetch(window.location.origin + LOCAL_ASSET_BASE + part);
}

async function getPartSize(part) {
    const localUrl = window.location.origin + LOCAL_ASSET_BASE + part;

    try {
        const response = await originalFetch(localUrl, { method: "HEAD" });

        if (response.ok) {
            return parseInt(response.headers.get("Content-Length") || "0", 10);
        }
    } catch {
        return 0;
    }

    return 0;
}

function getParts(file, start, end) {
    const parts = [];

    for (let i = start; i <= end; i++) {
        parts.push(file + ".part" + i);
    }

    return parts;
}

(async () => {
    const pckParts = getParts("index.pck", 1, 7);
    const wasmParts = getParts("index.wasm", 1, 2);
    const allParts = [...pckParts, ...wasmParts];

    const sizes = await Promise.all(allParts.map(getPartSize));
    totalBytes = sizes.reduce((total, size) => total + size, 0);
    updateLoadingProgress();

    const [pckUrl, wasmUrl] = await Promise.all([
        mergeFiles(pckParts),
        mergeFiles(wasmParts),
    ]);

    window.fetch = async function (url, ...args) {
        if (url.endsWith("index.pck")) {
            return originalFetch(pckUrl, ...args);
        }

        if (url.endsWith("index.wasm")) {
            return originalFetch(wasmUrl, ...args);
        }

        return originalFetch(url, ...args);
    };

    setLoadingText("LOADING...");
    window.godotRunStart();
})().catch((error) => {
    console.error(error);
    setLoadingText("Brotato failed to load. Please try refreshing.");
});
