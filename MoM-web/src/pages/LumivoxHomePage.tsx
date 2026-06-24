import { useState } from 'react';
import { ArtistShowcase } from '../components/lumivox/ArtistShowcase';
import { LumivoxMark } from '../components/lumivox/LumivoxMark';
import { RosterStrip } from '../components/lumivox/RosterStrip';
import { artists } from '../data/artists';

const tabIdFor = (handle: string) => `roster-tab-${handle}`;
const panelIdFor = (handle: string) => `showcase-${handle}`;

export function LumivoxHomePage() {
  const [activeHandle, setActiveHandle] = useState<string>(artists[0]?.handle ?? '');
  const activeArtist = artists.find((a) => a.handle === activeHandle) ?? artists[0];

  if (!activeArtist) {
    return (
      <div className="lumivox-shell">
        <div className="lumivox-topbar">
          <LumivoxMark />
        </div>
        <p style={{ padding: '2rem', textAlign: 'center' }}>Roster vacío.</p>
      </div>
    );
  }

  return (
    <div className="lumivox-shell">
      <div className="lumivox-topbar">
        <LumivoxMark />
        <span className="lumivox-tagline-top">
          comunidad de artistas y creadores
        </span>
      </div>

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
    </div>
  );
}
