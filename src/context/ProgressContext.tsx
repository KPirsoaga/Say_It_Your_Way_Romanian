import { createContext, useContext, useCallback, type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { ProgressState, ScenarioId, WeeklyTopicProgress } from '../types';
import { EMPTY_WEEKLY_TOPIC_PROGRESS } from '../types';

const DEFAULT_PROGRESS: ProgressState = {
  practisedDays: [],
  favourites: [],
  completedScenarios: [],
  completedConversations: [],
  listenCorrect: 0,
  speakDone: 0,
  builderDone: 0,
  completedGrammarTopics: [],
  weeklyTopics: {},
  dictionaryWordsSeen: [],
};

function todayStr(): string {
  return toLocalDateStr(new Date());
}

/** Format a Date as YYYY-MM-DD in the user's local timezone. */
function toLocalDateStr(d: Date): string {
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 10);
}

function normalizeProgress(raw: ProgressState): ProgressState {
  return {
    ...DEFAULT_PROGRESS,
    ...raw,
    practisedDays: raw.practisedDays ?? [],
    favourites: raw.favourites ?? [],
    completedScenarios: raw.completedScenarios ?? [],
    completedConversations: raw.completedConversations ?? [],
    completedGrammarTopics: raw.completedGrammarTopics ?? [],
    weeklyTopics: raw.weeklyTopics ?? {},
    dictionaryWordsSeen: raw.dictionaryWordsSeen ?? [],
  };
}

interface ProgressCtx {
  progress: ProgressState;
  markPractisedToday: () => void;
  toggleFavourite: (id: string) => void;
  isFavourite: (id: string) => boolean;
  /** @deprecated Scenarios removed — kept for localStorage compatibility */
  markScenarioCompleted: (id: ScenarioId) => void;
  markConversationCompleted: (id: string) => void;
  addListenCorrect: (n?: number) => void;
  addSpeakDone: (n?: number) => void;
  addBuilderDone: (n?: number) => void;
  markGrammarTopicCompleted: (id: string) => void;
  updateWeeklyTopicProgress: (topicId: string, patch: Partial<WeeklyTopicProgress>) => void;
  getWeeklyTopicProgress: (topicId: string) => WeeklyTopicProgress;
  markDictionaryWordSeen: (entryId: string) => void;
  resetProgress: () => void;
}

const Ctx = createContext<ProgressCtx | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [rawProgress, setProgress] = useLocalStorage<ProgressState>('rcd-progress', DEFAULT_PROGRESS);
  const progress = normalizeProgress(rawProgress);

  const persist = useCallback(
    (updater: (p: ProgressState) => ProgressState) => {
      setProgress((p) => updater(normalizeProgress(p)));
    },
    [setProgress]
  );

  const markPractisedToday = useCallback(() => {
    const today = todayStr();
    persist((p) => (p.practisedDays.includes(today) ? p : { ...p, practisedDays: [...p.practisedDays, today].sort() }));
  }, [persist]);

  const toggleFavourite = useCallback(
    (id: string) => {
      persist((p) => ({
        ...p,
        favourites: p.favourites.includes(id) ? p.favourites.filter((f) => f !== id) : [...p.favourites, id],
      }));
    },
    [persist]
  );

  const isFavourite = useCallback((id: string) => progress.favourites.includes(id), [progress.favourites]);

  const markScenarioCompleted = useCallback(
    (id: ScenarioId) => {
      persist((p) => (p.completedScenarios.includes(id) ? p : { ...p, completedScenarios: [...p.completedScenarios, id] }));
    },
    [persist]
  );

  const markConversationCompleted = useCallback(
    (id: string) => {
      persist((p) => (p.completedConversations.includes(id) ? p : { ...p, completedConversations: [...p.completedConversations, id] }));
    },
    [persist]
  );

  const addListenCorrect = useCallback((n = 1) => persist((p) => ({ ...p, listenCorrect: p.listenCorrect + n })), [persist]);
  const addSpeakDone = useCallback((n = 1) => persist((p) => ({ ...p, speakDone: p.speakDone + n })), [persist]);
  const addBuilderDone = useCallback((n = 1) => persist((p) => ({ ...p, builderDone: p.builderDone + n })), [persist]);

  const markGrammarTopicCompleted = useCallback(
    (id: string) => {
      persist((p) =>
        p.completedGrammarTopics.includes(id) ? p : { ...p, completedGrammarTopics: [...p.completedGrammarTopics, id] }
      );
    },
    [persist]
  );

  const markDictionaryWordSeen = useCallback(
    (entryId: string) => {
      persist((p) =>
        p.dictionaryWordsSeen.includes(entryId) ? p : { ...p, dictionaryWordsSeen: [...p.dictionaryWordsSeen, entryId] }
      );
    },
    [persist]
  );

  const updateWeeklyTopicProgress = useCallback(
    (topicId: string, patch: Partial<WeeklyTopicProgress>) => {
      persist((p) => {
        const current = p.weeklyTopics?.[topicId] ?? { ...EMPTY_WEEKLY_TOPIC_PROGRESS };
        return {
          ...p,
          weeklyTopics: {
            ...(p.weeklyTopics ?? {}),
            [topicId]: { ...current, ...patch },
          },
        };
      });
    },
    [persist]
  );

  const getWeeklyTopicProgress = useCallback(
    (topicId: string) => progress.weeklyTopics?.[topicId] ?? { ...EMPTY_WEEKLY_TOPIC_PROGRESS },
    [progress.weeklyTopics]
  );

  const resetProgress = useCallback(() => setProgress(DEFAULT_PROGRESS), [setProgress]);

  return (
    <Ctx.Provider
      value={{
        progress,
        markPractisedToday,
        toggleFavourite,
        isFavourite,
        markScenarioCompleted,
        markConversationCompleted,
        addListenCorrect,
        addSpeakDone,
        addBuilderDone,
        markGrammarTopicCompleted,
        updateWeeklyTopicProgress,
        getWeeklyTopicProgress,
        markDictionaryWordSeen,
        resetProgress,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}

export { todayStr, toLocalDateStr };
