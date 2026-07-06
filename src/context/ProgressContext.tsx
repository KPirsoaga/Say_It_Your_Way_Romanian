import { createContext, useContext, useCallback, type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { ProgressState, ScenarioId } from '../types';

const DEFAULT_PROGRESS: ProgressState = {
  practisedDays: [],
  favourites: [],
  completedScenarios: [],
  completedConversations: [],
  listenCorrect: 0,
  speakDone: 0,
  builderDone: 0,
};

function todayStr(): string {
  return toLocalDateStr(new Date());
}

/** Format a Date as YYYY-MM-DD in the user's local timezone. */
function toLocalDateStr(d: Date): string {
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 10);
}

interface ProgressCtx {
  progress: ProgressState;
  markPractisedToday: () => void;
  toggleFavourite: (id: string) => void;
  isFavourite: (id: string) => boolean;
  markScenarioCompleted: (id: ScenarioId) => void;
  markConversationCompleted: (id: string) => void;
  addListenCorrect: (n?: number) => void;
  addSpeakDone: (n?: number) => void;
  addBuilderDone: (n?: number) => void;
  resetProgress: () => void;
}

const Ctx = createContext<ProgressCtx | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useLocalStorage<ProgressState>('rcd-progress', DEFAULT_PROGRESS);

  const markPractisedToday = useCallback(() => {
    const today = todayStr();
    setProgress((p) => (p.practisedDays.includes(today) ? p : { ...p, practisedDays: [...p.practisedDays, today].sort() }));
  }, [setProgress]);

  const toggleFavourite = useCallback(
    (id: string) => {
      setProgress((p) => ({
        ...p,
        favourites: p.favourites.includes(id) ? p.favourites.filter((f) => f !== id) : [...p.favourites, id],
      }));
    },
    [setProgress]
  );

  const isFavourite = useCallback((id: string) => progress.favourites.includes(id), [progress.favourites]);

  const markScenarioCompleted = useCallback(
    (id: ScenarioId) => {
      setProgress((p) => (p.completedScenarios.includes(id) ? p : { ...p, completedScenarios: [...p.completedScenarios, id] }));
    },
    [setProgress]
  );

  const markConversationCompleted = useCallback(
    (id: string) => {
      setProgress((p) => (p.completedConversations.includes(id) ? p : { ...p, completedConversations: [...p.completedConversations, id] }));
    },
    [setProgress]
  );

  const addListenCorrect = useCallback((n = 1) => setProgress((p) => ({ ...p, listenCorrect: p.listenCorrect + n })), [setProgress]);
  const addSpeakDone = useCallback((n = 1) => setProgress((p) => ({ ...p, speakDone: p.speakDone + n })), [setProgress]);
  const addBuilderDone = useCallback((n = 1) => setProgress((p) => ({ ...p, builderDone: p.builderDone + n })), [setProgress]);

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
