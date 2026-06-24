import { useTheme } from './ThemeContext';
import './ThemeToggle.scss';

// Day/night switch backed by the shared ThemeContext, so flipping it updates the
// whole UI (home, themed pages, and the page transition) at once.

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.4 1.4M17.6 17.6L19 19M19 5l-1.4 1.4M6.4 17.6L5 19" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z" />
    </svg>
  );
}

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const night = theme === 'night';

  return (
    <button
      className="lvx-theme-toggle"
      data-theme={theme}
      type="button"
      onClick={toggle}
      aria-label="Cambiar entre modo día y noche"
      aria-pressed={night}
    >
      <span className="lvx-theme-knob">{night ? <MoonIcon /> : <SunIcon />}</span>
    </button>
  );
}
