import { eyebrow } from './components.ts';
import type { PageDefinition } from './page.ts';

export function designSystemPage(): PageDefinition {
  const content = `<section class="design-system-page" aria-labelledby="page-title">
    <header class="design-system-page__hero">
      ${eyebrow('Under the surface / design system')}
      <h1 id="page-title">The visual <span>language.</span></h1>
      <p>A practical reference for the colors, type, spacing, shapes, and components that give this site its visual rhythm.</p>
    </header>
    <div class="design-system-intro">
      <p>The source of truth lives in <code>src/styles/tokens.css</code> and the component stylesheets. This page documents those decisions with live examples rather than a separate, disconnected palette.</p>
      <p>Use the theme toggle to compare how shared tokens adapt between dark and light appearances.</p>
    </div>
    <div class="design-system-sections">
      <section aria-labelledby="ds-color-title"><span>01 / COLOR</span><h2 id="ds-color-title">Color tokens</h2><p>Core surfaces, readable text, and spectral accents.</p><div class="ds-color-grid">
        ${[
          ['Background', '--bg'], ['Deep background', '--bg-deep'], ['Surface', '--surface'],
          ['Primary text', '--ink'], ['Muted text', '--muted'], ['Lime accent', '--lime'],
          ['Cyan accent', '--cyan'], ['Violet accent', '--violet'], ['Pink accent', '--pink'],
          ['Amber accent', '--amber'], ['Mint accent', '--mint'],
        ].map(([label, token]) => `<article class="ds-color-token"><span class="ds-color-token__swatch" style="background:var(${token})"></span><span class="ds-color-token__name">${label}</span><code>${token}</code><button class="ds-token-copy" type="button" data-copy-token aria-label="Copy ${token} hex value">Copy hex</button></article>`).join('')}
      </div></section>
      <section aria-labelledby="ds-type-title"><span>02 / TYPE</span><h2 id="ds-type-title">Typography</h2><p>Display, body, and monospace roles.</p><div class="ds-type-specimens">
        <article><span>DISPLAY / SPACE GROTESK</span><h3 class="ds-type-display">Curiosity, made visible.</h3></article>
        <article><span>BODY / MANROPE</span><p class="ds-type-body">Thoughtful interfaces balance clarity, rhythm, and a little personality.</p></article>
        <article><span>MONOSPACE / IBM PLEX MONO</span><code class="ds-type-mono">const idea = "build something useful";</code></article>
      </div></section>
      <section aria-labelledby="ds-layout-title"><span>03 / LAYOUT</span><h2 id="ds-layout-title">Space &amp; shape</h2><p>Consistent spacing, corner radii, and depth.</p><div class="ds-placeholder">Layout tokens are being documented.</div></section>
      <section aria-labelledby="ds-components-title"><span>04 / COMPONENTS</span><h2 id="ds-components-title">Interface pieces</h2><p>Buttons, fields, cards, and iconography.</p><div class="ds-placeholder">Component specimens are being documented.</div></section>
    </div>
  </section>`;
  return {
    content,
    title: 'Design system',
    description: 'A live reference to the design tokens and interface components used throughout the Lavi portfolio.',
    pageId: 'design-system',
    activeNav: '',
    path: 'design-system/',
  };
}
