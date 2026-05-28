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
    tagline: 'Tejedor de mundos en la mesa, arquitecto en el código',
    discipline: 'Tabletop Narrator · Developer',
    bio: 'Construye mundos para juegos de mesa y los lugares donde habitan. Lleva las mismas manos a la narración de partidas y a la implementación de los sistemas que las sostienen.',
    splash: '/luvinox-media/luis-m.svg',
    icon: '/luvinox-media/luis-m.svg',
    accentColor: '#3B5673',
    modules: [
      {
        kind: 'brief',
        body: 'Presencia técnica del colectivo. No abierto a sponsors — su sitio expone su mundo personal, Multiverse Of Madness.',
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
        route: '/multiverse-of-madness',
      },
    ],
  },
  {
    handle: 'joz',
    // TODO confirm with Joz
    displayName: 'Joz',
    tagline: 'Ilustradora freelance, paleta cálida con filo',
    discipline: 'Freelance Illustrator',
    bio: 'Trabaja por encargo: personajes, retratos y referencias. Su catálogo de servicios y precios vive abajo — arma tu cotización y le llega directo.',
    splash: '/luvinox-media/joz.svg',
    icon: '/luvinox-media/joz.svg',
    accentColor: '#D17865',
    modules: [
      {
        kind: 'brief',
        body: 'Abierta a comisiones. Construye tu cotización en la sección de abajo y le llega por correo.',
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
