# Design

## Visual identity

### Source

"Luvinox" references **a sun painted in oil**. The brand pulls from oil-painting pigments (Naples yellow, cerulean blue, canvas cream) rather than screen primaries — that's why the user specified "yellow + light blue **in a combination that does not clash**".

### Starting palette

These are the MVP starting values. Each is tunable during implementation review.

```
Canvas (page background)    #F2EAD6   warm cream lienzo
Sun yellow (primary)        #E8B848   Naples-ish, the brand mark
Sun deep (accent warm)      #C97F2A   for emphasis / hover
Sky blue (cool primary)     #94BBD8   powder / cerulean
Deep tint (text / shadow)   #2E4858
Ink (high-contrast text)    #1A2533
```

Each artist also declares their own `accentColor` which subtly tints their showcase panel (a la per-champion theming in LoL).

### Typography

- **Display** (artist names, hero title): a serif with character. Proposed starting set: **Cormorant Garamond** or **Fraunces** (both free, oil-painting era flavor).
- **UI / body**: a clean modern sans for legibility — proposed **Inter** or **Manrope**.

Final picks are deferred to implementation review; the MVP defines them as tokens so swapping is a one-line change.

### Texture

A subtle canvas/paper texture as the page background (low-opacity SVG noise or a small PNG). Selected states use SVG brush-stroke marks instead of straight border-bottom underlines.

### Logo slot

A `<LuvinoxMark />` placeholder component renders a simple stylized sun (CSS/SVG) at the top-left of the header. When the real artwork exists, only that component changes; consumers don't update.

## Data model

```ts
type Artist = {
  handle: string;          // 'luis-m' — used in URLs and as React keys
  displayName: string;     // 'Luis.M'
  tagline: string;         // e.g. 'Narrador de juegos de mesa · Programador'
  discipline: string;      // short label for the roster tooltip
  bio: string;             // 2–3 sentences for the showcase
  splash: string;          // path to PNG (placeholder is OK)
  icon: string;            // small roster portrait (may equal splash)
  accentColor: string;     // hex; subtle tint applied to the showcase panel
  modules: ArtistModule[]; // declarative list of what this artist exposes
};

type ArtistModule =
  | { kind: 'brief'; body: string }
  | { kind: 'socials'; entries: SocialEntry[] }
  | { kind: 'website'; url: string; label?: string }
  | { kind: 'portal'; label: string; route: string };

type SocialEntry = {
  platform: SocialPlatform;
  url: string;
};

type SocialPlatform =
  | 'twitter' | 'instagram' | 'tiktok' | 'youtube' | 'twitch'
  | 'behance' | 'artstation' | 'bandcamp' | 'spotify'
  | 'linkedin' | 'discord' | 'other';
```

The `commission-builder` module type is intentionally **not** added in this change — it's introduced in `joz-commission-builder`. The `ArtistModule` union is designed to widen without breaking existing consumers.

## Champion-select header

```
┌────────────────────────────────────────────────────────────┐
│  [sun] LUVINOX                              [nav links]    │
├────────────────────────────────────────────────────────────┤
│                                                            │
│   ┌──────────────┐    DISPLAY NAME                         │
│   │              │    tagline · cursive serif              │
│   │  PNG SPLASH  │    ─────────                            │
│   │              │    brief copy, 2-3 lines                │
│   │              │                                         │
│   └──────────────┘    ● twitter  ● ig  ● website           │
│                       [ Portal CTA — only Luis.M ]         │
│                                                            │
│  ── brush-stroke divider ──────────────────────────────    │
│  [○][●][ ][ ][ ][ ][ ][ ][ ][ ][ ][ ][ ][ ][ ]             │
│      ↑ active                                              │
└────────────────────────────────────────────────────────────┘
```

### Interaction

- **Click** a roster icon → that artist becomes active.
- **Hover** a roster icon → tooltip with the artist's name. No full showcase swap on hover (avoids jitter; the showcase only changes on intentional selection).
- **Keyboard:** Tab moves into the roster; arrow keys navigate between icons; Enter or Space selects.
- `aria-selected` on the active icon; the roster has `role="tablist"` semantics; the showcase has `role="tabpanel"`.
- Focus indicator is always visible.

### Default active

The first artist in the roster array is selected on initial render. There is no URL persistence in MVP.

### Mobile

Below 768px:
- Stack vertically: splash on top, identity + modules in the middle, roster as a horizontal scroll strip at the bottom.
- Splash scales down; tagline and brief remain legible.
- Roster strip scrolls horizontally without snapping to keep the implementation simple.

## Why "modules" instead of a fixed card layout

Luis.M and Joz already need fundamentally different things:

- Luis.M needs a portal button to his sub-experience and is **not** seeking sponsors (acto de presencia).
- Joz needs a commission builder for actual income.

Future creators will add stores, Patreon links, music embeds, workshop listings, etc. Hard-coding card fields would push us into a sprawling "every field nullable" mess. Modules keep each artist's profile honest to what they actually expose.

## Open questions / iterations expected

- Exact palette values — need validation against real splash art when it exists.
- Exact fonts — depend on licensing comfort and final type pairings.
- Whether the active artist persists across reloads (e.g. URL hash `#joz`).
- Whether to animate the showcase swap (cross-fade, slide).
- Treatment of the brush-stroke divider — needs a designer pass.
