# Routing capability

## ADDED Requirements

### Requirement: The site SHALL define a Luvinox home route and a Multiverse of Madness route

The application uses client-side routing to separate the Luvinox community home from Luis.M's personal sub-experience.

#### Scenario: Visiting the root URL
- **WHEN** a user navigates to `/`
- **THEN** the Luvinox home page is rendered

#### Scenario: Visiting the Multiverse of Madness sub-experience
- **WHEN** a user navigates to `/multiverse-of-madness`
- **THEN** the Multiverse of Madness page is rendered, containing the legacy MoM Collective layout (hero, team grid, culture, partnership, CTA)

### Requirement: The site SHALL support direct deep links and refresh on every route

The site is hosted on a static host (GitHub Pages) that does not know about client-side routes. A SPA fallback ensures that direct navigation and refresh on any route resolve to the application.

#### Scenario: Entering a deep URL directly
- **GIVEN** the site is deployed to GitHub Pages
- **WHEN** a user enters `/multiverse-of-madness` in the address bar (cold)
- **THEN** the Multiverse of Madness page is rendered without a 404

#### Scenario: Refreshing a deep route
- **GIVEN** a user is viewing `/multiverse-of-madness`
- **WHEN** the user refreshes the page
- **THEN** the same page is rendered (no 404)

### Requirement: Unknown routes SHALL resolve gracefully

#### Scenario: Navigating to an unrecognized path
- **WHEN** a user navigates to a URL that matches no defined route
- **THEN** the site either redirects the user to `/` or renders a minimal not-found view — the MVP MAY choose either behavior
