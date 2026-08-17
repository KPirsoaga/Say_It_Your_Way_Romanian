import type { GrammarExample, GrammarTense, GrammarVerb, VerbForm } from '../../types';

type TenseSupplement = {
  perfectCompus?: VerbForm[];
  imperfect?: VerbForm[];
  future?: VerbForm[];
  examplesByTense?: Partial<Record<GrammarTense, GrammarExample[]>>;
};

function forms(
  rows: [string, string, string][],
  labels: readonly string[] = ['eu', 'tu', 'el/ea', 'noi', 'voi', 'ei/ele']
): VerbForm[] {
  return rows.map(([ro, en, pron], i) => ({
    label: labels[i] ?? `row-${i}`,
    ro,
    en,
    pron,
  }));
}

/** Extra tense tables and per-tense examples — merged onto base verbs */
export const verbTenseSupplement: Record<string, TenseSupplement> = {
  'vb-fi': {
    perfectCompus: forms([
      ['am fost', 'I was / I have been', 'ahm FOHST'],
      ['ai fost', 'you were / you have been', 'ay FOHST'],
      ['a fost', 'he/she was / has been', 'ah FOHST'],
      ['am fost', 'we were / we have been', 'ahm FOHST'],
      ['ați fost', 'you (pl.) were', 'uh-ts FOHST'],
      ['au fost', 'they were / have been', 'ow FOHST'],
    ]),
    imperfect: forms([
      ['eram', 'I was (ongoing)', 'eh-RAHM'],
      ['erai', 'you were (ongoing)', 'eh-RY'],
      ['era', 'he/she was (ongoing)', 'YEH-rah'],
      ['eram', 'we were (ongoing)', 'eh-RAHM'],
      ['erați', 'you (pl.) were', 'eh-ruh-TS'],
      ['erau', 'they were (ongoing)', 'eh-ROW'],
    ]),
    future: forms([
      ['o să fiu', 'I will be', 'oh suh FYOO'],
      ['o să fii', 'you will be', 'oh suh FEE'],
      ['o să fie', 'he/she will be', 'oh suh FYEH'],
      ['o să fim', 'we will be', 'oh suh FEEM'],
      ['o să fiți', 'you (pl.) will be', 'oh suh FEETS'],
      ['o să fie', 'they will be', 'oh suh FYEH'],
    ]),
    examplesByTense: {
      'perfect-compus': [
        { ro: 'Am fost la lecție.', en: 'I was at the lesson.', pron: 'Ahm FOHST lah lek-TSY-eh.', slow: 'Am fost... la lecție.' },
        { ro: 'A fost frumos.', en: 'It was beautiful.', pron: 'Ah FOHST froo-MOHS.', slow: 'A fost frumos.' },
      ],
      imperfect: [
        { ro: 'Eram obosit.', en: 'I was tired (then).', pron: 'eh-RAHM oh-bee-SEET.', slow: 'Eram obosit.' },
        { ro: 'Era cald.', en: 'It was warm.', pron: 'YEH-rah KAHLD.', slow: 'Era cald.' },
      ],
      future: [
        { ro: 'O să fiu acasă.', en: 'I will be at home.', pron: 'Oh suh FYOO ah-kuh-SAH.', slow: 'O să fiu... acasă.' },
        { ro: 'O să fie bine.', en: 'It will be fine.', pron: 'Oh suh FYEH BEE-neh.', slow: 'O să fie bine.' },
      ],
    },
  },
  'vb-avea': {
    perfectCompus: forms([
      ['am avut', 'I had', 'ahm ah-VOOT'],
      ['ai avut', 'you had', 'ay ah-VOOT'],
      ['a avut', 'he/she had', 'ah ah-VOOT'],
      ['am avut', 'we had', 'ahm ah-VOOT'],
      ['ați avut', 'you (pl.) had', 'uh-ts ah-VOOT'],
      ['au avut', 'they had', 'ow ah-VOOT'],
    ]),
    future: forms([
      ['o să am', 'I will have', 'oh suh AHM'],
      ['o să ai', 'you will have', 'oh suh AY'],
      ['o să aibă', 'he/she will have', 'oh suh AY-buh'],
      ['o să avem', 'we will have', 'oh suh AH-vem'],
      ['o să aveți', 'you (pl.) will have', 'oh suh ah-VAYTS'],
      ['o să aibă', 'they will have', 'oh suh AY-buh'],
    ]),
    examplesByTense: {
      'perfect-compus': [
        { ro: 'Am avut o zi bună.', en: 'I had a good day.', pron: 'Ahm ah-VOOT oh ZEE BOO-nuh.', slow: 'Am avut... o zi bună.' },
      ],
      imperfect: [
        { ro: 'Aveam o cabană mică.', en: 'I used to have a small cabin.', pron: 'ah-VAY-ahm oh kah-BAH-nuh MEE-kuh.', slow: 'Aveam... o cabană mică.' },
      ],
      future: [
        { ro: 'O să am timp mâine.', en: 'I will have time tomorrow.', pron: 'Oh suh AHM TEEHM MUH-ee-neh.', slow: 'O să am timp... mâine.' },
      ],
    },
  },
  'vb-vrea': {
    perfectCompus: forms([
      ['am vrut', 'I wanted', 'ahm VROOT'],
      ['ai vrut', 'you wanted', 'ay VROOT'],
      ['a vrut', 'he/she wanted', 'ah VROOT'],
      ['am vrut', 'we wanted', 'ahm VROOT'],
      ['ați vrut', 'you (pl.) wanted', 'uh-ts VROOT'],
      ['au vrut', 'they wanted', 'ow VROOT'],
    ]),
    imperfect: forms([
      ['vream', 'I wanted (often)', 'VRY-ahm'],
      ['vreai', 'you wanted (often)', 'VRY-ay'],
      ['vrea', 'he/she wanted (often)', 'VRYAH'],
      ['vream', 'we wanted (often)', 'VRY-ahm'],
      ['vreați', 'you (pl.) wanted', 'vruh-YAHTS'],
      ['vreau', 'they wanted (often)', 'VRY-ow'],
    ]),
    future: forms([
      ['o să vreau', 'I will want', 'oh suh VROW'],
      ['o să vrei', 'you will want', 'oh suh VRY'],
      ['o să vrea', 'he/she will want', 'oh suh VRYAH'],
      ['o să vrem', 'we will want', 'oh suh VREM'],
      ['o să vreți', 'you (pl.) will want', 'oh suh VRETS'],
      ['o să vrea', 'they will want', 'oh suh VRYAH'],
    ]),
    examplesByTense: {
      future: [
        { ro: 'O să vreau o cafea.', en: 'I will want a coffee.', pron: 'Oh suh VROW oh kah-FEH.', slow: 'O să vreau... o cafea.' },
      ],
    },
  },
  'vb-putea': {
    perfectCompus: forms([
      ['am putut', 'I could / was able', 'ahm poo-TOOT'],
      ['ai putut', 'you could', 'ay poo-TOOT'],
      ['a putut', 'he/she could', 'ah poo-TOOT'],
      ['am putut', 'we could', 'ahm poo-TOOT'],
      ['ați putut', 'you (pl.) could', 'uh-ts poo-TOOT'],
      ['au putut', 'they could', 'ow poo-TOOT'],
    ]),
    imperfect: forms([
      ['puteam', 'I could (often)', 'poo-TY-ahm'],
      ['puteai', 'you could (often)', 'poo-TY-ay'],
      ['putea', 'he/she could (often)', 'poo-TY-ah'],
      ['puteam', 'we could (often)', 'poo-TY-ahm'],
      ['puteați', 'you (pl.) could', 'poo-teh-YAHTS'],
      ['puteau', 'they could (often)', 'poo-TOW'],
    ]),
    future: forms([
      ['o să pot', 'I will be able', 'oh suh POT'],
      ['o să poți', 'you will be able', 'oh suh POTS'],
      ['o să poată', 'he/she will be able', 'oh suh PWAH-tuh'],
      ['o să putem', 'we will be able', 'oh suh POO-tem'],
      ['o să puteți', 'you (pl.) will be able', 'oh suh poo-TETS'],
      ['o să poată', 'they will be able', 'oh suh PWAH-tuh'],
    ]),
  },
  'vb-merge': {
    perfectCompus: forms([
      ['am mers', 'I went', 'ahm MERS'],
      ['ai mers', 'you went', 'ay MERS'],
      ['a mers', 'he/she went', 'ah MERS'],
      ['am mers', 'we went', 'ahm MERS'],
      ['ați mers', 'you (pl.) went', 'uh-ts MERS'],
      ['au mers', 'they went', 'ow MERS'],
    ]),
    imperfect: forms([
      ['mergeam', 'I was going / used to go', 'MER-jeh-ahm'],
      ['mergeai', 'you were going', 'MER-jeh-ay'],
      ['mergea', 'he/she was going', 'MER-jeh-ah'],
      ['mergeam', 'we were going', 'MER-jeh-ahm'],
      ['mergeați', 'you (pl.) were going', 'MER-jeh-YAHTS'],
      ['mergeau', 'they were going', 'MER-jeh-ow'],
    ]),
    future: forms([
      ['o să merg', 'I will go', 'oh suh MERG'],
      ['o să mergi', 'you will go', 'oh suh MER-zhee'],
      ['o să meargă', 'he/she will go', 'oh suh MYAHR-guh'],
      ['o să mergem', 'we will go', 'oh suh MER-jem'],
      ['o să mergeți', 'you (pl.) will go', 'oh suh MER-jets'],
      ['o să meargă', 'they will go', 'oh suh MYAHR-guh'],
    ]),
    examplesByTense: {
      'perfect-compus': [
        { ro: 'Am mers la farmacie.', en: 'I went to the pharmacy.', pron: 'Ahm MERS lah far-mah-TSY-eh.', slow: 'Am mers... la farmacie.' },
      ],
      imperfect: [
        { ro: 'Mergeam la lecție în fiecare săptămână.', en: 'I used to go to the lesson every week.', pron: 'MER-jeh-ahm lah lek-TSY-eh uhn FYEH-ah-reh suhp-tuh-MEE-nuh.', slow: 'Mergeam... la lecție.' },
      ],
      future: [
        { ro: 'O să merg la lecție.', en: 'I will go to the lesson.', pron: 'Oh suh MERG lah lek-TSY-eh.', slow: 'O să merg... la lecție.' },
      ],
    },
  },
  'vb-face': {
    perfectCompus: forms([
      ['am făcut', 'I did / made', 'ahm fuh-KOOT'],
      ['ai făcut', 'you did', 'ay fuh-KOOT'],
      ['a făcut', 'he/she did', 'ah fuh-KOOT'],
      ['am făcut', 'we did', 'ahm fuh-KOOT'],
      ['ați făcut', 'you (pl.) did', 'uh-ts fuh-KOOT'],
      ['au făcut', 'they did', 'ow fuh-KOOT'],
    ]),
    imperfect: forms([
      ['făceam', 'I was doing', 'fuh-cheh-AHM'],
      ['făceai', 'you were doing', 'fuh-cheh-AY'],
      ['făcea', 'he/she was doing', 'fuh-CHEH-ah'],
      ['făceam', 'we were doing', 'fuh-cheh-AHM'],
      ['făceați', 'you (pl.) were doing', 'fuh-cheh-YAHTS'],
      ['făceau', 'they were doing', 'fuh-CHEH-ow'],
    ]),
    future: forms([
      ['o să fac', 'I will do', 'oh suh FAHK'],
      ['o să faci', 'you will do', 'oh suh FAHTS'],
      ['o să facă', 'he/she will do', 'oh suh FAH-kuh'],
      ['o să facem', 'we will do', 'oh suh FAH-chem'],
      ['o să faceți', 'you (pl.) will do', 'oh suh fah-CHETS'],
      ['o să facă', 'they will do', 'oh suh FAH-kuh'],
    ]),
  },
  'vb-spune': {
    perfectCompus: forms([
      ['am spus', 'I said', 'ahm SPOOS'],
      ['ai spus', 'you said', 'ay SPOOS'],
      ['a spus', 'he/she said', 'ah SPOOS'],
      ['am spus', 'we said', 'ahm SPOOS'],
      ['ați spus', 'you (pl.) said', 'uh-ts SPOOS'],
      ['au spus', 'they said', 'ow SPOOS'],
    ]),
    imperfect: forms([
      ['spuneam', 'I was saying', 'spoo-NY-ahm'],
      ['spuneai', 'you were saying', 'spoo-NY-ay'],
      ['spunea', 'he/she was saying', 'spoo-NY-ah'],
      ['spuneam', 'we were saying', 'spoo-NY-ahm'],
      ['spuneați', 'you (pl.) were saying', 'spoo-neh-YAHTS'],
      ['spuneau', 'they were saying', 'spoo-NY-ow'],
    ]),
    future: forms([
      ['o să spun', 'I will say', 'oh suh SPOON'],
      ['o să spui', 'you will say', 'oh suh SPWEE'],
      ['o să spună', 'he/she will say', 'oh suh SPOO-nuh'],
      ['o să spunem', 'we will say', 'oh suh SPOO-nem'],
      ['o să spuneți', 'you (pl.) will say', 'oh suh spoo-NETS'],
      ['o să spună', 'they will say', 'oh suh SPOO-nuh'],
    ]),
  },
  'vb-intelege': {
    perfectCompus: forms([
      ['am înțeles', 'I understood', 'ahm uhn-tse-LESS'],
      ['ai înțeles', 'you understood', 'ay uhn-tse-LESS'],
      ['a înțeles', 'he/she understood', 'ah uhn-tse-LESS'],
      ['am înțeles', 'we understood', 'ahm uhn-tse-LESS'],
      ['ați înțeles', 'you (pl.) understood', 'uh-ts uhn-tse-LESS'],
      ['au înțeles', 'they understood', 'ow uhn-tse-LESS'],
    ]),
    imperfect: forms([
      ['înțelegeam', 'I was understanding', 'uhn-tse-leh-JY-ahm'],
      ['înțelegeai', 'you were understanding', 'uhn-tse-leh-JY-ay'],
      ['înțelegea', 'he/she was understanding', 'uhn-tse-leh-JY-ah'],
      ['înțelegeam', 'we were understanding', 'uhn-tse-leh-JY-ahm'],
      ['înțelegeați', 'you (pl.) were understanding', 'uhn-tse-leh-JY-ahm'],
      ['înțelegeau', 'they were understanding', 'uhn-tse-leh-JY-ow'],
    ]),
    future: forms([
      ['o să înțeleg', 'I will understand', 'oh suh uhn-tse-RLEHG'],
      ['o să înțelegi', 'you will understand', 'oh suh uhn-tse-LEH-zhee'],
      ['o să înțeleagă', 'he/she will understand', 'oh suh uhn-tse-leh-AH-guh'],
      ['o să înțelegem', 'we will understand', 'oh suh uhn-tse-LEH-jem'],
      ['o să înțelegeți', 'you (pl.) will understand', 'oh suh uhn-tse-LEH-jets'],
      ['o să înțeleagă', 'they will understand', 'oh suh uhn-tse-leh-AH-guh'],
    ]),
  },
  'vb-vorbi': {
    perfectCompus: forms([
      ['am vorbit', 'I spoke', 'ahm VOR-beet'],
      ['ai vorbit', 'you spoke', 'ay VOR-beet'],
      ['a vorbit', 'he/she spoke', 'ah VOR-beet'],
      ['am vorbit', 'we spoke', 'ahm VOR-beet'],
      ['ați vorbit', 'you (pl.) spoke', 'uh-ts VOR-beet'],
      ['au vorbit', 'they spoke', 'ow VOR-beet'],
    ]),
    imperfect: forms([
      ['vorbeam', 'I was speaking', 'VOR-by-ahm'],
      ['vorbeai', 'you were speaking', 'VOR-by-ay'],
      ['vorbea', 'he/she was speaking', 'VOR-by-ah'],
      ['vorbeam', 'we were speaking', 'VOR-by-ahm'],
      ['vorbeați', 'you (pl.) were speaking', 'VOR-by-ahm'],
      ['vorbeau', 'they were speaking', 'VOR-by-ow'],
    ]),
    future: forms([
      ['o să vorbesc', 'I will speak', 'oh suh VOR-besk'],
      ['o să vorbești', 'you will speak', 'oh suh VOR-besht'],
      ['o să vorbească', 'he/she will speak', 'oh suh VOR-byahs-kuh'],
      ['o să vorbim', 'we will speak', 'oh suh VOR-beem'],
      ['o să vorbiți', 'you (pl.) will speak', 'oh suh VOR-beets'],
      ['o să vorbească', 'they will speak', 'oh suh VOR-byahs-kuh'],
    ]),
  },
  'vb-pleca': {
    perfectCompus: forms([
      ['am plecat', 'I left', 'ahm pleh-KAHT'],
      ['ai plecat', 'you left', 'ay pleh-KAHT'],
      ['a plecat', 'he/she left', 'ah pleh-KAHT'],
      ['am plecat', 'we left', 'ahm pleh-KAHT'],
      ['ați plecat', 'you (pl.) left', 'uh-ts pleh-KAHT'],
      ['au plecat', 'they left', 'ow pleh-KAHT'],
    ]),
    imperfect: forms([
      ['plecam', 'I was leaving', 'PLEH-kahm'],
      ['plecai', 'you were leaving', 'PLEH-kay'],
      ['pleca', 'he/she was leaving', 'PLEH-kah'],
      ['plecam', 'we were leaving', 'PLEH-kahm'],
      ['plecați', 'you (pl.) were leaving', 'pleh-KAHTS'],
      ['plecau', 'they were leaving', 'PLEH-kow'],
    ]),
    future: forms([
      ['o să plec', 'I will leave', 'oh suh PLEHK'],
      ['o să pleci', 'you will leave', 'oh suh PLEHTS'],
      ['o să plece', 'he/she will leave', 'oh suh PLEH-cheh'],
      ['o să plecăm', 'we will leave', 'oh suh pleh-KUHM'],
      ['o să plecați', 'you (pl.) will leave', 'oh suh pleh-KAHTS'],
      ['o să plece', 'they will leave', 'oh suh PLEH-cheh'],
    ]),
  },
  'vb-intreba': {
    imperfect: forms([
      ['întrebam', 'I was asking', 'uhn-treh-BAHM'],
      ['întrebai', 'you were asking', 'uhn-treh-BAY'],
      ['întreba', 'he/she was asking', 'uhn-TREH-bah'],
      ['întrebam', 'we were asking', 'uhn-treh-BAHM'],
      ['întrebați', 'you (pl.) were asking', 'uhn-treh-BAHTS'],
      ['întrebau', 'they were asking', 'uhn-treh-BOW'],
    ]),
    perfectCompus: forms([
      ['am întrebat', 'I asked', 'ahm uhn-treh-BAHT'],
      ['ai întrebat', 'you asked', 'ay uhn-treh-BAHT'],
      ['a întrebat', 'he/she asked', 'ah uhn-treh-BAHT'],
      ['am întrebat', 'we asked', 'ahm uhn-treh-BAHT'],
      ['ați întrebat', 'you (pl.) asked', 'uh-ts uhn-treh-BAHT'],
      ['au întrebat', 'they asked', 'ow uhn-treh-BAHT'],
    ]),
    future: forms([
      ['o să întreb', 'I will ask', 'oh suh uhn-TREHB'],
      ['o să întrebi', 'you will ask', 'oh suh uhn-TREH-bee'],
      ['o să întrebe', 'he/she will ask', 'oh suh uhn-TREH-beh'],
      ['o să întrebăm', 'we will ask', 'oh suh uhn-treh-BUHM'],
      ['o să întrebați', 'you (pl.) will ask', 'oh suh uhn-treh-BAHTS'],
      ['o să întrebe', 'they will ask', 'oh suh uhn-TREH-beh'],
    ]),
  },
  'vb-manca': {
    imperfect: forms([
      ['mâncam', 'I was eating', 'muhn-KAHM'],
      ['mâncai', 'you were eating', 'muhn-KAY'],
      ['mânca', 'he/she was eating', 'muhn-KAH'],
      ['mâncam', 'we were eating', 'muhn-KAHM'],
      ['mâncați', 'you (pl.) were eating', 'muhn-KAHTS'],
      ['mâncau', 'they were eating', 'muhn-KOW'],
    ]),
    perfectCompus: forms([
      ['am mâncat', 'I ate', 'ahm muhn-KAHT'],
      ['ai mâncat', 'you ate', 'ay muhn-KAHT'],
      ['a mâncat', 'he/she ate', 'ah muhn-KAHT'],
      ['am mâncat', 'we ate', 'ahm muhn-KAHT'],
      ['ați mâncat', 'you (pl.) ate', 'uh-ts muhn-KAHT'],
      ['au mâncat', 'they ate', 'ow muhn-KAHT'],
    ]),
    future: forms([
      ['o să mănânc', 'I will eat', 'oh suh muhn-UHNK'],
      ['o să mănânci', 'you will eat', 'oh suh muhn-UHN-chee'],
      ['o să mănânce', 'he/she will eat', 'oh suh muhn-UHN-cheh'],
      ['o să mâncăm', 'we will eat', 'oh suh muhn-KUHM'],
      ['o să mâncați', 'you (pl.) will eat', 'oh suh muhn-KAHTS'],
      ['o să mănânce', 'they will eat', 'oh suh muhn-UHN-cheh'],
    ]),
  },
  'vb-bea': {
    imperfect: forms([
      ['beam', 'I was drinking', 'BY-ahm'],
      ['beai', 'you were drinking', 'BY-ay'],
      ['bea', 'he/she was drinking', 'BY-ah'],
      ['beam', 'we were drinking', 'BY-ahm'],
      ['beați', 'you (pl.) were drinking', 'BY-ah-ts'],
      ['beau', 'they were drinking', 'BY-ow'],
    ]),
    perfectCompus: forms([
      ['am băut', 'I drank', 'ahm buh-OOT'],
      ['ai băut', 'you drank', 'ay buh-OOT'],
      ['a băut', 'he/she drank', 'ah buh-OOT'],
      ['am băut', 'we drank', 'ahm buh-OOT'],
      ['ați băut', 'you (pl.) drank', 'uh-ts buh-OOT'],
      ['au băut', 'they drank', 'ow buh-OOT'],
    ]),
    future: forms([
      ['o să beau', 'I will drink', 'oh suh BEH-ow'],
      ['o să bei', 'you will drink', 'oh suh BAY'],
      ['o să bea', 'he/she will drink', 'oh suh BEH-ah'],
      ['o să bem', 'we will drink', 'oh suh BEHM'],
      ['o să beți', 'you (pl.) will drink', 'oh suh BETS'],
      ['o să bea', 'they will drink', 'oh suh BEH-ah'],
    ]),
  },
  'vb-nevoie': {
    imperfect: forms([
      ['aveam nevoie de', 'I needed', 'ah-VAY-ahm neh-YO-eh deh'],
      ['aveai nevoie de', 'you needed', 'ah-VAY-ay neh-YO-eh deh'],
      ['avea nevoie de', 'he/she needed', 'ah-VAY-ah neh-YO-eh deh'],
      ['aveam nevoie de', 'we needed', 'ah-VAY-ahm neh-YO-eh deh'],
      ['aveați nevoie de', 'you (pl.) needed', 'ah-vuh-YAHTS neh-YO-eh deh'],
      ['aveau nevoie de', 'they needed', 'ah-VOW neh-YO-eh deh'],
    ]),
    perfectCompus: forms([
      ['am avut nevoie de', 'I needed', 'ahm ah-VOOT neh-YO-eh deh'],
      ['ai avut nevoie de', 'you needed', 'ay ah-VOOT neh-YO-eh deh'],
      ['a avut nevoie de', 'he/she needed', 'ah ah-VOOT neh-YO-eh deh'],
      ['am avut nevoie de', 'we needed', 'ahm ah-VOOT neh-YO-eh deh'],
      ['ați avut nevoie de', 'you (pl.) needed', 'uh-ts ah-VOOT neh-YO-eh deh'],
      ['au avut nevoie de', 'they needed', 'ow ah-VOOT neh-YO-eh deh'],
    ]),
    future: forms([
      ['o să am nevoie de', 'I will need', 'oh suh AHM neh-YO-eh deh'],
      ['o să ai nevoie de', 'you will need', 'oh suh AY neh-YO-eh deh'],
      ['o să aibă nevoie de', 'he/she will need', 'oh suh AY-buh neh-YO-eh deh'],
      ['o să avem nevoie de', 'we will need', 'oh suh AH-vem neh-YO-eh deh'],
      ['o să aveți nevoie de', 'you (pl.) will need', 'oh suh ah-VAYTS neh-YO-eh deh'],
      ['o să aibă nevoie de', 'they will need', 'oh suh AY-buh neh-YO-eh deh'],
    ]),
  },
};

