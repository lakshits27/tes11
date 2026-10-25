# Implementation plan

## Audit findings (25 October 2026)

- The repository contained a hand-written static site: `index.html`, `about.html`, `projects.html`, `contact.html`, five `projects/*.html` files, `assets/site.css`, and `assets/site.js`.
- `project.html` was an unused query-string detail template; the five static detail pages duplicated its content.
- `index.html` referenced `assets/lakshit-avatar.jpg`, but that asset did not exist.
- The README described a light-first single-page site even though the deployed HTML was a dark static site.
- The GitHub Pages workflow uploaded the repository root on pushes to `main`. The `github-pages` environment allows deployments only from `main`.
- The live site was the old basic dark landing page. There was no `/playground/`, `/now/`, `/uses/`, custom 404, local avatar, sitemap, robots file, metadata system, or route directories.
- Six real public repositories under `hmmlavi` were inspected and verified through their READMEs, manifests, releases, contributors, and GitHub metadata: Sortify, Veylo, SaBuddy, FacilityFix, Sarp, and Pustakalaya-LMS.

## Chosen architecture

- **Pre-rendered static HTML**, generated from typed content in `src/content/` and templates in `src/templates/`.
- **Vite 7 + TypeScript 5.9 + Node 22** for build tooling, asset hashing, CSS bundling, and type-safe modules.
- **No React, SPA router, backend, or database.** Every route is a real directory `index.html`, so direct links and browser refreshes work on GitHub Pages without a 404 fallback hack. A static portfolio does not benefit from hydration or a server.
- **Vanilla CSS design system** with local font packages, custom properties, and responsive grids.
- **Canvas + SVG + CSS** for the spectral trail, project portal transition, interactive Prism Field, and orbit experiments.
- **Structured project data** in `src/content/projects.ts`; every card, detail page, sitemap entry, and preview comes from that single source.
- **GitHub Actions** builds `dist/` and uploads it with the official Pages actions. Because the environment only permits deployment from `main`, the final branch is merged to `main` via a pull request from the Arena working branch.

## Build order

1. Replace the legacy root pages with generated route directories and remove obsolete duplicate files.
2. Create the design system, shared layout, navigation, footer, metadata, and favicon/social artwork.
3. Create original project cover SVGs and an original illustrated avatar from the written art direction. The previously uploaded photograph was not present in this execution environment; its limitation is documented rather than misrepresented.
4. Generate Home, Projects, six project detail pages, About, Playground, Contact, Now, Uses, and 404.
5. Add TypeScript interactions with cleanup, pointer/DPR handling, and reduced-motion support.
6. Add static and browser tests, linting, type checks, and production build.
7. Commit, push, merge to `main`, inspect the deployment run, and verify live routes.
