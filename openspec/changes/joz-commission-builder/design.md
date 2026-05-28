# Design

## Data shape

```ts
type CommissionBuilderModule = {
  kind: 'commission-builder';
  currency: string;              // ISO-style label: 'USD', 'MXN', etc.
  contactEmail: string;          // where the mailto: submission is addressed
  services: CommissionService[]; // one is selected at a time
  modifiers: CommissionModifier[];
  notes?: string;                // optional freeform copy shown above the form
};

type CommissionService = {
  id: string;
  name: string;
  basePrice: number;             // in `currency` units
  description?: string;
  exampleImage?: string;         // small thumb, optional
};

type CommissionModifier = {
  id: string;
  label: string;
  type: 'flat' | 'percent';
  amount: number;                // flat: currency units; percent: 0–100
};
```

The `ArtistModule` union in `MoM-web/src/data/artists.ts` is widened to include `CommissionBuilderModule`. Existing consumers (showcase dispatcher) continue to ignore unknown module kinds gracefully, then the new renderer is registered.

## UI layout

```
┌── Joz's showcase panel ───────────────────────────────────┐
│                                                           │
│  [splash]      Joz                                        │
│                Ilustradora freelance                      │
│                                                           │
│                ● twitter  ● ig  ● website                 │
│                                                           │
│  ─── Commission builder ─────────────────────────────     │
│                                                           │
│   1. Pick a service                                       │
│   ( ) Headshot — $20                                      │
│   (●) Half-body — $35                                     │
│   ( ) Full-body — $50                                     │
│   ( ) Chibi — $25                                         │
│   ( ) Reference sheet — $80                               │
│                                                           │
│   2. Add modifiers                                        │
│   [✓] Extra character +$15                                │
│   [ ] Detailed background +30%                            │
│   [ ] Commercial use +50%                                 │
│   [ ] Rush delivery (under 5 days) +$20                   │
│                                                           │
│   ─────────────────────                                   │
│   Total: $50 USD                                          │
│                                                           │
│   [ Request quote → opens email ]                         │
└───────────────────────────────────────────────────────────┘
```

## Pricing math

Pure function for testability:

```ts
function computeTotal(
  service: CommissionService | undefined,
  enabledModifierIds: string[],
  modifiers: CommissionModifier[],
): number {
  if (!service) return 0;
  let total = service.basePrice;
  for (const id of enabledModifierIds) {
    const m = modifiers.find((x) => x.id === id);
    if (!m) continue;
    if (m.type === 'flat') total += m.amount;
    else total += service.basePrice * (m.amount / 100);
  }
  return Math.round(total);
}
```

**Key choice:** percent modifiers apply to the **base service price**, not to the running total. This makes toggle order irrelevant and the math predictable to the client and to Joz.

## Submission via mailto:

When the user activates "Request quote":

```
mailto:<contactEmail>
?subject=Luvinox commission — Joz
&body=<URL-encoded summary>
```

Body template:

```
Hi Joz,

I'd like to request a commission with the following:

Service: Half-body — $35
Modifiers:
  • Extra character — +$15

Total estimate: $50 USD

Additional details:
(leave room for the client to write)

— sent via the Luvinox commission builder
```

The submit element is a real `<a href="mailto:...">` styled as a button, not a `<button>` with a JS handler. This means the builder works even if JS has a runtime hiccup, and it's a real link a screen reader announces correctly.

## Accessibility

- Service options form an actual `<fieldset>` with `role="radiogroup"` and a `<legend>` ("Pick a service").
- Modifiers are real `<input type="checkbox">` with explicit `<label>` associations.
- The total uses `aria-live="polite"` so screen readers announce updates when selections change.
- Currency is read out in plain text (e.g., "Total: 50 USD") rather than just "$50" for clarity.
- Focus is visible on all controls; tab order is logical.

## Where it lives in MVP

Inline in Joz's showcase panel on `/`. No separate route. When a future iteration adds `/artist/<handle>`, the same `<CommissionBuilder />` can be reused there without modification.

## Open questions / iterations expected

- Joz's actual prices, services, and modifiers.
- Joz's actual contact email.
- Currency (most likely MXN or USD — to be confirmed).
- Whether to show example thumbnails per service in MVP (the data model supports it; the UI can defer rendering if assets aren't ready).
- Whether to surface a "by submitting you agree to Joz's terms" line and link to a terms blurb (probably yes once Joz has terms).
- Validation behavior when no service is selected — show inline error vs disable submit. MVP: disable submit + hint copy.
