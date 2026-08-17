import type { GrammarTopic } from '../types';
import { extendedGrammarTopics } from './grammarExtended';

export { grammarCheatSheets, getGrammarCheatSheet } from './grammarCheatSheets';
export { grammarTenseGuides, getGrammarTenseGuide } from './grammarTenseGuides';
export { grammarSentencePatterns, getGrammarSentencePattern } from './grammarSentencePatterns';
export { grammarPartsOfSpeech } from './grammarPartsOfSpeech';
export { getVerbFormsForTense, getVerbExamplesForTense, getAvailableTenses } from './grammarVerbTenses';

const patternGrammarTopics: GrammarTopic[] = [
  {
    id: 'gr-present',
    title: 'Present tense — now',
    summary: 'Talk about what happens now, every day, or usually.',
    group: 'indicative',
    icon: 'Sun',
    color: 'sun',
    patternRo: 'Eu + verb (acum / în fiecare zi)',
    patternEn: 'I + verb (now / every day)',
    whenToUse: 'Use the present for what happens now, regularly, or as a general truth.',
    tip: 'Romanian often drops “I” — the verb ending shows who is speaking.',
    simplerRo: 'Eu vorbesc. / Vorbesc.',
    simplerEn: 'I speak. / (I) speak.',
    examples: [
      { ro: 'Eu locuiesc în România.', en: 'I live in Romania.', pron: 'YOH lo-coo-YEHSK uhn roh-MUH-nee-uh.', slow: 'Eu locuiesc... în România.' },
      { ro: 'Învăț româna cu Mihaela.', en: 'I learn Romanian with Mihaela.', pron: 'Uhn-VATS roh-MUH-nuh koo Mee-HAH-el-ah.', slow: 'Învăț româna... cu Mihaela.' },
      { ro: 'Mănânc la ora șapte.', en: 'I eat at seven o’clock.', pron: 'Muhn-UHNK lah oh-ruh SHAP-teh.', slow: 'Mănânc... la ora șapte.' },
      { ro: 'Lucrez de acasă.', en: 'I work from home.', pron: 'LOO-krehz deh ah-kuh-SAH.', slow: 'Lucrez... de acasă.' },
    ],
  },
  {
    id: 'gr-past',
    title: 'Perfect compus — past tense',
    summary: 'Say what you did earlier today or yesterday.',
    group: 'indicative',
    icon: 'CalendarDays',
    color: 'sea',
    patternRo: 'Am + past participle',
    patternEn: 'I have + past participle',
    whenToUse: 'Use perfect compus for completed actions in the past — often with “am” + verb form.',
    tip: 'Start with “Am fost…” (I was) or “Am…” + past participle. Keep it short.',
    simplerRo: 'Am fost acasă. / Am mâncat.',
    simplerEn: 'I was at home. / I ate.',
    examples: [
      { ro: 'Am fost la lecție azi.', en: 'I was at the lesson today.', pron: 'Ahm FOHST lah lek-TSY-eh ah-ZEE.', slow: 'Am fost... la lecție azi.' },
      { ro: 'Am cumpărat pâine.', en: 'I bought bread.', pron: 'Ahm koom-puh-RAHT puh-NEE.', slow: 'Am cumpărat... pâine.' },
      { ro: 'Am vorbit cu vecinul.', en: 'I spoke with the neighbour.', pron: 'Ahm VOR-beet koo veh-CHEE-nool.', slow: 'Am vorbit... cu vecinul.' },
      { ro: 'Ieri am fost obosit.', en: 'Yesterday I was tired.', pron: 'YEH-ree ahm FOHST oh-bee-SEET.', slow: 'Ieri am fost... obosit.' },
    ],
  },
  {
    id: 'gr-future',
    title: 'Future tense — later',
    summary: 'Talk about tomorrow or later today.',
    group: 'indicative',
    icon: 'ArrowRight',
    color: 'coral',
    patternRo: 'O să + verb / Mâine + verb',
    patternEn: 'I will + verb / Tomorrow + verb',
    whenToUse: 'Use the future for what will happen later — tomorrow, next week, or soon.',
    tip: '“O să…” is the easiest way to say “I will…”. Add “mâine” for tomorrow.',
    simplerRo: 'O să merg. / Mâine merg.',
    simplerEn: 'I will go. / Tomorrow I go.',
    examples: [
      { ro: 'Mâine am lecție de română.', en: 'Tomorrow I have a Romanian lesson.', pron: 'MUH-ee-neh ahm lek-TSY-eh deh roh-MUH-nuh.', slow: 'Mâine am lecție... de română.' },
      { ro: 'O să merg la farmacie.', en: 'I will go to the pharmacy.', pron: 'Oh suh MERG lah far-mah-TSY-eh.', slow: 'O să merg... la farmacie.' },
      { ro: 'O să vorbesc cu contabilul.', en: 'I will speak with the accountant.', pron: 'Oh suh VOR-besk koo kon-tah-BEEL-ool.', slow: 'O să vorbesc... cu contabilul.' },
      { ro: 'Seara o să mă odihnesc.', en: 'This evening I will rest.', pron: 'SEH-ah-ruh oh suh muh oh-dees-NESSK.', slow: 'Seara o să mă odihnesc.' },
    ],
  },
  {
    id: 'gr-pronouns',
    title: 'Pronouns — who?',
    summary: 'Short words for I, you, he, she, we.',
    icon: 'MessageCircle',
    color: 'rose',
    patternRo: 'eu · tu · el/ea · noi · voi · ei/ele',
    patternEn: 'I · you · he/she · we · you (pl.) · they',
    tip: 'You can often skip “eu” and “tu” — the verb shows it. Use them for clarity.',
    simplerRo: 'Eu… / Tu… / El… / Ea…',
    simplerEn: 'I… / You… / He… / She…',
    examples: [
      { ro: 'Eu sunt din Irlanda.', en: 'I am from Ireland.', pron: 'YOH SOONT deen EER-lahn-dah.', slow: 'Eu sunt... din Irlanda.' },
      { ro: 'Tu vorbești bine!', en: 'You speak well!', pron: 'TOO VOR-besht BEE-neh!', slow: 'Tu vorbești... bine!' },
      { ro: 'Ea este profesoara mea.', en: 'She is my teacher.', pron: 'YAH YES-teh pro-feh-SO-ah-ruh MY-uh.', slow: 'Ea este... profesoara mea.' },
      { ro: 'Noi învățăm împreună.', en: 'We learn together.', pron: 'NOY uhn-vuh-TUHM uhm-preh-OO-nuh.', slow: 'Noi învățăm... împreună.' },
    ],
  },
  {
    id: 'gr-key-verbs',
    title: 'I have / am / want / need / can',
    summary: 'Five small verbs that unlock real conversations.',
    icon: 'Sparkles',
    color: 'sun',
    patternRo: 'am · sunt · vreau · am nevoie · pot',
    patternEn: 'I have · I am · I want · I need · I can',
    tip: 'Learn these as whole phrases first. Worry about endings later.',
    simplerRo: 'Am… / Sunt… / Vreau… / Am nevoie de… / Pot…',
    simplerEn: 'I have… / I am… / I want… / I need… / I can…',
    examples: [
      { ro: 'Am o întrebare.', en: 'I have a question.', pron: 'Ahm oh uhn-treh-BAH-reh.', slow: 'Am o întrebare.' },
      { ro: 'Sunt obosit astăzi.', en: 'I am tired today.', pron: 'SOONT oh-bee-SEET ah-STUHZ.', slow: 'Sunt obosit... astăzi.' },
      { ro: 'Vreau o cafea, vă rog.', en: 'I want a coffee, please.', pron: 'VROW oh kah-FEH, vuh ROHG.', slow: 'Vreau o cafea... vă rog.' },
      { ro: 'Am nevoie de ajutor.', en: 'I need help.', pron: 'Ahm neh-YO-eh deh ah-ZHOO-tor.', slow: 'Am nevoie... de ajutor.' },
      {
        ro: 'Puteți repeta, vă rog?',
        en: 'Can you repeat, please?',
        pron: 'poo-TSETS reh-peh-TAH, vuh ROHG?',
        slow: 'Puteți repeta... vă rog?',
      },
    ],
  },
  {
    id: 'gr-patterns',
    title: 'Common sentence patterns',
    summary: 'Useful shapes you hear every day in Romania.',
    icon: 'LayoutGrid',
    color: 'sea',
    patternRo: 'Subject + verb + … / …, vă rog',
    patternEn: 'Subject + verb + … / …, please',
    tip: 'End with “vă rog” to sound polite. Start with “Scuze” if you need attention.',
    simplerRo: '… , vă rog. / Scuze, …',
    simplerEn: '…, please. / Excuse me, …',
    examples: [
      { ro: 'Scuze, unde este…?', en: 'Excuse me, where is…?', pron: 'SKOO-zeh, OON-deh YES-teh...?', slow: 'Scuze... unde este...?' },
      { ro: 'Nu știu cum să spun.', en: 'I don’t know how to say it.', pron: 'NOO SHTYOO koom suh SPOON.', slow: 'Nu știu... cum să spun.' },
      { ro: 'Înțeleg, dar nu pot răspunde acum.', en: 'I understand, but I can’t answer now.', pron: 'Uhn-tse-RLEHG, DAR noo POHT ruhs-POON-deh ah-COON.', slow: 'Înțeleg... dar nu pot răspunde acum.' },
      { ro: 'Un moment, vă rog.', en: 'One moment, please.', pron: 'OON moh-MENT, vuh ROHG.', slow: 'Un moment... vă rog.' },
      { ro: 'E în regulă.', en: 'It’s okay. / That’s fine.', pron: 'Eh uhn reh-GOO-luh.', slow: 'E în regulă.' },
    ],
  },
];

export const grammarTopics: GrammarTopic[] = [...patternGrammarTopics, ...extendedGrammarTopics];

export { canonicalGrammarVerbs as grammarVerbs } from './verbs';
