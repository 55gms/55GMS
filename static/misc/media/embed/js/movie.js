async function getMovie() {
  const ID = new URLSearchParams(window.location.search).get("id");
  if (!ID) {
    window.location.href = "/";
    return;
  }
  url = `https://vidfast.pro/movie/${ID}?title=false`;
  visit(url);  
}

document.addEventListener("DOMContentLoaded", function () {
  getMovie();
});
