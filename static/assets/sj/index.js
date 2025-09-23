const form = document.querySelector(".searchbar");
const input = document.querySelector("input");

document.addEventListener("DOMContentLoaded", async function () {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    let url = input.value.trim();

    if (!isUrl(url)) url = "https://www.duckduckgo.com/?q=" + url;
    else if (!(url.startsWith("https://") || url.startsWith("http://")))
      url = "https://" + url;
    else if (
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
        url
      )
    )
      url = "http://" + url;

    sessionStorage.setItem("encodedUrl", url);
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
