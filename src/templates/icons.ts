export type IconName =
  | 'arrow-up-right'
  | 'arrow-right'
  | 'arrow-left'
  | 'github'
  | 'instagram'
  | 'x'
  | 'mail'
  | 'copy'
  | 'check'
  | 'menu'
  | 'close'
  | 'spark'
  | 'space'
  | 'music'
  | 'game'
  | 'future'
  | 'code'
  | 'ideas'
  | 'prism'
  | 'orbit'
  | 'search'
  | 'filter'
  | 'terminal'
  | 'layers'
  | 'compass'
  | 'pause'
  | 'play'
  | 'reset'
  | 'sun'
  | 'moon';

const PATHS: Record<IconName, string> = {
  'arrow-up-right': '<path d="M7 17 17 7M8 7h9v9"/>',
  'arrow-right': '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  'arrow-left': '<path d="M19 12H5m6 6-6-6 6-6"/>',
  github:
    '<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 6v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6A4.6 4.6 0 0 0 18.8 7a4.3 4.3 0 0 0-.1-3.2s-1-.3-3.2 1.2a11 11 0 0 0-5.9 0C7.4 3.5 6.4 3.8 6.4 3.8A4.3 4.3 0 0 0 6.3 7 4.6 4.6 0 0 0 5 10.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V22"/>',
  instagram:
    '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
  x: '<path d="M4 4l16 16M20 4 4 20"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m3 8 9 6 9-6"/>',
  copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M15 5H6a2 2 0 0 0-2 2v9"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  spark: '<path d="M12 2v6m0 8v6M2 12h6m8 0h6M5 5l4 4m6 6 4 4M19 5l-4 4m-6 6-4 4"/>',
  space: '<circle cx="12" cy="12" r="4"/><path d="M4.5 9C2 13 4 19 9 20c3 .6 5-1.3 3-3.4M19.5 15c2.5-4 .5-10-4.5-11-3-.6-5 1.3-3 3.4"/><path d="M18 4h.01M5 20h.01"/>',
  music: '<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
  game: '<rect x="2" y="7" width="20" height="12" rx="5"/><path d="M7 11v4M5 13h4M16 12h.01M19 15h.01"/>',
  future: '<path d="M12 3v4m0 10v4M3 12h4m10 0h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/><circle cx="12" cy="12" r="3"/>',
  code: '<path d="m8 8-4 4 4 4m8-8 4 4-4 4M14 5l-4 14"/>',
  ideas: '<path d="M9 18h6m-5 3h4M8 14a6 6 0 1 1 8 0c-.9.8-1 1.5-1 3H9c0-1.5-.1-2.2-1-3Z"/>',
  prism: '<path d="m12 3 9 17H3L12 3Z"/><path d="m12 3-3 17m3-17 3 17M3 20h18"/>',
  orbit: '<circle cx="12" cy="12" r="3"/><ellipse cx="12" cy="12" rx="10" ry="5" transform="rotate(-25 12 12)"/><circle cx="20" cy="8" r="1.5" fill="currentColor" stroke="none"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  filter: '<path d="M3 5h18l-7 8v6l-4 2v-8L3 5Z"/>',
  terminal: '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="m7 9 3 3-3 3m6 0h4"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m15 9-2 5-4 1 2-5 4-1Z"/>',
  pause: '<path d="M9 5v14M15 5v14"/>',
  play: '<path d="m8 5 11 7-11 7V5Z"/>',
  reset: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8m0-5v5h5"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z"/>',
};

export function icon(name: IconName, className = 'icon'): string {
  return `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${PATHS[name]}</svg>`;
}

export function wordmarkGlyph(): string {
  return `<svg viewBox="0 0 44 44" aria-hidden="true" focusable="false"><defs><linearGradient id="wordmark-gradient" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#d7ff65"/><stop offset=".45" stop-color="#61e7ff"/><stop offset="1" stop-color="#b69bff"/></linearGradient></defs><path d="M10 7h7v23h17v7H10V7Z" fill="url(#wordmark-gradient)"/><circle cx="34" cy="10" r="4" fill="#ff78b7"/></svg>`;
}
