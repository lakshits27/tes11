import { href } from '../content/site.ts';
import { buttonLink, eyebrow } from './components.ts';
import { icon } from './icons.ts';
import type { PageDefinition } from './page.ts';

const ORBIT_NODES = [
  { id: 'curiosity', label: 'Curiosity', color: '#d7ff65', note: 'The starting point for every experiment on this site.' },
  { id: 'code', label: 'Code', color: '#61e7ff', note: 'Typed, testable, and deliberately small where it can be.' },
  { id: 'space', label: 'Space', color: '#b69bff', note: 'Big questions and improbable scales.' },
  { id: 'sound', label: 'Sound', color: '#ff78b7', note: 'Rhythm, texture, and the mood behind a build.' },
  { id: 'play', label: 'Play', color: '#ffb86b', note: 'Games, feedback loops, and joyful interaction.' },
  { id: 'systems', label: 'Systems', color: '#8dffc5', note: 'Rules that connect small parts into something useful.' },
];

export function playgroundPage(): PageDefinition {
  const content = `<section class="page-hero page-hero--playground" aria-labelledby="page-title">
    <div class="playground-hero__art" aria-hidden="true">
      <span></span><span></span><span></span><i>✦</i>
    </div>
    ${eyebrow('Interactive lab / 004')}
    <h1 id="page-title" data-reveal>Where the code <span>gets to play.</span></h1>
    <p data-reveal>Two original visual experiments: a procedural prism field you can bend and pulse, and a small orbit system you can compose. No external libraries, no heavy 3D engine — just Canvas, SVG, CSS, and TypeScript.</p>
    <div class="page-hero__meta" data-reveal>
      <span><i aria-hidden="true"></i> Canvas + SVG</span>
      <span><i aria-hidden="true"></i> Keyboard friendly</span>
      <span><i aria-hidden="true"></i> Reduced-motion aware</span>
    </div>
  </section>

  <section class="experiment" aria-labelledby="prism-title" data-prism-lab>
    <div class="experiment__head">
      <div>
        ${eyebrow('Experiment 01 / Procedural light')}
        <h2 id="prism-title">Prism field.</h2>
        <p id="prism-description">Layered spectral waves respond to controls and pointer energy. Drag across the canvas to bend the field, or send a pulse through every layer.</p>
      </div>
      <div class="experiment__badge">${icon('prism')}<span>LIVE CANVAS</span></div>
    </div>
    <div class="prism-lab">
      <div class="prism-lab__stage">
        <canvas id="prism-field" data-prism-canvas role="img" aria-labelledby="prism-title" aria-describedby="prism-description" width="1200" height="620">
          An animated field of layered rainbow wave lines. Use the controls to change amplitude, dispersion, and speed.
        </canvas>
        <div class="prism-lab__readout" aria-hidden="true"><span>PRISM // 01</span><span data-prism-fps>60 FPS</span></div>
      </div>
      <div class="control-panel" aria-label="Prism field controls">
        <div class="control-panel__head"><h3>Field controls</h3><span>${icon('terminal')}</span></div>
        <div class="range-control">
          <label for="prism-amplitude">Amplitude <output data-prism-output="amplitude">62</output></label>
          <input id="prism-amplitude" type="range" min="10" max="100" value="62" data-prism-control="amplitude">
        </div>
        <div class="range-control">
          <label for="prism-dispersion">Dispersion <output data-prism-output="dispersion">54</output></label>
          <input id="prism-dispersion" type="range" min="0" max="100" value="54" data-prism-control="dispersion">
        </div>
        <div class="range-control">
          <label for="prism-speed">Speed <output data-prism-output="speed">38</output></label>
          <input id="prism-speed" type="range" min="0" max="100" value="38" data-prism-control="speed">
        </div>
        <div class="select-control">
          <label for="prism-palette">Spectrum</label>
          <select id="prism-palette" data-prism-palette>
            <option value="aurora">Aurora</option>
            <option value="solar">Solar flare</option>
            <option value="ultraviolet">Ultraviolet</option>
          </select>
        </div>
        <div class="control-panel__actions">
          <button class="btn btn--primary" type="button" data-prism-pulse>${icon('spark')}<span>Send pulse</span></button>
          <button class="btn btn--ghost" type="button" data-prism-reset>${icon('reset')}<span>Reset</span></button>
        </div>
        <p class="control-panel__note">Reduced-motion visitors get a single static frame; all controls still work.</p>
      </div>
    </div>
  </section>

  <section class="experiment experiment--orbit" aria-labelledby="orbit-title" data-orbit-lab>
    <div class="experiment__head">
      <div>
        ${eyebrow('Experiment 02 / Interactive system')}
        <h2 id="orbit-title">Orbit mixer.</h2>
        <p>Six signals orbit the same core. Toggle them to compose a little map of what this portfolio is made of. Active signals draw their own spectral connections.</p>
      </div>
      <div class="experiment__badge">${icon('orbit')}<span>SVG SYSTEM</span></div>
    </div>
    <div class="orbit-lab">
      <svg class="orbit-lab__links" data-orbit-links aria-hidden="true" preserveAspectRatio="none"></svg>
      <div class="orbit-lab__rings" aria-hidden="true"><i></i><i></i><i></i></div>
      <div class="orbit-lab__core" data-orbit-core>
        <span data-orbit-count>0</span>
        <small>signals active</small>
        <h3 data-orbit-title>Choose a signal</h3>
        <p data-orbit-note aria-live="polite">Activate the orbiting nodes to build your own constellation of interests.</p>
      </div>
      ${ORBIT_NODES.map(
        (node, index) => `<button type="button" class="orbit-node" data-orbit-node="${
          node.id
        }" data-color="${node.color}" data-title="${node.label}" data-note="${
          node.note
        }" aria-pressed="false" style="--angle:${index * 60 - 90}deg;--angle-neg:${90 - index * 60}deg;--node-color:${node.color};--node-index:${index}">
        <span class="orbit-node__dot" aria-hidden="true"></span>
        <span class="orbit-node__label">${node.label}</span>
      </button>`,
      ).join('')}
    </div>
  </section>

  <section class="playground-outro" aria-labelledby="outro-title">
    <div data-reveal>
      ${eyebrow('That’s the lab')}
      <h2 id="outro-title">Play is a serious way <span>to learn.</span></h2>
      <p>The same curiosity feeds the real projects — safety in Sortify, privacy in Veylo, feedback in Sarp, and careful systems work in Pustakalaya.</p>
    </div>
    <div data-reveal>
      ${buttonLink({ label: 'Back to the projects', url: href('projects/'), variant: 'primary' })}
      ${buttonLink({ label: 'Return home', url: href(), variant: 'ghost', iconName: 'arrow-left' })}
    </div>
  </section>`;

  return {
    content,
    title: 'Playground',
    description:
      'Interactive creative playground by Lakshit Singh Saini: a procedural rainbow prism field and a keyboard-accessible orbit mixer built with Canvas, SVG, CSS, and TypeScript.',
    pageId: 'playground',
    activeNav: 'playground',
    path: 'playground/',
  };
}
