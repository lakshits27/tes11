export function initInterestCompass(): () => void {
  const root = document.querySelector<HTMLElement>('[data-interest-compass]');
  if (!root) return () => undefined;

  const nodes = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-interest-node]'));
  const title = root.querySelector<HTMLElement>('[data-interest-title]');
  const description = root.querySelector<HTMLElement>('[data-interest-description]');
  const count = root.querySelector<HTMLElement>('[data-interest-count]');
  if (nodes.length === 0) return () => undefined;

  const select = (button: HTMLButtonElement): void => {
    nodes.forEach((node) => {
      const active = node === button;
      node.classList.toggle('is-active', active);
      node.setAttribute('aria-pressed', String(active));
    });
    if (title) title.textContent = button.dataset.title ?? '';
    if (description) description.textContent = button.dataset.description ?? '';
    if (count) count.textContent = `0${nodes.indexOf(button) + 1} / 0${nodes.length}`;
  };

  const onClick = (event: MouseEvent): void => {
    const button = event.currentTarget;
    if (button instanceof HTMLButtonElement) select(button);
  };

  const onFocusIn = (event: FocusEvent): void => {
    const button = event.target;
    if (button instanceof HTMLButtonElement && button.matches('[data-interest-node]')) select(button);
  };

  nodes.forEach((node) => node.addEventListener('click', onClick));
  root.addEventListener('focusin', onFocusIn);

  return () => {
    nodes.forEach((node) => node.removeEventListener('click', onClick));
    root.removeEventListener('focusin', onFocusIn);
  };
}
