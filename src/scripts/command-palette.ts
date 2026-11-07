type PaletteCommand = { id: string; label: string; run: () => void };

export function initCommandPalette(): () => void {
  const root = document.querySelector<HTMLElement>('[data-command-palette]');
  const input = root?.querySelector<HTMLInputElement>('[data-palette-search]');
  const results = root?.querySelector<HTMLElement>('[data-palette-results]');
  const closeButton = root?.querySelector<HTMLButtonElement>('[data-palette-close]');
  if (!root || !input || !results || !closeButton) return () => undefined;
  let open = false;
  let previousFocus: HTMLElement | null = null;
  const commands: PaletteCommand[] = [];
  const render = (): void => { results.innerHTML = '<p class="command-palette__empty">No commands available yet.</p>'; };
  const close = (): void => {
    if (!open) return;
    open = false;
    root.hidden = true;
    document.body.classList.remove('has-command-palette');
    previousFocus?.focus();
  };
  const show = (): void => {
    if (open) return;
    previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    open = true;
    root.hidden = false;
    document.body.classList.add('has-command-palette');
    input.value = '';
    render();
    input.focus();
  };
  const onKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && open) { event.preventDefault(); close(); return; }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      open ? close() : show();
    }
  };
  const onInput = (): void => render();
  input.addEventListener('input', onInput);
  closeButton.addEventListener('click', close);
  document.addEventListener('keydown', onKeyDown);
  render();
  return () => {
    input.removeEventListener('input', onInput);
    closeButton.removeEventListener('click', close);
    document.removeEventListener('keydown', onKeyDown);
    close();
  };
}
