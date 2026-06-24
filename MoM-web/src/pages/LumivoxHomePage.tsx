import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DayMark, NightMark, readTheme, THEME_KEY, type Theme } from '../components/LumivoxLogo';
import { ArtistShowcase } from '../components/lumivox/ArtistShowcase';
import { RosterStrip } from '../components/lumivox/RosterStrip';
import { artists } from '../data/artists';
import './LumivoxHome.scss';

// Lumivox homepage — brand landing (day/night logo) with the artist roster
// embedded: pick an artist and see their card (socials + special buttons)
// without leaving the main page.

const tabIdFor = (handle: string) => `roster-tab-${handle}`;
const panelIdFor = (handle: string) => `showcase-${handle}`;

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
  const [activeHandle, setActiveHandle] = useState<string>(artists[0]?.handle ?? '');
  const activeArtist = artists.find((a) => a.handle === activeHandle) ?? artists[0];

  useEffect(() => {
    setTheme(readTheme());
  }, []);

  const toggle = (): void =>
    setTheme((t) => {
      const next: Theme = t === 'night' ? 'day' : 'night';
      localStorage.setItem(THEME_KEY, next);
      return next;
    });

  const scrollToArtistas = (e: React.MouseEvent): void => {
    e.preventDefault();
    document.getElementById('artistas')?.scrollIntoView({ behavior: 'smooth' });
  };

  const night = theme === 'night';

  return (
    <div className="lumivox-site" data-theme={theme}>
      <header className="lvx-top">
        <Link className="lvx-brand" to="/home" aria-label="Lumivox — inicio">
          <div className="lvx-logo-mark markstack" aria-hidden="true">
            <DayMark />
            <NightMark />
          </div>
          <span className="lvx-word">lumivox</span>
        </Link>

        <nav className="lvx-nav">
          <a href="#artistas" onClick={scrollToArtistas}>
            obras
          </a>
          <a href="#artistas" onClick={scrollToArtistas}>
            artistas
          </a>
          <a href="#artistas" onClick={scrollToArtistas}>
            comunidad
          </a>
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
        {activeArtist && (
          <div className="lvx-roster">
            <RosterStrip
              artists={artists}
              activeHandle={activeArtist.handle}
              onSelect={setActiveHandle}
              tabIdFor={tabIdFor}
              panelIdFor={panelIdFor}
            />
            <ArtistShowcase
              artist={activeArtist}
              panelId={panelIdFor(activeArtist.handle)}
              labelledBy={tabIdFor(activeArtist.handle)}
            />
          </div>
        )}
      </section>
    </div>
  );
}
