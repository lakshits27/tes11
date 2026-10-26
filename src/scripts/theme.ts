import { prefersReducedMotion, REDUCED_MOTION_QUERY } from './utils.ts';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'lavi-theme';
const THEME_EVENT = 'lavi:themechange';

function currentTheme(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

/**
 * Sun/moon theme switch. The pre-paint inline script in <head> already chose
 * the initial theme, so this module only reacts to user toggles and system
 * changes while keeping every toggle button, the meta theme-color, and
 * canvas effects in sync.
 */
export function initTheme(): () => void {
  const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]'));
  const metaThemeColor = document.querySelector<HTMLMetaElement>('#meta-theme-color');
  const reducedQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  const systemQuery = window.matchMedia('(prefers-color-scheme: light)');

  const syncButtons = (theme: Theme): void => {
    const nextLabel = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
    for (const button of buttons) {
      button.setAttribute('aria-pressed', String(theme === 'light'));
      button.setAttribute('aria-label', nextLabel);
      const label = button.querySelector<HTMLElement>('[data-theme-label]');
      if (label) label.textContent = nextLabel;
    }
  };

  const apply = (theme: Theme, animate: boolean): void => {
    const root = document.documentElement;
    if (root.dataset.theme === theme && root.classList.contains('theme-ready')) return;
    root.dataset.theme = theme;
    root.classList.add('theme-ready');

    if (animate && !prefersReducedMotion()) {
      root.classList.add('theme-anim');
      window.setTimeout(() => root.classList.remove('theme-anim'), 420);
    }

    if (metaThemeColor) {
      metaThemeColor.content = metaThemeColor.dataset[theme] ?? metaThemeColor.content;
    }

    syncButtons(theme);
    window.dispatchEvent(new CustomEvent<Theme>(THEME_EVENT, { detail: theme }));
  };

  const onToggle = (): void => {
    const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* Storage may be unavailable (private mode); the switch still works. */
    }
    apply(next, true);
  };

  const onSystemChange = (event: MediaQueryListEvent): void => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    if (stored !== 'light' && stored !== 'dark') {
      apply(event.matches ? 'light' : 'dark', true);
    }
  };

  for (const button of buttons) {
    button.addEventListener('click', onToggle);
  }
  systemQuery.addEventListener('change', onSystemChange);
  reducedQuery.addEventListener('change', () => apply(currentTheme(), false));

  apply(currentTheme(), false);

  return () => {
    for (const button of buttons) {
      button.removeEventListener('click', onToggle);
    }
    systemQuery.removeEventListener('change', onSystemChange);
  };
}

export { THEME_EVENT };
