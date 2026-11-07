import { eyebrow } from './components.ts';
import type { PageDefinition } from './page.ts';

const tools = [
  { name: 'TypeScript', role: 'Application language', url: 'https://www.typescriptlang.org/' },
  { name: 'Vite', role: 'Development server and production bundler', url: 'https://vite.dev/' },
  { name: 'Puppeteer', role: 'Browser automation for regression checks', url: 'https://pptr.dev/' },
  { name: 'axe-core', role: 'Automated accessibility checks', url: 'https://github.com/dequelabs/axe-core' },
  { name: 'Sharp', role: 'Image processing and asset optimization', url: 'https://sharp.pixelplumbing.com/' },
  { name: 'Manrope', role: 'Body typeface', url: 'https://github.com/sharanda/manrope' },
  { name: 'Space Grotesk', role: 'Display typeface', url: 'https://github.com/floriankarsten/space-grotesk' },
  { name: 'IBM Plex Mono', role: 'Monospace typeface', url: 'https://github.com/IBM/plex' },
];

export function creditsPage(): PageDefinition {
  const content = `<section class="credits-page" aria-labelledby="page-title">
    <header class="credits-page__hero">
      ${eyebrow('People, projects & open source / credits')}
      <h1 id="page-title">Built with <span>good tools.</span></h1>
      <p>This portfolio is an original project, but it stands on the work of open-source maintainers, type designers, and browser-tooling communities.</p>
    </header>
    <div class="credits-list">
      ${tools.map((tool, index) => `<article><span>${String(index + 1).padStart(2, '0')}</span><div><h2>${tool.name}</h2><p>${tool.role}</p></div><a href="${tool.url}" target="_blank" rel="noopener noreferrer">Project site ↗</a></article>`).join('')}
    </div>
    <section class="credits-assets" aria-labelledby="credits-assets-title">
      <h2 id="credits-assets-title">Visual material &amp; attribution</h2>
      <p>Project screenshots are presented as evidence from the corresponding public project repositories and are labelled on their project pages. Portfolio cover illustrations and the profile illustration are maintained as local portfolio assets. The interface icon set is a small, local SVG path catalogue in the source tree.</p>
      <p>Where a project visual or dependency has its own upstream source, its repository or project link is provided alongside the relevant item. Reuse should follow the original creator's license and attribution requirements.</p>
    </section>
    <p class="credits-note">Names and links are provided for acknowledgement. Please consult each upstream project's license and attribution terms before reusing its code, typefaces, or assets.</p>
  </section>`;
  return {
    content,
    title: 'Credits & acknowledgements',
    description: 'Acknowledgements for the open-source tools and typefaces used to build and verify this portfolio.',
    pageId: 'credits',
    activeNav: '',
    path: 'credits/',
  };
}
