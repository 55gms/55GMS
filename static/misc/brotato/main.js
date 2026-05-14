(() => {
    if (window.__brotatoLoaderStarted) {
        return;
    }

    window.__brotatoLoaderStarted = true;

    const originalFetch = window.fetch.bind(window);
    const LOCAL_ASSET_BASE = "/misc/brotato/";
    const ASSETS = {
        "index.pck": [
            ["index.pck.part1", 20971520],
            ["index.pck.part2", 20971520],
            ["index.pck.part3", 20971520],
            ["index.pck.part4", 20971520],
            ["index.pck.part5", 20971520],
            ["index.pck.part6", 20971520],
            ["index.pck.part7", 12501152],
        ],
        "index.wasm": [
            ["index.wasm.part1", 20971520],
            ["index.wasm.part2", 4686549],
        ],
    };

    const totalBytes = Object.values(ASSETS)
        .flat()
        .reduce((total, [, size]) => total + size, 0);
    const mergedAssetPromises = new Map();
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

    function getRequestUrl(input) {
        if (typeof input === "string") {
            return input;
        }

        if (input && typeof input.url === "string") {
            return input.url;
        }

        return "";
    }

    function getAssetName(input) {
        const url = getRequestUrl(input).split("?")[0].split("#")[0];

        return Object.keys(ASSETS).find((assetName) => url.endsWith(assetName));
    }

    async function mergeAsset(assetName) {
        const buffers = [];

        for (const [part] of ASSETS[assetName]) {
            buffers.push(await fetchPartBuffer(part));
        }

        return URL.createObjectURL(new Blob(buffers, { type: "application/octet-stream" }));
    }

    async function fetchPartBuffer(part) {
        const response = await originalFetch(window.location.origin + LOCAL_ASSET_BASE + part);

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

    function getMergedAssetUrl(assetName) {
        if (!mergedAssetPromises.has(assetName)) {
            mergedAssetPromises.set(assetName, mergeAsset(assetName));
        }

        return mergedAssetPromises.get(assetName);
    }

    window.fetch = async function (input, init) {
        const assetName = getAssetName(input);

        if (assetName) {
            const mergedAssetUrl = await getMergedAssetUrl(assetName);
            return originalFetch(mergedAssetUrl, init);
        }

        return originalFetch(input, init);
    };

    updateLoadingProgress();
    window.godotRunStart();
})().catch((error) => {
    console.error(error);
    const loadingText = document.getElementById("loading-text");

    if (loadingText) {
        loadingText.textContent = "Brotato failed to load. Please try refreshing.";
    }
});
