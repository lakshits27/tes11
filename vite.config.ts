import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { SITE } from './src/content/site.ts';
import { HTML_ROUTES } from './src/content/routes.ts';

const input = Object.fromEntries(
  HTML_ROUTES.map(({ name, file }) => [name, resolve(process.cwd(), file)]),
);

export default defineConfig({
  base: SITE.basePath,
  publicDir: 'public',
  build: {
    target: 'es2022',
    cssCodeSplit: false,
    sourcemap: false,
    assetsInlineLimit: 2048,
    modulePreload: { polyfill: false },
    rollupOptions: { input },
  },
});
