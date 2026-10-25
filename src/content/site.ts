export interface SocialLink {
  label: string;
  handle: string;
  url: string;
  icon: 'github' | 'instagram' | 'x' | 'mail';
}

export interface NavItem {
  id: string;
  label: string;
  path: string;
  description: string;
}

export const SITE = {
  basePath: '/tes11/',
  origin: 'https://lakshits27.github.io',
  productionUrl: 'https://lakshits27.github.io/tes11/',
  name: 'Lakshit Singh Saini',
  nickname: 'Lavi',
  brand: 'LAVI',
  role: 'Computer Science undergraduate and developer',
  email: 'lakshitsinghsaini@gmail.com',
  description:
    'Lakshit “Lavi” Singh Saini is a Computer Science undergraduate building thoughtful software across web, desktop, mobile, games, and creative experiments.',
  themeColor: '#080a12',
  locale: 'en_IN',
  verifiedDate: '2026-10-25',
} as const;

export const SOCIAL_LINKS: readonly SocialLink[] = [
  {
    label: 'GitHub',
    handle: '@hmmlavi',
    url: 'https://github.com/hmmlavi',
    icon: 'github',
  },
  {
    label: 'Instagram',
    handle: '@lakshitsinghsaini',
    url: 'https://www.instagram.com/lakshitsinghsaini/',
    icon: 'instagram',
  },
  {
    label: 'X',
    handle: '@Lakshits27',
    url: 'https://x.com/Lakshits27',
    icon: 'x',
  },
  {
    label: 'Email',
    handle: SITE.email,
    url: `mailto:${SITE.email}`,
    icon: 'mail',
  },
];

export const PRIMARY_NAV: readonly NavItem[] = [
  { id: 'home', label: 'Home', path: '', description: 'Start here' },
  { id: 'projects', label: 'Projects', path: 'projects/', description: 'Six public builds' },
  { id: 'playground', label: 'Playground', path: 'playground/', description: 'Interactive experiments' },
  { id: 'about', label: 'About', path: 'about/', description: 'The human behind the pixels' },
  { id: 'contact', label: 'Contact', path: 'contact/', description: 'Open a conversation' },
];

export const SECONDARY_NAV: readonly NavItem[] = [
  { id: 'now', label: 'Now', path: 'now/', description: 'Current public work' },
  { id: 'uses', label: 'Uses', path: 'uses/', description: 'Verified toolchain' },
];

function normalisePath(path: string): string {
  return path.replace(/^\/+/, '');
}

/** Absolute, base-aware href for every generated page and static asset. */
export function href(path = ''): string {
  return `${SITE.basePath}${normalisePath(path)}`;
}

/** Full production URL for canonical, Open Graph, sitemap, and structured data. */
export function canonical(path = ''): string {
  return new URL(normalisePath(path), SITE.productionUrl).toString();
}

export function asset(path: string): string {
  return href(`assets/${normalisePath(path)}`);
}

export function pageTitle(title: string): string {
  return title === 'Home'
    ? `${SITE.name} — ${SITE.brand} / Interactive Portfolio`
    : `${title} — ${SITE.name}`;
}

export function personJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE.name,
    alternateName: SITE.nickname,
    description: 'Computer Science undergraduate and developer.',
    url: SITE.productionUrl,
    email: `mailto:${SITE.email}`,
    sameAs: SOCIAL_LINKS.filter((link) => link.url.startsWith('https://')).map((link) => link.url),
    knowsAbout: [
      'Web development',
      'Python',
      'TypeScript',
      'Android development',
      'Creative coding',
      'Games',
      'Music',
      'Space',
    ],
  };
}
