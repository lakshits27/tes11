import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { HTML_ROUTES } from '../src/content/routes.ts';
import { PROJECTS } from '../src/content/projects.ts';
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

for (const route of HTML_ROUTES) {
  const distFile = route.file;
  assert.equal(await exists(distFile), true, `Missing built route: ${distFile}`);
  assert.equal(await exists(route.file, ROOT), true, `Missing generated source route: ${route.file}`);
  const html = await readFile(path.join(DIST, distFile), 'utf8');

  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  assert.ok(title, `Missing title on ${distFile}`);
  assert.ok(description, `Missing description on ${distFile}`);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `Expected exactly one h1 on ${distFile}`);
  assert.match(html, /class="site-header"/, `Missing header on ${distFile}`);
  assert.match(html, /class="site-footer"/, `Missing footer on ${distFile}`);
  assert.match(html, /<main id="main"/, `Missing main landmark on ${distFile}`);
  assert.match(html, /rel="icon"/, `Missing favicon on ${distFile}`);
  assert.match(html, /property="og:image"/, `Missing OG image on ${distFile}`);
  assert.match(html, /type="application\/ld\+json"/, `Missing structured data on ${distFile}`);
  assert.doesNotMatch(html, /href="#"/, `Dead href="#" on ${distFile}`);
  assert.doesNotMatch(html, /project\.html\?project=/, `Legacy query project link on ${distFile}`);
  assert.doesNotMatch(html, /assets\/site\.(css|js)/, `Legacy asset on ${distFile}`);

  if (route.name === 'notFound') {
    assert.match(html, /name="robots" content="noindex, nofollow"/, '404 must be noindex');
    assert.equal(canonical, undefined, '404 must not have a canonical URL');
  } else {
    assert.ok(canonical, `Missing canonical on ${distFile}`);
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
    assert.equal(await exists(`assets/screenshots/${visual.file}`), true, `Missing visual ${visual.file}`);
  }
}

assert.equal(await exists('assets/avatar/lakshit-avatar.webp'), true, 'Avatar WebP missing');
assert.equal(await exists('favicon.svg'), true, 'Favicon SVG missing');
assert.equal(await exists('favicon-192.png'), true, 'Favicon PNG missing');
assert.equal(await exists('og-image.png'), true, 'Default OG image missing');
assert.equal(await exists('manifest.webmanifest'), true, 'Web manifest missing');
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
