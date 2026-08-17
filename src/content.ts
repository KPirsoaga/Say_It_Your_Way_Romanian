import type { Scenario, PhraseBuilderItem, ListenChooseItem, DailyContent, ColorKey, RealLifeCategory, SurvivalPhrase, NoShameMessage, TinyPracticeContent, MiniConversation } from './types';
import {
  extraScenarios,
  extraRealLifeCategories,
  extraPhraseBuilderItems,
  extraListenChooseItems,
  extraSurvivalPhrases,
  extraMiniConversations,
} from './content/additions';

export {
  grammarTopics,
  grammarVerbs,
  grammarCheatSheets,
  grammarTenseGuides,
  grammarSentencePatterns,
  grammarPartsOfSpeech,
} from './content/grammar';

export const scenarios: Scenario[] = [
  {
    id: 'shop',
    title: 'At the Shop',
    situation: 'You are in a small corner shop buying a few things.',
    icon: 'ShoppingBasket',
    color: 'sea',
    lines: [
      {
        ro: 'Bună ziua! Aveți pâine proaspătă?',
        en: 'Hello! Do you have fresh bread?',
        literal: 'Good day! You-have bread fresh?',
        pron: 'BOO-nuh ZEE-wuh! Ah-VAYTS puh-NE prohs-PET-uh?',
        slow: 'Bună ziua... Aveți... pâine proaspătă?',
      },
      {
        ro: 'Da, am pâine caldă chiar acum.',
        en: 'Yes, I have warm bread right now.',
        literal: 'Yes, I-have bread warm right now.',
        pron: 'Dah, ahm puh-NE kahr-duh kyar ah-COON.',
      },
      {
        ro: 'Vreau două, vă rog.',
        en: "I'd like two, please.",
        literal: 'I-want two, you please.',
        pron: 'VROW DOO-uh, vuh ROHG.',
        slow: 'Vreau... două... vă rog.',
      },
      {
        ro: 'Cât costă?',
        en: 'How much does it cost?',
        literal: 'How much costs?',
        pron: 'KUHT COHS-tuh?',
        slow: 'Cât... costă?',
      },
      {
        ro: 'Faceți cu plăcere. O zi bună!',
        en: 'You\'re welcome. Have a good day!',
        literal: 'You-do with pleasure. A day good!',
        pron: 'Fah-CHETS koo pluh-CHER-ay. Oh ZEE BOO-nuh!',
      },
    ],
  },
  {
    id: 'vet',
    title: 'At the Vet',
    situation: 'You take your cat to the vet for a check-up.',
    icon: 'PawPrint',
    color: 'coral',
    lines: [
      {
        ro: 'Bună ziua. Pisica mea nu mănâncă bine.',
        en: 'Hello. My cat is not eating well.',
        literal: 'Good day. Cat my not eats well.',
        pron: 'BOO-nuh ZEE-wuh. PEE-shee-kuh MY-uh noo muhn-UHN-kuh BEE-neh.',
        slow: 'Pisica mea... nu mănâncă... bine.',
      },
      {
        ro: 'De când are problema?',
        en: 'How long has she had the problem?',
        literal: 'Since when has the problem?',
        pron: 'De kahn ah-ray proh-BLEH-muh?',
      },
      {
        ro: 'De două zile.',
        en: 'For two days.',
        literal: 'Since two days.',
        pron: 'De DOO-uh ZEE-leh.',
      },
      {
        ro: 'O să o examinez acum.',
        en: "I'll examine her now.",
        literal: 'Will her examine now.',
        pron: 'Oh suh oh eks-ah-mee-NEZ ah-COON.',
      },
      {
        ro: 'E doar o mică infecție. E bine.',
        en: "It's just a small infection. She's okay.",
        literal: 'Is only a small infection. Is well.',
        pron: 'Eh DOAR oh MEE-kuh in-fek-TSY-eh. Eh BEE-neh.',
      },
    ],
  },
  {
    id: 'pharmacy',
    title: 'At the Pharmacy',
    situation: 'You go to the pharmacy to get medicine for a headache.',
    icon: 'Pill',
    color: 'rose',
    lines: [
      {
        ro: 'Bună. Am nevoie de ceva pentru durerea de cap.',
        en: 'Hello. I need something for a headache.',
        literal: 'Hello. I-have need of something for the pain of head.',
        pron: 'BOO-nuh. Ahm neh-YO-eh deh CHEH-vuh pen-TRUE doo-RAY-uh deh KAHB.',
        slow: 'Am nevoie... de ceva... pentru durerea de cap.',
      },
      {
        ro: 'Vă recomand pastile acestea.',
        en: 'I recommend these pills.',
        literal: 'You recommend pills these.',
        pron: 'Vuh reh-coh-mahn-nd PAHS-tee-leh a-CHES-tyah.',
      },
      {
        ro: 'Câte pe zi?',
        en: 'How many per day?',
        literal: 'How-many per day?',
        pron: 'KUHT-eh peh ZEE?',
      },
      {
        ro: 'Una dimineața și una seara.',
        en: 'One in the morning and one in the evening.',
        literal: 'One morning-the and one evening-the.',
        pron: 'OO-nuh deem-yah-NAY-tuh shee OO-nuh seh-YAH-ruh.',
        slow: 'Una dimineața... și una seara.',
      },
      {
        ro: 'Mulțumesc mult. La revedere.',
        en: 'Thank you very much. Goodbye.',
        literal: 'Thanks much. At seeing-again.',
        pron: 'MOOL-tsoo-mesk MOOLT. Lah reh-veh-DEH-reh.',
      },
    ],
  },
  {
    id: 'neighbours',
    title: 'Talking to Neighbours',
    situation: 'You meet your neighbour in the stairwell of your building.',
    icon: 'DoorOpen',
    color: 'sun',
    lines: [
      {
        ro: 'Bună dimineața! Cum a fost weekendul?',
        en: 'Good morning! How was the weekend?',
        literal: 'Good morning! How was weekend-the?',
        pron: 'BOO-nuh deem-yah-NAY-tuh! Koom ah FOHST veh-ken-DOOL?',
        slow: 'Bună dimineața!... Cum a fost weekendul?',
      },
      {
        ro: 'A fost liniștit. Am citit o carte.',
        en: 'It was quiet. I read a book.',
        literal: 'Was quiet. I read a book.',
        pron: 'Ah FOHST lee-nish-TEET. Ahm chee-TEET oh KAR-teh.',
      },
      {
        ro: 'Dar dumneavoastră?',
        en: 'And you? (polite)',
        literal: 'But you?',
        pron: 'DAR doom-neh-ah-VWAH-struh?',
      },
      {
        ro: 'Am mers la munte cu familia.',
        en: 'I went to the mountains with my family.',
        literal: 'I-went to mountain with family-the.',
        pron: 'Ahm MERZ lah MOON-teh koo fah-mee-LEE-yuh.',
        slow: 'Am mers... la munte... cu familia.',
      },
      {
        ro: 'Sună grozav. Până data viitoare!',
        en: "Sounds great. See you next time!",
        literal: 'Sounds terrific. Until the date next!',
        pron: 'SOO-nuh groh-ZAHV. puh-NAH DAH-tuh vee-ee-TWAH-reh!',
      },
    ],
  },
  {
    id: 'coffee',
    title: 'Ordering Coffee',
    situation: 'You order a coffee at a café in Bucharest.',
    icon: 'Coffee',
    color: 'coral',
    lines: [
      {
        ro: 'O cafea latte, vă rog.',
        en: 'A latte coffee, please.',
        literal: 'A coffee latte, you please.',
        pron: 'Oh kah-FEH LAHT-teh, vuh ROHG.',
        slow: 'O cafea latte... vă rog.',
      },
      {
        ro: 'Doriți și altceva?',
        en: 'Would you like anything else?',
        literal: 'You-want also something-else?',
        pron: 'Doh-REETS shee ahlt-CHEH-vuh?',
      },
      {
        ro: 'Da, o apă plată, mulțumesc.',
        en: 'Yes, a still water, thank you.',
        literal: 'Yes, a water flat, thanks.',
        pron: 'Dah, oh AH-puh PLAH-tuh, mool-tsoo-MESK.',
        slow: 'Da... o apă plată... mulțumesc.',
      },
      {
        ro: 'Cu zahăr sau fără?',
        en: 'With sugar or without?',
        literal: 'With sugar or without?',
        pron: 'Koo zah-HAHR sow FLAH-ruh?',
      },
      {
        ro: 'Fără zahăr. Plătesc acum.',
        en: 'No sugar. I\'ll pay now.',
        literal: 'Without sugar. I-pay now.',
        pron: 'FLAH-ruh zah-HAHR. PLUH-tesk ah-COON.',
        slow: 'Fără zahăr... Plătesc acum.',
      },
    ],
  },
  {
    id: 'help',
    title: 'Asking for Help',
    situation: 'You are lost and ask someone on the street for directions.',
    icon: 'MapPin',
    color: 'sea',
    lines: [
      {
        ro: 'Scuze, mă puteți ajuta?',
        en: 'Excuse me, can you help me?',
        literal: 'Excuse, me you-can help?',
        pron: 'SKOO-zeh, muh poo-TETS ah-joo-TAH?',
        slow: 'Scuze... mă puteți ajuta?',
      },
      {
        ro: 'Unde este stația de metrou?',
        en: 'Where is the subway station?',
        literal: 'Where is station-the of subway?',
        pron: 'OON-deh YES-teh STAH-tsyah deh meh-TROH?',
      },
      {
        ro: 'Mergeți drept înainte, apoi la stânga.',
        en: 'Go straight ahead, then turn left.',
        literal: 'You-go straight ahead, then to left.',
        pron: 'MER-gerts DREPT ee-neh-EHN-teh, ah-POY lah STUHN-guh.',
        slow: 'Mergeți drept înainte... apoi la stânga.',
      },
      {
        ro: 'E departe?',
        en: 'Is it far?',
        literal: 'Is far?',
        pron: 'Eh deh-PAR-teh?',
        slow: 'E departe?',
      },
      {
        ro: 'Nu, e la cinci minute. Mulțumesc frumos!',
        en: 'No, it\'s five minutes away. Thank you kindly!',
        literal: 'No, is at five minutes. Thanks beautifully!',
        pron: 'NOO, eh lah KOWN-CEE mee-NOO-teh. MOOL-tsoo-mesk froo-MOHS!',
        slow: 'Nu, e la cinci minute... Mulțumesc frumos!',
      },
    ],
  },
  {
    id: 'appointment',
    title: 'Making Appointments',
    situation: 'You call to make an appointment with a doctor.',
    icon: 'CalendarClock',
    color: 'rose',
    lines: [
      {
        ro: 'Aș vrea să fac o programare.',
        en: 'I\'d like to make an appointment.',
        literal: 'I-would want to do an appointment.',
        pron: 'UHSH VRYAH suh FAHK oh proh-grah-MAH-reh.',
        slow: 'Aș vrea... să fac o programare.',
      },
      {
        ro: 'Când ar fi convenabil?',
        en: 'When would be convenient?',
        literal: 'When would be convenient?',
        pron: 'KUHN ahr fee con-veh-nah-BEEL?',
      },
      {
        ro: 'Mâine dimineața, la ora nouă.',
        en: 'Tomorrow morning, at nine o\'clock.',
        literal: 'Tomorrow morning, at the hour nine.',
        pron: 'MUH-ee-neh deem-yah-NAY-tuh, lah oh-ruh NOW.',
        slow: 'Mâine dimineața... la ora nouă.',
      },
      {
        ro: 'Numele dumneavoastră, vă rog.',
        en: 'Your name, please.',
        literal: 'Name-the yours, you please.',
        pron: 'NOO-meh-leh doom-neh-ah-VWAH-struh, vuh ROHG.',
      },
      {
        ro: 'Gata. Vă așteptăm mâine la nouă.',
        en: 'All set. We\'ll expect you tomorrow at nine.',
        literal: 'Ready. You we-expect tomorrow at nine.',
        pron: 'GAH-tuh. Vuh ush-teh-PUHM MUH-ee-neh lah NOW.',
        slow: 'Gata. Vă așteptăm mâine la nouă.',
      },
    ],
  },
  {
    id: 'today',
    title: 'What I Did Today',
    situation: 'You tell a friend about your day over dinner.',
    icon: 'Sun',
    color: 'sun',
    lines: [
      {
        ro: 'Astăzi am fost la piață.',
        en: 'Today I went to the market.',
        literal: 'Today I was at market.',
        pron: 'Ah-STUHZ ahm FOHST lah PYAH-tzuh.',
        slow: 'Astăzi am fost... la piață.',
      },
      {
        ro: 'Am cumpărat roșii și castraveți.',
        en: 'I bought tomatoes and cucumbers.',
        literal: 'I-bought tomatoes and cucumbers.',
        pron: 'Ahm koom-puh-RAHT ROH-shee shee kah-struh-VEHTS.',
        slow: 'Am cumpărat roșii... și castraveți.',
      },
      {
        ro: 'Apoi am gătit o supă bună.',
        en: 'Then I cooked a good soup.',
        literal: 'Then I-cooked a soup good.',
        pron: 'Ah-POY ahm guh-TEET oh SOO-puh BOO-nuh.',
        slow: 'Apoi am gătit... o supă bună.',
      },
      {
        ro: 'Am fost și la o plimbare în parc.',
        en: 'I also went for a walk in the park.',
        literal: 'I-was also at a walk in park.',
        pron: 'Ahm FOHST shee lah oh pleem-BAH-reh uhn PAHRK.',
        slow: 'Am fost și la o plimbare... în parc.',
      },
      {
        ro: 'A fost o zi foarte liniștită.',
        en: 'It was a very quiet day.',
        literal: 'Was a day very quiet.',
        pron: 'Ah FOHST oh ZEE fah-OR-teh lee-nish-TEE-tuh.',
        slow: 'A fost o zi... foarte liniștită.',
      },
    ],
  },
  {
    id: 'problem',
    title: 'Explaining a Problem',
    situation: 'You call your landlord about a leaking pipe.',
    icon: 'Wrench',
    color: 'coral',
    lines: [
      {
        ro: 'Bună seara. Am o problemă în baie.',
        en: 'Good evening. I have a problem in the bathroom.',
        literal: 'Good evening. I-have a problem in bathroom.',
        pron: 'BOO-nuh seh-YAH-ruh. Ahm oh proh-BLEH-muh uhn BAH-yeh.',
        slow: 'Am o problemă... în baie.',
      },
      {
        ro: 'Țeva apă pe podea.',
        en: 'There\'s some water on the floor.',
        literal: 'Leaks-some water on floor.',
        pron: 'TSYEH-vuh AH-puh peh poh-DEH-uh.',
        review: {
          needsReview: true,
          reviewReason:
            'Likely typo — may mean "Curge apă pe podea." (water is leaking on the floor).',
          suggestedBy: 'app author',
          contentArea: 'Scenarios',
          reviewStatus: 'pending',
        },
      },
      {
        ro: 'Cred că e o țeavă spartă.',
        en: 'I think it\'s a broken pipe.',
        literal: 'I-believe that is a pipe broken.',
        pron: 'KREHD kuh eh oh TSYEH-vuh SPAR-tuh.',
        slow: 'Cred că e... o țeavă spartă.',
      },
      {
        ro: 'Puteți veni azi să o reparați?',
        en: 'Can you come today to fix it?',
        literal: 'You-can come today to it you-fix?',
        pron: 'Poo-TETS ven EE ahz suh oh reh-puh-RAHTS?',
        slow: 'Puteți veni azi... să o reparați?',
      },
      {
        ro: 'Vin imediat. Nu vă faceți griji.',
        en: "I'll come immediately. Don't worry.",
        literal: 'I-come immediately. Not you worry.',
        pron: 'VEEN ee-meh-dee-AHT. NOO vuh fah-TSETS GREE-zhee.',
        slow: 'Vin imediat... Nu vă faceți griji.',
      },
    ],
  },
  {
    id: 'smalltalk',
    title: 'Small Talk',
    situation: 'You chat with a colleague before a meeting starts.',
    icon: 'MessageCircle',
    color: 'sea',
    lines: [
      {
        ro: 'Ce mai faci?',
        en: 'How are you doing?',
        literal: 'What more you-do?',
        pron: 'Cheh MY FAHTS?',
        slow: 'Ce mai faci?',
      },
      {
        ro: 'Bine, mulțumesc. Tu ce mai zici?',
        en: 'Fine, thanks. How about you?',
        literal: 'Well, thanks. You what more you-say?',
        pron: 'BEE-neh, mool-tsoo-MESK. TOO cheh MY ZEETS?',
        slow: 'Bine, mulțumesc... Tu ce mai zici?',
      },
      {
        ro: 'E frumos azi, nu-i așa?',
        en: 'It\'s beautiful today, isn\'t it?',
        literal: 'Is beautiful today, not-it so?',
        pron: 'Eh froo-MOHS ah-STUHZ, noo-ee UHSH?',
      },
      {
        ro: 'Da, e perfect pentru o plimbare.',
        en: 'Yes, it\'s perfect for a walk.',
        literal: 'Yes, is perfect for a walk.',
        pron: 'DAH, eh pehr-FEKT pen-TRUE oh pleem-BAH-reh.',
        slow: 'Da, e perfect... pentru o plimbare.',
      },
      {
        ro: 'Hai să începem întâlnirea.',
        en: "Let's start the meeting.",
        literal: 'Let to we-start meeting-the.',
        pron: 'HY suh uhn-CHEH-pem uhn-tuhn-LEE-yuh.',
        slow: 'Hai să începem... întâlnirea.',
      },
    ],
  },
];

