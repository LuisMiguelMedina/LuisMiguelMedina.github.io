# Artist Roster capability

## ADDED Requirements

### Requirement: The system SHALL represent each artist with a structured profile and a list of modules

Each artist is described by identity fields and a declarative list of **modules** specifying which features they expose on their card. The module system lets different artists opt into different features without forcing a fixed card shape.

#### Scenario: Defining an artist
- **WHEN** a new artist entry is added to the roster data
- **THEN** the entry includes at minimum: `handle`, `displayName`, `tagline`, `discipline`, `bio`, `splash`, `icon`, `accentColor`, and a non-empty `modules` list

#### Scenario: An artist exposes a portal module
- **GIVEN** an artist's modules include `{ kind: 'portal', label, route }`
- **WHEN** that artist is the active artist in the showcase
- **THEN** the showcase renders a prominent CTA button using `label` that navigates to `route` when activated

#### Scenario: An artist exposes socials and a website
- **GIVEN** an artist's modules include `socials` and `website` entries
- **WHEN** that artist is the active artist
- **THEN** the showcase renders the social links as iconified buttons and the website as a labeled link

### Requirement: The Luvinox home SHALL present artists in a champion-select layout

The Luvinox home (`/`) renders a roster strip plus a central showcase panel for the active artist.

#### Scenario: Default active artist
- **WHEN** a user lands on `/`
- **THEN** the first artist in the roster is selected by default and their showcase is visible

#### Scenario: Selecting a different artist
- **WHEN** a user clicks an icon in the roster strip
- **THEN** the showcase panel updates to display that artist's splash, identity, and modules
- **AND** the roster strip visually indicates which artist is currently active

#### Scenario: Keyboard navigation across the roster
- **WHEN** a user has keyboard focus inside the roster strip
- **AND** presses the left or right arrow key
- **THEN** focus moves to the previous or next artist's icon
- **WHEN** the user presses Enter or Space on a focused icon
- **THEN** that artist becomes the active artist

#### Scenario: Hover preview
- **WHEN** a user hovers a roster icon without clicking
- **THEN** the artist's name appears as a tooltip
- **AND** the showcase panel does NOT change (only clicks or keyboard selection change the active artist)

#### Scenario: Mobile layout
- **GIVEN** a viewport width below 768px
- **WHEN** the home page is rendered
- **THEN** the splash, identity, and modules stack vertically
- **AND** the roster becomes a horizontally scrollable strip at the bottom

### Requirement: The MVP roster SHALL include Luis.M and Joz

The MVP ships with two seeded artists. Additional artists are added incrementally and do not block this change.

- **Luis.M** — modules include a `portal` entry with label `"Multiverse Of Madness"` and route `/multiverse-of-madness`. Treated as "acto de presencia" (presence, not promotion). No commission builder.
- **Joz** — modules include `socials` and `website`. The commission builder is added in the follow-up change `joz-commission-builder`.

#### Scenario: Inspecting the seeded roster
- **WHEN** an engineer reads `MoM-web/src/data/artists.ts`
- **THEN** entries exist for `luis-m` and `joz` with module sets matching the roles described above

#### Scenario: Activating Luis.M and following his portal
- **GIVEN** Luis.M is the active artist
- **WHEN** the user activates the "Multiverse Of Madness" button
- **THEN** the application navigates to `/multiverse-of-madness`
