import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { artists, type Artist } from '../data/artists';
import './LumivoxHome.scss';

// Where an artist card points: its portal route if any, else its website.
function artistLink(a: Artist): { to: string; external: boolean } | null {
  const portal = a.modules.find((m) => m.kind === 'portal');
  if (portal?.kind === 'portal') return { to: portal.route, external: false };
  const web = a.modules.find((m) => m.kind === 'website');
  if (web?.kind === 'website') return { to: web.url, external: true };
  return null;
}

// Lumivox homepage — brand landing with a day/night logo (radiant sun ↔ "V"
// monogram). Implements the "Lumivox — Guía de construcción" brand spec.

type Theme = 'day' | 'night';
const THEME_KEY = 'lumivox-theme';

// Sun rays: 30° apart; outer ring deep red, inner ring coral. (From the guide.)
const RAYS = [
  { x1: 65, y1: 50, x2: 84, y2: 50, c: '#8D3E2E' },
  { x1: 57.5, y1: 62.99, x2: 67, y2: 79.44, c: '#8D3E2E' },
  { x1: 42.5, y1: 62.99, x2: 33, y2: 79.44, c: '#8D3E2E' },
  { x1: 35, y1: 50, x2: 16, y2: 50, c: '#8D3E2E' },
  { x1: 42.5, y1: 37.01, x2: 33, y2: 20.56, c: '#8D3E2E' },
  { x1: 57.5, y1: 37.01, x2: 67, y2: 20.56, c: '#8D3E2E' },
  { x1: 62.99, y1: 57.5, x2: 79.44, y2: 67, c: '#E07A6F' },
  { x1: 50, y1: 65, x2: 50, y2: 84, c: '#E07A6F' },
  { x1: 37.01, y1: 57.5, x2: 20.56, y2: 67, c: '#E07A6F' },
  { x1: 37.01, y1: 42.5, x2: 20.56, y2: 33, c: '#E07A6F' },
  { x1: 50, y1: 35, x2: 50, y2: 16, c: '#E07A6F' },
  { x1: 62.99, y1: 42.5, x2: 79.44, y2: 33, c: '#E07A6F' },
];

const STARS = [
  { cx: 20, cy: 22, r: 1.6, o: 0.7 },
  { cx: 82, cy: 28, r: 2, o: 0.75 },
  { cx: 76, cy: 74, r: 1.5, o: 0.6 },
  { cx: 24, cy: 68, r: 1.4, o: 0.6 },
];

function DayMark() {
  return (
    <svg className="mark-day" viewBox="0 0 100 100" aria-hidden="true">
      <g className="rays" strokeLinecap="round" strokeWidth="5" fill="none">
        {RAYS.map((r, i) => (
          <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} stroke={r.c} />
        ))}
      </g>
      <rect x="40" y="40" width="20" height="20" rx="6" fill="#E5A63B" />
      <circle cx="50" cy="50" r="4" fill="#FFE500" />
    </svg>
  );
}

function NightMark({ stars = false }: { stars?: boolean }) {
  return (
    <svg className="mark-night" viewBox="0 0 100 100" aria-hidden="true">
      {stars &&
        STARS.map((s, i) => (
          <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="#F4EFE6" opacity={s.o} />
        ))}
      <path
        d="M30 30 L50 78 L70 30"
        fill="none"
        stroke="#FFE500"
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle className="dot" cx="50" cy="34" r="8" fill="#FF007F" />
    </svg>
  );
}

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
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'day' || saved === 'night') {
      setTheme(saved);
    } else if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
      setTheme('night');
    }
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
          <a href="#obras">obras</a>
          <a href="#artistas">artistas</a>
          <a href="#comunidad">comunidad</a>
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
          <button className="lvx-cta" type="button">
            unirse
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
          <p>
            Una comunidad para artistas independientes. Muestra tu obra, encuentra a tu gente,
            deja que tu voz brille.
          </p>
          <a className="lvx-cta lvx-cta-lg" href="#artistas">
            explorar obras
          </a>
        </div>

        <div className="lvx-hero-mark markstack" aria-hidden="true">
          <DayMark />
          <NightMark stars />
        </div>
      </section>

      <section className="lvx-artists" id="artistas">
        <h2 className="lvx-section-title">artistas</h2>
        <div className="lvx-artist-grid">
          {artists.map((a) => {
            const link = artistLink(a);
            const style = { ['--artist-accent' as string]: a.accentColor };
            const inner = (
              <>
                <img className="lvx-artist-icon" src={a.icon} alt="" />
                <span className="lvx-artist-name">{a.displayName}</span>
                <span className="lvx-artist-role">{a.discipline}</span>
                <span className="lvx-artist-go" aria-hidden="true">
                  ver →
                </span>
              </>
            );
            if (!link) {
              return (
                <div className="lvx-artist-card" key={a.handle} style={style}>
                  {inner}
                </div>
              );
            }
            return link.external ? (
              <a
                className="lvx-artist-card"
                key={a.handle}
                href={link.to}
                target="_blank"
                rel="noreferrer"
                style={style}
              >
                {inner}
              </a>
            ) : (
              <Link className="lvx-artist-card" key={a.handle} to={link.to} style={style}>
                {inner}
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
