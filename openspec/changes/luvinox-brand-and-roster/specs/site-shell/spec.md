# Site shell capability

## ADDED Requirements

### Requirement: The Luvinox home SHALL render under the Luvinox visual identity

The Luvinox identity is defined by an oil-painting-inspired palette (warm yellow + light blue + canvas cream) and a painterly aesthetic. All shared layout primitives on `/` (page background, headings, primary buttons, base text) draw from this token set.

#### Scenario: A new component is added to the Luvinox home
- **WHEN** a new component is rendered as part of `/`
- **THEN** it inherits the Luvinox background, typography, and base text colors from global tokens without needing to redeclare them

#### Scenario: The brand mark is displayed
- **WHEN** the Luvinox sun mark is rendered in the header
- **THEN** it is provided through a single `<LuvinoxMark />` component, so the eventual real asset replaces it without changes to consumer code

#### Scenario: An artist's accent color is applied
- **GIVEN** an artist has declared a non-empty `accentColor`
- **WHEN** that artist is the active artist in the showcase
- **THEN** the showcase panel applies a subtle tint or accent derived from that color
- **AND** shared layout chrome (header, navigation, page background) remains in the Luvinox base palette

### Requirement: The Multiverse of Madness sub-page MAY override the Luvinox visual identity

The `/multiverse-of-madness` page is Luis.M's personal sub-experience. Its visual treatment is allowed to depart from the Luvinox identity so the contrast between the two worlds is meaningful.

#### Scenario: Viewing the MoM page
- **WHEN** a user is on `/multiverse-of-madness`
- **THEN** the page MAY render with its own visual treatment (palette, typography, tone) distinct from the Luvinox identity
