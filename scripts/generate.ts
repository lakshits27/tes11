import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { HTML_ROUTES } from '../src/content/routes.ts';
import { PROJECTS } from '../src/content/projects.ts';
import { SITE, canonical } from '../src/content/site.ts';
import { layout } from '../src/templates/layout.ts';
import type { PageDefinition } from '../src/templates/page.ts';
import { homePage } from '../src/templates/home.ts';
import { projectsPage } from '../src/templates/projects-index.ts';
import { projectPage } from '../src/templates/project-detail.ts';
import { aboutPage } from '../src/templates/about.ts';
import { playgroundPage } from '../src/templates/playground.ts';
import { contactPage } from '../src/templates/contact.ts';
import { nowPage } from '../src/templates/now.ts';
import { usesPage } from '../src/templates/uses.ts';
import { notFoundPage } from '../src/templates/not-found.ts';

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, 'public');

const pages = new Map<string, PageDefinition>([
  ['home', homePage()],
  ['projects', projectsPage()],
  ['about', aboutPage()],
  ['playground', playgroundPage()],
  ['contact', contactPage()],
  ['now', nowPage()],
  ['uses', usesPage()],
  ['notFound', notFoundPage()],
]);

PROJECTS.forEach((project, index) => {
  pages.set(`project-${project.slug}`, projectPage(project, index));
});

async function writePage(file: string, page: PageDefinition): Promise<void> {
  const destination = path.join(ROOT, file);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, layout(page.content, page), 'utf8');
}

function sitemap(): string {
  const entries = HTML_ROUTES.filter((route) => route.sitemap)
    .map(
      (route) => `  <url>
    <loc>${canonical(route.path)}</loc>
    <lastmod>${SITE.verifiedDate}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;
}

function manifest(): string {
  return `${JSON.stringify(
    {
      name: `${SITE.name} — ${SITE.brand} Portfolio`,
      short_name: SITE.brand,
      description: SITE.description,
      start_url: SITE.basePath,
      scope: SITE.basePath,
      display: 'standalone',
      background_color: '#080a12',
      theme_color: SITE.themeColor,
      lang: 'en',
      icons: [
        { src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
        { src: 'favicon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      ],
    },
    null,
    2,
  )}\n`;
}

await Promise.all(
  HTML_ROUTES.map(async (route) => {
    const page = pages.get(route.name);
    if (!page) throw new Error(`No page generator found for route: ${route.name}`);
    await writePage(route.file, page);
  }),
);

await Promise.all([
  writeFile(path.join(PUBLIC, 'sitemap.xml'), sitemap(), 'utf8'),
  writeFile(
    path.join(PUBLIC, 'robots.txt'),
    `User-agent: *\nAllow: /\n\nSitemap: ${canonical('sitemap.xml')}\n`,
    'utf8',
  ),
  writeFile(path.join(PUBLIC, 'manifest.webmanifest'), manifest(), 'utf8'),
]);

console.info(`Generated ${HTML_ROUTES.length} HTML routes and ${HTML_ROUTES.filter((route) => route.sitemap).length} sitemap entries.`);