extraScenarios.forEach((s) => scenarios.push(s));

export const phraseBuilderItems: PhraseBuilderItem[] = [
  {
    id: 'pb-lesson',
    order: [0, 1, 2],
    chunks: [
      { ro: 'Eu am', en: 'I have' },
      { ro: 'lecția de română', en: 'my Romanian lesson' },
      { ro: 'la ora două.', en: 'at two o\'clock.' },
    ],
    fullRo: 'Eu am lecția de română la ora două.',
    fullEn: 'I have my Romanian lesson at two o\'clock.',
  },
  {
    id: 'pb-coffee',
    order: [0, 1, 2],
    chunks: [
      { ro: 'Vreau', en: 'I want' },
      { ro: 'o cafea mare', en: 'a big coffee' },
      { ro: 'fără zahăr.', en: 'without sugar.' },
    ],
    fullRo: 'Vreau o cafea mare fără zahăr.',
    fullEn: 'I want a big coffee without sugar.',
  },
  {
    id: 'pb-help',
    order: [0, 1, 2],
    chunks: [
      { ro: 'Nu știu', en: 'I don\'t know' },
      { ro: 'unde este', en: 'where is' },
      { ro: 'farmacia.', en: 'the pharmacy.' },
    ],
    fullRo: 'Nu știu unde este farmacia.',
    fullEn: 'I don\'t know where the pharmacy is.',
  },
  {
    id: 'pb-tomorrow',
    order: [0, 1, 2],
    chunks: [
      { ro: 'Mâine', en: 'Tomorrow' },
      { ro: 'merg la', en: 'I go to' },
      { ro: 'doctor la ora zece.', en: 'the doctor at ten o\'clock.' },
    ],
    fullRo: 'Mâine merg la doctor la ora zece.',
    fullEn: 'Tomorrow I go to the doctor at ten o\'clock.',
  },
  {
    id: 'pb-tired',
    order: [0, 1, 2],
    chunks: [
      { ro: 'Sunt', en: 'I am' },
      { ro: 'foarte obosită', en: 'very tired' },
      { ro: 'după muncă.', en: 'after work.' },
    ],
    fullRo: 'Sunt foarte obosită după muncă.',
    fullEn: 'I am very tired after work.',
  },
  {
    id: 'pb-shops',
    order: [0, 1, 2],
    chunks: [
      { ro: 'Trebuie să cumpăr', en: 'I have to buy' },
      { ro: 'pâine și lapte', en: 'bread and milk' },
      { ro: 'de la magazin.', en: 'from the shop.' },
    ],
    fullRo: 'Trebuie să cumpăr pâine și lapte de la magazin.',
    fullEn: 'I have to buy bread and milk from the shop.',
  },
];

