export function initProjectFilter(): () => void {
  const root = document.querySelector<HTMLElement>('[data-projects-grid]');
  const search = document.querySelector<HTMLInputElement>('[data-project-search]');
  const chips = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-filter]'));
  const status = document.querySelector<HTMLElement>('[data-filter-status]');
  const empty = document.querySelector<HTMLElement>('[data-projects-empty]');
  const clear = document.querySelector<HTMLButtonElement>('[data-clear-filters]');
  const cards = root ? Array.from(root.querySelectorAll<HTMLElement>('[data-project-card]')) : [];

  if (!root || cards.length === 0) return () => undefined;

  let activeFilter = 'All';

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

  const onSearch = (): void => apply();
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

  chips.forEach((chip) => chip.addEventListener('click', onChipClick));
  search?.addEventListener('input', onSearch);
  clear?.addEventListener('click', onClear);
  apply();

  return () => {
    chips.forEach((chip) => chip.removeEventListener('click', onChipClick));
    search?.removeEventListener('input', onSearch);
    clear?.removeEventListener('click', onClear);
  };
}
