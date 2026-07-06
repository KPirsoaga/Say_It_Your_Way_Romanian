import type { ReviewCatalogItem, ReviewDecision, ReviewStatus } from '../../types';
import { encodePackageToQrStrings } from './chunking';
import type { ReviewExportItem, ReviewExportPayload, ReviewResponseItem, ReviewResponsePayload } from './types';

export function buildReviewExportItems(
  items: ReviewCatalogItem[],
  getStatus: (id: string) => ReviewStatus,
  decisions: Record<string, ReviewDecision>,
  manualTimestamps: Record<string, string>
): ReviewExportItem[] {
  return items.map((item) => ({
    id: item.id,
    ro: item.ro,
    en: item.en,
    contentArea: item.contentArea,
    reviewReason: item.reviewReason,
    learnerNote: item.teacherNotes,
    status: getStatus(item.id),
    timestamp: manualTimestamps[item.id] ?? decisions[item.id]?.updatedAt ?? new Date().toISOString(),
    contextLabel: item.contextLabel,
  }));
}

export function encodeReviewExport(items: ReviewExportItem[]): string[] {
  const payload: ReviewExportPayload = { items };
  return encodePackageToQrStrings('review-export', payload);
}

export function encodeReviewResponse(items: ReviewResponseItem[]): string[] {
  const payload: ReviewResponsePayload = { items };
  return encodePackageToQrStrings('review-response', payload);
}

export function parseReviewExportPayload(items: unknown[]): ReviewExportItem[] {
  return items as ReviewExportItem[];
}

export function parseReviewResponsePayload(items: unknown[]): ReviewResponseItem[] {
  return items as ReviewResponseItem[];
}
