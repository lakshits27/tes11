export function initNavigation(): () => void {
  const header = document.querySelector<HTMLElement>('.site-header');
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const panel = document.querySelector<HTMLElement>('[data-menu-panel]');

  if (!header || !toggle || !panel) return () => undefined;

  let open = false;

  const setOpen = (next: boolean, returnFocus = false): void => {
    if (next === open) return;
    open = next;
    panel.hidden = !open;
    header.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');

    if (open) {
      const firstLink = panel.querySelector<HTMLAnchorElement>('a');
      firstLink?.focus();
    } else if (returnFocus) {
      toggle.focus();
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

  const onResize = (): void => {
    if (open && window.innerWidth > 1040) setOpen(false);
  };

  toggle.addEventListener('click', onToggle);
  panel.addEventListener('click', onPanelClick);
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('click', onDocumentClick);
  window.addEventListener('resize', onResize);

  return () => {
    toggle.removeEventListener('click', onToggle);
    panel.removeEventListener('click', onPanelClick);
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('click', onDocumentClick);
    window.removeEventListener('resize', onResize);
    setOpen(false);
  };
}
