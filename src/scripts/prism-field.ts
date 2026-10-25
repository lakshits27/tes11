import { clamp, getCanvas2dContext, hsl } from './utils.ts';

type PaletteName = 'aurora' | 'solar' | 'ultraviolet';
type ControlKey = 'amplitude' | 'dispersion' | 'speed';

interface Ripple {
  x: number;
  y: number;
  t: number;
  strength: number;
}

export interface PrismFieldController {
  setReducedMotion(value: boolean): void;
  destroy(): void;
}

const PALETTES: Record<PaletteName, readonly number[]> = {
  aurora: [78, 150, 190, 265, 320],
  solar: [42, 22, 8, 345, 55],
  ultraviolet: [260, 282, 305, 220, 190],
};

const DEFAULTS: Record<ControlKey, number> = {
  amplitude: 62,
  dispersion: 54,
  speed: 38,
};

export function createPrismField(): PrismFieldController | null {
  const canvas = document.querySelector<HTMLCanvasElement>('[data-prism-canvas]');
  const fps = document.querySelector<HTMLElement>('[data-prism-fps]');
  if (!canvas) return null;

  const maybeContext = getCanvas2dContext(canvas);
  if (!maybeContext) {
    if (fps) fps.textContent = 'CANVAS UNAVAILABLE';
    return null;
  }
  const ctx = maybeContext;

  const controls = Array.from(document.querySelectorAll<HTMLInputElement>('[data-prism-control]'));
  const outputs = Array.from(document.querySelectorAll<HTMLOutputElement>('[data-prism-output]'));
  const paletteSelect = document.querySelector<HTMLSelectElement>('[data-prism-palette]');
  const pulseButton = document.querySelector<HTMLButtonElement>('[data-prism-pulse]');
  const resetButton = document.querySelector<HTMLButtonElement>('[data-prism-reset]');

  const values: Record<ControlKey, number> = { ...DEFAULTS };
  let palette: PaletteName = 'aurora';
  let width = 0;
  let height = 0;
  let dpr = 1;
  let time = 0;
  let frameId = 0;
  let lastFrame = 0;
  let fpsFrames = 0;
  let fpsLast = performance.now();
  let reducedMotion = false;
  let intersecting = true;
  let pointerDown = false;
  let lastHoverRipple = 0;
  let ripples: Ripple[] = [];

  const canAnimate = (): boolean => !reducedMotion && !document.hidden && intersecting;

  const updateReadout = (now: number): void => {
    if (!fps) return;
    if (reducedMotion) {
      fps.textContent = 'STATIC';
      return;
    }
    fpsFrames += 1;
    const elapsed = now - fpsLast;
    if (elapsed >= 1000) {
      const value = Math.round((fpsFrames * 1000) / elapsed);
      fps.textContent = `${value} FPS`;
      fpsFrames = 0;
      fpsLast = now;
    }
  };

  const drawBackground = (): void => {
    ctx.fillStyle = '#080b14';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(255,255,255,0.025)';
    ctx.lineWidth = 1;
    const step = 46;
    ctx.beginPath();
    for (let x = 0; x <= width; x += step) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = 0; y <= height; y += step) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();

    const glow = ctx.createRadialGradient(width * 0.72, height * 0.35, 0, width * 0.72, height * 0.35, width * 0.55);
    glow.addColorStop(0, 'rgba(182,155,255,0.11)');
    glow.addColorStop(0.5, 'rgba(97,231,255,0.045)');
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);
  };

  const draw = (now: number): void => {
    if (width < 1 || height < 1) return;
    ripples = ripples.filter((ripple) => now - ripple.t < 1500);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawBackground();

    const hues = PALETTES[palette];
    const layers = 9;
    const amplitude = (values.amplitude / 100) * height * 0.19 + 6;
    const dispersion = (values.dispersion / 100) * height * 0.17;
    const step = Math.max(8, Math.floor(width / 150));
    const center = height * 0.5;

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (let layer = 0; layer < layers; layer += 1) {
      const layerRatio = layer / (layers - 1);
      const baseY = center + (layerRatio - 0.5) * dispersion;
      const phase = layer * 0.52;
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      hues.forEach((hue, index) => {
        gradient.addColorStop(index / (hues.length - 1), hsl(hue + layer * 7, 96, 66, 1));
      });

      ctx.beginPath();
      for (let x = 0; x <= width + step; x += step) {
        const wave =
          Math.sin(x * 0.011 + time * (0.8 + layer * 0.055) + phase) * amplitude * (0.31 + layer * 0.055) +
          Math.sin(x * 0.027 - time * 0.62 + phase * 1.7) * amplitude * 0.14;
        let y = baseY + wave;

        for (const ripple of ripples) {
          const rippleAge = (now - ripple.t) / 1000;
          const distance = Math.hypot(x - ripple.x, baseY - ripple.y);
          const decay = Math.max(0, 1 - rippleAge / 1.5) * Math.exp(-distance / (width * 0.22));
          y += Math.sin(distance * 0.045 - rippleAge * 9) * decay * ripple.strength * amplitude * 0.34;
        }

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.strokeStyle = gradient;
      ctx.globalAlpha = 0.075;
      ctx.lineWidth = 15 + layer * 0.6;
      ctx.stroke();
      ctx.globalAlpha = 0.52 + layer * 0.025;
      ctx.lineWidth = 1.3 + layer * 0.16;
      ctx.stroke();
    }

    ctx.restore();
    updateReadout(now);
  };

  const frame = (now: number): void => {
    frameId = 0;
    const delta = Math.min(50, now - lastFrame);
    lastFrame = now;
    time += delta * (0.00015 + (values.speed / 100) * 0.0024);
    draw(now);
    if (canAnimate()) frameId = window.requestAnimationFrame(frame);
  };

  const startLoop = (): void => {
    if (!canAnimate() || frameId !== 0) return;
    lastFrame = performance.now();
    fpsLast = lastFrame;
    fpsFrames = 0;
    frameId = window.requestAnimationFrame(frame);
  };

  const stopLoop = (): void => {
    if (frameId !== 0) window.cancelAnimationFrame(frameId);
    frameId = 0;
  };

  const resize = (): void => {
    const rect = canvas.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return;
    width = rect.width;
    height = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw(performance.now());
  };

  const setControl = (key: ControlKey, value: number): void => {
    values[key] = clamp(value, 0, 100);
    const input = controls.find((control) => control.dataset.prismControl === key);
    if (input) input.value = String(values[key]);
    const output = outputs.find((element) => element.dataset.prismOutput === key);
    if (output) output.textContent = String(Math.round(values[key]));
  };

  const addRipple = (x: number, y: number, strength: number): void => {
    ripples.push({ x, y, t: performance.now(), strength });
    if (ripples.length > 7) ripples.shift();
    if (reducedMotion) draw(performance.now());
    else startLoop();
  };

  const pointerPosition = (event: PointerEvent): { x: number; y: number } => {
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const onControlInput = (event: Event): void => {
    const input = event.currentTarget;
    if (!(input instanceof HTMLInputElement)) return;
    const key = input.dataset.prismControl as ControlKey | undefined;
    if (!key || !(key in values)) return;
    setControl(key, Number(input.value));
    if (reducedMotion) draw(performance.now());
  };

  const onPaletteChange = (): void => {
    const value = paletteSelect?.value;
    if (value === 'aurora' || value === 'solar' || value === 'ultraviolet') palette = value;
    if (reducedMotion) draw(performance.now());
  };

  const onPulse = (): void => {
    addRipple(width * 0.5, height * 0.5, 2.1);
    addRipple(width * 0.25, height * 0.48, 1.2);
    addRipple(width * 0.76, height * 0.53, 1.2);
    time += 0.5;
  };

  const onReset = (): void => {
    (Object.keys(DEFAULTS) as ControlKey[]).forEach((key) => setControl(key, DEFAULTS[key]));
    if (paletteSelect) paletteSelect.value = 'aurora';
    palette = 'aurora';
    ripples = [];
    time = 0;
    draw(performance.now());
  };

  const onPointerDown = (event: PointerEvent): void => {
    pointerDown = true;
    const { x, y } = pointerPosition(event);
    addRipple(x, y, 1.8);
    try {
      canvas.setPointerCapture(event.pointerId);
    } catch {
      // Pointer capture is an enhancement; the ripple still works without it.
    }
  };

  const onPointerMove = (event: PointerEvent): void => {
    const fine = event.pointerType === 'mouse' || event.pointerType === 'pen';
    if (!pointerDown && !fine) return;
    const now = performance.now();
    if (now - lastHoverRipple < 95) return;
    lastHoverRipple = now;
    const { x, y } = pointerPosition(event);
    addRipple(x, y, pointerDown ? 1.1 : 0.55);
  };

  const onPointerUp = (): void => {
    pointerDown = false;
  };

  const onVisibilityChange = (): void => {
    if (document.hidden) stopLoop();
    else if (reducedMotion) draw(performance.now());
    else startLoop();
  };

  controls.forEach((control) => control.addEventListener('input', onControlInput));
  paletteSelect?.addEventListener('change', onPaletteChange);
  pulseButton?.addEventListener('click', onPulse);
  resetButton?.addEventListener('click', onReset);
  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerUp);
  canvas.addEventListener('pointerleave', onPointerUp);
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', onVisibilityChange);

  let resizeObserver: ResizeObserver | null = null;
  if ('ResizeObserver' in window) {
    resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(canvas);
  }

  let intersectionObserver: IntersectionObserver | null = null;
  if ('IntersectionObserver' in window) {
    intersectionObserver = new IntersectionObserver(
      (entries) => {
        intersecting = entries.some((entry) => entry.isIntersecting);
        if (!intersecting) stopLoop();
        else if (!reducedMotion) startLoop();
      },
      { threshold: 0.02 },
    );
    intersectionObserver.observe(canvas);
  }

  resize();

  return {
    setReducedMotion(value: boolean): void {
      if (reducedMotion === value) return;
      reducedMotion = value;
      if (reducedMotion) {
        stopLoop();
        time = 0;
        ripples = [];
        if (fps) fps.textContent = 'STATIC';
        draw(performance.now());
      } else {
        fpsLast = performance.now();
        fpsFrames = 0;
        startLoop();
      }
    },
    destroy(): void {
      stopLoop();
      controls.forEach((control) => control.removeEventListener('input', onControlInput));
      paletteSelect?.removeEventListener('change', onPaletteChange);
      pulseButton?.removeEventListener('click', onPulse);
      resetButton?.removeEventListener('click', onReset);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);
      canvas.removeEventListener('pointerleave', onPointerUp);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      ripples = [];
    },
  };
}
