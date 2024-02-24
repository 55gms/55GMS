const form = document.querySelector(".searchbar");
const input = document.querySelector("input");

document.addEventListener("DOMContentLoaded", function () {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    window.navigator.serviceWorker
      .register("/assets/uv/sw.js", {
        scope: __uv$config.prefix,
      })
      .then(() => {
        let url = input.value.trim();
        if (!isUrl(url)) url = "https://www.google.com/search?q=" + url;
        else if (!(url.startsWith("https://") || url.startsWith("http://")))
          url = "http://" + url;
        sessionStorage.setItem("encodedUrl", __uv$config.encodeUrl(url));
        location.href = "!";
      });
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
