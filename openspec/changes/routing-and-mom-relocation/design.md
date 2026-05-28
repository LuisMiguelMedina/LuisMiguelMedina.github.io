# Design

## Routing library

**Decision:** `react-router-dom` v6+, using `createBrowserRouter` + `RouterProvider`.

**Why:** Standard for React + Vite, smallest learning curve, well-supported SPA fallback, documented patterns for static hosting. Alternatives (TanStack Router, Wouter) add complexity not justified at this stage.

## File layout

```
MoM-web/src/
  main.tsx                       ← Router setup, RouterProvider
  App.tsx                        ← REMOVED or reduced to nothing (router lives in main.tsx)
  pages/
    LuvinoxHomePage.tsx          ← New. Placeholder for this MVP.
    MultiverseOfMadnessPage.tsx  ← Receives the current App.tsx body content.
  components/                    ← Existing.
  data/                          ← Existing.
```

## SPA 404 fallback on GitHub Pages

GitHub Pages serves `/multiverse-of-madness` as 404 by default for a SPA. The existing `generate-404.js` script is intended for this pattern.

**TBD during implementation:** confirm the script copies `dist/index.html` → `dist/404.html` (or equivalent) and that the boot logic restores the requested path. If not, a minimal adjustment is needed.

## Why move "everything" rather than re-skin in place?

Two reasons:

1. The Luvinox identity and the MoM identity are intentionally **opposite** in tone (luminous oil-painting vs dark drama). Sharing a page would dilute both.
2. Luis.M owns the MoM sub-experience and will evolve its content over time. Giving it its own route makes that evolution independent of Luvinox iterations.

## Open questions / future iterations

- Lazy-load `/multiverse-of-madness` once it grows beyond its current size.
- Route-level error boundaries — not added in MVP.
- Whether `/multiverse-of-madness` aliases (`/mom`, `/luis-m`) are useful. Not in MVP.
