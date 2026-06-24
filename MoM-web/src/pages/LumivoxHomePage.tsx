import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DayMark, NightMark, readTheme, THEME_KEY, type Theme } from '../components/LumivoxLogo';
import { artists } from '../data/artists';
import './LumivoxHome.scss';

// Lumivox homepage — brand landing with a day/night logo (radiant sun ↔ "V"
// monogram). Implements the "Lumivox — Guía de construcción" brand spec.

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

export function LumivoxHomePage() {
  const [theme, setTheme] = useState<Theme>('day');

  useEffect(() => {
    setTheme(readTheme());
  }, []);

  const toggle = (): void =>
    setTheme((t) => {
      const next: Theme = t === 'night' ? 'day' : 'night';
      localStorage.setItem(THEME_KEY, next);
      return next;
    });

  const night = theme === 'night';

  return (
    <div className="lumivox-site" data-theme={theme}>
      <header className="lvx-top">
        <div className="lvx-brand">
          <div className="lvx-logo-mark markstack" aria-hidden="true">
            <DayMark />
            <NightMark />
          </div>
          <span className="lvx-word">lumivox</span>
        </div>

        <nav className="lvx-nav">
          <Link to="/artistas">obras</Link>
          <Link to="/artistas">artistas</Link>
          <Link to="/artistas">comunidad</Link>
        </nav>

        <div className="lvx-actions">
          <button
            className="lvx-switch"
            type="button"
            onClick={toggle}
            aria-label="Cambiar entre modo día y noche"
            aria-pressed={night}
          >
            <span className="lvx-knob">{night ? <MoonIcon /> : <SunIcon />}</span>
          </button>
        </div>
      </header>

      <section className="lvx-hero">
        <div className="lvx-hero-text">
          <h1>
            Donde el arte
            <br />
            encuentra su <span className="lvx-accent">voz</span>.
          </h1>
        </div>

        <div className="lvx-hero-mark markstack" aria-hidden="true">
          <DayMark />
          <NightMark stars />
        </div>
      </section>

      <section className="lvx-artists" id="artistas">
        <h2 className="lvx-section-title">artistas</h2>
        <div className="lvx-artist-grid">
          {artists.map((a) => (
            <Link
              className="lvx-artist-card"
              key={a.handle}
              to={`/artistas/${a.handle}`}
              style={{ ['--artist-accent' as string]: a.accentColor }}
            >
              <img className="lvx-artist-icon" src={a.icon} alt="" />
              <span className="lvx-artist-name">{a.displayName}</span>
              <span className="lvx-artist-role">{a.discipline}</span>
              <span className="lvx-artist-go" aria-hidden="true">
                ver →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
