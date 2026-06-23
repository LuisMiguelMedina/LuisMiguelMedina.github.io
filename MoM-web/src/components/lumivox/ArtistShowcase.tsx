import type { Artist, ArtistModule } from '../../data/artists';
import { BriefModule } from './modules/BriefModule';
import { PortalModule } from './modules/PortalModule';
import { SocialsModule } from './modules/SocialsModule';
import { WebsiteModule } from './modules/WebsiteModule';

type ArtistShowcaseProps = {
  artist: Artist;
  panelId: string;
  labelledBy: string;
};

export function ArtistShowcase({ artist, panelId, labelledBy }: ArtistShowcaseProps) {
  const briefModule = artist.modules.find(
    (m): m is Extract<ArtistModule, { kind: 'brief' }> => m.kind === 'brief',
  );
  const otherModules = artist.modules.filter((m) => m.kind !== 'brief');

  return (
    <section
      className="lumivox-stage"
      role="tabpanel"
      id={panelId}
      aria-labelledby={labelledBy}
      style={{ ['--accent-color' as string]: artist.accentColor }}
    >
      <div className="lumivox-splash">
        <img src={artist.splash} alt={`${artist.displayName} — splash art`} loading="lazy" />
      </div>

      <div className="lumivox-identity">
        <span className="lumivox-discipline">{artist.discipline}</span>
        <h1 className="lumivox-display-name" id={labelledBy}>
          {artist.displayName}
        </h1>
        <p className="lumivox-tagline">{artist.tagline}</p>
        <p className="lumivox-brief">{artist.bio}</p>

        {briefModule ? <BriefModule body={briefModule.body} /> : null}

        <div className="lumivox-module-stack">
          {otherModules.map((module, idx) => (
            <ModuleRenderer key={moduleKey(module, idx)} module={module} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ModuleRenderer({ module }: { module: ArtistModule }) {
  switch (module.kind) {
    case 'brief':
      // Brief is rendered ahead of the stack — skip here to avoid double-render.
      return null;
    case 'socials':
      return <SocialsModule entries={module.entries} />;
    case 'website':
      return <WebsiteModule url={module.url} label={module.label} />;
    case 'portal':
      return <PortalModule label={module.label} route={module.route} />;
    default: {
      // Exhaustiveness: future module kinds added via the union will surface here.
      const _exhaustive: never = module;
      return _exhaustive;
    }
  }
}

function moduleKey(module: ArtistModule, idx: number): string {
  switch (module.kind) {
    case 'brief':
      return `brief-${idx}`;
    case 'socials':
      return `socials-${idx}`;
    case 'website':
      return `website-${module.url}`;
    case 'portal':
      return `portal-${module.route}`;
  }
}
