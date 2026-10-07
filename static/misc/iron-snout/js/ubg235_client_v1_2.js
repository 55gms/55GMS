// third-party vendor code removed.
// Original file fetched a remote script from the ubg235 vendor on window load,
// which could redirect via window.location and beaconed visitor data back to them.
// loadJS is kept for compatibility; the remote fetch is gone.
function loadJS(FILE_URL, async = true) {
  let scriptEle = document.createElement("script");
  scriptEle.setAttribute("src", FILE_URL);
  scriptEle.setAttribute("type", "text/javascript");
  scriptEle.setAttribute("async", async);
  document.body.appendChild(scriptEle);
}
