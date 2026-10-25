export interface SkillGroup {
  id: string;
  label: string;
  note: string;
  items: readonly string[];
}

/** Derived from the public GitHub profile README and verified repository manifests. */
export const WORKING_WITH: readonly SkillGroup[] = [
  {
    id: 'languages',
    label: 'Languages',
    note: 'Languages visible across my public repositories and profile.',
    items: ['Python', 'TypeScript', 'JavaScript', 'Kotlin', 'C', 'C++'],
  },
  {
    id: 'front-end',
    label: 'Front end & creative web',
    note: 'Used in Veylo, Sarp, and this portfolio.',
    items: ['React', 'Vite', 'Three.js', 'Canvas', 'SVG', 'CSS', 'Tailwind CSS'],
  },
  {
    id: 'back-end',
    label: 'Back end & data',
    note: 'Used in FacilityFix, Pustakalaya-LMS, and Sortify.',
    items: ['Flask', 'SQLite', 'SQLAlchemy', 'Alembic', 'Pillow', 'REST APIs'],
  },
  {
    id: 'platforms',
    label: 'Platforms & packaging',
    note: 'Verified from project build files and READMEs.',
    items: ['PySide6 / Qt 6', 'Capacitor', 'Jetpack Compose', 'Room', 'PyInstaller', 'GitHub Actions'],
  },
];

export const EXPLORING: readonly string[] = [
  'LLM applications, RAG, and agents',
  'LangChain and applied AI workflows',
  'Systems programming and DSA in C/C++',
  'System design and scalable backends',
  'Advanced TypeScript patterns',
];

export const PORTFOLIO_STACK: readonly string[] = [
  'TypeScript',
  'Vite',
  'Pre-rendered HTML',
  'Vanilla CSS',
  'SVG',
  'Canvas',
  'GitHub Pages',
  'GitHub Actions',
];
