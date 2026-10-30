(() => {
  const button = document.getElementById("watchAd");
  const status = document.getElementById("linksStatus");
  const results = document.getElementById("linksResults");
  const list = document.getElementById("revealedLinks");
  const count = document.getElementById("revealedCount");
  const revealed = new Map();
  let remaining = 0;
  let busy = false;
  let sdkPromise;

  // No unlock state is stored, including across back/forward cache restores.
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) window.location.reload();
  });

  async function api(path, body) {
    const response = await fetch(`/api/links${path}`, {
      method: body ? "POST" : "GET",
      headers: body ? { "Content-Type": "application/json" } : {},
      body: body ? JSON.stringify(body) : undefined,
      credentials: "same-origin",
      cache: "no-store",
      signal: AbortSignal.timeout(20000),
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(
        data.error || "Could not reveal a link. Try again later.",
      );
    return data;
  }

  function loadVideo() {
    if (window.__gmsAdsVideo)
      return Promise.resolve(window.__gmsAdsVideo.host("/api/_ads"));
    if (sdkPromise) return sdkPromise;
    sdkPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      const fail = () => {
        clearTimeout(timer);
        script.remove();
        reject(
          new Error(
            "The video ad could not load. Check your connection and try again.",
          ),
        );
      };
      const timer = setTimeout(fail, 15000);
      script.src =
        "https://cdn.jsdelivr.net/gh/55gms/gms-ads@1.3.1/embed/dist/video.min.js";
      script.integrity =
        "sha384-b2+Id2Ne6ZcehGqtORMozNgJt99nsQYPRhx9szXa+URKpHoXsd+RzAQ8VlokgMmb";
      script.crossOrigin = "anonymous";
      script.onload = () => {
        clearTimeout(timer);
        if (!window.__gmsAdsVideo) return fail();
        resolve(window.__gmsAdsVideo.host("/api/_ads"));
      };
      script.onerror = fail;
      document.head.appendChild(script);
    }).catch((error) => {
      sdkPromise = null;
      throw error;
    });
    return sdkPromise;
  }

  function renderButton() {
    button.disabled = busy || remaining === 0;
    button.setAttribute("aria-busy", String(busy));
    button.textContent = busy
      ? "Please wait…"
      : remaining === 0
        ? "No more links available"
        : "Watch ad & reveal a link";
  }

  function addLink(link) {
    const item = document.createElement("li");
    const anchor = document.createElement("a");
    anchor.href = link.url;
    anchor.textContent = link.url;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    const copy = document.createElement("button");
    copy.className = "links-copy";
    copy.type = "button";
    copy.textContent = "Copy";
    copy.setAttribute("aria-label", `Copy ${link.url}`);
    copy.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(link.url);
        status.textContent = "Link copied.";
      } catch {
        status.textContent =
          "Could not copy automatically. Select the link to copy it manually.";
      }
    });
    item.append(anchor, copy);
    list.prepend(item);
    results.hidden = false;
    count.textContent = `${revealed.size} revealed this visit`;
  }

  button.addEventListener("click", async () => {
    if (busy || remaining === 0) return;
    busy = true;
    renderButton();
    status.textContent = "Loading video ad…";
    try {
      const sdk = await loadVideo();
      // The SDK owns consent/playback lifetime; a paused ad must not lose
      // its reward just because the visitor takes time to return to it.
      const reward = await sdk.show({
        format: "video_rewarded",
        gameId: "links",
        placement: "links",
        rewardId: "site-link",
        rewardLabel: "a new website link",
      });
      if (
        reward?.status !== "granted" ||
        !reward.rewardGranted ||
        !reward.grant?.id ||
        !reward.grant?.signature
      ) {
        status.textContent = ["cancelled", "skipped"].includes(reward?.status)
          ? "The ad was not completed. Watch a rewarded ad to reveal a link."
          : "No rewarded ad is available right now. Please try again later.";
        return;
      }
      status.textContent = "Verifying your reward…";
      const data = await api("/reveal", {
        grant: reward.grant,
        used: [...revealed.keys()],
      });
      const url = new URL(data.link.url);
      if (url.protocol !== "https:" || revealed.has(data.link.id))
        throw new Error("Could not reveal a new link. Please try again later.");
      revealed.set(data.link.id, url.href);
      remaining = data.remaining;
      addLink({ id: data.link.id, url: url.href });
      status.textContent =
        remaining > 0
          ? "Link revealed. Watch another ad for a different link."
          : "You have revealed every available link for this visit.";
    } catch (error) {
      status.textContent =
        error.name === "TimeoutError"
          ? "The server took too long to respond. Please try again later."
          : error.message;
    } finally {
      busy = false;
      renderButton();
    }
  });

  api("")
    .then((data) => {
      remaining = data.available ? data.total : 0;
      renderButton();
      status.textContent = data.available
        ? "Ready when you are. Your link appears here after the ad."
        : "Links are not available right now. Please try again later.";
    })
    .catch(() => {
      status.textContent =
        "Could not check link availability. Reload to try again.";
      button.textContent = "Links unavailable";
    });
})();
