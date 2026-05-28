# Tasks

## 1. Extend the module system

- [ ] 1.1 Add `CommissionBuilderModule`, `CommissionService`, `CommissionModifier` to `MoM-web/src/data/artists.ts`
- [ ] 1.2 Widen the `ArtistModule` union to include `commission-builder`

## 2. Seed Joz's data

- [ ] 2.1 Add a `commission-builder` module entry to Joz's artist record
- [ ] 2.2 Populate `services` with 4–5 placeholders: headshot, half-body, full-body, chibi, reference sheet (placeholder prices)
- [ ] 2.3 Populate `modifiers` with 3–4 placeholders: extra character, detailed background, commercial use, rush (placeholder values)
- [ ] 2.4 Mark all values with `// TODO confirm with Joz`
- [ ] 2.5 Set `contactEmail` to a TBD placeholder Joz controls

## 3. Pricing math

- [ ] 3.1 Implement `computeTotal(service, enabledModifierIds, modifiers)` as a pure function
- [ ] 3.2 (Recommended, not required for MVP) add a small unit test covering: no service, flat modifier, percent modifier, multiple modifiers, percent calculated against base price not running total

## 4. UI

- [ ] 4.1 Create `<CommissionBuilder module={...} />` component
- [ ] 4.2 Render service options as a `<fieldset>` + `role="radiogroup"`
- [ ] 4.3 Render modifier toggles as labeled checkboxes
- [ ] 4.4 Render the live total with `aria-live="polite"` and the currency
- [ ] 4.5 Render the submit `<a href="mailto:...">` with the prefilled subject + body
- [ ] 4.6 Disable / hide the submit link when no service is selected (and show a short hint)

## 5. Wire into the showcase

- [ ] 5.1 Register `commission-builder` in the showcase module dispatcher
- [ ] 5.2 Confirm Joz's panel renders the builder
- [ ] 5.3 Confirm Luis.M's panel does **not** render the builder (he doesn't declare the module)

## 6. Responsive & a11y

- [ ] 6.1 Mobile (<768px): controls stack vertically, remain tappable
- [ ] 6.2 Keyboard nav across radios and checkboxes works as expected
- [ ] 6.3 Focus indicator visible on all controls
- [ ] 6.4 Screen reader announces total updates

## 7. Verification

- [ ] 7.1 Manually exercise every service + every modifier combination at least once
- [ ] 7.2 Click submit — verify the mail client opens with a correct subject and body
- [ ] 7.3 Confirm the prefilled summary matches the on-screen selections and total
