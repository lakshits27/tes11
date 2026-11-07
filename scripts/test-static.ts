import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { HTML_ROUTES } from '../src/content/routes.ts';
import { PROJECTS, PROJECT_FILTERS } from '../src/content/projects.ts';
import { SITE } from '../src/content/site.ts';

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');

async function exists(relative: string, base = DIST): Promise<boolean> {
  try {
    await stat(path.join(base, relative));
    return true;
  } catch {
    return false;
  }
}

function extractAll(html: string, pattern: RegExp): string[] {
  return Array.from(html.matchAll(pattern), (match) => match[1] ?? '');
}

function localPath(value: string): string | null {
  const clean = value.split('#')[0]?.split('?')[0] ?? '';
  if (clean.startsWith(SITE.productionUrl)) return clean.slice(SITE.productionUrl.length);
  if (clean.startsWith(SITE.basePath)) return clean.slice(SITE.basePath.length);
  return null;
}

function distFileFor(local: string): string {
  const withoutLeadingSlash = local.replace(/^\/+/, '');
  if (withoutLeadingSlash === '') return 'index.html';
  if (withoutLeadingSlash.endsWith('/')) return `${withoutLeadingSlash}index.html`;
  return withoutLeadingSlash;
}

const titles: string[] = [];
const descriptions: string[] = [];
const canonicals: string[] = [];
const checkedAssets = new Set<string>();

// Project catalogue integrity: slugs are IDs and must map to unique routes.
const projectSlugs = PROJECTS.map((project) => project.slug);
assert.equal(new Set(projectSlugs).size, projectSlugs.length, 'Duplicate project slug/ID detected');
assert.ok(projectSlugs.every((slug) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)), 'Project slugs must be lowercase URL-safe identifiers');
const routePaths = HTML_ROUTES.map((route) => route.path);
assert.equal(new Set(routePaths).size, routePaths.length, 'Duplicate generated route detected');


