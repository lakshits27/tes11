import { clampHslForTheme, getCanvas2dContext, hsl, randomBetween } from './utils.ts';

const THEME_CHANGE_EVENT = 'lavi:themechange';
type ThemeMode = 'dark' | 'light';

interface TrailPoint {
  x: number;
  y: number;
  t: number;
  hue: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  t: number;
  life: number;
  size: number;
  color: string;
}

export interface SpectralTrailController {
  setEnabled(enabled: boolean): void;
  destroy(): void;
}

const POINT_LIFE = 720;
const MAX_POINTS = 64;
const MAX_SPARKS = 90;
const INTERACTIVE_SELECTOR = 'a, button, input, select, textarea, [data-spark]';

export function createSpectralTrail(canvas: HTMLCanvasElement | null): SpectralTrailController | null {
  if (!canvas) return null;
  const maybeContext = getCanvas2dContext(canvas);
  if (!maybeContext) return null;
  const ctx = maybeContext;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let enabled = false;
  let attached = false;
  let frameId = 0;
  let lastHoverBurst = 0;
  let theme: ThemeMode = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
  let points: TrailPoint[] = [];
  let sparks: Spark[] = [];

  const onThemeChange = (event: Event): void => {
    theme = (event as CustomEvent<ThemeMode>).detail === 'light' ? 'light' : 'dark';
    if (enabled) ensureFrame();
  };

  const clear = (): void => {
    ctx.clearRect(0, 0, width, height);
  };

  const resize = (): void => {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    clear();
  };

  const ensureFrame = (): void => {
    if (!enabled || document.hidden || frameId !== 0) return;
    frameId = window.requestAnimationFrame(frame);
  };

  const burst = (x: number, y: number, rawColor: string, count = 9): void => {
    const now = performance.now();
    const color = clampHslForTheme(rawColor, theme);
    for (let index = 0; index < count; index += 1) {
      const angle = (Math.PI * 2 * index) / count + randomBetween(-0.25, 0.25);
      const speed = randomBetween(45, 150);
      sparks.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        t: now,
        life: randomBetween(480, 820),
        size: randomBetween(1.6, 3.6),
        color,
      });
    }
    if (sparks.length > MAX_SPARKS) sparks.splice(0, sparks.length - MAX_SPARKS);
    ensureFrame();
  };

  const frame = (now: number): void => {
    frameId = 0;
    points = points.filter((point) => now - point.t < POINT_LIFE);
    sparks = sparks.filter((spark) => now - spark.t < spark.life);
    clear();

    ctx.save();
    /* Additive light on dark surfaces; normal alpha with multiply blend on paper. */
    ctx.globalCompositeOperation = theme === 'light' ? 'source-over' : 'lighter';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (points.length > 1) {
      const coreLightness = theme === 'light' ? 48 : 70;
      const glowLightness = theme === 'light' ? 42 : 62;
      const coreAlpha = theme === 'light' ? 0.78 : 0.82;
      const glowAlpha = theme === 'light' ? 0.12 : 0.09;
      for (let index = 1; index < points.length; index += 1) {
        const previous = points[index - 1];
        const current = points[index];
        if (!previous || !current) continue;
        const age = Math.max(0, Math.min(1, (now - current.t) / POINT_LIFE));
        const fade = 1 - age;
        const color = hsl(current.hue, 96, coreLightness, fade * coreAlpha);

        ctx.beginPath();
        ctx.moveTo(previous.x, previous.y);
        ctx.lineTo(current.x, current.y);
        ctx.strokeStyle = hsl(current.hue, 92, glowLightness, fade * glowAlpha);
        ctx.lineWidth = 18 * fade + 2;
        ctx.stroke();
        ctx.strokeStyle = color;
        ctx.lineWidth = 3.4 * fade + 0.7;
        ctx.stroke();
      }
    }

    sparks.forEach((spark) => {
      const age = Math.max(0, Math.min(1, (now - spark.t) / spark.life));
      const seconds = age * (spark.life / 1000);
      const x = spark.x + spark.vx * seconds;
      const y = spark.y + spark.vy * seconds + 80 * seconds * seconds;
      ctx.globalAlpha = (1 - age) * 0.8;
      ctx.fillStyle = spark.color;
      ctx.beginPath();
      ctx.arc(x, y, Math.max(0.3, spark.size * (1 - age)), 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();

    if (points.length > 0 || sparks.length > 0) ensureFrame();
  };

  const onPointerMove = (event: PointerEvent): void => {
    if (!enabled || event.pointerType === 'touch') return;
    const now = performance.now();
    const last = points[points.length - 1];
    if (last) {
      const distance = Math.hypot(event.clientX - last.x, event.clientY - last.y);
      const steps = Math.min(5, Math.floor(distance / 28));
      for (let step = 1; step <= steps; step += 1) {
        const ratio = step / (steps + 1);
        points.push({
          x: last.x + (event.clientX - last.x) * ratio,
          y: last.y + (event.clientY - last.y) * ratio,
          t: now - (steps - step) * 7,
          hue: now / 13 + event.clientX / 5 + step * 12,
        });
      }
    }
    points.push({
      x: event.clientX,
      y: event.clientY,
      t: now,
      hue: now / 13 + event.clientX / 5,
    });
    if (points.length > MAX_POINTS) points.splice(0, points.length - MAX_POINTS);
    ensureFrame();
  };

  const onPointerOver = (event: PointerEvent): void => {
    if (!enabled || event.pointerType === 'touch') return;
    const now = performance.now();
    if (now - lastHoverBurst < 110) return;
    const target = event.target;
    if (!(target instanceof Element)) return;
    const interactive = target.closest(INTERACTIVE_SELECTOR);
    if (!(interactive instanceof HTMLElement)) return;
    if (interactive.matches('input, select, textarea')) return;
    lastHoverBurst = now;
    const rect = interactive.getBoundingClientRect();
    const accent = interactive.dataset.accent ?? '#d7ff65';
    burst(rect.left + rect.width / 2, rect.top + rect.height / 2, accent, 7);
  };

  const onVisibilityChange = (): void => {
    if (document.hidden) {
      if (frameId !== 0) window.cancelAnimationFrame(frameId);
      frameId = 0;
    } else {
      ensureFrame();
    }
  };

  const attach = (): void => {
    if (attached) return;
    attached = true;
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerover', onPointerOver, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener(THEME_CHANGE_EVENT, onThemeChange as EventListener);
    resize();
  };

  const detach = (): void => {
    if (!attached) return;
    attached = false;
    window.removeEventListener('resize', resize);
    window.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerover', onPointerOver);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    window.removeEventListener(THEME_CHANGE_EVENT, onThemeChange as EventListener);
    if (frameId !== 0) window.cancelAnimationFrame(frameId);
    frameId = 0;
    points = [];
    sparks = [];
    clear();
  };

  return {
    setEnabled(next: boolean): void {
      if (enabled === next) return;
      enabled = next;
      if (enabled) {
        attach();
        ensureFrame();
      } else {
        detach();
      }
    },
    destroy(): void {
      enabled = false;
      detach();
    },
  };
}
