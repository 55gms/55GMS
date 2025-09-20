const form = document.querySelector(".searchbar");
const input = document.querySelector("input");

const { ScramjetController } = $scramjetLoadController();

const scramjet = new ScramjetController({
  files: {
    wasm: "/assets/sj/wasm.wasm",
    all: "/assets/sj/all.js",
    sync: "/assets/sj/sync.js",
  },
});

scramjet.init();

navigator.serviceWorker.register("/assets/sj/sw.js");

let connection;

document.addEventListener("DOMContentLoaded", async function () {
  // Small delay to ensure dependencies are loaded
  await new Promise((resolve) => setTimeout(resolve, 100));

  try {
    if (typeof BareMux === "undefined" || !BareMux.BareMuxConnection) {
      throw new Error("BareMux is not available");
    }

    connection = new BareMux.BareMuxConnection("/bm/worker.js");

    await new Promise((resolve) => setTimeout(resolve, 500));
  } catch (error) {
    console.error("Failed to initialize BareMux:", error);
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      await registerSW();
    } catch (e) {
      console.error("Service Worker registration failed:", e);
      return;
    }

    if (!connection) {
      console.error("BareMux connection is not initialized");
      return;
    }

    let url = input.value.trim();
    if (!isUrl(url)) url = "https://www.startpage.com/do/dsearch?q=" + url;
    else if (!(url.startsWith("https://") || url.startsWith("http://")))
      url = "http://" + url;
    let wispUrl =
      (location.protocol === "https:" ? "wss" : "ws") +
      "://" +
      location.host +
      "/wisp/";
    await connection.setTransport("/epxy/index.mjs", [
      { wisp: "wss://anura.pro/" },
    ]);

    const sjEncode = scramjet.encodeUrl.bind(scramjet);
    sessionStorage.setItem("encodedUrl", sjEncode(url));
    location.href = "!";
  });
});

function isUrl(val = "") {
  if (
    /^http(s?):\/\//.test(val) ||
    (val.includes(".") && val.slice(0, 1) !== " ")
  )
    return true;
  return false;
}
