/** Shared palette + stroke language for hand-drawn editorial illustrations */
export const ILLUSTRATION = {
  forest: '#1C2A23',
  forestMid: '#2D3F34',
  forestLight: '#3A5043',
  olive: '#7A8B5A',
  oliveLight: '#B4C19A',
  linen: '#F4F0E6',
  linenDark: '#E8E2D4',
  coral: '#EB6A4A',
  coralSoft: '#F3B8A8',
  clay: '#C8B9A6',
  sky: '#E8ECE0',
  white: '#FDFBF7',
} as const;

export const SKETCH = {
  stroke: ILLUSTRATION.forest,
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  fill: 'none',
};

export type IllustrationTone = 'forest' | 'olive' | 'coral' | 'linen' | 'clay' | 'sky';

export const toneBackground: Record<IllustrationTone, string> = {
  forest: 'from-forest-700 via-forest-600 to-forest-800',
  olive: 'from-olive-100 via-olive-50 to-linen-100 dark:from-olive-900/40 dark:via-forest-800 dark:to-forest-900',
  coral: 'from-coral-50 via-linen-50 to-coral-100/60 dark:from-coral-900/25 dark:via-forest-800 dark:to-forest-900',
  linen: 'from-linen-100 via-white to-linen-50 dark:from-forest-800 dark:via-forest-700 dark:to-forest-900',
  clay: 'from-clay-100 via-linen-50 to-clay-50 dark:from-forest-800 dark:via-forest-700 dark:to-forest-900',
  sky: 'from-olive-50 via-sky-50 to-linen-100 dark:from-forest-800 dark:via-forest-700 dark:to-forest-900',
};
