import { PORTFOLIO_STACK, WORKING_WITH } from '../content/skills.ts';
import { SITE, href } from '../content/site.ts';
import { buttonLink, eyebrow, sectionHeading } from './components.ts';
import { icon } from './icons.ts';
import type { PageDefinition } from './page.ts';
import { escapeHtml, tags } from './utils.ts';

export function usesPage(): PageDefinition {
  const content = `<section class="page-hero page-hero--uses" aria-labelledby="page-title">
    ${eyebrow('Uses / verified toolchain')}
    <h1 id="page-title" data-reveal>Tools for the idea <span>in front of me.</span></h1>
    <p data-reveal>This is not a sponsored desk setup. It is a map of technologies visible in my public repositories, my GitHub profile, and the source of this portfolio.</p>
    <div class="uses-hero__glyph" aria-hidden="true" data-reveal>${icon('terminal')}<span>${icon('layers')}</span>${icon('code')}</div>
  </section>

  <section class="section section--uses" aria-labelledby="uses-title">
    ${sectionHeading('The working set', 'A stack with <span>receipts.</span>', 'Each group below is tied to a real source: README files, package manifests, build configs, or this repository.')}
    <div class="uses-grid">
      ${WORKING_WITH.map(
        (group, index) => `<article class="uses-card" data-reveal style="--delay:${index * 60}ms;--uses-accent:${
          ['#d7ff65', '#61e7ff', '#ff78b7', '#b69bff'][index % 4]
        }">
          <div class="uses-card__head"><span>0${index + 1}</span>${icon(index % 2 === 0 ? 'layers' : 'terminal')}</div>
          <h3>${escapeHtml(group.label)}</h3>
          ${tags(group.items, 'tags tags--large')}
          <p>${escapeHtml(group.note)}</p>
        </article>`,
      ).join('')}
    </div>
  </section>

  <section class="section section--portfolio-stack" aria-labelledby="portfolio-stack-title">
    <div class="portfolio-stack">
      <div class="portfolio-stack__copy" data-reveal>
        ${eyebrow('This website')}
        <h2 id="portfolio-stack-title">Small stack. <span>Big personality.</span></h2>
        <p>The portfolio is pre-rendered HTML generated from typed content, styled with a custom CSS design system, and enhanced with focused TypeScript modules. There is no client-side framework, backend, analytics service, or tracking script.</p>
        ${tags(PORTFOLIO_STACK, 'tags tags--large')}
        <div class="portfolio-stack__note">${icon('spark')}<span>Verified ${escapeHtml(SITE.verifiedDate)} from this repository’s package manifest and source files.</span></div>
      </div>
      <div class="portfolio-stack__art" aria-hidden="true" data-reveal>
        <div class="stack-ring stack-ring--one"></div>
        <div class="stack-ring stack-ring--two"></div>
        <div class="stack-ring stack-ring--three"></div>
        <span class="stack-node stack-node--one">TS</span>
        <span class="stack-node stack-node--two">CSS</span>
        <span class="stack-node stack-node--three">SVG</span>
        <span class="stack-node stack-node--four">JS</span>
        <span class="stack-core">${icon('spark')}</span>
      </div>
    </div>
  </section>

  <section class="uses-outro" aria-labelledby="outro-title" data-reveal>
    <div>
      ${eyebrow('Sources, not guesses')}
      <h2 id="outro-title">Want the evidence?</h2>
      <p>Every project detail page lists the README, manifest, release, and source files used to verify its stack.</p>
    </div>
    <div>
      ${buttonLink({ label: 'Browse projects', url: href('projects/'), variant: 'primary' })}
      ${buttonLink({ label: 'Read the README', url: 'https://github.com/lakshits27/tes11', variant: 'ghost', iconName: 'github', external: true })}
    </div>
  </section>`;

  return {
    content,
    title: 'Uses',
    description:
      'A verified map of tools and technologies used across Lakshit Singh Saini’s public projects and this portfolio, sourced from real manifests and README files.',
    pageId: 'uses',
    activeNav: 'uses',
    path: 'uses/',
  };
}
