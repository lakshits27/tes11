import type { Project } from '../content/projects.ts';
import { PROJECTS, coverPath, projectPath, screenshotPath } from '../content/projects.ts';
import { asset, canonical, href } from '../content/site.ts';
import {
  breadcrumbs,
  buttonLink,
  eyebrow,
  projectStructuredData,
} from './components.ts';
import { icon } from './icons.ts';
import type { PageDefinition } from './page.ts';
import { dateLabel, escapeHtml, list, tags } from './utils.ts';

function projectLinks(project: Project, className = 'project-hero__links'): string {
  return `<div class="${className}">
    ${project.links
      .map((link) =>
        buttonLink({
          label: link.label,
          url: link.url,
          variant: link.kind === 'live' ? 'primary' : link.kind === 'repository' ? 'secondary' : 'ghost',
          iconName: link.kind === 'repository' ? 'github' : 'arrow-up-right',
          external: true,
          accent: link.kind === 'live' ? project.accent : undefined,
        }),
      )
      .join('')}
  </div>`;
}

function visualFigure(project: Project): string {
  if (project.visuals.length === 0) return '';
  const isIcon = project.visuals[0]?.kind === 'app-icon';
  return `<div class="project-visuals${isIcon ? ' project-visuals--single' : ''}">
    ${project.visuals
      .map(
        (visual) => `<figure class="project-visual project-visual--${visual.kind}" data-reveal>
          <div class="project-visual__frame">
            <img src="${asset(screenshotPath(visual))}" alt="${escapeHtml(
              visual.alt,
            )}" loading="lazy" decoding="async" width="1200" height="800">
          </div>
          <figcaption><span>${escapeHtml(visual.kind === 'screenshot' ? 'Repository screenshot' : visual.kind === 'app-icon' ? 'Repository app icon' : 'Original illustration')}</span>${escapeHtml(
            visual.caption,
          )}</figcaption>
        </figure>`,
      )
      .join('')}
    ${isIcon ? `<div class="project-visual-note-card" data-reveal>${icon('ideas')}<h3>No invented screenshots.</h3><p>The SaBuddy repository does not include feature screenshots, so this page uses its real app icon and an original illustrated cover instead.</p></div>` : ''}
  </div>`;
}