extraPhraseBuilderItems.forEach((i) => phraseBuilderItems.push(i));

export const listenChooseItems: ListenChooseItem[] = [
  {
    id: 'lc-1',
    ro: 'Vreau două pâini, vă rog.',
    correct: "I'd like two loaves of bread, please.",
    options: ["I'd like two loaves of bread, please.", 'I want to bake two loaves of bread.', 'The bread costs two lei.'],
    pron: 'VROW DOO-uh puh-NEE, vuh ROHG.',
  },
  {
    id: 'lc-2',
    ro: 'Am nevoie de ceva pentru durerea de cap.',
    correct: 'I need something for a headache.',
    options: ['I have a headache right now.', 'I need something for a headache.', 'My head hurts less now.'],
    pron: 'Ahm neh-YO-eh deh CHEH-vuh pen-TRUE doo-RAY-uh deh KAHB.',
  },
  {
    id: 'lc-3',
    ro: 'Mergeți drept înainte, apoi la stânga.',
    correct: 'Go straight ahead, then turn left.',
    options: ['Go back, then turn right.', 'Go straight ahead, then turn left.', 'The street is on the left.'],
    pron: 'MER-gerts DREPT ee-neh-EHN-teh, ah-POY lah STUHN-guh.',
  },
  {
    id: 'lc-4',
    ro: 'Mâine merg la doctor la ora zece.',
    correct: 'Tomorrow I go to the doctor at ten o\'clock.',
    options: ['The doctor comes tomorrow at ten.', 'Tomorrow I go to the doctor at ten o\'clock.', 'I saw the doctor yesterday at ten.'],
    pron: 'MUH-ee-neh MERG lah dok-TOR lah oh-ruh ZEH-cheh.',
  },
  {
    id: 'lc-5',
    ro: 'Ce mai faci?',
    correct: 'How are you doing?',
    options: ['What are you doing later?', 'How are you doing?', 'What did you make?'],
    pron: 'Cheh MY FAHTS?',
  },
  {
    id: 'lc-6',
    ro: 'A fost o zi foarte liniștită.',
    correct: 'It was a very quiet day.',
    options: ['It was a very quiet day.', 'The day was very long.', 'It was a sunny day.'],
    pron: 'Ah FOHST oh ZEE fah-OR-teh lee-nish-TEE-tuh.',
  },
  {
    id: 'lc-7',
    ro: 'Pisica mea nu mănâncă bine.',
    correct: 'My cat is not eating well.',
    options: ['My cat eats very well.', 'My cat is not eating well.', 'The cat is not mine.'],
    pron: 'PEE-shee-kuh MY-uh noo muhn-UHN-kuh BEE-neh.',
  },
  {
    id: 'lc-8',
    ro: 'Fără zahăr, vă rog.',
    correct: 'No sugar, please.',
    options: ['With lots of sugar, please.', 'No sugar, please.', 'Sugar is extra, please.'],
    pron: 'FLAH-ruh zah-HAHR, vuh ROHG.',
  },
];

