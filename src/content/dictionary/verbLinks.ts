/** Map Romanian infinitives to Grammar Help verb ids */
export const grammarVerbIdByInfinitive: Record<string, string> = {
  'a fi': 'vb-fi',
  'a avea': 'vb-avea',
  'a vrea': 'vb-vrea',
  'a putea': 'vb-putea',
  'a merge': 'vb-merge',
  'a face': 'vb-face',
  'a spune': 'vb-spune',
  'a înțelege': 'vb-intelege',
  'a vorbi': 'vb-vorbi',
  'a avea nevoie': 'vb-nevoie',
  'a pleca': 'vb-pleca',
  'a întreba': 'vb-intreba',
  'a mânca': 'vb-manca',
  'a bea': 'vb-bea',
};

export function lookupGrammarVerbId(infinitive: string): string | undefined {
  const key = infinitive.trim().toLowerCase();
  return grammarVerbIdByInfinitive[key];
}
