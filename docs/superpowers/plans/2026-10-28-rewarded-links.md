# Rewarded Links Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** An unlisted page revealing a random unused website URL after a verified rewarded video.
**Architecture:** Express API owns the configured pool and redeems one-use ad grants. Static page uses the pinned video SDK; per-visit state stays in memory.
**Tech Stack:** Node, Express, plain HTML/CSS/JS, existing 55GMS Ads v1.3.1.
**Spec:** `docs/superpowers/specs/2026-10-28-rewarded-links-design.md`

## Global Constraints

- New branch; no navigation links, database migration, games download or persistent unlock storage.
- Backend JSON configuration `LINKS_URLS`; HTTPS only; no URL list exposed in static assets.
- Accept only verified, redeemed `links`/`site-link` rewards.

## Review Focus

- Missing ad configuration and empty/invalid pools fail closed.
- Replayed, forged and unrelated game grants reveal nothing.
- Non-success ad outcomes and SDK failure leave the button retryable.
- Repeated clicks cannot start parallel reveals; exhausted pool stops ads.
- Reload and back/forward restoration clear unlocks; desktop/mobile layout stays usable.

### Task 1: Backend configuration and grant redemption

**Files:** `routes/links.js`, `tests/links.test.mjs`, `index.js`, `EXAMPLE.env`, `docs/links.md`.
**Interfaces:** `createLinksRouter(options)` exposes GET `/` (count/availability only), POST `/reveal` with `{grant:{id,signature},used:[id]}` returning `{link:{id,url},remaining}`.

- [x] Write and run failing integration tests for config validation, no grant, replay, unrelated grant, random unused selection and exhaustion.
- [x] Implement pool parsing, verified one-use redemption with timeout, no-store responses and bounded inputs; register `/api/links` before disabled-feature fallback.
- [x] Run backend integration tests and document real setup requirements.

### Task 2: Page and browser validation

**Files:** `static/links.html`, `static/assets/css/links.css`, `static/assets/js/links.js`, `index.js`.
**Interfaces:** SDK `window.__gmsAdsVideo.host('/api/_ads').show({format:'video_rewarded',gameId:'links',rewardId:'site-link',placement:'links',rewardLabel:'a new website link'})`; reveal only if status `granted` and a signed grant exists.

- [x] Create themed, responsive page, retry/status/exhausted states and memory-only revealed list with open/copy controls.
- [x] Test real page in Chromium with SDK/upstream test responses for success, cancellation, no-fill, missing grant, failure, repeated clicks and reload. Verify no inbound links.
- [x] Run syntax/diff checks, request independent review, address findings and report live-ad limitations.

## Results

- Backend and Chromium suites: 20 passing checks, including clipboard, forged/replayed grants and late completion after a 190-second consent/playback pause.
- Real app: `/links` returns 200 without accounts/database; an unconfigured pool returns unavailable and refuses reveals.
- Production HTML/JS/versioning stages exercised on the new page and its scripts without building/downloading games.
- Independent review complete; malformed reward-ID coercion and the page-level timeout were each reproduced and fixed with regression tests.
- Live ad playback is unverified: this instance has no ad credentials or link pool. Supply real `LINKS_URLS` and existing ad service configuration before deployment validation.
- Repository `npm test` is the existing placeholder and reports no test specified; use the explicit Links test commands in `docs/links.md`.
