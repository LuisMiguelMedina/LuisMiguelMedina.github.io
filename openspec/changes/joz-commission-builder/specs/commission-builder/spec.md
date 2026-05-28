# Commission Builder capability

## ADDED Requirements

### Requirement: The roster module system SHALL support a commission-builder module

An artist's `modules` list MAY include a `commission-builder` entry that declares services, modifiers, currency, and a contact email. Any artist may opt in; only Joz uses it in the MVP.

#### Scenario: Declaring a commission builder
- **WHEN** an artist's modules include `{ kind: 'commission-builder', currency, contactEmail, services, modifiers }`
- **THEN** the showcase renders the commission builder UI inside that artist's panel

### Requirement: The commission builder SHALL let a user assemble exactly one service plus zero or more modifiers and compute a live total

#### Scenario: Selecting a service
- **WHEN** a user picks a service option
- **THEN** exactly one service is selected at any time
- **AND** the total updates to reflect that service's `basePrice` combined with any currently enabled modifiers

#### Scenario: Toggling a flat modifier on
- **GIVEN** a modifier with `type: 'flat'` and `amount: X`
- **WHEN** the user enables that modifier
- **THEN** the total increases by exactly `X` units of the configured currency

#### Scenario: Toggling a percent modifier on
- **GIVEN** a modifier with `type: 'percent'` and `amount: P`
- **AND** the selected service has `basePrice: B`
- **WHEN** the user enables that modifier
- **THEN** the total increases by exactly `B * (P / 100)` units
- **AND** the increment is computed against the base service price, not against the running total, so toggle order does not affect the result

#### Scenario: Toggling a modifier off
- **WHEN** the user disables a previously enabled modifier
- **THEN** the total decreases by the same amount that modifier had added

#### Scenario: No service selected
- **WHEN** no service is selected
- **THEN** the total is displayed as zero in the configured currency
- **AND** the submit control is disabled or hidden, with a short hint indicating a service must be chosen

### Requirement: The commission builder SHALL submit via mailto: with a prefilled body — no backend dependency

#### Scenario: Submitting a quote
- **GIVEN** the user has selected a service and optionally toggled modifiers
- **WHEN** the user activates the submit control
- **THEN** the user's mail client opens with:
  - `to` set to the module's `contactEmail`
  - a subject identifying the commission and the artist
  - a body summarizing the selected service, each enabled modifier, the computed total, and the currency
- **AND** no network request is made

### Requirement: The commission builder SHALL be operable with keyboard and screen reader

#### Scenario: Keyboard-only use
- **WHEN** a user navigates using only Tab, arrow keys, Space, and Enter
- **THEN** every control is reachable, the focus indicator is visible, and a quote submission can be completed without a mouse

#### Scenario: Total announcement
- **WHEN** the running total changes
- **THEN** assistive technology announces the new total (the total element has `aria-live="polite"` or equivalent)

#### Scenario: Currency clarity
- **WHEN** the total is rendered
- **THEN** the currency label (e.g. "USD", "MXN") is part of the text, not relied on visually-only formatting
