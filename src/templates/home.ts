import { PROJECTS } from '../content/projects.ts';
import { INTERESTS } from '../content/interests.ts';
import { SITE, href } from '../content/site.ts';
import { avatarImage, buttonLink, eyebrow, projectCard, sectionHeading, socialRow } from './components.ts';
import { icon } from './icons.ts';
import type { PageDefinition } from './page.ts';
import { escapeHtml, dateLabel } from './utils.ts';

const marqueeItems = [
  'SOFTWARE',
  'SPACE',
  'MUSIC',
  'GAMES',
  'FUTURISTIC TECH',
  'CREATIVE CODE',
  'WILD IDEAS',
];

function interestTile(interest: (typeof INTERESTS)[number], index: number): string {
  return `<article class="interest-tile interest-tile--${index + 1}" style="--tile-accent:${interest.color};--tile-ink:${interest.ink}" data-interest="${interest.id}" data-reveal>
    <span class="interest-tile__icon">${icon(interest.icon)}</span>
    <h3>${escapeHtml(interest.label)}</h3>
    <p>${escapeHtml(interest.short)}</p>
    <span class="interest-tile__number">0${index + 1}</span>
  </article>`;
}

export function homePage(): PageDefinition {
  const featured = PROJECTS.filter((project) => project.featured).slice(0, 3);
  const content = `<section class="hero" aria-labelledby="hero-title">
    <div class="hero__background" aria-hidden="true">
      <span class="hero__grid"></span>
      <span class="hero__aurora hero__aurora--one"></span>
      <span class="hero__aurora hero__aurora--two"></span>
      <span class="hero__noise"></span>
    </div>
    <div class="hero__inner">
      <div class="hero__copy">
        ${eyebrow('Lakshit Singh Saini / also known as Lavi')}
        <h1 id="hero-title" class="hero__title" data-reveal style="--delay:60ms">
          <span>Curious by</span>
          <span>default.</span>
          <em>Built to make.</em>
        </h1>
        <p class="hero__lead" data-reveal style="--delay:140ms">
          I’m a Computer Science undergraduate who likes turning “what if?” into something you can click, install, play, or break in a useful way.
        </p>
        <div class="hero__actions" data-reveal style="--delay:220ms">
          ${buttonLink({ label: 'Explore the projects', url: href('projects/'), variant: 'primary' })}
          ${buttonLink({ label: 'About the human', url: href('about/'), variant: 'ghost', iconName: 'arrow-right' })}
        </div>
        <div class="hero__meta" data-reveal style="--delay:300ms">
          <span><i aria-hidden="true"></i> CS undergraduate</span>
          <span><i aria-hidden="true"></i> Builder across platforms</span>
          <span><i aria-hidden="true"></i> Open to collaborations</span>
        </div>
        ${socialRow('hero__socials')}
      </div>
      <div class="hero__art" data-reveal style="--delay:180ms">
        <div class="hero__halo" aria-hidden="true"></div>
        <div class="hero__ring hero__ring--one" aria-hidden="true"><i></i><i></i><i></i></div>
        <div class="hero__ring hero__ring--two" aria-hidden="true"><i></i><i></i></div>
        <div class="hero__ring hero__ring--three" aria-hidden="true"></div>
        <div class="hero__portrait">
          <div class="hero__portrait-glow" aria-hidden="true"></div>
          ${avatarImage()}
          <span class="hero__portrait-ring" aria-hidden="true"></span>
        </div>
        <div class="hero__float hero__float--top" aria-hidden="true">
          <span class="hero__float-dot"></span>
          <div><small>CURRENT MODE</small><strong>Building & learning</strong></div>
        </div>
        <div class="hero__float hero__float--bottom" aria-hidden="true">
          ${icon('spark')}
          <div><small>SIGNAL</small><strong>Spectral thinking</strong></div>
        </div>
        <span class="hero__spark hero__spark--one" aria-hidden="true">✦</span>
        <span class="hero__spark hero__spark--two" aria-hidden="true">✳</span>
        <span class="hero__spark hero__spark--three" aria-hidden="true">✦</span>
      </div>
    </div>
    <a class="hero__scroll" href="#featured"><span>Scroll to the work</span>${icon('arrow-right')}</a>
  </section>

  <div class="marquee">
    <span class="sr-only">Interests: software, space, music, games, futuristic technology, creative code, and wild ideas.</span>
    <div class="marquee__track" aria-hidden="true">
      ${[...marqueeItems, ...marqueeItems]
        .map((item) => `<span>${escapeHtml(item)}</span><i>✦</i>`)
        .join('')}
    </div>
  </div>

  <section class="section section--featured" id="featured" aria-labelledby="featured-title">
    <div class="section-head section-head--split">
      ${sectionHeading('01 / Selected work', 'Ideas with a working <span>trail of evidence.</span>', 'Six public projects, each with its own story, verified stack, and real repository. Here are three places to start.')}
      <a class="text-link" href="${href('projects/')}">All projects ${icon('arrow-up-right')}</a>
    </div>
    <div class="featured-grid">
      ${featured.map((project) => projectCard(project, PROJECTS.indexOf(project), true)).join('')}
    </div>
    <div class="section-footnote" data-reveal>
      <span>Verified ${dateLabel(SITE.verifiedDate)} against public READMEs, manifests, and releases.</span>
      ${buttonLink({ label: 'Open the project shelf', url: href('projects/'), variant: 'secondary', iconName: 'arrow-right' })}
    </div>
  </section>

  <section class="section section--interests" aria-labelledby="interests-title">
    <div class="section-head section-head--split">
      ${sectionHeading('02 / The whole human', 'Many tabs open. <span>All of them interesting.</span>', 'Technology is the toolkit, not the whole personality. These are the worlds that keep my curiosity fed.')}
      <a class="text-link" href="${href('about/')}">More about me ${icon('arrow-up-right')}</a>
    </div>
    <div class="interest-bento">
      ${INTERESTS.slice(0, 5).map(interestTile).join('')}
      <a class="interest-tile interest-tile--cta" href="${href('playground/')}" data-reveal>
        <span class="interest-tile__icon">${icon('prism')}</span>
        <h3>Try the playground</h3>
        <p>Two interactive visual experiments built for this portfolio.</p>
        <span class="interest-tile__arrow">${icon('arrow-up-right')}</span>
      </a>
    </div>
  </section>

  <section class="section section--manifesto" aria-labelledby="manifesto-title">
    <div class="manifesto-grid">
      <div class="manifesto-art" aria-hidden="true" data-reveal>
        <span class="manifesto-art__ring"></span>
        <span class="manifesto-art__ring"></span>
        <span class="manifesto-art__ring"></span>
        <span class="manifesto-art__core">${icon('spark')}</span>
      </div>
      <div class="manifesto-copy" data-reveal>
        ${eyebrow('03 / How I think')}
        <h2 id="manifesto-title">I’d rather build a small truth than polish a big assumption.</h2>
        <p>My favourite projects begin with a real question: can a risky file rename feel safe, can habit tracking stay private, can a familiar game feel alive again? I learn by making a first version, reading the edges, and improving the rough parts.</p>
        <div class="manifesto-actions">
          ${buttonLink({ label: 'Read my approach', url: href('about/'), variant: 'secondary', iconName: 'arrow-right' })}
          ${buttonLink({ label: 'See what’s current', url: href('now/'), variant: 'ghost', iconName: 'arrow-up-right' })}
        </div>
      </div>
    </div>
  </section>

  <section class="cta-band" aria-labelledby="cta-title">
    <div class="cta-band__glow" aria-hidden="true"></div>
    <div class="cta-band__copy" data-reveal>
      ${eyebrow('04 / Open channel')}
      <h2 id="cta-title">Have a good idea?<br><span>Let’s make it real.</span></h2>
      <p>Collaborations, internships, interesting problems, or a conversation about games and the universe — my inbox is open.</p>
    </div>
    <div class="cta-band__actions" data-reveal>
      ${buttonLink({ label: 'Start a conversation', url: href('contact/'), variant: 'dark', iconName: 'mail' })}
      <a class="cta-band__email" href="mailto:${SITE.email}">${SITE.email}</a>
    </div>
    <span class="cta-band__glyph" aria-hidden="true">✦</span>
  </section>`;

  return {
    content,
    title: 'Home',
    description: SITE.description,
    pageId: 'home',
    activeNav: 'home',
    path: '',
    preloadAvatar: true,
  };
}