extraListenChooseItems.forEach((i) => listenChooseItems.push(i));

/** Build deterministic daily content from a date so it stays stable per day. */
export function getDailyContent(dateStr: string): DailyContent {
  // Deterministic pick based on the date string characters
  let seed = 0;
  for (let i = 0; i < dateStr.length; i++) seed = (seed * 31 + dateStr.charCodeAt(i)) % 100000;
  const rand = (n: number) => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed % n;
  };

  const scenario = scenarios[rand(scenarios.length)];
  const phrase = scenario.lines[rand(scenario.lines.length)];

  const dialogue: import('./types').MiniDialogue[] = [
    { speaker: 'A', ro: scenario.lines[0].ro, en: scenario.lines[0].en, pron: scenario.lines[0].pron },
    { speaker: 'B', ro: scenario.lines[1].ro, en: scenario.lines[1].en, pron: scenario.lines[1].pron },
  ];

  const listen = listenChooseItems[rand(listenChooseItems.length)];

  const speakScenario = scenarios[rand(scenarios.length)];
  const speak = speakScenario.lines[rand(speakScenario.lines.length)];

  return { date: dateStr, phrase, dialogue, listen, speak };
}

export const colorMap: Record<ColorKey, { bg: string; bgSoft: string; text: string; ring: string; grad: string }> = {
  sea: {
    bg: 'bg-sea-500',
    bgSoft: 'bg-sea-50 dark:bg-sea-600/20',
    text: 'text-sea-600 dark:text-sea-200',
    ring: 'ring-sea-500/30',
    grad: 'from-sea-400 to-sea-600',
  },
  coral: {
    bg: 'bg-coral-400',
    bgSoft: 'bg-coral-50 dark:bg-coral-400/20',
    text: 'text-coral-500 dark:text-coral-200',
    ring: 'ring-coral-400/30',
    grad: 'from-coral-300 to-coral-500',
  },
  sun: {
    bg: 'bg-sun-300',
    bgSoft: 'bg-sun-50 dark:bg-sun-300/20',
    text: 'text-sun-400 dark:text-sun-200',
    ring: 'ring-sun-300/40',
    grad: 'from-sun-200 to-sun-400',
  },
  rose: {
    bg: 'bg-rose-400',
    bgSoft: 'bg-rose-50 dark:bg-rose-400/20',
    text: 'text-rose-400 dark:text-rose-200',
    ring: 'ring-rose-400/30',
    grad: 'from-rose-200 to-rose-400',
  },
  sand: {
    bg: 'bg-sand-500',
    bgSoft: 'bg-sand-100 dark:bg-sand-500/20',
    text: 'text-sand-500 dark:text-sand-300',
    ring: 'ring-sand-500/30',
    grad: 'from-sand-400 to-sand-500',
  },
};

/* ------------------------------------------------------------------ */
/* Real Life Mode — urgent daily situations, grouped                   */
/* ------------------------------------------------------------------ */

