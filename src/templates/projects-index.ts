import { PROJECT_FILTERS, PROJECTS, projectPath } from '../content/projects.ts';
import { href } from '../content/site.ts';
import { buttonLink, eyebrow, projectCard } from './components.ts';
import { icon } from './icons.ts';
import type { PageDefinition } from './page.ts';
import { escapeHtml } from './utils.ts';

export function projectsPage(): PageDefinition {
  const content = `<section class="page-hero page-hero--projects" aria-labelledby="page-title">
    <div class="page-hero__glow" aria-hidden="true"></div>
    ${eyebrow('The shelf / 001')}
    <h1 id="page-title" data-reveal>Ideas made <span>clickable.</span></h1>
    <p data-reveal>Not a gallery of coloured rectangles. Six real public repositories — desktop tools, web apps, Android projects, a browser game, and a full library system — each with its own verified detail page.</p>
    <div class="page-hero__meta" data-reveal>
      <span><strong>${PROJECTS.length}</strong> projects</span>
      <span><strong>${PROJECTS.length}</strong> repositories</span>
      <span>Verified 25 October 2026</span>
    </div>
  </section>

  <section class="projects-workspace" aria-label="Project discovery">
    <div class="projects-toolbar" data-reveal>
      <div class="filter-chips" role="group" aria-label="Filter projects by category">
        ${PROJECT_FILTERS.map(
          (filter, index) =>
            `<button type="button" class="filter-chip${
              index === 0 ? ' is-active' : ''
            }" data-filter="${escapeHtml(filter)}" aria-pressed="${index === 0}">${escapeHtml(filter)}</button>`,
        ).join('')}
      </div>
      <label class="search-field">
        <span class="sr-only">Search projects</span>
        ${icon('search')}
        <input type="search" id="project-search" data-project-search placeholder="Search projects, stacks, ideas…" autocomplete="off">
      </label>
    </div>
    <p class="filter-status" data-filter-status role="status" aria-live="polite">Showing all ${PROJECTS.length} projects.</p>

    <h2 class="sr-only">Project gallery</h2>
    <div class="projects-grid" data-projects-grid>
      ${PROJECTS.map((project, index) => projectCard(project, index)).join('')}
    </div>
    <div class="projects-empty" data-projects-empty hidden>
      ${icon('search')}
      <h2>No matching projects.</h2>
      <p>Try a different category or clear the search to see the full shelf.</p>
      <button type="button" class="btn btn--secondary" data-clear-filters>${icon('reset')}<span>Reset filters</span></button>
    </div>
  </section>

  <section class="projects-outro" aria-labelledby="outro-title">
    <div data-reveal>
      ${eyebrow('Beyond the shelf')}
      <h2 id="outro-title">Some ideas are still in the lab.</h2>
      <p>Browse my GitHub profile for more repositories and ongoing experiments, or step into the playground for a different kind of prototype.</p>
    </div>
    <div class="projects-outro__actions" data-reveal>
      ${buttonLink({
        label: 'GitHub profile',
        url: 'https://github.com/hmmlavi',
        variant: 'secondary',
        iconName: 'github',
        external: true,
      })}
      ${buttonLink({ label: 'Open playground', url: href('playground/'), variant: 'ghost', iconName: 'prism' })}
    </div>
  </section>

  <nav class="project-mobile-quick" aria-label="Quick project links">
    <span>Jump to</span>
    ${PROJECTS.map(
      (project) => `<a href="${href(projectPath(project))}">${escapeHtml(project.name)}</a>`,
    ).join('')}
  </nav>`;

  return {
    content,
    title: 'Projects',
    description:
      'Explore six verified public projects by Lakshit Singh Saini: Sortify, Veylo, SaBuddy, FacilityFix, Sarp, and Pustakalaya-LMS.',
    pageId: 'projects',
    activeNav: 'projects',
    path: 'projects/',
  };
}
