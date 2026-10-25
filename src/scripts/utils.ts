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

export function getCanvas2dContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D | null {
  try {
    return canvas.getContext('2d');
  } catch {
    return null;
  }
}
