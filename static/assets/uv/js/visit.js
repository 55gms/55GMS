async function visit(value) {
  let url = value.trim();
  if (!isUrl(url)) url = "https://www.startpage.com/do/dsearch?q=" + url + "&prfe=c57c22e13e460563a35c92a15473c441f5c29b69ccd3205ec7ef196c47a9e998dd39b212fcc6cfe1c0543668da628df8bacab528394fdc69853b68959f7a1fe67bf84ac42cd4ef5a0fb0fd0b";
  else if (!(url.startsWith("https://") || url.startsWith("http://")))
    url = "https://" + url;
  let encodedUrl = await chemical.encode(url);
  location.href = encodedUrl;
};

function isUrl(str = "") {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
}
