import { INTERESTS } from '../content/interests.ts';
import { EXPLORING, PORTFOLIO_STACK, WORKING_WITH } from '../content/skills.ts';
import { SITE, href } from '../content/site.ts';
import { avatarImage, buttonLink, eyebrow, sectionHeading, socialRow } from './components.ts';
import { icon } from './icons.ts';
import type { PageDefinition } from './page.ts';
import { escapeHtml, list, tags } from './utils.ts';

const LEARNING_LOOP = [
  {
    title: 'Notice',
    detail: 'Start with a real friction, an odd question, or a detail that feels slightly wrong.',
  },
  {
    title: 'Break it down',
    detail: 'Separate the problem into inputs, decisions, edge cases, and the smallest useful version.',
  },
  {
    title: 'Build',
    detail: 'Make something concrete enough to test — a screen, a workflow, a game loop, or a public README.',
  },
  {
    title: 'Reflect',
    detail: 'Read the rough edges, document what is true, and improve the next iteration.',
  },
];

export function aboutPage(): PageDefinition {
  const content = `<section class="page-hero page-hero--about" aria-labelledby="page-title">
    <div class="about-hero">
      <div class="about-hero__copy">
        ${eyebrow('The human behind the pixels / 002')}
        <h1 id="page-title" data-reveal>One brain.<br><span>Many rabbit holes.</span></h1>
        <p class="page-hero__lead" data-reveal>I’m ${escapeHtml(SITE.name)} — Lavi to most people. I’m a Computer Science undergraduate who builds across web, desktop, mobile, games, and the occasional visual experiment.</p>
        <p data-reveal>I like software because it sits between logic and imagination. A good project can be useful, playful, and carefully engineered at the same time.</p>
        <div class="about-hero__facts" data-reveal>
          <span><i aria-hidden="true"></i> Based in India</span>
          <span><i aria-hidden="true"></i> Open to internships &amp; collaborations</span>
          <span><i aria-hidden="true"></i> Learning in public</span>
        </div>
        <div class="about-hero__actions" data-reveal>
          ${buttonLink({ label: 'See the projects', url: href('projects/'), variant: 'primary' })}
          ${buttonLink({ label: 'Get in touch', url: href('contact/'), variant: 'ghost', iconName: 'mail' })}
        </div>
        ${socialRow('about-hero__socials')}
      </div>
      <div class="about-hero__art" data-reveal style="--delay:140ms">
        <div class="about-hero__halo" aria-hidden="true"></div>
        <div class="about-hero__ring" aria-hidden="true"></div>
        <div class="about-hero__portrait">${avatarImage()}</div>
        <div class="about-hero__caption" aria-hidden="true"><span>FIG. 01</span><span>CURIOUS BUILDER</span></div>
      </div>
    </div>
  </section>

  <section class="section section--story" aria-labelledby="story-title">
    <div class="story-grid">
      <div class="story-aside" data-reveal>
        ${eyebrow('A note, not a résumé')}
        <div class="story-glyph" aria-hidden="true">${icon('compass')}</div>
        <p>I’m still early in my career, and I would rather be precise than impressive.</p>
      </div>
      <div class="story-copy" data-reveal>
        <h2 id="story-title">Curiosity is the through-line.</h2>
        <p>I move between interests because they feed each other. Systems thinking helps with backend design. Games teach feedback and pacing. Music and visual art make interfaces feel less mechanical. Space and futuristic technology keep the questions big.</p>
        <p>My public projects reflect that range: a Windows utility that prioritises safe file renames, a private habit tracker, an Android creator workspace, a campus reporting workflow, a 3D browser game, and a full local library system. They are not all the same kind of product, and that is the point.</p>
        <p>I care about honest documentation. If a feature is planned, it should be labelled as planned. If a release has not been verified, that should be clear too. Good engineering includes telling the truth about what exists.</p>
      </div>
    </div>
  </section>

  <section class="section section--compass" aria-labelledby="compass-title">
    ${sectionHeading('The curiosity compass', 'Tech is one coordinate, <span>not the whole map.</span>', 'Choose a signal to explore an interest. The controls work with mouse, touch, and keyboard.')}
    <div class="curiosity-compass" data-interest-compass>
      <div class="curiosity-compass__rings" aria-hidden="true"><i></i><i></i><i></i></div>
      <div class="curiosity-compass__center">
        <span class="curiosity-compass__kicker">Currently curious about</span>
        <h3 id="compass-title" data-interest-title>${escapeHtml(INTERESTS[0]?.label ?? 'Space & the future')}</h3>
        <p data-interest-description aria-live="polite">${escapeHtml(INTERESTS[0]?.description ?? '')}</p>
        <span class="curiosity-compass__count" data-interest-count>01 / 0${INTERESTS.length}</span>
      </div>
      ${INTERESTS.map(
        (interest, index) => `<button type="button" class="compass-node${
          index === 0 ? ' is-active' : ''
        }" data-interest-node="${interest.id}" data-title="${escapeHtml(
          interest.label,
        )}" data-description="${escapeHtml(interest.description)}" aria-pressed="${
          index === 0
        }" style="--angle:${index * 60 - 90}deg;--angle-neg:${90 - index * 60}deg;--node-color:${interest.color};--node-index:${index}">
        <span class="compass-node__icon">${icon(interest.icon)}</span>
        <span class="compass-node__label">${escapeHtml(interest.label)}</span>
      </button>`,
      ).join('')}
    </div>
  </section>

  <section class="section section--skills" aria-labelledby="skills-title">
    ${sectionHeading('Verified skills', 'Tools I use, and ideas <span>I’m still growing into.</span>', 'This split is intentional. The left side comes from public repository manifests and my GitHub profile; the right side is what I am actively exploring — not a claim of mastery.')}
    <div class="skills-layout">
      <div class="skills-groups">
        ${WORKING_WITH.map(
          (group) => `<article class="skill-group" data-reveal>
            <div class="skill-group__head"><span>${icon('layers')}</span><h3>${escapeHtml(group.label)}</h3></div>
            ${tags(group.items, 'tags tags--large')}
            <p>${escapeHtml(group.note)}</p>
          </article>`,
        ).join('')}
      </div>
      <aside class="exploring-panel" data-reveal>
        <span class="exploring-panel__label">Currently exploring</span>
        <h3 id="skills-title">In progress, not finished.</h3>
        ${list(EXPLORING, 'exploring-list')}
        <div class="exploring-panel__footer">${icon('spark')}<span>Learning is a feature, not a footnote.</span></div>
      </aside>
    </div>
  </section>

  <section class="section section--loop" aria-labelledby="loop-title">
    <div class="loop-heading" data-reveal>
      ${eyebrow('How I learn')}
      <h2 id="loop-title">A loop, <span>not a ladder.</span></h2>
      <p>I do not wait until I know everything before starting. I build a small version, pay attention to what breaks, and use that to decide what to learn next.</p>
    </div>
    <ol class="learning-loop">
      ${LEARNING_LOOP.map(
        (step, index) => `<li class="learning-loop__step" data-reveal style="--delay:${index * 80}ms">
          <span class="learning-loop__number">0${index + 1}</span>
          <h3>${escapeHtml(step.title)}</h3>
          <p>${escapeHtml(step.detail)}</p>
          ${index < LEARNING_LOOP.length - 1 ? `<span class="learning-loop__connector" aria-hidden="true">${icon('arrow-right')}</span>` : ''}
        </li>`,
      ).join('')}
    </ol>
  </section>

  <section class="about-next" aria-labelledby="next-title">
    <div data-reveal>
      ${eyebrow('Keep exploring')}
      <h2 id="next-title">The projects tell the rest<br><span>of the story.</span></h2>
    </div>
    <div class="about-next__actions" data-reveal>
      ${buttonLink({ label: 'Browse all work', url: href('projects/'), variant: 'primary' })}
      ${buttonLink({ label: 'Current public work', url: href('now/'), variant: 'ghost', iconName: 'arrow-right' })}
    </div>
    <div class="about-next__stack" data-reveal>${tags(PORTFOLIO_STACK)}</div>
  </section>`;

  return {
    content,
    title: 'About',
    description:
      'Meet Lakshit “Lavi” Singh Saini: a Computer Science undergraduate, curious builder, and developer with interests in software, space, music, gaming, and creative experiments.',
    pageId: 'about',
    activeNav: 'about',
    path: 'about/',
    preloadAvatar: true,
  };
}
