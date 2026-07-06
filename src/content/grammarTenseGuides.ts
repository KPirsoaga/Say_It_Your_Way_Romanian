import type { GrammarTenseGuide } from '../types';

/** Plain-English tense guides — what it means, not full conjugation tables */
export const grammarTenseGuides: GrammarTenseGuide[] = [
  {
    id: 'tg-present',
    title: 'Present tense',
    subtitle: 'What is happening now',
    icon: 'Sun',
    color: 'sun',
    story:
      'You are at the cabin right now. You pick up a screwdriver and work on the wall. The action is happening now — or it happens regularly. That is the present tense.',
    whenToUse:
      'Use the present when something happens now, every day, or as a general truth. “Lucrez la cabană” = I am working on the cabin (now or generally).',
    compareWith: 'If the action is already finished, use Perfect Compus. If it was ongoing in the past, use Imperfect.',
    examples: [
      { ro: 'Lucrez la cabană.', en: 'I work on the cabin.', pron: 'LOO-krehz lah kah-BAH-nuh.', slow: 'Lucrez... la cabană.' },
      { ro: 'Am o lecție cu Mihaela.', en: 'I have a lesson with Mihaela.', pron: 'Ahm oh lek-TSY-eh koo Mee-HAH-el-ah.', slow: 'Am o lecție... cu Mihaela.' },
      { ro: 'Merg la farmacie.', en: 'I go to the pharmacy.', pron: 'MERG lah far-mah-TSY-eh.', slow: 'Merg... la farmacie.' },
      { ro: 'Înțeleg puțin.', en: 'I understand a little.', pron: 'Uhn-tse-RLEHG poo-TEEN.', slow: 'Înțeleg... puțin.' },
    ],
  },
  {
    id: 'tg-perfect-compus',
    title: 'Perfect compus',
    subtitle: 'Something you already did',
    icon: 'CalendarDays',
    color: 'sea',
    story:
      'You finished putting the screw in the wall. The job is done. You bought bread this morning. These are finished actions — even if they happened today.',
    whenToUse:
      'Use perfect compus when something is finished in the past. Often starts with “am” + a verb form: “Am fost la lecție” = I was at the lesson (and I’m talking about it as a completed thing).',
    compareWith: 'Present = now or usually. Imperfect = something that kept going in the past.',
    examples: [
      { ro: 'Am fost la lecție azi.', en: 'I was at the lesson today.', pron: 'Ahm FOHST lah lek-TSY-eh ah-ZEE.', slow: 'Am fost... la lecție azi.' },
      { ro: 'Am cumpărat pâine.', en: 'I bought bread.', pron: 'Ahm koom-puh-RAHT puh-NEE.', slow: 'Am cumpărat... pâine.' },
      { ro: 'Am lucrat la cabană.', en: 'I worked on the cabin.', pron: 'Ahm loo-KRAHT lah kah-BAH-nuh.', slow: 'Am lucrat... la cabană.' },
      { ro: 'Am înțeles.', en: 'I understood.', pron: 'Ahm uhn-tse-LESS.', slow: 'Am înțeles.' },
    ],
    review: {
      needsReview: true,
      reviewReason: '“Am lucrat la cabană” — confirm natural past form with Mihaela.',
      suggestedBy: 'app author',
      contentArea: 'Grammar Help',
      reviewStatus: 'pending',
    },
  },
  {
    id: 'tg-imperfect',
    title: 'Imperfect tense',
    subtitle: 'Something that kept going in the past',
    icon: 'CalendarDays',
    color: 'sea',
    story:
      'Imagine you were building your cabin all afternoon. The sun was warm. You were working, stopping, working again. The action was still happening — not a single finished job.',
    whenToUse:
      'Use the imperfect when something was ongoing, repeated, or habitual in the past. Think “I used to…” or “I was …-ing”. “Lucram la cabană” = I was working / I used to work on the cabin.',
    compareWith: 'Perfect compus = one finished action. Imperfect = the past kept going.',
    examples: [
      { ro: 'Lucram la cabană.', en: 'I was working on the cabin.', pron: 'LOO-krahm lah kah-BAH-nuh.', slow: 'Lucram... la cabană.' },
      { ro: 'Aveam o cabană mică.', en: 'I had / used to have a small cabin.', pron: 'ah-VAY-ahm oh kah-BAH-nuh MEE-kuh.', slow: 'Aveam... o cabană mică.' },
      { ro: 'Era frumos vara.', en: 'It was beautiful in summer.', pron: 'YEH-rah froo-MOHS VAH-ruh.', slow: 'Era frumos... vara.' },
      { ro: 'Mergeam la lecție în fiecare săptămână.', en: 'I used to go to the lesson every week.', pron: 'MER-jeh-ahm lah lek-TSY-eh uhn FYEH-ah-reh suhp-tuh-MEE-nuh.', slow: 'Mergeam... la lecție.' },
    ],
    review: {
      needsReview: true,
      reviewReason: 'Imperfect examples — confirm natural Romanian with Mihaela.',
      suggestedBy: 'app author',
      contentArea: 'Grammar Help',
      reviewStatus: 'pending',
    },
  },
  {
    id: 'tg-future',
    title: 'Future tense',
    subtitle: 'Something that will happen later',
    icon: 'ArrowRight',
    color: 'coral',
    story:
      'Tomorrow you will go to your lesson. Next week you will finish the roof. The action has not happened yet — you are talking about later.',
    whenToUse:
      'Use the future for what will happen. The easiest everyday form is “o să…” + verb: “O să merg la lecție” = I will go to the lesson. “Mâine” (tomorrow) often appears with future ideas.',
    compareWith: 'Present = now. Future = later. Perfect compus = already done.',
    examples: [
      { ro: 'Mâine am lecție de română.', en: 'Tomorrow I have a Romanian lesson.', pron: 'MUH-ee-neh ahm lek-TSY-eh deh roh-MUH-nuh.', slow: 'Mâine am lecție... de română.' },
      { ro: 'O să merg la farmacie.', en: 'I will go to the pharmacy.', pron: 'Oh suh MERG lah far-mah-TSY-eh.', slow: 'O să merg... la farmacie.' },
      { ro: 'O să lucrez la cabană.', en: 'I will work on the cabin.', pron: 'Oh suh LOO-krehz lah kah-BAH-nuh.', slow: 'O să lucrez... la cabană.' },
      { ro: 'O să vorbesc cu Mihaela.', en: 'I will speak with Mihaela.', pron: 'Oh suh VOR-besk koo Mee-HAH-el-ah.', slow: 'O să vorbesc... cu Mihaela.' },
    ],
  },
];

export function getGrammarTenseGuide(id: string): GrammarTenseGuide | undefined {
  return grammarTenseGuides.find((g) => g.id === id);
}
