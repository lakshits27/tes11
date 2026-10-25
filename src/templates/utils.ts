export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function jsonLd(value: Record<string, unknown> | Record<string, unknown>[]): string {
  return JSON.stringify(value).replaceAll('<', '\\u003c').replaceAll('&', '\\u0026');
}

export function tags(items: readonly string[], className = 'tags'): string {
  return `<ul class="${className}" aria-label="Topics">${items
    .map((item) => `<li class="tag">${escapeHtml(item)}</li>`)
    .join('')}</ul>`;
}

export function list(items: readonly string[], className = 'plain-list'): string {
  return `<ul class="${className}">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

export function externalAttrs(url: string): string {
  return url.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : '';
}

export function dateLabel(value: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`));
}
