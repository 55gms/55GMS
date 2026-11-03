# Requested games and catalog metadata implementation plan

> Use the existing import/check tools. Continue the authorized execution on `feat/100-curated-games` and update PR #299 without another design gate.

**Goal:** Add the ten requested games where genuinely new, use the existing 55GMS loading screen, and provide actual game artwork and original creator credits for all 101 previous additions and new additions.

**Architecture:** Keep HTML/catalog/integration changes in 55GMS and non-HTML game assets in 55gms/assets. Reuse pinned CDN routing, import preparation, saves and ads tools. Record source provenance, duplicate decisions and actual verification limits.

**Spec:** The supplied handoff and current user request, including the requirement to work only on the correct branch and update the existing PR.

## Constraints and review focus

- Both repositories stay on `feat/100-curated-games`; no main edits, merge or deployment.
- Check aliases and payload hashes as well as catalog names.
- Artwork depicts the individual game; creator attribution has evidence and does not credit the importing portal.
- Legacy loader elements may remain hidden when runtime scripts require their IDs; gameplay canvas and startup must remain functional.
- Keep the prior `verification-incomplete` gate until the whole batch has gameplay evidence.

## Tasks

- [ ] Fetch source embeds, compare aliases/payloads, and record decisions for all ten requested games.
- [ ] Mirror new payloads with existing tools, split oversized files, prepare HTML using the shared loader, and verify startup and opening gameplay.
- [ ] Replace placeholder artwork and credits for all previous/new additions with source-backed game-specific metadata.
- [ ] Run save/ads integration, targeted loader tests, catalog checks, build and output verification; report the existing acceptance failure separately.
- [ ] Commit and push selected assets, pin source/catalog URLs, commit/push the site branch, and update PR #299 with sources and verification results.
