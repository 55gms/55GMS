const originalFetch = window.fetch;
const LOCAL_ASSET_BASE = "/misc/brotato/";

function setLoadingText(text) {
    const loadingText = document.getElementById("loading-text");

    if (loadingText) {
        loadingText.textContent = text;
    }
}

function mergeFiles(fileParts) {
    return new Promise((resolve, reject) => {
        const buffers = [];

        function fetchPart(index) {
            if (index >= fileParts.length) {
                setLoadingText("Preparing Brotato...");
                const mergedBlob = new Blob(buffers);
                const mergedFileUrl = URL.createObjectURL(mergedBlob);
                resolve(mergedFileUrl);
                return;
            }

            setLoadingText(`Loading Brotato assets ${index + 1}/${fileParts.length}...`);
            fetch(fileParts[index])
                .then((response) => {
                    if (!response.ok) throw new Error("Missing part: " + fileParts[index]);
                    return response.arrayBuffer();
                })
                .then((data) => {
                    buffers.push(data);
                    fetchPart(index + 1);
                })
                .catch(reject);
        }

        fetchPart(0);
    });
}

function getParts(file, start, end) {
    const parts = [];

    for (let i = start; i <= end; i++) {
        parts.push(LOCAL_ASSET_BASE + file + ".part" + i);
    }

    return parts;
}

Promise.all([
    mergeFiles(getParts("index.pck", 1, 7)),
    mergeFiles(getParts("index.wasm", 1, 2)),
]).then(([pckUrl, wasmUrl]) => {
    window.fetch = async function (url, ...args) {
        if (url.endsWith("index.pck")) {
            return originalFetch(pckUrl, ...args);
        }

        if (url.endsWith("index.wasm")) {
            return originalFetch(wasmUrl, ...args);
        }

        return originalFetch(url, ...args);
    };

    window.godotRunStart();
}).catch((error) => {
    console.error(error);
    setLoadingText("Brotato failed to load. Please try refreshing.");
});
