import { createContext, useContext, useCallback, useMemo, type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { collectReviewItems } from '../content/review/collectReviewItems';
import type { ReviewCatalogItem, ReviewDecision, ReviewState, ReviewStatus, ManualReviewFlag } from '../types';
import type { FlagReviewTarget } from '../content/review/reviewIds';
import type { ReviewResponseItem } from '../services/qr/types';

const DEFAULT_REVIEW: ReviewState = { decisions: {}, manualFlags: {} };

function normalizeReviewState(raw: ReviewState): ReviewState {
  return {
    decisions: raw.decisions ?? {},
    manualFlags: raw.manualFlags ?? {},
  };
}

function manualToCatalog(flag: ManualReviewFlag): ReviewCatalogItem {
  return {
    id: flag.id,
    contentArea: flag.contentArea,
    ro: flag.ro,
    en: flag.en,
    reviewReason: flag.reviewReason,
    suggestedBy: 'Flagged by me',
    teacherNotes: flag.userNote,
    contextLabel: flag.contextLabel,
    flaggedByUser: true,
  };
}

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
  flagForReview: (target: FlagReviewTarget & { reviewReason: string; userNote?: string }) => void;
  isManuallyFlagged: (id: string) => boolean;
  counts: ReviewCounts;
  itemsToReview: ReviewCatalogItem[];
  itemsByStatus: (status: ReviewStatus | 'all' | 'active') => ReviewCatalogItem[];
  applyReviewResponse: (items: ReviewResponseItem[]) => number;
  manualFlags: Record<string, ManualReviewFlag>;
}

const Ctx = createContext<ReviewCtx | null>(null);

function nowIso(): string {
  return new Date().toISOString();
}

