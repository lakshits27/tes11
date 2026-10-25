export type ProjectFilter = 'Desktop' | 'Web' | 'Mobile' | 'Game' | 'Systems' | 'AI' | 'Data' | 'Tools';

export interface ProjectLink {
  label: string;
  url: string;
  kind: 'repository' | 'release' | 'live';
  note?: string;
}

export interface ProjectVisual {
  file: string;
  alt: string;
  caption: string;
  kind: 'screenshot' | 'app-icon' | 'illustration';
}

export interface ProjectFeature {
  title: string;
  detail: string;
}

export interface Project {
  slug: string;
  name: string;
  kicker: string;
  category: string;
  filters: readonly ProjectFilter[];
  tagline: string;
  summary: string;
  intro: string;
  accent: string;
  accentSecondary: string;
  accentSoft: string;
  featured: boolean;
  year: number;
  problem: string;
  motivation: string;
  approach: string;
  goals: readonly string[];
  decisions: readonly ProjectFeature[];
  features: readonly ProjectFeature[];
  contribution: readonly string[];
  challenges: readonly ProjectFeature[];
  scopeNotes: readonly string[];
  tech: readonly string[];
  links: readonly ProjectLink[];
  status: string;
  statusDetail: string;
  releaseLabel?: string;
  releaseDate?: string;
  liveLabel?: string;
  visuals: readonly ProjectVisual[];
  visualNote: string;
  coverAlt: string;
  coverCaption: string;
  verified: {
    date: string;
    repository: string;
    lastPushed: string;
    sources: readonly string[];
  };
}

const VERIFIED_DATE = '2026-10-25';

