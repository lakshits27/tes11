export function initReadingProgress(): () => void {
  const root = document.querySelector<HTMLElement>('[data-reading-progress]');
  const fill = root?.querySelector<HTMLElement>('[data-reading-progress-fill]');
  const value = root?.querySelector<HTMLOutputElement>('[data-reading-progress-value]');
  if (!root || !fill || !value) return () => undefined;

  let frame = 0;
  const update = (): void => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)) : 100;
      const rounded = Math.round(progress);
      fill.style.transform = `scaleX(${progress / 100})`;
      value.value = `${rounded}%`;
      value.textContent = `${rounded}%`;
      root.setAttribute('aria-valuenow', String(rounded));
      root.hidden = scrollable <= 0;
    });
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener('scroll', update);
    window.removeEventListener('resize', update);
  };
}
