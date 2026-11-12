// "Add games" on /admin: sends links to the game bot and follows its jobs.
// Every call goes through /api/admin/games/*, which this server passes on to
// the bot with its token (routes/admin.js).
(function () {
  const MAX_LINKS = 25;
  const ACTIVE = ["queued", "running", "publishing"];
  const STATUS = {
    queued: "Queued",
    running: "Working",
    publishing: "Publishing",
    pr_open: "PR open",
    merged: "Merged",
    closed: "PR closed",
    failed: "Failed",
    duplicate: "Already added",
    cancelled: "Cancelled",
    needs_attention: "Needs you",
  };

  const gamesSection = document.getElementById("gamesSection");
  const batchesSection = document.getElementById("batchesSection");
  const form = document.getElementById("gamesForm");
  const textarea = document.getElementById("gamesLinks");
  const count = document.getElementById("gamesCount");
  const submit = document.getElementById("gamesSubmit");
  const list = document.getElementById("batches");
  const toasts = document.getElementById("toasts");

  // Open logs survive the re-render on every poll.
  const openLogs = new Set();
  const logLines = new Map();
  let pollTimer = null;
  let logTimer = null;

  function toast(type, message) {
    const el = document.createElement("div");
    el.className = "p-toast";
    el.dataset.type = type;
    const text = document.createElement("span");
    text.textContent = message;
    el.appendChild(text);
    toasts.appendChild(el);
    setTimeout(() => {
      el.classList.add("is-leaving");
      el.addEventListener("animationend", () => el.remove(), { once: true });
    }, 4000);
  }

  async function api(path, init = {}) {
    const response = await fetch(path, {
      ...init,
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(data.error || "Request failed");
      error.status = response.status;
      throw error;
    }
    return data;
  }

  // The same rule the bot uses: URLs, and numbers on their own line.
  function countLinks(text) {
    const found = new Set();
    for (const raw of text.split(/\r?\n/)) {
      const line = raw.trim();
      if (/^\d{1,6}$/.test(line)) found.add(line);
      for (const match of line.matchAll(/https?:\/\/[^\s<>()"'`\]]+/g)) {
        found.add(match[0]);
      }
    }
    return found.size;
  }

  function updateCount() {
    const n = countLinks(textarea.value);
    count.textContent =
      n === 0
        ? `Up to ${MAX_LINKS} at a time.`
        : `${n} link${n === 1 ? "" : "s"}${n > MAX_LINKS ? `, ${MAX_LINKS} at most` : ""}.`;
    count.classList.toggle("games-over", n > MAX_LINKS);
  }

  function ago(iso) {
    const seconds = Math.max(0, (Date.now() - Date.parse(iso)) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} h ago`;
    return new Date(iso).toLocaleDateString();
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function button(label, onClick) {
    const node = el("button", "p-btn games-btn");
    node.type = "button";
    node.appendChild(el("span", "p-btn-label", label));
    node.addEventListener("click", onClick);
    return node;
  }

  function describe(job) {
    if (ACTIVE.includes(job.status))
      return job.step || "Waiting for a free slot";
    if (job.error) return job.error;
    const warnings = job.result?.warnings?.length || 0;
    if (warnings)
      return `${warnings} thing${warnings === 1 ? "" : "s"} to check in the PR`;
    if (job.result?.author) return `by ${job.result.author}`;
    return "";
  }

  function renderLog(pre, jobId) {
    const lines = logLines.get(jobId) || [];
    const atBottom = pre.scrollTop + pre.clientHeight >= pre.scrollHeight - 8;
    pre.textContent = lines.length
      ? lines
          .map((line) => {
            const time = new Date(line.at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            });
            const mark =
              { step: "»", tool: "›", error: "!", agent: " " }[line.kind] ||
              " ";
            return `${time} ${mark} ${line.text}`;
          })
          .join("\n")
      : "No log yet.";
    if (atBottom) pre.scrollTop = pre.scrollHeight;
  }

  async function fetchLog(jobId) {
    const lines = logLines.get(jobId) || [];
    const after = lines.length ? lines[lines.length - 1].id : 0;
    const data = await api(`/api/admin/games/jobs/${jobId}/log?after=${after}`);
    if (data.lines.length) logLines.set(jobId, lines.concat(data.lines));
    const pre = document.querySelector(`[data-log="${jobId}"]`);
    if (pre) renderLog(pre, jobId);
  }

  function pollLogs() {
    clearTimeout(logTimer);
    if (!openLogs.size) return;
    Promise.all(
      [...openLogs].map((id) => fetchLog(id).catch(() => {})),
    ).finally(() => {
      logTimer = setTimeout(pollLogs, 3000);
    });
  }

  async function jobAction(job, action) {
    try {
      await api(`/api/admin/games/jobs/${job.id}/${action}`, {
        method: "POST",
      });
      toast(
        "success",
        action === "retry"
          ? `Job ${job.id} is queued again.`
          : `Job ${job.id} is cancelled.`,
      );
      load();
    } catch (error) {
      toast("error", error.message);
    }
  }

  function renderJob(job) {
    const item = el("li", "games-job");
    const main = el("div", "games-job-main");

    const status = el("span", "games-status", STATUS[job.status] || job.status);
    status.dataset.status = job.status;
    main.appendChild(status);

    const text = el("div", "games-job-text");
    const title = el("p", "profile-row-title games-job-title");
    if (job.name) title.textContent = job.name;
    else title.textContent = job.link;
    title.title = job.link;
    text.appendChild(title);
    const desc = el("p", "profile-row-desc games-job-desc", describe(job));
    text.appendChild(desc);
    main.appendChild(text);

    const actions = el("div", "games-job-actions");
    if (job.pr_url) {
      const link = el("a", "p-btn games-btn");
      link.href = job.pr_url;
      link.target = "_blank";
      link.rel = "noopener";
      link.appendChild(el("span", "p-btn-label", `#${job.pr_number}`));
      actions.appendChild(link);
    }
    const logButton = button(openLogs.has(job.id) ? "Hide log" : "Log", () => {
      if (openLogs.has(job.id)) openLogs.delete(job.id);
      else openLogs.add(job.id);
      load();
    });
    actions.appendChild(logButton);
    if (["failed", "duplicate", "cancelled"].includes(job.status)) {
      actions.appendChild(button("Retry", () => jobAction(job, "retry")));
    }
    if (job.status === "queued") {
      actions.appendChild(button("Cancel", () => jobAction(job, "cancel")));
    }
    main.appendChild(actions);
    item.appendChild(main);

    if (openLogs.has(job.id)) {
      const pre = el("pre", "games-log profile-mono");
      pre.dataset.log = String(job.id);
      renderLog(pre, job.id);
      item.appendChild(pre);
    }
    return item;
  }

  function renderBatch(batch) {
    const card = el("div", "profile-card games-batch");
    const head = el("div", "games-batch-head");
    head.appendChild(el("span", "profile-row-title", `Batch ${batch.id}`));
    const done = batch.jobs.filter(
      (job) => !ACTIVE.includes(job.status),
    ).length;
    const from =
      batch.source === "issue" && batch.issue_number
        ? `issue #${batch.issue_number}`
        : batch.requested_by
          ? `@${batch.requested_by}`
          : "this page";
    head.appendChild(
      el(
        "span",
        "profile-row-desc",
        `${from} · ${ago(batch.created_at)} · ${done}/${batch.jobs.length} done`,
      ),
    );
    card.appendChild(head);
    const jobs = el("ul", "games-jobs");
    for (const job of batch.jobs) jobs.appendChild(renderJob(job));
    card.appendChild(jobs);
    return card;
  }

  async function load() {
    clearTimeout(pollTimer);
    let active = false;
    try {
      const { batches } = await api("/api/admin/games/batches");
      list.replaceChildren();
      if (!batches.length) {
        list.appendChild(
          el(
            "p",
            "profile-row-desc games-empty",
            "Nothing yet. Paste some links above.",
          ),
        );
      }
      for (const batch of batches) list.appendChild(renderBatch(batch));
      active = batches.some((batch) =>
        batch.jobs.some((job) => ACTIVE.includes(job.status)),
      );
      pollLogs();
    } catch (error) {
      if (error.status !== 401 && error.status !== 403)
        toast("error", error.message);
    }
    pollTimer = setTimeout(load, active ? 4000 : 20000);
  }

  textarea.addEventListener("input", updateCount);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const n = countLinks(textarea.value);
    if (!n) return toast("error", "Paste at least one link.");
    if (n > MAX_LINKS)
      return toast("error", `At most ${MAX_LINKS} links at a time.`);
    submit.classList.add("is-loading");
    submit.disabled = true;
    try {
      const { batch } = await api("/api/admin/games/batches", {
        method: "POST",
        body: JSON.stringify({ links: textarea.value }),
      });
      textarea.value = "";
      updateCount();
      toast(
        "success",
        `Batch ${batch.id}: ${batch.jobs.length} game${batch.jobs.length === 1 ? "" : "s"} queued.`,
      );
      load();
    } catch (error) {
      toast("error", error.message);
    } finally {
      submit.classList.remove("is-loading");
      submit.disabled = false;
    }
  });

  // Pause while the tab is hidden; catch up when it comes back.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      clearTimeout(pollTimer);
      clearTimeout(logTimer);
    } else if (!gamesSection.hidden) {
      load();
    }
  });

  // Shown only to the admin, and only when the server knows the bot.
  api("/api/admin/games/status")
    .then(({ enabled }) => {
      if (!enabled) return;
      gamesSection.hidden = false;
      batchesSection.hidden = false;
      load();
    })
    .catch(() => {});
})();
