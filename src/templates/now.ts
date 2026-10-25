import { INTERESTS } from '../content/interests.ts';
import { EXPLORING } from '../content/skills.ts';
import { PROJECTS, projectPath } from '../content/projects.ts';
import { SITE, href } from '../content/site.ts';
import { buttonLink, eyebrow, sectionHeading } from './components.ts';
import { icon } from './icons.ts';
import type { PageDefinition } from './page.ts';
import { dateLabel, escapeHtml, list } from './utils.ts';

const releases = PROJECTS.filter((project) => project.releaseDate).sort(
  (a, b) => (b.releaseDate ?? '').localeCompare(a.releaseDate ?? ''),
);

export function nowPage(): PageDefinition {
  const content = `<section class="page-hero page-hero--now" aria-labelledby="page-title">
    ${eyebrow('Now / public snapshot')}
    <h1 id="page-title" data-reveal>Right now, <span>in public.</span></h1>
    <p data-reveal>This is a grounded snapshot as of ${dateLabel(SITE.verifiedDate)} — recent releases and documented interests from my public repositories and GitHub profile. No invented activity feed.</p>
    <div class="now-hero__status" data-reveal>
      <span><i aria-hidden="true"></i> ${escapeHtml(SITE.role)}</span>
      <span>Open to internships &amp; collaborations</span>
    </div>
  </section>

  <section class="section section--timeline" aria-labelledby="timeline-title">
    ${sectionHeading('Recent public releases', 'A trail of <span>shipped versions.</span>', 'Dates below come from the GitHub Releases API for each verified repository.')}
    <ol class="release-timeline">
      ${releases
        .map((project, index) => {
          const release = project.links.find((link) => link.kind === 'release');
          return `<li class="release-item" data-reveal style="--delay:${index * 55}ms;--release-accent:${project.accent}">
            <div class="release-item__date"><span>${dateLabel(project.releaseDate ?? SITE.verifiedDate)}</span><small>${escapeHtml(project.releaseLabel ?? 'Release')}</small></div>
            <div class="release-item__marker" aria-hidden="true"><i></i></div>
            <article class="release-item__card">
              <div class="release-item__head"><h3>${escapeHtml(project.name)}</h3><span>${escapeHtml(project.status)}</span></div>
              <p>${escapeHtml(project.statusDetail)}</p>
              <div class="release-item__actions">
                <a href="${href(projectPath(project))}">Project notes ${icon('arrow-up-right')}</a>
                ${release ? `<a href="${release.url}" target="_blank" rel="noopener noreferrer">Release ${icon('arrow-up-right')}</a>` : ''}
              </div>
            </article>
          </li>`;
        })
        .join('')}
    </ol>
  </section>

  <section class="section section--learning-now" aria-labelledby="learning-title">
    <div class="now-split">
      <div class="now-card now-card--learning" data-reveal>
        ${eyebrow('Currently learning')}
        <h2 id="learning-title">Going deeper, <span>one layer at a time.</span></h2>
        <p>These are areas listed on my GitHub profile README as things I am learning — not finished credentials.</p>
        ${list(EXPLORING, 'exploring-list exploring-list--large')}
      </div>
      <div class="now-card now-card--interests" data-reveal>
        ${eyebrow('Outside the editor')}
        <h2>Same curiosity, <span>different inputs.</span></h2>
        <p>Other interests shape how I think about design, systems, and what is worth building.</p>
        <div class="now-interest-list">
          ${INTERESTS.map(
            (interest) => `<span style="--interest-color:${interest.color}">${icon(interest.icon)}<em>${escapeHtml(interest.label)}</em></span>`,
          ).join('')}
        </div>
      </div>
    </div>
  </section>

  <section class="now-outro" aria-labelledby="outro-title" data-reveal>
    <div>
      ${eyebrow('Next up')}
      <h2 id="outro-title">Keep following <span>the work.</span></h2>
      <p>The project pages hold the details. The playground holds the experiments. The contact page holds the open channel.</p>
    </div>
    <div class="now-outro__actions">
      ${buttonLink({ label: 'All projects', url: href('projects/'), variant: 'primary' })}
      ${buttonLink({ label: 'Playground', url: href('playground/'), variant: 'ghost', iconName: 'prism' })}
    </div>
  </section>`;

  return {
    content,
    title: 'Now',
    description:
      'A grounded snapshot of Lakshit Singh Saini’s recent public releases, current learning areas, and interests as of October 2026.',
    pageId: 'now',
    activeNav: 'now',
    path: 'now/',
  };
}
