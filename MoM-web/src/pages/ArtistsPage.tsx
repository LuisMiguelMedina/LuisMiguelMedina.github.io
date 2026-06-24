import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArtistShowcase } from '../components/lumivox/ArtistShowcase';
import { LumivoxMark } from '../components/lumivox/LumivoxMark';
import { RosterStrip } from '../components/lumivox/RosterStrip';
import { LanguageToggle } from '../components/LanguageToggle';
import { useLang } from '../i18n';
import { artists } from '../data/artists';

// Artist roster: pick an artist and see their full card (socials + special
// buttons). Optional /:handle pre-selects an artist (used by the home cards).
const tabIdFor = (handle: string) => `roster-tab-${handle}`;
const panelIdFor = (handle: string) => `showcase-${handle}`;

export function ArtistsPage() {
  const { t } = useLang();
  const { handle } = useParams();
  const initial = artists.find((a) => a.handle === handle)?.handle ?? artists[0]?.handle ?? '';
  const [activeHandle, setActiveHandle] = useState<string>(initial);
  const activeArtist = artists.find((a) => a.handle === activeHandle) ?? artists[0];

  return (
    <div className="lumivox-shell">
      <div className="lumivox-topbar">
        <div className="lumivox-topbar-left">
          <Link className="lumivox-back" to="/home">
            ← {t('artists.back')}
          </Link>
          <LumivoxMark />
          <LanguageToggle />
        </div>
        <span className="lumivox-tagline-top">{t('artists.tagline')}</span>
      </div>

      {activeArtist ? (
        <>
          <ArtistShowcase
            artist={activeArtist}
            panelId={panelIdFor(activeArtist.handle)}
            labelledBy={tabIdFor(activeArtist.handle)}
          />
          <RosterStrip
            artists={artists}
            activeHandle={activeArtist.handle}
            onSelect={setActiveHandle}
            tabIdFor={tabIdFor}
            panelIdFor={panelIdFor}
          />
        </>
      ) : (
        <p style={{ padding: '2rem', textAlign: 'center' }}>Roster vacío.</p>
      )}
    </div>
  );
}