export const realLifeCategories: RealLifeCategory[] = [
  {
    id: 'rl-help',
    title: 'I need help',
    when: 'When you’re stuck and need someone to assist you',
    icon: 'HandHeart',
    color: 'coral',
    phrases: [
      {
        ro: 'Ajutor, vă rog!',
        en: 'Help, please!',
        literal: 'Help, you please!',
        pron: 'Ah-ZHOO-tor, vuh ROHG!',
        slow: 'Ajutor... vă rog!',
      },
      {
        ro: 'Aveți timp să mă ajutați?',
        en: 'Do you have time to help me?',
        literal: 'You-have time to me you-help?',
        pron: 'Ah-VAYTS TEEHM suh muh ah-joo-TAHTS?',
        slow: 'Aveți timp... să mă ajutați?',
      },
      {
        ro: 'Nu știu ce să fac.',
        en: 'I don’t know what to do.',
        literal: 'Not I-know what to do.',
        pron: 'NOO SHTYOO cheh suh FAHK.',
        slow: 'Nu știu... ce să fac.',
      },
      {
        ro: 'Puteți suna pe cineva pentru mine?',
        en: 'Can you call someone for me?',
        literal: 'You-can call someone for me?',
        pron: 'Poo-TETS SOO-nuh peh chee-neh-VAH pen-TRUE MEE-neh?',
        slow: 'Puteți suna... pe cineva pentru mine?',
      },
    ],
  },
  {
    id: 'rl-understand',
    title: 'I don’t understand',
    when: 'When someone is speaking and you can’t follow',
    icon: 'EarOff',
    color: 'sea',
    phrases: [
      {
        ro: 'Nu înțeleg.',
        en: 'I don’t understand.',
        literal: 'Not I-understand.',
        pron: 'NOO uhn-tse-RLEHG.',
        slow: 'Nu... înțeleg.',
      },
      {
        ro: 'Înțeleg doar puțin.',
        en: 'I understand only a little.',
        literal: 'I-understand only little.',
        pron: 'Uhn-tse-RLEHG DOAR poo-TEEN.',
        slow: 'Înțeleg... doar puțin.',
      },
      {
        ro: 'Puteți repeta, vă rog?',
        en: 'Can you repeat, please?',
        literal: 'You-can repeat, you please?',
        pron: 'Poo-TETS reh-peh-TAH, vuh ROHG?',
        slow: 'Puteți repeta... vă rog?',
      },
      {
        ro: 'Vorbiți mai încet, vă rog.',
        en: 'Please speak more slowly.',
        literal: 'You-speak more slowly, you please.',
        pron: 'VOR-beets MY uhn-CHET, vuh ROHG.',
        slow: 'Vorbiți mai încet... vă rog.',
      },
      {
        ro: 'Nu vorbesc bine româna.',
        en: 'I don’t speak Romanian well.',
        literal: 'Not I-speak well Romanian-the.',
        pron: 'NOO VOR-besk BEE-neh roh-MUH-nuh.',
        slow: 'Nu vorbesc bine... româna.',
      },
    ],
  },
  {
    id: 'rl-doctor',
    title: 'At the doctor / vet',
    when: 'When you or your pet needs medical help',
    icon: 'Stethoscope',
    color: 'rose',
    phrases: [
      {
        ro: 'Nu mă simt bine.',
        en: 'I don’t feel well.',
        literal: 'Not me I-feel well.',
        pron: 'NOO muh SEEMT BEE-neh.',
        slow: 'Nu mă simt... bine.',
      },
      {
        ro: 'Câinele meu e bolnav.',
        en: 'My dog is sick.',
        literal: 'Dog-the my is sick.',
        pron: 'KUH-ee-neh-leh MEH-oo eh bol-NAHV.',
        slow: 'Câinele meu... e bolnav.',
      },
      {
        ro: 'Pisica mea e bolnavă.',
        en: 'My cat is sick.',
        literal: 'Cat-the my is sick.',
        pron: 'PEE-shee-kuh MY-uh eh bol-NAH-vuh.',
        slow: 'Pisica mea... e bolnavă.',
      },
      {
        ro: 'Mă doare aici.',
        en: 'It hurts here.',
        literal: 'Me hurts here.',
        pron: 'Muh DWAH-reh ah-EES.',
        slow: 'Mă doare... aici.',
      },
      {
        ro: 'Am nevoie de un doctor acum.',
        en: 'I need a doctor now.',
        literal: 'I-have need of a doctor now.',
        pron: 'Ahm neh-YO-eh deh oon DOK-tor ah-COON.',
        slow: 'Am nevoie de un doctor... acum.',
      },
    ],
  },
  {
    id: 'rl-shop',
    title: 'At the shop',
    when: 'When you’re buying something and need to be understood',
    icon: 'ShoppingBasket',
    color: 'sun',
    phrases: [
      {
        ro: 'Cât costă?',
        en: 'How much does it cost?',
        literal: 'How much costs?',
        pron: 'KUHT COHS-tuh?',
        slow: 'Cât... costă?',
      },
      {
        ro: 'Pot plăti cu cardul?',
        en: 'Can I pay by card?',
        literal: 'I-can pay with card-the?',
        pron: 'POHT pluh-TEE koo KARD-loo?',
        slow: 'Pot plăti... cu cardul?',
      },
      {
        ro: 'Vreau asta, vă rog.',
        en: 'I’d like this, please.',
        literal: 'I-want this, you please.',
        pron: 'VROW AH-stuh, vuh ROHG.',
        slow: 'Vreau asta... vă rog.',
      },
      {
        ro: 'Aveți...? (pâine, lapte, apă)',
        en: 'Do you have...? (bread, milk, water)',
        literal: 'You-have...?',
        pron: 'Ah-VAYTS...? (puh-NEE, LAHP-teh, AH-puh)',
        slow: 'Aveți...?',
      },
    ],
  },
  {
    id: 'rl-neighbours',
    title: 'Speaking to neighbours',
    when: 'Short, friendly exchanges with people nearby',
    icon: 'DoorOpen',
    color: 'sea',
    phrases: [
      {
        ro: 'Bună ziua!',
        en: 'Hello! (good day)',
        literal: 'Good day!',
        pron: 'BOO-nuh ZEE-wuh!',
        slow: 'Bună... ziua!',
      },
      {
        ro: 'Totul e bine, mulțumesc.',
        en: 'Everything is fine, thank you.',
        literal: 'Everything is well, thanks.',
        pron: 'TOH-tool eh BEE-neh, mool-tsoo-MESK.',
        slow: 'Totul e bine... mulțumesc.',
      },
      {
        ro: 'Scuze, nu am timp acum.',
        en: 'Sorry, I don’t have time right now.',
        literal: 'Excuse, not I-have time now.',
        pron: 'SKOO-zeh, noo ahm TEEHM ah-COON.',
        slow: 'Scuze... nu am timp acum.',
      },
      {
        ro: 'Ne vedem mâine!',
        en: 'See you tomorrow!',
        literal: 'We see-us tomorrow!',
        pron: 'neh VEH-dem MUH-ee-neh!',
        slow: 'Ne vedem... mâine!',
      },
    ],
  },
  {
    id: 'rl-problem',
    title: 'Explaining a problem',
    when: 'When something is broken, wrong, or urgent',
    icon: 'Wrench',
    color: 'coral',
    phrases: [
      {
        ro: 'Am o problemă.',
        en: 'I have a problem.',
        literal: 'I-have a problem.',
        pron: 'Ahm oh proh-BLEH-muh.',
        slow: 'Am o problemă.',
      },
      {
        ro: 'Nu merge.',
        en: 'It doesn’t work.',
        literal: 'Not goes.',
        pron: 'NOO MER-geh.',
        slow: 'Nu merge.',
      },
      {
        ro: 'E urgent.',
        en: 'It’s urgent.',
        literal: 'Is urgent.',
        pron: 'Eh oor-ZHENT.',
        slow: 'E urgent.',
      },
      {
        ro: 'Apoița curge.',
        en: 'The tap is leaking.',
        literal: 'Tap-the leaks.',
        pron: 'ah-PEE-tzuh KOOR-zheh.',
        slow: 'Apoița curge.',
      },
    ],
  },
  {
    id: 'rl-today',
    title: 'Saying what I did today',
    when: 'Telling someone about your day in simple words',
    icon: 'Sun',
    color: 'sun',
    phrases: [
      {
        ro: 'Am fost la muncă.',
        en: 'I went to work.',
        literal: 'I-was at work.',
        pron: 'Ahm FOHST lah MOON-kuh.',
        slow: 'Am fost... la muncă.',
      },
      {
        ro: 'Am cumpărat de mâncare.',
        en: 'I bought food.',
        literal: 'I-bought of food.',
        pron: 'Ahm koom-puh-RAHT deh MUHN-kuh-reh.',
        slow: 'Am cumpărat... de mâncare.',
      },
      {
        ro: 'Am fost obosit azi.',
        en: 'I was tired today.',
        literal: 'I-was tired today.',
        pron: 'Ahm FOHST oh-bee-SEET ah-ZEE.',
        slow: 'Am fost obosit... azi.',
      },
      {
        ro: 'A fost o zi bună.',
        en: 'It was a good day.',
        literal: 'Was a day good.',
        pron: 'Ah FOHST oh ZEE BOO-nuh.',
        slow: 'A fost... o zi bună.',
      },
    ],
  },
];

extraRealLifeCategories.forEach((c) => realLifeCategories.push(c));

/* ------------------------------------------------------------------ */
/* Survival Romanian — the most useful phrases, first                  */
/* ------------------------------------------------------------------ */

