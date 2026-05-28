# Tasks

## 1. Install router

- [x] 1.1 Add `react-router-dom` to `MoM-web/package.json` dependencies
- [x] 1.2 Run `npm install`

## 2. Move existing content into a page component

- [x] 2.1 Create `MoM-web/src/pages/MultiverseOfMadnessPage.tsx`
- [x] 2.2 Move the current `App.tsx` body (hero, team grid, culture, partnership, CTA sections) verbatim into the new page
- [x] 2.3 Preserve all existing imports, classnames, and behavior — this is a relocation, not a redesign
- [x] 2.4 Update internal anchor links (`#team`, `#culture`, `#join`, `#top`) to continue working within the page

## 3. Create the new home placeholder

- [x] 3.1 Create `MoM-web/src/pages/LuvinoxHomePage.tsx`
- [x] 3.2 Render a minimal placeholder: "Luvinox" title + a short "Coming soon" line — no Luvinox-brand styling yet (that arrives in the next change)
- [x] 3.3 Add a temporary link to `/multiverse-of-madness` so the route is reachable manually during the MVP

## 4. Wire the router

- [x] 4.1 In `main.tsx`, set up `createBrowserRouter` with two routes:
  - `/` → `LuvinoxHomePage`
  - `/multiverse-of-madness` → `MultiverseOfMadnessPage`
- [x] 4.2 Wrap the app in `RouterProvider`
- [x] 4.3 Reduce or remove `App.tsx` once its content has been relocated _(removed)_

## 5. SPA fallback for GitHub Pages

- [x] 5.1 Inspect `MoM-web/generate-404.js` — verify it copies the built `index.html` to `404.html` _(already correct; copies index.html → 404.html and writes .nojekyll)_
- [x] 5.2 If missing, add or fix that behavior so deep-linking and refresh on `/multiverse-of-madness` work _(no fix needed; existing script handles SPA fallback)_

## 6. Verify

- [ ] 6.1 `npm run dev` — navigate `/` and `/multiverse-of-madness`
- [ ] 6.2 `npm run build && npm run preview` — same paths work in the production build _(build verified passing; preview navigation pending manual check)_
- [ ] 6.3 Refresh the page while on `/multiverse-of-madness` — no 404
- [ ] 6.4 Navigate to an unknown URL (e.g. `/foo`) — confirm the chosen fallback behavior _(implemented: catch-all route `*` falls back to `LuvinoxHomePage`)_
