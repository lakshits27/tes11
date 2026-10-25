import { href } from '../content/site.ts';
import { buttonLink, eyebrow } from './components.ts';
import { icon } from './icons.ts';
import type { PageDefinition } from './page.ts';

export function notFoundPage(): PageDefinition {
  const content = `<section class="not-found" aria-labelledby="page-title">
    <div class="not-found__art" aria-hidden="true">
      <span class="not-found__ring"></span>
      <span class="not-found__ring"></span>
      <span class="not-found__ring"></span>
      <span class="not-found__core">404</span>
      <i class="not-found__spark not-found__spark--one">✦</i>
      <i class="not-found__spark not-found__spark--two">✳</i>
      <i class="not-found__spark not-found__spark--three">✦</i>
    </div>
    <div class="not-found__copy">
      ${eyebrow('Signal lost / 404')}
      <h1 id="page-title">This page took <span>a wrong turn.</span></h1>
      <p>The link may be old, or the route may never have existed. The rest of the portfolio is still exactly where you left it.</p>
      <div class="not-found__actions">
        ${buttonLink({ label: 'Return home', url: href(), variant: 'primary', iconName: 'arrow-left' })}
        ${buttonLink({ label: 'Browse projects', url: href('projects/'), variant: 'secondary' })}
        ${buttonLink({ label: 'Playground', url: href('playground/'), variant: 'ghost', iconName: 'prism' })}
      </div>
      <a class="text-link" href="${href('sitemap.xml')}">View the sitemap ${icon('arrow-up-right')}</a>
    </div>
  </section>`;

  return {
    content,
    title: 'Page not found',
    description: 'The requested page could not be found. Return to the home page, browse projects, or explore the playground.',
    pageId: 'not-found',
    activeNav: '',
    path: '404.html',
    noindex: true,
  };
}
