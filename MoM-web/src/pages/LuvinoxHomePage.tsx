import { useState } from 'react';
import { ArtistShowcase } from '../components/luvinox/ArtistShowcase';
import { LuvinoxMark } from '../components/luvinox/LuvinoxMark';
import { RosterStrip } from '../components/luvinox/RosterStrip';
import { artists } from '../data/artists';

const tabIdFor = (handle: string) => `roster-tab-${handle}`;
const panelIdFor = (handle: string) => `showcase-${handle}`;

export function LuvinoxHomePage() {
  const [activeHandle, setActiveHandle] = useState<string>(artists[0]?.handle ?? '');
  const activeArtist = artists.find((a) => a.handle === activeHandle) ?? artists[0];

  if (!activeArtist) {
    return (
      <div className="luvinox-shell">
        <div className="luvinox-topbar">
          <LuvinoxMark asLink={false} />
        </div>
        <p style={{ padding: '2rem', textAlign: 'center' }}>Roster vacío.</p>
      </div>
    );
  }

  return (
    <div className="luvinox-shell">
      <div className="luvinox-topbar">
        <LuvinoxMark asLink={false} />
        <span className="luvinox-tagline-top">
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
