# Content verification

Verified on **25 October 2026** using the GitHub API, repository READMEs, build manifests, release assets, and the published live apps. This document is the audit trail for `src/content/projects.ts`.

| Project | Repository | Verified sources | Public release | Live app |
| --- | --- | --- | --- | --- |
| Sortify | https://github.com/hmmlavi/sortify-desktop | `README.md`, `requirements.txt`, `Sortify.spec`, CI workflow, screenshots, release assets | v1.0.0, 19 Oct 2026 | — |
| Veylo | https://github.com/hmmlavi/Veylo | `README.md`, `package.json`, `capacitor.config.ts`, `vite.config.ts`, screenshots, Pages site | v1.0.3, 22 Oct 2026 | https://hmmlavi.github.io/Veylo/ |
| SaBuddy | https://github.com/hmmlavi/SaBuddy | `README.md`, `app/build.gradle.kts`, Gradle version catalog, source tree, launcher vector drawables, release page | v1.0.0, 5 Sep 2026 | — |
| FacilityFix | https://github.com/hmmlavi/FacilityFix | `README.md`, `requirements.txt`, screenshots, verification notes, release page | v1.0.0, 22 Oct 2026 | — |
| Sarp | https://github.com/hmmlavi/Sarp | `README.md`, `package.json`, `vite.config.ts`, screenshots, live demo, release page | v1.0.0, 19 Oct 2026 | https://sarp3d.vercel.app/ |
| Pustakalaya | https://github.com/hmmlavi/Pustakalaya-LMS | `README.md`, `requirements.txt`, `requirements-dev.txt`, architecture docs, screenshots, release assets | v1.0.0, 24 Oct 2026 | — |

## Notes on accuracy

- Veylo is documented as a **React/TypeScript browser PWA with a Capacitor Android shell**, not only a native Android application.
- SaBuddy’s README explicitly says it does **not** connect social accounts through OAuth, sync platform metrics, or publish posts automatically. The portfolio repeats those limits rather than presenting them as features.
- FacilityFix has a packaged release but no public live demo; production deployment warnings from its README are preserved as documented limits.
- Sarp’s v1.0.0 release is a tag with no downloadable assets. Its live demo is linked from the repository README and was reachable during verification.
- Pustakalaya is local-first single-host software, not a multi-node service. Its screenshots use synthetic demonstration data.
- Sortify’s screenshots are headless Qt renders with generated sample files, as stated in its README. The portfolio labels them as repository screenshots rather than photographs of a commercial product.
- SaBuddy’s checked-in binary WebP launcher exports were malformed, so `assets-source/screenshots/sabuddy-icon.svg` was reconstructed from the repository’s original `ic_launcher_background.xml` and `ic_launcher_foreground.xml` vector drawables. No feature screenshots were invented.

## Repository link check

Run:

```bash
npm run verify:repos
```

This uses `gh api` to verify each repository’s canonical URL, default branch, archive state, and published release tag. It requires the GitHub CLI to be authenticated.

## Avatar source limitation

The uploaded photograph described in the project brief was not present in the execution environment. `assets-source/avatar/lakshit-avatar.svg` is an original illustration based on the supplied written art direction, not a claim that a photo-derived likeness was produced.
