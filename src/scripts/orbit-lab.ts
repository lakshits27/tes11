const SVG_NS = 'http://www.w3.org/2000/svg';

export function initOrbitLab(): () => void {
  const root = document.querySelector<HTMLElement>('[data-orbit-lab]');
  if (!root) return () => undefined;

  const svg = root.querySelector<SVGSVGElement>('[data-orbit-links]');
  const core = root.querySelector<HTMLElement>('[data-orbit-core]');
  const count = root.querySelector<HTMLElement>('[data-orbit-count]');
  const title = root.querySelector<HTMLElement>('[data-orbit-title]');
  const note = root.querySelector<HTMLElement>('[data-orbit-note]');
  const nodes = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-orbit-node]'));
  if (!svg || !core || nodes.length === 0) return () => undefined;

  const active = new Set<HTMLButtonElement>();
  const lines = nodes.map((node) => {
    const line = document.createElementNS(SVG_NS, 'line');
    line.classList.add('orbit-link');
    line.setAttribute('stroke', node.dataset.color ?? '#d7ff65');
    line.setAttribute('vector-effect', 'non-scaling-stroke');
    svg.append(line);
    return line;
  });

  const updateLines = (): void => {
    const rootRect = root.getBoundingClientRect();
    if (rootRect.width < 1 || rootRect.height < 1) return;
    svg.setAttribute('viewBox', `0 0 ${rootRect.width} ${rootRect.height}`);
    const centerX = rootRect.width / 2;
    const centerY = rootRect.height / 2;
    nodes.forEach((node, index) => {
      const line = lines[index];
      if (!line) return;
      const rect = node.getBoundingClientRect();
      line.setAttribute('x1', String(centerX));
      line.setAttribute('y1', String(centerY));
      line.setAttribute('x2', String(rect.left + rect.width / 2 - rootRect.left));
      line.setAttribute('y2', String(rect.top + rect.height / 2 - rootRect.top));
    });
  };

  const sync = (): void => {
    const selected = Array.from(active);
    const last = selected.at(-1);
    if (count) count.textContent = String(active.size);
    if (active.size === 0) {
      if (title) title.textContent = 'Choose a signal';
      if (note) note.textContent = 'Activate the orbiting nodes to build your own constellation of interests.';
      core.style.removeProperty('--orbit-active');
    } else {
      if (title) title.textContent = active.size === 1 ? last?.dataset.title ?? 'Signal active' : 'Your constellation';
      if (note) note.textContent = last?.dataset.note ?? '';
      if (last?.dataset.color) core.style.setProperty('--orbit-active', last.dataset.color);
    }
    nodes.forEach((node, index) => {
      lines[index]?.classList.toggle('is-active', active.has(node));
    });
  };

  const onClick = (event: MouseEvent): void => {
    const button = event.currentTarget;
    if (!(button instanceof HTMLButtonElement)) return;
    if (active.has(button)) active.delete(button);
    else active.add(button);
    const pressed = active.has(button);
    button.setAttribute('aria-pressed', String(pressed));
    sync();
  };

  nodes.forEach((node) => node.addEventListener('click', onClick));

  let resizeObserver: ResizeObserver | null = null;
  const supportsResizeObserver = typeof ResizeObserver !== 'undefined';
  if (supportsResizeObserver) {
    resizeObserver = new ResizeObserver(() => updateLines());
    resizeObserver.observe(root);
  } else {
    window.addEventListener('resize', updateLines);
  }
  const initialFrame = window.requestAnimationFrame(updateLines);
  sync();

  return () => {
    nodes.forEach((node) => node.removeEventListener('click', onClick));
    window.cancelAnimationFrame(initialFrame);
    resizeObserver?.disconnect();
    if (!supportsResizeObserver) window.removeEventListener('resize', updateLines);
    lines.forEach((line) => line.remove());
  };
}
