import { PROJECTS } from './projects.ts';

export interface HtmlRoute {
  name: string;
  file: string;
  path: string;
  sitemap: boolean;
  priority: string;
  changefreq: 'weekly' | 'monthly' | 'yearly';
}

export const HTML_ROUTES: HtmlRoute[] = [
  { name: 'home', file: 'index.html', path: '', sitemap: true, priority: '1.0', changefreq: 'monthly' },
  { name: 'projects', file: 'projects/index.html', path: 'projects/', sitemap: true, priority: '0.9', changefreq: 'monthly' },
  ...PROJECTS.map<HtmlRoute>((project) => ({
    name: `project-${project.slug}`,
    file: `projects/${project.slug}/index.html`,
    path: `projects/${project.slug}/`,
    sitemap: true,
    priority: '0.8',
    changefreq: 'monthly',
  })),
  { name: 'about', file: 'about/index.html', path: 'about/', sitemap: true, priority: '0.8', changefreq: 'monthly' },
  { name: 'playground', file: 'playground/index.html', path: 'playground/', sitemap: true, priority: '0.8', changefreq: 'monthly' },
  { name: 'contact', file: 'contact/index.html', path: 'contact/', sitemap: true, priority: '0.7', changefreq: 'yearly' },
  { name: 'now', file: 'now/index.html', path: 'now/', sitemap: true, priority: '0.6', changefreq: 'monthly' },
  { name: 'uses', file: 'uses/index.html', path: 'uses/', sitemap: true, priority: '0.6', changefreq: 'monthly' },
  { name: 'notFound', file: '404.html', path: '404.html', sitemap: false, priority: '0.1', changefreq: 'yearly' },
];
