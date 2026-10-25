import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { PROJECTS } from '../src/content/projects.ts';
import { SITE } from '../src/content/site.ts';
import { coverSvg } from '../src/templates/covers.ts';

const ROOT = process.cwd();
const SOURCE = path.join(ROOT, 'assets-source');
const PUBLIC = path.join(ROOT, 'public');

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#d7ff65"/><stop offset=".45" stop-color="#61e7ff"/><stop offset="1" stop-color="#b69bff"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="18" fill="#0a0c15"/>
  <path d="M18 12h10v31h18v9H18V12Z" fill="url(#g)"/>
  <circle cx="45" cy="17" r="5" fill="#ff78b7"/>
</svg>`;

function defaultOgSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#11182a"/><stop offset="1" stop-color="#070810"/></linearGradient>
      <linearGradient id="spectrum" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#d7ff65"/><stop offset=".5" stop-color="#61e7ff"/><stop offset="1" stop-color="#b69bff"/></linearGradient>
      <radialGradient id="glow"><stop stop-color="#b69bff" stop-opacity=".35"/><stop offset="1" stop-color="#b69bff" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#bg)"/>
    <circle cx="930" cy="260" r="360" fill="url(#glow)"/>
    <path d="M-80 540 C250 330 420 600 700 410 S1050 190 1280 300" fill="none" stroke="url(#spectrum)" stroke-width="10" opacity=".75"/>
    <path d="M-80 575 C250 365 420 635 700 445 S1050 225 1280 335" fill="none" stroke="#61e7ff" stroke-width="2" opacity=".4"/>
    <circle cx="1030" cy="90" r="110" fill="none" stroke="#d7ff65" stroke-opacity=".22" stroke-width="2" stroke-dasharray="5 14"/>
    <text x="72" y="105" fill="#d7ff65" font-size="22" font-family="monospace" letter-spacing="7">LAKSHIT SINGH SAINI / LAVI</text>
    <text x="66" y="300" fill="#ffffff" font-size="148" font-weight="800" font-family="Arial, Helvetica, sans-serif" letter-spacing="-8">CURIOUS</text>
    <text x="66" y="430" fill="url(#spectrum)" font-size="148" font-weight="800" font-family="Arial, Helvetica, sans-serif" letter-spacing="-8">BUILDER.</text>
    <text x="72" y="510" fill="#aeb6cc" font-size="30" font-family="Arial, Helvetica, sans-serif">Interactive portfolio · Projects · Playground</text>
    <text x="72" y="575" fill="#7d859c" font-size="20" font-family="monospace">${escapeXml(SITE.productionUrl.replace('https://', ''))}</text>
  </svg>`;
}

function projectOgOverlay(project: (typeof PROJECTS)[number]): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <defs><linearGradient id="shade" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#070810" stop-opacity="0"/><stop offset=".56" stop-color="#070810" stop-opacity=".08"/><stop offset="1" stop-color="#070810" stop-opacity=".88"/></linearGradient></defs>
    <rect width="1200" height="630" fill="url(#shade)"/>
    <text x="60" y="76" fill="${project.accent}" font-size="20" font-family="monospace" letter-spacing="6">LAVI / PROJECT NOTES</text>
    <text x="60" y="570" fill="#ffffff" font-size="72" font-weight="800" font-family="Arial, Helvetica, sans-serif" letter-spacing="-3">${escapeXml(project.name)}</text>
    <text x="60" y="607" fill="#c4ccdd" font-size="20" font-family="monospace">${escapeXml(project.kicker.toUpperCase())} · VERIFIED REPOSITORY</text>
  </svg>`;
}

async function ensureDirectories(): Promise<void> {
  await Promise.all(
    [
      path.join(PUBLIC, 'assets', 'avatar'),
      path.join(PUBLIC, 'assets', 'covers'),
      path.join(PUBLIC, 'assets', 'screenshots'),
      path.join(PUBLIC, 'assets', 'og'),
    ].map((directory) => mkdir(directory, { recursive: true })),
  );
}

async function buildAvatar(): Promise<void> {
  await sharp(path.join(SOURCE, 'avatar', 'lakshit-avatar.svg'), { density: 160 })
    .resize(720, 880, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 90, alphaQuality: 90, effort: 6 })
    .toFile(path.join(PUBLIC, 'assets', 'avatar', 'lakshit-avatar.webp'));
}

async function buildFavicon(): Promise<void> {
  await writeFile(path.join(PUBLIC, 'favicon.svg'), FAVICON_SVG, 'utf8');
  await sharp(Buffer.from(FAVICON_SVG)).resize(192, 192).png({ compressionLevel: 9 }).toFile(path.join(PUBLIC, 'favicon-192.png'));
}

async function buildCovers(): Promise<void> {
  await Promise.all(
    PROJECTS.map((project, index) =>
      writeFile(path.join(PUBLIC, 'assets', 'covers', `${project.slug}.svg`), coverSvg(project, index), 'utf8'),
    ),
  );
}

async function buildScreenshots(): Promise<void> {
  const sourceDir = path.join(SOURCE, 'screenshots');
  const outputDir = path.join(PUBLIC, 'assets', 'screenshots');
  const files = [
    'sortify-workspace.png',
    'sortify-preview.png',
    'veylo-today.png',
    'veylo-progress.png',
    'sabuddy-icon.svg',
    'facilityfix-dashboard.png',
    'facilityfix-report.png',
    'sarp-gameplay.png',
    'sarp-menu.png',
    'pustakalaya-dashboard.jpg',
    'pustakalaya-catalog.jpg',
  ];

  await Promise.all(
    files.map((file) => {
      const output = file.replace(path.extname(file), '.webp');
      if (file.endsWith('.svg')) {
        return sharp(path.join(sourceDir, file), { density: 400 })
          .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
          .webp({ quality: 88, effort: 5 })
          .toFile(path.join(outputDir, output));
      }
      return sharp(path.join(sourceDir, file))
        .rotate()
        .resize({ width: 1200, withoutEnlargement: true })
        .webp({ quality: 82, effort: 5 })
        .toFile(path.join(outputDir, output));
    }),
  );
}

async function buildOgImages(): Promise<void> {
  const avatar = await sharp(path.join(PUBLIC, 'assets', 'avatar', 'lakshit-avatar.webp'))
    .resize({ height: 430, withoutEnlargement: true })
    .png()
    .toBuffer();

  await sharp(Buffer.from(defaultOgSvg()))
    .composite([{ input: avatar, left: 815, top: 165 }])
    .png({ compressionLevel: 9, palette: true })
    .toFile(path.join(PUBLIC, 'og-image.png'));

  await Promise.all(
    PROJECTS.map(async (project) => {
      const cover = await sharp(path.join(PUBLIC, 'assets', 'covers', `${project.slug}.svg`), { density: 96 })
        .resize(1200, 800, { fit: 'cover' })
        .png()
        .toBuffer();
      const overlay = Buffer.from(projectOgOverlay(project));
      await sharp(cover)
        .resize(1200, 630, { fit: 'cover', position: 'centre' })
        .composite([{ input: overlay, left: 0, top: 0 }])
        .png({ compressionLevel: 9, palette: true })
        .toFile(path.join(PUBLIC, 'assets', 'og', `${project.slug}.png`));
    }),
  );
}

await ensureDirectories();
await Promise.all([buildAvatar(), buildFavicon(), buildCovers(), buildScreenshots()]);
await buildOgImages();
await writeFile(path.join(PUBLIC, '.nojekyll'), '', 'utf8');
console.info(`Optimised assets for ${PROJECTS.length} projects.`);
