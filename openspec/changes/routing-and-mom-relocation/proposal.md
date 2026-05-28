# Routing and MoM Relocation

## Why

The site is being rebranded from "MoM Collective" to **Luvinox** — a community of ~15 mutually-supporting artists and creators. The existing single-page content (`MoM-web/src/App.tsx`) becomes a sub-experience belonging to one specific creator (Luis.M) under the route `/multiverse-of-madness`, while `/` becomes the new Luvinox home.

This change is the foundation. It introduces routing **without touching visual design**. Subsequent changes (Luvinox home + roster, Joz's commission builder) layer on top of this scaffolding.

## What changes

- Install `react-router-dom`.
- Refactor the application shell into a Router with two routes:
  - `/` → `LuvinoxHomePage` (minimal "coming soon" placeholder for this change — replaced by `luvinox-brand-and-roster`).
  - `/multiverse-of-madness` → `MultiverseOfMadnessPage`, containing the **current site content unchanged**.
- Verify the SPA 404 fallback (`generate-404.js`) handles the new route shape on GitHub Pages.

## Out of scope (non-goals)

- Visual / branding changes — none in this change.
- Creator data model changes — none in this change.
- Removal of leftover Angular files under `MoM-web/src/app/` — separate cleanup, not blocking.
- Server-side rendering or static prerendering.
- Per-artist sub-routes (`/artist/<handle>`) — deferred to a later iteration.
- The theatrical "eclipse" transition between Luvinox and MoM — deferred.
