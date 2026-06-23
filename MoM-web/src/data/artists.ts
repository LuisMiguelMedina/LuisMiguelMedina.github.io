export type SocialPlatform =
  | 'twitter'
  | 'instagram'
  | 'tiktok'
  | 'youtube'
  | 'twitch'
  | 'behance'
  | 'artstation'
  | 'bandcamp'
  | 'spotify'
  | 'linkedin'
  | 'discord'
  | 'github'
  | 'other';

export type SocialEntry = {
  platform: SocialPlatform;
  url: string;
  label?: string;
};

export type ArtistModule =
  | { kind: 'brief'; body: string }
  | { kind: 'socials'; entries: SocialEntry[] }
  | { kind: 'website'; url: string; label?: string }
  | { kind: 'portal'; label: string; route: string };

export type Artist = {
  handle: string;
  displayName: string;
  tagline: string;
  discipline: string;
  bio: string;
  splash: string;
  icon: string;
  accentColor: string;
  modules: ArtistModule[];
};

export const artists: Artist[] = [
  {
    handle: 'luis-m',
    // TODO confirm with Luis.M
    displayName: 'Luis.M',
    tagline: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
    discipline: 'Lorem Ipsum · Dolor Sit',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
    splash: '/lumivox-media/luis-m.svg',
    icon: '/lumivox-media/luis-m.svg',
    accentColor: '#3B5673',
    modules: [
      {
        kind: 'brief',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      },
      {
        kind: 'socials',
        // TODO confirm with Luis.M — placeholders
        entries: [
          { platform: 'github', url: 'https://github.com/LuisMiguelMedina' },
        ],
      },
      {
        kind: 'portal',
        label: 'Multiverse Of Madness',
        route: '/home/luis-m/multiverse-of-madness',
      },
    ],
  },
  {
    handle: 'joz',
    // TODO confirm with Joz
    displayName: 'Joz',
    tagline: 'Lorem ipsum dolor sit amet, consectetur',
    discipline: 'Lorem Ipsum Dolor',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.',
    splash: '/lumivox-media/joz.svg',
    icon: '/lumivox-media/joz.svg',
    accentColor: '#D17865',
    modules: [
      {
        kind: 'brief',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.',
      },
      {
        kind: 'socials',
        // TODO confirm with Joz — placeholders
        entries: [
          { platform: 'twitter', url: 'https://twitter.com/joz' },
          { platform: 'instagram', url: 'https://instagram.com/joz' },
        ],
      },
      // TODO confirm with Joz — placeholder website URL
      { kind: 'website', url: 'https://joz.example', label: 'Portfolio' },
    ],
  },
];
