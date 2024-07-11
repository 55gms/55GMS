document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("moviePlayerBtn")
    .addEventListener("click", function () {
      document.getElementById("seriesPlayerBtn").classList.remove("active");
      this.classList.add("active");
      updateLink();
    });

  document
    .getElementById("seriesPlayerBtn")
    .addEventListener("click", function () {
      document.getElementById("moviePlayerBtn").classList.remove("active");
      this.classList.add("active");
      updateLink();
    });

  imdbTmdbValue = "";
  ssNumberValue = "";
  epNumberValue = "";
  document.getElementById("imdbTmdb").addEventListener("input", function () {
    imdbTmdbValue = this.value;
    updateLink();
  });

  document.getElementById("ssNumber").addEventListener("input", function () {
    ssNumberValue = this.value;
    updateLink();
  });

  document.getElementById("epNumber").addEventListener("input", function () {
    epNumberValue = this.value;
    updateLink();
  });
  function updateLink() {
    let link = "";
    if (
      document.getElementById("moviePlayerBtn").classList.contains("active")
    ) {
      if (imdbTmdbValue.includes("tt")) {
        link = "https://vidsrc.to/embed/movie/" + imdbTmdbValue;
      } else {
        link = "https://vidsrc.to/embed/movie/tt" + imdbTmdbValue;
      }
    } else if (
      document.getElementById("seriesPlayerBtn").classList.contains("active")
    ) {
      if (imdbTmdbValue.includes("tt")) {
        link = "https://vidsrc.to/embed/tv/" + imdbTmdbValue;
      } else {
        link = "https://vidsrc.to/embed/tv/tt" + imdbTmdbValue;
      }
    }
    console.log(link);
    document.getElementById("go").onclick = function () {
      hire(link);
    };
  }
});
