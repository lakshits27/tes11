import assert from 'node:assert/strict';
import { spawn, type ChildProcess } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { after, before, describe, it } from 'node:test';
import chromium, { inflate, setupLambdaEnvironment } from '@sparticuz/chromium';
import puppeteer, { type Browser, type Page } from 'puppeteer-core';

const ROOT = process.cwd();
const PORT = 4183;
const BASE = `http://127.0.0.1:${PORT}/tes11/`;
const ORIGIN = new URL(BASE).origin;

let server: ChildProcess | null = null;
let browser: Browser | null = null;
let axeSource = '';
let serverLog = '';

interface PageSession {
  page: Page;
  errors: string[];
}

async function waitForServer(): Promise<void> {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const response = await fetch(BASE);
      if (response.ok) return;
    } catch {
      // Server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Preview server did not start. Logs:\n${serverLog}`);
}

async function openPage(route = '', options: { reducedMotion?: boolean } = {}): Promise<PageSession> {
  if (!browser) throw new Error('Browser not initialised');
  const page = await browser.newPage();
  page.setDefaultTimeout(15000);
  page.setDefaultNavigationTimeout(30000);
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.setCacheEnabled(false);
  if (options.reducedMotion) {
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  }
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });
  page.on('pageerror', (error) => errors.push(`pageerror: ${error instanceof Error ? error.message : String(error)}`));
  page.on('requestfailed', (request) => {
    const reason = request.failure()?.errorText ?? '';
    if (!reason.includes('ERR_ABORTED')) errors.push(`request: ${request.url()} — ${reason}`);
  });
  const response = await page.goto(new URL(route, BASE).toString(), { waitUntil: 'networkidle0' });
  assert.ok(response && [200, 304].includes(response.status()), `Expected a successful response for ${route || '/'}`);
  await page.evaluate(() => document.fonts.ready);
  return { page, errors };
}

