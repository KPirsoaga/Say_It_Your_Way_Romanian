import { createContext, useContext, useCallback, useMemo, type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { collectReviewItems } from '../content/review/collectReviewItems';
import type { ReviewCatalogItem, ReviewDecision, ReviewState, ReviewStatus } from '../types';

const DEFAULT_REVIEW: ReviewState = { decisions: {} };

export interface ReviewCounts {
  pending: number;
  approved: number;
  needsChanges: number;
  total: number;
}

interface ReviewCtx {
  catalog: ReviewCatalogItem[];
  decisions: Record<string, ReviewDecision>;
  getEffectiveStatus: (id: string) => ReviewStatus;
  getDecisionNotes: (id: string) => string | undefined;
  markApproved: (id: string, teacherNotes?: string) => void;
  markNeedsChanges: (id: string, teacherNotes: string) => void;
  resetItem: (id: string) => void;
  counts: ReviewCounts;
  itemsToReview: ReviewCatalogItem[];
  itemsByStatus: (status: ReviewStatus | 'all' | 'active') => ReviewCatalogItem[];
}

const Ctx = createContext<ReviewCtx | null>(null);

function nowIso(): string {
  return new Date().toISOString();
}

export function ReviewProvider({ children }: { children: ReactNode }) {
  const catalog = useMemo(() => collectReviewItems(), []);
  const [state, setState] = useLocalStorage<ReviewState>('rcd-review', DEFAULT_REVIEW);

  const getEffectiveStatus = useCallback(
    (id: string): ReviewStatus => state.decisions[id]?.status ?? 'pending',
    [state.decisions]
  );

  const getDecisionNotes = useCallback(
    (id: string): string | undefined => state.decisions[id]?.teacherNotes,
    [state.decisions]
  );

  const saveDecision = useCallback(
    (id: string, status: ReviewStatus, teacherNotes?: string) => {
      setState((prev) => ({
        decisions: {
          ...prev.decisions,
          [id]: {
            status,
            teacherNotes: teacherNotes?.trim() || undefined,
            updatedAt: nowIso(),
          },
        },
      }));
    },
    [setState]
  );

  const markApproved = useCallback(
    (id: string, teacherNotes?: string) => saveDecision(id, 'approved', teacherNotes),
    [saveDecision]
  );

  const markNeedsChanges = useCallback(
    (id: string, teacherNotes: string) => saveDecision(id, 'needs-changes', teacherNotes),
    [saveDecision]
  );

  const resetItem = useCallback(
    (id: string) => {
      setState((prev) => {
        const next = { ...prev.decisions };
        delete next[id];
        return { decisions: next };
      });
    },
    [setState]
  );

  const counts = useMemo((): ReviewCounts => {
    let pending = 0;
    let approved = 0;
    let needsChanges = 0;
    catalog.forEach((item) => {
      const status = state.decisions[item.id]?.status ?? 'pending';
      if (status === 'pending') pending += 1;
      else if (status === 'approved') approved += 1;
      else needsChanges += 1;
    });
    return { pending, approved, needsChanges, total: catalog.length };
  }, [catalog, state.decisions]);

  const itemsToReview = useMemo(
    () => catalog.filter((item) => {
      const status = state.decisions[item.id]?.status ?? 'pending';
      return status === 'pending' || status === 'needs-changes';
    }),
    [catalog, state.decisions]
  );

  const itemsByStatus = useCallback(
    (filter: ReviewStatus | 'all' | 'active'): ReviewCatalogItem[] => {
      if (filter === 'all') return catalog;
      if (filter === 'active') return itemsToReview;
      return catalog.filter((item) => (state.decisions[item.id]?.status ?? 'pending') === filter);
    },
    [catalog, itemsToReview, state.decisions]
  );

  return (
    <Ctx.Provider
      value={{
        catalog,
        decisions: state.decisions,
        getEffectiveStatus,
        getDecisionNotes,
        markApproved,
        markNeedsChanges,
        resetItem,
        counts,
        itemsToReview,
        itemsByStatus,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useReview() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useReview must be used within ReviewProvider');
  return ctx;
}
