var cloakElement;
var pendingImportFile = null;

var siteThemes = {
  blue: "Blue",
  legacy: "Legacy",
  midnight: "Midnight",
  forest: "Forest",
  sunset: "Sunset",
  contrast: "High Contrast",
};

function getSafeTheme(theme) {
  if (theme === "classic") return "legacy";
  return siteThemes[theme] ? theme : "legacy";
}

function setSiteTheme(theme) {
  var safeTheme = getSafeTheme(theme);
  document.documentElement.dataset.theme = safeTheme;
  localStorage.setItem("siteTheme", safeTheme);
}

(function applySavedTheme() {
  var savedTheme = localStorage.getItem("siteTheme") || "legacy";
  document.documentElement.dataset.theme = getSafeTheme(savedTheme);
})();

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

var settingsDefaultTab = {
  title: "Google",
  icon: "/img/favicon.ico",
};

function setTitle(title = "") {
  if (title) {
    document.title = title;
  } else {
    document.title = settingsDefaultTab.title;
  }

  var titleElement = document.getElementById("title");
  if (titleElement) titleElement.value = title;

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

  var iconElement = document.getElementById("icon");
  if (iconElement) iconElement.value = icon;

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
    case "itchio":
      setTitle("Download the latest indie games - itch.io");
      setFavicon("/assets/cloaks/itchio.ico");
      break;
    case "deltamath":
      setTitle("DeltaMath Student Application");
      setFavicon("/assets/cloaks/deltamath.png");
      break;
    case "ed":
      setTitle("Edpuzzle");
      setFavicon("/assets/cloaks/edpuzzle.png");
      break;
  }
}
function resetTab() {
  document.title = settingsDefaultTab.title;
  document.querySelector("link[rel='icon']").href = settingsDefaultTab.icon;
  document.getElementById("title").value = "";
  document.getElementById("icon").value = "";
  localStorage.setItem("tab", JSON.stringify({}));
}

var panicKey = localStorage.getItem("panicKey") || "`";
var panicLink = localStorage.getItem("PanicLink") || "https://google.com/";

var toggled = localStorage.getItem("aboutBlank") || "false";

document.addEventListener("DOMContentLoaded", function () {
  var titleElement = document.getElementById("title");
  var iconElement = document.getElementById("icon");
  if (tabData.title && titleElement) titleElement.value = tabData.title;
  if (tabData.icon && iconElement) iconElement.value = tabData.icon;

  document.getElementById("key").value = panicKey;
  document.getElementById("link").value = panicLink;
  cloakElement = document.getElementById("premadecloaks");
  var themeSelect = document.getElementById("siteTheme");
  if (themeSelect) {
    themeSelect.value = getSafeTheme(localStorage.getItem("siteTheme"));
    themeSelect.addEventListener("change", function () {
      setSiteTheme(themeSelect.value);
    });
  }

  const toggle = document.getElementById("toggle");
  if (toggled === "true") {
    toggle.checked = true;
  } else {
    toggle.checked = false;
  }
  toggle.addEventListener("change", function () {
    if (toggle.checked) {
      localStorage.setItem("aboutBlank", "true");
      toggle.checked = true;
    } else {
      localStorage.setItem("aboutBlank", "false");
      toggle.checked = false;
    }
  });

  setupImportDialog();
});

function setPanicKey() {
  var key = document.getElementById("key").value;
  localStorage.setItem("panicKey", key);
}

function setPanicLink() {
  var link = document.getElementById("link").value;
  localStorage.setItem("PanicLink", link);
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

      const name = tabData.title || "Google";
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

      const pLink = localStorage.getItem("PanicLink") || "https://google.com";
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

function saveSave() {
  var data = JSON.stringify(localStorage);
  var blob = new Blob([data], { type: "text/plain" });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  date = new Date();
  a.download = `${date.getMonth() + 1}_${date.getDate()}_${date
    .getFullYear()
    .toString()
    .slice(-2)} ${date.getHours()}:${date.getMinutes()}.gmsconfig`;
  a.click();
  URL.revokeObjectURL(url);
}

function setupImportDialog() {
  var input = document.getElementById("uploadSave");
  var confirmButton = document.getElementById("confirmImportSave");
  var cancelButton = document.getElementById("cancelImportSave");

  if (input) {
    input.addEventListener("change", function () {
      pendingImportFile = input.files[0] || null;

      if (pendingImportFile) {
        showImportConfirm(pendingImportFile);
      }
    });
  }

  if (confirmButton) {
    confirmButton.addEventListener("click", function () {
      loadSave();
    });
  }

  if (cancelButton) {
    cancelButton.addEventListener("click", closeImportConfirm);
  }

  document.querySelectorAll("[data-import-cancel]").forEach(function (element) {
    element.addEventListener("click", closeImportConfirm);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeImportConfirm();
    }
  });
}

function openSaveImportPicker() {
  var input = document.getElementById("uploadSave");

  if (input) {
    input.value = "";
    input.click();
  }
}

function showImportConfirm(file) {
  var modal = document.getElementById("importConfirmModal");
  var fileText = document.getElementById("importConfirmFile");
  var confirmButton = document.getElementById("confirmImportSave");

  if (fileText) {
    fileText.textContent =
      'Import "' + file.name + '" and replace matching saved browser settings?';
  }

  if (modal) {
    modal.classList.add("settings-modal-open");
    modal.setAttribute("aria-hidden", "false");
  }

  if (confirmButton) {
    confirmButton.focus();
  }
}

function closeImportConfirm() {
  var modal = document.getElementById("importConfirmModal");
  var input = document.getElementById("uploadSave");

  pendingImportFile = null;

  if (input) {
    input.value = "";
  }

  if (modal) {
    modal.classList.remove("settings-modal-open");
    modal.setAttribute("aria-hidden", "true");
  }
}

function loadSave() {
  var input = document.getElementById("uploadSave");
  var file = pendingImportFile || (input && input.files[0]);

  if (!file) {
    openSaveImportPicker();
    return;
  }

  var reader = new FileReader();
  reader.readAsText(file);
  reader.onload = function () {
    try {
      var data = JSON.parse(reader.result);
      for (var key in data) {
        localStorage.setItem(key, data[key]);
      }
      closeImportConfirm();
      alert("Save Loaded!");
    } catch (error) {
      alert("That save file could not be imported.");
    }
  };
  reader.onerror = function () {
    alert("That save file could not be read.");
  };
}
var months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function convertDate(date_str) {
  var temp_date = date_str.split("-");
  return (
    months[Number(temp_date[1]) - 1] + " " + temp_date[2] + ", " + temp_date[0]
  );
}

fetch("https://api.github.com/repos/55gms/55gms/commits")
  .then((response) => response.json())
  .then((data) => {
    var unformatted = new Date(data[0].commit.author.date)
      .toISOString()
      .split("T")[0];
    var lastCommitDate = convertDate(unformatted);
    document.querySelector("#updated").textContent =
      `Last Updated: ${lastCommitDate}`;
  });