for (const route of HTML_ROUTES) {
  const distFile = route.file;
  assert.equal(await exists(distFile), true, `Missing built route: ${distFile}`);
  assert.equal(await exists(route.file, ROOT), true, `Missing generated source route: ${route.file}`);
  const html = await readFile(path.join(DIST, distFile), 'utf8');
  assert.ok(Buffer.byteLength(html, 'utf8') <= 300_000, `Generated HTML exceeds 300 KB on ${distFile}`);

  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  assert.ok(title, `Missing title on ${distFile}`);
  assert.ok(description, `Missing description on ${distFile}`);
  assert.ok(title.length <= 90, `Open Graph title is too long on ${distFile}`);
  assert.ok(description.length <= 200, `Open Graph description is too long on ${distFile}`);
  const headings = Array.from(html.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h[1-6]>/g));
  assert.ok(headings.every((match) => (match[2] ?? '').replace(/<[^>]+>/g, '').trim().length > 0), `Empty heading on ${distFile}`);
  let previousLevel = 0;
  for (const heading of headings) {
    const level = Number(heading[1]);
    assert.ok(level <= previousLevel + 1 || previousLevel === 0, `Heading hierarchy skips a level on ${distFile}`);
    previousLevel = level;
  }
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `Expected exactly one h1 on ${distFile}`);
  assert.match(html, /class="site-header"/, `Missing header on ${distFile}`);
  assert.match(html, /class="site-footer"/, `Missing footer on ${distFile}`);
  assert.match(html, /<main id="main"/, `Missing main landmark on ${distFile}`);
  assert.match(html, /rel="icon"/, `Missing favicon on ${distFile}`);
  assert.match(html, /property="og:image"/, `Missing OG image on ${distFile}`);
  assert.match(html, /<meta name="twitter:card" content="summary_large_image"/, `Missing Twitter card type on ${distFile}`);
  assert.match(html, /<meta name="twitter:title" content="[^"]+"/, `Missing Twitter title on ${distFile}`);
  assert.match(html, /<meta name="twitter:description" content="[^"]+"/, `Missing Twitter description on ${distFile}`);
  assert.match(html, /<meta name="twitter:image" content="[^"]+"/, `Missing Twitter image on ${distFile}`);
  assert.match(html, /<html lang="[a-z]{2}(-[A-Z]{2})?"/, `Missing or invalid language attribute on ${distFile}`);
  assert.match(html, /type="application\/ld\+json"/, `Missing structured data on ${distFile}`);
  assert.doesNotMatch(html, /href="#"/, `Dead href="#" on ${distFile}`);
  for (const imageTag of html.match(/<img\b[^>]*>/g) ?? []) {
    assert.match(imageTag, /\balt="[^"]*"/, `Image missing alt attribute on ${distFile}: ${imageTag.slice(0, 100)}`);
  }
  for (const value of extractAll(html, /(?:href|src)="([^"#]+)"/g)) {
    if (/^(?:data:|mailto:|tel:)/i.test(value)) continue;
    const parsed = new URL(value, SITE.productionUrl);
    assert.ok(['http:', 'https:'].includes(parsed.protocol), `Invalid URL protocol on ${distFile}: ${value}`);
  }
  const pageIds = extractAll(html, /\bid="([^"]+)"/g);
  assert.equal(new Set(pageIds).size, pageIds.length, `Duplicate id on ${distFile}`);
  const pageIdSet = new Set(pageIds);
  for (const target of extractAll(html, /href="#([^"]+)"/g)) {
    assert.ok(pageIdSet.has(target), `Broken internal anchor #${target} on ${distFile}`);
  }
  assert.doesNotMatch(html, /project\.html\?project=/, `Legacy query project link on ${distFile}`);
  assert.doesNotMatch(html, /assets\/site\.(css|js)/, `Legacy asset on ${distFile}`);

  if (route.name === 'notFound') {
    assert.match(html, /name="robots" content="noindex, nofollow"/, '404 must be noindex');
    assert.equal(canonical, undefined, '404 must not have a canonical URL');
  } else {
    assert.ok(canonical, `Missing canonical on ${distFile}`);
    assert.equal(canonical, new URL(route.path, SITE.productionUrl).toString(), `Canonical URL mismatch on ${distFile}`);
    canonicals.push(canonical);
  }

  titles.push(title);
  descriptions.push(description);

  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    assert.doesNotThrow(() => JSON.parse(match[1] ?? ''), `Invalid JSON-LD on ${distFile}`);
  }

  const localValues = [
    ...extractAll(html, /(?:href|src)="([^"]+)"/g),
    ...extractAll(html, /<meta property="og:image" content="([^"]+)"/g),
  ];
  for (const value of localValues) {
    const local = localPath(value);
    if (!local) continue;
    const file = distFileFor(local);
    const key = `${distFile} -> ${file}`;
    if (checkedAssets.has(key)) continue;
    checkedAssets.add(key);
    assert.equal(await exists(file), true, `Broken local link in ${distFile}: ${value}`);
  }
}

assert.equal(new Set(titles).size, titles.length, 'Page titles must be unique');
assert.equal(new Set(descriptions).size, descriptions.length, 'Meta descriptions must be unique');
assert.equal(new Set(canonicals).size, canonicals.length, 'Canonical URLs must be unique');

for (const project of PROJECTS) {
  assert.ok(project.name.trim(), `Project ${project.slug} has no name`);
  assert.ok(project.category.trim(), `${project.name} has no category`);
  assert.ok(project.filters.length > 0, `${project.name} has no filter categories`);
  assert.ok(project.filters.every((filter) => PROJECT_FILTERS.includes(filter)), `${project.name} has an invalid filter category`);
  assert.ok(project.summary.trim() && project.tagline.trim() && project.status.trim(), `${project.name} is missing core metadata`);
  assert.ok(project.coverAlt.trim(), `${project.name} is missing cover alt text`);
  assert.ok(project.links.length > 0, `${project.name} has no project links`);
  for (const link of project.links) {
    const parsed = new URL(link.url);
    assert.ok(['https:', 'http:', 'mailto:'].includes(parsed.protocol), `${project.name} has an unsupported link protocol: ${link.url}`);
  }
  const route = `projects/${project.slug}/index.html`;
  const html = await readFile(path.join(DIST, route), 'utf8');
  assert.ok(html.includes(project.verified.repository), `${project.name} missing repository link`);
  assert.ok(html.includes(project.status), `${project.name} missing status`);
  assert.ok(html.includes('class="project-nav"'), `${project.name} missing prev/next navigation`);
  assert.ok(html.includes('Verified technology'), `${project.name} missing stack section`);
  assert.ok(html.includes('Documented limits'), `${project.name} missing scope notes`);
  assert.equal(await exists(`assets/covers/${project.slug}.svg`), true, `Missing cover for ${project.name}`);
  assert.equal(await exists(`assets/og/${project.slug}.png`), true, `Missing OG image for ${project.name}`);
  for (const visual of project.visuals) {
    assert.ok(visual.alt.trim(), `${project.name} has a screenshot without alt text: ${visual.file}`);
    assert.equal(await exists(`assets/screenshots/${visual.file}`), true, `Missing visual ${visual.file}`);
  }
}