export const PROJECTS: readonly Project[] = [
  {
    slug: 'sortify',
    name: 'Sortify',
    kicker: 'Windows desktop utility',
    category: 'Desktop',
    filters: ['Desktop', 'AI', 'Tools'],
    tagline: 'Name every file by what is inside it.',
    summary:
      'A Windows desktop app that reads supported files, proposes reviewable filenames, and applies safe, undoable renames.',
    intro:
      'Sortify turns a risky batch operation into a visible plan. It reads bounded excerpts from supported files, suggests clearer names, and waits for approval before touching anything.',
    accent: '#d7ff65',
    accentSecondary: '#61e7ff',
    accentSoft: 'rgba(215, 255, 101, 0.16)',
    featured: true,
    year: 2026,
    problem:
      'Bulk renaming is repetitive and stressful: a single bad rule can affect dozens of files, and opaque automation is difficult to trust with personal documents.',
    motivation:
      'The idea was to make file organisation predictable, local-first, and reversible — not a blind batch command that hopes for the best.',
    approach:
      'Sortify separates understanding a file, proposing a name, previewing the full plan, applying safe renames, and recording history so the last session can be undone.',
    goals: [
      'Make the exact before-and-after plan visible before any file changes.',
      'Respect collisions, unsupported files, and per-file failures instead of silently overwriting.',
      'Keep the default workflow offline and make external AI naming explicitly opt-in.',
      'Treat undo as a first-class part of the utility.',
    ],
    decisions: [
      {
        title: 'Preview before execution',
        detail: 'Proposals can be edited inline and the Preview plan dialog lists the exact batch before it runs.',
      },
      {
        title: 'Local first, AI by consent',
        detail: 'A local heuristic engine is the default. An OpenAI-compatible endpoint is available only after explicit consent.',
      },
      {
        title: 'Safety in the rename engine',
        detail: 'Collisions are detected before the batch, files are never overwritten, and failures are reported per file.',
      },
      {
        title: 'Recoverable history',
        detail: 'Applied batches are stored in local SQLite history, enabling Undo last session when it is still safe.',
      },
      {
        title: 'Bounded extraction',
        detail: 'Only bounded excerpts and supported formats are read; protected, oversized, and image-only PDFs fall back safely.',
      },
    ],
    features: [
      { title: 'Content-aware naming', detail: 'Reads PDF, Word, Excel, PowerPoint, text/data formats, and image metadata.' },
      { title: 'Two naming engines', detail: 'Uses an offline local heuristic engine or a configurable OpenAI-compatible endpoint.' },
      { title: 'Editable review', detail: 'Shows status, rationale, extracted text, and inline proposal edits in the Review view.' },
      { title: 'Collision-aware renames', detail: 'Detects duplicate destinations before applying and never overwrites files.' },
      { title: 'Undo history', detail: 'Records applied sessions in SQLite and can restore original names when still safe.' },
      { title: 'Windows packaging', detail: 'Ships installer, portable, and standalone builds with SHA-256 checksums.' },
    ],
    contribution: [
      'I authored and maintain the public repository under my GitHub account, hmmlavi.',
      'The repository contains the PySide6 interface, scanning, extraction, validation, rename, and history modules.',
      'It also includes unit and GUI smoke tests, Windows packaging scripts, CI, and release documentation.',
    ],
    challenges: [
      { title: 'Edge cases matter', detail: 'Unsupported files, password-protected PDFs, collisions, and partial failures all need clear outcomes.' },
      { title: 'Privacy by default', detail: 'File excerpts stay local unless a user configures an endpoint and accepts the AI consent flow.' },
      { title: 'Distribution is part of the product', detail: 'The release workflow builds and verifies Windows installer and portable packages.' },
    ],
    scopeNotes: [
      'No OCR is bundled; image-only PDFs fall back to filename and metadata.',
      'Release builds are not code-signed, so Windows SmartScreen may warn before running them.',
      'External AI naming is optional and requires a configured endpoint; API keys stay in the OS keyring.',
    ],
    tech: [
      'Python 3.11+',
      'PySide6 / Qt 6',
      'SQLite',
      'pypdf',
      'python-docx',
      'python-pptx',
      'openpyxl',
      'Pillow',
      'PyInstaller',
      'Inno Setup',
      'GitHub Actions',
    ],
    links: [
      { label: 'View source', url: 'https://github.com/hmmlavi/sortify-desktop', kind: 'repository' },
      {
        label: 'Download v1.0.0',
        url: 'https://github.com/hmmlavi/sortify-desktop/releases/tag/v1.0.0',
        kind: 'release',
        note: 'Installer, portable ZIP, standalone ZIP, and checksums.',
      },
    ],
    status: 'Released · v1.0.0',
    statusDetail: 'Release v1.0.0 was published on 19 October 2026 with three Windows distribution files and SHA-256 checksums.',
    releaseLabel: 'Windows release · v1.0.0',
    releaseDate: '2026-10-19',
    visuals: [
      {
        file: 'sortify-workspace.webp',
        alt: 'Sortify Workspace screen after scanning a folder of sample files',
        caption: 'Workspace after a folder scan. The README identifies this as a headless Qt render with generated sample files.',
        kind: 'screenshot',
      },
      {
        file: 'sortify-preview.webp',
        alt: 'Sortify Preview plan dialog showing the exact planned filename changes',
        caption: 'Preview plan dialog, showing the exact batch before any rename is applied.',
        kind: 'screenshot',
      },
    ],
    visualNote: 'Both screenshots are genuine assets from the Sortify repository README.',
    coverAlt: 'Original illustration of Sortify: stacked document cards transforming into clear filenames along a spectral path',
    coverCaption: 'Original portfolio illustration — not a product screenshot.',
    verified: {
      date: VERIFIED_DATE,
      repository: 'https://github.com/hmmlavi/sortify-desktop',
      lastPushed: '2026-10-19',
      sources: ['README.md', 'requirements.txt', 'Sortify.spec', 'CI workflow', 'GitHub release v1.0.0'],
    },
  },
  {
    slug: 'veylo',
    name: 'Veylo',
    kicker: 'Browser app & Android shell',
    category: 'Web',
    filters: ['Web', 'Mobile', 'Tools'],
    tagline: 'Small habits. Better days.',
    summary:
      'A calm, private habit tracker for browser and Android with streaks, progress views, and an offline, rule-based planner.',
    intro:
      'Veylo is a client-side habit tracker built around a simple promise: your routines stay on your device. It combines daily check-ins, a completion calendar, progress charts, and a deterministic planner without an account or backend.',
    accent: '#61e7ff',
    accentSecondary: '#b69bff',
    accentSoft: 'rgba(97, 231, 255, 0.16)',
    featured: true,
    year: 2026,
    problem:
      'Habit apps can become noisy, account-driven, or dependent on a cloud service. A personal routine tool should be easy to return to and clear about where its data lives.',
    motivation:
      'I wanted a focused tracker that makes consistency visible without turning everyday progress into a competition or sending personal data elsewhere.',
    approach:
      'The same React web app powers the browser/PWA and the Capacitor Android shell. Habit state, check-ins, statistics, and planning are computed and stored locally.',
    goals: [
      'Make daily check-ins quick and uncluttered.',
      'Show streaks, calendars, and trends without requiring an account.',
      'Suggest a realistic day with a deterministic, transparent planner.',
      'Keep personal habit data on the device by default.',
    ],
    decisions: [
      { title: 'No backend', detail: 'There is no account, cloud service, or analytics pipeline behind the habit data.' },
      { title: 'Deterministic planning', detail: 'The planner is rule-based and does not call an AI model or external API.' },
      { title: 'One web core', detail: 'The same Vite build is used in the browser, PWA, and Capacitor Android shell.' },
      { title: 'Offline app shell', detail: 'The installed PWA caches its shell so tracking and planning continue without a network.' },
      { title: 'Personal themes', detail: 'Five colour themes and light, dark, or system appearance are available in Settings.' },
    ],
    features: [
      { title: 'Habit building', detail: 'Create habits with icons, schedules, optional goals, times, reminders, and reordering.' },
      { title: 'Streaks', detail: 'Check in with a tap and follow current and longest streaks over time.' },
      { title: 'Calendar & progress', detail: 'Browse a monthly completion calendar and weekly, monthly, and yearly trends.' },
      { title: 'Rule-based planner', detail: 'Spread selected habits across available time windows and review suggestions before applying.' },
      { title: 'Local privacy', detail: 'Habits, check-ins, and preferences are stored in device browser storage.' },
      { title: 'Android APK', detail: 'A Capacitor Android shell packages the same local web app for direct installation.' },
    ],
    contribution: [
      'I authored and maintain the public Veylo repository under hmmlavi.',
      'The repository includes React screens, local state/storage, date and statistics logic, and the deterministic planner.',
      'It also contains PWA assets, the Capacitor Android project, icon generation, and release packaging.',
    ],
    challenges: [
      { title: 'Privacy versus convenience', detail: 'Local storage keeps data private, but it also means there is no built-in cloud sync or backup.' },
      { title: 'Offline expectations', detail: 'The PWA and Android shell need a cached app shell and network-free planning logic.' },
      { title: 'Small daily interactions', detail: 'Check-ins, themes, sheets, and confirmation flows need to feel calm and predictable.' },
    ],
    scopeNotes: [
      'Browser storage is device-specific; clearing browser or app data can erase habits.',
      'There is no built-in cloud sync or backup yet.',
      'The published APK is debug-signed for direct installation and preview, not a Play Store release build.',
    ],
    tech: ['React 19', 'TypeScript 5', 'Vite 7', 'Tailwind CSS 4', 'Framer Motion', 'Lucide React', 'Capacitor 8', 'Android SDK 36', 'PWA'],
    links: [
      { label: 'View source', url: 'https://github.com/hmmlavi/Veylo', kind: 'repository' },
      { label: 'Open live app', url: 'https://hmmlavi.github.io/Veylo/', kind: 'live', note: 'Verified 25 October 2026.' },
      {
        label: 'Get v1.0.3 APK',
        url: 'https://github.com/hmmlavi/Veylo/releases/tag/v1.0.3',
        kind: 'release',
        note: 'Debug-signed Android APK.',
      },
    ],
    status: 'Live web app · v1.0.3 APK',
    statusDetail: 'The GitHub Pages app is live. Release v1.0.3, published 22 October 2026, includes an Android APK.',
    releaseLabel: 'Android release · v1.0.3',
    releaseDate: '2026-10-22',
    liveLabel: 'Open Veylo ↗',
    visuals: [
      {
        file: 'veylo-today.webp',
        alt: 'Veylo Today screen showing a list of daily habits and a gentle suggestion card',
        caption: 'Today screen from the repository README, showing daily check-ins and a gentler-step suggestion.',
        kind: 'screenshot',
      },
      {
        file: 'veylo-progress.webp',
        alt: 'Veylo Progress screen with habit completion summaries and charts',
        caption: 'Progress screen from the repository README, showing completion summaries and trends.',
        kind: 'screenshot',
      },
    ],
    visualNote: 'Both screenshots are genuine assets from the Veylo repository README.',
    coverAlt: 'Original illustration of Veylo: concentric habit rings, calendar dots, and a rising progress line in cyan and violet',
    coverCaption: 'Original portfolio illustration — not a product screenshot.',
    verified: {
      date: VERIFIED_DATE,
      repository: 'https://github.com/hmmlavi/Veylo',
      lastPushed: '2026-10-22',
      sources: ['README.md', 'package.json', 'capacitor.config.ts', 'GitHub Pages site', 'GitHub release v1.0.3'],
    },
  },
  {
    slug: 'sabuddy',
    name: 'SaBuddy',
    kicker: 'Android creator workspace',
    category: 'Mobile',
    filters: ['Mobile', 'AI', 'Tools'],
    tagline: 'From scattered thought to publishable plan.',
    summary:
      'A Kotlin Android app for planning social content, drafting scripts and captions, and organising ideas in a local calendar.',
    intro:
      'SaBuddy is a local workspace for creators. It brings ideas, Reels scripts, post and carousel outlines, captions, hashtags, a content calendar, saved content, and brand settings into one Android app.',
    accent: '#ff78b7',
    accentSecondary: '#ffb86b',
    accentSoft: 'rgba(255, 120, 183, 0.16)',
    featured: false,
    year: 2026,
    problem:
      'Content ideas often live across notes apps, drafts, and half-written captions. Planning and producing posts can become a second job before anything is published.',
    motivation:
      'The project explores how an AI assistant can reduce creative friction while keeping the creator in control of the final voice and decision.',
    approach:
      'SaBuddy combines structured local content models with optional Gemini assistance. When no API key is configured, or a request fails, the app falls back to local generation.',
    goals: [
      'Keep content ideas, scripts, captions, and hashtags close together.',
      'Make AI assistance optional rather than required.',
      'Provide a planning calendar without pretending to publish automatically.',
      'Keep content and preferences stored locally on the device.',
    ],
    decisions: [
      { title: 'Kotlin + Compose', detail: 'The UI is built with Jetpack Compose and Material 3 on Android.' },
      { title: 'Room for local data', detail: 'Content and preferences are stored locally through Room and a preferences manager.' },
      { title: 'Optional Gemini, local fallback', detail: 'Gemini can generate ideas when configured; built-in local generation remains available.' },
      { title: 'Planning, not publishing', detail: 'The calendar organises content; it does not create background publishing jobs.' },
      { title: 'Honest analytics', detail: 'Analytics are manually entered and maintained by the user, not synced from social platforms.' },
    ],
    features: [
      { title: 'Content creation', detail: 'Create ideas, Reels scripts, post and carousel outlines, captions, and hashtag groups.' },
      { title: 'AI chat', detail: 'Chat with SaBuddy and generate content with Gemini when an API key is configured.' },
      { title: 'Offline fallback', detail: 'Use built-in local generation when no key is configured or a Gemini request fails.' },
      { title: 'Content calendar', detail: 'Save, search, and organise content items in a local calendar.' },
      { title: 'Brand kit & themes', detail: 'Configure a brand kit, app theme, and navigation.' },
      { title: 'Saved analytics', detail: 'Review analytics entered and maintained manually by the user.' },
    ],
    contribution: [
      'I authored and maintain the public SaBuddy repository under hmmlavi.',
      'The repository contains Compose screens, Room data models, a Gemini service, local fallback generation, a view model, and theme files.',
      'It also includes example unit, Robolectric, and instrumented tests, with their limited coverage documented in the README.',
    ],
    challenges: [
      { title: 'AI without dependency', detail: 'The app needs to remain useful when a Gemini key is absent or a network request fails.' },
      { title: 'Clear product boundaries', detail: 'Planning tools must not be confused with OAuth connections, live metrics, or auto-publishing.' },
      { title: 'Reproducible Android builds', detail: 'The README documents missing Gradle wrapper scripts and unverified release build installation.' },
    ],
    scopeNotes: [
      'SaBuddy does not connect social accounts through OAuth, sync platform metrics, or publish posts automatically.',
      'Analytics are user-entered and not synchronised from social accounts.',
      'A v1.0.0 release includes an APK, but the current README does not verify that release build as installable.',
    ],
    tech: ['Kotlin 2.2', 'Jetpack Compose', 'Material 3', 'Room 2.7', 'OkHttp', 'Firebase AI', 'Moshi', 'Retrofit', 'Android API 24–36'],
    links: [
      { label: 'View source', url: 'https://github.com/hmmlavi/SaBuddy', kind: 'repository' },
      {
        label: 'See v1.0.0 APK',
        url: 'https://github.com/hmmlavi/SaBuddy/releases/tag/v1.0.0',
        kind: 'release',
        note: 'Existing APK; current README does not verify installation.',
      },
    ],
    status: 'Source available · v1.0.0 APK',
    statusDetail: 'A v1.0.0 GitHub release with an APK exists. The current README documents Android build requirements and unverified release installation.',
    releaseLabel: 'Android release · v1.0.0',
    releaseDate: '2026-09-05',
    visuals: [
      {
        file: 'sabuddy-icon.webp',
        alt: 'SaBuddy Android app launcher icon',
        caption: 'The launcher icon is a genuine asset from the SaBuddy repository. The repository does not include feature screenshots.',
        kind: 'app-icon',
      },
    ],
    visualNote: 'The repository has no published feature screenshots; the cover is an original illustration and the icon is from its Android resources.',
    coverAlt: 'Original illustration of SaBuddy: a phone-like content calendar with idea cards, script lines, and a glowing assistant star',
    coverCaption: 'Original portfolio illustration — not a product screenshot.',
    verified: {
      date: VERIFIED_DATE,
      repository: 'https://github.com/hmmlavi/SaBuddy',
      lastPushed: '2026-10-24',
      sources: ['README.md', 'app/build.gradle.kts', 'Gradle version catalog', 'source tree', 'GitHub release v1.0.0'],
    },
  },
  {
    slug: 'facilityfix',
    name: 'FacilityFix',
    kicker: 'Flask issue workflow',
    category: 'Web',
    filters: ['Web', 'Systems', 'Data'],
    tagline: 'Make campus issues visible from report to resolution.',
    summary:
      'A Flask and SQLite web app for structured campus facility reporting, role-based coordination, and issue status tracking.',
    intro:
      'FacilityFix replaces scattered facility complaints with a defined workflow. Reporters submit structured issues, coordinators manage priority and status, and both sides can follow the history of a report.',
    accent: '#ffb86b',
    accentSecondary: '#61e7ff',
    accentSoft: 'rgba(255, 184, 107, 0.16)',
    featured: false,
    year: 2026,
    problem:
      'Facility issues reported through messages or verbal conversations are easy to lose. Progress, ownership, and resolution notes become unclear after the initial report.',
    motivation:
      'The project turns a messy real-world process into a consistent, testable web workflow with clear roles and records.',
    approach:
      'A Flask application uses SQLite, server-rendered templates, separated services and repositories, and a Submitted → In Progress → Resolved lifecycle with a reopen path.',
    goals: [
      'Capture facility issues in a consistent structured form.',
      'Give reporters a reliable way to follow status and history.',
      'Give coordinators a focused queue with priority and resolution tools.',
      'Demonstrate practical validation, database design, permissions, and automated tests.',
    ],
    decisions: [
      { title: 'Explicit roles', detail: 'Student, Faculty, Staff, and Facility Coordinator accounts have different capabilities.' },
      { title: 'Defined lifecycle', detail: 'Issues move from Submitted to In Progress to Resolved, with a reporter reopen path.' },
      { title: 'Separated layers', detail: 'Database connection, issue repository, services, routes, and templates are separated.' },
      { title: 'Validated uploads', detail: 'Optional JPEG/PNG images are limited to 2 MiB and processed server-side.' },
      { title: 'CLI-created accounts', detail: 'Public self-registration is not included; user accounts are created through the CLI.' },
    ],
    features: [
      { title: 'Structured reporting', detail: 'Six issue categories plus location, priority suggestion, description, and optional photo.' },
      { title: 'Role-based access', detail: 'Four roles control who can submit, track, manage, and resolve issues.' },
      { title: 'Coordinator dashboard', detail: 'Review the issue queue, update status and priority, and record repair notes.' },
      { title: 'Issue lifecycle', detail: 'Follow Submitted, In Progress, and Resolved states with reopen support.' },
      { title: 'Persistent history', detail: 'SQLite stores application data with dedicated connection, schema, and repository modules.' },
      { title: 'Automated tests', detail: 'The suite covers authentication, coordinator operations, reporting, tracking, permissions, and status transitions.' },
    ],
    contribution: [
      'I authored and maintain the public FacilityFix repository under hmmlavi.',
      'The repository contains the Flask application, database layer, services, templates, static assets, screenshots, and tests.',
      'It also includes installation launchers, verification notes, and requirements documentation.',
    ],
    challenges: [
      { title: 'Workflow clarity', detail: 'Status transitions and role permissions need to be understandable to both reporters and coordinators.' },
      { title: 'Data integrity', detail: 'Validation, persistence errors, and image upload restrictions are part of the test suite.' },
      { title: 'Deployment honesty', detail: 'The README explicitly lists production concerns such as secret management, HTTPS, backups, and upload review.' },
    ],
    scopeNotes: [
      'No public live demo is linked from the repository.',
      'Accounts are created through the CLI; public self-registration is not part of the current setup.',
      'The README says production deployment needs additional security, server, and storage review.',
    ],
    tech: ['Python 3.11+', 'Flask 3', 'SQLite', 'Pillow', 'Waitress', 'HTML5', 'CSS3', 'JavaScript', 'unittest'],
    links: [
      { label: 'View source', url: 'https://github.com/hmmlavi/FacilityFix', kind: 'repository' },
      {
        label: 'Get v1.0.0 ZIP',
        url: 'https://github.com/hmmlavi/FacilityFix/releases/tag/v1.0.0',
        kind: 'release',
        note: 'Packaged app with launchers.',
      },
    ],
    status: 'Released · v1.0.0',
    statusDetail: 'Release v1.0.0 was published on 22 October 2026 with a packaged application ZIP.',
    releaseLabel: 'Packaged release · v1.0.0',
    releaseDate: '2026-10-22',
    visuals: [
      {
        file: 'facilityfix-dashboard.webp',
        alt: 'FacilityFix coordinator dashboard showing a queue of reported facility issues',
        caption: 'Coordinator dashboard from the repository screenshots, showing the issue queue.',
        kind: 'screenshot',
      },
      {
        file: 'facilityfix-report.webp',
        alt: 'Top of the FacilityFix issue reporting form with category choices',
        caption: 'Issue reporting form from the repository screenshots, showing the structured report flow.',
        kind: 'screenshot',
      },
    ],
    visualNote: 'Both screenshots are genuine assets from the FacilityFix repository.',
    coverAlt: 'Original illustration of FacilityFix: a campus building plan with issue pins flowing through a three-step status track',
    coverCaption: 'Original portfolio illustration — not a product screenshot.',
    verified: {
      date: VERIFIED_DATE,
      repository: 'https://github.com/hmmlavi/FacilityFix',
      lastPushed: '2026-10-22',
      sources: ['README.md', 'requirements.txt', 'source tree', 'verification notes', 'GitHub release v1.0.0'],
    },
  },
  {
    slug: 'sarp',
    name: 'Sarp',
    kicker: '3D browser arcade game',
    category: 'Game',
    filters: ['Game', 'Web', 'Tools'],
    tagline: 'Eat. Grow. Don’t crash.',
    summary:
      'A Three.js browser game that gives classic Snake a 3D arena, special apples, rising speed, local high scores, and keyboard or touch controls.',
    intro:
      'Sarp takes a familiar arcade rule set and adds depth — literally. A 21 × 21 3D arena, milestone Rainbow Apples, Fever Mode, changing weather, and procedural audio give short runs a reason to continue.',
    accent: '#d7ff65',
    accentSecondary: '#ff78b7',
    accentSoft: 'rgba(215, 255, 101, 0.16)',
    featured: true,
    year: 2026,
    problem:
      'Classic Snake is instantly understandable, but a small game needs a fresh hook and satisfying feedback before it feels worth replaying.',
    motivation:
      'I wanted to experiment with game feel: a familiar core, a dimensional presentation, escalating pace, and small surprises that reward one more round.',
    approach:
      'React manages menus, HUD, and screen flow while a Three.js game engine handles the 3D arena, effects, audio, scores, and achievements.',
    goals: [
      'Keep the basic goal approachable: collect apples, avoid walls and yourself.',
      'Add variety without burying the original rules.',
      'Make keyboard and touch controls feel fair.',
      'Keep scores and achievements local with no account requirement.',
    ],
    decisions: [
      { title: 'Three.js arena', detail: 'A 21 × 21 grid is presented in 3D with changing weather and multiple snake skins.' },
      { title: 'Milestone Rainbow Apples', detail: 'Every 10th apple, then every 15th, triggers a short Rainbow Mode burst.' },
      { title: 'Layered feedback', detail: 'Combos, Fever Mode, sound effects, and procedural music reinforce moment-to-moment play.' },
      { title: 'Local persistence', detail: 'A top-five score table, achievements, and sound preference are stored in browser storage.' },
      { title: 'Single-file build', detail: 'vite-plugin-singlefile bundles the static game into a self-contained HTML build.' },
    ],
    features: [
      { title: '3D Snake arena', detail: 'Steer through a 21 × 21 grid as the pace increases.' },
      { title: 'Special apples', detail: 'Classic, Golden, Magnet, and milestone Rainbow Apples change the rhythm.' },
      { title: 'Combos & Fever', detail: 'Combos, Fever Mode, multiple skins, and changing weather add variety.' },
      { title: 'Procedural sound', detail: 'Music and sound effects are generated in the browser, with a mute toggle.' },
      { title: 'Local high scores', detail: 'A top-five score table and achievements are saved in the browser.' },
      { title: 'Keyboard & touch', detail: 'Arrow keys/WASD, on-screen direction pad, swipes, pause, restart, and menu controls.' },
    ],
    contribution: [
      'I authored and maintain the public Sarp repository under hmmlavi; the README credits the game to Lavi.',
      'The repository contains React screen flow, the Three.js engine, effects, audio, scores, achievements, and utility modules.',
      'It also includes gameplay screenshots and a repository social preview image.',
    ],
    challenges: [
      { title: 'Readable 3D', detail: 'A dimensional arena still needs clear edges, apples, body segments, and a readable HUD.' },
      { title: 'Escalating pace', detail: 'Speed, combos, and special apples must add excitement without making controls feel unfair.' },
      { title: 'Input coverage', detail: 'Keyboard, swipe, and on-screen touch controls all need consistent pause and restart behaviour.' },
    ],
    scopeNotes: [
      'The v1.0.0 release is a tag; no downloadable release assets are attached.',
      'No license file is included in the repository; check with the author before redistributing or reusing the project.',
    ],
    tech: ['React 19', 'TypeScript 5.9', 'Three.js 0.186', 'Tailwind CSS 4', 'Vite 7', 'vite-plugin-singlefile', 'Web Audio'],
    links: [
      { label: 'View source', url: 'https://github.com/hmmlavi/Sarp', kind: 'repository' },
      { label: 'Play Sarp online', url: 'https://sarp3d.vercel.app/', kind: 'live', note: 'Verified 25 October 2026.' },
      {
        label: 'See v1.0.0 tag',
        url: 'https://github.com/hmmlavi/Sarp/releases/tag/v1.0.0',
        kind: 'release',
        note: 'Tag and release notes; no binary assets.',
      },
    ],
    status: 'Live demo · v1.0.0',
    statusDetail: 'The live demo at sarp3d.vercel.app was verified on 25 October 2026. Release v1.0.0 was published on 19 October 2026.',
    releaseLabel: 'Release tag · v1.0.0',
    releaseDate: '2026-10-19',
    liveLabel: 'Play Sarp ↗',
    visuals: [
      {
        file: 'sarp-gameplay.webp',
        alt: 'Sarp gameplay showing a 3D grid arena, snake, apples, and score HUD',
        caption: 'Gameplay screenshot from the repository, showing the 3D arena and HUD.',
        kind: 'screenshot',
      },
      {
        file: 'sarp-menu.webp',
        alt: 'Sarp main menu with the game title and a 3D arena preview',
        caption: 'Main menu screenshot from the repository.',
        kind: 'screenshot',
      },
    ],
    visualNote: 'Both screenshots are genuine assets from the Sarp repository README.',
    coverAlt: 'Original illustration of Sarp: a perspective grid with a glowing snake trail, apples, and a spectral arc',
    coverCaption: 'Original portfolio illustration — not a product screenshot.',
    verified: {
      date: VERIFIED_DATE,
      repository: 'https://github.com/hmmlavi/Sarp',
      lastPushed: '2026-10-19',
      sources: ['README.md', 'package.json', 'vite.config.ts', 'live demo', 'GitHub release v1.0.0'],
    },
  },
  {
    slug: 'pustakalaya',
    name: 'Pustakalaya',
    kicker: 'Offline library system',
    category: 'Systems',
    filters: ['Systems', 'Web', 'Data'],
    tagline: 'A library’s daily operations, on one local machine.',
    summary:
      'An offline-ready Flask library management system for cataloging, circulation, reservations, fines, reports, and staff access control.',
    intro:
      'Pustakalaya is a serious local-first application for library operations. It models catalog works and physical copies, members and borrowing policies, reservations, money, audit trails, and staff roles in one SQLite-backed system.',
    accent: '#ffb86b',
    accentSecondary: '#d7ff65',
    accentSoft: 'rgba(255, 184, 107, 0.16)',
    featured: false,
    year: 2026,
    problem:
      'Library work is not just a book list. Physical copies, member tiers, due dates, reservations, fines, and staff permissions need consistent rules and an auditable record.',
    motivation:
      'The project explores how to model a real operational domain carefully while still shipping something a library can run locally without a hosted service.',
    approach:
      'A layered Flask application separates domain policies, services, repositories, SQLAlchemy models, web blueprints, and Alembic migrations. SQLite runs locally with foreign keys, WAL mode, and explicit write transactions.',
    goals: [
      'Manage catalog works and physical copy inventory across branches.',
      'Make circulation, reservations, and fines deterministic and auditable.',
      'Support real staff roles and safe first-run administration.',
      'Ship Windows builds that keep runtime data outside the application directory.',
    ],
    decisions: [
      { title: 'Local-first SQLite', detail: 'Single-host operation uses foreign keys, WAL mode, busy timeouts, and explicit transactions.' },
      { title: 'Layered architecture', detail: 'Domain entities, policies, state machines, services, repositories, and ORM models are separated.' },
      { title: 'Exact money handling', detail: 'INR fines use integer paise storage and Decimal calculations with an auditable ledger.' },
      { title: 'Deterministic reservations', detail: 'FIFO queues, pickup deadlines, expired holds, and idempotent reallocation are modelled explicitly.' },
      { title: 'Versioned schema', detail: 'Alembic migrations and dataset verification scripts support repeatable setup.' },
    ],
    features: [
      { title: 'Catalog & inventory', detail: 'ISBN validation, authors, works, physical copies, branches, conditions, and catalog search.' },
      { title: 'Members & circulation', detail: 'Membership tiers, issue, return, renewal, damaged/lost workflows, and holiday-aware due dates.' },
      { title: 'Reservations', detail: 'Eligibility checks, FIFO queues, pickup holds, and automatic allocation after returns.' },
      { title: 'Fines', detail: 'Exact INR calculations, partial/full payments, waivers, receipts, and audit history.' },
      { title: 'Administration', detail: 'Role-based access for ADMIN, LIBRARIAN, and STAFF_READONLY, plus audit and correction workflows.' },
      { title: 'Reports & imports', detail: 'Operational reports, CSV exports, historical import validation, quarantine, and data-quality checks.' },
    ],
    contribution: [
      'I authored and maintain the public Pustakalaya-LMS repository under hmmlavi.',
      'The repository contains domain policies, services, SQLAlchemy repositories, Flask blueprints, Jinja templates, migrations, tests, and packaging scripts.',
      'It also includes architecture, business-rule, design-decision, and data-quality documentation.',
    ],
    challenges: [
      { title: 'Concurrency', detail: 'Atomic issue/return workflows and conditional updates prevent double checkout of one physical copy.' },
      { title: 'Correctness over shortcuts', detail: 'FIFO reservations, idempotent payments, and auditable corrections need explicit state transitions.' },
      { title: 'Safe historical data', detail: 'Imports classify accepted, rejected, quarantined, duplicate, and error records before they affect operations.' },
    ],
    scopeNotes: [
      'The application is designed for reliable single-host operation; it is not a multi-node service without moving the database layer.',
      'The README states that production needs an explicit secret, HTTPS/TLS, and reverse-proxy controls.',
      'Screenshots in the repository were captured with synthetic demonstration data.',
    ],
    tech: ['Python 3.12', 'Flask 3', 'Flask-WTF', 'WTForms', 'SQLAlchemy 2', 'Alembic', 'SQLite', 'Jinja', 'PyInstaller', 'pytest'],
    links: [
      { label: 'View source', url: 'https://github.com/hmmlavi/Pustakalaya-LMS', kind: 'repository' },
      {
        label: 'Get v1.0.0',
        url: 'https://github.com/hmmlavi/Pustakalaya-LMS/releases/tag/v1.0.0',
        kind: 'release',
        note: 'Windows executable, portable ZIP, and checksums.',
      },
    ],
    status: 'Released · v1.0.0',
    statusDetail: 'Release v1.0.0 was published on 24 October 2026 with a Windows executable, portable ZIP, and SHA-256 manifest.',
    releaseLabel: 'Windows release · v1.0.0',
    releaseDate: '2026-10-24',
    visuals: [
      {
        file: 'pustakalaya-dashboard.webp',
        alt: 'Pustakalaya operations dashboard with catalog, circulation, branch, and fine summaries',
        caption: 'Operations dashboard from the repository README, captured with synthetic demonstration data.',
        kind: 'screenshot',
      },
      {
        file: 'pustakalaya-catalog.webp',
        alt: 'Pustakalaya book catalog with search and availability filters',
        caption: 'Searchable catalog from the repository README, captured with synthetic demonstration data.',
        kind: 'screenshot',
      },
    ],
    visualNote: 'Both screenshots are genuine assets from the Pustakalaya-LMS repository README.',
    coverAlt: 'Original illustration of Pustakalaya: library shelves, catalogue cards, and a branching circulation diagram in amber and lime',
    coverCaption: 'Original portfolio illustration — not a product screenshot.',
    verified: {
      date: VERIFIED_DATE,
      repository: 'https://github.com/hmmlavi/Pustakalaya-LMS',
      lastPushed: '2026-10-24',
      sources: ['README.md', 'requirements.txt', 'requirements-dev.txt', 'architecture docs', 'GitHub release v1.0.0'],
    },
  },
];

export const PROJECT_FILTERS: readonly (ProjectFilter | 'All')[] = [
  'All',
  'Desktop',
  'Web',
  'Mobile',
  'Game',
  'Systems',
  'AI',
  'Data',
  'Tools',
];

export function projectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}

export function projectPath(project: Project): string {
  return `projects/${project.slug}/`;
}

export function coverPath(project: Project): string {
  return `covers/${project.slug}.svg`;
}

export function screenshotPath(visual: ProjectVisual): string {
  return `screenshots/${visual.file}`;
}
