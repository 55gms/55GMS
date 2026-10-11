// The /premium page: shows the plans, sends the buyer to Stripe's checkout,
// and shows what an account already has. Premium itself is switched on by the
// server from Stripe's webhook, never by this page.
(function setupPremiumPage() {
  var page = document.getElementById("premium");
  if (!page) return;

  var message = document.getElementById("premiumMessage");
  var current = document.getElementById("premiumCurrent");
  var plans = document.getElementById("premiumPlans");
  var manageButton = document.getElementById("manageButton");
  var planButtons = Array.from(document.querySelectorAll("[data-plan]"));
  var signedIn = Boolean(localStorage.getItem("uuid"));
  var returning = new URLSearchParams(location.search).get("done") === "1";

  function showMessage(type, text) {
    message.dataset.type = type;
    message.textContent = text;
    message.hidden = false;
  }

  function setLoading(button, loading) {
    button.classList.toggle("is-loading", loading);
    button.disabled = loading;
  }

  function formatDate(value) {
    return new Date(value).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function post(path, body) {
    return fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body || {}),
    }).then(function (response) {
      return response.json().then(function (data) {
        return { status: response.status, data: data };
      });
    });
  }

  function openPortal(button) {
    setLoading(button, true);
    post("/api/billing/portal")
      .then(function (result) {
        if (result.status === 401) return (location.href = "/login");
        if (!result.data.url) throw new Error(result.data.error);
        location.href = result.data.url;
      })
      .catch(function (error) {
        setLoading(button, false);
        showMessage("error", error.message || "Could not open billing.");
      });
  }

  function startCheckout(button) {
    if (!signedIn) return (location.href = "/login");

    setLoading(button, true);
    post("/api/billing/checkout", { plan: button.dataset.plan })
      .then(function (result) {
        if (result.status === 401) return (location.href = "/login");
        if (result.data.manage) return openPortal(button);
        if (!result.data.url) throw new Error(result.data.error);
        location.href = result.data.url;
      })
      .catch(function (error) {
        setLoading(button, false);
        showMessage("error", error.message || "Could not start checkout.");
      });
  }

  function render(status) {
    var title = document.getElementById("currentTitle");
    var desc = document.getElementById("currentDesc");

    if (status && status.source === "subscription") {
      var plan = status.plan === "yearly" ? "yearly" : "monthly";
      title.textContent = "You have premium, billed " + plan + ".";
      desc.textContent = status.pastDue
        ? "Your last payment failed. Update your card to keep premium."
        : status.renewsAt
          ? (status.cancelAtPeriodEnd ? "Ends on " : "Renews on ") +
            formatDate(status.renewsAt) +
            "."
          : "";
      manageButton.hidden = false;
      current.hidden = false;
      plans.hidden = true;
    } else if (status && status.source === "grant") {
      title.textContent = "You have premium.";
      desc.textContent =
        "It was added to your account. There is nothing to pay.";
      manageButton.hidden = true;
      current.hidden = false;
      plans.hidden = true;
    } else {
      current.hidden = true;
      plans.hidden = false;
    }

    if (status) localStorage.setItem("premium", Boolean(status.premium));
    page.dataset.state = "ready";
  }

  // 503 means this server does not sell premium; 401 means the browser has
  // no session, which reads as signed out here.
  function loadStatus(refresh) {
    return fetch("/api/billing/status" + (refresh ? "?refresh=1" : "")).then(
      function (response) {
        if (response.status === 503) {
          location.replace("/");
          return new Promise(function () {});
        }
        if (response.status === 401) {
          signedIn = false;
          return null;
        }
        if (!response.ok) throw new Error("Could not load your plan.");
        return response.json();
      },
    );
  }

  // Back from Stripe: the payment is confirmed by its webhook, which can
  // land a moment after the redirect, so ask a few times before giving up.
  function waitForPremium(attempt) {
    loadStatus(true)
      .then(function (status) {
        if (status && status.source === "subscription") {
          render(status);
          showMessage("success", "Thanks! Premium is on for your account.");
        } else if (attempt < 8) {
          setTimeout(function () {
            waitForPremium(attempt + 1);
          }, 1500);
        } else {
          render(status);
          showMessage(
            "error",
            "Your payment is still being confirmed. Check your profile in a minute.",
          );
        }
      })
      .catch(function (error) {
        render(null);
        showMessage("error", error.message);
      });
  }

  planButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      startCheckout(button);
    });
  });
  manageButton.addEventListener("click", function () {
    openPortal(manageButton);
  });

  if (returning) {
    history.replaceState(null, "", "/premium");
    showMessage("info", "Confirming your payment…");
    waitForPremium(0);
  } else {
    loadStatus(false)
      .then(render)
      .catch(function (error) {
        render(null);
        showMessage("error", error.message);
      });
  }
})();