before(async () => {
  axeSource = await readFile(path.join(ROOT, 'node_modules/axe-core/axe.min.js'), 'utf8');
  const viteBin = path.join(ROOT, 'node_modules/vite/bin/vite.js');
  server = spawn('node', [viteBin, 'preview', '--host', '127.0.0.1', '--port', String(PORT), '--strictPort'], {
    cwd: ROOT,
    detached: true,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  server.stdout?.on('data', (chunk: Buffer) => {
    serverLog += chunk.toString();
  });
  server.stderr?.on('data', (chunk: Buffer) => {
    serverLog += chunk.toString();
  });
  await waitForServer();

  const binPath = path.join(ROOT, 'node_modules/@sparticuz/chromium/bin');
  const libDir = await inflate(path.join(binPath, 'al2023.tar.br'));
  setupLambdaEnvironment(path.join(libDir, 'lib'));
  chromium.setGraphicsMode = false;
  const executablePath = await chromium.executablePath();
  browser = await puppeteer.launch({
    executablePath,
    args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox'],
    headless: true,
    protocolTimeout: 90000,
  });
  await browser.defaultBrowserContext().overridePermissions(ORIGIN, ['clipboard-read', 'clipboard-write']);
});

after(async () => {
  await browser?.close();
  if (server?.pid) {
    try {
      process.kill(-server.pid, 'SIGTERM');
    } catch {
      server.kill('SIGTERM');
    }
  }
});

describe('portfolio browser checks', () => {
  it('loads every major route directly and survives a nested-route refresh', async () => {
    const routes = [
      '',
      'projects/',
      'projects/sortify/',
      'projects/veylo/',
      'projects/sabuddy/',
      'projects/facilityfix/',
      'projects/sarp/',
      'projects/pustakalaya/',
      'about/',
      'playground/',
      'contact/',
      'now/',
      'uses/',
    ];
    const { page, errors } = await openPage();
    for (const route of routes) {
      const response = await page.goto(new URL(route, BASE).toString(), { waitUntil: 'domcontentloaded' });
      assert.ok(response && [200, 304].includes(response.status()), `Route ${route} returned ${response?.status() ?? 'no response'}`);
      const h1 = await page.$eval('h1', (element) => element.textContent?.trim() ?? '');
      assert.ok(h1.length > 0, `Route ${route} has empty h1`);
    }
    await page.goto(new URL('projects/sarp/', BASE).toString(), { waitUntil: 'domcontentloaded' });
    await page.reload({ waitUntil: 'domcontentloaded' });
    assert.match(await page.$eval('h1', (element) => element.textContent ?? ''), /Sarp/);
    assert.deepEqual(errors, [], 'Console or request errors on major routes');
    await page.close();
  });

  it('navigates from home to projects and through the project portal transition', async () => {
    const { page, errors } = await openPage();
    await page.click('.desktop-nav a[href="/tes11/projects/"]');
    await page.waitForFunction(() => location.pathname.endsWith('/projects/'));
    const navigationPromise = page.waitForNavigation({ waitUntil: 'domcontentloaded' });
    await page.click('.project-card__media[data-portal]');
    await page.waitForSelector('.portal-overlay');
    await navigationPromise;
    assert.match(page.url(), /\/projects\/sortify\/$/);
    assert.match(await page.$eval('h1', (element) => element.textContent ?? ''), /Sortify/);
    assert.deepEqual(errors, [], 'Console or request errors during navigation');
    await page.close();
  });

  it('loads the local illustrated avatar and renders the signature rainbow trail', async () => {
    const { page, errors } = await openPage();
    const avatar = await page.$eval('.hero__portrait img', (element) => {
      const image = element as HTMLImageElement;
      return { complete: image.complete, width: image.naturalWidth, src: image.currentSrc };
    });
    assert.equal(avatar.complete, true);
    assert.ok(avatar.width > 300, 'Avatar should have a real intrinsic width');
    assert.match(avatar.src, /lakshit-avatar\.webp$/);

    const finePointer = await page.evaluate(() => matchMedia('(hover: hover) and (pointer: fine)').matches);
    if (finePointer) {
      for (let step = 0; step < 14; step += 1) {
        await page.mouse.move(120 + step * 38, 220 + Math.sin(step / 2) * 90);
      }
      await page.waitForFunction(() => {
        const canvas = document.querySelector<HTMLCanvasElement>('#spectral-trail');
        if (!canvas) return false;
        const context = canvas.getContext('2d');
        if (!context) return false;
        const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
        let painted = 0;
        for (let index = 3; index < pixels.length; index += 4) {
          if ((pixels[index] ?? 0) > 0) painted += 1;
        }
        return painted > 100;
      });
    }
    assert.deepEqual(errors, [], 'Console or request errors on home');
    await page.close();
  });

  it('supports keyboard filtering, clear feedback, and keyboard interest selection', async () => {
    const { page, errors } = await openPage('projects/');
    await page.focus('[data-project-search]');
    await page.keyboard.type('sarp');
    await page.waitForFunction(() => document.querySelectorAll('[data-project-card]:not([hidden])').length === 1);
    const status = await page.$eval('[data-filter-status]', (element) => element.textContent ?? '');
    assert.match(status, /1 project matching/);
    await page.focus('[data-project-search]');
    await page.keyboard.type('not-a-real-project');
    await page.waitForSelector('[data-projects-empty]:not([hidden])');
    await page.click('[data-clear-filters]');
    await page.waitForFunction(() => document.querySelectorAll('[data-project-card]:not([hidden])').length === 6);
    await page.focus('[data-filter="Game"]');
    await page.keyboard.press('Enter');
    assert.equal(await page.$$eval('[data-project-card]:not([hidden])', (elements) => elements.length), 1);
    assert.equal(await page.$eval('[data-filter="Game"]', (element) => element.getAttribute('aria-pressed')), 'true');
    await page.goto(new URL('about/', BASE).toString(), { waitUntil: 'domcontentloaded' });
    await page.focus('[data-interest-node="music"]');
    assert.equal(await page.$eval('[data-interest-title]', (element) => element.textContent), 'Music');
    assert.deepEqual(errors, [], 'Console or request errors during keyboard tests');
    await page.close();
  });

  it('opens the mobile menu, navigates, and respects reduced motion', async () => {
    const { page, errors } = await openPage();
    await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
    await page.reload({ waitUntil: 'domcontentloaded' });
    assert.equal(await page.$eval('[data-menu-toggle]', (element) => getComputedStyle(element).display !== 'none'), true);
    await page.click('[data-menu-toggle]');
    await page.waitForSelector('#mobile-menu:not([hidden])');
    assert.equal(await page.$eval('[data-menu-toggle]', (element) => element.getAttribute('aria-expanded')), 'true');
    await page.click('#mobile-menu a[href="/tes11/projects/"]');
    await page.waitForFunction(() => location.pathname.endsWith('/projects/'));
    assert.equal(await page.$eval('#mobile-menu', (element) => (element as HTMLElement).hidden), true);
    assert.deepEqual(errors, [], 'Console or request errors in mobile navigation');
    await page.close();

    const reduced = await openPage('playground/', { reducedMotion: true });
    assert.equal(await reduced.page.$eval('#spectral-trail', (element) => getComputedStyle(element).display), 'none');
    assert.equal(await reduced.page.$eval('[data-prism-fps]', (element) => element.textContent?.trim()), 'STATIC');
    assert.deepEqual(reduced.errors, [], 'Console or request errors with reduced motion');
    await reduced.page.close();
  });

  it('runs both playground experiments and copies the verified email', async () => {
    const { page, errors } = await openPage('playground/');
    await page.$eval('#prism-amplitude', (element) => {
      const input = element as HTMLInputElement;
      input.value = '91';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    assert.equal(await page.$eval('[data-prism-output="amplitude"]', (element) => element.textContent), '91');
    await page.click('[data-prism-pulse]');
    await page.waitForFunction(() => {
      const canvas = document.querySelector<HTMLCanvasElement>('[data-prism-canvas]');
      return Boolean(canvas && canvas.width > 0 && canvas.toDataURL().length > 10000);
    });
    await page.click('[data-orbit-node="code"]');
    assert.equal(await page.$eval('[data-orbit-count]', (element) => element.textContent), '1');
    assert.equal(await page.$eval('[data-orbit-node="code"]', (element) => element.getAttribute('aria-pressed')), 'true');
    assert.equal(await page.$$eval('.orbit-link.is-active', (elements) => elements.length), 1);
    await page.goto(new URL('contact/', BASE).toString(), { waitUntil: 'domcontentloaded' });
    await page.click('[data-copy-button]');
    await page.waitForFunction(() => (document.querySelector('[data-copy-feedback]')?.textContent ?? '').includes('copied'));
    const feedback = await page.$eval('[data-copy-feedback]', (element) => element.textContent ?? '');
    assert.match(feedback, /copied/i);
    const clipboard = await page.evaluate(async () => {
      try {
        return await navigator.clipboard.readText();
      } catch {
        return null;
      }
    });
    if (clipboard !== null) assert.equal(clipboard, 'lakshitsinghsaini@gmail.com');
    assert.deepEqual(errors, [], 'Console or request errors in experiments/contact');
    await page.close();
  });

  it('has no horizontal overflow at 320, 390, 768, and 1440 pixels', async () => {
    const { page, errors } = await openPage();
    const routes = ['', 'projects/', 'projects/pustakalaya/', 'about/', 'playground/', 'contact/'];
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewport({ width, height: 900, isMobile: width < 500, hasTouch: width < 500, deviceScaleFactor: 1 });
      for (const route of routes) {
        await page.goto(new URL(route, BASE).toString(), { waitUntil: 'domcontentloaded' });
        const measurements = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth: window.innerWidth,
        }));
        assert.ok(
          measurements.scrollWidth <= measurements.innerWidth + 1,
          `Horizontal overflow at ${width}px on ${route || '/'}: ${measurements.scrollWidth} > ${measurements.innerWidth}`,
        );
      }
    }
    assert.deepEqual(errors, [], 'Console or request errors during responsive checks');
    await page.close();
  });

  it('passes axe-core accessibility checks on representative pages', async () => {
    const routes = ['', 'projects/', 'projects/sortify/', 'about/', 'playground/', 'contact/'];
    const violationsByRoute: Record<string, string[]> = {};
    for (const route of routes) {
      const { page, errors } = await openPage(route);
      await page.addScriptTag({ content: axeSource });
      const violations = await page.evaluate(async () => {
        const axe = (
          window as typeof window & {
            axe?: {
              run: (context: Document) => Promise<{ violations: Array<{ id: string; impact?: string; nodes: unknown[] }> }>;
            };
          }
        ).axe;
        if (!axe) throw new Error('axe-core was not injected');
        const result = await axe.run(document);
        return result.violations.map((violation) => `${violation.id} (${violation.nodes.length})`);
      });
      violationsByRoute[route || '/'] = violations;
      assert.deepEqual(errors, [], `Console or request errors on ${route || '/'}`);
      await page.close();
    }
    assert.deepEqual(violationsByRoute, Object.fromEntries(routes.map((route) => [route || '/', []])), 'Axe violations found');
  });
});
