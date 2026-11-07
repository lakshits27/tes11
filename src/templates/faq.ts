import { href } from '../content/site.ts';
import { eyebrow } from './components.ts';
import type { PageDefinition } from './page.ts';

const questions = [
  { category: 'Projects & work', question: 'What kind of work is showcased here?', answer: 'A mix of web applications, desktop utilities, mobile ideas, systems projects, games, and creative coding experiments.' },
  { category: 'Projects & work', question: 'Where can I inspect the source code?', answer: 'Each project page links to its public repository when one is available. Repository links are the source of truth for implementation details.' },
  { category: 'Projects & work', question: 'Are all projects production services?', answer: 'No. Projects may be released, live demos, experiments, or works in progress. Their individual pages describe the verified status and documented limits.' },
  { category: 'Contact & reuse', question: 'How can I get in touch?', answer: 'Use the contact page or email lakshitsinghsaini@gmail.com for internship, collaboration, or project conversations.' },
  { category: 'Contact & reuse', question: 'Can I use the artwork or code?', answer: 'Please check the relevant repository license and asset attribution before reusing project code, screenshots, or artwork.' },
  { category: 'Accessibility', question: 'Does the website respect reduced-motion settings?', answer: 'The site checks the operating-system reduced-motion preference and reduces or disables decorative motion where supported.' },
];

export function faqPage(): PageDefinition {
  const content = `<section class="faq-page" aria-labelledby="page-title">
    <header class="faq-page__hero">
      ${eyebrow('A few useful answers / FAQ')}
      <h1 id="page-title">Good <span>questions.</span></h1>
      <p>Quick context about the work, the projects, and how to reach me.</p>
    </header>
    <div class="faq-list">
      ${[...new Set(questions.map((item) => item.category))].map((category) => `<section class="faq-group" aria-labelledby="faq-${category.toLowerCase().replace(/[^a-z]+/g, '-')}">
        <h2 id="faq-${category.toLowerCase().replace(/[^a-z]+/g, '-')}" class="faq-group__title">${category}</h2>
        ${questions.filter((item) => item.category === category).map((item) => `<article class="faq-item">
          <span class="faq-item__index">${String(questions.indexOf(item) + 1).padStart(2, '0')}</span>
          <div><h3>${item.question}</h3><p>${item.answer}</p></div>
        </article>`).join('')}
      </section>`).join('')}
    </div>
    <a class="text-link" href="${href('contact/')}">Still curious? Get in touch ↗</a>
  </section>`;
  return {
    content,
    title: 'Frequently asked questions',
    description: 'Answers about the portfolio, showcased projects, source code, collaboration, and accessibility.',
    pageId: 'faq',
    activeNav: '',
    path: 'faq/',
  };
}
