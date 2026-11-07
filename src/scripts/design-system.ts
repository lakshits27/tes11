export function initDesignSystem(): () => void {
  const page = document.querySelector<HTMLElement>('.design-system-page');
  if (!page) return () => undefined;
  const onClick = async (event: MouseEvent): Promise<void> => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const iconButton = target.closest<HTMLButtonElement>('[data-copy-icon]');
    if (iconButton) {
      const name = iconButton.dataset.copyIcon ?? '';
      let copied = false;
      try {
        if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(name); copied = true; }
        else {
          const field = document.createElement('textarea'); field.value = name; field.setAttribute('readonly', '');
          field.style.position = 'fixed'; field.style.opacity = '0'; field.style.top = '-9999px';
          document.body.append(field); field.select(); copied = document.execCommand('copy'); field.remove();
        }
      } catch { copied = false; }
      const original = iconButton.textContent;
      iconButton.textContent = copied ? 'Copied' : 'Copy failed';
      window.setTimeout(() => { iconButton.textContent = original; }, 1600);
      return;
    }
    const button = target.closest<HTMLButtonElement>('[data-copy-token]');
    if (!button) return;
    const card = button.closest<HTMLElement>('.ds-color-token');
    const swatch = card?.querySelector<HTMLElement>('.ds-color-token__swatch');
    if (!swatch) return;
    const rgb = getComputedStyle(swatch).backgroundColor.match(/[\d.]+/g);
    if (!rgb || rgb.length < 3) return;
    const hex = `#${rgb.slice(0, 3).map((part) => Math.round(Number(part)).toString(16).padStart(2, '0')).join('')}`;
    let copied = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(hex);
        copied = true;
      } else {
        const input = document.createElement('textarea');
        input.value = hex;
        input.setAttribute('readonly', '');
        input.style.position = 'fixed';
        input.style.opacity = '0';
        input.style.top = '-9999px';
        document.body.append(input);
        input.select();
        copied = document.execCommand('copy');
        input.remove();
      }
    } catch { copied = false; }
    const previous = button.textContent;
    button.textContent = copied ? 'Copied' : 'Copy failed';
    button.setAttribute('aria-label', copied ? `Copied ${hex}` : 'Could not copy color value');
    window.setTimeout(() => {
      button.textContent = previous;
      button.setAttribute('aria-label', 'Copy token hex value');
    }, 1600);
  };
  page.addEventListener('click', onClick);
  return () => page.removeEventListener('click', onClick);
}
