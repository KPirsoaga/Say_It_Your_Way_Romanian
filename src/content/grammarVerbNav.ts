/** Curated order for prev/next navigation on verb pages */
export const grammarVerbOrder: string[] = [
  'vb-fi',
  'vb-avea',
  'vb-vrea',
  'vb-putea',
  'vb-merge',
  'vb-face',
  'vb-spune',
  'vb-vorbi',
  'vb-intelege',
  'vb-nevoie',
  'vb-pleca',
  'vb-intreba',
  'vb-manca',
  'vb-bea',
];

export function getVerbNav(verbId: string): { prevId?: string; nextId?: string; index: number } {
  const index = grammarVerbOrder.indexOf(verbId);
  if (index < 0) return { index: -1 };
  return {
    index,
    prevId: index > 0 ? grammarVerbOrder[index - 1] : undefined,
    nextId: index < grammarVerbOrder.length - 1 ? grammarVerbOrder[index + 1] : undefined,
  };
}
