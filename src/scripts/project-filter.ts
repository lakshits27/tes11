export function initProjectFilter(): () => void {
  const root = document.querySelector<HTMLElement>('[data-projects-grid]');
  const search = document.querySelector<HTMLInputElement>('[data-project-search]');
  const searchCounter = document.querySelector<HTMLElement>('[data-search-counter]');
  const chips = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-filter]'));
  const status = document.querySelector<HTMLElement>('[data-filter-status]');
  const empty = document.querySelector<HTMLElement>('[data-projects-empty]');
  const clear = document.querySelector<HTMLButtonElement>('[data-clear-filters]');
  const recentRoot = document.querySelector<HTMLElement>('[data-recent-searches]');
  const recentList = recentRoot?.querySelector<HTMLElement>('[data-recent-search-list]');
  const clearRecent = recentRoot?.querySelector<HTMLButtonElement>('[data-clear-recent-searches]');
  const RECENT_KEY = 'lavi-project-searches';
  const readRecent = (): string[] => {
    try {
      const value: unknown = JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]');
      return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string').slice(0, 5) : [];
    } catch { return []; }
  };
  const renderRecent = (): void => {
    if (!recentRoot || !recentList) return;
    const recent = readRecent();
    recentList.replaceChildren();
    recent.forEach((query) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.recentQuery = query;
      button.textContent = query;
      recentList.append(button);
    });
    recentRoot.hidden = recent.length === 0;
  };
  const rememberSearch = (): void => {
    const query = (search?.value ?? '').trim();
    if (query.length < 2) return;
    const recent = [query, ...readRecent().filter((item) => item.toLowerCase() !== query.toLowerCase())].slice(0, 5);
    try { localStorage.setItem(RECENT_KEY, JSON.stringify(recent)); } catch { /* Storage may be unavailable. */ }
    renderRecent();
  };
  const onRecentClick = (event: MouseEvent): void => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest<HTMLButtonElement>('[data-recent-query]');
    if (!button || !search) return;
    search.value = button.dataset.recentQuery ?? '';
    apply();
    search.focus();
  };
  const onClearRecent = (): void => {
    try { localStorage.removeItem(RECENT_KEY); } catch { /* Storage may be unavailable. */ }
    renderRecent();
  };
  const randomButton = document.querySelector<HTMLButtonElement>('[data-project-random]');
  const cards = root ? Array.from(root.querySelectorAll<HTMLElement>('[data-project-card]')) : [];

  if (!root || cards.length === 0) return () => undefined;

  const validFilters = new Set(chips.map((chip) => chip.dataset.filter ?? 'All'));
  const readUrlState = (): void => {
    const params = new URLSearchParams(window.location.search);
    const requested = params.get('category') ?? 'All';
    activeFilter = validFilters.has(requested) ? requested : 'All';
    if (search) search.value = params.get('q') ?? '';
    chips.forEach((chip) => {
      const active = (chip.dataset.filter ?? 'All') === activeFilter;
      chip.classList.toggle('is-active', active);
      chip.setAttribute('aria-pressed', String(active));
    });
  };
  const writeUrlState = (): void => {
    const url = new URL(window.location.href);
    const query = (search?.value ?? '').trim();
    if (activeFilter === 'All') url.searchParams.delete('category');
    else url.searchParams.set('category', activeFilter);
    if (query) url.searchParams.set('q', query);
    else url.searchParams.delete('q');
    window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
  };

  const apply = (): void => {
    const query = (search?.value ?? '').trim().toLowerCase();
    let visible = 0;

    cards.forEach((card) => {
      const filters = card.dataset.filters ?? '';
      const searchable = card.dataset.search ?? '';
      const matchesFilter = activeFilter === 'All' || filters.split(' ').includes(activeFilter);
      const matchesQuery = query === '' || searchable.includes(query);
      const show = matchesFilter && matchesQuery;
      card.hidden = !show;
      if (show) visible += 1;
    });

    if (status) {
      const noun = visible === 1 ? 'project' : 'projects';
      const filterText = activeFilter === 'All' ? 'all' : activeFilter;
      status.textContent = query
        ? `${visible} ${noun} matching “${search?.value ?? ''}” in ${filterText}.`
        : `Showing ${visible} ${noun}${activeFilter === 'All' ? '' : ` in ${activeFilter}`}.`;
    }
    if (empty) empty.hidden = visible !== 0;
    writeUrlState();
  };

  const onChipClick = (event: MouseEvent): void => {
    const button = event.currentTarget;
    if (!(button instanceof HTMLButtonElement)) return;
    activeFilter = button.dataset.filter ?? 'All';
    chips.forEach((chip) => {
      const active = chip === button;
      chip.classList.toggle('is-active', active);
      chip.setAttribute('aria-pressed', String(active));
    });
    apply();
  };

  const onRandom = (): void => {
    const visibleCards = cards.filter((card) => !card.hidden);
    if (visibleCards.length === 0) return;
    const selected = visibleCards[Math.floor(Math.random() * visibleCards.length)];
    selected?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    selected?.querySelector<HTMLAnchorElement>('h3 a')?.focus({ preventScroll: true });
  };

  const updateSearchCounter = (): void => { if (searchCounter && search) searchCounter.textContent = `${search.value.length}/80`; };
  const onSearch = (): void => { updateSearchCounter(); apply(); };
  const onSearchKeyDown = (event: KeyboardEvent): void => { if (event.key === 'Enter') rememberSearch(); };
  const onPopState = (): void => { readUrlState(); apply(); };

  const onDocumentKeyDown = (event: KeyboardEvent): void => {
    const target = event.target;
    const isTyping = target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
    const shortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
    const slashShortcut = event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey && !isTyping;
    if ((!shortcut && !slashShortcut) || !search) return;
    event.preventDefault();
    search.focus();
    search.select();
  };

  const onChipKeyDown = (event: KeyboardEvent): void => {
    const current = event.currentTarget;
    if (!(current instanceof HTMLButtonElement)) return;
    const index = chips.indexOf(current);
    let next = -1;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % chips.length;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + chips.length) % chips.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = chips.length - 1;
    if (next < 0) return;
    event.preventDefault();
    chips[next]?.focus();
  };
  const onClear = (): void => {
    activeFilter = 'All';
    if (search) search.value = '';
    chips.forEach((chip, index) => {
      const active = index === 0;
      chip.classList.toggle('is-active', active);
      chip.setAttribute('aria-pressed', String(active));
    });
    apply();
    search?.focus();
  };

  chips.forEach((chip) => { chip.addEventListener('click', onChipClick); chip.addEventListener('keydown', onChipKeyDown); });
  readUrlState();
  updateSearchCounter();
  search?.addEventListener('input', onSearch);
  search?.addEventListener('keydown', onSearchKeyDown);
  recentList?.addEventListener('click', onRecentClick);
  clearRecent?.addEventListener('click', onClearRecent);
  renderRecent();
  window.addEventListener('popstate', onPopState);
  document.addEventListener('keydown', onDocumentKeyDown);
  clear?.addEventListener('click', onClear);
  randomButton?.addEventListener('click', onRandom);
  apply();

  return () => {
    chips.forEach((chip) => { chip.removeEventListener('click', onChipClick); chip.removeEventListener('keydown', onChipKeyDown); });
    search?.removeEventListener('input', onSearch);
    search?.removeEventListener('keydown', onSearchKeyDown);
    recentList?.removeEventListener('click', onRecentClick);
    clearRecent?.removeEventListener('click', onClearRecent);
    window.removeEventListener('popstate', onPopState);
    document.removeEventListener('keydown', onDocumentKeyDown);
    clear?.removeEventListener('click', onClear);
    randomButton?.removeEventListener('click', onRandom);
  };
}
