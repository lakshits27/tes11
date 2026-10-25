import { SOCIAL_LINKS, SITE, href } from '../content/site.ts';
import { buttonLink, eyebrow } from './components.ts';
import { icon } from './icons.ts';
import type { PageDefinition } from './page.ts';
import { escapeHtml } from './utils.ts';

const REASONS = [
  { title: 'A collaboration', detail: 'A useful product idea, research question, or creative build.' },
  { title: 'An internship', detail: 'A team that values curiosity, clear thinking, and shipping real work.' },
  { title: 'A repo question', detail: 'Something about one of my public projects, its decisions, or its documentation.' },
  { title: 'A good conversation', detail: 'Games, music, space, strange technology, or an idea that will not leave you alone.' },
];

export function contactPage(): PageDefinition {
  const content = `<section class="page-hero page-hero--contact" aria-labelledby="page-title">
    <div class="contact-hero">
      <div class="contact-hero__copy">
        ${eyebrow('Open channel / 005')}
        <h1 id="page-title" data-reveal>Let’s make a little <span>signal.</span></h1>
        <p class="page-hero__lead" data-reveal>No fake form, no “message sent” theatre. Just my real email, a copy button, and links to the places where I actually exist online.</p>
        <div class="contact-hero__meta" data-reveal>
          <span><i aria-hidden="true"></i> Usually easiest by email</span>
          <span><i aria-hidden="true"></i> Open to internships &amp; collaborations</span>
        </div>
      </div>
      <div class="contact-signal" aria-hidden="true" data-reveal>
        <span class="contact-signal__ring"></span>
        <span class="contact-signal__ring"></span>
        <span class="contact-signal__ring"></span>
        <span class="contact-signal__dot contact-signal__dot--one"></span>
        <span class="contact-signal__dot contact-signal__dot--two"></span>
        <span class="contact-signal__core">${icon('mail')}</span>
        <span class="contact-signal__label">OPEN CHANNEL · 005</span>
      </div>
    </div>
  </section>

  <section class="contact-workspace" aria-label="Contact options">
    <div class="email-card" data-copy-email>
      <div class="email-card__top">
        <span class="email-card__label">The direct route</span>
        <span class="email-card__status"><i aria-hidden="true"></i> Inbox open</span>
      </div>
      <h2>Email works best.</h2>
      <p>Tell me what you’re thinking, what you’re building, or what you want to explore. A little context is always welcome.</p>
      <a class="email-card__address" href="mailto:${SITE.email}">${SITE.email}</a>
      <div class="email-card__actions">
        <button class="btn btn--primary" type="button" data-copy-button data-email="${SITE.email}">${icon('copy')}<span>Copy email</span></button>
        ${buttonLink({ label: 'Compose an email', url: `mailto:${SITE.email}`, variant: 'secondary', iconName: 'arrow-up-right' })}
      </div>
      <p class="copy-feedback" data-copy-feedback role="status" aria-live="polite"></p>
    </div>

    <div class="social-cards" aria-labelledby="social-title">
      <div class="social-cards__head">
        ${eyebrow('Around the internet')}
        <h2 id="social-title">Other real places.</h2>
      </div>
      ${SOCIAL_LINKS.map(
        (social) => `<a class="social-card" href="${social.url}"${
          social.url.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : ''
        }>
          <span class="social-card__icon">${icon(social.icon)}</span>
          <span class="social-card__text"><strong>${escapeHtml(social.label)}</strong><small>${escapeHtml(social.handle)}</small></span>
          ${icon('arrow-up-right')}
        </a>`,
      ).join('')}
    </div>
  </section>

  <section class="section section--reasons" aria-labelledby="reasons-title">
    <div class="reasons-head" data-reveal>
      ${eyebrow('Good reasons to write')}
      <h2 id="reasons-title">Start with <span>anything real.</span></h2>
      <p>I would rather read a specific, honest message than a perfectly polished pitch.</p>
    </div>
    <div class="reasons-grid">
      ${REASONS.map(
        (reason, index) => `<article class="reason-card" data-reveal style="--delay:${index * 70}ms">
          <span>0${index + 1}</span>
          <h3>${escapeHtml(reason.title)}</h3>
          <p>${escapeHtml(reason.detail)}</p>
        </article>`,
      ).join('')}
    </div>
  </section>

  <section class="contact-closing" aria-labelledby="closing-title" data-reveal>
    <div class="contact-closing__orbit" aria-hidden="true"><i></i><i></i><span>✦</span></div>
    ${eyebrow('End of the page, not the conversation')}
    <h2 id="closing-title">Thanks for stopping by.</h2>
    <p>If you made it this far, you probably like details as much as I do. Go poke around the <a href="${href('playground/')}">playground</a>, read the <a href="${href('projects/')}">project notes</a>, or just say hello.</p>
    <a class="text-link" href="mailto:${SITE.email}">${SITE.email} ${icon('arrow-up-right')}</a>
  </section>`;

  return {
    content,
    title: 'Contact',
    description:
      'Contact Lakshit “Lavi” Singh Saini by email or through verified GitHub, Instagram, and X profiles. No fake contact form.',
    pageId: 'contact',
    activeNav: 'contact',
    path: 'contact/',
  };
}
