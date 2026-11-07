export function initPageShare(): () => void {
  const button = document.querySelector<HTMLButtonElement>('[data-share-page]');
  const feedback = document.querySelector<HTMLElement>('[data-share-feedback]');
  if (!button || !feedback) return () => undefined;

  const originalLabel = button.textContent?.trim() ?? 'Share this page';
  const onClick = async (): Promise<void> => {
    const shareData = { title: document.title, url: window.location.href };
    button.disabled = true;
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        feedback.textContent = 'Share sheet opened.';
      } else if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareData.url);
        feedback.textContent = 'Page link copied.';
      } else {
        feedback.textContent = 'Sharing is unavailable in this browser. Copy the page URL from the address bar.';
      }
    } catch (error) {
      feedback.textContent = error instanceof DOMException && error.name === 'AbortError'
        ? 'Sharing cancelled.'
        : 'Could not share automatically. Copy the page URL from the address bar.';
    } finally {
      button.disabled = false;
      button.textContent = originalLabel;
    }
  };

  button.addEventListener('click', onClick);
  return () => button.removeEventListener('click', onClick);
}
