import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

/** Translation notes keyed by `${topicId}:${readingId}` */
export function useWeeklyTranslationNotes() {
  const [notes, setNotes] = useLocalStorage<Record<string, string>>('rcd-weekly-translation-notes', {});

  const getNote = useCallback((topicId: string, readingId: string) => notes[`${topicId}:${readingId}`] ?? '', [notes]);

  const setNote = useCallback(
    (topicId: string, readingId: string, text: string) => {
      const key = `${topicId}:${readingId}`;
      setNotes((prev) => ({ ...prev, [key]: text }));
    },
    [setNotes]
  );

  return { getNote, setNote };
}
