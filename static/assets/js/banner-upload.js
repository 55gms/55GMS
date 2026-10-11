
(() => {
  "use strict";

  function initializeBanner() {
    const uuid = localStorage.getItem("uuid");
    const bannerHeader = document.querySelector(".profile-header");
    const bannerButton = document.getElementById("bannerButton");
    const bannerInput = document.getElementById("bannerInput");

    if (!uuid || !bannerHeader || !bannerButton || !bannerInput) {
      return;
    }

    const bannerKey = "55gms_profile_banner_" + uuid;

    function showBanner(dataUrl) {
      bannerHeader.style.backgroundImage =
        `linear-gradient(
          rgba(0, 0, 0, 0.36),
          rgba(0, 0, 0, 0.36)
        ), url("${dataUrl}")`;

      bannerHeader.classList.add("has-custom-banner");
    }

    function showError(message) {
      const toasts = document.getElementById("toasts");

      if (!toasts) {
        alert(message);
        return;
      }

      const toast = document.createElement("div");
      toast.className = "p-toast";
      toast.dataset.type = "error";

      toast.innerHTML =
        '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="10" cy="10" r="8"/><path d="M10 6v4.5M10 13.5v.01"/></svg>';

      const text = document.createElement("span");
      text.textContent = message;
      toast.appendChild(text);
      toasts.appendChild(toast);

      setTimeout(() => {
        toast.classList.add("is-leaving");
        toast.addEventListener("animationend", () => toast.remove(), {
          once: true
        });
      }, 4500);
    }

    function updateLocalSize() {
      const localSize = document.getElementById("localSize");

      if (!localSize) return;

      const bytes = new Blob([JSON.stringify(localStorage)]).size;

      let formatted;

      if (bytes < 1024) {
        formatted = bytes + " B";
      } else if (bytes < 1024 * 1024) {
        formatted = (bytes / 1024).toFixed(1) + " KB";
      } else {
        formatted = (bytes / 1024 / 1024).toFixed(2) + " MB";
      }

      localSize.textContent =
        `${localStorage.length} keys · ${formatted}`;
    }

    try {
      const savedBanner = localStorage.getItem(bannerKey);

      if (savedBanner) {
        showBanner(savedBanner);
      }
    } catch (error) {
      console.error("Couldn't load banner:", error);
    }

    bannerButton.addEventListener("click", () => {
      bannerInput.click();
    });

    bannerInput.addEventListener("change", async () => {
      const file = bannerInput.files[0];

      bannerInput.value = "";

      if (!file) return;

      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/webp"
      ];

      if (!allowedTypes.includes(file.type)) {
        showError("Choose a PNG, JPG, or WebP image.");
        return;
      }

      if (file.size > 8 * 1024 * 1024) {
        showError("Your banner must be smaller than 8 MB.");
        return;
      }

      bannerButton.disabled = true;

      const objectUrl = URL.createObjectURL(file);

      try {
        const image = new Image();

        await new Promise((resolve, reject) => {
          image.onload = resolve;
          image.onerror = reject;
          image.src = objectUrl;
        });

        const canvas = document.createElement("canvas");

        canvas.width = 1200;
        canvas.height = 360;

        const context = canvas.getContext("2d");

        if (!context) {
          throw new Error("Canvas isn't available.");
        }

        const ratio = Math.max(
          canvas.width / image.width,
          canvas.height / image.height
        );

        const width = image.width * ratio;
        const height = image.height * ratio;

        context.drawImage(
          image,
          (canvas.width - width) / 2,
          (canvas.height - height) / 2,
          width,
          height
        );

        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);

        localStorage.setItem(bannerKey, dataUrl);

        showBanner(dataUrl);
        updateLocalSize();
      } catch (error) {
        showError("Couldn't save your banner. Try another image.");
        console.error("Banner save failed:", error);
      } finally {
        URL.revokeObjectURL(objectUrl);
        bannerButton.disabled = false;
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeBanner);
  } else {
    initializeBanner();
  }
})();
