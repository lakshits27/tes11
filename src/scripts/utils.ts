export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
export const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)';

export function prefersReducedMotion(): boolean {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

export function hasFinePointer(): boolean {
  return window.matchMedia(FINE_POINTER_QUERY).matches;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export function hsl(hue: number, saturation = 95, lightness = 68, alpha = 1): string {
  return `hsla(${((hue % 360) + 360) % 360}, ${saturation}%, ${lightness}%, ${alpha})`;
}

/** Parse a #rgb / #rrggbb hex string into HSL components (hue in 0–360). */
export function hexToHsl(hex: string): { hue: number; saturation: number; lightness: number } | null {
  const match = /^#?([a-f\d]{6}|[a-f\d]{3})$/i.exec(hex.trim());
  if (!match) return null;
  let value = match[1] ?? '';
  if (value.length === 3) {
    value = value
      .split('')
      .map((char) => char + char)
      .join('');
  }
  const r = parseInt(value.slice(0, 2), 16) / 255;
  const g = parseInt(value.slice(2, 4), 16) / 255;
  const b = parseInt(value.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2;
  const delta = max - min;
  if (delta === 0) return { hue: 0, saturation: 0, lightness: Math.round(lightness * 100) };
  const saturation = delta / (1 - Math.abs(2 * lightness - 1));
  let hue: number;
  if (max === r) hue = ((g - b) / delta) % 6;
  else if (max === g) hue = (b - r) / delta + 2;
  else hue = (r - g) / delta + 4;
  hue = Math.round(hue * 60);
  if (hue < 0) hue += 360;
  return { hue, saturation: Math.round(saturation * 100), lightness: Math.round(lightness * 100) };
}

export function clampHslForTheme(hex: string, theme: 'dark' | 'light'): string {
  const parsed = hexToHsl(hex);
  if (!parsed) return hex;
  if (theme === 'light') {
    return hsl(parsed.hue, Math.min(parsed.saturation, 88), Math.min(parsed.lightness, 50), 1);
  }
  return hex;
}

export function getCanvas2dContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D | null {
  try {
    return canvas.getContext('2d');
  } catch {
    return null;
  }
}
