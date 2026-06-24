import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DayMark, NightMark } from '../components/LumivoxLogo';
import { ThemeToggle } from '../components/ThemeToggle';
import { useTheme } from '../components/ThemeContext';
import { ArtistShowcase } from '../components/lumivox/ArtistShowcase';
import { RosterStrip } from '../components/lumivox/RosterStrip';
import { artists } from '../data/artists';
import './LumivoxHome.scss';

// Lumivox homepage — brand landing (day/night logo) with the artist roster
// embedded: pick an artist and see their card (socials + special buttons)
// without leaving the main page.

const tabIdFor = (handle: string) => `roster-tab-${handle}`;
const panelIdFor = (handle: string) => `showcase-${handle}`;

export function LumivoxHomePage() {
  const { theme } = useTheme();
  const [activeHandle, setActiveHandle] = useState<string>(artists[0]?.handle ?? '');
  const activeArtist = artists.find((a) => a.handle === activeHandle) ?? artists[0];

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

        <div className="lvx-actions">
          <ThemeToggle />
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