export function projectPage(project: Project, index: number): PageDefinition {
  const previous = PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(index + 1) % PROJECTS.length];
  const number = String(index + 1).padStart(2, '0');

  const content = `<div class="project-detail" style="--project-accent:${project.accent};--project-accent-2:${project.accentSecondary};--project-accent-soft:${project.accentSoft}">
    <section class="project-hero" aria-labelledby="page-title" data-reveal>
      <div class="project-hero__copy">
        ${breadcrumbs([
          { label: 'Home', url: href() },
          { label: 'Projects', url: href('projects/') },
          { label: project.name },
        ])}
        ${eyebrow(`${project.kicker} / project ${number}`)}
        <h1 id="page-title">${escapeHtml(project.name)}<span class="project-hero__period">.</span></h1>
        <p class="project-hero__tagline">${escapeHtml(project.tagline)}</p>
        <p class="project-hero__intro">${escapeHtml(project.intro)}</p>
        ${projectLinks(project)}
        <dl class="project-facts">
          <div><dt>Status</dt><dd>${escapeHtml(project.status)}</dd></div>
          <div><dt>Category</dt><dd>${escapeHtml(project.category)}</dd></div>
          <div><dt>Verified</dt><dd>${dateLabel(project.verified.date)}</dd></div>
        </dl>
      </div>
      <figure class="project-hero__art" data-reveal style="--delay:120ms">
        <div class="project-hero__art-frame">
          <img src="${asset(coverPath(project))}" width="1200" height="800" alt="${escapeHtml(project.coverAlt)}" decoding="async">
          <span class="project-hero__art-glint" aria-hidden="true"></span>
        </div>
        <figcaption>${escapeHtml(project.coverCaption)}</figcaption>
      </figure>
    </section>

    <div class="project-rail" aria-hidden="true"><span></span><span></span><span></span></div>

    <section class="project-section project-section--why" aria-labelledby="why-title">
      <div class="project-section__rail"><span>01</span><p>Why it exists</p></div>
      <div class="project-section__content">
        <h2 id="why-title">Problem &amp; motivation</h2>
        <p class="project-lead">${escapeHtml(project.problem)}</p>
        <div class="project-two-col">
          <article><h3>The spark</h3><p>${escapeHtml(project.motivation)}</p></article>
          <article><h3>The approach</h3><p>${escapeHtml(project.approach)}</p></article>
        </div>
      </div>
    </section>

    <section class="project-section project-section--decisions" aria-labelledby="decisions-title">
      <div class="project-section__rail"><span>02</span><p>Direction</p></div>
      <div class="project-section__content">
        <h2 id="decisions-title">Goals and design decisions</h2>
        <ol class="project-goals">
          ${project.goals.map((goal, i) => `<li style="--goal-accent:${project.accent}"><span>${String(i + 1).padStart(2, '0')}</span><p>${escapeHtml(goal)}</p></li>`).join('')}
        </ol>
        <div class="decision-grid">
          ${project.decisions
            .map(
              (decision, i) => `<article class="decision-card" data-reveal style="--delay:${i * 60}ms">
                <span class="decision-card__index">${String(i + 1).padStart(2, '0')}</span>
                <h3>${escapeHtml(decision.title)}</h3>
                <p>${escapeHtml(decision.detail)}</p>
              </article>`,
            )
            .join('')}
        </div>
      </div>
    </section>

    <section class="project-section project-section--features" aria-labelledby="features-title">
      <div class="project-section__rail"><span>03</span><p>Implemented</p></div>
      <div class="project-section__content">
        <h2 id="features-title">What the repository actually contains</h2>
        <p class="project-section__intro">These features are described in the project README or visible in its source and release material.</p>
        <div class="feature-grid">
          ${project.features
            .map(
              (feature, i) => `<article class="feature-card" data-reveal style="--delay:${i * 45}ms">
                <span class="feature-card__icon">${icon(i % 3 === 0 ? 'layers' : i % 3 === 1 ? 'terminal' : 'spark')}</span>
                <h3>${escapeHtml(feature.title)}</h3>
                <p>${escapeHtml(feature.detail)}</p>
              </article>`,
            )
            .join('')}
        </div>
      </div>
    </section>

    <section class="project-section project-section--visuals" aria-labelledby="visuals-title">
      <div class="project-section__rail"><span>04</span><p>Proof</p></div>
      <div class="project-section__content">
        <h2 id="visuals-title">Real visuals &amp; original artwork</h2>
        <p class="project-section__intro">${escapeHtml(project.visualNote)}</p>
        ${visualFigure(project)}
      </div>
    </section>

    <section class="project-section project-section--stack" aria-labelledby="stack-title">
      <div class="project-section__rail"><span>05</span><p>Stack</p></div>
      <div class="project-section__content">
        <h2 id="stack-title">Verified technology</h2>
        ${tags(project.tech, 'tags tags--large')}
        <div class="source-card" data-reveal>
          <div>${icon('compass')}<h3>Where this was checked</h3></div>
          <p>Repository last pushed ${dateLabel(project.verified.lastPushed)}. Page content verified ${dateLabel(project.verified.date)} against ${project.verified.sources.map(escapeHtml).join(', ')}.</p>
          <a href="${project.verified.repository}" target="_blank" rel="noopener noreferrer">Open the source ${icon('arrow-up-right')}</a>
        </div>
      </div>
    </section>

    <section class="project-section project-section--reflection" aria-labelledby="reflection-title">
      <div class="project-section__rail"><span>06</span><p>Reflection</p></div>
      <div class="project-section__content">
        <h2 id="reflection-title">Contribution, challenges &amp; scope</h2>
        <div class="reflection-grid">
          <article class="reflection-card">
            <h3>${icon('code')} My contribution</h3>
            ${list(project.contribution)}
          </article>
          <article class="reflection-card">
            <h3>${icon('prism')} Challenges &amp; learning</h3>
            <dl>${project.challenges.map((item) => `<dt>${escapeHtml(item.title)}</dt><dd>${escapeHtml(item.detail)}</dd>`).join('')}</dl>
          </article>
          <article class="reflection-card reflection-card--scope">
            <h3>${icon('layers')} Documented limits</h3>
            <p>These are boundaries stated in the repository, not completed features:</p>
            ${list(project.scopeNotes)}
          </article>
        </div>
      </div>
    </section>

    <section class="project-status" aria-labelledby="status-title">
      <div class="project-status__copy" data-reveal>
        ${eyebrow('Current status')}
        <h2 id="status-title">${escapeHtml(project.status)}</h2>
        <p>${escapeHtml(project.statusDetail)}</p>
      </div>
      <div class="project-status__links" data-reveal>
        ${project.links
          .map(
            (link) => `<a href="${link.url}" target="_blank" rel="noopener noreferrer">
              <span>${escapeHtml(link.label)}</span>
              <small>${escapeHtml(link.note ?? (link.kind === 'repository' ? 'Source, README, and history' : link.kind === 'live' ? 'Published live version' : 'Release page'))}</small>
              ${icon('arrow-up-right')}
            </a>`,
          )
          .join('')}
      </div>
    </section>

    <nav class="project-nav" aria-label="Project navigation">
      <a class="project-nav__item project-nav__item--prev" href="${href(projectPath(previous))}" data-portal data-accent="${previous.accent}">
        <span>${icon('arrow-left')} Previous project</span><strong>${escapeHtml(previous.name)}</strong>
      </a>
      <a class="project-nav__item project-nav__item--all" href="${href('projects/')}">
        <span>All work</span><strong>Project shelf ${icon('arrow-up-right')}</strong>
      </a>
      <a class="project-nav__item project-nav__item--next" href="${href(projectPath(next))}" data-portal data-accent="${next.accent}">
        <span>Next project ${icon('arrow-right')}</span><strong>${escapeHtml(next.name)}</strong>
      </a>
    </nav>
  </div>`;

  return {
    content,
    title: project.name,
    description: `${project.summary} Verified project details, features, stack, visuals, and repository links.`,
    pageId: 'project',
    activeNav: 'projects',
    path: projectPath(project),
    bodyClass: 'project-page',
    bodyStyle: `--project-accent:${project.accent};--project-accent-2:${project.accentSecondary};--project-accent-soft:${project.accentSoft}`,
    dataProject: project.slug,
    ogImage: canonical(`assets/og/${project.slug}.png`),
    ogImageAlt: `${project.name} — original spectral project artwork by Lavi`,
    structuredData: projectStructuredData(project),
  };
}