export function mergeVerbTenses(verbs: GrammarVerb[]): GrammarVerb[] {
  return verbs.map((verb) => {
    const extra = verbTenseSupplement[verb.id];
    if (!extra) return verb;
    return {
      ...verb,
      perfectCompus: extra.perfectCompus ?? verb.perfectCompus,
      imperfect: extra.imperfect ?? verb.imperfect,
      future: extra.future ?? verb.future,
      examplesByTense: {
        present: extra.examplesByTense?.present ?? verb.examples,
        ...extra.examplesByTense,
      },
    };
  });
}

export function getVerbFormsForTense(verb: GrammarVerb, tense: GrammarTense): VerbForm[] | undefined {
  switch (tense) {
    case 'present':
      return verb.present;
    case 'perfect-compus':
      return verb.perfectCompus;
    case 'imperfect':
      return verb.imperfect;
    case 'future':
      return verb.future;
  }
}

export function getVerbExamplesForTense(verb: GrammarVerb, tense: GrammarTense): GrammarExample[] {
  const fromTense = verb.examplesByTense?.[tense];
  if (fromTense && fromTense.length > 0) return fromTense;
  if (tense === 'present') return verb.examples;
  return verb.examples.slice(0, 3);
}

export function getAvailableTenses(verb: GrammarVerb): GrammarTense[] {
  const tenses: GrammarTense[] = ['present'];
  if (verb.perfectCompus?.length) tenses.push('perfect-compus');
  if (verb.imperfect?.length) tenses.push('imperfect');
  if (verb.future?.length) tenses.push('future');
  return tenses;
}