export const survivalPhrases: SurvivalPhrase[] = [
  {
    ro: 'Nu vorbesc bine româna.',
    en: 'I don’t speak Romanian very well.',
    literal: 'Not I-speak well Romanian-the.',
    pron: 'NOO VOR-besk BEE-neh roh-MUH-nuh.',
    slow: 'Nu vorbesc bine... româna.',
    why: 'Say this first. It sets expectations and people instantly become more patient.',
  },
  {
    ro: 'Puteți repeta, vă rog?',
    en: 'Can you repeat, please?',
    literal: 'You-can repeat, you please?',
    pron: 'Poo-TETS reh-peh-TAH, vuh ROHG?',
    slow: 'Puteți repeta... vă rog?',
    why: 'You will use this every single day. Asking to hear it again is always okay.',
  },
  {
    ro: 'Vorbiți mai încet, vă rog.',
    en: 'Can you say it more slowly?',
    literal: 'You-speak more slowly, you please.',
    pron: 'VOR-beets MY uhn-CHET, vuh ROHG.',
    slow: 'Vorbiți mai încet... vă rog.',
    why: 'Romanian sounds fast when you’re learning. Slowing people down helps a lot.',
  },
  {
    ro: 'Înțeleg doar puțin.',
    en: 'I understand a little.',
    literal: 'I-understand only little.',
    pron: 'Uhn-tse-RLEHG DOAR poo-TEEN.',
    slow: 'Înțeleg... doar puțin.',
    why: 'Honest and friendly. It tells people you’re trying, without pressure.',
  },
  {
    ro: 'Nu înțeleg.',
    en: 'I don’t understand.',
    literal: 'Not I-understand.',
    pron: 'NOO uhn-tse-RLEHG.',
    slow: 'Nu... înțeleg.',
    why: 'Simple and clear. Better to say this than to nod and feel lost.',
  },
  {
    ro: 'Am nevoie de ajutor.',
    en: 'I need help.',
    literal: 'I-have need of help.',
    pron: 'Ahm neh-YO-eh deh ah-ZHOO-tor.',
    slow: 'Am nevoie... de ajutor.',
    why: 'Asking for help is brave. This one phrase solves many situations.',
  },
  {
    ro: 'Pot plăti cu cardul?',
    en: 'Can I pay by card?',
    literal: 'I-can pay with card-the?',
    pron: 'POHT pluh-TEE koo KARD-loo?',
    slow: 'Pot plăti... cu cardul?',
    why: 'Useful in almost every shop and café in Romania.',
  },
  {
    ro: 'Am o programare.',
    en: 'I have an appointment.',
    literal: 'I-have an appointment.',
    pron: 'Ahm oh proh-grah-MAH-reh.',
    slow: 'Am o programare.',
    why: 'Works at the doctor, vet, hairdresser, or anywhere you booked a time.',
  },
  {
    ro: 'Câinele meu e bolnav.',
    en: 'My dog is sick.',
    literal: 'Dog-the my is sick.',
    pron: 'KUH-ee-neh-leh MEH-oo eh bol-NAHV.',
    slow: 'Câinele meu... e bolnav.',
    why: 'If you have a pet in Romania, you’ll need this at the vet sooner or later.',
  },
  {
    ro: 'Pisica mea e bolnavă.',
    en: 'My cat is sick.',
    literal: 'Cat-the my is sick.',
    pron: 'PEE-shee-kuh MY-uh eh bol-NAH-vuh.',
    slow: 'Pisica mea... e bolnavă.',
    why: 'The cat version of the vet phrase. Same situation, different ending.',
  },
  {
    ro: 'Locuiesc în România, dar învăț încă româna.',
    en: 'I live in Romania, but I am still learning Romanian.',
    literal: 'I-live in Romania, but I-learn still Romanian-the.',
    pron: 'Lo-coo-YEHSK uhn roh-MUH-nee-uh, DAR uhn-VATS UHN-kuh roh-MUH-nuh.',
    slow: 'Locuiesc în România... dar învăț încă româna.',
    why: 'A warm, complete way to explain your situation. People love that you’re trying.',
  },
];

extraSurvivalPhrases.forEach((p) => survivalPhrases.push(p));

/* ------------------------------------------------------------------ */
/* No-Shame messages — encouraging, low-pressure                       */
/* ------------------------------------------------------------------ */

export const noShameMessages: NoShameMessage[] = [
  { id: 'ns-1', text: 'Understanding is progress.', icon: 'Ear' },
  { id: 'ns-2', text: 'You do not need perfect grammar to communicate.', icon: 'MessageCircle' },
  { id: 'ns-3', text: 'Practise the sentence, not the spelling.', icon: 'Mic' },
  { id: 'ns-4', text: 'Saying something simple is better than freezing.', icon: 'Sparkles' },
  { id: 'ns-5', text: 'Every time you try, your brain learns a little more.', icon: 'Brain' },
  { id: 'ns-6', text: 'It’s okay to not know. It’s okay to start again.', icon: 'RefreshCw' },
  { id: 'ns-7', text: 'You’re not behind. You’re practising.', icon: 'Tortoise' },
  { id: 'ns-8', text: 'Mistakes are just practice in disguise.', icon: 'Heart' },
];

/* ------------------------------------------------------------------ */
/* Tiny Practice — a 3-minute low-focus routine                        */
/* ------------------------------------------------------------------ */

const tinyListenPool: ListenChooseItem[] = [
  {
    id: 'tl-1',
    ro: 'Bună dimineața!',
    correct: 'Good morning!',
    options: ['Good morning!', 'Good night.', 'See you later.'],
    pron: 'BOO-nuh deem-yah-NAY-tuh!',
  },
  {
    id: 'tl-2',
    ro: 'Mulțumesc mult.',
    correct: 'Thank you very much.',
    options: ['You’re welcome.', 'Thank you very much.', 'Excuse me.'],
    pron: 'MOOL-tsoo-mesk MOOLT.',
  },
  {
    id: 'tl-3',
    ro: 'La revedere!',
    correct: 'Goodbye!',
    options: ['Hello!', 'Goodbye!', 'How are you?'],
    pron: 'Lah reh-veh-DEH-reh!',
  },
  {
    id: 'tl-4',
    ro: 'Da, vă rog.',
    correct: 'Yes, please.',
    options: ['No, thank you.', 'Yes, please.', 'Maybe later.'],
    pron: 'DAH, vuh ROHG.',
  },
];

const tinyRepeatPool: import('./types').PhraseLine[] = [
  { ro: 'Bună ziua!', en: 'Hello! / Good day!', pron: 'BOO-nuh ZEE-wuh!', slow: 'Bună... ziua!' },
  { ro: 'Mulțumesc.', en: 'Thank you.', pron: 'MOOL-tsoo-mesk.', slow: 'Mulțumesc.' },
  { ro: 'Vă rog.', en: 'Please.', pron: 'vuh ROHG.', slow: 'Vă rog.' },
  { ro: 'Scuze.', en: 'Excuse me / Sorry.', pron: 'SKOO-zeh.', slow: 'Scuze.' },
];

const tinyPhrasePool: import('./types').PhraseLine[] = [
  {
    ro: 'Nu înțeleg, dar vreau să învăț.',
    en: 'I don’t understand, but I want to learn.',
    literal: 'Not I-understand, but I-want to I-learn.',
    pron: 'NOO uhn-tse-RLEHG, DAR VROW suh uhn-VATS.',
    slow: 'Nu înțeleg... dar vreau să învăț.',
  },
  {
    ro: 'Vorbiți mai încet, vă rog.',
    en: 'Please speak more slowly.',
    pron: 'VOR-beets MY uhn-CHET, vuh ROHG.',
    slow: 'Vorbiți mai încet... vă rog.',
  },
  {
    ro: 'Reușesc puțin câte puțin.',
    en: 'I’m managing, little by little.',
    literal: 'I-succeed little by little.',
    pron: 'Reh-oo-SHESS poo-TEEN kuh-teh poo-TEEN.',
    slow: 'Reușesc puțin... câte puțin.',
  },
];

/** Deterministic tiny-practice content from a date string. */
export function getTinyPractice(dateStr: string): TinyPracticeContent {
  let seed = 0;
  for (let i = 0; i < dateStr.length; i++) seed = (seed * 31 + dateStr.charCodeAt(i)) % 100000;
  const rand = (n: number) => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed % n;
  };
  return {
    listen: tinyListenPool[rand(tinyListenPool.length)],
    repeat: tinyRepeatPool[rand(tinyRepeatPool.length)],
    phrase: tinyPhrasePool[rand(tinyPhrasePool.length)],
  };
}

/* ------------------------------------------------------------------ */
/* Mini Conversations — guided real-life exchanges                     */
/* ------------------------------------------------------------------ */

