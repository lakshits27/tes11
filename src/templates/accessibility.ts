import { href } from '../content/site.ts';
import { eyebrow } from './components.ts';
import type { PageDefinition } from './page.ts';

const practices = [
  { title: 'Structure & navigation', detail: 'Pages use header, navigation, main, and footer landmarks, a skip-to-content link, descriptive page titles, and a consistent route structure.' },
  { title: 'Keyboard access', detail: 'Interactive controls are native links and buttons where possible. Visible focus styles, keyboard-operated navigation, and focus restoration are included for key overlays.' },
  { title: 'Motion preferences', detail: 'Decorative canvas effects and transitions respond to prefers-reduced-motion. Reduced-motion styles also disable non-essential animations.' },
  { title: 'Themes & contrast', detail: 'Dark and light themes use separate readable text and accent tokens. Automated contrast checks are part of the browser test suite.' },
  { title: 'Images & alternatives', detail: 'Content images include alternative text, and decorative graphics are hidden from assistive technology when they add no information.' },
  { title: 'Ongoing verification', detail: 'The project includes automated axe-core checks on representative routes, responsive checks, and keyboard interaction regression tests.' },
];

export function accessibilityPage(): PageDefinition {
  const content = `<section class="accessibility-page" aria-labelledby="page-title">
    <header class="accessibility-page__hero">
      ${eyebrow('Inclusive by intent / accessibility')}
      <h1 id="page-title">Access for <span>everyone.</span></h1>
      <p>This site aims to make its content and interactions usable across different devices, input methods, and motion preferences.</p>
    </header>
    <div class="accessibility-practices">
      ${practices.map((item, index) => `<article><span>${String(index + 1).padStart(2, '0')}</span><div><h2>${item.title}</h2><p>${item.detail}</p></div></article>`).join('')}
    </div>
    <section class="accessibility-contact"><h2>Found something difficult to use?</h2><p>If an interaction, page, or piece of content creates a barrier, please let me know so I can investigate and improve it.</p><a href="mailto:lakshitsinghsaini@gmail.com">Report an accessibility issue ↗</a> · <a href="${href('contact/')}">Contact page</a></section>
  </section>`;
  return {
    content,
    title: 'Accessibility statement',
    description: 'Accessibility practices, motion preferences, keyboard support, and ways to report barriers on the Lavi portfolio.',
    pageId: 'accessibility',
    activeNav: '',
    path: 'accessibility/',
  };
}