assert.equal(await exists('assets/avatar/lakshit-avatar.webp'), true, 'Avatar WebP missing');
assert.equal(await exists('favicon.svg'), true, 'Favicon SVG missing');
const faviconSvg = await readFile(path.join(DIST, 'favicon.svg'), 'utf8');
assert.match(faviconSvg, /<svg\b[^>]*viewBox=/, 'Favicon SVG must contain a viewBox');
assert.equal(await exists('favicon-192.png'), true, 'Favicon PNG missing');
const faviconPng = await sharp(path.join(DIST, 'favicon-192.png')).metadata();
assert.equal(faviconPng.format, 'png', 'Apple touch icon must be PNG');
assert.equal(faviconPng.width, 192, 'Favicon PNG must be 192px wide');
assert.equal(faviconPng.height, 192, 'Favicon PNG must be 192px high');
assert.equal(await exists('og-image.png'), true, 'Default OG image missing');

const ogFiles = ['og-image.png', ...PROJECTS.map((project) => `assets/og/${project.slug}.png`)];
for (const file of ogFiles) {
  const metadata = await sharp(path.join(DIST, file)).metadata();
  assert.equal(metadata.width, 1200, `Open Graph image ${file} must be 1200px wide`);
  assert.equal(metadata.height, 630, `Open Graph image ${file} must be 630px high`);
}
assert.equal(await exists('manifest.webmanifest'), true, 'Web manifest missing');
const manifest = JSON.parse(await readFile(path.join(DIST, 'manifest.webmanifest'), 'utf8')) as { start_url?: string; scope?: string; display?: string; icons?: Array<{ src?: string; sizes?: string; type?: string }> };
assert.equal(manifest.start_url, SITE.basePath, 'Manifest start_url must match the deployed base path');
assert.equal(manifest.scope, SITE.basePath, 'Manifest scope must match the deployed base path');
assert.ok(['standalone', 'minimal-ui', 'browser', 'fullscreen'].includes(manifest.display ?? ''), 'Manifest display mode is invalid');
assert.ok((manifest.icons ?? []).some((icon) => icon.src === 'favicon-192.png' && icon.sizes === '192x192' && icon.type === 'image/png'), 'Manifest is missing the 192px PNG icon');
const assetFiles = await readdir(path.join(DIST, 'assets'));
assert.ok(assetFiles.some((file) => /\.(woff2?|ttf|otf)$/.test(file)), 'No bundled font files found in production assets');
assert.equal(await exists('robots.txt'), true, 'robots.txt missing');
assert.equal(await exists('sitemap.xml'), true, 'sitemap.xml missing');
assert.equal(await exists('.nojekyll'), true, '.nojekyll missing');

const sitemap = await readFile(path.join(DIST, 'sitemap.xml'), 'utf8');
for (const route of HTML_ROUTES.filter((entry) => entry.sitemap)) {
  assert.ok(sitemap.includes(new URL(route.path, SITE.productionUrl).toString()), `Sitemap missing ${route.path}`);
}
assert.doesNotMatch(sitemap, /404\.html/, 'Sitemap must not include 404');
const robots = await readFile(path.join(DIST, 'robots.txt'), 'utf8');
assert.ok(robots.includes(new URL('sitemap.xml', SITE.productionUrl).toString()), 'robots.txt missing sitemap URL');

for (const legacy of [
  'about.html',
  'contact.html',
  'projects.html',
  'project.html',
  'projects/sortify.html',
  'projects/veylo.html',
  'projects/sabuddy.html',
  'projects/facilityfix.html',
  'projects/sarp.html',
]) {
  assert.equal(await exists(legacy), false, `Legacy file must not be deployed: ${legacy}`);
  assert.equal(await exists(legacy, ROOT), false, `Legacy source file still exists: ${legacy}`);
}

console.info(`Static checks passed: ${HTML_ROUTES.length} routes, ${PROJECTS.length} projects, ${checkedAssets.size} local links/assets.`);
