import { SITE, href } from '../content/site.ts';
import { eyebrow } from './components.ts';
import type { PageDefinition } from './page.ts';

const sections = [
  { title: 'No account or contact form', detail: 'This is a static portfolio. It does not offer user accounts, passwords, or a site-owned contact form. Contact links open your email application; sending an email is your choice.' },
  { title: 'Preferences stored in this browser', detail: 'The selected theme is stored in local storage so the site can remember dark or light appearance. The command palette also stores up to five recent command IDs to make repeat navigation quicker. These values remain in this browser profile.' },
  { title: 'Clipboard actions', detail: 'Copy commands only write the value you explicitly choose, such as the current page URL or the public contact email, to your device clipboard.' },
  { title: 'External websites', detail: 'Social profiles, project repositories, and other external links take you to services operated by their respective providers. Their own privacy policies apply once you leave this site.' },
  { title: 'Static hosting', detail: 'The portfolio is published as a static website through GitHub Pages. GitHub may process technical request information as part of hosting and security; consult GitHub’s privacy statement for its practices.' },
  { title: 'Questions', detail: 'For a question about this explanation or a privacy concern, contact the site owner using the public email address.' },
];

export function privacyPage(): PageDefinition {
  const content = `<section class="privacy-page" aria-labelledby="page-title">
    <header class="privacy-page__hero">
      ${eyebrow('Plain-language notes / privacy')}
      <h1 id="page-title">Your data, <span>your call.</span></h1>
      <p>A straightforward explanation of what this static portfolio stores locally and what happens when you follow links away from it.</p>
    </header>
    <div class="privacy-list">
      ${sections.map((item, index) => `<article><span>${String(index + 1).padStart(2, '0')}</span><div><h2>${item.title}</h2><p>${item.detail}</p></div></article>`).join('')}
    </div>
    <p class="privacy-contact">Contact: <a href="mailto:${SITE.email}">${SITE.email}</a> · <a href="${href('contact/')}">Contact page</a></p>
    <p class="privacy-updated">This explanation describes the current site implementation and may change when the site changes.</p>
  </section>`;
  return {
    content,
    title: 'Privacy explanation',
    description: 'A plain-language explanation of browser-local preferences, clipboard actions, external links, and static hosting on the Lavi portfolio.',
    pageId: 'privacy',
    activeNav: '',
    path: 'privacy/',
  };
}
