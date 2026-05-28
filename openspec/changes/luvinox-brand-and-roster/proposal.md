# Luvinox Brand & Roster

## Why

Following the rebrand from MoM Collective to **Luvinox**, the new home page needs to express the brand visually and serve as a champion-select-style introduction to the community of creators. The MVP delivers enough of the visual identity and roster mechanics to be presentable to creators and sponsors for review while leaving room for iteration on assets, motion, and creator-specific modules.

Luvinox's purpose is to **formalize each creator's personal brand for sponsors and external opportunities**, not to sell collective services.

## What changes

- Define design tokens for the Luvinox brand: oil-painting palette (warm yellow + light blue + canvas cream), painterly background texture, typography, and a reserved logo slot.
- Introduce an `Artist` data model with a **module-based** card system, so each creator can opt into different features (socials, website, portal, future commission builder, etc.) without forcing a fixed shape.
- Implement a champion-select-style header on `/`:
  - Persistent roster strip showing all artists.
  - Central showcase panel that updates when a roster icon is selected.
  - Showcase displays the active artist's splash PNG, name, tagline, brief, accent color, and modules.
- Seed the roster with **two** artists: Luis.M and Joz (Joz without commission builder; that arrives in the follow-up change `joz-commission-builder`).
- Luis.M exposes a **portal** module — a CTA button labeled "Multiverse Of Madness" that navigates to `/multiverse-of-madness`. For MVP this is plain navigation; the theatrical eclipse transition arrives later.

## Out of scope (non-goals)

- The real Luvinox sun logo — placeholder slot reserved, final asset TBD.
- Real PNG splash art for the artists — placeholder graphic per artist, real assets TBD.
- `/artist/<handle>` dedicated detail pages — everything inline in the home for MVP.
- The eclipse / theatrical route transition — separate future change.
- Joz's commission builder — separate change `joz-commission-builder`.
- More than two creators — the remaining ~13 are added incrementally as they're confirmed.
- Hover-driven preview voice lines, particle effects, sound design — not in MVP.
- Persisting the active artist across reloads (URL hash, query param) — future iteration.
