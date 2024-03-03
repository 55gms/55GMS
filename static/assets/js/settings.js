var cloakElement = document.getElementById("premadecloaks");

// thanks 3kh0
var tab = localStorage.getItem("tab");
if (tab) {
  // If there is saved data, try to parse it
  try {
    var tabData = JSON.parse(tab);
  } catch {
    // If there is an error in parsing, create an empty object
    var tabData = {};
  }
} else {
  // If there is no saved data, create an empty object
  var tabData = {};
}

// Set the title and icon fields to the values saved in tabData, if they exist
if (tabData.title) document.getElementById("title").value = tabData.title;
if (tabData.icon) document.getElementById("icon").value = tabData.icon;

// Default tab settings
var settingsDefaultTab = {
  title: "Dashboard",
  icon: "/img/canvas.ico",
};

// Function to set the document title
function setTitle(title = "") {
  if (title) {
    document.title = title;
  } else {
    document.title = settingsDefaultTab.title;
  }

  // Update the saved tab data with the new title
  var tab = localStorage.getItem("tab");

  if (tab) {
    // If there is saved data, try to parse it
    try {
      var tabData = JSON.parse(tab);
    } catch {
      // If there is an error in parsing, create an empty object
      var tabData = {};
    }
  } else {
    // If there is no saved data, create an empty object
    var tabData = {};
  }

  if (title) {
    // If there is a new title, update tabData
    tabData.title = title;
  } else {
    // If the title is empty, delete the title field from tabData
    delete tabData.title;
  }

  // Save the updated tab data to localStorage
  localStorage.setItem("tab", JSON.stringify(tabData));
}

// Function to set the favicon
function setFavicon(icon) {
  if (icon) {
    document.querySelector("link[rel='icon']").href = icon;
  } else {
    document.querySelector("link[rel='icon']").href = settingsDefaultTab.icon;
  }

  // Update the saved tab data with the new icon
  var tab = localStorage.getItem("tab");

  if (tab) {
    // If there is saved data, try to parse it
    try {
      var tabData = JSON.parse(tab);
    } catch {
      // If there is an error in parsing, create an empty object
      var tabData = {};
    }
  } else {
    // If there is no saved data, create an empty object
    var tabData = {};
  }

  if (icon) {
    // If there is a new icon, update tabData
    tabData.icon = icon;
  } else {
    // If the icon is empty, delete the icon field from tabData
    delete tabData.icon;
  }

  // Save the updated tab data to localStorage
  localStorage.setItem("tab", JSON.stringify(tabData));
}

function setCloak() {
  // applies only to premade cloaks
  var cloak = cloakElement.value; // cloak seems kind of weird when you spell it out
  switch (cloak) {
    case "search": // Google Search
      setTitle("Google");
      setFavicon("/assets/cloaks/Google Search.ico");
      break;
    case "wikipedia": // wikipedia
      setTitle("Wikipedia, the free encyclopedia");
      setFavicon("/assets/cloaks/Wikipedia.ico");
      break;
    case "bsite": // billibilli
      setTitle("Billibilli");
      setFavicon("/assets/cloaks/Billibilli.ico");
      break;
    case "drive": // Google Drive
      setTitle("My Drive - Google Drive");
      setFavicon("/assets/cloaks/Google Drive.ico");
      break;
    case "gmail": // Gmail
      setTitle("Gmail");
      setFavicon("/assets/cloaks/Gmail.ico");
      break;
    case "calendar": // Google Calendar
      setTitle("Google Calendar");
      setFavicon("/assets/cloaks/Calendar.ico");
      break;
    case "meets": // Google Meet
      setTitle("Google Meet");
      setFavicon("/assets/cloaks/Meet.ico");
      break;
    case "classroom": // Google Classroom
      setTitle("Classes");
      setFavicon("/assets/cloaks/Classroom.png");
      break;
    case "canvas": // Canvas
      setTitle("Dashboard");
      setFavicon("/assets/cloaks/Canvas.ico");
      break;
    case "zoom": // Zoom
      setTitle("Zoom");
      setFavicon("/assets/cloaks/Zoom.ico");
      break;
    case "khan": // Khan Academy
      setTitle("Dashboard | Khan Academy");
      setFavicon("/assets/cloaks/Khan Academy.ico");
      break;
  }
}

// Function to reset the tab settings to default
function resetTab() {
  document.title = "Dashboard";
  document.querySelector("link[rel='icon']").href = "/img/canvas.ico";
  document.getElementById("title").value = "";
  document.getElementById("icon").value = "";
  localStorage.setItem("tab", JSON.stringify({}));
}
