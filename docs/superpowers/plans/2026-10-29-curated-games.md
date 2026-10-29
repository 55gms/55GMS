# Curated game additions implementation plan

> **For agentic workers:** Use the repository's existing import/check tools and independent validation batches. The user requested execution without further design questions.

**Goal:** Add 100 distinct, playable, quality games discovered on https://sites.google.com/view/drive-u-7-home/ and open a PR to main with every original page URL.

**Architecture:** Keep catalog entries and game HTML in 55GMS; keep payloads and covers in 55gms/assets, following AGENTS.md. Use pinned CDN commits, existing play-page routing, save-agent and ads SDK integration. Prefer self-contained games that can be exercised in a browser without external services.

**Tech stack:** Express, static HTML/JS, Playwright/Chromium, the existing game importer/checker and CDN tooling, Ruffle for supported Flash games.

**Spec:** The user's task in this chat: only quality games, not already present, functional and unique, target 100; list all additions and original source page URLs in the PR.

## Constraints and review focus

- No existing catalog entry or game implementation may be counted again under a different title.
- No fabricated popularity statistics: curate recognizable classics and strong browser games; preserve the source page as evidence.
- A successful HTTP request or a rendered title screen alone does not prove gameplay works.
- Reject games with broken dependencies, unsupported emulation, missing assets, required external services, or blocked progression.
- Preserve existing game pages, pins, user changes, and unrelated baseline test failures.

## Tasks

- [ ] Discover source embeds; compare title aliases, catalog URLs, folders and payload identities against existing games.
- [ ] Assemble a candidate pool with provenance, stable IDs, exact source assets and hashes; download verified payloads through normal trusted routes.
- [ ] Use existing import/check tools as applicable; add pages, covers and catalog entries using the site's launcher and pinned asset conventions.
- [ ] In independent batches, inspect screenshots and perform game-specific start/play interactions. Record outcomes and reject or replace failed candidates.
- [ ] Regenerate save registry and SDK integration; verify uniqueness and exactly 100 additions; run build/output/smoke checks.
- [ ] Push the assets and site branches, verify actual CDN payloads, and open PRs with dependencies, all 100 source URLs, and honest validation evidence.
