import type { SocialEntry, SocialPlatform } from '../../../data/artists';

const PLATFORM_LABELS: Record<SocialPlatform, string> = {
  twitter: 'Twitter',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  twitch: 'Twitch',
  behance: 'Behance',
  artstation: 'ArtStation',
  bandcamp: 'Bandcamp',
  spotify: 'Spotify',
  linkedin: 'LinkedIn',
  discord: 'Discord',
  github: 'GitHub',
  other: 'Link',
};

type SocialsModuleProps = {
  entries: SocialEntry[];
};

export function SocialsModule({ entries }: SocialsModuleProps) {
  if (entries.length === 0) return null;

  return (
    <div className="luvinox-socials" role="list">
      {entries.map((entry) => {
        const label = entry.label ?? PLATFORM_LABELS[entry.platform];
        return (
          <a
            key={`${entry.platform}-${entry.url}`}
            className="luvinox-social"
            href={entry.url}
            target="_blank"
            rel="noopener noreferrer"
            role="listitem"
          >
            <span>{label}</span>
            <span className="luvinox-social-arrow" aria-hidden="true">
              ↗
            </span>
          </a>
        );
      })}
    </div>
  );
}
