import { prefersReducedMotion } from './utils.ts';

const PORTAL_DURATION = 430;

function createPortal(event: MouseEvent, link: HTMLAnchorElement): void {
  document.querySelector('.portal-overlay')?.remove();
  const overlay = document.createElement('div');
  overlay.className = 'portal-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.style.setProperty('--portal-x', `${event.clientX}px`);
  overlay.style.setProperty('--portal-y', `${event.clientY}px`);
  overlay.style.setProperty('--portal-accent', link.dataset.accent ?? '#d7ff65');
  document.body.append(overlay);
}

export function initTransitions(): () => void {
  const onClick = (event: MouseEvent): void => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = event.target;
    if (!(target instanceof Element)) return;
    const link = target.closest<HTMLAnchorElement>('a[data-portal]');
    if (!link || prefersReducedMotion()) return;
    if (link.target && link.target !== '_self') return;
    if (link.origin !== window.location.origin) return;
    if (link.hasAttribute('download')) return;

    event.preventDefault();
    createPortal(event, link);
    const destination = link.href;
    window.setTimeout(() => window.location.assign(destination), PORTAL_DURATION);
  };

  const onPageShow = (): void => {
    document.querySelector('.portal-overlay')?.remove();
  };

  document.addEventListener('click', onClick);
  window.addEventListener('pageshow', onPageShow);

  return () => {
    document.removeEventListener('click', onClick);
    window.removeEventListener('pageshow', onPageShow);
    document.querySelector('.portal-overlay')?.remove();
  };
}
