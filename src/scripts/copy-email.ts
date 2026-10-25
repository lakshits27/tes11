async function writeToClipboard(value: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      // Fall through to the selection-based fallback.
    }
  }

  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', '');
  textarea.setAttribute('aria-hidden', 'true');
  textarea.style.position = 'fixed';
  textarea.style.top = '-9999px';
  textarea.style.opacity = '0';
  document.body.append(textarea);
  textarea.select();
  let copied: boolean;
  try {
    copied = document.execCommand('copy');
  } catch {
    copied = false;
  }
  textarea.remove();
  return copied;
}

export function initCopyEmail(): () => void {
  const root = document.querySelector<HTMLElement>('[data-copy-email]');
  const button = root?.querySelector<HTMLButtonElement>('[data-copy-button]');
  const feedback = root?.querySelector<HTMLElement>('[data-copy-feedback]');
  if (!root || !button || !feedback) return () => undefined;

  const label = button.querySelector('span');
  let resetTimer = 0;

  const onClick = async (): Promise<void> => {
    const email = button.dataset.email ?? '';
    const copied = await writeToClipboard(email);
    window.clearTimeout(resetTimer);
    feedback.classList.toggle('is-error', !copied);
    feedback.textContent = copied
      ? 'Email copied to your clipboard.'
      : 'Copy unavailable here — select the email address above instead.';
    if (label) label.textContent = copied ? 'Copied!' : 'Select email';
    resetTimer = window.setTimeout(() => {
      feedback.textContent = '';
      feedback.classList.remove('is-error');
      if (label) label.textContent = 'Copy email';
    }, 3200);
  };

  button.addEventListener('click', onClick);
  return () => {
    button.removeEventListener('click', onClick);
    window.clearTimeout(resetTimer);
  };
}
