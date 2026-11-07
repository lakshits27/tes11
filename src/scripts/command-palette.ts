type PaletteCommand = { id: string; label: string; category?: string; run: () => void };

function fuzzyMatch(query: string, candidate: string): boolean {
  const needle = query.toLocaleLowerCase().replace(/\s+/g, ' ').trim();
  const haystack = candidate.toLocaleLowerCase();
  if (!needle) return true;
  let cursor = 0;
  for (const character of needle) {
    cursor = haystack.indexOf(character, cursor);
    if (cursor < 0) return false;
    cursor += 1;
  }
  return true;
}

export function initCommandPalette(): () => void {
  const root = document.querySelector<HTMLElement>('[data-command-palette]');
  const input = root?.querySelector<HTMLInputElement>('[data-palette-search]');
  const results = root?.querySelector<HTMLElement>('[data-palette-results]');
  const closeButton = root?.querySelector<HTMLButtonElement>('[data-palette-close]');
  if (!root || !input || !results || !closeButton) return () => undefined;
  let open = false;
  let previousFocus: HTMLElement | null = null;
  const commands: PaletteCommand[] = [];
  const historyKey = 'lavi-command-history';
  const readHistory = (): string[] => {
    try { return JSON.parse(localStorage.getItem(historyKey) ?? '[]') as string[]; }
    catch { return []; }
  };
  const remember = (id: string): void => {
    try { localStorage.setItem(historyKey, JSON.stringify([id, ...readHistory().filter((item) => item !== id)].slice(0, 5))); }
    catch { /* Private browsing may block storage; command execution still works. */ }
  };
  const render = (): void => {
    const history = readHistory();
    const ordered = input.value.trim() ? commands : [...history.map((id) => commands.find((command) => command.id === id)).filter((command): command is PaletteCommand => Boolean(command)), ...commands.filter((command) => !history.includes(command.id))];
    const matches = ordered.filter((command) => fuzzyMatch(input.value, command.label));
    const groups = new Map<string, PaletteCommand[]>();
    matches.forEach((command) => {
      const category = command.category ?? 'General';
      groups.set(category, [...(groups.get(category) ?? []), command]);
    });
    results.innerHTML = groups.size
      ? [...groups].map(([category, items]) => `<section class="command-palette__group"><h3 class="command-palette__group-title">${category}</h3>${items.map((command) => `<button class="command-palette__result" type="button" role="option" data-command-id="${command.id}">${command.label}</button>`).join('')}</section>`).join('')
      : '<p class="command-palette__empty">No matching commands.</p>';
    results.querySelectorAll<HTMLButtonElement>('[data-command-id]').forEach((button) => {
      button.addEventListener('click', () => {
        const command = commands.find((item) => item.id === button.dataset.commandId);
        if (!command) return;
        remember(command.id);
        command.run();
      });
    });
  };
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
