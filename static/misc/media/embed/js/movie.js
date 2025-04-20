window.addEventListener("chemicalLoaded", async function(e) {
    const ID = new URLSearchParams(window.location.search).get("id");
    if (!ID) {
      window.location.href = "/";
      return;
    }
    url = `https://vidfast.pro/movie/${ID}?title=false`;

    location.href = await chemical.encode(url)
});