export const miniConversations: MiniConversation[] = [
  {
    id: 'mc-shop',
    title: 'At the Shop',
    situation: 'You walk into a small corner shop to buy bread and water.',
    icon: 'ShoppingBasket',
    color: 'sea',
    turns: [
      {
        who: 'you',
        ro: 'Bună ziua! Aveți pâine proaspătă?',
        en: 'Hello! Do you have fresh bread?',
        literal: 'Good day! You-have bread fresh?',
        pron: 'BOO-nuh ZEE-wuh! Ah-VAYTS puh-NE prohs-PET-uh?',
        slow: 'Bună ziua!... Aveți... pâine proaspătă?',
      },
      {
        who: 'them',
        ro: 'Da, am pâine caldă chiar acum. Cât doriți?',
        en: 'Yes, I have warm bread right now. How much do you want?',
        literal: 'Yes, I-have bread warm right now. How-much you-want?',
        pron: 'Dah, ahm puh-NE kahr-duh kyar ah-COON. KUHT doh-REETS?',
        slow: 'Da, am pâine caldă... Cât doriți?',
      },
      {
        who: 'you',
        ro: 'Vreau două pâini și o apă, vă rog.',
        en: "I'd like two loaves and a water, please.",
        literal: 'I-want two breads and a water, you please.',
        pron: 'VROW DOO-uh puh-NEE shee oh AH-puh, vuh ROHG.',
        slow: 'Vreau două pâini... și o apă, vă rog.',
      },
      {
        who: 'them',
        ro: 'Face opt lei. Altceva?',
        en: 'That’s eight lei. Anything else?',
        literal: 'It-makes eight lei. Something-else?',
        pron: 'FAH-cheh OHPT lay. AHLT-cheh-vuh?',
        slow: 'Face opt lei... Altceva?',
      },
      {
        who: 'you',
        ro: 'Atât. Pot plăti cu cardul?',
        en: "That's all. Can I pay by card?",
        literal: 'That-much. I-can pay with card-the?',
        pron: 'ah-TUHT. POHT pluh-TEE koo KARD-loo?',
        slow: 'Atât... Pot plăti cu cardul?',
      },
    ],
  },
  {
    id: 'mc-vet',
    title: 'At the Vet',
    situation: 'You take your sick cat to the vet and explain the problem.',
    icon: 'PawPrint',
    color: 'coral',
    turns: [
      {
        who: 'you',
        ro: 'Bună ziua. Pisica mea nu mănâncă bine.',
        en: 'Hello. My cat is not eating well.',
        literal: 'Good day. Cat my not eats well.',
        pron: 'BOO-nuh ZEE-wuh. PEE-shee-kuh MY-uh noo muhn-UHN-kuh BEE-neh.',
        slow: 'Bună ziua... Pisica mea nu mănâncă bine.',
      },
      {
        who: 'them',
        ro: 'De când are problema?',
        en: 'How long has she had the problem?',
        literal: 'Since when has the problem?',
        pron: 'De kahn ah-ray proh-BLEH-muh?',
        slow: 'De când... are problema?',
      },
      {
        who: 'you',
        ro: 'De două zile. Mă puteți ajuta?',
        en: 'For two days. Can you help me?',
        literal: 'Since two days. Me you-can help?',
        pron: 'De DOO-uh ZEE-leh. Muh poo-TETS ah-joo-TAH?',
        slow: 'De două zile... Mă puteți ajuta?',
      },
      {
        who: 'them',
        ro: 'Da. O să o examinez acum. Nu vă faceți griji.',
        en: 'Yes. I’ll examine her now. Don’t worry.',
        literal: 'Yes. Will her examine now. Not you worry.',
        pron: 'Dah. Oh suh oh eks-ah-mee-NEZ ah-COON. NOO vuh fah-TSETS GREE-zhee.',
        slow: 'Da. O să o examinez acum... Nu vă faceți griji.',
      },
    ],
  },
  {
    id: 'mc-neighbour',
    title: 'Speaking to a Neighbour',
    situation: 'You meet your neighbour in the stairwell and chat briefly.',
    icon: 'DoorOpen',
    color: 'sea',
    turns: [
      {
        who: 'you',
        ro: 'Bună ziua! Cum a fost weekendul?',
        en: 'Hello! How was the weekend?',
        literal: 'Good day! How was weekend-the?',
        pron: 'BOO-nuh ZEE-wuh! Koom ah FOHST veh-ken-DOOL?',
        slow: 'Bună ziua!... Cum a fost weekendul?',
      },
      {
        who: 'them',
        ro: 'A fost liniștit. Am stat acasă. Dar dumneavoastră?',
        en: 'It was quiet. I stayed home. And you?',
        literal: 'Was quiet. I-stayed at-home. But you?',
        pron: 'Ah FOHST lee-nish-TEET. Ahm STAHT ah-kuh-SAH. DAR doom-neh-ah-VWAH-struh?',
        slow: 'A fost liniștit... Dar dumneavoastră?',
      },
      {
        who: 'you',
        ro: 'Am mers la munte. A fost frumos.',
        en: 'I went to the mountains. It was beautiful.',
        literal: 'I-went to mountain. Was beautiful.',
        pron: 'Ahm MERZ lah MOON-teh. Ah FOHST froo-MOHS.',
        slow: 'Am mers la munte... A fost frumos.',
      },
      {
        who: 'them',
        ro: 'Sună grozav! O zi bună!',
        en: 'Sounds great! Have a good day!',
        literal: 'Sounds terrific! A day good!',
        pron: 'SOO-nuh groh-ZAHV! Oh ZEE BOO-nuh!',
        slow: 'Sună grozav!... O zi bună!',
      },
    ],
  },
  {
    id: 'mc-appointment',
    title: 'Making an Appointment',
    situation: 'You call a clinic to book a doctor’s appointment.',
    icon: 'CalendarClock',
    color: 'rose',
    turns: [
      {
        who: 'you',
        ro: 'Bună ziua. Aș vrea să fac o programare.',
        en: 'Hello. I’d like to make an appointment.',
        literal: 'Good day. I-would want to do an appointment.',
        pron: 'BOO-nuh ZEE-wuh. UHSH VRYAH suh FAHK oh proh-grah-MAH-reh.',
        slow: 'Bună ziua... Aș vrea să fac o programare.',
      },
      {
        who: 'them',
        ro: 'Când ar fi convenabil pentru dumneavoastră?',
        en: 'When would be convenient for you?',
        literal: 'When would be convenient for you?',
        pron: 'KUHN ahr fee con-veh-nah-BEEL pen-TRUE doom-neh-ah-VWAH-struh?',
        slow: 'Când ar fi convenabil...?',
      },
      {
        who: 'you',
        ro: 'Mâine dimineața, la ora nouă.',
        en: 'Tomorrow morning, at nine o’clock.',
        literal: 'Tomorrow morning, at the hour nine.',
        pron: 'MUH-ee-neh deem-yah-NAY-tuh, lah oh-ruh NOW.',
        slow: 'Mâine dimineața... la ora nouă.',
      },
      {
        who: 'them',
        ro: 'Gata. Vă așteptăm mâine la nouă. La revedere!',
        en: 'All set. We’ll expect you tomorrow at nine. Goodbye!',
        literal: 'Ready. You we-expect tomorrow at nine. At seeing-again!',
        pron: 'GAH-tuh. Vuh ush-teh-PUHM MUH-ee-neh lah NOW. Lah reh-veh-DEH-reh!',
        slow: 'Gata... Vă așteptăm mâine la nouă.',
      },
    ],
  },
  {
    id: 'mc-understand',
    title: 'Saying I Don’t Understand',
    situation: 'Someone is speaking to you quickly and you can’t follow.',
    icon: 'EarOff',
    color: 'sea',
    turns: [
      {
        who: 'them',
        ro: 'Trebuie să completați formularul acesta și să veniți mâine.',
        en: 'You need to fill in this form and come tomorrow.',
        literal: 'Must to you-fill form-the this and to you-come tomorrow.',
        pron: 'tray-BWEH suh com-pleh-TAHTS for-moo-lar-OOL ah-CHES-tuh shee suh veh-NEETS MUH-ee-neh.',
        slow: 'Trebuie să completați... și să veniți mâine.',
      },
      {
        who: 'you',
        ro: 'Scuze, nu înțeleg. Vorbiți mai încet, vă rog?',
        en: 'Sorry, I don’t understand. Can you speak more slowly, please?',
        literal: 'Excuse, not I-understand. You-speak more slowly, you please?',
        pron: 'SKOO-zeh, noo uhn-tse-RLEHG. VOR-beets MY uhn-CHET, vuh ROHG?',
        slow: 'Scuze, nu înțeleg... Vorbiți mai încet, vă rog?',
      },
      {
        who: 'them',
        ro: 'Sigur. Completați formularul. Apoi veniți mâine.',
        en: 'Sure. Fill in the form. Then come tomorrow.',
        literal: 'Sure. You-fill form-the. Then you-come tomorrow.',
        pron: 'SEE-gur. Com-pleh-TAHTS for-moo-lar-OOL. Ah-POY veh-NEETS MUH-ee-neh.',
        slow: 'Sigur. Completați formularul... Apoi veniți mâine.',
      },
      {
        who: 'you',
        ro: 'Mulțumesc. Acum înțeleg.',
        en: 'Thank you. Now I understand.',
        literal: 'Thanks. Now I-understand.',
        pron: 'MOOL-tsoo-mesk. ah-COON uhn-tse-RLEHG.',
        slow: 'Mulțumesc... Acum înțeleg.',
      },
    ],
  },
  {
    id: 'mc-coffee',
    title: 'Ordering Coffee',
    situation: 'You order a coffee and a water at a café.',
    icon: 'Coffee',
    color: 'coral',
    turns: [
      {
        who: 'them',
        ro: 'Bună! Cu ce vă pot ajuta?',
        en: 'Hello! What can I help you with?',
        literal: 'Hello! With what you I-can help?',
        pron: 'BOO-nuh! Koo cheh vuh POHT ah-joo-TAH?',
        slow: 'Bună!... Cu ce vă pot ajuta?',
      },
      {
        who: 'you',
        ro: 'O cafea latte și o apă plată, vă rog.',
        en: 'A latte and a still water, please.',
        literal: 'A coffee latte and a water flat, you please.',
        pron: 'Oh kah-FEH LAHT-teh shee oh AH-puh PLAH-tuh, vuh ROHG.',
        slow: 'O cafea latte... și o apă plată, vă rog.',
      },
      {
        who: 'them',
        ro: 'Cu zahăr sau fără?',
        en: 'With sugar or without?',
        literal: 'With sugar or without?',
        pron: 'Koo zah-HAHR sow FLAH-ruh?',
        slow: 'Cu zahăr... sau fără?',
      },
      {
        who: 'you',
        ro: 'Fără zahăr. Cât costă?',
        en: 'No sugar. How much is it?',
        literal: 'Without sugar. How-much costs?',
        pron: 'FLAH-ruh zah-HAHR. KUHT COHS-tuh?',
        slow: 'Fără zahăr... Cât costă?',
      },
    ],
  },
  {
    id: 'mc-tired',
    title: 'Explaining I Am Tired or Busy',
    situation: 'A friend calls and you explain you can’t talk right now.',
    icon: 'BatteryLow',
    color: 'sun',
    turns: [
      {
        who: 'them',
        ro: 'Bună! Ai timp să vorbim puțin?',
        en: 'Hi! Do you have time to talk a bit?',
        literal: 'Hello! You-have time to we-talk little?',
        pron: 'BOO-nuh! AY TEEHM suh VOR-beem poo-TEEN?',
        slow: 'Bună!... Ai timp să vorbim puțin?',
      },
      {
        who: 'you',
        ro: 'Scuze, sunt foarte obosit azi. Nu am timp acum.',
        en: 'Sorry, I’m very tired today. I don’t have time right now.',
        literal: 'Excuse, am very tired today. Not I-have time now.',
        pron: 'SKOO-zeh, SOONT fah-OR-teh oh-bee-SEET ah-ZEE. NOO ahm TEEHM ah-COON.',
        slow: 'Scuze, sunt foarte obosit... Nu am timp acum.',
      },
      {
        who: 'them',
        ro: 'Nu-i problemă. Te sun mai târziu?',
        en: 'No problem. Shall I call you later?',
        literal: 'Not-is problem. You I-call more late?',
        pron: 'NOO-ee proh-BLEH-muh. Teh SOON my tuhr-ZEE-oo?',
        slow: 'Nu-i problemă... Te sun mai târziu?',
      },
      {
        who: 'you',
        ro: 'Da, te rog. Sună-mă la ora șase.',
        en: 'Yes, please. Call me at six o’clock.',
        literal: 'Yes, you please. Call-me at the hour six.',
        pron: 'Dah, teh ROHG. SOO-nuh-muh lah oh-ruh SHASS-eh.',
        slow: 'Da, te rog... Sună-mă la ora șase.',
      },
    ],
  },
  {
    id: 'mc-today',
    title: 'Saying What I Did Today',
    situation: 'You tell a friend about your day over dinner.',
    icon: 'Sun',
    color: 'sun',
    turns: [
      {
        who: 'them',
        ro: 'Cum a fost ziua ta azi?',
        en: 'How was your day today?',
        literal: 'How was day-your today?',
        pron: 'Koom ah FOHST ZEE-yuh TAH ah-ZEE?',
        slow: 'Cum a fost ziua ta... azi?',
      },
      {
        who: 'you',
        ro: 'A fost o zi lungă. Am fost la muncă toată ziua.',
        en: 'It was a long day. I was at work all day.',
        literal: 'Was a day long. I-was at work all day-the.',
        pron: 'Ah FOHST oh ZEE LOON-guh. Ahm FOHST lah MOON-kuh TWAH-tuh ZEE-yuh.',
        slow: 'A fost o zi lungă... Am fost la muncă toată ziua.',
      },
      {
        who: 'them',
        ro: 'Ai fost foarte ocupat. Ai mâncat ceva?',
        en: 'You were very busy. Did you eat something?',
        literal: 'You-were very busy. You-ate something?',
        pron: 'AY FOHST fah-OR-teh oh-KOO-paht. AY MUHN-kaht CHEH-vuh?',
        slow: 'Ai fost foarte ocupat... Ai mâncat ceva?',
      },
      {
        who: 'you',
        ro: 'Da, am gătit o supă. A fost bună. Acum mă odihnesc.',
        en: 'Yes, I cooked a soup. It was good. Now I’m resting.',
        literal: 'Yes, I-cooked a soup. Was good. Now me I-rest.',
        pron: 'Dah, ahm guh-TEET oh SOO-puh. Ah FOHST BOO-nuh. ah-COON muh oh-DEES-nesk.',
        slow: 'Da, am gătit o supă... Acum mă odihnesc.',
      },
    ],
  },
];

extraMiniConversations.forEach((c) => miniConversations.push(c));
