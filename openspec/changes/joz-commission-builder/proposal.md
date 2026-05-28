# Joz Commission Builder

## Why

Joz is a freelance artist in the Luvinox community. To make her presence on the site useful for actual income (not just promotion), her card needs a **dynamic commission builder**: a small UI where a prospective client assembles their commission from her price list and submits a request.

This change introduces the `commission-builder` module type, implements its UI, and wires Joz to use it. Because the site is statically hosted, submission is performed via `mailto:` with a prefilled body — no backend involved.

## What changes

- Extend the `ArtistModule` union (from `luvinox-brand-and-roster`) with a new variant: `commission-builder`.
- Add a typed schema for services, modifiers, currency, and submission target.
- Implement `<CommissionBuilder />`: a service picker (radio group), modifier toggles (checkboxes), a live total, and a submit action that opens the user's mail client with a prefilled summary.
- Seed Joz's `commission-builder` module with **4–5 placeholder services** (e.g., headshot, half-body, full-body, chibi, reference sheet) and **3–4 placeholder modifiers** (e.g., extra character, detailed background, commercial use, rush). Real prices and contact email are confirmed with Joz before launch.
- The builder lives inline in Joz's showcase panel on `/`. No dedicated `/artist/joz` route in MVP.

## Out of scope (non-goals)

- Multi-currency — one currency per artist, no live conversion.
- Incompatibility rules between selections (e.g., "chibi cannot have detailed background") — Joz confirms the final quote manually.
- File attachments / reference image uploads — out of scope for `mailto:` submission.
- PDF or image generation of the quote.
- Backend submission, webhooks, form processors.
- Real final prices — placeholders ship with the MVP; Joz fills in before launch.
- `/artist/joz` dedicated route.
- Commission builders for other artists — the system supports it, but only Joz is seeded in this change.
