export function initHeadingPermalinks(): () => void {
  const main = document.querySelector<HTMLElement>('.page-main');
  if (!main) return () => undefined;

  const headings = Array.from(main.querySelectorAll<HTMLHeadingElement>('h2[id], h3[id]'));
  const timers = new Set<number>();
  headings.forEach((heading) => {
    if (heading.querySelector('[data-heading-permalink]')) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'heading-permalink';
    button.dataset.headingPermalink = '';
    button.textContent = '#';
    button.setAttribute('aria-label', `Copy link to ${heading.textContent?.trim() || 'section'}`);
    heading.append(button);
  });

  const copyText = async (value: string): Promise<boolean> => {
    if (navigator.clipboard && window.isSecureContext) {
      try { await navigator.clipboard.writeText(value); return true; } catch { /* use fallback */ }
    }
    const field = document.createElement('textarea');
    field.value = value;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.append(field);
    field.select();
    const copied = (() => {
      try { return document.execCommand('copy'); } catch { return false; }
    })();
    field.remove();
    return copied;
  };

  const onClick = async (event: MouseEvent): Promise<void> => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest<HTMLButtonElement>('[data-heading-permalink]');
    const heading = button?.closest<HTMLHeadingElement>('h2[id], h3[id]');
    if (!button || !heading) return;
    const url = new URL(window.location.href);
    url.hash = heading.id;
    const copied = await copyText(url.toString());
    const original = button.getAttribute('aria-label') ?? 'Copy heading link';
    button.setAttribute('aria-label', copied ? 'Heading link copied' : 'Could not copy heading link');
    button.textContent = copied ? '✓' : '!';
    const timer = window.setTimeout(() => {
      button.textContent = '#';
      button.setAttribute('aria-label', original);
      timers.delete(timer);
    }, 1600);
    timers.add(timer);
  };

  main.addEventListener('click', onClick);
  return () => {
    main.removeEventListener('click', onClick);
    timers.forEach((timer) => window.clearTimeout(timer));
    headings.forEach((heading) => heading.querySelector('[data-heading-permalink]')?.remove());
  };
}
