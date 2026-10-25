# LAVI — interactive portfolio

Production site: **https://lakshits27.github.io/tes11/**

This is the multi-page personal portfolio of **Lakshit Singh Saini (“Lavi”)**. It is a pre-rendered static website with a custom design system, original SVG artwork, a pointer-reactive spectral Canvas layer, and two interactive visual experiments.

## Stack and architecture

- **TypeScript 5.9** for typed page generation, content, and browser modules.
- **Vite 7** for local development, CSS/JS bundling, asset hashing, and multi-page production builds.
- **Pre-rendered HTML routes** generated from templates and structured content. Every page is a real `index.html` in its own directory, so direct links and refreshes work on GitHub Pages without SPA routing or a 404 fallback hack.
- **Vanilla CSS** design system with local variable fonts from Fontsource packages (Space Grotesk, Manrope, IBM Plex Mono). No external font or analytics requests.
- **Canvas 2D, SVG, and CSS** for the rainbow trail, project portal transition, Prism Field, orbit mixer, and curiosity compass.
- **Sharp** at build time to optimise the avatar, favicon, social cards, covers, and genuine repository screenshots.
- **GitHub Actions + GitHub Pages** for deployment.
- **ESLint 10 + typescript-eslint**, Node’s test runner, Puppeteer Core, and axe-core for quality checks.

React, Tailwind, GSAP, Three.js, and a backend are intentionally not used here. The portfolio is content-first and fully static; adding hydration or a server would increase complexity without improving direct-route hosting or the interactive Canvas work.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Animated hero, custom illustrated avatar, featured projects, interests, contact CTA |
| `/projects/` | Searchable/filterable project gallery with six verified repositories |
| `/projects/sortify/` | Sortify — Windows file-renaming utility |
| `/projects/veylo/` | Veylo — private browser/PWA habit tracker and Android shell |
| `/projects/sabuddy/` | SaBuddy — Kotlin Android creator workspace |
| `/projects/facilityfix/` | FacilityFix — Flask/SQLite campus issue workflow |
| `/projects/sarp/` | Sarp — Three.js browser Snake game |
| `/projects/pustakalaya/` | Pustakalaya — offline-ready library management system |
| `/about/` | Personal introduction, curiosity compass, verified skills, and learning loop |
| `/playground/` | Interactive Prism Field and orbit mixer |
| `/contact/` | Verified email, copy interaction, and real social profiles |
| `/now/` | Recent public releases and current learning areas |
| `/uses/` | Verified toolchain map |
| `/404.html` | Custom noindex 404 page |

All hrefs, canonical URLs, Open Graph images, sitemap entries, and structured data use the `/tes11/` production base path.

## Project content

All project information lives in `src/content/projects.ts`. Each detail page is generated from that single source and includes:

- overview, problem, motivation, approach, goals, and design decisions;
- implemented features distinguished from documented limits;
- verified technology stacks sourced from READMEs, manifests, releases, and live apps;
- genuine repository screenshots where available, plus original SVG cover illustrations;
- contribution, challenges, current status, repository/release/live links, and prev/next navigation.

Repository URLs and release tags were checked against the GitHub API on 25 October 2026. [`docs/verification.md`](docs/verification.md) records the sources. No employment history, awards, clients, testimonials, user numbers, or professional experience are invented.

## Avatar note

The photograph mentioned earlier in the conversation was **not available in this execution environment**. The local avatar is therefore an **original hand-drawn vector illustration** based on the written art direction (voluminous dark hair, facial hair, modern jacket, spectral rim light); it is **not represented as a likeness generated from that photograph**. The editable source is `assets-source/avatar/lakshit-avatar.svg` and the optimised transparent WebP is generated at `public/assets/avatar/lakshit-avatar.webp`.

## Development

Requirements: Node.js 22.12+ and npm 10+.

```bash
npm install
npm run dev
```

The dev server uses the GitHub Pages base path. Open `http://localhost:5173/tes11/`.

Common commands:

```bash
npm run generate       # regenerate HTML routes, covers, optimised assets, sitemap, robots, manifest
npm run build          # generate, typecheck, and create dist/
npm run preview        # preview dist/ at http://localhost:4173/tes11/
npm run lint           # ESLint
npm run typecheck      # TypeScript, no emit
npm run test:static    # built-route, metadata, asset, link, sitemap, and structured-data checks
npm run test:browser   # real Chromium browser, responsive, keyboard, reduced-motion, Canvas, and axe checks
npm run verify:repos   # verify project repositories and release tags with the GitHub CLI
npm run check          # lint + typecheck + build + static checks
```

`npm run test:browser` uses the Chromium binary bundled in the dev-only `@sparticuz/chromium` package. It starts its own `vite preview` server on port 4183. The repository does not require API keys, forms, databases, or server-side code.

## Generated files

- Generated HTML route files are committed because they are Vite’s pre-rendered inputs. Regenerate them with `npm run generate` after changing content or templates.
- Optimised images in `public/assets/avatar`, `public/assets/covers`, `public/assets/screenshots`, `public/assets/og`, plus `public/og-image.png`, `public/favicon-192.png`, `robots.txt`, and `sitemap.xml`, are generated during `npm run assets` and are gitignored.
- Source screenshots and the editable avatar live in `assets-source/`.
- `dist/` is a build artifact and is never committed.

## Deployment

`.github/workflows/deploy-pages.yml` runs on pushes to `main` and on manual dispatch. It:

1. installs with `npm ci`;
2. runs lint, the production build, and static verification;
3. configures Pages;
4. uploads **only `dist/`**;
5. deploys with the official Pages action using minimal permissions.

The repository’s `github-pages` environment allows deployments only from `main`. For this Arena session, work is committed and pushed to `arena/79d4f8cb-tes11`, then merged to `main` through a pull request so the protected deployment environment can publish it. The workflow keeps the existing Pages configuration rather than disabling it.

## Accessibility and performance

- Semantic landmarks, one `h1` per page, visible focus indicators, keyboard-accessible controls, and screen-reader status messages.
- `prefers-reduced-motion` disables the spectral trail, pauses the Prism Field animation, removes page entrance motion, and keeps all content readable.
- Canvas effects are enabled only for fine pointers, cap device pixel ratio, pause when hidden or off-screen, clean up listeners/animation frames, and never block clicks.
- Images have explicit dimensions, lazy loading where appropriate, and optimised local WebP/SVG assets.
- No client-side framework, no external font CDN, no analytics, and no tracking scripts.

## License and assets

Project screenshots and the SaBuddy launcher vector come from the corresponding public repositories under `hmmlavi`. Cover art, the avatar, favicon, and social cards are original artwork created for this portfolio. Fontsource packages distribute their respective open-source fonts.
