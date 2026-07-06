import type { PhraseLine } from '../../types';
import { buildingCabinTopic } from './buildingCabin';

/** Deterministic pick from this week's lesson vocabulary — stable per day */
export function getWeeklyLessonPhrase(dateStr: string): PhraseLine {
  const pool: PhraseLine[] = buildingCabinTopic.vocabulary
    .filter((v) => v.category === 'phrase')
    .map((v) => ({ ro: v.ro, en: v.en, pron: v.pron }));

  for (const reading of buildingCabinTopic.readings) {
    const first = reading.ro.split(/(?<=[.!?])\s+/)[0]?.trim();
    if (first) {
      pool.push({ ro: first, en: reading.modelEn.split('.')[0]?.trim() + '.' });
    }
  }

  let seed = 0;
  for (let i = 0; i < dateStr.length; i++) seed = (seed * 31 + dateStr.charCodeAt(i)) % 100000;
  seed = (seed * 1103515245 + 12345) % 2147483648;
  const idx = seed % pool.length;
  return pool[idx] ?? { ro: 'Lucrez la cabană.', en: 'I am working on the cabin.' };
}
