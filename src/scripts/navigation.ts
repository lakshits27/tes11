export function initNavigation(): () => void {
  const header = document.querySelector<HTMLElement>('.site-header');
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const panel = document.querySelector<HTMLElement>('[data-menu-panel]');

  if (!header || !toggle || !panel) return () => undefined;

  let open = false;
  let scrolled = false;

  const syncScrollState = (): void => {
    const next = window.scrollY > 12;
    if (next === scrolled) return;
    scrolled = next;
    header.classList.toggle('is-scrolled', scrolled);
  };

  const setOpen = (next: boolean, returnFocus = false): void => {
    if (next === open) return;
    open = next;
    header.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');

    if (open) {
      panel.hidden = false;
      panel.inert = false;
      panel.classList.remove('is-closing');
      const firstLink = panel.querySelector<HTMLAnchorElement>('a');
      firstLink?.focus();
    } else {
      panel.inert = true;
      panel.classList.add('is-closing');
      if (returnFocus) toggle.focus();
    }
  };

  const onToggle = (): void => setOpen(!open, open);
  const onKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && open) {
      event.preventDefault();
      setOpen(false, true);
      return;
    }

    if (event.key !== 'Tab' || !open) return;
    const focusable = Array.from(
      panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, select, [tabindex]:not([tabindex="-1"])'),
    ).filter((element) => !element.hasAttribute('hidden'));
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const onDocumentClick = (event: MouseEvent): void => {
    if (!open) return;
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (!panel.contains(target) && !toggle.contains(target)) setOpen(false);
  };

  const onPanelClick = (event: MouseEvent): void => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target.closest('a')) setOpen(false);
  };

  const onPanelAnimationEnd = (event: AnimationEvent): void => {
    if (event.target !== panel || event.animationName !== 'menu-out' || open) return;
    panel.hidden = true;
    panel.classList.remove('is-closing');
  };

  const onResize = (): void => {
    if (open && window.innerWidth > 1040) setOpen(false);
  };

  syncScrollState();
  window.addEventListener('scroll', syncScrollState, { passive: true });
  toggle.addEventListener('click', onToggle);
  panel.addEventListener('click', onPanelClick);
  panel.addEventListener('animationend', onPanelAnimationEnd);
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('click', onDocumentClick);
  window.addEventListener('resize', onResize);

  return () => {
    window.removeEventListener('scroll', syncScrollState);
    toggle.removeEventListener('click', onToggle);
    panel.removeEventListener('click', onPanelClick);
    panel.removeEventListener('animationend', onPanelAnimationEnd);
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('click', onDocumentClick);
    window.removeEventListener('resize', onResize);
    setOpen(false);
    panel.hidden = true;
    panel.inert = false;
    panel.classList.remove('is-closing');
    header.classList.remove('is-scrolled');
  };
}
