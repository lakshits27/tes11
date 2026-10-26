import type { Project } from '../content/projects.ts';
import { coverPath, projectPath } from '../content/projects.ts';
import { SITE, asset, href } from '../content/site.ts';
import { icon } from './icons.ts';
import type { IconName } from './icons.ts';
import { escapeHtml, tags } from './utils.ts';

export function eyebrow(text: string, className = ''): string {
  return `<p class="eyebrow ${className}"><span aria-hidden="true"></span>${escapeHtml(text)}</p>`;
}

export function sectionHeading(kicker: string, title: string, description?: string): string {
  return `<div class="section-heading" data-reveal>
    ${eyebrow(kicker)}
    <h2>${title}</h2>
    ${description ? `<p>${description}</p>` : ''}
  </div>`;
}

export interface ButtonOptions {
  label: string;
  url: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'dark';
  iconName?: IconName;
  external?: boolean;
  className?: string;
  data?: string;
  accent?: string;
}

export function buttonLink(options: ButtonOptions): string {
  const {
    label,
    url,
    variant = 'primary',
    iconName = 'arrow-up-right',
    external = false,
    className = '',
    data = '',
    accent,
  } = options;
  const externalAttributes = external ? ' target="_blank" rel="noopener noreferrer"' : '';
  const style = accent ? ` style="--button-accent:${escapeHtml(accent)}"` : '';
  return `<a class="btn btn--${variant} ${className}" href="${url}"${externalAttributes}${data}${style}><span>${escapeHtml(
    label,
  )}</span>${icon(iconName)}${external ? '<span class="sr-only"> (opens in a new tab)</span>' : ''}</a>`;
}

export function avatarImage(className = ''): string {
  return `<img class="avatar-image ${className}" src="${asset(
    'avatar/lakshit-avatar.webp',
  )}" width="720" height="880" alt="Original illustrated portrait of Lakshit “Lavi” Singh Saini" decoding="async">`;
}

export function socialRow(className = ''): string {
  return `<div class="social-row ${className}">
    <a href="https://github.com/hmmlavi" target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">${icon(
      'github',
    )}<span>GitHub</span></a>
    <a href="https://www.instagram.com/lakshitsinghsaini/" target="_blank" rel="noopener noreferrer" aria-label="Instagram profile">${icon(
      'instagram',
    )}<span>Instagram</span></a>
    <a href="https://x.com/Lakshits27" target="_blank" rel="noopener noreferrer" aria-label="X profile">${icon(
      'x',
    )}<span>X</span></a>
    <a href="mailto:${SITE.email}" aria-label="Email Lakshit">${icon('mail')}<span>Email</span></a>
  </div>`;
}

export function projectCard(project: Project, index: number, featured = false): string {
  const search = [project.name, project.summary, project.category, ...project.tech, ...project.filters]
    .join(' ')
    .toLowerCase();
  return `<article class="project-card${featured ? ' project-card--featured' : ''}" data-project-card data-filters="${escapeHtml(
    project.filters.join(' '),
  )}" data-search="${escapeHtml(search)}" style="--card-accent:${project.accent};--card-accent-2:${
    project.accentSecondary
  };--card-accent-ink:${project.accentInk};--card-accent-soft-light:${project.accentSoftLight}" data-reveal>
    <a class="project-card__media" href="${href(projectPath(project))}" data-portal data-accent="${
      project.accent
    }">
      <img src="${asset(coverPath(project))}" width="1200" height="800" alt="${escapeHtml(
        project.coverAlt,
      )}" loading="lazy" decoding="async">
      <span class="sr-only">Open ${escapeHtml(project.name)} project page</span>
      <span class="project-card__index" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
      <span class="project-card__open">${icon('arrow-up-right')}</span>
    </a>
    <div class="project-card__body">
      <div class="project-card__meta"><span>${escapeHtml(project.kicker)}</span><span>${project.year}</span></div>
      <h3><a href="${href(projectPath(project))}" data-portal data-accent="${project.accent}">${escapeHtml(
        project.name,
      )}</a></h3>
      <p>${escapeHtml(project.summary)}</p>
      <div class="project-card__footer">
        ${tags(project.tech.slice(0, featured ? 3 : 4), 'tags tags--compact')}
        <a class="project-card__repo" href="${project.links[0]?.url ?? '#'}" target="_blank" rel="noopener noreferrer" aria-label="Open ${escapeHtml(
          project.name,
        )} repository in a new tab">${icon('github')}</a>
      </div>
    </div>
  </article>`;
}

export function breadcrumbs(items: readonly { label: string; url?: string }[]): string {
  return `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol>${items
    .map((item, index) => {
      const last = index === items.length - 1;
      return `<li>${
        item.url && !last ? `<a href="${item.url}">${escapeHtml(item.label)}</a>` : `<span aria-current="page">${escapeHtml(item.label)}</span>`
      }</li>`;
    })
    .join('')}</ol></nav>`;
}

export function projectStructuredData(project: Project): Record<string, unknown>[] {
  const url = new URL(projectPath(project), SITE.productionUrl).toString();
  const live = project.links.find((link) => link.kind === 'live');
  const release = project.links.find((link) => link.kind === 'release');
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareSourceCode',
      name: project.name,
      description: project.summary,
      url,
      codeRepository: project.verified.repository,
      programmingLanguage: [...project.tech],
      author: { '@type': 'Person', name: SITE.name, url: SITE.productionUrl },
      dateModified: project.verified.lastPushed,
      ...(live ? { runtimePlatform: live.url } : {}),
      ...(release ? { downloadUrl: release.url } : {}),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.productionUrl },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Projects',
          item: new URL('projects/', SITE.productionUrl).toString(),
        },
        { '@type': 'ListItem', position: 3, name: project.name, item: url },
      ],
    },
  ];
}
