import type { ReviewCatalogItem, ReviewStatus } from '../../types';
import { encodePackageToQrStrings } from './chunking';
import type { ReviewExportItem, ReviewResponseItem } from './types';

function buildNote(item: ReviewCatalogItem): string | undefined {
  const parts: string[] = [];
  if (item.reviewReason?.trim()) parts.push(item.reviewReason.trim());
  if (item.teacherNotes?.trim()) parts.push(item.teacherNotes.trim());
  return parts.length > 0 ? parts.join(' — ') : undefined;
}

export function buildReviewExportItems(
  items: ReviewCatalogItem[],
  getStatus: (id: string) => ReviewStatus
): ReviewExportItem[] {
  return items.map((item) => {
    const row: ReviewExportItem = {
      id: item.id,
      area: item.contentArea,
      ro: item.ro,
      en: item.en,
      status: getStatus(item.id),
    };
    const note = buildNote(item);
    if (note) row.note = note;
    return row;
  });
}

function omitEmpty<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== '') out[key] = value;
  }
  return out as Partial<T>;
}

function toExportWire(item: ReviewExportItem): Record<string, string> {
  return omitEmpty({
    id: item.id,
    area: item.area,
    ro: item.ro,
    en: item.en,
    note: item.note,
    status: item.status,
  }) as Record<string, string>;
}

function fromExportWire(row: unknown): ReviewExportItem {
  if (Array.isArray(row)) return fromLegacyExportRow(row);
  if (!row || typeof row !== 'object') return row as ReviewExportItem;

  const obj = row as Record<string, unknown>;
  if ('area' in obj) {
    return omitEmpty({
      id: String(obj.id ?? ''),
      area: String(obj.area ?? ''),
      ro: String(obj.ro ?? ''),
      en: String(obj.en ?? ''),
      note: obj.note ? String(obj.note) : undefined,
      status: (obj.status ?? 'pending') as ReviewStatus,
    }) as ReviewExportItem;
  }

  return fromLegacyExportObject(obj);
}

function fromLegacyExportRow(row: unknown[]): ReviewExportItem {
  const [id, ro, en, contentArea, reviewReason, status, learnerNote] = row as string[];
  const noteParts = [reviewReason, learnerNote].filter((part) => part?.trim());
  return omitEmpty({
    id,
    area: contentArea,
    ro,
    en,
    note: noteParts.length > 0 ? noteParts.join(' — ') : undefined,
    status: (status ?? 'pending') as ReviewStatus,
  }) as ReviewExportItem;
}

function fromLegacyExportObject(obj: Record<string, unknown>): ReviewExportItem {
  const noteParts = [obj.reviewReason, obj.learnerNote].filter((part) => typeof part === 'string' && part.trim());
  return omitEmpty({
    id: String(obj.id ?? ''),
    area: String(obj.contentArea ?? obj.area ?? ''),
    ro: String(obj.ro ?? ''),
    en: String(obj.en ?? ''),
    note: noteParts.length > 0 ? noteParts.join(' — ') : obj.note ? String(obj.note) : undefined,
    status: (obj.status ?? 'pending') as ReviewStatus,
  }) as ReviewExportItem;
}

function toResponseWire(item: ReviewResponseItem): Record<string, string> {
  return omitEmpty({
    id: item.id,
    status: item.status,
    cro: item.cro,
    cen: item.cen,
    note: item.note,
    pron: item.pron,
  }) as Record<string, string>;
}

function fromResponseWire(row: unknown): ReviewResponseItem {
  if (Array.isArray(row)) return fromLegacyResponseRow(row);
  if (!row || typeof row !== 'object') return row as ReviewResponseItem;

  const obj = row as Record<string, unknown>;
  if ('cro' in obj || 'cen' in obj || ('note' in obj && !('teacherNotes' in obj))) {
    return omitEmpty({
      id: String(obj.id ?? ''),
      status: (obj.status ?? 'pending') as ReviewStatus,
      cro: obj.cro ? String(obj.cro) : undefined,
      cen: obj.cen ? String(obj.cen) : undefined,
      note: obj.note ? String(obj.note) : undefined,
      pron: obj.pron ? String(obj.pron) : undefined,
    }) as ReviewResponseItem;
  }

  return fromLegacyResponseObject(obj);
}

function fromLegacyResponseRow(row: unknown[]): ReviewResponseItem {
  const [id, status, teacherNotes, correctedRo, correctedEn, pronunciationNotes, generalComments] = row as string[];
  const noteParts = [teacherNotes, generalComments].filter((part) => part?.trim());
  return omitEmpty({
    id,
    status: (status ?? 'pending') as ReviewStatus,
    cro: correctedRo || undefined,
    cen: correctedEn || undefined,
    note: noteParts.length > 0 ? noteParts.join(' · ') : undefined,
    pron: pronunciationNotes || undefined,
  }) as ReviewResponseItem;
}

function fromLegacyResponseObject(obj: Record<string, unknown>): ReviewResponseItem {
  const noteParts = [obj.teacherNotes, obj.generalComments].filter((part) => typeof part === 'string' && part.trim());
  return omitEmpty({
    id: String(obj.id ?? ''),
    status: (obj.status ?? 'pending') as ReviewStatus,
    cro: obj.correctedRo ? String(obj.correctedRo) : obj.cro ? String(obj.cro) : undefined,
    cen: obj.correctedEn ? String(obj.correctedEn) : obj.cen ? String(obj.cen) : undefined,
    note: noteParts.length > 0 ? noteParts.join(' · ') : obj.note ? String(obj.note) : undefined,
    pron: obj.pronunciationNotes ? String(obj.pronunciationNotes) : obj.pron ? String(obj.pron) : undefined,
  }) as ReviewResponseItem;
}

export function encodeReviewExport(items: ReviewExportItem[]): string[] {
  return encodePackageToQrStrings('review-export', { items: items.map(toExportWire) });
}

export function encodeReviewResponse(items: ReviewResponseItem[]): string[] {
  return encodePackageToQrStrings('review-response', { items: items.map(toResponseWire) });
}

export function countReviewExportQrs(items: ReviewExportItem[]): number {
  return encodeReviewExport(items).length;
}

export function parseReviewExportPayload(items: unknown[]): ReviewExportItem[] {
  return items.map(fromExportWire);
}

export function parseReviewResponsePayload(items: unknown[]): ReviewResponseItem[] {
  return items.map(fromResponseWire);
}
