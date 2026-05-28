# Tasks

## 1. Brand tokens

- [x] 1.1 Add Luvinox color variables (canvas, sun, sun-deep, sky, deep-tint, ink) to `MoM-web/src/styles.scss` or a dedicated tokens file
- [x] 1.2 Define display + UI typography variables and load the chosen fonts (Cormorant/Fraunces + Inter/Manrope are the starting proposal) _(Fraunces + Manrope loaded via Google Fonts in `index.html`)_
- [x] 1.3 Apply the canvas texture as the global body background of the Luvinox home (does **not** apply on `/multiverse-of-madness`) _(body uses cream canvas + SVG fractal-noise texture; `.app-shell` overrides with MoM dark theme)_
- [x] 1.4 Create `<LuvinoxMark />` placeholder component (simple SVG sun) — reserved component for the real logo asset

## 2. Data model

- [x] 2.1 Create `MoM-web/src/data/artists.ts` exporting `Artist`, `ArtistModule`, `SocialEntry`, `SocialPlatform` types
- [x] 2.2 Seed two entries:
  - `luis-m` with modules: `brief`, `socials` (minimal), `portal` (label "Multiverse Of Madness", route `/multiverse-of-madness`)
  - `joz` with modules: `brief`, `socials`, `website`
- [x] 2.3 Mark TBD fields with `// TODO confirm with <creator>` comments

## 3. Champion-select header

- [x] 3.1 Build `<ArtistShowcase />` — splash + identity + modules dispatcher
- [x] 3.2 Build `<RosterStrip />` — horizontal list of artist icons with selection state
- [x] 3.3 Build `<LuvinoxHomePage />` orchestrating roster + showcase (active-artist state lives here)
- [x] 3.4 Build module renderers: `<BriefModule />`, `<SocialsModule />`, `<WebsiteModule />`, `<PortalModule />`
- [x] 3.5 Showcase dispatches to the right renderer based on `module.kind` _(`ModuleRenderer` switch in `ArtistShowcase`, exhaustively typed)_

## 4. Interactions & a11y

- [x] 4.1 Click on a roster icon updates the active artist
- [x] 4.2 Keyboard nav: arrow keys move between roster icons, Enter/Space selects _(Arrow keys + Home/End; Enter/Space activate the native `<button>`)_
- [x] 4.3 Semantics: `role="tablist"` on the roster, `role="tab"` + `aria-selected` on each icon, `role="tabpanel"` on the showcase _(plus `aria-controls` + `aria-labelledby` wiring)_
- [x] 4.4 Roster icon hover shows the artist name as a tooltip _(`title` attribute + visible `luvinox-roster-name` label)_
- [x] 4.5 Focus is always visible _(`:focus-visible` outline in styles)_

## 5. Responsive

- [x] 5.1 Desktop (≥1024px): splash + identity side-by-side, roster below _(default grid 5fr/6fr)_
- [x] 5.2 Tablet (768–1023px): same shape, tighter spacing _(grid collapses to single column with centered identity)_
- [x] 5.3 Mobile (<768px): stacked vertical, roster as horizontal scroll strip _(smaller icons + paddings)_
- [ ] 5.4 Manual check at 375/768/1280 widths

## 6. Replace the placeholder home

- [x] 6.1 Replace the `LuvinoxHomePage` placeholder body (introduced in `routing-and-mom-relocation`) with the champion-select implementation

## 7. Hand-off for review

- [ ] 7.1 Screenshots: desktop + mobile, both artists selected
- [x] 7.2 Note open TODOs for the next iteration (palette tweaks, real assets, font final picks) _(see "Open TODOs" section in the implementation summary)_
