import '../styles/main.css';
import { initTheme } from './theme.ts';
import { initNavigation } from './navigation.ts';
import { initReveal } from './reveal.ts';
import { initTransitions } from './transitions.ts';
import { initProjectFilter } from './project-filter.ts';
import { initCopyEmail } from './copy-email.ts';
import { initInterestCompass } from './interest-compass.ts';
import { initOrbitLab } from './orbit-lab.ts';
import { createSpectralTrail } from './rainbow.ts';
import { createPrismField } from './prism-field.ts';
import { FINE_POINTER_QUERY, REDUCED_MOTION_QUERY, prefersReducedMotion } from './utils.ts';

function boot(): void {
  const cleanups: Array<() => void> = [];
  const reducedQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  const fineQuery = window.matchMedia(FINE_POINTER_QUERY);
  const trail = createSpectralTrail(document.querySelector<HTMLCanvasElement>('#spectral-trail'));
  const prism = createPrismField();

  const syncMotion = (): void => {
    const reduced = reducedQuery.matches;
    trail?.setEnabled(!reduced && fineQuery.matches);
    prism?.setReducedMotion(reduced);
    document.documentElement.dataset.motion = reduced ? 'reduced' : 'full';
  };

  reducedQuery.addEventListener('change', syncMotion);
  fineQuery.addEventListener('change', syncMotion);
  cleanups.push(() => {
    reducedQuery.removeEventListener('change', syncMotion);
    fineQuery.removeEventListener('change', syncMotion);
  });

  if (!prefersReducedMotion()) {
    document.body.classList.add('is-entering');
    const enterTimer = window.setTimeout(() => document.body.classList.remove('is-entering'), 900);
    cleanups.push(() => window.clearTimeout(enterTimer));
  }

  cleanups.push(
    initTheme(),
    initNavigation(),
    initReveal(),
    initTransitions(),
    initProjectFilter(),
    initCopyEmail(),
    initInterestCompass(),
    initOrbitLab(),
    () => trail?.destroy(),
    () => prism?.destroy(),
  );

  syncMotion();

  window.addEventListener(
    'pagehide',
    () => {
      cleanups.forEach((cleanup) => cleanup());
    },
    { once: true },
  );
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
