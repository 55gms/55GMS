const form = document.querySelector(".searchbar");
const input = document.querySelector("input");

document.addEventListener("DOMContentLoaded", function () {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
        let url = input.value.trim();
        if (!isUrl(url)) url = "https://www.startpage.com/do/dsearch?q=" + url + "&prfe=c57c22e13e460563a35c92a15473c441f5c29b69ccd3205ec7ef196c47a9e998dd39b212fcc6cfe1c0543668da628df8bacab528394fdc69853b68959f7a1fe67bf84ac42cd4ef5a0fb0fd0b";
        else if (!(url.startsWith("https://") || url.startsWith("http://")))
          url = "https://" + url;
        sessionStorage.setItem("encodedUrl", await chemical.encode(url));
        location.href = '!'
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