export function ReviewProvider({ children }: { children: ReactNode }) {
  const builtInCatalog = useMemo(() => collectReviewItems(), []);
  const [state, setState] = useLocalStorage<ReviewState>('rcd-review', DEFAULT_REVIEW);
  const normalized = useMemo(() => normalizeReviewState(state), [state]);

  const manualCatalog = useMemo(
    () => Object.values(normalized.manualFlags).map(manualToCatalog),
    [normalized.manualFlags]
  );

  const catalog = useMemo(() => {
    const byId = new Map<string, ReviewCatalogItem>();
    builtInCatalog.forEach((item) => byId.set(item.id, item));
    manualCatalog.forEach((item) => byId.set(item.id, item));
    return Array.from(byId.values());
  }, [builtInCatalog, manualCatalog]);

  const getEffectiveStatus = useCallback(
    (id: string): ReviewStatus => normalized.decisions[id]?.status ?? 'pending',
    [normalized.decisions]
  );

  const getDecisionNotes = useCallback(
    (id: string): string | undefined => normalized.decisions[id]?.teacherNotes,
    [normalized.decisions]
  );

  const saveDecision = useCallback(
    (
      id: string,
      status: ReviewStatus,
      fields?: {
        teacherNotes?: string;
        correctedRo?: string;
        correctedEn?: string;
        pronunciationNotes?: string;
        generalComments?: string;
      }
    ) => {
      setState((prev) => {
        const base = normalizeReviewState(prev);
        const prevDecision = base.decisions[id];
        const notes = fields?.teacherNotes?.trim();
        const combinedNotes = [notes, fields?.pronunciationNotes?.trim(), fields?.generalComments?.trim()]
          .filter(Boolean)
          .join(' · ') || undefined;
        return {
          ...base,
          decisions: {
            ...base.decisions,
            [id]: {
              status,
              teacherNotes: combinedNotes ?? prevDecision?.teacherNotes,
              correctedRo: fields?.correctedRo?.trim() || prevDecision?.correctedRo,
              correctedEn: fields?.correctedEn?.trim() || prevDecision?.correctedEn,
              pronunciationNotes: fields?.pronunciationNotes?.trim() || prevDecision?.pronunciationNotes,
              generalComments: fields?.generalComments?.trim() || prevDecision?.generalComments,
              updatedAt: nowIso(),
            },
          },
        };
      });
    },
    [setState]
  );

  const markApproved = useCallback(
    (id: string, teacherNotes?: string) => saveDecision(id, 'approved', { teacherNotes }),
    [saveDecision]
  );

  const markNeedsChanges = useCallback(
    (id: string, teacherNotes: string) => saveDecision(id, 'needs-changes', { teacherNotes }),
    [saveDecision]
  );

  const resetItem = useCallback(
    (id: string) => {
      setState((prev) => {
        const base = normalizeReviewState(prev);
        const next = { ...base.decisions };
        delete next[id];
        return { ...base, decisions: next };
      });
    },
    [setState]
  );

  const flagForReview = useCallback(
    (target: FlagReviewTarget & { reviewReason: string; userNote?: string }) => {
      setState((prev) => {
        const base = normalizeReviewState(prev);
        const existing = base.manualFlags[target.id];
        const entry: ManualReviewFlag = {
          id: target.id,
          contentArea: target.contentArea,
          ro: target.ro,
          en: target.en,
          reviewReason: target.reviewReason,
          contextLabel: target.contextLabel,
          flaggedAt: nowIso(),
          userNote: target.userNote ?? existing?.userNote,
        };
        return {
          ...base,
          manualFlags: { ...base.manualFlags, [target.id]: entry },
          decisions: {
            ...base.decisions,
            [target.id]: { status: 'pending', updatedAt: nowIso() },
          },
        };
      });
    },
    [setState]
  );

  const isManuallyFlagged = useCallback(
    (id: string) => id in normalized.manualFlags,
    [normalized.manualFlags]
  );

  const counts = useMemo((): ReviewCounts => {
    let pending = 0;
    let approved = 0;
    let needsChanges = 0;
    catalog.forEach((item) => {
      const status = normalized.decisions[item.id]?.status ?? 'pending';
      if (status === 'pending') pending += 1;
      else if (status === 'approved') approved += 1;
      else needsChanges += 1;
    });
    return { pending, approved, needsChanges, total: catalog.length };
  }, [catalog, normalized.decisions]);

  const itemsToReview = useMemo(
    () =>
      catalog.filter((item) => {
        const status = normalized.decisions[item.id]?.status ?? 'pending';
        return status === 'pending' || status === 'needs-changes';
      }),
    [catalog, normalized.decisions]
  );

  const itemsByStatus = useCallback(
    (filter: ReviewStatus | 'all' | 'active'): ReviewCatalogItem[] => {
      if (filter === 'all') return catalog;
      if (filter === 'active') return itemsToReview;
      return catalog.filter((item) => (normalized.decisions[item.id]?.status ?? 'pending') === filter);
    },
    [catalog, itemsToReview, normalized.decisions]
  );

  const applyReviewResponse = useCallback(
    (items: ReviewResponseItem[]) => {
      setState((prev) => {
        const base = normalizeReviewState(prev);
        const nextDecisions = { ...base.decisions };
        items.forEach((item) => {
          const existing = nextDecisions[item.id];
          const notes = [item.teacherNotes, item.pronunciationNotes, item.generalComments]
            .filter(Boolean)
            .join(' · ') || undefined;
          nextDecisions[item.id] = {
            status: item.status,
            teacherNotes: notes ?? existing?.teacherNotes,
            correctedRo: item.correctedRo?.trim() || existing?.correctedRo,
            correctedEn: item.correctedEn?.trim() || existing?.correctedEn,
            pronunciationNotes: item.pronunciationNotes?.trim() || existing?.pronunciationNotes,
            generalComments: item.generalComments?.trim() || existing?.generalComments,
            updatedAt: nowIso(),
          };
        });
        return { ...base, decisions: nextDecisions };
      });
      return items.length;
    },
    [setState]
  );

  return (
    <Ctx.Provider
      value={{
        catalog,
        decisions: normalized.decisions,
        getEffectiveStatus,
        getDecisionNotes,
        markApproved,
        markNeedsChanges,
        resetItem,
        flagForReview,
        isManuallyFlagged,
        counts,
        itemsToReview,
        itemsByStatus,
        applyReviewResponse,
        manualFlags: normalized.manualFlags,
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
