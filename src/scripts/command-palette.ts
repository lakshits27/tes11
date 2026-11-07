import { PRIMARY_NAV, SECONDARY_NAV, SOCIAL_LINKS, SITE, href } from '../content/site.ts';

async function copyPaletteText(value: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch { /* Use the selection-based fallback below. */ }
  const field = document.createElement('textarea');
  field.value = value;
  field.setAttribute('readonly', '');
  field.style.position = 'fixed';
  field.style.opacity = '0';
  field.style.top = '-9999px';
  document.body.append(field);
  field.select();
  let copied: boolean;
  try { copied = document.execCommand('copy'); } catch { copied = false; }
  field.remove();
  return copied;
}

type PaletteCommand = { id: string; label: string; description?: string; category?: string; run: () => void };

function escapePaletteText(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character] ?? character);
}

function highlightMatch(label: string, query: string): string {
  const needle = [...query.toLocaleLowerCase().replace(/\s+/g, '')];
  let cursor = 0;
  return [...label].map((character) => {
    const matched = needle[cursor] === character.toLocaleLowerCase();
    if (matched) cursor += 1;
    const safe = escapePaletteText(character);
    return matched ? `<mark class="command-palette__match">${safe}</mark>` : safe;
  }).join('');
}

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
  const openButton = document.querySelector<HTMLButtonElement>('[data-palette-open]');
  if (!root || !input || !results || !closeButton) return () => undefined;
  let open = false;
  let selectedIndex = 0;
  let previousFocus: HTMLElement | null = null;
  const commands: PaletteCommand[] = [...PRIMARY_NAV, ...SECONDARY_NAV].map((item) => ({
    id: `route-${item.id}`, label: item.label, description: item.description, category: 'Navigate',
    run: () => { window.location.href = href(item.path); },
  }));
  commands.push({
    id: 'copy-page-url', label: 'Copy current page URL',
    description: 'Copy this page address to the clipboard', category: 'Actions',
    run: () => {
      void copyPaletteText(window.location.href).then((copied) => {
        let feedback = root.querySelector<HTMLElement>('[data-palette-feedback]');
        if (!feedback) {
          feedback = document.createElement('p');
          feedback.dataset.paletteFeedback = '';
          feedback.setAttribute('role', 'status');
          feedback.setAttribute('aria-live', 'polite');
          feedback.className = 'command-palette__feedback';
          root.querySelector('.command-palette__dialog')?.append(feedback);
        }
        feedback.textContent = copied ? 'Page URL copied.' : 'Could not copy the page URL.';
      });
    },
  });
  commands.push({
    id: 'copy-contact-email', label: 'Copy contact email',
    description: SITE.email, category: 'Actions',
    run: () => {
      void copyPaletteText(SITE.email).then((copied) => {
        let feedback = root.querySelector<HTMLElement>('[data-palette-feedback]');
        if (!feedback) {
          feedback = document.createElement('p');
          feedback.dataset.paletteFeedback = '';
          feedback.setAttribute('role', 'status');
          feedback.setAttribute('aria-live', 'polite');
          feedback.className = 'command-palette__feedback';
          root.querySelector('.command-palette__dialog')?.append(feedback);
        }
        feedback.textContent = copied ? 'Contact email copied.' : 'Could not copy the contact email.';
      });
    },
  });
  commands.push(...SOCIAL_LINKS.filter((item) => item.url.startsWith('https://')).map((item) => ({
    id: `profile-${item.label.toLowerCase()}`, label: item.label, description: item.handle, category: 'Profiles',
    run: () => { window.open(item.url, '_blank', 'noopener,noreferrer'); },
  })));
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
    selectedIndex = 0;
    const history = readHistory();
    const ordered = input.value.trim() ? commands : [...history.map((id) => commands.find((command) => command.id === id)).filter((command): command is PaletteCommand => Boolean(command)), ...commands.filter((command) => !history.includes(command.id))];
    const matches = ordered.filter((command) => fuzzyMatch(input.value, command.label));
    const groups = new Map<string, PaletteCommand[]>();
    matches.forEach((command) => {
      const category = command.category ?? 'General';
      groups.set(category, [...(groups.get(category) ?? []), command]);
    });
    results.innerHTML = groups.size
      ? [...groups].map(([category, items]) => `<section class="command-palette__group"><h3 class="command-palette__group-title">${category}</h3>${items.map((command) => `<button class="command-palette__result" type="button" role="option" data-command-id="${command.id}"><span class="command-palette__result-label">${highlightMatch(command.label, input.value)}</span>${command.description ? `<small class="command-palette__result-description">${command.description}</small>` : ""}</button>`).join('')}</section>`).join('')
      : '<p class="command-palette__empty">No matching commands.</p>';
    results.querySelectorAll<HTMLButtonElement>('[data-command-id]').forEach((button, index) => {
      button.setAttribute('aria-selected', String(index === selectedIndex));
      button.tabIndex = index === selectedIndex ? 0 : -1;
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
      if (open) close();
      else show();
    }
  };
  const onInput = (): void => render();
  const onInputKeyDown = (event: KeyboardEvent): void => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Backspace' && input.value) {
      event.preventDefault();
      input.value = '';
      render();
      return;
    }
    const options = Array.from(results.querySelectorAll<HTMLButtonElement>('[data-command-id]'));
    if (!options.length) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      selectedIndex = (selectedIndex + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length;
      options.forEach((option, index) => {
        option.setAttribute('aria-selected', String(index === selectedIndex));
        option.tabIndex = index === selectedIndex ? 0 : -1;
      });
      options[selectedIndex]?.focus();
    } else if (event.key === 'Enter') {
      const selected = results.querySelector<HTMLButtonElement>('[aria-selected="true"]');
      if (selected) { event.preventDefault(); selected.click(); }
    }
  };
  input.addEventListener('input', onInput);
  root.addEventListener('keydown', onInputKeyDown);
  closeButton.addEventListener('click', close);
  openButton?.addEventListener('click', show);
  document.addEventListener('keydown', onKeyDown);
  render();
  return () => {
    input.removeEventListener('input', onInput);
    root.removeEventListener('keydown', onInputKeyDown);
    closeButton.removeEventListener('click', close);
    openButton?.removeEventListener('click', show);
    document.removeEventListener('keydown', onKeyDown);
    close();
  };
}
