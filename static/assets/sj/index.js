const form = document.querySelector(".searchbar");
const input = document.querySelector("input");

const { ScramjetController } = $scramjetLoadController();

const scramjet = new ScramjetController({
  files: {
    wasm: "/scram/scramjet.wasm.wasm",
    all: "/scram/scramjet.all.js",
    sync: "/scram/scramjet.sync.js",
  },
});

scramjet.init();

const connection = new BareMux.BareMuxConnection("/baremux/worker.js");

document.addEventListener("DOMContentLoaded", async function () {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      await registerSW();
    } catch (e) {
      console.error("Service Worker registration failed:", e);
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
    await connection.setTransport("/epoxy/index.mjs", [
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
