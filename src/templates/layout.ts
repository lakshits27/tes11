import {
  PRIMARY_NAV,
  SECONDARY_NAV,
  SITE,
  SOCIAL_LINKS,
  asset,
  canonical,
  href,
  pageTitle,
  personJsonLd,
} from '../content/site.ts';
import { icon, wordmarkGlyph } from './icons.ts';
import { escapeHtml, jsonLd } from './utils.ts';

export interface LayoutOptions {
  title: string;
  description: string;
  pageId: string;
  activeNav: string;
  path: string;
  bodyClass?: string;
  bodyStyle?: string;
  dataProject?: string;
  ogImage?: string;
  ogImageAlt?: string;
  preloadAvatar?: boolean;
  noindex?: boolean;
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
}

function navLink(item: (typeof PRIMARY_NAV)[number], activeNav: string, mobile = false): string {
  const active = item.id === activeNav;
  return `<a class="${mobile ? 'mobile-menu__link' : 'desktop-nav__link'}${
    active ? ' is-active' : ''
  }" href="${href(item.path)}"${active ? ' aria-current="page"' : ''}><span>${escapeHtml(item.label)}</span>${
    active ? '<i aria-hidden="true"></i>' : ''
  }</a>`;
}

function header(activeNav: string): string {
  return `<header class="site-header" id="top">
    <div class="nav-shell">
      <a class="wordmark" href="${href()}" aria-label="LAVI. — ${escapeHtml(SITE.name)}, home">
        <span class="wordmark__glyph">${wordmarkGlyph()}</span>
        <span class="wordmark__text">${SITE.brand}<span class="wordmark__dot">.</span></span>
      </a>
      <nav class="desktop-nav" aria-label="Primary navigation">
        ${PRIMARY_NAV.map((item) => navLink(item, activeNav)).join('')}
      </nav>
      <div class="nav-actions">
        <a class="nav-cta" href="${href('contact/')}"><span>Let’s talk</span>${icon('arrow-up-right')}</a>
        <button class="menu-toggle" type="button" data-menu-toggle aria-controls="mobile-menu" aria-expanded="false" aria-label="Open navigation menu">
          <span class="menu-toggle__bars" aria-hidden="true"><i></i><i></i></span>
          <span class="sr-only">Menu</span>
        </button>
      </div>
    </div>
    <div class="mobile-menu" id="mobile-menu" data-menu-panel hidden>
      <nav class="mobile-menu__nav" aria-label="Mobile navigation">
        ${PRIMARY_NAV.map((item) => navLink(item, activeNav, true)).join('')}
        <div class="mobile-menu__divider" aria-hidden="true"></div>
        ${SECONDARY_NAV.map((item) => navLink(item, activeNav, true)).join('')}
      </nav>
      <div class="mobile-menu__footer">
        <a href="mailto:${SITE.email}">${icon('mail')}<span>${SITE.email}</span></a>
        <div class="mobile-menu__socials">
          ${SOCIAL_LINKS.filter((social) => social.url.startsWith('https://'))
            .map(
              (social) =>
                `<a href="${social.url}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(
                  social.label,
                )}">${icon(social.icon)}</a>`,
            )
            .join('')}
        </div>
      </div>
    </div>
  </header>`;
}

function footer(): string {
  const year = new Date().getFullYear();
  const allNav = [...PRIMARY_NAV, ...SECONDARY_NAV];
  return `<footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <a class="wordmark wordmark--footer" href="${href()}" aria-label="LAVI. — ${escapeHtml(SITE.name)}, home">
          <span class="wordmark__glyph">${wordmarkGlyph()}</span>
          <span class="wordmark__text">${SITE.brand}<span class="wordmark__dot">.</span></span>
        </a>
        <p>Curious builder, multidisciplinary developer, and collector of interesting questions.</p>
        <p class="footer-status"><span aria-hidden="true"></span> Open to internships & collaborations</p>
      </div>
      <nav class="footer-nav" aria-label="Footer navigation">
        <span class="footer-label">Explore</span>
        ${allNav
          .map(
            (item) =>
              `<a href="${href(item.path)}">${escapeHtml(item.label)}<small>${escapeHtml(item.description)}</small></a>`,
          )
          .join('')}
      </nav>
      <div class="footer-connect">
        <span class="footer-label">Find me</span>
        ${SOCIAL_LINKS.map(
          (social) =>
            `<a href="${social.url}"${
              social.url.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : ''
            }>${icon(social.icon)}<span>${escapeHtml(social.label)}</span>${icon('arrow-up-right')}</a>`,
        ).join('')}
      </div>
    </div>
    <div class="footer-bottom">
      <span>© ${year} ${escapeHtml(SITE.name)}</span>
      <span>Made with ${icon('spark')} TypeScript, Canvas & care</span>
      <a href="#top">Back to top ${icon('arrow-up-right')}</a>
    </div>
  </footer>`;
}

export function layout(content: string, options: LayoutOptions): string {
  const title = pageTitle(options.title);
  const url = canonical(options.path);
  const ogImage = options.ogImage ?? canonical('og-image.png');
  const ogImageAlt = options.ogImageAlt ?? `${SITE.name} — spectral portfolio preview`;
  const structured = [personJsonLd(), ...(Array.isArray(options.structuredData) ? options.structuredData : options.structuredData ? [options.structuredData] : [])];
  const bodyStyle = options.bodyStyle ? ` style="${escapeHtml(options.bodyStyle)}"` : '';
  const dataProject = options.dataProject ? ` data-project="${escapeHtml(options.dataProject)}"` : '';
  const robots = options.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large';
  const routeSegments = options.path.endsWith('.html') ? 0 : options.path.split('/').filter(Boolean).length;
  const scriptSrc = `${'../'.repeat(routeSegments)}src/scripts/main.ts`;

  return `<!doctype html>
