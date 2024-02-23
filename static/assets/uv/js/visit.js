function visit(value) {
  let iframe = document.querySelector(".iframe.active");
  window.navigator.serviceWorker
    .register("/assets/uv/sw.js", {
      scope: __uv$config.prefix,
    })
    .then(() => {
      let url = value.trim();
      if (!isUrl(url)) url = "https://www.google.com/search?q=" + url;
      else if (!(url.startsWith("https://") || url.startsWith("http://")))
        url = "https://" + url;
      window.location.href = __uv$config.prefix + __uv$config.encodeUrl(url);
    });
}

function isUrl(val = "") {
  if (
    /^http(s?):\/\//.test(val) ||
    (val.includes(".") && val.slice(0, 1) !== " ")
  )
    return true;
  return false;
}
