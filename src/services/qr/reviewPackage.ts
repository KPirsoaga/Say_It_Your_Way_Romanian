import type { ReviewCatalogItem, ReviewDecision, ReviewStatus } from '../../types';
import { encodePackageToQrStrings } from './chunking';
import type { ReviewExportItem, ReviewResponseItem } from './types';

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

function toExportRow(item: ReviewExportItem): unknown[] {
  return [
    item.id,
    item.ro,
    item.en,
    item.contentArea,
    item.reviewReason,
    item.status,
    item.learnerNote ?? '',
    item.timestamp,
    item.contextLabel ?? '',
  ];
}

function fromExportRow(row: unknown): ReviewExportItem {
  if (!Array.isArray(row)) return row as ReviewExportItem;
  const [id, ro, en, contentArea, reviewReason, status, learnerNote, timestamp, contextLabel] = row as string[];
  return {
    id,
    ro,
    en,
    contentArea: contentArea as ReviewExportItem['contentArea'],
    reviewReason,
    status: status as ReviewStatus,
    learnerNote: learnerNote || undefined,
    timestamp,
    contextLabel: contextLabel || undefined,
  };
}

function toResponseRow(item: ReviewResponseItem): unknown[] {
  return [
    item.id,
    item.status,
    item.teacherNotes ?? '',
    item.correctedRo ?? '',
    item.correctedEn ?? '',
    item.pronunciationNotes ?? '',
    item.generalComments ?? '',
  ];
}

function fromResponseRow(row: unknown): ReviewResponseItem {
  if (!Array.isArray(row)) return row as ReviewResponseItem;
  const [id, status, teacherNotes, correctedRo, correctedEn, pronunciationNotes, generalComments] = row as string[];
  return {
    id,
    status: status as ReviewStatus,
    teacherNotes: teacherNotes || undefined,
    correctedRo: correctedRo || undefined,
    correctedEn: correctedEn || undefined,
    pronunciationNotes: pronunciationNotes || undefined,
    generalComments: generalComments || undefined,
  };
}

export function encodeReviewExport(items: ReviewExportItem[]): string[] {
  return encodePackageToQrStrings('review-export', { items: items.map(toExportRow) });
}

export function encodeReviewResponse(items: ReviewResponseItem[]): string[] {
  return encodePackageToQrStrings('review-response', { items: items.map(toResponseRow) });
}

export function parseReviewExportPayload(items: unknown[]): ReviewExportItem[] {
  return items.map(fromExportRow);
}

export function parseReviewResponsePayload(items: unknown[]): ReviewResponseItem[] {
  return items.map(fromResponseRow);
}
