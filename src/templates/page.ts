import type { LayoutOptions } from './layout.ts';

export interface PageDefinition extends LayoutOptions {
  content: string;
}
