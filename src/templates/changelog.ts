import { href } from '../content/site.ts';
import { eyebrow } from './components.ts';
import type { PageDefinition } from './page.ts';

const entries = [
  {
    date: '2026-11-07',
    title: 'A faster way around',
    details: 'Introduced the site-wide command palette with fuzzy search, grouped navigation, recent commands, keyboard selection, profile shortcuts, and clipboard actions.',
    id: 'command-palette',
  },
  {
    date: '2026-11-07',
    title: 'More resilient project pages',
    details: 'Expanded project discovery interactions and added clearer visual position indicators and expandable design-decision details.',
    id: 'project-pages',
  },
  {
    date: '2026-11-07',
    title: 'Tighter production checks',
    details: 'Added generated HTML, JavaScript, and CSS size budgets, duplicate generated-page detection, and deployment artifact file-count verification.',
    id: 'production-checks',
  },
];

export function changelogPage(): PageDefinition {
  const content = `<section class="changelog-page" aria-labelledby="page-title">
    <header class="changelog-page__hero">
      ${eyebrow('A living record / changelog')}
      <h1 id="page-title">What’s <span>new.</span></h1>
      <p>Small improvements, new experiments, and changes to this corner of the internet.</p>
    </header>
    <div class="changelog-list">
      ${entries.map((entry) => `<article class="changelog-entry" id="${entry.id}" aria-labelledby="${entry.id}-title">
        <time datetime="${entry.date}">${new Date(entry.date + 'T12:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</time>
        <div><h2 id="${entry.id}-title">${entry.title}</h2><p>${entry.details}</p><a href="#${entry.id}">Permalink <span aria-hidden="true">↗</span></a></div>
      </article>`).join('')}
    </div>
    <a class="text-link" href="${href()}">Back home</a>
  </section>`;
  return {
    content,
    title: 'Changelog',
    description: 'A dated record of updates, improvements, and experiments on the Lavi portfolio website.',
    pageId: 'changelog',
    activeNav: '',
    path: 'changelog/',
  };
}
