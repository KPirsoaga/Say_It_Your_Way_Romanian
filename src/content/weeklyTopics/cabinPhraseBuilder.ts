import type { PhraseBuilderItem } from '../../types';

/** Phrase Builder sentences tied to Building a Cabin — shown first */
export const cabinPhraseBuilderItems: PhraseBuilderItem[] = [
  {
    id: 'pb-cabin-work',
    order: [0, 1],
    chunks: [
      { ro: 'Lucrez', en: 'I work' },
      { ro: 'la cabană.', en: 'on the cabin.' },
    ],
    fullRo: 'Lucrez la cabană.',
    fullEn: 'I am working on the cabin.',
  },
  {
    id: 'pb-cabin-screw',
    order: [0, 1, 2],
    chunks: [
      { ro: 'Pun', en: 'I put' },
      { ro: 'șurubul', en: 'the screw' },
      { ro: 'în perete.', en: 'in the wall.' },
    ],
    fullRo: 'Pun șurubul în perete.',
    fullEn: 'I put the screw in the wall.',
  },
  {
    id: 'pb-cabin-help',
    order: [0, 1, 2],
    chunks: [
      { ro: 'Am nevoie', en: 'I need' },
      { ro: 'de ajutor', en: 'help' },
      { ro: 'la cabană.', en: 'at the cabin.' },
    ],
    fullRo: 'Am nevoie de ajutor la cabană.',
    fullEn: 'I need help at the cabin.',
  },
];