<html lang="en" data-base="${SITE.basePath}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="dark">
  <meta name="theme-color" content="${SITE.themeColor}">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(options.description)}">
  <meta name="robots" content="${robots}">
  ${options.noindex ? '' : `<link rel="canonical" href="${url}">`}
  <meta property="og:site_name" content="${escapeHtml(SITE.name)}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(options.description)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${url}">
  <meta property="og:locale" content="${SITE.locale}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:image:alt" content="${escapeHtml(ogImageAlt)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(options.description)}">
  <meta name="twitter:image" content="${ogImage}">
  <meta name="twitter:creator" content="@Lakshits27">
  <link rel="icon" type="image/svg+xml" href="${href('favicon.svg')}">
  <link rel="apple-touch-icon" href="${href('favicon-192.png')}">
  <link rel="manifest" href="${href('manifest.webmanifest')}">
  ${options.preloadAvatar ? `<link rel="preload" as="image" type="image/webp" href="${asset('avatar/lakshit-avatar.webp')}">` : ''}
  <script>document.documentElement.classList.add('js');</script>
  <script type="application/ld+json">${jsonLd(structured)}</script>
</head>
<body class="page page--${escapeHtml(options.pageId)}${options.bodyClass ? ` ${escapeHtml(options.bodyClass)}` : ''}" data-page="${escapeHtml(
    options.pageId,
  )}"${dataProject}${bodyStyle}>
  <a class="skip-link" href="#main">Skip to content</a>
  <div class="page-wipe" aria-hidden="true"></div>
  <canvas id="spectral-trail" aria-hidden="true"></canvas>
  <noscript><div class="noscript-note">This site works without JavaScript; animations and playground controls are enhanced when JavaScript is available.</div></noscript>
  ${header(options.activeNav)}
  <main id="main" class="page-main" tabindex="-1">
${content}
  </main>
  ${footer()}
  <script type="module" src="${scriptSrc}"></script>
</body>
</html>`;
}
