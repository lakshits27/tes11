import { spawn, type ChildProcess } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import chromium, { inflate, setupLambdaEnvironment } from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

const ROOT = process.cwd();
const PORT = 4192;
const BASE = `http://127.0.0.1:${PORT}/tes11/`;
const route = process.argv[2] ?? '';
const theme = (process.argv[3] ?? 'dark') as 'dark' | 'light';
const width = Number(process.argv[4] ?? 1440);
const height = Number(process.argv[5] ?? 950);
const OUT = path.join(ROOT, '.shots', theme);

const server: ChildProcess = spawn(
  'node',
  [path.join(ROOT, 'node_modules/vite/bin/vite.js'), 'preview', '--host', '127.0.0.1', '--port', String(PORT), '--strictPort'],
  { cwd: ROOT, detached: true, stdio: 'ignore' },
);

async function waitForServer(): Promise<void> {
  for (let i = 0; i < 80; i += 1) {
    try {
      const r = await fetch(BASE);
      if (r.ok) return;
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error('server failed');
}

try {
  mkdirSync(OUT, { recursive: true });
  const binPath = path.join(ROOT, 'node_modules/@sparticuz/chromium/bin');
  const libDir = await inflate(path.join(binPath, 'al2023.tar.br'));
  setupLambdaEnvironment(path.join(libDir, 'lib'));
  await waitForServer();
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
  });
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  await page.evaluateOnNewDocument((t) => {
    try {
      localStorage.setItem('lavi-theme', t);
    } catch {
      /* ignore */
    }
  }, theme);
  await page.goto(new URL(route, BASE).toString(), { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 600));
  const docHeight = await page.evaluate(() => document.body.scrollHeight);
  const step = Math.round(height * 0.85);
  let i = 0;
  for (let y = 0; y < docHeight; y += step) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await new Promise((r) => setTimeout(r, 420));
    const name = route.replace(/\//g, '-') || 'home';
    await page.screenshot({ path: path.join(OUT, `${name}-${String(i).padStart(2, '0')}.png`) });
    i += 1;
  }
  console.info(`${theme} ${route || 'home'} segments=${i} h=${docHeight} w=${width}`);
  await browser.close();
} finally {
  process.kill(-server.pid!);
}
