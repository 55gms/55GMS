var cloakElement;

document.addEventListener("DOMContentLoaded", function () {
  cloakElement = document.getElementById("premadecloaks");
  var cloak = cloakElement.value;
});

var tab = localStorage.getItem("tab");
if (tab) {
  try {
    var tabData = JSON.parse(tab);
  } catch {
    var tabData = {};
  }
} else {
  var tabData = {};
}

var titleElement = document.getElementById("title");
var iconElement = document.getElementById("icon");

if (tabData.title && titleElement) titleElement.value = tabData.title;
if (tabData.icon && iconElement) iconElement.value = tabData.icon;

var settingsDefaultTab = {
  title: "Dashboard",
  icon: "/img/canvas.ico",
};

function setTitle(title = "") {
  if (title) {
    document.title = title;
  } else {
    document.title = settingsDefaultTab.title;
  }

  var tab = localStorage.getItem("tab");

  if (tab) {
    try {
      var tabData = JSON.parse(tab);
    } catch {
      var tabData = {};
    }
  } else {
    var tabData = {};
  }

  if (title) {
    tabData.title = title;
  } else {
    delete tabData.title;
  }

  localStorage.setItem("tab", JSON.stringify(tabData));
}

function setFavicon(icon) {
  if (icon) {
    document.querySelector("link[rel='icon']").href = icon;
  } else {
    document.querySelector("link[rel='icon']").href = settingsDefaultTab.icon;
  }

  var tab = localStorage.getItem("tab");

  if (tab) {
    try {
      var tabData = JSON.parse(tab);
    } catch {
      var tabData = {};
    }
  } else {
    var tabData = {};
  }

  if (icon) {
    tabData.icon = icon;
  } else {
    delete tabData.icon;
  }

  localStorage.setItem("tab", JSON.stringify(tabData));
}

function setCloak() {
  var cloak = cloakElement.value;
  switch (cloak) {
    case "search":
      setTitle("Google");
      setFavicon("/assets/cloaks/Google Search.ico");
      break;
    case "wikipedia":
      setTitle("Wikipedia, the free encyclopedia");
      setFavicon("/assets/cloaks/Wikipedia.ico");
      break;
    case "bsite":
      setTitle("Billibilli");
      setFavicon("/assets/cloaks/Billibilli.ico");
      break;
    case "drive":
      setTitle("My Drive - Google Drive");
      setFavicon("/assets/cloaks/Google Drive.ico");
      break;
    case "gmail":
      setTitle("Gmail");
      setFavicon("/assets/cloaks/Gmail.ico");
      break;
    case "calendar":
      setTitle("Google Calendar");
      setFavicon("/assets/cloaks/Calendar.ico");
      break;
    case "meets":
      setTitle("Google Meet");
      setFavicon("/assets/cloaks/Meet.ico");
      break;
    case "classroom":
      setTitle("Classes");
      setFavicon("/assets/cloaks/Classroom.png");
      break;
    case "canvas":
      setTitle("Dashboard");
      setFavicon("/assets/cloaks/Canvas.ico");
      break;
    case "zoom":
      setTitle("Zoom");
      setFavicon("/assets/cloaks/Zoom.ico");
      break;
    case "khan":
      setTitle("Dashboard | Khan Academy");
      setFavicon("/assets/cloaks/Khan Academy.ico");
      break;
  }
}
function resetTab() {
  document.title = "Dashboard";
  document.querySelector("link[rel='icon']").href = "/img/canvas.ico";
  document.getElementById("title").value = "";
  document.getElementById("icon").value = "";
  localStorage.setItem("tab", JSON.stringify({}));
}

var panicKey = localStorage.getItem("panicKey") || "`";
var panicLink =
  localStorage.getItem("PanicLink") || "https://canvas.houstonisd.org/";

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("key").value = panicKey;
  document.getElementById("link").value = panicLink;
});

function setPanicKey() {
  var key = document.getElementById("key").value;
  localStorage.setItem("panicKey", key);
}

function setPanicLink() {
  var link = document.getElementById("link").value;
  localStorage.setItem("PanicLink", link);
}
