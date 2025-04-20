function isUrl(val = "") {
  if (
    /^http(s?):\/\//.test(val) ||
    (val.includes(".") && val.slice(0, 1) !== " ")
  )
    return true;
  return false;
}
async function loadNewPage(url) {
  document.getElementById("searchBar").blur();
  if (!isUrl(url))
    url =
      "https://www.startpage.com/do/dsearch?q=" +
      url +
      "&prfe=c57c22e13e460563a35c92a15473c441f5c29b69ccd3205ec7ef196c47a9e998dd39b212fcc6cfe1c0543668da628df8bacab528394fdc69853b68959f7a1fe67bf84ac42cd4ef5a0fb0fd0b";
  else if (!(url.startsWith("https://") || url.startsWith("http://")))
    url = "https://" + url;
  let urlEncoded = await chemical.encode(url);
  const iframe = document.getElementById("iframeid");
  if (iframe) {
    iframe.src = urlEncoded;
  }
  searchBar.value = url;
}

window.addEventListener("load", function () {
  let encodedUrl = sessionStorage.getItem("encodedUrl");
  console.log(encodedUrl);
  const iframe = document.getElementById("iframeid");
  if (iframe) {
    iframe.src = encodedUrl;
  } else {
    console.error('Iframe with id "iframeid" does not exist');
  }
});
window.addEventListener("chemicalLoaded", async function () {
  const searchBar = document.getElementById("searchBar");
  if (searchBar) {
    try {
      const encodedUrl = sessionStorage.getItem("encodedUrl");
      if (encodedUrl) {
        const decodedUrl = await chemical.decode(encodedUrl);
        searchBar.value = decodedUrl;
      }

      searchBar.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          let url = searchBar.value.trim();
          loadNewPage(url);
        }
      });

      const iframe = document.getElementById("iframeid");
      iframe.addEventListener("load", async function () {
        const currentSrc = iframe.contentWindow.location.href;
        const decodedUrl = await chemical.decode(currentSrc);
        searchBar.value = decodedUrl;
        sessionStorage.setItem("encodedUrl", currentSrc);
      });
    } catch (error) {
      console.error("Error:", error);
    }
  } else {
    console.error('Search bar with id "searchBar" does not exist');
  }

  if (searchBar) {
    searchBar.addEventListener("focus", function () {
      searchBar.select();
    });
  }
});

function reload() {
  document.getElementById("iframeid").contentWindow.location.reload();
}
document.onfullscreenchange = function () {
  document.body.classList.toggle(
    "fullscreen-active",
    document.fullscreenElement
  );
  iframe = document.getElementById("iframeid");
  if (document.fullscreenElement) {
    iframe.style.height = "100vh";
  } else {
    iframe.style.height = "calc(100vh - 47.5px)";
  }
};

function fullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}
function home() {
  window.location.href = "/";
}
function erudaToggle() {
  if (!document.getElementById("iframeid")) return;
  const erudaWindow = document.getElementById("iframeid").contentWindow;
  const erudaDocument = document.getElementById("iframeid").contentDocument;
  if (!erudaWindow || !erudaDocument) return;
  if (erudaWindow.eruda?._isInit) {
    erudaWindow.eruda.destroy();
  } else {
    let script = erudaDocument.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/eruda";
    script.onload = function () {
      if (!erudaWindow) return;
      erudaWindow.eruda.init();
      erudaWindow.eruda.show();
    };
    erudaDocument.head.appendChild(script);
  }
}
function back() {
  document.getElementById("iframeid").contentWindow.history.back();
}
function forward() {
  document.getElementById("iframeid").contentWindow.history.forward();
}
function hideBar() {
  const classesToHide = [
    "bar",
    "bar-left",
    "bar-right",
    "icon",
    "search",
    "search-icon",
    "navbtn",
  ];
  classesToHide.forEach((className) => {
    const elements = document.getElementsByClassName(className);
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = "none";
    }
  });
  const iframe = document.getElementById("iframeid");
  iframe.style.height = "100vh";
  iframe.style.margin = "0";
  iframe.style.padding = "0";
}
function cloak() {
  let inFrame;
  try {
    inFrame = window !== top;
  } catch (e) {
    inFrame = true;
  }
  if (!inFrame && !navigator.userAgent.includes("Firefox")) {
    const popup = open("about:blank", "_blank");
    if (!popup || popup.closed) {
      alert("Please allow popups and redirects.");
    } else {
      const doc = popup.document;
      const iframe = doc.createElement("iframe");
      const style = iframe.style;
      const link = doc.createElement("link");
      const name = tabData.title || "Dashboard";
      const icon = tabData.icon || "/img/favicon.ico";
      doc.title = name;
      link.rel = "icon";
      link.href = icon;
      iframe.src = location.href;
      style.position = "fixed";
      style.top = style.bottom = style.left = style.right = 0;
      style.border = style.outline = "none";
      style.width = style.height = "100%";
      doc.head.appendChild(link);
      doc.body.appendChild(iframe);
      const pLink =
        localStorage.getItem(encodeURI("pLink")) || "https://www.google.com/";
      location.replace(pLink);
      const script = doc.createElement("script");
      script.textContent = `
      window.onbeforeunload = function (event) {
        const confirmationMessage = 'Leave Site?';
        (event || window.event).returnValue = confirmationMessage;
        return confirmationMessage;
      };
    `;
      doc.head.appendChild(script);
    }
  }
}
